"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");

const mcpPath = path.resolve(__dirname, "..", "tools", "jiaren-canvas-mcp", "bin", "jiaren-canvas-mcp.cjs");

function startServer() {
  const calls = [];
  const server = http.createServer((request, response) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const bodyText = Buffer.concat(chunks).toString("utf8");
      const body = bodyText ? JSON.parse(bodyText) : null;
      calls.push({ method: request.method, path: request.url, auth: request.headers.authorization, body });
      const snapshot = {
        nodes: [{ id: "node-1", position: { x: 100, y: 80 }, width: 320 }],
        edges: [],
        assets: [],
        selectedNodeId: "node-1",
        selectedNode: { id: "node-1" },
      };
      let result;
      if (request.url === "/v1/snapshot") result = { ok: true, snapshot };
      else if (request.method === "POST" && request.url === "/v1/plans") result = { ok: true, plan: { id: "plan-1", status: "pending", ...(body || {}) } };
      else if (request.method === "GET" && request.url === "/v1/plans") result = { ok: true, plans: [{ id: "plan-1", status: "completed" }] };
      else if (request.method === "GET" && request.url === "/v1/receipts") result = { ok: true, receipts: [{ id: "receipt-1", planId: "plan-1", status: "completed", result: { snapshot: { nodes: [{ id: "private-image", data: { agentTransient: true, agentSource: "jiaren-codex", modelId: "gpt-image-2", modelAlias: "GPT Image 2", provider: "grsai" } }] } } }] };
      else result = { ok: false, error: "not found" };
      response.writeHead(result.ok ? 200 : 404, { "Content-Type": "application/json" });
      response.end(JSON.stringify(result));
    });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port, calls })));
}

function startMcp(dataRoot) {
  const child = spawn(process.execPath, [mcpPath], { env: { ...process.env, JIAREN_DATA_ROOT: dataRoot }, stdio: ["pipe", "pipe", "pipe"] });
  let buffer = "";
  const pending = [];
  child.stdout.on("data", (chunk) => {
    buffer += chunk.toString("utf8");
    for (;;) {
      const index = buffer.indexOf("\n");
      if (index < 0) break;
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      if (line && pending.length) pending.shift()(JSON.parse(line));
    }
  });
  return {
    child,
    send(message) { return new Promise((resolve) => { pending.push(resolve); child.stdin.write(`${JSON.stringify(message)}\n`); }); },
  };
}

