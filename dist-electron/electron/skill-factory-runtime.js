"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawn } = require("node:child_process");

const TERMINAL_STATES = new Set(["completed", "failed", "cancelled"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".avi", ".mkv"]);
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const COMMON_TRIGGERS = new Set([
  "style", "video", "image", "photo", "movie", "person", "character",
  "scene", "camera", "motion", "quality", "beautiful", "cinematic",
]);

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}

function cleanJobForRenderer(job) {
  const { process: _process, ...safeJob } = job;
  return { ...safeJob, logs: (safeJob.logs || []).slice(-160) };
}

function validatePortableAbsolutePath(value, label, options = {}) {
  const text = String(value || "").trim();
  if (!text || !path.isAbsolute(text)) throw new Error(`${label}必须使用绝对路径。`);
  if (/\s/.test(text) || /[^\x00-\x7F]/.test(text)) {
    throw new Error(`${label}不能包含空格或中文/非 ASCII 字符：${text}`);
  }
  const normalized = path.resolve(text);
  if (options.file && (!fs.existsSync(normalized) || !fs.statSync(normalized).isFile())) {
    throw new Error(`${label}文件不存在：${normalized}`);
  }
  if (options.directory && (!fs.existsSync(normalized) || !fs.statSync(normalized).isDirectory())) {
    throw new Error(`${label}目录不存在：${normalized}`);
  }
  return normalized;
}

function validateTriggerWord(value) {
  const trigger = String(value || "").trim().toLowerCase();
  if (!/^[a-z][a-z0-9_]{5,31}$/.test(trigger)) {
    throw new Error("触发词需要 6-32 位小写英文、数字或下划线，并以字母开头。");
  }
  if (COMMON_TRIGGERS.has(trigger) || (!trigger.includes("_") && !/\d/.test(trigger))) {
    throw new Error("触发词不能是通用英文单词，必须带数字或下划线形成唯一标识。");
  }
  return trigger;
}

function detectGpu() {
  try {
    const stdout = execFileSync(
      "nvidia-smi",
      ["--query-gpu=name,memory.total", "--format=csv,noheader,nounits"],
      { encoding: "utf8", windowsHide: true, timeout: 8000 },
    ).trim();
    const first = stdout.split(/\r?\n/)[0] || "";
    const parts = first.split(",").map((part) => part.trim());
    const vramMiB = Number.parseInt(parts.at(-1), 10) || 0;
    return { gpuName: parts.slice(0, -1).join(", ") || "NVIDIA GPU", vramMiB, lowVram: vramMiB < 16384 };
  } catch {
    return { gpuName: "未检测到 NVIDIA CUDA 显卡", vramMiB: 0, lowVram: true };
  }
}

function parseProgress(line, totalSteps) {
  const explicit = line.match(/(?:^|\s)(\d{1,3}(?:\.\d+)?)%/);
  if (explicit) return Math.max(0, Math.min(100, Number(explicit[1])));
  const step = line.match(/(?:step\s*)?(\d+)\s*\/\s*(\d+)/i);
  if (step) return Math.max(0, Math.min(100, (Number(step[1]) / Math.max(1, Number(step[2]))) * 100));
  const namedStep = line.match(/(?:step|steps)\D{0,8}(\d+)/i);
  if (namedStep && totalSteps) return Math.max(0, Math.min(100, (Number(namedStep[1]) / totalSteps) * 100));
  return undefined;
}

function classifyError(message) {
  const text = String(message || "");
  if (/out of memory|cuda.*memory|cublas.*alloc/i.test(text)) return "OUT_OF_MEMORY";
  if (/damaged|corrupt|invalid data|could not find codec|unsupported video/i.test(text)) return "MATERIAL_DAMAGED";
  if (/run\.py|toolkit|engine|not found|no such file/i.test(text)) return "ENGINE_MISSING";
  if (/absolute path|trigger|3-5|unsupported file|ASCII/i.test(text)) return "INVALID_INPUT";
  return "PROCESS_CRASHED";
}

