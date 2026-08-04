import { o as xa, S as w, F as s } from "./vendor-C8NPC5kM.js";
import {
  d as $e,
  Y as Xt,
  I as ba,
  a as wa,
  t as Ia,
} from "./vendor-excalidraw-2d6X1Q1Z.js";
import { d as ka } from "./vendor-flow-BUHgv_lX.js";
import {
  a6 as hi,
  aF as vi,
  aG as Ma,
  a5 as ja,
  $ as ae,
  aQ as Qt,
  n as Ye,
  aw as Aa,
  t as $a,
  aU as Ca,
  aJ as Zt,
  e as Sa,
  ap as Pa,
  aS as ei,
  aD as ft,
  d as Ua,
  aN as yi,
  Y as xi,
  ae as Na,
  I as bi,
  aP as Ka,
  V as xt,
  an as Ra,
  C as Ba,
  c as bt,
  a8 as ti,
  aK as qa,
  ak as za,
  k as Ta,
  Q as _a,
} from "./vendor-icons-Bb7FNkxe.js";
function Xe(e, a) {
  return {
    id: crypto.randomUUID(),
    modelId: e,
    status: "failed",
    elapsedMs: 0,
    assets: [],
    message: a,
  };
}
class Ea {
  async testConnection(a) {
    return window.jiaren
      ? window.jiaren.runtime.testConnection(a)
      : { ok: !1, message: "Electron bridge 未初始化。" };
  }
  async listProviderModels(a) {
    return window.jiaren
      ? window.jiaren.runtime.listProviderModels(a)
      : { ok: !1, message: "Electron bridge 未初始化。", models: [] };
  }
  async generateImage(a) {
    return window.jiaren
      ? window.jiaren.runtime.generateImage(a)
      : Xe(
          a.modelId,
          "Electron bridge 未初始化。请在 Electron 桌面程序中测试真实 API。",
        );
  }
  async generateVideo(a) {
    return window.jiaren
      ? window.jiaren.runtime.generateVideo(a)
      : Xe(
          a.modelId,
          "Electron bridge 未初始化。请在 Electron 桌面程序中测试视频 API。",
        );
  }
  async removeBackground(a) {
    return window.jiaren
      ? window.jiaren.runtime.removeBackground(a)
      : Xe(
          a.modelKey,
          "Electron bridge 未初始化。请在 Electron 桌面程序中测试抠图 API。",
        );
  }
  async getUpscaylStatus(a) {
    return window.jiaren
      ? window.jiaren.runtime.getUpscaylStatus(a)
      : { ok: !1, models: [], message: "Electron bridge 未初始化。" };
  }
  async upscaleImage(a) {
    return window.jiaren
      ? window.jiaren.runtime.upscaleImage(a)
      : Xe("local-upscayl", "Electron bridge 未初始化，无法调用本地无损高清。");
  }
  async reverseAnalyze(a) {
    return window.jiaren
      ? window.jiaren.runtime.reverseAnalyze(a)
      : {
          id: crypto.randomUUID(),
          ok: !1,
          elapsedMs: 0,
          message: "Electron bridge 未初始化，请在桌面程序中使用逆向提示分析。",
        };
  }
  async chat(a) {
    return window.jiaren
      ? window.jiaren.runtime.chat(a)
      : {
          id: crypto.randomUUID(),
          ok: !1,
          elapsedMs: 0,
          message:
            "Electron bridge 未初始化。请在 Electron 桌面程序中测试对话模型。",
        };
  }
}
const pe = new Ea(),
  ii = "",
  wi = "a2",
  kt = [
    "1:1",
    "2:3",
    "3:2",
    "3:4",
    "4:3",
    "4:5",
    "5:4",
    "9:16",
    "16:9",
    "21:9",
  ],
  Ii = [
    "1:1",
    "3:2",
    "2:3",
    "4:3",
    "3:4",
    "5:4",
    "4:5",
    "16:9",
    "9:16",
    "2:1",
    "1:2",
    "21:9",
    "9:21",
  ],
  ki = [
    "1:1",
    "1:4",
    "4:1",
    "1:8",
    "8:1",
    "2:3",
    "3:2",
    "3:4",
    "4:3",
    "4:5",
    "5:4",
    "9:16",
    "16:9",
    "21:9",
  ],
  Mi = ["9:16", "16:9", "1:1", "4:3", "3:4", "21:9"],
  me = {
    supportsAsync: !0,
    supportsReferenceImages: !0,
    sizeMode: "preset-grid",
    resolutions: ["1K", "2K", "4K"],
    aspectRatios: kt,
    qualities: ["Auto"],
    maxBatch: 4,
  },
  Z = {
    supportsAsync: !0,
    supportsReferenceImages: !0,
    sizeMode: "preset-grid",
    resolutions: ["720p", "1080p"],
    aspectRatios: Mi,
    qualities: ["Auto"],
    maxBatch: 1,
  };
function ji(e) {
  const a = e.category ?? At(e.endpointModelId || e.modelId || e.id),
    i = e.endpointModelId || e.modelId || e.id,
    o = Se(i),
    d = e.provider || Pi(i),
    r = nt(i),
    c = e.fallbackEndpointModelId || void 0;
  return {
    ...e,
    category: a,
    alias: o,
    modelId: i,
    endpointModelId: i,
    fallbackEndpointModelId: c,
    apiGroup: e.apiGroup ?? wi,
    providerSource: e.providerSource || e.apiGroup || d || "user-configured",
    provider: d,
    icon: $t(d, i),
    supportsAsync: e.supportsAsync ?? r.supportsAsync,
    supportsReferenceImages:
      e.supportsReferenceImages ?? r.supportsReferenceImages,
    sizeMode: e.sizeMode ?? r.sizeMode,
    resolutions: e.resolutions ?? r.resolutions,
    aspectRatios: e.aspectRatios ?? r.aspectRatios,
    qualities: e.qualities ?? r.qualities,
    maxBatch: e.maxBatch ?? r.maxBatch,
  };
}
function Mt(e) {
  return e;
}
const Ai = [
  {
    id: "jiaren-local-rmbg",
    alias: "Jiaren AI 本地抠图",
    modelId: "background-removal",
    category: "tools",
    provider: "jiaren",
    icon: "jiaren",
    requestMode: "unknown",
  },
];
function wt(e) {
  return (
    e
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "provider"
  );
}
function $i(e) {
  try {
    const a = new URL(e.trim());
    return wt(a.hostname);
  } catch {
    return wt(e);
  }
}
function La(e) {
  return (
    e &&
    (/^(gpt|api|tts|vl|hd|sd|ai|mj)$/i.test(e) || /^\d+k$/i.test(e)
      ? e.toUpperCase()
      : e.slice(0, 1).toUpperCase() + e.slice(1))
  );
}
function Ci(e) {
  return /^gpt[-_.\s].*nano/i.test(e.trim());
}
function jt(e) {
  const a = e.trim().toLowerCase();
  return (
    /nano[-_.\s]?banana/.test(a) ||
    /^gemini[-_.]3[-_.]pro[-_.]image[-_.]preview(?:[-_.](?:1k|2k|4k))?(?:[-_.]official)?$/.test(
      a,
    ) ||
    /^gemini[-_.]3(?:[-_.]1|\.)flash[-_.]image[-_.]preview(?:[-_.](?:512px|1k|2k|4k))?(?:[-_.]official)?$/.test(
      a,
    ) ||
    /^gemini[-_.]2(?:[-_.]5|\.)flash[-_.]image(?:[-_.]preview)?(?:[-_.]official)?$/.test(
      a,
    )
  );
}
function Ga(e) {
  var o;
  const i =
    (o = e
      .trim()
      .toLowerCase()
      .match(
        /^(gpt[-_.]\d+(?:[-_.]\d+)?(?:[-_.](?:nano|mini|pro|codex|audio|realtime))?)/,
      )) == null
      ? void 0
      : o[1];
  if (i) return i.replace(/[_.]+/g, "-");
}
function Oa(e) {
  const a = e.trim();
  return Ci(a)
    ? !1
    : /gpt-image|gpt-4o-image|dall[-_\s]?e|gemini.*image|seedream|recraft|ideogram|flux|kontext|qwen-image|grok.*image|image-edit|omni-image|midjourney|mj\b|jimeng|即梦/i.test(
        a,
      ) || jt(a);
}
function ke(e) {
  const a = e.trim();
  return /^gemini[-_.]3[-_.]pro[-_.]image[-_.]preview(?:[-_.](?:1k|2k|4k))?(?:[-_.]official)?$/i.test(
    a,
  )
    ? "gemini-3-pro-image-preview"
    : /^gemini[-_.]3(?:[-_.]1|\.)flash[-_.]image[-_.]preview(?:[-_.](?:512px|1k|2k|4k))?(?:[-_.]official)?$/i.test(
          a,
        )
      ? "gemini-3.1-flash-image-preview"
      : /^nano[-_.\s]?banana[-_.\s]?(?:pro|2[-_.\s]?pro)$/i.test(a)
        ? "gemini-3-pro-image-preview"
        : /^nano[-_.\s]?banana[-_.\s]?2$/i.test(a)
          ? "gemini-3.1-flash-image-preview"
          : /^nano[-_.\s]?banana$/i.test(a)
            ? "gemini-2.5-flash-image-preview"
            : a;
}
function ai(e, a) {
  const i = ke(e).toLowerCase();
  if (a === "image") {
    if (/^gemini-3-pro-image-preview$/.test(i)) return "image:nano-banana-pro";
    if (/^gemini-3\.1-flash-image-preview$/.test(i))
      return "image:nano-banana-2";
    if (/^gemini-2\.5-flash-image-preview|^nano-banana$/.test(i))
      return "image:nano-banana";
    if (/^gpt-image-2-pro$/i.test(i)) return "image:gpt-image-2-pro";
    if (/^gpt-image-2(?:-|$)?/i.test(i)) return "image:gpt-image-2";
    if (/^gpt-image-1\.5/i.test(i)) return "image:gpt-image-1-5";
    if (/^gpt-image-1/i.test(i)) return "image:gpt-image-1";
    if (/^gpt-4o-image/i.test(i)) return "image:gpt-4o-image";
    if (/seedream/i.test(i))
      return `image:${i.replace(/[-_.](?:fast|turbo|pro|lite|official)$/i, "")}`;
    if (/qwen-image-edit/i.test(i)) return "image:qwen-image-edit";
    if (/qwen-image/i.test(i)) return "image:qwen-image";
    if (/flux|kontext/i.test(i)) return `image:${i}`;
  }
  if (a === "video") {
    if (/doubao-seedance-2(?:\.|-)?0-mini|seedance[-_.\s]?2.*mini/i.test(i))
      return "video:seedance-2-mini";
    if (/doubao-seedance-2-0-fast|seedance[-_.\s]?2.*fast/i.test(i))
      return "video:seedance-2-fast";
    if (/doubao-seedance-2-0|seedance[-_.\s]?2/i.test(i))
      return "video:seedance-2";
    if (/pixverse[-_.\s]?v?4|pix[-_.\s]?verse[-_.\s]?v?4|^v4$/i.test(i))
      return "video:pixverse-v4-simple";
    if (/veo.*3.*1.*pro/i.test(i)) return "video:veo-3-1-pro";
    if (/veo.*3.*1.*fast/i.test(i)) return "video:veo-3-1-fast";
    if (/veo.*3.*1.*lite/i.test(i)) return "video:veo-3-1-lite";
    if (/sora.*2/i.test(i)) return "video:sora-2";
  }
  if (a === "chat") {
    const o = Ga(i);
    if (o) return `chat:${o}`;
    if (/claude.*opus.*4/i.test(i)) return "chat:claude-opus-4";
    if (/claude.*sonnet/i.test(i)) return "chat:claude-sonnet";
  }
  return `${a}:${i}`;
}
function Si(e, a) {
  const i = ke(e).toLowerCase();
  if (a === "image") {
    if (i === "gpt-image-2-pro") return 1005;
    if (i === "gpt-image-2") return 1e3;
    if (i === "gemini-3-pro-image-preview") return 990;
    if (i === "gemini-3.1-flash-image-preview") return 980;
    if (/midjourney|mj\b/.test(i)) return 760;
    if (/flux|kontext/.test(i)) return 720;
    if (/seedream/.test(i)) return 700;
    if (/qwen-image/.test(i)) return 680;
    if (/recraft|ideogram/.test(i)) return 620;
  }
  if (a === "video") {
    if (/doubao-seedance-2(?:\.|-)?0-mini|seedance[-_.\s]?2.*mini/.test(i))
      return 1001;
    if (/doubao-seedance-2-0-fast|seedance[-_.\s]?2.*fast/.test(i)) return 1e3;
    if (/doubao-seedance-2-0|seedance[-_.\s]?2/.test(i)) return 990;
    if (/pixverse[-_.\s]?v?4|pix[-_.\s]?verse[-_.\s]?v?4|^v4$/.test(i))
      return 985;
    if (/pixverse|pix[-_.\s]?verse|^v[23456](?:\.5)?$/.test(i)) return 982;
    if (/veo.*3.*1.*pro/.test(i)) return 970;
    if (/sora.*2/.test(i)) return 960;
    if (/grok.*video/.test(i)) return 940;
    if (/wan2|wan[-_.]?2/.test(i)) return 900;
  }
  if (a === "chat") {
    if (/claude.*opus.*4/.test(i)) return 1e3;
    if (/claude.*sonnet/.test(i)) return 960;
    if (/gpt[-_.]5|gpt[-_.]4o/.test(i)) return 930;
    if (/gemini/.test(i)) return 910;
    if (/qwen|deepseek/.test(i)) return 880;
  }
  if (a === "music") {
    if (/suno.*v?4/.test(i)) return 1e3;
    if (/minimax.*tts/.test(i)) return 930;
  }
  return 100;
}
function Ja(e, a) {
  const i = ke(e).toLowerCase();
  return a === "tools"
    ? !1
    : a === "image"
      ? /gpt-image|gpt-4o-image|dall[-_.]?e|gemini.*image|nano[-_.]?banana|midjourney|mj\b|seedream|flux|kontext|qwen-image|recraft|ideogram|grok.*image|image-edit|omni-image/.test(
          i,
        )
      : a === "video"
        ? /seedance|sora|veo|wanx?|wan2|grok.*video|kling|hailuo|minimax|runway|luma|pixverse|vidu|pika/.test(
            i,
          )
        : a === "music"
          ? /suno|udio|riffusion|tts|whisper|audio|voice|speech|music|bgm|song|minimax/.test(
              i,
            )
          : /claude|gpt|gemini|qwen|deepseek|kimi|glm|grok|mistral|llama|doubao/.test(
              i,
            );
}
function ni(e) {
  const a = 2e3 - Si(e.endpointModelId || e.modelId, e.category);
  return `${String(a).padStart(4, "0")}:${e.alias}`;
}
function oi(e) {
  const a = e.trim(),
    i = [];
  return (
    /(?:^|[-_.])512px$/i.test(a) && i.push("512px"),
    /(?:^|[-_.])1k$/i.test(a) && i.push("1K"),
    /(?:^|[-_.])2k$/i.test(a) && i.push("2K"),
    /(?:^|[-_.])4k$/i.test(a) && i.push("4K"),
    i
  );
}
function displayModelVariantSuffix(e) {
  const a = [],
    i = e.match(/(?:^|[-_.])(512px|1k|2k|4k)(?=$|[-_.])/i);
  return (
    i && a.push(i[1].toUpperCase()),
    /(?:^|[-_.])official(?=$|[-_.])/i.test(e) && a.push("Official"),
    /(?:^|[-_.])all(?=$|[-_.])/i.test(e) && a.push("All"),
    a.length > 0 ? ` \u00B7 ${a.join(" \u00B7 ")}` : ""
  );
}
function si(e, a) {
  const i = e.trim().toLowerCase();
  let o = Si(i, a);
  return (
    /-official\b/.test(i) && (o -= 20),
    /(?:^|[-_.])(?:512px|1k|2k|4k)$/.test(i) && (o -= 10),
    a === "image" &&
      (/^gemini-3-pro-image-preview$/.test(i) && (o += 80),
      /^gpt-image-2$/.test(i) && (o += 80),
      /^gemini-3\.1-flash-image-preview$/.test(i) && (o += 70),
      /^doubao-seedream/.test(i) && (o += 40)),
    a === "chat" &&
      (/(?:^|[-_.])official(?:$|[-_.])/.test(i) && (o += 2),
      /\d{4}[-_.]\d{2}[-_.]\d{2}|\d{8}/.test(i) || (o += 8),
      /^gpt[-_.]\d+(?:[-_.]\d+)?(?:[-_.](?:nano|mini|pro|codex))?$/.test(i) &&
        (o += 12)),
    o
  );
}
function Se(e) {
  const a = e.trim(),
    i = displayModelVariantSuffix(a);
  return /^gemini-3-pro-image-preview(?:[-_.](?:1k|2k|4k|official))*$/i.test(a)
    ? `Nano Banana PRO${i}`
    : /^gemini-3(?:\.|-)?1-flash-image-preview(?:[-_.](?:512px|1k|2k|4k|official))*$/i.test(
          a,
        )
      ? `Nano Banana 2${i}`
      : /^gemini-2(?:\.|-)?5-flash-image-preview$/i.test(a) ||
          /^nano[-_]?banana$/i.test(a)
        ? "Nano Banana"
        : /^gpt-image-2-pro$/i.test(a)
          ? "GPT Image 2 Pro"
          : /^gpt-image-2(?:[-_.](?:all|official))*$/i.test(a)
            ? `GPT Image 2${i}`
            : /^gpt-image-1(?:\.5)?/i.test(a)
              ? a.replace(/^gpt/i, "GPT")
              : /^gpt-4o(?:-mini)?$/i.test(a)
                ? a.replace(/^gpt/i, "GPT").replace("-mini", " Mini")
                : /^gpt[-_.]5[-_.]4[-_.]nano/i.test(a)
                  ? "GPT 5.4 Nano"
                  : /^gpt[-_.]5[-_.]nano/i.test(a)
                    ? "GPT 5 Nano"
                    : /^gpt[-_.]4[-_.]1[-_.]nano/i.test(a)
                      ? "GPT 4.1 Nano"
                      : /^gpt[-_.]5[-_.]4[-_.]mini/i.test(a)
                        ? "GPT 5.4 Mini"
                        : /^gpt[-_.]5[-_.]4[-_.]pro/i.test(a)
                          ? "GPT 5.4 Pro"
                          : /^gpt[-_.]5[-_.]pro/i.test(a)
                            ? "GPT 5 Pro"
                            : /^claude-opus-4[-_.]?7$/i.test(a)
                              ? "Claude Opus 4.7"
                              : /^claude-opus-4[-_.]?6$/i.test(a)
                                ? "Claude Opus 4.6"
                                : /^claude-3[-_.]?5-sonnet/i.test(a)
                                  ? "Claude 3.5 Sonnet"
                                  : /^doubao-seedance-2-0-fast-260128$/i.test(a)
                                    ? "Seedance 2.0 Fast"
                                    : /^doubao-seedance-2(?:\.|-)?0-mini$/i.test(
                                          a,
                                        )
                                      ? "Seedance 2.0 Mini"
                                      : /^doubao-seedance-2-0-260128$/i.test(a)
                                        ? "Seedance 2.0"
                                        : /^doubao-seedance-1-5/i.test(a)
                                          ? "Seedance 1.5"
                                          : /^doubao-seedance-1-0/i.test(a)
                                            ? "Seedance 1.0"
                                            : /^veo3[._-]?1-pro$/i.test(a)
                                              ? "Veo 3.1 Pro"
                                              : /^veo3[._-]?1-fast$/i.test(a)
                                                ? "Veo 3.1 Fast"
                                                : /^sora-2(?:-official)?$/i.test(
                                                      a,
                                                    )
                                                  ? "Sora 2"
                                                  : /^suno-v?4$/i.test(a)
                                                    ? "Suno V4"
                                                    : /^suno-v?3(?:\.|-)?5$/i.test(
                                                          a,
                                                        )
                                                      ? "Suno V3.5"
                                                      : /^minimax.*tts/i.test(a)
                                                        ? "MiniMax TTS"
                                                        : /^qwen3[-_.]?max$/i.test(
                                                              a,
                                                            )
                                                          ? "Qwen3 Max"
                                                          : /^deepseek/i.test(a)
                                                            ? a
                                                                .replace(
                                                                  /^deepseek/i,
                                                                  "DeepSeek",
                                                                )
                                                                .replace(
                                                                  /[-_]+/g,
                                                                  " ",
                                                                )
                                                            : /^flux-kontext-pro$/i.test(
                                                                  a,
                                                                )
                                                              ? "Flux Kontext Pro"
                                                              : /^flux-kontext-max$/i.test(
                                                                    a,
                                                                  )
                                                                ? "Flux Kontext Max"
                                                                : a
                                                                    .replace(
                                                                      /[-_]+/g,
                                                                      " ",
                                                                    )
                                                                    .split(
                                                                      /\s+/,
                                                                    )
                                                                    .map(La)
                                                                    .join(" ");
}
function Pi(e) {
  return /gpt|chatgpt|sora|whisper|tts/i.test(e)
    ? "openai"
    : /suno/i.test(e)
      ? "suno"
      : /riffusion/i.test(e)
        ? "riffusion"
        : /udio/i.test(e)
          ? "udio"
          : /kling|kwaivgi|可灵/i.test(e)
            ? "kling"
            : /recraft/i.test(e)
              ? "recraft"
              : /flux|bfl/i.test(e)
                ? "flux"
                : /ideogram/i.test(e)
                  ? "ideogram"
                  : /gemini|veo|banana/i.test(e) || jt(e)
                    ? "google"
                    : /claude/i.test(e)
                      ? "anthropic"
                      : /deepseek/i.test(e)
                        ? "deepseek"
                        : /qwen|wanx?|wan2/i.test(e)
                          ? "qwen"
                          : /kimi/i.test(e)
                            ? "kimi"
                            : /glm/i.test(e)
                              ? "glm"
                              : /minimax|hailuo/i.test(e)
                                ? "minimax"
                                : /grok|xai/i.test(e)
                                  ? "xai"
                                  : /doubao|seedream|seedance/i.test(e)
                                    ? "doubao"
                                    : "custom";
}
function At(e) {
  return /suno|udio|riffusion|tts|whisper|audio|voice|speech|music|bgm|song|text-to-audio|video-to-audio|kling.*(?:audio|tts)|minimax.*tts|mini[-_\s]?max.*tts/i.test(
    e,
  )
    ? "music"
    : /veo|sora|wanx?|wan[-_\s]?2|wan2|seedance|kling.*(?:video|v[0-9]|omni)|kwaivgi|hailuo|minimax(?!.*tts)|grok-video|vidu|pixverse|ray-v|gen[234]\b|pika|higgsfield|runway|luma|liveportrait|emo|videoretalk|animateanyone|video/i.test(
          e,
        )
      ? "video"
      : Oa(e)
        ? "image"
        : /rembg|remove-bg|upscale|background|psd|3d|hunyuan/i.test(e)
          ? "tools"
          : "chat";
}
function $t(e, a) {
  return Ci(a)
    ? "openai"
    : e === "google" && (/gemini/i.test(a) || jt(a))
      ? "google-gemini"
      : e === "openai"
        ? "openai"
        : e === "anthropic"
          ? "anthropic"
          : e === "doubao"
            ? "doubao"
            : e === "qwen"
              ? "qwen"
              : e === "xai"
                ? "xai"
                : e === "flux"
                  ? "flux"
                  : e === "suno"
                    ? "suno"
                    : e === "minimax"
                      ? "minimax"
                      : e === "deepseek"
                        ? "deepseek"
                        : e || "generic";
}
function Fa(e, a) {
  const i = (a?.supportedEndpointTypes ?? []).join(" ").toLowerCase(),
    o = String(a?.id ?? "").toLowerCase();
  if (e === "image") {
    if (/image[-_ /]?generation|images?\/(?:generations|edits)/.test(i))
      return "openai-image";
    if (/chat|completion|responses|message/.test(i)) return "openai-chat";
    return "openai-image";
  }
  if (e === "music") {
    if (/tts|speech|text[-_ ]?to[-_ ]?audio/.test(o))
      return "openai-audio-speech";
    if (/suno[_-]?music|music[-_ ]?generation|audio[-_ ]?generation/.test(o))
      return "openai-audio";
  }
  return e === "video"
    ? "openai-video"
    : e === "chat"
      ? "openai-chat"
      : "unknown";
}
function Va(e) {
  const a = (e.supportedEndpointTypes ?? []).join(" ").toLowerCase();
  return /image|images|img|vision_generation/.test(a)
    ? "image"
    : /video|videos|movie/.test(a)
      ? "video"
      : /audio|music|speech|tts|voice|song/.test(a)
        ? "music"
        : /chat|completion|responses|message|text/.test(a)
          ? "chat"
          : (e.category ?? At(e.id));
}
function Jn(e, a) {
  const i = $i(a.baseUrl),
    o = new Map();
  for (const c of e) {
    const g = c.id.trim();
    if (!g) continue;
    const b = Va(c);
    if (b === "tools") continue;
    const y = b === "image" ? ke(g) : g;
    if (!Ja(y, b)) continue;
    const j = `${b}:${g.toLowerCase()}`,
      x = o.get(j);
    !x || si(g, b) > si(x.item.id, x.category)
      ? o.set(j, {
          item: c,
          category: b,
          endpointModelId: g,
          resolutions: new Set([
            ...((x == null ? void 0 : x.resolutions) ?? []),
            ...oi(g),
          ]),
        })
      : oi(g).forEach((U) => x.resolutions.add(U));
  }
  const d = [];
  for (const c of o.values()) {
    const g = c.endpointModelId,
      b = c.category,
      y = c.item.provider || Pi(g),
      j = `provider-${i}-${b}-${wt(g)}`,
      x = nt(g),
      U = Array.from(c.resolutions),
      k =
        U.length > 0
          ? x.resolutions.filter((P) => U.includes(P))
          : x.resolutions;
    d.push({
      id: j,
      alias: Se(g),
      modelId: g,
      endpointModelId: g,
      apiGroup: wi,
      category: b,
      provider: y,
      icon: $t(y, g),
      requestMode: Fa(b, c.item),
      supportedEndpointTypes: c.item.supportedEndpointTypes ?? [],
      baseUrl: a.baseUrl.trim(),
      apiKey: a.apiKey.trim(),
      enabled: !0,
      status: "untested",
      supportsAsync: x.supportsAsync,
      supportsReferenceImages: x.supportsReferenceImages,
      sizeMode: x.sizeMode,
      resolutions: k.length > 0 ? k : x.resolutions,
      aspectRatios: x.aspectRatios,
      qualities: x.qualities,
      maxBatch: x.maxBatch,
    });
  }
  const r = { chat: 0, image: 1, video: 2, music: 3, tools: 4 };
  return Mt(d).sort(
    (c, g) =>
      r[c.category] - r[g.category] || ni(c).localeCompare(ni(g), "zh-Hans-CN"),
  );
}
function Ui(e) {
  return (
    e.category === "tools" ||
    e.provider === "jiaren" ||
    e.id.startsWith("jiaren-")
  );
}
function Wa(e) {
  return e.id.startsWith("provider-");
}
function Ha(e) {
  const a = e.endpointModelId ?? e.modelId;
  return {
    id: `comfly-${e.slug}`,
    alias: e.alias,
    modelId: e.modelId,
    endpointModelId: a,
    fallbackEndpointModelId: e.fallbackEndpointModelId,
    apiGroup: "a2",
    category: e.category,
    provider: e.provider,
    icon: e.icon,
    requestMode: e.requestMode,
    baseUrl: void 0,
    ...e.options,
  };
}
function at(e) {
  return e.map(Ha);
}
const Ya = [
    {
      slug: "claude-opus-4-7",
      alias: "Claude Opus 4.7",
      modelId: "claude-opus-4-7",
      fallbackEndpointModelId: "claude-opus-4-6",
      category: "chat",
      provider: "anthropic",
      icon: "anthropic",
      requestMode: "openai-chat",
    },
    {
      slug: "claude-3-5-sonnet",
      alias: "Claude 3.5 Sonnet",
      modelId: "claude-3-5-sonnet",
      category: "chat",
      provider: "anthropic",
      icon: "anthropic",
      requestMode: "openai-chat",
    },
    {
      slug: "gpt-4o",
      alias: "GPT-4o",
      modelId: "gpt-4o",
      category: "chat",
      provider: "openai",
      icon: "openai",
      requestMode: "openai-chat",
    },
    {
      slug: "gpt-4o-mini",
      alias: "GPT-4o mini",
      modelId: "gpt-4o-mini",
      category: "chat",
      provider: "openai",
      icon: "openai",
      requestMode: "openai-chat",
    },
    {
      slug: "gemini-3-1-pro",
      alias: "Gemini 3.1 Pro",
      modelId: "gemini-3.1-pro",
      category: "chat",
      provider: "google",
      icon: "google",
      requestMode: "openai-chat",
    },
    {
      slug: "qwen3-max",
      alias: "Qwen3 Max",
      modelId: "qwen3-max",
      category: "chat",
      provider: "qwen",
      icon: "qwen",
      requestMode: "openai-chat",
    },
    {
      slug: "deepseek-v4-pro",
      alias: "DeepSeek V4 Pro",
      modelId: "deepseek-v4-pro",
      category: "chat",
      provider: "deepseek",
      icon: "deepseek",
      requestMode: "openai-chat",
    },
  ],
  Xa = [
    {
      slug: "gpt-image-2",
      alias: "GPT Image 2",
      modelId: "gpt-image-2",
      fallbackEndpointModelId: "gemini-3-pro-image-preview",
      category: "image",
      provider: "openai",
      icon: "openai",
      requestMode: "openai-image",
      options: {
        ...me,
        resolutions: ["1K", "2K", "4K"],
        aspectRatios: Ii,
        qualities: ["Auto", "High", "Medium", "Low"],
        maxBatch: 4,
      },
    },
    {
      slug: "nano-banana-pro",
      alias: "Nano Banana PRO",
      modelId: "nano-banana-pro",
      endpointModelId: "gemini-3-pro-image-preview",
      fallbackEndpointModelId: "gemini-3.1-flash-image-preview",
      category: "image",
      provider: "google",
      icon: "google-gemini",
      requestMode: "openai-image",
      options: {
        ...me,
        resolutions: ["1K", "2K", "4K"],
        aspectRatios: kt,
        maxBatch: 4,
      },
    },
    {
      slug: "nano-banana-2",
      alias: "Nano Banana 2",
      modelId: "nano-banana-2",
      endpointModelId: "gemini-3.1-flash-image-preview",
      fallbackEndpointModelId: "gemini-3-pro-image-preview",
      category: "image",
      provider: "google",
      icon: "google-gemini",
      requestMode: "openai-image",
      options: {
        ...me,
        resolutions: ["512px", "1K", "2K", "4K"],
        aspectRatios: ki,
        maxBatch: 4,
      },
    },
    {
      slug: "nano-banana",
      alias: "Nano Banana",
      modelId: "nano-banana",
      endpointModelId: "gemini-2.5-flash-image-preview",
      category: "image",
      provider: "google",
      icon: "google-gemini",
      requestMode: "openai-image",
      options: { ...me, resolutions: ["1K", "2K"], maxBatch: 4 },
    },
    {
      slug: "flux-kontext-pro",
      alias: "Flux Kontext Pro",
      modelId: "flux-kontext-pro",
      category: "image",
      provider: "flux",
      icon: "flux",
      requestMode: "openai-image",
      options: {
        ...me,
        resolutions: ["1K", "2K"],
        qualities: ["Auto", "High", "Medium"],
        maxBatch: 4,
      },
    },
    {
      slug: "flux-kontext-max",
      alias: "Flux Kontext Max",
      modelId: "flux-kontext-max",
      category: "image",
      provider: "flux",
      icon: "flux",
      requestMode: "openai-image",
      options: {
        ...me,
        resolutions: ["1K", "2K"],
        qualities: ["Auto", "High", "Medium"],
        maxBatch: 4,
      },
    },
    {
      slug: "qwen-image",
      alias: "Qwen Image",
      modelId: "qwen-image",
      category: "image",
      provider: "qwen",
      icon: "qwen",
      requestMode: "openai-image",
      options: {
        ...me,
        supportsReferenceImages: !1,
        resolutions: ["1K", "2K"],
        aspectRatios: ["1:1", "2:3", "3:2", "4:3", "3:4", "16:9", "9:16"],
        maxBatch: 4,
      },
    },
    {
      slug: "qwen-image-edit",
      alias: "Qwen Image Edit",
      modelId: "qwen-image-edit",
      category: "image",
      provider: "qwen",
      icon: "qwen",
      requestMode: "openai-image",
      options: {
        ...me,
        resolutions: ["1K", "2K"],
        aspectRatios: ["1:1", "2:3", "3:2", "4:3", "3:4", "16:9", "9:16"],
        maxBatch: 4,
      },
    },
  ],
  Qa = [
    {
      slug: "seedance-2-mini",
      alias: "Seedance 2.0 Mini",
      modelId: "doubao-seedance-2.0-mini",
      category: "video",
      provider: "doubao",
      icon: "doubao",
      requestMode: "openai-video",
      options: { ...Z, resolutions: ["720p"] },
    },
    {
      slug: "seedance-2",
      alias: "Seedance 2.0",
      modelId: "doubao-seedance-2-0-260128",
      category: "video",
      provider: "doubao",
      icon: "doubao",
      requestMode: "openai-video",
      options: { ...Z, resolutions: ["720p", "1080p"] },
    },
    {
      slug: "seedance-2-fast",
      alias: "Seedance 2.0 Fast",
      modelId: "doubao-seedance-2-0-fast-260128",
      category: "video",
      provider: "doubao",
      icon: "doubao",
      requestMode: "openai-video",
      options: { ...Z, resolutions: ["720p"] },
    },
    {
      slug: "sora-2",
      alias: "Sora 2",
      modelId: "sora-2-official",
      category: "video",
      provider: "openai",
      icon: "openai",
      requestMode: "openai-video",
      options: { ...Z, resolutions: ["Auto"] },
    },
    {
      slug: "veo-3-1-pro",
      alias: "Veo 3.1 Pro",
      modelId: "veo3.1-pro",
      category: "video",
      provider: "google",
      icon: "google-gemini",
      requestMode: "openai-video",
      options: { ...Z, resolutions: ["720p", "1080p", "4k"] },
    },
    {
      slug: "veo-3-1-fast",
      alias: "Veo 3.1 Fast",
      modelId: "veo3.1-fast",
      category: "video",
      provider: "google",
      icon: "google-gemini",
      requestMode: "openai-video",
      options: { ...Z, resolutions: ["720p", "1080p"] },
    },
    {
      slug: "veo-3-1-lite",
      alias: "Veo 3.1 Lite",
      modelId: "veo3.1-lite",
      category: "video",
      provider: "google",
      icon: "google-gemini",
      requestMode: "openai-video",
      options: {
        ...Z,
        supportsReferenceImages: !1,
        aspectRatios: ["16:9", "9:16"],
        durations: [8],
        resolutions: ["720p", "1080p", "4K"],
        maxReferenceImages: 0,
      },
    },
    {
      slug: "grok-video-1-5",
      alias: "Grok Video 1.5",
      modelId: "grok-video-1.5-preview",
      category: "video",
      provider: "xai",
      icon: "xai",
      requestMode: "openai-video",
      options: { ...Z, resolutions: ["Auto"], maxBatch: 1 },
    },
    {
      slug: "pixverse-v4-simple",
      alias: "PixVerse V4 简单版",
      modelId: "pixverse-v4-simple",
      endpointModelId: "v4",
      category: "video",
      provider: "pixverse",
      icon: "video",
      requestMode: "openai-video",
      options: { ...Z, resolutions: ["540p", "720p"], maxBatch: 1 },
    },
    {
      slug: "pixverse-v6",
      alias: "PixVerse V6",
      modelId: "pixverse-v6",
      endpointModelId: "v6",
      category: "video",
      provider: "pixverse",
      icon: "video",
      requestMode: "openai-video",
      options: { ...Z, resolutions: ["720p", "1080p"] },
    },
    {
      slug: "wan-2-6",
      alias: "Wan 2.6",
      modelId: "wan2.6",
      category: "video",
      provider: "qwen",
      icon: "qwen",
      requestMode: "openai-video",
      options: Z,
    },
    {
      slug: "wan-2-6-i2v-flash",
      alias: "Wan 2.6 I2V Flash",
      modelId: "wan2.6-i2v-flash",
      category: "video",
      provider: "qwen",
      icon: "qwen",
      requestMode: "openai-video",
      options: Z,
    },
  ],
  Za = [
    {
      slug: "suno-v4",
      alias: "Suno V4",
      modelId: "suno-v4",
      category: "music",
      provider: "suno",
      icon: "suno",
      requestMode: "unknown",
    },
    {
      slug: "suno-v3-5",
      alias: "Suno V3.5",
      modelId: "suno-v3.5",
      category: "music",
      provider: "suno",
      icon: "suno",
      requestMode: "unknown",
    },
    {
      slug: "minimax-tts-sync",
      alias: "MiniMax TTS 同步",
      modelId: "minimax-tts-sync",
      category: "music",
      provider: "minimax",
      icon: "minimax",
      requestMode: "unknown",
    },
    {
      slug: "minimax-tts-async",
      alias: "MiniMax TTS 异步",
      modelId: "minimax-tts-async",
      category: "music",
      provider: "minimax",
      icon: "minimax",
      requestMode: "unknown",
    },
    {
      slug: "openai-tts",
      alias: "OpenAI TTS",
      modelId: "tts-1",
      category: "music",
      provider: "openai",
      icon: "openai",
      requestMode: "unknown",
    },
  ];
