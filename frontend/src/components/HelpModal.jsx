import React, { useState } from "react";

// ---------------------------------------------------------------------------
// A big, friendly, kid-readable guide to the whole app. Organized into tabs so
// it's never overwhelming. Short sentences, lots of pictures (emoji).
// ---------------------------------------------------------------------------

const SECTIONS = [
  { id: "start", icon: "👋", title: "Start Here" },
  { id: "run", icon: "🚩", title: "Play & Stop" },
  { id: "blocks", icon: "🧱", title: "The Blocks" },
  { id: "sprites", icon: "🐱", title: "Sprites" },
  { id: "stage", icon: "🌈", title: "The Stage" },
  { id: "save", icon: "💾", title: "Save & Open" },
  { id: "layout", icon: "🪟", title: "Move Panels" },
  { id: "keys", icon: "⌨️", title: "Tips & Keys" },
];

const CATEGORY_HELP = [
  ["⚡", "Events", "#ffbf00", "When to start. Like “when 🚩 clicked” or “when up key pressed”. Every script begins with one!"],
  ["🏃", "Motion", "#4c97ff", "Move, turn, glide, and go to spots on the stage."],
  ["🎨", "Looks", "#9966ff", "Say things, change costume, grow, shrink, show or hide."],
  ["🔊", "Sound", "#cf63cf", "Play fun sounds and musical notes."],
  ["🔁", "Control", "#ffab19", "Wait, repeat, forever loops, and “if … then” choices."],
  ["👀", "Sensing", "#5cb1d6", "Check the keyboard, the mouse, edges, and a timer."],
  ["🔢", "Operators", "#59c059", "Math (+ − × ÷), random numbers, and compare things."],
  ["📦", "Variables", "#ff8c1a", "Make a box that remembers a number — like a score!"],
];

