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

  const { nodes: storeNodes, edges: storeEdges } = useStoreWithEqualityFn(
    useStore,
    selector,
    shallow
  );
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

  const getInitNodeData = (id, type) => ({ id, nodeType: type });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      let appData;
      try {
        const data = event.dataTransfer.getData("application/reactflow");
        appData = JSON.parse(data);
      } catch (e) {
        console.error("Invalid drag data:", e);
        return;
      }

      const { nodeType } = appData;

      if (!nodeType || !nodeTypes[nodeType]) {
        console.error("Invalid node type:", nodeType);
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

      const nodeID = getNodeID(nodeType);

      const newNode = {
        id: nodeID,
        type: nodeType,
        position,
        data: getInitNodeData(nodeID, nodeType),
      };

      addNode(newNode);

      // Get the last node before adding new one
      const lastNode =
        storeNodes.length > 0 ? storeNodes[storeNodes.length - 1] : null;

      if (lastNode) {
        const edge = {
          id: `${lastNode.id}-${nodeID}`,
          source: lastNode.id,
          target: nodeID,
          type: "smoothstep",
        };
        addEdge(edge);
      } else {
        // If no previous node, set this as the first node
        setExistingSourceId(nodeID);
      }
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.3, duration: 500 });
      }, 100);
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
    <div ref={reactFlowWrapper} className="reactflow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid
        snapGrid={[gridSize, gridSize]}
        onInit={(instance) => {
          setReactFlowInstance(instance);
          setTimeout(() => {
            instance.fitView({ padding: 0.3 });
          }, 100);
        }}
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
  );
};
