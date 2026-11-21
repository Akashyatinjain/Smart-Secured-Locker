import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Unlock,
  KeyRound,
  Smartphone,
  Cpu,
  Clock,
  CheckCircle2,
  ArrowRight,
  Send,
  Sparkles,
  History,
  RotateCcw
} from "lucide-react";
import confetti from "canvas-confetti";
import emailjs from "emailjs-com";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LockerVisualizer from "../components/LockerVisualizer";
import HardwareSpecsModal from "../components/HardwareSpecsModal";
import { playSound } from "../utils/audio";
import { getCurrentUser } from "../services/lockerAPI";

export default function HomePage() {
  const [user] = useState(() => getCurrentUser());
  const [hardwareModalOpen, setHardwareModalOpen] = useState(false);

  // Demo State
  const [simStatus, setSimStatus] = useState("LOCKED");
  const [simOtp, setSimOtp] = useState(["", "", "", "", "", ""]);
  const [activeCode, setActiveCode] = useState("849201");
  const [simCountdown, setSimCountdown] = useState(0);
  const [message, setMessage] = useState(null);

  // Contact form state
  const [contactStatus, setContactStatus] = useState(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const contactFormRef = useRef(null);

  // Auto-relock watchdog countdown
  useEffect(() => {
    let timer;
    if (simStatus === "UNLOCKED" && simCountdown > 0) {
      timer = setInterval(() => {
        setSimCountdown((prev) => {
          if (prev <= 1) {
            setSimStatus("LOCKED");
            playSound("lock");
            setMessage({ type: "info", text: "Locker has automatically relocked." });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [simStatus, simCountdown]);

  // Handle OTP Keypad Input
  const handleOtpInput = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    playSound("keypress");
    const updated = [...simOtp];
    updated[index] = val.slice(-1);
    setSimOtp(updated);

    if (val && index < 5) {
      const nextInput = document.getElementById(`home-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !simOtp[index] && index > 0) {
      const prev = document.getElementById(`home-otp-${index - 1}`);
      if (prev) {
        prev.focus();
        const updated = [...simOtp];
        updated[index - 1] = "";
        setSimOtp(updated);
      }
    } else if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleGenerateCode = () => {
    playSound("keypress");
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveCode(newCode);
    setMessage({ type: "info", text: `New code generated: ${newCode}` });
  };

  const handleAutofill = () => {
    playSound("keypress");
    setSimOtp(activeCode.split(""));
  };

  const handleVerify = () => {
    const entered = simOtp.join("");
    if (entered.length < 6) {
      playSound("error");
      setMessage({ type: "error", text: "Please enter all 6 digits." });
      return;
    }

    if (entered === activeCode || entered === "123456") {
      playSound("unlock");
      setSimStatus("UNLOCKED");
      setSimCountdown(10);
      setMessage({ type: "success", text: "Access granted! Locker unlocked for 10 seconds." });

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } else {
      playSound("error");
      setMessage({ type: "error", text: "Invalid code. Please try again." });
    }
  };

  const handleManualRelock = () => {
    playSound("lock");
    setSimStatus("LOCKED");
    setSimCountdown(0);
    setSimOtp(["", "", "", "", "", ""]);
    setMessage({ type: "info", text: "Locker locked manually." });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    playSound("keypress");

    emailjs
      .sendForm(
        "service_56es5kd",
        "template_tczp81a",
        e.target,
        "OOlyyDJ99U5Lc3EEh"
      )
      .then(
        () => {
          setContactSubmitting(false);
          setContactStatus("success");
          playSound("unlock");
          if (contactFormRef.current) contactFormRef.current.reset();
          setTimeout(() => setContactStatus(null), 5000);
        },
        (error) => {
          setContactSubmitting(false);
          setContactStatus("error");
          playSound("error");
          console.error("EmailJS Error:", error);
          setTimeout(() => setContactStatus(null), 5000);
        }
      );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Navbar */}
      <Navbar onOpenHardwareSpecs={() => setHardwareModalOpen(true)} />

      {/* ========================================================
          HERO SECTION (WHITE & CRISP)
      ======================================================== */}
      <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Smart Secured Locker System</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Secure physical storage,{" "}
                <span className="text-emerald-600">
                  controlled by your phone.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Unlock your locker with dynamic one-time passwords generated on your smartphone. 
                No keys to lose, no plastic cards, with automatic relocking and real-time audit logs.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => playSound("keypress")}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to="/sign-up"
                    onClick={() => playSound("keypress")}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <a
                  href="#demo"
                  onClick={() => playSound("keypress")}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span>Try Live Demo</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Keyless</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>&lt; 1s Response</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Automatic 10s Relock</span>
                </div>
              </div>

            </div>

            {/* Right: Clean White Locker Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <LockerVisualizer
                status={simStatus}
                countdown={simCountdown}
                deviceId="Locker #01"
                temperature="24°C"
                onQuickRelock={handleManualRelock}
              />
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          LIVE DEMO SECTION (CLEAN & WHITE)
      ======================================================== */}
      <section id="demo" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Interactive Test
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Test Locker Unlock
            </h2>
            <p className="text-sm text-slate-600">
              Generate an OTP code and see the physical locker unlock in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            
            {/* Visualizer */}
            <div className="lg:col-span-6">
              <LockerVisualizer
                status={simStatus}
                countdown={simCountdown}
                deviceId="Locker #01"
                temperature="24°C"
                onQuickRelock={handleManualRelock}
              />
            </div>

            {/* Code Entry Card */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Keypad Entry</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Enter code or generate one to test</p>
                  </div>
                  <button
                    onClick={handleGenerateCode}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors"
                  >
                    Generate Code
                  </button>
                </div>

                {/* Status Message */}
                {message && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center justify-between ${
                      message.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : message.type === "error"
                        ? "bg-red-50 border border-red-200 text-red-800"
                        : "bg-slate-50 border border-slate-200 text-slate-700"
                    }`}
                  >
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)} className="text-xs opacity-60 hover:opacity-100">
                      ✕
                    </button>
                  </div>
                )}

                {/* Generated Code Display */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Current Valid Code: </span>
                    <span className="font-mono font-bold text-emerald-600 tracking-wider text-base ml-1">
                      {activeCode}
                    </span>
                  </div>
                  <button
                    onClick={handleAutofill}
                    className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs transition-colors shadow-sm"
                  >
                    Auto-fill
                  </button>
                </div>

                {/* 6 Digit Input Boxes */}
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-2.5 text-center">
                    Enter 6-digit access code:
                  </p>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {simOtp.map((val, idx) => (
                      <input
                        key={idx}
                        id={`home-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpInput(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleVerify}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition-all"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Locker</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound("keypress");
                      setSimOtp(["", "", "", "", "", ""]);
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-all"
                  >
                    Clear
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  Tip: Use code <span className="text-slate-700 font-mono font-semibold">123456</span> or click "Auto-fill".
                </p>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          CORE FEATURES (CLEAN WHITE CARDS)
      ======================================================== */}
      <section id="features" className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Features
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Designed for Convenience and Security
            </h2>
            <p className="text-sm text-slate-600">
              Everything needed to manage physical lockers securely without the hassle of keys or plastic cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Mobile OTP Access</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generate 60-second one-time passwords directly from your smartphone or web dashboard to open your locker.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Auto 10s Relocking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The locker door automatically re-secures after 10 seconds, ensuring belongings are never left unprotected.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-4">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Master Passkey Override</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Administrative emergency passkeys hashed with bcrypt allow authorized unlocking even during network dropouts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Real-Time Access History</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every code generation, successful unlock, and invalid attempt is logged with exact timestamps and device IDs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">IoT Hardware Ready</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Compatible with ESP32 and Arduino microcontrollers, 12V solenoid magnetic locks, I2C displays, and keypads.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Tamper Resistance</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fail-secure locking mechanism stays securely latched when power is cut, with 3-attempt lockout limits.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          HOW IT WORKS (WHITE & SIMPLE)
      ======================================================== */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Simple Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple 4-Step Access
            </h2>
            <p className="text-sm text-slate-600">
              How easy it is for anyone to use the Smart Secured Locker.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up in 30 seconds with your email address."
              },
              {
                step: "02",
                title: "Generate OTP",
                desc: "Click 'Generate Code' on your mobile dashboard."
              },
              {
                step: "03",
                title: "Enter 6 Digits",
                desc: "Type the code on the locker keypad or app."
              },
              {
                step: "04",
                title: "Door Unlocks",
                desc: "Locker releases for 10s and auto-relocks."
              }
            ].map((s, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-mono text-2xl font-bold text-emerald-600">{s.step}</span>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================
          CONTACT SECTION (CLEAN & POLISHED WHITE)
      ======================================================== */}
      <section id="contact" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Contact
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Get in Touch
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Have questions regarding the project, circuit setup, or implementation? Feel free to send a message.
              </p>

              <div className="space-y-4 pt-2 text-sm text-slate-700">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="font-semibold text-slate-900 mt-0.5">aj0881871@gmail.com</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">Phone</p>
                  <p className="font-semibold text-slate-900 mt-0.5">+91 7710926977</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">Institution</p>
                  <p className="font-semibold text-slate-900 mt-0.5">St. Francis Institute of Technology</p>
                </div>
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
                <h3 className="text-base font-bold text-slate-900 mb-4">Send a Message</h3>

                <form ref={contactFormRef} onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Your Name</label>
                    <input
                      type="text"
                      name="user_name"
                      required
                      placeholder="e.g. Akash Yatin Jain"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-emerald-600 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      name="user_email"
                      required
                      placeholder="e.g. name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-emerald-600 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Write your message here..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-emerald-600 focus:bg-white outline-none transition-all"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {contactSubmitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {contactStatus === "success" && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium">
                      ✓ Message sent successfully!
                    </div>
                  )}

                  {contactStatus === "error" && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs text-center font-medium">
                      Failed to send. You can email directly to aj0881871@gmail.com.
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Hardware Specs Modal */}
      <HardwareSpecsModal
        isOpen={hardwareModalOpen}
        onClose={() => setHardwareModalOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenHardwareSpecs={() => setHardwareModalOpen(true)} />

    </div>
  );
}
