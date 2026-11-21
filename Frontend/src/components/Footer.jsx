import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Terminal, Cpu, CheckCircle2, ExternalLink, Mail, Phone, MapPin, Code } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { playSound } from "../utils/audio";

export default function Footer({ onOpenHardwareSpecs }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#040609] border-t border-white/[0.07] overflow-hidden pt-16 pb-12">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-emerald-500/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/[0.06]">
          
          {/* Brand & Summary (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                FORTIX<span className="text-emerald-400">.</span> Locker
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Enterprise IoT hardware & cryptographic digital vault infrastructure. 
              Designed for high-assurance physical access, zero-trust tokenization, 
              and real-time tamper-evident audit trails.
            </p>

            {/* Compliance / Security badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>AES-256 GCM</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-cyan-400">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                <span>SHA-256 HMAC</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-slate-400" />
                <span>ESP32 / LoRa Ready</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Navigation
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors" onClick={() => playSound("keypress")}>
                  Vault Overview
                </Link>
              </li>
              <li>
                <a href="#simulator" className="hover:text-emerald-400 transition-colors" onClick={() => playSound("keypress")}>
                  Interactive Simulator
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors" onClick={() => playSound("keypress")}>
                  Vault Console
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-emerald-400 transition-colors" onClick={() => playSound("keypress")}>
                  Access Audit Ledger
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors" onClick={() => playSound("keypress")}>
                  Operator Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Hardware & Security */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Hardware Architecture
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => { playSound("keypress"); if (onOpenHardwareSpecs) onOpenHardwareSpecs(); }}
                  className="hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ESP32 Circuit Schematics</span>
                </button>
              </li>
              <li>
                <span className="text-slate-400">12V Solenoid Magnetic Lock</span>
              </li>
              <li>
                <span className="text-slate-400">16x2 I2C Liquid Crystal Bus</span>
              </li>
              <li>
                <span className="text-slate-400">4x4 Matrix Keypad Interface</span>
              </li>
              <li>
                <span className="text-slate-400">Piezo Tamper & Anti-Vibration</span>
              </li>
            </ul>
          </div>

          {/* Author & Verification */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Project Verification
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="text-slate-300 font-medium">Akash Yatin Jain</p>
              <p className="text-xs text-slate-500">Full-Stack Security & Embedded Systems</p>
              <a
                href="https://github.com/Akashyatinjain/Smart-Secured-Locker"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors pt-1"
              >
                <FiGithub className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>ALL LOCKER RELAYS SYNCHRONIZED • UPTIME 99.98%</span>
          </div>
          <p>© {currentYear} Smart Secured Locker System. Built for real-world enterprise evaluation.</p>
        </div>

      </div>
    </footer>
  );
}
