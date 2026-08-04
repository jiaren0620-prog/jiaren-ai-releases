import { F as Runtime, S as React } from "./vendor-C8NPC5kM.js";
import { H as Handle, P as Position, u as useReactFlow } from "./vendor-flow-BUHgv_lX.js";
import { useEdges, useNodes } from "./t8-flow-shim.js";

const { jsx, jsxs } = Runtime;
const { memo, useEffect, useMemo, useRef, useState } = React;

const sourceOf = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String(value.dataUrl || value.localPath || value.url || value.source || "");
};

const assetsFromData = (data = {}) => {
  const values = [];
  [data.outputAssets, data.assets, data.referenceAssets].forEach((items) => {
    if (Array.isArray(items)) items.forEach((item) => values.push(item));
  });
  [data.imageSource, data.imageUrl, data.localPath, data.dataUrl].forEach((item) => {
    if (item) values.push(item);
  });
  const unique = new Map();
  values.forEach((item, index) => {
    const source = sourceOf(item);
    if (!source || unique.has(source)) return;
    unique.set(source, typeof item === "object" ? item : {
      name: `上游图片 ${index + 1}`,
      localPath: /^([a-zA-Z]:[\\/]|\\\\)/.test(source) ? source : undefined,
      dataUrl: source.startsWith("data:") ? source : undefined,
      url: /^https?:/i.test(source) ? source : undefined,
      mimeType: "image/png",
    });
  });
  return [...unique.values()];
};

const normalizeBaseUrl = (value) => {
  const text = String(value || "").trim();
  if (!text) return "http://127.0.0.1:8188";
  return /^https?:\/\//i.test(text) ? text : `http://${text}`;
};

const resultSource = (asset) => sourceOf(asset);

const usePatchNode = (id) => {
  const flow = useReactFlow();
  return (patch) => {
    flow.setNodes((nodes) => nodes.map((node) => node.id === id
      ? { ...node, data: { ...node.data, ...patch } }
      : node));
    window.dispatchEvent(new Event("jiaren-flow-refresh"));
  };
};

const useUpstreamImages = (id) => {
  const nodes = useNodes();
  const edges = useEdges();
  return useMemo(() => {
    const sourceIds = edges.filter((edge) => edge.target === id).map((edge) => edge.source);
    return assetsFromData({
      assets: sourceIds.flatMap((sourceId) => assetsFromData(nodes.find((node) => node.id === sourceId)?.data)),
    });
  }, [edges, id, nodes]);
};

export const JiarenComfyWorkflowDefaultData = () => ({
  kind: "comfyui-store",
  workflowName: "",
  baseUrl: "",
  prompt: "",
  status: "idle",
  message: "选择本地工作流。",
  outputAssets: [],
  imageUrls: [],
});

export const JiarenComfyAppMakerDefaultData = () => ({
  kind: "comfyui-app-maker",
  workflowTitle: "",
  status: "idle",
  message: "等待导入 ComfyUI API Workflow JSON。",
});

