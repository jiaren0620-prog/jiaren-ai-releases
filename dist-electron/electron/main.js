"use strict";
// GUI launches can outlive the temporary terminal that started them. Logging
// to that closed pipe raises EPIPE on Windows unless the stream is guarded.
for (const stream of [process.stdout, process.stderr]) {
  if (stream && typeof stream.on === "function") {
    stream.on("error", (error) => {
      if (error && error.code === "EPIPE") return;
      // Console stream failures are non-fatal for the desktop application.
    });
  }
}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __importDefault = exports && exports.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_crypto_1 = __importDefault(require("node:crypto"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const node_stream_1 = require("node:stream");
const node_stream_promises_1 = require("node:stream/promises");
const {
  buildOrderedGeminiImageParts,
  buildOrderedImagePrompt,
  buildOrderedOpenAIImageContent
} = require("../../shared/inlineMediaContent.cjs");
const node_url_1 = require("node:url");
const jiaren_audio_runtime_1 = require("./jiaren-audio-runtime.js");
const jiaren_video_runtime_1 = require("./jiaren-video-runtime.js");
const jiaren_local_server_1 = require("./jiaren-local-server.js");
const skill_factory_runtime_1 = require("./skill-factory-runtime.js");
const jiaren_agent_control_runtime_1 = require("./jiaren-agent-control-runtime.js");
const jiaren_codex_app_server_runtime_1 = require("./jiaren-codex-app-server-runtime.js");
const jiaren_channel_driver_runtime_1 = require("./jiaren-channel-driver-runtime.js");
const jiaren_safe_download_1 = require("./jiaren-safe-download.js");
electron_1.app.commandLine.appendSwitch("enable-gpu-rasterization");
electron_1.app.commandLine.appendSwitch("enable-zero-copy");
electron_1.app.commandLine.appendSwitch("ignore-gpu-blocklist");
const builtInModelMeta = {
  "a2-gemini-3.1-flash-image-preview": { requestMode: "openai-image", endpointModelId: "gemini-3.1-flash-image-preview", apiGroup: "a2", alias: "Nano Banana 2" },
  "a2-gemini-3.1-flash-image-preview-512px": { requestMode: "openai-image", endpointModelId: "gemini-3.1-flash-image-preview-512px", apiGroup: "a2", alias: "Nano Banana 2" },
  "a2-gemini-3.1-flash-image-preview-2k": { requestMode: "openai-image", endpointModelId: "gemini-3.1-flash-image-preview-2k", apiGroup: "a2", alias: "Nano Banana 2" },
  "a2-gemini-3.1-flash-image-preview-4k": { requestMode: "openai-image", endpointModelId: "gemini-3.1-flash-image-preview-4k", apiGroup: "a2", alias: "Nano Banana 2" },
  "a2-gemini-3-pro-image-preview": { requestMode: "openai-image", endpointModelId: "gemini-3-pro-image-preview", fallbackEndpointModelId: "gemini-3.1-flash-image-preview", apiGroup: "a2", alias: "Nano Banana PRO" },
  "a2-gpt-4o-image": { requestMode: "openai-image", endpointModelId: "gpt-4o-image", apiGroup: "a2", alias: "gpt-4o-image" },
  "a2-gpt-image-1": { requestMode: "openai-image", endpointModelId: "gpt-image-1", apiGroup: "a2", alias: "gpt-image-1" },
  "a2-gpt-image-1.5": { requestMode: "openai-image", endpointModelId: "gpt-image-1.5", apiGroup: "a2", alias: "gpt-image-1.5" },
  "a2-gpt-image-2": { requestMode: "openai-image", endpointModelId: "gpt-image-2", apiGroup: "a2", alias: "gpt-image-2" },
  "a2-gpt-image-2-official": { requestMode: "openai-image", endpointModelId: "gpt-image-2-official", apiGroup: "a2", alias: "gpt-image-2-official" },
  "a2-gpt-image-2-all": { requestMode: "openai-image", endpointModelId: "gpt-image-2-all", apiGroup: "a2", alias: "gpt-image-2-all" },
  "a2-gpt-4o-image-vip": { requestMode: "openai-chat", endpointModelId: "gpt-4o-image-vip", apiGroup: "a2", alias: "gpt-4o-image-vip" },
  "a2-fal-nano-banana": { requestMode: "openai-image", endpointModelId: "fal-ai/nano-banana", apiGroup: "a2", alias: "fal-ai/nano-banana" },
  "a2-gemini-2.5-flash-image": { requestMode: "openai-image", endpointModelId: "gemini-2.5-flash-image", apiGroup: "a2", alias: "gemini-2.5-flash-image" },
  "a2-gemini-2.5-flash-image-preview": { requestMode: "openai-image", endpointModelId: "gemini-2.5-flash-image-preview", apiGroup: "a2", alias: "gemini-2.5-flash-image-preview" },
  "a2-seedream-5.0": { requestMode: "openai-image", endpointModelId: "doubao-seedream-5-0", apiGroup: "a2", alias: "doubao-seedream-5-0" },
  "a2-gemini-3.1-flash-image-preview-official": { requestMode: "openai-image", endpointModelId: "gemini-3.1-flash-image-preview-official", apiGroup: "a2", alias: "Nano Banana 2" },
  "a2-gemini-3-pro-image-preview-official": { requestMode: "openai-image", endpointModelId: "gemini-3-pro-image-preview-official", apiGroup: "a2", alias: "Nano Banana PRO" },
  "a2-gemini-2.5-flash-image-official": { requestMode: "openai-image", endpointModelId: "gemini-2.5-flash-image-official", apiGroup: "a2", alias: "gemini-2.5-flash-image-official" },
  "a2-nano-banana": { requestMode: "openai-image", endpointModelId: "nano-banana", apiGroup: "a2", alias: "nano-banana" },
  "a2-nano-banana-2": { requestMode: "openai-image", endpointModelId: "gemini-3.1-flash-image-preview", fallbackEndpointModelId: "gemini-3-pro-image-preview", apiGroup: "a2", alias: "Nano Banana 2" },
  "a2-nano-banana-pro": { requestMode: "openai-image", endpointModelId: "gemini-3-pro-image-preview", fallbackEndpointModelId: "gemini-3.1-flash-image-preview", apiGroup: "a2", alias: "Nano Banana PRO" },
  "a2-seedream-4.5": { requestMode: "openai-image", endpointModelId: "doubao-seedream-4-5", apiGroup: "a2", alias: "doubao-seedream-4-5" },
  "a2-seedream-4.0": { requestMode: "openai-image", endpointModelId: "doubao-seedream-4-0", apiGroup: "a2", alias: "doubao-seedream-4-0" },
  "a2-qwen-image": { requestMode: "openai-image", endpointModelId: "qwen-image", apiGroup: "a2", alias: "qwen-image" },
  "a2-qwen-image-edit": { requestMode: "openai-image", endpointModelId: "qwen-image-edit", apiGroup: "a2", alias: "qwen-image-edit" },
  "a2-qwen-image-edit-2509": { requestMode: "openai-image", endpointModelId: "qwen-image-edit-2509", apiGroup: "a2", alias: "qwen-image-edit-2509" },
  "a2-grok-4.2-image": { requestMode: "openai-image", endpointModelId: "grok-4.2-image", apiGroup: "a2", alias: "grok-4.2-image" },
  "a2-recraft-v3": { requestMode: "openai-image", endpointModelId: "recraft-v3", apiGroup: "a2", alias: "recraft-v3" },
  "a2-recraft-v3-svg": { requestMode: "openai-image", endpointModelId: "recraft-v3-svg", apiGroup: "a2", alias: "recraft-v3-svg" },
  "a2-flux-kontext-pro": { requestMode: "openai-image", endpointModelId: "flux-kontext-pro", apiGroup: "a2", alias: "flux-kontext-pro" },
  "a2-flux-kontext-max": { requestMode: "openai-image", endpointModelId: "flux-kontext-max", apiGroup: "a2", alias: "flux-kontext-max" },
  "a2-ideogram-v2": { requestMode: "openai-image", endpointModelId: "ideogram-v2", apiGroup: "a2", alias: "ideogram-v2" },
  "a2-gpt-4o": { requestMode: "openai-chat", endpointModelId: "gpt-4o", apiGroup: "a2", alias: "gpt-4o" },
  "a2-gpt-4o-2024-08-06": { requestMode: "openai-chat", endpointModelId: "gpt-4o-2024-08-06", apiGroup: "a2", alias: "gpt-4o-2024-08-06" },
  "a2-gpt-4.1": { requestMode: "openai-chat", endpointModelId: "gpt-4.1", apiGroup: "a2", alias: "gpt-4.1" },
  "a2-gpt-3.5-turbo": { requestMode: "openai-chat", endpointModelId: "gpt-3.5-turbo", apiGroup: "a2", alias: "gpt-3.5-turbo" },
  "a2-gpt-3.5-turbo-instruct": { requestMode: "openai-chat", endpointModelId: "gpt-3.5-turbo-instruct", apiGroup: "a2", alias: "gpt-3.5-turbo-instruct" },
  "a2-claude-3-7-sonnet-20250219": { requestMode: "openai-chat", endpointModelId: "claude-3-7-sonnet-20250219", apiGroup: "a2", alias: "claude-3-7-sonnet-20250219" },
  "a2-claude-3-7-sonnet-20250219-thinking": { requestMode: "openai-chat", endpointModelId: "claude-3-7-sonnet-20250219-thinking", apiGroup: "a2", alias: "claude-3-7-sonnet-20250219-thinking" },
  "a2-gemini-2.5-pro-preview-05-06": { requestMode: "openai-chat", endpointModelId: "gemini-2.5-pro-preview-05-06", apiGroup: "a2", alias: "gemini-2.5-pro-preview-05-06" },
  "a2-gemini-3.1-flash-lite-preview": { requestMode: "openai-chat", endpointModelId: "gemini-3.1-flash-lite-preview", apiGroup: "a2", alias: "gemini-3.1-flash-lite-preview" },
  "a2-deepseek-v3-1-250821-thinking": { requestMode: "openai-chat", endpointModelId: "deepseek-v3-1-250821-thinking", apiGroup: "a2", alias: "deepseek-v3-1-250821-thinking" },
  "a2-claude-opus-4-7": { requestMode: "openai-chat", endpointModelId: "claude-opus-4-7", fallbackEndpointModelId: "claude-opus-4-6", apiGroup: "a2", alias: "claude-opus-4-7" },
  "a2-claude-opus-4-6": { requestMode: "openai-chat", endpointModelId: "claude-opus-4-6", fallbackEndpointModelId: "claude-opus-4-7", apiGroup: "a2", alias: "claude-opus-4-6�����ݣ�" },
  "a2-gpt-5-pro-official": { requestMode: "openai-chat", endpointModelId: "gpt-5-pro-official", apiGroup: "a2", alias: "gpt-5-pro-official" },
  "a2-gpt-5.4-official": { requestMode: "openai-chat", endpointModelId: "gpt-5.4-official", apiGroup: "a2", alias: "gpt-5.4-official" },
  "a2-gpt-5.4-pro-official": { requestMode: "openai-chat", endpointModelId: "gpt-5.4-pro-official", apiGroup: "a2", alias: "gpt-5.4-pro-official" },
  "a2-gpt-5.4-mini-official": { requestMode: "openai-chat", endpointModelId: "gpt-5.4-mini-official", apiGroup: "a2", alias: "gpt-5.4-mini-official" },
  "a2-gpt-5.4-mini": { requestMode: "openai-chat", endpointModelId: "gpt-5.4-mini", apiGroup: "a2", alias: "gpt-5.4-mini" },
  "a2-gpt-5.4-nano-official": { requestMode: "openai-chat", endpointModelId: "gpt-5.4-nano-official", apiGroup: "a2", alias: "gpt-5.4-nano-official" },
  "a2-gpt-5.3-codex": { requestMode: "openai-chat", endpointModelId: "gpt-5.3-codex", apiGroup: "a2", alias: "gpt-5.3-codex" },
  "a2-gpt-5.3-codex-official": { requestMode: "openai-chat", endpointModelId: "gpt-5.3-codex-official", apiGroup: "a2", alias: "gpt-5.3-codex-official" },
  "a2-gpt-5.3-codex-spark": { requestMode: "openai-chat", endpointModelId: "gpt-5.3-codex-spark", apiGroup: "a2", alias: "gpt-5.3-codex-spark" },
  "a2-gpt-realtime-1.5-official": { requestMode: "openai-chat", endpointModelId: "gpt-realtime-1.5-official", apiGroup: "a2", alias: "gpt-realtime-1.5-official" },
  "a2-gpt-audio-1.5-official": { requestMode: "openai-chat", endpointModelId: "gpt-audio-1.5-official", apiGroup: "a2", alias: "gpt-audio-1.5-official" },
  "a2-gemini-3.1-pro": { requestMode: "openai-chat", endpointModelId: "gemini-3.1-pro", apiGroup: "a2", alias: "gemini-3.1-pro" },
  "a2-gemini-3-pro-preview-official": { requestMode: "openai-chat", endpointModelId: "gemini-3-pro-preview-official", apiGroup: "a2", alias: "gemini-3-pro-preview-official" },
  "a2-gemini-3-flash-preview-official": { requestMode: "openai-chat", endpointModelId: "gemini-3-flash-preview-official", apiGroup: "a2", alias: "gemini-3-flash-preview-official" },
  "a2-gemini-3.5-flash": { requestMode: "openai-chat", endpointModelId: "gemini-3.5-flash", apiGroup: "a2", alias: "gemini-3.5-flash" },
  "a2-gemini-3.5-thinking": { requestMode: "openai-chat", endpointModelId: "gemini-3.5-thinking", apiGroup: "a2", alias: "gemini-3.5-thinking" },
  "a2-gemini-2.5-flash-lite-official": { requestMode: "openai-chat", endpointModelId: "gemini-2.5-flash-lite-official", apiGroup: "a2", alias: "gemini-2.5-flash-lite-official" },
  "a2-gemini-2.0-flash-official": { requestMode: "openai-chat", endpointModelId: "gemini-2.0-flash-official", apiGroup: "a2", alias: "gemini-2.0-flash-official" },
  "a2-gemini-2.0-flash-lite-official": { requestMode: "openai-chat", endpointModelId: "gemini-2.0-flash-lite-official", apiGroup: "a2", alias: "gemini-2.0-flash-lite-official" },
  "a2-deepseek-v4-pro": { requestMode: "openai-chat", endpointModelId: "deepseek-v4-pro", apiGroup: "a2", alias: "deepseek-v4-pro" },
  "a2-deepseek-v4-flash": { requestMode: "openai-chat", endpointModelId: "deepseek-v4-flash", apiGroup: "a2", alias: "deepseek-v4-flash" },
  "a2-kimi-k2.6": { requestMode: "openai-chat", endpointModelId: "kimi-k2.6", apiGroup: "a2", alias: "kimi-k2.6" },
  "a2-glm-5.1": { requestMode: "openai-chat", endpointModelId: "glm-5.1", apiGroup: "a2", alias: "glm-5.1" },
  "a2-suno-v3": { requestMode: "unknown", endpointModelId: "suno-v3", apiGroup: "a2", alias: "Suno V3" },
  "a2-suno-v3.5": { requestMode: "unknown", endpointModelId: "suno-v3.5", apiGroup: "a2", alias: "Suno V3.5" },
  "a2-suno-v4": { requestMode: "unknown", endpointModelId: "suno-v4", apiGroup: "a2", alias: "Suno V4" },
  "a2-suno-lyrics": { requestMode: "unknown", endpointModelId: "suno-lyrics", apiGroup: "a2", alias: "Suno �������" },
  "a2-suno-stems": { requestMode: "unknown", endpointModelId: "suno-stems", apiGroup: "a2", alias: "Suno ��������" },
  "a2-openai-tts": { requestMode: "unknown", endpointModelId: "tts-1", apiGroup: "a2", alias: "OpenAI TTS" },
  "a2-openai-tts-hd": { requestMode: "unknown", endpointModelId: "tts-1-hd", apiGroup: "a2", alias: "OpenAI TTS HD" },
  "a2-openai-whisper": { requestMode: "unknown", endpointModelId: "whisper-1", apiGroup: "a2", alias: "OpenAI Whisper ת¼" },
  "a2-minimax-tts-sync": { requestMode: "unknown", endpointModelId: "minimax-tts-sync", apiGroup: "a2", alias: "MINIMAX TTS ͬ��" },
  "a2-minimax-tts-async": { requestMode: "unknown", endpointModelId: "minimax-tts-async", apiGroup: "a2", alias: "MINIMAX TTS �첽" },
  "a2-minimax-tts-openai": { requestMode: "unknown", endpointModelId: "minimax-tts-openai", apiGroup: "a2", alias: "MINIMAX TTS OpenAI ��ʽ" },
  "a2-minimax-voice-clone": { requestMode: "unknown", endpointModelId: "minimax-voice-clone", apiGroup: "a2", alias: "MINIMAX ��ɫ����" },
  "a2-gpt-audio-1.5-official-music": { requestMode: "unknown", endpointModelId: "gpt-audio-1.5-official", apiGroup: "a2", alias: "gpt-audio-1.5-official" },
  "a2-kling-text-to-audio": { requestMode: "unknown", endpointModelId: "kling-text-to-audio", apiGroup: "a2", alias: "����������Ч" },
  "a2-kling-video-to-audio": { requestMode: "unknown", endpointModelId: "kling-video-to-audio", apiGroup: "a2", alias: "������Ƶ����Ч" },
  "a2-kling-tts": { requestMode: "unknown", endpointModelId: "kling-tts", apiGroup: "a2", alias: "���������ϳ�" },
  "a2-riffusion-pro": { requestMode: "unknown", endpointModelId: "riffusion-pro", apiGroup: "a2", alias: "Riffusion רҵģʽ��δ���ţ�" },
  "a2-riffusion-inspiration": { requestMode: "unknown", endpointModelId: "riffusion-inspiration", apiGroup: "a2", alias: "Riffusion ���ģʽ��δ���ţ�" },
  "a2-udio-description": { requestMode: "unknown", endpointModelId: "udio-description", apiGroup: "a2", alias: "Udio �������ɣ�δ���ţ�" },
  "a2-udio-lyrics": { requestMode: "unknown", endpointModelId: "udio-lyrics", apiGroup: "a2", alias: "Udio ������ɣ�δ���ţ�" },
  "apilio-claude-opus-4-7": { requestMode: "openai-chat", endpointModelId: "claude-opus-4-7", fallbackEndpointModelId: "claude-opus-4-6", apiGroup: "apilio", alias: "Apilio claude-opus-4-7" },
  "apilio-claude-opus-4-6": { requestMode: "openai-chat", endpointModelId: "claude-opus-4-6", fallbackEndpointModelId: "claude-opus-4-7", apiGroup: "apilio", alias: "Apilio claude-opus-4-6" },
  "apilio-claude-3-5-sonnet": { requestMode: "openai-chat", endpointModelId: "claude-3-5-sonnet", apiGroup: "apilio", alias: "Apilio Claude 3.5 Sonnet" },
  "apilio-gpt-4o": { requestMode: "openai-chat", endpointModelId: "gpt-4o", apiGroup: "apilio", alias: "Apilio GPT-4o" },
  "apilio-gpt-4o-mini": { requestMode: "openai-chat", endpointModelId: "gpt-4o-mini", apiGroup: "apilio", alias: "Apilio GPT-4o mini" },
  "apilio-gpt-5.4": { requestMode: "openai-chat", endpointModelId: "gpt-5.4", apiGroup: "apilio", alias: "Apilio GPT-5.4" },
  "apilio-gpt-5.3-codex": { requestMode: "openai-chat", endpointModelId: "gpt-5.3-codex", apiGroup: "apilio", alias: "Apilio GPT-5.3 Codex" },
  "apilio-gemini-3.1-pro": { requestMode: "openai-chat", endpointModelId: "gemini-3.1-pro", apiGroup: "apilio", alias: "Apilio Gemini 3.1 Pro" },
  "apilio-deepseek-v4-pro": { requestMode: "openai-chat", endpointModelId: "deepseek-v4-pro", apiGroup: "apilio", alias: "Apilio DeepSeek V4 Pro" },
  "apilio-qwen3-max": { requestMode: "openai-chat", endpointModelId: "qwen3-max", apiGroup: "apilio", alias: "Apilio Qwen3 Max" },
  "apilio-gpt-image-2": { requestMode: "openai-image", endpointModelId: "gpt-image-2", apiGroup: "apilio", alias: "Apilio GPT Image 2" },
  "apilio-gpt-image-2-official": { requestMode: "openai-image", endpointModelId: "gpt-image-2-official", apiGroup: "apilio", alias: "Apilio GPT Image 2 �ٷ�" },
  "apilio-gemini-3-pro-image-preview": { requestMode: "openai-image", endpointModelId: "gemini-3-pro-image-preview", fallbackEndpointModelId: "gemini-3.1-flash-image-preview", apiGroup: "apilio", alias: "Nano Banana PRO" },
  "apilio-nano-banana-pro": { requestMode: "openai-image", endpointModelId: "gemini-3-pro-image-preview", fallbackEndpointModelId: "gemini-3.1-flash-image-preview", apiGroup: "apilio", alias: "Nano Banana PRO" },
  "apilio-nano-banana-2": { requestMode: "openai-image", endpointModelId: "gemini-3.1-flash-image-preview", fallbackEndpointModelId: "gemini-3-pro-image-preview", apiGroup: "apilio", alias: "Nano Banana 2" },
  "apilio-flux-kontext-pro": { requestMode: "openai-image", endpointModelId: "flux-kontext-pro", apiGroup: "apilio", alias: "Apilio Flux Kontext Pro" },
  "apilio-flux-kontext-max": { requestMode: "openai-image", endpointModelId: "flux-kontext-max", apiGroup: "apilio", alias: "Apilio Flux Kontext Max" },
  "apilio-qwen-image": { requestMode: "openai-image", endpointModelId: "qwen-image", apiGroup: "apilio", alias: "Apilio qwen-image" },
  "apilio-qwen-image-edit": { requestMode: "openai-image", endpointModelId: "qwen-image-edit", apiGroup: "apilio", alias: "Apilio qwen-image-edit" },
  "apilio-suno-v4": { requestMode: "unknown", endpointModelId: "suno-v4", apiGroup: "apilio", alias: "Apilio Suno V4" },
  "apilio-suno-v3.5": { requestMode: "unknown", endpointModelId: "suno-v3.5", apiGroup: "apilio", alias: "Apilio Suno V3.5" },
  "apilio-minimax-tts-sync": { requestMode: "unknown", endpointModelId: "minimax-tts-sync", apiGroup: "apilio", alias: "Apilio MiniMax TTS ͬ��" },
  "apilio-minimax-tts-async": { requestMode: "unknown", endpointModelId: "minimax-tts-async", apiGroup: "apilio", alias: "Apilio MiniMax TTS �첽" }
};
const cleanModelMeta = {
  "comfly-claude-opus-4-7": { requestMode: "openai-chat", endpointModelId: "claude-opus-4-7", fallbackEndpointModelId: "claude-opus-4-6", apiGroup: "a2", alias: "Claude Opus 4.7" },
  "comfly-claude-3-5-sonnet": { requestMode: "openai-chat", endpointModelId: "claude-3-5-sonnet", apiGroup: "a2", alias: "Claude 3.5 Sonnet" },
  "comfly-gpt-4o": { requestMode: "openai-chat", endpointModelId: "gpt-4o", apiGroup: "a2", alias: "GPT-4o" },
  "comfly-gpt-4o-mini": { requestMode: "openai-chat", endpointModelId: "gpt-4o-mini", apiGroup: "a2", alias: "GPT-4o mini" },
  "comfly-gemini-3-1-pro": { requestMode: "openai-chat", endpointModelId: "gemini-3.1-pro", apiGroup: "a2", alias: "Gemini 3.1 Pro" },
  "comfly-qwen3-max": { requestMode: "openai-chat", endpointModelId: "qwen3-max", apiGroup: "a2", alias: "Qwen3 Max" },
  "comfly-deepseek-v4-pro": { requestMode: "openai-chat", endpointModelId: "deepseek-v4-pro", apiGroup: "a2", alias: "DeepSeek V4 Pro" },
  "comfly-gpt-image-2": { requestMode: "openai-image", endpointModelId: "gpt-image-2", fallbackEndpointModelId: "gemini-3-pro-image-preview", apiGroup: "a2", alias: "GPT Image 2" },
  "comfly-nano-banana-pro": { requestMode: "openai-image", endpointModelId: "gemini-3-pro-image-preview", fallbackEndpointModelId: "gemini-3.1-flash-image-preview", apiGroup: "a2", alias: "Nano Banana PRO" },
  "comfly-nano-banana-2": { requestMode: "openai-image", endpointModelId: "gemini-3.1-flash-image-preview", fallbackEndpointModelId: "gemini-3-pro-image-preview", apiGroup: "a2", alias: "Nano Banana 2" },
  "comfly-nano-banana": { requestMode: "openai-image", endpointModelId: "nano-banana", apiGroup: "a2", alias: "Nano Banana" },
  "comfly-flux-kontext-pro": { requestMode: "openai-image", endpointModelId: "flux-kontext-pro", apiGroup: "a2", alias: "Flux Kontext Pro" },
  "comfly-flux-kontext-max": { requestMode: "openai-image", endpointModelId: "flux-kontext-max", apiGroup: "a2", alias: "Flux Kontext Max" },
  "comfly-qwen-image": { requestMode: "openai-image", endpointModelId: "qwen-image", apiGroup: "a2", alias: "Qwen Image" },
  "comfly-qwen-image-edit": { requestMode: "openai-image", endpointModelId: "qwen-image-edit", apiGroup: "a2", alias: "Qwen Image Edit" },
  "comfly-suno-v4": { requestMode: "unknown", endpointModelId: "suno-v4", apiGroup: "a2", alias: "Suno V4" },
  "comfly-suno-v3-5": { requestMode: "unknown", endpointModelId: "suno-v3.5", apiGroup: "a2", alias: "Suno V3.5" },
  "comfly-minimax-tts-sync": { requestMode: "unknown", endpointModelId: "minimax-tts-sync", apiGroup: "a2", alias: "MiniMax TTS Sync" },
  "comfly-minimax-tts-async": { requestMode: "unknown", endpointModelId: "minimax-tts-async", apiGroup: "a2", alias: "MiniMax TTS Async" },
  "comfly-openai-tts": { requestMode: "unknown", endpointModelId: "tts-1", apiGroup: "a2", alias: "OpenAI TTS" },
  "apilio-claude-opus-4-7": { requestMode: "openai-chat", endpointModelId: "claude-opus-4-7", fallbackEndpointModelId: "claude-opus-4-6", apiGroup: "apilio", alias: "Claude Opus 4.7" },
  "apilio-claude-3-5-sonnet": { requestMode: "openai-chat", endpointModelId: "claude-3-5-sonnet", apiGroup: "apilio", alias: "Claude 3.5 Sonnet" },
  "apilio-gpt-4o": { requestMode: "openai-chat", endpointModelId: "gpt-4o", apiGroup: "apilio", alias: "GPT-4o" },
  "apilio-gpt-4o-mini": { requestMode: "openai-chat", endpointModelId: "gpt-4o-mini", apiGroup: "apilio", alias: "GPT-4o mini" },
  "apilio-gemini-3-1-pro": { requestMode: "openai-chat", endpointModelId: "gemini-3.1-pro", apiGroup: "apilio", alias: "Gemini 3.1 Pro" },
  "apilio-qwen3-max": { requestMode: "openai-chat", endpointModelId: "qwen3-max", apiGroup: "apilio", alias: "Qwen3 Max" },
  "apilio-deepseek-v4-pro": { requestMode: "openai-chat", endpointModelId: "deepseek-v4-pro", apiGroup: "apilio", alias: "DeepSeek V4 Pro" },
  "apilio-gpt-image-2": { requestMode: "openai-image", endpointModelId: "gpt-image-2", fallbackEndpointModelId: "gemini-3-pro-image-preview", apiGroup: "apilio", alias: "GPT Image 2" },
  "apilio-nano-banana-pro": { requestMode: "openai-image", endpointModelId: "gemini-3-pro-image-preview", fallbackEndpointModelId: "gemini-3.1-flash-image-preview", apiGroup: "apilio", alias: "Nano Banana PRO" },
  "apilio-nano-banana-2": { requestMode: "openai-image", endpointModelId: "gemini-3.1-flash-image-preview", fallbackEndpointModelId: "gemini-3-pro-image-preview", apiGroup: "apilio", alias: "Nano Banana 2" },
  "apilio-nano-banana": { requestMode: "openai-image", endpointModelId: "gemini-2.5-flash-image-preview", apiGroup: "apilio", alias: "Nano Banana" },
  "apilio-flux-kontext-pro": { requestMode: "openai-image", endpointModelId: "flux-kontext-pro", apiGroup: "apilio", alias: "Flux Kontext Pro" },
  "apilio-flux-kontext-max": { requestMode: "openai-image", endpointModelId: "flux-kontext-max", apiGroup: "apilio", alias: "Flux Kontext Max" },
  "apilio-qwen-image": { requestMode: "openai-image", endpointModelId: "qwen-image", apiGroup: "apilio", alias: "Qwen Image" },
  "apilio-qwen-image-edit": { requestMode: "openai-image", endpointModelId: "qwen-image-edit", apiGroup: "apilio", alias: "Qwen Image Edit" },
  "apilio-suno-v4": { requestMode: "unknown", endpointModelId: "suno-v4", apiGroup: "apilio", alias: "Suno V4" },
  "apilio-suno-v3-5": { requestMode: "unknown", endpointModelId: "suno-v3.5", apiGroup: "apilio", alias: "Suno V3.5" },
  "apilio-minimax-tts-sync": { requestMode: "unknown", endpointModelId: "minimax-tts-sync", apiGroup: "apilio", alias: "MiniMax TTS Sync" },
  "apilio-minimax-tts-async": { requestMode: "unknown", endpointModelId: "minimax-tts-async", apiGroup: "apilio", alias: "MiniMax TTS Async" },
  "apilio-openai-tts": { requestMode: "unknown", endpointModelId: "tts-1", apiGroup: "apilio", alias: "OpenAI TTS" }
};
const legacyCleanModelIdMap = {
  "a2-claude-opus-4-7": "comfly-claude-opus-4-7",
  "a2-claude-opus-4-6": "comfly-claude-opus-4-7",
  "claude-opus-4-7": "comfly-claude-opus-4-7",
  "claude-opus-4-6": "comfly-claude-opus-4-7",
  "a2-claude-3-7-sonnet-20250219": "comfly-claude-3-5-sonnet",
  "a2-claude-3-7-sonnet-20250219-thinking": "comfly-claude-3-5-sonnet",
  "a2-gpt-4o": "comfly-gpt-4o",
  "a2-gpt-4o-mini": "comfly-gpt-4o-mini",
  "a2-gpt-image-2": "comfly-gpt-image-2",
  "a2-gpt-image-2-official": "comfly-gpt-image-2",
  "a2-gpt-image-2-all": "comfly-gpt-image-2",
  "gpt-image-2": "comfly-gpt-image-2",
  "a2-gemini-3-pro-image-preview": "comfly-nano-banana-pro",
  "a2-gemini-3-pro-image-preview-4k": "comfly-nano-banana-pro",
  "a2-nano-banana-2": "comfly-nano-banana-2",
  "a2-nano-banana-pro": "comfly-nano-banana-pro",
  "gemini-3-pro-image-preview": "comfly-nano-banana-pro",
  "gemini-3-pro-image-preview-4k": "comfly-nano-banana-pro",
  "nano-banana-2": "comfly-nano-banana-2",
  "nano-banana-pro": "comfly-nano-banana-pro",
  "a2-gemini-3.1-flash-image-preview": "comfly-nano-banana-2",
  "a2-gemini-3.1-flash-image-preview-512px": "comfly-nano-banana-2",
  "a2-gemini-3.1-flash-image-preview-2k": "comfly-nano-banana-2",
  "a2-gemini-3.1-flash-image-preview-4k": "comfly-nano-banana-2",
  "gemini-3.1-flash-image-preview": "comfly-nano-banana-2",
  "gemini-3.1-flash-image-preview-512px": "comfly-nano-banana-2",
  "gemini-3.1-flash-image-preview-2k": "comfly-nano-banana-2",
  "gemini-3.1-flash-image-preview-4k": "comfly-nano-banana-2",
  "a2-flux-kontext-pro": "comfly-flux-kontext-pro",
  "a2-flux-kontext-max": "comfly-flux-kontext-max",
  "a2-qwen-image": "comfly-qwen-image",
  "a2-qwen-image-edit": "comfly-qwen-image-edit",
  "a2-seedance2-mini": "comfly-seedance-2-mini",
  "a2-seedance2": "comfly-seedance-2",
  "a2-seedance2-fast": "comfly-seedance-2-fast",
  "seedance-2-mini": "comfly-seedance-2-mini",
  "seedance-2": "comfly-seedance-2",
  "seedance-2-fast": "comfly-seedance-2-fast",
  "doubao-seedance-2.0-mini": "comfly-seedance-2-mini",
  "doubao-seedance-2-0-mini": "comfly-seedance-2-mini",
  "doubao-seedance-2-0-260128": "comfly-seedance-2",
  "doubao-seedance-2-0-fast-260128": "comfly-seedance-2-fast",
  "a2-sora2-official": "comfly-sora-2",
  "sora-2-official": "comfly-sora-2",
  "a2-veo31-pro": "comfly-veo-3-1-pro",
  "a2-veo31-fast": "comfly-veo-3-1-fast",
  "a2-veo31-lite": "comfly-veo-3-1-lite",
  "veo3.1-pro": "comfly-veo-3-1-pro",
  "veo3.1-fast": "comfly-veo-3-1-fast",
  "veo3.1-lite": "comfly-veo-3-1-lite",
  "a2-grok-video-1.5-preview": "comfly-grok-video-1-5",
  "grok-video-1.5-preview": "comfly-grok-video-1-5",
  "a2-wan2.6": "comfly-wan-2-6",
  "a2-wan2.6-i2v-flash": "comfly-wan-2-6-i2v-flash",
  "a2-pixverse-v4": "pixverse-v4-simple",
  "a2-pixverse-v4-simple": "pixverse-v4-simple",
  "pixverse-v4": "pixverse-v4-simple",
  "pixverse-v4-simple": "pixverse-v4-simple",
  "v4": "pixverse-v4-simple",
  "pixverse": "pixverse-v4-simple",
  "a2-suno-v4": "comfly-suno-v4",
  "a2-suno-v3.5": "comfly-suno-v3-5",
  "a2-minimax-tts-sync": "comfly-minimax-tts-sync",
  "a2-minimax-tts-async": "comfly-minimax-tts-async",
  "apilio-claude-opus-4-7": "comfly-claude-opus-4-7",
  "apilio-claude-opus-4-6": "comfly-claude-opus-4-7",
  "apilio-claude-3-5-sonnet": "comfly-claude-3-5-sonnet",
  "apilio-gpt-4o": "comfly-gpt-4o",
  "apilio-gpt-4o-mini": "comfly-gpt-4o-mini",
  "apilio-gemini-3-1-pro": "comfly-gemini-3-1-pro",
  "apilio-qwen3-max": "comfly-qwen3-max",
  "apilio-deepseek-v4-pro": "comfly-deepseek-v4-pro",
  "apilio-gpt-image-2": "comfly-gpt-image-2",
  "apilio-gemini-3-pro-image-preview": "comfly-nano-banana-pro",
  "apilio-gemini-3.1-flash-image-preview": "comfly-nano-banana-2",
  "apilio-gemini-3.1-flash-image-preview-512px": "comfly-nano-banana-2",
  "apilio-gemini-3.1-flash-image-preview-2k": "comfly-nano-banana-2",
  "apilio-gemini-3.1-flash-image-preview-4k": "comfly-nano-banana-2",
  "apilio-nano-banana-2": "comfly-nano-banana-2",
  "apilio-nano-banana-3-1-flash": "comfly-nano-banana-2",
  "apilio-nano-banana": "comfly-nano-banana",
  "apilio-flux-kontext-pro": "comfly-flux-kontext-pro",
  "apilio-flux-kontext-max": "comfly-flux-kontext-max",
  "apilio-qwen-image": "comfly-qwen-image",
  "apilio-qwen-image-edit": "comfly-qwen-image-edit",
  "apilio-doubao-seedance-2.0-mini": "comfly-seedance-2-mini",
  "apilio-doubao-seedance-2-0-mini": "comfly-seedance-2-mini",
  "apilio-doubao-seedance-2-0-260128": "comfly-seedance-2",
  "apilio-doubao-seedance-2-0-fast-260128": "comfly-seedance-2-fast",
  "apilio-seedance-2-mini": "comfly-seedance-2-mini",
  "apilio-seedance-2": "comfly-seedance-2",
  "apilio-seedance-2-fast": "comfly-seedance-2-fast",
  "apilio-sora-2-official": "comfly-sora-2",
  "apilio-sora-2": "comfly-sora-2",
  "apilio-veo3.1-pro": "comfly-veo-3-1-pro",
  "apilio-veo3.1-fast": "comfly-veo-3-1-fast",
  "apilio-veo3.1-lite": "comfly-veo-3-1-lite",
  "apilio-veo-3-1-pro": "comfly-veo-3-1-pro",
  "apilio-veo-3-1-fast": "comfly-veo-3-1-fast",
  "apilio-veo-3-1-lite": "comfly-veo-3-1-lite",
  "apilio-grok-video-1.5-preview": "comfly-grok-video-1-5",
  "apilio-grok-video-1-5": "comfly-grok-video-1-5",
  "apilio-wan2.6": "comfly-wan-2-6",
  "apilio-wan2.6-i2v-flash": "comfly-wan-2-6-i2v-flash",
  "apilio-wan-2-6": "comfly-wan-2-6",
  "apilio-wan-2-6-i2v-flash": "comfly-wan-2-6-i2v-flash",
  "apilio-pixverse-v4": "pixverse-v4-simple",
  "apilio-pixverse-v4-simple": "pixverse-v4-simple",
  "apilio-pixverse": "pixverse-v4-simple",
  "apilio-suno-v4": "comfly-suno-v4",
  "apilio-suno-v3.5": "comfly-suno-v3-5",
  "apilio-suno-v3-5": "comfly-suno-v3-5",
  "apilio-minimax-tts-sync": "comfly-minimax-tts-sync",
  "apilio-minimax-tts-async": "comfly-minimax-tts-async",
  "apilio-openai-tts": "comfly-openai-tts"
};
Object.assign(builtInModelMeta, cleanModelMeta);
Object.assign(builtInModelMeta, {
  "comfly-veo-3-1-lite": { requestMode: "openai-video", endpointModelId: "veo3.1-lite", apiGroup: "a2", alias: "Veo 3.1 Lite" },
  "a2-veo31-lite": { requestMode: "openai-video", endpointModelId: "veo3.1-lite", apiGroup: "a2", alias: "Veo 3.1 Lite" },
  "apilio-veo3.1-lite": { requestMode: "openai-video", endpointModelId: "veo3.1-lite", apiGroup: "apilio", alias: "Veo 3.1 Lite" }
});
function normalizeRuntimeModelKey(value) {
  if (!value?.trim()) {
    return void 0;
  }
  const trimmed = value.trim();
  if (trimmed.startsWith("provider-")) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  return legacyCleanModelIdMap[trimmed] ?? legacyCleanModelIdMap[lower] ?? (cleanModelMeta[trimmed] ? trimmed : trimmed);
}
function isDynamicProviderModelId(value) {
  return Boolean(value?.trim().startsWith("provider-"));
}
const isDev = process.env.VITE_DEV_SERVER_URL !== void 0 || !electron_1.app.isPackaged;
const executableRoot = node_path_1.default.dirname(electron_1.app.getPath("exe"));
const bundledResourceRoot = process.resourcesPath || node_path_1.default.join(executableRoot, "resources");
const appRoot = electron_1.app.getAppPath();
const portableRoot = process.env.PORTABLE_EXECUTABLE_DIR ?? executableRoot;
// Keep user configuration outside the install directory so upgrades do not
// discard API settings, local workflows, skills, or project history.
const userWritableRoot = electron_1.app.getPath("userData");
const legacyWritableRoot = portableRoot;
function bundledRuntimePath(...segments) {
  const externalPath = node_path_1.default.join(bundledResourceRoot, ...segments);
  return (0, node_fs_1.existsSync)(externalPath) ? externalPath : node_path_1.default.join(appRoot, ...segments);
}
const dataRoot = node_path_1.default.join(userWritableRoot, ".jiaren");
const projectRoot = node_path_1.default.join(userWritableRoot, ".project");
const savedProjectRoot = node_path_1.default.join(projectRoot, "saved");
const projectManifestName = "jiaren-project.json";
let legacyWritableMigrationChecked = false;
const defaultCacheDir = node_path_1.default.join(dataRoot, "cache");
const defaultDownloadsDir = node_path_1.default.join(electron_1.app.getPath("pictures"), "Jiaren AI");
const preferencesPath = node_path_1.default.join(dataRoot, "preferences.json");
const licensePath = node_path_1.default.join(dataRoot, "license.json");
const providerBrandName = "API";
const apiMartBaseUrl = "";
const defaultProjectName = "δ������Ŀ";
const rongtuPassword = "www.modown.cn";
const defaultRongtuPort = 8188;
const defaultRongtuEngineRoot = "H:\\ComfyUI\\ħ����ǧ����ͼ������һ�����ϰ���û��comfyui�Ŀ���ѡ������еĲ���Ҫ��\\ħ����ǧ����ͼ������һ�����ϰ�";
const defaultRongtuWorkflowName = "ħ������ͼ������.json";
const defaultRongtuPrompt = "������Ʒ��͸�Ӻ͹�Ӱ���ò�Ʒ���뱳��";
let comfyRongtuProcess;
const comfyWorkflowRoot = node_path_1.default.join(dataRoot, "comfy-workflows");
const comfyCustomWorkflowRoot = node_path_1.default.join(comfyWorkflowRoot, "custom");
const comfyWorkflowInstancesPath = node_path_1.default.join(dataRoot, "comfy-instances.json");
const defaultComfyInstances = ["127.0.0.1:8188"];
const resourceLibraryRoot = node_path_1.default.join(dataRoot, "resource-library");
const resourceLibraryDbPath = node_path_1.default.join(resourceLibraryRoot, "resource_library.json");
let jiarenLocalServicePort = 0;
let jiarenLocalAuthToken = "";
let skillFactoryRuntime;
let agentControlRuntime;
let codexAppServerRuntime;
let channelDriverRuntime;
function appendStartupLog(message) {
  try {
    ensureDir(dataRoot);
    (0, node_fs_1.appendFileSync)(node_path_1.default.join(dataRoot, "startup.log"), `${(/* @__PURE__ */ new Date()).toISOString()} ${message}
`, "utf-8");
  } catch {
  }
}
function importCodexGeneratedImage(sourcePath, item = {}) {
  const resolved = (0, node_fs_1.realpathSync)(sourcePath);
  const stat = (0, node_fs_1.statSync)(resolved);
  const ext = node_path_1.default.extname(resolved).toLowerCase();
  if (!stat.isFile() || stat.size <= 0 || stat.size > 128 * 1024 * 1024) {
    throw new Error("Codex generated image file is invalid.");
  }
  if (!new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".avif", ".tif", ".tiff"]).has(ext)) {
    throw new Error("Codex generated an unsupported image format.");
  }
  const targetRoot = node_path_1.default.join(dataRoot, "local-service", "input", "codex");
  ensureDir(targetRoot);
  const sourceBase = node_path_1.default.basename(resolved, ext)
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "codex-image";
  const targetPath = uniquePath(targetRoot, `${sourceBase}${ext}`);
  (0, node_fs_1.copyFileSync)(resolved, targetPath);
  const dimensions = imageDimensions(targetPath);
  return {
    title: "Codex image",
    fileName: node_path_1.default.basename(targetPath),
    localPath: targetPath,
    url: isDev ? fileToDataUrl(targetPath) : `/files/input/codex/${encodeURIComponent(node_path_1.default.basename(targetPath))}`,
    mimeType: guessMime(targetPath),
    width: dimensions.width,
    height: dimensions.height,
    revisedPrompt: typeof item.revisedPrompt === "string" ? item.revisedPrompt : "",
  };
}
const mimeByExtension = {
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4"
};
function ensureDir(targetPath) {
  if (!(0, node_fs_1.existsSync)(targetPath)) {
    (0, node_fs_1.mkdirSync)(targetPath, { recursive: true });
  }
}
function migrateLegacyWritableData() {
  if (legacyWritableMigrationChecked) {
    return;
  }
  legacyWritableMigrationChecked = true;
  if (node_path_1.default.resolve(legacyWritableRoot) === node_path_1.default.resolve(userWritableRoot)) {
    return;
  }
  for (const directoryName of [".jiaren", ".project"]) {
    const source = node_path_1.default.join(legacyWritableRoot, directoryName);
    const target = node_path_1.default.join(userWritableRoot, directoryName);
    if (!(0, node_fs_1.existsSync)(source)) {
      continue;
    }
    ensureDir(target);
    try {
      (0, node_fs_1.cpSync)(source, target, {
        recursive: true,
        force: false,
        errorOnExist: false
      });
    } catch {
      // A partially copied cache must not prevent the application from opening.
      // Individual preference files are also covered by the legacy preference scan.
    }
  }
}
function ensureLocalRoots() {
  migrateLegacyWritableData();
  for (const dir of [dataRoot, projectRoot, savedProjectRoot, defaultCacheDir, defaultDownloadsDir, comfyCustomWorkflowRoot, resourceLibraryRoot]) {
    ensureDir(dir);
  }
}
function getLocalPaths() {
  ensureLocalRoots();
  return {
    dataRoot,
    projectRoot,
    cacheDir: defaultCacheDir,
    downloadsDir: defaultDownloadsDir
  };
}
function createWindow() {
  const iconPath = findAppIcon();
  const preloadPath = node_path_1.default.join(appRoot, "dist-electron", "electron", "preload.js");
  const rendererIndexPath = node_path_1.default.join(appRoot, "dist", "index.html");
  appendStartupLog(`createWindow packaged=${electron_1.app.isPackaged} appRoot=${appRoot}`);
  appendStartupLog(`preload=${preloadPath} exists=${(0, node_fs_1.existsSync)(preloadPath)}`);
  appendStartupLog(`renderer=${rendererIndexPath} exists=${(0, node_fs_1.existsSync)(rendererIndexPath)}`);
  const mainWindow = new electron_1.BrowserWindow({
    width: 1500,
    height: 940,
    minWidth: 1180,
    minHeight: 760,
    show: false,
    backgroundColor: "#090b09",
    title: "Jiaren AI",
    frame: false,
    titleBarStyle: "hidden",
    paintWhenInitiallyHidden: true,
    icon: iconPath,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      devTools: isDev,
      backgroundThrottling: !isDev
    }
  });
  if (!isDev) {
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https?:\/\//i.test(url)) openExternalUrl(url);
      return { action: "deny" };
    });
    mainWindow.webContents.on("will-navigate", (event, url) => {
      const localServiceUrl = jiarenLocalServicePort > 0 && url.startsWith(`http://127.0.0.1:${jiarenLocalServicePort}/`);
      if (!url.startsWith("file:") && !localServiceUrl) event.preventDefault();
    });
    mainWindow.webContents.on("before-input-event", (event, input) => {
      const key = String(input.key || "").toLowerCase();
      const opensDevTools = key === "f12" || (input.control && input.shift && (key === "i" || key === "j" || key === "c"));
      if (opensDevTools) event.preventDefault();
    });
  }
  let startupFallbackTimer;
  const showMainWindow = () => {
    if (startupFallbackTimer) {
      clearTimeout(startupFallbackTimer);
      startupFallbackTimer = void 0;
    }
    if (!mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show();
    }
  };
  mainWindow.once("ready-to-show", showMainWindow);
  mainWindow.webContents.once("did-finish-load", showMainWindow);
  mainWindow.webContents.once("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    appendStartupLog(`did-fail-load code=${errorCode} description=${errorDescription} url=${validatedURL}`);
    showMainWindow();
  });
  mainWindow.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    if (level >= 2) {
      appendStartupLog(`renderer-console level=${level} ${sourceId}:${line} ${message}`);
    }
  });
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    appendStartupLog(`render-process-gone reason=${details.reason} exitCode=${details.exitCode}`);
  });
  mainWindow.webContents.on("preload-error", (_event, preloadPathValue, error) => {
    appendStartupLog(`preload-error path=${preloadPathValue} ${error?.stack ?? error?.message ?? String(error)}`);
  });
  startupFallbackTimer = setTimeout(showMainWindow, 1200);
  if (isDev) {
    mainWindow.loadURL("http://127.0.0.1:5173");
  } else if (jiarenLocalServicePort > 0) {
    const tokenQuery = jiarenLocalAuthToken ? `?jiaren_token=${encodeURIComponent(jiarenLocalAuthToken)}` : "";
    const jiarenAppUrl = `http://127.0.0.1:${jiarenLocalServicePort}/${tokenQuery}`;
    appendStartupLog(`renderer-http=${jiarenAppUrl}`);
    void mainWindow.loadURL(jiarenAppUrl).catch((error) => {
      appendStartupLog(`loadURL-error ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      void mainWindow.loadFile(rendererIndexPath);
    });
  } else {
    void mainWindow.loadFile(rendererIndexPath).catch((error) => {
      appendStartupLog(`loadFile-error ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      void mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent("<h2>Jiaren AI ����ʧ��</h2><p>��鿴 startup.log��</p>")}`);
    });
  }
}
function defaultPreferences() {
  return {
    runtimeSettings: {
      global: {
        baseUrl: "",
        apiKey: "",
        fallbackBaseUrl: "",
        fallbackApiKey: "",
        apiUserId: ""
      },
      models: []
    },
    storageSettings: {
      downloadsDir: defaultDownloadsDir,
      cacheDir: defaultCacheDir,
      autoSaveEnabled: false,
      autoSaveMinutes: 5
    },
    ui: {
      themeMode: "light",
      zoomPercent: 100,
      historyOpen: false,
      agentOpen: false,
      language: "zh",
      videoStudioOpen: false,
      jiarenCanvasModeOpen: false,
      rongtuStudioOpen: false,
      comfyWorkflowStudioOpen: false,
      masterToolkitOpen: false,
      aiDirectorOpen: false,
      projectName: defaultProjectName
    }
  };
}
function salvagePreferencesFromText(raw) {
  const defaults = defaultPreferences();
  const readJsonString = (name) => {
    const match = raw.match(new RegExp(`"${name}"\\s*:\\s*"((?:\\\\.|[^"])*)"`));
    if (!match) {
      return "";
    }
    try {
      return JSON.parse(`"${match[1]}"`);
    } catch {
      return match[1];
    }
  };
  const fallbackApiKey = readJsonString("fallbackApiKey");
  const apiKey = readJsonString("apiKey");
  const key = fallbackApiKey || apiKey;
  const fallbackBaseUrl = readJsonString("fallbackBaseUrl");
  const baseUrl = readJsonString("baseUrl");
  const apiUserId = readJsonString("apiUserId");
  const candidateBaseUrl = fallbackBaseUrl || baseUrl;
  return {
    ...defaults,
    runtimeSettings: {
      ...defaults.runtimeSettings,
      global: {
        baseUrl: normalizeUserBaseUrl(candidateBaseUrl),
        apiKey: key,
        fallbackBaseUrl: normalizeUserBaseUrl(candidateBaseUrl),
        fallbackApiKey: key,
        apiUserId
      }
    }
  };
}
function readPreferencesFromPath(targetPath) {
  try {
    const raw = (0, node_fs_1.readFileSync)(targetPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    try {
      return salvagePreferencesFromText((0, node_fs_1.readFileSync)(targetPath, "utf-8"));
    } catch {
      return void 0;
    }
  }
}
function preferencesApiKey(preferences) {
  const global = preferences?.runtimeSettings?.global;
  const globalKey = cleanApiKey(global?.fallbackApiKey, global?.apiKey);
  if (globalKey) {
    return globalKey;
  }
  const models = preferences?.runtimeSettings?.models;
  if (!Array.isArray(models)) {
    return "";
  }
  for (const model of models) {
    if (!isRecord(model)) {
      continue;
    }
    const modelKey = cleanApiKey(typeof model.fallbackApiKey === "string" ? model.fallbackApiKey : void 0, typeof model.apiKey === "string" ? model.apiKey : void 0);
    if (modelKey) {
      return modelKey;
    }
  }
  return "";
}
function addPreferenceCandidatesForRoot(candidates, root) {
  if (!root) {
    return;
  }
  const normalizedRoot = node_path_1.default.resolve(root);
  for (const relativePath of [
    "preferences.json",
    node_path_1.default.join(".jiaren", "preferences.json"),
    node_path_1.default.join("win-unpacked", "preferences.json"),
    node_path_1.default.join("win-unpacked", ".jiaren", "preferences.json")
  ]) {
    candidates.add(node_path_1.default.join(normalizedRoot, relativePath));
  }
}
function addSiblingPreferenceCandidates(candidates, root) {
  if (!root || !(0, node_fs_1.existsSync)(root)) {
    return;
  }
  try {
    for (const entry of (0, node_fs_1.readdirSync)(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }
      if (/^(node_modules|dist|dist-electron|build)$/i.test(entry.name)) {
        continue;
      }
      addPreferenceCandidatesForRoot(candidates, node_path_1.default.join(root, entry.name));
    }
  } catch {
  }
}
function knownPreferenceCandidatePaths() {
  const candidates = /* @__PURE__ */ new Set();
  let cursor = node_path_1.default.resolve(portableRoot);
  for (let depth = 0; depth < 6; depth += 1) {
    addPreferenceCandidatesForRoot(candidates, cursor);
    addSiblingPreferenceCandidates(candidates, cursor);
    const parent = node_path_1.default.dirname(cursor);
    if (parent === cursor) {
      break;
    }
    cursor = parent;
  }
  addPreferenceCandidatesForRoot(candidates, process.cwd());
  addSiblingPreferenceCandidates(candidates, process.cwd());
  try {
    addPreferenceCandidatesForRoot(candidates, node_path_1.default.join(electron_1.app.getPath("documents"), "jiareAI���߻���", "release", "win-unpacked"));
    addPreferenceCandidatesForRoot(candidates, node_path_1.default.join(electron_1.app.getPath("documents"), "jiareAI���߻���"));
  } catch {
  }
  const currentPath = node_path_1.default.resolve(preferencesPath);
  return Array.from(candidates).map((candidate) => node_path_1.default.resolve(candidate)).filter((candidate, index, array) => candidate !== currentPath && array.indexOf(candidate) === index && (0, node_fs_1.existsSync)(candidate));
}
function findLegacyPreferencesWithApiKey() {
  let best;
  for (const candidate of knownPreferenceCandidatePaths()) {
    const preferences = readPreferencesFromPath(candidate);
    if (!preferencesApiKey(preferences)) {
      continue;
    }
    let modifiedAt = 0;
    try {
      modifiedAt = (0, node_fs_1.statSync)(candidate).mtimeMs;
    } catch {
      modifiedAt = 0;
    }
    if (!best || modifiedAt > best.modifiedAt) {
      best = { modifiedAt, preferences: preferences ?? {} };
    }
  }
  return best?.preferences;
}
function migrateMissingApiKey(preferences) {
  if (preferencesApiKey(preferences)) {
    return preferences;
  }
  const legacy = findLegacyPreferencesWithApiKey();
  const legacyKey = preferencesApiKey(legacy);
  if (!legacyKey) {
    return preferences;
  }
  const currentGlobal = preferences.runtimeSettings?.global;
  const legacyGlobal = legacy?.runtimeSettings?.global;
  return {
    ...preferences,
    runtimeSettings: {
      ...preferences.runtimeSettings,
      global: {
        ...currentGlobal,
        baseUrl: normalizeUserBaseUrl(currentGlobal?.baseUrl || legacyGlobal?.baseUrl),
        apiKey: legacyKey,
        fallbackBaseUrl: normalizeUserBaseUrl(currentGlobal?.fallbackBaseUrl || legacyGlobal?.fallbackBaseUrl),
        fallbackApiKey: legacyKey,
        apiUserId: currentGlobal?.apiUserId || legacyGlobal?.apiUserId || ""
      },
      models: preferences.runtimeSettings?.models ?? legacy?.runtimeSettings?.models ?? []
    }
  };
}
function readPreferences() {
  try {
    ensureLocalRoots();
    if (!(0, node_fs_1.existsSync)(preferencesPath)) {
      return migrateMissingApiKey(defaultPreferences());
    }
    return migrateMissingApiKey(readPreferencesFromPath(preferencesPath) ?? defaultPreferences());
  } catch {
    try {
      return migrateMissingApiKey((0, node_fs_1.existsSync)(preferencesPath) ? salvagePreferencesFromText((0, node_fs_1.readFileSync)(preferencesPath, "utf-8")) : defaultPreferences());
    } catch {
      return migrateMissingApiKey(defaultPreferences());
    }
  }
}
function ensureValidPreferencesFile() {
  ensureLocalRoots();
  const current = readPreferences();
  const normalized = normalizePreferencesForDisk(defaultPreferences(), current);
  const serialized = JSON.stringify(normalized, null, 2);
  try {
    if ((0, node_fs_1.existsSync)(preferencesPath)) {
      JSON.parse((0, node_fs_1.readFileSync)(preferencesPath, "utf-8"));
    }
  } catch {
    (0, node_fs_1.writeFileSync)(preferencesPath, serialized, "utf-8");
    return;
  }
  if (!(0, node_fs_1.existsSync)(preferencesPath)) {
    (0, node_fs_1.writeFileSync)(preferencesPath, serialized, "utf-8");
  }
}
function isAllowedApiMartBaseUrl(value) {
  if (!value?.trim()) {
    return false;
  }
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
function normalizeUserBaseUrl(value) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return "";
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmed.replace(/\/+$/, "") : "";
  } catch {
    return "";
  }
}
function cleanApiKey(...values) {
  return values.map((value) => value?.trim() ?? "").find(Boolean) ?? "";
}
function cleanText(value, fallback = "", max = 200) {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  if (trimmed.includes("�") || /[\uE000-\uF8FF]/.test(trimmed) || /[��������无线�布]/.test(trimmed)) {
    return fallback;
  }
  return trimmed.slice(0, max);
}
function cleanModelPromptText(value, fallback = "", max = 6200) {
  if (typeof value !== "string") {
    return fallback;
  }
  const cleaned = value.replace(/\uFFFD/g, "").replace(/锟斤拷/g, "").replace(/锟/g, "").replace(/[\uE000-\uF8FF]/g, "").replace(/[ \t]{2,}/g, " ").replace(/\n{4,}/g, "\n\n\n").trim();
  return (cleaned || fallback).slice(0, max);
}
function isDataUrl(value) {
  return typeof value === "string" && value.startsWith("data:");
}
function cleanPersistedImageSource(value, localPath) {
  if (typeof value !== "string") {
    return void 0;
  }
  if (localPath && isDataUrl(value)) {
    return localPath;
  }
  if (isDataUrl(value) && value.length > 22e4) {
    return void 0;
  }
  return value;
}
function cleanUiPreferences(value) {
  const defaults = defaultPreferences().ui;
  const themeMode = "light";
  const projectName = cleanText(value?.projectName, defaultProjectName, 80);
  return {
    themeMode,
    language: value?.language === "en" ? "en" : "zh",
    zoomPercent: typeof value?.zoomPercent === "number" && Number.isFinite(value.zoomPercent) ? Math.min(200, Math.max(40, Math.round(value.zoomPercent))) : defaults.zoomPercent,
    historyOpen: typeof value?.historyOpen === "boolean" ? value.historyOpen : defaults.historyOpen,
    agentOpen: typeof value?.agentOpen === "boolean" ? value.agentOpen : defaults.agentOpen,
    videoStudioOpen: false,
    jiarenCanvasModeOpen: false,
    rongtuStudioOpen: false,
    comfyWorkflowStudioOpen: false,
    masterToolkitOpen: false,
    aiDirectorOpen: false,
    projectName: projectName.endsWith("?") ? defaultProjectName : projectName
  };
}
function cleanHistory(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item) => isRecord(item)).map((item) => ({
    id: cleanText(item.id, node_crypto_1.default.randomUUID(), 80),
    createdAt: cleanText(item.createdAt, (/* @__PURE__ */ new Date()).toISOString(), 60),
    modelAlias: cleanText(item.modelAlias, "������ API", 80),
    modelId: cleanText(item.modelId, "third-party-api", 120),
    prompt: cleanText(item.prompt, "", 1e3),
    elapsedMs: typeof item.elapsedMs === "number" && Number.isFinite(item.elapsedMs) ? Math.max(0, Math.round(item.elapsedMs)) : 0,
    thumbnail: cleanPersistedImageSource(item.thumbnail, typeof item.localPath === "string" ? item.localPath : void 0),
    localPath: typeof item.localPath === "string" ? item.localPath : void 0,
    width: typeof item.width === "number" && Number.isFinite(item.width) ? item.width : void 0,
    height: typeof item.height === "number" && Number.isFinite(item.height) ? item.height : void 0,
    status: ["idle", "queued", "running", "succeeded", "failed", "cancelled"].includes(String(item.status)) ? item.status : "succeeded",
    assetType: ["image", "video", "audio", "text"].includes(String(item.assetType)) ? item.assetType : void 0,
    durationMs: typeof item.durationMs === "number" && Number.isFinite(item.durationMs) ? item.durationMs : void 0,
    message: cleanText(item.message, "", 400) || void 0
  })).slice(0, 48);
}
function cleanModelOverrides(models) {
  if (!Array.isArray(models)) {
    return [];
  }
  const cleanedById = /* @__PURE__ */ new Map();
  const mergeCleaned = (incoming) => {
    const current = cleanedById.get(incoming.id);
    if (!current) {
      cleanedById.set(incoming.id, incoming);
      return;
    }
    cleanedById.set(incoming.id, {
      ...current,
      enabled: current.enabled || incoming.enabled,
      status: incoming.status === "success" ? incoming.status : current.status,
      lastMessage: incoming.lastMessage ?? current.lastMessage,
      baseUrl: incoming.baseUrl || current.baseUrl,
      apiKey: incoming.apiKey || current.apiKey,
      fallbackBaseUrl: incoming.fallbackBaseUrl || current.fallbackBaseUrl,
      fallbackApiKey: incoming.fallbackApiKey || current.fallbackApiKey,
      providerSource: incoming.providerSource || current.providerSource
    });
  };
  const isDynamicProviderModel = (id) => id.startsWith("provider-");
  const inferRequestMode = (category) => {
    if (category === "image")
      return "openai-image";
    if (category === "video")
      return "openai-video";
    if (category === "chat")
      return "openai-chat";
    return "unknown";
  };
  models.filter((item) => isRecord(item)).forEach((item) => {
    const baseUrl = normalizeUserBaseUrl(typeof item.baseUrl === "string" ? item.baseUrl : void 0) || void 0;
    const fallbackBaseUrl = normalizeUserBaseUrl(typeof item.fallbackBaseUrl === "string" ? item.fallbackBaseUrl : void 0) || void 0;
    const rawId = cleanText(item.id, "", 160);
    const normalizedId = normalizeRuntimeModelKey(rawId) ?? rawId;
    const dynamicProviderModel = isDynamicProviderModelId(rawId || normalizedId);
    const meta = dynamicProviderModel ? void 0 : builtInModelMeta[normalizedId];
    const endpointModelId = cleanText(item.endpointModelId, "", 160);
    const fallbackEndpointModelId = cleanText(item.fallbackEndpointModelId, "", 160);
    const rawCategory = String(item.category);
    const category = ["chat", "image", "video", "music", "tools"].includes(rawCategory) ? rawCategory : "image";
    if (!normalizedId || !meta && !dynamicProviderModel) {
      return;
    }
    mergeCleaned({
      id: normalizedId,
      alias: meta?.alias ?? cleanText(item.alias, "", 120) ?? endpointModelId ?? normalizedId,
      modelId: meta ? normalizedId : cleanText(item.modelId, endpointModelId || normalizedId, 160),
      endpointModelId: meta?.endpointModelId ?? endpointModelId ?? cleanText(item.modelId, "", 160) ?? normalizedId,
      fallbackEndpointModelId: meta?.fallbackEndpointModelId ?? (fallbackEndpointModelId || void 0),
      apiGroup: meta?.apiGroup ?? (item.apiGroup === "a2" ? "a2" : item.apiGroup === "a1" ? "a1" : item.apiGroup === "apilio" ? "apilio" : void 0),
      category,
      provider: cleanText(item.provider, "", 80) || void 0,
      providerSource: cleanText(item.providerSource, "", 120) || meta?.apiGroup || cleanText(item.apiGroup, "", 80) || cleanText(item.provider, "", 80) || "user-configured",
      icon: cleanText(item.icon, "", 80) || void 0,
      requestMode: meta?.requestMode ?? (["openai-image", "gemini-image", "openai-chat", "gemini-chat", "openai-video", "unknown"].includes(String(item.requestMode)) ? item.requestMode : inferRequestMode(category)),
      baseUrl,
      apiKey: cleanApiKey(item.apiKey),
      fallbackBaseUrl,
      fallbackApiKey: cleanApiKey(item.fallbackApiKey),
      enabled: typeof item.enabled === "boolean" ? item.enabled : true,
      status: "untested",
      lastMessage: void 0
    });
  });
  return Array.from(cleanedById.values());
}
function normalizePreferencesForDisk(current, incoming = {}) {
  const defaults = defaultPreferences();
  const currentGlobal = current.runtimeSettings?.global;
  const incomingGlobal = incoming.runtimeSettings?.global;
  const apiKey = cleanApiKey(incomingGlobal?.fallbackApiKey, incomingGlobal?.apiKey, currentGlobal?.fallbackApiKey, currentGlobal?.apiKey);
  const apiUserId = cleanText(incomingGlobal?.apiUserId, cleanText(currentGlobal?.apiUserId, "", 120), 120);
  const incomingStorage = incoming.storageSettings ?? {};
  const currentStorage = current.storageSettings ?? {};
  return {
    ...defaults,
    storageSettings: {
      ...defaults.storageSettings,
      ...currentStorage,
      ...incomingStorage,
      downloadsDir: cleanText(incomingStorage.downloadsDir, cleanText(currentStorage.downloadsDir, defaultDownloadsDir, 500), 500),
      cacheDir: cleanText(incomingStorage.cacheDir, cleanText(currentStorage.cacheDir, defaultCacheDir, 500), 500),
      autoSaveEnabled: typeof incomingStorage.autoSaveEnabled === "boolean" ? incomingStorage.autoSaveEnabled : Boolean(currentStorage.autoSaveEnabled ?? defaults.storageSettings.autoSaveEnabled),
      autoSaveMinutes: typeof incomingStorage.autoSaveMinutes === "number" && Number.isFinite(incomingStorage.autoSaveMinutes) ? Math.max(1, Math.min(120, Math.round(incomingStorage.autoSaveMinutes))) : currentStorage.autoSaveMinutes ?? defaults.storageSettings.autoSaveMinutes
    },
    runtimeSettings: {
      global: {
        baseUrl: normalizeUserBaseUrl(incomingGlobal?.baseUrl ?? currentGlobal?.baseUrl),
        apiKey,
        fallbackBaseUrl: normalizeUserBaseUrl(incomingGlobal?.fallbackBaseUrl ?? currentGlobal?.fallbackBaseUrl),
        fallbackApiKey: apiKey,
        apiUserId
      },
      models: cleanModelOverrides(incoming.runtimeSettings?.models ?? current.runtimeSettings?.models)
    },
    ui: cleanUiPreferences({ ...current.ui, ...incoming.ui }),
    history: cleanHistory(incoming.history ?? current.history)
  };
}
function savePreferences(preferences) {
  try {
    ensureLocalRoots();
    const current = readPreferences();
    const next = normalizePreferencesForDisk(current, preferences);
    const tempPath = `${preferencesPath}.tmp`;
    const serialized = JSON.stringify(next, null, 2);
    JSON.parse(serialized);
    (0, node_fs_1.writeFileSync)(tempPath, serialized, "utf-8");
    (0, node_fs_1.renameSync)(tempPath, preferencesPath);
    return { ok: true, path: preferencesPath };
  } catch (error) {
    const message = error instanceof Error ? error.message : "��������ʧ�ܡ�";
    return { ok: false, message };
  }
}
function findAppIcon() {
  const devIcon = node_path_1.default.join(process.cwd(), "src", "assets", "jiaren-icon.jpg");
  if ((0, node_fs_1.existsSync)(devIcon)) {
    return devIcon;
  }
  const assetsDir = node_path_1.default.join(__dirname, "../../dist/assets");
  if ((0, node_fs_1.existsSync)(assetsDir)) {
    const latestIcon = node_path_1.default.join(assetsDir, "jiaren-icon-latest.png");
    if ((0, node_fs_1.existsSync)(latestIcon)) {
      return latestIcon;
    }
    const iconFile = (0, node_fs_1.readdirSync)(assetsDir).find((fileName) => /^jiaren-icon-.*\.(jpg|png|ico)$/i.test(fileName));
    if (iconFile) {
      return node_path_1.default.join(assetsDir, iconFile);
    }
  }
  return "";
}
function normalizeOpenAICompatibleBaseUrl(baseUrl) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    url.search = "";
    url.hash = "";
    const pathname = url.pathname.replace(/\/+$/, "");
    if (/\/v1\/models(?:\/[^/]*)?$/i.test(pathname)) {
      url.pathname = pathname.replace(/\/v1\/models(?:\/[^/]*)?$/i, "/v1");
    } else if (/\/models(?:\/[^/]*)?$/i.test(pathname)) {
      url.pathname = pathname.replace(/\/models(?:\/[^/]*)?$/i, "") || "/";
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return trimmed.replace(/\/v1\/models(?:\/[^/?#]*)?$/i, "/v1").replace(/\/models(?:\/[^/?#]*)?$/i, "");
  }
}
const GRSAI_IMAGE_MODEL_IDS = [
  "nano-banana",
  "nano-banana-fast",
  "nano-banana-2",
  "nano-banana-2-cl",
  "nano-banana-2-2k-cl",
  "nano-banana-2-4k-cl",
  "nano-banana-pro",
  "nano-banana-pro-vt",
  "nano-banana-pro-cl",
  "nano-banana-pro-vip",
  "nano-banana-pro-4k-vip",
  "gpt-image-2",
  "gpt-image-2-vip"
];
function isGrsaiBaseUrl(baseUrl) {
  const normalized = normalizeOpenAICompatibleBaseUrl(baseUrl);
  const testBaseUrl = normalizeOpenAICompatibleBaseUrl(process.env.JIAREN_GRSAI_TEST_BASE_URL || "");
  if (testBaseUrl && normalized === testBaseUrl) {
    return true;
  }
  try {
    const hostname = new URL(normalized).hostname.toLowerCase();
    return hostname === "grsaiapi.com" || hostname.endsWith(".grsaiapi.com") || hostname === "grsai.dakka.com.cn" || hostname.endsWith(".grsai.ai");
  } catch {
    return false;
  }
}
function grsaiProviderModelPayload() {
  return {
    data: GRSAI_IMAGE_MODEL_IDS.map((id) => ({
      id,
      owned_by: "grsai",
      supported_endpoint_types: ["image_generation"]
    }))
  };
}
function resolveGrsaiGenerateEndpoint(baseUrl) {
  return resolveProviderRootEndpoint(baseUrl, "/v1/api/generate");
}
function resolveGrsaiResultEndpoint(baseUrl, taskId) {
  const url = new URL(resolveProviderRootEndpoint(baseUrl, "/v1/api/result"));
  url.searchParams.set("id", taskId);
  return url.toString();
}
function normalizeGrsaiTaskId(value) {
  const taskId = readString(value)?.trim();
  if (!taskId || /^(?:undefined|null|none|unknown|false|true|nan)$/i.test(taskId)) return void 0;
  if (taskId.length < 6 || taskId.length > 240 || /\s|^https?:\/\//i.test(taskId)) return void 0;
  return taskId;
}
function extractGrsaiTaskId(payload) {
  if (!isRecord(payload)) return void 0;
  const candidates = [
    payload.id,
    payload.task_id,
    payload.taskId,
    payload.job_id,
    payload.jobId,
    payload.request_id,
    isRecord(payload.data) ? payload.data.id : void 0,
    isRecord(payload.data) ? payload.data.task_id : void 0,
    isRecord(payload.data) ? payload.data.taskId : void 0,
    isRecord(payload.result) ? payload.result.id : void 0,
    isRecord(payload.result) ? payload.result.task_id : void 0,
    isRecord(payload.result) ? payload.result.taskId : void 0,
    extractTaskId(payload),
  ];
  for (const candidate of candidates) {
    const taskId = normalizeGrsaiTaskId(candidate);
    if (taskId) return taskId;
  }
  return void 0;
}
function resolveEndpoint(baseUrl, endpoint) {
  const trimmed = normalizeOpenAICompatibleBaseUrl(baseUrl);
  if (trimmed.endsWith("/v1")) {
    return `${trimmed}${endpoint}`;
  }
  return `${trimmed}/v1${endpoint}`;
}
function resolveA2ImageEndpoint(baseUrl) {
  return resolveEndpoint(baseUrl, "/images/generations");
}
function resolveA2ImageEditEndpoint(baseUrl) {
  return resolveEndpoint(baseUrl, "/images/edits");
}
function resolveA2ImageChatEndpoint(baseUrl) {
  return resolveEndpoint(baseUrl, "/chat/completions");
}
function resolveModelsEndpoint(baseUrl, category) {
  const endpoint = resolveEndpoint(baseUrl, "/models");
  if (!category) {
    return endpoint;
  }
  const url = new URL(endpoint);
  url.searchParams.set("type", category === "tools" ? "all" : category === "music" ? "audio" : category);
  return url.toString();
}
function resolveAllModelsEndpoint(baseUrl) {
  const url = new URL(resolveEndpoint(baseUrl, "/models"));
  url.searchParams.set("type", "all");
  return url.toString();
}
function balanceEndpoints(baseUrl, kind) {
  const path = kind === "token" ? "/balance" : "/user/balance";
  return Array.from(new Set([
    resolveEndpoint(baseUrl, path),
    resolveProviderRootEndpoint(baseUrl, `/v1${path}`),
    kind === "token" ? resolveEndpoint(baseUrl, "/token/quota") : "",
    kind === "user" ? resolveProviderRootEndpoint(baseUrl, "/api/user/self") : ""
  ].filter((value) => Boolean(value))));
}
function resolveProviderRootEndpoint(baseUrl, endpoint) {
  const root = normalizeOpenAICompatibleBaseUrl(baseUrl).replace(/\/+$/, "").replace(/\/v1$/i, "");
  return `${root}${endpoint}`;
}
function uniqueUploadEndpoints(baseUrl) {
  return Array.from(/* @__PURE__ */ new Set([
    resolveEndpoint(baseUrl, "/files"),
    resolveProviderRootEndpoint(baseUrl, "/v1/files"),
    resolveEndpoint(baseUrl, "/uploads/images"),
    resolveProviderRootEndpoint(baseUrl, "/v1/uploads/images"),
    resolveProviderRootEndpoint(baseUrl, "/upload/image")
  ]));
}
function resolveRawEndpoint(baseUrl, fallback) {
  return baseUrl.trim() || fallback;
}
function resolveGeminiEndpoint(baseUrl, modelId, action) {
  const trimmed = baseUrl.replace(/\/+$/, "").replace(/\/v1beta$/, "").replace(/\/v1$/, "");
  return `${trimmed}/v1beta/models/${modelId}:${action}`;
}
function resolveGeminiKeyEndpoint(baseUrl, modelId, apiKey, action) {
  const url = new URL(resolveGeminiEndpoint(baseUrl, modelId, action));
  url.searchParams.set("key", apiKey);
  return url.toString();
}
function geminiHeaders(apiKey) {
  void apiKey;
  return {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
}
function apiAttempts(request) {
  const primary = {
    baseUrl: request.baseUrl.trim(),
    apiKey: request.apiKey.trim(),
    apiUserId: request.apiUserId?.trim(),
    endpointModelId: request.endpointModelId?.trim(),
    sourceId: request.providerSource?.trim() || request.apiGroup?.trim() || "primary",
    label: "主接口"
  };
  const attempts = primary.baseUrl && primary.apiKey ? [primary] : [];
  const fallbackBaseUrl = request.fallbackBaseUrl?.trim();
  if (fallbackBaseUrl && fallbackBaseUrl !== primary.baseUrl) {
    attempts.push({
      baseUrl: fallbackBaseUrl,
      apiKey: request.fallbackApiKey?.trim() || primary.apiKey,
      apiUserId: request.apiUserId?.trim(),
      endpointModelId: request.fallbackEndpointModelId?.trim() || primary.endpointModelId,
      sourceId: request.fallbackProviderSource?.trim() || `${primary.sourceId}:fallback`,
      label: "备用接口"
    });
  }
  return attempts;
}
function parseResponsePayload(text) {
  if (!text.trim()) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
function normalizePersistedPreferences(preferences) {
  return normalizePreferencesForDisk(defaultPreferences(), preferences);
}
function clipped(value, max = 600) {
  return value.trim().slice(0, max);
}
function payloadMessage(payload, fallbackText = "", max = 600) {
  const fromPayload = (() => {
    if (!isRecord(payload)) {
      return void 0;
    }
    const nodeErrors = summarizeComfyNodeErrors(payload.node_errors);
    if (nodeErrors) {
      return nodeErrors;
    }
    if (isRecord(payload.error)) {
      return [readString(payload.error.message), nodeErrors].filter(Boolean).join("��") || readString(payload.error.type) || readString(payload.error.code);
    }
    return readString(payload.message) || readString(payload.error) || readString(payload.detail);
  })();
  return clipped(fromPayload || fallbackText, max);
}
function summarizeComfyNodeErrors(value) {
  if (!isRecord(value)) {
    return void 0;
  }
  const parts = [];
  for (const [nodeId, nodeError] of Object.entries(value)) {
    if (!isRecord(nodeError)) {
      continue;
    }
    const classType = readString(nodeError.class_type) || "�ڵ�";
    const errors = Array.isArray(nodeError.errors) ? nodeError.errors : [];
    for (const error of errors) {
      if (!isRecord(error)) {
        continue;
      }
      const message = readString(error.message) || readString(error.type) || "У��ʧ��";
      const details = readString(error.details);
      parts.push(`${classType}(${nodeId}) ${message}${details ? `��${details}` : ""}`);
    }
  }
  return parts.length ? parts.join("��") : void 0;
}
function providerPayloadMessage(payload, fallbackText = "", max = 700) {
  const direct = payloadMessage(payload, fallbackText, max);
  if (direct) {
    return direct;
  }
  const failure = taskFailureReason(payload);
  if (failure) {
    return clipped(failure, max);
  }
  if (fallbackText.trim()) {
    return clipped(fallbackText, max);
  }
  return "";
}
function isExplicitQuotaFailure(message) {
  return /insufficient[_\s-]?(?:quota|balance|credits)|quota[_\s-]?is[_\s-]?not[_\s-]?enough|余额不足|额度不足|积分不足|预扣.*(?:失败|额度)|剩余.*(?:额度|余额)|需要.*预扣|not enough credits|not enough balance|balance not enough|remaining.*(?:credits|balance)/i.test(message);
}
function explainProviderFailure(status, payload, text = "") {
  const message = providerPayloadMessage(payload, text, 500) || `HTTP ${status}`;
  if (/image_unsafe|unsafe|safety|内容安全|安全策略/i.test(message)) {
    return `接口安全策略拒绝了这次图片生成。请更换参考图，或把提示词改成原创角色/原创场景描述。原始返回：${message}`;
  }
  if (/没有可用token|没[有|可].*token|no available token|GPTImage2Relay|call upstream API failed/i.test(message)) {
    return `上游图像模型暂时没有可用通道，请稍后重试，或切换到 Nano Banana 2 / Nano Banana PRO。原始返回：${message}`;
  }
  if (status === 401) {
    return `当前接口认证未通过，请检查 Base URL、密钥是否匹配该接口；软件没有改动你的密钥。原始返回：${message}`;
  }
  if (status === 402 || isExplicitQuotaFailure(message)) {
    return `当前 API 余额或额度不足：${message}`;
  }
  if (status === 403) {
    return `当前接口账号未开通这个模型或权限不足，请重新读取模型列表后选择真实可用模型；软件没有改动你的密钥。原始返回：${message}`;
  }
  if (status === 503 || /ChannelCapability|SKU|model unavailable|path unsupported|unsupported|not support|route|path|未开通|未开放|不可用|不支持|路径|路由/i.test(message)) {
    return `当前模型或接口路径不可用，请在 API 设置里重新读取模型，选择该接口真实返回的可用模型后重试；软件没有改动你的密钥。原始返回：${message}`;
  }
  if (status === 404 || /model_not_found|not found|未找到/i.test(message)) {
    return `当前接口没有找到这个模型或路径，请重新读取模型列表后选择可用模型。原始返回：${message}`;
  }
  if (status === 422 || /invalid|validation|schema|参数|格式|WIDTHxHEIGHT|size/i.test(message)) {
    return `接口拒绝了当前参数，请检查尺寸、清晰度、参考图或模型参数是否匹配。原始返回：${message}`;
  }
  return message;
}
function explainProviderFailureClean(status, payload, text = "") {
  const message = providerPayloadMessage(payload, text, 700) || `HTTP ${status}`;
  if (status === 400 && /prompt.*required|required.*prompt|missing.*prompt/i.test(message)) {
    return `视频接口没有收到有效 prompt。软件已补齐分镜提示词；如果再次失败，请重新读取模型列表并选择真实可用的视频模型。原始返回：${message}`;
  }
  if (status === 401) {
    return `接口认证未通过，请检查 Base URL 和 API Key 是否匹配。原始返回：${message}`;
  }
  if (status === 402 || isExplicitQuotaFailure(message)) {
    return `当前 API 余额或额度不足：${message}`;
  }
  if (status === 403) {
    return `当前账号未开通该模型或权限不足，请重新读取模型列表后选择可用模型。原始返回：${message}`;
  }
  if (status === 404) {
    return `当前接口路径或模型 ID 不匹配，请重新读取模型列表后选择可用模型。原始返回：${message}`;
  }
  if (status === 422 || /invalid|validation|schema|parameter|WIDTHxHEIGHT|size/i.test(message)) {
    return `接口拒绝了当前参数，请检查时长、画幅、清晰度、参考图或模型参数是否匹配。原始返回：${message}`;
  }
  if (status === 503 || /ChannelCapability|SKU|model unavailable|path unsupported|unsupported|not support|route|path|model_not_found|not found/i.test(message)) {
    return `当前模型或接口路径不可用，请重新读取模型列表后选择该接口真实返回的可用模型。原始返回：${message}`;
  }
  return message;
}
function readableFetchError(error) {
  if (!(error instanceof Error)) {
    return "未知网络错误";
  }
  if (/abort/i.test(error.name) || /abort/i.test(error.message)) {
    return "请求超时";
  }
  return error.message;
}
function isRecoverableGenerationSubmitError(message) {
  return /生成提交后连接中断|fetch failed|network|ECONN|ETIMEDOUT|ENOTFOUND|socket|超时|timeout|aborted|abort/i.test(message) && !/上传参考图/i.test(message);
}
function canRecoverImageSubmission(request, requestMode) {
  void requestMode;
  return isProviderBaseUrl(request.baseUrl);
}
function recoverableImageSubmissionPayload(request, message) {
  const clientBusinessId = requestBusinessId(request);
  return {
    id: clientBusinessId,
    task_id: clientBusinessId,
    client_business_id: clientBusinessId,
    status: "queued",
    message: `图片任务可能已提交，但网络在回传结果时中断。我已保留任务 ID，稍后可继续追踪结果。${message}`
  };
}
function explainAsyncTaskFailure(message) {
  if (!message) {
    return void 0;
  }
  if (/image_unsafe|unsafe|safety|内容安全|安全策略/i.test(message)) {
    return `接口安全策略拒绝了这次图片生成。请更换参考图，或把提示词改成原创角色/原创场景描述。原始返回：${message}`;
  }
  return message;
}
async function fetchJsonTextWithFallback(attempts, buildUrl, init) {
  const failures = [];
  if (attempts.length === 0) {
    throw new Error("请先在 API 设置里填写当前模型的 Base URL 和 API Key。");
  }
  for (const attempt of attempts) {
    try {
      const response = await fetch(buildUrl(attempt), await init(attempt));
      const text = await response.text();
      const payload = parseResponsePayload(text);
      if (response.ok) {
        return { response, text, payload, attempt };
      }
      const message = isProviderBaseUrl(attempt.baseUrl) ? explainProviderFailureClean(response.status, payload, text) : payloadMessage(payload, text, 300);
      failures.push(`${attempt.label} HTTP ${response.status}${message ? `：${message}` : ""}`);
    } catch (error) {
      failures.push(`${attempt.label} ${readableFetchError(error)}`);
    }
  }
  throw new Error(failures.join("；"));
}
function withFallbackMessage(message, attempt) {
  return attempt.label === "备用接口" ? `${message}（已自动切换到备用接口）` : message;
}
function cleanUiRuntimeMessage(message) {
  const raw = String(message ?? "").trim();
  if (!raw) {
    return void 0;
  }
  if (/\u9884\u6263.*\u5931\u8d25|\u5269\u4f59.*(?:\u989d\u5ea6|\u4f59\u989d)|insufficient[_\s-]?(?:quota|balance|credits)|not enough (?:balance|credits)/i.test(raw)) {
    const remaining = raw.match(/\u5269\u4f59(?:\u989d\u5ea6|\u4f59\u989d)[^\d-]*(-?\d+(?:\.\d+)?)/i)?.[1];
    const required = raw.match(/\u9700\u8981\u9884\u6263(?:\u8d39)?(?:\u989d\u5ea6)?[^\d-]*(-?\d+(?:\.\d+)?)/i)?.[1];
    const detail = remaining && required ? `\u5f53\u524d\u5269\u4f59\u989d\u5ea6 ${remaining}\uff0c\u672c\u6b21\u9700\u8981\u9884\u6263 ${required}\u3002` : "\u5f53\u524d API \u4f59\u989d\u6216\u989d\u5ea6\u4e0d\u8db3\u3002";
    return `${detail}\u8bf7\u5145\u503c\u6216\u9009\u62e9\u8d39\u7528\u66f4\u4f4e\u7684\u56fe\u7247\u6a21\u578b\u540e\u91cd\u8bd5\u3002`;
  }
  if (/prompt\s+is\s+required|prompt.*required|required.*prompt|missing.*prompt|HTTP\s*400/i.test(raw) && /video|视频|\/video\/generations|\/pixverse\/v1\/pro\/generate/i.test(raw)) {
    return "视频接口没有收到有效提示词。我已经在生成请求里补齐分镜提示词，请重新生成；如果仍失败，请在 API 设置里重新读取模型列表，选择真实可用的视频模型。";
  }
  if (/https?:\/\/[^\s]+\/v1\/video\/generations/i.test(raw) && /400/i.test(raw)) {
    return "视频接口拒绝了这次请求。我已经隐藏底层接口地址，请重新读取模型列表后选择可用视频模型，再重新生成。";
  }
  if (/WIDTHxHEIGHT|WITHXHEIGHT|invalid size|unsupported size|size.*format|尺寸|宽高/i.test(raw)) {
    return "图片尺寸参数不匹配，已改为模型支持的标准尺寸，请重新生成。";
  }
  if (/no available token|GPTImage2Relay|call upstream API failed|upstream|token/i.test(raw)) {
    return "上游图像模型暂时没有可用通道，请稍后重试，或切换到 Nano Banana 2 / Nano Banana PRO。";
  }
  if (/ChannelCapability|SKU|model unavailable|model_not_found|path unsupported|unsupported|not support|not found|route|path|404|503|未开通|不可用|不支持/i.test(raw)) {
    return "当前模型或接口路径不可用，请在 API 设置里重新读取模型，选择该接口真实返回的可用模型后重试。";
  }
  if (/rate limit|too many|429|busy|temporar|overload|timeout|系统繁忙|限流|繁忙|超时/i.test(raw)) {
    return "上游模型临时繁忙或限流，请稍后重试。";
  }
  if (/�|锟|鏃|鐢|诧|斤拷|ͼƬ|��|����|Ƶ|ӿ|ģ|δ֪|�첽/i.test(raw)) {
    return "接口返回了不可读错误信息，请检查当前模型是否在该 API 账号下可用，或重新读取模型列表后再试。";
  }
  return raw;
}
function withCleanUiMessage(result) {
  if (result?.ok === true && Array.isArray(result.models)) {
    return { ...result, message: `\u5df2\u4ece\u5f53\u524d\u7528\u6237 API \u8bfb\u53d6 ${result.models.length} \u4e2a\u771f\u5b9e\u6a21\u578b\u3002` };
  }
  if (result?.ok === true && (result.token || result.user)) {
    return { ...result, message: "\u5f53\u524d\u7528\u6237 API \u7684\u4f59\u989d\u63a5\u53e3\u53ef\u8bbf\u95ee\uff1b\u6700\u7ec8\u53ef\u7528\u989d\u5ea6\u4ee5\u751f\u6210\u63a5\u53e3\u7684\u5b9e\u65f6\u9884\u6263\u7ed3\u679c\u4e3a\u51c6\u3002" };
  }
  const cleaned = cleanUiRuntimeMessage(result.message);
  return cleaned && cleaned !== result.message ? { ...result, message: cleaned } : result;
}
function requestBusinessId(request) {
  const incoming = request.clientBusinessId?.trim();
  if (incoming) {
    return incoming.slice(0, 120);
  }
  const seed = [
    request.modelId,
    request.endpointModelId,
    request.prompt,
    request.size,
    request.resolution,
    request.aspectRatio,
    request.quality,
    request.count,
    request.referenceImagePaths.join("|"),
    JSON.stringify(request.referenceImages?.map((image) => [image.name, image.localPath, image.url, image.dataUrl?.slice(0, 64)]))
  ].join("\n");
  const generated = `jiaren_${Date.now()}_${node_crypto_1.default.createHash("sha1").update(seed).digest("hex").slice(0, 12)}`;
  request.clientBusinessId = generated;
  return generated;
}
function payloadArrayLength(value) {
  return Array.isArray(value) ? value.length : value ? 1 : 0;
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isApiMartBaseUrl(baseUrl) {
  if (!isAllowedApiMartBaseUrl(baseUrl)) {
    return false;
  }
  try {
    const hostname = new URL(baseUrl.trim()).hostname.toLowerCase();
    return hostname === "api.apilio.ai" || hostname.endsWith(".apilio.ai") || hostname === "ai.comfly.org" || hostname === "api.comfly.org" || hostname === "new.comfly.chat" || hostname.endsWith(".comfly.chat") || hostname === "api.geeknow.top" || hostname.endsWith(".geeknow.top");
  } catch {
    return false;
  }
}
function isProviderBaseUrl(baseUrl) {
  return isApiMartBaseUrl(baseUrl);
}
function isImageResolutionDecoratedModelId(value) {
  const trimmed = value.trim();
  return /(?:^|[-_.])(?:512px|2k|4k)$/i.test(trimmed) && /(gemini.*image|nano[-_]?banana|gpt[-_]?image|seedream|qwen[-_]?image|flux|kontext)/i.test(trimmed);
}
function isGptNanoTextModelId(value) {
  return /^gpt[-_.\s].*nano/i.test(value.trim());
}
function isNanoBananaImageModelId(value) {
  const trimmed = value.trim().toLowerCase();
  return /nano[-_.\s]?banana/.test(trimmed) || /^gemini[-_.]3[-_.]pro[-_.]image[-_.]preview(?:[-_.](?:1k|2k|4k))?(?:[-_.]official)?$/.test(trimmed) || /^gemini[-_.]3(?:[-_.]1|\.)flash[-_.]image[-_.]preview(?:[-_.](?:512px|1k|2k|4k))?(?:[-_.]official)?$/.test(trimmed) || /^gemini[-_.]2(?:[-_.]5|\.)flash[-_.]image(?:[-_.]preview)?(?:[-_.]official)?$/.test(trimmed);
}
function stripImageResolutionSuffix(value) {
  return value.trim().replace(/[-_.](?:512px|2k|4k)$/i, "");
}
function imageGenerationModelId(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (/^gemini-3\.1-flash-image-preview[-_.](?:512px|2k|4k)$/i.test(trimmed)) {
    return "gemini-3.1-flash-image-preview";
  }
  if (/^a2[-_]gemini[-_]3[-_]pro[-_]image[-_]preview(?:[-_.](?:2k|4k))?$/i.test(trimmed)) {
    return "gemini-3-pro-image-preview";
  }
  if (/^gemini[-_]3[-_]pro[-_]image[-_]preview(?:[-_.](?:2k|4k))?$/i.test(trimmed)) {
    return "gemini-3-pro-image-preview";
  }
  if (/^nano[-_]?banana[-_]2[-_]pro$/i.test(trimmed)) {
    return "gemini-3-pro-image-preview";
  }
  if (/^nano[-_]?banana[-_]?pro$/i.test(trimmed)) {
    return "gemini-3-pro-image-preview";
  }
  if (/^nano[-_]?banana[-_]?2$/i.test(trimmed)) {
    return "gemini-3.1-flash-image-preview";
  }
  if (/^nano[-_]?banana$/i.test(trimmed)) {
    return "nano-banana";
  }
  if (/^a2[-_]gemini[-_]3[-.]1[-_]flash[-_]image[-_]preview(?:[-_.](?:512px|2k|4k))?$/i.test(trimmed)) {
    return "gemini-3.1-flash-image-preview";
  }
  if (/^gemini[-_]3[-.]1[-_]flash[-_]image[-_]preview(?:[-_.](?:512px|2k|4k))?$/i.test(trimmed)) {
    return "gemini-3.1-flash-image-preview";
  }
  return isImageResolutionDecoratedModelId(trimmed) ? stripImageResolutionSuffix(trimmed) : trimmed;
}
function imageModelIdForRequest(request, attempt, modelMeta) {
  if (isDynamicProviderModelId(request.modelId)) {
    return attempt?.endpointModelId?.trim() || request.endpointModelId?.trim() || request.modelId;
  }
  return imageGenerationModelId(endpointModelIdForRequest(request, attempt, modelMeta));
}
function apiMartGeminiResolutionEndpointModelId(endpointModelId, resolution, size) {
  void resolution;
  void size;
  return endpointModelId.trim();
}
function withImageEndpointModel(request, endpointModelId) {
  return {
    ...request,
    endpointModelId: endpointModelId.trim(),
    fallbackEndpointModelId: void 0
  };
}
function providerListHasDocumentedImageModel(targetModel, ids) {
  const target = targetModel.trim().toLowerCase();
  return ids.some((id) => id.trim().toLowerCase() === target);
}
function imageFallbackEndpointModels(request, modelMeta) {
  void request;
  void modelMeta;
  return [];
}
function shouldRetrySameImageModel(message) {
  return !/401|403|unauthorized|invalid api key|invalid.*key|key.*invalid|quota|balance|not enough credits|not enough balance/i.test(message);
}
function maxSameImageModelAttempts() {
  const parsed = Number(process.env.JIAREN_IMAGE_SAME_MODEL_RETRIES || 3);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(5, Math.floor(parsed))) : 3;
}
function shouldTryImageFallback(message) {
  return /503|502|504|500|model_not_found|not found|channel|����|δ��ͨ|δ����|δ����|route|·��|SKU|ChannelCapability|temporar|busy|ϵͳ��æ|overload|����|upstream/i.test(message);
}
function readString(value) {
  if (typeof value === "string") {
    return value.trim() ? value : void 0;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return void 0;
}
function readBoolean(value) {
  return typeof value === "boolean" ? value : void 0;
}
function readNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function guessMime(filePath) {
  return mimeByExtension[node_path_1.default.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}
function guessKind(filePath) {
  const mime = guessMime(filePath);
  if (mime.startsWith("image/")) {
    return "image";
  }
  if (mime.startsWith("video/")) {
    return "video";
  }
  if (mime.startsWith("audio/")) {
    return "audio";
  }
  return "other";
}
function safeFileName(name, fallbackExtension = ".png") {
  const parsed = node_path_1.default.parse(name);
  const base = (parsed.name || "asset").replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_").slice(0, 80);
  const ext = parsed.ext || fallbackExtension;
  return `${base}${ext}`;
}
function saveAssetMime(request, parsedData) {
  if (parsedData?.mime) return String(parsedData.mime).split(";")[0].trim().toLowerCase();
  if (request?.localPath && (0, node_fs_1.existsSync)(request.localPath)) return guessMime(request.localPath);
  const explicit = String(request?.mimeType || "").split(";")[0].trim().toLowerCase();
  if (explicit) return explicit;
  const source = String(request?.source || request?.dataUrl || "").trim();
  if (/^https?:\/\//i.test(source)) {
    try { return guessMime(new URL(source).pathname); } catch {}
  }
  return guessMime(String(request?.fileName || ""));
}
function saveAssetFileName(fileName, mimeType) {
  const mime = String(mimeType || "").split(";")[0].trim().toLowerCase();
  const extension = extensionFromMime(mime, "");
  const safe = safeFileName(String(fileName || ("jiaren-asset" + (extension || ".bin"))), extension || ".bin");
  if (!extension) return safe;
  const parsed = node_path_1.default.parse(safe);
  return parsed.ext.toLowerCase() === extension ? safe : parsed.name + extension;
}
function uniquePath(directory, fileName) {
  ensureDir(directory);
  const parsed = node_path_1.default.parse(safeFileName(fileName));
  let candidate = node_path_1.default.join(directory, `${parsed.name}${parsed.ext}`);
  let index = 1;
  while ((0, node_fs_1.existsSync)(candidate)) {
    candidate = node_path_1.default.join(directory, `${parsed.name}_${index}${parsed.ext}`);
    index += 1;
  }
  return candidate;
}
function fileToDataUrl(filePath) {
  const bytes = (0, node_fs_1.readFileSync)(filePath);
  return `data:${guessMime(filePath)};base64,${bytes.toString("base64")}`;
}
const resourceFolderByKind = {
  image: "images",
  video: "videos",
  audio: "audios",
  text: "texts",
  pose: "poses",
  set: "sets"
};
function ensureResourceLibraryRoot() {
  ensureDir(resourceLibraryRoot);
  Object.values(resourceFolderByKind).forEach((folder) => ensureDir(node_path_1.default.join(resourceLibraryRoot, folder)));
}
function readResourceLibrary() {
  ensureResourceLibraryRoot();
  if (!(0, node_fs_1.existsSync)(resourceLibraryDbPath)) {
    (0, node_fs_1.writeFileSync)(resourceLibraryDbPath, "[]", "utf-8");
    return [];
  }
  try {
    const parsed = JSON.parse((0, node_fs_1.readFileSync)(resourceLibraryDbPath, "utf-8"));
    if (!Array.isArray(parsed)) {
      return [];
    }
    const items = parsed;
    let compacted = false;
    const compactItems = items.map((item) => {
      if (item.kind !== "image" || !item.localPath) {
        return item;
      }
      if (typeof item.dataUrl === "string" && item.dataUrl.startsWith("data:")) {
        compacted = true;
        const { dataUrl: _dataUrl, ...rest } = item;
        item = rest;
      }
      if (typeof item.thumbnail === "string" && item.thumbnail.startsWith("data:")) {
        compacted = true;
        const { thumbnail: _thumbnail, ...rest } = item;
        item = rest;
      }
      return item;
    });
    if (compacted) {
      writeResourceLibrary(compactItems);
    }
    return compactItems;
  } catch {
    return [];
  }
}
function writeResourceLibrary(items) {
  ensureResourceLibraryRoot();
  (0, node_fs_1.writeFileSync)(resourceLibraryDbPath, JSON.stringify(items, null, 2), "utf-8");
}
function resourceKindFromMime(mime) {
  if (!mime) {
    return void 0;
  }
  if (mime.startsWith("image/")) {
    return "image";
  }
  if (mime.startsWith("video/")) {
    return "video";
  }
  if (mime.startsWith("audio/")) {
    return "audio";
  }
  if (mime.startsWith("text/")) {
    return "text";
  }
  return void 0;
}
function resourceKindFromPath(filePath) {
  if (!filePath) {
    return void 0;
  }
  return resourceKindFromMime(guessMime(filePath));
}
function extensionFromMime(mime, fallback = ".bin") {
  const pairs = {
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
    "video/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/mp4": ".m4a",
    "text/plain": ".txt",
    "application/json": ".json"
  };
  return pairs[mime.split(";")[0].toLowerCase()] ?? fallback;
}
function resourceDataUrlForItem(item) {
  if (item.dataUrl) {
    return item.dataUrl;
  }
  return void 0;
}
async function addResourceToLibrary(request) {
  try {
    ensureResourceLibraryRoot();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    let localPath = request.localPath;
    let mimeType = request.mimeType;
    let sizeBytes;
    let text = request.text;
    const source = request.source || request.dataUrl || request.localPath;
    if (request.text !== void 0 && !source) {
      mimeType = "text/plain";
      const targetPath = uniquePath(node_path_1.default.join(resourceLibraryRoot, resourceFolderByKind.text), safeFileName(`${request.name || "�ı��ز�"}.txt`, ".txt"));
      (0, node_fs_1.writeFileSync)(targetPath, request.text, "utf-8");
      localPath = targetPath;
      sizeBytes = Buffer.byteLength(request.text, "utf-8");
    } else if (request.localPath && (0, node_fs_1.existsSync)(request.localPath)) {
      mimeType = mimeType || guessMime(request.localPath);
      const kind2 = request.kind || resourceKindFromMime(mimeType) || "image";
      const targetPath = uniquePath(node_path_1.default.join(resourceLibraryRoot, resourceFolderByKind[kind2]), node_path_1.default.basename(request.localPath));
      (0, node_fs_1.copyFileSync)(request.localPath, targetPath);
      localPath = targetPath;
      sizeBytes = (0, node_fs_1.statSync)(targetPath).size;
    } else if (request.dataUrl || request.source && request.source.startsWith("data:")) {
      const parsed = parseDataUrl(request.dataUrl || request.source || "");
      mimeType = mimeType || parsed.mime;
      const kind2 = request.kind || resourceKindFromMime(mimeType) || "image";
      const targetPath = uniquePath(node_path_1.default.join(resourceLibraryRoot, resourceFolderByKind[kind2]), safeFileName(request.name || `�ز�_${Date.now()}${extensionFromMime(mimeType)}`, extensionFromMime(mimeType)));
      (0, node_fs_1.writeFileSync)(targetPath, parsed.bytes);
      localPath = targetPath;
      sizeBytes = parsed.bytes.byteLength;
    } else if (request.source && /^https?:\/\//i.test(request.source)) {
      const temporaryPath = uniquePath(resourceLibraryRoot, `.jiaren-resource-${Date.now()}.download`);
      try {
        const downloaded = await (0, jiaren_safe_download_1.downloadFile)(request.source, temporaryPath, { maxBytes: 2 * 1024 * 1024 * 1024 });
        mimeType = mimeType || downloaded.contentType?.split(";")[0] || "application/octet-stream";
        const kind2 = request.kind || resourceKindFromMime(mimeType) || "image";
        const targetPath = uniquePath(node_path_1.default.join(resourceLibraryRoot, resourceFolderByKind[kind2]), safeFileName(request.name || `�ز�_${Date.now()}${extensionFromMime(mimeType)}`, extensionFromMime(mimeType)));
        (0, node_fs_1.renameSync)(temporaryPath, targetPath);
        localPath = targetPath;
        sizeBytes = downloaded.byteSize;
      } catch (error) {
        try {
          (0, node_fs_1.rmSync)(temporaryPath, { force: true });
        } catch {
        }
        throw error;
      }
    }
    const kind = request.kind || resourceKindFromPath(localPath) || resourceKindFromMime(mimeType) || (text !== void 0 ? "text" : "image");
    if (!localPath && kind !== "set") {
      return { ok: false, message: "û�пɱ�����ز���Դ��" };
    }
    if (text === void 0 && kind === "text" && localPath && (0, node_fs_1.existsSync)(localPath)) {
      text = (0, node_fs_1.readFileSync)(localPath, "utf-8");
    }
    const item = {
      id: node_crypto_1.default.randomUUID(),
      kind,
      name: (request.name || (localPath ? node_path_1.default.parse(localPath).name : "δ�����ز�")).trim().slice(0, 120),
      category: request.category || (kind === "image" ? "ͼƬ" : kind === "video" ? "��Ƶ" : kind === "text" ? "�ı�" : "�ز�"),
      tags: request.tags ?? [],
      favorite: Boolean(request.favorite),
      createdAt: now,
      updatedAt: now,
      source,
      localPath,
      dataUrl: localPath ? void 0 : request.dataUrl,
      thumbnail: request.thumbnail,
      mimeType: mimeType || (localPath ? guessMime(localPath) : void 0),
      sizeBytes: sizeBytes ?? (localPath && (0, node_fs_1.existsSync)(localPath) ? (0, node_fs_1.statSync)(localPath).size : void 0),
      text,
      metadata: request.metadata
    };
    const items = [item, ...readResourceLibrary()];
    writeResourceLibrary(items);
    return { ok: true, item, items };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "�����ز�ʧ�ܡ�" };
  }
}
function listResources(request) {
  const search = request?.search?.trim().toLowerCase();
  const items = readResourceLibrary().filter((item) => !request?.kind || request.kind === "all" || item.kind === request.kind).filter((item) => !request?.favoriteOnly || item.favorite).filter((item) => !request?.category || item.category === request.category).filter((item) => {
    if (!search) {
      return true;
    }
    return [item.name, item.category, item.text, ...item.tags ?? []].some((value) => value?.toLowerCase().includes(search));
  }).map((item) => ({
    ...item,
    dataUrl: resourceDataUrlForItem(item),
    thumbnail: item.thumbnail
  }));
  return { ok: true, items };
}
function updateResourceInLibrary(id, patch) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const items = readResourceLibrary();
  const item = items.find((entry) => entry.id === id);
  if (!item) {
    return { ok: false, message: "û���ҵ��زġ�" };
  }
  Object.assign(item, {
    ...patch,
    name: patch.name?.trim() || item.name,
    updatedAt: now
  });
  if (item.kind === "text" && item.localPath && patch.text !== void 0) {
    (0, node_fs_1.writeFileSync)(item.localPath, patch.text, "utf-8");
  }
  writeResourceLibrary(items);
  return { ok: true, item, items };
}
function deleteResourceFromLibrary(id) {
  const items = readResourceLibrary();
  const item = items.find((entry) => entry.id === id);
  if (!item) {
    return { ok: false, message: "û���ҵ��زġ�" };
  }
  if (item.localPath && (0, node_fs_1.existsSync)(item.localPath) && item.localPath.startsWith(resourceLibraryRoot)) {
    (0, node_fs_1.rmSync)(item.localPath, { force: true });
  }
  const nextItems = items.filter((entry) => entry.id !== id);
  writeResourceLibrary(nextItems);
  return { ok: true, item, items: nextItems };
}
function writeBufferToCache(bytes, fileName, directory) {
  const targetDirectory = directory?.trim() || defaultCacheDir;
  const targetPath = uniquePath(targetDirectory, fileName);
  (0, node_fs_1.writeFileSync)(targetPath, bytes);
  return targetPath;
}
function clampComfyPort(port) {
  return Math.max(1024, Math.min(65535, Math.round(port || defaultRongtuPort)));
}
function normalizeComfyBaseUrl(baseUrl, port) {
  const fallbackPort = clampComfyPort(port);
  const trimmed = baseUrl?.trim();
  if (!trimmed) {
    return { baseUrl: `http://127.0.0.1:${fallbackPort}`, port: fallbackPort };
  }
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (!url.hostname) {
      throw new Error("missing host");
    }
    if (!url.port) {
      url.port = String(fallbackPort);
    }
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return { baseUrl: url.origin.replace(/\/+$/, ""), port: clampComfyPort(Number(url.port) || fallbackPort) };
  } catch {
    return { baseUrl: `http://127.0.0.1:${fallbackPort}`, port: fallbackPort };
  }
}
function firstExistingRongtuPath(paths) {
  for (const item of paths) {
    if (item && (0, node_fs_1.existsSync)(item)) {
      return node_path_1.default.resolve(item);
    }
  }
  return void 0;
}
function resolveRongtuEngineRoot(engineRoot) {
  const trimmed = engineRoot?.trim();
  if (trimmed) {
    return node_path_1.default.resolve(trimmed);
  }
  return (0, node_fs_1.existsSync)(defaultRongtuEngineRoot) ? node_path_1.default.resolve(defaultRongtuEngineRoot) : void 0;
}
function resolveRongtuComfyRoot(engineRoot) {
  if (!engineRoot) {
    return void 0;
  }
  const candidates = [node_path_1.default.join(engineRoot, "ComfyUI"), engineRoot, node_path_1.default.join(engineRoot, "comfyui")];
  return firstExistingRongtuPath(candidates.map((candidate) => node_path_1.default.join(candidate, "main.py")))?.replace(/[\\/]main\.py$/i, "") ?? firstExistingRongtuPath(candidates);
}
function resolveRongtuPythonPath(engineRoot, comfyRoot) {
  const winCandidates = [
    engineRoot ? node_path_1.default.join(engineRoot, "python", "python.exe") : void 0,
    engineRoot ? node_path_1.default.join(engineRoot, "python_embeded", "python.exe") : void 0,
    engineRoot ? node_path_1.default.join(engineRoot, ".venv", "Scripts", "python.exe") : void 0,
    engineRoot ? node_path_1.default.join(engineRoot, "venv", "Scripts", "python.exe") : void 0,
    comfyRoot ? node_path_1.default.join(comfyRoot, ".venv", "Scripts", "python.exe") : void 0,
    comfyRoot ? node_path_1.default.join(comfyRoot, "venv", "Scripts", "python.exe") : void 0
  ];
  const unixCandidates = [
    engineRoot ? node_path_1.default.join(engineRoot, "python", "bin", "python") : void 0,
    engineRoot ? node_path_1.default.join(engineRoot, ".venv", "bin", "python") : void 0,
    engineRoot ? node_path_1.default.join(engineRoot, "venv", "bin", "python") : void 0,
    comfyRoot ? node_path_1.default.join(comfyRoot, ".venv", "bin", "python") : void 0,
    comfyRoot ? node_path_1.default.join(comfyRoot, "venv", "bin", "python") : void 0
  ];
  return firstExistingRongtuPath(process.platform === "win32" ? winCandidates : unixCandidates);
}
function rongtuWorkflowCandidates(engineRoot, comfyRoot) {
  return [
    comfyRoot ? node_path_1.default.join(comfyRoot, "user", "default", "workflows", defaultRongtuWorkflowName) : "",
    comfyRoot ? node_path_1.default.join(comfyRoot, "workflows", defaultRongtuWorkflowName) : "",
    engineRoot ? node_path_1.default.join(engineRoot, defaultRongtuWorkflowName) : "",
    node_path_1.default.join(defaultRongtuEngineRoot, "ComfyUI", "user", "default", "workflows", defaultRongtuWorkflowName),
    node_path_1.default.join(userWritableRoot, ".jiaren", defaultRongtuWorkflowName),
    node_path_1.default.join(portableRoot, defaultRongtuWorkflowName),
    node_path_1.default.join(bundledResourceRoot, defaultRongtuWorkflowName),
    node_path_1.default.join(appRoot, "build", defaultRongtuWorkflowName),
    node_path_1.default.join("H:\\AI", "rongtu-workflow-debug.json")
  ].filter(Boolean);
}
function resolveRongtuWorkflowPath(engineRoot, comfyRoot) {
  return firstExistingRongtuPath(rongtuWorkflowCandidates(engineRoot, comfyRoot));
}
function anyPathExists(paths) {
  return paths.some((item) => (0, node_fs_1.existsSync)(item));
}
function rongtuRuntimeWarnings(comfyRoot) {
  if (!comfyRoot) {
    return [];
  }
  const checks = [
    {
      label: "ComfyUI-LMCQ ���",
      paths: [node_path_1.default.join(comfyRoot, "custom_nodes", "ComfyUI-LMCQ"), node_path_1.default.join(comfyRoot, "custom_nodes", "ComfyUI-LMCQ-main")]
    },
    { label: "rgthree ���", paths: [node_path_1.default.join(comfyRoot, "custom_nodes", "rgthree-comfy"), node_path_1.default.join(comfyRoot, "custom_nodes", "ComfyUI-Manager", "custom-node-list.json")] },
    { label: "Qwen Image Edit ��ģ��", paths: [node_path_1.default.join(comfyRoot, "models", "diffusion_models", "qwen_image_edit_2509_fp8_e4m3fn.safetensors")] },
    { label: "Qwen �ı�������", paths: [node_path_1.default.join(comfyRoot, "models", "text_encoders", "qwen_2.5_vl_7b_fp8_scaled.safetensors")] },
    { label: "Qwen VAE", paths: [node_path_1.default.join(comfyRoot, "models", "vae", "qwen_image_vae.safetensors")] },
    { label: "Qwen Lightning LoRA", paths: [node_path_1.default.join(comfyRoot, "models", "loras", "Qwen-Image-Lightning-4steps-V1.0.safetensors")] },
    { label: "ħ������ͼ LoRA", paths: [node_path_1.default.join(comfyRoot, "models", "loras", "ħ������ͼ_lora.safetensors")] }
  ];
  return checks.filter((item) => !anyPathExists(item.paths)).map((item) => item.label);
}
function resolveComfyRongtuPaths(request) {
  const normalized = normalizeComfyBaseUrl(request?.baseUrl, request?.port);
  const engineRoot = resolveRongtuEngineRoot(request?.engineRoot);
  const comfyRoot = resolveRongtuComfyRoot(engineRoot);
  const mainPath = comfyRoot ? node_path_1.default.join(comfyRoot, "main.py") : void 0;
  const pythonPath = resolveRongtuPythonPath(engineRoot, comfyRoot);
  const workflowPath = resolveRongtuWorkflowPath(engineRoot, comfyRoot);
  const launchMissing = [];
  if (!engineRoot || !(0, node_fs_1.existsSync)(engineRoot)) {
    launchMissing.push("����Ŀ¼");
  }
  if (!mainPath || !(0, node_fs_1.existsSync)(mainPath)) {
    launchMissing.push("ComfyUI main.py");
  }
  if (!pythonPath) {
    launchMissing.push("Python");
  }
  const missing = workflowPath ? [] : ["��ͼ������ JSON"];
  return {
    engineRoot,
    comfyRoot,
    pythonPath,
    mainPath,
    workflowPath,
    port: normalized.port,
    baseUrl: normalized.baseUrl,
    missing,
    launchMissing,
    launchable: launchMissing.length === 0,
    warnings: rongtuRuntimeWarnings(comfyRoot)
  };
}
async function fetchWithTimeout(url, init = {}, timeoutMs = 5e3) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
async function isComfyRunning(baseUrl) {
  try {
    const response = await fetchWithTimeout(`${baseUrl}/system_stats`, { method: "GET" }, 1800);
    return response.ok;
  } catch {
    return false;
  }
}
async function comfyJson(baseUrl, endpoint, init = {}, timeoutMs = 3e4) {
  const response = await fetchWithTimeout(`${baseUrl}${endpoint}`, init, timeoutMs);
  const text = await response.text();
  const payload = parseResponsePayload(text);
  if (!response.ok) {
    throw new Error(`ComfyUI HTTP ${response.status}${text ? `��${payloadMessage(payload, text, 700)}` : ""}`);
  }
  return payload;
}
async function getComfyRongtuStatus(request) {
  const paths = resolveComfyRongtuPaths(request);
  const running = await isComfyRunning(paths.baseUrl);
  const missing = [...paths.missing];
  if (!running && !paths.launchable) {
    missing.push(...paths.launchMissing);
  }
  const mode = running ? "running-service" : paths.launchable ? "launchable-package" : "address-only";
  const detected = running || paths.launchable || Boolean(paths.workflowPath);
  const ok = running ? paths.missing.length === 0 : paths.launchable && paths.missing.length === 0;
  const message = running ? paths.missing.length === 0 ? `������ ComfyUI��${paths.baseUrl}��Ĭ��ħ������ͼ���������ã���Ȩ��Կ���Զ���䡣` : `������ ComfyUI��${paths.baseUrl}�����Ҳ���ħ������ͼ������ JSON��` : paths.launchable ? paths.missing.length === 0 ? "���ҵ��������ı��� ComfyUI����ʼ��ͼʱ���Զ����������Զ������Ȩ��Կ��" : `���ҵ��������� ComfyUI����ȱ�٣�${paths.missing.join("��")}` : `û������ ${paths.baseUrl}����������Ҷ������/�ٷ� ComfyUI ��������ѡ�������Ŀ¼��`;
  return {
    ok,
    detected,
    running,
    baseUrl: paths.baseUrl,
    engineRoot: paths.engineRoot,
    comfyRoot: paths.comfyRoot,
    pythonPath: paths.pythonPath,
    workflowPath: paths.workflowPath,
    port: paths.port,
    passwordFilled: Boolean(paths.workflowPath),
    missing: Array.from(new Set(missing)),
    warnings: paths.warnings,
    mode,
    message
  };
}
async function startComfyRongtuEngine(paths) {
  if (await isComfyRunning(paths.baseUrl)) {
    return;
  }
  if (!paths.launchable || !paths.pythonPath || !paths.mainPath || !paths.comfyRoot) {
    throw new Error(`û������ ${paths.baseUrl}����������Ҷ������/�ٷ� ComfyUI ��������ѡ�� Python �� ComfyUI main.py �Ŀ�����Ŀ¼��`);
  }
  if (!paths.workflowPath) {
    throw new Error("�Ҳ�����ͼ������ JSON�����ħ������ͼ�������ŵ� ComfyUI �� user/default/workflows Ŀ¼������Ĭ�����ϰ���");
  }
  if (!comfyRongtuProcess || comfyRongtuProcess.killed) {
    comfyRongtuProcess = (0, node_child_process_1.spawn)(paths.pythonPath, [paths.mainPath, "--listen", "127.0.0.1", "--port", String(paths.port)], {
      cwd: paths.comfyRoot,
      windowsHide: true
    });
    comfyRongtuProcess.stdout.on("data", (chunk) => {
      console.log(`[Rongtu ComfyUI] ${String(chunk).trim()}`);
    });
    comfyRongtuProcess.stderr.on("data", (chunk) => {
      console.warn(`[Rongtu ComfyUI] ${String(chunk).trim()}`);
    });
    comfyRongtuProcess.on("exit", () => {
      comfyRongtuProcess = void 0;
    });
    comfyRongtuProcess.on("error", (error) => {
      console.warn(`[Rongtu ComfyUI] failed to start: ${error.message}`);
      comfyRongtuProcess = void 0;
    });
  }
  const startedAt = Date.now();
  while (Date.now() - startedAt < 18e4) {
    if (await isComfyRunning(paths.baseUrl)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }
  throw new Error("������ͼ����������ʱ����ȷ���Կ����������ϰ������С�");
}
async function readRongtuSourceImage(request) {
  const source = request.localPath || request.source;
  if (source && (0, node_fs_1.existsSync)(source)) {
    return {
      bytes: (0, node_fs_1.readFileSync)(source),
      mime: request.mimeType || guessMime(source),
      name: request.name || node_path_1.default.basename(source)
    };
  }
  const dataUrl = request.dataUrl || (request.source?.startsWith("data:") ? request.source : "");
  if (dataUrl) {
    const parsed = parseDataUrl(dataUrl);
    return {
      bytes: parsed.bytes,
      mime: request.mimeType || parsed.mime,
      name: request.name || `rongtu_input${imageExtensionFromMime(parsed.mime)}`
    };
  }
  if (/^https?:\/\//i.test(request.source)) {
    const downloaded = await (0, jiaren_safe_download_1.downloadBuffer)(request.source, { accept: "image/*,*/*", maxBytes: 256 * 1024 * 1024, timeoutMs: 6e4 });
    const mime = request.mimeType || downloaded.contentType?.split(";")[0] || "image/png";
    return {
      bytes: downloaded.buffer,
      mime,
      name: request.name || `rongtu_input${imageExtensionFromMime(mime)}`
    };
  }
  throw new Error("����ѡ��һ��������ͼ��ͼƬ��");
}
async function uploadRongtuImage(paths, request) {
  const image = await readRongtuSourceImage(request);
  const fileName = safeFileName(image.name, imageExtensionFromMime(image.mime));
  const form = new FormData();
  form.set("image", new Blob([new Uint8Array(image.bytes)], { type: image.mime }), fileName);
  form.set("type", "input");
  form.set("overwrite", "true");
  const payload = await comfyJson(paths.baseUrl, "/upload/image", {
    method: "POST",
    body: form
  }, 12e4);
  return readString(payload.name) || fileName;
}
function getWorkflowNodes(workflow) {
  return Array.isArray(workflow.nodes) ? workflow.nodes.filter((node) => isRecord(node) && typeof node.type === "string" && node.id !== void 0) : [];
}
function getWorkflowLinks(workflow) {
  return Array.isArray(workflow.links) ? workflow.links.filter((link) => Array.isArray(link) && link.length >= 5 && typeof link[0] === "number") : [];
}
function setComfyWidget(node, index, value) {
  if (!node) {
    return;
  }
  const widgets = Array.isArray(node.widgets_values) ? [...node.widgets_values] : [];
  widgets[index] = value;
  node.widgets_values = widgets;
}
function widgetValueForInput(node, inputName, widgetCursor) {
  const widgets = Array.isArray(node.widgets_values) ? node.widgets_values : [];
  if (node.type === "KSampler") {
    const indexByInput = { seed: 0, steps: 2, cfg: 3, sampler_name: 4, scheduler: 5, denoise: 6 };
    return widgets[indexByInput[inputName]];
  }
  if (node.type === "LoadImage") {
    return inputName === "image" ? widgets[0] : void 0;
  }
  if (node.type === "TextEncodeQwenImageEditPlus") {
    return inputName === "prompt" ? widgets[0] : void 0;
  }
  if (node.type === "LmcqAuthLoraDecryption") {
    const indexByInput = { lora_name: 0, key: 1, license_code: 2, strength_model: 3, strength_clip: 4, _force_validate: 5 };
    return widgets[indexByInput[inputName]];
  }
  if (node.type === "ImageScaleToTotalPixels") {
    const indexByInput = { upscale_method: 0, megapixels: 1, resolution_steps: 2 };
    const value = widgets[indexByInput[inputName]];
    return value ?? (inputName === "resolution_steps" ? 1 : void 0);
  }
  if (node.type === "LoraLoaderModelOnly") {
    const indexByInput = { lora_name: 0, strength_model: 1 };
    return widgets[indexByInput[inputName]];
  }
  return widgets[widgetCursor];
}
function patchComfyNodeCompatibility(node, inputs) {
  if (node.type === "ImageScaleToTotalPixels" && inputs.resolution_steps === void 0) {
    inputs.resolution_steps = 1;
  }
}
function buildComfyPromptFromWorkflow(workflow, outputNodeId = "45") {
  const nodes = getWorkflowNodes(workflow);
  const links = getWorkflowLinks(workflow);
  const nodesById = new Map(nodes.map((node) => [String(node.id), node]));
  const linksById = new Map(links.map((link) => [link[0], link]));
  const included = /* @__PURE__ */ new Set();
  const includeAncestors = (nodeId) => {
    if (included.has(nodeId)) {
      return;
    }
    const node = nodesById.get(nodeId);
    if (!node) {
      return;
    }
    included.add(nodeId);
    for (const input of node.inputs ?? []) {
      if (typeof input.link === "number") {
        const link = linksById.get(input.link);
        if (link) {
          includeAncestors(String(link[1]));
        }
      }
    }
  };
  includeAncestors(outputNodeId);
  if (included.size === 0) {
    nodes.filter((node) => node.type === "PreviewImage" || node.type === "SaveImage").forEach((node) => includeAncestors(String(node.id)));
  }
  const prompt = {};
  for (const nodeId of included) {
    const node = nodesById.get(nodeId);
    if (!node || node.type === "MarkdownNote" || /Image Comparer/i.test(node.type)) {
      continue;
    }
    const inputs = {};
    let widgetCursor = 0;
    for (const input of node.inputs ?? []) {
      const inputName = input.name;
      if (!inputName) {
        continue;
      }
      if (typeof input.link === "number") {
        const link = linksById.get(input.link);
        if (link) {
          inputs[inputName] = [String(link[1]), link[2]];
        }
        continue;
      }
      if (input.widget) {
        const value = widgetValueForInput(node, inputName, widgetCursor);
        widgetCursor += 1;
        if (value !== void 0) {
          inputs[inputName] = value;
        }
      }
    }
    patchComfyNodeCompatibility(node, inputs);
    prompt[nodeId] = {
      class_type: node.type,
      inputs,
      _meta: { title: node.title || node.type }
    };
  }
  return prompt;
}
function buildRongtuPrompt(paths, uploadName, request) {
  if (!paths.workflowPath) {
    throw new Error("�Ҳ�����ͼ������ JSON�����Ȱ�ħ������ͼ�������ŵ� ComfyUI ������Ŀ¼��");
  }
  const workflow = JSON.parse((0, node_fs_1.readFileSync)(paths.workflowPath, "utf-8"));
  const nodes = getWorkflowNodes(workflow);
  const nodeById = new Map(nodes.map((node) => [String(node.id), node]));
  setComfyWidget(nodeById.get("31"), 0, uploadName);
  setComfyWidget(nodeById.get("31"), 1, "image");
  setComfyWidget(nodeById.get("11"), 0, request.prompt.trim() || defaultRongtuPrompt);
  setComfyWidget(nodeById.get("3"), 0, request.negativePrompt?.trim() || "");
  setComfyWidget(nodeById.get("83"), 1, rongtuPassword);
  setComfyWidget(nodeById.get("83"), 2, rongtuPassword);
  setComfyWidget(nodeById.get("83"), 5, String(Date.now() / 1e3));
  const seed = typeof request.seed === "number" && Number.isFinite(request.seed) ? Math.round(request.seed) : Math.floor(Math.random() * 999999999999999);
  setComfyWidget(nodeById.get("14"), 0, seed);
  setComfyWidget(nodeById.get("14"), 2, Math.max(1, Math.min(80, Math.round(request.steps || 8))));
  setComfyWidget(nodeById.get("14"), 3, Math.max(0, Math.min(20, request.cfg ?? 1)));
  setComfyWidget(nodeById.get("90"), 1, Math.max(0.25, Math.min(4, request.megapixels ?? 1)));
  setComfyWidget(nodeById.get("90"), 2, 1);
  return buildComfyPromptFromWorkflow(workflow);
}
function extractComfyImages(historyPayload, promptId) {
  const root = isRecord(historyPayload) && isRecord(historyPayload[promptId]) ? historyPayload[promptId] : historyPayload;
  const outputs = isRecord(root) && isRecord(root.outputs) ? root.outputs : void 0;
  const images = [];
  if (!outputs) {
    return images;
  }
  for (const output of Object.values(outputs)) {
    if (!isRecord(output) || !Array.isArray(output.images)) {
      continue;
    }
    for (const item of output.images) {
      if (!isRecord(item)) {
        continue;
      }
      const filename = readString(item.filename);
      if (filename) {
        images.push({
          filename,
          subfolder: readString(item.subfolder) || "",
          type: readString(item.type) || "output"
        });
      }
    }
  }
  return images;
}
function comfyPromptFailure(historyPayload, promptId) {
  const root = isRecord(historyPayload) && isRecord(historyPayload[promptId]) ? historyPayload[promptId] : historyPayload;
  const status = isRecord(root) && isRecord(root.status) ? root.status : void 0;
  const statusText = status ? readString(status.status_str) : void 0;
  if (statusText && /error|failed/i.test(statusText)) {
    const messages = Array.isArray(status?.messages) ? JSON.stringify(status.messages).slice(0, 900) : "";
    return messages || statusText;
  }
  return void 0;
}
async function waitForRongtuImages(baseUrl, promptId) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 20 * 60 * 1e3) {
    const history = await comfyJson(baseUrl, `/history/${encodeURIComponent(promptId)}`, {}, 3e4);
    const images = extractComfyImages(history, promptId);
    if (images.length > 0) {
      return images;
    }
    const failure = comfyPromptFailure(history, promptId);
    if (failure) {
      throw new Error(`������ͼ������ʧ�ܣ�${failure}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2e3));
  }
  throw new Error("������ͼ���ɳ�ʱ��");
}
async function downloadRongtuImage(baseUrl, image, request, index) {
  const params = new URLSearchParams();
  params.set("filename", image.filename);
  params.set("type", image.type || "output");
  params.set("subfolder", image.subfolder || "");
  const extension = node_path_1.default.extname(image.filename || "") || ".png";
  const targetPath = uniquePath(request.downloadsDir || request.cacheDir || defaultCacheDir, `jiaren_rongtu_${Date.now()}_${index}${extension}`);
  await (0, jiaren_safe_download_1.downloadFile)(`${baseUrl}/view?${params.toString()}`, targetPath, { accept: "image/*,*/*", maxBytes: 512 * 1024 * 1024, timeoutMs: 12e4, allowPrivate: true });
  return {
    id: node_crypto_1.default.randomUUID(),
    type: "image",
    localPath: targetPath,
    dataUrl: fileToDataUrl(targetPath),
    ...imageDimensions(targetPath)
  };
}
async function generateComfyRongtu(request) {
  const startedAt = performance.now();
  const id = node_crypto_1.default.randomUUID();
  try {
    const paths = resolveComfyRongtuPaths(request);
    await startComfyRongtuEngine(paths);
    const uploadedName = await uploadRongtuImage(paths, request);
    const prompt = buildRongtuPrompt(paths, uploadedName, request);
    const queued = await comfyJson(paths.baseUrl, "/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: id, prompt })
    }, 6e4);
    const promptId = readString(queued.prompt_id);
    if (!promptId) {
      throw new Error("ComfyUI û�з��� prompt_id��");
    }
    const images = await waitForRongtuImages(paths.baseUrl, promptId);
    const assets = await Promise.all(images.map((image, index) => downloadRongtuImage(paths.baseUrl, image, request, index)));
    return {
      id,
      modelId: "local-comfyui-rongtu",
      status: "succeeded",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets,
      taskId: promptId,
      message: "Jiaren AI ���� ComfyUI ��ͼ��ɣ�ħ������Ȩ��Կ���Զ���䡣"
    };
  } catch (error) {
    return {
      id,
      modelId: "local-comfyui-rongtu",
      status: "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [],
      message: error instanceof Error ? error.message : "������ͼʧ�ܡ�"
    };
  }
}
const comfyWorkflowNamePattern = /^(?:(?:custom|�Զ���)[\\/])?[\w\u4e00-\u9fa5 .-]+\.json$/u;
function normalizeComfyInstance(value) {
  let next = value.trim().replace(/^https?:\/\//i, "").replace(/\/+$/g, "");
  if (!next) {
    return void 0;
  }
  if (!next.includes(":")) {
    next = `${next}:8188`;
  }
  const [host, port] = next.split(":");
  if (!host || !/^\d+$/.test(port || "")) {
    return void 0;
  }
  return `${host}:${Math.max(1024, Math.min(65535, Number(port)))}`;
}
function readComfyInstances() {
  try {
    if ((0, node_fs_1.existsSync)(comfyWorkflowInstancesPath)) {
      const payload = JSON.parse((0, node_fs_1.readFileSync)(comfyWorkflowInstancesPath, "utf-8"));
      if (Array.isArray(payload.instances)) {
        const instances = payload.instances.map((item) => normalizeComfyInstance(String(item ?? ""))).filter((item) => Boolean(item));
        if (instances.length > 0) {
          return Array.from(new Set(instances));
        }
      }
    }
  } catch {
  }
  return defaultComfyInstances;
}
function saveComfyInstances(instances) {
  const cleaned = Array.from(new Set(instances.map((item) => normalizeComfyInstance(String(item ?? ""))).filter((item) => Boolean(item))));
  if (cleaned.length === 0) {
    throw new Error("���ٱ���һ�� ComfyUI ��˵�ַ������ 127.0.0.1:8188��");
  }
  ensureDir(dataRoot);
  (0, node_fs_1.writeFileSync)(comfyWorkflowInstancesPath, JSON.stringify({ instances: cleaned }, null, 2), "utf-8");
  return { instances: cleaned };
}
function comfyBaseUrlFromInstance(instance) {
  const normalized = normalizeComfyInstance(instance || "") || defaultComfyInstances[0];
  return `http://${normalized}`;
}
function safeWorkflowFileName(name) {
  const baseName = node_path_1.default.basename(name.trim() || "workflow.json");
  const withExtension = /\.json$/i.test(baseName) ? baseName : `${baseName}.json`;
  const safe = withExtension.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_").slice(0, 120);
  if (!comfyWorkflowNamePattern.test(safe)) {
    throw new Error("���������Ʋ��Ϸ�����ʹ������/Ӣ��/����/�ո�/_-.��");
  }
  return safe;
}
function normalizeWorkflowName(name) {
  const cleaned = name.trim().replace(/\\/g, "/");
  const finalName = cleaned.startsWith("custom/") || cleaned.startsWith("�Զ���/") ? cleaned : `custom/${safeWorkflowFileName(cleaned)}`;
  if (!comfyWorkflowNamePattern.test(finalName)) {
    throw new Error("���������Ʋ��Ϸ���");
  }
  return finalName;
}
function comfyWorkflowPath(name) {
  const normalized = normalizeWorkflowName(name);
  const target = node_path_1.default.resolve(comfyWorkflowRoot, ...normalized.split("/"));
  const root = node_path_1.default.resolve(comfyWorkflowRoot);
  if (!target.startsWith(root)) {
    throw new Error("������·�����Ϸ���");
  }
  return target;
}
function comfyWorkflowConfigPath(name) {
  return comfyWorkflowPath(name).replace(/\.json$/i, ".config.json");
}
function isApiWorkflow(workflow) {
  if (!isRecord(workflow)) {
    return false;
  }
  const first = Object.values(workflow).find((item) => isRecord(item));
  return Boolean(first && isRecord(first) && typeof first.class_type === "string" && isRecord(first.inputs));
}
function deepCloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}
function inferComfyFieldType(inputName, value) {
  const key = inputName.toLowerCase();
  if (/image|mask|ͼ��|ͼƬ/.test(key)) {
    return "image";
  }
  if (/video|mp4|mov|webm|��Ƶ/.test(key)) {
    return "video";
  }
  if (/audio|wav|mp3|sound|��Ƶ|����/.test(key)) {
    return "audio";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  if (typeof value === "number") {
    return key.includes("seed") || key.includes("steps") || key.includes("width") || key.includes("height") ? "number" : "slider";
  }
  if (Array.isArray(value) || isRecord(value)) {
    return "textarea";
  }
  if (/prompt|text|caption|positive|negative|��ʾ��|����|����/.test(key)) {
    return "textarea";
  }
  return "text";
}
function labelForComfyInput(inputName) {
  const labels = {
    text: "��ʾ���ı�",
    prompt: "��ʾ��",
    positive: "��������",
    negative: "��������",
    seed: "�������",
    noise_seed: "��������",
    steps: "��������",
    cfg: "CFG ����",
    sampler_name: "��������",
    scheduler: "������",
    denoise: "�ػ�ǿ��",
    width: "����",
    height: "�߶�",
    batch_size: "������С",
    megapixels: "��������",
    strength_model: "ģ��ǿ��",
    strength_clip: "CLIP ǿ��",
    lora_name: "LoRA ģ��",
    ckpt_name: "��ģ��",
    vae_name: "VAE ģ��",
    clip_name: "CLIP ģ��",
    unet_name: "UNet ģ��",
    image: "ͼƬ",
    images: "ͼƬ",
    mask: "�ɰ�",
    filename_prefix: "�ļ���ǰ׺",
    upscale_method: "�Ŵ�ʽ"
  };
  return labels[inputName] || inputName;
}
function collectComfyWorkflowFields(workflow) {
  const fields = [];
  for (const [nodeId, nodeRaw] of Object.entries(workflow)) {
    if (!isRecord(nodeRaw) || !isRecord(nodeRaw.inputs)) {
      continue;
    }
    const nodeTitle = isRecord(nodeRaw._meta) ? readString(nodeRaw._meta.title) : void 0;
    for (const [inputName, value] of Object.entries(nodeRaw.inputs)) {
      if (Array.isArray(value) && value.length >= 2) {
        continue;
      }
      const type = inferComfyFieldType(inputName, value);
      fields.push({
        id: `${nodeId}::${inputName}`,
        node: nodeId,
        input: inputName,
        name: labelForComfyInput(inputName),
        type,
        default: value,
        min: type === "slider" || type === "number" ? 0 : void 0,
        max: inputName.toLowerCase().includes("seed") ? 999999999999999 : type === "slider" || type === "number" ? 100 : void 0,
        step: type === "slider" || type === "number" ? 1 : void 0,
        options: [],
        random_enabled: inputName.toLowerCase().includes("seed")
      });
    }
    if (nodeTitle && fields.length > 0) {
    }
  }
  return fields;
}
function normalizeComfyWorkflowConfig(config, workflow, fallbackTitle) {
  const inferred = workflow ? collectComfyWorkflowFields(workflow) : [];
  const rawFields = Array.isArray(config?.fields) ? config.fields : [];
  const fields = rawFields.filter((field) => Boolean(field && field.node && field.input && field.id)).map((field) => ({
    ...field,
    name: field.name || labelForComfyInput(field.input),
    type: field.type || inferComfyFieldType(field.input, field.default),
    options: Array.isArray(field.options) ? field.options.map(String).filter(Boolean) : []
  }));
  return {
    title: config?.title?.trim() || fallbackTitle || "ComfyUI ������",
    fields: fields.length > 0 ? fields : inferred.filter((field) => field.type === "image" || /prompt|seed|steps|cfg|width|height|megapixels/i.test(field.input)).slice(0, 12),
    mini_cards: isRecord(config?.mini_cards) ? config?.mini_cards : {}
  };
}
function loadComfyWorkflowConfig(name, workflow) {
  const fallbackTitle = node_path_1.default.basename(name, ".json");
  try {
    const configPath = comfyWorkflowConfigPath(name);
    if ((0, node_fs_1.existsSync)(configPath)) {
      return normalizeComfyWorkflowConfig(JSON.parse((0, node_fs_1.readFileSync)(configPath, "utf-8")), workflow, fallbackTitle);
    }
  } catch {
  }
  return normalizeComfyWorkflowConfig(void 0, workflow, fallbackTitle);
}
function listComfyWorkflows() {
  ensureDir(comfyCustomWorkflowRoot);
  const workflows = [];
  const scan = (directory) => {
    for (const entry of (0, node_fs_1.readdirSync)(directory, { withFileTypes: true })) {
      const fullPath = node_path_1.default.join(directory, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".json") || entry.name.endsWith(".config.json")) {
        continue;
      }
      const relative = node_path_1.default.relative(comfyWorkflowRoot, fullPath).replace(/\\/g, "/");
      try {
        const workflow = JSON.parse((0, node_fs_1.readFileSync)(fullPath, "utf-8"));
        const config = loadComfyWorkflowConfig(relative, isRecord(workflow) ? workflow : void 0);
        workflows.push({
          name: relative,
          title: config.title || node_path_1.default.basename(relative, ".json"),
          builtin: false,
          fieldCount: config.fields.length,
          nodeCount: isRecord(workflow) ? Object.keys(workflow).length : 0
        });
      } catch {
        workflows.push({
          name: relative,
          title: node_path_1.default.basename(relative, ".json"),
          builtin: false,
          fieldCount: 0,
          nodeCount: 0
        });
      }
    }
  };
  scan(comfyWorkflowRoot);
  workflows.sort((left, right) => left.title.localeCompare(right.title, "zh-CN"));
  return { workflows };
}
function getComfyWorkflow(name) {
  const normalized = normalizeWorkflowName(name);
  const workflowPath = comfyWorkflowPath(normalized);
  if (!(0, node_fs_1.existsSync)(workflowPath)) {
    throw new Error("û���ҵ���� ComfyUI ��������");
  }
  const workflow = JSON.parse((0, node_fs_1.readFileSync)(workflowPath, "utf-8"));
  if (!isApiWorkflow(workflow)) {
    throw new Error("����ļ����� ComfyUI API ������ JSON������ ComfyUI �е��� API ��ʽ��������");
  }
  return {
    name: normalized,
    workflow,
    config: loadComfyWorkflowConfig(normalized, workflow),
    builtin: false
  };
}
function uploadComfyWorkflow(request) {
  if (!isApiWorkflow(request.workflow)) {
    throw new Error("������Ч�� ComfyUI API ������ JSON������ ComfyUI �ﵼ�� API ��ʽ��");
  }
  ensureDir(comfyCustomWorkflowRoot);
  const storedName = `custom/${safeWorkflowFileName(request.name)}`;
  const workflowPath = comfyWorkflowPath(storedName);
  (0, node_fs_1.writeFileSync)(workflowPath, JSON.stringify(request.workflow, null, 2), "utf-8");
  const config = normalizeComfyWorkflowConfig(void 0, request.workflow, node_path_1.default.basename(storedName, ".json"));
  (0, node_fs_1.writeFileSync)(comfyWorkflowConfigPath(storedName), JSON.stringify(config, null, 2), "utf-8");
  return getComfyWorkflow(storedName);
}
function saveComfyWorkflowConfig(name, config) {
  const detail = getComfyWorkflow(name);
  const next = normalizeComfyWorkflowConfig(config, detail.workflow, detail.config.title);
  (0, node_fs_1.writeFileSync)(comfyWorkflowConfigPath(detail.name), JSON.stringify(next, null, 2), "utf-8");
  return getComfyWorkflow(detail.name);
}
function deleteComfyWorkflow(name) {
  const normalized = normalizeWorkflowName(name);
  const workflowPath = comfyWorkflowPath(normalized);
  if (!(0, node_fs_1.existsSync)(workflowPath)) {
    return { ok: false, message: "û���ҵ������������" };
  }
  (0, node_fs_1.rmSync)(workflowPath, { force: true });
  (0, node_fs_1.rmSync)(comfyWorkflowConfigPath(normalized), { force: true });
  return { ok: true };
}
function fieldValueToNative(field, value) {
  if (field.type === "boolean") {
    return Boolean(value);
  }
  if (field.type === "number" || field.type === "slider") {
    const next = Number(value);
    if (!Number.isFinite(next)) {
      return field.default ?? 0;
    }
    return Number.isInteger(field.step ?? 1) ? Math.round(next) : next;
  }
  if (field.type === "dropdown" && typeof value === "string") {
    const trimmed = value.trim();
    if (/^-?\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
    if (/^-?\d+\.\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
  }
  return value;
}
async function readComfyWorkflowAsset(value) {
  const asset = isRecord(value) ? value : { source: typeof value === "string" ? value : void 0 };
  const source = asset.localPath || asset.source;
  if (source && (0, node_fs_1.existsSync)(source)) {
    return { bytes: (0, node_fs_1.readFileSync)(source), mime: asset.mimeType || guessMime(source), name: asset.name || node_path_1.default.basename(source) };
  }
  const dataUrl = asset.dataUrl || (typeof source === "string" && source.startsWith("data:") ? source : "");
  if (dataUrl) {
    const parsed = parseDataUrl(dataUrl);
    return { bytes: parsed.bytes, mime: asset.mimeType || parsed.mime, name: asset.name || `comfy_input${imageExtensionFromMime(parsed.mime)}` };
  }
  if (source && /^https?:\/\//i.test(source)) {
    const downloaded = await (0, jiaren_safe_download_1.downloadBuffer)(source, { maxBytes: 512 * 1024 * 1024, timeoutMs: 6e4, allowPrivate: true });
    const mime = asset.mimeType || downloaded.contentType?.split(";")[0] || "application/octet-stream";
    return { bytes: downloaded.buffer, mime, name: asset.name || `comfy_input${sourceExtension(source)}` };
  }
  return void 0;
}
async function uploadComfyWorkflowAsset(baseUrl, value) {
  if (typeof value === "string" && value.trim() && !value.startsWith("data:") && !(0, node_fs_1.existsSync)(value) && !/^https?:\/\//i.test(value)) {
    return value.trim();
  }
  const asset = await readComfyWorkflowAsset(value);
  if (!asset) {
    return "";
  }
  const fileName = safeFileName(asset.name, imageExtensionFromMime(asset.mime));
  const form = new FormData();
  form.set("image", new Blob([new Uint8Array(asset.bytes)], { type: asset.mime }), fileName);
  form.set("type", "input");
  form.set("overwrite", "true");
  const payload = await comfyJson(baseUrl, "/upload/image", { method: "POST", body: form }, 12e4);
  return readString(payload.name) || fileName;
}
function inferRuntimeAssetType(item) {
  const filename = readString(item.filename) || "";
  const ext = node_path_1.default.extname(filename).toLowerCase();
  const format = readString(item.format)?.toLowerCase() || "";
  if ([".mp4", ".webm", ".mov", ".m4v", ".avi", ".mkv"].includes(ext) || format.includes("video")) {
    return "video";
  }
  if ([".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"].includes(ext) || format.includes("audio") || format.includes("sound")) {
    return "audio";
  }
  if ([".txt", ".json", ".csv", ".srt", ".vtt", ".md"].includes(ext) || format.includes("text") || format.includes("json")) {
    return "text";
  }
  return "image";
}
function assetExtensionForType(item) {
  const filename = readString(item.filename) || "";
  const ext = node_path_1.default.extname(filename).toLowerCase();
  if (ext) {
    return ext;
  }
  const type = inferRuntimeAssetType(item);
  return type === "video" ? ".mp4" : type === "audio" ? ".wav" : type === "text" ? ".txt" : ".png";
}
async function downloadComfyWorkflowOutput(baseUrl, item, directory) {
  const filename = readString(item.filename);
  if (!filename) {
    return void 0;
  }
  const params = new URLSearchParams();
  params.set("filename", filename);
  params.set("type", readString(item.type) || "output");
  params.set("subfolder", readString(item.subfolder) || "");
  const assetType = inferRuntimeAssetType(item);
  const extension = assetExtensionForType(item);
  const targetPath = uniquePath(directory?.trim() || defaultCacheDir, `jiaren_comfy_${Date.now()}_${node_crypto_1.default.randomUUID().slice(0, 6)}${extension}`);
  try {
    await (0, jiaren_safe_download_1.downloadFile)(`${baseUrl}/view?${params.toString()}`, targetPath, { maxBytes: 2 * 1024 * 1024 * 1024, timeoutMs: 12e4, allowPrivate: true });
  } catch {
    return void 0;
  }
  return {
    id: node_crypto_1.default.randomUUID(),
    type: assetType,
    localPath: targetPath,
    dataUrl: assetType === "image" ? fileToDataUrl(targetPath) : void 0,
    text: assetType === "text" ? (0, node_fs_1.readFileSync)(targetPath, "utf-8") : void 0,
    ...assetType === "image" ? imageDimensions(targetPath) : {}
  };
}
function collectTextAssetsFromOutput(output, directory) {
  const keys = ["text", "texts", "prompt", "prompts", "string", "strings", "caption", "captions"];
  const assets = [];
  for (const key of keys) {
    const raw = output[key];
    if (raw === void 0) {
      continue;
    }
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      const text = typeof value === "string" ? value : isRecord(value) ? readString(value.text) || readString(value.prompt) || readString(value.caption) || JSON.stringify(value) : String(value ?? "");
      if (!text.trim()) {
        continue;
      }
      const targetPath = writeBufferToCache(Buffer.from(text, "utf-8"), `jiaren_comfy_text_${Date.now()}_${node_crypto_1.default.randomUUID().slice(0, 6)}.txt`, directory);
      assets.push({
        id: node_crypto_1.default.randomUUID(),
        type: "text",
        localPath: targetPath,
        text
      });
    }
  }
  return assets;
}
async function collectComfyWorkflowAssets(baseUrl, historyPayload, promptId, directory) {
  const root = isRecord(historyPayload) && isRecord(historyPayload[promptId]) ? historyPayload[promptId] : historyPayload;
  const outputs = isRecord(root) && isRecord(root.outputs) ? root.outputs : void 0;
  if (!outputs) {
    return [];
  }
  const assets = [];
  for (const output of Object.values(outputs)) {
    if (!isRecord(output)) {
      continue;
    }
    for (const [key, raw] of Object.entries(output)) {
      if (["text", "texts", "prompt", "prompts", "string", "strings", "caption", "captions"].includes(key)) {
        continue;
      }
      const values = Array.isArray(raw) ? raw : [raw];
      for (const value of values) {
        if (!isRecord(value) || !readString(value.filename)) {
          continue;
        }
        const asset = await downloadComfyWorkflowOutput(baseUrl, value, directory);
        if (asset) {
          assets.push(asset);
        }
      }
    }
    assets.push(...collectTextAssetsFromOutput(output, directory));
  }
  return assets;
}
async function waitForComfyWorkflowAssets(baseUrl, promptId, directory) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 30 * 60 * 1e3) {
    const history = await comfyJson(baseUrl, `/history/${encodeURIComponent(promptId)}`, {}, 3e4);
    const assets = await collectComfyWorkflowAssets(baseUrl, history, promptId, directory);
    if (assets.length > 0) {
      return assets;
    }
    const failure = comfyPromptFailure(history, promptId);
    if (failure) {
      throw new Error(`ComfyUI ������ʧ�ܣ�${failure}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1800));
  }
  throw new Error("ComfyUI ���������г�ʱ��");
}
async function runComfyWorkflow(request) {
  const startedAt = performance.now();
  const id = node_crypto_1.default.randomUUID();
  try {
    const detail = getComfyWorkflow(request.name);
    const config = normalizeComfyWorkflowConfig(request.config || detail.config, detail.workflow, detail.config.title);
    const baseUrl = request.baseUrl ? normalizeComfyBaseUrl(request.baseUrl).baseUrl : comfyBaseUrlFromInstance(readComfyInstances()[0]);
    if (!await isComfyRunning(baseUrl)) {
      throw new Error(`û������ ComfyUI��${baseUrl}�������������� ComfyUI������ҳ����������ȷ��˵�ַ��`);
    }
    const workflow = deepCloneJson(detail.workflow);
    for (const field of config.fields) {
      if (!field.node || !field.input || !(field.id in request.fields)) {
        continue;
      }
      const node = workflow[field.node];
      if (!isRecord(node)) {
        continue;
      }
      const inputs = isRecord(node.inputs) ? node.inputs : {};
      node.inputs = inputs;
      const rawValue = request.fields[field.id];
      inputs[field.input] = ["image", "video", "audio"].includes(field.type) ? await uploadComfyWorkflowAsset(baseUrl, rawValue) : fieldValueToNative(field, rawValue);
    }
    const queued = await comfyJson(baseUrl, "/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: id, prompt: workflow })
    }, 6e4);
    const promptId = readString(queued.prompt_id);
    if (!promptId) {
      throw new Error("ComfyUI û�з��� prompt_id��");
    }
    const assets = await waitForComfyWorkflowAssets(baseUrl, promptId, request.downloadsDir || request.cacheDir);
    return {
      id,
      modelId: "local-comfyui-workflow",
      status: "succeeded",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets,
      taskId: promptId,
      message: `ComfyUI ��������${config.title}��������ɡ�`
    };
  } catch (error) {
    return {
      id,
      modelId: "local-comfyui-workflow",
      status: "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [],
      message: error instanceof Error ? error.message : "ComfyUI ����������ʧ�ܡ�"
    };
  }
}
function imageExtensionFromMime(mime) {
  if (/jpe?g/i.test(mime)) {
    return ".jpg";
  }
  if (/webp/i.test(mime)) {
    return ".webp";
  }
  if (/gif/i.test(mime)) {
    return ".gif";
  }
  return ".png";
}
function generatedImageFileName(index, mime = "image/png") {
  return `jiaren_${Date.now()}_${index}${imageExtensionFromMime(mime)}`;
}
function imageDimensions(filePath) {
  const image = electron_1.nativeImage.createFromPath(filePath);
  if (image.isEmpty()) {
    return {};
  }
  const size = image.getSize();
  return { width: size.width, height: size.height };
}
function parsePixelTarget(value) {
  const match = value?.match(/(\d{3,5})\s*x\s*(\d{3,5})/i);
  if (!match) {
    return void 0;
  }
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 16 || height < 16) {
    return void 0;
  }
  return { width: Math.round(width), height: Math.round(height) };
}
function samePixelTarget(left, right) {
  return left.width === right.width && left.height === right.height;
}
async function normalizeImageAssetToTarget(asset, options) {
  const target = options?.targetSize;
  if (!target || asset.type !== "image" || !asset.localPath) {
    return asset;
  }
  const original = imageDimensions(asset.localPath);
  if (!original.width || !original.height) {
    return asset;
  }
  const targetMeta = {
    originalWidth: asset.originalWidth ?? original.width,
    originalHeight: asset.originalHeight ?? original.height,
    requestedWidth: target.width,
    requestedHeight: target.height
  };
  if (samePixelTarget(original, target)) {
    return {
      ...asset,
      width: original.width,
      height: original.height,
      ...targetMeta
    };
  }
  const originalRatio = original.width / original.height;
  const targetRatio = target.width / target.height;
  const ratioDelta = Math.abs(originalRatio - targetRatio) / targetRatio;
  const sharp = await importSharp();
  let buffer;
  let fitMode = "fill";
  if (ratioDelta <= 0.025) {
    buffer = await sharp(asset.localPath).rotate().resize({
      width: target.width,
      height: target.height,
      fit: "fill",
      kernel: "lanczos3"
    }).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  } else {
    fitMode = "smart-pad";
    const background = await sharp(asset.localPath).rotate().resize({
      width: target.width,
      height: target.height,
      fit: "cover",
      kernel: "lanczos3"
    }).blur(18).modulate({ brightness: 0.92, saturation: 0.86 }).png().toBuffer();
    const foreground = await sharp(asset.localPath).rotate().resize({
      width: target.width,
      height: target.height,
      fit: "contain",
      kernel: "lanczos3",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }).png().toBuffer();
    buffer = await sharp(background).composite([{ input: foreground, blend: "over" }]).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  }
  const localPath = writeBufferToCache(buffer, `jiaren_${Date.now()}_${target.width}x${target.height}.png`, options?.cacheDir);
  appendStartupLog(`image-target-normalized source=${options?.sourceLabel ?? ""} actual=${original.width}x${original.height} target=${target.width}x${target.height} fit=${fitMode}`);
  return {
    ...asset,
    localPath,
    dataUrl: fileToDataUrl(localPath),
    width: target.width,
    height: target.height,
    ...targetMeta
  };
}
function sourceExtension(value) {
  if (!value) {
    return ".png";
  }
  const extension = node_path_1.default.extname(value.split("?")[0]).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".webp"].includes(extension)) {
    return extension;
  }
  return ".png";
}
async function importSharp() {
  const sharpModule = require("sharp");
  return sharpModule.default ?? sharpModule;
}
async function importOrt() {
  return Promise.resolve().then(() => require("onnxruntime-node"));
}
function resourceCandidates(...parts) {
  const relativePath = node_path_1.default.join(...parts);
  return [
    node_path_1.default.join(bundledResourceRoot, relativePath),
    node_path_1.default.join(appRoot, relativePath),
    node_path_1.default.join(node_path_1.default.dirname(appRoot), relativePath),
    node_path_1.default.join(process.cwd(), relativePath)
  ];
}
function firstExistingPath(candidates) {
  return candidates.find((candidate) => (0, node_fs_1.existsSync)(candidate));
}
const upscaylExecutableHint = "upscayl-bin 或 realesrgan-ncnn-vulkan 可执行文件";
function upscaylRootCandidates(engineRoot) {
  return [
    engineRoot?.trim(),
    ...resourceCandidates("upscayl"),
    ...resourceCandidates("realesrgan"),
    ...resourceCandidates("upscayl", "resources"),
    node_path_1.default.join(userWritableRoot, ".jiaren", "upscayl")
  ].filter((item) => Boolean(item));
}
function findUpscaylExecutable(root) {
  const candidates = [
    node_path_1.default.join(root, "upscayl-bin.exe"),
    node_path_1.default.join(root, "upscayl-bin"),
    node_path_1.default.join(root, "upscayl-bin-20251207-174704-windows", "upscayl-bin.exe"),
    node_path_1.default.join(root, "bin", "upscayl-bin.exe"),
    node_path_1.default.join(root, "bin", "upscayl-bin"),
    node_path_1.default.join(root, "realesrgan-ncnn-vulkan.exe"),
    node_path_1.default.join(root, "realesrgan-ncnn-vulkan"),
    node_path_1.default.join(root, "bin", "realesrgan-ncnn-vulkan.exe"),
    node_path_1.default.join(root, "bin", "realesrgan-ncnn-vulkan"),
    node_path_1.default.join(root, "resources", "bin", "realesrgan-ncnn-vulkan.exe"),
    node_path_1.default.join(root, "resources", "bin", "realesrgan-ncnn-vulkan"),
    node_path_1.default.join(root, "resources", "realesrgan-ncnn-vulkan.exe"),
    node_path_1.default.join(root, "resources", "realesrgan-ncnn-vulkan"),
    node_path_1.default.join(root, "upscayl-bin", "realesrgan-ncnn-vulkan.exe"),
    node_path_1.default.join(root, "upscayl-bin", "realesrgan-ncnn-vulkan"),
    node_path_1.default.join(root, "macos", "realesrgan-ncnn-vulkan")
  ];
  return firstExistingPath(candidates);
}
function isUpscaylBin(executablePath) {
  return Boolean(executablePath && /upscayl-bin(?:\.exe)?$/i.test(executablePath));
}
function findUpscaylModelsPath(root) {
  const candidates = [
    node_path_1.default.join(root, "models"),
    node_path_1.default.join(root, "bin", "models"),
    node_path_1.default.join(root, "resources", "models"),
    node_path_1.default.join(root, "resources", "bin", "models"),
    node_path_1.default.join(root, "upscayl-bin", "models")
  ];
  return firstExistingPath(candidates);
}
function readUpscaylModels(modelsPath) {
  if (!modelsPath || !(0, node_fs_1.existsSync)(modelsPath)) {
    return [];
  }
  return (0, node_fs_1.readdirSync)(modelsPath).filter((fileName) => /\.param$/i.test(fileName)).map((fileName) => fileName.replace(/\.param$/i, "")).sort((left, right) => left.localeCompare(right));
}
function resolveUpscaylEngine(engineRoot) {
  let partialMatch;
  for (const root of upscaylRootCandidates(engineRoot)) {
    const executablePath = findUpscaylExecutable(root);
    if (isUpscaylBin(executablePath)) {
      return {
        engineRoot: root,
        executablePath,
        models: ["realesrgan-x4plus", "realesrgan-x4plus-anime", "realesrnet-x4plus", "realesr-animevideov3"],
        missing: [],
        engineKind: "upscayl-bin"
      };
    }
    const modelsPath = findUpscaylModelsPath(root);
    if (executablePath || modelsPath) {
      const models = readUpscaylModels(modelsPath);
      const candidate = {
        engineRoot: root,
        executablePath,
        modelsPath,
        models,
        missing: [
          ...executablePath ? [] : [upscaylExecutableHint],
          ...modelsPath && models.length ? [] : ["models/*.param"]
        ],
        engineKind: "realesrgan"
      };
      if (executablePath && modelsPath && models.length) {
        return candidate;
      }
      partialMatch ??= candidate;
    }
  }
  return partialMatch ?? { models: [], missing: [upscaylExecutableHint, "models/*.param"] };
}
function getUpscaylStatus(engineRoot) {
  const paths = resolveUpscaylEngine(engineRoot);
  const ok = Boolean(paths.executablePath && paths.models.length && (paths.engineKind === "upscayl-bin" || paths.modelsPath));
  return {
    ok,
    engineRoot: paths.engineRoot,
    enginePath: paths.executablePath,
    modelsPath: paths.modelsPath,
    models: paths.models,
    message: ok ? `本地高清引擎已就绪：${paths.engineKind === "upscayl-bin" ? "Upscayl" : "Real-ESRGAN"}，可用模型 ${paths.models.length} 个。` : `未找到完整的本地高清引擎。缺少：${paths.missing.join("、")}。可选择包含可执行文件和 models 目录的文件夹。`
  };
}
async function readUpscaylSource(request) {
  if (request.localPath && (0, node_fs_1.existsSync)(request.localPath)) {
    return { inputPath: request.localPath };
  }
  if (request.source && (0, node_fs_1.existsSync)(request.source)) {
    return { inputPath: request.source };
  }
  if (request.source?.startsWith("data:")) {
    const parsed = parseDataUrl(request.source);
    const inputPath = writeBufferToCache(parsed.bytes, `upscayl_input_${Date.now()}${imageExtensionFromMime(parsed.mime)}`, request.cacheDir);
    return { inputPath, cleanup: inputPath };
  }
  if (/^https?:\/\//i.test(request.source)) {
    const inputPath = uniquePath(request.cacheDir?.trim() || defaultCacheDir, `upscayl_input_${Date.now()}${sourceExtension(request.source)}`);
    await (0, jiaren_safe_download_1.downloadFile)(request.source, inputPath, { accept: "image/*,*/*", maxBytes: 512 * 1024 * 1024, timeoutMs: 6e4 });
    return { inputPath, cleanup: inputPath };
  }
  throw new Error("没有可读取的图片源。");
}
function spawnUpscayl(args, cwd) {
  return new Promise((resolve, reject) => {
    const process2 = (0, node_child_process_1.spawn)(args[0], args.slice(1), { cwd, windowsHide: true });
    let stderr = "";
    process2.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    process2.on("error", reject);
    process2.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr.trim() || `本地高清进程退出，代码 ${code}`));
    });
  });
}
async function upscaleImage(request) {
  const startedAt = performance.now();
  const id = node_crypto_1.default.randomUUID();
  let cleanupPath;
  try {
    const paths = resolveUpscaylEngine(request.engineRoot);
    if (!paths.executablePath || paths.models.length === 0 || paths.engineKind !== "upscayl-bin" && !paths.modelsPath) {
      throw new Error(`未找到完整的本地高清引擎。缺少：${paths.missing.join("、")}。`);
    }
    const selectedModel = paths.models.includes(request.model) ? request.model : paths.models.find((model) => /x4plus/i.test(model)) ?? paths.models[0];
    const source = await readUpscaylSource(request);
    cleanupPath = source.cleanup;
    const sourceDimensions = imageDimensions(source.inputPath);
    const outputPath = uniquePath(request.cacheDir?.trim() || defaultCacheDir, `upscayl_${Date.now()}.png`);
    const args = [
      paths.executablePath,
      "-i",
      source.inputPath,
      "-o",
      outputPath,
      "-n",
      selectedModel,
      "-s",
      String(request.scale),
      "-f",
      "png"
    ];
    if (paths.modelsPath) {
      args.push("-m", paths.modelsPath);
    }
    await spawnUpscayl(args, node_path_1.default.dirname(paths.executablePath));
    const dimensions = imageDimensions(outputPath);
    const asset = {
      id: node_crypto_1.default.randomUUID(),
      type: "image",
      localPath: outputPath,
      dataUrl: fileToDataUrl(outputPath),
      width: dimensions.width,
      height: dimensions.height
    };
    return {
      id,
      modelId: "local-upscayl",
      status: "succeeded",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [asset],
      message: `无损高清完成：${selectedModel} ${request.scale}x，${sourceDimensions.width && sourceDimensions.height ? `${sourceDimensions.width} x ${sourceDimensions.height}` : "原图"} -> ${dimensions.width && dimensions.height ? `${dimensions.width} x ${dimensions.height}` : "输出图"}。`
    };
  } catch (error) {
    return {
      id,
      modelId: "local-upscayl",
      status: "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [],
      message: error instanceof Error ? error.message : "无损高清失败。"
    };
  } finally {
    if (cleanupPath && (0, node_fs_1.existsSync)(cleanupPath)) {
      try {
        (0, node_fs_1.rmSync)(cleanupPath, { force: true });
      } catch {
      }
    }
  }
}
const bundledRembgModelConfigs = [
  { fileName: "birefnet-lite.onnx", modelDir: "rmbg2", inputSize: 1024, mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225], sigmoid: true, priority: 40 },
  { fileName: "birefnet-512.onnx", modelDir: "rmbg2", inputSize: 512, mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225], sigmoid: true, priority: 35 }
];
const rembgSessionPromises = /* @__PURE__ */ new Map();
function findBundledRembgModels() {
  return bundledRembgModelConfigs.map((config) => {
    const modelPath = firstExistingPath(resourceCandidates(config.modelDir ?? "rembg", config.fileName));
    return modelPath ? { ...config, modelPath } : void 0;
  }).filter((model) => Boolean(model));
}
async function getBundledRembgSession(modelPath) {
  const existing = rembgSessionPromises.get(modelPath);
  if (existing) {
    return existing;
  }
  const promise = importOrt().then((ort) => ort.InferenceSession.create(modelPath, {
    executionProviders: ["cpu"],
    graphOptimizationLevel: "all",
    intraOpNumThreads: Math.max(1, Math.min(node_os_1.default.cpus().length || 2, 4))
  })).catch((error) => {
    rembgSessionPromises.delete(modelPath);
    throw error;
  });
  rembgSessionPromises.set(modelPath, promise);
  return promise;
}
function buildRembgInputTensor(ort, rgba, config) {
  const size = config.inputSize;
  const channels = 3;
  const data = new Float32Array(channels * size * size);
  const mean = config.mean;
  const std = config.std;
  const pixels = size * size;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sourceIndex = (y * size + x) * 4;
      const targetIndex = y * size + x;
      data[targetIndex] = (rgba[sourceIndex] / 255 - mean[0]) / std[0];
      data[pixels + targetIndex] = (rgba[sourceIndex + 1] / 255 - mean[1]) / std[1];
      data[pixels * 2 + targetIndex] = (rgba[sourceIndex + 2] / 255 - mean[2]) / std[2];
    }
  }
  return new ort.Tensor("float32", data, [1, 3, size, size]);
}
function tensorDataAsFloat32(tensor) {
  if (tensor.data instanceof Float32Array) {
    return tensor.data;
  }
  return Float32Array.from(tensor.data);
}
function maskFromTensorData(data, sigmoid = false) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  const values = sigmoid ? new Float32Array(data.length) : data;
  if (sigmoid) {
    for (let index = 0; index < data.length; index += 1) {
      values[index] = 1 / (1 + Math.exp(-data[index]));
    }
  }
  for (const value of values) {
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  }
  const range = Math.max(max - min, 1e-6);
  const mask = Buffer.alloc(data.length);
  for (let index = 0; index < data.length; index += 1) {
    const normalized = Math.max(0, Math.min(1, (values[index] - min) / range));
    mask[index] = Math.round(normalized * 255);
  }
  return mask;
}
function rembgTensorMaskSize(tensor, fallbackSize) {
  const dims = Array.isArray(tensor.dims) ? tensor.dims : [];
  if (dims.length >= 4) {
    const width = Number(dims[dims.length - 1]);
    const height = Number(dims[dims.length - 2]);
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return { width, height };
    }
  }
  return { width: fallbackSize, height: fallbackSize };
}
async function resizeRembgMask(sharp, rawMask, sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const { data, info } = await sharp(rawMask, { raw: { width: sourceWidth, height: sourceHeight, channels: 1 } }).resize(targetWidth, targetHeight, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  if (info.channels === 1 && data.length === targetWidth * targetHeight) {
    return data;
  }
  const alpha = Buffer.alloc(targetWidth * targetHeight);
  const channels = Math.max(1, info.channels);
  for (let pixel = 0; pixel < alpha.length; pixel += 1) {
    alpha[pixel] = data[pixel * channels] ?? 0;
  }
  return alpha;
}
function alphaStats(alphaMask, width = alphaMask.length, height = 1) {
  let visiblePixels = 0;
  let strongPixels = 0;
  let sum = 0;
  let max = 0;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < alphaMask.length; index += 1) {
    const value = alphaMask[index];
    if (value > 8) {
      visiblePixels += 1;
      const x = index % width;
      const y = Math.floor(index / width);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    if (value > 128) {
      strongPixels += 1;
    }
    if (value > max) {
      max = value;
    }
    sum += value;
  }
  const pixels = Math.max(1, alphaMask.length);
  const bboxWidth = maxX >= minX ? maxX - minX + 1 : 0;
  const bboxHeight = maxY >= minY ? maxY - minY + 1 : 0;
  return {
    coverage: visiblePixels / pixels,
    strongCoverage: strongPixels / pixels,
    mean: sum / pixels,
    max,
    bboxCoverage: bboxWidth * bboxHeight / pixels,
    bboxRatio: bboxHeight > 0 ? bboxWidth / bboxHeight : 0
  };
}
function isUsableRembgMask(stats) {
  return stats.max >= 160 && stats.coverage >= 0.012 && stats.strongCoverage >= 6e-3 && stats.mean >= 2.5 && stats.bboxCoverage >= 0.035;
}
function rembgMaskScore(stats) {
  const coverageScore = stats.coverage <= 0.68 ? 1 - Math.abs(stats.coverage - 0.2) / 0.68 : 0.12;
  const bboxScore = stats.bboxCoverage <= 0.8 ? 1 - Math.abs(stats.bboxCoverage - 0.24) / 0.8 : 0.05;
  return Math.max(0, coverageScore) * 8 + Math.max(0, bboxScore) * 4 + stats.strongCoverage * 9 + Math.min(stats.mean / 255, 1) * 3 + stats.max / 255;
}
function estimateBorderBackground(rgbData, width, height, channels) {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  const border = Math.max(2, Math.round(Math.min(width, height) * 0.035));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (x > border && x < width - border && y > border && y < height - border) {
        continue;
      }
      const index = (y * width + x) * channels;
      r += rgbData[index];
      g += rgbData[index + 1];
      b += rgbData[index + 2];
      count += 1;
    }
  }
  return [r / Math.max(1, count), g / Math.max(1, count), b / Math.max(1, count)];
}
function floodFillBackgroundMask(candidate, width, height) {
  const outside = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  function push(pixel) {
    if (pixel < 0 || pixel >= candidate.length || outside[pixel] || candidate[pixel]) {
      return;
    }
    outside[pixel] = 1;
    queue[tail] = pixel;
    tail += 1;
  }
  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }
  while (head < tail) {
    const pixel = queue[head];
    head += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (x > 0)
      push(pixel - 1);
    if (x + 1 < width)
      push(pixel + 1);
    if (y > 0)
      push(pixel - width);
    if (y + 1 < height)
      push(pixel + width);
  }
  return outside;
}
function dilateBinaryMask(mask, width, height, radius) {
  let current = mask;
  for (let step = 0; step < radius; step += 1) {
    const next = new Uint8Array(current);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const index = y * width + x;
        if (current[index]) {
          continue;
        }
        if (current[index - 1] || current[index + 1] || current[index - width] || current[index + width] || current[index - width - 1] || current[index - width + 1] || current[index + width - 1] || current[index + width + 1]) {
          next[index] = 1;
        }
      }
    }
    current = next;
  }
  return current;
}
function erodeBinaryMask(mask, width, height, radius) {
  let current = mask;
  for (let step = 0; step < radius; step += 1) {
    const next = new Uint8Array(current);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const index = y * width + x;
        if (!current[index]) {
          continue;
        }
        if (!current[index - 1] || !current[index + 1] || !current[index - width] || !current[index + width]) {
          next[index] = 0;
        }
      }
    }
    current = next;
  }
  return current;
}
async function buildProductWhiteBackgroundMask(rgbData, width, height, channels) {
  const [br, bg, bb] = estimateBorderBackground(rgbData, width, height, channels);
  if ((br + bg + bb) / 3 < 198) {
    return void 0;
  }
  const candidate = new Uint8Array(width * height);
  const luma = new Float32Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const index = pixel * channels;
      const r = rgbData[index];
      const g = rgbData[index + 1];
      const b = rgbData[index + 2];
      const colorDistance = Math.sqrt((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2);
      const brightness = (r + g + b) / 3;
      luma[pixel] = brightness;
      if (colorDistance > 12 || brightness < (br + bg + bb) / 3 - 9) {
        candidate[pixel] = 1;
      }
    }
  }
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const pixel = y * width + x;
      const edge = Math.abs(luma[pixel] - luma[pixel - 1]) + Math.abs(luma[pixel] - luma[pixel + 1]) + Math.abs(luma[pixel] - luma[pixel - width]) + Math.abs(luma[pixel] - luma[pixel + width]);
      if (edge > 10) {
        candidate[pixel] = 1;
      }
    }
  }
  const outside = floodFillBackgroundMask(candidate, width, height);
  const object = new Uint8Array(width * height);
  let visible = 0;
  for (let index = 0; index < object.length; index += 1) {
    if (!outside[index]) {
      object[index] = 1;
      visible += 1;
    }
  }
  if (visible / object.length < 0.035) {
    return void 0;
  }
  const closed = erodeBinaryMask(dilateBinaryMask(object, width, height, 5), width, height, 3);
  const alpha = Buffer.alloc(width * height);
  for (let index = 0; index < closed.length; index += 1) {
    alpha[index] = closed[index] ? 255 : 0;
  }
  const sharp = await importSharp();
  return sharp(alpha, { raw: { width, height, channels: 1 } }).blur(0.8).raw().toBuffer();
}
function cleanAlphaMaskComponents(alphaMask, width, height) {
  const pixels = width * height;
  const labels = new Int32Array(pixels);
  const queue = new Int32Array(pixels);
  const components = [];
  let componentId = 0;
  for (let start = 0; start < pixels; start += 1) {
    if (labels[start] || alphaMask[start] <= 12) {
      continue;
    }
    componentId += 1;
    let head = 0;
    let tail = 0;
    let area = 0;
    let strongArea = 0;
    let touchesBorder = false;
    labels[start] = componentId;
    queue[tail] = start;
    tail += 1;
    while (head < tail) {
      const pixel = queue[head];
      head += 1;
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      area += 1;
      if (alphaMask[pixel] > 128) {
        strongArea += 1;
      }
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        touchesBorder = true;
      }
      const neighbors = [pixel - 1, pixel + 1, pixel - width, pixel + width, pixel - width - 1, pixel - width + 1, pixel + width - 1, pixel + width + 1];
      for (const next of neighbors) {
        if (next < 0 || next >= pixels || labels[next] || alphaMask[next] <= 12) {
          continue;
        }
        const nextX = next % width;
        if (Math.abs(nextX - x) > 1) {
          continue;
        }
        labels[next] = componentId;
        queue[tail] = next;
        tail += 1;
      }
    }
    components.push({ id: componentId, area, strongArea, touchesBorder });
  }
  if (components.length <= 1) {
    return alphaMask;
  }
  const nonBorder = components.filter((component) => !component.touchesBorder);
  const ranked = (nonBorder.length ? nonBorder : components).sort((left, right) => right.strongArea - left.strongArea || right.area - left.area);
  const primary = ranked[0];
  if (!primary) {
    return alphaMask;
  }
  const keepIds = /* @__PURE__ */ new Set([primary.id]);
  const minArea = Math.max(pixels * 15e-4, primary.area * 0.08);
  const minStrongArea = Math.max(12, primary.strongArea * 0.04);
  for (const component of components) {
    if (component.id === primary.id) {
      continue;
    }
    if (component.area >= minArea && component.strongArea >= minStrongArea && (!component.touchesBorder || component.strongArea / Math.max(1, component.area) > 0.45)) {
      keepIds.add(component.id);
    }
  }
  const cleaned = Buffer.alloc(alphaMask.length);
  for (let index = 0; index < alphaMask.length; index += 1) {
    const label = labels[index];
    if (label && keepIds.has(label)) {
      cleaned[index] = alphaMask[index] > 22 ? alphaMask[index] : 0;
    }
  }
  return cleaned;
}
function borderSizeForImage(width, height, border) {
  if (!border) {
    return 0;
  }
  const base = Math.max(width, height);
  return Math.max(border === 1 ? 12 : 24, Math.round(base * (border === 1 ? 0.025 : 0.05)));
}
async function removeBackgroundWithBundledModel(sourceBuffer, request) {
  const modelPaths = findBundledRembgModels();
  if (modelPaths.length === 0) {
    return void 0;
  }
  const sharp = await importSharp();
  const ort = await importOrt();
  const { data: rgbData, info: rgbInfo } = await sharp(sourceBuffer).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const width = rgbInfo.width;
  const height = rgbInfo.height;
  if (!width || !height || rgbInfo.channels < 3) {
    return void 0;
  }
  let bestMask;
  let bestStats;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const model of modelPaths) {
    try {
      const { data: resizedRgba } = await sharp(sourceBuffer).rotate().resize(model.inputSize, model.inputSize, { fit: "fill" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const session = await getBundledRembgSession(model.modelPath);
      const inputName = session.inputNames[0];
      const outputName = session.outputNames[0];
      if (!inputName || !outputName) {
        continue;
      }
      const feeds = {
        [inputName]: buildRembgInputTensor(ort, resizedRgba, model)
      };
      const output = await session.run(feeds);
      const tensor = output[outputName];
      if (!tensor) {
        continue;
      }
      const rawMask = maskFromTensorData(tensorDataAsFloat32(tensor), Boolean(model.sigmoid));
      const maskSize = rembgTensorMaskSize(tensor, model.inputSize);
      const alphaMask = await resizeRembgMask(sharp, rawMask, maskSize.width, maskSize.height, width, height);
      const stats = alphaStats(alphaMask, width, height);
      const score = rembgMaskScore(stats) + (model.priority ?? 0) / 100;
      if (score > bestScore) {
        bestMask = alphaMask;
        bestStats = stats;
        bestScore = score;
      }
      if (isUsableRembgMask(stats)) {
        break;
      }
    } catch (error) {
      console.warn("Bundled rembg model failed:", node_path_1.default.basename(model.modelPath), error instanceof Error ? error.message : error);
    }
  }
  if (!bestStats || !isUsableRembgMask(bestStats)) {
    const fallbackMask = await buildProductWhiteBackgroundMask(rgbData, width, height, rgbInfo.channels);
    if (fallbackMask) {
      const fallbackStats = alphaStats(fallbackMask, width, height);
      if (!bestMask || rembgMaskScore(fallbackStats) >= bestScore * 0.75 || !bestStats || bestStats.bboxCoverage < 0.08) {
        bestMask = fallbackMask;
        bestStats = fallbackStats;
      }
    }
  }
  if (!bestMask || !bestStats || !isUsableRembgMask(bestStats)) {
    return void 0;
  }
  bestMask = cleanAlphaMaskComponents(bestMask, width, height);
  bestStats = alphaStats(bestMask, width, height);
  if (!isUsableRembgMask(bestStats)) {
    return void 0;
  }
  const rgbaData = Buffer.alloc(width * height * 4);
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const rgbIndex = pixel * rgbInfo.channels;
    const rgbaIndex = pixel * 4;
    rgbaData[rgbaIndex] = rgbData[rgbIndex];
    rgbaData[rgbaIndex + 1] = rgbData[rgbIndex + 1];
    rgbaData[rgbaIndex + 2] = rgbData[rgbIndex + 2];
    rgbaData[rgbaIndex + 3] = bestMask[pixel];
  }
  let outputPipeline = sharp(rgbaData, { raw: { width, height, channels: 4 } });
  if (request.crop) {
    outputPipeline = outputPipeline.trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 });
  }
  const border = borderSizeForImage(width, height, request.border);
  if (border > 0) {
    outputPipeline = outputPipeline.extend({
      top: border,
      bottom: border,
      left: border,
      right: border,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    });
  }
  const outputFormat = request.outputFormat === "webp" ? "webp" : "png";
  const outputBuffer = outputFormat === "webp" ? await outputPipeline.webp({ quality: 96 }).toBuffer() : await outputPipeline.png().toBuffer();
  const localPath = writeBufferToCache(outputBuffer, `jiaren_local_cutout_${Date.now()}.${outputFormat}`, request.cacheDir);
  return {
    id: node_crypto_1.default.randomUUID(),
    type: "image",
    localPath,
    dataUrl: fileToDataUrl(localPath),
    ...imageDimensions(localPath)
  };
}
async function downloadToCache(url, fileName, directory) {
  const extFromUrl = node_path_1.default.extname(new URL(url).pathname) || ".png";
  const localPath = uniquePath(directory?.trim() || defaultCacheDir, safeFileName(fileName, extFromUrl));
  await (0, jiaren_safe_download_1.downloadFile)(url, localPath, { accept: "image/*,*/*", maxBytes: 512 * 1024 * 1024 });
  return {
    id: node_crypto_1.default.randomUUID(),
    type: "image",
    url,
    localPath,
    dataUrl: fileToDataUrl(localPath),
    ...imageDimensions(localPath)
  };
}
function hashText(value) {
  return node_crypto_1.default.createHash("sha256").update(value).digest("hex");
}
function getMachineCode() {
  const raw = [
    node_os_1.default.hostname(),
    node_os_1.default.userInfo().username,
    node_os_1.default.platform(),
    node_os_1.default.arch(),
    node_os_1.default.cpus()[0]?.model ?? "",
    process.env.PROCESSOR_IDENTIFIER ?? "",
    process.env.COMPUTERNAME ?? "",
    process.env.USERDOMAIN ?? ""
  ].join("|");
  return "JR-" + hashText(raw).slice(0, 8).toUpperCase() + "-" + hashText(raw).slice(8, 16).toUpperCase();
}
function normalizeServerUrl(serverUrl) {
  return serverUrl.trim().replace(/\/+$/, "");
}
function readLicense() {
  ensureLocalRoots();
  const machineCode = getMachineCode();
  if (!(0, node_fs_1.existsSync)(licensePath)) {
    return { active: false, machineCode, message: "δ�����Ա��" };
  }
  try {
    const stored = JSON.parse((0, node_fs_1.readFileSync)(licensePath, "utf-8"));
    return { ...stored, machineCode };
  } catch {
    return { active: false, machineCode, message: "������Ȩ�ļ���ȡʧ�ܣ������¼��" };
  }
}
function saveLicense(status) {
  ensureLocalRoots();
  const next = { ...status, machineCode: getMachineCode() };
  (0, node_fs_1.writeFileSync)(licensePath, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
function openExternalUrl(rawUrl) {
  try {
    const url = new URL(rawUrl.trim());
    if (!["https:", "http:"].includes(url.protocol)) {
      return { ok: false, message: "ֻ�ܴ� HTTP/HTTPS ���ӡ�" };
    }
    void electron_1.shell.openExternal(url.toString());
    return { ok: true, message: "�Ѵ��ⲿ���ӡ�" };
  } catch {
    return { ok: false, message: "���Ӹ�ʽ����ȷ��" };
  }
}
async function downloadUpdate(request, progressSender) {
  let temporaryPath = "";
  try {
    const url = new URL(String(request?.url || "").trim());
    if (url.protocol !== "https:") return { ok: false, message: "更新地址必须使用 HTTPS。" };
    const version = String(request?.version || "").replace(/[^0-9A-Za-z.+-]/g, "").slice(0, 40) || "latest";
    const checksum = String(request?.checksumSha256 || "").trim().toLowerCase();
    if (checksum && !/^[0-9a-f]{64}$/.test(checksum)) return { ok: false, message: "更新包校验值格式不正确。" };
    ensureDir(defaultDownloadsDir);
    const targetPath = uniquePath(defaultDownloadsDir, `Jiaren-AI-${version}.exe`);
    temporaryPath = `${targetPath}.download`;
    await (0, jiaren_safe_download_1.downloadFile)(url.toString(), temporaryPath, {
      timeoutMs: 15 * 60 * 1000,
      maxBytes: 2 * 1024 * 1024 * 1024,
      onProgress: (progress) => {
        try {
          if (progressSender && !progressSender.isDestroyed()) {
            progressSender.send("system:updateDownloadProgress", { ...progress, version });
          }
        } catch {}
      },
    });
    const response = { ok: true, body: true };
    if (!response.ok || !response.body) return { ok: false, message: `下载失败：HTTP ${response.status}` };
    void response;
    if (checksum) {
      const actual = await new Promise((resolve, reject) => {
        const hash = node_crypto_1.default.createHash("sha256");
        const input = (0, node_fs_1.createReadStream)(temporaryPath);
        input.on("error", reject);
        input.on("data", (chunk) => hash.update(chunk));
        input.on("end", () => resolve(hash.digest("hex")));
      });
      if (actual !== checksum) {
        (0, node_fs_1.unlinkSync)(temporaryPath);
        temporaryPath = "";
        return { ok: false, message: "安装包校验失败，已删除文件，请联系管理员。" };
      }
    }
    (0, node_fs_1.renameSync)(temporaryPath, targetPath);
    temporaryPath = "";
    const launchMessage = await electron_1.shell.openPath(targetPath);
    return { ok: true, path: targetPath, launched: launchMessage.length === 0, message: launchMessage || "安装程序已启动。" };
  } catch (error) {
    if (temporaryPath && (0, node_fs_1.existsSync)(temporaryPath)) (0, node_fs_1.unlinkSync)(temporaryPath);
    return { ok: false, message: error instanceof Error ? error.message : "更新下载失败。" };
  }
}
async function resolveGenPsdImageUrl(request) {
  const imageUrl = request.imageUrl.trim();
  if (/^https:\/\//i.test(imageUrl)) {
    return imageUrl;
  }
  const attempts = apiAttempts({
    baseUrl: request.baseUrl ?? "",
    apiKey: request.apiKey ?? "",
    fallbackBaseUrl: request.fallbackBaseUrl,
    fallbackApiKey: request.fallbackApiKey
  });
  if (!attempts.length) {
    throw new Error("��ǰͼƬ�Ǳ����ļ��� dataURL�������� API ��������д֧���ļ��ϴ��ĵ����� API Base URL �� API Key���������Զ��ϴ�Ϊ GenPSD ���õ� HTTPS ͼƬֱ����");
  }
  const references = await normalizeImageSources([
    {
      name: request.name || "genpsd-source.png",
      localPath: request.localPath || (/^(?!data:|https?:)/i.test(imageUrl) ? imageUrl : void 0),
      dataUrl: request.dataUrl || (imageUrl.startsWith("data:image/") ? imageUrl : void 0),
      url: /^https?:\/\//i.test(imageUrl) ? imageUrl : void 0,
      mimeType: request.mimeType
    }
  ], void 0, 1);
  const image = references[0];
  if (!image) {
    throw new Error("û�ж������ϴ���ͼƬ���ݣ��뻻һ�ű���ͼƬ�����µ����زġ�");
  }
  let lastError = "";
  for (const attempt of attempts) {
    try {
      const uploadedUrl = await uploadImageToProvider(image, attempt, void 0, attempt.endpointModelId);
      if (/^https:\/\//i.test(uploadedUrl)) {
        return uploadedUrl;
      }
      lastError = `�ϴ����صĲ��� HTTPS ֱ����${uploadedUrl}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  throw new Error(lastError || "ͼƬ�ϴ�ʧ�ܣ��޷��� GenPSD��");
}
async function openGenPsd(request) {
  try {
    const imageUrl = await resolveGenPsdImageUrl(request);
    const locale = ["zh-cn", "zh-tw", "en", "ja", "ko"].includes(String(request.locale)) ? request.locale : "zh-cn";
    const entry = new URL(`/${locale}/`, "https://www.genpsd.com");
    entry.searchParams.set("picurl", imageUrl);
    return { ok: true, url: entry.toString(), message: "���������ڴ� GenPSD �ֲ�༭����" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "GenPSD ��ʧ�ܡ�" };
  }
}
function hmacSha256(key, value) {
  return node_crypto_1.default.createHmac("sha256", key).update(value, "utf8").digest();
}
function sha256Hex(value) {
  return node_crypto_1.default.createHash("sha256").update(value, "utf8").digest("hex");
}
function utcDateFromTimestamp(timestamp) {
  return new Date(timestamp * 1e3).toISOString().slice(0, 10);
}
function tencentCloudAuthorization(action, payload, request, timestamp) {
  const service = "ai3d";
  const host = "ai3d.tencentcloudapi.com";
  const contentType = "application/json; charset=utf-8";
  const canonicalHeaders = `content-type:${contentType}
host:${host}
x-tc-action:${action.toLowerCase()}
`;
  const signedHeaders = "content-type;host;x-tc-action";
  const canonicalRequest = ["POST", "/", "", canonicalHeaders, signedHeaders, sha256Hex(payload)].join("\n");
  const date = utcDateFromTimestamp(timestamp);
  const credentialScope = `${date}/${service}/tc3_request`;
  const stringToSign = ["TC3-HMAC-SHA256", String(timestamp), credentialScope, sha256Hex(canonicalRequest)].join("\n");
  const secretDate = hmacSha256(`TC3${request.secretKey.trim()}`, date);
  const secretService = hmacSha256(secretDate, service);
  const secretSigning = hmacSha256(secretService, "tc3_request");
  const signature = node_crypto_1.default.createHmac("sha256", secretSigning).update(stringToSign, "utf8").digest("hex");
  return `TC3-HMAC-SHA256 Credential=${request.secretId.trim()}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}
async function callTencentAi3d(action, body, request) {
  const payload = JSON.stringify(body);
  const timestamp = Math.floor(Date.now() / 1e3);
  const headers = {
    Authorization: tencentCloudAuthorization(action, payload, request, timestamp),
    "Content-Type": "application/json; charset=utf-8",
    Host: "ai3d.tencentcloudapi.com",
    "X-TC-Action": action,
    "X-TC-Version": "2025-05-13",
    "X-TC-Timestamp": String(timestamp),
    "X-TC-Region": request.region?.trim() || "ap-guangzhou",
    "X-TC-Language": "zh-CN"
  };
  if (request.token?.trim()) {
    headers["X-TC-Token"] = request.token.trim();
  }
  const response = await fetch("https://ai3d.tencentcloudapi.com", {
    method: "POST",
    headers,
    body: payload
  });
  const text = await response.text();
  const payloadObject = parseResponsePayload(text);
  if (!response.ok) {
    throw new Error(`��Ѷ��Ԫ�� 3D HTTP ${response.status}��${payloadMessage(payloadObject, text, 500) || text.slice(0, 500)}`);
  }
  if (!isRecord(payloadObject) || !isRecord(payloadObject.Response)) {
    throw new Error(`��Ѷ��Ԫ�� 3D ���ظ�ʽ�쳣��${text.slice(0, 500)}`);
  }
  if (isRecord(payloadObject.Response.Error)) {
    const code = readString(payloadObject.Response.Error.Code);
    const message = readString(payloadObject.Response.Error.Message);
    throw new Error(`��Ѷ��Ԫ�� 3D ${code || "Error"}��${message || "����ʧ��"}`);
  }
  return payloadObject.Response;
}
function hunyuan3DFormat(value) {
  const normalized = String(value || "GLB").trim().toUpperCase();
  return ["OBJ", "GLB", "STL", "USDZ", "FBX", "MP4"].includes(normalized) ? normalized : "GLB";
}
function hunyuan3DExtension(type) {
  switch (type.toUpperCase()) {
    case "OBJ":
      return ".zip";
    case "GLB":
      return ".glb";
    case "STL":
      return ".stl";
    case "USDZ":
      return ".usdz";
    case "FBX":
      return ".fbx";
    case "MP4":
      return ".mp4";
    default:
      return ".bin";
  }
}
function runtimeAssetTypeForHunyuan(type) {
  return type.toUpperCase() === "MP4" ? "video" : "text";
}
async function imageBase64ForHunyuan3D(request) {
  if (request.imageBase64?.trim()) {
    return request.imageBase64.trim().replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "");
  }
  if (request.localPath && (0, node_fs_1.existsSync)(request.localPath)) {
    return (0, node_fs_1.readFileSync)(request.localPath).toString("base64");
  }
  const source = request.source?.trim();
  if (source?.startsWith("data:")) {
    return parseDataUrl(source).bytes.toString("base64");
  }
  if (source && (0, node_fs_1.existsSync)(source)) {
    return (0, node_fs_1.readFileSync)(source).toString("base64");
  }
  return void 0;
}
function hunyuanFilesFromResponse(response) {
  const items = Array.isArray(response.ResultFile3Ds) ? response.ResultFile3Ds : [];
  return items.filter(isRecord).map((item) => ({
    type: readString(item.Type) || "GLB",
    url: readString(item.Url) || "",
    previewImageUrl: readString(item.PreviewImageUrl)
  })).filter((item) => item.url);
}
async function downloadHunyuan3DFiles(files, directory) {
  const nextFiles = [];
  const assets = [];
  for (const [index, file] of files.entries()) {
    const type = file.type || "GLB";
    const fileName = `hunyuan_3d_${Date.now()}_${index + 1}${hunyuan3DExtension(type)}`;
    let localPath;
    try {
      localPath = await downloadFileToCache(file.url, fileName, directory);
    } catch {
      localPath = void 0;
    }
    let previewLocalPath;
    if (file.previewImageUrl) {
      try {
        const preview = await imageUrlToAsset(file.previewImageUrl, `hunyuan_3d_preview_${Date.now()}_${index + 1}.png`, directory);
        previewLocalPath = preview.localPath;
        assets.push(preview);
      } catch {
      }
    }
    nextFiles.push({ ...file, localPath, previewLocalPath });
    assets.push({
      id: node_crypto_1.default.randomUUID(),
      type: runtimeAssetTypeForHunyuan(type),
      url: file.url,
      localPath,
      text: type.toUpperCase() === "MP4" ? void 0 : `��Ԫ�� 3D ${type} �ļ���${localPath || file.url}`
    });
  }
  return { files: nextFiles, assets };
}
async function generateHunyuan3D(request) {
  const startedAt = performance.now();
  const id = node_crypto_1.default.randomUUID();
  try {
    if (!request.secretId.trim() || !request.secretKey.trim()) {
      throw new Error("����д��Ѷ�� SecretId �� SecretKey��");
    }
    const imageBase64 = await imageBase64ForHunyuan3D(request);
    const body = {
      ResultFormat: hunyuan3DFormat(request.resultFormat),
      EnablePBR: Boolean(request.enablePbr),
      EnableGeometry: Boolean(request.enableGeometry)
    };
    if (request.imageUrl?.trim()) {
      body.ImageUrl = request.imageUrl.trim();
    } else if (imageBase64) {
      body.ImageBase64 = imageBase64;
    } else if (request.prompt?.trim()) {
      body.Prompt = request.prompt.trim().slice(0, 200);
    } else {
      throw new Error("����д 3D ��ʾ�ʣ���ѡ��һ��ͼƬ��Ϊ���롣");
    }
    if (body.EnableGeometry && body.ResultFormat === "OBJ") {
      body.ResultFormat = "GLB";
    }
    const submit = await callTencentAi3d("SubmitHunyuanTo3DRapidJob", body, request);
    const jobId = readString(submit.JobId);
    if (!jobId) {
      throw new Error("��Ѷ��Ԫ�� 3D δ���� JobId��");
    }
    const maxAttempts = Math.max(1, Math.min(request.maxPollAttempts ?? 120, 360));
    const pollIntervalMs = Math.max(3e3, Math.min((request.pollIntervalSeconds ?? 10) * 1e3, 6e4));
    let lastStatus = "WAIT";
    let lastRequestId = readString(submit.RequestId);
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      }
      const query = await callTencentAi3d("QueryHunyuanTo3DRapidJob", { JobId: jobId }, request);
      lastStatus = readString(query.Status) || lastStatus;
      lastRequestId = readString(query.RequestId) || lastRequestId;
      if (lastStatus === "DONE") {
        const files = hunyuanFilesFromResponse(query);
        const downloaded = await downloadHunyuan3DFiles(files, request.downloadsDir || request.cacheDir);
        return {
          ok: true,
          id,
          jobId,
          status: lastStatus,
          elapsedMs: Math.round(performance.now() - startedAt),
          message: downloaded.files.length ? `��Ԫ�� 3D ������ɣ������� ${downloaded.files.length} ���ļ���` : "��Ԫ�� 3D ������ɣ���û�з��ؿ�����ģ���ļ���",
          files: downloaded.files,
          assets: downloaded.assets,
          requestId: lastRequestId
        };
      }
      if (lastStatus === "FAIL") {
        throw new Error(readString(query.ErrorMessage) || readString(query.ErrorCode) || "��Ѷ��Ԫ�� 3D ����ʧ�ܡ�");
      }
    }
    return {
      ok: false,
      id,
      jobId,
      status: lastStatus,
      elapsedMs: Math.round(performance.now() - startedAt),
      message: `��Ԫ�� 3D �������ύ����δ��ɣ�${jobId}����ǰ״̬ ${lastStatus}���Ժ������Ѷ�ƿ���̨��ѯ��`,
      files: [],
      assets: [],
      requestId: lastRequestId
    };
  } catch (error) {
    return {
      ok: false,
      id,
      elapsedMs: Math.round(performance.now() - startedAt),
      message: error instanceof Error ? error.message : "��Ԫ�� 3D ����ʧ�ܡ�",
      files: [],
      assets: []
    };
  }
}
async function postLicenseApi(serverUrl, pathname, body) {
  const url = normalizeServerUrl(serverUrl) + pathname;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.active === false) {
    return { ...payload, active: false, machineCode: getMachineCode(), message: payload.message ?? `��Ȩ�����쳣��HTTP ${response.status}` };
  }
  return { ...payload, active: true, machineCode: getMachineCode() };
}
async function activateLicense(request) {
  const serverUrl = normalizeServerUrl(request.serverUrl);
  if (!serverUrl || !request.licenseKey.trim()) {
    return { active: false, machineCode: getMachineCode(), message: "����д��Ȩ�����ַ�Ϳ��ܡ�" };
  }
  try {
    const status = await postLicenseApi(serverUrl, "/api/license/activate", {
      licenseKey: request.licenseKey.trim(),
      machineCode: getMachineCode(),
      appVersion: electron_1.app.getVersion()
    });
    if (status.active && status.token) {
      return saveLicense({ ...status, serverUrl, licenseKey: request.licenseKey.trim() });
    }
    return status;
  } catch (error) {
    return { active: false, machineCode: getMachineCode(), message: error instanceof Error ? error.message : "����ʧ�ܡ�" };
  }
}
async function verifyLicense() {
  const stored = readLicense();
  if (!stored.serverUrl || !stored.token) {
    return stored;
  }
  try {
    const status = await postLicenseApi(stored.serverUrl, "/api/license/verify", {
      token: stored.token,
      machineCode: getMachineCode(),
      appVersion: electron_1.app.getVersion()
    });
    return saveLicense({ ...stored, ...status, serverUrl: stored.serverUrl, token: stored.token, licenseKey: stored.licenseKey });
  } catch (error) {
    return { ...stored, active: false, message: error instanceof Error ? error.message : "��ȨУ��ʧ�ܡ�" };
  }
}
async function consumeLicenseQuota(request) {
  const stored = readLicense();
  if (!stored.serverUrl || !stored.token) {
    return { ...stored, active: false, message: "��Աδ����޷��۳���ȡ�" };
  }
  try {
    const status = await postLicenseApi(stored.serverUrl, "/api/license/consume", {
      token: stored.token,
      machineCode: getMachineCode(),
      feature: request.feature,
      amount: request.amount,
      note: request.note
    });
    return saveLicense({ ...stored, ...status, serverUrl: stored.serverUrl, token: stored.token, licenseKey: stored.licenseKey });
  } catch (error) {
    return { ...stored, active: false, message: error instanceof Error ? error.message : "��ȿ۳�ʧ�ܡ�" };
  }
}
async function downloadFileToCache(url, fileName, directory) {
  const extFromUrl = node_path_1.default.extname(new URL(url).pathname) || node_path_1.default.extname(fileName) || ".mp4";
  const localPath = uniquePath(directory?.trim() || defaultCacheDir, safeFileName(fileName, extFromUrl));
  await (0, jiaren_safe_download_1.downloadFile)(url, localPath, { maxBytes: 2 * 1024 * 1024 * 1024 });
  return localPath;
}
function resolveBundledFfmpegPath() {
  const ffmpegName = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  const candidates = [
    node_path_1.default.join(appRoot.replace(/app\.asar$/i, "app.asar.unpacked"), "node_modules", "ffmpeg-static", ffmpegName),
    node_path_1.default.join(bundledResourceRoot, "app.asar.unpacked", "node_modules", "ffmpeg-static", ffmpegName),
    node_path_1.default.join(executableRoot, "resources", "app.asar.unpacked", "node_modules", "ffmpeg-static", ffmpegName),
    !/app\.asar$/i.test(appRoot) ? node_path_1.default.join(appRoot, "node_modules", "ffmpeg-static", ffmpegName) : void 0,
    ffmpegName
  ];
  return candidates.find((candidate) => candidate && (candidate === ffmpegName || !/app\.asar[\\/]/i.test(candidate) && (0, node_fs_1.existsSync)(candidate)));
}
async function imageUrlToAsset(url, fileName, directory, options) {
  try {
    const asset = await downloadToCache(url, fileName, directory);
    const withDataUrl = asset.dataUrl ? asset : { ...asset, dataUrl: asset.localPath ? fileToDataUrl(asset.localPath) : void 0 };
    return await normalizeImageAssetToTarget(withDataUrl, { ...options, cacheDir: directory });
  } catch {
    return {
      id: node_crypto_1.default.randomUUID(),
      type: "image",
      url
    };
  }
}
function collectUrlLikeStrings(value) {
  const urls = [];
  const visit = (item) => {
    if (typeof item === "string") {
      if (/^https?:\/\//i.test(item)) {
        urls.push(item);
      }
      return;
    }
    if (Array.isArray(item)) {
      item.forEach(visit);
      return;
    }
    if (isRecord(item)) {
      Object.values(item).forEach(visit);
    }
  };
  visit(value);
  return Array.from(new Set(urls));
}
function isImageTaskId(value) {
  return Boolean(value && (/^(task_|tsk_|img_|image_|video_)/i.test(value) || /^B\d{14,}[A-Za-z0-9_-]*Master$/i.test(value)));
}
function isLikelyTaskEndpointUrl(value) {
  return /\/(tasks|generations|async-result|status)(\/|$)/i.test(value) && !/(\.(png|jpe?g|webp|gif)(\?|$))|\/output\/|\/generated\/|\/uploads\//i.test(value);
}
function extractImageUrls(payload) {
  const urls = /* @__PURE__ */ new Set();
  const add = (value, force = false) => {
    if (!/^https?:\/\//i.test(value) || !force && isLikelyTaskEndpointUrl(value)) {
      return;
    }
    urls.add(value);
  };
  for (const value of collectUrlLikeStrings(payload)) {
    if (/(\.(png|jpe?g|webp|gif)(\?|$))|\/output\/|\/generated\/|\/uploads\/|\/f\/image\/|files\.dashlyai\.|upload\.apimart\.ai|fal\.media|qwenlm\.ai|image|images/i.test(value)) {
      add(value);
    }
  }
  const visit = (item, keyHint = "") => {
    if (typeof item === "string") {
      const key = keyHint.toLowerCase();
      if (/^(image|images|image_url|image_urls|url|urls|file|files|file_url|download_url|asset_url|media_url|original_url|download|downloads|output|outputs|result|results|artifact|artifacts|data|content|src|cover|thumbnail|preview)$/i.test(keyHint) || /image|img|photo|picture|asset|media|artifact|output|result|file|download|cover|thumbnail|preview|url/.test(key) && !/poll|status|response|callback|webhook|endpoint/.test(key)) {
        add(item, true);
      }
      return;
    }
    if (Array.isArray(item)) {
      item.forEach((child) => visit(child, keyHint));
      return;
    }
    if (isRecord(item)) {
      for (const [key, value] of Object.entries(item)) {
        visit(value, key);
      }
    }
  };
  visit(payload);
  return Array.from(urls);
}
function payloadShapeSummary(payload) {
  if (!isRecord(payload)) {
    return Array.isArray(payload) ? `array(${payload.length})` : typeof payload;
  }
  const keys = Object.keys(payload).slice(0, 12);
  const nested = keys.map((key) => {
    const value = payload[key];
    if (Array.isArray(value)) {
      return `${key}[${value.length}]`;
    }
    if (isRecord(value)) {
      return `${key}{${Object.keys(value).slice(0, 8).join(",")}}`;
    }
    return key;
  }).join(",");
  return nested || "object";
}
function extractTaskId(payload) {
  if (!isRecord(payload)) {
    return void 0;
  }
  const id = readString(payload.id);
  if (isImageTaskId(id)) {
    return id;
  }
  const direct = readString(payload.task_id) || readString(payload.taskId) || readString(payload.taskID) || readString(payload.job_id) || readString(payload.jobId);
  if (direct) {
    return direct;
  }
  if (Array.isArray(payload.data)) {
    for (const item of payload.data) {
      if (!isRecord(item)) {
        continue;
      }
      const itemTaskId = readString(item.task_id) || readString(item.taskId) || readString(item.id) || readString(item.request_id) || readString(item.job_id) || readString(item.jobId);
      if (itemTaskId) {
        return itemTaskId;
      }
    }
  }
  const requestId = readString(payload.request_id);
  if (requestId) {
    return requestId;
  }
  const dataString = readString(payload.data);
  if (dataString && (readString(payload.code) || Object.prototype.hasOwnProperty.call(payload, "message") || readString(payload.status))) {
    return dataString;
  }
  if (isRecord(payload.data)) {
    const dataId = readString(payload.data.id);
    if (isImageTaskId(dataId)) {
      return dataId;
    }
    return readString(payload.data.task_id) || readString(payload.data.taskId) || readString(payload.data.request_id) || readString(payload.data.job_id) || readString(payload.data.jobId);
  }
  return void 0;
}
function parseImageTaskStatus(payload) {
  if (!isRecord(payload)) {
    return void 0;
  }
  const direct = readString(payload.status) || readString(payload.task_status) || readString(payload.taskStatus) || readString(payload.state) || readString(payload.phase);
  if (direct) {
    return direct;
  }
  if (isRecord(payload.data)) {
    return readString(payload.data.status) || readString(payload.data.task_status) || readString(payload.data.taskStatus) || readString(payload.data.state) || readString(payload.data.phase);
  }
  if (Array.isArray(payload.data)) {
    for (const item of payload.data) {
      if (isRecord(item)) {
        const status = readString(item.status) || readString(item.task_status) || readString(item.taskStatus) || readString(item.state);
        if (status) {
          return status;
        }
      }
    }
  }
  if (isRecord(payload.result)) {
    return readString(payload.result.status);
  }
  if (isRecord(payload.data) && isRecord(payload.data.result)) {
    return readString(payload.data.result.status);
  }
  return void 0;
}
function isSucceededStatus(status) {
  const value = (status ?? "").trim();
  if (value === "3") {
    return true;
  }
  return ["SUCCESS", "SUCCEEDED", "COMPLETED", "COMPLETE", "DONE", "FINISHED", "SUCCESSFUL", "OK", "READY"].includes(value.toUpperCase()) || /�ɹ�|���|�����|����/.test(value);
}
function isFailedStatus(status) {
  const value = (status ?? "").trim();
  if (value === "2") {
    return true;
  }
  return ["FAIL", "FAILED", "FAILURE", "ERROR", "ERRORED", "CANCELLED", "CANCELED", "TIMEOUT", "TIMED_OUT", "EXPIRED", "REJECTED"].includes(value.toUpperCase()) || /ʧ��|����|ȡ��|��ʱ/.test(value);
}
function taskFailureReason(payload) {
  if (!isRecord(payload)) {
    return void 0;
  }
  const readError = (value) => {
    if (!isRecord(value)) {
      return typeof value === "string" && value.trim() ? value : void 0;
    }
    return readString(value.message) || readString(value.code) || readString(value.type) || readString(value.error) || readString(value.detail);
  };
  return readString(payload.fail_reason) || readError(payload.error) || readString(payload.message) || (isRecord(payload.data) ? readString(payload.data.fail_reason) || readError(payload.data.error) || readString(payload.data.message) : void 0) || (isRecord(payload.result) ? readString(payload.result.fail_reason) || readError(payload.result.error) || readString(payload.result.message) : void 0);
}
function extractPollEndpoint(payload, baseUrl) {
  if (!isRecord(payload)) {
    return void 0;
  }
  const candidates = [
    payload.poll_url,
    payload.status_url,
    payload.response_url,
    isRecord(payload.data) ? payload.data.poll_url : void 0,
    isRecord(payload.data) ? payload.data.status_url : void 0,
    isRecord(payload.data) ? payload.data.response_url : void 0
  ];
  for (const candidate of candidates) {
    const value = readString(candidate);
    if (!value) {
      continue;
    }
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    try {
      return new URL(value, `${baseUrl.replace(/\/+$/, "")}/`).toString();
    } catch {
    }
  }
  return void 0;
}
function buildImageTaskPollUrls(baseUrl, taskId, pollEndpoint, clientBusinessId) {
  const candidates = /* @__PURE__ */ new Set();
  if (pollEndpoint) {
    candidates.add(pollEndpoint);
  }
  for (const id of Array.from(new Set([taskId, clientBusinessId].filter((value) => Boolean(value?.trim()))))) {
    candidates.add(resolveEndpoint(baseUrl, `/images/tasks/${id}`));
    candidates.add(resolveEndpoint(baseUrl, `/images/generations/${id}`));
    candidates.add(resolveEndpoint(baseUrl, `/tasks/${id}`));
    candidates.add(resolveEndpoint(baseUrl, `/images/async-result/${id}`));
    candidates.add(resolveEndpoint(baseUrl, `/images/generations/async-result/${id}`));
  }
  return Array.from(candidates);
}
function extractResponseEndpoint(payload, baseUrl) {
  if (!isRecord(payload)) {
    return void 0;
  }
  const candidates = [
    payload.response_url,
    payload.result_url,
    isRecord(payload.data) ? payload.data.response_url : void 0,
    isRecord(payload.data) ? payload.data.result_url : void 0
  ];
  for (const candidate of candidates) {
    const value = readString(candidate);
    if (!value) {
      continue;
    }
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    if (value.startsWith("/")) {
      return `${baseUrl.replace(/\/+$/, "")}${value}`;
    }
  }
  return void 0;
}
async function assetsFromImagePayload(payload, limit, cacheDir, options) {
  const assets = [];
  const openAI = parseOpenAIImagesPayload(payload);
  if (openAI?.data && Array.isArray(openAI.data)) {
    for (const item of openAI.data) {
      if (!isRecord(item) || assets.length >= limit) {
        continue;
      }
      const url = readString(item.url);
      const urlList = Array.isArray(item.url) ? item.url.map(readString).filter((value) => Boolean(value)) : [];
      const base64 = readString(item.b64_json) || readString(item.base64) || readString(item.image_base64) || readString(item.result_base64);
      if (url) {
        assets.push(await imageUrlToAsset(url, `jiaren_${Date.now()}_${assets.length + 1}.png`, cacheDir, options));
      } else if (urlList.length > 0) {
        for (const itemUrl of urlList.slice(0, limit - assets.length)) {
          assets.push(await imageUrlToAsset(itemUrl, `jiaren_${Date.now()}_${assets.length + 1}.png`, cacheDir, options));
        }
      } else if (base64) {
        const parsed = parseDataUrl(base64);
        const localPath = writeBufferToCache(parsed.bytes, generatedImageFileName(assets.length + 1, parsed.mime), cacheDir);
        assets.push(await normalizeImageAssetToTarget({
          id: node_crypto_1.default.randomUUID(),
          type: "image",
          localPath,
          dataUrl: fileToDataUrl(localPath),
          ...imageDimensions(localPath)
        }, { ...options, cacheDir }));
      }
    }
  }
  if (assets.length < limit) {
    for (const url of extractImageUrls(payload).slice(0, limit - assets.length)) {
      assets.push(await imageUrlToAsset(url, `jiaren_${Date.now()}_${assets.length + 1}.png`, cacheDir, options));
    }
  }
  if (assets.length < limit) {
    for (const base64 of extractBase64Images(payload).slice(0, limit - assets.length)) {
      const parsed = parseDataUrl(base64);
      const localPath = writeBufferToCache(parsed.bytes, generatedImageFileName(assets.length + 1, parsed.mime), cacheDir);
      assets.push(await normalizeImageAssetToTarget({
        id: node_crypto_1.default.randomUUID(),
        type: "image",
        localPath,
        dataUrl: fileToDataUrl(localPath),
        ...imageDimensions(localPath)
      }, { ...options, cacheDir }));
    }
  }
  return assets;
}
function getModelMeta(modelId) {
  const normalizedModelId = normalizeRuntimeModelKey(modelId) ?? modelId;
  const builtIn = isDynamicProviderModelId(modelId) ? void 0 : builtInModelMeta[normalizedModelId] ?? builtInModelMeta[modelId];
  if (builtIn) {
    return builtIn;
  }
  const preferences = normalizePersistedPreferences(readPreferences());
  const stored = preferences.runtimeSettings?.models?.find((model) => model.id === normalizedModelId || model.id === modelId) ?? preferences.runtimeSettings?.models?.find((model) => model.modelId === normalizedModelId || model.modelId === modelId) ?? preferences.runtimeSettings?.models?.find((model) => model.endpointModelId === modelId);
  if (stored) {
    return {
      requestMode: stored.requestMode,
      endpointModelId: stored.endpointModelId,
      fallbackEndpointModelId: stored.fallbackEndpointModelId,
      apiGroup: stored.apiGroup,
      alias: stored.alias
    };
  }
  return void 0;
}
function extractBase64Images(payload) {
  const values = [];
  const visit = (value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.startsWith("data:image/") || isLikelyImageBase64(trimmed)) {
        values.push(value);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (isRecord(value)) {
      for (const key of ["b64_json", "base64", "image_base64", "result_base64", "data", "image", "image_data", "output_image", "output_base64"]) {
        const maybe = value[key];
        if (typeof maybe === "string" && (maybe.startsWith("data:image/") || isLikelyImageBase64(maybe))) {
          values.push(maybe);
        }
      }
      Object.values(value).forEach(visit);
    }
  };
  visit(payload);
  return Array.from(new Set(values));
}
function isLikelyImageBase64(value) {
  const normalized = value.replace(/\s+/g, "");
  if (normalized.length < 5e3 || normalized.length % 4 === 1 || !/^[A-Za-z0-9+/]+={0,2}$/.test(normalized)) {
    return false;
  }
  return /^(iVBORw0KGgo|\/9j\/|UklGR|R0lGOD)/.test(normalized);
}
function parseDataUrl(value) {
  const match = value.match(/^data:([^,]*),(.*)$/s);
  if (!match) {
    return { mime: "image/png", bytes: Buffer.from(value, "base64") };
  }
  const meta = match[1] || "";
  const raw = match[2] || "";
  const mime = meta.split(";")[0] || "application/octet-stream";
  const isBase64 = meta.split(";").some((part) => part.toLowerCase() === "base64");
  if (isBase64) {
    return { mime, bytes: Buffer.from(raw, "base64") };
  }
  try {
    return { mime, bytes: Buffer.from(decodeURIComponent(raw), "utf8") };
  } catch {
    return { mime, bytes: Buffer.from(raw, "utf8") };
  }
}
async function dataUrlFromRemoteImage(url, signal) {
  void signal;
  const downloaded = await (0, jiaren_safe_download_1.downloadBuffer)(url, { accept: "image/*,*/*", maxBytes: 128 * 1024 * 1024 });
  const response = { ok: true, arrayBuffer: async () => downloaded.buffer, headers: { get: () => downloaded.contentType } };
  if (!response.ok) {
    throw new Error(`��ȡ�ο�ͼʧ�ܣ�HTTP ${response.status}`);
  }
  const mime = response.headers.get("content-type")?.split(";")[0] || "image/png";
  const bytes = Buffer.from(await response.arrayBuffer());
  return { mime, bytes, dataUrl: `data:${mime};base64,${bytes.toString("base64")}` };
}
async function normalizeUploadableImageBytes(image) {
  const sourceMime = image.mime.split(";")[0].toLowerCase();
  const mime = /image\/(png|jpe?g|webp|gif)$/i.test(sourceMime) ? sourceMime : "image/png";
  const maxBytes = 9.5 * 1024 * 1024;
  if (/image\/(png|jpe?g|webp|gif)$/i.test(sourceMime) && image.bytes.byteLength <= maxBytes && /\.(png|jpe?g|webp|gif)$/i.test(image.name)) {
    return { mime, bytes: image.bytes, name: image.name };
  }
  const sharp = await importSharp();
  let quality = 92;
  let width;
  let output = await sharp(image.bytes).rotate().jpeg({ quality, mozjpeg: true }).toBuffer();
  while (output.byteLength > maxBytes && quality > 58) {
    quality -= 8;
    output = await sharp(image.bytes).rotate().resize(width ? { width, withoutEnlargement: true } : { withoutEnlargement: true }).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (output.byteLength > maxBytes) {
      width = width ? Math.max(768, Math.round(width * 0.82)) : 2048;
    }
  }
  return { mime: "image/jpeg", bytes: output, name: safeFileName(image.name.replace(/\.[^.]+$/, "") || "reference", ".jpg") };
}
async function normalizeImageSources(sources, signal, limit = 14) {
  const seen = /* @__PURE__ */ new Set();
  const references = [];
  for (const [index, source] of sources.entries()) {
    const key = source.localPath || source.dataUrl || source.url;
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    try {
      const name = safeFileName(source.name || `reference-${index + 1}.png`);
      const referenceMeta = {
        referenceKey: source.referenceKey,
        referenceRole: source.referenceRole,
        referenceDescription: source.referenceDescription,
        referenceSlot: source.referenceSlot
      };
      if (source.localPath && (0, node_fs_1.existsSync)(source.localPath)) {
        const bytes = (0, node_fs_1.readFileSync)(source.localPath);
        const mime = source.mimeType || guessMime(source.localPath);
        references.push({ name, mime, bytes, dataUrl: `data:${mime};base64,${bytes.toString("base64")}`, ...referenceMeta });
        continue;
      }
      if (source.dataUrl?.startsWith("data:image/")) {
        const parsed = parseDataUrl(source.dataUrl);
        references.push({ name, mime: source.mimeType || parsed.mime, bytes: parsed.bytes, dataUrl: source.dataUrl, ...referenceMeta });
        continue;
      }
      const url = source.url || (/^https?:\/\//i.test(source.localPath ?? "") ? source.localPath : void 0) || (/^https?:\/\//i.test(source.dataUrl ?? "") ? source.dataUrl : void 0);
      if (url) {
        const remote = await dataUrlFromRemoteImage(url, signal);
        references.push({ name, ...remote, url, ...referenceMeta });
      }
    } catch {
    }
  }
  return references.slice(0, limit);
}
async function normalizeReferenceImages(request, signal) {
  return normalizeImageSources([
    ...request.referenceImages ?? [],
    ...request.referenceImagePaths.map((localPath) => ({ localPath }))
  ], signal, 14);
}
async function normalizeMaskImage(request, signal) {
  if (!request.maskImage) {
    return void 0;
  }
  return (await normalizeImageSources([request.maskImage], signal, 1))[0];
}
function extractUploadedImageUrl(payload) {
  if (!isRecord(payload)) {
    return void 0;
  }
  const data = payload.data;
  if (Array.isArray(data)) {
    for (const item of data) {
      if (isRecord(item)) {
        const url = readString(item.url) || readString(item.image_url) || readString(item.src);
        if (url) {
          return url;
        }
      }
    }
  }
  return readString(payload.url) || readString(payload.image_url) || readString(payload.file_url) || (isRecord(payload.data) ? readString(payload.data.url) : void 0) || (isRecord(payload.data) ? readString(payload.data.image_url) : void 0) || (isRecord(payload.result) ? readString(payload.result.url) : void 0) || (isRecord(payload.result) ? readString(payload.result.image_url) : void 0);
}
function uploadedImageUrlFromPayload(payload) {
  return extractUploadedImageUrl(payload) ?? extractImageUrls(payload)[0] ?? collectUrlLikeStrings(payload).find((value) => /^https:\/\//i.test(value));
}
async function uploadImageToProvider(image, attempt, signal, modelId) {
  if (image.url && /^https?:\/\//i.test(image.url)) {
    return image.url;
  }
  const uploadable = await normalizeUploadableImageBytes(image);
  const uploadModel = modelId?.trim() || attempt.endpointModelId?.trim() || "gpt-image-2";
  const failures = [];
  for (const endpoint of uniqueUploadEndpoints(attempt.baseUrl)) {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(uploadable.bytes)], { type: uploadable.mime }), uploadable.name);
    form.append("purpose", "generation");
    form.append("model", uploadModel);
    form.append("model_name", uploadModel);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${attempt.apiKey}`,
          Accept: "application/json"
        },
        body: form,
        signal
      });
      const text = await response.text();
      const payload = parseResponsePayload(text);
      if (!response.ok) {
        failures.push(`${new URL(endpoint).pathname} HTTP ${response.status}: ${explainProviderFailure(response.status, payload, text)}`);
        continue;
      }
      const url = uploadedImageUrlFromPayload(payload);
      if (url) {
        image.url = url;
        return url;
      }
      failures.push(`${new URL(endpoint).pathname} δ���� URL: ${payloadMessage(payload, text, 220) || text.slice(0, 220)}`);
    } catch (error) {
      failures.push(`${new URL(endpoint).pathname} ����ʧ��: ${readableFetchError(error)}`);
    }
  }
  throw new Error(`�ϴ��ο�ͼʧ�ܡ��ѳ��Լ����ϴ��ӿڣ�${failures.slice(0, 4).join("��")}�������ʧ�ܣ����� GenPSD ʹ�ù��� HTTPS ͼƬ����ȷ�ϵ����� API �Ƿ�ͨ�ļ��ϴ���`);
}
async function apiMartReferenceUrls(references, attempt, limit = 16, signal, modelId) {
  const urls = [];
  for (const image of references.slice(0, limit)) {
    urls.push(await uploadImageToProvider(image, attempt, signal, modelId));
  }
  return urls.filter((value) => /^https?:\/\//i.test(value));
}
async function apiMartReferenceItems(references, attempt, limit = 16, signal, modelId) {
  const items = [];
  for (const image of references.slice(0, limit)) {
    const url = await uploadImageToProvider(image, attempt, signal, modelId);
    if (/^https?:\/\//i.test(url)) {
      items.push({
        url,
        name: image.name,
        referenceRole: image.referenceRole,
        referenceDescription: image.referenceDescription,
        referenceSlot: image.referenceSlot
      });
    }
  }
  return items;
}
async function createApiMartImageGeneration(request, attempt, modelMeta, references, maskImage, signal) {
  const endpointModelId = await resolveAttemptModelIdFromProviderList({ ...request, category: "image" }, attempt, modelMeta, signal);
  const referenceUrls = await apiMartReferenceUrls(references, attempt, 16, signal, endpointModelId);
  const maskUrl = maskImage && supportsApiMartMaskUrl(endpointModelId) ? await uploadImageToProvider(maskImage, attempt, signal, endpointModelId) : void 0;
  const bodyPayload = buildApiMartImagePayload({ ...request, endpointModelId }, referenceUrls, maskUrl);
  const useAsyncTask = request.async || isApiMartGptImage2Model(endpointModelId);
  appendStartupLog(`apiMart-image-payload ${JSON.stringify({
    model: bodyPayload.model,
    size: bodyPayload.size,
    resolution: bodyPayload.resolution,
    aspect_ratio: bodyPayload.aspect_ratio,
    image_size: bodyPayload.image_size,
    metadata: bodyPayload.metadata,
    quality: bodyPayload.quality,
    image: Array.isArray(bodyPayload.image) ? bodyPayload.image.length : bodyPayload.image ? 1 : void 0,
    image_urls: Array.isArray(bodyPayload.image_urls) ? bodyPayload.image_urls.length : void 0,
    reference_images: Array.isArray(bodyPayload.reference_images) ? bodyPayload.reference_images.length : void 0,
    async: useAsyncTask
  })}`);
  const endpoint = `${resolveA2ImageEndpoint(attempt.baseUrl)}${useAsyncTask ? "?async=true" : ""}`;
  const chatEndpoint = resolveA2ImageChatEndpoint(attempt.baseUrl);
  const submitOnce = async () => {
    const response2 = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${attempt.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyPayload),
      signal
    });
    const text2 = await response2.text();
    return { response: response2, text: text2, payload: parseResponsePayload(text2) };
  };
  const submitChatOnce = async () => {
    const response2 = await fetch(chatEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${attempt.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildApiMartImageChatPayload({ ...request, endpointModelId }, referenceUrls)),
      signal
    });
    const text2 = await response2.text();
    return { response: response2, text: text2, payload: parseResponsePayload(text2) };
  };
  let response;
  let text = "";
  let payload = {};
  try {
    const first = await submitOnce();
    response = first.response;
    text = first.text;
    payload = first.payload;
    if (!response.ok && isApiMartGptImage2Model(endpointModelId) && response.status >= 500 && /ϵͳ��æ|busy|temporar|timeout|upstream|traceid/i.test(providerPayloadMessage(payload, text, 700) || text)) {
      appendStartupLog(`apiMart-image-retry model=${endpointModelId} size=${String(bodyPayload.size ?? "")} reason=${providerPayloadMessage(payload, text, 220) || text.slice(0, 220)}`);
      await new Promise((resolve) => setTimeout(resolve, 1800));
      const second = await submitOnce();
      response = second.response;
      text = second.text;
      payload = second.payload;
    }
    if (!response.ok && isRouteCapabilityError(payload, text)) {
      appendStartupLog(`apiMart-image-chat-route-fallback from=${endpoint} to=${chatEndpoint} model=${endpointModelId} reason=${explainProviderFailure(response.status, payload, text).slice(0, 320)}`);
      const chatResult = await submitChatOnce();
      response = chatResult.response;
      text = chatResult.text;
      payload = chatResult.payload;
    }
  } catch (error) {
    const message = readableFetchError(error);
    appendStartupLog(`apiMart-image-submit-error endpoint=${endpoint} model=${endpointModelId} reason=${message}`);
    throw new Error(`�����ύ�����жϣ�${message}`);
  }
  if (!response.ok) {
    const message = explainProviderFailure(response.status, payload, text);
    appendStartupLog(`apiMart-image-submit-failed endpoint=${endpoint} model=${endpointModelId} status=${response.status} reason=${message.slice(0, 700)}`);
    throw new Error(`HTTP ${response.status}��${message}`);
  }
  appendStartupLog(`apiMart-image-result status=${response.status} shape=${payloadShapeSummary(payload)} urlCount=${extractImageUrls(payload).length} b64Count=${extractBase64Images(payload).length} task=${extractTaskId(payload) ?? ""} taskStatus=${parseImageTaskStatus(payload) ?? ""} bytes=${text.length}`);
  return { response, text, payload, attempt };
}
async function pollApiMartImageTask(initialPayload, activeAttempt, request, startedAt, signal) {
  const taskId = extractTaskId(initialPayload);
  const endpointModelId = endpointModelIdForRequest(request, activeAttempt, getModelMeta(request.modelId));
  const targetSize = targetSizeForApiMartImageRequest(request, endpointModelId);
  const assetOptions = targetSize ? { targetSize, sourceLabel: endpointModelId, cacheDir: request.cacheDir } : void 0;
  const assets = await assetsFromImagePayload(initialPayload, request.count, request.cacheDir, assetOptions);
  const clientBusinessId = void 0;
  let taskStatus = parseImageTaskStatus(initialPayload);
  let taskMessage = taskFailureReason(initialPayload) || providerPayloadMessage(initialPayload, "", 700);
  let pollUrl = extractResponseEndpoint(initialPayload, activeAttempt.baseUrl) || extractPollEndpoint(initialPayload, activeAttempt.baseUrl);
  if (assets.length === 0 && (taskId || pollUrl || clientBusinessId)) {
    const pollUrls = buildImageTaskPollUrls(activeAttempt.baseUrl, taskId, pollUrl, clientBusinessId);
    let completedPollsWithoutAsset = 0;
    for (let attemptIndex = 0; attemptIndex < 120; attemptIndex += 1) {
      await new Promise((resolve) => setTimeout(resolve, attemptIndex < 1 ? 1600 : 3e3));
      for (const resolvedPollUrl of pollUrls) {
        let pollResponse;
        try {
          pollResponse = await fetch(resolvedPollUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${activeAttempt.apiKey}`,
              Accept: "application/json"
            },
            signal
          });
        } catch (error) {
          taskMessage = `�������ύ�������β�ѯ���粨����${readableFetchError(error)}`;
          continue;
        }
        if (pollResponse.status === 404 || pollResponse.status === 405) {
          continue;
        }
        pollUrl = resolvedPollUrl;
        const pollText = await pollResponse.text();
        const pollPayload = parseResponsePayload(pollText);
        if (!pollResponse.ok) {
          taskMessage = explainProviderFailure(pollResponse.status, pollPayload, pollText) || taskMessage;
          continue;
        }
        taskStatus = parseImageTaskStatus(pollPayload) ?? taskStatus;
        taskMessage = taskFailureReason(pollPayload) || providerPayloadMessage(pollPayload, "", 700) || taskMessage;
        assets.push(...await assetsFromImagePayload(pollPayload, request.count - assets.length, request.cacheDir, assetOptions));
        appendStartupLog(`apiMart-image-poll status=${taskStatus ?? ""} assets=${assets.length} urlCount=${extractImageUrls(pollPayload).length} poll=${resolvedPollUrl}`);
        if (assets.length > 0) {
          break;
        }
        if (isFailedStatus(taskStatus)) {
          return {
            id: node_crypto_1.default.randomUUID(),
            modelId: request.modelId,
            status: "failed",
            elapsedMs: Math.round(performance.now() - startedAt),
            assets: [],
            message: explainAsyncTaskFailure(taskMessage) || "������ API ͼƬ����ʧ�ܡ�",
            taskId,
            taskStatus,
            pollUrl
          };
        }
        if (isSucceededStatus(taskStatus)) {
          completedPollsWithoutAsset += 1;
          if (completedPollsWithoutAsset < 45) {
            continue;
          }
          break;
        }
      }
      if (assets.length > 0 || isFailedStatus(taskStatus)) {
        break;
      }
      if (isSucceededStatus(taskStatus) && assets.length === 0 && completedPollsWithoutAsset >= 45) {
        break;
      }
    }
  }
  return {
    id: node_crypto_1.default.randomUUID(),
    modelId: request.modelId,
    status: assets.length > 0 ? "succeeded" : isFailedStatus(taskStatus) || !taskId && !pollUrl && !clientBusinessId ? "failed" : "queued",
    elapsedMs: Math.round(performance.now() - startedAt),
    assets,
    message: assets.length > 0 ? withFallbackMessage("ͼƬ������ɡ�", activeAttempt) : isSucceededStatus(taskStatus) ? `ͼƬ��������ɣ�����Ӧ��û�п�����ͼƬ URL��${taskMessage ? `����˷��أ�${taskMessage}` : "���ڵ�����ƽ̨��̨�鿴���� result �ֶΡ�"}` : !taskId && !pollUrl && !clientBusinessId ? `�ӿ��ѷ��أ�������û������Ӧ�н�����ͼƬ���ݡ���鿴������־��� apiMart-image-result��${taskMessage ? taskMessage.slice(0, 220) : "��Ӧû��ͼƬ URL �� b64_json �ֶΡ�"}` : explainAsyncTaskFailure(taskMessage) || (taskId ? `���� ${taskId} ���ύ������δ����ͼƬ��` : `�������ύ��ҵ��ID ${clientBusinessId} ��δ����ͼƬ��`),
    taskId,
    taskStatus,
    pollUrl
  };
}
async function createApiMartImageGenerationWithFallback(request, attempts, modelMeta, references, maskImage, signal) {
  const failures = [];
  if (attempts.length === 0) {
    throw new Error("??? API ????? Base URL ? API Key?");
  }
  const maxSameModelAttempts = maxSameImageModelAttempts();
  const lockedEndpointModelId = imageModelIdForRequest(request, void 0, modelMeta);
  const lockedRequest = withImageEndpointModel(request, lockedEndpointModelId);
  for (const attempt of attempts) {
    const lockedAttempt = { ...attempt, endpointModelId: lockedEndpointModelId };
    const modelQueue = [lockedEndpointModelId].filter((model, index, list) => model && list.indexOf(model) === index);
    try {
      let lastMessage = "";
      for (const endpointModelId of modelQueue) {
        for (let retryIndex = 0; retryIndex < maxSameModelAttempts; retryIndex += 1) {
          try {
            return await createApiMartImageGeneration(lockedRequest, lockedAttempt, modelMeta, references, maskImage, signal);
          } catch (error) {
            const message = readableFetchError(error);
            lastMessage = message;
            failures.push(`${attempt.label} ${endpointModelId} ?${retryIndex + 1}? ${message}`);
            if (retryIndex >= maxSameModelAttempts - 1 || !shouldRetrySameImageModel(message)) {
              if (!shouldTryImageFallback(message)) {
                throw error;
              }
              break;
            }
            appendStartupLog(`apiMart-image-retry-same-model model=${endpointModelId} attempt=${retryIndex + 2}/${maxSameModelAttempts} reason=${message.slice(0, 320)}`);
          }
        }
      }
      if (lastMessage) {
        throw new Error(lastMessage);
      }
    } catch (error) {
      const message = readableFetchError(error);
      if (isRecoverableGenerationSubmitError(message)) {
        throw new Error("\u7f51\u7edc\u63d0\u4ea4\u72b6\u6001\u672a\u77e5\uff1a\u672a\u6536\u5230\u670d\u52a1\u7aef\u771f\u5b9e task_id\uff0c\u8f6f\u4ef6\u4e0d\u4f1a\u628a\u672c\u5730\u4e1a\u52a1 ID \u5f53\u4f5c\u4efb\u52a1\u53f7\u3002\u8bf7\u68c0\u67e5\u7f51\u7edc\u540e\u91cd\u8bd5\uff1b\u5982\u5e73\u53f0\u540e\u53f0\u5df2\u51fa\u73b0\u4efb\u52a1\uff0c\u8bf7\u4ee5\u5e73\u53f0\u8bb0\u5f55\u4e3a\u51c6\u3002");
      }
      throw error;
    }
  }
  throw new Error(failures.join("?"));
}
async function generateApiMartImageWithSameModelRetries(request, attempts, modelMeta, references, maskImage, startedAt, signal) {
  const lockedEndpointModelId = imageModelIdForRequest(request, void 0, modelMeta);
  const lockedRequest = withImageEndpointModel(request, lockedEndpointModelId);
  const maxAttempts = maxSameImageModelAttempts();
  let lastResponse;
  for (let retryIndex = 0; retryIndex < maxAttempts; retryIndex += 1) {
    const result = await createApiMartImageGenerationWithFallback(lockedRequest, attempts, modelMeta, references, maskImage, signal);
    const response = await pollApiMartImageTask(result.payload, result.attempt, lockedRequest, startedAt, signal);
    if (response.status !== "failed") {
      return response;
    }
    lastResponse = response;
    const message = response.message || "";
    if (retryIndex >= maxAttempts - 1 || !shouldRetrySameImageModel(message)) {
      return response;
    }
    appendStartupLog(`apiMart-image-retry-same-model-task model=${lockedEndpointModelId} attempt=${retryIndex + 2}/${maxAttempts} reason=${message.slice(0, 320)}`);
    await new Promise((resolve) => setTimeout(resolve, /429|busy|temporar|overload|timeout|upstream|503|502|504|500/i.test(message) ? 1800 : 600));
  }
  return lastResponse ?? {
    id: node_crypto_1.default.randomUUID(),
    modelId: request.modelId,
    status: "failed",
    elapsedMs: Math.round(performance.now() - startedAt),
    assets: [],
    message: "Image generation failed before a retryable response was returned."
  };
}
async function testConnection(request) {
  if (request.category === "tools" || request.modelId === "background-removal") {
    const hasLocalRmbg = findBundledRembgModels().length > 0;
    return {
      ok: hasLocalRmbg,
      status: hasLocalRmbg ? 200 : 500,
      message: hasLocalRmbg ? "Jiaren AI 本地抠图模型已就绪，无需 API 即可运行。" : "未找到 Jiaren AI 本地抠图模型资源，请确认 resources/rmbg2 目录完整。"
    };
  }
  if (!request.baseUrl.trim() || !request.apiKey.trim()) {
    return { ok: false, message: "请填写 Base URL 和 API Key。" };
  }
  if (isGrsaiBaseUrl(request.baseUrl)) {
    const endpointModelId = (request.endpointModelId || request.modelId || "").trim();
    const supported = request.category === "image" && GRSAI_IMAGE_MODEL_IDS.includes(endpointModelId);
    return {
      ok: supported,
      status: supported ? 200 : 400,
      message: supported ? `Grsai 图片路由已就绪：${endpointModelId} 将使用 /v1/api/generate；API Key 会在真实生成时验证。` : "当前 Grsai 官方接口只为此配置提供图片模型，请从读取到的图片模型中选择。"
    };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), request.category === "image" ? 15e4 : 1e4);
  try {
    const apiMartCredential = await testApiMartCredential(request, controller);
    if (apiMartCredential) {
      return apiMartCredential;
    }
    const modelMeta = getModelMeta(request.modelId);
    const requestMode = modelMeta?.requestMode ?? request.requestMode ?? (request.category === "chat" ? "openai-chat" : request.apiGroup === "a2" ? "openai-image" : void 0);
    if (requestMode === "gemini-image") {
      const result2 = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => resolveEndpoint(attempt.baseUrl, "/models"), (attempt) => ({
        method: "GET",
        headers: {
          Authorization: `Bearer ${attempt.apiKey}`,
          Accept: "application/json"
        },
        signal: controller.signal
      }));
      const targetModel2 = imageGenerationModelId(safeEndpointModelIdForMode(request, result2.attempt, modelMeta, "gemini-image"));
      const ids2 = extractModelIds(result2.payload);
      const resolvedTargetModel2 = resolveProviderAvailableModelId(targetModel2, ids2, request.category);
      if (ids2.length > 0 && !providerListHasDocumentedImageModel(targetModel2, ids2) && resolvedTargetModel2 === targetModel2) {
        return { ok: false, status: result2.response.status, message: modelListMessage(targetModel2, ids2, request.category) };
      }
      return {
        ok: true,
        status: result2.response.status,
        message: withFallbackMessage(resolvedTargetModel2 !== targetModel2 ? `A2 �ӿ����ӳɹ�������ģ�� ${targetModel2} ���Զ�ӳ��Ϊ�ӿڿ���ģ�� ${resolvedTargetModel2}��` : "A2 �ӿ����ӳɹ���", result2.attempt)
      };
    }
    const result = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => resolveEndpoint(attempt.baseUrl, "/models"), (attempt) => ({
      method: "GET",
      headers: {
        Authorization: `Bearer ${attempt.apiKey}`,
        "Content-Type": "application/json"
      },
      signal: controller.signal
    }));
    const targetModel = request.category === "image" ? imageModelIdForRequest(request, result.attempt, getModelMeta(request.modelId)) : endpointModelIdForRequest(request, result.attempt, getModelMeta(request.modelId));
    const ids = extractModelIds(result.payload);
    const resolvedTargetModel = resolveProviderAvailableModelId(targetModel, ids, request.category);
    const providerHasTarget = request.category === "image" ? providerListHasDocumentedImageModel(targetModel, ids) : ids.includes(targetModel);
    if (ids.length > 0 && !providerHasTarget && resolvedTargetModel === targetModel) {
      if (isProviderBaseUrl(result.attempt.baseUrl) && providerModelListLooksPartial(ids, targetModel, request.category)) {
        if (request.category === "image") {
          let message = `API Key ���ã���ģ���б�û���������� ${targetModel}���������Ӳ�������ͼƬ���������ɻ��֣���ʵ��ͼʱ�ᰴ /images/generations �ύ��`;
          try {
            const balance = await fetchApiMartBalance(apiAttempts(request), controller.signal);
            return {
              ok: true,
              status: balance.response.status,
              message: withFallbackMessage(message, balance.attempt)
            };
          } catch {
            return {
              ok: true,
              status: result.response.status,
              message: withFallbackMessage(message, result.attempt)
            };
          }
        }
        return {
          ok: true,
          status: result.response.status,
          message: withFallbackMessage(`API Key ���ã�${targetModel} ����ģ�Ͷ��ڵ��ύ��`, result.attempt)
        };
      }
      return { ok: false, status: result.response.status, message: modelListMessage(targetModel, ids, request.category) };
    }
    return {
      ok: true,
      status: result.response.status,
      message: withFallbackMessage(resolvedTargetModel !== targetModel ? `���ӳɹ�������ģ�� ${targetModel} ���Զ�ӳ��Ϊ�ӿڿ���ģ�� ${resolvedTargetModel}��` : "���ӳɹ���ģ�ͷ���ɷ��ʡ�", result.attempt)
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "δ֪�������";
    return { ok: false, message };
  } finally {
    clearTimeout(timeout);
  }
}
function parseOpenAIImagesPayload(payload) {
  if (!isRecord(payload)) {
    return void 0;
  }
  if (Array.isArray(payload.data)) {
    return { data: payload.data };
  }
  if (isRecord(payload.data) && Array.isArray(payload.data.data)) {
    return { data: payload.data.data };
  }
  if (Array.isArray(payload.choices)) {
    return { data: payload.choices };
  }
  if (Array.isArray(payload.images)) {
    return { data: payload.images };
  }
  if (isRecord(payload.data) && Array.isArray(payload.data.images)) {
    return { data: payload.data.images };
  }
  if (isRecord(payload.data) && isRecord(payload.data.result) && Array.isArray(payload.data.result.images)) {
    return { data: payload.data.result.images };
  }
  if (isRecord(payload.result) && Array.isArray(payload.result.data)) {
    return { data: payload.result.data };
  }
  if (isRecord(payload.result) && Array.isArray(payload.result.images)) {
    return { data: payload.result.images };
  }
  return void 0;
}
function extractModelIds(payload) {
  if (!isRecord(payload)) {
    return [];
  }
  const source = Array.isArray(payload.data) ? payload.data : Array.isArray(payload.models) ? payload.models : isRecord(payload.data) && Array.isArray(payload.data.models) ? payload.data.models : [];
  return Array.from(new Set(source.map((item) => typeof item === "string" ? item : isRecord(item) ? readString(item.id) || readString(item.model) : void 0).filter((item) => Boolean(item))));
}
function extractProviderModelObjects(payload) {
  if (!isRecord(payload)) {
    return [];
  }
  const source = Array.isArray(payload.data) ? payload.data : Array.isArray(payload.models) ? payload.models : isRecord(payload.data) && Array.isArray(payload.data.models) ? payload.data.models : [];
  const seen = /* @__PURE__ */ new Set();
  const items = [];
  for (const entry of source) {
    const id = typeof entry === "string" ? entry.trim() : isRecord(entry) ? (readString(entry.id) || readString(entry.model) || "").trim() : "";
    if (!id || seen.has(id.toLowerCase())) {
      continue;
    }
    seen.add(id.toLowerCase());
    const supportedEndpointTypes = isRecord(entry) ? [
      ...Array.isArray(entry.supported_endpoint_types) ? entry.supported_endpoint_types : [],
      ...Array.isArray(entry.supportedEndpointTypes) ? entry.supportedEndpointTypes : [],
      readString(entry.endpoint_type),
      readString(entry.endpointType),
      readString(entry.type),
      readString(entry.category)
    ].map((value) => typeof value === "string" ? value.trim() : "").filter(Boolean) : [];
    const provider = isRecord(entry) ? readString(entry.owned_by) || readString(entry.provider) || readString(entry.owner) : void 0;
    const category = inferCategoryFromProviderModelItem(id, supportedEndpointTypes);
    items.push({
      id,
      alias: id,
      category,
      provider: provider || inferProviderFromModelId(id),
      supportedEndpointTypes
    });
  }
  return items;
}
function normalizeModelIdForAlias(value) {
  return value.toLowerCase().replace(/^a2[-_]/, "").replace(/^doubao[-_]/, "").replace(/official/g, "").replace(/[^a-z0-9]+/g, "");
}
function providerModelAliasCandidates(targetModel) {
  const value = targetModel.trim();
  const lower = value.toLowerCase();
  const candidates = /* @__PURE__ */ new Set([value, lower]);
  const add = (...items) => {
    items.filter(Boolean).forEach((item) => {
      candidates.add(item);
      candidates.add(item.toLowerCase());
    });
  };
  if (/doubao[-_]?seedance[-_]?2(?:[-_.]?0)?[-_]?mini|seedance[-_]?2[-_]?mini/i.test(lower)) {
    add("seedance-2-mini", "seedance-2.0-mini", "doubao-seedance-2.0-mini", "doubao-seedance-2-0-mini");
  }
  if (/doubao[-_]?seedance[-_]?2[-_]?0|seedance[-_]?2/i.test(lower)) {
    add("seedance-2", "seedance-2.0", "doubao-seedance-2-0-260128", "doubao-seedance-2-0-fast-260128", "doubao-seedance-2.0-mini");
  }
  if (/doubao[-_]?seedance[-_]?1[-_]?5|seedance[-_]?1\.?5/i.test(lower)) {
    add("seedance-1.5", "doubao-seedance-1-5-pro-251215");
  }
  if (/doubao[-_]?seedance[-_]?1[-_]?0|seedance[-_]?1\.?0/i.test(lower)) {
    add("seedance-1.0", "doubao-seedance-1-0-pro-250528", "doubao-seedance-1-0-pro-fast-251015");
  }
  if (/veo3\.?1.*pro|veo[-_]?3[-_]?1.*pro/i.test(lower)) {
    add("veo3.1-pro", "veo-3.1-pro", "veo31-pro", "veo3-1-pro");
  }
  if (/veo3\.?1.*fast|veo[-_]?3[-_]?1.*fast/i.test(lower)) {
    add("veo3.1-fast", "veo-3.1-fast", "veo31-fast", "veo3-1-fast");
  }
  if (/veo3\.?1.*lite|veo[-_]?3[-_]?1.*lite/i.test(lower)) {
    add("veo3.1-lite", "veo-3.1-lite", "veo31-lite", "veo3-1-lite");
  }
  if (/gemini[-_]?3.*pro.*image|nano[-_]?banana.*2/i.test(lower)) {
    add("gemini-3-pro-image-preview", "nano-banana-pro");
  }
  if (/gemini[-_]?3[-.]1.*flash.*image|nano[-_]?banana.*3[-.]1/i.test(lower)) {
    add("gemini-3.1-flash-image-preview", "gemini-3.1-flash-image-preview-512px", "gemini-3.1-flash-image-preview-2k", "gemini-3.1-flash-image-preview-4k", "nano-banana-2");
  }
  if (/gpt[-_]?image[-_]?2/i.test(lower)) {
    add("gpt-image-2", "gpt-image-2-all", "gpt-image-2-official");
  }
  if (/claude.*opus.*4|opus[-_]?4/i.test(lower)) {
    add("claude-opus-4-8", "claude-opus-4-7", "claude-opus-4-6", "claude-4-opus");
  }
  if (/claude.*sonnet|sonnet/i.test(lower)) {
    add("claude-sonnet-4-6", "claude-3-7-sonnet-20250219", "claude-3-7-sonnet-20250219-thinking", "claude-opus-4-8", "claude-opus-4-7", "claude-opus-4-6");
  }
  if (/gpt[-_]?4o|gpt[-_]?4\.?1/i.test(lower)) {
    add("gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-5.5", "gpt-5.4-mini", "gpt-5.4-mini-official");
  }
  if (/suno.*v?4|suno[-_]?4/i.test(lower)) {
    add("suno-v4", "suno-4", "suno");
  }
  if (/minimax.*tts|tts/i.test(lower)) {
    add("minimax-tts", "minimax-tts-sync", "minimax-tts-async");
  }
  return Array.from(candidates);
}
function preferredProviderModelForCategory(targetModel, ids, category) {
  if (!category) {
    return void 0;
  }
  const sameCategory = ids.filter((id) => inferCategoryFromProviderModelId(id) === category);
  if (sameCategory.length === 0) {
    return void 0;
  }
  const target = targetModel.toLowerCase();
  const score = (id) => {
    const value = id.toLowerCase();
    let points = 1;
    if (category === "chat") {
      if (/claude|opus|sonnet/i.test(target)) {
        if (/claude.*opus.*4/i.test(value))
          points += 500;
        if (/claude.*sonnet/i.test(value))
          points += 420;
        if (/thinking/i.test(value))
          points += 60;
        if (/gemini.*thinking|qwen3.*max|deepseek.*v3|grok-4/i.test(value))
          points += 140;
      } else if (/gpt[-_]?4o|gpt[-_]?4\.?1|gpt[-_]?5/i.test(target)) {
        if (/gpt[-_]?5\.?5/i.test(value))
          points += 500;
        if (/gpt[-_]?5\.[0-9].*mini/i.test(value))
          points += 420;
        if (/gpt[-_]?4o|gpt[-_]?4\.?1/i.test(value))
          points += 380;
        if (/qwen3.*max|gemini.*thinking|gemini.*flash|deepseek.*v3/i.test(value))
          points += 160;
      } else if (/gemini/i.test(target)) {
        if (/gemini.*thinking/i.test(value))
          points += 500;
        if (/gemini/i.test(value))
          points += 430;
        if (/qwen3.*max|claude.*opus|gpt[-_]?5/i.test(value))
          points += 150;
      } else {
        if (/claude.*opus.*4/i.test(value))
          points += 360;
        if (/qwen3.*max/i.test(value))
          points += 330;
        if (/gemini.*thinking/i.test(value))
          points += 310;
        if (/gpt[-_]?5\.?5/i.test(value))
          points += 300;
        if (/deepseek.*v3|grok-4/i.test(value))
          points += 220;
      }
    } else if (category === "image") {
      if (/gpt[-_]?image[-_]?2/i.test(target)) {
        if (/gpt[-_]?image[-_]?2/i.test(value))
          points += 500;
        if (/gemini.*image|nano[-_.\s]?banana|banana/i.test(value))
          points += 320;
        if (/flux|kontext|seedream/i.test(value))
          points += 180;
      } else if (/gemini.*image|nano[-_.\s]?banana|banana/i.test(target)) {
        if (/gemini.*image|nano[-_.\s]?banana|banana/i.test(value))
          points += 500;
        if (/gpt[-_]?image[-_]?2/i.test(value))
          points += 300;
        if (/flux|kontext|seedream/i.test(value))
          points += 180;
      } else {
        if (/gpt[-_]?image[-_]?2|gemini.*image|nano[-_.\s]?banana|banana/i.test(value))
          points += 280;
        if (/flux|kontext|seedream/i.test(value))
          points += 220;
      }
    } else if (category === "video") {
      if (/seedance|doubao/i.test(target)) {
        if (/seedance|doubao[-_]?seedance/i.test(value))
          points += 500;
        if (/veo|sora|wan|kling|grok-video/i.test(value))
          points += 180;
      } else if (/veo/i.test(target)) {
        if (/veo/i.test(value))
          points += 500;
        if (/seedance|sora|wan|kling|grok-video/i.test(value))
          points += 170;
      } else if (/sora/i.test(target)) {
        if (/sora/i.test(value))
          points += 500;
        if (/seedance|veo|wan|kling|grok-video/i.test(value))
          points += 170;
      } else {
        if (/seedance|veo|sora|wan|kling|grok-video/i.test(value))
          points += 220;
      }
    } else if (category === "music") {
      if (/suno/i.test(target)) {
        if (/suno/i.test(value))
          points += 500;
        if (/minimax.*tts|tts|audio|music/i.test(value))
          points += 180;
      } else if (/tts|minimax/i.test(target)) {
        if (/minimax.*tts|tts|voice|speech/i.test(value))
          points += 500;
        if (/suno|audio|music/i.test(value))
          points += 160;
      } else {
        if (/suno|minimax.*tts|tts|audio|music/i.test(value))
          points += 220;
      }
    }
    return points;
  };
  return sameCategory.map((id) => ({ id, score: score(id) })).sort((left, right) => right.score - left.score)[0]?.id;
}
function resolveProviderAvailableModelId(targetModel, ids, category) {
  const requestedTargetModel = targetModel.trim();
  if (!requestedTargetModel || ids.length === 0) {
    return targetModel;
  }
  if (ids.includes(requestedTargetModel)) {
    return requestedTargetModel;
  }
  void category;
  return ids.find((id) => id.trim().toLowerCase() === requestedTargetModel.toLowerCase()) ?? requestedTargetModel;
}
async function resolveAttemptModelIdFromProviderList(request, attempt, modelMeta, signal) {
  const baseTargetModel = request.category === "video" ? endpointModelIdForVideoLikeRequest(request, attempt, modelMeta) : request.category === "image" ? imageModelIdForRequest(request, attempt, modelMeta) : endpointModelIdForRequest(request, attempt, modelMeta);
  const targetModel = request.category === "image" ? apiMartGeminiResolutionEndpointModelId(baseTargetModel, request.resolution, request.size) : baseTargetModel;
  if (request.category === "video" && request.preserveEndpointModelId === true) {
    return targetModel;
  }
  if (!isProviderBaseUrl(attempt.baseUrl)) {
    return targetModel;
  }
  if (!signal) {
    return targetModel;
  }
  try {
    const result = await fetchProviderModelsForCategory([attempt], request.category, signal);
    return resolveProviderAvailableModelId(targetModel, extractModelIds(result.payload), request.category);
  } catch {
    return targetModel;
  }
}
function modelListMessage(modelId, ids, category) {
  const videoLike = ids.filter((id) => /veo|sora|video|seedance|wan|kling|hailuo|minimax|grok/i.test(id));
  const imageLike = ids.filter((id) => inferCategoryFromProviderModelId(id) === "image");
  const sameCategory = modelIdsForCategory(ids, category);
  const visible = (sameCategory.length > 0 ? sameCategory : videoLike.length > 0 ? videoLike : imageLike.length > 0 ? imageLike : ids).slice(0, 8);
  const videoHint = /veo|sora|seedance|video|wan|kling|hailuo|minimax|vidu|grok/i.test(modelId) ? "���������ƽ̨δ���Ÿ���Ƶ����������ģ���б��ﻻһ���ѿ��ŵ���Ƶģ�͡�" : "";
  const categoryHint = sameCategory.length === 0 && ids.length > 0 ? `ģ���б�ʵ�ʷ��أ�${providerModelListCategorySummary(ids)}��` : "";
  return `API Key �ɷ��ʣ��� ${modelId} û�����ڸ�����ģ���б��${visible.length ? `��ǰ������ã�${visible.join("��")}` : "���������ƽ̨ģ��Ȩ�ޡ�"}${categoryHint}${videoHint}`;
}
function modelIdsForCategory(ids, category) {
  return category ? ids.filter((id) => inferCategoryFromProviderModelId(id) === category) : ids;
}
function providerModelListCategorySummary(ids) {
  const counts = ids.reduce((summary, id) => {
    summary[inferCategoryFromProviderModelId(id)] += 1;
    return summary;
  }, { chat: 0, image: 0, video: 0, music: 0, tools: 0 });
  return [
    counts.chat ? `�Ի� ${counts.chat}` : "",
    counts.image ? `ͼƬ ${counts.image}` : "",
    counts.video ? `��Ƶ ${counts.video}` : "",
    counts.music ? `���� ${counts.music}` : "",
    counts.tools ? `���� ${counts.tools}` : ""
  ].filter(Boolean).join("��") || "δʶ�𵽷���";
}
function providerModelListLooksPartial(ids, targetModel, category) {
  if (ids.length === 0) {
    return false;
  }
  if (category === "image" ? providerListHasDocumentedImageModel(targetModel, ids) : ids.includes(targetModel)) {
    return false;
  }
  const imageCount = ids.filter((id) => inferCategoryFromProviderModelId(id) === "image").length;
  const videoCount = ids.filter((id) => /veo|sora|video|seedance|wan|kling|hailuo|minimax|grok/i.test(id)).length;
  const musicCount = ids.filter((id) => /suno|udio|riffusion|tts|whisper|audio|voice|speech|music|bgm|song/i.test(id)).length;
  const chatCount = ids.filter((id) => inferCategoryFromProviderModelId(id) === "chat").length;
  if (category === "image") {
    return imageCount === 0 || videoCount > imageCount * 2;
  }
  if (category === "video") {
    return videoCount === 0;
  }
  if (category === "music") {
    return musicCount === 0;
  }
  if (category === "chat") {
    return chatCount === 0 || videoCount > chatCount * 2 || imageCount > chatCount * 2;
  }
  return ids.length < 6;
}
function isProviderModelsEndpointUnavailable(response, payload, text) {
  const message = payloadMessage(payload, text, 300) || text;
  return response.status === 400 || response.status === 404 || response.status === 422 || /type|query|not found|unsupported/i.test(message);
}
async function fetchProviderModelsForCategory(attempts, category, signal) {
  const modelEndpoints = (attempt) => Array.from(new Set([
    resolveAllModelsEndpoint(attempt.baseUrl),
    category ? resolveModelsEndpoint(attempt.baseUrl, category) : "",
    resolveEndpoint(attempt.baseUrl, "/models")
  ].filter(Boolean)));
  const modelRequest = (attempt) => ({
    method: "GET",
    headers: {
      Authorization: `Bearer ${attempt.apiKey}`,
      Accept: "application/json"
    },
    signal
  });
  const failures = [];
  for (const attempt of attempts) {
    try {
      for (const endpoint of modelEndpoints(attempt)) {
        const response = await fetch(endpoint, modelRequest(attempt));
        const text = await response.text();
        const payload = parseResponsePayload(text);
        if (!response.ok) {
          if (isProviderModelsEndpointUnavailable(response, payload, text)) {
            continue;
          }
          failures.push(`${attempt.label} HTTP ${response.status}��${explainProviderFailure(response.status, payload, text)}`);
          continue;
        }
        const ids = extractModelIds(payload);
        if (category && endpoint.includes("type=")) {
          const hasCategoryModels = ids.some((id) => inferCategoryFromProviderModelId(id) === category);
          if (!hasCategoryModels && ids.length > 0) {
            continue;
          }
        }
        return { response, text, payload, attempt };
      }
    } catch (error) {
      failures.push(`${attempt.label} ${readableFetchError(error)}`);
    }
  }
  try {
    return await fetchJsonTextWithFallback(attempts, (attempt) => resolveEndpoint(attempt.baseUrl, "/models"), modelRequest);
  } catch {
    if (failures.length > 0) {
      throw new Error(failures.join("��"));
    }
    throw new Error("ģ���б���ȡʧ�ܡ�");
  }
}
function inferProviderFromModelId(modelId) {
  if (/gpt|chatgpt|sora|whisper|tts/i.test(modelId)) {
    return "openai";
  }
  if (/suno/i.test(modelId)) {
    return "suno";
  }
  if (/riffusion/i.test(modelId)) {
    return "riffusion";
  }
  if (/udio/i.test(modelId)) {
    return "udio";
  }
  if (/kling|kwaivgi|����/i.test(modelId)) {
    return "kling";
  }
  if (/recraft/i.test(modelId)) {
    return "recraft";
  }
  if (/flux|bfl/i.test(modelId)) {
    return "flux";
  }
  if (/ideogram/i.test(modelId)) {
    return "ideogram";
  }
  if (/gemini|veo|banana/i.test(modelId) || isNanoBananaImageModelId(modelId)) {
    return "google";
  }
  if (/claude/i.test(modelId)) {
    return "anthropic";
  }
  if (/deepseek/i.test(modelId)) {
    return "deepseek";
  }
  if (/qwen|wanx?|wan2/i.test(modelId)) {
    return "qwen";
  }
  if (/kimi/i.test(modelId)) {
    return "kimi";
  }
  if (/glm/i.test(modelId)) {
    return "glm";
  }
  if (/minimax|hailuo/i.test(modelId)) {
    return "minimax";
  }
  if (/grok|xai/i.test(modelId)) {
    return "xai";
  }
  if (/doubao|seedream|seedance/i.test(modelId)) {
    return "doubao";
  }
  return "custom";
}
function inferCategoryFromProviderModelId(modelId) {
  if (isGptNanoTextModelId(modelId)) {
    return "chat";
  }
  if (/suno|udio|riffusion|tts|whisper|audio|voice|speech|music|bgm|song|text-to-audio|video-to-audio|kling.*(?:audio|tts)|minimax.*tts|mini[-_\s]?max.*tts/i.test(modelId)) {
    return "music";
  }
  if (/veo|sora|wanx?|wan[-_\s]?2|wan2|seedance|kling.*(?:video|v[0-9]|omni)|kwaivgi|hailuo|minimax(?!.*tts)|grok-video|vidu|pixverse|ray-v|gen[234]\b|pika|higgsfield|runway|luma|liveportrait|emo|videoretalk|animateanyone|video/i.test(modelId)) {
    return "video";
  }
  if (/gpt-image|gpt-4o-image|dall[-_\s]?e|gemini.*image|seedream|recraft|ideogram|flux|kontext|qwen-image|grok.*image|image-edit|omni-image|midjourney|mj\b|jimeng|����/i.test(modelId) || isNanoBananaImageModelId(modelId)) {
    return "image";
  }
  if (/rembg|remove-bg|upscale|background|psd|3d|hunyuan/i.test(modelId)) {
    return "tools";
  }
  return "chat";
}
function inferCategoryFromProviderModelItem(modelId, endpointTypes = []) {
  const endpointText = endpointTypes.join(" ").toLowerCase();
  if (/image|images|img|image_generation|image_edit|vision_generation/.test(endpointText)) {
    return "image";
  }
  if (/video|videos|movie|generation_video/.test(endpointText)) {
    return "video";
  }
  if (/audio|music|song|speech|voice|tts|text_to_audio/.test(endpointText)) {
    return "music";
  }
  if (/chat|completion|completions|responses|message|messages|text/.test(endpointText)) {
    return "chat";
  }
  return inferCategoryFromProviderModelId(modelId);
}
function normalizeProviderModelListItems(payload, requestedCategory) {
  return extractProviderModelObjects(payload).filter((item) => !requestedCategory || item.category === requestedCategory);
}
async function listProviderModels(request) {
  if (!request.baseUrl.trim() || !request.apiKey.trim()) {
    return { ok: false, message: "�������� Base URL �� API Key��", models: [] };
  }
  if (isGrsaiBaseUrl(request.baseUrl)) {
    const models = normalizeProviderModelListItems(grsaiProviderModelPayload(), request.category);
    return {
      ok: true,
      status: 200,
      message: `Grsai 不提供 /models，已按其官方接口文档载入 ${models.length} 个图片模型。`,
      models
    };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15e3);
  try {
    const result = await fetchProviderModelsForCategory([
      {
        baseUrl: request.baseUrl.trim(),
        apiKey: request.apiKey.trim(),
        apiUserId: request.apiUserId?.trim(),
        label: "主接口"
      }
    ], request.category, controller.signal);
    const models = normalizeProviderModelListItems(result.payload, request.category);
    return {
      ok: true,
      status: result.response.status,
      message: models.length > 0 ? `�Ѷ�ȡ ${models.length} ��ģ�͡�` : "ģ�ͽӿڿɷ��ʣ���û�з��ؿ�ʶ���ģ�� ID��",
      models
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "ģ���б���ȡʧ�ܡ�",
      models: []
    };
  } finally {
    clearTimeout(timeout);
  }
}
async function fetchApiMartBalance(attempts, signal) {
  const failures = [];
  for (const attempt of attempts) {
    for (const endpoint of balanceEndpoints(attempt.baseUrl, "token")) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${attempt.apiKey}`,
            Accept: "application/json"
          },
          signal
        });
        const text = await response.text();
        const payload = parseResponsePayload(text);
        if (response.ok) {
          return { response, text, payload, attempt };
        }
        const message = explainProviderFailure(response.status, payload, text);
        failures.push(`${attempt.label} ${endpoint} HTTP ${response.status}${message ? `��${message}` : ""}`);
        if (response.status === 401 || response.status === 403 || response.status === 402 || isExplicitQuotaFailure(message)) {
          break;
        }
      } catch (error) {
        failures.push(`${attempt.label} ${endpoint} ${readableFetchError(error)}`);
      }
    }
  }
  throw new Error(failures.join("��") || "���ӿڲ��ɷ��ʡ�");
}
async function optionalApiMartBalanceCheck(attempts, signal) {
  try {
    const result = await fetchApiMartBalance(attempts, signal);
    if (isRecord(result.payload) && result.payload.success === false) {
      return {
        ok: false,
        result,
        message: payloadMessage(result.payload, result.text, 300) || "API Key У��ʧ�ܡ�"
      };
    }
    return { ok: true, result };
  } catch (error) {
    const message = readableFetchError(error);
    if (/������֤ʧ��|401|invalid access token|unauthorized/i.test(message)) {
      throw error;
    }
    if (/��Ȳ���|insufficient[_\s-]?quota|����|not enough credits|not enough balance/i.test(message)) {
      throw error;
    }
    return { ok: true, warning: message };
  }
}
function apiCredentialOkMessage(baseMessage, balance) {
  const warning = balance?.warning ? `���ӿ�δ���ţ�����������飺${balance.warning}` : "";
  return warning ? `${baseMessage} ${warning}` : baseMessage;
}
async function fetchApiMartUserBalance(attempts, signal) {
  const failures = [];
  for (const attempt of attempts) {
    for (const endpoint of balanceEndpoints(attempt.baseUrl, "user")) {
      try {
        const headers = {
          Authorization: `Bearer ${attempt.apiKey}`,
          Accept: "application/json"
        };
        if (attempt.apiUserId?.trim()) {
          headers["New-API-User"] = attempt.apiUserId.trim();
        }
        const response = await fetch(endpoint, {
          method: "GET",
          headers,
          signal
        });
        const text = await response.text();
        const payload = parseResponsePayload(text);
        if (response.ok) {
          return { response, text, payload, attempt };
        }
        const message = explainProviderFailure(response.status, payload, text);
        failures.push(`${attempt.label} ${endpoint} HTTP ${response.status}${message ? `��${message}` : ""}`);
        if (response.status === 401 || response.status === 403 || response.status === 402 || isExplicitQuotaFailure(message)) {
          break;
        }
      } catch (error) {
        failures.push(`${attempt.label} ${endpoint} ${readableFetchError(error)}`);
      }
    }
  }
  throw new Error(failures.join("��") || "�û����ӿڲ��ɷ��ʡ�");
}
function readBalanceValue(record, ...keys) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return void 0;
}
function normalizeBalanceInfo(payload) {
  if (!isRecord(payload)) {
    return void 0;
  }
  const source = isRecord(payload.data) ? payload.data : payload;
  return {
    remainBalance: readBalanceValue(source, "remain_balance", "remainBalance", "balance"),
    usedBalance: readBalanceValue(source, "used_balance", "usedBalance"),
    remainCredits: readBalanceValue(source, "remain_credits", "remainCredits", "credits", "quota"),
    usedCredits: readBalanceValue(source, "used_credits", "usedCredits"),
    creditsPerUsd: readBalanceValue(source, "credits_per_usd", "creditsPerUsd"),
    unlimitedQuota: readBoolean(source.unlimited_quota) ?? readBoolean(source.unlimitedQuota)
  };
}
function balanceSummary(prefix, info) {
  if (!info) {
    return `${prefix}�������ͨ`;
  }
  if (info.unlimitedQuota) {
    return `${prefix}�������`;
  }
  if (info.remainBalance !== void 0) {
    return `${prefix}��� ${info.remainBalance}`;
  }
  if (info.remainCredits !== void 0) {
    return `${prefix}���� ${info.remainCredits}`;
  }
  return `${prefix}�������ͨ`;
}
async function queryApiBalance(request) {
  const attempts = apiAttempts(request);
  if (attempts.length === 0) {
    return { ok: false, message: "������ API ��������д������ API �� Base URL �� API Key��" };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1e4);
  try {
    const tokenResult = await fetchApiMartBalance(attempts, controller.signal);
    if (isRecord(tokenResult.payload) && tokenResult.payload.success === false) {
      return {
        ok: false,
        status: tokenResult.response.status,
        message: payloadMessage(tokenResult.payload, tokenResult.text, 300) || "������ API ����ѯʧ�ܡ�"
      };
    }
    const token = normalizeBalanceInfo(tokenResult.payload);
    let user;
    let userWarning = "";
    try {
      const userResult = await fetchApiMartUserBalance(attempts, controller.signal);
      if (isRecord(userResult.payload) && userResult.payload.success === false) {
        userWarning = payloadMessage(userResult.payload, userResult.text, 180);
      } else {
        user = normalizeBalanceInfo(userResult.payload);
      }
    } catch (error) {
      userWarning = readableFetchError(error);
    }
    const summary = [balanceSummary("����", token), user ? balanceSummary("�û�", user) : ""].filter(Boolean).join("��");
    const warning = userWarning && !/δ��д API �û� ID|δ��д���� API �û� ID|invalid access token|unauthorized|401|403/i.test(userWarning) ? `���û����δ���أ�${userWarning}` : "";
    return {
      ok: true,
      status: tokenResult.response.status,
      message: withFallbackMessage(`����ѯ�ɹ���${summary}${warning}����������ֻ��ģ���б�����������ͼƬ/��Ƶ��`, tokenResult.attempt),
      token,
      user
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "����ѯʧ�ܡ���ǰ�������ӿڿ��ܲ�֧������ѯ���뵽��Ӧƽ̨�鿴��" };
  } finally {
    clearTimeout(timeout);
  }
}
function isRouteCapabilityError(payload, text = "") {
  const message = payloadMessage(payload, text, 500) || text;
  return /ChannelCapability|SKU|��������|·��|model_not_found|δ��������/i.test(message);
}
async function testApiMartCredential(request, controller) {
  const attempts = apiAttempts(request);
  if (!attempts.length || !attempts[0] || !isProviderBaseUrl(attempts[0].baseUrl)) {
    return void 0;
  }
  if (request.category === "image" || request.category === "video" || request.category === "chat" || request.category === "music") {
    const result2 = await fetchProviderModelsForCategory(attempts, request.category, controller.signal);
    const modelMeta = getModelMeta(request.modelId);
    const targetModel = request.category === "video" ? endpointModelIdForVideoLikeRequest(request, result2.attempt, modelMeta) : request.category === "image" ? imageModelIdForRequest(request, result2.attempt, modelMeta) : endpointModelIdForRequest(request, result2.attempt, modelMeta);
    const ids = extractModelIds(result2.payload);
    const resolvedTargetModel = resolveProviderAvailableModelId(targetModel, ids, request.category);
    const providerHasTarget = request.category === "image" ? providerListHasDocumentedImageModel(targetModel, ids) : ids.includes(targetModel);
    if (ids.length > 0 && !providerHasTarget && resolvedTargetModel === targetModel) {
      if (providerModelListLooksPartial(ids, targetModel, request.category)) {
        const balance2 = await optionalApiMartBalanceCheck(attempts, controller.signal);
        if (!balance2.ok) {
          return {
            ok: false,
            status: balance2.result.response.status,
            message: balance2.message
          };
        }
        const modelLabel = request.category === "image" ? "ͼƬ����ģ��" : request.category === "video" ? "��Ƶ����ģ��" : request.category === "chat" ? "��������ģ��" : request.category === "music" ? "��Ƶģ��" : "��ǰ����ģ��";
        return {
          ok: true,
          status: balance2.result?.response.status ?? result2.response.status,
          message: withFallbackMessage(apiCredentialOkMessage(`API Key ���á�/models ���ص��б�����������಻һ�£�${providerModelListCategorySummary(ids)}����${targetModel} ����${modelLabel}�ӿ��ύ���������Ӳ��������زġ��������ɻ��֡�`, balance2), balance2.result?.attempt ?? result2.attempt)
        };
      }
      return { ok: false, status: result2.response.status, message: modelListMessage(targetModel, ids, request.category) };
    }
    if (request.category === "image") {
      const balance2 = await optionalApiMartBalanceCheck(attempts, controller.signal);
      if (!balance2.ok) {
        return {
          ok: false,
          status: balance2.result.response.status,
          message: balance2.message
        };
      }
      return {
        ok: true,
        status: balance2.result?.response.status ?? result2.response.status,
        message: withFallbackMessage(apiCredentialOkMessage(`API Key ���ã�ʵ��ʹ��ģ�� ${resolvedTargetModel}��ͼƬ���ɽ��� llms �ĵ��� /images/generations����ƽ̨��ʾ��·��δ��ͨ�����Զ��˵� /chat/completions���������Ӳ�������ͼƬ���������ɻ��֡�`, balance2), balance2.result?.attempt ?? result2.attempt)
      };
    }
    const balance = await optionalApiMartBalanceCheck(attempts, controller.signal);
    if (!balance.ok) {
      return {
        ok: false,
        status: balance.result.response.status,
        message: balance.message
      };
    }
    return {
      ok: true,
      status: balance.result?.response.status ?? result2.response.status,
      message: withFallbackMessage(apiCredentialOkMessage(`API Key ���ã�ʵ��ʹ��ģ�� ${resolvedTargetModel}������ ${request.category === "video" ? "������Ƶ���ɽӿ�" : request.category === "music" ? "������Ƶ�ӿ�" : "/chat/completions"}��`, balance), balance.result?.attempt ?? result2.attempt)
    };
  }
  const result = await optionalApiMartBalanceCheck(attempts, controller.signal);
  if (!result.ok) {
    return {
      ok: false,
      status: result.result.response.status,
      message: result.message
    };
  }
  return {
    ok: true,
    status: result.result?.response.status ?? 200,
    message: withFallbackMessage(apiCredentialOkMessage("API Key ���ã�ͼƬ����Ƶ����ʹ��ģ�Ͷ������ӿڡ�", result), result.result?.attempt ?? attempts[0])
  };
}
function buildImageChatPayload(request, references = []) {
  const endpointModelId = request.endpointModelId?.trim() || request.modelId;
  const content = buildOrderedOpenAIImageContent(request, references.slice(0, 6));
  return {
    model: endpointModelId,
    messages: [
      {
        role: "user",
        content
      }
    ]
  };
}
function buildApiMartImageChatPayload(request, referenceUrls = []) {
  const endpointModelId = apiMartGeminiResolutionEndpointModelId(request.endpointModelId?.trim() || request.modelId, request.resolution, request.size);
  const promptParts = [
    request.prompt,
    `���������${normalizeApiMartImageRatio(request.size, request.aspectRatio, request.resolution)}`,
    `�����ȣ�${normalizeApiMartGeminiImageSize(request.resolution, request.size)}`,
    "��ֱ������ͼƬ������ͼƬ URL �� b64_json����Ҫֻ��������˵����"
  ];
  const content = buildOrderedOpenAIImageContent(
    { ...request, prompt: promptParts.filter(Boolean).join("\n") },
    referenceUrls.slice(0, 6).map((url) => ({ dataUrl: url })),
  );
  return {
    model: endpointModelId,
    messages: [
      {
        role: "user",
        content
      }
    ]
  };
}
function parseGeminiImagePayload(payload) {
  const images = [];
  let text;
  if (!isRecord(payload)) {
    return { inlineImages: images };
  }
  const candidates = Array.isArray(payload.candidates) ? payload.candidates : isRecord(payload.data) && Array.isArray(payload.data.candidates) ? payload.data.candidates : [];
  for (const candidate of candidates) {
    if (!isRecord(candidate) || !isRecord(candidate.content) || !Array.isArray(candidate.content.parts)) {
      continue;
    }
    for (const part of candidate.content.parts) {
      if (!isRecord(part)) {
        continue;
      }
      if (isRecord(part.inlineData) && typeof part.inlineData.data === "string") {
        const mimeType = readString(part.inlineData.mimeType) ?? "image/png";
        images.push(`data:${mimeType};base64,${part.inlineData.data}`);
      }
      if (isRecord(part.inline_data) && typeof part.inline_data.data === "string") {
        const mimeType = readString(part.inline_data.mime_type) ?? "image/png";
        images.push(`data:${mimeType};base64,${part.inline_data.data}`);
      }
      if (!text) {
        text = readString(part.text) ?? text;
      }
    }
  }
  return { inlineImages: Array.from(new Set(images)), text };
}
function extractJsonObjectText(value) {
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1] ?? value;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return source.slice(start, end + 1);
  }
  return void 0;
}
function readStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => typeof item === "string" ? item.trim() : "").filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value.split(/[,����]/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}
function normalizeReversePromptResult(value, fallbackText = "") {
  const record = isRecord(value) ? value : {};
  const shotsSource = Array.isArray(record.shots) ? record.shots : Array.isArray(record.storyboard) ? record.storyboard : [];
  const shots = shotsSource.filter(isRecord).map((shot, index) => ({
    title: readString(shot.title) ?? readString(shot.shotTitle) ?? `��ͷ ${index + 1}`,
    prompt: readString(shot.prompt) ?? readString(shot.description) ?? fallbackText,
    camera: readString(shot.camera),
    movement: readString(shot.movement) ?? readString(shot.motion),
    lighting: readString(shot.lighting),
    duration: readNumber(shot.duration)
  })).filter((shot) => shot.prompt.trim());
  const prompt = readString(record.prompt) ?? readString(record.imagePrompt) ?? fallbackText;
  return {
    subject: readString(record.subject) ?? "δʶ������",
    scene: readString(record.scene) ?? readString(record.background) ?? "δʶ�𳡾�",
    camera: readString(record.camera) ?? "δʶ��ͷ",
    movement: readString(record.movement) ?? readString(record.motion) ?? "��̬����΢�˶�",
    lighting: readString(record.lighting) ?? "��Ȼ�����͹�",
    style: readString(record.style) ?? "дʵ������",
    mood: readString(record.mood) ?? "��������Ȼ",
    composition: readString(record.composition),
    materials: readString(record.materials),
    colors: readStringArray(record.colors).slice(0, 8),
    prompt,
    negativePrompt: readString(record.negativePrompt) ?? readString(record.negative_prompt),
    videoPrompt: readString(record.videoPrompt) ?? readString(record.video_prompt) ?? prompt,
    shots: shots.length > 0 ? shots.slice(0, 8) : [{ title: "��ͷ 1", prompt, camera: readString(record.camera), movement: readString(record.movement), lighting: readString(record.lighting), duration: 5 }]
  };
}
function reverseSystemPrompt(mode) {
  return [
    "����רҵ AI ���ⷴ��ϵͳ��������ͨʶͼ��ͬʱ�߱� prompt-lens ʽӰ�Ӿ�ͷ���������",
    "��������뻭�棬������ϸ� JSON����Ҫ Markdown����Ҫ���͡�",
    "�ص������塢��������װ/������ʡ��������ռ��Ρ���񡢹�ͼ����ͷ��������Ƕȡ��˾���������ơ���Դ���򡢹�ȡ�ɫ�¡�ɫ����ϵ�������ʸС����������°�ʾ��",
    "prompt �ֶ�����ͼ�������ɣ������������ > ���� > ��ͼ > ��Ӱ > ��� > �ʸ� > ��Χ�����ȼ���",
    "videoPrompt �ֶ�������Ƶ���ɣ����������ͷ��������Ƕȡ��˾�����/�ٶȡ�����仯���˶�ǿ�ȡ�ʱ������͸�����ʾ�ʡ�",
    mode === "video" ? "�������Ƶ��ؼ�֡�������� 3-6 ���־� shots������ title��prompt��camera��movement��lighting��duration��" : "����ǵ�ͼ������Ȼ���� 1-3 ������չ����Ƶ�� shots��",
    "shots ÿ����ͷҪд�壺������ʼ״̬�����嶯���仯����ͷ�˶�����Ӱ�仯�Ϳ�ֱ��Ͷι��Ƶģ�͵� prompt��",
    "JSON �ֶι̶�Ϊ��subject, scene, camera, movement, lighting, style, mood, composition, materials, colors, prompt, negativePrompt, videoPrompt, shots��"
  ].join("\n");
}
function dataUrlForReverseRequest(request) {
  if (request.sourceDataUrl?.startsWith("data:")) {
    return request.sourceDataUrl;
  }
  if (request.sourcePath && (0, node_fs_1.existsSync)(request.sourcePath)) {
    return fileToDataUrl(request.sourcePath);
  }
  throw new Error("û�пɷ�����ͼƬ��ؼ�֡��");
}
function buildGeminiReversePayload(request) {
  const dataUrl = dataUrlForReverseRequest(request);
  const parsed = parseDataUrl(dataUrl);
  const prompt = [reverseSystemPrompt(request.mode), request.instruction?.trim() ? `�û�����Ҫ��${request.instruction.trim()}` : ""].filter(Boolean).join("\n\n");
  return {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: request.sourceMimeType || parsed.mime,
              data: parsed.bytes.toString("base64")
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };
}
function buildOpenAIReversePayload(request, endpointModelId) {
  const dataUrl = dataUrlForReverseRequest(request);
  return {
    model: endpointModelId,
    messages: [
      { role: "system", content: reverseSystemPrompt(request.mode) },
      {
        role: "user",
        content: [
          { type: "text", text: request.instruction?.trim() || "�뷴������ͼ�Ĵ�����ʾ�ʺͿ�������Ƶ�ķ־���" },
          { type: "image_url", image_url: { url: dataUrl } }
        ]
      }
    ],
    temperature: 0.2,
    response_format: { type: "json_object" }
  };
}
async function normalizeChatImages(request, signal) {
  return normalizeImageSources(request.images ?? [], signal, 8);
}
const JIAREN_LOCAL_SERIES_SYSTEM_INSTRUCTION = [
  "Jiaren local multi-episode branch is active for this request.",
  "Never call zopia.ai and never request ZOPIA_ACCESS_KEY. Keep all LLM, image, video, and audio execution on the current user's Jiaren API configuration and exact provider model IDs.",
  "Maintain a stable series bible for named characters, identity, wardrobe, recurring props, scene geography, visual style, and timeline handoff between episodes.",
  "Generate pure scene plates before storyboard frames. Scene plates contain no people, poses, actions, dialogue, captions, or watermarks. Storyboard frames add cast, placement, pose, expression, action, dialogue, camera, and duration.",
  "Resume from the failed asset or shot and preserve completed paid work. Never treat a local business ID as a provider task ID."
].join("\n");
function withJiarenLocalSeriesSkill(request) {
  const messages = Array.isArray(request.messages) ? request.messages : [];
  const text = messages.map((message) => String(message.content ?? "")).join("\n");
  const isAiVideoRequest = /AI\u89c6\u9891\u6d41\u7a0b\u9501\u5b9a|\u4e13\u4e1a\u5f71\u89c6\u7f16\u5267|\u5206\u955c\u5bfc\u6f14|storyboard director/i.test(text);
  const isSeriesRequest = /\u591a\u96c6|\u8fde\u7eed\u5267|\u77ed\u5267|\u7eed\u96c6|\u7b2c\s*\d+\s*\u96c6|multi[-\s]?episode|episodic|series/i.test(text);
  if (!isAiVideoRequest || !isSeriesRequest) {
    return request;
  }
  let appended = false;
  const nextMessages = messages.map((message) => {
    if (!appended && message.role === "system") {
      appended = true;
      return { ...message, content: `${message.content}\n\n${JIAREN_LOCAL_SERIES_SYSTEM_INSTRUCTION}` };
    }
    return message;
  });
  if (!appended) {
    nextMessages.unshift({ role: "system", content: JIAREN_LOCAL_SERIES_SYSTEM_INSTRUCTION });
  }
  appendStartupLog("ai-video-local-series-skill active=true provider-routing=current-user-api");
  return { ...request, messages: nextMessages };
}
let jiarenAgentSkillCache = "";
function jiarenAgentSkillText() {
  if (jiarenAgentSkillCache) return jiarenAgentSkillCache;
  const fallback = [
    "You are Jiaren Agent inside JiarenAI.",
    "Understand the requested deliverable, read every supplied attachment, preserve source facts and constraints, and execute low-risk work directly.",
    "For complex work, use observable stages, retain successful outputs, and retry only failed stages.",
    "Use only the current user's configured Jiaren model providers. Ask before paid generation, publishing, deletion, or external transmission.",
    "Never invent completed actions, available tools, uploaded files, or generated artifacts. Match the user's language."
  ].join("\n");
  try {
    const skillPath = bundledRuntimePath("data", "skills", "jiaren_agent.md");
    if ((0, node_fs_1.existsSync)(skillPath)) {
      jiarenAgentSkillCache = (0, node_fs_1.readFileSync)(skillPath, "utf-8").slice(0, 3e4);
    }
  } catch (error) {
    appendStartupLog(`jiaren-agent-skill-load-error ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!jiarenAgentSkillCache) jiarenAgentSkillCache = fallback;
  return jiarenAgentSkillCache;
}
function withJiarenAgentSkill(request) {
  if (request?.agentProfile !== "jiaren-agent") return request;
  const snapshot = agentControlRuntime?.getSnapshot?.() || { nodes: [], edges: [], assets: [], selectedNodeId: null };
  const canvasSummary = {
    selectedNodeId: snapshot.selectedNodeId || null,
    nodes: (Array.isArray(snapshot.nodes) ? snapshot.nodes : []).slice(0, 160).map((node) => ({
      id: String(node?.id || ""),
      kind: String(node?.data?.kind || node?.type || ""),
      label: String(node?.data?.label || "").slice(0, 120),
      status: String(node?.data?.status || ""),
      position: node?.position && typeof node.position === "object" ? { x: Number(node.position.x) || 0, y: Number(node.position.y) || 0 } : void 0
    })),
    edges: (Array.isArray(snapshot.edges) ? snapshot.edges : []).slice(0, 320).map((edge) => ({
      id: String(edge?.id || ""),
      source: String(edge?.source || ""),
      target: String(edge?.target || "")
    })),
    assetCount: Array.isArray(snapshot.assets) ? snapshot.assets.length : 0,
    capturedAt: snapshot.capturedAt || null
  };
  const canvasInstruction = [
    "Canvas changes use explicit approval. Never claim that a canvas operation has already run.",
    "When the user's requested canvas change is ready, include exactly one fenced jiaren-canvas-plan JSON block at the end of the reply.",
    "The JSON object must contain title, summary and operations. Allowed operation types are node.add, node.update, node.delete, node.select, edge.add, edge.remove, asset.add and run.node.",
    "Do not put shell commands, API keys, network requests, publication, paid generation or arbitrary code in a canvas plan.",
    "A plan is only a proposal. The user must approve it in Jiaren Agent before the application executes it.",
    `CURRENT CANVAS SUMMARY:\n${JSON.stringify(canvasSummary)}`
  ].join("\n");
  const instruction = `${jiarenAgentSkillText()}\n\n${canvasInstruction}`;
  const messages = Array.isArray(request.messages) ? request.messages : [];
  let appended = false;
  const nextMessages = messages.map((message) => {
    if (!appended && message.role === "system") {
      appended = true;
      return { ...message, content: `${instruction}\n\n${String(message.content ?? "")}` };
    }
    return message;
  });
  if (!appended) nextMessages.unshift({ role: "system", content: instruction });
  return { ...request, messages: nextMessages };
}
function finalizeJiarenAgentContent(content, request) {
  const original = String(content || "");
  if (request?.agentProfile !== "jiaren-agent" || !agentControlRuntime) return { content: original };
  const match = /```jiaren-canvas-plan\s*([\s\S]*?)```/i.exec(original);
  if (!match) return { content: original };
  const withoutBlock = original.replace(match[0], "").trim();
  try {
    const parsed = JSON.parse(match[1].trim());
    const plan = agentControlRuntime.submitPlan({
      ...parsed,
      sessionId: request.sessionId || parsed.sessionId || null,
      source: "Jiaren Agent"
    }, "Jiaren Agent");
    return {
      content: withoutBlock || "画布操作计划已整理完成，请在下方确认后执行。",
      plan
    };
  } catch (error) {
    return {
      content: `${withoutBlock || "画布操作计划未提交。"}\n\n计划格式检查失败：${error instanceof Error ? error.message : String(error)}`
    };
  }
}
async function chatImageUrlsForAttempt(images, attempt, signal) {
  if (images.length === 0) {
    return [];
  }
  if (isProviderBaseUrl(attempt.baseUrl)) {
    return apiMartReferenceUrls(images, attempt, 8, signal, attempt.endpointModelId);
  }
  return images.map((image) => image.url && /^https?:\/\//i.test(image.url) ? image.url : image.dataUrl).filter((value) => Boolean(value));
}
function buildOpenAIChatMessagesWithImages(request, imageUrls) {
  if (imageUrls.length === 0) {
    return request.messages.map((message) => ({ role: message.role, content: message.content }));
  }
  const messages = request.messages.map((message) => ({ role: message.role, content: message.content }));
  const lastUserIndex = (() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].role === "user") {
        return index;
      }
    }
    return -1;
  })();
  const imageParts = imageUrls.map((url) => ({ type: "image_url", image_url: { url } }));
  if (lastUserIndex >= 0) {
    const originalText = typeof messages[lastUserIndex].content === "string" ? messages[lastUserIndex].content : "";
    messages[lastUserIndex] = {
      ...messages[lastUserIndex],
      content: [{ type: "text", text: originalText || "�������ЩͼƬ��" }, ...imageParts]
    };
    return messages;
  }
  return [
    ...messages,
    {
      role: "user",
      content: [{ type: "text", text: "�������ЩͼƬ��" }, ...imageParts]
    }
  ];
}
function buildGeminiChatContentsWithImages(request, images) {
  const userMessages = request.messages.filter((message) => message.role !== "system");
  const lastUserIndex = (() => {
    for (let index = userMessages.length - 1; index >= 0; index -= 1) {
      if (userMessages[index].role === "user") {
        return index;
      }
    }
    return -1;
  })();
  const contents = userMessages.map((message, index) => {
    const parts = [{ text: message.content }];
    if (images.length > 0 && (index === lastUserIndex || lastUserIndex < 0 && index === userMessages.length - 1)) {
      images.forEach((image) => {
        const parsed = parseDataUrl(image.dataUrl);
        parts.push({
          inline_data: {
            mime_type: image.mime || parsed.mime,
            data: parsed.bytes.toString("base64")
          }
        });
      });
    }
    return {
      role: message.role === "assistant" ? "model" : "user",
      parts
    };
  });
  if (images.length > 0 && (lastUserIndex < 0 || contents.length === 0)) {
    contents.push({
      role: "user",
      parts: [
        { text: "�������ЩͼƬ��" },
        ...images.map((image) => {
          const parsed = parseDataUrl(image.dataUrl);
          return {
            inline_data: {
              mime_type: image.mime || parsed.mime,
              data: parsed.bytes.toString("base64")
            }
          };
        })
      ]
    });
  }
  return {
    contents,
    systemInstruction: {
      parts: request.messages.filter((message) => message.role === "system").map((message) => ({ text: message.content }))
    }
  };
}
function parseReverseResponse(text, payload) {
  const geminiText = parseGeminiImagePayload(payload).text;
  const openAiText = isRecord(payload) && Array.isArray(payload.choices) && isRecord(payload.choices[0]) && isRecord(payload.choices[0].message) ? readString(payload.choices[0].message.content) : void 0;
  const rawText = geminiText ?? openAiText ?? text;
  const jsonText = extractJsonObjectText(rawText) ?? extractJsonObjectText(text);
  let parsed = {};
  if (jsonText) {
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      parsed = {};
    }
  }
  return { result: normalizeReversePromptResult(parsed, rawText.trim()), rawText };
}
function resolveRequestMode(request, modelMeta) {
  return modelMeta?.requestMode ?? request.requestMode ?? "openai-image";
}
function endpointModelIdForRequest(request, attempt, modelMeta) {
  if (isDynamicProviderModelId(request.modelId)) {
    return attempt?.endpointModelId?.trim() || request.endpointModelId?.trim() || request.modelId;
  }
  const normalizedModelMeta = modelMeta ?? getModelMeta(request.modelId);
  const normalizedModelId = normalizeRuntimeModelKey(request.modelId) ?? request.modelId;
  return attempt?.endpointModelId?.trim() || normalizedModelMeta?.endpointModelId?.trim() || request.endpointModelId?.trim() || cleanModelMeta[normalizedModelId]?.endpointModelId?.trim() || normalizedModelId;
}
function safeEndpointModelIdForMode(request, attempt, modelMeta, requestMode) {
  if (isDynamicProviderModelId(request.modelId)) {
    return request.endpointModelId?.trim() || request.modelId;
  }
  const endpointModelId = endpointModelIdForRequest(request, attempt, modelMeta);
  if (requestMode === "gemini-image" && !endpointModelId.startsWith("gemini-")) {
    return modelMeta?.endpointModelId?.trim() || request.modelId.replace(/^a2-/, "");
  }
  if ((requestMode === "openai-image" || requestMode === "openai-chat") && endpointModelId.startsWith("gemini-") && /^(?:comfly|apilio|a2)-/i.test(request.modelId)) {
    const metaEndpoint = modelMeta?.endpointModelId?.trim();
    return metaEndpoint && !metaEndpoint.startsWith("gemini-") ? metaEndpoint : request.modelId;
  }
  return endpointModelId;
}
function buildImagePayload(request, references = []) {
  const [quality] = (request.quality ?? "auto").toLowerCase().split(" ");
  const alias = (request.modelAlias ?? "").toLowerCase();
  const endpointModelId = request.endpointModelId?.trim() || request.modelId.trim();
  const orderedPrompt = buildOrderedImagePrompt(request, references);
  const isNanoFamily = alias.includes("nano banana") || endpointModelId.includes("gemini-3") || /nano[-_]banana/i.test(endpointModelId);
  if (isNanoFamily) {
    const resolution = request.resolution ?? "Auto";
    const aspectRatio = request.aspectRatio ?? normalizeGeminiAspectRatio(request.size);
    const imageSize = normalizeImageSizePreset(resolution);
    const payload2 = {
      model: endpointModelId,
      client_business_id: requestBusinessId(request),
      prompt: orderedPrompt,
      response_format: "url",
      aspect_ratio: aspectRatio,
      image_size: imageSize,
      resolution: imageSize,
      size: requestedImagePixelSize(request.size, aspectRatio, resolution)
    };
    const referenceImages = references.slice(0, 6).map((image) => image.dataUrl);
    if (referenceImages.length > 0) {
      payload2.image = referenceImages.length === 1 ? referenceImages[0] : referenceImages;
    } else {
      payload2.n = Math.max(1, request.count);
      payload2.quality = quality === "auto" ? "auto" : quality;
    }
    return payload2;
  }
  if (request.apiGroup === "a2" && endpointModelId.startsWith("gpt-image-")) {
    if (endpointModelId === "gpt-image-2") {
      const gptImage2Payload = {
        model: endpointModelId,
        prompt: orderedPrompt,
        size: normalizeApiMartGptImage2Size(request.size, request.aspectRatio, request.resolution)
      };
      if (request.background === "transparent") {
        gptImage2Payload.background = "transparent";
        gptImage2Payload.output_format = "png";
      }
      if (quality !== "auto") {
        gptImage2Payload.quality = quality;
      }
      if (references.length > 0) {
        gptImage2Payload.image = references.slice(0, 16).map((image) => image.dataUrl);
      }
      return gptImage2Payload;
    }
    const payload2 = {
      model: endpointModelId,
      client_business_id: requestBusinessId(request),
      prompt: orderedPrompt,
      n: Math.max(1, request.count),
      size: normalizeA2GptImageSize(request.size, request.aspectRatio, request.resolution)
    };
    if (request.background === "transparent" && /^gpt[-_\s]*image[-_\s]*2(?:[-_\s]|$)/i.test(endpointModelId)) {
      payload2.background = "transparent";
      payload2.output_format = "png";
    }
    if (quality !== "auto" && endpointModelId !== "gpt-image-2-all") {
      payload2.quality = quality;
    }
    if (references.length > 0) {
      payload2.image = references.length === 1 ? references[0].dataUrl : references.slice(0, 5).map((image) => image.dataUrl);
    }
    if (endpointModelId === "gpt-image-2-all" && references.length > 0) {
      payload2.image = references.slice(0, 5).map((image) => image.dataUrl);
    }
    return payload2;
  }
  if (request.apiGroup === "a2" && isProviderBaseUrl(request.baseUrl)) {
    return buildApiMartImagePayload(request, references.map((image) => image.dataUrl));
  }
  const payload = {
    model: endpointModelId,
    client_business_id: requestBusinessId(request),
    prompt: orderedPrompt,
    n: Math.max(1, request.count),
    size: normalizeImageSize(request.size),
    quality: quality === "auto" ? "auto" : quality,
    response_format: "url"
  };
  if (references.length > 0) {
    payload.image = references.length === 1 ? references[0].dataUrl : references.slice(0, 5).map((image) => image.dataUrl);
  }
  return payload;
}
function normalizeApiMartImageResolution(value, size) {
  const source = `${value ?? ""} ${size ?? ""}`.toUpperCase();
  if (source.includes("0.5K") || source.includes("512")) {
    return "0.5K";
  }
  if (source.includes("4K") || source.includes("3840") || source.includes("2160")) {
    return "4K";
  }
  if (source.includes("3K")) {
    return "3K";
  }
  if (source.includes("2K") || source.includes("2048") || source.includes("2560") || source.includes("2688")) {
    return "2K";
  }
  return "1K";
}
function apiMartSizeToPreset(size) {
  const direct = size?.match(/(\d{3,5})\s*x\s*(\d{3,5})/i);
  if (!direct) {
    return {};
  }
  const width = Number(direct[1]);
  const height = Number(direct[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return {};
  }
  const ratioTable = [
    { ratio: "1:1", width: 1024, height: 1024, resolution: "1K" },
    { ratio: "3:2", width: 1536, height: 1024, resolution: "1K" },
    { ratio: "2:3", width: 1024, height: 1536, resolution: "1K" },
    { ratio: "1:1", width: 2048, height: 2048, resolution: "2K" },
    { ratio: "3:2", width: 2048, height: 1360, resolution: "2K" },
    { ratio: "2:3", width: 1360, height: 2048, resolution: "2K" },
    { ratio: "4:3", width: 2048, height: 1536, resolution: "2K" },
    { ratio: "3:4", width: 1536, height: 2048, resolution: "2K" },
    { ratio: "5:4", width: 2560, height: 2048, resolution: "2K" },
    { ratio: "4:5", width: 2048, height: 2560, resolution: "2K" },
    { ratio: "16:9", width: 2048, height: 1152, resolution: "2K" },
    { ratio: "9:16", width: 1152, height: 2048, resolution: "2K" },
    { ratio: "2:1", width: 2688, height: 1344, resolution: "2K" },
    { ratio: "1:2", width: 1344, height: 2688, resolution: "2K" },
    { ratio: "21:9", width: 2688, height: 1152, resolution: "2K" },
    { ratio: "9:21", width: 1152, height: 2688, resolution: "2K" },
    { ratio: "16:9", width: 3840, height: 2160, resolution: "4K" },
    { ratio: "9:16", width: 2160, height: 3840, resolution: "4K" },
    { ratio: "2:1", width: 3840, height: 1920, resolution: "4K" },
    { ratio: "1:2", width: 1920, height: 3840, resolution: "4K" },
    { ratio: "21:9", width: 3840, height: 1648, resolution: "4K" },
    { ratio: "9:21", width: 1648, height: 3840, resolution: "4K" }
  ];
  const exact = ratioTable.find((item) => item.width === width && item.height === height);
  if (exact) {
    return { ratio: exact.ratio, resolution: exact.resolution };
  }
  const sourceRatio = width / height;
  const nearest = ratioTable.map((item) => ({ ...item, score: Math.abs(item.width / item.height - sourceRatio) + Math.abs(Math.max(width, height) - Math.max(item.width, item.height)) / 1e4 })).sort((a, b) => a.score - b.score)[0];
  if (!nearest) {
    return {};
  }
  return { ratio: nearest.ratio, resolution: nearest.resolution };
}
function apiMartPresetToSize(resolution, ratio) {
  const normalizedRatio = ratio.trim();
  const table = {
    "1K": {
      "1:1": "1024x1024",
      "3:2": "1536x1024",
      "2:3": "1024x1536"
    },
    "2K": {
      "1:1": "2048x2048",
      "3:2": "2048x1360",
      "2:3": "1360x2048",
      "4:3": "2048x1536",
      "3:4": "1536x2048",
      "5:4": "2560x2048",
      "4:5": "2048x2560",
      "16:9": "2048x1152",
      "9:16": "1152x2048",
      "2:1": "2688x1344",
      "1:2": "1344x2688",
      "21:9": "2688x1152",
      "9:21": "1152x2688"
    },
    "4K": {
      "1:1": "4096x4096",
      "3:2": "3840x2560",
      "2:3": "2560x3840",
      "4:3": "3840x2880",
      "3:4": "2880x3840",
      "5:4": "3840x3072",
      "4:5": "3072x3840",
      "16:9": "3840x2160",
      "9:16": "2160x3840",
      "2:1": "3840x1920",
      "1:2": "1920x3840",
      "21:9": "3840x1648",
      "9:21": "1648x3840"
    }
  };
  return table[resolution][normalizedRatio] ?? (resolution === "4K" ? "3840x2160" : resolution === "2K" ? "2048x2048" : "1024x1024");
}
function requestedImagePixelSize(size, aspectRatio, resolution) {
  const direct = size?.match(/\d{3,5}\s*x\s*\d{3,5}/i)?.[0].replace(/\s+/g, "");
  if (direct) {
    return direct;
  }
  const ratio = normalizeApiMartImageRatio(size, aspectRatio, resolution);
  const tier = normalizeApiMartGptResolution(resolution, size);
  return apiMartPresetToSize(tier, ratio);
}
function normalizeApiMartGptImage2Size(size, aspectRatio, resolution) {
  return requestedImagePixelSize(size, aspectRatio, resolution);
}
function apiMartGptImage2PresetToSize(resolution, ratio) {
  if (resolution !== "4K") {
    return apiMartPresetToSize(resolution, ratio);
  }
  const normalizedRatio = ratio.trim();
  const table = {
    "1:1": "2880x2880",
    "3:2": "3520x2352",
    "2:3": "2352x3520",
    "4:3": "3264x2448",
    "3:4": "2448x3264",
    "5:4": "3200x2560",
    "4:5": "2560x3200",
    "16:9": "3840x2160",
    "9:16": "2160x3840",
    "2:1": "3840x1920",
    "1:2": "1920x3840",
    "21:9": "3840x1648",
    "9:21": "1648x3840"
  };
  return table[normalizedRatio] ?? "3840x2160";
}
function clampApiMartGptImage2Size(size) {
  const match = size.match(/^(\d{3,5})x(\d{3,5})$/i);
  if (!match) {
    return size;
  }
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return size;
  }
  const maxPixels = 8294400;
  const maxEdge = 3840;
  if (width <= maxEdge && height <= maxEdge && width * height <= maxPixels && width % 16 === 0 && height % 16 === 0 && Math.max(width, height) / Math.min(width, height) <= 3) {
    return `${width}x${height}`;
  }
  const ratio = width / height;
  const scale = Math.min(maxEdge / width, maxEdge / height, Math.sqrt(maxPixels / (width * height)));
  let nextWidth = Math.max(16, Math.floor(width * scale / 16) * 16);
  let nextHeight = Math.max(16, Math.floor(height * scale / 16) * 16);
  while (nextWidth * nextHeight > maxPixels) {
    if (nextWidth / nextHeight >= ratio) {
      nextWidth = Math.max(16, nextWidth - 16);
    } else {
      nextHeight = Math.max(16, nextHeight - 16);
    }
  }
  return `${nextWidth}x${nextHeight}`;
}
function normalizeApiMartGeminiImageSize(value, size) {
  const normalized = normalizeApiMartImageResolution(value, size);
  if (normalized === "0.5K") {
    return "512";
  }
  if (normalized === "4K") {
    return "4K";
  }
  if (normalized === "2K" || normalized === "3K") {
    return "2K";
  }
  return "1K";
}
function normalizeApiMartGeminiAspectRatio(endpointModelId, size, aspectRatio, resolution) {
  const ratio = normalizeApiMartImageRatio(size, aspectRatio, resolution);
  const isFlash31 = /gemini-3\.1-flash-image-preview/i.test(endpointModelId);
  const supported = isFlash31 ? ["1:1", "1:4", "4:1", "1:8", "8:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"] : ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];
  return supported.includes(ratio) ? ratio : "1:1";
}
function normalizeApiMartImageRatio(size, aspectRatio, resolution) {
  const preset = apiMartSizeToPreset(size);
  if (preset.ratio) {
    return preset.ratio;
  }
  const source = [aspectRatio, size].filter(Boolean).join(" ");
  const direct = source.match(/\d{1,2}:\d{1,2}/);
  void resolution;
  return direct?.[0] ?? (/9:16|1024x1536|1152x2048|2160x3840/i.test(source) ? "9:16" : /16:9|1536x1024|2048x1152|3840x2160/i.test(source) ? "16:9" : /3:2|2048x1360/i.test(source) ? "3:2" : /2:3|1360x2048/i.test(source) ? "2:3" : "1:1");
}
function isApiMartGeminiImageModel(endpointModelId) {
  return /^gemini-[\w.-]+-image/i.test(endpointModelId) || /nano[-_]banana/i.test(endpointModelId);
}
function isApiMartGptImageModel(endpointModelId) {
  return /^gpt-4o-image/i.test(endpointModelId) || /^gpt-image-/i.test(endpointModelId);
}
function isApiMartGptImage2Model(endpointModelId) {
  return /^gpt-image-2/i.test(endpointModelId);
}
function targetSizeForApiMartImageRequest(request, endpointModelId) {
  const model = endpointModelId ?? request.endpointModelId ?? request.modelId;
  if (!isApiMartGptImage2Model(model)) {
    return void 0;
  }
  return parsePixelTarget(normalizeApiMartGptImage2Size(request.size, request.aspectRatio, request.resolution));
}
function isApiMartGpt4oImageModel(endpointModelId) {
  return /^gpt-4o-image/i.test(endpointModelId);
}
function normalizeApiMartGptResolution(value, size) {
  const normalized = normalizeApiMartImageResolution(value, size);
  return normalized === "4K" ? "4K" : normalized === "2K" || normalized === "3K" ? "2K" : "1K";
}
function apiMartResolutionParam(value) {
  return value.toLowerCase();
}
function apiMartGptResolutionParam(endpointModelId, value) {
  return endpointModelId === "gpt-image-1.5-official" || endpointModelId === "gpt-image-2-official" ? value.toLowerCase() : value;
}
function normalizeApiMartQuality(value) {
  const quality = (value ?? "").toLowerCase();
  if (quality.startsWith("low")) {
    return "low";
  }
  if (quality.startsWith("medium")) {
    return "medium";
  }
  if (quality.startsWith("high")) {
    return "high";
  }
  return void 0;
}
function normalizeApiMartGpt4oRatio(size, aspectRatio) {
  const source = [aspectRatio, size].filter(Boolean).join(" ");
  const direct = source.match(/\d{1,2}:\d{1,2}/)?.[0];
  if (direct === "2:3" || /9:16|1024x1536|1152x2048|2160x3840/i.test(source)) {
    return "2:3";
  }
  if (direct === "3:2" || direct === "16:9" || /16:9|1536x1024|2048x1152|3840x2160/i.test(source)) {
    return "3:2";
  }
  return "1:1";
}
function normalizeApiMartGptImageRatio(size, aspectRatio, resolution) {
  const ratio = normalizeApiMartImageRatio(size, aspectRatio, resolution);
  const tier = normalizeApiMartGptResolution(resolution, size);
  const supportedByTier = {
    "1K": ["1:1", "3:2", "2:3"],
    "2K": ["1:1", "3:2", "2:3", "4:3", "3:4", "5:4", "4:5", "16:9", "9:16", "2:1", "1:2", "21:9", "9:21"],
    "4K": ["16:9", "9:16", "2:1", "1:2", "21:9", "9:21"]
  };
  if (supportedByTier[tier].includes(ratio)) {
    return ratio;
  }
  return tier === "4K" ? "16:9" : "1:1";
}
function normalizeApiMartImageUrlField(_endpointModelId, referenceUrls) {
  const urls = referenceUrls.map((url) => url.trim()).filter(Boolean);
  return urls;
}
function buildApiMartImagePayload(request, referenceUrls = [], maskUrl) {
  const endpointModelId = apiMartGeminiResolutionEndpointModelId(request.endpointModelId?.trim() || request.modelId, request.resolution, request.size);
  const orderedPrompt = buildOrderedImagePrompt(
    request,
    referenceUrls.map((dataUrl) => ({ dataUrl })),
  );
  const ratio = normalizeApiMartImageRatio(request.size, request.aspectRatio, request.resolution);
  const sizePreset = apiMartSizeToPreset(request.size);
  let resolution = sizePreset.resolution ?? normalizeApiMartImageResolution(request.resolution, request.size);
  const supportsMaskUrl = supportsApiMartMaskUrl(endpointModelId);
  if (resolution === "1K" && !["1:1", "3:2", "2:3"].includes(ratio)) {
    resolution = "2K";
  }
  if (resolution === "3K" && !/seedream/i.test(endpointModelId)) {
    resolution = "2K";
  }
  const imageUrls = normalizeApiMartImageUrlField(endpointModelId, referenceUrls);
  if (isApiMartGptImage2Model(endpointModelId)) {
    const payload2 = {
      model: endpointModelId,
      prompt: orderedPrompt,
      size: normalizeApiMartGptImage2Size(request.size, request.aspectRatio, request.resolution)
    };
    if (request.background === "transparent") {
      payload2.background = "transparent";
      payload2.output_format = "png";
    }
    const quality = normalizeApiMartQuality(request.quality);
    if (quality) {
      payload2.quality = quality;
    }
    if (imageUrls.length > 0) {
      payload2.image = imageUrls.length === 1 ? imageUrls[0] : imageUrls.slice(0, 16);
    }
    return payload2;
  }
  if (isApiMartGeminiImageModel(endpointModelId)) {
    const imageSize = normalizeApiMartGeminiImageSize(request.resolution, request.size);
    const aspectRatio = normalizeApiMartGeminiAspectRatio(endpointModelId, request.size, request.aspectRatio, request.resolution);
    const payload2 = {
      model: endpointModelId,
      prompt: orderedPrompt,
      aspect_ratio: aspectRatio,
      image_size: imageSize,
      response_format: "url"
    };
    if (imageUrls.length > 0) {
      payload2.image = imageUrls.slice(0, 14);
    }
    return payload2;
  }
  if (isApiMartGptImageModel(endpointModelId)) {
    if (isApiMartGpt4oImageModel(endpointModelId)) {
      const payload3 = {
        model: endpointModelId,
        client_business_id: requestBusinessId(request),
        prompt: orderedPrompt.slice(0, 1e3),
        n: Math.max(1, Math.min(4, request.count || 1)),
        size: normalizeApiMartGpt4oRatio(request.size, request.aspectRatio),
        response_format: "url"
      };
      if (imageUrls.length > 0) {
        payload3.image = imageUrls.slice(0, 5);
      }
      return payload3;
    }
    const gptResolution = normalizeApiMartGptResolution(request.resolution, request.size);
    const quality = normalizeApiMartQuality(request.quality);
    const payload2 = {
      model: endpointModelId,
      client_business_id: requestBusinessId(request),
      prompt: orderedPrompt,
      n: Math.max(1, Math.min(endpointModelId === "gpt-image-1.5-official" || endpointModelId === "gpt-image-2-official" ? 4 : endpointModelId === "gpt-4o-image" ? 4 : 10, request.count || 1)),
      size: normalizeApiMartGptImageRatio(request.size, request.aspectRatio, gptResolution),
      resolution: apiMartGptResolutionParam(endpointModelId, gptResolution),
      response_format: "url"
    };
    if (quality) {
      payload2.quality = quality;
    }
    if (/official/i.test(endpointModelId)) {
      payload2.output_format = "png";
    }
    if (imageUrls.length > 0) {
      const referenceUrls2 = imageUrls.slice(0, 16);
      if (endpointModelId === "gpt-image-2") {
        payload2.reference_images = referenceUrls2;
      } else {
        payload2.image_urls = referenceUrls2;
      }
    }
    if (supportsMaskUrl && maskUrl && imageUrls.length > 0) {
      payload2.mask_url = maskUrl;
    }
    return payload2;
  }
  const payload = {
    model: endpointModelId,
    client_business_id: requestBusinessId(request),
    prompt: orderedPrompt,
    n: Math.max(1, Math.min(8, request.count || 1)),
    size: ratio,
    resolution
  };
  if (/seedream/i.test(endpointModelId)) {
    payload.size = ratio;
    payload.resolution = resolution === "4K" ? "3K" : resolution;
  }
  if (imageUrls.length > 0) {
    payload.image_urls = imageUrls;
  }
  return payload;
}
function supportsApiMartMaskUrl(endpointModelId) {
  return endpointModelId === "gpt-image-1.5-official" || endpointModelId === "gpt-image-2-official";
}
function buildOpenAIImageEditFormData(request, references, maskImage) {
  const endpointModelId = request.endpointModelId?.trim() || request.modelId;
  const [quality] = (request.quality ?? "auto").toLowerCase().split(" ");
  const form = new FormData();
  form.set("model", endpointModelId);
  form.set("prompt", buildOrderedImagePrompt(request, references));
  form.set("n", String(Math.max(1, request.count)));
  form.set("size", normalizeA2GptImageSize(request.size));
  if (request.background === "transparent" && /^gpt[-_\s]*image[-_\s]*2(?:[-_\s]|$)/i.test(endpointModelId)) {
    form.set("background", "transparent");
    form.set("output_format", "png");
  }
  if (quality !== "auto") {
    form.set("quality", quality);
  }
  references.slice(0, 10).forEach((image, index) => {
    const blob = new Blob([new Uint8Array(image.bytes)], { type: image.mime });
    form.append("image", blob, image.name || `reference-${index + 1}${imageExtensionFromMime(image.mime)}`);
  });
  if (maskImage?.bytes) {
    const maskBlob = new Blob([new Uint8Array(maskImage.bytes)], { type: maskImage.mime || "image/png" });
    form.set("mask", maskBlob, maskImage.name || "jiaren-edit-mask.png");
  }
  return form;
}
function isFalNanoEndpoint(endpointModelId) {
  return /(^|\/)fal-ai\/nano-banana(\/edit)?$/i.test(endpointModelId);
}
function isOpenAIImageEditModel(request, endpointModelId) {
  const text = [request.modelAlias, request.modelId, endpointModelId].filter(Boolean).join(" ").toLowerCase();
  return /^gpt-image-/i.test(endpointModelId) || /^gpt-4o-image/i.test(endpointModelId) || text.includes("gpt image");
}
function resolveFalEndpoint(baseUrl, endpointModelId, hasReferenceImages) {
  const trimmed = baseUrl.replace(/\/+$/, "").replace(/\/v1(beta)?$/i, "");
  const pathName = endpointModelId.includes("/") ? `/${endpointModelId.replace(/^\/+/, "")}` : hasReferenceImages ? "/fal-ai/nano-banana/edit" : "/fal-ai/nano-banana";
  return `${trimmed}${pathName}`;
}
function buildFalNanoPayload(request, references = []) {
  const payload = {
    client_business_id: requestBusinessId(request),
    prompt: buildOrderedImagePrompt(request, references),
    num_images: Math.max(1, Math.min(4, request.count))
  };
  const imageUrls = references.slice(0, 6).map((image) => image.dataUrl);
  if (imageUrls.length > 0) {
    payload.image_urls = imageUrls;
  }
  return payload;
}
async function fetchPayload(url, apiKey, signal) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json"
    },
    signal
  });
  const text = await response.text();
  return { response, text, payload: parseResponsePayload(text) };
}
async function pollFalImagePayload(initialPayload, apiKey, signal, limit, cacheDir) {
  const assets = await assetsFromImagePayload(initialPayload, limit, cacheDir);
  let taskStatus = parseImageTaskStatus(initialPayload);
  let taskMessage = taskFailureReason(initialPayload);
  let pollUrl = extractResponseEndpoint(initialPayload, "") || extractPollEndpoint(initialPayload, "");
  const pollCandidates = Array.from(new Set([extractResponseEndpoint(initialPayload, ""), extractPollEndpoint(initialPayload, "")].filter((value) => Boolean(value))));
  if (assets.length > 0 || pollCandidates.length === 0) {
    return { assets, taskStatus, taskMessage, pollUrl };
  }
  let completedPollsWithoutAsset = 0;
  for (let attempt = 0; attempt < 180; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt < 3 ? 1200 : 3e3));
    for (const candidate of pollCandidates) {
      let response;
      let text;
      let payload;
      try {
        ({ response, text, payload } = await fetchPayload(candidate, apiKey, signal));
      } catch (error) {
        taskMessage = `��ѯ������粨����${readableFetchError(error)}`;
        continue;
      }
      if (response.status === 404 || response.status === 405) {
        continue;
      }
      pollUrl = candidate;
      if (!response.ok) {
        taskMessage = payloadMessage(payload, text, 300) || taskMessage;
        continue;
      }
      taskStatus = parseImageTaskStatus(payload) ?? taskStatus;
      taskMessage = taskFailureReason(payload) ?? taskMessage;
      assets.push(...await assetsFromImagePayload(payload, limit - assets.length, cacheDir));
      appendStartupLog(`fal-image-poll status=${taskStatus ?? ""} assets=${assets.length} urlCount=${extractImageUrls(payload).length} poll=${candidate}`);
      if (assets.length > 0 || isFailedStatus(taskStatus)) {
        return { assets, taskStatus, taskMessage, pollUrl };
      }
      if (isSucceededStatus(taskStatus)) {
        completedPollsWithoutAsset += 1;
        if (completedPollsWithoutAsset >= 45) {
          return { assets, taskStatus, taskMessage, pollUrl };
        }
      }
    }
  }
  return { assets, taskStatus, taskMessage, pollUrl };
}
function shouldUseSyncImageRequest(request) {
  if (request.async) {
    return false;
  }
  const alias = (request.modelAlias ?? "").toLowerCase();
  const endpointModelId = request.endpointModelId?.trim() || request.modelId;
  return alias.includes("nano banana") || endpointModelId.includes("gemini-3") || /nano[-_]banana/i.test(endpointModelId);
}
function normalizeImageSizePreset(value) {
  const normalized = value.trim().toUpperCase();
  if (normalized === "AUTO") {
    return "1K";
  }
  if (normalized === "512PX") {
    return "1K";
  }
  if (normalized === "1K" || normalized === "2K" || normalized === "4K") {
    return normalized;
  }
  return "1K";
}
function normalizeGeminiImageSize(value) {
  const normalized = value.trim().toUpperCase();
  if (normalized === "AUTO") {
    return "1K";
  }
  if (normalized === "0.5K") {
    return "512";
  }
  if (normalized === "1K" || normalized === "2K" || normalized === "4K") {
    return normalized;
  }
  return normalizeImageSizePreset(value);
}
function normalizeGeminiAspectRatio(value) {
  if (/\d+:\d+/.test(value)) {
    return value;
  }
  if (/1024x1536/.test(value)) {
    return "2:3";
  }
  if (/1536x1024/.test(value)) {
    return "3:2";
  }
  return "1:1";
}
function buildGeminiImagePayload(request, references = []) {
  const parts = buildOrderedGeminiImageParts(request, references.slice(0, 14));
  return {
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: request.aspectRatio ?? normalizeGeminiAspectRatio(request.size),
        imageSize: normalizeGeminiImageSize(request.resolution ?? request.size)
      }
    }
  };
}
function normalizeA2GptImageSize(value, aspectRatio, resolution) {
  const size = normalizeImageSize(value);
  if (["1024x1024", "1536x1024", "1024x1536", "2048x2048", "2048x1152", "1152x2048", "3840x2160", "2160x3840"].includes(size)) {
    return size;
  }
  const source = [value, aspectRatio, resolution].filter(Boolean).join(" ");
  if (/4K|3840|2160/i.test(source)) {
    return requestedImagePixelSize(value, aspectRatio, "4K");
  }
  if (/2K|2048|1152/i.test(source)) {
    return requestedImagePixelSize(value, aspectRatio, "2K");
  }
  if (/1:1/.test(source) && /2K|2048/i.test(source)) {
    return "2048x2048";
  }
  return size;
}
function normalizeImageSize(value) {
  const direct = value.match(/\d{3,5}\s*x\s*\d{3,5}/i);
  if (direct) {
    return direct[0].replace(/\s+/g, "");
  }
  if (/9:16/.test(value)) {
    return "1024x1536";
  }
  if (/16:9/.test(value)) {
    return "1536x1024";
  }
  if (/3:2/.test(value)) {
    return "1536x1024";
  }
  if (/2:3/.test(value)) {
    return "1024x1536";
  }
  return "1024x1024";
}
async function generateImage(request) {
  const startedAt = performance.now();
  if (!request.baseUrl.trim() || !request.apiKey.trim()) {
    return {
      id: node_crypto_1.default.randomUUID(),
      modelId: request.modelId,
      status: "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [],
      message: "���� API ��������д���õ� Base URL �� API Key��"
    };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 36e4);
  let requestMode = request.requestMode;
  try {
    const modelMeta = getModelMeta(request.modelId);
    requestMode = resolveRequestMode(request, modelMeta);
    const references = await normalizeReferenceImages(request, controller.signal);
    const maskImage = await normalizeMaskImage(request, controller.signal);
    if ((request.apiGroup === "a2" || request.apiGroup === "apilio") && isProviderBaseUrl(request.baseUrl)) {
      return await generateApiMartImageWithSameModelRetries(request, apiAttempts(request), modelMeta, references, maskImage, startedAt, controller.signal);
    }
    if (requestMode === "gemini-image") {
      const endpoint2 = resolveGeminiKeyEndpoint(request.baseUrl, safeEndpointModelIdForMode(request, void 0, modelMeta, requestMode), request.apiKey, "generateContent");
      const response2 = await fetch(endpoint2, {
        method: "POST",
        headers: geminiHeaders(request.apiKey),
        body: JSON.stringify(buildGeminiImagePayload(request, references)),
        signal: controller.signal
      });
      const text2 = await response2.text();
      const payload2 = text2 ? JSON.parse(text2) : {};
      if (!response2.ok) {
        return {
          id: node_crypto_1.default.randomUUID(),
          modelId: request.modelId,
          status: "failed",
          elapsedMs: Math.round(performance.now() - startedAt),
          assets: [],
          message: text2.slice(0, 600) || `����ʧ�ܣ�HTTP ${response2.status}`
        };
      }
      const parsed = parseGeminiImagePayload(payload2);
      const assets2 = [];
      for (const image of parsed.inlineImages.slice(0, request.count)) {
        const data = parseDataUrl(image);
        const localPath = writeBufferToCache(data.bytes, generatedImageFileName(assets2.length + 1, data.mime), request.cacheDir);
        assets2.push({
          id: node_crypto_1.default.randomUUID(),
          type: "image",
          localPath,
          dataUrl: fileToDataUrl(localPath),
          ...imageDimensions(localPath)
        });
      }
      if (assets2.length === 0) {
        for (const url of extractImageUrls(payload2).slice(0, request.count)) {
          assets2.push(await imageUrlToAsset(url, `jiaren_${Date.now()}_${assets2.length + 1}.png`, request.cacheDir));
        }
      }
      if (assets2.length === 0) {
        for (const base64 of extractBase64Images(payload2).slice(0, request.count)) {
          const data = parseDataUrl(base64);
          const localPath = writeBufferToCache(data.bytes, generatedImageFileName(assets2.length + 1, data.mime), request.cacheDir);
          assets2.push({
            id: node_crypto_1.default.randomUUID(),
            type: "image",
            localPath,
            dataUrl: fileToDataUrl(localPath),
            ...imageDimensions(localPath)
          });
        }
      }
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelId,
        status: assets2.length > 0 ? "succeeded" : "failed",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: assets2,
        message: assets2.length > 0 ? "Gemini ͼƬ������ɡ�" : parsed.text ?? "Gemini û�з���ͼƬ���ݡ�"
      };
    }
    const endpoint = `${resolveEndpoint(request.baseUrl, "/images/generations")}${request.async && !shouldUseSyncImageRequest(request) ? "?async=true" : ""}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${request.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildImagePayload({ ...request, endpointModelId: endpointModelIdForRequest(request, void 0, modelMeta) }, references)),
      signal: controller.signal
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};
    if (!response.ok) {
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelId,
        status: "failed",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: [],
        message: text.slice(0, 600) || `����ʧ�ܣ�HTTP ${response.status}`
      };
    }
    const assets = await assetsFromImagePayload(payload, request.count, request.cacheDir);
    const taskId = extractTaskId(payload);
    const clientBusinessId = void 0;
    const pollEndpoint = extractResponseEndpoint(payload, request.baseUrl) || extractPollEndpoint(payload, request.baseUrl);
    const hasServerTask = Boolean(taskId || pollEndpoint);
    if (assets.length === 0 && request.async && (taskId || pollEndpoint || clientBusinessId)) {
      let lastStatus = parseImageTaskStatus(payload);
      let lastMessage = taskFailureReason(payload);
      let lastPollUrl = pollEndpoint;
      const pollUrls = buildImageTaskPollUrls(request.baseUrl, taskId, pollEndpoint, clientBusinessId);
      let completedPollsWithoutAsset = 0;
      for (let attempt = 0; attempt < 55; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, attempt < 3 ? 1200 : 2500));
        let polled = false;
        for (const resolvedPollUrl of pollUrls) {
          let pollResponse;
          try {
            pollResponse = await fetch(resolvedPollUrl, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${request.apiKey}`,
                "Content-Type": "application/json"
              },
              signal: controller.signal
            });
          } catch (error) {
            lastMessage = `�������ύ�������β�ѯ���粨����${readableFetchError(error)}`;
            continue;
          }
          if (pollResponse.status === 404 || pollResponse.status === 405) {
            continue;
          }
          polled = true;
          lastPollUrl = resolvedPollUrl;
          const pollText = await pollResponse.text();
          const pollPayload = pollText ? JSON.parse(pollText) : {};
          lastStatus = parseImageTaskStatus(pollPayload) ?? lastStatus;
          lastMessage = taskFailureReason(pollPayload) ?? lastMessage;
          assets.push(...await assetsFromImagePayload(pollPayload, request.count - assets.length, request.cacheDir));
          if (assets.length > 0) {
            break;
          }
          if (isSucceededStatus(lastStatus)) {
            completedPollsWithoutAsset += 1;
            if (completedPollsWithoutAsset >= 45) {
              break;
            }
            continue;
          }
          if (isFailedStatus(lastStatus)) {
            return {
              id: node_crypto_1.default.randomUUID(),
              modelId: request.modelId,
              status: "failed",
              elapsedMs: Math.round(performance.now() - startedAt),
              assets: [],
              message: lastMessage ?? "�첽����ʧ�ܡ�",
              taskId,
              taskStatus: lastStatus,
              pollUrl: lastPollUrl
            };
          }
        }
        if (assets.length > 0 || isSucceededStatus(lastStatus) && completedPollsWithoutAsset >= 45) {
          break;
        }
        if (!polled && pollUrls.length > 0) {
          lastMessage = `�������ύ������ѯ�ӿ��ݲ��ɷ��ʣ�${pollUrls[0]}`;
        }
      }
      if (assets.length === 0 && isFailedStatus(lastStatus)) {
        return {
          id: node_crypto_1.default.randomUUID(),
          modelId: request.modelId,
          status: "failed",
          elapsedMs: Math.round(performance.now() - startedAt),
          assets: [],
          message: lastMessage ?? "�첽����ʧ�ܡ�",
          taskId,
          taskStatus: lastStatus,
          pollUrl: lastPollUrl
        };
      }
    }
    if (false) {
      for (let attempt = 0; attempt < 18; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 1800));
        const resolvedPollUrl = pollEndpoint || resolveEndpoint(request.baseUrl, `/images/tasks/${taskId}`);
        const pollResponse = await fetch(resolvedPollUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${request.apiKey}`,
            "Content-Type": "application/json"
          },
          signal: controller.signal
        });
        const pollText = await pollResponse.text();
        const pollPayload = pollText ? JSON.parse(pollText) : {};
        const status = parseImageTaskStatus(pollPayload);
        for (const url of extractImageUrls(pollPayload).slice(0, request.count)) {
          assets.push(await imageUrlToAsset(url, `jiaren_${Date.now()}_${assets.length + 1}.png`, request.cacheDir));
        }
        if (assets.length === 0) {
          for (const base64 of extractBase64Images(pollPayload).slice(0, request.count)) {
            const parsed = parseDataUrl(base64);
            const localPath = writeBufferToCache(parsed.bytes, generatedImageFileName(assets.length + 1, parsed.mime), request.cacheDir);
            assets.push({
              id: node_crypto_1.default.randomUUID(),
              type: "image",
              localPath,
              dataUrl: fileToDataUrl(localPath),
              ...imageDimensions(localPath)
            });
          }
        }
        if (assets.length > 0) {
          break;
        }
        if (status === "FAIL" || status === "FAILED" || status === "ERROR") {
          const failReason = taskFailureReason(pollPayload);
          return {
            id: node_crypto_1.default.randomUUID(),
            modelId: request.modelId,
            status: "failed",
            elapsedMs: Math.round(performance.now() - startedAt),
            assets: [],
            message: failReason ?? "�첽����ʧ�ܡ�"
          };
        }
      }
    }
    return {
      id: node_crypto_1.default.randomUUID(),
      modelId: request.modelId,
      status: assets.length > 0 ? "succeeded" : hasServerTask ? "queued" : "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets,
      message: assets.length > 0 ? "������ɣ������д�뱾�ػ��档" : `�������ύ����δ�õ�ͼƬ���ѱ���ҵ��ID ${taskId || clientBusinessId}�����Ժ������ɼ�¼�����������¼��ȷ�ϡ�`,
      message: assets.length > 0 ? "\u56fe\u7247\u751f\u6210\u5b8c\u6210\u3002" : hasServerTask ? `\u670d\u52a1\u7aef\u4efb\u52a1 ${taskId || ""} \u5df2\u63d0\u4ea4\uff0c\u6682\u672a\u62ff\u5230\u56fe\u7247\u3002` : "\u63a5\u53e3\u672a\u8fd4\u56de\u56fe\u7247\u6216\u771f\u5b9e task_id\uff0c\u65e0\u6cd5\u7ee7\u7eed\u67e5\u8be2\u3002",
      taskId
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "δ֪���ɴ���";
    const clientBusinessId = void 0;
    if (false && isRecoverableGenerationSubmitError(message) && canRecoverImageSubmission(request, requestMode)) {
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelId,
        status: "queued",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: [],
        message: `���������ѷ�������վ�����жϣ������ѱ���ҵ��ID ${clientBusinessId} �������ڽ��׷�أ������ظ�������ɣ�������ο۷֡�ԭʼ����${message}`,
        taskId: clientBusinessId,
        taskStatus: "queued",
        pollUrl: resolveEndpoint(request.baseUrl, `/images/generations/${clientBusinessId}`)
      };
    }
    return {
      id: node_crypto_1.default.randomUUID(),
      modelId: request.modelId,
      status: "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [],
      message
    };
  } finally {
    clearTimeout(timeout);
  }
}
function buildGrsaiImagePayload(request, references) {
  const model = (request.endpointModelId || request.modelId || "").trim();
  const requestedRatio = (request.aspectRatio || "auto").trim();
  const aspectRatio = /^(?:auto|1:1|16:9|9:16|4:3|3:4|3:2|2:3|5:4|4:5|21:9|9:21|1:4|4:1|1:8|8:1)$/i.test(requestedRatio) ? requestedRatio : "auto";
  const imageSize = normalizeImageSizePreset(request.resolution || request.size || "1K");
  const payload = {
    model,
    prompt: buildOrderedImagePrompt(request, references),
    images: references.slice(0, 10).map((image) => image.dataUrl),
    aspectRatio: model === "gpt-image-2-vip" ? requestedImagePixelSize(request.size || "", aspectRatio, imageSize) : aspectRatio,
    replyType: "async"
  };
  if (/^nano-banana/i.test(model)) {
    payload.imageSize = imageSize;
  }
  return payload;
}
async function generateGrsaiImage(request, references, startedAt, signal) {
  const count = Math.max(1, Number(request.count) || 1);
  const result = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => resolveGrsaiGenerateEndpoint(attempt.baseUrl), (attempt) => ({
    method: "POST",
    headers: {
      Authorization: `Bearer ${attempt.apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(buildGrsaiImagePayload({ ...request, endpointModelId: endpointModelIdForRequest(request, attempt, void 0) }, references)),
    signal
  }));
  let payload = result.payload;
  let assets = await assetsFromImagePayload(payload, count, request.cacheDir);
  const taskId = extractGrsaiTaskId(payload);
  let taskStatus = parseImageTaskStatus(payload);
  let taskMessage = taskFailureReason(payload);
  const pollUrl = taskId ? resolveGrsaiResultEndpoint(result.attempt.baseUrl, taskId) : void 0;
  let succeededWithoutAsset = 0;
  for (let attempt = 0; assets.length === 0 && pollUrl && attempt < 180; attempt += 1) {
    if (isFailedStatus(taskStatus) || /violation/i.test(taskStatus || "")) {
      break;
    }
    if (isSucceededStatus(taskStatus)) {
      succeededWithoutAsset += 1;
      if (succeededWithoutAsset >= 5) {
        break;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, attempt < 3 ? 1200 : 3e3));
    const response = await fetch(pollUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${result.attempt.apiKey}`,
        Accept: "application/json"
      },
      signal
    });
    const text = await response.text();
    payload = parseResponsePayload(text);
    if (!response.ok) {
      throw new Error(`Grsai 查询失败，HTTP ${response.status}：${explainProviderFailure(response.status, payload, text)}`);
    }
    taskStatus = parseImageTaskStatus(payload) || taskStatus;
    taskMessage = taskFailureReason(payload) || taskMessage;
    assets = await assetsFromImagePayload(payload, count, request.cacheDir);
  }
  const failed = isFailedStatus(taskStatus) || /violation/i.test(taskStatus || "");
  const succeeded = assets.length > 0;
  return {
    id: taskId || node_crypto_1.default.randomUUID(),
    modelId: request.modelId,
    status: succeeded ? "succeeded" : "failed",
    elapsedMs: Math.round(performance.now() - startedAt),
    assets,
    message: succeeded
      ? "Grsai 图片生成完成。"
      : failed
        ? taskMessage || "Grsai 图片生成失败。"
        : taskId
          ? `Grsai 任务 ${taskId} 在等待期限内未返回最终图片。`
          : "Grsai 未返回有效任务 ID，无法继续查询最终图片。",
    taskId,
    taskStatus,
    pollUrl
  };
}
async function generateImageV2Raw(request, externalSignal) {
  const startedAt = performance.now();
  if (channelDriverIdForRequest(request)) {
    return generateChannelImage(request, externalSignal);
  }
  if (!request.baseUrl.trim() || !request.apiKey.trim()) {
    return {
      id: node_crypto_1.default.randomUUID(),
      modelId: request.modelId,
      status: "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [],
      message: "������ API ��������д���õ� Base URL �� API Key��"
    };
  }
  const controller = new AbortController();
  const abortFromExternal = () => controller.abort(externalSignal?.reason);
  if (externalSignal?.aborted) abortFromExternal();
  else externalSignal?.addEventListener?.("abort", abortFromExternal, { once: true });
  const timeout = setTimeout(() => controller.abort(), 6e5);
  let requestMode = request.requestMode;
  try {
    const modelMeta = getModelMeta(request.modelId);
    requestMode = resolveRequestMode(request, modelMeta);
    const references = await normalizeReferenceImages(request, controller.signal);
    const maskImage = await normalizeMaskImage(request, controller.signal);
    if (isGrsaiBaseUrl(request.baseUrl)) {
      return await generateGrsaiImage(request, references, startedAt, controller.signal);
    }
    if ((request.apiGroup === "a2" || request.apiGroup === "apilio") && isProviderBaseUrl(request.baseUrl)) {
      return await generateApiMartImageWithSameModelRetries(request, apiAttempts(request), modelMeta, references, maskImage, startedAt, controller.signal);
    }
    if (requestMode === "gemini-image") {
      const result2 = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => resolveGeminiKeyEndpoint(attempt.baseUrl, safeEndpointModelIdForMode(request, attempt, modelMeta, requestMode), attempt.apiKey, "generateContent"), (attempt) => ({
        method: "POST",
        headers: geminiHeaders(attempt.apiKey),
        body: JSON.stringify(buildGeminiImagePayload(request, references)),
        signal: controller.signal
      }));
      const payload2 = result2.payload;
      const parsed = parseGeminiImagePayload(payload2);
      const assets2 = [];
      for (const image of parsed.inlineImages.slice(0, request.count)) {
        const data = parseDataUrl(image);
        const localPath = writeBufferToCache(data.bytes, generatedImageFileName(assets2.length + 1, data.mime), request.cacheDir);
        assets2.push({
          id: node_crypto_1.default.randomUUID(),
          type: "image",
          localPath,
          dataUrl: fileToDataUrl(localPath),
          ...imageDimensions(localPath)
        });
      }
      assets2.push(...await assetsFromImagePayload(payload2, request.count - assets2.length, request.cacheDir));
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelId,
        status: assets2.length > 0 ? "succeeded" : "failed",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: assets2,
        message: assets2.length > 0 ? withFallbackMessage("Gemini ͼƬ������ɡ�", result2.attempt) : parsed.text ?? "Gemini û�з���ͼƬ���ݡ�"
      };
    }
    const selectedEndpointModelId = endpointModelIdForRequest(request, void 0, modelMeta);
    if (request.apiGroup === "a2" && isFalNanoEndpoint(selectedEndpointModelId)) {
      const result2 = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => resolveFalEndpoint(attempt.baseUrl, endpointModelIdForRequest(request, attempt, modelMeta), references.length > 0), (attempt) => ({
        method: "POST",
        headers: {
          Authorization: `Bearer ${attempt.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(buildFalNanoPayload(request, references)),
        signal: controller.signal
      }));
      const polled = await pollFalImagePayload(result2.payload, result2.attempt.apiKey, controller.signal, request.count, request.cacheDir);
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelId,
        status: polled.assets.length > 0 ? "succeeded" : isFailedStatus(polled.taskStatus) ? "failed" : "queued",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: polled.assets,
        message: polled.assets.length > 0 ? withFallbackMessage("fal-ai/nano-banana ͼƬ������ɡ�", result2.attempt) : withFallbackMessage(polled.taskMessage ?? "fal-ai/nano-banana �������ύ������δ�õ�ͼƬ��", result2.attempt),
        taskId: extractTaskId(result2.payload),
        taskStatus: polled.taskStatus,
        pollUrl: polled.pollUrl
      };
    }
    if (request.apiGroup === "a2" && requestMode === "openai-chat") {
      const result2 = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => resolveA2ImageChatEndpoint(attempt.baseUrl), (attempt) => ({
        method: "POST",
        headers: {
          Authorization: `Bearer ${attempt.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(buildImageChatPayload({ ...request, endpointModelId: endpointModelIdForRequest(request, attempt, modelMeta) }, references)),
        signal: controller.signal
      }));
      const assets2 = await assetsFromImagePayload(result2.payload, request.count, request.cacheDir);
      const message = assets2.length > 0 ? withFallbackMessage("A2 GPT ���촴��ͼ��ɡ�", result2.attempt) : "A2 GPT ���촴��ͼû�з���ͼƬ���ݡ�";
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelId,
        status: assets2.length > 0 ? "succeeded" : "failed",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: assets2,
        message
      };
    }
    if (references.length > 0 && isOpenAIImageEditModel(request, selectedEndpointModelId) && !isProviderBaseUrl(request.baseUrl)) {
      const result2 = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => resolveA2ImageEditEndpoint(attempt.baseUrl), (attempt) => ({
        method: "POST",
        headers: {
          Authorization: `Bearer ${attempt.apiKey}`,
          Accept: "application/json"
        },
        body: buildOpenAIImageEditFormData({ ...request, endpointModelId: endpointModelIdForRequest(request, attempt, modelMeta) }, references, maskImage),
        signal: controller.signal
      }));
      const assets2 = await assetsFromImagePayload(result2.payload, request.count, request.cacheDir);
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelId,
        status: assets2.length > 0 ? "succeeded" : "failed",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: assets2,
        message: assets2.length > 0 ? withFallbackMessage("ͼ�ı༭������ɡ�", result2.attempt) : payloadMessage(result2.payload, result2.text, 600) || "ͼ�ı༭�ӿ�û�з���ͼƬ���ݡ�"
      };
    }
    const result = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => `${resolveA2ImageEndpoint(attempt.baseUrl)}${request.async && request.apiGroup !== "a2" ? "?async=true" : ""}`, (attempt) => ({
      method: "POST",
      headers: {
        Authorization: `Bearer ${attempt.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildImagePayload({ ...request, endpointModelId: endpointModelIdForRequest(request, attempt, modelMeta) }, references)),
      signal: controller.signal
    }));
    const payload = result.payload;
    const activeAttempt = result.attempt;
    const assets = await assetsFromImagePayload(payload, request.count, request.cacheDir);
    const taskId = extractTaskId(payload);
    const clientBusinessId = void 0;
    const pollEndpoint = extractResponseEndpoint(payload, activeAttempt.baseUrl) || extractPollEndpoint(payload, activeAttempt.baseUrl);
    let taskStatus = parseImageTaskStatus(payload);
    let taskMessage = taskFailureReason(payload);
    let pollUrl = pollEndpoint;
    if (assets.length === 0 && request.async && (taskId || pollEndpoint || clientBusinessId)) {
      const pollUrls = buildImageTaskPollUrls(activeAttempt.baseUrl, taskId, pollEndpoint, clientBusinessId);
      let completedPollsWithoutAsset = 0;
      for (let attempt = 0; attempt < 180; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, attempt < 3 ? 1200 : 3e3));
        let polled = false;
        for (const resolvedPollUrl of pollUrls) {
          let pollResponse;
          try {
            pollResponse = await fetch(resolvedPollUrl, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${activeAttempt.apiKey}`,
                "Content-Type": "application/json"
              },
              signal: controller.signal
            });
          } catch (error) {
            taskMessage = `�������ύ�������β�ѯ���粨����${readableFetchError(error)}`;
            continue;
          }
          if (pollResponse.status === 404 || pollResponse.status === 405) {
            continue;
          }
          polled = true;
          pollUrl = resolvedPollUrl;
          const pollText = await pollResponse.text();
          const pollPayload = pollText ? JSON.parse(pollText) : {};
          taskStatus = parseImageTaskStatus(pollPayload) ?? taskStatus;
          taskMessage = taskFailureReason(pollPayload) ?? taskMessage;
          assets.push(...await assetsFromImagePayload(pollPayload, request.count - assets.length, request.cacheDir));
          appendStartupLog(`generic-image-poll status=${taskStatus ?? ""} assets=${assets.length} urlCount=${extractImageUrls(pollPayload).length} poll=${resolvedPollUrl}`);
          if (assets.length > 0) {
            break;
          }
          if (isSucceededStatus(taskStatus)) {
            completedPollsWithoutAsset += 1;
            if (completedPollsWithoutAsset >= 45) {
              break;
            }
            continue;
          }
          if (isFailedStatus(taskStatus)) {
            return {
              id: node_crypto_1.default.randomUUID(),
              modelId: request.modelId,
              status: "failed",
              elapsedMs: Math.round(performance.now() - startedAt),
              assets: [],
              message: taskMessage ?? "�첽����ʧ�ܡ�",
              taskId,
              taskStatus,
              pollUrl
            };
          }
        }
        if (assets.length > 0 || isSucceededStatus(taskStatus) && completedPollsWithoutAsset >= 45) {
          break;
        }
        if (!polled && pollUrls.length > 0) {
          taskMessage = `�������ύ������ѯ�ӿ��ݲ��ɷ��ʣ�${pollUrls[0]}`;
        }
      }
    }
    const hasAssets = assets.length > 0;
    const failed = isFailedStatus(taskStatus);
    const hasServerTask = Boolean(taskId || pollUrl);
    return {
      id: node_crypto_1.default.randomUUID(),
      modelId: request.modelId,
      status: hasAssets ? "succeeded" : failed || !hasServerTask ? "failed" : "queued",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets,
      message: hasAssets ? withFallbackMessage("������ɣ������д�뱾�ػ��档", activeAttempt) : failed ? taskMessage ?? "�첽����ʧ�ܡ�" : `���� ${taskId || clientBusinessId} ���ύ������δ�õ�ͼƬ�������ѱ�������ID���Ժ�ɰ���ID�ڷ���������¼��ȷ�ϣ������ظ����������ɶ��ο۷֡�`,
      message: hasAssets ? "\u56fe\u7247\u751f\u6210\u5b8c\u6210\u3002" : failed ? taskMessage ?? "\u5f02\u6b65\u56fe\u7247\u751f\u6210\u5931\u8d25\u3002" : hasServerTask ? `\u670d\u52a1\u7aef\u4efb\u52a1 ${taskId || ""} \u5df2\u63d0\u4ea4\uff0c\u6682\u672a\u62ff\u5230\u56fe\u7247\u3002` : "\u63a5\u53e3\u672a\u8fd4\u56de\u56fe\u7247\u6216\u771f\u5b9e task_id\uff0c\u65e0\u6cd5\u7ee7\u7eed\u67e5\u8be2\u3002",
      taskId,
      taskStatus,
      pollUrl
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "δ֪���ɴ���";
    const clientBusinessId = void 0;
    if (false && isRecoverableGenerationSubmitError(message) && canRecoverImageSubmission(request, requestMode)) {
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelId,
        status: "queued",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: [],
        message: `���������ѷ�������վ�����жϣ������ѱ���ҵ��ID ${clientBusinessId} �������ڽ��׷�أ������ظ�������ɣ�������ο۷֡�ԭʼ����${message}`,
        taskId: clientBusinessId,
        taskStatus: "queued",
        pollUrl: resolveEndpoint(request.baseUrl, `/images/generations/${clientBusinessId}`)
      };
    }
    return {
      id: node_crypto_1.default.randomUUID(),
      modelId: request.modelId,
      status: "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [],
      message
    };
  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener?.("abort", abortFromExternal);
  }
}
// Jiaren v0.1.9 transparent image fallback
async function imageBufferHasUsefulAlpha(sourceBuffer) {
  try {
    const sharp = await importSharp();
    const { data, info } = await sharp(sourceBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (!info || info.channels < 4) return false;
    const pixelCount = Math.floor(data.length / info.channels);
    let transparentPixels = 0;
    let clearPixels = 0;
    for (let index = 3; index < data.length; index += info.channels) {
      if (data[index] < 250) transparentPixels += 1;
      if (data[index] < 32) clearPixels += 1;
    }
    return transparentPixels >= Math.max(8, Math.floor(pixelCount * 0.001))
      || clearPixels >= Math.max(4, Math.floor(pixelCount * 0.0002));
  } catch (error) {
    appendStartupLog(`transparent-alpha-check-error=${error instanceof Error ? error.message : String(error)}`);
  }
  return false;
}
async function sourceBufferForImageAsset(asset) {
  if (asset?.localPath && (0, node_fs_1.existsSync)(asset.localPath)) {
    return (0, node_fs_1.readFileSync)(asset.localPath);
  }
  if (typeof asset?.dataUrl === "string" && asset.dataUrl.startsWith("data:")) {
    return parseDataUrl(asset.dataUrl).bytes;
  }
  return void 0;
}
async function ensureTransparentImageAssets(assets, request) {
  const nextAssets = [];
  let applied = 0;
  let failed = 0;
  for (const asset of assets) {
    if (asset?.type !== "image") {
      nextAssets.push(asset);
      continue;
    }
    const sourceBuffer = await sourceBufferForImageAsset(asset);
    if (!sourceBuffer || await imageBufferHasUsefulAlpha(sourceBuffer)) {
      nextAssets.push(asset);
      continue;
    }
    try {
      const transparentAsset = await removeBackgroundWithBundledModel(sourceBuffer, {
        ...request,
        outputFormat: "png",
        crop: false,
        border: 0,
      });
      if (transparentAsset) {
        nextAssets.push({
          ...asset,
          ...transparentAsset,
          id: asset.id || transparentAsset.id,
          type: "image",
          mimeType: "image/png",
        });
        applied += 1;
      } else {
        nextAssets.push(asset);
        failed += 1;
      }
    } catch (error) {
      nextAssets.push(asset);
      failed += 1;
      appendStartupLog(`transparent-fallback-error=${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return { assets: nextAssets, applied, failed };
}
async function generateImageV2(request, signal) {
  const result = await generateImageV2Raw(request, signal);
  if (request?.background !== "transparent" || !Array.isArray(result?.assets) || result.assets.length === 0) {
    return result;
  }
  const normalized = await ensureTransparentImageAssets(result.assets, request);
  let message = result.message;
  if (normalized.applied > 0) {
    message = `${message || "图片生成完成。"} 已按透明底请求使用 JiarenAI 本地 alpha 兜底处理。`;
  }
  if (normalized.failed > 0) {
    message = `${message || "图片生成完成。"} 有 ${normalized.failed} 张图片未能生成可靠透明蒙版，已保留原图，未伪造透明结果。`;
  }
  return { ...result, assets: normalized.assets, message };
}
async function reverseAnalyze(request) {
  const startedAt = performance.now();
  if (!request.baseUrl.trim() || !request.apiKey.trim()) {
    return {
      id: node_crypto_1.default.randomUUID(),
      ok: false,
      elapsedMs: Math.round(performance.now() - startedAt),
      message: "������ API ��������д���õ��Ӿ�ģ�� Base URL �� API Key��"
    };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12e4);
  try {
    const modelMeta = getModelMeta(request.modelId);
    const requestMode = modelMeta?.requestMode ?? request.requestMode ?? "openai-chat";
    const attempts = apiAttempts(request);
    if (requestMode === "gemini-image" || requestMode === "gemini-chat") {
      const result2 = await fetchJsonTextWithFallback(attempts, (attempt) => resolveGeminiKeyEndpoint(attempt.baseUrl, safeEndpointModelIdForMode(request, attempt, modelMeta, requestMode), attempt.apiKey, "generateContent"), (attempt) => ({
        method: "POST",
        headers: geminiHeaders(attempt.apiKey),
        body: JSON.stringify(buildGeminiReversePayload(request)),
        signal: controller.signal
      }));
      const parsed2 = parseReverseResponse(result2.text, result2.payload);
      return {
        id: node_crypto_1.default.randomUUID(),
        ok: true,
        elapsedMs: Math.round(performance.now() - startedAt),
        message: withFallbackMessage("������ʾ������ɡ�", result2.attempt),
        result: parsed2.result,
        rawText: parsed2.rawText
      };
    }
    const result = await fetchJsonTextWithFallback(attempts, (attempt) => resolveEndpoint(attempt.baseUrl, "/chat/completions"), (attempt) => ({
      method: "POST",
      headers: {
        Authorization: `Bearer ${attempt.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildOpenAIReversePayload(request, endpointModelIdForRequest(request, attempt, modelMeta))),
      signal: controller.signal
    }));
    const parsed = parseReverseResponse(result.text, result.payload);
    return {
      id: node_crypto_1.default.randomUUID(),
      ok: true,
      elapsedMs: Math.round(performance.now() - startedAt),
      message: withFallbackMessage("������ʾ������ɡ�", result.attempt),
      result: parsed.result,
      rawText: parsed.rawText
    };
  } catch (error) {
    return {
      id: node_crypto_1.default.randomUUID(),
      ok: false,
      elapsedMs: Math.round(performance.now() - startedAt),
      message: error instanceof Error ? error.message : "������ʾ����ʧ�ܡ�"
    };
  } finally {
    clearTimeout(timeout);
  }
}
async function chat(request) {
  const startedAt = performance.now();
  request = withJiarenAgentSkill(withJiarenLocalSeriesSkill(request));
  if (channelDriverIdForRequest(request)) {
    try {
      return await generateChannelChat(request);
    } catch (error) {
      return {
        id: node_crypto_1.default.randomUUID(),
        ok: false,
        elapsedMs: Math.round(performance.now() - startedAt),
        message: error instanceof Error ? error.message : "自定义渠道对话失败。",
      };
    }
  }
  if (!request.baseUrl.trim() || !request.apiKey.trim()) {
    return {
      id: node_crypto_1.default.randomUUID(),
      ok: false,
      elapsedMs: Math.round(performance.now() - startedAt),
      message: "������������ģ�͵� Base URL �� API Key��"
    };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12e4);
  try {
    const modelMeta = getModelMeta(request.modelId);
    const requestMode = modelMeta?.requestMode ?? request.requestMode;
    const chatImages = await normalizeChatImages(request, controller.signal);
    if (requestMode === "gemini-chat") {
      const body = JSON.stringify(buildGeminiChatContentsWithImages(request, chatImages));
      const result2 = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => resolveGeminiKeyEndpoint(attempt.baseUrl, endpointModelIdForRequest(request, attempt, modelMeta), attempt.apiKey, "generateContent"), (attempt) => ({
        method: "POST",
        headers: {
          Authorization: `Bearer ${attempt.apiKey}`,
          "Content-Type": "application/json"
        },
        body,
        signal: controller.signal
      }));
      const parsed = parseGeminiImagePayload(result2.payload);
      return {
        id: node_crypto_1.default.randomUUID(),
        ok: true,
        content: parsed.text ?? "",
        elapsedMs: Math.round(performance.now() - startedAt),
        message: withFallbackMessage("�Ի���ɡ�", result2.attempt)
      };
    }
    const result = await fetchJsonTextWithFallback(apiAttempts(request), (attempt) => resolveEndpoint(attempt.baseUrl, "/chat/completions"), async (attempt) => {
      const imageUrls = await chatImageUrlsForAttempt(chatImages, attempt, controller.signal);
      const model = await resolveAttemptModelIdFromProviderList({ ...request, category: "chat" }, attempt, modelMeta, controller.signal);
      return {
        method: "POST",
        headers: {
          Authorization: `Bearer ${attempt.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: buildOpenAIChatMessagesWithImages(request, imageUrls),
          ...typeof request.temperature === "number" ? { temperature: request.temperature } : {},
          ...typeof request.topP === "number" ? { top_p: request.topP } : {},
          ...typeof request.maxTokens === "number" ? { max_tokens: request.maxTokens } : {},
          ...request.responseFormat === "json_object" ? { response_format: { type: "json_object" } } : {}
        }),
        signal: controller.signal
      };
    });
    const payload = result.payload;
    const content = isRecord(payload) && Array.isArray(payload.choices) && payload.choices[0] && isRecord(payload.choices[0]) && isRecord(payload.choices[0].message) && readString(payload.choices[0].message.content);
    return {
      id: isRecord(payload) && readString(payload.id) || node_crypto_1.default.randomUUID(),
      ok: true,
      content: content ?? "",
      elapsedMs: Math.round(performance.now() - startedAt),
      message: withFallbackMessage("�Ի���ɡ�", result.attempt)
    };
  } catch (error) {
    return {
      id: node_crypto_1.default.randomUUID(),
      ok: false,
      elapsedMs: Math.round(performance.now() - startedAt),
      message: error instanceof Error ? error.message : "δ֪�������"
    };
  } finally {
    clearTimeout(timeout);
  }
}
function chatStreamText(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map((item) => typeof item === "string" ? item : isRecord(item) ? readString(item.text) || readString(item.content) || "" : "").join("");
  }
  return "";
}
function chatNextStepSuggestions(content) {
  const text = String(content || "");
  if (/画布|节点|连线|workflow|canvas/i.test(text)) {
    return ["把建议整理成画布操作计划", "先预览将要修改的节点", "继续细化当前方案"];
  }
  if (/图片|视觉|海报|image|prompt/i.test(text)) {
    return ["生成可直接使用的绘图提示词", "补充构图与风格约束", "创建绘图节点"];
  }
  return ["继续完成下一步", "把结果整理成执行清单", "基于当前结果再优化一版"];
}
function sendChatStreamEvent(event, payload) {
  if (!event?.sender || event.sender.isDestroyed()) return;
  event.sender.send("runtime:chatStream", payload);
}
async function startChatStream(event, initialRequest) {
  const startedAt = performance.now();
  const requestId = cleanText(initialRequest?.requestId, node_crypto_1.default.randomUUID(), 160);
  let request = withJiarenAgentSkill(withJiarenLocalSeriesSkill(initialRequest));
  const emit = (type, payload = {}) => sendChatStreamEvent(event, { requestId, type, ...payload });
  if (channelDriverIdForRequest(request)) {
    emit("start", { sessionId: request.sessionId || null });
    try {
      const response = await generateChannelChat(request);
      let emittedText = "";
      for (const delta of String(response.content || "").match(/[\s\S]{1,32}/g) || []) {
        emittedText += delta;
        emit("delta", { delta, content: emittedText });
        await new Promise((resolve) => setTimeout(resolve, 6));
      }
      const finalized = finalizeJiarenAgentContent(emittedText, request);
      const completed = {
        ...response,
        id: requestId,
        content: finalized.content,
        suggestions: chatNextStepSuggestions(finalized.content),
        plan: finalized.plan,
      };
      emit("done", completed);
      return completed;
    } catch (error) {
      const result = {
        id: requestId,
        ok: false,
        content: "",
        elapsedMs: Math.round(performance.now() - startedAt),
        message: error instanceof Error ? error.message : "自定义渠道对话中断。",
      };
      emit("error", result);
      return result;
    }
  }
  if (!request?.baseUrl?.trim() || !request?.apiKey?.trim()) {
    const result = { id: requestId, ok: false, content: "", message: "对话模型 API 配置不完整。", elapsedMs: Math.round(performance.now() - startedAt) };
    emit("error", result);
    return result;
  }
  emit("start", { sessionId: request.sessionId || null });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12e4);
  let emittedText = "";
  try {
    const modelMeta = getModelMeta(request.modelId);
    const requestMode = modelMeta?.requestMode ?? request.requestMode;
    if (requestMode === "gemini-chat") {
      const result = await chat(request);
      if (!result.ok) throw new Error(result.message);
      const parts = String(result.content || "").match(/[\s\S]{1,32}/g) || [];
      for (const delta of parts) {
        emittedText += delta;
        emit("delta", { delta, content: emittedText });
        await new Promise((resolve) => setTimeout(resolve, 6));
      }
      const finalized = finalizeJiarenAgentContent(emittedText, request);
      emittedText = finalized.content;
      const suggestions = chatNextStepSuggestions(emittedText);
      const completed = { ...result, id: requestId, content: emittedText, suggestions, plan: finalized.plan, providerSource: request.providerSource || request.apiGroup || "user-configured" };
      emit("done", completed);
      return completed;
    }
    const chatImages = await normalizeChatImages(request, controller.signal);
    const attempts = apiAttempts(request);
    let lastError;
    for (const attempt of attempts) {
      try {
        const imageUrls = await chatImageUrlsForAttempt(chatImages, attempt, controller.signal);
        const model = await resolveAttemptModelIdFromProviderList({ ...request, category: "chat" }, attempt, modelMeta, controller.signal);
        const response = await fetch(resolveEndpoint(attempt.baseUrl, "/chat/completions"), {
          method: "POST",
          headers: { Authorization: `Bearer ${attempt.apiKey}`, "Content-Type": "application/json", Accept: "text/event-stream, application/json" },
          body: JSON.stringify({
            model,
            messages: buildOpenAIChatMessagesWithImages(request, imageUrls),
            stream: true,
            ...typeof request.temperature === "number" ? { temperature: request.temperature } : {},
            ...typeof request.topP === "number" ? { top_p: request.topP } : {},
            ...typeof request.maxTokens === "number" ? { max_tokens: request.maxTokens } : {}
          }),
          signal: controller.signal
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(explainProviderFailure(response.status, parseResponsePayload(errorText), errorText));
        }
        const contentType = String(response.headers.get("content-type") || "").toLowerCase();
        if (!response.body || !contentType.includes("text/event-stream")) {
          const text = await response.text();
          const payload = parseResponsePayload(text);
          const content = isRecord(payload) && Array.isArray(payload.choices) && isRecord(payload.choices[0]) && isRecord(payload.choices[0].message) ? chatStreamText(payload.choices[0].message.content) : text;
          emittedText += content;
          if (content) emit("delta", { delta: content, content: emittedText });
        } else {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let pending = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            pending += decoder.decode(value, { stream: true });
            const lines = pending.split(/\r?\n/);
            pending = lines.pop() || "";
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              let payload;
              try { payload = JSON.parse(data); } catch { continue; }
              const choice = Array.isArray(payload.choices) ? payload.choices[0] : null;
              const delta = chatStreamText(choice?.delta?.content ?? choice?.message?.content ?? payload.delta ?? payload.content);
              if (!delta) continue;
              emittedText += delta;
              emit("delta", { delta, content: emittedText });
            }
          }
        }
        const finalized = finalizeJiarenAgentContent(emittedText, request);
        emittedText = finalized.content;
        const suggestions = chatNextStepSuggestions(emittedText);
        const result = {
          id: requestId,
          ok: true,
          content: emittedText,
          suggestions,
          plan: finalized.plan,
          providerSource: attempt.sourceId || request.providerSource || request.apiGroup || "user-configured",
          elapsedMs: Math.round(performance.now() - startedAt),
          message: attempt === attempts[0] ? "对话完成。" : "主接口不可用，已由备用接口完成。"
        };
        emit("done", result);
        return result;
      } catch (error) {
        lastError = error;
        if (emittedText) throw error;
      }
    }
    throw lastError || new Error("没有可用的对话接口。")
  } catch (error) {
    const result = { id: requestId, ok: false, content: emittedText, elapsedMs: Math.round(performance.now() - startedAt), message: error instanceof Error ? error.message : "对话中断。" };
    if (request.sessionId && agentControlRuntime) agentControlRuntime.markRecovery(request.sessionId, { requestId, message: "连接中断，已保存当前对话，可继续上次任务。" });
    emit("error", result);
    return result;
  } finally {
    clearTimeout(timeout);
  }
}
async function removeBackground(request) {
  const startedAt = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12e4);
  try {
    let sourceBuffer;
    let mimeType = "image/png";
    if (request.localPath && (0, node_fs_1.existsSync)(request.localPath)) {
      sourceBuffer = (0, node_fs_1.readFileSync)(request.localPath);
      mimeType = mimeByExtension[node_path_1.default.extname(request.localPath).toLowerCase()] || mimeType;
    } else if (request.source.startsWith("data:image/")) {
      const parsed = parseDataUrl(request.source);
      sourceBuffer = parsed.bytes;
      mimeType = parsed.mime || mimeType;
    } else if (/^https?:\/\//i.test(request.source)) {
      const downloaded = await (0, jiaren_safe_download_1.downloadBuffer)(request.source, {
        accept: "image/*,*/*",
        maxBytes: 128 * 1024 * 1024,
        signal: controller.signal
      });
      mimeType = downloaded.contentType || mimeType;
      sourceBuffer = downloaded.buffer;
    }
    if (!sourceBuffer || sourceBuffer.byteLength === 0) {
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelKey,
        status: "failed",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: [],
        message: "Input is not a reachable URL, local image path, or image data."
      };
    }
    const bundledRembgAsset = await removeBackgroundWithBundledModel(sourceBuffer, request);
    if (bundledRembgAsset) {
      return {
        id: node_crypto_1.default.randomUUID(),
        modelId: request.modelKey,
        status: "succeeded",
        elapsedMs: Math.round(performance.now() - startedAt),
        assets: [bundledRembgAsset],
        message: "Jiaren AI 本地抠图完成，透明 PNG 已保存到缓存。"
      };
    }
    return {
      id: node_crypto_1.default.randomUUID(),
      modelId: request.modelKey,
      status: "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [],
      message: "本地抠图模型没有返回可用透明蒙版，请确认素材主体清晰后重试。"
    };
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "Unknown background removal error.";
    return {
      id: node_crypto_1.default.randomUUID(),
      modelId: request.modelKey,
      status: "failed",
      elapsedMs: Math.round(performance.now() - startedAt),
      assets: [],
      message: rawMessage
    };
  } finally {
    clearTimeout(timeout);
  }
}
const skillFactoryFileExtensions = {
  image: ["png", "jpg", "jpeg", "webp"],
  video: ["mp4", "mov", "webm", "avi", "mkv", "png", "jpg", "jpeg", "webp"]
};
const industrial3dExtensions = ["glb", "gltf", "obj", "fbx", "stl", "usdz", "stp", "step"];
const industrial3dMimeByExtension = {
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".obj": "text/plain",
  ".fbx": "application/octet-stream",
  ".stl": "model/stl",
  ".usdz": "model/vnd.usdz+zip"
};
async function selectSkillFactoryFiles(request) {
  const trainingType = request?.trainingType === "image" ? "image" : "video";
  const result = await electron_1.dialog.showOpenDialog({
    title: trainingType === "video" ? "选择 3-5 份视频或图片参考素材" : "选择 3-5 份图片参考素材",
    properties: ["openFile", "multiSelections"],
    filters: [{ name: trainingType === "video" ? "Video and images" : "Images", extensions: skillFactoryFileExtensions[trainingType] }]
  });
  if (result.canceled) return { canceled: true, files: [], rejected: [] };
  const rejected = [];
  const files = result.filePaths.slice(0, 5).flatMap((filePath) => {
    try {
      const stats = (0, node_fs_1.statSync)(filePath);
      if (!stats.isFile()) return [];
      if (stats.size > 2 * 1024 * 1024 * 1024) {
        rejected.push(`${node_path_1.default.basename(filePath)} 超过 2GB`);
        return [];
      }
      return [{
        name: node_path_1.default.basename(filePath),
        path: filePath,
        sizeBytes: stats.size,
        mimeType: guessMime(filePath),
        previewUrl: (0, node_url_1.pathToFileURL)(filePath).href
      }];
    } catch (error) {
      rejected.push(error instanceof Error ? error.message : String(error));
      return [];
    }
  });
  return { canceled: false, files, rejected };
}
function convertIndustrialStepModel(filePath) {
  const converter = String(process.env.JIAREN_OCCT_CONVERTER || "").trim();
  if (!converter || !(0, node_fs_1.existsSync)(converter)) {
    throw new Error("STEP 解析器未安装。当前纯 MIT 构建未捆绑 LGPL 的 occt-import-js；配置独立 JIAREN_OCCT_CONVERTER 后即可本地转换。GLB/GLTF/OBJ/FBX/STL/USDZ 可直接使用。");
  }
  const conversionRoot = node_path_1.default.join(defaultCacheDir, "industrial3d");
  ensureDir(conversionRoot);
  const outputPath = uniquePath(conversionRoot, `${node_path_1.default.parse(filePath).name}.glb`);
  const result = (0, node_child_process_1.spawnSync)(converter, [filePath, outputPath], {
    windowsHide: true,
    encoding: "utf8",
    timeout: 5 * 60 * 1000
  });
  if (result.error || result.status !== 0 || !(0, node_fs_1.existsSync)(outputPath)) {
    throw new Error(result.error?.message || result.stderr || "STEP 转换器没有生成 GLB 文件");
  }
  return outputPath;
}
async function selectIndustrial3DFiles() {
  const result = await electron_1.dialog.showOpenDialog({
    title: "选择本地 3D 工业模型",
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "3D models", extensions: industrial3dExtensions }]
  });
  if (result.canceled) return { canceled: true, assets: [] };
  const assets = [];
  const errors = [];
  for (const originalPath of result.filePaths.slice(0, 8)) {
    try {
      const stats = (0, node_fs_1.statSync)(originalPath);
      if (stats.size > 512 * 1024 * 1024) throw new Error(`${node_path_1.default.basename(originalPath)} 超过 512MB`);
      const extension = node_path_1.default.extname(originalPath).toLowerCase();
      const resolvedPath = extension === ".stp" || extension === ".step" ? convertIndustrialStepModel(originalPath) : originalPath;
      const name = node_path_1.default.basename(resolvedPath);
      const mimeType = industrial3dMimeByExtension[node_path_1.default.extname(resolvedPath).toLowerCase()] || "application/octet-stream";
      const bytes = (0, node_fs_1.readFileSync)(resolvedPath);
      assets.push({
        name,
        source: `data:${mimeType};base64,${bytes.toString("base64")}`,
        localPath: resolvedPath,
        originalPath,
        sizeBytes: bytes.byteLength,
        format: node_path_1.default.extname(resolvedPath).slice(1).toLowerCase()
      });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return { canceled: false, assets, error: errors.join("；") };
}
async function importCompletedSkill(result) {
  let previewItem;
  if (result.previewPath && (0, node_fs_1.existsSync)(result.previewPath)) {
    const previewKind = resourceKindFromPath(result.previewPath) || (/\.(mp4|mov|webm)$/i.test(result.previewPath) ? "video" : "image");
    const importedPreview = await addResourceToLibrary({
      kind: previewKind,
      name: `${result.name} 样片`,
      category: "Skill 样片",
      tags: ["skill-preview", result.trainingType, result.triggerWord],
      localPath: result.previewPath,
      metadata: { triggerWord: result.triggerWord, trainingType: result.trainingType, weightPath: result.weightPath }
    });
    previewItem = importedPreview?.item;
  }
  const importedWeight = await addResourceToLibrary({
    kind: "set",
    name: result.name,
    category: "AI Skills",
    tags: ["lora", result.trainingType, result.modelFamily, result.triggerWord],
    localPath: result.weightPath,
    mimeType: "application/octet-stream",
    thumbnail: previewItem?.dataUrl,
    metadata: {
      schema: "jiaren-local-skill-v1",
      triggerWord: result.triggerWord,
      trainingType: result.trainingType,
      caption: result.caption,
      modelFamily: result.modelFamily,
      previewResourceId: previewItem?.id,
      previewPath: previewItem?.localPath || result.previewPath,
      outputDirectory: result.outputDirectory
    }
  });
  return importedWeight?.item;
}
async function selectFiles(request) {
  const filters = request?.kind === "image" ? [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"] }] : request?.kind === "video" ? [{ name: "Videos", extensions: ["mp4", "mov", "webm", "avi"] }] : request?.kind === "audio" ? [{ name: "Audio", extensions: ["mp3", "wav", "m4a", "aac", "ogg", "flac"] }] : [
    { name: "Media", extensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp", "mp4", "mov", "webm", "mp3", "wav", "m4a"] },
    { name: "All Files", extensions: ["*"] }
  ];
  const result = await electron_1.dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters
  });
  if (result.canceled) {
    return { canceled: true, assets: [] };
  }
  const cacheDir = request?.cacheDir?.trim() || defaultCacheDir;
  const assets = result.filePaths.map((filePath) => {
    const name = node_path_1.default.basename(filePath);
    const targetPath = uniquePath(cacheDir, name);
    (0, node_fs_1.copyFileSync)(filePath, targetPath);
    const extension = node_path_1.default.extname(targetPath);
    const mimeType = guessMime(targetPath);
    const dimensions = mimeType.startsWith("image/") ? imageDimensions(targetPath) : {};
    return {
      id: node_crypto_1.default.randomUUID(),
      kind: guessKind(targetPath),
      name,
      extension,
      mimeType,
      localPath: targetPath,
      dataUrl: fileToDataUrl(targetPath),
      sizeBytes: (0, node_fs_1.readFileSync)(targetPath).byteLength,
      width: dimensions.width,
      height: dimensions.height
    };
  });
  return { canceled: false, assets };
}
const CHAT_TEXT_EXTENSIONS = new Set([
  ".txt", ".md", ".markdown", ".csv", ".tsv", ".json", ".jsonl", ".xml", ".yaml", ".yml",
  ".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".html", ".htm", ".py", ".java", ".c", ".cpp",
  ".h", ".hpp", ".cs", ".go", ".rs", ".php", ".sql", ".sh", ".ps1", ".bat", ".ini", ".toml", ".log"
]);
const CHAT_IGNORED_DIRECTORIES = new Set([".git", "node_modules", ".next", "dist", "build", "coverage", "__pycache__"]);
function chatAttachmentItem(filePath, rootPath) {
  const stat = (0, node_fs_1.statSync)(filePath);
  if (!stat.isFile()) return void 0;
  const extension = node_path_1.default.extname(filePath).toLowerCase();
  const mimeType = guessMime(filePath);
  const isImage = mimeType.startsWith("image/");
  const isText = CHAT_TEXT_EXTENSIONS.has(extension);
  let content = "";
  let truncated = false;
  if (isText) {
    const maxBytes = 512 * 1024;
    const buffer = (0, node_fs_1.readFileSync)(filePath);
    truncated = buffer.byteLength > maxBytes;
    content = buffer.subarray(0, maxBytes).toString("utf-8").replace(/\0/g, "");
  }
  return {
    id: node_crypto_1.default.randomUUID(),
    name: node_path_1.default.basename(filePath),
    relativePath: rootPath ? node_path_1.default.relative(rootPath, filePath).replace(/\\/g, "/") : node_path_1.default.basename(filePath),
    localPath: filePath,
    extension,
    mimeType,
    kind: isImage ? "image" : isText ? "text" : "file",
    sizeBytes: stat.size,
    content,
    truncated
  };
}
function walkChatAttachmentDirectory(rootPath, maxFiles = 60) {
  const items = [];
  const stack = [rootPath];
  while (stack.length && items.length < maxFiles) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = (0, node_fs_1.readdirSync)(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (items.length >= maxFiles) break;
      if (entry.name.startsWith(".") && entry.isDirectory()) continue;
      const absolutePath = node_path_1.default.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!CHAT_IGNORED_DIRECTORIES.has(entry.name)) stack.push(absolutePath);
        continue;
      }
      try {
        const item = chatAttachmentItem(absolutePath, rootPath);
        if (item) items.push(item);
      } catch {
      }
    }
  }
  return items;
}
async function selectChatAttachments(request = {}) {
  const mode = request.mode === "folder" ? "folder" : "files";
  if (mode === "folder") {
    const result = await electron_1.dialog.showOpenDialog({ properties: ["openDirectory"] });
    if (result.canceled || !result.filePaths[0]) return { canceled: true, items: [] };
    const rootPath = result.filePaths[0];
    const items = walkChatAttachmentDirectory(rootPath);
    return { canceled: false, rootPath, folderName: node_path_1.default.basename(rootPath), items, limited: items.length >= 60 };
  }
  const result = await electron_1.dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [
      { name: "Documents and media", extensions: ["txt", "md", "csv", "tsv", "json", "yaml", "yml", "js", "ts", "tsx", "jsx", "html", "css", "py", "sql", "png", "jpg", "jpeg", "webp", "gif", "svg", "pdf", "docx", "xlsx", "pptx"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (result.canceled) return { canceled: true, items: [] };
  const items = result.filePaths.slice(0, 24).map((filePath) => {
    try { return chatAttachmentItem(filePath, ""); } catch { return void 0; }
  }).filter(Boolean);
  return { canceled: false, items, limited: result.filePaths.length > items.length };
}
async function saveAsset(request = {}) {
  try {
    const directory = String(request.directory || "").trim() || defaultDownloadsDir;
    ensureDir(directory);
    const source = String(request.source || request.dataUrl || "");
    const parsedData = source.startsWith("data:") ? parseDataUrl(source) : void 0;
    const mimeType = saveAssetMime(request, parsedData);
    let targetPath = uniquePath(directory, saveAssetFileName(request.fileName, mimeType));
    if (typeof request.textContent === "string") {
      (0, node_fs_1.writeFileSync)(targetPath, request.textContent, "utf-8");
    } else if (request.localPath && (0, node_fs_1.existsSync)(request.localPath)) {
      (0, node_fs_1.copyFileSync)(request.localPath, targetPath);
    } else if (parsedData) {
      (0, node_fs_1.writeFileSync)(targetPath, parsedData.bytes);
    } else if (/^https?:\/\//i.test(source)) {
      const downloaded = await (0, jiaren_safe_download_1.downloadFile)(source, targetPath, { maxBytes: 2 * 1024 * 1024 * 1024 });
      const remoteMime = String(downloaded.contentType || "").split(";")[0].trim().toLowerCase();
      const correctedName = saveAssetFileName(request.fileName, remoteMime || mimeType);
      if (remoteMime && correctedName !== node_path_1.default.basename(targetPath)) {
        const correctedPath = uniquePath(directory, correctedName);
        (0, node_fs_1.renameSync)(targetPath, correctedPath);
        targetPath = correctedPath;
      }
    } else {
      return { ok: false, message: "No image source can be saved." };
    }
    const dimensions = /\.(png|jpe?g|webp|gif|bmp)$/i.test(targetPath) ? imageDimensions(targetPath) : {};
    return {
      ok: true,
      path: targetPath,
      dataUrl: dimensions.width || dimensions.height ? fileToDataUrl(targetPath) : void 0,
      width: dimensions.width,
      height: dimensions.height
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    return { ok: false, message };
  }
}
function readTextFile(request) {
  try {
    const filePath = request.path;
    if (!filePath || !(0, node_fs_1.existsSync)(filePath)) {
      return { ok: false, message: "�ļ������ڡ�" };
    }
    const maxBytes = Math.max(1024, Math.min(request.maxBytes ?? 10 * 1024 * 1024, 50 * 1024 * 1024));
    const size = (0, node_fs_1.statSync)(filePath).size;
    if (size > maxBytes) {
      return { ok: false, message: `�ļ������޷���ȡ��${Math.round(size / 1024 / 1024)}MB��` };
    }
    return { ok: true, text: (0, node_fs_1.readFileSync)(filePath, "utf-8") };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "��ȡ�ļ�ʧ�ܡ�" };
  }
}
function readMediaDataUrl(request) {
  try {
    const filePath = String(request?.path || "").trim();
    if (!filePath || !node_path_1.default.isAbsolute(filePath) || !(0, node_fs_1.existsSync)(filePath)) {
      return { ok: false, message: "Local media file does not exist." };
    }
    const stat = (0, node_fs_1.statSync)(filePath);
    const maxBytes = Math.max(1024, Math.min(request?.maxBytes ?? 25 * 1024 * 1024, 50 * 1024 * 1024));
    if (!stat.isFile() || stat.size > maxBytes) {
      return { ok: false, message: "Local media file is too large or is not a file." };
    }
    const mimeType = guessMime(filePath);
    if (!mimeType.startsWith("image/")) {
      return { ok: false, message: "Only local image previews are supported." };
    }
    return { ok: true, dataUrl: fileToDataUrl(filePath), mimeType, size: stat.size };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to read local media." };
  }
}
async function readCommunityAsset(request) {
  try {
    const source = String(request?.source || request?.url || request?.path || "").trim();
    if (!source) return { ok: false, message: "没有可发布的图片或视频。" };
    const requestedLimit = Number(request?.maxBytes) || 200 * 1024 * 1024;
    const maxBytes = Math.max(1024, Math.min(requestedLimit, 512 * 1024 * 1024));
    let bytes;
    let mimeType = "";
    let fileName = String(request?.fileName || "").trim();
    let localPath = "";
    if (/^file:/i.test(source)) {
      localPath = (0, node_url_1.fileURLToPath)(source);
    } else if (node_path_1.default.isAbsolute(source)) {
      localPath = source;
    }
    if (localPath) {
      if (!(0, node_fs_1.existsSync)(localPath)) return { ok: false, message: "本地素材文件不存在。" };
      const stat = (0, node_fs_1.statSync)(localPath);
      if (!stat.isFile()) return { ok: false, message: "当前素材不是可发布的文件。" };
      if (stat.size > maxBytes) return { ok: false, message: `素材超过 ${Math.round(maxBytes / 1024 / 1024)}MB 发布限制。` };
      bytes = (0, node_fs_1.readFileSync)(localPath);
      mimeType = guessMime(localPath);
      fileName = fileName || node_path_1.default.basename(localPath);
    } else if (/^https:/i.test(source)) {
      const downloaded = await (0, jiaren_safe_download_1.downloadBuffer)(source, {
        maxBytes,
        timeoutMs: 9e4,
        allowPrivate: false
      });
      bytes = downloaded.buffer;
      mimeType = String(downloaded.contentType || "").split(";")[0].trim().toLowerCase();
      if (!fileName) {
        try {
          fileName = node_path_1.default.basename(new URL(downloaded.finalUrl || source).pathname);
        } catch {
          fileName = "";
        }
      }
    } else {
      return { ok: false, message: "当前素材地址无法读取，请先保存素材后再发布。" };
    }
    const declaredMime = String(request?.mimeType || "").split(";")[0].trim().toLowerCase();
    if (!mimeType || mimeType === "application/octet-stream") mimeType = declaredMime || guessMime(fileName);
    if (!mimeType.startsWith("image/") && !mimeType.startsWith("video/")) {
      return { ok: false, message: "社区只支持发布图片和视频。" };
    }
    const fallbackExtension = mimeType.startsWith("video/") ? ".mp4" : ".png";
    fileName = safeFileName(fileName || `jiaren-community-${Date.now()}${fallbackExtension}`, fallbackExtension);
    return {
      ok: true,
      bytes: Uint8Array.from(bytes),
      mimeType,
      fileName,
      size: bytes.length
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "读取社区素材失败。" };
  }
}
async function readImageSourceForLocalExport(request) {
  if (request.localPath && (0, node_fs_1.existsSync)(request.localPath)) {
    return (0, node_fs_1.readFileSync)(request.localPath);
  }
  if (request.source?.startsWith("data:")) {
    return parseDataUrl(request.source).bytes;
  }
  if (request.source && (0, node_fs_1.existsSync)(request.source)) {
    return (0, node_fs_1.readFileSync)(request.source);
  }
  if (/^https?:\/\//i.test(request.source)) {
    const downloaded = await (0, jiaren_safe_download_1.downloadBuffer)(request.source, {
      accept: "image/*,*/*",
      maxBytes: 256 * 1024 * 1024
    });
    return downloaded.buffer;
  }
  throw new Error("û�п�ת����ͼƬ������ѡ�л���ͼƬ��");
}
function rgbaPixelData(data, width, height) {
  return { width, height, data: new Uint8ClampedArray(data) };
}
function emptyLayerData(width, height) {
  return new Uint8ClampedArray(width * height * 4);
}
function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) {
    h = (gn - bn) / d + (gn < bn ? 6 : 0);
  } else if (max === gn) {
    h = (bn - rn) / d + 2;
  } else {
    h = (rn - gn) / d + 4;
  }
  return { h: h / 6, s, l };
}
function colorBucketForPixel(r, g, b, a) {
  if (a < 8) {
    return "transparent";
  }
  const { h, s, l } = rgbToHsl(r, g, b);
  if (s < 0.1) {
    return l < 0.28 ? "neutral-dark" : l > 0.72 ? "neutral-light" : "neutral-mid";
  }
  const hueBucket = Math.floor(h * 8) % 8;
  const lightBucket = l < 0.34 ? "dark" : l > 0.68 ? "light" : "mid";
  return `${hueBucket}-${lightBucket}`;
}
function colorBucketLabel(bucket, index) {
  const labels = {
    "neutral-light": "ǳɫ����",
    "neutral-mid": "����ɫ����",
    "neutral-dark": "��ɫ����"
  };
  if (labels[bucket]) {
    return labels[bucket];
  }
  return `��ɫ���� ${index + 1}`;
}
function makePsdLayer(name, width, height, data, blendMode = "normal", opacity = 1) {
  return {
    name,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    blendMode,
    opacity,
    imageData: rgbaPixelData(data, width, height)
  };
}
function pixelLuma(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function localLumaEdge(rgba, width, height, x, y) {
  const pixel = y * width + x;
  const offset = pixel * 4;
  const center = pixelLuma(rgba[offset], rgba[offset + 1], rgba[offset + 2]);
  let total = 0;
  let count = 0;
  if (x > 0) {
    const left = offset - 4;
    total += Math.abs(center - pixelLuma(rgba[left], rgba[left + 1], rgba[left + 2]));
    count += 1;
  }
  if (x + 1 < width) {
    const right = offset + 4;
    total += Math.abs(center - pixelLuma(rgba[right], rgba[right + 1], rgba[right + 2]));
    count += 1;
  }
  if (y > 0) {
    const top = offset - width * 4;
    total += Math.abs(center - pixelLuma(rgba[top], rgba[top + 1], rgba[top + 2]));
    count += 1;
  }
  if (y + 1 < height) {
    const bottom = offset + width * 4;
    total += Math.abs(center - pixelLuma(rgba[bottom], rgba[bottom + 1], rgba[bottom + 2]));
    count += 1;
  }
  return total / Math.max(1, count);
}
function labelBinaryMask(mask, width, height) {
  const pixels = width * height;
  const labels = new Int32Array(pixels);
  const queue = new Int32Array(pixels);
  const components = [];
  let componentId = 0;
  for (let start = 0; start < pixels; start += 1) {
    if (labels[start] || !mask[start]) {
      continue;
    }
    componentId += 1;
    let head = 0;
    let tail = 0;
    let area = 0;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    let touchesBorder = false;
    labels[start] = componentId;
    queue[tail] = start;
    tail += 1;
    while (head < tail) {
      const pixel = queue[head];
      head += 1;
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      area += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        touchesBorder = true;
      }
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
            continue;
          }
          const next = ny * width + nx;
          if (labels[next] || !mask[next]) {
            continue;
          }
          labels[next] = componentId;
          queue[tail] = next;
          tail += 1;
        }
      }
    }
    components.push({ id: componentId, area, minX, minY, maxX, maxY, touchesBorder });
  }
  return { labels, components };
}
function componentDensity(component) {
  const width = component.maxX - component.minX + 1;
  const height = component.maxY - component.minY + 1;
  return component.area / Math.max(1, width * height);
}
function maskCoverage(mask) {
  const count = countBinaryMaskPixels(mask);
  return count / Math.max(1, mask.length);
}
function countBinaryMaskPixels(mask) {
  let count = 0;
  for (const value of mask) {
    if (value) {
      count += 1;
    }
  }
  return count;
}
function unionBinaryMasks(...masks) {
  const merged = new Uint8Array(masks[0]?.length ?? 0);
  for (const mask of masks) {
    for (let index = 0; index < merged.length; index += 1) {
      if (mask[index]) {
        merged[index] = 1;
      }
    }
  }
  return merged;
}
function intersectBinaryMask(mask, keep) {
  const next = new Uint8Array(mask.length);
  for (let index = 0; index < mask.length; index += 1) {
    next[index] = mask[index] && keep[index] ? 1 : 0;
  }
  return next;
}
function subtractBinaryMask(mask, remove) {
  const next = new Uint8Array(mask.length);
  for (let index = 0; index < mask.length; index += 1) {
    next[index] = mask[index] && !remove[index] ? 1 : 0;
  }
  return next;
}
function maskBounds(mask, width, height) {
  let area = 0;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let touchesBorder = false;
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    if (!mask[pixel]) {
      continue;
    }
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    area += 1;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
      touchesBorder = true;
    }
  }
  if (area === 0) {
    return void 0;
  }
  return { id: 0, area, minX, minY, maxX, maxY, touchesBorder };
}
function maskFromLabel(labels, label) {
  const mask = new Uint8Array(labels.length);
  for (let index = 0; index < labels.length; index += 1) {
    if (labels[index] === label) {
      mask[index] = 1;
    }
  }
  return mask;
}
function filterMaskComponents(mask, width, height, predicate, maxComponents = Number.POSITIVE_INFINITY) {
  const { labels, components } = labelBinaryMask(mask, width, height);
  const keepIds = new Set(components.filter(predicate).sort((left, right) => right.area - left.area).slice(0, maxComponents).map((component) => component.id));
  const next = new Uint8Array(mask.length);
  for (let index = 0; index < labels.length; index += 1) {
    if (keepIds.has(labels[index])) {
      next[index] = 1;
    }
  }
  return next;
}
function buildInkMask(rgba, width, height, baseMask) {
  const mask = new Uint8Array(width * height);
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    if (baseMask && !baseMask[pixel]) {
      continue;
    }
    const offset = pixel * 4;
    const alpha = rgba[offset + 3];
    if (alpha < 12) {
      continue;
    }
    const luma = pixelLuma(rgba[offset], rgba[offset + 1], rgba[offset + 2]);
    const { s, l } = rgbToHsl(rgba[offset], rgba[offset + 1], rgba[offset + 2]);
    if (luma < 72 || l < 0.28 && s < 0.42) {
      mask[pixel] = 1;
    }
  }
  const minArea = Math.max(18, Math.round(width * height * 18e-6));
  return filterMaskComponents(dilateBinaryMask(mask, width, height, 1), width, height, (component) => {
    const boxWidth = component.maxX - component.minX + 1;
    const boxHeight = component.maxY - component.minY + 1;
    const density = componentDensity(component);
    const fullCanvas = boxWidth > width * 0.92 && boxHeight > height * 0.45;
    return component.area >= minArea && !fullCanvas && density > 0.025;
  });
}
function buildPromoAccentMask(rgba, width, height, objectMask) {
  const raw = buildRuleMask(rgba, width, height, objectMask, (info) => {
    const red = (info.h < 0.055 || info.h > 0.93) && info.s > 0.28 && info.l > 0.16;
    const orange = info.h >= 0.055 && info.h < 0.16 && info.s > 0.35 && info.l > 0.18;
    const yellow = info.h >= 0.12 && info.h < 0.19 && info.s > 0.38 && info.l > 0.38;
    const magenta = info.h > 0.82 && info.s > 0.24 && info.l > 0.2;
    const inCommerceBand = info.yRatio < 0.42 || info.yRatio > 0.58 || info.xRatio < 0.42 || info.xRatio > 0.58;
    return inCommerceBand && (red || orange || yellow || magenta);
  });
  const minArea = Math.max(40, Math.round(width * height * 4e-5));
  const maxArea = Math.max(900, Math.round(width * height * 0.18));
  return filterMaskComponents(dilateBinaryMask(raw, width, height, 2), width, height, (component) => {
    const boxWidth = component.maxX - component.minX + 1;
    const boxHeight = component.maxY - component.minY + 1;
    const density = componentDensity(component);
    return component.area >= minArea && component.area <= maxArea && boxWidth < width * 0.9 && boxHeight < height * 0.42 && density > 0.08;
  }, 10);
}
function buildShapeDecorationMask(rgba, width, height, objectMask, excludeMask) {
  const raw = buildRuleMask(rgba, width, height, subtractBinaryMask(objectMask, excludeMask), (info) => {
    const saturatedShape = info.s > 0.2 && info.edge < 24 && info.l > 0.18 && info.l < 0.9;
    const paleShape = info.s < 0.18 && info.l > 0.72 && info.edge < 20;
    const layoutZone = info.yRatio < 0.28 || info.yRatio > 0.7 || info.xRatio < 0.22 || info.xRatio > 0.78;
    return layoutZone && (saturatedShape || paleShape);
  });
  const minArea = Math.max(36, Math.round(width * height * 35e-6));
  const maxArea = Math.max(900, Math.round(width * height * 0.1));
  return filterMaskComponents(dilateBinaryMask(raw, width, height, 2), width, height, (component) => {
    const boxWidth = component.maxX - component.minX + 1;
    const boxHeight = component.maxY - component.minY + 1;
    const density = componentDensity(component);
    const fullStrip = boxWidth > width * 0.9 && boxHeight > height * 0.12;
    return component.area >= minArea && component.area <= maxArea && !fullStrip && density > 0.12;
  }, 14);
}
function buildRuleMask(rgba, width, height, baseMask, predicate) {
  const mask = new Uint8Array(baseMask.length);
  for (let y = 0; y < height; y += 1) {
    const yRatio = y / height;
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      if (!baseMask[pixel]) {
        continue;
      }
      const offset = pixel * 4;
      const a = rgba[offset + 3];
      if (a < 8) {
        continue;
      }
      const r = rgba[offset];
      const g = rgba[offset + 1];
      const b = rgba[offset + 2];
      const { h, s, l } = rgbToHsl(r, g, b);
      const info = {
        pixel,
        x,
        y,
        xRatio: x / width,
        yRatio,
        r,
        g,
        b,
        a,
        h,
        s,
        l,
        edge: localLumaEdge(rgba, width, height, x, y)
      };
      if (predicate(info)) {
        mask[pixel] = 1;
      }
    }
  }
  return mask;
}
function growMaskWithin(seedMask, allowedMask, width, height, radius) {
  let current = intersectBinaryMask(seedMask, allowedMask);
  for (let step = 0; step < radius; step += 1) {
    current = intersectBinaryMask(dilateBinaryMask(current, width, height, 1), allowedMask);
  }
  return current;
}
function keepSeedConnectedComponents(grownMask, seedMask, width, height, minArea, maxComponents) {
  const { labels, components } = labelBinaryMask(grownMask, width, height);
  const seedIds = /* @__PURE__ */ new Set();
  for (let index = 0; index < seedMask.length; index += 1) {
    if (seedMask[index] && labels[index]) {
      seedIds.add(labels[index]);
    }
  }
  const keepIds = new Set(components.filter((component) => seedIds.has(component.id) && component.area >= minArea).sort((left, right) => right.area - left.area).slice(0, maxComponents).map((component) => component.id));
  const mask = new Uint8Array(grownMask.length);
  for (let index = 0; index < labels.length; index += 1) {
    if (keepIds.has(labels[index])) {
      mask[index] = 1;
    }
  }
  return mask;
}
function buildSeededElementMask(rgba, width, height, objectMask, seedPredicate, allowedPredicate, growRadius, minArea, maxComponents = 3) {
  const seedMask = buildRuleMask(rgba, width, height, objectMask, seedPredicate);
  if (countBinaryMaskPixels(seedMask) < Math.max(12, Math.round(minArea * 0.04))) {
    return new Uint8Array(objectMask.length);
  }
  const allowedMask = buildRuleMask(rgba, width, height, objectMask, allowedPredicate);
  const grownMask = growMaskWithin(seedMask, allowedMask, width, height, growRadius);
  return keepSeedConnectedComponents(grownMask, seedMask, width, height, minArea, maxComponents);
}
function buildSemanticElementCandidates(rgba, width, height, objectMask) {
  const pixels = width * height;
  const scale = Math.min(width, height);
  const growLarge = Math.max(6, Math.round(scale * 9e-3));
  const growMedium = Math.max(4, Math.round(scale * 6e-3));
  const growSmall = Math.max(2, Math.round(scale * 3e-3));
  const minLarge = Math.max(260, Math.round(pixels * 22e-4));
  const minMedium = Math.max(120, Math.round(pixels * 55e-5));
  const candidates = [];
  const centralSubjectMask = buildSeededElementMask(rgba, width, height, objectMask, (info) => info.xRatio > 0.12 && info.xRatio < 0.88 && info.yRatio > 0.12 && info.yRatio < 0.9 && (info.edge > 10 || info.s > 0.14 || info.l < 0.58), (info) => info.xRatio > 0.08 && info.xRatio < 0.92 && info.yRatio > 0.08 && info.yRatio < 0.94 && (info.edge > 5 || info.s > 0.08 || info.l < 0.86), growLarge, minLarge, 5);
  candidates.push({ name: "��Ʒ����/��ҪԪ��", mask: centralSubjectMask, priority: 78, minArea: minLarge });
  const auxiliaryProductMask = buildSeededElementMask(rgba, width, height, objectMask, (info) => {
    const sideOrBottom = info.xRatio < 0.24 || info.xRatio > 0.76 || info.yRatio > 0.62;
    return sideOrBottom && (info.edge > 12 || info.s > 0.18 || info.l < 0.52);
  }, (info) => {
    const sideOrBottom = info.xRatio < 0.3 || info.xRatio > 0.7 || info.yRatio > 0.56;
    return sideOrBottom && (info.edge > 5 || info.s > 0.1 || info.l < 0.82);
  }, growMedium, minMedium, 6);
  candidates.push({ name: "������Ʒ/���Ԫ��", mask: auxiliaryProductMask, priority: 62, minArea: minMedium });
  const darkLineMask = buildInkMask(rgba, width, height, objectMask);
  candidates.push({ name: "��ɫ����/����", mask: darkLineMask, priority: 58, minArea: Math.max(42, Math.round(pixels * 4e-5)) });
  const smallDetailMask = buildRuleMask(rgba, width, height, objectMask, (info) => {
    const outsideCenter = info.xRatio < 0.18 || info.xRatio > 0.82 || info.yRatio < 0.18 || info.yRatio > 0.76;
    return outsideCenter && info.edge > 16 && info.s > 0.12;
  });
  candidates.push({
    name: "ϸ��СԪ��",
    mask: filterMaskComponents(dilateBinaryMask(smallDetailMask, width, height, 1), width, height, (component) => {
      const boxWidth = component.maxX - component.minX + 1;
      const boxHeight = component.maxY - component.minY + 1;
      return component.area >= Math.max(24, Math.round(pixels * 25e-6)) && boxWidth < width * 0.28 && boxHeight < height * 0.22;
    }, 16),
    priority: 54,
    minArea: Math.max(24, Math.round(pixels * 25e-6))
  });
  return candidates;
}
function isBrightOverlayPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const nearWhite = r > 218 && g > 218 && b > 205 && max - min < 58;
  const warmCream = r > 208 && g > 198 && b > 112 && b < Math.min(r, g) - 18;
  return nearWhite || warmCream;
}
function buildTextOverlayMask(rgba, width, height) {
  const candidate = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    const yRatio = y / height;
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const offset = pixel * 4;
      if (rgba[offset + 3] < 12) {
        continue;
      }
      const r = rgba[offset];
      const g = rgba[offset + 1];
      const b = rgba[offset + 2];
      const luma = pixelLuma(r, g, b);
      const { s, l } = rgbToHsl(r, g, b);
      const edge = localLumaEdge(rgba, width, height, x, y);
      const xRatio = x / width;
      const commerceTextZone = yRatio < 0.4 || yRatio > 0.7 || xRatio < 0.22 || xRatio > 0.78;
      const darkCopyPixel = commerceTextZone && luma < 96 && edge > 5 && (l < 0.42 || s < 0.35);
      const highContrastCopyPixel = commerceTextZone && edge > 20 && l > 0.18 && l < 0.86;
      if (isBrightOverlayPixel(r, g, b) || darkCopyPixel || highContrastCopyPixel) {
        candidate[pixel] = 1;
      }
    }
  }
  const { labels, components } = labelBinaryMask(candidate, width, height);
  const keepIds = /* @__PURE__ */ new Set();
  const minArea = Math.max(18, width * height * 18e-6);
  for (const component of components) {
    if (component.area < minArea) {
      continue;
    }
    const boxWidth = component.maxX - component.minX + 1;
    const boxHeight = component.maxY - component.minY + 1;
    const centerX = (component.minX + component.maxX) / 2 / width;
    const centerY = (component.minY + component.maxY) / 2 / height;
    const density = componentDensity(component);
    const fullWidthBackground = boxWidth > width * 0.86 && boxHeight > height * 0.08 && density > 0.5;
    if (fullWidthBackground) {
      continue;
    }
    const topTitle = centerY < 0.4 && boxHeight < height * 0.24;
    const smallTopBadge = centerY < 0.14 && boxWidth > width * 0.08;
    const middleWatermark = centerY > 0.39 && centerY < 0.58 && centerX > 0.42 && boxWidth > width * 0.025 && boxHeight < height * 0.09;
    const bottomCaption = centerY > 0.82 && density < 0.58;
    const sideCopy = (centerX < 0.22 || centerX > 0.78) && boxHeight < height * 0.32 && boxWidth < width * 0.5;
    const priceOrBadge = boxHeight < height * 0.18 && boxWidth < width * 0.62 && density > 0.035;
    const textLikeStrip = boxWidth > width * 0.045 && boxHeight < height * 0.09 && density < 0.68;
    if (topTitle || smallTopBadge || middleWatermark || bottomCaption || sideCopy || priceOrBadge || textLikeStrip) {
      keepIds.add(component.id);
    }
  }
  const mask = new Uint8Array(width * height);
  for (let index = 0; index < labels.length; index += 1) {
    if (keepIds.has(labels[index])) {
      mask[index] = 1;
    }
  }
  return dilateBinaryMask(mask, width, height, 1);
}
function buildForegroundObjectMask(rgba, width, height, textMask) {
  const candidate = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    const yRatio = y / height;
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      if (textMask[pixel]) {
        continue;
      }
      const offset = pixel * 4;
      const alpha = rgba[offset + 3];
      if (alpha < 12) {
        continue;
      }
      const r = rgba[offset];
      const g = rgba[offset + 1];
      const b = rgba[offset + 2];
      const { h, s, l } = rgbToHsl(r, g, b);
      const edge = localLumaEdge(rgba, width, height, x, y);
      const xRatio = x / width;
      const skyLike = yRatio < 0.86 && h > 0.45 && h < 0.63 && b > 138 && g > 122 && b > r + 12 && g > r + 6 && l > 0.45;
      const tableLike = yRatio > 0.76 && l > 0.58 && s < 0.2 && Math.abs(r - g) < 30 && Math.abs(g - b) < 34;
      const flatMargin = (xRatio < 0.04 || xRatio > 0.96 || yRatio < 0.035 || yRatio > 0.965) && edge < 10 && s < 0.18 && l > 0.55;
      const backgroundLike = skyLike && edge < 16 && l > 0.5 || tableLike && edge < 18 || flatMargin;
      if (backgroundLike) {
        continue;
      }
      const centralProductBias = xRatio > 0.16 && xRatio < 0.84 && yRatio > 0.16 && yRatio < 0.88;
      if (edge > 13 || s > 0.18 || l < 0.58 || centralProductBias && s > 0.08 && l < 0.9 || yRatio > 0.36 && s > 0.08 && l < 0.86) {
        candidate[pixel] = 1;
      }
    }
  }
  const closed = erodeBinaryMask(dilateBinaryMask(candidate, width, height, 5), width, height, 2);
  return subtractBinaryMask(closed, dilateBinaryMask(textMask, width, height, 1));
}
function makeLayerFromMask(name, rgba, width, height, mask, blendMode = "normal", opacity = 1) {
  if (maskCoverage(mask) <= 0) {
    return void 0;
  }
  const data = emptyLayerData(width, height);
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    if (!mask[pixel]) {
      continue;
    }
    const offset = pixel * 4;
    const alpha = rgba[offset + 3];
    if (alpha < 8) {
      continue;
    }
    data[offset] = rgba[offset];
    data[offset + 1] = rgba[offset + 1];
    data[offset + 2] = rgba[offset + 2];
    data[offset + 3] = alpha;
  }
  return makePsdLayer(name, width, height, data, blendMode, opacity);
}
function subtractAlreadyAssigned(mask, assignedMask, width, height) {
  const trimmed = subtractBinaryMask(mask, erodeBinaryMask(assignedMask, width, height, 1));
  const bounds = maskBounds(trimmed, width, height);
  if (!bounds) {
    return new Uint8Array(mask.length);
  }
  return trimmed;
}
function buildSemanticElementLayers(rgba, width, height, objectMask) {
  const layers = [];
  const assignedMask = new Uint8Array(objectMask.length);
  const promoMask = buildPromoAccentMask(rgba, width, height, objectMask);
  const promoLayer = makeLayerFromMask("�۸����/�Ż�ɫ��", rgba, width, height, promoMask);
  if (promoLayer) {
    layers.push(promoLayer);
    for (let index = 0; index < assignedMask.length; index += 1) {
      if (promoMask[index]) {
        assignedMask[index] = 1;
      }
    }
  }
  const shapeMask = buildShapeDecorationMask(rgba, width, height, objectMask, assignedMask);
  const shapeLayer = makeLayerFromMask("װ����״/��ǩ�װ�", rgba, width, height, shapeMask);
  if (shapeLayer) {
    layers.push(shapeLayer);
    for (let index = 0; index < assignedMask.length; index += 1) {
      if (shapeMask[index]) {
        assignedMask[index] = 1;
      }
    }
  }
  const candidates = buildSemanticElementCandidates(rgba, width, height, objectMask).sort((left, right) => right.priority - left.priority);
  const minMeaningfulArea = Math.max(42, Math.round(width * height * 35e-6));
  for (const candidate of candidates) {
    const cleaned = erodeBinaryMask(dilateBinaryMask(candidate.mask, width, height, 1), width, height, 1);
    const uniqueMask = subtractAlreadyAssigned(cleaned, assignedMask, width, height);
    const bounds = maskBounds(uniqueMask, width, height);
    if (!bounds || bounds.area < Math.max(candidate.minArea, minMeaningfulArea)) {
      continue;
    }
    const boxWidth = bounds.maxX - bounds.minX + 1;
    const boxHeight = bounds.maxY - bounds.minY + 1;
    if (bounds.area > width * height * 0.62 || boxWidth > width * 0.95 && boxHeight > height * 0.7) {
      continue;
    }
    const layer = makeLayerFromMask(candidate.name, rgba, width, height, dilateBinaryMask(uniqueMask, width, height, 1));
    if (!layer) {
      continue;
    }
    layers.push(layer);
    for (let index = 0; index < assignedMask.length; index += 1) {
      if (uniqueMask[index]) {
        assignedMask[index] = 1;
      }
    }
  }
  return { layers, assignedMask, promoMask, shapeMask };
}
function buildRemainingObjectLayers(rgba, width, height, objectMask, assignedMask) {
  const sourceMask = assignedMask ? subtractBinaryMask(objectMask, dilateBinaryMask(assignedMask, width, height, 1)) : objectMask;
  const refinedMask = erodeBinaryMask(dilateBinaryMask(sourceMask, width, height, 1), width, height, 1);
  const { labels, components } = labelBinaryMask(refinedMask, width, height);
  const pixels = width * height;
  const minArea = Math.max(110, pixels * 11e-5);
  const ranked = components.filter((component) => {
    const boxWidth = component.maxX - component.minX + 1;
    const boxHeight = component.maxY - component.minY + 1;
    const hugeBackground = component.area > pixels * 0.58 || boxWidth > width * 0.96 && boxHeight > height * 0.5;
    return component.area >= minArea && !hugeBackground;
  }).sort((left, right) => right.area - left.area);
  const layers = [];
  const maxSeparateObjects = 12;
  for (const component of ranked.slice(0, maxSeparateObjects)) {
    const componentMask = maskFromLabel(labels, component.id);
    const layer = makeLayerFromMask(`Remaining element ${String(layers.length + 1).padStart(2, "0")}`, rgba, width, height, dilateBinaryMask(componentMask, width, height, 1));
    if (layer) {
      layers.push(layer);
    }
  }
  return layers;
}
function buildObjectLayers(rgba, width, height, objectMask) {
  const { layers: semanticLayers, assignedMask } = buildSemanticElementLayers(rgba, width, height, objectMask);
  const remainingLayers = buildRemainingObjectLayers(rgba, width, height, objectMask, assignedMask);
  const merged = [...semanticLayers, ...remainingLayers];
  if (merged.length > 0) {
    return merged;
  }
  const { labels, components } = labelBinaryMask(objectMask, width, height);
  const pixels = width * height;
  const minArea = Math.max(120, pixels * 18e-5);
  const ranked = components.filter((component) => {
    const boxWidth = component.maxX - component.minX + 1;
    const boxHeight = component.maxY - component.minY + 1;
    const hugeBackground = component.area > pixels * 0.72 || boxWidth > width * 0.96 && boxHeight > height * 0.5;
    return component.area >= minArea && !hugeBackground;
  }).sort((left, right) => right.area - left.area);
  const layers = [];
  const usedIds = /* @__PURE__ */ new Set();
  const maxSeparateObjects = 10;
  for (const component of ranked.slice(0, maxSeparateObjects)) {
    usedIds.add(component.id);
    const componentMask = new Uint8Array(objectMask.length);
    for (let index = 0; index < labels.length; index += 1) {
      if (labels[index] === component.id) {
        componentMask[index] = 1;
      }
    }
    const expanded = dilateBinaryMask(componentMask, width, height, 1);
    const layer = makeLayerFromMask(`Foreground object ${String(layers.length + 1).padStart(2, "0")}`, rgba, width, height, expanded);
    if (layer) {
      layers.push(layer);
    }
  }
  const detailMask = new Uint8Array(objectMask.length);
  let detailArea = 0;
  for (let index = 0; index < labels.length; index += 1) {
    const label = labels[index];
    if (label && !usedIds.has(label)) {
      detailMask[index] = 1;
      detailArea += 1;
    }
  }
  if (detailArea >= Math.max(80, pixels * 8e-5)) {
    const detailLayer = makeLayerFromMask("Small foreground details", rgba, width, height, dilateBinaryMask(detailMask, width, height, 1));
    if (detailLayer) {
      layers.push(detailLayer);
    }
  }
  return layers;
}
async function buildCleanBackgroundLayer(rgba, width, height, protectedMask) {
  const sharp = await importSharp();
  const blurRadius = Math.max(10, Math.round(Math.min(width, height) * 0.018));
  const blurred = await sharp(rgba, { raw: { width, height, channels: 4 } }).blur(blurRadius).raw().toBuffer();
  const expandedMask = dilateBinaryMask(protectedMask, width, height, 3);
  const data = emptyLayerData(width, height);
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const offset = pixel * 4;
    const source = expandedMask[pixel] ? blurred : rgba;
    data[offset] = source[offset];
    data[offset + 1] = source[offset + 1];
    data[offset + 2] = source[offset + 2];
    data[offset + 3] = rgba[offset + 3];
  }
  return makePsdLayer("����/��ͼ����", width, height, data, "normal", 1);
}
function hiddenGroup(name, children) {
  return { name, opened: false, hidden: true, children };
}
function countLeafLayers(layers) {
  return layers.reduce((count, layer) => count + (layer.children ? countLeafLayers(layer.children) : 1), 0);
}
async function buildSmartPsdLayers(rgba, width, height, mode) {
  const textMask = buildTextOverlayMask(rgba, width, height);
  const objectMask = buildForegroundObjectMask(rgba, width, height, textMask);
  const protectedMask = unionBinaryMasks(textMask, objectMask);
  const textLayer = makeLayerFromMask("�İ�/Logo ���ز㣨OCR ����������֣�", rgba, width, height, textMask);
  const objectLayers = buildObjectLayers(rgba, width, height, objectMask);
  const backgroundLayer = await buildCleanBackgroundLayer(rgba, width, height, protectedMask);
  const regionLayers = buildRegionLayers(rgba, width, height);
  const toneLayers = mode === "normal" ? [buildToneLayer(rgba, width, height, "bright"), buildToneLayer(rgba, width, height, "shadow")] : [
    buildToneLayer(rgba, width, height, "screen"),
    buildToneLayer(rgba, width, height, "multiply"),
    buildToneLayer(rgba, width, height, "addition"),
    buildToneLayer(rgba, width, height, "subtract")
  ];
  const originalLayer = makePsdLayer("ԭͼ�ο�", width, height, new Uint8ClampedArray(rgba), "normal", 1);
  originalLayer.hidden = true;
  const children = [];
  if (textLayer) {
    children.push({ name: "�İ�/Logo", opened: true, children: [textLayer] });
  }
  if (objectLayers.length > 0) {
    children.push({ name: "��Ʒ/Ԫ�طֲ�", opened: true, children: objectLayers });
  }
  children.push({ name: "����", opened: true, children: [backgroundLayer] });
  children.push(hiddenGroup("����ɫ������", regionLayers));
  children.push(hiddenGroup("��Ӱ/�߹⸨��", toneLayers));
  children.push(originalLayer);
  return { children, layerCount: countLeafLayers(children) };
}
function buildRegionLayers(rgba, width, height) {
  const bucketCounts = /* @__PURE__ */ new Map();
  const totalPixels = width * height;
  for (let pixel = 0; pixel < totalPixels; pixel += 1) {
    const offset = pixel * 4;
    const bucket = colorBucketForPixel(rgba[offset], rgba[offset + 1], rgba[offset + 2], rgba[offset + 3]);
    if (bucket !== "transparent") {
      bucketCounts.set(bucket, (bucketCounts.get(bucket) ?? 0) + 1);
    }
  }
  const primaryBuckets = [...bucketCounts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 6).map(([bucket]) => bucket);
  const bucketToLayerIndex = new Map(primaryBuckets.map((bucket, index) => [bucket, index]));
  const layerData = [...primaryBuckets, "other"].map(() => emptyLayerData(width, height));
  for (let pixel = 0; pixel < totalPixels; pixel += 1) {
    const offset = pixel * 4;
    const alpha = rgba[offset + 3];
    if (alpha < 8) {
      continue;
    }
    const bucket = colorBucketForPixel(rgba[offset], rgba[offset + 1], rgba[offset + 2], alpha);
    const layerIndex = bucketToLayerIndex.get(bucket) ?? layerData.length - 1;
    const target = layerData[layerIndex];
    target[offset] = rgba[offset];
    target[offset + 1] = rgba[offset + 1];
    target[offset + 2] = rgba[offset + 2];
    target[offset + 3] = alpha;
  }
  return layerData.map((data, index) => ({ data, index })).filter(({ data }) => {
    for (let offset = 3; offset < data.length; offset += 4) {
      if (data[offset] > 0) {
        return true;
      }
    }
    return false;
  }).map(({ data, index }) => {
    const bucket = index < primaryBuckets.length ? primaryBuckets[index] : "other";
    return makePsdLayer(index < primaryBuckets.length ? colorBucketLabel(bucket, index) : "��������", width, height, data, "normal", 1);
  });
}
function buildToneLayer(rgba, width, height, kind) {
  const data = emptyLayerData(width, height);
  const totalPixels = width * height;
  for (let pixel = 0; pixel < totalPixels; pixel += 1) {
    const offset = pixel * 4;
    const sourceAlpha = rgba[offset + 3];
    if (sourceAlpha < 8) {
      continue;
    }
    const luma = 0.2126 * rgba[offset] + 0.7152 * rgba[offset + 1] + 0.0722 * rgba[offset + 2];
    let alpha = 0;
    let red = rgba[offset];
    let green = rgba[offset + 1];
    let blue = rgba[offset + 2];
    if (kind === "screen" || kind === "bright") {
      alpha = Math.max(0, Math.round((luma - 150) / 105 * sourceAlpha));
      red = Math.min(255, Math.round(red * 1.08 + 18));
      green = Math.min(255, Math.round(green * 1.08 + 18));
      blue = Math.min(255, Math.round(blue * 1.08 + 18));
    } else if (kind === "multiply" || kind === "shadow") {
      alpha = Math.max(0, Math.round((118 - luma) / 118 * sourceAlpha));
      red = Math.max(0, Math.round(red * 0.72));
      green = Math.max(0, Math.round(green * 0.72));
      blue = Math.max(0, Math.round(blue * 0.72));
    } else if (kind === "addition") {
      alpha = Math.max(0, Math.round((Math.abs(luma - 128) / 128 * 0.42 + 0.08) * sourceAlpha));
      red = Math.min(255, Math.round(red * 0.62 + 78));
      green = Math.min(255, Math.round(green * 0.62 + 78));
      blue = Math.min(255, Math.round(blue * 0.62 + 78));
    } else {
      alpha = Math.max(0, Math.round((255 - luma) / 255 * 0.38 * sourceAlpha));
      red = Math.max(0, Math.round(255 - red));
      green = Math.max(0, Math.round(255 - green));
      blue = Math.max(0, Math.round(255 - blue));
    }
    if (alpha <= 0) {
      continue;
    }
    data[offset] = red;
    data[offset + 1] = green;
    data[offset + 2] = blue;
    data[offset + 3] = Math.min(255, alpha);
  }
  const labelByKind = {
    screen: "���� Screen",
    multiply: "��Ӱ Multiply",
    addition: "���� Addition",
    subtract: "��ɫ Subtract",
    bright: "�߹� Bright",
    shadow: "��Ӱ Shadow"
  };
  const blendByKind = {
    screen: "screen",
    multiply: "multiply",
    addition: "linear dodge",
    subtract: "subtract",
    bright: "screen",
    shadow: "multiply"
  };
  return makePsdLayer(labelByKind[kind], width, height, data, blendByKind[kind], kind === "addition" || kind === "subtract" ? 0.46 : 0.72);
}
async function exportLayeredPsd(request) {
  const startedAt = performance.now();
  const id = node_crypto_1.default.randomUUID();
  try {
    const sourceBuffer = await readImageSourceForLocalExport(request);
    const sharp = await importSharp();
    const maxSide = 2048;
    const normalized = await sharp(sourceBuffer).rotate().resize({ width: maxSide, height: maxSide, fit: "inside", withoutEnlargement: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const width = normalized.info.width;
    const height = normalized.info.height;
    const rgba = Buffer.from(normalized.data);
    const previewBuffer = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
    const previewPath = writeBufferToCache(previewBuffer, `jiaren_psd_preview_${Date.now()}.png`, request.cacheDir);
    const { children, layerCount } = await buildSmartPsdLayers(rgba, width, height, request.mode);
    const psd = {
      width,
      height,
      imageData: rgbaPixelData(rgba, width, height),
      children
    };
    const { writePsdBuffer } = await import("ag-psd");
    const outputDir = request.downloadsDir?.trim() || defaultDownloadsDir;
    ensureDir(outputDir);
    const baseName = safeFileName(request.name || "jiaren-layered.psd", ".psd").replace(/\.[^.]+$/, "");
    const psdPath = uniquePath(outputDir, `${baseName}_PSD�ֲ�.psd`);
    const psdBuffer = writePsdBuffer(psd, { noBackground: true });
    (0, node_fs_1.writeFileSync)(psdPath, psdBuffer);
    return {
      ok: true,
      id,
      elapsedMs: Math.round(performance.now() - startedAt),
      message: `Jiaren AI PSD �ֲ�ת���ɹ�������� ${layerCount} ��ͼ�㣻�Ѱ�������ƽṹ����İ�/Logo���۸��������Ʒ���塢װ����״�������͹�Ӱ����������ĿǰΪ�������ز㣬���� OCR �������Ϊ�ɱ༭���ֲ㡣`,
      psdPath,
      previewPath,
      previewDataUrl: fileToDataUrl(previewPath),
      width,
      height,
      layerCount
    };
  } catch (error) {
    return {
      ok: false,
      id,
      elapsedMs: Math.round(performance.now() - startedAt),
      message: error instanceof Error ? error.message : "PSD �ֲ�ת��ʧ�ܡ�"
    };
  }
}
function safeSavedProjectId(value) {
  const candidate = typeof value === "string" ? value.trim() : "";
  return /^[a-zA-Z0-9_-]{8,80}$/.test(candidate) ? candidate : "";
}
function savedProjectPath(projectId) {
  const safeId = safeSavedProjectId(projectId);
  if (!safeId) {
    throw new Error("项目编号无效。");
  }
  return node_path_1.default.join(savedProjectRoot, `${safeId}.json`);
}
function safeProjectDirectory(value) {
  const candidate = typeof value === "string" ? value.trim() : "";
  if (!candidate || !node_path_1.default.isAbsolute(candidate)) {
    return "";
  }
  return node_path_1.default.resolve(candidate);
}
function projectManifestPath(projectDirectory) {
  const safeDirectory = safeProjectDirectory(projectDirectory);
  if (!safeDirectory) {
    throw new Error("项目文件夹无效。");
  }
  return node_path_1.default.join(safeDirectory, projectManifestName);
}
function readProjectJson(filePath) {
  return JSON.parse((0, node_fs_1.readFileSync)(filePath, "utf-8"));
}
function resolveIndexedProject(indexPath) {
  const indexed = readProjectJson(indexPath);
  const projectDirectory = safeProjectDirectory(indexed?.projectDirectory);
  const manifestPath = projectDirectory ? projectManifestPath(projectDirectory) : "";
  if (manifestPath && (0, node_fs_1.existsSync)(manifestPath)) {
    const external = readProjectJson(manifestPath);
    return {
      project: {
        ...external,
        projectDirectory,
        projectFilePath: manifestPath
      },
      sourcePath: manifestPath
    };
  }
  return { project: indexed, sourcePath: indexPath };
}
// Jiaren v0.1.9 runtime hardening queue
let projectOperationQueue = Promise.resolve();
function enqueueProjectOperation(operation) {
  const pending = projectOperationQueue.then(operation, operation);
  projectOperationQueue = pending.then(() => void 0, () => void 0);
  return pending;
}
function atomicWriteProjectFile(filePath, serialized) {
  ensureDir(node_path_1.default.dirname(filePath));
  const temporaryPath = node_path_1.default.join(
    node_path_1.default.dirname(filePath),
    `.${node_path_1.default.basename(filePath)}.${process.pid}.${node_crypto_1.default.randomUUID()}.tmp`,
  );
  const backupPath = `${temporaryPath}.bak`;
  let descriptor;
  let movedExistingFile = false;
  try {
    descriptor = (0, node_fs_1.openSync)(temporaryPath, "w");
    (0, node_fs_1.writeFileSync)(descriptor, serialized, "utf8");
    (0, node_fs_1.fsyncSync)(descriptor);
    (0, node_fs_1.closeSync)(descriptor);
    descriptor = void 0;
    if ((0, node_fs_1.existsSync)(filePath)) {
      (0, node_fs_1.renameSync)(filePath, backupPath);
      movedExistingFile = true;
    }
    (0, node_fs_1.renameSync)(temporaryPath, filePath);
    if (movedExistingFile && (0, node_fs_1.existsSync)(backupPath)) {
      try { (0, node_fs_1.unlinkSync)(backupPath); } catch {}
    }
  } catch (error) {
    if (descriptor !== void 0) {
      try { (0, node_fs_1.closeSync)(descriptor); } catch {}
    }
    if (movedExistingFile && !(0, node_fs_1.existsSync)(filePath) && (0, node_fs_1.existsSync)(backupPath)) {
      try { (0, node_fs_1.renameSync)(backupPath, filePath); } catch {}
    }
    try {
      if ((0, node_fs_1.existsSync)(temporaryPath)) (0, node_fs_1.unlinkSync)(temporaryPath);
    } catch {}
    throw error;
  }
}
function listSavedProjects() {
  ensureLocalRoots();
  const projects = [];
  for (const name of (0, node_fs_1.readdirSync)(savedProjectRoot)) {
    if (!/^[a-zA-Z0-9_-]{8,80}\.json$/.test(name)) {
      continue;
    }
    try {
      const indexPath = node_path_1.default.join(savedProjectRoot, name);
      const { project, sourcePath } = resolveIndexedProject(indexPath);
      const nodes = Array.isArray(project?.workflow?.nodes) ? project.workflow.nodes : [];
      const assets = Array.isArray(project?.canvas?.canvasAssets) ? project.canvas.canvasAssets : [];
      projects.push({
        id: safeSavedProjectId(project.projectId) || name.replace(/\.json$/i, ""),
        projectName: cleanText(project.projectName, defaultProjectName, 80),
        savedAt: typeof project.savedAt === "string" ? project.savedAt : new Date((0, node_fs_1.statSync)(sourcePath).mtimeMs).toISOString(),
        nodeCount: nodes.length,
        assetCount: assets.length,
        projectDirectory: safeProjectDirectory(project.projectDirectory),
        projectFilePath: typeof project.projectFilePath === "string" ? project.projectFilePath : ""
      });
    } catch {
    }
  }
  projects.sort((left, right) => String(right.savedAt).localeCompare(String(left.savedAt)));
  return { ok: true, projects };
}
function loadSavedProject(projectId) {
  try {
    ensureLocalRoots();
    const indexPath = savedProjectPath(projectId);
    const { project, sourcePath } = resolveIndexedProject(indexPath);
    atomicWriteProjectFile(node_path_1.default.join(projectRoot, "workflow.json"), JSON.stringify(project, null, 2));
    return { ok: true, project, path: sourcePath };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "项目打开失败。" };
  }
}
function deleteSavedProject(projectId) {
  try {
    const filePath = savedProjectPath(projectId);
    if ((0, node_fs_1.existsSync)(filePath)) {
      (0, node_fs_1.unlinkSync)(filePath);
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "项目删除失败。" };
  }
}
async function chooseProjectDirectory(projectName) {
  const qaDirectory = safeProjectDirectory(process.env.JIAREN_QA_PROJECT_DIR);
  if (qaDirectory) {
    ensureDir(qaDirectory);
    return { canceled: false, projectDirectory: qaDirectory };
  }
  const result = await electron_1.dialog.showOpenDialog({
    title: `选择“${cleanText(projectName, defaultProjectName, 80)}”的项目文件夹`,
    buttonLabel: "保存到此文件夹",
    defaultPath: electron_1.app.getPath("documents"),
    properties: ["openDirectory", "createDirectory"]
  });
  if (result.canceled || !result.filePaths[0]) {
    return { canceled: true, projectDirectory: "" };
  }
  return { canceled: false, projectDirectory: safeProjectDirectory(result.filePaths[0]) };
}
function startNewProject() {
  try {
    ensureLocalRoots();
    const filePath = node_path_1.default.join(projectRoot, "workflow.json");
    if ((0, node_fs_1.existsSync)(filePath)) {
      (0, node_fs_1.unlinkSync)(filePath);
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "新建项目失败。" };
  }
}
async function saveProject(payload) {
  try {
    ensureLocalRoots();
    const filePath = node_path_1.default.join(projectRoot, "workflow.json");
    let projectId = safeSavedProjectId(payload?.projectId);
    let currentProject;
    if ((0, node_fs_1.existsSync)(filePath)) {
      try {
        const current = readProjectJson(filePath);
        const sameProject = projectId
          ? safeSavedProjectId(current.projectId) === projectId
          : cleanText(current.projectName, defaultProjectName, 80) === cleanText(payload?.projectName, defaultProjectName, 80);
        if (sameProject) {
          currentProject = current;
          projectId ||= safeSavedProjectId(current.projectId);
        }
      } catch {
      }
    }
    projectId ||= node_crypto_1.default.randomUUID();
    let projectDirectory = safeProjectDirectory(payload?.projectDirectory) || safeProjectDirectory(currentProject?.projectDirectory);
    if (payload?.explicitSave === true && !projectDirectory) {
      const selection = await chooseProjectDirectory(payload?.projectName);
      if (selection.canceled || !selection.projectDirectory) {
        return { ok: false, canceled: true, message: "已取消保存项目。" };
      }
      projectDirectory = selection.projectDirectory;
    }
    const projectFilePath = projectDirectory ? projectManifestPath(projectDirectory) : "";
    const revision = Math.max(
      Number(payload?.revision) || 0,
      Number(currentProject?.revision) || 0,
    ) + 1;
    const savedAt = new Date().toISOString();
    const project = {
      ...payload,
      projectId,
      projectName: cleanText(payload?.projectName, defaultProjectName, 80),
      revision,
      savedAt,
      ...(projectDirectory ? { projectDirectory, projectFilePath } : {})
    };
    const serialized = JSON.stringify(project, null, 2);
    atomicWriteProjectFile(filePath, serialized);
    if (payload?.explicitSave === true) {
      ensureDir(projectDirectory);
      atomicWriteProjectFile(projectFilePath, serialized);
      atomicWriteProjectFile(savedProjectPath(projectId), serialized);
    }
    return {
      ok: true,
      path: projectFilePath || filePath,
      workingPath: filePath,
      projectId,
      projectDirectory,
      projectFilePath,
      revision,
      savedAt,
      explicitSaved: payload?.explicitSave === true
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "����ʧ�ܡ�";
    return { ok: false, message };
  }
}
function loadProject() {
  try {
    ensureDir(dataRoot);
    const filePath = node_path_1.default.join(projectRoot, "workflow.json");
    if (!(0, node_fs_1.existsSync)(filePath)) {
      return void 0;
    }
    const raw = (0, node_fs_1.readFileSync)(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return void 0;
  }
}
function getStats() {
  const memory = process.memoryUsage();
  const toMb = (value) => Math.round(value / 1024 / 1024 * 10) / 10;
  return {
    heapUsedMb: toMb(memory.heapUsed),
    heapTotalMb: toMb(memory.heapTotal),
    rssMb: toMb(memory.rss),
    systemFreeMb: toMb(node_os_1.default.freemem()),
    systemTotalMb: toMb(node_os_1.default.totalmem())
  };
}
function getMainWindow() {
  return electron_1.BrowserWindow.getAllWindows()[0];
}
function handleWindowCommand(command) {
  const mainWindow = getMainWindow();
  if (!mainWindow) {
    return { ok: false };
  }
  if (command === "minimize") {
    mainWindow.minimize();
    return { ok: true, isMaximized: mainWindow.isMaximized() };
  }
  if (command === "toggleMaximize") {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return { ok: true, isMaximized: mainWindow.isMaximized() };
  }
  if (command === "close") {
    const isMaximized = mainWindow.isMaximized();
    mainWindow.close();
    return { ok: true, isMaximized };
  }
  return { ok: false, isMaximized: mainWindow.isMaximized() };
}
function getZoomState() {
  const mainWindow = getMainWindow();
  const factor = mainWindow?.webContents.getZoomFactor() ?? 1;
  return { zoomPercent: Math.round(factor * 100) };
}
function setZoomState(zoomPercent) {
  const mainWindow = getMainWindow();
  const clamped = Math.min(200, Math.max(40, zoomPercent));
  mainWindow?.webContents.setZoomFactor(clamped / 100);
  return { zoomPercent: clamped };
}
const imageTaskStates = new Map();
const activeImageTasks = new Map();
const imageTaskQueue = [];
const MAX_ACTIVE_IMAGE_TASKS = 2;
function queuePosition(task) {
  if (!task || task.state !== "queued") return 0;
  const index = imageTaskQueue.indexOf(task);
  return index < 0 ? 0 : index + 1;
}
function updateQueuedImageTaskPositions() {
  imageTaskQueue.forEach((task) => emitImageTaskState(task));
}
function safeImageTaskError(error) {
  const value = error instanceof Error ? error.message : String(error || "");
  if (/401|403|api[_ -]?key|authorization|unauthorized|forbidden/i.test(value)) return "图片接口鉴权失败，请检查当前图片 API Key。";
  if (/404|model unavailable|not found|不存在|未找到/i.test(value)) return "图片模型或接口路径不存在，请检查模型 ID 和 Base URL。";
  if (/429|capacity|at capacity|rate limit|额度|余额不足/i.test(value)) return "图片接口额度不足或请求过多，请检查额度后重试。";
  if (/abort|timeout|timed out|超时/i.test(value)) return "图片接口响应超时，请稍后重试。";
  if (/5\d\d|temporarily unavailable|service unavailable/i.test(value)) return "图片服务暂时不可用，请稍后重试。";
  const safe = value.replace(/https?:\/\/[^\s]+/gi, "[接口地址]").replace(/\b(?:sk|sess|key|token)[-_a-z0-9]{8,}\b/gi, "[已隐藏凭证]").trim();
  return safe.slice(0, 240) || "图片任务未完成，请稍后重试。";
}
function drainImageTaskQueue() {
  while (activeImageTasks.size < MAX_ACTIVE_IMAGE_TASKS && imageTaskQueue.length) {
    const task = imageTaskQueue.shift();
    if (!task || task.state === "canceled") continue;
    task.state = "running";
    task.startedAt = new Date().toISOString();
    task.message = "图片任务正在生成";
    void runImageTask(task);
  }
  updateQueuedImageTaskPositions();
}
function publicImageTaskState(task) {
  if (!task) return void 0;
  return {
    id: task.id,
    state: task.state,
    queuedAt: task.queuedAt,
    startedAt: task.startedAt,
    completedAt: task.completedAt,
    message: task.message || "",
    position: queuePosition(task),
  };
}
function emitImageTaskState(task) {
  const payload = publicImageTaskState(task);
  if (!payload || !task.sender || task.sender.isDestroyed?.()) return;
  task.sender.send("runtime:imageTaskState", payload);
}
function parseSupportedRatio(value) {
  const match = String(value || "").match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? { label: match[0], value: width / height } : null;
}
function resolveAutomaticImageRatio(request) {
  const supported = [...new Set(Array.isArray(request?.supportedAspectRatios)
    ? request.supportedAspectRatios.map((item) => String(item || "").trim()).filter(Boolean)
    : [])];
  const parsed = supported.map(parseSupportedRatio).filter(Boolean);
  const sources = [request?.maskImage, ...(Array.isArray(request?.referenceImages) ? request.referenceImages : [])];
  const dimensions = sources.find((item) => Number(item?.width) > 0 && Number(item?.height) > 0);
  if (!parsed.length) return "1:1";
  if (!dimensions) return parsed[0].label;
  const target = Number(dimensions.width) / Number(dimensions.height);
  return parsed.reduce((best, candidate) =>
    Math.abs(Math.log(candidate.value / target)) < Math.abs(Math.log(best.value / target)) ? candidate : best,
  parsed[0]).label;
}
function normalizeImageRequest(request) {
  const next = { ...(request || {}) };
  if (String(next.aspectRatio || "").toLowerCase() === "auto" || /\bauto\b/i.test(String(next.size || ""))) {
    const aspectRatio = resolveAutomaticImageRatio(next);
    next.aspectRatio = aspectRatio;
    next.size = String(next.size || "").replace(/\bauto\b/gi, aspectRatio).trim() || aspectRatio;
  }
  delete next.supportedAspectRatios;
  return next;
}
function channelDriverIdForRequest(request) {
  return channelDriverRuntime?.resolveIdFromRequest(request || {}) || "";
}
function channelRequestSecrets(request) {
  const apiKey = cleanText(request?.apiKey, "", 16000);
  const fallbackApiKey = cleanText(request?.fallbackApiKey, "", 16000);
  return {
    ...(apiKey && apiKey !== jiaren_channel_driver_runtime_1.SESSION_SECRET_PLACEHOLDER ? { apiKey } : {}),
    ...(fallbackApiKey && fallbackApiKey !== jiaren_channel_driver_runtime_1.SESSION_SECRET_PLACEHOLDER ? { fallbackApiKey } : {}),
  };
}
function channelRequestInput(request) {
  const { apiKey: _apiKey, fallbackApiKey: _fallbackApiKey, ...input } = request || {};
  return input;
}
function channelResultValue(result) {
  return result?.data === undefined || result?.data === null ? result?.raw : result.data;
}
function channelTextValue(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(channelTextValue).filter(Boolean).join("\n");
  if (!isRecord(value)) return value === undefined || value === null ? "" : String(value);
  const choice = Array.isArray(value.choices) ? value.choices[0] : null;
  const direct = readString(value.content) || readString(value.text) || readString(value.output_text) || readString(value.message)
    || (isRecord(choice) && isRecord(choice.message) ? readString(choice.message.content) : void 0)
    || (isRecord(value.data) ? channelTextValue(value.data) : "");
  return direct || JSON.stringify(value, null, 2);
}
function channelImagePayload(value) {
  if (typeof value !== "string") return value;
  if (value.startsWith("data:image/")) return { data: [{ b64_json: value }] };
  return { data: [{ url: value }] };
}
function channelMediaSources(value, kind) {
  const output = [];
  const seen = new Set();
  const keyPattern = kind === "video" ? /video|output|result|asset|file|download|url|media/i : /audio|music|speech|voice|output|result|asset|file|download|url|media/i;
  const extensionPattern = kind === "video" ? /\.(mp4|mov|webm|m4v|avi|mkv)(?:[?#]|$)/i : /\.(mp3|wav|m4a|aac|flac|ogg|opus)(?:[?#]|$)/i;
  const add = (source) => {
    const text = cleanText(source, "", 12000000);
    if (!text || seen.has(text)) return;
    seen.add(text);
    output.push(text);
  };
  const visit = (item, key = "", topLevel = false) => {
    if (typeof item === "string") {
      if (topLevel || item.startsWith(`data:${kind}/`) || extensionPattern.test(item) || keyPattern.test(key)) add(item);
      return;
    }
    if (Array.isArray(item)) {
      item.forEach((child) => visit(child, key, false));
      return;
    }
    if (isRecord(item)) {
      for (const [childKey, child] of Object.entries(item)) visit(child, childKey, false);
    }
  };
  visit(value, "", true);
  return output;
}
function channelMediaExtension(kind, source, mime = "") {
  const match = String(source || "").match(/\.(mp4|mov|webm|m4v|avi|mkv|mp3|wav|m4a|aac|flac|ogg|opus)(?:[?#]|$)/i);
  if (match) return `.${match[1].toLowerCase()}`;
  if (/webm/i.test(mime)) return ".webm";
  if (/quicktime|mov/i.test(mime)) return ".mov";
  if (/wav/i.test(mime)) return ".wav";
  if (/mpeg|mp3/i.test(mime)) return ".mp3";
  return kind === "video" ? ".mp4" : ".mp3";
}
async function channelMediaAsset(source, kind, request, index) {
  if (/^[a-zA-Z]:[\\/]|^\\\\/.test(source) && (0, node_fs_1.existsSync)(source)) {
    return { id: node_crypto_1.default.randomUUID(), type: kind, localPath: source, mimeType: guessMime(source) };
  }
  if (source.startsWith(`data:${kind}/`)) {
    const parsed = parseDataUrl(source);
    const extension = channelMediaExtension(kind, "", parsed.mime);
    const localPath = writeBufferToCache(parsed.bytes, `jiaren_channel_${kind}_${Date.now()}_${index + 1}${extension}`, request.cacheDir);
    return { id: node_crypto_1.default.randomUUID(), type: kind, localPath, mimeType: parsed.mime };
  }
  if (/^https?:\/\//i.test(source)) {
    try {
      const extension = channelMediaExtension(kind, source);
      const localPath = await downloadFileToCache(source, `jiaren_channel_${kind}_${Date.now()}_${index + 1}${extension}`, request.cacheDir);
      return { id: node_crypto_1.default.randomUUID(), type: kind, localPath, url: source, mimeType: guessMime(localPath) };
    } catch {
      return { id: node_crypto_1.default.randomUUID(), type: kind, url: source };
    }
  }
  return null;
}
async function generateChannelImage(request, signal) {
  const startedAt = performance.now();
  const result = await channelDriverRuntime.invokeForRequest(
    request,
    "image",
    channelRequestInput(request),
    channelRequestSecrets(request),
    { signal },
  );
  const count = Math.max(1, Math.min(12, Number(request.count) || 1));
  const assets = await assetsFromImagePayload(channelImagePayload(channelResultValue(result)), count, request.cacheDir);
  return {
    id: node_crypto_1.default.randomUUID(),
    modelId: request.modelId,
    status: assets.length ? "succeeded" : "failed",
    elapsedMs: Math.round(performance.now() - startedAt),
    assets,
    message: assets.length ? "自定义渠道图片生成完成。" : "自定义渠道已返回结果，但没有识别到图片。请检查结果路径。",
    channelId: result.channelId,
  };
}
async function generateChannelMedia(request, kind, signal) {
  const startedAt = performance.now();
  const result = await channelDriverRuntime.invokeForRequest(
    request,
    kind,
    channelRequestInput(request),
    channelRequestSecrets(request),
    { signal },
  );
  const sources = channelMediaSources(channelResultValue(result), kind).slice(0, 12);
  const assets = (await Promise.all(sources.map((source, index) => channelMediaAsset(source, kind, request, index)))).filter(Boolean);
  return {
    id: node_crypto_1.default.randomUUID(),
    modelId: request.modelId,
    status: assets.length ? "succeeded" : "failed",
    elapsedMs: Math.round(performance.now() - startedAt),
    assets,
    message: assets.length ? `自定义渠道${kind === "video" ? "视频" : "音频"}生成完成。` : `自定义渠道已返回结果，但没有识别到${kind === "video" ? "视频" : "音频"}。请检查结果路径。`,
    channelId: result.channelId,
    taskProvider: `jiaren-channel:${result.channelId}`,
  };
}
async function generateChannelChat(request) {
  const startedAt = performance.now();
  const result = await channelDriverRuntime.invokeForRequest(
    request,
    "text",
    channelRequestInput(request),
    channelRequestSecrets(request),
  );
  return {
    id: node_crypto_1.default.randomUUID(),
    ok: true,
    content: channelTextValue(channelResultValue(result)),
    elapsedMs: Math.round(performance.now() - startedAt),
    message: "自定义渠道对话完成。",
    providerSource: `jiaren-channel:${result.channelId}`,
  };
}
function trimImageTaskHistory() {
  if (imageTaskStates.size <= 200) return;
  for (const [id, task] of imageTaskStates) {
    if (!activeImageTasks.has(id) && task.state !== "running" && task.state !== "queued") imageTaskStates.delete(id);
    if (imageTaskStates.size <= 160) break;
  }
}
async function runImageTask(task) {
  activeImageTasks.set(task.id, task);
  emitImageTaskState(task);
  try {
    const result = await generateImageV2(normalizeImageRequest(task.request), task.controller.signal);
    const assets = Array.isArray(result?.assets) ? result.assets.filter(Boolean) : [];
    const hasFinalImage = result?.status === "succeeded" && assets.length > 0;
    const canceled = task.controller.signal.aborted;
    task.state = canceled ? "canceled" : hasFinalImage ? "succeeded" : "failed";
    task.message = canceled
      ? "图片任务已取消"
      : hasFinalImage
        ? String(result?.message || "图片任务已完成")
        : safeImageTaskError(result?.message || (result?.status === "queued" ? "图片接口只确认排队，尚未返回最终图片。" : "图片接口未返回最终图片。"));
    task.resolve(canceled
      ? { ...result, id: result?.id || task.id, status: "canceled", assets: [], message: task.message }
      : hasFinalImage
        ? result
        : { ...result, id: result?.id || task.id, status: "failed", assets: [], message: task.message });
  } catch (error) {
    const canceled = task.controller.signal.aborted;
    task.state = canceled ? "canceled" : "failed";
    task.message = canceled ? "图片任务已取消" : safeImageTaskError(error);
    task.resolve({
      id: task.id,
      modelId: task.request?.modelId,
      status: canceled ? "canceled" : "failed",
      elapsedMs: task.startedAt ? Math.max(0, Date.now() - Date.parse(task.startedAt)) : 0,
      assets: [],
      message: task.message,
    });
  } finally {
    task.completedAt = new Date().toISOString();
    emitImageTaskState(task);
    activeImageTasks.delete(task.id);
    trimImageTaskHistory();
    drainImageTaskQueue();
  }
}
function enqueueImageGeneration(sender, request) {
  const id = cleanText(request?.clientTaskId, "", 160) || node_crypto_1.default.randomUUID();
  return new Promise((resolve) => {
    const task = {
      id,
      sender,
      request: { ...(request || {}), clientTaskId: id },
      controller: new AbortController(),
      resolve,
      state: "queued",
      queuedAt: new Date().toISOString(),
      startedAt: "",
      message: "图片任务排队中",
    };
    imageTaskStates.set(id, task);
    imageTaskQueue.push(task);
    emitImageTaskState(task);
    drainImageTaskQueue();
  });
}
function cancelImageTask(taskId) {
  const task = imageTaskStates.get(String(taskId || ""));
  if (!task) return { ok: false, message: "图片任务不存在" };
  if (task.state === "queued") {
    const index = imageTaskQueue.indexOf(task);
    if (index >= 0) imageTaskQueue.splice(index, 1);
    task.state = "canceled";
    task.completedAt = new Date().toISOString();
    task.message = "图片任务已取消";
    task.resolve({ id: task.id, modelId: task.request?.modelId, status: "canceled", assets: [], message: task.message });
    emitImageTaskState(task);
    updateQueuedImageTaskPositions();
    trimImageTaskHistory();
    return { ok: true, task: publicImageTaskState(task) };
  }
  if (task.state === "running") task.controller.abort();
  return { ok: task.state === "running", task: publicImageTaskState(task) };
}
electron_1.app.whenReady().then(async () => {
  ensureLocalRoots();
  ensureValidPreferencesFile();
  agentControlRuntime = (0, jiaren_agent_control_runtime_1.createJiarenAgentControlRuntime)({
    dataRoot,
    log: appendStartupLog,
    broadcast: (channel, payload) => {
      electron_1.BrowserWindow.getAllWindows().forEach((window) => {
        if (!window.isDestroyed()) window.webContents.send(channel, payload);
      });
    }
  });
  await agentControlRuntime.start();
  codexAppServerRuntime = (0, jiaren_codex_app_server_runtime_1.createJiarenCodexAppServerRuntime)({
    workspaceRoot: projectRoot,
    log: appendStartupLog,
    readCanvas: () => agentControlRuntime.getSnapshot(),
    submitCanvasPlan: (plan) => agentControlRuntime.submitPlan(plan, "Codex App Server"),
    importGeneratedImage: importCodexGeneratedImage,
    broadcast: (channel, payload) => {
      electron_1.BrowserWindow.getAllWindows().forEach((window) => {
        if (!window.isDestroyed()) window.webContents.send(channel, payload);
      });
    }
  });
  channelDriverRuntime = (0, jiaren_channel_driver_runtime_1.createJiarenChannelDriverRuntime)({
    dataRoot,
    log: appendStartupLog
  });
  skillFactoryRuntime = (0, skill_factory_runtime_1.createSkillFactoryRuntime)({
    dataRoot,
    scriptRoot: bundledRuntimePath("python", "jiaren_skill_factory"),
    ffmpegPath: resolveBundledFfmpegPath(),
    onComplete: importCompletedSkill
  });
  process.env.JIAREN_PREFERENCES_PATH = preferencesPath;
  if (!isDev) {
    jiarenLocalAuthToken = node_crypto_1.default.randomBytes(32).toString("hex");
    try {
      jiarenLocalServicePort = await (0, jiaren_local_server_1.startJiarenLocalService)({
        appRoot,
        dataRoot,
        resourcesPath: bundledResourceRoot,
        authToken: jiarenLocalAuthToken,
        log: appendStartupLog
      });
    } catch (error) {
      appendStartupLog(`jiaren-local-service-error ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      jiarenLocalServicePort = 0;
    }
  }
  electron_1.ipcMain.handle("runtime:testConnection", async (_event, request) => withCleanUiMessage(await testConnection(request)));
  electron_1.ipcMain.handle("runtime:listProviderModels", async (_event, request) => withCleanUiMessage(await listProviderModels(request)));
  electron_1.ipcMain.handle("runtime:generateImage", async (event, request) => withCleanUiMessage(await enqueueImageGeneration(event.sender, request)));
  electron_1.ipcMain.handle("runtime:getImageTaskState", (_event, taskId) => publicImageTaskState(imageTaskStates.get(String(taskId || ""))));
  electron_1.ipcMain.handle("runtime:cancelImageTask", (_event, taskId) => cancelImageTask(taskId));
  electron_1.ipcMain.handle("runtime:generateVideo", async (_event, request) => withCleanUiMessage(await (channelDriverIdForRequest(request) ? generateChannelMedia(request, "video") : jiaren_video_runtime_1.generateVideo(request))));
  electron_1.ipcMain.handle("runtime:submitVideoTask", async (_event, request) => withCleanUiMessage(await (channelDriverIdForRequest(request) ? generateChannelMedia(request, "video") : jiaren_video_runtime_1.submitVideoTask(request))));
  electron_1.ipcMain.handle("runtime:queryVideoTask", async (_event, request) => withCleanUiMessage(await jiaren_video_runtime_1.queryVideoTask(request)));
  electron_1.ipcMain.handle("runtime:submitAudioTask", async (_event, request) => withCleanUiMessage(await (channelDriverIdForRequest(request) ? generateChannelMedia(request, "audio") : jiaren_audio_runtime_1.submitAudioTask(request))));
  electron_1.ipcMain.handle("runtime:queryAudioTask", async (_event, request) => withCleanUiMessage(await jiaren_audio_runtime_1.queryAudioTask(request)));
  electron_1.ipcMain.handle("runtime:uploadAudioTask", async (_event, request) => withCleanUiMessage(await jiaren_audio_runtime_1.uploadAudioTask(request)));
  electron_1.ipcMain.handle("runtime:removeBackground", async (_event, request) => withCleanUiMessage(await removeBackground(request)));
  electron_1.ipcMain.handle("runtime:getUpscaylStatus", (_event, engineRoot) => withCleanUiMessage(getUpscaylStatus(engineRoot)));
  electron_1.ipcMain.handle("runtime:upscaleImage", async (_event, request) => withCleanUiMessage(await upscaleImage(request)));
  electron_1.ipcMain.handle("runtime:reverseAnalyze", (_event, request) => reverseAnalyze(request));
  electron_1.ipcMain.handle("runtime:chat", (_event, request) => chat(request));
  electron_1.ipcMain.handle("runtime:startChatStream", (event, request) => startChatStream(event, request));
  electron_1.ipcMain.handle("runtime:getComfyRongtuStatus", (_event, request) => getComfyRongtuStatus(request));
  electron_1.ipcMain.handle("runtime:generateComfyRongtu", (_event, request) => generateComfyRongtu(request));
  electron_1.ipcMain.handle("runtime:getComfyInstances", () => ({ instances: readComfyInstances() }));
  electron_1.ipcMain.handle("runtime:saveComfyInstances", (_event, instances) => saveComfyInstances(instances));
  electron_1.ipcMain.handle("runtime:listComfyWorkflows", () => listComfyWorkflows());
  electron_1.ipcMain.handle("runtime:getComfyWorkflow", (_event, name) => getComfyWorkflow(name));
  electron_1.ipcMain.handle("runtime:uploadComfyWorkflow", (_event, request) => uploadComfyWorkflow(request));
  electron_1.ipcMain.handle("runtime:saveComfyWorkflowConfig", (_event, name, config) => saveComfyWorkflowConfig(name, config));
  electron_1.ipcMain.handle("runtime:deleteComfyWorkflow", (_event, name) => deleteComfyWorkflow(name));
  electron_1.ipcMain.handle("runtime:runComfyWorkflow", (_event, request) => runComfyWorkflow(request));
  electron_1.ipcMain.handle("skillFactory:status", () => skillFactoryRuntime.status());
  electron_1.ipcMain.handle("skillFactory:configure", (_event, request) => skillFactoryRuntime.configure(request));
  electron_1.ipcMain.handle("skillFactory:start", (_event, request) => skillFactoryRuntime.start(request));
  electron_1.ipcMain.handle("skillFactory:getJob", (_event, id) => skillFactoryRuntime.getJob(id));
  electron_1.ipcMain.handle("skillFactory:listJobs", () => skillFactoryRuntime.listJobs());
  electron_1.ipcMain.handle("skillFactory:cancel", (_event, id) => skillFactoryRuntime.cancel(id));
  electron_1.ipcMain.handle("skillFactory:selectFiles", (_event, request) => selectSkillFactoryFiles(request));
  electron_1.ipcMain.handle("skillFactory:selectDirectory", async () => {
    const result = await electron_1.dialog.showOpenDialog({ properties: ["openDirectory", "createDirectory"] });
    return { canceled: result.canceled, path: result.filePaths[0] };
  });
  electron_1.ipcMain.handle("industrial3d:selectFiles", () => selectIndustrial3DFiles());
  electron_1.ipcMain.handle("industrial3d:convertStep", (_event, filePath) => convertIndustrialStepModel(filePath));
  electron_1.ipcMain.handle("system:selectFiles", (_event, request) => selectFiles(request));
  electron_1.ipcMain.handle("system:selectChatAttachments", (_event, request) => selectChatAttachments(request));
  electron_1.ipcMain.handle("agentControl:status", () => agentControlRuntime.status());
  electron_1.ipcMain.handle("agentControl:ensureSession", () => agentControlRuntime.ensureSession());
  electron_1.ipcMain.handle("agentControl:createSession", (_event, title) => agentControlRuntime.createSession(title));
  electron_1.ipcMain.handle("agentControl:listSessions", () => agentControlRuntime.listSessions());
  electron_1.ipcMain.handle("agentControl:getSession", (_event, sessionId) => agentControlRuntime.getSession(sessionId));
  electron_1.ipcMain.handle("agentControl:appendMessage", (_event, sessionId, message) => agentControlRuntime.appendMessage(sessionId, message));
  electron_1.ipcMain.handle("agentControl:saveSuggestions", (_event, sessionId, suggestions) => agentControlRuntime.saveSuggestions(sessionId, suggestions));
  electron_1.ipcMain.handle("agentControl:updateSnapshot", (_event, snapshot) => agentControlRuntime.updateSnapshot(snapshot));
  electron_1.ipcMain.handle("agentControl:submitPlan", (_event, plan) => agentControlRuntime.submitPlan(plan));
  electron_1.ipcMain.handle("agentControl:listPlans", (_event, status) => agentControlRuntime.listPlans(status));
  electron_1.ipcMain.handle("agentControl:getPlan", (_event, planId) => agentControlRuntime.getPlan(planId));
  electron_1.ipcMain.handle("agentControl:approvePlan", (_event, planId) => agentControlRuntime.setPlanStatus(planId, "approved"));
  electron_1.ipcMain.handle("agentControl:rejectPlan", (_event, planId, note) => agentControlRuntime.setPlanStatus(planId, "rejected", note));
  electron_1.ipcMain.handle("agentControl:completePlan", (_event, planId, result) => agentControlRuntime.completePlan(planId, result));
  electron_1.ipcMain.handle("agentControl:listReceipts", () => agentControlRuntime.listReceipts());
  electron_1.ipcMain.handle("agentControl:startPairing", (_event, label) => agentControlRuntime.startPairing(label));
  electron_1.ipcMain.handle("codexAppServer:status", () => codexAppServerRuntime.status());
  electron_1.ipcMain.handle("codexAppServer:start", (_event, request) => codexAppServerRuntime.start(request));
  electron_1.ipcMain.handle("codexAppServer:stop", () => codexAppServerRuntime.stop().then(() => codexAppServerRuntime.status()));
  electron_1.ipcMain.handle("codexAppServer:readAccount", (_event, refreshToken) => codexAppServerRuntime.readAccount(refreshToken));
  electron_1.ipcMain.handle("codexAppServer:installCanvasMcp", () => codexAppServerRuntime.installCanvasMcp());
  electron_1.ipcMain.handle("codexAppServer:login", (_event, type, credential) => codexAppServerRuntime.login(type, credential));
  electron_1.ipcMain.handle("codexAppServer:cancelLogin", (_event, loginId) => codexAppServerRuntime.cancelLogin(loginId));
  electron_1.ipcMain.handle("codexAppServer:logout", () => codexAppServerRuntime.logout());
  electron_1.ipcMain.handle("codexAppServer:listModels", () => codexAppServerRuntime.listModels());
  electron_1.ipcMain.handle("codexAppServer:listThreads", (_event, request) => codexAppServerRuntime.listThreads(request));
  electron_1.ipcMain.handle("codexAppServer:readThread", (_event, threadId, includeTurns) => codexAppServerRuntime.readThread(threadId, includeTurns));
  electron_1.ipcMain.handle("codexAppServer:startThread", (_event, request) => codexAppServerRuntime.startThread(request));
  electron_1.ipcMain.handle("codexAppServer:resumeThread", (_event, threadId) => codexAppServerRuntime.resumeThread(threadId));
  electron_1.ipcMain.handle("codexAppServer:startTurn", (_event, request) => codexAppServerRuntime.startTurn(request));
  electron_1.ipcMain.handle("codexAppServer:interrupt", (_event, threadId, turnId) => codexAppServerRuntime.interrupt(threadId, turnId));
  electron_1.ipcMain.handle("codexAppServer:resolveApproval", (_event, requestId, action, options) => codexAppServerRuntime.resolveApproval(requestId, action, options));
  electron_1.ipcMain.handle("codexAppServer:selectWorkspace", async () => {
    const result = await electron_1.dialog.showOpenDialog({ properties: ["openDirectory", "createDirectory"] });
    if (result.canceled || !result.filePaths[0]) return { canceled: true, status: codexAppServerRuntime.status() };
    return { canceled: false, status: codexAppServerRuntime.setWorkspaceRoot(result.filePaths[0]) };
  });
  electron_1.ipcMain.handle("channelDriver:list", () => channelDriverRuntime.list());
  electron_1.ipcMain.handle("channelDriver:catalog", () => channelDriverRuntime.modelCatalog());
  electron_1.ipcMain.handle("channelDriver:save", (_event, definition) => channelDriverRuntime.save(definition));
  electron_1.ipcMain.handle("channelDriver:remove", (_event, id) => channelDriverRuntime.remove(id));
  electron_1.ipcMain.handle("channelDriver:setSessionSecrets", (_event, id, secrets) => channelDriverRuntime.setSessionSecrets(id, secrets));
  electron_1.ipcMain.handle("channelDriver:invoke", (_event, id, input, secrets) => channelDriverRuntime.invoke(id, input, secrets));
  electron_1.ipcMain.handle("system:selectDirectory", async () => {
    const result = await electron_1.dialog.showOpenDialog({ properties: ["openDirectory", "createDirectory"] });
    return { canceled: result.canceled, path: result.filePaths[0] };
  });
  electron_1.ipcMain.handle("system:openPath", async (_event, targetPath) => {
    if (!targetPath.trim()) {
      return { ok: false, message: "·��Ϊ�ա�" };
    }
    const message = await electron_1.shell.openPath(targetPath);
    return { ok: message.length === 0, message: message || "�Ѵ򿪡�" };
  });
  electron_1.ipcMain.handle("system:openExternal", (_event, url) => openExternalUrl(url));
  electron_1.ipcMain.handle("system:getAppVersion", () => ({ version: electron_1.app.getVersion() }));
  electron_1.ipcMain.handle("system:downloadUpdate", (event, request) => downloadUpdate(request, event.sender));
  electron_1.ipcMain.handle("system:saveAsset", (_event, request) => saveAsset(request));
  electron_1.ipcMain.handle("system:readTextFile", (_event, request) => readTextFile(request));
  electron_1.ipcMain.handle("system:readMediaDataUrl", (_event, request) => readMediaDataUrl(request));
  electron_1.ipcMain.handle("system:readCommunityAsset", (_event, request) => readCommunityAsset(request));
  electron_1.ipcMain.handle("system:exportLayeredPsd", (_event, request) => exportLayeredPsd(request));
  electron_1.ipcMain.handle("system:openGenPsd", (_event, request) => openGenPsd(request));
  electron_1.ipcMain.handle("system:generateHunyuan3D", (_event, request) => generateHunyuan3D(request));
  electron_1.ipcMain.handle("system:saveProject", (_event, payload) => enqueueProjectOperation(() => saveProject(payload)));
  electron_1.ipcMain.handle("system:loadProject", () => enqueueProjectOperation(() => loadProject()));
  electron_1.ipcMain.handle("system:startNewProject", () => enqueueProjectOperation(() => startNewProject()));
  electron_1.ipcMain.handle("system:listSavedProjects", () => enqueueProjectOperation(() => listSavedProjects()));
  electron_1.ipcMain.handle("system:loadSavedProject", (_event, projectId) => enqueueProjectOperation(() => loadSavedProject(projectId)));
  electron_1.ipcMain.handle("system:deleteSavedProject", (_event, projectId) => enqueueProjectOperation(() => deleteSavedProject(projectId)));
  electron_1.ipcMain.handle("system:getStats", () => getStats());
  electron_1.ipcMain.handle("system:getDefaultPaths", () => getLocalPaths());
  electron_1.ipcMain.handle("system:listResources", (_event, request) => listResources(request));
  electron_1.ipcMain.handle("system:addResource", (_event, request) => addResourceToLibrary(request));
  electron_1.ipcMain.handle("system:updateResource", (_event, id, patch) => updateResourceInLibrary(id, patch));
  electron_1.ipcMain.handle("system:deleteResource", (_event, id) => deleteResourceFromLibrary(id));
  electron_1.ipcMain.handle("system:loadPreferences", () => normalizePersistedPreferences(readPreferences()));
  electron_1.ipcMain.handle("system:savePreferences", (_event, preferences) => savePreferences(preferences));
  electron_1.ipcMain.handle("system:queryApiBalance", async (_event, request) => withCleanUiMessage(await queryApiBalance(request)));
  electron_1.ipcMain.handle("system:windowCommand", (_event, command) => handleWindowCommand(command));
  electron_1.ipcMain.handle("system:getZoom", () => getZoomState());
  electron_1.ipcMain.handle("system:setZoom", (_event, zoomPercent) => setZoomState(zoomPercent));
  electron_1.ipcMain.handle("system:getMachineCode", () => ({ machineCode: getMachineCode() }));
  electron_1.ipcMain.handle("system:loadLicense", () => readLicense());
  electron_1.ipcMain.handle("system:activateLicense", (_event, request) => activateLicense(request));
  electron_1.ipcMain.handle("system:verifyLicense", () => verifyLicense());
  electron_1.ipcMain.handle("system:consumeLicenseQuota", (_event, request) => consumeLicenseQuota(request));
  createWindow();
  electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron_1.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron_1.app.quit();
  }
});
electron_1.app.on("before-quit", () => {
  void agentControlRuntime?.stop();
  void codexAppServerRuntime?.stop();
});

/* Jiaren MIME-preserving asset downloads v112 */
/* Jiaren v1.1.2 local application protection */
