// store.js
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
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          id: `e-${connection.source}-${connection.target}`,
          type: "default",
        },
        state.edges
      ),
    })),

  getInitialEdges: (sourceHandle, target) => ({
    id: `e-${sourceHandle}-${target}`,
    source: sourceHandle.split("-")[0],
    sourceHandle,
    target,
    targetHandle: `${target}-input`,
  }),
}));
