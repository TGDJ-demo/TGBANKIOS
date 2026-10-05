import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import {
  CreditCard,
  TrendingUp,
  FileText,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CreditView: React.FC = () => {
  const {
    user,
    creditCards,
    requestCreditLimitIncrease,
    payCreditBill,
    setActiveSubscreen,
  } = useBank();

  const [increaseMessage, setIncreaseMessage] = useState<string | null>(null);
  const [statementMessage, setStatementMessage] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleRequestIncrease = () => {
    const res = requestCreditLimitIncrease();
    setIncreaseMessage(res.message);
    setTimeout(() => setIncreaseMessage(null), 3000);
  };

  const handleDownloadStatement = () => {
    setStatementMessage('Statement downloaded: TG_Statement_Aug2026.pdf');
    setTimeout(() => setStatementMessage(null), 3000);
  };

  const handleMakePayment = () => {
    const res = payCreditBill();
    if (res.success) {
      setPaymentError(null);
    } else {
      setPaymentError(res.error || 'Payment failed.');
    }
  };

  return (
    <div
      data-accessibility-id="tgBank.credit.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      {/* Credit Score Card */}
      <div
        data-accessibility-id="tgBank.credit.scoreCard"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between"
      >
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            FICO / Experian Score
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              data-accessibility-id="tgBank.credit.scoreValue"
              className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400"
            >
              {user.creditScore}
            </span>
            <span
              data-accessibility-id="tgBank.credit.rating"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400"
            >
              {user.creditRating}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Excellent tier • In top 1% nationally</p>
        </div>

        <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-emerald-500" />
        </div>
      </div>

      {/* Credit Overview Card */}
      <div
        data-accessibility-id="tgBank.credit.overviewCard"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm"
      >
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Credit Facility Summary</span>
          <span className="text-[10px] text-slate-400">Due: {user.paymentDue}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Total Limit</span>
            <span
              data-accessibility-id="tgBank.credit.limit"
              className="text-xs font-extrabold text-slate-800 dark:text-slate-200"
            >
              ${user.creditLimit.toLocaleString()}
            </span>
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Available</span>
            <span
              data-accessibility-id="tgBank.credit.available"
              className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400"
            >
              ${user.availableCredit.toLocaleString()}
            </span>
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Utilized</span>
            <span
              data-accessibility-id="tgBank.credit.used"
              className="text-xs font-extrabold text-rose-600 dark:text-rose-400"
            >
              ${user.usedCredit.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Next payment banner */}
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl">
          <div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-semibold block">
              Next Minimum Payment
            </span>
            <span
              data-accessibility-id="tgBank.credit.nextPaymentAmount"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              ${user.nextPayment.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            data-accessibility-id="tgBank.credit.makePaymentButton"
            onClick={handleMakePayment}
            disabled={user.nextPayment <= 0}
            className={`px-4 py-2 font-bold rounded-xl text-xs shadow-sm transition ${
              user.nextPayment > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Pay Now
          </button>
        </div>

        {paymentError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{paymentError}</span>
          </div>
        )}
      </div>

      {/* Success / Status Messages */}
      {increaseMessage && (
        <div
          data-accessibility-id="tgBank.credit.increaseSuccessMessage"
          className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{increaseMessage}</span>
        </div>
      )}

      {statementMessage && (
        <div
          data-accessibility-id="tgBank.credit.statementSuccessMessage"
          className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statementMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          type="button"
          data-accessibility-id="tgBank.credit.requestIncreaseButton"
          onClick={handleRequestIncrease}
          className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 transition shadow-sm text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Request Limit Increase (+$250,000)
              </span>
              <span className="text-[10px] text-slate-400">Instant algorithmic approval based on FICO 850</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          data-accessibility-id="tgBank.credit.statementsButton"
          onClick={handleDownloadStatement}
          className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 transition shadow-sm text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Download Statement (PDF)
              </span>
              <span className="text-[10px] text-slate-400">TG_Statement_Aug2026.pdf</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          data-accessibility-id="tgBank.credit.applyLoanButton"
          onClick={() => setActiveSubscreen('loanApplication')}
          className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-md shadow-purple-500/20 text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/20 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">
                Apply for Personal Loan / New Card
              </span>
              <span className="text-[10px] text-purple-200">Dynamic EMI calculator • APR starting 8.5%</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Elite Credit Cards Showcase */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-1">
          Active Metal Cards
        </h4>

        <div className="space-y-3">
          {creditCards.map((card) => (
            <div
              key={card.id}
              className="bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {card.tier}
                  </span>
                  <h5 className="text-sm font-bold text-slate-100">{card.name}</h5>
                </div>
                <CreditCard className="w-6 h-6 text-slate-400" />
              </div>

              <div className="font-mono text-base font-bold tracking-widest text-slate-200 mb-4">
                {card.cardNumber}
              </div>

              <div className="flex justify-between items-end text-xs">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Cardholder</span>
                  <span className="font-semibold text-slate-300">{card.holder}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Expires</span>
                  <span className="font-semibold text-slate-300">{card.expiry}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{card.perks}</span>
                <span className="text-amber-400 font-bold">{card.metal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
