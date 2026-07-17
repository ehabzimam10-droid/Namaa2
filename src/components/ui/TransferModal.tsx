import { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  kidId: string;
  kidName: string;
}

export default function TransferModal({ isOpen, onClose, kidId, kidName }: TransferModalProps) {
  const { transferMoney, showToast } = useApp();

  const [amount, setAmount] = useState<number | ''>('');
  const [reasonCategory, setReasonCategory] = useState<'مصروف' | 'عائد مستحق' | 'جائزة' | 'أخرى'>('مصروف');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    const finalReason = reasonCategory === 'أخرى' ? customReason.trim() || 'تحويل مخصص' : reasonCategory;

    setIsLoading(true);

    // Simulate 800ms loading delay for premium UX
    setTimeout(async () => {
      await transferMoney(kidId, Number(amount), finalReason);
      setIsLoading(false);
      // Reset state
      setAmount('');
      setReasonCategory('مصروف');
      setCustomReason('');
      onClose();
      showToast(`تم تحويل مبلغ ${amount} ريال للابن ${kidName} بنجاح! 💸✨`, 'success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#0C2341]/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-stone-200/80 shadow-2xl rounded-[28px] p-6 text-right font-sans overflow-hidden text-[#0C2341]">
        {/* Decorative background glow */}
        <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#C66E4E]/5 blur-2xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-4">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#0C2341] text-lg font-bold transition-colors p-1"
          >
            ✕
          </button>
          <h3 className="text-base font-black text-[#0C2341]">تحويل مالي ذكي إلى {kidName} 💸</h3>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount input */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">المبلغ المراد تحويله (بالريال)</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 50"
              className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-3 py-2.5 text-left text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400 font-sans"
            />
          </div>

          {/* Reason category select */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">سبب التحويل</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-3 py-2.5 text-right text-[#0C2341] text-xs outline-none transition-all font-sans"
            >
              <option value="مصروف" className="bg-white">مصروف دوري 💸</option>
              <option value="عائد مستحق" className="bg-white">عائد استثمار مستحق 📈</option>
              <option value="جائزة" className="bg-white">جائزة / تشجيع 🏆</option>
              <option value="أخرى" className="bg-white">سبب آخر 🏷️</option>
            </select>
          </div>

          {/* Custom reason input (rendered only if "أخرى" is selected) */}
          {reasonCategory === 'أخرى' && (
            <div className="space-y-1 animate-slide-down">
              <label className="block text-xs text-slate-500 font-bold">اكتب السبب المخصص</label>
              <input
                type="text"
                required
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="مثال: مساعدة في تنظيف الحديقة 🏡"
                className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-3 py-2.5 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400 font-sans"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-stone-200 text-slate-600 hover:text-[#0C2341] rounded-xl text-xs bg-stone-50 hover:bg-stone-100 transition-all disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#0C2341] hover:bg-[#8B84D7] text-white font-extrabold rounded-xl text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin">⏳</span> جاري التحويل...
                </span>
              ) : (
                <span>تأكيد التحويل ✔️</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
