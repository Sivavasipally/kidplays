# 5) 🚀 Arrow Driver

**Goal:** Fly a rocket around the stage using your keyboard's arrow keys.
**You'll learn:** **keyboard events** — how to make games you can control!
**Finished project:** 🎁 Examples → **Arrow Driver**

---

## The big idea ⌨️
Instead of one green-flag script, we'll make **four** little scripts — one for
each arrow key. Each one nudges the rocket a little. Because you can hold a key
down, the rocket glides smoothly.

## Step 1 — Pick a rocket 🚀
Switch your sprite's costume to **🚀 rocket** and choose the **Grass** 🌱
backdrop (or any you like).

## Step 2 — Move up ⬆️
1. From **Events**, drag **`when (space) key pressed`**.
2. Click its dropdown and choose **up arrow ⬆**.
3. From **Motion**, add **`change y by (10)`**. Make it **`12`** for a bit more
   zip.

```
when (up arrow ⬆) key pressed
  change y by (12)
```

Press **Go!**, then press the **up arrow** key. The rocket flies up! 🆙

## Step 3 — The other three directions ↕️↔️
Make three more key scripts. Drag a new **`when … key pressed`** hat for each:

```
when (down arrow ⬇) key pressed
  change y by (-12)

when (left arrow ⬅) key pressed
  change x by (-12)

when (right arrow ➡) key pressed
  change x by (12)
```

- **Up** = +y, **Down** = −y
- **Right** = +x, **Left** = −x

Press **Go!** and fly around with all four arrow keys! 🕹️

## Step 4 — A friendly start message 👋
Add one green-flag script so the game greets the player and centers the rocket:

```
when 🚩 clicked
  go to x (0) y (0)
  say (Use the arrow keys to fly me! 🚀) for (2) seconds
```

## Step 5 — Point where you're going 🔄
Want the rocket to *face* its direction? Add a `point in direction` block to
each key script:
- Up → `point in direction (0)`
- Right → `point in direction (90)`
- Down → `point in direction (180)`
- Left → `point in direction (-90)`

Now the rocket turns as it flies! 🛸

---

## 🌟 Challenge
Add a **star** to collect (from Tutorial 4): give it a `score` variable and make
it jump to a random spot. Can you fly the rocket to "catch" stars? Use a
shared variable to compare the rocket's and the star's positions!

**Next:** [6) Magic Show →](06-magic-show.md)
