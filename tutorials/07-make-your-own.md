# ⭐ Make Your Own Game!

You've learned movement, looks, sounds, loops, variables, keyboard control, and
broadcasts. That's everything you need to invent your **own** games! 🎉

Here are some project ideas, from easy to tricky. Mix and match the blocks you
already know.

---

## 🟢 Easy ideas

### 🐠 Aquarium
Add 3–4 fish/animal sprites. Give each one:
```
when 🚩 clicked
  forever
  ┣━ move (pick random (2) to (6)) steps
  ┣━ if on edge, bounce
  ┗━ wait (0.1) seconds
```
Different speeds make a lively, living scene. Pick the **Ocean** backdrop! 🌊

### 🥁 Music Buttons
Add a few sprites. On each:
```
when this sprite clicked
  play note (C) for (0.3) secs
  change size by (10)
  wait (0.2) seconds
  change size by (-10)
```
Give each sprite a different note to make a tiny piano. 🎹

---

## 🟡 Medium ideas

### 🎯 Whack-a-Mole
Like Star Catcher, but with 3 sprites that pop up (`show`) and hide (`hide`) at
random times. Click them for points before they vanish!
```
when 🚩 clicked
  forever
  ┣━ wait (pick random (1) to (3)) seconds
  ┣━ show
  ┣━ wait (0.7) seconds
  ┗━ hide
```
```
when this sprite clicked
  change score by (1)
  play sound (pop)
  hide
```

### 🏁 Two-Player Race
Player 1 uses `a`/`d` keys, Player 2 uses arrow keys. First sprite to reach the
right edge wins! Use `if <x position > 200> then say (I win!)`.

---

## 🔴 Tricky ideas

### 🍎 Apple Catch
A basket sprite follows the arrow keys at the bottom. An apple sprite falls from
the top. **Share the basket's position with a variable** so the apple can tell
if it was caught:

- **Basket:**
  ```
  when 🚩 clicked
    go to x (0) y (-150)
    forever
    ┗━ set basketX to (x position)
  ```
  (plus left/right arrow key scripts that `change x by (±15)`)

- **Apple:**
  ```
  when 🚩 clicked
    set score to (0)
    forever
    ┣━ go to x (pick random (-200) to (200)) y (160)
    ┣━ repeat until <y position < (-140)>
    ┃  ┗━ change y by (-7)
    ┗━ if <<(x position) > (basketX) - (50)> and <(x position) < (basketX) + (50)>> then
       ┣━ change score by (1)
       ┗━ play sound (coin)
  ```
This uses variables, loops, `repeat until`, and `and` — a real game! 🏆

---

## 🧠 Tips for inventing games
1. **Start tiny.** Get one thing working, press **Go!**, then add the next bit.
2. **Test often.** Press **Go!** after every couple of blocks.
3. **Use `say` to debug.** Not sure what a variable is? `say (score)` to peek.
4. **Save your work!** Click **💾 Save** and give it a fun name.
5. **Steal like an artist.** Open an Example, see how it works, then change it.

## 📚 Keep going
- [🧱 Block Cheat-Sheet](cheatsheet.md) — every block explained.
- Re-open any [tutorial](README.md) to review.

Now go make something amazing. What will *you* invent? 🚀🌈
