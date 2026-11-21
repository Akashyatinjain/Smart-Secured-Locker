import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Menu,
  X,
  Cpu,
  History,
  LayoutDashboard,
  User,
  LogOut,
  ChevronRight,
  Activity,
  Terminal
} from "lucide-react";
import { getCurrentUser, logoutUser, checkBackendHealth } from "../services/lockerAPI";
import { toggleAudioMute, getAudioMuted, playSound } from "../utils/audio";

export default function Navbar({ onOpenHardwareSpecs }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(getAudioMuted());
  const [backendStatus, setBackendStatus] = useState({ online: true, latency: 28 });

  useEffect(() => {
    const syncUser = () => {
      const cur = getCurrentUser();
      setUser(cur);
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  useEffect(() => {
    // Check backend health periodically
    const checkHealth = async () => {
      const res = await checkBackendHealth();
      setBackendStatus(res);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMuteToggle = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
    if (!muted) playSound("beep");
  };

  const handleLogout = () => {
    playSound("lock");
    logoutUser();
    setUser(null);
    navigate("/login");
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#07090e]/85 backdrop-blur-xl border-b border-white/[0.07] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 group cursor-pointer select-none"
            onClick={() => playSound("keypress")}
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent border border-emerald-500/30 group-hover:border-emerald-400/60 shadow-lg shadow-emerald-500/10 transition-all duration-300">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 rounded-xl bg-emerald-400/10 blur-sm group-hover:blur-md transition-all"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  FORTIX<span className="text-emerald-400">.</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                Smart Secured Locker
              </p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 bg-slate-900/40 p-1.5 rounded-full border border-white/[0.06]">
            <button
              onClick={() => { playSound("keypress"); scrollToSection("hero"); }}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all ${
                location.pathname === "/" ? "text-white bg-white/[0.08]" : "text-slate-400 hover:text-white"
              }`}
            >
              Vault Core
            </button>
            <button
              onClick={() => { playSound("keypress"); scrollToSection("simulator"); }}
              className="px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              Live Simulator
            </button>
            <button
              onClick={() => { playSound("keypress"); scrollToSection("security"); }}
              className="px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              Architecture
            </button>
            <button
              onClick={() => {
                playSound("keypress");
                if (onOpenHardwareSpecs) onOpenHardwareSpecs();
                else scrollToSection("hardware");
              }}
              className="px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center space-x-1"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>IoT Specs</span>
            </button>
            <button
              onClick={() => { playSound("keypress"); scrollToSection("contact"); }}
              className="px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              Contact
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Live System Heartbeat Pill */}
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/60 border border-white/[0.07] text-[11px] font-mono text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${backendStatus.online ? "bg-emerald-400" : "bg-amber-400"} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${backendStatus.online ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              </span>
              <span className="hidden md:inline">
                {backendStatus.online ? `NODE-01 (${backendStatus.latency || 28}ms)` : "LOCAL DEMO"}
              </span>
            </div>

            {/* Audio Toggle Button */}
            <button
              onClick={handleMuteToggle}
              title={isMuted ? "Unmute Sound Feedback" : "Mute Sound Feedback"}
              className="p-2 rounded-xl bg-slate-900/60 border border-white/[0.07] text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Authenticated vs Guest View */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/history"
                  onClick={() => playSound("keypress")}
                  className={`p-2 rounded-xl border transition-all ${
                    location.pathname === "/history"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-slate-900/60 text-slate-400 border-white/[0.07] hover:text-white"
                  }`}
                  title="Audit Log"
                >
                  <History className="w-4 h-4" />
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => playSound("keypress")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Vault Console</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-slate-900/60 border border-white/[0.07] text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  onClick={() => playSound("keypress")}
                  className="px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => playSound("keypress")}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition-all"
                >
                  <span>Deploy Vault</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:hidden">
            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-lg bg-slate-900/60 border border-white/[0.08] text-slate-400"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900/60 border border-white/[0.08] text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0a0e17]/95 border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs font-mono text-slate-400">
            <span>SYSTEM STATUS</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {backendStatus.online ? "ONLINE" : "LOCAL DEMO"}
            </span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => scrollToSection("hero")}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/[0.04] text-sm font-medium"
            >
              Vault Core
            </button>
            <button
              onClick={() => scrollToSection("simulator")}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/[0.04] text-sm font-medium"
            >
              Live Simulator
            </button>
            <button
              onClick={() => scrollToSection("security")}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/[0.04] text-sm font-medium"
            >
              Security Architecture
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenHardwareSpecs) onOpenHardwareSpecs();
                else scrollToSection("hardware");
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/[0.04] text-sm font-medium flex items-center justify-between"
            >
              <span>Hardware & Circuit Specs</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/[0.04] text-sm font-medium"
            >
              Contact Support
            </button>
          </div>

          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Vault Dashboard</span>
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-medium"
                >
                  <History className="w-4 h-4" />
                  <span>Audit History</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-white/[0.1] text-slate-200 text-sm font-medium hover:bg-white/[0.04]"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
