import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { QrCode, Copy, Check, Share2, ArrowLeft } from 'lucide-react';

export const ReceiveMoneyView: React.FC = () => {
  const { user, setActiveSubscreen } = useBank();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `TG Bank Account Details:\nName: ${user.name}\nAccount: ${user.rawAccountNumber}\nIFSC: ${user.ifsc}\nUPI: ${user.upiId}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-accessibility-id="tgBank.receive.screen"
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
        <span className="text-sm font-bold text-slate-900 dark:text-white">Receive Money</span>
        <div className="w-12"></div>
      </div>

      <div
        data-accessibility-id="tgBank.receive.card"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-5 shadow-sm"
      >
        {/* QR Code Container */}
        <div
          data-accessibility-id="tgBank.receive.qrFrame"
          className="w-56 h-56 mx-auto bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center justify-center"
        >
          {/* Simulated QR Code SVG pattern */}
          <div className="w-44 h-44 bg-slate-900 rounded-xl p-2 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
                <div className="w-4 h-4 bg-white"></div>
              </div>
              <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
                <div className="w-4 h-4 bg-white"></div>
              </div>
            </div>
            <div className="flex justify-center items-center py-2">
              <span className="text-[9px] font-black text-white tracking-widest uppercase bg-purple-600 px-1 rounded">
                UPI • TG
              </span>
            </div>
            <div className="flex justify-between">
              <div className="w-10 h-10 border-4 border-white bg-slate-900 flex items-center justify-center">
                <div className="w-4 h-4 bg-white"></div>
              </div>
              <div className="w-8 h-8 grid grid-cols-2 gap-1 p-1">
                <div className="bg-white"></div>
                <div className="bg-white"></div>
                <div className="bg-white"></div>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">
            Scan to Pay Sanjay G
          </span>
        </div>

        {/* Profile / Account Information */}
        <div className="space-y-2 text-xs">
          <h3
            data-accessibility-id="tgBank.receive.userName"
            className="text-base font-bold text-slate-900 dark:text-white"
          >
            {user.name}
          </h3>

          <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-400">UPI ID / VPA</span>
            <span
              data-accessibility-id="tgBank.receive.upiId"
              className="font-mono font-bold text-purple-600"
            >
              {user.upiId}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-400">Account Number</span>
            <span
              data-accessibility-id="tgBank.receive.accountNumber"
              className="font-mono font-medium text-slate-900 dark:text-white"
            >
              {user.accountNumber}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-400">IFSC / Code</span>
            <span
              data-accessibility-id="tgBank.receive.ifsc"
              className="font-mono font-bold text-blue-600 uppercase"
            >
              {user.ifsc}
            </span>
          </div>
        </div>

        {/* Share Details Button */}
        <button
          type="button"
          data-accessibility-id="tgBank.receive.shareDetailsButton"
          onClick={handleShare}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Details Copied to Clipboard!' : 'Share Bank & UPI Details'}</span>
        </button>
      </div>
    </div>
  );
};
