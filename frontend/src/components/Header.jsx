import React, { useState } from "react";
import { useStore } from "../store.js";
import { api } from "../api.js";
import { EXAMPLES } from "../examples.js";

export default function Header({ onOpenProjects }) {
  const projectName = useStore((s) => s.projectName);
  const setProjectName = useStore((s) => s.setProjectName);
  const projectId = useStore((s) => s.projectId);
  const setProjectId = useStore((s) => s.setProjectId);
  const serializeProject = useStore((s) => s.serializeProject);
  const loadProject = useStore((s) => s.loadProject);
  const newProject = useStore((s) => s.newProject);
  const showToast = useStore((s) => s.showToast);
  const [saving, setSaving] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { name: projectName, data: serializeProject() };
      let result;
      if (projectId) result = await api.updateProject(projectId, payload);
      else result = await api.createProject(payload);
      setProjectId(result.id);
      showToast("Saved! 🎉", "success");
    } catch (e) {
      // Offline fallback: save to localStorage so kids never lose work.
      try {
        localStorage.setItem(
          "kidplays:lastProject",
          JSON.stringify({ name: projectName, data: serializeProject() })
        );
        showToast("Saved on this computer 💾", "success");
      } catch {
        showToast("Could not save 😢", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleNew = () => {
    if (confirm("Start a brand new project? Unsaved work will be lost.")) {
      newProject();
      showToast("New project! ✨", "info");
    }
  };

  const handleExample = (ex) => {
    loadProject({ name: ex.name, data: ex.data });
    setShowExamples(false);
    showToast(`Loaded "${ex.name}" 🚀`, "info");
  };

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-logo">🐱</span>
        <div className="brand-text">
          <span className="brand-name">KidPlays Studio</span>
          <span className="brand-sub">Block Coding Playground</span>
        </div>
      </div>

      <input
        className="project-name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        spellCheck={false}
      />

      <div className="header-actions">
        <div className="dropdown">
          <button className="hbtn" onClick={() => setShowExamples((v) => !v)}>
            🎁 Examples ▾
          </button>
          {showExamples && (
            <div className="dropdown-menu" onMouseLeave={() => setShowExamples(false)}>
              {EXAMPLES.map((ex) => (
                <button key={ex.name} onClick={() => handleExample(ex)}>
                  {ex.icon} {ex.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="hbtn" onClick={onOpenProjects}>📂 Open</button>
        <button className="hbtn primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "💾 Save"}
        </button>
        <button className="hbtn" onClick={handleNew}>📄 New</button>
      </div>
    </header>
  );
}