function createSkillFactoryRuntime(options) {
  const dataRoot = ensureDirectory(path.join(options.dataRoot, "skill-factory"));
  const jobsPath = path.join(dataRoot, "jobs.json");
  const settingsPath = path.join(dataRoot, "settings.json");
  const bundledScripts = options.scriptRoot;
  const jobs = new Map();
  const queue = [];
  let activeJobId = "";
  const gpu = detectGpu();

  function readJson(filePath, fallback) {
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function saveJobs() {
    const serializable = Array.from(jobs.values()).map(cleanJobForRenderer);
    fs.writeFileSync(jobsPath, JSON.stringify(serializable, null, 2), "utf8");
  }

  function readSettings() {
    const fallbackRoot = process.platform === "win32" ? "C:\\JiarenAI\\SkillFactory" : "/Users/Shared/JiarenAI/SkillFactory";
    const saved = readJson(settingsPath, {});
    return {
      toolkitRoot: String(saved.toolkitRoot || ""),
      pythonPath: String(saved.pythonPath || ""),
      workspaceRoot: String(saved.workspaceRoot || fallbackRoot),
    };
  }

  function saveSettings(patch) {
    const next = { ...readSettings(), ...patch };
    fs.writeFileSync(settingsPath, JSON.stringify(next, null, 2), "utf8");
    return next;
  }

  for (const saved of readJson(jobsPath, [])) {
    if (!saved || !saved.id) continue;
    const restored = { ...saved, logs: Array.isArray(saved.logs) ? saved.logs : [] };
    if (!TERMINAL_STATES.has(restored.state)) {
      restored.state = "failed";
      restored.message = "应用上次退出时训练仍在运行，请重新提交任务。";
      restored.errorCode = "PROCESS_CRASHED";
    }
    jobs.set(restored.id, restored);
  }

  function status() {
    const settings = readSettings();
    const runPath = settings.toolkitRoot ? path.join(settings.toolkitRoot, "run.py") : "";
    const engineReady = Boolean(
      settings.toolkitRoot && settings.pythonPath &&
      fs.existsSync(runPath) && fs.existsSync(settings.pythonPath),
    );
    return {
      ...settings,
      ...gpu,
      engineReady,
      activeJobId: activeJobId || undefined,
      queuedJobs: queue.length,
      platform: os.platform(),
      expectedEntrypoint: runPath,
    };
  }

  function configure(request) {
    const toolkitRoot = validatePortableAbsolutePath(request.toolkitRoot, "AI-Toolkit 目录", { directory: true });
    const pythonPath = validatePortableAbsolutePath(request.pythonPath, "Python 路径", { file: true });
    const workspaceRoot = validatePortableAbsolutePath(request.workspaceRoot, "训练工作目录");
    ensureDirectory(workspaceRoot);
    const runPath = path.join(toolkitRoot, "run.py");
    if (!fs.existsSync(runPath)) throw new Error(`AI-Toolkit 当前入口 run.py 不存在：${runPath}`);
    saveSettings({ toolkitRoot, pythonPath, workspaceRoot });
    return status();
  }

  function appendLog(job, line) {
    const clean = String(line || "").replace(/\x1b\[[0-9;]*m/g, "").trim();
    if (!clean) return;
    job.logs.push(clean);
    if (job.logs.length > 400) job.logs.splice(0, job.logs.length - 400);
  }

  function runProcess(job, command, args, processOptions = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: processOptions.cwd,
        env: { ...process.env, PYTHONUNBUFFERED: "1", ...processOptions.env },
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });
      job.process = child;
      let stderrTail = "";
      const consume = (chunk, isError) => {
        const text = chunk.toString("utf8");
        if (isError) stderrTail = `${stderrTail}${text}`.slice(-6000);
        for (const line of text.split(/\r?\n/)) {
          appendLog(job, line);
          if (processOptions.onLine) processOptions.onLine(line);
        }
        saveJobs();
      };
      child.stdout.on("data", (chunk) => consume(chunk, false));
      child.stderr.on("data", (chunk) => consume(chunk, true));
      child.on("error", reject);
      child.on("exit", (code, signal) => {
        job.process = undefined;
        if (job.state === "cancelled") return resolve({ code, signal });
        if (code === 0) return resolve({ code, signal });
        reject(new Error(stderrTail || `子进程异常退出，code=${code}, signal=${signal || "none"}`));
      });
    });
  }

  function copyRuntimeScript(name, runtimeDirectory) {
    const source = path.join(bundledScripts, name);
    if (!fs.existsSync(source)) throw new Error(`Skill Factory 脚本缺失：${source}`);
    const target = path.join(runtimeDirectory, name);
    fs.copyFileSync(source, target);
    return target;
  }

  function newestFile(root, predicate) {
    if (!fs.existsSync(root)) return undefined;
    const found = [];
    const visit = (directory) => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(fullPath);
        else if (entry.isFile() && predicate(fullPath)) found.push(fullPath);
      }
    };
    visit(root);
    return found.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
  }

  async function executeJob(job) {
    const settings = readSettings();
    const pythonPath = validatePortableAbsolutePath(settings.pythonPath, "Python 路径", { file: true });
    const toolkitRoot = validatePortableAbsolutePath(settings.toolkitRoot, "AI-Toolkit 目录", { directory: true });
    const runPath = validatePortableAbsolutePath(path.join(toolkitRoot, "run.py"), "AI-Toolkit run.py", { file: true });
    const workspaceRoot = validatePortableAbsolutePath(settings.workspaceRoot, "训练工作目录");
    const jobRoot = ensureDirectory(path.join(workspaceRoot, "jobs", job.id));
    const datasetRoot = ensureDirectory(path.join(jobRoot, "dataset"));
    const outputRoot = ensureDirectory(path.join(jobRoot, "output"));
    const runtimeRoot = ensureDirectory(path.join(jobRoot, "runtime"));
    const inputJson = path.join(runtimeRoot, "inputs.json");
    const configPath = path.join(runtimeRoot, "training.yaml");
    fs.writeFileSync(inputJson, JSON.stringify(job.files.map((item) => item.path), null, 2), "utf8");
    const prepareScript = copyRuntimeScript("prepare_dataset.py", runtimeRoot);
    const configScript = copyRuntimeScript("config_generator.py", runtimeRoot);
    const previewScript = copyRuntimeScript("preview_skill.py", runtimeRoot);
    job.outputDirectory = outputRoot;

    job.state = "preparing";
    job.progress = 1;
    job.message = "正在抽帧、清理黑屏和模糊素材";
    saveJobs();
    await runProcess(job, pythonPath, [
      prepareScript,
      "--inputs-json", inputJson,
      "--output", datasetRoot,
      "--type", job.trainingType,
      "--trigger", job.triggerWord,
      "--caption", job.caption,
    ], {
      cwd: runtimeRoot,
      env: options.ffmpegPath ? { JIAREN_FFMPEG: options.ffmpegPath } : {},
      onLine: (line) => {
        const match = line.match(/^JIAREN_PROGRESS\s+(\d+)/);
        if (match) job.progress = 1 + Math.round(Number(match[1]) * 0.13);
      },
    });

    await runProcess(job, pythonPath, [
      configScript,
      "--type", job.trainingType,
      "--dataset", datasetRoot,
      "--trigger", job.triggerWord,
      "--caption", job.caption,
      "--output", outputRoot,
      "--vram-mib", String(gpu.vramMiB || 0),
      "--job-name", job.jobName,
      "--write", configPath,
    ], { cwd: runtimeRoot });

    job.state = "training";
    job.progress = 15;
    job.message = gpu.lowVram ? "低显存模式训练中" : "训练中";
    saveJobs();
    const totalSteps = job.trainingType === "video" ? 1200 : 800;
    await runProcess(job, pythonPath, [runPath, configPath], {
      cwd: toolkitRoot,
      onLine: (line) => {
        const parsed = parseProgress(line, totalSteps);
        if (parsed !== undefined) job.progress = Math.max(job.progress, 15 + Math.round(parsed * 0.77));
      },
    });

    const weightPath = newestFile(outputRoot, (filePath) => /\.safetensors$/i.test(filePath));
    if (!weightPath) throw new Error("训练进程结束，但输出目录没有找到 .safetensors 权重。");
    job.weightPath = weightPath;
    job.state = "previewing";
    job.progress = 94;
    job.message = "正在整理训练样片并写入技能库";
    saveJobs();

    await runProcess(job, pythonPath, [
      previewScript,
      "--output", outputRoot,
      "--weight", weightPath,
      "--trigger", job.triggerWord,
      "--type", job.trainingType,
    ], { cwd: runtimeRoot });
    job.previewPath = newestFile(outputRoot, (filePath) => /\.(png|jpe?g|webp|gif|mp4|mov)$/i.test(filePath));

    if (typeof options.onComplete === "function") {
      const imported = await options.onComplete({
        name: job.displayName,
        triggerWord: job.triggerWord,
        trainingType: job.trainingType,
        caption: job.caption,
        weightPath,
        previewPath: job.previewPath,
        outputDirectory: outputRoot,
        modelFamily: job.trainingType === "video" ? "Wan2.1" : "FLUX.1",
      });
      if (imported?.localPath) job.weightPath = imported.localPath;
      if (imported?.id) job.resourceId = imported.id;
    }
    job.state = "completed";
    job.progress = 100;
    job.queuePosition = 0;
    job.message = "训练完成，LoRA 技能已加入本地素材库";
    job.completedAt = new Date().toISOString();
    saveJobs();
  }

  async function pump() {
    if (activeJobId || queue.length === 0) return;
    const jobId = queue.shift();
    const job = jobs.get(jobId);
    if (!job || job.state !== "queued") return pump();
    activeJobId = jobId;
    queue.forEach((queuedId, index) => {
      const queued = jobs.get(queuedId);
      if (queued) queued.queuePosition = index + 1;
    });
    try {
      await executeJob(job);
    } catch (error) {
      if (job.state !== "cancelled") {
        const message = error instanceof Error ? error.message : String(error);
        appendLog(job, message);
        job.state = "failed";
        job.message = message;
        job.errorCode = classifyError(message);
        job.completedAt = new Date().toISOString();
      }
      saveJobs();
    } finally {
      activeJobId = "";
      setImmediate(pump);
    }
  }

  function start(request) {
    const current = status();
    if (!current.engineReady) throw new Error("请先配置 AI-Toolkit 目录和独立 Python 环境。入口必须是当前版本 run.py。");
    const files = Array.isArray(request.files) ? request.files : [];
    if (files.length < 3 || files.length > 5) throw new Error("训练素材必须为 3-5 份。");
    const trainingType = request.trainingType === "image" ? "image" : "video";
    const normalizedFiles = files.map((item) => {
      const filePath = validatePortableAbsolutePath(item.path, "素材路径", { file: true });
      const extension = path.extname(filePath).toLowerCase();
      const supported = trainingType === "video" ? IMAGE_EXTENSIONS.has(extension) || VIDEO_EXTENSIONS.has(extension) : IMAGE_EXTENSIONS.has(extension);
      if (!supported) throw new Error(`素材格式不适用于 ${trainingType} 训练：${path.basename(filePath)}`);
      const stats = fs.statSync(filePath);
      if (stats.size > 2 * 1024 * 1024 * 1024) throw new Error(`单个素材不能超过 2GB：${path.basename(filePath)}`);
      return { ...item, path: filePath, sizeBytes: stats.size, name: path.basename(filePath) };
    });
    const triggerWord = validateTriggerWord(request.triggerWord);
    if (Array.from(jobs.values()).some((job) => job.triggerWord === triggerWord && job.state !== "failed" && job.state !== "cancelled")) {
      throw new Error(`触发词 ${triggerWord} 已被现有技能或任务使用，请换一个唯一标识。`);
    }
    const caption = String(request.caption || "").trim();
    if (caption.length < 6) throw new Error("画面/动态描述至少需要 6 个字符。");

    configure({
      toolkitRoot: request.toolkitRoot || current.toolkitRoot,
      pythonPath: request.pythonPath || current.pythonPath,
      workspaceRoot: request.workspaceRoot || current.workspaceRoot,
    });
    const id = `skill-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
    const job = {
      id,
      jobName: `jiaren_${triggerWord}_${Date.now()}`,
      displayName: String(request.displayName || `${triggerWord} ${trainingType === "video" ? "视频" : "图像"}技能`).slice(0, 80),
      state: "queued",
      progress: 0,
      queuePosition: queue.length + (activeJobId ? 1 : 0) + 1,
      message: activeJobId ? "已加入训练队列" : "等待启动训练",
      logs: [],
      files: normalizedFiles,
      triggerWord,
      caption,
      trainingType,
      createdAt: new Date().toISOString(),
      lowVram: gpu.lowVram,
      vramMiB: gpu.vramMiB,
    };
    jobs.set(id, job);
    queue.push(id);
    saveJobs();
    setImmediate(pump);
    return cleanJobForRenderer(job);
  }

  function getJob(id) {
    const job = jobs.get(String(id || ""));
    return job ? cleanJobForRenderer(job) : undefined;
  }

  function listJobs() {
    return Array.from(jobs.values())
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .map(cleanJobForRenderer);
  }

  function cancel(id) {
    const job = jobs.get(String(id || ""));
    if (!job || TERMINAL_STATES.has(job.state)) return job ? cleanJobForRenderer(job) : undefined;
    job.state = "cancelled";
    job.message = "训练已取消";
    job.completedAt = new Date().toISOString();
    const queuedIndex = queue.indexOf(job.id);
    if (queuedIndex >= 0) queue.splice(queuedIndex, 1);
    if (job.process && !job.process.killed) job.process.kill("SIGTERM");
    saveJobs();
    return cleanJobForRenderer(job);
  }

  return { status, configure, start, getJob, listJobs, cancel };
}

module.exports = { createSkillFactoryRuntime, validatePortableAbsolutePath, validateTriggerWord, detectGpu, parseProgress };

