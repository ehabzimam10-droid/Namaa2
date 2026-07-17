import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidSavingsPage() {
  const navigate = useNavigate();
  const { kids, profile, addSavingsGoal, addToGoal, withdrawGoal, activeLeague, showToast } = useApp();
  
  // Find current active kid
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // States for creating new goal
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState<number | ''>('');
  const [newDeadline, setNewDeadline] = useState('');

  // States for adding money to individual goals
  const [addAmounts, setAddAmounts] = useState<Record<string, number>>({});

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget || newTarget <= 0) return;

    addSavingsGoal(kid.name, newTitle.trim(), Number(newTarget), newDeadline || undefined);
    setNewTitle('');
    setNewTarget('');
    setNewDeadline('');
    showToast('تم إنشاء حصالة ادخار جديدة مقفلة! 🔒✨', 'success');
  };

  const handleAddMoney = (goalId: string) => {
    const amount = addAmounts[goalId] || 0;
    if (amount <= 0) return;

    if (kid.balance < amount) {
      showToast('عذراً، الرصيد المتاح غير كافٍ! 😔', 'error');
      return;
    }

    addToGoal(kid.name, goalId, amount);
    setAddAmounts((prev) => ({ ...prev, [goalId]: 0 }));
    showToast('تم إيداع المبلغ بنجاح في الحصالة المقفلة! 🔒💰', 'success');
  };

  const handleWithdraw = (goalId: string, goalTitle: string) => {
    if (goalTitle === 'حصالة دوري العائلة 🏆' && activeLeague && activeLeague.isActive) {
      showToast('لا يمكن سحب مدخرات دوري العائلة حتى يتم إعلان نتائج الدوري من قبل والدك! 🏆🔒', 'error');
      return;
    }
    withdrawGoal(kid.name, goalId);
    showToast(`تهانينا! 🎉 تم سحب كامل مبلغ حصالة "${goalTitle}" وإضافته إلى رصيدك المتاح بنجاح! 🔓💰`, 'success');
  };

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header and Back Button */}
      <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C66E4E]/5 blur-2xl"></div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/kid')}
            className="rounded-xl bg-[#0C2341]/5 hover:bg-[#0C2341]/10 px-3 py-2 text-xs font-bold text-slate-600 transition-all border border-[#0C2341]/10"
          >
            👦 العودة للوحة التحكم
          </button>
          <div>
            <h2 className="text-xs font-semibold text-[#C66E4E]">الحصالة المقفلة ذات الهدف المالي والزمني</h2>
            <h3 className="text-2xl font-black text-[#0C2341] mt-1">حصالات الادخار الذكية 🔒</h3>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#C66E4E]/10 border border-[#C66E4E]/25 text-[#0C2341] p-4 rounded-2xl text-xs leading-relaxed">
        <strong>💡 فكرة الحصالة المقفلة الذكية:</strong> هنا يمكنك ادخار الأموال لهدف محدد أو تاريخ استحقاق معين. 
        تتحرر الحصالة تلقائياً وتعود الأموال لرصيدك المتاح فور الوصول للهدف المالي المطلوب <strong>أو</strong> فور بلوغ تاريخ الاستحقاق المحدد، 
        أيهما يأتي أولاً! 📅🎯
      </div>

      {/* Top Section: Sleek Form to Create New Goal */}
      <div className="bg-white border border-[#0C2341]/10 shadow-md rounded-3xl p-6 space-y-4 text-[#0C2341]">
        <h4 className="text-sm font-bold text-[#0C2341]">إنشاء حصالة جديدة واستهداف هدف جديد 🎯</h4>
        
        <form onSubmit={handleCreateGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-right">
          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">ما هو هدفك؟ (اسم الحصالة)</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثال: شراء دراجة هوائية 🚲"
              className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 focus:border-[#C66E4E] rounded-xl px-3 py-2 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">المبلغ المستهدف (ريال)</label>
            <input
              type="number"
              required
              min="1"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 500"
              className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 focus:border-[#C66E4E] rounded-xl px-3 py-2 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">تاريخ الاستحقاق (اختياري) 📅</label>
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 focus:border-[#C66E4E] rounded-xl px-3 py-2 text-right text-[#0C2341] text-xs outline-none transition-all font-sans"
            />
          </div>

          <button
            type="submit"
            className="bg-[#C66E4E] hover:bg-[#C66E4E]/90 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-1 focus:outline-none"
          >
            <span>إنشاء حصالة جديدة ➕</span>
          </button>
        </form>
      </div>

      {/* Bottom Section: Active Savings Goals Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#C66E4E]">حصالات الادخار الحالية 📅</h4>
        
        {kid.savingsGoals && kid.savingsGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kid.savingsGoals.map((goal) => {
              const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
              const customAddAmount = addAmounts[goal.id] || 0;
              const isGoalAchieved = goal.currentAmount >= goal.targetAmount;
              const isDeadlinePassed = goal.deadlineDate && new Date() > new Date(goal.deadlineDate);
              const isLeagueSavings = goal.title === 'حصالة دوري العائلة 🏆' && activeLeague && activeLeague.isActive;
              const isUnlocked = !isLeagueSavings && (!goal.isLocked || isGoalAchieved || isDeadlinePassed);

              return (
                <div
                  key={goal.id}
                  className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 text-right flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.01] hover:border-[#8B84D7]/50 text-[#0C2341]"
                >
                  <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-[#C66E4E]/5 blur-xl"></div>
                  
                  {/* Goal Header */}
                  <div className="flex flex-row-reverse items-start justify-between border-b border-[#0C2341]/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{isUnlocked ? '🔓' : '🔒'}</span>
                      <h5 className="font-bold text-sm text-[#0C2341]">{goal.title}</h5>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isUnlocked ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 animate-bounce' : 'bg-[#C66E4E]/10 text-[#C66E4E] border border-[#C66E4E]/25'}`}>
                      {isUnlocked ? 'محررة وجاهزة 🎉' : 'مقفلة للادخار 🔒'}
                    </span>
                  </div>

                  {/* Goal Deadline Date */}
                  {goal.deadlineDate && (
                    <div className="text-[10px] text-[#C66E4E] font-sans flex justify-between items-center bg-[#0C2341]/5 px-3 py-1.5 rounded-xl border border-[#0C2341]/10">
                      <span>{goal.deadlineDate}</span>
                      <span className="font-bold">تاريخ فك القفل التلقائي:</span>
                    </div>
                  )}

                  {/* Progress Info */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans font-bold">
                      <span>{percent}% مكتمل</span>
                      <div>
                        <span className="font-bold text-[#0C2341]">{goal.currentAmount}</span>
                        <span className="text-slate-500"> / {goal.targetAmount} ريال</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-l transition-all duration-500 ${isUnlocked ? 'from-emerald-500 to-teal-400' : 'from-[#C66E4E] to-orange-400'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Lock/Unlock Action Section */}
                  <div className="pt-2">
                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(goal.id, goal.title)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-1"
                      >
                        <span>سحب المبلغ 🔓🎉</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        {goal.currentAmount >= goal.targetAmount ? (
                          <button
                            type="button"
                            disabled
                            className="w-full bg-[#0C2341]/5 border border-emerald-500/20 text-emerald-600 font-extrabold py-2 px-4 rounded-xl text-xs cursor-not-allowed text-center"
                          >
                            اكتمل الادخار 🎉
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={customAddAmount <= 0 || customAddAmount > kid.balance || kid.balance === 0}
                              className={`text-white text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                                (kid.balance === 0 || (customAddAmount > 0 && customAddAmount > kid.balance))
                                  ? 'bg-slate-400 opacity-40 cursor-not-allowed active:scale-100'
                                  : customAddAmount <= 0
                                    ? 'bg-[#C66E4E] opacity-40 cursor-not-allowed active:scale-100'
                                    : 'bg-[#C66E4E] hover:bg-[#C66E4E]/90 active:scale-95'
                              }`}
                              onClick={() => handleAddMoney(goal.id)}
                            >
                              {(kid.balance === 0 || (customAddAmount > 0 && customAddAmount > kid.balance)) ? 'الرصيد غير كافٍ 🚫' : 'إيداع ➕'}
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={kid.balance}
                              disabled={kid.balance === 0}
                              value={customAddAmount === 0 ? '' : customAddAmount}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Number(e.target.value);
                                setAddAmounts((prev) => ({ ...prev, [goal.id]: val }));
                              }}
                              placeholder={kid.balance === 0 ? 'رصيدك فارغ 🚫' : 'ادخر ريال...'}
                              className={`flex-1 bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-xl px-3 py-1.5 text-left text-[#0C2341] text-xs outline-none placeholder:text-slate-400 transition-all ${
                                kid.balance === 0 ? 'opacity-40 cursor-not-allowed' : ''
                              }`}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-center text-xs text-slate-555 font-bold">
            لا توجد حصالات مقفلة حالياً. قم بإنشاء أول حصالة لك بالأعلى للبدء بالادخار الذكي! 🚲🎮
          </div>
        )}
      </div>
    </div>
  );
}
