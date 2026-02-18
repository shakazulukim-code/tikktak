import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import LandingPage from './components/LandingPage';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import VerificationScreen from './components/VerificationScreen';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'verification' | 'reset-password'>('landing');
  const [loginData, setLoginData] = useState<{ type: 'email' | 'phone', value: string }>({ type: 'phone', value: '' });

  const handleLoginSubmit = (data: { type: 'email' | 'phone', value: string }) => {
    setLoginData(data);
    setCurrentView('verification');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-900 sm:bg-black">
      {/* 
        On mobile: Full screen black background.
        On desktop: Centered modal-like appearance to better showcase the design.
      */}
      <div className="w-full h-full sm:h-auto sm:max-w-md sm:border sm:border-neutral-800 sm:rounded-3xl overflow-hidden bg-black relative shadow-2xl">
        {currentView === 'landing' && (
          <LandingPage onNavigateToLogin={() => setCurrentView('login')} />
        )}
        
        {currentView === 'login' && (
          <LoginScreen 
            onBack={() => setCurrentView('landing')} 
            onLogin={handleLoginSubmit}
          />
        )}

        {currentView === 'verification' && (
          <VerificationScreen
            contactType={loginData.type}
            contactValue={loginData.value}
            onBack={() => setCurrentView('login')}
            onNext={() => setCurrentView('reset-password')}
          />
        )}

        {currentView === 'reset-password' && (
          <ResetPasswordScreen 
            onBack={() => setCurrentView('login')} 
          />
        )}
      </div>
    </div>
  );
};

export default App;