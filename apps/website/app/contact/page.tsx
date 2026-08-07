"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Loader2,
  Building2,
  Sparkles,
  FileCode,
  HelpCircle,
  X as XIcon,
  ExternalLink,
  UploadCloud,
  Paperclip,
  Instagram,
  Youtube,
  Twitter,
  MessageSquare,
  ArrowUpRight,
  Bug,
  Handshake,
  DollarSign,
  Newspaper,
  UserCheck,
  MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { useAudio } from "@/providers/audio-provider";
import { 
  fadeUp, 
  slideInLeft, 
  slideInRight, 
  staggerContainer, 
  staggerItem, 
  scaleIn 
} from "@/lib/animations";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  category?: string;
  message?: string;
  privacyAgree?: string;
  termsAgree?: string;
}

interface AttachmentFile {
  name: string;
  size: string;
  type: string;
  url: string;
}

const CATEGORIES = [
  { id: "Technical Support", label: "Technical Support", icon: FileCode, desc: "Game crashes, graphics & performance issues" },
  { id: "Game Bug", label: "Game Bug", icon: Bug, desc: "Report gameplay glitches or engine bugs" },
  { id: "Business Inquiry", label: "Business Inquiry", icon: Building2, desc: "Licensing & corporate inquiries" },
  { id: "Publishing", label: "Publishing", icon: Sparkles, desc: "Game distribution & co-publishing proposals" },
  { id: "Partnership", label: "Partnership", icon: Handshake, desc: "Sponsorship & brand collaborations" },
  { id: "Investor Relations", label: "Investor Relations", icon: DollarSign, desc: "Financial & shareholder communications" },
  { id: "Press", label: "Press", icon: Newspaper, desc: "Media accreditation & review keys" },
  { id: "Careers", label: "Careers", icon: UserCheck, desc: "Recruitment & hiring inquiries" },
  { id: "Feedback", label: "Feedback", icon: MessageCircle, desc: "Player feedback & suggestions" },
  { id: "Other", label: "Other", icon: HelpCircle, desc: "General inquiries" },
];

