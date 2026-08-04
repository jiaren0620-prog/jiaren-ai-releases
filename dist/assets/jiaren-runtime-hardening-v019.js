(function () {
  "use strict";

  const NOTICE_KEY = "jiaren-v019-launch-notice-shown";
  const PLAN_TYPES = new Set([
    "node.add",
    "node.update",
    "node.delete",
    "node.select",
    "edge.add",
    "edge.remove",
    "asset.add",
    "run.node",
  ]);
  const previewStates = new WeakMap();
  const submittedPlans = new Set();
  const imageTaskUiStates = new Map();
  let edgeMenu;
  let queuePill;

  function button(label, title, handler, className) {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = label;
    element.title = title;
    element.setAttribute("aria-label", title);
    if (className) element.className = className;
    element.addEventListener("click", handler);
    return element;
  }

  function showLaunchNotice() {
    try {
      if (sessionStorage.getItem(NOTICE_KEY) === "1") return;
      sessionStorage.setItem(NOTICE_KEY, "1");
    } catch {}
    const backdrop = document.createElement("div");
    backdrop.className = "jiaren-launch-notice-backdrop";
    backdrop.innerHTML = `
      <section class="jiaren-launch-notice" role="dialog" aria-modal="true" aria-labelledby="jiaren-launch-notice-title">
        <div class="jiaren-launch-notice-mark" aria-hidden="true">i</div>
        <div>
          <strong id="jiaren-launch-notice-title">温馨提示</strong>
          <p>本工具仅供个人学习交流，AI 接口需自行准备，跨境访问行为由本人自行承担法律责任，禁止商用及违规内容创作，确认即可进入软件。</p>
        </div>
        <button type="button">确认进入</button>
      </section>`;
    const confirm = backdrop.querySelector("button");
    confirm.addEventListener("click", () => backdrop.remove());
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => confirm.focus());
  }

  function reconcilePromptPanels() {
    const panels = [...document.querySelectorAll(".lovart-prompt-console:not(.smart-flow-hidden-promptbar)")]
      .filter((panel) => {
        const style = getComputedStyle(panel);
        return style.display !== "none" && style.visibility !== "hidden";
      });
    panels.forEach((panel, index) => {
      panel.classList.toggle("jiaren-runtime-secondary-prompt", panels.length > 1 && index < panels.length - 1);
    });
  }

  function neutralizeApiCopy(root) {
    const selectors = [
      ".settings-api-note",
      ".settings-status",
      ".model-card small",
      ".model-card [role='status']",
      ".api-model-status",
      "[class*='model-card'] small",
      "[class*='model-option'] small",
      "[class*='model-status']",
      "[class*='api-status']",
    ];
    for (const element of root.querySelectorAll?.(selectors.join(",")) || []) {
      if (element.matches("input, textarea, select") || element.closest(".settings-api-form input, .settings-api-form textarea")) continue;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      for (const node of textNodes) {
        const current = node.nodeValue || "";
        if (!/https?:\/\/|\/models(?:\?type=all)?|Base URL/i.test(current)) continue;
        node.nodeValue = current
          .replace(/https?:\/\/[^\s<>"'，。；、]+/gi, "当前接口")
          .replace(/\/models(?:\?type=all)?/gi, "模型列表")
          .replace(/Base URL/gi, "接口地址");
      }
      if (element.title && /https?:\/\/|\/models(?:\?type=all)?|Base URL/i.test(element.title)) {
        element.title = element.title
          .replace(/https?:\/\/[^\s<>"'，。；、]+/gi, "当前接口")
          .replace(/\/models(?:\?type=all)?/gi, "模型列表")
          .replace(/Base URL/gi, "接口地址");
      }
    }

    const statusCandidates = [
      ...(root.matches?.("span, b, strong, small, em, button") ? [root] : []),
      ...(root.querySelectorAll?.("span, b, strong, small, em, button") || []),
    ];
    for (const element of statusCandidates) {
      if (element.children.length > 0) continue;
      const text = String(element.textContent || "").replace(/\s+/g, " ").trim();
      if (/^API\s*已(?:接通|连通|连接|配置)$/i.test(text)) element.textContent = "接口已接入";
      if (/^配对码\s*/.test(text)) element.textContent = text.replace(/^配对码\s*/, "本地配对码 ");
    }

    const inputs = [
      ...(root.matches?.("input, textarea") ? [root] : []),
      ...(root.querySelectorAll?.("input, textarea") || []),
    ];
    for (const input of inputs) {
      const placeholder = String(input.getAttribute("placeholder") || "");
      if (/https?:\/\/|api\.apilio|new\.comfly|api\.geeknow/i.test(placeholder)) {
        input.setAttribute("placeholder", "请输入兼容接口地址");
      }
    }
  }

  function removeObsoleteInstallerEntry(root) {
    const candidates = [
      ...(root.matches?.("button, a") ? [root] : []),
      ...(root.querySelectorAll?.("button, a") || []),
    ];
    for (const element of candidates) {
      const label = [element.textContent, element.title, element.getAttribute("aria-label")]
        .map((value) => String(value || "").replace(/\s+/g, "").trim())
        .join(" ");
      if (!/安装版/.test(label)) continue;
      if (element.closest(".settings-modal, .license-modal, .jiaren-launch-chooser")) continue;
      element.remove();
    }
  }

  function removeObsoleteCommunityLauncher(root) {
    const launchers = [
      ...(root.matches?.(".jc-launcher") ? [root] : []),
      ...(root.querySelectorAll?.(".jc-launcher") || []),
    ];
    for (const launcher of launchers) launcher.remove();
  }

  function comparableSource(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    try {
      return decodeURIComponent(text).replace(/\\/g, "/").replace(/^file:\/\/+/, "").toLowerCase();
    } catch {
      return text.replace(/\\/g, "/").replace(/^file:\/\/+/, "").toLowerCase();
    }
  }

  function dataSources(data) {
    if (!data || typeof data !== "object") return [];
    const direct = [data.imageSource, data.dataUrl, data.source, data.localPath, data.url];
    const assets = Array.isArray(data.outputAssets) ? data.outputAssets : [];
    return [...direct, ...assets.flatMap((asset) => [asset?.dataUrl, asset?.localPath, asset?.url, asset?.source])]
      .map(comparableSource)
      .filter(Boolean);
  }

  function sourcesMatch(left, right) {
    const a = comparableSource(left);
    const b = comparableSource(right);
    return Boolean(a && b && (a === b || a.endsWith(b) || b.endsWith(a)));
  }

  function updatePreviewTransform(modal) {
    const state = previewStates.get(modal);
    if (!state) return;
    state.image.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    state.zoomLabel.textContent = `${Math.round(state.scale * 100)}%`;
    modal.classList.toggle("is-preview-zoomed", state.scale > 1.01);
  }

  function attachPreviewControls(modal) {
    if (modal.dataset.jiarenViewerReady === "1") return;
    const header = modal.querySelector(".image-preview-header");
    const stage = modal.querySelector(".image-preview-stage");
    const image = stage?.querySelector("img");
    if (!header || !stage || !image) return;
    modal.dataset.jiarenViewerReady = "1";
    const tools = document.createElement("div");
    tools.className = "jiaren-preview-tools";
    const zoomLabel = document.createElement("span");
    zoomLabel.textContent = "100%";
    const state = { image, stage, scale: 1, x: 0, y: 0, zoomLabel, dragging: false, pointerX: 0, pointerY: 0 };
    previewStates.set(modal, state);
    const setScale = (next) => {
      state.scale = Math.max(0.2, Math.min(8, next));
      if (state.scale <= 1) state.x = state.y = 0;
      updatePreviewTransform(modal);
    };
    tools.append(
      button("−", "缩小", () => setScale(state.scale / 1.2)),
      zoomLabel,
      button("+", "放大", () => setScale(state.scale * 1.2)),
      button("适应", "适应窗口", () => {
        state.scale = 1;
        state.x = state.y = 0;
        updatePreviewTransform(modal);
      }),
      button("1:1", "按原始像素查看", () => {
        const displayedWidth = Math.max(1, image.getBoundingClientRect().width / state.scale);
        setScale(Math.min(8, Math.max(0.2, (image.naturalWidth || displayedWidth) / displayedWidth)));
      }),
      button("标注修改", "框选或涂抹需要修改的区域", () => openAnnotationEditor(modal, image), "is-primary"),
    );
    header.insertBefore(tools, header.lastElementChild);
    stage.addEventListener("wheel", (event) => {
      event.preventDefault();
      setScale(state.scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12));
    }, { passive: false });
    stage.addEventListener("pointerdown", (event) => {
      if (state.scale <= 1 || event.button !== 0) return;
      state.dragging = true;
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      stage.setPointerCapture?.(event.pointerId);
    });
    stage.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;
      state.x += event.clientX - state.pointerX;
      state.y += event.clientY - state.pointerY;
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      updatePreviewTransform(modal);
    });
    const stopPan = () => { state.dragging = false; };
    stage.addEventListener("pointerup", stopPan);
    stage.addEventListener("pointercancel", stopPan);
  }

  function canvasPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width / Math.max(1, rect.width),
      y: (event.clientY - rect.top) * canvas.height / Math.max(1, rect.height),
    };
  }

  async function createAnnotatedEditNode(image, maskDataUrl, prompt, modal) {
    const bridge = window.__JIAREN_CANVAS_AGENT__;
    if (!bridge) throw new Error("画布控制桥尚未就绪，请稍后重试。");
    const snapshot = bridge.getSnapshot();
    const preview = modal.__jiarenPreviewMeta || {};
    const source = image.currentSrc || image.src;
    const sourceCandidates = [source, preview.localPath].filter(Boolean);
    let sourceNode = snapshot.selectedNode;
    if (!sourceNode || !dataSources(sourceNode.data).some((candidate) => sourceCandidates.some((item) => sourcesMatch(candidate, item)))) {
      sourceNode = (snapshot.nodes || []).find((node) =>
        dataSources(node?.data).some((candidate) => sourceCandidates.some((item) => sourcesMatch(candidate, item))),
      ) || null;
    }
    let sourceNodeId = sourceNode?.id || null;
    const basePosition = sourceNode?.position || { x: 360, y: 240 };
    if (!sourceNodeId) {
      const sourceResult = await bridge.applyOperations([{
        type: "node.add",
        kind: "imageInput",
        position: basePosition,
        data: {
          kind: "imageInput",
          label: "局部修改原图",
          imageSource: source,
          source,
          dataUrl: source.startsWith("data:") ? source : undefined,
          localPath: preview.localPath || undefined,
          width: image.naturalWidth,
          height: image.naturalHeight,
          status: "succeeded",
          message: "局部修改的原始图片，原图不会被覆盖。",
        },
      }]);
      sourceNodeId = sourceResult.receipts?.[0]?.nodeId;
    }
    if (!sourceNodeId) throw new Error("无法创建原图节点。");
    const editResult = await bridge.applyOperations([{
      type: "node.add",
      kind: "editImage",
      position: { x: Number(basePosition.x || 0) + 520, y: Number(basePosition.y || 0) },
      data: {
        kind: "editImage",
        label: "图片标注修改",
        prompt,
        inputPrompt: prompt,
        maskImage: {
          name: "jiaren-edit-mask.png",
          dataUrl: maskDataUrl,
          mimeType: "image/png",
          width: image.naturalWidth,
          height: image.naturalHeight,
        },
        referenceImages: [{
          name: "jiaren-edit-source.png",
          dataUrl: source.startsWith("data:") ? source : undefined,
          localPath: preview.localPath || undefined,
          url: /^https?:/i.test(source) ? source : undefined,
          mimeType: "image/png",
          width: image.naturalWidth,
          height: image.naturalHeight,
        }],
        aspectRatio: "Auto",
        count: 1,
        status: "idle",
        message: "已保存标注蒙版，可选择图像模型后生成局部修改结果。",
      },
    }]);
    const editNodeId = editResult.receipts?.[0]?.nodeId;
    if (!editNodeId) throw new Error("无法创建局部修改节点。");
    await bridge.applyOperations([
      { type: "edge.add", source: sourceNodeId, target: editNodeId, edgeId: `annotated-edit-${Date.now()}` },
      {
        type: "node.update",
        nodeId: editNodeId,
        patch: {
          prompt,
          inputPrompt: prompt,
          message: "已保存标注蒙版，可选择图像模型后生成局部修改结果。",
        },
      },
      { type: "node.select", nodeId: editNodeId },
    ]);
    return editNodeId;
  }

  function openAnnotationEditor(modal, image) {
    if (!image.complete || !image.naturalWidth || !image.naturalHeight) return;
    const overlay = document.createElement("div");
    overlay.className = "jiaren-annotation-backdrop";
    const panel = document.createElement("section");
    panel.className = "jiaren-annotation-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    const header = document.createElement("header");
    header.innerHTML = `<div><strong>标注修改区域</strong><span>原图保持不变，红色区域将被修改</span></div>`;
    header.append(button("×", "关闭标注", () => overlay.remove()));
    const body = document.createElement("main");
    const stage = document.createElement("div");
    stage.className = "jiaren-annotation-stage";
    const backdropImage = document.createElement("img");
    backdropImage.src = image.currentSrc || image.src;
    backdropImage.alt = "待标注图片";
    const selection = document.createElement("canvas");
    const maxPreview = 1400;
    const scale = Math.min(1, maxPreview / Math.max(image.naturalWidth, image.naturalHeight));
    selection.width = Math.max(1, Math.round(image.naturalWidth * scale));
    selection.height = Math.max(1, Math.round(image.naturalHeight * scale));
    stage.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
    stage.append(backdropImage, selection);
    const side = document.createElement("aside");
    const toolbar = document.createElement("div");
    toolbar.className = "jiaren-annotation-tools";
    const modes = [
      ["brush", "画笔"],
      ["rect", "矩形"],
      ["erase", "擦除"],
    ];
    let mode = "brush";
    let drawing = false;
    let start = null;
    let snapshot;
    const context = selection.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    const sizeLabel = document.createElement("label");
    sizeLabel.innerHTML = `<span>画笔大小</span><input type="range" min="6" max="120" value="36"><em>36</em>`;
    const sizeInput = sizeLabel.querySelector("input");
    const sizeValue = sizeLabel.querySelector("em");
    const modeButtons = new Map();
    for (const [value, label] of modes) {
      const control = button(label, `${label}工具`, () => {
        mode = value;
        modeButtons.forEach((item, key) => item.classList.toggle("active", key === mode));
      });
      control.classList.toggle("active", value === mode);
      modeButtons.set(value, control);
      toolbar.append(control);
    }
    toolbar.append(button("清空", "清除全部标注", () => context.clearRect(0, 0, selection.width, selection.height)));
    sizeInput.addEventListener("input", () => { sizeValue.textContent = sizeInput.value; });
    const promptLabel = document.createElement("label");
    promptLabel.innerHTML = `<span>修改要求</span><textarea placeholder="例如：把海报标题改成“夏日新品”，保持字体风格和排版不变"></textarea>`;
    const promptInput = promptLabel.querySelector("textarea");
    const status = document.createElement("p");
    status.className = "jiaren-annotation-status";
    status.textContent = "请涂抹或框选要修改的区域。";
    side.append(toolbar, sizeLabel, promptLabel, status);
    body.append(stage, side);
    const footer = document.createElement("footer");
    footer.append(
      button("取消", "取消标注", () => overlay.remove()),
      button("创建局部修改节点", "保存蒙版并创建可串联节点", async (event) => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
          status.textContent = "请先填写修改要求。";
          promptInput.focus();
          return;
        }
        const pixels = context.getImageData(0, 0, selection.width, selection.height).data;
        let marked = false;
        for (let index = 3; index < pixels.length; index += 4) {
          if (pixels[index] > 0) { marked = true; break; }
        }
        if (!marked) {
          status.textContent = "请先标注需要修改的区域。";
          return;
        }
        const control = event.currentTarget;
        control.disabled = true;
        status.textContent = "正在生成蒙版并创建节点...";
        try {
          const mask = document.createElement("canvas");
          mask.width = image.naturalWidth;
          mask.height = image.naturalHeight;
          const maskContext = mask.getContext("2d");
          maskContext.fillStyle = "#ffffff";
          maskContext.fillRect(0, 0, mask.width, mask.height);
          maskContext.globalCompositeOperation = "destination-out";
          maskContext.drawImage(selection, 0, 0, mask.width, mask.height);
          const maskDataUrl = mask.toDataURL("image/png");
          mask.width = mask.height = 1;
          await createAnnotatedEditNode(image, maskDataUrl, prompt, modal);
          status.textContent = "局部修改节点已创建并连接。";
          setTimeout(() => overlay.remove(), 650);
        } catch (error) {
          status.textContent = error instanceof Error ? error.message : String(error);
          control.disabled = false;
        }
      }, "is-primary"),
    );
    panel.append(header, body, footer);
    overlay.append(panel);
    document.body.append(overlay);

    const applyStroke = (from, to) => {
      context.save();
      context.globalCompositeOperation = mode === "erase" ? "destination-out" : "source-over";
      context.strokeStyle = "rgba(255, 77, 94, 0.72)";
      context.lineWidth = Number(sizeInput.value);
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
      context.restore();
    };
    selection.addEventListener("pointerdown", (event) => {
      drawing = true;
      start = canvasPoint(selection, event);
      snapshot = mode === "rect" ? context.getImageData(0, 0, selection.width, selection.height) : null;
      selection.setPointerCapture?.(event.pointerId);
      if (mode !== "rect") applyStroke(start, start);
    });
    selection.addEventListener("pointermove", (event) => {
      if (!drawing) return;
      const point = canvasPoint(selection, event);
      if (mode === "rect") {
        context.putImageData(snapshot, 0, 0);
        context.fillStyle = "rgba(255, 77, 94, 0.58)";
        context.fillRect(start.x, start.y, point.x - start.x, point.y - start.y);
      } else {
        applyStroke(start, point);
        start = point;
      }
    });
    const stop = () => { drawing = false; snapshot = null; };
    selection.addEventListener("pointerup", stop);
    selection.addEventListener("pointercancel", stop);
  }

  function previewMetadata(modal, image) {
    const snapshot = window.__JIAREN_CANVAS_AGENT__?.getSnapshot?.();
    const source = image?.currentSrc || image?.src || "";
    const selectedAsset = [snapshot?.selectedAsset, ...(snapshot?.assets || [])].find((asset) =>
      dataSources(asset).some((candidate) => sourcesMatch(candidate, source)),
    );
    const selectedNode = [snapshot?.selectedNode, ...(snapshot?.nodes || [])].find((node) =>
      dataSources(node?.data).some((candidate) => sourcesMatch(candidate, source)),
    );
    const selected = selectedAsset || selectedNode?.data || {};
    modal.__jiarenPreviewMeta = {
      localPath: selected.localPath || selected.outputAssets?.[0]?.localPath || "",
      assetId: selectedAsset?.id || "",
    };
  }

  function edgeIdFromElement(edge) {
    if (!edge) return "";
    const direct = edge.dataset.id || edge.getAttribute("data-id");
    if (direct) return direct;
    const id = edge.id || "";
    return id.replace(/^react-flow__edge-/, "");
  }

  function closeEdgeMenu() {
    edgeMenu?.remove();
    edgeMenu = undefined;
  }

  function openEdgeMenu(event, edge) {
    const edgeId = edgeIdFromElement(edge);
    if (!edgeId) return;
    event.preventDefault();
    event.stopPropagation();
    closeEdgeMenu();
    edgeMenu = document.createElement("div");
    edgeMenu.className = "jiaren-edge-context-menu";
    edgeMenu.style.left = `${event.clientX}px`;
    edgeMenu.style.top = `${event.clientY}px`;
    edgeMenu.append(button("断开连接", "删除这条连线", async () => {
      closeEdgeMenu();
      await window.__JIAREN_CANVAS_AGENT__?.applyOperations?.([{ type: "edge.remove", edgeId }]);
    }));
    document.body.append(edgeMenu);
  }

  function parseOperationPlan(text) {
    const candidates = [];
    const fenced = String(text || "").matchAll(/```(?:json)?\s*([\s\S]*?)```/gi);
    for (const match of fenced) candidates.push(match[1]);
    const direct = String(text || "").trim();
    if (direct.startsWith("{") && direct.endsWith("}")) candidates.push(direct);
    for (const candidate of candidates.reverse()) {
      try {
        const parsed = JSON.parse(candidate);
        const plan = Array.isArray(parsed) ? { operations: parsed } : parsed;
        if (!Array.isArray(plan.operations) || !plan.operations.length) continue;
        if (!plan.operations.every((operation) => PLAN_TYPES.has(operation?.type))) continue;
        return plan;
      } catch {}
    }
    return null;
  }

  window.__JIAREN_CODEX_CANVAS_PLAN__ = async function (text, meta) {
    const plan = parseOperationPlan(text);
    if (!plan || !window.jiaren?.agentControl?.submitPlan) return null;
    const signature = JSON.stringify(plan.operations);
    if (submittedPlans.has(signature)) return null;
    submittedPlans.add(signature);
    return window.jiaren.agentControl.submitPlan({
      source: meta?.source || "Codex CLI",
      sessionId: meta?.sessionId || null,
      title: String(plan.title || "Codex 画布操作计划").slice(0, 120),
      summary: String(plan.summary || `${plan.operations.length} 项画布操作等待确认`).slice(0, 500),
      operations: plan.operations,
    });
  };

  function showQueueState(state) {
    if (!state?.id) return;
    imageTaskUiStates.set(state.id, state);
    if (["succeeded", "failed", "canceled"].includes(state.state)) {
      setTimeout(() => imageTaskUiStates.delete(state.id), 5000);
    }

    const queuedCount = [...imageTaskUiStates.values()].filter((task) => task.state === "queued").length;
    const shouldShowFailure = state.state === "failed";
    if (!queuedCount && !shouldShowFailure) {
      clearTimeout(queuePill?.__removeTimer);
      queuePill?.remove();
      queuePill = undefined;
      return;
    }

    if (!queuePill) {
      queuePill = document.createElement("div");
      queuePill.className = "jiaren-image-queue-pill";
      document.body.append(queuePill);
    }
    clearTimeout(queuePill.__removeTimer);
    if (shouldShowFailure) {
      queuePill.textContent = state.message ? `图片任务失败：${state.message}` : "图片任务失败";
      queuePill.dataset.state = "failed";
      queuePill.__removeTimer = setTimeout(() => {
        queuePill?.remove();
        queuePill = undefined;
      }, 4200);
      return;
    }
    queuePill.textContent = `另有 ${queuedCount} 个图片任务排队，将自动继续`;
    queuePill.dataset.state = "queued";
  }

  function scan(root) {
    reconcilePromptPanels();
    neutralizeApiCopy(root === document ? document : root);
    removeObsoleteInstallerEntry(root === document ? document : root);
    removeObsoleteCommunityLauncher(root === document ? document : root);
    const modals = root.matches?.(".image-preview-modal")
      ? [root]
      : [...(root.querySelectorAll?.(".image-preview-modal") || [])];
    for (const modal of modals) {
      const image = modal.querySelector(".image-preview-stage img");
      previewMetadata(modal, image);
      attachPreviewControls(modal);
    }
  }

  function boot() {
    showLaunchNotice();
    scan(document);
    document.addEventListener("contextmenu", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const edge = target.closest(".react-flow__edge");
      if (edge) openEdgeMenu(event, edge);
    }, true);
    document.addEventListener("pointerdown", (event) => {
      if (edgeMenu && !edgeMenu.contains(event.target)) closeEdgeMenu();
    }, true);
    window.addEventListener("blur", closeEdgeMenu);
    window.jiaren?.runtime?.onImageTaskState?.(showQueueState);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData" && record.target.parentElement) scan(record.target.parentElement);
        for (const node of record.addedNodes) {
          if (node instanceof Element) scan(node);
        }
      }
      reconcilePromptPanels();
    });
    observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
