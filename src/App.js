import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";
import { ReactFlowProvider } from "reactflow";

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
