import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function KidRewardsPage() {
  const { profile, kids, redeemReward, showToast } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  const kid = kids.find(k => k.name === profile?.name);
  const points = kid?.donationPoints || 0;
  const redeemedList = kid?.redeemedRewards || [];

  // Available rewards mock list
  const rewardsList = [
    {
      id: 'rew_sony_10',
      title: 'بطاقة شحن PlayStation بقيمة 10$',
      partnerName: 'Sony',
      description: 'شراكة حصرية مع Sony PlayStation لشحن محفظة ألعابك الرقمية والاستمتاع بأحدث الألعاب!',
      cost: 100,
      icon: '🎮',
      badge: 'الأكثر شعبية 🔥',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'rew_jarir_50',
      title: 'قسيمة مشتريات مكتبة جرير بقيمة 50 ريال',
      partnerName: 'Jarir',
      description: 'شراكة معرفية مع مكتبة جرير لشراء الكتب، الأدوات المدرسية، أو الأجهزة الذكية التي تفضلها.',
      cost: 150,
      icon: '📚',
      badge: 'الخيار المعرفي 💡',
      color: 'from-red-500 to-rose-600',
    },
    {
      id: 'rew_cinema',
      title: 'تذكرة سينما وصالات ألعاب ترفيهية',
      partnerName: 'Muvi',
      description: 'تذكرة مجانية لحضور فيلمك المفضل أو تجربة ألعاب حماسية في المراكز الترفيهية الشريكة للبنك.',
      cost: 80,
      icon: '🍿',
      badge: 'ترفيه وعطلات 🎡',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const handleRedeem = async (rewardId: string, title: string, cost: number, partnerName: string) => {
    if (points < cost) {
      showToast('عذراً، نقاطك لا تكفي لاسترداد هذه المكافأة. استمر في إتمام المهام لجمع المزيد! 💪', 'error');
      return;
    }

    setIsRedeeming(rewardId);
    // Simulate brief network delay for premium experience
    setTimeout(async () => {
      try {
        if (kid) {
          await redeemReward(kid.id, rewardId, title, cost, partnerName);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsRedeeming(null);
      }
    }, 800);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('تم نسخ كود المكافأة إلى الحافظة! 📋', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full space-y-6 text-right pb-10" dir="rtl">
      
      {/* Premium Header Card */}
      <div className="bg-gradient-to-r from-[#0C2341] to-[#1a385f] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-7xl opacity-15 select-none">🎁</div>
        <div className="space-y-2 relative z-10">
          <span className="text-[10px] bg-[#C66E4E] text-white px-3 py-1 rounded-full font-bold">
            شراكات بنك الإنماء الاستراتيجية 🏆
          </span>
          <h2 className="text-xl md:text-2xl font-black">متجر مكافآت شركاء نماء</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            استثمر نقاط الدوري التي جمعتها من إتمام مهامك ومسؤولياتك المنزلية والمالية، واستبدلها بمكافآت وقسائم شراء حقيقية مقدمة من شركاء بنك الإنماء!
          </p>
          
          {/* Current Points Info */}
          <div className="pt-4 flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
              <span className="text-lg">🌟</span>
              <div>
                <span className="text-[10px] text-slate-350 block">نقاطك الحالية المتاحة</span>
                <span className="text-base font-black text-amber-350">{points} نقطة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rewards Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-[#0C2341] flex items-center gap-2">
          <span>🎁</span> المكافآت المتاحة للاسترداد
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewardsList.map((reward) => {
            const canAfford = points >= reward.cost;
            return (
              <div 
                key={reward.id} 
                className="bg-white border border-[#0C2341]/10 rounded-3xl p-5 flex flex-col justify-between shadow-sm transition-all hover:shadow-md hover:border-[#8B84D7]/40 relative overflow-hidden"
              >
                {/* Badge tag */}
                <span className="absolute top-4 left-4 text-[9px] font-bold px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-full">
                  {reward.badge}
                </span>

                <div className="space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-stone-50 rounded-2xl border border-stone-100">{reward.icon}</span>
                    <div className="text-right">
                      <span className="text-[9px] text-[#C66E4E] font-black uppercase tracking-wider">{reward.partnerName} Partner</span>
                      <h4 className="text-xs font-bold text-[#0C2341] leading-tight">{reward.title}</h4>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed min-h-[48px]">
                    {reward.description}
                  </p>
                </div>

                {/* Price and Redeem Button */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block">التكلفة بالنقاط</span>
                    <span className="text-sm font-extrabold text-purple-600 font-sans">{reward.cost} <span className="text-[9px] font-bold text-slate-500">نقطة</span></span>
                  </div>

                  <button
                    disabled={isRedeeming !== null}
                    onClick={() => handleRedeem(reward.id, reward.title, reward.cost, reward.partnerName)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      canAfford
                        ? 'bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] text-white shadow-md shadow-[#8B84D7]/15 hover:opacity-95'
                        : 'bg-stone-100 text-slate-400 border border-stone-200 cursor-not-allowed'
                    }`}
                  >
                    {isRedeeming === reward.id ? 'جاري الاسترداد...' : 'استرداد القسيمة 🎁'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeemed Coupons History */}
      <div className="space-y-3 pt-4">
        <h3 className="text-base font-black text-[#0C2341] flex items-center gap-2">
          <span>🎟️</span> قسائمي المستردة
        </h3>
        
        {redeemedList.length === 0 ? (
          <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-8 text-center text-slate-400 text-xs">
            <span className="text-3xl block mb-2">📥</span>
            لم تقم باسترداد أي قسائم مكافآت بعد. اكمل مهامك لجمع النقاط وشحن بطاقتك الأولى!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redeemedList.map((redeemed) => (
              <div 
                key={redeemed.id} 
                className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden"
              >
                {/* Right color stripe depending on partner */}
                <div className={`absolute right-0 top-0 bottom-0 w-2.5 bg-gradient-to-b ${
                  redeemed.partnerName === 'Sony' ? 'from-blue-600 to-indigo-700' :
                  redeemed.partnerName === 'Jarir' ? 'from-red-500 to-rose-600' :
                  'from-amber-500 to-orange-600'
                }`} />

                <div className="pr-4 text-right space-y-1">
                  <span className="text-[9px] text-[#C66E4E] font-black">{redeemed.partnerName} Reward</span>
                  <h4 className="text-xs font-bold text-[#0C2341]">{redeemed.rewardTitle}</h4>
                  <span className="text-[9px] text-slate-400 font-sans block">تاريخ الاسترداد: {redeemed.date}</span>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[9px] text-slate-400 font-sans">كود القسيمة</span>
                  <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-1.5 font-mono text-[10px] font-bold text-[#0C2341]">
                    <button
                      onClick={() => handleCopyCode(redeemed.id, redeemed.code)}
                      className="text-slate-400 hover:text-[#8B84D7] mr-1 active:scale-95 transition-all text-xs"
                      title="نسخ الكود"
                    >
                      {copiedId === redeemed.id ? '✅' : '📋'}
                    </button>
                    <span>{redeemed.code}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
