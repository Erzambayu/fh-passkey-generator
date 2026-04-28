"use client";

import { useState } from "react";
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
  Zap,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
  const [shakeError, setShakeError] = useState(false);

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
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
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
      {/* background */}
      <div className="neo-bg" />
      <div className="neo-dots" />

      {/* main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center gap-5 relative z-10 w-full max-w-md"
      >
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="neo-badge"
        >
          <Zap className="w-3.5 h-3.5" />
          WiFi Password Generator
        </motion.div>

        {/* main card */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className={`neo-card w-full p-7 ${shakeError ? "animate-shake" : ""}`}
        >
          {/* header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="sticker p-2.5 rounded-xl bg-primary/20 border-2 border-border">
              <Router className="w-6 h-6 text-primary-dark" aria-hidden="true" />
            </div>
            <h1 className="font-bold text-2xl tracking-tight text-text">
              FH Passkey Generator
            </h1>
          </div>

          {/* form */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Network
                className="w-3.5 h-3.5 text-primary-dark"
                aria-hidden="true"
              />
              <label
                htmlFor="wlan-input"
                className="text-sm font-bold text-text uppercase tracking-wider"
              >
                SSID Name
              </label>
            </div>

            <input
              id="wlan-input"
              type="text"
              className="input-neo px-4 py-3 w-full text-sm"
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
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 border-2 border-red-400 text-red-600 text-sm font-bold"
                >
                  <span>⚠️</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              className="btn-neo px-4 py-3 text-sm w-full flex items-center justify-center gap-2"
              onClick={handleGetPasskey}
              disabled={loading || !ssid.trim()}
            >
              {loading ? (
                <span>Generating...</span>
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
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-sm font-bold text-text-muted"
        >
          is this helpful?{" "}
          <button
            className="text-primary-dark hover:text-primary underline underline-offset-4 decoration-2 decoration-primary cursor-pointer transition-colors"
            onClick={() => setShowDonate(true)}
          >
            click here
          </button>
        </motion.div>

        {/* social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="social-neo"
            href="https://github.com/erzambayu"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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
            className="social-neo"
            href="https://instagram.com/erzam.bayu"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 neo-overlay flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowResult(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              className="neo-modal p-6 w-full max-w-sm"
            >
              {/* modal header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="sticker p-1.5 rounded-lg bg-accent border-2 border-border">
                    <ShieldCheck className="w-4 h-4 text-text" />
                  </div>
                  <h2 className="font-bold text-xl text-text">Passkey</h2>
                </div>
                <button
                  onClick={() => setShowResult(false)}
                  className="p-1.5 rounded-lg border-2 border-border hover:bg-secondary transition-colors cursor-pointer bg-white box-shadow: 2px 2px 0px"
                  style={{ boxShadow: "2px 2px 0px var(--color-border)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* result info */}
              <div className="flex flex-col gap-3 mb-5">
                <div className="neo-info flex items-center gap-3 p-3">
                  <div className="p-1.5 rounded-lg bg-blue-100 border-2 border-border">
                    <Wifi className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                      SSID
                    </span>
                    <span className="text-sm font-bold text-text">
                      {ssid.trim()}
                    </span>
                  </div>
                </div>
                <div className="neo-info flex items-center gap-3 p-3">
                  <div className="p-1.5 rounded-lg bg-primary/20 border-2 border-border">
                    <Key className="w-4 h-4 text-primary-dark" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                      Password
                    </span>
                    <span className="text-sm font-mono font-bold text-text tracking-wider">
                      {password}
                    </span>
                  </div>
                </div>
              </div>

              {/* copy button */}
              <button
                type="button"
                onClick={handleCopy}
                className={`w-full px-4 py-3 text-sm flex items-center justify-center gap-2 cursor-pointer ${
                  copied ? "btn-neo-success" : "btn-neo"
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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 neo-overlay flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowDonate(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              className="neo-modal p-6 w-full max-w-sm"
            >
              {/* modal header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="sticker p-1.5 rounded-lg bg-secondary border-2 border-border">
                    <Coffee className="w-4 h-4 text-text" />
                  </div>
                  <h2 className="font-bold text-xl text-text">
                    Buy me a coffee
                  </h2>
                </div>
                <button
                  onClick={() => setShowDonate(false)}
                  className="p-1.5 rounded-lg border-2 border-border hover:bg-secondary transition-colors cursor-pointer bg-white"
                  style={{ boxShadow: "2px 2px 0px var(--color-border)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-text-muted text-center mb-4 leading-relaxed font-bold">
                Jika aplikasi ini membantu kamu, pertimbangkan untuk memberikan
                dukungan dengan scan QR code ini ☺️
              </p>

              <div className="flex flex-col items-center justify-center rounded-xl bg-white p-3 border-2 border-border"
                style={{ boxShadow: "4px 4px 0px var(--color-border)" }}
              >
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
