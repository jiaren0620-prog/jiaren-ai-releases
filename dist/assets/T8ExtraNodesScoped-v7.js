import React from "./t8-react-shim.js";
import * as Nodes from "./T8ExtraNodes-complete-v7.js";
import {
  T8ImageNode268,
  T8OutputNode268,
  T8UploadNode268,
} from "./T8ImageAudio268.js";
import { Handle, Position, T8NodeIdProvider } from "./t8-flow-shim.js";
import { createPortal } from "./t8-react-dom-shim.js";

const scoped = (Component) => function T8ScopedNode(props) {
  return React.createElement(
    T8NodeIdProvider,
    { id: props.id },
    React.createElement(
      "div",
      { className: "t8-original-scope" },
      React.createElement(Component, props),
    ),
  );
};

const firstImageSource = (data = {}) => {
  const output = Array.isArray(data.outputAssets)
    ? data.outputAssets.find((asset) => asset?.type === "image")
    : undefined;
  return data.imageUrl
    || data.imageSource
    || data.imageUrls?.[0]
    || data.urls?.[0]
    || output?.dataUrl
    || output?.localPath
    || output?.url
    || "";
};

const useJiarenImageEditorAnchor = (nodeId, active) => {
  React.useEffect(() => {
    if (!active || typeof document === "undefined") return undefined;

    let frame = 0;
    const sync = () => {
      const node =
        document.querySelector(`.react-flow__node[data-id="${nodeId}"]`) ||
        document.querySelector(`[data-node-id="${nodeId}"]`)?.closest(".react-flow__node");
      const editor = document.querySelector(
        `[data-jiaren-media-editor="image"][data-jiaren-node-id="${nodeId}"]`,
      );
      if (!node || !editor) return;

      const rect = node.getBoundingClientRect();
      const viewport = node.closest(".react-flow")?.getBoundingClientRect() || {
        left: 0,
        right: window.innerWidth,
        top: 0,
        bottom: window.innerHeight,
        width: window.innerWidth,
      };
      const width = Math.min(1040, Math.max(520, viewport.width - 36));
      const half = width / 2;
      const center = rect.left + rect.width / 2;
      const left = Math.max(
        viewport.left + half + 18,
        Math.min(viewport.right - half - 18, center),
      );
      const top = rect.bottom + 12;
      const bottomToolbar = document.querySelector(".bottom-floating-toolbar");
      const bottomToolbarRect = bottomToolbar?.getBoundingClientRect();
      const safeBottom = bottomToolbarRect && bottomToolbarRect.top > viewport.top + 220
        ? Math.min(viewport.bottom, bottomToolbarRect.top - 10)
        : viewport.bottom - 76;
      const maxHeight = Math.max(190, safeBottom - top - 14);

      editor.style.setProperty("--jiaren-media-anchor-left", `${left}px`);
      editor.style.setProperty("--jiaren-media-anchor-top", `${top}px`);
      editor.style.setProperty("--jiaren-media-anchor-width", `${width}px`);
      editor.style.setProperty(
        "--jiaren-media-anchor-max-height",
        `${Math.min(430, maxHeight)}px`,
      );
      editor.dataset.jiarenPlacement = "below";
    };

    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(sync);
    };
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : null;
    const node =
      document.querySelector(`.react-flow__node[data-id="${nodeId}"]`) ||
      document.querySelector(`[data-node-id="${nodeId}"]`)?.closest(".react-flow__node");
    if (node) observer?.observe(node);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    schedule();

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [nodeId, active]);
};

