"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { audioEngine, SoundCategory } from "@/lib/audio";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => boolean;
  play: (category: SoundCategory) => void;
  playHover: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playError: () => void;
  playToggle: (on: boolean) => void;
  updateSettings: (partial: any) => void;
  settings: any;
}

const AudioContext = createContext<AudioContextType>({
  isMuted: false,
  toggleMute: () => false,
  play: () => {},
  playHover: () => {},
  playClick: () => {},
  playSuccess: () => {},
  playError: () => {},
  playToggle: () => {},
  updateSettings: () => {},
  settings: {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(() => audioEngine.getSettings());

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        setSettings(audioEngine.getSettings());
      }
    });
    return () => { isMounted = false; };
  }, []);

  const toggleMute = () => {
    const muted = audioEngine.toggleMute();
    setSettings(audioEngine.getSettings());
    return muted;
  };

  const updateSettings = (partial: any) => {
    audioEngine.updateSettings(partial);
    setSettings(audioEngine.getSettings());
  };

  const play = (category: SoundCategory) => audioEngine.play(category);
  const playHover = () => audioEngine.play("buttonHover");
  const playClick = () => audioEngine.play("buttonClick");
  const playSuccess = () => audioEngine.play("success");
  const playError = () => audioEngine.play("error");
  const playToggle = (on: boolean) => audioEngine.play(on ? "toggleOn" : "toggleOff");

  return (
    <AudioContext.Provider
      value={{
        isMuted: settings.muted,
        toggleMute,
        play,
        playHover,
        playClick,
        playSuccess,
        playError,
        playToggle,
        updateSettings,
        settings,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
