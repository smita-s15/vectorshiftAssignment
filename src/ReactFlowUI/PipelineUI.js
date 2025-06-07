import { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";
import "reactflow/dist/style.css";
import { nodeTypes } from "../nodes/CombineNodes";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  addEdge: state.addEdge,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [existingSourceId, setExistingSourceId] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    addEdge,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStoreWithEqualityFn(useStore, selector, shallow);

  useEffect(() => {
    if (nodes.length > 0) {
      setExistingSourceId(nodes[0].id);
    } else {
      setExistingSourceId(null);
    }
  }, [nodes]);

  const getInitNodeData = (id, type) => ({ id, nodeType: type });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      let appData;

      try {
        appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
      } catch (e) {
        console.error("Invalid drag data:", e);
        return;
      }

      if (!appData?.nodeType || !nodeTypes[appData.nodeType]) {
        console.error("Invalid node type:", appData.nodeType);
        return;
      }

      if (!reactFlowInstance) {
        console.error("React Flow instance not initialized");
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeID = getNodeID(appData.nodeType);
      const newNode = {
        id: nodeID,
        type: appData.nodeType,
        position,
        data: getInitNodeData(nodeID, appData.nodeType),
      };

      addNode(newNode);

      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        const edge = {
          id: `${lastNode.id}-${nodeID}`,
          source: lastNode.id,
          target: nodeID,
          sourceHandle: "default",
          targetHandle: "default",
          type: "smoothstep", // or "buttonedge", "bidirectional", etc.
        };
        addEdge(edge);
      }
    },
    [reactFlowInstance, getNodeID, addNode, addEdge, nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  useEffect(() => {
    if (reactFlowWrapper.current) {
      reactFlowWrapper.current.style.width = "100%";
      reactFlowWrapper.current.style.height = "70vh";
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div ref={reactFlowWrapper} style={{ flexGrow: 1, height: "70vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          snapToGrid
          snapGrid={[gridSize, gridSize]}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          connectionLineType="smoothstep"
          proOptions={proOptions}
          fitView
        >
          <Background color="#aaa" gap={gridSize} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
