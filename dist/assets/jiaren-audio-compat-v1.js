(function installJiarenAudioCompatibility() {
  "use strict";

  if (window.__JIAREN_AUDIO_COMPAT_INSTALLED__) return;
  window.__JIAREN_AUDIO_COMPAT_INSTALLED__ = true;

  var nativeFetch = window.fetch.bind(window);
  var submissions = new Map();

  var OPERATION_MODELS = {
    "suno-generation": [/^suno[_-]?music$/i],
    "suno-lyrics": [/^suno[_-]?lyrics$/i],
    "suno-upload": [/^suno[_-]?upload$/i],
    "suno-stems": [/^suno[_-]?act[_-]?stems$/i],
    "suno-stems-all": [/^suno[_-]?act[_-]?stems$/i],
    "suno-midi": [/^suno[_-]?act[_-]?midi$/i],
    "suno-upsample-tags": [/^suno[_-]?act[_-]?tags$/i],
    "suno-concat": [/^suno[_-]?concat$/i],
  };

  function modelIdentity(model) {
    return [model?.endpointModelId, model?.modelId, model?.alias, model?.id]
      .filter(Boolean)
      .join(" ");
  }

  function modelConnection(model) {
    var settings = window.__JIAREN_RUNTIME_SETTINGS__ || {};
    var global = settings.global || {};
    return {
      baseUrl: String(model?.baseUrl || global.baseUrl || "").trim(),
      apiKey: String(model?.apiKey || global.apiKey || "").trim(),
      fallbackBaseUrl: String(model?.fallbackBaseUrl || global.fallbackBaseUrl || "").trim(),
      fallbackApiKey: String(model?.fallbackApiKey || global.fallbackApiKey || "").trim(),
    };
  }

  function enabledAudioModels() {
    var settings = window.__JIAREN_RUNTIME_SETTINGS__ || {};
    return (Array.isArray(settings.models) ? settings.models : []).filter(function (model) {
      var connection = modelConnection(model);
      return model && model.enabled !== false && model.category === "music" &&
        String(model.endpointModelId || model.modelId || "").trim() &&
        connection.baseUrl && connection.apiKey;
    });
  }

  function findModel(patterns) {
    var models = enabledAudioModels();
    for (var pattern of patterns) {
      var exact = models.find(function (model) {
        return pattern.test(String(model.endpointModelId || model.modelId || "").trim());
      });
      if (exact) return exact;
    }
    for (var fallbackPattern of patterns) {
      var fallback = models.find(function (model) {
        return fallbackPattern.test(modelIdentity(model));
      });
      if (fallback) return fallback;
    }
    return null;
  }

  function selectModel(operation) {
    if (operation === "whisper-transcribe") {
      return findModel([/^whisper(?:[-_].*)?$/i, /transcri/i]);
    }
    if (operation === "seed-audio") {
      return findModel([/doubao.*seed.*audio/i, /seed.*audio/i, /audio.*seed/i]);
    }
    var patterns = OPERATION_MODELS[operation] || [/^suno[_-]?actions?$/i];
    return findModel(patterns) || (operation !== "suno-generation"
      ? findModel([/^suno[_-]?actions?$/i])
      : null);
  }

  function buildRequest(model, payload, operation) {
    if (!model) {
      throw new Error("当前 API 配置中没有启用与此音频操作匹配的模型。");
    }
    var storage = window.__JIAREN_STORAGE_SETTINGS__ || {};
    var connection = modelConnection(model);
    return Object.assign({}, payload || {}, connection, {
      modelId: model.id,
      modelAlias: String(model.alias || model.endpointModelId || model.modelId || model.id || ""),
      endpointModelId: model.endpointModelId || model.modelId,
      fallbackEndpointModelId: model.fallbackEndpointModelId,
      requestMode: model.requestMode,
      apiGroup: model.apiGroup,
      operation: operation,
      action: operation.indexOf("suno-") === 0 ? operation.slice(5) : operation,
      cacheDir: storage.cacheDir,
      downloadsDir: storage.downloadsDir,
    });
  }

  function assetUrl(asset) {
    return String(asset?.localPath || asset?.url || asset?.dataUrl || "").trim();
  }

  function legacyData(raw) {
    var assets = Array.isArray(raw?.assets) ? raw.assets : [];
    var tracks = assets.filter(function (asset) { return asset?.type === "audio"; }).map(function (asset, index) {
      return {
        id: asset.id || asset.clipId || `audio-${index + 1}`,
        clipId: asset.clipId || asset.id || `audio-${index + 1}`,
        audioUrl: assetUrl(asset),
        remoteUrl: asset.url,
        title: asset.name || `音频 ${index + 1}`,
        duration: asset.durationMs ? Number(asset.durationMs) / 1000 : undefined,
        imageUrl: asset.imageUrl,
        tags: asset.tags,
      };
    }).filter(function (track) { return track.audioUrl; });
    var videos = assets.filter(function (asset) { return asset?.type === "video"; }).map(assetUrl).filter(Boolean);
    var files = assets.filter(function (asset) { return asset?.type === "file"; }).map(assetUrl).filter(Boolean);
    var images = assets.filter(function (asset) { return asset?.type === "image"; }).map(assetUrl).filter(Boolean);
    var status = String(raw?.status || "queued").toLowerCase();
    return {
      status: status,
      taskId: raw?.taskId,
      clipIds: Array.isArray(raw?.clipIds) ? raw.clipIds : [],
      taskProvider: raw?.taskProvider,
      pollUrl: raw?.pollUrl,
      requestId: raw?.id,
      progress: raw?.progress || raw?.taskStatus || "",
      failReason: status === "failed" ? raw?.message : undefined,
      error: status === "failed" ? raw?.message : undefined,
      tracks: tracks,
      audioUrls: tracks.map(function (track) { return track.audioUrl; }),
      videoUrls: Array.isArray(raw?.videoUrls) ? raw.videoUrls : videos,
      fileUrls: Array.isArray(raw?.fileUrls) ? raw.fileUrls : files,
      imageUrls: Array.isArray(raw?.imageUrls) ? raw.imageUrls : images,
      text: String(raw?.text || ""),
      usage: raw?.usage,
      transportHttpStatus: raw?.transportHttpStatus,
      upstreamHttpStatus: raw?.upstreamHttpStatus,
    };
  }

  function remember(raw, request) {
    var keys = [raw?.taskId].concat(Array.isArray(raw?.clipIds) ? raw.clipIds : []).filter(Boolean);
    var stored = { request: request, raw: raw };
    keys.forEach(function (key) { submissions.set(String(key), stored); });
  }

  async function submit(operation, payload) {
    if (!window.jiaren?.runtime?.submitAudioTask) {
      throw new Error("JiarenAI 音频运行时未初始化。");
    }
    var request = buildRequest(selectModel(operation), payload, operation);
    var raw = await window.jiaren.runtime.submitAudioTask(request);
    if (!raw || raw.status === "failed") throw new Error(raw?.message || "音频任务提交失败。");
    remember(raw, request);
    return legacyData(raw);
  }

  async function query(taskId, clipIds) {
    if (!window.jiaren?.runtime?.queryAudioTask) {
      throw new Error("JiarenAI 音频运行时未初始化。");
    }
    var ids = (Array.isArray(clipIds) ? clipIds : []).filter(Boolean);
    var stored = submissions.get(String(taskId || ids[0] || ""));
    if (!stored) throw new Error("没有找到该音频任务的当前 API 配置，请重新提交一次。");
    var raw = await window.jiaren.runtime.queryAudioTask(Object.assign({}, stored.request, {
      taskId: taskId || stored.raw?.taskId,
      taskProvider: stored.raw?.taskProvider,
      pollUrl: stored.raw?.pollUrl,
      clipIds: ids.length ? ids : stored.raw?.clipIds,
    }));
    if (!raw) throw new Error("音频任务没有返回状态。");
    remember(raw, stored.request);
    return legacyData(raw);
  }

  async function fileDataUrl(file) {
    var bytes = new Uint8Array(await file.arrayBuffer());
    var chunk = 32768;
    var binary = "";
    for (var offset = 0; offset < bytes.length; offset += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + chunk));
    }
    return `data:${file.type || "audio/mpeg"};base64,${window.btoa(binary)}`;
  }

  async function upload(formData) {
    var file = formData?.get?.("file");
    if (!(file instanceof File)) throw new Error("没有选择可上传的音频文件。");
    var model = selectModel("suno-generation");
    if (!model) throw new Error("当前 API 配置中没有启用 Suno 音乐模型。");
    var request = buildRequest(model, {
      dataUrl: await fileDataUrl(file),
      fileName: file.name,
      mimeType: file.type,
    }, "suno-upload-reference");
    var raw = await window.jiaren.runtime.uploadAudioTask(request);
    if (!raw?.ok) throw new Error(raw?.message || "参考音频上传失败。");
    return { clipId: raw.clipId, filename: file.name, uploadId: raw.uploadId };
  }

  function jsonResponse(success, data, error, status) {
    return new Response(JSON.stringify(success ? { success: true, data: data } : { success: false, error: error }), {
      status: status || (success ? 200 : 500),
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  function requestPath(input) {
    var value = typeof input === "string" ? input : input?.url;
    if (!value) return null;
    try { return new URL(value, window.location.href); } catch { return null; }
  }

  async function parseJsonBody(init) {
    if (!init?.body) return {};
    if (typeof init.body === "string") return JSON.parse(init.body || "{}");
    if (init.body instanceof URLSearchParams) return Object.fromEntries(init.body.entries());
    return {};
  }

  window.fetch = async function jiarenAudioFetch(input, init) {
    var url = requestPath(input);
    if (!url || url.pathname.indexOf("/api/proxy/audio/") !== 0) {
      return nativeFetch(input, init);
    }
    try {
      if (url.pathname === "/api/proxy/audio/submit") {
        var classicPayload = await parseJsonBody(init);
        var mode = classicPayload.mode || "generate";
        var classic = await submit("suno-generation", Object.assign({}, classicPayload, {
          operation: "suno-generation",
          mode: mode,
          coverClipId: classicPayload.cover_clip_id,
          continueClipId: classicPayload.continue_clip_id,
          continueAt: classicPayload.continue_at,
        }));
        return jsonResponse(true, classic);
      }
      if (url.pathname === "/api/proxy/audio/query") {
        var clipIds = String(url.searchParams.get("clipIds") || "").split(",").filter(Boolean);
        var queried = await query(null, clipIds);
        queried.status = queried.status === "succeeded" ? "SUCCESS" : queried.status === "failed" ? "FAILED" : "PROCESSING";
        queried.completed = queried.tracks.length;
        queried.total = Math.max(queried.tracks.length, clipIds.length, 1);
        return jsonResponse(true, queried);
      }
      if (url.pathname === "/api/proxy/audio/suno-nz/submit") {
        var actionPayload = await parseJsonBody(init);
        return jsonResponse(true, await submit(actionPayload.operation || "suno-generation", actionPayload));
      }
      if (url.pathname.indexOf("/api/proxy/audio/suno-nz/status/") === 0) {
        return jsonResponse(true, await query(decodeURIComponent(url.pathname.split("/").pop()), []));
      }
      if (url.pathname === "/api/proxy/audio/seed-audio/submit") {
        return jsonResponse(true, await submit("seed-audio", await parseJsonBody(init)));
      }
      if (url.pathname.indexOf("/api/proxy/audio/seed-audio/status/") === 0) {
        return jsonResponse(true, await query(decodeURIComponent(url.pathname.split("/").pop()), []));
      }
      if (url.pathname === "/api/proxy/audio/whisper/transcribe") {
        var whisper = await submit("whisper-transcribe", await parseJsonBody(init));
        return jsonResponse(true, whisper);
      }
      if (url.pathname === "/api/proxy/audio/upload") {
        return jsonResponse(true, await upload(init?.body));
      }
      return jsonResponse(false, null, "当前音频操作尚未接入 JiarenAI API。", 404);
    } catch (error) {
      return jsonResponse(false, null, error instanceof Error ? error.message : "音频请求失败。", 500);
    }
  };
})();
