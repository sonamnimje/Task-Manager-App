import { useEffect, useMemo, useState } from "react";
import "./App.css";
import FilterBar from "./components/FilterBar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTask,
} from "./services/taskService";

const STORAGE_KEY = "task-manager-cache";

function getInitialTasksFromStorage() {
  try {
    // Bootstrap UI from localStorage so users can see last state immediately.
    const cachedTasks = localStorage.getItem(STORAGE_KEY);
    if (!cachedTasks) {
      return [];
    }

    return JSON.parse(cachedTasks);
  } catch {
    return [];
  }
}

function App() {
  const [tasks, setTasks] = useState(getInitialTasksFromStorage);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    // API data is source-of-truth; local cache helps with first paint only.
    async function loadTasks() {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message || "Failed to fetch tasks");
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    // Keep a local cache in sync after every CRUD operation.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    // Derive visible list from current filter without duplicating state.
    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }

    if (filter === "pending") {
      return tasks.filter((task) => !task.completed);
    }

    return tasks;
  }, [tasks, filter]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  async function handleAddTask(title) {
    setIsSubmitting(true);
    setError("");

    try {
      const newTask = await createTask(title);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleTask(id) {
    setIsMutating(true);
    setError("");

    try {
      const updatedTask = await toggleTask(id);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDeleteTask(id) {
    setIsMutating(true);
    setError("");

    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete task");
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <main className="app">
      <div className="container">
        <header className="app-header">
          <div>
            <h1>Task Manager</h1>
            <p className="subtitle">Minimal, fast, and focused daily task tracking.</p>
          </div>
          <div className="stats" aria-label="Task summary">
            <span>{tasks.length} total</span>
            <span>{completedCount} completed</span>
          </div>
        </header>

        <TaskForm onAddTask={handleAddTask} isSubmitting={isSubmitting} />

        <FilterBar activeFilter={filter} onChangeFilter={setFilter} />

        {isLoading && <p className="state-message">Loading tasks...</p>}

        {!isLoading && error && <p className="error-message">{error}</p>}

        {!isLoading && !error && filteredTasks.length === 0 && (
          <p className="state-message">No tasks available</p>
        )}

        {!isLoading && !error && filteredTasks.length > 0 && (
          <TaskList
            tasks={filteredTasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            isMutating={isMutating}
          />
        )}
      </div>
    </main>
  );
}

export default App;
