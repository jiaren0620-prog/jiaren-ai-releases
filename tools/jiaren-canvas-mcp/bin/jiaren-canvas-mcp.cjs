#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline");

const VERSION = "1.1.2";
const JSONRPC_VERSION = "2.0";

const TOOLS = Object.freeze([
  {
    name: "jiaren_canvas_get_state",
    description: "读取当前 Jiaren AI 画布快照。返回节点、连线、素材和视口选区；敏感凭据由 Jiaren AI 在返回前移除。",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "jiaren_canvas_get_selection",
    description: "读取当前 Jiaren AI 画布选中的节点或素材。",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "jiaren_canvas_apply_ops",
    description: "向 Jiaren AI 提交一组画布操作。写操作不会直接执行，而会在 Jiaren AI 中显示审批卡片，由用户确认后执行。",
    inputSchema: {
      type: "object",
      required: ["operations"],
      properties: {
        title: { type: "string", maxLength: 120 },
        summary: { type: "string", maxLength: 500 },
        operations: {
          type: "array",
          minItems: 1,
          maxItems: 50,
          items: {
            type: "object",
            required: ["type"],
            properties: {
              type: { type: "string", enum: ["node.add", "node.update", "node.delete", "node.select", "viewport.set", "edge.add", "edge.remove", "asset.add", "run.node"] },
            },
            additionalProperties: true,
          },
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "jiaren_canvas_export_snapshot",
    description: "导出当前 Jiaren AI 画布的结构化快照，用于理解布局与节点关系。",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "jiaren_canvas_get_plan",
    description: "读取指定画布审批计划的最新状态和对应执行回执。",
    inputSchema: {
      type: "object",
      required: ["planId"],
      properties: { planId: { type: "string", minLength: 1, maxLength: 200 } },
      additionalProperties: false,
    },
  },
  {
    name: "jiaren_canvas_list_receipts",
    description: "读取最近的画布执行回执，可按计划 ID 筛选。",
    inputSchema: {
      type: "object",
      properties: {
        planId: { type: "string", maxLength: 200 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "jiaren_canvas_wait_for_plan",
    description: "等待指定画布计划被批准并执行，返回完成、失败、拒绝或超时状态。适合在提交写操作后确认真实执行结果。",
    inputSchema: {
      type: "object",
      required: ["planId"],
      properties: {
        planId: { type: "string", minLength: 1, maxLength: 200 },
        timeoutSeconds: { type: "integer", minimum: 1, maximum: 75, default: 60 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "jiaren_canvas_create_text_node",
    description: "在 Jiaren AI 中提交创建文本节点的审批计划。",
    inputSchema: {
      type: "object",
      required: ["content"],
      properties: {
        title: { type: "string", maxLength: 120 },
        content: { type: "string", minLength: 1, maxLength: 60000 },
        x: { type: "number" },
        y: { type: "number" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "jiaren_canvas_create_text_nodes",
    description: "批量提交创建 Jiaren AI 文本节点的审批计划。",
    inputSchema: {
      type: "object",
      required: ["items"],
      properties: {
        items: { type: "array", minItems: 1, maxItems: 50, items: { type: "object", required: ["content"], properties: { title: { type: "string" }, content: { type: "string" } }, additionalProperties: false } },
        x: { type: "number" }, y: { type: "number" }, gap: { type: "number" }, direction: { type: "string", enum: ["row", "column"] },
      },
      additionalProperties: false,
    },
  },
  {
    name: "jiaren_canvas_create_svg",
    description: "Create an SVG/vector image directly on the Jiaren canvas without calling an image API. Use only when the user explicitly asks for SVG, vector artwork, an icon, a logo, or editable line art. Never use this for ordinary product main images, e-commerce images, posters, advertising images, photorealistic images, or PNG/JPG/WebP output; those must use jiaren_canvas_generate_image.",
    inputSchema: {
      type: "object",
      required: ["svg"],
      properties: {
        svg: { type: "string", minLength: 20, maxLength: 160000 },
        title: { type: "string", maxLength: 120 },
        x: { type: "number" },
        y: { type: "number" },
        width: { type: "number", minimum: 120, maximum: 1600 },
        height: { type: "number", minimum: 80, maximum: 1600 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "jiaren_canvas_create_image_prompt_flow",
    description: "提交一个可继续编辑和连线的 Jiaren AI 文本到图像生成流程。默认只生成 1 张图。",
    inputSchema: {
      type: "object",
      required: ["prompt"],
      properties: {
        prompt: { type: "string", minLength: 1, maxLength: 60000 },
        title: { type: "string", maxLength: 120 },
        modelId: { type: "string", maxLength: 200 },
        x: { type: "number" },
        y: { type: "number" },
        runAfterApproval: { type: "boolean", default: false },
      },
      additionalProperties: false,
    },
  },
  {
    name: "jiaren_canvas_create_generation_flow",
    description: "创建 Jiaren AI 文本、图片、视频或音频生成流程。视频使用现有一级画布视频生成节点。",
    inputSchema: {
      type: "object",
      required: ["prompt", "mode"],
      properties: {
        prompt: { type: "string", minLength: 1, maxLength: 60000 }, mode: { type: "string", enum: ["text", "image", "video", "audio"] }, title: { type: "string" }, modelId: { type: "string" }, x: { type: "number" }, y: { type: "number" }, count: { type: "integer", minimum: 1, maximum: 8 }, runAfterApproval: { type: "boolean" }, referenceNodeIds: { type: "array", maxItems: 20, items: { type: "string" } },
      },
      additionalProperties: false,
    },
  },
  {
    name: "jiaren_canvas_create_node",
    description: "创建 Jiaren AI 通用文字、LLM、图像、视频或音频节点，等待用户审批。",
    inputSchema: {
      type: "object",
      required: ["nodeType"],
      properties: {
        nodeType: { type: "string", enum: ["text", "llm", "image", "video", "audio"] },
        title: { type: "string" }, prompt: { type: "string" }, modelId: { type: "string" }, x: { type: "number" }, y: { type: "number" }, width: { type: "number" }, height: { type: "number" }, data: { type: "object", additionalProperties: true },
      },
      additionalProperties: false,
    },
  },
  { name: "jiaren_canvas_generate_text", description: "直接创建并运行一个 Jiaren AI 文字生成节点；不会额外创建提示词节点。", inputSchema: { type: "object", required: ["prompt"], properties: { prompt: { type: "string" }, title: { type: "string" }, modelId: { type: "string" }, x: { type: "number" }, y: { type: "number" }, referenceNodeIds: { type: "array", items: { type: "string" } } }, additionalProperties: false } },
  { name: "jiaren_canvas_generate_image", description: "提交一个 Jiaren 后台栅格图片任务；适用于普通产品主图、电商主图、海报、广告图、写实图、PNG/JPG/WebP 和图像编辑。Codex 只提供创作意图，不能选择或返回底层图片模型，画布最终只显示真实生成图片。必须等待终态回执并验证最终 imageInput 节点；queued 仅代表派发，不代表完成。", inputSchema: { type: "object", required: ["prompt"], properties: { prompt: { type: "string" }, title: { type: "string" }, x: { type: "number" }, y: { type: "number" }, count: { type: "integer", minimum: 1, maximum: 8 }, referenceNodeIds: { type: "array", items: { type: "string" } } }, additionalProperties: false } },
  { name: "jiaren_canvas_generate_video", description: "直接创建并运行一个 Jiaren AI 一级视频生成节点；不会额外创建提示词节点。", inputSchema: { type: "object", required: ["prompt"], properties: { prompt: { type: "string" }, title: { type: "string" }, modelId: { type: "string" }, x: { type: "number" }, y: { type: "number" }, referenceNodeIds: { type: "array", items: { type: "string" } } }, additionalProperties: false } },
  { name: "jiaren_canvas_generate_audio", description: "直接创建并运行一个 Jiaren AI 音频生成节点；不会额外创建提示词节点。", inputSchema: { type: "object", required: ["prompt"], properties: { prompt: { type: "string" }, title: { type: "string" }, modelId: { type: "string" }, x: { type: "number" }, y: { type: "number" }, referenceNodeIds: { type: "array", items: { type: "string" } } }, additionalProperties: false } },
  { name: "jiaren_canvas_update_node", description: "更新指定 Jiaren AI 节点的数据、位置或尺寸，等待用户审批。", inputSchema: { type: "object", required: ["nodeId", "patch"], properties: { nodeId: { type: "string" }, patch: { type: "object", additionalProperties: true } }, additionalProperties: false } },
  { name: "jiaren_canvas_update_node_text", description: "更新 Jiaren AI 文字节点内容与标题，等待用户审批。", inputSchema: { type: "object", required: ["nodeId", "text"], properties: { nodeId: { type: "string" }, text: { type: "string" }, title: { type: "string" } }, additionalProperties: false } },
  { name: "jiaren_canvas_move_nodes", description: "批量移动 Jiaren AI 节点，支持绝对坐标或相对偏移，等待用户审批。", inputSchema: { type: "object", required: ["items"], properties: { items: { type: "array", minItems: 1, maxItems: 50, items: { type: "object", required: ["nodeId"], properties: { nodeId: { type: "string" }, x: { type: "number" }, y: { type: "number" }, dx: { type: "number" }, dy: { type: "number" } }, additionalProperties: false } } }, additionalProperties: false } },
  { name: "jiaren_canvas_resize_node", description: "调整 Jiaren AI 节点尺寸，等待用户审批。", inputSchema: { type: "object", required: ["nodeId", "width", "height"], properties: { nodeId: { type: "string" }, width: { type: "number", minimum: 120 }, height: { type: "number", minimum: 80 } }, additionalProperties: false } },
  { name: "jiaren_canvas_delete_nodes", description: "删除一个或多个 Jiaren AI 节点及其相关连线，等待用户审批。", inputSchema: { type: "object", required: ["nodeIds"], properties: { nodeIds: { type: "array", minItems: 1, maxItems: 50, items: { type: "string" } } }, additionalProperties: false } },
  { name: "jiaren_canvas_connect_nodes", description: "批量连接 Jiaren AI 节点，等待用户审批。", inputSchema: { type: "object", required: ["connections"], properties: { connections: { type: "array", minItems: 1, maxItems: 50, items: { type: "object", required: ["source", "target"], properties: { source: { type: "string" }, target: { type: "string" }, sourceHandle: { type: "string" }, targetHandle: { type: "string" }, edgeId: { type: "string" } }, additionalProperties: false } } }, additionalProperties: false } },
  { name: "jiaren_canvas_select_node", description: "选中或取消选中 Jiaren AI 节点，等待用户审批。", inputSchema: { type: "object", properties: { nodeId: { type: ["string", "null"] } }, additionalProperties: false } },
  { name: "jiaren_canvas_set_viewport", description: "调整 Jiaren AI 画布视口位置和缩放，等待用户审批。", inputSchema: { type: "object", required: ["viewport"], properties: { viewport: { type: "object", required: ["x", "y", "zoom"], properties: { x: { type: "number" }, y: { type: "number" }, zoom: { type: "number", minimum: 0.1, maximum: 8 } }, additionalProperties: false } }, additionalProperties: false } },
  { name: "jiaren_canvas_run_node", description: "运行指定的 Jiaren AI 生成节点，等待用户审批。", inputSchema: { type: "object", required: ["nodeId"], properties: { nodeId: { type: "string" } }, additionalProperties: false } },
]);

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function textContent(value, isError = false) {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }], ...(isError ? { isError: true } : {}) };
}

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch { return null; }
}

function candidateDataRoots() {
  const roots = [];
  const explicit = process.env.JIAREN_DATA_ROOT;
  if (explicit) roots.push(path.resolve(explicit));
  let current = path.resolve(__dirname);
  for (let index = 0; index < 10; index += 1) {
    roots.push(path.join(current, ".jiaren"));
    current = path.dirname(current);
  }
  if (process.env.PORTABLE_EXECUTABLE_DIR) roots.push(path.join(process.env.PORTABLE_EXECUTABLE_DIR, ".jiaren"));
  roots.push(path.join(process.cwd(), ".jiaren"));
  if (process.env.APPDATA) roots.push(path.join(process.env.APPDATA, "jiaren-ai-canvas", ".jiaren"));
  roots.push(path.join(process.env.LOCALAPPDATA || os.homedir(), "JiarenAI", ".jiaren"));
  return [...new Set(roots)];
}

function resolveConnection() {
  for (const root of candidateDataRoots()) {
    const mcpConnection = readJson(path.join(root, "agent-control-mcp.json"));
    if (mcpConnection?.host === "127.0.0.1" && Number.isInteger(mcpConnection.port) && mcpConnection.port > 0 && typeof mcpConnection.token === "string" && mcpConnection.token.length >= 32) {
      return { ...mcpConnection, token: mcpConnection.token };
    }
    const connection = readJson(path.join(root, "agent-control.json"));
    if (connection?.host === "127.0.0.1" && Number.isInteger(connection.port) && connection.port > 0) {
      const credentials = readJson(path.join(root, "agent-control-cli.json"));
      return { ...connection, token: typeof credentials?.token === "string" ? credentials.token : "" };
    }
  }
  throw new Error("没有找到正在运行的 Jiaren Canvas Control。请先启动 Jiaren AI。");
}

function request(method, requestPath, body) {
  const connection = resolveConnection();
  if (!connection.token) throw new Error("Jiaren Canvas MCP 尚未获得本机授权。请重新启动 Jiaren AI；手动 CLI 客户端仍可使用本地六位配对码。");
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? null : Buffer.from(JSON.stringify(body));
    const req = http.request({
      host: "127.0.0.1",
      port: connection.port,
      path: requestPath,
      method,
      headers: {
        Accept: "application/json",
        "User-Agent": `Jiaren-Canvas-MCP/${VERSION}`,
        Authorization: `Bearer ${connection.token}`,
        ...(payload ? { "Content-Type": "application/json", "Content-Length": payload.length } : {}),
      },
      timeout: 15000,
    }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        let result;
        try { result = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); }
        catch { return reject(new Error("Jiaren AI 返回了无效 JSON。")); }
        if ((response.statusCode || 500) >= 400 || result.ok === false) reject(new Error(result.error || `HTTP ${response.statusCode}`));
        else resolve(result);
      });
    });
    req.once("timeout", () => req.destroy(new Error("连接 Jiaren AI 超时。")));
    req.once("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function finite(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function readPlanResult(planId) {
  const normalizedPlanId = String(planId || "");
  const [{ plans = [] }, { receipts = [] }] = await Promise.all([
    request("GET", "/v1/plans"),
    request("GET", "/v1/receipts"),
  ]);
  const plan = plans.find((item) => item?.id === normalizedPlanId) || null;
  if (!plan) throw new Error(`画布计划不存在：${normalizedPlanId}`);
  const receipt = receipts.find((item) => item?.planId === normalizedPlanId) || null;
  return sanitizeAgentResult({ ok: true, plan, receipt });
}

const AGENT_PRIVATE_FIELDS = new Set([
  "model", "modelId", "modelAlias", "endpointModelId", "provider", "providerId",
  "providerSource", "apiGroup", "baseUrl", "apiUrl", "endpoint", "requestUrl",
]);

function sanitizeAgentResult(value, privateBranch = false) {
  if (Array.isArray(value)) return value.map((item) => sanitizeAgentResult(item, privateBranch));
  if (!value || typeof value !== "object") return value;
  const isPrivate = privateBranch || value.agentTransient === true || value.agentSource === "jiaren-codex";
  const output = {};
  for (const [key, child] of Object.entries(value)) {
    if (isPrivate && AGENT_PRIVATE_FIELDS.has(key)) continue;
    output[key] = sanitizeAgentResult(child, isPrivate);
  }
  return output;
}

function nextPosition(snapshot, requestedX, requestedY) {
  if (Number.isFinite(Number(requestedX)) || Number.isFinite(Number(requestedY))) {
    return { x: finite(requestedX, 420), y: finite(requestedY, 260) };
  }
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
  const right = nodes.reduce((max, node) => Math.max(max, finite(node?.position?.x, 0) + finite(node?.width, 360)), 0);
  return { x: nodes.length ? right + 80 : 420, y: 260 };
}

function operationStamp(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function textNodeOperation(ref, position, content, title = "文字") {
  return {
    type: "node.add",
    ref,
    kind: "textInput",
    position,
    data: {
      kind: "textInput",
      label: title,
      title,
      prompt: String(content || ""),
      content: String(content || ""),
      status: "idle",
    },
  };
}

function sanitizeSvg(value) {
  const source = String(value || "").trim().slice(0, 160000);
  if (!/^<svg(?:\s|>)/i.test(source) || !/<\/svg>\s*$/i.test(source)) {
    throw new Error("SVG 内容必须包含完整的 <svg> 根元素。");
  }
  return source
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<foreignObject\b[^>]*>[\s\S]*?<\/foreignObject\s*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\b(?:href|xlink:href)\s*=\s*(["'])\s*(?:javascript:|https?:|file:)[\s\S]*?\1/gi, "")
    .replace(/url\(\s*(["']?)(?:javascript:|https?:|file:)[^)]+\)/gi, "none");
}

function svgImageOperation(ref, position, args) {
  const svg = sanitizeSvg(args.svg);
  const title = String(args.title || "Jiaren Codex 矢量图").slice(0, 120);
  const width = Math.max(120, Math.min(1600, finite(args.width, 480)));
  const height = Math.max(80, Math.min(1600, finite(args.height, 480)));
  const imageSource = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return {
    type: "node.add",
    ref,
    kind: "imageInput",
    position,
    width,
    height,
    data: {
      kind: "imageInput",
      label: title,
      title,
      description: "本地 Codex 直接生成的 SVG 矢量图",
      status: "succeeded",
      message: "SVG 矢量图已放入画布。",
      imageSource,
      imageUrl: imageSource,
      imageUrls: [imageSource],
      directImageUrl: imageSource,
      directImageUrls: [imageSource],
      mimeType: "image/svg+xml",
      fileName: `${title}.svg`,
      width,
      height,
      vectorSource: svg,
      vectorFormat: "svg",
      agentResult: true,
    },
  };
}

function generationTarget(mode, ref, position, args) {
  const prompt = String(args.prompt || "");
  const common = { type: "node.add", ref, position };
  if (mode === "text") {
    return {
      ...common,
      kind: "llm",
      data: {
        kind: "llm",
        label: args.title || "LLM 生成",
        title: args.title || "LLM 生成",
        inputPrompt: prompt,
        prompt,
        smartFlow: true,
        flowRole: "llm",
        status: "idle",
        ...(args.modelId ? { modelId: String(args.modelId), llmModelId: String(args.modelId) } : {}),
      },
    };
  }
  if (mode === "video") {
    return {
      ...common,
      kind: "sdVideo",
      data: {
        kind: "sdVideo",
        label: args.title || "视频生成",
        title: args.title || "视频生成",
        prompt,
        script: prompt,
        status: "idle",
        ...(args.modelId ? { modelId: String(args.modelId) } : {}),
      },
    };
  }
  if (mode === "audio") {
    return {
      ...common,
      kind: "t8:audio",
      data: {
        kind: "t8:audio",
        label: args.title || "音频生成",
        title: args.title || "音频生成",
        prompt,
        status: "idle",
        ...(args.modelId ? { modelId: String(args.modelId), model: String(args.modelId) } : {}),
      },
    };
  }
  return {
    ...common,
    kind: "generateImage",
    data: {
      kind: "generateImage",
      label: args.title || "图像生成",
      title: args.title || "图像生成",
      prompt,
      count: Math.max(1, Math.min(8, Number(args.count) || 1)),
      status: "idle",
      ...(args.agentTransient === true
        ? {
            agentTransient: true,
            agentSource: "jiaren-codex",
            agentResultMode: "image-only",
          }
        : {}),
      ...(args.modelId ? { modelId: String(args.modelId) } : {}),
    },
  };
}

async function submitPlan(input) {
  const result = await request("POST", "/v1/plans", input);
  return { ok: true, approvalRequired: true, plan: result.plan };
}

async function generationFlowPlan(args, forcedMode, forceRun) {
  const { snapshot } = await request("GET", "/v1/snapshot");
  const position = nextPosition(snapshot, args.x, args.y);
  const mode = ["text", "image", "video", "audio"].includes(forcedMode || args.mode) ? (forcedMode || args.mode) : "image";
  const stamp = operationStamp(`codex-${mode}`);
  const targetRef = `${stamp}-target`;
  const shouldRun = forceRun === true || args.runAfterApproval === true;
  const directRun = forceRun === true;
  const promptRef = `${stamp}-prompt`;
  const directArgs = mode === "image"
    ? { ...args, modelId: undefined, model: undefined, modelAlias: undefined, agentTransient: true }
    : args;
  const operations = directRun
    ? [generationTarget(mode, targetRef, position, directArgs)]
    : [
        textNodeOperation(promptRef, position, args.prompt, `${args.title || mode} 提示词`),
        generationTarget(mode, targetRef, { x: position.x + 460, y: position.y }, args),
        { type: "edge.add", edgeId: `${stamp}-prompt-edge`, source: promptRef, target: targetRef },
      ];
  const references = [...new Set((Array.isArray(args.referenceNodeIds) ? args.referenceNodeIds : []).map(String).filter(Boolean))];
  references.forEach((source, index) => operations.push({ type: "edge.add", edgeId: `${stamp}-reference-${index + 1}`, source, target: targetRef }));
  if (shouldRun) operations.push({ type: "run.node", nodeId: targetRef });
  const labels = { text: "文字", image: "图像", video: "视频", audio: "音频" };
  return submitPlan({
    title: args.title || `创建${labels[mode]}生成流程`,
    summary: directRun
      ? `直接创建 ${labels[mode]}生成节点${references.length ? `并连接 ${references.length} 个参考节点` : ""}，审批后提交生成。`
      : `创建提示词、${labels[mode]}节点和 ${1 + references.length} 条连线${shouldRun ? "，审批后运行" : ""}。`,
    source: "Jiaren Canvas MCP",
    operations,
  });
}

async function callTool(name, args = {}) {
  if (name === "jiaren_canvas_get_state") {
    return sanitizeAgentResult(await request("GET", "/v1/snapshot"));
  }
  if (name === "jiaren_canvas_get_selection") {
    const { snapshot } = await request("GET", "/v1/snapshot");
    return {
      ok: true,
      selection: {
        selectedNodeId: snapshot?.selectedNodeId || null,
        selectedAssetId: snapshot?.selectedAssetId || null,
        selectedNode: sanitizeAgentResult(snapshot?.selectedNode || null),
        selectedAsset: snapshot?.selectedAsset || null,
      },
    };
  }
  if (name === "jiaren_canvas_export_snapshot") {
    const { snapshot } = await request("GET", "/v1/snapshot");
    return {
      ok: true,
      format: "jiaren-canvas-snapshot/v1",
      exportedAt: new Date().toISOString(),
      summary: {
        nodeCount: Array.isArray(snapshot?.nodes) ? snapshot.nodes.length : 0,
        edgeCount: Array.isArray(snapshot?.edges) ? snapshot.edges.length : 0,
        assetCount: Array.isArray(snapshot?.assets) ? snapshot.assets.length : 0,
      },
      snapshot: sanitizeAgentResult(snapshot),
    };
  }
  if (name === "jiaren_canvas_get_plan") {
    return readPlanResult(args.planId);
  }
  if (name === "jiaren_canvas_list_receipts") {
    const { receipts = [] } = await request("GET", "/v1/receipts");
    const planId = String(args.planId || "");
    const limit = Math.max(1, Math.min(100, Number(args.limit) || 20));
    return {
      ok: true,
      receipts: sanitizeAgentResult(receipts.filter((item) => !planId || item?.planId === planId).slice(0, limit)),
    };
  }
  if (name === "jiaren_canvas_wait_for_plan") {
    const timeoutSeconds = Math.max(1, Math.min(75, Number(args.timeoutSeconds) || 60));
    const deadline = Date.now() + timeoutSeconds * 1000;
    let result;
    do {
      result = await readPlanResult(args.planId);
      if (["completed", "failed", "rejected"].includes(result.plan.status)) {
        return { ...result, timedOut: false };
      }
      await delay(Math.min(750, Math.max(0, deadline - Date.now())));
    } while (Date.now() < deadline);
    result = await readPlanResult(args.planId);
    return { ...result, timedOut: !["completed", "failed", "rejected"].includes(result.plan.status) };
  }
  if (name === "jiaren_canvas_apply_ops") {
    return submitPlan({
      title: args.title || "Codex 画布操作",
      summary: args.summary || `${Array.isArray(args.operations) ? args.operations.length : 0} 项操作等待确认`,
      operations: args.operations,
      source: "Jiaren Canvas MCP",
    });
  }
  if (name === "jiaren_canvas_create_text_node") {
    const { snapshot } = await request("GET", "/v1/snapshot");
    const position = nextPosition(snapshot, args.x, args.y);
    return submitPlan({
      title: args.title || "创建文本节点",
      summary: "在当前画布创建一个可编辑文本节点。",
      source: "Jiaren Canvas MCP",
      operations: [textNodeOperation(operationStamp("codex-text"), position, args.content, args.title || "文字")],
    });
  }
  if (name === "jiaren_canvas_create_text_nodes") {
    const { snapshot } = await request("GET", "/v1/snapshot");
    const origin = nextPosition(snapshot, args.x, args.y);
    const direction = args.direction === "row" ? "row" : "column";
    const gap = Math.max(40, Math.min(1200, finite(args.gap, direction === "row" ? 440 : 300)));
    const items = Array.isArray(args.items) ? args.items : [];
    const operations = items.map((item, index) => textNodeOperation(
      operationStamp(`codex-text-${index + 1}`),
      {
        x: origin.x + (direction === "row" ? index * gap : 0),
        y: origin.y + (direction === "column" ? index * gap : 0),
      },
      item.content,
      item.title || `文字 ${index + 1}`,
    ));
    return submitPlan({
      title: `创建 ${operations.length} 个文字节点`,
      summary: `按${direction === "row" ? "横向" : "纵向"}排列创建可编辑文字节点。`,
      source: "Jiaren Canvas MCP",
      operations,
    });
  }
  if (name === "jiaren_canvas_create_svg") {
    const { snapshot } = await request("GET", "/v1/snapshot");
    const position = nextPosition(snapshot, args.x, args.y);
    return submitPlan({
      title: args.title || "创建 SVG 矢量图",
      summary: "由本地 Codex 直接创建 SVG 矢量图，不调用图片模型或外部生图接口。",
      source: "Jiaren Canvas MCP",
      operations: [svgImageOperation(operationStamp("codex-svg"), position, args)],
    });
  }
  if (name === "jiaren_canvas_create_image_prompt_flow") {
    const { snapshot } = await request("GET", "/v1/snapshot");
    const position = nextPosition(snapshot, args.x, args.y);
    const stamp = Date.now();
    const promptId = `codex-prompt-${stamp}`;
    const imageId = `codex-image-${stamp}`;
    const operations = [
      textNodeOperation(promptId, position, args.prompt, args.title || "图像提示词"),
      generationTarget("image", imageId, { x: position.x + 460, y: position.y }, { ...args, count: 1, title: "图像生成" }),
      { type: "edge.add", edgeId: `codex-edge-${stamp}`, source: promptId, target: imageId },
    ];
    if (args.runAfterApproval) operations.push({ type: "run.node", nodeId: imageId });
    return submitPlan({ title: args.title || "创建图像生成流程", summary: "创建提示词节点、图像节点和连线，等待你在 Jiaren AI 中确认。", source: "Jiaren Canvas MCP", operations });
  }
  if (name === "jiaren_canvas_create_generation_flow") {
    return generationFlowPlan(args);
  }
  if (name === "jiaren_canvas_generate_text") return generationFlowPlan(args, "text", true);
  if (name === "jiaren_canvas_generate_image") return generationFlowPlan(args, "image", true);
  if (name === "jiaren_canvas_generate_video") return generationFlowPlan(args, "video", true);
  if (name === "jiaren_canvas_generate_audio") return generationFlowPlan(args, "audio", true);
  if (name === "jiaren_canvas_create_node") {
    const { snapshot } = await request("GET", "/v1/snapshot");
    const position = nextPosition(snapshot, args.x, args.y);
    const mode = { text: "text", llm: "text", image: "image", video: "video", audio: "audio" }[args.nodeType] || "text";
    let operation;
    if (args.nodeType === "text") {
      operation = textNodeOperation(operationStamp("codex-node"), position, args.prompt || "", args.title || "文字");
    } else {
      operation = generationTarget(mode, operationStamp("codex-node"), position, { ...args, prompt: args.prompt || "", title: args.title });
    }
    operation.data = { ...operation.data, ...(args.data || {}) };
    if (Number.isFinite(Number(args.width))) operation.width = Number(args.width);
    if (Number.isFinite(Number(args.height))) operation.height = Number(args.height);
    return submitPlan({
      title: args.title || "创建画布节点",
      summary: `创建 ${args.nodeType} 节点。`,
      source: "Jiaren Canvas MCP",
      operations: [operation],
    });
  }
  if (name === "jiaren_canvas_update_node") {
    return submitPlan({
      title: "更新画布节点",
      summary: `更新节点 ${String(args.nodeId || "")}`,
      source: "Jiaren Canvas MCP",
      operations: [{ type: "node.update", nodeId: String(args.nodeId || ""), patch: args.patch || {} }],
    });
  }
  if (name === "jiaren_canvas_update_node_text") {
    const patch = { prompt: String(args.text || ""), content: String(args.text || "") };
    if (args.title) Object.assign(patch, { title: String(args.title), label: String(args.title) });
    return submitPlan({
      title: "更新文字节点",
      summary: `更新节点 ${String(args.nodeId || "")} 的文字内容。`,
      source: "Jiaren Canvas MCP",
      operations: [{ type: "node.update", nodeId: String(args.nodeId || ""), patch }],
    });
  }
  if (name === "jiaren_canvas_move_nodes") {
    const { snapshot } = await request("GET", "/v1/snapshot");
    const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
    const operations = (Array.isArray(args.items) ? args.items : []).map((item) => {
      const current = nodes.find((node) => node.id === item.nodeId)?.position || { x: 0, y: 0 };
      return {
        type: "node.update",
        nodeId: String(item.nodeId || ""),
        patch: {
          position: {
            x: Number.isFinite(Number(item.x)) ? Number(item.x) : finite(current.x, 0) + finite(item.dx, 0),
            y: Number.isFinite(Number(item.y)) ? Number(item.y) : finite(current.y, 0) + finite(item.dy, 0),
          },
        },
      };
    });
    return submitPlan({ title: `移动 ${operations.length} 个节点`, summary: "更新节点画布坐标。", source: "Jiaren Canvas MCP", operations });
  }
  if (name === "jiaren_canvas_resize_node") {
    return submitPlan({
      title: "调整节点尺寸",
      summary: `将节点调整为 ${Number(args.width)} × ${Number(args.height)}`,
      source: "Jiaren Canvas MCP",
      operations: [{ type: "node.update", nodeId: String(args.nodeId || ""), patch: { width: Number(args.width), height: Number(args.height) } }],
    });
  }
  if (name === "jiaren_canvas_delete_nodes") {
    const nodeIds = [...new Set((Array.isArray(args.nodeIds) ? args.nodeIds : []).map(String).filter(Boolean))];
    return submitPlan({
      title: `删除 ${nodeIds.length} 个节点`,
      summary: "删除节点及其相关连线。",
      source: "Jiaren Canvas MCP",
      operations: nodeIds.map((nodeId) => ({ type: "node.delete", nodeId })),
    });
  }
  if (name === "jiaren_canvas_connect_nodes") {
    const connections = Array.isArray(args.connections) ? args.connections : [];
    return submitPlan({
      title: `连接 ${connections.length} 组节点`,
      summary: "创建节点之间的画布连线，并同步上游内容。",
      source: "Jiaren Canvas MCP",
      operations: connections.map((connection, index) => ({
        type: "edge.add",
        edgeId: connection.edgeId || operationStamp(`codex-edge-${index + 1}`),
        source: String(connection.source || ""),
        target: String(connection.target || ""),
        ...(connection.sourceHandle ? { sourceHandle: String(connection.sourceHandle) } : {}),
        ...(connection.targetHandle ? { targetHandle: String(connection.targetHandle) } : {}),
      })),
    });
  }
  if (name === "jiaren_canvas_select_node") {
    return submitPlan({
      title: args.nodeId == null ? "取消节点选择" : "选择画布节点",
      summary: args.nodeId == null ? "清除当前节点选择。" : `选择节点 ${String(args.nodeId)}`,
      source: "Jiaren Canvas MCP",
      operations: [{ type: "node.select", nodeId: args.nodeId == null ? null : String(args.nodeId) }],
    });
  }
  if (name === "jiaren_canvas_set_viewport") {
    const viewport = args.viewport || {};
    return submitPlan({
      title: "调整画布视口",
      summary: `移动到 (${finite(viewport.x, 0)}, ${finite(viewport.y, 0)})，缩放 ${finite(viewport.zoom, 1)}`,
      source: "Jiaren Canvas MCP",
      operations: [{ type: "viewport.set", viewport: { x: finite(viewport.x, 0), y: finite(viewport.y, 0), zoom: Math.max(0.1, Math.min(8, finite(viewport.zoom, 1))) } }],
    });
  }
  if (name === "jiaren_canvas_run_node") {
    return submitPlan({
      title: "运行画布节点",
      summary: `审批后运行节点 ${String(args.nodeId || "")}`,
      source: "Jiaren Canvas MCP",
      operations: [{ type: "run.node", nodeId: String(args.nodeId || "") }],
    });
  }
  throw new Error(`未知的 Jiaren Canvas MCP 工具：${name || "空"}`);
}

async function handle(message) {
  if (!message || message.jsonrpc !== JSONRPC_VERSION) return;
  if (message.method === "notifications/initialized") return;
  if (!Object.prototype.hasOwnProperty.call(message, "id")) return;
  try {
    if (message.method === "initialize") {
      send({ jsonrpc: JSONRPC_VERSION, id: message.id, result: { protocolVersion: message.params?.protocolVersion || "2025-06-18", capabilities: { tools: { listChanged: false }, resources: { listChanged: false, subscribe: false } }, serverInfo: { name: "jiaren-canvas", title: "Jiaren Canvas", version: VERSION }, instructions: "读取画布后再规划。所有写操作都通过 Jiaren AI 审批；提交后使用计划 ID 等待执行回执，在回执完成前不要声称操作已执行。" } });
    } else if (message.method === "ping") {
      send({ jsonrpc: JSONRPC_VERSION, id: message.id, result: {} });
    } else if (message.method === "tools/list") {
      send({ jsonrpc: JSONRPC_VERSION, id: message.id, result: { tools: TOOLS } });
    } else if (message.method === "resources/list") {
      send({ jsonrpc: JSONRPC_VERSION, id: message.id, result: { resources: [] } });
    } else if (message.method === "tools/call") {
      const result = await callTool(message.params?.name, message.params?.arguments || {});
      send({ jsonrpc: JSONRPC_VERSION, id: message.id, result: textContent(result) });
    } else {
      send({ jsonrpc: JSONRPC_VERSION, id: message.id, error: { code: -32601, message: `Method not found: ${message.method}` } });
    }
  } catch (error) {
    send({ jsonrpc: JSONRPC_VERSION, id: message.id, result: textContent({ ok: false, error: error instanceof Error ? error.message : String(error) }, true) });
  }
}

readline.createInterface({ input: process.stdin, crlfDelay: Infinity }).on("line", (line) => {
  const source = line.trim();
  if (!source) return;
  try { void handle(JSON.parse(source)); }
  catch { send({ jsonrpc: JSONRPC_VERSION, id: null, error: { code: -32700, message: "Parse error" } }); }
});
