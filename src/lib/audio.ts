// Synthesized Audio & Haptics Engine for MotZen (Zero external asset dependencies, zero lag)
// Uses Web Audio API for organic, soothing, marimba-like tones inspired by Words of Wonders

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private hapticsEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setPreferences(sound: boolean, haptics: boolean) {
    this.soundEnabled = sound;
    this.hapticsEnabled = haptics;
  }

  private vibrate(pattern: number | number[]) {
    if (!this.hapticsEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore
    }
  }

  /**
   * Ascending bell/marimba tone as letters are connected
   * Pentatonic scale (C4, D4, E4, G4, A4, C5, D5, E5) so it always sounds harmonious!
   */
  public playLetterTone(index: number) {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate(10); // subtle 10ms haptic tap

    const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    const freq = pentatonicScale[Math.min(index, pentatonicScale.length - 1)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Warm sine wave with subtle triangle overtone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope: quick attack, smooth exponential decay (like a marimba bar)
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  }

  /**
   * Backtracking letter deselect
   */
  public playLetterDeselect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate(8);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  /**
   * Uplifting harp/chime arpeggio when a valid word is found and enters the grid
   */
  public playWordSuccess() {
    this.vibrate([20, 40, 20]);
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Major 7th chord arpeggio: C5, E5, G5, B5
    const chord = [523.25, 659.25, 783.99, 987.77];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.41);
    });
  }

  /**
   * Bonus word sparkle sound
   */
  public playBonusSuccess() {
    this.vibrate([15, 30, 15]);
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // High sparkle shimmer
    const notes = [659.25, 880.00, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.04 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.04);
      osc.stop(ctx.currentTime + i * 0.04 + 0.31);
    });
  }

  /**
   * Gentle soft wooden "thud" for invalid or repeated words
   */
  public playWordError() {
    this.vibrate(35);
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  /**
   * Grand triumphant fanfare when completing a level
   */
  public playVictoryFanfare() {
    this.vibrate([40, 60, 40, 60, 80]);
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Triumphal brass/bell fanfare: G4, C5, E5, G5, C6
    const fanfare = [
      { f: 392.00, t: 0.00, d: 0.15 },
      { f: 523.25, t: 0.15, d: 0.15 },
      { f: 659.25, t: 0.30, d: 0.18 },
      { f: 783.99, t: 0.48, d: 0.22 },
      { f: 1046.50, t: 0.72, d: 0.75 },
    ];

    fanfare.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime + t);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + d + 0.05);
    });
  }

  /**
   * Crispy metallic coin clink
   */
  public playCoinSound() {
    this.vibrate(12);
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  }

  /**
   * Subtle card/letter shuffle whoosh
   */
  public playShuffleSound() {
    this.vibrate(15);
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }
}

export const sound = new SoundEngine();
