import { PipelineToolbar } from "./components/PipelineToolbar";
import { PipelineUI } from "./ReactFlowUI/PipelineUI";
import { ReactFlowProvider } from "reactflow";
import { SubmitButton } from "./ReactFlowUI/SubmitButton";

function App() {
  return (
    <ReactFlowProvider>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </ReactFlowProvider>
  );
}

export default App;
