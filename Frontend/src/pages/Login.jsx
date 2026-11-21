import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Sparkles } from "lucide-react";
import { loginUser } from "../services/lockerAPI";
import { playSound } from "../utils/audio";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleFillDemo = () => {
    playSound("keypress");
    setFormData({
      email: "user@example.com",
      password: "password123",
      rememberMe: true,
    });
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      playSound("error");
      return;
    }

    try {
      setIsLoading(true);
      playSound("keypress");
      await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      setIsLoading(false);
      playSound("unlock");
      navigate("/dashboard");
    } catch (err) {
      setIsLoading(false);
      playSound("error");
      const msg = err.response?.data?.message || err.message || "Invalid credentials. Please verify your email and password.";
      setErrors({ general: msg });
    }
  };

  return (
    <div className="min-h-screen bg-[#06080d] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background glowing cyber auras */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Grid pattern */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Header with Logo */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            onClick={() => playSound("keypress")}
            className="inline-flex items-center space-x-2.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-all shadow-lg shadow-emerald-500/10">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              FORTIX<span className="text-emerald-400">.</span>
            </span>
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vault Access Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
              Sign in to manage and monitor your Smart Secured Locker
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/[0.1] shadow-2xl backdrop-blur-xl">
          
          {/* Quick Demo Autofill Pill */}
          <div className="mb-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="text-xs font-mono text-emerald-300">
              <span className="font-bold">DEMO CREDENTIALS:</span> user@example.com
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Autofill</span>
            </button>
          </div>

          {/* General Error Alert */}
          {errors.general && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. operator@vault.io"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#080d1a] border text-white text-sm outline-none transition-all ${
                    errors.email
                      ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-slate-300 uppercase">
                  Password
                </label>
                <span className="text-xs text-emerald-400/80 hover:text-emerald-400 cursor-pointer">
                  Forgot key?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your security password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-[#080d1a] border text-white text-sm outline-none transition-all ${
                    errors.password
                      ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-[#080d1a] border-white/20 text-emerald-500 focus:ring-emerald-400/20"
              />
              <label htmlFor="rememberMe" className="ml-2.5 text-xs text-slate-400">
                Remember this security session
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Authenticating Credentials...</span>
                </span>
              ) : (
                <>
                  <span>Sign In to Vault</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer inside card */}
          <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-xs text-slate-400">
              Need a new locker node?{" "}
              <Link
                to="/sign-up"
                onClick={() => playSound("keypress")}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Register Account
              </Link>
            </p>
          </div>

        </div>

        {/* Security badge below card */}
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>END-TO-END TLS 1.3 • AES-256 GCM ENCRYPTION</span>
        </div>

      </div>
    </div>
  );
}
