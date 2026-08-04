const __vite__mapDeps = (i, m = __vite__mapDeps, d = m.f || (m.f = ["./vendor-flow-BZV40eAE.css", "./vendor-excalidraw-C6xAThXA.css"])) => i.map((i2) => d[i2]);
var Ks = Object.defineProperty;
var Vs = (n, i, c) => i in n ? Ks(n, i, { enumerable: true, configurable: true, writable: true, value: c }) : n[i] = c;
var ii = (n, i, c) => Vs(n, typeof i != "symbol" ? i + "" : i, c);
import { S as v, F as t, _ as zt, e as Gs, a3 as zs } from "./vendor-C8NPC5kM.js";
import "./vendor-flow-BUHgv_lX.js";
import { u as _, d as Fn, a as Gt, i as Js, b as ba, c as Hs, h as ji, g as Ws } from "./jiaren-canvas-Cdxozcx-.js";
import { e as qs, $ as Ia, aQ as Ys, aD as to, V as fn, ay as Zs, ag as JiarenPaperclipIcon, M as JiarenFolderIcon, H as JiarenFileIcon, ar as Pi, m as Xs, y as ec, x as tc, ao as nc, l as ac, af as ic, aO as no, a4 as rc, ap as ao, _ as yn, t as io, aJ as Sa, aS as Kt, ax as oc, S as Tr, aM as sc, n as ro, aP as cc, H as lc, U as dc, R as pc, M as ri, w as Lr, D as uc, au as mc, av as xi, a6 as gc, a3 as hc, X as fc, aV as yc, at as bc, aU as vc, a7 as jc, aI as xc, P as Ac, ad as wc, f as kc, Z as Cc, c as Ic, I as va } from "./vendor-icons-Bb7FNkxe.js";
import { p as Sc } from "./prompt-library-CEE0l4Hc.js";
import { JiarenDetectEmbodiedProtagonistAsset, JiarenMatchesEmbodiedProtagonistAsset } from "./jiaren-embodied-protagonist-lock.js";
import "./vendor-excalidraw-2d6X1Q1Z.js";
const JiarenExecutingPlans = new Set();
const Pc = [{ id: "assistant-1", role: "assistant", text: "我是 Jiaren Agent。你可以直接交代任务，也可以附加图片、文档、表格、代码或整个文件夹；我会先读取材料，再按你的目标执行。" }], $c = [{ name: "\u521B\u610F\u603B\u76D1", instruction: "\u786E\u5B9A\u753B\u9762\u4E3B\u9898\u3001\u89C6\u89C9\u53D9\u4E8B\u3001\u4E3B\u4F53\u5173\u7CFB\u3001\u5546\u4E1A/\u827A\u672F\u8868\u8FBE\u65B9\u5411\u3002" }, { name: "\u63D0\u793A\u8BCD\u5DE5\u7A0B\u5E08", instruction: "\u628A\u521B\u610F\u65B9\u5411\u8F6C\u5199\u6210\u53EF\u6267\u884C\u7684 AI \u7ED8\u753B\u63D0\u793A\u8BCD\uFF0C\u5F3A\u8C03\u4E3B\u4F53\u3001\u573A\u666F\u3001\u6784\u56FE\u3001\u955C\u5934\u3001\u6750\u8D28\u3002" }, { name: "\u98CE\u683C\u5927\u5E08", instruction: "\u8865\u5F3A\u7F8E\u672F\u98CE\u683C\u3001\u5149\u5F71\u3001\u8272\u5F69\u3001\u8D28\u611F\u3001\u8D1F\u9762\u7EA6\u675F\uFF0C\u5E76\u8F93\u51FA\u6700\u7EC8\u63D0\u793A\u8BCD\u3002" }];
function Nc(n) {
  return n.replace(/```[\s\S]*?```/g, (i) => i.replace(/```(?:json)?/g, "").replace(/```/g, "")).replace(/^(最终提示词|final prompt|prompt)\s*[:：]/i, "").trim();
}
function JiarenFormatAttachmentSize(n) {
  const i = Number(n) || 0;
  if (i < 1024) return `${i} B`;
  if (i < 1024 * 1024) return `${Math.round(i / 102.4) / 10} KB`;
  return `${Math.round(i / 1024 / 102.4) / 10} MB`;
}
function JiarenAttachmentContext(n) {
  if (!n.length) return "";
  const i = n.map((c, u) => {
    const b = c.relativePath || c.name || `attachment-${u + 1}`;
    if (c.kind === "image") return `[图片 ${u + 1}] ${b} (${c.mimeType || "image"}, ${JiarenFormatAttachmentSize(c.sizeBytes)})`;
    if (c.kind === "text" && c.content) return `<attachment index="${u + 1}" path="${b}"${c.truncated ? ' truncated="true"' : ""}>\n${c.content}\n</attachment>`;
    return `[附件 ${u + 1}] ${b} (${c.mimeType || c.extension || "binary"}, ${JiarenFormatAttachmentSize(c.sizeBytes)}；当前仅提供文件元数据)`;
  });
  return `\n\n以下是用户明确选择的附件。只使用这些附件，不要搜索其他本地文件：\n${i.join("\n\n")}`;
}
function Uc({ open: n, onClose: i }) {
  var ze, R, Q;
  const c = _((C) => C.runtimeSettings), u = _((C) => C.storageSettings), b = _((C) => C.uiPreferences.language ?? "zh"), m = _((C) => C.createWorkflowNode), A = _((C) => C.setPromptBarNode), P = _((C) => C.setSelectedNode), S = c.models.filter((C) => C.category === "chat" && C.enabled), [B, E] = v.useState(Pc), [me, Z] = v.useState(""), [JiarenAttachments, setJiarenAttachments] = v.useState([]), [H, F] = v.useState(((ze = S.find((C) => C.id === "a2-claude-3-7-sonnet-20250219")) == null ? void 0 : ze.id) ?? ((R = S.find((C) => C.apiGroup === "a2")) == null ? void 0 : R.id) ?? ((Q = S[0]) == null ? void 0 : Q.id) ?? "a2-gpt-4o"), [ve, xe] = v.useState(false), [Pe, z] = v.useState(false), [JiarenSessionId, setJiarenSessionId] = v.useState(""), [JiarenSessions, setJiarenSessions] = v.useState([]), [JiarenSuggestions, setJiarenSuggestions] = v.useState([]), [JiarenPlans, setJiarenPlans] = v.useState([]), [JiarenRecovery, setJiarenRecovery] = v.useState(null), [JiarenStreamText, setJiarenStreamText] = v.useState(""), [JiarenPairing, setJiarenPairing] = v.useState(null), JiarenRequestRef = v.useRef(""), JiarenSessionRef = v.useRef(""), f = S.find((C) => C.id === H) ?? S.find((C) => C.modelId === H), se = b === "en", T = (C, k) => se ? k : C, q = v.useMemo(() => Fn(c, (f == null ? void 0 : f.id) ?? H), [c, H, f == null ? void 0 : f.id]);
  v.useEffect(() => {
    JiarenSessionRef.current = JiarenSessionId;
  }, [JiarenSessionId]);
  v.useEffect(() => {
    if (!n || !window.jiaren?.agentControl) return;
    let active = true;
    const control = window.jiaren.agentControl;
    const load = async () => {
      try {
        const session = await control.ensureSession();
        const listed = await control.listSessions();
        const plans = await control.listPlans("pending");
        if (!active) return;
        setJiarenSessionId(session.id);
        setJiarenSessions(listed.sessions || []);
        setJiarenSuggestions(session.suggestions || []);
        setJiarenRecovery(session.recovery || null);
        setJiarenPlans(plans || []);
        E(session.messages?.length ? session.messages : Pc);
      } catch {}
    };
    void load();
    const removeControlListener = control.onEvent?.((event) => {
      if (!active) return;
      if (event?.type?.startsWith("plan."))
        void control.listPlans("pending").then((plans) => active && setJiarenPlans(plans || [])).catch(() => {});
      if (event?.type === "session.recovery" && event.sessionId === JiarenSessionRef.current)
        setJiarenRecovery(event.recovery || null);
    });
    const removeStreamListener = window.jiaren.runtime.onChatStream?.((event) => {
      if (!active || event?.requestId !== JiarenRequestRef.current) return;
      if (event.type === "delta") setJiarenStreamText(event.content || "");
    });
    return () => {
      active = false;
      if (typeof removeControlListener === "function") removeControlListener();
      if (typeof removeStreamListener === "function") removeStreamListener();
    };
  }, [n]);
  if (!n) return null;
  async function JiarenOpenSession(sessionId) {
    const control = window.jiaren?.agentControl;
    if (!control) return;
    const session = await control.getSession(sessionId);
    setJiarenSessionId(session.id);
    setJiarenSuggestions(session.suggestions || []);
    setJiarenRecovery(session.recovery || null);
    E(session.messages?.length ? session.messages : Pc);
  }
  async function JiarenNewSession() {
    const control = window.jiaren?.agentControl;
    if (!control || ve || Pe) return;
    const session = await control.createSession(T("新对话", "New chat"));
    const listed = await control.listSessions();
    setJiarenSessions(listed.sessions || []);
    setJiarenSessionId(session.id);
    setJiarenSuggestions([]);
    setJiarenRecovery(null);
    setJiarenStreamText("");
    E(Pc);
  }
  async function JiarenStartPairing() {
    const pairing = await window.jiaren?.agentControl?.startPairing("Jiaren Canvas CLI");
    if (pairing) setJiarenPairing(pairing);
  }
  async function JiarenRejectPlan(planId) {
    await window.jiaren?.agentControl?.rejectPlan(planId, T("用户已拒绝。", "Rejected by user."));
    const plans = await window.jiaren?.agentControl?.listPlans("pending");
    setJiarenPlans(plans || []);
  }
  async function JiarenApprovePlan(plan) {
    const bridge = window.__JIAREN_CANVAS_AGENT__;
    const control = window.jiaren?.agentControl;
    if (!bridge || !control || JiarenExecutingPlans.has(plan.id)) return;
    JiarenExecutingPlans.add(plan.id);
    let approved = false;
    try {
      bridge.previewOperations(plan.operations);
      await control.approvePlan(plan.id);
      approved = true;
      const result = await bridge.applyOperations(plan.operations);
      await control.completePlan(plan.id, { ok: true, summary: T("画布操作已执行。", "Canvas operations completed."), result });
      E((messages) => [...messages, { id: crypto.randomUUID(), role: "assistant", text: T(`已执行“${plan.title}”，共 ${plan.operations.length} 项操作。`, `Executed “${plan.title}” with ${plan.operations.length} operation(s).`) }]);
    } catch (error) {
      if (approved) {
        try {
          await control.completePlan(plan.id, { ok: false, summary: T("画布操作执行失败。", "Canvas operations failed."), error: error instanceof Error ? error.message : String(error) });
        } catch {}
      }
      E((messages) => [...messages, { id: crypto.randomUUID(), role: "assistant", text: T(`执行失败：${error instanceof Error ? error.message : String(error)}`, `Execution failed: ${error instanceof Error ? error.message : String(error)}`) }]);
    } finally {
      JiarenExecutingPlans.delete(plan.id);
      const plans = await control.listPlans("pending");
      setJiarenPlans(plans || []);
    }
  }
  async function Ne() {
    const C = me.trim();
    if ((!C && JiarenAttachments.length === 0) || ve || Pe) return;
    const k = {
      id: crypto.randomUUID(),
      role: "user",
      text: C || T("请阅读附件并继续处理。", "Read the attachments and continue."),
      context: JiarenAttachmentContext(JiarenAttachments),
      attachmentCount: JiarenAttachments.length,
      images: JiarenAttachments.filter((ee) => ee.kind === "image")
    }, pe = [...B, k], ee = pe.flatMap((Ue) => Ue.images || []).slice(-8), control = window.jiaren?.agentControl;
    let sessionId = JiarenSessionId;
    if (!sessionId && control) {
      const session = await control.ensureSession();
      sessionId = session.id;
      setJiarenSessionId(sessionId);
    }
    E(pe), Z(""), setJiarenAttachments([]), setJiarenStreamText(""), setJiarenRecovery(null), xe(true);
    try {
      if (control && sessionId) await control.appendMessage(sessionId, k);
      const requestId = crypto.randomUUID();
      JiarenRequestRef.current = requestId;
      const request = { requestId, sessionId, agentProfile: "jiaren-agent", modelId: (f == null ? void 0 : f.id) ?? H, endpointModelId: f == null ? void 0 : f.endpointModelId, fallbackEndpointModelId: f == null ? void 0 : f.fallbackEndpointModelId, requestMode: f == null ? void 0 : f.requestMode, apiGroup: (f == null ? void 0 : f.apiGroup) ?? q.apiGroup, providerSource: (f == null ? void 0 : f.providerSource) ?? q.providerSource, baseUrl: q.baseUrl, apiKey: q.apiKey, fallbackBaseUrl: q.fallbackBaseUrl, fallbackApiKey: q.fallbackApiKey, messages: pe.map((Be) => ({ role: Be.role === "assistant" ? "assistant" : "user", content: `${Be.text}${Be.context || ""}` })), images: ee.map((Be) => ({ name: Be.name, localPath: Be.localPath, mimeType: Be.mimeType })) };
      const Ue = window.jiaren?.runtime?.startChatStream ? await window.jiaren.runtime.startChatStream(request) : await Gt.chat(request);
      const text = Ue.ok ? Ue.content || T("已完成，但返回内容为空。", "Done, but the response was empty.") : Ue.content ? `${Ue.content}\n\n${Ue.message}` : Ue.message;
      const assistantMessage = { id: Ue.id || crypto.randomUUID(), role: "assistant", text };
      E((Be) => [...Be, assistantMessage]);
      setJiarenStreamText("");
      if (control && sessionId) {
        await control.appendMessage(sessionId, assistantMessage);
        if (Ue.suggestions?.length) {
          await control.saveSuggestions(sessionId, Ue.suggestions);
          setJiarenSuggestions(Ue.suggestions);
        }
        const listed = await control.listSessions();
        setJiarenSessions(listed.sessions || []);
      }
    } finally {
      JiarenRequestRef.current = "";
      setJiarenStreamText("");
      xe(false);
    }
  }
  async function Ce(C = "files") {
    var Ue;
    let k;
    try {
      k = await ((Ue = window.jiaren) == null ? void 0 : Ue.system.selectChatAttachments({ mode: C }));
    } catch (te) {
      const Be = te instanceof Error ? te.message : "\u672A\u77E5\u9519\u8BEF";
      E((w) => [...w, { id: crypto.randomUUID(), role: "assistant", text: T(`\u6253\u5F00\u4E0A\u4F20\u7A97\u53E3\u5931\u8D25\uFF1A${Be}`, `Failed to open upload window: ${Be}`) }]);
      return;
    }
    if (!k || k.canceled) return;
    const pe = Array.isArray(k.items) ? k.items : [];
    setJiarenAttachments((ee) => {
      const Be = new Map(ee.map((w) => [w.localPath || w.id, w]));
      pe.forEach((w) => Be.set(w.localPath || w.id, w));
      return [...Be.values()].slice(0, 60);
    });
    k.limited && E((ee) => [...ee, { id: crypto.randomUUID(), role: "assistant", text: T("附件数量已达到安全读取上限，其余文件未加入。", "The safe attachment limit was reached; remaining files were skipped.") }]);
  }
  async function Ae() {
    const C = [...B].reverse().find((te) => te.role === "user"), k = me.trim() || (C == null ? void 0 : C.text.trim());
    if (!k || Pe || ve) {
      E((te) => [...te, { id: crypto.randomUUID(), role: "assistant", text: T("\u5148\u8F93\u5165\u4F60\u60F3\u753B\u4EC0\u4E48\uFF0C\u518D\u70B9\u201C\u591A\u4EE3\u7406\u51FA\u56FE\u201D\u3002", "Type what you want to create first, then click Multi-agent.") }]);
      return;
    }
    if (!q.apiKey.trim() || !q.baseUrl.trim()) {
      E((te) => [...te, { id: crypto.randomUUID(), role: "assistant", text: T("\u5BF9\u8BDD\u6A21\u578B API \u914D\u7F6E\u4E0D\u5B8C\u6574\uFF0C\u8BF7\u5148\u5728 API \u8BBE\u7F6E\u91CC\u586B\u597D\uFF1B\u4E0D\u4F1A\u6539\u52A8\u4F60\u7684\u7ED8\u56FE API\u3002", "The chat model API is incomplete. Fill it in API settings first; image API settings stay untouched.") }]);
      return;
    }
    const pe = { id: crypto.randomUUID(), role: "user", text: k, context: JiarenAttachmentContext(JiarenAttachments), images: JiarenAttachments.filter((te) => te.kind === "image") }, attachmentPrompt = `${k}${pe.context}`, attachmentImages = pe.images.map((te) => ({ name: te.name, localPath: te.localPath, mimeType: te.mimeType }));
    E((te) => [...te, pe]), Z(""), setJiarenAttachments([]), z(true);
    let ee = attachmentPrompt;
    const Ue = [];
    try {
      for (const X of $c) {
        const we = await Gt.chat({ agentProfile: "jiaren-agent", modelId: (f == null ? void 0 : f.id) ?? H, endpointModelId: f == null ? void 0 : f.endpointModelId, fallbackEndpointModelId: f == null ? void 0 : f.fallbackEndpointModelId, requestMode: f == null ? void 0 : f.requestMode, apiGroup: f == null ? void 0 : f.apiGroup, baseUrl: q.baseUrl, apiKey: q.apiKey, fallbackBaseUrl: q.fallbackBaseUrl, fallbackApiKey: q.fallbackApiKey, images: attachmentImages, messages: [{ role: "system", content: "\u4F60\u662F Jiaren AI \u753B\u5E03\u91CC\u7684\u591A\u89D2\u8272\u521B\u610F\u4EE3\u7406\u3002\u53EA\u670D\u52A1\u4E8E\u751F\u6210\u53EF\u6267\u884C\u7ED8\u753B\u63D0\u793A\u8BCD\uFF0C\u4E0D\u8981\u8C03\u7528\u5916\u90E8\u5DE5\u5177\u3002\u8F93\u51FA\u4E2D\u6587\uFF0C\u7B80\u6D01\u4F46\u4FE1\u606F\u5BC6\u5EA6\u9AD8\u3002" }, { role: "user", content: `\u7528\u6237\u60F3\u521B\u4F5C\uFF1A${attachmentPrompt}

\u5F53\u524D\u4E0A\u4E0B\u6587\uFF1A${ee}

\u4F60\u7684\u89D2\u8272\uFF1A${X.name}
\u4EFB\u52A1\uFF1A${X.instruction}
\u8BF7\u8F93\u51FA\u672C\u89D2\u8272\u5EFA\u8BAE\u3002` }] }), Ve = we.ok ? (we.content ?? "").trim() || T("\u8FD9\u4E2A\u89D2\u8272\u6CA1\u6709\u8FD4\u56DE\u5185\u5BB9\u3002", "This role returned no content.") : we.message;
        Ue.push(`${X.name}\uFF1A${Ve}`), ee = `${ee}

${X.name}\uFF1A${Ve}`, E((Ua) => [...Ua, { id: we.id || crypto.randomUUID(), role: "assistant", text: `${X.name}\uFF1A${Ve}` }]);
      }
      const te = await Gt.chat({ agentProfile: "jiaren-agent", modelId: (f == null ? void 0 : f.id) ?? H, endpointModelId: f == null ? void 0 : f.endpointModelId, fallbackEndpointModelId: f == null ? void 0 : f.fallbackEndpointModelId, requestMode: f == null ? void 0 : f.requestMode, apiGroup: f == null ? void 0 : f.apiGroup, baseUrl: q.baseUrl, apiKey: q.apiKey, fallbackBaseUrl: q.fallbackBaseUrl, fallbackApiKey: q.fallbackApiKey, images: attachmentImages, messages: [{ role: "system", content: "\u4F60\u662F\u63D0\u793A\u8BCD\u603B\u7F16\u3002\u57FA\u4E8E\u591A\u4EE3\u7406\u8BA8\u8BBA\uFF0C\u53EA\u8F93\u51FA\u4E00\u6BB5\u6700\u7EC8 AI \u7ED8\u753B\u63D0\u793A\u8BCD\uFF0C\u4E0D\u8981\u89E3\u91CA\uFF0C\u4E0D\u8981 Markdown\u3002" }, { role: "user", content: `\u7528\u6237\u9700\u6C42\uFF1A${attachmentPrompt}

\u591A\u4EE3\u7406\u8BA8\u8BBA\uFF1A
${Ue.join(`

`)}

\u8F93\u51FA\u6700\u7EC8\u7ED8\u753B\u63D0\u793A\u8BCD\u3002` }] }), Be = Nc(te.ok ? te.content ?? ee : ee), w = m({ kind: "generateImage", position: { x: 420, y: 260 }, data: { prompt: Be, status: "idle", message: "\u591A\u4EE3\u7406\u5DF2\u5B8C\u6210\u8BA8\u8BBA\uFF0C\u70B9\u51FB\u5E95\u90E8\u751F\u6210\u6309\u94AE\u5373\u53EF\u51FA\u56FE\u3002" } });
      A(w.id), P(w.id), E((X) => [...X, { id: te.id || crypto.randomUUID(), role: "assistant", text: T(`\u5DF2\u521B\u5EFA\u7ED8\u753B\u8282\u70B9\uFF1A${Be}`, `Created image node: ${Be}`) }]);
    } finally {
      z(false);
    }
  }
  return t.jsxs("aside", { className: "agent-panel jiaren-agent-panel", children: [
    t.jsxs("header", { className: "agent-panel-header", children: [
      t.jsxs("div", { children: [t.jsx(qs, { size: 16 }), t.jsx("strong", { children: "Jiaren Agent" }), t.jsx("span", { className: "agent-live-status", children: ve ? T("流式回复中", "Streaming") : T("就绪", "Ready") })] }),
      t.jsx("button", { type: "button", title: T("关闭", "Close"), onClick: i, children: "\xD7" })
    ] }),
    t.jsxs("div", { className: "agent-session-bar", children: [
      t.jsx("select", { value: JiarenSessionId, title: T("对话记录", "Chat sessions"), onChange: (C) => void JiarenOpenSession(C.target.value), children: JiarenSessions.map((C) => t.jsx("option", { value: C.id, children: C.title || T("新对话", "New chat") }, C.id)) }),
      t.jsx("button", { type: "button", title: T("新建对话", "New chat"), onClick: () => void JiarenNewSession(), children: "+" }),
      t.jsx("button", { type: "button", title: T("配对 Jiaren Canvas CLI", "Pair Jiaren Canvas CLI"), onClick: () => void JiarenStartPairing(), children: "CLI" }),
      JiarenPairing ? t.jsxs("span", { className: "agent-pairing-code", title: T("仅用于本机 Jiaren 画布控制，5 分钟内有效，不是 Codex 登录码", "Local Jiaren canvas pairing only; valid for 5 minutes, not a Codex login code"), children: [T("本地配对码 ", "Local code "), t.jsx("b", { children: JiarenPairing.code })] }) : null
    ] }),
    t.jsxs("div", { className: "agent-toolbar", children: [
      t.jsx("select", { value: H, onChange: (C) => F(C.target.value), children: S.map((C) => t.jsx("option", { value: C.id, children: C.alias }, C.id)) }),
      t.jsx("button", { type: "button", className: "active", children: T("Agent 模式", "Agent mode") }),
      t.jsxs("button", { className: "agent-workflow-button", type: "button", disabled: Pe || ve, onClick: () => void Ae(), children: [Pe ? t.jsx(Ia, { className: "spin", size: 14 }) : t.jsx(Ys, { size: 14 }), T("协作出图", "Create image")] })
    ] }),
    JiarenRecovery ? t.jsx("div", { className: "agent-recovery-banner", children: JiarenRecovery.message || T("连接中断，已保存当前对话，可继续上次任务。", "Connection interrupted. This chat was saved and can be resumed.") }) : null,
    JiarenPlans.length ? t.jsx("section", { className: "agent-approval-shelf", children: JiarenPlans.map((C) => t.jsxs("article", { className: "agent-plan-card", children: [
      t.jsxs("div", { children: [t.jsx("strong", { children: C.title }), t.jsx("span", { children: C.summary })] }),
      t.jsx("ol", { children: C.operations.slice(0, 6).map((k, pe) => t.jsx("li", { children: `${pe + 1}. ${k.type}` }, k.id || pe)) }),
      t.jsxs("footer", { children: [t.jsx("button", { type: "button", onClick: () => void JiarenRejectPlan(C.id), children: T("拒绝", "Reject") }), t.jsx("button", { type: "button", className: "primary", onClick: () => void JiarenApprovePlan(C), children: T("批准并执行", "Approve and run") })] })
    ] }, C.id)) }) : null,
    t.jsxs("div", { className: "agent-messages", children: [
      ...B.map((C) => t.jsxs("article", { className: `agent-message ${C.role}`, children: [t.jsx("div", { className: "agent-avatar", children: C.role === "assistant" ? t.jsx(to, { size: 14 }) : T("你", "You") }), t.jsxs("div", { className: "agent-bubble", children: [t.jsx("span", { children: C.text }), C.attachmentCount ? t.jsxs("small", { children: [JiarenPaperclipIcon ? t.jsx(JiarenPaperclipIcon, { size: 12 }) : null, C.attachmentCount, T(" 个附件", " attachment(s)")] }) : null] })] }, C.id)),
      JiarenStreamText ? t.jsxs("article", { className: "agent-message assistant streaming", children: [t.jsx("div", { className: "agent-avatar", children: t.jsx(to, { size: 14 }) }), t.jsxs("div", { className: "agent-bubble", children: [t.jsx("span", { children: JiarenStreamText }), t.jsx("i", { className: "agent-stream-caret" })] })] }) : null
    ] }),
    JiarenSuggestions.length ? t.jsx("div", { className: "agent-suggestions", children: JiarenSuggestions.slice(0, 3).map((C) => t.jsx("button", { type: "button", onClick: () => Z(C), children: C }, C)) }) : null,
    JiarenAttachments.length ? t.jsx("div", { className: "agent-attachment-tray", children: JiarenAttachments.map((C) => t.jsxs("div", { className: `agent-attachment-chip is-${C.kind}`, title: C.relativePath || C.name, children: [C.kind === "image" ? t.jsx(fn, { size: 14 }) : C.kind === "text" ? t.jsx(JiarenFileIcon, { size: 14 }) : t.jsx(JiarenPaperclipIcon, { size: 14 }), t.jsxs("span", { children: [t.jsx("b", { children: C.relativePath || C.name }), t.jsx("small", { children: JiarenFormatAttachmentSize(C.sizeBytes) })] }), t.jsx("button", { type: "button", title: T("移除附件", "Remove attachment"), onClick: () => setJiarenAttachments((k) => k.filter((pe) => pe.id !== C.id)), children: "\xD7" })] }, C.id)) }) : null,
    t.jsxs("footer", { className: "agent-input-bar", children: [t.jsx("button", { type: "button", title: T("添加文件、图片、文档或表格", "Attach files, images or documents"), onClick: () => void Ce("files"), children: t.jsx(JiarenPaperclipIcon, { size: 16 }) }), t.jsx("button", { type: "button", title: T("添加文件夹", "Attach folder"), onClick: () => void Ce("folder"), children: t.jsx(JiarenFolderIcon, { size: 16 }) }), t.jsx("textarea", { rows: 1, placeholder: T("交代任务，或附加图片、文档、表格、代码和文件夹", "Describe a task or attach files and folders"), value: me, onChange: (C) => Z(C.target.value), onKeyDown: (C) => {
    C.key === "Enter" && !C.shiftKey && (C.preventDefault(), Ne());
  } }), t.jsx("button", { type: "button", title: T("发送", "Send"), disabled: ve || Pe || !me.trim() && JiarenAttachments.length === 0, onClick: () => void Ne(), children: ve ? t.jsx(Ia, { className: "spin", size: 16 }) : t.jsx(Zs, { size: 16 }) })] })] });
}
const JiarenProviderIcons = {
  anthropic: "./assets/provider-anthropic.svg",
  gpt: "./assets/provider-openai.svg",
  openai: "./assets/provider-openai.svg",
  nano: "./assets/provider-google.svg",
  google: "./assets/provider-google.svg",
  midjourney: "./assets/provider-midjourney.svg",
  kling: "./assets/provider-kling.svg",
  luma: "./assets/provider-luma.svg",
  runway: "./assets/provider-runway.svg",
  deepseek: "./assets/provider-deepseek.svg",
  doubao: "./assets/provider-doubao.svg",
  minimax: "./assets/provider-minimax.svg",
  qwen: "./assets/provider-qwen.svg",
  xai: "./assets/provider-xai.svg",
  fal: "./assets/provider-fal.svg",
  flux: "./assets/provider-flux.svg",
};
function Dc(n, i, c) {
  return [n == null ? void 0 : n.id, n == null ? void 0 : n.alias, n == null ? void 0 : n.modelId, n == null ? void 0 : n.endpointModelId, i, c].filter(Boolean).join(" ").toLowerCase();
}
function Rc(n, i, c) {
  const u = Dc(n, i, c), b = [n == null ? void 0 : n.provider, n == null ? void 0 : n.icon, n == null ? void 0 : n.requestMode].filter(Boolean).join(" ").toLowerCase(), m = (pattern) => pattern.test(u), A = /(?:^|[\s/:_-])(?:claude|clause)/, P = /(?:^|[\s/:_-])(?:gemini|medlm|learnlm|seclm|omni|veo|imagen|nano[-_\s]?banana)/, z = /(?:^|[\s/:_-])(?:mid[-_.\s]?journey|mj)(?:$|[\s/:_.-])/, C = /(?:^|[\s/:_-])kling/, E = /(?:^|[\s/:_-])(?:flux|kontext)/, H = /(?:^|[\s/:_-])(?:seedream|seedance|doubao)/, F = /(?:^|[\s/:_-])deepseek/, N = /(?:^|[\s/:_-])(?:minimax|speech|t12v)/, O = /(?:^|[\s/:_-])(?:qwen(?:1\.5|3(?:\.5)?)?|qwq|wan2\.(?:1|2|5|6))/, R = /(?:^|[\s/:_-])grok/, V = /(?:^|[\s/:_-])(?:fal(?:[._-]?ai)?|fai)(?:$|[\s/:_.-])/, X = /(?:^|[\s/:_-])luma/, Y = /(?:^|[\s/:_-])runway/, U = /(?:^|[\s/:_-])(?:gpt|o[134])(?:$|[\s/:_.-])/;
  if (m(A)) return "anthropic";
  if (m(P)) return "google";
  if (m(z)) return "midjourney";
  if (m(C)) return "kling";
  if (m(E)) return "flux";
  if (m(H)) return "doubao";
  if (m(F)) return "deepseek";
  if (m(N)) return "minimax";
  if (m(O)) return "qwen";
  if (m(R)) return "xai";
  if (m(V)) return "fal";
  if (m(X)) return "luma";
  if (m(Y)) return "runway";
  if (m(U)) return "openai";
  return b.includes("anthropic") || b.includes("claude") ? "anthropic" : b.includes("google") || b.includes("gemini") ? "google" : b.includes("midjourney") ? "midjourney" : b.includes("kling") ? "kling" : b.includes("flux") ? "flux" : b.includes("doubao") || b.includes("volc") ? "doubao" : b.includes("deepseek") ? "deepseek" : b.includes("minimax") ? "minimax" : b.includes("qwen") || b.includes("aliyun") ? "qwen" : b.includes("xai") ? "xai" : b.includes("fal") ? "fal" : b.includes("luma") ? "luma" : b.includes("runway") ? "runway" : b.includes("openai") ? "openai" : u.includes("jiaren") ? "jiaren" : "generic";
}
function Tc(n, i, c) {
  return ((n == null ? void 0 : n.alias) || i || (n == null ? void 0 : n.provider) || (n == null ? void 0 : n.modelId) || c || "AI").trim().slice(0, 1).toUpperCase() || "A";
}
function Lc({ model: n, modelAlias: i, modelId: c, className: u = "", size: b = "sm" }) {
  const m = Rc(n, i, c), A = ["model-icon", b, m, u].filter(Boolean).join(" "), P = JiarenProviderIcons[m];
  return P ? t.jsx("img", { className: A, src: P, alt: "", draggable: false }) : t.jsx("span", { className: A, children: Oc(m, Tc(n, i, c)) });
}
function Oc(n, i) {
  switch (n) {
    case "anthropic":
      return "A";
    case "openai":
      return "O";
    case "google":
      return "G";
    case "doubao":
      return "\u8C46";
    case "suno":
      return "S";
    case "minimax":
      return "M";
    case "qwen":
      return "Q";
    case "xai":
      return "x";
    case "flux":
      return "F";
    case "deepseek":
      return "D";
    case "jiaren":
      return "J";
    default:
      return i;
  }
}
const _c = "\u8bf7\u8f93\u5165\u517c\u5bb9\u63a5\u53e3\u5730\u5740";
function Fc({ open: n, onClose: i }) {
  const c = _((k) => k.runtimeSettings), u = _((k) => k.storageSettings), b = _((k) => k.setGlobalApiSettings), m = _((k) => k.updateModelOverride), A = _((k) => k.replaceRuntimeProviderModels), [P, S] = v.useState("image"), [B, E] = v.useState(false), [me, Z] = v.useState(), [H, F] = v.useState(false), [ve, xe] = v.useState(), Pe = v.useRef(""), z = c.global.fallbackBaseUrl || c.global.baseUrl || "", f = c.global.fallbackApiKey || c.global.apiKey || "", se = v.useMemo(() => c.models.filter((k) => k.category !== "tools" && k.category !== "video" && k.requestMode !== "openai-video" && Js(k)), [c.models]), T = v.useMemo(() => ba.reduce((k, pe) => ({ ...k, [pe.id]: se.filter((ee) => ee.category === pe.id && ee.enabled).length }), { chat: 0, image: 0, video: 0, music: 0, tools: 0 }), [se]), q = v.useMemo(() => se.filter((k) => k.category === P), [P, se]);
  if (v.useEffect(() => {
    var pe;
    if (!n) return;
    const k = ((pe = ba.find((ee) => T[ee.id] > 0)) == null ? void 0 : pe.id) ?? "image";
    T[P] === 0 && P !== k && S(k);
  }, [P, T, n]), v.useEffect(() => {
    if (!n) return;
    const k = z.trim(), pe = f.trim();
    if (!k || !pe) {
      Pe.current = "";
      return;
    }
    const ee = `${k}
${pe.slice(0, 12)}
${c.global.apiUserId ?? ""}`;
    if (Pe.current === ee) return;
    const Ue = window.setTimeout(() => {
      Pe.current = ee, C("auto");
    }, 900);
    return () => window.clearTimeout(Ue);
  }, [f, z, n, c.global.apiUserId]), !n) return null;
  async function Ne(k) {
    Z(k.id), m(k.id, { status: "testing", lastMessage: void 0 });
    const pe = Fn(c, k.id), ee = await Gt.testConnection({ modelId: k.id, endpointModelId: k.endpointModelId, fallbackEndpointModelId: k.fallbackEndpointModelId, requestMode: k.requestMode, apiGroup: k.apiGroup, category: k.category, ...pe });
    m(k.id, { status: ee.ok ? "success" : "error", lastMessage: ee.message }), Z(void 0);
  }
  function Ce(k) {
    b({ baseUrl: k, fallbackBaseUrl: k }), Pe.current = "", A([]), k.trim() ? xe("Base URL \u5DF2\u53D8\u66F4\uFF0C\u6B63\u5728\u7B49\u5F85 API Key \u540E\u91CD\u65B0\u8BFB\u53D6\u5F53\u524D\u63A5\u53E3\u6A21\u578B\u3002") : xe("Base URL \u4E3A\u7A7A\uFF0CAPI \u6A21\u578B\u5217\u8868\u5DF2\u6E05\u7A7A\u3002");
  }
  function Ae(k) {
    b({ apiKey: k, fallbackApiKey: k }), Pe.current = "", A([]), k.trim() ? xe("API Key \u5DF2\u53D8\u66F4\uFF0C\u6B63\u5728\u91CD\u65B0\u8BFB\u53D6\u5F53\u524D\u63A5\u53E3\u6A21\u578B\u3002") : xe("API Key \u4E3A\u7A7A\uFF0CAPI \u6A21\u578B\u5217\u8868\u5DF2\u6E05\u7A7A\u3002");
  }
  function ze(k) {
    var pe;
    return ((pe = k.endpointModelId) == null ? void 0 : pe.trim()) || k.modelId;
  }
  function R(k) {
    return k.category === "tools" ? "\u672C\u5730\u5DE5\u5177" : "\u5F53\u524D\u63A5\u53E3";
  }
  function Q(k) {
    var ee, Ue, te;
    const pe = [(ee = k.resolutions) != null && ee.length ? `\u6E05\u6670\u5EA6 ${k.resolutions.join(" / ")}` : "", (Ue = k.aspectRatios) != null && Ue.length ? `\u6BD4\u4F8B ${k.aspectRatios.slice(0, 6).join(" / ")}${k.aspectRatios.length > 6 ? " ..." : ""}` : "", (te = k.qualities) != null && te.length && k.qualities.some((Be) => Be.toLowerCase() !== "auto") ? `\u8D28\u91CF ${k.qualities.join(" / ")}` : ""].filter(Boolean);
    return pe.length > 0 ? pe.join(" \xB7 ") : void 0;
  }
  async function C(k = "manual") {
    const pe = z.trim(), ee = f.trim();
    if (!pe || !ee) {
      A([]), xe("\u8BF7\u5148\u586B\u5199 Base URL \u548C API Key\uFF1B\u672A\u586B\u5199\u524D\u4E0D\u4F1A\u663E\u793A\u4EFB\u4F55 API \u6A21\u578B\u3002");
      return;
    }
    F(true), xe(k === "auto" ? "\u6B63\u5728\u4ECE\u5F53\u524D\u63A5\u53E3\u8BFB\u53D6 /models?type=all..." : void 0);
    try {
      const Ue = await Gt.listProviderModels({ baseUrl: pe, apiKey: ee, apiUserId: c.global.apiUserId });
      if (!Ue.ok) {
        A([]), xe(Ue.message);
        return;
      }
      const te = Hs(Ue.models, { baseUrl: pe, apiKey: ee, apiUserId: c.global.apiUserId });
      A(te);
      const Be = ba.map((w) => {
        const X = te.filter((we) => we.category === w.id).length;
        return X > 0 && w.id !== "tools" ? `${w.label} ${X}` : "";
      }).filter(Boolean).join(" / ");
      xe(te.length > 0 ? `\u5DF2\u4ECE\u5F53\u524D\u63A5\u53E3\u8BFB\u53D6 ${Ue.models.length} \u4E2A\u539F\u59CB\u6A21\u578B\uFF0C\u6574\u7406\u4E3A ${te.length} \u4E2A\u53EF\u9009\u6A21\u578B\uFF1A${Be || "\u672A\u8BC6\u522B\u5206\u7C7B"}\u3002` : "\u63A5\u53E3\u53EF\u8BBF\u95EE\uFF0C\u4F46 /models \u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u6A21\u578B\uFF1BAPI \u6A21\u578B\u5217\u8868\u5DF2\u6E05\u7A7A\u3002");
    } catch (Ue) {
      A([]), xe(Ue instanceof Error ? Ue.message : "\u540C\u6B65\u6A21\u578B\u5217\u8868\u5931\u8D25\u3002");
    } finally {
      F(false);
    }
  }
  return t.jsx("div", { className: "modal-backdrop", role: "presentation", children: t.jsxs("section", { className: "settings-modal", role: "dialog", "aria-modal": "true", "aria-label": "API \u8BBE\u7F6E", children: [t.jsxs("header", { className: "modal-header", children: [t.jsxs("div", { children: [t.jsx("span", { className: "eyebrow", children: "\u517C\u5BB9 API" }), t.jsx("h2", { children: "API \u4E0E\u6A21\u578B\u8DEF\u7531" })] }), t.jsxs("div", { className: "modal-header-actions", children: [t.jsxs("button", { className: "icon-text-button", type: "button", disabled: H, onClick: () => void C("manual"), children: [H ? t.jsx(Ia, { className: "spin", size: 16 }) : t.jsx(Pi, { size: 16 }), "\u8BFB\u53D6\u5F53\u524D\u63A5\u53E3\u6A21\u578B"] }), t.jsx("button", { className: "ghost-icon-button compact", type: "button", title: "\u5173\u95ED", onClick: i, children: t.jsx(Xs, { size: 20 }) })] })] }), t.jsx("nav", { className: "settings-tabs", children: ba.filter((k) => T[k.id] > 0).map((k) => t.jsxs("button", { className: k.id === P ? "tab-button active" : "tab-button", type: "button", onClick: () => S(k.id), children: [k.label, t.jsx("span", { children: T[k.id] })] }, k.id)) }), t.jsxs("div", { className: "global-config", children: [t.jsxs("label", { children: [t.jsx("span", { children: "Base URL" }), t.jsx("input", { value: z, placeholder: _c, onChange: (k) => Ce(k.target.value) })] }), t.jsxs("label", { children: [t.jsx("span", { children: "API Key" }), t.jsxs("div", { className: "secret-field", children: [t.jsx("input", { value: f, type: B ? "text" : "password", placeholder: "sk-... / \u7B2C\u4E09\u65B9 API Key", onChange: (k) => Ae(k.target.value) }), t.jsx("button", { className: "ghost-icon-button compact", type: "button", title: B ? "\u9690\u85CF Key" : "\u663E\u793A Key", onClick: () => E(!B), children: B ? t.jsx(ec, { size: 17 }) : t.jsx(tc, { size: 17 }) })] })] })] }), t.jsxs("div", { className: "settings-api-note", children: [t.jsx("strong", { children: "\u5F53\u524D\u53EA\u4FDD\u7559\u4E00\u5957\u63A5\u53E3\u6A21\u578B\u76EE\u5F55" }), t.jsx("span", { children: "\u672A\u586B\u5199 Base URL \u548C API Key \u65F6\uFF0C\u8F6F\u4EF6\u4E0D\u4F1A\u9884\u7F6E\u4EFB\u4F55 API \u6A21\u578B\uFF0C\u907F\u514D\u65E7\u6A21\u578B\u6DF7\u5165\u3002" }), t.jsx("span", { children: "\u586B\u5199\u540E\u4F1A\u81EA\u52A8\u8C03\u7528\u5F53\u524D\u63A5\u53E3\u7684 /models?type=all\uFF0C\u8BFB\u53D6\u771F\u5B9E\u53EF\u7528\u6A21\u578B\uFF0C\u5E76\u66FF\u6362\u5F53\u524D API \u6A21\u578B\u5217\u8868\u3002" }), t.jsx("span", { children: "\u9875\u9762\u663E\u793A\u53CB\u597D\u540D\u79F0\u548C\u5382\u5546\u56FE\u6807\uFF1B\u771F\u5B9E\u8BF7\u6C42\u4F7F\u7528 /models \u8FD4\u56DE\u7684\u539F\u59CB model id\u3002" }), t.jsx("span", { children: "\u5982\u679C\u4E4B\u540E\u5207\u6362\u4E3A\u53E6\u4E00\u4E2A\u7F51\u7AD9\u5730\u5740\u548C\u5BC6\u94A5\uFF0C\u6A21\u578B\u5217\u8868\u4F1A\u968F\u4E4B\u5207\u6362\uFF0C\u4E0D\u518D\u6DF7\u7528\u4E0A\u4E00\u5BB6\u63A5\u53E3\u3002" }), ve ? t.jsx("span", { children: ve }) : null] }), q.length === 0 ? t.jsxs("div", { className: "settings-api-note", children: [t.jsx("strong", { children: "\u5F53\u524D\u5206\u7C7B\u6682\u65E0\u6A21\u578B" }), t.jsx("span", { children: z.trim() && f.trim() ? "\u8BF7\u70B9\u51FB\u201C\u8BFB\u53D6\u5F53\u524D\u63A5\u53E3\u6A21\u578B\u201D\uFF0C\u6216\u68C0\u67E5\u8BE5\u63A5\u53E3 /models?type=all \u662F\u5426\u8FD4\u56DE\u6B64\u5206\u7C7B\u6A21\u578B\u3002" : "\u8BF7\u5148\u586B\u5199 Base URL \u548C API Key\uFF0C\u8F6F\u4EF6\u4F1A\u81EA\u52A8\u8BFB\u53D6\u6A21\u578B\u5217\u8868\u3002" })] }) : t.jsx("div", { className: "override-grid", children: q.map((k) => t.jsxs("article", { className: "model-card", children: [t.jsxs("div", { className: "model-card-head", children: [t.jsxs("div", { children: [t.jsxs("strong", { className: "model-title-with-badge", children: [t.jsx(Lc, { model: k, size: "md" }), k.alias] }), t.jsxs("span", { className: "model-card-subtitle", children: [Qc(k.category), " \xB7 ", R(k)] }), Q(k) ? t.jsx("span", { className: "model-card-subtitle model-param-summary", children: Q(k) }) : null, t.jsxs("details", { className: "model-advanced-details", children: [t.jsx("summary", { children: "\u9AD8\u7EA7\u63A5\u53E3\u5B57\u6BB5" }), t.jsxs("code", { className: "model-api-id", children: ["model: ", ze(k)] })] })] }), t.jsx("span", { className: `connection-dot ${k.status}` })] }), k.category !== "tools" ? t.jsx("div", { className: "settings-api-note compact", children: t.jsx("span", { children: "\u8BE5\u6A21\u578B\u6765\u81EA\u5F53\u524D Base URL \u7684 /models \u8FD4\u56DE\uFF1B\u771F\u5B9E\u8BF7\u6C42\u4F7F\u7528\u4E0A\u65B9\u663E\u793A\u7684\u539F\u59CB model id\u3002" }) }) : null, t.jsxs("div", { className: "model-card-actions", children: [k.category !== "tools" ? t.jsxs("button", { className: "icon-text-button", type: "button", onClick: () => void Ne(k), children: [me === k.id ? t.jsx(Ia, { className: "spin", size: 16 }) : t.jsx(nc, { size: 16 }), "\u6D4B\u8BD5\u8FDE\u63A5"] }) : null, k.status === "success" ? t.jsxs("span", { className: "test-message success", children: [t.jsx(ac, { size: 14 }), "\u53EF\u7528"] }) : t.jsx("span", { className: "test-message", children: k.lastMessage })] })] }, k.id)) }), t.jsxs("footer", { className: "settings-save-hint", children: ["\u6A21\u578B\u53C2\u6570\u6309\u5F53\u524D\u63A5\u53E3\u6587\u6863\u53D1\u9001\uFF1B\u56FA\u5B9A Comfly / \u56FA\u5B9A Apilio / \u65E7 toapis \u76EE\u5F55\u4E0D\u4F1A\u518D\u8FDB\u5165\u9ED8\u8BA4\u5217\u8868\u3002", u.cacheDir ? t.jsxs("span", { children: ["\u7F13\u5B58\u76EE\u5F55: ", u.cacheDir] }) : null] })] }) });
}
function Qc(n) {
  switch (n) {
    case "chat":
      return "\u6587\u5B57\u63A8\u7406\u6A21\u578B";
    case "image":
      return "\u56FE\u7247\u6A21\u578B";
    case "video":
      return "\u89C6\u9891\u6A21\u578B";
    case "music":
      return "\u97F3\u9891\u6A21\u578B";
    case "tools":
      return "\u5DE5\u5177\u6A21\u578B";
    default:
      return "\u6A21\u578B";
  }
}
class Ai extends v.Component {
  constructor() {
    super(...arguments);
    ii(this, "state", {});
    ii(this, "reset", () => {
      this.setState({ error: void 0 });
    });
  }
  static getDerivedStateFromError(c) {
    return { error: c };
  }
  componentDidCatch(c, u) {
    var b, m;
    (m = (b = this.props).onError) == null || m.call(b, c, u);
  }
  render() {
    return this.state.error ? this.props.fallback(this.state.error, this.reset) : this.props.children;
  }
}
function Kc(n) {
  const i = new Date(n);
  return Number.isNaN(i.getTime()) ? "" : i.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function Or(n, i) {
  const mime = String(n.mimeType || "").split(";")[0].toLowerCase();
  const extension = n.assetType === "video" ? "mp4" : mime === "image/svg+xml" ? "svg" : mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";
  return `jiaren_${new Date(n.createdAt).toISOString().replace(/\D/g, "").slice(0, 14) || Date.now()}_${i + 1}.${extension}`;
}
function Vc({ open: n, onClose: i }) {
  const c = _((f) => f.history), u = _((f) => f.storageSettings), b = _((f) => f.workflowNodes), m = _((f) => f.promptBarNodeId), A = _((f) => f.createWorkflowNode), P = _((f) => f.addPromptReference), S = _((f) => f.updateNodeData), B = _((f) => f.setPromptBarNode), E = _((f) => f.setSelectedNode), me = _((f) => f.removeHistoryItem), [Z, H] = v.useState("");
  if (!n) return null;
  function F(f, se) {
    const T = f.localPath ?? f.thumbnail;
    T && A({ kind: f.assetType === "video" ? "videoGenerate" : "imageInput", position: { x: 260 + se * 36, y: 160 + se * 36 }, label: f.assetType === "video" ? "\u5386\u53F2\u89C6\u9891" : "\u5386\u53F2\u56FE\u7247", data: { imageSource: f.assetType === "video" ? void 0 : T, localPath: f.localPath, fileName: Or(f, se), width: f.width, height: f.height, outputAssets: f.assetType === "video" ? [{ id: f.id, type: "video", localPath: f.localPath, url: f.thumbnail, durationMs: f.durationMs }] : void 0, status: "succeeded" } });
  }
  function ve(f) {
    var Ne;
    if (!(f.localPath ?? f.thumbnail) || f.assetType === "video") return;
    let T = b.find((Ce) => Ce.id === m && (Ce.data.kind === "generateImage" || Ce.data.kind === "editImage")) ?? b.find((Ce) => Ce.data.kind === "generateImage");
    const q = (Ne = f.prompt) == null ? void 0 : Ne.trim();
    if (T || (T = A({ kind: "generateImage", position: { x: 340, y: 220 }, label: "\u5386\u53F2\u63D0\u793A\u8BCD\u751F\u56FE", data: { prompt: q || "", status: "idle", message: "\u5DF2\u4ECE\u751F\u6210\u5386\u53F2\u521B\u5EFA\u751F\u56FE\u8282\u70B9\u3002" } })), P({ id: f.id, nodeId: T == null ? void 0 : T.id, name: f.prompt || "\u5386\u53F2\u56FE\u7247", localPath: f.localPath, dataUrl: f.localPath ? void 0 : f.thumbnail }), T && (B(T.id), E(T.id), q)) {
      const Ce = String(T.data.prompt ?? "").trim(), Ae = Ce ? Ce.includes(q) ? Ce : `${Ce}

${q}` : q;
      S(T.id, { prompt: Ae, message: Ce && Ce !== Ae ? "\u5DF2\u52A0\u5165\u5386\u53F2\u56FE\u7247\uFF0C\u5E76\u628A\u539F\u751F\u6210\u63D0\u793A\u8BCD\u8FFD\u52A0\u5230\u5F53\u524D\u63D0\u793A\u8BCD\u3002" : "\u5DF2\u52A0\u5165\u5386\u53F2\u56FE\u7247\uFF0C\u5E76\u81EA\u52A8\u586B\u5165\u539F\u751F\u6210\u63D0\u793A\u8BCD\u3002" }), window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("jiaren-focus-prompt", { detail: { nodeId: T == null ? void 0 : T.id, prompt: Ae } }));
      }, 0), H(Ce && Ce !== Ae ? "\u5DF2\u52A0\u5165\u53C2\u8003\u56FE\uFF0C\u5E76\u8FFD\u52A0\u539F\u63D0\u793A\u8BCD\u3002" : "\u5DF2\u52A0\u5165\u53C2\u8003\u56FE\uFF0C\u5E76\u81EA\u52A8\u586B\u5165\u539F\u63D0\u793A\u8BCD\u3002");
      return;
    }
    H(q ? "\u5DF2\u52A0\u5165\u53C2\u8003\u56FE\uFF1B\u5F53\u524D\u63D0\u793A\u8BCD\u4E0D\u4E3A\u7A7A\uFF0C\u672A\u8986\u76D6\u3002" : "\u5DF2\u52A0\u5165\u53C2\u8003\u56FE\u3002");
  }
  async function xe(f, se) {
    var Ne;
    const T = f.localPath ?? f.thumbnail;
    if (!T) return;
    const q = await ((Ne = window.jiaren) == null ? void 0 : Ne.system.saveAsset({ source: T, localPath: f.localPath, directory: u.downloadsDir, fileName: Or(f, se) }));
    H(q != null && q.path ? `\u4E0B\u8F7D\u6210\u529F\uFF1A${q.path}` : (q == null ? void 0 : q.message) ?? "\u4E0B\u8F7D\u5931\u8D25\u3002");
  }
  async function Pe(f) {
    var q, Ne;
    const se = f.localPath ?? f.thumbnail;
    if (!se) {
      H("\u8FD9\u4E2A\u5386\u53F2\u8BB0\u5F55\u6CA1\u6709\u53EF\u4FDD\u5B58\u7684\u7D20\u6750\u3002");
      return;
    }
    const T = await ((Ne = window.jiaren) == null ? void 0 : Ne.system.addResource({ kind: f.assetType === "video" ? "video" : "image", name: ((q = f.prompt) == null ? void 0 : q.trim().slice(0, 48)) || (f.assetType === "video" ? "\u5386\u53F2\u89C6\u9891" : "\u5386\u53F2\u56FE\u7247"), category: f.assetType === "video" ? "\u5386\u53F2\u89C6\u9891" : "\u5386\u53F2\u56FE\u7247", source: se, localPath: f.localPath, dataUrl: f.localPath ? void 0 : f.thumbnail, metadata: { historyId: f.id, modelId: f.modelId, modelAlias: f.modelAlias, prompt: f.prompt, durationMs: f.durationMs } }));
    H(T != null && T.ok ? "\u5DF2\u52A0\u5165\u7D20\u6750\u5E93\u3002" : (T == null ? void 0 : T.message) || "\u52A0\u5165\u7D20\u6750\u5E93\u5931\u8D25\u3002");
  }
  function z(f) {
    const se = f.localPath ?? f.thumbnail;
    !se || f.assetType === "video" || window.dispatchEvent(new CustomEvent("jiaren-open-image-preview", { detail: { source: se, localPath: f.localPath, title: f.prompt || f.modelAlias || "\u5386\u53F2\u56FE\u7247", subtitle: f.width && f.height ? `${f.width} x ${f.height}` : f.modelAlias } }));
  }
  return t.jsxs("aside", { className: "history-rail floating", children: [t.jsxs("div", { className: "history-header", children: [t.jsx("strong", { children: "\u751F\u6210\u5386\u53F2" }), t.jsxs("div", { children: [t.jsx("button", { type: "button", title: "\u5237\u65B0", children: t.jsx(Pi, { size: 14 }) }), t.jsx("button", { type: "button", title: "\u6536\u8D77", onClick: i, children: t.jsx(ic, { size: 14 }) })] })] }), t.jsx("div", { className: "history-list", children: c.length === 0 ? t.jsxs("div", { className: "history-empty", children: [t.jsx(fn, { size: 26 }), t.jsx("span", { children: "\u751F\u6210\u7ED3\u679C\u4F1A\u663E\u793A\u5728\u8FD9\u91CC" })] }) : c.map((f, se) => {
    const T = f.localPath ?? f.thumbnail;
    return t.jsxs("article", { className: "history-result-card", draggable: !!T, onDragStart: (q) => {
      q.dataTransfer.setData("application/x-jiaren-history", JSON.stringify(f)), q.dataTransfer.effectAllowed = "copy";
    }, children: [t.jsxs("button", { className: "history-preview-button", type: "button", title: "\u53CC\u51FB\u653E\u5927\u9884\u89C8", onDoubleClick: () => z(f), children: [t.jsx("span", { className: "history-preview-frame", children: f.assetType === "video" ? t.jsx(no, { size: 24 }) : T ? t.jsx("img", { alt: "", src: T }) : t.jsx(fn, { size: 24 }) }), t.jsx("span", { className: f.status === "failed" ? "history-status-badge failed" : "history-status-badge ok", children: f.status === "failed" ? "\u5931\u8D25" : f.localPath ? "\u5DF2\u7F13\u5B58" : "\u7ED3\u679C" })] }), t.jsxs("div", { className: "history-card-body", children: [t.jsx("strong", { children: f.status === "failed" ? "\u751F\u6210\u5931\u8D25" : f.prompt || "\u672A\u547D\u540D\u751F\u6210" }), t.jsxs("p", { children: [Kc(f.createdAt), " \xB7 ", f.modelAlias] }), t.jsx("small", { title: f.message, children: f.message || (f.elapsedMs > 0 ? `${(f.elapsedMs / 1e3).toFixed(1)}s` : f.modelAlias) })] }), t.jsxs("div", { className: "history-card-actions compact", children: [t.jsx("button", { type: "button", title: "\u53D1\u9001\u5230\u5F53\u524D\u63D0\u793A\u8BCD", onClick: () => ve(f), disabled: !T || f.assetType === "video", children: t.jsx(rc, { size: 14 }) }), t.jsx("button", { type: "button", title: "\u53D1\u9001\u5230\u753B\u5E03", onClick: () => F(f, se), disabled: !T, children: t.jsx(ao, { size: 14 }) }), t.jsx("button", { type: "button", title: "\u52A0\u5165\u7D20\u6750\u5E93", onClick: () => void Pe(f), disabled: !T, children: t.jsx(yn, { size: 14 }) }), t.jsx("button", { type: "button", title: f.assetType === "video" ? "\u4E0B\u8F7D\u89C6\u9891" : "\u4E0B\u8F7D\u56FE\u7247", onClick: () => void xe(f, se), disabled: !T, children: t.jsx(io, { size: 14 }) }), t.jsx("button", { type: "button", title: "\u5220\u9664\u8BB0\u5F55", onClick: () => me(f.id), children: t.jsx(Sa, { size: 14 }) })] })] }, f.id);
  }) }), Z ? t.jsx("div", { className: "history-download-notice", children: Z }) : null] });
}
const ja = 48, Gc = [{ kind: "all", label: "\u5168\u90E8" }, { kind: "image", label: "\u56FE\u7247" }, { kind: "video", label: "\u89C6\u9891" }, { kind: "audio", label: "\u97F3\u9891" }, { kind: "text", label: "\u6587\u672C" }, { kind: "pose", label: "\u59FF\u52BF" }, { kind: "set", label: "\u7D20\u6750\u96C6" }];
function zc(n) {
  return n === "video" ? t.jsx(no, { size: 22 }) : n === "audio" ? t.jsx(cc, { size: 22 }) : n === "text" ? t.jsx(lc, { size: 22 }) : n === "set" ? t.jsx(yn, { size: 22 }) : t.jsx(dc, { size: 22 });
}
function Jc(n) {
  if (n.kind === "set") {
    const i = n.metadata, c = Array.isArray(i == null ? void 0 : i.canvasAssets) ? i.canvasAssets.length : 0, u = Array.isArray(i == null ? void 0 : i.nodes) ? i.nodes.length : 0;
    return `${c} \u4E2A\u7D20\u6750 \xB7 ${u} \u4E2A\u8282\u70B9`;
  }
  return n.category || n.kind;
}
function Hc(n) {
  return n.assetType === "video" ? "video" : "image";
}
function Wc(n) {
  var c;
  const i = (c = n.prompt) == null ? void 0 : c.trim();
  return i ? i.slice(0, 48) : n.assetType === "video" ? "\u5386\u53F2\u89C6\u9891" : "\u5386\u53F2\u56FE\u7247";
}
function qc({ open: n, onClose: i, onInsert: c, onRestoreSet: u, onApplySetToVideo: b, onNotice: m }) {
  const [A, P] = v.useState([]), [S, B] = v.useState("all"), [E, me] = v.useState(""), [Z, H] = v.useState(false), [F, ve] = v.useState(false), [xe, Pe] = v.useState(false), [z, f] = v.useState(false), [se, T] = v.useState("\u81EA\u5B9A\u4E49\u6587\u672C"), [q, Ne] = v.useState(""), [Ce, Ae] = v.useState(ja), ze = v.useMemo(() => Array.from(new Set(A.map((w) => w.category).filter(Boolean))), [A]), R = v.useMemo(() => A.slice(0, Ce), [A, Ce]), Q = Ce < A.length;
  async function C() {
    var X;
    const w = await ((X = window.jiaren) == null ? void 0 : X.system.listResources({ kind: S, search: E, favoriteOnly: Z }));
    w != null && w.ok ? (P(w.items), Ae(ja)) : w != null && w.message && m(w.message);
  }
  if (v.useEffect(() => {
    n && C();
  }, [n, S, Z]), v.useEffect(() => {
    Ae(ja);
  }, [S, Z, E]), v.useEffect(() => {
    const w = () => {
      n && C();
    };
    return window.addEventListener("jiaren-resource-library-refresh", w), () => window.removeEventListener("jiaren-resource-library-refresh", w);
  }, [n, S, Z, E]), !n) return null;
  async function k(w) {
    var Ve;
    const X = w.localPath || w.thumbnail;
    if (!X) {
      m("\u8FD9\u4E2A\u5386\u53F2\u8BB0\u5F55\u6CA1\u6709\u53EF\u4FDD\u5B58\u7684\u56FE\u7247\u6216\u89C6\u9891\u3002");
      return;
    }
    ve(true);
    const we = await ((Ve = window.jiaren) == null ? void 0 : Ve.system.addResource({ kind: Hc(w), name: Wc(w), category: w.assetType === "video" ? "\u5386\u53F2\u89C6\u9891" : "\u5386\u53F2\u56FE\u7247", source: X, localPath: w.localPath, dataUrl: w.localPath ? void 0 : w.thumbnail, metadata: { historyId: w.id, modelId: w.modelId, modelAlias: w.modelAlias, prompt: w.prompt, durationMs: w.durationMs } }));
    ve(false), we != null && we.ok ? (m("\u5DF2\u52A0\u5165\u7D20\u6750\u5E93\u3002"), await C()) : m((we == null ? void 0 : we.message) || "\u52A0\u5165\u7D20\u6750\u5E93\u5931\u8D25\u3002");
  }
  async function pe() {
    var X, we;
    const w = await ((X = window.jiaren) == null ? void 0 : X.system.selectFiles());
    if (!(!w || w.canceled || w.assets.length === 0)) {
      ve(true);
      for (const Ve of w.assets) await ((we = window.jiaren) == null ? void 0 : we.system.addResource({ kind: Ve.kind === "other" ? void 0 : Ve.kind, name: Ve.name, category: Ve.kind === "video" ? "\u81EA\u5B9A\u4E49\u89C6\u9891" : Ve.kind === "audio" ? "\u81EA\u5B9A\u4E49\u97F3\u9891" : "\u81EA\u5B9A\u4E49\u56FE\u7247", localPath: Ve.localPath, mimeType: Ve.mimeType }));
      ve(false), m(`\u5DF2\u52A0\u5165 ${w.assets.length} \u4E2A\u7D20\u6750\u3002`), await C();
    }
  }
  async function ee() {
    var X;
    if (!q.trim()) {
      m("\u5148\u8F93\u5165\u6587\u672C\u5185\u5BB9\u3002");
      return;
    }
    ve(true);
    const w = await ((X = window.jiaren) == null ? void 0 : X.system.addResource({ kind: "text", name: se.trim() || "\u81EA\u5B9A\u4E49\u6587\u672C", category: "\u81EA\u5B9A\u4E49\u6587\u672C", text: q }));
    ve(false), w != null && w.ok ? (Ne(""), f(false), m("\u6587\u672C\u7D20\u6750\u5DF2\u4FDD\u5B58\u3002"), await C()) : m((w == null ? void 0 : w.message) || "\u4FDD\u5B58\u6587\u672C\u5931\u8D25\u3002");
  }
  async function Ue(w) {
    var we;
    const X = await ((we = window.jiaren) == null ? void 0 : we.system.updateResource(w.id, { favorite: !w.favorite }));
    X != null && X.ok && await C();
  }
  async function te(w) {
    var we;
    const X = await ((we = window.jiaren) == null ? void 0 : we.system.deleteResource(w.id));
    X != null && X.ok ? (m("\u7D20\u6750\u5DF2\u5220\u9664\u3002"), await C()) : m((X == null ? void 0 : X.message) || "\u5220\u9664\u5931\u8D25\u3002");
  }
  async function Be(w) {
    w.preventDefault(), Pe(false);
    const X = w.dataTransfer.getData("application/x-jiaren-history");
    if (X) {
      try {
        await k(JSON.parse(X));
      } catch {
        m("\u5386\u53F2\u8BB0\u5F55\u6570\u636E\u8BFB\u53D6\u5931\u8D25\u3002");
      }
      return;
    }
    w.dataTransfer.files.length > 0 && m("\u8BF7\u7528\u201C\u81EA\u5B9A\u4E49\u4E0A\u4F20\u201D\u5BFC\u5165\u672C\u5730\u6587\u4EF6\u3002");
  }
  return t.jsxs("aside", { className: `resource-library-drawer ${xe ? "drag-over" : ""}`, onDragOver: (w) => {
    w.preventDefault(), Pe(true);
  }, onDragLeave: () => Pe(false), onDrop: (w) => void Be(w), children: [t.jsxs("header", { className: "resource-library-head", children: [t.jsxs("div", { children: [t.jsx(yn, { size: 18 }), t.jsx("strong", { children: "\u7D20\u6750\u5E93" }), t.jsxs("span", { children: [A.length, " \u4E2A\u7D20\u6750"] })] }), t.jsx("button", { type: "button", title: "\u5173\u95ED", onClick: i, children: t.jsx(Kt, { size: 16 }) })] }), t.jsxs("section", { className: "resource-library-actions", children: [t.jsxs("label", { children: [t.jsx(oc, { size: 15 }), t.jsx("input", { value: E, placeholder: "\u641C\u7D22\u540D\u79F0\u3001\u5206\u7C7B\u3001\u6807\u7B7E", onChange: (w) => me(w.target.value), onKeyDown: (w) => {
    w.key === "Enter" && C();
  } })] }), t.jsx("button", { type: "button", title: "\u641C\u7D22", onClick: () => void C(), children: t.jsx(Pi, { size: 15 }) }), t.jsx("button", { className: Z ? "active" : "", type: "button", title: "\u53EA\u770B\u6536\u85CF", onClick: () => H((w) => !w), children: t.jsx(Tr, { size: 15 }) })] }), t.jsx("nav", { className: "resource-library-tabs", "aria-label": "\u7D20\u6750\u7C7B\u578B", children: Gc.map((w) => t.jsx("button", { className: S === w.kind ? "active" : "", type: "button", onClick: () => B(w.kind), children: w.label }, w.kind)) }), t.jsxs("section", { className: "resource-library-custom", children: [t.jsxs("button", { type: "button", onClick: () => void pe(), disabled: F, children: [t.jsx(sc, { size: 15 }), "\u81EA\u5B9A\u4E49\u4E0A\u4F20"] }), t.jsxs("button", { type: "button", onClick: () => f((w) => !w), children: [t.jsx(ao, { size: 15 }), "\u81EA\u5B9A\u4E49\u6587\u672C"] })] }), z ? t.jsxs("section", { className: "resource-library-textbox", children: [t.jsx("input", { value: se, onChange: (w) => T(w.target.value), placeholder: "\u6587\u672C\u540D\u79F0" }), t.jsx("textarea", { value: q, onChange: (w) => Ne(w.target.value), placeholder: "\u5BFC\u6F14\u8BCD\u3001\u5546\u54C1\u5356\u70B9\u3001\u955C\u5934\u8BF4\u660E\u3001\u63D0\u793A\u8BCD\u7247\u6BB5\u90FD\u53EF\u4EE5\u4FDD\u5B58\u5230\u8FD9\u91CC\u3002" }), t.jsx("button", { type: "button", onClick: () => void ee(), disabled: F, children: "\u4FDD\u5B58\u6587\u672C\u7D20\u6750" })] }) : null, ze.length > 0 ? t.jsx("div", { className: "resource-library-categories", children: ze.slice(0, 10).map((w) => t.jsx("span", { children: w }, w)) }) : null, t.jsx("div", { className: "resource-library-drop-hint", children: "\u53EF\u628A\u5386\u53F2\u8BB0\u5F55\u91CC\u7684\u56FE\u7247\u6216\u89C6\u9891\u76F4\u63A5\u62D6\u5230\u8FD9\u91CC\u4FDD\u5B58\u3002" }), t.jsxs("section", { className: "resource-library-grid", children: [A.length === 0 ? t.jsxs("div", { className: "resource-library-empty", children: [t.jsx(yn, { size: 34 }), t.jsx("strong", { children: "\u7D20\u6750\u5E93\u8FD8\u662F\u7A7A\u7684" }), t.jsx("span", { children: "\u62D6\u5165\u5386\u53F2\u7ED3\u679C\uFF0C\u6216\u70B9\u51FB\u81EA\u5B9A\u4E49\u4E0A\u4F20\u3002" })] }) : R.map((w) => t.jsxs("article", { className: "resource-library-card", children: [t.jsx("button", { className: "resource-library-preview", type: "button", onClick: () => c(w), title: "\u63D2\u5165\u753B\u5E03", children: w.kind === "image" && (w.thumbnail || w.dataUrl || w.localPath) ? t.jsx("img", { alt: "", loading: "lazy", decoding: "async", src: w.thumbnail || w.dataUrl || w.localPath }) : t.jsx("span", { children: zc(w.kind) }) }), t.jsxs("div", { className: "resource-library-card-body", children: [t.jsx("strong", { title: w.name, children: w.name }), t.jsx("span", { children: Jc(w) })] }), t.jsxs("div", { className: "resource-library-card-actions", children: [w.kind === "set" ? t.jsxs(t.Fragment, { children: [t.jsx("button", { type: "button", title: "\u6062\u590D\u5230\u753B\u5E03", onClick: () => u(w), children: t.jsx(yn, { size: 14 }) }), t.jsx("button", { type: "button", title: "\u5957\u7528\u5230\u89C6\u9891\u5DE5\u4F5C\u6D41", onClick: () => b(w), children: t.jsx(ro, { size: 14 }) })] }) : t.jsx("button", { className: w.favorite ? "active" : "", type: "button", title: "\u6536\u85CF", onClick: () => void Ue(w), children: t.jsx(Tr, { size: 14 }) }), t.jsx("button", { type: "button", title: "\u5220\u9664", onClick: () => void te(w), children: t.jsx(Sa, { size: 14 }) })] })] }, w.id)), Q ? t.jsxs("button", { className: "resource-library-load-more", type: "button", onClick: () => Ae((w) => w + ja), children: ["\u52A0\u8F7D\u66F4\u591A\u7D20\u6750\uFF08", R.length, "/", A.length, "\uFF09"] }) : null] })] });
}
function Yc({ open: n, onClose: i }) {
  const c = _((z) => z.storageSettings), u = _((z) => z.stats), b = _((z) => z.workflowNodes), m = _((z) => z.workflowEdges), A = _((z) => z.canvasAssets), P = _((z) => z.history), S = _((z) => z.uiPreferences), B = _((z) => z.setStorageSettings), E = u ? Math.min(100, Math.round(u.heapUsedMb / Math.max(u.heapTotalMb, 1) * 100)) : 0, [me, Z] = v.useState("");
  if (!n) return null;
  async function H(z) {
    var se;
    const f = await ((se = window.jiaren) == null ? void 0 : se.system.selectDirectory());
    f && !f.canceled && f.path && (B({ [z]: f.path }), Z(`\u5DF2\u8BBE\u7F6E\u76EE\u5F55\uFF1A${f.path}`));
  }
  async function F() {
    var f;
    const z = await ((f = window.jiaren) == null ? void 0 : f.system.saveProject({ version: 1, savedAt: (/* @__PURE__ */ new Date()).toISOString(), projectName: S.projectName ?? "\u672A\u547D\u540D\u9879\u76EE", workflow: { nodes: b, edges: m }, canvas: { storageSettings: c, canvasAssets: A, history: P } }));
    Z(z != null && z.path ? `\u5DF2\u4FDD\u5B58\uFF1A${z.path}` : (z == null ? void 0 : z.message) ?? "\u5DF2\u4FDD\u5B58\u5F53\u524D\u5DE5\u4F5C\u6D41\u3002");
  }
  async function ve(z) {
    var se;
    if (!z) {
      Z("\u8BF7\u5148\u8BBE\u7F6E\u76EE\u5F55\u3002");
      return;
    }
    const f = await ((se = window.jiaren) == null ? void 0 : se.system.openPath(z));
    Z((f == null ? void 0 : f.message) ?? (f != null && f.ok ? "\u5DF2\u6253\u5F00\u76EE\u5F55\u3002" : "\u6253\u5F00\u5931\u8D25\u3002"));
  }
  function xe() {
    Z("\u5386\u53F2\u540C\u6B65\u5DF2\u52A0\u5165\u672C\u5730\u961F\u5217\u3002");
  }
  function Pe() {
    Z("\u5DF2\u8BF7\u6C42\u6E05\u7406\u7F29\u7565\u56FE\u7F13\u5B58\u548C\u4E34\u65F6 Blob \u5F15\u7528\u3002");
  }
  return t.jsx("div", { className: "floating-panel-backdrop", children: t.jsxs("section", { className: "storage-panel", role: "dialog", "aria-modal": "true", "aria-label": "\u672C\u5730\u5B58\u50A8\u7BA1\u7406", children: [t.jsxs("header", { className: "floating-panel-header", children: [t.jsxs("div", { children: [t.jsx(pc, { size: 16 }), t.jsx("strong", { children: "\u672C\u5730\u5B58\u50A8\u7BA1\u7406" })] }), t.jsx("button", { className: "square-icon-button", type: "button", onClick: i, children: t.jsx(Kt, { size: 18 }) })] }), t.jsxs("div", { className: "storage-section", children: [t.jsxs("h3", { children: [t.jsx(ri, { size: 16 }), "\u4E0B\u8F7D\u76EE\u5F55\u8BBE\u7F6E"] }), t.jsxs("div", { className: "path-row", children: [t.jsx("span", { children: "\u5F53\u524D\u4E0B\u8F7D\u76EE\u5F55" }), t.jsx("strong", { children: c.downloadsDir || "\u672A\u8BBE\u7F6E" })] }), t.jsxs("div", { className: "storage-actions two", children: [t.jsxs("button", { className: "blue-action", type: "button", onClick: () => void H("downloadsDir"), children: [t.jsx(ri, { size: 16 }), "\u9009\u62E9\u4E0B\u8F7D\u76EE\u5F55"] }), t.jsxs("button", { className: "green-action", type: "button", onClick: () => void ve(c.downloadsDir), children: [t.jsx(Lr, { size: 16 }), "\u6253\u5F00\u6587\u4EF6\u5939"] })] }), t.jsx("p", { children: "\u4E0B\u8F7D\u76EE\u5F55\u901A\u8FC7 Electron \u539F\u751F\u6587\u4EF6\u5939\u9009\u62E9\u5668\u8BBE\u7F6E\uFF0C\u751F\u6210\u56FE\u3001\u62A0\u56FE\u7ED3\u679C\u548C\u5BFC\u51FA\u6587\u4EF6\u90FD\u53EF\u4EE5\u4FDD\u5B58\u5230\u8FD9\u91CC\u3002" })] }), t.jsxs("div", { className: "storage-section", children: [t.jsxs("h3", { children: [t.jsx(uc, { size: 16 }), "\u8D44\u6E90\u7F13\u5B58\u76EE\u5F55", t.jsx("em", { children: "\u5DF2\u542F\u7528" })] }), t.jsxs("div", { className: "path-row", children: [t.jsx("span", { children: "\u7F13\u5B58\u76EE\u5F55" }), t.jsx("strong", { children: c.cacheDir || "\u672A\u8BBE\u7F6E" })] }), t.jsxs("div", { className: "storage-actions", children: [t.jsxs("button", { className: "green-action", type: "button", onClick: () => void H("cacheDir"), children: [t.jsx(ri, { size: 16 }), "\u66F4\u6362\u76EE\u5F55"] }), t.jsxs("button", { className: "green-outline-action", type: "button", onClick: () => void ve(c.cacheDir), children: [t.jsx(Lr, { size: 16 }), "\u6253\u5F00\u6587\u4EF6\u5939"] }), t.jsxs("button", { className: "gray-action", type: "button", onClick: xe, children: [t.jsx(mc, { size: 16 }), "\u540C\u6B65\u5386\u53F2"] })] }), t.jsx("p", { children: "\u7F13\u5B58\u9ED8\u8BA4\u9690\u85CF\u5728 EXE \u540C\u7EA7 `.jiaren/cache`\uFF0C\u7528\u6237\u70B9\u51FB\u5B58\u50A8\u540E\u624D\u663E\u793A\u548C\u7BA1\u7406\uFF0C\u4E0D\u6C61\u67D3\u7CFB\u7EDF\u76EE\u5F55\u3002" })] }), t.jsxs("div", { className: "storage-section compact", children: [t.jsxs("h3", { children: [t.jsx(xi, { size: 16 }), "\u5DE5\u4F5C\u6D41\u81EA\u52A8\u4FDD\u5B58", t.jsxs("label", { className: "inline-check", children: [t.jsx("input", { checked: c.autoSaveEnabled, type: "checkbox", onChange: (z) => B({ autoSaveEnabled: z.target.checked }) }), "\u542F\u7528"] })] }), t.jsxs("div", { className: "autosave-row", children: [t.jsx("span", { children: "\u4FDD\u5B58\u95F4\u9694\uFF08\u5206\u949F\uFF09" }), t.jsx("input", { min: 1, max: 60, type: "number", value: c.autoSaveMinutes, onChange: (z) => B({ autoSaveMinutes: Number(z.target.value) }) }), t.jsx("small", { children: "\u5F00\u542F\u540E\u4EC5\u5728\u753B\u5E03\u6709\u5185\u5BB9\u65F6\u4FDD\u5B58\u5230 `.project/workflow.json`" })] }), t.jsxs("button", { className: "orange-action", type: "button", onClick: () => void F(), children: [t.jsx(xi, { size: 16 }), "\u7ACB\u5373\u4FDD\u5B58"] })] }), t.jsxs("div", { className: "storage-section compact", children: [t.jsx("h3", { children: "\u5185\u5B58\u7BA1\u7406" }), t.jsxs("div", { className: "memory-card", children: [t.jsxs("div", { children: [t.jsx("span", { children: "JavaScript \u5806\u5185\u5B58" }), t.jsx("strong", { children: u ? `${u.heapUsedMb}MB / ${u.heapTotalMb}MB (${E}%)` : "\u8BFB\u53D6\u4E2D" })] }), t.jsx("div", { className: "meter-track", children: t.jsx("i", { style: { width: `${E}%` } }) }), t.jsxs("div", { children: [t.jsx("span", { children: "\u7CFB\u7EDF\u603B\u5185\u5B58" }), t.jsx("strong", { children: u ? `${Math.round(u.systemTotalMb / 1024)} GB` : "\u8BFB\u53D6\u4E2D" })] })] }), t.jsxs("button", { className: "danger-action", type: "button", onClick: Pe, children: [t.jsx(Sa, { size: 16 }), "\u6E05\u7406\u5185\u5B58"] })] }), me ? t.jsx("div", { className: "storage-notice", children: me }) : null] }) });
}
const Zc = [{ id: "pipeline-director", label: "\u5236\u7247\u6D41\u7A0B\u8C03\u5EA6", count: 64, stages: ["setup", "script", "character", "scene", "storyboard", "audio", "final"], logic: "\u9636\u6BB5\u963B\u65AD\u3001\u7528\u6237\u786E\u8BA4\u3001\u8FD4\u5DE5\u5FAA\u73AF\u3001\u6210\u672C\u4F30\u7B97\u3001\u5931\u8D25\u505C\u7559\u3001\u8282\u70B9\u8FFD\u52A0\u987A\u5E8F\u63A7\u5236\u3002" }, { id: "creative-intake", label: "\u9700\u6C42\u91C7\u96C6\u4E0E\u65B9\u6848\u6210\u578B", count: 42, stages: ["setup"], logic: "\u628A\u6A21\u7CCA\u60F3\u6CD5\u8F6C\u6210\u5F71\u7247\u65F6\u957F\u3001\u6BD4\u4F8B\u3001\u8BED\u8A00\u3001\u60C5\u7EEA\u3001\u76EE\u6807\u53D7\u4F17\u3001\u98CE\u683C\u8FB9\u754C\u548C\u98CE\u9669\u6E05\u5355\u3002" }, { id: "script-writing", label: "\u5267\u672C\u4E0E\u5BF9\u767D\u63A8\u7406", count: 76, stages: ["script"], logic: "\u94A9\u5B50\u3001\u51B2\u7A81\u3001\u884C\u52A8\u6BB5\u843D\u3001\u5BF9\u767D\u3001\u5185\u5FC3 OS\u3001\u53D9\u4E8B\u8282\u594F\u3001\u53EF\u89C6\u5316\u62CD\u70B9\u548C\u573A\u666F\u8FDE\u7EED\u6027\u3002" }, { id: "character-bible", label: "\u89D2\u8272\u8840\u7EDF\u9501\u5B9A", count: 73, stages: ["character"], logic: "\u89D2\u8272\u8EAB\u4EFD\u3001\u526A\u5F71\u3001\u8138\u90E8\u7279\u5F81\u3001\u670D\u88C5\u6750\u8D28\u3001\u8BC6\u522B\u8272\u3001\u7981\u5FCC\u9879\u3001\u591A\u56FE\u53C2\u8003\u548C\u540E\u7EED\u7EE7\u627F\u5B57\u6BB5\u3002" }, { id: "environment-design", label: "\u573A\u666F\u4E0E\u7A7A\u95F4\u7CFB\u7EDF", count: 68, stages: ["scene"], logic: "\u4ECE\u5267\u672C\u63D0\u70BC\u5730\u70B9\u3001\u65F6\u95F4\u3001\u7A7A\u95F4\u5C42\u7EA7\u3001\u5149\u5F71\u3001\u9053\u5177\u3001\u6C14\u6C1B\u548C\u89D2\u8272\u5165\u666F\u65B9\u5F0F\uFF0C\u907F\u514D\u957F\u4E0A\u4E0B\u6587\u7206\u4ED3\u3002" }, { id: "cinematography", label: "\u5206\u955C\u4E0E\u955C\u5934\u8BED\u8A00", count: 88, stages: ["storyboard"], logic: "\u666F\u522B\u3001\u6784\u56FE\u3001\u673A\u4F4D\u3001\u955C\u5934\u8FD0\u52A8\u3001\u9996\u5C3E\u5E27\u30014 \u5BAB\u683C\u65B9\u6848\u3001\u591A\u56FE\u53C2\u8003\u3001\u65F6\u7801\u548C\u8F6C\u573A\u3002" }, { id: "model-prompting", label: "\u591A\u6A21\u578B\u63D0\u793A\u8BCD\u7F16\u8BD1", count: 69, stages: ["character", "scene", "storyboard", "audio"], logic: "\u6309\u6A21\u578B\u80FD\u529B\u538B\u7F29\u63D0\u793A\u8BCD\u3001\u533A\u5206\u6587\u5B57\u63A8\u7406/\u56FE\u50CF/\u89C6\u9891/\u97F3\u9891\u53C2\u6570\uFF0C\u751F\u6210\u5931\u8D25\u65F6\u56DE\u9000\u5230\u53EF\u7528\u6A21\u578B\u3002" }, { id: "audio-post", label: "\u97F3\u4E50\u97F3\u6548\u4E0E\u6DF7\u5F55", count: 43, stages: ["audio", "final"], logic: "Suno \u914D\u4E50\u3001BPM\u3001\u73AF\u5883\u58F0\u3001\u52A8\u4F5C\u97F3\u6548\u3001TTS \u8BED\u8A00\u3001\u54CD\u5EA6\u3001\u6DF7\u5F55\u8282\u594F\u548C\u6700\u7EC8\u6210\u7247\u68C0\u67E5\u3002" }, { id: "review-quality", label: "\u4EA7\u7269\u5BA1\u6838\u4E0E\u8FD4\u4FEE", count: 57, stages: ["setup", "script", "character", "scene", "storyboard", "audio", "final"], logic: "\u7ED3\u6784\u5316 JSON \u6821\u9A8C\u3001\u4E0A\u4E0B\u6E38\u4E00\u81F4\u6027\u3001\u89D2\u8272\u4E0D\u6F02\u79FB\u3001\u573A\u666F\u8FDE\u7EED\u6027\u3001\u53EF\u6267\u884C\u6027\u548C\u7F3A\u5931\u9879\u63D0\u793A\u3002" }], Qt = { setup: { id: "setup", agentName: "\u827A\u672F\u603B\u76D1", productionRole: "\u827A\u672F\u603B\u76D1 / \u9700\u6C42\u5236\u7247\u4EBA", modelRoute: "claude-opus-4-7 \u4F18\u5148\uFF1B\u5907\u9009 Claude Sonnet / GPT \u9AD8\u7EA6\u675F\u6587\u5B57\u6A21\u578B\u3002", stageIntent: "\u53EA\u505A\u5168\u5C40\u9700\u6C42\u7EDF\u8BA1\u548C\u53C2\u6570\u6838\u5B9A\uFF0C\u628A\u7528\u6237\u6A21\u7CCA\u60F3\u6CD5\u53D8\u6210\u53EF\u6267\u884C\u5F71\u7247\u9879\u76EE\uFF0C\u4E0D\u66FF\u540E\u7EED Agent \u76F4\u63A5\u751F\u6210\u5267\u672C\u6216\u56FE\u50CF\u3002", requiredInputs: ["\u7528\u6237\u539F\u59CB\u60F3\u6CD5", "\u65F6\u957F", "\u753B\u5E45\u6BD4\u4F8B", "\u5BF9\u767D\u8BED\u8A00", "\u60C5\u7EEA\u57FA\u8C03", "\u7528\u6237\u4E0A\u4F20\u53C2\u8003"], produces: ["studio_brief", "runtime_params", "risk_check", "style_boundaries"], outputSchema: '{"brief":"string","keywords":["string"],"risk_check":["string"],"runtimeParams":{"language":"zh|en|bilingual|none","aspect_ratio":"string","vibe_tag":"string","duration":"short|medium|long"}}', skillFamilies: ["creative-intake", "pipeline-director", "review-quality"], qualityGates: ["\u5FC5\u987B\u660E\u786E\u8BED\u8A00\u3001\u6BD4\u4F8B\u3001\u60C5\u7EEA\u3001\u65F6\u957F", "\u5FC5\u987B\u8BF4\u660E\u540E\u7EED\u8D44\u4EA7\u7EE7\u627F\u89C4\u5219", "\u4E0D\u5F97\u8D8A\u7EA7\u751F\u6210\u5267\u672C\u3001\u89D2\u8272\u56FE\u6216\u89C6\u9891"], failurePolicy: "\u6587\u5B57\u6A21\u578B\u5931\u8D25\u65F6\u5728\u5DE6\u4FA7\u7FA4\u804A\u663E\u793A\u6A59\u8272\u9519\u8BEF\uFF1B\u753B\u5E03\u4E0D\u8FFD\u52A0\u8282\u70B9\uFF1B\u7528\u6237\u53EF\u91CD\u8BD5\u6216\u4FEE\u6539\u53C2\u6570\u3002", canvasNodeRule: "API \u6210\u529F\u5E76\u89E3\u6790 JSON \u540E\u8FFD\u52A0 01 \u5F71\u7247\u53C2\u6570\u8282\u70B9\u3002", handoffContract: "\u628A brief\u3001runtimeParams\u3001style_boundaries \u4F5C\u4E3A\u7F16\u5267\u552F\u4E00\u4E0A\u6E38\u8F93\u5165\u3002", systemPreset: "\u4F60\u662F Jiaren AI \u7535\u5F71\u5DE5\u4F5C\u5BA4\u7684\u827A\u672F\u603B\u76D1 Agent\u3002\u4F60\u7684\u804C\u8D23\u662F\u628A\u7528\u6237\u7684\u4E00\u53E5\u8BDD\u60F3\u6CD5\u6574\u7406\u6210\u53EF\u6267\u884C\u5236\u7247\u53C2\u6570\u3001\u98CE\u683C\u8FB9\u754C\u3001\u76EE\u6807\u5E73\u53F0\u3001\u98CE\u9669\u548C\u540E\u7EED\u8D44\u4EA7\u7EE7\u627F\u89C4\u5219\u3002\u4F60\u53EA\u5904\u7406\u5F53\u524D\u9636\u6BB5\uFF0C\u5FC5\u987B\u8F93\u51FA JSON\u3002" }, script: { id: "script", agentName: "\u7F16\u5267", productionRole: "\u7F16\u5267 / \u53D9\u4E8B\u7ED3\u6784\u5BFC\u6F14", modelRoute: "claude-opus-4-7\uFF0C\u7528\u4E8E\u957F\u6587\u672C\u53D9\u4E8B\u3001\u5BF9\u767D\u3001\u5185\u5FC3 OS\u3001\u52A8\u4F5C\u8282\u594F\u548C\u8FDE\u7EED\u6027\u3002", stageIntent: "\u6839\u636E\u827A\u672F\u603B\u76D1\u53C2\u6570\u751F\u6210\u53EF\u62CD\u6444\u3001\u53EF\u62C6\u573A\u666F\u3001\u53EF\u751F\u6210\u8D44\u4EA7\u7684\u77ED\u7247\u5267\u672C\u3002", requiredInputs: ["studio_brief", "runtime_params", "\u7528\u6237\u60F3\u6CD5"], produces: ["script", "character_seed", "scene_seed"], outputSchema: '{"script":["string"],"characters":[{"name":"string","role":"string","seed":"string"}],"scene_seed":["string"]}', skillFamilies: ["script-writing", "cinematography", "review-quality"], qualityGates: ["\u6BCF\u6BB5\u53EA\u627F\u8F7D\u4E00\u4E2A\u5F3A\u89C6\u89C9\u70B9", "\u5FC5\u987B\u5305\u542B\u52A8\u4F5C\u3001\u5BF9\u767D\u6216\u5185\u5FC3 OS", "\u5FC5\u987B\u7559\u4E0B\u89D2\u8272\u4E0E\u573A\u666F\u7EBF\u7D22"], failurePolicy: "\u89E3\u6790\u4E0D\u5230 script[] \u65F6\u963B\u65AD\u5F53\u524D\u9636\u6BB5\uFF0C\u63D0\u793A\u7F16\u5267 Agent \u91CD\u8BD5\u3002", canvasNodeRule: "\u5267\u672C JSON \u6210\u529F\u8FD4\u56DE\u540E\u8FFD\u52A0 02 \u5267\u672C\u8282\u70B9\u3002", handoffContract: "\u628A script\u3001characters\u3001scene_seed \u4EA4\u7ED9\u89D2\u8272\u8BBE\u8BA1\u5E08\u548C\u573A\u666F\u8BBE\u8BA1\u5E08\u3002", systemPreset: "\u4F60\u662F Jiaren \u52A8\u753B\u7F16\u5267 Agent\u3002\u4F60\u8981\u628A\u5DF2\u786E\u8BA4\u7684\u5F71\u7247\u53C2\u6570\u5199\u6210\u6709\u955C\u5934\u6F5C\u529B\u7684\u5267\u672C\u6BB5\u843D\uFF0C\u6BCF\u6BB5\u4FDD\u7559\u4E00\u4E2A\u89C6\u89C9\u91CD\u70B9\uFF0C\u5E76\u4E3A\u89D2\u8272\u3001\u573A\u666F\u3001\u5206\u955C\u7559\u4E0B\u7ED3\u6784\u5316\u7EBF\u7D22\u3002\u4F60\u53EA\u8F93\u51FA JSON\u3002" }, character: { id: "character", agentName: "\u89D2\u8272\u8BBE\u8BA1\u5E08", productionRole: "\u89D2\u8272\u8BBE\u8BA1\u5E08 / \u8D44\u4EA7\u8840\u7EDF\u5BFC\u6F14", modelRoute: "\u6587\u5B57\u63A8\u7406 claude-opus-4-7\uFF1B\u56FE\u50CF\u751F\u6210 gpt-image-2\uFF1B\u5907\u9009 Nano Banana 2\u3002", stageIntent: "\u628A\u5267\u672C\u89D2\u8272\u8F6C\u6210\u7A33\u5B9A\u53EF\u590D\u7528\u7684\u89D2\u8272\u8D44\u4EA7\uFF0C\u751F\u6210\u5916\u89C2\u8840\u7EDF\u3001\u6B63\u9762\u56FE\u548C\u53EF\u9009\u4E09\u89C6\u56FE\u3002", requiredInputs: ["script", "characters", "runtime_params", "style_boundaries"], produces: ["character_asset", "appearance", "image_prompt", "reference_image_url"], outputSchema: '{"characters":[{"name":"string","description":"string","appearance":"string","image_prompt":"string","sheet_prompt":"string"}]}', skillFamilies: ["character-bible", "model-prompting", "review-quality"], qualityGates: ["appearance \u5FC5\u987B\u5305\u542B\u8138\u3001\u53D1\u578B\u3001\u670D\u88C5\u3001\u6750\u8D28\u3001\u8BC6\u522B\u8272\u3001\u7981\u5FCC\u9879", "\u5FC5\u987B\u80FD\u88AB\u540E\u7EED\u9010\u5B57\u7EE7\u627F", "\u56FE\u7247 API \u672A\u6210\u529F\u524D\u4E0D\u5F97\u8FFD\u52A0\u89D2\u8272\u8282\u70B9"], failurePolicy: "\u6587\u5B57\u63A8\u7406\u6210\u529F\u4F46\u751F\u56FE\u5931\u8D25\u65F6\u4ECD\u963B\u65AD\uFF0C\u4E0D\u751F\u6210\u7A7A\u767D\u89D2\u8272\u8282\u70B9\u3002", canvasNodeRule: "\u81F3\u5C11\u4E00\u5F20\u771F\u5B9E\u89D2\u8272\u56FE\u8FD4\u56DE\u540E\u8FFD\u52A0 03 \u89D2\u8272\u8D44\u4EA7\u8282\u70B9\u3002", handoffContract: "\u628A appearance \u548C reference_image_url \u4EA4\u7ED9\u573A\u666F\u3001\u5206\u955C\u548C\u89C6\u9891\u56FE\u751F\u89C6\u9891\u8C03\u7528\u3002", systemPreset: "\u4F60\u662F Jiaren \u89D2\u8272\u8BBE\u8BA1\u5E08 Agent\u3002\u4F60\u8981\u4ECE\u5267\u672C\u4E2D\u63D0\u70BC\u4E3B\u8981\u89D2\u8272\uFF0C\u5B9A\u4E49\u53EF\u91CD\u590D\u7EE7\u627F\u7684\u5916\u89C2\u8840\u7EDF\uFF0C\u5E76\u7ED9\u56FE\u50CF\u6A21\u578B\u8F93\u51FA\u77ED\u800C\u7CBE\u786E\u7684\u82F1\u6587\u8D44\u4EA7\u63D0\u793A\u8BCD\u3002\u4F60\u53EA\u8F93\u51FA JSON\u3002" }, scene: { id: "scene", agentName: "\u573A\u666F\u8BBE\u8BA1\u5E08", productionRole: "\u573A\u666F\u7F8E\u672F\u8BBE\u8BA1\u5E08 / \u7A7A\u95F4\u7CFB\u7EDF\u5BFC\u6F14", modelRoute: "\u6587\u5B57\u63A8\u7406 claude-opus-4-7\uFF1B\u573A\u666F\u56FE gpt-image-2\uFF1B\u5907\u9009 Nano Banana 2\u3002", stageIntent: "\u4E0D\u662F\u9010\u53E5\u753B\u56FE\uFF0C\u800C\u662F\u6839\u636E\u5267\u672C\u548C\u89D2\u8272\u8840\u7EDF\u63D0\u70BC 1-3 \u4E2A\u6838\u5FC3\u7A7A\u95F4\uFF0C\u786E\u4FDD\u7A7A\u95F4\u80FD\u652F\u6491\u540E\u7EED\u955C\u5934\u3002", requiredInputs: ["script", "character_asset.appearance", "runtime_params", "reference_image_url"], produces: ["scene_plan", "scene_image_prompt", "scene_image_url"], outputSchema: '{"scenes":[{"title":"string","description":"string","beat_refs":["string"],"subject":"string","subject_motion":"string","environment":"string","spatial_framing":"string","camera":"string","transition_out":"string","image_prompt":"string"}]}', skillFamilies: ["environment-design", "model-prompting", "review-quality"], qualityGates: ["\u8C03\u7528\u751F\u56FE\u524D\u5FC5\u987B\u84B8\u998F\u5730\u70B9\u3001\u65F6\u95F4\u3001\u60C5\u7EEA\u548C\u4E00\u6761\u89D2\u8272\u8840\u7EDF", "image_prompt \u63A7\u5236\u5728\u77ED\u63D0\u793A\u8BCD\u5185", "\u4E0D\u5F97\u628A\u5B8C\u6574\u5267\u672C\u6216\u591A\u5F20\u5927\u56FE\u585E\u7ED9\u751F\u56FE\u6A21\u578B"], failurePolicy: "\u573A\u666F API \u62A5\u4E0A\u4E0B\u6587\u8FC7\u957F\u65F6\u81EA\u52A8\u4F7F\u7528\u84B8\u998F\u63D0\u793A\u8BCD\u91CD\u8BD5\uFF1B\u4ECD\u5931\u8D25\u5219\u505C\u5728\u5F53\u524D Agent\u3002", canvasNodeRule: "\u771F\u5B9E\u573A\u666F\u56FE\u8FD4\u56DE\u540E\u8FFD\u52A0 04 \u573A\u666F\u6982\u5FF5\u8282\u70B9\u3002", handoffContract: "\u628A\u573A\u666F\u6807\u9898\u3001\u7A7A\u95F4\u63CF\u8FF0\u3001\u573A\u666F\u56FE URL \u548C\u6784\u56FE\u4FE1\u606F\u4EA4\u7ED9\u5206\u955C\u52A8\u753B\u5E08\u3002", systemPreset: "\u4F60\u662F Jiaren \u573A\u666F\u7F8E\u672F\u8BBE\u8BA1\u5E08 Agent\u3002\u4F60\u5FC5\u987B\u6839\u636E\u5DF2\u786E\u8BA4\u5267\u672C\u548C\u89D2\u8272\u5916\u89C2\u8840\u7EDF\u8BBE\u8BA1\u6838\u5FC3\u7A7A\u95F4\u7CFB\u7EDF\uFF0C\u53EA\u63D0\u70BC\u5730\u70B9\u3001\u65F6\u95F4\u3001\u5149\u5F71\u3001\u9053\u5177\u3001\u6784\u56FE\u548C\u955C\u5934\u53EF\u6267\u884C\u4FE1\u606F\u3002\u4F60\u53EA\u8F93\u51FA JSON\u3002" }, storyboard: { id: "storyboard", agentName: "\u5206\u955C\u52A8\u753B\u5E08", productionRole: "\u5206\u955C\u52A8\u753B\u5E08 / \u955C\u5934\u4E0E\u89C6\u9891\u5BFC\u6F14", modelRoute: "\u6587\u5B57\u63A8\u7406 claude-opus-4-7\uFF1B\u5BAB\u683C\u56FE GPT Image 2/Nano Banana 2\uFF1B\u89C6\u9891 doubao-seedance-2-0-260128 \u6216 veo3.1-pro\uFF0C\u7531\u7528\u6237\u9009\u62E9\u3002", stageIntent: "\u628A\u5267\u672C\u3001\u89D2\u8272\u56FE\u548C\u573A\u666F\u56FE\u8F6C\u6210 4 \u5BAB\u683C\u673A\u4F4D\u53C2\u8003\u3001\u591A\u56FE\u53C2\u8003\u548C\u53EF\u8F6E\u8BE2\u7684\u89C6\u9891\u955C\u5934\u3002", requiredInputs: ["script", "character_asset", "scene_plan", "scene_image_url", "video_model_choice"], produces: ["shot_plan", "storyboard_grid_url", "video_task", "video_url"], outputSchema: '{"shots":[{"title":"string","timecode":"string","prompt":"string","video_prompt":"string"}]}', skillFamilies: ["cinematography", "model-prompting", "review-quality"], qualityGates: ["\u5FC5\u987B\u628A\u89D2\u8272\u53C2\u8003\u56FE\u4F5C\u4E3A\u9996\u5E27\u6216\u53C2\u8003\u56FE", "\u5FC5\u987B\u5305\u542B\u955C\u5934\u8FD0\u52A8\u3001\u666F\u522B\u3001\u6784\u56FE\u548C\u65F6\u7801", "\u89C6\u9891\u4EFB\u52A1 Ready \u524D\u4E0D\u5F97\u8FFD\u52A0\u8282\u70B9"], failurePolicy: "\u89C6\u9891\u5F02\u6B65\u4EFB\u52A1\u672A Ready \u65F6\u7EE7\u7EED\u8F6E\u8BE2\uFF1B\u5931\u8D25\u65F6\u7FA4\u804A\u63D0\u793A\uFF0C\u4E0D\u8FFD\u52A0\u7A7A\u767D\u89C6\u9891\u5361\u3002", canvasNodeRule: "\u5BAB\u683C\u56FE\u548C\u81F3\u5C11\u4E00\u4E2A\u89C6\u9891 URL \u6210\u529F\u8FD4\u56DE\u540E\u8FFD\u52A0 05 \u5206\u955C\u77ED\u89C6\u9891\u6D41\u8282\u70B9\u3002", handoffContract: "\u628A shot_plan\u3001storyboard_grid_url\u3001video_url \u4EA4\u7ED9\u97F3\u6548\u603B\u76D1\u3002", systemPreset: "\u4F60\u662F Jiaren \u5206\u955C\u52A8\u753B\u5E08 Agent\u3002\u4F60\u8981\u628A\u5267\u672C\u3001\u89D2\u8272\u53C2\u8003\u56FE\u548C\u573A\u666F\u8D44\u4EA7\u7F16\u8BD1\u6210\u6E05\u6670\u955C\u5934\u8BA1\u5212\u30014 \u5BAB\u683C\u6784\u56FE\u548C\u89C6\u9891\u6A21\u578B\u63D0\u793A\u8BCD\u3002\u4F60\u53EA\u8F93\u51FA JSON\u3002" }, audio: { id: "audio", agentName: "\u97F3\u6548\u603B\u76D1", productionRole: "\u97F3\u6548\u603B\u76D1 / \u97F3\u4E50\u4E0E\u6DF7\u5F55\u5BFC\u6F14", modelRoute: "\u6587\u5B57\u63A8\u7406 claude-opus-4-7\uFF1BBGM \u4F7F\u7528 Suno V4\uFF1BTTS \u4F7F\u7528 MiniMax TTS\u3002", stageIntent: "\u6839\u636E\u5206\u955C\u8282\u594F\u751F\u6210\u97F3\u4E50\u3001\u73AF\u5883\u58F0\u3001\u52A8\u4F5C\u97F3\u6548\u3001\u5BF9\u767D/TTS \u548C\u6DF7\u5F55\u5EFA\u8BAE\u3002", requiredInputs: ["script", "shot_plan", "runtime_params", "video_url"], produces: ["music_prompt", "sfx_plan", "tts_plan", "mix_plan"], outputSchema: '{"music":"string","sfx":"string","prompt":"string","tts":"string"}', skillFamilies: ["audio-post", "model-prompting", "review-quality"], qualityGates: ["\u5FC5\u987B\u5305\u542B BPM\u3001\u60C5\u7EEA\u3001\u914D\u5668\u3001\u73AF\u5883\u58F0\u548C\u52A8\u4F5C\u97F3\u6548", "\u5FC5\u987B\u7EE7\u627F\u5BF9\u767D\u8BED\u8A00", "\u4E0D\u5F97\u4F2A\u9020\u672A\u8FD4\u56DE\u7684\u97F3\u9891 URL"], failurePolicy: "Suno \u6216 TTS \u4E0D\u53EF\u7528\u65F6\u4FDD\u7559\u97F3\u9891\u65B9\u6848\u8282\u70B9\uFF0C\u4E0D\u4F2A\u9020\u6587\u4EF6\uFF1B\u9700\u8981\u7528\u6237\u91CD\u8BD5\u97F3\u9891\u751F\u6210\u3002", canvasNodeRule: "\u97F3\u9891\u65B9\u6848 JSON \u6210\u529F\u8FD4\u56DE\u540E\u8FFD\u52A0 06 \u97F3\u9891\u7247\u8282\u70B9\uFF1B\u771F\u5B9E\u97F3\u9891\u8FD4\u56DE\u540E\u56DE\u586B\u64AD\u653E\u5668\u3002", handoffContract: "\u628A music_prompt\u3001sfx_plan\u3001tts_plan \u4EA4\u7ED9\u6700\u7EC8\u6210\u7247\u8D28\u68C0\u3002", systemPreset: "\u4F60\u662F Jiaren \u97F3\u6548\u603B\u76D1 Agent\u3002\u4F60\u8981\u6839\u636E\u5267\u672C\u548C\u5206\u955C\u8282\u594F\u8BBE\u8BA1\u914D\u4E50\u3001\u73AF\u5883\u58F0\u3001\u52A8\u4F5C\u97F3\u6548\u3001\u5BF9\u767D/TTS \u548C\u6DF7\u5F55\u5EFA\u8BAE\u3002\u4F60\u53EA\u8F93\u51FA JSON\u3002" }, final: { id: "final", agentName: "\u603B\u5BFC\u6F14\u8D28\u68C0", productionRole: "\u603B\u5BFC\u6F14\u8D28\u68C0 / Final Master", modelRoute: "claude-opus-4-7 \u8D1F\u8D23\u8FDE\u7EED\u6027\u8D28\u68C0\uFF1B\u5408\u6210\u5C42\u4F7F\u7528\u5DF2\u8FD4\u56DE\u7684\u89C6\u9891\u548C\u97F3\u9891\u8D44\u4EA7\u3002", stageIntent: "\u68C0\u67E5\u6240\u6709\u8D44\u4EA7\u662F\u5426\u6EE1\u8DB3\u4EA4\u4ED8\uFF0C\u7EC4\u7EC7\u6700\u7EC8\u6210\u7247\u8282\u70B9\u3002", requiredInputs: ["script", "character_asset", "scene_plan", "video_url", "audio_plan"], produces: ["final_review", "missing", "master_video_url"], outputSchema: '{"note":"string","missing":["string"]}', skillFamilies: ["pipeline-director", "audio-post", "review-quality"], qualityGates: ["\u5FC5\u987B\u68C0\u67E5\u89D2\u8272\u3001\u573A\u666F\u3001\u955C\u5934\u3001\u97F3\u9891\u8FDE\u7EED\u6027", "\u6CA1\u6709\u89C6\u9891\u5FC5\u987B\u963B\u65AD", "\u4E0D\u5F97\u4F2A\u9020\u6210\u7247\u4E0B\u8F7D\u5730\u5740"], failurePolicy: "\u7F3A\u5C11\u89C6\u9891\u6216\u5173\u952E\u8D44\u4EA7\u65F6\u963B\u65AD\u6210\u7247\uFF0C\u63D0\u793A\u7F3A\u5931\u9879\u3002", canvasNodeRule: "\u5DF2\u6709\u89C6\u9891\u8D44\u4EA7\u65F6\u8FFD\u52A0 07 \u6DF7\u5F55\u6700\u7EC8\u77ED\u7247\u8282\u70B9\u3002", handoffContract: "\u8F93\u51FA\u6700\u7EC8\u8D28\u68C0\u3001\u7F3A\u5931\u9879\u548C\u53EF\u6D4B\u8BD5\u64AD\u653E\u5165\u53E3\u3002", systemPreset: "\u4F60\u662F Jiaren \u603B\u5BFC\u6F14\u8D28\u68C0 Agent\u3002\u4F60\u8981\u68C0\u67E5\u5267\u672C\u3001\u89D2\u8272\u3001\u573A\u666F\u3001\u5206\u955C\u89C6\u9891\u3001\u97F3\u9891\u65B9\u6848\u662F\u5426\u8FDE\u7EED\u53EF\u4EA4\u4ED8\uFF0C\u5E76\u8F93\u51FA\u7F3A\u5931\u9879\u548C\u6210\u7247\u5EFA\u8BAE\u3002\u4F60\u53EA\u8F93\u51FA JSON\u3002" } }, Xt = { name: "jiaren-ai-film-production", version: "0.2.0", modelPolicy: { text: "claude-opus-4-7", characterImage: ["gpt-image-2", "nano-banana-2"], video: ["doubao-seedance-2-0-260128", "veo3.1-pro"], music: "suno-v4" }, stageRules: ["\u6BCF\u4E2A\u9636\u6BB5\u53EA\u5904\u7406\u5F53\u524D\u804C\u8D23\uFF0C\u4E0D\u4E00\u6B21\u6027\u751F\u6210\u540E\u7EED\u5168\u90E8\u4EA7\u7269\u3002", "API \u6210\u529F\u8FD4\u56DE\u5E76\u901A\u8FC7 JSON/\u8D44\u4EA7\u6821\u9A8C\u540E\uFF0C\u753B\u5E03\u624D\u8FFD\u52A0\u5BF9\u5E94\u8282\u70B9\u3002", "\u4EFB\u610F API \u5931\u8D25\u65F6\u5DE6\u4FA7\u7FA4\u804A\u63D0\u793A\u9519\u8BEF\uFF0C\u753B\u5E03\u4E0D\u65B0\u589E\u7A7A\u767D\u8282\u70B9\u3002", "\u4E0B\u6E38\u8282\u70B9\u5FC5\u987B\u7EE7\u627F\u827A\u672F\u603B\u76D1 runtimeParams \u4E0E\u4E0A\u6E38\u5DF2\u786E\u8BA4\u8D44\u4EA7\u3002", "\u89D2\u8272 appearance \u4E0E\u53C2\u8003\u56FE URL \u5FC5\u987B\u4F20\u7ED9\u573A\u666F\u3001\u5206\u955C\u548C\u89C6\u9891\u9636\u6BB5\u3002"] };
function Xc(n) {
  return Zc.filter((i) => i.stages.includes(n)).map((i) => `${i.label}/${i.id}(${i.count}): ${i.logic}`).join(`
`);
}
function el(n) {
  const i = Qt[n];
  return [`\u9636\u6BB5\u89D2\u8272\uFF1A${i.productionRole}`, `\u6A21\u578B\u8DEF\u7531\uFF1A${i.modelRoute}`, `\u9636\u6BB5\u610F\u56FE\uFF1A${i.stageIntent}`, `\u5FC5\u9700\u8F93\u5165\uFF1A${i.requiredInputs.join(" / ")}`, `\u8F93\u51FA\u4EA7\u7269\uFF1A${i.produces.join(" / ")}`, `\u8F93\u51FA Schema\uFF1A${i.outputSchema}`, `\u6280\u80FD\u65CF\uFF1A${i.skillFamilies.join(" / ")}`, `\u8D28\u68C0\u95E8\uFF1A${i.qualityGates.join("\uFF1B")}`, `\u5931\u8D25\u7B56\u7565\uFF1A${i.failurePolicy}`, `\u753B\u5E03\u89C4\u5219\uFF1A${i.canvasNodeRule}`, `\u4EA4\u63A5\u5951\u7EA6\uFF1A${i.handoffContract}`].join(`
`);
}
const tl = 48, nl = 22e4;
function bn(n) {
  return typeof n == "string" && n.startsWith("data:");
}
function Pa(n, i = false) {
  if (!bn(n)) return n;
  const c = n;
  if (!(i || c.length > nl)) return c;
}
function al(n) {
  const i = !!(n.localPath || n.url);
  return { ...n, dataUrl: Pa(n.dataUrl, i) };
}
function il(n) {
  return Array.isArray(n) ? n.slice(0, tl).map((i) => {
    const c = i.localPath ?? Pa(i.thumbnail);
    return { ...i, thumbnail: c };
  }) : [];
}
function rl(n) {
  return n.map((i) => {
    const c = i.localPath && bn(i.source) ? i.localPath : i.source, u = !!(i.localPath || !bn(c) && c);
    return { ...i, source: c, dataUrl: Pa(i.dataUrl, u) };
  });
}
function ol(n) {
  return n.map((i) => {
    var A, P;
    const c = typeof i.data.localPath == "string" ? i.data.localPath : void 0, u = typeof i.data.imageSource == "string" && c && bn(i.data.imageSource) ? c : i.data.imageSource, b = (A = i.data.outputAssets) == null ? void 0 : A.map((S) => al(S)), m = (P = i.data.videoReferences) == null ? void 0 : P.map((S) => {
      const B = S.localPath && bn(S.source) ? S.localPath : S.source;
      return { ...S, source: B, dataUrl: Pa(S.dataUrl, !!(S.localPath || !bn(B) && B)) };
    });
    return { ...i, data: { ...i.data, imageSource: u, outputAssets: b, videoReferences: m } };
  });
}
const _r = "" + new URL("jiaren-logo-latest.png", import.meta.url).href, Fr = "" + new URL("add-D_Cld97e.png", import.meta.url).href, Qr = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAANLklEQVR4AeydW3bbOBKGC/KM+/QOMs5DK2/ObGImK4m9krhXEvdK4tnExG9RHsaTHfRpT4sYlAxZFC/gRSJZhfp5TJEEQBH8C5+JYpHQijBBASjQqgAAaZUGGVCACICgFUCBhAIAJCEOsqAAAEEbgAIJBSYEJHFUZEEBJQoAECWGQjWXUQCALKM7jqpEAQCixFCo5jIKAJBldMdRlSigExAl4qKa+hUAIPptiDOYUAEAMqG4+Gr9CgAQ/TbEGUyoAAAZIO6b36/Xb5+vbyzMb/53/c8B0mRbFIBUTNu0yY3l6vn9t9WF++bJfbYwr7z7wud89cf1pyZNrKQBkA5LMxzcWEKxdZit/a3JuTvLkACQRJPnLlWEI1HKQBZD8vz3zwbOtHaKAKQmySHBXTiTjeKgQHnNm/RJAEi5DVTWHZHJRkHN05q7m81Z+aYCkBbb8p2qlqyxyer3WxX0D/UnMfAEAEiLYJ6c6bs3TbI4R9+b0nNOAyAN1o1Xj3VDlumk7ZYeyNgEQBoM7mllrivRIEMt6cfPj5taYuYJAKTRwP6mMdl0oru3ePoApGL12L2qpErfnL5+xbb4dfqjyDsCAKnYpCD3sZJkftMTPVjsXrHhAQirUJodEWIfdDytyP92nGJnC4CUbH1l9HGKkgSNq/+5fDTpf7AYAIRVeJ09rh6vWuxXnFk4WAEAwiqE+e3z9U1YrMOMv5IChVHnfC8BAIlKeMQ+ohLlhbu36pzvVQAgeyXI8xXkdQsrRI6Kf5HxCYCEBhC7V2ENf2UFLDvnex0ASFDC48HEoELlz/u7SorJTfOAxHcc4JxXmn9R0OSxj8ohRW6aB2TlV4ic15omnPO9JOYBIfKIfexbQ1wWrsDVI2phGpDonKN7FRvDfvHjr4/m3vvYn3t1aRqQAg8mVtsDOfK3tUTDCaYBcUToXtHxlMlbg8cndcKWWUBi9+oE6XLcFc551apmAfGIfVTbAsE5r0lCJgGJV491XQ7TKRs453X7mwTE48HEWksIzrnJV2prQlQSTAISYh94MLHSEPDcVUWQuFkHJGbkuojdq1xPb+R5OdMvRaVEMwdIgdhHrT3AOa9J8ppgDhBHhNgHHSZP9ADn/KBHdc0UIFcYlKFq/3Ab0+O5q5oqhwRTgATnHFePg+13a3DOdzK0fswKSGstZsh4i0EZGlR2cM4bVCknmQHEI/ZRtvtu3epworuT7/lhBpDQvbrpqYmJYjvn3OBo7UONawKQ2L0aqk3W5S0PJzrEsCYA8XgwsdYm4JzXJGlMyAWQxpPjRAzKwCpUZzjnVUXatrMHBIMy1E0P57yuSVtK9oAE5xyxjyPr46WoIzk6NrIGJDrn6w4NTGU7DCc6yN5ZA1LgwcRaY4BzXpMkmZA1II7oDN0rymfCcKKDbZktILF7NViQnHfAcKLDrZstIIh9VBsDnPOqIn22swQkXj3WfQSwUgYvRY2zdJaAeDyYWGsNeCmqJkmvhCwBCbEPHQ8m9jLR6YUchhMdLWJ2gMTu1WhBctwRw4mOt2p2gBSIfVRaA5zziiCDNrMC5M3v12vEPo7tD+f8WI+hW1kBsrpYfRoqQPbl/6QN/+OQNGvSPCtACL8W9dr29iurC/dN2nz1/P7b357ff4mvIuyrKnKZDSDROUfsQ2Qzq1Vq1xVeeffl6o/rT7VcQQnZAOIR+xDUrAZUxbk7yVeSbAAh8oh9DGiXkoqGK8lnSfUp1yULQGL3qnxeWNelwFrqVSQLQDwGZZgTh0mOdeFJpP+oHpD4n0ekuISptwLe0y+9C89YUD0gK7/6OKNeONRECjhH3yf66pO+Vj0gwTnHW4MnNQEZO0t9FVg1INE5R/dKRhsfXYvC+Q+jd554R9WAFHgwceLmMf3Xeyr/gM/0xxt6BNWA4MHEoeaWVZ7h+O/lV7FXD1ZLLSCxe8XngFmnAhvpcLCsagHxiH2w/bTOm2Ir1+8oi6oSkHj1gHNetqSi9eCU3/5Q8tskKgHxeDBREQ7HVQ1wfFhkAInjavTeUglIiH3c9D5DFBSjAA8eoQkOFk4dILF7xXXHrEkB7++kBgNTMqoDpEDsI2VPkXme6OHpp8dfRVauo1KqAOH3qhH76LCosGyGQ8Pt3DbZVAGCQRnazCg2XUWsI6VeH0BS+8+c5/Fg4syKn3A4NbGO1DmqASQ654h9pKwpKC/czlUT60jJpgYQj9hHyo6i8gIcqmIdKfHUAILYR8qMcvJygoNVVQFI7F5xfTFLViDEOrQFArvkXBiQruq95Hs8mPgihOBPrzjWkZJVPCAYlCFlPhl5DIfmWEdKRfGAYFCGlPlE5KmPdaRUFA9IcM4R+0hZcNm8zdPl13fLVmHao4sGJDrniH1M2wZGf3u4Y3U7emclO4oGpDjlwUQlBtBazQBHNrGOlA1EA4IHE1OmWy7PChyssFhAYveK64hZkgIZxjpS8ooFxCP2kbLbInk+01hHSkyRgPB7H6HScM6DCFL+GI5cYx0pjUUCQn8h0XCQsckqHGxmkYBcCP2tCBbM4Jx1ILDLniIB2TraECYRCoQ7VtnHOlJCiwSE/iQGhGfCtJwCAQ4TsY6UwiIB4VH3HHmVo2CkxNaUBzherCUSEK7adksPFO65k61JxNmGf063ub3XMVZYsYDwVWQ3lhIgGWvbkfu5e40DvI082c7dxAKyrzlDUmz9O77kv1xR3D3R0jNl6R/x7dyny3+bdsqpMokHhOvLVxO+5DMsbMClZ65TbjPDYTEQ2GVHFYB0ncSc+fEZsdwCmaZjHan2A0BS6mSV134yofuKblWLPACkRZi25NzeUQlwmI91tNma0wEIqzBgdkTZvAIMOKhzAiCdEh0KRP/jkKB4DbGOfsYDIP102pXy2Qx/iljHzqA9PgBID5EORbz67pXnl57OHes4CJTdGgAZZtL1sOKySjMciHUMswkA6alXBv4HYh09bV0uBkDKaiTWlfsfm3DHCrGOhH3bsgBImzK1dK/W/2A4+FGd2ikhoVMBANIp0WsBlf5HgEN1IPBV/YVWAEgP4bX6H4h19DBuRxEA0iEQZ6v0P7y/w3sdbL3TZgDSSz9d/ofnWMdPj3hluZdt04UASFof0vYDPgwHYh0dRh2QDUA6xFI2RhdiHR32LGX3WgUgHTIp8j82xdZ/6DgdZA9UAIB0CuZvOosIKBBu597yq8kCqpJVFQBIwpxabu8GOBDrSNjxlCwAklDPe/olkS0iC7GOac0AQFL6Oie7e4VYR8p6Z8kbB8hZDq3iS8Q+XuKJHngYJBUqKq4kAGkxnmT/g+FArKPFcGdOBiAtggq+vYtYR4vNpkgGIK2qeomPtyPW0WqvaTIASLuu4vyPcDsXsY52e02SIw6QSc5y4JdK9D8CHIh1DLTjOYoDkAYVpfkfgKPBSDMlAZBGoQX5HyHWgddlG400SyIAaZZZhP/hEetots6MqQCkIrYU/4PhQKyjYpwFNi0B0kteCf4H4OhlqlkKAZCazH7p+AcCgTWbLJcAQErax+7Vov5HuGOFAd5KNll6FYAsbYHS8QMciHWU9JCwCkBKVijIfSxtzroKOGaVu/fBAEhJKkc00v+g0ybEOk7Tb8K9AUgUN/ofcWvOhbvHex1z6j3sWAAk6uUX+PUoz4FA/JhNtIDMBQB5tYuftXvlAxwIBL6KL3YFgBxMsz6sTr6GWMfkEp/nAAAk6Di3/xHuWPWPdYT64W85BQBI0H5O/yPAgVhH0FzLHwDZWcrP4n8Ajp3Yqj4AyIu5Jvc/MMDbi9DaPs0DMo//4e7xYzba0Hipr3lApvY/fLid+yQ01vHSBPCZUsA8IER+Mv/DBzgQ60g1P/l5pgGZ+NejEOuQ3/47a2gakAl/PWoT7lgh1tHZ/OQXMA3IVP4Hw4GRSOQ3/j41NA1I8D9u+og0pEyAA4FAoiGSiS5rFpApbu8i1iG6rY+qnFlAzv/rUYh1jGqBwncyCwid8dej+HYuYh3CW/rI6tkFhOgsj5cwHIh1ULaTSUDO6H8g1jE7GvMe0CQgZ7q9i1jHvG11kaOZBCTc3j358ZJwO/cWsY5F2uysBzUKCJ3kfwQ4EOsgG5M5QE71PxDrsAHG/izNAXJS/MP7O7zXsW86GS4bTskcIA0a9Eri27kY4K2XVFkVMgeIc/R9qAUZDsQ6hqqWR3lzgGy39EDDJsQ6humVVWlzgPz4+XFDwZfoacVNsfUfepZFsQwVMAcI27Ao6Dcid0/paRcI3AGVLofcjBU4FyCqJOJGv3u48OVKsqlWnn2Op8uv7xAIrCpjb9skIHsz810p7kJx4I/jGzwHMBwc8r1CWJoGhM3PVxO+UnB8g2dOwwwF9gqYB2QvBJZQoEkBANKkCtKgQFRAASCxplhAgQUUACALiI5D6lEAgOixFWq6gAIAZAHRcUg9CgAQPbZCTRdQwDYgCwiOQ+pSAIDoshdqO7MCAGRmwXE4XQoAEF32Qm1nVgCAzCw4DqdLAQAykb3wtXko8H8AAAD//38Eu18AAAAGSURBVAMAiqPLzSJjboAAAAAASUVORK5CYII=", sl = "" + new URL("discover-DZwKbV-0.png", import.meta.url).href, Kr = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAALE0lEQVR4AeydDZ6bNhBHTS/S7EmanKTNSbI5SdKTJD1J25PQ+XtNSl2MBQhpRnr7Q8EL6OuNnuXYRvvThR8IQOAhAQR5iIYTELhcEIRRAIEVAgiyAodTEEAQxgAEVgicKMhKrZyCQBACCBIkUDSzDgEEqcOdWoMQQJAggaKZdQggSB3u1BqEQExBgsClmfEJIEj8GNKDEwkgyIlwKTo+AQSJH0N6cCIBBDkRLkXHJ4AgdzHkVwjMCSDInAaPIXBHAEHugPArBOYEEGROg8cQuCOAIHdA+BUCcwIIMqdx7mNKD0gAQQIGjSaXI4Ag5VhTU0ACCBIwaDS5HAEEKceamgISQJCAQft/kzlyFgEEOYss5TZBAEGaCCOdOIsAgpxFlnKbIIAgTYSRTpxFAEHOIttKuZ33A0E6HwB0f50Agqzz4WznBBCk8wFA99cJIMg6H852TgBBOh8ANbsfoW4EiRAl2liNAIJUQ0/FEQggSIQo0cZqBBCkGnoqjkAAQXZGaRzHd5Z+s/Tllr7ZnjSOEwNxEZ93OxEfyZYtL4JsRDmOo4L+p2VT+mL7327pve1Jl8vEQFzE509jJml0/BLtB0ESI2ZBfm9pkuJdYjYueyMgOSSJUih2CPIWwNV/TYxrgO2iUMG19nrbxFEzivbe2rbYHgRZxPLvQZNDLxW+/XuERxkIhJlJEGQl2iaHnun0OnrlKk7tJKCZxP2M/H9Bdva20WzMHOcG1v2TD4I8GAA2e3x6cIrD+QjojQ+9hM1XYuaSEOQx0NfHpziTkcCvGcvKXhSCLCC12cP9a+OFZkc9pFnELW8EWR5WW57VNNO8DPz8IGBIP1j6ail105shqdcWva6oIEV7dqyy1IC92qj4bOmvY9W1ldt4fLf00XqVKskvdq3LDUEOhMUGwecD2XvI+nv0TiLIcgRTXhMzayyzmx9NZZTCe15usccIUgw1FUUkEF4Qe8dJ367VV6v19QV9OnufdFzXuH2WijhwemlzWEFuYkzfrtWHTfqPtSS4TzquT2wlis71Elv6mYFAOEFMDN2opK+AaNBvGfC6VjON9hnQUUQPBEIJYnJoNtCsof2e+Cgfguwh12meMILc5NDMcTRUCHKUYEf5QwhicmhQ55BDof1Z/5AgkEIghCDWkZzfrP3DytuwcWnPBNwLcps99C5VjjjpKxDfcxREGX0QcC+IhSHX7CEx9P0gK9LHZvLr85lPttdb0B6T3vXL9eTkA/rGVkQQZGuA9PWGedIX5j4Ow/BhGAYd34go/+UmxPytan0bWO+ueUxiL0lyPUnlh3lyia4F0UDa0H+9fDIHhpdhGOZJckiSDUWdfqk+w5EQp1eUqYJXi4XanKm4OMW4FsQwpg4iyaF7ECyL780GmvqkdLn4bup963RjU8R23/dj0+/eBUl9SzbS16rd3vvwZOTorfYnl7R32rsgqcRd/N8itbGBr+tOklYEiTTmIn8Oo3cCI7E+3FYEOYxwcwGa7ZQ2Z6ycQf/Pi9juQ9gQ5BC+7ZmHt7eaT/88ZnvLVnNIjGhtXu1Q6kkESSWV8TqTRC9VXqxIfQaiwWcPXW5qmxam0NvmeuyykWc2CkHOpLtStknylyWtiKLBZw9dbmpb1wtTIMjKIOYUBBCEMQCBFQIIsgKHU4sEujqIIF2Fm85uJYAgW4lxfVcEEKSrcNPZrQQQZCsxru+KAIJ0FW7vnfXXPgTxFxNa5IgAgjgKBk3xRwBB/MWEFjkigCCOgkFT/BFAkMoxGcdRK5xc7/e2x9727dxBuDPOCLIT3NFsNxlGK0eLcWtZVY9p+lsr3S3WYHG5bghyxVD2H8lhNUoI27nfNItobawuJUGQOuMzihwTnask0y897RGkcLRt9tBqhYVrzVLd9f9KWUoKVAiClA9W1HWxREozifbdpBRBuoFRqKNd3ttdiG32ahAkO9KnBUZaBfK+M1ps4v5Y078jSOHwDm/L/rwWrjZHdW5Wx8/RmdQyECSVVN7rNItEkUQvCbX0T3ezh0KOIKJQOGkWsaTldLQ2lhZkkywek2aNrpf+qSxI4ZHprDqTRGtjfbW91sfymLqcNebDBEHmNHgMgTsCCHIHhF8hMCeAIHMaPIbAHQEEuQPCrxCYE2hXkHkveQyBnQQQZCc4svVBAEH6iDO93EkAQXaCI1sfBBCkjzjTy50EEGQHOLL0QwBB+ok1Pd1BAEF2QCNLPwQQpFKsx7f1sLRaiD10u2nZn0+VELmoFkEqhMF00BI6Wg/L+wIOugf91dorUfS4Aq26VSJIHf5fHlTr9bDkiNbmLCwRJAvG9ELs2VizhgZceiYfV16XRfXRlHKtQJByrKeaWPZnIhFgjyDlg6R7vMvXSo27CCDILmyHMv1xKHfdzN3dgosghQfcMAwaZEqFaz5cnVY26W72Q5DD42ZXAVrJJJIk14UldvU0eCYEqRBAm0W0mskHq1qifLW9ZPGYtBSRlv5RO62Z/W0IUjHmJoqemT/aXoPQY9JSRBK3IqW6VSNIXf7U7pwAgjgPUIjmNdxIBGk4uHTtOAEEOc6QEhomgCANB5euHSeAIMcZUkLDBBCk4eC20LXafUCQ2hGgftcEEMR1eGhcbQIIUjsC1O+aAIK4Dg+Nq00AQWpHgPprEUiqF0GSMHFRrwQQZDny3d0YtIyBowiyPAZSvuKt+ziWc3O0GQIIshDKYRg+2+G1WUQ3POkau4ytZQII8ji6uuNvSRId6/YOu8e42jyzT5A2WfynV8MwaJZ4sYMSRbee6iWV7v57sXMpL8EsK1t0AgjyJIKSwZJuPZUckuRJDk63RABBWoomfclOAEGyI6XAlgggSEvRpC/ZCbgTJHsPKRACBwggyAF4ZG2fAIK0H2N6eIAAghyAR9ZsBPTha7bCchbkXZC/Ezsb+Y/SJHYx5GW/JrYaQRJB7b1Mf2hSf9psLT/nChIYx/G9VadvINgu7uZ6BrFPsPXJdeqzyxcLyjdL2pPGsSoDU+KbpdTN7R8Vci3IjW6qILpcz1qaSUiXS20Gl8QffefN7XfbIgjiFl7iAOCydQJ6lbB+RcWz7gWxl1m672LLLFIRJ1VvJKDZQ/HdmK3c5e4FuaHQ/ReOJbm1kt1WAq7lUGdCCGKziF5muZ6KBZO0iYD+upb7mIYQRNhNEj3bhH/bUH0hXb5bPPWq4OL9J4wgAmlQJ0l4uSUgMZP+nLTu0gzR+lCCiOhNEj37uJ+e1V7SDwJ6mfzhFr8fB70/CCeIgBrkaYrWM5Fedgm+TrWX4vdIT2QSQylcnEIKMo2Zmyi6X1zwBzuuRRZIl0t1BhabadO9/OHEsLF03UILcu3B7B+LiN5XJ72tyFKVwywsoR82JUjoSNB4lwQQxGVYaJQXAgjiJRIV2kGVzwkgyHNGXNExAQTpOPh0/TkBBHnOiCs6JoAgHQefrj8ngCDPGXHFdgLN5ECQZkJJR84ggCBnUKXMZgggSDOhpCNnEECQM6hSZjMEEKSZUPbSkbL9RJCyvKktGAEECRYwmluWAIKU5U1twQggSLCA0dyyBBCkLG9q80xgoW0IsgCFQxCYCCDIRII9BBYIIMgCFA5BYCKAIBMJ9hBYIIAgC1A4BIGJQC5BpvLYQ6ApAgjSVDjpTG4CCJKbKOU1RQBBmgonnclNAEFyE6W8pggEEKQp3nQmGAEECRYwmluWAIKU5U1twQggSLCA0dyyBBCkLG9qC0agb0GCBYvmlieAIOWZU2MgAggSKFg0tTwBBCnPnBoDEUCQQMGiqeUJIMhJzCm2DQL/AAAA//8WiSanAAAABklEQVQDADMit+vzaa0gAAAAAElFTkSuQmCC", cl = "" + new URL("favorite-24-DVnWrpCg.png", import.meta.url).href, ll = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAPsElEQVR4Aeydi5nkNBaFqzeRhUgWIlmIBIgEiIQhkmEjmT2/sQd3ddmSbFkvn/ks/NLj3qP7W5KruvjXw/+sgBXYVMCAbErjG1bg8TAgjgIrsKOAAdkRx7esgAFxDFiBHQUuBGSnVd+yAp0oYEA66SibWUcBA1JHd7faiQIGpJOOspl1FDAgdXR3q50o0CcgnYhrM/tXwID034f24EIFDMiF4rrq/hUwIP33oT24UAEDcqG4rrp/BQzIUx/61AqsFTAgazV8bAWeFDAgT4L41AqsFTAgazV8bAWeFDAgT4L41AqsFTAgazWuPXbtHSpgQDrsNJtcTgEDUk5rt9ShAgakw06zyeUUMCDltHZLHSpgQDrstI8m+8pVChiQq5R1vUMoYECG6EY7cZUCBuQqZV3vEAoYkCG60U5cpYABuUrZUeq9uR8G5OYBYPf3FTAg+/r47s0VMCA3DwC7v6+AAdnXx3dvroABuXkA1HS/h7YNSA+9ZBurKWBAqknvhntQwID00Eu2sZoCBqSa9G64BwUMSA+9ZBtTFciW34Bkk9IVjaiAARmxV+1TNgUMSDYpXdGIChiQEXvVPmVTwIBkk9IVjajAR0BG9NI+WYGDChiQg8K52D0UMCD36Gd7eVABA3JQOBe7hwLRgHz58uUbJ2swQgykoB0NiCr9TunzmeSyD+v3qK+BIP9VsRi1pQASVaEzWYGRFDAgI/WmfcmugAHJLqkrHEkBAzJSb9qX7AqMAkh2YVyhFUABA4IKTlZgQwEDsiGML1sBFMgNyG+q9GenhzV4VNXgketfbkB+f3t7++XNyRpUjAHB8ZdSli03IFmMaqsSW3NnBQzInXvfvgcVMCBBiZzhzgoYkDv3vn0PKmBAghI5w50VMCA1e99tN6+AAWm+i2xgTQUMSE313XbzChiQ5rvIBtZUwIDUVN9tN6+AAWm+i44Z6FJ5FOgKkC9//7LKT9r/qvTHnD5rT+Kc69z/Lo88ruXuCjQPiIKfnxsi6JdfBOGbsj+o44CA9I2OSRxznfvAAjSU456yeLMC6Qo0C8gChlwCDII+NdDJTzlgMSgS0lu6Ak0CIjgYCRYw0r16X+IdKO9v+cwK7CvQHCCC4yeZHP3DXsobu02gzPXHlnG+jwrc6kpTgCh4/5D6TIu0u2z7We0wOl3WgCseR4FmAFHQAgcL7RLqsvC/YpQqYbvbKKhAE4AIDqZVpeBY5P1hbnc5975RBdRPTI+rWFcdEDkPGEemVfzd8Sepxg9FsCfpNGljusULgaRCzlxOAcUHcEyfb5Vr9Z+WqgMiU1KmOkDx89vf/77V7nulH5XYf6+6vlUCNvLpMGpj9IrK6ExXK/C+/gUOXZ0eojov3ldVAZHDPL15QkiD4AYYQPHLVk6B8pcS94EFULayrq+zHsGO9TUfV1ZAsUFc8PAEjsUaRvyikFQFRF7HOssIQeCrSHgTJGtQwgUej1g7YupynpMKbMCx1Fp07VgNEInAU5unxOL41h44jqwvHgKFcj9uVby67lFkJUbNQ8UFMfE8cqxN4n4xSKoBIo//oxTafpuDPJRv877Ks4gnbeaZb/x33ntXSYEIOBbLikFSExBGkMXhl3sFd8zT/2XZp4sx0zNEfyrm01IKJMCxmER/MZKs1yjLvY/7g1eqACIxgnDIn5invrKFN4HGW63Qop1p1qVihy29Zw7FA8G+N63aEmYqp/KX9VsVQLa8fbr++9P52dM/IypA8IhszpJLAQU3mh+BYzFhKq96LoGkFiD/Xrzb2uupzwJ76/aR64wioXJBu0IV+H6yAmfgWBq7DJJagODQ4lyRvYADENJee8Xt2jNm9Ht66uf8/h19xyfu7LNJVwuQkAOhQA6V9/3GFcgMx+ItcADdcn56HwPI6UZeVFALAAR8YY4vlVTgABy8zYydctPHpCwu1QIkZHytN0q1wA3pMcz9A3DwQTFvNFMgyaZXLUD+F+FBtqcAbaljYl4tx9hFdVVSpA9VbItpVPYz/Ul52wQc08gxryGBpOhDrBYgk9MBUXN/sh1TX4xdAbOvua3g4vtiLEJ563NNIxfWKvsPw7GYNUPCF1GLQVIFkNnRUDB+J1FTnjaLjh/2cz3Buma7PpSveUG2M90kuJYPOvn0uCtI5AP2B/Vf6fx15Fhdmw7nPioGSRVAJk8fj0+PxyP0L1cg8PQNtcU8N5Sn6H0FFtNM/n7+ObiAJManova+akw+ZINjqb8kJDUBifpkWwKfgkTlYzso9yf3S38e2svuH1QQOLR7uRX/24iXVuxclA+x2i+1bI4cS4ZlXwqSaoDIQaZYpMXnrT1PS34lkafpVp4P19U5y9Tk+en7Ia8ufJrt0WH9TbYzOsQ8GJqFRD5cBsfSQ+oz1iKXTreqATI7yVuJ+XB3BxzTLyTu5ppvqnMIsJQOivm271z7dTvZvUC9rDdiGmsOEvmRoj0+Ro8cZF6nqyGpCsjsXMwogiZAQjAwmvA2Z1rEqzMIKhLnP+mcaQkBRn7KhdLpvzkJNRBzX3ZjL7bHjHjPVTLK8lB4vl78XH4Ug2Nxbo4jRpLlUrZ9VUBmLxhFGCrn0+COQGJ+TkeQCCoSx/+AEaxmysCf5tL+dFLrPwoq/MGHoyZMmsz1HK3jdDm1Tx+kAH545Hg2doaEH+14vnXqvDogs2OX0B+hTAtw8OSPWW+E3AESRtCUAA3VGX2/JhyLkXMsZYWkOiA4NztWOlizPb3wITUpoJgW8sRl1EstvpUfSKbp51aGK67LF/xIAfMy7edYSpmR7ErSBCBYKMf4HKLUSHJZB+FLKCmgCGSmVClBFap2uU/dQMJ+uXbZXr40A8cVTjYDCM4JEhbsDJHZngDUu0rUWxuOM+sN7F+5s3kIHLz1Y7+Z6eyN0eFAn6YAwSBBQhAwkuScelD18sNzQMj54XS0oALqzHpjsl9tx+oCHJdBIl+GHjmk87Q1BwhWAYkSn00wmsQGBEVfJcrv/iLjq0I5rymYzqw3pgfGrAe/9YUu+BRj4gRJTMaUPPLnFnCgSZOAYBhJQcFrWAICUFjEs07h1l4ioBgleOKqirdf3t7euLZX5rJ7CiaC9Oh6A/+BG3++2ih/0CQaEtlA+1/LnzlQXbeBA52aBgQDSQoIAoUP9IAEWEhMwzhfEuesLwgo9gQRxaslBdOZ9Qb+4udL+6UJ/hWFRP7wOjrlxQL98A7ul840fLELQNb6KTCAhcT3pwiiJXHeTGcomM6sN/jFesBfu/7qmC9YpkBCgL+qJ3hN/lAW4IN55wz40Ex/zDYl77oDJNnDwgUUSGfWG0wFeerGTCVZj5AfSGIDka+kEOhJqsgnyqTCEeVDkiEVMhuQjKIrkM6sNxgBmR7GBvtkOSOqDhhtYssBCaObioU3+XRbOFDHgKBChqRA4gl7dDHMCwXWUIcsWUHCiBJTB1/6DEIin24NB0IaEFQ4mRRIBBvBlFoTAc2UigV3atl3+WdIgIw6393bONmFRD7hD9BvFP9wmTXHENOqtWcGZK1G4rGC6NR6Q0GdPKXaM1H1AcdpSOSX4ZiFNiCzEKk7BdGZ9QZv3jZf4abass6/gmR9+fF4bJ6+W5PIL8OxksqArMSIPVQQMfU4ut5gKsKiOra55HwzJLEAAjqQkAzHk9oG5EmQ0KngOLveKDJPnyFhuhVyiftAYjhQ4ikZkCdBtk4Fxpn1xqFXuFu2xF4XJLz6vWK0YhQsAnqsr1flMyARygKHsjGlSvmahYpM26lXuFMNJ/4jSAjknJDgD3WesKqfogYk0FeC4+h6Y3qjpAA9/Qo3YGLwtmwgoGO/krJXHy8XPvqzV6LzewZkpwMFx+H1hoIy6yvcHTOjbskeAvsMJMCRcySKsrt2JgPyogcExpn1BoEU+wbpRevXXToBCT7dDg56woCgwioBh06PrjdYvLYeSHy5MWkkEVit+6Quu2YzICtdBcfZ9QZz/VWN7R0q2FkbAQlvuKIMlC48MKLyjpbJgMw9qiA4ut6o8gp3NvvQboaEUSEWEqacfE5yqL0zhWqXvT0gAoPO589Ik6Ydc8fxyjP2w7i5SBu7A5Asn7S34UAhK24NCHBIZ6YPqZ9vME3J8i1ctV9tW0GCPzF2AAkjbUzeIfLcFhDBcXi9ocBq6hXumUiUL8DBKMg+pqrdr8nHVNBTnlsCIjh4Ch6ZU/O6s8lXuGeCzpBsq3crQATGmfVGD69wt3s6cGcFSSDn19u9jyRfHdk7uA0gwCEhzqw3mn+FK/9ObTMkKSPk8JDcAhDBcXS90d0r3FOEqPAMCa+AdRa1Db1wHx4QwXF0vdHtK9yosN7JJEgYLWMh4W9JgCT1TeCOBe3cGhYQgXF0vcHbnO5f4Z4NsRmS2M+GgIT/5cJwkAwJCHAoQI6sN243pZJOm5sgSfkG8AIJ+806e7txDJCGvRQcR9cbvMLl84CGvStv2gFILvtfLpT3/vEYChDBcXS9wZQqds5do5+qtnlnSIYARGCcXW/EfmmvaqBWbpxvAKesSYYYSboHBDgUOF5vSIQrN40ivLwAktiHCWsRvgR6pVmX1901IILj6Hrjtq9wz0TUDAlT0WhI1Ec8vM40W7VsbkB41fcZUY6mlHJS7sj3qXgS8t6+mJ0pPrWeV5ozKqS8zmX6W1Rr2cjopd35LTcgGFYyHVGgpH2jtpWqe2kdUu3bzJ8bkM2GfMMK9KiAAemx12xzMQUMSDGp3VCPCtwJkB77xzZXVsCAVO4AN9+2Agak7f6xdZUVSAGEzw/4OwGnx8Ma9K3Bn4/If9GA6FNUvgo+/V22jr1/e7MG/WrAAy4KkWhAomq7bSY7PqoCBmTUnrVfWRQwIFlkdCWjKmBARu1Z+5VFAQOSRUZXMqoCBqT1nrV9VRUwIFXld+OtK2BAWu8h21dVAQNSVX433roCBqT1HrJ9VRUwIFXlr9u4Ww8rYEDCGjnHjRUwIDfufLseVsCAhDVyjhsrYEBu3Pl2PayAAQlr5BzpCgxTwoAM05V25AoFDMgVqrrOYRQwIMN0pR25QgEDcoWqrnMYBQzIMF15F0fK+mlAyurt1jpTwIB01mE2t6wCBqSs3m6tMwUMSGcdZnPLKmBAyurt1lpW4IVtBuSFKL5kBRYFDMiihPdW4IUCBuSFKL5kBRYFDMiihPdW4IUCBuSFKL5kBRYFcgGy1Oe9FRhKAQMyVHfamdwKGJDcirq+oRQwIEN1p53JrYABya2o6xtKgQ4AGUpvO9OZAgaksw6zuWUVMCBl9XZrnSlgQDrrMJtbVgEDUlZvt9aZAvcGpLPOsrnlFTAg5TV3ix0pYEA66iybWl4BA1Jec7fYkQIGpKPOsqnlFTAgF2nuasdQ4P8AAAD//0l7Ra4AAAAGSURBVAMAN1tuJ+UDmWUAAAAASUVORK5CYII=", dl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAANNklEQVR4Aeydi3nbNhSFpU6STNJkkjSTxJmk6SRxJ4k3Ue9RAJei+ABAgCSA3x9hkCAeF+fe3yAlmfrjwg8KoMCsAgAyKw0nUOByARCiAAUWFACQBXE4hQIAQgygwIICBQFZGJVTKFCJAgBSiaMw8xgFAOQY3Rm1EgUApBJHYeYxCgDIMbozaiUKnB6Q2+3283a7/boNE/s16/GpEjbuZp4eELPyA+nSkgaXmn5qAKQmPbG1MQUApDGHMp28CgBIXj3prTEFAGTkUA5RYKgAgAzVYB8FRgoAyEgQDlFgqACADNVgHwVGCrQCyMcrP4crYLH1w1JTWyuA1OAUbKxQAQCp0GmYvJ8CALKf1oxUoQIAUqHTMHk/BQBkP60ZqUIFAKRCpz2bTEkpBQCklLL024QCANKEG5lEKQUApJSy9NuEAgDShBuZRCkFAKSUsq302/k8AKTzAGD6ywoAyLI+0Wdvt9tfLn2z/G9LeiqLkvZV9snK9BCG6L5psL8CAJJBcwt4QSEAbtbd3y69WP6XJT3mRkn7KvtpZXpsj6ARMMBigpx1A5ANnnFg/LIuBIUAsN3gTdAIGMEiuAAlWLr9KgJIgtYGhi6TPBg5AltwCZSuVpQE6XdvAiCRkhsc36yJLpNygGFdPWxaUVhNHiQ59gBAIvQ3OASGgjiiVXRVXXrp/qQEgNHG9N4AQAIjwMGh4A1ssama4NAll/JNHdF4mwIAEqCfwaGb8L3gGFrESjJU44B9AFkR3eDQDbTSSs0ip7WCAEm8tNlaAMiClAaHAlSrx0KtyVN6usdXO6P00fLPLun+5dX2YzbZ8CWmAXXzKQAgy1rqFavlGo9nBcbn6/X69Xq9/nDpzfJXl75b7mGJAeXFwfo4GkfFFQCQGYldQMZcWnkwVgPfIBEwAkUrzNuMCeNiVpGxIjscA8i8yKGXVgpwwbEKxngoA0UrTigkrCJjAXc4BpAJkd3qEfqqlS6nouHwwxokavvdjgWaZYtb7CXfYmecXFfgGZD1Nj3UCL2ceXEBvkkT60MridJaP7phX6vD+YwKAMi0mCGrh26+9Zd/uofIUoNEfa2tIvoMGJBEarulOoBMqxcCSMhf/One50t1uTV/9veZENt+1+T3ZgUAZCShu/8YlU4e/jtZuq3wn4DmfwbUoUomBQAkUUi7JAr5ax/Ve4k+owyg8pMCuwLyNPo5C0Ku8dfuFbbMbK3vEPu2jE/bgQIAMhDD7RKATgiyywVAnqNg7S+4WpSEqGTfsp0UoQCARIg1rBpxMz9strgf2GcIwIvjcDJcAQAZaRVxo1zi5daQNygBZOSzkoetAJJbo5Ag5OXW3KqfsD8AmXZKyEu4ehZWtvsFd3ml/xeZtsiV2gqnd9zdEVlpBQBkWuHQNwFzfngw5NPDISvb9IwoTVIAQCZks7/S+hhJSDBqFdkMia0e6iPknkZ2TVhMUSkFAGRe2dBg1P9pKMDne1o44+BYvbSyLrJ+ONL6YwtQAEDmRdLnot4ul/kKgzN3SCzYo+5JrH7Mc7ZCgR2Yxe5WBQBkRkG7zNIlVkxQahXQs6x02bUIioGhR4zqQdchl1WykNVDKhyQAGRBdINErxgJlIVaT6d0sy1Q9LgePUZUMChXUrnAEExPDRcKZMfCaU6VUgBA1pXVwxViIVGvWh300AfBoFxpcWVRo4l0fzrKRDlFOygAICsi2yoiOGIutVZ6jDqtp5/ooQ5RjaicTwEACdDSINEljlaCgNoRVZar6r5Dq9dyLc4WVQBAAuUdQKIVJbBVcjWtHHoiY3IHNMyjAIBE6Ogg0SVPSUj0pBRWjgi/lKwKIJHqGiT6nJYCWPclOUG592v963Iu0iqql1IAQBKUtSDW/YFWkhygeDCSns6YYD5NIhQAkAixxlU9KJbrfkGwKNhDVhWtPgLso7UtAsbYVo7TFACQNN2eWlmg68ZawS5YlASMkkBQ0r7KBYUeV6r3N0JgehqLgv0UAJACWhssugQTMEoCQUn7KgeKApqX6hJASilLv00oACBNuJFJlFIAQEop226/Xc0MQLpyN5ONVQBAYhWjflcKAEhX7maysQoASKxi1O9KAQDpyt1nn+z57AOQ8/kEi06kAICcyBmYcj4FAOR8PsGiEykAICdyBqacTwEAOZ9PsKiEAol9AkiicDTrQwEA6cPPzDJRAQBJFI5mfSgAIH34mVkmKgAgicLRrA8FQgDpQwlmiQITCgDIhCgUoYBXAEC8EuQPCtxut0+W9HUNKU+kf+ir5gMAqdl7hWw3MPTVDfr2K8Gh7zlRXmi0c3cLIOf2z+7WDeDwYwuObiE5GBDvA/IzKDABhzerW0gAxIdA5/kCHF6ZLiEBEO/+jvMAOLw6gkTftajclzWdA0hB91rgfbCk7yYsOMq2rs0+BbtuyEM70g18N5AASGhYRNZzgadvvFUwfYtsvkt1Z+OvhMG6gaRdQBK8nquJCzzBoUBSty9WdipIzB6tHClwaD5KmtsX14+Om0wAktmtLmCGcPgRTgOJs3ELHO9zsp2mIQEQ83CuzQXeFBx+iMMhcTbmgON9TrbTLCQAYt7NsbnAW4LDD3MYJM7GnHC8z8l2vlhqbgOQDC51gRcChx9td0icjbFwxHzZz4tN7tSv2Jl90RuAREt2uQybuMCLgcM33w2SgY1+7JBcXxOnr4yLgSSk36rqAMh2d6XA4UctDskADr3q5Mddy1+u1+sPV0nfrdgtJADioiAls+DTG2wxgTc1TDFIzD69lBsLsL5P8bs31EARHN1CAiA+EiJzC74ccPhRs0Ni9qXCoW/k9Xbd854hAZB7CMT9suDLCYcfPBskZl82OLxxvUICID4CAnMLvhJw+NE3Q2L2ZYfDG9cjJADivR+QW/DFwvFq3erlT13H227QthWSlHuOp8uqOUt7gwRA5iJhVJ4ChwXTZ0u64dUrQrGQRL+nkGhjMBxeEpuT5tLFjTuAeK8v5ImBpwC692oBlQKJPgUcDMlWG++GRvyyOQkSwaU8omVdVQFkxV+5As8CqhgkuWxckeLptM1Jl5BNQwIgT27/vyB34FlAZYck3Mb3eb2aHe+r23tp4o711TQkADITGKUCzwIqGySlbJyRZLbY5iRIYu+zZvs70wkAmfBG6cCzgNoMSWkbJ2RZLHJzEiiL9Wo7CSAjj+0VeC6gYv/q3m/c97JxJE2XhwAycPvegZcKiZkc8/mvrPccNnZXG4A4d+8Nhxv2kgiJb76W7wPHmhUVnwcQc95RcNjQ960QJMBxV3fbr+4BORoO777MkACHF3Zj3jUgZ4HD+zATJMDhBc2QdwvI2eDwvtwIyZu1z/YmoLep57xLQM4Khw9EC/KU90nUXO2UN5OOnkh3gJwdDh8QiZDc3yfxfZBvV6ArQGqBw7sVSLwSx+XdAFIbHD4kgMQrcUzeBSC1wuFDAki8EvvnzQNSOxw+JIDEK5EtD+qoaUBagcN7Eki8EvvlzQLSGhw+JIDEK7FP3iQgCXBU9QYbkOwDh0ZpDpBEOPSQZulRTQKSfVzVFCC9wOFDA0i8EuXyNEDK2ZPcc29weKGAxCtRJm8FkNinCeqeo7rLqrkQ2ABJzH8mzg3fdHkrgMQ4uik4fHQmQvLTVl49y9d3Qz5SoBVARtOaPWwSDj/bREh+AYlX8DnvCZCm4fCuHUDii0JyIJlR6XSAzNi5tbgLOLxIDhI9Vd4XheRAMqFSD4B0BYf3MZB4JbblrQPSJRw+JIDEK5GetwxI13D4kAASr0Ra3iogwDGIByAZiBG52yIgc3BEStNWdSBJ82drgADHQhwAyYI4M6daAgQ4Zpw8LAaSoRrr+60AAhzrvn6vASTvUqzutAIITxNcdfVjBSB51GPuqBVA5ua3U3mdwwDJut8AZF2jpmsAybJ7AWRZny7OAsm8mwFkXpuuzgDJtLsBZFqXLkuB5NntAPKsyblKdrYGSB4FB5BHPTgyBVIhsabN/fsugJhX2Z4VSIQk5tkAz4OesARATuiUs5iUCMlZzM9iB4BkkbHdTnqHBEDaje3VmYVW6BkSAAmNks7r9QoJgHQe+DHT7xESAImJEOpeeoMEQAj6aAV6ggRAosODBlJgBRJVaSIBSBNuPGYSPUACIMfEVjOjtg4JgDQTqsdNpGVIAOS4uGpqZAfJj6YmZZMBEBOBrSYF9rUVQPbVm9EqUwBAKnMY5u6rAIDsqzejVaYAgFTmMMzdVwEA2VdvRjuzAhO2tQLIh9vt9ol0rAYWX/xPuolwxu2nGUW6XI7WgP9Jt0BkQ4FuFGjlEqsbhzHRfRUAkH31ZrTKFMgFSGXTxlwUCFMAQMJ0olanCgBIp45n2mEKAEiYTtTqVIEaAHk13+j/DEiXSwsavF0q+jk9INfr9ev1eiW1owGAVPQHAlNRYFGB068gi9ZzEgUKKwAghQWm+7oVAJC6/Yf1hRXoG5DC4tJ9/QoASP0+ZAYFFQCQguLSdf0KAEj9PmQGBRUAkILi0nX9CgBIIR/SbRsK/AcAAP//kxK+eQAAAAZJREFUAwAVjNL61+ySuAAAAABJRU5ErkJggg==", pl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAHsUlEQVR4Aezd4XHbNhyGcaWTJJM0nCT2JEknSToJvUmzSQvcST3FoS2JBIk/gJ+PONoyCbx4Xj613Q/KHycfCCDwJgGCvInGNxA4nQjiKUDgHQIEeQeObyFAEM8AAu8Q2FGQd1b1LQQaIUCQRooSsw4BgtThbtVGCBCkkaLErEOAIHW4W7URAm0K0ghcMdsnQJD2O7SDHQkQZEe4pm6fAEHa79AOdiRAkB3hmrp9AgR51aEvEbgmQJBrGj5H4BUBgrwC4ksErgkQ5JqGzxF4RYAgr4D4EoFrAgS5prHv52ZvkABBGixN5OMIEOQ41lZqkABBGixN5OMIEOQ41lZqkMAugszz/DmN72n8k8a/xrwzg2Hnz8/XnD6+pvFxD/+KC5KCziloHk/pvEvoNK8DgUwgP1+f0yff0siyFBelmCBJjI9pZDFy4JTXgcDhBLIo+TeXLE6RxYsJktJ8T4McCYKjKoH8DH4plaCIIOknx9cUKAdLJwcC1Ql8S89kkeexiCAJR/57I50c3RFod0P5P9qb028WJJmaf9/LY3MYEyBQkED+P6mbn8vNgqQNbQ6R5nAgEJIAQULWIlQhApv/DikhSKG9mAaBeAQIEq+TYRK1sFGCtNCSjNUIEKQaegu3QIAgLbQkYzUCBKmG3sItECBICy3J+CiBYtcTpBjKYhP9SDMZp9PLKcAHQQKUcB1hmqbnyXhOTP5Oo/pBkOoVCBCZAEEityNbdQIEqV6BAJEJ/C5I5LSyIXAwAYIcDNxybREgSFt9SXswAYIcDNxybREgSFt9SXswgUMFOXhvlkNgMwGCbEZogp4JEKTndu1tMwGCbEZogp4JEKTndu1tM4FeBNkMwgQILBEgyBIVryFwJkCQM4hWTvM8P6WR3+K/9bH5Td2O6IwgR1Auu8afabqnDkYTb1lLkPSkORB4iwBB3iLz/+s+GZkAQUZu395vEiDITUQuGJkAQUZu395vEiDITUQuGJkAQWq2b+3wBAgSviIBaxIgSE361g5PgCDhKxKwJgGC1KRv7fAECBK+onUB3VWGAEHKcDRLpwQI0mmxtlWGAEHKcDRLpwQI0lix539c50M6tz7yv6IVnj5BwlcULuBQgQgyVN02+ygBgjxKzPVDESDIUHXb7KMECPIoMdcPRYAgQ9UdfbPx8hEkXicSBSJAkEBl3BNl9sZx92Aqdg1BiqE8bCJvHHcY6tOJIAfCtlR7BAjSXmcSryGw8h6CrATntjEIEGSMnu1yJQGCrATntjEIEGSMnu1yJQGCrATntjEI3CPIGCTsEoEFAgRZgOIlBC4ECHIh4YzAAgGCLEDxEgIXAgS5kHBGYIFAZUEWEnkJgUAECBKoDFHiESBIvE4kCkSAIIHKuCfKNE3P0zS1/qZxOb83jruncNcgEJlAvz9BIlOXrRkCBGmmKkFrECBIDerWbIYAQZqpStAaBAhSg7o1myFAkBVVuWUcAgQZp2s7XUGAICuguWUcAgQZp2s7XUGAICuguWUcAgSJ1bU0wQgQJFgh4sQiQJBYfUgTjABBghUiTiwCBInVhzTBCBAkWCH7xTHzGgIEWUPNPcMQIMgwVdvoGgIEWUPNPcMQIMgwVdvoGgIEWUPNPb8S6PgrgnRcrq1tJ0CQ7QzN0DEBgnRcrq1tJ0CQ7QzN0DEBgnRcbg9bq70HgtRuwPqhCRAkdD3C1SZAkNoNWD80AYKErke42gQIUrsB69cicNe6BLkLk4tGJUCQUZu377sIEOQuTC4alQBBRm3evu8iQJC7MLloVALrBBmVln0PR4Agw1Vuw48QIMgjtFw7HAGCDFe5DT9CgCCP0HLtcATCCTJcAzYcmgBBQtcjXG0CBKndgPVDEyBI6HqEq02AILUbsH5oAiMJEroI4WISIEjMXqQKQoAgQYoQIyYBgsTsRaogBAgSpAgxYhIgSJFeTNIrAYL02qx9FSFAkCIYTdIrAYL02qx9FSFAkCIYTdIrAYIEa3ae5+/z9Rj081TLlzSqHwSpXsFvAZ7SK8bp9PkU4IMgAUoQIS4BgsTtRrIABAgSoAQR4hIgSNxudk9mgdsECHKbkSsGJkCQgcu39dsECHKbkSsGJlBCkJ8D87P12AQ2P5slBImNSLoaBEKsOU3Ty9YgmwU5h9hs6taNuB+BVwSKPJObBTmH+nE+OyEQhUCRZ7KIIOmnyF+JShFj0zwOBLYSeDk/k1vnORUR5JxiSmeSJAiOqgR+Jjnys1gkRDFBUqgc7FNKtfkPozSHA4E3CLz78o/0HOZn8N2LHvlmMUEui6aA2d488u+A+SdKHpdvOyNQmkB+vvKzlh+959KTFxckB0xJ8++Az+n86Tw+pLMxTRiUZ5Cfsedpmnb5zWUXQbIkBgI9ECBIDy3aw24ECLIbWhM3R2AhMEEWoHgJgQsBglxIOCOwQIAgC1C8hMCFAEEuJJwRWCBAkAUoXkLgQqCUIJf5nBHoigBBuqrTZkoTIEhpoubrigBBuqrTZkoTIEhpoubrikADgnTF22YaI0CQxgoT91gCBDmWt9UaI0CQxgoT91gCBDmWt9UaIzC2II2VJe7xBAhyPHMrNkSAIA2VJerxBAhyPHMrNkSAIA2VJerxBAiyE3PT9kHgPwAAAP//5z62hgAAAAZJREFUAwDgmZncvTkGhQAAAABJRU5ErkJggg==", Vr = "" + new URL("send-udl03QcW.png", import.meta.url).href, ul = "" + new URL("speaker-design-DgEvq0K7.png", import.meta.url).href, ml = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3csvg%20class='icon'%20viewBox='0%200%201024%201024'%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='200'%3e%3cpath%20d='M915.326417%20371.789655l-4.028757%204.806469c-0.141216-0.077771-0.280386-0.151449-0.420579-0.225127l-74.382081%2088.653109H726.836485l78.597079-93.669356h-96.765881l-78.589916%2093.669356h-109.667725l78.604242-93.669356h-96.780207l-78.589916%2093.669356H313.984622l78.598102-93.669356h-96.773044l-78.589916%2093.669356H107.559203l78.598102-93.669356h-43.600007v-6.650467l66.099441-17.709337-100.475366-70.357418H92.277148v95.151104%2012.257162%2027.126824%2054.581106%20455.113385c0%2021.99392%2017.825994%2039.818891%2039.819914%2039.818891h759.804852c21.99392%200%2039.819914-17.824971%2039.819914-39.818891V465.754746v-54.581106-39.383986h-16.395412zM126.707308%20308.664965c10.576893%200%2019.155269%208.574283%2019.155269%2019.155269s-8.578376%2019.155269-19.155269%2019.155269-19.155269-8.574283-19.155269-19.155269%208.577352-19.155269%2019.155269-19.155269zM534.339286%20606.616938h183.864588v75.720565H534.339286v-75.720565zM170.586678%20606.616938h331.888899v75.720565H170.586678v-75.720565zM583.119269%20788.871865H170.586678V713.1513h412.532591v75.720565zM850.044598%20788.871865H614.974791V713.1513h235.069807v75.720565z'%20fill='currentColor'/%3e%3cpath%20d='M607.453491%20240.139266%20506.963799%20169.780825%20413.487847%20194.82829%20513.971399%20265.185708zM922.264433%20155.786089%20897.936351%2065.020876%20812.276413%2087.97568%20912.744615%20158.333098zM408.052045%20293.565059%20307.568493%20223.210711%20214.101751%20248.254084%20314.576093%20318.611501zM806.833447%20186.712449%20706.350918%20116.355031%20612.89748%20141.397381%20713.365682%20211.759915z'%20fill='currentColor'/%3e%3c/svg%3e", oi = "" + new URL("ip-art-director-ZVdQ3DNA.png", import.meta.url).href, gl = "" + new URL("ip-scene-designer-DG_21RS5.png", import.meta.url).href, oo = "" + new URL("ip-screenwriter-BpXH8sVJ.png", import.meta.url).href, hl = "" + new URL("ip-sound-director-BEW5J9Tm.png", import.meta.url).href, fl = "" + new URL("ip-storyboard-designer-gnhXClmR.png", import.meta.url).href, Gr = "" + new URL("ip-user-B7I5aV2Z.png", import.meta.url).href, yl = v.lazy(() => zt(() => import("./ComfyWorkflowStudioPanel-C4NYrft6.js"), [], import.meta.url).then((n) => ({ default: n.ComfyWorkflowStudioPanel }))), bl = v.lazy(() => zt(() => import("./MainCanvasFlow-BbsMxxcM.js"), __vite__mapDeps([0, 1]), import.meta.url).then((n) => ({ default: n.MainCanvasFlow }))), vl = v.lazy(() => zt(() => import("./jiaren-canvas-Cdxozcx-.js").then((n) => n.J), __vite__mapDeps([1, 0]), import.meta.url).then((n) => ({ default: n.JiarenCanvasModePanel }))), jl = v.lazy(() => zt(() => import("./prompt-library-CEE0l4Hc.js").then((n) => n.P), [], import.meta.url).then((n) => ({ default: n.PromptLibraryDrawer }))), xl = v.lazy(() => zt(() => import("./DesignAgentPanel-DdUMLKSc.js"), __vite__mapDeps([1, 0]), import.meta.url).then((n) => ({ default: n.DesignAgentPanel }))), Al = v.lazy(() => zt(() => import("./MasterToolkitPanel-exW7jqLe.js"), __vite__mapDeps([1, 0]), import.meta.url).then((n) => ({ default: n.MasterToolkitPanel }))), wl=()=>null,kl= v.lazy(() => zt(() => import("./RongtuStudioPanel-Cr4qOo7u.js"), [], import.meta.url).then((n) => ({ default: n.RongtuStudioPanel }))), si = ["\u6211\u7684", "\u81EA\u5A92\u4F53", "\u5E7F\u544A\u8425\u9500", "\u6E38\u620F", "\u5468\u8FB9\u8BBE\u8BA1"], Cl = ["Seedance 2.0 \u8FD0\u955C\u63D0\u793A\u8BCD\u516C\u5F0F\uFF0C\u4E2D\u82F1\u6587\u5BF9\u7167\u3002\u6BCF\u4E2A\u5206\u955C\u5FC5\u987B\u5148\u9501\u5B9A\u4EBA\u7269/\u8F7D\u5177/\u573A\u666F/\u52A8\u4F5C\uFF0C\u518D\u9009\u62E9\u5176\u4E2D 1-2 \u4E2A\u8FD0\u955C\uFF0C\u4E0D\u5141\u8BB8\u56E0\u4E3A\u8FD0\u955C\u66FF\u6362\u4E3B\u89D2\u3001\u6027\u522B\u3001\u573A\u666F\u6216\u9053\u5177\u3002", "01 \u7F13\u6162\u63A8\u8FDB / Slow Push-in / Dolly In\uFF1A\u955C\u5934\u4ECE\u8FDC\u666F\u7F13\u6162\u63A8\u8FD1\u4E3B\u4F53\uFF0C\u589E\u5F3A\u60C5\u7EEA\u538B\u8FEB\u548C\u4EBA\u7269\u5B58\u5728\u611F\u3002", "02 \u7F13\u6162\u62C9\u8FDC / Slow Pull-back / Dolly Out\uFF1A\u955C\u5934\u4ECE\u4E3B\u4F53\u9010\u6E10\u62C9\u5F00\uFF0C\u5C55\u793A\u7A7A\u95F4\u5173\u7CFB\u3001\u5B64\u72EC\u611F\u6216\u7ED3\u5C3E\u4F59\u97F5\u3002", "03 \u4EF0\u62CD / Low Angle Shot / Tilt-up\uFF1A\u4F4E\u673A\u4F4D\u5411\u4E0A\u770B\u4E3B\u4F53\uFF0C\u5F3A\u5316\u529B\u91CF\u3001\u901F\u5EA6\u3001\u538B\u8FEB\u6216\u82F1\u96C4\u611F\u3002", "04 \u4FEF\u62CD / High Angle / Bird's-eye View\uFF1A\u9AD8\u673A\u4F4D\u4FEF\u89C6\u4E3B\u4F53\uFF0C\u5C55\u793A\u8DEF\u7EBF\u3001\u573A\u9762\u8C03\u5EA6\u548C\u73AF\u5883\u89C4\u6A21\u3002", "05 \u8DDF\u62CD\u955C\u5934 / Tracking Shot\uFF1A\u955C\u5934\u4E0E\u4E3B\u4F53\u540C\u901F\u79FB\u52A8\uFF0C\u4FDD\u6301\u4E3B\u4F53\u8FDE\u7EED\u5728\u753B\u9762\u4E2D\u5FC3\uFF0C\u4E0D\u505A\u65E0\u5173\u7A7A\u5207\u3002", "06 \u4F4E\u89D2\u5EA6\u8DDF\u62CD / Low-angle Tracking Shot\uFF1A\u8D34\u8FD1\u5730\u9762\u8DDF\u968F\u4E3B\u4F53\u6216\u8F7D\u5177\uFF0C\u7A81\u51FA\u901F\u5EA6\u3001\u51B2\u51FB\u548C\u8DEF\u9762\u8D28\u611F\u3002", "07 \u5E0C\u533A\u67EF\u514B\u53D8\u7126 / Dolly Zoom\uFF1A\u955C\u5934\u63A8\u62C9\u4E0E\u53D8\u7126\u76F8\u53CD\uFF0C\u5236\u9020\u5FC3\u7406\u51B2\u51FB\u6216\u5173\u952E\u53D1\u73B0\u3002", "08 \u5347\u683C\u6162\u52A8\u4F5C / Slow Motion\uFF1A\u5173\u952E\u52A8\u4F5C\u653E\u6162\uFF0C\u4FDD\u7559\u6E05\u6670\u4E3B\u4F53\u3001\u98DE\u6E85\u7269\u3001\u8863\u6446\u3001\u8F66\u8F6E\u6216\u6B66\u5668\u7EC6\u8282\u3002", "09 \u8377\u5170\u89D2\u503E\u659C\u6784\u56FE / Dutch Angle\uFF1A\u8F7B\u5FAE\u503E\u659C\u673A\u4F4D\uFF0C\u8868\u73B0\u5931\u8861\u3001\u5371\u9669\u6216\u6DF7\u4E71\uFF0C\u4E0D\u8981\u8FC7\u5EA6\u6447\u6643\u3002", "10 \u4E3B\u89C2\u89C6\u89D2 / POV / First-person View\uFF1A\u4EE5\u89D2\u8272\u89C6\u89D2\u63A8\u8FDB\uFF0C\u753B\u9762\u5FC5\u987B\u4ECD\u80FD\u8BFB\u51FA\u73AF\u5883\u65B9\u5411\u548C\u52A8\u4F5C\u76EE\u6807\u3002", "11 \u5339\u914D\u526A\u8F91 / Match Cut\uFF1A\u7528\u5F62\u72B6\u3001\u52A8\u4F5C\u65B9\u5411\u6216\u6784\u56FE\u76F8\u4F3C\u6027\u8854\u63A5\u524D\u540E\u955C\u5934\uFF0C\u4FDD\u6301\u53D9\u4E8B\u8FDE\u7EED\u3002", "12 \u866B\u89C6\u955C\u5934 / Worm's-eye View\uFF1A\u6781\u4F4E\u673A\u4F4D\u5411\u4E0A\u62CD\uFF0C\u9002\u5408\u5DE8\u7269\u3001\u5EFA\u7B51\u3001\u673A\u8F66\u3001\u811A\u6B65\u548C\u538B\u8FEB\u573A\u666F\u3002", "13 \u73AF\u7ED5\u955C\u5934 / Orbit Shot\uFF1A\u955C\u5934\u56F4\u7ED5\u4E3B\u4F53 90-180 \u5EA6\u79FB\u52A8\uFF0C\u5C55\u793A\u89D2\u8272\u3001\u8F7D\u5177\u6216\u9053\u5177\u7684\u7A7A\u95F4\u5173\u7CFB\u3002", "14 \u624B\u6301\u955C\u5934 / Handheld Camera\uFF1A\u8F7B\u5FAE\u771F\u5B9E\u624B\u6301\u6643\u52A8\uFF0C\u589E\u52A0\u4E34\u573A\u611F\uFF0C\u4F46\u4E3B\u4F53\u4E0D\u80FD\u4E22\u5931\u3002", "15 \u6A2A\u5411\u6447\u79FB / Pan / Trucking Shot\uFF1A\u955C\u5934\u6A2A\u5411\u626B\u8FC7\u6216\u5E73\u79FB\uFF0C\u5C55\u793A\u6A2A\u5411\u8FD0\u52A8\u3001\u8FFD\u9010\u6216\u961F\u5217\u3002", "16 \u7126\u70B9\u8F6C\u79FB / Rack Focus\uFF1A\u524D\u666F\u4E0E\u80CC\u666F\u7126\u70B9\u5207\u6362\uFF0C\u7528\u4E8E\u7EBF\u7D22\u3001\u8868\u60C5\u3001\u9053\u5177\u548C\u5A01\u80C1\u63ED\u793A\u3002", "17 \u5EF6\u65F6\u6444\u5F71 / Time-lapse\uFF1A\u65F6\u95F4\u5FEB\u901F\u6D41\u901D\uFF0C\u9002\u5408\u5929\u6C14\u3001\u57CE\u5E02\u6D41\u91CF\u3001\u5149\u5F71\u53D8\u5316\u6216\u642D\u5EFA\u8FC7\u7A0B\u3002", "18 \u9AD8\u901F\u8DDF\u62CD + \u52A8\u6001\u6A21\u7CCA / High-speed Chase with Motion Blur\uFF1A\u4E3B\u4F53\u6E05\u6670\uFF0C\u80CC\u666F\u5E26\u901F\u5EA6\u62D6\u5F71\uFF0C\u7A81\u51FA\u72C2\u98D9\u548C\u8FFD\u9010\u3002", "19 \u822A\u62CD\u9E1F\u77B0 / Aerial / Drone Shot\uFF1A\u9AD8\u7A7A\u4FEF\u62CD\u8DEF\u7EBF\u3001\u5730\u5F62\u3001\u57CE\u5E02\u7ED3\u6784\u6216\u961F\u4F0D\u52A8\u7EBF\u3002", "20 \u5FEB\u901F\u53D8\u7126\u63A8\u62C9 / Crash Zoom\uFF1A\u5FEB\u901F\u63A8\u5411\u5173\u952E\u8868\u60C5\u3001\u9053\u5177\u6216\u52A8\u4F5C\u7206\u70B9\uFF0C\u4F5C\u4E3A\u5F3A\u8C03\u70B9\u4F7F\u7528\u3002"].join(`
`), ci = [{ id: "story-short", category: "\u6211\u7684", label: "\u6545\u4E8B\u77ED\u7247", hint: "\u5267\u672C\u786E\u8BA4\u540E\u76F4\u63A5\u8FDB\u5165\u5206\u955C\u548C\u89C6\u9891\u751F\u6210", tag: "\u63A8\u8350", mode: "seedance-story", tone: "\u7535\u5F71\u611F", promptPreset: "\u4F60\u662F\u52A8\u753B\u77ED\u7247\u603B\u5BFC\u6F14\u3002\u628A\u7528\u6237\u9700\u6C42\u5148\u6574\u7406\u6210\u53EF\u786E\u8BA4\u5267\u672C\uFF0C\u786E\u8BA4\u540E\u76F4\u63A5\u8FDB\u5165 OiiOii \u5F0F\u9010\u955C\u5934\u5206\u955C\uFF0C\u518D\u751F\u6210\u5355\u955C\u89C6\u9891\u3002", pipeline: "\u7528\u6237\u60F3\u6CD5 -> \u7F16\u5267\u63A8\u7406 -> \u7528\u6237\u786E\u8BA4\u5267\u672C -> \u5206\u955C\u5E08 -> \u89C6\u9891\u5BFC\u6F14 -> \u6210\u7247\u5BFC\u51FA" }, { id: "seedance-camera-motion-20", category: "\u6211\u7684", label: "Seedance \u8FD0\u955C 20 \u5F0F", hint: "\u628A\u955C\u5934\u8BED\u8A00\u5199\u8FDB\u5206\u955C\uFF0C\u51CF\u5C11\u7A7A\u5207\u548C\u573A\u666F\u6F02\u79FB", tag: "\u8FD0\u955C", mode: "seedance-story", tone: "\u7535\u5F71\u611F", promptPreset: Cl, pipeline: "\u4E3B\u4F53\u9501\u5B9A -> \u79D2\u7EA7\u5206\u955C -> \u8FD0\u955C\u516C\u5F0F -> \u5355\u955C\u89C6\u9891 -> \u987A\u5E8F\u6210\u7247" }, { id: "character-design", category: "\u6211\u7684", label: "\u89D2\u8272\u8BBE\u8BA1", hint: "\u751F\u6210\u53EF\u590D\u7528\u89D2\u8272\u4E3B\u56FE\u3001\u8BBE\u5B9A\u8868\u548C\u4E00\u81F4\u6027\u89C4\u5219", mode: "character-design", styleId: "three-d", promptPreset: "\u4F60\u662F\u89D2\u8272\u8BBE\u8BA1\u5E08 Agent\u3002\u5148\u6574\u7406\u8EAB\u4EFD\u3001\u5916\u8C8C\u3001\u6027\u683C\u3001\u670D\u88C5\u3001\u9053\u5177\u548C\u7981\u5FCC\u9879\uFF0C\u518D\u751F\u6210\u89D2\u8272\u4E3B\u56FE\u63D0\u793A\u8BCD\u548C\u8BBE\u5B9A\u8868\u63D0\u793A\u8BCD\u3002", pipeline: "\u9700\u6C42\u7406\u89E3 -> \u98CE\u683C\u786E\u8BA4 -> \u89D2\u8272\u4E3B\u56FE -> \u8BBE\u5B9A\u8868 -> \u52A0\u5165\u8D44\u4EA7\u5E93" }, { id: "scene-design", category: "\u6211\u7684", label: "\u573A\u666F\u8BBE\u8BA1", hint: "\u751F\u6210\u573A\u666F\u4E3B\u56FE\u3001\u591A\u89C6\u89D2\u548C\u7A7A\u95F4\u89C4\u5219", mode: "scene-design", promptPreset: "\u4F60\u662F\u52A8\u753B\u573A\u666F\u7F8E\u672F\u6307\u5BFC\u3002\u628A\u573A\u666F\u9700\u6C42\u62C6\u6210\u7A7A\u95F4\u7ED3\u6784\u3001\u65F6\u95F4\u5929\u6C14\u3001\u5149\u5F71\u8272\u5F69\u3001\u9053\u5177\u548C\u955C\u5934\u673A\u4F4D\uFF0C\u8F93\u51FA\u53EF\u590D\u7528\u573A\u666F\u8D44\u4EA7\u3002", pipeline: "\u7A7A\u95F4\u5206\u6790 -> \u98CE\u683C\u786E\u8BA4 -> \u573A\u666F\u4E3B\u56FE -> \u591A\u89C6\u89D2 -> \u52A0\u5165\u8D44\u4EA7\u5E93" }, { id: "free-canvas", category: "\u6211\u7684", label: "\u81EA\u7531\u521B\u4F5C", hint: "\u5FEB\u901F\u51FA\u56FE\u3001\u56FE\u751F\u89C6\u9891\u3001\u804A\u5929\u4FEE\u6539", mode: "free-canvas", promptPreset: "\u4F60\u662F\u81EA\u7531\u753B\u5E03\u52A9\u624B\u3002\u6839\u636E\u7528\u6237\u7684\u4E00\u53E5\u8BDD\u548C\u53C2\u8003\u56FE\u76F4\u63A5\u751F\u6210\u56FE\u7247\u6216\u77ED\u89C6\u9891\uFF0C\u4FDD\u6301\u64CD\u4F5C\u7B80\u5355\uFF0C\u4FEE\u6539\u65F6\u7528\u81EA\u7136\u8BED\u8A00\u91CD\u5199\u63D0\u793A\u8BCD\u3002", pipeline: "\u63D0\u793A\u8BCD -> \u6A21\u578B\u5339\u914D -> \u56FE\u7247/\u89C6\u9891\u751F\u6210 -> \u804A\u5929\u4FEE\u6539" }, { id: "suspense-story", category: "\u81EA\u5A92\u4F53", label: "\u60AC\u7591\u6545\u4E8B", hint: "\u53CD\u8F6C\u3001\u7EBF\u7D22\u3001\u538B\u8FEB\u611F\u955C\u5934", mode: "story-film", tone: "\u7D27\u5F20\u60AC\u7591", promptPreset: "\u4F60\u662F\u60AC\u7591\u77ED\u7247\u7F16\u5267\u548C\u5206\u955C\u5BFC\u6F14\u3002\u7ED3\u6784\u5FC5\u987B\u5305\u542B\u65E5\u5E38\u5F02\u5E38\u3001\u7EBF\u7D22\u8BEF\u5BFC\u3001\u538B\u8FEB\u5347\u7EA7\u3001\u53CD\u8F6C\u63ED\u793A\u548C\u4F59\u5473\u7ED3\u5C3E\u3002", pipeline: "\u60AC\u5FF5\u94A9\u5B50 -> \u7EBF\u7D22\u5206\u914D -> \u89D2\u8272/\u573A\u666F -> \u5206\u955C -> \u89C6\u9891 -> \u97F3\u6548" }, { id: "comedy-story", category: "\u81EA\u5A92\u4F53", label: "\u641E\u7B11\u6545\u4E8B", hint: "\u4E09\u6BB5\u5F0F\u7B11\u70B9\u3001\u53CD\u5DEE\u548C\u5938\u5F20\u8868\u6F14", mode: "story-film", tone: "\u8F7B\u677E\u641E\u7B11", promptPreset: "\u4F60\u662F\u641E\u7B11\u77ED\u7247\u7F16\u5267\u3002\u6BCF\u4E2A\u5206\u955C\u5FC5\u987B\u670D\u52A1\u4E8E\u94FA\u57AB\u3001\u8BEF\u4F1A\u3001\u53CD\u5DEE\u6216\u5305\u88B1\uFF0C\u955C\u5934\u8BED\u8A00\u8981\u6E05\u695A\u3001\u8282\u594F\u8981\u5FEB\u3002", pipeline: "\u7B11\u70B9\u8BBE\u8BA1 -> \u89D2\u8272\u8868\u6F14 -> \u5206\u955C\u8282\u594F -> \u89C6\u9891\u751F\u6210 -> \u6210\u7247" }, { id: "pet-story", category: "\u81EA\u5A92\u4F53", label: "\u840C\u5BA0\u6545\u4E8B", hint: "\u53EF\u7231\u89D2\u8272\u3001\u6CBB\u6108\u60C5\u7EEA\u3001\u77ED\u89C6\u9891\u8282\u594F", mode: "story-film", tone: "\u6E29\u6696\u6CBB\u6108", promptPreset: "\u4F60\u662F\u840C\u5BA0\u52A8\u753B\u5BFC\u6F14\u3002\u7A81\u51FA\u5BA0\u7269\u8868\u60C5\u3001\u52A8\u4F5C\u53CD\u5DEE\u3001\u6E29\u6696\u966A\u4F34\u548C\u53EF\u4F20\u64AD\u7684\u6700\u540E\u4E00\u5E55\u3002", pipeline: "\u5BA0\u7269\u8BBE\u5B9A -> \u60C5\u7EEA\u94A9\u5B50 -> \u573A\u666F -> \u5206\u955C -> \u89C6\u9891" }, { id: "instant-noodle", category: "\u81EA\u5A92\u4F53", label: "\u6CE1\u9762\u756A", hint: "\u4F4E\u95E8\u69DB\u8FDE\u7EED\u5267\u96C6\uFF0C\u56FA\u5B9A\u89D2\u8272\u548C\u573A\u666F", mode: "story-film", tone: "\u8F7B\u677E\u641E\u7B11", promptPreset: "\u4F60\u662F\u6CE1\u9762\u756A\u5BFC\u6F14\u3002\u7528\u56FA\u5B9A\u89D2\u8272\u3001\u56FA\u5B9A\u573A\u666F\u548C\u9AD8\u9891\u53CD\u8F6C\u505A 30-60 \u79D2\u77ED\u96C6\uFF0C\u7ED3\u6784\u6E05\u695A\u4E14\u5BB9\u6613\u8FDE\u7EED\u66F4\u65B0\u3002", pipeline: "\u7CFB\u5217\u8BBE\u5B9A -> \u5355\u96C6\u51B2\u7A81 -> \u5206\u955C -> \u89C6\u9891 -> \u8D44\u4EA7\u590D\u7528" }, { id: "kon-aesthetic", category: "\u81EA\u5A92\u4F53", label: "\u4ECA\u654F\u89C6\u542C\u7F8E\u5B66", hint: "\u865A\u5B9E\u4EA4\u9519\u3001\u5339\u914D\u526A\u8F91\u3001\u5FC3\u7406\u8272\u5F69", mode: "story-film", tone: "\u7535\u5F71\u611F", promptPreset: "\u4F60\u662F\u52A8\u753B\u7535\u5F71\u5206\u955C\u5E08\u3002\u7528\u865A\u5B9E\u4EA4\u9519\u3001\u5339\u914D\u526A\u8F91\u3001\u68A6\u5883\u8F6C\u573A\u3001\u8272\u5F69\u5FC3\u7406\u548C\u4E3B\u89C2\u955C\u5934\u7EC4\u7EC7\u6545\u4E8B\uFF0C\u4F46\u4E0D\u8981\u590D\u5236\u4EFB\u4F55\u53D7\u4FDD\u62A4\u7D20\u6750\u3002", pipeline: "\u5FC3\u7406\u4E3B\u9898 -> \u5339\u914D\u526A\u8F91 -> \u89D2\u8272/\u573A\u666F -> \u5206\u955C -> \u89C6\u9891" }, { id: "anthropomorphic", category: "\u81EA\u5A92\u4F53", label: "\u4E07\u7269\u62DF\u4EBA\u5316", hint: "\u7269\u54C1\u53D8\u89D2\u8272\uFF0C\u5F3A\u8BB0\u5FC6\u70B9\u77ED\u7247", mode: "story-film", tone: "\u8F7B\u677E\u641E\u7B11", promptPreset: "\u4F60\u662F\u62DF\u4EBA\u5316\u77ED\u7247\u5BFC\u6F14\u3002\u628A\u7269\u54C1\u3001\u98DF\u7269\u3001\u57CE\u5E02\u6216\u62BD\u8C61\u6982\u5FF5\u53D8\u6210\u89D2\u8272\uFF0C\u4FDD\u7559\u539F\u7269\u7279\u5F81\u5E76\u5F62\u6210\u6E05\u6670\u6027\u683C\u51B2\u7A81\u3002", pipeline: "\u62DF\u4EBA\u8BBE\u5B9A -> \u89D2\u8272\u8BBE\u8BA1 -> \u573A\u666F -> \u5206\u955C -> \u89C6\u9891" }, { id: "general-product-ad", category: "\u5E7F\u544A\u8425\u9500", label: "\u901A\u7528\u5546\u54C1\u5C55\u793A\u5E7F\u544A", hint: "\u4E3B\u89C6\u89C9\u3001\u5356\u70B9\u955C\u5934\u3001\u5C55\u793A\u89C6\u9891", mode: "product-ad", tone: "\u5546\u4E1A\u9AD8\u7EA7", promptPreset: "\u4F60\u662F\u5546\u54C1\u5E7F\u544A\u5BFC\u6F14\u3002\u811A\u672C\u5FC5\u987B\u5305\u542B\u4E09\u79D2\u94A9\u5B50\u3001\u5356\u70B9\u5C55\u793A\u3001\u8D28\u611F\u7EC6\u8282\u3001\u4F7F\u7528\u573A\u666F\u548C\u7ED3\u675F\u8BB0\u5FC6\u70B9\u3002", pipeline: "\u5356\u70B9\u62C6\u89E3 -> \u4E3B\u89C6\u89C9 -> \u955C\u5934\u811A\u672C -> \u5546\u54C1\u89C6\u9891 -> \u4E0B\u8F7D" }, { id: "beauty-ad", category: "\u5E7F\u544A\u8425\u9500", label: "\u7F8E\u5986\u4E2A\u62A4\u5E7F\u544A", hint: "\u5FAE\u8DDD\u3001\u8D28\u5730\u3001\u6210\u5206\u3001\u4F7F\u7528\u6548\u679C", mode: "product-ad", tone: "\u5546\u4E1A\u9AD8\u7EA7", promptPreset: "\u4F60\u662F\u7F8E\u5986\u5546\u4E1A\u5E7F\u544A\u5BFC\u6F14\u3002\u753B\u9762\u5FC5\u987B\u5305\u542B\u75DB\u70B9\u5F15\u5165\u3001\u6838\u5FC3\u6210\u5206\u3001\u8D28\u5730\u5FAE\u8DDD\u3001\u4F7F\u7528\u6548\u679C\u548C\u9AD8\u7EA7\u68DA\u62CD\u5149\u3002", pipeline: "\u5356\u70B9 -> \u68DA\u62CD\u4E3B\u89C6\u89C9 -> \u5FAE\u8DDD\u955C\u5934 -> \u4F7F\u7528\u6548\u679C -> \u89C6\u9891" }, { id: "food-drink-ad", category: "\u5E7F\u544A\u8425\u9500", label: "\u98DF\u54C1\u996E\u6599\u5E7F\u544A", hint: "\u98DF\u6B32\u5149\u3001\u6162\u52A8\u4F5C\u3001\u5305\u88C5\u7A33\u5B9A", mode: "product-ad", tone: "\u5546\u4E1A\u9AD8\u7EA7", promptPreset: "\u4F60\u662F\u98DF\u54C1\u996E\u6599\u5E7F\u544A\u5BFC\u6F14\u3002\u5F3A\u8C03\u98DF\u6B32\u3001\u5305\u88C5\u8BC6\u522B\u3001\u6DB2\u4F53/\u84B8\u6C7D/\u8D28\u5730\u6162\u52A8\u4F5C\u548C\u723D\u611F\u8BB0\u5FC6\u70B9\u3002", pipeline: "\u5356\u70B9 -> \u98DF\u6B32\u4E3B\u89C6\u89C9 -> \u6162\u52A8\u4F5C\u955C\u5934 -> \u89C6\u9891" }, { id: "digital-ad", category: "\u5E7F\u544A\u8425\u9500", label: "3C \u6570\u7801\u5E7F\u544A", hint: "\u786C\u6717\u5149\u5F71\u3001\u53C2\u6570\u53EF\u89C6\u5316\u3001\u6750\u8D28\u7EC6\u8282", mode: "product-ad", tone: "\u5546\u4E1A\u9AD8\u7EA7", promptPreset: "\u4F60\u662F 3C \u6570\u7801\u5E7F\u544A\u5BFC\u6F14\u3002\u7A81\u51FA\u7ED3\u6784\u3001\u6750\u8D28\u3001\u79D1\u6280\u5149\u6548\u3001\u4F7F\u7528\u573A\u666F\u548C\u6E05\u6670\u4EA7\u54C1\u8F6E\u5ED3\uFF0C\u907F\u514D\u4EA7\u54C1\u53D8\u5F62\u3002", pipeline: "\u4EA7\u54C1\u8BC6\u522B -> \u79D1\u6280\u4E3B\u89C6\u89C9 -> \u529F\u80FD\u955C\u5934 -> \u89C6\u9891" }, { id: "game-card-ad", category: "\u6E38\u620F", label: "\u5361\u724C\u6E38\u620F\u4E70\u91CF", hint: "\u5F3A\u51B2\u7A81\u3001\u89D2\u8272\u6280\u80FD\u3001\u70B9\u51FB\u6B32\u671B", mode: "story-film", tone: "\u53F2\u8BD7\u71C3\u5411", promptPreset: "\u4F60\u662F\u6E38\u620F\u4E70\u91CF\u5E7F\u544A\u5BFC\u6F14\u3002\u7528\u5F3A\u51B2\u7A81\u3001\u6280\u80FD\u91CA\u653E\u3001\u6570\u503C\u53CD\u8F6C\u548C\u89D2\u8272\u723D\u70B9\u7EC4\u7EC7\u5206\u955C\uFF0C\u4FDD\u6301\u53EF\u4F20\u64AD\u8282\u594F\u3002", pipeline: "\u5356\u70B9\u94A9\u5B50 -> \u89D2\u8272\u6280\u80FD -> \u5206\u955C -> \u89C6\u9891" }, { id: "badge-design", category: "\u5468\u8FB9\u8BBE\u8BA1", label: "\u5427\u5527", hint: "\u5706\u5F62\u5FBD\u7AE0\u6784\u56FE\uFF0C\u53EF\u5370\u5237", mode: "free-canvas", promptPreset: "\u4F60\u662F ACG \u5468\u8FB9\u8BBE\u8BA1\u5E08\u3002\u8F93\u51FA\u5706\u5F62\u5427\u5527\u6784\u56FE\uFF0C\u4E3B\u4F53\u6E05\u695A\u3001\u8FB9\u7F18\u7559\u767D\u3001\u8272\u5F69\u9002\u5408\u5370\u5237\u3001\u80CC\u666F\u53EF\u7B80\u6D01\u88C5\u9970\u3002", pipeline: "\u89D2\u8272/\u4E3B\u9898 -> \u5468\u8FB9\u6784\u56FE -> \u51FA\u56FE -> \u53BB\u5E95/\u4E0B\u8F7D" }, { id: "sticker-design", category: "\u5468\u8FB9\u8BBE\u8BA1", label: "\u8D34\u7EB8", hint: "\u767D\u8FB9\u3001\u53EF\u7231\u52A8\u4F5C\u3001\u900F\u660E\u5E95\u5BFC\u51FA", mode: "free-canvas", promptPreset: "\u4F60\u662F\u8D34\u7EB8\u8BBE\u8BA1\u5E08\u3002\u751F\u6210\u6709\u767D\u8FB9\u3001\u8868\u60C5\u660E\u786E\u3001\u52A8\u4F5C\u5938\u5F20\u3001\u8F6E\u5ED3\u5E72\u51C0\u7684\u8D34\u7EB8\u56FE\uFF0C\u9002\u5408\u900F\u660E\u5E95\u5BFC\u51FA\u3002", pipeline: "\u89D2\u8272\u52A8\u4F5C -> \u8D34\u7EB8\u56FE -> \u62A0\u56FE -> \u4E0B\u8F7D" }, { id: "acrylic-stand", category: "\u5468\u8FB9\u8BBE\u8BA1", label: "\u4E9A\u514B\u529B\u724C", hint: "\u7AD9\u724C\u4E3B\u56FE\u3001\u5E95\u5EA7\u3001\u8F6E\u5ED3\u6E05\u695A", mode: "free-canvas", promptPreset: "\u4F60\u662F\u4E9A\u514B\u529B\u7ACB\u724C\u8BBE\u8BA1\u5E08\u3002\u751F\u6210\u5B8C\u6574\u7AD9\u59FF\u89D2\u8272\u3001\u6E05\u6670\u5916\u8F6E\u5ED3\u3001\u53EF\u5207\u5272\u8FB9\u7F18\u548C\u7B80\u6D01\u5E95\u5EA7\u8BBE\u8BA1\u3002", pipeline: "\u89D2\u8272\u4E3B\u56FE -> \u7ACB\u724C\u6784\u56FE -> \u5207\u5272\u8FB9\u7F18 -> \u4E0B\u8F7D" }], wi = [{ id: "three-d", label: "3D \u89D2\u8272", hint: "\u7ACB\u4F53\u3001\u5E72\u51C0\u3001\u53EF\u505A\u52A8\u753B\u8D44\u4EA7" }, { id: "anime", label: "\u65E5\u7CFB\u52A8\u753B", hint: "\u6E05\u6670\u7EBF\u7A3F\u3001\u8D5B\u7490\u7490\u8272\u5757" }, { id: "ip-cute", label: "IP Q\u7248", hint: "\u53EF\u7231\u6BD4\u4F8B\u3001\u5F3A\u8BB0\u5FC6\u70B9" }, { id: "guofeng", label: "\u56FD\u98CE", hint: "\u4E1C\u65B9\u670D\u9970\u3001\u67D4\u548C\u7B14\u89E6" }, { id: "game-cg", label: "\u6E38\u620F CG", hint: "\u7CBE\u81F4\u88C5\u5907\u3001\u89D2\u8272\u6D77\u62A5\u611F" }, { id: "realistic", label: "AI \u771F\u4EBA", hint: "\u5199\u5B9E\u4EBA\u50CF\u3001\u5546\u4E1A\u89D2\u8272\u7167" }, { id: "european", label: "\u6B27\u7F8E\u63D2\u753B", hint: "\u539A\u6D82\u3001\u620F\u5267\u5149\u5F71" }, { id: "kid-story", label: "\u7ED8\u672C\u98CE", hint: "\u6E29\u67D4\u3001\u4F4E\u9F84\u3001\u6545\u4E8B\u4E66\u8D28\u611F" }, { id: "ink-line", label: "\u94A2\u7B14\u7EBF\u7A3F", hint: "\u9ED1\u7EBF\u8F6E\u5ED3\u3001\u540E\u7EED\u53EF\u4E0A\u8272" }, { id: "brand-mascot", label: "\u54C1\u724C\u5409\u7965\u7269", hint: "\u7B80\u6D01\u3001\u53EF\u6CE8\u518C\u3001\u53EF\u5EF6\u5C55" }], li = [{ id: "12", label: "\u7EA6 12 \u79D2", seconds: 12 }, { id: "15", label: "\u7EA6 15 \u79D2", seconds: 15 }, { id: "30", label: "\u7EA6 30 \u79D2", seconds: 30 }, { id: "60", label: "\u7EA6 60 \u79D2", seconds: 60 }], Il = ["\u4E2D\u6587", "\u82F1\u6587", "\u4E2D\u82F1\u53CC\u8BED", "\u65E0\u5BF9\u767D"], di = [{ id: "grid", label: "\u5BAB\u683C\u56FE\u5206\u955C" }, { id: "multi-image", label: "\u591A\u56FE\u53C2\u8003" }, { id: "fpv", label: "FPV \u4E00\u955C\u5230\u5E95" }, { id: "manual", label: "\u624B\u6413\u63D0\u793A\u8BCD" }], Sl = [4, 5, 6, 8, 9];
function Pl(n) {
  return /无对白|none/i.test(n) ? "none" : /中英|双语|bilingual/i.test(n) ? "bilingual" : /英|en/i.test(n) ? "en" : "zh";
}
function $l(n) {
  return n >= 60 ? "long" : n >= 30 ? "medium" : "short";
}
function $i(n) {
  return n >= 60 ? 5 : n >= 30 ? 3 : 2;
}
function Ni(n) {
  return n.durationSeconds >= 60 ? "5-8" : n.durationSeconds >= 30 ? "3-5" : "2-4";
}
function JiarenRuntimeBeatMinimum(n) {
  return n.durationSeconds >= 60 ? 8 : n.durationSeconds >= 30 ? 5 : 4;
}
function Qn(n) {
  const i = $i(n.durationSeconds);
  const base = n.durationSeconds >= 60 ? `\u957F\u89C6\u9891\u751F\u4EA7\u89C4\u5219\uFF1A\u672C\u7247\u5DF2\u9009\u62E9\u300C${n.durationLabel}\u300D\uFF0C\u7F16\u5267\u548C\u5206\u955C\u5FC5\u987B\u6309\u81F3\u5C11 ${n.durationSeconds} \u79D2\u603B\u65F6\u957F\u8BBE\u8BA1\uFF1B\u5267\u672C\u5EFA\u8BAE\u8986\u76D6 ${i} \u4E2A\u4EE5\u4E0A\u8FDE\u7EED\u620F\u5267\u6BB5\u843D\uFF0C\u573A\u666F\u6570\u91CF\u4EE5\u5267\u672C\u771F\u5B9E\u5730\u70B9/\u65F6\u6BB5\u4E3A\u51C6\uFF0C\u7981\u6B62\u4E3A\u51D1\u65F6\u957F\u65B0\u589E\u672A\u51FA\u73B0\u5730\u70B9\u3002` : n.durationSeconds >= 30 ? `\u77ED\u89C6\u9891\u751F\u4EA7\u89C4\u5219\uFF1A\u672C\u7247\u76EE\u6807\u7EA6 ${n.durationSeconds} \u79D2\uFF0C\u5267\u672C\u548C\u5206\u955C\u8981\u8986\u76D6\u5B8C\u6574\u7247\u957F\uFF1B\u573A\u666F\u8BBE\u8BA1\u53EA\u7EE7\u627F\u5267\u672C\u771F\u5B9E\u5730\u70B9/\u65F6\u6BB5\u3002` : `\u77ED\u7247\u751F\u4EA7\u89C4\u5219\uFF1A\u672C\u7247\u76EE\u6807\u7EA6 ${n.durationSeconds} \u79D2\uFF0C\u5267\u672C\u3001\u573A\u666F\u548C\u5206\u955C\u4FDD\u6301\u7D27\u51D1\u3002`;
  return `${base}\u5206\u955C\u65F6\u95F4\u7801\u5FC5\u987B\u8FDE\u7EED\u8986\u76D6\u5168\u7247\uFF1B\u5982\u679C\u6700\u7EC8\u89C6\u9891\u6A21\u578B\u662F Seedance 2.0\uFF0C\u6BCF\u4E2A\u751F\u6210\u4EFB\u52A1\u4F7F\u7528 4-15 \u79D2\u5185\u4EFB\u610F\u6574\u6570\uFF08\u6216 -1 \u667A\u80FD\u65F6\u957F\uFF09\uFF0C\u4E0D\u518D\u9650\u5B9A 5/10 \u79D2\u6863\u4F4D\u3002`;
}
function Nl(n) {
  return n.language === "none" ? "\u7981\u6B62\u751F\u6210\u5BF9\u767D\uFF1B\u5982\u9700\u58F0\u97F3\uFF0C\u53EA\u80FD\u751F\u6210\u73AF\u5883\u58F0\u3001\u52A8\u4F5C\u97F3\u6548\u3001\u65E0\u6B4C\u8BCD BGM\u3002" : n.language === "en" ? "\u6240\u6709\u65C1\u767D\u3001\u5BF9\u767D\u3001\u5C4F\u5E55\u6587\u5B57\u4E0E\u7528\u6237\u53EF\u8BFB\u6587\u6848\u5FC5\u987B\u4F7F\u7528\u82F1\u6587\u3002" : n.language === "bilingual" ? "\u65C1\u767D\u3001\u5BF9\u767D\u548C\u7528\u6237\u53EF\u8BFB\u6587\u6848\u5141\u8BB8\u4E2D\u82F1\u53CC\u8BED\uFF0C\u4F46\u5FC5\u987B\u4FDD\u6301\u540C\u4E00\u955C\u5934\u5185\u8BED\u4E49\u4E00\u81F4\u3002" : "\u6240\u6709\u65C1\u767D\u3001\u5BF9\u767D\u3001\u5C4F\u5E55\u6587\u5B57\u4E0E\u7528\u6237\u53EF\u8BFB\u6587\u6848\u5FC5\u987B\u5B8C\u5168\u4F7F\u7528\u4E2D\u6587\u3002";
}
function so(n) {
  return /高燃|燃|史诗|力量|冲突|紧张|动作|热血/i.test(n) ? "fast-paced action, dynamic camera movement, high energy, strong impact cuts" : /温暖|治愈|温柔|光芒|清新/i.test(n) ? "gentle camera movement, warm emotional pacing, soft transitions, stable grading" : /悬疑|暗|惊悚/i.test(n) ? "controlled suspense pacing, tense camera movement, dramatic shadows, slow reveal" : "cinematic camera movement, clear visual rhythm, coherent shot continuity";
}
function co(n) {
  return ["FPV \u6C89\u6D78\u5F0F\u8DEF\u7EBF Skill \u53EA\u5728\u5206\u955C/\u89C6\u9891\u9636\u6BB5\u751F\u6548\uFF1B\u7F16\u5267\u9636\u6BB5\u53EA\u63D0\u4F9B\u5267\u60C5\u548C\u573A\u666F\u7D20\u6750\u3002", "\u5148\u786E\u5B9A\u6444\u50CF\u673A\u8EAB\u4EFD\uFF1A\u4F4E\u7A7A\u7A7F\u884C\u955C\u5934\u3001\u624B\u6301\u4E3B\u89C2\u89C6\u89D2\u3001\u673A\u8F66/\u65E0\u4EBA\u673A/\u89D2\u8272\u80A9\u90E8\u8DDF\u62CD\u7B49\uFF0C\u53EA\u9009\u4E00\u79CD\u7269\u7406\u53EF\u884C\u8EAB\u4EFD\u3002", "\u6BCF\u4E2A\u955C\u5934\u5FC5\u987B\u5199\u6E05\u8D77\u70B9\u3001\u7ECF\u8FC7\u7684\u505C\u9760\u70B9\u3001\u7EC8\u70B9\u3001\u955C\u5934\u9AD8\u5EA6\u3001\u901F\u5EA6\u53D8\u5316\u3001\u8F6C\u5411\u65B9\u5F0F\u548C\u7ED5\u8FC7\u7684\u969C\u788D\u7269\u3002", "\u7528\u7A7A\u95F4\u8DEF\u7EBF\u7EC4\u7EC7\u753B\u9762\uFF1A\u4ECE\u5165\u53E3\u8FDB\u5165\uFF0C\u7ECF\u8FC7 2-4 \u4E2A\u53EF\u89C1\u5730\u6807\u6216\u52A8\u4F5C\u8282\u70B9\uFF0C\u518D\u62B5\u8FBE\u7EC8\u70B9\uFF1B\u4E0D\u8981\u53EA\u5806\u6C1B\u56F4\u8BCD\u3002", "\u5982\u679C\u9700\u8981\u8DEF\u7EBF\u8F85\u52A9\uFF0C\u53EA\u5141\u8BB8\u5728\u5206\u955C\u89C4\u5212\u6587\u5B57\u91CC\u51FA\u73B0\u7F16\u53F7\u70B9\u6216\u7EA2\u7EBF\u8DEF\u5F84\uFF1B\u6700\u7EC8\u56FE\u50CF\u548C\u89C6\u9891\u63D0\u793A\u8BCD\u5FC5\u987B\u660E\u786E\u5220\u9664\u7EA2\u7EBF\u3001\u7BAD\u5934\u3001\u7F16\u53F7\u3001UI \u548C\u5B57\u5E55\u3002", "FPV \u4E0D\u80FD\u7834\u574F\u89D2\u8272\u8840\u7EDF\u548C\u98CE\u683C\u9501\uFF1A\u4EBA\u7269\u8138\u3001\u4F53\u578B\u3001\u670D\u88C5\u3001\u573A\u666F\u7F8E\u672F\u5FC5\u987B\u7EE7\u627F\u4E0A\u6E38\u8D44\u4EA7\u3002", n ? nn(n) : ""].filter(Boolean).join(`
`);
}
function Ul(n) {
  return /星辰高中|异能校园|林空|异世界高中|超能力.*高中|高中.*异能|科学.*异能|理科.*反制/i.test(n);
}
function $a(n) {
  var b, m;
  const i = n.replace(/\s+/g, " ").trim(), c = ((b = i.match(/(?:主角|主人公|男主|女主|角色|人物|名字|名叫|叫做|叫)\s*(?:是|为|叫|叫做|名叫|：|:)?\s*([一-龥A-Za-z][一-龥A-Za-z0-9·]{1,7})/)) == null ? void 0 : b[1]) ?? ((m = i.match(/([一-龥A-Za-z][一-龥A-Za-z0-9·]{1,7})\s*(?:是|作为|成为).{0,8}(?:主角|主人公|男主|女主)/)) == null ? void 0 : m[1]);
  if (!c) return "\u4E3B\u89D2";
  const u = De(c);
  return /^(一个|一名|一位|我的|这个|那个|高中生|学生|少年|少女|男孩|女孩|角色|人物|主角|主人公)$/i.test(u || c) || !u ? "\u4E3B\u89D2" : u;
}
function Ui(n = "") {
  const i = n.replace(/[【】《》「」『』"'“”]/g, "").replace(/（[^）]*(?:内心|OS|旁白|独白|低声|高声|画外|字幕)[^）]*）/gi, "").replace(/\([^)]*(?:inner|voice|os|narration|subtitle)[^)]*\)/gi, "").trim();
  return !!(!i || /^(?:zero|hero|rider|driver|os)$/i.test(i) || /^(?:零|ZERO|时空|内心|内心OS|OS|旁白|独白|画外音|字幕|骑手|司机|男骑手|女骑手|机车男|机车女|主干道|赛博城|城市|道路|镜头|场景|动作|对白|台词|低声|高声|空气|尘埃|底噪|引擎|车流|灯光|霓虹|提示|警示|画面)$/.test(i) || /^(?:单膝跪地|跪地|蹲下|站立|坐下|奔跑|跑步|骑行|驾驶|狂飙|追逐|转身|回头|低头|抬头|凝视|注视|看向|推近|拉远|特写|近景|中景|远景|全景|空镜|运镜|机位|焦段|景深)$/.test(i) || /^[一-龥]{2,4}(?:背负|双手|手持|持剑|持刀|握剑|握刀|站立|立于|立在|走向|冲向|奔向|转身|回头|抬头|低头|凝视|注视|看向|挥剑|拔剑|出剑|挥刀|拔刀|跪地|单膝|飞身|跃起|杀向|战斗)/.test(i));
}
function lo(n) {
  return n.replace(/[【】《》「」『』"'“”]/g, "").replace(/^(?:道具|载具|车辆|武器|物件|物品|装备|资产|名称|名字)\s*[:：、-]?\s*/i, "").trim().slice(0, 24);
}
function po(n) {
  return /机车|摩托|车辆|汽车|跑车|卡车|货车|飞船|飞车|列车|电车|自行车|motorcycle|motorbike|bike|vehicle|car|truck|spaceship/i.test(n) ? "vehicle" : /刀|剑|枪|炮|弓|矛|武器|weapon|sword|gun|blade|rifle/i.test(n) ? "weapon" : /道具|装备|书包|手机|项链|戒指|徽章|头盔|护目镜|面具|钥匙|课本|prop|gear|helmet|mask|bag/i.test(n) ? "prop" : "object";
}
function Ca(n = "", i = "", c = "") {
  const u = [n, i, c].filter(Boolean).join(" ");
  if (!u.trim()) return false;
  if (/的(?:机车|摩托|车辆|汽车|武器|装备|道具|书包|手机|头盔|面具|项链|戒指|课本)/.test(u) || /(?:机车|摩托|车辆|汽车|跑车|飞车|飞船|武器|道具|装备|头盔|书包|motorcycle|motorbike|vehicle|prop|weapon)\s*(?:资产|设定|设计|参考|图|卡|锁定)?$/i.test(u)) return true;
  const b = /人|男|女|少年|少女|男孩|女孩|青年|骑手|司机|学生|老师|博士|主角|反派|角色|人物|protagonist|character|rider|driver|boy|girl|man|woman/i.test(u);
  return /机车|摩托|车辆|汽车|跑车|飞车|飞船|武器|刀|剑|枪|道具|装备|头盔|书包|手机|项链|戒指|课本|motorcycle|motorbike|bike|vehicle|car|weapon|prop|helmet|bag/i.test(u) && !b;
}
function pi(n, i = "") {
  const c = n && typeof n == "object" ? n : { name: String(n || i) }, u = (E, me = "") => {
    for (const Z of E) {
      const H = c[Z];
      if (typeof H == "string" && H.trim()) return H.trim();
      if (typeof H == "number" || typeof H == "boolean") return String(H);
    }
    return me;
  }, b = u(["name", "title", "asset_name", "vehicle_name", "prop_name"], i || "\u5173\u952E\u9053\u5177"), m = u(["description", "bio", "role", "summary", "usage"], ""), A = u(["appearance", "lineage", "consistency", "visual", "design"], m || b), P = [b, m, A].join(" "), S = po(P), B = lo(b) || (S === "vehicle" ? "\u4E3B\u8F7D\u5177" : S === "weapon" ? "\u5173\u952E\u6B66\u5668" : "\u5173\u952E\u9053\u5177");
  return { name: B, type: S, description: m || `${B}\uFF0C\u4F5C\u4E3A\u72EC\u7ACB\u7D20\u6750\u4FDD\u5B58\uFF0C\u4E0D\u8FDB\u5165\u89D2\u8272\u56FE\u751F\u6210\u3002`, appearance: A || m || B, imageUrl: u(["imageUrl", "image_url", "url"], ""), prompt: u(["image_prompt", "imagePrompt", "prompt"], "") };
}
function Bl(...n) {
  const i = /* @__PURE__ */ new Map();
  return n.flatMap((c) => c ?? []).forEach((c) => {
    const u = lo(c.name);
    if (!u && !c.appearance && !c.description) return;
    const b = { ...c, name: u || (c.type === "vehicle" ? "\u4E3B\u8F7D\u5177" : c.type === "weapon" ? "\u5173\u952E\u6B66\u5668" : "\u5173\u952E\u9053\u5177"), type: c.type || po(`${c.name} ${c.description} ${c.appearance}`), description: c.description || c.appearance || u, appearance: c.appearance || c.description || u }, m = `${b.type}:${b.name}`.toLowerCase(), A = i.get(m);
    i.set(m, A ? { ...A, ...b, imageUrl: b.imageUrl || A.imageUrl, prompt: b.prompt || A.prompt } : b);
  }), Array.from(i.values()).slice(0, 8);
}
function $t(n) {
  const i = n.propAssets ?? [];
  return i.length === 0 ? "" : i.map((c, u) => {
    const b = c.type === "vehicle" ? "vehicle" : c.type === "weapon" ? "weapon" : c.type === "prop" ? "prop" : "object";
    return `${u + 1}. ${b} asset "${c.name}": ${$([c.description, c.appearance].filter(Boolean).join(" / "), 420)}. This is not a human character and must not be rendered as a second protagonist.`;
  }).join(`
`);
}
function zr(e) {
  return (Array.isArray(e) ? e : []).map((item) => typeof item === "string" ? item.trim() : String(item || "").trim()).filter(Boolean);
}
function JiarenNormalizeFountainSceneBlocks(script) {
  let text = zr(script).join("\n\n").replace(/\r/g, "").trim();
  if (!text) return [];
  text = text.replace(/^(\s*(?:\u5185\u666f\/\u5916\u666f|\u5185\u666f|\u5916\u666f))\s*[\uFF1A:\u3002\uFF0E]\s*/gim, "$1. ").replace(/^(\s*(?:INT\.\/EXT|INT|EXT))\s*[\uFF1A:]\s*/gim, "$1. ");
  const headingPattern = /^\s*(?:\u5185\u666f\/\u5916\u666f|\u5185\u666f|\u5916\u666f|INT\.\/EXT|INT|EXT)\.\s*[^\n]+/gim, headings = Array.from(text.matchAll(headingPattern));
  if (!headings.length) return zr(script);
  return headings.map((match, index) => text.slice(match.index || 0, index + 1 < headings.length ? headings[index + 1].index : text.length).trim()).filter(Boolean);
}
function JiarenLiterarySourceText(source) {
  return String(source || "").replace(/\r/g, "").split(/\n+/).map((line) => line.trim()).filter(Boolean).filter((line) => !/^\s*(?:第[一二三四五六七八九十百千\d]+章\s*)?[^\n]{0,28}\s+\d+\s*字(?:\s+[ⓒ©].*)?$/i.test(line)).filter((line) => !/[ⓒ©]\s*\d{4}|\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日/.test(line)).join("\n").trim();
}
function JiarenIsLiterarySource(source) {
  const text = JiarenLiterarySourceText(source), compact = text.replace(/\s/g, "");
  if (compact.length < 500) return false;
  const structuredCount = (text.match(/(?:^|\n)\s*(?:场景|场次|BEAT[-_\s]*\d+|内景\/外景\.|内景\.|外景\.|INT\.\/EXT\.|INT\.|EXT\.)/gim) || []).length;
  return structuredCount < 3 || /第[一二三四五六七八九十百千\d]+章|\d+\s*字|小说|正文/.test(String(source || ""));
}
function JiarenBuildLiteraryEvents(source) {
  if (!JiarenIsLiterarySource(source)) return [];
  const sentences = JiarenLiterarySourceText(source).split(/\n+/).flatMap((line) => line.match(/[^。！？!?…]+(?:[。！？!?]+|…{2,})?[”’"]?/g) || [line]).map((item) => item.trim()).filter((item) => item && !/^第[一二三四五六七八九十百千\d]+章(?:\s+.*)?$/.test(item));
  const events = [], transition = /^(?:梦见|忽然|突然|这时|随着|世界[，,]?亮了|下方|剧烈|惊鸿一瞥|哗啦|默默地回忆|观察|于是|期间|直到|看着|不知过了多久|蓦然|甚至|接着|次日|清晨|黄昏|夜晚|月亮|太阳)/;
  let current = "";
  const flush = () => {
    const value = current.trim();
    if (value) events.push(value);
    current = "";
  };
  for (const sentence of sentences) {
    if (current && /^[“「『\"']/.test(sentence)) flush();
    if (current && current.length >= 48 && transition.test(sentence)) flush();
    if (current && current.length + sentence.length > 90) flush();
    current += `${current ? " " : ""}${sentence}`;
    if (current.length >= 65 && /[。！？!?…””]$/.test(sentence)) flush();
  }
  flush();
  if (events.length > 1 && events[events.length - 1].length < 45) events[events.length - 2] += ` ${events.pop()}`;
  return events.slice(0, 40).map((excerpt, index) => ({ id: `E${String(index + 1).padStart(2, "0")}`, excerpt }));
}
function JiarenMinimumProductionBeatCount(source) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return 0;
  const sourceLength = JiarenLiterarySourceText(source).replace(/\s/g, "").length;
  return Math.min(events.length, Math.max(8, Math.min(18, Math.ceil(sourceLength / 160))));
}
function JiarenMinimumLiterarySceneCount(source) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return 0;
  return Math.min(12, Math.max(5, Math.ceil(events.length / 4)));
}
function JiarenChineseBigrams(text) {
  const normalized = String(text || "").replace(/[^\u4E00-\u9FFF]/g, ""), ignored = new Set(["陆江", "江仙", "一个", "自己", "这个", "什么", "觉得", "这样", "已经", "没有", "可以", "正在", "起来", "东西", "开始", "不断", "仿佛", "于是", "时候", "只是", "他们", "到了", "一样", "所有", "世界", "原文", "故事", "画面", "场景", "角色", "镜头"]), seen = /* @__PURE__ */ new Set();
  for (let index = 0; index < normalized.length - 1; index += 1) {
    const term = normalized.slice(index, index + 2);
    if (!ignored.has(term)) seen.add(term);
  }
  return Array.from(seen);
}
function JiarenVisibleLiteraryCoverage(source, script) {
  const events = JiarenBuildLiteraryEvents(source), screenplay = zr(script).join("\n");
  if (!events.length) return { events, coveredIds: [], missingIds: [], minimumCovered: 0, missingBuckets: [] };
  const signals = events.map((event) => ({ id: event.id, terms: JiarenChineseBigrams(event.excerpt) })), frequency = /* @__PURE__ */ new Map();
  signals.forEach((event) => new Set(event.terms).forEach((term) => frequency.set(term, (frequency.get(term) || 0) + 1)));
  const coveredIds = [], missingIds = [];
  for (const event of signals) {
    const terms = event.terms.sort((left, right) => (frequency.get(left) || 0) - (frequency.get(right) || 0)).slice(0, 5), requiredHits = terms.length >= 4 ? 2 : 1, hits = terms.filter((term) => screenplay.includes(term)).length;
    (hits >= requiredHits ? coveredIds : missingIds).push(event.id);
  }
  const buckets = Array.from({ length: 4 }, (_2, index) => events.slice(Math.floor(index * events.length / 4), Math.floor((index + 1) * events.length / 4))), missingBuckets = buckets.map((bucket, index) => ({ index, eventIds: bucket.map((event) => event.id), covered: bucket.filter((event) => coveredIds.includes(event.id)).length })).filter((bucket) => bucket.covered < Math.min(2, bucket.eventIds.length));
  return { events, coveredIds, missingIds, minimumCovered: Math.max(8, Math.ceil(events.length * 0.55)), missingBuckets };
}
function JiarenLiteraryCoverageContract(source) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return "";
  const minimumBeats = JiarenMinimumProductionBeatCount(source), minimumScenes = JiarenMinimumLiterarySceneCount(source);
  return [
    "LONG-FORM NOVEL ADAPTATION SKILL: the source is confirmed chapter material, never a short idea to summarize. Source facts override the selected runtime; create a chapter/episode plan rather than deleting events.",
    `Cover all ${events.length} source events below. One location may reuse one text-only setting identity, but events with independent action, dialogue, time change, causal change, or visual reveal must remain separate beats.`,
    ...events.map((event) => `${event.id}: ${event.excerpt}`),
    `Return at least ${minimumScenes} separate Fountain scene blocks and at least ${minimumBeats} production beats. The scene blocks must cover the beginning, middle, late development, and chapter ending; do not stop after the dream or the first awakening. Return source_event_coverage:[{event_id:\"E01\",beat_ids:[\"BEAT-01\"],preserved_fact:\"actual source fact kept in this beat\"}] for every event ID. Do not use montage, mood, or narration as a replacement for multiple source events.`
  ].join("\n");
}
function JiarenFountainScreenplayContract() {
  return [
    "SCREENPLAY FORMAT CONTRACT (SK-FTV-011): script[] is the professional screenplay shown to the user; production_beats[] is hidden machine-facing production data.",
    "Every script[] item must be a complete Fountain scene block. Start with INT./EXT./INT./EXT. for English, or 内景./外景./内景/外景. for Chinese, followed by location and time, for example: 外景. 原始森林边缘小河 - 清晨.",
    "Write present-tense, active, camera-visible action in short paragraphs. Use character-name lines followed by dialogue. Convert source thoughts that matter to the story into 角色名（画外音） / CHARACTER (V.O.); never delete them merely because prose thoughts are not directly filmable.",
    "Do not expose BEAT IDs, scene IDs, camera directions, lens terms, shot sizes, sound_seed, source-event mappings, JSON labels, or production notes inside script[]. Do not use 场景1： as a slugline. Use transitions sparingly and only when dramatically necessary.",
    "Put all technical handoff data in production_beats[]. Every beat must include beat_id, scene_id, scene_heading, location, time, weather, source_event_ids, story_event, visible_action, dialogue_or_vo, camera_seed, sound_seed, and continuity_out. Multiple beats may point to the same Fountain scene and the same text-only setting identity.",
    "Scene count and beat count are different: scene blocks follow real changes of location/time, while production beats preserve every causal action, reveal, dialogue, memory, time change, recurring prop, and emotional turn from the source. Never compress a chapter into a few mood scenes."
  ].join("\n");
}
function JiarenProductionBeatRecords(payload) {
  const raw = Array.isArray(payload) ? payload : payload?.production_beats ?? payload?.productionBeats ?? payload?.production_handoff?.beats ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    const record = item && typeof item == "object" ? item : { story_event: String(item || "") };
    const rawId = String(record.beat_id ?? record.beatId ?? record.id ?? ""), number = rawId.match(/\d{1,3}/)?.[0], beatId = number ? `BEAT-${String(Number(number)).padStart(2, "0")}` : `BEAT-${String(index + 1).padStart(2, "0")}`;
    return { ...record, beat_id: beatId };
  }).filter((record) => Object.values(record).some((value) => String(value || "").trim()));
}
function JiarenProductionBeatText(record) {
  const sourceEventIds = Array.isArray(record.source_event_ids ?? record.sourceEventIds) ? record.source_event_ids ?? record.sourceEventIds : String(record.source_event_ids ?? record.sourceEventIds ?? "").split(/[,，\s]+/).filter(Boolean);
  return [
    record.beat_id,
    `scene_id: ${record.scene_id ?? record.sceneId ?? ""}`,
    `scene_heading: ${record.scene_heading ?? record.sceneHeading ?? ""}`,
    `location: ${record.location ?? ""}`,
    `time: ${record.time ?? ""}`,
    `weather: ${record.weather ?? ""}`,
    sourceEventIds.length ? `source_event_ids: ${sourceEventIds.join(", ")}` : "",
    `story_event: ${record.story_event ?? record.storyEvent ?? record.summary ?? ""}`,
    `visible_action: ${record.visible_action ?? record.visibleAction ?? record.action ?? ""}`,
    `dialogue_or_vo: ${record.dialogue_or_vo ?? record.dialogueOrVo ?? record.dialogue ?? ""}`,
    `camera_seed: ${record.camera_seed ?? record.cameraSeed ?? ""}`,
    `sound_seed: ${record.sound_seed ?? record.soundSeed ?? ""}`,
    `continuity_out: ${record.continuity_out ?? record.continuityOut ?? record.transition ?? ""}`
  ].filter((line) => !/:\s*$/.test(line)).join("\n");
}
function JiarenBuildScriptSettingManifest(productionBeatsValue, scriptValue) {
  const beats = JiarenProductionBeatRecords(productionBeatsValue);
  const script = Array.isArray(scriptValue) ? scriptValue : JiarenStringArray(scriptValue);
  const source = beats.length ? beats : script.map((text, index) => {
    const context = JiarenSluglineContext(script, index);
    return { beat_id: `BEAT-${String(index + 1).padStart(2, "0")}`, scene_id: `scene-${String(index + 1).padStart(2, "0")}`, scene_heading: context.heading, location: context.location, time: context.time, story_event: text, visible_action: text };
  });
  const groups = [], byKey = /* @__PURE__ */ new Map();
  source.forEach((entry, index) => {
    const record = JiarenAsObject(entry), context = JiarenSluglineContext(script, Math.min(index, Math.max(0, script.length - 1))), sceneId = JiarenFirstString(record, ["scene_id", "sceneId"], `scene-${String(index + 1).padStart(2, "0")}`), heading = JiarenFirstString(record, ["scene_heading", "sceneHeading", "heading"], context.heading), location = JiarenFirstString(record, ["location", "place", "setting"], context.location), time = JiarenFirstString(record, ["time", "time_of_day", "timeOfDay"], context.time), key = sceneId || `${location}|${time}`;
    let group = byKey.get(key);
    if (!group) {
      group = { id: sceneId, sceneId, title: heading || [location, time].filter(Boolean).join(" · ") || `剧本场景 ${groups.length + 1}`, location, sourceLocation: location, timeOfDay: time, sourceTime: time, weather: JiarenFirstString(record, ["weather", "atmosphere"], "按剧本"), environment: JiarenFirstString(record, ["environment", "description", "setting_detail"], heading || location), description: JiarenFirstString(record, ["environment", "description", "setting_detail"], heading || location), lighting: JiarenFirstString(record, ["lighting", "light"], `${time || "当前时段"}的剧本光线`), camera: JiarenFirstString(record, ["camera_seed", "cameraSeed", "camera"]), transitionOut: JiarenFirstString(record, ["continuity_out", "continuityOut", "transition"]), sourceBeatIds: [], beatRefs: [], visualAnchors: [], sceneVariants: [] };
      groups.push(group), byKey.set(key, group);
    }
    const beatId = JiarenFirstString(record, ["beat_id", "beatId", "id"], `BEAT-${String(index + 1).padStart(2, "0")}`), storyEvent = JiarenFirstString(record, ["story_event", "storyEvent", "summary", "text"]), visibleAction = JiarenFirstString(record, ["visible_action", "visibleAction", "action"], storyEvent), camera = JiarenFirstString(record, ["camera_seed", "cameraSeed", "camera"], group.camera), transitionOut = JiarenFirstString(record, ["continuity_out", "continuityOut", "transition"], group.transitionOut);
    group.sourceBeatIds.push(beatId), group.beatRefs.push(beatId), group.sceneVariants.push({ id: `${sceneId}-beat-${String(group.sceneVariants.length + 1).padStart(2, "0")}`, variantId: `${sceneId}-beat-${String(group.sceneVariants.length + 1).padStart(2, "0")}`, sceneId, title: beatId, sourceBeatIds: [beatId], beatSummary: [storyEvent, visibleAction].filter(Boolean).join("；"), camera, spatialFraming: camera }), group.transitionOut = transitionOut || group.transitionOut;
  });
  return groups;
}
function JiarenSluglineContext(script, index) {
  const blocks = zr(script), block = blocks[Math.min(index, Math.max(0, blocks.length - 1))] || "", match = block.match(/^\s*((?:内景\/外景|内景|外景|INT\.\/EXT|INT|EXT)\.\s*([^\n-—]+?)\s[-—]\s*([^\n]+))/i);
  const heading = match?.[1]?.trim() || "外景. 按原剧本场景 - 连续", location = match?.[2]?.trim() || "按原剧本场景", time = match?.[3]?.trim() || "连续";
  return { heading, location, time, block };
}
function JiarenReconcileProductionPayload(source, script, payload) {
  const base = payload && typeof payload == "object" ? payload : {}, events = JiarenBuildLiteraryEvents(source), sourceProfile = JiarenSourceProfile(source), sourceUnits = JiarenStructuredSourceUnits(source, sourceProfile), existing = JiarenProductionBeatRecords(base), structuredMinimum = sourceProfile.type === "storyboard" ? Math.max(sourceProfile.storyboardHeadingCount, sourceProfile.timecodeCount, sourceUnits.length) : sourceProfile.type === "screenplay" ? Math.max(sourceProfile.sceneHeadingCount, sourceUnits.length) : 0, minimum = events.length ? JiarenMinimumProductionBeatCount(source) : structuredMinimum, total = Math.max(existing.length, minimum, script.length ? 1 : 0);
  if (events.length) return { ...base, script, production_beats: existing };
  if (!total) return base;
  const productionBeats = Array.from({ length: total }, (_2, index) => {
    const record = existing[index] || {}, sceneIndex = script.length ? Math.min(script.length - 1, Math.floor(index * script.length / total)) : 0, context = JiarenSluglineContext(script, sceneIndex), sourceUnit = sourceUnits.length ? sourceUnits[Math.min(sourceUnits.length - 1, Math.floor(index * sourceUnits.length / total))] : "", recordText = record.story_event ?? record.storyEvent ?? record.visible_action ?? record.visibleAction ?? "", text = String(recordText || sourceUnit || context.block || "按剧本继续推进").trim();
    return {
      ...record,
      beat_id: record.beat_id ?? record.beatId ?? `BEAT-${String(index + 1).padStart(2, "0")}`,
      scene_id: record.scene_id ?? record.sceneId ?? `scene-${String(sceneIndex + 1).padStart(2, "0")}`,
      scene_heading: record.scene_heading ?? record.sceneHeading ?? context.heading,
      location: record.location ?? context.location,
      time: record.time ?? context.time,
      weather: record.weather ?? "按原剧本",
      source_event_ids: record.source_event_ids ?? record.sourceEventIds ?? (event ? [event.id] : []),
      story_event: text,
      visible_action: record.visible_action ?? record.visibleAction ?? record.action ?? text,
      dialogue_or_vo: record.dialogue_or_vo ?? record.dialogueOrVo ?? record.dialogue ?? "按剧本对白或画外音",
      camera_seed: record.camera_seed ?? record.cameraSeed ?? "依据可见动作拆镜，保持角色、道具与地点连续",
      sound_seed: record.sound_seed ?? record.soundSeed ?? "依据原文环境声与关键动作设计",
      continuity_out: record.continuity_out ?? record.continuityOut ?? record.transition ?? "承接下一原文事件"
    };
  });
  const sourceEventCoverage = events.map((event, index) => ({ event_id: event.id, beat_ids: [productionBeats[Math.min(productionBeats.length - 1, Math.floor(index * productionBeats.length / events.length))].beat_id], preserved_fact: event.excerpt }));
  return { ...base, script, production_beats: productionBeats, source_event_coverage: sourceEventCoverage.length ? sourceEventCoverage : base.source_event_coverage };
}
function JiarenValidateScreenplayFormat(script, payload) {
  const screenplay = zr(script).join("\n\n"), productionBeats = JiarenProductionBeatRecords(payload), issues = [];
  const sceneBlocks = zr(script), sluglinePattern = /^\s*(?:内景\/外景|内景|外景|INT\.\/EXT|INT|EXT)\.\s*[^\n]+\s[-—]\s*[^\n]+/i;
  if (!sceneBlocks.length || sceneBlocks.some((block) => !sluglinePattern.test(block))) issues.push("script[] 每个场景块都必须以规范的内景./外景. 地点 - 时间场标开头");
  if (/\bBEAT[-_\s]*\d{1,3}\b/i.test(screenplay)) issues.push("script[] 暴露了后台 BEAT 编号");
  if (!productionBeats.length) issues.push("缺少供场景和分镜使用的 production_beats[]");
  if (productionBeats.some((record) => !String(record.scene_id ?? record.sceneId ?? "").trim() || !String(record.location ?? "").trim() || !String(record.time ?? "").trim() || !String(record.story_event ?? record.storyEvent ?? "").trim() || !String(record.visible_action ?? record.visibleAction ?? record.action ?? "").trim() || !String(record.camera_seed ?? record.cameraSeed ?? "").trim() || !String(record.sound_seed ?? record.soundSeed ?? "").trim() || !String(record.continuity_out ?? record.continuityOut ?? record.transition ?? "").trim())) issues.push("production_beats[] 缺少场景、动作、镜头、声音或连续性字段");
  if (!issues.length) return;
  return { message: `剧本专业格式未通过：${issues.join("；")}。` };
}
function JiarenValidateScriptArtifact(source, script, payload) {
  return JiarenValidateLiteraryCoverage(source, script, payload) || JiarenValidateStructuredSourceFidelity(source, script, payload) || JiarenValidateScreenplayFormat(script, payload);
}
function JiarenStructuredDialogueAnchors(source) {
  const text = JiarenNormalizeSourceText(source), anchors = [];
  for (const match of text.matchAll(/[\u201C\u300C\u300E"]([^"\u201D\u300D\u300F]{2,160})["\u201D\u300D\u300F]/g)) anchors.push(String(match[1] || "").trim());
  for (const line of text.split(/\n/)) {
    const match = line.trim().match(/^(?!\s*(?:\u573A\u666F|\u573A\u6B21|\u5206\u955C|\u955C\u5934|\u5730\u70B9|\u65F6\u95F4|\u52A8\u4F5C|\u5BF9\u767D|\u65C1\u767D|\u97F3\u6548|\u8F6C\u573A|\u666F\u522B|\u8FD0\u955C|\u673A\u4F4D|\u7126\u6BB5|\u65F6\u957F)\s*[:：])\s*[^:：\n]{1,20}\s*[:：]\s*(.{2,160})$/i);
    if (match) anchors.push(match[1].trim());
  }
  const seen = /* @__PURE__ */ new Set();
  return anchors.filter((anchor) => {
    const key = JiarenNovelCompactAnchorText(anchor);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 40);
}
function JiarenValidateStructuredSourceFidelity(source, script, payload) {
  const profile = JiarenSourceProfile(source);
  if (profile.type !== "screenplay" && profile.type !== "storyboard") return;
  const scriptText = zr(script).join("\n\n"), sourceLength = profile.compactLength, scriptLength = scriptText.replace(/\s/g, "").length, minimumLength = Math.min(sourceLength, Math.max(60, Math.ceil(sourceLength * (profile.type === "screenplay" ? 0.45 : 0.3)))), dialogueAnchors = JiarenStructuredDialogueAnchors(source), missingDialogues = dialogueAnchors.filter((anchor) => !JiarenNovelAnchorCovered(anchor, scriptText)), allowedMissingDialogues = Math.floor(dialogueAnchors.length * 0.1), expectedUnits = profile.type === "storyboard" ? Math.max(profile.storyboardHeadingCount, profile.timecodeCount) : profile.sceneHeadingCount, actualBeats = JiarenProductionBeatRecords(payload).length, tooShort = scriptLength < minimumLength, tooFewBeats = expectedUnits > 0 && actualBeats < expectedUnits;
  if (!tooShort && missingDialogues.length <= allowedMissingDialogues && !tooFewBeats) return;
  return { message: `${JiarenSourceTypeLabel(profile.type)}\u4FDD\u771F\u6821\u9A8C\u672A\u901A\u8FC7\uFF1A\u6B63\u6587 ${scriptLength}/${minimumLength} \u5B57\uFF1B\u539F\u5BF9\u767D\u7F3A\u5931 ${missingDialogues.length}/${dialogueAnchors.length}\uFF1B\u5236\u4F5C\u8282\u62CD ${actualBeats}/${expectedUnits || 1}\u3002\u8BF7\u4FDD\u7559\u539F\u5267\u60C5\u987A\u5E8F\u3001\u52A8\u4F5C\u3001\u5BF9\u767D\u548C\u955C\u5934\u4FE1\u606F\uFF0C\u53EA\u505A\u5FC5\u8981\u7684 Fountain \u683C\u5F0F\u6574\u7406\u3002` };
}
function JiarenValidateLiteraryCoverage(source, script, payload) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return;
  const scriptText = (Array.isArray(script) ? script : []).join("\n"), sourceLength = JiarenLiterarySourceText(source).replace(/\s/g, "").length, screenplayLength = scriptText.replace(/\s/g, "").length, minimumScreenplayLength = Math.min(sourceLength, Math.max(500, Math.ceil(sourceLength * 0.5))), tooCompressed = screenplayLength < minimumScreenplayLength, beatIds = new Set(Array.from(scriptText.matchAll(/\bBEAT[-_\s]*(\d{1,3})\b/gi)).map((match) => `BEAT-${String(Number(match[1])).padStart(2, "0")}`));
  JiarenProductionBeatRecords(payload).forEach((record) => beatIds.add(record.beat_id));
  const rawCoverage = payload?.source_event_coverage ?? payload?.event_coverage ?? payload?.quality_check?.source_event_coverage ?? [], entries = Array.isArray(rawCoverage) ? rawCoverage : rawCoverage && typeof rawCoverage == "object" ? Object.entries(rawCoverage).map(([event_id, beat_ids]) => ({ event_id, beat_ids })) : [];
  const covered = new Set(), invalidBeatRefs = [];
  for (const entry of entries) {
    const eventId = String(entry?.event_id || entry?.eventId || entry?.id || "").toUpperCase().match(/E\d{2}/)?.[0], refs = Array.isArray(entry?.beat_ids ?? entry?.beatIds ?? entry?.beats) ? entry.beat_ids ?? entry.beatIds ?? entry.beats : String(entry?.beat_ids ?? entry?.beatIds ?? entry?.beats ?? "").match(/BEAT[-_\s]*\d{1,3}/gi) || [];
    if (!eventId || !refs.length) continue;
    const normalizedRefs = refs.map((ref) => {
      const number = String(ref).match(/\d{1,3}/)?.[0];
      return number ? `BEAT-${String(Number(number)).padStart(2, "0")}` : "";
    }).filter(Boolean);
    if (normalizedRefs.some((ref) => beatIds.has(ref))) covered.add(eventId);
    else invalidBeatRefs.push(eventId);
  }
  const missingEventIds = events.map((event) => event.id).filter((id) => !covered.has(id)), minimumBeats = JiarenMinimumProductionBeatCount(source), semanticCoverage = JiarenVisibleLiteraryCoverage(source, script), sceneCount = (scriptText.match(/^\s*(?:内景\/外景|内景|外景|INT\.\/EXT|INT|EXT)\./gim) || []).length, minimumScenes = JiarenMinimumLiterarySceneCount(source), tooFewScenes = sceneCount < minimumScenes, semanticIncomplete = semanticCoverage.coveredIds.length < semanticCoverage.minimumCovered || semanticCoverage.missingBuckets.length > 0;
  if (!missingEventIds.length && !invalidBeatRefs.length && beatIds.size >= minimumBeats && !tooCompressed && !tooFewScenes && !semanticIncomplete) return;
  const missingRange = semanticCoverage.missingBuckets.map((bucket) => `第${bucket.index + 1}段`).join("、") || "无";
  return { events, missingEventIds, invalidBeatRefs, minimumBeats, actualBeats: beatIds.size, tooCompressed, sceneCount, minimumScenes, semanticCoverage, semanticIncomplete, message: `长篇原文改编仍不够完整：剧本文本约 ${screenplayLength} 字，至少需要约 ${minimumScreenplayLength} 字；场景 ${sceneCount}/${minimumScenes}；制作节拍 ${beatIds.size}/${minimumBeats}；正文剧情锚点 ${semanticCoverage.coveredIds.length}/${semanticCoverage.minimumCovered}，缺少${missingRange}。请补写被遗漏的中后段事件，不要只扩写开头。` };
}
function JiarenLiteraryRepairPrompt(source, review, currentDraft = "") {
  return [
    "The previous draft failed the screenplay quality gate. Repair it against the original chapter and return one complete replacement JSON artifact. Keep correct material from the current draft, fill the missing middle/late/ending events, and do not restart with a different premise.",
    review.message,
    currentDraft ? `CURRENT DRAFT TO REPAIR:\n${currentDraft}` : "",
    JiarenLiteraryCoverageContract(source),
    JiarenFountainScreenplayContract()
  ].filter(Boolean).join("\n\n");
}
function JiarenNormalizeSourceText(source) {
  return String(source || "").replace(/^\uFEFF/, "").replace(/[\u0000\u200B\u200C\u200D\u2060]/g, "").replace(/\u00A0/g, " ").replace(/[\u2028\u2029]/g, "\n").replace(/\r\n?/g, "\n").replace(/^\s*```(?:fountain|screenplay|script|text|markdown|md)?\s*$/gim, "").replace(/[ \t]+\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim();
}
function JiarenSourceProfile(source) {
  const text = JiarenNormalizeSourceText(source), compactLength = text.replace(/\s/g, "").length, lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const sceneHeadingPattern = /^(?:#{1,6}\s*)?(?:\d+[.、)）]\s*)?(?:(?:\u5185\u666F\s*[\/／]\s*\u5916\u666F|\u5185\u666F|\u5916\u666F)\s*[.。．:：\-—]|(?:INT\s*\.?\s*[\/／]\s*EXT|INT|EXT)\s*[.。:：\-—]|(?:\u573A\u666F|\u573A\u6B21)\s*[A-Za-z0-9\u4E00-\u9FFF]+\s*[:：.。\-—]|\u7B2C\s*[A-Za-z0-9\u4E00-\u9FFF]+\s*\u573A\s*[:：.。\-—]|(?:\d+(?:\s*[-\uFF0D—_.．]\s*\d+)+)\s*(?:(?:\u65E5|\u591C|\u6668|\u6E05\u6668|\u9ECE\u660E|\u9EC4\u660F|\u8FDE\u7EED)\s*)?(?:\u5185\u5916|\u5916\u5185|\u5185|\u5916)(?:\s|[-—:：]|$)|(?:[\[【]\s*)?(?:SCENE|\u573A\u666F|\u573A\u6B21|\u573A)\s*[#_\-]?[A-Za-z0-9\u4E00-\u9FFF]+(?:\s*[\]】])?\s+.{0,40}?(?:(?:\u65E5|\u591C|\u6668|\u6E05\u6668|\u9ECE\u660E|\u9EC4\u660F|\u8FDE\u7EED)(?:\s*(?:\u5185\u5916|\u5916\u5185|\u5185|\u5916))?)\s*$)/i;
  const storyboardHeadingPattern = /^(?:#{1,6}\s*)?(?:\u5206\u955C|\u955C\u5934|SHOT|SCENE\s*SHOT|S)\s*[-_#]?[A-Za-z0-9\u4E00-\u9FFF]+\s*[:：.。\-—]?/i;
  const dialogueCuePattern = /^(?!\s*(?:\u573A\u666F|\u573A\u6B21|\u5206\u955C|\u955C\u5934|\u5730\u70B9|\u65F6\u95F4|\u52A8\u4F5C|\u5BF9\u767D|\u65C1\u767D|\u97F3\u6548|\u8F6C\u573A|\u666F\u522B|\u8FD0\u955C|\u673A\u4F4D|\u7126\u6BB5|\u65F6\u957F|TITLE|AUTHOR)\s*[:：])\s*@?[\u4E00-\u9FFFA-Za-z][\u4E00-\u9FFFA-Za-z0-9_\-\u00B7 ]{0,15}(?:\uFF08[^\uFF09]{0,14}\uFF09|\([^)]{0,14}\))?\s*[:：]\s*\S+/i;
  const sceneHeadingCount = lines.filter((line) => sceneHeadingPattern.test(line)).length;
  const storyboardHeadingCount = lines.filter((line) => storyboardHeadingPattern.test(line)).length;
  const storyboardFieldCount = lines.filter((line) => /^(?:\u666F\u522B|\u8FD0\u955C|\u673A\u4F4D|\u7126\u6BB5|\u753B\u9762|\u6784\u56FE|\u65F6\u957F|\u65F6\u95F4\u7801|TIMECODE|CAMERA|LENS|PROMPT)\s*[:：]/i.test(line)).length;
  const storyboardTableHeaderCount = lines.filter((line) => (line.match(/(?:\u955C\u53F7|\u955C\u5934\u53F7|\u666F\u522B|\u753B\u9762|\u53F0\u8BCD|\u5BF9\u767D|\u65F6\u957F|\u8FD0\u955C|\u673A\u4F4D|\u7126\u6BB5|PROMPT)/gi) || []).length >= 3).length;
  const storyboardTableRowCount = storyboardTableHeaderCount ? lines.filter((line) => /^\|?\s*(?:SHOT\s*)?\d{1,4}\s*(?:\||,|，|\t|\s{2,})/i.test(line)).length : 0;
  const timecodeCount = (text.match(/(?:\b\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?\s*(?:-->|-|—)\s*(?:\b\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?/g) || []).length;
  const dialogueCueCount = lines.filter((line) => dialogueCuePattern.test(line)).length;
  const screenplayFieldCount = lines.filter((line) => /^(?:\u52A8\u4F5C|\u5BF9\u767D|\u65C1\u767D|\u5185\u5FC3|OS|V\.O\.|\u97F3\u6548|SFX|\u8F6C\u573A|\u5730\u70B9|\u65F6\u95F4)\s*[:：]/i.test(line)).length;
  const actionMarkerCount = lines.filter((line) => /^(?:\u25B3|\u25B2|\u25CF|\u25CB|\u203B)\s*\S+/.test(line)).length;
  let characterCueCount = 0;
  for (let index = 0; index < lines.length - 1; index += 1) {
    const line = lines[index], next = lines[index + 1];
    if (line.length <= 20 && /^(?:@?[\u4E00-\u9FFFA-Z][\u4E00-\u9FFFA-Z0-9_\-\u00B7 ]{0,15})(?:\uFF08[^\uFF09]{0,14}\uFF09|\([^)]{0,14}\))?$/.test(line) && !sceneHeadingPattern.test(line) && !storyboardHeadingPattern.test(line) && next.length > 1 && !/[:：]$/.test(next)) characterCueCount += 1;
  }
  const chapterMarkerCount = lines.filter((line) => /^(?:#{1,6}\s*)?\u7B2C[\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341\u767E\u5343\u4E07\d]+[\u7AE0\u8282\u56DE\u5377\u90E8\u7BC7](?:\s+.*)?$/.test(line)).length;
  const proseLineCount = lines.filter((line) => line.length >= 28 && (line.match(/[\u3002\uFF01\uFF1F\u201C\u201D]/g) || []).length >= 2 && !sceneHeadingPattern.test(line) && !storyboardHeadingPattern.test(line)).length;
  const explicitBriefCount = lines.filter((line) => /^(?:\u8BF7|\u6211\u60F3|\u6211\u8981|\u9700\u8981|\u5236\u4F5C|\u751F\u6210|\u8981\u6C42|\u98CE\u683C|\u65F6\u957F|\u753B\u5E45|\u53C2\u8003|\u5E2E\u6211)/.test(line)).length;
  const screenplayScore = sceneHeadingCount * 5 + dialogueCueCount * 2 + characterCueCount * 2 + screenplayFieldCount * 2 + actionMarkerCount;
  const storyboardScore = storyboardHeadingCount * 5 + storyboardFieldCount * 2 + timecodeCount * 4 + storyboardTableHeaderCount * 8 + storyboardTableRowCount * 2;
  const novelScore = chapterMarkerCount * 6 + proseLineCount * 2 + ((text.match(/[\u201C\u201D\u300C\u300D\u300E\u300F]/g) || []).length >= 4 ? 2 : 0);
  let type = "brief";
  if (storyboardTableHeaderCount >= 1 && storyboardTableRowCount >= 1 || storyboardHeadingCount >= 2 || storyboardScore >= 9 && storyboardScore > screenplayScore + 1) type = "storyboard";
  else if (sceneHeadingCount >= 1 && (dialogueCueCount + characterCueCount + screenplayFieldCount + actionMarkerCount >= 1) || screenplayScore >= 8 || explicitBriefCount === 0 && dialogueCueCount >= 3 && actionMarkerCount >= 1) type = "screenplay";
  else if (!(explicitBriefCount >= 2 && chapterMarkerCount === 0) && compactLength >= 500 && (chapterMarkerCount > 0 || proseLineCount >= 3 && compactLength >= 1e3 || novelScore >= 8)) type = "novel";
  return { type, text, compactLength, sceneHeadingCount, storyboardHeadingCount, storyboardFieldCount, storyboardTableHeaderCount, storyboardTableRowCount, timecodeCount, dialogueCueCount, characterCueCount, screenplayFieldCount, actionMarkerCount, chapterMarkerCount, proseLineCount, explicitBriefCount };
}
function JiarenSourceTypeLabel(source) {
  const type = typeof source === "string" && /^(?:novel|screenplay|storyboard|brief)$/.test(source) ? source : JiarenSourceProfile(source).type;
  return { novel: "\u5C0F\u8BF4/\u7AE0\u8282", screenplay: "\u5DF2\u6210\u578B\u5267\u672C", storyboard: "\u5206\u955C/\u955C\u5934\u7A3F", brief: "\u6545\u4E8B\u60F3\u6CD5/\u5236\u4F5C\u8981\u6C42" }[type] || "\u6587\u672C";
}
function JiarenSourceTypeContract(source) {
  const profile = JiarenSourceProfile(source);
  if (profile.type === "novel") return "INPUT ROUTING: NOVEL/CHAPTER. Adapt every source event in order. The source-event ledger and novel fidelity gate are mandatory.";
  if (profile.type === "screenplay") return "INPUT ROUTING: EXISTING SCREENPLAY. Preserve its plot order, scene facts, actions, character names, dialogue, narration, and ending. Only normalize nonstandard headings into Fountain and add hidden production_beats. Do not reinterpret it as a novel, pitch, or new-writing request; do not replace or embellish its premise.";
  if (profile.type === "storyboard") return "INPUT ROUTING: STORYBOARD/SHOT LIST. Preserve shot order, timecodes, visible actions, dialogue, camera intent, locations, and recurring assets. Build a confirmable Fountain screenplay scaffold plus one production beat per source shot; do not discard the supplied shot design or run the novel gate.";
  return "INPUT ROUTING: STORY IDEA/PRODUCTION BRIEF. Develop only the explicit characters, premise, setting, style, action, and restrictions supplied by the director. Missing creative details may be proposed, but must not contradict the request.";
}
function JiarenStructuredSourceUnits(source, profile = JiarenSourceProfile(source)) {
  const text = profile.text;
  if (!text) return [];
  if (profile.type === "storyboard") {
    if (profile.storyboardTableHeaderCount) {
      const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean), header = lines.find((line) => (line.match(/(?:\u955C\u53F7|\u955C\u5934\u53F7|\u666F\u522B|\u753B\u9762|\u53F0\u8BCD|\u5BF9\u767D|\u65F6\u957F|\u8FD0\u955C|\u673A\u4F4D|\u7126\u6BB5|PROMPT)/gi) || []).length >= 3), rows = lines.filter((line) => /^\|?\s*(?:SHOT\s*)?\d{1,4}\s*(?:\||,|，|\t|\s{2,})/i.test(line));
      if (header && rows.length) return rows.map((row) => `${header}\n${row}`);
    }
    const marker = /^\s*(?:#{1,6}\s*)?(?:(?:\u5206\u955C|\u955C\u5934|SHOT|SCENE\s*SHOT|S)\s*[-_#]?[A-Za-z0-9\u4E00-\u9FFF]+\s*[:：.。\-—]?)/gim, matches = Array.from(text.matchAll(marker));
    if (matches.length) return matches.map((match, index) => text.slice(match.index || 0, index + 1 < matches.length ? matches[index + 1].index : text.length).trim()).filter(Boolean);
  }
  if (profile.type === "screenplay") {
    const marker = /^\s*(?:#{1,6}\s*)?(?:\d+[.、)）]\s*)?(?:(?:\u5185\u666F\s*[\/／]\s*\u5916\u666F|\u5185\u666F|\u5916\u666F)\s*[.。．:：\-—]|(?:INT\s*\.?\s*[\/／]\s*EXT|INT|EXT)\s*[.。:：\-—]|(?:\u573A\u666F|\u573A\u6B21)\s*[A-Za-z0-9\u4E00-\u9FFF]+\s*[:：.。\-—]|\u7B2C\s*[A-Za-z0-9\u4E00-\u9FFF]+\s*\u573A\s*[:：.。\-—]|(?:\d+(?:\s*[-\uFF0D—_.．]\s*\d+)+)\s*(?:(?:\u65E5|\u591C|\u6668|\u6E05\u6668|\u9ECE\u660E|\u9EC4\u660F|\u8FDE\u7EED)\s*)?(?:\u5185\u5916|\u5916\u5185|\u5185|\u5916)(?:\s|[-—:：]|$)|(?:[\[【]\s*)?(?:SCENE|\u573A\u666F|\u573A\u6B21|\u573A)\s*[#_\-]?[A-Za-z0-9\u4E00-\u9FFF]+(?:\s*[\]】])?\s+.{0,40}?(?:(?:\u65E5|\u591C|\u6668|\u6E05\u6668|\u9ECE\u660E|\u9EC4\u660F|\u8FDE\u7EED)(?:\s*(?:\u5185\u5916|\u5916\u5185|\u5185|\u5916))?)\s*$)/gim, matches = Array.from(text.matchAll(marker));
    if (matches.length) return matches.map((match, index) => text.slice(match.index || 0, index + 1 < matches.length ? matches[index + 1].index : text.length).trim()).filter(Boolean);
  }
  return text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
}
JiarenLiterarySourceText = function(source) {
  return JiarenNormalizeSourceText(source).split(/\n+/).map((line) => line.trim()).filter(Boolean).filter((line) => !/^\s*\u7B2C[\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341\u767E\u5343\u4E07\d]+[\u7AE0\u8282\u56DE\u5377\u90E8\u7BC7][^\n]{0,24}\s*$/.test(line)).filter((line) => !/(?:\u00A9|\u24D2|copyright|\b20\d{2}\b.*(?:\u5E74|-|\.)|\d{3,6}\s*\u5B57)/i.test(line) || line.length > 90).join("\n").trim();
};
JiarenIsLiterarySource = function(source) {
  return JiarenSourceProfile(source).type === "novel";
};
JiarenBuildLiteraryEvents = function(source) {
  if (!JiarenIsLiterarySource(source)) return [];
  const sentences = JiarenLiterarySourceText(source).split(/\n+/).flatMap((line) => line.match(/[^。！？!?；;…]+(?:[。！？!?；;]+|…{1,})?[”"」』]?/g) || [line]).map((item) => item.trim()).filter((item) => item && !/^\s*\u7B2C[\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341\u767E\u5343\u4E07\d]+[\u7AE0\u8282\u56DE]/.test(item));
  const events = [], transition = /^(?:\u68A6|\u5FFD|\u7A81|\u8FD9\u65F6|\u968F\u7740|\u4E16\u754C|\u4E0B\u65B9|\u5267\u70C8|\u60CA\u9E3F|\u9ED8\u9ED8|\u89C2\u5BDF|\u4E8E\u662F|\u671F\u95F4|\u76F4\u5230|\u770B\u7740|\u4E0D\u77E5|\u84E6\u7136|\u751A\u81F3|\u63A5\u7740|\u6B21\u65E5|\u6E05\u6668|\u9EC4\u660F|\u591C\u665A|\u6708\u4EAE|\u592A\u9633|\u54D7\u5566|\u54A3\u5F53)/;
  let current = "";
  const flush = () => {
    const value = current.trim();
    if (value) events.push(value);
    current = "";
  };
  for (const sentence of sentences) {
    if (current && /^[\u201C\u300C\u300E"']/.test(sentence)) flush();
    if (current && current.length >= 48 && transition.test(sentence)) flush();
    if (current && current.length + sentence.length > 110) flush();
    current += `${current ? " " : ""}${sentence}`;
    if (current.length >= 70 && /[。！？!?；;…'"”」』]$/.test(sentence)) flush();
  }
  flush();
  if (events.length > 1 && events[events.length - 1].length < 45) events[events.length - 2] += ` ${events.pop()}`;
  return events.slice(0, 60).map((excerpt, index) => ({ id: `E${String(index + 1).padStart(2, "0")}`, excerpt }));
};
JiarenMinimumProductionBeatCount = function(source) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return 0;
  const sourceLength = JiarenLiterarySourceText(source).replace(/\s/g, "").length;
  return Math.min(events.length, Math.max(10, Math.min(24, Math.ceil(sourceLength / 120))));
};
JiarenMinimumLiterarySceneCount = function(source) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return 0;
  const sourceLength = JiarenLiterarySourceText(source).replace(/\s/g, "").length;
  return Math.min(12, Math.max(4, Math.ceil(events.length / 7), Math.ceil(sourceLength / 500)));
};
function JiarenNovelDurationContract(source, runtimeParams = {}) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return "";
  const seconds = Number(runtimeParams?.durationSeconds || 0), minimumBeats = JiarenMinimumProductionBeatCount(source), minimumScenes = JiarenMinimumLiterarySceneCount(source), label = seconds >= 60 ? "60-second / >=1min episode target" : seconds >= 30 ? "30-second short target" : "short preview target";
  return [
    "NOVEL DURATION OVERRIDE: selected duration is only a target pacing setting, never permission to summarize, skip, reorder, or replace source events.",
    `Selected duration: ${seconds || "model default"} seconds (${label}). If the full chapter cannot truthfully fit inside this target, output a complete chapter/episode plan and let production split or extend it; do not force deletion to satisfy the duration.`,
    `For this source keep at least ${minimumScenes} Fountain scene blocks, ${minimumBeats} production beats, and source_event_coverage for all ${events.length} source events. Source fidelity is higher priority than target_seconds.`,
    "Do not stop after the first two scenes. Preserve beginning, middle, late development, and ending state. Do not invent school/campus/superpower replacement plots."
  ].join("\n");
}
function JiarenNovelShotMinimum(source, sceneCount = 0, scriptCount = 0, runtimeParams = {}) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return 0;
  const seconds = Number(runtimeParams?.durationSeconds || 0), minimumBeats = JiarenMinimumProductionBeatCount(source), eventBased = Math.ceil(events.length / 2), beatBased = Math.ceil(minimumBeats * 0.65), durationFloor = seconds >= 60 ? 14 : seconds >= 30 ? 10 : 8;
  return Math.min(24, Math.max(durationFloor, sceneCount, scriptCount, eventBased, beatBased));
}
JiarenChineseBigrams = function(text) {
  const normalized = String(text || "").replace(/[^\u4E00-\u9FFF]/g, ""), ignored = new Set(["\u4E00\u4E2A", "\u81EA\u5DF1", "\u8FD9\u4E2A", "\u4EC0\u4E48", "\u89C9\u5F97", "\u8FD9\u6837", "\u5DF2\u7ECF", "\u6CA1\u6709", "\u53EF\u4EE5", "\u6B63\u5728", "\u8D77\u6765", "\u4E1C\u897F", "\u5F00\u59CB", "\u4E0D\u65AD", "\u4EFF\u4F5B", "\u4E8E\u662F", "\u65F6\u5019", "\u53EA\u662F", "\u4ED6\u4EEC", "\u5230\u4E86", "\u4E00\u6837", "\u6240\u6709", "\u4E16\u754C", "\u539F\u6587", "\u6545\u4E8B", "\u753B\u9762", "\u573A\u666F", "\u89D2\u8272", "\u955C\u5934"]), seen = /* @__PURE__ */ new Set();
  for (let index = 0; index < normalized.length - 1; index += 1) {
    const term = normalized.slice(index, index + 2);
    if (!ignored.has(term)) seen.add(term);
  }
  return Array.from(seen);
};
function JiarenNovelEventSignalMap(events) {
  const frequency = /* @__PURE__ */ new Map(), rawSignals = events.map((event) => ({ id: event.id, terms: JiarenChineseBigrams(event.excerpt) }));
  rawSignals.forEach((event) => new Set(event.terms).forEach((term) => frequency.set(term, (frequency.get(term) || 0) + 1)));
  return new Map(rawSignals.map((event) => {
    const terms = event.terms.sort((left, right) => (frequency.get(left) || 0) - (frequency.get(right) || 0)).slice(0, 9), requiredHits = terms.length >= 7 ? 3 : terms.length >= 4 ? 2 : 1;
    return [event.id, { terms, requiredHits }];
  }));
}
function JiarenNovelEventCovered(event, targetText, signalMap) {
  const target = String(targetText || ""), compactSource = JiarenNovelCompactAnchorText(event?.excerpt), compactTarget = JiarenNovelCompactAnchorText(target);
  if (!compactSource || compactTarget.includes(compactSource)) return true;
  const signal = signalMap.get(event.id) || { terms: JiarenChineseBigrams(event.excerpt).slice(0, 9), requiredHits: 2 }, hits = signal.terms.filter((term) => target.includes(term)).length;
  return hits >= Math.min(signal.requiredHits, signal.terms.length);
}
function JiarenNovelCoreEventIds(events) {
  const core = /* @__PURE__ */ new Set(), corePattern = /[\u201C\u201D\u300C\u300D\u300E\u300F\u300A\u300B]|(?:\u8FD9\u65F6|\u968F\u7740|\u76F4\u5230|\u4E0D\u77E5|\u84E6\u7136|\u6B21\u65E5|\u6E05\u6668|\u9EC4\u660F|\u591C\u665A|\u68A6|\u9192|\u5FFD\u7136|\u7A81\u7136|\u770B\u89C1|\u53D1\u73B0|\u542C\u5230|\u56DE\u5FC6|\u843D|\u5760|\u649E|\u7FFB|\u788E|\u53D8|\u6B7B|\u6302\u4E86|\u5012\u5F71|\u5149\u67F1|\u5492\u6587|\u6D41\u5149|\u6708\u534E|\u6C14\u6D41|\u6BEB\u5149|\u955C)/;
  events.forEach((event, index) => {
    if (index === 0 || index === events.length - 1 || corePattern.test(event.excerpt)) core.add(event.id);
  });
  for (let index = 0; index < 5 && events.length; index += 1) core.add(events[Math.min(events.length - 1, Math.floor(index * (events.length - 1) / 4))].id);
  return Array.from(core);
}
JiarenVisibleLiteraryCoverage = function(source, script) {
  const events = JiarenBuildLiteraryEvents(source), screenplay = zr(script).join("\n");
  if (!events.length) return { events, coveredIds: [], missingIds: [], minimumCovered: 0, missingBuckets: [], coreEventIds: [], missingCoreIds: [] };
  const signalMap = JiarenNovelEventSignalMap(events);
  const coveredIds = [], missingIds = [];
  for (const event of events) (JiarenNovelEventCovered(event, screenplay, signalMap) ? coveredIds : missingIds).push(event.id);
  const buckets = Array.from({ length: 4 }, (_2, index) => events.slice(Math.floor(index * events.length / 4), Math.floor((index + 1) * events.length / 4))), missingBuckets = buckets.map((bucket, index) => ({ index, eventIds: bucket.map((event) => event.id), covered: bucket.filter((event) => coveredIds.includes(event.id)).length, required: Math.ceil(bucket.length * 0.85) })).filter((bucket) => bucket.eventIds.length && bucket.covered < bucket.required), coreEventIds = JiarenNovelCoreEventIds(events), missingCoreIds = coreEventIds.filter((id) => !coveredIds.includes(id));
  return { events, coveredIds, missingIds, minimumCovered: Math.ceil(events.length * 0.9), missingBuckets, coreEventIds, missingCoreIds };
};
function JiarenNovelCompactAnchorText(text) {
  return String(text || "").replace(/[^\u4E00-\u9FFF0-9A-Za-z]/g, "");
}
function JiarenNovelDialogueAnchors(source) {
  const text = JiarenLiterarySourceText(source), anchors = [];
  for (const match of text.matchAll(/[\u201C\u300C\u300E"]([^"\u201D\u300D\u300F]{2,160})["\u201D\u300D\u300F]/g)) {
    const value = String(match[1] || "").trim(), compact = JiarenNovelCompactAnchorText(value);
    if (compact.length >= 2 && !anchors.some((item) => JiarenNovelCompactAnchorText(item) === compact)) anchors.push(value);
  }
  return anchors.slice(0, 24);
}
function JiarenNovelNamedAnchors(source) {
  const text = JiarenLiterarySourceText(source), counts = /* @__PURE__ */ new Map();
  for (const title of text.match(/[\u300A][^\u300B]{2,40}[\u300B]/g) || []) counts.set(title, (counts.get(title) || 0) + 3);
  for (const match of text.matchAll(/([\u4E00-\u9FFF]{2,4})(?=(?:\u505A|\u60F3|\u770B|\u671B|\u53F9|\u82E6|\u559C|\u9ED8|\u8FC5|\u4EF0|\u8EBA|\u89C9|\u611F|\u5927|\u84E6|\u7279\u610F|\u5185\u5FC3|\uFF08))/g)) {
    const value = match[1];
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return Array.from(counts.entries()).filter(([value, count]) => JiarenNovelCompactAnchorText(value).length >= 2 && count >= 2).sort((left, right) => right[1] - left[1]).map(([value]) => value).slice(0, 10);
}
function JiarenNovelAnchorCovered(anchor, scriptText) {
  const source = JiarenNovelCompactAnchorText(anchor), target = JiarenNovelCompactAnchorText(scriptText);
  if (!source) return true;
  if (source.length <= 8) return target.includes(source);
  const head = source.slice(0, Math.min(8, Math.ceil(source.length * 0.35))), tail = source.slice(Math.max(0, source.length - Math.min(6, Math.ceil(source.length * 0.25))));
  return target.includes(source) || (target.includes(head) && target.includes(tail));
}
function JiarenNovelDeviationReport(source, scriptText) {
  const sourceText = JiarenNovelCompactAnchorText(source), targetText = JiarenNovelCompactAnchorText(scriptText), forbidden = ["\u661F\u8FB0\u9AD8\u4E2D", "\u6821\u56ED", "\u5F02\u80FD", "\u9B54\u529B", "\u8F6C\u5B66\u751F", "\u6797\u58A8", "\u82CF\u5FF5", "\u7AF9\u6797\u7EC3\u5251", "\u8FD9\u628A\u5251\u5C01\u5370", "\u53E4\u8001\u7684\u529B\u91CF"], inventedTerms = forbidden.filter((term) => targetText.includes(JiarenNovelCompactAnchorText(term)) && !sourceText.includes(JiarenNovelCompactAnchorText(term)));
  return { inventedTerms };
}
JiarenLiteraryCoverageContract = function(source) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return "";
  const minimumBeats = JiarenMinimumProductionBeatCount(source), minimumScenes = JiarenMinimumLiterarySceneCount(source);
  return [
    "SACRED SOURCE CONTRACT: this is a novel chapter adaptation. People, identities, relationships, quoted dialogue, inner monologue, objects, locations, chronology, cause/effect, reveals, and ending state are immutable.",
    "LONG-FORM NOVEL ADAPTATION SKILL: the source is confirmed chapter material, never a short idea to summarize. Source facts override the selected runtime; create a chapter/episode plan rather than deleting events.",
    `Cover all ${events.length} source events below. Adjacent events may share one production beat when they form one continuous action, but every event ID must be mapped and no causal event, dialogue, inner thought, time change, object reveal, or ending state may disappear.`,
    ...events.map((event) => `${event.id}: ${event.excerpt}`),
    `Return at least ${minimumScenes} separate Fountain scene blocks and at least ${minimumBeats} production beats. The scene blocks must cover the beginning, middle, late development, and chapter ending; do not stop after the dream or the first awakening. Return source_event_coverage:[{event_id:"E01",beat_ids:["BEAT-01"],preserved_fact:"actual source fact kept in this beat"}] for every event ID. Multiple adjacent event IDs may point to the same beat. Do not use montage, mood, or narration as a replacement for the event ledger.`,
    "Nebula helper scope: use cinematic screenplay language, rhythm checks, and self-review only after source fidelity is satisfied. Do not let any original-writing workflow rename the protagonist, swap premise, invent a school/superpower story, or compress the chapter into a teaser."
  ].join("\n");
};
JiarenValidateLiteraryCoverage = function(source, script, payload) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return;
  const scriptText = (Array.isArray(script) ? script : []).join("\n"), sourceLength = JiarenLiterarySourceText(source).replace(/\s/g, "").length, screenplayLength = scriptText.replace(/\s/g, "").length, minimumScreenplayLength = Math.min(sourceLength, Math.max(500, Math.ceil(sourceLength * 0.5))), tooCompressed = screenplayLength < minimumScreenplayLength, beatIds = new Set(Array.from(scriptText.matchAll(/\bBEAT[-_\s]*(\d{1,3})\b/gi)).map((match) => `BEAT-${String(Number(match[1])).padStart(2, "0")}`));
  JiarenProductionBeatRecords(payload).forEach((record) => beatIds.add(record.beat_id));
  const rawCoverage = payload?.source_event_coverage ?? payload?.event_coverage ?? payload?.quality_check?.source_event_coverage ?? [], entries = Array.isArray(rawCoverage) ? rawCoverage : rawCoverage && typeof rawCoverage == "object" ? Object.entries(rawCoverage).map(([event_id, beat_ids]) => ({ event_id, beat_ids })) : [], covered = new Set(), invalidBeatRefs = [];
  for (const entry of entries) {
    const eventId = String(entry?.event_id || entry?.eventId || entry?.id || "").toUpperCase().match(/E\d{2}/)?.[0], refs = Array.isArray(entry?.beat_ids ?? entry?.beatIds ?? entry?.beats) ? entry.beat_ids ?? entry.beatIds ?? entry.beats : String(entry?.beat_ids ?? entry?.beatIds ?? entry?.beats ?? "").match(/BEAT[-_\s]*\d{1,3}/gi) || [];
    if (!eventId || !refs.length) continue;
    const normalizedRefs = refs.map((ref) => {
      const number = String(ref).match(/\d{1,3}/)?.[0];
      return number ? `BEAT-${String(Number(number)).padStart(2, "0")}` : "";
    }).filter(Boolean);
    if (normalizedRefs.some((ref) => beatIds.has(ref))) covered.add(eventId);
    else invalidBeatRefs.push(eventId);
  }
  const missingEventIds = events.map((event) => event.id).filter((id) => !covered.has(id)), minimumBeats = JiarenMinimumProductionBeatCount(source), semanticCoverage = JiarenVisibleLiteraryCoverage(source, script), sceneCount = (scriptText.match(/^\s*(?:\u5185\u666F\/\u5916\u666F|\u5185\u666F|\u5916\u666F|INT\.\/EXT|INT|EXT)\./gim) || []).length, minimumScenes = JiarenMinimumLiterarySceneCount(source), tooFewScenes = sceneCount < minimumScenes, semanticIncomplete = semanticCoverage.coveredIds.length < semanticCoverage.minimumCovered || semanticCoverage.missingBuckets.length > 0, semanticHardIncomplete = semanticCoverage.coveredIds.length < Math.ceil(events.length * 0.55) || semanticCoverage.missingBuckets.length >= 2, dialogueAnchors = JiarenNovelDialogueAnchors(source), missingDialogues = dialogueAnchors.filter((anchor) => !JiarenNovelAnchorCovered(anchor, scriptText)), minimumDialogueCovered = dialogueAnchors.length ? Math.ceil(dialogueAnchors.length * 0.65) : 0, dialogueCovered = dialogueAnchors.length - missingDialogues.length, dialogueIncomplete = dialogueCovered < minimumDialogueCovered, missingNamedAnchors = JiarenNovelNamedAnchors(source).filter((anchor) => !JiarenNovelAnchorCovered(anchor, scriptText)), deviation = JiarenNovelDeviationReport(source, scriptText);
  if (!missingEventIds.length && !invalidBeatRefs.length && beatIds.size >= minimumBeats && !tooCompressed && !tooFewScenes && !semanticHardIncomplete && !dialogueIncomplete && !missingNamedAnchors.length && !deviation.inventedTerms.length) return;
  const missingRange = semanticCoverage.missingBuckets.map((bucket) => bucket.index + 1).join(", ") || "-";
  return { events, missingEventIds, invalidBeatRefs, minimumBeats, actualBeats: beatIds.size, tooCompressed, sceneCount, minimumScenes, semanticCoverage, semanticIncomplete, semanticHardIncomplete, missingDialogues, missingNamedAnchors, inventedTerms: deviation.inventedTerms, message: `\u5C0F\u8BF4\u6539\u7F16\u4ECD\u4E0D\u5B8C\u6574\uFF1A\u6B63\u6587 ${screenplayLength}/${minimumScreenplayLength} \u5B57\uFF1B\u573A\u6B21 ${sceneCount}/${minimumScenes}\uFF1B\u8282\u62CD ${beatIds.size}/${minimumBeats}\uFF1B\u539F\u6587\u4E8B\u4EF6 ${semanticCoverage.coveredIds.length}/${semanticCoverage.minimumCovered}\uFF1B\u8584\u5F31\u533A\u6BB5 ${missingRange}\uFF1B\u539F\u5BF9\u767D/\u72EC\u767D ${dialogueCovered}/${minimumDialogueCovered}\uFF1B\u7F3A\u5C11\u5173\u952E\u540D\u79F0 ${missingNamedAnchors.join(", ") || "-"}\uFF1B\u8DD1\u9898\u8BBE\u5B9A ${deviation.inventedTerms.join(", ") || "-"}\u3002` };
};
JiarenValidateLiteraryCoverage = function(source, script, payload) {
  const events = JiarenBuildLiteraryEvents(source);
  if (!events.length) return;
  const scriptText = (Array.isArray(script) ? script : []).join("\n"), sourceLength = JiarenLiterarySourceText(source).replace(/\s/g, "").length, screenplayLength = scriptText.replace(/\s/g, "").length, minimumScreenplayLength = Math.min(sourceLength, Math.max(700, Math.ceil(sourceLength * 0.6))), tooCompressed = screenplayLength < minimumScreenplayLength, productionBeats = JiarenProductionBeatRecords(payload), beatById = new Map(productionBeats.map((record, index) => [record.beat_id, { record, index, text: JiarenProductionBeatText(record) }])), beatIds = new Set(beatById.keys()), eventById = new Map(events.map((event) => [event.id, event])), signalMap = JiarenNovelEventSignalMap(events);
  const rawCoverage = payload?.source_event_coverage ?? payload?.event_coverage ?? payload?.quality_check?.source_event_coverage ?? [], entries = Array.isArray(rawCoverage) ? rawCoverage : rawCoverage && typeof rawCoverage == "object" ? Object.entries(rawCoverage).map(([event_id, beat_ids]) => ({ event_id, beat_ids })) : [], covered = /* @__PURE__ */ new Set(), invalidBeatRefs = [], mismatchedEventIds = [], mappedBeatIndexes = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const eventId = String(entry?.event_id || entry?.eventId || entry?.id || "").toUpperCase().match(/E\d{2}/)?.[0], refs = Array.isArray(entry?.beat_ids ?? entry?.beatIds ?? entry?.beats) ? entry.beat_ids ?? entry.beatIds ?? entry.beats : String(entry?.beat_ids ?? entry?.beatIds ?? entry?.beats ?? "").match(/BEAT[-_\s]*\d{1,3}/gi) || [];
    if (!eventId || !eventById.has(eventId) || !refs.length) continue;
    const normalizedRefs = refs.map((ref) => {
      const number = String(ref).match(/\d{1,3}/)?.[0];
      return number ? `BEAT-${String(Number(number)).padStart(2, "0")}` : "";
    }).filter(Boolean), validRefs = normalizedRefs.filter((ref) => beatById.has(ref));
    if (!validRefs.length) {
      invalidBeatRefs.push(eventId);
      continue;
    }
    const matchingRefs = validRefs.filter((ref) => {
      const beat = beatById.get(ref), declaredIds = Array.isArray(beat.record.source_event_ids ?? beat.record.sourceEventIds) ? beat.record.source_event_ids ?? beat.record.sourceEventIds : String(beat.record.source_event_ids ?? beat.record.sourceEventIds ?? "").toUpperCase().match(/E\d{2}/g) || [];
      return declaredIds.map((id) => String(id).toUpperCase()).includes(eventId) && JiarenNovelEventCovered(eventById.get(eventId), beat.text, signalMap);
    });
    if (matchingRefs.length) {
      covered.add(eventId);
      mappedBeatIndexes.set(eventId, Math.min(...matchingRefs.map((ref) => beatById.get(ref).index)));
    } else mismatchedEventIds.push(eventId);
  }
  const missingEventIds = events.map((event) => event.id).filter((id) => !covered.has(id)), outOfOrderEventIds = [], orderedIndexes = events.map((event) => ({ id: event.id, index: mappedBeatIndexes.get(event.id) })).filter((item) => Number.isInteger(item.index));
  let previousBeatIndex = -1;
  orderedIndexes.forEach((item) => {
    if (item.index < previousBeatIndex) outOfOrderEventIds.push(item.id);
    previousBeatIndex = Math.max(previousBeatIndex, item.index);
  });
  const minimumBeats = JiarenMinimumProductionBeatCount(source), semanticCoverage = JiarenVisibleLiteraryCoverage(source, script), sceneCount = (scriptText.match(/^\s*(?:\u5185\u666F\/\u5916\u666F|\u5185\u666F|\u5916\u666F|INT\.\/EXT|INT|EXT)\./gim) || []).length, minimumScenes = JiarenMinimumLiterarySceneCount(source), tooFewScenes = sceneCount < minimumScenes, semanticIncomplete = semanticCoverage.coveredIds.length < semanticCoverage.minimumCovered || semanticCoverage.missingBuckets.length > 0 || semanticCoverage.missingCoreIds.length > 0, dialogueAnchors = JiarenNovelDialogueAnchors(source), missingDialogues = dialogueAnchors.filter((anchor) => !JiarenNovelAnchorCovered(anchor, scriptText)), minimumDialogueCovered = dialogueAnchors.length ? Math.ceil(dialogueAnchors.length * 0.85) : 0, dialogueCovered = dialogueAnchors.length - missingDialogues.length, dialogueIncomplete = dialogueCovered < minimumDialogueCovered, missingNamedAnchors = JiarenNovelNamedAnchors(source).filter((anchor) => !JiarenNovelAnchorCovered(anchor, scriptText)), deviation = JiarenNovelDeviationReport(source, scriptText);
  if (!missingEventIds.length && !invalidBeatRefs.length && !mismatchedEventIds.length && !outOfOrderEventIds.length && beatIds.size >= minimumBeats && !tooCompressed && !tooFewScenes && !semanticIncomplete && !dialogueIncomplete && !missingNamedAnchors.length && !deviation.inventedTerms.length) return;
  const missingRange = semanticCoverage.missingBuckets.map((bucket) => bucket.index + 1).join(", ") || "-";
  return { events, missingEventIds, invalidBeatRefs, mismatchedEventIds, outOfOrderEventIds, minimumBeats, actualBeats: beatIds.size, tooCompressed, sceneCount, minimumScenes, semanticCoverage, semanticIncomplete, missingDialogues, missingNamedAnchors, inventedTerms: deviation.inventedTerms, message: `\u5C0F\u8BF4\u6539\u7F16\u672A\u901A\u8FC7\u5FE0\u5B9E\u5EA6\u95E8\u7981\uFF1A\u6B63\u6587 ${screenplayLength}/${minimumScreenplayLength} \u5B57\uFF1B\u573A\u6B21 ${sceneCount}/${minimumScenes}\uFF1B\u771F\u5B9E\u8282\u62CD ${beatIds.size}/${minimumBeats}\uFF1B\u53EF\u89C1\u539F\u6587\u4E8B\u4EF6 ${semanticCoverage.coveredIds.length}/${semanticCoverage.minimumCovered}\uFF1B\u7F3A\u5931\u6838\u5FC3\u4E8B\u4EF6 ${semanticCoverage.missingCoreIds.join(", ") || "-"}\uFF1B\u9519\u8BEF\u6620\u5C04 ${mismatchedEventIds.join(", ") || "-"}\uFF1B\u987A\u5E8F\u9519\u4F4D ${outOfOrderEventIds.join(", ") || "-"}\uFF1B\u8584\u5F31\u533A\u6BB5 ${missingRange}\uFF1B\u539F\u5BF9\u767D/\u72EC\u767D ${dialogueCovered}/${minimumDialogueCovered}\uFF1B\u7F3A\u5C11\u5173\u952E\u540D\u79F0 ${missingNamedAnchors.join(", ") || "-"}\uFF1B\u8DD1\u9898\u8BBE\u5B9A ${deviation.inventedTerms.join(", ") || "-"}\u3002` };
};
JiarenLiteraryRepairPrompt = function(source, review, currentDraft = "") {
  const missingIds = Array.from(/* @__PURE__ */ new Set([...(review?.missingEventIds || []), ...(review?.mismatchedEventIds || []), ...(review?.semanticCoverage?.missingCoreIds || []), ...(review?.semanticCoverage?.missingIds || [])])), eventById = new Map((review?.events || JiarenBuildLiteraryEvents(source)).map((event) => [event.id, event])), missingEvents = missingIds.map((id) => eventById.get(id)).filter(Boolean);
  return [
    "TARGETED CONTINUATION REPAIR: return a JSON patch containing ONLY the missing source events listed below. Do not repeat, rewrite, summarize, or replace correct scenes from the current draft. The application will merge this patch into the accepted draft at the original chronological positions.",
    'Patch JSON format: {"script":["complete Fountain scene blocks for missing events only"],"production_beats":[{"beat_id":"PATCH-01","scene_id":"scene-patch-01","scene_heading":"外景. 原文地点 - 连续","location":"原文地点","time":"连续","weather":"原文状态","source_event_ids":["E01"],"story_event":"missing source fact","visible_action":"camera-visible action","dialogue_or_vo":"source dialogue/voice-over","camera_seed":"camera clue","sound_seed":"sound clue","continuity_out":"chronological handoff"}],"source_event_coverage":[{"event_id":"E01","beat_ids":["PATCH-01"],"preserved_fact":"exact source fact"}]}.',
    "Every returned production beat must name the exact missing E-ID in source_event_ids. Keep source wording, names, dialogue, objects, locations, time changes, cause/effect, and ending facts. Return JSON only.",
    review?.message,
    missingEvents.length ? `MISSING SOURCE EVENTS THAT MUST APPEAR VERBATIM IN source_event_coverage AND TRUTHFULLY IN script/production_beats:\n${missingEvents.map((event) => `${event.id}: ${event.excerpt}`).join("\n")}` : "Rebuild every source-event mapping and verify each mapped beat actually contains that event.",
    currentDraft ? `CURRENT DRAFT TO REPAIR:\n${currentDraft}` : "",
    JiarenFountainScreenplayContract()
  ].filter(Boolean).join("\n\n");
};
function JiarenNormalizeNovelEventId(value) {
  const number = String(value || "").toUpperCase().match(/(?:^|[^A-Z])E\s*[-_]?\s*(\d{1,3})(?:$|[^0-9])/i)?.[1] ?? String(value || "").match(/\d{1,3}/)?.[0];
  return number ? `E${String(Number(number)).padStart(2, "0")}` : "";
}
function JiarenNovelRecordEventIds(record) {
  const raw = record?.source_event_ids ?? record?.sourceEventIds ?? record?.event_ids ?? record?.eventIds ?? [];
  const values = Array.isArray(raw) ? raw : String(raw || "").split(/[,，\s]+/);
  return Array.from(new Set(values.map(JiarenNormalizeNovelEventId).filter(Boolean)));
}
function JiarenNovelCoverageEntries(payload) {
  const raw = payload?.source_event_coverage ?? payload?.event_coverage ?? payload?.quality_check?.source_event_coverage ?? [];
  return Array.isArray(raw) ? raw : raw && typeof raw == "object" ? Object.entries(raw).map(([event_id, beat_ids]) => ({ event_id, beat_ids })) : [];
}
function JiarenNovelRepairEventIds(review) {
  return Array.from(new Set([
    ...(review?.missingEventIds || []),
    ...(review?.invalidBeatRefs || []),
    ...(review?.mismatchedEventIds || []),
    ...(review?.outOfOrderEventIds || []),
    ...(review?.semanticCoverage?.missingCoreIds || []),
    ...(review?.semanticCoverage?.missingIds || [])
  ].map(JiarenNormalizeNovelEventId).filter(Boolean)));
}
function JiarenNovelBlockRank(events, signalMap, text, fallbackRank) {
  const ranks = events.map((event, index) => JiarenNovelEventCovered(event, text, signalMap) ? index : -1).filter((index) => index >= 0);
  return ranks.length ? Math.min(...ranks) : fallbackRank;
}
function JiarenMergeNovelRepair(source, currentScript, currentPayload, patchScript, patchPayload, review) {
  if (!JiarenIsLiterarySource(source)) return { script: JiarenNormalizeFountainSceneBlocks(patchScript), payload: patchPayload };
  const events = JiarenBuildLiteraryEvents(source), eventIndex = new Map(events.map((event, index) => [event.id, index])), signalMap = JiarenNovelEventSignalMap(events), targets = new Set(JiarenNovelRepairEventIds(review));
  const baseBeats = JiarenProductionBeatRecords(currentPayload), rawPatchBeats = JiarenProductionBeatRecords(patchPayload), patchCoverage = JiarenNovelCoverageEntries(patchPayload), patchCoverageByBeat = /* @__PURE__ */ new Map();
  for (const entry of patchCoverage) {
    const eventId = JiarenNormalizeNovelEventId(entry?.event_id ?? entry?.eventId ?? entry?.id), refs = Array.isArray(entry?.beat_ids ?? entry?.beatIds ?? entry?.beats) ? entry.beat_ids ?? entry.beatIds ?? entry.beats : String(entry?.beat_ids ?? entry?.beatIds ?? entry?.beats ?? "").split(/[,，\s]+/);
    if (!eventId) continue;
    for (const ref of refs) {
      const key = String(ref || "").trim().toUpperCase();
      if (!key) continue;
      patchCoverageByBeat.set(key, Array.from(new Set([...(patchCoverageByBeat.get(key) || []), eventId])));
    }
  }
  const patchBeats = rawPatchBeats.map((record) => {
    const ownIds = JiarenNovelRecordEventIds(record), coveredIds = patchCoverageByBeat.get(String(record.beat_id || "").toUpperCase()) || [], recordText = JiarenProductionBeatText(record), inferredIds = events.filter((event) => (!targets.size || targets.has(event.id)) && JiarenNovelEventCovered(event, recordText, signalMap)).map((event) => event.id), sourceEventIds = Array.from(new Set([...ownIds, ...coveredIds, ...inferredIds])).filter((id) => eventIndex.has(id) && (!targets.size || targets.has(id)));
    return { ...record, source_event_ids: sourceEventIds };
  }).filter((record) => JiarenNovelRecordEventIds(record).length > 0);
  const retainedBase = baseBeats.map((record) => {
    const ids = JiarenNovelRecordEventIds(record), retainedIds = ids.filter((id) => !targets.has(id));
    return ids.length && !retainedIds.length ? null : { ...record, source_event_ids: retainedIds.length ? retainedIds : ids };
  }).filter(Boolean);
  const combinedBeats = [...retainedBase.map((record, index) => ({ record, order: index, source: "base" })), ...patchBeats.map((record, index) => ({ record, order: baseBeats.length + index, source: "patch" }))].filter((item, index, items) => {
    const compact = JiarenNovelCompactAnchorText(JiarenProductionBeatText(item.record));
    return !compact || items.findIndex((candidate) => JiarenNovelCompactAnchorText(JiarenProductionBeatText(candidate.record)) === compact) === index;
  });
  combinedBeats.sort((left, right) => {
    const leftIds = JiarenNovelRecordEventIds(left.record), rightIds = JiarenNovelRecordEventIds(right.record), leftRank = leftIds.length ? Math.min(...leftIds.map((id) => eventIndex.get(id) ?? events.length)) : JiarenNovelBlockRank(events, signalMap, JiarenProductionBeatText(left.record), events.length + left.order / 1e3), rightRank = rightIds.length ? Math.min(...rightIds.map((id) => eventIndex.get(id) ?? events.length)) : JiarenNovelBlockRank(events, signalMap, JiarenProductionBeatText(right.record), events.length + right.order / 1e3);
    return leftRank - rightRank || left.order - right.order;
  });
  const oldToNewBeatId = /* @__PURE__ */ new Map(), productionBeats = combinedBeats.map((item, index) => {
    const beatId = `BEAT-${String(index + 1).padStart(2, "0")}`;
    oldToNewBeatId.set(String(item.record.beat_id || "").toUpperCase(), beatId);
    return { ...item.record, beat_id: beatId };
  });
  const coverage = events.map((event) => {
    const refs = productionBeats.filter((record) => JiarenNovelRecordEventIds(record).includes(event.id) && JiarenNovelEventCovered(event, JiarenProductionBeatText(record), signalMap)).map((record) => record.beat_id);
    return refs.length ? { event_id: event.id, beat_ids: refs, preserved_fact: event.excerpt } : null;
  }).filter(Boolean);
  const baseBlocks = JiarenNormalizeFountainSceneBlocks(currentScript), candidatePatchBlocks = JiarenNormalizeFountainSceneBlocks(patchScript), matchingPatchBlocks = candidatePatchBlocks.filter((block) => events.some((event) => targets.has(event.id) && JiarenNovelEventCovered(event, block, signalMap))), selectedPatchBlocks = matchingPatchBlocks.length ? matchingPatchBlocks : candidatePatchBlocks;
  const blockItems = [...baseBlocks.map((block, index) => ({ block, order: index, fallback: index / Math.max(1, baseBlocks.length) * events.length })), ...selectedPatchBlocks.map((block, index) => ({ block, order: baseBlocks.length + index, fallback: events.length + index / 1e3 }))].filter((item, index, items) => {
    const compact = JiarenNovelCompactAnchorText(item.block);
    return compact && items.findIndex((candidate) => JiarenNovelCompactAnchorText(candidate.block) === compact) === index;
  });
  blockItems.sort((left, right) => JiarenNovelBlockRank(events, signalMap, left.block, left.fallback) - JiarenNovelBlockRank(events, signalMap, right.block, right.fallback) || left.order - right.order);
  const mergedScript = blockItems.map((item) => item.block), payload = { ...(patchPayload && typeof patchPayload == "object" ? patchPayload : {}), ...(currentPayload && typeof currentPayload == "object" ? currentPayload : {}), script: mergedScript, production_beats: productionBeats, source_event_coverage: coverage };
  if (!payload.intent_lock && patchPayload?.intent_lock) payload.intent_lock = patchPayload.intent_lock;
  return { script: mergedScript, payload };
}
function JiarenBuildFaithfulNovelArtifact(source, currentPayload = {}) {
  const events = JiarenBuildLiteraryEvents(source), sceneCount = JiarenMinimumLiterarySceneCount(source);
  if (!events.length) return { script: [], payload: currentPayload };
  const script = Array.from({ length: sceneCount }, (_2, sceneIndex) => {
    const start = Math.floor(sceneIndex * events.length / sceneCount), end = Math.floor((sceneIndex + 1) * events.length / sceneCount), body = events.slice(start, end).map((event) => event.excerpt).join("\n\n");
    return `外景. 原文连续场景${sceneIndex + 1} - 连续\n\n${body}`;
  });
  const productionBeats = events.map((event, index) => {
    const sceneIndex = Math.min(sceneCount - 1, Math.floor(index * sceneCount / events.length)), sceneHeading = `外景. 原文连续场景${sceneIndex + 1} - 连续`;
    return { beat_id: `BEAT-${String(index + 1).padStart(2, "0")}`, scene_id: `scene-${String(sceneIndex + 1).padStart(2, "0")}`, scene_heading: sceneHeading, location: `原文连续场景${sceneIndex + 1}`, time: "连续", weather: "按原文", source_event_ids: [event.id], story_event: event.excerpt, visible_action: event.excerpt, dialogue_or_vo: event.excerpt, camera_seed: "忠实呈现原文可见动作", sound_seed: "保留原文对白、环境声与关键音效", continuity_out: "按原文事件顺序承接下一事件" };
  });
  return { script, payload: { ...(currentPayload && typeof currentPayload == "object" ? currentPayload : {}), script, production_beats: productionBeats, source_event_coverage: events.map((event, index) => ({ event_id: event.id, beat_ids: [productionBeats[index].beat_id], preserved_fact: event.excerpt })), quality_check: { ...(currentPayload?.quality_check || {}), local_source_fidelity_fallback: true } } };
}
function JiarenScriptRepairPrompt(source, review, currentDraft = "") {
  if (JiarenIsLiterarySource(source)) return JiarenLiteraryRepairPrompt(source, review, currentDraft);
  return [
    "STRICT SCRIPT REPAIR: return one complete replacement JSON artifact. Keep every correct source fact and all correct material from the current draft. Repair only the reported format or fidelity defects; do not restart, summarize, change premise, rename characters, or invent unrelated events.",
    review?.message,
    JiarenSourceTypeContract(source),
    `AUTHORITATIVE USER SOURCE:\n${JiarenNormalizeSourceText(source)}`,
    currentDraft ? `CURRENT DRAFT TO REPAIR:\n${currentDraft}` : "",
    JiarenFountainScreenplayContract()
  ].filter(Boolean).join("\n\n");
}
function JiarenConfirmedScriptSections(script, productionBeats) {
  const hiddenSections = JiarenProductionBeatRecords(productionBeats).map((record) => ({ id: record.beat_id, text: JiarenProductionBeatText(record) }));
  if (hiddenSections.length) return hiddenSections;
  const sections = [];
  for (const segment of zr(script)) {
    const match = segment.match(/\bBEAT[-_\s]*(\d{1,3})\b/i);
    if (match) {
      sections.push({ id: `BEAT-${String(Number(match[1])).padStart(2, "0")}`, text: segment });
    } else {
      const blocks = segment.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
      for (const block of blocks.length > 1 ? blocks : [segment]) sections.push({ id: "", text: block });
    }
  }
  return sections.map((section, index) => ({
    ...section,
    id: section.id || `BEAT-${String(index + 1).padStart(2, "0")}`
  }));
}
function Ml(n, i) {
  var P, S;
  const c = $a(n), u = c === "\u4E3B\u89D2" ? "\u4E3B\u89D2/\u8FD9\u540D\u9AD8\u4E2D\u751F" : c, b = ((P = n.match(/(校门外|教室|走廊|天台|食堂|图书馆|医务室|操场|礼堂|实验室|大厅|宿舍|校门|校园)/)) == null ? void 0 : P[1]) || "\u661F\u8FB0\u9AD8\u4E2D\u6821\u95E8\u5916", m = ((S = n.match(/(火焰|雷电|冰霜|重力|浮空|风|水|空间|暗影|念力|爆炸|低温)/)) == null ? void 0 : S[1]) || "\u706B\u7130\u6216\u96F7\u7535\u5F02\u80FD", A = Ni(i);
  return ["\u3010\u5185\u7F6E\u7F16\u5267\u6280\u80FD\uFF1A\u661F\u8FB0\u9AD8\u4E2D\u5F02\u80FD\u6821\u56ED / \u79D1\u5B66\u53CD\u5236\u3011", "\u4F60\u662F\u539F\u521B\u5F71\u89C6\u5267\u7F16\u5267 Agent\uFF0C\u8D1F\u8D23\u751F\u6210\u53EF\u7EE7\u7EED\u4F20\u7ED9\u89D2\u8272\u3001\u573A\u666F\u3001\u5206\u955C\u7684\u89C6\u9891\u5267\u672C\u3002\u8BF7\u7528\u81EA\u5DF1\u7684\u8868\u8FBE\uFF0C\u4E0D\u8981\u590D\u523B\u5916\u90E8\u9879\u76EE\u539F\u6587\u3002", `\u4E16\u754C\u89C2\uFF1A\u661F\u8FB0\u9AD8\u4E2D\u662F\u5F02\u4E16\u754C\u5F02\u80FD\u9AD8\u4E2D\uFF0C\u5929\u7A7A\u548C\u5EFA\u7B51\u5E26\u6709\u53CD\u5E38\u8BC6\u73B0\u8C61\uFF1B\u666E\u901A\u4EBA\u6781\u5C11\u3002${u}\u662F\u96F6\u9B54\u529B\u3001\u65E0\u8D85\u80FD\u529B\u7684\u666E\u901A\u8F6C\u5B66\u751F\uFF0C\u968F\u8EAB\u9ED1\u8272\u53CC\u80A9\u5305\uFF0C\u53EA\u4F7F\u7528\u73B0\u5B9E\u5DE5\u4E1A\u54C1\u548C\u57FA\u7840\u7406\u5316\u77E5\u8BC6\u89E3\u51B3\u51B2\u7A81\u3002`, `\u56FA\u5B9A\u98CE\u683C\uFF1A\u5F02\u80FD\u4E16\u754C\u7684\u5938\u5F20\u89C6\u89C9\u548C\u73B0\u5B9E\u79D1\u5B66\u5DE5\u5177\u4E4B\u95F4\u5F62\u6210\u53CD\u5DEE\u3002\u7B11\u70B9\u6765\u81EA\u4FE1\u606F\u5DEE\uFF0C\u4E0D\u5199\u7384\u5E7B\u5347\u7EA7\uFF0C\u4E0D\u7ED9${u}\u89C9\u9192\u80FD\u529B\u3002`, "\u89D2\u8272\u547D\u540D\u89C4\u5219\uFF1A\u9664\u975E\u7528\u6237\u539F\u59CB\u521B\u610F\u660E\u786E\u6307\u5B9A\u59D3\u540D\uFF0C\u5426\u5219\u7981\u6B62\u4F7F\u7528\u56FA\u5B9A\u89D2\u8272\u540D\u3002\u6240\u6709\u4E3B\u89D2\u3001\u5BF9\u624B\u3001\u540C\u5B66\u3001\u6559\u5E08\u3001\u65C1\u89C2\u8005\u59D3\u540D\u90FD\u7531\u7F16\u5267\u6A21\u578B\u6839\u636E\u5267\u60C5\u539F\u521B\u751F\u6210\uFF1B\u4E5F\u53EF\u4EE5\u53EA\u7528\u8EAB\u4EFD\u79F0\u547C\uFF0C\u4F8B\u5982\u706B\u7130\u5F02\u80FD\u5BF9\u624B\u3001\u96F7\u7535\u5F02\u80FD\u5BF9\u624B\u3001\u6D6E\u7A7A\u540C\u5B66\u3001\u6307\u5BFC\u6559\u5E08\u3002", "\u53EF\u7528\u89D2\u8272\u804C\u80FD\uFF1A\u5143\u7D20\u5F02\u80FD\u5BF9\u624B=\u4E3B\u52A8\u6311\u8845\u5E76\u5236\u9020\u51B2\u7A81\uFF1B\u56F4\u89C2\u540C\u5B66=\u5C55\u793A\u4E16\u754C\u89C2\u548C\u7FA4\u4F53\u53CD\u5E94\uFF1B\u6307\u5BFC\u6559\u5E08=\u8BB0\u5F55\u8003\u6838\u6216\u63A8\u52A8\u573A\u666F\u8F6C\u6362\u3002\u53EA\u7ED9\u804C\u80FD\uFF0C\u4E0D\u9884\u8BBE\u59D3\u540D\u3002", `\u672C\u6B21\u9ED8\u8BA4\u7ED3\u6784\u5316\u53C2\u6570\uFF1Amode=new\uFF1Bscene_title=${b}\uFF1Bvillain_power=${m}\uFF1Bscience_tool=\u706D\u706B\u5668/\u6A61\u80F6\u624B\u5957/\u76D0\u6C34\u55B7\u96FE/\u91D1\u5C5E\u6559\u97AD/\u84C4\u6C34\u6876\u7B49\u73B0\u5B9E\u5DE5\u5177\u4E2D\u62E9\u4E00\uFF1Bscience_principle=\u5FC5\u987B\u5199\u6E05\u6B63\u786E\u7269\u7406\u6216\u5316\u5B66\u539F\u7406\uFF1Bplot_hint=${n}\u3002`, `\u5168\u5C40\u8BED\u8A00/\u753B\u5E45/\u60C5\u7EEA\uFF1A${i.languageLabel} / ${i.aspect_ratio} / ${i.vibe_tag}\u3002`, Qn(i), `\u6BCF\u4E2A\u573A\u666F\u5FC5\u987B\u6309\u987A\u5E8F\u5305\u542B\uFF1A\u73AF\u5883\u94FA\u57AB -> \u8DEF\u4EBA\u6216\u914D\u89D2\u5C55\u793A\u5F02\u80FD -> \u53CD\u6D3E\u4E3B\u52A8\u6311\u8845 -> \u5143\u7D20\u653B\u51FB -> ${u}\u53D6\u51FA\u73B0\u5B9E\u5DE5\u5177\u5E76\u6309\u79D1\u5B66\u539F\u7406\u53CD\u5236 -> \u53CD\u6D3E\u72FC\u72C8\u6218\u8D25 -> \u56F4\u89C2\u9707\u60CA -> ${u}\u7406\u6027\u53F0\u8BCD\u6216\u5185\u5FC3 OS \u6536\u675F\u3002`, `\u5F3A\u5236\u6392\u7248\uFF1A\u6BCF\u6BB5\u4EE5\u201C\u573A\u666FX\uFF1A\u5730\u70B9\u201D\u5F00\u5934\u3002\u52A8\u4F5C\u3001\u5BF9\u767D\u3001\u5185\u5FC3\u72EC\u767D\u5206\u884C\uFF1B\u5BF9\u767D\u683C\u5F0F\u201C\u771F\u5B9E\u4EBA\u7269\u59D3\u540D\uFF1A\u53F0\u8BCD\u201D\uFF1B\u5185\u5FC3\u683C\u5F0F\u201C${c === "\u4E3B\u89D2" ? "\u4E3B\u89D2" : c}\u5185\u5FC3\uFF1A...\u201D\uFF0C\u7981\u6B62\u5199\u201C\u96F6\uFF08\u5185\u5FC3OS\uFF09/ ZERO / \u9A91\u624B / \u65F6\u7A7A\u201D\u8FD9\u7C7B\u4EE3\u53F7\u5F53\u89D2\u8272\u540D\uFF1B\u4FDD\u7559\u97F3\u6548\u5982\u201C\u8F70\uFF01\u201D\u201C\u54E7--\u201D\u3002`, `\u7981\u6B62\u8BCD\u548C\u8BBE\u5B9A\uFF1A\u7981\u6B62\u5199${u}\u89C9\u9192\u9B54\u529B\u3001\u8840\u8109\u529B\u91CF\u3001\u7075\u80FD\u3001\u9B54\u6CD5\u6CD5\u5668\u3001\u5F02\u80FD\u89C9\u9192\u3001\u7075\u529B\uFF1B\u7981\u6B62\u628A\u79D1\u5B66\u5DE5\u5177\u5199\u6210\u9B54\u6CD5\u88C5\u5907\uFF1B\u7981\u6B62\u7701\u7565\u56F4\u89C2\u9707\u60CA\u548C\u53CD\u6D3E\u9519\u6115\u3002`, `\u8F93\u51FA\u8981\u8DB3\u591F\u957F\uFF0C\u5FC5\u987B\u7ED9\u51FA ${A} \u4E2A\u6E05\u6670\u573A\u666F\uFF0C\u6BCF\u4E2A\u573A\u666F\u6709\u660E\u786E\u5730\u70B9\u3001\u52A8\u4F5C\u8282\u594F\u3001\u5BF9\u767D\u3001\u955C\u5934\u7EC6\u8282\u548C\u540E\u7EED\u573A\u666F\u8BBE\u8BA1\u4F9D\u636E\u3002`].join(`
`);
}
function El(n) {
  const i = Ni(n);
  return ["\u3010\u5185\u7F6E\u7F16\u5267\u6280\u80FD\uFF1A\u52A8\u753B\u77ED\u7247\u53EF\u751F\u4EA7\u5267\u672C\u3011", "\u4F60\u662F\u9876\u7EA7\u52A8\u753B\u7F16\u5267 Agent\uFF0C\u76EE\u6807\u4E0D\u662F\u5199\u6458\u8981\uFF0C\u800C\u662F\u8F93\u51FA\u80FD\u7EE7\u7EED\u4EA4\u7ED9\u89D2\u8272\u8BBE\u8BA1\u3001\u573A\u666F\u8BBE\u8BA1\u3001\u5206\u955C\u89C6\u9891\u7684\u751F\u4EA7\u5267\u672C\u3002", "\u6BCF\u4E2A\u573A\u666F\u5FC5\u987B\u63D0\u4F9B\u5730\u70B9\u3001\u73AF\u5883\u3001\u89D2\u8272\u52A8\u4F5C\u3001\u5BF9\u767D/\u65C1\u767D\u3001\u5173\u952E\u753B\u5916\u97F3\u3001\u53EF\u89C6\u5316\u51B2\u7A81\u548C\u4E0B\u4E00\u573A\u8F6C\u6298\uFF1B\u955C\u5934\u3001\u58F0\u97F3\u548C\u8854\u63A5\u4FE1\u606F\u53EA\u5199\u5165\u540E\u53F0 production_beats\u3002", "\u89D2\u8272\u547D\u540D\u5FC5\u987B\u4F7F\u7528\u771F\u5B9E\u53EF\u8BFB\u7684\u4EBA\u7269\u540D\u6216\u201C\u4E3B\u89D2/\u53CD\u6D3E/\u540C\u5B66\u201D\u7B49\u660E\u786E\u4EBA\u7269\u79F0\u547C\uFF1B\u7981\u6B62\u628A\u201C\u96F6\u3001ZERO\u3001\u9A91\u624B\u3001\u5185\u5FC3OS\u3001\u65C1\u767D\u3001\u65F6\u7A7A\u3001\u955C\u5934\u3001\u52A8\u4F5C\u201D\u7B49\u6807\u8BB0\u5F53\u89D2\u8272\u540D\u3002", `\u5168\u5C40\u8BED\u8A00/\u753B\u5E45/\u60C5\u7EEA/\u65F6\u957F\uFF1A${n.languageLabel} / ${n.aspect_ratio} / ${n.vibe_tag} / ${n.durationLabel}\u3002`, Qn(n), `\u573A\u666F\u6570\u91CF\u6309\u6545\u4E8B\u9700\u8981\u81EA\u52A8\u5224\u65AD\uFF0C\u672C\u6B21\u5FC5\u987B\u8F93\u51FA ${i} \u4E2A\u8FDE\u7EED\u573A\u666F\uFF0C\u4E0D\u4E3A\u4E86\u51D1\u6570\u786C\u5199\u65E0\u6548\u573A\u666F\uFF0C\u4E5F\u7981\u6B62\u628A\u957F\u7247\u538B\u7F29\u6210\u5355\u4E00\u573A\u666F\u3002`, "Fountain formatting takes priority: script[] uses only 内景./外景. 地点 - 时间、可拍摄动作、角色名和对白/画外音；不得使用 场景X：地点、BEAT 或镜头术语。"].join(`
`);
}
function Dl(e, r) {
  const script = (Array.isArray(e) ? e : []).filter((item) => typeof item === "string" && item.trim());
  if (!script.length) return "\u5267\u672C\u4E3A\u7A7A\u3002";
  const compactTextLength = script.join("\n").replace(/\s/g, "").length;
  if (compactTextLength < 80) return "\u5267\u672C\u8FD4\u56DE\u5185\u5BB9\u592A\u77ED\uFF0C\u8BF7\u91CD\u8BD5\u6216\u8865\u5145\u4E00\u5C0F\u6BB5\u5267\u60C5\u3002";
}
function Rl(n) {
  const i = Nl(n), c = so(n.vibe_tag), u = () => ["GlobalStudioConfig.runtimeParams", `language=${n.language} (${n.languageLabel})`, `aspect_ratio=${n.aspect_ratio}`, `vibe_tag=${n.vibe_tag}`, `duration=${n.duration} (${n.durationLabel})`, `duration_seconds=${n.durationSeconds}`, `video_duration_ladder=${n.isSeedanceVideoModel ? "Seedance integer 4-15s or -1" : "model default"}`, `userIdea=${n.userIdea}`, `language_rule=${i}`].join(`
`);
  return { runtimeParams: n, adapter: { contextBlock: u, wrapScriptPrompt(b, m) {
    const sourceProfile = JiarenSourceProfile(b), sourceTypeContract = JiarenSourceTypeContract(b), sourceUnits = JiarenStructuredSourceUnits(b, sourceProfile), literaryEvents = JiarenBuildLiteraryEvents(b), literaryContract = JiarenLiteraryCoverageContract(b), novelDurationContract = JiarenNovelDurationContract(b, n), A = El(n), expectedBeats = literaryEvents.length ? Math.max(JiarenRuntimeBeatMinimum(n), JiarenMinimumProductionBeatCount(b)) : sourceProfile.type === "screenplay" || sourceProfile.type === "storyboard" ? Math.max(1, sourceUnits.length) : Ni(n), sourceEventIdsExample = literaryEvents.length ? '["E01"]' : "[]", sourceCoverageExample = literaryEvents.length ? '[{"event_id":"E01","beat_ids":["BEAT-01"],"preserved_fact":"\u4FDD\u7559\u7684\u539F\u6587\u4E8B\u5B9E"}]' : "[]";
    return [u(), sourceTypeContract, A, literaryContract, novelDurationContract, JiarenFountainScreenplayContract(), `\u7528\u6237\u539F\u59CB\u521B\u610F\uFF1A${b}`, m ? `\u827A\u672F\u603B\u76D1\u5DF2\u786E\u8BA4\u7684\u5F71\u7247\u53C2\u6570\uFF1A${m}` : "", i, Ut(b), Qn(n), "\u5267\u672C\u5FC5\u987B\u4FDD\u7559\u539F\u6587\u53D9\u4E8B\u3001\u89D2\u8272\u5BF9\u767D\u3001\u5173\u952E\u5185\u5FC3\u72EC\u767D\u3001\u52A8\u4F5C\u8282\u594F\u548C\u573A\u666F\u8FDE\u7EED\u6027\uFF1B\u5185\u5FC3\u72EC\u767D\u8F6C\u4E3A\u753B\u5916\u97F3\uFF0C\u4E0D\u5F97\u5220\u9664\u3002", "\u539F\u6587\u4E8B\u4EF6\u5B8C\u6574\u6027\u9AD8\u4E8E\u76EE\u6807\u65F6\u957F\u3002\u539F\u6587\u8FC7\u957F\u65F6\u5EFA\u8BAE\u5206\u96C6\u6216\u5EF6\u957F\u65F6\u957F\uFF0C\u7981\u6B62\u5220\u9664\u56E0\u679C\u8282\u70B9\u3001\u5BF9\u767D\u3001\u56DE\u5FC6\u3001\u65F6\u95F4\u53D8\u5316\u548C\u5173\u952E\u7269\u4EF6\u3002", `\u8BF7\u4E25\u683C\u8F93\u51FA JSON\uFF0C\u4E0D\u8981 markdown\u3002\u683C\u5F0F\uFF1A{"script":["\u5916\u666F. \u5730\u70B9 - \u65F6\u95F4\\n\\n\u53EF\u62CD\u6444\u7684\u52A8\u4F5C\u63CF\u8FF0\\n\\n\u89D2\u8272\u540D\uFF08\u753B\u5916\u97F3\uFF09\\n\u5BF9\u767D"],"production_beats":[{"beat_id":"BEAT-01","scene_id":"scene-01","scene_heading":"\u5916\u666F. \u5730\u70B9 - \u65F6\u95F4","location":"\u5730\u70B9","time":"\u65F6\u95F4","weather":"\u5929\u6C14/\u73AF\u5883\u72B6\u6001","source_event_ids":${sourceEventIdsExample},"story_event":"\u672C\u8282\u62CD\u4FDD\u7559\u7684\u539F\u6587\u4E8B\u4EF6","visible_action":"\u753B\u9762\u53EF\u89C1\u52A8\u4F5C","dialogue_or_vo":"\u5BF9\u767D\u6216\u753B\u5916\u97F3","camera_seed":"\u5206\u955C\u673A\u4F4D\u4E0E\u8FD0\u52A8\u7EBF\u7D22","sound_seed":"\u73AF\u5883\u58F0\u4E0E\u5173\u952E\u97F3\u6548","continuity_out":"\u4E0B\u4E00\u8282\u62CD\u8854\u63A5\u72B6\u6001"}],"characters":[{"name":"\u89D2\u8272\u540D","role":"\u8EAB\u4EFD","seed":"\u5916\u89C2\u7EBF\u7D22"}],"scene_seed":["\u6838\u5FC3\u573A\u666F"],"source_event_coverage":${sourceCoverageExample},"quality_check":{"target_seconds":${n.durationSeconds},"duration_policy":"target_only_source_fidelity_first","ooc_risk":"none","handoff":"\u53EF\u4EA4\u7ED9\u89D2\u8272\u3001\u573A\u666F\u548C\u5206\u955C\u8BBE\u8BA1"}}\u3002production_beats \u81F3\u5C11\u8F93\u51FA ${expectedBeats} \u4E2A\u8FDE\u7EED\u8282\u62CD\uFF1Bscript[] \u6309\u771F\u5B9E\u5730\u70B9/\u65F6\u95F4\u53D8\u5316\u5206\u573A\uFF0C\u4E0D\u5F97\u628A\u4E00\u4E2A\u8282\u62CD\u8BEF\u5F53\u4E00\u4E2A\u573A\u666F\u3002`].filter(Boolean).join(`
`);
  }, wrapCharacterPrompt(b, m, A, P) {
    return [u(), `\u7528\u6237\u9700\u6C42\uFF1A${b}`, hn(b), Ut(b, m), `\u5267\u672C\uFF1A${m}`, `\u827A\u672F\u603B\u76D1\u98CE\u683C\u4E0B\u53D1\uFF1A${A} / ${P} / ${n.vibe_tag}`, i, "\u4E25\u683C\u590D\u523B AI_film_studio \u8F93\u5165\u7AEF\u53E3\uFF1AInput_Character \u53EA\u8F93\u51FA living character / \u4EBA\u7269\u89D2\u8272\uFF1B\u673A\u8F66\u3001\u6469\u6258\u3001\u8F66\u8F86\u3001\u6B66\u5668\u3001\u88C5\u5907\u3001\u4E66\u5305\u3001\u624B\u673A\u7B49\u53EA\u80FD\u8F93\u51FA\u5230 props \u6216 vehicles\uFF0C\u7981\u6B62\u6DF7\u5165 characters\u3002", "\u89D2\u8272\u8BBE\u8BA1\u5E08\u5FC5\u987B\u6839\u636E\u5267\u672C\u89D2\u8272\u6570\u91CF\u8F93\u51FA characters[]\u3002\u5267\u672C\u91CC\u6709\u51E0\u4E2A\u4E3B\u8981\u4EBA\u7269\uFF0C\u5C31\u751F\u6210\u51E0\u4E2A\u89D2\u8272\u8D44\u4EA7\u65B9\u6848\uFF1B\u4E0D\u8981\u628A\u4E3B\u9053\u5177\u3001\u8F7D\u5177\u3001\u5BA0\u7269\u3001\u73AF\u5883\u3001\u955C\u5934\u540D\u79F0\u5F53\u6210\u4EBA\u7269\u3002", "\u82E5\u7528\u6237\u539F\u59CB\u9700\u6C42\u5305\u542B\u660E\u786E\u6027\u522B\u3001\u8EAB\u4EFD\u3001\u4E3B\u9053\u5177\u6216\u8F7D\u5177\uFF08\u4F8B\u5982\u201C\u673A\u8F66\u7537\u201D\u201C\u5C11\u5E74\u9A91\u624B\u201D\u201C\u5973\u4E3B\u201D\uFF09\uFF0C\u4EBA\u7269\u89D2\u8272 appearance \u53EA\u5199\u9A91\u624B/\u5C11\u5E74\u672C\u4EBA\uFF1B\u673A\u8F66\u5199\u5165 vehicles[]\uFF0C\u4E0D\u8981\u751F\u6210\u201C\u67D0\u67D0\u7684\u673A\u8F66\u201D\u89D2\u8272\u5361\u3002", "\u6BCF\u4E2A\u89D2\u8272 appearance \u5FC5\u987B\u53EF\u88AB\u5206\u955C\u548C\u89C6\u9891\u9010\u5B57\u7EE7\u627F\uFF0C\u4E14\u8981\u5305\u542B\u9762\u90E8\u3001\u53D1\u578B\u3001\u670D\u88C5\u3001\u8BC6\u522B\u8272\u3001\u5E74\u9F84\u6C14\u8D28\u3001\u7981\u5FCC\u9879\uFF1B\u573A\u666F\u8BBE\u8BA1\u9636\u6BB5\u53EA\u505A\u7A7A\u73AF\u5883\uFF0C\u4E0D\u7EE7\u627F\u4EBA\u7269\u5916\u89C2\u3002", "props/vehicles \u5FC5\u987B\u63CF\u8FF0\u5916\u89C2\u3001\u989C\u8272\u3001\u6750\u8D28\u3001\u6545\u4E8B\u7528\u9014\u3001\u8FDE\u7EED\u6027\u9501\u5B9A\u8BCD\uFF1B\u5B83\u4EEC\u662F\u72EC\u7ACB\u7D20\u6750\u8282\u70B9\uFF0C\u53EA\u80FD\u5728\u5206\u955C/\u89C6\u9891\u9636\u6BB5\u4E0E\u4EBA\u7269\u5408\u6210\u3002", '\u8BF7\u8F93\u51FA JSON\uFF1A{"characters":[{"name":"\u89D2\u8272\u540D","description":"\u89D2\u8272\u4ECB\u7ECD","appearance":"\u5FC5\u987B\u88AB\u540E\u7EED\u7EE7\u627F\u7684\u4EBA\u7269\u5916\u89C2\u8840\u7EDF","image_prompt":"\u82F1\u6587\u89D2\u8272\u6B63\u9762\u8BBE\u5B9A\u56FE\u63D0\u793A\u8BCD","sheet_prompt":"\u82F1\u6587\u6821\u8272\u591A\u89C6\u56FE\u63D0\u793A\u8BCD"}],"vehicles":[{"name":"\u8F7D\u5177\u540D","description":"\u8F7D\u5177\u7528\u9014","appearance":"\u8F7D\u5177\u5916\u89C2\u3001\u989C\u8272\u3001\u6750\u8D28\u3001\u8FDE\u7EED\u6027\u9501\u5B9A","image_prompt":"optional English vehicle asset prompt"}],"props":[{"name":"\u9053\u5177\u540D","description":"\u9053\u5177\u7528\u9014","appearance":"\u9053\u5177\u5916\u89C2\u3001\u6750\u8D28\u3001\u8FDE\u7EED\u6027\u9501\u5B9A","image_prompt":"optional English prop asset prompt"}]}'].join(`
`);
  }, wrapScenePrompt(b, m, A, P) {
    return [u(), nn(P), `\u7528\u6237\u9700\u6C42\uFF1A${b}`, `\u5267\u672C\u5DE5\u4EF6 script artifact\uFF1A${m}`, `\u89D2\u8272\u4FE1\u606F\u53EA\u7528\u4E8E\u7406\u89E3\u6545\u4E8B\u53D1\u751F\u4F4D\u7F6E\uFF0C\u4E0D\u5141\u8BB8\u5199\u5165\u573A\u666F\u751F\u56FE\u753B\u9762\uFF1A${A}`, i, Ut(b, m), Qn(n), "\u4F60\u662F\u573A\u666F\u7F8E\u672F\u8BBE\u8BA1\u5E08\u3002\u573A\u666F\u8BBE\u8BA1\u5E08\u53EA\u8D1F\u8D23\u7A7A\u73AF\u5883\u7D20\u6750\u5E93\uFF1A\u7A7A\u95F4\u3001\u5149\u5F71\u3001\u5730\u5F62\u3001\u65F6\u6BB5\u3001\u9053\u5177\u5E03\u666F\u3001\u7A7A\u955C\u6784\u56FE\uFF1B\u7981\u6B62\u51FA\u73B0\u4EFB\u4F55\u4EBA\u7269\u3001\u89D2\u8272\u3001\u8EAB\u4F53\u90E8\u4F4D\u3001\u9A91\u624B\u3001\u80CC\u5F71\u3001\u526A\u5F71\u3001\u4EBA\u7FA4\u6216\u4E3B\u89D2\u3002", "\u8BF7\u5148\u628A\u5267\u672C\u62C6\u6210\u53EF\u6267\u884C\u7684 scene_plan\uFF1A\u6BCF\u4E2A\u573A\u666F\u53EA\u8BF4\u660E\u8FD9\u4E2A\u7A7A\u573A\u5730\u662F\u4EC0\u4E48\u3001\u6709\u54EA\u4E9B\u5E03\u666F\u548C\u5149\u5F71\u3001\u5982\u4F55\u4F5C\u4E3A\u540E\u7EED\u5206\u955C\u5E95\u5C42\u73AF\u5883\u88AB\u590D\u7528\u3002\u82E5\u5267\u672C\u5DF2\u6709\u201C\u573A\u666FN\uFF1A\u5730\u70B9\xB7\u65F6\u6BB5\u201D\u573A\u6807\uFF0C\u5FC5\u987B\u9010\u5B57\u7EE7\u627F\u8BE5\u5730\u70B9\u548C\u65F6\u6BB5\u3002", "\u573A\u666F\u6570\u91CF\u53EA\u8DDF\u968F\u5267\u672C\u771F\u5B9E\u573A\u6B21\uFF1A\u5267\u672C\u91CC\u6709\u51E0\u4E2A\u660E\u786E\u573A\u666F\u5C31\u8FD4\u56DE\u51E0\u4E2A\uFF1B\u957F\u89C6\u9891\u9700\u8981\u66F4\u591A\u955C\u5934\u65F6\u53EA\u5728\u5206\u955C\u9636\u6BB5\u7EC6\u62C6\uFF0C\u4E0D\u5141\u8BB8\u573A\u666F\u9636\u6BB5\u4E3A\u51D1\u6570\u91CF\u65B0\u589E\u672A\u51FA\u73B0\u5730\u70B9\u3001\u65F6\u6BB5\u3001\u5929\u6C14\u6216\u673A\u4F4D\u53D8\u4F53\u3002", "\u6BCF\u4E2A\u573A\u666F\u5FC5\u987B\u5305\u542B\uFF1Aenvironment\u3001set_dressing\u3001lighting\u3001terrain\u3001spatial_framing\u3001camera_empty_frame\u3001transition_out\u3002subject \u53EA\u80FD\u5199\u201C\u7A7A\u73AF\u5883\u201D\uFF0Csubject_motion \u53EA\u80FD\u5199\u201C\u65E0\u4EBA\u7269\u52A8\u4F5C\u201D\u3002", "image_prompt \u5FC5\u987B\u662F\u77ED\u82F1\u6587\u7A7A\u73AF\u5883\u8D44\u4EA7\u63D0\u793A\u8BCD\uFF0C\u4E0D\u8D85\u8FC7 900 \u5B57\u7B26\uFF1B\u5FC5\u987B\u5305\u542B empty environment / no people / no characters\uFF1B\u4E0D\u8981\u628A\u5B8C\u6574\u5267\u672C\u585E\u8FDB image_prompt\u3002", '\u8BF7\u4E25\u683C\u8F93\u51FA JSON\uFF1A{"scenes":[{"title":"\u573A\u666F\u540D","description":"\u4E2D\u6587\u7A7A\u73AF\u5883\u8BBE\u5B9A","beat_refs":["\u5BF9\u5E94\u5267\u672C\u6BB5\u843D"],"subject":"\u7A7A\u73AF\u5883","subject_motion":"\u65E0\u4EBA\u7269\u52A8\u4F5C","environment":"\u7A7A\u95F4/\u65F6\u95F4/\u5929\u6C14/\u9053\u5177","set_dressing":"\u9053\u5177\u5E03\u666F","lighting":"\u5149\u5F71\u6C1B\u56F4","terrain":"\u5730\u8C8C/\u6750\u8D28","spatial_framing":"\u7A7A\u955C\u6784\u56FE","camera":"\u7A7A\u955C\u673A\u4F4D/\u7126\u6BB5","transition_out":"\u8F6C\u573A\u65B9\u5F0F","image_prompt":"short English empty environment concept art prompt, no people, no characters"}]}'].join(`
`);
  }, wrapStoryboardPrompt(b, m, A, P, S, B) {
    const E = /FPV|一镜到底|first person|immersive/i.test(S), novelDurationContract = JiarenNovelDurationContract(b, n), me = n.isSeedanceVideoModel ? "00:00.0-00:06.0" : "00:00-00:04", Z = n.isSeedanceVideoModel ? `\u5206\u955C\u603B\u65F6\u957F\u5FC5\u987B\u8986\u76D6\u7EA6 ${n.durationSeconds} \u79D2\uFF1BSeedance 2.0 \u6BCF\u4E2A shot \u7684 duration \u5FC5\u987B\u662F 4-15 \u79D2\u5185\u7684\u4EFB\u610F\u6574\u6570\u6216 -1\uFF0C\u4E0D\u5F97\u518D\u56FA\u5B9A\u4E3A 5/10 \u79D2\uFF1B\u6BCF\u4E2A\u955C\u5934 timecode \u5FC5\u987B\u4E25\u683C\u8FDE\u7EED\u3002` : `\u5206\u955C\u603B\u65F6\u957F\u5FC5\u987B\u8986\u76D6\u7EA6 ${n.durationSeconds} \u79D2\uFF1B\u6309\u786E\u8BA4\u573A\u666F\u62C6\u8FDE\u7EED\u955C\u5934\uFF0C\u5C0F\u4E8E 1 \u5206\u949F\u7684\u89C6\u9891\u4E5F\u8981\u6309 2-4 \u79D2\u7EC6\u62C6\uFF0C\u4E0D\u5141\u8BB8\u53EA\u751F\u6210\u5C11\u91CF\u7C97\u955C\u5934\uFF1B\u6BCF\u4E2A\u955C\u5934 timecode \u4E25\u683C\u8FDE\u7EED\uFF0C\u4E0D\u5141\u8BB8\u6240\u6709\u955C\u5934\u505C\u5728 00:04\u3002`;
    return [u(), nn(B), `\u7528\u6237\u9700\u6C42\uFF1A${b}`, `\u5267\u672C\uFF1A${m}`, `\u89D2\u8272\u8840\u7EDF\uFF1A${A}`, `\u5267\u672C\u5730\u70B9/\u65F6\u95F4/\u5929\u6C14\u4E8B\u5B9E\u6E05\u5355\uFF1A${P}`, `\u5206\u955C\u65B9\u6848\uFF1A${S}`, `\u955C\u5934\u8FD0\u52A8\u9002\u914D\uFF1A${c}`, i, Ut(b, `${m}
${S}`), Qn(n), novelDurationContract, "\u5206\u955C\u5BFC\u6F14\u76F4\u63A5\u628A\u5DF2\u786E\u8BA4\u5267\u672C\u3001\u89D2\u8272\u8D44\u4EA7\u548C production_beats \u5730\u70B9\u4E8B\u5B9E\u5408\u6210\u4E3A\u5B8C\u6574\u5206\u955C\uFF1B\u4E0D\u5B58\u5728\u72EC\u7ACB\u573A\u666F Agent\u3001\u573A\u666F\u5361\u6216\u573A\u666F\u56FE\u524D\u7F6E\u9636\u6BB5\u3002", "\u6BCF\u6761\u5206\u955C\u5FC5\u987B\u5199\u6E05\u695A\uFF1A\u65F6\u95F4\u533A\u95F4\u3001\u666F\u522B\u3001\u955C\u5934\u7126\u6BB5\u3001\u666F\u6DF1\u63A7\u5236\u3001\u673A\u4F4D\u89D2\u5EA6\u3001\u8FD0\u955C\u65B9\u5F0F\u3001\u4E3B\u4F53\u4EBA\u7269/\u670D\u9970/\u9053\u5177/\u52A8\u4F5C\u7EC6\u8282\u3001\u73AF\u5883/\u5149\u5F71/\u6C1B\u56F4/\u7279\u6548\u7EC6\u8282\u3002", "\u5206\u955C\u5BFC\u6F14\u5FC5\u987B\u7EE7\u627F\u603B\u5BFC\u6F14\u53C2\u6570\uFF1A\u955C\u5934\u8282\u594F\u3001\u6784\u56FE\u6BD4\u4F8B\u3001\u5BF9\u767D\u8BED\u8A00\u3001\u60C5\u7EEA\u5F3A\u5EA6\u4E0D\u53EF\u8131\u79BB\u5168\u5C40\u8BBE\u7F6E\u3002", Z, "\u7981\u6B62\u8BA9\u5206\u955C\u91CD\u65B0\u53D1\u660E\u573A\u666F\u6216\u89D2\u8272\uFF1B\u5730\u70B9\u3001\u65F6\u6BB5\u3001\u5929\u6C14\u548C\u5149\u7EBF\u53EA\u80FD\u6765\u81EA\u5DF2\u786E\u8BA4\u5267\u672C\u4E0E production_beats\uFF0C\u4EBA\u7269\u5916\u89C2\u6765\u81EA\u89D2\u8272\u8D44\u4EA7\u3002", E ? co(B) : "", E ? `\u8BF7\u8F93\u51FA JSON\uFF1A{"shots":[{"title":"FPV \u955C\u5934 1","timecode":"${me}","prompt":"\u4E2D\u6587\u8BF4\u660E\uFF1A\u6444\u50CF\u673A\u8EAB\u4EFD/\u8D77\u70B9/\u505C\u9760\u70B9/\u7EC8\u70B9/\u969C\u788D\u7ED5\u884C/\u52A8\u4F5C\u8282\u70B9","video_prompt":"English single-shot FPV route prompt, no red path, no numbers, no arrows, no UI"}]}` : `\u8BF7\u8F93\u51FA JSON\uFF1A{"shots":[{"title":"\u955C\u5934 1","timecode":"${me}","prompt":"\u955C\u5934\u8BF4\u660E","video_prompt":"\u82F1\u6587\u89C6\u9891\u63D0\u793A\u8BCD"}]}`].join(`
`);
  }, wrapImagePrompt(b, m, A) {
    return [tn(A, m, n.userIdea), b, wt(n.userIdea).requestedStyle ? "" : nn(A), `Production asset type: ${m}.`, `Global mood: ${n.vibe_tag}. Target composition aspect ratio: ${n.aspect_ratio}.`, "Maintain continuity with the approved film direction. No watermark. No random text unless explicitly requested."].join(`
`);
  }, wrapVideoPrompt(b, m) {
    return [tn(m, "video shot", n.userIdea), b, wt(n.userIdea).requestedStyle ? "" : nn(m), c, `aspect ratio ${n.aspect_ratio}`, `global mood ${n.vibe_tag}`, `dialogue/subtitle language rule: ${i}`].join(", ");
  }, wrapAudioConfig() {
    return { bgm_style: /高燃|燃|史诗|力量|冲突|紧张|动作|热血/i.test(n.vibe_tag) ? "High-energy cinematic hybrid score, driving percussion, strong rhythmic accents" : /温暖|治愈|温柔|光芒|清新/i.test(n.vibe_tag) ? "Ambient soft piano, warm pads, gentle emotional swell" : "Cinematic hybrid score, controlled dynamics, production-ready mix", tts_locale: n.language === "en" ? "en-US-Neural" : n.language === "none" ? "none" : "zh-CN-Standard-Wong", language: n.language, aspect_ratio: n.aspect_ratio, vibe_tag: n.vibe_tag, duration: n.duration };
  }, wrapAudioPrompt(b, m, A) {
    const P = this.wrapAudioConfig();
    return [u(), `\u7528\u6237\u9700\u6C42\uFF1A${b}`, `\u5267\u672C\uFF1A${m}`, `\u5206\u955C\uFF1A${A}`, `BGM \u98CE\u683C\u5FC5\u987B\u81EA\u52A8\u9002\u914D\u4E3A\uFF1A${P.bgm_style}`, `TTS \u8BED\u79CD\u5FC5\u987B\u81EA\u52A8\u9002\u914D\u4E3A\uFF1A${P.tts_locale}`, i, '\u8BF7\u8F93\u51FA JSON\uFF1A{"music":"Suno \u53EF\u6267\u884C\u914D\u4E50\u65B9\u5411","sfx":"\u73AF\u5883\u58F0/\u52A8\u4F5C\u97F3\u6548","prompt":"\u82F1\u6587 Suno prompt","tts":"\u5BF9\u767D/TTS \u5EFA\u8BAE"}'].join(`
`);
  } } };
}
const ut = [{ id: "setup", agent: "\u827A\u672F\u603B\u76D1", title: "\u5F71\u7247\u57FA\u7840\u4FE1\u606F", nodeTitle: "01 \u5F71\u7247\u53C2\u6570", icon: oi, model: "\u667A\u80FD\u63A8\u7406", shortLabel: "\u53C2\u6570", mediaLabel: "PARAM" }, { id: "script", agent: "\u7F16\u5267", title: "\u5267\u672C\u63A8\u7406", nodeTitle: "02 \u6211\u7684\u5267\u672C", icon: oo, model: "\u667A\u80FD\u7F16\u5267", shortLabel: "\u5267\u672C", mediaLabel: "SCRIPT" }, { id: "character", agent: "\u89D2\u8272\u8BBE\u8BA1\u5E08", title: "\u89D2\u8272\u8D44\u4EA7", nodeTitle: "03 \u89D2\u8272\u8D44\u4EA7", icon: oi, model: "\u56FE\u50CF\u751F\u6210", shortLabel: "\u89D2\u8272", mediaLabel: "CHAR" }, { id: "storyboard", agent: "\u5206\u955C\u5BFC\u6F14", title: "\u5206\u955C\u77ED\u89C6\u9891", nodeTitle: "04 \u5206\u955C\u89C6\u9891", icon: fl, model: "\u89C6\u9891\u751F\u6210", shortLabel: "\u5206\u955C", mediaLabel: "STORYBOARD" }, { id: "audio", agent: "\u97F3\u6548\u603B\u76D1", title: "\u97F3\u9891\u6210\u7247", nodeTitle: "05 \u97F3\u9891\u65B9\u6848", icon: hl, model: "\u97F3\u9891\u751F\u6210", shortLabel: "\u97F3\u6548", mediaLabel: "AUDIO" }, { id: "final", agent: "\u603B\u5BFC\u6F14", title: "\u6210\u7247\u8F93\u51FA", nodeTitle: "06 \u6210\u7247\u8F93\u51FA", icon: oi, model: "\u6210\u7247\u5408\u6210", shortLabel: "\u6210\u54C1", mediaLabel: "MASTER" }], On = ["script", "character", "storyboard", "audio", "final"], xa = [{ id: "classic", label: "\u7ECF\u5178\u7F8E\u5F0F", tone: "\u539A\u91CD\u3001\u53D9\u4E8B\u3001\u80F6\u7247\u611F" }, { id: "q", label: "Q\u7248\u8D5B\u7490", tone: "\u660E\u4EAE\u3001\u53EF\u7231\u3001\u89D2\u8272\u7A33\u5B9A" }, { id: "dark", label: "\u6697\u7F8E\u6E05\u65B0", tone: "\u4F4E\u9971\u548C\u3001\u7EC6\u8282\u3001\u60C5\u7EEA\u6C1B\u56F4" }, { id: "watercolor", label: "\u6E05\u65B0\u6C34\u5F69", tone: "\u67D4\u548C\u3001\u7559\u767D\u3001\u624B\u7ED8\u8D28\u611F" }, { id: "dragon", label: "\u9F99\u65CF\u4F20\u8BF4", tone: "\u53F2\u8BD7\u3001\u9B54\u6CD5\u3001\u5F3A\u8F6E\u5ED3" }, { id: "3d", label: "3D\u56FD\u521B", tone: "\u7ACB\u4F53\u3001\u5546\u4E1A\u3001\u53EF\u8F6C\u89C6\u9891" }];
function Jr(n) {
  if (!n) return;
  const i = `${n.id} ${n.label} ${n.tone}`, c = n.id === "q" || /Q版|可爱|chibi/i.test(i), u = n.id === "watercolor" || /水彩|手绘/i.test(i), b = n.id === "3d" || /3D|立体/i.test(i), m = /真人|写实|realistic|live[-\s]?action|photoreal/i.test(i), A = /日系|动画|anime|赛璐/i.test(i), P = /国风|东方|guofeng|Chinese/i.test(i);
  return { id: n.id, label: n.label, tone: n.tone, prompt: [`VISUAL STYLE LOCK: ${n.label}.`, `Style tone: ${n.tone}.`, c ? "Keep chibi/Q-version proportions, large expressive head, compact body, clean cel shading, cute simplified anatomy, consistent face and outfit." : u ? "Keep soft watercolor texture, hand-painted edges, airy palette, gentle paper grain, consistent character silhouette." : b ? "Keep stylized 3D Chinese animation look, clean volumes, soft global illumination, consistent model-like character proportions." : m ? "Keep cinematic live-action / photoreal character rendering, real camera lighting, stable face identity, exact outfit and natural body proportions." : A ? "Keep clean anime cel-shaded rendering, readable line art, stable face proportions, same outfit colors and consistent animation palette." : P ? "Keep Chinese guofeng animation language, oriental costume/material details, refined brush texture, stable silhouette and unified color palette." : "Keep the approved illustration style, same line weight, same color system, same character proportions, same rendering language."].join(" "), negative: c ? "Do not switch to realistic, mature manga, cinematic live action, long-body anime, gritty realism, or different face style." : m ? "Do not switch to anime, Q-version, manga, watercolor, cartoon, game CG, or a different face/outfit style." : "Do not switch visual style, do not redesign the character, do not change face proportions, outfit, rendering language, or color system." };
}
function ui(n) {
  const i = wi.find((u) => u.id === n);
  return i ? { "three-d": { id: "3d", label: "3D\u56FD\u521B", tone: "\u7ACB\u4F53\u3001\u5546\u4E1A\u3001\u53EF\u8F6C\u89C6\u9891" }, anime: { id: "anime", label: "\u65E5\u7CFB\u52A8\u753B", tone: "\u6E05\u6670\u7EBF\u7A3F\u3001\u8D5B\u7490\u7490\u8272\u5757\u3001\u52A8\u753B\u77ED\u7247" }, "ip-cute": { id: "q", label: "IP Q\u7248", tone: "\u53EF\u7231\u6BD4\u4F8B\u3001\u5F3A\u8BB0\u5FC6\u70B9\u3001\u89D2\u8272\u7A33\u5B9A" }, guofeng: { id: "guofeng", label: "\u56FD\u98CE\u52A8\u753B", tone: "\u4E1C\u65B9\u670D\u9970\u3001\u67D4\u548C\u7B14\u89E6\u3001\u7EDF\u4E00\u56FD\u98CE\u7F8E\u672F" }, "game-cg": { id: "game-cg", label: "\u6E38\u620F CG", tone: "\u7CBE\u81F4\u88C5\u5907\u3001\u620F\u5267\u5149\u5F71\u3001\u89D2\u8272\u6D77\u62A5\u611F" }, realistic: { id: "realistic", label: "AI \u771F\u4EBA", tone: "\u5199\u5B9E\u4EBA\u50CF\u3001\u5546\u4E1A\u89D2\u8272\u7167\u3001\u771F\u5B9E\u6444\u5F71\u8D28\u611F" }, european: { id: "european", label: "\u6B27\u7F8E\u63D2\u753B", tone: "\u539A\u6D82\u3001\u620F\u5267\u5149\u5F71\u3001\u7EDF\u4E00\u63D2\u753B\u8BED\u8A00" }, "kid-story": { id: "kid-story", label: "\u7ED8\u672C\u98CE", tone: "\u6E29\u67D4\u3001\u4F4E\u9F84\u3001\u6545\u4E8B\u4E66\u8D28\u611F" }, "ink-line": { id: "ink-line", label: "\u94A2\u7B14\u7EBF\u7A3F", tone: "\u9ED1\u7EBF\u8F6E\u5ED3\u3001\u5E72\u51C0\u7EBF\u7A3F\u3001\u540E\u7EED\u53EF\u4E0A\u8272" }, "brand-mascot": { id: "brand-mascot", label: "\u54C1\u724C\u5409\u7965\u7269", tone: "\u7B80\u6D01\u3001\u53EF\u6CE8\u518C\u3001\u53EF\u5EF6\u5C55" } }[i.id] ?? { id: i.id, label: i.label, tone: i.hint } : void 0;
}
function nn(n) {
  return n ? `${n.prompt} NEGATIVE STYLE RULE: ${n.negative}` : "VISUAL STYLE LOCK: follow the already approved project style; keep one consistent rendering language across every asset.";
}
const JiarenShortDramaVisibleStyles = [
  { id: "guofeng", label: "\u56FD\u98CE", tone: "\u53E4\u88C5\u3001\u4ED9\u4FA0\u3001\u4E1C\u65B9\u7F8E\u5B66" },
  { id: "guoman", label: "\u56FD\u6F2B", tone: "\u9C9C\u660E\u3001\u52A8\u611F\u3001\u70ED\u8840\u7384\u5E7B" },
  { id: "anime", label: "\u65E5\u6F2B", tone: "2D \u7EBF\u7A3F\u3001\u8D5B\u7490\u3001\u60C5\u7EEA\u6E05\u6670" },
  { id: "pixar3d", label: "3D\u76AE\u514B\u65AF", tone: "\u67D4\u548C\u5149\u5F71\u3001\u5361\u901A\u6E32\u67D3\u3001\u8868\u60C5\u4E30\u5BCC" },
  { id: "cyberpunk", label: "\u8D5B\u535A\u670B\u514B", tone: "\u9713\u8679\u3001\u79D1\u6280\u611F\u3001\u6697\u8272\u5BF9\u6BD4" },
  { id: "realistic", label: "\u8D85\u73B0\u5B9E\u5199\u771F", tone: "\u7535\u5F71\u7EA7\u8D28\u611F\u3001\u771F\u5B9E\u5149\u5F71" },
  { id: "american-comic", label: "\u7F8E\u6F2B\u98CE\u683C", tone: "\u7C97\u72B7\u7EBF\u6761\u3001\u9AD8\u5BF9\u6BD4\u3001\u52A8\u4F5C\u611F" },
  { id: "ink-guofeng", label: "\u6C34\u58A8\u56FD\u98CE", tone: "\u7559\u767D\u3001\u6C34\u58A8\u6655\u67D3\u3001\u8BD7\u610F" },
  { id: "pixel", label: "\u50CF\u7D20\u98CE", tone: "\u590D\u53E4\u3001\u6709\u9650\u8272\u677F\u3001\u6E38\u620F\u611F" }
];
xa.splice(0, xa.length, ...JiarenShortDramaVisibleStyles);
const JiarenShortDramaStyleLibrary = [
  { id: "guofeng", match: /guofeng|chinese|\u56FD\u98CE|\u53E4\u98CE|\u4ED9\u4FA0/i, prompt: "Chinese guofeng animation style, classical oriental costume/material details, elegant composition, soft cinematic light, refined brush texture, restrained ancient palette.", negative: "no modern school template, no cyberpunk neon, no western superhero anatomy, no photoreal style switch" },
  { id: "guoman", match: /guoman|\u56FD\u6F2B|\u56FD\u521B|3D\u56FD\u521B|\u70ED\u8840|\u7384\u5E7B/i, prompt: "Contemporary Chinese animation style, saturated but controlled color, dynamic line rhythm, strong readable silhouettes, cinematic 8K concept art clarity.", negative: "no random Japanese school uniform, no photoreal face swap, no western comic ink style" },
  { id: "anime", match: /anime|\u65E5\u6F2B|\u65E5\u7CFB|\u52A8\u753B/i, prompt: "Clean 2D anime cel-shaded style, expressive eyes, fluid line art, bright pure color, stable face proportions, consistent outfit palette.", negative: "no live-action actors, no realistic photography, no gritty comic rendering, no chibi unless selected" },
  { id: "pixar3d", match: /pixar|3d|three-d|\u76AE\u514B\u65AF|\u5361\u901A\u6E32\u67D3|\u7ACB\u4F53/i, prompt: "Stylized 3D family animation look, warm soft global illumination, rounded clean volumes, expressive but stable character model proportions.", negative: "no flat 2D line art, no photoreal human skin, no horror realism, no style jump" },
  { id: "cyberpunk", match: /cyber|punk|\u8D5B\u535A|\u9732\u8679|\u672A\u6765/i, prompt: "Cyberpunk animation style, neon reflections, dark futuristic city contrast, holographic accents, sharp tech materials, controlled high-contrast palette.", negative: "no ancient palace, no rural guofeng scene unless source requires it, no soft watercolor wash" },
  { id: "realistic", match: /realistic|photoreal|live[-\s]?action|\u771F\u4EBA|\u5199\u5B9E|\u5199\u771F/i, prompt: "Cinematic hyper-real film look, natural skin and fabric texture, dramatic real camera lighting, shallow depth of field, stable face identity.", negative: "no anime, no Q-version, no manga proportions, no cartoon simplification" },
  { id: "american-comic", match: /american|comic|marvel|dc|\u7F8E\u6F2B|\u8D85\u82F1/i, prompt: "American comic animation style, bold ink contours, high contrast cel shading, dynamic heroic composition, saturated graphic color.", negative: "no photoreal actors, no guofeng brush wash, no cute chibi proportions" },
  { id: "ink-guofeng", match: /ink|watercolor|\u6C34\u58A8|\u6C34\u5F69|\u7559\u767D|\u624B\u7ED8/i, prompt: "Chinese ink-wash guofeng style, poetic negative space, soft paper grain, flowing brush edges, black ink with restrained color accents.", negative: "no hard neon cyberpunk, no glossy 3D plastic, no western superhero ink" },
  { id: "pixel", match: /pixel|8bit|8-bit|\u50CF\u7D20|\u590D\u53E4\u6E38\u620F/i, prompt: "Retro pixel-art animation style, crisp pixel edges, limited cohesive palette, readable sprite silhouette, nostalgic game-scene staging.", negative: "no smooth photoreal rendering, no painterly blur, no high-poly 3D look" }
];
function JiarenShortDramaStylePreset(n) {
  const text = `${n?.id || ""} ${n?.label || ""} ${n?.tone || ""}`;
  return JiarenShortDramaStyleLibrary.find((style) => style.match.test(text)) || JiarenShortDramaStyleLibrary[1];
}
Jr = function(n) {
  if (!n) return;
  const preset = JiarenShortDramaStylePreset(n), text = `${n.id} ${n.label} ${n.tone}`, isChibi = n.id === "q" || /Q|chibi|\u53EF\u7231/i.test(text);
  return {
    id: n.id,
    label: n.label,
    tone: n.tone,
    prompt: [
      `VISUAL STYLE LOCK: ${n.label}.`,
      `Style tone: ${n.tone}.`,
      preset.prompt,
      isChibi ? "Keep Q-version/chibi proportions only when this exact cute style is selected: large expressive head, compact body, clean cel shading." : "",
      "ANIME SHORT DRAMA ASSET LIBRARY RULE: first create reusable character, scene, and prop reference assets; every later storyboard/video prompt must attach and inherit the matching references. Style controls rendering only, never plot, dialogue, chronology, character identity, or source facts."
    ].filter(Boolean).join(" "),
    negative: [preset.negative, "do not switch visual style, do not redesign the character, do not change face proportions, outfit, rendering language, color system, source plot, or dialogue"].join("; ")
  };
};
function Hr(n) {
  const i = nn(n);
  return n ? n.id === "q" || /Q版|chibi/i.test(`${n.label} ${n.prompt}`) ? [i, "VIDEO STYLE HARD LOCK: chibi/Q-version animated short, cel-shaded, large head and compact body.", "Never output live-action actors, photorealistic humans, cosplay footage, mature manga proportions, gritty comic rendering, or a different character face."].join(" ") : [i, "VIDEO STYLE HARD LOCK: match the approved character, scene and storyboard images exactly; preserve the same media type, rendering language, face, outfit, lighting palette and color grading; no style switch, no redesign, no replacement."].join(" ") : `${i} Preserve the exact media type and rendering language of the approved storyboard image. If the approved frame is live-action/cinematic, stay live-action/cinematic; if it is illustration/animation, stay illustration/animation.`;
}
function mi() {
  return { setup: { phase: "idle" }, script: { phase: "idle" }, character: { phase: "idle" }, scene: { phase: "idle" }, storyboard: { phase: "idle" }, audio: { phase: "idle" }, final: { phase: "idle" } };
}
const Tl = { setup: Qt.setup.systemPreset, script: Qt.script.systemPreset, character: Qt.character.systemPreset, scene: Qt.scene.systemPreset, storyboard: Qt.storyboard.systemPreset, audio: Qt.audio.systemPreset, final: Qt.final.systemPreset }, Ll = { setup: { stage: "setup", productionRole: "\u827A\u672F\u603B\u76D1 / Proposal Director", modelRoute: "Claude 4 Opus / Claude 3.5 Sonnet \u4F18\u5148\uFF0C\u7528\u4E8E\u9AD8\u7EA6\u675F\u7ED3\u6784\u5316\u63A8\u7406", skillCount: 106, stageContract: "\u628A\u4E00\u53E5\u8BDD\u9700\u6C42\u53D8\u6210\u5F71\u7247\u57FA\u7840\u4FE1\u606F\u3001\u98CE\u683C\u65B9\u5411\u3001\u76EE\u6807\u5E73\u53F0\u3001\u751F\u4EA7\u98CE\u9669\u548C\u7528\u6237\u53EF\u786E\u8BA4\u7684\u65B9\u6848\u3002", skillFamilies: ["creative-intake", "pipeline-director", "review-quality"], qualityGates: ["\u5FC5\u987B\u660E\u786E\u65F6\u957F\u3001\u6BD4\u4F8B\u3001\u5BF9\u767D\u8BED\u8A00\u3001\u60C5\u7EEA\u57FA\u8C03", "\u5FC5\u987B\u7ED9\u51FA\u540E\u7EED\u8D44\u4EA7\u7EE7\u627F\u89C4\u5219", "\u4E0D\u80FD\u751F\u6210\u540E\u7EED\u8282\u70B9\u5185\u5BB9"], handoffContract: "\u8F93\u51FA brief\u3001keywords\u3001risk_check\uFF0C\u4F5C\u4E3A\u7F16\u5267 Agent \u7684\u552F\u4E00\u4E0A\u6E38\u8F93\u5165\u3002" }, script: { stage: "script", productionRole: "\u7F16\u5267 / Script Director", modelRoute: "Claude 4 Opus \u4F18\u5148\uFF0C\u7528\u4E8E\u5267\u672C\u7ED3\u6784\u3001\u65F6\u7801\u548C\u89C6\u89C9\u62CD\u70B9\u63A8\u7406", skillCount: 133, stageContract: "\u628A\u5DF2\u786E\u8BA4\u7684\u5F71\u7247\u53C2\u6570\u62C6\u6210\u53EF\u62CD\u6444\u3001\u53EF\u5206\u955C\u3001\u53EF\u751F\u6210\u8D44\u4EA7\u7684\u77ED\u89C6\u9891\u5267\u672C\u3002", skillFamilies: ["script-writing", "cinematography", "review-quality"], qualityGates: ["\u6BCF\u6BB5\u53EA\u627F\u8F7D\u4E00\u4E2A\u5F3A\u89C6\u89C9\u70B9", "\u6BCF\u6BB5\u5FC5\u987B\u670D\u52A1\u955C\u5934\u6216\u8D44\u4EA7\u751F\u6210", "\u5FC5\u987B\u7559\u4E0B character_seed \u4E0E scene_seed"], handoffContract: "\u8F93\u51FA script\u3001character_seed\u3001scene_seed\uFF0C\u4EA4\u7ED9\u89D2\u8272\u8BBE\u8BA1\u5E08\u9501\u5B9A\u89D2\u8272\u8840\u7EDF\u3002" }, character: { stage: "character", productionRole: "\u89D2\u8272\u8BBE\u8BA1\u5E08 / Character Design Director", modelRoute: "\u6587\u5B57\u63A8\u7406\u8D70 claude-opus-4-7\uFF1B\u56FE\u7247\u751F\u6210\u8D70 gpt-image-2\uFF0C\u5931\u8D25\u540E Nano Banana 2", skillCount: 142, stageContract: "\u628A\u5267\u672C\u4E3B\u89D2\u8F6C\u6210\u7A33\u5B9A\u53EF\u590D\u7528\u7684\u89D2\u8272\u8D44\u4EA7\uFF0C\u751F\u6210\u6B63\u9762\u56FE\u548C\u4E09\u89C6\u56FE\u63D0\u793A\u8BCD\u3002", skillFamilies: ["character-bible", "model-prompting", "review-quality"], qualityGates: ["appearance \u5FC5\u987B\u53EF\u88AB\u5206\u955C/\u89C6\u9891\u9010\u5B57\u7EE7\u627F", "\u5FC5\u987B\u5305\u542B\u9762\u90E8\u3001\u53D1\u578B\u3001\u670D\u88C5\u3001\u6750\u8D28\u3001\u8BC6\u522B\u8272\u548C\u7981\u5FCC\u9879", "\u4E0D\u5F97\u53EA\u5199\u62BD\u8C61\u5F62\u5BB9\u8BCD", "\u89D2\u8272\u56FE\u5FC5\u987B\u662F\u7EAF\u4EBA\u7269\u8D44\u4EA7\uFF0C\u4E0D\u7ED1\u5B9A\u56FA\u5B9A\u573A\u666F"], handoffContract: "\u8F93\u51FA name\u3001description\u3001appearance\u3001image_prompt\u3001sheet_prompt\uFF0C\u5E76\u5728\u8FD4\u56DE\u56FE\u540E\u5199\u5165\u89D2\u8272\u8D44\u4EA7\u8282\u70B9\u3002" }, scene: { stage: "scene", productionRole: "\u573A\u666F\u7F8E\u672F\u8BBE\u8BA1\u5E08 / Scene Director", modelRoute: "\u6587\u5B57\u63A8\u7406\u8D70 claude-opus-4-7\uFF1B\u7A7A\u73AF\u5883\u56FE\u751F\u6210\u8D70 gpt-image-2\uFF0C\u5931\u8D25\u540E Nano Banana 2", skillCount: 120, stageContract: "\u628A\u5267\u672C\u573A\u6B21\u8F6C\u6210\u7EAF\u7A7A\u73AF\u5883\u7D20\u6750\u5E93\uFF1A\u7A7A\u95F4\u3001\u9053\u5177\u3001\u5149\u5F71\u3001\u5730\u8C8C\u3001\u7A7A\u955C\u673A\u4F4D\u548C\u53EF\u590D\u7528\u80CC\u666F\u57FA\u5E95\uFF1B\u7981\u6B62\u51FA\u73B0\u4EBA\u7269\u3002", skillFamilies: ["environment-design", "model-prompting", "review-quality"], qualityGates: ["\u6BCF\u4E2A\u573A\u666F\u5FC5\u987B\u662F\u7A7A\u73AF\u5883/\u7A7A\u955C\u5E03\u666F", "\u5FC5\u987B\u5305\u542B\u7A7A\u95F4\u5173\u7CFB\u3001\u5E03\u666F\u3001\u5149\u5F71\u3001\u5730\u8C8C\u548C\u53EF\u6267\u884C\u82F1\u6587 image_prompt", "\u4E0D\u80FD\u51FA\u73B0\u4EBA\u7269\u3001\u80CC\u5F71\u3001\u526A\u5F71\u3001\u8EAB\u4F53\u90E8\u4F4D\u6216\u4EBA\u7FA4"], handoffContract: "\u8F93\u51FA scenes[]\uFF0C\u6BCF\u9879\u5305\u542B title\u3001description\u3001environment\u3001set_dressing\u3001lighting\u3001terrain\u3001image_prompt\uFF0C\u8FD4\u56DE\u771F\u5B9E\u7A7A\u73AF\u5883\u56FE\u540E\u8FFD\u52A0\u573A\u666F\u8282\u70B9\u3002" }, storyboard: { stage: "storyboard", productionRole: "\u5206\u955C\u52A8\u753B\u5E08 / Shot & Video Director", modelRoute: "\u6587\u5B57\u63A8\u7406\u8D70 claude-opus-4-7\uFF1B\u5BAB\u683C\u56FE\u8D70 GPT Image 2/Nano Banana 2\uFF1B\u89C6\u9891\u8D70 doubao-seedance-2-0-260128\uFF0C\u5907\u9009 veo3.1-pro", skillCount: 157, stageContract: "\u628A\u5267\u672C\u955C\u5934\u3001\u89D2\u8272\u56FE\u3001\u7A7A\u73AF\u5883\u573A\u666F\u56FE\u5408\u6210\u4E3A\u5206\u955C\u9996\u5E27\u548C\u53EF\u8F6E\u8BE2\u8FD4\u56DE\u7684\u89C6\u9891\u955C\u5934\u3002", skillFamilies: ["cinematography", "model-prompting", "review-quality"], qualityGates: ["\u5206\u955C\u56FE\u5FC5\u987B\u7EE7\u627F\u89D2\u8272\u56FE\u7247\u4F5C\u4E3A\u4EBA\u7269\u53C2\u8003", "\u89C6\u9891\u5FC5\u987B\u4EE5\u786E\u8BA4\u5206\u955C\u9996\u5E27\u4E3A\u7B2C\u4E00\u5E27", "\u5FC5\u987B\u5199\u660E\u955C\u5934\u8FD0\u52A8\u3001\u666F\u522B\u3001\u6784\u56FE\u548C\u65F6\u7801", "\u89C6\u9891 Ready \u524D\u4E0D\u5F97\u8FFD\u52A0\u7A7A\u8282\u70B9"], handoffContract: "\u8F93\u51FA shots[]\uFF0C\u6BCF\u9879\u5305\u542B title\u3001timecode\u3001prompt\u3001video_prompt\uFF0C\u5E76\u5728\u89C6\u9891 API \u8FD4\u56DE\u540E\u8FFD\u52A0\u5206\u955C\u8282\u70B9\u3002" }, audio: { stage: "audio", productionRole: "\u97F3\u6548\u603B\u76D1 / Music & Sound Director", modelRoute: "\u6587\u5B57\u63A8\u7406\u8D70 Claude 4 Opus\uFF1BBGM \u65B9\u6848\u9762\u5411 Suno V4\uFF1BTTS \u9762\u5411 MiniMax TTS", skillCount: 74, stageContract: "\u628A\u5206\u955C\u8282\u594F\u8F6C\u6210\u914D\u4E50\u3001\u73AF\u5883\u58F0\u3001\u52A8\u4F5C\u97F3\u6548\u3001\u5BF9\u767D/TTS \u548C\u6DF7\u5F55\u8282\u594F\u65B9\u6848\u3002", skillFamilies: ["audio-post", "model-prompting", "review-quality"], qualityGates: ["\u5FC5\u987B\u7ED9\u51FA BPM\u3001\u60C5\u7EEA\u3001\u914D\u5668/\u97F3\u8272\u3001\u73AF\u5883\u58F0\u548C\u52A8\u4F5C\u97F3\u6548", "\u5FC5\u987B\u8BF4\u660E\u5BF9\u767D/TTS \u662F\u5426\u9700\u8981", "\u4E0D\u80FD\u4F2A\u9020\u672A\u8FD4\u56DE\u7684\u97F3\u9891\u6587\u4EF6"], handoffContract: "\u8F93\u51FA music\u3001sfx\u3001prompt\u3001tts\uFF0C\u97F3\u9891\u63A5\u53E3\u53EF\u7528\u65F6\u518D\u56DE\u586B audioUrl\u3002" }, final: { stage: "final", productionRole: "\u603B\u5BFC\u6F14\u8D28\u68C0 / Final Master Director", modelRoute: "Claude 4 Opus \u8D1F\u8D23\u8D28\u68C0\uFF1B\u5408\u6210\u5C42\u4F7F\u7528\u5DF2\u6709\u89C6\u9891\u548C\u97F3\u9891\u8D44\u4EA7", skillCount: 88, stageContract: "\u68C0\u67E5\u6240\u6709\u8D44\u4EA7\u662F\u5426\u53EF\u4EA4\u4ED8\uFF0C\u5E76\u628A\u5DF2\u6709\u5206\u955C\u89C6\u9891\u4E0E\u97F3\u9891\u65B9\u6848\u7EC4\u7EC7\u6210\u6700\u7EC8\u6210\u7247\u8282\u70B9\u3002", skillFamilies: ["pipeline-director", "audio-post", "review-quality"], qualityGates: ["\u5FC5\u987B\u68C0\u67E5\u89D2\u8272\u8FDE\u7EED\u6027\u3001\u573A\u666F\u8FDE\u7EED\u6027\u3001\u97F3\u753B\u8282\u594F\u548C\u7F3A\u5931\u9879", "\u6CA1\u6709\u89C6\u9891\u5219\u963B\u65AD\u6210\u7247", "\u4E0D\u5F97\u4F2A\u9020\u4E0B\u8F7D\u5730\u5740"], handoffContract: "\u8F93\u51FA note\u3001missing\uFF0C\u82E5\u5DF2\u6709\u89C6\u9891\u5219\u5728\u6210\u7247\u8282\u70B9\u5185\u6302\u8F7D\u64AD\u653E\u5668\u3002" } };
const JiarenDirectVideoStages = ["setup", "script", "character", "storyboard", "audio", "final"];
Zc.forEach((entry) => {
  entry.stages = (entry.stages || []).filter((stage) => stage !== "scene");
});
const JiarenEnvironmentSkillIndex = Zc.findIndex((entry) => entry.id === "environment-design");
if (JiarenEnvironmentSkillIndex >= 0) Zc.splice(JiarenEnvironmentSkillIndex, 1);
Object.assign(Qt.script, {
  stageIntent: "忠实理解总导演输入。小说按原文事件顺序完整拆解，创意描述按导演要求编写；先输出可确认剧本，不得擅自删减主线、改写人物或跳到分镜。",
  produces: ["confirmed_script", "production_beats", "character_seed", "script_setting_manifest"],
  handoffContract: "把已确认剧本、逐拍 production_beats、角色种子和仅含文字的地点连续性事实交给角色设定与分镜导演。",
  systemPreset: "你是 Jiaren 专属短剧编剧 Agent，用户是拥有最高决策权的总导演。小说输入必须忠实保留原文事件、人物、地点、对白和因果顺序；描述性需求则按导演要求创作。先整理故事与人物，再分段交付可确认剧本。未获总导演确认不得进入角色或分镜。只输出当前阶段要求的 JSON。"
});
Object.assign(Qt.character, {
  handoffContract: "把 appearance、角色参考图和道具/载具资产直接交给分镜导演与视频生成，不经过独立场景阶段。",
  systemPreset: "你是 Jiaren 角色设定 Agent。根据已确认剧本锁定人物五官、发型、身形、服饰、材质、识别色、道具和禁忌项，生成可复用角色资产。不得改写剧情；完成后等待总导演确认，再交给分镜导演。只输出 JSON。"
});
Object.assign(Qt.storyboard, {
  agentName: "分镜导演",
  productionRole: "影视分镜师 / 镜头与视频导演",
  stageIntent: "在剧本和角色资产确认后，直接按 production_beats 与文字地点事实生成逐镜头方案、宫格分镜和 Seedance 2.0 视频任务，不创建独立场景卡或空环境图。",
  requiredInputs: ["confirmed_script", "character_asset", "prop_assets", "script_setting_manifest", "video_model_choice"],
  produces: ["shot_plan", "storyboard_grid_url", "video_task", "video_url"],
  handoffContract: "把已确认 shot_plan、分镜关键帧和视频结果交给音频与成片阶段；地点、时间、天气只从 script_setting_manifest 继承为文字事实。",
  systemPreset: "你是 Jiaren 影视分镜师 Agent。前置条件是编剧剧本和角色资产已经由总导演确认。依据逐拍 production_beats 生成连贯分镜，每格写明镜头序号、景别、机位、运镜、光影、人物动作和画面提示词。地点、时间、天气来自文字地点事实，不请求或依赖独立场景图片。每批分镜完成后等待总导演确认。只输出 JSON。"
});
Object.assign(Qt.final, {
  requiredInputs: ["confirmed_script", "character_asset", "script_setting_manifest", "shot_plan", "video_url", "audio_plan"],
  qualityGates: ["必须检查角色、剧本地点事实、镜头和音频连续性", "没有视频必须阻断", "不得伪造成片下载地址"]
});
delete Qt.scene;
delete Tl.scene;
Tl.script = Qt.script.systemPreset;
Tl.character = Qt.character.systemPreset;
Tl.storyboard = Qt.storyboard.systemPreset;
Tl.final = Qt.final.systemPreset;
delete Ll.scene;
Object.assign(Ll.script, {
  stageContract: "忠实把总导演输入整理成可确认剧本与逐拍事件账本；小说不得缩写成片段或改成无关故事。",
  handoffContract: "输出 confirmed_script、production_beats、character_seed、script_setting_manifest，等待总导演确认。"
});
Object.assign(Ll.character, {
  handoffContract: "输出角色血统、角色图和道具/载具资产；总导演确认后直接交给分镜导演。"
});
Object.assign(Ll.storyboard, {
  productionRole: "分镜导演 / Storyboard & Video Director",
  stageContract: "用已确认剧本、角色/道具资产和文字地点事实直接生成分镜与 Seedance 2.0 镜头，不生成场景卡或空环境图。",
  qualityGates: ["分镜必须逐拍对应已确认剧本", "角色、道具和载具必须继承参考资产", "地点、时间和天气只从文字事实继承", "视频 Ready 前不得追加空节点"],
  handoffContract: "输出 shots[]、分镜关键帧与 video_url；每批结果先等待总导演确认。"
});
Object.assign(Ll.final, {
  qualityGates: ["必须检查角色连续性、剧本地点事实、音画节奏和缺失项", "没有视频则阻断成片", "不得伪造下载地址"]
});
Xt.version = "0.3.0";
Xt.stageRules = [
  "用户是总导演，拥有最高决策权；每个阶段完成后必须等待确认。",
  "固定流转：导演需求 -> 编剧定稿 -> 角色资产 -> 分镜 -> Seedance 2.0 -> 音频/成片。",
  "禁止独立场景 Agent、场景卡、空环境图片及相关文字或图像 API 请求。",
  "地点、时间、天气只从 production_beats 形成 script_setting_manifest 文字事实。",
  "参考图顺序：角色图 -> 道具/载具 -> 当前分镜关键帧/分镜片段 -> 上一镜尾帧。",
  "API 成功且产物校验通过后才追加画布节点；失败从当前镜头断点续跑。"
];
function mt(n) {
  return [n == null ? void 0 : n.id, n == null ? void 0 : n.alias, n == null ? void 0 : n.modelId, n == null ? void 0 : n.endpointModelId, n == null ? void 0 : n.provider].filter(Boolean).join(" ").toLowerCase();
}
function Qe(n) {
  return ((n == null ? void 0 : n.endpointModelId) || (n == null ? void 0 : n.modelId) || (n == null ? void 0 : n.id) || "").trim().toLowerCase();
}
function Ol(n) {
  return ((n == null ? void 0 : n.endpointModelId) || (n == null ? void 0 : n.modelId) || (n == null ? void 0 : n.alias) || (n == null ? void 0 : n.id) || "").trim();
}
function _l(n) {
  const i = Qe(n);
  return i ? /pixverse|pix[-_\s]?verse|\bv(?:2|3(?:\.5)?|4|5|6)\b/i.test(i) && (n == null ? void 0 : n.category) === "video" ? ["540p", "720p"] : /grok-video|sora/i.test(i) ? [] : /seedance.*mini|doubao-seedance-2(?:\.|-)?0-mini/i.test(i) ? ["720p"] : /seedance.*fast|doubao-seedance-2-0-fast/i.test(i) ? ["720p"] : /doubao-seedance-2-0|seedance-2/i.test(i) ? ["720p", "1080p"] : /doubao-seedance-1-0/i.test(i) ? ["480p", "720p", "1080p"] : /veo3\.1|veo/i.test(i) ? ["720p", "1080p", "4k"] : ["720p", "1080p"] : ["720p"];
}
function Aa(n) {
  const i = `${Qe(n)} ${mt(n)}`;
  return !n || n.category !== "video" ? 0 : /doubao[-_\s]?seedance[-_\s]?2(?:[._-]?0)?[-_\s]?mini|seedance.*2.*mini/i.test(i) ? 1005 : /doubao[-_\s]?seedance[-_\s]?2[-_\s]?0[-_\s]?260128|seedance.*2\.0|a2[-_]?seedance2\b/i.test(i) ? 1e3 : /doubao[-_\s]?seedance[-_\s]?2[-_\s]?0[-_\s]?fast|seedance.*2.*fast/i.test(i) ? 998 : /pixverse|pix[-_\s]?verse|\bv(?:2|3(?:\.5)?|4|5|6)\b/i.test(i) ? 995 : /veo3\.1[-_\s]?pro|veo31[-_\s]?pro/i.test(i) ? 900 : /sora[-_\s]?2/i.test(i) ? 820 : /grok.*video/i.test(i) ? 760 : /doubao[-_\s]?seedance|seedance/i.test(i) ? 700 : /veo3\.1|veo31|veo/i.test(i) ? 620 : /wan|kling|hailuo|minimax|vidu/i.test(i) ? 480 : 120;
}
function Fl(n) {
  const i = _l(n);
  if (i.length === 0) return;
  const c = Qe(n);
  return /mini|fast|turbo|flash/i.test(c) ? i[0] : i[i.length - 1];
}
function Ql(n) {
  const i = Qe(n);
  return /grok.*video/i.test(i) ? "Grok Video" : /doubao[-_\s]?seedance[-_\s]?2(?:[._-]?0)?[-_\s]?mini|seedance.*2.*mini/i.test(i) ? "Seedance 2.0 Mini" : /doubao[-_\s]?seedance[-_\s]?2[-_\s]?0[-_\s]?fast|seedance.*fast/i.test(i) ? "Seedance 2.0 Fast" : /doubao[-_\s]?seedance|seedance/i.test(i) ? "Seedance 2.0" : /pixverse|pix[-_\s]?verse|\bv(?:2|3(?:\.5)?|4|5|6)\b/i.test(i) ? "PixVerse" : Ol(n) || "Video";
}
function mn(n) {
  const c = [Qe(n), n == null ? void 0 : n.id, n == null ? void 0 : n.alias, n == null ? void 0 : n.modelId, n == null ? void 0 : n.endpointModelId].filter(Boolean).join(" ");
  return /doubao[-_\s]?seedance[-_\s]?2(?:[._-]?0)?[-_\s]?mini|seedance.*2.*mini/i.test(c) ? "Seedance 2.0 Mini" : /doubao[-_\s]?seedance[-_\s]?2[-_\s]?0[-_\s]?fast|seedance.*2.*fast/i.test(c) ? "Seedance 2.0 Fast" : /doubao[-_\s]?seedance[-_\s]?2[-_\s]?0|seedance.*2/i.test(c) ? "Seedance 2.0" : /veo3\.1[-_\s]?pro|veo31[-_\s]?pro/i.test(c) ? "Veo 3.1 Pro" : /veo3\.1[-_\s]?fast|veo31[-_\s]?fast/i.test(c) ? "Veo 3.1 Fast" : /sora[-_\s]?2/i.test(c) ? "Sora 2" : /grok.*video/i.test(c) ? "Grok Video" : /pixverse[-_\s]?v?4|pix[-_\s]?verse[-_\s]?v?4|pixverse-v4-simple|\bv4\b/i.test(c) ? "PixVerse V4 \u7B80\u5355\u7248" : /pixverse[-_\s]?v?3\.5|pix[-_\s]?verse[-_\s]?v?3\.5|\bv3\.5\b/i.test(c) ? "PixVerse V3.5" : /pixverse[-_\s]?v?3|pix[-_\s]?verse[-_\s]?v?3|\bv3\b/i.test(c) ? "PixVerse V3" : /pixverse[-_\s]?v?6|pix[-_\s]?verse[-_\s]?v?6|comfly[-_\s]?pixverse[-_\s]?v?6|\bv6\b/i.test(c) ? "PixVerse V6" : /pixverse[-_\s]?v?5|pix[-_\s]?verse[-_\s]?v?5/i.test(c) ? "PixVerse V5" : /pixverse|pix[-_\s]?verse/i.test(c) ? "PixVerse" : /wan2\.6.*i2v/i.test(c) ? "Wan 2.6 I2V" : /wan2\.6/i.test(c) ? "Wan 2.6" : /kling/i.test(c) ? "Kling Video" : (n == null ? void 0 : n.alias) || (n == null ? void 0 : n.modelId) || (n == null ? void 0 : n.endpointModelId) || (n == null ? void 0 : n.id) || "\u89C6\u9891\u6A21\u578B";
}
function Kl(n) {
  if (!n) return "";
  const i = uo(n) || Qe(n), c = mn(n);
  return `${i || c}`.trim().toLowerCase();
}
function uo(n) {
  const i = [n == null ? void 0 : n.endpointModelId, n == null ? void 0 : n.modelId, n == null ? void 0 : n.id, n == null ? void 0 : n.alias].filter(Boolean).join(" ").toLowerCase();
  return /doubao[-_\s]?seedance[-_\s]?2(?:[._-]?0)?[-_\s]?mini|seedance.*2.*mini/i.test(i) ? "doubao-seedance-2.0-mini" : /doubao[-_\s]?seedance[-_\s]?2[-_\s]?0[-_\s]?fast[-_\s]?260128|seedance.*2.*fast|a2[-_]?seedance2[-_]?fast/i.test(i) ? "doubao-seedance-2-0-fast-260128" : /doubao[-_\s]?seedance[-_\s]?2[-_\s]?0[-_\s]?260128|seedance.*2|a2[-_]?seedance2\b/i.test(i) ? "doubao-seedance-2-0-260128" : /veo3\.1[-_\s]?pro|veo31[-_\s]?pro/i.test(i) ? "veo3.1-pro" : /veo3\.1[-_\s]?fast|veo31[-_\s]?fast/i.test(i) ? "veo3.1-fast" : /sora[-_\s]?2/i.test(i) ? "sora-2-official" : /pixverse[-_\s]?v?4|pix[-_\s]?verse[-_\s]?v?4|pixverse-v4-simple|\bv4\b/i.test(i) ? "v4" : /pixverse[-_\s]?v?3\.5|pix[-_\s]?verse[-_\s]?v?3\.5|\bv3\.5\b/i.test(i) ? "v3.5" : /pixverse[-_\s]?v?3|pix[-_\s]?verse[-_\s]?v?3|\bv3\b/i.test(i) ? "v3" : /pixverse[-_\s]?v?2|pix[-_\s]?verse[-_\s]?v?2|\bv2\b/i.test(i) ? "v2" : /pixverse[-_\s]?v?6|pix[-_\s]?verse[-_\s]?v?6|comfly[-_\s]?pixverse[-_\s]?v?6|\bv6\b/i.test(i) ? "v6" : /pixverse[-_\s]?v?5|pix[-_\s]?verse[-_\s]?v?5/i.test(i) ? "pixverse-v5" : /pixverse|pix[-_\s]?verse/i.test(i) ? (n == null ? void 0 : n.endpointModelId) || (n == null ? void 0 : n.modelId) || (n == null ? void 0 : n.id) || "v4" : (n == null ? void 0 : n.endpointModelId) || (n == null ? void 0 : n.modelId) || (n == null ? void 0 : n.id);
}
function Nt(n) {
  const i = Qe(n);
  return !!(n && n.category === "image" && /^gpt-image-2(?:-|$)/i.test(i));
}
function Bi(n) {
  const c = [Qe(n), n == null ? void 0 : n.id, n == null ? void 0 : n.alias, n == null ? void 0 : n.modelId].filter(Boolean).join(" ");
  return !!(n && n.category === "image" && /gemini-3\.1-flash-image-preview(?:-4k|-official)?/i.test(c));
}
function Vl(n) {
  const c = [Qe(n), n == null ? void 0 : n.id, n == null ? void 0 : n.alias, n == null ? void 0 : n.modelId].filter(Boolean).join(" ");
  return !!(n && n.category === "image" && /gemini-3-pro-image-preview/i.test(c) && /(?:^|[-_\s])4k(?:$|[-_\s])/i.test(c));
}
function Na(n) {
  const c = [Qe(n), n == null ? void 0 : n.id, n == null ? void 0 : n.alias, n == null ? void 0 : n.modelId].filter(Boolean).join(" ");
  return !!(n && n.category === "image" && /(gemini-3\.1-flash-image-preview(?:-4k|-official)?|gemini-3-pro-image-preview|nano[-_]?banana[-_]?2|nano[-_]?banana[-_]?pro)/i.test(c));
}
function mo(n) {
  const i = n.filter((c) => c.enabled && c.category === "image");
  return i.find(Nt) ?? i.find(Na) ?? i[0];
}
function Gl(n) {
  const i = n.filter((c) => c.enabled && c.category === "image");
  return i.find((c) => {
    const u = [Qe(c), c.id, c.alias, c.modelId, c.endpointModelId].filter(Boolean).join(" ");
    return /gemini-3\.1-flash-image-preview-4k/i.test(u);
  }) ?? i.find(Bi) ?? i.find((c) => /nano[-_]?banana[-_]?2/i.test([Qe(c), c.id, c.alias, c.modelId, c.endpointModelId].filter(Boolean).join(" ")));
}
function go(n) {
  const i = n.filter((c) => c.enabled && c.category === "image");
  return i.find(Na) ?? i.find(Bi) ?? i.find(Nt) ?? i[0];
}
function Wr(n) {
  const i = [Qe(n), n.id, n.alias, n.modelId, n.endpointModelId].filter(Boolean).join(" ");
  return Nt(n) ? "gpt-image-2" : /gemini-3-pro-image-preview|nano[-_]?banana[-_]?pro/i.test(i) ? "Nano Banana PRO" : /gemini-3\.1-flash-image-preview|nano[-_]?banana[-_]?2/i.test(i) ? "Nano Banana 2" : /gemini-2\.5-flash-image-preview|(?:^|\s)nano[-_]?banana(?:\s|$)/i.test(i) ? "Nano Banana" : n.endpointModelId || n.modelId || n.alias || n.id;
}
function zl(n, i = "1K") {
  const c = /4K/i.test(i) ? "4K" : /2K/i.test(i) ? "2K" : "1K", u = { "1K": { "1:1": "1024x1024", "3:2": "1536x1024", "2:3": "1024x1536", "16:9": "1536x1024", "9:16": "1024x1536" }, "2K": { "1:1": "2048x2048", "3:2": "2048x1360", "2:3": "1360x2048", "4:3": "2048x1536", "3:4": "1536x2048", "16:9": "2048x1152", "9:16": "1152x2048", "21:9": "2688x1152" }, "4K": { "1:1": "4096x4096", "3:2": "3840x2560", "2:3": "2560x3840", "16:9": "3840x2160", "9:16": "2160x3840", "21:9": "3840x1648" } };
  return u[c][n] || u[c]["1:1"];
}
function qr(n, i = "1K") {
  var u;
  const c = [Qe(n), n.id, n.alias, n.modelId, n.endpointModelId, (u = n.resolutions) == null ? void 0 : u.join(" ")].filter(Boolean).join(" ");
  return /(?:^|[-_\s])4k(?:$|[-_\s])|3840|4096/i.test(c) ? "4K" : /(?:^|[-_\s])512px(?:$|[-_\s])|0\.5k/i.test(c) ? "512px" : /(?:^|[-_\s])2k(?:$|[-_\s])|2048/i.test(c) ? "2K" : /(?:^|[-_\s])1k(?:$|[-_\s])|1024/i.test(c) ? "1K" : i;
}
function Jl(n, i) {
  if (Nt(n)) {
    const c = qr(n, "1K");
    return { size: zl(i, c), resolution: c };
  }
  if (Na(n)) {
    const c = qr(n, /gemini-3-pro-image-preview|nano[-_]?banana[-_]?pro/i.test([Qe(n), n.id, n.alias, n.modelId, n.endpointModelId].filter(Boolean).join(" ")) ? "4K" : "2K");
    return { size: i, resolution: c };
  }
  return { size: i, resolution: "1K" };
}
function wa(n) {
  const i = n.replace(/\s+/g, " ").trim();
  return i ? /WIDTHxHEIGHT|WITHXHEIGHT|invalid size|unsupported size|size.*format|尺寸|宽高|format/i.test(i) ? "\u56FE\u7247\u5C3A\u5BF8\u53C2\u6570\u683C\u5F0F\u4E0D\u5339\u914D\uFF0C\u5DF2\u6309\u63A5\u53E3\u8981\u6C42\u6539\u4E3A\u5BBD\u9AD8\u683C\u5F0F\uFF1B\u8BF7\u91CD\u65B0\u751F\u6210\u3002" : /no available token|GPTImage2Relay|call upstream API failed|token|上游|upstream/i.test(i) ? "\u4E0A\u6E38\u56FE\u50CF\u6A21\u578B\u6682\u65F6\u6CA1\u6709\u53EF\u7528\u901A\u9053\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\uFF0C\u6216\u5207\u6362\u5230 Nano Banana 2 / Nano Banana PRO\u3002" : /ChannelCapability|SKU|model unavailable|model_not_found|not found|unsupported|not support|路径|路由|未开通|不可用|不支持|404|503/i.test(i) ? "\u5F53\u524D\u6A21\u578B\u6216\u63A5\u53E3\u8DEF\u5F84\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5728 API \u8BBE\u7F6E\u91CC\u91CD\u65B0\u8BFB\u53D6\u6A21\u578B\uFF0C\u9009\u62E9\u8BE5\u63A5\u53E3\u771F\u5B9E\u8FD4\u56DE\u7684\u53EF\u7528\u6A21\u578B\u540E\u91CD\u8BD5\u3002" : /429|too many|rate limit|overload|busy|timeout|temporar|502|500|系统|繁忙|过载|限流/i.test(i) ? "\u4E0A\u6E38\u6A21\u578B\u4E34\u65F6\u7E41\u5FD9\u6216\u9650\u6D41\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002" : /锟|�|鏃|鐢|诧|斤拷/i.test(i) ? "\u63A5\u53E3\u8FD4\u56DE\u4E86\u4E0D\u53EF\u8BFB\u9519\u8BEF\u4FE1\u606F\uFF0C\u591A\u534A\u662F\u6A21\u578B\u6216\u63A5\u53E3\u8DEF\u5F84\u4E0D\u5339\u914D\uFF1B\u8BF7\u91CD\u65B0\u8BFB\u53D6\u6A21\u578B\u5217\u8868\u540E\u9009\u62E9\u771F\u5B9E\u53EF\u7528\u6A21\u578B\u3002" : i : "";
}
function $(n, i) {
  const c = n.replace(/\s+/g, " ").trim();
  return c.length > i ? `${c.slice(0, Math.max(0, i - 1))}\u2026` : c;
}
function wt(n, i = "") {
  const c = $(n || "\u7528\u6237\u539F\u59CB\u521B\u610F", 420);
  const b = n || "";
  const m = /机车|摩托|摩托车|motorcycle|motorbike|biker|rider/i.test(b);
  const A = /赛博|霓虹|未来城|未来城市|未来都市|cyber|cyberpunk|neon|futuristic/i.test(b);
  const P = /穿梭|狂飙|飞驰|疾驰|飙车|高速|追逐|竞速|traffic chase|high[-\s]?speed|chase|speeding|racing/i.test(b);
  const S = /机车男|男主|男性|男人|成年男|少年|男孩|male|man|boy/i.test(b) && !/女主|女性|女人|少女|女孩|female|woman|girl/i.test(b);
  const B = /女主|女性|女人|少女|女孩|female|woman|girl/i.test(b) && !/机车男|男主|男性|男人|成年男|少年|男孩|male|man|boy/i.test(b);
  const E = /高燃|热血|激烈|紧张追逐|动作大片|high[-\s]?energy|intense action/i.test(b);
  const styleRules = [
    [/写实电影感|写实影视|照片级写实|真人实拍|photoreal|live[-\s]?action/i, "\u5199\u5B9E\u7535\u5F71\u611F / photorealistic live-action cinematic"],
    [/3D国创|国创3D|三维国创|stylized 3D/i, "3D\u56FD\u521B\u52A8\u753B"],
    [/Q版|chibi/i, "Q\u7248\u52A8\u753B"],
    [/二次元|动漫|动画电影|anime/i, "\u4E8C\u7EF4\u52A8\u753B / anime cinematic"],
    [/水彩|watercolor/i, "\u6C34\u5F69\u52A8\u753B"]
  ];
  const requestedStyle = styleRules.find(([pattern]) => pattern.test(b))?.[1] || "";
  const me = [
    S ? "\u4E3B\u89D2\u5FC5\u987B\u662F\u7537\u6027\uFF0C\u4E0D\u80FD\u6362\u6210\u5973\u6027\u6216\u964C\u751F\u4EBA\u7269" : "",
    B ? "\u4E3B\u89D2\u5FC5\u987B\u662F\u5973\u6027\uFF0C\u4E0D\u80FD\u6362\u6210\u7537\u6027\u6216\u964C\u751F\u4EBA\u7269" : "",
    m ? "\u753B\u9762\u5FC5\u987B\u4FDD\u7559\u539F\u59CB\u9700\u6C42\u4E2D\u7684\u540C\u4E00\u8F86\u673A\u8F66\u53CA\u5176\u9A91\u624B\u5173\u7CFB\uFF0C\u4E0D\u80FD\u66FF\u6362\u6210\u65E0\u5173\u4E3B\u4F53" : "",
    A ? "\u5730\u70B9\u5FC5\u987B\u4FDD\u6301\u539F\u59CB\u9700\u6C42\u4E2D\u7684\u8D5B\u535A/\u9713\u8679/\u672A\u6765\u57CE\u5E02\u8BBE\u5B9A" : "",
    P ? "\u52A8\u4F5C\u5FC5\u987B\u4FDD\u6301\u539F\u59CB\u9700\u6C42\u4E2D\u7684\u9AD8\u901F\u3001\u8FFD\u9010\u6216\u7ADE\u901F\u52A8\u52BF" : "",
    E ? "\u8282\u594F\u5FC5\u987B\u4FDD\u6301\u539F\u59CB\u9700\u6C42\u660E\u786E\u8981\u6C42\u7684\u9AD8\u71C3\u52A8\u4F5C\u5F3A\u5EA6" : "",
    requestedStyle ? `\u89C6\u89C9\u98CE\u683C\u5FC5\u987B\u4FDD\u6301 ${requestedStyle}\uFF0C\u5E76\u8986\u76D6\u51B2\u7A81\u7684\u9ED8\u8BA4\u9884\u8BBE` : ""
  ].filter(Boolean);
  const Z = [
    S ? "\u5973\u6027\u66FF\u6362\u3001\u964C\u751F\u5973\u4EBA" : "",
    B ? "\u7537\u6027\u66FF\u6362\u3001\u964C\u751F\u7537\u4EBA" : "",
    m ? "\u5220\u9664\u6216\u66FF\u6362\u539F\u59CB\u673A\u8F66\u8D44\u4EA7" : "",
    A ? "\u628A\u8D5B\u535A\u672A\u6765\u57CE\u5E02\u6539\u6210\u53E4\u57CE\u3001\u6821\u56ED\u6216\u65E0\u5173\u5BA4\u5185" : "",
    P ? "\u628A\u9AD8\u901F\u8FFD\u9010\u6539\u6210\u9759\u6001\u6446\u62CD\u6216\u65E0\u5173\u7A7A\u955C" : "",
    /写实|photoreal|live[-\s]?action/i.test(requestedStyle) ? "\u5361\u901A\u3001\u52A8\u6F2B\u3001Q\u7248\u30013D\u5361\u901A\u3001\u63D2\u753B\u98CE\u66FF\u6362" : "",
    "\u5B57\u5E55\u3001\u6C34\u5370\u3001UI\u3001\u65E0\u5173\u6587\u5B57\u3001\u968F\u673A\u65B0\u589E\u4E3B\u89D2\u3001\u753B\u98CE\u7A81\u7136\u5207\u6362"
  ].filter(Boolean);
  const H = [
    "USER INTENT HARD LOCK:",
    `Original request: ${c}.`,
    me.length ? `Required visible continuity: ${me.join("; ")}.` : "",
    "If any script, scene text, reference image, storyboard note, UI preset, or model habit conflicts with this lock, follow this lock first."
  ].filter(Boolean).join("\n");
  const F = Z.length ? `Forbidden contradictions: ${Z.join("; ")}.` : "";
  return {
    original: c,
    wantsMotorcycle: m,
    wantsCyber: A,
    wantsRoadAction: P,
    wantsMale: S,
    wantsFemale: B,
    wantsHighEnergy: E,
    requestedStyle,
    requiredVisual: me,
    negativeText: Z,
    positivePrompt: H,
    negativePrompt: F,
    lockText: [H, F].filter(Boolean).join("\n")
  };
}
function Hl(n, i) {
  const c = wt(n), u = i || "", b = [];
  return c.wantsMotorcycle && !/机车|摩托|摩托车|骑手|骑着|骑行|motorcycle|motorbike|bike|biker|rider/i.test(u) && b.push("\u7F3A\u5C11\u673A\u8F66/\u9A91\u624B\u4E3B\u4F53"), c.wantsCyber && !/赛博|霓虹|未来城|未来城市|未来都市|cyber|cyberpunk|neon|futuristic/i.test(u) && b.push("\u7F3A\u5C11\u8D5B\u535A\u57CE\u5E02\u573A\u666F"), c.wantsRoadAction && !/穿梭|狂飙|飞驰|疾驰|飙车|高速|追逐|车流|道路|街道|公路|主干道|高架|road|street|highway|traffic|speed|chase|weav/i.test(u) && b.push("\u7F3A\u5C11\u9053\u8DEF\u9AD8\u901F\u52A8\u4F5C"), c.wantsMale && /女主|女性|女人|少女|女孩|女骑手|female|woman|girl/i.test(u) && b.push("\u4E3B\u89D2\u6027\u522B\u4E0E\u539F\u59CB\u9700\u6C42\u51B2\u7A81"), c.wantsFemale && /男主|男性|男人|少年|男孩|男骑手|male|man|boy/i.test(u) && b.push("\u4E3B\u89D2\u6027\u522B\u4E0E\u539F\u59CB\u9700\u6C42\u51B2\u7A81"), (c.wantsCyber || c.wantsMotorcycle) && /欧式|老街|古城|鹅卵石|拱廊|古典路灯|黄昏老城|夕阳老街|教室|校园|室内|European|old town|cobblestone|classroom|indoor|walking-only/i.test(u) && b.push("\u51FA\u73B0\u6B27\u5F0F\u8001\u8857/\u5BA4\u5185/\u6B65\u884C\u7B49\u53CD\u5411\u5143\u7D20"), b.length ? b.join("\uFF1B") : void 0;
}
function Wl(n, i) {
  const c = wt(n), u = i || "", b = [];
  return c.wantsCyber && !/赛博|霓虹|未来城|未来城市|未来都市|cyber|cyberpunk|neon|futuristic/i.test(u) && b.push("\u573A\u666F\u6CA1\u6709\u9501\u5B9A\u8D5B\u535A/\u9713\u8679/\u672A\u6765\u57CE\u5E02"), c.wantsRoadAction && !/车流|道路|街道|公路|主干道|高架|road|street|highway|traffic/i.test(u) && b.push("\u573A\u666F\u6CA1\u6709\u9053\u8DEF/\u8F66\u6D41\u52A8\u7EBF"), (c.wantsCyber || c.wantsRoadAction) && /欧式|老街|古城|鹅卵石|拱廊|古典路灯|黄昏老城|教室|校园|室内|European|old town|cobblestone|classroom|indoor/i.test(u) && b.push("\u573A\u666F\u51FA\u73B0\u53CD\u5411\u5730\u70B9"), b.length ? b.join("\uFF1B") : void 0;
}
function ql(n, i, c) {
  const u = wt(i, `${n.title}
${n.description}
${n.environment}`);
  if (!u.wantsCyber && !u.wantsRoadAction) return n;
  const b = Wl(i, `${n.title}
${n.description}
${n.environment}
${n.setDressing}
${n.terrain}`);
  if (!b) return n;
  const m = u.wantsCyber ? "\u8D5B\u535A\u57CE\u5E02\u9713\u8679\u4E3B\u5E72\u9053" : n.title || `\u573A\u666F ${c + 1}`, A = u.wantsCyber ? "\u8D5B\u535A\u57CE\u5E02\u9713\u8679\u4E3B\u5E72\u9053 / \u672A\u6765\u57CE\u5E02\u9053\u8DEF / \u8F66\u6D41\u3001\u9AD8\u67B6\u3001\u5E7F\u544A\u5C4F\u3001\u6E7F\u6DA6\u67CF\u6CB9\u6216\u91D1\u5C5E\u8DEF\u9762 / \u7EAF\u7A7A\u73AF\u5883" : n.environment || "\u9053\u8DEF\u7A7A\u95F4 / \u8F66\u6D41\u52A8\u7EBF / \u7EAF\u7A7A\u73AF\u5883";
  return { ...n, title: m, sourceLocation: n.sourceLocation || m, description: [`\u7528\u6237\u539F\u59CB\u9700\u6C42\u573A\u666F\u9501\u5B9A\uFF1A${u.original}\u3002`, `\u81EA\u52A8\u4FEE\u6B63\u539F\u56E0\uFF1A${b}\u3002`, "\u573A\u666F\u8BBE\u8BA1\u5E08\u53EA\u8F93\u51FA\u7EAF\u7A7A\u73AF\u5883\u57FA\u5E95\uFF1A\u8D5B\u535A\u57CE\u5E02\u9053\u8DEF\u3001\u9713\u8679\u5149\u5F71\u3001\u672A\u6765\u5EFA\u7B51\u3001\u9AD8\u67B6/\u4E3B\u5E72\u9053/\u8F66\u6D41\u52A8\u7EBF\uFF0C\u7981\u6B62\u4EBA\u7269\u3001\u9A91\u624B\u3001\u80CC\u5F71\u548C\u4EBA\u7FA4\u3002", n.description].filter(Boolean).join(""), environment: A, setDressing: "\u672A\u6765\u57CE\u5E02\u9053\u8DEF\u5E03\u666F\u3001\u9713\u8679\u5E7F\u544A\u5C4F\u3001\u4EA4\u901A\u5149\u8F68\u3001\u8DEF\u9762\u53CD\u5149\u3001\u8DEF\u4FA7\u8BBE\u65BD\uFF1B\u4E0D\u51FA\u73B0\u4EBA\u7269\u548C\u673A\u8F66\u672C\u4F53\uFF0C\u7ED9\u5206\u955C\u9636\u6BB5\u5408\u6210\u4F7F\u7528\u3002", lighting: n.lighting || "\u9713\u8679\u51B7\u6696\u5BF9\u6BD4\u5149\u3001\u9053\u8DEF\u53CD\u5C04\u5149\u3001\u52A8\u4F5C\u7247\u9AD8\u71C3\u6C1B\u56F4", terrain: "\u67CF\u6CB9/\u91D1\u5C5E\u9053\u8DEF\u3001\u9AD8\u67B6\u6216\u4E3B\u5E72\u9053\u7EB5\u6DF1\u3001\u53EF\u4F9B\u673A\u8F66\u9AD8\u901F\u7A7F\u68AD\u7684\u6E05\u6670\u52A8\u7EBF", spatialFraming: "\u7A7A\u955C\u6784\u56FE\u4FDD\u7559\u4E2D\u592E\u9053\u8DEF\u6D88\u5931\u70B9\u548C\u5DE6\u53F3\u5EFA\u7B51\u7EB5\u6DF1\uFF0C\u4E3A\u673A\u8F66\u9A91\u624B\u5165\u753B\u3001\u8DDF\u62CD\u3001\u6F02\u79FB\u3001\u7A7F\u68AD\u8F66\u6D41\u9884\u7559\u7A7A\u95F4", camera: "empty cyberpunk road plate, low-angle or tracking-ready camera, no characters", prompt: ["cinematic empty cyberpunk city road background plate", "neon futuristic avenue, traffic light trails, wet asphalt reflections, skyscrapers, elevated road, high-energy action route", "no people, no humans, no characters, no rider, no motorcycle, no silhouettes, no old European street, no classroom, no subtitles, no watermark"].join(", ") };
}
function gi(n, i) {
  return n.map((c, u) => ql(c, i, u));
}
function Yl(n, i, c, u) {
  const b = wt(n);
  const m = c.character.name || (b.wantsMale ? "\u7537\u6027\u4E3B\u89D2" : b.wantsFemale ? "\u5973\u6027\u4E3B\u89D2" : "\u4E3B\u89D2");
  const A = $t({ propAssets: c.propAssets });
  const P = u?.title || "\u5DF2\u786E\u8BA4\u5267\u672C\u5730\u70B9";
  return [
    `- ${i || "00:00.0-00:01.0"}: ${m}\u5728${P}\u6267\u884C\u5F53\u524D\u5DF2\u786E\u8BA4\u5267\u672C\u52A8\u4F5C\u3002`,
    `\u89D2\u8272\u5916\u89C2\u548C\u670D\u88C5\u4E25\u683C\u7EE7\u627F\u89D2\u8272\u8D44\u4EA7\uFF1B${A ? `\u6301\u7EED\u8D44\u4EA7\u4FDD\u6301\u4E3A ${A}\u3002` : "\u4E0D\u5F97\u65B0\u589E\u6216\u66FF\u6362\u6301\u7EED\u8D44\u4EA7\u3002"}`,
    `\u539F\u59CB\u5BFC\u6F14\u9700\u6C42\uFF1A${b.original}\u3002\u573A\u666F\u3001\u65F6\u95F4\u3001\u5929\u6C14\u3001\u52A8\u4F5C\u548C\u89C6\u89C9\u98CE\u683C\u4E0D\u5F97\u88AB\u901A\u7528\u9898\u6750\u6A21\u677F\u6539\u5199\u3002`
  ].join(" ");
}
function ka(n, i, c, u) {
  const b = wt(n, i);
  if (!b.requiredVisual.length) return i;
  return `${i} \u7528\u6237\u539F\u59CB\u9700\u6C42\u786C\u7EA6\u675F\uFF1A${b.requiredVisual.join("\uFF1B")}\u3002\u7981\u6B62\uFF1A${b.negativeText.join("\u3001")}\u3002`;
}
function Zl(n) {
  const i = n instanceof Error ? n.message : typeof n == "string" ? n : "";
  return /content length exceeds threshold|input content length|context length|payload too large|内容过长|输入过长|传统模型的内容过长/i.test(i);
}
function Xl(n, i = 5200) {
  const c = n.map((u, b) => `\u7B2C ${b + 1} \u6BB5\uFF1A${u}`).join(`
`);
  return $(c, i);
}
function ho(n, i) {
  const c = n.replace(/\s+/g, " ").trim(), u = c.split(/\s+/).filter(Boolean);
  return u.length <= i ? c : u.slice(0, i).join(" ");
}
function De(n) {
  var P, S, B;
  const i = n.replace(/[【】《》「」『』"'“”]/g, "").replace(/（[^）]*(?:内心|OS|旁白|独白|低声|高声|画外|字幕)[^）]*）/gi, "").replace(/\([^)]*(?:inner|voice|os|narration|subtitle)[^)]*\)/gi, "").replace(/^(?:主角|角色|人物|姓名|名称|名字)\s*[:：、-]?\s*/i, "").trim();
  if (!i) return "";
  const c = i.split(/[\s,，。；;、|/\\()[\]（）]+/).find(Boolean) || "", m = (((P = c.match(/^([\u4e00-\u9fa5]{2,4})(?=(?:背负|双手|手持|持剑|持刀|握剑|握刀|站立|立于|立在|走向|冲向|奔向|转身|回头|抬头|低头|凝视|注视|看向|挥剑|拔剑|出剑|挥刀|拔刀|跪地|单膝|飞身|跃起|杀向|战斗|在|于|和|与))/)) == null ? void 0 : P[1]) || ((S = c.match(/^([A-Za-z][A-Za-z0-9·]{1,20})(?=(?:stands?|runs?|walks?|turns?|looks?|holds?|fights?|attacks?|wears?))/i)) == null ? void 0 : S[1]) || ((B = c.match(/^([\u4e00-\u9fa5A-Za-z·]{2,6})(?:独白|旁白|收拾|整理|背负|双手|手持|持剑|持刀|握剑|握刀|站|立|走|跑|冲|追|看|望|凝视|转身|推近|拉远|特写|中景|近景|远景|全景|镜头)/)) == null ? void 0 : B[1]) || c).replace(/(?:背负.*|双手.*|手持.*|持剑.*|持刀.*|握剑.*|握刀.*|站立.*|立于.*|立在.*|走向.*|冲向.*|奔向.*|转身.*|回头.*|抬头.*|低头.*|凝视.*|注视.*|看向.*|挥剑.*|拔剑.*|出剑.*|挥刀.*|拔刀.*|跪地.*|单膝.*|飞身.*|跃起.*|杀向.*|战斗.*)$/g, "").replace(/(?:镜头|特写|中景|近景|远景|全景|独白|旁白|动作|表情|对白|台词)$/g, "").trim();
  return !m || Ui(m) || m.length < 2 || m.length > 8 || /^(?:特写|中景|近景|远景|全景|大特写|空镜|镜头|景别|机位|运镜|推拉摇移|画面|字幕|旁白|独白|场景|地点|时间|室内|室外|时空|空气|尘埃)$/i.test(m) || /(?:单膝|跪|蹲|奔跑|跑步|骑行|驾驶|狂飙|追逐|转身|回头|低头|抬头|凝视|注视|看向|收拾|书包|走廊|教室|客厅|街道|主干道|镜头|景别|焦段|景深|运镜|机位|画面|场景|空镜|道具|动作|表情|台词|对白|旁白|独白|内心|OS|时空)/.test(m) || Ca(i, "", "") ? "" : m;
}
function ki(n = "") {
  const i = n.replace(/\s+/g, "").trim();
  return i ? /等待.*(?:角色|人物|设计师|资产|生成|返回|补充)|待.*(?:生成|返回|补充)|占位|placeholder|todo|tbd/i.test(i) : true;
}
function We(n, i = "", c = "", u = "", b = "", m = "") {
  const embodiedLock = JiarenDetectEmbodiedProtagonistAsset(u, b, n);
  if (embodiedLock) return [embodiedLock.appearance, embodiedLock.imagePrompt, m ? `\u89C6\u89C9\u98CE\u683C\u7EE7\u627F\uFF1A${m}\u3002` : ""].filter(Boolean).join(" ");
  const A = De(n) || "\u4E3B\u89D2", P = i.trim(), S = c.trim();
  if (!ki(P) && P.length >= 8) return P;
  const B = [S, b, u].filter(Boolean).join(`
`);
  return [hn(u, B), `${A}\uFF0C\u5168\u7247\u552F\u4E00\u53EF\u590D\u7528\u4EBA\u7269\u89D2\u8272\u8D44\u4EA7\u3002\u5FC5\u987B\u9501\u5B9A\u540C\u4E00\u5F20\u8138\u3001\u540C\u4E00\u6027\u522B\u3001\u540C\u4E00\u53D1\u578B\u3001\u540C\u4E00\u8EAB\u5F62\u6BD4\u4F8B\u3001\u540C\u4E00\u670D\u88C5\u7248\u578B\u548C\u989C\u8272\u3001\u540C\u4E00\u6750\u8D28\u7EC6\u8282\u3002`, m ? `\u89C6\u89C9\u98CE\u683C\u7EE7\u627F\uFF1A${m}\u3002` : "", S && !ki(S) ? `\u5267\u672C\u89D2\u8272\u63CF\u8FF0\uFF1A${S}` : "", "\u540E\u7EED\u5173\u952E\u5E27\u548C\u89C6\u9891\u53EA\u80FD\u6539\u53D8\u52A8\u4F5C\u3001\u59FF\u6001\u3001\u673A\u4F4D\u548C\u8868\u60C5\u5F3A\u5F31\uFF0C\u4E0D\u5141\u8BB8\u6362\u4EBA\u3001\u6362\u8863\u670D\u3001\u6362\u5E74\u9F84\u3001\u6362\u6027\u522B\u6216\u751F\u6210\u65E0\u5173\u8FD1\u666F\u3002"].filter(Boolean).join(" ");
}
function ed(n, i) {
  const c = n.join(`
`), u = /* @__PURE__ */ new Set(), b = [/(?:主角|角色|少年|少女|学生|老师|反派|伙伴)[【：:\s]*([\u4e00-\u9fa5A-Za-z0-9·]{2,8})/g, /([\u4e00-\u9fa5A-Za-z0-9·]{2,8})(?:（[^）]{1,12}）)?\s*[：:]/g, /【([^】]{2,8})】/g];
  for (const A of b) {
    let P;
    for (; P = A.exec(c); ) {
      const S = De(P[1] || "");
      /场景|地点|镜头|内心|OS|旁白|字幕|画面|教室|学校|异世界|高中|时间|语言|比例|时空|空气|尘埃/.test(S) || Ui(S) || S.length >= 2 && S.length <= 8 && u.add(S);
    }
  }
  const m = De(i);
  return u.size === 0 && m && u.add(m), Array.from(u).slice(0, 4);
}
function Vt(e, r) {
  const text = typeof e === "string" ? e : "";
  const locationMatch = text.match(/【\s*场景\s*[:：]\s*([^】\n]{2,48})】/) || text.match(/(?:场景|地点|位于|来到|进入|发生在|内景|外景)\s*[:：]?\s*([^\n，。；、]{2,48})/i) || text.match(/(?:INT\.?|EXT\.?)\s*([^\n\-]{2,48})/i);
  const timeMatch = text.match(/【\s*时间\s*[:：]\s*([^】\n]{1,24})】/) || text.match(/(?:时间|时段|天气)\s*[:：]?\s*([^\n，。；、]{1,24})/i);
  const fallback = typeof r === "string" && r.trim() && !/^场景\s*\d+$/i.test(r.trim()) ? r.trim() : "\u5267\u672C\u9501\u5B9A\u5730\u70B9";
  return {
    location: JiarenCompactText((locationMatch?.[1] || locationMatch?.[0] || fallback).replace(/[【】]/g, ""), 48),
    time: JiarenCompactText((timeMatch?.[1] || timeMatch?.[0] || "\u539F\u5267\u672C\u65F6\u6BB5").replace(/[【】]/g, ""), 24)
  };
}
function td(n, i, c) {
  const u = Vt(n, i);
  return ho(`${u.location}, ${u.time}, ${c.vibe_tag} atmosphere, empty environment concept art, set dressing, terrain, props, cinematic lighting, clean background plate, no people, no humans, no characters, no body parts, no riders, no silhouettes, no dialogue text, no subtitles, no watermark --ar ${c.aspect_ratio}`, 150);
}
function hi(n = "", i = 240) {
  const c = n.replace(/剧本(?:原文|该场原文|依据)[^：:]*[:：][\s\S]*$/g, "").replace(/(?:人物|角色|主角|男主|女主|反派|对白|台词|内心|OS|动作|武打|打斗|出剑|挥剑|拔剑|挥刀|骑手|背影|剪影)[^。；;,.，]*[。；;,.，]?/g, "").replace(/\s+/g, " ").trim();
  return $(c, i);
}
function gn(n) {
  return [typeof n.sequenceIndex == "number" ? `\u65F6\u5E8F: ${n.sequenceIndex + 1}` : "", n.timeOfDay ? `\u65F6\u6BB5: ${n.timeOfDay}` : "", n.lightKey ? `\u5149\u5F71\u57FA\u8C03: ${n.lightKey}` : "", n.colorPalette ? `\u8272\u5F69\u57FA\u8C03: ${n.colorPalette}` : "", n.continuityAnchor ? `\u8854\u63A5\u951A\u70B9: ${n.continuityAnchor}` : "", n.environment ? `\u73AF\u5883: ${n.environment}` : "", n.setDressing ? `\u5E03\u666F: ${n.setDressing}` : "", n.lighting ? `\u5149\u5F71: ${n.lighting}` : "", n.terrain ? `\u5730\u8C8C/\u6750\u8D28: ${n.terrain}` : "", n.spatialFraming ? `\u7A7A\u955C\u6784\u56FE: ${n.spatialFraming}` : "", n.camera ? `\u7A7A\u955C\u673A\u4F4D: ${n.camera}` : ""].filter(Boolean).join(" / ");
}
function Ci(n, i) {
  return [`SCENE_${String((n.sequenceIndex ?? i) + 1).padStart(2, "0")}`, n.title, n.timeOfDay || n.environment, n.lightKey || n.lighting, n.colorPalette].filter(Boolean).map((c) => $(String(c), 38)).join(" | ");
}
function nd(n, i) {
  return n.map((c, u) => {
    const b = c.timeOfDay || Vt(`${c.title}
${c.environment || ""}
${c.description || ""}`, c.title).time, m = c.lightKey || c.lighting || i.vibe_tag, A = c.colorPalette || `${i.vibe_tag}\u7EDF\u4E00\u8272\u8C03`, P = c.continuityAnchor || $([c.environment || c.description || c.title, c.setDressing, c.terrain, c.spatialFraming].filter(Boolean).join("\uFF1B"), 120), S = n[u + 1], B = n[u - 1], E = [B ? `\u627F\u63A5\u4E0A\u4E00\u573A\u300C${B.title}\u300D\u7684${B.lightKey || B.lighting || "\u5149\u7EBF"}\u3001${B.terrain || "\u5730\u9762\u6750\u8D28"}\u548C\u8FD0\u52A8\u65B9\u5411` : "\u5EFA\u7ACB\u5F71\u7247\u7A7A\u95F4\u5165\u53E3", `\u672C\u573A\u4FDD\u7559${P}`, S ? `\u753B\u9762\u51FA\u53E3\u9884\u7559\u5230\u300C${S.title}\u300D\u7684\u53EF\u526A\u63A5\u65B9\u5411\u3001\u540C\u8272\u6E29\u5149\u6E90\u6216\u5171\u540C\u73AF\u5883\u5143\u7D20` : "\u5C3E\u5E27\u6536\u675F\u4E3A\u53EF\u7ED3\u675F\u753B\u9762"].join("\uFF1B");
    return { ...c, sequenceIndex: u, sceneChainKey: Ci({ ...c, sequenceIndex: u, timeOfDay: b, lightKey: m, colorPalette: A }, u), timeOfDay: b, lightKey: m, colorPalette: A, continuityAnchor: E, transitionOut: c.transitionOut || (S ? `\u5C3E\u5E27\u901A\u8FC7\u9053\u8DEF/\u89C6\u7EBF/\u5149\u6E90/\u96E8\u96FE/\u5C18\u571F/\u8FD0\u52A8\u65B9\u5411\u81EA\u7136\u8854\u63A5\u5230\u300C${S.title}\u300D\uFF0C\u907F\u514D\u786C\u5207\u6210\u65E0\u5173\u65B0\u7A7A\u95F4` : "\u672C\u573A\u666F\u5C3E\u5E27\u6536\u675F\uFF0C\u4FDD\u7559\u7EDF\u4E00\u5149\u5F71\u548C\u8272\u5F69\uFF0C\u7B49\u5F85\u6700\u7EC8\u6210\u7247\u62FC\u63A5") };
  });
}
function fi(n) {
  return [...n].sort((i, c) => (i.sequenceIndex ?? Number.MAX_SAFE_INTEGER) - (c.sequenceIndex ?? Number.MAX_SAFE_INTEGER));
}
function ad(n, i, c, u, b) {
  const m = ["\u5168\u666F", "\u4E2D\u666F", "\u8FD1\u666F", "\u7279\u5199", "\u5927\u7279\u5199", "\u8FDC\u666F"], A = ["\u5E7F\u89D2\u955C\u5934", "\u4E2D\u7126\u955C\u5934", "\u957F\u7126\u955C\u5934", "\u4E2D\u957F\u7126\u955C\u5934", "\u4F4E\u89D2\u5EA6\u5E7F\u89D2\u955C\u5934", "\u6D45\u538B\u7F29\u957F\u7126\u955C\u5934"], P = ["\u666F\u6DF1\u504F\u6DF1\uFF08\u524D\u540E\u666F\u5173\u7CFB\u6E05\u6670\uFF09", "\u666F\u6DF1\u504F\u6D45\uFF08\u4EBA\u7269\u6E05\u6670\uFF0C\u80CC\u666F\u67D4\u5316\uFF09", "\u666F\u6DF1\u6781\u6D45\uFF08\u4E3B\u4F53\u6E05\u6670\uFF0C\u80CC\u666F\u5B8C\u5168\u865A\u5316\uFF09", "\u666F\u6DF1\u9002\u4E2D\uFF08\u4E3B\u4F53\u6E05\u6670\uFF0C\u8FDC\u666F\u4FDD\u7559\u7A7A\u95F4\u5C42\u6B21\uFF09"], S = ["\u4F4E\u89D2\u5EA6\u4FA7\u524D\u673A\u4F4D\uFF0C\u7F13\u6162\u524D\u63A8", "\u6B63\u9762\u5E73\u89C6\u673A\u4F4D\uFF0C\u8F7B\u5FAE\u8DDF\u62CD", "\u4FA7\u540E\u65B9\u8DDF\u62CD\u673A\u4F4D\uFF0C\u7A33\u5B9A\u63A8\u8FDB", "\u9AD8\u4F4D\u4FEF\u62CD\u673A\u4F4D\uFF0C\u5E73\u6ED1\u4E0B\u538B", "\u8D34\u5730\u4F4E\u673A\u4F4D\uFF0C\u5FEB\u901F\u63A0\u8FC7", "\u80A9\u540E\u4E3B\u89C2\u673A\u4F4D\uFF0C\u987A\u52BF\u6A2A\u79FB"], B = u + b + c.length, E = m[B % m.length], me = A[(B + 1) % A.length], Z = P[(B + 2) % P.length], H = S[(B + 3) % S.length], F = $(c || i.description || i.title, 140), ve = $(gn(i) || i.description || i.environment || i.title, 140);
  return `- ${n}\uFF1A${E}\uFF0C${me}\uFF0C${Z}\u3002${H}\u3002\u4EBA\u7269\u670D\u9970\u4E0E\u8EAB\u4EFD\u4E25\u683C\u7EE7\u627F\u89D2\u8272\u8D44\u4EA7\uFF0C\u53EA\u6267\u884C\u5F53\u524D\u52A8\u4F5C\uFF1A${F}\u3002\u573A\u666F\u5149\u5F71/\u5730\u8C8C/\u6C1B\u56F4/\u7279\u6548\u4E25\u683C\u7EE7\u627F\u7A7A\u73AF\u5883\u7D20\u6750\uFF1A${ve}\u3002`;
}
function id(n, i = "") {
  var S, B, E;
  const embodiedName = De(n.character.name) || "\u4E3B\u89D2", embodiedSource = n.studioConfig?.userIdea || n.originalSource || n.sourceText || "", embodiedLock = JiarenDetectEmbodiedProtagonistAsset(embodiedSource, i, embodiedName);
  if (n.character.entityKind || embodiedLock) return ["HARD NON-HUMAN PROTAGONIST LOCK: preserve the exact current visible form from the approved protagonist asset. Lock silhouette, proportions, surface, color and scale.", `Protagonist identity: ${embodiedName}. Current visible form: ${$((embodiedLock == null ? void 0 : embodiedLock.appearance) || n.character.appearance || n.character.description, 760)}.`, "Forbidden: human, humanoid conversion, man, woman, swordsman, face, hair, clothing, limbs, hands or unrelated weapon. Former human identity is background only and must not replace the current visible form."].join(`
`);
  const c = De(n.character.name) || "\u4E3B\u89D2", u = We(c, n.character.appearance, n.character.description, ((S = n.studioConfig) == null ? void 0 : S.userIdea) || "", i, (B = n.styleLock) == null ? void 0 : B.label), b = [(E = n.studioConfig) == null ? void 0 : E.userIdea, c, n.character.description, u, i].filter(Boolean).join(" "), m = /机车男|男主|男性|男人|成年男|少年|男孩|male|man|boy/i.test(b) && !/女主|女性|女人|少女|女孩|female|woman|girl/i.test(b), A = /女主|女性|女人|少女|女孩|female|woman|girl/i.test(b) && !/机车男|男主|男性|男人|成年男|少年|男孩|male|man|boy/i.test(b), P = /机车|摩托|motorcycle|motorbike|bike|biker|rider/i.test(b);
  return ["HARD CHARACTER LOCK: keep the exact same protagonist from the approved character asset and storyboard keyframes. Do not recast, gender-swap, age-swap, beautify into another person, or replace with a random portrait.", m ? "GENDER LOCK: the protagonist is male. Forbidden output: female face, woman, girl, feminine redesign, female biker, or unrelated female close-up." : "", A ? "GENDER LOCK: the protagonist is female. Forbidden output: male face, man, boy, masculine redesign, or unrelated male close-up." : "", P ? "MOTORCYCLE ACTION LOCK: keep the same motorcycle rider and motorcycle as the main moving subject. Show road/motorcycle pursuit energy, not a static glamour face shot or unrelated city cutaway." : "", `Character asset to preserve verbatim: ${$(u, 620)}`].filter(Boolean).join(`
`);
}
function hn(n, i = "") {
  const c = [n, i].filter(Boolean).join(" "), u = /机车男|男主|男性|男人|成年男|少年|男孩|male|man|boy/i.test(c) && !/女主|女性|女人|少女|女孩|female|woman|girl/i.test(c), b = /女主|女性|女人|少女|女孩|female|woman|girl/i.test(c) && !/机车男|男主|男性|男人|成年男|少年|男孩|male|man|boy/i.test(c), m = /机车|摩托|motorcycle|motorbike|bike|biker|rider/i.test(c);
  return [wt(n, i).lockText, u ? "USER INTENT GENDER LOCK: protagonist must be male; never design or render a woman/girl/feminine replacement." : "", b ? "USER INTENT GENDER LOCK: protagonist must be female; never design or render a man/boy/masculine replacement." : "", m ? "USER INTENT SUBJECT LOCK: protagonist is a motorcycle rider; motorcycle and road-riding action are core subject assets, not optional props." : ""].filter(Boolean).join(`
`);
}
function Ut(n, i = "") {
  const c = wt(n, i);
  return [
    "ASSET-FIRST NODE CONTRACT: script controls story facts and text-only location/time/weather constraints; character assets control identity/outfit; recurring assets keep their approved appearance; storyboard controls composition/action/camera only.",
    c.wantsMotorcycle ? "The approved vehicle is a persistent story asset. Preserve its identity and its relationship to the approved rider." : "",
    c.wantsRoadAction ? "Preserve only the speed or chase direction explicitly requested by the director." : ""
  ].filter(Boolean).join("\n");
}
function rd(n, i, c = "") {
  const u = n.studioConfig?.userIdea || "";
  const b = $t(n);
  const m = De(n.character.name) || "\u4E3B\u89D2";
  const A = We(
    m,
    n.character.appearance,
    n.character.description,
    u,
    c,
    n.styleLock?.label
  );
  const intentLock = JiarenNormalizeIntentLock(n.intentLock, u);
  const lockText = JiarenIntentLockText(intentLock, u, 720);
  const sceneId = i?.id || i?.sceneId || "unbound";
  const sceneText = i ? [
    i.title,
    i.location || i.sourceLocation,
    i.timeOfDay || i.sourceTime,
    i.weather,
    i.environment || i.description,
    i.visualAnchors?.join(" / "),
    i.lighting,
    i.spatialFraming,
    i.camera
  ].filter(Boolean).join(" / ") : n.scenes.map((scene) => `${scene.id || scene.sceneId}: ${scene.title}`).join(" | ");
  return {
    characterLock: [
      "Approved character asset locks identity, gender, face, age, silhouette, hair and outfit.",
      `Character: ${m}. ${$(A, 620)}.`,
      "Do not recast, redesign, change outfit, or turn a recurring prop/animal/vehicle into another person."
    ].join("\n"),
    sceneLock: [
      `Script-bound setting facts: sceneId=${sceneId}; ${$(sceneText, 720)}.`,
      "These text continuity facts come from the confirmed script. Do not move to any location, time, weather, architecture or media style absent from them and the director intent lock."
    ].join("\n"),
    clueLock: [
      b ? `Approved recurring assets: ${$(b, 520)}.` : "",
      c ? `Current script/action clue: ${$(c, 520)}.` : ""
    ].filter(Boolean).join("\n"),
    negativeLock: [
      lockText,
      "No recast, identity drift, asset replacement, unrelated location, time/weather change, style switch, subtitles or watermark."
    ].join("\n")
  };
}
function _n(n, i, c = "") {
  const u = rd(n, i, c);
  return ["AI_FILM_STUDIO DIRECT STORYBOARD CONTRACT:", u.characterLock, u.sceneLock, u.clueLock, u.negativeLock, "Generation order: lock character identity and prop/vehicle assets first, use the confirmed script setting facts as text constraints, then let Shot_Text/PicPrompt/VideoPrompt control framing, pose, action timing and camera movement. Location, time, weather and lighting remain text-only constraints."].filter(Boolean).join(`
`);
}
function tn(n, i, u = "") {
  const c = /scene|environment|background plate/i.test(i) && !/storyboard|shot|video|character/i.test(i);
  const directorStyle = wt(u).requestedStyle;
  if (directorStyle) {
    return c ? `${i}: DIRECTOR STYLE HARD LOCK ${directorStyle}; empty environment/background plate only; preserve the requested media type; no people, characters, silhouettes, body parts or text.` : `${i}: DIRECTOR STYLE HARD LOCK ${directorStyle}; this explicit user style overrides any conflicting default UI preset; preserve it across character, scene, storyboard and video.`;
  }
  if (!n) {
    return c ? `Approved unified visual style for ${i}; empty environment/background plate only, no people, characters, silhouettes or readable text.` : `Approved unified visual style for ${i}; keep one rendering language across character, scene, storyboard and video.`;
  }
  if (c) {
    return `${i}: ${n.label} visual style, ${n.tone}; empty environment/background plate only; preserve the film color system and rendering language; no people, characters, silhouettes, body parts or text.`;
  }
  if (n.id === "q" || /Q版|chibi/i.test(`${n.label} ${n.prompt}`)) {
    return `${i}: Q-version chibi cel-shaded animation style; keep the same character proportions, face identity, palette and rendering language.`;
  }
  if (n.id === "watercolor") {
    return `${i}: soft watercolor animation style, gentle paper grain, hand-painted edges, same character silhouette and palette.`;
  }
  if (n.id === "3d") {
    return `${i}: stylized 3D Chinese animation look, clean volumes, soft global illumination, same model-like proportions.`;
  }
  return `${i}: ${n.label} visual style, ${n.tone}; keep the same line weight, color system, face proportions and rendering language.`;
}
function od(n) {
  const i = mt(n);
  return n.category === "chat" && (n.requestMode === "openai-chat" || n.requestMode === "gemini-chat" || !n.requestMode) && !/gpt-audio|realtime|whisper|tts|voice|speech|audio|suno|riffusion|udio|image|video|seedance|sora|veo|wanx?|kling|hailuo|pixverse|runway|luma|flux|recraft|ideogram|nano[-_\s]?banana|banana|gpt-image/i.test(i);
}
function Yr(n) {
  return mo(n) ?? go(n) ?? n.find((i) => /nano[-_\s]?banana2|nano banana2|gemini-3-pro-image-preview/.test(mt(i))) ?? n.find((i) => /gpt-image-2-official|gpt image 2 官方/.test(mt(i))) ?? n.find((i) => /nano[-_\s]?banana|gemini-3.*image|gemini-3\.1.*image/.test(mt(i))) ?? n.find((i) => i.apiGroup === "a2") ?? n[0];
}
function sd(n) {
  const i = [/a2[-_]?seedance2[-_]?mini\b|doubao[-_\s]?seedance[-_\s]?2(?:[._-]?0)?[-_\s]?mini|seedance.*2.*mini/i, /a2[-_]?seedance2(?:[-_]?fast)?\b|seedance[-_\s]?2(?:[-_\s]?fast)?\b/i, /doubao[-_\s]?seedance[-_\s]?2|seedance.*2\.0|即梦.*2/i, /a2[-_]?seedance15|doubao[-_\s]?seedance[-_\s]?1[-_\s]?5|seedance[-_\s]?1\.?5/i, /a2[-_]?seedance10|doubao[-_\s]?seedance[-_\s]?1[-_\s]?0|seedance[-_\s]?1\.?0|即梦.*视频/i, /wan\s*2\.?5|wan2\.?5|通义.*万相/i, /sora-?2.*official|sora2.*official/i, /sora-?2|sora2/i, /hailuo.*02|minimax.*02|海螺.*02/i, /pika.*3\.1|pika/i, /veo3\.1|veo31/i, /kling-v3|kling.*omni|kling-video-o1/i, /wan2\.6/i, /veo3(?!\.1)|veo-?3(?!\.1)/i, /veo2/i];
  for (const c of i) {
    const u = n.find((b) => c.test(mt(b)));
    if (u) return u;
  }
  return n.find((c) => c.apiGroup === "a2") ?? n[0];
}
function cd(n, i) {
  const c = i ? n.filter((m) => ji(i, m.id)) : [], u = c.length > 0 ? c : n, b = [/claude[-_\s]?opus[-_\s]?4[-_\s]?7|claude.*opus.*4/i, /claude.*3\.?5.*sonnet|sonnet.*3\.?5|claude.*opus/i, /claude.*sonnet|claude.*opus/i, /gpt-4o\b|gpt-4\.1|gpt-5/i, /gemini.*pro|gemini.*thinking|gemini.*2\.?5/i, /deepseek.*r1|deepseek.*v3|qwen.*max|qwen.*plus|kimi|glm/i, /gpt-4o-mini|gpt-3\.5|turbo|qwen.*turbo/i];
  for (const m of b) {
    const A = u.find((P) => m.test(mt(P)));
    if (A) return A;
  }
  return u.find((m) => m.apiGroup === "a2") ?? u[0] ?? n.find((m) => m.apiGroup === "a2") ?? n[0];
}
function He(n, i) {
  for (const c of i) {
    const u = n.find((b) => c.test(mt(b)));
    if (u) return u;
  }
}
function en(n, i, c) {
  const u = n.filter(c), b = (m) => {
    var A, P;
    return !!((A = m.baseUrl) != null && A.trim() && ((P = m.apiKey) != null && P.trim()));
  };
  return u.find((m) => m.enabled && b(m)) ?? u.find(b) ?? u.find((m) => m.enabled && ji(i, m.id)) ?? u.find((m) => ji(i, m.id)) ?? u.find((m) => m.enabled) ?? u[0];
}
function ld(n, i) {
  const c = n ?? [], u = i ?? [], b = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(["\u52A8\u753B Agent \u7F16\u5267", "\u52A8\u753B\u521B\u610F / \u6545\u4E8B", "\u89D2\u8272\u8D44\u4EA7\u5E93", "\u573A\u666F / \u9053\u5177\u8D44\u4EA7\u5E93", "\u5206\u955C\u65F6\u95F4\u7EBF", "\u9996\u5E27 / \u5173\u952E\u5E27\u751F\u6210", "\u5C3E\u5E27 / \u8F6C\u573A\u5E27\u751F\u6210", "\u5206\u955C\u89C6\u9891\u7247\u6BB5", "\u6700\u7EC8\u526A\u8F91 / \u6210\u7247\u8F93\u51FA", "\u97F3\u6548\u603B\u76D1 / \u914D\u97F3 BGM", "\u9879\u76EE\u8D44\u4EA7 / \u4E0B\u8F7D", "\u6211\u7684\u5267\u672C", "Character", "Scene", "Audio", "Final Video", "\u89C6\u9891\u5206\u955C"]);
  return c.forEach((A) => {
    const P = A.data ?? {};
    (P.studioSessionId || P.flowRole === "animation-project") && (b.add(A.id), Array.isArray(P.internalNodeIds) && P.internalNodeIds.forEach((S) => {
      typeof S == "string" && b.add(S);
    }));
  }), c.forEach((A) => {
    var B, E, me, Z, H, F, ve, xe;
    typeof ((B = A.data) == null ? void 0 : B.flowRole) == "string" && A.data.flowRole.startsWith("animation-") && b.add(A.id);
    const P = String(((E = A.data) == null ? void 0 : E.label) || ((me = A.data) == null ? void 0 : me.fileName) || ""), S = [(Z = A.data) == null ? void 0 : Z.inputPrompt, (H = A.data) == null ? void 0 : H.prompt, (F = A.data) == null ? void 0 : F.outputText, (ve = A.data) == null ? void 0 : ve.message, (xe = A.data) == null ? void 0 : xe.kind].map((Pe) => String(Pe || "")).join(`
`);
    (m.has(P) || /Seedance 2\.0故事动画|动画项目|动画 Agent|编剧 Agent|角色设计师 Agent|角色 \/ 场景 Agent|分镜导演|声音导演|最终成片|Final Video|Character|Scene|Audio/.test(S)) && b.add(A.id);
  }), { nodes: c.filter((A) => !b.has(A.id)), edges: u.filter((A) => !b.has(A.source) && !b.has(A.target)) };
}
function dd(n) {
  return new Promise((i, c) => {
    const u = new FileReader();
    u.onload = () => i(String(u.result || "")), u.onerror = () => c(u.error ?? new Error("\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25")), u.readAsDataURL(n);
  });
}
function pd(n) {
  return new Promise((i, c) => {
    const u = new FileReader();
    u.onload = () => {
      try {
        const b = u.result instanceof ArrayBuffer ? new Uint8Array(u.result) : new Uint8Array(), m = (A, P = {}) => new TextDecoder(A, P).decode(b);
        let A = "";
        if (b[0] === 239 && b[1] === 187 && b[2] === 191) A = m("utf-8");
        else if (b[0] === 255 && b[1] === 254) A = m("utf-16le");
        else if (b[0] === 254 && b[1] === 255) A = m("utf-16be");
        else {
          const P = b.slice(0, Math.min(400, b.length)), S = P.filter((B, E) => E % 2 === 1 && B === 0).length, B = P.filter((E, me) => me % 2 === 0 && E === 0).length;
          if (S > P.length * 0.18) A = m("utf-16le");
          else if (B > P.length * 0.18) A = m("utf-16be");
          else try {
            A = m("utf-8", { fatal: true });
          } catch {
            A = m("gb18030");
          }
        }
        i(JiarenNormalizeSourceText(A));
      } catch (b) {
        c(b instanceof Error ? b : new Error("\u6587\u672C\u7F16\u7801\u65E0\u6CD5\u8BC6\u522B"));
      }
    }, u.onerror = () => c(u.error ?? new Error("\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25")), u.readAsArrayBuffer(n);
  });
}
function Bt(n) {
  return typeof n == "object" && n !== null;
}
function an(n, i) {
  if (!Bt(n)) return;
  const c = n[i];
  return Array.isArray(c) ? c : void 0;
}
function ud(n, i) {
  if (!Bt(n)) return;
  const c = n[i];
  return Bt(c) ? c : void 0;
}
function md(n) {
  if (Bt(n)) return typeof n.projectName == "string" ? n.projectName : void 0;
}
function gd(n) {
  const i = Bt(n.workflow) ? n.workflow : void 0, c = Bt(n.canvas) ? n.canvas : void 0, u = an(i, "nodes") ?? [], b = an(i, "edges") ?? [], m = an(c, "canvasAssets") ?? [];
  return u.length === 0 && b.length === 0 && m.length === 0;
}
function yi(n, i, c, u) {
  return n.length > 0 || i.length > 0 || c.length > 0 || u.length > 0;
}
function Ii(n) {
  return typeof n == "number" ? Number.isInteger(n) ? n.toLocaleString("zh-CN") : n.toLocaleString("zh-CN", { maximumFractionDigits: 2 }) : (n == null ? void 0 : n.trim()) || void 0;
}
function fo(n) {
  if (typeof n == "number" && Number.isFinite(n)) return n;
  if (typeof n == "string") {
    const i = n.replace(/[^\d.-]/g, "");
    if (!i) return;
    const c = Number(i);
    return Number.isFinite(c) ? c : void 0;
  }
}
function hd(n) {
  const i = fo(n);
  if (i !== void 0) return `\u5269\u4F59 ${i.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} \u5143`;
}
function fd(n) {
  const i = Ii(n);
  if (!i) return;
  const c = i.replace(/^(剩余|余额|余)\s*/u, "").trim();
  return c.endsWith("\u79EF\u5206") ? `\u5269\u4F59 ${c}` : `\u5269\u4F59 ${c} \u79EF\u5206`;
}
function yd(n) {
  const i = fo(n);
  return i === void 0 ? void 0 : `\u5269\u4F59 ${(i * 1.2).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} \u5143`;
}
function bd(n) {
  if (!n) return "\u672A\u67E5\u8BE2";
  if (n.unlimitedQuota) return "API \u5DF2\u8FDE\u901A";
  const i = fo(n.remainBalance);
  if (i !== void 0 && i >= 0) return hd(n.remainBalance);
  const c = fo(n.remainCredits);
  return c !== void 0 && c >= 0 ? fd(n.remainCredits) : "API \u5DF2\u8FDE\u901A";
}
function Zr(n) {
  if (!n) return false;
  if (fo(n.remainBalance) !== void 0) return true;
  const i = fo(n.remainCredits);
  return !!n.unlimitedQuota || i !== void 0 && i >= 0;
}
function vd(n, i) {
  return Zr(i) ? i : Zr(n) ? n : i ?? n;
}
function jd(n, i) {
  var b;
  if (n && (n.kind === "image" || n.kind === "generated")) {
    const m = n.dataUrl || n.localPath || n.source;
    if (m) return { id: n.id, name: n.name || "\u753B\u5E03\u56FE\u7247", source: m, localPath: n.localPath, dataUrl: n.dataUrl || (m.startsWith("data:") ? m : void 0), mimeType: n.mimeType };
  }
  const c = (b = i == null ? void 0 : i.data.outputAssets) == null ? void 0 : b.find((m) => m.type === "image"), u = (c == null ? void 0 : c.dataUrl) || (c == null ? void 0 : c.localPath) || (c == null ? void 0 : c.url) || (typeof (i == null ? void 0 : i.data.imageSource) == "string" ? i.data.imageSource : "");
  if (u) return { id: i != null && i.id ? `node-${i.id}` : "selected-node", name: typeof (i == null ? void 0 : i.data.fileName) == "string" ? i.data.fileName : typeof (i == null ? void 0 : i.data.label) == "string" ? i.data.label : "\u753B\u5E03\u56FE\u7247", source: u, localPath: (c == null ? void 0 : c.localPath) || (typeof (i == null ? void 0 : i.data.localPath) == "string" ? i.data.localPath : void 0), dataUrl: (c == null ? void 0 : c.dataUrl) || (u.startsWith("data:") ? u : void 0), mimeType: typeof (i == null ? void 0 : i.data.mimeType) == "string" ? i.data.mimeType : void 0 };
}
function Xr(n) {
  const i = Bt(n.metadata) ? n.metadata : {}, c = Array.isArray(i.canvasAssets) ? i.canvasAssets : [], u = Array.isArray(i.nodes) ? i.nodes : [];
  return { assets: c, nodes: u };
}
function eo(n) {
  return n.localPath || n.source || "";
}
function bi(n) {
  return n.localPath || n.imageSource || "";
}
function xd(n) {
  return n === "image" || n === "generated" || n === "imageInput" || n === "generateImage";
}
function Ad(n) {
  return n === "video" || n === "videoGenerate" || n === "sdVideo";
}
function wd(n = /* @__PURE__ */ new Date(), i = "zh") {
  const c = n.getHours();
  return i === "en" ? c >= 5 && c < 12 ? "Good morning, Director!" : c >= 12 && c < 18 ? "Good afternoon, Director!" : "Good evening, Director!" : c >= 5 && c < 9 ? "\u65E9\u4E0A\u597D\uFF0C\u5BFC\u6F14\uFF01" : c >= 9 && c < 12 ? "\u4E0A\u5348\u597D\uFF0C\u5BFC\u6F14\uFF01" : c >= 12 && c < 14 ? "\u4E2D\u5348\u597D\uFF0C\u5BFC\u6F14\uFF01" : c >= 14 && c < 18 ? "\u4E0B\u5348\u597D\uFF0C\u5BFC\u6F14\uFF01" : "\u665A\u4E0A\u597D\uFF0C\u5BFC\u6F14\uFF01";
}
function JiarenCompactText(value, maxLength = 1200) {
  const text = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  if (!Number.isFinite(maxLength) || maxLength <= 0 || text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(1, maxLength - 1)).trim()}...`;
}
function JiarenAsObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function JiarenString(value, fallback = "") {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}
function JiarenFirstString(record, keys, fallback = "") {
  const source = JiarenAsObject(record);
  for (const key of keys) {
    const value = JiarenString(source[key]);
    if (value) return value;
  }
  return fallback;
}
function JiarenStringArray(value) {
  const source = Array.isArray(value) ? value : value == null ? [] : [value];
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const entry of source) {
    let text = "";
    if (typeof entry === "string" || typeof entry === "number") {
      text = JiarenString(entry);
    } else if (entry && typeof entry === "object") {
      text = JiarenFirstString(entry, [
        "text",
        "name",
        "description",
        "identity",
        "value",
        "label",
        "title"
      ]);
    }
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    result.push(text);
  }
  return result;
}
function JiarenConstraintLevel(recordValue, nameValue, originalRequest = "") {
  const record = JiarenAsObject(recordValue);
  const declared = JiarenFirstString(record, [
    "constraint_level",
    "constraintLevel",
    "constraint_source",
    "constraintSource",
    "source"
  ]).toLowerCase();
  if (["soft", "inferred", "agent", "script", "creative"].includes(declared)) return "soft";
  if (["hard", "user", "explicit", "required"].includes(declared) || record.user_explicit === true || record.userExplicit === true || record.is_hard_constraint === true || record.isHardConstraint === true) {
    return "hard";
  }
  const original = JiarenString(originalRequest).toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
  const name = JiarenString(nameValue).toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
  return name && original.includes(name) ? "hard" : "soft";
}
function JiarenNormalizeConstraintPhrases(value, originalRequest = "", forcedHardValue) {
  const source = Array.isArray(value) ? value : value == null ? [] : [value];
  const forcedHard = new Set(JiarenStringArray(forcedHardValue).map((item) => item.toLowerCase()));
  const entries = /* @__PURE__ */ new Map();
  for (const item of source) {
    const record = JiarenAsObject(item);
    const text = typeof item === "string" || typeof item === "number" ? JiarenString(item) : JiarenFirstString(record, ["text", "name", "description", "value", "label", "title"]);
    if (!text) continue;
    const key = text.toLowerCase();
    const level = forcedHard.has(key) ? "hard" : JiarenConstraintLevel(record, text, originalRequest);
    const previous = entries.get(key);
    if (!previous || previous.level === "soft" && level === "hard") {
      entries.set(key, { text, level });
    }
  }
  const normalized = [...entries.values()];
  return {
    all: normalized.map((entry) => entry.text),
    hard: normalized.filter((entry) => entry.level === "hard").map((entry) => entry.text),
    soft: normalized.filter((entry) => entry.level === "soft").map((entry) => entry.text)
  };
}
function JiarenOriginalRequiresEveryShot(originalRequest, assetName) {
  if (JiarenConstraintLevel({}, assetName, originalRequest) !== "hard") return false;
  const original = JiarenString(originalRequest).replace(/\s+/g, "");
  return /每(?:一|个)?(?:镜|镜头|幕|场)|所有镜头|全程|始终|贯穿|一直/.test(original);
}
function JiarenNormalizeEntityList(value, kind, originalRequest = "") {
  const source = Array.isArray(value) ? value : value == null ? [] : [value];
  return source.map((entry, index) => {
    const record = JiarenAsObject(entry);
    const scalar = typeof entry === "string" ? entry.trim() : "";
    const name = JiarenFirstString(record, ["name", "title", "identity", "location", "label"]) || scalar;
    if (!name) return null;
    const normalized = {
      id: JiarenFirstString(record, ["id", `${kind}_id`, `${kind}Id`]) || `${kind}-${String(index + 1).padStart(2, "0")}`,
      name,
      description: JiarenFirstString(record, [
        "description",
        "identity",
        "appearance",
        "details",
        "visual_anchor",
        "visualAnchor"
      ]),
      constraintLevel: JiarenConstraintLevel(record, name, originalRequest)
    };
    if (kind === "protagonist") {
      normalized.gender = JiarenFirstString(record, ["gender", "sex"]);
      normalized.age = JiarenFirstString(record, ["age", "age_range", "ageRange"]);
      normalized.appearance = JiarenFirstString(record, [
        "appearance",
        "visual_identity",
        "visualIdentity",
        "face"
      ]);
      normalized.outfit = JiarenFirstString(record, ["outfit", "costume", "clothing"]);
    }
    if (kind === "location") {
      normalized.time = JiarenFirstString(record, ["time", "time_of_day", "timeOfDay"]);
      normalized.weather = JiarenFirstString(record, ["weather", "atmosphere"]);
      normalized.anchors = JiarenStringArray(
        record.anchors || record.visual_anchors || record.visualAnchors || record.landmarks
      );
    }
    if (kind === "asset") {
      normalized.type = JiarenFirstString(record, ["type", "asset_type", "assetType"], "prop");
      normalized.appearance = JiarenFirstString(record, [
        "appearance",
        "visual_identity",
        "visualIdentity",
        "description"
      ]);
      normalized.requiredEveryShot = Boolean(
        record.required_every_shot || record.requiredEveryShot || record.every_shot || record.everyShot || record.hard_required_every_shot || record.hardRequiredEveryShot || record.continuity === "every_shot"
      );
      normalized.hardRequiredEveryShot = Boolean(
        normalized.requiredEveryShot && normalized.constraintLevel === "hard" && (record.hard_required_every_shot || record.hardRequiredEveryShot || JiarenOriginalRequiresEveryShot(originalRequest, name))
      );
    }
    return normalized;
  }).filter(Boolean);
}
function JiarenExtractForbiddenClauses(original) {
  const text = JiarenString(original);
  if (!text) return [];
  const clauses = [];
  const pattern = /(?:禁止|不要|不能|不得|避免|排除|no\s+|without\s+)([^。！？;；\n]{1,80})/gi;
  let match;
  while (match = pattern.exec(text)) {
    const clause = JiarenString(match[1]).replace(/^(出现|使用|生成|加入|改成|变成)/, "").trim();
    if (clause) clauses.push(clause);
  }
  return JiarenStringArray(clauses);
}
function JiarenNormalizeIntentLock(rawValue, originalRequest = "") {
  const root = JiarenAsObject(rawValue);
  const raw = JiarenAsObject(root.intent_lock || root.intentLock || root.director_lock || root.directorLock || root);
  const original = JiarenFirstString(raw, ["original", "original_request", "originalRequest", "user_request", "userRequest"], JiarenString(originalRequest));
  const protagonists = JiarenNormalizeEntityList(
    raw.protagonists || raw.characters || raw.main_characters || raw.mainCharacters || raw.protagonist,
    "protagonist",
    original
  );
  const locations = JiarenNormalizeEntityList(
    raw.locations || raw.settings || raw.worlds || raw.required_locations || raw.requiredLocations,
    "location",
    original
  );
  const recurringAssets = JiarenNormalizeEntityList(
    raw.recurring_assets || raw.recurringAssets || raw.props || raw.vehicles || raw.clues,
    "asset",
    original
  );
  const actionConstraints = JiarenNormalizeConstraintPhrases(
    raw.required_actions || raw.requiredActions || raw.actions || raw.visible_actions || raw.visibleActions,
    original,
    raw.hard_required_actions || raw.hardRequiredActions
  );
  const rawForbidden = raw.forbidden_contradictions || raw.forbiddenContradictions || raw.forbidden || raw.negative_constraints || raw.negativeConstraints;
  const forbiddenSource = Array.isArray(rawForbidden) ? [...rawForbidden] : rawForbidden == null ? [] : [rawForbidden];
  forbiddenSource.push(
    ...JiarenExtractForbiddenClauses(original).map((text) => ({
      text,
      constraintLevel: "hard"
    }))
  );
  const forbiddenConstraints = JiarenNormalizeConstraintPhrases(
    forbiddenSource,
    original,
    raw.hard_forbidden_contradictions || raw.hardForbiddenContradictions
  );
  return {
    version: "jiaren-director-intent-lock-v3",
    original,
    protagonists,
    locations,
    recurringAssets,
    requiredActions: actionConstraints.all,
    hardRequiredActions: actionConstraints.hard,
    softRequiredActions: actionConstraints.soft,
    visualStyle: JiarenStringArray(
      raw.visual_style || raw.visualStyle || raw.styles || raw.style || raw.media_style || raw.mediaStyle
    ),
    storyFacts: JiarenStringArray(
      raw.story_facts || raw.storyFacts || raw.immutable_facts || raw.immutableFacts || raw.must_keep
    ),
    forbiddenContradictions: forbiddenConstraints.hard,
    hardForbiddenContradictions: forbiddenConstraints.hard,
    softNegativeConstraints: forbiddenConstraints.soft
  };
}
function JiarenIntentLockText(lockValue, originalRequest = "", maxLength = 4200) {
  const lock = JiarenNormalizeIntentLock(lockValue, originalRequest);
  const protagonistText = lock.protagonists.map(
    (item) => [
      item.name,
      item.gender ? `gender=${item.gender}` : "",
      item.age ? `age=${item.age}` : "",
      item.description,
      item.appearance,
      item.outfit ? `outfit=${item.outfit}` : ""
    ].filter(Boolean).join(" / ")
  ).join("; ");
  const formatLocations = (items) => items.map(
    (item) => [
      item.name,
      item.time ? `time=${item.time}` : "",
      item.weather ? `weather=${item.weather}` : "",
      item.description,
      item.anchors.length ? `anchors=${item.anchors.join(", ")}` : ""
    ].filter(Boolean).join(" / ")
  ).join("; ");
  const formatAssets = (items) => items.map(
    (item) => [
      `${item.type}:${item.name}`,
      item.description,
      item.appearance,
      item.hardRequiredEveryShot ? "user requires this in every shot" : item.requiredEveryShot ? "production continuity asset" : ""
    ].filter(Boolean).join(" / ")
  ).join("; ");
  const hardLocationText = formatLocations(
    lock.locations.filter((item) => item.constraintLevel === "hard")
  );
  const softLocationText = formatLocations(
    lock.locations.filter((item) => item.constraintLevel !== "hard")
  );
  const hardAssetText = formatAssets(
    lock.recurringAssets.filter((item) => item.constraintLevel === "hard")
  );
  const softAssetText = formatAssets(
    lock.recurringAssets.filter((item) => item.constraintLevel !== "hard")
  );
  const text = [
    "DIRECTOR INTENT CONTRACT (highest priority):",
    `Original request, verbatim: ${lock.original || JiarenString(originalRequest) || "not provided"}`,
    protagonistText ? `Approved protagonists: ${protagonistText}` : "",
    hardLocationText ? `User-explicit locations/time/weather: ${hardLocationText}` : "",
    hardAssetText ? `User-explicit recurring assets and clues: ${hardAssetText}` : "",
    lock.hardRequiredActions.length ? `User-explicit visible actions: ${lock.hardRequiredActions.join("; ")}` : "",
    lock.visualStyle.length ? `Required media and visual style: ${lock.visualStyle.join("; ")}` : "",
    lock.storyFacts.length ? `Immutable story facts: ${lock.storyFacts.join("; ")}` : "",
    lock.forbiddenContradictions.length ? `Forbidden contradictions: ${lock.forbiddenContradictions.join("; ")}` : "",
    softLocationText ? `Confirmed-script location guidance: ${softLocationText}` : "",
    softAssetText ? `Confirmed-script continuity guidance: ${softAssetText}` : "",
    lock.softRequiredActions.length ? `Confirmed-script action guidance: ${lock.softRequiredActions.join("; ")}` : "",
    lock.softNegativeConstraints.length ? `Optional production exclusions: ${lock.softNegativeConstraints.join("; ")}` : "",
    "User-explicit constraints and forbidden contradictions are hard gates. Agent-inferred production details are continuity guidance: preserve them after confirmation, but do not reject semantically equivalent wording solely because it is not repeated verbatim."
  ].filter(Boolean).join("\n");
  return JiarenCompactText(text, maxLength);
}
function JiarenTextContains(haystack, needle) {
  const source = JiarenString(haystack).toLowerCase().replace(/\s+/g, "");
  const target = JiarenString(needle).toLowerCase().replace(/\s+/g, "");
  if (!target) return true;
  if (source.includes(target) || source.length >= 2 && target.includes(source)) return true;
  const tokens = target.split(/[、，,;；/|\s]+/).map((token) => token.trim()).filter((token) => token.length >= 2);
  return tokens.length > 0 && tokens.some((token) => source.includes(token));
}
function JiarenAssertNoForbidden(positiveText, lockValue, label) {
  const lock = JiarenNormalizeIntentLock(lockValue);
  const conflicts = lock.forbiddenContradictions.filter((term) => JiarenTextContains(positiveText, term));
  if (conflicts.length) {
    throw new Error(`${label}\u5305\u542B\u5BFC\u6F14\u7981\u6B62\u5185\u5BB9\uFF1A${conflicts.join("\u3001")}`);
  }
}
function JiarenNormalizeScenePlan(rawScenes, lockValue, options = {}) {
  const lock = JiarenNormalizeIntentLock(lockValue, options.originalRequest);
  const source = Array.isArray(rawScenes) ? rawScenes : [];
  if (!source.length) throw new Error("\u573A\u666F Agent \u6CA1\u6709\u8FD4\u56DE scenes[]\u3002");
  const requestedMaxScenes = Number(options.maxScenes);
  const maxScenes = Number.isFinite(requestedMaxScenes) && requestedMaxScenes > 0 ? Math.max(1, Math.floor(requestedMaxScenes)) : source.length;
  const approvedLocations = lock.locations.filter((item) => item.constraintLevel === "hard").map((item) => item.name).filter(Boolean);
  const beatLocationRecords = [
    ...Array.isArray(options.productionBeats) ? options.productionBeats : [],
    ...Array.isArray(options.expectedBeatLocations) ? options.expectedBeatLocations : []
  ].map(JiarenAsObject);
  const expectedLocationsByBeat = /* @__PURE__ */ new Map();
  for (const record of beatLocationRecords) {
    const beatId = JiarenFirstString(record, ["beat_id", "beatId", "id"]);
    const heading = JiarenFirstString(record, ["scene_heading", "sceneHeading", "heading", "slugline"]);
    const text = JiarenFirstString(record, ["text", "script_beat", "scriptBeat", "story_event", "storyEvent"]);
    const headingLocation = heading.match(/^(?:\u5185\u666F\/\u5916\u666F|\u5185\u666F|\u5916\u666F|INT\.?\/EXT\.?|INT\.?|EXT\.?)\s*[.\uFF0E]\s*(.+?)\s*[-\u2014]\s*/i)?.[1];
    const textLocation = text.match(/(?:^|\n)\s*location\s*:\s*([^\n]+)/i)?.[1];
    const location = JiarenFirstString(record, ["location", "place", "setting"]) || JiarenString(headingLocation || textLocation);
    if (!beatId || !location) continue;
    const locations = expectedLocationsByBeat.get(beatId) || [];
    if (!locations.some((item) => JiarenTextContains(item, location) || JiarenTextContains(location, item))) locations.push(location);
    expectedLocationsByBeat.set(beatId, locations);
  }
  const scriptLocations = Array.from(new Set(Array.from(expectedLocationsByBeat.values()).flat().filter(Boolean)));
  const result = source.slice(0, maxScenes).map((entry, index) => {
    const record = JiarenAsObject(entry);
    const id2 = JiarenFirstString(record, ["id", "scene_id", "sceneId"]) || `scene-${String(index + 1).padStart(2, "0")}`;
    const title = JiarenFirstString(record, ["title", "name"], `\u573A\u666F ${index + 1}`);
    const sourceBeatIds = JiarenStringArray(
      record.source_beat_ids || record.sourceBeatIds || record.beat_refs || record.beatRefs
    );
    if (!sourceBeatIds.length) throw new Error(`\u573A\u666F\u300C${title}\u300D\u7F3A\u5C11 sourceBeatIds\uFF0C\u65E0\u6CD5\u8FFD\u6EAF\u5230\u5267\u672C\u3002`);
    const expectedLocations = Array.from(new Set(sourceBeatIds.flatMap((beatId) => {
      const exact = expectedLocationsByBeat.get(beatId);
      if (exact?.length) return exact;
      const matched = Array.from(expectedLocationsByBeat.entries()).find(([expectedBeatId]) => JiarenTextContains(beatId, expectedBeatId));
      return matched?.[1] || [];
    }).filter(Boolean)));
    const allowedLocations = expectedLocations.length ? expectedLocations : scriptLocations.length ? scriptLocations : approvedLocations;
    let location = JiarenFirstString(record, ["location", "place", "setting"]);
    const time = JiarenFirstString(record, ["time", "time_of_day", "timeOfDay"]);
    const weather = JiarenFirstString(record, ["weather", "atmosphere"]);
    const description = JiarenFirstString(record, ["description", "summary", "visual"]);
    const environment = JiarenFirstString(record, ["environment", "space", "world"], description);
    if (!location && allowedLocations.length === 1) location = allowedLocations[0];
    const combined = [title, location, time, weather, description, environment].filter(Boolean).join(" / ");
    const locationMatches = expectedLocations.length ? expectedLocations.every((name) => JiarenTextContains(combined, name)) : !allowedLocations.length || allowedLocations.some((name) => JiarenTextContains(combined, name));
    if (!locationMatches) {
      const label = expectedLocations.length ? `\u5267\u60C5\u8282\u62CD ${sourceBeatIds.join("\u3001")} \u7684\u5730\u70B9` : "\u5DF2\u786E\u8BA4\u5267\u672C\u5730\u70B9";
      throw new Error(`\u573A\u666F\u300C${title}\u300D\u6CA1\u6709\u7ED1\u5B9A${label}\uFF1A${allowedLocations.join("\u3001")}`);
    }
    JiarenAssertNoForbidden(combined, lock, `\u573A\u666F\u300C${title}\u300D`);
    const anchors = JiarenStringArray(
      record.visual_anchors || record.visualAnchors || record.anchors || record.landmarks
    );
    const setDressing = JiarenFirstString(record, ["set_dressing", "setDressing", "props", "decor"]);
    const lighting = JiarenFirstString(record, ["lighting", "light"]);
    const terrain = JiarenFirstString(record, ["terrain", "surface", "ground"]);
    const spatialFraming = JiarenFirstString(record, [
      "spatial_framing",
      "spatialFraming",
      "framing",
      "composition"
    ]);
    const camera = JiarenFirstString(record, ["camera", "camera_empty_frame", "cameraEmptyFrame", "lens"]);
    const transitionOut = JiarenFirstString(record, ["transition_out", "transitionOut", "transition"]);
    const rawImagePrompt = JiarenFirstString(record, [
      "image_prompt",
      "imagePrompt",
      "prompt",
      "prompt_en"
    ]);
    const lockText = JiarenIntentLockText(lock, lock.original, 1e3);
    const imagePrompt = [
      `SCENE ASSET ${id2}: ${title}.`,
      `Bound script beats: ${sourceBeatIds.join(", ")}.`,
      `Exact location/time/weather: ${[location, time, weather].filter(Boolean).join(" / ")}.`,
      environment ? `Environment: ${environment}.` : "",
      anchors.length ? `Visual anchors: ${anchors.join("; ")}.` : "",
      setDressing ? `Set dressing: ${setDressing}.` : "",
      lighting ? `Lighting: ${lighting}.` : "",
      terrain ? `Terrain/surfaces: ${terrain}.` : "",
      spatialFraming ? `Spatial framing: ${spatialFraming}.` : "",
      camera ? `Empty-plate camera: ${camera}.` : "",
      rawImagePrompt,
      lockText,
      "Reusable empty environment plate only. No people, no characters, no faces, no bodies, no silhouettes, no crowd, no subtitles, no watermark. Do not invent another place, time, or weather."
    ].filter(Boolean).join("\n");
    const rawSceneVariants = record.scene_variants || record.sceneVariants || record.environment_variants || record.environmentVariants || record.beat_variants || record.beatVariants || record.plates || record.camera_variants || record.cameraVariants;
    const orderedRawVariants = Array.isArray(rawSceneVariants) ? [...rawSceneVariants].sort((left, right) => Number(Boolean(JiarenAsObject(right).is_primary || JiarenAsObject(right).isPrimary)) - Number(Boolean(JiarenAsObject(left).is_primary || JiarenAsObject(left).isPrimary))).slice(0, 5) : [];
    const hasDeclaredPrimary = orderedRawVariants.some((variant) => Boolean(JiarenAsObject(variant).is_primary || JiarenAsObject(variant).isPrimary));
    const desiredVariantCount = Math.min(5, Math.max(2, sourceBeatIds.length, orderedRawVariants.length + (hasDeclaredPrimary ? 0 : 1)));
    const fallbackVariants = Array.from({ length: desiredVariantCount }, (_2, variantIndex) => ({
      is_primary: variantIndex === 0,
      title: variantIndex === 0 ? "\u4E3B\u573A\u666F\u9996\u5E27" : `\u5267\u60C5\u8282\u62CD ${variantIndex + 1}`,
      source_beat_ids: [sourceBeatIds[Math.min(variantIndex, sourceBeatIds.length - 1)]],
      beat_summary: variantIndex === 0 ? description || environment : `\u4E3A ${sourceBeatIds[Math.min(variantIndex, sourceBeatIds.length - 1)]} \u9884\u7559\u89D2\u8272\u7AD9\u4F4D\u3001\u52A8\u4F5C\u901A\u9053\u4E0E\u8FD0\u955C\u7A7A\u95F4`,
      camera_empty_frame: [camera || "cinematic empty plate", "medium-wide staging angle", "low action-ready angle", "spatial detail angle", "handoff composition"][variantIndex] || camera,
      spatial_framing: spatialFraming
    }));
    const variantSource = (hasDeclaredPrimary ? [...orderedRawVariants, ...fallbackVariants.slice(orderedRawVariants.length)] : [fallbackVariants[0], ...orderedRawVariants, ...fallbackVariants.slice(orderedRawVariants.length + 1)]).slice(0, desiredVariantCount);
    const sceneVariants = variantSource.map((variantEntry, variantIndex) => {
      const variant = JiarenAsObject(variantEntry);
      const variantId = JiarenFirstString(variant, ["id", "variant_id", "variantId", "plate_id", "plateId"], `${id2}-variant-${String(variantIndex + 1).padStart(2, "0")}`);
      const variantTitle = JiarenFirstString(variant, ["title", "name"], variantIndex === 0 ? "\u4E3B\u573A\u666F\u9996\u5E27" : `\u573A\u666F\u53D8\u4F53 ${variantIndex + 1}`);
      const variantBeatIds = JiarenStringArray(variant.source_beat_ids || variant.sourceBeatIds || variant.beat_refs || variant.beatRefs || variant.beat_id || variant.beatId || sourceBeatIds[Math.min(variantIndex, sourceBeatIds.length - 1)]);
      const beatSummary = JiarenFirstString(variant, ["beat_summary", "beatSummary", "story_beat", "storyBeat", "purpose", "action_space"], description || environment);
      const variantCamera = JiarenFirstString(variant, ["camera_empty_frame", "cameraEmptyFrame", "camera", "lens", "angle"], camera);
      const variantFraming = JiarenFirstString(variant, ["spatial_framing", "spatialFraming", "framing", "composition"], spatialFraming);
      const variantImagePromptRaw = JiarenFirstString(variant, ["image_prompt", "imagePrompt", "prompt", "prompt_en"], variantIndex === 0 ? rawImagePrompt : "");
      const variantImagePrompt = [
        `SCENE PACKAGE ${id2}; EMPTY PLATE ${variantIndex + 1}/${variantSource.length}; variantId=${variantId}.`,
        `Scene: ${title}; exact location/time/weather: ${[location, time, weather].filter(Boolean).join(" / ")}.`,
        `Bound script beats: ${variantBeatIds.join(", ") || sourceBeatIds.join(", ")}.`,
        beatSummary ? `Story-beat staging purpose: ${beatSummary}.` : "",
        environment ? `Keep the same environment: ${environment}.` : "",
        anchors.length ? `Keep visual anchors: ${anchors.join("; ")}.` : "",
        setDressing ? `Keep set dressing: ${setDressing}.` : "",
        lighting ? `Keep lighting: ${lighting}.` : "",
        terrain ? `Keep terrain/surfaces: ${terrain}.` : "",
        variantFraming ? `Empty spatial framing: ${variantFraming}.` : "",
        variantCamera ? `Empty-plate camera: ${variantCamera}.` : "",
        variantImagePromptRaw,
        lockText,
        "Same approved location, production design, time, weather and color pipeline as the primary plate. Empty environment only. Reserve readable foreground/midground/background and action corridors for later character compositing. No people, no characters, no faces, no bodies, no silhouettes, no crowd, no subtitles, no watermark."
      ].filter(Boolean).join("\n");
      return {
        id: variantId,
        variantId,
        sceneId: id2,
        title: variantTitle,
        sequenceIndex: variantIndex,
        isPrimary: variantIndex === 0,
        sourceBeatIds: variantBeatIds.length ? variantBeatIds : sourceBeatIds,
        beatSummary,
        camera: variantCamera,
        spatialFraming: variantFraming,
        environment,
        lighting,
        imagePrompt: variantImagePrompt,
        prompt: variantImagePrompt,
        imageUrl: JiarenFirstString(variant, ["image_url", "imageUrl", "url"])
      };
    });
    const primaryVariant = sceneVariants[0];
    return {
      id: id2,
      sceneId: id2,
      title,
      sequenceIndex: index,
      sourceBeatIds,
      location,
      timeOfDay: time,
      weather,
      visualAnchors: anchors,
      description,
      environment,
      setDressing,
      lighting,
      terrain,
      spatialFraming,
      camera,
      transitionOut,
      continuityAnchor: [location, time, weather, ...anchors].filter(Boolean).join(" / "),
      sceneChainKey: `${id2} | ${[title, location, time, weather].filter(Boolean).join(" | ")}`,
      subject: "\u7A7A\u73AF\u5883",
      subjectMotion: "\u65E0\u4EBA\u7269\u52A8\u4F5C\uFF1B\u89D2\u8272\u53EA\u5728\u5206\u955C\u9636\u6BB5\u52A0\u5165\u3002",
      prompt: primaryVariant?.imagePrompt || imagePrompt,
      imagePrompt: primaryVariant?.imagePrompt || imagePrompt,
      primaryVariantId: primaryVariant?.variantId,
      sceneVariants,
      imageUrl: primaryVariant?.imageUrl || JiarenFirstString(record, ["image_url", "imageUrl", "url"])
    };
  });
  const expectedBeatIds = JiarenStringArray(options.expectedBeatIds);
  if (expectedBeatIds.length) {
    const coveredBeatIds = result.flatMap((scene) => JiarenStringArray(scene.sourceBeatIds));
    const missingBeatIds = expectedBeatIds.filter((expected) => !coveredBeatIds.some((actual) => JiarenTextContains(actual, expected)));
    if (missingBeatIds.length) {
      throw new Error(`\u573A\u666F Agent \u6F0F\u6389\u4E86\u5267\u672C\u573A\u6B21\uFF1A${missingBeatIds.join("\u3001")}\u3002\u8BF7\u6309\u5B8C\u6574\u5267\u672C\u8865\u9F50\u540E\u91CD\u8BD5\u3002`);
    }
  }
  return result;
}
function JiarenExtractAgentArray(recordValue, keys = []) {
  const fieldNames = JiarenStringArray(keys), wrapperNames = ["data", "result", "output", "response", "payload", "content", "message", "items", "list"], visited = /* @__PURE__ */ new Set();
  const inspect = (value, depth = 0) => {
    if (depth > 6 || value == null) return [];
    if (Array.isArray(value)) return value.filter((item) => item != null).map((item) => typeof item == "string" || item && typeof item == "object" ? item : String(item));
    if (typeof value == "string") {
      const text = value.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
      if (!text || !/^[\[{]/.test(text)) return [];
      try { return inspect(JSON.parse(text), depth + 1); } catch { return []; }
    }
    if (typeof value != "object" || visited.has(value)) return [];
    visited.add(value);
    for (const name of fieldNames) { if (Object.prototype.hasOwnProperty.call(value, name)) { const found = inspect(value[name], depth + 1); if (found.length) return found; } }
    for (const name of wrapperNames) { if (Object.prototype.hasOwnProperty.call(value, name)) { const found = inspect(value[name], depth + 1); if (found.length) return found; } }
    return [];
  };
  return inspect(recordValue);
}
function JiarenBuildStoryboardFallbackRecords(scenesValue, productionBeatsValue, scriptValue, lockValue, options = {}) {
  const scenes = (Array.isArray(scenesValue) ? scenesValue : []).map(JiarenAsObject).filter((scene) => JiarenFirstString(scene, ["id", "sceneId", "scene_id"]));
  if (!scenes.length) return [];
  const lock = JiarenNormalizeIntentLock(lockValue, options.originalRequest), scriptSegments = (Array.isArray(scriptValue) ? scriptValue : JiarenStringArray(scriptValue)).map(JiarenString).filter(Boolean), productionBeats = (Array.isArray(productionBeatsValue) ? productionBeatsValue : []).map(JiarenAsObject).filter((beat) => Object.keys(beat).length), sourceBeats = productionBeats.length ? productionBeats : scriptSegments.map((text, index) => ({ beat_id: `BEAT-${String(index + 1).padStart(2, "0")}`, story_event: text, visible_action: text }));
  if (!sourceBeats.length) sourceBeats.push({ beat_id: "BEAT-01", story_event: lock.original || "\u6309\u5DF2\u786E\u8BA4\u5267\u672C\u63A8\u8FDB", visible_action: "\u6309\u5DF2\u786E\u8BA4\u5267\u672C\u6267\u884C\u53EF\u89C1\u52A8\u4F5C" });
  const desiredShotCount = Math.max(1, Number(options.desiredShotCount) || sourceBeats.length || scenes.length), characterNames = JiarenStringArray(options.characterNames), everyShotAssets = lock.recurringAssets.filter((asset) => asset.constraintLevel === "hard" && asset.hardRequiredEveryShot).map((asset) => asset.name).filter(Boolean), firstShotLocks = JiarenStringArray([...lock.hardRequiredActions, ...lock.recurringAssets.filter((asset) => asset.constraintLevel === "hard" && !asset.hardRequiredEveryShot).map((asset) => asset.name)]);
  const findScene = (beat, index) => { const beatId = JiarenFirstString(beat, ["beat_id", "beatId", "id"]), sceneId = JiarenFirstString(beat, ["scene_id", "sceneId"]), location = JiarenFirstString(beat, ["location", "place", "setting"]); return scenes.find((scene) => JiarenFirstString(scene, ["id", "sceneId", "scene_id"]) === sceneId) || scenes.find((scene) => JiarenStringArray(scene.sourceBeatIds || scene.source_beat_ids || scene.beatRefs || scene.beat_refs).some((sourceBeatId) => JiarenTextContains(sourceBeatId, beatId))) || scenes.find((scene) => location && JiarenTextContains([scene.title, scene.location, scene.environment, scene.description].filter(Boolean).join(" / "), location)) || scenes[Math.min(scenes.length - 1, Math.floor(index * scenes.length / desiredShotCount))]; };
  return Array.from({ length: desiredShotCount }, (_2, index) => {
    const beatIndex = Math.min(sourceBeats.length - 1, Math.floor(index * sourceBeats.length / desiredShotCount)), beat = sourceBeats[beatIndex], scene = findScene(beat, index), sceneId = JiarenFirstString(scene, ["id", "sceneId", "scene_id"]), beatId = JiarenFirstString(beat, ["beat_id", "beatId", "id"], `BEAT-${String(beatIndex + 1).padStart(2, "0")}`), variants = Array.isArray(scene.sceneVariants) ? scene.sceneVariants : [], variant = variants.find((item) => JiarenStringArray(item.sourceBeatIds || item.source_beat_ids).some((sourceBeatId) => JiarenTextContains(sourceBeatId, beatId))) || variants[index % Math.max(1, variants.length)] || {}, storyEvent = JiarenFirstString(beat, ["story_event", "storyEvent", "summary", "text"], scriptSegments[beatIndex] || scene.description || scene.environment || scene.title), visibleAction = JiarenFirstString(beat, ["visible_action", "visibleAction", "action"], storyEvent), dialogue = JiarenFirstString(beat, ["dialogue_or_vo", "dialogueOrVo", "dialogue", "voiceover"]), cameraSeed = JiarenFirstString(beat, ["camera_seed", "cameraSeed", "camera"], scene.camera || "\u7535\u5F71\u5316\u4E2D\u666F\uFF0C\u5E73\u89C6\u673A\u4F4D\uFF0C\u7A33\u5B9A\u8DDF\u62CD"), continuityLocks = JiarenStringArray([...everyShotAssets, ...index === 0 ? firstShotLocks : []]), scriptBeat = [beatId, storyEvent, visibleAction, dialogue, continuityLocks.length ? `\u5BFC\u6F14\u786C\u9501\uFF1A${continuityLocks.join("\u3001")}` : ""].filter(Boolean).join("\uFF1B"), environment = [scene.location, scene.timeOfDay, scene.weather, scene.environment || scene.description].filter(Boolean).join(" / "), title = JiarenFirstString(beat, ["title", "name"], `${beatId} ${storyEvent || scene.title}`);
    return { shot_id: `shot-${String(index + 1).padStart(2, "0")}`, title: JiarenCompactText(title, 80), scene_id: sceneId, scene_variant_id: JiarenFirstString(variant, ["variantId", "variant_id", "id"], scene.primaryVariantId || `${sceneId}-variant-01`), script_beat: scriptBeat, characters_on_screen: characterNames, blocking: "\u4E3B\u4F53\u6309\u539F\u5267\u672C\u7A7A\u95F4\u5173\u7CFB\u7AD9\u4F4D\uFF0C\u4FDD\u7559\u524D\u666F\u3001\u4E2D\u666F\u548C\u80CC\u666F\u5C42\u6B21", pose: visibleAction, expression: "\u6309\u539F\u5267\u672C\u5F53\u524D\u60C5\u7EEA", dialogue, shot_size: index % 4 === 0 ? "\u5168\u666F" : index % 4 === 3 ? "\u7279\u5199" : "\u4E2D\u666F", lens: index % 4 === 0 ? "24mm" : index % 4 === 3 ? "85mm" : "50mm", camera_angle: "\u6309\u5DF2\u786E\u8BA4\u573A\u666F\u7684\u7A7A\u95F4\u5173\u7CFB\u5E73\u89C6\u53D6\u666F", camera_motion: cameraSeed, subject_action: [visibleAction, continuityLocks.length ? `\u6301\u7EED\u4FDD\u7559 ${continuityLocks.join("\u3001")}` : ""].filter(Boolean).join("\uFF1B"), environment, lighting: scene.lighting || "\u4E25\u683C\u7EE7\u627F\u5DF2\u786E\u8BA4\u573A\u666F\u5149\u5F71", transition_in: index === 0 ? "\u5F00\u573A\u5EFA\u7ACB" : "\u627F\u63A5\u4E0A\u4E00\u955C\u52A8\u4F5C\u4E0E\u89C6\u7EBF", transition_out: JiarenFirstString(beat, ["continuity_out", "continuityOut", "transition"], scene.transitionOut || "\u627F\u63A5\u4E0B\u4E00\u539F\u6587\u8282\u62CD"), image_prompt: `\u4E25\u683C\u6839\u636E\u5DF2\u786E\u8BA4\u5267\u672C\u8282\u62CD ${scriptBeat}\uFF0C\u5728\u573A\u666F\u300C${scene.title || sceneId}\u300D\u4E2D\u5C55\u793A ${visibleAction}\u3002`, video_prompt: `\u53EA\u8BA9\u5DF2\u786E\u8BA4\u5206\u955C\u52A8\u8D77\u6765\uFF1A${visibleAction}\u3002\u955C\u5934\uFF1A${cameraSeed}\u3002\u4E0D\u6539\u573A\u666F\u3001\u89D2\u8272\u3001\u9053\u5177\u548C\u6545\u4E8B\u3002`, negative_prompt: lock.forbiddenContradictions.join(", "), frame_mode: "first" };
  });
}
function JiarenRepairStoryboardRecords(rawShots, scenesValue, productionBeatsValue, scriptValue, lockValue, options = {}) {
  const fallback = JiarenBuildStoryboardFallbackRecords(scenesValue, productionBeatsValue, scriptValue, lockValue, options), source = Array.isArray(rawShots) ? rawShots : [], validSceneIds = new Set((Array.isArray(scenesValue) ? scenesValue : []).map((scene) => JiarenFirstString(scene, ["id", "sceneId", "scene_id"])).filter(Boolean));
  return fallback.map((base, index) => { const record = JiarenAsObject(source[index]), candidateSceneId = JiarenFirstString(record, ["scene_id", "sceneId"]), modelScriptBeat = JiarenFirstString(record, ["script_beat", "scriptBeat", "source_beat", "sourceBeat", "beat", "action"], base.script_beat), traceLocks = base.script_beat.split("\uFF1B").filter((part) => /^\u5BFC\u6F14\u786C\u9501\uFF1A/.test(part)); return { ...base, ...record, shot_id: JiarenFirstString(record, ["shot_id", "shotId", "id"], base.shot_id), scene_id: validSceneIds.has(candidateSceneId) ? candidateSceneId : base.scene_id, script_beat: JiarenStringArray([modelScriptBeat, ...traceLocks]).join("\uFF1B"), subject_action: JiarenFirstString(record, ["subject_action", "subjectAction", "action"], base.subject_action), image_prompt: JiarenFirstString(record, ["image_prompt", "imagePrompt", "prompt", "visual"], base.image_prompt), video_prompt: JiarenFirstString(record, ["video_prompt", "videoPrompt", "motion_prompt", "motionPrompt"], base.video_prompt) }; });
}
function JiarenParseTimecodeDuration(value) {
  const text = JiarenString(value);
  const match = text.match(/(\d{1,2}):(\d{2}(?:\.\d+)?)\s*[-–]\s*(\d{1,2}):(\d{2}(?:\.\d+)?)/);
  if (!match) return 0;
  const start = Number(match[1]) * 60 + Number(match[2]);
  const end = Number(match[3]) * 60 + Number(match[4]);
  return Number.isFinite(start) && Number.isFinite(end) && end > start ? end - start : 0;
}
function JiarenFormatTime(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safe / 60);
  const remain = safe - minutes * 60;
  const whole = Math.abs(remain - Math.round(remain)) < 1e-3;
  const secondText = whole ? String(Math.round(remain)).padStart(2, "0") : remain.toFixed(1).padStart(4, "0");
  return `${String(minutes).padStart(2, "0")}:${secondText}`;
}
function JiarenSnapDuration(value, seedance) {
  const duration = Number(value);
  if (seedance) return Number.isFinite(duration) ? Math.max(4, Math.min(15, Math.round(duration))) : 5;
  if (!Number.isFinite(duration)) return 5;
  return Math.max(4, Math.min(15, Math.round(duration * 10) / 10));
}
function JiarenNormalizeStoryboardPlan(rawShots, scenesValue, lockValue, options = {}) {
  const lock = JiarenNormalizeIntentLock(lockValue, options.originalRequest);
  const scenes = Array.isArray(scenesValue) ? scenesValue : [];
  const source = Array.isArray(rawShots) ? rawShots : [];
  if (!source.length) throw new Error("\u5206\u955C Agent \u6CA1\u6709\u8FD4\u56DE shots[]\u3002");
  const desiredShotCount = Math.max(1, Number(options.desiredShotCount) || source.length);
  if (source.length !== desiredShotCount) {
    throw new Error(`\u5206\u955C\u6570\u91CF\u9519\u8BEF\uFF1A\u9700\u8981 ${desiredShotCount} \u955C\uFF0C\u5B9E\u9645\u8FD4\u56DE ${source.length} \u955C\u3002`);
  }
  if (!scenes.length) throw new Error("\u5206\u955C\u751F\u6210\u524D\u6CA1\u6709\u5DF2\u786E\u8BA4\u573A\u666F\u8D44\u4EA7\u3002");
  const sceneById = /* @__PURE__ */ new Map();
  for (const scene of scenes) {
    const id2 = JiarenFirstString(scene, ["id", "sceneId", "scene_id"]);
    if (id2) sceneById.set(id2, scene);
  }
    const targetDuration = Math.max(1, Number(options.targetDurationSeconds) || desiredShotCount * 5);
    const preferredDuration = Math.max(4, Math.min(15, Math.round(targetDuration / desiredShotCount)));
  let cursor = 0;
  const rawPositiveTexts = [];
  const result = source.map((entry, index) => {
    const record = JiarenAsObject(entry);
    const sceneId = JiarenFirstString(record, ["scene_id", "sceneId"]);
    if (!sceneId) throw new Error(`\u955C\u5934 ${index + 1} \u7F3A\u5C11 sceneId\u3002`);
    const scene = sceneById.get(sceneId);
    if (!scene) throw new Error(`\u955C\u5934 ${index + 1} \u7ED1\u5B9A\u4E86\u4E0D\u5B58\u5728\u7684\u573A\u666F ${sceneId}\u3002`);
    const sceneVariants = Array.isArray(scene.sceneVariants) && scene.sceneVariants.length ? scene.sceneVariants : [{ id: scene.primaryVariantId || `${sceneId}-variant-01`, variantId: scene.primaryVariantId || `${sceneId}-variant-01`, title: "\u4E3B\u573A\u666F\u9996\u5E27", imageUrl: scene.imageUrl, sourceBeatIds: scene.sourceBeatIds || scene.beatRefs || [] }];
    const scriptBeat = JiarenFirstString(record, [
      "script_beat",
      "scriptBeat",
      "source_beat",
      "sourceBeat",
      "beat",
      "action"
    ]);
    if (!scriptBeat) throw new Error(`\u955C\u5934 ${index + 1} \u7F3A\u5C11 scriptBeat\uFF0C\u65E0\u6CD5\u8BC1\u660E\u4E0E\u5267\u672C\u7684\u5173\u7CFB\u3002`);
    const title = JiarenFirstString(record, ["title", "name"], `\u955C\u5934 ${index + 1}`);
    const shotSize = JiarenFirstString(record, ["shot_size", "shotSize", "framing"]);
    const lens = JiarenFirstString(record, ["lens", "focal_length", "focalLength"]);
    const cameraAngle = JiarenFirstString(record, ["camera_angle", "cameraAngle", "angle"]);
    const cameraMotion = JiarenFirstString(record, ["camera_motion", "cameraMotion", "movement", "camera"]);
    const subjectAction = JiarenFirstString(record, ["subject_action", "subjectAction", "action"], scriptBeat);
    const environment = JiarenFirstString(record, ["environment", "location"], JiarenString(scene.environment));
    const lighting = JiarenFirstString(record, ["lighting", "light"], JiarenString(scene.lighting));
    const transitionIn = JiarenFirstString(record, ["transition_in", "transitionIn"]);
    const transitionOut = JiarenFirstString(record, ["transition_out", "transitionOut", "transition"]);
    const requestedVariantId = JiarenFirstString(record, ["scene_variant_id", "sceneVariantId", "variant_id", "variantId"]);
    const matchingVariant = requestedVariantId ? sceneVariants.find((variant) => (variant.variantId || variant.id) === requestedVariantId) : sceneVariants.find((variant) => JiarenStringArray(variant.sourceBeatIds || variant.source_beat_ids).some((beatId) => JiarenTextContains(scriptBeat, beatId))) || sceneVariants[index % sceneVariants.length] || sceneVariants[0];
    const sceneVariantId = matchingVariant?.variantId || matchingVariant?.id || scene.primaryVariantId || `${sceneId}-variant-01`;
    const sceneVariantImageUrl = JiarenString(matchingVariant?.imageUrl) || JiarenString(scene.imageUrl);
    const charactersOnScreen = JiarenStringArray(record.characters_on_screen || record.charactersOnScreen || record.character_refs || record.characterRefs || record.cast || record.characters);
    const blocking = JiarenFirstString(record, ["blocking", "position", "screen_position", "screenPosition", "staging", "placement"]);
    const pose = JiarenFirstString(record, ["pose", "posture", "stance"]);
    const expression = JiarenFirstString(record, ["expression", "emotion", "facial_expression", "facialExpression"]);
    const dialogue = JiarenFirstString(record, ["dialogue", "line", "spoken_line", "spokenLine", "voiceover"]);
    const task = {
      action: subjectAction,
      position: blocking,
      pose,
      expression,
      dialogue,
      shotSize,
      cameraMotion,
      durationSec: 0
    };
    const directorSlices = JiarenStringArray(
      record.director_slices || record.directorSlices || record.micro_slices || record.microSlices || record.beats
    );
    const rawPrompt = JiarenFirstString(record, ["prompt", "image_prompt", "imagePrompt", "visual"]);
    const rawVideoPrompt = JiarenFirstString(record, [
      "video_prompt",
      "videoPrompt",
      "motion_prompt",
      "motionPrompt"
    ]);
    if (!rawPrompt && !rawVideoPrompt) throw new Error(`\u955C\u5934 ${index + 1} \u6CA1\u6709\u53EF\u6267\u884C\u7684\u753B\u9762\u6216\u89C6\u9891\u63D0\u793A\u8BCD\u3002`);
    const positiveText = [
      title,
      scriptBeat,
      shotSize,
      lens,
      cameraAngle,
      cameraMotion,
      subjectAction,
      environment,
      lighting,
      rawPrompt,
      rawVideoPrompt
    ].filter(Boolean).join(" / ");
    JiarenAssertNoForbidden(positiveText, lock, `\u955C\u5934\u300C${title}\u300D`);
    rawPositiveTexts.push(positiveText);
    const requestedDuration = Number(record.duration_sec ?? record.durationSec ?? record.duration) || JiarenParseTimecodeDuration(record.timecode);
    const remainingShots = desiredShotCount - index;
    const remainingDuration = Math.max(1, targetDuration - cursor);
    const suggestedDuration = requestedDuration || Math.min(preferredDuration, remainingDuration / remainingShots);
    const durationSec = JiarenSnapDuration(suggestedDuration, Boolean(options.seedance));
    task.durationSec = durationSec;
    const timecode = `${JiarenFormatTime(cursor)}-${JiarenFormatTime(cursor + durationSec)}`;
    cursor += durationSec;
    const lockText = JiarenIntentLockText(lock, lock.original, 1100);
    const sceneText = [
      scene.title,
      scene.location,
      scene.timeOfDay,
      scene.weather,
      scene.environment,
      scene.visualAnchors && scene.visualAnchors.join(" / "),
      matchingVariant?.title,
      matchingVariant?.beatSummary,
      matchingVariant?.camera,
      matchingVariant?.spatialFraming
    ].filter(Boolean).join(" / ");
    const prompt = [
      `SHOT ${index + 1}/${desiredShotCount}: ${title}; ${timecode}; sceneId=${sceneId}.`,
      `Bound script beat: ${scriptBeat}.`,
      `Camera-visible grammar: shot size=${shotSize || "must be explicit"}; lens=${lens || "must be explicit"}; angle=${cameraAngle || "must be explicit"}; movement=${cameraMotion || "must be explicit"}.`,
      `Visible subject action: ${subjectAction}.`,
      charactersOnScreen.length ? `Characters on screen: ${charactersOnScreen.join(" / ")}.` : "",
      blocking ? `Blocking and screen position: ${blocking}.` : "",
      pose ? `Pose/posture: ${pose}.` : "",
      expression ? `Facial expression/emotion: ${expression}.` : "",
      dialogue ? `Dialogue to preserve: "${dialogue.replace(/^['\"“”]|['\"“”]$/g, "")}".` : "",
      `Use internal setting key ${sceneVariantId} only to preserve script location/time/weather continuity; it is not an image asset.`,
      `Script-bound setting facts: ${sceneText}.`,
      lighting ? `Lighting: ${lighting}.` : "",
      rawPrompt,
      lockText,
      "This is one single storyboard keyframe, not a grid, poster, collage, or unrelated scenery insert."
    ].filter(Boolean).join("\n");
    const videoPrompt = [
      `Animate only approved shot ${index + 1}/${desiredShotCount}, ${timecode}, sceneId=${sceneId}.`,
      `Continue the exact approved script beat: ${scriptBeat}.`,
      `Reference priority: 1 character identity/outfit, 2 recurring prop/vehicle assets, 3 current storyboard keyframe composition/action, 4 previous accepted last frame continuity, 5 script setting facts control location/time/weather in text.`,
      `Camera: ${[shotSize, lens, cameraAngle, cameraMotion].filter(Boolean).join(" / ")}.`,
      `Subject action: ${subjectAction}.`,
      charactersOnScreen.length ? `Characters on screen: ${charactersOnScreen.join(" / ")}.` : "",
      blocking ? `Blocking: ${blocking}.` : "",
      pose ? `Pose: ${pose}.` : "",
      expression ? `Expression: ${expression}.` : "",
      dialogue ? `Spoken dialogue: "${dialogue.replace(/^['\"“”]|['\"“”]$/g, "")}".` : "",
      `Approved scene: ${sceneText}.`,
      rawVideoPrompt || rawPrompt,
      transitionIn ? `Transition in: ${transitionIn}.` : "",
      transitionOut ? `Transition out: ${transitionOut}.` : "",
      lockText,
      "Do not reinterpret this as a new scene. Do not recast characters, replace recurring assets, change time/weather, or switch media style."
    ].filter(Boolean).join("\n");
    const negativePrompt = JiarenStringArray([
      ...JiarenStringArray(record.negative_prompt || record.negativePrompt),
      ...lock.forbiddenContradictions,
      "unrelated location",
      "different character",
      "identity drift",
      "outfit change",
      "style switch",
      "subtitles",
      "watermark"
    ]).join(", ");
    const frameModeRaw = JiarenFirstString(record, ["frame_mode", "frameMode"], "first").toLowerCase();
    const frameMode = ["auto", "first", "firstlast", "multiframe"].includes(frameModeRaw) ? frameModeRaw : "first";
    const gridLayoutRaw = JiarenFirstString(record, ["grid_layout", "gridLayout", "storyboard_grid", "storyboardGrid"]).toLowerCase();
    const requestedPanelCount = Number(options.panelCount) || Number(record.panel_count ?? record.panelCount ?? record.grid_count ?? record.gridCount) || Number((gridLayoutRaw.match(/(\d+)\s*[x×]\s*(\d+)/) || [])[1]) * Number((gridLayoutRaw.match(/(\d+)\s*[x×]\s*(\d+)/) || [])[2]);
    const inferredPanelCount = directorSlices.length > 9 || durationSec > 10 ? 16 : directorSlices.length > 4 || durationSec > 6 ? 9 : 4;
    const panelCount = requestedPanelCount >= 13 ? 16 : requestedPanelCount >= 5 ? 9 : requestedPanelCount > 0 ? 4 : inferredPanelCount;
    const gridCols = panelCount <= 4 ? 2 : panelCount <= 9 ? 3 : 4;
    const gridRows = gridCols;
    const defaultSlice = [
      `- ${timecode}:`,
      [shotSize, lens, cameraAngle, cameraMotion].filter(Boolean).join(", "),
      subjectAction,
      environment,
      lighting
    ].filter(Boolean).join(" ");
    const normalizedSlices = JiarenBuildStoryboardSlices({ timecode, durationSec, directorSlices: directorSlices.length ? directorSlices : [defaultSlice], subjectAction, scriptBeat, prompt, videoPrompt, title, shotSize, lens, cameraAngle, cameraMotion, sceneId }, panelCount);
    return {
      id: JiarenFirstString(record, ["id", "shot_id", "shotId"], `shot-${String(index + 1).padStart(2, "0")}`),
      contractVersion: "t8-director-storyboard-v2",
      title,
      sceneId,
      sceneTitle: JiarenString(scene.title),
      sceneImageUrl: sceneVariantImageUrl,
      sceneVariantId,
      sceneVariantTitle: JiarenString(matchingVariant?.title),
      sceneVariantImageUrl,
      sceneVariantBeatIds: JiarenStringArray(matchingVariant?.sourceBeatIds || matchingVariant?.source_beat_ids),
      scriptBeat,
      timecode,
      durationSec,
      shotSize,
      lens,
      cameraAngle,
      cameraMotion,
      subjectAction,
      charactersOnScreen,
      blocking,
      pose,
      expression,
      dialogue,
      task,
      environment,
      lighting,
      transitionIn,
      transitionOut,
      prompt,
      videoPrompt,
      negativePrompt,
      continuityPrompt: [
        transitionIn ? `\u627F\u63A5\uFF1A${transitionIn}` : "",
        `\u4FDD\u6301\u573A\u666F ${sceneId}\u3001\u89D2\u8272\u8EAB\u4EFD\u3001\u670D\u88C5\u3001\u5173\u952E\u8D44\u4EA7\u3001\u5149\u7EBF\u548C\u5C4F\u5E55\u65B9\u5411\u3002`,
        transitionOut ? `\u4EA4\u63A5\uFF1A${transitionOut}` : ""
      ].filter(Boolean).join(" "),
      beats: normalizedSlices,
      microSlices: normalizedSlices,
      panelCount,
      gridRows,
      gridCols,
      gridLayout: `${gridCols}x${gridRows}`,
      showIndexes: true,
      showCaptions: false,
      globalSubtitle: dialogue,
      storyboardCaptions: Array.from({ length: panelCount }, (_2, captionIndex) => captionIndex === 0 ? dialogue : ""),
      frameMode,
      characterRefs: JiarenStringArray(record.character_refs || record.characterRefs),
      sceneRef: sceneId,
      propRefs: JiarenStringArray(record.prop_refs || record.propRefs),
      localRefImages: [],
      localRefVideos: [],
      localRefAudios: [],
      localRefOrder: [
        { kind: "image", role: "character_reference" },
        { kind: "image", role: "storyboard_first_frame" },
        { kind: "image", role: "previous_last_frame" },
        { kind: "text", role: "script_setting_facts" }
      ],
      status: "planned",
      taskId: null,
      taskProvider: null,
      videoUrl: null,
      error: null,
      videoPending: true
    };
  });
  const coverageErrors = JiarenValidateStoryboardPlan(rawPositiveTexts, lock);
  if (coverageErrors.length) throw new Error(`\u5206\u955C\u672A\u901A\u8FC7\u5BFC\u6F14\u610F\u56FE\u6821\u9A8C\uFF1A${coverageErrors.join("\uFF1B")}`);
  return result;
}
function JiarenValidateStoryboardPlan(rawPositiveTexts, lockValue) {
  const lock = JiarenNormalizeIntentLock(lockValue);
  const shots = Array.isArray(rawPositiveTexts) ? rawPositiveTexts : [];
  const combined = shots.join("\n");
  const errors = [];
  for (const action of lock.hardRequiredActions) {
    if (!JiarenTextContains(combined, action)) errors.push(`\u7F3A\u5C11\u5FC5\u8981\u52A8\u4F5C\u300C${action}\u300D`);
  }
  for (const location of lock.locations.filter((item) => item.constraintLevel === "hard")) {
    if (!JiarenTextContains(combined, location.name)) errors.push(`\u7F3A\u5C11\u5730\u70B9\u300C${location.name}\u300D`);
  }
  for (const asset of lock.recurringAssets.filter((item) => item.constraintLevel === "hard")) {
    if (!JiarenTextContains(combined, asset.name)) errors.push(`\u7F3A\u5C11\u6301\u7EED\u8D44\u4EA7\u300C${asset.name}\u300D`);
    if (asset.hardRequiredEveryShot) {
      shots.forEach((shot, index) => {
        if (!JiarenTextContains(shot, asset.name)) errors.push(`\u955C\u5934 ${index + 1} \u4E22\u5931\u6301\u7EED\u8D44\u4EA7\u300C${asset.name}\u300D`);
      });
    }
  }
  for (const forbidden of lock.forbiddenContradictions) {
    if (JiarenTextContains(combined, forbidden)) errors.push(`\u51FA\u73B0\u7981\u6B62\u5185\u5BB9\u300C${forbidden}\u300D`);
  }
  return JiarenStringArray(errors);
}
function JiarenSceneVariantForShot(sceneValue, shotValue) {
  const scene = JiarenAsObject(sceneValue);
  const shot = JiarenAsObject(shotValue);
  const variants = Array.isArray(scene.sceneVariants) ? scene.sceneVariants : [];
  if (!variants.length) return {
    variantId: JiarenFirstString(scene, ["primaryVariantId"]) || `${JiarenFirstString(scene, ["id", "sceneId"], "scene")}-variant-01`,
    title: "\u4E3B\u573A\u666F\u9996\u5E27",
    imageUrl: void 0,
    sourceBeatIds: JiarenStringArray(scene.sourceBeatIds || scene.beatRefs),
    beatSummary: JiarenFirstString(shot, ["scriptBeat", "subjectAction"]),
    camera: JiarenFirstString(scene, ["camera"]),
    spatialFraming: JiarenFirstString(scene, ["spatialFraming"])
  };
  const variantId = JiarenFirstString(shot, ["sceneVariantId", "scene_variant_id", "variantId", "variant_id"]);
  return variants.find((variant) => (variant.variantId || variant.id) === variantId) || variants.find((variant) => JiarenStringArray(variant.sourceBeatIds || variant.source_beat_ids).some((beatId) => JiarenTextContains(JiarenFirstString(shot, ["scriptBeat", "subjectAction"]), beatId))) || variants[0];
}
function JiarenStoryboardImageContract(shot, index, scene, project, scriptBeat, kind) {
  const original = JiarenString(project?.intentLock?.original) || JiarenString(project?.studioConfig?.userIdea);
  const lock = JiarenNormalizeIntentLock(project?.intentLock, original);
  const sceneId = JiarenFirstString(scene, ["id", "sceneId", "scene_id"]) || JiarenString(shot?.sceneId) || "unbound";
  const character = JiarenAsObject(project?.character);
  const allCharacters = [character, ...Array.isArray(project?.characters) ? project.characters.map(JiarenAsObject) : []].filter((item, itemIndex, items) => {
    const name = JiarenFirstString(item, ["name", "id", "characterId", "character_id"]);
    return name && items.findIndex((candidate) => JiarenFirstString(candidate, ["name", "id", "characterId", "character_id"]) === name) === itemIndex;
  });
  const requestedCharacters = JiarenStringArray(shot?.charactersOnScreen || shot?.characters_on_screen || shot?.characterRefs || shot?.character_refs);
  const visibleCharacters = requestedCharacters.length ? allCharacters.filter((item) => {
    const name = JiarenFirstString(item, ["name", "id", "characterId", "character_id"]);
    return requestedCharacters.some((requested) => JiarenTextContains(name, requested) || JiarenTextContains(requested, name));
  }) : allCharacters.slice(0, 1);
  const characterText = (visibleCharacters.length ? visibleCharacters : allCharacters.slice(0, 1)).map((item) => [item.name, item.appearance, item.description].filter(Boolean).join(" / ")).filter(Boolean).join("; ");
  const recurringAssets = (Array.isArray(project?.propAssets) ? project.propAssets : []).map((asset) => {
    const record = JiarenAsObject(asset);
    return [record.name, record.appearance, record.description].filter(Boolean).join(" / ");
  }).filter(Boolean).join("; ");
  const sceneVariant = JiarenSceneVariantForShot(scene, shot);
  const sceneText = [
    scene?.title,
    scene?.location || scene?.sourceLocation,
    scene?.timeOfDay || scene?.sourceTime,
    scene?.weather,
    scene?.environment || scene?.description,
    Array.isArray(scene?.visualAnchors) ? scene.visualAnchors.join(" / ") : "",
    scene?.lighting,
    sceneVariant?.title,
    sceneVariant?.beatSummary,
    sceneVariant?.camera,
    sceneVariant?.spatialFraming
  ].filter(Boolean).join(" / ");
  return JiarenCompactText(
    [
      `JIAREN STORYBOARD IMAGE HARD CONTRACT (${kind || "keyframe"}) shot ${Number(index) + 1}; sceneId=${sceneId}.`,
      JiarenIntentLockText(lock, original, 900),
      `Bound script beat: ${shot?.scriptBeat || scriptBeat || shot?.subjectAction || "missing"}.`,
      `Visible action: ${shot?.subjectAction || scriptBeat || shot?.prompt || "missing"}.`,
      Array.isArray(shot?.charactersOnScreen) && shot.charactersOnScreen.length ? `Characters on screen: ${shot.charactersOnScreen.join(" / ")}.` : "",
      shot?.blocking ? `Blocking/screen position: ${shot.blocking}.` : "",
      shot?.pose ? `Pose/posture: ${shot.pose}.` : "",
      shot?.expression ? `Expression/emotion: ${shot.expression}.` : "",
      shot?.dialogue ? `Dialogue: "${String(shot.dialogue).replace(/^['\"“”]|['\"“”]$/g, "")}".` : "",
      `Camera-visible plan: shot size=${shot?.shotSize || "explicit"}; lens=${shot?.lens || "explicit"}; angle=${shot?.cameraAngle || "explicit"}; movement=${shot?.cameraMotion || "explicit"}.`,
      `Script-bound setting key: ${sceneVariant?.variantId || sceneVariant?.id || shot?.sceneVariantId || "primary"}.`,
      `Script-bound location/time/weather facts: ${sceneText || `sceneId=${sceneId}`}.`,
      `Approved on-screen character identities/outfits: ${characterText || [character.name, character.appearance, character.description].filter(Boolean).join(" / ")}.`,
      recurringAssets ? `Approved recurring assets: ${recurringAssets}.` : "",
      shot?.negativePrompt ? `Negative prompt: ${shot.negativePrompt}.` : "",
      "Reference priority: character identity/outfit > current storyboard keyframe composition/action > previous accepted last frame > script-bound setting facts in text.",
      "Ignore any generic genre template that conflicts with this contract."
    ].filter(Boolean).join("\n"),
    2050
  );
}
function JiarenBuildStoryboardSlices(shotValue, panelCount = 9) {
  const shot = JiarenAsObject(shotValue);
  const count = Math.max(1, Math.min(16, Math.round(Number(panelCount) || 1)));
  const supplied = JiarenStringArray(
    shot.microSlices || shot.micro_slices || shot.directorSlices || shot.director_slices || shot.beats
  );
  if (supplied.length === count && new Set(supplied).size === count) return supplied;
  const match = JiarenString(shot.timecode).match(
    /(\d{1,2}):(\d{2}(?:\.\d+)?)\s*[-–]\s*(\d{1,2}):(\d{2}(?:\.\d+)?)/
  );
  const start = match ? Number(match[1]) * 60 + Number(match[2]) : 0;
  const parsedEnd = match ? Number(match[3]) * 60 + Number(match[4]) : start + Number(shot.durationSec || 5);
  const end = Number.isFinite(parsedEnd) && parsedEnd > start ? parsedEnd : start + 5;
  const phaseLabels = [
    "\u7A7A\u95F4\u5EFA\u7ACB",
    "\u4E3B\u4F53\u5165\u753B",
    "\u52A8\u4F5C\u8D77\u70B9",
    "\u8DDF\u968F\u63A8\u8FDB",
    "\u52A8\u4F5C\u53D1\u5C55",
    "\u5173\u952E\u7EC6\u8282",
    "\u52A8\u4F5C\u8F6C\u6298",
    "\u8854\u63A5\u9884\u5907",
    "\u672B\u5E27\u4EA4\u63A5"
  ];
  const cameraCues = [
    "\u5168\u666F\u5EFA\u7ACB\u5730\u70B9\u3001\u5929\u6C14\u4E0E\u4E3B\u4F53\u76F8\u5BF9\u4F4D\u7F6E",
    "\u4E2D\u666F\u8BA9\u4E3B\u4F53\u4E0E\u6301\u7EED\u8D44\u4EA7\u540C\u65F6\u6E05\u6670\u5165\u753B",
    "\u7A81\u51FA\u52A8\u4F5C\u8D77\u70B9\u5E76\u4FDD\u6301\u89D2\u8272\u8EAB\u4EFD\u548C\u8D44\u4EA7\u7EC6\u8282",
    "\u6CBF\u5DF2\u786E\u8BA4\u5C4F\u5E55\u65B9\u5411\u8DDF\u968F\u4E3B\u4F53\u63A8\u8FDB",
    "\u4FDD\u6301\u573A\u666F\u8F74\u7EBF\u5B8C\u6210\u4E2D\u6BB5\u52A8\u4F5C\u53D1\u5C55",
    "\u5F3A\u8C03\u5F53\u524D\u5267\u672C\u52A8\u4F5C\u7684\u5173\u952E\u53EF\u89C1\u7EC6\u8282",
    "\u627F\u63A5\u52A8\u4F5C\u8F6C\u6298\u5E76\u5EF6\u7EED\u955C\u5934\u8FD0\u52A8",
    "\u4E3A\u4E0B\u4E00\u955C\u4FDD\u7559\u89C6\u7EBF\u3001\u59FF\u6001\u4E0E\u8FD0\u52A8\u65B9\u5411",
    "\u9501\u5B9A\u672B\u5E27\u4F4D\u7F6E\u3001\u5149\u7EBF\u548C\u8FD0\u52A8\u8D8B\u52BF\u7528\u4E8E\u63A5\u529B"
  ];
  const fallback = JiarenFirstString(shot, [
    "subjectAction",
    "subject_action",
    "scriptBeat",
    "script_beat",
    "prompt",
    "videoPrompt",
    "video_prompt",
    "title"
  ]);
  const sceneId = JiarenFirstString(shot, ["sceneId", "scene_id", "sceneRef", "scene_ref"]);
  const camera = [shot.shotSize, shot.lens, shot.cameraAngle, shot.cameraMotion].filter(Boolean).join(" / ");
  return Array.from({ length: count }, (_2, index) => {
    const sourceIndex = supplied.length ? Math.min(supplied.length - 1, Math.floor(index * supplied.length / count)) : -1;
    const source = sourceIndex >= 0 ? supplied[sourceIndex] : fallback;
    const cleanSource = JiarenString(source).replace(/^\s*-?\s*\d{1,2}:\d{2}(?:\.\d+)?\s*[-–]\s*\d{1,2}:\d{2}(?:\.\d+)?\s*[:：]?\s*/, "").trim();
    const sliceStart = start + (end - start) * index / count;
    const sliceEnd = start + (end - start) * (index + 1) / count;
    const phaseIndex = Math.min(
      phaseLabels.length - 1,
      Math.floor(index * phaseLabels.length / count)
    );
    return [
      `- ${JiarenFormatTime(sliceStart)}-${JiarenFormatTime(sliceEnd)}`,
      `${phaseLabels[phaseIndex]}\uFF1A${cameraCues[phaseIndex]}`,
      cleanSource || fallback,
      camera ? `\u955C\u5934\u8BED\u6CD5 ${camera}` : "",
      sceneId ? `\u7ED1\u5B9A\u573A\u666F ${sceneId}` : ""
    ].filter(Boolean).join("\uFF1B");
  });
}
function kd() {
  var Er, Dr, Rr;
  const [n, i] = v.useState(false), [c, u] = v.useState(false), [b, m] = v.useState(""), [A, P] = v.useState(), S = _((e) => e.workflowNodes), B = _((e) => e.workflowEdges), E = _((e) => e.canvasAssets), me = _((e) => e.selectedAssetId), Z = _((e) => e.selectedNodeId), H = _((e) => e.history), F = _((e) => e.storageSettings), ve = _((e) => e.gridVisible), xe = _((e) => e.toggleGrid), Pe = _((e) => e.setStats), z = _((e) => e.setStorageSettings), f = _((e) => e.setWorkflowNodes), se = _((e) => e.setWorkflowEdges), T = _((e) => e.setCanvasAssets), q = _((e) => e.setHistory), Ne = _((e) => e.addCanvasAsset), Ce = _((e) => e.addReusableAsset), Ae = _((e) => e.createWorkflowNode), ze = _((e) => e.setSelectedNode), R = _((e) => e.runtimeSettings), Q = _((e) => e.uiPreferences), C = _((e) => e.setUiPreferences), k = _((e) => e.hydratePreferences), pe = v.useMemo(() => jd(E.find((e) => e.id === me), S.find((e) => e.id === Z)), [E, me, Z, S]), ee = v.useRef(false), Ue = v.useRef(false), te = v.useRef(null), Be = v.useRef(null), w = v.useRef(null), [X, we] = v.useState(false), [Ve, Ua] = v.useState(false), [Ei, vn] = v.useState("\u672A\u67E5\u8BE2"), [yo, jn] = v.useState("\u6D4B\u8BD5\u8FDE\u63A5\u53EA\u67E5\u8BE2\u6A21\u578B\u5217\u8868\u548C\u4F59\u989D\uFF0C\u4E0D\u751F\u6210\u56FE\u7247/\u89C6\u9891\u3002"), [Ba, xn] = v.useState(), [bo, Di] = v.useState(false), [Ma, Kn] = v.useState(false), [Ri, rn] = v.useState(false), [An, Vn] = v.useState(false), [vo, jo] = v.useState("seedance-story"), [Xe, Mt] = v.useState(""), [Le, Gn] = v.useState([]), [Ea, xo] = v.useState(), [Ti, zn] = v.useState(""), [Jn, Hn] = v.useState(""), [Li, Oi] = v.useState(""), [_i, Fi] = v.useState(""), [it, et] = v.useState(), [Pd] = v.useState(true), [wn, ft] = v.useState(false), [kn, qe] = v.useState(false), [Wn, on] = v.useState("\u6211\u7684"), [Da, Ra] = v.useState("story-short"), [qn, Ao] = v.useState("three-d"), [Ta, Qi] = v.useState("12"), [Et, La] = v.useState("9:16"), [Dt, Ki] = v.useState("\u4E2D\u6587"), [Rt, Cn] = v.useState("\u7535\u5F71\u611F"), [rt, wo] = v.useState("grid"), [Jt, ko] = v.useState(6), [In, $d] = v.useState("all"), [Ye, Yn] = v.useState(false), [ce, Ht] = v.useState("setup"), [Oe, kt] = v.useState([]), [yt, Zn] = v.useState(mi), [Xn, ea] = v.useState("3d"), [sn, Vi] = v.useState(""), [Gi, Sn] = v.useState(), [Pn, Ct] = v.useState(), [Oa, $n] = v.useState(false), [It, Nn] = v.useState({ x: 0, y: 0, zoom: 1 }), [Ge, bt] = v.useState(), [zi, ta] = v.useState(), [Je, cn] = v.useState(), [Co, Un] = v.useState([]), [Nd, na] = v.useState([]), [Ud, aa] = v.useState(), Ji = v.useRef(null), ia = v.useRef(null), videoRunAbortRef = v.useRef(null), _a = Q.language ?? "zh", Hi = (e, r) => _a === "en" ? r : e, [Wi, Io] = v.useState(() => Math.floor(Date.now() / 6e4)), qi = v.useMemo(() => wd(new Date(Wi * 6e4), _a), [Wi, _a]), Bn = v.useMemo(() => R.models.filter((e) => e.enabled && e.category === "image"), [R.models]), ot = v.useMemo(() => R.models.filter((e) => e.enabled && e.category === "video"), [R.models]), St = v.useMemo(() => R.models.filter((e) => e.enabled && (e.category === "music" || /suno|tts|voice|speech|audio|minimax|kling|riffusion|udio|whisper/i.test(mt(e)))), [R.models]), st = v.useMemo(() => R.models.filter((e) => e.enabled && od(e)), [R.models]), Fa = v.useMemo(() => Bn.find((e) => e.id === Ti) ?? Yr(Bn), [Ti, Bn]), vt = v.useMemo(() => ot.find((e) => e.id === Jn) ?? sd(ot), [Jn, ot]), ra = v.useMemo(() => st.find((e) => e.id === Li) ?? cd(st, R), [Li, st, R]), Qa = v.useMemo(() => St.find((e) => e.id === _i) ?? St.find((e) => /suno|tts|minimax|kling/i.test(mt(e))) ?? St[0], [_i, St]), ln = v.useMemo(() => ({ chat: He(st, [/claude[-_\s]?opus[-_\s]?4[-_\s]?7|claude.*opus.*4/i, /claude.*opus|claude.*sonnet/i]) ?? ra, image: en(R.models, R, Nt) ?? Fa, nano: en(R.models, R, Vl) ?? en(R.models, R, Na) ?? en(R.models, R, Bi) ?? go(R.models), video: He(ot, [/doubao[-_\s]?seedance[-_\s]?2(?:[._-]?0)?[-_\s]?mini|seedance.*2.*mini/i, /a2[-_]?seedance2\b|doubao[-_\s]?seedance[-_\s]?2[-_\s]?0[-_\s]?260128|seedance.*2\.0/i]) ?? vt, veo: He(ot, [/veo3\.1[-_\s]?pro|a2[-_]?veo31[-_]?pro/i]), sora: He(ot, [/sora[-_\s]?2/i]), audio: He(St, [/suno[-_\s]?v?4|suno/i]) ?? Qa, tts: He(St, [/minimax.*tts|tts|voice|speech/i]), grok: He(ot, [/grok.*video/i]) }), [st, St, ot, R.models, Qa, ra, Fa, vt]), dn = v.useMemo(() => {
    const e = /* @__PURE__ */ new Set();
    return ot.filter((r) => Aa(r) > 0).sort((r, a) => Aa(a) - Aa(r)).filter((r) => {
      const a = Kl(r);
      return !a || e.has(a) ? false : (e.add(a), true);
    }).slice(0, 6);
  }, [ot]), jt = v.useMemo(() => dn.find((e) => e.id === Jn) ?? (vt && Aa(vt) > 0 ? vt : void 0) ?? dn[0], [Jn, dn, vt]), So = mn(jt);
  wi.find((e) => e.id === qn) ?? wi[0];
  const lockedSourceRef = v.useRef("");
  const Ka = v.useMemo(() => xa.find((e) => e.id === Xn) ?? ui(qn), [qn, Xn]), oa = v.useMemo(() => Jr(Ka), [Ka]), Ze = li.find((e) => e.id === Ta) ?? li[0], Yi = v.useMemo(() => {
    const e = lockedSourceRef.current || Xe.trim() || "\u4E00\u4E2A\u52A8\u753B\u77ED\u89C6\u9891\u9879\u76EE", r = sn.trim() || Rt || "\u9AD8\u71C3";
    return { language: Pl(Dt), languageLabel: Dt, aspect_ratio: Et, vibe_tag: r, duration: $l(Ze.seconds), durationLabel: la(), durationSeconds: Ze.seconds, userIdea: e, isSeedanceVideoModel: lt() };
  }, [Et, Dt, Rt, Xe, sn, jt, Ze.seconds]), O = v.useMemo(() => Rl(Yi), [Yi]);
  di.find((e) => e.id === rt) ?? di[0], ci.find((e) => e.id === Da) ?? ci[0];
  const Va = ci.filter((e) => e.category === Wn), pn = Oe.filter((e) => e.step !== "setup" && On.includes(e.step));
  v.useEffect(() => {
    ce === "scene" && Ht("storyboard"), Oe.some((e) => e.step === "scene") && kt((e) => e.filter((r) => r.step !== "scene"));
  }, [ce, Oe]);
  v.useEffect(() => {
    if (!Gi) return;
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        e.preventDefault(), Sn(void 0);
      }
    };
    return window.addEventListener("keydown", closeOnEscape), () => window.removeEventListener("keydown", closeOnEscape);
  }, [Gi]);
  v.useEffect(() => {
    const e = window.setInterval(() => {
      Io(Math.floor(Date.now() / 6e4));
    }, 6e4);
    return () => window.clearInterval(e);
  }, []), v.useEffect(() => {
    const e = document.querySelector(".jiaren-page1-user-bubble p"), r = lockedSourceRef.current;
    if (e && r) e.textContent = `\u5DF2\u9501\u5B9A\u539F\u59CB\u6587\u672C\uFF08${r.length} \u5B57\uFF09\uFF1A${$(r, 180)}`;
  }, [Ye, Je, Xe, yt.script.phase]), v.useLayoutEffect(() => {
    if (!Ye) {
      ta(void 0);
      return;
    }
    let e = 0;
    const r = () => {
      const d = te.current, l = d == null ? void 0 : d.querySelector(".jiaren-page1-module-wrap.is-script .jiaren-page1-script-module"), p = d == null ? void 0 : d.querySelector(".jiaren-page1-module-wrap.is-character .jiaren-page1-character-grid");
      if (!l || !p) {
        ta(void 0);
        return;
      }
      const h = l.getBoundingClientRect(), g = Array.from(p.querySelectorAll(".jiaren-page1-character-module")), y = g.length >= 2 ? (g[0].getBoundingClientRect().bottom + g[1].getBoundingClientRect().top) / 2 : p.getBoundingClientRect().top, j = { x: Math.round(h.left + h.width / 2), y1: Math.round(h.bottom), y2: Math.round(y) };
      if (j.y2 <= j.y1 + 8) {
        ta(void 0);
        return;
      }
      ta((I) => I && I.x === j.x && I.y1 === j.y1 && I.y2 === j.y2 ? I : j);
    }, a = () => {
      e && cancelAnimationFrame(e), e = requestAnimationFrame(r);
    };
    a();
    const o = window.setTimeout(a, 160), s = window.setTimeout(a, 760);
    return window.addEventListener("resize", a), () => {
      e && cancelAnimationFrame(e), window.clearTimeout(o), window.clearTimeout(s), window.removeEventListener("resize", a);
    };
  }, [Ye, Oe, It.x, It.y, It.zoom]), v.useLayoutEffect(() => {
    if (!Ye || pn.length === 0) return;
    let e = 0;
    const r = () => {
      const a = te.current, o = a == null ? void 0 : a.querySelector(".jiaren-page1-production-board");
      if (!a || !o) return;
      const s = Array.from(o.querySelectorAll(":scope > .jiaren-page1-module-wrap")), d = s.find((p) => p.classList.contains(`is-${ce}`)) ?? s[s.length - 1];
      if (!d) return;
      const l = getComputedStyle(d), p = d.offsetLeft + (Number.parseFloat(l.getPropertyValue("--page1-node-x")) || 0), h = d.offsetTop + (Number.parseFloat(l.getPropertyValue("--page1-node-y")) || 0), g = Math.max(320, d.offsetWidth), y = Math.max(240, d.offsetHeight), j = document.body.classList.contains("jiaren-studio-collapsed") ? 36 : 432, I = 48, Q = 72, z = 88, W = Math.max(320, a.clientWidth - j - I), V = Math.max(260, a.clientHeight - Q - z), X = Math.max(0.42, 1 - Math.max(0, pn.length - 1) * 0.1), K = Math.min(1, W / (g + 80), V / (y + 80)), ee = Number(Math.max(0.32, Math.min(X, K)).toFixed(2)), Ue = Math.round(j + (W - g * ee) / 2 - p * ee), Ua = Math.round(Q + (V - y * ee) / 2 - h * ee);
      Nn((Ei) => Math.abs(Ei.x - Ue) < 1 && Math.abs(Ei.y - Ua) < 1 && Math.abs(Ei.zoom - ee) < 0.005 ? Ei : { x: Ue, y: Ua, zoom: ee });
    }, a = () => {
      e && cancelAnimationFrame(e), e = requestAnimationFrame(r);
    }, o = window.setTimeout(a, 180), s = window.setTimeout(a, 620);
    return a(), () => {
      e && cancelAnimationFrame(e), window.clearTimeout(o), window.clearTimeout(s);
    };
  }, [ce, pn.length, Ye]);
  function Zi(e = "seedance-story") {
    if (sa(e), ft(false), qe(false), et(void 0), C({ jiarenCanvasModeOpen: false, promptLibraryOpen: false, resourceLibraryOpen: false }), Ye) {
      Kn(true), Vn(true), rn(false);
      return;
    }
    rn(true);
  }
  async function Xi() {
    if (!lockedSourceRef.current && !Xe.trim() && Le.length === 0) {
      m("\u5148\u8F93\u5165\u6545\u4E8B/\u955C\u5934\u60F3\u6CD5\uFF0C\u6216\u4E0A\u4F20\u53C2\u8003\u56FE\u3002");
      return;
    }
    rn(false), Vn(true), Kn(true), Nn({ x: 0, y: 0, zoom: 1 }), await ca();
  }
  function er() {
    if (!lockedSourceRef.current && !Xe.trim() && Le.length === 0) {
      m("\u5148\u8F93\u5165\u6545\u4E8B/\u955C\u5934\u60F3\u6CD5\uFF0C\u6216\u4E0A\u4F20\u53C2\u8003\u56FE\u3002");
      return;
    }
    if (!wn) {
      qe(false), et(void 0), ft(true), m("\u8BF7\u5148\u786E\u8BA4\u7CFB\u7EDF\u53C2\u6570\uFF0C\u518D\u5F00\u59CB\u751F\u6210\u3002");
      return;
    }
    Xi();
  }
  function sa(e) {
    if (jo(e), et(void 0), ft(false), e === "character-design") {
      const r = Yr(Bn);
      r && zn(r.id);
    }
  }
  v.useEffect(() => {
    function e(a) {
      const o = a.detail;
      (o == null ? void 0 : o.references) && Gn((s) => [...s, ...o.references].slice(0, 8)), (o == null ? void 0 : o.prompt) && (lockedSourceRef.current = "", Mt(o.prompt)), Zi((o == null ? void 0 : o.mode) ?? "seedance-story");
    }
    function r(a) {
      const o = a.detail;
      (o == null ? void 0 : o.references) && Gn((s) => [...s, ...o.references].slice(0, 8)), (o == null ? void 0 : o.prompt) && (lockedSourceRef.current = "", Mt(o.prompt)), Zi((o == null ? void 0 : o.mode) ?? "seedance-story");
    }
    return window.addEventListener("jiaren-open-animation-workbench", e), window.addEventListener("jiaren-open-primary-animation-video", r), () => {
      window.removeEventListener("jiaren-open-animation-workbench", e), window.removeEventListener("jiaren-open-primary-animation-video", r);
    };
  }, [Ye]);
  async function Ga(e) {
    const r = Array.from(e).filter((s) => s.type.startsWith("image/"));
    if (r.length === 0) return;
    const o = (await Promise.all(r.slice(0, 6).map(async (s) => ({ id: crypto.randomUUID(), name: s.name || "\u53C2\u8003\u56FE", source: await dd(s), mimeType: s.type })))).map((s) => ({ ...s, dataUrl: s.source }));
    if (Gn((s) => [...s, ...o].slice(0, 8)), Ye && Co.length > 0) {
      const s = o.map((d, l) => To(d, `\u53C2\u8003\u56FE ${l + 1}`));
      Un((d) => d.map((l) => l.type === "Input_Script" || l.type === "Output_Storyboard" ? { ...l, data: { ...l.data, references: [...l.data.references ?? [], ...s].slice(0, 8) } } : l));
    }
    m(`\u5DF2\u52A0\u5165 ${o.length} \u5F20\u53C2\u8003\u56FE\u3002`);
  }
  async function Mn() {
    var r, a;
    const e = await ((r = window.jiaren) == null ? void 0 : r.system.selectFiles({ kind: "image", cacheDir: F.cacheDir }));
    if (e && !e.canceled && e.assets.length > 0) {
      const o = e.assets.slice(0, 8).map((s) => ({ id: s.id, name: s.name || "\u53C2\u8003\u56FE", source: s.dataUrl || s.localPath || "", dataUrl: s.dataUrl, localPath: s.localPath, mimeType: s.mimeType })).filter((s) => s.source);
      Gn((s) => [...s, ...o].slice(0, 8)), m(`\u5DF2\u52A0\u5165 ${o.length} \u5F20\u53C2\u8003\u56FE\u3002`);
      return;
    }
    (a = Ji.current) == null || a.click();
  }
  async function $o(e) {
    e.target.files && (await Ga(e.target.files), e.target.value = "");
  }
  async function No(e) {
    var a;
    const r = (a = e.target.files) == null ? void 0 : a[0];
    if (r) try {
      const s = (await pd(r)).trim();
      if (!s) throw new Error("\u6587\u4EF6\u5185\u5BB9\u4E3A\u7A7A");
      const d = JiarenSourceProfile(s), l = JiarenSourceTypeLabel(d.type);
      lockedSourceRef.current = s, Mt(""), xo(r.name), cn({ text: s, sourceIdea: s, originalSource: s, sourceText: s, fileName: r.name, sourceType: d.type }), Yn(true), Ht("script"), m(`\u5DF2\u5BFC\u5165\u6587\u7A3F\uFF1A${r.name}\uFF08\u8BC6\u522B\u4E3A${l}\uFF0C${d.compactLength} \u5B57\uFF09\u3002\u539F\u6587\u5DF2\u9501\u5B9A\uFF0C\u751F\u6210\u65F6\u5C06\u6309\u8BE5\u7C7B\u578B\u4F7F\u7528\u5BF9\u5E94\u7F16\u5267\u89C4\u5219\u3002`);
    } catch (s) {
      m(`\u6587\u7A3F\u8BFB\u53D6\u5931\u8D25\uFF1A${s instanceof Error ? s.message : "\u65E0\u6CD5\u8BC6\u522B\u6587\u672C\u5185\u5BB9"}\u3002`);
    } finally {
      e.target.value = "";
    }
  }
  async function tr(e) {
    e.preventDefault(), await Ga(e.dataTransfer.files);
  }
  async function za(e) {
    const r = Array.from(e.clipboardData.items).filter((o) => o.type.startsWith("image/"));
    if (r.length === 0) return;
    const a = r.map((o) => o.getAsFile()).filter((o) => !!o);
    a.length > 0 && await Ga(a);
  }
  async function ca(sourceInput, revisionInput = "") {
    const isClickEvent = sourceInput && typeof sourceInput === "object" && ("nativeEvent" in sourceInput || "currentTarget" in sourceInput),
      explicitSource = !isClickEvent && sourceInput !== void 0 ? String(sourceInput).trim() : "",
      e = explicitSource || lockedSourceRef.current || Xe.trim(),
      revisionInstruction = String(revisionInput || "").trim();
    if (!e && Le.length === 0) {
      m("\u5148\u8F93\u5165\u6545\u4E8B/\u955C\u5934\u60F3\u6CD5\uFF0C\u6216\u4E0A\u4F20\u53C2\u8003\u56FE\u3002");
      return;
    }
    const r = He(st, [
      /claude[-_\s]?opus[-_\s]?4[-_\s]?7|claude.*opus.*4/i,
      /claude.*opus|claude.*sonnet/i
    ]), a = en(R.models, R, Nt), o = He(ot, [
      /a2[-_]?seedance2[-_]?mini\b|doubao[-_\s]?seedance[-_\s]?2(?:[._-]?0)?[-_\s]?mini|seedance.*2.*mini/i,
      /a2[-_]?seedance2\b|doubao[-_\s]?seedance[-_\s]?2[-_\s]?0[-_\s]?260128|seedance.*2\.0/i
    ]), s = He(St, [/suno[-_\s]?v?4|suno/i]);
    r && Oi(r.id);
    a && zn(a.id);
    o && Hn(o.id);
    s && Fi(s.id);
    Zn(mi());
    ea(ui(qn)?.id || "3d");
    $n(false);
    Un([]);
    na([]);
    aa(void 0);
    cn(void 0);
    kt([]);
    Yn(true);
    Ht("script");
    const sourceProfile = JiarenSourceProfile(e), sourceTypeLabel = JiarenSourceTypeLabel(sourceProfile.type);
    ke("script", {
      phase: "running",
      message: `\u5DF2\u8BC6\u522B\u4E3A${sourceTypeLabel}\uFF0C\u6B63\u5728\u6309\u5BF9\u5E94\u89C4\u5219\u9501\u5B9A\u89D2\u8272\u3001\u5730\u70B9\u3001\u52A8\u4F5C\u3001\u5BF9\u767D\u548C\u5173\u952E\u8D44\u4EA7\u3002`
    });
    try {
      const l = e || "\u8BF7\u57FA\u4E8E\u4E0A\u4F20\u7684\u53C2\u8003\u56FE\u751F\u6210\u4E00\u4E2A\u77ED\u89C6\u9891\u6545\u4E8B\u3002",
        scriptAdapter = Rl({ ...Yi, userIdea: l });
      lockedSourceRef.current = l;
      const intentSchema = [
        "\u5728\u5199\u5267\u672C\u524D\u5148\u5EFA\u7ACB DIRECTOR INTENT LOCK\u3002\u53EA\u80FD\u63D0\u53D6\u7528\u6237\u660E\u786E\u7ED9\u51FA\u7684\u4E8B\u5B9E\uFF0C\u4E0D\u80FD\u8865\u5199\u7528\u6237\u6CA1\u6709\u8BF4\u8FC7\u7684\u5730\u70B9\u3001\u65F6\u4EE3\u3001\u5929\u6C14\u3001\u4EBA\u7269\u6027\u522B\u3001\u670D\u88C5\u3001\u9053\u5177\u6216\u98CE\u683C\u3002",
        "intent_lock \u5FC5\u987B\u5305\u542B\uFF1Aoriginal_request \u539F\u6587\u3001protagonists\u3001locations\u3001recurring_assets\u3001required_actions\u3001visual_style\u3001story_facts\u3001forbidden_contradictions\u3002",
        "script[] \u53EA\u5199 Fountain \u4E13\u4E1A\u5267\u672C\u6B63\u6587\uFF1Bproduction_beats[] \u4FDD\u5B58\u7A33\u5B9A beat_id\u3001scene_id\u3001\u53EF\u89C1\u52A8\u4F5C\u3001\u5BF9\u767D/\u753B\u5916\u97F3\u3001\u955C\u5934\u3001\u58F0\u97F3\u4E0E\u8854\u63A5\u7EBF\u7D22\uFF1B\u5173\u952E\u89D2\u8272\u548C\u6301\u7EED\u8D44\u4EA7\u4E0D\u80FD\u5728\u540E\u7EED\u8282\u62CD\u65E0\u6545\u6D88\u5931\u6216\u6539\u53D8\u3002",
        '\u4E25\u683C JSON \u9876\u5C42\u5FC5\u987B\u540C\u65F6\u5305\u542B\uFF1Aintent_lock\u3001script\u3001production_beats\u3001characters\u3001scene_seed\u3001source_event_coverage\u3001quality_check\u3002'
      ].join("\n");
      const revisionBlock = revisionInstruction
        ? `用户修改意见：${revisionInstruction}
修改只能作用于表达方式、节奏、对白自然度或补漏；如果输入是小说/章节，必须继续以原小说为唯一剧情来源，不得用修改意见替换原文。`
        : "";
      let p = await Rn(
        "script",
        `${scriptAdapter.adapter.wrapScriptPrompt(
          l,
          "\u5148\u6839\u636E\u7528\u6237\u63D0\u793A\u8BCD\u751F\u6210\u53EF\u786E\u8BA4\u5267\u672C\u3002\u7528\u6237\u786E\u8BA4\u540E\u8FDB\u5165\u5236\u4F5C\u6D41\u7A0B\uFF1A\u5267\u672C -> \u89D2\u8272\u8D44\u4EA7 -> \u573A\u666F\u7D20\u6750 -> \u5206\u955C -> \u89C6\u9891 -> \u97F3\u9891 -> \u6210\u7247\u3002"
        )}

${intentSchema}

${revisionBlock}`,
        {
          includeReferences: true,
          contextOverride: "Pre-direct-storyboard screenwriter stage. Generate only the intent lock and script artifact for user confirmation; do not create storyboard images or videos."
        }
      );
      let h = un(p);
      let g = JiarenNormalizeFountainSceneBlocks(pr(h, p, l));
      h = JiarenReconcileProductionPayload(l, g, h);
      let y = JiarenVisibleScriptSegments(g).join("\n\n").trim();
      if (!y) throw new Error("\u7F16\u5267\u6CA1\u6709\u8FD4\u56DE\u53EF\u786E\u8BA4\u5267\u672C\u3002");
      let coverage = JiarenValidateScriptArtifact(l, g, h);
      for (let repairAttempt = 0; coverage && repairAttempt < 2; repairAttempt += 1) {
        ke("script", {
          phase: "running",
          message: `\u6B63\u5728\u9010\u6761\u6838\u5BF9\u539F\u6587\u4E8B\u4EF6\uFF0C\u7B2C ${repairAttempt + 1}/2 \u6B21\u81EA\u52A8\u8865\u5168\u7F3A\u5931\u5267\u60C5\u3002`
        });
        p = await Rn(
          "script",
          `${scriptAdapter.adapter.wrapScriptPrompt(
            l,
            "\u8BF7\u4F9D\u636E\u7528\u6237\u63D0\u793A\u8BCD\u751F\u6210\u53EF\u786E\u8BA4\u5267\u672C\u3002\u7528\u6237\u786E\u8BA4\u540E\u8FDB\u5165\u5236\u4F5C\u6D41\u7A0B\uFF1A\u5267\u672C -> \u89D2\u8272\u8D44\u4EA7 -> \u573A\u666F\u7D20\u6750 -> \u5206\u955C -> \u89C6\u9891 -> \u97F3\u9891 -> \u6210\u7247\u3002"
          )}

${intentSchema}

${revisionBlock}

        ${JiarenScriptRepairPrompt(l, coverage, g.join("\n\n"))}`,
          {
            includeReferences: true,
            contextOverride: "Pre-direct-storyboard screenwriter repair stage. Rebuild only the complete intent lock and script artifact; do not create storyboard images or videos."
          }
        );
        const patchPayload = un(p), patchScript = JiarenNormalizeFountainSceneBlocks(pr(patchPayload, p, l));
        if (JiarenIsLiterarySource(l)) {
          const merged = JiarenMergeNovelRepair(l, g, h, patchScript, patchPayload, coverage);
          g = merged.script;
          h = merged.payload;
        } else {
          h = patchPayload;
          g = patchScript;
        }
        h = JiarenReconcileProductionPayload(l, g, h);
        y = JiarenVisibleScriptSegments(g).join("\n\n").trim();
        if (!y) throw new Error("\u7F16\u5267\u6CA1\u6709\u8FD4\u56DE\u53EF\u786E\u8BA4\u5267\u672C\u3002");
        coverage = JiarenValidateScriptArtifact(l, g, h);
      }
      if (coverage && JiarenIsLiterarySource(l)) {
        const faithful = JiarenBuildFaithfulNovelArtifact(l, h);
        const faithfulCoverage = JiarenValidateScriptArtifact(l, faithful.script, faithful.payload);
        if (!faithfulCoverage) {
          g = faithful.script;
          h = faithful.payload;
          y = JiarenVisibleScriptSegments(g).join("\n\n").trim();
          coverage = void 0;
          ke("script", { phase: "running", message: "AI 补写仍有遗漏，已按原文事件账本组装完整忠实稿，正在完成最终校验。" });
        }
      }
      const validation = Dl(g, O.runtimeParams);
      if (validation) throw new Error(validation);
      if (coverage) throw new Error(`${coverage.message || "\u7F16\u5267\u8FD4\u56DE\u4ECD\u4E0D\u5B8C\u6574\u3002"}\u5DF2\u4FDD\u7559\u5F53\u524D\u8349\u7A3F\uFF0C\u53EF\u7EE7\u7EED\u5B9A\u70B9\u8865\u5199\u3002`);
      const intentLock = JiarenNormalizeIntentLock(h, l);
      cn({ text: y, sourceIdea: l, originalSource: l, sourceText: l, fileName: Ea, intentLock, rawAgentPayload: h });
      Mt("");
      ke("script", {
        phase: "ready",
        message: "\u5267\u672C\u8349\u7A3F\u4E0E\u5BFC\u6F14\u610F\u56FE\u9501\u5DF2\u751F\u6210\uFF0C\u8BF7\u786E\u8BA4\u540E\u8FDB\u5165\u89D2\u8272\u3001\u573A\u666F\u548C\u5206\u955C\u5236\u4F5C\u3002"
      });
      m("\u7F16\u5267\u8349\u7A3F\u5DF2\u751F\u6210\u3002\u540E\u7EED\u573A\u666F\u3001\u5206\u955C\u56FE\u548C\u89C6\u9891\u90FD\u4F1A\u7EE7\u627F\u540C\u4E00\u4EFD\u5BFC\u6F14\u610F\u56FE\u9501\u3002");
    } catch (l) {
      const p = ti(l);
      ke("script", { phase: "failed", message: `\u7F16\u5267\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\uFF1A${p}` });
      m(`\u7F16\u5267\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\uFF1A${p}`);
    }
  }
  function Ja() {
    if (!Je?.text.trim()) {
      m("\u8FD8\u6CA1\u6709\u53EF\u786E\u8BA4\u7684\u5267\u672C\u8349\u7A3F\u3002");
      return;
    }
    const e = JiarenStoredSourceIdea(lockedSourceRef.current, Je);
    if (!e) {
      m("\u539F\u59CB\u5C0F\u8BF4/\u9700\u6C42\u5DF2\u4E22\u5931\uFF0C\u672C\u6B21\u4E0D\u4F1A\u5192\u9669\u751F\u6210\u65B0\u5267\u60C5\u3002\u8BF7\u91CD\u65B0\u7C98\u8D34\u539F\u6587\u3002");
      return;
    }
    const r = Je.text;
    const originalSceneBlocks = JiarenVisibleScriptSegments(Je.rawAgentPayload?.script ?? [], []);
    const a = originalSceneBlocks.length ? originalSceneBlocks : JiarenVisibleScriptSegments(
      Pt(r, [r]).flatMap(
        (item) => item.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
      )
    );
    const o = a.length ? a : [r.trim()];
    const intentLock = JiarenNormalizeIntentLock(Je.intentLock, e);
    lockedSourceRef.current = e;
    Mt("");
    cn(void 0);
    Un([]);
    na([]);
    aa(void 0);
    kt([gt("script", { ...sr(), sourceIdea: e, originalSource: e, sourceText: e, intentLock, script: o, productionBeats: JiarenProductionBeatRecords(Je.rawAgentPayload), rawAgentPayload: Je.rawAgentPayload, modelLabel: "\u667A\u80FD\u7F16\u5267" })]);
    Ht("character");
    Yn(true);
    ke("script", { phase: "ready", message: "\u5267\u672C\u548C\u5BFC\u6F14\u610F\u56FE\u9501\u5DF2\u786E\u8BA4\u3002\u73B0\u5728\u8FDB\u5165\u89D2\u8272\u8D44\u4EA7\u8BBE\u8BA1\u3002" });
    ke("character", {
      phase: "idle",
      message: "\u5267\u672C\u5DF2\u786E\u8BA4\uFF0C\u8BF7\u751F\u6210\u4E0E\u5BFC\u6F14\u610F\u56FE\u9501\u4E00\u81F4\u7684\u89D2\u8272\u5C55\u793A\u56FE\u548C\u591A\u89C6\u89D2\u56FE\u3002"
    });
    m("\u5267\u672C\u5DF2\u786E\u8BA4\u3002\u540E\u7EED\u6BCF\u4E2A\u573A\u666F\u548C\u955C\u5934\u90FD\u5C06\u7ED1\u5B9A\u8FD9\u4EFD\u539F\u59CB\u521B\u610F\uFF0C\u4E0D\u518D\u91CD\u65B0\u731C\u6545\u4E8B\u3002");
  }
  function nr() {
    cn(void 0), Un([]), na([]), aa(void 0), ke("script", { phase: "idle", message: "\u5267\u672C\u8349\u7A3F\u5DF2\u9000\u56DE\uFF0C\u8BF7\u4FEE\u6539\u8F93\u5165\u540E\u91CD\u65B0\u751F\u6210\u3002" }), m("\u5DF2\u9000\u56DE\u5267\u672C\u8349\u7A3F\u3002\u4FEE\u6539\u63D0\u793A\u8BCD\u540E\u91CD\u65B0\u53D1\u9001\u5373\u53EF\u3002");
  }
  function Ha() {
    lockedSourceRef.current = "", Yn(false), Ht("setup"), kt([]), Zn(mi()), ft(false), qe(false), et(void 0), Vi(""), Mt(""), cn(void 0), xo(void 0), $n(false), Nn({ x: 0, y: 0, zoom: 1 }), Un([]), na([]), aa(void 0), Be.current = null, w.current = null;
  }
  function Uo(e) {
    if (!Ye) return;
    e.preventDefault();
    const r = e.deltaY > 0 ? -0.08 : 0.08, a = te.current == null ? void 0 : te.current.getBoundingClientRect(), o = a ? e.clientX - a.left : 0, s = a ? e.clientY - a.top : 0;
    Nn((d) => {
      const l = d.zoom || 1, p = Math.min(1.8, Math.max(0.32, Number((l + r).toFixed(2))));
      return !a || p === l ? { ...d, zoom: p } : { x: o - (o - d.x) / l * p, y: s - (s - d.y) / l * p, zoom: p };
    });
  }
  function Bo(e) {
    const r = e.button === 1;
    !Ye || !r && e.button !== 0 || !r && e.target.closest("button, textarea, input, video, audio, a, .jiaren-page1-module-wrap") || (e.preventDefault(), Be.current = { pointerId: e.pointerId, originX: e.clientX, originY: e.clientY, startX: It.x, startY: It.y }, e.currentTarget.setPointerCapture(e.pointerId));
  }
  function Mo(e) {
    const r = Be.current;
    !r || r.pointerId !== e.pointerId || Nn((a) => ({ ...a, x: r.startX + e.clientX - r.originX, y: r.startY + e.clientY - r.originY }));
  }
  function ar(e) {
    const r = Be.current;
    r && r.pointerId === e.pointerId && (Be.current = null, e.currentTarget.releasePointerCapture(e.pointerId));
  }
  function Eo(e, r) {
    var s, d;
    if (!Ye || e.button !== 0 || e.target.closest("button, textarea, input, video, audio, a, .jiaren-page1-character-portrait, .jiaren-page1-scene-media, .jiaren-page1-shot-preview, .jiaren-page1-image-preview, .jiaren-page1-character-regenerate")) return;
    e.stopPropagation();
    const o = Oe.find((l) => l.id === r);
    w.current = { pointerId: e.pointerId, nodeId: r, originX: e.clientX, originY: e.clientY, startX: ((s = o == null ? void 0 : o.position) == null ? void 0 : s.x) ?? 0, startY: ((d = o == null ? void 0 : o.position) == null ? void 0 : d.y) ?? 0 }, e.currentTarget.setPointerCapture(e.pointerId), e.preventDefault();
  }
  function Do(e) {
    const r = w.current;
    if (!r || r.pointerId !== e.pointerId) return;
    e.stopPropagation();
    const a = It.zoom || 1, o = r.startX + (e.clientX - r.originX) / a, s = r.startY + (e.clientY - r.originY) / a;
    kt((d) => d.map((l) => l.id === r.nodeId ? { ...l, position: { x: Math.round(o), y: Math.round(s) } } : l));
  }
  function ir(e) {
    const r = w.current;
    if (!(!r || r.pointerId !== e.pointerId)) {
      e.stopPropagation(), w.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
      }
    }
  }
  function Wt(e) {
    var o, s;
    const r = ((o = e.position) == null ? void 0 : o.x) ?? 0, a = ((s = e.position) == null ? void 0 : s.y) ?? 0;
    return { style: { "--page1-node-x": `${r}px`, "--page1-node-y": `${a}px` }, onPointerDown: (d) => Eo(d, e.id), onPointerMove: Do, onPointerUp: ir, onPointerCancel: ir };
  }
  function Wa(e) {
    return Math.max(0, ut.findIndex((r) => r.id === e));
  }
  function qa(e) {
    const r = On.indexOf(e);
    return r >= 0 ? r : 0;
  }
  function rr(e) {
    return On[qa(e) + 1];
  }
  function or() {
    return On.map((e) => ut.find((r) => r.id === e)).filter((e) => !!e);
  }
  function Ro() {
    const e = or();
    return e.filter((r) => r.id === ce).slice(0, 1).concat(e.some((r) => r.id === ce) ? [] : e.slice(0, 1));
  }
  function la() {
    return Ze.seconds >= 60 ? "\u957F\u89C6\u9891 >=1min\uFF08\u7EA6 60 \u79D2\uFF09" : Ze.seconds >= 30 ? "\u77ED\u89C6\u9891 <1min\uFF08\u7EA6 30 \u79D2\uFF09" : Ze.label.replace("\u7EA6 ", "");
  }
  function sr() {
    const e = JiarenStoredSourceIdea(lockedSourceRef.current, Je) || Xe.trim() || "\u4E00\u4E2A\u9762\u5411\u77ED\u89C6\u9891\u5E73\u53F0\u7684\u52A8\u753B\u9879\u76EE";
    const r = sn.trim() || Rt || "\u70ED\u8840";
    return {
      studioConfig: O.runtimeParams,
      styleLock: oa,
      sourceIdea: e,
      originalSource: e,
      sourceText: e,
      intentLock: JiarenNormalizeIntentLock(null, e),
      brief: `\u5F71\u7247\u57FA\u8C03\uFF1A${r} / \u65F6\u957F\uFF1A${la()} / \u6BD4\u4F8B\uFF1A${Et} / \u8BED\u8A00\uFF1A${Dt}\u3002\u827A\u672F\u603B\u76D1\u6B63\u5728\u628A\u300C${e.slice(0, 68)}\u300D\u62C6\u6210\u53EF\u751F\u4EA7\u7684\u52A8\u753B\u77ED\u7247\u8DEF\u7EBF\u3002`,
      script: [],
      character: {
        name: "\u4E3B\u89D2",
        description: "\u7B49\u5F85\u89D2\u8272\u8BBE\u8BA1\u5E08\u6839\u636E\u5267\u672C\u751F\u6210\u89D2\u8272\u8D44\u4EA7\u3002",
        appearance: ""
      },
      propAssets: [],
      scenes: [],
      shots: [],
      audio: { music: "", sfx: "" }
    };
  }
  function Ya() {
    return Oe.reduce((e, r) => {
      const a = r.payload || {};
      return {
        ...e,
        studioConfig: a.studioConfig ?? e.studioConfig,
        styleLock: a.styleLock ?? e.styleLock,
        sourceIdea: JiarenStoredSourceIdea(a.sourceIdea, a.originalSource, a.sourceText, e.sourceIdea) || e.sourceIdea,
        originalSource: JiarenStoredSourceIdea(a.originalSource, a.sourceIdea, a.sourceText, e.originalSource) || e.originalSource,
        sourceText: JiarenStoredSourceIdea(a.sourceText, a.sourceIdea, a.originalSource, e.sourceText) || e.sourceText,
        intentLock: a.intentLock ? JiarenNormalizeIntentLock(a.intentLock, e.intentLock?.original) : e.intentLock,
        brief: a.brief || e.brief,
        script: Array.isArray(a.script) && a.script.length ? JiarenVisibleScriptSegments(a.script, e.script) : e.script,
        productionBeats: Array.isArray(a.productionBeats) && a.productionBeats.length ? a.productionBeats : e.productionBeats,
        rawAgentPayload: a.rawAgentPayload ?? e.rawAgentPayload,
        character: a.character && (a.character.appearance || a.character.imageUrl) ? { ...e.character, ...a.character } : e.character,
        characters: Array.isArray(a.characters) && a.characters.length ? a.characters : e.characters,
        propAssets: Array.isArray(a.propAssets) && a.propAssets.length ? a.propAssets : e.propAssets,
        scenes: Array.isArray(a.scenes) && a.scenes.length ? a.scenes : e.scenes,
        shots: Array.isArray(a.shots) && a.shots.length ? a.shots : e.shots,
        audio: a.audio && (a.audio.music || a.audio.sfx || a.audio.audioUrl) ? { ...e.audio, ...a.audio } : e.audio,
        final: a.final ?? e.final
      };
    }, sr());
  }
  function cr(e) {
    var r;
    Ao(e), ea(((r = ui(e)) == null ? void 0 : r.id) || "");
  }
  function gt(e, r) {
    const a = ut.find((o) => o.id === e) ?? ut[0];
    return { id: `${e}-${crypto.randomUUID().slice(0, 8)}`, step: e, title: a.nodeTitle, agent: a.agent, payload: r, position: { x: 0, y: 0 } };
  }
  function JiarenStoredSourceIdea(...e) {
    const r = (a) => {
      if (!a) return "";
      if (typeof a == "string") return a.trim();
      if (typeof a != "object") return "";
      const o = a;
      for (const s of ["sourceIdea", "sourceText", "originalSource", "originalText", "original_request", "originalRequest", "source"]) {
        const d = r(o[s]);
        if (d) return d;
      }
      return r(o.intentLock) || r(o.intent_lock) || r(o.rawAgentPayload) || r(o.payload);
    };
    for (const a of e) {
      const o = r(a);
      if (o) return o;
    }
    return "";
  }
  function JiarenRevisionOnlyText(e, r) {
    const a = String(e || "").trim(),
      o = String(r || "").trim();
    if (!a || a === o) return "";
    if (a.length > 500 && JiarenIsLiterarySource(a)) return "";
    return a;
  }
  function Za(e, r) {
    kt((a) => {
      const o = a.find((d) => d.step === e), s = o ? { ...o, payload: r } : gt(e, r);
      return [...a.filter((d) => d.step !== e), s];
    });
  }
  function ke(e, r) {
    Zn((a) => ({ ...a, [e]: r }));
  }
  function To(e, r) {
    return { id: e.id || crypto.randomUUID(), name: e.name || r, source: e.dataUrl || e.source, dataUrl: e.dataUrl, localPath: e.localPath, mimeType: e.mimeType };
  }
  function JiarenExtractStructuredField(e, r) {
    const a = String(e || "").replace(/```(?:json)?/gi, "").replace(/```/g, ""), o = r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), s = new RegExp(`(?:^|[,\\{\\s])['\"]?${o}['\"]?\\s*:\\s*`, "i").exec(a);
    if (!s) return;
    let d = (s.index || 0) + s[0].length;
    for (; /\s/.test(a[d] || ""); ) d += 1;
    const l = a[d];
    if (!l) return;
    if (l === '"') {
      let p = false;
      for (let h = d + 1; h < a.length; h += 1) {
        const g = a[h];
        if (p) {
          p = false;
          continue;
        }
        if (g === "\\") {
          p = true;
          continue;
        }
        if (g === '"') {
          const y = a.slice(d, h + 1);
          try {
            return JSON.parse(y);
          } catch {
            return y.slice(1, -1).replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\\"/g, '"');
          }
        }
      }
      return;
    }
    if (l === "[" || l === "{") {
      const p = [l], h = { "[": "]", "{": "}" };
      let g = false, y = "", j = false;
      for (let I = d + 1; I < a.length; I += 1) {
        const x = a[I];
        if (g) {
          if (j) j = false;
          else if (x === "\\") j = true;
          else if (x === y) g = false;
          continue;
        }
        if (x === '"' || x === "'") {
          g = true, y = x;
          continue;
        }
        if (x === "[" || x === "{") p.push(x);
        else if (x === "]" || x === "}") {
          if (h[p[p.length - 1]] !== x) return;
          if (p.pop(), p.length === 0) {
            const M = a.slice(d, I + 1), U = M.replace(/,\s*([\]}])/g, "$1");
            try {
              return JSON.parse(M);
            } catch {
              try {
                return JSON.parse(U);
              } catch {
                return;
              }
            }
          }
        }
      }
      return;
    }
    const p = a.slice(d).match(/^[^,}\n\r]+/);
    if (!p) return;
    const h = p[0].trim();
    if (/^(?:true|false|null|-?\d+(?:\.\d+)?)$/i.test(h)) try {
      return JSON.parse(h);
    } catch {
    }
    return h.replace(/^['\"]|['\"]$/g, "").trim();
  }
  function JiarenExtractPartialObjectArray(e, r) {
    const a = String(e || "").replace(/```(?:json)?/gi, "").replace(/```/g, ""), o = r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), s = new RegExp(`['\"]?${o}['\"]?\\s*:\\s*\\[`, "i").exec(a);
    if (!s) return [];
    const d = [], l = (s.index || 0) + s[0].length;
    let p = -1, h = 0, g = false, y = false;
    for (let j = l; j < a.length; j += 1) {
      const I = a[j];
      if (g) {
        if (y) y = false;
        else if (I === "\\") y = true;
        else if (I === '"') g = false;
        continue;
      }
      if (I === '"') {
        g = true;
        continue;
      }
      if (I === "{") {
        if (h === 0) p = j;
        h += 1;
      } else if (I === "}" && h > 0) {
        h -= 1;
        if (h === 0 && p >= 0) {
          const x = a.slice(p, j + 1).replace(/,\s*([\]}])/g, "$1");
          try {
            const M = JSON.parse(x);
            M && typeof M == "object" && d.push(M);
          } catch {
          }
          p = -1;
        }
      } else if (I === "]" && h === 0) break;
    }
    return d;
  }
  function JiarenLooksLikeTechnicalPayload(e) {
    const r = String(e || "").trim();
    if (!r) return false;
    const a = /(?:^|[,\{])\s*['\"]?(?:intent_lock|intentLock|original_request|protagonists|locations|recurring_assets|required_actions|visual_style|forbidden_contradictions|production_beats|productionBeats|source_event_coverage|event_coverage|quality_check|script_continuity|script_unused_hint|scene_seed|metadata|__continue)['\"]?\s*:/i;
    return a.test(r) || /^['\"]?(?:intent_lock|production_beats|source_event_coverage|quality_check|metadata|__continue)['\"]?\s*[:：]/i.test(r);
  }
  function un(e) {
    var s, d, l;
    const r = String(e || "").trim(), a = ((d = (s = r.match(/```(?:json)?\s*([\s\S]*?)```/i)) == null ? void 0 : s[1]) == null ? void 0 : d.trim()), o = ((l = r.match(/\{[\s\S]*\}/)) == null ? void 0 : l[0]), p = [a, o, r].filter(Boolean);
    for (const h of p) try {
      const g = JSON.parse(h);
      if (Array.isArray(g)) return { items: g };
      if (g && typeof g == "object") return g;
    } catch {
    }
    const h = {}, g = ["intent_lock", "intentLock", "script", "screenplay", "paragraphs", "scenes", "beats", "story_beats", "storyBeats", "content", "text", "production_beats", "productionBeats", "source_event_coverage", "event_coverage", "characters", "scene_seed", "scenePlan", "scene_plan", "shots", "storyboard", "quality_check"];
    for (const y of g) {
      let j = JiarenExtractStructuredField(r, y);
      j === void 0 && /^(?:production_beats|productionBeats|source_event_coverage|event_coverage|characters|shots)$/.test(y) && (j = JiarenExtractPartialObjectArray(r, y));
      j !== void 0 && (h[y] = j);
    }
    return h;
  }
  function tt(e, r, a = "") {
    for (const o of r) {
      const s = e[o];
      if (typeof s == "string" && s.trim()) return s.trim();
    }
    return a;
  }
  function Pt(e, r = []) {
    if (Array.isArray(e)) return e.map((a) => {
      if (typeof a == "string") return a.trim();
      if (a && typeof a == "object") {
        const o = a, s = tt(o, ["text", "content", "description", "paragraph", "action", "visual", "scene", "beat", "summary", "voiceover", "dialogue", "shot", "camera", "motion"], "");
        return s || Pt(o, []).join(" ");
      }
      return "";
    }).filter(Boolean);
    if (typeof e == "string" && e.trim()) return e.split(new RegExp("\\n{2,}|(?<=\u3002)")).map((a) => a.trim()).filter(Boolean);
    if (e && typeof e == "object") {
      const a = e, o = tt(a, ["text", "content", "description", "paragraph", "action", "visual", "scene", "beat", "summary", "voiceover", "dialogue", "story", "plot", "outline"], "");
      if (o) return Pt(o, r);
      const s = ["script", "paragraphs", "scenes", "shots", "beats", "story_beats", "storyBeats", "items", "segments", "acts", "outline", "chapters"];
      for (const d of s) {
        const l = Pt(a[d], []);
        if (l.length > 0) return l;
      }
    }
    return r;
  }
  function lr(e) {
    return e.replace(/\\r\\n/g, `
`).replace(/\\n/g, `
`).replace(/\\t/g, " ").replace(/\\"/g, '"');
  }
  function ct(e) {
    let r = lr(e).replace(/```(?:json)?/gi, "").replace(/```/g, "").replace(/^\s*[\[{]\s*/g, "").replace(/\s*[\]}]\s*$/g, "").trim();
    return r = r.replace(/^\s*,?\s*"(?:script|content|text|story|plot|paragraph)"\s*:\s*/i, "").replace(/^\s*,?\s*(?:script|content|text|story|plot|paragraph)\s*:\s*/i, "").replace(/^\s*"\s*/, "").replace(/\s*"\s*,?\s*$/g, "").replace(/",\s*"(?:script_continuity|script_unused_hint|quality_check|characters|scene_seed|metadata|__continue)"[\s\S]*$/i, "").replace(/,\s*"(?:script_continuity|script_unused_hint|quality_check|characters|scene_seed|metadata|__continue)"[\s\S]*$/i, "").replace(/^\s*"+\s*,?\s*/g, "").replace(/\s*,?\s*"+\s*$/g, "").replace(/\\+"/g, '"').replace(/\n{3,}/g, `

`).trim(), r;
  }
  function Tt(e) {
    return e.flatMap((r) => lr(String(r || "")).split(/\n{2,}/)).filter((r) => !JiarenLooksLikeTechnicalPayload(r)).map(ct).filter((r) => !(!r || JiarenLooksLikeTechnicalPayload(r) || /^"?\s*(?:script|script_continuity|script_unused_hint|quality_check|characters|scene_seed|metadata|__continue)"?\s*[:：]/i.test(r) || /^["\]}{,\s]+$/.test(r)));
  }
  function JiarenVisibleScriptSegments(e, r = []) {
    const sourceItems = Array.isArray(e) ? e : [e], extracted = sourceItems.flatMap((item) => {
      if (typeof item == "string" && JiarenLooksLikeTechnicalPayload(item)) {
        const parsed = un(item), structured = parsed.script ?? parsed.screenplay ?? parsed.paragraphs ?? parsed.content ?? parsed.text;
        return structured !== void 0 ? Pt(structured, []) : [];
      }
      return Pt(item, []);
    }), a = Tt(extracted.length ? extracted : Pt(e, r));
    return a.filter((o) => !JiarenLooksLikeTechnicalPayload(o));
  }
  function da(e) {
    const r = Tt(e), a = r.map((d, l) => dr(d, l)).filter((d) => !!d);
    if (a.length > 0) return a;
    const o = r.join(`

`);
    if (!o.trim()) return [];
    const s = Array.from(o.matchAll(/(?:^|\n)\s*["'“”]?\s*(?:第\s*)?场景\s*([一二三四五六七八九十\d]+)\s*[:：、-]\s*([^\n"]{0,48})/g));
    return s.length === 0 ? [] : s.map((d, l) => {
      const p = d.index || 0, h = l < s.length - 1 && s[l + 1].index || o.length, g = o.slice(p, h).trim();
      return dr(g, l);
    }).filter((d) => !!d);
  }
  function dr(e, r) {
    const a = ct(e);
    if (!a) return;
    const o = a.match(/^\s*["'“”]?\s*(?:第\s*)?场景\s*[一二三四五六七八九十\d]+\s*[:：、-]\s*([^\n"]{2,48})/) || a.match(/^\s*["'“”]?\s*【\s*场景\s*[:：]?\s*([^】\n]{2,48})】/);
    if (!o) return;
    const s = ct(o[1] || `\u573A\u666F ${r + 1}`), [d, l] = s.split(/[·・•|｜]/).map((j) => j.trim()), p = Vt(a, s), h = d || p.location || s, g = l || p.time || "", y = g ? `${h}\xB7${g}` : s || h || `\u573A\u666F ${r + 1}`;
    return { title: $(y, 34), body: a, location: $(h, 32), time: $(g, 18) };
  }
  function pr(e, r, a) {
    const o = [e.script, e.screenplay, e.paragraphs, e.scenes, e.beats, e.story_beats, e.storyBeats, e.outline, e.story, e.plot, e.content, e.text, e.summary];
    for (const h of o) {
      const g = Array.isArray(h) ? h.flatMap((item) => {
        if (typeof item !== "string") return Tt(Pt(item, []));
        const text = ct(lr(item));
        return text && !JiarenLooksLikeTechnicalPayload(text) ? [text] : [];
      }) : Tt(Pt(h, []));
      if (g.length > 0) return g;
    }
    const s = r.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim(), d = un(s);
    if (Object.keys(d).length > 0) {
      const h = Tt(Pt(d.script ?? d.screenplay ?? d.content ?? d.text, []));
      if (h.length > 0) return h;
    }
    for (const h of ["script", "screenplay", "paragraphs", "story", "plot", "content", "text"]) {
      const g = JiarenExtractStructuredField(s, h), y = Tt(Pt(g, []));
      if (y.length > 0) return y;
    }
    const l = JiarenLooksLikeTechnicalPayload(s) ? [] : Tt(Pt(s, []));
    if (l.length > 0) return l;
    const p = a.trim();
    return p ? [`\u5F00\u573A\uFF1A${p}`, "\u53D1\u5C55\uFF1A\u4E3B\u89D2\u8FDB\u5165\u6838\u5FC3\u51B2\u7A81\uFF0C\u753B\u9762\u7528\u5F3A\u89C6\u89C9\u52A8\u4F5C\u63A8\u8FDB\u3002", "\u7ED3\u5C3E\uFF1A\u7559\u4E0B\u660E\u786E\u7684\u60C5\u7EEA\u56DE\u6536\u4E0E\u4E0B\u4E00\u6B65\u89D2\u8272\u8BBE\u8BA1\u7EBF\u7D22\u3002"] : [];
  }
  function ur(e, r) {
    const extracted = JiarenExtractAgentArray(e, r);
    if (extracted.length) return extracted;
    for (const a of r) {
      const o = e[a];
      if (Array.isArray(o) && o.length > 0) return o.filter((s) => s != null).map((s) => typeof s == "string" || s && typeof s == "object" ? s : String(s));
      if (typeof o == "string" && o.trim()) {
        const s = Pt(o, []);
        if (s.length > 0) return s;
      }
      if (o && typeof o == "object") {
        const s = Pt(o, []);
        if (s.length > 0) return s;
      }
    }
    return [];
  }
  function En() {
    const e = O.runtimeParams.durationSeconds || Ze.seconds;
    return In === "single" ? 1 : e >= 60 ? 5 : e >= 30 ? 3 : 2;
  }
  function mr(e, r) {
    const a = ct(e);
    if (!a) return [];
    const o = Math.max(1, r), s = Math.max(180, Math.ceil(a.length / o)), d = [];
    for (let l = 0; l < a.length; l += s) d.push(a.slice(l, l + s).trim());
    return d.filter(Boolean);
  }
  function Xa(e) {
    const r = Tt(e).join(`

`);
    if (!r.trim()) return [];
    const a = da(e);
    if (a.length > 0) return a.map((l) => l.body);
    const o = [], s = /(?:^|\n)\s*(?=(?:第\s*)?(?:场景|Scene)\s*[一二三四五六七八九十\d]+[\s:：、-]|【\s*场景\s*[:：]?[^】]{0,40}】)/gi, d = r.split(s).map((l) => l.trim()).filter(Boolean);
    if (d.length > 1) o.push(...d);
    else {
      const l = Tt(e), p = En();
      if (l.length >= p) o.push(...l);
      else if (r.length > 900 || (O.runtimeParams.durationSeconds || Ze.seconds) >= 60) {
        const h = r.split(/\n+/).map((M) => M.trim()).filter(Boolean), g = Math.ceil((O.runtimeParams.durationSeconds || Ze.seconds) / Math.max(8, Lt())), y = Math.min(Math.max(Jt, g, p), Math.max(p, h.length || g)), j = h.length >= y ? h : r.split(new RegExp("(?<=[\u3002\uFF01\uFF1F\uFF1B.!?;])\\s*")).map((M) => M.trim()).filter(Boolean), I = j.length >= y ? j : mr(r, y), x = Math.max(1, Math.ceil(I.length / y));
        for (let M = 0; M < I.length; M += x) o.push(I.slice(M, M + x).join(`
`));
      } else o.push(r);
    }
    return o.map(ct).filter(Boolean).slice(0, In === "single" ? 1 : Math.max(Jt, En()));
  }
  function gr(e, r) {
    const a = ct(e), o = a.match(/(?:第\s*)?(场景\s*[一二三四五六七八九十\d]+)[\s:：、-]*([^\n。；]{0,28})/i) || a.match(/【\s*场景\s*[:：]?\s*([^】\n]{2,36})】/) || a.match(/(?:地点|位置|场所)\s*[:：]\s*([^\n，。；]{2,32})/), s = ct((o == null ? void 0 : o[2]) || (o == null ? void 0 : o[1]) || "");
    return s ? s.length > 34 ? `${s.slice(0, 34)}\u2026` : s : Vt(a, `\u573A\u666F ${r + 1}`).location || `\u573A\u666F ${r + 1}`;
  }
  function Lo(e, r = Jt) {
    if (In === "single") return 1;
    const a = da(e).length;
    if (a > 0) return a;
    const o = Xa(e).length, s = Math.ceil((O.runtimeParams.durationSeconds || Ze.seconds) / Math.max(8, Lt())), d = Math.max(En(), s, o || e.length || 1);
    return Math.max(1, Math.min(Math.max(r, d), d));
  }
  function Oo(e, r, a) {
    const o = da(e), s = o.length ? o.map((h) => h.body) : Xa(e), d = s.length ? s : [a || "\u6838\u5FC3\u53D9\u4E8B\u7A7A\u95F4"], l = Lo(e), p = d.slice(0, l).map((h, g) => {
      const y = ct(h), j = o[g], I = j ? { location: j.location, time: j.time } : Vt(y, `\u573A\u666F ${g + 1}`), x = (j == null ? void 0 : j.title) || gr(y, g), M = [`\u6839\u636E\u5267\u672C\u7B2C ${g + 1} \u4E2A\u573A\u6B21\u6574\u7406\u4E3A\u53EF\u62CD\u6444\u573A\u666F\uFF1A${x}\u3002`, `\u5730\u70B9/\u65F6\u95F4\u5FC5\u987B\u9501\u5B9A\u539F\u5267\u672C\uFF1A${I.location} / ${I.time || "\u6309\u539F\u6587"}\u3002\u8FD9\u91CC\u53EA\u642D\u5EFA\u7A7A\u73AF\u5883\u57FA\u5E95\uFF0C\u753B\u9762\u7981\u6B62\u51FA\u73B0\u4EBA\u7269\u3001\u80CC\u5F71\u3001\u526A\u5F71\u3001\u8EAB\u4F53\u90E8\u4F4D\u6216\u4EBA\u7FA4\u3002`, "\u89D2\u8272\u5C06\u5728\u5206\u955C\u9636\u6BB5\u518D\u4E0E\u6B64\u7A7A\u73AF\u5883\u5408\u6210\uFF1B\u573A\u666F\u9636\u6BB5\u53EA\u4FDD\u7559\u53EF\u590D\u7528\u5E03\u666F\u3001\u9053\u5177\u3001\u5730\u8C8C\u3001\u5149\u5F71\u548C\u7A7A\u955C\u6784\u56FE\u3002", `\u5267\u672C\u4F9D\u636E\uFF1A${$(y || a, 520)}`].join("");
      return { title: x, description: M, beatRefs: [`\u573A\u666F ${g + 1}`, x], subject: "\u7A7A\u73AF\u5883", subjectMotion: "\u65E0\u4EBA\u7269\u52A8\u4F5C\uFF1B\u4EBA\u7269\u53EA\u5728\u5206\u955C\u9636\u6BB5\u52A0\u5165\u3002", environment: `${I.location} / ${I.time || "\u539F\u5267\u672C\u65F6\u6BB5"} / ${O.runtimeParams.vibe_tag}`, setDressing: `\u53EA\u63D0\u53D6\u8BE5\u573A\u539F\u6587\u4E2D\u7684\u5E03\u666F\u3001\u9053\u5177\u548C\u7A7A\u95F4\u5173\u7CFB\uFF1A${$(y, 180)}`, lighting: `${I.time || "\u539F\u5267\u672C\u65F6\u6BB5"}\u7684\u5149\u7EBF\u5FC5\u987B\u6765\u81EA\u539F\u5267\u672C\uFF1B\u4E0D\u5F97\u6539\u6210\u96E8\u540E\u3001\u9EC4\u660F\u3001\u6EAA\u8FB9\u3001\u4E3B\u5E72\u9053\u7B49\u65B0\u8BBE\u5B9A\u3002`, terrain: `\u6309\u300C${I.location}\u300D\u751F\u6210\u5730\u9762\u6750\u8D28\u3001\u7A7A\u95F4\u7EB5\u6DF1\u548C\u53EF\u884C\u8D70\u533A\u57DF\uFF0C\u4E0D\u65B0\u589E\u5176\u4ED6\u5730\u70B9\u3002`, spatialFraming: "empty establishing shot locked to the exact script location, readable foreground/midground/background set dressing, clear spatial layout for later character placement", camera: "cinematic empty plate camera locked to the script scene, lens and angle prepared for later storyboard compositing", transitionOut: g < d.length - 1 ? "match cut to next script scene" : "hold for final beat", prompt: ["cinematic empty environment concept art", I.location, I.time || "script time of day", O.runtimeParams.vibe_tag, $(y || a, 360), "strictly the same location and time from the script, no alternate location, no different time of day, clear spatial layout, foreground midground background, production design, empty background plate, no people, no humans, no characters, no silhouettes, no body parts, no watermark, no random text"].join(", ") };
    });
    return gi(p, a);
  }
  function _o(e, r, a) {
    const o = da(e), s = o.length ? o : Xa(e).map((p, h) => {
      const g = Vt(p, `\u573A\u666F ${h + 1}`);
      return { title: gr(p, h), body: p, location: g.location, time: g.time };
    }), d = s.length ? s : [{ title: "\u6838\u5FC3\u573A\u666F", body: a, location: a, time: "\u539F\u5267\u672C\u65F6\u6BB5" }], l = d.map((p, h) => {
      const g = ct(p.body || ""), y = $(p.location || Vt(g, p.title).location || p.title || `\u573A\u666F ${h + 1}`, 32), j = $(p.time || Vt(g, p.title).time || "\u539F\u5267\u672C\u65F6\u6BB5", 18), I = $(p.title || (j ? `${y}\xB7${j}` : y), 34);
      return { title: I, description: [`Toonflow\u5F0F\u5267\u672C\u8D44\u4EA7\u9501\u5B9A\uFF1A\u8BE5\u573A\u666F\u53EA\u6765\u81EA\u5267\u672C\u7B2C ${h + 1} \u4E2A\u660E\u786E\u573A\u6B21\u300C${I}\u300D\u3002`, `\u5730\u70B9/\u65F6\u6BB5\u5FC5\u987B\u4FDD\u6301\uFF1A${y} / ${j}\u3002`, "\u573A\u666F\u8BBE\u8BA1\u5E08\u53EA\u4EA7\u51FA\u7EAF\u7A7A\u73AF\u5883\u8D44\u4EA7\uFF1A\u7A7A\u95F4\u7ED3\u6784\u3001\u5730\u5F62\u6750\u8D28\u3001\u5E03\u666F\u9053\u5177\u3001\u81EA\u7136\u5149\u5F71\u3001\u7A7A\u955C\u6784\u56FE\uFF1B\u7981\u6B62\u51FA\u73B0\u4EBA\u7269\u3001\u89D2\u8272\u3001\u52A8\u4F5C\u3001\u4EBA\u7FA4\u3001\u80CC\u5F71\u3001\u526A\u5F71\u3002", `\u5267\u672C\u539F\u6587\u4F9D\u636E\uFF1A${$(g || a, 560)}`].join(""), beatRefs: [`\u573A\u666F ${h + 1}`, I, y, j].filter(Boolean), sequenceIndex: h, sourceSceneIndex: h, sourceSceneTitle: I, scriptSceneBody: g, sourceLocation: y, sourceTime: j, subject: "\u7A7A\u73AF\u5883", subjectMotion: "\u65E0\u4EBA\u7269\u52A8\u4F5C\uFF1B\u4EBA\u7269\u53EA\u5728\u5206\u955C\u9636\u6BB5\u52A0\u5165\u3002", environment: `${y} / ${j} / ${O.runtimeParams.vibe_tag}`, setDressing: `\u4EC5\u63D0\u53D6\u5267\u672C\u8BE5\u573A\u539F\u6587\u4E2D\u7684\u73AF\u5883\u5E03\u666F\u3001\u9053\u5177\u3001\u7A7A\u95F4\u5173\u7CFB\u548C\u58F0\u97F3\u6765\u6E90\uFF1A${$(g, 220)}`, lighting: `${j}\u7684\u5149\u7EBF\u548C\u6C1B\u56F4\u5FC5\u987B\u6765\u81EA\u5267\u672C\u539F\u6587\uFF1B\u4E0D\u5F97\u6539\u5199\u4E3A\u9EC4\u660F\u3001\u96E8\u540E\u3001\u6EAA\u8FB9\u3001\u57CE\u5E02\u4E3B\u5E72\u9053\u7B49\u672A\u51FA\u73B0\u65F6\u7A7A\u3002`, terrain: `\u9501\u5B9A\u300C${y}\u300D\u7684\u5730\u9762\u6750\u8D28\u3001\u7A7A\u95F4\u7EB5\u6DF1\u3001\u524D\u4E2D\u540E\u666F\u7ED3\u6784\u548C\u53EF\u62CD\u6444\u52A8\u7EBF\uFF0C\u4E0D\u65B0\u589E\u7B2C\u4E8C\u5730\u70B9\u3002`, spatialFraming: `\u7A7A\u955C\u6784\u56FE\u5FC5\u987B\u670D\u52A1\u540E\u7EED\u5206\u955C\u89D2\u8272\u5165\u753B\uFF1A\u5148\u7ED9\u51FA${y}\u7684\u53EF\u8BFB\u7A7A\u95F4\u5E03\u5C40\uFF0C\u518D\u4FDD\u7559\u89D2\u8272\u7AD9\u4F4D\u4E0E\u8FD0\u52A8\u901A\u9053\u3002`, camera: "empty environment plate, objective establishing camera, no characters, prepared for storyboard compositing", transitionOut: h < d.length - 1 ? `\u4ECE\u300C${I}\u300D\u7684\u7A7A\u95F4\u51FA\u53E3\u81EA\u7136\u526A\u63A5\u5230\u4E0B\u4E00\u5267\u672C\u573A\u6B21` : "\u672C\u573A\u7A7A\u73AF\u5883\u5C3E\u5E27\u4FDD\u6301\u7EDF\u4E00\u5149\u5F71\u4E0E\u6784\u56FE\uFF0C\u4F9B\u6700\u7EC8\u955C\u5934\u6536\u675F", prompt: ["cinematic empty environment concept art", y, j, O.runtimeParams.vibe_tag, $(g || a, 360), "script-derived background plate, exact script location and time, no alternate location, no different time of day, no extra scene variant, no people, no humans, no characters, no silhouettes, no body parts, no crowd, no dialogue text, no subtitles, no watermark"].join(", ") };
    });
    return gi(l, a);
  }
  function Fo(e, r) {
    if (In === "single") return 1;
    const a = O.runtimeParams.durationSeconds || Ze.seconds;
    if (lt()) {
      const h = Qo(a);
      return Math.max(1, Math.min(12, Math.max(En(), h)));
    }
    const o = Math.max(8, Math.min(Lt(), a >= 60 ? 12 : a >= 30 ? 10 : 8)), s = Math.ceil(a / o), d = a >= 60 ? 6 : a >= 30 ? 4 : Math.max(2, Math.ceil(a / o)), l = Math.max(En(), d, s, e > 0 ? e : r > 0 ? r : 1, Math.min(Jt, s)), p = a >= 90 ? 12 : a >= 60 ? 8 : a >= 30 ? 6 : 4;
    return Math.max(1, Math.min(p, l));
  }
  function Lt() {
    const e = Qe(jt);
    return lt() ? 15 : /pixverse|pix[-_\s]?verse|\bv(?:2|3(?:\.5)?|4)\b/i.test(e) ? 15 : /sora[-_\s]?2/i.test(e) ? 12 : /veo3\.1|veo31|veo/i.test(e) ? 8 : /hailuo|minimax|kling|wan|vidu/i.test(e) ? 10 : 12;
  }
  function lt(e = jt) {
    const r = `${Qe(e)} ${mt(e)}`;
    return /doubao[-_\s]?seedance|seedance/i.test(r);
  }
  function Dn(e, r = jt) {
    const a = Number.isFinite(e) && e > 0 ? e : 5;
    return lt(r) ? Math.max(4, Math.min(15, Math.round(a))) : Math.max(1, Math.min(Lt(), Math.round(a)));
  }
  function Qo(e) {
    return Math.max(1, Math.ceil(Math.max(1, e) / 15));
  }
  function hr(e) {
    const [r = "0", a = "0"] = e.split(":");
    return Number(r) * 60 + Number(a);
  }
  function dt(e) {
    const r = Math.max(0, e), a = Math.floor(r / 60), o = r - a * 60;
    return `${String(a).padStart(2, "0")}:${o.toFixed(1).padStart(4, "0")}`;
  }
  function pa(e) {
    const r = e.match(/(\d{1,2}:\d{2}(?:\.\d+)?)\s*[-–]\s*(\d{1,2}:\d{2}(?:\.\d+)?)/);
    if (!r) return { start: 0, end: 6, duration: 6 };
    const a = hr(r[1]), o = Math.max(a + 1, hr(r[2]));
    return { start: a, end: o, duration: o - a };
  }
  function Ko(e, r) {
    const a = O.runtimeParams.durationSeconds || Ze.seconds || r * 4;
    if (lt()) {
      const o = Math.max(4, Math.min(15, Math.round(a / Math.max(1, r)))), h = e * o, g = h + o;
      return `${dt(h)}-${dt(g)}`;
    }
    const o = a >= 60 ? 4 : 3, s = Math.max(r * o, a), d = s * e / Math.max(1, r), l = s * (e + 1) / Math.max(1, r);
    return `${dt(d)}-${dt(l)}`;
  }
  function JiarenBoundScene(e, r) {
    if (!r) return r;
    const a = JiarenSceneVariantForShot(r, e);
    return a ? { ...r, imageUrl: void 0, sceneVariantId: a.variantId || a.id || e.sceneVariantId, sceneVariantTitle: a.title || e.sceneVariantTitle, sceneVariantImageUrl: void 0, camera: a.camera || r.camera, spatialFraming: a.spatialFraming || r.spatialFraming, variantBeatSummary: a.beatSummary || "" } : { ...r, imageUrl: void 0, sceneVariantImageUrl: void 0 };
  }
  function fr(e, r, a) {
    if (a.length === 0) return;
    const o = fi(a);
    if (e.sceneId || e.sceneRef) {
      const d = o.find((l) => (l.id || l.sceneId) === (e.sceneId || e.sceneRef));
      if (d) return JiarenBoundScene(e, d);
    }
    if (e.sceneTitle) {
      const d = o.find((l) => l.title === e.sceneTitle);
      if (d) return JiarenBoundScene(e, d);
    }
    if (e.sceneImageUrl) {
      const d = o.find((l) => l.imageUrl === e.sceneImageUrl);
      if (d) return JiarenBoundScene(e, d);
    }
    const s = `${e.title} ${e.prompt} ${e.videoPrompt || ""}`.toLowerCase();
    return JiarenBoundScene(e, o.find((d) => {
      const l = d.title.toLowerCase(), p = (d.sceneChainKey || "").toLowerCase(), h = (d.environment || "").toLowerCase();
      return l && s.includes(l) || p && s.includes(p.slice(0, 12)) || h && s.includes(h.slice(0, 12));
    }) ?? o[Math.min(r, o.length - 1)]);
  }
  function yr(e, r, a) {
    var l;
    const o = a.join(`

`);
    if (r.scriptSceneBody) return r.scriptSceneBody;
    if (typeof r.sourceSceneIndex == "number" && a[r.sourceSceneIndex]) return a[r.sourceSceneIndex];
    const s = (l = r.beatRefs) == null ? void 0 : l.find(Boolean);
    if (s) {
      const p = a.find((h) => h.includes(s) || s.includes($(h, 24)));
      if (p) return p;
    }
    const d = r.title.trim();
    if (d) {
      const p = a.find((h) => h.includes(d));
      if (p) return p;
    }
    return a[e] || a[Math.min(e, Math.max(0, a.length - 1))] || o || r.description;
  }
  function ei(e) {
    return e.split(new RegExp("(?<=[\u3002\uFF01\uFF1F\uFF1B.!?;])|\\n+")).map((r) => ct(r)).filter((r) => r.length > 0);
  }
  function br(e, r) {
    const a = ct(e);
    if (!a) return [];
    const s = ei(a).filter((p) => !/^场景\s*[一二三四五六七八九十\d]+[:：、-]?$/i.test(p)).filter((p) => p.length > 3).flatMap((p) => {
      const h = /[:：]/.test(p), g = /突然|这时|随即|紧接着|冲|跑|转身|抬头|落下|爆发|撞|躲|追|推|拉|回头|凝视|沉默|停住|响起|切到|镜头|特写|全景|近景|远景|推近|拉远|摇移|跟拍/.test(p);
      return h || g ? [p] : [p];
    }), d = s.length ? s : mr(a, Math.max(1, r));
    if (d.length >= r) return d.slice(0, r);
    const l = [...d];
    for (; l.length < r; ) {
      const p = d[l.length % Math.max(1, d.length)] || a;
      l.push(p);
    }
    return l;
  }
  function Vo(e, r) {
    const a = ei(r || e.description || e.environment || e.title), o = `${r}
${e.description}
${e.environment}
${e.transitionOut || ""}`, s = (o.match(/[:：]/g) || []).length, d = (o.match(/突然|这时|随即|紧接着|冲|跑|转身|抬头|落下|爆发|撞|躲|追|推|拉|回头|凝视|沉默|停住|响起|切到|镜头|特写|全景|近景|远景|推近|拉远|摇移|跟拍/g) || []).length;
    return Math.max(1, a.length + Math.ceil(s / 2) + Math.ceil(d / 2));
  }
  function Go(e, r, a) {
    if (e.length === 0) return [];
    const s = fi(e).map((g, y) => {
      const j = yr(y, g, r);
      return { scene: g, sceneIndex: g.sequenceIndex ?? y, scriptBeat: j, weight: Vo(g, j) };
    }), d = s.reduce((g, y) => g + y.weight, 0) || s.length, l = 1, p = s.map((g) => Math.max(l, Math.floor(g.weight / d * a)));
    let h = p.reduce((g, y) => g + y, 0);
    for (; h < a; ) {
      let g = 0, y = -1 / 0;
      s.forEach((j, I) => {
        const x = j.weight / Math.max(1, p[I]);
        x > y && (y = x, g = I);
      }), p[g] += 1, h += 1;
    }
    for (; h > a; ) {
      let g = -1, y = 1 / 0;
      if (s.forEach((j, I) => {
        if (p[I] <= l) return;
        const x = j.weight / Math.max(1, p[I]);
        x < y && (y = x, g = I);
      }), g < 0) break;
      p[g] -= 1, h -= 1;
    }
    return s.flatMap((g, y) => {
      const j = Math.max(1, p[y]), I = br(g.scriptBeat || g.scene.description, j);
      return Array.from({ length: j }, (x, M) => ({ scene: g.scene, sceneIndex: g.sceneIndex, sceneShotIndex: M, sceneShotTotal: j, scriptBeat: g.scriptBeat, beatFragment: I[M] || g.scriptBeat || g.scene.description || g.scene.title }));
    });
  }
  function zo(e, r, a, o, s) {
    const d = pa(e), l = Math.max(3, Math.min(24, Math.round(d.duration))), p = ei(a || r.description || r.environment || r.title), h = ["\u5EFA\u7ACB\u7A7A\u95F4", "\u89D2\u8272\u5165\u753B", "\u52A8\u4F5C\u63A8\u8FDB", "\u955C\u5934\u8FD0\u52A8", "\u60C5\u7EEA\u53CD\u5E94", "\u7EC6\u8282\u5F3A\u8C03", "\u8F6C\u573A\u627F\u63A5"];
    return Array.from({ length: l }, (g, y) => {
      const j = d.start + d.duration * y / l, I = d.start + d.duration * (y + 1) / l, x = y === 0, M = y === l - 1, U = x ? "\u9996\u5E27\u5EFA\u7ACB" : M ? "\u5C3E\u5E27\u627F\u63A5" : h[(y + o) % h.length], le = p[y % Math.max(1, p.length)] || r.description || r.environment || r.title;
      return `${dt(j)}-${dt(I)}\uFF1A${U}\uFF0C${$(le, 92)}\uFF1B\u9501\u5B9A\u573A\u666F\u300C${r.title}\u300D${s > 1 ? `\uFF0C\u8FD9\u662F\u8BE5\u573A\u666F\u7B2C ${o + 1}/${s} \u4E2A\u8FDE\u7EED\u955C\u5934` : ""}`;
    });
  }
  function Jo(e, r, a, o, s) {
    const d = pa(e), l = Math.max(0.8, d.duration), p = rt === "grid" ? 9 : Math.max(4, Math.min(12, Math.ceil(l / 1.3))), h = br(a || r.description || r.environment || r.title, p);
    return Array.from({ length: p }, (g, y) => {
      const j = d.start + l * y / p, I = d.start + l * (y + 1) / p, x = h[y] || h[h.length - 1] || a;
      return ad(`${dt(j)}-${dt(I)}`, r, x, o + y, s);
    });
  }
  async function Ho(e) {
    const saved = Oe.find((node) => node.step === "storyboard")?.payload?.shots || [];
    if (saved.length > 0 && saved.every((shot) => shot.contractVersion === "t8-director-storyboard-v2") && saved.some((shot) => shot.storyboardImageUrl)) {
      return saved;
    }
    const original = e.intentLock?.original || e.studioConfig?.userIdea || O.runtimeParams.userIdea || Xe.trim();
    const productionBeats = JiarenProductionBeatRecords(e.productionBeats ?? e.rawAgentPayload);
    const scriptSettings = JiarenBuildScriptSettingManifest(productionBeats, e.script);
    const desiredShotCount = Math.max(Fo(scriptSettings.length, e.script.length), JiarenNovelShotMinimum(original, scriptSettings.length, e.script.length, O.runtimeParams), Math.min(24, productionBeats.length));
    const storyboardPanelCount = /(?:2\s*[x×]\s*2|4\s*格|四格)/i.test(original) ? 4 : /(?:4\s*[x×]\s*4|16\s*格|十六格)/i.test(original) ? 16 : 9;
    const intentLock = JiarenNormalizeIntentLock(e.intentLock, original);
    const sceneManifest = scriptSettings.map((scene) => ({
      id: scene.id || scene.sceneId,
      title: scene.title,
      location: scene.location || scene.sourceLocation,
      time: scene.timeOfDay || scene.sourceTime,
      weather: scene.weather,
      environment: scene.environment || scene.description,
      visualAnchors: scene.visualAnchors,
      lighting: scene.lighting,
      camera: scene.camera,
      sourceBeatIds: scene.sourceBeatIds || scene.beatRefs,
      sceneVariants: (scene.sceneVariants || []).map((variant) => ({
        id: variant.variantId || variant.id,
        title: variant.title,
        sourceBeatIds: variant.sourceBeatIds,
        beatSummary: variant.beatSummary,
        camera: variant.camera,
        spatialFraming: variant.spatialFraming,
        imageUrl: variant.imageUrl
      }))
    }));
    const scriptSections = JiarenConfirmedScriptSections(e.script, productionBeats);
    const scriptWithIds = scriptSections.map((section) => /\bBEAT[-_\s]*\d{1,3}\b/i.test(section.text) ? section.text : `${section.id}
${section.text}`).join("\n\n");
    const schema = [
      `\u5FC5\u987B\u8FD4\u56DE\u6070\u597D ${desiredShotCount} \u4E2A shots\uFF0C\u6309\u6545\u4E8B\u987A\u5E8F\u8986\u76D6\u7EA6 ${O.runtimeParams.durationSeconds} \u79D2\u3002`,
      JiarenNovelDurationContract(original, O.runtimeParams),
      "\u6BCF\u4E2A\u955C\u5934\u5FC5\u987B\u7ED1\u5B9A scene_id\u3001scene_variant_id \u548C script_beat\uFF1Bscene_id/scene_variant_id \u53EA\u80FD\u4ECE production_beats \u81EA\u52A8\u5F52\u7EB3\u7684\u5267\u672C\u5730\u70B9\u4E8B\u5B9E\u4E2D\u9009\u62E9\uFF0C\u7981\u6B62\u53D1\u660E\u65B0\u5730\u70B9\u3001\u65B0\u65F6\u95F4\u6216\u65B0\u5929\u6C14\u3002",
      "\u6BCF\u955C\u5FC5\u987B\u5199\u6E05 characters_on_screen\u3001blocking\u3001pose\u3001expression\u3001dialogue\u3001shot_size\u3001lens\u3001camera_angle\u3001camera_motion\u3001subject_action\u3001environment\u3001lighting\u3001transition_in\u3001transition_out\u3001image_prompt\u3001video_prompt\u3001negative_prompt\u3001frame_mode\u3002\u4E00\u4E2A\u955C\u5934\u7684\u753B\u9762\u4EFB\u52A1\u5FC5\u987B\u53EF\u76EE\u89C6\u9A8C\u6536\uFF0C\u4E0D\u5F97\u53EA\u5199\u6C1B\u56F4\u3002",
      "Seedance 2.0 \u65F6\u957F\u662F 4-15 \u79D2\u5185\u4EFB\u610F\u6574\u6570\u6216 -1\uFF0C\u4E0D\u662F\u53EA\u6709 5/10 \u79D2\uFF1B\u5BF9\u767D\u5FC5\u987B\u4FDD\u5B58\u5728 dialogue \u4E2D\uFF0C\u540E\u7EED\u89C6\u9891\u63D0\u793A\u8BCD\u7528\u53CC\u5F15\u53F7\u5305\u88F9\u3002",
      `\u5F53\u524D\u5BFC\u6F14\u5206\u955C\u5E03\u5C40\u56FA\u5B9A\u4E3A ${storyboardPanelCount === 4 ? "2x2 \u56DB\u683C" : storyboardPanelCount === 16 ? "4x4 \u5341\u516D\u683C" : "3x3 \u4E5D\u5BAB\u683C"}\uFF0Cpanel_count \u5FC5\u987B\u4E3A ${storyboardPanelCount}\uFF1Bdirector_slices \u5FC5\u987B\u6309\u65F6\u95F4\u987A\u5E8F\u8986\u76D6\u5168\u90E8 ${storyboardPanelCount} \u683C\u3002\u6BCF\u683C\u662F\u72EC\u7ACB\u5206\u955C\u6210\u54C1\u56FE\uFF0C\u4E0D\u662F\u5927\u56FE\u7684\u88C1\u5207\u5757\u3002`,
      "T8 \u9010\u955C\u89C4\u5219\uFF1A\u4E00\u4E2A shot \u662F\u4E00\u4E2A\u53EF\u72EC\u7ACB\u7F16\u8F91\u548C\u91CD\u8BD5\u7684\u751F\u6210\u4EFB\u52A1\uFF1Bframe_mode \u53EA\u80FD\u662F first/firstlast/multiframe/auto\uFF1B\u53C2\u8003\u987A\u5E8F\u7531\u7CFB\u7EDF\u56FA\u5B9A\u4E3A\u89D2\u8272 -> \u5F53\u524D\u5206\u955C\u5173\u952E\u5E27 -> \u4E0A\u4E00\u955C\u5C3E\u5E27 -> \u5267\u672C\u5730\u70B9\u6587\u5B57\u4E8B\u5B9E\u3002",
      "\u89C6\u9891\u63D0\u793A\u8BCD\u53EA\u80FD\u8BA9\u5DF2\u786E\u8BA4\u5173\u952E\u5E27\u52A8\u8D77\u6765\uFF0C\u4E0D\u5141\u8BB8\u91CD\u65B0\u521B\u9020\u4EBA\u7269\u548C\u573A\u666F\u3002",
      `\u4E25\u683C JSON\uFF1A{"shots":[{"shot_id":"shot-01","title":"...","scene_id":"scene-01","scene_variant_id":"scene-01-variant-01","script_beat":"BEAT-01 \u7684\u53EF\u89C1\u52A8\u4F5C","duration_sec":6,"grid_layout":"${storyboardPanelCount === 4 ? "2x2" : storyboardPanelCount === 16 ? "4x4" : "3x3"}","panel_count":${storyboardPanelCount},"characters_on_screen":["char-01"],"blocking":"\u4E3B\u89D2\u4F4D\u4E8E\u5DE6\u524D\u666F","pose":"\u5954\u8DD1","expression":"\u7D27\u5F20","dialogue":"\u5FEB\u8D70\uFF01","shot_size":"...","lens":"...","camera_angle":"...","camera_motion":"...","subject_action":"...","environment":"...","lighting":"...","transition_in":"...","transition_out":"...","image_prompt":"...","video_prompt":"...","negative_prompt":"...","frame_mode":"first","character_refs":["char-01"],"prop_refs":["asset-01"],"director_slices":["00:00.0-00:01.5 ..."]}],"quality_check":{"intent_aligned":true,"scene_ids_valid":true,"scene_variant_ids_valid":true,"timecodes_continuous":true}}\u3002`
    ].join("\n");
    const basePrompt = [
      O.adapter.wrapStoryboardPrompt(
        original,
        scriptWithIds,
        [e.character, ...e.characters || []].map((character) => `${character.name}: ${character.appearance || character.description || ""}`).join("\n"),
        JSON.stringify(sceneManifest),
        rt === "grid" ? "\u9010\u955C\u5173\u952E\u5E27 + \u4E5D\u5BAB\u683C\u673A\u4F4D\u9884\u89C8" : "\u9010\u955C\u591A\u53C2\u8003\u6A21\u5F0F",
        e.styleLock
      ),
      JiarenIntentLockText(intentLock, original),
      `\u5267\u672C\u5730\u70B9\u8FDE\u7EED\u6027\u6E05\u5355\uFF08\u7531 production_beats \u672C\u5730\u751F\u6210\uFF0C\u552F\u4E00\u5141\u8BB8\u7684 scene_id\uFF09\uFF1A${JSON.stringify(sceneManifest)}`,
      e.propAssets?.length ? `\u6301\u7EED\u9053\u5177/\u8F7D\u5177\u6E05\u5355\uFF1A${JSON.stringify(e.propAssets)}` : "",
      schema
    ].filter(Boolean).join("\n\n");
    let lastError;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const prompt = attempt === 0 ? basePrompt : `${basePrompt}

\u4E0A\u4E00\u6B21\u7ED3\u6784\u6216\u8FDE\u7EED\u6027\u6821\u9A8C\u5931\u8D25\uFF1A${lastError?.message || lastError}\u3002\u8BF7\u5B8C\u6574\u91CD\u5199 shots[]\uFF0C\u4E0D\u8981\u89E3\u91CA\u3002`;
      try {
        const content = await Rn("storyboard", prompt, {
          includeReferences: false,
          contextOverride: [
            JiarenIntentLockText(intentLock, original),
            `\u5B8C\u6574\u786E\u8BA4\u5267\u672C\uFF1A
${scriptWithIds}`,
            `\u5267\u672C\u5730\u70B9\u4E8B\u5B9E\uFF1A${JSON.stringify(sceneManifest)}`
          ].join("\n\n")
        });
        const record = un(content);
        const rawShots = ur(record, [
          "shots",
          "storyboard",
          "storyboards",
          "shot_list",
          "shotList",
          "shot_plan",
          "shotPlan",
          "storyboard_plan",
          "storyboardPlan",
          "items"
        ]);
        if (!rawShots.length) throw new Error("\u5206\u955C Agent \u8FD4\u56DE\u4E86\u5185\u5BB9\uFF0C\u4F46\u672A\u89E3\u6790\u5230\u5206\u955C\u6570\u7EC4\u3002");
        const repairedShots = JiarenRepairStoryboardRecords(rawShots, scriptSettings, productionBeats, e.script, intentLock, {
          originalRequest: original,
          desiredShotCount,
          characterNames: [e.character, ...e.characters || []].map((character) => character.name).filter(Boolean)
        });
        return JiarenNormalizeStoryboardPlan(repairedShots, scriptSettings, intentLock, {
          originalRequest: original,
          desiredShotCount,
          targetDurationSeconds: O.runtimeParams.durationSeconds,
          seedance: lt(),
          panelCount: storyboardPanelCount
        });
      } catch (error) {
        lastError = error;
      }
    }
    const fallbackShots = JiarenBuildStoryboardFallbackRecords(scriptSettings, productionBeats, e.script, intentLock, {
      originalRequest: original,
      desiredShotCount,
      characterNames: [e.character, ...e.characters || []].map((character) => character.name).filter(Boolean)
    });
    try {
      return JiarenNormalizeStoryboardPlan(fallbackShots, scriptSettings, intentLock, {
        originalRequest: original,
        desiredShotCount,
        targetDurationSeconds: O.runtimeParams.durationSeconds,
        seedance: lt(),
        panelCount: storyboardPanelCount
      });
    } catch (fallbackError) {
      throw new Error(`\u5206\u955C Agent \u4E24\u6B21\u8FD4\u56DE\u5F02\u5E38\uFF0C\u4E14\u672C\u5730\u5267\u672C\u8282\u62CD\u515C\u5E95\u5931\u8D25\uFF1A${fallbackError?.message || fallbackError}\uFF1B\u6A21\u578B\u6700\u540E\u9519\u8BEF\uFF1A${lastError?.message || lastError}`);
    }
  }
  function ua(e) {
    const r = Lt(), a = e.timecode.match(/(\d{1,2}):(\d{2}(?:\.\d+)?)\s*[-–]\s*(\d{1,2}):(\d{2}(?:\.\d+)?)/);
    if (a) {
      const o = Number(a[1]) * 60 + Number(a[2]), s = Number(a[3]) * 60 + Number(a[4]);
      if (Number.isFinite(o) && Number.isFinite(s) && s > o) return Dn(Math.max(4, Math.min(r, s - o)));
    }
    return Dn(Math.max(4, Math.min(r, Math.round(O.runtimeParams.durationSeconds / Math.max(1, Jt)) || 6)));
  }
  function vr(e) {
    var Ie, K, ye, _e, nt, ge, pt, Y;
    if (!lt()) return "";
    const r = e.allShots ?? e.payload.shots ?? [], a = typeof e.shotIndex == "number" ? e.shotIndex : e.currentShot ? r.indexOf(e.currentShot) : -1, o = a > 0 ? r[a - 1] : void 0, s = a >= 0 ? r[a + 1] : void 0, d = e.durationSeconds ? Dn(e.durationSeconds) : e.currentShot ? ua(e.currentShot) : void 0, l = $(e.currentAction || ((Ie = e.currentShot) == null ? void 0 : Ie.videoPrompt) || ((K = e.currentShot) == null ? void 0 : K.prompt) || ((ye = e.currentShot) == null ? void 0 : ye.title) || "", 520), p = $(e.previousLabel || (o ? `${o.title || "previous shot"} ${o.timecode || ""}: ${o.videoPrompt || o.prompt || ""}` : ""), 320), h = $(e.nextLabel || (s ? `${s.title || "next shot"} ${s.timecode || ""}: ${s.videoPrompt || s.prompt || ""}` : ""), 320), g = e.matchedScene, y = g ? $([g.title, g.environment || g.description, g.lighting, g.terrain, g.spatialFraming, g.transitionOut].filter(Boolean).join(" / "), 380) : "", j = De(e.payload.character.name) || "\u4E3B\u89D2", I = We(j, e.payload.character.appearance, e.payload.character.description, ((_e = e.payload.studioConfig) == null ? void 0 : _e.userIdea) || O.runtimeParams.userIdea, l, (nt = e.payload.styleLock) == null ? void 0 : nt.label), x = $([`name=${j}`, I, e.payload.character.description].filter(Boolean).join(" / "), 360), M = $($t(e.payload), 260), U = e.previousHasLastFrame ?? !!(o != null && o.lastFrameImageUrl), le = e.previousHasVideo ?? !!(o != null && o.videoUrl), be = e.keyframeProvided ?? !!((ge = e.currentShot) != null && ge.storyboardImageUrl);
    return $(["SEEDANCE RELAY PACK:", `This is a sequential Seedance relay clip${e.clipLabel ? ` (${e.clipLabel})` : ""}, not an isolated standalone video.`, d ? `Legal Seedance 2.0 duration: ${d}s. Duration must be an integer from 4 to 15 seconds (or -1 only when explicitly using automatic duration).` : "Legal Seedance 2.0 duration: integer 4-15 seconds; never force a legacy duration ladder.", e.currentTimecode || (pt = e.currentShot) != null && pt.timecode ? `Current time range: ${e.currentTimecode || ((Y = e.currentShot) == null ? void 0 : Y.timecode)}.` : "", l ? `Current story beat to animate: ${l}.` : "", x ? `Character lock: ${x}.` : "", M ? `Prop/vehicle lock: ${M}.` : "", y ? `Script-bound setting facts: ${y}. No separate setting image is supplied.` : "", be ? "Current approved keyframe/storyboard image is the composition and action anchor. Animate it without redesigning the shot." : "", p ? `Previous relay clip: ${p}. ${U || le ? "A previous tail frame/video reference is provided; begin by matching its pose, screen direction, light, camera momentum, and emotional state. Do not restart as a new opening shot." : "No previous tail frame is available; still preserve the written continuity and do not reset to a generic opening shot."}` : "Opening relay clip: establish the world clearly once, then keep the locked protagonist and script location visible; do not use unrelated empty sky/cloud inserts or random portrait cutaways.", h ? `Next relay target: ${h}. End this clip with a visible exit cue, pose momentum, eye-line, camera direction, or environmental motion that can cut into the next clip.` : "Final relay clip: resolve the beat cleanly without inventing a new place or protagonist.", "Reference priority for Seedance: 1 identity/character references, 2 recurring prop/vehicle references, 3 current storyboard panels, 4 previous tail frame/video for continuity, 5 script setting facts control location/time/weather in text.", "Continuity bans: no gender swap, no face replacement, no outfit replacement, no new vehicle/prop, no new location, no style switch, no unrelated insert shot, no captions, no watermark."].filter(Boolean).join(`
`), 1700);
  }
  function jr(e, r, a, o, s = o.shots) {
    const original = o.intentLock?.original || o.studioConfig?.userIdea || O.runtimeParams.userIdea || "";
    const intentLock = JiarenNormalizeIntentLock(o.intentLock, original);
    const lockText = JiarenIntentLockText(intentLock, original, 1050);
    const previous = s[r - 1];
    const next = s[r + 1];
    const sceneText = a ? [
      `sceneId=${a.id || a.sceneId || e.sceneId || ""}`,
      a.title,
      a.location || a.sourceLocation,
      a.timeOfDay || a.sourceTime,
      a.weather,
      a.environment || a.description,
      a.visualAnchors?.join(" / "),
      a.lighting,
      a.spatialFraming,
      a.camera
    ].filter(Boolean).join(" / ") : `sceneId=${e.sceneId || "unbound"}`;
    const characterText = JiarenCompactText(
      We(
        o.character.name,
        o.character.appearance,
        o.character.description,
        original,
        e.scriptBeat || e.subjectAction || e.prompt,
        o.styleLock?.label
      ),
      520
    );
    const assetText = JiarenCompactText($t(o), 520);
    const shotText = JiarenCompactText(e.videoPrompt || e.prompt || e.title || `shot ${r + 1}`, 1250);
    return $(
      [
        `JIAREN DIRECTOR SHOT ${r + 1}/${Math.max(1, s.length)}: ${e.title || `\u955C\u5934 ${r + 1}`}; ${e.timecode}; duration=${e.durationSec || ua(e)}s.`,
        `Bound script beat: ${e.scriptBeat || e.subjectAction || e.prompt || "missing"}.`,
        `Script-bound setting facts: ${sceneText}. Use these facts as text constraints only.`,
        `Camera-visible plan: shot size=${e.shotSize || "follow keyframe"}; lens=${e.lens || "follow keyframe"}; angle=${e.cameraAngle || "follow keyframe"}; movement=${e.cameraMotion || "follow keyframe"}.`,
        `Visible action: ${e.subjectAction || e.prompt}.`,
        `Approved character identity: ${characterText}.`,
        assetText ? `Approved recurring assets: ${assetText}.` : "",
        `Current approved keyframe animation instructions: ${shotText}`,
        e.continuityPrompt ? `Continuity: ${e.continuityPrompt}.` : "",
        previous ? `Continue from shot ${r}: ${previous.title}; preserve pose, screen direction, emotional state, lighting, and motion momentum.` : "Opening shot: establish only the approved first story beat.",
        next ? `End with a visible handoff toward shot ${r + 2}: ${next.title}.` : "Final shot: resolve only the approved ending beat without opening another scene.",
        lockText,
        e.negativePrompt ? `Negative prompt: ${e.negativePrompt}.` : "",
        "Reference priority: approved character identity/outfit > recurring prop/vehicle assets > current storyboard keyframe composition/action > previous accepted last frame continuity > script setting facts control location/time/weather in text.",
        "Animate the approved keyframe. Do not reinterpret the story, invent a new place, recast a character, replace a recurring asset, change time/weather, or switch media style."
      ].filter(Boolean).join("\n"),
      3600
    );
  }
  function Wo(e) {
    var a, o;
    if (rt === "grid") return Math.max(1, Math.min(16, Number(e.panelCount) || ((a = e.storyboardPanelUrls) == null ? void 0 : a.length) || ((o = e.microSlices) == null ? void 0 : o.length) || 9));
    if ((a = e.storyboardPanelUrls) != null && a.length && e.storyboardPanelUrls.length !== 4) return Math.max(1, Math.min(16, e.storyboardPanelUrls.length));
    const r = ((o = e.microSlices) == null ? void 0 : o.length) || 0;
    return r >= 10 ? 16 : r >= 5 ? 9 : r >= 2 ? 4 : Math.max(1, r || 1);
  }
  function ma(e, r, a) {
    const slices = JiarenBuildStoryboardSlices(e, a);
    return slices[r] || slices[slices.length - 1] || e.prompt || e.videoPrompt || e.title;
  }
  function xr(e, r, a, o) {
    const phaseLabels = [
      "\u7A7A\u95F4\u5EFA\u7ACB",
      "\u4E3B\u4F53\u5165\u753B",
      "\u52A8\u4F5C\u8D77\u70B9",
      "\u8DDF\u968F\u63A8\u8FDB",
      "\u52A8\u4F5C\u53D1\u5C55",
      "\u5173\u952E\u7EC6\u8282",
      "\u52A8\u4F5C\u8F6C\u6298",
      "\u8854\u63A5\u9884\u5907",
      "\u672B\u5E27\u4EA4\u63A5"
    ];
    return a.map((s, d) => {
      const l = ma(e, d, a.length);
      const node = e.storyboardNodes?.find((candidate) => candidate.id === e.storyboardPanelIds?.[d]) || e.storyboardNodes?.[d];
      const phaseIndex = Math.min(
        phaseLabels.length - 1,
        Math.floor(d * phaseLabels.length / Math.max(1, a.length))
      );
      const persistedStatus = node?.statusText;
      return {
        id: node?.id || e.storyboardPanelIds?.[d] || `shot-${r + 1}-panel-${d + 1}`,
        shotIndex: r,
        panelIndex: d,
        panelTotal: a.length,
        title: `${e.title || `\u955C\u5934 ${r + 1}`} \xB7 \u7247\u6BB5 ${d + 1}`,
        timecode: qo(e, d, a.length),
        prompt: l,
        imageUrl: s,
        sceneVariantId: e.sceneVariantId,
        sceneVariantImageUrl: void 0,
        charactersOnScreen: e.charactersOnScreen || [],
        blocking: e.blocking || "",
        pose: e.pose || "",
        expression: e.expression || "",
        dialogue: e.storyboardCaptions?.[d] || e.dialogue || "",
        shotSize: e.shotSize || "",
        cameraMotion: e.cameraMotion || "",
        durationSec: Math.max(0.1, Number(e.durationSec || pa(e.timecode).duration || 5) / Math.max(1, a.length)),
        sceneTitle: o?.title || e.sceneTitle,
        videoUrl: node?.videoUrl,
        lastFrameImageUrl: node?.lastFrameImageUrl,
        status: node?.status || "ready",
        statusText: persistedStatus && persistedStatus !== "\u7B49\u5F85\u751F\u6210" ? persistedStatus : phaseLabels[phaseIndex]
      };
    });
  }
  function qo(e, r, a) {
    const o = ma(e, r, a), s = o == null ? void 0 : o.match(/(\d{1,2}:\d{2}(?:\.\d+)?)\s*[-–]\s*(\d{1,2}:\d{2}(?:\.\d+)?)/);
    if (s) return `${s[1]}-${s[2]}`;
    const d = pa(e.timecode), l = d.start + d.duration * r / Math.max(1, a), p = d.start + d.duration * (r + 1) / Math.max(1, a);
    return `${dt(l)}-${dt(p)}`;
  }
  async function Yo(e, r) {
    var a;
    return (a = e.storyboardPanelUrls) != null && a.length ? e.storyboardPanelUrls : e.storyboardImageUrl ? [e.storyboardImageUrl] : [];
  }
  function JiarenStoryboardPanelPatch(e, r, a) {
    const o = Oe.find((d) => d.step === "storyboard"), s = o == null ? void 0 : o.payload.shots[e];
    if (!s) return;
    const d = Array.isArray(s.storyboardPanelUrls) ? [...s.storyboardPanelUrls] : [], l = Array.isArray(s.storyboardPanelIds) && s.storyboardPanelIds.length === d.length ? [...s.storyboardPanelIds] : d.map((_2, index) => `shot-${e + 1}-panel-${index + 1}`), p = Array.isArray(s.storyboardCaptions) ? [...s.storyboardCaptions] : d.map((_2, index) => index === 0 ? s.dialogue || "" : ""), h = Array.isArray(s.microSlices) ? [...s.microSlices] : [], g = Array.isArray(s.storyboardNodes) ? [...s.storyboardNodes] : xr(s, e, d, fr(s, e, o.payload.scenes || []));
    if (a === "remove") {
      if (d.length <= 1) return m("\u6BCF\u4E2A\u955C\u5934\u81F3\u5C11\u4FDD\u7559\u4E00\u5F20\u72EC\u7ACB\u5206\u955C\u56FE\u3002");
      d.splice(r, 1), l.splice(r, 1), p.splice(r, 1), h.splice(r, 1);
    } else if (a === "left" && r > 0 || a === "right" && r < d.length - 1 || typeof a === "number" && a >= 0 && a < d.length && a !== r) {
        const y = typeof a === "number" ? a : a === "left" ? r - 1 : r + 1;
      [d[r], d[y]] = [d[y], d[r]], [l[r], l[y]] = [l[y], l[r]], [p[r], p[y]] = [p[y], p[r]], h.length === d.length && ([h[r], h[y]] = [h[y], h[r]]);
    }
    const y = l.map((id, index) => g.find((node) => node.id === id) || { id, imageUrl: d[index] }).map((node, index) => ({ ...node, panelIndex: index, panelTotal: d.length, imageUrl: d[index], dialogue: p[index] || s.dialogue || "", videoUrl: void 0, lastFrameImageUrl: void 0, status: "ready", statusText: "等待生成" })), j = d.length <= 4 ? 2 : d.length <= 9 ? 3 : 4;
    Ot(e, { storyboardPanelUrls: d, storyboardPanelIds: l, storyboardCaptions: p, microSlices: h.length ? h : s.microSlices, storyboardNodes: y, panelCount: d.length, gridCols: j, gridRows: j, gridLayout: `${j}x${j}`, storyboardGridUrl: void 0, panelVideoUrls: [], panelVideoTasks: [], videoUrl: void 0, lastFrameImageUrl: void 0, videoTaskId: void 0, videoTaskProvider: void 0, videoPollUrl: void 0, videoTaskStatus: "idle", videoTaskError: null, videoTaskProgress: void 0, videoPending: true, videoStatus: "分镜顺序已更改，需要重新生成视频" });
  }
  function JiarenStoryboardCaptionPatch(e, r, a) {
    const o = Oe.find((d) => d.step === "storyboard")?.payload.shots[e];
    if (!o) return;
    const s = Array.isArray(o.storyboardCaptions) ? [...o.storyboardCaptions] : (o.storyboardPanelUrls || []).map((_2, index) => index === 0 ? o.dialogue || "" : "");
    s[r] = a.slice(0, 140), Ot(e, { storyboardCaptions: s });
  }
  function JiarenStoryboardDisplayPatch(e, r) {
    Ot(e, r);
  }
  async function Zo(e, r, a, o, s, d) {
    var g, y;
    const l = rt === "grid" ? Wo(e) : 1;
    if (l <= 1) return { panelUrls: [a] };
    const p = (g = e.storyboardPanelUrls) != null && g.length ? [a, ...e.storyboardPanelUrls.slice(1, l)] : [a];
    let h = "";
    for (let j = p.length; j < l; j += 1) {
      const I = ma(e, j, l), x = ka(O.runtimeParams.userIdea, I, s, o), M = wt(O.runtimeParams.userIdea, x), U = De(s.character.name) || "\u4E3B\u89D2", le = We(U, s.character.appearance, s.character.description, O.runtimeParams.userIdea, x, (y = s.styleLock) == null ? void 0 : y.label);
      ke("storyboard", { phase: "running", message: `\u5206\u955C\u52A8\u753B\u5E08\u6B63\u5728\u751F\u6210\u955C\u5934 ${r + 1} \u7684\u8FDE\u7EED\u7247\u6BB5 ${j + 1}/${l}` });
      const embodiedLock = JiarenDetectEmbodiedProtagonistAsset(s.originalSource || s.sourceText || s.sourceIdea || s.studioConfig?.userIdea || O.runtimeParams.userIdea, x, U), be = [tn(s.styleLock, "storyboard node keyframe", s.intentLock?.original || s.studioConfig?.userIdea), O.adapter.wrapImagePrompt([JiarenStoryboardImageContract(e, r, o, s, I, "node-keyframe"), `Create one independent storyboard node keyframe for shot ${r + 1}, node ${j + 1}/${l}.`, M.lockText, M.requiredVisual.length ? `This node frame must visibly match the original request: ${M.requiredVisual.join("; ")}.` : "", M.negativeText.length ? `Forbidden in this node frame: ${M.negativeText.join("; ")}.` : "", "This is not cropped from a contact sheet and must not be a grid, collage, UI page, captioned board, or poster.", "Use the previous approved shot keyframe as continuity reference only; output one clean cinematic frame for this exact time slice.", _n(s, o, x), `Node time/action slice: ${x}.`, `Parent shot time range: ${e.timecode}.`, o ? `Script-bound setting facts: ${o.title}; ${gn(o)}.` : "", o != null && o.scriptSceneBody ? `Bound script scene text: ${$(o.scriptSceneBody, 300)}.` : "", e.continuityPrompt ? `Continuity: ${e.continuityPrompt}.` : "", `Character identity must match exactly: ${le}.`, embodiedLock || s.character.entityKind ? "Preserve the exact same non-human protagonist silhouette, proportions, surface, color and scale. No human or humanoid conversion, no face, hair, clothing, limbs or weapon." : "Preserve same script geography, lighting palette, outfit, face, body proportions, media type, camera direction, and color grading from the first keyframe.", "No UI, no captions, no subtitles, no watermarks, no contact sheet borders, no split panels, and no location or action outside the director intent lock."].filter(Boolean).join(`
`), "storyboard node keyframe", s.styleLock)].join(`
`), Ie = _t([...JiarenShotCharacterImages(s, e, true), ...JiarenShotPropImages(s, e), a, p[p.length - 1]], 6), K = await xt($(be, 3200), O.runtimeParams.aspect_ratio, Ie, { includeWorkbenchReferences: false });
      h = K.modelLabel || h;
      const ye = Re(K.asset);
      if (!ye) throw new Error(`\u955C\u5934 ${r + 1} \u7684\u7247\u6BB5 ${j + 1} \u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u5206\u955C\u56FE\u3002`);
      p.push(ye);
    }
    return { panelUrls: p, modelLabel: h };
  }
  function Xo(e, r, a, o, s, d, l, p, h) {
    const baseShot = jr(e, r, o, s, d);
    return $(
      [
        `JIAREN RENDER CLIP ${a.index + 1}/${l} inside storyboard shot ${r + 1}/${d.length}.`,
        `Clip time range: ${a.timecode}; target duration=${a.durationSeconds}s.`,
        `Only animate these approved storyboard timing beats:
${a.prompt}`,
        p ? "Use the previous accepted last frame only to continue pose, screen direction, lighting, and camera momentum." : "Start from the current approved storyboard keyframe.",
        h ? "The previous accepted clip is a motion-continuity reference, not a source for a new story." : "",
        baseShot,
        "Return one continuous clip for this render group. Do not split timing notes into unrelated videos or different visual styles."
      ].filter(Boolean).join("\n"),
      3600
    );
  }
  function es(e, r, a = 6, o = a) {
    const s = ua(e), d = 4, l = Math.max(d, Lt()), p = Math.max(1, Math.min(6, Math.round(Number(a) || 1))), h = Math.max(1, Math.min(6, Math.round(Number(o) || p))), capacityFor = (count) => p + Math.max(0, count - 1) * h;
    let groupCount = Math.max(1, Math.min(r.length, Math.ceil(s / l)));
    while (groupCount < r.length && capacityFor(groupCount) < r.length) groupCount += 1;
    let cursor = 0;
    return Array.from({ length: groupCount }, (_group, y) => {
      const remainingPanels = r.length - cursor, remainingGroups = groupCount - y, groupCapacity = y === 0 ? p : h, futureCapacity = Math.max(0, remainingGroups - 1) * h, minimumTake = Math.max(1, remainingPanels - futureCapacity), balancedTake = Math.max(1, Math.ceil(remainingPanels / remainingGroups)), take = Math.min(groupCapacity, Math.max(minimumTake, balancedTake)), j = cursor, I = Math.min(r.length, cursor + take), x = Array.from({ length: I - j }, (_item, K) => j + K), M = x.map((Ie) => {
        const K = ma(e, Ie, r.length);
        return `\u7247\u6BB5 ${Ie + 1}/${r.length}\uFF1A${K}`;
      }).join(`
`), U = pa(e.timecode), le = U.start + U.duration * y / groupCount, be = U.start + U.duration * (y + 1) / groupCount;
      cursor = I;
      return { index: y, startPanel: j, endPanel: I, panelUrls: x.map((Ie) => r[Ie]).filter(Boolean), panelIndices: x, timecode: `${dt(le)}-${dt(be)}`, prompt: M, durationSeconds: Dn(Math.max(d, Math.min(Lt(), Math.round(s / groupCount)))) };
    });
  }
  async function ts(e, r, a, o, s, d, l) {
    var U, le, be, Ie;
    const p = await Yo(e);
    if (p.length === 0)
      throw new Error(
        `\u955C\u5934 ${r + 1} \u6CA1\u6709\u53EF\u7528\u72EC\u7ACB\u5206\u955C\u56FE\u3002\u8BF7\u91CD\u65B0\u8FD0\u884C\u5206\u955C\uFF0C\u4E5D\u5BAB\u683C\u9884\u89C8\u4E0D\u4F1A\u518D\u88AB\u88C1\u5207\u7528\u4E8E\u89C6\u9891\u3002`
      );
    let h = xr(e, r, p, a), taskStates = Array.isArray(e.panelVideoTasks) ? e.panelVideoTasks.map((state) => state ? { ...state } : state) : [];
    Ot(r, {
      storyboardPanelUrls: p,
      storyboardNodes: h,
      panelVideoTasks: [...taskStates],
      videoPending: true,
      videoStatus: `\u5DF2\u5EFA\u7ACB ${p.length} \u4E2A\u5206\u955C\u7247\u6BB5\uFF0C\u51C6\u5907\u6309\u7A33\u5B9A\u65F6\u957F\u5206\u7EC4\u6E32\u67D3`
    });
    const identityAnchor = wr(o, s, r), characterReferences = JiarenShotCharacterImages(o, e), propReferences = JiarenShotPropImages(o, e), firstFixedReferences = kr(characterReferences, void 0, [], d, 8, identityAnchor, propReferences), continuityReservation = d || "__jiaren_reserved_previous_last_frame__", fixedReferences = kr(characterReferences, void 0, [], continuityReservation, 8, identityAnchor, propReferences), firstPanelReferenceBudget = Math.max(1, Math.min(6, 9 - firstFixedReferences.length)), panelReferenceBudget = Math.max(1, Math.min(6, 9 - fixedReferences.length)), g = es(e, p, firstPanelReferenceBudget, panelReferenceBudget), referenceBudget = {
      maxImages: 9,
      characterImages: fixedReferences.filter((item) => item.slot === "identity" || item.slot === "character").length,
      propImages: fixedReferences.filter((item) => item.slot === "prop").length,
      continuityImages: fixedReferences.filter((item) => item.slot === "previous").length,
      firstPanelImagesPerGroup: firstPanelReferenceBudget,
      panelImagesPerGroup: panelReferenceBudget,
      groupCount: g.length
    };
    h = h.map((K) => ({ ...K, status: "running", statusText: "\u7B49\u5F85\u5206\u7EC4\u6E32\u67D3" }));
    Ot(r, {
      storyboardPanelUrls: p,
      storyboardNodes: h,
      panelVideoUrls: [],
      panelVideoTasks: [...taskStates],
      referenceBudget,
      videoPending: true,
      videoStatus: `\u5DF2\u62C6\u6210 ${g.length} \u4E2A\u7247\u6BB5\u7EC4\uFF0C\u6BCF\u7EC4\u6700\u591A ${panelReferenceBudget} \u5F20\u72EC\u7ACB\u5206\u955C\uFF0C\u603B\u5F15\u7528\u4E0D\u8D85\u8FC7 9 \u56FE`
    });
    const y = [];
    let j = "", I = d, x = l;
    for (const K of g) {
      const referenceSignature = [e.sceneVariantId, identityAnchor, ...characterReferences, ...propReferences, ...K.panelUrls, I, x].filter(Boolean).join("|"), savedTask = taskStates[K.index] || {}, canReuseTask = savedTask.referenceSignature === referenceSignature, ye = canReuseTask ? e.panelVideoUrls?.[K.index] || savedTask.videoUrl : void 0, _e = canReuseTask && K.panelIndices.every((de) => !!h[de]?.videoUrl);
      if (ye || _e) {
        const de = ye || h[K.panelIndices[K.panelIndices.length - 1]]?.videoUrl;
        if (de) {
          y.push(de);
          const $e = h[K.panelIndices[K.panelIndices.length - 1]]?.lastFrameImageUrl || savedTask.lastFrameImageUrl || I;
          I = $e;
          x = de;
          taskStates[K.index] = {
            ...savedTask,
            referenceSignature,
            status: "success",
            videoUrl: de,
            lastFrameImageUrl: $e,
            error: null
          };
          h = h.map(
            (J, ie) => K.panelIndices.includes(ie) ? {
              ...J,
              videoUrl: J.videoUrl || de,
              lastFrameImageUrl: J.lastFrameImageUrl || $e,
              status: "done",
              statusText: `\u5DF2\u4FDD\u7559\u7247\u6BB5\u7EC4 ${K.index + 1}/${g.length}`
            } : J
          );
          Ot(r, {
            storyboardPanelUrls: p,
            storyboardNodes: h,
            panelVideoUrls: [...y],
            panelVideoTasks: [...taskStates],
            lastFrameImageUrl: I,
            videoPending: true,
            videoStatus: `\u5DF2\u4ECE\u65AD\u70B9\u4FDD\u7559 ${y.length}/${g.length} \u4E2A\u7247\u6BB5\u7EC4`
          });
          continue;
        }
      }
      ke("storyboard", {
        phase: "running",
        message: `\u5206\u955C\u52A8\u753B\u5E08\u6B63\u5728\u6E32\u67D3\u955C\u5934 ${r + 1}/${s.length} \u7684\u7247\u6BB5\u7EC4 ${K.index + 1}/${g.length}\uFF0C\u4E0D\u662F 0.4 \u79D2\u788E\u7247\u4EFB\u52A1\u3002`
      });
      h = h.map(
        (de, $e) => K.panelIndices.includes($e) ? {
          ...de,
          status: "running",
          statusText: `\u7247\u6BB5\u7EC4 ${K.index + 1}/${g.length} \u751F\u6210\u4E2D`
        } : de
      );
      Ot(r, {
        storyboardPanelUrls: p,
        storyboardNodes: h,
        panelVideoUrls: [...y],
        panelVideoTasks: [...taskStates],
        videoPending: true,
        videoStatus: `\u7247\u6BB5\u7EC4 ${K.index + 1}/${g.length} \u751F\u6210\u4E2D\uFF1A\u5DF2\u56FA\u5B9A\u573A\u666F/\u89D2\u8272/\u4E0A\u4E00\u6BB5\u672B\u5E27`
      });
      const ge = K.panelUrls, currentFixedReferences = kr(
        characterReferences,
        void 0,
        [],
        I,
        8,
        identityAnchor,
        propReferences
      ), panelReferences = kr([], void 0, ge, void 0, Math.max(1, 9 - currentFixedReferences.length)), pt = [...currentFixedReferences, ...panelReferences].slice(0, 9), referenceValidation = panelReferences.length === ge.length && pt.length <= 9 ? true : (() => {
        throw new Error(`\u7247\u6BB5\u7EC4 ${K.index + 1} \u7684\u53C2\u8003\u56FE\u9884\u7B97\u6821\u9A8C\u5931\u8D25\uFF1A\u5206\u955C ${ge.length} \u5F20\uFF0C\u5B9E\u9645\u643A\u5E26 ${panelReferences.length} \u5F20\uFF0C\u603B\u5F15\u7528 ${pt.length}/9\u3002`);
      })(), Y = Xo(e, r, K, a, o, s, g.length, I, x), onTaskState = (state) => {
        taskStates[K.index] = {
          ...taskStates[K.index] || savedTask,
          ...state,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        Ot(r, {
          storyboardPanelUrls: p,
          storyboardNodes: h,
          panelVideoUrls: [...y],
          panelVideoTasks: [...taskStates],
          videoPending: true,
          videoStatus: state.status === "polling" ? `\u7247\u6BB5\u7EC4 ${K.index + 1}/${g.length} \u751F\u6210\u4E2D \xB7 ${state.progress || "\u67E5\u8BE2\u4E2D"}` : state.status === "cancelled" ? "\u5DF2\u505C\u6B62\uFF1B\u6210\u529F\u7247\u6BB5\u548C\u4EFB\u52A1 ID \u5DF2\u4FDD\u7559" : state.status === "error" || state.status === "failed" ? `\u7247\u6BB5\u7EC4 ${K.index + 1}/${g.length} \u5931\u8D25\uFF0C\u53EF\u4ECE\u6B64\u5904\u91CD\u8BD5` : `\u7247\u6BB5\u7EC4 ${K.index + 1}/${g.length} \u5DF2\u8FD4\u56DE`
        });
      }, activeTask = canReuseTask ? taskStates[K.index] || savedTask : {}, ne = await Cr(Y, pt, o, {
        shotTitle: `${e.title || `\u955C\u5934 ${r + 1}`} \xB7 \u7247\u6BB5\u7EC4 ${K.index + 1}`,
        durationSeconds: K.durationSeconds,
        previousVideoSource: x,
        shotCount: ge.length,
        storyboardReferenceCount: ge.length,
        referenceMode: "reference",
        storyboardMode: "multi-reference",
        referenceProfile: "direct-storyboard",
        resumeTaskId: activeTask.taskId && activeTask.status !== "failed" ? activeTask.taskId : void 0,
        resumeTaskProvider: activeTask.taskProvider,
        resumePollUrl: activeTask.pollUrl,
        onTaskState,
        signal: videoRunAbortRef.current?.signal
      });
      j = ne.modelLabel || j;
      const ae = Re(ne.asset);
      if (!ae)
        throw new Error(
          `\u955C\u5934 ${r + 1} \u7684\u7247\u6BB5\u7EC4 ${K.index + 1} \u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u89C6\u9891\u5730\u5740\u3002`
        );
      y.push(ae);
      I = Re(ne.lastFrameAsset) || I;
      x = ae;
      taskStates[K.index] = {
        ...taskStates[K.index] || savedTask,
        referenceSignature,
        status: "success",
        taskId: ne.taskId || taskStates[K.index]?.taskId,
        taskProvider: ne.taskProvider || taskStates[K.index]?.taskProvider,
        pollUrl: ne.pollUrl || taskStates[K.index]?.pollUrl,
        videoUrl: ae,
        lastFrameImageUrl: I,
        error: null,
        progress: "100%",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      h = h.map(
        (de, $e) => K.panelIndices.includes($e) ? {
          ...de,
          videoUrl: ae,
          lastFrameImageUrl: I,
          status: "done",
          statusText: `\u5DF2\u5E76\u5165\u7247\u6BB5\u7EC4 ${K.index + 1}/${g.length}`
        } : de
      );
      Ot(r, {
        storyboardPanelUrls: p,
        storyboardNodes: h,
        panelVideoUrls: [...y],
        panelVideoTasks: [...taskStates],
        lastFrameImageUrl: I,
        videoPending: true,
        videoStatus: `\u5DF2\u8FD4\u56DE ${y.length}/${g.length} \u4E2A\u7247\u6BB5\u7EC4`
      });
    }
    if (y.length === 0)
      throw new Error(`\u955C\u5934 ${r + 1} \u5206\u7EC4\u6E32\u67D3\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u89C6\u9891\u3002`);
    let M = y[0];
    if (y.length > 1) {
      const K = await window.jiaren?.system.composeVideo({
        clips: y.map((ye, _e) => ({
          title: `${e.title || `\u955C\u5934 ${r + 1}`} \xB7 \u7247\u6BB5\u7EC4 ${_e + 1}`,
          source: ye
        })),
        outputName: `jiaren_shot_${r + 1}_renderclips_${Date.now()}.mp4`,
        cacheDir: F.cacheDir,
        downloadsDir: F.downloadsDir
      });
      if (!K?.ok || !K.asset)
        throw new Error(K?.message || `\u955C\u5934 ${r + 1} \u7247\u6BB5\u7EC4\u5408\u6210\u5931\u8D25\u3002`);
      M = Re(K.asset) || y[0];
    }
    Ot(r, {
      storyboardPanelUrls: p,
      storyboardNodes: h,
      panelVideoUrls: y,
      panelVideoTasks: [...taskStates],
      lastFrameImageUrl: I,
      videoPending: true,
      videoStatus: `\u955C\u5934\u5DF2\u6309 ${g.length} \u4E2A\u7A33\u5B9A\u7247\u6BB5\u7EC4\u5408\u6210\uFF0C\u672A\u62C6\u6210 0.4 \u79D2\u788E\u7247`
    });
    return {
      videoUrl: M,
      lastFrameImageUrl: I,
      storyboardPanelUrls: p,
      storyboardNodes: h,
      panelVideoUrls: y,
      panelVideoTasks: taskStates,
      modelLabel: j
    };
  }
  function Ot(e, r, a) {
    kt((o) => o.map((s) => {
      if (s.step !== "storyboard") return s;
      const d = s.payload.shots.map((l, p) => p === e ? { ...l, ...r } : l);
      return { ...s, payload: { ...s.payload, ...a ? { modelLabel: a } : {}, shots: d } };
    }));
  }
  function ti(e) {
    const r = e instanceof Error ? e.message : typeof e == "string" ? e : "\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5", a = wa(r);
    return /429|too many|rate limit|overload|busy|繁忙|过载|限流/i.test(r) ? "\u4E0A\u6E38\u6A21\u578B\u5F53\u524D\u7E41\u5FD9\u6216\u88AB\u9650\u6D41\uFF0C\u6211\u5DF2\u7ECF\u505C\u6B62\u63A8\u8FDB\uFF0C\u753B\u5E03\u4E0D\u4F1A\u65B0\u589E\u7A7A\u767D\u5185\u5BB9\u3002\u8BF7\u7A0D\u540E\u91CD\u8BD5\uFF0C\u6216\u5728\u6A21\u578B\u8BBE\u7F6E\u91CC\u6362\u4E00\u4E2A\u53EF\u7528\u7684\u56FE\u50CF/\u89C6\u9891\u6A21\u578B\u3002" : /content length exceeds threshold|input content length|context length|payload too large|内容过长|输入过长/i.test(r) ? "\u4F20\u7ED9\u6A21\u578B\u7684\u5185\u5BB9\u8FC7\u957F\u3002\u6211\u5DF2\u7ECF\u628A\u573A\u666F\u9636\u6BB5\u6539\u6210\u77ED\u4E0A\u4E0B\u6587\u6A21\u5F0F\uFF0C\u8BF7\u70B9\u91CD\u8BD5\uFF1B\u5982\u679C\u4ECD\u5931\u8D25\uFF0C\u8BF7\u51CF\u5C11\u53C2\u8003\u56FE\u6216\u7F29\u77ED\u5DE6\u4FA7\u8F93\u5165\u3002" : /fetch failed|failed to fetch|networkerror|network request failed/i.test(r) ? "\u63A5\u53E3\u8FDE\u63A5\u5931\u8D25\uFF1A\u8BF7\u68C0\u67E5\u8BE5\u6A21\u578B\u7684 Base URL\u3001API Key\u3001\u7F51\u7EDC\u4EE3\u7406\u6216\u7B2C\u4E09\u65B9\u5E73\u53F0\u662F\u5426\u53EF\u8BBF\u95EE\u3002" : /ChannelCapability|SKU|model unavailable|model_not_found|unsupported|not support|not found|route|path|路径|路由|接口路径|模型.*不可用|未开通|未开放|不可用|不支持|404|503/i.test(r) || /模型或接口路径不可用/i.test(a) ? "\u5F53\u524D\u6A21\u578B\u6216\u63A5\u53E3\u8DEF\u5F84\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5728 API \u8BBE\u7F6E\u91CC\u91CD\u65B0\u8BFB\u53D6\u6A21\u578B\uFF0C\u9009\u62E9\u8BE5\u63A5\u53E3\u771F\u5B9E\u8FD4\u56DE\u7684\u53EF\u7528\u89C6\u9891/\u56FE\u7247\u6A21\u578B\u540E\u91CD\u8BD5\u3002" : /401|403|unauthorized|invalid api key|invalid.*key|key.*invalid|密钥无效/i.test(r) ? "\u5F53\u524D\u63A5\u53E3\u8BA4\u8BC1\u672A\u901A\u8FC7\uFF0C\u6216\u8BE5\u8D26\u53F7\u672A\u5F00\u901A\u6240\u9009\u6A21\u578B\uFF1B\u8BF7\u5728 API \u8BBE\u7F6E\u91CC\u91CD\u65B0\u8BFB\u53D6\u6A21\u578B\u5217\u8868\u540E\u9009\u62E9\u771F\u5B9E\u53EF\u7528\u6A21\u578B\u3002\u8F6F\u4EF6\u6CA1\u6709\u6539\u52A8\u4F60\u7684\u5BC6\u94A5\u3002" : /404|not found|model.*not/i.test(r) ? "\u6A21\u578B\u63A5\u53E3\u6216\u6A21\u578B ID \u4E0D\u5339\u914D\uFF0C\u8BF7\u5728 API \u8BBE\u7F6E\u91CC\u6362\u6210 llms.txt \u4E2D\u5DF2\u5F00\u653E\u7684\u6A21\u578B\u3002" : /timeout|timed out/i.test(r) ? "\u63A5\u53E3\u8D85\u65F6\uFF1A\u89C6\u9891/\u56FE\u50CF\u4EFB\u52A1\u53EF\u80FD\u8F83\u6162\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u6216\u5207\u6362\u53EF\u7528\u6A21\u578B\u3002" : a;
  }
  function Re(e) {
    const r = (e == null ? void 0 : e.url) || (e == null ? void 0 : e.localPath) || (e == null ? void 0 : e.dataUrl);
    return (r == null ? void 0 : r.trim()) || void 0;
  }
  function Ar(e, r, a, o, s) {
    return { name: r, localPath: /^https?:\/\//i.test(e) || e.startsWith("data:") ? void 0 : e, dataUrl: e.startsWith("data:") ? e : void 0, url: /^https?:\/\//i.test(e) ? e : void 0, mimeType: e.startsWith("data:image/") ? e.slice(5, e.indexOf(";")) : "image/png", referenceRole: a, referenceDescription: o, referenceSlot: s };
  }
  function JiarenShotCharacterAssets(e, r) {
    const a = [e.character, ...e.characters ?? []].filter((d) => !!d).filter((d, l, p) => {
      const h = De(d.name || d.id || "");
      return h && p.findIndex((g) => De(g.name || g.id || "") === h) === l;
    }), o = JiarenStringArray(r?.charactersOnScreen || r?.characters_on_screen || r?.characterRefs || r?.character_refs), s = o.length ? a.filter((d) => {
      const l = De(d.name || d.id || "");
      return o.some((p) => JiarenTextContains(l, p) || JiarenTextContains(p, l));
    }) : [];
    return s.length ? s : a.slice(0, 1);
  }
  function JiarenShotCharacterImages(e, r, a = false) {
    const embodiedLock = JiarenDetectEmbodiedProtagonistAsset(e.originalSource || e.sourceText || e.sourceIdea || e.studioConfig?.userIdea || O.runtimeParams.userIdea, (e.script || []).join("\n"), e.character?.name || "");
    return _t(JiarenShotCharacterAssets(e, r).flatMap((o) => embodiedLock && o.entityKind !== embodiedLock.entityKind ? [] : a ? [o.imageUrl, o.sheetUrl] : [o.imageUrl]), a ? 4 : 3);
  }
  function JiarenShotPropImages(e, r) {
    const a = (e.propAssets ?? []).filter((d) => !!d?.imageUrl), o = JiarenStringArray(r?.propRefs || r?.prop_refs), s = o.length ? [...a.filter((d) => o.some((l) => JiarenTextContains(d.name, l) || JiarenTextContains(l, d.name))), ...a.filter((d) => !o.some((l) => JiarenTextContains(d.name, l) || JiarenTextContains(l, d.name)))] : a;
    return _t(s.map((d) => d.imageUrl), 3);
  }
  function wr(e, r = e.shots, a = 0) {
    var o, s, d, l;
    const embodiedLock = JiarenDetectEmbodiedProtagonistAsset(e.originalSource || e.sourceText || e.sourceIdea || e.studioConfig?.userIdea || O.runtimeParams.userIdea, (e.script || []).join("\n"), e.character?.name || ""), characterIdentityImages = embodiedLock && e.character.entityKind !== embodiedLock.entityKind ? [] : [e.character.imageUrl, e.character.sheetUrl];
    return _t([...characterIdentityImages, ...Le.map((p) => p.source), (o = r[0]) == null ? void 0 : o.storyboardImageUrl, (d = (s = r[0]) == null ? void 0 : s.storyboardPanelUrls) == null ? void 0 : d[0], a > 0 ? (l = r[a - 1]) == null ? void 0 : l.storyboardImageUrl : void 0], 1)[0];
  }
  function kr(e, r, a, o, s = 9, d, f = []) {
    const l = [], p = /* @__PURE__ */ new Set(), h = (y, j, I, x, M) => {
      const U = y == null ? void 0 : y.trim();
      !U || p.has(U) || l.length >= s || (p.add(U), l.push({ source: U, slot: j, role: I, name: x, description: M }));
    };
    h(d, "identity", "global_identity_anchor", "\u5168\u7247\u8EAB\u4EFD\u951A\u70B9", "\u6700\u9AD8\u4F18\u5148\u7EA7\u5168\u7247\u8EAB\u4EFD\u951A\u70B9\uFF0C\u6765\u81EA\u9996\u5F20\u5DF2\u786E\u8BA4\u5206\u955C\u6216\u4E0A\u4F20\u53C2\u8003\uFF1B\u9501\u5B9A\u540C\u4E00\u540D\u4E3B\u89D2\u3001\u540C\u4E00\u5957\u670D\u88C5\u3001\u540C\u4E00\u6279\u6301\u7EED\u8D44\u4EA7\u548C\u540C\u4E00\u753B\u9762\u98CE\u683C\u3002\u540E\u7EED\u955C\u5934\u5FC5\u987B\u7EE7\u627F\uFF0C\u4E0D\u5F97\u91CD\u65B0\u9009\u89D2\u6216\u91CD\u65B0\u8BBE\u8BA1\u3002");
    const g = Array.isArray(e) ? e : [e];
    return _t(g, 3).forEach((y, j) => {
      h(y, "character", j === 0 ? "character_reference" : "character_turnaround_reference", j === 0 ? "\u89D2\u8272\u4E3B\u53C2\u8003" : "\u89D2\u8272\u4E09\u89C6\u56FE/\u670D\u88C5\u9501", j === 0 ? "\u6700\u9AD8\u4F18\u5148\u7EA7\u89D2\u8272\u8D44\u4EA7\uFF0C\u9501\u5B9A\u6027\u522B\u3001\u4E94\u5B98\u3001\u8EAB\u5F62\u3001\u670D\u88C5\u3001\u53D1\u578B\u3001\u6750\u8D28\u3001\u4E3B\u9053\u5177/\u8F7D\u5177\u548C\u526A\u5F71\uFF1B\u7981\u6B62\u6362\u4EBA\u3001\u6362\u6027\u522B\u6216\u6539\u6210\u65E0\u5173\u8FD1\u666F\u3002" : "\u89D2\u8272\u591A\u89C6\u56FE\u548C\u670D\u88C5\u8BBE\u5B9A\u8D44\u4EA7\uFF0C\u9501\u5B9A\u6B63\u9762/\u4FA7\u9762/\u80CC\u9762\u3001\u53D1\u578B\u3001\u8138\u578B\u3001\u8863\u670D\u7248\u578B\u3001\u989C\u8272\u3001\u6750\u8D28\u3001\u978B\u5C65\u548C\u914D\u4EF6\uFF1B\u53EA\u5141\u8BB8\u5F53\u524D\u5206\u955C\u6539\u53D8\u52A8\u4F5C\u548C\u673A\u4F4D\u3002");
    }), a.forEach((y, j) => {
      h(y, "storyboard", j === 0 ? "storyboard_first_frame" : "storyboard_panel", j === 0 ? "\u5206\u955C\u9996\u5E27" : `\u5206\u955C\u7247\u6BB5 ${j + 1}`, "\u53EA\u63A7\u5236\u5F53\u524D\u955C\u5934\u6784\u56FE\u3001\u673A\u4F4D\u3001\u52A8\u4F5C\u8282\u594F\u548C\u65F6\u95F4\u5207\u7247\uFF1B\u4E0D\u5F97\u8986\u76D6\u89D2\u8272\u8EAB\u4EFD\u3001\u4E3B\u8F7D\u5177\u548C\u573A\u666F\u5730\u70B9\u3002");
    }), h(o, "previous", "previous_last_frame", "\u4E0A\u4E00\u6BB5\u5C3E\u5E27", "\u7528\u4E8E\u627F\u63A5\u4E0A\u4E00\u6BB5\u59FF\u6001\u3001\u5C4F\u5E55\u65B9\u5411\u3001\u5149\u5F71\u548C\u8FD0\u52A8\u60EF\u6027\uFF0C\u4E0D\u5141\u8BB8\u6539\u5199\u89D2\u8272\u548C\u573A\u666F\u3002"), _t(Array.isArray(f) ? f : [f], 3).forEach((y, j) => {
      h(y, "prop", "prop_reference", `\u9053\u5177 / \u8F7D\u5177\u53C2\u8003 ${j + 1}`, "\u9501\u5B9A\u672C\u955C\u5934\u7684\u5173\u952E\u9053\u5177\u6216\u8F7D\u5177\u5916\u89C2\u3001\u989C\u8272\u3001\u6750\u8D28\u3001\u6BD4\u4F8B\u548C\u4E0E\u89D2\u8272\u7684\u5173\u7CFB\uFF1B\u4E0D\u5F97\u66FF\u6362\u4E3A\u5176\u4ED6\u7269\u4F53\u3002");
    }), l.sort((y, j) => ({ identity: 0, character: 1, prop: 2, storyboard: 3, previous: 4 }[y.slot] ?? 5) - ({ identity: 0, character: 1, prop: 2, storyboard: 3, previous: 4 }[j.slot] ?? 5));
  }
  function ga(e, r, a, o = "storyboard-first") {
    const s = `@\u56FE${e + 1}`;
    if (o === "direct-storyboard") return e < r ? { name: e === 0 ? `${s} \u5F53\u524D\u955C\u5934\u5173\u952E\u5E27` : `${s} \u955C\u5934\u53C2\u8003 ${e + 1}`, role: e === 0 ? "storyboard_first_frame" : "visual_reference", description: `${s} \u5C5E\u4E8E\u76F4\u63A5\u5206\u955C\u6D41\u7A0B\uFF0C\u53EA\u7528\u4E8E\u5F53\u524D\u955C\u5934\u7684\u4EBA\u7269\u3001\u5730\u70B9\u3001\u52A8\u4F5C\u3001\u6784\u56FE\u548C\u98CE\u683C\u53C2\u8003\uFF1B\u4E0D\u5F97\u62C6\u6210\u72EC\u7ACB\u7D20\u6750\u6B65\u9AA4\u3002` } : { name: `${s} \u8865\u5145\u53C2\u8003\u56FE`, role: "visual_reference", description: `${s} \u53EA\u4F5C\u4E3A\u5F53\u524D\u955C\u5934\u7684\u8865\u5145\u89C6\u89C9\u53C2\u8003\uFF0C\u4E0D\u8986\u76D6\u5267\u672C\u548C\u5355\u955C\u5934\u5206\u955C\u6587\u672C\u3002` };
    if (a === "reference") {
      if (o === "asset-first") {
        if (e === 0) return { name: `${s} \u5168\u7247\u8EAB\u4EFD\u951A\u70B9`, role: "global_identity_anchor", description: `${s} \u662F\u6700\u9AD8\u4F18\u5148\u7EA7\u5168\u7247\u8EAB\u4EFD\u951A\u70B9\uFF0C\u6765\u81EA\u9996\u5F20\u5DF2\u786E\u8BA4\u5206\u955C\u6216\u4E0A\u4F20\u53C2\u8003\uFF1B\u9501\u5B9A\u540C\u4E00\u540D\u4E3B\u89D2\u3001\u670D\u88C5\u3001\u9762\u90E8\u7279\u5F81\u3001\u6301\u7EED\u8D44\u4EA7\u3001\u753B\u9762\u98CE\u683C\u548C\u526A\u5F71\u3002\u7981\u6B62\u6362\u4EBA\u3001\u6362\u8138\u3001\u66FF\u6362\u8D44\u4EA7\u6216\u91CD\u65B0\u8BBE\u8BA1\u3002` };
        if (e === 1) return { name: `${s} \u89D2\u8272\u4EBA\u8BBE\u786C\u9501`, role: "character_reference", description: `${s} \u662F\u89D2\u8272\u8D44\u4EA7\u6216\u540C\u4E00\u8EAB\u4EFD\u8865\u5145\u53C2\u8003\uFF0C\u7EE7\u7EED\u9501\u5B9A\u6027\u522B\u3001\u4E94\u5B98\u3001\u8EAB\u5F62\u3001\u670D\u88C5\u3001\u53D1\u578B\u3001\u6750\u8D28\u3001\u4E3B\u9053\u5177\u548C\u526A\u5F71\uFF1B\u7981\u6B62\u6362\u4EBA\u3001\u6362\u6027\u522B\u6216\u6539\u6210\u65E0\u5173\u8FD1\u666F\u3002` };
        if (e === 2) return { name: `${s} \u7A7A\u73AF\u5883\u573A\u666F`, role: "visual_reference", description: `${s} \u662F\u7EAF\u7A7A\u73AF\u5883\u57FA\u5E95\uFF0C\u53EA\u9501\u5B9A\u5730\u70B9\u3001\u8DEF\u9762\u3001\u5149\u5F71\u3001\u5929\u6C14\u3001\u7A7A\u95F4\u5173\u7CFB\u3001\u5EFA\u7B51\u548C\u9053\u5177\u5E03\u666F\uFF0C\u7981\u6B62\u4ECE\u8FD9\u91CC\u751F\u6210\u65B0\u4EBA\u7269\u3002` };
        if (e >= 3 && e < 3 + r) {
          const d = e - 3;
          return { name: d === 0 ? `${s} \u5206\u955C\u9996\u5E27` : `${s} \u5206\u955C\u7247\u6BB5 ${d + 1}`, role: d === 0 ? "storyboard_first_frame" : "storyboard_panel", description: `${s} \u53EA\u63A7\u5236\u5F53\u524D\u955C\u5934\u6784\u56FE\u3001\u673A\u4F4D\u3001\u52A8\u4F5C\u8282\u594F\u548C\u65F6\u95F4\u5207\u7247\uFF1B\u4E0D\u5F97\u8986\u76D6 @\u56FE1 \u5168\u7247\u8EAB\u4EFD\u951A\u70B9\u3001@\u56FE2 \u89D2\u8272\u8EAB\u4EFD\u548C @\u56FE3 \u573A\u666F\u5730\u70B9\u3002` };
        }
        if (e === 3 + r) return { name: `${s} \u4E0A\u4E00\u6BB5\u5C3E\u5E27`, role: "previous_last_frame", description: `${s} \u7528\u4E8E\u627F\u63A5\u4E0A\u4E00\u6BB5\u59FF\u6001\u3001\u5C4F\u5E55\u65B9\u5411\u3001\u5149\u5F71\u548C\u8FD0\u52A8\u60EF\u6027\uFF0C\u4E0D\u5141\u8BB8\u6539\u5199\u89D2\u8272\u548C\u573A\u666F\u3002` };
      }
      if (e < r) return { name: e === 0 ? `${s} \u5206\u955C\u9996\u5E27` : `${s} \u5206\u955C\u7247\u6BB5 ${e + 1}`, role: e === 0 ? "storyboard_first_frame" : "storyboard_panel", description: `${s} \u53EA\u7528\u4E8E\u9501\u5B9A\u5F53\u524D\u955C\u5934\u7684\u6784\u56FE\u3001\u673A\u4F4D\u3001\u4EBA\u7269\u52A8\u4F5C\u548C\u65F6\u95F4\u5207\u7247\u8282\u594F\uFF0C\u4E0D\u5141\u8BB8\u8986\u76D6\u5168\u5C40\u573A\u666F\u548C\u89D2\u8272\u8BBE\u5B9A\u3002` };
      if (e === r) return { name: `${s} \u7A7A\u73AF\u5883\u573A\u666F`, role: "visual_reference", description: `${s} \u662F\u7EAF\u7A7A\u73AF\u5883\u57FA\u5E95\uFF0C\u53EA\u9501\u5B9A\u7A7A\u95F4\u3001\u5149\u5F71\u3001\u5929\u6C14\u3001\u5730\u8C8C\u3001\u5EFA\u7B51\u548C\u9053\u5177\u5E03\u666F\uFF0C\u7981\u6B62\u4ECE\u8FD9\u91CC\u751F\u6210\u65B0\u4EBA\u7269\u3002` };
      if (e === r + 1) return { name: `${s} \u89D2\u8272\u4EBA\u8BBE`, role: "character_reference", description: `${s} \u7528\u4E8E\u9501\u5B9A\u89D2\u8272\u4E94\u5B98\u3001\u8EAB\u5F62\u3001\u670D\u88C5\u3001\u53D1\u578B\u548C\u6750\u8D28\uFF0C\u5168\u7247\u4FDD\u6301\u4E00\u81F4\u3002` };
      if (e === r + 2) return { name: `${s} \u4E0A\u4E00\u6BB5\u5C3E\u5E27`, role: "previous_last_frame", description: `${s} \u7528\u4E8E\u627F\u63A5\u4E0A\u4E00\u6BB5\u89C6\u9891\u7684\u59FF\u6001\u3001\u5C4F\u5E55\u65B9\u5411\u3001\u5149\u5F71\u548C\u8FD0\u52A8\u60EF\u6027\u3002` };
    }
    return e === 0 ? { name: `${s} \u786E\u8BA4\u5206\u955C\u9996\u5E27`, role: a === "last-frame" ? "last_frame_image" : "storyboard_first_frame", description: `${s} \u662F\u5F53\u524D\u955C\u5934\u9996\u5E27/\u6784\u56FE\u951A\u70B9\uFF0C\u6309\u6B64\u753B\u9762\u5F00\u59CB\u52A8\u8D77\u6765\u3002` } : e === 1 ? { name: `${s} \u7A7A\u73AF\u5883\u573A\u666F`, role: "visual_reference", description: `${s} \u662F\u573A\u666F\u73AF\u5883\u57FA\u5E95\uFF0C\u53EA\u53C2\u8003\u5730\u70B9\u3001\u5149\u5F71\u3001\u5929\u6C14\u3001\u7A7A\u95F4\u5173\u7CFB\u548C\u5E03\u666F\u3002` } : e === 2 ? { name: `${s} \u89D2\u8272\u4EBA\u8BBE`, role: "character_reference", description: `${s} \u7528\u4E8E\u9501\u5B9A\u4EBA\u7269\u8EAB\u4EFD\u3001\u8138\u3001\u670D\u88C5\u548C\u6BD4\u4F8B\u3002` } : e === 3 ? { name: `${s} \u4E0A\u4E00\u6BB5\u5C3E\u5E27`, role: "previous_last_frame", description: `${s} \u7528\u4E8E\u52A8\u4F5C\u548C\u955C\u5934\u8FDE\u7EED\u627F\u63A5\u3002` } : { name: `${s} \u53C2\u8003\u7D20\u6750`, role: "reference_image", description: `${s} \u4EC5\u4F5C\u4E3A\u8865\u5145\u53C2\u8003\uFF0C\u4E0D\u5F97\u8986\u76D6\u573A\u666F\u3001\u89D2\u8272\u548C\u5206\u955C\u4E3B\u7EA6\u675F\u3002` };
  }
  function ns(e, r, a, o = 0, s = "storyboard-first", d = []) {
    if (e <= 0 && o <= 0) return "";
    if (s === "direct-storyboard") {
      const h = Array.from({ length: e }, (y, j) => {
        const I = ga(j, r, a, s), x = d[j];
        return `${(x == null ? void 0 : x.name) || I.name}\uFF1A${(x == null ? void 0 : x.description) || I.description}`;
      }), g = Array.from({ length: o }, (y, j) => `${`@\u89C6\u9891${j + 1}`} \u4E0A\u4E00\u6BB5\u89C6\u9891\uFF1A\u53EA\u53C2\u8003\u52A8\u4F5C\u8282\u594F\u3001\u955C\u5934\u60EF\u6027\u3001\u5C4F\u5E55\u65B9\u5411\u3001\u5149\u5F71\u5EF6\u7EED\u548C\u8854\u63A5\u65B9\u5F0F\uFF0C\u4E0D\u5141\u8BB8\u6539\u5199\u5F53\u524D\u955C\u5934\u7684\u4EBA\u7269\u4E0E\u6545\u4E8B\u5730\u70B9\u3002`);
      return ["OiiOii \u76F4\u63A5\u5206\u955C\u53C2\u8003\u89C4\u5219\uFF1A", ...h, ...g, "\u672C\u6D41\u7A0B\u4EE5\u5355\u955C\u5934\u5206\u955C\u6587\u672C\u4E3A\u552F\u4E00\u4E8B\u5B9E\u6E90\uFF1A\u6BCF\u4E2A\u955C\u5934\u5DF2\u7ECF\u540C\u65F6\u5305\u542B\u5730\u70B9\u3001\u4EBA\u7269\u3001\u52A8\u4F5C\u3001\u666F\u522B\u3001\u673A\u4F4D\u548C\u8FD0\u955C\u3002", "\u5982\u679C\u53C2\u8003\u56FE\u548C\u6587\u5B57\u51B2\u7A81\uFF0C\u4F18\u5148\u6267\u884C\u5DF2\u786E\u8BA4\u5267\u672C\u548C\u5F53\u524D\u5355\u955C\u5934\u5206\u955C\u6587\u672C\uFF1B\u53C2\u8003\u56FE\u53EA\u5E2E\u52A9\u7A33\u5B9A\u753B\u9762\uFF0C\u4E0D\u5141\u8BB8\u628A\u4EBA\u7269\u6362\u6027\u522B\u3001\u6362\u8EAB\u4EFD\u3001\u6362\u98CE\u683C\u6216\u5207\u5230\u65E0\u5173\u573A\u666F\u3002"].join(`
`);
    }
    const l = Array.from({ length: e }, (h, g) => {
      const y = ga(g, r, a, s), j = d[g];
      return `${(j == null ? void 0 : j.name) || y.name}\uFF1A${(j == null ? void 0 : j.description) || y.description}`;
    }), p = Array.from({ length: o }, (h, g) => `${`@\u89C6\u9891${g + 1}`} \u4E0A\u4E00\u6BB5\u89C6\u9891\uFF1A\u53EA\u53C2\u8003\u52A8\u4F5C\u8282\u594F\u3001\u955C\u5934\u60EF\u6027\u3001\u5C4F\u5E55\u65B9\u5411\u3001\u5149\u5F71\u5EF6\u7EED\u548C\u8854\u63A5\u65B9\u5F0F\uFF0C\u4E0D\u5141\u8BB8\u6539\u5199\u89D2\u8272\u8EAB\u4EFD\u3001\u573A\u666F\u5730\u70B9\u6216\u753B\u9762\u98CE\u683C\u3002`);
    return ["Seedance 2.0 \u5168\u80FD\u53C2\u8003\u7D20\u6750\u7ED1\u5B9A\u89C4\u5219\uFF1A", ...l, ...p, "\u8BF7\u5728\u5168\u80FD\u53C2\u8003\u6A21\u5F0F\u4E0B\u6309 @\u56FE1\u3001@\u56FE2\u3001@\u56FE3\u3001@\u89C6\u98911 \u7684\u7D20\u6750\u540D\u7406\u89E3\u6BCF\u4E2A\u7D20\u6750\u7684\u7528\u9014\uFF0C\u4E0D\u8981\u628A\u4E0D\u540C\u7C7B\u578B\u7D20\u6750\u6DF7\u7528\u3002", s === "asset-first" ? "\u53C2\u8003\u4F18\u5148\u7EA7\uFF1A\u5168\u7247\u8EAB\u4EFD\u951A\u70B9 > \u89D2\u8272\u4E3B\u53C2\u8003/\u4E09\u89C6\u56FE\u670D\u88C5\u9501 > \u7A7A\u73AF\u5883\u573A\u666F > \u5F53\u524D\u5206\u955C\u7247\u6BB5/\u9996\u5E27 > \u4E0A\u4E00\u6BB5\u5C3E\u5E27\u3002\u8BF7\u6309\u6BCF\u5F20\u56FE\u7684 role/name \u8BFB\u53D6\u7528\u9014\uFF0C\u4E0D\u8981\u7528\u56FA\u5B9A\u5E8F\u53F7\u731C\u7528\u9014\uFF1B\u5206\u955C\u53EA\u63A7\u5236\u6784\u56FE\u3001\u52A8\u4F5C\u548C\u8FD0\u955C\uFF0C\u4E0D\u5F97\u6539\u5199\u89D2\u8272\u6027\u522B\u3001\u8138\u3001\u670D\u88C5\u3001\u4E3B\u9053\u5177\u6216\u573A\u666F\u5730\u70B9\u3002" : "\u53C2\u8003\u4F18\u5148\u7EA7\uFF1A\u7A7A\u73AF\u5883\u573A\u666F > \u89D2\u8272\u4EBA\u8BBE > \u5F53\u524D\u5206\u955C\u7247\u6BB5/\u9996\u5E27 > \u4E0A\u4E00\u6BB5\u5C3E\u5E27\uFF1B\u5206\u955C\u53EA\u63A7\u5236\u6784\u56FE\u3001\u52A8\u4F5C\u548C\u8FD0\u955C\uFF0C\u4E0D\u5F97\u6539\u5199\u573A\u666F\u4E0E\u89D2\u8272\u3002", "\u5982\u679C\u53C2\u8003\u56FE\u4E4B\u95F4\u51B2\u7A81\uFF0C\u4F18\u5148\u4FDD\u6301\u573A\u666F\u5730\u70B9\u548C\u89D2\u8272\u8EAB\u4EFD\u4E0D\u53D8\uFF0C\u518D\u6267\u884C\u5F53\u524D\u5206\u955C\u52A8\u4F5C\u3002", "\u5982\u679C\u5305\u542B\u4E0A\u4E00\u6BB5\u89C6\u9891\u6216\u5C3E\u5E27\uFF0C\u5FC5\u987B\u627F\u63A5\u4E0A\u4E00\u6BB5\u7684\u52A8\u4F5C\u65B9\u5411\u3001\u955C\u5934\u60EF\u6027\u3001\u5149\u5F71\u548C\u59FF\u6001\uFF0C\u5F62\u6210\u8FDE\u7EED\u955C\u5934\u3002"].join(`
`);
  }
  async function as(e, r) {
    var h, g;
    const a = e.imageUrl || e.sheetUrl;
    if (!a) {
      m("\u8FD9\u4E2A\u89D2\u8272\u8FD8\u6CA1\u6709\u8FD4\u56DE\u56FE\u7247\uFF0C\u7B49\u56FE\u7247\u751F\u6210\u6210\u529F\u540E\u624D\u80FD\u52A0\u5165\u7D20\u6750\u5E93\u3002");
      return;
    }
    const o = /^https?:\/\//i.test(a), s = a.startsWith("data:"), d = ((h = e.name) == null ? void 0 : h.trim()) || "\u89D2\u8272\u8D44\u4EA7", l = { id: `page1-character-${crypto.randomUUID()}`, kind: "generated", name: d, source: a, localPath: !o && !s ? a : void 0, dataUrl: s ? a : void 0, mimeType: s && a.includes(";") ? a.slice(5, a.indexOf(";")) : "image/png", role: "character-lock", category: "\u89D2\u8272", x: 260 + E.length * 18, y: 240 + E.length * 12, width: 260, height: 340, lockedCharacterId: d };
    Ce({ ...l, id: `library-${crypto.randomUUID()}`, x: -9999, y: -9999, dataUrl: l.dataUrl ?? (s ? a : void 0) });
    const p = await ((g = window.jiaren) == null ? void 0 : g.system.addResource({ kind: "image", name: d, category: "\u89D2\u8272\u8D44\u4EA7", tags: ["Page1", "\u89D2\u8272", "AI\u7535\u5F71"], source: a, localPath: l.localPath, dataUrl: l.localPath ? void 0 : l.dataUrl, mimeType: l.mimeType, metadata: { page1NodeId: r.id, agent: r.agent, role: "character-lock", characterName: d, appearance: e.appearance, description: e.description, prompt: e.prompt, imageUrl: e.imageUrl, sheetUrl: e.sheetUrl } }));
    window.dispatchEvent(new CustomEvent("jiaren-resource-library-refresh")), C({ resourceLibraryOpen: true }), m(p != null && p.ok ? `\u5DF2\u628A\u300C${d}\u300D\u52A0\u5165\u8F6F\u4EF6\u7D20\u6750\u5E93\uFF0C\u5E76\u540C\u6B65\u4E3A\u89D2\u8272\u9501\u5B9A\u8D44\u4EA7\u3002` : (p == null ? void 0 : p.message) || "\u5DF2\u540C\u6B65\u5230\u5F53\u524D\u7D20\u6750\u96C6\u5408\uFF0C\u4F46\u5199\u5165\u672C\u5730\u7D20\u6750\u5E93\u5931\u8D25\u3002");
  }
  async function is(e, r) {
    var h, g;
    const a = e.imageUrl;
    if (!a) {
      m("\u8FD9\u4E2A\u573A\u666F\u8FD8\u6CA1\u6709\u8FD4\u56DE\u7A7A\u73AF\u5883\u56FE\uFF0C\u7B49\u56FE\u7247\u751F\u6210\u6210\u529F\u540E\u624D\u80FD\u52A0\u5165\u7D20\u6750\u5E93\u3002");
      return;
    }
    const o = /^https?:\/\//i.test(a), s = a.startsWith("data:"), d = ((h = e.title) == null ? void 0 : h.trim()) || "\u573A\u666F\u7A7A\u73AF\u5883\u8D44\u4EA7", l = { id: `page1-scene-${crypto.randomUUID()}`, kind: "generated", name: d, source: a, localPath: !o && !s ? a : void 0, dataUrl: s ? a : void 0, mimeType: s && a.includes(";") ? a.slice(5, a.indexOf(";")) : "image/png", role: "asset-library", category: "\u573A\u666F", x: 300 + E.length * 18, y: 260 + E.length * 12, width: 360, height: 220 };
    Ce({ ...l, id: `library-scene-${crypto.randomUUID()}`, x: -9999, y: -9999, dataUrl: l.dataUrl ?? (s ? a : void 0) });
    const p = await ((g = window.jiaren) == null ? void 0 : g.system.addResource({ kind: "image", name: d, category: "\u573A\u666F\u8D44\u4EA7", tags: ["Page1", "\u573A\u666F", "\u7A7A\u73AF\u5883", "AI\u7535\u5F71"], source: a, localPath: l.localPath, dataUrl: l.localPath ? void 0 : l.dataUrl, mimeType: l.mimeType, metadata: { page1NodeId: r.id, agent: r.agent, role: "empty-scene-plate", title: e.title, description: e.description, environment: e.environment, setDressing: e.setDressing, lighting: e.lighting, terrain: e.terrain, spatialFraming: e.spatialFraming, camera: e.camera, imageUrl: e.imageUrl, angleGridUrl: void 0 } }));
    window.dispatchEvent(new CustomEvent("jiaren-resource-library-refresh")), C({ resourceLibraryOpen: true }), m(p != null && p.ok ? `\u5DF2\u628A\u300C${d}\u300D\u52A0\u5165\u8F6F\u4EF6\u573A\u666F\u7D20\u6750\u5E93\u3002` : (p == null ? void 0 : p.message) || "\u5DF2\u540C\u6B65\u5230\u5F53\u524D\u7D20\u6750\u96C6\u5408\uFF0C\u4F46\u5199\u5165\u672C\u5730\u7D20\u6750\u5E93\u5931\u8D25\u3002");
  }
  function ni(e, r, a) {
    const o = (s) => s.name !== r ? s : { ...s, ...a };
    kt((s) => s.map((d) => {
      var l;
      return d.id === e && d.step === "character" ? { ...d, payload: { ...d.payload, character: o(d.payload.character), characters: (l = d.payload.characters) == null ? void 0 : l.map(o) } } : d;
    }));
  }
  async function rs(e, r) {
    var d;
    const a = await ((d = window.jiaren) == null ? void 0 : d.system.selectFiles({ kind: "image", cacheDir: F.cacheDir })), o = a && !a.canceled ? a.assets[0] : void 0, s = (o == null ? void 0 : o.dataUrl) || (o == null ? void 0 : o.localPath);
    if (!o || !s) {
      m("\u6CA1\u6709\u9009\u62E9\u89D2\u8272\u56FE\u7247\u3002");
      return;
    }
    ni(r.id, e.name, { imageUrl: s, prompt: e.prompt || `\u7528\u6237\u4E0A\u4F20\u7684 ${e.name} \u89D2\u8272\u7ACB\u7ED8` }), Gn((l) => [...l, { id: o.id, name: `${e.name} \u4E0A\u4F20\u7ACB\u7ED8`, source: s, dataUrl: o.dataUrl, localPath: o.localPath, mimeType: o.mimeType }].slice(0, 8)), m(`\u5DF2\u628A\u300C${e.name}\u300D\u7684\u4E0A\u4F20\u7ACB\u7ED8\u7ED1\u5B9A\u5230\u89D2\u8272\u5361\uFF1B\u5206\u955C\u548C\u89C6\u9891\u4F1A\u76F4\u63A5\u7EE7\u627F\u5B83\u3002`);
  }
  function os(e, r) {
    var d;
    const a = ln.nano;
    a && zn(a.id);
    const source = r.payload.originalSource || r.payload.sourceText || r.payload.sourceIdea || O.runtimeParams.userIdea, embodiedLock = JiarenDetectEmbodiedProtagonistAsset(source, r.payload.script.join(`
`), e.name), o = embodiedLock ? embodiedLock.appearance : We(e.name, e.appearance, e.description, source, r.payload.script.join(`
`), (d = r.payload.styleLock) == null ? void 0 : d.label), s = embodiedLock ? O.adapter.wrapImagePrompt([embodiedLock.imagePrompt, `Regenerate the protagonist identity asset named ${e.name}.`, "Use only the current non-human visible form. Do not use or imitate any stale human portrait."].join(`
`), "embodied protagonist identity asset", r.payload.styleLock) : [`\u91CD\u65B0\u751F\u6210\u89D2\u8272\u300C${e.name}\u300D\u7684\u5168\u8EAB\u7ACB\u7ED8\u3002`, $(e.prompt || o || e.description, 720), "\u4FDD\u6301\u5F53\u524D\u6545\u4E8B\u98CE\u683C\u3001\u89D2\u8272\u8EAB\u4EFD\u3001\u5E74\u9F84\u6C14\u8D28\u3001\u670D\u88C5 DNA\u3001\u8138\u578B\u6BD4\u4F8B\u548C\u8BC6\u522B\u8272\uFF1B\u4E0D\u8981\u6539\u540D\uFF0C\u4E0D\u8981\u6539\u79CD\u65CF\uFF0C\u4E0D\u8981\u5207\u6362\u6210 Q \u7248\u6216\u6F2B\u753B\u98CE\uFF1B\u8F93\u51FA\u6B63\u9762\u5168\u8EAB\u89D2\u8272\u8D44\u4EA7\u56FE\uFF0C\u5E72\u51C0\u80CC\u666F\uFF0C\u9002\u5408\u4F5C\u4E3A\u540E\u7EED\u5206\u955C\u548C\u89C6\u9891\u53C2\u8003\u3002"].filter(Boolean).join(`
`), keepExistingReference = !embodiedLock || e.entityKind === embodiedLock.entityKind;
    bt({ nodeId: r.id, characterName: e.name, entityKind: (embodiedLock == null ? void 0 : embodiedLock.entityKind) || e.entityKind, formId: (embodiedLock == null ? void 0 : embodiedLock.formId) || e.formId, prompt: s, references: keepExistingReference ? [e.imageUrl].filter((l) => !!l) : [], referenceNames: keepExistingReference && e.imageUrl ? ["\u5F53\u524D\u89D2\u8272\u56FE"] : [], running: false }), m(embodiedLock && !keepExistingReference ? "\u5DF2\u6253\u5F00\u5F53\u524D\u5F62\u6001\u91CD\u65B0\u751F\u6210\u9762\u677F\uFF1B\u5DF2\u6392\u9664\u4E0E\u539F\u6587\u51B2\u7A81\u7684\u65E7\u4EBA\u5F62\u56FE\u3002" : "\u5DF2\u6253\u5F00\u89D2\u8272\u91CD\u751F\u6210\u9762\u677F\uFF0C\u53EF\u4EE5\u4FEE\u6539\u63D0\u793A\u8BCD\u6216\u4E0A\u4F20\u53C2\u8003\u56FE\u3002");
  }
  async function ss() {
    var a;
    const e = await ((a = window.jiaren) == null ? void 0 : a.system.selectFiles({ kind: "image", cacheDir: F.cacheDir })), r = e && !e.canceled ? e.assets : [];
    if (!r.length) {
      m("\u6CA1\u6709\u9009\u62E9\u53C2\u8003\u56FE\u3002");
      return;
    }
    bt((o) => {
      if (!o) return o;
      const s = [...o.references], d = [...o.referenceNames];
      return r.forEach((l) => {
        const p = l.dataUrl || l.localPath;
        p && (s.push(p), d.push(l.name || `\u53C2\u8003\u56FE ${d.length + 1}`));
      }), { ...o, references: _t(s, 4), referenceNames: d.slice(0, 4), message: "\u53C2\u8003\u56FE\u5DF2\u52A0\u5165\uFF0C\u4EC5\u7528\u4E8E\u672C\u6B21\u89D2\u8272\u91CD\u751F\u6210\u3002" };
    });
  }
  async function cs() {
    var o;
    const e = Ge;
    if (!e || e.running) return;
    const r = Oe.find((s) => s.id === e.nodeId && s.step === "character"), a = ((o = r == null ? void 0 : r.payload.characters) == null ? void 0 : o.find((s) => s.name === e.characterName)) ?? ((r == null ? void 0 : r.payload.character.name) === e.characterName ? r.payload.character : void 0), source = (r == null ? void 0 : r.payload.originalSource) || (r == null ? void 0 : r.payload.sourceText) || (r == null ? void 0 : r.payload.sourceIdea) || O.runtimeParams.userIdea, embodiedLock = JiarenDetectEmbodiedProtagonistAsset(source, (r == null ? void 0 : r.payload.script.join(`
`)) || "", e.characterName), isEmbodied = !!(e.entityKind || embodiedLock);
    if (!r || !a) {
      bt((s) => s && { ...s, message: "\u6CA1\u6709\u627E\u5230\u8FD9\u4E2A\u89D2\u8272\u5361\uFF0C\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5\u3002" });
      return;
    }
    if (!e.prompt.trim()) {
      bt((s) => s && { ...s, message: "\u8BF7\u5148\u586B\u5199\u89D2\u8272\u751F\u6210\u63D0\u793A\u8BCD\u3002" });
      return;
    }
    bt((s) => s && { ...s, running: true, message: "\u6B63\u5728\u751F\u6210\u89D2\u8272\u56FE\uFF0C\u8BF7\u7B49\u5F85\u7ED3\u679C\u8FD4\u56DE\u3002" }), ke("character", { phase: "running", message: `\u6B63\u5728\u91CD\u65B0\u751F\u6210\u300C${e.characterName}\u300D\u89D2\u8272\u7ACB\u7ED8\uFF0C\u8FD4\u56DE\u540E\u4F1A\u76F4\u63A5\u66F4\u65B0\u5F53\u524D\u89D2\u8272\u5361\u3002` });
    try {
      const s = await xt($(e.prompt, 1200), isEmbodied ? "1:1" : "3:4", e.references, { includeWorkbenchReferences: false }), d = Re(s.asset);
      if (!d) throw new Error("\u89D2\u8272\u56FE\u7247\u751F\u6210\u6210\u529F\u4F46\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u56FE\u7247\u5730\u5740\u3002");
      const l = O.adapter.wrapImagePrompt(isEmbodied ? [(embodiedLock == null ? void 0 : embodiedLock.sheetPrompt) || e.prompt, "Orthographic identity sheet of the exact same non-human protagonist form. Preserve silhouette, proportions, surface, color and scale. No human, no humanoid conversion, no face, no hair, no clothing, no limbs, no weapon, no alternate design."] .join(`
`) : [e.prompt, "Create a reusable character turnaround and outfit lock sheet: front view, side view, back view, full body, same face, same gender, same hairstyle, same outfit, same colors, same shoes, same accessories and material details. Neutral clean background. One character only, no alternate costume, no second person, no scene background."].join(`
`), isEmbodied ? "embodied protagonist orthographic sheet" : "character turnaround sheet", Ya().styleLock), p = await xt($(l, 1400), "16:9", [d], { includeWorkbenchReferences: false });
      ni(r.id, e.characterName, { imageUrl: d, sheetUrl: Re(p.asset), prompt: e.prompt, entityKind: (embodiedLock == null ? void 0 : embodiedLock.entityKind) || e.entityKind, formId: (embodiedLock == null ? void 0 : embodiedLock.formId) || e.formId, appearance: (embodiedLock == null ? void 0 : embodiedLock.appearance) || a.appearance, description: (embodiedLock == null ? void 0 : embodiedLock.description) || a.description }), ke("character", { phase: "ready", message: "\u89D2\u8272\u56FE\u5DF2\u91CD\u65B0\u751F\u6210\uFF0C\u7B49\u5F85\u786E\u8BA4\u63A8\u8FDB\u3002" }), bt(void 0), m(`\u300C${e.characterName}\u300D\u5DF2\u91CD\u65B0\u751F\u6210\uFF0C\u5E76\u66F4\u65B0\u5230\u5F53\u524D\u89D2\u8272\u5361\u3002`);
    } catch (s) {
      const d = ti(s);
      ke("character", { phase: "failed", message: `\u89D2\u8272\u91CD\u751F\u6210\u5931\u8D25\uFF1A${d}` }), bt((l) => l && { ...l, running: false, message: d }), m(`\u89D2\u8272\u91CD\u751F\u6210\u5931\u8D25\uFF1A${d}`);
    }
  }
  async function ls(e, r) {
    var l, p;
    const a = await ((l = window.jiaren) == null ? void 0 : l.system.selectFiles({ kind: "audio", cacheDir: F.cacheDir })), o = a && !a.canceled ? a.assets[0] : void 0, s = (o == null ? void 0 : o.localPath) || (o == null ? void 0 : o.dataUrl);
    if (!o || !s) {
      m("\u6CA1\u6709\u9009\u62E9\u97F3\u8272\u6587\u4EF6\u3002");
      return;
    }
    ni(r.id, e.name, { voiceUrl: s, voiceName: o.name || `${e.name} \u97F3\u8272` });
    const d = await ((p = window.jiaren) == null ? void 0 : p.system.addResource({ kind: "audio", name: `${e.name} \u97F3\u8272`, category: "\u89D2\u8272\u97F3\u8272", tags: ["Page1", "\u89D2\u8272", "\u97F3\u8272", "AI\u7535\u5F71"], source: s, localPath: o.localPath, dataUrl: o.localPath ? void 0 : o.dataUrl, mimeType: o.mimeType, metadata: { page1NodeId: r.id, agent: r.agent, role: "character-voice", characterName: e.name, fileName: o.name } }));
    window.dispatchEvent(new CustomEvent("jiaren-resource-library-refresh")), m(d != null && d.ok ? `\u5DF2\u628A\u300C${e.name}\u300D\u7684\u97F3\u8272\u6837\u672C\u52A0\u5165\u7D20\u6750\u5E93\u3002` : (d == null ? void 0 : d.message) || "\u97F3\u8272\u5DF2\u7ED1\u5B9A\u5230\u89D2\u8272\u5361\uFF0C\u4F46\u5199\u5165\u7D20\u6750\u5E93\u5931\u8D25\u3002");
  }
  function _t(e, r = 6) {
    const a = /* @__PURE__ */ new Set(), o = [];
    for (const s of e) {
      const d = s == null ? void 0 : s.trim();
      if (!(!d || a.has(d)) && (a.add(d), o.push(d), o.length >= r)) break;
    }
    return o;
  }
  function ds(e) {
    return Xc(e);
  }
  function ps(e) {
    const r = Ll[e];
    return [`Jiaren Production Manifest\uFF1A${Xt.name} v${Xt.version}`, `\u6A21\u578B\u7B56\u7565\uFF1A\u6587\u5B57=${Xt.modelPolicy.text}\uFF1B\u89D2\u8272/\u5206\u955C\u56FE=${Xt.modelPolicy.characterImage.join(" + ")}\uFF1B\u89C6\u9891=${Xt.modelPolicy.video.join(" / ")}\uFF1B\u97F3\u4E50=${Xt.modelPolicy.music}`, `Manifest \u9636\u6BB5\u5951\u7EA6\uFF1A
${el(e)}`, `\u9636\u6BB5\u89D2\u8272\uFF1A${r.productionRole}`, `\u6A21\u578B\u8DEF\u7531\uFF1A${r.modelRoute}`, `\u539F\u521B\u6280\u80FD\u5305\u89C4\u6A21\uFF1A${r.skillCount} \u9879`, `\u9636\u6BB5\u5951\u7EA6\uFF1A${r.stageContract}`, `\u6280\u80FD\u65CF\uFF1A${r.skillFamilies.join(" / ")}`, `\u8D28\u68C0\u95E8\uFF1A${r.qualityGates.join("\uFF1B")}`, `\u4EA4\u63A5\u5951\u7EA6\uFF1A${r.handoffContract}`].join(`
`);
  }
  function us() {
    var a;
    const e = Ya(), r = We(e.character.name, e.character.appearance, e.character.description, O.runtimeParams.userIdea, e.script.join(`
`), (a = e.styleLock) == null ? void 0 : a.label);
    return [`\u827A\u672F\u603B\u76D1\u5168\u5C40\u53C2\u6570\u6811\uFF1A
${O.adapter.contextBlock()}`, `\u5F71\u7247\u53C2\u6570\uFF1A${e.brief}`, e.script.length ? `\u5DF2\u786E\u8BA4\u5267\u672C\uFF1A
${e.script.join(`
`)}` : "", (e.character.appearance || e.character.imageUrl) && r ? `\u5DF2\u786E\u8BA4\u89D2\u8272\u8840\u7EDF appearance\uFF1A${r}` : "", e.character.imageUrl ? `\u89D2\u8272\u53C2\u8003\u56FE URL\uFF1A${e.character.imageUrl}` : "", e.character.sheetUrl ? `\u89D2\u8272\u4E09\u89C6\u56FE URL\uFF1A${e.character.sheetUrl}` : "", e.productionBeats?.length ? `\u5267\u672C\u5730\u70B9\u8FDE\u7EED\u6027\u4E8B\u5B9E\uFF1A${JSON.stringify(JiarenBuildScriptSettingManifest(e.productionBeats, e.script))}` : "", e.shots.length ? `\u5DF2\u786E\u8BA4\u5206\u955C\uFF1A
${e.shots.map((o) => `${o.title} ${o.timecode}: ${o.prompt}${o.videoUrl ? ` / ${o.videoUrl}` : ""}`).join(`
`)}` : "", e.audio.music || e.audio.sfx ? `\u5DF2\u786E\u8BA4\u97F3\u9891\u65B9\u6848\uFF1A${e.audio.music} / ${e.audio.sfx}` : ""].filter(Boolean).join(`

`);
  }
  async function Rn(e, r, a = {}) {
    var l, p;
    const o = [ra, ln.chat, He(st, [/claude.*opus.*4/i]), He(st, [/qwen3[-_.]?max/i]), He(st, [/gemini.*thinking|gemini.*3\.5/i]), He(st, [/gpt[-_.]?5\.?5|gpt[-_.]?5\.?4/i]), He(st, [/deepseek.*v3|grok-4/i]), ...st].filter((h) => !!(h && h.category === "chat")).filter((h, g, y) => y.findIndex((j) => j.id === h.id) === g);
    if (o.length === 0) throw new Error("\u6CA1\u6709\u53EF\u7528\u7684\u6587\u5B57\u63A8\u7406\u6A21\u578B\uFF0C\u8BF7\u5148\u5728 API \u8BBE\u7F6E\u91CC\u542F\u7528\u4E00\u4E2A\u53EF\u7528\u7684\u63A8\u7406\u6A21\u578B\u3002");
    const s = [Tl[e], "\u4F60\u5FC5\u987B\u4E25\u683C\u8F93\u51FA JSON\uFF0C\u4E0D\u8981\u8F93\u51FA markdown\uFF0C\u4E0D\u8981\u89E3\u91CA\u3002", "\u4E0D\u8981\u590D\u5236\u4EFB\u4F55\u7B2C\u4E09\u65B9\u9879\u76EE\u7684\u63D0\u793A\u8BCD\u539F\u6587\uFF1B\u53EA\u80FD\u4F7F\u7528\u539F\u521B\u8868\u8FBE\u3002", "\u4F60\u6B63\u5728\u6A21\u62DF\u4E13\u4E1A\u5236\u7247\u7CFB\u7EDF\u7684\u5DE5\u4F5C\u65B9\u5F0F\uFF1A\u9636\u6BB5\u5BFC\u6F14 -> \u5DE5\u5177\u8DEF\u7531 -> \u7ED3\u6784\u5316\u4EA7\u7269 -> \u81EA\u68C0 -> \u7B49\u5F85\u7528\u6237\u786E\u8BA4\uFF1B\u7981\u6B62\u4E00\u6B21\u6027\u8D8A\u7EA7\u751F\u6210\u540E\u7EED\u6240\u6709\u5185\u5BB9\u3002", "\u6BCF\u4E2A\u9636\u6BB5\u5FC5\u987B\u628A\u4E0A\u6E38\u5DF2\u786E\u8BA4\u7684\u8D44\u4EA7\u6309\u804C\u8D23\u6253\u5305\u8FDB\u5F53\u524D\u4E0A\u4E0B\u6587\uFF1A\u573A\u666F\u53EA\u4F7F\u7528\u5267\u672C\u5730\u70B9/\u65F6\u95F4/\u5E03\u666F\u6765\u751F\u6210\u7A7A\u73AF\u5883\uFF1B\u89D2\u8272 appearance \u53EA\u4EA4\u7ED9\u5206\u955C\u548C\u89C6\u9891\u9636\u6BB5\u7EE7\u627F\u3002", "\u827A\u672F\u603B\u76D1\u662F\u5168\u94FE\u8DEF\u9700\u6C42\u7EDF\u8BA1\u8005\u548C\u53C2\u6570\u4E0B\u53D1\u8005\u3002\u540E\u7EED\u7F16\u5267\u3001\u89D2\u8272\u3001\u5206\u955C\u3001\u97F3\u6548 Agent \u5FC5\u987B\u65E0\u635F\u7EE7\u627F GlobalStudioConfig.runtimeParams \u7684\u8BED\u8A00\u3001\u753B\u5E45\u3001\u60C5\u7EEA\u3001\u65F6\u957F\uFF0C\u5E76\u7B49\u5F85\u603B\u5BFC\u6F14\u786E\u8BA4\u3002", "\u753B\u5E03\u8282\u70B9\u963B\u65AD\u89C4\u5219\uFF1A\u53EA\u6709\u5F53\u524D\u9636\u6BB5 API \u6210\u529F\u8FD4\u56DE\u3001JSON \u53EF\u89E3\u6790\u3001\u5FC5\u8981\u5A92\u4F53\u8D44\u4EA7\u771F\u5B9E\u5B58\u5728\u65F6\uFF0C\u624D\u5141\u8BB8\u8FFD\u52A0\u753B\u5E03\u8282\u70B9\uFF1B\u5931\u8D25\u65F6\u53EA\u5728\u5DE6\u4FA7\u7FA4\u804A\u63D0\u793A\uFF0C\u4E0D\u521B\u5EFA\u7A7A\u767D\u8282\u70B9\u3002", "OpenMontage-like \u53C2\u8003\u53EA\u7528\u4E8E\u751F\u4EA7\u65B9\u6CD5\u8BBA\uFF1A\u6280\u80FD\u7D22\u5F15\u3001\u9636\u6BB5\u5951\u7EA6\u3001\u5DE5\u5177\u8DEF\u7531\u3001\u5BA1\u6838\u95F8\u95E8\u548C checkpoint\u3002\u4E0D\u5F97\u7167\u642C\u4EFB\u4F55\u7B2C\u4E09\u65B9\u63D0\u793A\u8BCD\u539F\u6587\u3002", `\u5168\u5C40 Manifest \u89C4\u5219\uFF1A
${Xt.stageRules.join(`
`)}`, `GlobalStudioConfig:
${O.adapter.contextBlock()}`, `\u5F53\u524D Agent \u84DD\u56FE\uFF1A
${ps(e)}`, `\u5185\u90E8\u6280\u80FD\u8DEF\u7531\u77E9\u9635\uFF1A
${ds(e)}`, `\u5DF2\u786E\u8BA4\u4E0A\u6E38\u4E0A\u4E0B\u6587\uFF1A
${a.contextOverride ?? (us() || "\u6682\u65E0\uFF0C\u5F53\u524D\u4E3A\u7B2C\u4E00\u9636\u6BB5\u3002")}`].join(`

`), d = [];
    for (const h of o) {
      const g = Fn(R, h.id), y = Ft(h, h.endpointModelId || h.modelId || h.alias || "\u6587\u5B57\u6A21\u578B");
      if (!g.baseUrl || !g.apiKey) {
        d.push(`${y}: API \u914D\u7F6E\u4E0D\u5B8C\u6574`);
        continue;
      }
      const j = a.includeReferences === false ? [] : Le.map((x) => ({ name: x.name, localPath: x.localPath, dataUrl: x.dataUrl, url: /^https?:\/\//i.test(x.source) ? x.source : void 0, mimeType: x.mimeType })), I = (x) => Gt.chat({ modelId: h.id, endpointModelId: h.endpointModelId, fallbackEndpointModelId: h.fallbackEndpointModelId, requestMode: h.requestMode, apiGroup: h.apiGroup, baseUrl: g.baseUrl, apiKey: g.apiKey, fallbackBaseUrl: g.fallbackBaseUrl, fallbackApiKey: g.fallbackApiKey, messages: [{ role: "system", content: s }, { role: "user", content: r }], temperature: e === "script" ? 0.35 : 0.45, topP: e === "script" ? 0.6 : 0.8, maxTokens: e === "script" ? 12e3 : 5e3, responseFormat: "json_object", images: x ? j : [] });
      try {
        let x = await I(j.length > 0);
        if (!x.ok && j.length > 0 && /上传参考图失败|reference|upload|fetch failed|network|连接中断|网络/i.test(x.message || "")) {
          const M = await I(false);
          x = M.ok || (l = M.content) != null && l.trim() ? M : { ...M, message: `${x.message || "\u53C2\u8003\u56FE\u4E0A\u4F20\u5931\u8D25"}\uFF1B\u5DF2\u81EA\u52A8\u53BB\u6389\u53C2\u8003\u56FE\u91CD\u8BD5\uFF1A${M.message || "\u4ECD\u5931\u8D25"}` };
        }
        if (x.ok && ((p = x.content) != null && p.trim())) return x.content;
        d.push(`${y}: ${x.message || "\u6587\u5B57\u6A21\u578B\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u5185\u5BB9"}`);
      } catch (x) {
        d.push(`${y}: ${x instanceof Error ? x.message : "\u6587\u5B57\u6A21\u578B\u8BF7\u6C42\u5931\u8D25"}`);
      }
    }
    throw new Error(d.filter(Boolean).join("\uFF1B") || "\u6587\u5B57\u6A21\u578B\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u5185\u5BB9\u3002");
  }
  async function xt(e, r, a = [], o = {}) {
    const s = en(R.models, R, Nt) ?? mo(R.models), d = en(R.models, R, (y) => {
      const j = [Qe(y), y.id, y.alias, y.modelId, y.endpointModelId].filter(Boolean).join(" ");
      return y.category === "image" && /gemini-3\.1-flash-image-preview-4k|nano[-_]?banana[-_]?2/i.test(j);
    }) ?? Gl(R.models), h = (o.strictGptImage2 ? [s] : [s, d, ln.image]).filter((y) => !!y).filter((y) => o.strictGptImage2 ? Nt(y) : y.category === "image").filter((y, j, I) => I.findIndex((x) => x.id === y.id) === j);
    if (h.length === 0) throw new Error("\u6CA1\u6709\u53EF\u7528\u7684\u56FE\u7247\u6A21\u578B\u3002\u8BF7\u5148\u5728 API \u8BBE\u7F6E\u91CC\u586B\u5199 Base URL + API Key\uFF0C\u5E76\u8BFB\u53D6\u5F53\u524D\u63A5\u53E3\u6A21\u578B\u5217\u8868\u3002");
    const g = [];
    for (const y of h) {
      const j = Fn(R, y.id), I = o.strictGptImage2 ? `${Wr(y)}\uFF08\u5DF2\u9501\u5B9A\u4E13\u5C5E API\uFF09` : Wr(y);
      if (!j.baseUrl || !j.apiKey) {
        g.push(`${I} \u672A\u914D\u7F6E API`);
        continue;
      }
      const x = Ws(y.id), M = [...a.map((U, le) => Ar(U, `\u4E0A\u6E38\u53C2\u8003 ${le + 1}`)), ...o.includeWorkbenchReferences === false ? [] : Le.map((U) => ({ name: U.name, localPath: U.localPath, dataUrl: U.dataUrl, url: /^https?:\/\//i.test(U.source) ? U.source : void 0, mimeType: U.mimeType }))].slice(0, 6);
      try {
        let U, le = "";
        const be = Jl(y, r), Ie = o.strictGptImage2 ? 1 : Nt(y) ? 10 : 3;
        for (let ye = 0; ye < Ie; ye += 1) {
          const _e = (ge) => Gt.generateImage({ modelAlias: y.alias, modelId: y.id, endpointModelId: y.endpointModelId, fallbackEndpointModelId: void 0, requestMode: y.requestMode, apiGroup: y.apiGroup, baseUrl: j.baseUrl, apiKey: j.apiKey, fallbackBaseUrl: j.fallbackBaseUrl, fallbackApiKey: j.fallbackApiKey, prompt: e, size: be.size, resolution: be.resolution, aspectRatio: r, quality: "Auto", count: 1, async: !!x.supportsAsync, referenceImagePaths: ge ? a : [], referenceImages: ge ? M : [], cacheDir: F.cacheDir, downloadsDir: F.downloadsDir });
          if (U = await _e(M.length > 0), U.status !== "succeeded" && M.length > 0 && /上传参考图失败|reference|upload|fetch failed|network|连接中断|网络/i.test(U.message || "")) {
            const ge = await _e(false);
            ge.status === "succeeded" || ge.assets.length > 0 ? U = ge : ge.message && (U = { ...ge, message: `${U.message || "\u53C2\u8003\u56FE\u4E0A\u4F20\u5931\u8D25"}\uFF1B\u5DF2\u81EA\u52A8\u53BB\u6389\u53C2\u8003\u56FE\u91CD\u8BD5\uFF1A${ge.message}` });
          }
          le = wa(U.message || "");
          const nt = U.assets.find((ge) => ge.type === "image" && Re(ge));
          if (U.status === "succeeded" && nt) return { asset: nt, modelLabel: I };
          ye < Ie - 1 && (ke(ce, { phase: "running", message: `${I} \u6682\u672A\u8FD4\u56DE\u53EF\u7528\u56FE\u7247\uFF0C\u6B63\u5728\u540C\u6A21\u578B\u91CD\u8BD5 ${ye + 2}/${Ie}\uFF1B\u5DF2\u6210\u529F\u5185\u5BB9\u4F1A\u4FDD\u7559\uFF0C\u4E0D\u4F1A\u4ECE\u5934\u91CD\u505A\u3002` }), await new Promise((ge) => setTimeout(ge, /429|too many|rate limit|overload|busy|繁忙|过载|限流/i.test(le) ? 1800 : 600)));
        }
        if (!U) {
          g.push(`${I}: \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247\u3002`);
          continue;
        }
        const K = U.assets.find((ye) => ye.type === "image" && Re(ye));
        if (U.status === "succeeded" && K) return { asset: K, modelLabel: I };
        g.push(`${I}: ${wa(U.message || le) || "\u6CA1\u6709\u8FD4\u56DE\u56FE\u7247\u3002"}`);
      } catch (U) {
        g.push(`${I}: ${wa(U instanceof Error ? U.message : "") || "\u751F\u56FE\u5931\u8D25\u3002"}`);
      }
    }
    throw new Error(g.filter(Boolean).join("\uFF1B") || "\u56FE\u6587\u6A21\u578B\u751F\u6210\u5931\u8D25\u3002");
  }
  async function Cr(e, r, a, o = {}) {
    var de, $e;
    const s = jt;
    if (!s)
      throw new Error(
        "\u6CA1\u6709\u53EF\u7528\u7684\u89C6\u9891\u6A21\u578B\uFF0C\u8BF7\u5148\u5728 API \u8BBE\u7F6E\u91CC\u542F\u7528\u4E00\u4E2A\u53EF\u7528\u7684\u89C6\u9891\u6A21\u578B\u3002"
      );
    const d = Fn(R, s.id);
    if (!d.baseUrl || !d.apiKey)
      throw new Error(`${Ft(s, "\u89C6\u9891\u6A21\u578B")} API \u914D\u7F6E\u4E0D\u5B8C\u6574\u3002`);
    const l = o.referenceMode === "reference" ? 9 : 4, p = r.map((J) => typeof J === "string" ? { source: J } : J).filter((J) => !!J.source?.trim()), h = _t(
      p.map((J) => J.source),
      l
    ), g = new Map(p.map((J) => [J.source.trim(), J])), y = o.previousVideoSource && /^https?:\/\//i.test(o.previousVideoSource) ? [o.previousVideoSource] : [], j = a.character, I = De(j.name) || "\u4E3B\u89D2", x = We(
      I,
      j.appearance,
      j.description,
      ((de = a.studioConfig) == null ? void 0 : de.userIdea) || a.originalSource || a.sourceText || O.runtimeParams.userIdea,
      e,
      ($e = a.styleLock) == null ? void 0 : $e.label
    ), embodiedLock = JiarenDetectEmbodiedProtagonistAsset(a.originalSource || a.sourceText || a.sourceIdea || a.studioConfig?.userIdea || O.runtimeParams.userIdea, e, I), M = _t(embodiedLock && j.entityKind !== embodiedLock.entityKind ? [] : [j.imageUrl, j.sheetUrl], 3), U = $(
      [
        Hr(a.styleLock || oa),
        x,
        j.description,
        j.prompt,
        embodiedLock || j.entityKind ? `\u56FA\u5B9A\u4E3B\u89D2\u8EAB\u4EFD\u540D\uFF1A${I}\u3002\u540E\u7EED\u955C\u5934\u5FC5\u987B\u4FDD\u6301\u5B8C\u5168\u76F8\u540C\u7684\u975E\u4EBA\u5F62\u5F53\u524D\u5F62\u6001\u3001\u8F6E\u5ED3\u3001\u6BD4\u4F8B\u3001\u8868\u9762\u3001\u989C\u8272\u548C\u5C3A\u5EA6\uFF1B\u7981\u6B62\u4EBA\u5F62\u5316\u3001\u751F\u6210\u8138\u6216\u64C5\u81EA\u53D8\u6210\u6301\u5251\u4EBA\u7269\u3002` : `\u56FA\u5B9A\u89D2\u8272\u540D\uFF1A${I}\u3002\u540E\u7EED\u955C\u5934\u5FC5\u987B\u4FDD\u6301\u540C\u4E00\u5F20\u8138\u3001\u540C\u4E00\u6027\u522B\u3001\u540C\u4E00\u670D\u88C5\u3001\u540C\u4E00\u4F53\u578B\u6BD4\u4F8B\u548C\u540C\u4E00\u4E3B\u9053\u5177\u5173\u7CFB\u3002`
      ].filter(Boolean).join("\n"),
      1200
    ), le = o.referenceProfile || "storyboard-first", be = h.length ? o.referenceMode || "first-frame" : "none", Ie = h.filter((J) => g.get(J)?.slot === "storyboard").length, K = le === "asset-first" ? (h.some((J) => g.get(J)?.slot === "character") || M[0] ? 1 : 0) + (h.some((J) => g.get(J)?.slot === "scene") ? 1 : 0) : 0, ye = be === "reference" ? Math.max(
      1,
      Math.min(
        Math.max(1, Ie || h.length - K),
        Math.round(o.storyboardReferenceCount || o.shotCount || 1)
      )
    ) : h.length ? 1 : 0, _e = h.map((J, ie) => {
      const oe = g.get(J), D = ga(ie, ye, be, le);
      return {
        name: oe?.name || D.name,
        description: oe?.description || D.description
      };
    }), nt = ns(h.length, ye, be, y.length, le, _e), ge = Fl(s), pt = uo(s), Y = Dn(
      Math.max(
        1,
        Math.min(
          Lt(),
          Math.round(
            o.durationSeconds || (In === "single" ? Ze.seconds : Ze.seconds / Math.max(1, Jt)) || 6
          )
        )
      ),
      s
    ), videoRequest = {
      modelAlias: s.alias,
      modelId: s.id,
      endpointModelId: pt,
      fallbackEndpointModelId: s.fallbackEndpointModelId,
      requestMode: s.requestMode,
      apiGroup: s.apiGroup,
      baseUrl: d.baseUrl,
      apiKey: d.apiKey,
      fallbackBaseUrl: d.fallbackBaseUrl,
      fallbackApiKey: d.fallbackApiKey,
      mode: h.length ? "image-to-video" : "text-to-video",
      prompt: $([e, nt].filter(Boolean).join("\n\n"), 3600),
      shotTitle: o.shotTitle || "\u5206\u955C\u955C\u5934",
      ...ge ? { resolution: ge } : {},
      duration: Y,
      aspectRatio: O.runtimeParams.aspect_ratio,
      fps: 24,
      cameraMotion: embodiedLock || j.entityKind ? "\u7EC4\u5185\u8FDE\u7EED\u5FAE\u955C\u5934\u8FD0\u955C\uFF0C\u6309\u9010\u955C\u5934\u901A\u544A\u811A\u672C\u6267\u884C\uFF0C\u4FDD\u6301\u975E\u4EBA\u5F62\u4E3B\u89D2\u7684\u8F6E\u5ED3\u3001\u6BD4\u4F8B\u3001\u8868\u9762\u548C\u573A\u666F\u98CE\u683C\u4E00\u81F4" : "\u7EC4\u5185\u8FDE\u7EED\u5FAE\u955C\u5934\u8FD0\u955C\uFF0C\u6309\u9010\u955C\u5934\u901A\u544A\u811A\u672C\u6267\u884C\uFF0C\u4FDD\u6301\u89D2\u8272\u8138\u90E8\u548C\u573A\u666F\u98CE\u683C\u4E00\u81F4",
      shotType: rt === "grid" ? "\u5BAB\u683C\u56FE\u65B9\u6848\uFF1A\u9010\u955C\u5934\u5206\u955C\u901A\u544A\u811A\u672C\u9A71\u52A8" : "\u591A\u56FE\u53C2\u8003\u65B9\u6848\uFF1A\u89D2\u8272/\u573A\u666F\u53C2\u8003\u56FE\u751F\u89C6\u9891",
      lighting: O.runtimeParams.vibe_tag,
      transition: "\u81EA\u52A8",
      video_model: Ql(s),
      storyboardMode: o.storyboardMode || (rt === "multi-image" ? "multi-reference" : "grid"),
      refImage: h[0] || M[0],
      characterAsset: {
        name: I,
        appearance: U,
        entityKind: (embodiedLock == null ? void 0 : embodiedLock.entityKind) || j.entityKind,
        formId: (embodiedLock == null ? void 0 : embodiedLock.formId) || j.formId,
        imageUrl: M[0],
        imageUrls: M
      },
      propAssets: (a.propAssets ?? []).map((J) => ({
        name: J.name,
        type: J.type,
        description: $(J.description || J.appearance, 360),
        appearance: $(J.appearance || J.description, 360),
        imageUrl: J.imageUrl
      })),
      maxPollAttempts: 180,
      pollIntervalSeconds: 5,
      directorMode: true,
      shotCount: Math.max(1, Math.round(o.shotCount || 1)),
      storyboardReferenceCount: ye,
      generateAudio: true,
      returnLastFrame: true,
      watermark: false,
      referenceMode: be,
      referenceImagePaths: h,
      referenceImages: h.map((J, ie) => {
        const oe = g.get(J), D = ga(ie, ye, be, le), V = oe?.slot, G = oe?.role || (V === "character" ? "character_reference" : V === "scene" ? "visual_reference" : V === "previous" ? "previous_last_frame" : V === "storyboard" ? h.filter((W) => g.get(W)?.slot === "storyboard").indexOf(J) <= 0 ? "storyboard_first_frame" : "storyboard_panel" : D.role);
        return Ar(
          J,
          oe?.name || D.name,
          G,
          oe?.description || D.description,
          V
        );
      }),
      referenceVideoPaths: y,
      referenceAudioPaths: h.length || y.length ? _t([j.voiceUrl].filter((J) => typeof J === "string" && J.trim()), 3) : [],
      cacheDir: F.cacheDir,
      downloadsDir: F.downloadsDir
    }, runtime = window.jiaren?.runtime, emitTaskState = (state) => {
      if (typeof o.onTaskState === "function") o.onTaskState(state);
    }, resultAssets = (result) => {
      const asset = result?.assets?.find((J) => J.type === "video" && Re(J)), lastFrameAsset = [...result?.assets || []].reverse().find((J) => J.type === "image" && Re(J));
      return { asset, lastFrameAsset };
    }, waitForPoll = (milliseconds) => new Promise((resolve, reject) => {
      if (o.signal?.aborted) {
        reject(new Error("\u7528\u6237\u5DF2\u505C\u6B62"));
        return;
      }
      const onAbort = () => {
        clearTimeout(timer);
        reject(new Error("\u7528\u6237\u5DF2\u505C\u6B62"));
      };
      const timer = setTimeout(() => {
        o.signal?.removeEventListener("abort", onAbort);
        resolve();
      }, milliseconds);
      o.signal?.addEventListener("abort", onAbort, { once: true });
    });
    if (!runtime?.submitVideoTask || !runtime?.queryVideoTask) {
      const legacyResult = await Gt.generateVideo(videoRequest), legacyAssets = resultAssets(legacyResult);
      if (legacyResult.status === "succeeded" && legacyAssets.asset)
        return {
          ...legacyAssets,
          modelLabel: Ft(s, s.id),
          taskId: legacyResult.taskId
        };
      throw new Error(legacyResult.message || "\u89C6\u9891\u4EFB\u52A1\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u89C6\u9891\u3002");
    }
    let taskId = o.resumeTaskId || "", taskProvider = o.resumeTaskProvider || "primary", pollUrl = o.resumePollUrl || "", terminalFailure = false, submittedNow = false;
    try {
      let current;
      if (!taskId && !pollUrl) {
        current = await runtime.submitVideoTask(videoRequest);
        taskId = current.taskId || "";
        taskProvider = current.taskProvider || taskProvider;
        pollUrl = current.pollUrl || pollUrl;
        submittedNow = true;
        const immediateAssets = resultAssets(current);
        emitTaskState({
          status: current.status === "succeeded" ? "success" : current.status === "failed" ? "failed" : "polling",
          taskId,
          taskProvider,
          pollUrl,
          error: current.status === "failed" ? current.message : null,
          progress: current.status === "succeeded" ? "100%" : "15%"
        });
        if (current.status === "succeeded" && immediateAssets.asset)
          return {
            ...immediateAssets,
            modelLabel: Ft(s, s.id),
            taskId,
            taskProvider,
            pollUrl
          };
        if (current.status === "failed") {
          terminalFailure = true;
          throw new Error(current.message || "\u89C6\u9891\u4EFB\u52A1\u63D0\u4EA4\u5931\u8D25\u3002");
        }
        if (!taskId && !pollUrl) {
          terminalFailure = true;
          throw new Error(current.message || "\u89C6\u9891\u63A5\u53E3\u6CA1\u6709\u8FD4\u56DE\u53EF\u8FFD\u8E2A\u7684\u4EFB\u52A1 ID\u3002");
        }
      } else {
        emitTaskState({
          status: "polling",
          taskId,
          taskProvider,
          pollUrl,
          error: null,
          progress: "\u7EE7\u7EED\u67E5\u8BE2"
        });
      }
      for (let attempt = 0; attempt < 180; attempt += 1) {
        if (o.signal?.aborted) throw new Error("\u7528\u6237\u5DF2\u505C\u6B62");
        if (submittedNow || attempt > 0)
          await waitForPoll(attempt < 3 ? 1500 : 5e3);
        current = await runtime.queryVideoTask({
          ...videoRequest,
          taskId,
          taskProvider,
          pollUrl
        });
        if (o.signal?.aborted) throw new Error("\u7528\u6237\u5DF2\u505C\u6B62");
        taskId = current.taskId || taskId;
        taskProvider = current.taskProvider || taskProvider;
        pollUrl = current.pollUrl || pollUrl;
        const assets = resultAssets(current), progress = `${Math.min(95, Math.round(15 + (attempt + 1) * 80 / 180))}%`;
        emitTaskState({
          status: current.status === "succeeded" ? "success" : current.status === "failed" ? "failed" : "polling",
          taskId,
          taskProvider,
          pollUrl,
          error: current.status === "failed" ? current.message : null,
          progress: current.status === "succeeded" ? "100%" : progress
        });
        if (current.status === "succeeded" && assets.asset)
          return {
            ...assets,
            modelLabel: Ft(s, s.id),
            taskId,
            taskProvider,
            pollUrl
          };
        if (current.status === "failed") {
          terminalFailure = true;
          throw new Error(current.message || "\u89C6\u9891\u751F\u6210\u5931\u8D25\u3002");
        }
      }
      throw new Error("\u89C6\u9891\u4EFB\u52A1\u4ECD\u5728\u5904\u7406\u4E2D\uFF0C\u4EFB\u52A1 ID \u5DF2\u4FDD\u7559\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u7EE7\u7EED\u67E5\u8BE2\u3002");
    } catch (error) {
      const cancelled = o.signal?.aborted || /用户已停止/.test(String(error?.message || error));
      if (!terminalFailure)
        emitTaskState({
          status: cancelled ? "cancelled" : "error",
          taskId,
          taskProvider,
          pollUrl,
          error: cancelled ? "\u7528\u6237\u5DF2\u505C\u6B62\uFF1B\u5DF2\u63D0\u4EA4\u4EFB\u52A1\u4ECD\u53EF\u7EE7\u7EED\u67E5\u8BE2\u3002" : error?.message || "\u89C6\u9891\u4EFB\u52A1\u67E5\u8BE2\u5931\u8D25\u3002",
          progress: cancelled ? "\u5DF2\u505C\u6B62" : "\u5F85\u91CD\u8BD5"
        });
      throw new Error(cancelled ? "\u7528\u6237\u5DF2\u505C\u6B62" : error?.message || "\u89C6\u9891\u4EFB\u52A1\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u89C6\u9891\u3002");
    }
  }
  async function ms(e) {
    var y, j, I, x, M, U, le, be, Ie, K, ye, _e, nt, ge, pt;
    e === "scene" && (e = "storyboard");
    const r = ut.find((Y) => Y.id === e) ?? ut[0], a = Ya(), sourceIdeaForRun = JiarenStoredSourceIdea(lockedSourceRef.current, a, Je), o = sourceIdeaForRun, activeScriptAdapter = Rl({ ...Yi, userIdea: o || "\u539F\u59CB\u9700\u6C42\u5F85\u6062\u590D" });
    if (!o) throw new Error("\u539F\u59CB\u5C0F\u8BF4/\u9700\u6C42\u5DF2\u4E22\u5931\uFF0C\u5DF2\u505C\u6B62\u751F\u6210\uFF0C\u8BF7\u91CD\u65B0\u7C98\u8D34\u539F\u6587\u3002");
    lockedSourceRef.current = o;
    if (e === "setup") {
      const Y = [`\u5BFC\u6F14\uFF0C\u5DE5\u4F5C\u6D41\u6FC0\u6D3B\u6B65\u9AA4\u5DF2\u7ECF\u5B8C\u6210\u3002\u672C\u5730\u6982\u5FF5\u5305\u6838\u5B9A\uFF1A${o}`, `\u5F71\u7247\u89C4\u683C\u9501\u5B9A\u4E3A ${la()} / ${Et} / ${Dt} / ${sn.trim() || Rt}\u3002`, "\u8FD9\u4E9B\u53C2\u6570\u5DF2\u5199\u5165\u5F71\u7247\u5236\u4F5C\u914D\u7F6E\uFF0C\u5E76\u5C06\u81EA\u52A8\u4E0B\u53D1\u7ED9\u7F16\u5267\u3001\u5206\u955C\u548C\u6210\u7247\u6B65\u9AA4\u3002"].join(`
`);
      return gt(e, { ...a, modelLabel: "Local Art Director / GlobalStudioConfig", brief: Y });
    }
    if (e === "script") {
      ke("script", {
        phase: "running",
        message: "\u6B63\u5728\u4F9D\u636E\u539F\u59CB\u521B\u610F\u4E0E\u5BFC\u6F14\u610F\u56FE\u9501\u751F\u6210\u53EF\u8FFD\u8E2A\u5267\u672C\u3002"
      });
      const revisionInstructionForRun = JiarenRevisionOnlyText(Xe, o), revisionBlockForRun = revisionInstructionForRun ? `\n\u7528\u6237\u4FEE\u6539\u610F\u89C1\uFF1A${revisionInstructionForRun}\n\u4FEE\u6539\u53EA\u80FD\u8C03\u6574\u8868\u8FBE\u3001\u8282\u594F\u3001\u5BF9\u767D\u6216\u8865\u6F0F\uFF0C\u4E0D\u5F97\u66FF\u6362\u9501\u5B9A\u539F\u6587\u3002` : "";
      const schema = "\u540C\u65F6\u8FD4\u56DE intent_lock\uFF0C\u683C\u5F0F\u4E0E\u9996\u6B21\u7F16\u5267\u4E00\u81F4\uFF1B\u4E0D\u5F97\u4E22\u5931 original_request\u3001\u89D2\u8272\u3001\u5730\u70B9\u3001\u6301\u7EED\u8D44\u4EA7\u3001\u5FC5\u8981\u52A8\u4F5C\u3001\u89C6\u89C9\u98CE\u683C\u548C\u7981\u6B62\u51B2\u7A81\u3002";
      const Y = await Rn(e, `${activeScriptAdapter.adapter.wrapScriptPrompt(o, a.brief)}

${schema}${revisionBlockForRun}`);
      let ne = un(Y), ae = JiarenNormalizeFountainSceneBlocks(pr(ne, Y, o));
      ne = JiarenReconcileProductionPayload(o, ae, ne);
      let coverage = JiarenValidateScriptArtifact(o, ae, ne);
      for (let repairAttempt = 0; coverage && repairAttempt < 2; repairAttempt += 1) {
        const repaired = await Rn(e, `${activeScriptAdapter.adapter.wrapScriptPrompt(o, a.brief)}

${schema}${revisionBlockForRun}

${JiarenScriptRepairPrompt(o, coverage, ae.join("\n\n"))}`);
        const patchPayload = un(repaired), patchScript = JiarenNormalizeFountainSceneBlocks(pr(patchPayload, repaired, o));
        if (JiarenIsLiterarySource(o)) {
          const merged = JiarenMergeNovelRepair(o, ae, ne, patchScript, patchPayload, coverage);
          ae = merged.script;
          ne = merged.payload;
        } else {
          ae = patchScript;
          ne = patchPayload;
        }
        ne = JiarenReconcileProductionPayload(o, ae, ne), coverage = JiarenValidateScriptArtifact(o, ae, ne);
      }
      if (coverage && JiarenIsLiterarySource(o)) {
        const faithful = JiarenBuildFaithfulNovelArtifact(o, ne), faithfulCoverage = JiarenValidateScriptArtifact(o, faithful.script, faithful.payload);
        if (!faithfulCoverage) ae = faithful.script, ne = faithful.payload, coverage = void 0;
      }
      if (ae.length === 0) throw new Error("\u7F16\u5267 Agent \u8FD4\u56DE\u5185\u5BB9\u65E0\u6CD5\u89E3\u6790\u6210\u5267\u672C\u6BB5\u843D\uFF0C\u8BF7\u91CD\u8BD5\u3002");
      const de = Dl(ae, O.runtimeParams);
      if (de) throw new Error(`\u5267\u672C\u8FDE\u7EED\u6027\u6821\u9A8C\u672A\u901A\u8FC7\uFF1A${de}`);
      if (coverage) throw new Error(`${coverage.message || "\u5267\u672C\u4E13\u4E1A\u683C\u5F0F\u4ECD\u4E0D\u5B8C\u6574\u3002"}\u539F\u6587\u5185\u5BB9\u5DF2\u4FDD\u7559\uFF0C\u53EF\u7EE7\u7EED\u91CD\u505A\u8865\u5168\u3002`);
      const intentLock = JiarenNormalizeIntentLock(ne, o);
      Mt("");
      return gt(e, { ...a, sourceIdea: o, originalSource: o, sourceText: o, intentLock, productionBeats: JiarenProductionBeatRecords(ne), rawAgentPayload: ne, modelLabel: Ft(ln.chat, r.model), script: ae });
    }
    if (e === "character") {
      const Y = Ka, ne = Jr(Y);
      if (!Y || !ne) throw new Error("\u8BF7\u5148\u5728\u5DE6\u4FA7\u9009\u62E9\u4E00\u4E2A\u89D2\u8272\u89C6\u89C9\u98CE\u683C\uFF0C\u518D\u5F00\u59CB\u751F\u6210\u89D2\u8272\u8D44\u4EA7\u3002");
      const embodiedSource = a.originalSource || a.sourceText || a.sourceIdea || o, preliminaryEmbodiedLock = JiarenDetectEmbodiedProtagonistAsset(embodiedSource, a.script.join(`
`), De(a.character.name || "") || "\u4E3B\u89D2"), characterAgentPrompt = [O.adapter.wrapCharacterPrompt(o, a.script.join(`
`), Y.label, Y.tone), preliminaryEmbodiedLock == null ? void 0 : preliminaryEmbodiedLock.agentInstruction].filter(Boolean).join(`

`), ae = await Rn(e, characterAgentPrompt, { includeReferences: false }), de = un(ae), $e = ur(de, ["characters", "roles", "character_assets", "characterAssets"]), J = ur(de, ["props", "prop_assets", "propAssets", "vehicles", "vehicle_assets", "vehicleAssets", "objects", "items"]), ie = ed(a.script, tt(de, ["name", "character_name"], a.character.name || "\u4E3B\u89D2")), oe = J.map((L) => pi(L)), D = [], embodiedName = De(ie[0] || "") || De(a.character.name || "") || "\u4E3B\u89D2", embodiedLock = JiarenDetectEmbodiedProtagonistAsset(embodiedSource, a.script.join(`
`), embodiedName) || preliminaryEmbodiedLock, rawCharacterCandidates = $e.length ? $e : ie.map((L) => ({ name: L })), characterCandidates = embodiedLock ? [{ name: embodiedLock.name, description: embodiedLock.description, appearance: embodiedLock.appearance, image_prompt: embodiedLock.imagePrompt, sheet_prompt: embodiedLock.sheetPrompt, entity_kind: embodiedLock.entityKind, form_id: embodiedLock.formId }, ...rawCharacterCandidates.filter((L) => {
        const candidate = L && typeof L == "object" ? L : { name: String(L || "") }, candidateName = De(tt(candidate, ["name", "character_name", "title"], "")), candidateText = [candidateName, tt(candidate, ["description", "bio", "role", "summary"], "")].join(" ");
        return candidateName !== De(embodiedLock.name) && !/\u4E3B\u89D2|protagonist/i.test(candidateText);
      })] : rawCharacterCandidates, V = characterCandidates.map((L, ue) => {
        const he = L && typeof L == "object" ? L : { name: String(L || "") }, Ke = tt(he, ["name", "character_name"], ""), je = tt(he, ["title"], ""), Fe = tt(he, ["description", "bio", "role", "summary"], a.character.description), fe = tt(he, ["appearance", "lineage", "consistency", "visual"], Fe || Ke || je), Zt = De(Ke) || De(je);
        if (embodiedLock && ue === 0) {
          const Te = De(embodiedLock.name) || embodiedName, Fs = O.adapter.wrapImagePrompt([embodiedLock.imagePrompt, `Protagonist identity name: ${Te}. Current visible form only.`, "This is the protagonist identity asset, not a secondary prop and not a human portrait."].join(`
`), "embodied protagonist identity asset", ne), Qs = O.adapter.wrapImagePrompt([embodiedLock.sheetPrompt, `Protagonist identity name: ${Te}.`, "Keep one exact object identity across all views; no human form and no alternate design."].join(`
`), "embodied protagonist orthographic sheet", ne);
          return { name: Te, description: embodiedLock.description, appearance: embodiedLock.appearance, entityKind: embodiedLock.entityKind, formId: embodiedLock.formId, prompt: Fs, sheetPrompt: Qs };
        }
        if (Ca(Ke || je, Fe, fe) || !Zt && Ui(Ke || je)) {
          D.push(pi(he, Ke || je || `\u7D20\u6750 ${ue + 1}`));
          return;
        }
        const Te = Zt || ie[ue] || (ue === 0 ? "\u4E3B\u89D2" : `\u89D2\u8272 ${ue + 1}`), Ee = ki(Fe) ? `${Te}\uFF0C\u4ECE\u786E\u8BA4\u5267\u672C\u548C\u7528\u6237\u9700\u6C42\u63D0\u53D6\u7684\u4EBA\u7269\u89D2\u8272\u3002` : Fe, at = hn(o, `${Te} ${Ee}`), At = We(Te, fe, Ee, o, a.script.join(`
`), Y.label);
        if (Ca(Te, Ee, At)) {
          D.push(pi({ ...he, name: Te, description: Ee, appearance: At }, Te));
          return;
        }
        const Fs = O.adapter.wrapImagePrompt([at, Ut(o, `${Te} ${Ee}`), "AI_film_studio Input_Character asset: generate the reusable living character identity card only. Lock the protagonist gender, face, outfit, silhouette and visual style for all later storyboard/video nodes.", "Non-character assets remain separate from the living-character card. Do not draw a second person or convert any prop or recurring asset into a humanoid character.", tt(he, ["image_prompt", "imagePrompt", "prompt"], `${Te}, ${At}. character front portrait, production design sheet, clean background, ${Y.label}`), "Do not gender swap, do not redesign into another person, do not output an unrelated beauty portrait."].filter(Boolean).join(`
`), "character portrait", ne), Qs = O.adapter.wrapImagePrompt([at, tt(he, ["sheet_prompt", "sheetPrompt"], `${Te}, ${At}. character turnaround sheet, front view, side view, back view, full body, same face, same gender, same hairstyle, same outfit, same colors, same shoes, same accessories, same material details, neutral clean background.`), "One character only. No alternate costume, no gender swap, no second person, no story action pose. This sheet is a reusable identity and outfit lock for all video shots."].filter(Boolean).join(`
`), "character turnaround sheet", ne);
        return { name: Te, description: Ee, appearance: At, prompt: Fs, sheetPrompt: Qs };
      }).filter((L) => !!L).filter((L) => L.entityKind || (De(L.name) || L.appearance) && !Ca(L.name, L.description, L.appearance)).map((L, ue) => ({ ...L, name: De(L.name) || (ue === 0 ? "\u4E3B\u89D2" : `\u89D2\u8272 ${ue + 1}`) })).slice(0, 4), G = /* @__PURE__ */ new Set();
      if (V.forEach((L, ue) => {
        const Ke = De(L.name).toLowerCase();
        if (!Ke || !G.has(Ke)) {
          Ke && G.add(Ke);
          return;
        }
        const je = `${L.description} ${L.appearance} ${L.prompt}`, Fe = /双斧|斧|重甲|战斧/i.test(je) ? "\u53CC\u65A7\u6218\u5C06" : /反派|敌|对手|boss|villain|enemy/i.test(je) ? "\u53CD\u6D3E\u6218\u5C06" : /少女|女孩|女|female|woman|girl/i.test(je) ? `\u5973\u6027\u89D2\u8272 ${ue + 1}` : `\u89D2\u8272 ${ue + 1}`;
        L.name = G.has(Fe.toLowerCase()) ? `\u89D2\u8272 ${ue + 1}` : Fe, G.add(L.name.toLowerCase());
      }), V.length === 0 && !embodiedLock) {
        const L = De($a(o)) || "\u4E3B\u89D2", ue = [hn(o), `${L}\uFF0C${Y.label}\u4EBA\u7269\u89D2\u8272\u8BBE\u5B9A\uFF0C\u5916\u89C2\u3001\u6027\u522B\u3001\u5E74\u9F84\u5C42\u3001\u670D\u88C5\u548C\u8EAB\u4EFD\u4E25\u683C\u7EE7\u627F\u7528\u6237\u9700\u6C42\uFF1B\u53EA\u63CF\u8FF0\u771F\u4EBA/\u4EBA\u7269\uFF0C\u4E0D\u5305\u542B\u673A\u8F66\u3001\u8F66\u8F86\u6216\u9053\u5177\u672C\u4F53\u3002`].filter(Boolean).join(" ");
        V.push({ name: L, description: `${L}\uFF0C\u4ECE\u5267\u672C\u548C\u7528\u6237\u521B\u610F\u63D0\u53D6\u7684\u4E3B\u89D2\u4EBA\u7269\u3002`, appearance: ue, prompt: O.adapter.wrapImagePrompt([hn(o), `${L}, ${ue}. living character front portrait, production design sheet, clean background, ${Y.label}`, "Do not draw motorcycle or prop as a second character. No gender swap."].filter(Boolean).join(`
`), "character portrait", ne), sheetPrompt: O.adapter.wrapImagePrompt([hn(o), `${L}, ${ue}. character turnaround sheet, front view, side view, back view, full body, same face, same gender, same hairstyle, same outfit, same colors, same shoes, same accessories, same material details, neutral clean background.`, "One character only. No alternate costume, no gender swap, no second person, no story action pose. This sheet is a reusable identity and outfit lock for all video shots."].filter(Boolean).join(`
`), "character turnaround sheet", ne) });
      }
      /机车|摩托|motorcycle|motorbike|bike|vehicle/i.test([o, a.script.join(`
`)].join(" ")) && ![...oe, ...D, ...a.propAssets ?? []].some((L) => L.type === "vehicle") && D.push({ name: "\u4E3B\u8F7D\u5177\u673A\u8F66", type: "vehicle", description: "\u7528\u6237\u9700\u6C42\u4E2D\u7684\u56FA\u5B9A\u673A\u8F66/\u6469\u6258\u8F7D\u5177\uFF0C\u4F5C\u4E3A\u72EC\u7ACB vehicle asset \u9501\u5B9A\uFF0C\u4E0D\u8FDB\u5165\u89D2\u8272\u5361\u3002", appearance: "same motorcycle throughout the film, stable silhouette, color family, material, rider relationship, road contact and speed direction", prompt: "same cinematic motorcycle vehicle asset, stable silhouette, clean product reference, no rider, no human" });
      let W = Bl(a.propAssets, oe, D);
      if (embodiedLock) W = W.filter((L) => !JiarenMatchesEmbodiedProtagonistAsset(L, embodiedLock));
      const N = ((y = Oe.find((L) => L.step === "character")) == null ? void 0 : y.payload.characters) ?? a.characters ?? [], Se = [];
      for (const L of V) {
        const ue = N.find((Ee) => {
          var at;
          return De(Ee.name) === De(L.name) && !!((at = Ee.imageUrl) != null && at.trim()) && (!L.entityKind || Ee.entityKind === L.entityKind);
        });
        if (ue != null && ue.imageUrl) {
          let Ee = ue.sheetUrl, at;
          if (!Ee) {
            ke("character", { phase: "running", message: `\u89D2\u8272\u8BBE\u8BA1\u5E08\u6B63\u5728\u4E3A\u5DF2\u6709\u89D2\u8272\u8865\u4E09\u89C6\u56FE/\u670D\u88C5\u9501 ${Se.length + 1}/${V.length}\uFF1A${L.name}` });
            const At = await xt($(L.sheetPrompt, 1400), "16:9", [ue.imageUrl], { includeWorkbenchReferences: false });
            Ee = Re(At.asset), at = At.modelLabel;
          }
          Se.push({ ...ue, entityKind: L.entityKind || ue.entityKind, formId: L.formId || ue.formId, description: L.description || ue.description, appearance: L.appearance || ue.appearance, prompt: L.prompt || ue.prompt, sheetUrl: Ee, sheetPrompt: L.sheetPrompt, modelLabel: at || "\u5DF2\u4FDD\u7559" }), ke("character", { phase: "running", message: `\u89D2\u8272\u8BBE\u8BA1\u5E08\u5DF2\u4FDD\u7559\u5DF2\u6709\u89D2\u8272\u56FE ${Se.length}/${V.length}\uFF1A${L.name}` });
          continue;
        }
        ke("character", { phase: "running", message: `\u89D2\u8272\u8BBE\u8BA1\u5E08\u6B63\u5728\u4ECE\u65AD\u70B9\u751F\u6210\u89D2\u8272\u56FE ${Se.length + 1}/${V.length}\uFF1A${L.name}` });
        const he = await xt(L.prompt, "1:1"), Ke = Re(he.asset);
        let je, Fe = he.modelLabel;
        if (Ke) {
          ke("character", { phase: "running", message: `\u89D2\u8272\u8BBE\u8BA1\u5E08\u6B63\u5728\u751F\u6210\u4E09\u89C6\u56FE/\u670D\u88C5\u9501 ${Se.length + 1}/${V.length}\uFF1A${L.name}` });
          const Ee = await xt($(L.sheetPrompt, 1400), "16:9", [Ke], { includeWorkbenchReferences: false });
          je = Re(Ee.asset), Fe = `${he.modelLabel} + ${Ee.modelLabel}`;
        }
        Se.push({ name: L.name, description: L.description, appearance: L.appearance, entityKind: L.entityKind, formId: L.formId, prompt: L.prompt, imageUrl: Ke, sheetUrl: je, sheetPrompt: L.sheetPrompt, modelLabel: Fe });
        const fe = Se[0], Zt = De((fe == null ? void 0 : fe.name) || "") || "\u4E3B\u89D2", Te = (fe == null ? void 0 : fe.entityKind) ? fe.appearance : We(Zt, fe == null ? void 0 : fe.appearance, fe == null ? void 0 : fe.description, o, a.script.join(`
`), Y.label);
        Za(e, { ...a, styleLock: ne, modelLabel: he.modelLabel, character: { name: Zt, description: (fe == null ? void 0 : fe.description) || a.character.description, appearance: Te, entityKind: fe == null ? void 0 : fe.entityKind, formId: fe == null ? void 0 : fe.formId, prompt: fe == null ? void 0 : fe.prompt, imageUrl: fe == null ? void 0 : fe.imageUrl, sheetUrl: fe == null ? void 0 : fe.sheetUrl }, characters: Se.map(({ modelLabel: Ee, sheetPrompt: at, ...At }) => At), propAssets: W });
      }
      for (let L = 0; L < W.length; L += 1) {
        const ue = W[L];
        if (ue.imageUrl) continue;
        ke("character", { phase: "running", message: `\u89D2\u8272\u8BBE\u8BA1\u5E08\u6B63\u5728\u751F\u6210\u72EC\u7ACB\u9053\u5177 / \u8F7D\u5177\u8D44\u4EA7 ${L + 1}/${W.length}\uFF1A${ue.name}` });
        const he = O.adapter.wrapImagePrompt([
          Ut(o, `${ue.name} ${ue.description || ue.appearance || ""}`),
          ue.prompt || `${ue.name}, ${ue.appearance || ue.description || ""}`,
          `Create one reusable ${ue.type === "vehicle" ? "vehicle" : ue.type === "weapon" ? "weapon" : "prop"} reference asset. Lock exact silhouette, proportions, color, materials, markings and wear for every later storyboard and video shot.`,
          "Isolated production asset on a clean neutral background. No person, no rider, no hands, no duplicate object, no scene background, no text, no watermark."
        ].filter(Boolean).join("\n"), `${ue.type || "prop"} asset`, ne), Ke = await xt($(he, 1600), "1:1", [], { includeWorkbenchReferences: false }), je = Re(Ke.asset);
        if (!je) throw new Error(`\u9053\u5177 / \u8F7D\u5177\u300C${ue.name}\u300D\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u56FE\u7247\u3002`);
        W = W.map((Fe, fe) => fe === L ? { ...Fe, prompt: he, imageUrl: je } : Fe);
        const Fe = Se[0], fe = De((Fe == null ? void 0 : Fe.name) || a.character.name) || "\u4E3B\u89D2", Zt = (Fe == null ? void 0 : Fe.entityKind) ? Fe.appearance : We(fe, Fe == null ? void 0 : Fe.appearance, (Fe == null ? void 0 : Fe.description) || a.character.description, o, a.script.join("\n"), Y.label);
        Za(e, { ...a, styleLock: ne, modelLabel: Ke.modelLabel, character: { name: fe, description: (Fe == null ? void 0 : Fe.description) || a.character.description, appearance: Zt, entityKind: Fe == null ? void 0 : Fe.entityKind, formId: Fe == null ? void 0 : Fe.formId, prompt: Fe == null ? void 0 : Fe.prompt, imageUrl: Fe == null ? void 0 : Fe.imageUrl, sheetUrl: Fe == null ? void 0 : Fe.sheetUrl }, characters: Se.map(({ modelLabel: Ee, sheetPrompt: at, ...At }) => At), propAssets: W });
      }
      const re = Se[0], Me = De((re == null ? void 0 : re.name) || a.character.name) || "\u4E3B\u89D2", ht = (re == null ? void 0 : re.entityKind) ? re.appearance : We(Me, re == null ? void 0 : re.appearance, (re == null ? void 0 : re.description) || a.character.description, o, a.script.join(`
`), Y.label);
      return gt(e, { ...a, styleLock: ne, modelLabel: (re == null ? void 0 : re.modelLabel) || r.model, character: { name: Me, description: (re == null ? void 0 : re.description) || a.character.description, appearance: ht, entityKind: re == null ? void 0 : re.entityKind, formId: re == null ? void 0 : re.formId, prompt: re == null ? void 0 : re.prompt, imageUrl: re == null ? void 0 : re.imageUrl, sheetUrl: re == null ? void 0 : re.sheetUrl }, characters: Se.map(({ modelLabel: L, sheetPrompt: ue, ...he }) => he), propAssets: W });
    }
    if (e === "__disabled_scene_stage__") {
      const original = a.intentLock?.original || a.studioConfig?.userIdea || o;
      const intentLock = JiarenNormalizeIntentLock(a.intentLock, original);
      const characterLineage = [a.character, ...a.characters || []].map((character) => `${character.name}: ${character.appearance || character.description || ""}`).join("\n");
      if (!characterLineage.trim()) throw new Error("\u7F3A\u5C11\u89D2\u8272\u5916\u89C2\u8840\u7EDF\uFF0C\u8BF7\u5148\u5B8C\u6210\u89D2\u8272\u8BBE\u8BA1\u3002");
      const productionBeats = JiarenProductionBeatRecords(a.productionBeats ?? a.rawAgentPayload);
      const scriptSections = JiarenConfirmedScriptSections(a.script, productionBeats);
      const expectedBeatIds = scriptSections.map((section) => section.id);
      const scriptWithIds = scriptSections.map((section) => /\bBEAT[-_\s]*\d{1,3}\b/i.test(section.text) ? section.text : `${section.id}
${section.text}`).join("\n\n");
      const sceneSchema = [
        "\u53EA\u89C4\u5212\u5267\u672C\u771F\u5B9E\u51FA\u73B0\u7684\u5730\u70B9/\u65F6\u6BB5/\u5929\u6C14\uFF0C\u4E0D\u5F97\u4E3A\u51D1\u6570\u91CF\u65B0\u589E\u5730\u70B9\uFF0C\u4E0D\u5F97\u4F7F\u7528\u9ED8\u8BA4\u6821\u56ED\u3001\u57CE\u5E02\u3001\u68EE\u6797\u3001\u6D77\u8FB9\u6216\u9EC4\u660F\u6A21\u677F\u3002",
        `\u5FC5\u987B\u8986\u76D6\u5DF2\u786E\u8BA4\u5267\u672C\u7684\u771F\u5B9E\u8282\u62CD ID\uFF1A${expectedBeatIds.join("\u3001")}\uFF0C\u4E00\u4E2A\u90FD\u4E0D\u80FD\u6F0F\uFF1B\u4E0D\u5F97\u6839\u636E\u76EE\u6807\u955C\u5934\u6570\u865A\u6784\u65B0\u573A\u6B21\u3002\u540C\u4E00\u5730\u70B9\u53EF\u5728\u4E00\u4E2A\u573A\u666F\u5305\u7684 source_beat_ids \u91CC\u5408\u5E76\u591A\u4E2A\u8282\u62CD\u3002`,
        "\u6BCF\u4E2A\u573A\u666F\u5FC5\u987B\u6709 scene_id\u3001source_beat_ids\u3001location\u3001time\u3001weather\u3001visual_anchors\u3001environment\u3001set_dressing\u3001lighting\u3001terrain\u3001spatial_framing\u3001camera_empty_frame\u3001transition_out\u3001image_prompt\u3002",
        "\u6BCF\u4E2A\u573A\u666F\u5FC5\u987B\u8FD4\u56DE scene_variants\uFF1A\u7B2C 1 \u5F20\u662F\u4E3B\u573A\u666F\u9996\u5E27\uFF0C\u5176\u4F59\u6309\u8BE5\u573A\u7684\u5267\u60C5\u8282\u62CD\u751F\u6210 1-4 \u4E2A\u7A7A\u73AF\u5883\u673A\u4F4D\u53D8\u4F53\uFF1B\u6BCF\u4E2A\u53D8\u4F53\u5FC5\u987B\u7ED1\u5B9A source_beat_ids\u3001beat_summary\u3001camera_empty_frame\u3001spatial_framing\u3001image_prompt\uFF0C\u4E0D\u5F97\u6539\u53D8\u5730\u70B9\u3001\u65F6\u6BB5\u3001\u5929\u6C14\u3001\u5E03\u666F\u548C\u8272\u8C03\u3002",
        "\u573A\u666F\u5305\u91CC\u6240\u6709\u56FE\u7247\u90FD\u662F\u7EAF\u7A7A\u73AF\u5883\u8D44\u4EA7\uFF0C\u4E0D\u51FA\u73B0\u4EBA\u7269\uFF1B\u89D2\u8272\u3001\u7AD9\u4F4D\u3001\u59FF\u6001\u3001\u8868\u60C5\u3001\u52A8\u4F5C\u3001\u5BF9\u767D\u548C\u8FD0\u955C\u53EA\u5728\u5206\u955C\u9636\u6BB5\u52A0\u5165\u3002",
        '\u4E25\u683C JSON\uFF1A{"scenes":[{"scene_id":"scene-01","title":"...","source_beat_ids":["BEAT-01"],"location":"...","time":"...","weather":"...","visual_anchors":["..."],"environment":"...","set_dressing":"...","lighting":"...","terrain":"...","spatial_framing":"...","camera_empty_frame":"...","transition_out":"...","image_prompt":"English primary empty environment prompt","scene_variants":[{"variant_id":"scene-01-variant-01","title":"\u4E3B\u573A\u666F\u9996\u5E27","is_primary":true,"source_beat_ids":["BEAT-01"],"beat_summary":"...","camera_empty_frame":"...","spatial_framing":"...","image_prompt":"..."},{"variant_id":"scene-01-variant-02","title":"\u5267\u60C5\u8282\u62CD 2","source_beat_ids":["BEAT-02"],"beat_summary":"...","camera_empty_frame":"...","spatial_framing":"...","image_prompt":"..."}]}],"quality_check":{"only_script_locations":true,"no_characters_in_scene_images":true}}\u3002'
      ].join("\n");
      const basePrompt = [
        O.adapter.wrapScenePrompt(original, scriptWithIds, characterLineage, a.styleLock),
        JiarenIntentLockText(intentLock, original),
        sceneSchema
      ].join("\n\n");
      let plannedScenes;
      let lastError;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const content = await Rn(
            e,
            attempt === 0 ? basePrompt : `${basePrompt}

\u4E0A\u4E00\u6B21\u573A\u666F\u6821\u9A8C\u5931\u8D25\uFF1A${lastError?.message || lastError}\u3002\u8BF7\u53EA\u91CD\u5199 scenes[]\uFF0C\u4E0D\u8981\u89E3\u91CA\u3002`,
            {
              includeReferences: false,
              contextOverride: [
                JiarenIntentLockText(intentLock, original),
                `\u5B8C\u6574\u786E\u8BA4\u5267\u672C\uFF1A
${scriptWithIds}`
              ].join("\n\n")
            }
          );
          const record = un(content);
          const rawScenes = ur(record, [
            "scenes",
            "scene_plan",
            "scenePlan",
            "locations",
            "environments"
          ]);
          plannedScenes = JiarenNormalizeScenePlan(rawScenes, intentLock, {
            originalRequest: original,
            expectedBeatIds,
            productionBeats
          });
          break;
        } catch (error) {
          lastError = error;
        }
      }
      if (!plannedScenes?.length) {
        throw new Error(`\u573A\u666F Agent \u4E24\u6B21\u90FD\u672A\u901A\u8FC7\u5BFC\u6F14\u610F\u56FE\u6821\u9A8C\uFF1A${lastError?.message || lastError}`);
      }
      const previousScenes = Oe.find((node) => node.step === "scene")?.payload?.scenes || [];
      const scenes = [];
      let modelLabel = r.model;
      for (const scene of plannedScenes) {
        const reused = previousScenes.find(
          (candidate) => candidate.imageUrl && ((candidate.id || candidate.sceneId) === scene.sceneId || candidate.title === scene.title)
        );
        const plannedVariants = Array.isArray(scene.sceneVariants) && scene.sceneVariants.length ? scene.sceneVariants : [{ id: scene.primaryVariantId || `${scene.sceneId}-variant-01`, variantId: scene.primaryVariantId || `${scene.sceneId}-variant-01`, sceneId: scene.sceneId, title: "\u4E3B\u573A\u666F\u9996\u5E27", sequenceIndex: 0, isPrimary: true, sourceBeatIds: scene.sourceBeatIds, imagePrompt: scene.imagePrompt }];
        const reusedVariants = Array.isArray(reused == null ? void 0 : reused.sceneVariants) ? reused.sceneVariants : [];
        const sceneVariants = [];
        for (let variantIndex = 0; variantIndex < plannedVariants.length; variantIndex += 1) {
          const variant = plannedVariants[variantIndex], reusedVariant = reusedVariants.find((candidate) => candidate.imageUrl && ((candidate.variantId || candidate.id) === (variant.variantId || variant.id) || candidate.title === variant.title));
          if (reusedVariant != null && reusedVariant.imageUrl) {
            sceneVariants.push({ ...variant, imageUrl: reusedVariant.imageUrl });
            ke("scene", { phase: "running", message: `\u5DF2\u4FDD\u7559 ${scene.title} \u7684\u7A7A\u73AF\u5883 ${variantIndex + 1}/${plannedVariants.length}\uFF1A${variant.title}` });
            continue;
          }
          if (variantIndex === 0 && (reused == null ? void 0 : reused.imageUrl)) {
            sceneVariants.push({ ...variant, imageUrl: reused.imageUrl });
            continue;
          }
          ke("scene", { phase: "running", message: `\u6B63\u5728\u751F\u6210 ${scene.title} \u7684\u7A7A\u73AF\u5883 ${variantIndex + 1}/${plannedVariants.length}\uFF1A${variant.title}` });
          const imagePrompt = [tn(a.styleLock, "scene environment plate", original), variant.imagePrompt || scene.imagePrompt].filter(Boolean).join("\n"), image = await xt($(imagePrompt, 2800), O.runtimeParams.aspect_ratio, sceneVariants[0]?.imageUrl ? [sceneVariants[0].imageUrl] : [], { includeWorkbenchReferences: false, strictGptImage2: false }), imageUrl = Re(image.asset);
          if (!imageUrl) throw new Error(`\u573A\u666F\u300C${scene.title}\u300D\u7684\u7A7A\u73AF\u5883\u53D8\u4F53\u300C${variant.title}\u300D\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u56FE\u7247\u3002`);
          modelLabel = image.modelLabel || modelLabel, sceneVariants.push({ ...variant, imageUrl });
          const partialScene = { ...scene, imageUrl: sceneVariants[0].imageUrl, sceneVariants: [...sceneVariants] };
          const nextScenes = [...scenes, partialScene];
          Za(e, { ...a, intentLock, modelLabel, scenes: nextScenes });
        }
        if (sceneVariants.length) {
          scenes.push({ ...scene, imageUrl: sceneVariants[0].imageUrl, sceneVariants });
          ke("scene", {
            phase: "running",
            message: `\u573A\u666F\u5305 ${scenes.length}/${plannedScenes.length} \u5DF2\u5B8C\u6210\uFF1A${scene.title}\uFF0C${sceneVariants.length} \u5F20\u72EC\u7ACB\u7A7A\u73AF\u5883\u56FE`
          });
        }
        Za(e, { ...a, intentLock, modelLabel, scenes: [...scenes] });
      }
      return gt(e, { ...a, intentLock, modelLabel, scenes });
    }
    if (e === "storyboard") {
      const scriptSettings = JiarenBuildScriptSettingManifest(a.productionBeats, a.script), Y = await Ho(a), ne = Oe.find((V) => V.step === "storyboard"), ae = (ne == null ? void 0 : ne.payload.shots) ?? [], de = ae.some((V) => !!V.storyboardImageUrl), $e = ae.some((V) => !!V.storyboardImageUrl && !V.videoUrl), J = ae.length < Y.length || Y.some((V, G) => {
        var N, Se, re;
        const W = ae[G];
        const expectedPanels = Math.max(1, Math.min(16, Number(V.panelCount) || Number(W?.panelCount) || 4));
        return W != null && W.storyboardImageUrl ? rt === "grid" && ((((N = W.microSlices) == null ? void 0 : N.length) || 0) < expectedPanels || (((Se = W.storyboardPanelUrls) == null ? void 0 : Se.length) || 0) < expectedPanels || (((re = W.storyboardNodes) == null ? void 0 : re.length) || 0) < expectedPanels) : true;
      });
      if (de && $e && !J) {
        const V = [...ae];
        let G = "";
        for (let W = 0; W < ae.length; W += 1) {
          const N = ae[W];
          if (!N.storyboardImageUrl || N.videoUrl) continue;
          const Se = fr(N, W, scriptSettings), re = ((x = V[W - 1]) == null ? void 0 : x.videoUrl) || ((M = ae[W - 1]) == null ? void 0 : M.videoUrl), Me = ((U = V[W - 1]) == null ? void 0 : U.lastFrameImageUrl) || ((le = ae[W - 1]) == null ? void 0 : le.lastFrameImageUrl), ht = wr(a, V, W), L = kr(JiarenShotCharacterImages(a, N), void 0, [N.storyboardImageUrl].filter(Boolean), Me, 9, ht, JiarenShotPropImages(a, N)), ue = jr(N, W, Se, a, V);
          if (Ot(W, { videoPending: true, videoStatus: `\u6B63\u5728\u751F\u6210 ${W + 1}/${ae.length}` }), ke("storyboard", { phase: "running", message: `\u5206\u955C\u52A8\u753B\u5E08\u6B63\u5728\u8BA9\u7B2C ${W + 1}/${ae.length} \u6761\u786E\u8BA4\u5206\u955C\u52A8\u8D77\u6765\uFF0C\u6210\u529F\u4E00\u6761\u4F1A\u5148\u56DE\u663E\u4E00\u6761\u3002` }), rt === "grid" && (N.storyboardGridUrl || (be = N.storyboardPanelUrls) != null && be.length) && (((Ie = N.microSlices) == null ? void 0 : Ie.length) || 0) > 1) {
            const he = await ts(N, W, Se, a, V, Me, re);
            G = he.modelLabel;
            V[W] = {
              ...N,
              storyboardPanelUrls: he.storyboardPanelUrls,
              storyboardNodes: he.storyboardNodes,
              panelVideoUrls: he.panelVideoUrls,
              panelVideoTasks: he.panelVideoTasks,
              videoPending: false,
              videoStatus: `\u5DF2\u6309 ${he.storyboardNodes.length} \u4E2A\u5206\u955C\u7247\u6BB5\u987A\u5E8F\u751F\u6210\u5E76\u5408\u6210\u955C\u5934`,
              videoUrl: he.videoUrl,
              lastFrameImageUrl: he.lastFrameImageUrl || N.lastFrameImageUrl
            };
          } else {
            const savedVideoTask = {
              taskId: N.videoTaskId,
              taskProvider: N.videoTaskProvider,
              pollUrl: N.videoPollUrl,
              status: N.videoTaskStatus
            }, he = await Cr(ue, L, a, {
              shotTitle: N.title || `\u955C\u5934 ${W + 1}`,
              durationSeconds: ua(N),
              previousVideoSource: re,
              shotCount: N.microSlices?.length || 1,
              storyboardReferenceCount: 1,
              referenceMode: "reference",
              storyboardMode: "multi-reference",
              referenceProfile: "direct-storyboard",
              resumeTaskId: savedVideoTask.taskId && savedVideoTask.status !== "failed" ? savedVideoTask.taskId : void 0,
              resumeTaskProvider: savedVideoTask.taskProvider,
              resumePollUrl: savedVideoTask.pollUrl,
              signal: videoRunAbortRef.current?.signal,
              onTaskState: (state) => {
                const taskPatch = {
                  videoTaskId: state.taskId || savedVideoTask.taskId,
                  videoTaskProvider: state.taskProvider || savedVideoTask.taskProvider,
                  videoPollUrl: state.pollUrl || savedVideoTask.pollUrl,
                  videoTaskStatus: state.status,
                  videoTaskError: state.error || null,
                  videoTaskProgress: state.progress,
                  videoPending: state.status !== "success",
                  videoStatus: state.status === "polling" ? `\u4EFB\u52A1\u5DF2\u63D0\u4EA4 \xB7 ${state.progress || "\u67E5\u8BE2\u4E2D"}` : state.status === "cancelled" ? "\u5DF2\u505C\u6B62\uFF1B\u4EFB\u52A1 ID \u5DF2\u4FDD\u7559" : state.status === "error" || state.status === "failed" ? "\u751F\u6210\u5931\u8D25\uFF0C\u53EF\u4ECE\u5F53\u524D\u955C\u5934\u91CD\u8BD5" : "\u89C6\u9891\u5DF2\u8FD4\u56DE"
                };
                V[W] = { ...V[W] || N, ...taskPatch };
                Ot(W, taskPatch);
              }
            });
            G = he.modelLabel;
            V[W] = {
              ...N,
              videoPending: false,
              videoStatus: "\u5DF2\u751F\u6210",
              videoTaskId: he.taskId || N.videoTaskId,
              videoTaskProvider: he.taskProvider || N.videoTaskProvider,
              videoPollUrl: he.pollUrl || N.videoPollUrl,
              videoTaskStatus: "success",
              videoTaskError: null,
              videoTaskProgress: "100%",
              videoUrl: Re(he.asset),
              lastFrameImageUrl: Re(he.lastFrameAsset) || N.lastFrameImageUrl
            };
          }
          Ot(W, V[W], G), m(`\u7B2C ${W + 1}/${ae.length} \u6761\u5206\u955C\u89C6\u9891\u5DF2\u8FD4\u56DE\uFF0C\u5DF2\u5199\u5165\u753B\u5E03\u3002`);
        }
        return gt(e, { ...a, modelLabel: G ? `${(ne == null ? void 0 : ne.payload.modelLabel) || r.model} + ${G}` : (ne == null ? void 0 : ne.payload.modelLabel) || r.model, shots: V });
      }
      if (de && !$e && !J) return gt(e, a);
      const ie = Y;
      let oe = r.model;
      const D = ae.length ? [...ae] : [];
      for (let V = 0; V < ie.length; V += 1) {
        const G = ie[V], W = ae[V];
        ke("storyboard", { phase: "running", message: W != null && W.storyboardImageUrl ? `\u5206\u955C\u52A8\u753B\u5E08\u5DF2\u4FDD\u7559\u5DF2\u6709\u5206\u955C\u56FE ${V + 1}/${ie.length}\uFF1A${G.title}` : `\u5206\u955C\u52A8\u753B\u5E08\u6B63\u5728\u4ECE\u65AD\u70B9\u751F\u6210\u5206\u955C\u56FE ${V + 1}/${ie.length}\uFF1A${G.title}` });
        const N = fr(G, V, scriptSettings), Se = void 0, re = N ? yr(N.sequenceIndex ?? V, N, a.script) : a.script[V] || a.script[Math.min(V, Math.max(0, a.script.length - 1))] || "", Me = wt(O.runtimeParams.userIdea, `${G.prompt}
${G.videoPrompt || ""}
${re}`), ht = ka(O.runtimeParams.userIdea, `${G.videoPrompt || ""}
${G.prompt}`, a, N), L = De(a.character.name) || "\u4E3B\u89D2", ue = We(L, a.character.appearance, a.character.description, O.runtimeParams.userIdea, `${ht}
${re}`, (ye = a.styleLock) == null ? void 0 : ye.label), he = [tn(a.styleLock, "storyboard keyframe", a.intentLock?.original || a.studioConfig?.userIdea), O.adapter.wrapImagePrompt([JiarenStoryboardImageContract(G, V, N, a, re, "keyframe"), `Create one approved cinematic storyboard keyframe for shot ${V + 1}, not a multi-panel grid.`, Me.lockText, Me.requiredVisual.length ? `The visible keyframe must prove the text-image match: ${Me.requiredVisual.join("; ")}.` : "", Me.negativeText.length ? `Forbidden in the keyframe: ${Me.negativeText.join("; ")}.` : "", "Composition contract: direct storyboard mode. The current shot text is the source of truth and already contains location, protagonist, action, framing and camera movement.", _n(a, N, `${ht}
 ${re}`), "Follow the confirmed script and this shot notice. Do not require a separate scene card or role card.", "Do not invent any location, time, weather, character, pose, or media style that is absent from the director intent lock and script-bound setting facts.", `Shot title: ${G.title}.`, `Time range: ${G.timecode}.`, N != null && N.sceneChainKey ? `Setting timeline key: ${N.sceneChainKey}. Follow the script order exactly.` : "", "Required shot language: shot size, focal length, depth of field with clear subject and softer background, camera position/angle, camera movement, subject placement, outfit/prop/action details, environment lighting, atmosphere, and VFX details.", `Shot action: ${ht}.`, N ? `Script-bound setting facts: ${N.title}; ${N.description || N.environment || ""}. ${gn(N)}` : "", N != null && N.spatialFraming ? `Keep composition: ${N.spatialFraming}.` : "", N != null && N.camera ? `Keep camera grammar: ${N.camera}.` : "", re ? `Script beat: ${$(re, 320)}.` : "", G.continuityPrompt ? `Continuity: ${G.continuityPrompt}.` : "", `Character identity must match exactly: ${ue}.`, rt === "grid" ? "Use the approved storyboard sequence only as camera planning logic; output this single shot frame only." : "Use multi-reference identity lock; output this single shot frame only."].filter(Boolean).join(`
`), "storyboard keyframe", a.styleLock), Me.negativePrompt, "No UI, no subtitles, no watermarks. Single frame. Do not duplicate other shots. Match the confirmed script and scene."].join(`
`), Ke = _t([...JiarenShotCharacterImages(a, G, true), ...JiarenShotPropImages(a, G), ...Le.map((Te) => Te.source)], 6);
        let je = W == null ? void 0 : W.storyboardImageUrl;
        if (!je) {
          const Te = await xt($(he, 3200), O.runtimeParams.aspect_ratio, Ke, { includeWorkbenchReferences: false });
          oe = Te.modelLabel, je = Re(Te.asset);
        }
        if (!je) throw new Error(`\u955C\u5934 ${V + 1} \u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u5206\u955C\u56FE\u3002`);
        const Fe = await Zo({ ...G, storyboardPanelUrls: W == null ? void 0 : W.storyboardPanelUrls }, V, je, N, a, Se);
        oe = Fe.modelLabel || oe;
        let fe = W == null ? void 0 : W.storyboardGridUrl;
        fe = void 0;
        const sceneVariant = JiarenSceneVariantForShot(N, G), previousPanelIds = Array.isArray(W == null ? void 0 : W.storyboardPanelIds) && W.storyboardPanelIds.length === Fe.panelUrls.length ? W.storyboardPanelIds : Fe.panelUrls.map((_2, panelIndex) => `shot-${V + 1}-panel-${panelIndex + 1}`), previousCaptions = Array.isArray(W == null ? void 0 : W.storyboardCaptions) && W.storyboardCaptions.length === Fe.panelUrls.length ? W.storyboardCaptions : Fe.panelUrls.map((_2, panelIndex) => panelIndex === 0 ? G.dialogue || "" : ""), Zt = { ...G, title: G.title, timecode: G.timecode, prompt: G.prompt || G.videoPrompt || G.title || `\u955C\u5934 ${V + 1}`, videoPrompt: G.videoPrompt, continuityPrompt: G.continuityPrompt, beats: G.beats, microSlices: G.microSlices, storyboardGridUrl: fe, storyboardImageUrl: je, storyboardPanelUrls: Fe.panelUrls, storyboardPanelIds: previousPanelIds, storyboardCaptions: previousCaptions, storyboardNodes: xr({ ...G, storyboardPanelUrls: Fe.panelUrls, storyboardPanelIds: previousPanelIds, storyboardCaptions: previousCaptions, storyboardNodes: W == null ? void 0 : W.storyboardNodes }, V, Fe.panelUrls, N), sceneTitle: N == null ? void 0 : N.title, sceneImageUrl: void 0, sceneVariantId: (sceneVariant == null ? void 0 : sceneVariant.variantId) || (sceneVariant == null ? void 0 : sceneVariant.id) || G.sceneVariantId, sceneVariantTitle: (sceneVariant == null ? void 0 : sceneVariant.title) || G.sceneVariantTitle, sceneVariantImageUrl: void 0, sceneAngleGridUrl: void 0, videoPending: true };
        D[V] = Zt, Za(e, { ...a, modelLabel: oe, shots: D.filter(Boolean) });
      }
      return gt(e, { ...a, modelLabel: oe, shots: D.filter(Boolean) });
    }
    if (e === "audio") {
      const Y = await Rn(e, O.adapter.wrapAudioPrompt(o, a.script.join(`
`), a.shots.map((de) => `${de.title}:${de.prompt}`).join(`
`))), ne = un(Y), ae = O.adapter.wrapAudioConfig();
      return gt(e, { ...a, modelLabel: Ft(ln.audio, r.model), audio: { music: tt(ne, ["music"], ae.bgm_style), sfx: tt(ne, ["sfx", "sound_effects"], "\u7B49\u5F85\u73AF\u5883\u97F3\u6548\u65B9\u6848\u3002"), prompt: tt(ne, ["prompt", "suno_prompt"], `${ae.bgm_style}. ${ae.vibe_tag}. ${ae.language}.`) } });
    }
    const s = a.shots.map((Y, ne) => ({ title: Y.title || `\u955C\u5934 ${ne + 1}`, source: Y.videoUrl || "" })).filter((Y) => Y.source.trim());
    if (s.length === 0) throw new Error("\u6CA1\u6709\u53EF\u5408\u6210\u7684\u89C6\u9891\u7ED3\u679C\uFF0C\u8BF7\u5148\u8BA9\u5206\u955C\u6B65\u9AA4\u8FD4\u56DE\u89C6\u9891\u3002");
    if (s.length < a.shots.length) throw new Error(`\u8FD8\u6709 ${a.shots.length - s.length} \u4E2A\u5206\u955C\u89C6\u9891\u6CA1\u6709\u8FD4\u56DE\uFF0C\u4E0D\u80FD\u63D0\u524D\u8F93\u51FA\u5B8C\u6574\u6210\u7247\u3002`);
    const d = await ((ge = window.jiaren) == null ? void 0 : ge.system.composeVideo({ clips: s, outputName: `jiaren_final_master_${Date.now()}.mp4`, cacheDir: F.cacheDir, downloadsDir: F.downloadsDir }));
    if (!(d != null && d.ok) || !d.asset) throw new Error((d == null ? void 0 : d.message) || "\u5B8C\u6574\u89C6\u9891\u5408\u6210\u5931\u8D25\u3002");
    const l = Re(d.asset);
    if (!l) throw new Error("\u5B8C\u6574\u89C6\u9891\u5408\u6210\u8FD4\u56DE\u4E3A\u7A7A\u3002");
    const p = We(a.character.name, a.character.appearance, a.character.description, O.runtimeParams.userIdea, a.script.join(`
`), (pt = a.styleLock) == null ? void 0 : pt.label), h = await Rn(e, `\u8BF7\u5BF9\u4EE5\u4E0B\u8D44\u4EA7\u505A\u6210\u7247\u8D28\u68C0\u5E76\u8F93\u51FA JSON\uFF1A{"note":"...","missing":["..."]}\u3002
\u5267\u672C\uFF1A${a.script.join(`
`)}
\u89D2\u8272\uFF1A${p}
\u5267\u672C\u5730\u70B9\u8FDE\u7EED\u6027\uFF1A${JiarenBuildScriptSettingManifest(a.productionBeats, a.script).map((Y) => Y.title).join(" / ")}
\u89C6\u9891\u7247\u6BB5\uFF1A${s.map((Y) => `${Y.title}:${Y.source}`).join(`
`)}
\u5B8C\u6574\u6210\u7247\uFF1A${l}
\u97F3\u9891\u65B9\u6848\uFF1A${a.audio.music} ${a.audio.sfx}`), g = un(h);
    return gt(e, { ...a, modelLabel: Ft(ln.chat, r.model), final: { videoUrl: l, note: tt(g, ["note", "summary"], d.message || `\u5DF2\u5408\u6210 ${s.length} \u4E2A\u7247\u6BB5\u4E3A\u5B8C\u6574\u6210\u7247\u3002`) } });
  }
  function stopVideoRun() {
    const controller = videoRunAbortRef.current;
    if (!controller) return;
    controller.abort();
    videoRunAbortRef.current = null;
    ke("storyboard", {
      phase: "failed",
      message: "\u5DF2\u505C\u6B62\u751F\u6210\uFF1B\u6210\u529F\u955C\u5934\u548C\u5DF2\u63D0\u4EA4\u4EFB\u52A1 ID \u5747\u5DF2\u4FDD\u7559\uFF0C\u53EF\u70B9\u91CD\u8BD5\u7EE7\u7EED\u67E5\u8BE2\u3002"
    });
    m("\u5DF2\u505C\u6B62\u89C6\u9891\u751F\u6210\u3002\u4E0D\u4F1A\u91CD\u590D\u63D0\u4EA4\u5DF2\u6210\u529F\u955C\u5934\uFF0C\u672A\u5B8C\u6210\u4EFB\u52A1\u53EF\u4ECE\u539F taskId \u7EE7\u7EED\u67E5\u8BE2\u3002");
  }
  async function gs() {
    if (!Ye) {
      await ca();
      return;
    }
    if (Je) {
      Ja();
      return;
    }
    if (yt[ce].phase === "running") {
      if (ce === "storyboard") stopVideoRun();
      return;
    }
    const e = async (l) => {
      const p = Wa(l);
      ke(l, { phase: "running", message: "\u751F\u6210\u4E2D\uFF0C\u8BF7\u7B49\u5F85\u7ED3\u679C\u8FD4\u56DE..." });
      m(`${ut[p].agent} \u6B63\u5728\u751F\u6210\u3002\u6210\u529F\u8FD4\u56DE\u524D\u4E0D\u4F1A\u65B0\u589E\u753B\u5E03\u5185\u5BB9\u3002`);
      try {
        const h = await ms(l);
        kt((y) => [...y.filter((j) => j.step !== l), h]);
        const g = l === "storyboard" && h.payload.shots.some((y) => y.storyboardImageUrl && !y.videoUrl);
        if (ke(l, {
          phase: "ready",
          message: g ? "\u5206\u955C\u5DF2\u8FD4\u56DE\uFF0C\u7B49\u5F85\u786E\u8BA4\u751F\u6210\u89C6\u9891\u3002" : "\u5DF2\u8FD4\u56DE\uFF0C\u7B49\u5F85\u786E\u8BA4\u63A8\u8FDB\u3002"
        }), m(
          l === "final" ? "\u6210\u7247\u8F93\u51FA\u5DF2\u751F\u6210\u3002" : l === "storyboard" && g ? "\u5206\u955C\u56FE\u548C\u955C\u5934\u65B9\u6848\u5DF2\u8FD4\u56DE\uFF0C\u7B49\u5F85\u603B\u5BFC\u6F14\u786E\u8BA4\u3002" : `\u300C${h.title}\u300D\u5DF2\u8FD4\u56DE\u5E76\u52A0\u5165\u753B\u5E03\u3002`
        ), l === "setup") {
          const y = On[0];
          y && (Ht(y), ft(false), m("\u827A\u672F\u603B\u76D1\u5DF2\u5B8C\u6210\u53C2\u6570\u7EDF\u8BA1\uFF0C\u5DF2\u81EA\u52A8\u6FC0\u6D3B\u7F16\u5267\u3002"));
        }
        return h;
      } catch (h) {
        const stopped = /用户已停止/.test(String(h?.message || h));
        if (stopped) {
          ke(l, {
            phase: "failed",
            message: "\u5DF2\u505C\u6B62\u751F\u6210\uFF1B\u6210\u529F\u955C\u5934\u548C\u5DF2\u63D0\u4EA4\u4EFB\u52A1 ID \u5747\u5DF2\u4FDD\u7559\uFF0C\u53EF\u70B9\u91CD\u8BD5\u7EE7\u7EED\u67E5\u8BE2\u3002"
          });
          m("\u5DF2\u505C\u6B62\u89C6\u9891\u751F\u6210\uFF1B\u5DF2\u5B8C\u6210\u955C\u5934\u4E0D\u4F1A\u91CD\u65B0\u63D0\u4EA4\u3002");
          return;
        }
        const g = ti(h);
        ke(l, { phase: "failed", message: `\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\uFF1A${g}` });
        m(`\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\uFF1A${g}`);
        return;
      }
    }, r = Wa(ce), a = Oe.some((l) => l.step === ce), o = Oe.find((l) => l.step === ce), s = ce === "storyboard" && !!o?.payload.shots.some((l) => l.storyboardImageUrl && !l.videoUrl);
    if (a && ce === "final") {
      m("\u6210\u7247\u8F93\u51FA\u5DF2\u751F\u6210\uFF0C\u53EF\u4EE5\u6253\u5F00\u6216\u4E0B\u8F7D\u89C6\u9891\u3002");
      return;
    }
    if (s) {
      if (!Oa) {
        $n(true);
        ke("storyboard", {
          phase: "ready",
          message: "\u5206\u955C\u65B9\u6848\u5DF2\u786E\u8BA4\u3002\u8BF7\u518D\u6B21\u70B9\u51FB\u6309\u94AE\uFF0C\u5F00\u59CB\u8C03\u7528\u89C6\u9891\u6A21\u578B\u3002"
        });
        m("\u5DF2\u786E\u8BA4\u5206\u955C\u56FE\u548C\u955C\u5934\u65B9\u6848\uFF1B\u4E0B\u4E00\u6B21\u70B9\u51FB\u624D\u4F1A\u63D0\u4EA4\u89C6\u9891\u6A21\u578B\u3002");
        return;
      }
      const controller = new AbortController();
      videoRunAbortRef.current = controller;
      let storyboardResult;
      try {
        storyboardResult = await e("storyboard");
      } finally {
        if (videoRunAbortRef.current === controller)
          videoRunAbortRef.current = null;
      }
      if (!storyboardResult) return;
      $n(false);
      m("\u5206\u955C\u89C6\u9891\u5DF2\u6309\u955C\u5934\u56DE\u663E\u3002\u786E\u8BA4\u540E\u8FDB\u5165\u6210\u7247\u8F93\u51FA\u3002");
      return;
    }
    if (a) {
      const l = rr(ce);
      if (l) {
        Ht(l);
        ft(false);
        const p = ut.find((h) => h.id === l);
        m(`\u5DF2\u786E\u8BA4\u300C${ut[r].nodeTitle}\u300D\uFF0C\u73B0\u5728\u8FDB\u5165\u300C${p?.agent || "\u4E0B\u4E00\u6B65"}\u300D\u3002`);
      } else m("\u52A8\u753B\u751F\u4EA7\u6D41\u5DF2\u8D70\u5B8C\u6210\u7247\u8F93\u51FA\u3002");
      return;
    }
    await e(ce);
  }
  function Tn(e = ce) {
    if (Je) {
      const r = JiarenStoredSourceIdea(lockedSourceRef.current, Je),
        a = JiarenRevisionOnlyText(Xe, r);
      if (!r) {
        m("\u539F\u59CB\u5C0F\u8BF4/\u9700\u6C42\u5DF2\u4E22\u5931\uFF0C\u5DF2\u963B\u6B62\u91CD\u505A\uFF0C\u8BF7\u91CD\u65B0\u7C98\u8D34\u539F\u6587\u3002");
        return;
      }
      lockedSourceRef.current = r;
      cn(void 0), ca(r, a);
      return;
    }
    const r = qa(e);
    Ht(e), kt((a) => a.filter((o) => On.includes(o.step) && qa(o.step) < r)), e === "storyboard" && $n(false), Zn((a) => {
      const o = { ...a };
      return or().slice(r).forEach((s) => {
        o[s.id] = { phase: "idle", message: s.id === e ? "\u5DF2\u8FDB\u5165\u4FEE\u6539\u6A21\u5F0F\uFF0C\u8BF7\u8F93\u5165\u4FEE\u6539\u610F\u89C1\u540E\u91CD\u65B0\u751F\u6210\u3002" : void 0 };
      }), o;
    }), m("\u5DF2\u56DE\u5230\u5F53\u524D\u4FEE\u6539\u6A21\u5F0F\u3002\u8F93\u5165\u4FEE\u6539\u610F\u89C1\u540E\u91CD\u65B0\u751F\u6210\uFF0C\u4E0D\u4F1A\u65B0\u589E\u7A7A\u767D\u5185\u5BB9\u3002");
  }
  function ha(e) {
    return e === "image" ? Bn : e === "video" ? ot : e === "music" ? St : st;
  }
  function fa(e) {
    return e === "image" ? Fa : e === "video" ? vt : e === "music" ? Qa : ra;
  }
  function Ir(e, r) {
    e === "image" ? zn(r.id) : e === "video" ? Hn(r.id) : e === "music" ? Fi(r.id) : Oi(r.id), et(void 0);
  }
  function Ft(e, r) {
    return (e == null ? void 0 : e.alias) || (e == null ? void 0 : e.modelId) || (e == null ? void 0 : e.id) || r;
  }
  function hs() {
    if (Je) return "\u786E\u8BA4\u5267\u672C\u5E76\u5F00\u59CB\u5236\u4F5C";
    const e = Oe.some((s) => s.step === ce), r = Oe.find((s) => s.step === ce), a = ce === "storyboard" && !!r?.payload.shots.some((s) => s.storyboardImageUrl && !s.videoUrl), o = yt[ce];
    if (o.phase === "running")
      return ce === "storyboard" ? "\u505C\u6B62\u751F\u6210" : "\u751F\u6210\u4E2D...";
    if (e && ce === "final") return "\u6210\u7247\u5DF2\u751F\u6210";
    if (a) return Oa ? "\u5F00\u59CB\u751F\u6210\u89C6\u9891" : "\u786E\u8BA4\u5206\u955C\u65B9\u6848";
    if (ce === "character" && !oa && !e) return "\u5148\u9009\u62E9\u98CE\u683C";
    if (e) {
      const s = rr(ce), d = s ? ut.find((l) => l.id === s) : void 0;
      return d ? `\u786E\u8BA4\u5E76\u8FDB\u5165${d.shortLabel}` : "\u786E\u8BA4\u5B8C\u6210";
    }
    return o.phase === "failed" ? "\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5" : ce === "setup" ? "\u6FC0\u6D3B\u7F16\u5267" : ce === "script" ? "\u5F00\u59CB\u751F\u6210\u5267\u672C" : ce === "character" ? "\u5F00\u59CB\u751F\u6210\u89D2\u8272\u56FE" : ce === "scene" ? "\u5F00\u59CB\u751F\u6210\u7A7A\u73AF\u5883\u56FE" : ce === "storyboard" ? "\u5F00\u59CB\u751F\u6210\u5206\u955C\u56FE" : ce === "audio" ? "\u5F00\u59CB\u751F\u6210\u97F3\u9891\u65B9\u6848" : "\u5F00\u59CB\u6210\u7247\u8D28\u68C0";
  }
  function fs() {
    if (Je) return false;
    const e = Oe.some((a) => a.step === ce);
    return yt[ce].phase === "running" && ce !== "storyboard" || ce === "character" && !oa && !e;
  }
  function ys(e, r, a) {
    const o = yt[e];
    return o.phase === "running" ? "\u751F\u6210\u4E2D" : o.phase === "failed" ? "\u751F\u6210\u5931\u8D25" : a ? r ? "\u7B49\u5F85\u786E\u8BA4" : "\u5DF2\u786E\u8BA4" : r ? "\u7B49\u5F85\u542F\u52A8" : "\u6392\u961F\u4E2D";
  }
  function bs(e) {
    const r = yt[e.id];
    if (e.id === "character") return r.phase === "running" ? r.message || "我正在把定稿剧本里的主要角色整理成可复用的人设资产。" : r.phase === "failed" ? r.message || "角色资产生成失败，请从当前步骤重试。" : Oe.some((o) => o.step === "character") ? "角色资产已完成。确认后会直接交给分镜导演，与定稿剧本、道具资产和文字地点事实合成分镜。" : "我会先锁定主角的身份、五官、服装和识别点，再生成角色图。确认后直接进入分镜。";
    if (r.phase === "running") return r.message ? r.message : e.id === "scene" ? "\u6211\u6B63\u5728\u6309\u5267\u672C\u5730\u70B9\u642D\u5EFA\u7A7A\u73AF\u5883\u57FA\u5E95\uFF0C\u53EA\u9501\u5B9A\u7A7A\u95F4\u3001\u5149\u5F71\u3001\u5E03\u666F\u548C\u7A7A\u955C\u673A\u4F4D\uFF1B\u4EBA\u7269\u4F1A\u7559\u5230\u5206\u955C\u9636\u6BB5\u518D\u5408\u6210\u3002" : e.id === "character" ? "\u6211\u6B63\u5728\u628A\u5267\u672C\u91CC\u7684\u4E3B\u89D2\u6574\u7406\u6210\u53EF\u590D\u7528\u89D2\u8272\u8D44\u4EA7\uFF0C\u5148\u505A\u4EBA\u8BBE\u8840\u7EDF\uFF0C\u518D\u7B49\u89D2\u8272\u56FE\u8FD4\u56DE\u3002" : e.id === "storyboard" ? "\u6211\u5148\u751F\u6210\u5206\u955C\u56FE\u548C\u955C\u5934\u65B9\u6848\uFF1B\u4F60\u786E\u8BA4\u5206\u955C\u540E\uFF0C\u6211\u518D\u6309\u5DF2\u9009\u62E9\u7684\u89C6\u9891\u6A21\u578B\u751F\u6210\u89C6\u9891\u3002" : "\u6211\u6B63\u5728\u63A8\u7406\u8FD9\u4E00\u73AF\u8282\uFF0C\u7ED3\u679C\u56DE\u6765\u540E\u518D\u653E\u5230\u53F3\u4FA7\u753B\u5E03\u3002";
    if (r.phase === "failed") return r.message || "\u8FD9\u4E00\u6B65\u6CA1\u6709\u751F\u6210\u6210\u529F\uFF0C\u6211\u5148\u505C\u5728\u8FD9\u91CC\u3002\u4F60\u53EF\u4EE5\u70B9\u91CD\u8BD5\uFF0C\u6216\u8005\u628A\u8F93\u5165\u6846\u91CC\u7684\u65B9\u5411\u6539\u5F97\u66F4\u5177\u4F53\u4E00\u70B9\u3002";
    if (Oe.some((o) => o.step === e.id)) {
      if (e.id === "character") return "\u89D2\u8272\u56FE\u5DF2\u7ECF\u56DE\u6765\u4E86\u3002\u786E\u8BA4\u540E\u6211\u4F1A\u76F4\u63A5\u4EA4\u7ED9\u5206\u955C\u5BFC\u6F14\uFF0C\u4E0E\u5B9A\u7A3F\u5267\u672C\u3001\u9053\u5177\u8D44\u4EA7\u548C\u6587\u5B57\u5730\u70B9\u4E8B\u5B9E\u5408\u6210\u5206\u955C\u3002";
      if (e.id === "scene") return "\u7A7A\u73AF\u5883\u56FE\u5DF2\u7ECF\u56DE\u6765\u4E86\u3002\u786E\u8BA4\u540E\u6211\u4F1A\u4EA4\u7ED9\u5206\u955C\u52A8\u753B\u5E08\uFF0C\u628A\u7A7A\u73AF\u5883\u3001\u89D2\u8272\u548C\u955C\u5934\u811A\u672C\u5408\u6210\u5B8C\u6574\u5206\u955C\u3002";
      if (e.id === "storyboard") {
        const o = Oe.find((d) => d.step === "storyboard");
        return (o == null ? void 0 : o.payload.shots.some((d) => d.storyboardImageUrl && !d.videoUrl)) ? Oa ? "\u5206\u955C\u65B9\u6848\u5DF2\u7ECF\u786E\u8BA4\u3002\u4E0B\u4E00\u6B21\u63A8\u8FDB\u4F1A\u8C03\u7528\u5DF2\u9009\u62E9\u7684\u89C6\u9891\u6A21\u578B\u751F\u6210\u89C6\u9891\u3002" : "\u5206\u955C\u56FE\u548C\u955C\u5934\u65B9\u6848\u5DF2\u7ECF\u56DE\u6765\u4E86\u3002\u4F60\u5148\u786E\u8BA4\u5206\u955C\u65B9\u6848\uFF0C\u786E\u8BA4\u540E\u6211\u4ECD\u4F1A\u505C\u4E00\u4E0B\uFF0C\u518D\u7531\u4F60\u51B3\u5B9A\u662F\u5426\u751F\u6210\u89C6\u9891\u3002" : "\u89C6\u9891\u955C\u5934\u5DF2\u7ECF\u56DE\u6765\u4E86\u3002\u786E\u8BA4\u540E\u8FDB\u5165\u6210\u7247\u8F93\u51FA\u3002";
      }
      return "\u8FD9\u4E00\u73AF\u8282\u5DF2\u7ECF\u5B8C\u6210\u3002\u4F60\u786E\u8BA4\u540E\uFF0C\u6211\u518D\u628A\u8D44\u6599\u4EA4\u7ED9\u4E0B\u4E00\u6B65\u3002";
    }
    return e.id === "setup" ? "\u6211\u5148\u548C\u4F60\u628A\u7247\u5B50\u7684\u57FA\u672C\u65B9\u5411\u5B9A\u4E0B\u6765\uFF1A\u65F6\u957F\u3001\u6BD4\u4F8B\u3001\u8BED\u8A00\u548C\u60C5\u7EEA\u3002\u4F60\u9009\u5B8C\u540E\uFF0C\u6211\u518D\u628A\u8FD9\u4E9B\u8981\u6C42\u53D1\u7ED9\u7F16\u5267\u548C\u5206\u955C\u3002" : e.id === "script" ? "\u6211\u4F1A\u628A\u4F60\u7684\u60F3\u6CD5\u62C6\u6210\u80FD\u62CD\u7684\u77ED\u7247\u5267\u672C\u3002\u4F60\u786E\u8BA4\u5267\u672C\u540E\uFF0C\u53F3\u4FA7\u753B\u5E03\u4F1A\u7EE7\u7EED\u751F\u6210\u5206\u955C\u6A21\u5757\u3002" : e.id === "character" ? "\u6211\u4F1A\u5148\u63D0\u70BC\u4E3B\u89D2\u7684\u8EAB\u4EFD\u3001\u8138\u3001\u670D\u88C5\u548C\u8BC6\u522B\u70B9\uFF0C\u518D\u751F\u6210\u89D2\u8272\u56FE\u3002\u4F60\u53EF\u4EE5\u5148\u9009\u4E00\u4E2A\u98CE\u683C\uFF0C\u6211\u4F1A\u6309\u8FD9\u4E2A\u65B9\u5411\u51FA\u56FE\u3002" : e.id === "scene" ? "\u6211\u4F1A\u6839\u636E\u5267\u672C\u5730\u70B9\u3001\u65F6\u6BB5\u3001\u9053\u5177\u548C\u5149\u5F71\u642D\u7A7A\u73AF\u5883\u7D20\u6750\uFF0C\u4E0D\u653E\u4EBA\u7269\uFF0C\u4E0D\u7EE7\u627F\u89D2\u8272\u56FE\uFF0C\u7ED9\u5206\u955C\u505A\u5E72\u51C0\u80CC\u666F\u57FA\u5E95\u3002" : e.id === "storyboard" ? `\u8FD9\u91CC\u4F60\u5148\u9009\u89C6\u9891\u6A21\u578B\u3002\u5F53\u524D\u5DF2\u9009\u62E9 ${So}\uFF0C\u6211\u4F1A\u5148\u51FA\u5BAB\u683C\u673A\u4F4D\uFF1B\u4F60\u786E\u8BA4\u5206\u955C\u540E\u624D\u751F\u6210\u89C6\u9891\u3002` : e.id === "audio" ? "\u6211\u4F1A\u6309\u5F71\u7247\u60C5\u7EEA\u914D\u97F3\u4E50\u65B9\u5411\u3001\u73AF\u5883\u58F0\u548C\u5BF9\u767D\u8282\u594F\uFF0C\u786E\u8BA4\u540E\u518D\u8FDB\u5165\u6210\u7247\u5408\u6210\u68C0\u67E5\u3002" : "\u6211\u4F1A\u68C0\u67E5\u5206\u955C\u89C6\u9891\u662F\u5426\u5B8C\u6574\u8FD4\u56DE\uFF0C\u628A\u80FD\u4EA4\u4ED8\u7684\u6210\u7247\u7ED3\u679C\u653E\u5230\u6700\u7EC8\u4EA4\u4ED8\u91CC\u3002";
  }
  function vs(e) {
    const r = Oe.find((a) => a.step === e.id);
    if (e.id === "character") return "角色资产完成后，会连同定稿剧本、道具和文字地点事实直接交给分镜导演。";
    return e.id === "setup" ? "\u5BFC\u6F14\uFF0C\u5DE5\u4F5C\u6D41\u6FC0\u6D3B\u5B8C\u6210\u3002\u672C\u5730\u6982\u5FF5\u5305\u4E0E\u5F71\u7247\u89C4\u683C\u5DF2\u7ECF\u9501\u5B9A\uFF0C\u5E76\u5E7F\u64AD\u5230\u4E0B\u6E38\u5168\u94FE\u8DEF\u3002@\u7F16\u5267 \u8BF7\u7ACB\u523B\u4ECB\u5165\uFF0C\u5F00\u59CB\u7F16\u8BD1\u6838\u5FC3\u5267\u672C\u3002" : e.id === "script" ? "\u7F16\u5267\u5DF2\u8F93\u51FA\u53EF\u786E\u8BA4\u5267\u672C\u3002\u8BF7\u786E\u8BA4\u5267\u672C\u540E\u7EE7\u7EED\u3002@\u5206\u955C\u52A8\u753B\u5E08 \u8BF7\u51C6\u5907\u6309\u5267\u672C\u62C6\u955C\u5934\u3002" : e.id === "character" ? "\u89D2\u8272\u8D44\u4EA7\u5DF2\u5B8C\u6210\uFF0C\u5916\u89C2\u8840\u7EDF\u3001\u53C2\u8003\u56FE\u548C\u9053\u5177\u4FE1\u606F\u5DF2\u5C01\u5305\u3002@\u5206\u955C\u5BFC\u6F14 \u8BF7\u4F9D\u636E\u5B9A\u7A3F\u5267\u672C\u3001\u89D2\u8272\u8D44\u4EA7\u548C\u6587\u5B57\u5730\u70B9\u4E8B\u5B9E\u5F00\u59CB\u62C6\u955C\u3002" : e.id === "scene" ? "\u7A7A\u73AF\u5883 Keyframe \u5DF2\u56DE\u4F20\uFF0C\u7A7A\u95F4\u3001\u5E03\u666F\u3001\u5149\u5F71\u548C\u7A7A\u955C\u673A\u4F4D\u5DF2\u5C31\u4F4D\u3002@\u5206\u955C\u52A8\u753B\u5E08 \u8BF7\u63A5\u5165\u89D2\u8272\u8D44\u4EA7\u548C\u955C\u5934\u811A\u672C\u5B8C\u6210\u5408\u6210\u3002" : e.id === "storyboard" ? (r == null ? void 0 : r.payload.shots.some((o) => o.storyboardImageUrl && !o.videoUrl)) ? "\u5206\u955C\u56FE\u548C\u955C\u5934\u65B9\u6848\u5DF2\u56DE\u4F20\u3002\u8BF7\u5148\u786E\u8BA4\u955C\u5934\u903B\u8F91\uFF1B\u786E\u8BA4\u540E\u6211\u4F1A\u6309\u5DF2\u9009\u62E9\u7684\u89C6\u9891\u6A21\u578B\u9010\u955C\u5934\u751F\u6210\u89C6\u9891\u3002" : "\u5206\u955C\u89C6\u9891\u6D41\u5DF2\u56DE\u4F20\uFF0C\u6240\u6709\u5DF2\u786E\u8BA4\u955C\u5934\u90FD\u6302\u8F7D\u5230\u753B\u5E03\u3002\u786E\u8BA4\u540E\u8FDB\u5165\u6210\u7247\u8F93\u51FA\u3002" : e.id === "audio" ? "\u97F3\u9891\u6DF7\u5F55\u65B9\u6848\u5DF2\u5B8C\u6210\uFF0CBGM\u3001SFX \u4E0E\u5BF9\u767D\u8282\u594F\u5DF2\u5BF9\u9F50\u3002@\u827A\u672F\u603B\u76D1 \u8BF7\u8FDB\u884C\u7EC8\u88C5\u603B\u5BA1\u3002" : "\u603B\u88C5\u4EA4\u4ED8\u5DF2\u751F\u6210\u3002\u8BF7\u70B9\u51FB\u6210\u7247\u64AD\u653E\u5668\u9A8C\u6536\u4F5C\u54C1\u3002";
  }
  function js(e) {
    if (e === "character") return t.jsxs("div", { className: "jiaren-page1-agent-blueprint", "aria-label": "专家预设", children: [t.jsx("span", { children: "先锁人设" }), t.jsx("em", { children: "角色图返回并确认后直接进入分镜。" })] });
    const a = { setup: { title: "\u6211\u5148\u95EE\u6E05\u65B9\u5411", body: "\u786E\u8BA4\u7247\u957F\u3001\u753B\u5E45\u3001\u8BED\u8A00\u548C\u60C5\u7EEA\u3002" }, script: { title: "\u4E0B\u4E00\u6B65\u5199\u5267\u672C", body: "\u628A\u521B\u610F\u62C6\u6210\u53EF\u62CD\u7684\u89C6\u89C9\u6BB5\u843D\u3002" }, character: { title: "\u5148\u9501\u4EBA\u8BBE", body: "\u89D2\u8272\u56FE\u8FD4\u56DE\u5E76\u786E\u8BA4\u540E\u76F4\u63A5\u8FDB\u5165\u5206\u955C\u3002" }, scene: { title: "\u7A7A\u73AF\u5883\u7D20\u6750", body: "\u53EA\u505A\u7A7A\u95F4\u3001\u5149\u5F71\u548C\u5E03\u666F\uFF0C\u4E0D\u653E\u4EBA\u7269\u3002" }, storyboard: { title: "\u62C6\u5206\u955C\u5934", body: "\u786E\u8BA4\u5206\u955C\u540E\u518D\u8F6C\u89C6\u9891\u3002" }, audio: { title: "\u5904\u7406\u58F0\u97F3", body: "\u97F3\u4E50\u3001\u97F3\u6548\u3001\u5BF9\u767D\u8282\u594F\u7EDF\u4E00\u3002" }, final: { title: "\u6210\u7247\u8F93\u51FA", body: "\u68C0\u67E5\u7F3A\u5931\u9879\u5E76\u6302\u8F7D\u6210\u7247\u3002" } }[e];
    return t.jsxs("div", { className: "jiaren-page1-agent-blueprint", "aria-label": "\u4E13\u5BB6\u9884\u8BBE", children: [t.jsx("span", { children: a.title }), t.jsx("em", { children: a.body })] });
  }
  function xs(e, r = 720) {
    const a = e.replace(/AI_film_studio/gi, "\u5BFC\u6F14\u6D41\u7A0B").replace(/Input_Character/g, "\u53C2\u8003\u56FE").replace(/Input_Env/g, "\u53C2\u8003\u56FE").replace(/Input_Script/g, "\u786E\u8BA4\u5267\u672C").replace(/Output_Storyboard/g, "\u5206\u955C\u62C6\u89E3").replace(/Output_Pic_ShotPrompt/g, "\u753B\u9762\u63CF\u8FF0").replace(/Output_Video_ShotPrompt/g, "\u8FD0\u52A8\u63CF\u8FF0").replace(/Output_KeyPic/g, "\u5173\u952E\u5E27").replace(/Output_Video/g, "\u955C\u5934\u89C6\u9891").replace(/Shot_Text/g, "\u5355\u955C\u5934\u811A\u672C").replace(/\bshots\b/gi, "\u955C\u5934\u6E05\u5355").replace(/\bJSON\b/gi, "\u7ED3\u6784\u5316\u7ED3\u679C").replace(/\bIN\b|\bOUT\b/g, "").replace(/\bClaude[-\s\w.]*\b/gi, "\u667A\u80FD\u63A8\u7406").replace(/\bGPT Image[-\s\w.]*\b/gi, "\u56FE\u50CF\u751F\u6210").replace(/\bGPT\b/gi, "\u56FE\u50CF\u751F\u6210").replace(/节点/g, "\u6B65\u9AA4");
    return $(a, r);
  }
  function As() {
    return t.jsx(t.Fragment, { children: Ro().map((e) => {
      const r = e.id === ce, a = Oe.some((s) => s.step === e.id), o = ys(e.id, r, a);
      return t.jsxs("article", { className: `jiaren-page1-chat-row is-agent${r ? " is-current" : ""}${a && !r ? " is-done" : ""}${!r && !a ? " is-muted" : ""}${yt[e.id].phase === "failed" ? " is-failed" : ""}${yt[e.id].phase === "running" ? " is-running" : ""}`, children: [t.jsx("img", { alt: e.agent, src: e.icon }), t.jsxs("div", { className: "jiaren-page1-agent-bubble", children: [t.jsxs("header", { children: [t.jsx("strong", { children: e.agent }), t.jsx("span", { children: o })] }), t.jsx("p", { children: r || a ? bs(e) : vs(e) }), r && yt[e.id].phase !== "failed" ? js(e.id) : null, yt[e.id].phase === "running" ? t.jsx("div", { className: "jiaren-page1-agent-progress", children: t.jsx("i", {}) }) : null] })] }, e.id);
    }) });
  }
  function ws() {
    if (!Je) return null;
    const visibleDraft = JiarenVisibleScriptSegments(Je.text);
    return t.jsxs("section", { className: "jiaren-page1-module-wrap is-script is-pending-script", style: { "--page1-node-x": "-420px", "--page1-node-y": "18px" }, children: [t.jsxs("div", { className: "jiaren-page1-module-agent is-script", children: [t.jsx("img", { alt: "", src: oo }), t.jsx("strong", { children: "\u7F16\u5267" })] }), t.jsxs("article", { className: "jiaren-page1-script-module jiaren-film-script-review is-canvas-card", "aria-label": "\u5F85\u786E\u8BA4\u5267\u672C", children: [t.jsx("header", { children: t.jsxs("div", { children: [t.jsx("strong", { children: "\u5F85\u786E\u8BA4\u5267\u672C" }), t.jsx("span", { children: "\u786E\u8BA4\u540E\u8FDB\u5165\u89D2\u8272\u8D44\u4EA7\u4E0E\u5206\u955C" })] }) }), t.jsx("div", { className: "jiaren-page1-script-draft", children: visibleDraft.map((segment, index) => t.jsx("p", { children: segment }, `${index}-${segment.slice(0, 24)}`)) }), t.jsxs("div", { children: [t.jsx("button", { type: "button", onClick: Ja, disabled: visibleDraft.length === 0, children: "\u786E\u8BA4\u5267\u672C" }), t.jsx("button", { type: "button", onClick: nr, children: "\u9000\u56DE\u4FEE\u6539" })] })] })] });
  }
  function qt(e) {
    const r = ut.find((a) => a.id === e.step) ?? ut[1];
    return t.jsxs("div", { className: `jiaren-page1-module-agent is-${e.step}`, children: [t.jsx("img", { alt: "", src: r.icon }), t.jsx("strong", { children: e.agent })] });
  }
  function Ln(e, r, a) {
    return e ? r === "video" ? t.jsx("video", { src: e, controls: true, playsInline: true, preload: "metadata" }) : t.jsx("img", { src: e, alt: a }) : t.jsxs("span", { className: "jiaren-page1-media-empty", children: ["\u7B49\u5F85\u751F\u6210", a] });
  }
  function ks(e) {
    return t.jsx("span", { className: "jiaren-page1-scene-placeholder is-soft", "aria-label": e, children: e });
  }
  function Sr(e, r, a = 0) {
    var o, s;
    const d = r === "video" ? e.videoUrl : e.storyboardImageUrl, l = Array.isArray(e.storyboardPanelUrls) && e.storyboardPanelUrls.length ? e.storyboardPanelUrls : d ? [d] : [], p = Array.isArray(e.storyboardNodes) ? e.storyboardNodes : [], h = Array.isArray(e.storyboardCaptions) ? e.storyboardCaptions : [], g = Math.max(1, Number(e.gridCols) || (l.length <= 4 ? 2 : l.length <= 9 ? 3 : 4)), y = e.showIndexes !== false, j = e.showCaptions === true, referenceBudget = e.referenceBudget;
    if (r === "video") return t.jsxs("article", { className: "jiaren-page1-shot-card is-video", children: [t.jsxs("div", { className: "jiaren-page1-shot-tools", children: [t.jsx("strong", { children: e.title }), d ? t.jsx("button", { type: "button", onClick: () => {
      var I;
      return void ((I = window.jiaren) == null ? void 0 : I.system.openPath(d));
    }, children: "\u6253\u5F00\u89C6\u9891" }) : null] }), t.jsx("div", { className: "jiaren-page1-shot-preview", children: Ln(d, "video", "\u955C\u5934\u89C6\u9891") }), t.jsx("div", { className: "jiaren-page1-shot-card-actions", children: t.jsxs("span", { children: [t.jsx(to, { size: 12 }), e.videoStatus || (d ? "\u89C6\u9891\u5DF2\u751F\u6210" : "\u7B49\u5F85\u751F\u6210")] }) })] });
    return t.jsxs("article", { className: "jiaren-page1-shot-card is-image is-editable-grid", onPointerDown: (I) => I.stopPropagation(), children: [t.jsxs("header", { className: "jiaren-page1-shot-header", children: [t.jsxs("div", { children: [t.jsxs("span", { children: [e.sceneTitle || "\u672A\u547D\u540D\u573A\u666F", e.sceneVariantTitle ? ` / ${e.sceneVariantTitle}` : ""] }), t.jsx("h4", { children: e.title }), t.jsxs("small", { children: [e.timecode, " \xB7 ", e.durationSec || pa(e.timecode).duration, "\u79D2 \xB7 ", g, "\xD7", Math.ceil(l.length / g)] })] }), t.jsxs("div", { className: "jiaren-page1-grid-toolbar", children: [t.jsxs("label", { children: [t.jsx("input", { type: "checkbox", checked: y, onChange: (I) => JiarenStoryboardDisplayPatch(a, { showIndexes: I.target.checked }) }), "\u7F16\u53F7"] }), t.jsxs("label", { children: [t.jsx("input", { type: "checkbox", checked: j, onChange: (I) => JiarenStoryboardDisplayPatch(a, { showCaptions: I.target.checked }) }), "\u5B57\u5E55"] })] })] }), t.jsx("div", { className: "jiaren-page1-storyboard-panel-grid", style: { "--jiaren-panel-columns": g }, children: l.map((I, x) => {
      const M = p[x] || {}, U = h[x] || M.dialogue || "";
      return t.jsxs("section", { className: "jiaren-page1-storyboard-panel", title: M.prompt || "", draggable: true, onDragStart: (le) => {
        le.stopPropagation(), le.dataTransfer.effectAllowed = "move", le.dataTransfer.setData("application/x-jiaren-storyboard-panel", JSON.stringify({ shotIndex: a, panelIndex: x }));
      }, onDragOver: (le) => {
        le.preventDefault(), le.stopPropagation(), le.dataTransfer.dropEffect = "move";
      }, onDrop: (le) => {
        le.preventDefault(), le.stopPropagation();
        try {
          const be = JSON.parse(le.dataTransfer.getData("application/x-jiaren-storyboard-panel") || "{}");
          be.shotIndex === a && Number.isInteger(be.panelIndex) && JiarenStoryboardPanelPatch(a, be.panelIndex, x);
        } catch {
        }
      }, children: [t.jsxs("button", { type: "button", className: "jiaren-page1-panel-image", onClick: () => Ct({ source: I, label: `${e.title} \u5206\u955C ${x + 1}` }), children: [t.jsx("img", { src: I, alt: `${e.title} \u5206\u955C ${x + 1}`, draggable: false }), y ? t.jsx("b", { children: String(x + 1).padStart(2, "0") }) : null, j && U ? t.jsx("span", { children: U }) : null] }), t.jsxs("div", { className: "jiaren-page1-panel-actions", children: [t.jsx("button", { type: "button", onClick: () => JiarenStoryboardPanelPatch(a, x, "left"), disabled: x === 0, "aria-label": "\u5411\u524D\u79FB\u52A8\u5206\u955C", children: "\u2190" }), t.jsx("button", { type: "button", onClick: () => JiarenStoryboardPanelPatch(a, x, "right"), disabled: x === l.length - 1, "aria-label": "\u5411\u540E\u79FB\u52A8\u5206\u955C", children: "\u2192" }), t.jsx("button", { type: "button", className: "is-remove", onClick: () => JiarenStoryboardPanelPatch(a, x, "remove"), disabled: l.length <= 1, "aria-label": "\u5220\u9664\u8FD9\u5F20\u5206\u955C", children: "\u5220\u9664" })] }), j ? t.jsx("input", { value: U, maxLength: 140, onChange: (le) => JiarenStoryboardCaptionPatch(a, x, le.target.value), placeholder: `\u5206\u955C ${x + 1} \u5B57\u5E55\uFF08\u4E0D\u70E7\u8FDB\u539F\u56FE\uFF09` }) : null] }, `${I}-${x}`);
    }) }), j ? t.jsxs("label", { className: "jiaren-page1-global-subtitle", children: [t.jsx("span", { children: "\u5168\u5C40\u5B57\u5E55\u6761" }), t.jsx("input", { value: e.globalSubtitle || "", maxLength: 220, onChange: (I) => JiarenStoryboardDisplayPatch(a, { globalSubtitle: I.target.value.slice(0, 220) }), placeholder: "\u4F5C\u4E3A\u526A\u8F91\u5143\u6570\u636E\u4FDD\u5B58\uFF0C\u4E0D\u70E7\u8FDB\u5206\u955C\u539F\u56FE" })] }) : null, referenceBudget ? t.jsxs("section", { className: "jiaren-page1-reference-budget", "aria-label": "Seedance \u53C2\u8003\u56FE\u9884\u7B97", children: [t.jsx("strong", { children: "\u53C2\u8003\u56FE\u9884\u7B97" }), t.jsxs("span", { children: ["\u89D2\u8272 ", referenceBudget.characterImages, " / \u9053\u5177 ", referenceBudget.propImages, " / \u63A5\u7EED ", referenceBudget.continuityImages, " / \u9996\u7EC4\u5206\u955C ", referenceBudget.firstPanelImagesPerGroup || referenceBudget.panelImagesPerGroup, " / \u540E\u7EED\u6BCF\u7EC4 ", referenceBudget.panelImagesPerGroup] }), t.jsxs("em", { children: [referenceBudget.groupCount, " \u7EC4 \u00B7 \u6BCF\u7EC4\u4E0D\u8D85\u8FC7 ", referenceBudget.maxImages, " \u56FE"] })] }) : null, t.jsxs("section", { className: "jiaren-page1-shot-task", children: [t.jsxs("div", { children: [t.jsx("strong", { children: "\u753B\u9762\u4EFB\u52A1" }), e.charactersOnScreen?.length ? t.jsx("span", { children: e.charactersOnScreen.join(" / ") }) : null, e.blocking ? t.jsx("span", { children: e.blocking }) : null, e.pose ? t.jsx("span", { children: e.pose }) : null, e.expression ? t.jsx("span", { children: e.expression }) : null] }), t.jsx("p", { children: e.subjectAction || e.scriptBeat }), e.dialogue ? t.jsxs("blockquote", { children: ["\u201C", e.dialogue, "\u201D"] }) : null, t.jsxs("small", { children: [[e.shotSize, e.lens, e.cameraAngle, e.cameraMotion].filter(Boolean).join(" / "), (o = e.panelVideoUrls) != null && o.length ? ` \xB7 ${e.panelVideoUrls.length} \u6BB5\u89C6\u9891\u5DF2\u5408\u6210` : "", (s = e.storyboardNodes) != null && s.length ? ` \xB7 ${e.storyboardNodes.length} \u5F20\u72EC\u7ACB\u5206\u955C` : ""] })] }), t.jsx("div", { className: "jiaren-page1-shot-card-actions", children: t.jsxs("span", { children: [t.jsx(to, { size: 12 }), e.videoPending ? e.videoStatus || "\u5206\u955C\u56FE\u5DF2\u5C31\u7EEA" : "\u5206\u955C\u5DF2\u5B8C\u6210"] }) })] });
  }
  function Cs(e) {
    var r, a, o, s;
    if (e.step === "scene") return null;
    if (e.step === "setup") return t.jsxs("section", { className: "jiaren-page1-module-wrap is-setup", ...Wt(e), children: [qt(e), t.jsxs("article", { className: "jiaren-page1-setup-module", children: [t.jsx("h2", { children: "\u5F71\u7247\u53C2\u6570" }), t.jsxs("div", { className: "jiaren-page1-pill-row", children: [t.jsx("span", { children: la() }), t.jsx("span", { children: Et }), t.jsx("span", { children: Dt }), t.jsx("span", { children: sn.trim() || Rt })] }), t.jsx("p", { children: e.payload.brief }), t.jsx("small", { children: xs(e.payload.modelLabel || "\u667A\u80FD\u63A8\u7406", 80) })] })] }, e.id);
    if (e.step === "script") {
      const visibleScript = JiarenVisibleScriptSegments(e.payload.script);
      return t.jsxs("section", { className: "jiaren-page1-module-wrap is-script", ...Wt(e), children: [qt(e), t.jsxs("article", { className: "jiaren-page1-script-module", children: [t.jsx("h2", { children: "\u6211\u7684\u5267\u672C" }), t.jsx("div", { className: "jiaren-page1-script-scroll", children: visibleScript.map((d, scriptIndex) => t.jsx("p", { children: d }, `${scriptIndex}-${d.slice(0, 24)}`)) }), t.jsxs("div", { className: "jiaren-page1-script-actions", children: [t.jsx("button", { type: "button", className: "is-revise-script", onClick: () => {
      Mt(""), Tn("script"), m("\u5DF2\u56DE\u5230\u7F16\u5267\u73AF\u8282\u3002\u4F60\u53EF\u4EE5\u5728\u5DE6\u4FA7\u8F93\u5165\u4FEE\u6539\u610F\u89C1\uFF0C\u6BD4\u5982\uFF1A\u66F4\u70ED\u8840\u3001\u51CF\u5C11\u65C1\u767D\u3001\u589E\u52A0\u53CD\u8F6C\u3002");
    }, children: "\u4FEE\u6539\u5267\u672C" }), t.jsx("button", { type: "button", onClick: () => {
      Sn(e.id), m("\u5B8C\u6574\u5267\u672C\u5DF2\u6253\u5F00\u3002");
    }, children: "\u67E5\u770B\u5168\u6587" })] })] })] }, e.id);
    }
    if (e.step === "character") {
      const d = (r = e.payload.characters) != null && r.length ? e.payload.characters : [e.payload.character], l = e.payload.propAssets ?? [];
      return t.jsxs("section", { className: "jiaren-page1-module-wrap is-character", ...Wt(e), children: [qt(e), t.jsx("div", { className: `jiaren-page1-character-grid is-count-${d.length}`, children: d.map((p) => t.jsxs("article", { className: "jiaren-page1-character-module", children: [t.jsxs("section", { className: "jiaren-page1-character-copy", children: [t.jsx("h2", { children: p.name }), t.jsx("p", { children: p.description }), p.appearance ? t.jsx("div", { className: "jiaren-page1-lineage", "aria-hidden": "true", children: xs(p.appearance, 280) }) : null, p.voiceName ? t.jsx("span", { className: "jiaren-page1-character-voice-tag", children: p.voiceName }) : null, t.jsxs("div", { className: "jiaren-page1-character-actions", children: [t.jsx("button", { type: "button", onClick: () => void rs(p, e), children: "\u4E0A\u4F20" }), t.jsx("button", { type: "button", className: "is-generate", onClick: () => os(p, e), children: "\u91CD\u65B0\u751F\u6210" }), t.jsx("button", { type: "button", onClick: () => void as(p, e), children: "\u8D44\u4EA7\u5E93" }), t.jsx("button", { type: "button", onClick: () => void ls(p, e), children: "\u4E0A\u4F20\u97F3\u8272" })] })] }), t.jsxs("section", { className: "jiaren-page1-character-portrait", "aria-label": `${p.name} \u6B63\u9762\u56FE`, role: p.imageUrl ? "button" : void 0, tabIndex: p.imageUrl ? 0 : void 0, onClick: () => p.imageUrl ? Ct({ source: p.imageUrl, label: `${p.name} \u6B63\u9762\u56FE` }) : void 0, onKeyDown: (h) => {
        p.imageUrl && (h.key === "Enter" || h.key === " ") && (h.preventDefault(), Ct({ source: p.imageUrl, label: `${p.name} \u6B63\u9762\u56FE` }));
      }, children: [t.jsx("span", { className: "jiaren-page1-character-label", children: "\u89D2\u8272\u8BBE\u8BA1\u5E08" }), Ln(p.imageUrl, "image", `${p.name} \u6B63\u9762\u56FE`), p.imageUrl ? t.jsx("button", { className: "jiaren-page1-preview-corner", type: "button", onClick: (h) => {
        h.stopPropagation(), Ct({ source: p.imageUrl, label: `${p.name} \u6B63\u9762\u56FE` });
      }, children: "\u9884\u89C8" }) : null, t.jsx("button", { className: "jiaren-page1-sheet-corner", type: "button", onClick: (h) => {
        h.stopPropagation(), p.sheetUrl ? Ct({ source: p.sheetUrl, label: `${p.name} \u591A\u89C6\u56FE` }) : m("\u591A\u89C6\u56FE\u8FD8\u6CA1\u751F\u6210\u3002\u89D2\u8272\u6D41\u7A0B\u4F1A\u5148\u751F\u6210\u6B63\u9762\u56FE\uFF0C\u518D\u81EA\u52A8\u751F\u6210\u6B63/\u4FA7/\u80CC\u4E09\u89C6\u56FE\u670D\u88C5\u9501\u3002");
      }, children: "\u591A\u89C6\u56FE" })] }), p.sheetUrl ? t.jsx("section", { className: "jiaren-page1-character-sheet", "aria-label": `${p.name} \u591A\u89C6\u56FE`, children: Ln(p.sheetUrl, "image", `${p.name} \u591A\u89C6\u56FE`) }) : t.jsxs("section", { className: "jiaren-page1-character-sheet is-empty", "aria-label": `${p.name} \u591A\u89C6\u56FE\u5F85\u751F\u6210`, children: [t.jsx("span", { children: "\u6B63 / \u4FA7 / \u80CC" }), t.jsx("strong", { children: "\u591A\u89C6\u56FE\u670D\u88C5\u9501\u5F85\u751F\u6210" })] })] }, p.name)) }), l.length ? t.jsxs("div", { className: "jiaren-page1-prop-assets", "aria-label": "\u9053\u5177\u548C\u8F7D\u5177\u8D44\u4EA7", children: [t.jsxs("header", { children: [t.jsx("span", { children: "\u72EC\u7ACB\u8D44\u4EA7" }), t.jsx("strong", { children: "\u9053\u5177 / \u8F7D\u5177\u8D44\u4EA7" })] }), t.jsx("div", { children: l.map((p) => t.jsxs("article", { children: [p.imageUrl ? t.jsx("button", { type: "button", className: "jiaren-page1-prop-preview", onClick: () => Ct({ source: p.imageUrl, label: `${p.name} \u8D44\u4EA7\u56FE` }), children: t.jsx("img", { src: p.imageUrl, alt: `${p.name} \u8D44\u4EA7\u56FE` }) }) : t.jsx("div", { className: "jiaren-page1-prop-preview is-empty", children: "\u8D44\u4EA7\u56FE\u5F85\u751F\u6210" }), t.jsx("span", { children: p.type === "vehicle" ? "\u8F7D\u5177" : p.type === "weapon" ? "\u6B66\u5668" : p.type === "prop" ? "\u9053\u5177" : "\u7269\u4EF6" }), t.jsx("strong", { children: p.name }), t.jsx("p", { children: xs(p.description || p.appearance || "", 220) })] }, `${p.type}-${p.name}`)) })] }) : null] }, e.id);
    }
    if (e.step === "__disabled_scene_stage__") {
      const d = fi(e.payload.scenes);
      return t.jsxs("section", { className: "jiaren-page1-module-wrap is-scene", ...Wt(e), children: [qt(e), t.jsx("div", { className: "jiaren-page1-scene-module", children: d.map((l, p) => {
        var h;
        const sceneVariants = Array.isArray(l.sceneVariants) && l.sceneVariants.length ? l.sceneVariants : [{ id: l.primaryVariantId || `${l.sceneId || l.id}-variant-01`, title: "\u4E3B\u573A\u666F\u9996\u5E27", imageUrl: l.imageUrl, isPrimary: true }], primaryVariant = sceneVariants.find((variant) => variant.isPrimary) || sceneVariants[0], secondaryVariants = sceneVariants.filter((variant) => variant !== primaryVariant);
        return t.jsxs("article", { className: `jiaren-page1-scene-card${p < d.length - 1 ? " has-next-scene" : ""}`, children: [t.jsxs("section", { className: "jiaren-page1-scene-copy", children: [t.jsxs("span", { className: "jiaren-page1-scene-sequence", children: ["\u573A\u666F ", p + 1, " / ", l.timeOfDay || "\u81EA\u52A8\u65F6\u6BB5", " / ", sceneVariants.length, " \u5F20\u7A7A\u73AF\u5883"] }), t.jsx("h3", { children: l.title }), t.jsx("p", { children: l.description }), l.continuityAnchor ? t.jsxs("span", { className: "jiaren-page1-scene-chain-key", children: ["\u8854\u63A5\u951A\u70B9\uFF1A", l.continuityAnchor] }) : null, t.jsxs("dl", { className: "jiaren-page1-scene-plan", "aria-label": "\u7A7A\u73AF\u5883\u53C2\u6570", children: [(h = l.beatRefs) != null && h.length ? t.jsxs(t.Fragment, { children: [t.jsx("dt", { children: "\u5267\u672C\u4F9D\u636E" }), t.jsx("dd", { children: l.beatRefs.join(" / ") })] }) : null, l.environment ? t.jsxs(t.Fragment, { children: [t.jsx("dt", { children: "\u73AF\u5883" }), t.jsx("dd", { children: l.environment })] }) : null, l.setDressing ? t.jsxs(t.Fragment, { children: [t.jsx("dt", { children: "\u5E03\u666F" }), t.jsx("dd", { children: l.setDressing })] }) : null, l.lighting ? t.jsxs(t.Fragment, { children: [t.jsx("dt", { children: "\u5149\u5F71" }), t.jsx("dd", { children: l.lighting })] }) : null, l.terrain ? t.jsxs(t.Fragment, { children: [t.jsx("dt", { children: "\u5730\u8C8C" }), t.jsx("dd", { children: l.terrain })] }) : null] }), t.jsx("div", { className: "jiaren-page1-scene-actions", children: t.jsx("button", { type: "button", onClick: () => void is(l, e), children: "\u8D44\u4EA7\u5E93" }) })] }), t.jsxs("div", { className: "jiaren-page1-scene-media has-variants", children: [t.jsxs("button", { type: "button", className: `is-main scene-${p + 1}`, disabled: !primaryVariant.imageUrl, onClick: () => primaryVariant.imageUrl ? Ct({ source: primaryVariant.imageUrl, label: `${l.title} \u4E3B\u573A\u666F\u9996\u5E27` }) : void 0, children: [primaryVariant.imageUrl ? Ln(primaryVariant.imageUrl, "image", `${l.title} \u4E3B\u573A\u666F\u9996\u5E27`) : ks(`${l.title} \u4E3B\u573A\u666F\u9996\u5E27\u5F85\u751F\u6210`), t.jsx("strong", { children: primaryVariant.title || "\u4E3B\u573A\u666F\u9996\u5E27" }), primaryVariant.beatSummary ? t.jsx("span", { children: primaryVariant.beatSummary }) : null] }), secondaryVariants.length ? t.jsx("div", { className: "jiaren-page1-scene-variant-grid", children: secondaryVariants.map((variant, variantIndex) => t.jsxs("button", { type: "button", disabled: !variant.imageUrl, onClick: () => variant.imageUrl ? Ct({ source: variant.imageUrl, label: `${l.title} ${variant.title}` }) : void 0, children: [variant.imageUrl ? t.jsx("img", { src: variant.imageUrl, alt: `${l.title} ${variant.title}` }) : ks(`${variant.title} \u5F85\u751F\u6210`), t.jsxs("strong", { children: [String(variantIndex + 2).padStart(2, "0"), " ", variant.title] }), variant.beatSummary ? t.jsx("span", { children: variant.beatSummary }) : null] }, variant.variantId || variant.id || `${l.title}-${variantIndex}`)) }) : null] })] }, l.sceneChainKey || l.title);
      }) })] }, e.id);
    }
    return e.step === "storyboard" ? t.jsxs("section", { className: "jiaren-page1-module-wrap is-storyboard", ...Wt(e), children: [qt(e), t.jsxs("article", { className: "jiaren-page1-storyboard-image-module", children: [t.jsx("div", { className: "jiaren-page1-shot-grid", children: e.payload.shots.map((d, shotIndex) => Sr(d, "image", shotIndex)) }), t.jsxs("span", { className: "jiaren-page1-generate-all", children: [t.jsx(va, { size: 16 }), "\u72EC\u7ACB\u5206\u955C\u56FE\u5DF2\u751F\u6210\uFF0C\u786E\u8BA4\u987A\u5E8F\u540E\u751F\u6210\u89C6\u9891"] })] }), e.payload.shots.some((d) => d.videoUrl) ? t.jsxs("article", { className: "jiaren-page1-storyboard-video-module", children: [t.jsx("div", { className: "jiaren-page1-shot-grid", children: e.payload.shots.map((d, shotIndex) => Sr(d, "video", shotIndex)) }), t.jsxs("span", { className: "jiaren-page1-generate-all", children: [t.jsx(va, { size: 16 }), "\u89C6\u9891\u5DF2\u751F\u6210"] })] }) : null] }, e.id) : e.step === "audio" ? t.jsxs("section", { className: "jiaren-page1-module-wrap is-audio", ...Wt(e), children: [qt(e), t.jsxs("article", { className: "jiaren-page1-audio-module", children: [t.jsxs("section", { children: [t.jsx("h2", { children: "\u97F3\u9891\u6210\u7247" }), t.jsx("p", { children: e.payload.audio.music }), t.jsx("p", { children: e.payload.audio.sfx }), e.payload.audio.prompt ? t.jsx("p", { className: "jiaren-page1-lineage", children: e.payload.audio.prompt }) : null] }), t.jsx("div", { className: "jiaren-page1-waveform", "aria-label": "\u97F3\u8F68\u6CE2\u5F62", children: e.payload.audio.audioUrl ? t.jsx("audio", { src: e.payload.audio.audioUrl, controls: true }) : t.jsx("span", { className: "jiaren-page1-media-empty", children: "Suno \u97F3\u9891\u63A5\u53E3\u5F85\u540E\u7AEF\u6865\u63A5\uFF0C\u5F53\u524D\u5DF2\u751F\u6210\u53EF\u6267\u884C\u97F3\u9891\u65B9\u6848" }) })] })] }, e.id) : t.jsxs("section", { className: "jiaren-page1-module-wrap is-final", ...Wt(e), children: [qt(e), t.jsxs("article", { className: "jiaren-page1-final-module", children: [t.jsx("div", { className: "jiaren-page1-final-player", children: (a = e.payload.final) != null && a.videoUrl ? Ln(e.payload.final.videoUrl, "video", "\u6210\u7247\u89C6\u9891") : t.jsx(va, { size: 42 }) }), (o = e.payload.final) != null && o.note ? t.jsx("p", { className: "jiaren-page1-final-note", children: e.payload.final.note }) : null, (s = e.payload.final) != null && s.videoUrl ? t.jsx("button", { type: "button", onClick: () => {
      var d, l;
      return void ((l = window.jiaren) == null ? void 0 : l.system.openPath(((d = e.payload.final) == null ? void 0 : d.videoUrl) || ""));
    }, children: "\u6253\u5F00\u89C6\u9891" }) : null] })] }, e.id);
  }
  function Is() {
    if (!Gi) return null;
    const e = Oe.find((r) => r.id === Gi && r.step === "script");
    const visibleScript = e ? JiarenVisibleScriptSegments(e.payload.script) : [];
    return e ? t.jsx("section", { className: "jiaren-page1-script-overlay", role: "dialog", "aria-modal": "true", "aria-label": "\u5B8C\u6574\u5267\u672C", tabIndex: -1, onClick: () => Sn(void 0), children: t.jsxs("article", { onClick: (event) => event.stopPropagation(), children: [t.jsxs("header", { children: [t.jsxs("div", { children: [t.jsx("span", { children: "\u7F16\u5267\u521B\u4F5C\u53F0" }), t.jsx("h2", { children: "\u6211\u7684\u5267\u672C" })] }), t.jsx("button", { type: "button", onClick: () => Sn(void 0), "aria-label": "\u5173\u95ED\u5B8C\u6574\u5267\u672C", title: "\u5173\u95ED", children: t.jsx(Kt, { size: 18 }) })] }), t.jsx("main", { children: visibleScript.map((r, a) => t.jsx("p", { children: r }, `${a}-${r.slice(0, 20)}`)) }), t.jsxs("footer", { children: [t.jsx("textarea", { value: Xe, onChange: (r) => Mt(r.target.value), placeholder: "\u5199\u4E0B\u4FEE\u6539\u610F\u89C1\uFF1A\u4F8B\u5982\u589E\u52A0\u7B2C\u4E09\u573A\u3001\u51CF\u5C11\u65C1\u767D\u3001\u5BF9\u767D\u66F4\u81EA\u7136\u3001\u7ED3\u5C3E\u66F4\u9AD8\u71C3", "aria-label": "\u5267\u672C\u4FEE\u6539\u610F\u89C1" }), t.jsxs("div", { children: [t.jsx("button", { type: "button", onClick: () => {
      Mt(""), Tn("script"), Sn(void 0), m("\u5DF2\u56DE\u5230\u7F16\u5267\u73AF\u8282\uFF0C\u53EF\u4EE5\u4FEE\u6539\u540E\u91CD\u65B0\u751F\u6210\u3002");
    }, children: "\u4FEE\u6539\u5267\u672C" }), t.jsx("button", { type: "button", onClick: () => {
      Tn("script"), Sn(void 0), m("\u5DF2\u8BF7\u6C42\u91CD\u65B0\u751F\u6210\u5267\u672C\uFF0C\u8BF7\u5728\u5DE6\u4FA7\u786E\u8BA4\u540E\u91CD\u65B0\u8C03\u7528\u7F16\u5267\u3002");
    }, children: "\u91CD\u65B0\u751F\u6210" }), t.jsx("button", { type: "button", onClick: () => Sn(void 0), children: "\u5173\u95ED" })] })] })] }) }) : null;
  }
  function Ss() {
    if (!zi) return null;
    const { x: e, y1: r, y2: a } = zi, o = Math.max(0, a - r);
    return o < 8 ? null : t.jsx("span", { className: "jiaren-page1-script-character-line", "aria-hidden": "true", style: { left: `${e}px`, top: `${r}px`, height: `${o}px` } });
  }
  function Ps() {
    return Ge ? t.jsx("section", { className: "jiaren-page1-character-regenerate", role: "dialog", "aria-modal": "true", "aria-label": "\u91CD\u65B0\u751F\u6210\u89D2\u8272", children: t.jsxs("article", { children: [t.jsxs("header", { children: [t.jsxs("div", { children: [t.jsx("span", { children: "\u89D2\u8272\u8BBE\u8BA1\u5E08" }), t.jsx("h2", { children: Ge.characterName })] }), t.jsx("button", { type: "button", "aria-label": "\u5173\u95ED\u89D2\u8272\u91CD\u751F\u6210", onClick: () => bt(void 0), disabled: Ge.running, children: t.jsx(Kt, { size: 18 }) })] }), t.jsxs("main", { children: [t.jsxs("label", { children: [t.jsx("span", { children: "\u89D2\u8272\u91CD\u751F\u6210\u63D0\u793A\u8BCD" }), t.jsx("textarea", { value: Ge.prompt, onChange: (e) => bt((r) => r && { ...r, prompt: e.target.value, message: void 0 }), placeholder: "\u5199\u6E05\u695A\u89D2\u8272\u5916\u8C8C\u3001\u670D\u88C5\u3001\u8BC6\u522B\u8272\u3001\u59FF\u6001\u548C\u7981\u5FCC\u9879", disabled: Ge.running })] }), t.jsxs("div", { className: "jiaren-page1-character-regenerate-refs", children: [t.jsx("strong", { children: "\u53C2\u8003\u56FE" }), t.jsxs("div", { children: [Ge.references.map((e, r) => t.jsxs("button", { type: "button", onClick: () => Ct({ source: e, label: Ge.referenceNames[r] || `\u53C2\u8003\u56FE ${r + 1}` }), disabled: Ge.running, children: [t.jsx("img", { src: e, alt: "" }), t.jsx("span", { children: Ge.referenceNames[r] || `\u53C2\u8003\u56FE ${r + 1}` })] }, `${e.slice(0, 32)}-${r}`)), t.jsxs("button", { type: "button", className: "is-add-ref", onClick: () => void ss(), disabled: Ge.running, children: [t.jsx(fn, { size: 18 }), "\u4E0A\u4F20\u53C2\u8003\u56FE"] })] })] }), Ge.message ? t.jsx("p", { children: Ge.message }) : null] }), t.jsxs("footer", { children: [t.jsx("button", { type: "button", onClick: () => bt(void 0), disabled: Ge.running, children: "\u53D6\u6D88" }), t.jsx("button", { type: "button", className: "is-primary", onClick: () => void cs(), disabled: Ge.running, children: Ge.running ? "\u751F\u6210\u4E2D..." : "\u91CD\u65B0\u751F\u6210\u89D2\u8272\u56FE" })] })] }) }) : null;
  }
  function $s() {
    return Pn ? t.jsx("section", { className: "jiaren-page1-image-preview", role: "dialog", "aria-modal": "true", "aria-label": Pn.label, onClick: (e) => {
      e.preventDefault(), e.stopPropagation(), Ct(void 0);
    }, children: t.jsxs("article", { onClick: (e) => e.stopPropagation(), children: [t.jsxs("header", { children: [t.jsx("strong", { children: Pn.label }), t.jsx("button", { type: "button", "aria-label": "\u5173\u95ED\u56FE\u7247\u9884\u89C8", onClick: (e) => {
      e.preventDefault(), e.stopPropagation(), Ct(void 0);
    }, children: t.jsx(Kt, { size: 18 }) })] }), t.jsx("div", { children: t.jsx("img", { src: Pn.source, alt: Pn.label }) })] }) }) : null;
  }
  function Yt(e, r) {
    const a = typeof e == "string" ? e.trim() : "", o = r.trim();
    return a ? !o || a.includes(o) ? a : `${a}

${o}` : o;
  }
  function Ns(e) {
    const r = e.prompt.trim();
    if (!r) {
      m("\u8FD9\u4E2A\u63D0\u793A\u8BCD\u5185\u5BB9\u4E3A\u7A7A\u3002");
      return;
    }
    const a = S.find((l) => l.id === Z), o = a ? { x: a.position.x + 360, y: a.position.y } : { x: 360, y: 240 };
    if ((a == null ? void 0 : a.data.kind) === "generateImage" || (a == null ? void 0 : a.data.kind) === "editImage") {
      _.getState().updateNodeData(a.id, { prompt: Yt(a.data.prompt, r), status: "idle", message: `\u5DF2\u5957\u7528\u63D0\u793A\u8BCD\u5E93\uFF1A${e.title}` }), m("\u63D0\u793A\u8BCD\u5DF2\u5957\u7528\u5230\u5F53\u524D\u751F\u56FE\u6A21\u5757\u3002");
      return;
    }
    if ((a == null ? void 0 : a.data.kind) === "videoGenerate" || (a == null ? void 0 : a.data.kind) === "sdVideo") {
      const l = Yt(a.data.prompt || a.data.script, r);
      _.getState().updateNodeData(a.id, { prompt: l, script: l, status: "idle", message: `\u5DF2\u5957\u7528\u63D0\u793A\u8BCD\u5E93\uFF1A${e.title}` }), m("\u63D0\u793A\u8BCD\u5DF2\u5957\u7528\u5230\u5F53\u524D\u89C6\u9891\u6A21\u5757\u3002");
      return;
    }
    if ((a == null ? void 0 : a.data.kind) === "storyboard") {
      const l = Array.isArray(a.data.storyboardItems) ? a.data.storyboardItems : [];
      _.getState().updateNodeData(a.id, { storyboardDistributionPrompt: Yt(a.data.storyboardDistributionPrompt, r), outputText: Yt(a.data.outputText, r), prompt: Yt(a.data.prompt, r), storyboardItems: l.map((p, h) => h === 0 ? { ...p, imagePrompt: Yt(p.imagePrompt, r), videoPrompt: Yt(p.videoPrompt, r) } : p), status: "idle", message: `\u5DF2\u5957\u7528\u63D0\u793A\u8BCD\u5E93\uFF1A${e.title}` }), m("\u63D0\u793A\u8BCD\u5DF2\u5957\u7528\u5230\u5206\u955C\u6A21\u5757\u3002");
      return;
    }
    const s = e.target === "video" ? "videoText" : e.target === "storyboard" ? "storyText" : "textInput", d = Ae({ kind: s, position: o, label: e.title, data: s === "videoText" ? { videoDirectorText: r, prompt: r, outputText: r, message: "\u6765\u81EA\u63D0\u793A\u8BCD\u5E93\uFF0C\u53EF\u8FDE\u63A5\u5230\u89C6\u9891\u6A21\u5757\u3002" } : { prompt: r, outputText: r, message: "\u6765\u81EA\u63D0\u793A\u8BCD\u5E93\uFF0C\u53EF\u7EE7\u7EED\u7F16\u8F91\u540E\u8FDE\u63A5\u5230\u4E0B\u6E38\u6A21\u5757\u3002" } });
    ze(d.id), m("\u5DF2\u628A\u63D0\u793A\u8BCD\u653E\u5230\u753B\u5E03\uFF0C\u53EF\u7EE7\u7EED\u62C9\u7EBF\u8FDE\u63A5\u3002");
  }
  function Pr(e) {
    const r = e.localPath || e.dataUrl || e.thumbnail || e.source || "";
    if (e.kind === "text") {
      const o = Ae({ kind: "textInput", position: { x: 300, y: 220 }, label: e.name || "\u6587\u672C\u7D20\u6750", data: { prompt: e.text || "", text: e.text || "", inputPrompt: e.text || "" } });
      ze(o.id), m("\u6587\u672C\u7D20\u6750\u5DF2\u653E\u5165\u753B\u5E03\u3002");
      return;
    }
    if (!r) {
      m("\u8FD9\u4E2A\u7D20\u6750\u6CA1\u6709\u53EF\u63D2\u5165\u7684\u6587\u4EF6\u3002");
      return;
    }
    if (e.kind === "video") {
      const o = Ae({ kind: "videoGenerate", position: { x: 360, y: 240 }, label: e.name || "\u89C6\u9891\u7D20\u6750", data: { localPath: e.localPath, fileName: e.name, mimeType: e.mimeType, outputAssets: [{ id: e.id, type: "video", localPath: e.localPath, url: e.source }], status: "succeeded" } });
      ze(o.id), m("\u89C6\u9891\u7D20\u6750\u5DF2\u653E\u5165\u753B\u5E03\u3002");
      return;
    }
    const a = Ae({ kind: "imageInput", position: { x: 320, y: 220 }, label: e.name || "\u56FE\u7247\u7D20\u6750", data: { imageSource: r, localPath: e.localPath, fileName: e.name, mimeType: e.mimeType, width: e.width, height: e.height } });
    ze(a.id), m("\u56FE\u7247\u7D20\u6750\u5DF2\u653E\u5165\u753B\u5E03\u3002");
  }
  function Us(e) {
    if (e.kind !== "set") {
      Pr(e);
      return;
    }
    const { assets: r, nodes: a } = Xr(e);
    let o = 0, s;
    r.forEach((d) => {
      const l = eo(d), p = 280 + o % 4 * 300, h = 220 + Math.floor(o / 4) * 260;
      if (o += 1, Ad(d.kind)) {
        s = Ae({ kind: "videoGenerate", position: { x: p, y: h }, label: d.name || "\u7D20\u6750\u96C6\u89C6\u9891", data: { localPath: d.localPath, fileName: d.name, mimeType: d.mimeType, outputAssets: [{ id: d.id || crypto.randomUUID(), type: "video", localPath: d.localPath, url: d.source }], status: "succeeded" } }).id;
        return;
      }
      if (d.kind === "text") {
        s = Ae({ kind: "textInput", position: { x: p, y: h }, label: d.name || "\u7D20\u6750\u96C6\u6587\u672C", data: { prompt: d.source || "", text: d.source || "", inputPrompt: d.source || "" } }).id;
        return;
      }
      l && (s = Ae({ kind: "imageInput", position: { x: p, y: h }, label: d.name || "\u7D20\u6750\u96C6\u56FE\u7247", data: { imageSource: l, localPath: d.localPath, fileName: d.name, mimeType: d.mimeType, status: "succeeded" } }).id);
    }), a.forEach((d) => {
      const l = String(d.text || d.prompt || "").trim(), p = bi(d);
      if (!l && !p) return;
      const h = 280 + o % 4 * 300, g = 220 + Math.floor(o / 4) * 260;
      o += 1, s = Ae(p ? { kind: "imageInput", position: { x: h, y: g }, label: d.label || "\u7D20\u6750\u96C6\u56FE\u7247", data: { imageSource: p, localPath: d.localPath, fileName: d.label, status: "succeeded" } } : { kind: "textInput", position: { x: h, y: g }, label: d.label || "\u7D20\u6750\u96C6\u6587\u672C", data: { prompt: l, text: l, inputPrompt: l, status: "succeeded" } }).id;
    }), s && ze(s), m(`\u5DF2\u4ECE\u7D20\u6750\u96C6\u6062\u590D ${o} \u4E2A\u5185\u5BB9\u5230\u753B\u5E03\u3002`);
  }
  function Bs(e) {
    const { assets: r, nodes: a } = Xr(e), o = [...r.filter((x) => xd(x.kind)).map((x) => ({ name: x.name || "\u53C2\u8003\u56FE", source: eo(x), localPath: x.localPath, mimeType: x.mimeType })), ...a.filter((x) => bi(x)).map((x) => ({ name: x.label || "\u53C2\u8003\u56FE", source: bi(x), localPath: x.localPath, mimeType: void 0 }))].filter((x) => x.source), s = [e.text, ...a.map((x) => x.text || x.prompt).filter(Boolean), ...r.filter((x) => x.kind === "text").map((x) => x.source).filter(Boolean)].map((x) => String(x).trim()).filter(Boolean), d = 320, l = 240, p = [], h = o.slice(0, 4).map((x, M) => {
      const U = Ae({ kind: "imageInput", position: { x: d, y: l + M * 230 }, label: x.name, data: { imageSource: x.source, localPath: x.localPath, fileName: x.name, mimeType: x.mimeType, status: "succeeded" } });
      return p.push(U), U;
    }), g = Ae({ kind: "videoText", position: { x: d + 360, y: l }, label: "\u89C6\u9891\u6587\u5B57", data: { prompt: s.join(`

`), videoDirectorText: s.join(`

`), outputText: s.join(`

`), status: s.length ? "succeeded" : "idle", message: "\u6765\u81EA\u7D20\u6750\u96C6\u7684\u5BFC\u6F14\u8BCD\u3001\u5267\u60C5\u548C\u63D0\u793A\u8BCD\u3002" } });
    p.push(g);
    const y = R.models.find((x) => x.id === "comfly-grok-video-1-5") ?? R.models.find((x) => /grok.*video/i.test(mt(x))) ?? R.models.find((x) => x.category === "video" && x.enabled), j = Ae({ kind: "sdVideo", position: { x: d + 760, y: l + 40 }, label: "AI\u89C6\u9891", data: { prompt: s.join(`

`), videoMode: h.length > 0 ? "image-to-video" : "text-to-video", modelId: y == null ? void 0 : y.id, modelAlias: y == null ? void 0 : y.alias, modelApiGroup: y == null ? void 0 : y.apiGroup, aspectRatio: "16:9", resolution: "auto", duration: 10, fps: 24, referenceMode: "auto", linkedImageCount: h.length, videoReferences: o.slice(0, 4).map((x, M) => ({ id: `set-ref-${e.id}-${M}`, kind: "image", name: x.name, source: x.source, localPath: x.localPath, dataUrl: x.source.startsWith("data:") ? x.source : void 0, mimeType: x.mimeType })), message: "\u5DF2\u5957\u7528\u7D20\u6750\u96C6\uFF1A\u53C2\u8003\u56FE\u548C\u6587\u672C\u4F1A\u4F5C\u4E3A\u4E0A\u6E38\u8F93\u5165\u751F\u6210\u89C6\u9891\u3002" } });
    p.push(j);
    const I = [...h.map((x) => ({ id: `set-${x.id}-${j.id}`, source: x.id, target: j.id, animated: true })), { id: `set-${g.id}-${j.id}`, source: g.id, target: j.id, animated: true }];
    se([..._.getState().workflowEdges, ...I]), ze(j.id), C({ jiarenCanvasModeOpen: false, resourceLibraryOpen: false }), m(`\u5DF2\u628A\u7D20\u6750\u96C6\u5957\u7528\u4E3A\u89C6\u9891\u5DE5\u4F5C\u6D41\uFF1A${p.length} \u4E2A\u5185\u5BB9\u3002`);
  }
  const $r = v.useMemo(() => ({ themeMode: "light", language: Q.language, zoomPercent: Q.zoomPercent, historyOpen: Q.historyOpen, agentOpen: Q.agentOpen, videoStudioOpen: false, jiarenCanvasModeOpen: false, rongtuStudioOpen: false, comfyWorkflowStudioOpen: false, masterToolkitOpen: false, aiDirectorOpen: false, designAgentOpen: false, resourceLibraryOpen: Q.resourceLibraryOpen, promptLibraryOpen: false, projectName: Q.projectName }), [Q.agentOpen, Q.historyOpen, Q.language, Q.projectName, Q.resourceLibraryOpen, Q.zoomPercent]), ai = v.useMemo(() => il(H), [H]), Ms = v.useMemo(() => ol(S), [S]), Es = v.useMemo(() => rl(E), [E]);
  v.useEffect(() => {
    var o, s, d;
    const e = window.localStorage.getItem("jiaren:restoreLastProject") === "1";
    let r = false;
    function a(l) {
      if (r || !l || gd(l)) return;
      const p = Bt(l.workflow) ? l.workflow : void 0, h = Bt(l.canvas) ? l.canvas : void 0, g = md(l), y = an(p, "nodes"), j = an(p, "edges"), I = an(h, "canvasAssets"), x = an(h, "history"), M = ud(h, "storageSettings"), U = ld(y, j);
      f(U.nodes), se(U.edges), I && T(I), x && q(x), M && z(M), g && C({ projectName: g }), Ue.current = true;
    }
    return Promise.all([(o = window.jiaren) == null ? void 0 : o.system.getDefaultPaths(), (s = window.jiaren) == null ? void 0 : s.system.loadPreferences(), (d = window.jiaren) == null ? void 0 : d.system.getZoom()]).then(([l, p, h]) => {
      var g, y;
      if (!r) {
        if (p && k(p), l && z({ downloadsDir: ((g = p == null ? void 0 : p.storageSettings) == null ? void 0 : g.downloadsDir) || F.downloadsDir || l.downloadsDir, cacheDir: ((y = p == null ? void 0 : p.storageSettings) == null ? void 0 : y.cacheDir) || F.cacheDir || l.cacheDir }), h && C({ zoomPercent: h.zoomPercent }), e) {
          window.setTimeout(() => {
            var j;
            (j = window.jiaren) == null || j.system.loadProject().then(a).catch(() => {
            }).finally(() => {
              ee.current = true, we(true);
            });
          }, 180);
          return;
        }
        ee.current = true, we(true);
      }
    }).catch(() => {
    }).finally(() => {
      e || (ee.current = true, we(true));
    }), () => {
      r = true;
    };
  }, [k, T, q, z, C, se, f]), v.useEffect(() => {
    const e = window.setInterval(() => {
      var a;
      (a = window.jiaren) == null || a.system.getStats().then(Pe).catch(() => {
      });
    }, 1800), r = window.setTimeout(() => {
      var a;
      (a = window.jiaren) == null || a.system.getStats().then(Pe).catch(() => {
      });
    }, 250);
    return () => {
      window.clearInterval(e), window.clearTimeout(r);
    };
  }, [Pe]), v.useEffect(() => {
    if (!F.autoSaveEnabled || !yi(S, B, E, H)) return;
    const e = Math.max(1, F.autoSaveMinutes) * 60 * 1e3, r = window.setInterval(() => {
      ya();
    }, e);
    return () => window.clearInterval(r);
  }, [F.autoSaveEnabled, F.autoSaveMinutes, S, B, E, H]), v.useEffect(() => {
    if (!ee.current || !F.autoSaveEnabled || !yi(S, B, E, H)) return;
    const e = window.setTimeout(() => {
      ya();
    }, 1200);
    return () => window.clearTimeout(e);
  }, [S, B, E, H, F]), v.useEffect(() => {
    if (!X) return;
    const e = window.setTimeout(() => {
      var r;
      (r = window.jiaren) == null || r.system.savePreferences({ runtimeSettings: { global: R.global, models: R.models }, storageSettings: F, ui: $r, history: ai });
    }, 900);
    return () => window.clearTimeout(e);
  }, [ai, $r, X, R, F]), v.useEffect(() => {
    if (!b) return;
    const e = window.setTimeout(() => m(""), 5e3);
    return () => window.clearTimeout(e);
  }, [b]);
  async function Nr(e = false) {
    var o;
    const r = R.global.fallbackBaseUrl || R.global.baseUrl, a = R.global.fallbackApiKey || R.global.apiKey;
    if (!r.trim() || !a.trim()) {
      xn(false), vn("\u672A\u914D\u7F6E Key"), jn("\u8BF7\u5148\u5728 API \u8BBE\u7F6E\u4E2D\u586B\u5199\u7B2C\u4E09\u65B9 API \u7684 Base URL \u548C API Key\u3002");
      return;
    }
    Di(true);
    try {
      const s = await ((o = window.jiaren) == null ? void 0 : o.system.queryApiBalance({ baseUrl: r, apiKey: a, fallbackBaseUrl: R.global.fallbackBaseUrl, fallbackApiKey: R.global.fallbackApiKey, apiUserId: R.global.apiUserId }));
      if (!s) {
        xn(false), vn("\u67E5\u8BE2\u5931\u8D25"), jn("\u5F53\u524D\u8FD0\u884C\u73AF\u5883\u6CA1\u6709\u8FD4\u56DE\u4F59\u989D\u67E5\u8BE2\u7ED3\u679C\u3002");
        return;
      }
      xn(s.ok), vn(s.ok ? bd(vd(s.token, s.user)) : "\u67E5\u8BE2\u5931\u8D25"), jn(s.message), (e || !s.ok) && m(s.message);
    } catch (s) {
      const d = s instanceof Error ? s.message : "\u4F59\u989D\u67E5\u8BE2\u5931\u8D25\u3002";
      xn(false), vn("\u67E5\u8BE2\u5931\u8D25"), jn(d), e && m(d);
    } finally {
      Di(false);
    }
  }
  v.useEffect(() => {
    if (!X) return;
    if (!R.global.apiKey.trim() && !(R.global.fallbackApiKey ?? "").trim()) {
      xn(false), vn("\u672A\u914D\u7F6E Key"), jn("\u8BF7\u5148\u5728 API \u8BBE\u7F6E\u4E2D\u586B\u5199\u7B2C\u4E09\u65B9 API \u7684 Base URL \u548C API Key\u3002");
      return;
    }
    const e = window.setTimeout(() => {
      Nr(false);
    }, 4500);
    return () => window.clearTimeout(e);
  }, [X, R.global.apiKey, R.global.fallbackApiKey, R.global.baseUrl, R.global.fallbackBaseUrl, R.global.apiUserId]);
  async function ya(r = false) {
    var e;
    if (ee.current) {
      if (!r && !yi(S, B, E, H)) {
        window.localStorage.removeItem("jiaren:restoreLastProject");
        return;
      }
      const a = await ((e = window.jiaren) == null ? void 0 : e.system.saveProject({ version: 1, explicitSave: r, savedAt: (/* @__PURE__ */ new Date()).toISOString(), projectName: Q.projectName ?? "\u672A\u547D\u540D\u9879\u76EE", workflow: { nodes: Ms, edges: B }, canvas: { storageSettings: F, canvasAssets: Es, history: ai } }));
      return a?.ok && window.localStorage.setItem("jiaren:restoreLastProject", "1"), a;
    }
  }
  function Ur(e) {
    e.preventDefault(), e.stopPropagation(), P({ x: Math.min(e.clientX, window.innerWidth - 216 - 12), y: Math.min(e.clientY, window.innerHeight - 220 - 12) });
  }
  async function Ds() {
    P(void 0);
    const e = await ya(true);
    e?.canceled || m(e?.ok ? `\u9879\u76EE\u5DF2\u4FDD\u5B58\u5230\uFF1A${e.projectDirectory || e.path}` : e?.message || "\u9879\u76EE\u4FDD\u5B58\u5931\u8D25\u3002");
  }
  function Rs() {
    f([]), se([]), T([]), window.localStorage.removeItem("jiaren:restoreLastProject");
  }
  async function Br(e) {
    var a;
    const r = await ((a = window.jiaren) == null ? void 0 : a.system.setZoom((Q.zoomPercent || 100) + e));
    r && C({ zoomPercent: r.zoomPercent });
  }
  async function Mr() {
    var r;
    const e = await ((r = window.jiaren) == null ? void 0 : r.system.setZoom(100));
    C({ zoomPercent: (e == null ? void 0 : e.zoomPercent) ?? 100 });
  }
  v.useEffect(() => {
    function e(r) {
      (r.ctrlKey || r.metaKey) && r.key === "0" && (r.preventDefault(), Mr());
    }
    return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
  }, []);
  async function Ts() {
    C({ themeMode: Q.themeMode === "light" ? "dark" : "light" });
  }
  function Ls() {
    var e;
    if (Ri) {
      rn(false);
      return;
    }
    if (Ma) {
      Ha(), Kn(false), Vn(false), C({ jiarenCanvasModeOpen: false }), m("\u5DF2\u9000\u51FA\u89C6\u9891\u5DE5\u4F5C\u6D41\uFF0C\u8FD4\u56DE\u539F\u59CB\u65E0\u9650\u753B\u5E03\u3002");
      return;
    }
    (e = window.jiaren) == null || e.system.windowCommand("close");
  }
  function Os() {
    Ha(), Kn(false), Vn(false), rn(false), C({ jiarenCanvasModeOpen: false }), m("\u5DF2\u9000\u51FA\u89C6\u9891\u5DE5\u4F5C\u6D41\uFF0C\u8FD4\u56DE\u539F\u59CB\u65E0\u9650\u753B\u5E03\u3002");
  }
  async function _s() {
    var p, h;
    const e = E.find((g) => g.id === me), r = S.find((g) => g.id === Z), a = typeof (r == null ? void 0 : r.data.imageSource) == "string" ? r.data.imageSource : void 0, o = H.find((g) => g.thumbnail), s = (e == null ? void 0 : e.source) ?? a ?? (o == null ? void 0 : o.thumbnail);
    if (!s) {
      await ((p = window.jiaren) == null ? void 0 : p.system.openPath(F.downloadsDir)), m("\u6CA1\u6709\u9009\u4E2D\u56FE\u7247\uFF0C\u5DF2\u6253\u5F00\u4E0B\u8F7D\u76EE\u5F55\u3002");
      return;
    }
    const d = (/* @__PURE__ */ new Date()).toISOString().replace(/\D/g, "").slice(0, 14), l = await ((h = window.jiaren) == null ? void 0 : h.system.saveAsset({ source: s, localPath: (e == null ? void 0 : e.localPath) ?? (typeof (r == null ? void 0 : r.data.localPath) == "string" ? r.data.localPath : o == null ? void 0 : o.localPath), directory: F.downloadsDir, fileName: `jiaren_${d}.png` }));
    m(l != null && l.path ? `\u4E0B\u8F7D\u6210\u529F\uFF1A${l.path}` : (l == null ? void 0 : l.message) ?? "\u4E0B\u8F7D\u5931\u8D25\u3002");
  }
  return t.jsxs("div", { className: `canvas-app-shell theme-${Q.themeMode} ${Q.jiarenCanvasModeOpen ? "canvas-mode-active" : ""}`, onClick: () => P(void 0), children: [t.jsx("div", { className: "window-drag-strip", "aria-hidden": "true" }), t.jsxs("header", { className: "window-titlebar", children: [t.jsxs("div", { className: "titlebar-left", children: [t.jsx("img", { alt: "", src: _r }), t.jsx("span", { children: "Jiaren AI" })] }), t.jsxs("div", { className: "titlebar-controls", children: [t.jsx("button", { type: "button", title: "\u6700\u5C0F\u5316", onClick: () => {
    var e;
    return void ((e = window.jiaren) == null ? void 0 : e.system.windowCommand("minimize"));
  }, children: t.jsx(gc, { size: 13 }) }), t.jsx("button", { type: "button", title: Ve ? "\u8FD8\u539F\u7A97\u53E3" : "\u6700\u5927\u5316", onClick: async () => {
    var r;
    const e = await ((r = window.jiaren) == null ? void 0 : r.system.windowCommand("toggleMaximize"));
    Ua(!!(e != null && e.isMaximized));
  }, children: t.jsx(hc, { size: 13 }) }), t.jsx("button", { type: "button", title: "\u5173\u95ED", onClick: () => window.jiaren?.system.windowCommand("close"), children: t.jsx(Kt, { size: 13 }) })] })] }), t.jsxs("main", { className: "canvas-stage", children: [Q.jiarenCanvasModeOpen ? null : t.jsxs("div", { className: "jiaren-canvas-top-chrome", "aria-label": "\u753B\u5E03\u9876\u90E8\u5DE5\u5177\u680F", children: [t.jsxs("div", { className: "jiaren-canvas-project-pill", onContextMenu: Ur, children: [t.jsx("img", { alt: "", src: _r }), t.jsx("input", { "aria-label": "\u9879\u76EE\u540D\u79F0", value: Q.projectName ?? "\u672A\u547D\u540D\u9879\u76EE", onChange: (e) => C({ projectName: e.target.value }), onBlur: () => void ya(), onContextMenu: Ur })] }), A ? t.jsxs("div", { className: "project-context-menu", style: { left: A.x, top: A.y }, role: "menu", onClick: (e) => e.stopPropagation(), children: [t.jsx("strong", { children: ((Er = Q.projectName) == null ? void 0 : Er.trim()) || "\u672A\u547D\u540D\u9879\u76EE" }), t.jsxs("button", { type: "button", role: "menuitem", onClick: () => void Ds(), children: [t.jsx(xi, { size: 14 }), "\u4FDD\u5B58\u5F53\u524D\u5DE5\u4F5C\u6D41"] })] }) : null, t.jsxs("div", { className: "jiaren-canvas-brand-pill", children: [t.jsx("span", { className: "jiaren-brand-name", children: "Jiaren AI" }), t.jsx("span", { className: "jiaren-brand-divider", children: "|" }), t.jsx("strong", { children: "\u65E0\u9650\u753B\u5E03\u5DE5\u4F5C\u53F0" }), t.jsx("span", { className: "jiaren-brand-divider", children: "|" }), t.jsx("em", { children: "\u7981\u6B62\u5546\u7528" }), t.jsx("span", { className: "jiaren-brand-divider", children: "|" }), t.jsx("button", { className: `jiaren-brand-balance ${Ba === false ? "is-error" : Ba ? "is-success" : ""}`, type: "button", title: `${Ei}\u3002${yo}`, onClick: () => void Nr(true), children: bo ? "\u67E5\u8BE2\u4E2D" : Ba === void 0 ? "\u4F59\u989D\u67E5\u8BE2" : Ei })] }), t.jsxs("nav", { className: "jiaren-canvas-toolbar-pill", "aria-label": "\u4E3B\u5DE5\u5177\u680F", children: [t.jsxs("button", { className: "jiaren-toolbar-api", type: "button", title: "API \u8BBE\u7F6E", "aria-label": "API \u8BBE\u7F6E", onClick: () => u(true), children: [t.jsx(fc, { size: 14 }), t.jsx("span", { children: "API" })] }), t.jsx("button", { className: "jiaren-toolbar-icon", type: "button", title: "\u7F29\u5C0F", "aria-label": "\u7F29\u5C0F", onClick: () => void Br(-10), children: t.jsx(yc, { size: 14 }) }), t.jsxs("button", { className: "jiaren-toolbar-zoom", type: "button", title: "\u6062\u590D\u9ED8\u8BA4\u5927\u5C0F Ctrl+0", "aria-label": "\u6062\u590D\u9ED8\u8BA4\u5927\u5C0F", onClick: () => void Mr(), children: [t.jsx(bc, { size: 13 }), t.jsxs("span", { children: [Q.zoomPercent ?? 100, "%"] })] }), t.jsx("button", { className: "jiaren-toolbar-icon", type: "button", title: "\u653E\u5927", "aria-label": "\u653E\u5927", onClick: () => void Br(10), children: t.jsx(vc, { size: 14 }) }), t.jsx("button", { className: "jiaren-toolbar-icon", type: "button", title: "\u4E0B\u8F7D\u5F53\u524D\u56FE\u7247", "aria-label": "\u4E0B\u8F7D\u5F53\u524D\u56FE\u7247", onClick: () => void _s(), children: t.jsx(io, { size: 14 }) }), t.jsx("button", { className: "jiaren-toolbar-icon", type: "button", title: Q.themeMode === "light" ? "\u5207\u6362\u6DF1\u8272\u6A21\u5F0F" : "\u5207\u6362\u767D\u8272\u6A21\u5F0F", "aria-label": Q.themeMode === "light" ? Hi("\u5207\u6362\u6DF1\u8272\u6A21\u5F0F", "Switch to dark mode") : Hi("\u5207\u6362\u767D\u8272\u6A21\u5F0F", "Switch to light mode"), onClick: () => void Ts(), children: Q.themeMode === "light" ? t.jsx(jc, { size: 14 }) : t.jsx(xc, { size: 14 }) }), t.jsx("button", { className: "jiaren-toolbar-icon", type: "button", title: "\u6E05\u7A7A\u753B\u5E03", "aria-label": "\u6E05\u7A7A\u753B\u5E03", onClick: Rs, children: t.jsx(Sa, { size: 14 }) }), t.jsx("button", { className: ve ? "jiaren-toolbar-icon is-active" : "jiaren-toolbar-icon", type: "button", title: "\u663E\u793A\u6216\u9690\u85CF\u7F51\u683C", "aria-label": "\u663E\u793A\u6216\u9690\u85CF\u7F51\u683C", onClick: xe, children: t.jsx(Ac, { size: 14 }) }), t.jsx("button", { className: "jiaren-toolbar-icon", type: "button", title: "\u5438\u9644", "aria-label": "\u5438\u9644", children: t.jsx(wc, { size: 14 }) }), t.jsx("button", { className: "jiaren-toolbar-icon", type: "button", title: "\u5B58\u50A8\u8BBE\u7F6E", "aria-label": "\u5B58\u50A8\u8BBE\u7F6E", onClick: () => i(true), children: t.jsx(kc, { size: 14 }) }), t.jsx("button", { className: Q.resourceLibraryOpen ? "jiaren-toolbar-icon is-active" : "jiaren-toolbar-icon", type: "button", title: "\u6253\u5F00\u7D20\u6750\u5E93", "aria-label": "\u6253\u5F00\u7D20\u6750\u5E93", onClick: () => C({ resourceLibraryOpen: !Q.resourceLibraryOpen }), children: t.jsx(yn, { size: 14 }) }), t.jsx("button", { className: Q.promptLibraryOpen ? "jiaren-toolbar-icon is-active" : "jiaren-toolbar-icon", type: "button", title: "\u6253\u5F00\u63D0\u793A\u8BCD\u5E93", "aria-label": "\u6253\u5F00\u63D0\u793A\u8BCD\u5E93", onClick: () => C({ promptLibraryOpen: !Q.promptLibraryOpen, resourceLibraryOpen: false }), children: t.jsx("img", { className: "jiaren-toolbar-prompt-icon", src: Sc, alt: "", "aria-hidden": "true" }) }), t.jsx("button", { className: Q.jiarenCanvasModeOpen ? "jiaren-toolbar-icon is-active" : "jiaren-toolbar-icon", type: "button", title: "AI \u667A\u80FD\u753B\u5E03", "aria-label": "AI \u667A\u80FD\u753B\u5E03", onClick: () => C({ jiarenCanvasModeOpen: true, jiarenCanvasAgentMode: "magic", promptLibraryOpen: false, resourceLibraryOpen: false }), children: t.jsx(Cc, { size: 14 }) })] })] }), t.jsx("input", { ref: Ji, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: (e) => void $o(e) }), t.jsx("input", { ref: ia, type: "file", accept: ".txt,.md,.markdown,text/plain,text/markdown", hidden: true, onChange: (e) => void No(e) }), !Q.jiarenCanvasModeOpen && Ri ? t.jsx("section", { className: "jiaren-primary-video-prompt", role: "dialog", "aria-modal": "false", "aria-label": "AI \u89C6\u9891\u63D0\u793A\u8BCD\u8F93\u5165", onMouseDown: (e) => e.stopPropagation(), children: t.jsxs("div", { children: [t.jsxs("div", { className: "jiaren-primary-video-reference-stack", children: [t.jsx("button", { type: "button", className: "jiaren-primary-video-reference", title: "\u6DFB\u52A0\u53C2\u8003\u56FE", "aria-label": "\u6DFB\u52A0\u53C2\u8003\u56FE", onClick: () => void Mn(), children: (Dr = Le[0]) != null && Dr.dataUrl || (Rr = Le[0]) != null && Rr.source ? t.jsx("img", { src: Le[0].dataUrl || Le[0].source, alt: "" }) : t.jsx(fn, { size: 20 }) }), t.jsx("span", { children: Le.length > 0 ? `${Le.length} \u5F20\u53C2\u8003` : "\u53C2\u8003\u56FE" })] }), t.jsxs("div", { className: "jiaren-primary-video-main", children: [t.jsxs("header", { className: "jiaren-primary-video-greeting", children: [t.jsx("strong", { children: qi }), t.jsx("span", { children: "\u8F93\u5165\u6545\u4E8B\uFF0C\u62D6\u5165\u89D2\u8272 / \u98CE\u683C / \u5206\u955C\u53C2\u8003\uFF0C\u540E\u53F0\u6309\u5BFC\u6F14\u6280\u80FD\u94FE\u62C6\u955C\u5934\u3002" })] }), t.jsx("textarea", { value: Xe, maxLength: 2e4, autoFocus: true, placeholder: "\u62D6\u62FD / \u7C98\u8D34\u56FE\u7247\u5230\u8FD9\u91CC\uFF0C\u63CF\u8FF0\u4F60\u60F3\u62CD\u7684 AI \u89C6\u9891\u3002\u6BD4\u5982\uFF1A\u673A\u8F66\u7537\u5728\u96E8\u591C\u8D5B\u535A\u4E3B\u5E72\u9053\u72C2\u98D9\uFF0C\u955C\u5934\u8FDE\u7EED\u3001\u4E3B\u89D2\u4E0D\u6362\u4EBA\u3002", onPaste: (e) => void za(e), onChange: (e) => Mt(e.target.value), onKeyDown: (e) => {
    (e.ctrlKey || e.metaKey) && e.key === "Enter" && (e.preventDefault(), er());
  } }), t.jsxs("div", { className: "jiaren-primary-video-options", children: [t.jsx("button", { type: "button", title: "\u4E0A\u4F20\u53C2\u8003\u56FE", onClick: () => void Mn(), children: "+" }), t.jsx("button", { type: "button", title: "\u5BFC\u5165\u5267\u672C", onClick: () => {
    var e;
    return (e = ia.current) == null ? void 0 : e.click();
  }, children: "\u5267\u672C" }), t.jsx("button", { type: "button", title: "\u6253\u5F00\u6280\u80FD", className: kn ? "is-active" : "", onClick: () => {
    ft(false), et(void 0), qe((e) => !e);
  }, children: "\u6280\u80FD" }), t.jsx("button", { type: "button", title: "\u81EA\u5B9A\u4E49\u5F71\u7247\u53C2\u6570", className: wn ? "is-active" : "", onClick: () => {
    qe(false), et(void 0), ft((e) => !e);
  }, children: "\u53C2\u6570" }), t.jsx("button", { type: "button", title: "\u9009\u62E9 Agent", className: it === "agent" ? "is-active" : "", onClick: () => {
    ft(false), qe(false), et((e) => e === "agent" ? void 0 : "agent");
  }, children: "Agent" }), t.jsx("button", { type: "button", title: "\u9009\u62E9\u98CE\u683C", onClick: () => {
    ft(false), et(void 0), qe(true);
  }, children: "\u98CE\u683C" }), t.jsx("button", { type: "button", title: "\u7D20\u6750\u5E93", onClick: () => C({ resourceLibraryOpen: true, promptLibraryOpen: false }), children: "\u8D44\u4EA7" })] }), wn ? t.jsxs("section", { className: "jiaren-primary-video-custom-panel", "aria-label": "AI \u89C6\u9891\u81EA\u5B9A\u4E49\u8BBE\u7F6E", children: [t.jsxs("div", { children: [t.jsx("span", { children: "\u4E3B\u9898" }), t.jsxs("div", { className: "jiaren-primary-video-choice-grid is-tone", children: [["\u70ED\u8840", "\u6210\u957F", "\u8282\u594F", "\u4FE1\u4EFB", "\u5B81\u9759"].map((e) => t.jsx("button", { type: "button", className: Rt === e ? "is-active" : "", onClick: () => Cn(e), children: e }, e)), t.jsx("button", { type: "button", onClick: () => Cn("\u7535\u5F71\u611F"), children: "\u968F\u673A" })] })] }), t.jsxs("div", { children: [t.jsx("span", { children: "\u5F71\u7247\u957F\u5EA6" }), t.jsx("div", { className: "jiaren-primary-video-choice-grid", children: li.map((e) => t.jsx("button", { type: "button", className: Ta === e.id ? "is-active" : "", onClick: () => Qi(e.id), children: e.label }, e.id)) })] }), t.jsxs("div", { children: [t.jsx("span", { children: "\u5F71\u7247\u6BD4\u4F8B" }), t.jsx("div", { className: "jiaren-primary-video-choice-grid", children: ["16:9", "9:16", "1:1"].map((e) => t.jsx("button", { type: "button", className: Et === e ? "is-active" : "", onClick: () => La(e), children: e }, e)) })] }), t.jsxs("div", { children: [t.jsx("span", { children: "\u5BF9\u767D\u8BED\u8A00" }), t.jsx("div", { className: "jiaren-primary-video-choice-grid", children: Il.map((e) => t.jsx("button", { type: "button", className: Dt === e ? "is-active" : "", onClick: () => Ki(e), children: e }, e)) })] }), t.jsxs("div", { children: [t.jsx("span", { children: "\u5206\u955C\u6570\u91CF" }), t.jsx("div", { className: "jiaren-primary-video-choice-grid", children: Sl.map((e) => t.jsxs("button", { type: "button", className: Jt === e ? "is-active" : "", onClick: () => ko(e), children: [e, " \u955C\u5934"] }, e)) })] }), t.jsxs("div", { children: [t.jsx("span", { children: "\u89C6\u9891\u6A21\u578B" }), t.jsx("div", { className: "jiaren-primary-video-choice-grid is-model", children: dn.slice(0, 8).map((e) => t.jsx("button", { type: "button", className: (vt == null ? void 0 : vt.id) === e.id ? "is-active" : "", onClick: () => Hn(e.id), children: mn(e) }, e.id)) })] }), t.jsxs("footer", { className: "jiaren-primary-video-custom-footer", children: [t.jsx("span", { children: "\u7CFB\u7EDF\u53C2\u6570\u9009\u62E9" }), t.jsx("button", { type: "button", onClick: () => void Xi(), children: "\u786E\u8BA4\u53C2\u6570\u5E76\u5F00\u59CB\u751F\u6210" })] })] }) : null, kn ? t.jsxs("section", { className: "jiaren-primary-video-popover is-skill", role: "menu", "aria-label": "\u6280\u80FD\u4E0E\u98CE\u683C", children: [t.jsx("div", { className: "jiaren-primary-video-popover-tabs", children: si.map((e) => t.jsx("button", { type: "button", className: Wn === e ? "is-active" : "", onClick: () => on(e), children: e }, e)) }), t.jsx("div", { className: "jiaren-primary-video-popover-list", children: Va.slice(0, 8).map((e) => t.jsxs("button", { type: "button", className: e.id === Da ? "is-active" : "", onClick: () => {
    Ra(e.id), on(e.category), sa(e.mode), e.styleId && cr(e.styleId), e.tone && Cn(e.tone), qe(false);
  }, children: [t.jsx("strong", { children: e.label }), t.jsx("span", { children: e.hint })] }, e.id)) })] }) : null, it === "agent" ? t.jsxs("section", { className: "jiaren-primary-video-popover is-agent", "aria-label": "Agent \u9009\u62E9", children: [t.jsxs("header", { children: [t.jsx("strong", { children: "Agent" }), t.jsx("span", { children: "\u9009\u62E9\u7F16\u5267/\u5206\u955C\u63A8\u7406\u6A21\u578B" })] }), t.jsxs("div", { className: "jiaren-primary-video-popover-list", children: [ha("agent").slice(0, 8).map((e) => {
    var r, a;
    return t.jsxs("button", { type: "button", className: ((r = fa("agent")) == null ? void 0 : r.id) === e.id ? "is-active" : "", onClick: () => {
      Ir("agent", e), et(void 0);
    }, children: [t.jsx("strong", { children: Ft(e, e.id) }), t.jsx("span", { children: ((a = fa("agent")) == null ? void 0 : a.id) === e.id ? "\u5DF2\u9009\u62E9" : "\u53EF\u7528" })] }, e.id);
  }), ha("agent").length === 0 ? t.jsx("p", { children: "\u5F53\u524D API \u8BBE\u7F6E\u91CC\u6CA1\u6709\u542F\u7528\u63A8\u7406\u6A21\u578B\u3002" }) : null] })] }) : null] }), t.jsxs("div", { className: "jiaren-primary-video-actions", children: [t.jsx("button", { type: "button", title: "\u5173\u95ED", "aria-label": "\u5173\u95ED", onClick: () => rn(false), children: t.jsx(Kt, { size: 14 }) }), t.jsx("button", { type: "button", className: "is-generate", title: wn ? "\u786E\u8BA4\u53C2\u6570\u5E76\u5F00\u59CB\u751F\u6210" : "\u5148\u9009\u62E9\u7CFB\u7EDF\u53C2\u6570", "aria-label": wn ? "\u786E\u8BA4\u53C2\u6570\u5E76\u5F00\u59CB\u751F\u6210" : "\u5148\u9009\u62E9\u7CFB\u7EDF\u53C2\u6570", onClick: er, children: t.jsx(Ic, { size: 18 }) })] })] }) }) : null, !Q.jiarenCanvasModeOpen && Ma ? t.jsxs("section", { className: `jiaren-animation-workbench is-oiio-workbench is-storyboard-console is-page1-design${An ? " is-primary-dock" : ""}${vo === "character-design" ? " is-character" : ""}${Ye ? " is-workflow-active" : " is-start"}`, "aria-label": "\u52A8\u753B\u5DE5\u4F5C\u53F0", children: [Ye ? t.jsxs("aside", { className: "jiaren-page1-agent-console", children: [t.jsxs("header", { className: "jiaren-page1-agent-top", children: [t.jsx("strong", { children: "Jiaren Studio" }), t.jsx("button", { type: "button", title: An ? "\u5173\u95ED" : "\u91CD\u65B0\u5F00\u59CB", "aria-label": An ? "\u5173\u95ED" : "\u91CD\u65B0\u5F00\u59CB", onClick: An ? Os : Ha, children: t.jsx(Kt, { size: 12 }) })] }), t.jsxs("div", { className: "jiaren-page1-agent-scroll", children: [t.jsxs("article", { className: "jiaren-page1-chat-row is-director", children: [t.jsx("div", { className: "jiaren-page1-user-bubble", children: t.jsx("p", { children: Xe.trim() ? Xe.trim() : "\u6211\u60F3\u505A\u4E00\u4E2A\u77ED\u89C6\u9891\u52A8\u753B\uFF0C\u5148\u5E2E\u6211\u63A8\u7406\u65B9\u6848\u3002" }) }), t.jsx("img", { alt: "\u7528\u6237", src: Gr })] }), As(), An && Je ? t.jsxs("section", { className: "jiaren-primary-video-script-preview", "aria-label": "\u5F85\u786E\u8BA4\u5267\u672C\u9884\u89C8", children: [t.jsx("strong", { children: "\u5F85\u786E\u8BA4\u5267\u672C" }), t.jsx("p", { children: $(Je.text, 1200) })] }) : null, ce === "setup" ? t.jsxs("section", { className: "jiaren-page1-setting-card", "aria-label": "\u5F71\u7247\u57FA\u7840\u8BBE\u7F6E", children: [t.jsx("strong", { children: "\u6FC0\u6D3B\u5DE5\u4F5C\u6D41" }), t.jsxs("div", { className: "jiaren-page1-setting-grid", children: [t.jsxs("div", { children: [t.jsx("span", { children: "\u5F71\u7247\u957F\u5EA6" }), [{ id: "30", label: "\u77ED\u89C6\u9891 <1min" }, { id: "60", label: "\u957F\u89C6\u9891 >=1min" }].map((e) => t.jsx("button", { type: "button", className: e.id === Ta ? "is-active" : "", onClick: () => Qi(e.id), children: e.label }, e.id))] }), t.jsxs("div", { children: [t.jsx("span", { children: "\u5F71\u7247\u6BD4\u4F8B" }), t.jsxs("button", { type: "button", className: Et === "16:9" ? "is-active" : "", onClick: () => La("16:9"), children: [t.jsx("img", { alt: "", src: ll }), "\u6A2A\u7248 16:9"] }), t.jsxs("button", { type: "button", className: Et === "9:16" ? "is-active" : "", onClick: () => La("9:16"), children: [t.jsx("img", { alt: "", src: dl }), "\u7AD6\u7248 9:16"] })] }), t.jsxs("div", { children: [t.jsx("span", { children: "\u5BF9\u767D\u8BED\u8A00" }), ["\u82F1\u6587", "\u4E2D\u6587", "\u65E5\u6587"].map((e) => t.jsx("button", { type: "button", className: e === Dt ? "is-active" : "", onClick: () => Ki(e), children: e }, e))] }), t.jsxs("div", { className: "is-emotion", children: [t.jsx("span", { children: "\u60C5\u7EEA\u5173\u952E\u8BCD" }), ["\u51B2\u7A81", "\u529B\u91CF", "\u9AD8\u71C3", "\u5149\u8292", "\u6E29\u67D4", "\u968F\u673A"].map((e) => t.jsx("button", { type: "button", className: e === Rt || e === "\u968F\u673A" && Rt === "\u7535\u5F71\u611F" ? "is-active" : "", onClick: () => Cn(e === "\u968F\u673A" ? "\u7535\u5F71\u611F" : e), children: e }, e))] })] }), t.jsx("input", { className: "jiaren-page1-setting-input", value: sn, placeholder: "\u6CA1\u6709\u5408\u9002\u5173\u952E\u8BCD\uFF1F\u5728\u8FD9\u91CC\u8F93\u5165", onChange: (e) => Vi(e.target.value) })] }) : null, ce === "character" ? t.jsxs("section", { className: "jiaren-page1-style-picker", "aria-label": "\u89D2\u8272\u98CE\u683C\u63A8\u8350", children: [t.jsx("strong", { children: "\u67E5\u627E\u5E76\u63A8\u8350\u98CE\u683C" }), t.jsx("p", { children: Xn ? "\u98CE\u683C\u5DF2\u9501\u5B9A\uFF0C\u540E\u7EED\u7A7A\u73AF\u5883\u3001\u5206\u955C\u548C\u89C6\u9891\u90FD\u4F1A\u7EE7\u627F\u8FD9\u4E2A\u89C6\u89C9 DNA\u3002" : "\u5148\u9009\u62E9\u4E00\u4E2A\u98CE\u683C\uFF1B\u672A\u9009\u62E9\u524D\u4E0D\u4F1A\u5F00\u59CB\u751F\u6210\u89D2\u8272\u56FE\u3002" }), t.jsx("div", { children: xa.map((e) => t.jsxs("button", { className: Xn === e.id ? "is-active" : "", type: "button", onClick: () => ea(e.id), children: [t.jsx("span", { children: e.label }), t.jsx("em", { children: e.tone })] }, e.id)) }), t.jsx("button", { type: "button", className: "jiaren-page1-surprise", onClick: () => ea(xa[(Wa(ce) + 2) % xa.length].id), children: "Surprise Me" }), t.jsxs("div", { className: "jiaren-page1-style-tools", children: [t.jsx("button", { type: "button", onClick: () => void Mn(), children: "\u4E0A\u4F20\u98CE\u683C +" }), t.jsx("button", { type: "button", onClick: () => qe(true), children: "169 \u79CD\u98CE\u683C" })] })] }) : null, ce === "storyboard" ? t.jsxs("section", { className: "jiaren-page1-setting-card", "aria-label": "\u5206\u955C\u8BBE\u7F6E", children: [t.jsx("strong", { children: "\u5206\u955C\u65B9\u6848" }), t.jsxs("div", { className: "jiaren-page1-setting-grid", children: [t.jsxs("div", { children: [t.jsx("span", { children: "\u89C6\u9891\u6A21\u578B" }), dn.slice(0, 8).map((e) => t.jsx("button", { type: "button", className: (jt == null ? void 0 : jt.id) === e.id ? "is-active" : "", onClick: () => Hn(e.id), "aria-label": `\u9009\u62E9\u89C6\u9891\u6A21\u578B ${mn(e)}`, children: mn(e) }, e.id)), dn.length === 0 ? t.jsx("p", { children: "API \u8BBE\u7F6E\u91CC\u6CA1\u6709\u542F\u7528\u53EF\u7528\u89C6\u9891\u6A21\u578B\u3002" }) : null] }), t.jsxs("div", { children: [t.jsx("span", { children: "\u65B9\u6848" }), di.slice(0, 3).map((e) => t.jsx("button", { type: "button", className: e.id === rt ? "is-active" : "", onClick: () => wo(e.id), children: e.label }, e.id))] })] })] }) : null, Le.length > 0 ? t.jsx("div", { className: "jiaren-page1-reference-strip", "aria-label": "\u53C2\u8003\u56FE", children: Le.map((e) => t.jsx("button", { type: "button", title: `\u79FB\u9664 ${e.name}`, onClick: () => Gn((r) => r.filter((a) => a.id !== e.id)), children: t.jsx("img", { src: e.dataUrl || e.source, alt: "" }) }, e.id)) }) : null, kn ? t.jsxs("section", { className: "jiaren-page1-drawer", role: "menu", "aria-label": "\u98CE\u683C\u4E0E\u6280\u80FD\u5E93", children: [t.jsx("div", { className: "jiaren-page1-drawer-tabs", children: si.map((e) => t.jsx("button", { type: "button", className: Wn === e ? "is-active" : "", onClick: () => on(e), children: e }, e)) }), t.jsx("div", { className: "jiaren-page1-skill-list", children: Va.slice(0, 8).map((e) => t.jsxs("button", { type: "button", className: e.id === Da ? "is-active" : "", onClick: () => {
    Ra(e.id), on(e.category), sa(e.mode), e.styleId && cr(e.styleId), e.tone && Cn(e.tone), qe(false);
  }, children: [t.jsx("span", { children: e.label }), t.jsx("em", { children: e.hint })] }, e.id)) })] }) : null, it && it !== "menu" ? t.jsxs("section", { className: "jiaren-page1-drawer", "aria-label": "\u6A21\u578B\u9009\u62E9", children: [t.jsx("strong", { children: it === "agent" ? "\u63A8\u7406\u6A21\u578B" : it === "image" ? "\u56FE\u6587\u6A21\u578B" : it === "video" ? "\u89C6\u9891\u6A21\u578B" : "\u97F3\u9891\u6A21\u578B" }), t.jsxs("div", { className: "jiaren-page1-model-list", children: [ha(it).slice(0, 8).map((e) => {
    var r, a;
    return t.jsxs("button", { type: "button", className: ((r = fa(it)) == null ? void 0 : r.id) === e.id ? "is-selected" : "", onClick: () => Ir(it, e), children: [t.jsx("span", { children: Ft(e, e.id) }), t.jsx("em", { children: ((a = fa(it)) == null ? void 0 : a.id) === e.id ? "\u5DF2\u9009\u62E9" : "\u53EF\u7528\u6A21\u578B" })] }, e.id);
  }), ha(it).length === 0 ? t.jsx("p", { children: "\u5F53\u524D API \u8BBE\u7F6E\u91CC\u6CA1\u6709\u542F\u7528\u8BE5\u7C7B\u578B\u6A21\u578B\u3002" }) : null] })] }) : null] }), t.jsx("section", { className: "jiaren-page1-chat-actions is-main", children: Je ? t.jsxs(t.Fragment, { children: [t.jsx("button", { type: "button", onClick: Ja, children: "\u786E\u8BA4\u5267\u672C\u5E76\u8FDB\u5165\u5206\u955C" }), t.jsx("button", { type: "button", onClick: nr, children: "\u9000\u56DE\u4FEE\u6539" })] }) : t.jsxs(t.Fragment, { children: [t.jsx("button", { type: "button", disabled: fs(), onClick: () => void gs(), children: hs() }), yt[ce].phase === "failed" ? t.jsx("button", { type: "button", onClick: () => Tn(), children: "\u91CD\u505A" }) : null] }) }), t.jsxs("div", { className: "jiaren-page1-toolbar", "aria-label": "\u521B\u4F5C\u5DE5\u5177", children: [t.jsx("button", { type: "button", title: "\u53C2\u8003\u56FE", onClick: () => void Mn(), children: t.jsx("img", { alt: "", src: Fr }) }), t.jsx("button", { type: "button", title: "\u5BFC\u5165\u5267\u672C", onClick: () => {
    var e;
    return (e = ia.current) == null ? void 0 : e.click();
  }, children: t.jsx("img", { alt: "", src: Kr }) }), t.jsx("button", { className: kn ? "is-active" : "", type: "button", title: "Skill \u5E93", onClick: () => qe((e) => !e), children: t.jsx("img", { alt: "", src: Qr }) }), t.jsx("button", { type: "button", title: "\u89C6\u9891\u6A21\u578B", onClick: () => et((e) => e === "video" ? void 0 : "video"), children: t.jsx("img", { alt: "", src: ml }) }), t.jsx("button", { type: "button", title: "\u97F3\u9891\u6A21\u578B", onClick: () => et((e) => e === "music" ? void 0 : "music"), children: t.jsx("img", { alt: "", src: ul }) })] }), t.jsxs("label", { className: "jiaren-page1-input", onDragOver: (e) => e.preventDefault(), onDrop: (e) => void tr(e), children: [t.jsx("textarea", { value: Xe, maxLength: 2e4, onPaste: (e) => void za(e), onChange: (e) => Mt(e.target.value), placeholder: "\u8F93\u5165\u4FEE\u6539\u610F\u89C1\uFF0C\u7CFB\u7EDF\u4F1A\u91CD\u65B0\u63A8\u7406\u5F53\u524D\u5185\u5BB9", "aria-label": "\u52A8\u753B\u521B\u4F5C\u8F93\u5165" }), t.jsx("button", { type: "button", title: "\u53D1\u9001\u4FEE\u6539\u610F\u89C1", "aria-label": "\u53D1\u9001\u4FEE\u6539\u610F\u89C1", onClick: () => Tn(), children: t.jsx("img", { alt: "", src: Vr }) })] }), t.jsxs("footer", { className: "jiaren-page1-status", children: [t.jsx("span", { children: "\u5148\u63A8\u7406\u518D\u751F\u6210" }), t.jsx("em", { children: "\u667A\u80FD\u7F16\u5267" })] })] }) : null, t.jsx("main", { ref: te, className: `jiaren-page1-canvas${Ye ? " is-active" : " is-start"}`, "aria-label": "\u65E0\u9650\u753B\u5E03", onWheel: Uo, onPointerDown: Bo, onPointerMove: Mo, onPointerUp: ar, onPointerCancel: ar, children: Ye ? t.jsx(t.Fragment, { children: t.jsx("section", { className: "jiaren-page1-production-board", style: { transform: `translate3d(${It.x}px, ${It.y}px, 0) scale(${It.zoom})` }, children: Je ? ws() : pn.length ? pn.map((e) => Cs(e)) : t.jsxs("div", { className: "jiaren-page1-canvas-hint", children: [t.jsx("span", { children: "\u5BF9\u8BDD\u753B\u5E03" }), t.jsx("strong", { children: "\u786E\u8BA4\u5267\u672C\u540E\uFF0C\u5267\u672C\u548C\u5206\u955C\u6A21\u5757\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC" })] }) }) }) : t.jsxs("section", { className: "jiaren-page1-start-panel", "aria-label": "\u52A8\u753B\u9879\u76EE\u8F93\u5165", children: [t.jsxs("header", { children: [t.jsx("img", { alt: "", src: Gr }), t.jsx("h1", { children: qi })] }), t.jsxs("label", { className: "jiaren-page1-start-input", onDragOver: (e) => e.preventDefault(), onDrop: (e) => void tr(e), children: [t.jsx("textarea", { value: Xe, maxLength: 2e4, onPaste: (e) => void za(e), onChange: (e) => Mt(e.target.value), placeholder: "\u62D6\u62FD / \u7C98\u8D34\u56FE\u7247\u5230\u8FD9\u91CC\uFF0C\u63CF\u8FF0\u6545\u4E8B\u6897\u6982\u3001\u955C\u5934\u60F3\u6CD5\uFF0C\u6216\u4E0A\u4F20\u5267\u672C", "aria-label": "\u52A8\u753B\u9879\u76EE\u8D77\u59CB\u8F93\u5165" }), t.jsxs("div", { className: "jiaren-page1-start-tools", children: [t.jsx("button", { type: "button", title: "\u6DFB\u52A0\u53C2\u8003\u56FE", onClick: () => void Mn(), children: t.jsx("span", { className: "jiaren-page1-tool-icon", children: t.jsx("img", { alt: "", src: Fr }) }) }), t.jsxs("button", { type: "button", title: "\u4E0A\u4F20\u5267\u672C", onClick: () => {
    var e;
    return (e = ia.current) == null ? void 0 : e.click();
  }, children: [t.jsx("span", { className: "jiaren-page1-tool-icon", children: t.jsx("img", { alt: "", src: Kr }) }), "\u5267\u672C"] }), t.jsxs("button", { type: "button", title: "\u6280\u80FD\u5E93", onClick: () => qe((e) => !e), children: [t.jsx("span", { className: "jiaren-page1-tool-icon", children: t.jsx("img", { alt: "", src: Qr }) }), "\u6280\u80FD\u5E93"] }), t.jsxs("button", { type: "button", title: "\u667A\u80FD\u6A21\u578B", onClick: () => et((e) => e === "agent" ? void 0 : "agent"), children: [t.jsx("span", { className: "jiaren-page1-tool-icon", children: t.jsx("img", { alt: "", src: sl }) }), "\u667A\u80FD\u6A21\u578B"] }), t.jsxs("button", { type: "button", title: "\u98CE\u683C", onClick: () => qe((e) => !e), children: [t.jsx("span", { className: "jiaren-page1-tool-icon", children: t.jsx("img", { alt: "", src: cl }) }), "\u98CE\u683C"] }), t.jsxs("button", { type: "button", title: "\u8D44\u4EA7", onClick: () => C({ resourceLibraryOpen: true }), children: [t.jsx("span", { className: "jiaren-page1-tool-icon", children: t.jsx("img", { alt: "", src: pl }) }), "\u8D44\u4EA7"] }), t.jsx("button", { className: "is-send", type: "button", title: "\u53D1\u9001\u5E76\u6FC0\u6D3B\u5DE5\u4F5C\u6D41", "aria-label": "\u53D1\u9001\u5E76\u6FC0\u6D3B\u5DE5\u4F5C\u6D41", onClick: () => void ca(), children: t.jsx("span", { className: "jiaren-page1-tool-icon", children: t.jsx("img", { alt: "", src: Vr }) }) })] })] }), Le.length > 0 ? t.jsx("div", { className: "jiaren-page1-start-references", children: Le.map((e) => t.jsx("img", { src: e.dataUrl || e.source, alt: "" }, e.id)) }) : null, kn ? t.jsxs("section", { className: "jiaren-page1-start-drawer", role: "menu", "aria-label": "\u98CE\u683C\u4E0E\u6280\u80FD\u5E93", children: [t.jsx("div", { children: si.map((e) => t.jsx("button", { className: Wn === e ? "is-active" : "", type: "button", onClick: () => on(e), children: e }, e)) }), Va.slice(0, 6).map((e) => t.jsxs("button", { type: "button", onClick: () => {
    Ra(e.id), on(e.category), sa(e.mode), qe(false);
  }, children: [t.jsx("strong", { children: e.label }), t.jsx("span", { children: e.hint })] }, e.id))] }) : null] }) }), Ea ? t.jsxs("div", { className: "jiaren-animation-script-chip", children: ["\u5267\u672C\uFF1A", Ea] }) : null, Ss(), Is(), Ps(), $s()] }) : null, Q.jiarenCanvasModeOpen ? null : t.jsx(Vc, { open: Q.historyOpen, onClose: () => C({ historyOpen: false }) }), Q.jiarenCanvasModeOpen ? null : t.jsx(qc, { open: !!Q.resourceLibraryOpen, onClose: () => C({ resourceLibraryOpen: false }), onInsert: Pr, onRestoreSet: Us, onApplySetToVideo: Bs, onNotice: m }), Q.jiarenCanvasModeOpen ? null : t.jsx(v.Suspense, { fallback: null, children: Q.promptLibraryOpen ? t.jsx(jl, { open: true, onClose: () => C({ promptLibraryOpen: false }), onApply: Ns, onNotice: m }) : null }), Q.jiarenCanvasModeOpen ? t.jsx(Ai, { fallback: (e, r) => t.jsxs("section", { className: "jiaren-canvas-crash-fallback", children: [t.jsx("strong", { children: "Jiaren AI \u667A\u80FD\u753B\u5E03\u542F\u52A8\u5931\u8D25" }), t.jsx("span", { children: e.message || "\u672A\u77E5\u6E32\u67D3\u9519\u8BEF" }), t.jsxs("div", { children: [t.jsx("button", { type: "button", onClick: () => {
    r(), C({ jiarenCanvasModeOpen: false });
  }, children: "\u8FD4\u56DE\u4E3B\u753B\u5E03" }), t.jsx("button", { type: "button", onClick: r, children: "\u91CD\u8BD5\u667A\u80FD\u753B\u5E03" })] })] }), onError: (e) => {
    console.error("Jiaren AI canvas mode crashed", e);
  }, children: t.jsx(v.Suspense, { fallback: null, children: t.jsx(vl, { onClose: () => C({ jiarenCanvasModeOpen: false }) }) }) }) : t.jsx(Ai, { fallback: (e, r) => t.jsxs("section", { className: "jiaren-canvas-crash-fallback", children: [t.jsx("strong", { children: "\u753B\u5E03\u5DE5\u4F5C\u53F0\u4E34\u65F6\u5F02\u5E38" }), t.jsx("span", { children: e.message || "\u672A\u77E5\u6E32\u67D3\u9519\u8BEF" }), t.jsxs("div", { children: [t.jsx("button", { type: "button", onClick: r, children: "\u6062\u590D\u753B\u5E03" }), t.jsx("button", { type: "button", onClick: () => window.location.reload(), children: "\u91CD\u65B0\u8F7D\u5165" })] })] }), onError: (e) => {
    console.error("Jiaren AI main canvas crashed", e);
  }, children: t.jsx(v.Suspense, { fallback: null, children: t.jsx(bl, {}) }) }), t.jsxs(v.Suspense, { fallback: null, children: [Q.aiDirectorOpen ? t.jsx(wl, { open: true, runtimeSettings: R, storageSettings: F, canvasAssets: E, onAddCanvasAsset: Ne, onClose: () => C({ aiDirectorOpen: false }), onNotice: m }) : null, Q.designAgentOpen ? t.jsx(xl, { open: true, runtimeSettings: R, storageSettings: F, canvasAssets: E, selectedAssetId: me, onAddCanvasAsset: (JiarenDesignAsset) => {
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
  }, onClose: () => C({ designAgentOpen: false }), onNotice: m }) : null, Q.rongtuStudioOpen ? t.jsx(kl, { open: true, storageSettings: F, canvasAssets: E, initialSource: pe, onAddCanvasAsset: Ne, onClose: () => C({ rongtuStudioOpen: false }), onNotice: m }) : null, Q.comfyWorkflowStudioOpen ? t.jsx(yl, { open: true, storageSettings: F, canvasAssets: E, onAddCanvasAsset: Ne, onClose: () => C({ comfyWorkflowStudioOpen: false }), onNotice: m }) : null, Q.masterToolkitOpen ? t.jsx(Al, { open: true, runtimeSettings: R, storageSettings: F, canvasAssets: E, onAddCanvasAsset: Ne, onClose: () => C({ masterToolkitOpen: false }), onNotice: m, onOpenComfy: () => C({ comfyWorkflowStudioOpen: true }) }) : null] }), t.jsx(Uc, { open: Q.agentOpen, onClose: () => C({ agentOpen: false }) }), b ? t.jsx("div", { className: "app-toast", children: b }) : null] }), t.jsx(Fc, { open: c, onClose: () => u(false) }), t.jsx(Yc, { open: n, onClose: () => i(false) })] });
}
function Si() {
  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#f8fafc"/>
  <rect x="120" y="160" width="784" height="704" rx="48" fill="#dcfce7" stroke="#22c55e" stroke-width="18"/>
  <text x="512" y="500" text-anchor="middle" fill="#166534" font-size="92" font-family="Arial, sans-serif" font-weight="700">Jiaren AI</text>
  <text x="512" y="610" text-anchor="middle" fill="#15803d" font-size="38" font-family="Arial, sans-serif">Preview Asset</text>
</svg>`)))}`;
}
function vi(n = {}) {
  const i = (/* @__PURE__ */ new Date()).toISOString();
  return { id: n.id ?? crypto.randomUUID(), kind: n.kind ?? "image", name: n.name ?? "\u9884\u89C8\u7D20\u6750", category: n.category ?? "\u9884\u89C8", tags: n.tags ?? [], favorite: n.favorite ?? false, createdAt: n.createdAt ?? i, updatedAt: n.updatedAt ?? i, source: n.source, localPath: n.localPath, dataUrl: n.dataUrl ?? (n.kind === "text" ? void 0 : Si()), thumbnail: n.thumbnail ?? (n.kind === "text" ? void 0 : Si()), mimeType: n.mimeType ?? (n.kind === "text" ? "text/plain" : "image/svg+xml"), text: n.text, metadata: n.metadata };
}
function Cd() {
  const n = [];
  return { runtime: { testConnection: async (i) => ({ ok: true, status: 200, message: `\u9884\u89C8\u6A21\u5F0F\u5DF2\u6A21\u62DF\u8FDE\u63A5 ${i.modelId}\u3002\u771F\u5B9E API \u8BF7\u5728 Electron \u684C\u9762\u7A0B\u5E8F\u4E2D\u6D4B\u8BD5\u3002` }), listProviderModels: async () => ({ ok: true, status: 200, message: "\u9884\u89C8\u6A21\u5F0F\u4E0D\u4F1A\u8BFB\u53D6\u771F\u5B9E\u6A21\u578B\u5217\u8868\uFF0C\u8BF7\u5728 Electron \u684C\u9762\u7A0B\u5E8F\u4E2D\u540C\u6B65\u3002", models: [] }), generateImage: async (i) => ({ id: crypto.randomUUID(), modelId: i.modelId, status: "succeeded", elapsedMs: 320, assets: [{ id: crypto.randomUUID(), type: "image", dataUrl: Si(), width: 1024, height: 1024 }], message: "\u9884\u89C8\u6A21\u5F0F\u8FD4\u56DE\u793A\u4F8B\u56FE\u7247\u3002" }), generateVideo: async (i) => ({ id: crypto.randomUUID(), modelId: i.modelId, status: "queued", elapsedMs: 120, assets: [], message: "\u9884\u89C8\u6A21\u5F0F\u5DF2\u6A21\u62DF\u63D0\u4EA4\u89C6\u9891\u4EFB\u52A1\u3002", taskId: "preview-video-task" }), removeBackground: async (i) => ({ id: crypto.randomUUID(), modelId: i.modelKey, status: "failed", elapsedMs: 0, assets: [], message: "\u672C\u5730\u62A0\u56FE\u9700\u8981 Electron \u4E3B\u8FDB\u7A0B\u3002" }), getUpscaylStatus: async () => ({ ok: false, models: [], message: "\u65E0\u635F\u9AD8\u6E05\u9700\u8981 Electron \u684C\u9762\u7248\u548C\u672C\u5730\u5F15\u64CE\u3002" }), upscaleImage: async () => ({ id: crypto.randomUUID(), modelId: "local-upscayl", status: "failed", elapsedMs: 0, assets: [], message: "\u65E0\u635F\u9AD8\u6E05\u9700\u8981 Electron \u684C\u9762\u7248\u3002" }), reverseAnalyze: async (i) => ({ id: crypto.randomUUID(), ok: true, elapsedMs: 120, message: "\u9884\u89C8\u6A21\u5F0F\u5DF2\u751F\u6210\u793A\u4F8B\u53CD\u63A8\u63D0\u793A\u3002", result: { subject: "\u4EA7\u54C1\u4E3B\u4F53", scene: i.mode === "video" ? "\u5546\u4E1A\u77ED\u7247\u5173\u952E\u5E27" : "\u9759\u7269\u5E7F\u544A\u753B\u9762", camera: "\u4E2D\u8FD1\u666F\uFF0C\u8F7B\u5FAE\u4FEF\u89C6", movement: i.mode === "video" ? "\u6162\u63A8\u955C\u5934" : "\u9759\u6001\u6784\u56FE", lighting: "\u67D4\u548C\u68DA\u62CD\u5149", style: "\u6781\u7B80\u5546\u4E1A\u5E7F\u544A", mood: "\u5E72\u51C0\u3001\u9AD8\u7EA7\u3001\u53EF\u4FE1\u8D56", composition: "\u4E3B\u4F53\u5C45\u4E2D\uFF0C\u7559\u767D\u6E05\u6670", materials: "\u6E05\u6670\u6750\u8D28\u4E0E\u67D4\u548C\u9AD8\u5149", colors: ["white", "soft green", "cool gray"], prompt: "\u6781\u7B80\u5546\u4E1A\u5E7F\u544A\u98CE\u683C\uFF0C\u4E3B\u4F53\u5C45\u4E2D\uFF0C\u67D4\u548C\u68DA\u62CD\u5149\uFF0C\u9AD8\u7EA7\u5E72\u51C0\u7684\u4EA7\u54C1\u8D28\u611F\uFF0C\u6D45\u8272\u80CC\u666F\uFF0C\u6E05\u6670\u6784\u56FE\u3002", videoPrompt: "\u4EE5\u4EA7\u54C1\u4E3A\u4E3B\u4F53\u7684\u5546\u4E1A\u77ED\u7247\uFF0C\u6162\u63A8\u955C\u5934\uFF0C\u67D4\u548C\u68DA\u62CD\u5149\uFF0C\u5E72\u51C0\u8F6C\u573A\uFF0C\u9AD8\u7EA7\u6781\u7B80\u98CE\u683C\u3002", shots: [{ title: "\u955C\u5934 1", prompt: "\u4EA7\u54C1\u9759\u7269\u5F00\u573A\uFF0C\u4E3B\u4F53\u5C45\u4E2D\uFF0C\u67D4\u548C\u5F71\u68DA\u5149\u3002", camera: "\u4E2D\u8FD1\u666F", movement: "\u6162\u63A8", lighting: "\u67D4\u548C\u68DA\u62CD\u5149", duration: 4 }] } }), chat: async (i) => ({ id: crypto.randomUUID(), ok: true, elapsedMs: 80, content: `\u9884\u89C8\u6A21\u5F0F\u5DF2\u6A21\u62DF ${i.modelId} \u5BF9\u8BDD\u56DE\u590D\u3002`, message: "\u9884\u89C8\u6A21\u5F0F\u5BF9\u8BDD\u5B8C\u6210\u3002" }), getComfyRongtuStatus: async () => ({ ok: false, detected: false, running: false, baseUrl: "http://127.0.0.1:8188", passwordFilled: true, missing: ["Electron desktop"], message: "\u9884\u89C8\u6A21\u5F0F\u4E0D\u80FD\u542F\u52A8\u672C\u5730 ComfyUI\u3002" }), generateComfyRongtu: async () => ({ id: crypto.randomUUID(), modelId: "local-comfyui-rongtu", status: "failed", elapsedMs: 0, assets: [], message: "\u9884\u89C8\u6A21\u5F0F\u4E0D\u80FD\u542F\u52A8\u672C\u5730 ComfyUI\u3002" }), getComfyInstances: async () => ({ instances: ["127.0.0.1:8188"] }), saveComfyInstances: async (i) => ({ instances: i }), listComfyWorkflows: async () => ({ workflows: [] }), getComfyWorkflow: async (i) => ({ name: i, workflow: {}, builtin: false, config: { title: i.replace(/\.json$/i, ""), fields: [] } }), uploadComfyWorkflow: async (i) => ({ name: `custom/${i.name.endsWith(".json") ? i.name : `${i.name}.json`}`, workflow: i.workflow, builtin: false, config: { title: i.name.replace(/\.json$/i, ""), fields: [] } }), saveComfyWorkflowConfig: async (i, c) => ({ name: i, workflow: {}, builtin: false, config: c }), deleteComfyWorkflow: async () => ({ ok: true }), runComfyWorkflow: async () => ({ id: crypto.randomUUID(), modelId: "local-comfyui-workflow", status: "failed", elapsedMs: 0, assets: [], message: "\u9884\u89C8\u6A21\u5F0F\u4E0D\u80FD\u8FD0\u884C\u672C\u5730 ComfyUI \u5DE5\u4F5C\u6D41\u3002" }) }, system: { selectFiles: async () => ({ canceled: true, assets: [] }), selectDirectory: async () => {
    const i = window.prompt("\u9884\u89C8\u6A21\u5F0F\uFF1A\u8BF7\u8F93\u5165\u76EE\u5F55\u8DEF\u5F84", "E:\\AI\u56FE\u6587\\\u7F13\u5B58");
    return i ? { canceled: false, path: i } : { canceled: true };
  }, openPath: async (i) => ({ ok: true, message: `\u9884\u89C8\u6A21\u5F0F\uFF1A\u5DF2\u6A21\u62DF\u6253\u5F00 ${i || "\u76EE\u5F55"}` }), openExternal: async (i) => ({ ok: true, message: `\u9884\u89C8\u6A21\u5F0F\uFF1A\u5DF2\u6A21\u62DF\u6253\u5F00\u5916\u90E8\u94FE\u63A5 ${i}` }), saveAsset: async () => ({ ok: true, message: "\u9884\u89C8\u6A21\u5F0F\uFF1A\u5DF2\u6A21\u62DF\u4FDD\u5B58\u7D20\u6750\u3002" }), readTextFile: async () => ({ ok: false, message: "\u9884\u89C8\u6A21\u5F0F\u4E0D\u80FD\u8BFB\u53D6\u672C\u5730\u6587\u672C\u6587\u4EF6\u3002" }), composeVideo: async (i) => ({ ok: false, id: crypto.randomUUID(), elapsedMs: 0, message: `\u9884\u89C8\u6A21\u5F0F\u4E0D\u80FD\u5408\u6210\u5B8C\u6574\u89C6\u9891\uFF1B\u684C\u9762 EXE \u4F1A\u7528\u672C\u5730 ffmpeg \u62FC\u63A5 ${i.clips.length} \u4E2A\u7247\u6BB5\u3002`, clipCount: i.clips.length }), cropStoryboardGrid: async () => ({ ok: false, id: crypto.randomUUID(), elapsedMs: 0, message: "\u9884\u89C8\u6A21\u5F0F\u4E0D\u80FD\u88C1\u5207\u5BAB\u683C\u5206\u955C\uFF1B\u684C\u9762 EXE \u4F1A\u5728\u672C\u5730\u81EA\u52A8\u88C1\u5207\u3002", panels: [], panelCount: 0 }), exportLayeredPsd: async () => ({ ok: false, id: crypto.randomUUID(), elapsedMs: 0, message: "PSD \u5206\u5C42\u5BFC\u51FA\u9700\u8981 Electron \u684C\u9762\u7A0B\u5E8F\u3002" }), openGenPsd: async (i) => ({ ok: /^https:\/\//i.test(i.imageUrl), url: /^https:\/\//i.test(i.imageUrl) ? `https://www.genpsd.com/${i.locale ?? "zh-cn"}/?picurl=${encodeURIComponent(i.imageUrl)}` : void 0, message: /^https:\/\//i.test(i.imageUrl) ? "\u9884\u89C8\u6A21\u5F0F\uFF1A\u5DF2\u6A21\u62DF\u6253\u5F00 GenPSD\u3002" : "\u9884\u89C8\u6A21\u5F0F\u4E0D\u80FD\u4E0A\u4F20\u672C\u5730\u56FE\u7247\uFF1B\u684C\u9762\u7248\u4F1A\u81EA\u52A8\u4E0A\u4F20\u4E3A HTTPS \u76F4\u94FE\u540E\u6253\u5F00 GenPSD\u3002" }), generateHunyuan3D: async () => ({ ok: false, id: crypto.randomUUID(), elapsedMs: 0, message: "\u817E\u8BAF\u6DF7\u5143\u751F 3D \u9700\u8981 Electron \u684C\u9762\u7A0B\u5E8F\u548C\u817E\u8BAF\u4E91\u5BC6\u94A5\u3002", files: [], assets: [] }), saveProject: async () => ({ ok: true, message: "\u9884\u89C8\u6A21\u5F0F\uFF1A\u5DF2\u6A21\u62DF\u4FDD\u5B58\u9879\u76EE\u3002" }), loadProject: async () => {
  }, getStats: async () => {
    const i = performance.memory, c = (u) => Math.round(u / 1024 / 1024 * 10) / 10;
    return { heapUsedMb: i ? c(i.usedJSHeapSize) : 70.1, heapTotalMb: i ? c(i.totalJSHeapSize) : 4096, rssMb: 0, systemFreeMb: 32594, systemTotalMb: 65536 };
  }, getDefaultPaths: async () => ({ dataRoot: ".jiaren", projectRoot: ".project", cacheDir: "E:\\AI\u56FE\u6587\\\u7F13\u5B58", downloadsDir: "E:\\AI\u56FE\u6587" }), listResources: async (i) => {
    var b;
    const c = (b = i == null ? void 0 : i.search) == null ? void 0 : b.trim().toLowerCase();
    return { ok: true, items: n.filter((m) => !(i != null && i.kind) || i.kind === "all" || m.kind === i.kind).filter((m) => !(i != null && i.favoriteOnly) || m.favorite).filter((m) => !c || [m.name, m.category, m.text, ...m.tags ?? []].some((A) => A == null ? void 0 : A.toLowerCase().includes(c))) };
  }, addResource: async (i) => {
    const c = vi({ kind: i.kind ?? (i.text ? "text" : "image"), name: i.name, category: i.category, tags: i.tags, favorite: i.favorite, source: i.source, localPath: i.localPath, dataUrl: i.dataUrl, mimeType: i.mimeType, text: i.text, metadata: i.metadata });
    return n.unshift(c), { ok: true, item: c, items: n };
  }, updateResource: async (i, c) => {
    const u = n.find((b) => b.id === i) ?? vi({ id: i });
    return Object.assign(u, c, { updatedAt: (/* @__PURE__ */ new Date()).toISOString() }), n.some((b) => b.id === i) || n.unshift(u), { ok: true, item: u, items: n };
  }, deleteResource: async (i) => {
    const c = n.find((b) => b.id === i) ?? vi({ id: i }), u = n.findIndex((b) => b.id === i);
    return u >= 0 && n.splice(u, 1), { ok: true, item: c, items: n };
  }, loadPreferences: async () => ({}), savePreferences: async () => ({ ok: true, message: "\u9884\u89C8\u6A21\u5F0F\uFF1A\u5DF2\u6A21\u62DF\u4FDD\u5B58\u504F\u597D\u8BBE\u7F6E\u3002" }), queryApiBalance: async () => ({ ok: true, status: 200, message: "\u9884\u89C8\u6A21\u5F0F\uFF1A\u5DF2\u6A21\u62DF\u67E5\u8BE2\u7B2C\u4E09\u65B9 API \u4F59\u989D\u3002", token: { remainCredits: 200, usedCredits: 0, creditsPerUsd: 200, unlimitedQuota: false }, user: { remainCredits: 200, usedCredits: 0, creditsPerUsd: 200, unlimitedQuota: false } }), windowCommand: async () => ({ ok: true, isMaximized: false }), getZoom: async () => ({ zoomPercent: 100 }), setZoom: async (i) => ({ zoomPercent: i }), getMachineCode: async () => ({ machineCode: "JR-PREVIEW-00000000" }), loadLicense: async () => ({ active: false, machineCode: "JR-PREVIEW-00000000", message: "\u9884\u89C8\u6A21\u5F0F\u672A\u6FC0\u6D3B\u3002" }), activateLicense: async () => ({ active: true, machineCode: "JR-PREVIEW-00000000", token: "preview-token", plan: "preview", quotaTotal: 100, quotaUsed: 0, quotaRemaining: 100, message: "\u9884\u89C8\u6A21\u5F0F\u5DF2\u6A21\u62DF\u6FC0\u6D3B\u3002" }), verifyLicense: async () => ({ active: true, machineCode: "JR-PREVIEW-00000000", token: "preview-token", plan: "preview", quotaTotal: 100, quotaUsed: 0, quotaRemaining: 100, message: "\u9884\u89C8\u6A21\u5F0F\u4F1A\u5458\u6709\u6548\u3002" }), consumeLicenseQuota: async (i) => ({ active: true, machineCode: "JR-PREVIEW-00000000", token: "preview-token", plan: "preview", quotaTotal: 100, quotaUsed: i.amount, quotaRemaining: 100 - i.amount, message: `\u9884\u89C8\u6A21\u5F0F\u5DF2\u6A21\u62DF\u6263\u9664 ${i.amount} \u70B9\u989D\u5EA6\u3002` }) } };
}
function Id() {
  window.jiaren || Object.defineProperty(window, "jiaren", { value: Cd(), configurable: true });
}
Id();
function Sd({ error: n, reset: i }) {
  return t.jsx("div", { style: { display: "grid", minHeight: "100vh", placeItems: "center", background: "#f6fbf8", color: "#143522", fontFamily: '"Microsoft YaHei", "PingFang SC", system-ui, sans-serif', padding: 24 }, children: t.jsxs("section", { style: { width: "min(520px, calc(100vw - 48px))", border: "1px solid rgba(22, 101, 52, 0.16)", borderRadius: 18, background: "rgba(255, 255, 255, 0.92)", boxShadow: "0 18px 48px rgba(15, 23, 42, 0.10)", padding: 24 }, children: [t.jsx("strong", { style: { display: "block", fontSize: 18, marginBottom: 8 }, children: "\u753B\u5E03\u754C\u9762\u4E34\u65F6\u5F02\u5E38" }), t.jsxs("p", { style: { margin: "0 0 18px", color: "#5f6f65", lineHeight: 1.6 }, children: ["\u5DF2\u62E6\u622A\u524D\u7AEF\u6E32\u67D3\u9519\u8BEF\uFF0C\u907F\u514D\u56DE\u5230\u542F\u52A8\u9875\u3002\u9519\u8BEF\u4FE1\u606F\uFF1A", n.message || "\u672A\u77E5\u9519\u8BEF"] }), t.jsxs("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [t.jsx("button", { type: "button", onClick: i, style: { height: 36, borderRadius: 10, border: "1px solid #bbdbc5", background: "#eaf8ee", color: "#12612e", padding: "0 14px", fontWeight: 700 }, children: "\u6062\u590D\u754C\u9762" }), t.jsx("button", { type: "button", onClick: () => window.location.reload(), style: { height: 36, borderRadius: 10, border: "1px solid #d6ded9", background: "#fff", color: "#314238", padding: "0 14px", fontWeight: 700 }, children: "\u91CD\u65B0\u8F7D\u5165" })] })] }) });
}
const Mi = document.getElementById("root");
if (!Mi) throw new Error("Jiaren AI root element is missing.");
Mi.dataset.jiarenMounted = "true";
document.body.classList.add("jiaren-app-mounted");
Gs.createRoot(Mi).render(t.jsx(zs.StrictMode, { children: t.jsx(Ai, { fallback: (n, i) => t.jsx(Sd, { error: n, reset: i }), onError: (n, i) => {
  console.error("Jiaren AI root crashed", n, i.componentStack);
}, children: t.jsx(kd, {}) }) }));
export {
  Lc as M,
  sl as a,
  Kr as b,
  pl as c,
  Vr as d,
  Fr as s
};

/* Jiaren history MIME-preserving downloads v112 */
