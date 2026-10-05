import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { QrCode, CheckCircle2, AlertCircle, ArrowUpRight, Zap, Store, Coffee, Cloud } from 'lucide-react';
import { QRScannerModal } from './QRScannerModal';

export const UPIPayView: React.FC = () => {
  const { upiPay, setActiveTab, setSelectedTransaction, setActiveSubscreen, transactions } = useBank();

  const [activeTab, setActiveTabLocal] = useState<'payId' | 'scanPay' | 'sendContact' | 'history'>('payId');
  const [upiId, setUpiId] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [successTxId, setSuccessTxId] = useState('');
  const [successAmount, setSuccessAmount] = useState(0);
  const [successVpa, setSuccessVpa] = useState('');
  const [successMerchant, setSuccessMerchant] = useState('');
  const [successTimestamp, setSuccessTimestamp] = useState('');

  // Scanner Modal
  const [showScanner, setShowScanner] = useState(false);

  const handlePay = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!upiId.trim() || !upiId.includes('@')) {
      setErrorMessage('Please enter a valid UPI ID (e.g. merchant@tg).');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }

    setErrorMessage(null);
    const result = upiPay(upiId, merchantName || upiId, parsedAmount, message);

    if (result.success) {
      setSuccessTxId(result.txId || 'TGX202609230009');
      setSuccessAmount(parsedAmount);
      setSuccessVpa(upiId);
      setSuccessMerchant(merchantName || (upiId === 'merchant@tg' ? 'TG Demo Store' : upiId));
      setSuccessTimestamp('Sep 23, 2026, 12:00');
      setIsSuccess(true);
    } else {
      setErrorMessage(result.error || 'UPI Payment rejected.');
    }
  };

  const handleDemoPreset = (vpa: string, merchant: string, amt: number) => {
    setUpiId(vpa);
    setMerchantName(merchant);
    setAmount(amt.toFixed(2));
    setMessage('Demo Store QR Payment');
    setErrorMessage(null);
  };

  const handleScanned = (scannedVpa: string, merchant: string, amt: number) => {
    setShowScanner(false);
    setUpiId(scannedVpa);
    setMerchantName(merchant);
    setAmount(amt.toFixed(2));
    setMessage('Scanned QR payment');
  };

  return (
    <div
      data-accessibility-id="tgBank.upi.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      {/* 4 Tabs: Pay by UPI ID, Scan QR, Pay Contact, History */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-semibold">
        <button
          type="button"
          data-accessibility-id="tgBank.upi.payIdTab"
          onClick={() => {
            setActiveTabLocal('payId');
            setIsSuccess(false);
          }}
          className={`py-1.5 rounded-lg transition ${
            activeTab === 'payId'
              ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          UPI ID
        </button>
        <button
          type="button"
          data-accessibility-id="tgBank.upi.scanPayTab"
          onClick={() => setShowScanner(true)}
          className="py-1.5 rounded-lg transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          Scan QR
        </button>
        <button
          type="button"
          data-accessibility-id="tgBank.upi.sendContactTab"
          onClick={() => {
            setActiveTabLocal('sendContact');
            setIsSuccess(false);
          }}
          className={`py-1.5 rounded-lg transition ${
            activeTab === 'sendContact'
              ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Contact
        </button>
        <button
          type="button"
          data-accessibility-id="tgBank.upi.historyTab"
          onClick={() => setActiveTab('transactions')}
          className="py-1.5 rounded-lg transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          History
        </button>
      </div>

      {isSuccess ? (
        /* UPI Success Card */
        <div
          data-accessibility-id="tgBank.upi.successCard"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3
              data-accessibility-id="tgBank.upi.successTitle"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              Payment Successful
            </h3>
            <p
              data-accessibility-id="tgBank.upi.successAmount"
              className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1"
            >
              ${successAmount.toFixed(2)}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Merchant</span>
              <span
                data-accessibility-id="tgBank.upi.successMerchant"
                className="font-bold text-slate-900 dark:text-white"
              >
                {successMerchant}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">UPI ID / VPA</span>
              <span
                data-accessibility-id="tgBank.upi.successVpa"
                className="font-mono text-purple-600 font-semibold"
              >
                {successVpa}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Timestamp</span>
              <span
                data-accessibility-id="tgBank.upi.successTimestamp"
                className="text-slate-700 dark:text-slate-300"
              >
                {successTimestamp}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Transaction ID</span>
              <span
                data-accessibility-id="tgBank.upi.successTransactionId"
                className="font-mono font-bold text-blue-600"
              >
                {successTxId}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Payment Status</span>
              <span
                data-accessibility-id="tgBank.upi.successStatus"
                className="font-bold text-emerald-600"
              >
                SUCCESSFUL (COMPLETED)
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              data-accessibility-id="tgBank.upi.successDoneButton"
              onClick={() => {
                setIsSuccess(false);
                setUpiId('');
                setMerchantName('');
                setAmount('');
                setMessage('');
              }}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition"
            >
              Done
            </button>

            <button
              type="button"
              data-accessibility-id="tgBank.upi.successViewTransactionButton"
              onClick={() => {
                const found = transactions.find((t) => t.id === successTxId);
                if (found) {
                  setSelectedTransaction(found);
                  setActiveSubscreen('transactionDetail');
                } else {
                  setActiveTab('transactions');
                }
              }}
              className="flex-1 py-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs hover:bg-blue-100 transition"
            >
              View Transaction
            </button>
          </div>
        </div>
      ) : (
        /* UPI Form Card */
        <div className="space-y-4">
          {/* Demo Presets Bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Demo Quick Merchants (Deterministic)
              </span>
              <button
                type="button"
                data-accessibility-id="tgBank.upi.demoQrButton"
                onClick={() => handleDemoPreset('merchant@tg', 'TG Demo Store', 125.0)}
                className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>Default Demo QR ($125)</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-accessibility-id="tgBank.upi.demoMerchant1"
                onClick={() => handleDemoPreset('merchant@tg', 'TG Demo Store', 125.0)}
                className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-purple-400 transition"
              >
                <Store className="w-4 h-4 text-purple-600 mb-1" />
                <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                  TG Demo Store
                </span>
                <span className="text-[10px] text-purple-600 font-semibold">$125.00</span>
              </button>

              <button
                type="button"
                data-accessibility-id="tgBank.upi.demoMerchant2"
                onClick={() => handleDemoPreset('coffee@tg', 'Starbucks #301', 14.5)}
                className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-purple-400 transition"
              >
                <Coffee className="w-4 h-4 text-amber-600 mb-1" />
                <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                  Starbucks Coffee
                </span>
                <span className="text-[10px] text-amber-600 font-semibold">$14.50</span>
              </button>

              <button
                type="button"
                data-accessibility-id="tgBank.upi.demoMerchant3"
                onClick={() => handleDemoPreset('cloud@tg', 'TechGrid Enterprise', 499.0)}
                className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-purple-400 transition"
              >
                <Cloud className="w-4 h-4 text-blue-600 mb-1" />
                <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                  TechGrid Cloud
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">$499.00</span>
              </button>
            </div>
          </div>

          <form
            onSubmit={handlePay}
            data-accessibility-id="tgBank.upi.payIdCard"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Virtual Payment Address (UPI ID)
              </label>
              <input
                type="text"
                data-accessibility-id="tgBank.upi.idField"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  if (e.target.value === 'merchant@tg') setMerchantName('TG Demo Store');
                }}
                placeholder="merchant@tg"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            {merchantName && (
              <div className="p-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 rounded-lg text-xs text-purple-700 dark:text-purple-300 font-medium flex items-center justify-between">
                <span>Verified Merchant:</span>
                <span className="font-bold">{merchantName}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                data-accessibility-id="tgBank.upi.amountField"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="125.00"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Message / Note
              </label>
              <input
                type="text"
                data-accessibility-id="tgBank.upi.messageField"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dinner or Shopping"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            {errorMessage && (
              <div
                data-accessibility-id="tgBank.upi.errorMessage"
                className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              data-accessibility-id="tgBank.upi.payButton"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:scale-98 transition text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5"
            >
              <span>Pay via UPI Switch</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScannerModal
          onScanned={handleScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};
