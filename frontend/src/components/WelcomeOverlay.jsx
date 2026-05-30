import React from "react";

// Friendly first-visit greeting that points kids to the Help guide.
export default function WelcomeOverlay({ onHelp, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="welcome-card" onClick={(e) => e.stopPropagation()}>
        <div className="welcome-emoji">🐱✨</div>
        <h2>Welcome to KidPlays Studio!</h2>
        <p>Make your own games and cartoons by snapping colorful blocks together.
          It’s easy and super fun!</p>
        <div className="welcome-actions">
          <button className="welcome-btn primary" onClick={onHelp}>
            📖 Show me how
          </button>
          <button className="welcome-btn" onClick={onClose}>
            🚀 Let me explore
          </button>
        </div>
        <p className="welcome-foot">You can open <b>❓ Help</b> any time from the top bar.</p>
      </div>
    </div>
  );
}