function en(e) {
  const a = new Set();
  return e.filter((i) => (a.has(i.id) ? !1 : (a.add(i.id), !0)));
}
const tn = at(Ya),
  an = at(Xa),
  nn = at(Qa),
  on = at(Za),
  ri = {
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
    "a2-seedance2": "comfly-seedance-2",
    "a2-seedance2-fast": "comfly-seedance-2-fast",
    "a2-seedance2-mini": "comfly-seedance-2-mini",
    "seedance-2": "comfly-seedance-2",
    "seedance-2-fast": "comfly-seedance-2-fast",
    "seedance-2-mini": "comfly-seedance-2-mini",
    "doubao-seedance-2-0-260128": "comfly-seedance-2",
    "doubao-seedance-2-0-fast-260128": "comfly-seedance-2-fast",
    "doubao-seedance-2.0-mini": "comfly-seedance-2-mini",
    "doubao-seedance-2-0-mini": "comfly-seedance-2-mini",
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
    "a2-pixverse-v3": "pixverse-v4-simple",
    "pixverse-v4": "pixverse-v4-simple",
    "pixverse-v4-simple": "pixverse-v4-simple",
    v4: "pixverse-v4-simple",
    pixverse: "pixverse-v4-simple",
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
    "apilio-doubao-seedance-2-0-260128": "comfly-seedance-2",
    "apilio-doubao-seedance-2-0-fast-260128": "comfly-seedance-2-fast",
    "apilio-doubao-seedance-2.0-mini": "comfly-seedance-2-mini",
    "apilio-doubao-seedance-2-0-mini": "comfly-seedance-2-mini",
    "apilio-seedance-2": "comfly-seedance-2",
    "apilio-seedance-2-fast": "comfly-seedance-2-fast",
    "apilio-seedance-2-mini": "comfly-seedance-2-mini",
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
    "apilio-pixverse": "pixverse-v4-simple",
    "apilio-suno-v4": "comfly-suno-v4",
    "apilio-suno-v3.5": "comfly-suno-v3-5",
    "apilio-suno-v3-5": "comfly-suno-v3-5",
    "apilio-minimax-tts-sync": "comfly-minimax-tts-sync",
    "apilio-minimax-tts-async": "comfly-minimax-tts-async",
    "apilio-openai-tts": "comfly-openai-tts",
  };
function Ct(e) {
  if (!(e != null && e.trim())) return;
  const a = e.trim();
  return a.startsWith("provider-") ? a : (ri[a] ?? ri[a.toLowerCase()] ?? a);
}
const sn = en([
    ...tn,
    ...an,
    ...nn,
    ...on,
    {
      id: "jiaren-local-rmbg",
      alias: "Jiaren AI 本地抠图",
      modelId: "background-removal",
      category: "tools",
      provider: "jiaren",
      icon: "jiaren",
      requestMode: "unknown",
    },
  ]),
  ci = sn
    .filter((e) => e.category !== "tools")
    .map((e) => ({
      modelId: e.id,
      alias: e.alias,
      category: e.category,
      supportsAsync: e.supportsAsync ?? !1,
      supportsReferenceImages: e.supportsReferenceImages ?? !1,
      sizeMode: e.sizeMode ?? "preset-grid",
      resolutions: e.resolutions ?? ["Auto"],
      aspectRatios: e.aspectRatios ?? ["1:1"],
      qualities: e.qualities ?? ["Auto"],
      maxBatch: e.maxBatch ?? 1,
    })),
  Fn = [
    { id: "chat", label: "文字推理" },
    { id: "image", label: "图片生成" },
    { id: "video", label: "视频生成" },
    { id: "music", label: "音频音乐" },
    { id: "tools", label: "工具" },
  ],
  Te = {
    global: {
      baseUrl: ii,
      apiKey: "",
      fallbackBaseUrl: ii,
      fallbackApiKey: "",
      apiUserId: "",
    },
    models: Ai.map((e) => ({
      id: e.id,
      alias: e.alias,
      modelId: e.modelId,
      endpointModelId: e.endpointModelId,
      fallbackEndpointModelId: e.fallbackEndpointModelId,
      apiGroup: e.apiGroup,
      providerSource: e.providerSource || e.apiGroup || e.provider || "user-configured",
      category: e.category,
      provider: e.provider,
      icon: e.icon,
      requestMode: e.requestMode,
      enabled: !0,
      status: "untested",
      baseUrl: e.baseUrl,
    })),
  };
