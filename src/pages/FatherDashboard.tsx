import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function FatherDashboard() {
  const { kids, projects, addProject, transferAllowance } = useApp();

  // Calculate total family balance (sum of all kids' saved amounts)
  const totalBalance = kids.reduce((sum, kid) => sum + kid.saved, 0);

  // States for projects form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjRoi, setNewProjRoi] = useState<number>(10);
  const [newProjRequired, setNewProjRequired] = useState<number>(1000);

  // States for allowance transfer
  const [allowanceAmounts, setAllowanceAmounts] = useState<Record<string, number>>({});
  const [allowanceLoading, setAllowanceLoading] = useState<Record<string, boolean>>({});

  const handleTransferAllowance = async (kidId: string) => {
    const amount = allowanceAmounts[kidId] || 0;
    if (amount <= 0) return;

    setAllowanceLoading((prev) => ({ ...prev, [kidId]: true }));
    
    // Simulate 800ms premium loading delay
    setTimeout(async () => {
      await transferAllowance(kidId, amount);
      setAllowanceLoading((prev) => ({ ...prev, [kidId]: false }));
      setAllowanceAmounts((prev) => ({ ...prev, [kidId]: 0 }));
      alert('تم إرسال المصروف للابن بنجاح سحابياً ومحلياً! 💸✨');
    }, 800);
  };

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    await addProject(newProjTitle, newProjRequired, newProjRoi);
    
    // Reset Form
    setNewProjTitle('');
    setNewProjRoi(10);
    setNewProjRequired(1000);
    setShowAddForm(false);
    alert('تم إضافة المشروع الاستثماري بنجاح! 🚀');
  };

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header Summary */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 md:p-8">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-semibold text-orange-400">لوحة تحكم ولي الأمر</h2>
            <h3 className="text-2xl font-black text-white mt-1">الرئيسية 🏠</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400">إجمالي مدخرات الأبناء المشتركة</span>
            <span className="text-3xl font-extrabold text-white mt-1">
              {totalBalance} <span className="text-base font-bold text-orange-400">ريال</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 5 Glassmorphism Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: القرية الافتراضية */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🏰</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <h4 className="text-lg font-bold text-white">القرية الافتراضية</h4>
              <span className="text-xl">🏰</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              شاهد قلاع أطفالك الافتراضية وهي تنمو وتزدهر مع كل ريال يقومون بادخاره.
            </p>
            
            <div className="pt-2 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block">قلاع نشطة</span>
                <span className="text-sm font-extrabold text-orange-400 mt-1 block">{kids.length} قلاع</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block">أعلى مستوى</span>
                <span className="text-sm font-extrabold text-emerald-400 mt-1 block">مستوى 4 🌟</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-xl text-xs border border-white/10 transition-all">
            استعراض القرية ➜
          </button>
        </div>

        {/* Card 2: المستشار المالي الذكي */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-orange-500/30 shadow-2xl rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🤖</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <h4 className="text-lg font-bold text-white">المستشار المالي الذكي</h4>
              <span className="text-xl">🤖</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تحليل سلوك الأطفال وتوصيات ذكية مخصصة لغرس ثقافة المسؤولية والادخار لديهم.
            </p>
            
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-200">
              💡 <strong>توصية:</strong> خالد صرف 80% من مصروفه، نقترح تكليفه بمهمة منزلية.
            </div>
          </div>
          <button className="w-full mt-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 font-bold py-2 rounded-xl text-xs border border-orange-500/20 transition-all">
            عرض لوحة التوصيات الكاملة 🤖
          </button>
        </div>

        {/* Card 3: معلومات الأبناء */}
        <div className="md:col-span-2 relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 transition-all hover:scale-[1.005] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-10">👦</div>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs text-slate-400 font-sans">{kids.length} أبناء مسجلين</span>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">معلومات الأبناء</h4>
                <span className="text-xl">👦👧</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kids.map((kid) => {
                const savePercent = kid.allowance > 0 ? Math.round((kid.saved / kid.allowance) * 100) : 0;
                const isTransferLoading = allowanceLoading[kid.id] || false;

                return (
                  <div key={kid.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">عمر {kid.age} سنة</span>
                        <span className="font-extrabold text-sm text-white">{kid.name}</span>
                      </div>
                      
                      <div className="flex justify-between text-[11px] text-slate-300 font-sans mt-2">
                        <span>الرصيد المتاح: {kid.balance} ريال</span>
                        <span>نسبة الادخار: {savePercent}%</span>
                      </div>
                      
                      <div className="flex justify-between text-[10px] text-slate-400 font-sans mt-1">
                        <span>الحصالات المقفلة: {kid.saved} ريال</span>
                        <span>المصروف التراكمي: {kid.allowance} ريال</span>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-slate-800/60 overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full ${savePercent < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(savePercent, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Allowance Transfer Form */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        disabled={isTransferLoading || (allowanceAmounts[kid.id] || 0) <= 0}
                        onClick={() => handleTransferAllowance(kid.id)}
                        className={`text-white text-[10px] font-extrabold px-3 py-2 rounded-xl transition-all ${
                          isTransferLoading || (allowanceAmounts[kid.id] || 0) <= 0
                            ? 'bg-orange-500/40 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-orange-500 to-[#8c7355] hover:from-orange-600 hover:to-[#9c8466] transform active:scale-95 shadow-md'
                        }`}
                      >
                        {isTransferLoading ? 'جاري الصرف... ⏳' : 'صرف 💸'}
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={allowanceAmounts[kid.id] !== undefined ? (allowanceAmounts[kid.id] === 0 ? '' : allowanceAmounts[kid.id]) : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setAllowanceAmounts((prev) => ({ ...prev, [kid.id]: val }));
                        }}
                        placeholder="المصروف بالريال..."
                        className="flex-1 bg-[#111C2E]/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-left text-white text-[10px] outline-none placeholder:text-slate-600 font-sans"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 4: إضافة مشروع استثماري */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">📈</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs text-emerald-400 font-bold">{projects.length} مشاريع نشطة</span>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">المشاريع الاستثمارية</h4>
                <span className="text-xl">📈</span>
              </div>
            </div>
            
            {showAddForm ? (
              <form onSubmit={handleAddProjectSubmit} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400">اسم المشروع</label>
                  <input
                    type="text"
                    required
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    placeholder="مثال: متجر كعك منزلي 🍰"
                    className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-1.5 text-right text-white text-xs outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400">العائد متوقع (%)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProjRoi}
                      onChange={(e) => setNewProjRoi(Number(e.target.value))}
                      className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-1.5 text-center text-white text-xs outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400">المبلغ المطلوب</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProjRequired}
                      onChange={(e) => setNewProjRequired(Number(e.target.value))}
                      className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-1.5 text-center text-white text-xs outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    حفظ 💾
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-white/15 text-slate-400 text-[10px] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    إلغاء ✕
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2 text-xs">
                <p className="text-slate-300">
                  قم بإنشاء وتمويل مشاريع حقيقية مع عائلتك لمشاركة عوائد استثمارية تشجيعية.
                </p>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-sans">{projects[0]?.title || 'لا يوجد مشاريع'}</span>
                  <span className="font-bold text-white">آخر مشروع:</span>
                </div>
              </div>
            )}
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-xl text-xs border border-white/10 transition-all flex items-center justify-center gap-1"
            >
              إضافة مشروع استثماري جديد ➕
            </button>
          )}
        </div>

        {/* Card 5: دوري العائلات */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🏆</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <h4 className="text-lg font-bold text-white">دوري العائلات</h4>
              <span className="text-xl">🏆</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تنافس إيجابي وتحديات توفير مشتركة بين العائلات على مستوى الحي أو المدرسة.
            </p>
            
            <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex justify-between items-center text-xs font-sans">
              <span className="text-emerald-400 font-extrabold">المركز الـ 3 🥉</span>
              <span className="text-slate-400">ترتيب عائلة آل مطر:</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-xl text-xs border border-white/10 transition-all">
            استعراض لوحة الصدارة 🏆
          </button>
        </div>

      </div>
    </div>
  );
}
