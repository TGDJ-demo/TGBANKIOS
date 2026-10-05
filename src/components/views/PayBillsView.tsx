import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { FileText, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const PayBillsView: React.FC = () => {
  const { payBill, setActiveSubscreen } = useBank();
  const [biller, setBiller] = useState('Pacific Gas & Electric');
  const [accountNum, setAccountNum] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNum.trim()) {
      setErrorMessage('Please enter consumer / account number.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid bill amount.');
      return;
    }

    setErrorMessage(null);
    const res = payBill(biller, accountNum, parsedAmount);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMessage(res.error || 'Bill payment failed.');
    }
  };

  return (
    <div
      data-accessibility-id="tgBank.payBills.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubscreen(null)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span className="text-sm font-bold text-slate-900 dark:text-white">Pay Utility Bills</span>
        <div className="w-12"></div>
      </div>

      {isSuccess ? (
        <div
          data-accessibility-id="tgBank.payBills.successCard"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Bill Paid Successfully
            </h3>
            <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
              ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Biller</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{biller}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account #</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{accountNum}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveSubscreen(null)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 transition"
          >
            Done
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          data-accessibility-id="tgBank.payBills.card"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Select Biller
            </label>
            <select
              value={biller}
              onChange={(e) => setBiller(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="Pacific Gas & Electric">Pacific Gas & Electric</option>
              <option value="AT&T Fiber Internet">AT&T Fiber Internet</option>
              <option value="City Water & Utility">City Water & Utility</option>
              <option value="Metropolitan Transit">Metropolitan Transit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Account / Consumer Number
            </label>
            <input
              type="text"
              data-accessibility-id="tgBank.payBills.accountField"
              value={accountNum}
              onChange={(e) => setAccountNum(e.target.value)}
              placeholder="e.g. 445-9921"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              data-accessibility-id="tgBank.payBills.amountField"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="120.00"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>

          {errorMessage && (
            <div
              data-accessibility-id="tgBank.payBills.errorMessage"
              className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            data-accessibility-id="tgBank.payBills.submitButton"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Pay Utility Bill</span>
          </button>
        </form>
      )}
    </div>
  );
};
