import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VillageScene from '../components/village3d/VillageScene';
import { get3DVillageAdvice } from '../utils/aiService';
import {
  type BuildingKey,
  type BuildingLevels,
  BUILDING_INFO,
  BUILDING_KEYS,
  computeVillageLevel,
  MAX_LEVEL,
  MIN_LEVEL,
  nextVillageMilestone,
  tierForLevel,
  villageTier,
  violatingBuildings,
} from '../components/village3d/villageLogic';

const SLIDER_ACCENT: Record<BuildingKey, string> = {
  bank: 'accent-orange-500',
  farm: 'accent-emerald-500',
  market: 'accent-amber-500',
  windmill: 'accent-violet-500',
};

const TIER_LABEL: Record<number, string> = {
  1: 'الشكل الأول',
  2: 'الشكل الثاني',
  3: 'الشكل الأسطوري',
};

export default function KidCastlePage() {
  const navigate = useNavigate();
  const { kids, profile, updateKidLevels, geminiApiKey } = useApp();

  // Find current active kid from context
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // Initialize building levels in local state for dynamic manual simulation (dev controls)
  const [levels, setLevels] = useState<BuildingLevels>({
    bank: kid?.bank_level || 3,
    farm: kid?.farm_level || 3,
    market: kid?.market_level || 3,
    windmill: kid?.tasks_level || 3,
  });

  // Sync state when kid data is loaded from context
  useEffect(() => {
    if (kid) {
      setLevels({
        bank: kid.bank_level || 3,
        farm: kid.farm_level || 3,
        market: kid.market_level || 3,
        windmill: kid.tasks_level || 3,
      });
    }
  }, [kid]);

  const handleSaveLevels = async () => {
    if (!kid) return;
    await updateKidLevels(kid.id, levels.bank, levels.farm, levels.market, levels.windmill);
  };

  // AI Advisor state
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchAiAdvice = async () => {
    if (!kid) return;
    setIsAiLoading(true);
    try {
      const advice = await get3DVillageAdvice(geminiApiKey, kid.name, levels, kid.balance, kid.age);
      setAiAdvice(advice);
    } catch (err) {
      console.error('Failed to get village advice:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Auto-fetch advice when levels or API key changes (debounced slightly or just triggered)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAiAdvice();
    }, 600); // 600ms debounce to prevent spamming Gemini while user drags sliders
    return () => clearTimeout(handler);
  }, [levels, geminiApiKey]);

  // Village level is ALWAYS computed automatically from the 4 basis buildings
  const villageLevel = useMemo(() => computeVillageLevel(levels), [levels]);
  const vTier = villageTier(villageLevel);
  const violations = useMemo(() => violatingBuildings(levels), [levels]);
  const milestone = useMemo(() => nextVillageMilestone(levels), [levels]);

  const setLevel = (key: BuildingKey, value: number) =>
    setLevels((prev) => ({ ...prev, [key]: value }));

  if (!kid) return null;

  return (
    <div className="w-full space-y-8 text-right font-sans pb-12">
      {/* Header Panel */}
      <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C66E4E]/5 blur-2xl"></div>
        <div className="flex items-center justify-between w-full z-10">
          <button
            onClick={() => navigate('/kid')}
            className="rounded-xl bg-[#0C2341]/5 hover:bg-[#0C2341]/10 px-3.5 py-2 text-xs font-bold text-[#0C2341] transition-all border border-[#0C2341]/10 active:scale-95 cursor-pointer font-sans"
          >
            👦 العودة للوحة التحكم
          </button>
          <div>
            <h2 className="text-xs font-semibold text-[#C66E4E]">التمثيل البصري ثلاثي الأبعاد لنموك المالي وسلوكك</h2>
            <h3 className="text-2xl font-black text-[#0C2341] mt-1">القرية الافتراضية ثلاثية الأبعاد 🏰</h3>
          </div>
        </div>
      </div>

      {/* 3D Village Scene */}
      <div className="relative h-[560px] overflow-hidden rounded-3xl border border-white/10 bg-[#0D1527] shadow-2xl">
        <VillageScene levels={levels} villageLevel={villageLevel} className="absolute inset-0" />

        {/* Village level badge */}
        <div className="pointer-events-none absolute right-4 top-4 rounded-2xl border border-yellow-200/20 bg-[#0D1527]/75 px-4 py-3 backdrop-blur-md">
          <div className="text-[10px] font-bold tracking-widest text-yellow-200/80">مستوى القرية العام</div>
          <div className="mt-0.5 flex items-baseline justify-end gap-1.5">
            <span className="text-[10px] font-bold text-slate-400">/ 5</span>
            <span className="text-3xl font-black text-yellow-300">{villageLevel}</span>
          </div>
          <div className="mt-1 text-[10px] font-bold text-purple-300">القلعة والسور: {TIER_LABEL[vTier]}</div>
        </div>

        {/* Interaction hint */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#0D1527]/70 px-3 py-1.5 text-[10px] font-bold text-slate-300 backdrop-blur-md">
          اسحب للدوران 🖱️ · مرّر فوق المباني لعرض تفاصيلها ✨
        </div>
      </div>

      {/* AI Village Advisor Panel */}
      <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <button
            onClick={fetchAiAdvice}
            disabled={isAiLoading}
            className="px-3.5 py-1.5 bg-[#8B84D7]/10 hover:bg-[#8B84D7]/20 text-[#8B84D7] text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer font-sans"
          >
            <span>{isAiLoading ? 'جاري التحليل... ⏳' : 'تحديث التحليل المالي 🔮'}</span>
          </button>
          <div className="text-right">
            <h4 className="text-sm font-black text-[#0C2341]">مستشار القرية المالي الذكي 🤖</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 font-bold">تحليل سلوكك المالي المباشر وتقديم توجيهات لتطوير قريتك وقدراتك المالية</p>
          </div>
        </div>

        {isAiLoading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <div className="h-7 w-7 border-2 border-[#8B84D7] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-sans">يقوم المستشار المالي بتحليل قريتك ثلاثية الأبعاد...</p>
          </div>
        ) : (
          <div className="bg-[#8B84D7]/5 border border-[#8B84D7]/20 p-4 rounded-2xl flex flex-row-reverse items-start gap-4 animate-fade-in text-[#0C2341]">
            <div className="text-2xl p-2.5 rounded-full bg-[#8B84D7]/10 text-[#8B84D7] shrink-0">
              💡
            </div>
            <div className="text-right flex-1 space-y-1.5">
              <span className="text-[10px] font-black text-[#8B84D7] tracking-wider uppercase block">تحليل المستشار المالي</span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans font-bold">
                {aiAdvice || 'يرجى النقر فوق زر "تحديث التحليل المالي 🔮" للحصول على مراجعة مباشرة لقريتك من مستشار الذكاء الاصطناعي.'}
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

      {/* Info Banner */}
      <div className="bg-[#0C2341]/5 border border-[#0C2341]/10 p-5 rounded-3xl text-xs leading-relaxed text-[#0C2341]">
        <strong>💡 دليل معالم قريتك الافتراضية المربوطة بسلوكك:</strong>
        <ul className="list-disc pr-5 mt-2 space-y-1.5 text-slate-600 font-sans font-bold">
          <li><strong>البنك العائلي 💰 (مستوى {levels.bank}):</strong> ينمو ويتزين بالذهب بناءً على التزامك بادخار الأموال بانتظام.</li>
          <li><strong>واحة التبرعات 💚 (مستوى {levels.farm}):</strong> تصبح خضراء ويفيض بئرها بالماء العذب عند مشاركتك المجتمعية بالخير والتبرع.</li>
          <li><strong>سوق الاستثمار 📈 (مستوى {levels.market}):</strong> يمتلئ بالخيام والنشاط التجاري مع زيادة حجم استثماراتك في المشاريع العائلية.</li>
          <li><strong>طاحونة المهام 🌀 (مستوى {levels.windmill}):</strong> تدور أشرعتها أسرع وأعلى كلما أنجزت مهامك الشخصية بانتظام.</li>
          <li><strong>القصر المركزي والسور 🏛️ (مستوى القرية {villageLevel}):</strong> يعكسان مستواك الشامل — يتطوران تلقائياً عندما تتوازن وتنمو كل الأساسات معاً.</li>
        </ul>
      </div>

      {/* Developer Controls Glass Panel */}
      <div className="bg-white border border-[#C66E4E]/30 rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#C66E4E] to-[#8B84D7]"></div>
        
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4">
          <div className="text-right">
            <h4 className="text-sm font-black text-[#0C2341]">لوحة تحكيم وتطوير المطورين (Developer Controls) 🛠️</h4>
            <p className="text-[10px] text-slate-500 mt-1 font-sans font-bold">
              اسحب المؤشرات للتحكم بمستوى كل مبنى (من 1 إلى 5). مستوى القرية العام يُحسب تلقائياً وفق قواعد التوازن.
            </p>
          </div>
          <button
            onClick={handleSaveLevels}
            className="px-4 py-2.5 bg-gradient-to-l from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 font-sans border border-orange-400/25"
          >
            <span>حفظ المستويات في قاعدة البيانات 💾🏰</span>
          </button>
        </div>

        {/* Computed village level strip */}
        <div className="rounded-2xl border border-yellow-500/25 bg-gradient-to-l from-yellow-500/5 to-transparent p-4">
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="text-xs font-black text-[#0C2341]">
              مستوى القرية العام: <span className="text-yellow-600 font-bold">{villageLevel}</span> · {TIER_LABEL[vTier]} (تلقائي ✨)
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2.5 w-8 rounded-full transition-all duration-500 ${
                    s <= villageLevel ? 'bg-gradient-to-l from-yellow-400 to-amber-500 shadow-[0_0_8px_rgba(253,224,71,0.4)]' : 'bg-slate-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          {milestone && <p className="mt-2 text-[10px] font-bold text-slate-500 font-sans text-right">🎯 {milestone}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BUILDING_KEYS.map((key) => {
            const info = BUILDING_INFO[key];
            const level = levels[key];
            const tier = tierForLevel(level);
            const isViolating = violations.includes(key);
            return (
              <div key={key} className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-sans text-[#8B84D7] font-bold">
                    المستوى: {level} · <span className="font-bold">{TIER_LABEL[tier]}</span>
                  </span>
                  <span className="text-xs font-black text-[#0C2341]">
                    {info.nameAr} ({info.basisAr}) {info.emoji}
                  </span>
                </div>
                <input
                  type="range"
                  min={MIN_LEVEL}
                  max={MAX_LEVEL}
                  step={1}
                  value={level}
                  onChange={(e) => setLevel(key, Number(e.target.value))}
                  className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer outline-none mt-2 ${SLIDER_ACCENT[key]}`}
                />
                {isViolating && (
                  <p className="text-[10px] font-bold text-orange-600 mt-1">
                    ⚠️ متقدم بأكثر من طور عن بقية المباني — سيمنعه نظام التوازن عند الربط بالذكاء الاصطناعي
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
