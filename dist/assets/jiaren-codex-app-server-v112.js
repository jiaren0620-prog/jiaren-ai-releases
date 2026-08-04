(function () {
  "use strict";

  const STORAGE_MODE = "jiaren-agent-engine-v112";
  const STORAGE_REMOTE_URL = "jiaren-agent-remote-url-v112";
  const state = {
    mode: localStorage.getItem(STORAGE_MODE) || "api",
    connected: false,
    status: null,
    models: [],
    threads: [],
    threadId: "",
    turnId: "",
    attachments: [],
    streamElement: null,
    eventCleanup: null,
    busy: false,
    view: "chat",
    catalogsLoadedAt: 0,
    catalogsPromise: null,
    refreshPromise: null,
    streamBuffer: "",
    streamFrame: 0,
    streamItemId: "",
    activityElement: null,
    runElement: null,
    runBodyElement: null,
    runStatusElement: null,
    runMetaElement: null,
    runStartedAt: 0,
    runTimer: 0,
    runEntries: new Map(),
    runStats: { commands: 0, files: 0, tools: 0, searches: 0 },
    messagePhases: new Map(),
    historyRunEntries: new Map(),
    canvasApprovedThreads: new Set(),
    canvasPlansPromise: null,
    agentPlans: [],
    agentControlCleanup: null,
    jiarenAgentGenerationCleanup: null,
    executingPlanIds: new Set(),
    generationResults: new Map(),
    generationWaiters: new Map(),
    lastCanvasRequestText: "",
    currentTurnNeedsCanvasImage: false,
    currentTurnCanvasImageCompleted: false,
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(label, title, handler, className) {
    const node = element("button", className, label);
    node.type = "button";
    node.title = title;
    node.setAttribute("aria-label", title);
    node.addEventListener("click", handler);
    return node;
  }

  function text(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function isExplicitVectorRequest(value) {
    const source = text(value, "");
    return /\bsvg\b|矢量(?:图|插画|素材|文件)?|可编辑线稿/i.test(source)
      || /(?:制作|创建|生成|设计|绘制|画|输出|导出|做).{0,12}(?:图标|logo|标志|线稿)/i.test(source)
      || /(?:create|make|design|draw|export).{0,24}(?:icon|logo|line[ -]?art)/i.test(source);
  }

  function isRasterImageRequest(value) {
    const source = text(value, "");
    if (isExplicitVectorRequest(source)) return false;
    return /产品主图|商品主图|电商主图|天猫主图|淘宝主图|京东主图|海报|广告图|宣传图|写实图|效果图|摄影图|照片|\b(?:png|jpe?g|webp)\b/i.test(source)
      || /(?:生成|制作|创建|设计|绘制|画|做|出|修改|替换).{0,24}(?:图片|图像|主图|海报|照片)/i.test(source)
      || /(?:generate|create|make|design|draw|edit).{0,32}(?:image|picture|photo|poster)/i.test(source);
  }

  function planContainsSvg(plan) {
    return (Array.isArray(plan?.operations) ? plan.operations : []).some((operation) => {
      const data = operation?.data || operation?.patch || {};
      const sources = [data.imageSource, data.imageUrl, data.directImageUrl, ...(Array.isArray(data.imageUrls) ? data.imageUrls : [])];
      return data.mimeType === "image/svg+xml"
        || data.vectorFormat === "svg"
        || sources.some((source) => /^data:image\/svg\+xml/i.test(text(source, "")));
    });
  }

  function planContainsDelegatedImage(plan) {
    return (Array.isArray(plan?.operations) ? plan.operations : []).some((operation) =>
      operation?.kind === "generateImage"
      && (operation?.data?.agentTransient === true || operation?.data?.agentSource === "jiaren-codex"));
  }

  function planContainsCodexImage(plan) {
    return (Array.isArray(plan?.operations) ? plan.operations : []).some((operation) =>
      operation?.kind === "imageInput"
      && operation?.data?.agentSource === "codex-image-gen"
      && operation?.data?.codexImageGeneration === true);
  }

  function finalImageSources(node) {
    const data = node?.data || {};
    return [
      data.imageSource,
      data.imageUrl,
      data.directImageUrl,
      ...(Array.isArray(data.imageUrls) ? data.imageUrls : []),
      ...(Array.isArray(data.directImageUrls) ? data.directImageUrls : []),
    ].map((value) => text(value, "")).filter(Boolean);
  }

  function friendlyAuthError(value) {
    const source = text(value, "OpenAI 登录失败。");
    if (/unsupported_country_region_territory|country, region, or territory not supported/i.test(source)) {
      return "当前网络所在国家或地区不受 OpenAI 账号登录支持。Jiaren AI 无法绕过服务商限制；可改用有效的 OpenAI API Key，或在官方支持的网络地区完成 Codex CLI 登录后点击“检测本机登录”。";
    }
    return source;
  }

  function friendlyCodexError(value) {
    if (/CODEX_IMAGE_CAPABILITY_REQUIRED|image-generation capability|built-in image_gen is unavailable/i.test(String(value || ""))) {
      return "\u5f53\u524d\u662f API Key \u767b\u5f55\uff0c\u6ca1\u6709 Codex \u4ea7\u54c1\u5185\u7f6e\u751f\u56fe\u80fd\u529b\u3002\u8bf7\u5207\u6362\u5230\u201cOpenAI/Codex \u8d26\u53f7\u767b\u5f55\u201d\u540e\u91cd\u8bd5\uff1b\u4e0d\u4f1a\u8f6c\u53d1\u5230 Jiaren \u56fe\u7247 API \u6216\u5176\u4ed6\u6a21\u578b\u3002";
    }
    const source = text(value, "Codex 任务失败。");
    if (/capacity|at capacity|try a different model|model unavailable|temporarily unavailable|rate limit/i.test(source)) {
      return "当前 Codex 服务暂时繁忙，请稍后重试。";
    }
    if (/api[_ -]?key|authorization|https?:\/\//i.test(source)) {
      return "Codex 对话服务暂时不可用，请检查登录状态后重试。";
    }
    return source;
  }

  function message(container, role, content, detail) {
    const row = element("article", `jiaren-codex-message is-${role}`);
    const avatar = element("span", "jiaren-codex-avatar", role === "user" ? "你" : role === "tool" ? "T" : "J");
    const bubble = element("div", "jiaren-codex-bubble");
    bubble.appendChild(element("span", "", content));
    if (detail) bubble.appendChild(element("small", "", detail));
    row.append(avatar, bubble);
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
    return bubble;
  }

  function logMessage(container, content, detail) {
    const bubble = message(container, "tool", content, detail);
    bubble.closest(".jiaren-codex-message")?.classList.add("is-log-entry");
    return bubble;
  }

  function durationText(milliseconds) {
    const seconds = Math.max(0, Math.round(Number(milliseconds || 0) / 1000));
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分 ${seconds % 60}秒`;
  }

  function runStatsText() {
    const parts = [];
    if (state.runStats.commands) parts.push(`${state.runStats.commands} 个命令`);
    if (state.runStats.files) parts.push(`${state.runStats.files} 个文件`);
    if (state.runStats.tools) parts.push(`${state.runStats.tools} 个画布操作`);
    if (state.runStats.searches) parts.push(`${state.runStats.searches} 次资料查找`);
    return parts.join(" · ");
  }

  function toolFamily(item) {
    if (item.type === "imageGeneration") return "codex-image-generation";
    const tool = text(item.tool).toLowerCase();
    if (tool.includes("generate_image")) return "generate-image";
    if (tool.includes("generate_video")) return "generate-video";
    if (tool.includes("generate_audio")) return "generate-audio";
    if (tool.includes("generate_text")) return "generate-text";
    if (tool.includes("wait_for_plan") || tool.includes("get_plan") || tool.includes("list_receipts")) return "canvas-result";
    if (tool.includes("get_state") || tool.includes("get_selection") || tool.includes("canvas_read") || tool.includes("get_snapshot")) return "canvas-read";
    if (tool.includes("canvas")) return "canvas-write";
    return `${item.type || "tool"}:${tool || item.command || item.query || "operation"}`;
  }

  function processNotice(timeline, key, label, detail = "", status = "complete") {
    startRun(timeline);
    const entryKey = `notice:${key}`;
    let row = state.runEntries.get(entryKey);
    if (!row) {
      row = element("div", "jiaren-codex-process-line");
      row.append(element("i"), element("span"), element("small"));
      state.runBodyElement.appendChild(row);
      state.runEntries.set(entryKey, row);
    }
    row.className = `jiaren-codex-process-line is-${status}`;
    row.querySelector("span").textContent = label;
    row.querySelector("small").textContent = detail;
    timeline.scrollTop = timeline.scrollHeight;
    return row;
  }

  function generationStatusDetail(value) {
    const detail = value && typeof value === "object" ? value : {};
    const nodeId = text(detail.nodeId, "");
    const status = text(detail.status, "").toLowerCase();
    return { ...detail, nodeId, status };
  }

  function rememberGenerationStatus(value) {
    const detail = generationStatusDetail(value);
    if (!detail.nodeId || !["succeeded", "failed", "canceled"].includes(detail.status)) return;
    state.generationResults.set(detail.nodeId, detail);
    const waiter = state.generationWaiters.get(detail.nodeId);
    if (!waiter) return;
    state.generationWaiters.delete(detail.nodeId);
    clearTimeout(waiter.timeout);
    waiter.resolve(detail);
  }

  function waitForGeneration(nodeId, timeoutMs = 240000) {
    const key = text(nodeId, "");
    const previous = state.generationResults.get(key);
    if (previous) {
      state.generationResults.delete(key);
      return Promise.resolve(previous);
    }
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        state.generationWaiters.delete(key);
        reject(new Error("图片生成等待超时，未收到最终图片结果。"));
      }, timeoutMs);
      state.generationWaiters.set(key, { resolve, reject, timeout });
    });
  }

  function rejectGenerationWaiters(error) {
    for (const [nodeId, waiter] of state.generationWaiters) {
      clearTimeout(waiter.timeout);
      waiter.reject(error);
      state.generationWaiters.delete(nodeId);
    }
  }

  function updateRunClock() {
    if (!state.runStatusElement || !state.runStartedAt) return;
    state.runStatusElement.textContent = `处理中 ${durationText(Date.now() - state.runStartedAt)}`;
    state.runMetaElement.textContent = runStatsText();
  }

  function startRun(timeline) {
    if (state.runElement?.isConnected) return state.runElement;
    const run = element("details", "jiaren-codex-run");
    run.open = true;
    const summary = element("summary");
    const status = element("strong", "", "处理中 0秒");
    const meta = element("span", "jiaren-codex-run-meta");
    const body = element("div", "jiaren-codex-run-body");
    summary.append(status, meta);
    run.append(summary, body);
    timeline.appendChild(run);
    state.runElement = run;
    state.runBodyElement = body;
    state.runStatusElement = status;
    state.runMetaElement = meta;
    state.runStartedAt = Date.now();
    state.runEntries = new Map();
    state.runStats = { commands: 0, files: 0, tools: 0, searches: 0 };
    clearInterval(state.runTimer);
    state.runTimer = window.setInterval(updateRunClock, 1000);
    timeline.scrollTop = timeline.scrollHeight;
    return run;
  }

  function resetRunState(remove = false) {
    clearInterval(state.runTimer);
    state.runTimer = 0;
    if (remove) state.runElement?.remove();
    state.runElement = null;
    state.runBodyElement = null;
    state.runStatusElement = null;
    state.runMetaElement = null;
    state.runStartedAt = 0;
    state.runEntries = new Map();
    state.runStats = { commands: 0, files: 0, tools: 0, searches: 0 };
    state.messagePhases = new Map();
    state.activityElement = null;
  }

  function finishRun() {
    if (!state.runElement?.isConnected) return resetRunState();
    const elapsed = Date.now() - state.runStartedAt;
    clearActivity();
    clearInterval(state.runTimer);
    state.runStatusElement.textContent = `已处理 ${durationText(elapsed)}`;
    state.runMetaElement.textContent = runStatsText();
    state.runElement.classList.add("is-complete");
    state.runElement = null;
    state.runBodyElement = null;
    state.runStatusElement = null;
    state.runMetaElement = null;
    state.runStartedAt = 0;
    state.runTimer = 0;
    state.runEntries = new Map();
    state.runStats = { commands: 0, files: 0, tools: 0, searches: 0 };
    state.messagePhases = new Map();
  }

  function setActivity(timeline, label = "Codex 正在处理…") {
    startRun(timeline);
    if (!state.activityElement?.isConnected) {
      const row = element("div", "jiaren-codex-activity");
      row.setAttribute("role", "status");
      row.setAttribute("aria-live", "polite");
      row.append(element("i"), element("span", "", label));
      state.runBodyElement.appendChild(row);
      state.activityElement = row;
    } else {
      state.activityElement.querySelector("span").textContent = label;
    }
    timeline.scrollTop = timeline.scrollHeight;
  }

  function clearActivity() {
    state.activityElement?.remove();
    state.activityElement = null;
  }

  function friendlyToolText(item, completed = false) {
    if (item.type === "imageGeneration") return completed ? "\u56fe\u7247\u751f\u6210\u5b8c\u6210" : "Codex \u6b63\u5728\u751f\u6210\u56fe\u7247";
    if (item.type === "webSearch") return completed ? "已完成资料查找" : "正在查找资料";
    if (item.type === "fileChange") {
      const count = Array.isArray(item.changes) && item.changes.length ? item.changes.length : 1;
      return completed ? `已编辑 ${count} 个文件` : "正在编辑文件";
    }
    if (item.type === "commandExecution") return completed ? "命令运行完成" : "正在运行命令";
    const tool = text(item.tool).toLowerCase();
    if (tool.includes("generate_image")) return completed ? "已提交图像生成任务" : "正在准备图像生成任务";
    if (tool.includes("generate_video")) return completed ? "已提交视频生成任务" : "正在准备视频生成任务";
    if (tool.includes("generate_audio")) return completed ? "已提交音频生成任务" : "正在准备音频生成任务";
    if (tool.includes("generate_text")) return completed ? "已提交文字生成任务" : "正在准备文字生成任务";
    if (tool.includes("canvas_read") || tool.includes("get_snapshot")) return completed ? "已读取当前画布" : "正在读取当前画布";
    if (tool.includes("submit_plan") || tool.includes("get_plan")) return completed ? "已准备画布修改方案" : "正在准备画布修改方案";
    if (tool.includes("wait_for_plan")) return completed ? "已收到画布执行结果" : "正在等待画布执行结果";
    if (tool.includes("apply") || tool.includes("canvas")) return completed ? "画布操作已完成" : "正在操作画布";
    return completed ? "工具操作已完成" : "正在调用工具";
  }

  function updateRunTool(timeline, item, completed = false) {
    startRun(timeline);
    const key = `tool:${toolFamily(item)}`;
    let row = state.runEntries.get(key);
    if (!row) {
      row = element("div", "jiaren-codex-run-step is-running");
      row.append(element("i"), element("span", "", friendlyToolText(item, completed)), element("small"));
      state.runBodyElement.appendChild(row);
      state.runEntries.set(key, row);
      if (item.type === "commandExecution") state.runStats.commands += 1;
      else if (item.type === "fileChange") state.runStats.files += Array.isArray(item.changes) && item.changes.length ? item.changes.length : 1;
      else if (item.type === "webSearch") state.runStats.searches += 1;
      else state.runStats.tools += 1;
    }
    row.classList.toggle("is-running", !completed);
    row.classList.toggle("is-complete", completed);
    row.querySelector("span").textContent = friendlyToolText(item, completed);
    const duration = Number(item.durationMs || 0);
    row.querySelector("small").textContent = completed && duration > 0 ? durationText(duration) : "";
    state.runMetaElement.textContent = runStatsText();
    timeline.scrollTop = timeline.scrollHeight;
  }

  function appendRunNarrative(timeline, key, delta, className = "") {
    if (!delta) return;
    startRun(timeline);
    let paragraph = state.runEntries.get(key);
    if (!paragraph) {
      paragraph = element("p", `jiaren-codex-run-note ${className}`.trim());
      state.runBodyElement.appendChild(paragraph);
      state.runEntries.set(key, paragraph);
    }
    paragraph.textContent += delta;
    timeline.scrollTop = timeline.scrollHeight;
  }

  function activityLabel(type) {
    if (type === "imageGeneration") return "Codex \u6b63\u5728\u751f\u6210\u56fe\u7247...";
    if (type === "webSearch") return "Codex 正在查找资料…";
    if (["mcpToolCall", "dynamicToolCall"].includes(type)) return "Codex 正在操作画布…";
    if (type === "fileChange") return "Codex 正在整理文件…";
    return "Codex 正在执行任务…";
  }

  function statusText(status) {
    if (!status) return "等待连接";
    if (!status.available && status.mode !== "remote") return "未安装 Codex CLI";
    if (!status.running) return "未连接";
    const account = status.account;
    if (!account || (!account.type && !account.authMode)) return "已连接，等待登录";
    if ((account.type === "apiKey" || account.authMode === "apiKey") && status.capabilities?.imageGeneration !== true) {
      return "API Key 登录（对话可用，Codex 内置生图不可用）";
    }
    return account.email ? `已登录 ${account.email}` : `已登录 ${account.planType || account.type || account.authMode || "Codex"}`;
  }

  function activePanel() {
    return document.querySelector(".jiaren-agent-panel");
  }

  function setMode(mode) {
    if (!new Set(["api", "local", "remote"]).has(mode)) return;
    state.mode = mode;
    localStorage.setItem(STORAGE_MODE, mode);
    const panel = activePanel();
    if (!panel) return;
    panel.classList.toggle("jiaren-codex-mode", mode !== "api");
    panel.querySelectorAll(".jiaren-agent-mode-switch button").forEach((node) => node.classList.toggle("is-active", node.dataset.mode === mode));
    const workspace = panel.querySelector(".jiaren-codex-workspace");
    if (workspace) workspace.hidden = mode === "api";
    if (mode !== "api") void refreshWorkspace(workspace);
  }

  function createModeSwitch(panel) {
    const switcher = element("div", "jiaren-agent-mode-switch");
    [
      ["api", "API 对话", "使用软件中用户填写的 API"],
      ["local", "本地 Codex", "连接本机 Codex CLI"],
      ["remote", "网络 Agent", "连接已授权的 WSS Agent 服务"],
    ].forEach(([mode, label, title]) => {
      const node = button(label, title, () => setMode(mode));
      node.dataset.mode = mode;
      switcher.appendChild(node);
    });
    panel.querySelector(".agent-panel-header")?.after(switcher);
    return switcher;
  }

  function createWorkspace(panel) {
    const workspace = element("section", "jiaren-codex-workspace");
    workspace.innerHTML = `
      <div class="jiaren-codex-connect">
        <span class="jiaren-codex-state"><i></i><b>等待连接</b></span>
        <button type="button" data-action="connect">连接</button>
        <button type="button" data-action="disconnect">断开</button>
      </div>
      <div class="jiaren-codex-remote" hidden>
        <label><span>WSS 地址</span><input data-field="remote-url" type="url" spellcheck="false" placeholder="wss://agent.example.com" /></label>
        <label><span>访问令牌</span><input data-field="remote-token" type="password" autocomplete="off" placeholder="仅本次连接使用，不保存" /></label>
      </div>
      <div class="jiaren-codex-account">
        <button type="button" data-action="browser-login" title="使用 Codex 账号进行对话和内置生图">Codex 账号</button>
        <button type="button" data-action="device-login">设备码登录</button>
        <button type="button" data-action="api-key-toggle" title="当前 Codex CLI 的 API Key 登录仅用于对话">API Key（仅对话）</button>
        <button type="button" data-action="local-account">检测本机登录</button>
        <button type="button" data-action="install-mcp">安装画布桥接</button>
        <button type="button" data-action="workspace">项目目录</button>
        <small class="jiaren-codex-account-capability">Codex 账号支持对话、内置生图，并将成图直接返回当前画布。</small>
        <span data-role="workspace-path"></span>
      </div>
      <div class="jiaren-codex-api-key" hidden>
        <label><span>OpenAI API Key</span><input data-field="api-key" type="password" autocomplete="off" spellcheck="false" placeholder="输入后仅发送给本机 Codex" /></label>
        <button type="button" data-action="api-key-login" class="is-primary">登录</button>
        <button type="button" data-action="api-key-cancel">取消</button>
        <small>Jiaren AI 不保存输入框内容；登录凭据由本机 Codex 管理。</small>
      </div>
      <div class="jiaren-codex-login" hidden></div>
      <div class="jiaren-codex-session">
        <select data-field="model" aria-label="Codex 模型"><option value="">自动模型</option></select>
        <select data-field="thread" aria-label="Codex 对话"><option value="">新对话</option></select>
        <button type="button" data-action="new-thread" title="新建 Codex 对话">+</button>
        <button type="button" data-action="refresh" title="刷新状态">刷新</button>
      </div>
      <nav class="jiaren-codex-tabs">
        <button type="button" class="is-active" data-view="chat">对话</button>
        <button type="button" data-view="log">日志</button>
      </nav>
      <div class="jiaren-codex-timeline" data-role="timeline"></div>
      <div class="jiaren-codex-approvals" data-role="approvals" hidden></div>
      <div class="jiaren-codex-attachments" data-role="attachments" hidden></div>
      <footer class="jiaren-codex-composer">
        <button type="button" data-action="attach" title="添加图片、文档或代码">附件</button>
        <textarea rows="1" data-field="prompt" placeholder="让 Jiaren Agent 读取或操作当前画布"></textarea>
        <button type="button" data-action="interrupt" title="停止当前任务">停止</button>
        <button type="button" data-action="send" class="is-primary">发送</button>
      </footer>`;
    panel.appendChild(workspace);
    workspace.querySelector('[data-field="remote-url"]').value = localStorage.getItem(STORAGE_REMOTE_URL) || "";
    workspace.querySelector('[data-action="connect"]').addEventListener("click", () => void connect(workspace));
    workspace.querySelector('[data-action="disconnect"]').addEventListener("click", () => void disconnect(workspace));
    workspace.querySelector('[data-action="browser-login"]').addEventListener("click", () => void login(workspace, "chatgpt"));
    workspace.querySelector('[data-action="device-login"]').addEventListener("click", () => void login(workspace, "chatgptDeviceCode"));
    workspace.querySelector('[data-action="api-key-toggle"]').addEventListener("click", () => toggleApiKeyLogin(workspace, true));
    workspace.querySelector('[data-action="api-key-login"]').addEventListener("click", () => void loginWithApiKey(workspace));
    workspace.querySelector('[data-action="api-key-cancel"]').addEventListener("click", () => toggleApiKeyLogin(workspace, false));
    workspace.querySelector('[data-action="local-account"]').addEventListener("click", () => void refreshLocalAccount(workspace));
    workspace.querySelector('[data-action="install-mcp"]').addEventListener("click", () => void installCanvasMcp(workspace));
    workspace.querySelector('[data-action="workspace"]').addEventListener("click", () => void chooseWorkspace(workspace));
    workspace.querySelector('[data-action="new-thread"]').addEventListener("click", () => void startThread(workspace));
    workspace.querySelector('[data-action="refresh"]').addEventListener("click", () => void refreshWorkspace(workspace));
    workspace.querySelector('[data-action="attach"]').addEventListener("click", () => void attach(workspace));
    workspace.querySelector('[data-action="interrupt"]').addEventListener("click", () => void interrupt(workspace));
    workspace.querySelector('[data-action="send"]').addEventListener("click", () => void send(workspace));
    workspace.querySelector('[data-field="thread"]').addEventListener("change", (event) => void resumeThread(workspace, event.target.value));
    workspace.querySelector('[data-field="remote-url"]').addEventListener("change", (event) => localStorage.setItem(STORAGE_REMOTE_URL, event.target.value.trim()));
    workspace.querySelector('[data-field="prompt"]').addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void send(workspace);
      }
    });
    workspace.querySelectorAll("[data-view]").forEach((node) => node.addEventListener("click", () => {
      state.view = node.dataset.view;
      workspace.querySelectorAll("[data-view]").forEach((buttonNode) => buttonNode.classList.toggle("is-active", buttonNode === node));
      workspace.querySelector('[data-role="timeline"]').classList.toggle("is-log-view", state.view === "log");
    }));
    return workspace;
  }

  function updateStatus(workspace, status) {
    state.status = status || state.status;
    state.connected = Boolean(state.status?.running && state.status?.initialized);
    const statusNode = workspace.querySelector(".jiaren-codex-state");
    statusNode.classList.toggle("is-ready", state.connected);
    statusNode.querySelector("b").textContent = statusText(state.status);
    workspace.querySelector('[data-role="workspace-path"]').textContent = state.status?.workspaceRoot || "";
    workspace.querySelector(".jiaren-codex-remote").hidden = state.mode !== "remote";
    workspace.querySelector('[data-action="browser-login"]').hidden = state.mode === "remote";
    workspace.querySelector('[data-action="device-login"]').hidden = state.mode === "remote";
    workspace.querySelector('[data-action="api-key-toggle"]').hidden = state.mode === "remote";
    workspace.querySelector('[data-action="local-account"]').hidden = state.mode === "remote";
    workspace.querySelector('[data-action="install-mcp"]').hidden = state.mode === "remote";
    if (state.mode === "remote") workspace.querySelector(".jiaren-codex-api-key").hidden = true;
    workspace.querySelector('[data-action="workspace"]').disabled = state.connected;
    workspace.querySelector('[data-action="connect"]').disabled = state.busy || state.connected;
    workspace.querySelector('[data-action="disconnect"]').disabled = state.busy || !state.connected;
    workspace.querySelector('[data-action="send"]').disabled = state.busy;
    workspace.querySelector('[data-action="interrupt"]').disabled = !state.turnId;
  }

  async function connect(workspace) {
    if (state.busy) return;
    state.busy = true;
    updateStatus(workspace);
    const timeline = workspace.querySelector('[data-role="timeline"]');
    try {
      const request = state.mode === "remote" ? {
        mode: "remote",
        remoteUrl: workspace.querySelector('[data-field="remote-url"]').value.trim(),
        token: workspace.querySelector('[data-field="remote-token"]').value,
      } : { mode: "local" };
      const status = await window.jiaren.codexAppServer.start(request);
      updateStatus(workspace, status);
      if (!status.running) message(timeline, "tool", status.message || "Codex CLI 不可用。", status.installCommand || "");
      else await loadCatalogs(workspace);
    } catch (error) {
      message(timeline, "tool", error.message || String(error), "连接失败");
    } finally {
      state.busy = false;
      updateStatus(workspace);
    }
  }

  async function disconnect(workspace) {
    state.busy = true;
    try {
      updateStatus(workspace, await window.jiaren.codexAppServer.stop());
      state.threadId = "";
      state.turnId = "";
    } finally {
      state.busy = false;
      updateStatus(workspace);
    }
  }

  function toggleApiKeyLogin(workspace, visible) {
    const row = workspace.querySelector(".jiaren-codex-api-key");
    row.hidden = !visible;
    if (visible) window.setTimeout(() => row.querySelector('[data-field="api-key"]').focus(), 0);
    else row.querySelector('[data-field="api-key"]').value = "";
  }

  async function loginWithApiKey(workspace) {
    const input = workspace.querySelector('[data-field="api-key"]');
    const apiKey = input.value.trim();
    input.value = "";
    if (apiKey.length < 20) {
      const loginBox = workspace.querySelector(".jiaren-codex-login");
      loginBox.hidden = false;
      loginBox.textContent = "请输入有效的 OpenAI API Key。";
      input.focus();
      return;
    }
    await login(workspace, "apiKey", apiKey);
  }

  async function refreshLocalAccount(workspace) {
    if (!state.connected) await connect(workspace);
    if (!state.connected) return;
    const loginBox = workspace.querySelector(".jiaren-codex-login");
    try {
      const result = await window.jiaren.codexAppServer.readAccount(true);
      const status = await window.jiaren.codexAppServer.status();
      updateStatus(workspace, status);
      loginBox.hidden = false;
      loginBox.textContent = result.account ? "已读取本机 Codex 登录状态。" : "本机 Codex CLI 尚未登录。可使用 OpenAI 账号、设备码或 API Key 登录。";
      if (result.account) await loadCatalogs(workspace);
    } catch (error) {
      loginBox.hidden = false;
      loginBox.textContent = friendlyAuthError(error.message || String(error));
    }
  }

  async function installCanvasMcp(workspace) {
    const loginBox = workspace.querySelector(".jiaren-codex-login");
    const buttonNode = workspace.querySelector('[data-action="install-mcp"]');
    buttonNode.disabled = true;
    try {
      const result = await window.jiaren.codexAppServer.installCanvasMcp();
      loginBox.hidden = false;
      loginBox.textContent = result.message || "Jiaren Canvas MCP 已安装。";
    } catch (error) {
      loginBox.hidden = false;
      loginBox.textContent = error.message || String(error);
    } finally {
      buttonNode.disabled = false;
    }
  }

  async function login(workspace, type, credential = "") {
    if (!state.connected) await connect(workspace);
    if (!state.connected) return;
    const loginBox = workspace.querySelector(".jiaren-codex-login");
    try {
      const result = await window.jiaren.codexAppServer.login(type, credential);
      loginBox.hidden = false;
      loginBox.innerHTML = "";
      if (result.type === "apiKey") {
        toggleApiKeyLogin(workspace, false);
        loginBox.append(element("span", "", "API Key 已交给本机 Codex 处理，Jiaren AI 未保存输入框内容。"));
        await refreshLocalAccount(workspace);
        workspace.querySelectorAll('[data-auth-error="1"]').forEach((node) => node.remove());
      } else if (result.authUrl) {
        loginBox.append(element("span", "", "浏览器登录已打开，完成后回到 Jiaren AI。"));
        await window.jiaren.system.openExternal(result.authUrl);
      } else {
        loginBox.append(element("span", "", "在浏览器中打开："), element("b", "", result.verificationUrl || ""), element("strong", "", result.userCode || ""));
        if (result.verificationUrl) await window.jiaren.system.openExternal(result.verificationUrl);
      }
    } catch (error) {
      loginBox.hidden = false;
      loginBox.textContent = friendlyAuthError(error.message || String(error));
    }
  }

  async function chooseWorkspace(workspace) {
    try {
      const result = await window.jiaren.codexAppServer.selectWorkspace();
      if (!result.canceled) updateStatus(workspace, result.status);
    } catch (error) {
      message(workspace.querySelector('[data-role="timeline"]'), "tool", error.message || String(error), "项目目录");
    }
  }

  async function loadCatalogs(workspace, force = false) {
    if (!force && state.catalogsLoadedAt && Date.now() - state.catalogsLoadedAt < 10000) return;
    if (state.catalogsPromise) return state.catalogsPromise;
    const modelSelect = workspace.querySelector('[data-field="model"]');
    const threadSelect = workspace.querySelector('[data-field="thread"]');
    const selectedModel = modelSelect.value;
    const selectedThread = threadSelect.value;
    state.catalogsPromise = (async () => {
      const [models, threads] = await Promise.all([
        window.jiaren.codexAppServer.listModels().catch(() => ({ data: [] })),
        window.jiaren.codexAppServer.listThreads({ limit: 40 }).catch(() => ({ data: [] })),
      ]);
      state.models = models.data || [];
      state.threads = threads.data || [];
      modelSelect.replaceChildren(new Option("自动模型", ""));
      state.models.forEach((model) => modelSelect.add(new Option(model.displayName || model.model || model.id, model.id || model.model)));
      threadSelect.replaceChildren(new Option("新对话", ""));
      state.threads.forEach((thread) => threadSelect.add(new Option(thread.name || thread.preview || `对话 ${thread.id.slice(-6)}`, thread.id)));
      if (selectedModel && [...modelSelect.options].some((option) => option.value === selectedModel)) modelSelect.value = selectedModel;
      const activeThread = state.threadId || selectedThread;
      if (activeThread && [...threadSelect.options].some((option) => option.value === activeThread)) threadSelect.value = activeThread;
      state.catalogsLoadedAt = Date.now();
    })().catch((error) => {
      message(workspace.querySelector('[data-role="timeline"]'), "tool", error.message || String(error), "读取模型与历史失败");
    }).finally(() => { state.catalogsPromise = null; });
    return state.catalogsPromise;
  }

  async function startThread(workspace) {
    if (!state.connected) await connect(workspace);
    if (!state.connected) return null;
    const model = workspace.querySelector('[data-field="model"]').value;
    const result = await window.jiaren.codexAppServer.startThread({ model });
    state.threadId = result.thread?.id || "";
    resetRunState(true);
    workspace.querySelector('[data-role="timeline"]').replaceChildren();
    message(workspace.querySelector('[data-role="timeline"]'), "tool", "新的 Codex 对话已建立。", state.threadId);
    await loadCatalogs(workspace, true);
    workspace.querySelector('[data-field="thread"]').value = state.threadId;
    return state.threadId;
  }

  async function resumeThread(workspace, threadId) {
    if (!threadId) return startThread(workspace);
    const result = await window.jiaren.codexAppServer.resumeThread(threadId);
    state.threadId = result.thread?.id || threadId;
    const history = await window.jiaren.codexAppServer.readThread(state.threadId, true);
    renderHistory(workspace, history.thread);
    return state.threadId;
  }

  function createHistoryRun(timeline) {
    const run = element("details", "jiaren-codex-run is-complete");
    run.open = true;
    const summary = element("summary");
    summary.append(element("strong", "", "已处理"), element("span", "jiaren-codex-run-meta"));
    const body = element("div", "jiaren-codex-run-body");
    run.append(summary, body);
    timeline.appendChild(run);
    return { run, body, meta: summary.querySelector(".jiaren-codex-run-meta"), stats: { commands: 0, files: 0, tools: 0, searches: 0 }, entries: new Map() };
  }

  function historyStatsText(stats) {
    const parts = [];
    if (stats.commands) parts.push(`${stats.commands} 个命令`);
    if (stats.files) parts.push(`${stats.files} 个文件`);
    if (stats.tools) parts.push(`${stats.tools} 个画布操作`);
    if (stats.searches) parts.push(`${stats.searches} 次资料查找`);
    return parts.join(" · ");
  }

  function appendHistoryTool(historyRun, item) {
    const key = toolFamily(item);
    let row = historyRun.entries.get(key);
    const duration = Number(item.durationMs || 0);
    if (row) {
      row.querySelector("span").textContent = friendlyToolText(item, true);
      row.querySelector("small").textContent = duration > 0 ? durationText(duration) : "";
      return;
    }
    row = element("div", "jiaren-codex-run-step is-complete");
    row.append(element("i"), element("span", "", friendlyToolText(item, true)), element("small", "", duration > 0 ? durationText(duration) : ""));
    historyRun.body.appendChild(row);
    historyRun.entries.set(key, row);
    if (item.type === "commandExecution") historyRun.stats.commands += 1;
    else if (item.type === "fileChange") historyRun.stats.files += Array.isArray(item.changes) && item.changes.length ? item.changes.length : 1;
    else if (item.type === "webSearch") historyRun.stats.searches += 1;
    else historyRun.stats.tools += 1;
    historyRun.meta.textContent = historyStatsText(historyRun.stats);
  }

  function renderHistory(workspace, thread) {
    const timeline = workspace.querySelector('[data-role="timeline"]');
    resetRunState(true);
    timeline.replaceChildren();
    let hasConversation = false;
    (thread?.turns || []).forEach((turn) => {
      let historyRun = null;
      const ensureHistoryRun = () => historyRun || (historyRun = createHistoryRun(timeline));
      (turn.items || []).forEach((item) => {
        if (item.type === "userMessage") {
          const content = (item.content || []).map((entry) => entry.text || entry.path || entry.url || "").filter(Boolean).join("\n");
          if (content) {
            hasConversation = true;
            message(timeline, "user", content);
          }
        } else if (item.type === "reasoning") {
          const summary = Array.isArray(item.summary) ? item.summary.filter(Boolean).join("\n\n") : "";
          if (summary) logMessage(timeline, "Codex 推理摘要", summary);
        } else if (item.type === "agentMessage" && item.text) {
          hasConversation = true;
          if (item.phase === "commentary") ensureHistoryRun().body.appendChild(element("p", "jiaren-codex-run-note is-commentary", item.text));
          else message(timeline, "assistant", item.text, item.phase === "final_answer" ? "" : item.phase || "");
        } else if (["commandExecution", "fileChange", "dynamicToolCall", "mcpToolCall", "webSearch"].includes(item.type)) {
          appendHistoryTool(ensureHistoryRun(), item);
          logMessage(timeline, item.command || item.tool || item.query || item.type, item.status || "");
        }
      });
    });
    if (!hasConversation) message(timeline, "tool", "这条对话还没有消息。", thread?.id || "");
  }

  async function attach(workspace) {
    const result = await window.jiaren.system.selectChatAttachments({ mode: "files" });
    if (result?.canceled) return;
    const byPath = new Map(state.attachments.map((item) => [item.localPath || item.id, item]));
    (result.items || []).forEach((item) => byPath.set(item.localPath || item.id, item));
    state.attachments = [...byPath.values()].slice(0, 24);
    renderAttachments(workspace);
  }

  function renderAttachments(workspace) {
    const tray = workspace.querySelector('[data-role="attachments"]');
    tray.hidden = state.attachments.length === 0;
    tray.replaceChildren(...state.attachments.map((item) => {
      const chip = element("span", "jiaren-codex-attachment");
      chip.append(element("b", "", item.name || item.relativePath || "附件"));
      chip.append(button("×", "移除附件", () => {
        state.attachments = state.attachments.filter((entry) => entry !== item);
        renderAttachments(workspace);
      }));
      return chip;
    }));
  }

  function turnInput(prompt) {
    const items = [];
    let combined = prompt;
    state.attachments.forEach((attachment) => {
      if (attachment.kind === "image" && attachment.localPath) {
        items.push({ type: "localImage", path: attachment.localPath });
      } else if (attachment.content) {
        combined += `\n\n<attachment path="${attachment.relativePath || attachment.name || "file"}">\n${attachment.content}\n</attachment>`;
      } else {
        combined += `\n\n附件：${attachment.localPath || attachment.relativePath || attachment.name || "未知文件"}`;
      }
    });
    items.unshift({ type: "text", text: combined || "请阅读附件并继续。" });
    return items;
  }

  async function send(workspace) {
    if (state.busy) return;
    const promptField = workspace.querySelector('[data-field="prompt"]');
    const prompt = promptField.value.trim();
    if (!prompt && state.attachments.length === 0) return;
    const timeline = workspace.querySelector('[data-role="timeline"]');
    try {
      if (!state.connected) await connect(workspace);
      if (!state.connected) throw new Error(state.status?.message || "Codex App Server 未连接。");
      if (isRasterImageRequest(prompt) && state.mode !== "api" && state.status?.capabilities?.imageGeneration !== true) {
        throw new Error("CODEX_IMAGE_CAPABILITY_REQUIRED: built-in image_gen is unavailable for the current Codex login.");
      }
      state.busy = true;
      updateStatus(workspace);
      if (!state.threadId) await startThread(workspace);
      if (!state.threadId) throw new Error("Codex 对话创建失败，请重试。");
      const input = turnInput(prompt);
      state.lastCanvasRequestText = prompt;
      state.currentTurnNeedsCanvasImage = isRasterImageRequest(prompt);
      state.currentTurnCanvasImageCompleted = false;
      message(timeline, "user", prompt || "请阅读附件并继续。", state.attachments.length ? `${state.attachments.length} 个附件` : "");
      resetRunState();
      setActivity(timeline, "Codex 正在思考…");
      promptField.value = "";
      state.attachments = [];
      renderAttachments(workspace);
      state.streamElement = null;
      state.streamBuffer = "";
      state.streamItemId = "";
      const result = await window.jiaren.codexAppServer.startTurn({ threadId: state.threadId, input, model: workspace.querySelector('[data-field="model"]').value });
      state.turnId = result.turn?.id || "";
      updateStatus(workspace);
    } catch (error) {
      clearActivity();
      finishRun();
      message(timeline, "tool", friendlyCodexError(error.message || String(error)), "任务启动失败");
      state.busy = false;
      updateStatus(workspace);
    }
  }

  function flushStream(timeline) {
    state.streamFrame = 0;
    if (!state.streamBuffer) return;
    if (!state.streamElement) state.streamElement = message(timeline, "assistant", "", "流式回复").querySelector("span");
    state.streamElement.textContent += state.streamBuffer;
    state.streamBuffer = "";
    timeline.scrollTop = timeline.scrollHeight;
  }

  function queueStream(timeline, delta, itemId = "") {
    if (itemId && state.streamItemId && itemId !== state.streamItemId) {
      flushStream(timeline);
      state.streamElement = null;
    }
    if (itemId) state.streamItemId = itemId;
    state.streamBuffer += delta;
    if (!state.streamFrame) state.streamFrame = requestAnimationFrame(() => flushStream(timeline));
  }

  async function interrupt(workspace) {
    if (!state.threadId || !state.turnId) return;
    try { await window.jiaren.codexAppServer.interrupt(state.threadId, state.turnId); }
    catch (error) { message(workspace.querySelector('[data-role="timeline"]'), "tool", error.message || String(error), "停止失败"); }
  }

  function renderApprovals(workspace, approvals, canvasPlans = state.agentPlans) {
    const shelf = workspace.querySelector('[data-role="approvals"]');
    const sessionAuthorized = Boolean(state.threadId && state.canvasApprovedThreads.has(state.threadId));
    const commandCards = approvals.map((approval) => {
      const card = element("article", "jiaren-codex-approval");
      const method = text(approval.method);
      const typeLabel = method.includes("fileChange") ? "文件修改" : method.includes("permissions") ? "额外权限" : "命令执行";
      card.append(element("strong", "", typeLabel), element("p", "", approval.reason || approval.command || "Codex 请求继续执行。"));
      if (approval.cwd) card.append(element("small", "", approval.cwd));
      const footer = element("footer");
      footer.append(
        button("拒绝", "拒绝本次操作", () => void resolveApproval(workspace, approval.requestId, "decline")),
        button("本次允许", "仅允许本次操作", () => void resolveApproval(workspace, approval.requestId, "accept"), "is-primary"),
        button("本对话持续允许", "当前 Codex 对话内允许同类操作", () => void resolveApproval(workspace, approval.requestId, "acceptForSession")),
      );
      card.appendChild(footer);
      return card;
    });
    const planCards = canvasPlans.map((plan) => {
      const card = element("article", "jiaren-codex-approval is-canvas-plan");
      const operationCount = Array.isArray(plan.operations) ? plan.operations.length : 0;
      const locked = state.executingPlanIds.has(plan.id);
      card.dataset.planId = plan.id;
      card.append(
        element("strong", "", `画布操作审批 · ${text(plan.title, "未命名计划")}`),
        element("p", "", text(plan.summary, `${operationCount} 项画布操作等待确认。`)),
        element("small", "", `${text(plan.source, "Jiaren Agent")} · ${operationCount} 项操作`),
      );
      const footer = element("footer");
      const rejectButton = button("拒绝", "拒绝本次画布操作", () => void resolveCanvasPlan(workspace, plan, "reject"));
      const approveButton = button(locked ? "执行中" : "批准一次", "仅批准本次画布操作", () => void resolveCanvasPlan(workspace, plan, "approve"), "is-primary");
      const approveSessionButton = button(locked ? "执行中" : "本对话持续授权", "本次 Codex 对话内自动批准后续画布操作", () => void resolveCanvasPlan(workspace, plan, "approveSession"));
      rejectButton.disabled = locked;
      approveButton.disabled = locked;
      approveSessionButton.disabled = locked;
      footer.append(rejectButton, approveButton, approveSessionButton);
      card.appendChild(footer);
      return card;
    });
    const authorizationCards = [];
    if (sessionAuthorized) {
      const card = element("article", "jiaren-codex-session-approval");
      card.append(element("span", "", "当前对话已持续授权画布操作"));
      card.append(button("取消", "取消当前对话的持续授权", () => {
        state.canvasApprovedThreads.delete(state.threadId);
        renderCurrentApprovals(workspace);
      }));
      authorizationCards.push(card);
    }
    shelf.hidden = commandCards.length + planCards.length + authorizationCards.length === 0;
    shelf.replaceChildren(...authorizationCards, ...planCards, ...commandCards);
  }

  function renderCurrentApprovals(workspace) {
    renderApprovals(workspace, state.status?.pendingApprovals || [], state.agentPlans);
  }

  async function resolveApproval(workspace, requestId, action) {
    try {
      await window.jiaren.codexAppServer.resolveApproval(requestId, action, {});
      const status = await window.jiaren.codexAppServer.status();
      updateStatus(workspace, status);
      renderCurrentApprovals(workspace);
      if (action === "acceptForSession") processNotice(workspace.querySelector('[data-role="timeline"]'), "command-session", "本对话已持续允许同类操作", "断开或新建对话后失效");
    } catch (error) {
      message(workspace.querySelector('[data-role="timeline"]'), "tool", error.message || String(error), "审批失败");
    }
  }

  async function refreshCanvasPlans(workspace) {
    if (state.canvasPlansPromise) return state.canvasPlansPromise;
    const control = window.jiaren?.agentControl;
    if (!control) {
      state.agentPlans = [];
      renderCurrentApprovals(workspace);
      return;
    }
    state.canvasPlansPromise = (async () => {
      const plans = await control.listPlans("pending");
      state.agentPlans = Array.isArray(plans) ? plans : [];
      renderCurrentApprovals(workspace);
      if (state.threadId && state.canvasApprovedThreads.has(state.threadId)) {
        const pending = state.agentPlans.filter((plan) => !state.executingPlanIds.has(plan.id));
        for (const plan of pending) await resolveCanvasPlan(workspace, plan, "approve", { automatic: true, skipRefresh: true });
        const remaining = await control.listPlans("pending");
        state.agentPlans = Array.isArray(remaining) ? remaining : [];
        renderCurrentApprovals(workspace);
      }
    })().catch((error) => {
      message(workspace.querySelector('[data-role="timeline"]'), "tool", error.message || String(error), "画布审批读取失败");
    }).finally(() => { state.canvasPlansPromise = null; });
    return state.canvasPlansPromise;
  }

  async function resolveCanvasPlan(workspace, plan, action, options = {}) {
    const control = window.jiaren?.agentControl;
    const bridge = window.__JIAREN_CANVAS_AGENT__;
    if (!control || state.executingPlanIds.has(plan.id)) return;
    if (action !== "reject" && !bridge?.applyOperations) {
      message(workspace.querySelector('[data-role="timeline"]'), "tool", "当前画布尚未就绪，请进入画布后重试。", "画布审批");
      return;
    }
    if (action !== "reject" && planContainsSvg(plan) && !isExplicitVectorRequest(state.lastCanvasRequestText)) {
      await control.rejectPlan(plan.id, "普通图片请求不允许使用 SVG；请改用 jiaren_canvas_generate_image。");
      message(
        workspace.querySelector('[data-role="timeline"]'),
        "tool",
        "已拦截错误的 SVG 方案。产品主图、电商图和写实图必须调用真实图片生成并回传画布。",
        "图片路由保护",
      );
      if (!options.skipRefresh) await refreshCanvasPlans(workspace);
      return;
    }
    if (action === "approveSession" && state.threadId) {
      state.canvasApprovedThreads.add(state.threadId);
      processNotice(workspace.querySelector('[data-role="timeline"]'), "canvas-session", "本对话已持续授权画布操作", "后续计划自动执行；重启或新对话后失效");
    }
    state.executingPlanIds.add(plan.id);
    renderCurrentApprovals(workspace);
    let approved = false;
    let delegatedImageNodeId = "";
    const directCodexImagePlan = planContainsCodexImage(plan);
    try {
      if (action === "reject") {
        await control.rejectPlan(plan.id, "用户已拒绝本次画布操作。");
        message(workspace.querySelector('[data-role="timeline"]'), "tool", `已拒绝“${text(plan.title, "画布操作计划")}”。`, "画布审批");
      } else {
        bridge.previewOperations?.(plan.operations);
        await control.approvePlan(plan.id);
        approved = true;
        const result = await bridge.applyOperations(plan.operations);
        const runReceipt = Array.isArray(result?.receipts) ? result.receipts.find((item) => item.type === "run.node" && item.queued) : null;
        const generatedNode = runReceipt?.nodeId && Array.isArray(result?.snapshot?.nodes)
          ? result.snapshot.nodes.find((item) => item.id === runReceipt.nodeId)
          : null;
        const delegatedImageRun = generatedNode?.data?.agentTransient === true
          || generatedNode?.data?.agentSource === "jiaren-codex";
        if (delegatedImageRun) {
          delegatedImageNodeId = runReceipt.nodeId;
          const timeline = workspace.querySelector('[data-role="timeline"]');
          const generationNoticeId = `generation:${runReceipt.nodeId}`;
          processNotice(timeline, generationNoticeId, "图片正在生成", "等待画布收到最终图片，不会提前报告成功。", "queued");
          const terminal = await waitForGeneration(runReceipt.nodeId);
          if (terminal.status !== "succeeded") {
            throw new Error(text(terminal.message, "图片任务未完成，请检查当前图片接口配置后重试"));
          }
          const finalSnapshot = bridge.getSnapshot();
          const finalNode = Array.isArray(finalSnapshot?.nodes)
            ? finalSnapshot.nodes.find((node) => node.id === runReceipt.nodeId)
            : null;
          if (finalNode?.data?.agentResult !== true || finalNode?.data?.kind !== "imageInput" || finalImageSources(finalNode).length === 0) {
            throw new Error("图片接口报告完成，但画布没有收到最终图片。");
          }
          state.currentTurnCanvasImageCompleted = true;
          const finalResult = { ...result, snapshot: finalSnapshot, generation: terminal };
          await control.completePlan(plan.id, { ok: true, summary: "图片生成完成，最终图片已放入画布。", result: finalResult });
          processNotice(timeline, generationNoticeId, "图片生成完成", text(terminal.message, "最终图片已放入画布。"), "complete");
        } else {
          if (directCodexImagePlan) state.currentTurnCanvasImageCompleted = true;
          await control.completePlan(plan.id, { ok: true, summary: directCodexImagePlan ? "Codex 生成图片已放入画布。" : "画布操作已执行。", result });
          processNotice(
            workspace.querySelector('[data-role="timeline"]'),
            `plan:${plan.id}`,
            runReceipt ? "生成任务已提交" : `${options.automatic ? "已自动执行" : "已执行"}画布操作`,
            runReceipt ? "画布任务已进入队列，结果将在节点内更新。" : `${text(plan.title, "画布操作计划")} · ${plan.operations.length} 项操作`,
            runReceipt ? "queued" : "complete",
          );
        }
      }
    } catch (error) {
      if (approved) {
        try {
          await control.completePlan(plan.id, { ok: false, summary: "画布操作执行失败。", error: error.message || String(error) });
        } catch {}
      }
      if (delegatedImageNodeId) {
        processNotice(workspace.querySelector('[data-role="timeline"]'), `generation:${delegatedImageNodeId}`, "图片生成失败", error.message || String(error), "failed");
      } else {
        message(workspace.querySelector('[data-role="timeline"]'), "tool", error.message || String(error), "画布审批失败");
      }
    } finally {
      state.executingPlanIds.delete(plan.id);
      if (!options.skipRefresh) await refreshCanvasPlans(workspace);
    }
  }

  function handleEvent(workspace, event) {
    const timeline = workspace.querySelector('[data-role="timeline"]');
    if (event.type === "approval.requested") {
      void window.jiaren.codexAppServer.status().then((status) => {
        updateStatus(workspace, status);
        renderCurrentApprovals(workspace);
      });
      return;
    }
    if (event.type === "connection.closed") {
      finishRun();
      state.busy = false;
      state.connected = false;
      state.canvasApprovedThreads.clear();
      rejectGenerationWaiters(new Error("Codex 连接已断开，图片任务没有收到最终结果。"));
      message(timeline, "tool", event.message || "连接已断开。", "连接");
      void refreshWorkspace(workspace);
      return;
    }
    if (event.type !== "notification") {
      if (event.type === "image.generation.imported") {
        processNotice(timeline, `codex-image:${event.itemId || "image"}`, "\u56fe\u7247\u751f\u6210\u5b8c\u6210", "\u6700\u7ec8\u56fe\u7247\u5df2\u63a5\u6536\uff0c\u6b63\u5728\u653e\u5165\u5f53\u524d\u753b\u5e03\u3002", "complete");
        void refreshCanvasPlans(workspace);
        return;
      }
      if (event.type === "image.generation.failed") {
        processNotice(timeline, `codex-image:${event.itemId || "image"}`, "\u56fe\u7247\u751f\u6210\u5931\u8d25", friendlyCodexError(event.message), "failed");
        return;
      }
      if (event.type?.startsWith("canvas.tool")) {
        logMessage(timeline, event.tool || event.message || "画布工具", event.type.endsWith("failed") ? "失败" : "完成");
        if (event.type.endsWith("started")) setActivity(timeline, "Codex 正在操作画布…");
        if (event.type.endsWith("failed")) {
          clearActivity();
          message(timeline, "tool", event.message || "画布操作失败。", "画布工具失败");
        }
      }
      return;
    }
    const method = event.method;
    const params = event.params || {};
    if (method === "item/reasoning/summaryTextDelta") {
      setActivity(timeline, "Codex 正在梳理方案…");
    } else if (method === "item/reasoning/summaryPartAdded") {
      setActivity(timeline, "Codex 正在梳理方案…");
    } else if (method === "item/plan/delta") {
      appendRunNarrative(timeline, `plan:${params.itemId}`, params.delta || "", "is-plan");
      setActivity(timeline, "Codex 正在制定执行步骤…");
    } else if (method === "item/agentMessage/delta") {
      const phase = state.messagePhases.get(params.itemId) || "";
      if (phase === "commentary") {
        appendRunNarrative(timeline, `commentary:${params.itemId}`, params.delta || "", "is-commentary");
        setActivity(timeline, "Codex 正在继续处理…");
      } else {
        queueStream(timeline, params.delta || "", params.itemId || "");
      }
    } else if (method === "item/started" || method === "item/completed") {
      const item = params.item || {};
      const completed = method === "item/completed";
      if (item.type === "agentMessage") {
        state.messagePhases.set(item.id, item.phase || "");
        if (completed && item.text) {
          if (item.phase === "commentary" && !state.runEntries.has(`commentary:${item.id}`)) {
            appendRunNarrative(timeline, `commentary:${item.id}`, item.text, "is-commentary");
          } else if (item.phase !== "commentary" && state.streamItemId !== item.id) {
            message(timeline, "assistant", item.text);
          }
        }
      } else if (item.type === "reasoning" && completed) {
        const summary = (item.summary || []).filter(Boolean).join("\n\n");
        if (summary) logMessage(timeline, "Codex 推理摘要", summary);
      }
      if (["commandExecution", "fileChange", "dynamicToolCall", "mcpToolCall", "webSearch", "imageGeneration"].includes(item.type)) {
        logMessage(timeline, item.command || item.tool || item.query || item.type, `${item.type} · ${item.status || (method.endsWith("completed") ? "completed" : "running")}`);
        updateRunTool(timeline, item, completed);
        setActivity(timeline, completed ? "Codex 正在继续处理…" : activityLabel(item.type));
      }
    } else if (method === "turn/started") {
      state.turnId = params.turn?.id || state.turnId;
      setActivity(timeline, "Codex 正在思考…");
    } else if (method === "turn/completed") {
      flushStream(timeline);
      finishRun();
      state.busy = false;
      state.streamElement = null;
      state.streamItemId = "";
      state.turnId = "";
      const turn = params.turn || {};
      if (turn.status === "failed") message(timeline, "tool", friendlyCodexError(turn.error?.message), "失败");
      const pendingImagePlan = state.agentPlans.some((plan) => planContainsDelegatedImage(plan) || planContainsCodexImage(plan))
        || state.executingPlanIds.size > 0;
      if (turn.status !== "failed" && state.currentTurnNeedsCanvasImage && !state.currentTurnCanvasImageCompleted && !pendingImagePlan) {
        message(
          timeline,
          "tool",
          "Codex 未返回可导入的最终图片。请确认当前使用 OpenAI/Codex 账号登录，并且账号具有内置生图能力。Jiaren Agent 不会转发到软件图片 API 或其他模型。",
          "图片未回传画布",
        );
      }
      updateStatus(workspace);
    } else if (method === "account/login/completed") {
      const loginBox = workspace.querySelector(".jiaren-codex-login");
      if (params.success === false) {
        const accountMode = state.status?.account?.authMode || state.status?.account?.type;
        if (accountMode === "apiKey") return;
        loginBox.hidden = false;
        loginBox.textContent = friendlyAuthError(params.error);
        const authMessage = message(timeline, "tool", friendlyAuthError(params.error), "OpenAI 登录失败");
        authMessage.closest(".jiaren-codex-message").dataset.authError = "1";
      } else {
        loginBox.hidden = false;
        loginBox.textContent = "Codex 登录成功。";
      }
      void refreshWorkspace(workspace);
    } else if (method === "account/updated") {
      void refreshWorkspace(workspace);
    }
  }

  async function refreshWorkspace(workspace, forceCatalogs = false) {
    if (!workspace || state.mode === "api") return;
    if (state.refreshPromise) return state.refreshPromise;
    state.refreshPromise = (async () => {
      const [status, plans] = await Promise.all([
        window.jiaren.codexAppServer.status(),
        window.jiaren?.agentControl?.listPlans("pending").catch(() => []) || [],
      ]);
      state.agentPlans = Array.isArray(plans) ? plans : [];
      updateStatus(workspace, status);
      renderCurrentApprovals(workspace);
      if (status.running && status.initialized) await loadCatalogs(workspace, forceCatalogs);
    })().catch((error) => {
      message(workspace.querySelector('[data-role="timeline"]'), "tool", error.message || String(error), "状态读取失败");
    }).finally(() => { state.refreshPromise = null; });
    return state.refreshPromise;
  }

  function mount(panel) {
    if (!window.jiaren?.codexAppServer || panel.dataset.codexV112 === "1") return;
    panel.dataset.codexV112 = "1";
    createModeSwitch(panel);
    const workspace = createWorkspace(panel);
    if (typeof state.eventCleanup === "function") state.eventCleanup();
    state.eventCleanup = window.jiaren.codexAppServer.onEvent((event) => handleEvent(workspace, event));
    if (typeof state.agentControlCleanup === "function") state.agentControlCleanup();
    state.agentControlCleanup = window.jiaren?.agentControl?.onEvent?.((event) => {
      if (event?.type?.startsWith("plan.")) void refreshCanvasPlans(workspace);
    }) || null;
    if (typeof state.jiarenAgentGenerationCleanup === "function") state.jiarenAgentGenerationCleanup();
    const generationStatusHandler = (event) => {
      const detail = generationStatusDetail(event?.detail);
      rememberGenerationStatus(detail);
      if (!detail.nodeId || !["queued", "running", "succeeded", "failed", "canceled"].includes(detail.status)) return;
      const succeeded = detail.status === "succeeded";
      processNotice(
        workspace.querySelector('[data-role="timeline"]'),
        `generation:${text(detail.nodeId, "image")}`,
        succeeded ? "图片生成完成" : detail.status === "failed" || detail.status === "canceled" ? "图片生成失败" : "图片正在生成",
        text(detail.message, succeeded ? "最终图片已放入画布" : detail.status === "queued" ? "任务已提交，等待接口返回最终图片。" : "正在等待接口返回最终图片。"),
        succeeded ? "complete" : detail.status === "failed" || detail.status === "canceled" ? "failed" : "queued",
      );
    };
    window.addEventListener("jiaren-agent-generation-status", generationStatusHandler);
    state.jiarenAgentGenerationCleanup = () =>
      window.removeEventListener("jiaren-agent-generation-status", generationStatusHandler);
    setMode(state.mode);
  }

  let mountQueued = false;
  const observer = new MutationObserver((records) => {
    const hasNewPanel = records.some((record) => [...record.addedNodes].some((node) =>
      node.nodeType === Node.ELEMENT_NODE
      && (node.matches?.(".jiaren-agent-panel") || node.querySelector?.(".jiaren-agent-panel"))
    ));
    if (!hasNewPanel) return;
    if (mountQueued) return;
    mountQueued = true;
    queueMicrotask(() => {
      mountQueued = false;
      const panel = activePanel();
      if (panel && panel.dataset.codexV112 !== "1") mount(panel);
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  const panel = activePanel();
  if (panel) mount(panel);
})();

/* Jiaren Agent delegated image privacy v112 */
