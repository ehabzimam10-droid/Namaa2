import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function FatherProjectsPage() {
  const navigate = useNavigate();
  const { projects, addProject, calculateROI, showToast } = useApp();

  // Form states
  const [title, setTitle] = useState('');
  const [required, setRequired] = useState<number | ''>('');
  const [roi, setRoi] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !required || required <= 0 || !roi || roi <= 0) return;

    setIsLoading(true);

    // Simulate 800ms loading delay for premium UX
    setTimeout(async () => {
      await addProject(title.trim(), Number(required), Number(roi));
      setTitle('');
      setRequired('');
      setRoi('');
      setIsLoading(false);
      showToast('تم إضافة المشروع الاستثماري بنجاح! 📈✨', 'success');
    }, 800);
  };

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header and Back Button */}
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
            <h2 className="text-xs font-semibold text-[#C66E4E]">إدارة المشاريع الاستثمارية العائلية المشتركة</h2>
            <h3 className="text-2xl font-black text-[#0C2341] mt-1">مشاريع العائلة الاستثمارية 📈</h3>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#C66E4E]/10 border border-[#C66E4E]/25 text-[#0C2341] p-4 rounded-2xl text-xs leading-relaxed">
        <strong>💡 مشاريع التمويل العائلي المشترك:</strong> يمكنك كأب طرح أفكار استثمارية (مثل شراء آلة قهوة منزلية أو متجر كعك بيتي).
        يقوم الأبناء بتمويل المشاريع من أرصدتهم الحرة لمساعدتك، وسيقوم النظام بتوزيع العائد المتوقع (ROI) عليهم فور اكتمال التمويل لبناء وعي استثماري حقيقي لديهم! ☕🥧
      </div>

      {/* Top Section: Sleek Form to Create New Project */}
      <div className="bg-white border border-[#0C2341]/10 shadow-md rounded-3xl p-6 space-y-4 text-[#0C2341]">
        <h4 className="text-sm font-bold text-[#0C2341]">إضافة مشروع استثماري جديد ➕</h4>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-right">
          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">اسم المشروع الاستثماري</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: متجر كعك منزلي 🍰"
              className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 focus:border-[#C66E4E] rounded-xl px-3 py-2 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">المبلغ المطلوب (ريال)</label>
            <input
              type="number"
              required
              min="1"
              value={required}
              onChange={(e) => setRequired(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 1000"
              className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 focus:border-[#C66E4E] rounded-xl px-3 py-2 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-500 font-bold">العائد الاستثماري المتوقع (%)</label>
            <input
              type="number"
              required
              min="1"
              value={roi}
              onChange={(e) => setRoi(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 10"
              className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 focus:border-[#C66E4E] rounded-xl px-3 py-2 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0C2341] hover:bg-[#8B84D7] text-white font-extrabold py-2.5 rounded-xl text-xs transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin">⏳</span> جاري الحفظ...
              </span>
            ) : (
              <span>إضافة المشروع ➕</span>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Section: Active Projects Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#C66E4E]">مشاريع الاستثمار العائلي الحالية 📈</h4>
        
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => {
              const percent = Math.min(Math.round((proj.currentInvested / proj.totalRequired) * 100), 100);
              return (
                <div
                  key={proj.id}
                  className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 text-right flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.01] hover:border-[#8B84D7]/50 text-[#0C2341]"
                >
                  <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-[#C66E4E]/5 blur-xl"></div>
                  
                  {/* Project Header */}
                  <div className="flex flex-row-reverse items-start justify-between border-b border-[#0C2341]/5 pb-3">
                    <h5 className="font-bold text-sm text-[#0C2341]">{proj.title}</h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/25">
                      العائد المتوقع: {proj.roiPercentage}% ROI 📈
                    </span>
                  </div>

                  {/* Progress Info */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans font-bold">
                      <span>{percent}% مكتمل</span>
                      <div>
                        <span className="font-bold text-[#0C2341]">{proj.currentInvested}</span>
                        <span className="text-slate-500"> / {proj.totalRequired} ريال</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-[#C66E4E] to-emerald-600 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Contributors Section */}
                  <div className="pt-2 border-t border-[#0C2341]/5 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 block">المساهمون:</span>
                    {proj.contributors && Object.keys(proj.contributors).length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 justify-start md:justify-end font-sans">
                        {Object.entries(proj.contributors).map(([name, amount]) => (
                          <span
                            key={name}
                            className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-[#0C2341]/5 border border-[#0C2341]/10 text-[#0C2341]"
                          >
                            {name}: {amount} ريال
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-500 block">لا يوجد مساهمون بعد.</span>
                    )}
                  </div>

                  {/* ROI Returns Section if Fully Funded */}
                  {proj.currentInvested >= proj.totalRequired && (
                    <div className="mt-2 pt-2 border-t border-[#0C2341]/5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3 space-y-1 text-right">
                      <span className="text-[10px] font-extrabold text-emerald-600 block">العوائد المستحقة 💰</span>
                      {proj.contributors && Object.keys(proj.contributors).length > 0 ? (
                        <div className="space-y-1">
                          {Object.entries(proj.contributors).map(([name, amount]) => {
                            const expectedReturn = calculateROI(amount, proj.roiPercentage);
                            return (
                              <div key={name} className="flex justify-between items-center text-[10px] text-slate-600 font-sans">
                                <span>العائد: <strong className="text-emerald-600">{expectedReturn} ريال</strong></span>
                                <span>{name}: دفع <strong className="text-[#0C2341]">{amount}</strong></span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-500 block">لا يوجد مساهمون.</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-center text-xs text-slate-500">
            لا توجد مشاريع استثمارية حالياً. قم بإضافة مشروعك الأول بالأعلى للبدء! ☕🍰
          </div>
        )}
      </div>
    </div>
  );
}