export default function ContactPage() {
  const { playClick, playSuccess, playError } = useAudio();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical Support");
  const [message, setMessage] = useState("");
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);

  // Attachments State
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Focus & Validation States
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Success State
  const [createdTicket, setCreatedTicket] = useState<{
    ticketId: string;
    trackingToken: string;
    trackingUrl: string;
    estimatedResponse: string;
  } | null>(null);

  const validateAll = (): boolean => {
    const errs: FormErrors = {};

    if (!name.trim()) {
      errs.name = "Full Name is required.";
    }

    if (!email.trim()) {
      errs.email = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email format.";
    }

    if (!subject.trim()) {
      errs.subject = "Subject line is required.";
    }

    if (!message.trim()) {
      errs.message = "Message body is required.";
    } else if (message.trim().length < 10) {
      errs.message = `Message must be at least 10 characters (${message.trim().length}/10).`;
    }

    if (!privacyAgree) {
      errs.privacyAgree = "You must accept the Privacy Policy.";
    }

    if (!termsAgree) {
      errs.termsAgree = "You must accept the Terms of Service.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("File exceeds 25MB maximum limit.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/contact/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed.");
      }

      setAttachments((prev) => [...prev, data.file]);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateAll()) {
      playError();
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          category,
          message: message.trim(),
          attachments,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create support ticket.");
      }

      playSuccess();
      setCreatedTicket({
        ticketId: data.ticketId,
        trackingToken: data.trackingToken,
        trackingUrl: data.trackingUrl,
        estimatedResponse: data.estimatedResponse || "Within 24 Hours",
      });

      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setAttachments([]);
      setPrivacyAgree(false);
      setTermsAgree(false);
      setErrors({});
    } catch (err: any) {
      playError();
      setApiError(err.message || "An unexpected error occurred.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <SceneBackground gradient noise orbs vignette>
      <Navbar />

      <main className="cinematic-page relative min-h-screen overflow-x-hidden pb-24 pt-28">
        {/* Sliding Hero Header */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="container-site relative pt-12 pb-12 lg:pt-16 lg:pb-20 max-w-4xl mx-auto text-center space-y-4"
        >
          <motion.div 
            variants={scaleIn}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#ff1e4b]/30 bg-[#ff1e4b]/10 px-4 py-1.5 backdrop-blur-md"
          >
            <ShieldCheck className="size-4 text-[#ff1e4b]" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#ff1e4b]">
              DRAGON STUDIOS SUPPORT GATEWAY
            </span>
          </motion.div>

          <motion.h1 
            variants={slideInLeft}
            className="text-4xl font-black uppercase tracking-tight sm:text-6xl lg:text-7xl text-white leading-[0.9] font-heading"
          >
            SUPPORT & <span className="text-[#ff1e4b]">COMMUNICATION</span>
          </motion.h1>

          <motion.p 
            variants={slideInRight}
            className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto font-sans"
          >
            Direct enterprise ticket channel to Dragon Studios operations. Submissions generate an immediate ticket reference and route directly to our command team.
          </motion.p>
        </motion.section>

        {/* Sliding Main Content Section */}
        <section className="container-site relative z-10 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="rounded-3xl glass-heavy p-8 sm:p-12 border border-white/15 shadow-2xl space-y-8 relative overflow-hidden"
          >
            {/* Top Corner Glow */}
            <div 
              aria-hidden="true" 
              className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#ff1e4b]/15 blur-3xl" 
            />

            {/* Header Strip */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#ff1e4b] block">
                  ENTERPRISE SUPPORT DESK
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white mt-0.5 tracking-tight font-heading">
                  CREATE SUPPORT TICKET
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10">
                <Lock className="size-3.5 text-[#ff1e4b]" />
                <span>DIRECT DISPATCH</span>
              </div>
            </div>

            {/* ═══ SUCCESS SCREEN WITH SLIDING ANIMATION ═══ */}
            {createdTicket ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="py-12 text-center space-y-6"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                  <CheckCircle2 className="size-12 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl font-heading">
                    SUPPORT REQUEST RECEIVED
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto font-sans">
                    Your request has been saved to the Dragon Studios PostgreSQL CRM database. Our staff will review your submission shortly.
                  </p>
                </div>

                {/* Ticket ID Box */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex flex-col items-center gap-1 rounded-2xl bg-black/60 p-6 border border-white/15 shadow-xl max-w-md w-full font-mono"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">TICKET REFERENCE NUMBER</span>
                  <span className="text-2xl font-black tracking-wider text-[#ff1e4b] font-heading">{createdTicket.ticketId}</span>
                  <span className="text-[11px] text-emerald-400 font-bold mt-1">ESTIMATED SLA: {createdTicket.estimatedResponse}</span>
                </motion.div>

                {/* Action Buttons */}
                <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                  <Button
                    onClick={() => {
                      playClick();
                      setCreatedTicket(null);
                    }}
                    variant="outline"
                    size="lg"
                    className="rounded-xl text-xs font-mono font-bold"
                  >
                    SUBMIT ANOTHER REQUEST
                  </Button>

                  <Button
                    variant="solidRed"
                    size="lg"
                    className="rounded-xl text-xs font-mono font-bold gap-2"
                    asChild
                  >
                    <Link href={`/support/${createdTicket.ticketId}?token=${createdTicket.trackingToken}`} onClick={playClick}>
                      <span>TRACK TICKET STATUS</span>
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* ═══ SUPPORT TICKET FORM WITH SLIDING STAGGER ═══ */
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                {/* API Error Notification */}
                <AnimatePresence>
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      className="rounded-2xl bg-red-500/20 border border-red-500/40 p-4 text-xs font-mono text-red-300 flex items-center justify-between shadow-lg"
                    >
                      <span>{apiError}</span>
                      <button type="button" onClick={() => setApiError(null)}>
                        <XIcon className="size-4 hover:text-white transition-colors" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 1. Category Selection Dropdown Grid */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-3"
                >
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white">
                    1. Select Ticket Category <span className="text-[#ff1e4b]">*</span>
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {CATEGORIES.map((cat) => {
                      const IconComp = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <motion.button
                          key={cat.id}
                          type="button"
                          variants={staggerItem}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            playClick();
                            setCategory(cat.id);
                          }}
                          className={cn(
                            "flex flex-col gap-1.5 rounded-2xl p-4 text-left border transition-all relative overflow-hidden",
                            isSelected
                              ? "bg-[#ff1e4b]/20 text-white border-[#ff1e4b] shadow-lg shadow-[#ff1e4b]/30"
                              : "bg-black/40 text-muted-foreground border-white/10 hover:border-white/25 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <IconComp className={cn("size-4 shrink-0", isSelected ? "text-[#ff1e4b]" : "text-muted-foreground")} />
                            <span className="text-xs font-bold uppercase tracking-wider font-mono">{cat.label}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground leading-snug font-sans">{cat.desc}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* 2. Personal Information with Slide Effects */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="grid gap-6 sm:grid-cols-2"
                >
                  <motion.div variants={slideInLeft}>
                    <label 
                      htmlFor="name-input"
                      className={cn(
                        "block text-xs font-mono font-bold uppercase tracking-wider mb-2 transition-colors",
                        focusedField === "name" ? "text-[#ff1e4b]" : "text-white"
                      )}
                    >
                      Your Full Name <span className="text-[#ff1e4b]">*</span>
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className={cn(
                        "w-full rounded-xl bg-black/60 px-4 py-3.5 text-xs text-white placeholder:text-muted-foreground border focus:outline-none focus:border-[#ff1e4b] font-mono transition-all shadow-inner",
                        errors.name ? "border-red-500" : "border-white/10"
                      )}
                    />
                    {errors.name && <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.name}</p>}
                  </motion.div>

                  <motion.div variants={slideInRight}>
                    <label 
                      htmlFor="email-input"
                      className={cn(
                        "block text-xs font-mono font-bold uppercase tracking-wider mb-2 transition-colors",
                        focusedField === "email" ? "text-[#ff1e4b]" : "text-white"
                      )}
                    >
                      Your Email Address <span className="text-[#ff1e4b]">*</span>
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className={cn(
                        "w-full rounded-xl bg-black/60 px-4 py-3.5 text-xs text-white placeholder:text-muted-foreground border focus:outline-none focus:border-[#ff1e4b] font-mono transition-all shadow-inner",
                        errors.email ? "border-red-500" : "border-white/10"
                      )}
                    />
                    {errors.email && <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.email}</p>}
                  </motion.div>
                </motion.div>

                {/* 3. Subject Line */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <label 
                    htmlFor="subject-input"
                    className={cn(
                      "block text-xs font-mono font-bold uppercase tracking-wider mb-2 transition-colors",
                      focusedField === "subject" ? "text-[#ff1e4b]" : "text-white"
                    )}
                  >
                    Subject Line <span className="text-[#ff1e4b]">*</span>
                  </label>
                  <input
                    id="subject-input"
                    type="text"
                    value={subject}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your inquiry..."
                    className={cn(
                      "w-full rounded-xl bg-black/60 px-4 py-3.5 text-xs text-white placeholder:text-muted-foreground border focus:outline-none focus:border-[#ff1e4b] font-mono transition-all shadow-inner",
                      errors.subject ? "border-red-500" : "border-white/10"
                    )}
                  />
                  {errors.subject && <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.subject}</p>}
                </motion.div>

                {/* 4. Detailed Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label 
                      htmlFor="message-input"
                      className={cn(
                        "block text-xs font-mono font-bold uppercase tracking-wider transition-colors",
                        focusedField === "message" ? "text-[#ff1e4b]" : "text-white"
                      )}
                    >
                      Detailed Description <span className="text-[#ff1e4b]">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">{message.length} / 5000 chars</span>
                  </div>
                  <textarea
                    id="message-input"
                    rows={6}
                    value={message}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please include full reproduction steps, error codes, system specs, or details..."
                    className={cn(
                      "w-full rounded-xl bg-black/60 p-4 text-xs text-white placeholder:text-muted-foreground border focus:outline-none focus:border-[#ff1e4b] font-mono resize-y transition-all shadow-inner",
                      errors.message ? "border-red-500" : "border-white/10"
                    )}
                  />
                  {errors.message && <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.message}</p>}
                </motion.div>

                {/* 5. Attachment File Upload */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white">
                    5. Attachments <span className="text-muted-foreground font-normal">(Optional, Max 25MB: PNG, JPEG, ZIP, PDF, DOCX, TXT)</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".png,.jpg,.jpeg,.webp,.pdf,.zip,.docx,.txt"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-2 text-xs shrink-0 w-full sm:w-auto font-mono"
                    >
                      {uploading ? <Loader2 className="size-4 animate-spin text-[#ff1e4b]" /> : <UploadCloud className="size-4 text-[#ff1e4b]" />}
                      <span>{uploading ? "UPLOADING..." : "UPLOAD FILE"}</span>
                    </Button>
                    <span className="text-[11px] text-muted-foreground font-mono">Drag & drop or click to attach crash logs or screenshots.</span>
                  </div>

                  {uploadError && (
                    <p className="text-xs text-red-400 font-mono">{uploadError}</p>
                  )}

                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-xl bg-black/40 px-3 py-1.5 border border-white/15 text-xs font-mono text-white"
                        >
                          <Paperclip className="size-3.5 text-[#ff1e4b]" />
                          <span>{file.name} ({file.size})</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="text-muted-foreground hover:text-red-400 ml-1"
                          >
                            <XIcon className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* 6. Legal Agreement Checkboxes */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="space-y-3 pt-4 border-t border-white/10"
                >
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer text-xs text-muted-foreground select-none font-sans">
                      <input
                        type="checkbox"
                        checked={privacyAgree}
                        onChange={(e) => setPrivacyAgree(e.target.checked)}
                        className="size-4 rounded bg-black/60 border-white/20 text-[#ff1e4b] focus:ring-[#ff1e4b]"
                      />
                      <span>
                        I agree to the{" "}
                        <Link href="/privacy" className="text-white underline hover:text-[#ff1e4b]">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.privacyAgree && <p className="text-[11px] text-red-400 font-mono mt-0.5">{errors.privacyAgree}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer text-xs text-muted-foreground select-none font-sans">
                      <input
                        type="checkbox"
                        checked={termsAgree}
                        onChange={(e) => setTermsAgree(e.target.checked)}
                        className="size-4 rounded bg-black/60 border-white/20 text-[#ff1e4b] focus:ring-[#ff1e4b]"
                      />
                      <span>
                        I agree to the{" "}
                        <Link href="/terms" className="text-white underline hover:text-[#ff1e4b]">
                          Terms of Service
                        </Link>
                      </span>
                    </label>
                    {errors.termsAgree && <p className="text-[11px] text-red-400 font-mono mt-0.5">{errors.termsAgree}</p>}
                  </div>
                </motion.div>

                {/* Submit Button with Hover Slide */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={formLoading}
                    variant="solidRed"
                    size="xl"
                    className="w-full rounded-xl gap-3 text-sm font-black uppercase tracking-[0.16em] font-mono shadow-xl shadow-[#ff1e4b]/20"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        <span>CREATING TICKET...</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-5" />
                        <span>SUBMIT SUPPORT TICKET</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </section>

        {/* Real Official Networks Bar */}
        <section className="container-site relative z-10 pt-16 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl glass-heavy p-8 border border-white/15 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#ff1e4b] block">
                  OFFICIAL NETWORKS
                </span>
                <h3 className="text-lg font-black uppercase text-white tracking-tight mt-0.5 font-heading">
                  COMMUNITY & BROADCAST CHANNELS
                </h3>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
              <a
                href={OFFICIAL_SOCIALS.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <Instagram className="size-4 text-pink-400" />
                  <span className="font-bold text-white">Instagram</span>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={OFFICIAL_SOCIALS.youtube.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <Youtube className="size-4 text-red-400" />
                  <span className="font-bold text-white">YouTube</span>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={OFFICIAL_SOCIALS.x.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/40 hover:bg-sky-500/10 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <Twitter className="size-4 text-sky-400" />
                  <span className="font-bold text-white">X (Twitter)</span>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={OFFICIAL_SOCIALS.reddit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="size-4 text-orange-400" />
                  <span className="font-bold text-white">Reddit Hub</span>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
