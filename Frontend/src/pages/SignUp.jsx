import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, User, Eye, EyeOff, ArrowRight, AlertCircle, Check, X } from "lucide-react";
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
    if (strength <= 25) return { label: "Weak", color: "bg-red-500", text: "text-red-600" };
    if (strength <= 50) return { label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
    if (strength <= 75) return { label: "Good", color: "bg-blue-500", text: "text-blue-600" };
    return { label: "Strong", color: "bg-emerald-600", text: "text-emerald-700" };
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
      errs.agreeTerms = "You must accept the terms of service";
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
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
              Create Your Account
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign up to set up and manage your smart secured locker
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          
          {/* General Error Alert */}
          {errors.general && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Akash Yatin Jain"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm outline-none transition-all ${
                    errors.fullName
                      ? "border-red-400 focus:bg-white"
                      : "border-slate-300 focus:border-emerald-600 focus:bg-white"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

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
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password (min 6 characters)"
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

              {/* Password strength meter */}
              {formData.password && (
                <div className="mt-2.5 space-y-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Password Strength:</span>
                    <span className={`font-semibold ${meta.text}`}>{meta.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${meta.color} transition-all duration-300`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>

                  {/* Criteria checklist */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-600">
                    <span className={`flex items-center gap-1 ${rules.length ? "text-emerald-700 font-medium" : "text-slate-400"}`}>
                      {rules.length ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-400" />}
                      <span>6+ Characters</span>
                    </span>
                    <span className={`flex items-center gap-1 ${rules.number ? "text-emerald-700 font-medium" : "text-slate-400"}`}>
                      {rules.number ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-400" />}
                      <span>Has Number</span>
                    </span>
                    <span className={`flex items-center gap-1 ${rules.upper ? "text-emerald-700 font-medium" : "text-slate-400"}`}>
                      {rules.upper ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-400" />}
                      <span>Uppercase (A-Z)</span>
                    </span>
                    <span className={`flex items-center gap-1 ${rules.special ? "text-emerald-700 font-medium" : "text-slate-400"}`}>
                      {rules.special ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-400" />}
                      <span>Special Symbol</span>
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm outline-none transition-all ${
                    errors.confirmPassword
                      ? "border-red-400 focus:bg-white"
                      : "border-slate-300 focus:border-emerald-600 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
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
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <label htmlFor="agreeTerms" className="ml-2 text-xs text-slate-600 leading-normal">
                  I agree to the{" "}
                  <span className="text-emerald-600 hover:underline cursor-pointer font-medium">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-emerald-600 hover:underline cursor-pointer font-medium">
                    Privacy Policy
                  </span>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="mt-1 text-xs text-red-600">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Creating Account...</span>
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer inside card */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                onClick={() => playSound("keypress")}
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>

        {/* Security badge below card */}
        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected with 256-bit encryption and salted passwords</span>
        </div>

      </div>
    </div>
  );
}
