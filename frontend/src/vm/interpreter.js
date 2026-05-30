import * as Blockly from "blockly/core";
// Ensures the built-in variable blocks (variables_set/get, math_change) are
// registered before we build headless workspaces here, independent of which
// component mounts first.
import "blockly/blocks";

// ---------------------------------------------------------------------------
// KidPlays VM — a tiny, Scratch-inspired runtime.
//
// Design: every "hat" script becomes a green thread implemented as a JS
// generator. Each animation frame we advance every thread to its next yield
// point. Loops and waits yield, so animation stays smooth and nothing ever
// freezes the browser. Reporter blocks (values) evaluate synchronously.
//
// The runtime reads Blockly block objects directly from a headless workspace
// built per-sprite, so there is no separate code-generation step.
// ---------------------------------------------------------------------------

export const STAGE_W = 480;
export const STAGE_H = 360;
const HALF_W = STAGE_W / 2; // 240
const HALF_H = STAGE_H / 2; // 180

const DEG = Math.PI / 180;

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export class Runtime {
  constructor({ sprites, backdrop, audio, input, onRender, onStop }) {
    this.audio = audio;
    this.input = input; // { keys:Set, mouseX, mouseY, isMouseDown }
    this.onRender = onRender;
    this.onStop = onStop;
    this.backdrop = backdrop;

    this.workspaces = {}; // spriteId -> headless Blockly.Workspace
    this.sprites = {}; // spriteId -> runtime sprite state
    this.spriteOrder = [];
    this.variables = {}; // name -> value (shared across sprites, kid-simple)

    this.threads = [];
    this.running = false;
    this.startTime = 0;
    this.rafId = null;

    for (const s of sprites) {
      const ws = new Blockly.Workspace();
      if (s.workspace) {
        try {
          Blockly.serialization.workspaces.load(s.workspace, ws);
        } catch (e) {
          console.warn("Could not load workspace for", s.name, e);
        }
      }
      this.workspaces[s.id] = ws;
      this.spriteOrder.push(s.id);
      this.sprites[s.id] = {
        id: s.id,
        name: s.name,
        costume: s.costume,
        x: toNum(s.x),
        y: toNum(s.y),
        direction: toNum(s.direction) || 90,
        size: toNum(s.size) || 100,
        visible: s.visible !== false,
        say: "",
        sayKind: "say",
      };
      // Seed variables to 0 so reporters always have a value.
      const vars = ws.getAllVariables ? ws.getAllVariables() : [];
      for (const v of vars) {
        if (!(v.name in this.variables)) this.variables[v.name] = 0;
      }
    }
  }

  // ---- public controls --------------------------------------------------
  greenFlag() {
    this.start();
    this.startHats("event_when_flag_clicked");
  }

  spriteClicked(spriteId) {
    if (!this.running) this.start();
    this.startHats("event_when_sprite_clicked", spriteId);
  }

  keyPressed(keyName) {
    if (!this.running) return;
    for (const sid of this.spriteOrder) {
      const ws = this.workspaces[sid];
      for (const hat of ws.getTopBlocks(true)) {
        if (hat.type !== "event_when_key_pressed") continue;
        const k = hat.getFieldValue("KEY");
        if (k === keyName || k === "any") {
          this.spawnThread(hat, sid);
        }
      }
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startTime = performance.now();
    this.threads = [];
    const loop = () => {
      if (!this.running) return;
      this.step();
      this.onRender(this.snapshot());
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.threads = [];
    this.onRender(this.snapshot());
    if (this.onStop) this.onStop();
  }

  dispose() {
    this.stop();
    for (const id of Object.keys(this.workspaces)) {
      try {
        this.workspaces[id].dispose();
      } catch {
        /* ignore */
      }
    }
    this.workspaces = {};
  }

  // ---- thread management ------------------------------------------------
  startHats(hatType, onlySpriteId = null) {
    for (const sid of this.spriteOrder) {
      if (onlySpriteId && sid !== onlySpriteId) continue;
      const ws = this.workspaces[sid];
      for (const hat of ws.getTopBlocks(true)) {
        if (hat.type === hatType) this.spawnThread(hat, sid);
      }
    }
  }

  spawnThread(hatBlock, spriteId) {
    const ctx = { spriteId, sprite: this.sprites[spriteId] };
    const gen = this.runStack(hatBlock.getNextBlock(), ctx);
    this.threads.push({ gen, done: false, ctx });
  }

  broadcast(msg) {
    for (const sid of this.spriteOrder) {
      const ws = this.workspaces[sid];
      for (const hat of ws.getTopBlocks(true)) {
        if (
          hat.type === "event_when_broadcast" &&
          (hat.getFieldValue("MSG") || "").trim() === msg.trim()
        ) {
          this.spawnThread(hat, sid);
        }
      }
    }
  }

  step() {
    // Advance every live thread to its next yield. New threads (from
    // broadcasts / clicks) may be appended mid-loop; iterate over a copy.
    const current = this.threads;
    for (const t of current) {
      if (t.done) continue;
      try {
        const r = t.gen.next();
        if (r.done) t.done = true;
      } catch (e) {
        console.error("Script error:", e);
        t.done = true;
      }
    }
    this.threads = this.threads.filter((t) => !t.done);
  }

  snapshot() {
    return {
      running: this.running,
      sprites: this.spriteOrder.map((id) => ({ ...this.sprites[id] })),
      variables: { ...this.variables },
      backdrop: this.backdrop,
    };
  }

  // ---- statement execution ----------------------------------------------
  *runStack(block, ctx) {
    let b = block;
    while (b) {
      yield* this.runBlock(b, ctx);
      b = b.getNextBlock();
    }
  }

  *runBlock(block, ctx) {
    const s = ctx.sprite;
    switch (block.type) {
      // --- motion ---
      case "motion_move": {
        const steps = this.evalNum(block, "STEPS", ctx);
        const rad = (90 - s.direction) * DEG;
        s.x += steps * Math.cos(rad);
        s.y += steps * Math.sin(rad);
        break;
      }
      case "motion_turn_right":
        s.direction = wrapDir(s.direction + this.evalNum(block, "DEG", ctx));
        break;
      case "motion_turn_left":
        s.direction = wrapDir(s.direction - this.evalNum(block, "DEG", ctx));
        break;
      case "motion_goto_xy":
        s.x = this.evalNum(block, "X", ctx);
        s.y = this.evalNum(block, "Y", ctx);
        break;
      case "motion_point_direction":
        s.direction = wrapDir(this.evalNum(block, "DEG", ctx));
        break;
      case "motion_change_x":
        s.x += this.evalNum(block, "DX", ctx);
        break;
      case "motion_change_y":
        s.y += this.evalNum(block, "DY", ctx);
        break;
      case "motion_glide":
        yield* this.glide(block, ctx);
        break;
      case "motion_bounce":
        this.bounce(s);
        break;

      // --- looks ---
      case "looks_say":
        s.say = String(this.evalValue(block, "TEXT", ctx, ""));
        s.sayKind = "say";
        break;
      case "looks_think":
        s.say = String(this.evalValue(block, "TEXT", ctx, ""));
        s.sayKind = "think";
        break;
      case "looks_say_for": {
        s.say = String(this.evalValue(block, "TEXT", ctx, ""));
        s.sayKind = "say";
        yield* this.wait(this.evalNum(block, "SECS", ctx));
        s.say = "";
        break;
      }
      case "looks_switch_costume":
        s.costume = block.getFieldValue("COSTUME");
        break;
      case "looks_change_size":
        s.size = Math.max(10, s.size + this.evalNum(block, "DELTA", ctx));
        break;
      case "looks_set_size":
        s.size = Math.max(10, this.evalNum(block, "SIZE", ctx));
        break;
      case "looks_show":
        s.visible = true;
        break;
      case "looks_hide":
        s.visible = false;
        break;

      // --- sound ---
      case "sound_play":
        if (this.audio) this.audio.play(block.getFieldValue("SOUND"));
        break;
      case "sound_play_note": {
        const note = Number(block.getFieldValue("NOTE"));
        const secs = this.evalNum(block, "SECS", ctx);
        if (this.audio) this.audio.playNote(note, secs);
        yield* this.wait(secs);
        break;
      }

      // --- events ---
      case "event_broadcast":
        this.broadcast(block.getFieldValue("MSG") || "");
        break;

      // --- control ---
      case "control_wait":
        yield* this.wait(this.evalNum(block, "SECS", ctx));
        break;
      case "control_repeat": {
        const times = Math.floor(this.evalNum(block, "TIMES", ctx));
        const body = block.getInputTargetBlock("DO");
        for (let i = 0; i < times; i++) {
          yield* this.runStack(body, ctx);
          yield; // one iteration per frame keeps things animated
        }
        break;
      }
      case "control_forever": {
        const body = block.getInputTargetBlock("DO");
        // eslint-disable-next-line no-constant-condition
        while (true) {
          yield* this.runStack(body, ctx);
          yield;
        }
      }
      case "control_if": {
        if (this.evalBool(block, "COND", ctx)) {
          yield* this.runStack(block.getInputTargetBlock("DO"), ctx);
        }
        break;
      }
      case "control_if_else": {
        if (this.evalBool(block, "COND", ctx)) {
          yield* this.runStack(block.getInputTargetBlock("DO"), ctx);
        } else {
          yield* this.runStack(block.getInputTargetBlock("ELSE"), ctx);
        }
        break;
      }
      case "control_repeat_until": {
        const body = block.getInputTargetBlock("DO");
        let guard = 0;
        while (!this.evalBool(block, "COND", ctx)) {
          yield* this.runStack(body, ctx);
          yield;
          if (++guard > 100000) break;
        }
        break;
      }
      case "control_wait_until": {
        while (!this.evalBool(block, "COND", ctx)) yield;
        break;
      }
      case "control_stop": {
        const what = block.getFieldValue("WHAT");
        if (what === "all") {
          this.stop();
          return;
        }
        return; // "this script" — end this thread
      }

      // --- variables (Blockly built-ins) ---
      case "variables_set": {
        const name = varName(block);
        if (name) this.variables[name] = this.evalValue(block, "VALUE", ctx, 0);
        break;
      }
      case "math_change": {
        const name = varName(block);
        if (name)
          this.variables[name] =
            toNum(this.variables[name]) + this.evalNum(block, "DELTA", ctx);
        break;
      }

      default:
        // Unknown / hat blocks reached as statements: ignore.
        break;
    }
  }

  // ---- timed helpers (generators) ---------------------------------------
  *wait(secs) {
    const end = performance.now() + Math.max(0, secs) * 1000;
    while (performance.now() < end) yield;
  }

  *glide(block, ctx) {
    const s = ctx.sprite;
    const secs = Math.max(0, this.evalNum(block, "SECS", ctx));
    const tx = this.evalNum(block, "X", ctx);
    const ty = this.evalNum(block, "Y", ctx);
    const sx = s.x;
    const sy = s.y;
    const start = performance.now();
    const dur = secs * 1000;
    if (dur <= 0) {
      s.x = tx;
      s.y = ty;
      return;
    }
    while (true) {
      const t = Math.min(1, (performance.now() - start) / dur);
      s.x = sx + (tx - sx) * t;
      s.y = sy + (ty - sy) * t;
      if (t >= 1) break;
      yield;
    }
  }

  bounce(s) {
    let bounced = false;
    if (s.x > HALF_W - 10) {
      s.x = HALF_W - 10;
      bounced = true;
    } else if (s.x < -HALF_W + 10) {
      s.x = -HALF_W + 10;
      bounced = true;
    }
    if (bounced) s.direction = wrapDir(-s.direction); // mirror horizontally
    let vbounce = false;
    if (s.y > HALF_H - 10) {
      s.y = HALF_H - 10;
      vbounce = true;
    } else if (s.y < -HALF_H + 10) {
      s.y = -HALF_H + 10;
      vbounce = true;
    }
    if (vbounce) s.direction = wrapDir(180 - s.direction);
  }

  // ---- value evaluation -------------------------------------------------
  evalNum(block, inputName, ctx) {
    return toNum(this.evalValue(block, inputName, ctx, 0));
  }

  evalBool(block, inputName, ctx) {
    return Boolean(this.evalValue(block, inputName, ctx, false));
  }

  evalValue(block, inputName, ctx, dflt) {
    const target = block.getInputTargetBlock(inputName);
    if (!target) return dflt;
    return this.evalReporter(target, ctx);
  }

  evalReporter(block, ctx) {
    const s = ctx.sprite;
    switch (block.type) {
      case "math_number_kid":
        return toNum(block.getFieldValue("NUM"));
      case "text_kid":
        return block.getFieldValue("TEXT");

      case "operator_arithmetic": {
        const a = toNum(this.evalReporterInput(block, "A", ctx, 0));
        const b = toNum(this.evalReporterInput(block, "B", ctx, 0));
        switch (block.getFieldValue("OP")) {
          case "ADD": return a + b;
          case "MINUS": return a - b;
          case "MULTIPLY": return a * b;
          case "DIVIDE": return b === 0 ? 0 : a / b;
          default: return 0;
        }
      }
      case "operator_random": {
        const from = Math.round(toNum(this.evalReporterInput(block, "FROM", ctx, 1)));
        const to = Math.round(toNum(this.evalReporterInput(block, "TO", ctx, 10)));
        const lo = Math.min(from, to);
        const hi = Math.max(from, to);
        return lo + Math.floor(Math.random() * (hi - lo + 1));
      }
      case "operator_compare": {
        const a = this.evalReporterInput(block, "A", ctx, 0);
        const b = this.evalReporterInput(block, "B", ctx, 0);
        const na = Number(a);
        const nb = Number(b);
        const bothNum = Number.isFinite(na) && Number.isFinite(nb) && a !== "" && b !== "";
        const av = bothNum ? na : String(a).toLowerCase();
        const bv = bothNum ? nb : String(b).toLowerCase();
        switch (block.getFieldValue("OP")) {
          case "LT": return av < bv;
          case "GT": return av > bv;
          case "EQ": return av === bv;
          default: return false;
        }
      }
      case "operator_and":
        return (
          Boolean(this.evalReporterInput(block, "A", ctx, false)) &&
          Boolean(this.evalReporterInput(block, "B", ctx, false))
        );
      case "operator_or":
        return (
          Boolean(this.evalReporterInput(block, "A", ctx, false)) ||
          Boolean(this.evalReporterInput(block, "B", ctx, false))
        );
      case "operator_not":
        return !this.evalReporterInput(block, "A", ctx, false);
      case "operator_join":
        return (
          String(this.evalReporterInput(block, "A", ctx, "")) +
          String(this.evalReporterInput(block, "B", ctx, ""))
        );

      // motion reporters
      case "motion_x_position": return Math.round(s.x);
      case "motion_y_position": return Math.round(s.y);
      case "motion_direction": return s.direction;
      case "looks_size": return s.size;

      // sensing
      case "sensing_touching_edge":
        return (
          s.x >= HALF_W - 12 || s.x <= -HALF_W + 12 ||
          s.y >= HALF_H - 12 || s.y <= -HALF_H + 12
        );
      case "sensing_key_pressed":
        return this.input.keys.has(block.getFieldValue("KEY"));
      case "sensing_mouse_x":
        return Math.round(this.input.mouseX);
      case "sensing_mouse_y":
        return Math.round(this.input.mouseY);
      case "sensing_timer":
        return (performance.now() - this.startTime) / 1000;

      case "variables_get": {
        const name = varName(block);
        return name in this.variables ? this.variables[name] : 0;
      }

      default:
        return 0;
    }
  }

  evalReporterInput(block, inputName, ctx, dflt) {
    const target = block.getInputTargetBlock(inputName);
    if (!target) return dflt;
    return this.evalReporter(target, ctx);
  }
}

function wrapDir(d) {
  // Keep direction in (-180, 180] like Scratch.
  let r = ((d + 180) % 360 + 360) % 360 - 180;
  if (r === -180) r = 180;
  return r;
}

function varName(block) {
  const field = block.getField("VAR");
  if (!field) return null;
  try {
    const v = field.getVariable ? field.getVariable() : null;
    if (v && v.name) return v.name;
  } catch {
    /* ignore */
  }
  return field.getText ? field.getText() : null;
}
