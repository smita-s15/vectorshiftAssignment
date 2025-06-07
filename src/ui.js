import { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./nodes/CombineNodes";
import { useSubmitPipeline } from "./usePipeline";

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

  const { submit } = useSubmitPipeline();

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
        return;
      }

      if (!appData?.nodeType || !nodeTypes[appData.nodeType]) return;

      if (!reactFlowInstance) return;

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

      if (appData.sourceHandle) {
        const edge = useStore
          .getState()
          .getInitialEdges(appData.sourceHandle, nodeID);
        addEdge(edge);
      }
    },
    [reactFlowInstance, getNodeID, addNode, addEdge]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // useEffect(() => {
  //   console.log(nodeTypes, "nodeTypes");
  //   console.log(nodes, "nodes");
  //   console.log(edges, "edges");
  // }, [nodes, edges, nodeTypes]);
  // console.log(reactFlowWrapper.current, "reactFlowWrapper");

  useEffect(() => {
    if (reactFlowWrapper.current) {
      reactFlowWrapper.current.style.width = "100%";
      reactFlowWrapper.current.style.height = "70vh";
    }
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: "100%", height: "70vh" }}>
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
      <button onClick={submit} style={{ marginTop: 10 }}>
        🚀 Submit
      </button>
    </div>
  );
};
