import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error('JIAREN_QA_RUNTIME is required');

const exePath = process.env.JIAREN_QA_EXE || path.join(runtimeDir, 'Jiaren AI.exe');
const appPath = process.env.JIAREN_QA_APP || '';
const testId = `${Date.now()}-${process.pid}`;
const ownsProfile = !process.env.JIAREN_QA_PROFILE;
const userDataDir = process.env.JIAREN_QA_PROFILE || path.join(os.tmpdir(), `jiaren-qa-image-v88-${testId}`);
const screenshotPath = process.env.JIAREN_QA_SCREENSHOT || path.resolve('tests', 'artifacts', 'qa-image-composer-v88.png');
const port = Number(process.env.JIAREN_QA_PORT || 9364);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await fs.mkdir(userDataDir, { recursive: true });

async function findTarget() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const pages = targets.filter((item) => item.type === 'page' && item.webSocketDebuggerUrl);
      const target = pages.find((item) => item.title === 'Jiaren AI')
        || pages.find((item) => item.url && item.url !== 'about:blank')
        || pages[0];
      if (target) return target;
    } catch {}
    await pause(300);
  }
  throw new Error('Jiaren AI CDP page target not found');
}

const launchArgs = appPath ? [appPath] : [];
launchArgs.push(
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
);
const child = spawn(exePath, launchArgs, {
  cwd: appPath || runtimeDir,
  stdio: 'ignore',
});

