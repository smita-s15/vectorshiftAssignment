export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    if (!nodeType) {
      console.error("❌ Drag start: nodeType is undefined");
      return;
    }

    console.log("✅ Drag start: nodeType =", nodeType);

    const appData = { nodeType };
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
    event.target.style.cursor = "grabbing";
  };

  return (
    <div
      className={`${type} draggable-node`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      draggable
    >
      <span>{label}</span>
    </div>
  );
};
