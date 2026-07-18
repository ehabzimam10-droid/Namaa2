import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DynamicCarousel from '../components/ui/DynamicCarousel';

export default function FatherDashboard() {
  const { kids, projects, activeLeague } = useApp();

  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    if (!activeLeague || !activeLeague.isActive || !activeLeague.endDate) return;

    const updateTimer = () => {
      const target = new Date(activeLeague.endDate!).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdownText('انتهت مدة التحدي 🏁');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownText(`المتبقي: ${days} يوم، ${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeLeague]);

  // Calculate total family balance (sum of all kids' saved amounts)
  const totalBalance = kids.reduce((sum, kid) => sum + kid.saved, 0);

  // Find highest level across all kids' villages dynamically
  const highestLevel = Math.max(
    1,
    ...kids.flatMap((k) => [
      k.bank_level || 1,
      k.farm_level || 1,
      k.market_level || 1,
      k.tasks_level || 1
    ])
  );

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header Summary */}
      <div className="relative overflow-hidden bg-white border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] p-6 md:p-8">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C66E4E]/5 blur-2xl"></div>
        <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-xs font-semibold text-[#C66E4E]">لوحة تحكم ولي الأمر</h2>
            <h3 className="text-2xl font-black text-[#0C2341] mt-1 font-sans">الرئيسية</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-bold">إجمالي مدخرات الأبناء المشتركة</span>
            <span className="text-3xl font-extrabold text-[#0C2341] mt-1 font-sans">
              {totalBalance} <span className="text-base font-bold text-[#C66E4E]">ريال</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 5 Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: القرية الافتراضية */}
        <div className="relative overflow-hidden bg-white border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#8B84D7]/40 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">🏰</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 text-[#0C2341]">
              <h4 className="text-lg font-bold text-[#0C2341]">القرية الافتراضية</h4>
              <span className="text-xl">🏰</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-right">
              شاهد قلاع أطفالك الافتراضية وهي تنمو وتزدهر مع كل ريال يقومون بادخاره.
            </p>
            
            <div className="pt-2 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-[#0C2341]/5 p-3 rounded-2xl border border-[#0C2341]/5">
                <span className="text-slate-500 font-bold block">قلاع نشطة</span>
                <span className="text-sm font-extrabold text-[#C66E4E] mt-1 block">{kids.length} قلاع</span>
              </div>
              <div className="bg-[#0C2341]/5 p-3 rounded-2xl border border-[#0C2341]/5">
                <span className="text-slate-500 font-bold block">أعلى مستوى</span>
                <span className="text-sm font-extrabold text-emerald-600 mt-1 block">مستوى {highestLevel} 🌟</span>
              </div>
            </div>
          </div>
          <Link to="/father/village" className="w-full mt-4 bg-[#0C2341]/5 hover:bg-[#0C2341]/10 text-[#0C2341] font-bold py-2.5 rounded-xl text-xs border border-[#0C2341]/10 transition-all text-center block">
            استعراض القرية ➜
          </Link>
        </div>

        {/* Card 2: المستشار المالي الذكي */}
        <div className="relative overflow-hidden bg-white border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#C66E4E]/40 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">🤖</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 text-[#0C2341]">
              <h4 className="text-lg font-bold text-[#0C2341]">المستشار الذكي</h4>
              <span className="text-xl">🤖</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-right">
              استشارات وتوصيات ذكية مخصصة لمساعدتك في توجيه سلوك أبنائك المالي وغرس ثقافة الادخار.
            </p>
          </div>
          <Link to="/father/ai" className="w-full mt-4 bg-[#C66E4E]/10 hover:bg-[#C66E4E]/20 text-[#C66E4E] font-bold py-2.5 rounded-xl text-xs border border-[#C66E4E]/20 transition-all text-center block">
            المستشار الذكي والدردشة 🤖
          </Link>
        </div>

        {/* Card 3: إدارة الأبناء */}
        <Link to="/father/kids" className="md:col-span-2 block relative overflow-hidden bg-white border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] p-6 transition-all hover:scale-[1.01] hover:border-[#8B84D7]/40 duration-300 text-right">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">👦</div>
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between border-b border-[#0C2341]/5 pb-3">
              <span className="text-xs text-slate-500 font-bold">{kids.length} أبناء مسجلين</span>
              <div className="flex items-center gap-2 text-[#0C2341]">
                <h4 className="text-lg font-bold text-[#0C2341]">إدارة الأبناء</h4>
                <span className="text-xl">👥</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kids.map((kid) => (
                <div key={kid.id} className="bg-[#0C2341]/5 border border-[#0C2341]/5 p-4 rounded-2xl flex flex-col justify-between hover:bg-[#0C2341]/10 transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-[#0C2341]/5 pb-2 text-[#0C2341]">
                    <span className="text-xs font-bold text-slate-500">عمر {kid.age} سنة</span>
                    <span className="font-extrabold text-sm text-[#0C2341]">{kid.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-650 font-sans mt-3">
                    <span>المدخرات: {kid.saved} ريال</span>
                    <span>الرصيد المتاح: {kid.balance} ريال</span>
                  </div>

                  {activeLeague?.isActive && (
                    <div className="mt-3 bg-white border border-[#C66E4E]/20 rounded-xl px-3 py-1.5 text-center text-[10px] text-[#C66E4E] font-bold shadow-sm">
                      المتبقي من مصروف الدوري: {(() => {
                        const baseAllowance = Number(activeLeague.allowances?.[kid.id] || activeLeague.allowances?.[kid.name] || 0);
                        const leagueWithdrawals = (kid.transactions || []).filter(tx => {
                          const txTime = new Date(tx.date).getTime();
                          const startTime = new Date(activeLeague.startDate!).getTime();
                          return txTime >= startTime && tx.type === 'withdrawal';
                        }).reduce((sum, tx) => sum + tx.amount, 0);
                        return Math.max(0, baseAllowance - leagueWithdrawals);
                      })()} ريال 💳
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Card 4: المشاريع الاستثمارية العائلية */}
        <Link to="/father/projects" className="block relative overflow-hidden bg-white border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#8B84D7]/40 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">📈</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-between border-b border-[#0C2341]/5 pb-2">
              <span className="text-xs text-emerald-600 font-bold">{projects.length} مشاريع نشطة</span>
              <div className="flex items-center gap-2 text-[#0C2341]">
                <h4 className="text-lg font-bold text-[#0C2341]">المشاريع الاستثمارية</h4>
                <span className="text-xl">📈</span>
              </div>
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
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
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

        {/* Card 5: دوري العائلة */}
        <Link to="/father/league" className="relative overflow-hidden bg-white border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#8B84D7]/40 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-5">🏆</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 text-[#0C2341]">
              <h4 className="text-lg font-bold text-[#0C2341]">دوري العائلة</h4>
              <span className="text-xl">🏆</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-right">
              تحدي وتنافس مالي وتربوي إيجابي بين الأبناء (خالد وسالم) لتعزيز ثقافة الادخار والاستثمار الذكي.
            </p>
            
            <div className="bg-[#0C2341]/5 p-3 rounded-2xl border border-[#0C2341]/5 flex flex-col gap-1.5 text-xs font-sans text-[#0C2341]">
              <div className="flex justify-between items-center w-full">
                <span className={activeLeague?.isActive ? "text-emerald-600 font-extrabold" : "text-[#C66E4E] font-extrabold"}>
                  {activeLeague?.isActive ? "دوري نشط حالياً 🔥" : "ابدأ تحدي جديد الآن 🎯"}
                </span>
                <span className="text-slate-500 font-bold">حالة التحدي:</span>
              </div>
              {activeLeague?.isActive && countdownText && (
                <div className="flex justify-between items-center w-full border-t border-[#0C2341]/5 pt-1.5 font-sans">
                  <span className="text-[#C66E4E] font-bold">{countdownText}</span>
                  <span className="text-slate-500 text-[10px] font-bold">الوقت المتبقي:</span>
                </div>
              )}
            </div>
          </div>
          <button className="w-full mt-4 bg-[#0C2341]/5 hover:bg-[#0C2341]/10 text-[#0C2341] font-bold py-2.5 rounded-xl text-xs border border-[#0C2341]/10 transition-all">
            استعراض الدوري 🏆
          </button>
        </Link>

      </div>
    </div>
  );
}
