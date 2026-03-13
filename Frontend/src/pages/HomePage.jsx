// App.js
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
  FiChevronRight
} from 'react-icons/fi';

function App() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [lockerStatus, setLockerStatus] = useState('locked');
  const [message, setMessage] = useState('');
  const [activeDemo, setActiveDemo] = useState(false);

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
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <FiLock className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SecureLocker
              </span>
            </div>

            {/* Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Live Demo
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Contact
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleLogin}
                className="px-5 py-2.5 text-slate-600 font-medium hover:text-indigo-600 transition-colors"
              >
                Login
              </button>  
              <button 
                onClick={handleSignup}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-200"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20"></div>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-indigo-300 rounded-full opacity-10 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                <FiShield className="text-sm" />
                <span className="text-sm font-medium">Enterprise-Grade Security</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Smart Secure
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Locker System
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Access your belongings securely with one-time passwords. No keys, no cards, just your smartphone. Experience the future of secure storage today.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-xl shadow-indigo-200 flex items-center group"
                >
                  Get Started Free
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => scrollToSection('demo')}
                  className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-all duration-200 flex items-center"
                >
                  <FiSmartphone className="mr-2" />
                  Try Demo
                </button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-sm text-slate-600">10K+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-sm text-slate-600">99.9% Uptime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-sm text-slate-600">24/7 Support</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Smart Locker"
                  className="rounded-2xl shadow-2xl"
                />
                {/* Floating stats */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiShield className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Security</p>
                      <p className="font-semibold text-slate-900">256-bit Encrypted</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FiActivity className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Active Users</p>
                      <p className="font-semibold text-slate-900">2,847 Online</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Live Demo</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Experience how our smart locker system works in real-time
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-3xl mx-auto">
          
          {/* Status Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${lockerStatus === 'locked' ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
              <span className="text-sm font-medium text-slate-500">System Status: Online</span>
            </div>
            {activeDemo && (
              <button
                onClick={handleResetLocker}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Reset Demo
              </button>
            )}
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-center flex items-center justify-center ${
              message.includes('✓') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
              message.includes('✗') ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              <span className="mr-2">{message}</span>
            </div>
          )}

          <div className="flex flex-col items-center">
            {/* Locker Status Display */}
            <div className="mb-8 text-center">
              <div className={`inline-block p-8 rounded-full ${
                lockerStatus === 'locked' ? 'bg-amber-50' : 'bg-emerald-50'
              } mb-4`}>
                {lockerStatus === 'locked' ? (
                  <FiLock className="text-6xl text-amber-600" />
                ) : (
                  <FiUnlock className="text-6xl text-emerald-600" />
                )}
              </div>
              <p className="text-xl font-semibold text-slate-800">
                Locker is {lockerStatus === 'locked' ? 'Securely Locked' : 'Open & Accessible'}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {lockerStatus === 'locked' ? 'Click "Open Locker" to generate OTP' : 'Door is now open'}
              </p>
            </div>

            {/* OTP Input Section */}
            {!showOtpInput && lockerStatus === 'locked' && (
              <button
                onClick={handleSendOtp}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-xl shadow-indigo-200 flex items-center space-x-2 group"
              >
                <FiSmartphone className="text-xl" />
                <span>Open Locker with OTP</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* OTP Input */}
            {showOtpInput && lockerStatus === 'locked' && (
              <div className="w-full max-w-md space-y-6">
                <div>
                  <p className="text-center text-slate-600 mb-4">
                    Enter the 6-digit code sent to your phone
                  </p>
                  <div className="flex justify-center space-x-3 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-14 h-14 text-center text-2xl font-semibold border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleVerifyOtp}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center space-x-2"
                  >
                    <FiCheckCircle />
                    <span>Verify & Open</span>
                  </button>
                  <button
                    onClick={() => setShowOtpInput(false)}
                    className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all flex items-center space-x-2"
                  >
                    <FiXCircle />
                    <span>Cancel</span>
                  </button>
                </div>

                {/* Demo Hint */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <p className="text-sm text-indigo-700 text-center">
                    <span className="font-semibold">Demo Mode:</span> Use code "123456"
                  </p>
                </div>
              </div>
            )}

            {/* Success State */}
            {lockerStatus === 'unlocked' && (
              <div className="text-center space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <FiCheckCircle className="text-5xl text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-emerald-700 mb-2">Access Granted!</h3>
                  <p className="text-emerald-600">Locker door is now open. Please close it after use.</p>
                </div>
                <button
                  onClick={handleResetLocker}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ← Test Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Enterprise Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need for secure, convenient locker access
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiShield className="text-3xl" />,
                title: "Bank-Grade Security",
                description: "Military-grade encryption ensures your belongings are always protected",
                color: "from-indigo-600 to-purple-600",
                stats: "256-bit AES"
              },
              {
                icon: <FiSmartphone className="text-3xl" />,
                title: "Mobile-First Design",
                description: "Access your locker from anywhere using your smartphone",
                color: "from-purple-600 to-pink-600",
                stats: "99.9% Uptime"
              },
              {
                icon: <FiClock className="text-3xl" />,
                title: "Real-time Updates",
                description: "Instant notifications when your locker is accessed",
                color: "from-emerald-600 to-teal-600",
                stats: "< 1s Response"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-sm text-indigo-600 font-medium">
                  <span>{feature.stats}</span>
                  <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gradient-to-br from-indigo-600 to-purple-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple 4-Step Process</h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Get started in minutes with our intuitive system
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Account", desc: "Sign up in under 2 minutes", icon: "👤" },
              { step: "2", title: "Request Access", desc: "Click 'Open Locker'", icon: "🔑" },
              { step: "3", title: "Enter OTP", desc: "Use the 6-digit code", icon: "📱" },
              { step: "4", title: "Access Granted", desc: "Locker opens instantly", icon: "🔓" }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-indigo-300/50">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-3xl font-bold text-indigo-600 mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-indigo-100">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={handleGetStarted}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-xl inline-flex items-center space-x-2 group"
            >
              <span>Get Started Now</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h2>
              <p className="text-xl text-slate-600 mb-8">
                Have questions? Our team is here to help 24/7.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FiMail className="text-xl text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-lg font-semibold text-slate-900">support@securelocker.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FiPhone className="text-xl text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="text-lg font-semibold text-slate-900">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FiMapPin className="text-xl text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="text-lg font-semibold text-slate-900">123 Security St, Safe City, SC 12345</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-colors">
                  <FiTwitter />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-colors">
                  <FiLinkedin />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-colors">
                  <FiFacebook />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <textarea
                    rows="4"
                    placeholder="Your Message"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  ></textarea>
                </div>
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-200">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                  <FiLock className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  SecureLocker
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your trusted partner in secure storage solutions. Protecting what matters most.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => scrollToSection('home')} className="text-slate-400 hover:text-white transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-white transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-slate-400 hover:text-white transition-colors">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('demo')} className="text-slate-400 hover:text-white transition-colors">
                    Live Demo
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li>FAQs</li>
                <li>Documentation</li>
                <li>API Status</li>
                <li>Security</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-slate-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>GDPR</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} SecureLocker. All rights reserved. Enterprise-grade security solution.</p>
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