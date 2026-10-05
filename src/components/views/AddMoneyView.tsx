import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { PlusCircle, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const AddMoneyView: React.FC = () => {
  const { addMoney, setActiveSubscreen, setActiveTab, setSelectedTransaction, transactions } = useBank();
  const [method, setMethod] = useState<'Debit Card' | 'Bank Transfer'>('Debit Card');
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
    const res = addMoney(parsedAmount, method);
    if (res.success) {
      setTxId(res.txId || 'TGX202609230010');
      setIsSuccess(true);
    } else {
      setErrorMessage(res.error || 'Failed to add money.');
    }
  };

  return (
    <div
      data-accessibility-id="tgBank.addMoney.screen"
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
        <span className="text-sm font-bold text-slate-900 dark:text-white">Add Money</span>
        <div className="w-12"></div>
      </div>

      {isSuccess ? (
        <div
          data-accessibility-id="tgBank.addMoney.successCard"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3
              data-accessibility-id="tgBank.addMoney.successTitle"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              Funds Added Successfully
            </h3>
            <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">
              +${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Method</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction ID</span>
              <span
                data-accessibility-id="tgBank.addMoney.transactionId"
                className="font-mono font-bold text-blue-600"
              >
                {txId}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              data-accessibility-id="tgBank.addMoney.doneButton"
              onClick={() => setActiveSubscreen(null)}
              className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition"
            >
              Done
            </button>

            <button
              type="button"
              data-accessibility-id="tgBank.addMoney.viewTransactionButton"
              onClick={() => {
                const found = transactions.find((t) => t.id === txId);
                if (found) {
                  setSelectedTransaction(found);
                  setActiveSubscreen('transactionDetail');
                } else {
                  setActiveTab('transactions');
                }
              }}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition"
            >
              View Transaction
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          data-accessibility-id="tgBank.addMoney.card"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Deposit Method
            </label>
            <div
              data-accessibility-id="tgBank.addMoney.methodPicker"
              className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              {(['Debit Card', 'Bank Transfer'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    method === m
                      ? 'bg-white dark:bg-slate-900 text-teal-600 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Deposit Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              data-accessibility-id="tgBank.addMoney.amountField"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000.00"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
            />

            <div className="flex gap-2 mt-2">
              {[
                { label: '+$5k', val: '5000', id: 'tgBank.addMoney.quickAmount.5000' },
                { label: '+$10k', val: '10000', id: 'tgBank.addMoney.quickAmount.10000' },
                { label: '+$25k', val: '25000', id: 'tgBank.addMoney.quickAmount.25000' },
                { label: '+$50k', val: '50000', id: 'tgBank.addMoney.quickAmount.50000' },
              ].map((q) => (
                <button
                  key={q.val}
                  type="button"
                  data-accessibility-id={q.id}
                  onClick={() => setAmount(q.val)}
                  className="flex-1 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div
              data-accessibility-id="tgBank.addMoney.errorMessage"
              className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            data-accessibility-id="tgBank.addMoney.submitButton"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Load Funds into Checking</span>
          </button>
        </form>
      )}
    </div>
  );
};
