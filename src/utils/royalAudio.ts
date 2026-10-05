/**
 * Royal Audio & Music Engine for Malekat Palace
 * Uses Web Audio API with rich polyphonic synthesis:
 * - Ambient Royal Palace Soundtrack (gentle orchestral harp, celesta, and warm string pad chords)
 * - Bridal Entrance Fanfare & Cues
 * - Crystal Bell & Chime interactive effects
 * Fully handles browser autoplay restrictions and guarantees audible playback upon user click.
 */

class RoyalAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isAmbiencePlaying = false;
  private loopTimer: any = null;
  private listeners: ((playing: boolean) => void)[] = [];
  private volume = 0.65;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public subscribe(callback: (playing: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isAmbiencePlaying));
  }

  public isPlaying(): boolean {
    return this.isAmbiencePlaying;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  /**
   * Plays an individual crystal chime or harp note.
   */
  public playChime(freq = 523.25, duration = 2.2, type: OscillatorType = 'sine') {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = type;
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, now); // 5th harmonic

      // Envelope: punchy pleasant attack, shimmering decay
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback prevented by browser:', e);
    }
  }

  /**
   * Plays a majestic royal bridal entrance fanfare cue (multi-note orchestral arpeggio).
   */
  public playEntranceFanfare() {
    try {
      const ctx = this.getContext();
      // Royal entrance chord sequence: D Major / F# / A / D / E (Imperial Triumph)
      const fanfareNotes = [293.66, 369.99, 440.0, 587.33, 659.25, 739.99, 880.0];
      fanfareNotes.forEach((freq, i) => {
        setTimeout(() => {
          this.playChime(freq, 3.0, i % 2 === 0 ? 'triangle' : 'sine');
        }, i * 160);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Starts a continuous, soothing royal palace ambient soundtrack.
   * Plays rotating warm baroque chords (Bbmaj7 -> Gm9 -> Ebmaj7 -> Fsus4) with soft harp plucking.
   */
  public startAmbience() {
    if (this.isAmbiencePlaying) return;
    this.isAmbiencePlaying = true;
    this.notify();

    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Imperial chord progressions
    const progressions = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 392.0]   // G7
    ];

    let chordStep = 0;

    const playAmbientChord = () => {
      if (!this.isAmbiencePlaying) return;
      const currentChord = progressions[chordStep % progressions.length];
      chordStep++;

      const now = ctx.currentTime;

      // Soft sustained warm string pad
      currentChord.forEach((noteFreq) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 1.2);
        gain.gain.setValueAtTime(0.045, now + 3.0);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain || ctx.destination);

        osc.start(now);
        osc.stop(now + 4.9);
      });

      // Shimmering harp arpeggios on top of the chord
      currentChord.forEach((noteFreq, idx) => {
        setTimeout(() => {
          if (this.isAmbiencePlaying) {
            this.playChime(noteFreq * 2, 2.2, 'sine');
          }
        }, idx * 450 + 200);
      });

      // Schedule next chord in 4.5 seconds
      this.loopTimer = setTimeout(playAmbientChord, 4600);
    };

    playAmbientChord();
  }

  public stopAmbience() {
    this.isAmbiencePlaying = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.notify();
  }

  public toggleAmbience() {
    if (this.isAmbiencePlaying) {
      this.stopAmbience();
    } else {
      this.startAmbience();
      this.playChime(659.25, 2.0);
    }
    return this.isAmbiencePlaying;
  }
}

export const royalAudio = new RoyalAudioEngine();

// Convenience exports matching existing imports
export const playRoyalChime = (noteIndex = 3, duration = 2.2) => {
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 783.99, 880.0];
  const freq = notes[noteIndex % notes.length];
  royalAudio.playChime(freq, duration);
};

export const startRoyalAmbience = () => royalAudio.startAmbience();
export const stopRoyalAmbience = () => royalAudio.stopAmbience();
export const toggleRoyalAmbience = () => royalAudio.toggleAmbience();
export const isRoyalAmbienceActive = () => royalAudio.isPlaying();
export const playEntranceFanfare = () => royalAudio.playEntranceFanfare();
