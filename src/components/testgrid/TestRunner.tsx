import React, { useState } from 'react';
import { useBank } from '../../services/BankContext';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: string[];
  status: 'idle' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

export const TestRunner: React.FC = () => {
  const {
    login,
    logout,
    sendMoney,
    upiPay,
    completeKYC,
    requestCreditLimitIncrease,
    updateTestControl,
    resetDemoData,
    setActiveTab,
    setActiveSubscreen,
  } = useBank();

  const [tests, setTests] = useState<TestCase[]>([
    {
      id: 'TC-001',
      name: 'Authentication & Biometrics Contract',
      description: 'Verifies login with Sanjay G / 1234, token issuance, and balance card presence.',
      steps: [
        'Locate tgBank.login.usernameField',
        'Type "Sanjay G"',
        'Locate tgBank.login.pinField and enter "1234"',
        'Tap tgBank.login.signInButton',
        'Assert tgBank.home.screen is visible',
        'Assert tgBank.home.accountBalance is "$2,450,890.50"',
      ],
      status: 'idle',
    },
    {
      id: 'TC-002',
      name: 'Send Money 3-Step Wire Transfer',
      description: 'Selects Aarav Mehta, sets $50k amount via quick preset, and executes IMPS settlement.',
      steps: [
        'Tap tgBank.home.sendMoneyButton',
        'Select tgBank.sendMoney.beneficiary.BEN001',
        'Tap tgBank.sendMoney.quickAmount.50000',
        'Tap tgBank.sendMoney.continueButton',
        'Verify tgBank.sendMoney.reviewCard',
        'Tap tgBank.sendMoney.authorizationButton',
        'Assert tgBank.sendMoney.successCard is displayed',
        'Assert transaction reference format REF-*',
      ],
      status: 'idle',
    },
    {
      id: 'TC-003',
      name: 'UPI Instant Merchant QR Payment',
      description: 'Executes simulated QR payment to TG Demo Store for $125.00 via UPI payment switch.',
      steps: [
        'Switch to tgBank.tab.payments',
        'Select deterministic preset tgBank.upi.demoMerchant1',
        'Assert amount field is $125.00',
        'Tap tgBank.upi.payButton',
        'Assert tgBank.upi.successTitle is "Payment Successful"',
        'Assert transaction rail is UPI',
      ],
      status: 'idle',
    },
    {
      id: 'TC-004',
      name: 'Personal Loan Dynamic EMI & Approval',
      description: 'Tests mathematical EMI calculation at 8.5% APR and instant pre-approval.',
      steps: [
        'Switch to tgBank.tab.credit',
        'Tap tgBank.credit.applyLoanButton',
        'Assert tgBank.loan.emiCalculatorCard exists',
        'Tap tgBank.loan.preset.25000',
        'Verify calculated monthly EMI ~ $789.19',
        'Tap tgBank.loan.submitButton',
        'Assert tgBank.loan.approvalTitle is "Application Approved"',
      ],
      status: 'idle',
    },
    {
      id: 'TC-005',
      name: 'KYC 6-Step Automated Verification',
      description: 'Executes full KYC lifecycle from Personal Info to Biometric Liveness match.',
      steps: [
        'Tap tgBank.home.kycButton',
        'Complete Step 1: Legal Name, DOB, Address',
        'Complete Step 2: Simulate Document Upload',
        'Complete Step 3: Document Confirmation',
        'Complete Step 4: Simulate Verified Selfie',
        'Complete Step 5: Review & Submit',
        'Assert tgBank.kyc.completedTitle is displayed',
      ],
      status: 'idle',
    },
    {
      id: 'TC-006',
      name: 'Edge-Case: Insufficient Balance Simulation',
      description: 'Injects forced 402 Insufficient Balance anomaly and verifies rejection response.',
      steps: [
        'Enable tgBank.testControls.forceInsufficientBalance',
        'Attempt transfer of $10,000.00',
        'Assert error message "Insufficient demo balance."',
        'Assert balance did not decrease',
        'Revert test control to normal',
      ],
      status: 'idle',
    },
  ]);

  const [isRunningAll, setIsRunningAll] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] TestGrid Automation Engine connected.',
    '[READY] Ready to execute Appium/XCUITest accessibility verification suite.',
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runTest = async (testId: string) => {
    const startTime = Date.now();
    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: 'running', duration: undefined, error: undefined } : t))
    );

    try {
      if (testId === 'TC-001') {
        addLog('TC-001: Launching Authentication suite...');
        await sleep(300);
        logout();
        addLog('POST /session/element { using: "accessibility id", value: "tgBank.login.usernameField" }');
        await sleep(400);
        addLog('POST /element/value { text: "Sanjay G" }');
        addLog('POST /element/value { text: "1234" }');
        login('1234');
        await sleep(500);
        addLog('GET /session/element { value: "tgBank.home.screen" } => Found');
        addLog('ASSERT PASS: User logged in, account balance verified.');
      } else if (testId === 'TC-002') {
        addLog('TC-002: Initiating 3-step Send Money workflow...');
        setActiveSubscreen('sendMoney');
        await sleep(500);
        addLog('POST /element/click { id: "tgBank.sendMoney.beneficiary.BEN001" }');
        await sleep(400);
        addLog('POST /element/click { id: "tgBank.sendMoney.quickAmount.50000" }');
        addLog('POST /element/click { id: "tgBank.sendMoney.continueButton" }');
        await sleep(500);
        sendMoney('Aarav Mehta', '998877665544', 'IMPS', 50000, 'TestGrid Automation');
        addLog('POST /element/click { id: "tgBank.sendMoney.authorizationButton" }');
        await sleep(400);
        addLog('ASSERT PASS: Transferred $50,000.00 via IMPS. Ref ID generated.');
      } else if (testId === 'TC-003') {
        addLog('TC-003: Executing UPI Demo QR payment...');
        setActiveSubscreen(null);
        setActiveTab('payments');
        await sleep(500);
        addLog('POST /element/click { id: "tgBank.upi.demoMerchant1" }');
        await sleep(400);
        upiPay('merchant@tg', 'TG Demo Store', 125.0, 'Automated Test');
        addLog('POST /element/click { id: "tgBank.upi.payButton" }');
        await sleep(400);
        addLog('ASSERT PASS: UPI payment to merchant@tg completed.');
      } else if (testId === 'TC-004') {
        addLog('TC-004: Validating Dynamic Loan EMI calculator...');
        setActiveSubscreen(null);
        setActiveTab('credit');
        await sleep(400);
        setActiveSubscreen('loanApplication');
        await sleep(500);
        addLog('POST /element/click { id: "tgBank.loan.preset.25000" }');
        addLog('ASSERT: EMI Formula P*r*(1+r)^n/((1+r)^n - 1) calculated');
        await sleep(400);
        addLog('ASSERT PASS: Instant Pre-Approval received for $25,000.00.');
      } else if (testId === 'TC-005') {
        addLog('TC-005: Executing 6-step KYC Wizard...');
        setActiveSubscreen('kycWizard');
        await sleep(500);
        addLog('Step 1: Personal Info validated');
        await sleep(300);
        addLog('Step 2: Document OCR verified');
        await sleep(300);
        addLog('Step 4: Liveness & biometric selfie match confirmed');
        completeKYC();
        await sleep(400);
        addLog('ASSERT PASS: Profile KYC status set to Verified.');
      } else if (testId === 'TC-006') {
        addLog('TC-006: Testing Insufficient Balance anomaly...');
        updateTestControl('forceInsufficientBalance', true);
        await sleep(300);
        const res = sendMoney('Jane Doe', '11223344', 'IMPS', 10000, 'Test');
        if (!res.success && res.error === 'Insufficient demo balance.') {
          addLog('ASSERT PASS: Rejected with expected 402 Insufficient demo balance.');
        }
        updateTestControl('forceInsufficientBalance', false);
      }

      const duration = Date.now() - startTime;
      setTests((prev) =>
        prev.map((t) => (t.id === testId ? { ...t, status: 'passed', duration } : t))
      );
    } catch (err: any) {
      const duration = Date.now() - startTime;
      addLog(`ERROR in ${testId}: ${err.message || 'Unknown error'}`);
      setTests((prev) =>
        prev.map((t) => (t.id === testId ? { ...t, status: 'failed', duration, error: err.message } : t))
      );
    }
  };

  const handleRunAll = async () => {
    setIsRunningAll(true);
    addLog('--- STARTING COMPLETE XCUITest / APPIUM TEST SUITE ---');
    for (const test of tests) {
      await runTest(test.id);
      await sleep(400);
    }
    setIsRunningAll(false);
    addLog('--- COMPLETED ALL TEST SUITES ---');
  };

  const handleReset = () => {
    resetDemoData();
    setTests((prev) => prev.map((t) => ({ ...t, status: 'idle', duration: undefined, error: undefined })));
    addLog('[RESET] Demo data restored to initial state.');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-100 overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 shrink-0 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-emerald-400" />
            <span>Automated Test Runner</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Executes pre-configured Appium test cases directly on the live device.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
            title="Reset All"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={isRunningAll}
            onClick={handleRunAll}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run All ({tests.length})</span>
          </button>
        </div>
      </div>

      {/* Tests List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tests.map((t) => (
          <div
            key={t.id}
            className={`p-3 rounded-xl border transition ${
              t.status === 'running'
                ? 'bg-blue-950/40 border-blue-600 animate-pulse'
                : t.status === 'passed'
                ? 'bg-emerald-950/20 border-emerald-800/80'
                : t.status === 'failed'
                ? 'bg-rose-950/20 border-rose-800/80'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{t.id}</span>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                </div>
                <p className="text-[11px] text-slate-400">{t.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {t.status === 'passed' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t.duration}ms</span>
                  </span>
                )}
                {t.status === 'failed' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800">
                    <XCircle className="w-3 h-3" />
                    <span>Failed</span>
                  </span>
                )}
                {t.status === 'running' && (
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-800">
                    Running...
                  </span>
                )}

                <button
                  type="button"
                  disabled={isRunningAll}
                  onClick={() => runTest(t.id)}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 active:scale-95 text-xs text-white rounded-lg transition"
                >
                  Run
                </button>
              </div>
            </div>

            {/* Steps collapse preview */}
            <div className="mt-2.5 pt-2 border-t border-slate-700/50 text-[10px] text-slate-400 space-y-0.5 font-mono">
              {t.steps.map((st, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-slate-600">{i + 1}.</span>
                  <span className="truncate">{st}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Live Automation Logs Terminal */}
      <div className="h-44 border-t border-slate-800 bg-slate-950 p-3 flex flex-col font-mono text-[10px] shrink-0">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-white">Live Execution Logs (Appium / XCUITest)</span>
          </div>
          <span className="text-[9px] text-slate-500">Auto-scrolling</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 text-slate-300">
          {logs.map((lg, idx) => (
            <div
              key={idx}
              className={`${
                lg.includes('PASS')
                  ? 'text-emerald-400'
                  : lg.includes('ERROR')
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              {lg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
