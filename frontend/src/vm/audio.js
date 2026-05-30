// ---------------------------------------------------------------------------
// KidPlays audio — fun sound effects synthesized with the Web Audio API.
// No sound files needed; everything is generated on the fly so it works
// fully offline.
// ---------------------------------------------------------------------------

export class AudioEngine {
  constructor() {
    this.ctx = null;
  }

  ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctx();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  // Generic tone helper.
  tone(freq, dur, type = "sine", gainVal = 0.18, when = 0, glideTo = null) {
    const ctx = this.ensure();
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainVal, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  noise(dur, gainVal = 0.2) {
    const ctx = this.ensure();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(gain).connect(ctx.destination);
    src.start();
  }

  play(name) {
    switch (name) {
      case "meow":
        this.tone(620, 0.18, "sawtooth", 0.14, 0, 380);
        this.tone(400, 0.22, "sine", 0.12, 0.16, 520);
        break;
      case "beep":
        this.tone(880, 0.12, "square", 0.12);
        break;
      case "boop":
        this.tone(220, 0.18, "square", 0.14);
        break;
      case "pop":
        this.tone(500, 0.06, "sine", 0.2, 0, 900);
        break;
      case "drum":
        this.tone(120, 0.18, "sine", 0.25, 0, 60);
        this.noise(0.1, 0.12);
        break;
      case "laser":
        this.tone(1200, 0.25, "sawtooth", 0.12, 0, 200);
        break;
      case "coin":
        this.tone(988, 0.08, "square", 0.14);
        this.tone(1319, 0.18, "square", 0.14, 0.08);
        break;
      case "jump":
        this.tone(300, 0.16, "square", 0.14, 0, 760);
        break;
      default:
        this.tone(660, 0.12, "sine");
    }
  }

  // MIDI note number → frequency, played for `secs`.
  playNote(midi, secs) {
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    this.tone(freq, Math.max(0.05, secs), "triangle", 0.18);
  }
}
