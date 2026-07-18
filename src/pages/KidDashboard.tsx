import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DynamicCarousel from '../components/ui/DynamicCarousel';
import { donationCauses } from '../data/mockData';

export default function KidDashboard() {
  const { kids, profile, projects, simulateDailyPurchase, activeLeague } = useApp();
  const [toast, setToast] = useState<string | null>(null);

  // Pay modal states
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseReason, setPurchaseReason] = useState('');
  const [payError, setPayError] = useState('');

  useEffect(() => {
    const REMINDER_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours

    // Trigger immediately after 5 seconds for demonstration purposes
    const demoTimeout = setTimeout(() => {
      setToast('تذكير: هل تفكر في التبرع اليوم لمساعدة الآخرين؟ 💚');
    }, 5000);

    const interval = setInterval(() => {
      setToast('تذكير: هل تفكر في التبرع اليوم لمساعدة الآخرين؟ 💚');
    }, REMINDER_INTERVAL);

    return () => {
      clearTimeout(demoTimeout);
      clearInterval(interval);
    };
  }, []);

  const kid = kids.find(k => k.name === profile?.name) || kids.find(k => k.name === 'سالم') || kids[0];
  const totalTarget = (kid.savingsGoals || []).reduce((sum, g) => sum + g.targetAmount, 0);
  const progressPercentage = totalTarget > 0 ? Math.min(100, Math.round((kid.saved / totalTarget) * 100)) : 0;
  const isThriving = kid.saved > 0;

  // Compute dynamic badges
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const filteredTransactions = (kid.transactions || []).filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
  });

  const monthSavings = filteredTransactions
    .filter(tx => tx.type === 'withdrawal' && (tx.title.includes('إيداع في حصالة') || tx.title.includes('حصالة')))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const approvedCount = (kid.tasks || []).filter(t => t.status === 'approved').length;
  const donated = (kid.transactions || []).some(tx => tx.title.includes('تبرع'));

  const dynamicBadges: string[] = [];
  if (monthSavings > 0) dynamicBadges.push('🏆 بطل التوفير');
  if (approvedCount > 2) dynamicBadges.push('🎯 المنجز');
  if (donated) dynamicBadges.push('💚 المعطاء');
  if (dynamicBadges.length === 0) dynamicBadges.push('🌱 بداية واعدة');

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(purchaseAmount);
    if (!purchaseAmount || isNaN(amount) || amount <= 0) {
      setPayError('الرجاء إدخال مبلغ صحيح!');
      return;
    }
    if (amount > kid.balance) {
      setPayError('عذراً، رصيدك المتاح لا يكفي لإتمام هذه العملية!');
      return;
    }
    if (!purchaseReason.trim()) {
      setPayError('الرجاء كتابة سبب أو مكان الشراء!');
      return;
    }
    setPayError('');
    try {
      await simulateDailyPurchase(kid.name, amount, purchaseReason.trim());
      setIsPayModalOpen(false);
      setPurchaseAmount('');
      setPurchaseReason('');
    } catch (err) {
      console.error(err);
      setPayError('حدث خطأ أثناء إتمام عملية الشراء.');
    }
  };

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header Profile Summary */}
      <div className="relative overflow-hidden bg-gradient-to-l from-[#C66E4E] to-[#8B84D7] px-6 py-8 rounded-[28px] border border-white/10 shadow-lg text-white">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 opacity-20 blur-xl"></div>
        <div className="flex justify-between items-center flex-wrap gap-3">
          {/* Left section: Age, Balance, Pay button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPayModalOpen(true)}
              className="relative z-10 cursor-pointer rounded-xl bg-white text-[#0C2341] hover:bg-white/90 px-3.5 py-2 text-xs font-black transition-all border border-white/10 shadow-md active:scale-95 flex items-center gap-1 font-sans"
            >
              <span>دفع 🛒</span>
            </button>
            <span className="rounded-full bg-white/20 border border-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-md text-white font-sans">
              الرصيد: {kid.balance} ريال 💳
            </span>
            <span className="rounded-full bg-white/20 border border-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md text-white">
              العمر: {kid.age} سنوات
            </span>
          </div>
          <div className="flex flex-col items-end">
            <h2 className="text-xl font-black text-white">لوحة تحكم {kid.name}</h2>
            
            {/* Badges list */}
            <div className="flex flex-wrap gap-1.5 justify-end mt-1.5">
              {kid.is_league_winner && (
                <span className="bg-yellow-500/25 border border-yellow-500/40 text-yellow-300 rounded-full px-2.5 py-0.5 text-[9px] font-black flex items-center gap-1 animate-pulse">
                  <span>🏆</span>
                  <span>بطل دوري العائلة الحالي</span>
                </span>
              )}
              {dynamicBadges.map((badge, index) => (
                <span
                  key={index}
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/15 border border-white/10 text-white"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Allowance Card */}
      {activeLeague?.isActive && (
        <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-5 text-right flex flex-row-reverse justify-between items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#C66E4E]/5 blur-2xl"></div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <span className="text-sm font-black text-[#0C2341]">المتبقي من مصروف الدوري:</span>
          </div>
          <span className="text-lg font-black text-[#C66E4E] font-sans">
            {(() => {
              const baseAllowance = Number(activeLeague.allowances?.[kid.id] || activeLeague.allowances?.[kid.name] || 0);
              const leagueWithdrawals = (kid.transactions || []).filter(tx => {
                const txTime = new Date(tx.date).getTime();
                const startTime = new Date(activeLeague.startDate!).getTime();
                return txTime >= startTime && tx.type === 'withdrawal';
              }).reduce((sum, tx) => sum + tx.amount, 0);
              return Math.max(0, baseAllowance - leagueWithdrawals);
            })()} ريال 💳
          </span>
        </div>
      )}

      {/* Grid of 6 Glassmorphism Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1: القرية (Preview Castle) */}
        <Link to="/kid/castle" className="block relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-[#8B84D7]/50 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">🏰</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 border-b border-[#0C2341]/5 pb-2">
              <h4 className="text-sm font-bold text-[#0C2341]">قلعتك الافتراضية</h4>
              <span className="text-base">🏰</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2.5 py-0.5 rounded-full font-bold ${isThriving ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/25' : 'bg-amber-500/10 text-amber-600 border border-amber-500/25'}`}>
                {isThriving ? 'مزدهرة ✨' : 'بسيطة 🛖'}
              </span>
              <span className="font-extrabold text-[#0C2341]">{isThriving ? 'Thriving Castle 🏰' : 'Basic Castle 🛖'}</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {isThriving
                ? 'قلعتك مزدهرة وتنبض بالحياة لأنك قمت بادخار مبالغ رائعة في حصالتك! ✨'
                : 'قلعتك بحاجة لادخار المزيد من المبالغ في حصالتك لتنمو وتتحول إلى قلعة ذهبية! 🏰'}
            </p>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${isThriving ? 'from-emerald-500 to-teal-400' : 'from-amber-600 to-amber-500'}`}
                style={{ width: `${progressPercentage || (kid.saved > 0 ? 100 : 0)}%` }}
              ></div>
            </div>
          </div>
        </Link>

        {/* Card 2: الحصالة (Savings) */}
        <Link to="/kid/savings" className="block relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-[#8B84D7]/50 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">💰</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 border-b border-[#0C2341]/5 pb-2">
              <h4 className="text-sm font-bold text-[#0C2341]">الحصالة الذكية</h4>
              <span className="text-base">💰</span>
            </div>

            <div className="text-right pb-2">
              <span className="text-[10px] text-slate-500 block">إجمالي المدخرات الحالية</span>
              <span className="text-3xl font-extrabold text-[#0C2341] block mt-0.5">
                {kid.saved} <span className="text-sm font-bold text-[#C66E4E]">ريال</span>
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3: الاستثمار العائلي */}
        <Link to="/kid/investments" className="block relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-[#8B84D7]/50 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">📈</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-end gap-2 border-b border-[#0C2341]/5 pb-2">
              <h4 className="text-sm font-bold text-[#0C2341]">الاستثمار العائلي</h4>
              <span className="text-base">📈</span>
            </div>

            <DynamicCarousel
              items={projects}
              renderItem={(project) => {
                const percentage = Math.min(Math.round((project.currentInvested / project.totalRequired) * 100), 100);
                return (
                  <div className="w-full text-right space-y-2 px-1">
                    <h5 className="font-bold text-xs text-[#0C2341]">{project.title}</h5>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans">
                      <span>{percentage}% مكتمل</span>
                      <span>ROI: {project.roiPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-[#C66E4E] to-[#8B84D7]"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </Link>

        {/* Card 4: التبرع */}
        <Link to="/kid/donations" className="block relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-[#8B84D7]/50 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">🤲</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-end gap-2 border-b border-[#0C2341]/5 pb-2">
              <h4 className="text-sm font-bold text-emerald-600">التبرع والمسؤولية</h4>
              <span className="text-base">💚</span>
            </div>

            <DynamicCarousel
              items={donationCauses}
              renderItem={(cause) => (
                <div className="w-full text-center py-2 space-y-1">
                  <h5 className="font-bold text-xs text-[#0C2341]">{cause.title}</h5>
                  <p className="text-[10px] text-[#8B84D7] font-semibold">اضغط للمساهمة والتبرع 🤲</p>
                </div>
              )}
            />
          </div>
        </Link>

        {/* Card 5: نقاط دوري العائلة */}
        <Link to="/kid/league" className="block relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-[#8B84D7]/50 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">🏆</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-end gap-2 border-b border-[#0C2341]/5 pb-2">
              <h4 className="text-sm font-bold text-[#0C2341]">دوري العائلة المشترك</h4>
              <span className="text-base">🏆</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              تابع ترتيبك بين الأبناء ونقاطك التنافسية هذا الشهر للتفوق وإحراز الجائزة الكبرى!
            </p>
          </div>
        </Link>

        {/* Card 6: المهام */}
        <Link to="/kid/tasks" className="block relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-[#8B84D7]/50 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">🧹</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-end gap-2 border-b border-[#0C2341]/5 pb-2">
              <h4 className="text-sm font-bold text-[#0C2341]">المهام والمسؤوليات</h4>
              <span className="text-base">🧹</span>
            </div>

            <DynamicCarousel
              items={[...(kid.tasks || [])].sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
              })}
              renderItem={(task) => (
                <div className="w-full text-right px-1 flex justify-between items-center text-xs">
                  <span className={`text-[9px] px-2 py-0.5 rounded-md ${
                    task.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/25'
                      : task.status === 'under_review'
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/25 animate-pulse'
                        : 'bg-[#C66E4E]/10 text-[#C66E4E] border border-[#C66E4E]/25'
                  }`}>
                    {task.status === 'approved' ? 'مكتملة ✅' : task.status === 'under_review' ? 'قيد المراجعة ⏳' : 'قيد التنفيذ 🧹'}
                  </span>
                  <span className="font-bold text-[#0C2341] text-[11px]">{task.title}</span>
                </div>
              )}
            />
          </div>
        </Link>

        {/* Card 7: متجر المكافآت */}
        <Link to="/kid/rewards" className="block relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-[#8B84D7]/50 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">🎁</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-end gap-2 border-b border-[#0C2341]/5 pb-2">
              <h4 className="text-sm font-bold text-purple-600">متجر المكافآت والشركاء</h4>
              <span className="text-base">🎁</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="bg-purple-100/60 border border-purple-200/50 text-purple-700 font-bold px-2 py-0.5 rounded-full text-[9px] font-sans">
                {kid.donationPoints || 0} نقطة متوفرة 🌟
              </span>
              <span className="font-extrabold text-[#0C2341]">Alinma Store 🏦</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              استبدل نقاطك بقسائم مجانية وأكواد خصم حقيقية من سوني وجرير!
            </p>
          </div>
        </Link>

      </div>

      {toast && (
        <div className="fixed bottom-6 left-6 z-[100] max-w-sm bg-white border border-emerald-500/20 shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-fade-in text-right text-[#0C2341]">
          <div className="flex-1 space-y-1">
            <h5 className="text-xs font-black text-emerald-600">تذكير المسؤولية المجتمعية 💚</h5>
            <p className="text-xs text-slate-650 leading-relaxed font-sans">{toast}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-500 hover:text-amad-text text-xs font-bold px-2.5 py-1.5 rounded-xl bg-[#0C2341]/5 border border-[#0C2341]/10 transition-colors shrink-0 cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* DAILY PURCHASE MODAL */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#0C2341]/40 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#0C2341]/10 shadow-2xl rounded-[28px] p-6 text-right font-sans overflow-hidden text-[#0C2341]">
            <div className="flex justify-between items-center border-b border-[#0C2341]/5 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-[#0C2341] text-lg font-bold transition-colors p-1"
              >
                ✕
              </button>
              <h3 className="text-sm font-black text-[#0C2341] flex items-center gap-1.5">
                <span>محاكاة عملية دفع يومية 🛒</span>
              </h3>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              {payError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold font-sans">
                  ⚠️ {payError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">المبلغ المطلوب (ريال)</label>
                <input
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-2xl px-4 py-2.5 text-xs text-[#0C2341] text-right font-sans focus:outline-none focus:border-[#C66E4E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">سبب أو تفاصيل الشراء</label>
                <input
                  type="text"
                  value={purchaseReason}
                  onChange={(e) => setPurchaseReason(e.target.value)}
                  placeholder="مثال: بقالة، مطعم، ألعاب"
                  className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-2xl px-4 py-2.5 text-xs text-[#0C2341] text-right focus:outline-none focus:border-[#C66E4E]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#0C2341]/5 mt-4">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-5 py-2 border border-[#0C2341]/10 text-[#0C2341] rounded-xl text-xs font-bold bg-[#0C2341]/5 hover:bg-[#0C2341]/10 transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0C2341] hover:bg-[#8B84D7] text-white rounded-xl text-xs font-black transition-all active:scale-95 shadow-md"
                >
                  تأكيد الدفع 🛒
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
