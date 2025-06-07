import { PipelineToolbar } from "./components/PipelineToolbar";
import { PipelineUI } from "./ReactFlowUI/PipelineUI";
import { ReactFlowProvider } from "reactflow";
import { SubmitButton } from "./ReactFlowUI/SubmitButton";

function App() {
  return (
    <ReactFlowProvider>
      <div className="App">
        <PipelineToolbar />
        <div className="pipeline-container">
          <PipelineUI />
          <SubmitButton />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