test("Jiaren Canvas MCP exposes equivalent local canvas tools", async (t) => {
  const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), "jiaren-mcp-test-"));
  const { server, port, calls } = await startServer();
  t.after(() => { server.close(); fs.rmSync(dataRoot, { recursive: true, force: true }); });
  fs.writeFileSync(path.join(dataRoot, "agent-control-mcp.json"), JSON.stringify({ host: "127.0.0.1", port, token: "test-token-123456789012345678901234567890" }));
  const mcp = startMcp(dataRoot);
  t.after(() => mcp.child.kill());

  const initialized = await mcp.send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18" } });
  assert.equal(initialized.result.serverInfo.name, "jiaren-canvas");
  const tools = await mcp.send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
  assert.deepEqual(tools.result.tools.map((tool) => tool.name), [
    "jiaren_canvas_get_state",
    "jiaren_canvas_get_selection",
    "jiaren_canvas_apply_ops",
    "jiaren_canvas_export_snapshot",
    "jiaren_canvas_get_plan",
    "jiaren_canvas_list_receipts",
    "jiaren_canvas_wait_for_plan",
    "jiaren_canvas_create_text_node",
    "jiaren_canvas_create_text_nodes",
    "jiaren_canvas_create_svg",
    "jiaren_canvas_create_image_prompt_flow",
    "jiaren_canvas_create_generation_flow",
    "jiaren_canvas_create_node",
    "jiaren_canvas_generate_text",
    "jiaren_canvas_generate_image",
    "jiaren_canvas_generate_video",
    "jiaren_canvas_generate_audio",
    "jiaren_canvas_update_node",
    "jiaren_canvas_update_node_text",
    "jiaren_canvas_move_nodes",
    "jiaren_canvas_resize_node",
    "jiaren_canvas_delete_nodes",
    "jiaren_canvas_connect_nodes",
    "jiaren_canvas_select_node",
    "jiaren_canvas_set_viewport",
    "jiaren_canvas_run_node",
  ]);
  const directImageTool = tools.result.tools.find((tool) => tool.name === "jiaren_canvas_generate_image");
  assert.equal(Object.hasOwn(directImageTool.inputSchema.properties, "modelId"), false);
  const vectorTool = tools.result.tools.find((tool) => tool.name === "jiaren_canvas_create_svg");
  assert.equal(Object.hasOwn(vectorTool.inputSchema.properties, "modelId"), false);
  const resources = await mcp.send({ jsonrpc: "2.0", id: 30, method: "resources/list", params: {} });
  assert.deepEqual(resources.result.resources, []);

  const state = await mcp.send({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "jiaren_canvas_get_state", arguments: {} } });
  assert.match(state.result.content[0].text, /node-1/);
  const exported = await mcp.send({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "jiaren_canvas_export_snapshot", arguments: {} } });
  const exportedResult = JSON.parse(exported.result.content[0].text);
  assert.equal(exportedResult.format, "jiaren-canvas-snapshot/v1");
  assert.equal(exportedResult.summary.nodeCount, 1);
  const planStatus = await mcp.send({ jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "jiaren_canvas_get_plan", arguments: { planId: "plan-1" } } });
  const planStatusResult = JSON.parse(planStatus.result.content[0].text);
  assert.equal(planStatusResult.receipt.status, "completed");
  assert.equal(planStatusResult.receipt.result.snapshot.nodes[0].data.modelId, undefined);
  assert.equal(planStatusResult.receipt.result.snapshot.nodes[0].data.modelAlias, undefined);
  assert.equal(planStatusResult.receipt.result.snapshot.nodes[0].data.provider, undefined);
  assert.doesNotMatch(planStatus.result.content[0].text, /GPT Image|gpt-image|grsai/i);
  const receipts = await mcp.send({ jsonrpc: "2.0", id: 7, method: "tools/call", params: { name: "jiaren_canvas_list_receipts", arguments: { planId: "plan-1" } } });
  assert.equal(JSON.parse(receipts.result.content[0].text).receipts.length, 1);
  assert.doesNotMatch(receipts.result.content[0].text, /GPT Image|gpt-image|grsai/i);
  const waited = await mcp.send({ jsonrpc: "2.0", id: 8, method: "tools/call", params: { name: "jiaren_canvas_wait_for_plan", arguments: { planId: "plan-1", timeoutSeconds: 1 } } });
  assert.equal(JSON.parse(waited.result.content[0].text).timedOut, false);

  const flow = await mcp.send({ jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "jiaren_canvas_create_image_prompt_flow", arguments: { prompt: "一台绿色概念相机" } } });
  const flowResult = JSON.parse(flow.result.content[0].text);
  assert.equal(flowResult.approvalRequired, true);
  assert.equal(flowResult.plan.status, "pending");
  const planCall = calls.find((call) => call.method === "POST" && call.path === "/v1/plans" && call.body.operations.some((operation) => operation.kind === "generateImage"));
  assert.equal(planCall.auth, "Bearer test-token-123456789012345678901234567890");
  assert.deepEqual(planCall.body.operations.map((operation) => operation.type), ["node.add", "node.add", "edge.add"]);
  assert.equal(planCall.body.operations[0].kind, "textInput");
  assert.equal(planCall.body.operations[1].data.count, 1);

  const vector = await mcp.send({
    jsonrpc: "2.0",
    id: 9,
    method: "tools/call",
    params: {
      name: "jiaren_canvas_create_svg",
      arguments: {
        title: "Vector cat",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="40" fill="#b7ff2a"/></svg>',
        width: 480,
        height: 480,
      },
    },
  });
  assert.equal(JSON.parse(vector.result.content[0].text).approvalRequired, true);

  const toolCalls = [
    ["jiaren_canvas_create_text_nodes", { items: [{ content: "甲" }, { content: "乙" }], direction: "row" }],
    ["jiaren_canvas_create_node", { nodeType: "audio", prompt: "轻柔环境音乐" }],
    ["jiaren_canvas_generate_text", { prompt: "写一句标题" }],
    ["jiaren_canvas_generate_image", { prompt: "产品海报", count: 2, referenceNodeIds: ["node-1"] }],
    ["jiaren_canvas_generate_video", { prompt: "镜头缓慢推进" }],
    ["jiaren_canvas_generate_audio", { prompt: "雨夜环境音" }],
    ["jiaren_canvas_update_node", { nodeId: "node-1", patch: { status: "idle" } }],
    ["jiaren_canvas_update_node_text", { nodeId: "node-1", text: "新文案", title: "标题" }],
    ["jiaren_canvas_move_nodes", { items: [{ nodeId: "node-1", dx: 20, dy: 30 }] }],
    ["jiaren_canvas_resize_node", { nodeId: "node-1", width: 640, height: 480 }],
    ["jiaren_canvas_delete_nodes", { nodeIds: ["node-1"] }],
    ["jiaren_canvas_connect_nodes", { connections: [{ source: "node-1", target: "node-2", sourceHandle: "image" }] }],
    ["jiaren_canvas_select_node", { nodeId: "node-1" }],
    ["jiaren_canvas_set_viewport", { viewport: { x: 10, y: 20, zoom: 1.25 } }],
    ["jiaren_canvas_run_node", { nodeId: "node-1" }],
  ];
  let requestId = 10;
  for (const [name, argumentsValue] of toolCalls) {
    const response = await mcp.send({ jsonrpc: "2.0", id: requestId++, method: "tools/call", params: { name, arguments: argumentsValue } });
    const result = JSON.parse(response.result.content[0].text);
    assert.equal(result.approvalRequired, true, name);
    assert.equal(result.plan.status, "pending", name);
  }

  const plans = calls.filter((call) => call.method === "POST" && call.path === "/v1/plans").map((call) => call.body);
  const directKinds = plans.flatMap((plan) => plan.operations.filter((operation) => operation.type === "node.add").map((operation) => operation.kind));
  for (const kind of ["textInput", "imageInput", "llm", "generateImage", "sdVideo", "t8:audio"]) assert.ok(directKinds.includes(kind), kind);
  const vectorPlan = plans.find((plan) => plan.operations.some((operation) => operation.kind === "imageInput" && operation.data.vectorFormat === "svg"));
  assert.equal(vectorPlan.operations.length, 1);
  assert.match(vectorPlan.operations[0].data.imageSource, /^data:image\/svg\+xml/);
  assert.equal(vectorPlan.operations.some((operation) => operation.kind === "generateImage"), false);
  const imageGeneration = plans.find((plan) => plan.operations.some((operation) => operation.kind === "generateImage" && operation.data.count === 2));
  assert.deepEqual(imageGeneration.operations.map((operation) => operation.type), ["node.add", "edge.add", "run.node"]);
  assert.equal(imageGeneration.operations.filter((operation) => operation.kind === "textInput").length, 0);
  assert.equal(imageGeneration.operations[0].data.agentTransient, true);
  assert.equal(imageGeneration.operations[0].data.agentSource, "jiaren-codex");
  assert.equal(imageGeneration.operations[0].data.agentResultMode, "image-only");
  assert.equal(imageGeneration.operations[0].data.modelId, undefined);
  assert.equal(planCall.body.operations[1].data.agentTransient, undefined);
  const movePlan = plans.find((plan) => plan.title.startsWith("移动"));
  assert.deepEqual(movePlan.operations[0].patch.position, { x: 120, y: 110 });
  const viewportPlan = plans.find((plan) => plan.operations.some((operation) => operation.type === "viewport.set"));
  assert.deepEqual(viewportPlan.operations[0].viewport, { x: 10, y: 20, zoom: 1.25 });
});

