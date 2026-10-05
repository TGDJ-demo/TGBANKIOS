import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { ChevronLeft, ArrowDownLeft, ArrowUpRight, Download, Check } from 'lucide-react';

export const TransactionDetailModal: React.FC = () => {
  const { selectedTransaction, setActiveSubscreen } = useBank();
  const [downloaded, setDownloaded] = useState(false);

  if (!selectedTransaction) {
    return null;
  }

  const tx = selectedTransaction;

  const handleDownloadPdf = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div
      data-accessibility-id="tgBank.transactionDetail.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          data-accessibility-id="tgBank.transactionDetail.backButton"
          onClick={() => setActiveSubscreen(null)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-sm font-bold text-slate-900 dark:text-white">Transaction Details</span>
        <div className="w-12"></div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        {/* Top Icon & Amount */}
        <div className="text-center space-y-2 pb-2">
          <div
            className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
              tx.isCredit
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
            }`}
          >
            {tx.isCredit ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
          </div>

          <h3
            data-accessibility-id="tgBank.transactionDetail.title"
            className="text-base font-bold text-slate-900 dark:text-white"
          >
            {tx.title}
          </h3>

          <div
            data-accessibility-id="tgBank.transactionDetail.amount"
            className={`text-3xl font-extrabold ${
              tx.isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
            }`}
          >
            {tx.isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
          </div>

          <span
            data-accessibility-id="tgBank.transactionDetail.status"
            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            {tx.status}
          </span>
        </div>

        {/* Key-Value Breakdown */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Transaction ID</span>
            <span
              data-accessibility-id="tgBank.transactionDetail.transactionId"
              className="font-mono font-bold text-blue-600 dark:text-blue-400"
            >
              {tx.id}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-400">Recipient / Merchant</span>
            <span
              data-accessibility-id="tgBank.transactionDetail.recipient"
              className="font-semibold text-slate-800 dark:text-slate-200"
            >
              {tx.recipientOrMerchant}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-400">Category</span>
            <span
              data-accessibility-id="tgBank.transactionDetail.category"
              className="text-slate-700 dark:text-slate-300"
            >
              {tx.category}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-400">Timestamp</span>
            <span
              data-accessibility-id="tgBank.transactionDetail.timestamp"
              className="text-slate-700 dark:text-slate-300"
            >
              {tx.timestamp}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-400">Note / Memo</span>
            <span
              data-accessibility-id="tgBank.transactionDetail.note"
              className="text-slate-700 dark:text-slate-300"
            >
              {tx.note}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-400">Transfer Rail</span>
            <span
              data-accessibility-id="tgBank.transactionDetail.rail"
              className="font-bold text-slate-700 dark:text-slate-300"
            >
              {tx.rail || tx.type}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-400">Reference Number</span>
            <span
              data-accessibility-id="tgBank.transactionDetail.referenceId"
              className="font-mono text-slate-700 dark:text-slate-300"
            >
              {tx.referenceId}
            </span>
          </div>
        </div>

        {/* Download Receipt PDF */}
        <button
          type="button"
          data-accessibility-id="tgBank.transactionDetail.downloadReceiptButton"
          onClick={handleDownloadPdf}
          className="w-full py-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
        >
          {downloaded ? <Check className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />}
          <span>{downloaded ? 'Receipt Downloaded (PDF)' : 'Download PDF Receipt'}</span>
        </button>
      </div>
    </div>
  );
};
