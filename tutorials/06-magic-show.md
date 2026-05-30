# 6) 🦄 Magic Show

**Goal:** Click the unicorn to cast a spell — and watch a star spin and grow on
the other side of the stage!
**You'll learn:** **broadcasts** — how sprites talk to each other.
**Finished project:** 🎁 Examples → **Magic Show**

---

## The big idea 📣
So far one sprite did everything. Real games have sprites that **work together**.
A **broadcast** is like shouting a secret word: one sprite shouts it, and *any*
sprite that's listening for that word springs into action.

We'll use **two sprites**:
- 🦄 **Unicorn** — when clicked, shouts the word **"magic"**.
- ⭐ **Star** — listens for **"magic"** and does a sparkly spin.

## Step 1 — Make two sprites 🎭
1. On the right, in the **Sprites** panel, click **➕ Add** to get a second sprite.
2. Name the first **Unicorn** (costume 🦄) and the second **Star** (costume ⭐).
3. Drag them apart on the stage — unicorn on the left, star on the right.

> Remember: **each sprite has its own blocks.** Click a sprite to edit *its*
> scripts. The block area always shows the **selected** sprite's code.

## Step 2 — The unicorn casts a spell ✨
Click the **Unicorn** sprite, then build:

```
when this sprite clicked
  say (Abracadabra!)
  broadcast (magic)
```

The **`broadcast`** block is in the yellow **Events** drawer. Type the message
**`magic`** into it. (Spelling must match exactly!)

## Step 3 — The star listens 👂
Now click the **Star** sprite so you're editing *its* blocks. Add a listening
hat from **Events**: **`when I get (magic)`**. Type **`magic`** — the same word
the unicorn shouts.

```
when I get (magic)
  repeat (10)
  ┣━ turn ↻ (36) degrees
  ┣━ change size by (6)
  ┗━ wait (0.05) seconds
  play sound (coin)
  set size to (80) %
  say (Ta-da! 🎉)
```

The `repeat (10)` makes the star spin a full circle (10 × 36° = 360°) while
growing — then it plays a sound and shrinks back.

## Step 4 — A welcome message 👋
Still on the **Star**, add a green-flag script so players know what to do:

```
when 🚩 clicked
  set size to (80) %
  say (Click the unicorn! ✨)
```

## Step 5 — Show time! 🎩
Press **🚩 Go!**, then **click the unicorn** on the stage. The unicorn says the
magic word, and across the stage the star bursts into a spinning sparkle! 🌟

---

## 🌟 Challenge
Add a **third sprite** that *also* listens for **"magic"** and does something
different (jumps, changes color-costumes, plays a different sound). One shout,
many reactions! You can also make the unicorn broadcast a *different* word for a
*different* trick.

**Next:** [⭐ Make Your Own Game →](07-make-your-own.md)
