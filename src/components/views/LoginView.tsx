import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { t } from '../../services/localization';
import { Building2, Eye, EyeOff, Fingerprint, Wand2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, testControls, language } = useBank();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (username === 'Sanjay G' && pin === '1234') {
      setErrorMessage(null);
      login(pin);
    } else {
      setErrorMessage('Invalid credentials. Use Sanjay G / 1234.');
    }
  };

  const handleBiometricLogin = () => {
    if (testControls.mockBiometricSuccess) {
      setUsername('Sanjay G');
      setPin('1234');
      login('1234');
    } else {
      // Simulate native prompt
      const confirmed = window.confirm('Face ID Authentication\n\nVerify identity for TG Bank?');
      if (confirmed) {
        setUsername('Sanjay G');
        setPin('1234');
        login('1234');
      } else {
        setErrorMessage('Biometric authentication failed or cancelled.');
      }
    }
  };

  const handleAutofillDemo = () => {
    setUsername('Sanjay G');
    setPin('1234');
    setErrorMessage(null);
  };

  return (
    <div
      data-accessibility-id="tgBank.login.screen"
      className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 px-6 py-8 overflow-y-auto select-none"
    >
      <div className="flex flex-col items-center mt-4 mb-6">
        <div
          data-accessibility-id="tgBank.login.logo"
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-3"
        >
          <Building2 className="w-9 h-9" />
        </div>
        <h1
          data-accessibility-id="tgBank.login.title"
          className="text-2xl font-bold text-slate-900 dark:text-white"
        >
          {t('appName', language)}
        </h1>
        <p
          data-accessibility-id="tgBank.login.subtitle"
          className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium"
        >
          {t('tagline', language)}
        </p>

        {/* Demo Account Indicator */}
        <div
          data-accessibility-id="tgBank.login.demoAccountIndicator"
          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full mt-3 text-xs text-emerald-700 dark:text-emerald-400 font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{t('demoAccount', language)}</span>
        </div>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {/* Username */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            {t('usernamePlaceholder', language)}
          </label>
          <input
            type="text"
            data-accessibility-id="tgBank.login.usernameField"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Sanjay G"
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PIN */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            {t('pinPlaceholder', language)}
          </label>
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={4}
              data-accessibility-id="tgBank.login.pinField"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest font-mono"
            />
            <button
              type="button"
              data-accessibility-id="tgBank.login.pinVisibilityButton"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            data-accessibility-id="tgBank.login.errorMessage"
            className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-medium"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sign In Button */}
        <button
          type="submit"
          data-accessibility-id="tgBank.login.signInButton"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t('signIn', language)}</span>
        </button>

        {/* Biometric Button */}
        <button
          type="button"
          onClick={handleBiometricLogin}
          data-accessibility-id="tgBank.login.biometricButton"
          className="w-full py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition"
        >
          <Fingerprint className="w-4 h-4" />
          <span>{t('biometricSignIn', language)}</span>
        </button>

        {/* Autofill Demo Credentials */}
        <button
          type="button"
          onClick={handleAutofillDemo}
          data-accessibility-id="tgBank.login.demoCredentialsButton"
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('useDemo', language)}</span>
        </button>

        {/* Forgot PIN */}
        <div className="text-center pt-2">
          <button
            type="button"
            data-accessibility-id="tgBank.login.forgotPinButton"
            onClick={() => setErrorMessage('Demo Security PIN is: 1234')}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
          >
            {t('forgotPin', language)}
          </button>
        </div>
      </form>

      <div className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-auto pt-4">
        TestGrid Mobile Automation Platform • Appium / XCUITest Ready
      </div>
    </div>
  );
};
