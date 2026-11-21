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
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Send,
  Zap,
  Activity,
  Terminal,
  Radio,
  FileText,
  Sliders,
  Crosshair,
  Wifi,
  Gauge
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

  // Simulator State
  const [simStatus, setSimStatus] = useState("LOCKED");
  const [simOtp, setSimOtp] = useState(["", "", "", "", "", ""]);
  const [activeGeneratedCode, setActiveGeneratedCode] = useState("849201");
  const [simCountdown, setSimCountdown] = useState(0);
  const [simMessage, setSimMessage] = useState(null);
  const [showHandsetAlert, setShowHandsetAlert] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [tamperTriggered, setTamperTriggered] = useState(false);

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
            setSimMessage({ type: "info", text: "[WATCHDOG] 10s elapsed. Solenoid relay latched." });
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
      const nextInput = document.getElementById(`sim-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !simOtp[index] && index > 0) {
      const prev = document.getElementById(`sim-otp-${index - 1}`);
      if (prev) {
        prev.focus();
        const updated = [...simOtp];
        updated[index - 1] = "";
        setSimOtp(updated);
      }
    } else if (e.key === "Enter") {
      handleSimVerify();
    }
  };

  const handleGenerateSimOtp = () => {
    playSound("keypress");
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveGeneratedCode(newCode);
    setShowHandsetAlert(true);
    setSimMessage({ type: "info", text: `[HASH_TOKEN] Dispatched dynamic OTP: ${newCode} (Valid 60s)` });
  };

  const handleAutofillCode = () => {
    playSound("keypress");
    setSimOtp(activeGeneratedCode.split(""));
  };

  const handleSimVerify = () => {
    const entered = simOtp.join("");
    if (entered.length < 6) {
      playSound("error");
      setSimMessage({ type: "error", text: "[VERIFY_FAULT] Incomplete token. 6 digits required." });
      return;
    }

    if (entered === activeGeneratedCode || entered === "123456") {
      playSound("unlock");
      setSimStatus("UNLOCKED");
      setSimCountdown(10);
      setSimMessage({ type: "success", text: "[ACCESS_GRANTED] Bcrypt hash match. Solenoid pin released." });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore confetti
      }
    } else {
      playSound("error");
      setSimMessage({ type: "error", text: "[AUTH_REJECTED] Hash mismatch. Attempt logged to ledger." });
    }
  };

  const handleSimRelock = () => {
    playSound("lock");
    setSimStatus("LOCKED");
    setSimCountdown(0);
    setSimOtp(["", "", "", "", "", ""]);
    setSimMessage({ type: "info", text: "[MANUAL_OVERRIDE] Solenoid relay latched immediately." });
  };

  // Trigger Intruder Tamper Simulation
  const handleTriggerTamper = () => {
    playSound("error");
    setTamperTriggered(true);
    setSimMessage({
      type: "error",
      text: "[ALARM_ACTIVE] Tamper accelerometer triggered! 85dB piezo pulse activated!"
    });
    setTimeout(() => setTamperTriggered(false), 4000);
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
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      
      {/* Navigation */}
      <Navbar onOpenHardwareSpecs={() => setHardwareModalOpen(true)} />

      {/* ========================================================
          TACTILE ENGINEERING HERO SECTION
      ======================================================== */}
      <section id="hero" className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-800">
        
        {/* Subtle Industrial Grid & Coordinate Markings */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141822_1px,transparent_1px),linear-gradient(to_bottom,#141822_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Engineering Header Stamp */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-6 mb-8 border-b border-slate-800/80 font-mono text-[11px] text-slate-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Crosshair className="w-3.5 h-3.5 animate-spin" />
                <span>SEC_CHASSIS // SPEC-07</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="hidden sm:inline">BAUD: 115200 N-8-1</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-cyan-400">ESP32-WROOM-32E</span>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-slate-500">
              <span>LATENCY: &lt;18ms</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">RELAY_SYNC: ARMED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Technical Narrative & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#161a24] border border-amber-500/30 text-amber-400 font-mono text-xs">
                <span className="w-2 h-2 rounded-sm bg-amber-400 animate-pulse"></span>
                <span>PHYSICAL LOCKING // HARDWARE-CLOUD SYNC</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                Smart Physical Locker &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                  Cryptographic Solenoid Vault
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl">
                Replace mechanical keys and pickable tumblers with microsecond Time-Based OTP verification, 
                12V fail-secure magnetic bolts, ESP32 optocoupled relays, and immutable access logging.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => playSound("keypress")}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:translate-y-0.5 transition-all"
                  >
                    <span>OPEN VAULT DASHBOARD</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to="/sign-up"
                    onClick={() => playSound("keypress")}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:translate-y-0.5 transition-all"
                  >
                    <span>INITIALIZE NEW VAULT</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <a
                  href="#simulator"
                  onClick={() => playSound("keypress")}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-mono text-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>TEST HARDWARE SIMULATOR</span>
                </a>
              </div>

              {/* Micro-Telemetry Blueprint Strip */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase">SOLENOID STROKE</p>
                  <p className="text-base font-bold text-white mt-0.5">10mm Steel</p>
                </div>
                <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase">RELAY COIL</p>
                  <p className="text-base font-bold text-amber-400 mt-0.5">12V @ 1.1A</p>
                </div>
                <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase">OTP TIMEOUT</p>
                  <p className="text-base font-bold text-cyan-400 mt-0.5">60 Seconds</p>
                </div>
                <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase">CRYPTO HASH</p>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">Bcrypt-12</p>
                </div>
              </div>

            </div>

            {/* Right Column: Physical Vault Door Visualizer */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {tamperTriggered && (
                <div className="mb-3 px-4 py-1.5 rounded bg-red-500/20 border border-red-500 text-red-400 font-mono text-xs flex items-center gap-2 animate-bounce">
                  <AlertTriangle className="w-4 h-4" />
                  <span>[TAMPER STROBE ACTIVATED - BUZZER SOUNDING]</span>
                </div>
              )}
              
              <LockerVisualizer
                status={simStatus}
                countdown={simCountdown}
                deviceId="SPEC-7 // NODE-01"
                temperature="23.4°C"
                voltage="12.1V"
                onQuickRelock={handleSimRelock}
                onTriggerTamper={handleTriggerTamper}
              />
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          TACTILE HARDWARE SIMULATOR & TEST BENCH
      ======================================================== */}
      <section id="simulator" className="py-16 sm:py-24 bg-[#07080c] border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Blueprint Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-6 mb-12 border-b border-slate-800 gap-4">
            <div>
              <span className="font-mono text-xs text-amber-400 tracking-widest uppercase">
                // HARDWARE TEST BENCH & SOLENOID STROKE VERIFIER
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Interactive IoT Circuit Workbench
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-md">
              Test OTP keying, solenoid release timing, and simulate physical intruder tamper events in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: The Vault Unit */}
            <div className="lg:col-span-6 space-y-4">
              <LockerVisualizer
                status={simStatus}
                countdown={simCountdown}
                deviceId="BENCH-LOCKER-01"
                temperature="23.6°C"
                voltage="12.1V"
                onQuickRelock={handleSimRelock}
                onTriggerTamper={handleTriggerTamper}
              />

              {/* Handset Notification Simulator */}
              {showHandsetAlert && (
                <div className="p-4 rounded-xl bg-[#0f121a] border border-cyan-500/30 font-mono text-xs">
                  <div className="flex items-center justify-between text-cyan-400 border-b border-cyan-900/50 pb-2 mb-2">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>SIMULATED GSM SMS DISPATCH</span>
                    </span>
                    <span className="text-[10px] text-slate-400">VIA TWILIO / GSM SHIELD</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <div>
                      <p className="text-[11px] text-slate-400">Incoming OTP SMS on Handset:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-bold font-mono tracking-widest text-emerald-400 bg-black/60 px-3 py-1 rounded border border-emerald-500/30">
                          {activeGeneratedCode}
                        </span>
                        <button
                          onClick={handleAutofillCode}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-mono border border-emerald-500/30 transition-all"
                        >
                          Fill Keypad
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(activeGeneratedCode);
                            setCopiedCode(true);
                            playSound("keypress");
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Copy Code"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateSimOtp}
                      className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all"
                    >
                      Generate New Token
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Tactile Matrix Keypad & Oscilloscope */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="p-6 rounded-2xl bg-[#0f121a] border-2 border-slate-700/80 shadow-2xl font-mono">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-sm">4x4 MATRIX ENGRAVED KEYPAD</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    DEBOUNCE: 50MS
                  </span>
                </div>

                {/* Status Message */}
                {simMessage && (
                  <div
                    className={`mt-4 p-3 rounded text-xs font-mono flex items-center justify-between ${
                      simMessage.type === "success"
                        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                        : simMessage.type === "error"
                        ? "bg-red-950/60 border border-red-500/40 text-red-300"
                        : "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300"
                    }`}
                  >
                    <span>{simMessage.text}</span>
                    <button onClick={() => setSimMessage(null)} className="text-xs opacity-60 hover:opacity-100">
                      ✕
                    </button>
                  </div>
                )}

                {/* 6 Digit Display Windows */}
                <div className="my-6">
                  <p className="text-[10px] text-slate-400 mb-2 text-center uppercase tracking-wider">
                    [DISPLAY BUFFER // ENTER 6-DIGIT TOTP]
                  </p>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {simOtp.map((val, idx) => (
                      <input
                        key={idx}
                        id={`sim-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpInput(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-bold bg-[#07090f] border-2 border-slate-700 rounded text-amber-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                {/* Physical Keypad Buttons (Industrial Inset Design) */}
                <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "DEL"].map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        playSound("keypress");
                        if (k === "CLR") {
                          setSimOtp(["", "", "", "", "", ""]);
                          const first = document.getElementById("sim-otp-0");
                          if (first) first.focus();
                        } else if (k === "DEL") {
                          const lastIdx = simOtp.findLastIndex((d) => d !== "");
                          if (lastIdx !== -1) {
                            const updated = [...simOtp];
                            updated[lastIdx] = "";
                            setSimOtp(updated);
                            const prev = document.getElementById(`sim-otp-${lastIdx}`);
                            if (prev) prev.focus();
                          }
                        } else {
                          const emptyIdx = simOtp.findIndex((d) => d === "");
                          if (emptyIdx !== -1) {
                            handleOtpInput(emptyIdx, k);
                          }
                        }
                      }}
                      className="h-12 rounded-lg bg-gradient-to-b from-[#1b1f2b] to-[#11141c] hover:from-[#242938] hover:to-[#171b26] text-white font-mono font-bold text-base border border-slate-600 active:translate-y-0.5 active:shadow-inner transition-all shadow-md flex items-center justify-center select-none"
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {/* Verification Bar */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSimVerify}
                    className="flex-1 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-sm shadow-lg shadow-amber-500/20 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>ENERGIZE RELAY (OPEN LOCK)</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound("keypress");
                      setSimOtp(["", "", "", "", "", ""]);
                    }}
                    className="px-5 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-all"
                  >
                    RESET
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
                  FALLBACK TEST CODE: <span className="text-amber-400 font-bold">123456</span> OR USE GENERATED SMS TOKEN
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          HARDWARE & CIRCUIT RACK SPECIFICATIONS
      ======================================================== */}
      <section id="security" className="py-16 sm:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-6 mb-12 border-b border-slate-800 gap-4 font-mono">
            <div>
              <span className="text-xs text-cyan-400 tracking-widest uppercase">
                // SCHEMATICS & COMPONENT ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Hardware Subsystem Anatomy
              </h2>
            </div>
            <button
              onClick={() => { playSound("keypress"); setHardwareModalOpen(true); }}
              className="px-4 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Cpu className="w-4 h-4" />
              <span>Open Detailed Circuit Pinout Matrix</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            
            {/* Rack Module 1 */}
            <div className="p-6 rounded-xl bg-[#0f121a] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-cyan-400 border-b border-slate-800 pb-3">
                <span className="font-bold">MOD_01 // MCU_CORE</span>
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">ESP32 Dual-Core 240MHz</h3>
              <p className="text-slate-400 leading-relaxed font-sans text-xs">
                Executes interrupt-driven matrix keypad scanning, connects over WPA2/WPA3 TLS 1.3 socket to Node server, and drives optocoupled relay lines.
              </p>
              <ul className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <li>• GPIO 26: Active-LOW Relay Coil Trigger</li>
                <li>• GPIO 21/22: I2C Hardware Bus (0x27)</li>
                <li>• Flash Memory: 4MB SPI with OTA Support</li>
              </ul>
            </div>

            {/* Rack Module 2 */}
            <div className="p-6 rounded-xl bg-[#0f121a] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-amber-400 border-b border-slate-800 pb-3">
                <span className="font-bold">MOD_02 // SOLENOID_BOLT</span>
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">12V DC Fail-Secure Deadbolt</h3>
              <p className="text-slate-400 leading-relaxed font-sans text-xs">
                Spring-loaded steel tongue physically latches when power is interrupted. Energized strictly for 10 seconds during validated entry before auto-relocking.
              </p>
              <ul className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <li>• Draw: 1.1A @ 12V Nominal Voltage</li>
                <li>• Flyback Protection: 1N4007 Diode Snubber</li>
                <li>• 10mm Throw Length with Anti-Shim Wedge</li>
              </ul>
            </div>

            {/* Rack Module 3 */}
            <div className="p-6 rounded-xl bg-[#0f121a] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-emerald-400 border-b border-slate-800 pb-3">
                <span className="font-bold">MOD_03 // INTRUSION_GUARD</span>
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Reed Switch & Piezo Strobe</h3>
              <p className="text-slate-400 leading-relaxed font-sans text-xs">
                Monitors magnetic door alignment. If door is forced open without prior OTP verification, GPIO interrupt activates immediate 85dB alarm and flags cloud ledger.
              </p>
              <ul className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <li>• Sensor: Normally-Open Magnetic Reed</li>
                <li>• Piezo Frequency: 2.4 kHz Pulse Pattern</li>
                <li>• Lockout: 3 Failed OTP Attempts = 5m Lock</li>
              </ul>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          HARDWARE DISPATCH CONTACT TERMINAL
      ======================================================== */}
      <section id="contact" className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Contact Specs */}
            <div className="lg:col-span-5 space-y-6 font-mono">
              <span className="text-xs text-amber-400 tracking-widest uppercase">
                // HARDWARE COMMISSIONING & INQUIRIES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Project Evaluation & Examiner Inquiries
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                Developed by Akash Yatin Jain at St. Francis Institute of Technology (SFIT). Suitable for real-world campus storage, laboratory containment, or office access.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3.5 rounded-lg bg-[#0f121a] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">LEAD ARCHITECT:</span>
                  <span className="text-white font-bold">Akash Yatin Jain</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#0f121a] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">DISPATCH EMAIL:</span>
                  <span className="text-amber-400 font-bold">aj0881871@gmail.com</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#0f121a] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">TELEPHONE:</span>
                  <span className="text-white font-bold">+91 7710926977</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#0f121a] border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">CAMPUS:</span>
                  <span className="text-cyan-400 font-bold">St. Francis Institute of Technology</span>
                </div>
              </div>
            </div>

            {/* Right: Email Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0f121a] border border-slate-800 font-mono">
                <h3 className="text-base font-bold text-white mb-1">Direct Gateway Dispatch Terminal</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Messages dispatched directly through EmailJS gateway with immediate logging.
                </p>

                <form ref={contactFormRef} onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">OPERATOR_NAME:</label>
                    <input
                      type="text"
                      name="user_name"
                      required
                      placeholder="e.g. Akash Yatin Jain"
                      className="w-full px-4 py-3 rounded bg-[#07090f] border border-slate-700 text-white focus:border-amber-400 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">RETURN_EMAIL_ADDRESS:</label>
                    <input
                      type="email"
                      name="user_email"
                      required
                      placeholder="e.g. examiner@sfit.ac.in"
                      className="w-full px-4 py-3 rounded bg-[#07090f] border border-slate-700 text-white focus:border-amber-400 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">INQUIRY_PAYLOAD:</label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Provide inquiry specifications, hardware evaluation notes, or questions..."
                      className="w-full px-4 py-3 rounded bg-[#07090f] border border-slate-700 text-white focus:border-amber-400 outline-none transition-all"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {contactSubmitting ? (
                      <span>TRANSMITTING DISPATCH...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>DISPATCH OFFICIAL INQUIRY</span>
                      </>
                    )}
                  </button>

                  {contactStatus === "success" && (
                    <div className="p-3 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
                      ✓ Transmission confirmed. Message delivered to lead engineer.
                    </div>
                  )}

                  {contactStatus === "error" && (
                    <div className="p-3 rounded bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
                      ✕ Transmission dropped. Please mail directly to aj0881871@gmail.com.
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
