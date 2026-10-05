export type AppTab = 'home' | 'payments' | 'transactions' | 'credit' | 'profile';

export type TransferRail = 'IMPS' | 'NEFT' | 'ACH' | 'RTGS';

export type TransactionType =
  | 'ALL'
  | 'UPI'
  | 'BANK_TRANSFER'
  | 'CARD'
  | 'ATM'
  | 'SALARY'
  | 'ADD_MONEY'
  | 'BILL_PAY'
  | 'CREDIT_PAY'
  | 'IMPS'
  | 'NEFT'
  | 'ACH'
  | 'RTGS';

export interface Beneficiary {
  id: string; // e.g. BEN001
  name: string;
  nickname: string;
  account: string;
  ifsc: string;
  bank: string;
  rail: TransferRail;
  isFavorite?: boolean;
  isVerified?: boolean;
}

export interface Transaction {
  id: string; // e.g. TGX202609160001
  title: string;
  recipientOrMerchant: string;
  amount: number;
  isCredit: boolean;
  type: TransactionType;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Failed';
  category: 'Shopping' | 'Food' | 'Bills' | 'Transfers' | 'Income' | 'ATM' | 'Other';
  note: string;
  rail?: TransferRail | string;
  referenceId: string;
}

export interface EliteCreditCard {
  id: string;
  name: string;
  tier: string;
  cardNumber: string; // e.g. **** **** **** 8899
  expiry: string;
  holder: string;
  limit: number;
  available: number;
  used: number;
  perks: string;
  gradient: string;
  metal?: string;
}

export interface NotificationItem {
  id: string; // e.g. N1
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'transfer' | 'security' | 'credit' | 'kyc' | 'offer';
}

export interface UserProfile {
  name: string;
  balance: number;
  accountNumber: string;
  rawAccountNumber: string;
  accountType: string;
  currency: string;
  creditScore: number;
  creditRating: string;
  bankingScore: number;
  creditLimit: number;
  availableCredit: number;
  usedCredit: number;
  nextPayment: number;
  paymentDue: string;
  kycStatus: 'Verified' | 'Incomplete' | 'Pending';
  phone: string;
  email: string;
  address: string;
  dob: string;
  ifsc: string;
  upiId: string;
  relationshipManager: string;
  clientSince: string;
  tier: string;
}

export interface TestControlState {
  forceInsufficientBalance: boolean;
  forceTransactionFailure: boolean;
  simulateNetworkTimeout: boolean;
  simulateUnverifiedKyc: boolean;
  mockBiometricSuccess: boolean;
  requirePaymentAuth: boolean;
  forceOtpAlways: boolean;
}

export type AppThemeMode = 'system' | 'light' | 'dark';
export type ThemeMode = AppThemeMode;
export type AppLanguage = 'en' | 'es' | 'fr' | 'hi' | 'de' | 'ja';

export interface AccessibilityElementInfo {
  id: string;
  type: 'Button' | 'TextField' | 'SecureTextField' | 'Toggle' | 'Card' | 'Label' | 'NavigationItem' | 'Cell';
  label: string;
  value?: string;
  hint?: string;
}