let socket;
try {
  const target = await findTarget();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  const runtimeErrors = [];
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id && pending.has(message.id)) {
      const task = pending.get(message.id);
      pending.delete(message.id);
      message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') {
      runtimeErrors.push(message.params?.exceptionDetails?.text || 'Runtime exception');
    } else if (message.method === 'Log.entryAdded' && message.params?.entry?.level === 'error') {
      runtimeErrors.push(message.params.entry.text);
    }
  });

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result?.value;
  };

  await Promise.all([
    send('Runtime.enable'),
    send('Page.enable'),
    send('Log.enable'),
    send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    }),
  ]);

  const chooserDeadline = Date.now() + 20000;
  while (Date.now() < chooserDeadline) {
    if (await evaluate(`Boolean(document.querySelector('.jiaren-launch-chooser'))`)) break;
    await pause(250);
  }
  if (await evaluate(`Boolean(document.querySelector('.jiaren-launch-notice-backdrop button'))`)) {
    await evaluate(`document.querySelector('.jiaren-launch-notice-backdrop button')?.click()`);
    const noticeDeadline = Date.now() + 5000;
    while (Date.now() < noticeDeadline) {
      if (await evaluate(`!document.querySelector('.jiaren-launch-notice-backdrop')`)) break;
      await pause(100);
    }
  }
  await evaluate(`document.querySelector('.jiaren-launch-chooser button[data-mode="drawing"]')?.click()`);

  const canvasDeadline = Date.now() + 20000;
  while (Date.now() < canvasDeadline) {
    if (await evaluate(`Boolean(window.__JIAREN_CANVAS_AGENT__ && document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar)'))`)) break;
    await pause(250);
  }

  const setup = await evaluate(`(async () => {
    const bridge = window.__JIAREN_CANVAS_AGENT__;
    if (!bridge) throw new Error('Canvas Agent bridge is unavailable');
    let snapshot = bridge.getSnapshot();
    let node = snapshot.nodes.find((item) => item.id === snapshot.selectedNodeId && item.data?.kind === 'generateImage')
      || snapshot.nodes.find((item) => item.data?.kind === 'generateImage');
    if (!node) {
      const added = await bridge.applyOperations([{
        type: 'node.add',
        kind: 'generateImage',
        position: { x: 480, y: 240 },
        data: { prompt: '', count: 1, loopCount: 1, status: 'idle' },
      }]);
      const nodeId = added.receipts[0].nodeId;
      await bridge.applyOperations([{ type: 'node.select', nodeId }]);
      snapshot = bridge.getSnapshot();
      node = snapshot.nodes.find((item) => item.id === nodeId);
    } else if (snapshot.selectedNodeId !== node.id) {
      await bridge.applyOperations([{ type: 'node.select', nodeId: node.id }]);
    }
    return { nodeId: node.id, count: node.data?.count, loopCount: node.data?.loopCount };
  })()`);
  assert.ok(setup.count == null || setup.count === 1, `Image node count must migrate to the UI default or equal 1, got ${setup.count}`);
  assert.ok(setup.loopCount == null || setup.loopCount === 1, `Image node loop count must migrate to the UI default or equal 1, got ${setup.loopCount}`);
  await pause(500);
  await evaluate(`document.querySelector('.canvas-node[data-node-id=${JSON.stringify(setup.nodeId)}]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))`);
  const promptDeadline = Date.now() + 10000;
  while (Date.now() < promptDeadline) {
    if (await evaluate(`Boolean(document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) .compact-selector'))`)) break;
    await pause(150);
  }

  await evaluate(`document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) .compact-selector')?.click()`);
  await pause(180);
  const params = await evaluate(`(() => {
    const popover = document.querySelector('.params-picker-popover');
    const sections = Array.from(popover?.querySelectorAll(':scope > section') || []);
    const activeBatch = sections.at(-1)?.querySelector('.token.active');
    const style = popover ? getComputedStyle(popover) : null;
    const activeStyle = activeBatch ? getComputedStyle(activeBatch) : null;
    return {
      exists: Boolean(popover),
      sectionCount: sections.length,
      sectionValues: sections.map((section) => Array.from(section.querySelectorAll('button')).map((button) => button.textContent.trim())),
      batch: activeBatch?.textContent.trim(),
      background: style?.backgroundColor,
      color: style?.color,
      activeBackground: activeStyle?.backgroundColor,
      activeColor: activeStyle?.color,
      buttons: Array.from(document.querySelectorAll('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) button')).map((node) => ({ className: node.className, text: node.textContent.trim() })),
    };
  })()`);
  assert.equal(params.exists, true, `Parameter popover did not open: ${JSON.stringify(params)}`);
  assert.equal(params.batch, '1', `Parameter popover default batch must be 1, got ${params.batch}`);
  assert.notEqual(params.background, 'rgb(255, 255, 255)', 'Parameter popover must not use a white background');
  assert.notEqual(params.color, 'rgb(0, 0, 0)', 'Parameter popover text must not be black on the dark theme');
  const parameterStress = await evaluate(`(async () => {
    if (!document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) .compact-selector')) throw new Error('Image parameter controls are unavailable');
    const delays = [];
    const longTasks = [];
    const observer = typeof PerformanceObserver === 'function'
      ? new PerformanceObserver((list) => list.getEntries().forEach((entry) => longTasks.push(Math.round(entry.duration))))
      : null;
    try { observer?.observe({ type: 'longtask', buffered: true }); } catch {}
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const groups = ['.token-grid', '.ratio-grid', '.token-grid', '.token-grid'];
    for (let index = 0; index < 80; index += 1) {
      const composer = document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar)');
      const selector = composer?.querySelector('.compact-selector');
      if (!composer || !selector) {
        const snapshot = window.__JIAREN_CANVAS_AGENT__?.getSnapshot?.();
        const diagnostic = {
          iteration: index,
          selectedNodeId: snapshot?.selectedNodeId,
          promptBarCount: document.querySelectorAll('.lovart-prompt-console').length,
          activePromptBarCount: document.querySelectorAll('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar)').length,
          selectorCount: document.querySelectorAll('.compact-selector').length,
          nodeExists: snapshot?.nodes?.some((item) => item.id === ${JSON.stringify(setup.nodeId)}),
          nodeKind: snapshot?.nodes?.find((item) => item.id === ${JSON.stringify(setup.nodeId)})?.data?.kind,
          bodyClasses: document.body.className,
        };
        throw new Error('Image parameter controls were replaced without a current selector: ' + JSON.stringify(diagnostic));
      }
      if (!composer.querySelector('.params-picker-popover')) selector.click();
      await nextFrame();
      const popover = composer.querySelector('.params-picker-popover');
      if (!popover) throw new Error('Parameter popover stopped opening at iteration ' + index);
      const section = popover.querySelectorAll('section')[index % popover.querySelectorAll('section').length];
      const choices = Array.from(section?.querySelectorAll('button') || []);
      if (!choices.length) throw new Error('Parameter choices are missing at iteration ' + index);
      const choice = choices[Math.floor(index / 4) % choices.length];
      const startedAt = performance.now();
      choice.click();
      await nextFrame();
      delays.push(performance.now() - startedAt);
    }
    observer?.disconnect();
    const snapshot = window.__JIAREN_CANVAS_AGENT__.getSnapshot();
    const node = snapshot.nodes.find((item) => item.id === ${JSON.stringify(setup.nodeId)});
    return {
      clicks: delays.length,
      maxDelay: Math.round(Math.max(...delays)),
      averageDelay: Math.round(delays.reduce((sum, value) => sum + value, 0) / delays.length),
      over250ms: delays.filter((value) => value > 250).length,
      longTasks,
      finalData: {
        resolution: node?.data?.resolution,
        aspectRatio: node?.data?.aspectRatio,
        quality: node?.data?.quality,
        count: node?.data?.count,
      },
    };
  })()`);
  assert.equal(parameterStress.clicks, 80, `Parameter stress test stopped early: ${JSON.stringify(parameterStress)}`);
  assert.equal(parameterStress.over250ms, 0, `Parameter selection blocked the UI: ${JSON.stringify(parameterStress)}`);
  assert.ok(parameterStress.maxDelay < 250, `Parameter selection became unresponsive: ${JSON.stringify(parameterStress)}`);

  async function inspectPopover(buttonSelector, popoverSelector, label) {
    await evaluate(`document.querySelector(${JSON.stringify(buttonSelector)})?.click()`);
    await pause(180);
    const result = await evaluate(`(() => {
      const popover = document.querySelector(${JSON.stringify(popoverSelector)});
      const style = popover ? getComputedStyle(popover) : null;
      const sample = popover?.querySelector('button, p, strong, label, span');
      const sampleStyle = sample ? getComputedStyle(sample) : null;
      return {
        exists: Boolean(popover),
        background: style?.backgroundColor,
        color: style?.color,
        sampleText: sample?.textContent.trim(),
        sampleColor: sampleStyle?.color,
      };
    })()`);
    assert.equal(result.exists, true, `${label} popover did not open: ${JSON.stringify(result)}`);
    assert.notEqual(result.background, 'rgb(255, 255, 255)', `${label} popover must not use a white background`);
    assert.notEqual(result.color, 'rgb(0, 0, 0)', `${label} popover text must remain readable`);
    await evaluate(`document.querySelector(${JSON.stringify(buttonSelector)})?.click()`);
    return result;
  }

  const models = await inspectPopover('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) .model-pill', '.model-picker-popover', 'Model');
  const camera = await inspectPopover('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) .camera-control-button', '.camera-picker-popover', 'Camera');

  const progressLayout = await evaluate(`(() => {
    const consoleNode = document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar)');
    const progress = document.createElement('div');
    progress.className = 'iridescent-progress compact jiaren-v88-qa-progress';
    progress.innerHTML = '<div class="iridescent-progress-content"><div class="iridescent-progress-ring"><span>42</span></div><strong>生成中</strong></div>';
    consoleNode.appendChild(progress);
    const tabs = consoleNode.querySelector('.jiaren-media-mode-tabs');
    const a = tabs.getBoundingClientRect();
    const b = progress.getBoundingClientRect();
    const intersects = !(b.right <= a.left || b.left >= a.right || b.bottom <= a.top || b.top >= a.bottom);
    const result = { intersects, tabs: { left: a.left, top: a.top, right: a.right, bottom: a.bottom }, progress: { left: b.left, top: b.top, right: b.right, bottom: b.bottom } };
    progress.remove();
    return result;
  })()`);
  assert.equal(progressLayout.intersects, false, `Progress indicator overlaps mode tabs: ${JSON.stringify(progressLayout)}`);

  const svg = (label, color, width, height) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#0d120d"/><rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="18" fill="${color}"/><text x="50%" y="52%" text-anchor="middle" font-family="Arial" font-size="64" fill="#091009">${label}</text></svg>`)}`;
  const singleAsset = { id: 'qa-single', type: 'image', dataUrl: svg('1', '#c7ff3d', 960, 540), width: 960, height: 540 };
  await evaluate(`window.__JIAREN_CANVAS_AGENT__.applyOperations([{
    type: 'node.update',
    nodeId: ${JSON.stringify(setup.nodeId)},
    patch: ${JSON.stringify({
      prompt: '矢量图的猫',
      count: 1,
      loopCount: 1,
      imageSource: singleAsset.dataUrl,
      outputAssets: [singleAsset],
      width: 960,
      height: 540,
      status: 'succeeded',
      message: 'QA single image',
    })},
  }])`);
  await pause(700);

  const singleLayout = await evaluate(`(() => {
    const card = document.querySelector('.canvas-node.jiaren-drawing-media-card[data-node-id=${JSON.stringify(setup.nodeId)}]');
    const body = card?.querySelector('.node-body');
    const image = card?.querySelector('.node-preview-image');
    const rect = (node) => node ? node.getBoundingClientRect() : null;
    const cardRect = rect(card), bodyRect = rect(body), imageRect = rect(image);
    return {
      card: cardRect && { width: cardRect.width, height: cardRect.height },
      body: bodyRect && { width: bodyRect.width, height: bodyRect.height, bottom: bodyRect.bottom },
      image: imageRect && { width: imageRect.width, height: imageRect.height, bottom: imageRect.bottom, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight },
      text: card?.textContent || '',
    };
  })()`);
  assert.ok(singleLayout.image?.naturalWidth > 0, 'Single image did not load');
  assert.ok(Math.abs(singleLayout.image.width / singleLayout.image.height - 16 / 9) < 0.03, `Single image ratio is incorrect: ${JSON.stringify(singleLayout)}`);
  assert.ok(Math.abs(singleLayout.body.height - singleLayout.image.height) < 4, `Single image body contains excessive empty space: ${JSON.stringify(singleLayout)}`);
  assert.equal(singleLayout.text.includes('@1'), false, 'Generated image node still exposes @1');

  const portraitAsset = { id: 'qa-portrait', type: 'image', dataUrl: svg('P', '#73e7bf', 540, 960), width: 540, height: 960 };
  await evaluate(`window.__JIAREN_CANVAS_AGENT__.applyOperations([{
    type: 'node.update',
    nodeId: ${JSON.stringify(setup.nodeId)},
    patch: ${JSON.stringify({
      imageSource: portraitAsset.dataUrl,
      outputAssets: [portraitAsset],
      width: 540,
      height: 960,
      status: 'succeeded',
      message: 'QA portrait image',
    })},
  }])`);
  await pause(500);

  const portraitLayout = await evaluate(`(() => {
    const card = document.querySelector('.canvas-node.jiaren-drawing-media-card[data-node-id=${JSON.stringify(setup.nodeId)}]');
    const body = card?.querySelector('.node-body');
    const image = card?.querySelector('.node-preview-image');
    const rect = (node) => node ? node.getBoundingClientRect() : null;
    const cardRect = rect(card), bodyRect = rect(body), imageRect = rect(image);
    return {
      card: cardRect && { width: cardRect.width, height: cardRect.height },
      body: bodyRect && { width: bodyRect.width, height: bodyRect.height },
      image: imageRect && { width: imageRect.width, height: imageRect.height },
    };
  })()`);
  assert.ok(Math.abs(portraitLayout.image.width / portraitLayout.image.height - 9 / 16) < 0.03, `Portrait image ratio is incorrect: ${JSON.stringify(portraitLayout)}`);
  assert.ok(portraitLayout.image.height <= 370, `Portrait preview exceeds the bounded frame: ${JSON.stringify(portraitLayout)}`);
  assert.ok(portraitLayout.card.height <= 440, `Portrait card is excessively tall: ${JSON.stringify(portraitLayout)}`);
  assert.ok(Math.abs(portraitLayout.body.height - portraitLayout.image.height) < 4, `Portrait body contains excessive vertical space: ${JSON.stringify(portraitLayout)}`);

  await evaluate(`document.querySelector('.canvas-node.jiaren-drawing-media-card[data-node-id=${JSON.stringify(setup.nodeId)}] .node-preview-image')?.click()`);
  await pause(250);
  const previewVisibility = await evaluate(`(() => {
    const preview = document.querySelector('.image-preview-backdrop');
    const header = preview?.querySelector('.image-preview-header');
    const tools = preview?.querySelector('.jiaren-preview-tools');
    const controls = Array.from(tools?.children || []).map((element) => {
      const rect = element.getBoundingClientRect();
      return { text: element.textContent.trim(), top: rect.top, bottom: rect.bottom, height: rect.height };
    });
    const headerRect = header?.getBoundingClientRect();
    return {
      preview: Boolean(preview),
      composerDisplay: getComputedStyle(document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar)')).display,
      header: headerRect && { width: headerRect.width, height: headerRect.height },
      controls,
    };
  })()`);
  assert.equal(previewVisibility.preview, true, 'Image preview did not open');
  assert.equal(previewVisibility.composerDisplay, 'none', 'Composer must hide behind the image preview');
  assert.ok(previewVisibility.header?.height <= 64, `Preview header is excessively tall: ${JSON.stringify(previewVisibility)}`);
  const controlCenters = previewVisibility.controls.map((control) => (control.top + control.bottom) / 2);
  assert.ok(Math.max(...controlCenters) - Math.min(...controlCenters) < 3, `Preview controls are not on one row: ${JSON.stringify(previewVisibility)}`);
  const annotationOpened = await evaluate(`(() => {
    const button = [...document.querySelectorAll('.jiaren-preview-tools button')]
      .find((item) => item.textContent.includes('标注修改'));
    button?.click();
    return Boolean(button);
  })()`);
  assert.equal(annotationOpened, true, 'Image annotation action is missing from the preview');
  await pause(180);
  const annotationSubmitted = await evaluate(`(() => {
    const overlay = document.querySelector('.jiaren-annotation-backdrop');
    const canvas = overlay?.querySelector('canvas');
    const prompt = overlay?.querySelector('textarea');
    const submit = [...(overlay?.querySelectorAll('footer button') || [])]
      .find((item) => item.textContent.includes('创建局部修改节点'));
    if (!overlay || !canvas || !prompt || !submit) return false;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(255, 0, 0, 0.85)';
    context.fillRect(8, 8, Math.max(8, canvas.width / 3), Math.max(8, canvas.height / 3));
    prompt.value = 'Replace the marked headline while preserving the rest of the image';
    prompt.dispatchEvent(new Event('input', { bubbles: true }));
    submit.click();
    return true;
  })()`);
  assert.equal(annotationSubmitted, true, 'Image annotation editor could not submit a marked region');
  await pause(1000);
  const annotationResult = await evaluate(`(() => {
    const snapshot = window.__JIAREN_CANVAS_AGENT__.getSnapshot();
    const editNode = snapshot.nodes.find((node) =>
      node.data?.kind === 'editImage'
      && node.data?.prompt === 'Replace the marked headline while preserving the rest of the image');
    const edge = editNode && snapshot.edges.find((item) => item.target === editNode.id);
    return {
      nodeId: editNode?.id,
      maskPrefix: editNode?.data?.maskImage?.dataUrl?.slice(0, 22),
      sourceNodeId: edge?.source,
      connected: Boolean(edge),
      overlayClosed: !document.querySelector('.jiaren-annotation-backdrop'),
      nodes: snapshot.nodes.map((node) => ({
        id: node.id,
        kind: node.data?.kind,
        prompt: node.data?.prompt,
        label: node.data?.label,
      })),
      edges: snapshot.edges.map((item) => ({
        id: item.id,
        source: item.source,
        target: item.target,
      })),
    };
  })()`);
  assert.ok(annotationResult.nodeId, `Annotation did not create an editImage node: ${JSON.stringify(annotationResult)}`);
  assert.match(
    annotationResult.maskPrefix,
    /^(?:data:image\/png;base64,|\[media omitted:\d+\])$/,
    'Annotation node does not contain a PNG mask or its privacy-safe snapshot summary',
  );
  assert.equal(annotationResult.connected, true, 'Annotation edit node is not connected to its source image');
  assert.equal(annotationResult.overlayClosed, true, 'Annotation editor did not close after creating the edit node');
  await evaluate(`document.querySelector('.image-preview-backdrop')?.click()`);
  await pause(180);

  const settingsOpened = await evaluate(`(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const button = buttons.find((node) => node.textContent.trim() === 'API')
      || buttons.find((node) => /API/i.test([node.textContent, node.title, node.getAttribute('aria-label')].filter(Boolean).join(' ')));
    button?.click();
    return Boolean(button);
  })()`);
  assert.equal(settingsOpened, true, 'API settings entry was not found');
  await pause(250);
  const settingsVisibility = await evaluate(`(() => ({
    settings: Boolean(document.querySelector('.modal-backdrop .settings-modal')),
    composerDisplay: getComputedStyle(document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar)')).display,
  }))()`);
  assert.equal(settingsVisibility.settings, true, 'Settings modal did not open');
  assert.equal(settingsVisibility.composerDisplay, 'none', 'Composer must hide behind settings');
  await evaluate(`document.querySelector('.settings-modal button[title="关闭"], .settings-modal button[aria-label="关闭"], .settings-modal .close-button')?.click()`);
  await pause(180);

  const assets = [
    { id: 'qa-1', type: 'image', dataUrl: svg('1', '#c7ff3d', 960, 540), width: 960, height: 540 },
    { id: 'qa-2', type: 'image', dataUrl: svg('2', '#73e7bf', 540, 720), width: 540, height: 720 },
    { id: 'qa-3', type: 'image', dataUrl: svg('3', '#f0cd68', 720, 540), width: 720, height: 540 },
    { id: 'qa-4', type: 'image', dataUrl: svg('4', '#8fb5ff', 540, 960), width: 540, height: 960 },
  ];
  await evaluate(`window.__JIAREN_CANVAS_AGENT__.applyOperations([{
    type: 'node.update',
    nodeId: ${JSON.stringify(setup.nodeId)},
    patch: ${JSON.stringify({ outputAssets: assets, count: 4, status: 'succeeded', message: 'QA four images' })},
  }])`);
  await pause(800);

  const multiLayout = await evaluate(`(() => {
    const card = document.querySelector('.canvas-node.jiaren-drawing-media-card[data-node-id=${JSON.stringify(setup.nodeId)}]');
    const body = card?.querySelector('.node-body');
    const grid = card?.querySelector('.node-image-grid');
    const tiles = Array.from(card?.querySelectorAll('.node-grid-tile') || []);
    const gridRect = grid?.getBoundingClientRect();
    const bodyRect = body?.getBoundingClientRect();
    return {
      count: tiles.length,
      grid: gridRect && { top: gridRect.top, bottom: gridRect.bottom, height: gridRect.height, scrollHeight: grid.scrollHeight, clientHeight: grid.clientHeight },
      body: bodyRect && { top: bodyRect.top, bottom: bodyRect.bottom, height: bodyRect.height },
      tiles: tiles.map((tile) => {
        const rect = tile.getBoundingClientRect();
        const image = tile.querySelector('img');
        return { top: rect.top, bottom: rect.bottom, height: rect.height, naturalWidth: image?.naturalWidth, naturalHeight: image?.naturalHeight };
      }),
      text: card?.textContent || '',
    };
  })()`);
  assert.equal(multiLayout.count, 4, `Expected four visible image tiles: ${JSON.stringify(multiLayout)}`);
  assert.equal(multiLayout.tiles.every((tile) => tile.naturalWidth > 0), true, 'One or more generated images did not load');
  assert.equal(multiLayout.tiles.every((tile) => tile.bottom <= multiLayout.grid.bottom + 1), true, `Image grid clips tiles: ${JSON.stringify(multiLayout)}`);
  assert.ok(multiLayout.grid.scrollHeight <= multiLayout.grid.clientHeight + 1, `Image grid has hidden overflow: ${JSON.stringify(multiLayout)}`);
  assert.ok(Math.abs(multiLayout.grid.bottom - multiLayout.body.bottom) < 3, `Image body leaves excessive space: ${JSON.stringify(multiLayout)}`);
  assert.equal(multiLayout.text.includes('@1'), false, 'Four-image node still exposes @1');

  const referenceSource = svg('R', '#e6f2de', 320, 240);
  const referenceSetup = await evaluate(`(async () => {
    const bridge = window.__JIAREN_CANVAS_AGENT__;
    const added = await bridge.applyOperations([{
      type: 'node.add',
      kind: 'imageInput',
      position: { x: 120, y: 240 },
      data: { imageSource: ${JSON.stringify(referenceSource)}, fileName: 'QA reference.svg', localPath: '' },
    }]);
    const referenceId = added.receipts[0].nodeId;
    await bridge.applyOperations([
      { type: 'edge.add', source: referenceId, target: ${JSON.stringify(setup.nodeId)}, edgeId: 'qa-reference-edge' },
      { type: 'node.select', nodeId: ${JSON.stringify(setup.nodeId)} },
    ]);
    return { referenceId };
  })()`);
  assert.ok(referenceSetup.referenceId, 'Reference node was not created');
  await pause(600);

  const referenceDrop = await evaluate(`(async () => {
    const composer = document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) .jiaren-rich-prompt-composer');
    const chip = composer?.querySelector('.jiaren-page1-rich-reference-chip');
    if (!composer || !chip) return { ok: false, reason: 'composer or reference chip missing' };
    const left = document.createTextNode('前半 ');
    const right = document.createTextNode(' 后半');
    composer.replaceChildren(left, right, chip);
    const range = document.createRange();
    range.setStart(left, left.textContent.length);
    range.collapse(true);
    const originalCaretRangeFromPoint = document.caretRangeFromPoint?.bind(document);
    document.caretRangeFromPoint = () => range;
    const transfer = new DataTransfer();
    transfer.setData('application/x-jiaren-reference', chip.dataset.referenceKey || '');
    composer.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer, clientX: 10, clientY: 10 }));
    if (originalCaretRangeFromPoint) document.caretRangeFromPoint = originalCaretRangeFromPoint;
    const typingRange = document.createRange();
    typingRange.setStart(right, right.textContent.length);
    typingRange.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(typingRange);
    const inserted = document.execCommand('insertText', false, '，继续输入');
    if (!inserted) right.textContent += '，继续输入';
    composer.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: '，继续输入' }));
    await new Promise((resolve) => setTimeout(resolve, 800));
    const children = Array.from(composer.childNodes).map((node) => node.nodeType === 3 ? node.textContent : node.dataset?.referenceKey ? '[REF]' : node.textContent);
    const snapshot = window.__JIAREN_CANVAS_AGENT__?.getSnapshot?.();
    const node = snapshot?.nodes.find((item) => Array.isArray(item.data?.richPromptContent) && item.data.richPromptContent.length > 0);
    const rect = chip.getBoundingClientRect();
    const style = getComputedStyle(chip);
    return {
      ok: true,
      children,
      text: composer.textContent,
      richPromptContent: node?.data?.richPromptContent || [],
      activeNodeId: node?.id || '',
      selectedNodeId: snapshot?.selectedNodeId || '',
      promptNodes: snapshot?.nodes.filter((item) => item.data?.richPromptContent || item.data?.prompt).map((item) => ({ id: item.id, prompt: item.data?.prompt, richPromptContent: item.data?.richPromptContent || [] })) || [],
      chipLayout: { display: style.display, verticalAlign: style.verticalAlign, width: rect.width, height: rect.height },
    };
  })()`);
  assert.equal(referenceDrop.ok, true, `Reference drop setup failed: ${JSON.stringify(referenceDrop)}`);
  const chipIndex = referenceDrop.children.indexOf('[REF]');
  const rightIndex = referenceDrop.children.findIndex((value) => String(value).includes('后半'));
  assert.ok(chipIndex > 0 && rightIndex > chipIndex, `Reference chip was not inserted at the requested text position: ${JSON.stringify(referenceDrop)}`);
  assert.match(referenceDrop.text, /后半，继续输入/, `Typing did not continue after the inline image: ${JSON.stringify(referenceDrop)}`);
  assert.deepEqual(referenceDrop.richPromptContent.map((part) => part.type), ['text', 'image', 'text'], JSON.stringify(referenceDrop));
  assert.match(referenceDrop.richPromptContent[2].text, /后半，继续输入/);
  assert.ok(referenceDrop.activeNodeId, `Inline editor node was not identified: ${JSON.stringify(referenceDrop)}`);
  assert.match(referenceDrop.chipLayout.display, /^inline/);
  assert.ok(referenceDrop.chipLayout.height <= 36, `Inline image is too tall: ${JSON.stringify(referenceDrop.chipLayout)}`);

  const richRestore = await evaluate(`(async () => {
    const clickNode = (nodeId) => {
      const element = document.querySelector(\`.react-flow__node[data-id="\${nodeId}"]\`);
      element?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      return Boolean(element);
    };
    const left = clickNode(${JSON.stringify(referenceSetup.referenceId)});
    await new Promise((resolve) => setTimeout(resolve, 120));
    const restored = clickNode(${JSON.stringify(referenceDrop.activeNodeId)});
    await new Promise((resolve) => setTimeout(resolve, 220));
    const composer = document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) .jiaren-rich-prompt-composer');
    const children = Array.from(composer?.childNodes || []).map((node) => node.nodeType === 3 ? node.textContent : node.dataset?.referenceKey ? '[REF]' : node.textContent);
    return { left, restored, children, text: composer?.textContent || '' };
  })()`);
  assert.equal(richRestore.left, true, `Reference node was not clickable: ${JSON.stringify(richRestore)}`);
  assert.equal(richRestore.restored, true, `Inline editor node was not clickable: ${JSON.stringify(richRestore)}`);
  const restoredChip = richRestore.children.indexOf('[REF]');
  const restoredRight = richRestore.children.findIndex((value) => String(value).includes('后半，继续输入'));
  assert.ok(restoredChip > 0 && restoredRight > restoredChip, `Inline sequence was not restored after reselection: ${JSON.stringify(richRestore)}`);

  const pickerInsertionSetup = await evaluate(`(() => {
    const composer = document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) .jiaren-rich-prompt-composer');
    const existingChip = composer?.querySelector('.jiaren-page1-rich-reference-chip');
    const uploadButton = Array.from(document.querySelectorAll('.jiaren-image-mode-tabs button'))
      .find((button) => button.textContent?.trim() === '上传');
    if (!composer || !existingChip || !uploadButton || !window.jiaren?.system) {
      return { ok: false, reason: 'composer, upload button, or system bridge missing' };
    }
    const left = document.createTextNode('选择前 ');
    const right = document.createTextNode(' 选择后');
    composer.replaceChildren(left, right, existingChip);
    const range = document.createRange();
    range.setStart(left, left.textContent.length);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    window.__JIAREN_QA_ORIGINAL_SELECT_FILES__ = window.jiaren.system.selectFiles;
    const fakeSelectFiles = async () => ({
      canceled: false,
      assets: [{
        id: 'qa-picker-reference',
        kind: 'image',
        name: 'QA picker reference.svg',
        dataUrl: ${JSON.stringify(referenceSource)},
        localPath: '',
        mimeType: 'image/svg+xml',
      }],
    });
    try { window.jiaren.system.selectFiles = fakeSelectFiles; } catch {}
    const mocked = window.jiaren.system.selectFiles === fakeSelectFiles;
    if (!mocked) return { ok: true, mocked: false };
    uploadButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    uploadButton.click();
    return { ok: true, mocked: true };
  })()`);
  assert.equal(pickerInsertionSetup.ok, true, `Picker insertion setup failed: ${JSON.stringify(pickerInsertionSetup)}`);
  await pause(700);
  const pickerInsertion = pickerInsertionSetup.mocked ? await evaluate(`(() => {
    const composer = document.querySelector('.lovart-prompt-console:not(.jiaren-runtime-secondary-prompt):not(.smart-flow-hidden-promptbar) .jiaren-rich-prompt-composer');
    if (window.__JIAREN_QA_ORIGINAL_SELECT_FILES__) {
      window.jiaren.system.selectFiles = window.__JIAREN_QA_ORIGINAL_SELECT_FILES__;
      delete window.__JIAREN_QA_ORIGINAL_SELECT_FILES__;
    }
    const children = Array.from(composer?.childNodes || []).map((node) => {
      if (node.nodeType === 3) return node.textContent;
      return node.dataset?.referenceKey === 'qa-picker-reference' ? '[PICKER_REF]' : '[REF]';
    });
    return { children, text: composer?.textContent || '' };
  })()`) : { skipped: true, reason: 'Electron contextBridge freezes the native file picker API' };
  if (!pickerInsertion.skipped) {
    const pickerIndex = pickerInsertion.children.indexOf('[PICKER_REF]');
    const pickerRightIndex = pickerInsertion.children.findIndex((value) => String(value).includes('选择后'));
    assert.ok(pickerIndex > 0 && pickerRightIndex > pickerIndex, `Picker reference was not inserted at the saved caret: ${JSON.stringify(pickerInsertion)}`);
  }

  const source = await fs.readFile(path.join(process.cwd(), 'dist/assets/MainCanvasFlow-BbsMxxcM.js'), 'utf8');
  assert.match(source, /JiarenExplicitNoText/);
  assert.match(source, /JiarenVisibleTextRequested/);
  assert.match(source, /no\\s\+\(\?:text\|title\|caption\|logo\|watermark\)/i);
  assert.match(source, /if \(wt\.current\) \{[\s\S]{0,500}jiarenAppendNodesAtCaret\(wt\.current/);
  assert.match(source, /multimodalContent: JiarenMultimodalContent/);

  const floatingCandidates = await evaluate(`Array.from(document.querySelectorAll('button, a')).map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      className: element.className,
      text: element.textContent.trim(),
      title: element.title || '',
      ariaLabel: element.getAttribute('aria-label') || '',
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      html: element.outerHTML.slice(0, 500),
    };
  }).filter((item) => item.rect.left > 1100 && item.rect.top < 190 && item.rect.width > 0 && item.rect.height > 0)`);
  assert.equal(floatingCandidates.some((item) => /jc-launcher/.test(String(item.className))), false, `Obsolete floating launcher is still visible: ${JSON.stringify(floatingCandidates)}`);
  const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));

  assert.deepEqual(runtimeErrors, [], `Runtime errors: ${runtimeErrors.join('; ')}`);
  console.log(JSON.stringify({
    setup,
    params,
    parameterStress,
    models,
    camera,
    progressLayout,
    singleLayout,
    portraitLayout,
    previewVisibility,
    annotationResult,
    settingsVisibility,
    multiLayout,
    referenceDrop,
    richRestore,
    pickerInsertion,
    floatingCandidates,
    runtimeErrors,
    screenshotPath,
  }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  child.kill();
  await pause(500);
  if (ownsProfile) await fs.rm(userDataDir, { recursive: true, force: true });
}
