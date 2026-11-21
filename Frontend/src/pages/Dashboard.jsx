import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  KeyRound,
  RotateCcw,
  Copy,
  Check,
  History,
  LogOut,
  RefreshCw,
  Activity,
  Zap,
  ExternalLink,
  Unlock,
  Volume2,
  VolumeX
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

  // Active Tab
  const [activeTab, setActiveTab] = useState("otp");

  // Notifications
  const [notice, setNotice] = useState(null);

  // Recent History
  const [recentLogs, setRecentLogs] = useState([]);

  // Fetch Status and Logs
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
            setNotice({ type: "info", text: "Generated OTP has expired." });
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
            setNotice({ type: "info", text: "Locker has automatically relocked." });
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
        setNotice({ type: "success", text: "New OTP generated. Valid for 60 seconds." });
        fetchStatusAndLogs();
      }
    } catch (_err) {
      setLoading(false);
      playSound("error");
      setNotice({ type: "error", text: "Could not generate OTP. Please try again." });
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const code = verifyOtpInput.join("");
    if (code.length < 6) {
      playSound("error");
      setNotice({ type: "error", text: "Please enter all 6 digits." });
      return;
    }

    try {
      setVerifying(true);
      playSound("keypress");
      const res = await verifyOTP({ otp: code, deviceId: "Locker 01" });
      setVerifying(false);

      if (res.success) {
        playSound("unlock");
        setLockerStatus("UNLOCKED");
        setUnlockCountdown(10);
        setNotice({ type: "success", text: "Access granted! Locker unlocked for 10 seconds." });
        setVerifyOtpInput(["", "", "", "", "", ""]);
        fetchStatusAndLogs();

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
        setNotice({ type: "error", text: res.message || "Invalid OTP code." });
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
        setNotice({ type: "success", text: "Master passkey generated." });
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
        setNotice({ type: "success", text: "Locker unlocked with master passkey!" });
        setPasskeyInput("");
        fetchStatusAndLogs();
      } else {
        playSound("error");
        setNotice({ type: "error", text: res.message || "Invalid master passkey." });
      }
    } catch (err) {
      setPasskeyLoading(false);
      playSound("error");
      setNotice({ type: "error", text: err.response?.data?.message || "Passkey unlock failed." });
    }
  };

  // Manual Relock
  const handleManualRelock = async () => {
    playSound("lock");
    await relockLocker();
    setLockerStatus("LOCKED");
    setUnlockCountdown(0);
    setNotice({ type: "info", text: "Locker locked manually." });
    fetchStatusAndLogs();
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
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ========================================================
            TOP BAR HEADER (CLEAN & WHITE)
        ======================================================== */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3.5">
            <Link
              to="/"
              onClick={() => playSound("keypress")}
              className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600"
            >
              <Shield className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900">Locker Dashboard</h1>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Online</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                User: <span className="text-slate-800 font-medium">{user?.username || "Authorized User"}</span> ({user?.email || "user@example.com"})
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => { playSound("keypress"); fetchStatusAndLogs(); }}
              title="Refresh Status"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleSoundToggle}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            <Link
              to="/history"
              onClick={() => playSound("keypress")}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <History className="w-4 h-4 text-emerald-600" />
              <span>Access History</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Global Notice Alert */}
        {notice && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
              notice.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : notice.type === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-slate-100 border border-slate-200 text-slate-800"
            }`}
          >
            <span>{notice.text}</span>
            <button onClick={() => setNotice(null)} className="opacity-60 hover:opacity-100 text-xs font-bold">
              ✕
            </button>
          </div>
        )}

        {/* ========================================================
            MAIN DASHBOARD GRID (2 COLUMNS)
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Clean Locker Visualizer */}
          <div className="lg:col-span-5">
            <LockerVisualizer
              status={lockerStatus}
              countdown={unlockCountdown}
              deviceId="Locker #01"
              temperature="24°C"
              onQuickRelock={handleManualRelock}
            />
          </div>

          {/* Right: Controls & Access Tools */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tabs */}
            <div className="flex space-x-2 p-1 rounded-xl bg-white border border-slate-200 text-xs shadow-sm">
              {[
                { id: "otp", label: "Access OTP", icon: KeyRound },
                { id: "passkey", label: "Master Passkey", icon: Shield },
                { id: "hardware", label: "System Status", icon: Activity }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { playSound("keypress"); setActiveTab(tab.id); }}
                    className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center space-x-1.5 transition-all ${
                      active
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Access OTP */}
            {activeTab === "otp" && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
                
                {/* Generation Card */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Generate One-Time Password</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Valid for 60 seconds for single-entry unlock</p>
                  </div>

                  <button
                    onClick={handleGenerateOTP}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm flex items-center space-x-1.5 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Generating...</span>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Generate OTP</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Active OTP Display */}
                {showOtpCard && activeOtp ? (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-800 font-medium">Active Code:</span>
                      <span className="font-mono text-emerald-700 font-semibold">
                        Expires in {otpTimeLeft}s
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-3xl font-bold tracking-widest text-emerald-700">
                        {activeOtp}
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleCopyOtp}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium flex items-center space-x-1 transition-colors shadow-sm"
                        >
                          {copiedOtp ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleAutofillActiveOtp}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-sm"
                        >
                          Fill Form
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${(otpTimeLeft / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                    Click "Generate OTP" above to create an access code.
                  </div>
                )}

                {/* Direct Verification Input Box */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-semibold">Enter Code to Unlock Locker:</span>
                    <span className="text-slate-400">Max 3 attempts</span>
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
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all shadow-sm"
                      />
                    ))}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={verifying}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-emerald-200 flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
                    >
                      {verifying ? (
                        <span>Verifying...</span>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>Unlock Locker</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        playSound("keypress");
                        setVerifyOtpInput(["", "", "", "", "", ""]);
                      }}
                      className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all"
                    >
                      Clear
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Master Passkey */}
            {activeTab === "passkey" && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Emergency Master Passkey</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Fail-safe administrative unlock</p>
                  </div>

                  <button
                    onClick={handleCreatePasskey}
                    disabled={passkeyLoading}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    Create Passkey
                  </button>
                </div>

                {activePasskey && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-500">Generated Master Passkey:</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-emerald-700">{activePasskey}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(activePasskey);
                          setNotice({ type: "success", text: "Passkey copied to clipboard." });
                        }}
                        className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium shadow-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Enter Passkey to Unlock:
                    </label>
                    <input
                      type="text"
                      value={passkeyInput}
                      onChange={(e) => setPasskeyInput(e.target.value)}
                      placeholder="e.g. PSK-8492-SEC"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-emerald-600 outline-none transition-all"
                    />
                  </div>

                  <button
                    onClick={handleUnlockPasskey}
                    disabled={passkeyLoading}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm transition-all disabled:opacity-50 shadow-sm"
                  >
                    {passkeyLoading ? "Verifying..." : "Unlock with Passkey"}
                  </button>
                </div>

              </div>
            )}

            {/* Tab 3: System Status */}
            {activeTab === "hardware" && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
                <h3 className="font-bold text-slate-900 text-sm mb-3">System Hardware Status</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-slate-500">Solenoid Lock</p>
                    <p className="text-sm font-semibold text-emerald-700 mt-1">
                      {lockerStatus === "UNLOCKED" ? "Open (Disengaged)" : "Locked (Engaged)"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-slate-500">Door Sensor</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {lockerStatus === "UNLOCKED" ? "Open" : "Closed"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-slate-500">Power Supply</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">12V DC (Normal)</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-slate-500">Internal Temp</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">24°C</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => { playSound("keypress"); setHardwareModalOpen(true); }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center space-x-1"
                  >
                    <span>View Circuit Pinouts & Wiring</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Recent Activity Snapshot */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Recent Access Events</h3>
                <Link
                  to="/history"
                  onClick={() => playSound("keypress")}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  View All History →
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log, idx) => {
                    const isSuccess = log.status === "SUCCESS" || log.status === "UNLOCKED" || log.status === "PASSKEY_SUCCESS";
                    const isFailed = log.status === "FAILED" || log.status === "PASSKEY_FAILED";

                    return (
                      <div
                        key={log._id || idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSuccess ? "bg-emerald-500" : isFailed ? "bg-red-500" : "bg-cyan-500"
                            }`}
                          />
                          <span className="font-semibold text-slate-800">{log.status}</span>
                        </div>

                        <div className="text-slate-500 text-[11px] font-mono">
                          {log.otp && <span className="text-emerald-700 mr-2 font-bold">{log.otp}</span>}
                          <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-2">
                    No access events recorded yet.
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
