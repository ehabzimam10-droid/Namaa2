import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidDashboard() {
  const navigate = useNavigate();
  const { kids, addDonation, profile } = useApp();

  const kid = kids.find(k => k.name === profile?.name) || kids.find(k => k.id === 'kid_salem') || kids[1];
  const savingPercentage = Math.round((kid.saved / kid.allowance) * 100);
  const isThriving = savingPercentage >= 50;

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl text-white transition-all duration-300 hover:shadow-orange-950/10">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 px-6 py-8 text-right font-sans border-b border-white/10">
        {/* Subtle decorative background shapes */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-400 opacity-20 blur-xl"></div>
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-amber-400 opacity-20 blur-xl"></div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-bold backdrop-blur-md text-white transition-all border border-white/5"
          >
            تسجيل الخروج ➜
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-md text-white">
              العمر: {kid.age} سنوات
            </span>
            <h2 className="text-xl font-black tracking-wide text-white">
              لوحة تحكم {kid.name}
            </h2>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-end">
          <p className="text-sm font-medium text-orange-100">إجمالي المدخرات</p>
          <p className="text-4xl font-extrabold tracking-tight text-white mt-1">
            {kid.saved} <span className="text-lg font-bold">ريال</span>
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-3 text-sm backdrop-blur-md">
          <div className="text-left">
            <span className="block text-xs text-orange-200">نسبة الادخار</span>
            <span className="font-bold text-white text-base">{savingPercentage}%</span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-orange-200">المصروف الأسبوعي</span>
            <span className="font-bold text-white text-base">{kid.allowance} ريال</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6">
        {/* Virtual Castle Section */}
        <div className="space-y-3">
          <h3 className="text-right text-xs font-bold uppercase tracking-wider text-orange-400">
            القلعة الافتراضية الخاصة بك
          </h3>

          {isThriving ? (
            <div className="relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-5 text-right transition-transform hover:scale-[1.02] duration-300">
              <div className="absolute -left-4 -top-4 text-6xl opacity-25">🏰</div>
              {/* Thriving subtle glow background */}
              <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-emerald-500/10 blur-xl"></div>
              
              <div className="flex items-start justify-between">
                <div className="text-left">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    مزدهرة ✨
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-emerald-400 flex items-center justify-end gap-1">
                    <span>Thriving Castle 🏰✨</span>
                  </h4>
                  <p className="text-xs text-slate-200">
                    عمل رائع! ادخارك تخطى 50% وقلعتك الآن في أبهى صورها وتنبض بالحياة!
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-800/50">
                <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${savingPercentage}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-5 text-right transition-transform hover:scale-[1.02] duration-300">
              <div className="absolute -left-4 -top-4 text-6xl opacity-20">🛖</div>
              {/* Basic subtle orange glow background */}
              <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-amber-500/10 blur-xl"></div>

              <div className="flex items-start justify-between">
                <div className="text-left">
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                    بسيطة 🛖
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-orange-400 flex items-center justify-end gap-1">
                    <span>Basic Castle 🛖</span>
                  </h4>
                  <p className="text-xs text-slate-200">
                    ادخر المزيد من مصروفك لتطوير قلعتك وتحويلها إلى قلعة ذهبية مزدهرة!
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-800/50">
                <div className="h-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-450 to-amber-400 transition-all duration-500" style={{ width: `${savingPercentage}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* CSR / Donations Card */}
        <div className="space-y-3">
          <h3 className="text-right text-xs font-bold uppercase tracking-wider text-orange-400">
            المسؤولية المجتمعية 💚
          </h3>
          <div className="relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-5 text-right transition-all hover:scale-[1.02] duration-300">
            <div className="absolute -left-4 -top-4 text-6xl opacity-20">🤲</div>
            <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-emerald-500/10 blur-xl"></div>
            
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                مستمر 🌟
              </span>
              <h4 className="text-lg font-bold text-emerald-400 flex items-center justify-end gap-1">
                <span>المسؤولية المجتمعية 💚</span>
              </h4>
            </div>

            <div className="mt-4 flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="text-left">
                <span className="text-2xl font-extrabold text-white">{kid.donationPoints}</span>
                <span className="text-xs text-emerald-400 font-medium block">ريال متبرع به</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">مساهماتك الخيرية</span>
                <span className="text-sm font-semibold text-slate-200">النقاط الحالية</span>
              </div>
            </div>

            <button
              onClick={() => addDonation(kid.id, 10)}
              className="w-full mt-4 bg-gradient-to-r from-[#8c7355] to-[#009639] hover:from-[#9c8466] hover:to-[#00a840] text-white font-extrabold py-3 px-4 rounded-2xl shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 transform active:scale-95 text-center flex items-center justify-center gap-2"
            >
              <span>تبرع بـ 10 ريال 🤲</span>
            </button>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-3">
          <h3 className="text-right text-xs font-bold uppercase tracking-wider text-orange-400">
            المهام والمسؤوليات الحالية 🧹📅
          </h3>

          <div className="overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-5 space-y-3 text-right">
            {kid.tasks && kid.tasks.length > 0 ? (
              <div className="space-y-3">
                {kid.tasks.map((task) => (
                  <div key={task.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-row-reverse items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-white">{task.title}</h4>
                      <span className="text-[10px] text-orange-300 block font-sans mt-1">
                        المكافأة: {task.rewardType === 'custom' ? task.customReward : `${task.rewardAmount} ${task.rewardType === 'cash' ? 'ريال' : 'نقطة'}`}
                      </span>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-bold text-orange-300">
                      قيد التنفيذ ⏳
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">لا توجد مهام معلقة حالياً. حافظ على نشاطك! ✨</p>
            )}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="space-y-3">
          <h3 className="text-right text-xs font-bold uppercase tracking-wider text-orange-400">
            المعاملات الأخيرة
          </h3>

          <div className="divide-y divide-white/5 overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl">
            {kid.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 transition-colors hover:bg-white/5">
                <div className="text-left">
                  <span className={`font-mono text-base font-bold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} ريال
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{tx.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-sm text-white">{tx.title}</span>
                  <span className="block text-[10px] text-slate-300 mt-0.5">
                    {tx.type === 'deposit' ? 'إيداع 💸' : 'سحب 💳'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
