import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const [flags, setFlags] = useState({
    enableAIAssistant: true,
    enableGamifiedStreak: false,
    enableRealtimeAlerts: true,
    enableMultiFamilySavings: false,
  });

  const toggleFlag = (flagName: keyof typeof flags) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName],
    }));
  };

  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl text-right text-white relative overflow-hidden">
      {/* Decorative styling */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-500/10 blur-xl"></div>
      <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-rose-500/10 blur-xl"></div>

      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all font-sans"
        >
          ➜ العودة للرئيسية
        </button>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-orange-400 flex items-center justify-end gap-2">
            <span>لوحة تحكم المطورين (God Mode) 🛠️</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            إدارة وتفعيل ميزات تطبيق نماء العائلي التجريبية
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-200">أعلام الميزات (Feature Flags)</h3>
        
        <div className="space-y-3">
          {Object.entries(flags).map(([key, value]) => {
            const flagKey = key as keyof typeof flags;
            let title = '';
            let desc = '';
            
            if (flagKey === 'enableAIAssistant') {
              title = 'تفعيل الذكاء الاصطناعي الاستشاري 🤖';
              desc = 'تفعيل التوجيه التلقائي المعتمد على الذكاء الاصطناعي للأباء والأبناء.';
            } else if (flagKey === 'enableGamifiedStreak') {
              title = 'تفعيل سلاسل التوفير الأسبوعية 🔥';
              desc = 'تحفيز الأطفال بنظام المكافآت عند الاستمرار بالتوفير لعدة أسابيع.';
            } else if (flagKey === 'enableRealtimeAlerts') {
              title = 'إشعارات سحب مصروف الجيب الفورية 🔔';
              desc = 'إرسال إشعار فوري لولي الأمر عند قيام الأطفال بعمليات سحب.';
            } else if (flagKey === 'enableMultiFamilySavings') {
              title = 'تحديات الادخار المشتركة بين العائلات 🏆';
              desc = 'تمكين التنافس الإيجابي والتعاون بين عدة عوائل في التوفير.';
            }

            return (
              <div
                key={key}
                onClick={() => toggleFlag(flagKey)}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl transition-all duration-200 cursor-pointer select-none"
              >
                {/* Switch widget */}
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-orange-500' : 'bg-slate-800'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${value ? '-translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                
                {/* Switch Text */}
                <div className="text-right space-y-0.5">
                  <span className="font-bold text-sm text-white block">{title}</span>
                  <span className="text-[11px] text-slate-400 block font-sans">{desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 border-t border-white/5 pt-4 text-center text-xs text-slate-500 font-sans">
        نسخة النظام التجريبية v1.0.0
      </div>
    </div>
  );
}