export default function HelpModal({ onClose }) {
  const [tab, setTab] = useState("start");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-head">
          <h2>📖 How to use KidPlays Studio</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close help">×</button>
        </div>

        <div className="help-tabs">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`help-tab ${tab === s.id ? "active" : ""}`}
              onClick={() => setTab(s.id)}
            >
              <span className="ht-icon">{s.icon}</span>
              {s.title}
            </button>
          ))}
        </div>

        <div className="help-body">
          {tab === "start" && (
            <section>
              <h3>👋 Welcome, coder!</h3>
              <p>KidPlays Studio lets you make your own games and cartoons by
                snapping colorful blocks together. No typing code needed!</p>
              <div className="help-steps">
                <div className="help-step"><b>1.</b> Drag blocks from the rainbow
                  drawers on the left into the big building area.</div>
                <div className="help-step"><b>2.</b> Snap them <i>under</i> a yellow
                  <b> “when 🚩 clicked”</b> block. They click together like LEGO!</div>
                <div className="help-step"><b>3.</b> Press the big green
                  <b> 🚩 Go!</b> button to watch it play on the stage. 🎉</div>
              </div>
              <p className="help-tip">🌟 New here? Try the <b>🎁 Examples</b> menu to
                load a ready-made game, press Go!, then change a block and see what
                happens.</p>
            </section>
          )}

          {tab === "run" && (
            <section>
              <h3>🚩 Playing your project</h3>
              <ul className="help-list">
                <li><b>🚩 Go!</b> — runs all your scripts. Confetti pops! 🎊</li>
                <li><b>⏹ Stop</b> — stops everything (or press the <kbd>Esc</kbd> key).</li>
                <li>While playing, use your <b>keyboard</b> and <b>click sprites</b> to
                  control your game.</li>
                <li>Want the stage bigger? Use <b>Big Play</b> mode (the ⛶ button) to
                  hide the blocks and just play.</li>
                <li><b>🎬 Make a Movie</b> — record your animation as a <b>GIF</b> or
                  a <b>video</b> to save and share! Press it, let your project play,
                  then press <b>Stop &amp; Save</b>.</li>
              </ul>
            </section>
          )}

          {tab === "blocks" && (
            <section>
              <h3>🧱 The 8 block drawers</h3>
              <p>Each colorful drawer holds blocks that do different things:</p>
              <div className="help-cats">
                {CATEGORY_HELP.map(([icon, name, color, desc]) => (
                  <div className="help-cat" key={name} style={{ "--c": color }}>
                    <span className="help-cat-chip">{icon} {name}</span>
                    <span className="help-cat-desc">{desc}</span>
                  </div>
                ))}
              </div>
              <p className="help-tip">🧩 Block shapes are clues: <b>hat</b> blocks
                start a script, <b>stack</b> blocks are actions, rounded blocks are
                numbers/words, and pointy ones are yes/no questions.</p>
            </section>
          )}

          {tab === "sprites" && (
            <section>
              <h3>🐱 Sprites & costumes</h3>
              <p>A <b>sprite</b> is a character on the stage. Each sprite has its
                own blocks!</p>
              <ul className="help-list">
                <li>Click a sprite in the <b>🎭 Sprites</b> box to edit its code.</li>
                <li>Press <b>＋ Add</b> to make a new sprite.</li>
                <li>Pick a <b>costume</b> (🐱🐶🤖🦄🚀⭐…) from the costume buttons.</li>
                <li>Change its <b>name, size, and position</b> in the top box.</li>
                <li><b>Drag a sprite</b> right on the stage to move it!</li>
              </ul>
            </section>
          )}

          {tab === "stage" && (
            <section>
              <h3>🌈 The stage</h3>
              <p>The stage is where your sprites come to life. It uses
                <b> x</b> (left ↔ right) and <b>y</b> (down ↕ up). The middle is
                <b> x:0, y:0</b>.</p>
              <ul className="help-list">
                <li>Pick a fun <b>backdrop</b> in the 🌈 Backdrop box (Sky, Space,
                  Ocean…).</li>
                <li>Sprites can <b>say</b> things in speech bubbles. 💬</li>
                <li>x goes from about <b>−240 to 240</b>, y from <b>−180 to 180</b>.</li>
              </ul>
            </section>
          )}

          {tab === "save" && (
            <section>
              <h3>💾 Saving & opening</h3>
              <ul className="help-list">
                <li><b>💾 Save</b> — keeps your project safe on this computer.</li>
                <li><b>📂 Open</b> — load a project you saved before.</li>
                <li><b>📄 New</b> — start a fresh, empty project.</li>
                <li>Give your project a <b>name</b> in the box at the top.</li>
              </ul>
              <p className="help-tip">💡 Save often so you never lose your awesome
                work!</p>
            </section>
          )}

          {tab === "layout" && (
            <section>
              <h3>🪟 Make the screen fit you</h3>
              <p>You can arrange the app however you like:</p>
              <ul className="help-list">
                <li><b>Drag the middle divider</b> ↔ to make the blocks or the stage
                  bigger. Double-click it to reset.</li>
                <li><b>⇄ Swap</b> moves the stage to the other side.</li>
                <li><b>⛶ Big Play</b> hides the blocks for full-screen playing.</li>
                <li>Click a panel’s <b>title</b> (like 🎭 Sprites) to fold it up and
                  save room.</li>
                <li>Tap <b>🌙 / ☀️</b> at the top to switch Night and Day looks.</li>
              </ul>
            </section>
          )}

          {tab === "keys" && (
            <section>
              <h3>⌨️ Handy tips & keys</h3>
              <ul className="help-list">
                <li><kbd>Esc</kbd> — stop the project.</li>
                <li>Arrow keys & letters control your game while it plays.</li>
                <li>Right-click a block for <b>Duplicate</b> and <b>Delete</b>.</li>
                <li>Drag a block to the <b>🗑 trash can</b> to remove it.</li>
                <li>Use the <b>+ / −</b> buttons to zoom the blocks in and out.</li>
                <li>Stuck? Open the step-by-step <b>tutorials</b> folder for guided
                  lessons.</li>
              </ul>
            </section>
          )}
        </div>

        <div className="help-foot">
          <button className="hbtn primary" onClick={onClose}>Let’s code! 🚀</button>
        </div>
      </div>
    </div>
  );
}
