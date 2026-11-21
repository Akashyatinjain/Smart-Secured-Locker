import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, User, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Check, X } from "lucide-react";
import { signupUser } from "../services/lockerAPI";
import { playSound } from "../utils/audio";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password rules checklist
  const pass = formData.password;
  const rules = {
    length: pass.length >= 6,
    number: /[0-9]/.test(pass),
    upper: /[A-Z]/.test(pass),
    special: /[^A-Za-z0-9]/.test(pass),
  };

  const getStrengthScore = () => {
    let score = 0;
    if (rules.length) score += 25;
    if (rules.number) score += 25;
    if (rules.upper) score += 25;
    if (rules.special) score += 25;
    return score;
  };

  const strength = getStrengthScore();

  const getStrengthMeta = () => {
    if (strength <= 25) return { label: "Weak", color: "bg-red-500", text: "text-red-400" };
    if (strength <= 50) return { label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
    if (strength <= 75) return { label: "Good", color: "bg-cyan-500", text: "text-cyan-400" };
    return { label: "Military-Grade", color: "bg-emerald-500", text: "text-emerald-400" };
  };

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

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters";
    }

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

    if (!formData.confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = "You must accept the security agreement";
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

      await signupUser({
        username: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setIsLoading(false);
      playSound("unlock");
      navigate("/login");
    } catch (err) {
      setIsLoading(false);
      playSound("error");
      const msg = err.response?.data?.message || err.message || "Registration failed. Please try a different email.";
      setErrors({ general: msg });
    }
  };

  const meta = getStrengthMeta();

  return (
    <div className="min-h-screen bg-[#06080d] flex items-center justify-center p-4 relative overflow-hidden py-12">
      
      {/* Background glowing cyber auras */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
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
              Deploy Secure Vault Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
              Register for your cryptographic smart locker control hub
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/[0.1] shadow-2xl backdrop-blur-xl">
          
          {/* General Error Alert */}
          {errors.general && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Akash Yatin Jain"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#080d1a] border text-white text-sm outline-none transition-all ${
                    errors.fullName
                      ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
              )}
            </div>

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
                  placeholder="e.g. name@vault.io"
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

            {/* Password Field with Live Strength */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create master password (min 6 chars)"
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

              {/* Password strength meter */}
              {formData.password && (
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Entropy Strength:</span>
                    <span className={`font-bold ${meta.text}`}>{meta.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${meta.color} transition-all duration-300`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>

                  {/* Criteria checklist */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-mono text-slate-400">
                    <span className={`flex items-center gap-1 ${rules.length ? "text-emerald-400" : "text-slate-500"}`}>
                      {rules.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>6+ Characters</span>
                    </span>
                    <span className={`flex items-center gap-1 ${rules.number ? "text-emerald-400" : "text-slate-500"}`}>
                      {rules.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Has Number</span>
                    </span>
                    <span className={`flex items-center gap-1 ${rules.upper ? "text-emerald-400" : "text-slate-500"}`}>
                      {rules.upper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Uppercase (A-Z)</span>
                    </span>
                    <span className={`flex items-center gap-1 ${rules.special ? "text-emerald-400" : "text-slate-500"}`}>
                      {rules.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Special Symbol</span>
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Confirm Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter master password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-[#080d1a] border text-white text-sm outline-none transition-all ${
                    errors.confirmPassword
                      ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="pt-1">
              <div className="flex items-start">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded bg-[#080d1a] border-white/20 text-emerald-500 focus:ring-emerald-400/20"
                />
                <label htmlFor="agreeTerms" className="ml-2.5 text-xs text-slate-400 leading-normal">
                  I agree to the{" "}
                  <span className="text-emerald-400 hover:underline cursor-pointer">
                    Zero-Trust Cryptographic Agreement
                  </span>{" "}
                  and{" "}
                  <span className="text-emerald-400 hover:underline cursor-pointer">
                    Privacy Policy
                  </span>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="mt-1 text-xs text-red-400">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Generating Vault Credentials...</span>
                </span>
              ) : (
                <>
                  <span>Create Vault Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer inside card */}
          <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                onClick={() => playSound("keypress")}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>

        {/* Security badge below card */}
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>ZERO-KNOWLEDGE BCRYPT 12-ROUND SALTED HASHING</span>
        </div>

      </div>
    </div>
  );
}
