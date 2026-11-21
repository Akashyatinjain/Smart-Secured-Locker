import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            onClick={() => playSound("keypress")}
            className="inline-flex items-center space-x-2.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              SecureLocker
            </span>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign In to Your Locker
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your credentials to access the locker management dashboard
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          
          {/* Quick Demo Autofill Pill */}
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="text-xs font-medium text-emerald-800">
              <span className="font-semibold">Demo:</span> user@example.com
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-sm"
            >
              <Sparkles className="w-3 h-3" />
              <span>Autofill</span>
            </button>
          </div>

          {/* General Error Alert */}
          {errors.general && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm outline-none transition-all ${
                    errors.email
                      ? "border-red-400 focus:bg-white"
                      : "border-slate-300 focus:border-emerald-600 focus:bg-white"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Password
                </label>
                <span className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm outline-none transition-all ${
                    errors.password
                      ? "border-red-400 focus:bg-white"
                      : "border-slate-300 focus:border-emerald-600 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
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
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-600 font-medium">
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer inside card */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                onClick={() => playSound("keypress")}
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                Sign Up Free
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
