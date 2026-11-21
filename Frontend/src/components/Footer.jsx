import React from "react";
import { Link } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { playSound } from "../utils/audio";

export default function Footer({ onOpenHardwareSpecs }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-12 text-sm text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-200">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900">SecureLocker</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Smart IoT physical locker management system with real-time OTP verification, 
              automatic relocking, and complete audit tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
              Product
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-emerald-600 transition-colors" onClick={() => playSound("keypress")}>
                  Overview
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-emerald-600 transition-colors" onClick={() => playSound("keypress")}>
                  Live Demo
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-600 transition-colors" onClick={() => playSound("keypress")}>
                  Features
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-600 transition-colors" onClick={() => playSound("keypress")}>
                  Locker Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-emerald-600 transition-colors" onClick={() => playSound("keypress")}>
                  Access History
                </Link>
              </li>
            </ul>
          </div>

          {/* IoT & Tech */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
              Technology
            </p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>ESP32 & Arduino Compatible</li>
              <li>12V Electromagnetic Solenoid Lock</li>
              <li>16x2 I2C Display Interface</li>
              <li>Bcrypt & AES-256 Hashing</li>
              <li>
                <button
                  onClick={() => { playSound("keypress"); if (onOpenHardwareSpecs) onOpenHardwareSpecs(); }}
                  className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  View Circuit Specs →
                </button>
              </li>
            </ul>
          </div>

          {/* Author info */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
              Developer
            </p>
            <p className="text-xs text-slate-800 font-medium">Akash Yatin Jain</p>
            <p className="text-xs text-slate-500">St. Francis Institute of Technology</p>
            <a
              href="https://github.com/Akashyatinjain/Smart-Secured-Locker"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-700 hover:text-emerald-600 transition-colors pt-1"
            >
              <FiGithub className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} Smart Secured Locker. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Cloud Backend Online</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
