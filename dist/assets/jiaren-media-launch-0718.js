/* SPDX-License-Identifier: MIT */
(function () {
  "use strict";

  let workspaceChosen = window.sessionStorage.getItem("jiaren:resume-saved-project") === "1";
  window.sessionStorage.removeItem("jiaren:resume-saved-project");

  const waitFor = (selector, callback, attempts = 60) => {
    const element = document.querySelector(selector);
    if (element) return void callback(element);
    if (attempts > 0) window.setTimeout(() => waitFor(selector, callback, attempts - 1), 100);
  };

  const closeLaunchMenus = () => {
    document.querySelectorAll(".canvas-context-menu,.clean-node-menu,.project-context-menu,.jiaren-tools-menu")
      .forEach((element) => element.remove());
    document.querySelector(".react-flow__pane")?.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    }));
  };

  const clickToolbar = (title) => {
    waitFor(".bottom-floating-toolbar button", () => {
      const button = Array.from(document.querySelectorAll(".bottom-floating-toolbar button"))
        .find((candidate) => candidate.title === title || String(candidate.textContent || "").includes(title));
      button?.click();
    });
  };

  const openCreationNode = (label) => {
    waitFor(".bottom-floating-toolbar button", () => {
      const trigger = Array.from(document.querySelectorAll(".bottom-floating-toolbar button"))
        .find((candidate) => /打开功能菜单|功能菜单/.test(candidate.title || candidate.textContent || ""));
      trigger?.click();
      waitFor(".canvas-context-menu button", () => {
        const item = Array.from(document.querySelectorAll(".canvas-context-menu button"))
          .find((candidate) => String(candidate.textContent || "").trim().startsWith(label));
        item?.click();
      });
    });
  };

  const enterWorkspace = async (mode, overlay) => {
    await window.jiaren?.system?.startNewProject?.();
    window.localStorage.removeItem("jiaren:restoreLastProject");
    workspaceChosen = true;
    closeLaunchMenus();
    document.body.classList.remove("jiaren-launch-active");
    overlay.remove();
    window.setTimeout(() => {
      if (mode === "drawing") clickToolbar("生成图片 AI");
      if (mode === "video") {
        window.dispatchEvent(new CustomEvent("jiaren-open-primary-animation-video", {
          detail: { mode: "seedance-story" },
        }));
      }
      if (mode === "audio") openCreationNode("音频");
    }, 160);
  };

  const importCommunityPackage = (detail) => {
    if (!detail || typeof detail !== "object") return;
    const overlay = document.querySelector(".jiaren-launch-chooser");
    if (overlay) {
      workspaceChosen = true;
      closeLaunchMenus();
      document.body.classList.remove("jiaren-launch-active");
      overlay.remove();
    }
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("jiaren:canvas:import-media-package", { detail }));
    }, overlay ? 140 : 0);
  };

  const installMediaHydration = () => {
    const cache = new Map();
    const fallback = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL0WQAAAABJRU5ErkJggg==";
    const localPathFromSource = (source) => {
      if (/^(?:[a-zA-Z]:[\\/]|\\\\)/.test(source)) return source;
      if (!/^file:\/\//i.test(source)) return "";
      try {
        const pathname = decodeURIComponent(new URL(source).pathname);
        return /^\/[a-zA-Z]:\//.test(pathname) ? pathname.slice(1) : pathname;
      } catch {
        return "";
      }
    };
    const useFallback = (image) => {
      image.classList.add("jiaren-image-fallback");
      image.src = fallback;
      image.alt = image.alt || "图片暂不可用";
    };
    const hydrate = (image) => {
      if (!(image instanceof HTMLImageElement)) return;
      if (!image.dataset.jiarenErrorBound) {
        image.dataset.jiarenErrorBound = "true";
        image.addEventListener("error", () => {
          if (!image.dataset.jiarenMediaLoading) useFallback(image);
        });
      }
      const source = image.getAttribute("src") || "";
      const localPath = localPathFromSource(source);
      if (!localPath || image.dataset.jiarenHydratedSource === source) return;
      const reader = window.jiaren?.system?.readMediaDataUrl;
      if (typeof reader !== "function" || image.dataset.jiarenMediaLoading) return;
      const cached = cache.get(localPath);
      if (cached) {
        image.dataset.jiarenHydratedSource = source;
        image.src = cached;
        return;
      }
      image.dataset.jiarenMediaLoading = "true";
      reader({ path: localPath, maxBytes: 40 * 1024 * 1024 }).then((result) => {
        if (!result?.ok || !result.dataUrl) throw new Error("media read failed");
        cache.set(localPath, result.dataUrl);
        image.dataset.jiarenHydratedSource = source;
        image.classList.remove("jiaren-image-fallback");
        image.src = result.dataUrl;
      }).catch(() => useFallback(image)).finally(() => {
        delete image.dataset.jiarenMediaLoading;
      });
    };
    const scan = () => document.querySelectorAll("img").forEach(hydrate);
    scan();
    window.setInterval(scan, 900);
  };

  const card = (mode, title, description, icon) => `
    <button type="button" data-mode="${mode}" aria-label="进入${title}">
      <span class="jiaren-launch-icon" aria-hidden="true">${icon}</span>
      <span class="jiaren-launch-copy"><strong>${title}</strong><small>${description}</small></span>
    </button>`;

  const refreshSavedProjects = async (overlay) => {
    const list = overlay.querySelector(".jiaren-saved-project-list");
    if (!list) return;
    const api = window.jiaren?.system;
    if (typeof api?.listSavedProjects !== "function") {
      list.innerHTML = '<p class="jiaren-saved-project-empty">当前版本不支持本地项目历史。</p>';
      return;
    }
    list.innerHTML = '<p class="jiaren-saved-project-empty">正在读取本地项目...</p>';
    try {
      const result = await api.listSavedProjects();
      const projects = Array.isArray(result?.projects) ? result.projects : [];
      if (!projects.length) {
        list.innerHTML = '<p class="jiaren-saved-project-empty">按 Ctrl+S 或从项目菜单保存后，项目会显示在这里。</p>';
        return;
      }
      list.replaceChildren(...projects.slice(0, 12).map((project) => {
        const article = document.createElement("article");
        article.className = "jiaren-saved-project-card";
        const open = document.createElement("button");
        open.type = "button";
        open.className = "jiaren-saved-project-open";
        open.dataset.savedProject = project.id;
        const name = document.createElement("strong");
        name.textContent = project.projectName || "未命名项目";
        const meta = document.createElement("span");
        const savedAt = new Date(project.savedAt);
        const dateLabel = Number.isNaN(savedAt.getTime()) ? "本地项目" : savedAt.toLocaleString("zh-CN", { hour12: false });
        meta.textContent = `${dateLabel} · ${project.nodeCount || 0} 个节点 · ${project.assetCount || 0} 个素材`;
        open.append(name, meta);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "jiaren-saved-project-delete";
        remove.dataset.deleteSavedProject = project.id;
        remove.title = "从历史项目中删除";
        remove.setAttribute("aria-label", `删除项目 ${name.textContent}`);
        remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"/></svg>';
        article.append(open, remove);
        return article;
      }));
    } catch (error) {
      const empty = document.createElement("p");
      empty.className = "jiaren-saved-project-empty";
      empty.textContent = `读取项目失败：${String(error?.message || error)}`;
      list.replaceChildren(empty);
    }
  };

  const mountLaunch = () => {
    if (workspaceChosen || document.querySelector(".jiaren-launch-chooser")) return;
    const overlay = document.createElement("section");
    overlay.className = "jiaren-launch-chooser";
    overlay.setAttribute("aria-label", "选择创作工作区");
    overlay.innerHTML = `
      <section class="jiaren-launch-home" aria-label="JiarenAI 创作工作区">
        <div class="jiaren-launch-art">
          <header><strong>JiarenAI</strong><span>创作工作区</span></header>
          ${card("free", "自由创作", "无限画布与节点工作流", '<svg viewBox="0 0 24 24"><path d="m12 19 7-7 3 3-7 7-3-3Z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>')}
          ${card("drawing", "图文创作", "文生图与参考图生成", '<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>')}
          ${card("video", "视频生成", "图生视频与视频编辑", '<svg viewBox="0 0 24 24"><path d="m16 13 5 3V8l-5 3"/><rect width="13" height="12" x="3" y="6" rx="2"/></svg>')}
          ${card("audio", "音频生成", "音乐、音效与语音", '<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>')}
        </div>
      </section>
      <section class="jiaren-launch-history" aria-label="本地历史项目">
        <header><strong>最近项目</strong><span>仅显示你明确保存到本机的项目</span></header>
        <div class="jiaren-saved-project-list"><p class="jiaren-saved-project-empty">正在读取本地项目...</p></div>
      </section>`;

    const blockNonPrimaryPointer = (event) => {
      if (event.button === 0) return;
      event.preventDefault();
      event.stopPropagation();
    };
    overlay.addEventListener("pointerdown", blockNonPrimaryPointer, true);
    overlay.addEventListener("auxclick", blockNonPrimaryPointer, true);
    let communityWheelDistance = 0;
    let communityWheelResetTimer = 0;
    let communityOpening = false;
    const openCommunityFromLaunch = () => {
      if (communityOpening) return;
      communityOpening = true;
      communityWheelDistance = 0;
      window.JiarenCommunity?.open();
      window.setTimeout(() => { communityOpening = false; }, 320);
    };
    overlay.addEventListener("wheel", (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const projectList = event.target.closest?.(".jiaren-saved-project-list");
      if (projectList && projectList.scrollHeight > projectList.clientHeight) {
        const canScrollUp = projectList.scrollTop > 0;
        const canScrollDown = projectList.scrollTop + projectList.clientHeight < projectList.scrollHeight - 1;
        if ((event.deltaY < 0 && canScrollUp) || (event.deltaY > 0 && canScrollDown)) {
          communityWheelDistance = 0;
          return;
        }
      }
      if (event.deltaY <= 0) {
        communityWheelDistance = 0;
        return;
      }
      event.preventDefault();
      communityWheelDistance += event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      window.clearTimeout(communityWheelResetTimer);
      communityWheelResetTimer = window.setTimeout(() => { communityWheelDistance = 0; }, 360);
      if (communityWheelDistance >= 48) openCommunityFromLaunch();
    }, { passive: false });
    overlay.addEventListener("click", async (event) => {
      if (event.button !== 0) return;
      const deleteButton = event.target.closest("button[data-delete-saved-project]");
      if (deleteButton) {
        event.preventDefault();
        event.stopPropagation();
        await window.jiaren?.system?.deleteSavedProject?.(deleteButton.dataset.deleteSavedProject);
        await refreshSavedProjects(overlay);
        return;
      }
      const savedButton = event.target.closest("button[data-saved-project]");
      if (savedButton) {
        event.preventDefault();
        event.stopPropagation();
        savedButton.disabled = true;
        const result = await window.jiaren?.system?.loadSavedProject?.(savedButton.dataset.savedProject);
        if (!result?.ok) {
          savedButton.disabled = false;
          return;
        }
        window.localStorage.setItem("jiaren:restoreLastProject", "1");
        window.sessionStorage.setItem("jiaren:resume-saved-project", "1");
        window.location.reload();
        return;
      }
      const modeButton = event.target.closest("button[data-mode]");
      if (modeButton) return enterWorkspace(modeButton.dataset.mode, overlay);
    });
    document.body.classList.add("jiaren-launch-active");
    closeLaunchMenus();
    document.body.appendChild(overlay);
    void refreshSavedProjects(overlay);
  };

  const syncDrawingState = () => {
    const drawingConsole = document.querySelector(".lovart-prompt-console");
    const drawingCard = document.querySelector(".canvas-node.jiaren-drawing-media-card");
    document.body.classList.toggle("jiaren-drawing-console-active", Boolean(drawingConsole && drawingCard));
  };

  const syncLaunchGate = () => {
    if (workspaceChosen || !document.querySelector(".canvas-app-shell")) return;
    mountLaunch();
    if (document.body.classList.contains("jiaren-launch-active")) closeLaunchMenus();
  };

  const start = () => {
    waitFor(".canvas-app-shell", mountLaunch, 100);
    document.addEventListener("contextmenu", (event) => {
      if (!document.body.classList.contains("jiaren-launch-active")) return;
      event.preventDefault();
      event.stopPropagation();
      closeLaunchMenus();
    }, true);
    const observer = new MutationObserver(() => {
      syncDrawingState();
      syncLaunchGate();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    syncDrawingState();
    syncLaunchGate();
    window.setTimeout(installMediaHydration, 800);
  };

  window.addEventListener("message", (event) => {
    const message = event.data;
    if (!message || message.source !== "jiaren-community" || message.type !== "jiaren:community:add-to-canvas") return;
    const frame = document.querySelector(".jiaren-community-stage iframe");
    if (!frame || event.source !== frame.contentWindow) return;
    importCommunityPackage(message.detail);
  });

  window.addEventListener("jiaren-open-launch", () => {
    workspaceChosen = false;
    window.JiarenCommunity?.close?.();
    mountLaunch();
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