export const JiarenComfyWorkflowNode = memo(function JiarenComfyWorkflowNode({ id, data, selected }) {
  const patch = usePatchNode(id);
  const upstreamImages = useUpstreamImages(id);
  const [workflows, setWorkflows] = useState([]);
  const [workflow, setWorkflow] = useState(null);
  const [instances, setInstances] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const runtime = window.jiaren?.runtime;
    if (!runtime) return;
    try {
      const [workflowResult, instanceResult] = await Promise.all([
        runtime.listComfyWorkflows(),
        runtime.getComfyInstances(),
      ]);
      const nextWorkflows = workflowResult?.workflows || [];
      const nextInstances = instanceResult?.instances || [];
      setWorkflows(nextWorkflows);
      setInstances(nextInstances);
      const name = data.workflowName || nextWorkflows[0]?.name || "";
      if (!data.workflowName && name) patch({ workflowName: name });
      if (name) setWorkflow(await runtime.getComfyWorkflow(name));
    } catch (error) {
      patch({ status: "error", message: error instanceof Error ? error.message : "读取 ComfyUI 工作流失败。" });
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    if (!data.workflowName || !window.jiaren?.runtime?.getComfyWorkflow) return;
    void window.jiaren.runtime.getComfyWorkflow(data.workflowName).then(setWorkflow).catch(() => setWorkflow(null));
  }, [data.workflowName]);

  const run = async () => {
    const runtime = window.jiaren?.runtime;
    if (!runtime?.runComfyWorkflow || !workflow) {
      patch({ status: "error", message: "请先导入并选择 ComfyUI 工作流。" });
      return;
    }
    setBusy(true);
    patch({ status: "running", message: "本地 ComfyUI 工作流运行中...", outputAssets: [], imageUrls: [] });
    try {
      const fields = {};
      const imageQueue = [...upstreamImages];
      for (const field of workflow.config?.fields || []) {
        const key = String(field.id || `${field.node}::${field.input}`);
        const inputName = String(field.input || field.name || "").toLowerCase();
        let value = field.default ?? "";
        if (field.type === "image" && imageQueue.length) value = imageQueue.shift();
        if ((field.type === "text" || field.type === "textarea") && data.prompt && /prompt|text|positive|提示词|正向/.test(inputName)) {
          value = data.prompt;
        }
        fields[key] = value;
      }
      const baseUrl = normalizeBaseUrl(data.baseUrl || instances[0]);
      const storage = window.__JIAREN_STORAGE_SETTINGS__ || {};
      const result = await runtime.runComfyWorkflow({
        name: workflow.name,
        fields,
        config: workflow.config,
        baseUrl,
        cacheDir: storage.cacheDir,
        downloadsDir: storage.downloadsDir,
      });
      if (!result || result.status !== "succeeded") throw new Error(result?.message || "ComfyUI 工作流运行失败。");
      const assets = Array.isArray(result.assets) ? result.assets : [];
      const images = assets.filter((asset) => asset.type === "image" || String(asset.mimeType || "").startsWith("image/"));
      const urls = images.map(resultSource).filter(Boolean);
      patch({
        status: "succeeded",
        message: result.message || `已返回 ${assets.length} 个结果。`,
        outputAssets: assets,
        imageUrls: urls,
        imageUrl: urls[0] || "",
        imageSource: urls[0] || "",
        localPath: images[0]?.localPath,
      });
    } catch (error) {
      patch({ status: "error", message: error instanceof Error ? error.message : "ComfyUI 工作流运行失败。" });
    } finally {
      setBusy(false);
    }
  };

  const images = Array.isArray(data.imageUrls) ? data.imageUrls : [];
  return jsxs("section", { className: `jiaren-comfy-node${selected ? " is-selected" : ""}`, children: [
    jsx(Handle, { type: "target", position: Position.Left, className: "jiaren-comfy-port" }),
    jsx(Handle, { type: "source", position: Position.Right, className: "jiaren-comfy-port" }),
    jsxs("header", { children: [
      jsxs("div", { children: [jsx("strong", { children: "ComfyUI 工作流" }), jsx("small", { children: workflow?.config?.title || "JiarenAI 本地运行" })] }),
      jsx("span", { className: `is-${data.status || "idle"}`, children: busy ? "运行中" : data.status === "succeeded" ? "已完成" : data.status === "error" ? "失败" : "就绪" }),
    ] }),
    jsxs("div", { className: "jiaren-comfy-form", children: [
      jsxs("label", { children: [jsx("span", { children: "工作流" }), jsx("select", { value: data.workflowName || "", onChange: (event) => patch({ workflowName: event.target.value, status: "idle" }), children: workflows.length ? workflows.map((item) => jsx("option", { value: item.name, children: item.title || item.name }, item.name)) : jsx("option", { value: "", children: "尚未导入" }) })] }),
      jsxs("label", { children: [jsx("span", { children: "后端地址" }), jsx("select", { value: data.baseUrl || instances[0] || "", onChange: (event) => patch({ baseUrl: event.target.value }), children: instances.length ? instances.map((item) => jsx("option", { value: item, children: item }, item)) : jsx("option", { value: "http://127.0.0.1:8188", children: "127.0.0.1:8188" }) })] }),
      jsxs("label", { children: [jsx("span", { children: "提示词" }), jsx("textarea", { rows: 3, value: data.prompt || "", onChange: (event) => patch({ prompt: event.target.value }), placeholder: "补充当前工作流的生成要求" })] }),
    ] }),
    jsxs("div", { className: "jiaren-comfy-summary", children: [jsx("span", { children: `上游图片 ${upstreamImages.length}` }), jsx("span", { children: `输出 ${images.length}` })] }),
    images.length ? jsx("div", { className: "jiaren-comfy-results", children: images.slice(0, 4).map((source, index) => jsx("img", { src: source, alt: `ComfyUI 结果 ${index + 1}` }, `${source}-${index}`)) }) : null,
    jsxs("footer", { children: [
      jsx("span", { title: data.message || "", children: data.message || "就绪" }),
      jsxs("div", { children: [jsx("button", { type: "button", onClick: () => void load(), children: "刷新" }), jsx("button", { type: "button", className: "is-primary", disabled: busy || !workflow, onClick: () => void run(), children: busy ? "运行中" : "运行" })] }),
    ] }),
  ] });
});

