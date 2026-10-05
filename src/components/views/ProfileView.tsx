import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { AppLanguage, ThemeMode } from '../../types';
import {
  User,
  Sun,
  Moon,
  Laptop,
  Globe,
  Shield,
  Fingerprint,
  KeyRound,
  LogOut,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    theme,
    setTheme,
    language,
    setLanguage,
    logout,
    setActiveSubscreen,
  } = useBank();

  const [pinChangeMsg, setPinChangeMsg] = useState<string | null>(null);

  const handleChangePin = () => {
    setPinChangeMsg('PIN unchanged: Demo Security PIN remains 1234.');
    setTimeout(() => setPinChangeMsg(null), 3000);
  };

  return (
    <div
      data-accessibility-id="tgBank.profile.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center shadow-sm">
        <div
          data-accessibility-id="tgBank.profile.avatar"
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl mx-auto flex items-center justify-center shadow-md mb-2"
        >
          SG
        </div>

        <h3
          data-accessibility-id="tgBank.profile.name"
          className="text-base font-bold text-slate-900 dark:text-white"
        >
          {user.name}
        </h3>

        <p
          data-accessibility-id="tgBank.profile.email"
          className="text-xs text-slate-500 dark:text-slate-400 font-medium"
        >
          {user.email}
        </p>

        <div className="flex justify-center mt-3">
          <div
            data-accessibility-id="tgBank.profile.kycStatus"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              user.kycStatus === 'Verified'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {user.kycStatus === 'Verified' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span>KYC: {user.kycStatus}</span>
          </div>
        </div>
      </div>

      {/* Theme Appearance */}
      <div
        data-accessibility-id="tgBank.profile.themeCard"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5"
      >
        <span className="text-xs font-bold text-slate-900 dark:text-white block">
          Theme Appearance
        </span>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            data-accessibility-id="tgBank.profile.theme.system"
            onClick={() => setTheme('system')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              theme === 'system'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>System</span>
          </button>

          <button
            type="button"
            data-accessibility-id="tgBank.profile.theme.light"
            onClick={() => setTheme('light')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>

          <button
            type="button"
            data-accessibility-id="tgBank.profile.theme.dark"
            onClick={() => setTheme('dark')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Language Card (English Contract IDs) */}
      <div
        data-accessibility-id="tgBank.profile.languageCard"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5"
      >
        <span className="text-xs font-bold text-slate-900 dark:text-white block">
          App Language (Multi-Lingual)
        </span>

        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'en' as AppLanguage, label: 'English', id: 'tgBank.profile.language.en' },
            { key: 'es' as AppLanguage, label: 'Español', id: 'tgBank.profile.language.es' },
            { key: 'fr' as AppLanguage, label: 'Français', id: 'tgBank.profile.language.fr' },
            { key: 'hi' as AppLanguage, label: 'हिन्दी', id: 'tgBank.profile.language.hi' },
            { key: 'de' as AppLanguage, label: 'Deutsch', id: 'tgBank.profile.language.de' },
            { key: 'ja' as AppLanguage, label: '日本語', id: 'tgBank.profile.language.ja' },
          ].map((l) => (
            <button
              key={l.key}
              type="button"
              data-accessibility-id={l.id}
              onClick={() => setLanguage(l.key)}
              className={`py-2 text-xs font-bold rounded-xl border transition ${
                language === l.key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div
        data-accessibility-id="tgBank.profile.securitySettings"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
      >
        <span className="text-xs font-bold text-slate-900 dark:text-white block">
          Security & Credentials
        </span>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div
            data-accessibility-id="tgBank.profile.biometricSettings"
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Face ID / Biometric Login
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Security PIN (Demo: 1234)
              </span>
            </div>
            <button
              type="button"
              data-accessibility-id="tgBank.profile.changePin"
              onClick={handleChangePin}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Change PIN
            </button>
          </div>
        </div>

        {pinChangeMsg && (
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium pt-1">
            {pinChangeMsg}
          </p>
        )}
      </div>

      {/* Test Controls Shortcut */}
      <button
        type="button"
        onClick={() => setActiveSubscreen('testControls')}
        className="w-full flex items-center justify-between p-3.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl text-purple-700 dark:text-purple-300 transition"
      >
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4" />
          <span className="text-xs font-bold">TestGrid Automation Edge-Case Controls</span>
        </div>
        <span className="text-[10px] font-bold bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded-full">
          Configure
        </span>
      </button>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="w-full py-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};
