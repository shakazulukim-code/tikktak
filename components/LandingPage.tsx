import React from 'react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="flex flex-col h-screen sm:h-[800px] bg-black text-white relative overflow-hidden">
        {/* Background Ambient Effect */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-12 z-10">
            {/* Creative Container with Logo */}
            <div className="flex flex-col items-center gap-6 animate-fade-in">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff2b4e] to-[#25f4ee] rounded-3xl opacity-30 blur group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative w-32 h-32 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800/50 shadow-2xl">
                        <img 
                            src="https://i.postimg.cc/vBKDX4Br/tiktok-logo-tikok-icon-transparent-tikok-app-logo-free-png.webp" 
                            alt="App Logo" 
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                </div>
                
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Log in to TikTok
                    </h2>
                    <p className="text-neutral-500 text-sm">
                        Manage your account, check notifications, comment on videos, and more.
                    </p>
                </div>
            </div>

            {/* Button Container */}
            <div className="w-full max-w-xs space-y-4">
                <button 
                    onClick={onNavigateToLogin}
                    className="w-full py-4 bg-[#ff2b4e] hover:bg-[#e62243] text-white rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
                >
                    Log in
                </button>
            </div>
        </div>

        {/* Simple Footer */}
        <div className="p-8 text-center border-t border-neutral-900 bg-black z-10">
            <p className="text-neutral-600 text-[11px] leading-relaxed">
                By continuing, you agree to our <span className="text-neutral-400 font-medium">Terms of Service</span> and acknowledge that you have read our <span className="text-neutral-400 font-medium">Privacy Policy</span>.
            </p>
        </div>
    </div>
  );
};

export default LandingPage;