(() => {
  "use strict";

  const icons = {
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    community: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>'
  };

  const closeProjectMenu = () => {
    document.querySelector(".canvas-app-shell")?.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  };

  const openLaunch = () => {
    closeProjectMenu();
    window.dispatchEvent(new CustomEvent("jiaren-open-launch"));
  };

  const makeMenuButton = (className, label, icon, action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "menuitem";
    button.className = className;
    button.innerHTML = `${icon}<span>${label}</span>`;
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      action();
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.detail !== 0) return;
      action();
    });
    return button;
  };

  const enhanceProjectMenu = (menu) => {
    if (menu.dataset.jiarenV019Enhanced === "true") return;
    menu.dataset.jiarenV019Enhanced = "true";
    const save = menu.querySelector("button");
    if (save) {
      save.dataset.jiarenExplicitSave = "true";
      save.title = "保存项目到本地历史";
      const textNode = Array.from(save.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = "保存项目";
      save.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        save.click();
      }, true);
    }
    menu.append(
      makeMenuButton("jiaren-project-community", "创作者社区", icons.community, () => {
        closeProjectMenu();
        window.JiarenCommunity?.open?.();
      }),
      makeMenuButton("jiaren-project-home", "启动页面", icons.home, openLaunch)
    );
    requestAnimationFrame(() => {
      const rect = menu.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 12) {
        menu.style.top = `${Math.max(12, window.innerHeight - rect.height - 12)}px`;
      }
    });
  };

  const enhanceTopChrome = (chrome) => {
    if (chrome.querySelector(".jiaren-startup-back-button")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "jiaren-startup-back-button";
    button.title = "返回启动页面";
    button.setAttribute("aria-label", "返回启动页面");
    button.innerHTML = icons.back;
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      openLaunch();
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.detail !== 0) return;
      openLaunch();
    });
    chrome.prepend(button);
  };

  const sync = () => {
    document.querySelectorAll(".project-context-menu").forEach(enhanceProjectMenu);
    document.querySelectorAll(".jiaren-canvas-top-chrome").forEach(enhanceTopChrome);
  };

  const saveExplicitly = () => {
    if (document.body.classList.contains("jiaren-launch-active")) return;
    const existing = document.querySelector(".project-context-menu button[data-jiaren-explicit-save='true']");
    if (existing) {
      existing.click();
      return;
    }
    const trigger = document.querySelector(".jiaren-canvas-project-pill");
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    trigger.dispatchEvent(new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + 12,
      clientY: rect.bottom + 6,
      view: window
    }));
    window.setTimeout(() => {
      sync();
      document.querySelector(".project-context-menu button[data-jiaren-explicit-save='true']")?.click();
    }, 0);
  };

  document.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.key.toLowerCase() !== "s") return;
    event.preventDefault();
    event.stopPropagation();
    saveExplicitly();
  }, true);

  const observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync, { once: true });
  else sync();
})();
