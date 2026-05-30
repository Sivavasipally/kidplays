import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "./components/Header.jsx";
import BlocklyWorkspace from "./components/BlocklyWorkspace.jsx";
import Stage from "./components/Stage.jsx";
import SpritePanel from "./components/SpritePanel.jsx";
import ProjectsModal from "./components/ProjectsModal.jsx";
import HelpModal from "./components/HelpModal.jsx";
import WelcomeOverlay from "./components/WelcomeOverlay.jsx";
import { useStore } from "./store.js";
import { celebrateFrom } from "./confetti.js";

const SEEN_KEY = "kidplays:seen";

export default function App() {
  const [showProjects, setShowProjects] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(SEEN_KEY));

  const running = useStore((s) => s.running);
  const setRunning = useStore((s) => s.setRunning);
  const toast = useStore((s) => s.toast);
  const layout = useStore((s) => s.layout);
  const setLayout = useStore((s) => s.setLayout);

  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  // Esc stops the running project.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && useStore.getState().running) setRunning(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setRunning]);

  const dismissWelcome = () => {
    localStorage.setItem(SEEN_KEY, "1");
    setShowWelcome(false);
  };

  // ---- Resizable split between blocks and stage --------------------------
  const onResize = useCallback(
    (e) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let p = (e.clientX - rect.left) / rect.width;
      if (layout.stageSide === "left") p = 1 - p; // blocks live on the right
      const ratio = Math.min(0.78, Math.max(0.28, p));
      setLayout({ ratio });
    },
    [layout.stageSide, setLayout]
  );

  useEffect(() => {
    const stop = () => {
      draggingRef.current = false;
      document.body.classList.remove("resizing");
    };
    window.addEventListener("pointermove", onResize);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onResize);
      window.removeEventListener("pointerup", stop);
    };
  }, [onResize]);

  const startResize = (e) => {
    draggingRef.current = true;
    document.body.classList.add("resizing");
    e.preventDefault();
  };

  return (
    <div className="app">
      <Header
        onOpenProjects={() => setShowProjects(true)}
        onOpenHelp={() => setShowHelp(true)}
      />

      <main
        ref={containerRef}
        className={`workspace-layout side-${layout.stageSide} ${layout.playMode ? "play-mode" : ""}`}
        style={{ "--blocks-fr": layout.ratio }}
      >
        {/* Left: block coding area */}
        <section className="blocks-area">
          <BlocklyWorkspace />
        </section>

        {/* Draggable divider */}
        <div
          className="dock-handle"
          onPointerDown={startResize}
          onDoubleClick={() => setLayout({ ratio: 0.62 })}
          title="Drag to resize • double-click to reset"
          role="separator"
          aria-label="Resize panels"
        >
          <span className="dock-grip" />
        </div>

        {/* Right: stage + sprites */}
        <aside className="stage-area">
          <div className="run-bar">
            <button
              className={`run-btn go ${running ? "active" : ""}`}
              onClick={(e) => {
                if (!running) celebrateFrom(e.currentTarget, 60);
                setRunning(true);
              }}
              title="Run the project"
            >
              🚩 Go!
            </button>
            <button
              className="run-btn stop"
              onClick={() => setRunning(false)}
              title="Stop everything (Esc)"
            >
              ⏹ Stop
            </button>
          </div>

          <Stage />
          <SpritePanel />
        </aside>

        {/* Floating control to leave Big Play mode */}
        {layout.playMode && (
          <button
            className="exit-play"
            onClick={() => setLayout({ playMode: false })}
            title="Back to building blocks"
          >
            ✏️ Edit Blocks
          </button>
        )}
      </main>

      {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showWelcome && (
        <WelcomeOverlay
          onHelp={() => {
            dismissWelcome();
            setShowHelp(true);
          }}
          onClose={dismissWelcome}
        />
      )}

      {toast && <div className={`toast ${toast.kind}`}>{toast.text}</div>}
    </div>
  );
}
