(() => {
  'use strict';

  const icon = '<svg class="jc-community-share-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3.5a4 4 0 0 1 4 4c0 2.3-1.9 4.1-4.2 4.1A4.1 4.1 0 0 1 2.7 7.5 4 4 0 0 1 7 3.5Z"/><path d="M17 5.5a3 3 0 1 1-.2 6A3 3 0 0 1 17 5.5Z"/><path d="M3.3 20c.7-3.4 3-5.2 6.3-5.2s5.5 1.8 6.1 5.2"/><path d="M15 15c3.2-.5 5.3 1.1 6 4"/></svg>';
  const launcherPositionKey = 'jiaren-community-launcher-position-v1';
  let startupCueRetryTimer = 0;
  let startupCueShownForDocument = false;
  let launcherSyncFrame = 0;

  function syncLauncherVisibility() {
    window.cancelAnimationFrame(launcherSyncFrame);
    launcherSyncFrame = window.requestAnimationFrame(() => {
      const launcher = document.querySelector('.jc-launcher');
      if (!launcher) return;
      const communityOpen = document.querySelector('.jc-shell')?.dataset.open === 'true';
      const onStartup = document.body.classList.contains('jiaren-launch-active');
      const onCanvas = !!document.querySelector('#root .canvas-app-shell') && !onStartup;
      launcher.style.setProperty('display', onCanvas && !communityOpen ? 'inline-flex' : 'none', 'important');
      launcher.dataset.canvasVisible = onCanvas && !communityOpen ? 'true' : 'false';
    });
  }

  function clampLauncherPosition(launcher, left, top) {
    const rect = launcher.getBoundingClientRect();
    const margin = 12;
    return {
      left: Math.max(margin, Math.min(left, window.innerWidth - rect.width - margin)),
      top: Math.max(margin, Math.min(top, window.innerHeight - rect.height - margin)),
    };
  }

  function setLauncherPosition(launcher, left, top) {
    const next = clampLauncherPosition(launcher, left, top);
    launcher.style.setProperty('left', `${next.left}px`, 'important');
    launcher.style.setProperty('top', `${next.top}px`, 'important');
    launcher.style.setProperty('right', 'auto', 'important');
    launcher.style.setProperty('bottom', 'auto', 'important');
    return next;
  }

  function enableLauncherDragging(launcher) {
    let drag = null;
    let blockOpenUntil = 0;

    try {
      const saved = JSON.parse(localStorage.getItem(launcherPositionKey) || 'null');
      if (Number.isFinite(saved?.left) && Number.isFinite(saved?.top)) {
        requestAnimationFrame(() => setLauncherPosition(launcher, saved.left, saved.top));
      }
    } catch (_) {}

    launcher.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const rect = launcher.getBoundingClientRect();
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: rect.left,
        top: rect.top,
        moved: false,
      };
      launcher.setPointerCapture?.(event.pointerId);
    });

    const moveDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      drag.moved = true;
      launcher.classList.add('is-dragging');
      setLauncherPosition(launcher, drag.left + dx, drag.top + dy);
      event.preventDefault();
    };

    const finishDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (drag.moved) {
        const rect = launcher.getBoundingClientRect();
        const next = setLauncherPosition(launcher, rect.left, rect.top);
        try { localStorage.setItem(launcherPositionKey, JSON.stringify(next)); } catch (_) {}
        blockOpenUntil = Date.now() + 500;
        event.preventDefault();
        event.stopPropagation();
      }
      launcher.classList.remove('is-dragging');
      launcher.releasePointerCapture?.(event.pointerId);
      drag = null;
    };

    document.addEventListener('pointermove', moveDrag, true);
    document.addEventListener('pointerup', finishDrag, true);
    document.addEventListener('pointercancel', finishDrag, true);
    launcher.addEventListener('click', (event) => {
      if (Date.now() < blockOpenUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      window.JiarenCommunity?.open();
    }, true);

    window.addEventListener('resize', () => {
      if (!launcher.style.left) return;
      const rect = launcher.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2 || getComputedStyle(launcher).display === 'none') return;
      const next = setLauncherPosition(launcher, rect.left, rect.top);
      try { localStorage.setItem(launcherPositionKey, JSON.stringify(next)); } catch (_) {}
    });
  }

  function addLauncher() {
    if (document.querySelector('.jc-launcher')) return;
    const launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'jc-launcher';
    launcher.setAttribute('aria-label', '打开创作者社区');
    launcher.title = '创作者社区';
    launcher.innerHTML = `
      <img class="jc-launcher-compact" src="./assets/jiaren-community-logo.png" alt="" aria-hidden="true" />
      <img class="jc-launcher-expanded" src="./assets/jiaren-community-logo.png" alt="" aria-hidden="true" />`;
    document.body.append(launcher);
    enableLauncherDragging(launcher);
    syncLauncherVisibility();
  }

  function addStartupCommunityGesture() {
    if (startupCueShownForDocument || document.body?.dataset.communityStandalone === 'true' || document.querySelector('.jc-startup-community-cue')) return;
    if (!document.body.classList.contains('jiaren-launch-active') || !document.querySelector('.jiaren-launch-chooser')) {
      window.clearTimeout(startupCueRetryTimer);
      startupCueRetryTimer = window.setTimeout(addStartupCommunityGesture, 250);
      return;
    }
    startupCueRetryTimer = 0;
    startupCueShownForDocument = true;
    const cue = document.createElement('section');
    cue.className = 'jc-startup-community-cue';
    cue.setAttribute('aria-label', '滚动进入创作者社区');
    cue.innerHTML = `
      <button type="button" class="jc-startup-community-main" aria-label="打开创作者社区">
        <img src="./assets/jiaren-community-logo.png" alt="" aria-hidden="true" />
        <span><strong>创作者社区</strong><small>向下滚动进入</small></span>
        <i class="jc-startup-mouse" aria-hidden="true"><b></b></i>
      </button>
      <button type="button" class="jc-startup-community-dismiss" aria-label="关闭提示">×</button>`;
    document.body.append(cue);

    let wheelDistance = 0;
    let pointerStart = null;
    let launchObserver = null;
    const closeCue = () => {
      launchObserver?.disconnect();
      cue.classList.remove('is-ready');
      window.setTimeout(() => cue.remove(), 180);
    };
    const enterCommunity = () => {
      closeCue();
      window.JiarenCommunity?.open();
    };
    cue.querySelector('.jc-startup-community-main').addEventListener('click', enterCommunity);
    cue.querySelector('.jc-startup-community-dismiss').addEventListener('click', closeCue);
    cue.addEventListener('wheel', (event) => {
      wheelDistance += Math.max(0, event.deltaY);
      event.preventDefault();
      if (wheelDistance >= 72) enterCommunity();
    }, { passive: false });
    cue.addEventListener('pointerdown', (event) => {
      pointerStart = { id: event.pointerId, y: event.clientY };
      cue.setPointerCapture?.(event.pointerId);
    });
    cue.addEventListener('pointerup', (event) => {
      if (pointerStart?.id === event.pointerId && event.clientY - pointerStart.y > 34) enterCommunity();
      pointerStart = null;
    });
    launchObserver = new MutationObserver(() => {
      if (!document.body.classList.contains('jiaren-launch-active')) closeCue();
    });
    launchObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    requestAnimationFrame(() => cue.classList.add('is-ready'));
    window.setTimeout(() => { if (cue.isConnected) closeCue(); }, 4000);
  }

  function mediaDraft(node) {
    const media = node.querySelector('video[src], img[src]');
    if (!media?.src || media.src.startsWith('data:image/svg')) return null;
    const type = media.tagName === 'VIDEO' ? 'video' : 'image';
    const title = [...node.querySelectorAll('h1,h2,h3,h4,[class*="title"],[class*="header"]')]
      .map((item) => item.textContent?.trim()).find((value) => value && value.length <= 100) || (type === 'video' ? '画布视频作品' : '画布图片作品');
    const prompt = [...node.querySelectorAll('textarea,[data-prompt],[class*="prompt"]')]
      .map((item) => (item.value || item.dataset.prompt || item.textContent || '').trim())
      .find((value) => value.length > 8) || '';
    const nodeText = String(node.textContent || '').replace(/\s+/g, ' ').trim();
    const model = [...node.querySelectorAll('select option:checked,[data-model],[data-model-id],[class*="model"]')]
      .map((item) => (item.dataset.model || item.dataset.modelId || item.textContent || '').trim())
      .find((value) => value && value.length <= 120 && !/选择|未配置|模型$/.test(value)) || '';
    const seedMatch = nodeText.match(/(?:Seed|随机种子)\s*[:：]?\s*(-?\d+)/i);
    const ratioMatch = nodeText.match(/(?:比例|画幅|Ratio)\s*[:：]?\s*(\d{1,2}:\d{1,2})/i) || nodeText.match(/\b(1:1|3:2|2:3|4:3|3:4|16:9|9:16|21:9)\b/);
    const resolutionMatch = nodeText.match(/\b(480p|720p|1080p|1K|2K|4K|8K)\b/i);
    const rect = media.getBoundingClientRect();
    return {
      type,
      url: media.currentSrc || media.src,
      mimeType: type === 'video' ? 'video/mp4' : 'image/png',
      title,
      prompt: prompt.slice(0, 8000),
      model,
      seed: seedMatch ? Number(seedMatch[1]) : null,
      aspectRatio: ratioMatch?.[1] || '',
      width: media.naturalWidth || media.videoWidth || Math.round(rect.width),
      height: media.naturalHeight || media.videoHeight || Math.round(rect.height),
      durationSeconds: Number.isFinite(media.duration) ? media.duration : null,
      nodeType: node.dataset.type || [...node.classList].find((name) => name.includes('node')) || 'media',
      generationMetadata: {
        model,
        seed: seedMatch ? Number(seedMatch[1]) : null,
        aspectRatio: ratioMatch?.[1] || '',
        resolution: resolutionMatch?.[1] || '',
      },
      fileName: `jiaren-${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'png'}`,
    };
  }

  function closeContextMenu() {
    document.querySelector('.jc-context-menu')?.remove();
    document.querySelector('.jc-community-context-item')?.remove();
  }

  function createShareItem(draft) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'jc-context-item jc-community-context-item';
    item.title = '将当前作品分享到创作者社区';
    item.innerHTML = `${icon}<span>分享到社区</span>`;
    item.addEventListener('click', () => {
      closeContextMenu();
      window.JiarenCommunity?.openShare(draft);
    });
    return item;
  }

  function showShareAction(draft, clientX, clientY) {
    window.setTimeout(() => {
      closeContextMenu();
      const nativeMenu = document.querySelector('.image-selection-popover');
      if (nativeMenu) {
        if (!nativeMenu.querySelector(".jc-community-context-item")) nativeMenu.append(createShareItem(draft));
        return;
      }
      const menu = document.createElement('div');
      menu.className = 'jc-context-menu';
      menu.append(createShareItem(draft));
      document.body.append(menu);
      const width = 170, height = 52;
      menu.style.left = `${Math.min(clientX, window.innerWidth - width - 8)}px`;
      menu.style.top = `${Math.min(clientY, window.innerHeight - height - 8)}px`;
    }, 0);
  }

  document.addEventListener('contextmenu', (event) => {
    if (event.target.closest('.jc-shell,.jc-dialog,.jc-launcher')) return;
    const node = event.target.closest('.react-flow__node,[data-id][class*="node"],[class*="Node"][data-id]');
    if (!node) return;
    const draft = mediaDraft(node);
    if (!draft) return;
    event.preventDefault();
    showShareAction(draft, event.clientX, event.clientY);
  }, true);

  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.jc-context-menu,.jc-community-context-item')) closeContextMenu();
  }, true);
  window.addEventListener('blur', closeContextMenu);
  window.addEventListener('jiaren:community:add-to-canvas', (event) => {
    window.dispatchEvent(new CustomEvent('jiaren:canvas:import-media-package', { detail: event.detail }));
  });

  const boot = () => {
    window.JiarenCommunity?.boot();
    addLauncher();
    addStartupCommunityGesture();
    const observer = new MutationObserver(() => syncLauncherVisibility());
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-open'], childList: true, subtree: true });
    window.addEventListener('jiaren:community:opened', syncLauncherVisibility);
    window.addEventListener('jiaren:community:closed', syncLauncherVisibility);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();

/* Jiaren native image menu share dedupe v112 */
