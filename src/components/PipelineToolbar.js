// optimzied with model lsit dynamic

import { DraggableNode } from "../ReactFlowUI/DraggableNode";

// Flow of how nodes get rendered:
// When you drag a node button (DraggableNode with a type),
// the app adds a new node with that type string (type: "customInput" for example) to your React Flow state.

// React Flow internally looks up the actual React component f
// or that node type in nodeTypes (this object is imported and
// used where you render your React Flow canvas — like in ui.js or similar).

// React Flow renders the matching React component (InputNode here)
// inside the canvas based on the type string.

const nodeList = [
  { type: "customInput", label: "Input" },
  { type: "llm", label: "LLM" },
  { type: "customOutput", label: "Output" },
  { type: "text", label: "Text" },
  { type: "delay", label: "Delay" },
  { type: "join", label: "Join" },
  { type: "filter", label: "Filter" },
  { type: "uppercase", label: "Upper Case" },
  { type: "randomText", label: "Random Text" },
];

export const PipelineToolbar = () => {
  return (
    <div className="pipeline-toolbar">
      <p>Drag and drop nodes to the canvas</p>
      {nodeList.map(({ type, label }) => (
        <DraggableNode key={type} type={type} label={label} />
      ))}
    </div>
  );
};
