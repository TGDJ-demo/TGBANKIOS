import React, { useState, useEffect } from 'react';
import { useBank } from '../../services/BankContext';
import {
  Wifi,
  Battery,
  ChevronLeft,
  Bell,
  Sliders,
  Home,
  QrCode,
  Clock,
  CreditCard,
  User,
} from 'lucide-react';
import { LoginView } from '../views/LoginView';
import { HomeView } from '../views/HomeView';
import { SendMoneyView } from '../views/SendMoneyView';
import { UPIPayView } from '../views/UPIPayView';
import { AddMoneyView } from '../views/AddMoneyView';
import { WithdrawView } from '../views/WithdrawView';
import { ReceiveMoneyView } from '../views/ReceiveMoneyView';
import { PayBillsView } from '../views/PayBillsView';
import { TransactionsView } from '../views/TransactionsView';
import { TransactionDetailModal } from '../views/TransactionDetailModal';
import { CreditView } from '../views/CreditView';
import { LoanApplicationModal } from '../views/LoanApplicationModal';
import { KYCWizardModal } from '../views/KYCWizardModal';
import { NotificationsModal } from '../views/NotificationsModal';
import { ProfileView } from '../views/ProfileView';
import { TestControlsModal } from '../views/TestControlsModal';

export const IOSDeviceFrame: React.FC = () => {
  const {
    isAuthenticated,
    activeTab,
    setActiveTab,
    activeSubscreen,
    setActiveSubscreen,
    unreadNotificationCount,
    theme,
  } = useBank();

  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const getScreenTitle = () => {
    if (activeSubscreen === 'sendMoney') return 'Send Money';
    if (activeSubscreen === 'addMoney') return 'Add Money';
    if (activeSubscreen === 'withdraw') return 'Withdraw';
    if (activeSubscreen === 'receiveMoney') return 'Receive Money';
    if (activeSubscreen === 'payBills') return 'Pay Utility Bills';
    if (activeSubscreen === 'transactionDetail') return 'Details';
    if (activeSubscreen === 'loanApplication') return 'Loan Application';
    if (activeSubscreen === 'kycWizard') return 'KYC Verification';
    if (activeSubscreen === 'notifications') return 'Notifications';
    if (activeSubscreen === 'testControls') return 'Test Controls';

    switch (activeTab) {
      case 'home': return 'TG Bank';
      case 'payments': return 'UPI Payments';
      case 'transactions': return 'History';
      case 'credit': return 'Credit & Cards';
      case 'profile': return 'My Profile';
      default: return 'TG Bank';
    }
  };

  const renderActiveScreen = () => {
    if (!isAuthenticated) {
      return <LoginView />;
    }

    if (activeSubscreen === 'sendMoney') return <SendMoneyView />;
    if (activeSubscreen === 'addMoney') return <AddMoneyView />;
    if (activeSubscreen === 'withdraw') return <WithdrawView />;
    if (activeSubscreen === 'receiveMoney') return <ReceiveMoneyView />;
    if (activeSubscreen === 'payBills') return <PayBillsView />;
    if (activeSubscreen === 'transactionDetail') return <TransactionDetailModal />;
    if (activeSubscreen === 'loanApplication') return <LoanApplicationModal />;
    if (activeSubscreen === 'kycWizard') return <KYCWizardModal />;
    if (activeSubscreen === 'notifications') return <NotificationsModal />;
    if (activeSubscreen === 'testControls') return <TestControlsModal />;

    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'payments': return <UPIPayView />;
      case 'transactions': return <TransactionsView />;
      case 'credit': return <CreditView />;
      case 'profile': return <ProfileView />;
      default: return <HomeView />;
    }
  };

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`relative flex items-center justify-center p-2 sm:p-6 ${isDarkMode ? 'dark' : ''}`}>
      {/* Device Outer Chassis */}
      <div className="relative w-full max-w-[390px] h-[812px] bg-slate-900 dark:bg-black rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_12px_#1e293b,0_0_0_14px_#334155] border-4 border-slate-700/60 select-none flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Top Speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-blue-900/60"></div>
        </div>

        {/* Screen Bezel & Container */}
        <div className="relative flex-1 bg-white dark:bg-slate-950 rounded-[42px] overflow-hidden flex flex-col text-slate-900 dark:text-slate-100">
          
          {/* iOS Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-xs font-semibold shrink-0 z-30 select-none">
            <span className="w-12 text-left tracking-tight">{currentTime}</span>
            <div className="w-24"></div>
            <div className="w-16 flex items-center justify-end gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="text-[10px] tracking-tighter font-mono font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Navigation Bar (When authenticated) */}
          {isAuthenticated && (
            <div className="h-11 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0 z-20">
              <div className="w-10 flex items-center">
                {activeSubscreen && (
                  <button
                    type="button"
                    data-accessibility-id="tgBank.navigation.backButton"
                    onClick={() => setActiveSubscreen(null)}
                    className="p-1 -ml-1 text-blue-600 dark:text-blue-400 hover:opacity-80 transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
              </div>

              <span
                data-accessibility-id="tgBank.navigation.title"
                className="text-xs font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-[170px]"
              >
                {getScreenTitle()}
              </span>

              <div className="flex items-center gap-1">
                {/* Notification Bell */}
                <button
                  type="button"
                  data-accessibility-id="tgBank.navigation.notificationsButton"
                  onClick={() => setActiveSubscreen('notifications')}
                  className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationCount > 0 && (
                    <span
                      data-accessibility-id="tgBank.navigation.notificationBadge"
                      className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                    />
                  )}
                </button>

                {/* Test Controls Shortcut */}
                <button
                  type="button"
                  data-accessibility-id="tgBank.navigation.testControlsButton"
                  onClick={() => setActiveSubscreen('testControls')}
                  className="p-1.5 text-purple-600 dark:text-purple-400 hover:opacity-80 transition"
                  title="Test Controls"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* View Container */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {renderActiveScreen()}
          </div>

          {/* iOS Bottom Tab Bar (When authenticated) */}
          {isAuthenticated && (
            <div className="h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-around px-2 shrink-0 z-20">
              <TabButton
                icon={<Home className="w-5 h-5" />}
                label="Home"
                active={activeTab === 'home' && !activeSubscreen}
                id="tgBank.tab.home"
                onClick={() => {
                  setActiveSubscreen(null);
                  setActiveTab('home');
                }}
              />
              <TabButton
                icon={<QrCode className="w-5 h-5" />}
                label="UPI Pay"
                active={activeTab === 'payments' && !activeSubscreen}
                id="tgBank.tab.payments"
                onClick={() => {
                  setActiveSubscreen(null);
                  setActiveTab('payments');
                }}
              />
              <TabButton
                icon={<Clock className="w-5 h-5" />}
                label="History"
                active={activeTab === 'transactions' && !activeSubscreen}
                id="tgBank.tab.transactions"
                onClick={() => {
                  setActiveSubscreen(null);
                  setActiveTab('transactions');
                }}
              />
              <TabButton
                icon={<CreditCard className="w-5 h-5" />}
                label="Credit"
                active={activeTab === 'credit' && !activeSubscreen}
                id="tgBank.tab.credit"
                onClick={() => {
                  setActiveSubscreen(null);
                  setActiveTab('credit');
                }}
              />
              <TabButton
                icon={<User className="w-5 h-5" />}
                label="Profile"
                active={activeTab === 'profile' && !activeSubscreen}
                id="tgBank.tab.profile"
                onClick={() => {
                  setActiveSubscreen(null);
                  setActiveTab('profile');
                }}
              />
            </div>
          )}

          {/* iOS Home Indicator Bar */}
          <div className="h-5 flex items-center justify-center shrink-0 bg-white dark:bg-slate-900">
            <div
              data-accessibility-id="tgBank.system.homeIndicator"
              className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  id: string;
  onClick: () => void;
}> = ({ icon, label, active, id, onClick }) => {
  return (
    <button
      type="button"
      data-accessibility-id={id}
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
        active
          ? 'text-blue-600 dark:text-blue-400 font-bold'
          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
      }`}
    >
      <div className="mb-0.5">{icon}</div>
      <span className="text-[10px] tracking-tight">{label}</span>
    </button>
  );
};
