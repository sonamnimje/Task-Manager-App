const tasks = [];

function getTasks() {
  return tasks;
}

function createTask(title) {
  // Keep a stable shape for each task in memory.
  const task = {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(task);
  return task;
}

function toggleTask(id) {
  // Find and flip completion without mutating collection structure.
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return null;
  }

  task.completed = !task.completed;
  return task;
}

function deleteTask(id) {
  // Remove by index to return the deleted item in one operation.
  const taskIndex = tasks.findIndex((item) => item.id === id);
  if (taskIndex === -1) {
    return null;
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  return deletedTask;
}

module.exports = {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
};
