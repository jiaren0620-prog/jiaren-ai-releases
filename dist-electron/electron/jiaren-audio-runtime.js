"use strict";

// This module only handles requests emitted by JiarenAI audio node.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { Readable, Transform } = require("node:stream");
const { pipeline } = require("node:stream/promises");
const { downloadBuffer, downloadFile } = require("./jiaren-safe-download.js");

const SUNO_MV_MAP = {
  "v3.0": "chirp-v3.0",
  "v3.5": "chirp-v3.5",
  v4: "chirp-v4",
  "v4.5": "chirp-auk",
  "v4.5+": "chirp-bluejay",
  v5: "chirp-crow",
  "v5.5": "chirp-fenix",
};

function result(status, request, message, extra = {}) {
  return { id: crypto.randomUUID(), modelId: request?.modelId || "suno", status, elapsedMs: extra.elapsedMs || 0, assets: extra.assets || [], message, ...extra };
}

function providerRoot(baseUrl) {
  const raw = String(baseUrl || "").trim();
  if (!raw) return "";
  const url = new URL(raw);
  url.search = "";
  url.hash = "";
  url.pathname = url.pathname.replace(/\/+$/, "").replace(/\/(?:v1|v2)$/i, "");
  return url.toString().replace(/\/+$/, "");
}

function unwrap(payload) {
  if (payload && typeof payload === "object" && payload.data && (payload.code || payload.success === true)) return payload.data;
  return payload;
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload;
  try { payload = text ? JSON.parse(text) : {}; } catch { throw new Error(`音频接口返回非 JSON：${text.slice(0, 180)}`); }
  if (!response.ok) throw new Error(payload?.error?.message || payload?.error || payload?.message || `音频接口 HTTP ${response.status}`);
  return unwrap(payload);
}

function authHeaders(apiKey, json = true) {
  return { Authorization: `Bearer ${String(apiKey || "").trim()}`, ...(json ? { "Content-Type": "application/json" } : {}) };
}

function safeName(value, fallback) {
  return String(value || fallback).replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").slice(0, 90) || fallback;
}

async function saveRemoteAudio(url, directory, name) {
  if (!url || !directory) return undefined;
  fs.mkdirSync(directory, { recursive: true });
  const target = path.join(directory, `${safeName(name, "suno-track")}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}.mp3`);
  await downloadFile(url, target, { accept: "audio/*,*/*", maxBytes: 1024 * 1024 * 1024 });
  return target;
}

async function streamResponseToFile(response, target, maxBytes) {
  if (!response.body) throw new Error("Audio API returned an empty response.");
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > maxBytes) throw new Error(`Audio response exceeds ${maxBytes} bytes.`);
  const temporaryPath = `${target}.${process.pid}.part`;
  let byteSize = 0;
  const limiter = new Transform({
    transform(chunk, _encoding, callback) {
      byteSize += chunk.length;
      callback(byteSize > maxBytes ? new Error(`Audio response exceeds ${maxBytes} bytes.`) : null, chunk);
    },
  });
  try {
    await pipeline(Readable.fromWeb(response.body), limiter, fs.createWriteStream(temporaryPath, { flags: "wx" }));
    fs.renameSync(temporaryPath, target);
    return byteSize;
  } catch (error) {
    try { fs.unlinkSync(temporaryPath); } catch {}
    throw error;
  }
}

function openAIBase(baseUrl) {
  const raw = String(baseUrl || "").trim().replace(/\/+$/, "");
  return /\/v1$/i.test(raw) ? raw : `${raw}/v1`;
}

function endpointModelId(request) {
  return String(request?.endpointModelId || request?.modelId || "").trim();
}

function isSunoMusicModel(modelId) {
  return /(?:^|[\/_-])suno[_ -]?music(?:$|[\/_-])/i.test(modelId);
}

function isSpeechModel(modelId) {
  return /tts|speech|text[_ -]?to[_ -]?audio/i.test(modelId) &&
    !/whisper|transcri|clone|design|list/i.test(modelId);
}

function mimeFromAudioName(value) {
  const extension = path.extname(String(value || "")).replace(/^\./, "").toLowerCase();
  return { mp3: "audio/mpeg", wav: "audio/wav", m4a: "audio/mp4", ogg: "audio/ogg", flac: "audio/flac", aac: "audio/aac" }[extension] || "audio/mpeg";
}

