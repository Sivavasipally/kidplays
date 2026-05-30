// Paints each backdrop directly onto the stage canvas. This keeps the canvas
// self-contained, so video/GIF recordings capture the backdrop too (a CSS
// background on the wrapper would be invisible to canvas capture).

export function paintBackdrop(ctx, id, w, h) {
  switch (id) {
    case "sky": {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#aee9ff");
      g.addColorStop(1, "#e9fbff");
      ctx.fillStyle = g;
      break;
    }
    case "grass": {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#bff0ff");
      g.addColorStop(0.55, "#bff0ff");
      g.addColorStop(0.55, "#8fe388");
      g.addColorStop(1, "#8fe388");
      ctx.fillStyle = g;
      break;
    }
    case "space": {
      const g = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w * 0.3, h * 0.2, Math.max(w, h));
      g.addColorStop(0, "#3a2a6b");
      g.addColorStop(0.7, "#10072e");
      g.addColorStop(1, "#10072e");
      ctx.fillStyle = g;
      break;
    }
    case "sunset": {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#ff9a8b");
      g.addColorStop(1, "#ffd36e");
      ctx.fillStyle = g;
      break;
    }
    case "ocean": {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#2bc0e4");
      g.addColorStop(1, "#114357");
      ctx.fillStyle = g;
      break;
    }
    case "white":
    default:
      ctx.fillStyle = "#ffffff";
      break;
  }
  ctx.fillRect(0, 0, w, h);
}
