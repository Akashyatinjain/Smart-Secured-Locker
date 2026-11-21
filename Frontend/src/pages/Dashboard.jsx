import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Unlock,
  KeyRound,
  RotateCcw,
  Copy,
  Check,
  Clock,
  History,
  LogOut,
  Radio,
  Cpu,
  AlertTriangle,
  Zap,
  Thermometer,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  Volume2,
  VolumeX,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";
import LockerVisualizer from "../components/LockerVisualizer";
import HardwareSpecsModal from "../components/HardwareSpecsModal";
import {
  getLockerStatus,
  generateOTP,
  verifyOTP,
  getOtpHistory,
  createPasskey,
  unlockWithPasskey,
  relockLocker,
  getCurrentUser,
  logoutUser
} from "../services/lockerAPI";
import { playSound, toggleAudioMute, getAudioMuted } from "../utils/audio";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => getCurrentUser());
  const [isMuted, setIsMuted] = useState(getAudioMuted());
  const [hardwareModalOpen, setHardwareModalOpen] = useState(false);

  // Locker Core State
  const [lockerStatus, setLockerStatus] = useState("LOCKED");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [unlockCountdown, setUnlockCountdown] = useState(0);

  // OTP State
  const [activeOtp, setActiveOtp] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(0);
  const [showOtpCard, setShowOtpCard] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [verifyOtpInput, setVerifyOtpInput] = useState(["", "", "", "", "", ""]);

  // Passkey State
  const [activePasskey, setActivePasskey] = useState("");
  const [passkeyInput, setPasskeyInput] = useState("");
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  // Active Tab: "otp" | "passkey" | "hardware"
  const [activeTab, setActiveTab] = useState("otp");

  // Notifications / Feedback Banner
  const [notice, setNotice] = useState(null);

  // Recent History
  const [recentLogs, setRecentLogs] = useState([]);

  // Load Initial Status and History
  const fetchStatusAndLogs = async () => {
    try {
      const statusRes = await getLockerStatus();
      if (statusRes.lockerStatus) {
        setLockerStatus(statusRes.lockerStatus);
      }

      const histRes = await getOtpHistory();
      if (histRes.history) {
        setRecentLogs(histRes.history.slice(0, 4));
      }
    } catch (err) {
      console.error("Status fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStatusAndLogs();

    // Auto-poll locker status every 3.5 seconds
    const interval = setInterval(fetchStatusAndLogs, 3500);
    return () => clearInterval(interval);
  }, []);

  // OTP 60s expiration countdown timer
  useEffect(() => {
    let timer;
    if (showOtpCard && otpTimeLeft > 0) {
      timer = setInterval(() => {
        setOtpTimeLeft((prev) => {
          if (prev <= 1) {
            setShowOtpCard(false);
            setActiveOtp("");
            setNotice({ type: "info", text: "Active OTP expired automatically." });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpCard, otpTimeLeft]);

  // Unlock 10s countdown timer
  useEffect(() => {
    let timer;
    if (lockerStatus === "UNLOCKED" && unlockCountdown > 0) {
      timer = setInterval(() => {
        setUnlockCountdown((prev) => {
          if (prev <= 1) {
            setLockerStatus("LOCKED");
            playSound("lock");
            setNotice({ type: "info", text: "Locker auto-relocked for security." });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockerStatus, unlockCountdown]);

  // Handle OTP digit input
  const handleOtpBoxChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    playSound("keypress");
    const updated = [...verifyOtpInput];
    updated[idx] = val.slice(-1);
    setVerifyOtpInput(updated);

    if (val && idx < 5) {
      const nextEl = document.getElementById(`dash-otp-${idx + 1}`);
      if (nextEl) nextEl.focus();
    }
  };

  const handleOtpBoxKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !verifyOtpInput[idx] && idx > 0) {
      const prevEl = document.getElementById(`dash-otp-${idx - 1}`);
      if (prevEl) {
        prevEl.focus();
        const updated = [...verifyOtpInput];
        updated[idx - 1] = "";
        setVerifyOtpInput(updated);
      }
    } else if (e.key === "Enter") {
      handleVerifyOTP();
    }
  };

  // Generate OTP
  const handleGenerateOTP = async () => {
    try {
      setLoading(true);
      playSound("keypress");
      const res = await generateOTP();
      setLoading(false);

      if (res.otp) {
        setActiveOtp(String(res.otp));
        setShowOtpCard(true);
        setOtpTimeLeft(60);
        playSound("beep");
        setNotice({ type: "success", text: "New 60-second OTP generated and active!" });
        fetchStatusAndLogs();
      }
    } catch (_err) {
      setLoading(false);
      playSound("error");
      setNotice({ type: "error", text: "Failed to generate OTP. Check connection." });
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const code = verifyOtpInput.join("");
    if (code.length < 6) {
      playSound("error");
      setNotice({ type: "error", text: "Please enter all 6 digits of the OTP." });
      return;
    }

    try {
      setVerifying(true);
      playSound("keypress");
      const res = await verifyOTP({ otp: code, deviceId: "LOCKER_01" });
      setVerifying(false);

      if (res.success) {
        playSound("unlock");
        setLockerStatus("UNLOCKED");
        setUnlockCountdown(10);
        setNotice({ type: "success", text: "Locker Unlocked! Relocking in 10s." });
        setVerifyOtpInput(["", "", "", "", "", ""]);
        fetchStatusAndLogs();

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore confetti if unsupported
        }
      } else {
        playSound("error");
        setNotice({ type: "error", text: res.message || "Invalid OTP code. Access Denied." });
        fetchStatusAndLogs();
      }
    } catch (err) {
      setVerifying(false);
      playSound("error");
      setNotice({ type: "error", text: err.response?.data?.message || "Verification failed." });
    }
  };

  // Copy OTP
  const handleCopyOtp = () => {
    if (!activeOtp) return;
    navigator.clipboard.writeText(activeOtp);
    setCopiedOtp(true);
    playSound("keypress");
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  // Autofill Active OTP into the verify box
  const handleAutofillActiveOtp = () => {
    if (!activeOtp) return;
    playSound("keypress");
    setVerifyOtpInput(activeOtp.split(""));
  };

  // Generate Passkey
  const handleCreatePasskey = async () => {
    try {
      setPasskeyLoading(true);
      playSound("keypress");
      const res = await createPasskey();
      setPasskeyLoading(false);
      if (res.passkey) {
        setActivePasskey(res.passkey);
        playSound("beep");
        setNotice({ type: "success", text: "Emergency Master Passkey created!" });
      }
    } catch (_err) {
      setPasskeyLoading(false);
      playSound("error");
      setNotice({ type: "error", text: "Failed to generate passkey." });
    }
  };

  // Unlock with Passkey
  const handleUnlockPasskey = async () => {
    if (!passkeyInput.trim()) {
      playSound("error");
      setNotice({ type: "error", text: "Please enter the master passkey." });
      return;
    }

    try {
      setPasskeyLoading(true);
      playSound("keypress");
      const res = await unlockWithPasskey({ passkey: passkeyInput.trim() });
      setPasskeyLoading(false);

      if (res.success) {
        playSound("unlock");
        setLockerStatus("UNLOCKED");
        setUnlockCountdown(10);
        setNotice({ type: "success", text: "Locker Unlocked via Master Passkey!" });
        setPasskeyInput("");
        fetchStatusAndLogs();
      } else {
        playSound("error");
        setNotice({ type: "error", text: res.message || "Invalid passkey override." });
      }
    } catch (err) {
      setPasskeyLoading(false);
      playSound("error");
      setNotice({ type: "error", text: err.response?.data?.message || "Passkey unlock failed." });
    }
  };

  // Emergency Relock
  const handleEmergencyRelock = async () => {
    playSound("lock");
    await relockLocker();
    setLockerStatus("LOCKED");
    setUnlockCountdown(0);
    setNotice({ type: "info", text: "[MANUAL LOCKDOWN] Solenoid latched. Deadbolt pins engaged." });
    fetchStatusAndLogs();
  };

  // Tamper Alert Simulation
  const handleTriggerTamper = () => {
    playSound("error");
    setNotice({
      type: "error",
      text: "[TAMPER INTRUSION ALERT] Magnetic reed sensor tripped on LOCKER_01! Piezo 85dB sounding."
    });
  };

  // Sound toggle
  const handleSoundToggle = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
    if (!muted) playSound("beep");
  };

  // Logout
  const handleLogout = () => {
    playSound("lock");
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* ========================================================
            TOP BAR & SYSTEM METRICS
        ======================================================== */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Left: Brand & Operator */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/"
              onClick={() => playSound("keypress")}
              className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 hover:scale-105 transition-all"
            >
              <Shield className="w-6 h-6" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Vault Control Console
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  LOCKER_01
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Operator: <span className="text-slate-200 font-medium">{user?.username || "Authorized User"}</span> ({user?.email || "user@example.com"})
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
            
            {/* System Node Status Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/[0.08] text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AES-256 ENCRYPTED</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => { playSound("keypress"); fetchStatusAndLogs(); }}
              title="Refresh Live Status"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] text-slate-300 hover:text-white transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] text-slate-300 hover:text-emerald-400 transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Hardware Specs */}
            <button
              onClick={() => { playSound("keypress"); setHardwareModalOpen(true); }}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] text-xs font-mono text-cyan-300 flex items-center space-x-1.5 transition-all"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">IoT Specs</span>
            </button>

            {/* History Link */}
            <Link
              to="/history"
              onClick={() => playSound("keypress")}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center space-x-1.5 transition-all"
            >
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Log</span>
            </Link>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Global Alert Notification */}
        {notice && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-mono flex items-center justify-between transition-all ${
              notice.type === "success"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                : notice.type === "error"
                ? "bg-red-500/15 border border-red-500/30 text-red-300"
                : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              {notice.type === "success" ? (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              )}
              <span>{notice.text}</span>
            </div>
            <button onClick={() => setNotice(null)} className="text-xs opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* ========================================================
            MAIN WORKSPACE GRID
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column (5 Cols): The Physical Locker Visualizer */}
          <div className="lg:col-span-5 space-y-6">
            <LockerVisualizer
              status={lockerStatus}
              countdown={unlockCountdown}
              deviceId="LOCKER_01"
              temperature="23.6°C"
              voltage="12.1V"
              onQuickRelock={handleEmergencyRelock}
              onTriggerTamper={handleTriggerTamper}
            />

            {/* Quick Emergency Lockdown Button */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/[0.08] flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-semibold text-white">EMERGENCY RELOCK</p>
                <p className="text-[11px] text-slate-400">Instantly energizes latch & engages bolts</p>
              </div>
              <button
                onClick={handleEmergencyRelock}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold transition-all"
              >
                Force Relock
              </button>
            </div>
          </div>

          {/* Right Column (7 Cols): Multi-Tab Access Control Panel */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tab Selection */}
            <div className="flex space-x-2 p-1.5 rounded-2xl bg-slate-900/70 border border-white/[0.08]">
              {[
                { id: "otp", label: "OTP Access Control", icon: KeyRound },
                { id: "passkey", label: "Master Passkey", icon: Shield },
                { id: "hardware", label: "Hardware Telemetry", icon: Activity }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { playSound("keypress"); setActiveTab(tab.id); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: OTP Access Control */}
            {activeTab === "otp" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/[0.1] shadow-2xl backdrop-blur-xl space-y-6">
                
                {/* Generation Card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-emerald-400" />
                      <span>One-Time Access Password</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Generate a cryptographic 6-digit TOTP code for single-entry unlock
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateOTP}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        <span>Generating...</span>
                      </span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Generate OTP</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Display Generated OTP Card */}
                {showOtpCard && activeOtp ? (
                  <div className="p-5 rounded-2xl bg-[#080d1a] border border-emerald-500/30 shadow-inner">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 text-xs font-mono text-emerald-400">
                      <span>ACTIVE ACCESS OTP</span>
                      <span className="bg-emerald-500/20 px-2 py-0.5 rounded font-bold text-emerald-300">
                        EXPIRES IN: {otpTimeLeft}s
                      </span>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase font-mono">Dynamic Token Code:</p>
                        <span className="text-3xl sm:text-4xl font-mono font-extrabold tracking-[0.25em] text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                          {activeOtp}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <button
                          onClick={handleCopyOtp}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center justify-center space-x-1.5 transition-all"
                        >
                          {copiedOtp ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleAutofillActiveOtp}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold transition-all"
                        >
                          Fill & Test
                        </button>
                      </div>
                    </div>

                    {/* Expiration Progress Bar */}
                    <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-1000 ease-linear"
                        style={{ width: `${(otpTimeLeft / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-[#080d1a]/50 border border-white/[0.06] text-center text-xs font-mono text-slate-400">
                    <p>No active OTP generated. Click "Generate OTP" above to create a 60-second access code.</p>
                  </div>
                )}

                {/* Direct Verification Input Box */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300 uppercase">
                      Enter OTP Code to Unlock Locker
                    </label>
                    <span className="text-xs font-mono text-slate-500">MAX 3 ATTEMPTS</span>
                  </div>

                  <div className="flex justify-center gap-2 sm:gap-3">
                    {verifyOtpInput.map((val, idx) => (
                      <input
                        key={idx}
                        id={`dash-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpBoxKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold bg-[#080d1a] border-2 border-white/[0.12] rounded-xl text-emerald-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={verifying}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                    >
                      {verifying ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                          <span>Verifying Token...</span>
                        </span>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>Verify & Unlock Solenoid</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        playSound("keypress");
                        setVerifyOtpInput(["", "", "", "", "", ""]);
                      }}
                      className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition-all"
                    >
                      Clear
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Master Passkey Emergency Override */}
            {activeTab === "passkey" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/[0.1] shadow-2xl backdrop-blur-xl space-y-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      <span>Master Passkey Management</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Cryptographic fail-safe override for emergency physical vault release
                    </p>
                  </div>

                  <button
                    onClick={handleCreatePasskey}
                    disabled={passkeyLoading}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                  >
                    Generate Passkey
                  </button>
                </div>

                {activePasskey && (
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 font-mono text-xs">
                    <p className="text-cyan-400 font-semibold mb-1">Generated Master Passkey:</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">{activePasskey}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(activePasskey);
                          setNotice({ type: "success", text: "Passkey copied to clipboard." });
                        }}
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {/* Passkey Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                      Enter Emergency Passkey to Unlock
                    </label>
                    <input
                      type="text"
                      value={passkeyInput}
                      onChange={(e) => setPasskeyInput(e.target.value)}
                      placeholder="e.g. PASS-9482-SEC"
                      className="w-full px-4 py-3 rounded-xl bg-[#080d1a] border border-white/[0.12] text-white text-sm font-mono focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    />
                  </div>

                  <button
                    onClick={handleUnlockPasskey}
                    disabled={passkeyLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {passkeyLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        <span>Verifying Passkey...</span>
                      </span>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        <span>Unlock with Master Passkey</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Master passkey unlock events are permanently recorded in the immutable audit log.</span>
                </div>

              </div>
            )}

            {/* Tab 3: Hardware Diagnostics & Sensor Telemetry */}
            {activeTab === "hardware" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/[0.1] shadow-2xl backdrop-blur-xl space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      <span>IoT Sensor & Relay Telemetry</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Live readings from ESP32 Microcontroller & Solenoid Circuit
                    </p>
                  </div>

                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    GPIO SYNCED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/[0.06]">
                    <p className="text-xs font-mono text-slate-400">Solenoid Relay State</p>
                    <p className="text-base font-mono font-bold text-emerald-400 mt-1">
                      {lockerStatus === "UNLOCKED" ? "DE-ENERGIZED (OPEN)" : "ENERGIZED (LATCHED)"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Optocoupled 5V Relay Pin 26</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/[0.06]">
                    <p className="text-xs font-mono text-slate-400">Door Reed Switch Sensor</p>
                    <p className="text-base font-mono font-bold text-cyan-400 mt-1">
                      {lockerStatus === "UNLOCKED" ? "DOOR OPEN / CONTACT BROKEN" : "DOOR CLOSED / MAGNETIC CONTACT"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Hardware Interrupt GPIO 34</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/[0.06]">
                    <p className="text-xs font-mono text-slate-400">Relay Power Rail</p>
                    <p className="text-base font-mono font-bold text-white mt-1">12.1V DC @ 1.1A</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Protected via 1N4007 Diode</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/[0.06]">
                    <p className="text-xs font-mono text-slate-400">Coil Internal Temp</p>
                    <p className="text-base font-mono font-bold text-emerald-400 mt-1">23.6°C (Normal Range)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Threshold Alert at 45.0°C</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => { playSound("keypress"); setHardwareModalOpen(true); }}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Complete Circuit Schematic & Firmware Code</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* Recent Audit Log Snapshot Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/[0.1] shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase">
                    Recent Access Events
                  </h3>
                </div>

                <Link
                  to="/history"
                  onClick={() => playSound("keypress")}
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <span>View All Records</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log, idx) => {
                    const isSuccess = log.status === "SUCCESS" || log.status === "UNLOCKED" || log.status === "PASSKEY_SUCCESS";
                    const isFailed = log.status === "FAILED" || log.status === "PASSKEY_FAILED";

                    return (
                      <div
                        key={log._id || idx}
                        className="p-3.5 rounded-xl bg-[#080d1a] border border-white/[0.06] flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isSuccess ? "bg-emerald-400" : isFailed ? "bg-red-500" : "bg-cyan-400"
                            }`}
                          />
                          <div>
                            <span className="font-semibold text-white">{log.status}</span>
                            <span className="text-slate-400 ml-2">Node: {log.deviceId || "LOCKER_01"}</span>
                          </div>
                        </div>

                        <div className="text-right text-slate-400">
                          {log.otp && <span className="text-emerald-400 mr-2 font-bold">{log.otp}</span>}
                          <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs font-mono text-slate-500 text-center py-4">
                    No access events logged yet. Generate an OTP to start logging.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Hardware Specs Modal */}
      <HardwareSpecsModal
        isOpen={hardwareModalOpen}
        onClose={() => setHardwareModalOpen(false)}
      />

    </div>
  );
}
