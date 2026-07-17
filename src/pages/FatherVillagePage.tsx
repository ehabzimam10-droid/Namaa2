import { useState } from 'react';
import { useApp } from '../context/AppContext';
import VillageBoard from '../components/village/VillageBoard';
import type { Kid } from '../data/mockData';

export default function FatherVillagePage() {
  const { profile, kids } = useApp();
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);

  // Father overall family castle level
  const familyCastleLevel = profile?.family_castle_level || 3;

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

  return (
    <div className="w-full space-y-8 text-right font-sans relative">
      {/* Header Panel */}
      <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C66E4E]/5 blur-2xl"></div>
        <div>
          <h2 className="text-xs font-semibold text-[#C66E4E]">استكشاف نمو الأبناء ومملكة نماء العائلية المشتركة</h2>
          <h3 className="text-2xl font-black text-[#0C2341] mt-1">مملكة نماء العائلية الكبرى 🏰</h3>
        </div>
      </div>

      {/* Main Layout containing Outposts and the Center Board */}
      <div className="relative w-full min-h-[680px] bg-white border border-[#0C2341]/10 rounded-3xl p-6 overflow-visible flex flex-col items-center justify-between gap-6 shadow-sm">
        
        {/* Glowing background highlights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#C66E4E]/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#8B84D7]/5 blur-3xl pointer-events-none"></div>

        {/* Backgound/Corners: Clickable Outposts representing kids' villages */}
        <div className="w-full flex justify-between items-center z-10 px-4">
          {/* Outpost 1: Khalid's Village (Top-Left) */}
          {(() => {
            const khalid = kids.find(k => k.name === 'خالد') || kids[0];
            if (!khalid) return null;
            return (
              <button
                type="button"
                onClick={() => setSelectedKid(khalid)}
                className="flex items-center gap-3 bg-[#0C2341]/5 hover:bg-[#0C2341]/10 border border-[#0C2341]/10 hover:border-[#8B84D7]/40 p-4 rounded-2xl transition-all duration-350 shadow-md hover:scale-105 active:scale-95 group text-right focus:outline-none text-[#0C2341]"
              >
                <div className="text-2xl p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:border-blue-500/50 transition-all">
                  🏰
                </div>
                <div>
                  <span className="text-[10px] text-blue-600 font-bold block">موقع استكشاف خارجي</span>
                  <span className="text-xs font-black text-[#0C2341] block font-sans">قرية خالد 👦➜</span>
                </div>
              </button>
            );
          })()}

          {/* Outpost 2: Salem's Village (Top-Right) */}
          {(() => {
            const salem = kids.find(k => k.name === 'سالم') || kids[1];
            if (!salem) return null;
            return (
              <button
                type="button"
                onClick={() => setSelectedKid(salem)}
                className="flex items-center gap-3 bg-[#0C2341]/5 hover:bg-[#0C2341]/10 border border-[#0C2341]/10 hover:border-emerald-500/40 p-4 rounded-2xl transition-all duration-350 shadow-md hover:scale-105 active:scale-95 group text-right focus:outline-none text-[#0C2341]"
              >
                <div className="text-2xl p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all">
                  🏰
                </div>
                <div>
                  <span className="text-[10px] text-emerald-600 font-bold block">موقع استكشاف خارجي</span>
                  <span className="text-xs font-black text-[#0C2341] block font-sans">قرية سالم 👦➜</span>
                </div>
              </button>
            );
          })()}
        </div>

        {/* Center: The Grand Family Kingdom (Center Castle + 4 Family Buildings inside the Wall) */}
        <div className="w-full max-w-2xl py-6 z-0 flex flex-col items-center">
          <div className="text-center space-y-1 mb-8">
            <span className="text-[10px] text-[#C66E4E] font-bold block">المملكة العائلية الموحدة</span>
            <h4 className="text-lg font-black text-[#0C2341]">قلعة نماء الكبرى والأسوار المحصنة 🏰🛡️</h4>
            <p className="text-[10px] text-slate-500 font-sans font-bold">تتطور مبانيها بمتوسط إنجاز الأبناء والقلعة المركزية مربوطة بالمستوى العام للعائلة</p>
          </div>

          <VillageBoard
            levels={{
              bank: averageBank,
              farm: averageFarm,
              market: averageMarket,
              center: familyCastleLevel,
            }}
            wallLevel={familyCastleLevel}
          />
        </div>

        {/* Bottom indicator details */}
        <div className="w-full max-w-lg bg-[#0C2341]/5 border border-[#0C2341]/10 p-4 rounded-2xl text-center text-xs leading-relaxed text-slate-600 z-10">
          🏰 <strong>المملكة العائلية</strong> تجمع مستويات الادخار والتبرع والاستثمار لكافة أفراد العائلة بشكل مشترك.
          الأسوار الخارجية الحصينة تزداد قوة وجمالاً مع ارتقاء مستوى القلعة المركزية المشتركة (مستواها الحالي: <span className="font-bold text-[#C66E4E]">{familyCastleLevel}</span>).
        </div>
      </div>

      {/* Glassmorphic Modal for Kid's detailed 2.5D village view */}
      {selectedKid && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0C2341]/40 backdrop-blur-md animate-fade-in text-[#0C2341]">
          <div className="relative w-full max-w-2xl bg-white border border-[#0C2341]/10 shadow-2xl rounded-[28px] p-6 text-right font-sans overflow-hidden">
            <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#8B84D7]/5 blur-2xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#0C2341]/5 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setSelectedKid(null)}
                className="text-slate-500 hover:text-[#0C2341] text-xs bg-[#0C2341]/5 hover:bg-[#0C2341]/10 px-3 py-1.5 rounded-xl border border-[#0C2341]/10 transition-all font-sans"
              >
                ✕ إغلاق
              </button>
              <div>
                <h4 className="font-extrabold text-sm text-[#0C2341]">قرية الابن الخاصة: {selectedKid.name} 👦🏰</h4>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5 font-bold">منظور ثلاثي الأبعاد تفاعلي لمباني قريته الحقيقية (منزل القصر + مبانيه الشخصية الـ 3)</p>
              </div>
            </div>

            {/* Content: Reusing VillageBoard */}
            <div className="flex items-center justify-center py-6 min-h-[400px]">
              <VillageBoard
                levels={{
                  bank: selectedKid.bank_level || 3,
                  farm: selectedKid.farm_level || 3,
                  market: selectedKid.market_level || 3,
                  center: selectedKid.center_level || 3,
                }}
                wallLevel={selectedKid.center_level || 3}
              />
            </div>

            {/* Bottom info row */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 bg-[#0C2341]/5 p-3 rounded-2xl border border-[#0C2341]/10 font-sans">
              <span className="font-bold text-[#C66E4E]">سلوك مالي حي</span>
              <span>تتم محاكاة قريته بناءً على مدخراته في حصالة دوري العائلة وتبرعاته واستثماراته</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
