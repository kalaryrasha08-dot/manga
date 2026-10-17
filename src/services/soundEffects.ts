/**
 * Web Audio API synthesizer for instant, responsive, offline-capable sound effects
 * for Kak Manga (Moo, bell, grass munching, milk drops, laughter, and flute).
 */

class SoundEffectManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Realistic synthesized cow moo
  playMoo(type: 'normal' | 'happy' | 'opera' = 'normal') {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.Q.setValueAtTime(4, now);

      osc.type = 'sawtooth';

      if (type === 'normal') {
        osc.frequency.setValueAtTime(115, now);
        osc.frequency.exponentialRampToValueAtTime(155, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(100, now + 1.2);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.35);
      } else if (type === 'happy') {
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(210, now + 0.25);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.7);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.9);
      } else {
        // Opera moo
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(260, now + 0.5);
        osc.frequency.linearRampToValueAtTime(190, now + 1.2);
        osc.frequency.linearRampToValueAtTime(140, now + 1.8);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.32, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.95);
      }
    } catch (e) {
      console.warn('Audio synthesis not permitted yet:', e);
    }
  }

  // Metallic cowbell sound
  playBell() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const freqs = [540, 800, 1120];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * (1 + idx * 0.05), now);

        gain.gain.setValueAtTime(0.25 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + idx * 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.1);
      });
    } catch (e) {
      console.warn('Bell sound error:', e);
    }
  }

  // Munching fresh grass sound
  playMunch() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // 3 rapid crunches
      [0, 0.18, 0.36].forEach((delay) => {
        const bufferSize = ctx.sampleRate * 0.12;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200 + Math.random() * 600, now + delay);
        filter.Q.setValueAtTime(3, now + delay);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.28, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now + delay);
      });
    } catch (e) {
      console.warn('Munch sound error:', e);
    }
  }

  // Fresh milk squirt / splash
  playMilking() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.15);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Milking sound error:', e);
    }
  }

  // Kurdish shepherd flute (Shimshal) musical arpeggio
  playShepherdMelody() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Traditional Kurdish modal notes (Kurdish Bayat / Shur feel)
      const notes = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33]; // D, E, F#, A, B, D

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0, now + idx * 0.18);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.18 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.45);
      });
    } catch (e) {
      console.warn('Flute melody error:', e);
    }
  }

  // Play Web Audio from base64 WAV
  async playBase64Wav(base64: string): Promise<void> {
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64}`);
      await audio.play();
    } catch (err) {
      console.warn('Failed to play base64 audio element:', err);
    }
  }

  // Fallback to browser SpeechSynthesis (works in modern browsers)
  speakBrowserKurdish(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find Kurdish or Arabic voice for closest phonetics
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) => v.lang.startsWith('ku') || v.lang.startsWith('ar') || v.lang.startsWith('fa')
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const soundEffects = new SoundEffectManager();