test("canvas runtime uses React Flow state and propagates approved connections", () => {
  const runtimePath = path.resolve(__dirname, "..", "dist", "assets", "MainCanvasFlow-BbsMxxcM.js");
  const source = fs.readFileSync(runtimePath, "utf8");
  assert.match(source, /setViewport: jiarenSetViewport/);
  assert.match(source, /getViewport: jiarenGetViewport/);
  assert.match(source, /await jiarenSetViewport\(\{ x, y, zoom \}/);
  assert.doesNotMatch(source, /reactFlowViewport\.style\.transform/);
  assert.match(source, /requestedKind === "text" \? "textInput"/);
  assert.match(source, /if \(sourceNode && targetNode\) _t\(sourceNode, target, targetNode\.data\.kind\)/);
  assert.match(source, /window\.setTimeout\(\(\) => \{/);
  assert.match(source, /agentTransient === true/);
  assert.match(source, /jiarenFinalizeTransientImages/);
  assert.match(source, /jiarenRemoveTransientExecutor/);
  assert.match(source, /const failureMessage = error instanceof Error/);
  assert.match(source, /agentExecutionStarted === true/);
  assert.match(source, /S\(M, \{ agentExecutionStarted: true \}\)/);
  assert.match(source, /kind: "imageInput"/);
  assert.match(source, /__JIAREN_AGENT_IMAGE_RUN_QUEUE__/);
  assert.match(source, /nodes: e\.filter\(\(node\) => node\.data\?\.agentTransient !== true\)/);
  assert.match(source, /\[media omitted:\$\{item\.length\}\]/);
  assert.match(source, /window\.requestIdleCallback\(syncSnapshot, \{ timeout: 1200 \}\)/);
  assert.match(source, /\}, 650\);/);
  assert.doesNotMatch(source, /control\.updateSnapshot\(bridge\.getSnapshot\(\)\)[\s\S]{0,80}\}, 240\)/);
});
