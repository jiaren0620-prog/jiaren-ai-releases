import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const runtimeDir = process.env.JIAREN_QA_RUNTIME;
if (!runtimeDir) throw new Error('JIAREN_QA_RUNTIME is required');

const exePath = path.join(runtimeDir, 'Jiaren AI.exe');
const testId = `${Date.now()}-${process.pid}`;
const profileDir = path.join(runtimeDir, `qa-profile-project-v019-${testId}`);
const legacyRoot = path.join(runtimeDir, `qa-legacy-project-v019-${testId}`);
const legacyDir = path.join(legacyRoot, '.jiaren');
const legacyPreferences = path.join(legacyDir, 'preferences.json');
const customProjectDir = path.join(runtimeDir, `qa-custom-project-v019-${testId}`);
const port = Number(process.env.JIAREN_QA_PORT || 9365);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function findTarget() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
      if (target) return target;
    } catch {}
    await pause(250);
  }
  throw new Error('Jiaren AI CDP page target not found');
}

try {
  await fs.access(legacyDir);
  throw new Error(`Refusing to overwrite an existing legacy test directory: ${legacyDir}`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

await fs.mkdir(legacyDir, { recursive: true });
await fs.writeFile(legacyPreferences, JSON.stringify({
  runtimeSettings: {
    global: {
      baseUrl: 'https://legacy-qa.example/v1',
      apiKey: 'legacy-v019-test-key',
      fallbackBaseUrl: 'https://legacy-qa.example/v1',
      fallbackApiKey: 'legacy-v019-test-key',
      apiUserId: 'legacy-qa-user',
    },
    models: [],
  },
}, null, 2));
await fs.mkdir(profileDir, { recursive: true });
await fs.mkdir(customProjectDir, { recursive: true });

const child = spawn(exePath, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  '--no-first-run',
], {
  cwd: runtimeDir,
  env: { ...process.env, PORTABLE_EXECUTABLE_DIR: legacyRoot },
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
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result?.value;
  };

  await send('Runtime.enable');
  const readyDeadline = Date.now() + 20000;
  while (Date.now() < readyDeadline) {
    if (await evaluate(`Boolean(window.jiaren?.system?.listSavedProjects)`)) break;
    await pause(200);
  }

  const result = await evaluate(`(async () => {
    const system = window.jiaren.system;
    const rmbg = await window.jiaren.runtime.testConnection({ category: 'tools', modelId: 'background-removal', baseUrl: '', apiKey: '' });
    const upscayl = await window.jiaren.runtime.getUpscaylStatus();
    const preferences = await system.loadPreferences();
    const before = await system.listSavedProjects();
    const workflow = { nodes: [{ id: 'qa-node-1', type: 'text', position: { x: 10, y: 20 }, data: { text: 'QA' } }], edges: [] };
    const automatic = await system.saveProject({ version: 1, projectName: 'Automatic QA', explicitSave: false, workflow, canvas: { canvasAssets: [] } });
    const afterAutomatic = await system.listSavedProjects();
    const explicit = await system.saveProject({ version: 1, projectId: automatic.projectId, projectName: 'Explicit QA', projectDirectory: ${JSON.stringify(customProjectDir)}, explicitSave: true, workflow, canvas: { canvasAssets: [] } });
    const updatedWorkflow = { nodes: [...workflow.nodes, { id: 'qa-node-2', type: 'text', position: { x: 30, y: 40 }, data: { text: 'Updated' } }], edges: [] };
    const resaved = await system.saveProject({ version: 1, projectName: 'Explicit QA', explicitSave: true, workflow: updatedWorkflow, canvas: { canvasAssets: [] } });
    const afterExplicit = await system.listSavedProjects();
    const loaded = await system.loadSavedProject(explicit.projectId);
    const concurrentSaves = await Promise.all(Array.from({ length: 8 }, (_, index) => system.saveProject({
      version: 1,
      projectId: explicit.projectId,
      projectName: 'Explicit QA',
      projectDirectory: ${JSON.stringify(customProjectDir)},
      explicitSave: true,
      workflow: {
        nodes: [
          ...updatedWorkflow.nodes,
          { id: 'qa-concurrent-final', type: 'text', position: { x: 50, y: 60 }, data: { text: 'Concurrent ' + (index + 1) } },
        ],
        edges: [],
      },
      canvas: { canvasAssets: [] },
    })));
    const loadedConcurrent = await system.loadSavedProject(explicit.projectId);
    const reset = await system.startNewProject();
    const afterReset = await system.loadProject();
    const loadedAgain = await system.loadSavedProject(explicit.projectId);
    const removed = await system.deleteSavedProject(explicit.projectId);
    const afterDelete = await system.listSavedProjects();
    return { rmbg, upscayl, preferences, before, automatic, afterAutomatic, explicit, resaved, concurrentSaves, afterExplicit, loaded, loadedConcurrent, reset, afterReset, loadedAgain, removed, afterDelete };
  })()`);

  if (!result.rmbg?.ok) throw new Error(`Bundled background-removal models were not detected: ${result.rmbg?.message}`);
  if (!result.upscayl?.ok || !result.upscayl?.models?.length) throw new Error(`Bundled Upscayl engine was not detected: ${result.upscayl?.message}`);
  const global = result.preferences?.runtimeSettings?.global;
  if (global?.apiKey !== 'legacy-v019-test-key') throw new Error('Legacy API key was not migrated');
  if (global?.baseUrl !== 'https://legacy-qa.example/v1') throw new Error(`Legacy API base URL was not migrated: ${global?.baseUrl}`);
  if (result.before?.projects?.length !== 0) throw new Error('Fresh profile unexpectedly contains saved projects');
  if (!result.automatic?.projectId || result.automatic.explicitSaved !== false) throw new Error('Automatic save result is invalid');
  if (result.afterAutomatic?.projects?.length !== 0) throw new Error('Automatic save leaked into recent projects');
  if (result.explicit?.explicitSaved !== true || result.afterExplicit?.projects?.length !== 1) throw new Error('Explicit save did not enter recent projects');
  if (result.explicit?.projectDirectory !== customProjectDir) throw new Error(`Custom project directory was not bound: ${result.explicit?.projectDirectory}`);
  if (result.resaved?.projectId !== result.explicit.projectId || result.resaved?.projectDirectory !== customProjectDir) throw new Error('Second save did not reuse the bound project directory');
  if (result.afterExplicit.projects[0]?.projectDirectory !== customProjectDir) throw new Error('Recent project did not retain its custom directory');
  if (result.loaded?.project?.projectName !== 'Explicit QA' || result.loaded?.project?.workflow?.nodes?.length !== 2) throw new Error('Saved project could not be reopened with its latest content');
  if (result.concurrentSaves.some((save) => !save?.ok)) throw new Error('At least one concurrent save failed');
  const concurrentRevisions = result.concurrentSaves.map((save) => Number(save.revision));
  if (new Set(concurrentRevisions).size !== concurrentRevisions.length) throw new Error(`Concurrent save revisions are not unique: ${concurrentRevisions.join(', ')}`);
  if (!concurrentRevisions.every((revision, index) => index === 0 || revision === concurrentRevisions[index - 1] + 1)) throw new Error(`Concurrent revisions are not monotonic: ${concurrentRevisions.join(', ')}`);
  const finalConcurrentNode = result.loadedConcurrent?.project?.workflow?.nodes?.find((node) => node.id === 'qa-concurrent-final');
  if (finalConcurrentNode?.data?.text !== 'Concurrent 8') throw new Error(`Final concurrent save did not survive reload: ${finalConcurrentNode?.data?.text}`);
  if (Number(result.loadedConcurrent?.project?.revision) !== concurrentRevisions.at(-1)) throw new Error('Reloaded revision does not match the final concurrent save');
  if (!result.reset?.ok || result.afterReset !== undefined) throw new Error('Starting a new project did not clear the active working project');
  if (result.loadedAgain?.project?.projectDirectory !== customProjectDir) throw new Error('Custom project could not be reopened after resetting the workspace');
  if (result.afterDelete?.projects?.length !== 0) throw new Error('Saved project could not be removed');

  const manifestPath = path.join(customProjectDir, 'jiaren-project.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  if (manifest.projectName !== 'Explicit QA' || manifest.projectId !== result.explicit.projectId) throw new Error('Custom project manifest is invalid');
  if (manifest.workflow?.nodes?.find((node) => node.id === 'qa-concurrent-final')?.data?.text !== 'Concurrent 8') throw new Error('Custom project manifest lost the final concurrent save');
  const temporaryFiles = (await fs.readdir(customProjectDir)).filter((name) => /\.tmp(?:\.bak)?$/i.test(name));
  if (temporaryFiles.length) throw new Error(`Temporary project files were not cleaned: ${temporaryFiles.join(', ')}`);

  console.log(JSON.stringify({
    migratedApiBaseUrl: global.baseUrl,
    migratedApiKey: 'present',
    backgroundRemovalReady: result.rmbg.ok,
    upscaylModels: result.upscayl.models,
    automaticHistoryCount: result.afterAutomatic.projects.length,
    explicitHistoryCount: result.afterExplicit.projects.length,
    loadedProjectName: result.loaded.project.projectName,
    customProjectDirectory: result.explicit.projectDirectory,
    customProjectFile: result.explicit.projectFilePath,
    secondSaveReusedDirectory: result.resaved.projectDirectory === result.explicit.projectDirectory,
    concurrentSaveRevisions: concurrentRevisions,
    concurrentFinalText: finalConcurrentNode.data.text,
    externalProjectRetainedAfterHistoryDelete: true,
    historyCountAfterDelete: result.afterDelete.projects.length,
  }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { child.kill(); } catch {}
  await pause(500);
  await fs.rm(profileDir, { recursive: true, force: true });
  await fs.rm(legacyRoot, { recursive: true, force: true });
  await fs.rm(customProjectDir, { recursive: true, force: true });
}
