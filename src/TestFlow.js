import React, { useEffect, useState } from "react";
import ReactFlow, { addEdge } from "reactflow";
import "reactflow/dist/style.css";

export default function TestFlow() {
  const [nodes] = useState([
    {
      id: "1",
      type: "input",
      data: { label: "Input Node" },
      position: { x: 50, y: 50 },
    },
    {
      id: "2",
      type: "default",
      data: { label: "Output Node" },
      position: { x: 250, y: 50 },
    },
  ]);
  const [edges, setEdges] = useState([]);

  const onConnect = (connection) => {
    console.log("Connection:", connection);
    setEdges((eds) => addEdge(connection, eds));
  };
  useEffect(() => {
    onConnect({ source: "customInput-1", target: "customOutput-1" });
  }, []);

  return (
    <div style={{ height: 200 }}>
      <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} />
    </div>
  );
}
