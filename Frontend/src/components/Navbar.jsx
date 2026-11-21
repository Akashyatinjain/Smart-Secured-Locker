import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Volume2,
  VolumeX,
  Menu,
  X,
  History,
  LayoutDashboard,
  LogOut,
  ChevronRight
} from "lucide-react";
import { getCurrentUser, logoutUser, checkBackendHealth } from "../services/lockerAPI";
import { toggleAudioMute, getAudioMuted, playSound } from "../utils/audio";

export default function Navbar() {
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
    const checkHealth = async () => {
      const res = await checkBackendHealth();
      setBackendStatus(res);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
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
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group cursor-pointer select-none"
            onClick={() => playSound("keypress")}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 group-hover:bg-emerald-100 transition-all">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                SecureLocker
              </span>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Smart Access System
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => { playSound("keypress"); scrollToSection("hero"); }}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => { playSound("keypress"); scrollToSection("demo"); }}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Live Demo
            </button>
            <button
              onClick={() => { playSound("keypress"); scrollToSection("features"); }}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => { playSound("keypress"); scrollToSection("how-it-works"); }}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => { playSound("keypress"); scrollToSection("contact"); }}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* System Status Pill */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
              <span className={`w-2 h-2 rounded-full ${backendStatus.online ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="hidden lg:inline">{backendStatus.online ? "System Online" : "Local Mode"}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleMuteToggle}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/history"
                  onClick={() => playSound("keypress")}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
                  title="View History"
                >
                  <History className="w-4 h-4" />
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => playSound("keypress")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm flex items-center space-x-1.5 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 border border-slate-200 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  onClick={() => playSound("keypress")}
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => playSound("keypress")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm flex items-center space-x-1 transition-all"
                >
                  <span>Sign Up</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 sm:hidden">
            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => scrollToSection("hero")}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection("demo")}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Live Demo
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Contact
          </button>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium"
                >
                  <History className="w-4 h-4" />
                  <span>View History</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 rounded-xl text-red-600 text-sm font-medium hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium"
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
