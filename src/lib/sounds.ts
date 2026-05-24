let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.25) {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch { /* silent fail */ }
}

export const sounds = {
  correct: () => { tone(523, 0.08); setTimeout(() => tone(659, 0.08), 90); setTimeout(() => tone(784, 0.15), 180); },
  wrong: () => { tone(300, 0.1, "sawtooth", 0.2); setTimeout(() => tone(240, 0.15, "sawtooth", 0.15), 110); },
  flip: () => tone(900, 0.04, "sine", 0.12),
  click: () => tone(700, 0.03, "sine", 0.08),
  badge: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.18), i * 110)); },
  streak: () => { [440, 554, 659].forEach((f, i) => setTimeout(() => tone(f, 0.12), i * 100)); },
  levelUp: () => { [523, 659, 784, 880, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.15), i * 90)); },
};
