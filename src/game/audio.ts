// Synthesized retro sound effects and holiday music using Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null;
  public sfxEnabled: boolean = true;
  public musicEnabled: boolean = true;
  private bgmInterval: any = null;
  private isBgmPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single synthesized tone
  private playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.15, decay: boolean = true) {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      if (decay) {
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  // Coin collected chime
  playCoin() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.06); // E6

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Rare Star / Holiday Ornament collected
  playStar() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.25, 0.14);
      }, i * 45);
    });
  }

  // Dog Bone treat collected (Happy beagle chew sound!)
  playBone() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.playTone(440, 'sine', 0.1, 0.18);
    setTimeout(() => {
      this.playTone(659.25, 'triangle', 0.18, 0.16);
    }, 70);
  }

  // Cartoon Jump Boing
  playJump() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(587.33, t + 0.15);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  // Flutter / Extra jump sound (Snoopy ear flaps)
  playFlutter() {
    if (!this.sfxEnabled) return;
    this.playTone(740, 'sine', 0.08, 0.08);
    setTimeout(() => this.playTone(880, 'sine', 0.08, 0.08), 50);
  }

  // Dash Whoosh
  playDash() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(80, t + 0.14);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  // Schroeder's Spring Toy Piano chord!
  playPianoBounce() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Classic bright major triad
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq) => {
      this.playTone(freq, 'triangle', 0.4, 0.1);
    });
  }

  // Snoopy Happy Dance Victory Fanfare!
  playVictory() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Playful jazzy fanfare (C - E - G - A - C6 - B - C6)
    const melody = [
      { f: 523.25, d: 100 },
      { f: 659.25, d: 100 },
      { f: 783.99, d: 100 },
      { f: 880.0, d: 120 },
      { f: 1046.5, d: 180 },
      { f: 987.77, d: 100 },
      { f: 1046.5, d: 350 },
    ];

    let time = 0;
    melody.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.f, 'triangle', note.d / 1000, 0.18);
      }, time);
      time += note.d + 30;
    });
  }

  // Charlie Brown "Good grief!" trombone slide
  playGameOver() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(180, t + 0.5);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  // Typewriter clack sound for Snoopy's chat
  playTypewriter() {
    if (!this.sfxEnabled) return;
    this.playTone(1800 + Math.random() * 400, 'square', 0.02, 0.04);
  }

  // UI Button Click sound
  playClick() {
    if (!this.sfxEnabled) return;
    this.playTone(600, 'sine', 0.04, 0.08);
  }

  // Level Up / Achievement / StoreKit Purchase fanfare
  playLevelUp() {
    if (!this.sfxEnabled) return;
    this.playTone(523.25, 'triangle', 0.1, 0.15);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.15), 80);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.1, 0.15), 160);
    setTimeout(() => this.playTone(1046.5, 'triangle', 0.25, 0.18), 240);
  }

  // Start peaceful, joyful jazzy holiday BGM (Vince Guaraldi / Peanuts style)
  startBGM() {
    if (this.isBgmPlaying || !this.musicEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isBgmPlaying = true;

    // Peanuts-inspired jazz-holiday chord progression
    // Cmaj7 -> Am7 -> Dm7 -> G7 -> Em7 -> A7 -> Dm7 -> G7
    const progression = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [196.0, 246.94, 293.66, 349.23], // G7
      [329.63, 392.0, 493.88, 587.33], // Em7
      [220.0, 277.18, 329.63, 392.0],  // A7
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [196.0, 246.94, 293.66, 392.0],  // G7
    ];

    let step = 0;
    this.bgmInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      const chord = progression[step % progression.length];

      chord.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.6, 0.025);
        }, idx * 60);
      });

      // Playful bass note
      const root = chord[0] / 2;
      this.playTone(root, 'triangle', 0.45, 0.035);

      step++;
    }, 900);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.isBgmPlaying = false;
  }

  toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.musicEnabled;
  }

  toggleSfx(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }
}

export const sound = new SoundManager();
