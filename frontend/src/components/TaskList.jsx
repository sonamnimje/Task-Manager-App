function formatCreatedAt(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString();
}

function TaskList({ tasks, onToggleTask, onDeleteTask, isMutating }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <div className="task-main">
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                disabled={isMutating}
              />
              <span className={task.completed ? "completed" : ""}>{task.title}</span>
            </label>
            <p className="task-meta">Created {formatCreatedAt(task.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={() => onDeleteTask(task.id)}
            disabled={isMutating}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
