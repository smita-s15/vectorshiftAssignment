import { useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import "./nodes.css";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [variables, setVariables] = useState([]);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  // 🔄 Extract variables like {{input}}, {{file}}, etc.
  const extractVariables = (text) => {
    const regex = /{{\s*([\w\d_]+)\s*}}/g;
    const found = new Set();
    let match;
    while ((match = regex.exec(text)) !== null) {
      found.add(match[1]);
    }
    return Array.from(found);
  };

  useEffect(() => {
    const vars = extractVariables(currText);
    setVariables(vars);
  }, [currText]);

  useEffect(() => {
    if (textRef.current && containerRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;

      textRef.current.style.width = "100%";

      containerRef.current.style.height = `${
        textRef.current.scrollHeight + 40
      }px`;
    }
  }, [currText]);

  return (
    <div className="text-node" ref={containerRef}>
      {/* Left-side handles for all variables */}
      {variables.map((variable, index) => (
        <Handle
          key={variable}
          type="target"
          position={Position.Left}
          id={`${id}-${variable}`}
          style={{
            top: `${(index + 1) * 20}px`,
            background: "#555",
          }}
        />
      ))}

      <div className="custom-node-title">Text</div>
      <textarea
        ref={textRef}
        value={currText}
        onChange={(e) => setCurrText(e.target.value)}
        className="text-node-textarea"
        rows={1}
      />

      {/* Right output handle */}
      <Handle type="source" position={Position.Right} id={`${id}-output`} />
    </div>
  );
};
