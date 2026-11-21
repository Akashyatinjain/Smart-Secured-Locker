import React, { useState } from "react";
import { Lock, Unlock, AlertTriangle, Shield, Zap, Radio, Thermometer, RotateCcw, Activity } from "lucide-react";
import { playSound } from "../utils/audio";

export default function LockerVisualizer({
  status = "LOCKED",
  countdown = 0,
  deviceId = "SSL-NODE-01",
  temperature = "23.4°C",
  voltage = "12.1V",
  onQuickRelock,
  onTriggerTamper
}) {
  const isUnlocked = status === "UNLOCKED";
  const [handleTurning, setHandleTurning] = useState(false);

  const handleWheelClick = () => {
    playSound(isUnlocked ? "lock" : "error");
    setHandleTurning(true);
    setTimeout(() => setHandleTurning(false), 600);
    if (isUnlocked && onQuickRelock) {
      onQuickRelock();
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto select-none font-mono">
      
      {/* Heavy Industrial Chassis Outer Shell */}
      <div className="relative rounded-2xl p-4 sm:p-6 bg-gradient-to-b from-[#14171f] via-[#0d0f14] to-[#07090c] border-2 border-slate-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        
        {/* Real Allen Screws in 4 Corners */}
        <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-[#1b1f2b] border border-slate-600 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 border-t border-l border-slate-600"></div>
        </div>
        <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-[#1b1f2b] border border-slate-600 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 border-t border-l border-slate-600"></div>
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-[#1b1f2b] border border-slate-600 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 border-t border-l border-slate-600"></div>
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-[#1b1f2b] border border-slate-600 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 border-t border-l border-slate-600"></div>
        </div>

        {/* Laser-Etched Hardware Spec Banner */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-sm animate-pulse" />
            <span className="font-bold text-slate-200 tracking-wider">
              SPEC-7: {deviceId}
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
              REV 2.4
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[10px]">
            <span className="text-cyan-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {voltage}
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              {temperature}
            </span>
          </div>
        </div>

        {/* Machined Brushed Steel Vault Door Panel */}
        <div className="relative mt-4 p-5 sm:p-7 rounded-xl bg-gradient-to-br from-[#1e2330] via-[#121622] to-[#0a0d14] border border-slate-700/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.08),inset_0_-2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Hairline Metal Seam Accents */}
          <div className="absolute top-0 left-8 bottom-0 w-[1px] bg-slate-800/80 pointer-events-none" />
          <div className="absolute top-0 right-8 bottom-0 w-[1px] bg-slate-800/80 pointer-events-none" />

          {/* Left Dual Deadbolts (Machined Steel Pins) */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-around py-8 pointer-events-none">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`w-3.5 sm:w-4.5 h-10 rounded-r border-t border-b border-r border-slate-500 transition-all duration-700 shadow-md ${
                  isUnlocked
                    ? "-translate-x-full bg-slate-800 opacity-20"
                    : "translate-x-0 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-amber-500/20"
                }`}
              />
            ))}
          </div>

          {/* Right Dual Deadbolts */}
          <div className="absolute inset-y-0 right-0 flex flex-col justify-around py-8 pointer-events-none">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`w-3.5 sm:w-4.5 h-10 rounded-l border-t border-b border-l border-slate-500 transition-all duration-700 shadow-md ${
                  isUnlocked
                    ? "translate-x-full bg-slate-800 opacity-20"
                    : "translate-x-0 bg-gradient-to-l from-slate-400 via-slate-200 to-slate-400 shadow-amber-500/20"
                }`}
              />
            ))}
          </div>

          {/* Centerpiece: Mechanical Vault Wheel & Spoke Mechanism */}
          <div className="flex flex-col items-center justify-center">
            
            {/* The 3-Spoke Vault Rotary Handle */}
            <div className="relative my-2 sm:my-3">
              
              {/* Outer Gear Ring Inset */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#0a0d14] border-4 border-slate-800 flex items-center justify-center shadow-inner relative">
                
                {/* Status LED Bezel Ring */}
                <div
                  className={`absolute inset-1.5 rounded-full border-2 transition-all duration-700 ${
                    isUnlocked
                      ? "border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                      : "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                  }`}
                />

                {/* Rotating 3-Spoke Wheel */}
                <div
                  onClick={handleWheelClick}
                  title={isUnlocked ? "Click wheel to relock vault" : "Mechanical Vault Wheel"}
                  className={`relative w-24 h-24 sm:w-30 sm:h-30 rounded-full bg-gradient-to-br from-slate-700 via-slate-900 to-slate-950 border-2 border-slate-600 cursor-pointer shadow-2xl flex items-center justify-center transition-transform duration-700 ${
                    isUnlocked ? "rotate-90" : "rotate-0"
                  } ${handleTurning ? "rotate-180" : ""}`}
                >
                  {/* Spokes */}
                  <div className="absolute w-full h-3 bg-gradient-to-r from-slate-500 via-slate-200 to-slate-500 rounded-sm shadow-md" />
                  <div className="absolute w-3 h-full bg-gradient-to-b from-slate-500 via-slate-200 to-slate-500 rounded-sm shadow-md" />
                  <div className="absolute w-full h-3 bg-gradient-to-r from-slate-500 via-slate-200 to-slate-500 rounded-sm shadow-md rotate-45" />

                  {/* Center Cap with Lock Status */}
                  <div
                    className={`relative z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isUnlocked
                        ? "bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        : "bg-amber-950 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
                    }`}
                  >
                    {isUnlocked ? (
                      <Unlock className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* VFD (Vacuum Fluorescent Display) Style Green Phosphor Console */}
            <div className="w-full mt-4 p-3.5 rounded-lg bg-[#040906] border border-emerald-500/40 font-mono text-[11px] shadow-[inset_0_0_15px_rgba(16,185,129,0.15)] relative overflow-hidden">
              
              {/* Scanline CRT simulation */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,255,100,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

              <div className="flex items-center justify-between text-emerald-400 border-b border-emerald-900/60 pb-1.5 mb-2">
                <span className="flex items-center gap-1.5 font-bold tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  VFD_STATUS: {isUnlocked ? "AUTHORIZED_OPEN" : "STANDBY_LATCHED"}
                </span>
                <span className="text-[10px] text-emerald-500 font-mono">
                  RELAY: 12V_NO
                </span>
              </div>

              {isUnlocked ? (
                <div className="space-y-1 text-emerald-300">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">SOLENOID DISENGAGED [10s RELOCK WATCHDOG]</span>
                    <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200 font-bold">
                      {countdown > 0 ? `${countdown}s` : "LOCKING"}
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-400/80">
                    Mechanical bolt pins retracted. Door openable.
                  </p>
                  {/* Progress line */}
                  <div className="w-full h-1 bg-emerald-950 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-1000 ease-linear"
                      style={{ width: `${Math.min(100, (countdown / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5 text-slate-300">
                  <p className="text-amber-400 font-semibold">BOLT_RELAY: ENERGIZED_LATCHED</p>
                  <p className="text-[10px] text-slate-400">
                    Deadbolt pins extended. Ready for 60s dynamic OTP or master passkey.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Action Buttons Below Door */}
            <div className="mt-3.5 flex items-center justify-between w-full text-[10px]">
              {isUnlocked ? (
                <button
                  onClick={() => {
                    playSound("lock");
                    if (onQuickRelock) onQuickRelock();
                  }}
                  className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Manual Emergency Relock</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    playSound("error");
                    if (onTriggerTamper) onTriggerTamper();
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-500/40 flex items-center gap-1 transition-all"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Simulate Intruder Tamper</span>
                </button>
              )}

              <span className="text-slate-500 font-mono">
                BCRYPT-12 • HARDWARE WATCHDOG
              </span>
            </div>

          </div>

        </div>

        {/* Bottom Laser Engraved Rating Label */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 font-mono">
          <span>RATED: 12V DC / 1.1A / 10MM STROKE</span>
          <span>SFIT EMBEDDED SYSTEMS LAB</span>
        </div>

      </div>
    </div>
  );
}
