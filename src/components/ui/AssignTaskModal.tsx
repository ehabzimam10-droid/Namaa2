import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  kidName: string;
}

export default function AssignTaskModal({ isOpen, onClose, kidName }: AssignTaskModalProps) {
  const { assignManualTask, kids, activeLeague, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [rewardType, setRewardType] = useState<'cash' | 'points' | 'custom'>('cash');
  const [amount, setAmount] = useState<number | ''>('');
  const [customReward, setCustomReward] = useState('');
  const [endDate, setEndDate] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [bindToLeagueEnd, setBindToLeagueEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeLeague && activeLeague.isActive) {
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
    }

    if (rewardType !== 'custom' && (!amount || amount <= 0)) {
      return;
    }
    if (rewardType === 'custom' && !customReward.trim()) {
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      try {
        const finalAmount = rewardType === 'custom' ? 0 : Number(amount);
        const finalEndDate = bindToLeagueEnd && activeLeague && activeLeague.endDate
          ? activeLeague.endDate
          : endDate || undefined;

        await assignManualTask(
          kidName,
          title.trim(),
          finalAmount,
          rewardType,
          rewardType === 'custom' ? customReward.trim() : undefined,
          finalEndDate,
          difficulty
        );
        setIsLoading(false);
        setTitle('');
        setRewardType('cash');
        setAmount('');
        setCustomReward('');
        setEndDate('');
        setDifficulty('easy');
        setBindToLeagueEnd(false);
        onClose();
        showToast(`تم إسناد المهمة "${title}" للابن ${kidName} بنجاح! 🎯✨`, 'success');
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#0C2341]/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-stone-200/80 shadow-2xl rounded-[28px] p-6 text-right font-sans overflow-hidden text-[#0C2341]">
        <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#8B84D7]/5 blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-4">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#0C2341] text-lg font-bold transition-colors p-1"
          >
            ✕
          </button>
          <h3 className="text-base font-black text-[#0C2341]">تخصيص مهمة جديدة لـ {kidName} 🎯</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeLeague && activeLeague.isActive && (
            /* Target Tasks Progress Helper */
            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-2xl text-right text-xs space-y-1.5 backdrop-blur-md">
              <span className="font-bold text-[#C66E4E] block">📊 أهداف المهام لهذا الدوري:</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 font-sans">
                <div className="bg-white p-1.5 rounded-xl border border-stone-200/60 shadow-sm">
                  <span className="block text-slate-400">سهلة (5)</span>
                  <span className="font-extrabold text-[#0C2341]">{easyCount}/5</span>
                  <span className="block text-[8px] text-[#C66E4E]">(المتبقي: {remainingEasy})</span>
                </div>
                <div className="bg-white p-1.5 rounded-xl border border-stone-200/60 shadow-sm">
                  <span className="block text-slate-400">متوسطة (3)</span>
                  <span className="font-extrabold text-[#0C2341]">{mediumCount}/3</span>
                  <span className="block text-[8px] text-[#C66E4E]">(المتبقي: {remainingMedium})</span>
                </div>
                <div className="bg-white p-1.5 rounded-xl border border-stone-200/60 shadow-sm">
                  <span className="block text-slate-400">صعبة (3)</span>
                  <span className="font-extrabold text-[#0C2341]">{hardCount}/3</span>
                  <span className="block text-[8px] text-[#C66E4E]">(المتبقي: {remainingHard})</span>
                </div>
              </div>
            </div>
          )}

          {/* Task Title */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">عنوان المهمة</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ترتيب الغرفة"
              className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-3 py-2.5 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400 font-sans"
            />
          </div>

          {/* Difficulty Dropdown (Only show if there is an active league) */}
          {activeLeague && activeLeague.isActive && (
            <div className="space-y-1">
              <label className="block text-xs text-slate-500 font-bold">مستوى الصعوبة</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  const diffVal = e.target.value as 'easy' | 'medium' | 'hard';
                  setDifficulty(diffVal);
                  if (rewardType === 'points') {
                    setAmount(diffVal === 'easy' ? 5 : diffVal === 'medium' ? 10 : 15);
                  }
                }}
                className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-3 py-2.5 text-right text-[#0C2341] text-xs outline-none transition-all font-sans"
              >
                <option value="easy" disabled={activeLeague && activeLeague.isActive && remainingEasy === 0}>سهل (5 نقاط) - المتبقي: {remainingEasy}/5</option>
                <option value="medium" disabled={activeLeague && activeLeague.isActive && remainingMedium === 0}>متوسط (10 نقاط) - المتبقي: {remainingMedium}/3</option>
                <option value="hard" disabled={activeLeague && activeLeague.isActive && remainingHard === 0}>صعب (15 نقطة) - المتبقي: {remainingHard}/3</option>
              </select>
            </div>
          )}

          {/* Reward Type (Segmented Toggle - Hide points if no active league) */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">نوع المكافأة</label>
            <div className={`grid gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60 ${
              activeLeague && activeLeague.isActive ? 'grid-cols-3' : 'grid-cols-2'
            }`}>
              <button
                type="button"
                onClick={() => setRewardType('cash')}
                className={`py-2 rounded-lg text-xs font-bold transition-all text-center ${
                  rewardType === 'cash'
                    ? 'bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] text-white shadow-sm'
                    : 'text-slate-550 hover:text-[#0C2341]'
                }`}
              >
                ريال
              </button>
              {activeLeague && activeLeague.isActive && (
                <button
                  type="button"
                  onClick={() => {
                    setRewardType('points');
                    setAmount(difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all text-center ${
                    rewardType === 'points'
                      ? 'bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] text-white shadow-sm'
                      : 'text-slate-550 hover:text-[#0C2341]'
                  }`}
                >
                  نقطة
                </button>
              )}
              <button
                type="button"
                onClick={() => setRewardType('custom')}
                className={`py-2 rounded-lg text-xs font-bold transition-all text-center ${
                  rewardType === 'custom'
                    ? 'bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] text-white shadow-sm'
                    : 'text-slate-550 hover:text-[#0C2341]'
                }`}
              >
                مخصصة
              </button>
            </div>
          </div>

          {/* Reward Amount (Hidden if 'custom' is selected) */}
          {rewardType !== 'custom' && (
            <div className="space-y-1 animate-slide-down">
              <label className="block text-xs text-slate-500 font-bold">
                {rewardType === 'cash' ? 'قيمة المكافأة (بالريال)' : 'عدد النقاط'}
              </label>
              <input
                type="number"
                required
                min="1"
                disabled={rewardType === 'points'}
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={rewardType === 'cash' ? 'مثال: 20' : 'مثال: 5'}
                className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-3 py-2.5 text-left text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400 font-sans disabled:opacity-50"
              />
            </div>
          )}

          {/* Custom Reward Text (Shown only if 'custom' is selected) */}
          {rewardType === 'custom' && (
            <div className="space-y-1 animate-slide-down">
              <label className="block text-xs text-slate-500 font-bold">المكافأة المخصصة</label>
              <input
                type="text"
                required
                value={customReward}
                onChange={(e) => setCustomReward(e.target.value)}
                placeholder="مثال: ساعة لعب إضافية للبلايستيشن 🎮"
                className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-3 py-2.5 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400 font-sans"
              />
            </div>
          )}

          {/* End Date with Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-row-reverse text-xs text-slate-500">
              <label className="block font-bold">تاريخ نهاية المهمة</label>
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
                    className="rounded border-stone-300 text-[#C66E4E] focus:ring-0 focus:ring-offset-0 bg-stone-50"
                  />
                  <span className="text-[10px] text-[#C66E4E] font-bold">ربط نهاية المهمة بنهاية الدوري 🏆</span>
                </label>
              )}
            </div>
            <input
              type="datetime-local"
              disabled={bindToLeagueEnd}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-3 py-2.5 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400 font-sans disabled:opacity-50"
            />
          </div>

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
