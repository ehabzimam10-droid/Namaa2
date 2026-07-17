import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidLeaguePage() {
  const navigate = useNavigate();
  const { kids, profile, activeLeague, calculateKidScores } = useApp();

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

  const activeKid = kids.find(k => k.name === profile?.name) || kids.find(k => k.name === 'سالم') || kids[0];

  // Compile leaderboard comparing Khalid and Salem
  const compiledList = kids.map(k => ({
    kid: k,
    scores: calculateKidScores(k),
  })).sort((a, b) => b.scores.totalPoints - a.scores.totalPoints);

  const ourRank = compiledList.findIndex(item => item.kid.id === activeKid.id) + 1;
  const ourScores = calculateKidScores(activeKid);
  const isFirst = ourRank === 1;

  // Find sibling above us
  const siblingAbove = ourRank > 1 ? compiledList[ourRank - 2] : null;
  const pointsBehind = siblingAbove ? (siblingAbove.scores.totalPoints - ourScores.totalPoints) : 0;

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
            <h2 className="text-xs font-semibold text-[#C66E4E]">تحدي التوفير والمسؤولية بين الإخوة</h2>
            <h3 className="text-2xl font-black text-[#0C2341] mt-1">دوري العائلة المشترك 🏆</h3>
          </div>
        </div>
      </div>

      {(() => {
        const isLeagueEndedRecent = !activeLeague.isActive && activeLeague.endDate &&
          (new Date().getTime() - new Date(activeLeague.endDate).getTime()) < 24 * 60 * 60 * 1000;

        if (!activeLeague.isActive && isLeagueEndedRecent) {
          return (
            <div className="space-y-6">
              {/* Festive Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0C2341] to-indigo-950 border border-orange-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
                <div className="absolute -left-12 -top-12 text-8xl opacity-15">🏆</div>
                <div className="absolute -right-12 -bottom-12 text-8xl opacity-15">🎉</div>

                <span className="text-5xl block animate-bounce">🏆🎉👑</span>
                <h2 className="text-xl font-black text-white">إعلان نتائج الدوري العائلي الكبرى 🏆🎉</h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  تهانينا للجميع! لقد انتهت جولات الدوري بنجاح. إليكم نتائج تقييم أبطال نماء الماليين!
                </p>

                <div className="bg-orange-500/10 border border-orange-500/20 max-w-sm mx-auto p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">الجائزة الكبرى للدوري:</span>
                  <span className="text-lg font-black text-orange-400">{activeLeague.prize} 🎁</span>
                </div>
              </div>

              {/* Winner announcement card */}
              {compiledList.length > 0 && (() => {
                const maxPoints = compiledList[0].scores.totalPoints;
                const winners = compiledList.filter(item => item.scores.totalPoints === maxPoints);
                const isTie = winners.length > 1;
                const winnerNames = winners.map(w => w.kid.name).join(' و');

                return (
                  <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-center space-y-4 relative overflow-hidden text-[#0C2341]">
                    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#C66E4E]/5 blur-2xl"></div>
                    
                    <div className="inline-flex flex-col items-center">
                      <span className="text-5xl mb-2 animate-bounce">👑</span>
                      <span className="text-sm font-semibold text-slate-500">
                        {isTie ? 'أبطال دوري العائلة المشتركون:' : 'بطل دوري العائلة المالي:'}
                      </span>
                      <span className="text-2xl font-black text-yellow-600 mt-1">
                        {isTie ? `أبطال دوري العائلة: ${winnerNames} 👑🏆` : `${compiledList[0].kid.name} 👑`}
                      </span>
                      <span className="text-xs text-[#0C2341] mt-1 font-sans font-bold">بمجموع نقاط {maxPoints} نقطة 🌟</span>
                    </div>
                  </div>
                );
              })()}

              {/* Final leaderboard list */}
              <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-right space-y-4 text-[#0C2341]">
                <h4 className="text-xs font-bold text-[#C66E4E] border-b border-[#0C2341]/5 pb-2">جدول الترتيب النهائي للأبناء 📊</h4>
                <div className="space-y-3">
                  {compiledList.map((item, idx) => {
                    const isWinner = idx === 0;
                    const isOurProfile = item.kid.id === activeKid.id;
                    return (
                      <div
                        key={item.kid.id}
                        className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${isWinner
                            ? 'bg-yellow-500/10 border-yellow-500/25 shadow-md scale-[1.01]'
                            : isOurProfile
                              ? 'bg-orange-500/10 border-orange-500/25'
                              : 'bg-[#0C2341]/5 border-[#0C2341]/10'
                          }`}
                      >
                        <div className="flex items-center gap-1 font-sans font-black text-xs text-[#0C2341]">
                          <span className="text-[#C66E4E]">{item.scores.totalPoints}</span>
                          <span className="text-[9px] text-slate-500 font-bold">نقطة</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="text-right">
                            <h5 className="font-extrabold text-xs text-[#0C2341] flex items-center justify-end gap-1.5 font-sans">
                              {item.kid.name} {isWinner && '👑'}
                              {isOurProfile && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-600">أنت</span>}
                            </h5>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#0C2341]/5 flex items-center justify-center font-sans font-black text-xs text-[#C66E4E]">
                            {idx + 1}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed breakdown of all kids' categories */}
              <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-right space-y-4 text-[#0C2341]">
                <h4 className="text-xs font-bold text-[#C66E4E] border-b border-[#0C2341]/5 pb-2">تحليل أداء الأداء المالي للأبناء 📊</h4>
                <div className="space-y-6">
                  {compiledList.map((item) => (
                    <div key={item.kid.id} className="bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-2xl p-4 space-y-3">
                      <span className="font-extrabold text-xs text-[#0C2341] block">الابن: {item.kid.name} 👦</span>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-[10px] font-sans font-bold">
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500">الادخار (50)</span>
                          <span className="font-extrabold text-[#0C2341]">{item.scores.savingsScore}/50</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500">الاستثمار (50)</span>
                          <span className="font-extrabold text-[#0C2341]">{item.scores.investmentScore}/50</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500">التبرع (50)</span>
                          <span className="font-extrabold text-[#0C2341]">{item.scores.donationScore}/50</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500">المهام (100)</span>
                          <span className="font-extrabold text-[#0C2341]">{item.scores.tasksScore}/100</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500">إدارة المصروف (100)</span>
                          <span className="font-extrabold text-[#0C2341]">{item.scores.spendingScore}/100</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (!activeLeague.isActive) {
          return (
            <div className="bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-8 text-center space-y-4 text-[#0C2341]">
              <span className="text-4xl block">⏳🏆</span>
              <h4 className="text-sm font-extrabold text-[#0C2341]">لا يوجد دوري نشط حالياً</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-bold">
                اطلب من والدك بدء الدوري وتوزيع المصروف الشهري لتنطلق المنافسة الكبرى وتحصيل الجوائز! 🎁✨
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {/* Motivation Progress Card */}
            <div className="relative overflow-hidden bg-[#C66E4E]/10 border border-[#C66E4E]/25 rounded-3xl p-6 text-right space-y-3 text-[#0C2341]">
              <div className="absolute -left-6 -top-6 text-7xl opacity-10">🚀</div>
              <h4 className="text-xs font-bold text-[#C66E4E]">وضعك الحالي في التحدي 📊</h4>

              <div className="flex flex-row-reverse items-center justify-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C66E4E]/10 border border-[#C66E4E]/25 flex items-center justify-center font-sans font-black text-lg text-[#C66E4E]">
                  {ourRank === 1 ? '🥇' : ourRank === 2 ? '🥈' : ourRank === 3 ? '🥉' : ourRank}
                </div>
                <div className="space-y-1">
                  <span className="text-xl font-black text-[#0C2341] font-sans">{ourScores.totalPoints}</span>
                  <span className="text-slate-500 text-[10px] mr-1 font-bold">نقطة مسجلة</span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-[#0C2341] font-bold pt-2 border-t border-[#0C2341]/10 font-sans">
                {isFirst ? (
                  <span>أنت في المركز الأول 🥇! حافظ على الصدارة بمواصلة الادخار والمواظبة! 👑✨</span>
                ) : siblingAbove ? (
                  <span>{siblingAbove.kid.name} يسبقك بـ {pointsBehind} نقطة! ضاعف جهودك في المهام والادخار لتجاوزه! 🔥🚀</span>
                ) : (
                  <span>بطل نماء! زد من مدخراتك وأنجز مهامك لتسلق الترتيب بسرعة! 🌟</span>
                )}
              </p>

              <div className="text-[10px] text-slate-500 pt-1 font-bold">
                الجائزة الكبرى للدوري: <strong className="text-[#C66E4E]">{activeLeague.prize} 🎁</strong>
              </div>
              {countdownText && (
                <div className="text-[10px] text-[#C66E4E] font-bold font-sans pt-1.5 border-t border-[#0C2341]/10 mt-2">
                  الوقت المتبقي: {countdownText}
                </div>
              )}
            </div>

            {/* Sibling Leaderboard comparison */}
            <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-6 text-right space-y-4 text-[#0C2341]">
              <h4 className="text-xs font-bold text-[#C66E4E] border-b border-[#0C2341]/5 pb-2">جدول الترتيب الحالي للأبناء 📊</h4>
              <div className="space-y-3">
                {compiledList.map((item, idx) => {
                  const isOurFamily = item.kid.id === activeKid.id;
                  const rankEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '';
                  return (
                    <div
                      key={item.kid.id}
                      className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all duration-300 ${isOurFamily
                          ? 'bg-[#C66E4E]/10 border-[#C66E4E]/25 shadow-sm scale-[1.01]'
                          : 'bg-[#0C2341]/5 border-[#0C2341]/10 hover:bg-[#0C2341]/10'
                        }`}
                    >
                      {/* Left: Points */}
                      <div className="flex items-center gap-1 font-sans font-black text-xs text-[#0C2341]">
                        <span className="text-[#C66E4E]">{item.scores.totalPoints}</span>
                        <span className="text-[9px] text-slate-500 font-bold">نقطة</span>
                      </div>

                      {/* Right: Kid Name */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <h5 className="font-extrabold text-xs text-[#0C2341] flex items-center justify-end gap-1.5 font-sans">
                            {item.kid.name}
                            {isOurFamily && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-600">
                                أنت ✨
                              </span>
                            )}
                          </h5>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-[#0C2341]/5 border border-[#0C2341]/10 flex items-center justify-center font-sans font-black text-xs text-[#C66E4E]">
                          {rankEmoji || (idx + 1)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Breakdown Score Board */}
            <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-6 text-right space-y-4 text-[#0C2341]">
              <h4 className="text-xs font-bold text-[#C66E4E] border-b border-[#0C2341]/5 pb-2">تفصيل نقاطك الحالية 🎖️</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {/* Savings */}
                {activeLeague.bases.includes('الادخار') && (
                  <div className="bg-[#0C2341]/5 border border-[#0C2341]/10 p-4 rounded-2xl text-center space-y-1.5">
                    <span className="text-xs block font-bold text-[#0C2341]">الادخار 💰</span>
                    <span className="text-base font-black text-[#0C2341] font-sans">{ourScores.savingsScore}/50</span>
                    <p className="text-[9px] text-slate-500 font-bold">ادخرت {ourScores.savingsAmount} ريال هذا الشهر</p>
                  </div>
                )}
                {/* Investment */}
                {activeLeague.bases.includes('الاستثمار') && (
                  <div className="bg-[#0C2341]/5 border border-[#0C2341]/10 p-4 rounded-2xl text-center space-y-1.5">
                    <span className="text-xs block font-bold text-[#0C2341]">الاستثمار 📈</span>
                    <span className="text-base font-black text-[#0C2341] font-sans">{ourScores.investmentScore}/50</span>
                    <p className="text-[9px] text-slate-500 font-bold">استثمرت {ourScores.investmentAmount} ريال هذا الشهر</p>
                  </div>
                )}
                {/* Donation */}
                {activeLeague.bases.includes('التبرع') && (
                  <div className="bg-[#0C2341]/5 border border-[#0C2341]/10 p-4 rounded-2xl text-center space-y-1.5">
                    <span className="text-xs block font-bold text-[#0C2341]">التبرع 🤲</span>
                    <span className="text-base font-black text-[#0C2341] font-sans">{ourScores.donationScore}/50</span>
                    <p className="text-[9px] text-slate-500 font-bold">تبرعت بمبلغ {ourScores.donationAmount} ريال</p>
                  </div>
                )}
                {/* Tasks */}
                {activeLeague.bases.includes('إنجاز المهام') && (
                  <div className="bg-[#0C2341]/5 border border-[#0C2341]/10 p-4 rounded-2xl text-center space-y-1.5">
                    <span className="text-xs block font-bold text-[#0C2341]">المهام المنجزة 🧹</span>
                    <span className="text-base font-black text-[#0C2341] font-sans">{ourScores.tasksScore}/100</span>
                    <p className="text-[9px] text-slate-500 font-bold">أنجزت {ourScores.approvedTasks} مهام من أصل {ourScores.totalTasks}</p>
                  </div>
                )}
                {/* Spending Eval */}
                {activeLeague.bases.includes('إدارة المصروف') && (
                  <div className="bg-[#0C2341]/5 border border-[#0C2341]/10 p-4 rounded-2xl text-center space-y-1.5">
                    <span className="text-xs block font-bold text-[#0C2341]">إدارة المصروف 🛒</span>
                    <span className="text-base font-black text-[#0C2341] font-sans">{ourScores.spendingScore}/100</span>
                    <p className="text-[9px] text-slate-500 font-bold">صرفت {ourScores.spentAmount} ريال استهلاكياً</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
