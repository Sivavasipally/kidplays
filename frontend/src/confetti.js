// ---------------------------------------------------------------------------
// Tiny dependency-free confetti burst for moments of joy (Save, Go!).
// Pure DOM + CSS so it works everywhere and respects reduced-motion.
// ---------------------------------------------------------------------------

const COLORS = ["#7c5cff", "#ff6ec7", "#34d399", "#22d3ee", "#fbbf24", "#fb7185", "#a78bfa"];
const SHAPES = ["square", "circle", "triangle"];

const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Pop a confetti burst from a point on screen.
 * @param {number} x  client X (defaults to screen center)
 * @param {number} y  client Y
 * @param {number} count  number of pieces
 */
export function celebrate(x, y, count = 90) {
  if (prefersReducedMotion()) return;
  if (x == null) x = window.innerWidth / 2;
  if (y == null) y = window.innerHeight / 3;

  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  document.body.appendChild(layer);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    const shape = SHAPES[(Math.random() * SHAPES.length) | 0];
    piece.className = `confetti-piece ${shape}`;

    const angle = Math.random() * Math.PI * 2;
    const power = 80 + Math.random() * 220;
    const tx = Math.cos(angle) * power;
    const ty = Math.sin(angle) * power - (120 + Math.random() * 160); // bias upward
    const rot = (Math.random() * 720 - 360) | 0;
    const dur = 900 + Math.random() * 900;
    const size = 7 + Math.random() * 9;
    const color = COLORS[(Math.random() * COLORS.length) | 0];

    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.setProperty("--tx", `${tx}px`);
    piece.style.setProperty("--ty", `${ty}px`);
    piece.style.setProperty("--rot", `${rot}deg`);
    piece.style.setProperty("--dur", `${dur}ms`);
    piece.style.width = `${size}px`;
    piece.style.height = `${shape === "triangle" ? 0 : size}px`;
    if (shape === "triangle") {
      piece.style.borderBottomColor = color;
      piece.style.setProperty("--tri", `${size}px`);
    } else {
      piece.style.background = color;
    }
    layer.appendChild(piece);
  }

  setTimeout(() => layer.remove(), 2000);
}

/** Burst centered on a DOM element (e.g. the button that was clicked). */
export function celebrateFrom(el, count) {
  if (!el) return celebrate();
  const r = el.getBoundingClientRect();
  celebrate(r.left + r.width / 2, r.top + r.height / 2, count);
}
