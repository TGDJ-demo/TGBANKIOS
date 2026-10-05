import React, { useState } from 'react';
import { Search, Copy, Check, Code, Shield, Layers, Terminal } from 'lucide-react';

interface AccessibilityContractItem {
  id: string;
  category: string;
  elementType: 'Button' | 'TextField' | 'StaticText' | 'Other' | 'Cell' | 'Image';
  description: string;
  xcuiSnippet: string;
  appiumSnippet: string;
}

const CONTRACT_ITEMS: AccessibilityContractItem[] = [
  // Auth
  {
    id: 'tgBank.login.screen',
    category: 'Authentication',
    elementType: 'Other',
    description: 'Main authentication screen container',
    xcuiSnippet: 'app.otherElements["tgBank.login.screen"]',
    appiumSnippet: 'driver.$("~tgBank.login.screen")',
  },
  {
    id: 'tgBank.login.usernameField',
    category: 'Authentication',
    elementType: 'TextField',
    description: 'Username / Client name input field',
    xcuiSnippet: 'app.textFields["tgBank.login.usernameField"]',
    appiumSnippet: 'driver.$("~tgBank.login.usernameField")',
  },
  {
    id: 'tgBank.login.pinField',
    category: 'Authentication',
    elementType: 'TextField',
    description: '4-digit Security PIN input field',
    xcuiSnippet: 'app.secureTextFields["tgBank.login.pinField"]',
    appiumSnippet: 'driver.$("~tgBank.login.pinField")',
  },
  {
    id: 'tgBank.login.signInButton',
    category: 'Authentication',
    elementType: 'Button',
    description: 'Primary Sign In CTA button',
    xcuiSnippet: 'app.buttons["tgBank.login.signInButton"]',
    appiumSnippet: 'driver.$("~tgBank.login.signInButton")',
  },
  {
    id: 'tgBank.login.biometricButton',
    category: 'Authentication',
    elementType: 'Button',
    description: 'Face ID / Touch ID biometric trigger',
    xcuiSnippet: 'app.buttons["tgBank.login.biometricButton"]',
    appiumSnippet: 'driver.$("~tgBank.login.biometricButton")',
  },
  {
    id: 'tgBank.login.demoCredentialsButton',
    category: 'Authentication',
    elementType: 'Button',
    description: 'Autofill Sanjay G / 1234 demo button',
    xcuiSnippet: 'app.buttons["tgBank.login.demoCredentialsButton"]',
    appiumSnippet: 'driver.$("~tgBank.login.demoCredentialsButton")',
  },

  // Home
  {
    id: 'tgBank.home.screen',
    category: 'Home Dashboard',
    elementType: 'Other',
    description: 'Dashboard container view',
    xcuiSnippet: 'app.otherElements["tgBank.home.screen"]',
    appiumSnippet: 'driver.$("~tgBank.home.screen")',
  },
  {
    id: 'tgBank.home.accountBalance',
    category: 'Home Dashboard',
    elementType: 'StaticText',
    description: 'Total account balance numeric text',
    xcuiSnippet: 'app.staticTexts["tgBank.home.accountBalance"]',
    appiumSnippet: 'driver.$("~tgBank.home.accountBalance")',
  },
  {
    id: 'tgBank.home.balanceVisibilityButton',
    category: 'Home Dashboard',
    elementType: 'Button',
    description: 'Show/hide balance toggle icon button',
    xcuiSnippet: 'app.buttons["tgBank.home.balanceVisibilityButton"]',
    appiumSnippet: 'driver.$("~tgBank.home.balanceVisibilityButton")',
  },
  {
    id: 'tgBank.home.accountNumber',
    category: 'Home Dashboard',
    elementType: 'StaticText',
    description: 'Masked checking account number',
    xcuiSnippet: 'app.staticTexts["tgBank.home.accountNumber"]',
    appiumSnippet: 'driver.$("~tgBank.home.accountNumber")',
  },
  {
    id: 'tgBank.home.sendMoneyButton',
    category: 'Home Dashboard',
    elementType: 'Button',
    description: 'Quick action: Send Money button',
    xcuiSnippet: 'app.buttons["tgBank.home.sendMoneyButton"]',
    appiumSnippet: 'driver.$("~tgBank.home.sendMoneyButton")',
  },
  {
    id: 'tgBank.home.receiveMoneyButton',
    category: 'Home Dashboard',
    elementType: 'Button',
    description: 'Quick action: Receive Money QR button',
    xcuiSnippet: 'app.buttons["tgBank.home.receiveMoneyButton"]',
    appiumSnippet: 'driver.$("~tgBank.home.receiveMoneyButton")',
  },
  {
    id: 'tgBank.home.upiPayButton',
    category: 'Home Dashboard',
    elementType: 'Button',
    description: 'Quick action: UPI Pay shortcut',
    xcuiSnippet: 'app.buttons["tgBank.home.upiPayButton"]',
    appiumSnippet: 'driver.$("~tgBank.home.upiPayButton")',
  },
  {
    id: 'tgBank.home.addMoneyButton',
    category: 'Home Dashboard',
    elementType: 'Button',
    description: 'Quick action: Add Funds button',
    xcuiSnippet: 'app.buttons["tgBank.home.addMoneyButton"]',
    appiumSnippet: 'driver.$("~tgBank.home.addMoneyButton")',
  },
  {
    id: 'tgBank.home.withdrawButton',
    category: 'Home Dashboard',
    elementType: 'Button',
    description: 'Quick action: ATM/Cash withdrawal button',
    xcuiSnippet: 'app.buttons["tgBank.home.withdrawButton"]',
    appiumSnippet: 'driver.$("~tgBank.home.withdrawButton")',
  },
  {
    id: 'tgBank.home.payBillsButton',
    category: 'Home Dashboard',
    elementType: 'Button',
    description: 'Quick action: Utility bill pay button',
    xcuiSnippet: 'app.buttons["tgBank.home.payBillsButton"]',
    appiumSnippet: 'driver.$("~tgBank.home.payBillsButton")',
  },
  {
    id: 'tgBank.home.creditButton',
    category: 'Home Dashboard',
    elementType: 'Button',
    description: 'Quick action: Credit & loan dashboard',
    xcuiSnippet: 'app.buttons["tgBank.home.creditButton"]',
    appiumSnippet: 'driver.$("~tgBank.home.creditButton")',
  },
  {
    id: 'tgBank.home.kycButton',
    category: 'Home Dashboard',
    elementType: 'Button',
    description: 'Quick action: KYC verification wizard',
    xcuiSnippet: 'app.buttons["tgBank.home.kycButton"]',
    appiumSnippet: 'driver.$("~tgBank.home.kycButton")',
  },

  // Send Money
  {
    id: 'tgBank.sendMoney.screen',
    category: 'Send Money',
    elementType: 'Other',
    description: 'Send Money multi-step view container',
    xcuiSnippet: 'app.otherElements["tgBank.sendMoney.screen"]',
    appiumSnippet: 'driver.$("~tgBank.sendMoney.screen")',
  },
  {
    id: 'tgBank.sendMoney.beneficiary.BEN001',
    category: 'Send Money',
    elementType: 'Button',
    description: 'Beneficiary Aarav Mehta (IMPS)',
    xcuiSnippet: 'app.buttons["tgBank.sendMoney.beneficiary.BEN001"]',
    appiumSnippet: 'driver.$("~tgBank.sendMoney.beneficiary.BEN001")',
  },
  {
    id: 'tgBank.sendMoney.recipientField',
    category: 'Send Money',
    elementType: 'TextField',
    description: 'Recipient legal name input',
    xcuiSnippet: 'app.textFields["tgBank.sendMoney.recipientField"]',
    appiumSnippet: 'driver.$("~tgBank.sendMoney.recipientField")',
  },
  {
    id: 'tgBank.sendMoney.accountField',
    category: 'Send Money',
    elementType: 'TextField',
    description: 'Destination account number field',
    xcuiSnippet: 'app.textFields["tgBank.sendMoney.accountField"]',
    appiumSnippet: 'driver.$("~tgBank.sendMoney.accountField")',
  },
  {
    id: 'tgBank.sendMoney.amountField',
    category: 'Send Money',
    elementType: 'TextField',
    description: 'Transfer amount input field',
    xcuiSnippet: 'app.textFields["tgBank.sendMoney.amountField"]',
    appiumSnippet: 'driver.$("~tgBank.sendMoney.amountField")',
  },
  {
    id: 'tgBank.sendMoney.quickAmount.50000',
    category: 'Send Money',
    elementType: 'Button',
    description: 'Quick amount preset $50,000',
    xcuiSnippet: 'app.buttons["tgBank.sendMoney.quickAmount.50000"]',
    appiumSnippet: 'driver.$("~tgBank.sendMoney.quickAmount.50000")',
  },
  {
    id: 'tgBank.sendMoney.continueButton',
    category: 'Send Money',
    elementType: 'Button',
    description: 'Proceed to Step 2 Review button',
    xcuiSnippet: 'app.buttons["tgBank.sendMoney.continueButton"]',
    appiumSnippet: 'driver.$("~tgBank.sendMoney.continueButton")',
  },
  {
    id: 'tgBank.sendMoney.authorizationButton',
    category: 'Send Money',
    elementType: 'Button',
    description: 'Authorize & execute transfer button',
    xcuiSnippet: 'app.buttons["tgBank.sendMoney.authorizationButton"]',
    appiumSnippet: 'driver.$("~tgBank.sendMoney.authorizationButton")',
  },
  {
    id: 'tgBank.sendMoney.successCard',
    category: 'Send Money',
    elementType: 'Other',
    description: 'Transfer completed success card',
    xcuiSnippet: 'app.otherElements["tgBank.sendMoney.successCard"]',
    appiumSnippet: 'driver.$("~tgBank.sendMoney.successCard")',
  },

  // UPI
  {
    id: 'tgBank.upi.screen',
    category: 'UPI Payments',
    elementType: 'Other',
    description: 'UPI main screen container',
    xcuiSnippet: 'app.otherElements["tgBank.upi.screen"]',
    appiumSnippet: 'driver.$("~tgBank.upi.screen")',
  },
  {
    id: 'tgBank.upi.demoMerchant1',
    category: 'UPI Payments',
    elementType: 'Button',
    description: 'TG Demo Store deterministic preset button',
    xcuiSnippet: 'app.buttons["tgBank.upi.demoMerchant1"]',
    appiumSnippet: 'driver.$("~tgBank.upi.demoMerchant1")',
  },
  {
    id: 'tgBank.upi.payButton',
    category: 'UPI Payments',
    elementType: 'Button',
    description: 'Pay via UPI Switch CTA button',
    xcuiSnippet: 'app.buttons["tgBank.upi.payButton"]',
    appiumSnippet: 'driver.$("~tgBank.upi.payButton")',
  },
  {
    id: 'tgBank.upi.successTitle',
    category: 'UPI Payments',
    elementType: 'StaticText',
    description: 'Payment Successful title text',
    xcuiSnippet: 'app.staticTexts["tgBank.upi.successTitle"]',
    appiumSnippet: 'driver.$("~tgBank.upi.successTitle")',
  },

  // Credit & Loan
  {
    id: 'tgBank.credit.scoreValue',
    category: 'Credit & Loans',
    elementType: 'StaticText',
    description: 'FICO 850 score display',
    xcuiSnippet: 'app.staticTexts["tgBank.credit.scoreValue"]',
    appiumSnippet: 'driver.$("~tgBank.credit.scoreValue")',
  },
  {
    id: 'tgBank.credit.requestIncreaseButton',
    category: 'Credit & Loans',
    elementType: 'Button',
    description: 'Request credit limit increase (+$250k)',
    xcuiSnippet: 'app.buttons["tgBank.credit.requestIncreaseButton"]',
    appiumSnippet: 'driver.$("~tgBank.credit.requestIncreaseButton")',
  },
  {
    id: 'tgBank.credit.applyLoanButton',
    category: 'Credit & Loans',
    elementType: 'Button',
    description: 'Apply for Personal Loan modal opener',
    xcuiSnippet: 'app.buttons["tgBank.credit.applyLoanButton"]',
    appiumSnippet: 'driver.$("~tgBank.credit.applyLoanButton")',
  },
  {
    id: 'tgBank.loan.calculatedEmi',
    category: 'Credit & Loans',
    elementType: 'StaticText',
    description: 'Dynamic formula-calculated monthly EMI',
    xcuiSnippet: 'app.staticTexts["tgBank.loan.calculatedEmi"]',
    appiumSnippet: 'driver.$("~tgBank.loan.calculatedEmi")',
  },
  {
    id: 'tgBank.loan.submitButton',
    category: 'Credit & Loans',
    elementType: 'Button',
    description: 'Submit loan application button',
    xcuiSnippet: 'app.buttons["tgBank.loan.submitButton"]',
    appiumSnippet: 'driver.$("~tgBank.loan.submitButton")',
  },
  {
    id: 'tgBank.loan.approvalTitle',
    category: 'Credit & Loans',
    elementType: 'StaticText',
    description: 'Application Approved validation title',
    xcuiSnippet: 'app.staticTexts["tgBank.loan.approvalTitle"]',
    appiumSnippet: 'driver.$("~tgBank.loan.approvalTitle")',
  },

  // KYC
  {
    id: 'tgBank.kyc.step1.nextButton',
    category: 'KYC Verification',
    elementType: 'Button',
    description: 'KYC Step 1 next button',
    xcuiSnippet: 'app.buttons["tgBank.kyc.step1.nextButton"]',
    appiumSnippet: 'driver.$("~tgBank.kyc.step1.nextButton")',
  },
  {
    id: 'tgBank.kyc.uploadDocumentButton',
    category: 'KYC Verification',
    elementType: 'Button',
    description: 'KYC document upload action',
    xcuiSnippet: 'app.buttons["tgBank.kyc.uploadDocumentButton"]',
    appiumSnippet: 'driver.$("~tgBank.kyc.uploadDocumentButton")',
  },
  {
    id: 'tgBank.kyc.simulateSelfieButton',
    category: 'KYC Verification',
    elementType: 'Button',
    description: 'Simulate verified selfie for automation',
    xcuiSnippet: 'app.buttons["tgBank.kyc.simulateSelfieButton"]',
    appiumSnippet: 'driver.$("~tgBank.kyc.simulateSelfieButton")',
  },
  {
    id: 'tgBank.kyc.submitButton',
    category: 'KYC Verification',
    elementType: 'Button',
    description: 'Final KYC submission button',
    xcuiSnippet: 'app.buttons["tgBank.kyc.submitButton"]',
    appiumSnippet: 'driver.$("~tgBank.kyc.submitButton")',
  },
  {
    id: 'tgBank.kyc.completedTitle',
    category: 'KYC Verification',
    elementType: 'StaticText',
    description: 'KYC Completed Successfully banner',
    xcuiSnippet: 'app.staticTexts["tgBank.kyc.completedTitle"]',
    appiumSnippet: 'driver.$("~tgBank.kyc.completedTitle")',
  },

  // Test Controls
  {
    id: 'tgBank.testControls.forceInsufficientBalance',
    category: 'Test Controls',
    elementType: 'Button',
    description: 'Toggle: Force Insufficient Balance simulation',
    xcuiSnippet: 'app.switches["tgBank.testControls.forceInsufficientBalance"]',
    appiumSnippet: 'driver.$("~tgBank.testControls.forceInsufficientBalance")',
  },
  {
    id: 'tgBank.testControls.forceTransactionFailure',
    category: 'Test Controls',
    elementType: 'Button',
    description: 'Toggle: Force Transaction Network Failure',
    xcuiSnippet: 'app.switches["tgBank.testControls.forceTransactionFailure"]',
    appiumSnippet: 'driver.$("~tgBank.testControls.forceTransactionFailure")',
  },
  {
    id: 'tgBank.testControls.resetDemoDataButton',
    category: 'Test Controls',
    elementType: 'Button',
    description: 'Reset demo state and return to login',
    xcuiSnippet: 'app.buttons["tgBank.testControls.resetDemoDataButton"]',
    appiumSnippet: 'driver.$("~tgBank.testControls.resetDemoDataButton")',
  },
];

