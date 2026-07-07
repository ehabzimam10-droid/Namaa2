import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function FatherDashboard() {
  const navigate = useNavigate();
  const { kids, projects, addProject, approveTask } = useApp();

  // Calculate total family balance (sum of all kids' saved amounts)
  const totalBalance = kids.reduce((sum, kid) => sum + kid.saved, 0);

  // States for projects
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjRoi, setNewProjRoi] = useState<number>(10);
  const [newProjRequired, setNewProjRequired] = useState<number>(1000);
  const [newProjInvested, setNewProjInvested] = useState<number>(0);

  // States for reward customization
  const [rewardAmount, setRewardAmount] = useState(20);
  const [rewardType, setRewardType] = useState<'cash' | 'points' | 'custom'>('cash');
  const [customRewardText, setCustomRewardText] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    addProject(newProjTitle, newProjRequired, newProjRoi);
    
    // Reset Form
    setNewProjTitle('');
    setNewProjRoi(10);
    setNewProjRequired(1000);
    setNewProjInvested(0);
    setShowAddForm(false);
  };

  const handleApproveTask = () => {
    approveTask(
      'kid_khalid',
      'المساعدة في أعمال المنزل 🧹',
      rewardAmount,
      rewardType,
      rewardType === 'custom' ? customRewardText : undefined
    );
    alert('تم اعتماد المهمة وإرسالها لخالد بنجاح! ✅');
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 font-sans text-right">
      {/* Father Header Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 md:p-8 overflow-hidden">
        {/* Subtle glowing decorative background circles */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        
        <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-orange-400">مرحباً بك، ولي الأمر</h2>
            <h3 className="text-3xl font-black text-white mt-1">أبو خالد</h3>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0 justify-between md:justify-end w-full md:w-auto">
            <button
              onClick={() => navigate('/')}
              className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-all border border-white/5 order-2 md:order-1"
            >
              تسجيل الخروج ➜
            </button>
            <div className="flex flex-col items-end text-right order-1 md:order-2">
              <span className="text-xs text-slate-400">إجمالي مدخرات الأبناء</span>
              <span className="text-3xl font-extrabold text-white mt-1">
                {totalBalance} <span className="text-lg font-bold text-orange-400">ريال</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kids Summary Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">
          ملخص حسابات الأبناء
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kids.map((kid) => {
            const savingPercent = Math.round((kid.saved / kid.allowance) * 100);
            const needsAttention = savingPercent < 50;
            return (
              <div key={kid.id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  {needsAttention ? (
                    <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
                      يحتاج اهتمام ⚠️
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                      أداء ممتاز 🌟
                    </span>
                  )}
                  <h4 className="text-xl font-bold text-white">{kid.name}</h4>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>{savingPercent}%</span>
                    <span>نسبة الادخار:</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{kid.saved} ريال</span>
                    <span>المدخرات الحالية:</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{kid.allowance} ريال</span>
                    <span>المصروف الأسبوعي:</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800/50">
                  <div
                    className={`h-1.5 rounded-full ${needsAttention ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(savingPercent, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Coach Panel */}
      <div className="bg-white/5 backdrop-blur-xl border border-orange-500/50 shadow-lg shadow-orange-500/10 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-4">
          <h3 className="text-xl font-bold text-white">المستشار المالي الذكي 🤖</h3>
        </div>

        <p className="text-slate-200 text-base leading-relaxed">
          تحليل السلوك: لاحظنا أن خالد قام بصرف معظم ميزانيته على الألعاب. نقترح تكليفه بمهمة (المساعدة في أعمال المنزل) بالمكافأة التالية:
        </p>

        {/* Reward Control Row */}
        <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <span className="text-sm font-semibold text-slate-300">المكافأة المقترحة:</span>
          
          <div className="flex flex-1 sm:flex-initial items-center gap-3 justify-end w-full sm:w-auto">
            {/* Conditional Input Rendering */}
            {rewardType === 'custom' ? (
              <input
                type="text"
                value={customRewardText}
                onChange={(e) => setCustomRewardText(e.target.value)}
                placeholder="مثال: ساعتين لعب إضافية بالسوني..."
                className="flex-1 sm:w-64 bg-transparent border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-3 py-1.5 text-right text-white font-semibold outline-none transition-all duration-200 text-sm"
              />
            ) : (
              <input
                type="number"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(Number(e.target.value))}
                min="1"
                className="w-20 bg-transparent border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-2 py-1.5 text-center text-white font-bold outline-none transition-all duration-200"
              />
            )}
            
            {/* Segmented Control Type Toggle */}
            <div className="grid grid-cols-3 gap-1 bg-white/5 border border-white/10 p-1 rounded-xl w-56 shrink-0">
              <button
                type="button"
                onClick={() => setRewardType('custom')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all duration-200 ${
                  rewardType === 'custom'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                مخصصة
              </button>
              <button
                type="button"
                onClick={() => setRewardType('points')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all duration-200 ${
                  rewardType === 'points'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                نقطة
              </button>
              <button
                type="button"
                onClick={() => setRewardType('cash')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all duration-200 ${
                  rewardType === 'cash'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                ريال
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-row-reverse gap-4 pt-2">
          <button 
            type="button"
            onClick={handleApproveTask}
            className="flex-1 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-orange-500/20 text-center"
          >
            اعتماد المهمة ✅
          </button>
          <button 
            type="button"
            className="flex-1 border border-white/20 hover:bg-white/10 active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 text-center"
          >
            رفض ❌
          </button>
        </div>
      </div>

      {/* Family Investments Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 space-y-6">
        <div className="flex flex-row-reverse items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-xl font-bold text-white">مشاريع العائلة الاستثمارية 📈</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-[#8c7355] to-[#009639] hover:from-[#9c8466] hover:to-[#00a840] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md flex items-center gap-1"
          >
            إضافة مشروع جديد ➕
          </button>
        </div>

        {/* Add Project Form (Interactive & Sleek) */}
        {showAddForm && (
          <form onSubmit={handleAddProject} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-orange-400 text-right">إنشاء مشروع استثماري جديد</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="space-y-1">
                <label className="block text-xs text-slate-400">اسم المشروع</label>
                <input
                  type="text"
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="مثال: مشروع آلة قهوة ☕"
                  className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] focus:ring-1 focus:ring-[#8c7355] rounded-xl px-3 py-2 text-right text-white text-sm outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-slate-400">العائد المتوقع (ROI %)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={newProjRoi}
                  onChange={(e) => setNewProjRoi(Number(e.target.value))}
                  placeholder="10"
                  className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] focus:ring-1 focus:ring-[#8c7355] rounded-xl px-3 py-2 text-right text-white text-sm outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-slate-400">المبلغ المطلوب (ريال)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProjRequired}
                  onChange={(e) => setNewProjRequired(Number(e.target.value))}
                  placeholder="1000"
                  className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] focus:ring-1 focus:ring-[#8c7355] rounded-xl px-3 py-2 text-right text-white text-sm outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-slate-400">المبلغ المستثمر حالياً (ريال)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={newProjRequired}
                  value={newProjInvested}
                  onChange={(e) => setNewProjInvested(Number(e.target.value))}
                  placeholder="200"
                  className="w-full bg-[#111C2E]/60 border border-white/10 focus:border-[#8c7355] focus:ring-1 focus:ring-[#8c7355] rounded-xl px-3 py-2 text-right text-white text-sm outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all active:scale-95"
              >
                حفظ المشروع 💾
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border border-white/20 hover:bg-white/5 text-slate-300 px-5 py-2 rounded-xl text-xs transition-all"
              >
                إلغاء ❌
              </button>
            </div>
          </form>
        )}

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project) => {
            const percentage = Math.min(Math.round((project.currentInvested / project.totalRequired) * 100), 100);
            return (
              <div
                key={project.id}
                className="relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-5 text-right transition-all hover:scale-[1.01] duration-300 flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4"
              >
                {/* Visual copper glow */}
                <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-[#8c7355]/5 blur-xl"></div>
                
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex flex-row-reverse items-center justify-between">
                    <h4 className="text-lg font-bold text-white">{project.title}</h4>
                    <span className="rounded-full bg-[#8c7355]/20 border border-[#8c7355]/30 px-3 py-1 text-xs font-bold text-orange-300">
                      العائد المتوقع (ROI): {project.roiPercentage}%
                    </span>
                  </div>

                  {/* Progress Info */}
                  <div className="flex justify-between items-center text-xs text-slate-300 font-sans mt-2">
                    <span className="font-bold text-orange-400">{percentage}% من الميزانية</span>
                    <div>
                      <span className="font-bold text-white">{project.currentInvested}</span>
                      <span className="text-slate-400"> / {project.totalRequired} ريال</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-800/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-[#8c7355] to-[#009639] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
