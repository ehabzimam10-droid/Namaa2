import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VillageBoard from '../components/village/VillageBoard';

export default function KidCastlePage() {
  const navigate = useNavigate();
  const { kids, profile } = useApp();

  // Find current active kid from context
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // Initialize building levels in local component state for dynamic manual simulation
  const [bankLevel, setBankLevel] = useState<number>(kid?.bank_level || 3);
  const [farmLevel, setFarmLevel] = useState<number>(kid?.farm_level || 3);
  const [marketLevel, setMarketLevel] = useState<number>(kid?.market_level || 3);
  const [centerLevel, setCenterLevel] = useState<number>(kid?.center_level || 3);

  if (!kid) return null;

  return (
    <div className="w-full space-y-8 text-right font-sans pb-12">
      {/* Header Panel */}
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
            <h2 className="text-xs font-semibold text-orange-400">التمثيل البصري ثلاثي الأبعاد لنموك المالي وسلوكك</h2>
            <h3 className="text-2xl font-black text-white mt-1">القرية الافتراضية ثلاثية الأبعاد 2.5D 🏰</h3>
          </div>
        </div>
      </div>

      {/* Floating Castle Section */}
      <div className="text-center space-y-3">
        <span className="text-[10px] text-purple-400 font-extrabold tracking-widest block">مملكتك العائمة في السحاب ☁️</span>
        <h4 className="text-lg font-black text-white">قلعة نماء الأسطورية 🏰</h4>
        
        {/* Waving Golden Purple Castle SVG */}
        <div className="relative flex justify-center items-center py-4 overflow-visible min-h-[220px]">
          <div className="absolute w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <svg 
            viewBox="0 0 400 240" 
            className="w-full max-w-sm h-auto mx-auto overflow-visible filter drop-shadow-[0_15px_30px_rgba(138,79,255,0.2)] animate-pulse"
            style={{ animationDuration: '4s' }}
          >
            <defs>
              <linearGradient id="castleGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE875" />
                <stop offset="100%" stopColor="#D9A822" />
              </linearGradient>
              <linearGradient id="castlePurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9b5de5" />
                <stop offset="100%" stopColor="#5c3b8c" />
              </linearGradient>
            </defs>

            {/* Cloud Bed behind */}
            <path d="M 50 180 Q 80 160 110 180 Q 140 160 170 180 Q 200 160 230 180 Q 260 160 290 180 Q 320 160 350 180 L 350 220 L 50 220 Z" fill="#FFF" opacity="0.08" />

            {/* Far Left Flanking Tower */}
            <rect x="100" y="110" width="25" height="70" fill="#B38F00" stroke="#7A6303" strokeWidth="1.5" />
            <polygon points="95,110 112.5,80 130,110" fill="url(#castlePurple)" stroke="url(#castleGold)" strokeWidth="1.5" />
            
            {/* Far Right Flanking Tower */}
            <rect x="275" y="110" width="25" height="70" fill="#B38F00" stroke="#7A6303" strokeWidth="1.5" />
            <polygon points="270,110 287.5,80 305,110" fill="url(#castlePurple)" stroke="url(#castleGold)" strokeWidth="1.5" />

            {/* Connecting Walls */}
            <rect x="125" y="130" width="25" height="50" fill="#C29D0A" stroke="#7A6303" strokeWidth="1" />
            <rect x="250" y="130" width="25" height="50" fill="#C29D0A" stroke="#7A6303" strokeWidth="1" />

            {/* Left Tower of Gatehouse */}
            <rect x="150" y="90" width="25" height="90" fill="#D9A822" stroke="#967005" strokeWidth="1.5" />
            <polygon points="145,90 162.5,60 180,90" fill="url(#castlePurple)" stroke="url(#castleGold)" strokeWidth="1.5" />
            
            {/* Right Tower of Gatehouse */}
            <rect x="225" y="90" width="25" height="90" fill="#D9A822" stroke="#967005" strokeWidth="1.5" />
            <polygon points="220,90 237.5,60 255,90" fill="url(#castlePurple)" stroke="url(#castleGold)" strokeWidth="1.5" />

            {/* Central Gatehouse middle */}
            <rect x="175" y="120" width="50" height="60" fill="#E6B800" stroke="#967005" strokeWidth="1.5" />

            {/* Central Main Keep Tower (Tallest) */}
            <rect x="180" y="60" width="40" height="60" fill="#FFE875" stroke="#967005" strokeWidth="2" />
            <polygon points="175,60 200,20 225,60" fill="url(#castlePurple)" stroke="url(#castleGold)" strokeWidth="2" />

            {/* Arched main gate door */}
            <path d="M 188,180 C 188,162 212,162 212,180 Z" fill="#5C4027" stroke="url(#castleGold)" strokeWidth="1.5" />

            {/* Fluffy Front Clouds covering base */}
            <ellipse cx="90" cy="195" rx="50" ry="22" fill="#202A44" opacity="0.4" />
            <ellipse cx="160" cy="205" rx="60" ry="28" fill="#202A44" opacity="0.5" />
            <ellipse cx="240" cy="205" rx="65" ry="30" fill="#202A44" opacity="0.5" />
            <ellipse cx="310" cy="195" rx="50" ry="22" fill="#202A44" opacity="0.4" />
            
            <ellipse cx="110" cy="205" rx="40" ry="16" fill="#FFF" opacity="0.3" />
            <ellipse cx="180" cy="215" rx="55" ry="20" fill="#FFF" opacity="0.4" />
            <ellipse cx="260" cy="215" rx="50" ry="18" fill="#FFF" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#111C2E]/60 border border-white/10 p-5 rounded-3xl text-xs leading-relaxed text-slate-350">
        <strong>💡 دليل معالم قريتك الافتراضية المربوطة بسلوكك:</strong>
        <ul className="list-disc pr-5 mt-2 space-y-1.5 text-slate-400">
          <li><strong>البنك العائلي 💰 (مستوى {bankLevel}):</strong> ينمو ويتزين بالذهب بناءً على التزامك بادخار الأموال بانتظام.</li>
          <li><strong>واحة التبرعات 💚 (مستوى {farmLevel}):</strong> تصبح خضراء ويفيض بئرها بالماء العذب عند مشاركتك المجتمعية بالخير والتبرع.</li>
          <li><strong>سوق الاستثمار 📈 (مستوى {marketLevel}):</strong> يمتلئ بالخيام والنشاط التجاري مع زيادة حجم استثماراتك في المشاريع العائلية.</li>
          <li><strong>المركز الرئيسي 🏛️ (مستوى {centerLevel}):</strong> قصر قريتك الذي يعكس شموخه وجماله مستواك المالي الشامل والتزامك بأهدافك.</li>
        </ul>
      </div>

      {/* Center Section: Render the 2.5D Isometric Village Board (Saved Locally in Sliders State) */}
      <div className="flex items-center justify-center bg-[#0D1527]/40 border border-white/5 rounded-3xl p-6 shadow-inner relative overflow-hidden min-h-[420px]">
        {/* Glowing background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

        <VillageBoard
          levels={{
            bank: bankLevel,
            farm: farmLevel,
            market: marketLevel,
            center: centerLevel,
          }}
          kidId={kid.id}
        />
      </div>

      {/* Developer Controls Glass Panel */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-6">
        <div className="border-b border-white/5 pb-3">
          <h4 className="text-sm font-black text-orange-400">لوحة تحكيم وتطوير المطورين (Developer Controls) 🛠️</h4>
          <p className="text-[10px] text-slate-400 mt-1 font-sans">
            اسحب مؤشرات التمرير أدناه للتحكم في مستوى كل مبنى على حدة (من 1 إلى 5) لمعاينة التغيرات الهندسية ومستويات الجمال المدمجة محلياً بدون تعديل السيرفر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1: Center Palace */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans text-slate-400 font-bold">المستوى: {centerLevel}</span>
              <span className="text-xs font-black text-white">المركز الرئيسي (قصر البلدية) 🏛️</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={centerLevel}
              onChange={(e) => setCenterLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Slider 2: Bank Vault */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans text-slate-400 font-bold">المستوى: {bankLevel}</span>
              <span className="text-xs font-black text-white">البنك العائلي (الادخار) 💰</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={bankLevel}
              onChange={(e) => setBankLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Slider 3: Farm Oasis */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans text-slate-400 font-bold">المستوى: {farmLevel}</span>
              <span className="text-xs font-black text-white">واحة التبرعات (الصدقة) 💚</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={farmLevel}
              onChange={(e) => setFarmLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Slider 4: Market Tent */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans text-slate-400 font-bold">المستوى: {marketLevel}</span>
              <span className="text-xs font-black text-white">سوق الاستثمار العائلي 📈</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={marketLevel}
              onChange={(e) => setMarketLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
