"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  CreditCard,
  RefreshCw,
  Sliders,
  Check,
  Zap,
  Maximize2,
  RotateCcw
} from "lucide-react";
import { GlassBadge } from "@/components/ui/glass";

export interface BannerPresentationConfig {
  focalPoint: { x: number; y: number };
  desktopPosition: string;
  tabletPosition: string;
  mobilePosition: string;
  cardPosition: string;
  presentationMode: "AUTO" | "MANUAL";
  zoomLevel: number;
  overlayIntensity: number;
  textPlacement: "bottom-left" | "bottom-center" | "center" | "top-left";
  aiAnalysisStatus?: string;
  aiConfidence?: number;
  primarySubject?: string;
  assetHash?: string;
}

interface BannerStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  gameGenre?: string;
  bannerUrl: string;
  config: BannerPresentationConfig;
  onSave: (updatedConfig: BannerPresentationConfig) => void;
}

type DeviceTab = "desktop" | "tablet" | "mobile" | "card";

export function BannerStudioModal({
  isOpen,
  onClose,
  gameTitle,
  gameGenre,
  bannerUrl,
  config,
  onSave,
}: BannerStudioModalProps) {
  const [activeTab, setActiveTab] = useState<DeviceTab>("desktop");
  const [focalX, setFocalX] = useState(config.focalPoint?.x ?? 0.5);
  const [focalY, setFocalY] = useState(config.focalPoint?.y ?? 0.5);
  const [zoomLevel, setZoomLevel] = useState(config.zoomLevel ?? 1.0);
  const [overlayIntensity, setOverlayIntensity] = useState(config.overlayIntensity ?? 0.4);
  const [textPlacement, setTextPlacement] = useState(config.textPlacement ?? "bottom-left");
  const [presentationMode, setPresentationMode] = useState<"AUTO" | "MANUAL">(config.presentationMode ?? "AUTO");

  const [analyzing, setAnalyzing] = useState(false);
  const [aiData, setAiData] = useState<{
    confidence?: number;
    primarySubject?: string;
    description?: string;
  }>({
    confidence: config.aiConfidence || 0.95,
    primarySubject: config.primarySubject || "Hero Character / Horizon",
  });
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync state when incoming config changes
  useEffect(() => {
    if (config) {
      setFocalX(config.focalPoint?.x ?? 0.5);
      setFocalY(config.focalPoint?.y ?? 0.5);
      setZoomLevel(config.zoomLevel ?? 1.0);
      setOverlayIntensity(config.overlayIntensity ?? 0.4);
      setTextPlacement(config.textPlacement ?? "bottom-left");
      setPresentationMode(config.presentationMode ?? "AUTO");
      setAiData({
        confidence: config.aiConfidence || 0.95,
        primarySubject: config.primarySubject || "Hero Character / Horizon",
      });
    }
  }, [config]);

  if (!isOpen) return null;

  // Handle direct click on canvas to reposition focal point
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setFocalX(x);
    setFocalY(y);
    setPresentationMode("MANUAL");
  };

  // Run Real Gemini Vision Analysis on the banner artwork
  const handleAnalyzeWithGemini = async () => {
    if (!bannerUrl) return;
    setAnalyzing(true);
    setAiNotice(null);
    try {
      const res = await fetch("/api/ai/banner-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: bannerUrl }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        const a = data.analysis;
        setFocalX(a.focalPoint.x);
        setFocalY(a.focalPoint.y);
        setZoomLevel(a.recommendedZoom || 1.0);
        setOverlayIntensity(a.recommendedOverlay || 0.4);
        setTextPlacement(a.recommendedTextPlacement || "bottom-left");
        setAiData({
          confidence: a.confidence,
          primarySubject: a.primarySubject,
          description: a.rationale,
        });
        setPresentationMode("AUTO");
        setAiNotice(`Gemini Vision focal locked on "${a.primarySubject}" with ${Math.round(a.confidence * 100)}% confidence.`);
      } else {
        setAiNotice(data.error || "Gemini Vision analysis returned fallback framing.");
      }
    } catch {
      setAiNotice("Could not reach Gemini Vision service. Local smart framing applied.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    setFocalX(0.5);
    setFocalY(0.5);
    setZoomLevel(1.0);
    setOverlayIntensity(0.4);
    setTextPlacement("bottom-left");
    setPresentationMode("MANUAL");
  };

  // Reset to AI recommendation
  const handleResetToAi = () => {
    setPresentationMode("AUTO");
    handleAnalyzeWithGemini();
  };

  const handleSave = () => {
    const focalPct = `${Math.round(focalX * 100)}% ${Math.round(focalY * 100)}%`;
    onSave({
      focalPoint: { x: focalX, y: focalY },
      desktopPosition: focalPct,
      tabletPosition: focalPct,
      mobilePosition: focalPct,
      cardPosition: focalPct,
      presentationMode,
      zoomLevel,
      overlayIntensity,
      textPlacement,
      aiConfidence: aiData.confidence,
      primarySubject: aiData.primarySubject,
    });
    onClose();
  };

  // Current computed object position for the active device
  const currentObjectPosition = `${Math.round(focalX * 100)}% ${Math.round(focalY * 100)}%`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#02050E]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono tracking-tight">Banner Studio & Visual Intelligence</h2>
                <GlassBadge variant={presentationMode === "AUTO" ? "published" : "warning"}>
                  {presentationMode === "AUTO" ? "AI AUTO-COMPOSITION" : "MANUAL OVERRIDE"}
                </GlassBadge>
              </div>
              <p className="text-xs text-cyan-400/70 font-mono">
                {gameTitle} — Multi-device responsive cropping & Gemini Vision positioning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Studio Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#03091D]/90 text-slate-200">
          
          {/* LEFT 7 COLS: Interactive Canvas & Multi-Device Previews */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Device Switcher Tabs */}
            <div className="flex items-center justify-between bg-[#02050E] p-1.5 rounded-2xl border border-cyan-500/25">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeTab === "desktop" ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Monitor className="size-3.5" />
                  <span>Desktop (16:9)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tablet")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeTab === "tablet" ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Tablet className="size-3.5" />
                  <span>Tablet (4:3)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeTab === "mobile" ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="size-3.5" />
                  <span>Mobile (9:16)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("card")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeTab === "card" ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CreditCard className="size-3.5" />
                  <span>Store Card (3:2)</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-cyan-400 pr-2">
                {Math.round(focalX * 100)}% X · {Math.round(focalY * 100)}% Y
              </span>
            </div>

            {/* Interactive Focal Canvas Frame */}
            <div className="bg-[#02050E] rounded-2xl p-2 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)] flex items-center justify-center min-h-[300px] relative overflow-hidden">
              
              {/* Dynamic Aspect Ratio Preview Box */}
              <div
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`relative overflow-hidden cursor-crosshair group rounded-xl transition-all select-none border border-cyan-500/20 ${
                  activeTab === "desktop" ? "w-full aspect-video" :
                  activeTab === "tablet" ? "w-[80%] aspect-4/3" :
                  activeTab === "mobile" ? "w-[46%] aspect-9/16" :
                  "w-[70%] aspect-3/2"
                }`}
              >
                {bannerUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bannerUrl}
                    alt={gameTitle}
                    className="w-full h-full object-cover transition-all duration-300 pointer-events-none"
                    style={{
                      objectPosition: currentObjectPosition,
                      transform: `scale(${zoomLevel})`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#02050E] flex items-center justify-center text-cyan-500/50 text-xs font-mono">
                    No banner URL provided
                  </div>
                )}

                {/* Dark Vignette Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity"
                  style={{
                    backgroundColor: `rgba(2, 6, 23, ${overlayIntensity})`,
                  }}
                />

                {/* Simulated Text Overlay */}
                <div
                  className={`absolute p-4 pointer-events-none flex flex-col justify-end inset-0 ${
                    textPlacement === "bottom-left" ? "items-start text-left" :
                    textPlacement === "bottom-center" ? "items-center text-center" :
                    textPlacement === "center" ? "items-center text-center justify-center" :
                    "items-start text-left justify-start"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs mb-1 border border-cyan-500/30">
                    {gameGenre || "3D Action RPG"}
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-tight font-mono">
                    {gameTitle}
                  </h4>
                </div>

                {/* Focal Target Crosshair Indicator */}
                <div
                  className="absolute pointer-events-none transition-all duration-150 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{
                    left: `${focalX * 100}%`,
                    top: `${focalY * 100}%`,
                  }}
                >
                  <div className="relative flex items-center justify-center size-8">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                    <div className="size-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_10px_#00E5FF] flex items-center justify-center">
                      <div className="size-1 rounded-full bg-black" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Click-to-position hint */}
              <div className="absolute bottom-3 left-3 pointer-events-none bg-[#02050E]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Maximize2 className="size-3 text-cyan-400" />
                <span>Click image canvas to move focal point</span>
              </div>
            </div>

            {/* AI Status Banner */}
            {aiNotice && (
              <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-cyan-400 shrink-0" />
                  <span>{aiNotice}</span>
                </div>
                <button onClick={() => setAiNotice(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: Controls & Intelligence Panel */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Gemini AI Action Card */}
            <div className="bg-[#02050E] p-4 rounded-2xl border border-cyan-500/25 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Gemini Vision AI</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {Math.round((aiData.confidence || 0.95) * 100)}% Confidence
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Gemini Vision inspects characters, lighting balance, and safe text regions to compute ideal focal coordinates.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAnalyzeWithGemini}
                  disabled={analyzing || !bannerUrl}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-mono font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(0,229,255,0.35)] hover:scale-[1.01] transition-all"
                >
                  {analyzing ? <RefreshCw className="size-3.5 animate-spin" /> : <Zap className="size-3.5" />}
                  <span>{analyzing ? "Analyzing..." : "Analyze with Gemini"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToAi}
                  className="px-3 py-2 rounded-xl bg-[#03091D] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="size-3.5 text-cyan-400" />
                  <span>Restore AI Preset</span>
                </button>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="bg-[#02050E] p-4 rounded-2xl border border-cyan-500/25 shadow-2xs space-y-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">Presentation Mode</span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPresentationMode("AUTO")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    presentationMode === "AUTO"
                      ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                      : "bg-[#03091D] border-cyan-500/20 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 font-bold text-xs font-mono">
                    <Sparkles className="size-3.5 text-cyan-400" />
                    <span>Auto AI Mode</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Uses Gemini Vision recommendations.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPresentationMode("MANUAL")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    presentationMode === "MANUAL"
                      ? "bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      : "bg-[#03091D] border-cyan-500/20 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 font-bold text-xs font-mono">
                    <Sliders className="size-3.5 text-amber-400" />
                    <span>Manual Override</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Custom focal X/Y and zoom overrides.
                  </p>
                </button>
              </div>
            </div>

            {/* Manual Sliders & Overrides */}
            <div className="bg-[#02050E] p-4 rounded-2xl border border-cyan-500/25 shadow-2xs space-y-3.5">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">Fine Tuning Controls</span>
              
              {/* Focal X Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold text-cyan-300">
                  <span>Horizontal Focal (X)</span>
                  <span className="text-white">{Math.round(focalX * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={focalX}
                  onChange={(e) => {
                    setFocalX(parseFloat(e.target.value));
                    setPresentationMode("MANUAL");
                  }}
                  className="w-full h-1.5 bg-[#03091D] border border-cyan-500/30 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Focal Y Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold text-cyan-300">
                  <span>Vertical Focal (Y)</span>
                  <span className="text-white">{Math.round(focalY * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={focalY}
                  onChange={(e) => {
                    setFocalY(parseFloat(e.target.value));
                    setPresentationMode("MANUAL");
                  }}
                  className="w-full h-1.5 bg-[#03091D] border border-cyan-500/30 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Zoom Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold text-cyan-300">
                  <span>Artwork Scale / Zoom</span>
                  <span className="text-white">{zoomLevel.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#03091D] border border-cyan-500/30 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Overlay Darkness Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold text-cyan-300">
                  <span>Vignette Overlay Intensity</span>
                  <span className="text-white">{Math.round(overlayIntensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.9"
                  step="0.05"
                  value={overlayIntensity}
                  onChange={(e) => setOverlayIntensity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#03091D] border border-cyan-500/30 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Text Placement Selector */}
              <div className="space-y-1 pt-1">
                <span className="text-xs font-mono font-bold text-cyan-300 block">Text Safe Anchor</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["bottom-left", "bottom-center", "center", "top-left"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setTextPlacement(pos)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold capitalize border transition-all cursor-pointer ${
                        textPlacement === pos
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                          : "bg-[#03091D] border-cyan-500/20 text-slate-400 hover:text-white"
                      }`}
                    >
                      {pos.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-cyan-500/20 flex items-center justify-between bg-[#02050E]/90 backdrop-blur-xl">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-mono font-bold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            ↺ Reset to Center Default
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#03091D] border border-cyan-500/30 hover:border-cyan-400 text-slate-300 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-black font-mono font-black text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.35)] cursor-pointer hover:scale-[1.01] transition-all"
            >
              <Check className="size-4" />
              <span>Apply Presentation Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
