import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { donationCauses } from '../data/mockData';

export default function KidDonationsPage() {
  const navigate = useNavigate();
  const { kids, profile, addDonation, showToast } = useApp();

  // Find current active kid
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // States for donation amounts per cause ID
  const [amounts, setAmounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const handleDonate = (causeId: number, causeTitle: string) => {
    const amount = amounts[causeId] || 0;
    if (amount <= 0 || amount > kid.balance) return;

    setLoading((prev) => ({ ...prev, [causeId]: true }));

    // Simulate 800ms premium loading delay
    setTimeout(async () => {
      await addDonation(kid.id, amount);
      setAmounts((prev) => ({ ...prev, [causeId]: 0 }));
      setLoading((prev) => ({ ...prev, [causeId]: false }));
      showToast(`شكراً لمساهمتك الكريمة بقيمة ${amount} ريال في مبادرة "${causeTitle}"! 💚🤲`, 'success');
    }, 800);
  };

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
            <h2 className="text-xs font-semibold text-[#C66E4E]">تبرع للمسؤولية المجتمعية والمشاريع الخيرية</h2>
            <h3 className="text-2xl font-black text-[#0C2341] mt-1">بوابة التبرعات العائلية 🤲</h3>
          </div>
        </div>
      </div>

      {/* Balance Summary Banner */}
      <div className="flex justify-between items-center bg-[#C66E4E]/10 border border-[#C66E4E]/25 text-[#0C2341] p-4 rounded-2xl text-xs">
        <div className="flex items-center gap-1 font-bold text-sm">
          <span>{kid.balance}</span>
          <span>ريال</span>
        </div>
        <strong>رصيدك المتاح للتبرع:</strong>
      </div>

      {/* Grid of Donation Causes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {donationCauses.map((cause) => {
          const customAmount = amounts[cause.id] || 0;
          const isCauseLoading = loading[cause.id] || false;
          const isInsufficient = customAmount > kid.balance;
          const isZeroOrNegative = customAmount <= 0;
          const isDisabled = isZeroOrNegative || isInsufficient || isCauseLoading || kid.balance === 0;

          return (
            <div
              key={cause.id}
              className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 text-right flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.01] hover:border-[#8B84D7]/50 text-[#0C2341]"
            >
              <div className="absolute left-0 top-0 -z-10 h-full w-24 bg-[#C66E4E]/5 blur-xl"></div>
              
              {/* Cause Info */}
              <div className="border-b border-[#0C2341]/5 pb-3 flex justify-between items-center">
                <span className="text-2xl">💚</span>
                <h4 className="font-bold text-sm text-[#0C2341]">{cause.title}</h4>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                ساهم في هذه المبادرة الإنسانية لمساعدة الآخرين وكسب نقاط تبرع لرفع ترتيبك العائلي!
              </p>

              {/* Input and Action Button */}
              <div className="space-y-3 pt-2">
                <input
                  type="number"
                  min="1"
                  max={kid.balance}
                  disabled={kid.balance === 0}
                  value={customAmount === 0 ? '' : customAmount}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                    setAmounts((prev) => ({ ...prev, [cause.id]: val }));
                  }}
                  placeholder={kid.balance === 0 ? 'رصيدك فارغ 🚫' : 'المبلغ بالريال...'}
                  className={`w-full bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-xl px-3 py-2 text-left text-[#0C2341] text-xs outline-none placeholder:text-slate-400 transition-all ${
                    kid.balance === 0 ? 'opacity-40 cursor-not-allowed' : 'focus:border-[#C66E4E]'
                  }`}
                />

                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDonate(cause.id, cause.title)}
                  className={`w-full text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    kid.balance === 0 || isInsufficient
                      ? 'bg-slate-400 opacity-40 cursor-not-allowed active:scale-100'
                      : isZeroOrNegative || isCauseLoading
                        ? 'bg-[#C66E4E] opacity-40 cursor-not-allowed active:scale-100'
                        : 'bg-[#C66E4E] hover:bg-[#C66E4E]/90 active:scale-95 shadow-md'
                  }`}
                >
                  {isCauseLoading ? (
                    <span className="flex items-center gap-1 font-sans">
                      <span className="animate-spin">⏳</span> جاري التبرع...
                    </span>
                  ) : kid.balance === 0 || isInsufficient ? (
                    <span>الرصيد غير كافٍ 🚫</span>
                  ) : (
                    <span>تبرع للمبادرة 🤲</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
