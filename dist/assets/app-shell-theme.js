(function () {
  "use strict";

  var STORAGE_KEY = "app-shell-theme";
  var root = document.documentElement;
  var validThemes = { light: true, dark: true };
  var clampFrame = 0;
  var initialPreference = null;
  var shellObserver = null;
  var canvasViewport = null;
  var canvasViewportObserver = null;
  var canvasScaleFrame = 0;
  var alignTimer = 0;
  var alignInFlight = false;
  var alignAttempts = 0;
  var RETIRED_DIRECTOR_COMPOSER = ".jiaren-primary-video-prompt";

  function removeRetiredDirectorComposer(container) {
    if (!container) return false;
    var removed = false;
    if (container instanceof Element && container.matches(RETIRED_DIRECTOR_COMPOSER)) {
      container.remove();
      return true;
    }
    if (!container.querySelectorAll) return false;
    container.querySelectorAll(RETIRED_DIRECTOR_COMPOSER).forEach(function (composer) {
      composer.remove();
      removed = true;
    });
    return removed;
  }

  function storedTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return validThemes[value] ? value : null;
    } catch (_) {
      return null;
    }
  }

  function shellTheme() {
    var shell = document.querySelector(".canvas-app-shell");
    if (!shell) return null;
    if (shell.classList.contains("theme-dark")) return "dark";
    if (shell.classList.contains("theme-light")) return "light";
    return null;
  }

  function syncT8Theme(theme) {
    document.querySelectorAll(".t8-original-scope").forEach(function (scope) {
      scope.setAttribute("data-app-shell-theme", theme);
      if (scope.firstElementChild) {
        scope.firstElementChild.setAttribute("data-theme-mode", theme);
      }
    });
  }

  function applyTheme(theme, persist) {
    if (!validThemes[theme]) return;
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    syncT8Theme(theme);
    if (persist !== false) {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch (_) {
        /* Storage can be unavailable in hardened Electron sessions. */
      }
    }
  }

  function themeButton() {
    return document.querySelector(
      '.jiaren-canvas-toolbar-pill button[title*="\u6df1\u8272\u6a21\u5f0f"], ' +
      '.jiaren-canvas-toolbar-pill button[title*="\u767d\u8272\u6a21\u5f0f"]'
    );
  }

  function observeShell(shell) {
    if (shellObserver) shellObserver.disconnect();
    shellObserver = new MutationObserver(function () {
      if (initialPreference) {
        applyTheme(initialPreference, false);
        if (alignInFlight) return;
        ensureInitialTheme();
        return;
      }
      applyTheme(shellTheme() || "light", true);
    });
    shellObserver.observe(shell, { attributes: true, attributeFilter: ["class"] });
  }

  function ensureInitialTheme() {
    var shell = document.querySelector(".canvas-app-shell");
    if (!shell) return false;

    var current = shellTheme() || "light";
    if (!initialPreference) {
      applyTheme(current, true);
      return true;
    }

    applyTheme(initialPreference, false);
    if (initialPreference !== current) {
      var toggle = themeButton();
      if (toggle && !alignInFlight) {
        alignInFlight = true;
        alignAttempts += 1;
        toggle.click();
        window.clearTimeout(alignTimer);
        alignTimer = window.setTimeout(function () {
          alignInFlight = false;
          if (shellTheme() === initialPreference) {
            applyTheme(initialPreference, true);
            initialPreference = null;
            alignAttempts = 0;
            return;
          }
          if (alignAttempts < 3) ensureInitialTheme();
        }, 260);
        return true;
      }
    }

    applyTheme(initialPreference, true);
    initialPreference = null;
    alignInFlight = false;
    alignAttempts = 0;
    return true;
  }

  function replaceBrand(value) {
    return String(value || "")
      .replace(/贞贞的平价AI小屋/g, "JiarenAI 音频服务")
      .replace(/贞贞的平价AI工坊（国内）/g, "JiarenAI API")
      .replace(/贞贞的AI工坊（(?:原有|海外)）/g, "JiarenAI API")
      .replace(/贞贞工坊（默认）/g, "JiarenAI API")
      .replace(/贞贞/g, "JiarenAI")
      .replace(/Zhenzhen/gi, "JiarenAI")
      .replace(/ai\.t8star\.org/gi, "JiarenAI API")
      .replace(/api\.seedance\.nz/gi, "JiarenAI API")
      .replace(/Vibex/gi, "JiarenAI")
      .replace(/Penguin/gi, "JiarenAI")
      .replace(/T8/gi, "Jiaren AI");
  }

  function brandElement(element) {
    if (!(element instanceof Element)) return;
    ["title", "aria-label", "placeholder"].forEach(function (name) {
      if (!element.hasAttribute(name)) return;
      var current = element.getAttribute(name) || "";
      var next = replaceBrand(current);
      if (next !== current) element.setAttribute(name, next);
    });
  }

  function brandVisibleText(container) {
    if (!container) return;
    if (container.nodeType === Node.TEXT_NODE) {
      var current = container.nodeValue || "";
      var next = replaceBrand(current);
      if (next !== current) container.nodeValue = next;
      return;
    }

    if (!(container instanceof Element || container instanceof Document)) return;
    if (container instanceof Element) brandElement(container);
    if (container.querySelectorAll) container.querySelectorAll("[title], [aria-label], [placeholder]").forEach(brandElement);

    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    var node = walker.nextNode();
    while (node) {
      var parent = node.parentElement;
      if (parent && !parent.closest("script, style, noscript")) {
        var value = node.nodeValue || "";
        var branded = replaceBrand(value);
        if (branded !== value) node.nodeValue = branded;
      }
      node = walker.nextNode();
    }
  }

  function clampElement(element) {
    if (!(element instanceof HTMLElement)) return;
    var rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var gutter = 16;
    var top = parseFloat(element.style.top);
    var left = parseFloat(element.style.left);

    if (Number.isFinite(top)) {
      if (rect.bottom > window.innerHeight - gutter) {
        top -= rect.bottom - (window.innerHeight - gutter);
      }
      if (rect.top < gutter) {
        top += gutter - rect.top;
      }
      element.style.top = Math.round(top) + "px";
    }

    if (Number.isFinite(left)) {
      if (rect.right > window.innerWidth - gutter) {
        left -= rect.right - (window.innerWidth - gutter);
      }
      if (rect.left < gutter) {
        left += gutter - rect.left;
      }
      element.style.left = Math.round(left) + "px";
    }
  }

  function clampFloatingPanels() {
    clampFrame = 0;
    document.querySelectorAll(
      ".canvas-context-menu, .t8-context-menu--picker, .t8-connection-menu"
    ).forEach(clampElement);
  }

  function scheduleClamp() {
    if (clampFrame) return;
    clampFrame = window.requestAnimationFrame(clampFloatingPanels);
  }

  function syncCanvasScale() {
    canvasScaleFrame = 0;
    var viewport = document.querySelector(".react-flow__viewport");
    var scale = 1;

    if (viewport) {
      var transform = window.getComputedStyle(viewport).transform;
      if (transform && transform !== "none") {
        try {
          var matrix = new DOMMatrixReadOnly(transform);
          scale = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        } catch (_) {
          scale = 1;
        }
      }
    }

    scale = Math.min(1, Math.max(0.52, Number.isFinite(scale) ? scale : 1));
    root.style.setProperty("--jiaren-canvas-overlay-scale", scale.toFixed(4));
  }

  function scheduleCanvasScale() {
    if (canvasScaleFrame) return;
    canvasScaleFrame = window.requestAnimationFrame(syncCanvasScale);
  }

  function observeCanvasViewport() {
    var nextViewport = document.querySelector(".react-flow__viewport");
    if (nextViewport === canvasViewport) {
      scheduleCanvasScale();
      return;
    }

    if (canvasViewportObserver) canvasViewportObserver.disconnect();
    canvasViewport = nextViewport;
    if (canvasViewport) {
      canvasViewportObserver = new MutationObserver(scheduleCanvasScale);
      canvasViewportObserver.observe(canvasViewport, {
        attributes: true,
        attributeFilter: ["style", "class"]
      });
    }
    scheduleCanvasScale();
  }

  function start() {
    initialPreference = "dark";
    applyTheme(initialPreference, false);
    removeRetiredDirectorComposer(document);
    brandVisibleText(document.body);

    var shell = document.querySelector(".canvas-app-shell");
    if (shell) {
      observeShell(shell);
      ensureInitialTheme();
    }
    observeCanvasViewport();

    new MutationObserver(function (records) {
      var shouldClamp = false;
      var shouldSyncT8 = false;
      var shouldSyncCanvasScale = false;

      records.forEach(function (record) {
        if (record.type === "characterData") {
          brandVisibleText(record.target);
        }
        if (record.type === "attributes") {
          brandElement(record.target);
        }
        record.addedNodes.forEach(function (node) {
          if (!(node instanceof Element)) return;
          if (node.matches(RETIRED_DIRECTOR_COMPOSER)) {
            node.remove();
            return;
          }
          removeRetiredDirectorComposer(node);
          brandVisibleText(node);
          if (
            node.matches(".canvas-context-menu, .t8-context-menu--picker, .t8-connection-menu") ||
            node.querySelector(".canvas-context-menu, .t8-context-menu--picker, .t8-connection-menu")
          ) {
            shouldClamp = true;
          }
          if (node.matches(".t8-original-scope") || node.querySelector(".t8-original-scope")) {
            shouldSyncT8 = true;
          }
          if (node.matches(".react-flow__viewport") || node.querySelector(".react-flow__viewport")) {
            shouldSyncCanvasScale = true;
          }
        });
      });

      if (!shell && document.querySelector(".canvas-app-shell")) {
        shell = document.querySelector(".canvas-app-shell");
        observeShell(shell);
        ensureInitialTheme();
      }
      if (shouldSyncT8) syncT8Theme(root.getAttribute("data-theme") || "light");
      if (shouldSyncCanvasScale) observeCanvasViewport();
      if (shouldClamp) scheduleClamp();
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["title", "aria-label", "placeholder"],
      characterData: true,
      childList: true,
      subtree: true
    });

    window.addEventListener("resize", function () {
      scheduleClamp();
      scheduleCanvasScale();
    }, { passive: true });
    window.addEventListener("storage", function (event) {
      if (event.key === STORAGE_KEY && validThemes[event.newValue]) {
        applyTheme(event.newValue, false);
      }
    });
    scheduleClamp();
    scheduleCanvasScale();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
