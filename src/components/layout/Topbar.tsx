import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TransactionsModal from '../ui/TransactionsModal';

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { profile, kids } = useApp();
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  const isFather = profile?.role === 'father';
  const isKid = profile?.role === 'kid';
  
  // Find current active kid if role is kid
  const kid = isKid ? (kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0]) : null;
  const balance = kid ? kid.balance : 0;

  return (
    <>
      <header className="w-full h-16 px-6 bg-[#111C2E]/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white relative z-30">
        {/* Mobile Hamburger Menu Icon (on Left) */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
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

        {/* User Info & Balance (on Top Right) */}
        <div className="flex items-center gap-3 text-right">
          {/* Action buttons and badge for Kid */}
          {isKid && kid && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTxModalOpen(true)}
                className="bg-[#8c7355]/20 hover:bg-[#8c7355]/30 border border-[#8c7355]/30 rounded-2xl px-3 py-1.5 text-xs font-bold text-orange-300 transition-all active:scale-95 shadow-md flex items-center gap-1 font-sans"
              >
                <span>سجل العمليات 📜</span>
              </button>

              <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-xl shadow-lg font-sans">
                <span className="text-[10px] text-slate-300 font-bold">الرصيد المتاح:</span>
                <span className={`text-xs font-black ${balance > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {balance} ريال 💳
                </span>
              </div>
            </div>
          )}

          <div className="space-y-0.5">
            <span className="font-extrabold text-sm block">{profile?.name || 'مستخدم نماء'}</span>
            <span className="text-[10px] text-orange-400 font-bold block">
              {isFather ? 'حساب ولي الأمر 👤' : 'حساب الابن النشط 👦'}
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8c7355] to-orange-500/30 border border-white/10 flex items-center justify-center text-base">
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
