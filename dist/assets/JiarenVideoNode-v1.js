import {
  m as ar,
  u as ir,
  a as sr,
  b as Ie,
  c as lr,
  f as C,
  e as nr,
  d as dr,
  g as cr,
  j as o,
  h as t,
  l as Z,
  F as Me,
  S as ur,
  i as g,
  t as he,
  w as pr,
} from "./t8-original-scope-BBmKmbTu.js";
import { u as mr, H as bt, P as wt } from "./vendor-flow-BUHgv_lX.js";
import { createPortal } from "./t8-react-dom-shim.js";
import {
  u as hr,
  e as gr,
  i as xr,
  r as vr,
  j as Nt,
  V as ee,
  C as Je,
  E as fr,
  F as br,
  G as wr,
  H as Nr,
  I as kr,
  J as yr,
  K as Ir,
  M as Mr,
  N as Rr,
  O as _r,
  P as Ar,
  Q as $r,
  R as Sr,
  L as kt,
  T as Or,
  t as Cr,
  U as Ur,
  W as Er,
  X as Pr,
  Y as Lr,
  Z as zr,
  _ as Dr,
} from "./t8-original-advancedProviders-BubDAnFQ.js";
import {
  n as Vr,
  f as Re,
  c as Fr,
  u as _e,
  a as Tr,
  M as Gr,
  r as Kr,
  e as Hr,
  V as Br,
} from "./t8-original-defaults-B6J-Pl2o.js";
import {
  u as jr,
  a as qr,
  L as Xr,
} from "./t8-original-t8-local-extensions-Dqcglbwc.js";
import "./vendor-C8NPC5kM.js";

