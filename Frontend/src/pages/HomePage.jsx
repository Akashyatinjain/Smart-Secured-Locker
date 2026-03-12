// App.js
import React, { useState } from 'react';
import { 
  FiLock, 
  FiUnlock, 
  FiSmartphone, 
  FiShield, 
  FiClock, 
  FiActivity,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

function App() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [lockerStatus, setLockerStatus] = useState('locked');
  const [message, setMessage] = useState('');

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
    // Demo OTP - in real app, this would be validated against backend
    if (enteredOtp === '123456') {
      setLockerStatus('unlocked');
      setMessage('Locker unlocked successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Invalid OTP. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSendOtp = () => {
    setShowOtpInput(true);
    setMessage('OTP sent to your registered mobile number!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     {/* Navigation */}
<nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex justify-between items-center h-16">

      {/* Logo */}
      <div className="flex items-center">
        <FiLock className="h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-xl font-bold text-gray-800">
          SecureLocker
        </span>
      </div>

      {/* Menu */}
      <div className="hidden md:flex items-center space-x-8">
        <a href="/" className="text-gray-700 hover:text-indigo-600 font-medium">
          Home
        </a>
        <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">
          Features
        </a>
        <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium">
          How it Works
        </a>
        <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium">
          Contact
        </a>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-3">
        <button className="px-4 py-2 text-gray-700 font-medium hover:text-indigo-600 transition" href="/login" >
          Login
        </button>  

        <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">
          Sign Up
        </button>
      </div>

    </div>
  </div>
</nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Smart Secure Locker System
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Access your belongings securely with one-time passwords. No keys, no cards, just your smartphone.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={handleSendOtp}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition flex items-center"
              >
                <FiSmartphone className="mr-2" />
                Open Locker
              </button>
              <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Smart Locker"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <FiShield className="text-green-500 text-2xl" />
                <span className="font-semibold">256-bit Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OTP Demo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Try It Now</h2>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="flex flex-col items-center">
            {/* Locker Status */}
            <div className="mb-8 text-center">
              <div className={`inline-block p-6 rounded-full ${
                lockerStatus === 'locked' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {lockerStatus === 'locked' ? (
                  <FiLock className="text-6xl text-red-600" />
                ) : (
                  <FiUnlock className="text-6xl text-green-600" />
                )}
              </div>
              <p className="mt-4 text-xl font-semibold capitalize">
                Locker is {lockerStatus}
              </p>
            </div>

            {/* OTP Input */}
            {showOtpInput && (
              <div className="w-full max-w-md">
                <p className="text-center text-gray-600 mb-4">
                  Enter the 6-digit OTP sent to your phone
                </p>
                <div className="flex justify-center space-x-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  ))}
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleVerifyOtp}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                  >
                    <FiCheckCircle className="mr-2" />
                    Verify OTP
                  </button>
                  <button
                    onClick={() => setShowOtpInput(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition flex items-center"
                  >
                    <FiXCircle className="mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Demo OTP Hint */}
            <div className="mt-6 text-sm text-gray-500">
              <p>Demo OTP: 123456</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose Our System</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FiShield className="text-4xl text-indigo-600" />,
              title: "Secure Access",
              description: "Military-grade encryption ensures your belongings are always safe"
            },
            {
              icon: <FiSmartphone className="text-4xl text-indigo-600" />,
              title: "Mobile Integration",
              description: "Access your locker from anywhere using your smartphone"
            },
            {
              icon: <FiClock className="text-4xl text-indigo-600" />,
              title: "Real-time Updates",
              description: "Get instant notifications when your locker is accessed"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Request Access", desc: "Click on 'Open Locker' button" },
              { step: "2", title: "Receive OTP", desc: "Get a unique OTP on your phone" },
              { step: "3", title: "Enter OTP", desc: "Type the 6-digit code" },
              { step: "4", title: "Access Granted", desc: "Locker opens automatically" }
            ].map((item, index) => (
              <div key={index} className="text-center text-white">
                <div className="w-16 h-16 bg-white text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-indigo-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FiLock className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold">SecureLocker</span>
              </div>
              <p className="text-gray-400">Your trusted partner in secure storage solutions.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white">Home</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@securelocker.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Security St, Safe City</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SecureLocker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;