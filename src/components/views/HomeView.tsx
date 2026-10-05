import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { t } from '../../services/localization';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Send,
  ArrowDownLeft,
  QrCode,
  PlusCircle,
  Banknote,
  FileText,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    user,
    transactions,
    balanceVisible,
    toggleBalanceVisibility,
    setActiveTab,
    setActiveSubscreen,
    setSelectedTransaction,
    language,
  } = useBank();

  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(user.rawAccountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-accessibility-id="tgBank.home.screen"
      className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      {/* Top Greeting & Status */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              data-accessibility-id="tgBank.home.welcomeText"
              className="text-xs text-slate-500 dark:text-slate-400 font-medium"
            >
              {t('welcomeBack', language)}
            </span>
            <span
              data-accessibility-id="tgBank.home.onlineStatus"
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('online', language)}
            </span>
          </div>
          <h2
            data-accessibility-id="tgBank.home.userName"
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            {user.name}
          </h2>
        </div>

        <div className="text-right">
          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {user.tier}
          </span>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            {t('checkingAccount', language)}
          </p>
        </div>
      </div>

      {/* Account Balance Card */}
      <div
        data-accessibility-id="tgBank.home.accountBalanceCard"
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
          <span>{t('totalBalance', language)}</span>
          <button
            type="button"
            data-accessibility-id="tgBank.home.balanceVisibilityButton"
            onClick={toggleBalanceVisibility}
            className="p-1 hover:text-white transition"
          >
            {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="mb-4">
          <div
            data-accessibility-id="tgBank.home.accountBalance"
            aria-label="Total available balance"
            aria-valuenow={user.balance}
            className="text-2xl sm:text-3xl font-bold tracking-tight font-sans"
          >
            {balanceVisible ? (
              `$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ) : (
              '••••••••••••'
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Account</span>
            <span
              data-accessibility-id="tgBank.home.accountNumber"
              className="font-mono font-medium text-slate-200"
            >
              {user.accountNumber}
            </span>
          </div>

          <button
            type="button"
            data-accessibility-id="tgBank.home.copyAccountNumberButton"
            onClick={handleCopyAccount}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 active:scale-95 transition rounded-lg text-xs text-slate-200 font-medium backdrop-blur-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Quick Banking Actions (8 Actions) */}
      <div>
        <h3
          data-accessibility-id="tgBank.home.quickActionsHeader"
          className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-1"
        >
          {t('quickActions', language)}
        </h3>

        <div className="grid grid-cols-4 gap-2.5">
          <QuickActionButton
            title={t('send', language)}
            icon={<Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            id="tgBank.home.sendMoneyButton"
            onClick={() => setActiveSubscreen('sendMoney')}
          />
          <QuickActionButton
            title={t('receive', language)}
            icon={<ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            id="tgBank.home.receiveMoneyButton"
            onClick={() => setActiveSubscreen('receiveMoney')}
          />
          <QuickActionButton
            title={t('upiPay', language)}
            icon={<QrCode className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            id="tgBank.home.upiPayButton"
            onClick={() => setActiveTab('payments')}
          />
          <QuickActionButton
            title={t('addMoney', language)}
            icon={<PlusCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            id="tgBank.home.addMoneyButton"
            onClick={() => setActiveSubscreen('addMoney')}
          />
          <QuickActionButton
            title={t('withdraw', language)}
            icon={<Banknote className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            id="tgBank.home.withdrawButton"
            onClick={() => setActiveSubscreen('withdraw')}
          />
          <QuickActionButton
            title={t('payBills', language)}
            icon={<FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            id="tgBank.home.payBillsButton"
            onClick={() => setActiveSubscreen('payBills')}
          />
          <QuickActionButton
            title={t('credit', language)}
            icon={<CreditCard className="w-5 h-5 text-pink-600 dark:text-pink-400" />}
            id="tgBank.home.creditButton"
            onClick={() => setActiveTab('credit')}
          />
          <QuickActionButton
            title={t('kyc', language)}
            icon={
              user.kycStatus === 'Verified' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              )
            }
            id="tgBank.home.kycButton"
            onClick={() => setActiveSubscreen('kycWizard')}
          />
        </div>
      </div>

      {/* Spending Summary Card */}
      <div
        data-accessibility-id="tgBank.home.spendingSummaryCard"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-slate-500" />
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {t('spendingSummary', language)}
            </h4>
          </div>
          <span
            data-accessibility-id="tgBank.home.spendingSummary.total"
            className="text-sm font-bold text-slate-900 dark:text-white"
          >
            $1,675.68
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <SpendingSummaryRow
            label={t('shopping', language)}
            amount="$856.99"
            pct="35%"
            color="bg-blue-500"
            id="tgBank.home.spendingSummary.shopping"
          />
          <SpendingSummaryRow
            label={t('food', language)}
            amount="$245.50"
            pct="18%"
            color="bg-amber-500"
            id="tgBank.home.spendingSummary.food"
          />
          <SpendingSummaryRow
            label={t('bills', language)}
            amount="$360.70"
            pct="22%"
            color="bg-purple-500"
            id="tgBank.home.spendingSummary.bills"
          />
          <SpendingSummaryRow
            label={t('transfers', language)}
            amount="$212.50"
            pct="15%"
            color="bg-emerald-500"
            id="tgBank.home.spendingSummary.transfers"
          />
          <SpendingSummaryRow
            label={t('entertainment', language)}
            amount="$99.99"
            pct="10%"
            color="bg-pink-500"
            id="tgBank.home.spendingSummary.entertainment"
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4
            data-accessibility-id="tgBank.home.recentTransactions"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            {t('recentTransactions', language)}
          </h4>
          <button
            type="button"
            data-accessibility-id="tgBank.home.viewAllTransactionsButton"
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('viewAll', language)}
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {transactions.slice(0, 4).map((tx) => (
            <button
              key={tx.id}
              type="button"
              data-accessibility-id={`tgBank.transactions.item.${tx.id}`}
              onClick={() => {
                setSelectedTransaction(tx);
                setActiveSubscreen('transactionDetail');
              }}
              className="w-full flex items-center justify-between py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg px-1.5 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.isCredit
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {tx.isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {tx.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{tx.recipientOrMerchant}</p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-bold ${
                    tx.isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {tx.isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{tx.timestamp.split(',')[0]}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{
  title: string;
  icon: React.ReactNode;
  id: string;
  onClick: () => void;
}> = ({ title, icon, id, onClick }) => {
  return (
    <button
      type="button"
      data-accessibility-id={id}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 transition shadow-sm active:scale-95 group"
    >
      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 group-hover:scale-105 transition mb-1">
        {icon}
      </div>
      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center line-clamp-1">
        {title}
      </span>
    </button>
  );
};

const SpendingSummaryRow: React.FC<{
  label: string;
  amount: string;
  pct: string;
  color: string;
  id: string;
}> = ({ label, amount, pct, color, id }) => {
  return (
    <div data-accessibility-id={id} className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-800 dark:text-slate-200">{amount}</span>
        <span className="text-[10px] text-slate-400 w-7 text-right">{pct}</span>
      </div>
    </div>
  );
};
