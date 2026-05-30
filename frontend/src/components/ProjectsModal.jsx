import React, { useEffect, useState } from "react";
import { useStore } from "../store.js";
import { api } from "../api.js";

export default function ProjectsModal({ onClose }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadProject = useStore((s) => s.loadProject);
  const showToast = useStore((s) => s.showToast);

  const refresh = () => {
    setLoading(true);
    api
      .listProjects()
      .then((list) => {
        setProjects(list);
        setError(null);
      })
      .catch(() => setError("Couldn't reach the server. Is the backend running?"))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const open = async (id) => {
    try {
      const project = await api.getProject(id);
      loadProject(project);
      showToast("Project loaded! 🎉", "success");
      onClose();
    } catch {
      showToast("Could not open project 😢", "error");
    }
  };

  const remove = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this project forever?")) return;
    try {
      await api.deleteProject(id);
      refresh();
    } catch {
      showToast("Could not delete 😢", "error");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📂 My Projects</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {loading && <p className="modal-msg">Loading…</p>}
        {error && <p className="modal-msg error">{error}</p>}
        {!loading && !error && projects.length === 0 && (
          <p className="modal-msg">No saved projects yet. Make something awesome and hit Save! 🚀</p>
        )}

        <div className="project-list">
          {projects.map((p) => (
            <div key={p.id} className="project-item" onClick={() => open(p.id)}>
              <span className="project-icon">🎮</span>
              <div className="project-meta">
                <span className="project-title">{p.name}</span>
                <span className="project-date">
                  {new Date(p.updated_at).toLocaleString()}
                </span>
              </div>
              <button className="project-del" onClick={(e) => remove(p.id, e)}>🗑</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
