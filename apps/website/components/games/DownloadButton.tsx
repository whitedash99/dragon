"use client";

import React, { useState } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle, Monitor, Smartphone, Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { GameVisualTheme } from "@/lib/theme/game-theme";

export interface DownloadButtonProps {
  slug: string;
  platform: "WINDOWS" | "ANDROID" | "WEB";
  label?: string;
  fileSize?: string;
  webPlayUrl?: string;
  theme?: GameVisualTheme;
  className?: string;
}

export function DownloadButton({
  slug,
  platform,
  label,
  fileSize,
  webPlayUrl,
  theme,
  className
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (platform === "WEB" && webPlayUrl) {
    return (
      <a
        href={webPlayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500",
          className
        )}
      >
        <Globe className="size-4" />
        <span>{label || "Play Instant in Browser"}</span>
        <ExternalLink className="size-3.5 opacity-80" />
      </a>
    );
  }

  const handleDownload = async () => {
    setError(null);
    setDownloading(true);
    try {
      const res = await fetch(`/api/games/${slug}/download?platform=${platform.toLowerCase()}`);
      const data = await res.json();

      if (res.ok && data.success && data.downloadUrl) {
        setDownloadSuccess(true);
        window.location.href = data.downloadUrl;
        setTimeout(() => setDownloadSuccess(false), 4000);
      } else {
        setError(data.error || "Release package not yet provisioned on Backblaze B2.");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      setError("Network or storage service error.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setDownloading(false);
    }
  };

  const isWindows = platform === "WINDOWS";
  const defaultLabel = isWindows ? "Download for PC" : "Download APK";

  return (
    <div className="space-y-1">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-r",
          theme ? theme.buttonGradient : (isWindows ? "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500" : "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"),
          className
        )}
      >
        {downloading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : downloadSuccess ? (
          <CheckCircle2 className="size-4 text-emerald-300" />
        ) : isWindows ? (
          <Monitor className="size-4" />
        ) : (
          <Smartphone className="size-4" />
        )}

        <span>
          {downloading ? "Preparing Secure B2 Stream..." : downloadSuccess ? "Starting Download..." : (label || defaultLabel)}
        </span>

        {fileSize && (
          <span className="text-[10px] font-mono opacity-80 font-normal">
            ({fileSize})
          </span>
        )}
      </button>

      {error && (
        <div className="text-[10px] text-amber-400 flex items-center gap-1 font-mono pt-1">
          <AlertCircle className="size-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
