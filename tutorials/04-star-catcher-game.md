# 4) ⭐ Star Catcher Game

**Goal:** A star jumps to random spots. Click it fast to score points!
**You'll learn:** **variables** (to keep score) and **random numbers**.
**Finished project:** 🎁 Examples → **Star Catcher**

---

## Step 1 — Set the scene 🌌
1. Click a sprite and switch its costume to **⭐ star** (costume picker on the
   right, or a `switch costume to (star)` block).
2. Pick the **Space** 🌑 backdrop on the right.

## Step 2 — Make a score variable 🔢
A **variable** is a labeled box that remembers a number.
1. Open the orange **Variables** drawer.
2. Click **"Create variable…"** and name it **`score`**. Click OK.

New blocks appear: `set score to ( )`, `change score by ( )`, and a round
`score` reporter.

## Step 3 — Start the score at zero 🟢
Build this with the green-flag hat:

```
when 🚩 clicked
  set score to (0)
```

Always reset the score to **0** when the game starts!

## Step 4 — Make the star jump randomly 🎲
We want the star to teleport to a random spot, wait, then jump again — forever.

1. From **Control**, add a **`forever`** loop.
2. From **Motion**, put **`go to x ( ) y ( )`** inside it.
3. From **Operators** (green), drag a **`pick random (1) to (10)`** block into the
   **x** slot. Set it to **`pick random (-200) to (200)`**.
4. Do the same for **y**, but use **`pick random (-140) to (140)`** (the stage is
   shorter than it is wide).
5. Add **`wait (0.9) seconds`** so it pauses between jumps.

```
when 🚩 clicked
  set score to (0)
  forever
  ┣━ go to x (pick random (-200) to (200)) y (pick random (-140) to (140))
  ┗━ wait (0.9) seconds
```

Press **Go!** — the star teleports around the stage. Try to keep your eyes on it!

## Step 5 — Score when clicked 🖱️
Now make a **second script** (on the same sprite). Drag a new hat from Events:
**`when this sprite clicked`**.

```
when this sprite clicked
  change score by (1)
  play sound (coin)
  say (Yay! +1)
```

Press **Go!** and click the star whenever you can catch it. Your score goes up
and you hear a coin! 🪙

## Step 6 — Make it harder ⏩
Change `wait (0.9) seconds` to a smaller number like **`0.5`**. The star jumps
faster — much harder to catch!

> 💡 Want a timer challenge? Use the **`timer`** block (Sensing) and a
> `repeat until <timer > 20>` loop so the game ends after 20 seconds.

---

## 🌟 Challenge
Add a **"miss" penalty**: make a `change score by (-1)` happen sometimes, or add
a second star worth **5** points that's smaller and faster.

**Next:** [5) Arrow Driver →](05-arrow-driver.md)
