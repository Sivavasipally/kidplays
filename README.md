# 🐱 KidPlays Studio

A next-generation, **kid-friendly block-coding playground** — think Scratch, reimagined
with a modern stack and a delightful, colorful UX. Kids drag and snap blocks together to
make sprites move, talk, play sounds, and react to the keyboard and mouse.

**100% static & server-free** — projects are saved right in the browser, so the whole app
can be hosted for free on **GitHub Pages** (or any static host), or run locally with no
internet or accounts required.

![stack](https://img.shields.io/badge/React-18-4C97FF) ![stack](https://img.shields.io/badge/Blockly-11-FFAB19) ![stack](https://img.shields.io/badge/Vite-5-646CFF) ![stack](https://img.shields.io/badge/static-no%20backend-3ddc84)

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
- **Save / load projects** right in the browser (localStorage) — no server, accounts, or
  internet needed. Your projects stay on your computer.
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

## 🚀 Run it locally

The app is a single static frontend — **no backend required**.

```bat
cd frontend
npm install
npm run dev
```
Then open **http://localhost:3000**. Projects are saved in your browser.

To make a production build (static files in `frontend/dist`):
```bat
cd frontend
npm run build
npm run preview   REM optional: preview the built site
```

> The old `backend/` folder (Flask + SQLite) is **optional and no longer needed** — it's
> kept only for anyone who wants a shared, multi-device server. The app works fully without it.

---

## 🌐 Deploy free on GitHub Pages

Because there's no backend, you can host KidPlays Studio for free as a static site.

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source: GitHub Actions**.
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds the
   frontend and publishes it automatically.
4. Your app goes live at `https://<your-username>.github.io/<repo-name>/`.

The build uses a relative base path (`base: "./"` in `vite.config.js`), so it works under
any repository sub-path with no extra configuration. You can also drag `frontend/dist` onto
**Netlify**, **Cloudflare Pages**, or any static host.

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
│       ├── api.js           Project storage (browser localStorage — no server)
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
