import React from "react";


const TaskCard = ({ task, onDelete }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  return (
    <div className="task-card" draggable onDragStart={handleDragStart}>
      <p>{task.title}</p>
      <button className="delete-btn" onClick={() => onDelete(task.id)}>❌</button>
    </div>
  );
};

export default TaskCard;
