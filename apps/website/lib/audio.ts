"use client";

export type SoundCategory =
  | "buttonClick"
  | "buttonHover"
  | "toggleOn"
  | "toggleOff"
  | "success"
  | "error"
  | "warning"
  | "notification"
  | "modalOpen"
  | "modalClose"
  | "dropdownOpen"
  | "dropdownClose"
  | "navigation"
  | "tabSwitch"
  | "pageTransition"
  | "formSubmit"
  | "ticketCreated"
  | "login"
  | "logout"
  | "adminSave"
  | "cmsPublish";

interface AudioSettings {
  muted: boolean;
  uiSounds: boolean;
  hoverSounds: boolean;
  notificationSounds: boolean;
  masterVolume: number; // 0 to 100
  uiVolume: number; // 0 to 100
}

class AAAAudioEngine {
  private ctx: AudioContext | null = null;
  private settings: AudioSettings = {
    muted: false,
    uiSounds: true,
    hoverSounds: true,
    notificationSounds: true,
    masterVolume: 80,
    uiVolume: 70,
  };
  private lastPlayTimes: Map<string, number> = new Map();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("dragon_audio_settings");
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
      } catch (e) {
        // Fallback default settings
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  private getEffectiveGain(baseGain: number = 0.05): number {
    const master = this.settings.masterVolume / 100;
    const ui = this.settings.uiVolume / 100;
    return baseGain * master * ui;
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...partial };
    if (typeof window !== "undefined") {
      localStorage.setItem("dragon_audio_settings", JSON.stringify(this.settings));
    }
  }

  public toggleMute(): boolean {
    const newMuted = !this.settings.muted;
    this.updateSettings({ muted: newMuted });
    return newMuted;
  }

  private throttle(type: string, ms: number = 40): boolean {
    const now = Date.now();
    const last = this.lastPlayTimes.get(type) || 0;
    if (now - last < ms) return true;
    this.lastPlayTimes.set(type, now);
    return false;
  }

  // ═══════════════════════════════════════════════════════
  // SYNTHESIZED AAA AUDIO PACK (Pure Web Audio Oscillators)
  // ═══════════════════════════════════════════════════════

  public play(category: SoundCategory) {
    if (this.settings.muted || !this.settings.uiSounds) return;
    if (category === "buttonHover" && !this.settings.hoverSounds) return;
    if (category === "notification" && !this.settings.notificationSounds) return;
    if (this.throttle(category)) return;

    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    const baseGain = this.getEffectiveGain(0.04);

    try {
      switch (category) {
        case "buttonHover": {
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(520, t);
          osc.frequency.exponentialRampToValueAtTime(780, t + 0.04);

          gainNode.gain.setValueAtTime(baseGain * 0.3, t);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

          osc.connect(gainNode);
          osc.start(t);
          osc.stop(t + 0.04);
          break;
        }

        case "buttonClick": {
          const osc = this.ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(650, t);
          osc.frequency.exponentialRampToValueAtTime(220, t + 0.06);

          gainNode.gain.setValueAtTime(baseGain * 0.7, t);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

          osc.connect(gainNode);
          osc.start(t);
          osc.stop(t + 0.06);
          break;
        }

        case "toggleOn": {
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

          gainNode.gain.setValueAtTime(baseGain * 0.6, t);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

          osc.connect(gainNode);
          osc.start(t);
          osc.stop(t + 0.08);
          break;
        }

        case "toggleOff": {
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, t);
          osc.frequency.exponentialRampToValueAtTime(330, t + 0.08);

          gainNode.gain.setValueAtTime(baseGain * 0.5, t);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

          osc.connect(gainNode);
          osc.start(t);
          osc.stop(t + 0.08);
          break;
        }

        case "success":
        case "formSubmit":
        case "ticketCreated":
        case "adminSave":
        case "cmsPublish": {
          // Dual chord resolution
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          osc1.type = "sine";
          osc2.type = "sine";

          osc1.frequency.setValueAtTime(523.25, t); // C5
          osc1.frequency.setValueAtTime(659.25, t + 0.08); // E5
          osc2.frequency.setValueAtTime(783.99, t + 0.08); // G5

          gainNode.gain.setValueAtTime(baseGain * 0.8, t);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          osc1.start(t);
          osc2.start(t + 0.08);
          osc1.stop(t + 0.22);
          osc2.stop(t + 0.22);
          break;
        }

        case "error": {
          const osc = this.ctx.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(180, t);
          osc.frequency.setValueAtTime(140, t + 0.08);

          gainNode.gain.setValueAtTime(baseGain * 0.8, t);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

          osc.connect(gainNode);
          osc.start(t);
          osc.stop(t + 0.18);
          break;
        }

        case "modalOpen":
        case "dropdownOpen": {
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(350, t);
          osc.frequency.exponentialRampToValueAtTime(700, t + 0.09);

          gainNode.gain.setValueAtTime(baseGain * 0.4, t);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

          osc.connect(gainNode);
          osc.start(t);
          osc.stop(t + 0.09);
          break;
        }

        case "modalClose":
        case "dropdownClose": {
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.exponentialRampToValueAtTime(300, t + 0.07);

          gainNode.gain.setValueAtTime(baseGain * 0.3, t);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

          osc.connect(gainNode);
          osc.start(t);
          osc.stop(t + 0.07);
          break;
        }

        default: {
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(500, t);
          osc.frequency.exponentialRampToValueAtTime(750, t + 0.05);

          gainNode.gain.setValueAtTime(baseGain * 0.4, t);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

          osc.connect(gainNode);
          osc.start(t);
          osc.stop(t + 0.05);
          break;
        }
      }

      gainNode.connect(this.ctx.destination);
    } catch (e) {
      // Audio node failure fallback handler
    }
  }
}

export const audioEngine = new AAAAudioEngine();
