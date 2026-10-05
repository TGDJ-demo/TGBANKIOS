import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { CheckCircle2, ChevronLeft, Calculator, Sparkles } from 'lucide-react';

export const LoanApplicationModal: React.FC = () => {
  const { setActiveSubscreen } = useBank();

  const [requestedAmount, setRequestedAmount] = useState<number>(25000);
  const [employmentType, setEmploymentType] = useState('Full-Time Salaried');
  const [monthlyIncome, setMonthlyIncome] = useState('12500');
  const [loanPurpose, setLoanPurpose] = useState('Home Improvement');
  const [durationMonths, setDurationMonths] = useState<number>(36);
  const [apr, setApr] = useState<number>(8.5);

  const [isApproved, setIsApproved] = useState(false);
  const [approvalId, setApprovalId] = useState('');

  // Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEMI = (principal: number, annualRate: number, months: number) => {
    if (principal <= 0 || months <= 0) return 0;
    const r = annualRate / 12 / 100;
    const factor = Math.pow(1 + r, months);
    return (principal * r * factor) / (factor - 1);
  };

  const emi = calculateEMI(requestedAmount, apr, durationMonths);
  const totalRepayment = emi * durationMonths;
  const totalInterest = Math.max(0, totalRepayment - requestedAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApprovalId(`LN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsApproved(true);
  };

  return (
    <div
      data-accessibility-id="tgBank.loan.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubscreen(null)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-sm font-bold text-slate-900 dark:text-white">Loan Application</span>
        <div className="w-12"></div>
      </div>

      {isApproved ? (
        <div
          data-accessibility-id="tgBank.loan.approvalCard"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3
              data-accessibility-id="tgBank.loan.approvalTitle"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              Application Approved
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your instant personal loan has been pre-approved based on your 850 FICO score.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Approval ID</span>
              <span
                data-accessibility-id="tgBank.loan.approvalId"
                className="font-mono font-bold text-blue-600"
              >
                {approvalId}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Approved Amount</span>
              <span
                data-accessibility-id="tgBank.loan.approvalAmount"
                className="font-bold text-slate-900 dark:text-white"
              >
                ${requestedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Fixed APR</span>
              <span
                data-accessibility-id="tgBank.loan.approvalApr"
                className="font-bold text-emerald-600"
              >
                {apr.toFixed(1)}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Tenure</span>
              <span
                data-accessibility-id="tgBank.loan.approvalTenure"
                className="font-semibold text-slate-800 dark:text-slate-200"
              >
                {durationMonths} Months
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Monthly EMI</span>
              <span
                data-accessibility-id="tgBank.loan.approvalEmi"
                className="font-bold text-purple-600"
              >
                ${emi.toFixed(2)}/mo
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Total Repayment</span>
              <span
                data-accessibility-id="tgBank.loan.approvalTotalRepayment"
                className="font-bold text-slate-900 dark:text-white"
              >
                ${totalRepayment.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            data-accessibility-id="tgBank.loan.doneButton"
            onClick={() => setActiveSubscreen(null)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Dynamic EMI Calculator Card */}
          <div
            data-accessibility-id="tgBank.loan.emiCalculatorCard"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span>Dynamic EMI Calculator</span>
              </div>
              <span
                data-accessibility-id="tgBank.loan.aprBadge"
                className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800"
              >
                {apr.toFixed(1)}% APR
              </span>
            </div>

            {/* Calculated EMI Display */}
            <div className="text-center py-2 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/40 dark:via-slate-900 dark:to-blue-950/40 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Estimated Monthly EMI
              </span>
              <span
                data-accessibility-id="tgBank.loan.calculatedEmi"
                className="text-3xl font-extrabold text-purple-600 dark:text-purple-400"
              >
                ${emi.toFixed(2)}
              </span>
            </div>

            {/* Principal & Interest Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Principal</span>
                <span
                  data-accessibility-id="tgBank.loan.principalSummary"
                  className="font-bold text-slate-800 dark:text-slate-200"
                >
                  ${requestedAmount.toLocaleString()}
                </span>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Interest</span>
                <span
                  data-accessibility-id="tgBank.loan.totalInterest"
                  className="font-bold text-amber-600"
                >
                  ${totalInterest.toFixed(2)}
                </span>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Total</span>
                <span
                  data-accessibility-id="tgBank.loan.totalRepayment"
                  className="font-bold text-purple-600"
                >
                  ${totalRepayment.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
                Preset Principal Amounts
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '$5k', val: 5000, id: 'tgBank.loan.preset.5000' },
                  { label: '$15k', val: 15000, id: 'tgBank.loan.preset.15000' },
                  { label: '$25k', val: 25000, id: 'tgBank.loan.preset.25000' },
                  { label: '$50k', val: 50000, id: 'tgBank.loan.preset.50000' },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    data-accessibility-id={p.id}
                    onClick={() => setRequestedAmount(p.val)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition ${
                      requestedAmount === p.val
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* APR Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400">Annual Percentage Rate (APR)</span>
                <span
                  data-accessibility-id="tgBank.loan.currentApr"
                  className="font-bold text-purple-600"
                >
                  {apr.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="5.0"
                max="18.0"
                step="0.1"
                data-accessibility-id="tgBank.loan.aprSlider"
                value={apr}
                onChange={(e) => setApr(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Application Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Requested Amount (USD)
              </label>
              <input
                type="number"
                data-accessibility-id="tgBank.loan.requestedAmountField"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Employment
                </label>
                <input
                  type="text"
                  data-accessibility-id="tgBank.loan.employmentField"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  placeholder="Full-Time Salaried"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Monthly Income ($)
                </label>
                <input
                  type="text"
                  data-accessibility-id="tgBank.loan.monthlyIncomeField"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="12500"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Purpose
                </label>
                <input
                  type="text"
                  data-accessibility-id="tgBank.loan.purposeField"
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  placeholder="Home Improvement"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  data-accessibility-id="tgBank.loan.durationField"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(parseInt(e.target.value) || 12)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              data-accessibility-id="tgBank.loan.submitButton"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Instant Loan Application</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