function rn() {
  return Ai.map((e) => ({
    id: e.id,
    alias: e.alias,
    modelId: e.modelId,
    endpointModelId: e.endpointModelId,
    fallbackEndpointModelId: e.fallbackEndpointModelId,
    apiGroup: e.apiGroup,
    providerSource: e.providerSource || e.apiGroup || e.provider || "user-configured",
    category: e.category,
    provider: e.provider,
    icon: e.icon,
    requestMode: e.requestMode,
    enabled: !0,
    status: "untested",
    baseUrl: e.baseUrl,
  }));
}
function nt(e) {
  const a = e.trim(),
    i = a.startsWith("provider-")
      ? /image-nano-banana-pro/i.test(a)
        ? "gemini-3-pro-image-preview"
        : /image-nano-banana-2/i.test(a)
          ? "gemini-3.1-flash-image-preview"
          : /image-nano-banana(?:$|-)/i.test(a)
            ? "gemini-2.5-flash-image-preview"
            : /image-gpt-image-2/i.test(a)
              ? "gpt-image-2"
              : /video-seedance-2-mini/i.test(a)
                ? "doubao-seedance-2.0-mini"
                : /video-seedance-2-fast/i.test(a)
                  ? "doubao-seedance-2-0-fast-260128"
                  : /video-seedance-2/i.test(a)
                    ? "doubao-seedance-2-0-260128"
                    : a
      : a,
    o = At(i);
  if (o === "image") {
    const d = ke(i),
      r = /gemini-3(?:\.|-)?1-flash-image-preview/i.test(d),
      c = /512px$/i.test(i),
      g = /2k$/i.test(i),
      b = /4k$/i.test(i),
      y = /gpt-image/i.test(i);
    return {
      modelId: a,
      alias: Se(d),
      category: o,
      supportsAsync: !0,
      supportsReferenceImages: !0,
      sizeMode: "preset-grid",
      resolutions: c
        ? ["512px"]
        : g
          ? ["2K"]
          : b
            ? ["4K"]
            : r
              ? ["512px", "1K", "2K", "4K"]
              : y
                ? ["1K", "2K", "4K"]
                : ["Auto", "1K", "2K", "4K"],
      aspectRatios: r ? ki : y ? Ii : kt,
      qualities: y ? ["Auto", "High", "Medium", "Low"] : ["Auto"],
      maxBatch: 4,
    };
  }
  if (o === "video") {
    const d = /seedance.*mini|doubao-seedance-2(?:\.|-)?0-mini/i.test(i),
      r = /seedance.*fast|doubao-seedance-2-0-fast/i.test(i),
      c = /seedance|doubao-seedance/i.test(i),
      g = /pixverse|pix[-_\s]?verse|^v[23456](?:\.5)?$/i.test(i),
      b = /veo/i.test(i);
    return {
      modelId: a,
      alias: Se(i),
      category: o,
      supportsAsync: !0,
      supportsReferenceImages: !0,
      sizeMode: "preset-grid",
      resolutions: g
        ? ["540p", "720p"]
        : d || r
          ? ["720p"]
          : c
            ? ["720p", "1080p"]
            : b
              ? ["720p", "1080p", "4K"]
              : ["Auto", "720p", "1080p"],
      aspectRatios: g ? ["16:9", "4:3", "1:1", "3:4", "9:16"] : Mi,
      qualities: ["Auto"],
      maxBatch: 1,
    };
  }
  return {
    modelId: a,
    alias: Se(a),
    category: o,
    supportsAsync: !1,
    supportsReferenceImages: !1,
    sizeMode: "preset-grid",
    resolutions: ["Auto"],
    aspectRatios: ["1:1"],
    qualities: ["Auto"],
    maxBatch: 1,
  };
}
function Qe(e) {
  const a = Ct(e) ?? e;
  return (
    ci.find((i) => i.modelId === a) ??
    ci.find((i) => {
      var o;
      return ((o = ln(a)) == null ? void 0 : o.id) === i.modelId;
    }) ??
    nt(e)
  );
}
function ge(e, a) {
  var z, X, L, C, te, se, W, Q, V, A, ve;
  const i = Ni(e, a),
    o = ((z = e.global.baseUrl) == null ? void 0 : z.trim()) || "",
    d = ((X = e.global.fallbackBaseUrl) == null ? void 0 : X.trim()) || "",
    r = ((L = e.global.apiKey) == null ? void 0 : L.trim()) || "",
    c = ((C = e.global.fallbackApiKey) == null ? void 0 : C.trim()) || "",
    g =
      ((te = i == null ? void 0 : i.baseUrl) == null ? void 0 : te.trim()) ||
      "",
    b =
      ((se = i == null ? void 0 : i.apiKey) == null ? void 0 : se.trim()) || "",
    y = !!(
      g ||
      b ||
      ((W = i == null ? void 0 : i.fallbackBaseUrl) != null && W.trim()) ||
      ((Q = i == null ? void 0 : i.fallbackApiKey) != null && Q.trim())
    ),
    j = g || o || d,
    x = b || r || c,
    U =
      ((V = i == null ? void 0 : i.fallbackBaseUrl) == null
        ? void 0
        : V.trim()) || "",
    k =
      ((A = i == null ? void 0 : i.fallbackApiKey) == null
        ? void 0
        : A.trim()) || "";
  return {
    baseUrl: j,
    apiKey: x,
    fallbackBaseUrl: y ? U || void 0 : d,
    fallbackApiKey: y ? k || void 0 : c || r || x,
    apiUserId: (ve = e.global.apiUserId) == null ? void 0 : ve.trim(),
    apiGroup: i == null ? void 0 : i.apiGroup,
    providerSource:
      (i == null ? void 0 : i.providerSource) ||
      (i == null ? void 0 : i.apiGroup) ||
      (i == null ? void 0 : i.provider) ||
      "user-configured",
  };
}
function tt(e, a) {
  const i = ge(e, a);
  return !!(i.baseUrl.trim() && i.apiKey.trim());
}
function Ze(e, a, i) {
  const o = e.models.filter((c) => c.enabled && c.category === a),
    d =
      Ct(i == null ? void 0 : i.preferredId) ??
      (i == null ? void 0 : i.preferredId),
    r = d
      ? o.find((c) => c.id === d || c.modelId === d || c.endpointModelId === d)
      : void 0;
  return r && tt(e, r.id)
    ? r
    : (o.find((c) => tt(e, c.id)) ??
        r ??
        (i != null && i.preferredApiGroup
          ? (o.find((c) => c.apiGroup === i.preferredApiGroup) ??
            o.find((c) => c.apiGroup === "a2" || c.apiGroup === "apilio"))
          : void 0) ??
        o.find((c) => c.apiGroup === "a2") ??
        o.find((c) => c.apiGroup === "apilio") ??
        o[0]);
}
function cn(e) {
  const a = e.models.filter((o) => o.enabled && o.category === "chat"),
    i = e.models.filter(
      (o) =>
        o.enabled && o.category === "image" && o.requestMode === "gemini-image",
    );
  return (
    a.find((o) => tt(e, o.id)) ?? i.find((o) => tt(e, o.id)) ?? a[0] ?? i[0]
  );
}
function ln(e) {
  return Ni(Te, e);
}
function Ni(e, a) {
  const i = Ct(a) ?? a;
  return (
    e.models.find((o) => o.id === i) ??
    e.models.find((o) => o.modelId === i) ??
    e.models.find((o) => o.endpointModelId === i) ??
    e.models.find((o) => o.id === a) ??
    e.models.find((o) => o.modelId === a) ??
    e.models.find((o) => o.endpointModelId === a)
  );
}
const dn = [],
  un = [];
function pn(e, a) {
  const i = (o) => {
    const d = o == null ? void 0 : o.trim();
    if (!d) return "";
    try {
      const r = new URL(d);
      return `${r.protocol}//${r.hostname}`.toLowerCase();
    } catch {
      return d.replace(/\/+$/, "").toLowerCase();
    }
  };
  return !!(i(e) && i(e) === i(a));
}
function mn(e, a) {
  if (!e || e.length === 0) return Te.models;
  const i = Te.models.map((r) => {
      const c = e.find((g) => g.id === r.id);
      return c
        ? {
            ...r,
            ...c,
            id: r.id,
            alias: r.alias,
            modelId: r.modelId,
            category: r.category,
            provider: r.provider,
            icon: r.icon,
            requestMode: r.requestMode,
          }
        : r;
    }),
    o = [],
    d = new Set();
  for (const r of e) {
    const c =
      String(r.providerSource || "").startsWith("jiaren-channel:") ||
      r.id.startsWith("provider-channel-");
    if (Ui(r) || !Wa(r) || (!c && !pn(r.baseUrl, a))) continue;
    const g = c ? r : ji(r),
      b = `${g.category}:${g.endpointModelId || g.modelId}:${g.baseUrl || ""}`;
    d.has(b) || (d.add(b), o.push(g));
  }
  return [...i, ...Mt(o)];
}
function fn(e) {
  const a = e == null ? void 0 : e.trim();
  return !a || a.includes("�") || /[閻㈤崶鐎甸敍缁嬪Ο鏉╅張]/.test(a)
    ? "未命名项目"
    : a.slice(0, 80);
}
function Re(e) {
  var o, d, r, c, g;
  const a =
      ((o = e.global.fallbackApiKey) == null ? void 0 : o.trim()) ||
      ((d = e.global.apiKey) == null ? void 0 : d.trim()) ||
      "",
    i =
      ((r = e.global.fallbackBaseUrl) == null ? void 0 : r.trim()) ||
      ((c = e.global.baseUrl) == null ? void 0 : c.trim()) ||
      "";
  return {
    ...e,
    global: {
      ...e.global,
      baseUrl: i,
      apiKey: a,
      fallbackBaseUrl: i,
      fallbackApiKey: a,
      apiUserId: ((g = e.global.apiUserId) == null ? void 0 : g.trim()) || "",
    },
    models: e.models.map((b) => {
      var x, U, k, P;
      const y = ((x = b.baseUrl) == null ? void 0 : x.trim()) || void 0,
        j = ((U = b.fallbackBaseUrl) == null ? void 0 : U.trim()) || void 0;
      return {
        ...b,
        baseUrl: y,
        fallbackBaseUrl: j,
        apiKey: ((k = b.apiKey) == null ? void 0 : k.trim()) || void 0,
        fallbackApiKey:
          ((P = b.fallbackApiKey) == null ? void 0 : P.trim()) || void 0,
        status: b.status,
        lastMessage: b.lastMessage,
      };
    }),
  };
}
function gn(e) {
  return `${e}-${crypto.randomUUID().slice(0, 8)}`;
}
function hn(e) {
  return {
    imageInput: "用户附件",
    textInput: "文字输入",
    videoText: "视频文字",
    storyText: "故事描述",
    characterAnalysis: "角色分析",
    videoBreakdown: "视频拆解",
    storyboard: "分镜卡片",
    generateImage: "图像生成",
    editImage: "图像编辑",
    removeBackground: "去背景",
    reversePrompt: "反推提示",
    llm: "LLM 分析",
    loop: "循环节点",
    poseMaster: "姿势大师",
    videoGenerate: "视频生成",
    sdVideo: "AI视频",
    agent: "对话模型",
    output: "输出",
  }[e];
}
function vn(e) {
  return {
    imageInput: "选择或拖入参考图片，可连接到生成、编辑、视频或去背景节点。",
    textInput: "输入文字、标题、脚本或提示词片段。",
    videoText:
      "填写导演词、剧情、分镜、镜头、运镜和负面约束，可连接到视频节点。",
    storyText:
      "填写短片故事、主题、平台和节奏，可连接到角色分析、分镜或视频节点。",
    characterAnalysis: "把故事和参考图整理为角色设定、外观一致性和表演约束。",
    videoBreakdown:
      "上传参考视频并拆解为可编辑分镜，后续可接关键帧和视频节点。",
    storyboard:
      "普通版分镜板，支持 4/5/6/8/9 宫格，图片提示词、视频提示词、旁白和台词可串联。",
    generateImage: "调用已配置的图像模型生成图片。",
    editImage: "以图片为输入进行局部编辑、重绘或风格迁移。",
    removeBackground: "调用本地抠图服务输出透明背景图片。",
    reversePrompt: "分析图片或关键帧，反推风格、镜头、光影和可复用 Prompt。",
    llm: "读取上游图片和提示词，生成商品方案、提示词或文案。",
    loop: "控制下游生成次数，可用于一键批量输出多版方案。",
    poseMaster:
      "调整人物姿势，输出姿势参考图、提示词和关键点，可连接视频节点。",
    videoGenerate: "将提示词或首帧图片转换为视频任务。",
    sdVideo: "AI 视频节点，可接收姿势大师、视频文字、分镜和参考图。",
    agent: "打开对话模型，与多轮创意协作面板联动。",
    output: "汇总上游节点的运行结果。",
  }[e];
}
const ee = xa((e, a) => ({
    activeTool: "select",
    gridVisible: !0,
    promptBarNodeId: void 0,
    selectedNodeId: void 0,
    selectedAssetId: void 0,
    promptReferences: [],
    canvasAssets: [],
    workflowNodes: dn,
    workflowEdges: un,
    runtimeSettings: Re(Te),
    storageSettings: {
      downloadsDir: "",
      cacheDir: "",
      autoSaveEnabled: !1,
      autoSaveMinutes: 5,
    },
    uiPreferences: {
      themeMode: "light",
      language: "zh",
      zoomPercent: 100,
      historyOpen: !1,
      agentOpen: !1,
      videoStudioOpen: !1,
      jiarenCanvasModeOpen: !1,
      jiarenCanvasAgentMode: "magic",
      rongtuStudioOpen: !1,
      comfyWorkflowStudioOpen: !1,
      masterToolkitOpen: !1,
      aiDirectorOpen: !1,
      designAgentOpen: !1,
      resourceLibraryOpen: !1,
      promptLibraryOpen: !1,
      projectName: "未命名项目",
    },
    history: [],
    setActiveTool: (i) => e({ activeTool: i }),
    toggleGrid: () => e((i) => ({ gridVisible: !i.gridVisible })),
    setPromptBarNode: (i) => e({ promptBarNodeId: i }),
    setSelectedNode: (i) => e({ selectedNodeId: i, selectedAssetId: void 0 }),
    setSelectedAsset: (i) => e({ selectedAssetId: i, selectedNodeId: void 0 }),
    addPromptReference: (i) =>
      e((o) => {
        const d = i.localPath || i.dataUrl || i.id;
        return {
          promptReferences: o.promptReferences.some(
            (c) => (c.localPath || c.dataUrl || c.id) === d || c.id === i.id,
          )
            ? o.promptReferences
            : [...o.promptReferences, i],
        };
      }),
    removePromptReference: (i) =>
      e((o) => ({
        promptReferences: o.promptReferences.filter((d) => d.id !== i),
      })),
    reorderPromptReference: (i, o) =>
      e((d) => {
        const r = d.promptReferences.findIndex((y) => y.id === i),
          c = d.promptReferences.findIndex((y) => y.id === o);
        if (r < 0 || c < 0 || r === c) return d;
        const g = [...d.promptReferences],
          [b] = g.splice(r, 1);
        return g.splice(c, 0, b), { promptReferences: g };
      }),
    addCanvasAsset: (i) => e((o) => ({ canvasAssets: [...o.canvasAssets, i] })),
    updateCanvasAsset: (i, o) =>
      e((d) => ({
        canvasAssets: d.canvasAssets.map((r) =>
          r.id === i ? { ...r, ...o } : r,
        ),
      })),
    removeCanvasAsset: (i) =>
      e((o) => ({
        selectedAssetId: o.selectedAssetId === i ? void 0 : o.selectedAssetId,
        canvasAssets: o.canvasAssets.filter((d) => d.id !== i),
      })),
    setCanvasAssets: (i) => e({ canvasAssets: i, selectedAssetId: void 0 }),
    addReusableAsset: (i) =>
      e((o) => {
        const d = i.localPath || i.dataUrl || i.source || i.id;
        return {
          canvasAssets: o.canvasAssets.some(
            (c) =>
              (c.role === "asset-library" || c.role === "character-lock") &&
              (c.localPath || c.dataUrl || c.source || c.id) === d &&
              c.category === i.category,
          )
            ? o.canvasAssets
            : [...o.canvasAssets, i],
        };
      }),
    setHistory: (i) => e({ history: i }),
    setWorkflowNodes: (i) => e({ workflowNodes: i }),
    setWorkflowEdges: (i) => e({ workflowEdges: i }),
    patchWorkflowNode: (i, o) =>
      e((d) => ({
        workflowNodes: d.workflowNodes.map((r) =>
          r.id === i ? { ...r, ...o } : r,
        ),
      })),
    updateNodeData: (i, o) =>
      e((d) => ({
        workflowNodes: d.workflowNodes.map((r) =>
          r.id === i ? { ...r, data: { ...r.data, ...o } } : r,
        ),
      })),
    createWorkflowNode: (i) => {
      const o = gn(i.kind),
        d = a().runtimeSettings.models,
        r =
          d.find((g) => {
            var b, y;
            return (
              g.enabled &&
              g.category === "image" &&
              ((b = g.baseUrl) == null ? void 0 : b.trim()) &&
              ((y = g.apiKey) == null ? void 0 : y.trim())
            );
          }) ?? d.find((g) => g.enabled && g.category === "image"),
        c = {
          id: o,
          type: i.kind,
          position: i.position,
          data: {
            label: i.label ?? hn(i.kind),
            kind: i.kind,
            status: "idle",
            description: vn(i.kind),
            modelId:
              i.kind === "generateImage" ? (r == null ? void 0 : r.id) : void 0,
            modelApiGroup:
              i.kind === "generateImage"
                ? r == null
                  ? void 0
                  : r.apiGroup
                : void 0,
            prompt: "",
            ...i.data,
          },
        };
      return (
        e((g) => ({
          workflowNodes: [...g.workflowNodes, c],
          selectedNodeId: o,
          promptBarNodeId:
            i.kind === "generateImage" || i.kind === "editImage"
              ? o
              : g.promptBarNodeId,
        })),
        c
      );
    },
    deleteWorkflowNode: (i) =>
      e((o) => ({
        selectedNodeId: o.selectedNodeId === i ? void 0 : o.selectedNodeId,
        promptBarNodeId: o.promptBarNodeId === i ? void 0 : o.promptBarNodeId,
        workflowNodes: o.workflowNodes.filter((d) => d.id !== i),
        workflowEdges: o.workflowEdges.filter(
          (d) => d.source !== i && d.target !== i,
        ),
      })),
    applyNodeChanges: (i) => {
      const o = i.filter((d) => d.type === "remove").map((d) => d.id);
      e((d) => ({
        workflowNodes: ka(i, d.workflowNodes),
        workflowEdges:
          o.length === 0
            ? d.workflowEdges
            : d.workflowEdges.filter(
                (r) => !o.includes(r.source) && !o.includes(r.target),
              ),
      }));
    },
    setGlobalApiSettings: (i) =>
      e((o) => ({
        runtimeSettings: Re({
          ...o.runtimeSettings,
          global: { ...o.runtimeSettings.global, ...i },
        }),
      })),
    updateModelOverride: (i, o) =>
      e((d) => ({
        runtimeSettings: {
          ...d.runtimeSettings,
          models: d.runtimeSettings.models.map((r) =>
            r.id === i ? { ...r, ...o } : r,
          ),
        },
      })),
    mergeRuntimeModelOverrides: (i) =>
      e((o) => {
        const d = new Map(o.runtimeSettings.models.map((c) => [c.id, c])),
          r = [...o.runtimeSettings.models];
        for (const c of i) {
          const g = d.get(c.id);
          if (g) {
            const b = {
                ...c,
                ...g,
                alias: c.alias,
                modelId: c.modelId,
                endpointModelId: c.endpointModelId,
                apiGroup: c.apiGroup,
                category: c.category,
                provider: c.provider,
                icon: c.icon,
                requestMode: c.requestMode,
                baseUrl: g.baseUrl ?? c.baseUrl,
              },
              y = r.findIndex((j) => j.id === c.id);
            y >= 0 && (r[y] = b);
          } else r.push(c);
        }
        return { runtimeSettings: Re({ ...o.runtimeSettings, models: r }) };
      }),
    replaceRuntimeProviderModels: (i) =>
      e((o) => {
        var j, x;
        const d = o.runtimeSettings.models.filter(
            (U) =>
              Ui(U) ||
              String(U.providerSource || "").startsWith("jiaren-channel:") ||
              U.id.startsWith("provider-channel-"),
          ),
          r = Te.models.filter((U) => !d.some((k) => k.id === U.id)),
          c = [],
          g = new Set();
        for (const U of i) {
          const k = ji(U),
            P = `${k.category}:${k.endpointModelId || k.modelId}:${k.baseUrl || ""}`;
          g.has(P) || (g.add(P), c.push(k));
        }
        const b =
            (j = c.find((U) => {
              var k;
              return (k = U.baseUrl) == null ? void 0 : k.trim();
            })) == null
              ? void 0
              : j.baseUrl,
          y =
            (x = c.find((U) => {
              var k;
              return (k = U.apiKey) == null ? void 0 : k.trim();
            })) == null
              ? void 0
              : x.apiKey;
        return {
          runtimeSettings: Re({
            ...o.runtimeSettings,
            global: {
              ...o.runtimeSettings.global,
              baseUrl: b ?? o.runtimeSettings.global.baseUrl,
              fallbackBaseUrl: b ?? o.runtimeSettings.global.fallbackBaseUrl,
              apiKey: y ?? o.runtimeSettings.global.apiKey,
              fallbackApiKey: y ?? o.runtimeSettings.global.fallbackApiKey,
            },
            models: [...r, ...d, ...Mt(c)],
          }),
        };
      }),
    setStorageSettings: (i) =>
      e((o) => ({ storageSettings: { ...o.storageSettings, ...i } })),
    setUiPreferences: (i) =>
      e((o) => ({ uiPreferences: { ...o.uiPreferences, ...i } })),
    hydratePreferences: (i) =>
      e((o) => {
        var d, r;
        return {
          runtimeSettings: i.runtimeSettings
            ? Re({
                ...o.runtimeSettings,
                ...i.runtimeSettings,
                global: {
                  ...o.runtimeSettings.global,
                  ...i.runtimeSettings.global,
                },
                models: mn(
                  i.runtimeSettings.models,
                  ((d = i.runtimeSettings.global) == null
                    ? void 0
                    : d.fallbackBaseUrl) ||
                    ((r = i.runtimeSettings.global) == null
                      ? void 0
                      : r.baseUrl),
                ),
              })
            : o.runtimeSettings,
          storageSettings: i.storageSettings
            ? { ...o.storageSettings, ...i.storageSettings }
            : o.storageSettings,
          uiPreferences: i.ui
            ? {
                ...o.uiPreferences,
                ...i.ui,
                themeMode: "light",
                historyOpen: !1,
                videoStudioOpen: !1,
                jiarenCanvasModeOpen: !1,
                jiarenCanvasAgentMode:
                  i.ui.jiarenCanvasAgentMode === "animation"
                    ? "animation"
                    : "magic",
                rongtuStudioOpen: !1,
                comfyWorkflowStudioOpen: !1,
                masterToolkitOpen: !1,
                aiDirectorOpen: !1,
                designAgentOpen: !1,
                resourceLibraryOpen: !1,
                promptLibraryOpen: !1,
                projectName: fn(i.ui.projectName),
              }
            : o.uiPreferences,
          history: i.history ?? o.history,
        };
      }),
    addHistoryItem: (i) =>
      e((o) => ({ history: [i, ...o.history].slice(0, 48) })),
    removeHistoryItem: (i) =>
      e((o) => ({ history: o.history.filter((d) => d.id !== i) })),
    setStats: (i) => e({ stats: i }),
  })),
  It = "comfly-gpt-image-2",
  yn = It,
  Ki = [
    { id: "auto", label: "自动", prompt: "" },
    { id: "front", label: "正面", prompt: "front view" },
    { id: "three-quarter", label: "45度", prompt: "three-quarter view" },
    { id: "side", label: "侧面", prompt: "side view" },
    { id: "top", label: "俯视", prompt: "top-down view" },
    { id: "low-angle", label: "仰视", prompt: "low-angle view" },
  ],
  Ri = [
    { id: "auto", label: "景别", prompt: "" },
    { id: "close-up", label: "特写", prompt: "close-up shot" },
    { id: "medium", label: "中景", prompt: "medium shot" },
    { id: "full-body", label: "全身", prompt: "full-body shot" },
    { id: "product-detail", label: "细节", prompt: "product detail shot" },
    { id: "wide", label: "远景", prompt: "wide establishing shot" },
  ];
