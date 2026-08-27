"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  HardDrive, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  Check, 
  Zap, 
  Info 
} from "lucide-react";
import { GlassSurface, GlassButton, GlassCard, GlassBadge } from "@/components/ui/glass";
import { computeFileSha256Chunked } from "@dragon/utils";

interface GameReleaseItem {
  id: string;
  gameId: string;
  version: string;
  buildNumber: number;
  platform: "WINDOWS" | "ANDROID";
  targetArch: string;
  fileType: string;
  fileName: string;
  fileSizeBytes: string;
  sha256Checksum: string;
  b2ObjectKey: string;
  status: "DRAFT" | "UPLOADING" | "UPLOADED" | "VERIFIED" | "PUBLISHED" | "DEPRECATED" | "ARCHIVED";
  isPublished: boolean;
  publishedAt?: string;
  verifiedAt?: string;
  downloadCount: number;
  releaseNotes?: string;
  createdAt: string;
}

interface ReleaseManagerModalProps {
  gameId: string;
  gameName: string;
  gameSlug: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReleaseManagerModal({
  gameId,
  gameName,
  isOpen,
  onClose,
}: ReleaseManagerModalProps) {
  const [releases, setReleases] = useState<GameReleaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"LIST" | "UPLOAD">("LIST");

  // Upload state
  const [version, setVersion] = useState("v1.0.0");
  const [platform, setPlatform] = useState<"WINDOWS" | "ANDROID">("WINDOWS");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Progress & verification
  const [isHashing, setIsHashing] = useState(false);
  const [computedChecksum, setComputedChecksum] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReleases = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/games/${gameId}/releases`);
      const data = await res.json();
      if (data.success && Array.isArray(data.releases)) {
        setReleases(data.releases);
      } else {
        setActionError(data.error || "Failed to load releases.");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Network error loading releases.";
      setActionError(msg);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    if (isOpen) {
      fetchReleases();
    }
  }, [isOpen, fetchReleases]);

  // Compute file SHA-256 in background without locking UI thread
  const computeFileSHA256 = async (file: File): Promise<string> => {
    setIsHashing(true);
    setUploadStatusText("Computing SHA-256 Checksum...");
    try {
      const hash = await computeFileSha256Chunked(file);
      setComputedChecksum(hash);
      return hash;
    } finally {
      setIsHashing(false);
      setUploadStatusText("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setActionError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    try {
      await computeFileSHA256(file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setActionError("Failed to compute file checksum: " + msg);
    }
  };

  // Direct Browser-to-B2 Upload Pipeline
  const handleStartUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    if (!selectedFile) {
      setActionError("Please select a game binary file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatusText("Initializing secure B2 presigned channel...");

      let checksum = computedChecksum;
      if (!checksum) {
        checksum = await computeFileSHA256(selectedFile);
      }

      // 1. Initialize upload on admin server
      const initRes = await fetch("/api/games/releases/init-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          version: version.trim(),
          platform,
          fileName: selectedFile.name,
          fileSizeBytes: selectedFile.size,
          sha256Checksum: checksum,
          contentType: selectedFile.type || "application/octet-stream",
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok || !initData.success) {
        throw new Error(initData.error || "Failed to initialize B2 upload.");
      }

      const { uploadUrl, releaseId } = initData;

      // 2. Direct upload to Backblaze B2 using XMLHttpRequest for real-time progress
      setUploadStatusText("Uploading directly to Backblaze B2 bucket...");
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", selectedFile.type || "application/octet-stream");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(pct);
            setUploadStatusText(`Uploading to B2: ${pct}% (${(event.loaded / (1024 * 1024)).toFixed(1)} MB / ${(event.total / (1024 * 1024)).toFixed(1)} MB)`);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`B2 direct upload failed with status ${xhr.status}: ${xhr.responseText}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during direct B2 upload."));
        xhr.ontimeout = () => reject(new Error("Timeout during B2 upload."));
        xhr.send(selectedFile);
      });

      // 3. Confirm upload & initiate server verification
      setUploadStatusText("Verifying B2 object presence & integrity...");
      const verifyRes = await fetch(`/api/games/releases/${releaseId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          releaseNotes: releaseNotes.trim(),
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Server verification failed.");
      }

      setActionSuccess(`Release ${version} (${platform}) uploaded & verified successfully.`);
      setSelectedFile(null);
      setComputedChecksum("");
      setReleaseNotes("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setActiveTab("LIST");
      fetchReleases();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failure";
      setActionError(msg);
    } finally {
      setIsUploading(false);
      setUploadStatusText("");
    }
  };

  // Toggle Publish Status
  const handleTogglePublish = async (releaseId: string, currentPublished: boolean) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/games/releases/${releaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: !currentPublished,
          status: !currentPublished ? "PUBLISHED" : "VERIFIED",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(!currentPublished ? "Release is now published live!" : "Release has been unpublished.");
        fetchReleases();
      } else {
        setActionError(data.error || "Failed to update status.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating release.";
      setActionError(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#03091D] border border-cyan-500/35 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#02050E]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <HardDrive className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                <span>{gameName}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                  B2 RELEASES
                </span>
              </h2>
              <p className="text-xs text-cyan-400/70 font-mono">
                Storage: <span className="font-semibold text-cyan-300">dragon-games-production</span> (Backblaze Private S3)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-cyan-500/20 bg-[#02050E]/60">
          <button
            onClick={() => setActiveTab("LIST")}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "LIST"
                ? "border-cyan-400 text-cyan-300 bg-[#03091D] shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span>Releases & Binaries ({releases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("UPLOAD")}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "UPLOAD"
                ? "border-cyan-400 text-cyan-300 bg-[#03091D] shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <UploadCloud className="size-4" />
            <span>New Direct B2 Upload</span>
          </button>
        </div>

        {/* Action Alerts */}
        {actionError && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2.5">
            <AlertTriangle className="size-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {actionSuccess && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono flex items-center gap-2.5">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#03091D]/90 text-slate-200">
          {activeTab === "LIST" && (
            <div className="space-y-4">
              {loading ? (
                <div className="py-12 text-center text-cyan-400 text-xs font-mono flex flex-col items-center gap-3">
                  <RefreshCw className="size-6 animate-spin text-cyan-400" />
                  <span>Loading game release history from Neon Database...</span>
                </div>
              ) : releases.length === 0 ? (
                <div className="py-12 text-center rounded-2xl border-2 border-dashed border-cyan-500/30 bg-[#02050E]/60 space-y-3">
                  <HardDrive className="size-8 mx-auto text-cyan-500/60" />
                  <p className="text-sm font-bold text-white font-mono">No binary releases uploaded yet</p>
                  <p className="text-xs text-slate-400">Upload a Windows PC (.exe/.zip) or Android (.apk) build directly to Backblaze B2.</p>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab("UPLOAD")}
                    className="mt-2"
                  >
                    <UploadCloud className="size-4 mr-1" />
                    <span>Upload First Build</span>
                  </GlassButton>
                </div>
              ) : (
                <div className="space-y-3">
                  {releases.map((rel) => (
                    <GlassCard
                      key={rel.id}
                      level={2}
                      className={`p-4 sm:p-5 transition-all border ${
                        rel.isPublished
                          ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                          : rel.status === "VERIFIED"
                          ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                          : "border-cyan-500/20 bg-[#02050E]"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-white font-mono">
                              {rel.version}
                            </span>

                            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#02050E] text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                              {rel.platform === "WINDOWS" ? <Monitor className="size-3" /> : <Smartphone className="size-3" />}
                              <span>{rel.platform} ({rel.fileType})</span>
                            </span>

                            <GlassBadge
                              variant={
                                rel.status === "PUBLISHED"
                                  ? "published"
                                  : rel.status === "VERIFIED"
                                  ? "info"
                                  : "draft"
                              }
                            >
                              {rel.status}
                            </GlassBadge>
                          </div>

                          <p className="text-xs text-slate-300 flex items-center gap-2 font-mono">
                            <span>File: <strong className="text-white">{rel.fileName}</strong></span>
                            <span>•</span>
                            <span>Size: {(Number(rel.fileSizeBytes) / (1024 * 1024)).toFixed(1)} MB</span>
                            <span>•</span>
                            <span>Downloads: {rel.downloadCount}</span>
                          </p>

                          <p className="text-xs font-mono text-slate-400 break-all">
                            SHA-256: <span className="text-cyan-300 font-semibold">{rel.sha256Checksum}</span>
                          </p>

                          <p className="text-[11px] font-mono text-slate-500">
                            B2 Key: {rel.b2ObjectKey}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {rel.status === "VERIFIED" || rel.status === "PUBLISHED" ? (
                            <GlassButton
                              variant={rel.isPublished ? "secondary" : "primary"}
                              size="sm"
                              onClick={() => handleTogglePublish(rel.id, rel.isPublished)}
                              shine={!rel.isPublished}
                            >
                              {rel.isPublished ? (
                                <span>Unpublish</span>
                              ) : (
                                <>
                                  <Check className="size-3.5" />
                                  <span>Publish Live</span>
                                </>
                              )}
                            </GlassButton>
                          ) : (
                            <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                              <AlertTriangle className="size-3.5" />
                              <span>Unverified</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "UPLOAD" && (
            <form onSubmit={handleStartUpload} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-cyan-400 block">
                    Version Tag (e.g. v1.0.0)
                  </label>
                  <input
                    type="text"
                    required
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v1.0.0"
                    disabled={isUploading}
                    className="w-full rounded-xl bg-[#02050E] border border-cyan-500/30 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-cyan-400 block">
                    Target Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as "WINDOWS" | "ANDROID")}
                    disabled={isUploading}
                    className="w-full rounded-xl bg-[#02050E] border border-cyan-500/30 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="WINDOWS">Windows PC (.exe, .zip, installer)</option>
                    <option value="ANDROID">Android Phone (.apk, .aab)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-cyan-400 block">
                  Select Game Binary File
                </label>
                <div className="p-5 rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 bg-[#02050E]/60 text-center space-y-2 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    required
                    onChange={handleFileChange}
                    disabled={isUploading}
                    accept={platform === "WINDOWS" ? ".exe,.zip,.msi,.rar" : ".apk,.aab"}
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 font-mono">
                    Direct S3 Upload to Backblaze B2 • Max 100GB • Zero Vercel memory overhead
                  </p>
                </div>
              </div>

              {selectedFile && (
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">File: <strong className="text-white">{selectedFile.name}</strong></span>
                    <span className="text-cyan-300 font-bold">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                  {isHashing ? (
                    <p className="text-amber-300 font-medium flex items-center gap-1.5 animate-pulse">
                      <RefreshCw className="size-3.5 animate-spin" />
                      <span>Computing SHA-256 Checksum...</span>
                    </p>
                  ) : computedChecksum ? (
                    <p className="text-emerald-300 font-mono text-[11px] flex items-center gap-1.5 break-all">
                      <ShieldCheck className="size-3.5 shrink-0 text-emerald-400" />
                      <span>SHA-256: {computedChecksum}</span>
                    </p>
                  ) : null}
                </div>
              )}

              {isUploading && (
                <div className="space-y-2 p-4 rounded-xl bg-cyan-500/15 border border-cyan-400/40">
                  <div className="flex justify-between text-xs font-mono font-bold text-cyan-200">
                    <span>{uploadStatusText}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#02050E] overflow-hidden border border-cyan-500/20">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <GlassButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab("LIST")}
                  disabled={isUploading}
                >
                  Cancel
                </GlassButton>

                <GlassButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  shine
                  disabled={isUploading || isHashing || !selectedFile}
                >
                  {isUploading ? "Uploading to B2..." : "Start Direct B2 Upload"}
                </GlassButton>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-cyan-500/20 bg-[#02050E]/90 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="size-4 text-emerald-400" />
            <span>End-to-End SHA-256 Verification Enforced</span>
          </span>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Close
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
