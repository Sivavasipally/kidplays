import React, { useEffect, useRef, useCallback } from "react";
import { useStore, COSTUMES, BACKDROPS } from "../store.js";
import { Runtime, STAGE_W, STAGE_H } from "../vm/interpreter.js";
import { AudioEngine } from "../vm/audio.js";

const emojiFor = (id) => COSTUMES.find((c) => c.id === id)?.emoji || "🐱";
const backdropCss = (id) => BACKDROPS.find((b) => b.id === id)?.css || "#fff";

const KEY_MAP = {
  " ": "space",
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};
function normKey(e) {
  if (KEY_MAP[e.key]) return KEY_MAP[e.key];
  if (e.key.length === 1) return e.key.toLowerCase();
  return null;
}

export default function Stage() {
  const canvasRef = useRef(null);
  const runtimeRef = useRef(null);
  const audioRef = useRef(null);
  const inputRef = useRef({ keys: new Set(), mouseX: 0, mouseY: 0, isMouseDown: false });
  const liveRef = useRef(null); // latest runtime snapshot while running
  const draggingRef = useRef(null);

  const running = useStore((s) => s.running);
  const setRunning = useStore((s) => s.setRunning);
  const backdrop = useStore((s) => s.backdrop);
  const updateSprite = useStore((s) => s.updateSprite);

  if (!audioRef.current) audioRef.current = new AudioEngine();

  // ---- drawing ----------------------------------------------------------
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, STAGE_W, STAGE_H);

    const state = useStore.getState();
    const sprites = liveRef.current
      ? liveRef.current.sprites
      : state.sprites.map((s) => ({ ...s, say: "" }));

    for (const s of sprites) {
      if (!s.visible) continue;
      const sx = STAGE_W / 2 + s.x;
      const sy = STAGE_H / 2 - s.y;
      const fontSize = 46 * (s.size / 100);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(((s.direction - 90) * Math.PI) / 180);
      ctx.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emojiFor(s.costume), 0, 0);
      ctx.restore();

      if (s.say) drawBubble(ctx, sx, sy - fontSize / 2 - 6, s.say, s.sayKind);
    }
  }, []);

  // Redraw static scene whenever sprites/backdrop change and not running.
  useEffect(() => {
    if (!running) {
      liveRef.current = null;
      draw();
    }
  }, [running, draw, backdrop]);

  // Subscribe so edits to sprite position/costume reflect immediately.
  useEffect(() => {
    const unsub = useStore.subscribe(() => {
      if (!useStore.getState().running) draw();
    });
    return unsub;
  }, [draw]);

  // ---- run / stop -------------------------------------------------------
  useEffect(() => {
    if (running) {
      audioRef.current.ensure();
      const state = useStore.getState();
      const rt = new Runtime({
        sprites: state.sprites,
        backdrop: state.backdrop,
        audio: audioRef.current,
        input: inputRef.current,
        onRender: (snap) => {
          liveRef.current = snap;
          draw();
        },
        onStop: () => {
          // Runtime asked to stop (e.g. "stop all" block).
          if (useStore.getState().running) setRunning(false);
        },
      });
      runtimeRef.current = rt;
      rt.greenFlag();
      return () => {
        rt.dispose();
        runtimeRef.current = null;
        liveRef.current = null;
        draw();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // ---- keyboard ---------------------------------------------------------
  useEffect(() => {
    const onDown = (e) => {
      const k = normKey(e);
      if (!k) return;
      if (["space", "up", "down", "left", "right"].includes(k)) {
        // Avoid scrolling the page while playing.
        if (document.activeElement === document.body || running) e.preventDefault();
      }
      if (!inputRef.current.keys.has(k)) {
        inputRef.current.keys.add(k);
        if (runtimeRef.current) runtimeRef.current.keyPressed(k);
      }
    };
    const onUp = (e) => {
      const k = normKey(e);
      if (k) inputRef.current.keys.delete(k);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [running]);

  // ---- mouse ------------------------------------------------------------
  const toWorld = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * STAGE_W;
    const py = ((e.clientY - rect.top) / rect.height) * STAGE_H;
    return { x: px - STAGE_W / 2, y: STAGE_H / 2 - py };
  };

  const hitSprite = (wx, wy) => {
    const sprites = liveRef.current ? liveRef.current.sprites : useStore.getState().sprites;
    for (let i = sprites.length - 1; i >= 0; i--) {
      const s = sprites[i];
      if (!s.visible) continue;
      const r = 26 * (s.size / 100) + 6;
      if (Math.abs(wx - s.x) <= r && Math.abs(wy - s.y) <= r) return s;
    }
    return null;
  };

  const onPointerMove = (e) => {
    const w = toWorld(e);
    inputRef.current.mouseX = w.x;
    inputRef.current.mouseY = w.y;
    if (draggingRef.current && !running) {
      updateSprite(draggingRef.current, { x: Math.round(w.x), y: Math.round(w.y) });
    }
  };

  const onPointerDown = (e) => {
    audioRef.current.ensure();
    const w = toWorld(e);
    const hit = hitSprite(w.x, w.y);
    if (running) {
      if (hit && runtimeRef.current) runtimeRef.current.spriteClicked(hit.id);
    } else if (hit) {
      draggingRef.current = hit.id;
      useStore.getState().selectSprite(hit.id);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
  };

  const onPointerUp = () => {
    draggingRef.current = null;
  };

  return (
    <div className="stage-wrap">
      <div className="stage-frame" style={{ background: backdropCss(backdrop) }}>
        <canvas
          ref={canvasRef}
          width={STAGE_W}
          height={STAGE_H}
          className="stage-canvas"
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ cursor: running ? "pointer" : "grab" }}
        />
      </div>
      <p className="stage-hint">
        {running
          ? "🎮 Playing! Use your keyboard & click sprites."
          : "💡 Tip: drag a sprite to move it. Press Go! to play."}
      </p>
    </div>
  );
}

// Rounded speech / thought bubble.
function drawBubble(ctx, x, y, text, kind) {
  const str = String(text).slice(0, 60);
  ctx.font = '600 15px "Baloo 2", system-ui, sans-serif';
  const tw = Math.min(180, ctx.measureText(str).width);
  const padX = 12;
  const padY = 8;
  const w = tw + padX * 2;
  const h = 30;
  let bx = x - w / 2;
  let by = y - h - 12;
  bx = Math.max(4, Math.min(STAGE_W - w - 4, bx));
  by = Math.max(4, by);

  ctx.fillStyle = "rgba(255,255,255,0.97)";
  ctx.strokeStyle = "#c7d2fe";
  ctx.lineWidth = 2;
  roundRect(ctx, bx, by, w, h, 12);
  ctx.fill();
  ctx.stroke();

  // little tail / thought dots
  ctx.fillStyle = "rgba(255,255,255,0.97)";
  if (kind === "think") {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x - 6 + i * 6, by + h + 4 + i * 5, 4 - i, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(x - 6, by + h - 2);
    ctx.lineTo(x, by + h + 10);
    ctx.lineTo(x + 8, by + h - 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#1e293b";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(str, bx + padX, by + h / 2, tw);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