export const AutomationInspector: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [codeFormat, setCodeFormat] = useState<'xcui' | 'appium' | 'id'>('xcui');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['ALL', 'Authentication', 'Home Dashboard', 'Send Money', 'UPI Payments', 'Credit & Loans', 'KYC Verification', 'Test Controls'];

  const filteredItems = CONTRACT_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Appium & XCUITest Contract Inspector</h3>
          </div>
          <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">
            {CONTRACT_ITEMS.length} Identifiers
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search identifier (e.g. tgBank.login...)"
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Code Format Switcher */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Copy Snippet As:</span>
          <div className="flex gap-1 bg-slate-800 p-0.5 rounded-lg text-[11px]">
            <button
              type="button"
              onClick={() => setCodeFormat('xcui')}
              className={`px-2 py-0.5 rounded transition ${
                codeFormat === 'xcui' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              XCUITest (Swift)
            </button>
            <button
              type="button"
              onClick={() => setCodeFormat('appium')}
              className={`px-2 py-0.5 rounded transition ${
                codeFormat === 'appium' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Appium / WebdriverIO
            </button>
            <button
              type="button"
              onClick={() => setCodeFormat('id')}
              className={`px-2 py-0.5 rounded transition ${
                codeFormat === 'id' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw ID
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-1 overflow-x-auto pt-2.5 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap font-medium transition ${
                selectedCategory === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Contract Identifiers List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filteredItems.map((item) => {
          const snippetToCopy =
            codeFormat === 'xcui'
              ? item.xcuiSnippet
              : codeFormat === 'appium'
              ? item.appiumSnippet
              : item.id;

          return (
            <div
              key={item.id}
              className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl hover:border-slate-600 transition space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
                      {item.elementType}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>
                  <h4 className="font-mono text-xs font-bold text-amber-300 break-all">{item.id}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{item.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(snippetToCopy, item.id)}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition shrink-0"
                  title="Copy formatted code snippet"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Code snippet display */}
              <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-400 overflow-x-auto">
                <code>{snippetToCopy}</code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
