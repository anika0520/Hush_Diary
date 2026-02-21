// ============================================================
//  HUSHDIARY — Ambient Music Engine
//  Generative piano chords + melody with reverb
// ============================================================

class AmbientEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.rv = null;
    this.on = false;
    this.ci = null; // chord interval
    this.mi = null; // melody interval
    this.ci2 = 0; // chord index
    this.mi2 = 0; // melody index
  }

  _buildReverb() {
    const len = this.ctx.sampleRate * 4;
    const buf = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
      }
    }
    const conv = this.ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  _tone(freq, type, gain, attack, sustain, release, delay = 0) {
    if (!this.ctx || !this.on) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gn = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gn.gain.setValueAtTime(0, now);
    gn.gain.linearRampToValueAtTime(gain, now + attack);
    gn.gain.setValueAtTime(gain, now + attack + sustain);
    gn.gain.exponentialRampToValueAtTime(
      0.0001,
      now + attack + sustain + release,
    );
    osc.connect(gn);
    gn.connect(this.rv);
    gn.connect(this.master);
    osc.start(now);
    osc.stop(now + attack + sustain + release + 0.1);
  }

  _playChord() {
    if (!this.on) return;
    const BASE = 261.63; // C4
    const PROGRESSIONS = [
      [1, 1.26, 1.5, 2], // C major
      [1.12, 1.41, 1.68, 2.24], // D minor
      [1.19, 1.5, 1.78, 2.38], // E minor
      [1, 1.33, 1.68, 2], // F major
    ];
    const prog = PROGRESSIONS[this.ci2++ % PROGRESSIONS.length];
    prog.forEach((ratio, i) => {
      this._tone((BASE * ratio) / 2, "sine", 0.065, 1, 4.5, 2.5, i * 0.13);
    });
  }

  _playMelody() {
    if (!this.on) return;
    const NOTES = [523, 587, 659, 698, 784, 880, 988, 1047];
    const PATTERN = [0, 2, 4, 2, 5, 4, 2, 0, 3, 2, 4, 0];
    const noteIdx = PATTERN[this.mi2++ % PATTERN.length];
    this._tone(NOTES[noteIdx], "triangle", 0.032, 0.08, 0.18, 0.5);
  }

  start() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
      this.rv = this._buildReverb();
      this.rv.connect(this.master);
      this.on = true;
      this.master.gain.linearRampToValueAtTime(0.55, this.ctx.currentTime + 2);
      // Start chord loop
      this._playChord();
      this.ci = setInterval(() => this._playChord(), 6500);
      // Start melody with slight delay
      setTimeout(() => {
        this._playMelody();
        this.mi = setInterval(() => this._playMelody(), 870);
      }, 1100);
      return true;
    } catch (e) {
      console.warn("AudioContext failed:", e);
      return false;
    }
  }

  stop() {
    this.on = false;
    clearInterval(this.ci);
    clearInterval(this.mi);
    if (this.master) {
      try {
        this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      } catch {}
    }
    setTimeout(() => {
      try {
        if (this.ctx && this.ctx.state !== "closed") {
          this.ctx.close();
        }
        this.ctx = null;
      } catch {}
      this.ctx = null;
      this.master = null;
      this.rv = null;
    }, 1200);
  }

  toggle() {
    if (this.on) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }

  get isPlaying() {
    return this.on;
  }
}

// Singleton
const ambientEngine = new AmbientEngine();
export default ambientEngine;
