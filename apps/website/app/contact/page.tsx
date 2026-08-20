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
  Copy,
  Check,
  Inbox,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SceneBackground } from "@/components/background/SceneBackground";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { OFFICIAL_SOCIALS } from "@/lib/site";
import { WhatsAppIcon, ThreadsIcon } from "@/components/ui/social-icons";
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
  const playClick = () => {};
  const playSuccess = () => {};
  const playError = () => {};

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
  const [copiedTicketId, setCopiedTicketId] = useState(false);

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

  const handleCopyTicket = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    setCopiedTicketId(true);
    setTimeout(() => setCopiedTicketId(false), 2000);
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
        {/* Hero Header System */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="container-site relative pt-12 pb-12 lg:pt-16 lg:pb-20 max-w-4xl mx-auto text-center space-y-4"
        >
          <motion.div 
            variants={scaleIn}
            className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <ShieldCheck className="size-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-300">
              DRAGON STUDIOS SUPPORT GATEWAY
            </span>
          </motion.div>

          <motion.h1 
            variants={slideInLeft}
            className="text-4xl font-black uppercase tracking-tight sm:text-6xl lg:text-7xl text-white leading-[0.9] font-heading drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
          >
            SUPPORT & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">COMMUNICATION</span>
          </motion.h1>

          <motion.p 
            variants={slideInRight}
            className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-sans"
          >
            Direct enterprise ticket channel to Dragon Studios operations. Submissions generate an immediate ticket reference, dispatch email notifications, and route live to our command team.
          </motion.p>
        </motion.section>

        {/* Main Content Section */}
        <section className="container-site relative z-10 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="rounded-3xl bg-[#040A18]/90 backdrop-blur-2xl p-8 sm:p-12 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-8 relative overflow-hidden"
          >
            {/* Top Corner Glow */}
            <div 
              aria-hidden="true" 
              className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" 
            />

            {/* Header Strip */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400 block">
                  ENTERPRISE SUPPORT DESK
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white mt-0.5 tracking-tight font-heading">
                  CREATE SUPPORT TICKET
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-[#020612] px-3.5 py-1.5 rounded-xl border border-cyan-500/30 shadow-inner">
                <Lock className="size-3.5 text-cyan-400" />
                <span>DIRECT DISPATCH</span>
              </div>
            </div>

            {/* ═══ SUCCESS SCREEN WITH CYBERPUNK BLUE-BLACK STYLING ═══ */}
            {createdTicket ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="py-10 text-center space-y-6"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/15 border-2 border-cyan-400 text-cyan-400 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
                  <CheckCircle2 className="size-12 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase text-white tracking-tight sm:text-4xl font-heading">
                    SUPPORT REQUEST RECEIVED
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-sans">
                    Your request has been securely registered in the Dragon Studios CRM system and sent to your email address and admin command desk.
                  </p>
                </div>

                {/* Ticket Reference Box */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto rounded-3xl bg-[#020614] p-6 sm:p-8 border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] max-w-md w-full font-mono space-y-3 relative overflow-hidden"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    TICKET REFERENCE NUMBER
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl sm:text-3xl font-black tracking-wider text-cyan-400 font-heading drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">
                      {createdTicket.ticketId}
                    </span>
                    <button
                      onClick={() => handleCopyTicket(createdTicket.ticketId)}
                      className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:text-white transition-all cursor-pointer"
                      title="Copy Ticket ID"
                    >
                      {copiedTicketId ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                    </button>
                  </div>

                  <div className="text-[11px] text-emerald-400 font-bold tracking-wider uppercase border-t border-white/10 pt-3">
                    ESTIMATED SLA: {createdTicket.estimatedResponse}
                  </div>
                </motion.div>

                {/* Action Buttons System */}
                <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                  <Button
                    onClick={() => {
                      playClick();
                      setCreatedTicket(null);
                    }}
                    variant="outline"
                    size="lg"
                    className="rounded-2xl border-cyan-500/30 text-xs font-mono font-bold text-slate-300 hover:text-white hover:border-cyan-400 bg-[#020612]"
                  >
                    SUBMIT ANOTHER REQUEST
                  </Button>

                  <Link
                    href="/dashboard?tab=notifications"
                    onClick={playClick}
                    className="px-6 py-3 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:text-white font-mono font-bold text-xs uppercase flex items-center gap-2 transition-all shadow-lg"
                  >
                    <Inbox className="size-4" />
                    <span>MY DASHBOARD INBOX</span>
                  </Link>

                  <Link
                    href={`/support/${createdTicket.ticketId}?token=${createdTicket.trackingToken}`}
                    onClick={playClick}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-mono font-black text-xs uppercase flex items-center gap-2 transition-all shadow-xl shadow-cyan-500/30 hover:scale-105"
                  >
                    <span>TRACK TICKET STATUS</span>
                    <ExternalLink className="size-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ═══ SUPPORT TICKET FORM ═══ */
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
                    1. Select Ticket Category <span className="text-cyan-400">*</span>
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
                            "flex flex-col gap-1.5 rounded-2xl p-4 text-left border transition-all relative overflow-hidden cursor-pointer",
                            isSelected
                              ? "bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-blue-500/30 text-white border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                              : "bg-[#020612] text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <IconComp className={cn("size-4 shrink-0", isSelected ? "text-cyan-400" : "text-slate-400")} />
                            <span className="text-xs font-bold uppercase tracking-wider font-mono">{cat.label}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 leading-snug font-sans">{cat.desc}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* 2. Personal Information Fields */}
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
                        focusedField === "name" ? "text-cyan-400" : "text-white"
                      )}
                    >
                      Your Full Name <span className="text-cyan-400">*</span>
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
                        "w-full rounded-2xl bg-[#020612] px-4 py-3.5 text-xs text-white placeholder:text-slate-500 border focus:outline-none focus:border-cyan-400 font-mono transition-all shadow-inner",
                        errors.name ? "border-red-500" : "border-cyan-500/30"
                      )}
                    />
                    {errors.name && <p className="mt-1 text-[11px] text-red-400 font-mono">{errors.name}</p>}
                  </motion.div>

                  <motion.div variants={slideInRight}>
                    <label 
                      htmlFor="email-input"
                      className={cn(
                        "block text-xs font-mono font-bold uppercase tracking-wider mb-2 transition-colors",
                        focusedField === "email" ? "text-cyan-400" : "text-white"
                      )}
                    >
                      Your Email Address <span className="text-cyan-400">*</span>
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
                        "w-full rounded-2xl bg-[#020612] px-4 py-3.5 text-xs text-white placeholder:text-slate-500 border focus:outline-none focus:border-cyan-400 font-mono transition-all shadow-inner",
                        errors.email ? "border-red-500" : "border-cyan-500/30"
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
                      focusedField === "subject" ? "text-cyan-400" : "text-white"
                    )}
                  >
                    Subject Line <span className="text-cyan-400">*</span>
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
                      "w-full rounded-2xl bg-[#020612] px-4 py-3.5 text-xs text-white placeholder:text-slate-500 border focus:outline-none focus:border-cyan-400 font-mono transition-all shadow-inner",
                      errors.subject ? "border-red-500" : "border-cyan-500/30"
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
                        focusedField === "message" ? "text-cyan-400" : "text-white"
                      )}
                    >
                      Detailed Description <span className="text-cyan-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">{message.length} / 5000 chars</span>
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
                      "w-full rounded-2xl bg-[#020612] p-4 text-xs text-white placeholder:text-slate-500 border focus:outline-none focus:border-cyan-400 font-mono resize-y transition-all shadow-inner",
                      errors.message ? "border-red-500" : "border-cyan-500/30"
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
                    5. Attachments <span className="text-slate-400 font-normal">(Optional, Max 25MB: PNG, JPEG, ZIP, PDF, DOCX, TXT)</span>
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
                      className="rounded-2xl border-cyan-500/30 text-cyan-300 hover:border-cyan-400 bg-[#020612] gap-2 text-xs shrink-0 w-full sm:w-auto font-mono cursor-pointer"
                    >
                      {uploading ? <Loader2 className="size-4 animate-spin text-cyan-400" /> : <UploadCloud className="size-4 text-cyan-400" />}
                      <span>{uploading ? "UPLOADING..." : "UPLOAD FILE"}</span>
                    </Button>
                    <span className="text-[11px] text-slate-400 font-mono">Drag & drop or click to attach crash logs or screenshots.</span>
                  </div>

                  {uploadError && (
                    <p className="text-xs text-red-400 font-mono">{uploadError}</p>
                  )}

                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-xl bg-black/60 px-3 py-1.5 border border-cyan-500/30 text-xs font-mono text-white"
                        >
                          <Paperclip className="size-3.5 text-cyan-400" />
                          <span>{file.name} ({file.size})</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="text-slate-400 hover:text-red-400 ml-1"
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
                    <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300 select-none font-sans">
                      <input
                        type="checkbox"
                        checked={privacyAgree}
                        onChange={(e) => setPrivacyAgree(e.target.checked)}
                        className="size-4 rounded bg-[#020612] border-cyan-500/30 text-cyan-400 focus:ring-cyan-400"
                      />
                      <span>
                        I agree to the{" "}
                        <Link href="/privacy" className="text-cyan-400 underline hover:text-cyan-300">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.privacyAgree && <p className="text-[11px] text-red-400 font-mono mt-0.5">{errors.privacyAgree}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300 select-none font-sans">
                      <input
                        type="checkbox"
                        checked={termsAgree}
                        onChange={(e) => setTermsAgree(e.target.checked)}
                        className="size-4 rounded bg-[#020612] border-cyan-500/30 text-cyan-400 focus:ring-cyan-400"
                      />
                      <span>
                        I agree to the{" "}
                        <Link href="/terms" className="text-cyan-400 underline hover:text-cyan-300">
                          Terms of Service
                        </Link>
                      </span>
                    </label>
                    {errors.termsAgree && <p className="text-[11px] text-red-400 font-mono mt-0.5">{errors.termsAgree}</p>}
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-4"
                >
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-black font-mono font-black text-sm uppercase tracking-[0.16em] flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all cursor-pointer"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="size-5 animate-spin fill-black" />
                        <span>CREATING TICKET...</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-5 fill-black" />
                        <span>SUBMIT SUPPORT TICKET</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </section>

        {/* Official Networks Bar */}
        <section className="container-site relative z-10 pt-16 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-[#040A18]/90 backdrop-blur-2xl p-8 border border-cyan-500/30 space-y-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400 block">
                  OFFICIAL NETWORKS
                </span>
                <h3 className="text-lg font-black uppercase text-white tracking-tight mt-0.5 font-heading">
                  COMMUNITY & BROADCAST CHANNELS
                </h3>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono">
              <a
                href={OFFICIAL_SOCIALS.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <WhatsAppIcon className="size-4 text-emerald-400" />
                  <span className="font-bold text-white">WhatsApp Channel</span>
                </div>
                <ArrowUpRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={OFFICIAL_SOCIALS.threads.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all text-xs group"
              >
                <div className="flex items-center gap-3">
                  <ThreadsIcon className="size-4 text-cyan-400" />
                  <span className="font-bold text-white">Threads Feed</span>
                </div>
                <ArrowUpRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

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
                <ArrowUpRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
                <ArrowUpRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
                <ArrowUpRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
                <ArrowUpRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </SceneBackground>
  );
}
