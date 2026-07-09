import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidSavingsPage() {
  const navigate = useNavigate();
  const { kids, profile, addSavingsGoal, addToGoal, withdrawGoal } = useApp();
  
  // Find current active kid
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.id === 'kid_salem') || kids[1];

  // States for creating new goal
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState<number | ''>('');

  // States for adding money to individual goals
  const [addAmounts, setAddAmounts] = useState<Record<string, number>>({});

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget || newTarget <= 0) return;

    addSavingsGoal(kid.name, newTitle.trim(), Number(newTarget));
    setNewTitle('');
    setNewTarget('');
    alert('تم إنشاء حصالة ادخار جديدة مقفلة! 🔒✨');
  };

  const handleAddMoney = (goalId: string) => {
    const amount = addAmounts[goalId] || 0;
    if (amount <= 0) return;

    if (kid.saved < amount) {
      alert('عذراً، رصيد الحصالة الذكية غير كافٍ! 😔');
      return;
    }

    addToGoal(kid.name, goalId, amount);
    setAddAmounts((prev) => ({ ...prev, [goalId]: 0 }));
    alert('تم إيداع المبلغ بنجاح في الحصالة المقفلة! 🔒💰');
  };

  const handleWithdraw = (goalId: string, goalTitle: string) => {
    withdrawGoal(kid.name, goalId);
    alert(`تهانينا! 🎉 تم سحب كامل مبلغ حصالة "${goalTitle}" وإضافته إلى حصالتك الذكية بنجاح! 🔓💰`);
  };

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header and Back Button */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/kid')}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-all border border-white/5"
          >
            👦 العودة للوحة التحكم
          </button>
          <div>
            <h2 className="text-xs font-semibold text-orange-400">الحصالة المقفلة ذات الهدف الزمني</h2>
            <h3 className="text-2xl font-black text-white mt-1">حصالات الادخار الذكية 🔒</h3>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-500/10 border border-orange-500/20 text-orange-200 p-4 rounded-2xl text-xs leading-relaxed">
        <strong>💡 فكرة الحصالة المقفلة:</strong> هنا يمكنك تجميد مبلغ مالي لهدف محدد (مثل شراء دراجة أو حاسوب). 
        لن تتمكن من سحب أي ريال من الحصالة حتى تصل لكامل هدفك المالي المكتوب! درب نفسك على الالتزام والصبر المالي. 🎯
      </div>

      {/* Top Section: Sleek Form to Create New Goal */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-white">إنشاء حصالة جديدة واستهداف هدف جديد 🎯</h4>
        
        <form onSubmit={handleCreateGoal} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">ما هو هدفك؟ (اسم الحصالة)</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثال: شراء دراجة هوائية 🚲"
              className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-2.5 text-right text-white text-xs outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-400">المبلغ المستهدف (ريال)</label>
            <input
              type="number"
              required
              min="1"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 500"
              className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-2.5 text-right text-white text-xs outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#8c7355] to-[#009639] hover:from-[#9c8466] hover:to-[#00a840] text-white font-extrabold py-2.5 rounded-xl text-xs transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-1 focus:outline-none"
          >
            <span>إنشاء حصالة جديدة ➕</span>
          </button>
        </form>
      </div>

      {/* Bottom Section: Active Savings Goals Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-orange-400">حصالات الادخار الحالية 📅</h4>
        
        {kid.savingsGoals && kid.savingsGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kid.savingsGoals.map((goal) => {
              const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
              const customAddAmount = addAmounts[goal.id] || 0;
              const isGoalAchieved = goal.currentAmount >= goal.targetAmount;

              return (
                <div
                  key={goal.id}
                  className="relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-5 text-right flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-[#8c7355]/5 blur-xl"></div>
                  
                  {/* Goal Header */}
                  <div className="flex flex-row-reverse items-start justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{isGoalAchieved ? '🔓' : '🔒'}</span>
                      <h5 className="font-bold text-sm text-white">{goal.title}</h5>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isGoalAchieved ? 'bg-emerald-500/20 text-emerald-400 animate-bounce' : 'bg-orange-500/20 text-orange-400'}`}>
                      {isGoalAchieved ? 'مكتملة وجاهزة 🎉' : 'مقفلة للادخار 🔒'}
                    </span>
                  </div>

                  {/* Progress Info */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-sans">
                      <span>{percent}% مكتمل</span>
                      <div>
                        <span className="font-bold text-white">{goal.currentAmount}</span>
                        <span className="text-slate-500"> / {goal.targetAmount} ريال</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-l transition-all duration-500 ${isGoalAchieved ? 'from-emerald-500 to-teal-400' : 'from-[#8c7355] to-orange-400'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Lock Logic Action Section */}
                  <div className="pt-2">
                    {isGoalAchieved ? (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(goal.id, goal.title)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-1"
                      >
                        <span>سحب المبلغ 🔓🎉</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={customAddAmount <= 0 || customAddAmount > kid.saved}
                          onClick={() => handleAddMoney(goal.id)}
                          className={`bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                            customAddAmount <= 0 || customAddAmount > kid.saved ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                        >
                          إيداع ➕
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={kid.saved}
                          value={customAddAmount === 0 ? '' : customAddAmount}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            setAddAmounts((prev) => ({ ...prev, [goal.id]: val }));
                          }}
                          placeholder="ادخر ريال..."
                          className="flex-1 bg-[#111C2E]/80 border border-white/10 rounded-xl px-3 py-1.5 text-left text-white text-xs outline-none placeholder:text-slate-700"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center text-xs text-slate-400">
            لا توجد حصالات مقفلة حالياً. قم بإنشاء أول حصالة لك بالأعلى للبدء بالادخار الذكي! 🚲🎮
          </div>
        )}
      </div>
    </div>
  );
}
