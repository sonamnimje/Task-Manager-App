const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function tryParseJson(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function parseResponse(response) {
  // Backend returns { success, message, data } for both success and errors.
  const payload = await tryParseJson(response);

  if (!response.ok || (payload && payload.success === false)) {
    const fallbackMessage = `Request failed with status ${response.status}`;
    throw new Error(payload?.message || fallbackMessage);
  }

  return payload || { success: true, data: null };
}

async function request(url, options = {}) {
  // Single request wrapper keeps fetch/network error behavior consistent.
  try {
    const response = await fetch(url, options);
    return await parseResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Network error: unable to reach server");
    }

    throw error;
  }
}

export async function fetchTasks() {
  const payload = await request(`${API_BASE_URL}/tasks`);
  return payload.data;
}

export async function createTask(title) {
  const payload = await request(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  return payload.data;
}

export async function toggleTask(id) {
  const payload = await request(`${API_BASE_URL}/tasks/${id}`, {
    method: "PATCH",
  });

  return payload.data;
}

export async function deleteTask(id) {
  const payload = await request(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  return payload.data;
}
