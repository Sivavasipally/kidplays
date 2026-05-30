# 3) 💃 Dancing Cat

**Goal:** Make the cat bounce around the stage forever and "dance" by growing
and shrinking.
**You'll learn:** **loops** — the superpower of coding!
**Finished project:** 🎁 Examples → **Dancing Cat**

---

## What is a loop? 🔁
A **loop** repeats blocks so you don't have to copy them over and over.
KidPlays has three loop blocks in the orange **Control** drawer:
- **`repeat (10)`** — do something a set number of times.
- **`forever`** — do something again and again, forever.
- **`repeat until <…>`** — keep going until something becomes true.

## Step 1 — Move forever ♾️
1. Drag **`when 🚩 clicked`** (Events).
2. From **Control**, drag **`forever`** under it.
3. From **Motion**, drag **`move (15) steps`** *inside* the `forever`.

```
when 🚩 clicked
  forever
  ┗━ move (15) steps
```

Press **Go!** — uh oh, the cat zooms off the screen! Let's fix that. Press
**⏹ Stop**.

## Step 2 — Bounce off the edges 🧱
From **Motion**, drag **`if on edge, bounce`** inside the loop, under the move:

```
when 🚩 clicked
  forever
  ┣━ move (15) steps
  ┗━ if on edge, bounce
```

Press **Go!** — now the cat bounces back and forth across the stage! 🏓

## Step 3 — Slow it down a little 🐢
Add a tiny wait so it's easier to watch. From **Control**, drag
**`wait (0.1) seconds`** into the loop:

```
when 🚩 clicked
  forever
  ┣━ move (15) steps
  ┣━ if on edge, bounce
  ┗━ wait (0.1) seconds
```

## Step 4 — Make it dance! 💃
Now the fun part. Add two **Looks** blocks so the cat grows, then shrinks each
loop — it looks like dancing:

```
when 🚩 clicked
  forever
  ┣━ move (15) steps
  ┣━ if on edge, bounce
  ┣━ change size by (5)
  ┣━ wait (0.1) seconds
  ┗━ change size by (-5)
```

Press **Go!** — your cat dances across the stage! 🎉 Try a fun **backdrop** from
the right-side panel, like **Sunset** 🌅.

## Step 5 — Try `repeat` instead 🔢
`forever` never stops. `repeat` does something a fixed number of times. Make a
sprite spin one full circle (360°) in 36 little steps of 10°:

```
when 🚩 clicked
  repeat (36)
  ┗━ turn ↻ (10) degrees
```

36 × 10° = 360° = one full spin!

---

## 🌟 Challenge
Add a **`play sound`** block inside the loop so the cat makes a noise on every
bounce. (Pick a short sound like **pop** so it's not too noisy! 🎈)

**Next:** [4) Star Catcher Game →](04-star-catcher-game.md)
