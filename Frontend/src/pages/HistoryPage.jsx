import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  History,
  Search,
  RefreshCw,
  FileSpreadsheet,
  FileJson,
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

  // Filter & Search
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

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Metrics
  const totalCount = history.length;
  const successCount = history.filter((h) =>
    ["SUCCESS", "UNLOCKED", "PASSKEY_SUCCESS"].includes(h.status)
  ).length;
  const failedCount = history.filter((h) =>
    ["FAILED", "PASSKEY_FAILED"].includes(h.status)
  ).length;
  const generatedCount = history.filter((h) => h.status === "GENERATED").length;

  // Export CSV
  const handleExportCSV = () => {
    playSound("keypress");
    if (history.length === 0) return;

    const headers = ["Event_ID", "Status", "Device_ID", "OTP_Code", "Timestamp"];
    const rows = history.map((item) => [
      item._id || "N/A",
      item.status || "UNKNOWN",
      item.deviceId || "Locker 01",
      item.otp || "N/A",
      new Date(item.createdAt).toISOString()
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `locker_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    playSound("keypress");
    if (history.length === 0) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `locker_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => { playSound("keypress"); navigate("/dashboard"); }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Access History</h1>
              <p className="text-xs text-slate-500">Complete audit log of all locker access events</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => { playSound("keypress"); fetchHistory(); }}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <FileJson className="w-4 h-4 text-cyan-600" />
              <span>JSON</span>
            </button>

            <Link
              to="/dashboard"
              onClick={() => playSound("keypress")}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-medium">Total Events</p>
            <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-medium">Successful Unlocks</p>
            <p className="text-2xl font-bold text-emerald-600">{successCount}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-medium">Denied Attempts</p>
            <p className="text-2xl font-bold text-red-600">{failedCount}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-medium">Codes Generated</p>
            <p className="text-2xl font-bold text-cyan-700">{generatedCount}</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code or device..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {["ALL", "SUCCESS", "GENERATED", "FAILED", "EXPIRED"].map((status) => (
              <button
                key={status}
                onClick={() => { playSound("keypress"); setStatusFilter(status); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                {status}
              </button>
            ))}

            <button
              onClick={() => {
                playSound("keypress");
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {sortOrder === "desc" ? "↓ Newest" : "↑ Oldest"}
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500">Loading access records...</div>
          ) : sorted.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <History className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">No matching records found</p>
              <p className="text-xs text-slate-500">Try clearing the search or filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                  <tr>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date & Time</th>
                    <th className="p-3.5">Device</th>
                    <th className="p-3.5">OTP Code</th>
                    <th className="p-3.5 text-right">Event ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {sorted.map((item, idx) => {
                    const isSuccess = ["SUCCESS", "UNLOCKED", "PASSKEY_SUCCESS"].includes(item.status);
                    const isFailed = ["FAILED", "PASSKEY_FAILED"].includes(item.status);

                    return (
                      <tr key={item._id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              isSuccess
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : isFailed
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-cyan-50 text-cyan-700 border border-cyan-200"
                            }`}
                          >
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3.5 font-mono text-slate-800 font-medium">
                          {item.deviceId || "Locker 01"}
                        </td>
                        <td className="p-3.5 font-mono">
                          {item.otp ? (
                            <span className="font-bold text-emerald-700">{item.otp}</span>
                          ) : (
                            <span className="text-slate-400">••••••</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-400 text-[11px]">
                          {item._id ? item._id.slice(-6) : `#${idx + 1}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && sorted.length > 0 && (
            <div className="p-3.5 border-t border-slate-100 text-xs text-slate-500 flex justify-between bg-slate-50">
              <span>Showing {sorted.length} of {totalCount} records</span>
              <span>Synchronized with cloud server</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
