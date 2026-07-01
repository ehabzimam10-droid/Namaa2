import type { Kid } from '../data/mockData';

interface KidDashboardProps {
  kid: Kid;
}

export default function KidDashboard({ kid }: KidDashboardProps) {
  const savingPercentage = Math.round((kid.saved / kid.allowance) * 100);
  const isThriving = savingPercentage >= 50;

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-[#111827] text-slate-100 shadow-2xl ring-1 ring-orange-500/10 transition-all duration-300 hover:shadow-orange-950/10">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 px-6 py-8 text-right font-sans">
        {/* Subtle decorative background shapes */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-400 opacity-20 blur-xl"></div>
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-amber-400 opacity-20 blur-xl"></div>

        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            العمر: {kid.age} سنوات
          </span>
          <h2 className="text-2xl font-black tracking-wide text-white">
            لوحة تحكم {kid.name}
          </h2>
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
          <h3 className="text-right text-xs font-bold uppercase tracking-wider text-slate-400">
            القلعة الافتراضية الخاصة بك
          </h3>

          {isThriving ? (
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 p-5 text-right transition-transform hover:scale-[1.02] duration-300">
              <div className="absolute -left-4 -top-4 text-6xl opacity-25">🏰</div>
              <div className="flex items-start justify-between">
                <div className="text-left">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    مزدهرة ✨
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-emerald-300 flex items-center justify-end gap-1">
                    <span>Thriving Castle 🏰✨</span>
                  </h4>
                  <p className="text-xs text-emerald-400">
                    عمل رائع! ادخارك تخطى 50% وقلعتك الآن في أبهى صورها وتنبض بالحياة!
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${savingPercentage}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-amber-600/20 bg-gradient-to-r from-amber-950/50 to-orange-950/50 p-5 text-right transition-transform hover:scale-[1.02] duration-300">
              <div className="absolute -left-4 -top-4 text-6xl opacity-20">🛖</div>
              <div className="flex items-start justify-between">
                <div className="text-left">
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                    بسيطة 🛖
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-amber-400 flex items-center justify-end gap-1">
                    <span>Basic Castle 🛖</span>
                  </h4>
                  <p className="text-xs text-amber-500">
                    ادخر المزيد من مصروفك لتطوير قلعتك وتحويلها إلى قلعة ذهبية مزدهرة!
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500" style={{ width: `${savingPercentage}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="space-y-3">
          <h3 className="text-right text-xs font-bold uppercase tracking-wider text-slate-400">
            المعاملات الأخيرة
          </h3>

          <div className="divide-y divide-slate-800 overflow-hidden rounded-2xl bg-slate-950/50 border border-slate-800">
            {kid.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 transition-colors hover:bg-slate-800/30">
                <div className="text-left">
                  <span className={`font-mono text-base font-bold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} ريال
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{tx.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-sm text-slate-200">{tx.title}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
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
