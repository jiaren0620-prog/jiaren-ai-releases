"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const mainBundlePath = path.join(projectRoot, "dist", "assets", "main-BvGlsrDH.js");
const designBundlePath = path.join(projectRoot, "dist", "assets", "DesignAgentPanel-DdUMLKSc.js");
const updateScriptPath = path.join(projectRoot, "dist", "assets", "jiaren-global-service-0720.js");
const updateStylePath = path.join(projectRoot, "dist", "assets", "jiaren-global-service-0720.css");

function replaceOnce(source, before, after, label) {
  if (source.includes(after)) return source;
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one patch anchor, found ${count}`);
  return source.replace(before, after);
}

let mainBundle = fs.readFileSync(mainBundlePath, "utf8");
const designPanelBefore = "Q.designAgentOpen ? t.jsx(xl, { open: true, runtimeSettings: R, storageSettings: F, canvasAssets: E, selectedAssetId: me, onAddCanvasAsset: Ne, onClose: () => C({ designAgentOpen: false }), onNotice: m }) : null";
const designPanelAfter = `Q.designAgentOpen ? t.jsx(xl, { open: true, runtimeSettings: R, storageSettings: F, canvasAssets: E, selectedAssetId: me, onAddCanvasAsset: (JiarenDesignAsset) => {
    const JiarenDesignNode = Ae({
      kind: "imageInput",
      position: {
        x: Number.isFinite(Number(JiarenDesignAsset.x)) ? Number(JiarenDesignAsset.x) : 560,
        y: Number.isFinite(Number(JiarenDesignAsset.y)) ? Number(JiarenDesignAsset.y) : 180,
      },
      label: JiarenDesignAsset.name || "LLM 智能体设计图",
      data: {
        imageSource: JiarenDesignAsset.dataUrl ?? JiarenDesignAsset.localPath ?? JiarenDesignAsset.source,
        localPath: JiarenDesignAsset.localPath,
        fileName: JiarenDesignAsset.name || "LLM智能体设计.png",
        mimeType: JiarenDesignAsset.mimeType || "image/png",
        width: JiarenDesignAsset.width,
        height: JiarenDesignAsset.height,
        prompt: JiarenDesignAsset.prompt || "",
        modelId: JiarenDesignAsset.modelId,
        modelAlias: JiarenDesignAsset.modelAlias,
        sourceAgent: "design-agent",
        status: "succeeded",
        message: "LLM 智能体生成结果，可保存并从右侧输出端口继续连线。",
      },
    });
    ze(JiarenDesignNode.id);
    m("图片已作为可保存、可连线节点放入画布。");
  }, onClose: () => C({ designAgentOpen: false }), onNotice: m }) : null`;
mainBundle = replaceOnce(mainBundle, designPanelBefore, designPanelAfter, "Design Agent connected output");
fs.writeFileSync(mainBundlePath, mainBundle, "utf8");

let designBundle = fs.readFileSync(designBundlePath, "utf8");
const insertBefore = "x({id:ne(\"design-agent-result\"),kind:\"generated\",name:r,source:o,dataUrl:e.dataUrl,localPath:e.localPath,x:560,y:180,width:e.width,height:e.height})";
const insertAfter = "x({id:ne(\"design-agent-result\"),kind:\"generated\",name:r,source:o,dataUrl:e.dataUrl,localPath:e.localPath,mimeType:e.mimeType||\"image/png\",prompt:e.prompt,modelId:e.modelId,modelAlias:e.modelAlias,x:560,y:180,width:e.width,height:e.height})";
designBundle = replaceOnce(designBundle, insertBefore, insertAfter, "Design Agent output metadata");

const generatedCallBefore = "Re($,`${r.title||\"LLM智能体设计\"}.png`),da($,r,s,v.alias||v.modelId||v.id,v.id)";
const generatedCallAfter = "Re({...$,prompt:oe||r.prompt,modelId:v.id,modelAlias:v.alias||v.modelId||v.id},`${r.title||\"LLM智能体设计\"}.png`),da($,r,s,v.alias||v.modelId||v.id,v.id)";
designBundle = replaceOnce(designBundle, generatedCallBefore, generatedCallAfter, "Design Agent generation metadata");
fs.writeFileSync(designBundlePath, designBundle, "utf8");

let updateScript = fs.readFileSync(updateScriptPath, "utf8");
const overlayBefore = '<div class="jg-body"><p class="jg-message"></p><div class="jg-version" hidden><strong></strong><span></span><code class="jg-checksum"></code></div></div>';
const overlayAfter = '<div class="jg-body"><p class="jg-message"></p><div class="jg-version" hidden><strong></strong><span></span><code class="jg-checksum"></code><div class="jg-update-progress" hidden aria-live="polite"><div class="jg-progress-track" role="progressbar" aria-label="更新下载进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><div class="jg-progress-meta"><b>准备下载</b><span>等待开始</span></div></div></div></div>';
updateScript = replaceOnce(updateScript, overlayBefore, overlayAfter, "Update progress markup");

const announcementBefore = "overlay.querySelector('.jg-version').hidden = true;";
const announcementAfter = "overlay.querySelector('.jg-version').hidden = true;\n    overlay.querySelector('.jg-update-progress').hidden = true;";
updateScript = replaceOnce(updateScript, announcementBefore, announcementAfter, "Announcement progress reset");

const updateVersionBefore = `const version = overlay.querySelector('.jg-version');
    version.hidden = false;
    version.querySelector('strong').textContent = \`Jiaren AI v\${release.version}\`;`;
const updateVersionAfter = `const version = overlay.querySelector('.jg-version');
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
    version.querySelector('strong').textContent = \`Jiaren AI v\${release.version}\`;`;
updateScript = replaceOnce(updateScript, updateVersionBefore, updateVersionAfter, "Update progress initialization");

const clickStartBefore = `update.disabled = true;
      later.disabled = true;
      update.textContent = '正在下载...';
      const formatBytes = (value) => {
        const bytes = Number(value) || 0;
        if (bytes < 1024 * 1024) return \`\${Math.round(bytes / 1024)} KB\`;
        return \`\${(bytes / 1024 / 1024).toFixed(1)} MB\`;
      };`;
const clickStartAfter = `update.disabled = true;
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
        if (bytes < 1024) return \`\${Math.round(bytes)} B\`;
        if (bytes < 1024 * 1024) return \`\${(bytes / 1024).toFixed(bytes >= 1024 * 100 ? 0 : 1)} KB\`;
        return \`\${(bytes / 1024 / 1024).toFixed(1)} MB\`;
      };
      const formatDuration = (seconds) => {
        if (!Number.isFinite(seconds) || seconds <= 0) return '';
        if (seconds < 60) return \`约 \${Math.max(1, Math.ceil(seconds))} 秒\`;
        return \`约 \${Math.ceil(seconds / 60)} 分钟\`;
      };`;
updateScript = replaceOnce(updateScript, clickStartBefore, clickStartAfter, "Update progress start state");

const listenerBefore = `stopDownloadProgress = window.jiaren?.system?.onUpdateDownloadProgress?.((progress) => {
        const downloaded = Number(progress?.downloadedBytes) || 0;
        const total = Number(progress?.totalBytes) || 0;
        const percent = total > 0 ? Math.min(100, Math.round(downloaded / total * 100)) : 0;
        update.textContent = total > 0 ? \`正在下载 \${percent}%\` : \`正在下载 \${formatBytes(downloaded)}\`;
        version.querySelector('span').textContent = total > 0
          ? \`已下载 \${formatBytes(downloaded)} / \${formatBytes(total)}，完成后会自动校验并启动安装程序。\`
          : \`已下载 \${formatBytes(downloaded)}，安装包较大，请保持网络连接。\`;
      }) || null;`;
const listenerAfter = `stopDownloadProgress = window.jiaren?.system?.onUpdateDownloadProgress?.((progress) => {
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
        progressFill.style.setProperty('--jg-update-progress', total > 0 ? \`\${percent}%\` : '34%');
        update.textContent = total > 0 ? \`正在下载 \${percent}%\` : \`已下载 \${formatBytes(downloaded)}\`;
        if (total > 0 && percent >= 100) {
          progressBox.dataset.state = 'verifying';
          progressLabel.textContent = '下载完成，正在校验';
          progressDetail.textContent = \`\${formatBytes(total)} · 正在进行 SHA-256 完整性校验\`;
          version.querySelector('span').textContent = '安装包已下载完成，正在校验文件完整性，请稍候。';
          return;
        }
        progressLabel.textContent = total > 0 ? \`正在下载 · \${percent}%\` : '正在下载安装包';
        const speedText = speed > 0 ? \` · \${formatBytes(speed)}/s\` : '';
        const etaText = remaining > 0 ? \` · 剩余\${formatDuration(remaining)}\` : '';
        progressDetail.textContent = total > 0
          ? \`\${formatBytes(downloaded)} / \${formatBytes(total)}\${speedText}\${etaText}\`
          : \`已下载 \${formatBytes(downloaded)}\${speedText}\`;
        version.querySelector('span').textContent = '更新正在后台下载，可以从下方实时查看速度和预计剩余时间。';
      }) || null;`;
updateScript = replaceOnce(updateScript, listenerBefore, listenerAfter, "Update progress listener");

const successBefore = `localStorage.setItem(HANDLED_VERSION_KEY, release.version);
          update.textContent = result.launched ? '安装程序已启动' : '下载完成';
          window.setTimeout(() => closeOverlay(overlay), 900);`;
const successAfter = `localStorage.setItem(HANDLED_VERSION_KEY, release.version);
          delete update.dataset.downloading;
          progressBox.dataset.state = 'complete';
          progressTrack.classList.remove('is-indeterminate');
          progressTrack.setAttribute('aria-valuenow', '100');
          progressFill.style.setProperty('--jg-update-progress', '100%');
          progressLabel.textContent = result.launched ? '校验完成，安装程序已启动' : '更新包下载完成';
          progressDetail.textContent = result.path || '安装包已保存到本地';
          update.textContent = result.launched ? '安装程序已启动' : '下载完成';
          window.setTimeout(() => closeOverlay(overlay), 1800);`;
updateScript = replaceOnce(updateScript, successBefore, successAfter, "Update progress success state");

const failureBefore = `update.disabled = false;
        later.disabled = false;
        update.textContent = '重新下载';
        version.querySelector('span').textContent = error?.message || '下载失败，请检查网络后重试。';`;
const failureAfter = `update.disabled = false;
        later.disabled = false;
        delete update.dataset.downloading;
        progressBox.dataset.state = 'error';
        progressLabel.textContent = '更新下载失败';
        progressDetail.textContent = error?.message || '请检查网络后重试';
        update.textContent = '重新下载';
        version.querySelector('span').textContent = error?.message || '下载失败，请检查网络后重试。';`;
updateScript = replaceOnce(updateScript, failureBefore, failureAfter, "Update progress error state");
fs.writeFileSync(updateScriptPath, updateScript, "utf8");

let updateStyles = fs.readFileSync(updateStylePath, "utf8");
const styleMarker = "/* Jiaren v0.1.9 updater progress */";
if (!updateStyles.includes(styleMarker)) {
  updateStyles += `

${styleMarker}
.jg-update-progress {
  display: grid;
  gap: 9px;
  margin-top: 14px;
  padding-top: 13px;
  border-top: 1px solid var(--jg-line);
}
.jg-update-progress[hidden] { display: none !important; }
.jg-progress-track {
  position: relative;
  width: 100%;
  height: 7px;
  overflow: hidden;
  border-radius: 4px;
  background: rgba(31,77,55,.1);
  box-shadow: inset 0 0 0 1px rgba(31,77,55,.06);
}
.jg-progress-track i {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--jg-update-progress, 0%);
  border-radius: inherit;
  background: #36b77d;
  transition: width 180ms ease;
}
.jg-progress-track.is-indeterminate i {
  width: 34%;
  animation: jg-update-indeterminate 1.1s ease-in-out infinite;
}
.jg-progress-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
}
.jg-progress-meta b {
  flex: 0 0 auto;
  color: var(--jg-text);
  font-size: 12px;
  font-weight: 750;
}
.jg-progress-meta span {
  min-width: 0;
  overflow: hidden;
  color: var(--jg-muted);
  font-size: 11px;
  line-height: 1.4;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.jg-update-progress[data-state="verifying"] .jg-progress-track i,
.jg-update-progress[data-state="complete"] .jg-progress-track i { background: #82c91e; }
.jg-update-progress[data-state="error"] .jg-progress-track i { background: #dc5f67; }
.jg-actions button[data-downloading="true"] { cursor: wait; opacity: 1; }
@keyframes jg-update-indeterminate {
  0% { transform: translateX(-110%); }
  100% { transform: translateX(330%); }
}
@media (max-width: 520px) {
  .jg-progress-meta { align-items: flex-start; flex-direction: column; gap: 3px; }
  .jg-progress-meta span { text-align: left; white-space: normal; }
}
@media (prefers-reduced-motion: reduce) {
  .jg-progress-track i { transition: none; }
  .jg-progress-track.is-indeterminate i { animation: none; }
}
`;
  fs.writeFileSync(updateStylePath, updateStyles, "utf8");
}

console.log("Patched connected Design Agent output and update progress UI.");
