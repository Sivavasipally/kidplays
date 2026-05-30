import React, { useState, useEffect } from "react";
import { useStore } from "../store.js";
import { api } from "../api.js";
import { EXAMPLES } from "../examples.js";
import { useTheme } from "../theme.js";
import { celebrate } from "../confetti.js";

export default function Header({ onOpenProjects, onOpenHelp }) {
  const { theme, toggle } = useTheme();
  const layout = useStore((s) => s.layout);
  const setLayout = useStore((s) => s.setLayout);
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
  const [showLayout, setShowLayout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger sheet

  // Close the mobile menu when the viewport grows to desktop, and on Escape.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 861px)");
    const onChange = (e) => e.matches && setMenuOpen(false);
    mq.addEventListener?.("change", onChange);
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      mq.removeEventListener?.("change", onChange);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setShowExamples(false);
    setShowLayout(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { name: projectName, data: serializeProject() };
      let result;
      if (projectId) result = await api.updateProject(projectId, payload);
      else result = await api.createProject(payload);
      setProjectId(result.id);
      showToast("Saved! 🎉", "success");
      celebrate();
    } catch (e) {
      console.error("Save failed", e);
      showToast("Could not save — your browser storage may be full 😢", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleNew = () => {
    closeMenus();
    if (confirm("Start a brand new project? Unsaved work will be lost.")) {
      newProject();
      showToast("New project! ✨", "info");
    }
  };

  const handleExample = (ex) => {
    loadProject({ name: ex.name, data: ex.data });
    closeMenus();
    showToast(`Loaded "${ex.name}" 🚀`, "info");
  };

  const handleOpen = () => {
    closeMenus();
    onOpenProjects();
  };

  const handleHelp = () => {
    closeMenus();
    onOpenHelp();
  };

  const setLayoutAndClose = (patch) => {
    setLayout(patch);
    closeMenus();
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
        aria-label="Project name"
      />

      {/* Always-visible quick actions */}
      <div className="header-quick">
        <button
          className="theme-toggle"
          onClick={toggle}
          title={theme === "day" ? "Switch to Night mode" : "Switch to Day mode"}
          aria-label="Toggle day or night theme"
        >
          {theme === "day" ? "🌙" : "☀️"}
        </button>
        <button className="hbtn primary save-quick" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "💾 Save"}
        </button>
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span className="bars" />
        </button>
      </div>

      {/* Secondary actions — inline on desktop, a tap-friendly sheet on mobile */}
      <div className={`header-actions ${menuOpen ? "open" : ""}`}>
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

        <button className="hbtn" onClick={handleOpen}>📂 Open</button>
        <button className="hbtn save-full primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "💾 Save"}
        </button>
        <button className="hbtn" onClick={handleNew}>📄 New</button>

        <div className="dropdown">
          <button className="hbtn" onClick={() => setShowLayout((v) => !v)}>
            🪟 Layout ▾
          </button>
          {showLayout && (
            <div className="dropdown-menu" onMouseLeave={() => setShowLayout(false)}>
              <button onClick={() => setLayoutAndClose({ stageSide: layout.stageSide === "right" ? "left" : "right" })}>
                ⇄ Swap sides
              </button>
              <button onClick={() => setLayoutAndClose({ ratio: 0.62 })}>
                ↔ Reset panel size
              </button>
              <button onClick={() => setLayoutAndClose({ playMode: true })}>
                ⛶ Big Play mode
              </button>
            </div>
          )}
        </div>

        <button className="hbtn help" onClick={handleHelp} title="How to use KidPlays">
          ❓ Help
        </button>
      </div>

      {/* Tap-away scrim behind the mobile menu */}
      {menuOpen && <div className="menu-scrim" onClick={closeMenus} />}
    </header>
  );
}