function li(e, a) {
  var o, d;
  const i = [
    (o = Ki.find((r) => r.id === e)) == null ? void 0 : o.prompt,
    (d = Ri.find((r) => r.id === a)) == null ? void 0 : d.prompt,
  ].filter(Boolean);
  return i.length
    ? `Camera/framing control: ${i.join(", ")}. Use it only for composition and view angle; do not render camera UI, labels, diagrams or control marks.`
    : "";
}
const xn = "jiaren-jiaren-canvas-native",
  bn = [
    "1:1",
    "1:4",
    "4:1",
    "1:8",
    "8:1",
    "2:3",
    "3:2",
    "3:4",
    "4:3",
    "4:5",
    "5:4",
    "9:16",
    "16:9",
    "21:9",
  ],
  di = [
    { type: "hand", label: "移动画布", shortcut: "H" },
    { type: "selection", label: "选择", shortcut: "V" },
    { type: "rectangle", label: "矩形框选", shortcut: "R" },
    { type: "ellipse", label: "圆形", shortcut: "O" },
    { type: "arrow", label: "箭头", shortcut: "A" },
    { type: "line", label: "直线", shortcut: "L" },
    { type: "freedraw", label: "画笔标注", shortcut: "P" },
    { type: "text", label: "文字", shortcut: "T" },
    { type: "image", label: "添加图片", shortcut: "9" },
  ],
  wn =
    "你是 Jiaren AI 智能画布 Agent。请读取画布中的图片、箭头、矩形框、文字、选区截图，像创意总监、提示词工程师、风格大师和视频导演一样协作。输出中文，先给可执行计划，再给最终出图/编辑/视频提示词。",
  In = [
    { id: "script", name: "编剧 Agent", role: "故事、节奏、旁白", icon: Ua },
    { id: "character", name: "角色 Agent", role: "角色一致性", icon: yi },
    { id: "scene", name: "场景 Agent", role: "环境与资产", icon: xi },
    { id: "art", name: "美术 Agent", role: "风格、色彩、光影", icon: Na },
    { id: "storyboard", name: "分镜 Agent", role: "镜头与转场", icon: bi },
    { id: "sound", name: "声音 Agent", role: "配音与 BGM", icon: Ka },
  ];
