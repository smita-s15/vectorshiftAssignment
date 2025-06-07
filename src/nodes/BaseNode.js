import { Handle, Position } from "reactflow";
import { useId } from "react";

const BaseNode = ({
  id,
  title,
  inputs = [],
  outputs = [],
  children,
  style = {},
}) => {
  const generatedId = useId();

  const nodeId = id || generatedId;

  return (
    <div
      style={{
        position: "relative",
        width: 200,
        minHeight: 80,
        border: "1px solid black",
        padding: 8,
        ...style,
      }}
    >
      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={`${nodeId}-${input.id}`}
          style={{ top: `${((index + 1) / (inputs.length + 1)) * 100}%` }}
        />
      ))}

      <div>
        <strong>{title}</strong>
      </div>
      <div>{children}</div>

      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={`${nodeId}-${output.id}`}
          style={{ top: `${((index + 1) / (outputs.length + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
};

export default BaseNode;
