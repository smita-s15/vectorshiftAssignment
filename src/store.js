import { createWithEqualityFn } from "zustand/traditional";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";
import { shallow } from "zustand/shallow";

export const useStore = createWithEqualityFn(
  (set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},

    getNodeID: (type) => {
      const newIDs = { ...get().nodeIDs };
      if (newIDs[type] === undefined) {
        newIDs[type] = 0;
      }
      newIDs[type] += 1;
      set({ nodeIDs: newIDs });
      return `${type}-${newIDs[type]}`;
    },

    addNode: (node) => {
      set({
        nodes: [...get().nodes, node],
      });
    },

    getInitialEdges: (sourceHandle, targetNodeID) => {
      const sourceNodeID = sourceHandle.split("-")[0]; // Adjust based on handle format
      const edgeID = `e${sourceNodeID}-${targetNodeID}`;
      return {
        id: edgeID,
        source: sourceNodeID,
        target: targetNodeID,
        sourceHandle,
        type: "smoothstep",
      };
    },

    onNodesChange: (changes) => {
      const newNodes = applyNodeChanges(changes, get().nodes);

      const deletedNodeTypes = changes
        .filter((change) => change.type === "remove")
        .map(
          (change) => get().nodes.find((node) => node.id === change.id)?.type
        )
        .filter(Boolean);

      if (deletedNodeTypes.length > 0) {
        const newNodeIDs = { ...get().nodeIDs };
        deletedNodeTypes.forEach((type) => {
          const remainingNodesOfType = newNodes.filter(
            (node) => node.type === type
          ).length;
          newNodeIDs[type] = remainingNodesOfType;
        });
        set({ nodes: newNodes, nodeIDs: newNodeIDs });
      } else {
        set({ nodes: newNodes });
      }
    },

    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },

    onConnect: (connection) => {
      console.log(connection, "connection");
      set({
        edges: addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: true,
            markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
          },
          get().edges
        ),
      });
    },

    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, [fieldName]: fieldValue } };
          }
          return node;
        }),
      });
    },
  }),
  shallow // use shallow equality check
);

export default useStore;