async function audioInput(value) {
  const source = String(value || "").trim();
  if (!source) throw new Error("An audio source is required.");
  if (source.startsWith("data:")) {
    const match = source.match(/^data:([^;,]+)?(?:;base64)?,(.*)$/s);
    if (!match) throw new Error("The audio data URL is invalid.");
    return {
      bytes: source.includes(";base64,") ? Buffer.from(match[2], "base64") : Buffer.from(decodeURIComponent(match[2])),
      mimeType: match[1] || "audio/mpeg",
      fileName: "audio-upload.mp3",
    };
  }
  let localPath = source;
  if (/^file:/i.test(source)) {
    try { localPath = decodeURIComponent(new URL(source).pathname.replace(/^\/(?:([A-Za-z]:))/, "$1")); } catch { localPath = source; }
  }
  if (fs.existsSync(localPath)) {
    return { bytes: fs.readFileSync(localPath), mimeType: mimeFromAudioName(localPath), fileName: path.basename(localPath) };
  }
  if (/^https?:\/\//i.test(source)) {
    const downloaded = await downloadBuffer(source, { accept: "audio/*,*/*", maxBytes: 1024 * 1024 * 1024 });
    const response = { ok: true, arrayBuffer: async () => downloaded.buffer, headers: { get: () => downloaded.contentType } };
    if (!response.ok) throw new Error(`Unable to read reference audio: HTTP ${response.status}`);
    return {
      bytes: Buffer.from(await response.arrayBuffer()),
      mimeType: response.headers.get("content-type") || mimeFromAudioName(new URL(source).pathname),
      fileName: path.basename(new URL(source).pathname) || "audio-upload.mp3",
    };
  }
  throw new Error("The reference audio could not be read.");
}

async function inlineAudioReference(value) {
  if (!value || /^(?:https?:|data:)/i.test(String(value))) return value;
  const input = await audioInput(value);
  return `data:${input.mimeType};base64,${input.bytes.toString("base64")}`;
}