const JIAREN_EMPTY_RUNTIME_SETTINGS = { global: {}, models: [] };
function useJiarenOpenCanvasAnchor(nodeId, active, mediaKind) {
  dr(() => {
    if (!active || typeof document === "undefined") return void 0;
    let frame = 0;
    const sync = () => {
      const node =
        document.querySelector(`.react-flow__node[data-id="${nodeId}"]`) ||
        document.querySelector(`[data-node-id="${nodeId}"]`)?.closest(".react-flow__node");
      // Jiaren v0.1.9 single video editor guard
      const editors = Array.from(
        document.querySelectorAll(
          `[data-jiaren-media-editor="${mediaKind}"][data-jiaren-node-id="${nodeId}"]`,
        ),
      );
      editors.forEach((candidate, index) => {
        if (index === 0) candidate.removeAttribute("data-jiaren-duplicate");
        else candidate.setAttribute("data-jiaren-duplicate", "true");
      });
      const editor = editors[0] || null;
      if (node && editor) {
        const rect = node.getBoundingClientRect();
        const flow = node.closest(".react-flow");
        const viewport = flow?.getBoundingClientRect() || {
          left: 0,
          right: window.innerWidth,
          top: 0,
          bottom: window.innerHeight,
          width: window.innerWidth,
        };
        const viewportTransform = flow?.querySelector(".react-flow__viewport");
        let canvasZoom = 1;
        if (viewportTransform) {
          const transform = window.getComputedStyle(viewportTransform).transform;
          if (transform && transform !== "none") {
            const matrix = new DOMMatrixReadOnly(transform);
            canvasZoom = Math.hypot(matrix.a, matrix.b) || 1;
          }
        }
        const editorScale = Math.min(1, Math.max(0.52, canvasZoom));
        const width = Math.min(1040, Math.max(320, viewport.width - 36));
        const half = (width * editorScale) / 2;
        const center = rect.left + rect.width / 2;
        const left = Math.max(viewport.left + half + 18, Math.min(viewport.right - half - 18, center));
        const belowTop = rect.bottom + 12;
        const measuredHeight =
          Math.min(520, Math.max(220, editor.scrollHeight || editor.offsetHeight || 320)) * editorScale;
        const bottomToolbar = document.querySelector(".bottom-floating-toolbar");
        const bottomToolbarRect = bottomToolbar?.getBoundingClientRect();
        const safeBottom = bottomToolbarRect && bottomToolbarRect.top > viewport.top + 220
          ? Math.min(viewport.bottom, bottomToolbarRect.top - 10)
          : viewport.bottom - 76;
        const roomBelow = safeBottom - belowTop - 18;
        const useAbove = roomBelow < Math.min(260, measuredHeight) && rect.top - viewport.top > 300;
        const top = useAbove ? rect.top - 12 : belowTop;
        const maxHeight = useAbove
          ? Math.max(220, rect.top - viewport.top - 30)
          : Math.max(220, safeBottom - belowTop - 18);
        editor.style.setProperty("--jiaren-media-scale", String(editorScale));
        editor.style.setProperty("--jiaren-media-anchor-left", `${left}px`);
        editor.style.setProperty("--jiaren-media-anchor-top", `${top}px`);
        editor.style.setProperty("--jiaren-media-anchor-width", `${width}px`);
        editor.style.setProperty(
          "--jiaren-media-anchor-max-height",
          `${Math.min(520, maxHeight / editorScale)}px`,
        );
        editor.dataset.jiarenPlacement = useAbove ? "above" : "below";
      }
      frame = window.requestAnimationFrame(sync);
    };
    sync();
    return () => window.cancelAnimationFrame(frame);
  }, [nodeId, active, mediaKind]);
}
function useJiarenVideoSettings() {
  const [settings, setSettings] = sr(
    () => window.__JIAREN_RUNTIME_SETTINGS__ || JIAREN_EMPTY_RUNTIME_SETTINGS,
  );
  dr(() => {
    const sync = (event) =>
      setSettings(
        event?.detail?.runtimeSettings ||
          window.__JIAREN_RUNTIME_SETTINGS__ ||
          JIAREN_EMPTY_RUNTIME_SETTINGS,
      );
    window.addEventListener("jiaren-runtime-settings-change", sync);
    sync();
    return () => window.removeEventListener("jiaren-runtime-settings-change", sync);
  }, []);
  return settings;
}
function jiarenVideoConnection(settings, model) {
  const global = settings?.global || {};
  return {
    baseUrl: String(model?.baseUrl || global.baseUrl || "").trim(),
    apiKey: String(model?.apiKey || global.apiKey || "").trim(),
    fallbackBaseUrl: String(model?.fallbackBaseUrl || global.fallbackBaseUrl || "").trim(),
    fallbackApiKey: String(model?.fallbackApiKey || global.fallbackApiKey || "").trim(),
  };
}
function jiarenVideoModels(settings) {
  const seen = new Set();
  return (Array.isArray(settings?.models) ? settings.models : []).filter((model) => {
    if (!model || model.enabled === false || model.category !== "video") return false;
    const endpoint = String(model.endpointModelId || model.modelId || "").trim();
    const connection = jiarenVideoConnection(settings, model);
    const key = `${model.id || endpoint}:${endpoint}:${connection.baseUrl}`;
    if (!endpoint || !connection.baseUrl || !connection.apiKey || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function jiarenVideoLabel(model) {
  return String(model?.alias || model?.endpointModelId || model?.modelId || model?.id || "");
}
function jiarenVideoMedia(source, name) {
  if (/^data:/i.test(source)) return { name, dataUrl: source };
  if (/^https?:/i.test(source)) return { name, url: source };
  return { name, localPath: source };
}
function jiarenMaterialValue(material) {
  return String(
    material?.url ||
      material?.localPath ||
      material?.dataUrl ||
      material?.source ||
      material?.sourcePath ||
      material?.imageUrl ||
      material?.directImageUrl ||
      material?.videoUrl ||
      material?.directVideoUrl ||
      material?.audioUrl ||
      material?.directAudioUrl ||
      "",
  ).trim();
}
function jiarenMaterialKey(material) {
  return jiarenMaterialValue(material) || String(material?.id || "").trim();
}
function jiarenMergeMaterials(upstream, local, limit) {
  const seen = new Set();
  const merged = [];
  for (const item of [...(Array.isArray(upstream) ? upstream : []), ...(Array.isArray(local) ? local : [])]) {
    const key = jiarenMaterialKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
    if (Number.isFinite(limit) && limit >= 0 && merged.length >= limit) break;
  }
  return merged;
}

const It = 3600,
  Mt = 5e3,
  Jr = Math.ceil((It * 1e3) / Mt),
  Rt = 6e3,
  Wr = Math.ceil((It * 1e3) / Rt),
  U = { images: 9, videos: 3, audios: 3 },
  Zr = [
    { value: "omni", label: "全能参考" },
    { value: "first", label: "首帧图生视频" },
    { value: "firstlast", label: "首尾帧生视频" },
    { value: "multiframe", label: "智能多帧" },
  ],
  yt = (d) =>
    String(d || "")
      .split(/[\n,，]+/)
      .map((E) => E.trim())
      .filter(Boolean),
  Yr = (d) => {
    const E = String(d || "")
      .trim()
      .toLowerCase();
    return E === "first"
      ? "first"
      : E === "firstlast" || E === "first_last" || E === "frames2video"
        ? "firstlast"
        : E === "multiframe" || E === "smart" || E === "smart-multiframe"
          ? "multiframe"
          : "omni";
  },
  Qr = ({ id: d, data: E, selected: We }) => {
    useJiarenOpenCanvasAnchor(d, We, "video");
    const i = ir(d),
      _t = hr(d),
      { getEdges: to, getNodes: ro } = mr(),
      [Ze, P] = sr(null),
      le = Ie(null),
      _ = Ie(null),
      ge = Ie(0),
      m = `video:${d.slice(0, 6)}`,
      { theme: At, style: $t } = lr(),
      Ye = At === "dark",
      Qe = $t === "pixel",
      r = E,
      jiarenSettings = useJiarenVideoSettings(),
      jiarenModels = C(() => jiarenVideoModels(jiarenSettings), [jiarenSettings]),
      jiarenModel =
        jiarenModels.find(
          (model) =>
            model.id === r?.jiarenVideoModelId ||
            model.modelId === r?.jiarenVideoModelId ||
            model.endpointModelId === r?.jiarenVideoModelId,
        ) || jiarenModels[0],
      L =
        r?.providerParams && typeof r.providerParams == "object"
          ? r.providerParams
          : {},
      xe = gr((e) => e.settings.advancedProviders),
      Ae = C(() => [], []),
      h = C(
        () =>
          vr(xe, "video", {
            providerSource: r?.providerSource,
            providerId: r?.providerId,
            providerModel: r?.providerModel,
          }),
        [xe, r?.providerSource, r?.providerId, r?.providerModel],
      ),
      N = !1,
      St = !1,
      et = h.provider ? Nt(h.provider, "video") : [],
      ne = h.providerModel || et[0] || "",
      ve = N && h.provider?.protocol === "agnes",
      y =
        N &&
        h.provider?.protocol === "jimeng-cli" &&
        /seedance|jimeng-video|video/i.test(ne),
      de = Yr(L.frameMode ?? r?.jimengFrameMode),
      Ot = Number(L.frameRate ?? L.frame_rate ?? 24) || 24,
      Ct = L.numFrames ?? L.num_frames ?? "",
      $e = (e) => i({ providerParams: { ...L, ...e } }),
      Ut = typeof r?.model == "string" ? r.model : "",
      Et = /^sora-2(?:-\d{4}-\d{2}-\d{2})?$/.test(Ut),
      Se =
        r?.mainId ||
        (Et
          ? "sora-2"
          : r?.model &&
            ee.find(
              (e) =>
                e.id === r.model ||
                e.apiModelOptions.some((a) => a.value === r.model),
            )?.id) ||
        ee[0].id,
      n = C(() => ee.find((e) => e.id === Se) || ee[0], [Se]),
      k =
        r?.model && n.apiModelOptions.some((e) => e.value === r.model)
          ? r.model
          : n.apiModelOptions[0].value,
      G = !N && n.kind === "happyhorse",
      z = k.endsWith("-i2v") ? "i2v" : k.endsWith("-r2v") ? "r2v" : "t2v",
      D = r?.ratio || n.defaultRatio,
      te = r?.duration ?? n.defaultDuration ?? (n.durations?.[0] || 0),
      ce = r?.resolution || (y ? "720p" : n.defaultResolution || ""),
      K = typeof r?.seed == "number" ? r.seed : 0,
      tt = r?.enhancePrompt ?? !1,
      rt = r?.enableUpsample ?? !1,
      X = Or(k),
      f = X ? br[k] : null,
      A = k === "grok-imagine-video-1.5",
      V = !N && Je(k),
      ot = r?.size === "1280x720" || r?.size === "720x1280" ? r.size : fr(D),
      Pt = !N && n.kind === "sora" && !X,
      Y = !N && k === "veo-omni-10s",
      Oe = !N && X && !!f,
      Ce = N || !X,
      Lt = y
        ? ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"]
        : ve
          ? ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"]
          : V
            ? ["16:9", "9:16"]
            : n.ratios,
      at = y
        ? [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        : ve
          ? [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18]
          : V
            ? []
            : n.durations || [],
      Ue = y
        ? ["480p", "720p", "1080p", "4k"]
        : ve
          ? ["480p", "720p", "1080p"]
          : V
            ? []
            : n.resolutions || [],
      Ee = r?.vfRatio || "16:9",
      Pe = r?.vfDuration || "8s",
      Le = r?.vfResolution || "720p",
      ze = r?.vfAudio ?? !1,
      it = r?.vfSafety ?? 4,
      J =
        A || r?.gkfMode === "image_to_video"
          ? "image_to_video"
          : "reference_to_video",
      re = r?.gkfRatio || "16:9",
      fe = r?.gkfDuration ?? 6,
      be = r?.gkfResolution || "720p",
      De = r?.gkfReferenceUrls || "",
      we = r?.soraMode || "auto",
      Ve = r?.soraRatio || "16:9",
      Fe = r?.soraDuration ?? 4,
      Te = r?.soraResolution || "720p",
      st = r?.soraDeleteVideo ?? !0,
      lt = r?.soraBlockIp ?? !1,
      nt = r?.soraCharacterIds || "",
      dt = r?.soraPrivate ?? !0,
      oe = r?.status || "idle",
      ct = r?.taskId,
      Q = r?.videoUrl,
      ut = r?.progress || "",
      Ge = r?.prompt || "",
      pt = Array.isArray(r?.promptMentions) ? r.promptMentions : [],
      M = nr(d),
      F = C(() => Vr(r?.excludedMaterialIds), [r?.excludedMaterialIds]),
      zt = C(() => Re(M.texts, F), [M.texts, F]),
      Dt = C(() => Re(M.images, F), [M.images, F]),
      Vt = C(() => Re(M.videos, F), [M.videos, F]),
      Ft = C(() => Re(M.audios, F), [M.audios, F]),
      Tt = C(
        () => Fr(F, [...M.texts, ...M.images, ...M.videos, ...M.audios]),
        [F, M.texts, M.images, M.videos, M.audios],
      ),
      ae = Array.isArray(r?.materialOrder) ? r.materialOrder : [],
      mt = _e(zt, ae),
      ue = _e(Dt, ae),
      pe = _e(Vt, ae),
      me = _e(Ft, ae),
      Gt = (e) => i({ materialOrder: e }),
      Kt = (e) => {
        e.origin === "upstream" &&
          i({
            excludedMaterialIds: Hr(F, e.id),
            materialOrder: ae.filter((a) => a !== e.id),
          });
      },
      Ht = () => i({ excludedMaterialIds: [] }),
      H = Array.isArray(r?.localRefImages) ? r.localRefImages : [],
      B = Array.isArray(r?.localRefVideos) ? r.localRefVideos : [],
      j = Array.isArray(r?.localRefAudios) ? r.localRefAudios : [],
      Ne = C(
        () => [
          ...H.map((e, a) => ({
            id: `local::video-image:${e}`,
            kind: "image",
            url: e,
            sourceNodeId: d,
            origin: "local",
            label: `本地图片${a + 1}`,
          })),
          ...B.map((e, a) => ({
            id: `local::video-video:${e}`,
            kind: "video",
            url: e,
            sourceNodeId: d,
            origin: "local",
            label: `本地视频${a + 1}`,
          })),
          ...j.map((e, a) => ({
            id: `local::video-audio:${e}`,
            kind: "audio",
            url: e,
            sourceNodeId: d,
            origin: "local",
            label: `本地音频${a + 1}`,
          })),
        ],
        [H, B, j, d],
      ),
      W = G
        ? z === "t2v"
          ? 0
          : z === "i2v"
            ? 1
            : 9
        : Y || V
          ? 1
          : y
            ? U.images
            : X && f
              ? f.paramKind === "grok-fal" && (A || J !== "reference_to_video")
                ? 1
                : f.maxRefImages
              : n.maxRefImages,
      Ke = y ? U.videos : 0,
      He = y ? U.audios : 0,
      displayImages = C(
        () => jiarenMergeMaterials(ue, Ne.filter((e) => e.kind === "image"), W),
        [ue, Ne, W],
      ),
      displayVideos = C(
        () => jiarenMergeMaterials(pe, Ne.filter((e) => e.kind === "video"), Ke),
        [pe, Ne, Ke],
      ),
      displayAudios = C(
        () => jiarenMergeMaterials(me, Ne.filter((e) => e.kind === "audio"), He),
        [me, Ne, He],
      ),
      ht = C(
        () => [...displayImages, ...displayVideos, ...displayAudios],
        [displayImages, displayVideos, displayAudios],
      ),
      removeLocalMaterial = (e) => {
        const value = jiarenMaterialValue(e);
        if (!value || e.origin !== "local") return;
        if (e.kind === "image")
          i({ localRefImages: H.filter((a) => a !== value) });
        else if (e.kind === "video")
          i({ localRefVideos: B.filter((a) => a !== value) });
        else if (e.kind === "audio")
          i({ localRefAudios: j.filter((a) => a !== value) });
      },
      Bt = C(
        () =>
          n.kind === "seedance" || y
            ? ["text", "image", "video", "audio"]
            : ["text", "image"],
        [n.kind, y],
      ),
      jt = () => {
        const e = mt.map((s) => s.url).filter((s) => !!s),
          a = displayImages.map(jiarenMaterialValue).filter((s) => !!s),
          l = displayVideos.map(jiarenMaterialValue).filter((s) => !!s),
          x = displayAudios.map(jiarenMaterialValue).filter((s) => !!s),
          R = (s) => {
            const c = [];
            for (const I of s) I && !c.includes(I) && c.push(I);
            return c;
          };
        return {
          prompt: e
            .join(
              `
`,
            )
            .trim(),
          imageUrls: R(a),
          videoUrls: R(l),
          audioUrls: R(x),
        };
      },
      qt = async (e) => {
        const l = await (await fetch(e)).blob();
        return new Promise((x, R) => {
          const s = new FileReader();
          ((s.onload = () => x(String(s.result))),
            (s.onerror = R),
            s.readAsDataURL(l));
        });
      },
      T = () => {
        le.current && (window.clearInterval(le.current), (le.current = null));
      },
      Xt = () => ((ge.current += 1), ge.current),
      $ = (e) => ge.current === e,
      ie = (e) => {
        (_.current === e && ((_.current = null), T()),
          e(new Error("用户已停止生成")));
      },
      Be = () => {
        const e = _.current;
        ((_.current = null), T(), e && e(new Error("用户已停止生成")));
      };
    dr(() => () => Be(), []);
    const Jt = (e) => {
        const a = ee.find((x) => x.id === e) || ee[0],
          l = a.apiModelOptions[0].value;
        i({
          mainId: a.id,
          model: l,
          ratio: a.defaultRatio,
          duration: a.defaultDuration ?? a.durations?.[0],
          resolution: a.defaultResolution || "",
          ...(l === "grok-imagine-video-1.5"
            ? { gkfMode: "image_to_video" }
            : {}),
          ...(Je(l) ? { ratio: "16:9", resolution: "" } : {}),
        });
      },
      gt = (e, a) => (
        T(),
        new Promise((l, x) => {
          _.current = x;
          let R = 0;
          const s = Mt,
            c = Jr;
          let I = "";
          le.current = window.setInterval(async () => {
            if (((R += 1), !$(a))) {
              ie(x);
              return;
            }
            if (R > c) {
              ((_.current = null),
                T(),
                i({ status: "error", error: "轮询超时" }),
                P("轮询超时"),
                g.error("轮询超时", m),
                x(new Error("轮询超时")));
              return;
            }
            try {
              const v = G ? await Lr(e) : await zr(e, k),
                u = String(v.status || "")
                  .trim()
                  .toUpperCase(),
                q = String(v.progress ?? "");
              if (!$(a)) {
                ie(x);
                return;
              }
              if (
                (q &&
                  q !== I &&
                  ((I = q),
                  g.debug(`[${R}/${c}] status=${v.status} progress=${q}`, m)),
                ["SUCCESS", "SUCCEEDED", "COMPLETED"].includes(u) && v.videoUrl)
              )
                ((_.current = null),
                  T(),
                  i({
                    status: "success",
                    videoUrl: v.videoUrl,
                    progress: "100%",
                  }),
                  g.success(`任务完成 → ${v.videoUrl}`, m),
                  he.notifyComplete(d, "video"),
                  l());
              else if (["FAILURE", "FAILED"].includes(u)) {
                ((_.current = null), T());
                const b = v.failReason || "生成失败";
                (i({ status: "error", error: b }),
                  P(b),
                  g.error(`生成失败: ${b}`, m),
                  x(new Error(b)));
              } else i({ status: "polling", progress: q });
            } catch (v) {
              if (!$(a)) {
                ie(x);
                return;
              }
              console.warn("轮询出错", v?.message);
            }
          }, s);
        })
      ),
      ke = Ie(null),
      Wt = (e) => (
        T(),
        new Promise((a, l) => {
          _.current = l;
          let x = 0;
          const R = Rt,
            s = Wr;
          le.current = window.setInterval(async () => {
            if (((x += 1), !$(e))) {
              ie(l);
              return;
            }
            if (x > s) {
              ((_.current = null),
                T(),
                i({ status: "error", error: "FAL 轮询超时" }),
                P("FAL 轮询超时"),
                g.error("FAL 轮询超时", m),
                l(new Error("FAL 轮询超时")));
              return;
            }
            try {
              const c = await Dr(ke.current);
              if (!$(e)) {
                ie(l);
                return;
              }
              if (
                (x % 10 === 0 &&
                  g.debug(`[FAL ${x}/${s}] status=${c.status}`, m),
                c.status === "completed" && c.videoUrl)
              )
                ((_.current = null),
                  T(),
                  i({
                    status: "success",
                    videoUrl: c.videoUrl,
                    progress: "100%",
                  }),
                  g.success(`FAL 视频完成 → ${c.videoUrl}`, m),
                  he.notifyComplete(d, "video"),
                  a());
              else if (c.status === "failed") {
                ((_.current = null), T());
                const I = c.error || "FAL 生成失败";
                (i({ status: "error", error: I }),
                  P(I),
                  g.error(`FAL 生成失败: ${I}`, m),
                  l(new Error(I)));
              } else
                i({
                  status: "polling",
                  progress: `${Math.min(95, Math.round(20 + (x / s) * 75))}%`,
                });
            } catch (c) {
              if (!$(e)) {
                ie(l);
                return;
              }
              console.warn("FAL 轮询出错", c?.message);
            }
          }, R);
        })
      ),
      xt = async () => {
        P(null);
        if (!jiarenModel) {
          P("请先在 API 设置中启用可用的视频模型。");
          return;
        }
        const { prompt: e, imageUrls: a, videoUrls: l, audioUrls: x } = jt(),
          R = Kr(Ge, pt, ht),
          s = (e || R || "").trim();
        if (!s && !(G && z !== "t2v")) {
          (P("未连接 text 节点也未填写 prompt"),
            g.error("生成中止: 缺少 prompt", m));
          return;
        }
        if (G && z !== "t2v" && a.length === 0) {
          (P(`Happy Horse ${z} 至少需要 1 张参考图`),
            g.error(`生成中止: Happy Horse ${z} 缺少参考图`, m));
          return;
        }
        if (Y && a.length === 0) {
          (P("veo-omni-10s 需要 1 张参考图"),
            g.error("生成中止: veo-omni-10s 缺少参考图", m));
          return;
        }
        if (V && a.length === 0) {
          (P("Grok 1.5 New 需要 1 张参考图"),
            g.error("生成中止: Grok 1.5 New 缺少参考图", m));
          return;
        }
        const c = Xt();
        (Be(),
          (ke.current = null),
          he.primeAudio(),
          i({
            status: "submitting",
            error: null,
            videoUrl: null,
            taskId: null,
          }));
        try {
          if (!window.jiaren?.runtime?.generateVideo)
            throw new Error("Jiaren 视频运行时未初始化。");
          const connection = jiarenVideoConnection(jiarenSettings, jiarenModel),
            storage = window.__JIAREN_STORAGE_SETTINGS__ || {},
            result = await window.jiaren.runtime.generateVideo({
              modelId: jiarenModel.id,
              modelAlias: jiarenVideoLabel(jiarenModel),
              endpointModelId: jiarenModel.endpointModelId || jiarenModel.modelId,
              fallbackEndpointModelId: jiarenModel.fallbackEndpointModelId,
              requestMode: jiarenModel.requestMode,
              apiGroup: jiarenModel.apiGroup,
              ...connection,
              mode: a.length ? "image-to-video" : "text-to-video",
              prompt: s,
              aspectRatio: D,
              duration: Number(String(te).replace(/[^0-9.]/g, "")) || 5,
              resolution: ce || "720p",
              seed: K > 0 ? K : void 0,
              providerParams: L,
              referenceImagePaths: a,
              referenceImages: a.map((source, index) =>
                jiarenVideoMedia(source, `reference-${index + 1}`),
              ),
              referenceVideoPaths: l,
              referenceAudioPaths: x,
              cacheDir: storage.cacheDir,
              downloadsDir: storage.downloadsDir,
            });
          if (!$(c)) return;
          const asset = (result?.assets || []).find((item) => item?.type === "video") ||
              (result?.assets || [])[0],
            videoUrl = asset?.localPath || asset?.url || asset?.dataUrl || "";
          if (result?.status !== "succeeded" || !videoUrl)
            throw new Error(result?.message || "视频模型没有返回可用视频。");
          (i({
            status: "success",
            videoUrl,
            videoUrls: [videoUrl],
            lastPrompt: s,
            progress: "100%",
          }),
            g.success(`Jiaren 视频完成 → ${videoUrl}`, m),
            he.notifyComplete(d, "video"));
          return;
          if (N && h.provider) {
            const b = ne,
              S = a.slice(0, Math.max(1, W || n.maxRefImages || 8)),
              w = l.slice(0, Ke),
              p = x.slice(0, He);
            g.info(
              y
                ? `扩展平台视频提交: ${h.provider.label || h.provider.id} · ${b} · 图${S.length}/视${w.length}/音${p.length}`
                : `扩展平台视频提交: ${h.provider.label || h.provider.id} · ${b} · refs=${S.length}`,
              m,
            );
            const se = await Cr({
              providerId: h.provider.id,
              providerModel: b,
              model: b,
              prompt: s,
              aspect_ratio: D,
              ratio: D,
              duration: te,
              resolution: ce,
              seed: K > 0 ? K : void 0,
              images: S,
              videos: w,
              audios: p,
              providerParams: y ? { ...L, frameMode: de } : L,
            });
            if (!$(c)) return;
            const O = se.videoUrls[0];
            if (!O) throw new Error("扩展平台没有返回视频。");
            (i({
              status: "success",
              videoUrl: O,
              videoUrls: se.videoUrls,
              remoteVideoUrls: se.remoteVideoUrls,
              taskId: se.taskId || null,
              lastPrompt: s,
              progress: "100%",
            }),
              g.success(`扩展平台视频完成 → ${O}`, m),
              he.notifyComplete(d, "video"));
            return;
          }
          if (G) {
            const b = z === "t2v" ? [] : a.slice(0, z === "i2v" ? 1 : 9);
            g.info(
              `提交 Happy Horse: ${k} · ${te}s · ${ce || "720p"} · ${D} · refs=${b.length}`,
              m,
            );
            const S = await Ur({
              model: k,
              prompt: s || void 0,
              duration: Number(te) || 4,
              ratio: D,
              resolution: ce === "1080p" ? "1080p" : "720p",
              images: b.length ? b : void 0,
            });
            if (!$(c)) return;
            (i({
              status: "polling",
              taskId: S.taskId,
              lastPrompt: s,
              progress: "0%",
            }),
              g.info(`Happy Horse 任务 ${S.taskId} 已提交，开始轮询`, m),
              await gt(S.taskId, c));
            return;
          }
          if (X && f) {
            const b =
                f.paramKind === "grok-fal" && (A || J !== "reference_to_video")
                  ? 1
                  : f.maxRefImages,
              S = a.slice(0, b);
            let w;
            S.length > 0 && (w = S);
            const p = { apiModel: k, prompt: s, providerParams: L };
            if ((w && w.length && (p.images = w), f.paramKind === "veo-fal"))
              ((p.aspect_ratio = Ee),
                (p.duration = Pe),
                (p.resolution = Le),
                (p.generate_audio = ze),
                (p.safety_tolerance = it));
            else if (f.paramKind === "grok-fal") {
              const qe = A ? "image_to_video" : J,
                Xe = A
                  ? []
                  : yt(De).slice(0, Math.max(0, 7 - (w?.length || 0)));
              if (A && (!w || w.length === 0))
                throw new Error("Grok Video 1.5 需要至少 1 张参考图");
              if (
                !A &&
                qe === "reference_to_video" &&
                (!w || w.length === 0) &&
                Xe.length === 0
              )
                throw new Error("Grok FAL 参考生视频需要至少 1 张参考图或 URL");
              ((p.gkMode = qe),
                A ||
                  (p.gkRatio =
                    qe === "reference_to_video" && re === "auto" ? "16:9" : re),
                (p.gkDuration = fe),
                (p.resolution = be),
                (p.image_mode = f.defaultImageMode || "base64"),
                Xe.length && (p.gkReferenceUrls = Xe));
            } else if (f.paramKind === "sora-fal") {
              if (we === "image_to_video" && (!w || w.length === 0))
                throw new Error("Sora2 图生视频需要 1 张参考图");
              ((p.soraMode = we),
                (p.soraRatio = Ve),
                (p.soraDuration = Fe),
                (p.soraResolution = Te),
                (p.soraDeleteVideo = st),
                (p.soraBlockIp = lt),
                (p.soraCharacterIds = nt),
                (p.image_mode = f.defaultImageMode || "base64"));
            }
            const se =
              f.paramKind === "veo-fal"
                ? `ratio=${Ee} dur=${Pe} res=${Le} audio=${ze}`
                : f.paramKind === "grok-fal"
                  ? A
                    ? `model=1.5 mode=image_to_video dur=${fe}s res=${be} image=${f.defaultImageMode || "base64"}`
                    : `mode=${J} ratio=${J === "reference_to_video" && re === "auto" ? "16:9" : re} dur=${fe}s res=${be} image=${f.defaultImageMode || "base64"} urls=${yt(De).length}`
                  : `mode=${we} ratio=${Ve} dur=${Fe}s res=${Te} image=base64`;
            g.info(
              `提交 FAL 视频: ${k} ${se} refs=${w?.length || 0} prompt="${s.slice(0, 30)}…"`,
              m,
            );
            const O = await Er(p);
            if (!$(c)) return;
            O.sync && O.videoUrl
              ? (i({
                  status: "success",
                  videoUrl: O.videoUrl,
                  lastPrompt: s,
                  progress: "100%",
                }),
                g.success(`FAL 同步完成 → ${O.videoUrl}`, m),
                he.notifyComplete(d, "video"))
              : ((ke.current = {
                  responseUrl: O.responseUrl,
                  endpoint: O.endpoint,
                  requestId: O.requestId,
                }),
                i({ status: "polling", lastPrompt: s, progress: "15%" }),
                g.info(`FAL 异步任务 requestId=${O.requestId} 进入轮询…`, m),
                await Wt(c));
            return;
          }
          const I = a.slice(0, Y || V ? 1 : n.maxRefImages);
          let v;
          if (n.supportImages && I.length > 0)
            if (n.kind === "grok") v = I;
            else {
              const b = [];
              for (const S of I)
                try {
                  const w = await qt(S);
                  if (!$(c)) return;
                  b.push(w);
                } catch (w) {
                  console.warn("图像编码失败", w);
                }
              b.length && (v = b);
            }
          const u = { model: k, prompt: s, providerParams: L };
          (V
            ? (u.size = ot)
            : n.kind === "grok"
              ? ((u.ratio = D),
                (u.duration = Number(te) || n.defaultDuration || 15),
                (u.resolution = ce || n.defaultResolution || "720P"),
                K > 0 && (u.seed = K))
              : n.kind === "sora"
                ? ((u.aspect_ratio = D),
                  (u.duration = Number(te) || n.defaultDuration || 15),
                  (u.private = dt),
                  K > 0 && (u.seed = K))
                : ((u.aspect_ratio = D),
                  Y
                    ? (u.duration = 10)
                    : ((u.enhance_prompt = tt), rt && (u.enable_upsample = !0)),
                  K > 0 && (u.seed = K)),
            v && v.length && (u.images = v),
            g.info(
              `提交任务: kind=${n.kind} model=${k} ratio=${D}` +
                (V
                  ? ` size=${u.size} v1-multipart`
                  : n.kind === "grok"
                    ? ` duration=${u.duration}s resolution=${u.resolution}`
                    : n.kind === "sora"
                      ? ` duration=${u.duration}s private=${u.private}`
                      : Y
                        ? " duration=10s endpoint=/v1/videos"
                        : ` enhance=${u.enhance_prompt}`) +
                ` refs=${v?.length || 0} prompt="${s.slice(0, 30)}…"`,
              m,
            ));
          const q = await Pr(u);
          if (!$(c)) return;
          (i({
            status: "polling",
            taskId: q.taskId,
            lastPrompt: s,
            progress: "0%",
          }),
            g.info(`异步任务已提交 taskId=${q.taskId} 进入轮询…`, m),
            await gt(q.taskId, c));
        } catch (I) {
          if (!$(c)) return;
          const v = I?.message || "提交失败";
          (P(v),
            i({ status: "error", error: v }),
            g.error(`提交失败: ${v}`, m));
        }
      },
      Zt = () => {
        ((ge.current += 1),
          Be(),
          (ke.current = null),
          P(null),
          i({ status: "idle", progress: "已停止", error: null, taskId: null }),
          g.warn("用户主动停止：已停止本地轮询，远端任务可能仍会完成", m));
      };
    cr(
      d,
      async () => {
        oe === "submitting" || oe === "polling" || (await xt());
      },
      "video",
    );
    const Yt = jr((e) => e.start),
      ye = (e, a) => {
        e.button !== 0 ||
          !(e.ctrlKey || e.metaKey) ||
          (e.preventDefault(),
          e.stopPropagation(),
          Yt(a, e.clientX, e.clientY));
      },
      Qt = (e) => {
        const value = jiarenMaterialValue(e);
        if (e.kind === "image" && value) {
          const a = Array.isArray(r?.localRefImages) ? r.localRefImages : [];
          if (a.indexOf(value) !== -1) return;
          const l = G ? W : V ? 1 : y ? U.images : (n.maxRefImages || 7) + 4;
          if (a.length >= l) return;
          i({ localRefImages: [...a, value] });
        } else if (e.kind === "video" && value && y) {
          const a = Array.isArray(r?.localRefVideos) ? r.localRefVideos : [];
          if (a.indexOf(value) !== -1 || a.length >= U.videos) return;
          i({ localRefVideos: [...a, value] });
        } else if (e.kind === "audio" && value && y) {
          const a = Array.isArray(r?.localRefAudios) ? r.localRefAudios : [];
          if (a.indexOf(value) !== -1 || a.length >= U.audios) return;
          i({ localRefAudios: [...a, value] });
        } else
          e.kind === "text" &&
            typeof e.text == "string" &&
            i({ prompt: e.text });
      },
      { dropProps: er, isAccepting: vt } = qr({
        id: d,
        accepts: y ? ["image", "video", "audio", "text"] : ["image", "text"],
        onDrop: Qt,
      }),
      ft = oe === "submitting" || oe === "polling",
      je = displayImages.length,
      tr = displayVideos.length,
      rr = displayAudios.length,
      or = G
        ? z === "t2v"
          ? "上游素材 · 当前模型不使用参考图"
          : `上游素材 · 参考图 ${Math.min(je, W)}/${W}`
        : y
          ? `上游素材 · 图${Math.min(je, U.images)}/${U.images} 视${Math.min(tr, U.videos)}/${U.videos} 音${Math.min(rr, U.audios)}/${U.audios}`
          : `上游素材 · 参考图 ${Math.min(je, W)}/${W}`;
    const editorPanel = o("section", {
      ...er,
      className: `t8-original-scope t8-original-portal jiaren-media-bottom-editor jiaren-video-bottom-editor nodrag nopan ${We ? "is-open" : "is-hidden"}`,
      "data-jiaren-media-editor": "video",
      "data-jiaren-node-id": d,
      style: {
        background: "rgba(20,20,22,.92)",
        backdropFilter: "blur(8px)",
        boxShadow: vt
          ? "0 0 0 2px rgba(52,211,153,.45), 0 12px 30px rgba(52,211,153,.18)"
          : void 0,
      },
      children: [
        t(bt, {
          type: "target",
          position: wt.Left,
          className: "!bg-rose-400 !border-0",
        }),
        t(bt, {
          type: "source",
          position: wt.Right,
          className: "!bg-rose-400 !border-0",
        }),
        o("div", {
          className:
            "flex items-center gap-2 px-3 py-2 border-b border-white/10",
          children: [
            t("div", {
              className: "w-6 h-6 rounded flex items-center justify-center",
              style: {
                background: "rgba(244,63,94,.2)",
                color: "#fda4af",
                boxShadow: "inset 0 0 0 1px rgba(244,63,94,.45)",
              },
              children: t(Z.Video, { size: 13 }),
            }),
            o("div", {
              className: "flex-1",
              children: [
                t("div", {
                  className: "text-sm font-semibold text-white",
                  children: "视频",
                }),
                t("div", {
                  className: "text-[10px] text-white/40",
                  children: `用户 API 设置 · ${jiarenVideoLabel(jiarenModel) || "未配置模型"}`,
                }),
              ],
            }),
          ],
        }),
        o("nav", {
          className: "jiaren-media-mode-tabs",
          "aria-label": "视频节点模式",
          children: [
            t("button", {
              type: "button",
              className: "is-active",
              onClick: () =>
                document
                  .querySelector('[data-jiaren-media-editor="video"] textarea')
                  ?.focus(),
              children: "生成",
            }),
            t("button", {
              type: "button",
              onClick: () =>
                document
                  .querySelector('[data-jiaren-media-editor="video"] input[type="file"]')
                  ?.click(),
              children: "上传",
            }),
          ],
        }),
        o("div", {
          className: "p-2.5 space-y-2",
          onMouseDown: (e) => e.stopPropagation(),
          children: [
            Ae.length > 0 &&
              o("div", {
                className:
                  "rounded border border-white/10 bg-white/[0.03] p-2 space-y-2",
                children: [
                  o("button", {
                    type: "button",
                    onClick: () =>
                      i({ advancedProviderOpen: !r?.advancedProviderOpen }),
                    className:
                      "w-full flex items-center justify-between text-[10px] font-semibold text-white/70 hover:text-white",
                    children: [
                      t("span", { children: "高级来源" }),
                      t("span", {
                        children:
                          N && h.provider ? h.provider.label : "默认视频接口",
                      }),
                    ],
                  }),
                  r?.advancedProviderOpen &&
                    o("div", {
                      className: "space-y-2",
                      children: [
                        o("div", {
                          children: [
                            t("label", {
                              className: "text-[10px] text-white/50 block mb-1",
                              children: "平台",
                            }),
                            o("select", {
                              value: N ? h.providerId : "zhenzhen",
                              onChange: (e) => {
                                const a = e.target.value;
                                if (a === "zhenzhen") {
                                  i({
                                    providerSource: "zhenzhen",
                                    providerId: "",
                                    providerModel: "",
                                  });
                                  return;
                                }
                                const l = Ae.find((R) => R.id === a);
                                if (!l) return;
                                const x = Nt(l, "video");
                                i({
                                  providerSource: l.protocol,
                                  providerId: l.id,
                                  providerModel: x[0] || "",
                                  ...(l.protocol === "agnes"
                                    ? {
                                        ratio: "16:9",
                                        duration: 5,
                                        resolution: "720p",
                                        providerParams: { ...L, frameRate: 24 },
                                      }
                                    : {}),
                                });
                              },
                              style: {
                                background: "#18181b",
                                color: "#ffffff",
                              },
                              className:
                                "w-full rounded border border-white/10 px-2 py-1 text-xs outline-none focus:border-white/30",
                              children: [
                                t("option", {
                                  value: "zhenzhen",
                                  style: {
                                    background: "#18181b",
                                    color: "#ffffff",
                                  },
                                  children: "JiarenAI（默认）",
                                }),
                                Ae.map((e) =>
                                  t(
                                    "option",
                                    {
                                      value: e.id,
                                      style: {
                                        background: "#18181b",
                                        color: "#ffffff",
                                      },
                                      children: e.label || e.id,
                                    },
                                    e.id,
                                  ),
                                ),
                              ],
                            }),
                          ],
                        }),
                        N &&
                          h.provider &&
                          o("div", {
                            children: [
                              t("label", {
                                className:
                                  "text-[10px] text-white/50 block mb-1",
                                children: "外部模型",
                              }),
                              t("select", {
                                value: ne,
                                onChange: (e) =>
                                  i({ providerModel: e.target.value }),
                                style: {
                                  background: "#18181b",
                                  color: "#ffffff",
                                },
                                className:
                                  "w-full rounded border border-white/10 px-2 py-1 text-xs outline-none focus:border-white/30",
                                children: et.map((e) =>
                                  t(
                                    "option",
                                    {
                                      value: e,
                                      style: {
                                        background: "#18181b",
                                        color: "#ffffff",
                                      },
                                      children: e,
                                    },
                                    e,
                                  ),
                                ),
                              }),
                            ],
                          }),
                        St &&
                          t("div", {
                            className:
                              "text-[10px] text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1",
                            children:
                              "当前画布记录的扩展平台未启用或不存在，已临时回到默认来源。",
                          }),
                      ],
                    }),
                ],
              }),
            !N &&
              o("div", {
                children: [
                  t("label", {
                    className: "text-[10px] text-white/50 block mb-1",
                    children: "视频模型",
                  }),
                  t("select", {
                    value: jiarenModel?.id || "",
                    onChange: (e) => i({ jiarenVideoModelId: e.target.value }),
                    disabled: jiarenModels.length === 0,
                    className:
                      "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                    children: jiarenModels.length
                      ? jiarenModels.map((e) =>
                          t(
                            "option",
                            {
                              value: e.id,
                              className: "bg-zinc-900",
                              children: jiarenVideoLabel(e),
                            },
                            e.id,
                          ),
                        )
                      : t("option", {
                          value: "",
                          children: "请先在 API 设置同步可用视频模型",
                        }),
                  }),
                ],
              }),
            !1 &&
              n.apiModelOptions.length > 1 &&
              o("div", {
                children: [
                  t("label", {
                    className: "text-[10px] text-white/50 block mb-1",
                    children: "具体模型",
                  }),
                  t("select", {
                    value: k,
                    onChange: (e) => {
                      const a = e.target.value;
                      i({
                        model: a,
                        ...(a === "grok-imagine-video-1.5"
                          ? { gkfMode: "image_to_video" }
                          : {}),
                        ...(Je(a)
                          ? { ratio: "16:9", size: "1280x720", resolution: "" }
                          : {}),
                        ...(a === "sora-2-zhenzhen"
                          ? { ratio: "16:9", duration: 15, resolution: "" }
                          : {}),
                        ...(a === "veo-omni-10s"
                          ? { ratio: "16:9", duration: 10, resolution: "" }
                          : {}),
                      });
                    },
                    className:
                      "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                    children: n.apiModelOptions.map((e) =>
                      t(
                        "option",
                        {
                          value: e.value,
                          className: "bg-zinc-900",
                          children: e.label,
                        },
                        e.value,
                      ),
                    ),
                  }),
                ],
              }),
            t(Xr, {
              nodeId: d,
              nodeType: "video",
              data: r,
              update: i,
              context: {
                providerSource: N ? h.providerSource : "zhenzhen",
                providerId: h.providerId,
                providerModel: N ? ne : k,
                model: k,
                apiModel: k,
                mainId: Se,
                providerKind: X ? "fal" : n.kind,
              },
            }),
            Oe &&
              f?.paramKind === "veo-fal" &&
              o(Me, {
                children: [
                  o("div", {
                    className: "grid grid-cols-2 gap-1.5",
                    children: [
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "比例 (FAL)",
                          }),
                          t("select", {
                            value: Ee,
                            onChange: (e) => i({ vfRatio: e.target.value }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: wr.map((e) =>
                              t(
                                "option",
                                {
                                  value: e,
                                  className: "bg-zinc-900",
                                  children: e,
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "时长",
                          }),
                          t("select", {
                            value: Pe,
                            onChange: (e) => i({ vfDuration: e.target.value }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: Nr.map((e) =>
                              t(
                                "option",
                                {
                                  value: e,
                                  className: "bg-zinc-900",
                                  children: e,
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  o("div", {
                    className: "grid grid-cols-2 gap-1.5",
                    children: [
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "分辨率",
                          }),
                          t("select", {
                            value: Le,
                            onChange: (e) =>
                              i({ vfResolution: e.target.value }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: kr.map((e) =>
                              t(
                                "option",
                                {
                                  value: e,
                                  className: "bg-zinc-900",
                                  children: e,
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "安全等级",
                          }),
                          t("select", {
                            value: String(it),
                            onChange: (e) =>
                              i({ vfSafety: Number(e.target.value) }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: [1, 2, 3, 4, 5, 6].map((e) =>
                              t(
                                "option",
                                {
                                  value: e,
                                  className: "bg-zinc-900",
                                  children: e,
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  o("label", {
                    className:
                      "flex items-center gap-1 text-[10px] text-white/60 cursor-pointer",
                    children: [
                      t("input", {
                        type: "checkbox",
                        checked: ze,
                        onChange: (e) => i({ vfAudio: e.target.checked }),
                        className: "accent-rose-400",
                      }),
                      "生成音频",
                    ],
                  }),
                ],
              }),
            Oe &&
              f?.paramKind === "grok-fal" &&
              o(Me, {
                children: [
                  A
                    ? t("div", {
                        className:
                          "rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] leading-relaxed text-white/60",
                        children:
                          "Grok Video 1.5 仅支持图生视频，必须有 1 张参考图；图像传入模式默认 Base64，不发送比例参数。",
                      })
                    : o("div", {
                        className: "grid grid-cols-2 gap-1.5",
                        children: [
                          o("div", {
                            children: [
                              t("label", {
                                className:
                                  "text-[10px] text-white/50 block mb-1",
                                children: "模式 (FAL)",
                              }),
                              t("select", {
                                value: J,
                                onChange: (e) => {
                                  const a = e.target.value;
                                  i({
                                    gkfMode: a,
                                    ...(a === "reference_to_video" &&
                                    re === "auto"
                                      ? { gkfRatio: "16:9" }
                                      : {}),
                                  });
                                },
                                className:
                                  "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                                children: yr.map((e) =>
                                  t(
                                    "option",
                                    {
                                      value: e.value,
                                      className: "bg-zinc-900",
                                      children: e.label,
                                    },
                                    e.value,
                                  ),
                                ),
                              }),
                            ],
                          }),
                          o("div", {
                            children: [
                              t("label", {
                                className:
                                  "text-[10px] text-white/50 block mb-1",
                                children: "比例 (FAL)",
                              }),
                              t("select", {
                                value: re,
                                onChange: (e) =>
                                  i({ gkfRatio: e.target.value }),
                                className:
                                  "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                                children: Ir.map((e) =>
                                  t(
                                    "option",
                                    {
                                      value: e,
                                      className: "bg-zinc-900",
                                      children: e,
                                    },
                                    e,
                                  ),
                                ),
                              }),
                            ],
                          }),
                        ],
                      }),
                  o("div", {
                    className: "grid grid-cols-2 gap-1.5",
                    children: [
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "时长(s)",
                          }),
                          t("input", {
                            type: "number",
                            value: fe,
                            min: 1,
                            max: 30,
                            onChange: (e) =>
                              i({ gkfDuration: Number(e.target.value) || 6 }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                          }),
                        ],
                      }),
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "分辨率",
                          }),
                          t("select", {
                            value: be,
                            onChange: (e) =>
                              i({ gkfResolution: e.target.value }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: Mr.map((e) =>
                              t(
                                "option",
                                {
                                  value: e,
                                  className: "bg-zinc-900",
                                  children: e,
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  !A &&
                    J === "reference_to_video" &&
                    o("div", {
                      children: [
                        t("label", {
                          className: "text-[10px] text-white/50 block mb-1",
                          children: "公开参考 URL(可选)",
                        }),
                        t("textarea", {
                          value: De,
                          onChange: (e) =>
                            i({ gkfReferenceUrls: e.target.value }),
                          placeholder: "每行或逗号分隔，最多补足到 7 张",
                          className:
                            "w-full h-12 resize-none rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                        }),
                      ],
                    }),
                  t("div", {
                    className: "text-[10px] text-white/45 leading-relaxed",
                    children: A
                      ? "只取第 1 张参考图，提交到 v1.5 image-to-video；Base64 为默认传入方式。"
                      : J === "reference_to_video"
                        ? "参考生视频最多 7 张，优先使用上游/本地图，再补充 URL。"
                        : "图生视频只取第 1 张参考图；无图时保留文生视频 fallback。",
                  }),
                ],
              }),
            Oe &&
              f?.paramKind === "sora-fal" &&
              o(Me, {
                children: [
                  o("div", {
                    className: "grid grid-cols-2 gap-1.5",
                    children: [
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "FAL Mode",
                          }),
                          t("select", {
                            value: we,
                            onChange: (e) => i({ soraMode: e.target.value }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: Rr.map((e) =>
                              t(
                                "option",
                                {
                                  value: e.value,
                                  className: "bg-zinc-900",
                                  children: e.label,
                                },
                                e.value,
                              ),
                            ),
                          }),
                        ],
                      }),
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "比例",
                          }),
                          t("select", {
                            value: Ve,
                            onChange: (e) => i({ soraRatio: e.target.value }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: _r.map((e) =>
                              t(
                                "option",
                                {
                                  value: e,
                                  className: "bg-zinc-900",
                                  children: e,
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  o("div", {
                    className: "grid grid-cols-2 gap-1.5",
                    children: [
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "时长",
                          }),
                          t("select", {
                            value: String(Fe),
                            onChange: (e) =>
                              i({ soraDuration: Number(e.target.value) || 4 }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: Ar.map((e) =>
                              o(
                                "option",
                                {
                                  value: e,
                                  className: "bg-zinc-900",
                                  children: [e, "s"],
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "分辨率",
                          }),
                          t("select", {
                            value: Te,
                            onChange: (e) =>
                              i({ soraResolution: e.target.value }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: $r.map((e) =>
                              t(
                                "option",
                                {
                                  value: e,
                                  className: "bg-zinc-900",
                                  children: e,
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  o("div", {
                    children: [
                      t("label", {
                        className: "text-[10px] text-white/50 block mb-1",
                        children: "Character IDs",
                      }),
                      t("input", {
                        value: nt,
                        onChange: (e) =>
                          i({ soraCharacterIds: e.target.value }),
                        placeholder: "id1, id2",
                        className:
                          "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30 placeholder:text-white/25",
                      }),
                    ],
                  }),
                  o("div", {
                    className: "grid grid-cols-2 gap-1.5",
                    children: [
                      o("label", {
                        className:
                          "flex items-center gap-1 text-[10px] text-white/60 cursor-pointer",
                        children: [
                          t("input", {
                            type: "checkbox",
                            checked: st,
                            onChange: (e) =>
                              i({ soraDeleteVideo: e.target.checked }),
                            className: "accent-rose-400",
                          }),
                          "Delete Video",
                        ],
                      }),
                      o("label", {
                        className:
                          "flex items-center gap-1 text-[10px] text-white/60 cursor-pointer",
                        children: [
                          t("input", {
                            type: "checkbox",
                            checked: lt,
                            onChange: (e) =>
                              i({ soraBlockIp: e.target.checked }),
                            className: "accent-rose-400",
                          }),
                          "Block IP",
                        ],
                      }),
                    ],
                  }),
                  t("div", {
                    className:
                      "rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] leading-relaxed text-white/45",
                    children:
                      "默认用 Base64 传入第 1 张参考图；Auto 无图时走文生视频。",
                  }),
                ],
              }),
            Pt &&
              o("div", {
                className:
                  "rounded border border-white/10 bg-white/5 px-2 py-1.5 space-y-1.5",
                children: [
                  o("div", {
                    className: "flex items-center justify-between gap-2",
                    children: [
                      t("span", {
                        className: "text-[10px] font-semibold text-white/70",
                        children: "JiarenAI Sora2 API",
                      }),
                      t("span", {
                        className: "text-[9px] text-white/35",
                        children: "参考图 ≤ 1",
                      }),
                    ],
                  }),
                  o("label", {
                    className:
                      "flex items-center gap-1.5 text-[10px] text-white/60 cursor-pointer",
                    children: [
                      t("input", {
                        type: "checkbox",
                        checked: dt,
                        onChange: (e) => i({ soraPrivate: e.target.checked }),
                        className: "accent-rose-400",
                      }),
                      "Private",
                    ],
                  }),
                  t("div", {
                    className: "text-[10px] text-white/40 leading-relaxed",
                    children:
                      "提交到 /v2/videos/generations，真实模型名为 sora-2；参考图会转为裸 Base64。",
                  }),
                ],
              }),
            Y &&
              t("div", {
                className:
                  "rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] leading-relaxed text-white/45",
                children:
                  "Veo Omni 走 /v1/videos，固定调用 omni_flash-10s，需要 1 张参考图；16:9=1280x720，9:16=720x1280。",
              }),
            V &&
              o(Me, {
                children: [
                  o("div", {
                    children: [
                      t("label", {
                        className: "text-[10px] text-white/50 block mb-1",
                        children: "尺寸",
                      }),
                      t("select", {
                        value: ot,
                        onChange: (e) => {
                          const a = e.target.value;
                          i({
                            size: a,
                            ratio: a === "720x1280" ? "9:16" : "16:9",
                          });
                        },
                        className:
                          "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                        children: Sr.map((e) =>
                          t(
                            "option",
                            {
                              value: e.value,
                              className: "bg-zinc-900",
                              children: e.label,
                            },
                            e.value,
                          ),
                        ),
                      }),
                    ],
                  }),
                  t("div", {
                    className:
                      "rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] leading-relaxed text-white/45",
                    children:
                      "Grok 1.5 New 需要 1 张参考图；按 Comfly 原节点提交 model / prompt / size / input_reference，时长由具体模型 6s / 10s / 15s 决定。",
                  }),
                ],
              }),
            G &&
              o("div", {
                className:
                  "rounded border border-amber-300/20 bg-amber-400/[0.06] px-2 py-1.5 text-[10px] leading-relaxed text-white/55",
                children: [
                  z === "t2v"
                    ? "文生视频只使用提示词，不发送画布中的参考图。"
                    : z === "i2v"
                      ? "图生视频必须有参考图，只取排序后的第 1 张作为首图。"
                      : "参考图生视频需要 1-9 张图，可在提示词中使用“图1 / 图2”指代。",
                  t("div", {
                    className: "mt-1 text-white/35",
                    children:
                      "JiarenAI 视频服务 · 3-15 秒 · 720p / 1080p",
                  }),
                ],
              }),
            y &&
              o("div", {
                className:
                  "rounded border border-white/10 bg-white/5 p-1.5 space-y-1",
                children: [
                  o("div", {
                    className: "flex items-center justify-between gap-2",
                    children: [
                      t("label", {
                        className: "text-[10px] text-white/50",
                        children: "即梦模式",
                      }),
                      t("span", {
                        className: "text-[9px] text-white/35",
                        children: "图9 / 视3 / 音3",
                      }),
                    ],
                  }),
                  t("select", {
                    value: de,
                    onChange: (e) => $e({ frameMode: e.target.value }),
                    className:
                      "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                    children: Zr.map((e) =>
                      t(
                        "option",
                        {
                          value: e.value,
                          className: "bg-zinc-900",
                          children: e.label,
                        },
                        e.value,
                      ),
                    ),
                  }),
                  t("div", {
                    className: "text-[10px] text-white/40 leading-relaxed",
                    children:
                      de === "omni"
                        ? "全能参考支持图片、视频和音频混合输入；纯多图也会走全能参考。"
                        : de === "first"
                          ? "只取第 1 张图作为首帧。"
                          : de === "firstlast"
                            ? "取第 1 张为首帧，第 2 张为尾帧。"
                            : "仅使用图片序列生成智能多帧。",
                  }),
                ],
              }),
            Ce &&
              !V &&
              o("div", {
                className: "grid grid-cols-2 gap-1.5",
                children: [
                  o("div", {
                    children: [
                      t("label", {
                        className: "text-[10px] text-white/50 block mb-1",
                        children: "比例",
                      }),
                      t("select", {
                        value: D,
                        onChange: (e) => i({ ratio: e.target.value }),
                        className:
                          "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                        children: Lt.map((e) =>
                          t(
                            "option",
                            { value: e, className: "bg-zinc-900", children: e },
                            e,
                          ),
                        ),
                      }),
                    ],
                  }),
                  at.length > 0 &&
                    o("div", {
                      children: [
                        t("label", {
                          className: "text-[10px] text-white/50 block mb-1",
                          children: "时长(s)",
                        }),
                        t("select", {
                          value: String(te),
                          onChange: (e) =>
                            i({ duration: Number(e.target.value) }),
                          className:
                            "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                          children: at.map((e) =>
                            o(
                              "option",
                              {
                                value: e,
                                className: "bg-zinc-900",
                                children: [e, "s"],
                              },
                              e,
                            ),
                          ),
                        }),
                      ],
                    }),
                ],
              }),
            Ce &&
              Ue.length > 0 &&
              o("div", {
                children: [
                  t("label", {
                    className: "text-[10px] text-white/50 block mb-1",
                    children: "分辨率",
                  }),
                  t("select", {
                    value: ce || Ue[0],
                    onChange: (e) => i({ resolution: e.target.value }),
                    className:
                      "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                    children: Ue.map((e) =>
                      t(
                        "option",
                        { value: e, className: "bg-zinc-900", children: e },
                        e,
                      ),
                    ),
                  }),
                ],
              }),
            ve &&
              o("div", {
                className:
                  "rounded border border-emerald-300/20 bg-emerald-400/[0.06] p-2 space-y-2",
                children: [
                  o("div", {
                    className: "flex items-center justify-between gap-2",
                    children: [
                      t("span", {
                        className: "text-[10px] font-semibold text-white/75",
                        children: "Agnes 视频参数",
                      }),
                      t("span", {
                        className: "text-[9px] text-emerald-100/60",
                        children: "/v1/videos",
                      }),
                    ],
                  }),
                  o("div", {
                    className: "grid grid-cols-2 gap-1.5",
                    children: [
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "帧率",
                          }),
                          t("select", {
                            value: String(Ot),
                            onChange: (e) =>
                              $e({ frameRate: Number(e.target.value) || 24 }),
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                            children: [8, 12, 16, 24, 30].map((e) =>
                              o(
                                "option",
                                {
                                  value: e,
                                  className: "bg-zinc-900",
                                  children: [e, " fps"],
                                },
                                e,
                              ),
                            ),
                          }),
                        ],
                      }),
                      o("div", {
                        children: [
                          t("label", {
                            className: "text-[10px] text-white/50 block mb-1",
                            children: "帧数覆盖",
                          }),
                          t("input", {
                            type: "number",
                            min: 9,
                            max: 441,
                            value: String(Ct),
                            onChange: (e) =>
                              $e({
                                numFrames: e.target.value
                                  ? Math.max(
                                      9,
                                      Math.min(
                                        441,
                                        Number(e.target.value) || 9,
                                      ),
                                    )
                                  : "",
                              }),
                            placeholder: "自动",
                            className:
                              "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30 placeholder:text-white/25",
                          }),
                        ],
                      }),
                    ],
                  }),
                  t("div", {
                    className: "text-[10px] leading-relaxed text-white/45",
                    children:
                      "默认由比例、分辨率和时长换算宽高与帧数；通常只需要调比例、时长和分辨率，特殊测试再覆盖帧数。",
                  }),
                ],
              }),
            !N &&
              !X &&
              n.kind === "veo" &&
              !Y &&
              o("div", {
                className: "grid grid-cols-2 gap-1.5",
                children: [
                  o("label", {
                    className:
                      "flex items-center gap-1 text-[10px] text-white/60 cursor-pointer",
                    children: [
                      t("input", {
                        type: "checkbox",
                        checked: tt,
                        onChange: (e) => i({ enhancePrompt: e.target.checked }),
                        className: "accent-rose-400",
                      }),
                      "Enhance Prompt",
                    ],
                  }),
                  o("label", {
                    className:
                      "flex items-center gap-1 text-[10px] text-white/60 cursor-pointer",
                    children: [
                      t("input", {
                        type: "checkbox",
                        checked: rt,
                        onChange: (e) =>
                          i({ enableUpsample: e.target.checked }),
                        className: "accent-rose-400",
                      }),
                      "Upsample",
                    ],
                  }),
                ],
              }),
            Ce &&
              !G &&
              o("div", {
                children: [
                  t("label", {
                    className: "text-[10px] text-white/50 block mb-1",
                    children: "Seed (0=随机)",
                  }),
                  t("input", {
                    type: "number",
                    value: K,
                    min: 0,
                    max: 2147483647,
                    onChange: (e) => i({ seed: Number(e.target.value) || 0 }),
                    className:
                      "w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white outline-none focus:border-white/30",
                  }),
                ],
              }),
            n.supportImages &&
              t(Tr, {
                texts: mt,
                images: displayImages,
                videos: displayVideos,
                audios: displayAudios,
                order: ae,
                onReorder: Gt,
                onRemoveLocal: removeLocalMaterial,
                onExcludeUpstream: Kt,
                excludedCount: Tt,
                onRestoreExcluded: Ht,
                selected: !!We,
                isDark: Ye,
                isPixel: Qe,
                groups: Bt,
                title: or,
              }),
            !1 &&
              n.supportImages &&
              H.length + B.length + j.length > 0 &&
              o("div", {
                className:
                  "rounded border border-emerald-400/30 bg-emerald-500/5 p-1.5 space-y-1",
                children: [
                  o("div", {
                    className: "text-[10px] text-emerald-200/80",
                    children: [
                      "本地拖入 · 图",
                      H.length,
                      " 视",
                      B.length,
                      " 音",
                      j.length,
                    ],
                  }),
                  H.length > 0 &&
                    t("div", {
                      className: "flex gap-1 flex-wrap",
                      children: H.map((e, a) =>
                        o(
                          "div",
                          {
                            className: "relative w-10 h-10",
                            children: [
                              t(ur, {
                                src: e,
                                alt: "",
                                "data-drag-source": !0,
                                "data-drag-kind": "image",
                                "data-drag-url": e,
                                "data-drag-preview": e,
                                "data-drag-node-id": d,
                                onMouseDown: (l) =>
                                  ye(l, {
                                    kind: "image",
                                    url: e,
                                    sourceNodeId: d,
                                    previewUrl: e,
                                  }),
                                className:
                                  "w-10 h-10 object-cover rounded border border-white/10 cursor-grab",
                                thumbSize: 160,
                              }),
                              t("button", {
                                onClick: () =>
                                  i({
                                    localRefImages: H.filter((l) => l !== e),
                                  }),
                                className:
                                  "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center",
                                children: t(Z.X, { size: 9 }),
                              }),
                            ],
                          },
                          `img-${a}`,
                        ),
                      ),
                    }),
                  B.length > 0 &&
                    t("div", {
                      className: "space-y-1",
                      children: B.map((e, a) =>
                        o(
                          "div",
                          {
                            className: "flex items-center gap-1",
                            children: [
                              t(kt, {
                                src: e,
                                "data-drag-source": !0,
                                "data-drag-kind": "video",
                                "data-drag-url": e,
                                "data-drag-preview": e,
                                "data-drag-node-id": d,
                                onMouseDown: (l) =>
                                  ye(l, {
                                    kind: "video",
                                    url: e,
                                    sourceNodeId: d,
                                    previewUrl: e,
                                  }),
                                className:
                                  "w-12 h-8 object-cover rounded border border-white/10 cursor-grab",
                              }),
                              t("span", {
                                className:
                                  "flex-1 truncate text-[10px] text-white/50",
                                children: e.split("/").pop(),
                              }),
                              t("button", {
                                onClick: () =>
                                  i({
                                    localRefVideos: B.filter((l) => l !== e),
                                  }),
                                className:
                                  "text-rose-300/60 hover:text-rose-200",
                                children: t(Z.X, { size: 11 }),
                              }),
                            ],
                          },
                          `vid-${a}`,
                        ),
                      ),
                    }),
                  j.length > 0 &&
                    t("div", {
                      className: "space-y-1",
                      children: j.map((e, a) =>
                        o(
                          "div",
                          {
                            className: "flex items-center gap-1",
                            children: [
                              t("span", {
                                "data-drag-source": !0,
                                "data-drag-kind": "audio",
                                "data-drag-url": e,
                                "data-drag-node-id": d,
                                onMouseDown: (l) =>
                                  ye(l, {
                                    kind: "audio",
                                    url: e,
                                    sourceNodeId: d,
                                    previewUrl: e,
                                  }),
                                className: "text-[14px] cursor-grab",
                                title: "按住 Ctrl 拖拽",
                                children: "♪",
                              }),
                              t("span", {
                                className:
                                  "flex-1 truncate text-[10px] text-white/50",
                                children: e.split("/").pop(),
                              }),
                              t("button", {
                                onClick: () =>
                                  i({
                                    localRefAudios: j.filter((l) => l !== e),
                                  }),
                                className:
                                  "text-rose-300/60 hover:text-rose-200",
                                children: t(Z.X, { size: 11 }),
                              }),
                            ],
                          },
                          `aud-${a}`,
                        ),
                      ),
                    }),
                ],
              }),
            o("div", {
              children: [
                t("label", {
                  className: "text-[10px] text-white/50 block mb-1",
                  children: "本地 Prompt(可选)",
                }),
                t(Gr, {
                  title: "视频 Prompt",
                  value: Ge,
                  mentions: pt,
                  materials: ht,
                  onChange: (e, a) => i({ prompt: e, promptMentions: a }),
                  placeholder: "备用:无上游连接时使用",
                  isDark: Ye,
                  isPixel: Qe,
                  promptTemplateKind: "video",
                  className:
                    "w-full h-12 resize-none rounded bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-white outline-none focus:border-white/30 placeholder:text-white/30",
                }),
              ],
            }),
            ft
              ? o("button", {
                  onClick: Zt,
                  className:
                    "w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-zinc-500/20 hover:bg-zinc-500/30 text-zinc-200 text-xs font-medium transition-colors",
                  children: [
                    t(Z.Square, { size: 11 }),
                    " 停止(",
                    ut || (oe === "submitting" ? "提交中" : "排队中"),
                    ")",
                  ],
                })
              : o("button", {
                  onClick: xt,
                  disabled: !jiarenModel,
                  className:
                    "w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium transition-colors",
                  children: [t(Z.Sparkles, { size: 12 }), " 生成视频"],
                }),
            ft &&
              o("div", {
                className:
                  "flex items-center gap-1 text-[10px] text-rose-200/80",
                children: [
                  t(Z.Loader2, { size: 11, className: "animate-spin" }),
                  oe === "submitting" ? "提交任务..." : `轮询中 ${ut}`,
                  ct &&
                    o("span", {
                      className: "ml-auto text-white/30",
                      children: [ct.slice(0, 10), "…"],
                    }),
                ],
              }),
            Ze &&
              o("div", {
                className:
                  "flex items-start gap-1 text-[10px] text-red-300 bg-red-500/10 border border-red-500/20 rounded px-2 py-1",
                children: [
                  t(Z.AlertCircle, {
                    size: 11,
                    className: "mt-0.5 flex-shrink-0",
                  }),
                  t("span", { className: "break-all", children: Ze }),
                ],
              }),
          ],
        }),
        Q &&
          !_t &&
          t("div", {
            className: "border-t border-white/10 p-2",
            children: t(kt, {
              src: Q,
              controls: !0,
              className: "w-full rounded",
              style: { aspectRatio: D.replace(":", "/") },
              "data-drag-source": !0,
              "data-drag-kind": "video",
              "data-drag-url": Q,
              "data-drag-preview": Q,
              "data-drag-node-id": d,
              "data-resource-title": Q.split("/").pop() || "生成视频",
              "data-prompt-template-kind": "video",
              "data-prompt-template-category": "video-image-to-video",
              "data-prompt-template-prompt": r?.lastPrompt || Ge,
              onMouseDown: (e) =>
                ye(e, {
                  kind: "video",
                  url: Q,
                  sourceNodeId: d,
                  previewUrl: Q,
                }),
              title: "按住 Ctrl 拖拽到其他节点",
            }),
          }),
      ],
    });
    const editorContent = o("section", {
      ...editorPanel.props,
      children: editorPanel.props.children.slice(2),
    });
    const mediaCard = o("div", {
      ...er,
      className: `jiaren-media-square-card jiaren-video-square-card ${We ? "is-selected" : ""} ${vt ? "is-accepting" : ""}`,
      "data-jiaren-media-kind": "video",
      "data-node-id": d,
      children: [
        t(bt, {
          type: "target",
          position: wt.Left,
          className: "jiaren-media-port jiaren-media-port-input",
        }),
        t(bt, {
          type: "source",
          position: wt.Right,
          className: "jiaren-media-port jiaren-media-port-output",
        }),
        o("header", {
          className: "jiaren-media-card-heading",
          children: [
            o("span", {
              className: "jiaren-media-card-icon",
              children: t(Z.Video, { size: 15 }),
            }),
            o("div", {
              children: [
                t("strong", { children: "视频" }),
                t("small", {
                  children: jiarenVideoLabel(jiarenModel) || "请配置视频模型",
                }),
              ],
            }),
            t("em", { children: ft ? "生成中" : Q ? "已生成" : "待编辑" }),
          ],
        }),
        o("div", {
          className: "jiaren-media-card-preview",
          children: Q
            ? t(kt, {
                src: Q,
                muted: !0,
                playsInline: !0,
                preload: "metadata",
                className: "jiaren-media-card-video",
              })
            : o("div", {
                className: "jiaren-media-card-empty",
                children: [
                  ft
                    ? t(Z.Loader2, { size: 30, className: "animate-spin" })
                    : t(Z.Play, { size: 30 }),
                  t("span", {
                    children: ft
                      ? ut || "正在生成视频"
                      : "点击节点，在底部设置视频参数",
                  }),
                ],
              }),
        }),
        o("footer", {
          className: "jiaren-media-card-meta",
          children: [
            t("span", { children: D || "16:9" }),
            t("span", { children: `${Number(te) || 5}s` }),
            t("span", { children: ce || "Auto" }),
          ],
        }),
      ],
    });
    return o(Me, {
      children: [
        mediaCard,
        typeof document !== "undefined"
          ? createPortal(editorContent, document.body, `jiaren-video-editor-${d}`)
          : null,
      ],
    });
  },
  eo = ar(Qr),
  uo = "t8:video";
function po(d) {
  return {
    ...Br,
    ...(d?.id ? { modelId: d.id } : {}),
    ...(d?.modelId ? { model: d.modelId } : {}),
  };
}
const mo = pr(eo, "video");
export {
  po as T8VideoDefaultData,
  mo as T8VideoNodeNative,
  uo as T8_VIDEO_NODE_KIND,
};
