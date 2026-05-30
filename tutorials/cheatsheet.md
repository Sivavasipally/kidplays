# 🧱 KidPlays Block Cheat-Sheet

Every block in KidPlays Studio, by color drawer. Keep this open while you build!

> **Block shapes:**
> ▤ *hat* (starts a script) · ▭ *stack* (an action) · ⬭ *reporter* (a number/word)
> · ⬡ *boolean* (yes/no, fits in diamond slots) · ⊏⊐ *loop/if* (holds blocks inside)

---

## 🟡 Events — *when something happens*
| Block | What it does |
|-------|--------------|
| ▤ `when 🚩 clicked` | Runs when you press **Go!** |
| ▤ `when (key) key pressed` | Runs when that key is pressed |
| ▤ `when this sprite clicked` | Runs when you click the sprite |
| ▤ `when I get (message)` | Runs when that message is broadcast |
| ▭ `broadcast (message)` | Shouts a message to all sprites |

## 🔵 Motion — *move and turn*
| Block | What it does |
|-------|--------------|
| ▭ `move (10) steps` | Moves forward the way it's facing |
| ▭ `turn ↻ (15) degrees` | Turns clockwise (right) |
| ▭ `turn ↺ (15) degrees` | Turns counter-clockwise (left) |
| ▭ `go to x ( ) y ( )` | Jumps to a spot (`0,0` is the center) |
| ▭ `glide (1) secs to x ( ) y ( )` | Slides smoothly to a spot |
| ▭ `point in direction (90)` | Faces a direction (90 = right, 0 = up) |
| ▭ `change x by (10)` | Moves left/right (+ = right) |
| ▭ `change y by (10)` | Moves up/down (+ = up) |
| ▭ `if on edge, bounce` | Bounces off the stage edge |
| ⬭ `x position` / `y position` | Where the sprite is |
| ⬭ `direction` | Which way it's facing |

## 🟣 Looks — *change how it looks*
| Block | What it does |
|-------|--------------|
| ▭ `say (Hi!)` | Shows a speech bubble |
| ▭ `say (Hi!) for (2) seconds` | Bubble that disappears |
| ▭ `think (Hmm...)` | A thought bubble |
| ▭ `switch costume to (cat)` | Changes the sprite's picture |
| ▭ `change size by (10)` | Grows (+) or shrinks (−) |
| ▭ `set size to (100) %` | Sets exact size (100 = normal) |
| ▭ `show` / `hide` | Makes the sprite appear/disappear |
| ⬭ `size` | The current size number |

## 🩷 Sound — *make noise*
| Block | What it does |
|-------|--------------|
| ▭ `play sound (meow)` | Plays a fun sound effect |
| ▭ `play note (C) for (1) secs` | Plays a musical note |

> Sounds: meow, beep, boop, pop, drum, laser, coin, jump.
> Notes: C, D, E, F, G, A, B, high C.

## 🟠 Control — *loops and choices*
| Block | What it does |
|-------|--------------|
| ▭ `wait (1) seconds` | Pauses |
| ⊏⊐ `repeat (10)` | Repeats the blocks inside, N times |
| ⊏⊐ `forever` | Repeats the blocks inside, forever |
| ⊏⊐ `if <…> then` | Runs the inside blocks **if** the test is true |
| ⊏⊐ `if <…> then … else …` | Does one thing or the other |
| ⊏⊐ `repeat until <…>` | Repeats until the test becomes true |
| ▭ `wait until <…>` | Pauses until the test becomes true |
| ▭ `stop (all)` | Stops scripts (`all` or `this script`) |

## 🔷 Sensing — *react to the world*
| Block | What it does |
|-------|--------------|
| ⬡ `touching edge?` | Yes if the sprite hit the stage edge |
| ⬡ `key (space) pressed?` | Yes if that key is held down |
| ⬭ `mouse x` / `mouse y` | Where the mouse pointer is |
| ⬭ `timer` | Seconds since the project started |

## 🟢 Operators — *math and words*
| Block | What it does |
|-------|--------------|
| ⬭ `( ) + ( )` | Add, subtract, multiply, divide (`+ − × ÷`) |
| ⬭ `pick random (1) to (10)` | A surprise number in that range |
| ⬡ `( ) < ( )` | Compare numbers (`<`, `=`, `>`) |
| ⬡ `<…> and <…>` / `<…> or <…>` | Combine two yes/no tests |
| ⬡ `not <…>` | Flips yes↔no |
| ⬭ `join (apple ) (pie)` | Sticks two words together |
| ⬭ `(10)` number / `(Hello!)` text | A plain number or word to type in |

## 🟧 Variables — *remember things*
| Block | What it does |
|-------|--------------|
| ▭ `set (score) to (0)` | Puts a number in the box |
| ▭ `change (score) by (1)` | Adds to the box |
| ⬭ `score` | The number currently in the box |

> Click **"Create variable…"** in the Variables drawer to make a new one
> (like `score`, `lives`, or `speed`).

---

### ⌨️ Handy keys
- **Esc** — stop everything (same as ⏹ Stop).
- **Drag a sprite** on the stage to move it.
- Right-click a block for **Duplicate** and **Delete**.

Back to the [tutorials index](README.md).
