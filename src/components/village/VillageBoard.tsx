import { useApp } from '../../context/AppContext';
import BankSVG from './BankSVG';
import FarmSVG from './FarmSVG';
import MarketSVG from './MarketSVG';
import CenterSVG from './CenterSVG';
import FortressWall from './FortressWall';

interface VillageBoardProps {
  levels: {
    bank: number;
    farm: number;
    market: number;
    center: number;
  };
  wallLevel?: number; // surrounding fortress wall level
  kidId?: string; // Optional kid ID to fetch real data
}

export default function VillageBoard({ levels, wallLevel, kidId }: VillageBoardProps) {
  const { kids } = useApp();
  const finalWallLevel = wallLevel !== undefined ? wallLevel : levels.center;

  // Find kid or use fallback default mockup values
  const kid = kids.find((k) => k.id === kidId);
  const savingsVal = kid ? kid.saved : 1250;
  const charityVal = kid ? (kid.donationPoints || 50) : 50;
  
  // Calculate investment from mock projects or transactions
  const investmentVal = kid 
    ? (kid.transactions || [])
        .filter((tx) => tx.type === 'withdrawal' && (tx.title.includes('استثمار') || tx.title.includes('مشروع')))
        .reduce((sum, tx) => sum + tx.amount, 0) || 150
    : 150;

  return (
    <div className="relative w-full max-w-lg aspect-square mx-auto flex items-center justify-center p-4 overflow-visible">
      {/* 2D Isometric Village Area (Flat, No 3D clipping) */}
      <div className="w-[360px] h-[360px] relative flex items-center justify-center overflow-visible">
        
        {/* The Flat Ground Board: Oval/Circular Golden Ring with Dark Indigo Fill */}
        <div
          className="absolute w-[360px] h-[190px] top-[105px] left-0 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl"
          style={{
            background: 'radial-gradient(circle, #0F1D38 40%, #070D1B 90%)',
            border: '6px double #FFE875',
            boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 30px rgba(217,168,34,0.25)',
          }}
        >
          {/* Flat Ground roads meeting in the center */}
          <svg className="absolute inset-0 w-full h-full rounded-full pointer-events-none z-0 opacity-25">
            {/* Center crossways */}
            <line x1="180" y1="13" x2="180" y2="177" stroke="#FFE875" strokeWidth="2.5" />
            <line x1="15" y1="95" x2="345" y2="95" stroke="#FFE875" strokeWidth="2.5" />
            {/* Center plaza ellipse */}
            <ellipse cx="180" cy="95" rx="35" ry="18" fill="none" stroke="#FFE875" strokeWidth="2" />
          </svg>

          {/* Surrounding Fortress Wall */}
          <FortressWall level={finalWallLevel} />
        </div>

        {/* -------------------- 2D POSITIONED BUILDINGS (DEPTH SORTED) -------------------- */}

        {/* 1. CENTER PALACE / HOUSE (Center, Depth = 20) */}
        <div
          className="absolute top-[60px] left-[115px] w-[130px] h-[130px] group cursor-pointer z-20 transition-all hover:scale-105"
        >
          <CenterSVG level={levels.center} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">قصر البلدية الرئيسي</span>
            <span className="text-xs font-black text-[#FFD700] whitespace-nowrap">مستوى {levels.center}</span>
          </div>
        </div>

        {/* 2. BANK (Left corner, Depth = 21) */}
        <div
          className="absolute top-[100px] left-[12px] w-[115px] h-[115px] group cursor-pointer z-20 transition-all hover:scale-105"
        >
          <BankSVG level={levels.bank} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">البنك الشخصي (الادخار)</span>
            <span className="text-xs font-black text-orange-400 whitespace-nowrap">مستوى {levels.bank}</span>
          </div>
        </div>

        {/* 3. MARKET (Right corner, Depth = 21) */}
        <div
          className="absolute top-[100px] right-[12px] w-[115px] h-[115px] group cursor-pointer z-20 transition-all hover:scale-105"
        >
          <MarketSVG level={levels.market} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">سوق الاستثمار العائلي</span>
            <span className="text-xs font-black text-amber-400 whitespace-nowrap">مستوى {levels.market}</span>
          </div>
        </div>

        {/* 4. FARM (Bottom/Front corner, Depth = 30) */}
        <div
          className="absolute top-[165px] left-[122px] w-[115px] h-[115px] group cursor-pointer z-30 transition-all hover:scale-105"
        >
          <FarmSVG level={levels.farm} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">واحة التبرعات (الصدقة)</span>
            <span className="text-xs font-black text-emerald-400 whitespace-nowrap">مستوى {levels.farm}</span>
          </div>
        </div>

        {/* -------------------- 2D FLOATING GLASS CARDS (UPRIGHT) -------------------- */}
        
        {/* Left Floating Card: مدخرات (Savings) */}
        <div 
          className="absolute left-[0px] top-[75px] z-40 w-28 bg-[#111C2E]/80 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-2xl text-center flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)' }}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-sm shadow-inner">
            🪙
          </div>
          <span className="text-[9px] text-slate-400 font-bold block">مدخرات</span>
          <span className="text-[11px] font-black text-white font-sans">{savingsVal.toLocaleString()} ر.س</span>
        </div>

        {/* Center-Top Floating Card: صدقة (Charity) */}
        <div 
          className="absolute top-[0px] left-[126px] z-40 w-28 bg-[#111C2E]/80 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-2xl text-center flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)' }}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-sm shadow-inner">
            💚
          </div>
          <span className="text-[9px] text-slate-400 font-bold block">صدقة</span>
          <span className="text-[11px] font-black text-white font-sans">{charityVal.toLocaleString()} ر.س</span>
        </div>

        {/* Right Floating Card: استثمار (Investment) */}
        <div 
          className="absolute right-[0px] top-[75px] z-40 w-28 bg-[#111C2E]/80 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-2xl text-center flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)' }}
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-sm shadow-inner">
            📊
          </div>
          <span className="text-[9px] text-slate-400 font-bold block">استثمار</span>
          <span className="text-[11px] font-black text-white font-sans">{investmentVal.toLocaleString()} ر.س</span>
        </div>
      </div>
    </div>
  );
}
