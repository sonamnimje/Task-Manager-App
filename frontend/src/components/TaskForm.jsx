import { useState } from "react";

function TaskForm({ onAddTask, isSubmitting }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    await onAddTask(trimmedTitle);
    setTitle("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What do you need to do?"
        aria-label="Task title"
        maxLength={120}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
