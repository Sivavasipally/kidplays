import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import BlocklyWorkspace from "./components/BlocklyWorkspace.jsx";
import Stage from "./components/Stage.jsx";
import SpritePanel from "./components/SpritePanel.jsx";
import ProjectsModal from "./components/ProjectsModal.jsx";
import { useStore } from "./store.js";

export default function App() {
  const [showProjects, setShowProjects] = useState(false);
  const running = useStore((s) => s.running);
  const setRunning = useStore((s) => s.setRunning);
  const toast = useStore((s) => s.toast);

  // Keyboard shortcut: spacebar-free green flag on Ctrl+Enter, Esc to stop.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && useStore.getState().running) setRunning(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setRunning]);

  return (
    <div className="app">
      <Header onOpenProjects={() => setShowProjects(true)} />

      <main className="workspace-layout">
        {/* Left: block coding area */}
        <section className="blocks-area">
          <BlocklyWorkspace />
        </section>

        {/* Right: stage + sprites */}
        <aside className="stage-area">
          <div className="run-bar">
            <button
              className={`run-btn go ${running ? "active" : ""}`}
              onClick={() => setRunning(true)}
              title="Run the project"
            >
              🚩 Go!
            </button>
            <button
              className="run-btn stop"
              onClick={() => setRunning(false)}
              title="Stop everything"
            >
              ⏹ Stop
            </button>
          </div>

          <Stage />
          <SpritePanel />
        </aside>
      </main>

      {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} />}

      {toast && <div className={`toast ${toast.kind}`}>{toast.text}</div>}
    </div>
  );
}
