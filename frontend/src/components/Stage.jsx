import React, { useEffect, useRef, useState, useCallback } from "react";
import { useStore, COSTUMES, BACKDROPS } from "../store.js";
import { Runtime, STAGE_W, STAGE_H } from "../vm/interpreter.js";
import { AudioEngine } from "../vm/audio.js";
import { paintBackdrop } from "../vm/backdrops.js";
import {
  startVideoRecording,
  encodeGif,
  downloadBlob,
  canRecordVideo,
} from "../vm/recorder.js";

// GIF capture settings (downscaled & capped so files stay small and friendly).
const GIF_W = 320;
const GIF_H = 240;
const GIF_FPS = 12;
const GIF_MAX_SECONDS = 12;

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

  // recording
  const [rec, setRec] = useState({ state: "idle", format: null, elapsed: 0, progress: 0 });
  const [recMenu, setRecMenu] = useState(false);
  const videoRecRef = useRef(null);
  const gifFramesRef = useRef([]);
  const gifCanvasRef = useRef(null);
  const recTimersRef = useRef({ tick: null, capture: null });

  const running = useStore((s) => s.running);
  const setRunning = useStore((s) => s.setRunning);
  const backdrop = useStore((s) => s.backdrop);
  const updateSprite = useStore((s) => s.updateSprite);
  const showToast = useStore((s) => s.showToast);

  if (!audioRef.current) audioRef.current = new AudioEngine();

  // ---- drawing ----------------------------------------------------------
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const state = useStore.getState();
    const bId = liveRef.current?.backdrop || state.backdrop;
    paintBackdrop(ctx, bId, STAGE_W, STAGE_H);

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

  // ---- recording --------------------------------------------------------
  const clearRecTimers = () => {
    if (recTimersRef.current.tick) clearInterval(recTimersRef.current.tick);
    if (recTimersRef.current.capture) clearInterval(recTimersRef.current.capture);
    recTimersRef.current = { tick: null, capture: null };
  };
  const projectFileName = () =>
    (useStore.getState().projectName || "my-animation").replace(/[^\w-]+/g, "_") || "my-animation";

  const finishGif = useCallback(async () => {
    clearRecTimers();
    const frames = gifFramesRef.current;
    if (!frames.length) {
      setRec({ state: "idle", format: null, elapsed: 0, progress: 0 });
      return;
    }
    setRec((r) => ({ ...r, state: "encoding", progress: 0 }));
    try {
      const blob = await encodeGif(frames, GIF_W, GIF_H, Math.round(1000 / GIF_FPS), (p) =>
        setRec((r) => ({ ...r, progress: p }))
      );
      downloadBlob(blob, `${projectFileName()}.gif`);
      showToast("GIF saved! 🎞️", "success");
    } catch (e) {
      console.error("GIF encode failed", e);
      showToast("Could not make the GIF 😢", "error");
    }
    gifFramesRef.current = [];
    setRec({ state: "idle", format: null, elapsed: 0, progress: 0 });
  }, [showToast]);

  const finishVideo = useCallback(async () => {
    clearRecTimers();
    const ctrl = videoRecRef.current;
    videoRecRef.current = null;
    if (!ctrl) {
      setRec({ state: "idle", format: null, elapsed: 0, progress: 0 });
      return;
    }
    try {
      const { blob, ext } = await ctrl.stop();
      downloadBlob(blob, `${projectFileName()}.${ext}`);
      showToast("Video saved! 🎬", "success");
    } catch (e) {
      console.error("Video save failed", e);
      showToast("Could not make the video 😢", "error");
    }
    setRec({ state: "idle", format: null, elapsed: 0, progress: 0 });
  }, [showToast]);

  const stopRecording = () => {
    if (rec.format === "gif") finishGif();
    else if (rec.format === "video") finishVideo();
  };

  const startRecording = (format) => {
    setRecMenu(false);
    if (rec.state !== "idle") return;
    audioRef.current.ensure();
    setRunning(true); // make sure the animation is playing while we record

    if (format === "video") {
      if (!canRecordVideo(canvasRef.current)) {
        showToast("Video isn't supported in this browser — try GIF!", "error");
        return;
      }
      videoRecRef.current = startVideoRecording(canvasRef.current, 30);
    } else {
      gifFramesRef.current = [];
      if (!gifCanvasRef.current) {
        const c = document.createElement("canvas");
        c.width = GIF_W;
        c.height = GIF_H;
        gifCanvasRef.current = c;
      }
      const gctx = gifCanvasRef.current.getContext("2d", { willReadFrequently: true });
      recTimersRef.current.capture = setInterval(() => {
        if (!canvasRef.current) return;
        gctx.drawImage(canvasRef.current, 0, 0, GIF_W, GIF_H);
        gifFramesRef.current.push(gctx.getImageData(0, 0, GIF_W, GIF_H).data);
      }, Math.round(1000 / GIF_FPS));
    }

    const startedAt = Date.now();
    setRec({ state: "recording", format, elapsed: 0, progress: 0 });
    recTimersRef.current.tick = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      setRec((r) => (r.state === "recording" ? { ...r, elapsed } : r));
      if (format === "gif" && elapsed >= GIF_MAX_SECONDS) finishGif();
    }, 200);
  };

  // Tidy up timers if the stage unmounts mid-recording.
  useEffect(() => () => clearRecTimers(), []);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
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
        {rec.state === "recording" && (
          <div className="rec-badge">
            <span className="rec-dot" /> REC {fmtTime(rec.elapsed)}
          </div>
        )}
        {rec.state === "encoding" && (
          <div className="rec-encoding">
            <div className="rec-spinner">🎞️</div>
            <div>Making your GIF… {Math.round(rec.progress * 100)}%</div>
            <div className="rec-progress">
              <span style={{ width: `${Math.round(rec.progress * 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      <p className="stage-hint">
        {rec.state === "recording"
          ? `🎥 Recording your ${rec.format === "gif" ? "GIF" : "video"}…`
          : running
          ? "🎮 Playing! Use your keyboard & click sprites."
          : "💡 Tip: drag a sprite to move it. Press Go! to play."}
      </p>

      <div className="record-bar">
        {rec.state === "idle" && (
          <div className="dropdown">
            <button className="movie-btn" onClick={() => setRecMenu((v) => !v)}>
              🎬 Make a Movie ▾
            </button>
            {recMenu && (
              <div className="dropdown-menu up" onMouseLeave={() => setRecMenu(false)}>
                <button onClick={() => startRecording("gif")}>
                  🎞️ Record GIF <small>· max {GIF_MAX_SECONDS}s</small>
                </button>
                <button onClick={() => startRecording("video")}>
                  🎬 Record Video <small>· longer clips</small>
                </button>
              </div>
            )}
          </div>
        )}
        {rec.state === "recording" && (
          <button className="movie-btn rec" onClick={stopRecording}>
            ⏹ Stop &amp; Save {rec.format === "gif" ? "GIF" : "Video"}
          </button>
        )}
        {rec.state === "encoding" && (
          <button className="movie-btn" disabled>
            ⏳ Saving GIF… {Math.round(rec.progress * 100)}%
          </button>
        )}
      </div>
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
