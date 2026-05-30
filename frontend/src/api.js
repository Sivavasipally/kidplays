// Centralized API layer for KidPlays Studio.
// Talks to the local Flask backend. All calls degrade gracefully so the
// editor still works even if the backend is not running (kids can still play).

const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => request("/health"),
  listProjects: () => request("/projects"),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (payload) =>
    request("/projects", { method: "POST", body: JSON.stringify(payload) }),
  updateProject: (id, payload) =>
    request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),
};
