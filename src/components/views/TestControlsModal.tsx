import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import {
  Sliders,
  CheckCircle2,
  RotateCcw,
  Database,
  ShieldAlert,
  CreditCard,
  X,
  ChevronLeft,
} from 'lucide-react';

export const TestControlsModal: React.FC = () => {
  const {
    testControls,
    updateTestControl,
    resetDemoData,
    resetKYC,
    resetCredit,
    seedDatabase,
    setActiveSubscreen,
  } = useBank();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleResetDemoData = () => {
    resetDemoData();
    showStatus('Demo state reset. Returning to Login screen...');
    setTimeout(() => {
      setActiveSubscreen(null);
    }, 800);
  };

  return (
    <div
      data-accessibility-id="tgBank.testControls.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubscreen(null)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Close</span>
        </button>
        <span className="text-sm font-bold text-slate-900 dark:text-white">TestGrid Controls</span>
        <div className="w-12"></div>
      </div>

      {/* Description */}
      <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl text-xs text-purple-700 dark:text-purple-300">
        <p className="font-semibold mb-0.5">Automation & Edge-Case Simulation</p>
        <p className="text-[11px] text-purple-600/80 dark:text-purple-400">
          Inject deterministic anomalies to verify Appium & XCUITest error handling contracts.
        </p>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          data-accessibility-id="tgBank.testControls.statusMessage"
          className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Toggles Card */}
      <div
        data-accessibility-id="tgBank.testControls.card"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 text-xs"
      >
        {/* Toggle 1: Force Insufficient Balance */}
        <div className="flex items-center justify-between py-2.5">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Force Insufficient Balance
            </span>
            <span className="text-[10px] text-slate-400">Throws 402 Insufficient Funds on debits</span>
          </div>
          <input
            type="checkbox"
            data-accessibility-id="tgBank.testControls.forceInsufficientBalance"
            checked={testControls.forceInsufficientBalance}
            onChange={(e) => updateTestControl('forceInsufficientBalance', e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
        </div>

        {/* Toggle 2: Force Transaction Failure */}
        <div className="flex items-center justify-between py-2.5">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Force Transaction Failure
            </span>
            <span className="text-[10px] text-slate-400">Simulates banking switch network rejection</span>
          </div>
          <input
            type="checkbox"
            data-accessibility-id="tgBank.testControls.forceTransactionFailure"
            checked={testControls.forceTransactionFailure}
            onChange={(e) => updateTestControl('forceTransactionFailure', e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
        </div>

        {/* Toggle 3: Simulate Network Timeout */}
        <div className="flex items-center justify-between py-2.5">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Simulate Network Timeout
            </span>
            <span className="text-[10px] text-slate-400">Forces 504 Gateway Timeout error</span>
          </div>
          <input
            type="checkbox"
            data-accessibility-id="tgBank.testControls.simulateNetworkTimeout"
            checked={testControls.simulateNetworkTimeout}
            onChange={(e) => updateTestControl('simulateNetworkTimeout', e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
        </div>

        {/* Toggle 4: Simulate Unverified KYC */}
        <div className="flex items-center justify-between py-2.5">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Simulate Unverified KYC
            </span>
            <span className="text-[10px] text-slate-400">Sets KYC status to Incomplete</span>
          </div>
          <input
            type="checkbox"
            data-accessibility-id="tgBank.testControls.simulateUnverifiedKyc"
            checked={testControls.simulateUnverifiedKyc}
            onChange={(e) => updateTestControl('simulateUnverifiedKyc', e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
        </div>

        {/* Toggle 5: Mock Biometric Success */}
        <div className="flex items-center justify-between py-2.5">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Mock Biometric Success
            </span>
            <span className="text-[10px] text-slate-400">Auto-resolves Face ID / Touch ID in automation</span>
          </div>
          <input
            type="checkbox"
            data-accessibility-id="tgBank.testControls.mockBiometricSuccess"
            checked={testControls.mockBiometricSuccess}
            onChange={(e) => updateTestControl('mockBiometricSuccess', e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
        </div>

        {/* Toggle 6: Require Payment Auth */}
        <div className="flex items-center justify-between py-2.5">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Require Payment Auth
            </span>
            <span className="text-[10px] text-slate-400">Prompts MPIN / Biometric dialog before transfer</span>
          </div>
          <input
            type="checkbox"
            data-accessibility-id="tgBank.testControls.requirePaymentAuth"
            checked={testControls.requirePaymentAuth}
            onChange={(e) => updateTestControl('requirePaymentAuth', e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
        </div>

        {/* Toggle 7: Force OTP Always */}
        <div className="flex items-center justify-between py-2.5">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Force OTP Always
            </span>
            <span className="text-[10px] text-slate-400">Bypasses biometric and enforces SMS OTP 998811</span>
          </div>
          <input
            type="checkbox"
            data-accessibility-id="tgBank.testControls.forceOtpAlways"
            checked={testControls.forceOtpAlways}
            onChange={(e) => updateTestControl('forceOtpAlways', e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Deterministic Reset Actions */}
      <div className="space-y-2">
        <button
          type="button"
          data-accessibility-id="tgBank.testControls.resetDemoDataButton"
          onClick={handleResetDemoData}
          className="w-full flex items-center justify-between p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 transition text-left"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <div>
              <span className="text-xs font-bold block">Reset Demo Data (Returns to Login)</span>
              <span className="text-[10px] text-rose-600/70">Restores default balances & initial transactions</span>
            </div>
          </div>
        </button>

        <button
          type="button"
          data-accessibility-id="tgBank.testControls.resetKycButton"
          onClick={() => {
            resetKYC();
            showStatus('KYC status reset to Incomplete.');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-purple-400 transition text-left"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Reset KYC Status
              </span>
              <span className="text-[10px] text-slate-400">Reverts to Incomplete status</span>
            </div>
          </div>
        </button>

        <button
          type="button"
          data-accessibility-id="tgBank.testControls.resetCreditButton"
          onClick={() => {
            resetCredit();
            showStatus('Credit limit reset to $5,000,000 and utilization cleared.');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-purple-400 transition text-left"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Reset Credit Utilization
              </span>
              <span className="text-[10px] text-slate-400">Reverts limit to $5M and $0 used</span>
            </div>
          </div>
        </button>

        <button
          type="button"
          data-accessibility-id="tgBank.testControls.seedDatabaseButton"
          onClick={() => {
            seedDatabase();
            showStatus('Database seeded with standard deterministic test records.');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-purple-400 transition text-left"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Seed Demo Database
              </span>
              <span className="text-[10px] text-slate-400">Injects 5 default transactions & beneficiaries</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
