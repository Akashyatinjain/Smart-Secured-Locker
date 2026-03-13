import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: "https://smart-secured-locker.onrender.com/api"
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [lockerStatus, setLockerStatus] = useState("Loading...");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("token");

  // Axios interceptor to attach token
  API.interceptors.request.use((req) => {
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  // Fetch locker status
  const fetchLockerStatus = async () => {
    try {
      const res = await API.get("/locker-status");
      setLockerStatus(res.data.lockerStatus);
    } catch (error) {
      console.log(error);
    }
  };

  // Generate OTP
  const handleGenerateOTP = async () => {
    try {
      setLoading(true);
      const res = await API.post("/generate-otp");
      setOtp(res.data.otp || "Check backend console");
      setShowOTP(true);
      setTimeLeft(60);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Copy OTP to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // OTP countdown timer
  useEffect(() => {
    let timer;
    if (showOTP && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowOTP(false);
      setOtp("");
    }
    return () => clearInterval(timer);
  }, [showOTP, timeLeft]);

  useEffect(() => {
    fetchLockerStatus();
    // auto refresh locker status every 3 seconds
    const interval = setInterval(() => {
      fetchLockerStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Professional color schemes based on status
  const statusConfig = {
    UNLOCKED: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
      progress: "bg-emerald-500",
      icon: "🔓"
    },
    LOCKED: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
      badge: "bg-amber-100 text-amber-700",
      progress: "bg-amber-500",
      icon: "🔒"
    },
    Loading: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-700",
      dot: "bg-slate-500",
      badge: "bg-slate-100 text-slate-700",
      progress: "bg-slate-500",
      icon: "⏳"
    }
  };

  const currentStatus = lockerStatus === "UNLOCKED" ? "UNLOCKED" : lockerStatus === "LOCKED" ? "LOCKED" : "Loading";
  const status = statusConfig[currentStatus];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      
      {/* Main Container */}
      <div className="max-w-7xl w-full">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-slate-900 tracking-tight">
                Locker Management
                <span className="block text-sm font-normal text-slate-500 mt-1">
                  Enterprise Access Control System
                </span>
              </h1>
            </div>
            
            {/* System Status Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.dot} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${status.dot}`}></span>
                </span>
                <span className="text-sm text-slate-600">System Online</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 flex items-center space-x-2"
              >
                <span>👤</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Status Overview */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Current Status
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{status.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.badge}`}>
                    {lockerStatus}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>LOCKED</span>
                    <span>UNLOCKED</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${status.progress} transition-all duration-500 ease-in-out`}
                      style={{ width: lockerStatus === "UNLOCKED" ? "100%" : "0%" }}
                    />
                  </div>
                </div>

                {/* Timestamp */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <button
                  onClick={handleGenerateOTP}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>🔑</span>
                      <span>Generate Access OTP</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - OTP Display & Activity */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* OTP Display Card */}
            {showOTP ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                    Generated OTP
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Expires in</span>
                    <span className="text-sm font-mono font-medium text-slate-700">{timeLeft}s</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        One-Time Password
                      </span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 transition-all duration-1000"
                          style={{ width: `${(timeLeft / 60) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-mono font-bold tracking-[0.25em] text-slate-800">
                        {otp}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="relative p-3 hover:bg-slate-100 rounded-lg transition-colors group"
                      >
                        {copied ? (
                          <span className="text-emerald-600 text-sm font-medium">Copied!</span>
                        ) : (
                          <>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center text-xs text-slate-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Valid for 60 seconds • Use once</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700 flex items-start">
                      <span className="mr-2">⚠️</span>
                      <span>This OTP is sensitive. Don't share it with anyone. It will expire automatically.</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Placeholder when no OTP
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-slate-700 mb-1">No Active OTP</h3>
                  <p className="text-xs text-slate-500">Generate a new OTP to access the locker</p>
                </div>
              </div>
            )}

            {/* System Info Card */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Security Level</p>
                    <p className="text-sm font-medium text-slate-700">AES-256 Encrypted</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Session</p>
                    <p className="text-sm font-medium text-slate-700">Active • Real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;