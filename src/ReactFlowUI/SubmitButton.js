import { useSubmitPipeline } from "../hooks/usePipeline";

export function SubmitButton() {
  const { submit } = useSubmitPipeline();

  if (typeof submit !== "function") {
    console.error("submit is not a function. Check useSubmitPipeline import.");
    return null;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
      <button onClick={submit}>Submit</button>
    </div>
  );
}
