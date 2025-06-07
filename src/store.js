import { create } from "zustand";
import { nanoid } from "nanoid";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "reactflow";

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],

  getNodeID: (type) => `${type}-${nanoid(6)}`,

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  addEdge: (edge) => set((state) => ({ edges: addEdge(edge, state.edges) })),

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => {
      const targetNode = state.nodes.find((n) => n.id === connection.target);
      const targetHandle =
        targetNode?.data?.nodeType === "randomText" ? "input" : "default";
      return {
        edges: addEdge(
          {
            ...connection,
            id: `e-${connection.source}-${connection.target}`,
            type: "smoothstep",
            sourceHandle: connection.sourceHandle || "default",
            targetHandle: connection.targetHandle || targetHandle,
          },
          state.edges
        ),
      };
    }),

  getInitialEdges: (sourceHandle, target) => ({
    id: `e-${sourceHandle}-${target}`,
    source: sourceHandle.split("-")[0],
    sourceHandle: sourceHandle,
    target,
    targetHandle: "input", // Default to "input" for randomText nodes
    type: "smoothstep",
  }),
}));
