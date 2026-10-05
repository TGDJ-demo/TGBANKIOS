import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Beneficiary,
  Transaction,
  EliteCreditCard,
  NotificationItem,
  TestControlState,
  AppThemeMode,
  AppLanguage,
  AppTab,
  AccessibilityElementInfo,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_BENEFICIARIES,
  INITIAL_TRANSACTIONS,
  INITIAL_CREDIT_CARDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TEST_CONTROLS,
  generateNextTransactionId,
} from './bankStore';

export type SubScreen =
  | null
  | 'sendMoney'
  | 'receiveMoney'
  | 'addMoney'
  | 'withdraw'
  | 'payBills'
  | 'applyLoan'
  | 'loanApplication'
  | 'kycWizard'
  | 'notifications'
  | 'testControls'
  | 'transactionDetail'
  | 'qrScanner';

interface BankContextType {
  user: UserProfile;
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  creditCards: EliteCreditCard[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  testControls: TestControlState;
  theme: AppThemeMode;
  language: AppLanguage;
  isAuthenticated: boolean;
  activeTab: AppTab;
  activeSubscreen: SubScreen;
  selectedTransaction: Transaction | null;
  balanceVisible: boolean;
  inspectorMode: boolean;
  registeredElements: Map<string, AccessibilityElementInfo>;

  // Actions
  login: (pin: string) => boolean;
  logout: () => void;
  setTheme: (theme: AppThemeMode) => void;
  setLanguage: (lang: AppLanguage) => void;
  setActiveTab: (tab: AppTab) => void;
  setActiveSubscreen: (sub: SubScreen) => void;
  setSelectedTransaction: (tx: Transaction | null) => void;
  toggleBalanceVisibility: () => void;
  setTestControls: React.Dispatch<React.SetStateAction<TestControlState>>;
  updateTestControl: (key: keyof TestControlState, value: boolean) => void;
  setInspectorMode: (enabled: boolean) => void;

  // Banking Operations
  sendMoney: (
    recipient: string,
    account: string,
    rail: string,
    amount: number,
    note: string
  ) => { success: boolean; error?: string; txId?: string; ref?: string };
  upiPay: (
    vpa: string,
    merchantName: string,
    amount: number,
    note: string
  ) => { success: boolean; error?: string; txId?: string };
  addMoney: (amount: number, method: string) => { success: boolean; error?: string; txId?: string };
  withdrawMoney: (amount: number, method: string) => { success: boolean; error?: string; txId?: string };
  payBills: (accountNo: string, amount: number, biller: string) => { success: boolean; error?: string; txId?: string };
  payBill: (biller: string, accountNo: string, amount: number) => { success: boolean; error?: string; txId?: string };
  requestCreditIncrease: () => { success: boolean; message: string };
  requestCreditLimitIncrease: () => { success: boolean; message: string };
  payCreditBill: () => { success: boolean; error?: string; txId?: string };
  completeKyc: () => void;
  completeKYC: () => void;

  // Notifications
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  clearAllNotifications: () => void;

  // Test Control Actions
  resetDemoData: () => void;
  resetKyc: () => void;
  resetKYC: () => void;
  resetCredit: () => void;
  seedDatabase: () => void;

  // Accessibility Registry
  registerElement: (element: AccessibilityElementInfo) => void;
  unregisterElement: (id: string) => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [creditCards, setCreditCards] = useState<EliteCreditCard[]>(INITIAL_CREDIT_CARDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [testControls, setTestControls] = useState<TestControlState>(INITIAL_TEST_CONTROLS);
  const [theme, setTheme] = useState<AppThemeMode>('system');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [activeSubscreen, setActiveSubscreen] = useState<SubScreen>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true);
  const [inspectorMode, setInspectorMode] = useState<boolean>(false);
  const [registeredElements] = useState<Map<string, AccessibilityElementInfo>>(new Map());

  // Listen to simulateUnverifiedKyc changes
  useEffect(() => {
    if (testControls.simulateUnverifiedKyc) {
      setUser((prev) => ({ ...prev, kycStatus: 'Incomplete' }));
    }
  }, [testControls.simulateUnverifiedKyc]);

  const registerElement = (element: AccessibilityElementInfo) => {
    registeredElements.set(element.id, element);
  };

  const unregisterElement = (id: string) => {
    registeredElements.delete(id);
  };

  const login = (pin: string): boolean => {
    if (pin === '1234') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveSubscreen(null);
    setActiveTab('home');
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible((prev) => !prev);
  };

  const sendMoney = (
    recipient: string,
    account: string,
    rail: string,
    amount: number,
    note: string
  ) => {
    if (testControls.simulateNetworkTimeout) {
      return { success: false, error: 'Simulated network timeout. Please check your connection.' };
    }
    if (testControls.forceInsufficientBalance || user.balance < amount) {
      return { success: false, error: 'Insufficient demo balance.' };
    }
    if (testControls.forceTransactionFailure) {
      return { success: false, error: 'Transaction failed: Simulated bank network rejection.' };
    }

    const txId = generateNextTransactionId();
    const ref = `REF-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date();
    const timestampStr = `${now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setUser((prev) => ({
      ...prev,
      balance: prev.balance - amount,
    }));

    const newTx: Transaction = {
      id: txId,
      title: `${rail} Transfer`,
      recipientOrMerchant: recipient,
      amount,
      isCredit: false,
      type: rail as any,
      timestamp: timestampStr,
      status: 'Completed',
      category: 'Transfers',
      note: note || `Transfer to ${account}`,
      rail,
      referenceId: ref,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotification: NotificationItem = {
      id: `N${Date.now().toString().slice(-4)}`,
      title: 'Transfer Successful',
      message: `${rail} of $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${recipient} completed.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'transfer',
    };
    setNotifications((prev) => [newNotification, ...prev]);

    return { success: true, txId, ref };
  };

  const upiPay = (vpa: string, merchantName: string, amount: number, note: string) => {
    if (testControls.simulateNetworkTimeout) {
      return { success: false, error: 'Simulated network timeout. Please check your connection.' };
    }
    if (testControls.forceInsufficientBalance || user.balance < amount) {
      return { success: false, error: 'Insufficient demo balance.' };
    }
    if (testControls.forceTransactionFailure) {
      return { success: false, error: 'UPI payment rejected by simulated payment switch.' };
    }

    const txId = generateNextTransactionId();
    const now = new Date();
    const timestampStr = `${now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setUser((prev) => ({
      ...prev,
      balance: prev.balance - amount,
    }));

    const newTx: Transaction = {
      id: txId,
      title: 'UPI Payment',
      recipientOrMerchant: merchantName || vpa,
      amount,
      isCredit: false,
      type: 'UPI',
      timestamp: timestampStr,
      status: 'Completed',
      category: 'Shopping',
      note: note || `UPI to ${vpa}`,
      rail: 'UPI',
      referenceId: `UPI-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotification: NotificationItem = {
      id: `N${Date.now().toString().slice(-4)}`,
      title: 'UPI Payment Successful',
      message: `Paid $${amount.toFixed(2)} to ${merchantName || vpa}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'transfer',
    };
    setNotifications((prev) => [newNotification, ...prev]);

    return { success: true, txId };
  };

  const addMoney = (amount: number, method: string) => {
    if (testControls.simulateNetworkTimeout) {
      return { success: false, error: 'Simulated network timeout. Please check your connection.' };
    }
    if (testControls.forceTransactionFailure) {
      return { success: false, error: 'Transaction failed: Simulated bank network rejection.' };
    }

    const txId = generateNextTransactionId();
    const now = new Date();
    const timestampStr = `${now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setUser((prev) => ({
      ...prev,
      balance: prev.balance + amount,
    }));

    const newTx: Transaction = {
      id: txId,
      title: 'Deposit / Added Funds',
      recipientOrMerchant: `Deposit via ${method}`,
      amount,
      isCredit: true,
      type: 'ADD_MONEY',
      timestamp: timestampStr,
      status: 'Completed',
      category: 'Income',
      note: `Added funds via ${method}`,
      referenceId: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return { success: true, txId };
  };

  const withdrawMoney = (amount: number, method: string) => {
    if (testControls.simulateNetworkTimeout) {
      return { success: false, error: 'Simulated network timeout. Please check your connection.' };
    }
    if (testControls.forceInsufficientBalance || user.balance < amount) {
      return { success: false, error: 'Insufficient demo balance.' };
    }
    if (testControls.forceTransactionFailure) {
      return { success: false, error: 'Transaction failed: Simulated bank network rejection.' };
    }

    const txId = generateNextTransactionId();
    const now = new Date();
    const timestampStr = `${now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setUser((prev) => ({
      ...prev,
      balance: prev.balance - amount,
    }));

    const newTx: Transaction = {
      id: txId,
      title: 'Withdrawal',
      recipientOrMerchant: `${method} Withdrawal`,
      amount,
      isCredit: false,
      type: 'ATM',
      timestamp: timestampStr,
      status: 'Completed',
      category: 'ATM',
      note: `Cash withdrawal at ${method}`,
      referenceId: `WTH-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return { success: true, txId };
  };

  const payBills = (accountNo: string, amount: number, biller: string) => {
    if (testControls.simulateNetworkTimeout) {
      return { success: false, error: 'Simulated network timeout. Please check your connection.' };
    }
    if (testControls.forceInsufficientBalance || user.balance < amount) {
      return { success: false, error: 'Insufficient demo balance.' };
    }
    if (testControls.forceTransactionFailure) {
      return { success: false, error: 'Transaction failed: Simulated bank network rejection.' };
    }

    const txId = generateNextTransactionId();
    const now = new Date();
    const timestampStr = `${now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setUser((prev) => ({
      ...prev,
      balance: prev.balance - amount,
    }));

    const newTx: Transaction = {
      id: txId,
      title: 'Bill Payment',
      recipientOrMerchant: biller,
      amount,
      isCredit: false,
      type: 'BILL_PAY',
      timestamp: timestampStr,
      status: 'Completed',
      category: 'Bills',
      note: `Payment for account ${accountNo}`,
      referenceId: `BIL-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return { success: true, txId };
  };

  const requestCreditIncrease = () => {
    // Increase limit by $250,000. Credit score up by 2 points (capped at 850). Banking score by 1 point (capped at 999).
    setUser((prev) => {
      const newLimit = prev.creditLimit + 250000;
      const newAvailable = prev.availableCredit + 250000;
      const newScore = Math.min(850, prev.creditScore + 2);
      const newBankScore = Math.min(999, prev.bankingScore + 1);

      return {
        ...prev,
        creditLimit: newLimit,
        availableCredit: newAvailable,
        creditScore: newScore,
        bankingScore: newBankScore,
      };
    });

    return {
      success: true,
      message: 'Simulated credit limit increased by $250,000.00! New Limit: $5,250,000.00',
    };
  };

  const payCreditBill = () => {
    const payment = user.nextPayment;
    if (payment <= 0) {
      return { success: false, error: 'No outstanding bill payment due.' };
    }
    if (testControls.simulateNetworkTimeout) {
      return { success: false, error: 'Simulated network timeout. Please check your connection.' };
    }
    if (testControls.forceInsufficientBalance || user.balance < payment) {
      return { success: false, error: 'Insufficient demo balance.' };
    }
    if (testControls.forceTransactionFailure) {
      return { success: false, error: 'Transaction failed: Simulated bank network rejection.' };
    }

    const txId = generateNextTransactionId();
    const now = new Date();
    const timestampStr = `${now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setUser((prev) => ({
      ...prev,
      balance: prev.balance - payment,
      usedCredit: Math.max(0, prev.usedCredit - payment),
      availableCredit: prev.availableCredit + payment,
      nextPayment: 0,
    }));

    const newTx: Transaction = {
      id: txId,
      title: 'Credit Card Bill Payment',
      recipientOrMerchant: 'TG Bank Card Services',
      amount: payment,
      isCredit: false,
      type: 'CREDIT_PAY',
      timestamp: timestampStr,
      status: 'Completed',
      category: 'Bills',
      note: 'Payment for statement cycle',
      referenceId: `CC-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return { success: true, txId };
  };

  const completeKyc = () => {
    setUser((prev) => ({
      ...prev,
      kycStatus: 'Verified',
    }));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Section 50: Reset Demo Data
  // "Reset Demo Data" must restore the deterministic initial state.
  // It must: restore balance, restore transactions, restore beneficiaries, restore cards,
  // reset KYC, reset credit utilization, reset payment state, reset test controls, reset notifications,
  // return the user to login.
  // Initial reset state should be:
  // Balance: 24588338510.70, KYC: Incomplete, Used credit: 0, Available credit: 5000000, Next payment: 0
  const resetDemoData = () => {
    setUser({
      ...INITIAL_USER,
      balance: 24588338510.7,
      kycStatus: 'Incomplete',
      usedCredit: 0,
      availableCredit: 5000000.0,
      nextPayment: 0,
    });
    setTransactions(INITIAL_TRANSACTIONS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setCreditCards(INITIAL_CREDIT_CARDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTestControls(INITIAL_TEST_CONTROLS);
    setSelectedTransaction(null);
    setActiveSubscreen(null);
    setActiveTab('home');
    setIsAuthenticated(false); // Returns user to login screen!
  };

  const resetKyc = () => {
    setUser((prev) => ({ ...prev, kycStatus: 'Incomplete' }));
  };

  const resetCredit = () => {
    setUser((prev) => ({
      ...prev,
      usedCredit: 0,
      availableCredit: 5000000.0,
      nextPayment: 0,
      creditLimit: 5000000.0,
    }));
  };

  const seedDatabase = () => {
    setUser(INITIAL_USER);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const updateTestControl = (key: keyof TestControlState, value: boolean) => {
    setTestControls((prev) => ({ ...prev, [key]: value }));
  };

  const payBill = (biller: string, accountNo: string, amount: number) => {
    return payBills(accountNo, amount, biller);
  };

  const requestCreditLimitIncrease = requestCreditIncrease;
  const completeKYC = completeKyc;
  const clearAllNotifications = clearNotifications;
  const resetKYC = resetKyc;
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <BankContext.Provider
      value={{
        user,
        transactions,
        beneficiaries,
        creditCards,
        notifications,
        unreadNotificationCount,
        testControls,
        theme,
        language,
        isAuthenticated,
        activeTab,
        activeSubscreen,
        selectedTransaction,
        balanceVisible,
        inspectorMode,
        registeredElements,
        login,
        logout,
        setTheme,
        setLanguage,
        setActiveTab,
        setActiveSubscreen,
        setSelectedTransaction,
        toggleBalanceVisibility,
        setTestControls,
        updateTestControl,
        setInspectorMode,
        sendMoney,
        upiPay,
        addMoney,
        withdrawMoney,
        payBills,
        payBill,
        requestCreditIncrease,
        requestCreditLimitIncrease,
        payCreditBill,
        completeKyc,
        completeKYC,
        markAllNotificationsRead,
        clearNotifications,
        clearAllNotifications,
        resetDemoData,
        resetKyc,
        resetKYC,
        resetCredit,
        seedDatabase,
        registerElement,
        unregisterElement,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
