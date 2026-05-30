# 🎓 KidPlays Studio — Tutorials

Welcome, coder! 👋 These step-by-step lessons teach you how to make your own
games and animations in **KidPlays Studio**. Each one is short, fun, and builds
on the last. Grab a grown-up if you get stuck — and have fun!

## 🧭 Start here

| # | Tutorial | You'll learn | Time |
|---|----------|--------------|------|
| 1 | [Make the Cat Move](01-make-the-cat-move.md) | The green flag, Motion blocks, the stage | 5 min |
| 2 | [Talking Sprites](02-talking-sprites.md) | Say blocks, costumes, sounds | 5 min |
| 3 | [Dancing Cat](03-dancing-cat.md) | Loops (`forever`, `repeat`), animation | 10 min |
| 4 | [Star Catcher Game](04-star-catcher-game.md) | Variables, scoring, random numbers | 15 min |
| 5 | [Arrow Driver](05-arrow-driver.md) | Keyboard control, events | 10 min |
| 6 | [Magic Show](06-magic-show.md) | Two sprites talking with **broadcasts** | 15 min |
| ⭐ | [Make Your Own Game](07-make-your-own.md) | Ideas & challenges to invent your own! | ∞ |

Also handy:
- [🧱 Block Cheat-Sheet](cheatsheet.md) — what every block does.

## 🚀 How to use these tutorials

1. **Start KidPlays Studio.** Double-click `start.bat`, then open
   <http://localhost:3000> in your browser.
2. Open a tutorial above and follow the steps. Each step shows the exact blocks
   to drag and where to snap them.
3. Press **🚩 Go!** to run your project and **⏹ Stop** (or the `Esc` key) to stop.

## 🎁 Want to peek at the finished projects?

Two easy ways:

- **In the app:** click **🎁 Examples** in the top bar and pick a game.
- **Load them into "My Projects":** with the backend running, run this once:
  ```bat
  python tutorials\import_examples.py
  ```
  Then click **📂 Open** in the app and choose a project.

The finished project files live in [`projects/`](projects/) as `.json` files.
> Tip: if you change the examples in the app, regenerate these files with
> `node tutorials\projects\_generate.mjs`.

## 📖 How to read the block diagrams

Blocks **stack** from top to bottom. Indented blocks go **inside** a loop or
an `if`. For example:

```
when 🚩 clicked
  move (10) steps
  repeat (4)
  ┗━ turn ↻ (90) degrees      ← this block is INSIDE the repeat loop
```

means: "drag a *move 10 steps* under the green-flag hat, then a *repeat 4*
block, and put a *turn 90 degrees* block **inside** the repeat."

Happy coding! 🐱💛
