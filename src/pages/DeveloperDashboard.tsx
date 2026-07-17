import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useApp } from '../context/AppContext';

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const { setProfile, geminiApiKey, setGeminiApiKey, runCleanup, showToast } = useApp();
  const [loginLoading, setLoginLoading] = useState<string | null>(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  const handleCleanup = async () => {
    setCleanupLoading(true);
    try {
      await runCleanup();
      showToast('تم تنظيف المهام المعتمدة والمنتهية والإشعارات بنجاح من قاعدة البيانات! 🧹✨', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setCleanupLoading(false);
    }
  };

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

  const handleQuickLogin = async (email: string, role: 'father' | 'kid') => {
    setLoginLoading(email);
    try {
      // Attempt sign-in with default password
      await supabase.auth.signInWithPassword({
        email,
        password: 'password123',
      });
      
      const name = email === 'father@namaa.com' ? 'أبو خالد' : email === 'salem@namaa.com' ? 'سالم' : 'خالد';
      setProfile({ name, role });

      if (email === 'father@namaa.com') {
        navigate('/father');
      } else {
        navigate('/kid');
      }
    } catch (err) {
      console.error(err);
      const name = email === 'father@namaa.com' ? 'أبو خالد' : email === 'salem@namaa.com' ? 'سالم' : 'خالد';
      setProfile({ name, role });

      if (email === 'father@namaa.com') {
        navigate('/father');
      } else {
        navigate('/kid');
      }
    } finally {
      setLoginLoading(null);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 bg-white border border-[#0C2341]/10 shadow-2xl rounded-3xl text-right text-[#0C2341] relative overflow-hidden">
      {/* Decorative styling */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#C66E4E]/5 blur-xl"></div>
      <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-[#8B84D7]/5 blur-xl"></div>

      <div className="flex items-center justify-between border-b border-[#0C2341]/5 pb-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-xs bg-[#0C2341]/5 hover:bg-[#0C2341]/10 px-3 py-1.5 rounded-xl border border-[#0C2341]/10 transition-all font-sans text-slate-600 font-bold"
        >
          ➜ العودة للرئيسية
        </button>
        <div className="space-y-1 text-right">
          <h2 className="text-2xl font-black text-[#C66E4E] flex items-center justify-end gap-2">
            <span>لوحة تحكم المطورين (God Mode) 🛠️</span>
          </h2>
          <p className="text-xs text-slate-500 font-sans font-bold">
            إدارة وتفعيل ميزات تطبيق نماء العائلي التجريبية
          </p>
        </div>
      </div>

      {/* Quick Login Section */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-bold text-[#0C2341]">الدخول السريع للحسابات (بوابة المطورين) ⚡</h3>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => handleQuickLogin('father@namaa.com', 'father')}
            disabled={loginLoading !== null}
            className="w-full flex items-center justify-between p-4 bg-[#C66E4E]/5 border border-[#C66E4E]/20 hover:border-[#C66E4E]/50 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group focus:outline-none"
          >
            <span className="text-xs text-[#C66E4E] font-sans group-hover:underline">
              {loginLoading === 'father@namaa.com' ? 'جاري الدخول... ⏳' : 'دخول مباشر ➜'}
            </span>
            <div className="text-right">
              <span className="font-bold text-sm text-[#0C2341] block">حساب الأب (أبو خالد)</span>
              <span className="text-[10px] text-slate-500 block font-sans">البريد الإلكتروني: father@namaa.com</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickLogin('salem@namaa.com', 'kid')}
            disabled={loginLoading !== null}
            className="w-full flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group focus:outline-none"
          >
            <span className="text-xs text-emerald-600 font-sans group-hover:underline">
              {loginLoading === 'salem@namaa.com' ? 'جاري الدخول... ⏳' : 'دخول مباشر ➜'}
            </span>
            <div className="text-right">
              <span className="font-bold text-sm text-[#0C2341] block">حساب الابن (سالم)</span>
              <span className="text-[10px] text-slate-500 block font-sans">البريد الإلكتروني: salem@namaa.com</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickLogin('khalid@namaa.com', 'kid')}
            disabled={loginLoading !== null}
            className="w-full flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/20 hover:border-blue-500/50 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group focus:outline-none"
          >
            <span className="text-xs text-blue-600 font-sans group-hover:underline">
              {loginLoading === 'khalid@namaa.com' ? 'جاري الدخول... ⏳' : 'دخول مباشر ➜'}
            </span>
            <div className="text-right">
              <span className="font-bold text-sm text-[#0C2341] block">حساب الابن (خالد)</span>
              <span className="text-[10px] text-slate-500 block font-sans">البريد الإلكتروني: khalid@namaa.com</span>
            </div>
          </button>
        </div>
      </div>

      {/* AI Key Settings */}
      <div className="space-y-4 mb-8 bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-2xl p-4 text-[#0C2341]">
        <h3 className="text-sm font-bold text-[#0C2341]">إعدادات الذكاء الاصطناعي 🤖</h3>
        <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
          أدخل مفتاح واجهة برمجة تطبيقات Gemini API الخاص بك لتشغيل مستشار نماء الذكي. يتم حفظ هذا المفتاح محليًا فقط في متصفحك لأسباب أمنية.
        </p>
        <div className="space-y-2">
          <label className="block text-xs text-slate-500 font-bold">Gemini API Key</label>
          <input
            type="password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-white border border-[#0C2341]/10 focus:border-[#C66E4E] rounded-xl px-3 py-2.5 text-left text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400 font-sans"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-600">أعلام الميزات (Feature Flags)</h3>
        
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
                className="flex items-center justify-between p-4 bg-white border border-[#0C2341]/10 hover:border-[#C66E4E]/30 rounded-2xl transition-all duration-200 cursor-pointer select-none"
              >
                {/* Switch widget */}
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-[#C66E4E]' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${value ? '-translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                
                {/* Switch Text */}
                <div className="text-right space-y-0.5">
                  <span className="font-bold text-sm text-[#0C2341] block">{title}</span>
                  <span className="text-[11px] text-slate-500 block font-sans font-semibold">{desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulation & Cleanup Section */}
      <div className="space-y-4 mt-8 bg-[#0C2341]/5 border border-[#0C2341]/10 rounded-2xl p-4 text-[#0C2341]">
        <h3 className="text-sm font-bold text-[#0C2341]">إجراءات محاكاة سحابية 🧹</h3>
        <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
          قم بتشغيل محرك تنظيف المهام المعتمدة والمنتهية بالإضافة إلى تنظيف الإشعارات القديمة لمحاكاة مرور الوقت في النظام.
        </p>
        <button
          type="button"
          onClick={handleCleanup}
          disabled={cleanupLoading}
          className="w-full py-3 rounded-xl bg-orange-600/10 hover:bg-orange-600/20 text-[#C66E4E] border border-orange-500/20 hover:border-orange-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1 focus:outline-none disabled:opacity-50"
        >
          {cleanupLoading ? 'جاري التنظيف... ⏳' : 'محاكاة مرور 24 ساعة (تنظيف المهام المنتهية والإشعارات) 🧹'}
        </button>
      </div>

      <div className="mt-8 border-t border-white/5 pt-4 text-center text-xs text-slate-500 font-sans">
        نسخة النظام التجريبية v1.0.0
      </div>
    </div>
  );
}
