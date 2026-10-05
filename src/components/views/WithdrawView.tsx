import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { Banknote, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const WithdrawView: React.FC = () => {
  const { withdrawMoney, setActiveSubscreen } = useBank();
  const [method, setMethod] = useState<'atm' | 'bankTransfer' | 'debitAccount'>('atm');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txId, setTxId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }

    setErrorMessage(null);
    const res = withdrawMoney(parsedAmount, method);
    if (res.success) {
      setTxId(res.txId || 'TGX202609230011');
      setIsSuccess(true);
    } else {
      setErrorMessage(res.error || 'Withdrawal rejected.');
    }
  };

  return (
    <div
      data-accessibility-id="tgBank.withdraw.screen"
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
        <span className="text-sm font-bold text-slate-900 dark:text-white">Withdraw Funds</span>
        <div className="w-12"></div>
      </div>

      {isSuccess ? (
        <div
          data-accessibility-id="tgBank.withdraw.successCard"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3
              data-accessibility-id="tgBank.withdraw.successTitle"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              Withdrawal Authorized
            </h3>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              -${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Method</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction ID</span>
              <span
                data-accessibility-id="tgBank.withdraw.transactionId"
                className="font-mono font-bold text-blue-600"
              >
                {txId}
              </span>
            </div>
          </div>

          <button
            type="button"
            data-accessibility-id="tgBank.withdraw.doneButton"
            onClick={() => setActiveSubscreen(null)}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition"
          >
            Done
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          data-accessibility-id="tgBank.withdraw.card"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Withdrawal Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-accessibility-id="tgBank.withdraw.method.atm"
                onClick={() => setMethod('atm')}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  method === 'atm'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                ATM
              </button>
              <button
                type="button"
                data-accessibility-id="tgBank.withdraw.method.bankTransfer"
                onClick={() => setMethod('bankTransfer')}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  method === 'bankTransfer'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                Bank
              </button>
              <button
                type="button"
                data-accessibility-id="tgBank.withdraw.method.debitAccount"
                onClick={() => setMethod('debitAccount')}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  method === 'debitAccount'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                Debit
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              data-accessibility-id="tgBank.withdraw.amountField"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500.00"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>

          {errorMessage && (
            <div
              data-accessibility-id="tgBank.withdraw.errorMessage"
              className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            data-accessibility-id="tgBank.withdraw.submitButton"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
          >
            <Banknote className="w-4 h-4" />
            <span>Authorize Cash Withdrawal</span>
          </button>
        </form>
      )}
    </div>
  );
};
