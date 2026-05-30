// gifenc ships as CommonJS; default-import then destructure so this works
// identically under Vite and plain Node.
import gifenc from "gifenc";
const { GIFEncoder, quantize, applyPalette } = gifenc;

// ---------------------------------------------------------------------------
// Stage recording helpers — turn a kid's animation into a shareable file.
//  • Video: real-time capture of the canvas via MediaRecorder (MP4 where the
//    browser supports it, otherwise WebM).
//  • GIF: capture downscaled frames while playing, then encode with gifenc.
// Everything runs locally in the browser — no uploads.
// ---------------------------------------------------------------------------

// Pick the best video container/codec this browser can record.
export function pickVideoMime() {
  const candidates = [
    "video/mp4;codecs=avc1.42E01E",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  if (typeof MediaRecorder === "undefined") return null;
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || "video/webm";
}

export function canRecordVideo(canvas) {
  return (
    typeof MediaRecorder !== "undefined" &&
    canvas &&
    typeof canvas.captureStream === "function" &&
    !!pickVideoMime()
  );
}

/** Start recording a canvas to video. Returns a controller with stop(). */
export function startVideoRecording(canvas, fps = 30) {
  const mime = pickVideoMime();
  const stream = canvas.captureStream(fps);
  const rec = new MediaRecorder(stream, {
    mimeType: mime,
    videoBitsPerSecond: 6_000_000,
  });
  const chunks = [];
  rec.ondataavailable = (e) => {
    if (e.data && e.data.size) chunks.push(e.data);
  };
  rec.start(100);

  return {
    stop: () =>
      new Promise((resolve) => {
        rec.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          resolve({
            blob: new Blob(chunks, { type: mime }),
            ext: mime.includes("mp4") ? "mp4" : "webm",
          });
        };
        rec.stop();
      }),
  };
}

/**
 * Encode captured frames into a GIF, yielding to the UI between frames so the
 * page never freezes. `frames` is an array of Uint8ClampedArray (RGBA).
 */
export async function encodeGif(frames, width, height, delay, onProgress) {
  const gif = GIFEncoder();
  for (let i = 0; i < frames.length; i++) {
    const data = frames[i];
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    gif.writeFrame(index, width, height, { palette, delay });
    if (onProgress) onProgress((i + 1) / frames.length);
    // Let the browser breathe (keeps the progress bar smooth).
    await new Promise((r) => setTimeout(r, 0));
  }
  gif.finish();
  return new Blob([gif.bytes()], { type: "image/gif" });
}

/** Trigger a browser download for a blob. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
