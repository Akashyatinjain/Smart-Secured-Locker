import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: "https://smart-secured-locker.onrender.com/api"
});

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Add token interceptor
        API.interceptors.request.use((req) => {
          if (token) {
            req.headers.Authorization = `Bearer ${token}`;
          }
          return req;
        });

        const res = await API.get("/otp-history");
        setHistory(res.data.history);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Status configuration
  const statusConfig = {
    UNLOCKED: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-700",
      icon: "🔓",
      dot: "bg-emerald-500"
    },
    LOCKED: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-700",
      icon: "🔒",
      dot: "bg-amber-500"
    },
    EXPIRED: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-700",
      badge: "bg-slate-100 text-slate-700",
      icon: "⏱️",
      dot: "bg-slate-500"
    },
    USED: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      icon: "✓",
      dot: "bg-blue-500"
    }
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-700",
      badge: "bg-slate-100 text-slate-700",
      icon: "📋",
      dot: "bg-slate-500"
    };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Back Button & Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-slate-900 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-light text-slate-900 tracking-tight">
                  OTP History
                  <span className="block text-xs sm:text-sm font-normal text-slate-500 mt-0.5">
                    View your access activity
                  </span>
                </h1>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">Total Records:</span>
                <span className="text-sm font-semibold text-slate-700">{history.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-slate-600">Loading history...</p>
            </div>
          </div>
        ) : history.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-slate-800 mb-2">No History Found</h3>
              <p className="text-sm sm:text-base text-slate-500 mb-6">
                You haven't generated any OTPs yet. Go to your dashboard to create your first access code.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200"
              >
                <span>Go to Dashboard</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // History List
          <div className="space-y-3 sm:space-y-4">
            
            {/* Mobile Stats Summary */}
            <div className="sm:hidden bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total Records:</span>
                <span className="text-base font-semibold text-slate-700">{history.length}</span>
              </div>
            </div>

            {/* History Items */}
            {history.map((item, index) => {
              const status = getStatusConfig(item.status);
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      
                      {/* Left Section - Status & Time */}
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${status.bg} flex items-center justify-center text-xl sm:text-2xl`}>
                          {status.icon}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.badge}`}>
                              {item.status}
                            </span>
                            {item.status === 'UNLOCKED' && (
                              <span className="text-xs text-emerald-600">✓ Access Granted</span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-500 flex items-center">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Right Section - Device Info */}
                      <div className="sm:text-right">
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                          <p className="text-xs text-slate-500 mb-1">Device ID</p>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-mono text-slate-700 break-all">
                              {item.deviceId || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* OTP Display if available */}
                    {item.otp && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">OTP Code</span>
                          <span className="text-lg sm:text-xl font-mono font-bold tracking-wider text-slate-700">
                            {item.otp}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        {!loading && history.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Showing {history.length} recent {history.length === 1 ? 'activity' : 'activities'}
            </p>
          </div>
        )}
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

export default HistoryPage;