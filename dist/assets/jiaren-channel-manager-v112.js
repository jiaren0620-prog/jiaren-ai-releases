(function () {
  "use strict";

  const SESSION_SECRET_PLACEHOLDER = "jiaren-channel-session";
  const CAPABILITIES = [
    ["text", "对话"],
    ["image", "图片"],
    ["video", "视频"],
    ["audio", "音频"],
  ];
  const state = { definitions: [], selectedId: "", busy: false, modal: null };

  function text(value, fallback = "") {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function slug(value) {
    return text(value, `channel-${Date.now()}`).replace(/[^a-zA-Z0-9_.-]/g, "-").replace(/-+/g, "-").slice(0, 120);
  }

  function field(modal, name) {
    return modal.querySelector(`[data-field="${name}"]`);
  }

  function setStatus(modal, message, tone = "") {
    const node = modal.querySelector("[data-role='status']");
    node.textContent = message || "";
    node.dataset.tone = tone;
  }

  function parseJson(value, label, fallback) {
    const source = String(value || "").trim();
    if (!source) return fallback;
    try { return JSON.parse(source); }
    catch { throw new Error(`${label}不是有效 JSON。`); }
  }

  function defaultDefinition() {
    return {
      id: `custom-${Date.now()}`,
      name: "自定义图片渠道",
      capabilities: ["image"],
      models: [{ modelId: "image-model-id", alias: "自定义图片模型", capability: "image", enabled: true }],
      request: {
        method: "POST",
        urlTemplate: "https://api.example.com/v1/images/generations",
        headers: { Authorization: "Bearer {{secret.apiKey}}", "Content-Type": "application/json" },
        bodyTemplate: { model: "{{input.endpointModelId}}", prompt: "{{input.prompt}}" },
      },
      resultPath: "data",
      taskIdPath: "",
      polling: null,
      timeoutMs: 60000,
      enabled: true,
      sessionSecrets: {},
    };
  }

  function selectedDefinition() {
    return state.definitions.find((item) => item.id === state.selectedId) || null;
  }

  function iconForModel(modelId) {
    const id = String(modelId || "").toLowerCase();
    if (/^(gpt|o[134])|openai|dall-e/.test(id)) return "openai";
    if (/claude/.test(id)) return "claude";
    if (/gemini|medlm|learnlm|seclm|omni|veo/.test(id)) return "google";
    if (/^mj|midjourney/.test(id)) return "midjourney";
    if (/kling/.test(id)) return "kling";
    if (/flux/.test(id)) return "flux";
    if (/seedream|doubao|seedance/.test(id)) return "doubao";
    if (/deepseek/.test(id)) return "deepseek";
    if (/minimax|speech|t12v/.test(id)) return "minimax";
    if (/qwen|qwq|wan2/.test(id)) return "qwen";
    if (/grok/.test(id)) return "xai";
    if (/fal/.test(id)) return "fal";
    return "jiaren";
  }

  function categoryForCapability(capability) {
    return capability === "text" ? "chat" : capability === "audio" ? "music" : capability;
  }

  function requestModeForCapability(capability) {
    return capability === "text" ? "openai-chat" : capability === "image" ? "openai-image" : capability === "video" ? "openai-video" : "unknown";
  }

  function createModelRow(model = {}) {
    const row = document.createElement("div");
    row.className = "jiaren-channel-model-row";
    const modelId = document.createElement("input");
    modelId.placeholder = "模型 ID";
    modelId.value = model.modelId || "";
    modelId.dataset.modelField = "modelId";
    const alias = document.createElement("input");
    alias.placeholder = "显示名称";
    alias.value = model.alias || "";
    alias.dataset.modelField = "alias";
    const capability = document.createElement("select");
    capability.dataset.modelField = "capability";
    CAPABILITIES.forEach(([value, label]) => capability.add(new Option(label, value)));
    capability.value = model.capability || "image";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "jiaren-channel-icon-button";
    remove.title = "删除模型";
    remove.setAttribute("aria-label", "删除模型");
    remove.textContent = "×";
    remove.addEventListener("click", () => row.remove());
    row.append(modelId, alias, capability, remove);
    return row;
  }

  function renderModels(modal, models) {
    const list = modal.querySelector("[data-role='models']");
    list.replaceChildren(...(models || []).map(createModelRow));
    if (!list.childElementCount) list.appendChild(createModelRow());
  }

  function renderDefinitionList(modal) {
    const list = modal.querySelector("[data-role='definitions']");
    list.replaceChildren();
    state.definitions.forEach((definition) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `jiaren-channel-list-item${definition.id === state.selectedId ? " is-active" : ""}`;
      const name = document.createElement("strong");
      name.textContent = definition.name;
      const meta = document.createElement("span");
      meta.textContent = definition.capabilities.map((value) => CAPABILITIES.find(([id]) => id === value)?.[1] || value).join(" / ");
      const secret = document.createElement("i");
      secret.textContent = definition.sessionSecrets?.apiKey ? "Key 已载入" : "待输入 Key";
      button.append(name, meta, secret);
      button.addEventListener("click", () => {
        state.selectedId = definition.id;
        fillForm(modal, definition);
        renderDefinitionList(modal);
      });
      list.appendChild(button);
    });
    modal.querySelector("[data-role='empty-list']").hidden = state.definitions.length > 0;
  }

  function fillForm(modal, definition) {
    const value = definition || defaultDefinition();
    field(modal, "name").value = value.name || "";
    field(modal, "id").value = value.id || "";
    field(modal, "enabled").checked = value.enabled !== false;
    CAPABILITIES.forEach(([capability]) => {
      field(modal, `capability-${capability}`).checked = value.capabilities?.includes(capability) || false;
    });
    field(modal, "method").value = value.request?.method || "POST";
    field(modal, "urlTemplate").value = value.request?.urlTemplate || "";
    field(modal, "headers").value = JSON.stringify(value.request?.headers || {}, null, 2);
    field(modal, "bodyTemplate").value = value.request?.bodyTemplate === null ? "" : JSON.stringify(value.request?.bodyTemplate || {}, null, 2);
    field(modal, "resultPath").value = value.resultPath || "";
    field(modal, "taskIdPath").value = value.taskIdPath || "";
    field(modal, "timeoutMs").value = value.timeoutMs || 60000;
    field(modal, "pollingEnabled").checked = Boolean(value.polling);
    field(modal, "pollingUrl").value = value.polling?.urlTemplate || "";
    field(modal, "pollingStatusPath").value = value.polling?.statusPath || "status";
    field(modal, "pollingResultPath").value = value.polling?.resultPath || value.resultPath || "";
    field(modal, "pollingSuccess").value = (value.polling?.successValues || ["succeeded", "completed", "success"]).join(", ");
    field(modal, "pollingFailure").value = (value.polling?.failureValues || ["failed", "error", "cancelled"]).join(", ");
    field(modal, "pollingInterval").value = value.polling?.intervalMs || 1500;
    field(modal, "pollingAttempts").value = value.polling?.maxAttempts || 120;
    field(modal, "apiKey").value = "";
    field(modal, "apiKey").placeholder = value.sessionSecrets?.apiKey ? "本次启动已载入" : "仅本次启动使用";
    modal.querySelector("[data-section='polling']").hidden = !value.polling;
    renderModels(modal, value.models);
    setStatus(modal, "");
  }

  function readForm(modal) {
    const capabilities = CAPABILITIES.filter(([capability]) => field(modal, `capability-${capability}`).checked).map(([capability]) => capability);
    const models = [...modal.querySelectorAll(".jiaren-channel-model-row")].flatMap((row) => {
      const modelId = text(row.querySelector("[data-model-field='modelId']").value);
      if (!modelId) return [];
      return [{
        modelId,
        alias: text(row.querySelector("[data-model-field='alias']").value, modelId),
        capability: row.querySelector("[data-model-field='capability']").value,
        enabled: true,
      }];
    });
    const pollingEnabled = field(modal, "pollingEnabled").checked;
    return {
      id: slug(field(modal, "id").value),
      name: text(field(modal, "name").value, "未命名渠道"),
      enabled: field(modal, "enabled").checked,
      capabilities,
      models,
      request: {
        method: field(modal, "method").value,
        urlTemplate: text(field(modal, "urlTemplate").value),
        headers: parseJson(field(modal, "headers").value, "Headers", {}),
        bodyTemplate: parseJson(field(modal, "bodyTemplate").value, "Body 模板", null),
      },
      resultPath: text(field(modal, "resultPath").value),
      taskIdPath: text(field(modal, "taskIdPath").value),
      polling: pollingEnabled ? {
        method: "GET",
        urlTemplate: text(field(modal, "pollingUrl").value),
        statusPath: text(field(modal, "pollingStatusPath").value, "status"),
        resultPath: text(field(modal, "pollingResultPath").value),
        successValues: field(modal, "pollingSuccess").value.split(/[,，]/).map(text).filter(Boolean),
        failureValues: field(modal, "pollingFailure").value.split(/[,，]/).map(text).filter(Boolean),
        intervalMs: Number(field(modal, "pollingInterval").value) || 1500,
        maxAttempts: Number(field(modal, "pollingAttempts").value) || 120,
      } : null,
      timeoutMs: Number(field(modal, "timeoutMs").value) || 60000,
    };
  }

  async function refresh(modal, preferredId = state.selectedId) {
    state.definitions = await window.jiaren.channelDriver.list();
    state.selectedId = state.definitions.some((item) => item.id === preferredId) ? preferredId : state.definitions[0]?.id || "";
    renderDefinitionList(modal);
    fillForm(modal, selectedDefinition());
  }

  async function save(modal) {
    if (state.busy) return null;
    state.busy = true;
    setStatus(modal, "正在保存...");
    try {
      const definition = readForm(modal);
      const saved = await window.jiaren.channelDriver.save(definition);
      const apiKey = field(modal, "apiKey").value.trim();
      if (apiKey) await window.jiaren.channelDriver.setSessionSecrets(saved.id, { apiKey });
      state.selectedId = saved.id;
      await refresh(modal, saved.id);
      setStatus(modal, "渠道已保存。", "success");
      return saved;
    } catch (error) {
      setStatus(modal, error.message || String(error), "error");
      return null;
    } finally {
      state.busy = false;
    }
  }

  async function testChannel(modal) {
    const saved = await save(modal);
    if (!saved) return;
    state.busy = true;
    setStatus(modal, "正在调用测试请求...");
    try {
      const firstModel = saved.models?.[0];
      const input = {
        modelId: firstModel?.catalogId || "",
        endpointModelId: firstModel?.modelId || "",
        model: firstModel?.modelId || "",
        prompt: "Jiaren AI connection test",
        messages: [{ role: "user", content: "Jiaren AI connection test" }],
        count: 1,
      };
      const result = await window.jiaren.channelDriver.invoke(saved.id, input, {});
      const preview = JSON.stringify(result.data ?? result.raw ?? {}, null, 2).slice(0, 360);
      setStatus(modal, `测试成功：${preview}`, "success");
    } catch (error) {
      setStatus(modal, error.message || String(error), "error");
    } finally {
      state.busy = false;
    }
  }

  async function applyModels(modal) {
    const saved = await save(modal);
    if (!saved) return;
    state.busy = true;
    setStatus(modal, "正在更新模型目录...");
    try {
      const [preferences, catalog] = await Promise.all([
        window.jiaren.system.loadPreferences(),
        window.jiaren.channelDriver.catalog(),
      ]);
      const runtimeSettings = preferences.runtimeSettings || { global: {}, models: [] };
      const source = `jiaren-channel:${saved.id}`;
      const currentModels = (runtimeSettings.models || []).filter((model) => model.providerSource !== source);
      const installed = catalog.filter((model) => model.driverId === saved.id).map((model) => ({
        id: model.catalogId,
        alias: model.alias,
        modelId: model.modelId,
        endpointModelId: model.modelId,
        category: categoryForCapability(model.capability),
        provider: "JiarenAI",
        providerSource: source,
        icon: iconForModel(model.modelId),
        requestMode: requestModeForCapability(model.capability),
        baseUrl: `https://channel.jiaren.invalid/${saved.id}`,
        apiKey: SESSION_SECRET_PLACEHOLDER,
        enabled: true,
        status: "untested",
      }));
      const result = await window.jiaren.system.savePreferences({
        ...preferences,
        runtimeSettings: { ...runtimeSettings, models: [...currentModels, ...installed] },
      });
      if (!result?.ok) throw new Error(result?.message || "模型目录保存失败。");
      setStatus(modal, `已应用 ${installed.length} 个模型，正在刷新画布...`, "success");
      window.setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      setStatus(modal, error.message || String(error), "error");
    } finally {
      state.busy = false;
    }
  }

  async function removeSelected(modal) {
    const definition = selectedDefinition();
    if (!definition || state.busy) return;
    state.busy = true;
    try {
      await window.jiaren.channelDriver.remove(definition.id);
      const preferences = await window.jiaren.system.loadPreferences();
      const runtimeSettings = preferences.runtimeSettings || { global: {}, models: [] };
      runtimeSettings.models = (runtimeSettings.models || []).filter((model) => model.providerSource !== `jiaren-channel:${definition.id}`);
      await window.jiaren.system.savePreferences({ ...preferences, runtimeSettings });
      state.selectedId = "";
      await refresh(modal, "");
      setStatus(modal, "渠道和对应模型已删除。", "success");
    } catch (error) {
      setStatus(modal, error.message || String(error), "error");
    } finally {
      state.busy = false;
    }
  }

  function createModal() {
    const backdrop = document.createElement("div");
    backdrop.className = "jiaren-channel-backdrop";
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <section class="jiaren-channel-manager" role="dialog" aria-modal="true" aria-label="多渠道接口">
        <header class="jiaren-channel-head">
          <div><strong>多渠道接口</strong><span>JiarenAI Declarative HTTP</span></div>
          <button type="button" data-action="close" title="关闭" aria-label="关闭">×</button>
        </header>
        <div class="jiaren-channel-layout">
          <aside class="jiaren-channel-sidebar">
            <button type="button" class="is-primary" data-action="new">新建渠道</button>
            <div data-role="definitions" class="jiaren-channel-list"></div>
            <p data-role="empty-list" class="jiaren-channel-empty">暂无渠道</p>
          </aside>
          <main class="jiaren-channel-content">
            <section class="jiaren-channel-band jiaren-channel-identity">
              <label><span>渠道名称</span><input data-field="name" /></label>
              <label><span>渠道 ID</span><input data-field="id" /></label>
              <label class="jiaren-channel-toggle"><input type="checkbox" data-field="enabled" /><span>启用</span></label>
            </section>
            <section class="jiaren-channel-band">
              <div class="jiaren-channel-section-title"><strong>能力与模型</strong><button type="button" data-action="add-model">添加模型</button></div>
              <div class="jiaren-channel-capabilities">
                <label><input type="checkbox" data-field="capability-text" /><span>对话</span></label>
                <label><input type="checkbox" data-field="capability-image" /><span>图片</span></label>
                <label><input type="checkbox" data-field="capability-video" /><span>视频</span></label>
                <label><input type="checkbox" data-field="capability-audio" /><span>音频</span></label>
              </div>
              <div class="jiaren-channel-model-head"><span>模型 ID</span><span>显示名称</span><span>能力</span><span></span></div>
              <div data-role="models" class="jiaren-channel-models"></div>
            </section>
            <section class="jiaren-channel-band jiaren-channel-request">
              <div class="jiaren-channel-section-title"><strong>请求</strong></div>
              <label class="method"><span>Method</span><select data-field="method"><option>POST</option><option>GET</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select></label>
              <label class="url"><span>URL 模板</span><input data-field="urlTemplate" /></label>
              <label><span>Headers JSON</span><textarea data-field="headers" spellcheck="false"></textarea></label>
              <label><span>Body 模板 JSON</span><textarea data-field="bodyTemplate" spellcheck="false"></textarea></label>
              <label><span>结果路径</span><input data-field="resultPath" placeholder="data.0.url" /></label>
              <label><span>任务 ID 路径</span><input data-field="taskIdPath" placeholder="task.id" /></label>
              <label><span>超时 ms</span><input type="number" min="1000" max="300000" data-field="timeoutMs" /></label>
              <label><span>本次启动 API Key</span><input type="password" autocomplete="off" data-field="apiKey" /></label>
            </section>
            <section class="jiaren-channel-band">
              <label class="jiaren-channel-toggle"><input type="checkbox" data-field="pollingEnabled" /><span>异步轮询</span></label>
              <div data-section="polling" class="jiaren-channel-polling">
                <label class="wide"><span>轮询 URL 模板</span><input data-field="pollingUrl" placeholder="https://api.example.com/tasks/{{task.id}}" /></label>
                <label><span>状态路径</span><input data-field="pollingStatusPath" /></label>
                <label><span>结果路径</span><input data-field="pollingResultPath" /></label>
                <label><span>成功状态</span><input data-field="pollingSuccess" /></label>
                <label><span>失败状态</span><input data-field="pollingFailure" /></label>
                <label><span>间隔 ms</span><input type="number" min="500" max="30000" data-field="pollingInterval" /></label>
                <label><span>最多次数</span><input type="number" min="1" max="1200" data-field="pollingAttempts" /></label>
              </div>
            </section>
            <footer class="jiaren-channel-actions">
              <p data-role="status" aria-live="polite"></p>
              <button type="button" data-action="delete" class="is-danger">删除</button>
              <button type="button" data-action="test">测试</button>
              <button type="button" data-action="save">保存</button>
              <button type="button" data-action="apply" class="is-primary">应用模型</button>
            </footer>
          </main>
        </div>
      </section>`;
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeModal(); });
    backdrop.querySelector("[data-action='close']").addEventListener("click", closeModal);
    backdrop.querySelector("[data-action='new']").addEventListener("click", () => {
      state.selectedId = "";
      renderDefinitionList(backdrop);
      fillForm(backdrop, defaultDefinition());
    });
    backdrop.querySelector("[data-action='add-model']").addEventListener("click", () => backdrop.querySelector("[data-role='models']").appendChild(createModelRow()));
    backdrop.querySelector("[data-action='save']").addEventListener("click", () => void save(backdrop));
    backdrop.querySelector("[data-action='test']").addEventListener("click", () => void testChannel(backdrop));
    backdrop.querySelector("[data-action='apply']").addEventListener("click", () => void applyModels(backdrop));
    backdrop.querySelector("[data-action='delete']").addEventListener("click", () => void removeSelected(backdrop));
    field(backdrop, "pollingEnabled").addEventListener("change", (event) => {
      backdrop.querySelector("[data-section='polling']").hidden = !event.target.checked;
    });
    return backdrop;
  }

  async function openModal() {
    if (!window.jiaren?.channelDriver) return;
    state.modal ||= createModal();
    state.modal.hidden = false;
    await refresh(state.modal);
  }

  function closeModal() {
    if (state.modal) state.modal.hidden = true;
  }

  function mountEntry(panel) {
    if (!panel) return;
    panel.dataset.channelManagerV112 = "disabled";
    panel.querySelectorAll(".jiaren-channel-entry").forEach((entry) => entry.remove());
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.modal && !state.modal.hidden) closeModal();
  });
  const observer = new MutationObserver(() => document.querySelectorAll(".jiaren-agent-panel").forEach(mountEntry));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.querySelectorAll(".jiaren-agent-panel").forEach(mountEntry);
})();

/* Jiaren Agent mode boundaries v112 */
