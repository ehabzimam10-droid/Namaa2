import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  kidName: string;
}

export default function AssignTaskModal({ isOpen, onClose, kidName }: AssignTaskModalProps) {
  const { assignManualTask } = useApp();

  const [title, setTitle] = useState('');
  const [rewardType, setRewardType] = useState<'cash' | 'points' | 'custom'>('cash');
  const [amount, setAmount] = useState<number | ''>('');
  const [customReward, setCustomReward] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Check validation based on type
    if (rewardType !== 'custom' && (!amount || amount <= 0)) {
      return;
    }
    if (rewardType === 'custom' && !customReward.trim()) {
      return;
    }

    setIsLoading(true);

    // Simulate 800ms loading delay for premium UX
    setTimeout(async () => {
      try {
        const finalAmount = rewardType === 'custom' ? 0 : Number(amount);
        await assignManualTask(
          kidName,
          title.trim(),
          finalAmount,
          rewardType,
          rewardType === 'custom' ? customReward.trim() : undefined,
          endDate || undefined
        );
        setIsLoading(false);
        // Reset states
        setTitle('');
        setRewardType('cash');
        setAmount('');
        setCustomReward('');
        setEndDate('');
        onClose();
        alert(`تم إسناد المهمة "${title}" للابن ${kidName} بنجاح! 🎯✨`);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0D1527]/90 border border-white/10 shadow-2xl rounded-3xl p-6 text-right font-sans overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold transition-colors p-1"
          >
            ✕
          </button>
          <h3 className="text-base font-black text-white">تخصيص مهمة جديدة لـ {kidName} 🎯</h3>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">عنوان المهمة</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ترتيب الغرفة"
              className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-2.5 text-right text-white text-xs outline-none transition-all placeholder:text-slate-700 font-sans"
            />
          </div>

          {/* Reward Type (Segmented Toggle) */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">نوع المكافأة</label>
            <div className="grid grid-cols-3 gap-1 bg-[#111C2E]/80 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setRewardType('cash')}
                className={`py-2 rounded-lg text-xs font-bold transition-all text-center ${
                  rewardType === 'cash'
                    ? 'bg-gradient-to-r from-orange-500 to-[#8c7355] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ريال
              </button>
              <button
                type="button"
                onClick={() => setRewardType('points')}
                className={`py-2 rounded-lg text-xs font-bold transition-all text-center ${
                  rewardType === 'points'
                    ? 'bg-gradient-to-r from-orange-500 to-[#8c7355] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                نقطة
              </button>
              <button
                type="button"
                onClick={() => setRewardType('custom')}
                className={`py-2 rounded-lg text-xs font-bold transition-all text-center ${
                  rewardType === 'custom'
                    ? 'bg-gradient-to-r from-orange-500 to-[#8c7355] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                مخصصة
              </button>
            </div>
          </div>

          {/* Reward Amount (Hidden if 'custom' is selected) */}
          {rewardType !== 'custom' && (
            <div className="space-y-1 animate-slide-down">
              <label className="block text-xs text-slate-400">
                {rewardType === 'cash' ? 'قيمة المكافأة (بالريال)' : 'عدد النقاط'}
              </label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={rewardType === 'cash' ? 'مثال: 20' : 'مثال: 5'}
                className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-2.5 text-left text-white text-xs outline-none transition-all placeholder:text-slate-700 font-sans"
              />
            </div>
          )}

          {/* Custom Reward Text (Shown only if 'custom' is selected) */}
          {rewardType === 'custom' && (
            <div className="space-y-1 animate-slide-down">
              <label className="block text-xs text-slate-400">المكافأة المخصصة</label>
              <input
                type="text"
                required
                value={customReward}
                onChange={(e) => setCustomReward(e.target.value)}
                placeholder="مثال: ساعة لعب إضافية للبلايستيشن 🎮"
                className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-2.5 text-right text-white text-xs outline-none transition-all placeholder:text-slate-700 font-sans"
              />
            </div>
          )}

          {/* End Date */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">تاريخ النهاية (اختياري)</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-2.5 text-right text-white text-xs outline-none transition-all placeholder:text-slate-700 font-sans"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs hover:bg-white/5 transition-all disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin">⏳</span> جاري الحفظ...
                </span>
              ) : (
                <span>إسناد المهمة ✅</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
