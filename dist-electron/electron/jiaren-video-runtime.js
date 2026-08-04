"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { downloadFile } = require("./jiaren-safe-download.js");

const AGNES_MODEL = "agnes-video-v2.0";
const AGNES_FRAMES = [81, 121, 161, 201, 241, 281, 321, 361, 401, 441];
const SUCCESS_STATES = new Set(["SUCCESS", "SUCCEEDED", "COMPLETED", "COMPLETE", "DONE", "FINISHED", "READY", "OK"]);
const FAILURE_STATES = new Set(["FAIL", "FAILED", "FAILURE", "ERROR", "ERRORED", "CANCELLED", "CANCELED", "TIMEOUT", "TIMED_OUT", "EXPIRED", "REJECTED"]);

function stringValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function numberInRange(value, fallback, min, max) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function normalizeBaseUrl(baseUrl) {
  const raw = stringValue(baseUrl).replace(/\/+$/, "");
  if (!raw) return "";
  try {
    const url = new URL(raw);
    url.search = "";
    url.hash = "";
    url.pathname = url.pathname
      .replace(/\/+$/, "")
      .replace(/\/(?:v1\/)?models(?:\/[^/]*)?$/i, (match) => match.toLowerCase().startsWith("/v1/") ? "/v1" : "");
    return url.toString().replace(/\/+$/, "");
  } catch {
    return raw.replace(/\/(?:v1\/)?models(?:\/[^/?#]*)?$/i, "");
  }
}

function providerRoot(baseUrl) {
  return normalizeBaseUrl(baseUrl).replace(/\/v1$/i, "").replace(/\/+$/, "");
}

function v1Endpoint(baseUrl, endpoint) {
  const base = normalizeBaseUrl(baseUrl);
  return `${base.endsWith("/v1") ? base : `${base}/v1`}${endpoint}`;
}

function modelId(request) {
  return stringValue(request?.endpointModelId) || stringValue(request?.video_model) || stringValue(request?.modelId);
}

function isVeo31LiteRequest(request, attempt) {
  const key = [attempt?.endpointModelId, request?.endpointModelId, request?.video_model, request?.modelId]
    .map(stringValue)
    .filter(Boolean)
    .join(" ");
  return /veo.*3[.\-_ ]?1.*lite/i.test(key);
}

function taskIdValue(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}

function isAgnesRequest(request, attempt) {
  if (modelId(request).toLowerCase().startsWith("agnes-video") ||
      stringValue(request?.providerParams?.protocol).toLowerCase() === "agnes") {
    return true;
  }
  try {
    return /(?:^|\.)agnes-ai\.com$/i.test(new URL(normalizeBaseUrl(attempt?.baseUrl)).hostname);
  } catch {
    return false;
  }
}

function apiAttempts(request) {
  const primary = {
    baseUrl: stringValue(request?.baseUrl),
    apiKey: stringValue(request?.apiKey),
    endpointModelId: stringValue(request?.endpointModelId),
    taskProvider: "primary",
  };
  const attempts = primary.baseUrl && primary.apiKey ? [primary] : [];
  const fallbackBaseUrl = stringValue(request?.fallbackBaseUrl);
  const fallbackApiKey = stringValue(request?.fallbackApiKey) || primary.apiKey;
  if (fallbackBaseUrl && fallbackApiKey && (fallbackBaseUrl !== primary.baseUrl || fallbackApiKey !== primary.apiKey)) {
    attempts.push({
      baseUrl: fallbackBaseUrl,
      apiKey: fallbackApiKey,
      endpointModelId: stringValue(request?.fallbackEndpointModelId) || primary.endpointModelId,
      taskProvider: "fallback",
    });
  }
  return attempts;
}

function selectedAttempt(request) {
  const attempts = apiAttempts(request);
  return attempts.find((attempt) => attempt.taskProvider === request?.taskProvider) || attempts[0];
}

function parsePayload(text) {
  if (!stringValue(text)) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function payloadMessage(payload, fallback = "") {
  const candidates = [
    payload?.error?.message,
    payload?.error,
    payload?.detail,
    payload?.message,
    payload?.data?.error?.message,
    payload?.data?.error,
    payload?.data?.message,
    fallback,
  ];
  const value = candidates.find((item) => typeof item === "string" && item.trim());
  return stringValue(value).slice(0, 600);
}

function retryDelay(response, retryIndex) {
  const retryAfter = Number(response.headers.get("retry-after"));
  if (Number.isFinite(retryAfter) && retryAfter > 0) return Math.min(15000, retryAfter * 1000);
  return Math.min(8000, 1200 * 2 ** retryIndex);
}

async function fetchPayload(url, init, signal, retryLimit = 3) {
  let response;
  for (let retryIndex = 0; retryIndex <= retryLimit; retryIndex += 1) {
    response = await fetch(url, { ...init, signal });
    if (response.status !== 429 || retryIndex === retryLimit) break;
    await sleep(retryDelay(response, retryIndex));
  }
  const contentType = stringValue(response.headers.get("content-type")).toLowerCase();
  if (response.ok && (/^video\//.test(contentType) || /application\/octet-stream/.test(contentType))) {
    return { response, payload: {}, text: "", bytes: Buffer.from(await response.arrayBuffer()), contentType };
  }
  const text = await response.text();
  return { response, payload: parsePayload(text), text, contentType };
}

function taskIdFrom(payload) {
  const direct = [payload?.task_id, payload?.taskId, payload?.id, payload?.request_id, payload?.job_id];
  const nested = [payload?.data?.task_id, payload?.data?.taskId, payload?.data?.id, payload?.result?.task_id, payload?.result?.id];
  return taskIdValue([...direct, ...nested].find((value) => typeof value === "string" || typeof value === "number"));
}

function taskStatusFrom(payload) {
  const values = [
    payload?.status,
    payload?.task_status,
    payload?.taskStatus,
    payload?.state,
    payload?.phase,
    payload?.data?.status,
    payload?.data?.task_status,
    payload?.result?.status,
  ];
  const found = values.find((value) => typeof value === "string" || typeof value === "number");
  return found === undefined ? "" : String(found).trim();
}

function isSucceeded(status) {
  const normalized = stringValue(status).toUpperCase();
  return normalized === "3" || SUCCESS_STATES.has(normalized);
}

function isFailed(status) {
  const normalized = stringValue(status).toUpperCase();
  return normalized === "2" || FAILURE_STATES.has(normalized);
}

function collectVideoUrls(payload) {
  const urls = new Set();
  const visit = (value, keyHint = "") => {
    if (typeof value === "string") {
      const candidate = value.trim();
      if (!/^https?:\/\//i.test(candidate)) return;
      const key = keyHint.toLowerCase();
      if (/poll|status|callback|webhook|endpoint/.test(key)) return;
      if (/\.(png|jpe?g|webp|gif|bmp|svg)(?:[?#]|$)/i.test(candidate)) return;
      if (/video|output|result|asset|file|download|url|remixed_from_video_id/.test(key) || /\.(mp4|mov|webm|m4v)(?:[?#]|$)/i.test(candidate)) {
        urls.add(candidate);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, keyHint));
      return;
    }
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, item]) => visit(item, key));
    }
  };
  visit(payload);
  return [...urls];
}

function ensureCacheDirectory(directory) {
  const fallbackRoot = process.env.LOCALAPPDATA || process.cwd();
  const target = stringValue(directory) || path.join(fallbackRoot, "JiarenAI", "cache");
  fs.mkdirSync(target, { recursive: true });
  return target;
}

function uniqueFilePath(directory, fileName) {
  const extension = path.extname(fileName);
  const stem = path.basename(fileName, extension).replace(/[^a-zA-Z0-9_-]+/g, "_") || "jiaren_video";
  let target = path.join(directory, `${stem}${extension}`);
  let index = 1;
  while (fs.existsSync(target)) {
    target = path.join(directory, `${stem}_${index}${extension}`);
    index += 1;
  }
  return target;
}

function videoExtension(url, contentType) {
  const mime = stringValue(contentType).toLowerCase();
  if (mime.includes("quicktime")) return ".mov";
  if (mime.includes("webm")) return ".webm";
  try {
    const extension = path.extname(new URL(url).pathname).toLowerCase();
    if ([".mp4", ".mov", ".webm", ".m4v"].includes(extension)) return extension;
  } catch {
  }
  return ".mp4";
}

async function assetFromBytes(bytes, contentType, request, url) {
  const directory = ensureCacheDirectory(request?.cacheDir || request?.downloadsDir);
  const localPath = uniqueFilePath(directory, `jiaren_video_${Date.now()}${videoExtension(url || "", contentType)}`);
  fs.writeFileSync(localPath, bytes);
  return {
    id: crypto.randomUUID(),
    type: "video",
    url: stringValue(url) || undefined,
    localPath,
    durationMs: Math.round(numberInRange(request?.duration, 5, 1, 3600) * 1000),
  };
}

async function videoUrlToAsset(url, request, signal) {
  try {
    const directory = ensureCacheDirectory(request?.cacheDir || request?.downloadsDir);
    let localPath = uniqueFilePath(directory, `jiaren_video_${Date.now()}${videoExtension(url, "")}`);
    const downloaded = await downloadFile(url, localPath, { accept: "video/*,*/*", maxBytes: 2 * 1024 * 1024 * 1024, signal });
    if (!downloaded.byteSize) throw new Error("empty response");
    const expectedExtension = videoExtension(url, downloaded.contentType);
    if (path.extname(localPath).toLowerCase() !== expectedExtension) {
      const renamedPath = uniqueFilePath(directory, `jiaren_video_${Date.now()}${expectedExtension}`);
      fs.renameSync(localPath, renamedPath);
      localPath = renamedPath;
    }
    return {
      id: crypto.randomUUID(),
      type: "video",
      url: stringValue(url) || undefined,
      localPath,
      durationMs: Math.round(numberInRange(request?.duration, 5, 1, 3600) * 1000),
    };
  } catch (error) {
    if (signal?.aborted) throw error;
    return {
      id: crypto.randomUUID(),
      type: "video",
      url,
      durationMs: Math.round(numberInRange(request?.duration, 5, 1, 3600) * 1000),
    };
  }
}

async function assetsFromPayload(payload, request, signal) {
  const assets = [];
  for (const url of collectVideoUrls(payload)) {
    assets.push(await videoUrlToAsset(url, request, signal));
  }
  return assets;
}

function referenceValues(request) {
  const values = [];
  const seen = new Set();
  const push = (value) => {
    const source = typeof value === "string"
      ? value
      : value?.url || value?.localPath || value?.dataUrl || value?.source;
    const normalized = stringValue(source);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    values.push(normalized);
  };
  (Array.isArray(request?.referenceImages) ? request.referenceImages : []).forEach(push);
  (Array.isArray(request?.referenceImagePaths) ? request.referenceImagePaths : []).forEach(push);
  push(request?.refImage);
  return values;
}

function mimeForFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  return "image/png";
}

function referenceFile(value) {
  const dataMatch = value.match(/^data:([^;,]+)(?:;[^,]*)?;base64,(.+)$/s);
  if (dataMatch) {
    return { bytes: Buffer.from(dataMatch[2], "base64"), mime: dataMatch[1], name: "reference.png" };
  }
  if (fs.existsSync(value)) {
    return { bytes: fs.readFileSync(value), mime: mimeForFile(value), name: path.basename(value) };
  }
  return undefined;
}

function firstHttpUrl(payload) {
  let found = "";
  const visit = (value, keyHint = "") => {
    if (found) return;
    if (typeof value === "string" && /^https?:\/\//i.test(value) && !/status|poll|callback|webhook/i.test(keyHint)) {
      found = value.trim();
      return;
    }
    if (Array.isArray(value)) value.forEach((item) => visit(item, keyHint));
    else if (value && typeof value === "object") Object.entries(value).forEach(([key, item]) => visit(item, key));
  };
  visit(payload);
  return found;
}

async function uploadReference(value, attempt, signal) {
  if (/^https?:\/\//i.test(value)) return value;
  const file = referenceFile(value);
  if (!file) throw new Error("参考图无法读取，请重新上传后再试。");
  const endpoints = [v1Endpoint(attempt.baseUrl, "/files"), v1Endpoint(attempt.baseUrl, "/files/upload")];
  const failures = [];
  for (const endpoint of endpoints) {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(file.bytes)], { type: file.mime }), file.name);
    try {
      const result = await fetchPayload(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${attempt.apiKey}`, Accept: "application/json" },
        body: form,
      }, signal, 1);
      const url = result.response.ok ? firstHttpUrl(result.payload) : "";
      if (url) return url;
      failures.push(`HTTP ${result.response.status} ${payloadMessage(result.payload, result.text)}`.trim());
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(`当前视频接口不能上传本地参考图：${failures.filter(Boolean).slice(0, 2).join("；")}`);
}

function nearestAgnesFrames(value) {
  return AGNES_FRAMES.reduce((best, candidate) => Math.abs(candidate - value) < Math.abs(best - value) ? candidate : best, AGNES_FRAMES[0]);
}

function dimensionsForRatio(ratio) {
  const sizes = {
    "16:9": [1152, 648],
    "9:16": [648, 1152],
    "1:1": [1024, 1024],
    "4:3": [1024, 768],
    "3:4": [768, 1024],
    "3:2": [1152, 768],
    "2:3": [768, 1152],
    "21:9": [1344, 576],
  };
  return sizes[stringValue(ratio)] || sizes["16:9"];
}

async function buildAgnesPayload(request, attempt, signal) {
  const prompt = stringValue(request?.prompt) || stringValue(request?.script) || stringValue(request?.shotTitle);
  if (!prompt) throw new Error("请先填写视频提示词。");
  const providerParams = request?.providerParams && typeof request.providerParams === "object" ? request.providerParams : {};
  const frameRate = Math.round(numberInRange(providerParams.frameRate ?? providerParams.frame_rate ?? request?.fps, 24, 1, 60));
  const desiredFrames = Number(providerParams.numFrames ?? providerParams.num_frames) || numberInRange(request?.duration, 5, 1, 18) * frameRate;
  const [width, height] = dimensionsForRatio(request?.aspectRatio || request?.ratio);
  const references = [];
  for (const reference of referenceValues(request).slice(0, 8)) {
    references.push(await uploadReference(reference, attempt, signal));
  }
  const payload = {
    model: AGNES_MODEL,
    prompt,
    width,
    height,
    num_frames: nearestAgnesFrames(desiredFrames),
    frame_rate: frameRate,
  };
  if (Number.isFinite(Number(request?.seed))) payload.seed = Number(request.seed);
  const negativePrompt = stringValue(providerParams.negativePrompt ?? providerParams.negative_prompt);
  if (negativePrompt) payload.negative_prompt = negativePrompt;
  if (Number.isFinite(Number(providerParams.numInferenceSteps ?? providerParams.num_inference_steps))) {
    payload.num_inference_steps = Math.round(numberInRange(providerParams.numInferenceSteps ?? providerParams.num_inference_steps, 30, 1, 100));
  }
  if (references.length === 1) {
    payload.image = references[0];
    payload.mode = "ti2vid";
  } else if (references.length > 1) {
    payload.image = references;
    payload.mode = "keyframes";
    payload.extra_body = { image: references, mode: "keyframes" };
  }
  return payload;
}

async function buildGenericPayload(request, attempt, signal) {
  const prompt = stringValue(request?.prompt) || stringValue(request?.script) || stringValue(request?.shotTitle);
  if (!prompt) throw new Error("请先填写视频提示词。");
  const veo31Lite = isVeo31LiteRequest(request, attempt);
  const duration = veo31Lite ? 8 : Math.round(numberInRange(request?.duration, 5, 1, 30));
  const requestedRatio = stringValue(request?.aspectRatio || request?.ratio);
  const ratio = veo31Lite
    ? (["16:9", "9:16"].includes(requestedRatio) ? requestedRatio : "16:9")
    : requestedRatio || "16:9";
  const requestedResolution = stringValue(request?.resolution).toLowerCase();
  const resolution = veo31Lite
    ? requestedResolution === "4k" ? "4K" : ["720p", "1080p"].includes(requestedResolution) ? requestedResolution : "1080p"
    : stringValue(request?.resolution) || "720p";
  const references = [];
  for (const reference of (veo31Lite ? [] : referenceValues(request).slice(0, 8))) {
    references.push(await uploadReference(reference, attempt, signal));
  }
  const payload = {
    model: modelId(request),
    prompt,
    mode: references.length ? "image-to-video" : "text-to-video",
    aspect_ratio: ratio,
    ratio,
    duration,
    seconds: duration,
    resolution,
    fps: Math.round(numberInRange(request?.fps, 24, 1, 60)),
  };
  if (Number.isFinite(Number(request?.seed))) payload.seed = Number(request.seed);
  if (references.length) {
    payload.image = references.length === 1 ? references[0] : references;
    payload.images = references;
    payload.image_urls = references;
    payload.input_image = references[0];
  }
  if (typeof request?.generateAudio === "boolean") payload.generate_audio = request.generateAudio;
  if (typeof request?.watermark === "boolean") payload.watermark = request.watermark;
  if (typeof request?.returnLastFrame === "boolean") payload.return_last_frame = request.returnLastFrame;
  return payload;
}

function submissionEndpoints(request, attempt) {
  if (isAgnesRequest(request, attempt)) return [v1Endpoint(attempt.baseUrl, "/videos")];
  const base = normalizeBaseUrl(attempt.baseUrl);
  const endpoints = [];
  if (/\/api\/v3$/i.test(base) || /ark\./i.test(base)) endpoints.push(`${base}/contents/generations/tasks`);
  endpoints.push(
    v1Endpoint(attempt.baseUrl, "/video/generations"),
    v1Endpoint(attempt.baseUrl, "/videos/generations"),
    `${providerRoot(attempt.baseUrl)}/v2/videos/generations`,
    v1Endpoint(attempt.baseUrl, "/videos"),
  );
  return [...new Set(endpoints)];
}

function pollUrlFrom(payload, baseUrl) {
  const values = [payload?.poll_url, payload?.pollUrl, payload?.status_url, payload?.statusUrl, payload?.response_url, payload?.data?.poll_url, payload?.data?.status_url];
  const value = stringValue(values.find((item) => typeof item === "string" && item.trim()));
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  try {
    return new URL(value, `${providerRoot(baseUrl)}/`).toString();
  } catch {
    return "";
  }
}

async function submitAttempt(request, attempt, signal) {
  const agnes = isAgnesRequest(request, attempt);
  const payload = agnes ? await buildAgnesPayload(request, attempt, signal) : await buildGenericPayload(request, attempt, signal);
  const failures = [];
  for (const endpoint of submissionEndpoints(request, attempt)) {
    try {
      const result = await fetchPayload(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${attempt.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }, signal);
      if (result.response.ok) {
        return {
          payload: result.payload,
          attempt,
          taskProtocol: agnes ? "agnes" : "openai-compatible",
          taskEndpoint: endpoint,
          pollUrl: pollUrlFrom(result.payload, attempt.baseUrl),
        };
      }
      failures.push(`${new URL(endpoint).pathname} HTTP ${result.response.status} ${payloadMessage(result.payload, result.text)}`.trim());
      if (agnes && ![404, 405, 429, 500, 503].includes(result.response.status)) break;
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(failures.filter(Boolean).join("；") || "视频接口没有返回有效结果。");
}

async function submitInternal(request, signal) {
  const attempts = apiAttempts(request);
  if (!attempts.length) throw new Error("视频 API 配置不完整，请填写当前模型的 Base URL 和 API Key。");
  const failures = [];
  for (const attempt of attempts) {
    try {
      return await submitAttempt(request, attempt, signal);
    } catch (error) {
      failures.push(`${attempt.taskProvider === "fallback" ? "备用接口" : "主接口"}：${error instanceof Error ? error.message : String(error)}`);
    }
  }
  throw new Error(failures.join("；"));
}

function pollCandidates(request, attempt, taskId, explicitPollUrl) {
  const candidates = new Set();
  if (stringValue(explicitPollUrl)) candidates.add(stringValue(explicitPollUrl));
  if (!taskId) return [...candidates];
  const root = providerRoot(attempt.baseUrl);
  if (isAgnesRequest(request, attempt) || request?.taskProtocol === "agnes") {
    candidates.add(`${root}/agnesapi?video_id=${encodeURIComponent(taskId)}`);
    candidates.add(v1Endpoint(attempt.baseUrl, `/videos/${encodeURIComponent(taskId)}`));
  } else {
    candidates.add(v1Endpoint(attempt.baseUrl, `/tasks/${encodeURIComponent(taskId)}`));
    candidates.add(v1Endpoint(attempt.baseUrl, `/video/generations/${encodeURIComponent(taskId)}`));
    candidates.add(v1Endpoint(attempt.baseUrl, `/videos/generations/${encodeURIComponent(taskId)}`));
    candidates.add(v1Endpoint(attempt.baseUrl, `/videos/${encodeURIComponent(taskId)}`));
    candidates.add(`${root}/v2/videos/generations/${encodeURIComponent(taskId)}`);
    if (/\/api\/v3$/i.test(normalizeBaseUrl(attempt.baseUrl)) || /ark\./i.test(attempt.baseUrl)) {
      candidates.add(`${normalizeBaseUrl(attempt.baseUrl)}/contents/generations/tasks/${encodeURIComponent(taskId)}`);
    }
  }
  return [...candidates];
}

async function pollOnce(request, attempt, signal) {
  const taskId = taskIdValue(request?.taskId);
  const candidates = pollCandidates(request, attempt, taskId, request?.pollUrl);
  if (!candidates.length) throw new Error("缺少可查询的视频任务 ID。");
  const failures = [];
  for (const pollUrl of candidates) {
    try {
      const result = await fetchPayload(pollUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${attempt.apiKey}`, Accept: "application/json,video/*,*/*" },
      }, signal);
      if (result.response.ok) {
        const assets = result.bytes
          ? [await assetFromBytes(result.bytes, result.contentType, request, pollUrl)]
          : await assetsFromPayload(result.payload, request, signal);
        return {
          payload: result.payload,
          assets,
          pollUrl,
          taskStatus: taskStatusFrom(result.payload),
          taskMessage: payloadMessage(result.payload),
        };
      }
      if (result.response.status === 404 || result.response.status === 405) continue;
      failures.push(`HTTP ${result.response.status} ${payloadMessage(result.payload, result.text)}`.trim());
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(failures.filter(Boolean).join("；") || "暂时无法查询视频任务。");
}

function baseResult(request, startedAt) {
  return {
    id: crypto.randomUUID(),
    modelId: stringValue(request?.modelId) || modelId(request),
    elapsedMs: Math.round(performance.now() - startedAt),
    assets: [],
  };
}

async function submitVideoTask(request) {
  const startedAt = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const submitted = await submitInternal(request, controller.signal);
    const assets = await assetsFromPayload(submitted.payload, request, controller.signal);
    const taskId = taskIdFrom(submitted.payload);
    const taskStatus = taskStatusFrom(submitted.payload);
    const failed = isFailed(taskStatus);
    return {
      ...baseResult(request, startedAt),
      status: assets.length ? "succeeded" : failed ? "failed" : taskId || submitted.pollUrl ? "queued" : "failed",
      assets,
      message: assets.length ? "视频生成完成，结果已写入本地缓存。" : failed ? payloadMessage(submitted.payload) || "视频生成失败。" : taskId ? "视频任务已提交，正在生成。" : "视频接口没有返回可追踪的任务 ID。",
      taskId,
      taskStatus,
      taskProvider: submitted.attempt.taskProvider,
      pollUrl: submitted.pollUrl,
      taskProtocol: submitted.taskProtocol,
      taskEndpoint: submitted.taskEndpoint,
    };
  } catch (error) {
    return { ...baseResult(request, startedAt), status: "failed", message: error instanceof Error ? error.message : "视频任务提交失败。" };
  } finally {
    clearTimeout(timeout);
  }
}

async function queryVideoTask(request) {
  const startedAt = performance.now();
  const attempt = selectedAttempt(request);
  if (!attempt) return { ...baseResult(request, startedAt), status: "failed", message: "视频 API 配置不完整。", taskId: taskIdValue(request?.taskId) };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const polled = await pollOnce(request, attempt, controller.signal);
    const failed = isFailed(polled.taskStatus);
    return {
      ...baseResult(request, startedAt),
      status: polled.assets.length ? "succeeded" : failed ? "failed" : "queued",
      assets: polled.assets,
      message: polled.assets.length ? "视频生成完成，结果已写入本地缓存。" : failed ? polled.taskMessage || "视频生成失败。" : polled.taskMessage || "视频任务仍在处理中。",
      taskId: taskIdValue(request?.taskId),
      taskStatus: polled.taskStatus,
      taskProvider: attempt.taskProvider,
      pollUrl: polled.pollUrl,
      taskProtocol: request?.taskProtocol,
      taskEndpoint: request?.taskEndpoint,
    };
  } catch (error) {
    return {
      ...baseResult(request, startedAt),
      status: "queued",
      message: error instanceof Error ? error.message : "视频任务查询暂时失败，任务 ID 已保留。",
      taskId: taskIdValue(request?.taskId),
      taskProvider: attempt.taskProvider,
      pollUrl: stringValue(request?.pollUrl) || undefined,
      taskProtocol: request?.taskProtocol,
      taskEndpoint: request?.taskEndpoint,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function generateVideo(request) {
  const startedAt = performance.now();
  const submitted = await submitVideoTask(request);
  if (submitted.status !== "queued" || !submitted.taskId && !submitted.pollUrl) return submitted;
  const pollIntervalMs = Math.round(numberInRange(request?.pollIntervalSeconds, 5, 1, 60) * 1000);
  const maxPollAttempts = Math.round(numberInRange(request?.maxPollAttempts, 180, 1, 720));
  const timeoutMs = Math.min(3600000, Math.max(120000, maxPollAttempts * pollIntervalMs + 60000));
  const deadline = Date.now() + timeoutMs;
  let current = submitted;
  for (let index = 0; index < maxPollAttempts && Date.now() < deadline; index += 1) {
    await sleep(index < 3 ? Math.min(1500, pollIntervalMs) : pollIntervalMs);
    current = await queryVideoTask({
      ...request,
      taskId: submitted.taskId,
      taskProvider: submitted.taskProvider,
      pollUrl: current.pollUrl || submitted.pollUrl,
      taskProtocol: submitted.taskProtocol,
      taskEndpoint: submitted.taskEndpoint,
    });
    if (current.status === "succeeded" || current.status === "failed") {
      return { ...current, elapsedMs: Math.round(performance.now() - startedAt) };
    }
  }
  return {
    ...current,
    id: submitted.id,
    status: "queued",
    elapsedMs: Math.round(performance.now() - startedAt),
    message: "视频任务仍在处理中，任务 ID 已保留，可稍后继续查询。",
  };
}

module.exports = {
  generateVideo,
  submitVideoTask,
  queryVideoTask,
  _internals: {
    AGNES_FRAMES,
    buildAgnesPayload,
    buildGenericPayload,
    collectVideoUrls,
    dimensionsForRatio,
    isVeo31LiteRequest,
    nearestAgnesFrames,
    pollCandidates,
    taskIdFrom,
    taskStatusFrom,
  },
};
