# 1) 🐱 Make the Cat Move

**Goal:** Make the cat walk across the stage when you press the green flag.
**You'll learn:** the green flag, Motion blocks, and the stage.

---

## Step 1 — Look around 👀
When KidPlays Studio opens you'll see:
- **Left side** = the place where you build with blocks.
- **Right side** = the **stage** (where the cat lives) with the **🚩 Go!** and
  **⏹ Stop** buttons on top.
- **Block drawers** on the far left: *Events, Motion, Looks, ...* in rainbow colors.

## Step 2 — Add the "start" block 🚩
1. Click the yellow **Events** drawer.
2. Drag **`when 🚩 clicked`** onto the building area.

This is a **hat block**. Every script starts with a hat — it tells the computer
*when* to run your code.

## Step 3 — Make it move ➡️
1. Click the blue **Motion** drawer.
2. Drag **`move (10) steps`** so it snaps **under** the hat. You'll feel it click!
3. Click the white number bubble and change **10** to **50**.

Your script should look like this:

```
when 🚩 clicked
  move (50) steps
```

## Step 4 — Press Go! ▶️
Press the big green **🚩 Go!** button. The cat slides to the right. 🎉

> Did the cat barely move? Make the number bigger. Want it to go left? Use a
> **negative** number like **-50**.

## Step 5 — Turn and walk 🔄
Let's make the cat walk in a little path. Add two more Motion blocks:

```
when 🚩 clicked
  move (50) steps
  turn ↻ (90) degrees
  move (50) steps
```

Press **Go!** again. The cat moves, turns, and moves again!

## Step 6 — Jump to a spot 🎯
The stage uses **x** (left↔right) and **y** (up↕down). The middle is `x: 0, y: 0`.
Try sending the cat to a corner:

```
when 🚩 clicked
  go to x (-150) y (100)
```

Press **Go!** — the cat teleports! You can also just **drag the cat** on the
stage with your mouse to move it.

---

## 🌟 Challenge
Make the cat draw a **square path**: move and turn 90° four times. Hint: a
`repeat (4)` loop can do the turning for you — you'll learn that in
[Tutorial 3](03-dancing-cat.md)!

**Next:** [2) Talking Sprites →](02-talking-sprites.md)
