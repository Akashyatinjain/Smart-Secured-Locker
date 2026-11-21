import React, { useState } from "react";
import { X, Cpu, Zap, Terminal, AlertTriangle } from "lucide-react";
import { playSound } from "../utils/audio";

export default function HardwareSpecsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen) return null;

  const handleClose = () => {
    playSound("keypress");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                IoT Hardware & Circuit Architecture
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Smart Secured Locker • Embedded System Specifications
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 my-6 p-1 bg-slate-100 rounded-xl border border-slate-200/60 overflow-x-auto">
          {[
            { id: "overview", label: "Components & Bill of Materials" },
            { id: "pinouts", label: "Pinout & Wiring Matrix" },
            { id: "logic", label: "Microcontroller Firmware Logic" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { playSound("keypress"); setActiveTab(tab.id); }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-emerald-700 font-semibold shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex items-center space-x-2 text-emerald-700 font-semibold mb-2">
                  <Cpu className="w-4 h-4" />
                  <span>Microcontroller (MCU)</span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  ESP32 Dual-Core Xtensa LX6 @ 240MHz with integrated Wi-Fi 802.11 b/g/n and BLE 4.2 (or Arduino Uno / Mega via UART).
                </p>
                <div className="text-xs text-slate-600 space-y-1 font-mono">
                  <div>• RAM: 520 KB SRAM | Flash: 4MB SPI</div>
                  <div>• Operating Voltage: 3.3V Logic / 5V USB</div>
                  <div>• Hardware Crypto Engine: AES, SHA-2, RSA</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex items-center space-x-2 text-amber-700 font-semibold mb-2">
                  <Zap className="w-4 h-4" />
                  <span>12V Solenoid Magnetic Lock</span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Fail-Secure Electromagnetic Solenoid Bolt (Locks automatically when power is removed).
                </p>
                <div className="text-xs text-slate-600 space-y-1 font-mono">
                  <div>• Operating Current: 1.1A @ 12V DC</div>
                  <div>• Stroke Length: 10mm Steel Tongue</div>
                  <div>• Controlled via: Optocoupled 5V Relay + Flyback Diode (1N4007)</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex items-center space-x-2 text-blue-700 font-semibold mb-2">
                  <Terminal className="w-4 h-4" />
                  <span>16x2 I2C Character Display</span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  High-contrast alphanumeric display providing visual feedback directly at the physical locker door.
                </p>
                <div className="text-xs text-slate-600 space-y-1 font-mono">
                  <div>• Interface: 2-Wire I2C (SDA/SCL) via PCF8574T</div>
                  <div>• Default I2C Address: 0x27 or 0x3F</div>
                  <div>• Backlight: High-efficiency LED with software sleep</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex items-center space-x-2 text-purple-700 font-semibold mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Tamper Alarm & Matrix Keypad</span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  4x4 Matrix Keypad for manual PIN/OTP entry + 85dB Active Piezo Buzzer for unauthorized access alerts.
                </p>
                <div className="text-xs text-slate-600 space-y-1 font-mono">
                  <div>• Keypad: 8-pin Row/Column Multiplexing</div>
                  <div>• Alarm Frequency: 2.4 kHz Pulse Pattern</div>
                  <div>• Door Sensor: Magnetic Reed Switch (GPIO Interrupt)</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === "pinouts" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Component Pin</th>
                  <th className="p-3">ESP32 Pin</th>
                  <th className="p-3">Arduino Pin</th>
                  <th className="p-3">Function / Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">Relay IN (Solenoid)</td>
                  <td className="p-3 text-emerald-700 font-bold">GPIO 26</td>
                  <td className="p-3 text-emerald-700 font-bold">Digital Pin 7</td>
                  <td className="p-3">Digital Out (Active LOW to energize)</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">LCD SDA</td>
                  <td className="p-3 text-blue-700 font-bold">GPIO 21</td>
                  <td className="p-3 text-blue-700 font-bold">Analog A4</td>
                  <td className="p-3">I2C Data Bus</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">LCD SCL</td>
                  <td className="p-3 text-blue-700 font-bold">GPIO 22</td>
                  <td className="p-3 text-blue-700 font-bold">Analog A5</td>
                  <td className="p-3">I2C Clock Bus</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">Piezo Buzzer (+)</td>
                  <td className="p-3 text-purple-700 font-bold">GPIO 19</td>
                  <td className="p-3 text-purple-700 font-bold">Digital Pin 8</td>
                  <td className="p-3">PWM Frequency / Tone Generator</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">Door Reed Sensor</td>
                  <td className="p-3 text-amber-700 font-bold">GPIO 34</td>
                  <td className="p-3 text-amber-700 font-bold">Digital Pin 2</td>
                  <td className="p-3">Hardware Interrupt on Change</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">Keypad Rows (R1-R4)</td>
                  <td className="p-3">GPIO 13, 12, 14, 27</td>
                  <td className="p-3">D9, D10, D11, D12</td>
                  <td className="p-3">Internal Pull-up Matrix Input</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "logic" && (
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 shadow-inner">
            <div className="text-emerald-400 font-semibold text-sm">
              // Firmware Execution Pipeline (C++ / Arduino IDE)
            </div>
            <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`void loop() {
  // 1. Poll cloud backend or keypad for incoming unlock command
  if (WiFi.status() == WL_CONNECTED) {
    checkCloudUnlockQueue();
  }

  // 2. Read keypad input buffer
  char key = keypad.getKey();
  if (key) {
    handleKeypadInput(key);
  }

  // 3. Auto-relock timer watchdog
  if (isUnlocked && millis() > unlockUntilTimestamp) {
    digitalWrite(RELAY_PIN, HIGH); // De-energize solenoid (LOCK)
    isUnlocked = false;
    lcd.clear();
    lcd.print("LOCKER SECURED");
    tone(BUZZER_PIN, 1000, 150);
  }
}`}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="pt-5 mt-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            Close Specifications
          </button>
        </div>

      </div>
    </div>
  );
}
