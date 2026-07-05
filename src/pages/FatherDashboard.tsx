import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FamilyData } from '../data/mockData';

interface FatherDashboardProps {
  familyData: FamilyData;
}

export default function FatherDashboard({ familyData }: FatherDashboardProps) {
  const navigate = useNavigate();
  // Calculate total family balance (sum of all kids' saved amounts)
  const totalBalance = familyData.kids.reduce((sum, kid) => sum + kid.saved, 0);

  // States for reward customization
  const [rewardAmount, setRewardAmount] = useState(20);
  const [rewardType, setRewardType] = useState<'cash' | 'points' | 'custom'>('cash');
  const [customRewardText, setCustomRewardText] = useState('');

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 font-sans text-right">
      {/* Father Header Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 md:p-8 overflow-hidden">
        {/* Subtle glowing decorative background circles */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        
        <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-orange-400">مرحباً بك، ولي الأمر</h2>
            <h3 className="text-3xl font-black text-white mt-1">{familyData.father.name}</h3>
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
          {/* Kid 1 - Khalid */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
                يحتاج اهتمام ⚠️
              </span>
              <h4 className="text-xl font-bold text-white">خالد</h4>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>20%</span>
                <span>نسبة الادخار:</span>
              </div>
              <div className="flex justify-between">
                <span>100 ريال</span>
                <span>المدخرات الحالية:</span>
              </div>
              <div className="flex justify-between">
                <span>500 ريال</span>
                <span>المصروف الأسبوعي:</span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800/50">
              <div className="h-1.5 rounded-full bg-rose-500" style={{ width: '20%' }}></div>
            </div>
          </div>

          {/* Kid 2 - Salem */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                أداء ممتاز 🌟
              </span>
              <h4 className="text-xl font-bold text-white">سالم</h4>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>60%</span>
                <span>نسبة الادخار:</span>
              </div>
              <div className="flex justify-between">
                <span>60 ريال</span>
                <span>المدخرات الحالية:</span>
              </div>
              <div className="flex justify-between">
                <span>100 ريال</span>
                <span>المصروف الأسبوعي:</span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800/50">
              <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: '60%' }}></div>
            </div>
          </div>
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
    </div>
  );
}
