import React, { createContext, useContext, useMemo } from "./t8-react-shim.js";
import { H as Handle, P as Position, u as useReactFlow, i as ReactFlow, R as ReactFlowProvider, B as Background, C as Controls, M as MiniMap, V as Panel, b as addEdge, c as applyEdgeChanges, d as applyNodeChanges, a as BackgroundVariant } from "./vendor-flow-BUHgv_lX.js";
import { A as useNativeNodes, z as useNativeEdges, E as useNativeUpdateNodeInternals, N as NativeNodeResizeControl } from "./t8-original-scope-BBmKmbTu.js";

export { Handle, Position, useReactFlow, ReactFlow, ReactFlowProvider, Background, Controls, MiniMap, Panel, addEdge, applyEdgeChanges, applyNodeChanges, BackgroundVariant };

const T8NodeIdContext = createContext(null);

export function T8NodeIdProvider({ id, children }) {
  return React.createElement(T8NodeIdContext.Provider, { value: id || null }, children);
}

export function useNodes() {
  return useNativeNodes();
}

export function useEdges() {
  return useNativeEdges();
}

export function useNodesData(ids) {
  const nodes = useNativeNodes();
  const isArray = Array.isArray(ids);
  const key = isArray ? ids.join("|") : String(ids || "");
  return useMemo(() => {
    const wanted = isArray ? ids : [ids];
    const result = wanted
      .map((id) => nodes.find((node) => node.id === id))
      .filter(Boolean)
      .map((node) => ({ id: node.id, type: node.type, data: node.data }));
    return isArray ? result : result[0] ?? null;
  }, [nodes, key, isArray]);
}

export function useNodeConnections(options = {}) {
  const edges = useNativeEdges();
  const contextNodeId = useContext(T8NodeIdContext);
  const id = options.id || options.nodeId || contextNodeId;
  const handleType = options.handleType;
  const handleId = options.handleId;
  return useMemo(() => edges.filter((edge) => {
    if (handleType === "source") return edge.source === id;
    if (handleType === "target") return edge.target === id;
    return edge.source === id || edge.target === id;
  }).filter((edge) => {
    if (handleId == null) return true;
    return handleType === "source" ? edge.sourceHandle === handleId : edge.targetHandle === handleId;
  }).map((edge) => ({ ...edge, nodeId: edge.source === id ? edge.target : edge.source })), [edges, id, handleType, handleId]);
}

export function useUpdateNodeInternals() {
  return useNativeUpdateNodeInternals();
}

export const NodeResizeControl = NativeNodeResizeControl;
