import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import TransactionsModal from '../ui/TransactionsModal';

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { profile, kids, notifications, markNotificationAsRead } = useApp();
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFather = profile?.role === 'father';
  const isKid = profile?.role === 'kid';
  
  // Find current active kid if role is kid
  const kid = isKid ? (kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0]) : null;
  const balance = kid ? kid.balance : 0;

  // Filter and sort notifications
  const userNotifications = (notifications || [])
    .filter((n) => {
      if (isFather) {
        return n.role === 'father';
      } else if (isKid && kid) {
        return n.role === 'kid' && n.userId === kid.id;
      }
      return false;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  // Click Outside to Close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all filtered notifications as read
      userNotifications.forEach((n) => {
        if (!n.isRead) {
          markNotificationAsRead(n.id);
        }
      });
    }
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
    if (diffHours < 24) return `قبل ${diffHours} ساعة`;
    return `قبل ${diffDays} يوم`;
  };

  return (
    <>
      <header className="w-full py-4 px-6 md:px-8 bg-transparent flex flex-col md:flex-row-reverse md:items-center justify-between gap-4 text-[#0C2341] relative z-30">
        
        {/* Right Section: User Greeting & Mobile Toggle */}
        <div className="flex items-center justify-between md:justify-start gap-4 flex-row-reverse">
          {/* Mobile Hamburger Menu Icon (on Left in RTL viewports) */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2.5 rounded-xl bg-white border border-stone-200 text-slate-600 hover:text-amad-text shadow-sm transition-all active:scale-95 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="text-right space-y-0.5">
            <h1 className="font-black text-xl md:text-2xl text-[#0C2341] flex items-center justify-end gap-1.5">
              <span>مرحباً، {profile?.name || 'مستخدم نماء'}!</span>
              <span className="text-xl md:text-2xl">👋</span>
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-sans">
              استكشف المعلومات والأنشطة المالية لعائلتك الذكية 🍃
            </p>
          </div>
        </div>

        {/* Left Section: Search, Logs, Notifications, Profile (Align Left in RTL) */}
        <div className="flex items-center gap-3.5 flex-row-reverse justify-end md:justify-start w-full md:w-auto">
          {/* Mock Search Pill (matches screenshot) */}
          <div className="hidden sm:flex items-center bg-white border border-stone-200 shadow-sm rounded-full p-1 w-64 justify-between transition-all focus-within:border-[#8B84D7]/50 focus-within:ring-1 focus-within:ring-[#8B84D7]/30" dir="rtl">
            <button className="w-8 h-8 rounded-full bg-[#0C2341] hover:bg-[#8B84D7] text-white flex items-center justify-center transition-all shadow-sm shrink-0 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="ابحث عن مهام، أهداف..."
              className="bg-transparent text-xs text-[#0C2341] outline-none w-full text-right placeholder:text-slate-400 font-sans px-3"
            />
          </div>

          {/* Transactions Log trigger styled as chat/bubble icon */}
          {isKid && kid && (
            <button
              type="button"
              onClick={() => setIsTxModalOpen(true)}
              title="سجل العمليات"
              className="p-2.5 rounded-full bg-white border border-stone-200 text-slate-600 hover:text-amad-text shadow-sm transition-all active:scale-95 flex items-center justify-center relative group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              {/* Tooltip */}
              <span className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0C2341] text-white text-[9px] px-2 py-1 rounded-lg whitespace-nowrap shadow-md pointer-events-none z-50">
                سجل العمليات ({balance} ريال متاح)
              </span>
            </button>
          )}

          {/* Theme Toggle Button (Aesthetic simulation placeholder) */}
          <button
            type="button"
            onClick={() => {
              showToast?.('تمت محاكاة تغيير المظهر! التطبيق مهيأ لثيم عماد الافتراضي حالياً 🎨', 'success');
            }}
            className="p-2.5 rounded-full bg-white border border-stone-200 text-slate-500 hover:text-[#0C2341] shadow-sm transition-all active:scale-95 flex items-center justify-center relative group select-none cursor-pointer"
          >
            {/* Sun/Moon dual icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m-.386-6.364l1.591 1.591M12 7.5a4.5 4.5 0 00-4.5 4.5c0 2.485 2.015 4.5 4.5 4.5 2.485 0 4.5-2.015 4.5-4.5 0-.671-.148-1.307-.413-1.879a6 6 0 01-6.708-6.708A4.478 4.478 0 00 12 7.5z" />
            </svg>
            <span className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0C2341] text-white text-[9px] px-2 py-1 rounded-lg whitespace-nowrap shadow-md pointer-events-none z-50">
              تغيير المظهر (تجريبي)
            </span>
          </button>

          {/* Permanently Fixed Balance Pill */}
          {isKid && kid && (
            <div className="flex items-center gap-1.5 bg-[#8B84D7]/10 border border-[#8B84D7]/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0C2341] shadow-sm font-sans" dir="rtl">
              <span className="text-[10px] text-slate-500 font-bold">الرصيد المتاح:</span>
              <span className="text-[#C66E4E] font-black text-sm">{balance}</span>
              <span className="text-[10px] text-slate-500 font-bold">ريال</span>
            </div>
          )}
          {isFather && (
            <div className="flex items-center gap-1.5 bg-[#C66E4E]/10 border border-[#C66E4E]/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0C2341] shadow-sm font-sans" dir="rtl">
              <span className="text-[10px] text-slate-500 font-bold">إجمالي أرصدة الأبناء:</span>
              <span className="text-[#C66E4E] font-black text-sm">{kids.reduce((sum, k) => sum + k.balance, 0)}</span>
              <span className="text-[10px] text-slate-500 font-bold">ريال</span>
            </div>
          )}

          {/* Notification Bell */}
          {(isFather || isKid) && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={handleToggleNotifications}
                className="p-2.5 rounded-full bg-white border border-stone-200 text-slate-600 hover:text-amad-text shadow-sm transition-all select-none relative active:scale-95 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#C66E4E] text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white animate-pulse font-sans">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Floating Dropdown */}
              {showNotifications && (
                <div className="absolute left-auto right-0 mt-2.5 w-80 bg-white border border-stone-200 shadow-xl rounded-2xl p-4 text-right font-sans z-50">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-amad-text text-xs font-bold transition-colors"
                    >
                      ✕
                    </button>
                    <h4 className="text-xs font-black text-[#0C2341] flex items-center gap-1">
                      <span>إشعارات نماء</span>
                      <span>🔔</span>
                    </h4>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {userNotifications.length > 0 ? (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-2.5 rounded-xl text-right border transition-all duration-200 ${
                            notif.isRead
                              ? 'bg-slate-50 border-stone-100 text-slate-600'
                              : 'bg-[#C66E4E]/5 border-[#C66E4E]/20 text-[#0C2341]'
                          }`}
                        >
                          <div className="font-bold text-[11px] leading-tight mb-1 flex justify-between items-center">
                            <span className="text-[8px] text-slate-500 font-sans">{timeAgo(notif.createdAt)}</span>
                            <span>{notif.title}</span>
                          </div>
                          <div className="text-[9px] text-slate-500 leading-normal">{notif.message}</div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-500">
                        لا توجد إشعارات جديدة 💤
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User profile bubble (circular avatar container) */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#C66E4E]/10 to-[#8B84D7]/10 border border-stone-200 shadow-sm flex items-center justify-center text-base cursor-pointer hover:scale-105 transition-all select-none">
            {isFather ? '👨‍💼' : '👦'}
          </div>
        </div>
      </header>

      {/* Transactions Modal for Kids */}
      {isKid && kid && (
        <TransactionsModal
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
        />
      )}
    </>
  );
}
