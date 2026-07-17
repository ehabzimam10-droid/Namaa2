import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { KingdomScene } from '../components/kingdom3d/KingdomScene';
import { getTier, getTierName, computeKingdomLevel, BUILDING_INFO } from '../components/kingdom3d/kingdomLogic';
import VillageScene from '../components/village3d/VillageScene';
import { computeVillageLevel } from '../components/village3d/villageLogic';
import { getKingdomAdvice } from '../utils/aiService';
import type { Kid } from '../data/mockData';

export default function FatherVillagePage() {
  const { kids, geminiApiKey } = useApp();
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);

  // Calculate average levels for the joint family buildings based on kids' progress
  const activeKids = kids.length > 0 ? kids : [];
  const averageBank = activeKids.length > 0 
    ? Math.round(activeKids.reduce((sum, k) => sum + (k.bank_level || 3), 0) / activeKids.length)
    : 3;
  const averageFarm = activeKids.length > 0
    ? Math.round(activeKids.reduce((sum, k) => sum + (k.farm_level || 3), 0) / activeKids.length)
    : 3;
  const averageMarket = activeKids.length > 0
    ? Math.round(activeKids.reduce((sum, k) => sum + (k.market_level || 3), 0) / activeKids.length)
    : 3;
  const averageTasks = activeKids.length > 0
    ? Math.round(activeKids.reduce((sum, k) => sum + (k.tasks_level || 3), 0) / activeKids.length)
    : 3;

  // Local state for dev simulation
  const [simulatedLevels, setSimulatedLevels] = useState({
    treasury: 3,
    garden: 3,
    harbor: 3,
    tower: 3,
  });

  // Sync initial state when averages load
  useEffect(() => {
    setSimulatedLevels({
      treasury: averageBank,
      garden: averageFarm,
      harbor: averageMarket,
      tower: averageTasks,
    });
  }, [averageBank, averageFarm, averageMarket, averageTasks]);

  const kingdomLevel = useMemo(() => computeKingdomLevel(simulatedLevels), [simulatedLevels]);
  const palaceTier = getTier(kingdomLevel);
  const palaceTierName = getTierName(palaceTier);

  // Check for balance warnings (if one building is >2 levels higher than others)
  const minLevel = Math.min(...Object.values(simulatedLevels));
  const maxLevel = Math.max(...Object.values(simulatedLevels));
  const isUnbalanced = maxLevel - minLevel >= 3;

  // AI Advisor State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchAiAdvice = async () => {
    setIsAiLoading(true);
    try {
      const advice = await getKingdomAdvice(geminiApiKey, simulatedLevels, kids);
      setAiAdvice(advice);
    } catch (err) {
      console.error('Failed to get family kingdom advice:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAiAdvice();
    }, 600); // 600ms debounce to prevent spamming Gemini while user drags sliders
    return () => clearTimeout(handler);
  }, [simulatedLevels, geminiApiKey]);

  const handleReset = () => {
    setSimulatedLevels({
      treasury: averageBank,
      garden: averageFarm,
      harbor: averageMarket,
      tower: averageTasks,
    });
  };

  return (
    <div className="w-full space-y-8 text-right font-sans relative">
      {/* Header Panel */}
      <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C66E4E]/5 blur-2xl"></div>
        <div>
          <h2 className="text-xs font-semibold text-[#C66E4E]">استكشاف نمو الأبناء ومملكة نماء العائلية المشتركة</h2>
          <h3 className="text-2xl font-black text-[#0C2341] mt-1">مملكة نماء العائلية الكبرى 🏰👑</h3>
        </div>
      </div>

      {/* Outposts Row */}
      <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-500">مواقع استكشاف قرى الأبناء الخارجية</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {kids.map((k) => (
            <button
              key={k.id}
              onClick={() => setSelectedKid(k)}
              className="flex items-center gap-3 bg-[#0C2341]/5 hover:bg-[#0C2341]/10 border border-[#0C2341]/10 hover:border-[#8B84D7]/40 p-4 rounded-2xl transition-all duration-350 shadow-sm hover:scale-105 active:scale-95 group text-right focus:outline-none text-[#0C2341] cursor-pointer"
            >
              <div className="text-2xl p-2 bg-[#8B84D7]/10 rounded-xl border border-[#8B84D7]/20 group-hover:border-[#8B84D7]/50 transition-all">
                🏰
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-[#8B84D7] font-bold block">مستكشف قرية ثلاثية الأبعاد</span>
                <span className="text-xs font-black text-[#0C2341] block font-sans">قرية {k.name} 👦 ➜</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Kingdom Scene Card */}
      <div className="relative h-[560px] w-full overflow-hidden rounded-3xl border border-[#0C2341]/10 bg-[#080F1E] shadow-2xl">
        <KingdomScene levels={simulatedLevels} />

        {/* Kingdom level badge */}
        <div className="pointer-events-none absolute right-4 top-4 rounded-2xl border border-yellow-200/20 bg-[#0D1527]/85 px-4 py-3 backdrop-blur-md text-[#0C2341] text-right">
          <div className="text-[10px] font-bold tracking-widest text-yellow-200/80">مستوى المملكة الموحد</div>
          <div className="mt-0.5 flex items-baseline justify-end gap-1.5">
            <span className="text-[10px] font-bold text-slate-400">/ 5</span>
            <span className="text-3xl font-black text-yellow-300">{kingdomLevel}</span>
          </div>
          <div className="mt-1 text-[10px] font-bold text-purple-300">مرحلة القصر: {palaceTierName}</div>
        </div>

        {/* Interaction hint */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#0D1527]/70 px-3 py-1.5 text-[10px] font-bold text-slate-300 backdrop-blur-md">
          اسحب للتفاعل مع المملكة ثلاثية الأبعاد 🖱️ · مرّر فوق المباني لعرض تفاصيلها ✨
        </div>
      </div>

      {/* Developer / Simulation Controls */}
      <div className="bg-white border border-[#C66E4E]/30 rounded-3xl p-6 shadow-sm space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#C66E4E] to-[#8B84D7]"></div>
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer font-sans"
          >
            إعادة تعيين للبيانات الفعلية 🔄
          </button>
          <div className="text-right">
            <h4 className="text-sm font-black text-[#0C2341] flex items-center gap-1.5 justify-end">
              لوحة المحاكاة والتجربة (تحكم المطورين) 🛠️
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">اسحب المؤشرات لتغيير مستويات مباني المملكة محلياً ومراقبة تطورها ثلاثي الأبعاد</p>
          </div>
        </div>

        {isUnbalanced && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 text-[10px] rounded-xl p-3 flex items-start gap-2 flex-row-reverse text-right">
            <span className="text-sm shrink-0">⚠️</span>
            <div className="space-y-0.5">
              <strong className="font-black">تنبيه توازن النمو:</strong>
              <p className="opacity-90 font-sans font-bold">تفاوت مستويات المباني بمقدار 3 مستويات أو أكثر يؤثر على تناسق نمو المملكة.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['treasury', 'garden', 'harbor', 'tower'] as const).map((key) => (
            <div key={key} className="space-y-2.5 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[#8B84D7] bg-[#8B84D7]/10 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                  المستوى {simulatedLevels[key]}
                </span>
                <label className="text-slate-700 flex items-center gap-1 font-bold">
                  <span>{BUILDING_INFO[key].emoji}</span>
                  {BUILDING_INFO[key].name}
                </label>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={simulatedLevels[key]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSimulatedLevels(prev => ({ ...prev, [key]: val }));
                }}
                className="w-full cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none accent-[#8B84D7] outline-none mt-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* AI Kingdom Advisor Card */}
      <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#0C2341]/5 pb-3">
          <button
            onClick={fetchAiAdvice}
            disabled={isAiLoading}
            className="px-3.5 py-1.5 bg-[#8B84D7]/10 hover:bg-[#8B84D7]/20 text-[#8B84D7] text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer font-sans"
          >
            <span>{isAiLoading ? 'جاري التحليل... ⏳' : 'تحديث التحليل المالي 🔮'}</span>
          </button>
          <div className="text-right">
            <h4 className="text-sm font-black text-[#0C2341]">مستشار المملكة المالي المشترك 🤖</h4>
            <p className="text-[10px] text-slate-555 mt-0.5">تحليل مستوى نمو العائلة وتوفير نصائح إرشادية وتدريبية للأب</p>
          </div>
        </div>

        {isAiLoading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <div className="h-7 w-7 border-2 border-[#8B84D7] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-550 font-sans">يقوم المستشار المالي بتحليل قريتكم الموحدة...</p>
          </div>
        ) : (
          <div className="bg-[#8B84D7]/5 border border-[#8B84D7]/20 p-4 rounded-2xl flex flex-row-reverse items-start gap-4 animate-fade-in text-[#0C2341]">
            <div className="text-2xl p-2.5 rounded-full bg-[#8B84D7]/10 text-[#8B84D7] shrink-0">
              💡
            </div>
            <div className="text-right flex-1 space-y-1.5">
              <span className="text-[10px] font-black text-[#8B84D7] tracking-wider uppercase block">تحليل المستشار المالي للأب</span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans font-bold">
                {aiAdvice || 'اضغط على زر "تحديث التحليل المالي 🔮" للحصول على تحليل مالي لقريتكم الموحدة.'}
              </p>
            </div>
          </div>
        )}

        {!geminiApiKey && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 p-3 rounded-xl text-[10px] font-bold text-center">
            ⚠️ مفتاح Gemini API غير متاح حالياً (يعمل بنظام المحاكاة). يمكنك إضافته من زر الإعدادات بالجانب لتفعيل الاتصال المباشر.
          </div>
        )}
      </div>

      {/* Info details */}
      <div className="bg-[#C66E4E]/5 border border-[#C66E4E]/10 p-5 rounded-3xl text-xs leading-relaxed text-[#0C2341]">
        <strong>🏛️ أركان المملكة الموحدة:</strong>
        <ul className="list-disc pr-5 mt-2 space-y-1.5 text-slate-655 font-sans font-bold">
          <li><strong>خزينة المملكة 💰 (مستوى {averageBank}):</strong> تمثل متوسط ادخار أبنائك والتزامهم بحصالات الأهداف.</li>
          <li><strong>الحدائق الملكية 🌳 (مستوى {averageFarm}):</strong> تمثل تفاعل أبنائك المجتمعي والتبرعات والعمل الخيري.</li>
          <li><strong>ميناء التجارة 🚢 (مستوى {averageMarket}):</strong> يمثل متوسط الاستثمارات العائلية وتنمية الأموال.</li>
          <li><strong>برج الحكمة 📜 (مستوى {averageTasks}):</strong> يعبر عن مدى التزام الأبناء بإنجاز المهام المسندة إليهم بانتظام.</li>
        </ul>
      </div>

      {/* Glassmorphic Modal for Kid's detailed 3D village view */}
      {selectedKid && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#0C2341]/40 backdrop-blur-md animate-fade-in text-[#0C2341]">
          <div className="relative w-full max-w-2xl bg-white border border-[#0C2341]/10 shadow-2xl rounded-[28px] p-6 text-right font-sans overflow-hidden">
            <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#8B84D7]/5 blur-2xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#0C2341]/5 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setSelectedKid(null)}
                className="text-slate-500 hover:text-[#0C2341] text-xs bg-[#0C2341]/5 hover:bg-[#0C2341]/10 px-3 py-1.5 rounded-xl border border-[#0C2341]/10 transition-all font-sans cursor-pointer font-bold"
              >
                ✕ إغلاق
              </button>
              <div>
                <h4 className="font-extrabold text-sm text-[#0C2341]">قرية الابن الخاصة: {selectedKid.name} 👦🏰</h4>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5 font-bold">منظور ثلاثي الأبعاد تفاعلي لمباني قريته الحقيقية (منزل القصر + مبانيه الشخصية الـ 3)</p>
              </div>
            </div>

            {/* Content: Kid's 3D VillageScene */}
            <div className="relative w-full h-[400px] bg-[#0D1527] border border-white/10 rounded-2xl overflow-hidden shadow-inner">
              <VillageScene
                levels={{
                  bank: selectedKid.bank_level || 3,
                  farm: selectedKid.farm_level || 3,
                  market: selectedKid.market_level || 3,
                  windmill: selectedKid.tasks_level || 3,
                }}
                villageLevel={computeVillageLevel({
                  bank: selectedKid.bank_level || 3,
                  farm: selectedKid.farm_level || 3,
                  market: selectedKid.market_level || 3,
                  windmill: selectedKid.tasks_level || 3,
                })}
              />
            </div>

            {/* Bottom info row */}
            <div className="flex justify-between items-center text-[10px] text-slate-555 bg-[#0C2341]/5 p-3 rounded-2xl border border-[#0C2341]/10 font-sans mt-4">
              <span className="font-bold text-[#C66E4E]">سلوك مالي حي</span>
              <span>تتم محاكاة قريته بناءً على مدخراته في حصالة دوري العائلة وتبرعاته واستثماراته</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