function T(e) {
  return `${e}-${crypto.randomUUID().slice(0, 8)}`;
}
function it(e) {
  const a = e == null ? void 0 : e.match(/^data:([^;]+);/i);
  return (a == null ? void 0 : a[1]) ?? "image/png";
}
function Be(e) {
  return (
    (e == null ? void 0 : e.localPath) ??
    (e == null ? void 0 : e.url) ??
    (e == null ? void 0 : e.dataUrl)
  );
}
function kn(e, a) {
  const i = Math.max(1, e ?? 1024),
    o = Math.max(1, a ?? 768),
    c = Math.min(1, 1800 / i, 1800 / o);
  return { width: Math.round(i * c), height: Math.round(o * c) };
}
function ui(e) {
  return Math.max(0.1, Math.min(30, Number(e.toFixed(6))));
}
function pi(e, a) {
  var x;
  const i = e.width / 2 + e.offsetLeft,
    o = e.height / 2 + e.offsetTop,
    d = i - e.offsetLeft,
    r = o - e.offsetTop,
    c = Math.max(0.01, ((x = e.zoom) == null ? void 0 : x.value) ?? 1),
    g = e.scrollX + (d - d / c),
    b = e.scrollY + (r - r / c),
    y = -(d - d / a),
    j = -(r - r / a);
  return { scrollX: g + y, scrollY: b + j, zoom: { value: a } };
}
function Mn(e) {
  return e != null && e.startsWith("data:image/")
    ? new Promise((a) => {
        const i = new Image();
        (i.onload = () =>
          a({
            width: i.naturalWidth || i.width,
            height: i.naturalHeight || i.height,
          })),
          (i.onerror = () => a({})),
          (i.src = e);
      })
    : Promise.resolve({});
}
function Bi(e) {
  if (e.type === "text") return e.text;
  if ((e.type === "frame" || e.type === "magicframe") && e.name) return e.name;
}
function gt(e) {
  if (!e) return "画布为空。";
  const a = e.elements.filter((c) => !c.isDeleted),
    i = a.reduce((c, g) => ((c[g.type] = (c[g.type] ?? 0) + 1), c), {}),
    o = a.map(Bi).filter((c) => !!(c != null && c.trim())),
    d = a.filter((c) => c.type === "arrow"),
    r = a.filter(
      (c) =>
        c.type === "rectangle" || c.type === "frame" || c.type === "magicframe",
    );
  return [
    `Canvas ${xn}`,
    `元素统计: ${
      Object.entries(i)
        .map(([c, g]) => `${c}=${g}`)
        .join(", ") || "无"
    }`,
    `文字标注: ${o.join("；") || "无"}`,
    `箭头关系: ${d.length} 条，用于表示改图方向、因果或流程。`,
    `矩形/框选区域: ${r.length} 个，可作为局部编辑、抠图或生成区域。`,
  ].join(`
`);
}
function Ie(e) {
  if (!e) return [];
  const a = e.appState.selectedElementIds;
  return e.elements.filter((i) => a[i.id] && !i.isDeleted);
}
function jn(e) {
  return e
    ? he(e)
        .filter((a) => a.type === "image" && !!a.fileId)
        .map((a) => {
          const i = a.fileId ? e.files[a.fileId] : void 0;
          return {
            id: a.id,
            name: `选中图片 ${a.id.slice(0, 4)}`,
            dataUrl: i == null ? void 0 : i.dataURL,
            width: a.width,
            height: a.height,
          };
        })
        .filter((a) => !!a.dataUrl)
    : [];
}
function Pe(e) {
  return e.type === "image" && !!e.fileId;
}
function St(e) {
  return (
    e.type === "rectangle" || e.type === "frame" || e.type === "magicframe"
  );
}
function Pt(e) {
  return e.type === "freedraw";
}
function _e(e) {
  return St(e) || Pt(e);
}
function he(e) {
  if (!e) return [];
  const a = Ie(e),
    i = e.elements.filter((c) => !c.isDeleted),
    o = i.filter(Pe);
  if (a.length > 0) {
    const c = new Set(a.map((y) => y.id)),
      g = a.filter(_e),
      b = new Set(o.filter((y) => g.some((j) => de(y, j))).map((y) => y.id));
    return i.filter((y) => c.has(y.id) || b.has(y.id));
  }
  const d = [...i].reverse().find((c) => _e(c) && o.some((g) => de(g, c)));
  if (!d) return [];
  const r = o.find((c) => de(c, d));
  return r ? [d, r] : [d];
}
function mi(e) {
  const a = he(e);
  if (a.length === 0) return "";
  const i = [...a].sort((r, c) => {
      const g = r.y - c.y;
      return Math.abs(g) > 80 ? g : r.x - c.x;
    }),
    o = new Map(i.filter(Pe).map((r, c) => [r.id, c + 1]));
  return `画布空间关系: ${i
    .map((r) => {
      if (Pe(r)) return `图片${o.get(r.id) ?? ""}`;
      if (r.type === "text") {
        const c = r.text.trim().slice(0, 40);
        return c ? `文字"${c}"` : "文字";
      }
      return r.type === "arrow"
        ? "箭头"
        : St(r)
          ? "矩形/框选"
          : Pt(r)
            ? "画笔标注"
            : r.type;
    })
    .join(" -> ")}`;
}
function An(e) {
  if (!e) return [];
  const a = Ie(e);
  return a.length > 0 ? a : he(e).filter((i) => _e(i));
}
function $n(e) {
  const a = e.elements.filter((r) => !r.isDeleted),
    i = Object.entries(e.appState.selectedElementIds)
      .filter(([, r]) => r)
      .map(([r]) => r)
      .sort()
      .join(","),
    o = a.reduce((r, c) => ((r[c.type] = (r[c.type] ?? 0) + 1), r), {}),
    d = a.map(Bi).filter((r) => !!(r != null && r.trim()));
  return [
    a.length,
    Object.entries(o)
      .sort(([r], [c]) => r.localeCompare(c))
      .map(([r, c]) => `${r}:${c}`)
      .join("|"),
    i,
    d.join("|"),
    Object.keys(e.files).length,
  ].join("::");
}
function Cn(e) {
  var a;
  if ((a = e.dataUrl) != null && a.startsWith("data:"))
    return {
      id: e.id,
      dataURL: e.dataUrl,
      mimeType: it(e.dataUrl),
      created: Date.now(),
    };
}
function qi(e) {
  return {
    name: e.name,
    localPath: e.localPath ?? e.url,
    dataUrl: e.dataUrl,
    url: e.url,
    mimeType: it(e.dataUrl),
  };
}
function et(e) {
  if (e.length === 0) return;
  const a = Math.min(...e.map((r) => r.x)),
    i = Math.min(...e.map((r) => r.y)),
    o = Math.max(...e.map((r) => r.x + r.width)),
    d = Math.max(...e.map((r) => r.y + r.height));
  return { x: a, y: i, width: o - a, height: d - i };
}
async function ne(e, a = !1) {
  const i = he(e).filter((d) => (a ? d.type === "image" : !0));
  if (i.length === 0) return;
  const o = await Ia({
    elements: i,
    appState: {
      ...e.appState,
      selectedElementIds: Object.fromEntries(i.map((d) => [d.id, !0])),
      exportBackground: !1,
    },
    files: e.files,
    maxWidthOrHeight: 2048,
  });
  return {
    id: T("jiaren-selection"),
    name: "Jiaren AI 选区截图",
    dataUrl: o.toDataURL("image/png", 0.92),
    width: o.width,
    height: o.height,
  };
}
function de(e, a) {
  return (
    e.x < a.x + a.width &&
    e.x + e.width > a.x &&
    e.y < a.y + a.height &&
    e.y + e.height > a.y
  );
}
function zi(e) {
  return new Promise((a, i) => {
    const o = new Image();
    (o.crossOrigin = "anonymous"),
      (o.onload = () => a(o)),
      (o.onerror = () => i(new Error("图片加载失败，无法裁剪选区。"))),
      (o.src = e);
  });
}
async function Sn(e, a, i) {
  const o = e.fileId ? i[e.fileId] : void 0;
  if (!(o != null && o.dataURL))
    throw new Error("选中的图片没有可读取的文件数据。");
  const d = await zi(o.dataURL),
    r = d.naturalWidth || d.width,
    c = d.naturalHeight || d.height,
    g = Math.max(e.x, a.x),
    b = Math.max(e.y, a.y),
    y = Math.min(e.x + e.width, a.x + a.width),
    j = Math.min(e.y + e.height, a.y + a.height);
  if (y - g < 6 || j - b < 6)
    throw new Error("框选区域没有覆盖到图片，请先框住图片的一部分。");
  const x = Math.max(0, Math.round(((g - e.x) / e.width) * r)),
    U = Math.max(0, Math.round(((b - e.y) / e.height) * c)),
    k = Math.max(1, Math.min(r - x, Math.round(((y - g) / e.width) * r))),
    P = Math.max(1, Math.min(c - U, Math.round(((j - b) / e.height) * c))),
    E = document.createElement("canvas");
  (E.width = k), (E.height = P);
  const z = E.getContext("2d");
  if (!z) throw new Error("当前环境无法创建裁剪画布。");
  return (
    z.drawImage(d, x, U, k, P, 0, 0, k, P),
    {
      id: T("jiaren-canvas-crop"),
      name: "Jiaren AI 框选裁剪",
      dataUrl: E.toDataURL("image/png"),
      width: k,
      height: P,
    }
  );
}
async function Pn(e, a, i, o = []) {
  const d = e.fileId ? i[e.fileId] : void 0;
  if (!(d != null && d.dataURL) || (a.length === 0 && o.length === 0)) return;
  const r = await zi(d.dataURL),
    c = r.naturalWidth || r.width,
    g = r.naturalHeight || r.height,
    b = document.createElement("canvas");
  (b.width = c), (b.height = g);
  const y = b.getContext("2d");
  if (!y) return;
  (y.fillStyle = "rgba(255,255,255,1)"), y.fillRect(0, 0, c, g);
  for (const k of a) {
    const P = Math.max(e.x, k.x),
      E = Math.max(e.y, k.y),
      z = Math.min(e.x + e.width, k.x + k.width),
      X = Math.min(e.y + e.height, k.y + k.height);
    if (z - P < 6 || X - E < 6) continue;
    const L = Math.max(0, Math.round(((P - e.x) / e.width) * c)),
      C = Math.max(0, Math.round(((E - e.y) / e.height) * g)),
      te = Math.max(1, Math.min(c - L, Math.round(((z - P) / e.width) * c))),
      se = Math.max(1, Math.min(g - C, Math.round(((X - E) / e.height) * g)));
    y.clearRect(L, C, te, se);
  }
  const j = c / e.width,
    x = g / e.height,
    U = (j + x) / 2;
  y.save(),
    (y.globalCompositeOperation = "destination-out"),
    (y.lineCap = "round"),
    (y.lineJoin = "round");
  for (const k of o) {
    if (!de(e, k)) continue;
    const P = k.points;
    if (!(P != null && P.length)) continue;
    const E = Math.max(12, (k.strokeWidth ?? 6) * U * 2.6);
    if (
      ((y.lineWidth = E),
      y.beginPath(),
      P.forEach((z, X) => {
        const L = (k.x + z[0] - e.x) * j,
          C = (k.y + z[1] - e.y) * x;
        X === 0 ? y.moveTo(L, C) : y.lineTo(L, C);
      }),
      y.stroke(),
      P.length === 1)
    ) {
      const z = P[0],
        X = (k.x + z[0] - e.x) * j,
        L = (k.y + z[1] - e.y) * x;
      y.beginPath(), y.arc(X, L, E / 2, 0, Math.PI * 2), y.fill();
    }
  }
  return (
    y.restore(),
    {
      id: T("jiaren-canvas-mask"),
      name: "Jiaren AI 局部编辑遮罩",
      dataUrl: b.toDataURL("image/png"),
      width: c,
      height: g,
    }
  );
}
function Un(e) {
  if (!e) return;
  const a = Ie(e),
    i = et(a);
  if (!i) return;
  const o = e.appState.width || 1200,
    d = e.appState.height || 800,
    r = a.filter((k) => k.type === "image").length,
    c = o < 760,
    g = Math.min(c ? 360 : 720, Math.max(300, o - 24)),
    b = c ? 12 : 12 + g / 2,
    y = c ? Math.max(12, o - 12 - g) : Math.max(b, o - 12 - g / 2),
    j = wa({ sceneX: i.x + i.width / 2, sceneY: i.y }, e.appState),
    x = j.x - (e.appState.offsetLeft ?? 0),
    U = j.y - (e.appState.offsetTop ?? 0) - 46;
  return {
    left: Math.max(b, Math.min(y, c ? x - g / 2 : x)),
    top: Math.max(72, Math.min(d - 92, U)),
    anchor: c ? "left" : "center",
    selectedCount: a.length,
    selectedImageCount: r,
  };
}
function fe(e) {
  const a = new Set();
  return e.filter((i) => {
    const o =
      (i == null ? void 0 : i.localPath) ||
      (i == null ? void 0 : i.url) ||
      (i == null ? void 0 : i.dataUrl) ||
      (i == null ? void 0 : i.id);
    return !o || a.has(o) ? !1 : (a.add(o), !0);
  });
}
function Ce(e) {
  return (
    (e == null ? void 0 : e.dataUrl) ??
    (e == null ? void 0 : e.url) ??
    (e == null ? void 0 : e.localPath)
  );
}
function Nn(e) {
  return !!Ce(e);
}
function fi(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const a = e.tagName.toLowerCase();
  return (
    a === "input" || a === "textarea" || a === "select" || e.isContentEditable
  );
}
function Kn(e) {
  switch (e) {
    case "hand":
      return s.jsx(_a, { size: 16 });
    case "selection":
      return s.jsx(ti, { size: 16 });
    case "rectangle":
      return s.jsx(vi, { size: 16 });
    case "ellipse":
      return s.jsx(Ta, { size: 16 });
    case "arrow":
      return s.jsx(bt, { size: 16 });
    case "line":
      return s.jsx(hi, { size: 16 });
    case "freedraw":
      return s.jsx(za, { size: 16 });
    case "text":
      return s.jsx(qa, { size: 16 });
    case "image":
      return s.jsx(xt, { size: 16 });
    default:
      return s.jsx(ti, { size: 16 });
  }
}
function ht(e) {
  return e.filter(Nn).map(qi);
}
function qe(e) {
  return e.map(Ce).filter((a) => !!a);
}
function Rn(e, a) {
  if (!e) return "";
  const i = a.get(e.id);
  return (
    e.endpointModelId ||
    (i == null ? void 0 : i.endpointModelId) ||
    e.modelId ||
    (i == null ? void 0 : i.modelId) ||
    e.id
  );
}
function Bn(e, a) {
  return /gpt-image-(1\.5|2)-official/i.test(Rn(e, a));
}
function oe(e, a) {
  const i = e instanceof Error ? e.message : typeof e == "string" ? e : a;
  return /image_unsafe|unsafe|safety|安全策略|内容安全/i.test(i)
    ? `第三方 API 的安全策略拒绝了这次图片生成。图片已经正常上传并提交给模型，但参考图或提示词可能接近知名 IP、版权角色、敏感内容或过度复刻。请换成原创参考图，或把提示词改成“仅参考颜色/姿态，生成原创角色，不复刻现有 IP”。原始返回：${i}`
    : /quota is not enough|insufficient.*quota|余额不足|额度不足/i.test(i)
      ? "第三方 API 返回：账户额度不足。API 已连通，请更换有额度的 Key，或到对应平台处理额度。"
      : /401|403|api key|unauthorized|forbidden/i.test(i)
        ? `第三方 API 鉴权失败：${i}`
        : i || a;
}
function Ti(e) {
  return typeof e == "object" && e !== null;
}
function R(e, a = "") {
  return typeof e == "string" && e.trim() ? e.trim() : a;
}
function gi(e, a) {
  return typeof e == "number" && Number.isFinite(e) ? e : a;
}
function vt(e, a) {
  return Array.isArray(e) ? e.filter(Ti).map(a) : [];
}
function qn(e, a) {
  if (!Ti(e)) return a;
  const i = vt(e.characters, (r, c) => ({
      id: R(r.id, `character-${c + 1}`),
      name: R(r.name, `角色 ${c + 1}`),
      role: R(r.role, "主要角色"),
      appearance: R(r.appearance, "保持画布参考图的外观特征，适合动画短片。"),
      continuityPrompt: R(
        r.continuityPrompt,
        R(r.appearance, "同一角色在所有镜头中保持脸型、服装、颜色和比例一致。"),
      ),
    })).slice(0, 6),
    o = vt(e.scenes, (r, c) => ({
      id: R(r.id, `scene-${c + 1}`),
      name: R(r.name, `场景 ${c + 1}`),
      environment: R(r.environment, "根据画布内容延展的动画场景。"),
      mood: R(r.mood, "清晰、连贯、有叙事感"),
      visualPrompt: R(
        r.visualPrompt,
        "clean animation background, layered scene design, consistent lighting",
      ),
    })).slice(0, 6),
    d = vt(e.shots, (r, c) => {
      var g;
      return {
        id: R(r.id, `shot-${c + 1}`),
        title: R(r.title, `镜头 ${c + 1}`),
        scene: R(
          r.scene,
          ((g = o[c % Math.max(1, o.length)]) == null ? void 0 : g.name) ??
            "主场景",
        ),
        characters: Array.isArray(r.characters)
          ? r.characters
              .map((b) => String(b))
              .filter(Boolean)
              .slice(0, 4)
          : [],
        action: R(r.action, "角色完成一个清晰动作，推动剧情。"),
        camera: R(r.camera, "中景"),
        motion: R(r.motion, "缓慢推进"),
        lighting: R(r.lighting, "柔和电影光"),
        duration: Math.max(2, Math.min(12, gi(r.duration, 4))),
        imagePrompt: R(
          r.imagePrompt,
          "animation keyframe, clean composition, consistent character design",
        ),
        videoPrompt: R(
          r.videoPrompt,
          "smooth animation shot, stable character, cinematic camera movement",
        ),
        dialogue: R(r.dialogue, ""),
      };
    }).slice(0, 12);
  return {
    id: R(e.id, a.id),
    title: R(e.title, a.title),
    logline: R(e.logline, a.logline),
    style: R(e.style, a.style),
    aspectRatio: R(e.aspectRatio, a.aspectRatio),
    duration: Math.max(6, Math.min(180, gi(e.duration, a.duration))),
    characters: i.length ? i : a.characters,
    scenes: o.length ? o : a.scenes,
    shots: d.length ? d : a.shots,
    negativePrompt: R(e.negativePrompt, a.negativePrompt),
    bgmPrompt: R(e.bgmPrompt, a.bgmPrompt),
  };
}
function zn(e) {
  var r;
  const i =
      ((r = e.match(/```(?:json)?\s*([\s\S]*?)```/i)) == null
        ? void 0
        : r[1]) ?? e,
    o = i.indexOf("{"),
    d = i.lastIndexOf("}");
  if (!(o < 0 || d <= o))
    try {
      return JSON.parse(i.slice(o, d + 1));
    } catch {
      return;
    }
}
function Tn(e, a, i) {
  const o = a.trim() || "根据当前画布内容生成一支 15 秒动画短片",
    d = e.replace(/\s+/g, " ").slice(0, 380),
    r = {
      id: "character-1",
      name: "主角",
      role: "故事核心角色",
      appearance:
        "参考画布中的主体形象，保持颜色、比例、服装和标志性细节一致，动画风格干净可控。",
      continuityPrompt:
        "same character identity across all shots, consistent face, costume, color palette, body proportions, no extra text",
    },
    c = {
      id: "scene-1",
      name: "主场景",
      environment: d || "根据画布参考图建立一个简洁、层次清晰的动画场景。",
      mood: "明快、有节奏、适合短视频",
      visualPrompt:
        "clean animation background, readable silhouette, layered depth, consistent color palette, polished lighting",
    },
    b = [
      [
        "建立场景",
        "主角出现在画面核心位置，环境关系交代清楚。",
        "wide establishing shot",
        "slow push in",
      ],
      [
        "动作推进",
        "主角执行核心动作，镜头保持主体稳定。",
        "medium shot",
        "gentle tracking",
      ],
      [
        "情绪特写",
        "突出表情、道具或关键细节，强化记忆点。",
        "close-up",
        "subtle handheld micro movement",
      ],
      [
        "结果定格",
        "动作完成，画面形成清楚的结尾姿态。",
        "hero shot",
        "slow pull back",
      ],
    ].map(([y, j, x, U], k) => ({
      id: `shot-${k + 1}`,
      title: y,
      scene: c.name,
      characters: [r.name],
      action: j,
      camera: x,
      motion: U,
      lighting: "soft cinematic lighting, stable exposure",
      duration: k === 0 ? 4 : 3,
      imagePrompt: [
        `${y}, ${j}`,
        r.continuityPrompt,
        c.visualPrompt,
        `${x}, ${i}, no text, no watermark, no UI`,
      ].join(", "),
      videoPrompt: [
        `${y}: ${j}`,
        `camera: ${x}, movement: ${U}`,
        "smooth animation, stable character identity, coherent motion, no morphing, no flicker, no text",
      ].join(`
`),
      dialogue: k === 2 ? "可选旁白：把关键情绪说清楚，保持短句。" : "",
    }));
  return {
    id: `animation-${Date.now()}`,
    title: o.length > 28 ? `${o.slice(0, 28)}...` : o,
    logline: `围绕“${o}”生成一条由角色、场景和镜头卡片组成的动画方案。`,
    style: "动画短片 / 分镜驱动 / 角色一致性优先",
    aspectRatio: i,
    duration: b.reduce((y, j) => y + j.duration, 0),
    characters: [r],
    scenes: [c],
    shots: b,
    negativePrompt:
      "no text, no watermark, no logo, no UI, no duplicated character, no deformed hands, no flicker, no identity drift",
    bgmPrompt: "轻快但不抢戏的动画短片配乐，节奏跟随镜头动作变化。",
  };
}
function yt(e) {
  return [
    `动画项目: ${e.title}`,
    `一句话故事: ${e.logline}`,
    `风格: ${e.style}`,
    `比例/总时长: ${e.aspectRatio} / 约 ${e.duration} 秒`,
    "",
    "角色:",
    ...e.characters.map(
      (a, i) => `${i + 1}. ${a.name} - ${a.role}；${a.appearance}`,
    ),
    "",
    "场景:",
    ...e.scenes.map(
      (a, i) => `${i + 1}. ${a.name} - ${a.environment}；情绪: ${a.mood}`,
    ),
    "",
    "分镜:",
    ...e.shots.map((a, i) =>
      [
        `${i + 1}. ${a.title} (${a.duration}s)`,
        `动作: ${a.action}`,
        `镜头: ${a.camera} / ${a.motion} / ${a.lighting}`,
        `图片提示词: ${a.imagePrompt}`,
        `视频提示词: ${a.videoPrompt}`,
      ].join(`
`),
    ),
    "",
    `负面约束: ${e.negativePrompt}`,
    `BGM: ${e.bgmPrompt}`,
  ].join(`
`);
}
function ze(e, a) {
  return [
    "1. 创意总监: 先锁定画布主体、框选区域、箭头指向和文字要求。",
    "2. 提示词工程师: 把选区截图和图片引用转成可执行的生成/编辑提示词。",
    "3. 风格大师: 统一光影、材质、构图、色彩和画面风格，避免主体漂移。",
    "4. 视频导演: 如果用户要视频，补齐镜头运动、时长、比例和首帧关系。",
    "",
    `用户意图: ${a || "按当前 Jiaren AI 智能画布生成方案"}`,
    "画布上下文:",
    e,
  ].join(`
`);
}
function _n(jiarenCanvasProps) {
  const e = ee((t) => t.runtimeSettings),
    a = ee((t) => t.storageSettings);
  ee((t) => t.addCanvasAsset);
  const i = ee((t) => t.addHistoryItem),
    o = ee((t) => t.createWorkflowNode),
    d = ee((t) => t.setWorkflowEdges),
    r = ee((t) => t.setPromptBarNode),
    c = ee((t) => t.setSelectedNode),
    g = ee((t) => t.setUiPreferences),
    b = ee((t) => t.uiPreferences),
    y = w.useRef(null),
    jiarenThemeApi = w.useRef(null),
    j = w.useRef(null),
    x = w.useRef(),
    U = w.useRef(""),
    k = w.useRef(""),
    P = w.useRef(),
    E = w.useRef(),
    [z, X] = w.useState({
      contextText: "画布为空。",
      selectedCount: 0,
      selectedImageCount: 0,
    }),
    [L, C] = w.useState([]),
    [te, se] = w.useState(""),
    [W, Q] = w.useState(""),
    [V] = w.useState("magic"),
    [A, ve] = w.useState(),
    [B, G] = w.useState(),
    [Ee, M] = w.useState(""),
    [re, Me] = w.useState([]),
    [ce, ot] = w.useState(),
    [_i, Ei] = w.useState(!1),
    [O, Ut] = w.useState("16:9"),
    [De, st] = w.useState(!1),
    [le, Nt] = w.useState("2K"),
    [ye, Kt] = w.useState("Auto"),
    [rt, Di] = w.useState(1),
    [ct, Li] = w.useState("auto"),
    [lt, Gi] = w.useState("auto"),
    [xe, Rt] = w.useState(It),
    [Ue, Bt] = w.useState(),
    [Oi, qt] = w.useState("selection"),
    [En, zt] = w.useState(100),
    J = w.useMemo(() => cn(e), [e]),
    be = w.useMemo(() => new Map(rn().map((t) => [t.id, t])), []),
    dt = w.useMemo(
      () =>
        e.models.filter((t) => {
          var n;
          return (
            t.enabled &&
            t.category === "image" &&
            (t.apiGroup === "a2" ||
              ((n = be.get(t.id)) == null ? void 0 : n.apiGroup) === "a2")
          );
        }),
      [be, e.models],
    ),
    Ji = w.useMemo(
      () =>
        e.models.filter((t) => {
          var n;
          return (
            t.enabled &&
            t.category === "video" &&
            (t.apiGroup === "a2" ||
              ((n = be.get(t.id)) == null ? void 0 : n.apiGroup) === "a2")
          );
        }),
      [be, e.models],
    ),
    I = w.useMemo(
      () =>
        Ze(e, "image", { preferredId: xe, preferredApiGroup: "a2" }) ??
        Ze(e, "image", { preferredId: It, preferredApiGroup: "a2" }),
      [e, xe],
    ),
    Fi = w.useMemo(
      () => I ?? Ze(e, "image", { preferredId: yn, preferredApiGroup: "a2" }),
      [I, e],
    ),
    $ = w.useMemo(
      () => Ze(e, "video", { preferredId: Ue, preferredApiGroup: "a2" }),
      [e, Ue],
    ),
    H = w.useMemo(
      () => Qe((I == null ? void 0 : I.id) ?? xe),
      [I == null ? void 0 : I.id, xe],
    );
  w.useMemo(
    () =>
      e.models.find(
        (t) => t.category === "tools" && t.modelId === "background-removal",
      ),
    [e.models],
  );
  const Le = z.contextText,
    Vi = I ? Ge(I) : "未配置图片模型",
    Wi = z.selectedCount ? `${z.selectedCount} 个选中元素` : "未选中元素",
    Hi =
      B === "animation"
        ? "动画 Agent 正在规划..."
        : B === "video"
          ? "智能视频正在生成..."
          : B === "magic" || B === "image"
            ? "智能生图正在生成..."
            : V === "animation"
              ? "Animation Agent"
              : "Jiaren Agent",
    Yi =
      V === "animation"
        ? "动画 Agent 工作台"
        : L.length
          ? "Jiaren AI 正在理解画布"
          : "你好，Jiaren!",
    Xi =
      V === "animation"
        ? "把画布参考图、文字和箭头整理为角色、场景、分镜和视频提示词。"
        : L.length
          ? "图片、框选、箭头和文字会作为生成上下文。"
          : "今天想创作什么？",
    Qi = W
      ? W.length > 180
        ? `${W.slice(0, 180)}...`
        : W
      : "选中图片、矩形框、画笔、箭头或文字后，Jiaren AI 会把画布内容作为图片上下文，用你选择的模型生成、局部编辑、抠图或做视频。";
  function Ge(t) {
    const n = be.get(t.id),
      l =
        t.endpointModelId ||
        (n == null ? void 0 : n.endpointModelId) ||
        t.modelId ||
        (n == null ? void 0 : n.modelId) ||
        t.id,
      u = t.alias || (n == null ? void 0 : n.alias) || l,
      m = [t.id, t.modelId, t.endpointModelId, l, u].filter(Boolean).join(" ");
    return /pixverse[-_\s]?v?6|pix[-_\s]?verse[-_\s]?v?6|\bv6\b/i.test(m)
      ? "PixVerse V6"
      : /pixverse|pix[-_\s]?verse|\bv4\b/i.test(m)
        ? "PixVerse V4 简单版"
        : u;
  }
  function Tt(t) {
    const n = be.get(t.id),
      l =
        t.endpointModelId ||
        (n == null ? void 0 : n.endpointModelId) ||
        t.modelId ||
        (n == null ? void 0 : n.modelId) ||
        t.id;
    return `${Ge(t)} / API 原名: ${l}`;
  }
  w.useEffect(() => {
    !dt.some((t) => t.id === xe) && I != null && I.id && Rt(I.id);
  }, [dt, I == null ? void 0 : I.id, xe]),
    w.useEffect(() => {
      !Ue && $ != null && $.id && Bt($.id);
    }, [Ue, $ == null ? void 0 : $.id]),
    w.useEffect(() => {
      H.resolutions.includes(le) ||
        Nt(H.resolutions.includes("2K") ? "2K" : (H.resolutions[0] ?? "Auto")),
        H.aspectRatios.includes(O) ||
          Ut(
            H.aspectRatios.includes("16:9")
              ? "16:9"
              : (H.aspectRatios[0] ?? "1:1"),
          ),
        H.qualities.includes(ye) || Kt(H.qualities[0] ?? "Auto");
    }, [O, H, ye, le]),
    w.useCallback(() => Ie(x.current), []);
  const Zi = w.useCallback(() => jn(x.current), []);
  w.useEffect(() => {
    if (!Ee) return;
    const t = window.setTimeout(() => M(""), 4800);
    return () => window.clearTimeout(t);
  }, [Ee]),
    w.useEffect(() => {
      if (!De) return;
      const t = () => st(!1);
      return (
        window.addEventListener("pointerdown", t),
        window.addEventListener("keydown", t),
        () => {
          window.removeEventListener("pointerdown", t),
            window.removeEventListener("keydown", t);
        }
      );
    }, [De]),
    w.useEffect(
      () => () => {
        P.current !== void 0 && window.cancelAnimationFrame(P.current);
      },
      [],
    );
  const ut = w.useCallback((t) => {
      const n = y.current;
      if (t === "image") {
        Ot();
        return;
      }
      n == null || n.setActiveTool({ type: t }), qt(t);
    }, []),
    je = w.useCallback(() => {
      window.requestAnimationFrame(() => {
        var n, l, u;
        const t =
          ((l = (n = y.current) == null ? void 0 : n.getAppState().zoom) == null
            ? void 0
            : l.value) ?? 1;
        zt(Math.round(t * 100)), (u = y.current) == null || u.refresh();
      });
    }, []),
    Oe = w.useCallback(
      (t) => {
        var u;
        const n =
            t === "in"
              ? ".zoom-in-button"
              : t === "out"
                ? ".zoom-out-button"
                : ".reset-zoom-button",
          l = (u = j.current) == null ? void 0 : u.querySelector(n);
        return !l || l.disabled ? !1 : (l.click(), je(), !0);
      },
      [je],
    );
  w.useCallback(
    (t) => {
      var v;
      const n = y.current;
      if (!n || Oe(t > 0 ? "in" : "out")) return;
      const l = n.getAppState(),
        u = ((v = l.zoom) == null ? void 0 : v.value) ?? 1,
        m = ui(u + t / 100);
      n.updateScene({ appState: pi(l, m), captureUpdate: $e.EVENTUALLY }), je();
    },
    [je, Oe],
  ),
    w.useCallback(
      (t) => {
        const n = y.current;
        if (!n || (t === 100 && Oe("reset"))) return;
        const l = n.getAppState(),
          u = ui(t / 100);
        n.updateScene({ appState: pi(l, u), captureUpdate: $e.EVENTUALLY }),
          je();
      },
      [je, Oe],
    ),
    w.useCallback(() => {
      var t;
      (t = y.current) == null ||
        t.scrollToContent(void 0, { fitToContent: !0, animate: !0 });
    }, []);
  const ea = w.useCallback((t) => {
      fi(t.target) || (!t.ctrlKey && t.metaKey);
    }, []),
    _t = w.useCallback(async () => {
      var n;
      const t = await ((n = window.jiaren) == null
        ? void 0
        : n.system.windowCommand("toggleMaximize"));
      Ei(!!(t != null && t.isMaximized));
    }, []),
    ta = w.useCallback((t) => {
      var u;
      if (t.button !== 2) return;
      const n = t.target instanceof HTMLElement ? t.target : void 0;
      if (
        n != null &&
        n.closest(
          "button, input, textarea, select, .jiaren-canvas-tool-menu, .jiaren-canvas-view-menu, .jiaren-canvas-selection-toolbar",
        )
      )
        return;
      const l = (u = x.current) == null ? void 0 : u.appState;
      (E.current = {
        pointerId: t.pointerId,
        x: t.clientX,
        y: t.clientY,
        scrollX: (l == null ? void 0 : l.scrollX) ?? 0,
        scrollY: (l == null ? void 0 : l.scrollY) ?? 0,
      }),
        t.currentTarget.setPointerCapture(t.pointerId),
        t.preventDefault();
    }, []),
    ia = w.useCallback((t) => {
      var l;
      const n = E.current;
      !n ||
        n.pointerId !== t.pointerId ||
        ((l = y.current) == null ||
          l.updateScene({
            appState: {
              scrollX: n.scrollX + t.clientX - n.x,
              scrollY: n.scrollY + t.clientY - n.y,
            },
            captureUpdate: $e.EVENTUALLY,
          }),
        t.preventDefault());
    }, []),
    Et = w.useCallback((t) => {
      var n;
      ((n = E.current) == null ? void 0 : n.pointerId) === t.pointerId &&
        (E.current = void 0);
    }, []);
  w.useEffect(() => {
    const t = (n) => {
      var m;
      if (fi(n.target)) return;
      const l = n.key.toLowerCase();
      if ((n.ctrlKey || n.metaKey) && l === "enter") {
        n.preventDefault(), Jt();
        return;
      }
      if ((n.ctrlKey || n.metaKey) && l === "b") {
        n.preventDefault(), Ft();
        return;
      }
      if (
        ((n.ctrlKey || n.metaKey) && (l === "=" || l === "+")) ||
        ((n.ctrlKey || n.metaKey) && (l === "-" || l === "_")) ||
        ((n.ctrlKey || n.metaKey) && l === "0") ||
        n.ctrlKey ||
        n.metaKey ||
        n.altKey
      )
        return;
      const u =
        (m = di.find((v) => v.shortcut.toLowerCase() === l)) == null
          ? void 0
          : m.type;
      u && (n.preventDefault(), ut(u));
    };
    return (
      window.addEventListener("keydown", t),
      () => window.removeEventListener("keydown", t)
    );
  }, [ut]);
  const aa = w.useCallback((t, n, l) => {
    var p, f;
    const u = { elements: t, appState: n, files: l };
    (x.current = u),
      qt(n.activeTool.type),
      zt(Math.round((((p = n.zoom) == null ? void 0 : p.value) ?? 1) * 100));
    const m = [
      Object.entries(n.selectedElementIds)
        .filter(([, h]) => h)
        .map(([h]) => h)
        .sort()
        .join(","),
      n.scrollX,
      n.scrollY,
      (f = n.zoom) == null ? void 0 : f.value,
      n.width,
      n.height,
      t.length,
    ].join("::");
    m !== k.current && ((k.current = m), ot(Un(u)));
    const v = $n(u);
    v !== U.current &&
      ((U.current = v),
      P.current !== void 0 && window.cancelAnimationFrame(P.current),
      (P.current = window.requestAnimationFrame(() => {
        P.current = void 0;
        const h = x.current,
          N = he(h);
        X({
          contextText: gt(h),
          selectedCount: N.length,
          selectedImageCount: N.filter((q) => q.type === "image").length,
        });
      })));
  }, []);
  async function na(t) {
    var u, m, v;
    if ((u = t.dataUrl) != null && u.startsWith("data:image/")) return t;
    const n = t.localPath ?? t.url;
    if (!n) return;
    const l = await ((m = window.jiaren) == null
      ? void 0
      : m.system.saveAsset({
          source: n,
          directory: a.cacheDir,
          fileName: `${t.id || T("jiaren-result")}.png`,
        }));
    if (
      (v = l == null ? void 0 : l.dataUrl) != null &&
      v.startsWith("data:image/")
    )
      return {
        ...t,
        dataUrl: l.dataUrl,
        localPath: l.path ?? t.localPath,
        width: t.width ?? l.width,
        height: t.height ?? l.height,
      };
  }
  async function Je(t, n) {
    const l = (await Promise.all(t.map((u) => na(u)))).filter((u) => !!u);
    return Gt(l, n), l.length;
  }
  function pt(t = H) {
    return t.sizeMode === "dimensions" ? le : `${le} ${O}`;
  }
  function Dt(t, n = "Jiaren AI 图片预览") {
    const l = Ce(t);
    l &&
      window.dispatchEvent(
        new CustomEvent("jiaren-open-image-preview", {
          detail: {
            source: l,
            localPath: t == null ? void 0 : t.localPath,
            title: (t == null ? void 0 : t.name) || n,
            subtitle:
              t != null && t.width && t != null && t.height
                ? `${Math.round(t.width)} x ${Math.round(t.height)}`
                : void 0,
          },
        }),
      );
  }
  function Lt() {
    const t = x.current;
    if (!t) return;
    const n = Ie(t).find(Pe);
    if (!(n != null && n.fileId)) return;
    const l = t.files[n.fileId];
    l != null &&
      l.dataURL &&
      Dt({
        id: n.id,
        name: `画布图片 ${n.id.slice(0, 4)}`,
        dataUrl: l.dataURL,
        width: n.width,
        height: n.height,
      });
  }
  const Gt = w.useCallback((t, n) => {
    const l = y.current;
    if (!l || t.length === 0) return;
    const u = t.filter((q) => {
      var K;
      return (K = q.dataUrl) == null ? void 0 : K.startsWith("data:image/");
    });
    if (u.length === 0) return;
    const m = l.getSceneElements(),
      v = et(m),
      p = (n == null ? void 0 : n.x) ?? (v ? v.x + v.width + 80 : 120),
      f = (n == null ? void 0 : n.y) ?? (v ? v.y : 120),
      h = u.map(Cn).filter((q) => !!q);
    l.addFiles(h);
    const N = Xt(
      u.map((q, K) => {
        const S = kn(q.width, q.height);
        return {
          type: "image",
          fileId: q.id,
          x: p + K * 36,
          y: f + K * 36,
          width: S.width,
          height: S.height,
          status: "saved",
        };
      }),
      { regenerateIds: !1 },
    );
    l.updateScene({
      elements: [...m, ...N],
      appState:
        n != null && n.select
          ? { selectedElementIds: Object.fromEntries(N.map((q) => [q.id, !0])) }
          : void 0,
      captureUpdate: $e.IMMEDIATELY,
    });
  }, []);
  function oa(t = A) {
    const n = y.current;
    if (!n || !t) {
      M("请先生成动画 Agent 方案。");
      return;
    }
    const l = n.getSceneElements(),
      u = et(l),
      m = u ? u.x + u.width + 96 : 120,
      v = u ? u.y : 120,
      p = 320,
      f = 210,
      h = 26,
      N = [
        `动画 Agent: ${t.title}`,
        t.logline,
        `${t.style} / ${t.aspectRatio} / ${t.duration}s`,
        `BGM: ${t.bgmPrompt}`,
        `负面约束: ${t.negativePrompt}`,
      ].join(`
`),
      q = [
        {
          type: "rectangle",
          x: m,
          y: v,
          width: 690,
          height: 170,
          strokeColor: "#14532d",
          backgroundColor: "#dcfce7",
          fillStyle: "solid",
          roundness: { type: 3 },
        },
        {
          type: "text",
          x: m + 18,
          y: v + 16,
          width: 650,
          height: 132,
          text: N,
          fontSize: 18,
          strokeColor: "#052e16",
          backgroundColor: "transparent",
        },
        ...t.characters.flatMap((S, D) => {
          const Y = m + D * 350,
            ie = v + 205;
          return [
            {
              type: "rectangle",
              x: Y,
              y: ie,
              width: 326,
              height: 150,
              strokeColor: "#1d4ed8",
              backgroundColor: "#dbeafe",
              fillStyle: "solid",
              roundness: { type: 3 },
            },
            {
              type: "text",
              x: Y + 14,
              y: ie + 12,
              width: 296,
              height: 116,
              text: `角色: ${S.name}
${S.role}
${S.appearance}
一致性: ${S.continuityPrompt}`,
              fontSize: 15,
              strokeColor: "#172554",
              backgroundColor: "transparent",
            },
          ];
        }),
        ...t.scenes.flatMap((S, D) => {
          const Y = m + D * 350,
            ie = v + 380;
          return [
            {
              type: "rectangle",
              x: Y,
              y: ie,
              width: 326,
              height: 150,
              strokeColor: "#7c2d12",
              backgroundColor: "#ffedd5",
              fillStyle: "solid",
              roundness: { type: 3 },
            },
            {
              type: "text",
              x: Y + 14,
              y: ie + 12,
              width: 296,
              height: 116,
              text: `场景: ${S.name}
${S.environment}
情绪: ${S.mood}
${S.visualPrompt}`,
              fontSize: 15,
              strokeColor: "#431407",
              backgroundColor: "transparent",
            },
          ];
        }),
        ...t.shots.flatMap((S, D) => {
          const Y = D % 2,
            ie = Math.floor(D / 2),
            Ne = m + Y * (p + h),
            Ke = v + 570 + ie * (f + h);
          return [
            {
              type: "rectangle",
              x: Ne,
              y: Ke,
              width: p,
              height: f,
              strokeColor: "#334155",
              backgroundColor: D % 2 === 0 ? "#f8fafc" : "#f1f5f9",
              fillStyle: "solid",
              roundness: { type: 3 },
            },
            {
              type: "text",
              x: Ne + 14,
              y: Ke + 12,
              width: p - 28,
              height: f - 24,
              text: `${D + 1}. ${S.title} / ${S.duration}s
场景: ${S.scene}
动作: ${S.action}
镜头: ${S.camera} / ${S.motion}
图: ${S.imagePrompt}
视频: ${S.videoPrompt}`,
              fontSize: 14,
              strokeColor: "#0f172a",
              backgroundColor: "transparent",
            },
          ];
        }),
      ],
      K = Xt(q, { regenerateIds: !0 });
    n.updateScene({
      elements: [...l, ...K],
      appState: {
        selectedElementIds: Object.fromEntries(K.map((S) => [S.id, !0])),
      },
      captureUpdate: $e.IMMEDIATELY,
    }),
      M(`已把 ${t.shots.length} 个动画分镜卡贴到二级 AI 画布。`);
  }
  async function Ot() {
    var l;
    const t = await ((l = window.jiaren) == null
      ? void 0
      : l.system.selectFiles({ kind: "image", cacheDir: a.cacheDir }));
    if (!t || t.canceled) return;
    const n = await Promise.all(
      t.assets
        .filter((u) => u.kind === "image" && (u.dataUrl || u.localPath))
        .map(async (u) => {
          const m =
            u.width && u.height
              ? { width: u.width, height: u.height }
              : await Mn(u.dataUrl);
          return {
            id: u.id || T("file"),
            name: u.name,
            dataUrl: u.dataUrl,
            localPath: u.localPath,
            width: m.width,
            height: m.height,
          };
        }),
    );
    Gt(n, { select: !0 }),
      M(
        n.length
          ? "图片已加入 Jiaren AI 智能画布，可直接拖动、缩放、框选和连箭头。"
          : "没有读取到图片。",
      );
  }
  function sa() {
    var t;
    (t = y.current) == null || t.resetScene(),
      C([]),
      Me([]),
      Q(""),
      ve(void 0),
      M("Jiaren AI 智能画布已清空。");
  }
  function ra() {
    C([]),
      Me([]),
      Q(""),
      ve(void 0),
      se(""),
      M("已开启新的 Jiaren AI 对话，画布内容保留。");
  }
  function ca() {
    const t = y.current,
      n = x.current;
    if (!t || !n) return;
    const l = new Set(An(n).map((m) => m.id));
    if (l.size === 0) return;
    const u = n.elements.map((m) =>
      l.has(m.id) ? { ...m, isDeleted: !0 } : m,
    );
    t.updateScene({
      elements: u,
      appState: { selectedElementIds: {} },
      captureUpdate: $e.IMMEDIATELY,
    }),
      ot(void 0);
  }
  async function Jt() {
    var m;
    const t = x.current;
    if (!t) return;
    const n = await ne(t),
      l = Zi(),
      u = n ? [n, ...l] : l;
    if (u.length === 0) {
      M("请先在 Jiaren AI 智能画布里选中图片、框、箭头或文字。");
      return;
    }
    Me((v) => [...v, ...u]),
      M("已把选区加入右侧 Agent 上下文。"),
      (m = y.current) == null ||
        m.updateScene({ appState: { selectedElementIds: {} } }),
      ot(void 0);
  }
  async function Fe() {
    const t = x.current,
      n = [...re];
    if (he(t).length > 0 && t) {
      const p = await ne(t);
      p && n.unshift(p);
    }
    const l =
        te.trim() || "请根据当前 Jiaren AI 智能画布自动规划并生成可执行方案。",
      u = { id: T("msg"), role: "user", text: l, images: n };
    C((p) => [...p, u]), se(""), Me([]);
    const m = [Le, n.length ? `附加选区图片: ${n.length} 张。` : ""].filter(
      Boolean,
    ).join(`
`);
    if (!J) {
      const p = ze(m, l);
      return (
        Q(p), C((f) => [...f, { id: T("msg"), role: "assistant", text: p }]), p
      );
    }
    const v = ge(e, J.id);
    if (!v.apiKey.trim() || !v.baseUrl.trim()) {
      const p = ze(m, l);
      return (
        Q(p),
        C((f) => [...f, { id: T("msg"), role: "assistant", text: p }]),
        M("对话模型 API 未配置完整，先生成本地 Jiaren AI 计划。"),
        p
      );
    }
    G("chat");
    try {
      const p = await pe.chat({
          modelId: J.id,
          endpointModelId: J.endpointModelId,
          fallbackEndpointModelId: J.fallbackEndpointModelId,
          requestMode: J.requestMode,
          apiGroup: J.apiGroup,
          baseUrl: v.baseUrl,
          apiKey: v.apiKey,
          fallbackBaseUrl: v.fallbackBaseUrl,
          fallbackApiKey: v.fallbackApiKey,
          messages: [
            { role: "system", content: wn },
            {
              role: "user",
              content: [
                l,
                "",
                "Jiaren AI 智能画布上下文:",
                m,
                "",
                n.length
                  ? "注意：用户已把选区截图/参考图片作为图像上下文加入本轮。"
                  : "",
              ].join(`
`),
            },
          ],
        }),
        f = p.content || p.message || ze(m, l);
      return (
        Q(f),
        C((h) => [...h, { id: p.id || T("msg"), role: "assistant", text: f }]),
        f
      );
    } catch (p) {
      const f = ze(m, l);
      return (
        Q(f),
        C((h) => [
          ...h,
          {
            id: T("msg"),
            role: "assistant",
            text:
              p instanceof Error
                ? p.message
                : "Agent 调用失败，已保留本地计划。",
            status: "failed",
          },
          { id: T("msg"), role: "assistant", text: f },
        ]),
        f
      );
    } finally {
      G(void 0);
    }
  }
  async function Ve() {
    const t = x.current;
    let n;
    try {
      n = t ? await ne(t, !0) : void 0;
    } catch {
      n = void 0;
    }
    const l = fe([...(t ? we(t) : []), ...re, n]).slice(0, 8),
      u = te.trim() || "根据当前画布内容生成一支动画短片方案。",
      m = [
        t ? gt(t) : Le,
        mi(t),
        l.length ? `参考图片数量: ${l.length}` : "",
      ].filter(Boolean).join(`
`),
      v = Tn(m, u, O);
    G("animation"),
      C((p) => [...p, { id: T("msg"), role: "user", text: u, images: l }]),
      se(""),
      Me([]);
    try {
      let p = v;
      if (J) {
        const h = ge(e, J.id);
        if (h.apiKey.trim() && h.baseUrl.trim()) {
          const N = await pe.chat({
            modelId: J.id,
            endpointModelId: J.endpointModelId,
            fallbackEndpointModelId: J.fallbackEndpointModelId,
            requestMode: J.requestMode,
            apiGroup: J.apiGroup,
            baseUrl: h.baseUrl,
            apiKey: h.apiKey,
            fallbackBaseUrl: h.fallbackBaseUrl,
            fallbackApiKey: h.fallbackApiKey,
            messages: [
              {
                role: "system",
                content: [
                  "你是一个动画创作 Agent 团队，包含编剧、角色设计、场景设计、分镜师、镜头导演和声音导演。",
                  "只输出 JSON，不要 Markdown。",
                  "JSON 字段必须是: title, logline, style, aspectRatio, duration, characters, scenes, shots, negativePrompt, bgmPrompt。",
                  "characters 每项: id, name, role, appearance, continuityPrompt。",
                  "scenes 每项: id, name, environment, mood, visualPrompt。",
                  "shots 每项: id, title, scene, characters, action, camera, motion, lighting, duration, imagePrompt, videoPrompt, dialogue。",
                  "所有提示词必须可直接用于图像或视频模型，强调角色一致性、场景连续性、不要文字水印、不要 UI。",
                ].join(`
`),
              },
              {
                role: "user",
                content: [
                  `用户创意: ${u}`,
                  `目标比例: ${O}`,
                  "画布上下文:",
                  m,
                  "请生成 4-8 个镜头，适合在本地 AI 画布继续逐镜生成关键帧和视频。",
                ].join(`
`),
              },
            ],
          });
          p = qn(zn(N.content || ""), v);
        } else M("对话模型 API 未配置完整，已先生成本地动画方案。");
      }
      const f = yt(p);
      ve(p),
        Q(f),
        C((h) => [
          ...h,
          { id: p.id, role: "assistant", text: f, status: "done" },
        ]),
        M("动画 Agent 已生成角色、场景和分镜方案。");
    } catch (p) {
      const f = yt(v);
      ve(v),
        Q(f),
        C((h) => [
          ...h,
          {
            id: T("msg"),
            role: "assistant",
            text: oe(p, "动画 Agent 调用失败，已使用本地方案。"),
            status: "failed",
          },
          { id: v.id, role: "assistant", text: f, status: "done" },
        ]),
        M("动画 Agent 已回退成本地分镜方案。");
    } finally {
      G(void 0);
    }
  }
  function we(t) {
    const n = Ie(t),
      l = t.elements.filter(
        (m) => m.type === "image" && !m.isDeleted && !!m.fileId,
      ),
      u = new Set(n.filter(Pe).map((m) => m.id));
    return (
      n.filter(_e).forEach((m) => {
        l.filter((v) => de(v, m)).forEach((v) => u.add(v.id));
      }),
      l
        .filter((m) => u.has(m.id))
        .map((m) => {
          const v = m.fileId ? t.files[m.fileId] : void 0;
          return {
            id: m.id,
            name: `原图 ${m.id.slice(0, 4)}`,
            dataUrl: v == null ? void 0 : v.dataURL,
            width: m.width,
            height: m.height,
          };
        })
        .filter((m) => !!m.dataUrl)
    );
  }
  async function la(t) {
    const n = Ie(t),
      l = n.filter(St),
      u = n.filter(Pt);
    if (l.length === 0 && u.length === 0) return;
    const m = t.elements.filter(
        (f) => f.type === "image" && !f.isDeleted && !!f.fileId,
      ),
      v = [...l, ...u],
      p = n.find(Pe) ?? m.find((f) => v.some((h) => de(f, h)));
    if (p)
      return Pn(
        p,
        l.filter((f) => de(p, f)),
        t.files,
        u.filter((f) => de(p, f)),
      );
  }
  async function Ft() {
    var Ne, Ke, Yt;
    const t = x.current,
      n = Fi ?? I;
    if (!t || !n) {
      M(
        n
          ? "请先选中 Jiaren AI 智能画布元素。"
          : "没有可用出图模型，请先配置模型2或图像模型。",
      );
      return;
    }
    let l;
    try {
      l = await ne(t);
    } catch (F) {
      M(oe(F, "选区导出失败，请重新框选后再试。"));
      return;
    }
    if (!l) {
      M("请选择图片、框、箭头、文字等 Jiaren AI 元素后再智能生成。");
      return;
    }
    const u = we(t);
    if (u.length === 0) {
      M(
        "智能编辑需要先选中原图，或用矩形框覆盖图片的一部分；不要只选文字/框线。",
      );
      return;
    }
    let m;
    try {
      m = await la(t);
    } catch {
      m = void 0;
    }
    const v = !!(n && m && Bn(n, be)),
      p = he(t).some(_e),
      f = u.length > 1 && !p && !v,
      h = fe(v || f ? u : [...u, l]).slice(0, 8),
      N = fe([...u, ...(v ? [m] : [l])]).slice(0, 8),
      q = [gt(t), mi(t)].filter(Boolean).join(`
`),
      K =
        te.trim() ||
        W ||
        (f
          ? "按画布关系融合多张参考图片，生成一张新的完整图片。"
          : "按选区标注进行局部编辑。"),
      S = li(ct, lt),
      D = [
        K,
        "",
        S,
        v
          ? "图像编辑要求：API 只接收原图和透明局部 mask。严格只修改 mask 透明区域，不透明区域必须保持原样。"
          : f
            ? "多参考图创作要求：前几张参考图都是主体/风格/材质来源，请根据画布文字、箭头、加号、排列关系理解用户意图，融合成一张新的最终图片。最终输出只能是一个单体成品主体，不能做并排对比图、分析海报、分栏页面、表格、before/after 或角色说明页。"
            : "图像编辑要求：第一张参考图是原图；后续参考图仅用于标明选区、框线、箭头或文字要求。保持未标注区域稳定，只修改用户要求的局部内容。",
        m
          ? "透明局部 mask：透明区域是需要编辑/去除/重绘的位置，不透明区域保持原样。"
          : "",
        f
          ? "最终结果必须是单张融合后的成品图；画面中不要出现任何文字、标题、标签、VS、加号、箭头、矩形框、说明文字、参考图水印或测试文字。Plain clean background, one centered final subject only, no infographic, no comparison layout."
          : "不要重画主体，不要改变整体构图，不要把标注框、箭头、说明文字画进最终图片。",
        q,
      ].filter(Boolean).join(`
`),
      Y = T("tool"),
      ie = (F, ue) => {
        C((_) =>
          _.map((Ae) => (Ae.id === Y ? { ...Ae, text: ue, status: F } : Ae)),
        );
      };
    G("magic"),
      C((F) => [
        ...F,
        {
          id: Y,
          role: "tool",
          toolName: "Canvas::智能生成",
          text: v
            ? `已提交局部编辑。模型: ${n == null ? void 0 : n.alias}；API 仅发送原图 + mask，选区标注只在本地辅助显示。`
            : f
              ? `已提交多图融合。模型: ${n == null ? void 0 : n.alias}；多张参考图作为主体/风格来源，选区截图作为画布意图。`
              : `已提交图像编辑。模型: ${n == null ? void 0 : n.alias}；原图在前，选区标注在后。`,
          images: N,
          status: "running",
        },
      ]),
      M(
        v
          ? `正在用 ${n == null ? void 0 : n.alias} 局部编辑：原图 + mask。`
          : f
            ? `正在用 ${n == null ? void 0 : n.alias} 做多图融合。`
            : `正在用 ${n == null ? void 0 : n.alias} 编辑：原图 + 选区标注。`,
      );
    try {
      if (!n) throw new Error("没有可用出图模型。");
      const F = ge(e, n.id);
      if (!F.apiKey.trim() || !F.baseUrl.trim())
        throw new Error(`${n.alias} API 配置不完整，请先在 API 设置里填写。`);
      const ue = Qe(n.id),
        _ = await pe.generateImage({
          modelAlias: n.alias,
          modelId: n.id,
          endpointModelId: n.endpointModelId,
          fallbackEndpointModelId: n.fallbackEndpointModelId,
          requestMode: n.requestMode,
          apiGroup: n.apiGroup,
          baseUrl: F.baseUrl,
          apiKey: F.apiKey,
          fallbackBaseUrl: F.fallbackBaseUrl,
          fallbackApiKey: F.fallbackApiKey,
          prompt: D,
          size: pt(ue),
          resolution: le,
          aspectRatio: O,
          quality: ye,
          count: rt,
          async: ue.supportsAsync,
          referenceImagePaths: qe(h),
          referenceImages: ht(h),
          maskImage: v && m ? qi(m) : void 0,
          cacheDir: a.cacheDir,
          downloadsDir: a.downloadsDir,
        }),
        Ae = We(_.assets, "Jiaren AI 智能生成结果"),
        He = await Je(Ae, { select: !0 });
      i({
        id: _.id,
        createdAt: new Date().toISOString(),
        modelAlias: n.alias,
        modelId: n.id,
        prompt: D,
        elapsedMs: _.elapsedMs,
        thumbnail: Be(_.assets[0]),
        localPath: (Ne = _.assets[0]) == null ? void 0 : Ne.localPath,
        width: (Ke = _.assets[0]) == null ? void 0 : Ke.width,
        height: (Yt = _.assets[0]) == null ? void 0 : Yt.height,
        status: _.status,
        message: _.message,
      }),
        C((ya) => [
          ...ya,
          {
            id: _.id || T("msg"),
            role: "assistant",
            text:
              _.message ||
              (He > 0
                ? "智能生成完成，结果已回到 Jiaren AI 画布。"
                : "任务已提交，但暂未返回图片。"),
            images: Ae,
            status: _.status === "failed" ? "failed" : "done",
          },
        ]),
        ie(
          _.status === "failed" ? "failed" : "done",
          _.message ||
            (He > 0
              ? "Jiaren AI 智能生成完成，结果已回到画布和生成记录。"
              : "任务已提交，但暂未返回图片。"),
        ),
        M(
          He > 0
            ? `Jiaren AI 智能生成已完成，${He} 张结果已放回画布。`
            : (_.message ?? "智能生成已提交。"),
        );
    } catch (F) {
      const ue = oe(F, "Jiaren AI 智能生成失败。");
      ie("failed", ue),
        C((_) => [
          ..._,
          { id: T("msg"), role: "assistant", text: ue, status: "failed" },
        ]),
        M(ue);
    } finally {
      G(void 0);
    }
  }
  function We(t, n) {
    return t
      .filter((l) => l.type === "image" && (l.dataUrl || l.localPath || l.url))
      .map((l, u) => ({
        id: l.id || T("result"),
        name: `${n} ${u + 1}`,
        dataUrl: l.dataUrl,
        url: l.url,
        localPath: l.localPath,
        width: l.width,
        height: l.height,
      }));
  }
  async function da() {
    var h, N, q;
    if (!I) {
      M("没有可用出图模型，请先配置模型。");
      return;
    }
    const t = x.current;
    let n;
    try {
      n = t ? await ne(t) : void 0;
    } catch (K) {
      M(oe(K, "选区导出失败，请重新框选后再试。"));
      return;
    }
    const l = t ? we(t) : [],
      u = fe([...l, ...re, n]).slice(0, 8),
      m = li(ct, lt),
      v = [W || (await Fe()), m].filter(Boolean).join(`

`);
    if (!I) return;
    const p = ge(e, I.id);
    if (!p.apiKey.trim() || !p.baseUrl.trim()) {
      M(`${I.alias} API 配置不完整，请先在 API 设置里填写。`);
      return;
    }
    const f = Qe(I.id);
    G("image");
    try {
      const K = await pe.generateImage({
          modelAlias: I.alias,
          modelId: I.id,
          endpointModelId: I.endpointModelId,
          fallbackEndpointModelId: I.fallbackEndpointModelId,
          requestMode: I.requestMode,
          apiGroup: I.apiGroup,
          baseUrl: p.baseUrl,
          apiKey: p.apiKey,
          fallbackBaseUrl: p.fallbackBaseUrl,
          fallbackApiKey: p.fallbackApiKey,
          prompt: v,
          size: pt(f),
          resolution: le,
          aspectRatio: O,
          quality: ye,
          count: rt,
          async: f.supportsAsync,
          referenceImagePaths: qe(u),
          referenceImages: ht(u),
          cacheDir: a.cacheDir,
          downloadsDir: a.downloadsDir,
        }),
        S = We(K.assets, "Jiaren AI 出图"),
        D = await Je(S, { select: !0 });
      C((Y) => [
        ...Y,
        {
          id: K.id,
          role: "assistant",
          text:
            K.message ||
            (D > 0 ? "图片生成完成，结果已放回画布。" : "图片生成完成。"),
          images: S,
        },
      ]),
        i({
          id: K.id,
          createdAt: new Date().toISOString(),
          modelAlias: I.alias,
          modelId: I.id,
          prompt: v,
          elapsedMs: K.elapsedMs,
          thumbnail: Be(K.assets[0]),
          localPath: (h = K.assets[0]) == null ? void 0 : h.localPath,
          width: (N = K.assets[0]) == null ? void 0 : N.width,
          height: (q = K.assets[0]) == null ? void 0 : q.height,
          status: K.status,
          message: K.message,
        }),
        M(
          D > 0
            ? `图片生成完成，${D} 张结果已放回画布。`
            : K.message ||
                (S.length
                  ? "图片生成完成。"
                  : "图片任务已提交，等待第三方 API 返回结果。"),
        );
    } catch (K) {
      const S = oe(K, "图片生成失败。");
      C((D) => [
        ...D,
        { id: T("msg"), role: "assistant", text: S, status: "failed" },
      ]),
        M(S);
    } finally {
      G(void 0);
    }
  }
  async function Vt() {
    var p, f;
    if (!$) {
      M("没有可用视频模型，请先配置 Jiaren AI 视频模型。");
      return;
    }
    const t = ge(e, $.id);
    if (!t.apiKey.trim() || !t.baseUrl.trim()) {
      M(`${$.alias} API 配置不完整，请先在 API 设置里填写。`);
      return;
    }
    const n = x.current;
    let l;
    try {
      l = n ? await ne(n, !0) : void 0;
    } catch (h) {
      M(oe(h, "选区导出失败，请重新框选后再试。"));
      return;
    }
    const u = n ? we(n) : [],
      m = fe([...u, ...re, l]).slice(0, 4),
      v = W || (await Fe());
    G("video");
    try {
      const h = await pe.generateVideo({
        modelAlias: $.alias,
        modelId: $.id,
        endpointModelId: $.endpointModelId,
        fallbackEndpointModelId: $.fallbackEndpointModelId,
        requestMode: $.requestMode,
        apiGroup: $.apiGroup,
        baseUrl: t.baseUrl,
        apiKey: t.apiKey,
        fallbackBaseUrl: t.fallbackBaseUrl,
        fallbackApiKey: t.fallbackApiKey,
        mode: m.length ? "image-to-video" : "text-to-video",
        prompt: v,
        script: v,
        shotTitle: "Jiaren AI Agent 镜头",
        duration: 5,
        aspectRatio: O === "9:16" ? "9:16" : "16:9",
        fps: 24,
        cameraMotion: "Push In",
        shotType: "Cinematic",
        lighting: "保持画布参考图光影",
        background: "保持画布上下文",
        transition: "Auto",
        directorMode: !0,
        shotCount: 4,
        referenceImagePaths: qe(m),
        referenceVideoPaths: [],
        referenceAudioPaths: [],
        cacheDir: a.cacheDir,
        downloadsDir: a.downloadsDir,
      });
      C((N) => [
        ...N,
        { id: h.id, role: "assistant", text: h.message || "视频任务已提交。" },
      ]),
        i({
          id: h.id,
          createdAt: new Date().toISOString(),
          modelAlias: $.alias,
          modelId: $.id,
          prompt: v,
          elapsedMs: h.elapsedMs,
          thumbnail: Be(h.assets[0]),
          localPath: (p = h.assets[0]) == null ? void 0 : p.localPath,
          durationMs: (f = h.assets[0]) == null ? void 0 : f.durationMs,
          assetType: "video",
          status: h.status,
          message: h.message,
        }),
        M(h.message ?? "Jiaren AI 视频任务已提交。");
    } catch (h) {
      const N = oe(h, "视频生成失败。");
      C((q) => [
        ...q,
        { id: T("msg"), role: "assistant", text: N, status: "failed" },
      ]),
        M(N);
    } finally {
      G(void 0);
    }
  }
  async function Wt(t) {
    const n = x.current;
    let l;
    try {
      l = n ? await ne(n, !0) : void 0;
    } catch {
      l = void 0;
    }
    return fe([...(n ? we(n) : []), ...re, l]).slice(0, t);
  }
  function Ht() {
    return A
      ? [
          "动画项目一致性:",
          A.logline,
          ...A.characters.map((t) => `${t.name}: ${t.continuityPrompt}`),
          ...A.scenes.map((t) => `${t.name}: ${t.visualPrompt}`),
          `负面约束: ${A.negativePrompt}`,
        ].join(`
`)
      : "";
  }
  async function ua(t) {
    var v, p, f;
    if (!I) {
      M("没有可用出图模型，请先配置图像模型。");
      return;
    }
    const n = ge(e, I.id);
    if (!n.apiKey.trim() || !n.baseUrl.trim()) {
      M(`${I.alias} API 配置不完整，请先在 API 设置里填写。`);
      return;
    }
    const l = await Wt(8),
      u = Qe(I.id),
      m = [
        `动画关键帧: ${t.title}`,
        `场景: ${t.scene}`,
        `角色: ${t.characters.join(", ") || "按项目角色设定"}`,
        `动作: ${t.action}`,
        `镜头: ${t.camera}; 运镜: ${t.motion}; 光影: ${t.lighting}; 时长: ${t.duration}s`,
        t.imagePrompt,
        Ht(),
        "生成单张干净关键帧，不要分栏、不要文字、不要水印、不要 UI，角色身份和画布参考保持一致。",
      ].filter(Boolean).join(`
`);
    G("image");
    try {
      const h = await pe.generateImage({
          modelAlias: I.alias,
          modelId: I.id,
          endpointModelId: I.endpointModelId,
          fallbackEndpointModelId: I.fallbackEndpointModelId,
          requestMode: I.requestMode,
          apiGroup: I.apiGroup,
          baseUrl: n.baseUrl,
          apiKey: n.apiKey,
          fallbackBaseUrl: n.fallbackBaseUrl,
          fallbackApiKey: n.fallbackApiKey,
          prompt: m,
          size: pt(u),
          resolution: le,
          aspectRatio: (A == null ? void 0 : A.aspectRatio) || O,
          quality: ye,
          count: 1,
          async: u.supportsAsync,
          referenceImagePaths: qe(l),
          referenceImages: ht(l),
          cacheDir: a.cacheDir,
          downloadsDir: a.downloadsDir,
        }),
        N = We(h.assets, `${t.title} 关键帧`),
        q = await Je(N, { select: !0 });
      C((K) => [
        ...K,
        {
          id: h.id,
          role: "assistant",
          text: h.message || `${t.title} 关键帧已生成。`,
          images: N,
        },
      ]),
        i({
          id: h.id,
          createdAt: new Date().toISOString(),
          modelAlias: I.alias,
          modelId: I.id,
          prompt: m,
          elapsedMs: h.elapsedMs,
          thumbnail: Be(h.assets[0]),
          localPath: (v = h.assets[0]) == null ? void 0 : v.localPath,
          width: (p = h.assets[0]) == null ? void 0 : p.width,
          height: (f = h.assets[0]) == null ? void 0 : f.height,
          status: h.status,
          message: h.message,
        }),
        M(
          q > 0
            ? `${t.title} 关键帧已回到画布。`
            : h.message || "关键帧任务已提交。",
        );
    } catch (h) {
      const N = oe(h, `${t.title} 关键帧生成失败。`);
      C((q) => [
        ...q,
        { id: T("msg"), role: "assistant", text: N, status: "failed" },
      ]),
        M(N);
    } finally {
      G(void 0);
    }
  }
  async function pa(t) {
    var m, v;
    if (!$) {
      M("没有可用视频模型，请先配置 Jiaren AI 视频模型。");
      return;
    }
    const n = ge(e, $.id);
    if (!n.apiKey.trim() || !n.baseUrl.trim()) {
      M(`${$.alias} API 配置不完整，请先在 API 设置里填写。`);
      return;
    }
    const l = await Wt(4),
      u = [
        `动画镜头: ${t.title}`,
        t.videoPrompt,
        `动作: ${t.action}`,
        `镜头: ${t.camera}; 运镜: ${t.motion}; 光影: ${t.lighting}`,
        Ht(),
        "保持角色一致，动作连贯，避免变形、闪烁、文字、水印和 UI。",
      ].filter(Boolean).join(`
`);
    G("video");
    try {
      const p = await pe.generateVideo({
        modelAlias: $.alias,
        modelId: $.id,
        endpointModelId: $.endpointModelId,
        fallbackEndpointModelId: $.fallbackEndpointModelId,
        requestMode: $.requestMode,
        apiGroup: $.apiGroup,
        baseUrl: n.baseUrl,
        apiKey: n.apiKey,
        fallbackBaseUrl: n.fallbackBaseUrl,
        fallbackApiKey: n.fallbackApiKey,
        mode: l.length ? "image-to-video" : "text-to-video",
        prompt: u,
        script: (A == null ? void 0 : A.logline) || u,
        shotTitle: t.title,
        duration: t.duration,
        aspectRatio:
          (A == null ? void 0 : A.aspectRatio) ||
          (O === "9:16" ? "9:16" : "16:9"),
        fps: 24,
        cameraMotion: t.motion,
        shotType: t.camera,
        lighting: t.lighting,
        background: t.scene,
        transition: "按分镜自然衔接",
        directorMode: !0,
        shotCount: 1,
        referenceImagePaths: qe(l),
        referenceVideoPaths: [],
        referenceAudioPaths: [],
        cacheDir: a.cacheDir,
        downloadsDir: a.downloadsDir,
      });
      C((f) => [
        ...f,
        {
          id: p.id,
          role: "assistant",
          text: p.message || `${t.title} 视频镜头已提交。`,
        },
      ]),
        i({
          id: p.id,
          createdAt: new Date().toISOString(),
          modelAlias: $.alias,
          modelId: $.id,
          prompt: u,
          elapsedMs: p.elapsedMs,
          thumbnail: Be(p.assets[0]),
          localPath: (m = p.assets[0]) == null ? void 0 : m.localPath,
          durationMs: (v = p.assets[0]) == null ? void 0 : v.durationMs,
          assetType: "video",
          status: p.status,
          message: p.message,
        }),
        M(p.message ?? `${t.title} 视频镜头已提交。`);
    } catch (p) {
      const f = oe(p, `${t.title} 视频镜头生成失败。`);
      C((h) => [
        ...h,
        { id: T("msg"), role: "assistant", text: f, status: "failed" },
      ]),
        M(f);
    } finally {
      G(void 0);
    }
  }
  async function ma() {
    const t = x.current;
    if (!t) return;
    const n = he(t),
      l = t.elements.filter(
        (p) => p.type === "image" && !p.isDeleted && !!p.fileId,
      ),
      u = n.filter(
        (p) =>
          p.type === "rectangle" ||
          p.type === "frame" ||
          p.type === "magicframe",
      ),
      m = n.find((p) => p.type === "image" && !!p.fileId);
    let v;
    if (u.length > 0) {
      const p = u[0],
        f = l.find((h) => de(h, p));
      if (f)
        try {
          v = await Sn(f, p, t.files);
        } catch (h) {
          M(oe(h, "框选裁剪失败，请确认矩形覆盖到了图片。"));
          return;
        }
    }
    if (!v && m != null && m.fileId) {
      const p = t.files[m.fileId];
      v =
        p != null && p.dataURL
          ? {
              id: T("jiaren-canvas-cutout"),
              name: "Jiaren AI 选中图片",
              dataUrl: p.dataURL,
              width: m.width,
              height: m.height,
            }
          : void 0;
    }
    if (!(v != null && v.dataUrl)) {
      M("请选中图片，或用 Jiaren AI 矩形/Frame 框住图片区域后再抠图。");
      return;
    }
    G("cutout");
    try {
      const p = await pe.removeBackground({
          baseUrl: "",
          apiKey: "",
          modelKey: "background-removal",
          source: v.dataUrl,
          cacheDir: a.cacheDir,
          outputFormat: "png",
          crop: !0,
          border: 0,
        }),
        f = We(p.assets, "Jiaren AI 抠图"),
        h = et(n),
        N = await Je(f, {
          x:
            ((h == null ? void 0 : h.x) ?? 120) +
            ((h == null ? void 0 : h.width) ?? 320) +
            36,
          y: (h == null ? void 0 : h.y) ?? 120,
          select: !0,
        });
      C((q) => [
        ...q,
        {
          id: p.id,
          role: "assistant",
          text: p.message || "框选抠图完成。",
          images: f,
        },
      ]),
        M(
          N > 0
            ? `Jiaren AI 框选抠图完成，${N} 张结果已放回画布。`
            : (p.message ?? "Jiaren AI 框选抠图完成。"),
        );
    } catch (p) {
      M(p instanceof Error ? p.message : "Jiaren AI 框选抠图失败。");
    } finally {
      G(void 0);
    }
  }
  function mt(t, n) {
    const l = ee.getState().workflowEdges,
      u = t.map((m, v) => ({
        id: `jiaren-canvas-native-${m}-${n}-${v}`,
        source: m,
        target: n,
        type: "smoothstep",
      }));
    d([...l, ...u]);
  }
  async function fa(t = A) {
    if (!t) {
      M("请先生成动画 Agent 方案。");
      return;
    }
    const n = x.current,
      l = n ? await ne(n, !0) : void 0,
      u = fe([...(n ? we(n) : []), ...re, l]).slice(0, 8),
      m = u.map(
        (f, h) =>
          o({
            kind: "imageInput",
            position: { x: 150 + h * 42, y: 130 + h * 42 },
            label: f.name,
            data: {
              imageSource: f.dataUrl ?? f.localPath,
              localPath: f.localPath,
              mimeType: it(f.dataUrl),
              fileName: f.name,
              status: "succeeded",
            },
          }).id,
      ),
      v = o({
        kind: "storyboard",
        position: { x: 460, y: 180 },
        label: `动画 Agent - ${t.title}`,
        data: {
          title: t.title,
          prompt: t.logline,
          outputText: yt(t),
          storyboardLayout:
            t.shots.length <= 4 ? 4 : t.shots.length <= 6 ? 6 : 8,
          storyboardStyle: t.style,
          storyboardDistributionPrompt: t.logline,
          characterBrief: t.characters.map((f) => `${f.name}: ${f.appearance}`)
            .join(`
`),
          visualContinuity: [
            ...t.characters.map((f) => f.continuityPrompt),
            ...t.scenes.map((f) => f.visualPrompt),
            t.negativePrompt,
          ].filter(Boolean).join(`
`),
          storyboardItems: t.shots.map((f) => ({
            id: f.id,
            title: f.title,
            imagePrompt: f.imagePrompt,
            videoPrompt: f.videoPrompt,
            narration: f.action,
            dialogue: f.dialogue,
            duration: f.duration,
            camera: f.camera,
            motion: f.motion,
            status: "idle",
          })),
          status: "idle",
          linkedImageCount: u.length,
          message: "来自二级 AI 画布动画 Agent，可继续生成关键帧和视频。",
        },
      }),
      p = o({
        kind: "videoGenerate",
        position: { x: 840, y: 220 },
        label: "动画分镜转视频",
        data: {
          prompt: t.shots.map((f, h) => `${h + 1}. ${f.videoPrompt}`).join(`

`),
          script: t.logline,
          videoMode: u.length ? "image-to-video" : "storyboard",
          shotTitle: t.title,
          aspectRatio: t.aspectRatio,
          duration: Math.max(
            5,
            Math.round(t.duration / Math.max(1, t.shots.length)),
          ),
          fps: 24,
          cameraMotion: "按分镜逐镜执行",
          shotType: "动画短片",
          lighting: "保持分镜光影连续",
          background: "保持场景连续",
          transition: "按分镜自然衔接",
          directorMode: !0,
          shotCount: t.shots.length,
          status: "idle",
          linkedImageCount: u.length,
        },
      });
    mt([...m, v.id], p.id),
      m.length && mt(m, v.id),
      c(v.id),
      g({ jiarenCanvasModeOpen: !1 }),
      jiarenCanvasProps.onClose?.(),
      M("动画 Agent 分镜已写回主画布。");
  }
  async function ga(t) {
    const n = x.current,
      l = n ? await ne(n) : void 0,
      u = fe([...(n ? we(n) : []), ...re, l]).slice(0, 8),
      m = W || ze(Le, te),
      v = u.map(
        (f, h) =>
          o({
            kind: "imageInput",
            position: { x: 160 + h * 42, y: 150 + h * 42 },
            label: f.name,
            data: {
              imageSource: f.dataUrl ?? f.localPath,
              localPath: f.localPath,
              mimeType: it(f.dataUrl),
              fileName: f.name,
              status: "succeeded",
            },
          }).id,
      ),
      p = o({
        kind: t,
        position: { x: 460, y: 210 },
        label: "Jiaren AI 图像编辑",
        data: {
          prompt: m,
          status: "idle",
          linkedImageCount: u.length,
          modelId: I == null ? void 0 : I.id,
          modelApiGroup: I == null ? void 0 : I.apiGroup,
          resolution: le,
          aspectRatio: O,
          quality: ye,
        },
      });
    mt(v, p.id),
      r(p.id),
      c(p.id),
      g({ jiarenCanvasModeOpen: !1 }),
      jiarenCanvasProps.onClose?.();
  }
  async function ha() {
    var u;
    const t = x.current;
    if (!t) return;
    const n = await ne(t);
    if (!(n != null && n.dataUrl)) {
      M("请先选择要导出的 Jiaren AI 元素。");
      return;
    }
    const l = await ((u = window.jiaren) == null
      ? void 0
      : u.system.saveAsset({
          source: n.dataUrl,
          directory: a.downloadsDir,
          fileName: `jiaren_canvas_selection_${Date.now()}.png`,
        }));
    M(
      l != null && l.ok
        ? `已导出：${l.path}`
        : ((l == null ? void 0 : l.message) ?? "导出失败。"),
    );
  }
  const va = w.useMemo(
    () => ({
      elements: [],
      appState: {
        theme: "dark",
        // Excalidraw dark mode inverts canvas pixels; white renders as its darkest neutral.
        viewBackgroundColor: "#ffffff",
        currentItemStrokeColor: "#c7ff3d",
        currentItemBackgroundColor: "transparent",
        currentItemRoughness: 1,
        frameRendering: { enabled: !0, clip: !0, name: !0, outline: !0 },
      },
      files: {},
    }),
    [b.themeMode],
  );
  return s.jsxs("section", {
    className: "jiaren-canvas-native-panel",
    children: [
      s.jsx("div", {
        className: "jiaren-canvas-window-drag",
        "aria-hidden": "true",
        onDoubleClick: () => void _t(),
      }),
      s.jsxs("div", {
        className: "jiaren-canvas-window-controls",
        "aria-label": "窗口控制",
        children: [
          s.jsx("button", {
            type: "button",
            title: "最小化",
            onClick: () => {
              var t;
              return void ((t = window.jiaren) == null
                ? void 0
                : t.system.windowCommand("minimize"));
            },
            children: s.jsx(hi, { size: 13 }),
          }),
          s.jsx("button", {
            type: "button",
            title: _i ? "还原窗口" : "最大化",
            onClick: () => void _t(),
            children: s.jsx(vi, { size: 12 }),
          }),
        ],
      }),
      s.jsxs("div", {
        className: "jiaren-canvas-native-canvas",
        ref: j,
        onContextMenu: (t) => t.preventDefault(),
        onPointerDown: ta,
        onPointerMove: ia,
        onPointerUp: Et,
        onPointerCancel: Et,
        onWheel: ea,
        onDoubleClickCapture: (t) => {
          const n = t.target instanceof HTMLElement ? t.target : void 0;
          (n != null &&
            n.closest(
              "button, input, textarea, select, .jiaren-canvas-tool-menu, .jiaren-canvas-view-menu, .jiaren-canvas-selection-toolbar",
            )) ||
            Lt();
        },
        children: [
          s.jsx(ba, {
            theme: "dark",
            langCode: b.language === "en" ? "en" : "zh-CN",
            name: "Jiaren AI Canvas",
            initialData: va,
            excalidrawAPI: (t) => {
              y.current = t;
              jiarenThemeApi.current !== t &&
                ((jiarenThemeApi.current = t),
                window.setTimeout(() => {
                  if (jiarenThemeApi.current !== t) return;
                  const n = t.getAppState();
                  t.updateScene({
                    appState: {
                      ...n,
                      theme: "dark",
                      viewBackgroundColor: "#ffffff",
                      currentItemStrokeColor: "#c7ff3d",
                    },
                  });
                }, 80));
            },
            onChange: aa,
            viewModeEnabled: !1,
            zenModeEnabled: !1,
            gridModeEnabled: !1,
            objectsSnapModeEnabled: !0,
            UIOptions: {
              canvasActions: {
                loadScene: !1,
                saveToActiveFile: !1,
                export: !1,
                saveAsImage: !1,
                changeViewBackgroundColor: !0,
                clearCanvas: !0,
                toggleTheme: !1,
              },
              tools: { image: !0 },
            },
          }),
          s.jsx("div", {
            className: "jiaren-canvas-tool-menu",
            role: "toolbar",
            "aria-label": "Jiaren AI 画布工具",
            children: di.map((t, n) =>
              s.jsxs(
                "button",
                {
                  className: Oi === t.type ? "active" : "",
                  title: `${t.label} (${t.shortcut})`,
                  type: "button",
                  onMouseDown: (l) => l.preventDefault(),
                  onClick: () => ut(t.type),
                  children: [
                    n === 2 || n === 7
                      ? s.jsx("i", { "aria-hidden": "true" })
                      : null,
                    Kn(t.type),
                  ],
                },
                t.type,
              ),
            ),
          }),
          ce
            ? s.jsxs("div", {
                className: `jiaren-canvas-selection-toolbar ${ce.anchor === "left" ? "left-anchor" : ""}`,
                style: { left: ce.left, top: ce.top },
                role: "toolbar",
                "aria-label": "Jiaren AI 选区工具",
                children: [
                  s.jsxs("span", {
                    title: `${ce.selectedCount} 个选中元素`,
                    children: [
                      s.jsx(Ma, { size: 14 }),
                      ce.selectedImageCount
                        ? `${ce.selectedImageCount} 图`
                        : `${ce.selectedCount} 项`,
                    ],
                  }),
                  s.jsxs("button", {
                    type: "button",
                    title: "把当前选区加入对话上下文",
                    onClick: () => void Jt(),
                    children: [s.jsx(ja, { size: 14 }), "加入对话"],
                  }),
                  s.jsxs("button", {
                    type: "button",
                    title: `按框选内容直接生成图片：${I ? Tt(I) : "未选择模型"}`,
                    disabled: B === "magic",
                    onClick: () => void Ft(),
                    children: [
                      B === "magic"
                        ? s.jsx(ae, { className: "spin", size: 14 })
                        : s.jsx(Qt, { size: 14 }),
                      "生成图片",
                    ],
                  }),
                  s.jsxs("button", {
                    type: "button",
                    title: `按选区生成视频：${$ ? Tt($) : "未选择模型"}`,
                    disabled: B === "video",
                    onClick: () => void Vt(),
                    children: [
                      B === "video"
                        ? s.jsx(ae, { className: "spin", size: 14 })
                        : s.jsx(Ye, { size: 14 }),
                      "生成视频",
                    ],
                  }),
                  s.jsxs("button", {
                    type: "button",
                    title: "选中图片或用矩形框住图片后抠图",
                    disabled: B === "cutout",
                    onClick: () => void ma(),
                    children: [
                      B === "cutout"
                        ? s.jsx(ae, { className: "spin", size: 14 })
                        : s.jsx(Aa, { size: 14 }),
                      "抠图",
                    ],
                  }),
                  s.jsx("button", {
                    type: "button",
                    title: "导出当前选区",
                    onClick: () => void ha(),
                    children: s.jsx($a, { size: 14 }),
                  }),
                  ce.selectedImageCount
                    ? s.jsx("button", {
                        type: "button",
                        title: "放大预览选中图片",
                        onClick: Lt,
                        children: s.jsx(Ca, { size: 14 }),
                      })
                    : null,
                  s.jsx("button", {
                    type: "button",
                    title: "删除当前选区",
                    onClick: ca,
                    children: s.jsx(Zt, { size: 14 }),
                  }),
                ],
              })
            : null,
          s.jsxs("div", {
            className: "jiaren-canvas-canvas-status",
            children: [
              s.jsx("strong", { children: "Jiaren AI - 智能画布" }),
              s.jsx("span", { children: Wi }),
            ],
          }),
        ],
      }),
      s.jsxs("aside", {
        className: "jiaren-canvas-native-chat",
        children: [
          s.jsxs("header", {
            children: [
              s.jsxs("div", {
                className: "jiaren-canvas-chat-title",
                children: [
                  s.jsx(Sa, { size: 16 }),
                  s.jsx("strong", { children: Hi }),
                ],
              }),
              s.jsxs("nav", {
                children: [
                  s.jsxs("button", {
                    className: "jiaren-canvas-new-chat-button",
                    type: "button",
                    title: "新对话",
                    onClick: ra,
                    children: [s.jsx(Pa, { size: 15 }), "新对话"],
                  }),
                  s.jsx("button", {
                    className: "jiaren-canvas-clear-button",
                    type: "button",
                    title: "清空 Jiaren AI 模块",
                    onClick: sa,
                    children: s.jsx(Zt, { size: 15 }),
                  }),
                  s.jsx("button", {
                    className: "jiaren-canvas-close-button",
                    type: "button",
                    title: "退出 Jiaren AI 模式",
                    onClick: () => {
                      g({ jiarenCanvasModeOpen: !1 });
                      jiarenCanvasProps.onClose?.();
                    },
                    children: s.jsx(ei, { size: 15 }),
                  }),
                ],
              }),
            ],
          }),
          s.jsxs("div", {
            className: "jiaren-canvas-chat-scroll",
            children: [
              s.jsxs("div", {
                className: "jiaren-canvas-chat-hero",
                children: [
                  s.jsx("strong", { children: Yi }),
                  s.jsx("span", { children: Xi }),
                ],
              }),
              s.jsxs("div", {
                className: "jiaren-canvas-context-card",
                children: [
                  s.jsx("strong", { children: "画布上下文" }),
                  s.jsx("pre", { children: Le }),
                ],
              }),
              s.jsxs("div", {
                className: "jiaren-canvas-agent-brief",
                children: [
                  s.jsxs("div", {
                    children: [
                      s.jsx("span", { children: "智能分析" }),
                      s.jsx("strong", {
                        children: W ? "方案已就绪" : "等待选择",
                      }),
                    ],
                  }),
                  s.jsx("p", { children: Qi }),
                  s.jsxs("div", {
                    children: [
                      s.jsx("span", {
                        children: z.selectedImageCount
                          ? `${z.selectedImageCount} 张图片`
                          : "未选择图片",
                      }),
                      s.jsx("span", {
                        children: z.selectedCount
                          ? `${z.selectedCount} 个元素`
                          : "未选择元素",
                      }),
                      s.jsx("span", { children: Vi }),
                    ],
                  }),
                ],
              }),
              V === "animation"
                ? s.jsxs("div", {
                    className: "jiaren-canvas-animation-workbench",
                    children: [
                      s.jsxs("div", {
                        className: "jiaren-canvas-animation-hero",
                        children: [
                          s.jsxs("div", {
                            children: [
                              s.jsx("span", {
                                children: "Jiaren Animation Agent Team",
                              }),
                              s.jsx("strong", {
                                children: A ? A.title : "创建动画项目",
                              }),
                              s.jsx("p", {
                                children: A
                                  ? A.logline
                                  : "从一句话故事、画布参考图和文字标注开始，自动拆出角色、场景、分镜、关键帧提示词和视频镜头。",
                              }),
                            ],
                          }),
                          s.jsxs("button", {
                            type: "button",
                            disabled: B === "animation",
                            onClick: () => void Ve(),
                            children: [
                              B === "animation"
                                ? s.jsx(ae, { className: "spin", size: 15 })
                                : s.jsx(ft, { size: 15 }),
                              "生成项目",
                            ],
                          }),
                        ],
                      }),
                      s.jsx("div", {
                        className: "jiaren-canvas-agent-team",
                        children: In.map((t, n) => {
                          const l = t.icon,
                            u = !!A || n < 2 || B === "animation";
                          return s.jsxs(
                            "article",
                            {
                              className: u ? "active" : "",
                              children: [
                                s.jsx(l, { size: 15 }),
                                s.jsxs("div", {
                                  children: [
                                    s.jsx("strong", { children: t.name }),
                                    s.jsx("span", { children: t.role }),
                                  ],
                                }),
                              ],
                            },
                            t.id,
                          );
                        }),
                      }),
                      A
                        ? s.jsxs(s.Fragment, {
                            children: [
                              s.jsxs("div", {
                                className: "jiaren-canvas-animation-metrics",
                                children: [
                                  s.jsxs("span", {
                                    children: [A.characters.length, " 角色"],
                                  }),
                                  s.jsxs("span", {
                                    children: [A.scenes.length, " 场景"],
                                  }),
                                  s.jsxs("span", {
                                    children: [A.shots.length, " 镜头"],
                                  }),
                                  s.jsxs("span", {
                                    children: [A.duration, "s"],
                                  }),
                                  s.jsx("span", { children: A.aspectRatio }),
                                ],
                              }),
                              s.jsxs("div", {
                                className: "jiaren-canvas-animation-assets",
                                children: [
                                  s.jsxs("section", {
                                    className:
                                      "jiaren-canvas-animation-asset-column",
                                    children: [
                                      s.jsxs("header", {
                                        children: [
                                          s.jsx(yi, { size: 14 }),
                                          s.jsx("b", { children: "角色资产" }),
                                        ],
                                      }),
                                      A.characters.map((t) =>
                                        s.jsxs(
                                          "article",
                                          {
                                            children: [
                                              s.jsx("i", {
                                                children: t.name.slice(0, 1),
                                              }),
                                              s.jsx("strong", {
                                                children: t.name,
                                              }),
                                              s.jsx("span", {
                                                children: t.role,
                                              }),
                                              s.jsx("p", {
                                                children: t.appearance,
                                              }),
                                            ],
                                          },
                                          t.id,
                                        ),
                                      ),
                                    ],
                                  }),
                                  s.jsxs("section", {
                                    className:
                                      "jiaren-canvas-animation-asset-column",
                                    children: [
                                      s.jsxs("header", {
                                        children: [
                                          s.jsx(xi, { size: 14 }),
                                          s.jsx("b", { children: "场景资产" }),
                                        ],
                                      }),
                                      A.scenes.map((t) =>
                                        s.jsxs(
                                          "article",
                                          {
                                            children: [
                                              s.jsx("i", {
                                                children: t.name.slice(0, 1),
                                              }),
                                              s.jsx("strong", {
                                                children: t.name,
                                              }),
                                              s.jsx("span", {
                                                children: t.mood,
                                              }),
                                              s.jsx("p", {
                                                children: t.environment,
                                              }),
                                            ],
                                          },
                                          t.id,
                                        ),
                                      ),
                                    ],
                                  }),
                                ],
                              }),
                              s.jsxs("div", {
                                className: "jiaren-canvas-animation-timeline",
                                children: [
                                  s.jsxs("header", {
                                    children: [
                                      s.jsxs("div", {
                                        children: [
                                          s.jsx(bi, { size: 15 }),
                                          s.jsx("strong", {
                                            children: "分镜时间线",
                                          }),
                                        ],
                                      }),
                                      s.jsxs("span", {
                                        children: [A.shots.length, " shots"],
                                      }),
                                    ],
                                  }),
                                  A.shots.map((t, n) =>
                                    s.jsxs(
                                      "article",
                                      {
                                        children: [
                                          s.jsxs("div", {
                                            className:
                                              "jiaren-canvas-shot-thumb",
                                            children: [
                                              s.jsx("span", {
                                                children: String(
                                                  n + 1,
                                                ).padStart(2, "0"),
                                              }),
                                              s.jsx(Ye, { size: 20 }),
                                            ],
                                          }),
                                          s.jsxs("div", {
                                            className:
                                              "jiaren-canvas-shot-body",
                                            children: [
                                              s.jsxs("div", {
                                                children: [
                                                  s.jsx("strong", {
                                                    children: t.title,
                                                  }),
                                                  s.jsxs("small", {
                                                    children: [t.duration, "s"],
                                                  }),
                                                ],
                                              }),
                                              s.jsx("p", {
                                                children: t.action,
                                              }),
                                              s.jsxs("em", {
                                                children: [
                                                  t.camera,
                                                  " / ",
                                                  t.motion,
                                                  " / ",
                                                  t.lighting,
                                                ],
                                              }),
                                              s.jsxs("div", {
                                                className:
                                                  "jiaren-canvas-shot-actions",
                                                children: [
                                                  s.jsxs("button", {
                                                    type: "button",
                                                    disabled: B === "image",
                                                    onClick: () => void ua(t),
                                                    children: [
                                                      B === "image"
                                                        ? s.jsx(ae, {
                                                            className: "spin",
                                                            size: 13,
                                                          })
                                                        : s.jsx(xt, {
                                                            size: 13,
                                                          }),
                                                      "关键帧",
                                                    ],
                                                  }),
                                                  s.jsxs("button", {
                                                    type: "button",
                                                    disabled: B === "video",
                                                    onClick: () => void pa(t),
                                                    children: [
                                                      B === "video"
                                                        ? s.jsx(ae, {
                                                            className: "spin",
                                                            size: 13,
                                                          })
                                                        : s.jsx(Ra, {
                                                            size: 13,
                                                          }),
                                                      "视频",
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      t.id,
                                    ),
                                  ),
                                ],
                              }),
                            ],
                          })
                        : s.jsxs("div", {
                            className: "jiaren-canvas-animation-empty-state",
                            children: [
                              s.jsx("strong", { children: "还没有动画项目" }),
                              s.jsx("span", {
                                children:
                                  "输入一句故事，或先把图片和文字放到画布里，再点“生成项目”。",
                              }),
                              s.jsxs("div", {
                                children: [
                                  s.jsx("span", { children: "角色设定" }),
                                  s.jsx("span", { children: "场景资产" }),
                                  s.jsx("span", { children: "分镜时间线" }),
                                  s.jsx("span", { children: "关键帧" }),
                                  s.jsx("span", { children: "视频镜头" }),
                                ],
                              }),
                            ],
                          }),
                    ],
                  })
                : null,
              s.jsx("div", {
                className: `jiaren-canvas-chat-log${L.length === 0 ? " is-empty" : ""}`,
                children:
                  L.length === 0
                    ? s.jsxs("div", {
                        className: "jiaren-canvas-chat-empty",
                        children: [
                          s.jsx("strong", {
                            children:
                              V === "animation"
                                ? "Animation Agent"
                                : "智能生图",
                          }),
                          s.jsx("span", {
                            children:
                              V === "animation"
                                ? "在画布上放入参考图和文字，动画 Agent 会先产出角色、场景、分镜和可生成视频的提示词。"
                                : "在画布上放入图片，画框、画箭头或写文字，然后直接生成。Jiaren AI 会把这些元素一起传给你选择的模型。",
                          }),
                        ],
                      })
                    : L.map((t) => {
                        var n;
                        return s.jsxs(
                          "article",
                          {
                            className: `jiaren-canvas-chat-message ${t.role}`,
                            children: [
                              s.jsx("b", {
                                children:
                                  t.toolName ??
                                  (t.role === "user"
                                    ? "You"
                                    : t.role === "tool"
                                      ? "Canvas Tool"
                                      : "Jiaren AI"),
                              }),
                              s.jsx("p", { children: t.text }),
                              (n = t.images) != null && n.length
                                ? s.jsx("div", {
                                    className: "jiaren-canvas-chat-images",
                                    children: t.images.map((l) => {
                                      const u = Ce(l);
                                      return u
                                        ? s.jsx(
                                            "img",
                                            {
                                              alt: "",
                                              src: u,
                                              title: "点击放大预览",
                                              onClick: () => Dt(l),
                                            },
                                            l.id,
                                          )
                                        : null;
                                    }),
                                  })
                                : null,
                            ],
                          },
                          t.id,
                        );
                      }),
              }),
              re.length
                ? s.jsx("div", {
                    className: "jiaren-canvas-chat-attachments",
                    children: re.map((t) =>
                      s.jsxs(
                        "button",
                        {
                          type: "button",
                          title: t.name,
                          onClick: () =>
                            Me((n) => n.filter((l) => l.id !== t.id)),
                          children: [
                            Ce(t)
                              ? s.jsx("img", { alt: "", src: Ce(t) })
                              : null,
                            s.jsx(ei, { size: 12 }),
                          ],
                        },
                        t.id,
                      ),
                    ),
                  })
                : null,
            ],
          }),
          s.jsxs("div", {
            className: "jiaren-canvas-chat-controls",
            children: [
              s.jsx("textarea", {
                value: te,
                placeholder:
                  V === "animation"
                    ? "输入动画故事、角色、场景或镜头要求"
                    : "描述你的设计需求",
                onChange: (t) => se(t.target.value),
                onKeyDown: (t) => {
                  t.key === "Enter" &&
                    !t.shiftKey &&
                    (t.preventDefault(), V === "animation" ? Ve() : Fe());
                },
              }),
              s.jsxs("div", {
                children: [
                  s.jsx("button", {
                    type: "button",
                    title: "添加图片",
                    onClick: () => void Ot(),
                    children: s.jsx(xt, { size: 14 }),
                  }),
                  s.jsxs("div", {
                    className: "jiaren-canvas-ratio-menu",
                    onPointerDown: (t) => t.stopPropagation(),
                    children: [
                      s.jsx("button", {
                        "aria-expanded": De,
                        "aria-haspopup": "listbox",
                        "aria-label": "比例",
                        type: "button",
                        onClick: () => st((t) => !t),
                        children: O,
                      }),
                      De
                        ? s.jsx("div", {
                            role: "listbox",
                            children: bn.map((t) =>
                              s.jsx(
                                "button",
                                {
                                  className: t === O ? "active" : "",
                                  role: "option",
                                  "aria-selected": t === O,
                                  type: "button",
                                  onClick: () => {
                                    Ut(t), st(!1);
                                  },
                                  children: t,
                                },
                                t,
                              ),
                            ),
                          })
                        : null,
                    ],
                  }),
                  s.jsx("select", {
                    "aria-label": "图片分辨率",
                    title: "图片分辨率",
                    value: le,
                    onChange: (t) => Nt(t.target.value),
                    children: H.resolutions.map((t) =>
                      s.jsx("option", { value: t, children: t }, t),
                    ),
                  }),
                  s.jsx("select", {
                    "aria-label": "图片质量",
                    title: "图片质量",
                    value: ye,
                    onChange: (t) => Kt(t.target.value),
                    children: H.qualities.map((t) =>
                      s.jsx("option", { value: t, children: t }, t),
                    ),
                  }),
                  s.jsxs("div", {
                    className: "jiaren-canvas-camera-controls",
                    title: "镜头控制会写入图片生成提示词",
                    children: [
                      s.jsx(Ba, { size: 14 }),
                      s.jsx("select", {
                        "aria-label": "镜头视角",
                        value: ct,
                        onChange: (t) => Li(t.target.value),
                        children: Ki.map((t) =>
                          s.jsx(
                            "option",
                            { value: t.id, children: t.label },
                            t.id,
                          ),
                        ),
                      }),
                      s.jsx("select", {
                        "aria-label": "镜头景别",
                        value: lt,
                        onChange: (t) => Gi(t.target.value),
                        children: Ri.map((t) =>
                          s.jsx(
                            "option",
                            { value: t.id, children: t.label },
                            t.id,
                          ),
                        ),
                      }),
                    ],
                  }),
                  s.jsx("input", {
                    "aria-label": "数量",
                    type: "number",
                    min: 1,
                    max: 4,
                    value: rt,
                    onChange: (t) =>
                      Di(Math.max(1, Math.min(4, Number(t.target.value) || 1))),
                  }),
                  s.jsx("button", {
                    type: "button",
                    disabled: B === "chat" || B === "animation",
                    onClick: () => void (V === "animation" ? Ve() : Fe()),
                    children:
                      B === "chat" || B === "animation"
                        ? s.jsx(ae, { className: "spin", size: 15 })
                        : s.jsx(bt, { size: 15 }),
                  }),
                ],
              }),
            ],
          }),
          s.jsxs("div", {
            className: "jiaren-canvas-model-controls",
            children: [
              s.jsxs("label", {
                children: [
                  s.jsx("span", { children: "图片模型" }),
                  s.jsx("select", {
                    value: xe,
                    onChange: (t) => Rt(t.target.value),
                    children: dt.map((t) =>
                      s.jsx("option", { value: t.id, children: Ge(t) }, t.id),
                    ),
                  }),
                ],
              }),
              s.jsxs("label", {
                children: [
                  s.jsx("span", { children: "视频模型" }),
                  s.jsx("select", {
                    value: ($ == null ? void 0 : $.id) ?? Ue ?? "",
                    onChange: (t) => Bt(t.target.value),
                    children: Ji.map((t) =>
                      s.jsx("option", { value: t.id, children: Ge(t) }, t.id),
                    ),
                  }),
                ],
              }),
            ],
          }),
          V === "animation"
            ? s.jsxs("div", {
                className: "jiaren-canvas-agent-actions",
                children: [
                  s.jsxs("button", {
                    type: "button",
                    disabled: B === "animation",
                    onClick: () => void Ve(),
                    children: [
                      B === "animation"
                        ? s.jsx(ae, { className: "spin", size: 15 })
                        : s.jsx(ft, { size: 15 }),
                      "生成方案",
                    ],
                  }),
                  s.jsxs("button", {
                    type: "button",
                    disabled: !A,
                    onClick: () => oa(),
                    children: [s.jsx(Ye, { size: 15 }), "贴到画布"],
                  }),
                  s.jsxs("button", {
                    type: "button",
                    disabled: !A,
                    onClick: () => void fa(),
                    children: [s.jsx(bt, { size: 15 }), "写回主画布"],
                  }),
                ],
              })
            : s.jsxs("div", {
                className: "jiaren-canvas-agent-actions",
                children: [
                  s.jsxs("button", {
                    type: "button",
                    disabled: B === "image",
                    onClick: () => void da(),
                    children: [
                      B === "image"
                        ? s.jsx(ae, { className: "spin", size: 15 })
                        : s.jsx(Qt, { size: 15 }),
                      "智能生图",
                    ],
                  }),
                  s.jsxs("button", {
                    type: "button",
                    disabled: B === "video",
                    onClick: () => void Vt(),
                    children: [
                      B === "video"
                        ? s.jsx(ae, { className: "spin", size: 15 })
                        : s.jsx(Ye, { size: 15 }),
                      "智能视频",
                    ],
                  }),
                  s.jsxs("button", {
                    type: "button",
                    onClick: () => void ga("editImage"),
                    children: [s.jsx(ft, { size: 15 }), "编辑节点"],
                  }),
                ],
              }),
        ],
      }),
      Ee
        ? s.jsx("div", {
            className: "jiaren-canvas-native-toast",
            children: Ee,
          })
        : null,
    ],
  });
}
const Vn = Object.freeze(
  Object.defineProperty(
    { __proto__: null, JiarenCanvasModePanel: _n },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
export {
  Vn as J,
  pe as a,
  Fn as b,
  Jn as c,
  ge as d,
  Ze as e,
  Qe as g,
  tt as h,
  Wa as i,
  cn as p,
  ee as u,
};
