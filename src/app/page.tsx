"use client";

import { useState, useEffect } from "react";
import {
  Router,
  Network,
  Key,
  Wifi,
  ShieldCheck,
  Copy,
  Coffee,
  Check,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function Particles() {
  const [particles, setParticles] = useState<
    { id: number; left: string; size: number; delay: string; duration: string; color: string }[]
  >([]);

  useEffect(() => {
    const colors = [
      "rgba(167, 139, 250, 0.3)",
      "rgba(56, 189, 248, 0.3)",
      "rgba(244, 114, 182, 0.2)",
      "rgba(167, 139, 250, 0.15)",
    ];
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 15 + 15}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(p);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
}

export default function Home() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [copyText, setCopyText] = useState("Copy Password");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showDonate, setShowDonate] = useState(false);

  function generatePassword(ssidInput: string): string | null {
    if (!ssidInput || !ssidInput.toLowerCase().startsWith("fh_")) {
      return null;
    }
    let code = ssidInput.slice(3);
    if (code.toUpperCase().endsWith("_5G")) {
      code = code.slice(0, -3);
    }
    if (!/^[0-9a-fA-F]{6}$/.test(code)) {
      return null;
    }
    let result = "";
    for (const char of code.toLowerCase()) {
      const value = parseInt(char, 16);
      const complement = 0xf - value;
      result += complement.toString(16);
    }
    return "wlan" + result;
  }

  const handleGenerate = () => {
    setLoading(true);
    setError("");
    const trimmed = ssid.trim();
    const result = generatePassword(trimmed);
    if (result) {
      setPassword(result);
      setIsValid(true);
      setLoading(false);
      return true;
    } else {
      setError("SSID tidak valid!");
      setPassword("");
      setIsValid(false);
      setLoading(false);
      return false;
    }
  };

  const handleGetPasskey = () => {
    const success = handleGenerate();
    if (success) {
      setCopyText("Copy Password");
      setCopied(false);
      setShowResult(true);
    }
  };

  const handleCopy = async () => {
    if (isValid && password !== "Invalid input") {
      try {
        await navigator.clipboard.writeText(password);
        setCopyText("Copied!");
        setCopied(true);
        setTimeout(() => {
          setCopyText("Copy Password");
          setCopied(false);
        }, 2000);
      } catch {
        setCopyText("Copy Failed");
        setTimeout(() => setCopyText("Copy Password"), 1500);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && ssid.trim()) {
      handleGetPasskey();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* background layers */}
      <div className="bg-gradient-animated" />
      <div className="bg-noise" />
      <Particles />

      {/* main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center gap-5 relative z-10 w-full max-w-md"
      >
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="badge"
        >
          <Sparkles className="w-3 h-3" />
          WiFi Password Generator
        </motion.div>

        {/* main card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-card pulse-glow w-full p-8"
        >
          {/* header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20">
              <Router className="w-6 h-6 text-violet-400" aria-hidden="true" />
            </div>
            <h1 className="gradient-text font-bold text-2xl tracking-tight">
              FH Passkey Generator
            </h1>
          </div>

          {/* form */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Network
                className="w-3.5 h-3.5 text-violet-400/70"
                aria-hidden="true"
              />
              <label
                htmlFor="wlan-input"
                className="text-sm font-semibold text-slate-300 uppercase tracking-wider"
              >
                SSID Name
              </label>
            </div>

            <input
              id="wlan-input"
              type="text"
              className="input-glass px-4 py-3 w-full text-sm"
              placeholder="fh_XxXxXx / fh_XxXxXx_5G"
              value={ssid}
              onChange={(e) => {
                setSsid(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={handleKeyDown}
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-400/90 flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="button"
              className="btn-glow px-4 py-3 text-sm w-full flex items-center justify-center gap-2"
              onClick={handleGetPasskey}
              disabled={loading || !ssid.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Get Passkey</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* helpful link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm text-slate-500"
        >
          is this helpful?{" "}
          <button
            className="text-violet-400/80 hover:text-violet-300 transition-colors cursor-pointer underline underline-offset-2"
            onClick={() => setShowDonate(true)}
          >
            click here
          </button>
        </motion.div>

        {/* social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            href="https://github.com/erzambayu"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            href="https://instagram.com/erzam.bayu"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
        </motion.div>
      </motion.div>

      {/* result dialog */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowResult(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="glass-modal p-6 w-full max-w-sm"
            >
              {/* modal header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                  </div>
                  <h2 className="font-bold text-lg text-slate-100">Passkey</h2>
                </div>
                <button
                  onClick={() => setShowResult(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* result info */}
              <div className="flex flex-col gap-3 mb-5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Wifi className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                      SSID
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      {ssid.trim()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Key className="w-4 h-4 text-violet-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                      Password
                    </span>
                    <span className="text-sm font-mono font-bold text-violet-300 tracking-wider">
                      {password}
                    </span>
                  </div>
                </div>
              </div>

              {/* copy button */}
              <button
                type="button"
                onClick={handleCopy}
                className={`w-full px-4 py-3 text-sm flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                  copied
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : "btn-glow"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{copyText}</span>
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* donate dialog */}
      <AnimatePresence>
        {showDonate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowDonate(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="glass-modal p-6 w-full max-w-sm"
            >
              {/* modal header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Coffee className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 className="font-bold text-lg text-slate-100">
                    Buy me a coffee
                  </h2>
                </div>
                <button
                  onClick={() => setShowDonate(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-400 text-center mb-4 leading-relaxed">
                Jika aplikasi ini membantu kamu, pertimbangkan untuk memberikan
                dukungan dengan scan QR code ini ☺️
              </p>

              <div className="flex flex-col items-center justify-center rounded-xl bg-white p-3">
                <Image
                  src="/qr.png"
                  alt="QR Code"
                  width={5000}
                  height={5000}
                  className="w-60 h-72 object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
