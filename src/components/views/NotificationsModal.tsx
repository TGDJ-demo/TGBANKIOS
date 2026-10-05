import React from 'react';
import { useBank } from '../../services/BankContext';
import { ChevronLeft, Bell, BellOff, CheckCheck, Trash2, ShieldCheck, ArrowLeftRight, CreditCard, Gift, UserCheck } from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const { notifications, markAllNotificationsRead, clearAllNotifications, setActiveSubscreen } = useBank();

  const getIcon = (type: string) => {
    switch (type) {
      case 'transfer': return <ArrowLeftRight className="w-4 h-4 text-blue-500" />;
      case 'security': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'credit': return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'kyc': return <UserCheck className="w-4 h-4 text-amber-500" />;
      case 'offer': return <Gift className="w-4 h-4 text-pink-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div
      data-accessibility-id="tgBank.notifications.screen"
      className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubscreen(null)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
        <div className="w-12"></div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          data-accessibility-id="tgBank.notifications.markAllReadButton"
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold rounded-lg text-xs hover:bg-blue-100 transition"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>

        <button
          type="button"
          data-accessibility-id="tgBank.notifications.clearAllButton"
          onClick={clearAllNotifications}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold rounded-lg text-xs hover:bg-rose-100 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <BellOff className="w-10 h-10 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium">No notifications</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              data-accessibility-id={`tgBank.notifications.item.${item.id}`}
              className={`p-3 rounded-2xl border transition ${
                item.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 opacity-80'
                  : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5
                      data-accessibility-id={`tgBank.notifications.item.${item.id}.title`}
                      className="text-xs font-bold text-slate-900 dark:text-white truncate"
                    >
                      {item.title}
                    </h5>
                    <span
                      data-accessibility-id={`tgBank.notifications.item.${item.id}.timestamp`}
                      className="text-[10px] text-slate-400 shrink-0"
                    >
                      {item.timestamp}
                    </span>
                  </div>

                  <p
                    data-accessibility-id={`tgBank.notifications.item.${item.id}.message`}
                    className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2"
                  >
                    {item.message}
                  </p>

                  <div className="flex justify-end mt-1">
                    <span
                      data-accessibility-id={`tgBank.notifications.item.${item.id}.readState`}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.isRead
                          ? 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                      }`}
                    >
                      {item.isRead ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
