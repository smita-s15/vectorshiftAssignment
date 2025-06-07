import { useStore } from "./store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const useSubmitPipeline = () => {
  const { nodes: storeNodes, edges: storeEdges } = useStore(selector, shallow);
  console.log(storeNodes, storeEdges);

  const submit = async () => {
    if (storeNodes.length === 0) {
      return;
    }
    const nodes = storeNodes.map(({ id }) => ({ id }));
    const edges = storeNodes.map(({ id, source, target }) => ({
      id,
      source,
      target,
    }));

    console.log("Store nodes:", nodes);
    console.log("Store edges:", edges);

    try {
      const res = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      const data = await res.json();
      console.log(data, "data");
    } catch (err) {
      alert("❌ Error submitting pipeline");
      console.error(err);
    }
  };

  return { submit };
};
