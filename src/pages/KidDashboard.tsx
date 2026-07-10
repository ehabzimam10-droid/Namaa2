import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidDashboard() {
  const { kids, addDonation, profile, projects } = useApp();

  const kid = kids.find(k => k.name === profile?.name) || kids.find(k => k.id === 'kid_salem') || kids[1];
  const savingPercentage = Math.round((kid.saved / kid.allowance) * 100);
  const isThriving = savingPercentage >= 50;

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header Profile Summary */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 px-6 py-6 rounded-3xl border border-white/10 shadow-2xl text-white">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-450 opacity-20 blur-xl"></div>
        <div className="flex justify-between items-center">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-md text-white">
            العمر: {kid.age} سنوات
          </span>
          <h2 className="text-xl font-black text-white">لوحة تحكم {kid.name} 👦</h2>
        </div>
      </div>

      {/* Grid of 6 Glassmorphism Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1: القرية (Preview Castle) */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🏰</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">قلعتك الافتراضية</h4>
              <span className="text-base">🏰</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2.5 py-0.5 rounded-full font-bold ${isThriving ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {isThriving ? 'مزدهرة ✨' : 'بسيطة 🛖'}
              </span>
              <span className="font-extrabold text-white">{isThriving ? 'Thriving Castle 🏰' : 'Basic Castle 🛖'}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isThriving
                ? 'قلعتك مزدهرة وتنبض بالحياة لأنك ادخرت أكثر من 50% من مصروفك!'
                : 'قلعتك بحاجة لادخار المزيد من مصروفك لتنمو وتتحول إلى قلعة ذهبية!'}
            </p>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-slate-800/60 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${isThriving ? 'from-emerald-500 to-teal-400' : 'from-amber-600 to-amber-450'}`}
                style={{ width: `${savingPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: الحصالة (Savings) */}
        <Link to="/kid/savings" className="block relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-orange-500/30 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">💰</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">الحصالة الذكية</h4>
              <span className="text-base">💰</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">مدخراتك الحالية</span>
              <span className="text-3xl font-extrabold text-white block mt-0.5">
                {kid.saved} <span className="text-sm font-bold text-orange-400">ريال</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-[10px] pt-1">
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block">المصروف الأسبوعي</span>
                <span className="font-bold text-white mt-1 block">{kid.allowance} ريال</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block">نسبة الادخار</span>
                <span className="font-bold text-white mt-1 block">{savingPercentage}%</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Card 3: الاستثمار العائلي */}
        <Link to="/kid/investments" className="block relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-orange-500/30 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">📈</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">الاستثمار العائلي</h4>
              <span className="text-base">📈</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ساهم في تمويل مشاريع العائلة واربح عوائد استثمارية إضافية! ادخل هنا للمشاركة بمدخراتك.
            </p>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
              <span className="font-extrabold text-orange-400">{projects.length} مشاريع</span>
              <span className="text-slate-400">المشاريع النشطة:</span>
            </div>
          </div>
        </Link>

        {/* Card 4: التبرع */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🤲</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-emerald-400">التبرع والمسؤولية</h4>
              <span className="text-base">💚</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              اكتسب نقاط تبرع مجتمعية وشارك في تمويل المشاريع الخيرية المعتمدة لعائلتك.
            </p>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
              <div className="text-left">
                <span className="font-extrabold text-white text-lg">{kid.donationPoints}</span>
                <span className="text-[10px] text-emerald-400 block">ريال متبرع به</span>
              </div>
              <span className="text-slate-400 font-bold text-[11px]">مساهماتك الخيرية:</span>
            </div>
          </div>

          <button
            disabled={kid.balance < 10}
            onClick={() => {
              if (kid.balance < 10) {
                alert('عذراً، رصيدك غير كافي للتبرع! 😔');
                return;
              }
              addDonation(kid.id, 10);
              alert('شكراً لتبرعك بـ 10 ريال لخدمة المجتمع! 💚🤲');
            }}
            className={`w-full mt-4 bg-gradient-to-r text-white font-extrabold py-2.5 rounded-xl text-xs shadow-lg transition-all transform flex items-center justify-center gap-1 ${
              kid.balance < 10
                ? 'from-slate-600 to-slate-700 opacity-40 cursor-not-allowed active:scale-100'
                : 'from-[#8c7355] to-[#009639] hover:from-[#9c8466] hover:to-[#00a840] active:scale-95'
            }`}
          >
            <span>{kid.balance < 10 ? 'الرصيد غير كافٍ 🚫' : 'تبرع بـ 10 ريال 🤲'}</span>
          </button>
        </div>

        {/* Card 5: نقاط دوري العائلة (Hidden/Blind state) */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300 group">
          {/* Blurred Locked Overlay to act as blind/hidden state */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-4">
            <span className="text-2xl mb-1">🔒</span>
            <span className="text-xs font-bold text-white">قريباً: دوري نماء العائلي</span>
            <span className="text-[9px] text-slate-400 mt-1">قارن تقدمك ونقاط التوفير مع عائلتك وأصدقائك!</span>
          </div>

          <div className="space-y-3 opacity-30 select-none pointer-events-none">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">نقاط دوري العائلة</h4>
              <span className="text-base">🏆</span>
            </div>
            <p className="text-xs leading-relaxed">
              ترتيبك الحالي ونقاط المنافسة مع بقية عوائل نماء.
            </p>
          </div>
        </div>

        {/* Card 6: المهام */}
        <Link to="/kid/tasks" className="block relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-orange-500/30 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🧹</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">المهام والمسؤوليات</h4>
              <span className="text-base">🧹</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pt-1 text-xs">
              {kid.tasks && kid.tasks.length > 0 ? (
                kid.tasks.map((task) => (
                  <div key={task.id} className="p-2 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center text-[10px]">
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md font-bold">قيد التنفيذ</span>
                    <span className="font-bold text-white">{task.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-400 text-center py-4">لا توجد مهام نشطة حالياً. حافظ على نشاطك! ✨</p>
              )}
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
