import React from "react";
import { Lock, Unlock, Wifi, Battery, RotateCcw } from "lucide-react";
import { playSound } from "../utils/audio";

export default function LockerVisualizer({
  status = "LOCKED",
  countdown = 0,
  deviceId = "Locker #01",
  temperature = "24°C",
  onQuickRelock
}) {
  const isUnlocked = status === "UNLOCKED";

  const handleRelockClick = () => {
    playSound("lock");
    if (onQuickRelock) onQuickRelock();
  };

  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      
      {/* Visualizer Card Container */}
      <div className="relative rounded-2xl p-6 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50">
        
        {/* Device Status Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isUnlocked ? "bg-emerald-500 animate-ping" : "bg-emerald-500"
              }`}
            />
            <span className="font-semibold text-slate-900 tracking-tight">{deviceId}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
              Online
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-500 text-xs">
            <span className="flex items-center gap-1 font-mono">
              <Wifi className="w-3.5 h-3.5 text-slate-400" />
              <span>98%</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-emerald-600">
              <Battery className="w-3.5 h-3.5" />
              <span>Full</span>
            </span>
          </div>
        </div>

        {/* Central Circular Lock Dial */}
        <div className="py-8 flex flex-col items-center justify-center">
          
          <div className="relative mb-5">
            {/* Subtle glow when unlocked */}
            <div
              className={`absolute -inset-3 rounded-full transition-all duration-500 pointer-events-none ${
                isUnlocked ? "bg-emerald-100/70 blur-md" : "bg-slate-100/50"
              }`}
            />

            {/* Circular Dial Face */}
            <div
              className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                isUnlocked
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-emerald-100"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {isUnlocked ? (
                <Unlock className="w-12 h-12 text-emerald-600 transition-transform duration-300 scale-105" />
              ) : (
                <Lock className="w-12 h-12 text-slate-600 transition-transform duration-300" />
              )}

              <span
                className={`mt-2 text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                  isUnlocked
                    ? "bg-emerald-200/70 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {isUnlocked ? "UNLOCKED" : "LOCKED"}
              </span>
            </div>
          </div>

          {/* Status Message */}
          <div className="w-full text-center space-y-2">
            {isUnlocked ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>✓ Locker Unlocked</span>
                  <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">
                    {countdown > 0 ? `${countdown}s remaining` : "Relocking..."}
                  </span>
                </div>

                <p className="text-[11px] text-emerald-700 text-left">
                  Door is open. Locker will automatically re-lock when the countdown ends.
                </p>

                {/* Countdown progress bar */}
                <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${Math.min(100, (countdown / 10) * 100)}%` }}
                  />
                </div>

                <button
                  onClick={handleRelockClick}
                  className="mt-2 w-full py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Lock Immediately</span>
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between text-slate-800 font-medium">
                  <span>● Secured with 12V Solenoid</span>
                  <span className="text-[11px] text-slate-400 font-mono">{temperature}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Locker is locked. Generate a 6-digit OTP code to unlock.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>AES-256 Encrypted</span>
          <span>10s Auto-Relock Watchdog</span>
        </div>

      </div>
    </div>
  );
}
