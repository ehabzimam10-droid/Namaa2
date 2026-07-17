import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidInvestmentsPage() {
  const navigate = useNavigate();
  const { kids, profile, projects, investInProject, showToast } = useApp();
  
  // Find current active kid
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // States for custom investment inputs and loading status per project
  const [investAmounts, setInvestAmounts] = useState<Record<string, number>>({});
  const [investLoading, setInvestLoading] = useState<Record<string, boolean>>({});

  const handleInvestClick = (projectId: string, projectTitle: string) => {
    const amount = investAmounts[projectId] || 0;
    if (amount <= 0 || amount > kid.balance) return;

    setInvestLoading((prev) => ({ ...prev, [projectId]: true }));

    // Simulate a secure transaction loading time of 800ms
    setTimeout(async () => {
      await investInProject(kid.name, projectId, amount);
      setInvestLoading((prev) => ({ ...prev, [projectId]: false }));
      setInvestAmounts((prev) => ({ ...prev, [projectId]: 0 }));
      showToast(`تهانينا! 🎉 تم استثمار ${amount} ريال في مشروع "${projectTitle}" بنجاح! 📈💰`, 'success');
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
            <h2 className="text-xs font-semibold text-[#C66E4E]">مشاريع الاستثمار العائلي المشترك</h2>
            <h3 className="text-2xl font-black text-[#0C2341] mt-1">الاستثمار العائلي 📈</h3>
          </div>
        </div>
      </div>

      {/* Balance display cards & AI Advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Savings Display */}
        <div className="bg-white border border-[#0C2341]/10 shadow-sm p-5 rounded-3xl text-right flex flex-col justify-between text-[#0C2341]">
          <span className="text-xs text-slate-500 font-bold">الرصيد المتاح للاستثمار</span>
          <span className="text-2xl font-extrabold text-[#0C2341] mt-2 font-sans">
            {kid.balance} <span className="text-sm font-bold text-[#C66E4E]">ريال</span>
          </span>
        </div>

        {/* AI Tip Banner */}
        <div className="md:col-span-2 bg-[#C66E4E]/10 border border-[#C66E4E]/25 text-[#0C2341] p-5 rounded-3xl text-xs leading-relaxed flex items-center justify-end">
          <div className="text-right">
            <strong>🤖 نصيحة المستشار المالي:</strong> الاستثمار العائلي يساعدك على تنمية مدخراتك من خلال الحصول على نسبة أرباح متوقعة (ROI) 
            عند اكتمال ونجاح المشاريع العائلية المعتمدة من والدك. استثمر بذكاء ووزع مدخراتك!
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#C66E4E]">المشاريع الاستثمارية النشطة 📈</h4>
        
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const customAmount = investAmounts[project.id] || 0;
              const isLoading = investLoading[project.id] || false;
              const percentage = Math.min(Math.round((project.currentInvested / project.totalRequired) * 100), 100);
              const isFullyFunded = project.currentInvested >= project.totalRequired;

              return (
                <div
                  key={project.id}
                  className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 text-right flex flex-col justify-between gap-5 transition-all duration-300 hover:scale-[1.01] hover:border-[#8B84D7]/50 text-[#0C2341]"
                >
                  <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-[#C66E4E]/5 blur-xl"></div>

                  {/* Project Info Header */}
                  <div className="flex justify-between items-start border-b border-[#0C2341]/5 pb-3">
                    <span className="text-xs text-[#C66E4E] font-bold font-sans">
                      العائد المتوقع (ROI): {project.roiPercentage}%
                    </span>
                    <h5 className="font-extrabold text-sm text-[#0C2341]">{project.title}</h5>
                  </div>

                  {/* Funding Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans font-bold">
                      <span>{percentage}% مكتمل</span>
                      <div>
                        <span className="font-bold text-[#0C2341]">{project.currentInvested}</span>
                        <span className="text-slate-500 font-normal"> / {project.totalRequired} ريال</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-[#C66E4E] to-emerald-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Interactive Contribution Form */}
                  <div className="pt-2">
                    {isFullyFunded ? (
                      <div className="w-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 font-bold py-2.5 rounded-xl text-xs text-center font-sans">
                        اكتمل تمويل المشروع بنجاح 🎉📈
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                         <button
                          type="button"
                          disabled={customAmount <= 0 || customAmount > kid.balance || isLoading || kid.balance === 0}
                          className={`text-white text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                            (kid.balance === 0 || (customAmount > 0 && customAmount > kid.balance))
                              ? 'bg-slate-400 opacity-40 cursor-not-allowed active:scale-100'
                              : customAmount <= 0 || isLoading
                                ? 'bg-[#C66E4E] opacity-40 cursor-not-allowed active:scale-100'
                                : 'bg-[#C66E4E] hover:bg-[#C66E4E]/90 transform active:scale-95 shadow-md shrink-0'
                          }`}
                          onClick={() => handleInvestClick(project.id, project.title)}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-1 font-sans">
                              <span className="animate-spin">⏳</span> جاري الاستثمار...
                            </span>
                          ) : (kid.balance === 0 || (customAmount > 0 && customAmount > kid.balance)) ? (
                            <span>الرصيد غير كافٍ 🚫</span>
                          ) : (
                            <span>ساهم 💰</span>
                          )}
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={kid.balance}
                          disabled={kid.balance === 0}
                          value={customAmount === 0 ? '' : customAmount}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            setInvestAmounts((prev) => ({ ...prev, [project.id]: val }));
                          }}
                          placeholder={kid.balance === 0 ? 'رصيدك فارغ 🚫' : 'المبلغ بالريال...'}
                          className={`flex-1 bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-xl px-3 py-1.5 text-left text-[#0C2341] text-xs outline-none placeholder:text-slate-400 transition-all ${
                            kid.balance === 0 ? 'opacity-40 cursor-not-allowed' : 'focus:border-[#C66E4E]'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-center text-xs text-slate-500">
            لا توجد مشاريع استثمارية عائلية نشطة حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