const imageMediaScoped = (Component) => function T8ImageMediaNode(props) {
  useJiarenImageEditorAnchor(props.id, props.selected);
  const source = firstImageSource(props.data);
  const configuredModel = (window.__JIAREN_RUNTIME_SETTINGS__?.models || []).find((model) =>
    model.id === props.data?.jiarenImageModelId
    || model.modelId === props.data?.jiarenImageModelId
    || model.endpointModelId === props.data?.jiarenImageModelId
  ) || (window.__JIAREN_RUNTIME_SETTINGS__?.models || []).find((model) => model.enabled !== false && model.category === "image");
  const status = String(props.data?.status || "idle");
  const busy = ["generating", "running", "submitting", "polling", "queued"].includes(status);
  const card = React.createElement(
    "div",
    {
      className: `t8-original-scope jiaren-media-square-card jiaren-image-square-card${props.selected ? " is-selected" : ""}`,
      "data-jiaren-media-kind": "image",
      "data-node-id": props.id,
    },
    React.createElement(Handle, {
      type: "target",
      position: Position.Left,
      className: "jiaren-media-port jiaren-media-port-input",
    }),
    React.createElement(Handle, {
      type: "source",
      position: Position.Right,
      className: "jiaren-media-port jiaren-media-port-output",
    }),
    React.createElement(
      "header",
      { className: "jiaren-media-card-heading" },
      React.createElement("span", { className: "jiaren-media-card-icon jiaren-image-line-icon", "aria-hidden": "true" }),
      React.createElement(
        "div",
        null,
        React.createElement("strong", null, "图像"),
        React.createElement("small", null, configuredModel?.alias || configuredModel?.endpointModelId || "图片模型"),
      ),
      React.createElement("em", null, busy ? "生成中" : source ? "已生成" : "待编辑"),
    ),
    React.createElement(
      "div",
      { className: "jiaren-media-card-preview" },
      source
        ? React.createElement("img", { src: source, alt: "图像节点预览", draggable: false })
        : React.createElement(
            "div",
            { className: "jiaren-media-card-empty" },
            React.createElement("span", { className: "jiaren-image-line-icon large", "aria-hidden": "true" }),
            React.createElement("span", null, busy ? "正在生成图像" : "点击节点，在底部设置图像参数"),
          ),
    ),
    React.createElement(
      "footer",
      { className: "jiaren-media-card-meta" },
      React.createElement("span", null, props.data?.ratio || props.data?.aspectRatio || "Auto"),
      React.createElement("span", null, props.data?.resolution || "Auto"),
      React.createElement("span", null, props.data?.quality || "Standard"),
    ),
  );
  const editor = React.createElement(
    "section",
    {
      className: `t8-original-scope t8-original-portal jiaren-media-bottom-editor jiaren-image-bottom-editor nodrag nopan${props.selected ? " is-open" : " is-hidden"}`,
      "data-jiaren-media-editor": "image",
      "data-jiaren-node-id": props.id,
    },
    React.createElement(
      "nav",
      { className: "jiaren-media-mode-tabs", "aria-label": "图像节点模式" },
      React.createElement("button", {
        type: "button",
        className: "is-active",
        onClick: () => document.querySelector('[data-jiaren-media-editor="image"] textarea')?.focus(),
      }, "生成"),
      React.createElement("button", {
        type: "button",
        onClick: () => document.querySelector('[data-jiaren-media-editor="image"] input[type="file"]')?.click(),
      }, "上传"),
    ),
    React.createElement(Component, { ...props, editorMode: true }),
  );
  return React.createElement(
    T8NodeIdProvider,
    { id: props.id },
    React.createElement(
      React.Fragment,
      null,
      card,
      typeof document !== "undefined"
        ? createPortal(editor, document.body, `jiaren-image-editor-${props.id}`)
        : null,
    ),
  );
};

export const T8AnimeTagMasterNode = scoped(Nodes.T8AnimeTagMasterNode);
export const T8ArtistStyleMasterNode = scoped(Nodes.T8ArtistStyleMasterNode);
export const T8BpNode = scoped(Nodes.T8BpNode);
export const T8ComfyUIAppMakerNode = scoped(Nodes.T8ComfyUIAppMakerNode);
export const T8ComfyUIStoreNode = scoped(Nodes.T8ComfyUIStoreNode);
export const T8DrawingBoardNode = scoped(Nodes.T8DrawingBoardNode);
export const T8FalToolboxNode = scoped(Nodes.T8FalToolboxNode);
export const T8GenerationTargetNode = scoped(Nodes.T8GenerationTargetNode);
export const T8GrokOAuthAgentNode = scoped(Nodes.T8GrokOAuthAgentNode);
export const T8IdeaNode = scoped(Nodes.T8IdeaNode);
export const T8ImageCompareNode = scoped(Nodes.T8ImageCompareNode);
export const T8ImageNode = imageMediaScoped(T8ImageNode268);
export const T8MaterialSetNode = scoped(Nodes.T8MaterialSetNode);
export const T8Model3DPreviewNode = scoped(Nodes.T8Model3DPreviewNode);
export const T8OutputNode = scoped(T8OutputNode268);
export const T8RHToolboxNode = scoped(Nodes.T8RHToolboxNode);
export const T8RHToolsNode = scoped(Nodes.T8RHToolsNode);
export const T8RelayNode = scoped(Nodes.T8RelayNode);
export const T8RemoveAiWatermarkNode = scoped(Nodes.T8RemoveAiWatermarkNode);
export const T8RunningHubNode = scoped(Nodes.T8RunningHubNode);
export const T8TextNode = scoped(Nodes.T8TextNode);
export const T8UploadNode = scoped(T8UploadNode268);
export const T8VibeXNode = scoped(Nodes.T8VibeXNode);
