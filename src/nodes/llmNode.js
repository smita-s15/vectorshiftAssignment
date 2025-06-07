import BaseNode from "./BaseNode";

export const LLMNode = ({ id }) => {
  return (
    <BaseNode
      id={id}
      title="LLM"
      inputs={[{ id: `${id}-system` }, { id: `${id}-prompt` }]}
      outputs={[{ id: `${id}-response` }]}
    >
      <span>This is a LLM.</span>
    </BaseNode>
  );
};
