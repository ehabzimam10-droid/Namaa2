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
  const { assignManualTask, kids, activeLeague, showToast } = useApp();
  const [status, setStatus] = useState<'idle' | 'approved' | 'rejected'>('idle');

  // Local state for editable task fields
  const [title, setTitle] = useState(initialTitle);
  const [amount, setAmount] = useState<number>(initialAmount || 0);
  const [type, setType] = useState<'cash' | 'points' | 'custom'>(initialType || 'cash');
  const [customReward, setCustomReward] = useState('');
  const [endDate, setEndDate] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [bindToLeagueEnd, setBindToLeagueEnd] = useState(false);

  const kid = kids.find(k => k.name === kidName);
  
  // Filter active league tasks
  const leagueTasks = kid ? (kid.tasks || []).filter(task => {
    if (!activeLeague || !activeLeague.isActive || !activeLeague.startDate) return false;
    const taskTime = task.createdAt ? new Date(task.createdAt).getTime() : 0;
    const startTime = new Date(activeLeague.startDate).getTime();
    const endTime = activeLeague.endDate ? new Date(activeLeague.endDate).getTime() : Infinity;
    return taskTime >= startTime && taskTime <= endTime;
  }) : [];

  const easyCount = leagueTasks.filter(t => t.difficulty === 'easy').length;
  const mediumCount = leagueTasks.filter(t => t.difficulty === 'medium').length;
  const hardCount = leagueTasks.filter(t => t.difficulty === 'hard').length;

  const remainingEasy = Math.max(0, 5 - easyCount);
  const remainingMedium = Math.max(0, 3 - mediumCount);
  const remainingHard = Math.max(0, 3 - hardCount);

  const handleApprove = async () => {
    if (difficulty === 'easy' && remainingEasy === 0) {
      showToast('عذراً، لقد استنفدت عدد المهام السهلة المسموح بها (الحد الأقصى: 5)', 'error');
      return;
    }
    if (difficulty === 'medium' && remainingMedium === 0) {
      showToast('عذراً، لقد استنفدت عدد المهام المتوسطة المسموح بها (الحد الأقصى: 3)', 'error');
      return;
    }
    if (difficulty === 'hard' && remainingHard === 0) {
      showToast('عذراً، لقد استنفدت عدد المهام الصعبة المسموح بها (الحد الأقصى: 3)', 'error');
      return;
    }

    try {
      const finalEndDate = bindToLeagueEnd && activeLeague && activeLeague.endDate
        ? activeLeague.endDate
        : endDate || undefined;

      await assignManualTask(
        kidName,
        title,
        type === 'custom' ? 0 : amount,
        type,
        type === 'custom' ? customReward : undefined,
        finalEndDate,
        difficulty
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
            {/* Visual Counters (Only show if league is active) */}
            {activeLeague && activeLeague.isActive && (
              <div className="bg-white/5 border border-white/5 p-2 rounded-xl text-right text-[10px] space-y-1 backdrop-blur-md">
                <span className="font-bold text-orange-400 block">📊 أهداف المهام لهذا الدوري:</span>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] text-slate-350 font-sans">
                  <div className="bg-white/5 p-1 rounded-lg border border-white/5">
                    <span className="block text-slate-400">سهلة (5)</span>
                    <span className="font-extrabold text-white">{easyCount}/5</span>
                    <span className="block text-[8px] text-slate-500">({remainingEasy} متبقي)</span>
                  </div>
                  <div className="bg-white/5 p-1 rounded-lg border border-white/5">
                    <span className="block text-slate-400">متوسطة (3)</span>
                    <span className="font-extrabold text-white">{mediumCount}/3</span>
                    <span className="block text-[8px] text-slate-500">({remainingMedium} متبقي)</span>
                  </div>
                  <div className="bg-white/5 p-1 rounded-lg border border-white/5">
                    <span className="block text-slate-400">صعبة (3)</span>
                    <span className="font-extrabold text-white">{hardCount}/3</span>
                    <span className="block text-[8px] text-slate-500">({remainingHard} متبقي)</span>
                  </div>
                </div>
              </div>
            )}

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
              {activeLeague && activeLeague.isActive && (
                <div>
                  <label className="text-[9px] text-slate-400 block mb-1">مستوى الصعوبة</label>
                  <select
                    value={difficulty}
                    onChange={(e) => {
                      const diffVal = e.target.value as 'easy' | 'medium' | 'hard';
                      setDifficulty(diffVal);
                      if (type === 'points') {
                        setAmount(diffVal === 'easy' ? 5 : diffVal === 'medium' ? 10 : 15);
                      }
                    }}
                    className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] rounded-xl px-2.5 py-1.5 text-right text-white text-xs outline-none transition-all font-sans"
                  >
                    <option value="easy" disabled={remainingEasy === 0}>سهل (5 نقاط) - متبقي {remainingEasy}</option>
                    <option value="medium" disabled={remainingMedium === 0}>متوسط (10 نقاط) - متبقي {remainingMedium}</option>
                    <option value="hard" disabled={remainingHard === 0}>صعب (15 نقطة) - متبقي {remainingHard}</option>
                  </select>
                </div>
              )}

              <div className={activeLeague && activeLeague.isActive ? "" : "col-span-2"}>
                <label className="text-[9px] text-slate-400 block mb-1">نوع المكافأة</label>
                <select
                  value={type}
                  onChange={(e) => {
                    const nextType = e.target.value as 'cash' | 'points' | 'custom';
                    setType(nextType);
                    if (nextType === 'points') {
                      setAmount(difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15);
                    }
                  }}
                  className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] rounded-xl px-2.5 py-1.5 text-right text-white text-xs outline-none transition-all"
                >
                  <option value="cash">ريال 💸</option>
                  {activeLeague && activeLeague.isActive && <option value="points">نقاط 🌟</option>}
                  <option value="custom">مخصصة 🎁</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {type !== 'custom' ? (
                <div className="col-span-2">
                  <label className="text-[9px] text-slate-400 block mb-1">قيمة المكافأة</label>
                  <input
                    type="number"
                    disabled={type === 'points'}
                    value={amount === 0 ? '' : amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] rounded-xl px-2.5 py-1.5 text-left text-white text-xs outline-none transition-all font-sans disabled:opacity-50"
                  />
                </div>
              ) : (
                <div className="col-span-2">
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
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between flex-row-reverse text-[10px] text-slate-400">
                <label className="block font-bold">تاريخ النهاية</label>
                {activeLeague && activeLeague.isActive && (
                  <label className="flex items-center gap-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={bindToLeagueEnd}
                      onChange={(e) => {
                        setBindToLeagueEnd(e.target.checked);
                        if (e.target.checked && activeLeague && activeLeague.endDate) {
                          setEndDate(activeLeague.endDate.substring(0, 16));
                        }
                      }}
                      className="rounded border-white/10 text-orange-500 focus:ring-0 focus:ring-offset-0 bg-[#111C2E]"
                    />
                    <span className="text-[9px] text-orange-300">ربط نهاية المهمة بنهاية الدوري 🏆</span>
                  </label>
                )}
              </div>
              <input
                type="datetime-local"
                disabled={bindToLeagueEnd}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] rounded-xl px-2.5 py-1.5 text-right text-white text-xs outline-none transition-all font-sans disabled:opacity-50"
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
              className="px-3 py-1.5 border border-rose-500/20 text-rose-440 hover:bg-rose-500/10 rounded-lg text-[10px] font-bold transition-all active:scale-95"
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
