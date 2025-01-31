import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import TaskHistory from "./TaskHistory";
import "./KanbanBoard.css";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    backlog: [],
    todo: [],
    inProgress: [],
    done: [],
  });

  const [history, setHistory] = useState([]); // Track history of actions
  const [newTask, setNewTask] = useState("");

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {
      backlog: [],
      todo: [],
      inProgress: [],
      done: [],
    };
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task to the "backlog" column
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const task = { id: Date.now(), title: newTask };
    setTasks((prev) => ({
      ...prev,
      backlog: [...prev.backlog, task],
    }));
    setNewTask("");

    // Add task creation to history
    setHistory((prevHistory) => [
      ...prevHistory,
      `Task "${task.title}" added to Backlog`,
    ]);
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    const updatedTasks = { ...tasks };
    let deletedTaskTitle = "";

    for (const column in updatedTasks) {
      const index = updatedTasks[column].findIndex((task) => task.id === taskId);
      if (index !== -1) {
        deletedTaskTitle = updatedTasks[column][index].title;
        updatedTasks[column].splice(index, 1);
        break;
      }
    }

    setTasks(updatedTasks);

    // Add task deletion to history
    setHistory((prevHistory) => [
      ...prevHistory,
      `Task "${deletedTaskTitle}" deleted`,
    ]);
  };

  // Handle drag-and-drop to move tasks between columns
  const handleDrop = (e, newStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    let movedTask = null;

    // Remove task from the previous column
    const updatedTasks = { ...tasks };
    for (const column in updatedTasks) {
      const index = updatedTasks[column].findIndex((task) => task.id.toString() === taskId);
      if (index !== -1) {
        movedTask = updatedTasks[column][index];
        updatedTasks[column].splice(index, 1);
        break;
      }
    }

    // Add task to the new column
    if (movedTask) {
      updatedTasks[newStatus].push(movedTask);
      setTasks(updatedTasks);

      // Add task movement to history
      setHistory((prevHistory) => [
        ...prevHistory,
        `Task "${movedTask.title}" moved to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      ]);
    }
  };

  return (
    <div className="kanban-board">
      <div className="add-task">
        <textarea
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          rows="2"
        />
        <button className="btn-add-task" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      <div className="kanban-columns">
        {["backlog", "todo", "inProgress", "done"].map((column) => (
          <div
            key={column}
            className="kanban-column"
            onDrop={(e) => handleDrop(e, column)}
            onDragOver={(e) => e.preventDefault()}
          >
            <h2 className="column-title">{column.charAt(0).toUpperCase() + column.slice(1)}</h2>
            <div className="task-list">
              {tasks[column].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskHistory history={history} onClearHistory={() => setHistory([])} />
    </div>
  );
};

export default KanbanBoard;
