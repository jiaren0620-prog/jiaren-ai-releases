"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function write(relativePath, source) {
  fs.writeFileSync(path.join(projectRoot, relativePath), source, "utf8");
}

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Missing ${label}.`);
  return source.replace(search, replacement);
}

function patchCanvas() {
  const relativePath = "dist/assets/MainCanvasFlow-BbsMxxcM.js";
  let source = read(relativePath);
  if (source.includes("Jiaren Agent transient image executor v112")) return;

  source = replaceRequired(
    source,
    `      Et = a.filter((xe) => xe.source === Me.id).map((xe) => xe.target);
    function $o(xe) {`,
    `      Et = a.filter((xe) => xe.source === Me.id).map((xe) => xe.target);
    function jiarenRemoveTransientExecutor(message) {
      if (!jiarenIsTransientAgentImage) return;
      window.dispatchEvent(
        new CustomEvent("jiaren-agent-generation-status", {
          detail: { nodeId: M, status: "failed", message: "图片任务未完成，请检查当前图片接口配置后重试" },
        }),
      );
      window.setTimeout(() => {
        const state = L.getState(),
          current = state.workflowNodes.find((node) => node.id === M);
        if (current?.data?.agentTransient === true) state.deleteWorkflowNode(M);
      }, 0);
    }
    function jiarenFinalizeTransientImages(assets) {
      if (!jiarenIsTransientAgentImage || !Array.isArray(assets) || assets.length === 0)
        return;
      const state = L.getState(),
        executor = state.workflowNodes.find((node) => node.id === M);
      if (!executor) return;
      const makeResultData = (asset, index) => {
          const source = Li(asset),
            label = assets.length > 1 ? \`Jiaren Agent 图片 \${index + 1}\` : "Jiaren Agent 图片";
          return {
            kind: "imageInput",
            label,
            title: label,
            description: "Jiaren Agent 生成结果",
            status: "succeeded",
            message: "Jiaren Agent 已完成图片生成。",
            imageSource: source,
            imageUrl: source,
            imageUrls: source ? [source] : [],
            directImageUrl: source,
            directImageUrls: source ? [source] : [],
            localPath: asset?.localPath,
            fileName: asset?.name || label,
            mimeType: asset?.mimeType,
            width: asset?.width,
            height: asset?.height,
            outputAssets: [asset],
            generationPrompt: Xe,
            agentResult: true,
            agentSource: "jiaren-codex",
            agentResultIndex: index,
            agentResultCount: assets.length,
            agentTransient: false,
          };
        },
        firstNode = {
          ...executor,
          type: "imageInput",
          data: makeResultData(assets[0], 0),
        },
        extraNodes = assets.slice(1).map((asset, index) => ({
          id: \`agent-image-\${crypto.randomUUID()}\`,
          type: "imageInput",
          position: {
            x: executor.position.x + (index + 1) * 360,
            y: executor.position.y,
          },
          data: makeResultData(asset, index + 1),
        }));
      state.setWorkflowNodes([
        ...state.workflowNodes.filter((node) => node.id !== M),
        firstNode,
        ...extraNodes,
      ]);
      if (state.promptBarNodeId === M) L.setState({ promptBarNodeId: void 0 });
      state.setSelectedNode(firstNode.id);
      window.dispatchEvent(
        new CustomEvent("jiaren-agent-generation-status", {
          detail: {
            nodeId: M,
            status: "succeeded",
            count: assets.length,
            message: \`已生成 \${assets.length} 张图片并放入画布。\`,
          },
        }),
      );
    }
    function $o(xe) {`,
    "transient image result finalizer",
  );

  source = replaceRequired(
    source,
    `  async function Pn() {
    if (!ve || nt) return;
    const M = Me.id,
      O = ve.alias,`,
    `  async function Pn() {
    if (!ve || nt) return;
    const M = Me.id,
      liveNode = L.getState().workflowNodes.find((node) => node.id === Me.id),
      jiarenIsTransientAgentImage = liveNode?.data?.agentTransient === true;
    if (jiarenIsTransientAgentImage && liveNode.data.agentExecutionStarted === true)
      return;
    if (jiarenIsTransientAgentImage) S(M, { agentExecutionStarted: true });
    const O = ve.alias,`,
    "transient image once-only execution lock",
  );

  source = replaceRequired(
    source,
    `        ct(xe));
      return;
    }
    if (!he.baseUrl.trim()) {`,
    `        ct(xe),
        jiarenRemoveTransientExecutor(xe));
      return;
    }
    if (!he.baseUrl.trim()) {`,
    "transient API key failure cleanup",
  );
  source = replaceRequired(
    source,
    `        ct(xe));
      return;
    }
    const Pe = [`,
    `        ct(xe),
        jiarenRemoveTransientExecutor(xe));
      return;
    }
    const Pe = [`,
    "transient Base URL failure cleanup",
  );
  source = replaceRequired(
    source,
    `        bo && On(Me.id, xe),
        bo ||`,
    `        bo && On(Me.id, xe),
        bo && jiarenFinalizeTransientImages(xe),
        Mn === "failed" && jiarenRemoveTransientExecutor(Bo),
        bo ||`,
    "transient image completion",
  );
  source = replaceRequired(
    source,
    `        ct(Bo));
    } finally {`,
    `        ct(Bo));
    } catch (error) {
      const failureMessage = error instanceof Error ? error.message : String(error);
      S(Me.id, { status: "failed", message: failureMessage });
      k({
        id: crypto.randomUUID(),
        createdAt: /* @__PURE__ */ new Date().toISOString(),
        modelAlias: O,
        modelId: q,
        prompt: Xe,
        elapsedMs: Math.round(performance.now() - In),
        status: "failed",
        message: failureMessage,
      });
      ct(failureMessage);
      jiarenRemoveTransientExecutor(failureMessage);
    } finally {`,
    "transient thrown failure cleanup",
  );
  source = replaceRequired(
    source,
    `    className: \`${"${to ? \"lovart-prompt-console upstream-prompt-mode\" : \"lovart-prompt-console\"}${me ? \" smart-flow-hidden-promptbar\" : \"\"}"}\`,`,
    `    className: \`${"${to ? \"lovart-prompt-console upstream-prompt-mode\" : \"lovart-prompt-console\"}${me ? \" smart-flow-hidden-promptbar\" : \"\"}${Me.data.agentTransient === true ? \" agent-transient-executor\" : \"\"}"}\`,`,
    "hidden transient prompt console class",
  );
  source = replaceRequired(
    source,
    "          nodes: e,\n          edges: n,",
    `          nodes: e.filter((node) => node.data?.agentTransient !== true),
          edges: n.filter((edge) => {
            const sourceNode = e.find((node) => node.id === edge.source),
              targetNode = e.find((node) => node.id === edge.target);
            return sourceNode?.data?.agentTransient !== true && targetNode?.data?.agentTransient !== true;
          }),`,
    "hidden transient React Flow nodes",
  );
  source = replaceRequired(
    source,
    `          window.setTimeout(() => {
            if (eventName === "jiaren-run-audio-node") {`,
    `          const dispatchRun = () => {
            if (eventName === "jiaren-run-audio-node") {`,
    "run dispatch function start",
  );
  source = replaceRequired(
    source,
    `            window.dispatchEvent(new CustomEvent(eventName, { detail: { nodeId } }));
          }, 160);
          receipts.push({ index, type, ok: true, queued: true, nodeId, eventName });`,
    `            window.dispatchEvent(new CustomEvent(eventName, { detail: { nodeId } }));
          };
          if (node.data?.agentTransient === true && eventName === "jiaren-run-generate-node") {
            const previous = window.__JIAREN_AGENT_IMAGE_RUN_QUEUE__ || Promise.resolve();
            window.__JIAREN_AGENT_IMAGE_RUN_QUEUE__ = previous
              .catch(() => {})
              .then(async () => {
                L.getState().setPromptBarNode(nodeId);
                await new Promise((resolve) => window.setTimeout(resolve, 100));
                dispatchRun();
                await new Promise((resolve) => window.setTimeout(resolve, 180));
              });
          } else {
            window.setTimeout(dispatchRun, 160);
          }
          receipts.push({ index, type, ok: true, queued: true, nodeId, eventName });`,
    "transient image run queue",
  );

  source += "\n/* Jiaren Agent transient image executor v112 */\n";
  write(relativePath, source);
}

function patchAgentUi() {
  const relativePath = "dist/assets/jiaren-codex-app-server-v112.js";
  let source = read(relativePath);
  if (source.includes("jiarenAgentGenerationCleanup")) return;
  source = replaceRequired(
    source,
    "    agentControlCleanup: null,\n    executingPlanIds: new Set(),",
    "    agentControlCleanup: null,\n    jiarenAgentGenerationCleanup: null,\n    executingPlanIds: new Set(),",
    "generation status cleanup state",
  );
  source = replaceRequired(
    source,
    `    state.agentControlCleanup = window.jiaren?.agentControl?.onEvent?.((event) => {
      if (event?.type?.startsWith("plan.")) void refreshCanvasPlans(workspace);
    }) || null;
    setMode(state.mode);`,
    `    state.agentControlCleanup = window.jiaren?.agentControl?.onEvent?.((event) => {
      if (event?.type?.startsWith("plan.")) void refreshCanvasPlans(workspace);
    }) || null;
    if (typeof state.jiarenAgentGenerationCleanup === "function") state.jiarenAgentGenerationCleanup();
    const generationStatusHandler = (event) => {
      const detail = event?.detail || {},
        succeeded = detail.status === "succeeded";
      processNotice(
        workspace.querySelector('[data-role="timeline"]'),
        \`generation:\${text(detail.nodeId, "image")}\`,
        succeeded ? "图片生成完成" : "图片生成失败",
        text(detail.message, succeeded ? "最终图片已放入画布" : "图片任务未完成"),
        succeeded ? "complete" : "failed",
      );
    };
    window.addEventListener("jiaren-agent-generation-status", generationStatusHandler);
    state.jiarenAgentGenerationCleanup = () =>
      window.removeEventListener("jiaren-agent-generation-status", generationStatusHandler);
    setMode(state.mode);`,
    "generation status listener",
  );
  write(relativePath, source);
}

function patchAgentDelegationPrivacy() {
  const relativePath = "dist/assets/jiaren-codex-app-server-v112.js";
  let source = read(relativePath);
  if (source.includes("Jiaren Agent delegated image privacy v112")) return;
  if (!source.includes("Jiaren 正在后台生成 · 完成后仅显示最终图片")) {
    source = replaceRequired(
      source,
      `        const modelLabel = text(generatedNode?.data?.modelAlias || generatedNode?.data?.modelId || generatedNode?.data?.model, "画布节点当前模型");`,
      `        const delegatedImageRun = generatedNode?.data?.agentTransient === true
          || generatedNode?.data?.agentSource === "jiaren-codex";`,
      "delegated image run detection",
    );
    source = replaceRequired(
      source,
      `          runReceipt ? "生成任务已提交" : \`${'${options.automatic ? "已自动执行" : "已执行"}'}画布操作\`,
          runReceipt ? \`执行模型：${'${modelLabel}'} · 结果将在节点内更新\` : \`${'${text(plan.title, "画布操作计划")}'} · ${'${plan.operations.length}'} 项操作\`,`,
      `          runReceipt ? (delegatedImageRun ? "图片任务已提交" : "生成任务已提交") : \`${'${options.automatic ? "已自动执行" : "已执行"}'}画布操作\`,
          runReceipt ? (delegatedImageRun ? "Jiaren 正在后台生成 · 完成后仅显示最终图片" : "画布任务已进入队列 · 结果将在节点内更新") : \`${'${text(plan.title, "画布操作计划")}'} · ${'${plan.operations.length}'} 项操作\`,`,
      "private queued image notice",
    );
  }
  source = source.replace(
    `        text(detail.message, succeeded ? "最终图片已放入画布" : "图片任务未完成"),`,
    `        succeeded ? "最终图片已放入画布" : "图片任务未完成，请检查当前图片接口配置后重试",`,
  );
  source += "\n/* Jiaren Agent delegated image privacy v112 */\n";
  write(relativePath, source);
}

function patchCss() {
  const relativePath = "dist/assets/jiaren-runtime-hardening-v019.css";
  let source = read(relativePath);
  if (source.includes("Jiaren Agent transient image executor")) return;
  source += `

/* Jiaren Agent transient image executor */
.lovart-prompt-console.agent-transient-executor {
  display: none !important;
}
`;
  write(relativePath, source);
}

patchCanvas();
patchAgentUi();
patchAgentDelegationPrivacy();
patchCss();
console.log("Jiaren Agent transient image results patch applied.");
