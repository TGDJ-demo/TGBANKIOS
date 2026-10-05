import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { Shield, Fingerprint, KeyRound, AlertCircle, X } from 'lucide-react';

interface PaymentAuthModalProps {
  amount: number;
  recipient: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentAuthModal: React.FC<PaymentAuthModalProps> = ({
  amount,
  recipient,
  onSuccess,
  onCancel,
}) => {
  const { testControls } = useBank();
  const [authMethod, setAuthMethod] = useState<'mpin' | 'biometric' | 'otp'>(
    testControls.forceOtpAlways ? 'otp' : 'mpin'
  );
  const [mpin, setMpin] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerifyMpin = () => {
    if (mpin === '1234') {
      setErrorMessage(null);
      onSuccess();
    } else {
      setErrorMessage('Invalid MPIN. Demo MPIN is 1234.');
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '998811' || otp === '123456' || otp.length === 6) {
      setErrorMessage(null);
      onSuccess();
    } else {
      setErrorMessage('Invalid OTP. Use demo OTP: 998811');
    }
  };

  const handleBiometricAuth = () => {
    if (testControls.mockBiometricSuccess) {
      onSuccess();
    } else {
      const ok = window.confirm(`Authorize transfer of $${amount.toFixed(2)} with Face ID?`);
      if (ok) {
        onSuccess();
      } else {
        setErrorMessage('Biometric verification cancelled.');
      }
    }
  };

  return (
    <div
      data-accessibility-id="tgBank.paymentAuth.dialog"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Authorize Payment</span>
          </div>
          <button
            type="button"
            data-accessibility-id="tgBank.paymentAuth.cancelButton"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transaction Summary */}
        <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <span
            data-accessibility-id="tgBank.paymentAuth.amount"
            className="text-xl font-extrabold text-blue-600 dark:text-blue-400 block"
          >
            ${amount.toFixed(2)}
          </span>
          <span
            data-accessibility-id="tgBank.paymentAuth.recipient"
            className="text-xs text-slate-500 dark:text-slate-400 font-medium"
          >
            Paying: {recipient}
          </span>
        </div>

        {/* Option Tabs */}
        {!testControls.forceOtpAlways && (
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              data-accessibility-id="tgBank.paymentAuth.mpinOption"
              onClick={() => {
                setAuthMethod('mpin');
                setErrorMessage(null);
              }}
              className={`py-1.5 rounded-lg transition ${
                authMethod === 'mpin'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              MPIN
            </button>
            <button
              type="button"
              data-accessibility-id="tgBank.paymentAuth.biometricOption"
              onClick={() => {
                setAuthMethod('biometric');
                setErrorMessage(null);
              }}
              className={`py-1.5 rounded-lg transition ${
                authMethod === 'biometric'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Biometric
            </button>
            <button
              type="button"
              data-accessibility-id="tgBank.paymentAuth.otpOption"
              onClick={() => {
                setAuthMethod('otp');
                setErrorMessage(null);
              }}
              className={`py-1.5 rounded-lg transition ${
                authMethod === 'otp'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              SMS OTP
            </button>
          </div>
        )}

        {/* MPIN Form */}
        {authMethod === 'mpin' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Enter 4-digit Security MPIN
              </label>
              <input
                type="password"
                maxLength={4}
                data-accessibility-id="tgBank.paymentAuth.mpinField"
                value={mpin}
                onChange={(e) => setMpin(e.target.value)}
                placeholder="1234"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-lg font-mono tracking-widest text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                data-accessibility-id="tgBank.paymentAuth.mpinCancelButton"
                onClick={onCancel}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                data-accessibility-id="tgBank.paymentAuth.mpinVerifyButton"
                onClick={handleVerifyMpin}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
              >
                Verify MPIN
              </button>
            </div>
          </div>
        )}

        {/* Biometric Form */}
        {authMethod === 'biometric' && (
          <div className="text-center space-y-3 py-2">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 mx-auto flex items-center justify-center">
              <Fingerprint className="w-8 h-8" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Touch ID or Face ID sensor is ready
            </p>
            <button
              type="button"
              data-accessibility-id="tgBank.paymentAuth.biometricButton"
              onClick={handleBiometricAuth}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Verify with Biometrics
            </button>
          </div>
        )}

        {/* OTP Form */}
        {authMethod === 'otp' && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Enter 6-digit SMS OTP
                </label>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                  Demo OTP: 998811
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                data-accessibility-id="tgBank.paymentAuth.otpField"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="998811"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-base font-mono tracking-widest text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                data-accessibility-id="tgBank.paymentAuth.otpCancelButton"
                onClick={onCancel}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                data-accessibility-id="tgBank.paymentAuth.otpVerifyButton"
                onClick={handleVerifyOtp}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div
            data-accessibility-id="tgBank.paymentAuth.errorMessage"
            className="flex items-center gap-1.5 p-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
