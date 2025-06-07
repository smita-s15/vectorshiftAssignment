import { useStore } from "../store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const useSubmitPipeline = () => {
  const { nodes: storeNodes, edges: storeEdges } = useStore(selector, shallow);
  console.log(storeNodes, "storeNodes");
  console.log(storeEdges, "storeEdges");

  const submit = async () => {
    if (storeNodes.length === 0) {
      return;
    }
    const nodes = storeNodes.map(({ id }) => ({ id }));
    const edges = storeEdges.map(({ id, source, target }) => ({
      id,
      source,
      target,
    }));

    try {
      const res = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      const data = await res.json();
    } catch (err) {
      alert("❌ Error submitting pipeline");
      console.error(err);
    }
  };

  return { submit };
};
