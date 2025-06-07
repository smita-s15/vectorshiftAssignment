import { useEffect, useState } from "react";
import { useSubmitPipeline } from "../hooks/usePipeline";
import { useStore } from "../store";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

export function SubmitButton() {
  const { submit } = useSubmitPipeline();
  const pipelineResponse = useStoreWithEqualityFn(
    useStore,
    (state) => state.pipelineResponse,
    shallow
  );
  useEffect(() => {
    if (pipelineResponse) {
      console.log("✅ Got pipeline response from Zustand:", pipelineResponse);
    }
  }, [pipelineResponse]);

  return (
    <div className="submit-button-container">
      <p>Submit your pipeline</p>
      <button onClick={submit} className="button">
        Submit
      </button>
      {pipelineResponse && (
        <div className="pipeline-response">
          <p>
            <strong>Number of Nodes:</strong> {pipelineResponse.num_nodes}
          </p>
          <p>
            <strong>Number of Edges:</strong> {pipelineResponse.num_edges}
          </p>
          <p>
            <strong>Is DAG:</strong> {pipelineResponse.is_dag ? "Yes" : "No"}
          </p>
        </div>
      )}
    </div>
  );
}
