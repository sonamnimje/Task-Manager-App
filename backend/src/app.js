const express = require("express");
const cors = require("cors");
const tasksRoutes = require("./routes/tasksRoutes");
const { sendSuccess } = require("./utils/apiResponse");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return sendSuccess(res, 200, "Task Manager API is running");
});

app.use("/tasks", tasksRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
