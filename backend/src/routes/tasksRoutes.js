const express = require("express");
const {
  getAllTasks,
  addTask,
  toggleTaskStatus,
  removeTask,
} = require("../controllers/tasksController");

const router = express.Router();

router.get("/", getAllTasks);
router.post("/", addTask);
router.patch("/:id", toggleTaskStatus);
router.delete("/:id", removeTask);

module.exports = router;