function mediaUrls(payload, type) {
  const urls = [];
  const extensionPattern = type === "audio"
    ? /\.(?:mp3|wav|m4a|aac|ogg|flac)(?:\?|#|$)/i
    : type === "video"
      ? /\.(?:mp4|mov|webm|mkv)(?:\?|#|$)/i
      : type === "image"
        ? /\.(?:png|jpe?g|webp|gif)(?:\?|#|$)/i
        : /\.(?:mid|midi|zip|json|txt|lrc|srt|vtt)(?:\?|#|$)/i;
  const keyPattern = type === "audio"
    ? /audio|song|track|clip/i
    : type === "video"
      ? /video|mp4|mv/i
      : type === "image"
        ? /image|cover|artwork/i
        : /file|download|midi|stem|output|result/i;
  const visit = (value, key = "", depth = 0) => {
    if (depth > 5 || value == null) return;
    if (typeof value === "string") {
      if (/^(?:https?:\/\/|data:|file:)/i.test(value) && (keyPattern.test(key) || extensionPattern.test(value))) urls.push(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, key, depth + 1));
      return;
    }
    if (typeof value === "object") {
      Object.entries(value).forEach(([childKey, child]) => visit(child, childKey, depth + 1));
    }
  };
  visit(payload);
  return [...new Set(urls)];
}

function audioUrls(payload) {
  return mediaUrls(payload, "audio");
}

function responseText(payload) {
  const direct = [payload?.text, payload?.lyrics, payload?.content, payload?.transcript, payload?.result_text, payload?.data?.text, payload?.data?.lyrics, payload?.data?.content];
  return String(direct.find((value) => typeof value === "string" && value.trim()) || "").trim();
}

function taskIdFromPayload(payload) {
  return String(payload?.task_id || payload?.taskId || payload?.id || payload?.data?.task_id || payload?.data?.taskId || payload?.data?.id || "").trim();
}

function taskStatusFromPayload(payload) {
  return String(payload?.status || payload?.state || payload?.data?.status || payload?.data?.state || "queued").toLowerCase();
}

async function assetsFromAudioPayload(payload, request) {
  const urls = audioUrls(payload);
  const videoUrls = mediaUrls(payload, "video").filter((url) => !urls.includes(url));
  const imageUrls = mediaUrls(payload, "image").filter((url) => !urls.includes(url) && !videoUrls.includes(url));
  const fileUrls = mediaUrls(payload, "file").filter((url) => !urls.includes(url) && !videoUrls.includes(url) && !imageUrls.includes(url));
  const assets = [];
  for (let index = 0; index < urls.length; index += 1) {
    const url = urls[index];
    let localPath;
    try {
      localPath = await saveRemoteAudio(url, request.cacheDir || request.downloadsDir, request.title || `audio-${index + 1}`);
    } catch {
      localPath = undefined;
    }
    assets.push({
      id: crypto.randomUUID(),
      type: "audio",
      name: `${safeName(request.title, "audio")}-${index + 1}.mp3`,
      url,
      localPath,
      mimeType: "audio/mpeg",
    });
  }
  videoUrls.forEach((url, index) => assets.push({ id: crypto.randomUUID(), type: "video", name: `video-${index + 1}.mp4`, url, mimeType: "video/mp4" }));
  imageUrls.forEach((url, index) => assets.push({ id: crypto.randomUUID(), type: "image", name: `image-${index + 1}.png`, url, mimeType: "image/png" }));
  fileUrls.forEach((url, index) => assets.push({ id: crypto.randomUUID(), type: "file", name: `file-${index + 1}`, url, mimeType: "application/octet-stream" }));
  return assets;
}

function payloadResultExtra(payload, assets) {
  return {
    text: responseText(payload),
    videoUrls: assets.filter((asset) => asset.type === "video").map((asset) => asset.url).filter(Boolean),
    imageUrls: assets.filter((asset) => asset.type === "image").map((asset) => asset.url).filter(Boolean),
    fileUrls: assets.filter((asset) => asset.type === "file").map((asset) => asset.url).filter(Boolean),
  };
}

async function saveAudioResponse(response, request, startedAt) {
  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
  if (!response.ok) {
    const text = await response.text();
    let payload;
    try { payload = text ? JSON.parse(text) : {}; } catch { payload = {}; }
    throw new Error(payload?.error?.message || payload?.message || text.slice(0, 240) || `Audio API HTTP ${response.status}`);
  }
  if (contentType.includes("application/json") || contentType.includes("text/json")) {
    const payload = await response.json();
    const assets = await assetsFromAudioPayload(payload, request);
    const extra = payloadResultExtra(payload, assets);
    const taskId = taskIdFromPayload(payload);
    const status = taskStatusFromPayload(payload);
    const failed = ["failed", "error", "cancelled", "canceled"].includes(status);
    const completed = assets.length > 0 || Boolean(extra.text) || ["complete", "completed", "success", "succeeded"].includes(status);
    if (completed) return result("succeeded", request, "Audio operation completed.", { elapsedMs: Math.round(performance.now() - startedAt), assets, ...extra });
    if (failed) throw new Error(payload?.error?.message || payload?.error || payload?.message || "Audio operation failed.");
    if (taskId) return result("queued", request, "Audio task submitted.", {
      elapsedMs: Math.round(performance.now() - startedAt),
      taskId,
      clipIds: [taskId],
      taskProvider: "openai-audio",
      pollUrl: `${openAIBase(request.baseUrl)}/audio/generations/${encodeURIComponent(taskId)}`,
      ...extra,
    });
    throw new Error("Audio API did not return a result or task ID.");
  }
  const directory = request.cacheDir || request.downloadsDir;
  fs.mkdirSync(directory, { recursive: true });
  const localPath = path.join(directory, `${safeName(request.title, "audio")}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}.mp3`);
  const byteSize = await streamResponseToFile(response, localPath, 1024 * 1024 * 1024);
  if (!byteSize) throw new Error("Audio API returned an empty response.");
  return result("succeeded", request, "Audio generation completed.", {
    elapsedMs: Math.round(performance.now() - startedAt),
    assets: [{ id: crypto.randomUUID(), type: "audio", name: path.basename(localPath), localPath, mimeType: contentType || "audio/mpeg" }],
  });
}

async function submitOpenAITranscription(request, startedAt) {
  const input = await audioInput(request.audioUrl || request.audioFilePath || request.localPath || request.dataUrl);
  const form = new FormData();
  form.append("file", new Blob([input.bytes], { type: input.mimeType }), input.fileName);
  form.append("model", endpointModelId(request));
  form.append("response_format", request.responseFormat || request.response_format || "json");
  const response = await fetch(`${openAIBase(request.baseUrl)}/audio/transcriptions`, {
    method: "POST",
    headers: authHeaders(request.apiKey, false),
    body: form,
  });
  return saveAudioResponse(response, request, startedAt);
}

async function openAIAudioBody(request, speech) {
  const model = endpointModelId(request);
  const providerParams = request.providerParams && typeof request.providerParams === "object" ? request.providerParams : {};
  if (speech) {
    return {
      model,
      input: request.prompt || request.title || "",
      voice: providerParams.voice || request.voice || "alloy",
      response_format: providerParams.response_format || "mp3",
      speed: Number(providerParams.speed || 1),
    };
  }
  const body = {
    model,
    operation: request.operation,
    action: request.action,
    mode: request.mode,
    prompt: request.prompt || "",
    title: request.title || "",
    tags: request.tags || "",
    version: request.version,
    custom: request.custom,
    instrumental: request.instrumental,
    style: request.style,
    vocal_gender: request.vocal_gender,
    duration: Number(request.duration || providerParams.duration || 0) || undefined,
    seed: Number(request.seed) > 0 ? Number(request.seed) : undefined,
    task_id: request.task_id || request.taskIdRef,
    task_id_2: request.task_id_2,
    task_ids: request.task_ids,
    audio_index: request.audio_index,
    continue_at: request.continue_at ?? request.continueAt,
    start_s: request.start_s,
    end_s: request.end_s,
    duration_s: request.duration_s,
    speed: request.speed,
    name: request.name,
    cover_clip_id: request.cover_clip_id || request.coverClipId,
    continue_clip_id: request.continue_clip_id || request.continueClipId,
    speaker: request.speaker,
    output_format: request.outputFormat || request.output_format,
    sample_rate: request.sampleRate || request.sample_rate,
    speech_rate: request.speechRate || request.speech_rate,
    loudness_rate: request.loudnessRate || request.loudness_rate,
    pitch_rate: request.pitchRate || request.pitch_rate,
    images: request.images,
    audio_urls: request.audio_urls || request.audioUrls,
    audio_url: request.audio_url,
  };
  if (request.audioFilePath) body.audio_file = await inlineAudioReference(request.audioFilePath);
  return body;
}

async function submitOpenAIAudio(request, startedAt, speech) {
  const endpoint = speech ? `${openAIBase(request.baseUrl)}/audio/speech` : `${openAIBase(request.baseUrl)}/audio/generations`;
  const body = await openAIAudioBody(request, speech);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { ...authHeaders(request.apiKey), Accept: speech ? "audio/mpeg,application/json" : "application/json,audio/mpeg" },
    body: JSON.stringify(body),
  });
  return saveAudioResponse(response, request, startedAt);
}

async function queryOpenAIAudio(request, startedAt) {
  const taskId = String(request.taskId || "").trim();
  const pollUrl = String(request.pollUrl || `${openAIBase(request.baseUrl)}/audio/generations/${encodeURIComponent(taskId)}`).trim();
  const payload = await requestJson(pollUrl, { headers: authHeaders(request.apiKey, false) });
  const assets = await assetsFromAudioPayload(payload, request);
  const extra = payloadResultExtra(payload, assets);
  const status = taskStatusFromPayload(payload);
  const failed = ["failed", "error", "cancelled", "canceled"].includes(status);
  const complete = assets.length > 0 || Boolean(extra.text) || ["complete", "completed", "success", "succeeded"].includes(status);
  return result(complete ? "succeeded" : failed ? "failed" : "queued", request, complete ? "Audio generation completed." : failed ? payload?.message || "Audio generation failed." : "Audio generation is still running.", {
    elapsedMs: Math.round(performance.now() - startedAt),
    assets,
    ...extra,
    taskId,
    clipIds: [taskId],
    taskProvider: "openai-audio",
    pollUrl,
  });
}

async function submitAudioTask(request) {
  const startedAt = performance.now();
  try {
    const root = providerRoot(request.baseUrl);
    const model = endpointModelId(request);
    if (root && String(request.apiKey || "").trim() && request.operation === "whisper-transcribe") {
      return await submitOpenAITranscription(request, startedAt);
    }
    if (root && String(request.apiKey || "").trim() && (request.operation || !isSunoMusicModel(model))) {
      return await submitOpenAIAudio(request, startedAt, isSpeechModel(model));
    }
    if (!root || !String(request.apiKey || "").trim()) return result("failed", request, "音频 API 配置不完整，请填写 Base URL 和 API Key。");
    const mode = ["generate", "cover", "extend"].includes(request.mode) ? request.mode : "generate";
    const mv = SUNO_MV_MAP[String(request.version || "v5.5").replace(/^suno-/i, "")] || "chirp-fenix";
    let endpoint = `${root}/suno/generate`;
    let body = { prompt: request.prompt || "", tags: request.tags || "", mv, title: request.title || "" };
    if (Number(request.seed) > 0) body.seed = Number(request.seed);
    if (mode === "extend") {
      if (!request.continueClipId) throw new Error("续写模式缺少 Clip ID。");
      body = { ...body, task: "upload_extend", continue_clip_id: request.continueClipId, continue_at: Number(request.continueAt || 28) };
    }
    if (mode === "cover") {
      if (!request.coverClipId) throw new Error("翻唱模式缺少 Clip ID。");
      endpoint = `${root}/suno/submit/music`;
      body = { ...body, task: "cover", cover_clip_id: request.coverClipId, generation_type: "TEXT", make_instrumental: false, negative_tags: "", continue_clip_id: null, continue_at: null, continued_aligned_prompt: null, infill_start_s: null, infill_end_s: null };
    }
    const payload = await requestJson(endpoint, { method: "POST", headers: authHeaders(request.apiKey), body: JSON.stringify(body) });
    const rawTaskId = typeof payload?.data === "string" ? payload.data : payload?.id || payload?.task_id || payload?.taskId;
    const clips = Array.isArray(payload?.clips) ? payload.clips : Array.isArray(payload?.data) ? payload.data : [];
    const clipIds = clips.map((clip) => clip?.id || clip?.clip_id).filter(Boolean);
    const taskId = String(rawTaskId || clipIds[0] || "");
    if (!taskId && !clipIds.length) throw new Error("音频接口没有返回任务 ID 或 Clip ID。");
    return result("queued", request, "音频任务已提交，正在生成。", { elapsedMs: Math.round(performance.now() - startedAt), taskId, clipIds: clipIds.length ? clipIds : [taskId] });
  } catch (error) {
    return result("failed", request, error instanceof Error ? error.message : "音频任务提交失败。", { elapsedMs: Math.round(performance.now() - startedAt) });
  }
}

async function queryAudioTask(request) {
  const startedAt = performance.now();
  try {
    if (request.taskProvider === "openai-audio") {
      return await queryOpenAIAudio(request, startedAt);
    }
    const root = providerRoot(request.baseUrl);
    const ids = (Array.isArray(request.clipIds) ? request.clipIds : []).filter(Boolean).join(",") || String(request.taskId || "").trim();
    if (!root || !String(request.apiKey || "").trim() || !ids) return result("failed", request, "缺少音频查询凭据或任务 ID。");
    const payload = await requestJson(`${root}/suno/feed/${encodeURIComponent(ids)}`, { headers: authHeaders(request.apiKey, false) });
    const clips = Array.isArray(payload) ? payload : Array.isArray(payload?.clips) ? payload.clips : [];
    const completed = clips.filter((clip) => ["complete", "completed", "success", "succeeded"].includes(String(clip?.status || "").toLowerCase()) && (clip?.audio_url || clip?.audioUrl));
    const failed = clips.some((clip) => ["failed", "error"].includes(String(clip?.status || "").toLowerCase()));
    const assets = [];
    for (const clip of completed) {
      const remoteUrl = clip.audio_url || clip.audioUrl;
      let localPath;
      try { localPath = await saveRemoteAudio(remoteUrl, request.cacheDir, clip.title || clip.id || "suno-track"); } catch { localPath = undefined; }
      assets.push({ id: clip.id || clip.clip_id || crypto.randomUUID(), type: "audio", name: clip.title || "Suno 音频.mp3", url: remoteUrl, localPath, clipId: clip.clip_id || clip.id, durationMs: Math.round(Number(clip?.metadata?.duration || clip?.duration || 0) * 1000), mimeType: "audio/mpeg", tags: clip.tags || "", imageUrl: clip.image_large_url || clip.image_url });
    }
    const allDone = clips.length > 0 && completed.length === clips.length;
    return result(allDone ? "succeeded" : failed && !assets.length ? "failed" : "queued", request, allDone ? `音频生成完成，共 ${assets.length} 首。` : failed && !assets.length ? "音频生成失败，请检查任务状态。" : `音频生成中：${completed.length}/${Math.max(clips.length, 1)}。`, { elapsedMs: Math.round(performance.now() - startedAt), assets, taskId: request.taskId, clipIds: ids.split(",") });
  } catch (error) {
    return result("failed", request, error instanceof Error ? error.message : "音频任务查询失败。", { elapsedMs: Math.round(performance.now() - startedAt), taskId: request.taskId, clipIds: request.clipIds });
  }
}

async function uploadAudioTask(request) {
  const startedAt = performance.now();
  try {
    const root = providerRoot(request.baseUrl);
    const apiKey = String(request.apiKey || "").trim();
    let localPath = String(request.localPath || "").trim();
    if ((!localPath || !fs.existsSync(localPath)) && request.dataUrl) {
      const input = await audioInput(request.dataUrl);
      const directory = request.cacheDir || request.downloadsDir;
      if (!directory) throw new Error("Audio cache directory is unavailable.");
      fs.mkdirSync(directory, { recursive: true });
      const extension = path.extname(request.fileName || "") || ".mp3";
      localPath = path.join(directory, `${safeName(request.fileName, "audio-upload")}-${Date.now()}${extension}`);
      fs.writeFileSync(localPath, input.bytes);
    }
    if (!root || !apiKey || !localPath || !fs.existsSync(localPath)) return { ok: false, message: "参考音频文件或 API 配置无效。", elapsedMs: Math.round(performance.now() - startedAt) };
    const fileName = request.fileName || path.basename(localPath);
    const extension = path.extname(fileName).replace(/^\./, "").toLowerCase() || "mp3";
    const mime = request.mimeType || ({ mp3: "audio/mpeg", wav: "audio/wav", m4a: "audio/mp4", ogg: "audio/ogg", flac: "audio/flac", aac: "audio/aac" }[extension] || "audio/mpeg");
    const init = await requestJson(`${root}/suno/uploads/audio`, { method: "POST", headers: authHeaders(apiKey), body: JSON.stringify({ extension }) });
    const uploadId = init?.id;
    const uploadUrl = init?.url;
    if (!uploadId || !uploadUrl) throw new Error("Suno 上传初始化没有返回 id/url。");
    const bytes = fs.readFileSync(localPath);
    let uploadResponse;
    if (init.fields && Object.keys(init.fields).length) {
      const form = new FormData();
      Object.entries(init.fields).forEach(([key, value]) => form.append(key, String(value)));
      form.append("file", new Blob([bytes], { type: mime }), fileName);
      uploadResponse = await fetch(uploadUrl, { method: "POST", body: form });
    } else {
      uploadResponse = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": mime }, body: bytes });
    }
    if (!uploadResponse.ok && uploadResponse.status !== 204) throw new Error(`参考音频上传失败：HTTP ${uploadResponse.status}`);
    await requestJson(`${root}/suno/uploads/audio/${uploadId}/upload-finish`, { method: "POST", headers: authHeaders(apiKey), body: JSON.stringify({ upload_type: "file_upload", upload_filename: fileName }) });
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const status = await requestJson(`${root}/suno/uploads/audio/${uploadId}`, { headers: authHeaders(apiKey, false) });
      const state = String(status?.status || status?.state || "").toLowerCase();
      if (state === "complete") {
        const initialized = await requestJson(`${root}/suno/uploads/audio/${uploadId}/initialize-clip`, { method: "POST", headers: authHeaders(apiKey), body: "{}" });
        const clipId = initialized?.clip_id || initialized?.id;
        if (!clipId) throw new Error("参考音频初始化没有返回 Clip ID。");
        return { ok: true, clipId, uploadId, message: "参考音频已上传。", elapsedMs: Math.round(performance.now() - startedAt) };
      }
      if (["failed", "error"].includes(state)) throw new Error(status?.message || "参考音频处理失败。");
    }
    throw new Error("参考音频上传处理超时。");
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "参考音频上传失败。", elapsedMs: Math.round(performance.now() - startedAt) };
  }
}

module.exports = { submitAudioTask, queryAudioTask, uploadAudioTask };
