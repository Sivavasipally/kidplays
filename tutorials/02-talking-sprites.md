# 2) 💬 Talking Sprites

**Goal:** Make your sprite talk, change its look, and play a sound.
**You'll learn:** the **Looks** and **Sound** drawers.

---

## Step 1 — Say hello 👋
1. Start with an Events hat: drag **`when 🚩 clicked`**.
2. Open the purple **Looks** drawer.
3. Drag **`say (Hi there!)`** under the hat.
4. Click the text bubble and type your own message, like **`I love coding!`**

```
when 🚩 clicked
  say (I love coding!)
```

Press **🚩 Go!** — a speech bubble pops up! 💭

## Step 2 — Say it for a few seconds ⏱️
The plain `say` bubble stays forever. Use **`say (…) for (2) seconds`** to make it
disappear on its own:

```
when 🚩 clicked
  say (Hello!) for (2) seconds
  say (How are you?) for (2) seconds
```

The sprite says two things in a row, like a tiny conversation.

## Step 3 — Change costume 🎭
1. In the **Looks** drawer, drag **`switch costume to (dog)`**.
2. Pick any costume from the dropdown — try **🤖 robot** or **🦄 unicorn**.

```
when 🚩 clicked
  switch costume to (robot)
  say (Beep boop! I am a robot.) for (2) seconds
```

> You can also change a sprite's costume on the right side in the **costume
> picker** without any blocks.

## Step 4 — Make a sound 🔊
1. Open the pink **Sound** drawer.
2. Drag **`play sound (meow)`** into your script.
3. Open the dropdown to try **beep**, **drum**, **coin**, or **laser**!

```
when 🚩 clicked
  play sound (meow)
  say (Did you hear that?) for (2) seconds
```

> 🔈 If you don't hear anything, click the stage once first — browsers need a
> click before they allow sound.

## Step 5 — Grow and shrink 🐘🐭
Looks blocks can resize your sprite too:

```
when 🚩 clicked
  set size to (150) %
  say (I'm BIG!) for (1) seconds
  set size to (60) %
  say (Now I'm small!) for (1) seconds
  set size to (100) %
```

---

## 🌟 Challenge
Make a sprite **introduce itself**: say its name, switch to its favorite
costume, play a sound, and grow a little. Give it personality!

**Next:** [3) Dancing Cat →](03-dancing-cat.md)
