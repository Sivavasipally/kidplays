# 🐱 KidPlays Studio

A next-generation, **kid-friendly block-coding playground** — think Scratch, reimagined
with a modern stack and a delightful, colorful UX. Kids drag and snap blocks together to
make sprites move, talk, play sounds, and react to the keyboard and mouse. Everything runs
**100% locally on Windows** with a standalone SQLite database — no internet or accounts
required.

![stack](https://img.shields.io/badge/React-18-4C97FF) ![stack](https://img.shields.io/badge/Blockly-11-FFAB19) ![stack](https://img.shields.io/badge/Flask-3-59C059) ![stack](https://img.shields.io/badge/SQLite-local-9966FF)

---

## ✨ Features

- **Drag-and-drop block editor** powered by Google **Blockly** with a rounded, Scratch-like look.
- **8 block categories**: Events, Motion, Looks, Sound, Control, Sensing, Operators, Variables.
- **Live stage** rendered on an HTML5 **Canvas** at a smooth 60fps.
- **Green-thread VM** — a custom generator-based interpreter (just like Scratch's threading
  model) so loops, waits, and animations run smoothly without ever freezing the browser.
- **Multiple sprites**, each with its own scripts, costume, size, direction and position.
- **Emoji costumes** (🐱 🐶 🤖 🦄 🚀 ⭐ …) — fun and zero asset setup.
- **Synthesized sound effects** (meow, beep, drum, coin, laser, musical notes) via the Web
  Audio API — works fully offline.
- **Drag sprites** directly on the stage; **click sprites** to trigger scripts; **keyboard
  controls** for games.
- **🎬 Make a Movie** — record the stage to a **GIF** or **video (MP4/WebM)** right
  in the browser (no uploads) to save and share creations.
- **Save / load projects** to a local SQLite database, plus an offline localStorage fallback.
- **Ready-made example games**: Dancing Cat, Star Catcher, Arrow Driver, Magic Show.
- **Backdrops**, speech & thought bubbles, variables, and more.

### 🎨 Next-gen "Playful Clay" UX
- Tactile **claymorphism** controls with spring-physics hover/press, an animated
  **aurora** backdrop, and glassy panels.
- 🌙 **Day / Night theme toggle** (remembers your choice, re-skins the whole app
  *and* the Blockly editor).
- 🎉 **Confetti celebrations** when you press Go! and when you Save.
- Built for kids and tablets: large touch targets, bouncy micro-interactions,
  visible focus rings, and full **reduced-motion** support for accessibility.

---

## 🚀 Quick Start (Windows)

### Easiest: one click
Double-click **`start.bat`**. It sets up the Python virtual environment, installs
dependencies, and launches both servers. Then open **http://localhost:3000**.

### Manual (two terminals)

**Backend** (Flask + SQLite):
```bat
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Backend runs at http://localhost:5000

**Frontend** (React + Vite):
```bat
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:3000 (API calls are proxied to the backend).

> No backend? No problem — the editor still runs and falls back to saving in the browser.

---

## 🧱 Architecture

```
kidplays/
├── backend/                 Flask API + SQLite (standalone, offline)
│   ├── app.py               Project CRUD endpoints, serves built frontend
│   └── requirements.txt
├── frontend/                React + Vite single-page app
│   └── src/
│       ├── App.jsx          Layout + run/stop controls
│       ├── store.js         Zustand global state (project, sprites, runtime)
│       ├── api.js           Backend client
│       ├── examples.js      Ready-made starter projects
│       ├── blocks/
│       │   ├── definitions.js   Custom Blockly block definitions
│       │   └── toolbox.js       Categorized toolbox
│       ├── vm/
│       │   ├── interpreter.js   Green-thread VM (the engine)
│       │   └── audio.js         Web Audio sound synthesis
│       └── components/
│           ├── BlocklyWorkspace.jsx   Block editor (per-sprite)
│           ├── Stage.jsx              Canvas renderer + input
│           ├── SpritePanel.jsx        Sprites, costumes, backdrop
│           ├── Header.jsx             Save/Open/New/Examples
│           └── ProjectsModal.jsx      Saved project browser
└── start.bat                One-click Windows launcher
```

### How the VM works
Each "hat" block (e.g. *when 🚩 clicked*) becomes a **green thread** implemented as a
JavaScript generator. Every animation frame the runtime advances every thread to its next
`yield`. Loops (`repeat`, `forever`) and timed blocks (`wait`, `glide`) yield, so the stage
animates smoothly and a runaway loop can never lock up the page. Reporter blocks (numbers,
operators, sensing) are evaluated synchronously on demand.

---

## 🎮 How to Play

1. Pick a block category on the left and **drag blocks** into the canvas.
2. Snap a **🚩 when flag clicked** block on top, then add **Motion / Looks / Sound** blocks.
3. Press **🚩 Go!** to run, **⏹ Stop** (or `Esc`) to stop.
4. **Drag** a sprite on the stage to reposition it; **click** it while running to fire
   *when this sprite clicked* scripts.
5. Add more **sprites**, change **costumes** and **backdrops**, and **Save** your project.
6. Try the **🎁 Examples** menu for instant fun.

---

## 🛠️ Production build

```bat
cd frontend
npm run build         REM outputs frontend/dist
cd ..\backend
python app.py         REM serves the built app + API on http://localhost:5000
```

Made with ❤️ for young coders.
