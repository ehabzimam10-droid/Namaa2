import { useApp } from '../../context/AppContext';

interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionsModal({ isOpen, onClose }: TransactionsModalProps) {
  const { kids, profile } = useApp();

  if (!isOpen) return null;

  // Find current active kid
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // Sort transactions Descending by Date
  const transactions = [...(kid.transactions || [])].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#0C2341]/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-stone-200/80 shadow-2xl rounded-[28px] p-6 text-right font-sans overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#C66E4E]/5 blur-2xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-4">
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-[#0C2341] text-lg font-bold transition-colors p-1"
          >
            ✕
          </button>
          <h3 className="text-base font-black text-[#0C2341]">سجل العمليات المالية للابن {kid.name} 📜</h3>
        </div>

        {/* Transactions List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {transactions.length > 0 ? (
            transactions.map((tx) => {
              const isDeposit = tx.type === 'deposit';
              return (
                <div
                  key={tx.id}
                  className="bg-[#0C2341]/5 border border-[#0C2341]/5 p-3 rounded-2xl flex justify-between items-center hover:bg-[#0C2341]/10 transition-all duration-300"
                >
                  {/* Amount (Left side in RTL context) */}
                  <div className={`font-bold font-sans text-xs ${isDeposit ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isDeposit ? '+' : '-'} {tx.amount} ريال
                  </div>

                  {/* Details (Right side in RTL context) */}
                  <div className="space-y-1 text-right">
                    <h5 className="font-bold text-xs text-[#0C2341]">{tx.title}</h5>
                    <span className="text-[9px] text-slate-500 font-sans block">
                      {new Date(tx.date).toLocaleString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              لا توجد عمليات مالية مسجلة بعد. 💰✨
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-stone-100 mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0C2341] hover:bg-[#8B84D7] text-white font-bold rounded-xl text-xs transition-all active:scale-95 shadow-md"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
