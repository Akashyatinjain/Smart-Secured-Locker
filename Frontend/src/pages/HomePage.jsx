// App.js - Fixed Responsiveness
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiLock, 
  FiUnlock, 
  FiSmartphone, 
  FiShield, 
  FiClock, 
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiPhone,
  FiMail,
  FiMapPin,
  FiTwitter,
  FiLinkedin,
  FiFacebook,
  FiArrowRight,
  FiChevronRight,
  FiMenu,
  FiX
} from 'react-icons/fi';
import emailjs from 'emailjs-com';

function App() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [lockerStatus, setLockerStatus] = useState('locked');
  const [message, setMessage] = useState('');
  const [activeDemo, setActiveDemo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [status, setStatus] = useState(null); // success | error | null

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '123456') {
      setLockerStatus('unlocked');
      setMessage('✓ Locker unlocked successfully!');
      setActiveDemo(true);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('✗ Invalid OTP. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSendOtp = () => {
    setShowOtpInput(true);
    setMessage('📱 OTP sent to your registered mobile number!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleResetLocker = () => {
    setLockerStatus('locked');
    setShowOtpInput(false);
    setOtp(['', '', '', '', '', '']);
    setActiveDemo(false);
  };

  const handleGetStarted = () => {
    navigate('/sign-up');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/sign-up');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="bg-gradient-to-r from-purple-600 to-purple-600 p-1.5 sm:p-2 rounded-lg">
                <FiLock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
                SecureLocker
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-slate-600 hover:text-purple-600 font-medium transition-colors text-sm xl:text-base"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-slate-600 hover:text-purple-600 font-medium transition-colors text-sm xl:text-base"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-slate-600 hover:text-purple-600 font-medium transition-colors text-sm xl:text-base"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-slate-600 hover:text-purple-600 font-medium transition-colors text-sm xl:text-base"
              >
                Live Demo
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-slate-600 hover:text-purple-600 font-medium transition-colors text-sm xl:text-base"
              >
                Contact
              </button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
              <button 
                onClick={handleLogin}
                className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base text-slate-600 font-medium hover:text-purple-600 transition-colors"
              >
                Login
              </button>  
              <button 
                onClick={handleSignup}
                className="bg-gradient-to-r from-purple-600 to-purple-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base hover:from-purple-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-200 whitespace-nowrap"
              >
                Sign Up Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                Live Demo
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                Contact
              </button>
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <button 
                  onClick={handleLogin}
                  className="block w-full text-center px-4 py-2 text-slate-600 font-medium hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                >
                  Login
                </button>  
                <button 
                  onClick={handleSignup}
                  className="block w-full text-center bg-gradient-to-r from-purple-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-700 transition-all duration-200"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <FiShield className="text-xs sm:text-sm" />
                <span className="text-xs sm:text-sm font-medium">Enterprise-Grade Security</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Smart Secure
                <span className="block bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
                  Locker System
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed">
                Access your belongings securely with one-time passwords. No keys, no cards, just your smartphone. Experience the future of secure storage today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:from-purple-700 hover:to-purple-700 transition-all duration-200 shadow-xl shadow-purple-200 flex items-center justify-center group"
                >
                  Get Started Free
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => scrollToSection('demo')}
                  className="border-2 border-purple-600 text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center justify-center"
                >
                  <FiSmartphone className="mr-2" />
                  Try Demo
                </button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 sm:gap-8 pt-4 sm:pt-8">
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="text-green-500 text-sm sm:text-base" />
                  <span className="text-xs sm:text-sm text-slate-600">10K+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="text-green-500 text-sm sm:text-base" />
                  <span className="text-xs sm:text-sm text-slate-600">99.9% Uptime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="text-green-500 text-sm sm:text-base" />
                  <span className="text-xs sm:text-sm text-slate-600">24/7 Support</span>
                </div>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=800&q=80"
                  alt="Smart Locker"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Live Demo</h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
            Experience how our smart locker system works in real-time
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
          
          {/* Status Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${lockerStatus === 'locked' ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
              <span className="text-xs sm:text-sm font-medium text-slate-500">System Status: Online</span>
            </div>
            {activeDemo && (
              <button
                onClick={handleResetLocker}
                className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Reset Demo
              </button>
            )}
          </div>

          {message && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl text-center flex items-center justify-center text-sm sm:text-base ${
              message.includes('✓') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
              message.includes('✗') ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-purple-50 text-purple-700 border border-purple-200'
            }`}>
              <span className="mr-2">{message}</span>
            </div>
          )}

          <div className="flex flex-col items-center">
            {/* Locker Status Display */}
            <div className="mb-6 sm:mb-8 text-center">
              <div className={`inline-block p-6 sm:p-8 rounded-full ${
                lockerStatus === 'locked' ? 'bg-amber-50' : 'bg-emerald-50'
              } mb-3 sm:mb-4`}>
                {lockerStatus === 'locked' ? (
                  <FiLock className="text-4xl sm:text-5xl md:text-6xl text-amber-600" />
                ) : (
                  <FiUnlock className="text-4xl sm:text-5xl md:text-6xl text-emerald-600" />
                )}
              </div>
              <p className="text-lg sm:text-xl font-semibold text-slate-800">
                Locker is {lockerStatus === 'locked' ? 'Securely Locked' : 'Open & Accessible'}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {lockerStatus === 'locked' ? 'Click "Open Locker" to generate OTP' : 'Door is now open'}
              </p>
            </div>

            {/* OTP Input Section */}
            {!showOtpInput && lockerStatus === 'locked' && (
              <button
                onClick={handleSendOtp}
                className="bg-gradient-to-r from-purple-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:from-purple-700 hover:to-purple-700 transition-all duration-200 shadow-xl shadow-purple-200 flex items-center space-x-2 group"
              >
                <FiSmartphone className="text-lg sm:text-xl" />
                <span>Open Locker with OTP</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* OTP Input */}
            {showOtpInput && lockerStatus === 'locked' && (
              <div className="w-full max-w-md space-y-4 sm:space-y-6">
                <div>
                  <p className="text-center text-slate-600 text-sm sm:text-base mb-3 sm:mb-4">
                    Enter the 6-digit code sent to your phone
                  </p>
                  <div className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl font-semibold border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <button
                    onClick={handleVerifyOtp}
                    className="bg-emerald-600 text-white px-6 py-2.5 sm:py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <FiCheckCircle />
                    <span>Verify & Open</span>
                  </button>
                  <button
                    onClick={() => setShowOtpInput(false)}
                    className="bg-slate-200 text-slate-700 px-6 py-2.5 sm:py-3 rounded-xl hover:bg-slate-300 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <FiXCircle />
                    <span>Cancel</span>
                  </button>
                </div>

                {/* Demo Hint */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-purple-700 text-center">
                    <span className="font-semibold">Demo Mode:</span> Use code "123456"
                  </p>
                </div>
              </div>
            )}

            {/* Success State */}
            {lockerStatus === 'unlocked' && (
              <div className="text-center space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-6">
                  <FiCheckCircle className="text-3xl sm:text-4xl md:text-5xl text-emerald-600 mx-auto mb-2 sm:mb-3" />
                  <h3 className="text-lg sm:text-xl font-semibold text-emerald-700 mb-2">Access Granted!</h3>
                  <p className="text-sm sm:text-base text-emerald-600">Locker door is now open. Please close it after use.</p>
                </div>
                <button
                  onClick={handleResetLocker}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base"
                >
                  ← Test Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-16 sm:py-20 md:py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Enterprise Features</h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Everything you need for secure, convenient locker access
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <FiShield className="text-2xl sm:text-3xl" />,
                title: "Bank-Grade Security",
                description: "Military-grade encryption ensures your belongings are always protected",
                color: "from-purple-600 to-purple-600",
                stats: "256-bit AES"
              },
              {
                icon: <FiSmartphone className="text-2xl sm:text-3xl" />,
                title: "Mobile-First Design",
                description: "Access your locker from anywhere using your smartphone",
                color: "from-purple-600 to-pink-600",
                stats: "99.9% Uptime"
              },
              {
                icon: <FiClock className="text-2xl sm:text-3xl" />,
                title: "Real-time Updates",
                description: "Instant notifications when your locker is accessed",
                color: "from-emerald-600 to-teal-600",
                stats: "< 1s Response"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-xs sm:text-sm text-purple-600 font-medium">
                  <span>{feature.stats}</span>
                  <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gradient-to-br from-purple-600 to-purple-600 py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Simple 4-Step Process</h2>
            <p className="text-base sm:text-lg md:text-xl text-purple-100 max-w-2xl mx-auto px-4">
              Get started in minutes with our intuitive system
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
            {[
              { step: "1", title: "Create Account", desc: "Sign up in under 2 minutes", icon: "👤" },
              { step: "2", title: "Request Access", desc: "Click 'Open Locker'", icon: "🔑" },
              { step: "3", title: "Enter OTP", desc: "Use the 6-digit code", icon: "📱" },
              { step: "4", title: "Access Granted", desc: "Locker opens instantly", icon: "🔓" }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-purple-600 mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-xl">
                    {item.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-purple-100">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <button
              onClick={handleGetStarted}
              className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-xl inline-flex items-center space-x-2 group"
            >
              <span>Get Started Now</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Get in Touch</h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8">
                Have questions? Our team is here to help 24/7.
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiMail className="text-lg sm:text-xl text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Email</p>
                    <p className="text-base sm:text-lg font-semibold text-slate-900 break-all">aj0881871@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiPhone className="text-lg sm:text-xl text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Phone</p>
                    <p className="text-base sm:text-lg font-semibold text-slate-900">+91 7710926977</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiMapPin className="text-lg sm:text-xl text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Address</p>
                    <p className="text-base sm:text-lg font-semibold text-slate-900">St francis</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex space-x-3 sm:space-x-4">
                <a href="https://x.com/DivakarDev93920" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-purple-600 hover:text-white transition-colors">
                  <FiTwitter />
                </a>
                <a href="www.linkedin.com/in/akash-yatin-jain" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-purple-600 hover:text-white transition-colors">
                  <FiLinkedin />
                </a>
                <a href="https://www.facebook.com/share/1TxR2GGWfL/" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-purple-600 hover:text-white transition-colors">
                  <FiFacebook />
                </a>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 sm:p-8 hover:shadow-purple-200 transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 sm:mb-6">Send us a message</h3>
              <form
  onSubmit={(e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_56es5kd',
      'template_tczp81a',
      e.target,
      'OOlyyDJ99U5Lc3EEh'
    ).then(
      () => {
        setStatus("success");
        e.target.reset();

        setTimeout(() => setStatus(null), 3000); // auto hide
      },
      (error) => {
        setStatus("error");
        console.log(error);

        setTimeout(() => setStatus(null), 3000);
      }
    );
  }}
  className="space-y-4"
>
                <div>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Your Name"
                    className="w-full px-4 py-2.5 sm:py-3 border rounded-xl text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="user_email"
                    placeholder="Email Address"
                    className="w-full px-4 py-2.5 sm:py-3 border rounded-xl text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Your Message"
                    className="w-full px-4 py-2.5 sm:py-3 border rounded-xl text-sm sm:text-base"
                    required
                  ></textarea>
                </div>
                <button 
  type="submit"
  className="w-full bg-gradient-to-r from-purple-600 to-purple-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-200 text-sm sm:text-base"
>
  Send Message
</button>

{/* ✅ Success Animation */}
{status === "success" && (
  <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-100 px-4 py-3 rounded-xl animate-[fadeIn_0.5s_ease-in-out]">
    <span className="text-xl">✔️</span>
    <p className="text-sm font-medium">Message sent successfully!</p>
  </div>
)}

{/* ❌ Error Animation */}
{status === "error" && (
  <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-100 px-4 py-3 rounded-xl animate-[fadeIn_0.5s_ease-in-out]">
    <span className="text-xl">❌</span>
    <p className="text-sm font-medium">Failed to send message</p>
  </div>
)}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-500 p-1.5 sm:p-2 rounded-lg">
                  <FiLock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-300 to-purple-300 bg-clip-text text-transparent">
                  SecureLocker
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                Your trusted partner in secure storage solutions. Protecting what matters most.
              </p>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <button onClick={() => scrollToSection('home')} className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('demo')} className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base">
                    Live Demo
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Support</h4>
              <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm sm:text-base">
                <li>FAQs</li>
                <li>Documentation</li>
                <li>API Status</li>
                <li>Security</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Legal</h4>
              <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm sm:text-base">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>GDPR</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-slate-400">
            <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} SecureLocker. All rights reserved. Enterprise-grade security solution.</p>
          </div>
        </div>
      </footer>

      {/* Add animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default App;