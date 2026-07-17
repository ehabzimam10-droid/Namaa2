import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { evaluateKidsSpending } from '../utils/aiService';
import { supabase } from '../utils/supabaseClient';

export default function FatherLeaguePage() {
  const navigate = useNavigate();
  const { kids, activeLeague, startFamilyLeague, endFamilyLeague, calculateKidScores, geminiApiKey } = useApp();

  // Form states
  const [selectedBases, setSelectedBases] = useState<string[]>([
    'الادخار', 'الاستثمار', 'التبرع', 'إنجاز المهام', 'إدارة المصروف'
  ]);
  const [prize, setPrize] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allowances, setAllowances] = useState<Record<string, number>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showAiEvaluation, setShowAiEvaluation] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiEvaluations, setAiEvaluations] = useState<any[]>([]);
  const [customScores, setCustomScores] = useState<Record<string, number>>({});
  const [countdownText, setCountdownText] = useState('');
  const [pastLeagues, setPastLeagues] = useState<any[]>([]);
  const [selectedPastLeague, setSelectedPastLeague] = useState<any | null>(null);
  const [forceShowCreateForm, setForceShowCreateForm] = useState(false);

  useEffect(() => {
    if (activeLeague && activeLeague.isActive) {
      setForceShowCreateForm(false);
    }
  }, [activeLeague]);

  useEffect(() => {
    const fetchPastLeagues = async () => {
      try {
        const { data, error } = await supabase
          .from('family_leagues')
          .select('*')
          .eq('is_active', false)
          .order('end_date', { ascending: false });
        if (!error && data) {
          setPastLeagues(data);
        }
      } catch (err) {
        console.error('Failed to fetch past leagues:', err);
      }
    };
    fetchPastLeagues();
  }, [activeLeague]);

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

  useEffect(() => {
    if (kids.length > 0 && Object.keys(allowances).length === 0) {
      const initial: Record<string, number> = {};
      kids.forEach(k => {
        initial[k.id] = k.allowance || 100;
      });
      setAllowances(initial);
    }
  }, [kids, allowances]);

  const toggleBase = (base: string) => {
    if (selectedBases.includes(base)) {
      setSelectedBases(selectedBases.filter(b => b !== base));
    } else {
      setSelectedBases([...selectedBases, base]);
    }
  };

  const handleStartLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prize.trim()) {
      setErrorMsg('الرجاء إدخال الجائزة لتحفيز الأبناء!');
      return;
    }
    if (selectedBases.length === 0) {
      setErrorMsg('الرجاء اختيار معيار واحد على الأقل للدوري!');
      return;
    }
    if (!endDate) {
      setErrorMsg('الرجاء تحديد تاريخ نهاية التحدي!');
      return;
    }

    const today = new Date();
    const selectedEndDate = new Date(endDate);
    const diffTime = selectedEndDate.getTime() - today.getTime();
    const diffMinutes = diffTime / (1000 * 60);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffMinutes < 1 || diffDays > 30.1) {
      setErrorMsg('يجب أن تكون مدة التحدي دقيقة واحدة على الأقل و 30 يوماً كحد أقصى!');
      return;
    }

    const isoEndDate = selectedEndDate.toISOString();
    setErrorMsg('');
    try {
      await startFamilyLeague(prize, selectedBases, isoEndDate, allowances);
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء بدء الدوري.');
    }
  };

  const handleEndLeague = () => {
    setShowEndConfirm(true);
  };

  const handleTriggerAiEvaluation = async () => {
    setShowAiEvaluation(true);
    setIsAiLoading(true);
    try {
      const result = await evaluateKidsSpending(geminiApiKey, kids, activeLeague.startDate, activeLeague.endDate);
      setAiEvaluations(result);
      const scoresRecord: Record<string, number> = {};
      result.forEach(item => {
        const kidObj = kids.find(k => k.name === item.kidName);
        const kidKey = kidObj ? kidObj.id : item.kidName;
        scoresRecord[kidKey] = item.suggestedScore;
      });
      setCustomScores(scoresRecord);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Compile leaderboard
  const leaderboard = kids.map(k => ({
    kid: k,
    scores: calculateKidScores(k),
  })).sort((a, b) => b.scores.totalPoints - a.scores.totalPoints);

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header with Back Button */}
      <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C66E4E]/5 blur-2xl"></div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/father')}
            className="rounded-xl bg-[#0C2341]/5 hover:bg-[#0C2341]/10 px-3 py-2 text-xs font-bold text-slate-600 transition-all border border-[#0C2341]/10"
          >
            👨‍💼 العودة للوحة التحكم
          </button>
          <div>
            <h2 className="text-xs font-semibold text-[#C66E4E]">تحدي الثقافة المالية والتوفير الداخلي</h2>
            <h3 className="text-2xl font-black text-[#0C2341] mt-1">دوري الأبناء الداخلي 🏆</h3>
          </div>
        </div>
      </div>

      {(() => {
        const isLeagueEndedRecent = !activeLeague.isActive && activeLeague.endDate &&
          (new Date().getTime() - new Date(activeLeague.endDate).getTime()) < 24 * 60 * 60 * 1000;

        if (!activeLeague.isActive && isLeagueEndedRecent && !forceShowCreateForm) {
          return (
            <div className="space-y-6">
              {/* Festive Banner */}
              <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
                <div className="absolute -left-12 -top-12 text-8xl opacity-5">🏆</div>
                <div className="absolute -right-12 -bottom-12 text-8xl opacity-5">🎉</div>
                
                <span className="text-5xl block animate-bounce">🏆🎉👑</span>
                <h2 className="text-xl font-black text-[#0C2341]">إعلان نتائج الدوري العائلي الكبرى 🏆🎉</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  تهانينا للجميع! لقد انتهت جولات الدوري بنجاح. إليكم نتائج تقييم أبطال نماء الماليين!
                </p>

                <div className="bg-[#C66E4E]/10 border border-[#C66E4E]/20 max-w-sm mx-auto p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block mb-1">الجائزة الكبرى للدوري:</span>
                  <span className="text-lg font-black text-[#C66E4E]">{activeLeague.prize} 🎁</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setForceShowCreateForm(true)}
                    className="px-6 py-3 bg-[#C66E4E] hover:bg-[#C66E4E]/90 text-white font-extrabold rounded-2xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mx-auto font-sans"
                  >
                    <span>بدء تحدي جديد 🎯</span>
                  </button>
                </div>
              </div>

              {/* Winner announcement card */}
              {leaderboard.length > 0 && (() => {
                const maxPoints = leaderboard[0].scores.totalPoints;
                const winners = leaderboard.filter(item => item.scores.totalPoints === maxPoints);
                const isTie = winners.length > 1;
                const winnerNames = winners.map(w => w.kid.name).join(' و');

                return (
                  <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-center space-y-4 relative overflow-hidden shadow-sm">
                    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-yellow-500/5 blur-2xl"></div>
                    
                    <div className="inline-flex flex-col items-center">
                      <span className="text-5xl mb-2 animate-bounce">👑</span>
                      <span className="text-sm font-semibold text-slate-500">
                        {isTie ? 'أبطال دوري العائلة المشتركون:' : 'بطل دوري العائلة المالي:'}
                      </span>
                      <span className="text-2xl font-black text-amber-600 mt-1">
                        {isTie ? `أبطال دوري العائلة: ${winnerNames} 👑🏆` : `${leaderboard[0].kid.name} 👑`}
                      </span>
                      <span className="text-xs text-slate-500 mt-1 font-sans">بمجموع نقاط {maxPoints} نقطة 🌟</span>
                    </div>
                  </div>
                );
              })()}

              {/* Final leaderboard list */}
              <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-right space-y-4">
                <h4 className="text-xs font-bold text-slate-600 border-b border-[#0C2341]/5 pb-2">جدول الترتيب النهائي للأبناء 📊</h4>
                <div className="space-y-3">
                  {leaderboard.map((item, idx) => {
                    const isWinner = idx === 0;
                    return (
                      <div
                        key={item.kid.id}
                        className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${
                          isWinner
                            ? 'bg-[#C66E4E]/10 border-[#C66E4E]/20 shadow-sm scale-[1.01]'
                            : 'bg-white border-[#0C2341]/10'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-sans font-black text-xs text-[#0C2341]">
                          <span className="text-[#C66E4E]">{item.scores.totalPoints}</span>
                          <span className="text-[9px] text-slate-500">نقطة</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="text-right">
                            <h5 className="font-extrabold text-xs text-[#0C2341] flex items-center justify-end gap-1.5">
                              {item.kid.name} {isWinner && '👑'}
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
              <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-right space-y-4">
                <h4 className="text-xs font-bold text-slate-600 border-b border-[#0C2341]/5 pb-2">تحليل أداء الأداء المالي للأبناء 📊</h4>
                <div className="space-y-6">
                  {leaderboard.map((item) => (
                    <div key={item.kid.id} className="bg-[#0C2341]/5 border border-[#0C2341]/5 rounded-2xl p-4 space-y-3 text-[#0C2341]">
                      <span className="font-extrabold text-xs text-[#0C2341] block">الابن: {item.kid.name} 👦</span>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-[10px] font-sans">
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500 font-semibold">الادخار (50)</span>
                          <span className="font-extrabold text-[#0C2341]">{item.scores.savingsScore}/50</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500 font-semibold">الاستثمار (50)</span>
                          <span className="font-extrabold text-[#0C2341]">{item.scores.investmentScore}/50</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500 font-semibold">التبرع (50)</span>
                          <span className="font-extrabold text-[#0C2341]">{item.scores.donationScore}/50</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500 font-semibold">المهام (100)</span>
                          <span className="font-extrabold text-[#0C2341]">{item.scores.tasksScore}/100</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#0C2341]/10">
                          <span className="block text-slate-500 font-semibold">إدارة المصروف (100)</span>
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
            <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-2xl rounded-3xl p-6 text-right space-y-6 text-[#0C2341]">
              <div className="border-b border-[#0C2341]/5 pb-3">
                <h4 className="text-base font-black text-[#0C2341]">بدء تحدي مالي جديد للأبناء 🏁</h4>
                <p className="text-[10px] text-slate-500 mt-1">
                  اختر معايير التقييم والجائزة، وسيتم تحويل المصروف الشهري تلقائياً وبدء المنافسة رسمياً!
                </p>
              </div>

              <form onSubmit={handleStartLeague} className="space-y-6">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Select bases */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-600 block">اختر معايير التقييم المالي 🎖️</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'الادخار', label: 'الادخار (أقصى 50 ن)' },
                      { id: 'الاستثمار', label: 'الاستثمار (أقصى 50 ن)' },
                      { id: 'التبرع', label: 'التبرع (أقصى 50 ن)' },
                      { id: 'إنجاز المهام', label: 'إنجاز المهام (أقصى 100 ن)' },
                      { id: 'إدارة المصروف', label: 'إدارة المصروف (أقصى 100 ن)' },
                    ].map(base => {
                      const active = selectedBases.includes(base.id);
                      return (
                        <button
                          key={base.id}
                          type="button"
                          onClick={() => toggleBase(base.id)}
                          className={`p-3 rounded-2xl border transition-all text-xs font-bold text-center flex items-center justify-center gap-1.5 ${
                            active
                              ? 'bg-[#C66E4E]/10 border-[#C66E4E]/30 text-[#C66E4E] font-black'
                              : 'bg-[#0C2341]/5 border border-transparent text-slate-500 hover:text-[#0C2341]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            readOnly
                            className="accent-[#C66E4E]"
                          />
                          <span>{base.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Base allowance for each kid */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-600 block">حدد المصروف الأساسي لكل طفل 💵</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kids.map((kid) => (
                      <div key={kid.id} className="space-y-1">
                        <label className="block text-[11px] text-slate-500 font-bold">مصروف {kid.name}</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={allowances[kid.id] !== undefined ? allowances[kid.id] : kid.allowance}
                          onChange={(e) => setAllowances({
                            ...allowances,
                            [kid.id]: Number(e.target.value)
                          })}
                          className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-2xl px-3 py-2 text-right text-[#0C2341] text-xs outline-none focus:border-[#C66E4E] font-sans"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prize Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">جائزة دوري هذا الشهر 🎁</label>
                  <input
                    type="text"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    placeholder="مثال: بلايستيشن 5 🎮"
                    className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-2xl px-4 py-3 text-xs text-[#0C2341] placeholder-slate-400 focus:outline-none focus:border-[#C66E4E] transition-all text-right"
                  />
                </div>

                {/* End Date Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">تاريخ نهاية التحدي 📅</label>
                  <input
                    type="datetime-local"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-2xl px-4 py-2.5 text-xs text-[#0C2341] text-right font-sans focus:outline-none focus:border-[#C66E4E]"
                  />
                </div>

                {/* Start Button */}
                <button
                  type="submit"
                  className="w-full bg-[#0C2341] hover:bg-[#8B84D7] text-white font-black py-3.5 rounded-2xl text-xs transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>توزيع المصروف وبدء الدوري العائلي 🏆</span>
                </button>
              </form>
            </div>
          );
        }

        const isLeagueExpired = activeLeague && activeLeague.endDate 
          ? new Date().getTime() > new Date(activeLeague.endDate).getTime() 
          : false;

        return (
          /* ACTIVE LEAGUE LEADERBOARD */
          <div className="space-y-6">
            {/* Active League Prize Info */}
            <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-right flex justify-between items-center gap-4 text-[#0C2341]">
              {!isLeagueExpired ? (
                <button
                  onClick={handleEndLeague}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 hover:text-rose-700 border border-rose-500/15 px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 flex items-center gap-1"
                >
                  إنهاء التحدي مبكراً 🛑
                </button>
              ) : (
                <button
                  onClick={handleTriggerAiEvaluation}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 hover:text-emerald-700 border border-emerald-500/15 px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 flex items-center gap-1"
                >
                  تقييم الأبناء وإعلان النتائج 🏆
                </button>
              )}
              <div className="space-y-1">
                <span className="text-[10px] text-[#C66E4E] font-bold block">دوري الأبناء نشط حالياً 🔥</span>
                <h4 className="text-sm font-extrabold text-[#0C2341]">
                  الجائزة الكبرى: <span className="text-[#C66E4E]">{activeLeague.prize}</span> 🎁
                </h4>
                <p className="text-[9px] text-slate-500">
                  المعايير المعتمدة: {activeLeague.bases.join(' ، ')}
                </p>
                {countdownText && (
                  <span className="text-[10px] text-[#C66E4E] font-bold block mt-1 font-sans">
                    {countdownText}
                  </span>
                )}
              </div>
            </div>

            {/* Leaderboard Cards */}
            <div className="grid grid-cols-1 gap-6">
              {leaderboard.map((item, idx) => {
                const { kid, scores } = item;
                const isWinner = idx === 0;
                
                return (
                  <div
                    key={kid.id}
                    className={`relative overflow-hidden bg-white border rounded-3xl p-6 text-right flex flex-col md:flex-row-reverse justify-between gap-6 transition-all duration-300 hover:scale-[1.01] ${
                      isWinner
                        ? 'border-[#C66E4E]/30 shadow-md shadow-[#C66E4E]/5'
                        : 'border-[#0C2341]/10 shadow-sm'
                    } text-[#0C2341]`}
                  >
                    {isWinner && (
                      <div className="absolute right-0 top-0 w-24 h-full bg-[#C66E4E]/5 blur-xl -z-10"></div>
                    )}

                    {/* Right Column: Kid Profile & Total Points */}
                    <div className="flex flex-row-reverse items-center gap-4 md:border-l md:border-[#0C2341]/5 md:pl-6 min-w-[200px]">
                      <div className="w-12 h-12 rounded-full bg-[#0C2341]/5 border border-[#0C2341]/10 flex items-center justify-center text-xl">
                        {isWinner ? '👑' : '👦'}
                      </div>
                      <div className="space-y-1 text-right">
                        <h4 className="font-extrabold text-sm text-[#0C2341] flex items-center justify-end gap-1.5">
                          {kid.name}
                          {isWinner && <span className="text-[9px] bg-[#C66E4E]/10 text-[#C66E4E] px-2 py-0.5 rounded font-bold">المتصدر</span>}
                        </h4>
                        <div className="text-[10px] text-slate-500 font-sans font-bold">
                          مصروف الشهر: {scores.monthlyAllowance} ريال
                        </div>
                        <div className="text-lg font-black text-[#C66E4E] font-sans">
                          {scores.totalPoints} <span className="text-[10px] text-slate-500 font-bold">نقطة</span>
                        </div>
                      </div>
                    </div>

                    {/* Left Column: Points Breakdown */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {/* Savings */}
                      {activeLeague.bases.includes('الادخار') && (
                        <div className="bg-[#0C2341]/5 border border-[#0C2341]/5 p-3 rounded-2xl text-center space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold block">الادخار 💰</span>
                          <span className="text-xs font-bold text-[#0C2341] font-sans">{scores.savingsScore}/50</span>
                          <span className="text-[8px] text-slate-500 block font-sans">({scores.savingsAmount} ر)</span>
                        </div>
                      )}
                      {/* Investment */}
                      {activeLeague.bases.includes('الاستثمار') && (
                        <div className="bg-[#0C2341]/5 border border-[#0C2341]/5 p-3 rounded-2xl text-center space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold block">الاستثمار 📈</span>
                          <span className="text-xs font-bold text-[#0C2341] font-sans">{scores.investmentScore}/50</span>
                          <span className="text-[8px] text-slate-500 block font-sans">({scores.investmentAmount} ر)</span>
                        </div>
                      )}
                      {/* Donation */}
                      {activeLeague.bases.includes('التبرع') && (
                        <div className="bg-[#0C2341]/5 border border-[#0C2341]/5 p-3 rounded-2xl text-center space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold block">التبرع 🤲</span>
                          <span className="text-xs font-bold text-[#0C2341] font-sans">{scores.donationScore}/50</span>
                          <span className="text-[8px] text-slate-500 block font-sans">({scores.donationAmount} ر)</span>
                        </div>
                      )}
                      {/* Tasks */}
                      {activeLeague.bases.includes('إنجاز المهام') && (
                        <div className="bg-[#0C2341]/5 border border-[#0C2341]/5 p-3 rounded-2xl text-center space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold block">المهام 🧹</span>
                          <span className="text-xs font-bold text-[#0C2341] font-sans">{scores.tasksScore}/100</span>
                          <span className="text-[8px] text-slate-500 block font-sans">({scores.approvedTasks}/{scores.totalTasks})</span>
                        </div>
                      )}
                      {/* Spending Eval */}
                      {activeLeague.bases.includes('إدارة المصروف') && (
                        <div className="bg-[#0C2341]/5 border border-[#0C2341]/5 p-3 rounded-2xl text-center space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold block">المصروف 🛒</span>
                          <span className="text-xs font-bold text-[#0C2341] font-sans">{scores.spendingScore}/100</span>
                          <span className="text-[8px] text-slate-500 block font-sans">({scores.spentAmount} ر)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Custom Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0C2341]/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white border border-[#0C2341]/10 p-6 rounded-[28px] text-right space-y-4 shadow-2xl relative text-[#0C2341]">
            <h3 className="text-lg font-black text-[#0C2341]">هل أنت متأكد؟</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              سيؤدي هذا إلى إلغاء التحدي بالكامل وحذف جميع المهام المرتبطة به دون تقييم.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="px-4 py-2 border border-[#0C2341]/10 rounded-xl text-xs font-bold text-slate-500 hover:bg-[#0C2341]/5 transition-all"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowEndConfirm(false);
                  if (activeLeague.id !== undefined) {
                    await endFamilyLeague(activeLeague.id);
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                نعم، متأكد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Evaluation Generative UI Modal */}
      {showAiEvaluation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0C2341]/40 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-[#0C2341]/10 p-6 rounded-[28px] text-right space-y-6 shadow-2xl relative my-8 text-[#0C2341]">
            <div className="border-b border-[#0C2341]/5 pb-3 flex justify-between items-center flex-row-reverse">
              <h3 className="text-lg font-black text-[#0C2341] flex items-center gap-2">
                <span>تقييم المستشار المالي النهائي 🤖</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAiEvaluation(false)}
                className="text-slate-400 hover:text-[#0C2341] text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="h-10 w-10 border-2 border-[#C66E4E] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-500 font-bold">جاري تحليل معاملات الأبناء واحتساب التقييم النهائي... 🧠🤖</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500 leading-relaxed">
                  يقوم المستشار المالي الآن بتقييم مهارات الإنفاق وإدارة المصروف للأبناء بناءً على سلوكياتهم ومعاملاتهم المالية خلال الدوري:
                </p>

                <div className="space-y-4">
                  {aiEvaluations.map((evalItem, idx) => {
                    const kidObj = kids.find(k => k.name === evalItem.kidName);
                    const kidId = kidObj ? kidObj.id : evalItem.kidName;
                    const currentScore = customScores[kidId] ?? evalItem.suggestedScore;

                    return (
                      <div key={idx} className="bg-[#0C2341]/5 border border-[#0C2341]/5 rounded-2xl p-4 space-y-3 text-right">
                        <div className="flex justify-between items-center flex-row-reverse text-[#0C2341]">
                          <span className="font-extrabold text-sm text-[#0C2341]">الابن: {evalItem.kidName} 👦</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-bold">الدرجة المقترحة (0-100):</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={currentScore}
                              onChange={(e) => setCustomScores({
                                ...customScores,
                                [kidId]: Math.min(100, Math.max(0, Number(e.target.value)))
                              })}
                              className="w-16 bg-white border border-[#0C2341]/10 rounded-xl px-2 py-1 text-center text-xs font-bold text-[#C66E4E] font-sans outline-none focus:border-[#C66E4E]"
                            />
                          </div>
                        </div>

                        <div className="bg-[#C66E4E]/5 p-3 rounded-xl border border-[#C66E4E]/15 text-[11px] leading-relaxed text-slate-650">
                          <span className="font-bold text-[#C66E4E] block mb-1">تحليل المستشار المالي:</span>
                          {evalItem.reasoning}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-[#0C2341]/5">
                  <button
                    type="button"
                    onClick={() => setShowAiEvaluation(false)}
                    className="px-4 py-2 border border-[#0C2341]/10 rounded-xl text-xs font-bold text-slate-500 hover:bg-[#0C2341]/5 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (activeLeague.id !== undefined) {
                        await endFamilyLeague(activeLeague.id, customScores);
                      }
                      setShowAiEvaluation(false);
                    }}
                    className="px-5 py-2.5 bg-[#0C2341] hover:bg-[#8B84D7] text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    <span>اعتماد التقييم وإعلان النتائج 🏆</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Past Leagues History Section */}
      <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-6 text-right space-y-4 text-[#0C2341]">
        <h3 className="text-base font-black text-[#0C2341] flex items-center justify-end gap-2">
          <span>سجل التحديات السابقة 📜</span>
        </h3>
        
        {pastLeagues.length === 0 ? (
          <p className="text-xs text-slate-500">لا توجد تحديات سابقة مؤرشفة حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pastLeagues.map((league) => {
              const formattedDate = new Date(league.end_date).toLocaleDateString('ar-SA');
              return (
                <div
                  key={league.id}
                  onClick={() => setSelectedPastLeague(league)}
                  className="bg-[#0C2341]/5 border border-[#0C2341]/5 hover:border-[#C66E4E]/30 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between gap-3 text-right"
                >
                  <div className="flex justify-between items-center flex-row-reverse border-b border-[#0C2341]/5 pb-2">
                    <span className="text-xs font-black text-[#0C2341]">الجائزة: {league.prize} 🎁</span>
                    <span className="text-[10px] text-slate-500">{formattedDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 space-y-1">
                    <p>المعايير: {league.bases?.join(' ، ')}</p>
                  </div>
                  <span className="text-[9px] text-[#C66E4E] font-bold self-start mt-2">عرض التفاصيل ➜</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past League Detail Modal */}
      {selectedPastLeague && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0C2341]/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white border border-[#0C2341]/10 p-6 rounded-[28px] text-right space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto text-[#0C2341]">
            <div className="border-b border-[#0C2341]/5 pb-3 flex justify-between items-center flex-row-reverse">
              <h3 className="text-lg font-black text-[#0C2341]">تفاصيل التحدي المؤرشف 📜</h3>
              <button
                type="button"
                onClick={() => setSelectedPastLeague(null)}
                className="text-slate-400 hover:text-[#0C2341] text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between flex-row-reverse bg-[#0C2341]/5 p-2.5 rounded-xl">
                <span className="font-bold text-[#0C2341]">الجائزة الكبرى:</span>
                <span className="text-[#C66E4E] font-extrabold">{selectedPastLeague.prize} 🎁</span>
              </div>
              <div className="flex justify-between flex-row-reverse bg-[#0C2341]/5 p-2.5 rounded-xl font-sans">
                <span className="font-bold text-[#0C2341]">تاريخ الانتهاء:</span>
                <span>{new Date(selectedPastLeague.end_date).toLocaleString('ar-SA')}</span>
              </div>
              <div className="flex justify-between flex-row-reverse bg-[#0C2341]/5 p-2.5 rounded-xl">
                <span className="font-bold text-[#0C2341]">المعايير المعتمدة:</span>
                <span>{selectedPastLeague.bases?.join(' ، ')}</span>
              </div>

              {/* Leaderboard & Breakdown inside History Modal */}
              <div className="space-y-4 border-t border-[#0C2341]/5 pt-3 mt-3">
                <span className="font-bold text-[#0C2341] block">الترتيب والنتائج النهائية للأبناء:</span>
                {(() => {
                  const calculatePastLeagueKidScores = (kid: any, league: any) => {
                    const baseAllowance = Number(league.allowances?.[kid.id] || league.allowances?.[kid.name] || kid.allowance || 100);
                    const startTime = new Date(league.start_date).getTime();
                    const endTime = new Date(league.end_date).getTime();

                    const currentLeagueTx = (kid.transactions || []).filter((tx: any) => {
                      const txTime = new Date(tx.date).getTime();
                      return txTime >= startTime && txTime <= endTime;
                    });

                    const currentLeagueTasks = (kid.tasks || []).filter((task: any) => {
                      const taskTime = new Date(task.createdAt || task.endDate || '').getTime();
                      if (isNaN(taskTime)) return false;
                      return taskTime >= startTime && taskTime <= endTime;
                    });

                    const savingsAmount = currentLeagueTx
                      .filter((tx: any) => tx.type === 'withdrawal' && tx.title.includes('حصالة'))
                      .reduce((sum: number, tx: any) => sum + tx.amount, 0);
                    const savingsScore = league.bases?.includes('الادخار')
                      ? Math.min(50, Math.round((savingsAmount / baseAllowance) * 50))
                      : 0;

                    const investmentAmount = currentLeagueTx
                      .filter((tx: any) => tx.type === 'withdrawal' && (tx.title.includes('استثمار') || tx.title.includes('مشروع')))
                      .reduce((sum: number, tx: any) => sum + tx.amount, 0);
                    const investmentScore = league.bases?.includes('الاستثمار')
                      ? Math.min(50, Math.round((investmentAmount / baseAllowance) * 50))
                      : 0;

                    const donationAmount = currentLeagueTx
                      .filter((tx: any) => tx.type === 'withdrawal' && tx.title.includes('تبرع'))
                      .reduce((sum: number, tx: any) => sum + tx.amount, 0);
                    const donationScore = league.bases?.includes('التبرع')
                      ? Math.min(50, Math.round((donationAmount / baseAllowance) * 50))
                      : 0;

                    const totalTasks = currentLeagueTasks.length;
                    const approvedTasks = currentLeagueTasks.filter((t: any) => t.status === 'approved').length;
                    const tasksScore = league.bases?.includes('إنجاز المهام') && totalTasks > 0
                      ? Math.min(100, Math.round((approvedTasks / totalTasks) * 100))
                      : 0;

                    const spendingScores = league.allowances?.spendingScores || {};
                    const spendingScore = league.bases?.includes('إدارة المصروف')
                      ? (spendingScores[kid.id] || spendingScores[kid.name] || 0)
                      : 0;

                    const totalPoints = savingsScore + investmentScore + donationScore + tasksScore + spendingScore;

                    return {
                      savingsScore,
                      investmentScore,
                      donationScore,
                      tasksScore,
                      spendingScore,
                      totalPoints
                    };
                  };

                  const pastLeaderboard = kids.map(k => ({
                    kid: k,
                    scores: calculatePastLeagueKidScores(k, selectedPastLeague)
                  })).sort((a, b) => b.scores.totalPoints - a.scores.totalPoints);

                  if (pastLeaderboard.length === 0) return null;
                  const winnerName = pastLeaderboard[0].kid.name;

                  return (
                    <div className="space-y-3">
                      <div className="bg-yellow-500/10 border border-yellow-500/25 p-3 rounded-2xl text-center">
                        <span className="text-[10px] text-slate-500 font-bold block">الفائز بالدوري:</span>
                        <span className="text-sm font-black text-amber-600">👑 {winnerName} 👑</span>
                      </div>

                      <div className="space-y-2">
                        {pastLeaderboard.map((item, idx) => (
                          <div key={item.kid.id} className="bg-[#0C2341]/5 border border-[#0C2341]/10 p-3 rounded-xl space-y-2">
                            <div className="flex justify-between items-center flex-row-reverse text-xs text-[#0C2341]">
                              <span className="font-extrabold">{idx + 1}. {item.kid.name}</span>
                              <span className="text-[#C66E4E] font-sans font-bold">{item.scores.totalPoints} نقطة</span>
                            </div>
                            <div className="grid grid-cols-5 gap-1 text-[9px] text-center text-slate-500 font-sans">
                              <div className="bg-white p-1 rounded border border-[#0C2341]/10">
                                <span>ادخار: {item.scores.savingsScore}</span>
                              </div>
                              <div className="bg-white p-1 rounded border border-[#0C2341]/10">
                                <span>استثمار: {item.scores.investmentScore}</span>
                              </div>
                              <div className="bg-white p-1 rounded border border-[#0C2341]/10">
                                <span>تبرع: {item.scores.donationScore}</span>
                              </div>
                              <div className="bg-white p-1 rounded border border-[#0C2341]/10">
                                <span>مهام: {item.scores.tasksScore}</span>
                              </div>
                              <div className="bg-white p-1 rounded border border-[#0C2341]/10">
                                <span>مصروف: {item.scores.spendingScore}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-2 border-t border-[#0C2341]/5 pt-3 mt-3">
                <span className="font-bold text-[#0C2341] block mb-1">المصروفات الموزعة للأبناء:</span>
                {Object.entries(selectedPastLeague.allowances || {}).map(([kidId, amount]) => {
                  if (kidId === 'spendingScores') return null; // skip spendingScores metadata
                  const kidObj = kids.find(k => k.id === kidId);
                  return (
                    <div key={kidId} className="flex justify-between flex-row-reverse bg-[#0C2341]/5 p-2 rounded-xl text-[11px] text-[#0C2341]">
                      <span className="text-slate-500 font-bold">{kidObj ? kidObj.name : 'ابن'}</span>
                      <span className="text-[#0C2341] font-sans font-bold">{amount as number} ريال</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedPastLeague(null)}
                className="px-5 py-2.5 bg-[#0C2341] hover:bg-[#8B84D7] text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
