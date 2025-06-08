import { useStoreWithEqualityFn } from "zustand/traditional";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  setPipelineResponse: state.setPipelineResponse,
});

export const useSubmitPipeline = () => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setPipelineResponse,
  } = useStoreWithEqualityFn(useStore, selector, shallow);

  const submit = async () => {
    if (storeNodes.length === 0) return;

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
      const { num_nodes, num_edges, is_dag } = data;
      setPipelineResponse(data);
      alert("Pipeline submitted successfully! \n" +
            `Number of Nodes: ${num_nodes}\n` +
            `Number of Edges: ${num_edges}\n` +
            `Is DAG: ${is_dag ? "Yes" : "No"}`);
      return data;
    } catch (err) {
      console.error(err);
      setPipelineResponse(null);
      return null;
    }
  };

  return { submit };
};
