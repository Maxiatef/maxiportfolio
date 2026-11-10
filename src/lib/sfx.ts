// Tiny square-wave synth for 8-bit blips. Muted until the visitor turns SFX on.
let ctx: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

export const sfx = {
  get on() {
    return enabled;
  },
  toggle() {
    enabled = !enabled;
    if (enabled && !ctx) ctx = new AudioContext();
    listeners.forEach((l) => l(enabled));
    if (enabled) sfx.coin();
  },
  subscribe(l: (on: boolean) => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
  tone(freqs: number[], step = 0.06, type: OscillatorType = 'square', vol = 0.05) {
    if (!enabled || !ctx) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    freqs.forEach((f, i) => osc.frequency.setValueAtTime(f, t0 + i * step));
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + freqs.length * step + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + freqs.length * step + 0.06);
  },
  blip() {
    sfx.tone([880], 0.03, 'square', 0.025);
  },
  select() {
    sfx.tone([523, 784], 0.05);
  },
  coin() {
    sfx.tone([988, 1319], 0.08);
  },
  powerUp() {
    sfx.tone([392, 523, 659, 784, 1047, 1319], 0.06);
  },
};
