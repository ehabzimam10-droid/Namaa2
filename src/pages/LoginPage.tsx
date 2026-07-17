import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setProfile } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoadingUser('credentials');

    try {
      let role: 'father' | 'kid' | 'dev' = 'kid';
      let name = '';
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for demo under email confirmation or rate limit constraints
        if (error.message.toLowerCase().includes('confirm') || error.status === 429 || error.status === 400) {
          if (email === 'father@namaa.com') {
            role = 'father';
            name = 'أبو خالد';
          } else if (email === 'salem@namaa.com') {
            role = 'kid';
            name = 'سالم';
          } else if (email === 'khalid@namaa.com') {
            role = 'kid';
            name = 'خالد';
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      } else if (data?.user) {
        // Fetch role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          if (email.includes('father')) {
            role = 'father';
            name = 'أبو خالد';
          } else if (email.includes('salem')) {
            role = 'kid';
            name = 'سالم';
          } else if (email.includes('khalid')) {
            role = 'kid';
            name = 'خالد';
          } else {
            throw new Error('الملف الشخصي غير موجود');
          }
        } else {
          role = profile.role as 'father' | 'kid' | 'dev';
          name = profile.full_name || '';
        }
      }

      // Set profile in Context
      setProfile({ name, role });

      // Redirect based on role
      if (role === 'father') {
        navigate('/father');
      } else if (role === 'kid') {
        navigate('/kid');
      } else if (role === 'dev') {
        navigate('/dev');
      } else {
        setErrorMessage('دور المستخدم غير معروف');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'خطأ في اسم المستخدم أو كلمة المرور');
    } finally {
      setLoadingUser(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 p-8 bg-white/80 backdrop-blur-2xl border border-[#0C2341]/10 shadow-2xl rounded-3xl text-right text-[#0C2341] relative overflow-hidden">
      {/* Decorative Brand Shapes */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#C66E4E]/10 blur-xl"></div>
      <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-[#8B84D7]/10 blur-xl"></div>

      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#C66E4E]/10 to-[#8B84D7]/10 border border-[#0C2341]/10 text-3xl mb-2">
          🍃
        </div>
        <h2 className="text-2xl font-black bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] bg-clip-text text-transparent">
          بوابة دخول نماء العائلية
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          أدخل بيانات حسابك لبدء رحلة التوفير والمسؤولية المالية
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl text-xs font-sans text-center">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleCredentialsLogin} className="space-y-5">
        <div className="space-y-1">
          <label className="block text-xs text-slate-555 mr-1 font-bold">البريد الإلكتروني</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="father@namaa.com"
            className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 focus:border-[#C66E4E] focus:ring-1 focus:ring-[#C66E4E] rounded-2xl px-4 py-3 text-left text-[#0C2341] text-sm outline-none transition-all placeholder:text-slate-400 font-sans"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-slate-555 mr-1 font-bold">كلمة المرور</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#0C2341]/5 border border-[#0C2341]/10 focus:border-[#C66E4E] focus:ring-1 focus:ring-[#C66E4E] rounded-2xl px-4 py-3 text-left text-[#0C2341] text-sm outline-none transition-all placeholder:text-slate-400 font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={loadingUser !== null}
          className="w-full mt-2 bg-[#0C2341] hover:bg-[#8B84D7] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition-all duration-300 transform active:scale-[0.98] text-center flex items-center justify-center gap-2 focus:outline-none"
        >
          {loadingUser === 'credentials' ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> جاري التحقق...
            </span>
          ) : (
            <span>تسجيل الدخول ➜</span>
          )}
        </button>
      </form>

      {/* Quick Login Section (Dev Mode Bypass) */}
      <div className="mt-6 pt-4 border-t border-[#0C2341]/10 space-y-3">
        <p className="text-center text-xs text-slate-500 font-sans mb-1">الدخول التجريبي السريع (تجاوز المصادقة) ⚡</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setProfile({ name: 'أبو خالد', role: 'father' });
              navigate('/father');
            }}
            className="bg-[#C66E4E]/10 border border-[#C66E4E]/20 hover:bg-[#C66E4E]/20 text-[#C66E4E] text-[11px] font-bold py-2.5 rounded-xl transition-all active:scale-95 text-center focus:outline-none"
          >
            دخول كولي أمر (أبو خالد) 👤
          </button>
          
          <button
            type="button"
            onClick={() => {
              setProfile({ name: 'سالم', role: 'kid' });
              navigate('/kid');
            }}
            className="bg-[#8B84D7]/10 border border-[#8B84D7]/20 hover:bg-[#8B84D7]/20 text-[#8B84D7] text-[11px] font-bold py-2.5 rounded-xl transition-all active:scale-95 text-center focus:outline-none"
          >
            دخول كابن (سالم) 👦
          </button>

          <button
            type="button"
            onClick={() => {
              setProfile({ name: 'خالد', role: 'kid' });
              navigate('/kid');
            }}
            className="bg-[#8B84D7]/10 border border-[#8B84D7]/20 hover:bg-[#8B84D7]/20 text-[#8B84D7] text-[11px] font-bold py-2.5 rounded-xl transition-all active:scale-95 text-center focus:outline-none"
          >
            دخول كابن (خالد) 👦
          </button>

          <button
            type="button"
            onClick={() => {
              setProfile({ name: 'المطور', role: 'dev' });
              navigate('/dev');
            }}
            className="bg-[#0C2341]/10 border border-[#0C2341]/20 hover:bg-[#0C2341]/20 text-[#0C2341] text-[11px] font-bold py-2.5 rounded-xl transition-all active:scale-95 text-center focus:outline-none"
          >
            دخول كمطور 🛠️
          </button>
        </div>
      </div>

      <div className="mt-6 text-center border-t border-[#0C2341]/10 pt-4 flex justify-between items-center px-1 flex-row-reverse">
        <button
          onClick={() => navigate('/')}
          className="text-xs text-slate-500 hover:text-[#C66E4E] transition-colors font-sans font-bold cursor-pointer"
        >
          العودة للرئيسية ⬅️
        </button>
        <button
          onClick={() => navigate('/dev')}
          className="text-xs text-slate-500 hover:text-[#C66E4E] transition-colors font-sans cursor-pointer"
        >
          لوحة المطورين 🛠️
        </button>
      </div>
    </div>
  );
}
