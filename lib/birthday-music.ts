class BirthdayMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlayingLoop = false;
  private loopTimer: number | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    gainPeak = 0.08,
    delay = 0,
    slideToFreq?: number
  ) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideToFreq), now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public startAlways() {
    this.ensureContext();
    if (this.isPlayingLoop) return;
    this.isPlayingLoop = true;

    const notes = [
      { f: 392.0, d: 0.35 },
      { f: 392.0, d: 0.35 },
      { f: 440.0, d: 0.65 },
      { f: 392.0, d: 0.65 },
      { f: 523.25, d: 0.65 },
      { f: 493.88, d: 1.1 },
      { f: 392.0, d: 0.35 },
      { f: 392.0, d: 0.35 },
      { f: 440.0, d: 0.65 },
      { f: 392.0, d: 0.65 },
      { f: 587.33, d: 0.65 },
      { f: 523.25, d: 1.2 },
    ];

    let step = 0;
    const tick = () => {
      if (!this.isPlayingLoop) return;
      const n = notes[step % notes.length];
      this.playTone(n.f, n.d * 0.9, "triangle", 0.032, 0);
      step++;
      this.loopTimer = window.setTimeout(tick, n.d * 1000);
    };
    tick();
  }

  public playKeyTap() {
    this.playTone(660, 0.08, "sine", 0.05, 0, 820);
  }

  public playWrongPasscode() {
    this.playTone(220, 0.16, "sawtooth", 0.06, 0, 165);
    this.playTone(175, 0.22, "sawtooth", 0.06, 0.12, 130);
  }

  public playUnlockSuccess() {
    this.playTone(523.25, 0.18, "triangle", 0.08, 0);
    this.playTone(659.25, 0.18, "triangle", 0.08, 0.09);
    this.playTone(783.99, 0.22, "triangle", 0.09, 0.18);
    this.playTone(1046.5, 0.45, "sine", 0.09, 0.28);
  }

  public playStardustTap() {
    const base = 700 + Math.random() * 450;
    this.playTone(base, 0.14, "sine", 0.035, 0, base * 1.25);
  }

  public playMemoryOpen(index: number) {
    const scale = [523.25, 587.33, 659.25, 783.99];
    const root = scale[index % scale.length];
    this.playTone(root, 0.25, "sine", 0.07, 0);
    this.playTone(root * 1.25, 0.35, "triangle", 0.05, 0.08);
  }

  public playConstellationConnect() {
    this.playTone(587.33, 0.16, "triangle", 0.065, 0);
    this.playTone(880.0, 0.32, "sine", 0.07, 0.1);
  }

  public playCakeReveal() {
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((f, idx) => {
      this.playTone(f, 0.65, "triangle", 0.065, idx * 0.11);
    });
  }

  public playFinaleChime() {
    this.playTone(783.99, 0.35, "sine", 0.07, 0);
    this.playTone(987.77, 0.35, "sine", 0.07, 0.12);
    this.playTone(1174.66, 0.65, "triangle", 0.08, 0.24);
  }

  public playLetterOpen() {
    this.playTone(440, 0.22, "sine", 0.06, 0);
    this.playTone(554.37, 0.28, "sine", 0.06, 0.1);
    this.playTone(659.25, 0.45, "triangle", 0.065, 0.2);
  }
}

export const birthdayMusic = new BirthdayMusicEngine();