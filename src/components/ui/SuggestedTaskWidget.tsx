import { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface SuggestedTaskWidgetProps {
  kidName: string;
  title: string;
  suggestedAmount: number;
  type: 'cash' | 'points' | 'custom';
  reasoning: string;
}

export default function SuggestedTaskWidget({
  kidName,
  title: initialTitle,
  suggestedAmount: initialAmount,
  type: initialType,
  reasoning
}: SuggestedTaskWidgetProps) {
  const { assignManualTask } = useApp();
  const [status, setStatus] = useState<'idle' | 'approved' | 'rejected'>('idle');

  // Local state for editable task fields
  const [title, setTitle] = useState(initialTitle);
  const [amount, setAmount] = useState<number>(initialAmount || 0);
  const [type, setType] = useState<'cash' | 'points' | 'custom'>(initialType || 'cash');
  const [customReward, setCustomReward] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApprove = async () => {
    try {
      await assignManualTask(
        kidName,
        title,
        type === 'custom' ? 0 : amount,
        type,
        type === 'custom' ? customReward : undefined,
        endDate || undefined
      );
      setStatus('approved');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = () => {
    setStatus('rejected');
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg backdrop-blur-md text-right font-sans my-2">
      {/* Widget Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#8c7355]/30 text-orange-300">
          توصية ذكية 🤖 (قابلة للتعديل)
        </span>
        <h4 className="text-xs font-bold text-white">اقتراح مهمة لـ {kidName} 🎯</h4>
      </div>

      {/* Task Content (Editable Form) */}
      <div className="space-y-2.5 text-xs text-right">
        {status === 'idle' ? (
          <>
            <div>
              <label className="text-[9px] text-slate-400 block mb-1">اسم المهمة</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] rounded-xl px-2.5 py-1.5 text-right text-white text-xs outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {type !== 'custom' ? (
                <div>
                  <label className="text-[9px] text-slate-400 block mb-1">قيمة المكافأة</label>
                  <input
                    type="number"
                    value={amount === 0 ? '' : amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] rounded-xl px-2.5 py-1.5 text-left text-white text-xs outline-none transition-all font-sans"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[9px] text-slate-400 block mb-1">المكافأة المخصصة</label>
                  <input
                    type="text"
                    value={customReward}
                    onChange={(e) => setCustomReward(e.target.value)}
                    placeholder="مثال: ساعتين سوني 🎮"
                    className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] rounded-xl px-2.5 py-1.5 text-right text-white text-xs outline-none transition-all"
                  />
                </div>
              )}
              <div>
                <label className="text-[9px] text-slate-400 block mb-1">نوع المكافأة</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'cash' | 'points' | 'custom')}
                  className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] rounded-xl px-2.5 py-1.5 text-right text-white text-xs outline-none transition-all"
                >
                  <option value="cash">ريال 💸</option>
                  <option value="points">نقاط 🌟</option>
                  <option value="custom">مخصصة 🎁</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] text-slate-400 block mb-1">تاريخ النهاية (اختياري)</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] rounded-xl px-2.5 py-1.5 text-right text-white text-xs outline-none transition-all font-sans"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[9px] text-slate-400 block">اسم المهمة</span>
                <span className="font-extrabold text-white">{title}</span>
              </div>
              {endDate && (
                <div>
                  <span className="text-[9px] text-slate-400 block">تاريخ النهاية</span>
                  <span className="font-bold text-slate-300 font-sans text-[10px]">{endDate.replace('T', ' ')}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-2 rounded-xl border border-white/5 col-span-2">
                <span className="text-[9px] text-slate-400 block">المكافأة</span>
                <span className="font-bold text-orange-400 font-sans">
                  {type === 'custom'
                    ? (customReward || 'هدية مخصصة 🎁')
                    : `${amount} ${type === 'cash' ? 'ريال 💸' : 'نقطة 🌟'}`}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="bg-[#111C2E]/40 p-2.5 rounded-xl border border-white/5 text-[10px] leading-relaxed text-slate-300">
          <span className="font-bold text-orange-300 block mb-0.5">لماذا تم الاقتراح؟</span>
          {reasoning}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
        {status === 'idle' ? (
          <>
            <button
              type="button"
              onClick={handleReject}
              className="px-3 py-1.5 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 rounded-lg text-[10px] font-bold transition-all active:scale-95"
            >
              رفض ❌
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-[10px] font-bold transition-all active:scale-95 shadow-md"
            >
              اعتماد المهمة 🎯
            </button>
          </>
        ) : status === 'approved' ? (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-full text-center">
            تم اعتماد المهمة وإسنادها للطفل بنجاح! ✅
          </span>
        ) : (
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 w-full text-center">
            تم رفض اقتراح المهمة. ❌
          </span>
        )}
      </div>
    </div>
  );
}
