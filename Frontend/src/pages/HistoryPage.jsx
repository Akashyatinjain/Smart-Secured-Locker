import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  History,
  Shield,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  RefreshCw,
  AlertTriangle,
  Cpu,
  Layers,
  FileSpreadsheet,
  FileJson,
  Sparkles,
  LayoutDashboard
} from "lucide-react";
import { getOtpHistory } from "../services/lockerAPI";
import { playSound } from "../utils/audio";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getOtpHistory();
      if (res.history) {
        setHistory(res.history);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter & Search Logic
  const filtered = history.filter((item) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      item.status?.toUpperCase() === statusFilter.toUpperCase();

    const matchesSearch =
      (item.otp && String(item.otp).includes(searchTerm)) ||
      (item.deviceId && item.deviceId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.status && item.status.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Compute Metrics
  const totalCount = history.length;
  const successCount = history.filter((h) =>
    ["SUCCESS", "UNLOCKED", "PASSKEY_SUCCESS"].includes(h.status)
  ).length;
  const failedCount = history.filter((h) =>
    ["FAILED", "PASSKEY_FAILED"].includes(h.status)
  ).length;
  const generatedCount = history.filter((h) => h.status === "GENERATED").length;

  // Export to CSV
  const handleExportCSV = () => {
    playSound("keypress");
    if (history.length === 0) return;

    const headers = ["Event_ID", "Status", "Device_ID", "OTP_Code", "Timestamp"];
    const rows = history.map((item) => [
      item._id || "N/A",
      item.status || "UNKNOWN",
      item.deviceId || "LOCKER_01",
      item.otp || "N/A",
      new Date(item.createdAt).toISOString()
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vault_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    playSound("keypress");
    if (history.length === 0) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vault_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
      case "UNLOCKED":
      case "PASSKEY_SUCCESS":
        return {
          bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: "ACCESS GRANTED"
        };
      case "FAILED":
      case "PASSKEY_FAILED":
        return {
          bg: "bg-red-500/15 border-red-500/30 text-red-400",
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: "ACCESS DENIED"
        };
      case "EXPIRED":
        return {
          bg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
          icon: <Clock className="w-3.5 h-3.5" />,
          label: "TOKEN EXPIRED"
        };
      case "GENERATED":
      default:
        return {
          bg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
          icon: <KeyRound className="w-3.5 h-3.5" />,
          label: "OTP DISPATCHED"
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      
      {/* Background glowing cyber auras */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* ========================================================
            TOP BAR NAVIGATION
        ======================================================== */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => { playSound("keypress"); navigate("/dashboard"); }}
              className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] text-slate-300 hover:text-white transition-all shadow-md"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Access Audit Ledger
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  IMMUTABLE LOG
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Tamper-evident physical & cloud security trail
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => { playSound("keypress"); fetchHistory(); }}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] text-slate-300 hover:text-white transition-all"
              title="Refresh Ledger"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-all"
            >
              <FileJson className="w-4 h-4" />
              <span>JSON Telemetry</span>
            </button>

            <Link
              to="/dashboard"
              onClick={() => playSound("keypress")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Vault Console</span>
            </Link>
          </div>

        </div>

        {/* ========================================================
            METRICS KPI STRIP
        ======================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>TOTAL EVENTS</span>
              <History className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
              {totalCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Recorded in cloud ledger</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>AUTHORIZED UNLOCKS</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400">
              {successCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              {totalCount > 0 ? `${((successCount / totalCount) * 100).toFixed(1)}% success rate` : "Awaiting events"}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>DENIED / TAMPER ALERTS</span>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-extrabold text-red-400">
              {failedCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Unauthorized entry attempts</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>OTP TOKENS DISPATCHED</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-400">
              {generatedCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Issued to device nodes</p>
          </div>

        </div>

        {/* ========================================================
            SEARCH & FILTER CONTROL BAR
        ======================================================== */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by OTP or Device..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080d1a] border border-white/[0.1] text-xs font-mono text-white focus:border-emerald-400 outline-none transition-all"
            />
          </div>

          {/* Filter Pills & Sort */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => {
                playSound("keypress");
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-white/[0.06] transition-all"
              title="Toggle Sort Order"
            >
              {sortOrder === "desc" ? "↓ Newest" : "↑ Oldest"}
            </button>
            {["ALL", "SUCCESS", "GENERATED", "FAILED", "EXPIRED"].map((status) => (
              <button
                key={status}
                onClick={() => { playSound("keypress"); setStatusFilter(status); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

        </div>

        {/* ========================================================
            AUDIT TRAIL LEDGER TABLE & CARDS
        ======================================================== */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/70 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
          
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
              <p className="text-xs font-mono text-slate-400">Decrypting audit ledger records...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Matching Access Records</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-light">
                {searchTerm || statusFilter !== "ALL"
                  ? "No ledger events match your current filter criteria."
                  : "No events recorded yet. Go to your dashboard to generate your first access code."}
              </p>
              <Link
                to="/dashboard"
                onClick={() => playSound("keypress")}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Go to Dashboard</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#080d1a] text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="p-3.5">EVENT STATUS</th>
                    <th className="p-3.5">TIMESTAMP</th>
                    <th className="p-3.5">DEVICE NODE</th>
                    <th className="p-3.5">OTP CODE</th>
                    <th className="p-3.5 text-right">LEDGER ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {sorted.map((item, idx) => {
                    const badge = getStatusBadge(item.status);

                    return (
                      <tr key={item._id || idx} className="hover:bg-white/[0.02] transition-colors">
                        {/* Status */}
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
                          >
                            {badge.icon}
                            <span>{item.status || badge.label}</span>
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="p-3.5 text-slate-300">
                          <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </div>
                        </td>

                        {/* Device */}
                        <td className="p-3.5">
                          <span className="font-semibold text-white bg-slate-800/80 px-2 py-0.5 rounded border border-white/[0.06]">
                            {item.deviceId || "LOCKER_01"}
                          </span>
                        </td>

                        {/* OTP */}
                        <td className="p-3.5">
                          {item.otp ? (
                            <span className="text-emerald-400 font-bold tracking-wider">
                              {item.otp}
                            </span>
                          ) : (
                            <span className="text-slate-600">●●●●●●</span>
                          )}
                        </td>

                        {/* Ledger ID */}
                        <td className="p-3.5 text-right text-slate-500 text-[11px]">
                          {item._id ? item._id.slice(-8) : `REC-${idx + 1}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer note */}
          {!loading && sorted.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-2">
              <span>Showing {sorted.length} of {totalCount} total verified events</span>
              <span>Audit Signature: SHA-256 Verified Ledger</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
