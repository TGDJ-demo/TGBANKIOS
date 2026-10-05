import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { Search, X, ArrowDownLeft, ArrowUpRight, Inbox } from 'lucide-react';
import { Transaction } from '../../types';

export const TransactionsView: React.FC = () => {
  const { transactions, setSelectedTransaction, setActiveSubscreen } = useBank();
  const [searchText, setSearchText] = useState('');
  const [filterMode, setFilterMode] = useState<string>('ALL');

  const filteredTransactions = transactions.filter((tx) => {
    // Search
    const q = searchText.toLowerCase();
    const matchesSearch =
      searchText === '' ||
      tx.title.toLowerCase().includes(q) ||
      tx.recipientOrMerchant.toLowerCase().includes(q) ||
      tx.id.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Filters
    if (filterMode === 'ALL') return true;
    if (filterMode === 'CREDITS') return tx.isCredit;
    if (filterMode === 'DEBITS') return !tx.isCredit;
    if (filterMode === 'UPI') return tx.type === 'UPI';
    if (filterMode === 'CARD') return tx.type === 'CARD';
    if (filterMode === 'ATM') return tx.type === 'ATM';
    if (filterMode === 'SALARY') return tx.type === 'SALARY';
    if (filterMode === 'IMPS') return tx.type === 'IMPS';
    if (filterMode === 'NEFT') return tx.type === 'NEFT';
    if (filterMode === 'ACH') return tx.type === 'ACH';
    if (filterMode === 'RTGS') return tx.type === 'RTGS';
    if (filterMode === 'BILL_PAY') return tx.type === 'BILL_PAY';
    if (filterMode === 'ADD_MONEY') return tx.type === 'ADD_MONEY';
    return true;
  });

  const handleSelectTx = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setActiveSubscreen('transactionDetail');
  };

  return (
    <div
      data-accessibility-id="tgBank.transactions.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden"
    >
      {/* Search Header */}
      <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            data-accessibility-id="tgBank.transactions.searchField"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search transactions, merchants, IDs"
            className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchText && (
            <button
              type="button"
              data-accessibility-id="tgBank.transactions.clearSearchButton"
              onClick={() => setSearchText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Horizontal Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          {[
            { label: 'All', key: 'ALL', id: 'tgBank.transactions.filter.all' },
            { label: 'Credits (+)', key: 'CREDITS', id: 'tgBank.transactions.filter.credits' },
            { label: 'Debits (-)', key: 'DEBITS', id: 'tgBank.transactions.filter.debits' },
            { label: 'UPI', key: 'UPI', id: 'tgBank.transactions.filter.upi' },
            { label: 'Card', key: 'CARD', id: 'tgBank.transactions.filter.card' },
            { label: 'ATM', key: 'ATM', id: 'tgBank.transactions.filter.atm' },
            { label: 'Salary', key: 'SALARY', id: 'tgBank.transactions.filter.salary' },
            { label: 'IMPS', key: 'IMPS', id: 'tgBank.transactions.filter.imps' },
            { label: 'NEFT', key: 'NEFT', id: 'tgBank.transactions.filter.neft' },
            { label: 'ACH', key: 'ACH', id: 'tgBank.transactions.filter.ach' },
            { label: 'RTGS', key: 'RTGS', id: 'tgBank.transactions.filter.rtgs' },
            { label: 'Bill Pay', key: 'BILL_PAY', id: 'tgBank.transactions.filter.billPay' },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              data-accessibility-id={f.id}
              onClick={() => setFilterMode(f.key)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition ${
                filterMode === f.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
          <span data-accessibility-id="tgBank.transactions.count">
            {filteredTransactions.length} Transactions
          </span>
          <span>Aug - Sep 2026</span>
        </div>
      </div>

      {/* List or Empty State */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTransactions.length === 0 ? (
          <div
            data-accessibility-id="tgBank.transactions.emptyState"
            className="flex flex-col items-center justify-center py-12 text-slate-400"
          >
            <Inbox className="w-10 h-10 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <button
              key={tx.id}
              type="button"
              data-accessibility-id={`tgBank.transactions.item.${tx.id}`}
              onClick={() => handleSelectTx(tx)}
              className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl hover:border-blue-400 transition text-left shadow-sm"
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
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {tx.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {tx.recipientOrMerchant} • {tx.type}
                  </p>
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
                <p className="text-[10px] text-slate-400">{tx.timestamp.split(',')[0]}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
