/**
 * Nostalgic Audio Synthesizer utilizing Web Audio API
 * Generates vintage cassette mechanical clicks, acoustic note plucks,
 * realistic tape hiss/vinyl crackle, and soothing monsoon rain soundscapes.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;
  private tapeHissGain: GainNode | null = null;
  private tapeHissNode: AudioNode | null = null;
  private isAmbienceRunning = false;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play realistic mechanical cassette deck latch click
   */
  public playCassetteClick(type: 'press' | 'eject' | 'clack' = 'press'): void {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Primary click transient
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(type === 'eject' ? 650 : 1200, now);
      filter.Q.setValueAtTime(3.5, now);

      osc.type = 'square';
      osc.frequency.setValueAtTime(type === 'eject' ? 140 : 280, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);

      // Secondary spring resonance
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(type === 'eject' ? 180 : 350, now + 0.015);
      osc2.frequency.exponentialRampToValueAtTime(80, now + 0.07);

      gain2.gain.setValueAtTime(0.2, now + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.015);
      osc2.stop(now + 0.085);
    } catch {
      // Audio context might fail on un-interacted policy
    }
  }

  /**
   * Tape fast rewind whir sound
   */
  public playRewindWhir(): void {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.linearRampToValueAtTime(2400, now + 0.4);
      filter.frequency.linearRampToValueAtTime(300, now + 0.8);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.4);
      osc.frequency.linearRampToValueAtTime(60, now + 0.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.86);
    } catch {}
  }

  /**
   * Tape fast forward whir sound
   */
  public playFastForwardWhir(): void {
    this.playRewindWhir();
  }

  /**
   * Play warm acoustic plucked guitar/kalimba string note
   */
  public playAcousticNote(frequency: number, duration = 1.6): void {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Fundamental oscillator
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);

      // Harmonic overtone for woody warmth
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2, now);

      // Attack transient (pluck click)
      const pluck = ctx.createOscillator();
      pluck.type = 'square';
      pluck.frequency.setValueAtTime(frequency * 4, now);

      const mainGain = ctx.createGain();
      const overtoneGain = ctx.createGain();
      const pluckGain = ctx.createGain();
      const masterGain = ctx.createGain();

      // Pluck envelope
      pluckGain.gain.setValueAtTime(0.15, now);
      pluckGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      // Overtone envelope
      overtoneGain.gain.setValueAtTime(0.2, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + (duration * 0.5));

      // Main note envelope (plucked decay)
      mainGain.gain.setValueAtTime(0.35, now);
      mainGain.gain.exponentialRampToValueAtTime(0.1, now + 0.3);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Low pass filter for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + duration);

      osc.connect(mainGain);
      osc2.connect(overtoneGain);
      pluck.connect(pluckGain);

      mainGain.connect(filter);
      overtoneGain.connect(filter);
      pluckGain.connect(filter);

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      pluck.start(now);

      osc.stop(now + duration);
      osc2.stop(now + duration);
      pluck.stop(now + 0.04);
    } catch {}
  }

  /**
   * Play pen ink writing scratch sound
   */
  public playPenScratch(): void {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(4.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
    } catch {}
  }

  /**
   * Nostalgic musical chime
   */
  public playNostalgiaChime(): void {
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playAcousticNote(freq, 1.4);
        }, idx * 75);
      });
    } catch {}
  }

  /**
   * Start / Adjust Ambient Sound Generator (Rain & Tape Hiss)
   */
  public updateAmbience(rainVol: number, tapeHissVol: number): void {
    try {
      const ctx = this.initContext();

      if (!this.isAmbienceRunning) {
        this.setupRainGenerator(ctx);
        this.setupTapeHissGenerator(ctx);
        this.isAmbienceRunning = true;
      }

      const now = ctx.currentTime;
      if (this.rainGain) {
        this.rainGain.gain.setTargetAtTime(Math.max(0, Math.min(1, rainVol * 0.35)), now, 0.1);
      }
      if (this.tapeHissGain) {
        this.tapeHissGain.gain.setTargetAtTime(Math.max(0, Math.min(1, tapeHissVol * 0.15)), now, 0.1);
      }
    } catch {}
  }

  private setupRainGenerator(ctx: AudioContext): void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    // Pink noise approximation for rain
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
    this.rainNode = whiteNoise;
    this.rainGain = gain;
  }

  private setupTapeHissGenerator(ctx: AudioContext): void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Vintage vinyl pop / tape hiss
      const isPop = Math.random() < 0.0003;
      const pop = isPop ? (Math.random() * 1.5 - 0.75) : 0;
      output[i] = (Math.random() * 0.15 - 0.075) + pop;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    this.tapeHissNode = noise;
    this.tapeHissGain = gain;
  }
}

export const audioSynth = new AudioSynthesizer();
