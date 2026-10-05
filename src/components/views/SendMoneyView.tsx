import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import { TransferRail, Beneficiary } from '../../types';
import { CheckCircle2, ChevronLeft, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { PaymentAuthModal } from './PaymentAuthModal';

export const SendMoneyView: React.FC = () => {
  const {
    beneficiaries,
    sendMoney,
    setActiveSubscreen,
    testControls,
  } = useBank();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Details, 2: Review, 3: Success
  const [recipient, setRecipient] = useState('');
  const [account, setAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [rail, setRail] = useState<TransferRail>('IMPS');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success details
  const [successTxId, setSuccessTxId] = useState('');
  const [successRef, setSuccessRef] = useState('');

  // Payment Auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setRecipient(b.name);
    setAccount(b.account);
    setIfsc(b.ifsc);
    setRail(b.rail);
  };

  const handleProceedToReview = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!recipient.trim() || !account.trim()) {
      setErrorMessage('Please provide recipient name and account number.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }

    setErrorMessage(null);
    setStep(2);
  };

  const handleExecutePayment = () => {
    if (testControls.requirePaymentAuth) {
      setShowAuthModal(true);
    } else {
      finalizeTransfer();
    }
  };

  const finalizeTransfer = () => {
    const parsedAmount = parseFloat(amount);
    const result = sendMoney(recipient, account, rail, parsedAmount, note);
    if (result.success) {
      setSuccessTxId(result.txId || 'TGX202609230008');
      setSuccessRef(result.ref || 'REF-445889');
      setStep(3);
    } else {
      setStep(1);
      setErrorMessage(result.error || 'Transfer failed.');
    }
  };

  return (
    <div
      data-accessibility-id="tgBank.sendMoney.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      {/* Header & Step Indicator */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          data-accessibility-id="tgBank.sendMoney.cancelButton"
          onClick={() => setActiveSubscreen(null)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
        >
          Cancel
        </button>
        <span className="text-sm font-bold text-slate-900 dark:text-white">Send Money</span>
        <div className="w-12"></div>
      </div>

      {/* 3-Step Indicator */}
      <div
        data-accessibility-id="tgBank.sendMoney.stepIndicator"
        className="flex items-center justify-center gap-2 py-1"
      >
        <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[11px]">1</span>
          <span>Details</span>
        </div>
        <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
        <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px]">2</span>
          <span>Review</span>
        </div>
        <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
        <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px]">3</span>
          <span>Success</span>
        </div>
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Saved Beneficiaries */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Saved Beneficiaries
            </label>
            <div
              data-accessibility-id="tgBank.sendMoney.beneficiaryList"
              className="grid grid-cols-4 gap-2"
            >
              {beneficiaries.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  data-accessibility-id={`tgBank.sendMoney.beneficiary.${b.id}`}
                  onClick={() => handleSelectBeneficiary(b)}
                  className={`p-2 rounded-xl border text-center transition ${
                    recipient === b.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 mx-auto flex items-center justify-center font-bold text-xs mb-1">
                    {b.nickname.slice(0, 2)}
                  </div>
                  <span className="block text-[11px] font-semibold truncate">{b.nickname}</span>
                  <span className="text-[9px] text-slate-400 uppercase">{b.rail}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Details Form Card */}
          <form
            onSubmit={handleProceedToReview}
            data-accessibility-id="tgBank.sendMoney.detailsCard"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Recipient Legal Name
              </label>
              <input
                type="text"
                data-accessibility-id="tgBank.sendMoney.recipientField"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Aarav Mehta"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  data-accessibility-id="tgBank.sendMoney.accountField"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="998877665544"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  IFSC / Routing Code
                </label>
                <input
                  type="text"
                  data-accessibility-id="tgBank.sendMoney.ifscField"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  placeholder="HDFC0001234"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono uppercase"
                />
              </div>
            </div>

            {/* Transfer Rail Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Transfer Rail
              </label>
              <div
                data-accessibility-id="tgBank.sendMoney.transferRailPicker"
                className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                {(['IMPS', 'NEFT', 'ACH', 'RTGS'] as TransferRail[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    data-accessibility-id={`tgBank.sendMoney.transferRail.${r.toLowerCase()}`}
                    onClick={() => setRail(r)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      rail === r
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Transfer Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                data-accessibility-id="tgBank.sendMoney.amountField"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000.00"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
              />

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-2">
                {[
                  { label: '$5k', val: '5000', id: 'tgBank.sendMoney.quickAmount.5000' },
                  { label: '$25k', val: '25000', id: 'tgBank.sendMoney.quickAmount.25000' },
                  { label: '$50k', val: '50000', id: 'tgBank.sendMoney.quickAmount.50000' },
                  { label: '$100k', val: '100000', id: 'tgBank.sendMoney.quickAmount.100000' },
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

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Note / Memo (Optional)
              </label>
              <input
                type="text"
                data-accessibility-id="tgBank.sendMoney.noteField"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Family Transfer"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Save Beneficiary Checkbox */}
            <div
              data-accessibility-id="tgBank.sendMoney.saveBeneficiary"
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="checkbox"
                id="saveBeneficiaryCheckbox"
                data-accessibility-id="tgBank.sendMoney.saveBeneficiaryCheckbox"
                checked={saveBeneficiary}
                onChange={(e) => setSaveBeneficiary(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <label htmlFor="saveBeneficiaryCheckbox" className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Save to Beneficiary Directory
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                data-accessibility-id="tgBank.sendMoney.errorMessage"
                className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              data-accessibility-id="tgBank.sendMoney.continueButton"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 transition text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div
          data-accessibility-id="tgBank.sendMoney.reviewCard"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
        >
          <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Transfer Amount</span>
            <span
              data-accessibility-id="tgBank.sendMoney.reviewAmount"
              className="text-3xl font-extrabold text-blue-600 dark:text-blue-400"
            >
              ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Recipient Name</span>
              <span
                data-accessibility-id="tgBank.sendMoney.reviewRecipient"
                className="font-bold text-slate-900 dark:text-white"
              >
                {recipient}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Account Number</span>
              <span
                data-accessibility-id="tgBank.sendMoney.reviewAccount"
                className="font-mono font-medium text-slate-900 dark:text-white"
              >
                {account}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Transfer Rail</span>
              <span
                data-accessibility-id="tgBank.sendMoney.reviewRail"
                className="font-bold text-blue-600"
              >
                {rail} (Immediate Settlement)
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Note</span>
              <span
                data-accessibility-id="tgBank.sendMoney.reviewNote"
                className="text-slate-700 dark:text-slate-300"
              >
                {note || 'Family Transfer'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              data-accessibility-id="tgBank.sendMoney.backToEditButton"
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Edit</span>
            </button>

            <button
              type="button"
              data-accessibility-id="tgBank.sendMoney.authorizationButton"
              onClick={handleExecutePayment}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authorize & Pay</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div
          data-accessibility-id="tgBank.sendMoney.successCard"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3
              data-accessibility-id="tgBank.sendMoney.successTitle"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              Transfer Successful
            </h3>
            <p
              data-accessibility-id="tgBank.sendMoney.successAmount"
              className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1"
            >
              ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Recipient</span>
              <span
                data-accessibility-id="tgBank.sendMoney.successRecipient"
                className="font-bold text-slate-800 dark:text-slate-200"
              >
                {recipient}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Reference ID</span>
              <span
                data-accessibility-id="tgBank.sendMoney.successReference"
                className="font-mono text-slate-700 dark:text-slate-300"
              >
                {successRef}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Transaction ID</span>
              <span
                data-accessibility-id="tgBank.sendMoney.successTransactionId"
                className="font-mono font-bold text-blue-600"
              >
                {successTxId}
              </span>
            </div>
          </div>

          <button
            type="button"
            data-accessibility-id="tgBank.sendMoney.successDoneButton"
            onClick={() => setActiveSubscreen(null)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition"
          >
            Done
          </button>
        </div>
      )}

      {/* Payment Authorization Modal */}
      {showAuthModal && (
        <PaymentAuthModal
          amount={parseFloat(amount || '0')}
          recipient={recipient}
          onSuccess={() => {
            setShowAuthModal(false);
            finalizeTransfer();
          }}
          onCancel={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};
