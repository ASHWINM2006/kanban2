import React from "react";
import "./TaskHistory.css";

const TaskHistory = ({ history, onClearHistory }) => {
  return (
    <div className="task-history">
      <h3>Task History</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
      <button className="clear-history" onClick={onClearHistory}>
        Clear History
      </button>
    </div>
  );
};

export default TaskHistory;