export const JiarenComfyAppMakerNode = memo(function JiarenComfyAppMakerNode({ id, data, selected }) {
  const patch = usePatchNode(id);
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const importWorkflow = async (file) => {
    if (!file || !window.jiaren?.runtime?.uploadComfyWorkflow) return;
    setBusy(true);
    patch({ status: "running", message: "正在导入工作流..." });
    try {
      const workflowJson = JSON.parse(await file.text());
      const title = String(data.workflowTitle || file.name.replace(/\.json$/i, "")).trim();
      if (!title) throw new Error("请填写工作流名称。");
      const result = await window.jiaren.runtime.uploadComfyWorkflow({ name: title, workflow: workflowJson });
      if (!result) throw new Error("工作流导入失败。");
      patch({ status: "succeeded", workflowTitle: result.name || title, workflowName: result.name || title, message: `已保存：${result.config?.title || result.name || title}`, outputText: result.name || title });
    } catch (error) {
      patch({ status: "error", message: error instanceof Error ? error.message : "工作流导入失败。" });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return jsxs("section", { className: `jiaren-comfy-node jiaren-comfy-maker${selected ? " is-selected" : ""}`, children: [
    jsx(Handle, { type: "source", position: Position.Right, className: "jiaren-comfy-port" }),
    jsxs("header", { children: [jsxs("div", { children: [jsx("strong", { children: "ComfyUI 应用制作" }), jsx("small", { children: "JiarenAI 本地工作流" })] }), jsx("span", { className: `is-${data.status || "idle"}`, children: busy ? "导入中" : data.status === "succeeded" ? "已保存" : "就绪" })] }),
    jsxs("div", { className: "jiaren-comfy-form", children: [
      jsxs("label", { children: [jsx("span", { children: "工作流名称" }), jsx("input", { value: data.workflowTitle || "", onChange: (event) => patch({ workflowTitle: event.target.value }), placeholder: "例如：产品草图写实渲染" })] }),
      jsx("input", { ref: fileRef, type: "file", accept: "application/json,.json", hidden: true, onChange: (event) => void importWorkflow(event.target.files?.[0]) }),
      jsx("button", { type: "button", className: "jiaren-comfy-import is-primary", disabled: busy, onClick: () => fileRef.current?.click(), children: busy ? "导入中" : "导入 Workflow JSON" }),
    ] }),
    jsx("footer", { children: jsx("span", { title: data.message || "", children: data.message || "等待导入" }) }),
  ] });
});
