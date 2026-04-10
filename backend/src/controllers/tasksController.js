const {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
} = require("../data/tasksStore");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = getTasks();

  return sendSuccess(res, 200, "Tasks fetched successfully", tasks);
});

const addTask = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    throw new AppError("Validation error: title is required", 400);
  }

  const task = createTask(title);

  return sendSuccess(res, 201, "Task created successfully", task);
});

const toggleTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError("Validation error: task id is required", 400);
  }

  const task = toggleTask(id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return sendSuccess(res, 200, "Task completion status updated", task);
});

const removeTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError("Validation error: task id is required", 400);
  }

  const task = deleteTask(id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return sendSuccess(res, 200, "Task deleted successfully", task);
});

module.exports = {
  getAllTasks,
  addTask,
  toggleTaskStatus,
  removeTask,
};
