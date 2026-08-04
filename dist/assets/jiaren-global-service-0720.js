(() => {
  'use strict';

  let currentVersion = '0.1.9';
  const API = 'https://api.jiaren.xyz/v1';
  const DISMISSED_KEY = 'jiaren-global-dismissed-announcements';
  const HANDLED_VERSION_KEY = 'jiaren-global-handled-version';
  let stopDownloadProgress = null;

  function versionParts(value) {
    return String(value || '').replace(/^v/i, '').split(/[+-]/)[0].split('.').map((part) => Number(part) || 0);
  }

  function isNewer(candidate, current) {
    const left = versionParts(candidate);
    const right = versionParts(current);
    for (let index = 0; index < Math.max(left.length, right.length, 3); index += 1) {
      if ((left[index] || 0) !== (right[index] || 0)) return (left[index] || 0) > (right[index] || 0);
    }
    return false;
  }

  function readDismissed() {
    try { return new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]')); } catch { return new Set(); }
  }

  function dismissAnnouncement(id) {
    const dismissed = readDismissed();
    dismissed.add(id);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed].slice(-200)));
  }

  async function requestBootstrap() {
    if (window.jiaren?.system?.getAppVersion) {
      const result = await window.jiaren.system.getAppVersion().catch(() => null);
      if (result?.version) currentVersion = result.version;
    }
    const response = await fetch(`${API}/app/bootstrap?version=${encodeURIComponent(currentVersion)}&platform=windows-x64`);
    if (!response.ok) throw new Error(`Update service returned ${response.status}`);
    return response.json();
  }

  function buildOverlay() {
    let overlay = document.querySelector('.jg-overlay');
    if (overlay) return overlay;
    overlay = document.createElement('section');
    overlay.className = 'jg-overlay';
    overlay.dataset.open = 'false';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <article class="jg-dialog">
        <header class="jg-head"><img class="jg-mark" src="./assets/jiaren-logo-latest.png" alt="" aria-hidden="true" /><div class="jg-title-wrap"><span class="jg-kicker"></span><h2 class="jg-title"></h2><p class="jg-subtitle"></p></div></header>
        <div class="jg-body"><p class="jg-message"></p><div class="jg-version" hidden><strong></strong><span></span><code class="jg-checksum"></code><div class="jg-update-progress" hidden aria-live="polite"><div class="jg-progress-track" role="progressbar" aria-label="更新下载进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><div class="jg-progress-meta"><b>准备下载</b><span>等待开始</span></div></div></div></div>
        <footer class="jg-actions"></footer>
      </article>`;
    document.body.append(overlay);
    return overlay;
  }

  function closeOverlay(overlay) {
    stopDownloadProgress?.();
    stopDownloadProgress = null;
    overlay.dataset.open = 'false';
    window.setTimeout(() => { overlay.hidden = true; }, 200);
  }

  function showAnnouncement(item, onClose) {
    const overlay = buildOverlay();
    overlay.dataset.kind = 'announcement';
    overlay.hidden = false;
    overlay.querySelector('.jg-kicker').textContent = item.severity === 'warning' ? '重要通知' : item.severity === 'success' ? '功能通知' : '软件公告';
    overlay.querySelector('.jg-title').textContent = item.title;
    overlay.querySelector('.jg-subtitle').textContent = item.publishedAt ? new Date(item.publishedAt).toLocaleString('zh-CN') : 'Jiaren AI';
    overlay.querySelector('.jg-message').textContent = item.body;
    overlay.querySelector('.jg-version').hidden = true;
    overlay.querySelector('.jg-update-progress').hidden = true;
    const actions = overlay.querySelector('.jg-actions');
    actions.replaceChildren();
    const confirm = document.createElement('button');
    confirm.type = 'button';
    confirm.dataset.primary = 'true';
    confirm.textContent = '知道了';
    confirm.addEventListener('click', () => { dismissAnnouncement(item.id); closeOverlay(overlay); onClose(); }, { once: true });
    actions.append(confirm);
    requestAnimationFrame(() => { overlay.dataset.open = 'true'; confirm.focus(); });
  }

  function showUpdate(release) {
    const overlay = buildOverlay();
    overlay.dataset.kind = 'update';
    overlay.hidden = false;
    overlay.querySelector('.jg-kicker').textContent = '发现新版本';
    overlay.querySelector('.jg-title').textContent = release.title;
    overlay.querySelector('.jg-subtitle').textContent = `当前版本 ${currentVersion} · 最新版本 ${release.version}`;
    overlay.querySelector('.jg-message').textContent = release.notes;
    const version = overlay.querySelector('.jg-version');
    version.hidden = false;
    const progressBox = version.querySelector('.jg-update-progress');
    const progressTrack = progressBox.querySelector('.jg-progress-track');
    const progressFill = progressTrack.querySelector('i');
    const progressLabel = progressBox.querySelector('.jg-progress-meta b');
    const progressDetail = progressBox.querySelector('.jg-progress-meta span');
    progressBox.hidden = true;
    progressBox.dataset.state = 'idle';
    progressTrack.setAttribute('aria-valuenow', '0');
    progressFill.style.setProperty('--jg-update-progress', '0%');
    version.querySelector('strong').textContent = `Jiaren AI v${release.version}`;
    version.querySelector('span').textContent = '点击更新后会自动下载并校验安装包，完成后启动安装程序。';
    const checksum = version.querySelector('.jg-checksum');
    checksum.textContent = release.checksumSha256 ? `SHA-256 ${release.checksumSha256}` : '';
    checksum.hidden = !release.checksumSha256;
    const actions = overlay.querySelector('.jg-actions');
    actions.replaceChildren();
    const later = document.createElement('button');
    later.type = 'button';
    later.textContent = '暂不更新';
    later.addEventListener('click', () => {
      localStorage.setItem(HANDLED_VERSION_KEY, release.version);
      closeOverlay(overlay);
    });
    const update = document.createElement('button');
    update.type = 'button';
    update.dataset.primary = 'true';
    update.textContent = '更新';
    update.addEventListener('click', async () => {
      update.disabled = true;
      later.disabled = true;
      update.dataset.downloading = 'true';
      update.textContent = '正在下载 0%';
      progressBox.hidden = false;
      progressBox.dataset.state = 'downloading';
      progressLabel.textContent = '正在下载安装包';
      progressDetail.textContent = '正在连接更新服务器...';
      const startedAt = performance.now();
      let lastProgressAt = startedAt;
      let lastDownloaded = 0;
      let smoothedSpeed = 0;
      const formatBytes = (value) => {
        const bytes = Number(value) || 0;
        if (bytes < 1024) return `${Math.round(bytes)} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes >= 1024 * 100 ? 0 : 1)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
      };
      const formatDuration = (seconds) => {
        if (!Number.isFinite(seconds) || seconds <= 0) return '';
        if (seconds < 60) return `约 ${Math.max(1, Math.ceil(seconds))} 秒`;
        return `约 ${Math.ceil(seconds / 60)} 分钟`;
      };
      stopDownloadProgress?.();
      stopDownloadProgress = window.jiaren?.system?.onUpdateDownloadProgress?.((progress) => {
        const now = performance.now();
        const downloaded = Number(progress?.downloadedBytes) || 0;
        const total = Number(progress?.totalBytes) || 0;
        const percent = total > 0 ? Math.min(100, Math.round(downloaded / total * 100)) : 0;
        const deltaSeconds = Math.max(0.001, (now - lastProgressAt) / 1000);
        const instantSpeed = Math.max(0, downloaded - lastDownloaded) / deltaSeconds;
        if (instantSpeed > 0) smoothedSpeed = smoothedSpeed > 0 ? smoothedSpeed * 0.72 + instantSpeed * 0.28 : instantSpeed;
        const elapsedSeconds = Math.max(0.001, (now - startedAt) / 1000);
        const averageSpeed = downloaded / elapsedSeconds;
        const speed = smoothedSpeed || averageSpeed;
        const remaining = total > downloaded && speed > 0 ? (total - downloaded) / speed : 0;
        lastProgressAt = now;
        lastDownloaded = downloaded;
        progressTrack.classList.toggle('is-indeterminate', total <= 0);
        progressTrack.setAttribute('aria-valuenow', String(percent));
        progressFill.style.setProperty('--jg-update-progress', total > 0 ? `${percent}%` : '34%');
        update.textContent = total > 0 ? `正在下载 ${percent}%` : `已下载 ${formatBytes(downloaded)}`;
        if (total > 0 && percent >= 100) {
          progressBox.dataset.state = 'verifying';
          progressLabel.textContent = '下载完成，正在校验';
          progressDetail.textContent = `${formatBytes(total)} · 正在进行 SHA-256 完整性校验`;
          version.querySelector('span').textContent = '安装包已下载完成，正在校验文件完整性，请稍候。';
          return;
        }
        progressLabel.textContent = total > 0 ? `正在下载 · ${percent}%` : '正在下载安装包';
        const speedText = speed > 0 ? ` · ${formatBytes(speed)}/s` : '';
        const etaText = remaining > 0 ? ` · 剩余${formatDuration(remaining)}` : '';
        progressDetail.textContent = total > 0
          ? `${formatBytes(downloaded)} / ${formatBytes(total)}${speedText}${etaText}`
          : `已下载 ${formatBytes(downloaded)}${speedText}`;
        version.querySelector('span').textContent = '更新正在后台下载，可以从下方实时查看速度和预计剩余时间。';
      }) || null;
      try {
        if (window.jiaren?.system?.downloadUpdate) {
          const result = await window.jiaren.system.downloadUpdate({
            url: release.downloadUrl,
            version: release.version,
            checksumSha256: release.checksumSha256 || '',
          });
          if (!result?.ok) throw new Error(result?.message || '下载安装包失败');
          localStorage.setItem(HANDLED_VERSION_KEY, release.version);
          delete update.dataset.downloading;
          progressBox.dataset.state = 'complete';
          progressTrack.classList.remove('is-indeterminate');
          progressTrack.setAttribute('aria-valuenow', '100');
          progressFill.style.setProperty('--jg-update-progress', '100%');
          progressLabel.textContent = result.launched ? '校验完成，安装程序已启动' : '更新包下载完成';
          progressDetail.textContent = result.path || '安装包已保存到本地';
          update.textContent = result.launched ? '安装程序已启动' : '下载完成';
          window.setTimeout(() => closeOverlay(overlay), 1800);
        } else {
          window.open(release.downloadUrl, '_blank', 'noopener');
          localStorage.setItem(HANDLED_VERSION_KEY, release.version);
          closeOverlay(overlay);
        }
      } catch (error) {
        update.disabled = false;
        later.disabled = false;
        delete update.dataset.downloading;
        progressBox.dataset.state = 'error';
        progressLabel.textContent = '更新下载失败';
        progressDetail.textContent = error?.message || '请检查网络后重试';
        update.textContent = '重新下载';
        version.querySelector('span').textContent = error?.message || '下载失败，请检查网络后重试。';
      } finally {
        stopDownloadProgress?.();
        stopDownloadProgress = null;
      }
    });
    actions.append(later, update);
    requestAnimationFrame(() => { overlay.dataset.open = 'true'; update.focus(); });
  }

  async function checkNow() {
    try {
      const payload = await requestBootstrap();
      const dismissed = readDismissed();
      const announcements = (payload.announcements || []).filter((item) => !dismissed.has(item.id));
      const release = payload.latestRelease;
      const showRelease = release && isNewer(release.version, currentVersion)
        && localStorage.getItem(HANDLED_VERSION_KEY) !== release.version;
      const next = () => {
        const announcement = announcements.shift();
        if (announcement) showAnnouncement(announcement, next);
        else if (showRelease) showUpdate(release);
      };
      next();
      return payload;
    } catch {
      return null;
    }
  }

  window.JiarenGlobalService = Object.freeze({ checkNow, get currentVersion() { return currentVersion; } });
  const start = () => window.setTimeout(checkNow, 2200);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
