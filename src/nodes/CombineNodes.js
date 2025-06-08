import { useState } from "react";
import { Handle, Position } from "reactflow";
import "./nodes.css";
import { TextNode } from "./textNode";

/* ------------------------ Input Node ------------------------ */
const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data.inputType || "Text");

  return (
    <div className="custom-node">
      <div>
        <span>Input</span>
      </div>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
          />
        </label>
        <label>
          Type:
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
      <Handle type="source" position={Position.Right} id={`${id}-value`} />
    </div>
  );
};

/* ------------------------ Output Node ------------------------ */
const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_")
  );
  const [outputType, setOutputType] = useState(data.outputType || "Text");

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Left} id={`${id}-value`} />
      <div>
        <span>Output</span>
      </div>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
          />
        </label>
        <label>
          Type:
          <select
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </label>
      </div>
    </div>
  );
};

/* ------------------------ LLM Node ------------------------ */
const LLMNode = ({ id }) => (
  <div className="custom-node">
    <Handle
      type="target"
      position={Position.Left}
      id={`${id}-system`}
      style={{ top: `${100 / 3}%` }}
    />
    <Handle
      type="target"
      position={Position.Left}
      id={`${id}-prompt`}
      style={{ top: `${200 / 3}%` }}
    />
    <div>
      <span>LLM</span>
    </div>
    <div>
      <span>This is a LLM.</span>
    </div>
    <Handle type="source" position={Position.Right} id={`${id}-response`} />
  </div>
);

/* ------------------------ Delay Node ------------------------ */
const DelayNode = ({ id }) => (
  <div className="custom-node">
    <Handle type="target" position={Position.Left} id={`${id}-input`} />
    <div>
      <span>Delay</span>
    </div>
    <div>
      <span>Wait before sending</span>
    </div>
    <Handle type="source" position={Position.Right} id={`${id}-output`} />
  </div>
);

/* ------------------------ Join Node ------------------------ */
const JoinNode = ({ id }) => (
  <div className="custom-node">
    <Handle
      type="target"
      position={Position.Left}
      id={`${id}-a`}
      style={{ top: "33%" }}
    />
    <Handle
      type="target"
      position={Position.Left}
      id={`${id}-b`}
      style={{ top: "66%" }}
    />
    <div>
      <span>Join</span>
    </div>
    <div>
      <span>Merges data</span>
    </div>
    <Handle type="source" position={Position.Right} id={`${id}-result`} />
  </div>
);

/* ------------------------ Filter Node ------------------------ */
const FilterNode = ({ id }) => (
  <div className="custom-node">
    <Handle type="target" position={Position.Left} id={`${id}-input`} />
    <div>
      <span>Filter</span>
    </div>
    <div>
      <span>Filters input text</span>
    </div>
    <Handle type="source" position={Position.Right} id={`${id}-output`} />
  </div>
);

/* ------------------------ UpperCase Node ------------------------ */
const UpperCaseNode = ({ id }) => (
  <div className="custom-node">
    <Handle type="target" position={Position.Left} id={`${id}-input`} />
    <div>
      <span>UpperCase</span>
    </div>
    <div>
      <span>Converts text to UPPERCASE</span>
    </div>
    <Handle type="source" position={Position.Right} id={`${id}-output`} />
  </div>
);

/* ------------------------ Random Text Node ------------------------ */
const RandomTextNode = ({ id }) => (
  <div className="custom-node">
    <div>
      <span>Random Text</span>
    </div>
    <div>
      <span>Generates random sentence</span>
    </div>
    <Handle type="source" position={Position.Right} id={`${id}-output`} />
  </div>
);

/* ------------------------ Node Types Map ------------------------ */
export const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  delay: DelayNode,
  join: JoinNode,
  filter: FilterNode,
  uppercase: UpperCaseNode,
  randomText: RandomTextNode,
};
