import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setProfile } = useApp();
  const [loadingUser, setLoadingUser] = useState<string | null>(null);

  const handleLogin = (userRole: 'father' | 'kid', destination: string) => {
    setLoadingUser(userRole);
    const name = userRole === 'father' ? 'أبو خالد' : 'سالم';
    setProfile({ name, role: userRole });
    // Simulate minor delay for premium feel
    setTimeout(() => {
      navigate(destination);
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 p-8 bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl text-right text-white relative overflow-hidden">
      {/* Decorative Brand Shapes */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#8c7355]/10 blur-xl"></div>
      <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-emerald-500/10 blur-xl"></div>

      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#8c7355] to-[#111C2E] border border-white/10 text-3xl mb-2">
          🍃
        </div>
        <h2 className="text-2xl font-black bg-gradient-to-r from-orange-400 to-[#8c7355] bg-clip-text text-transparent animate-pulse">
          بوابة دخول نماء العائلية
        </h2>
        <p className="text-xs text-slate-300 font-sans">
          اختر حسابك لبدء رحلة التوفير والمسؤولية المالية
        </p>
      </div>

      <div className="space-y-4">
        {/* Father Button */}
        <button
          onClick={() => handleLogin('father', '/father')}
          disabled={loadingUser !== null}
          className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-[#8c7355]/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 group focus:outline-none"
        >
          <div className="text-left font-sans flex items-center gap-2">
            <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">دخول ➜</span>
            {loadingUser === 'father' ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <span className="text-slate-400 text-lg">👤</span>
            )}
          </div>
          <div className="text-right space-y-1">
            <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition-colors">
              دخول كولي أمر أبو خالد
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              إدارة الحسابات، تكليف المهام واعتماد المكافآت
            </p>
          </div>
        </button>

        {/* Kid Button */}
        <button
          onClick={() => handleLogin('kid', '/kid')}
          disabled={loadingUser !== null}
          className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 group focus:outline-none"
        >
          <div className="text-left font-sans flex items-center gap-2">
            <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">دخول ➜</span>
            {loadingUser === 'kid' ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <span className="text-slate-400 text-lg">👦</span>
            )}
          </div>
          <div className="text-right space-y-1">
            <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
              دخول كابن سالم
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              تصفح القلعة، إدارة المدخرات والتبرع للمجتمع
            </p>
          </div>
        </button>
      </div>

      <div className="mt-8 text-center border-t border-white/5 pt-4">
        <button
          onClick={() => navigate('/dev')}
          className="text-xs text-slate-500 hover:text-[#8c7355] transition-colors font-sans"
        >
          لوحة تحكم المطورين (God Mode) 🛠️
        </button>
      </div>
    </div>
  );
}
