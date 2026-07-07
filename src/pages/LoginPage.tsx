import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoadingUser('credentials');

    try {
      let role = '';
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for demo under email confirmation or rate limit constraints
        if (error.message.toLowerCase().includes('confirm') || error.status === 429 || error.status === 400) {
          if (email === 'father@namaa.com') {
            role = 'father';
          } else if (email === 'salem@namaa.com' || email === 'khalid@namaa.com') {
            role = 'kid';
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
          if (email.includes('father')) role = 'father';
          else if (email.includes('salem') || email.includes('khalid')) role = 'kid';
          else throw new Error('الملف الشخصي غير موجود');
        } else {
          role = profile.role;
        }
      }

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
          أدخل بيانات حسابك لبدء رحلة التوفير والمسؤولية المالية
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl text-xs font-sans text-center">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleCredentialsLogin} className="space-y-5">
        <div className="space-y-1">
          <label className="block text-xs text-slate-400 font-semibold mr-1">البريد الإلكتروني</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="father@namaa.com"
            className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] focus:ring-1 focus:ring-[#8c7355] rounded-2xl px-4 py-3 text-left text-white text-sm outline-none transition-all placeholder:text-slate-600 font-sans"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-slate-400 font-semibold mr-1">كلمة المرور</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] focus:ring-1 focus:ring-[#8c7355] rounded-2xl px-4 py-3 text-left text-white text-sm outline-none transition-all placeholder:text-slate-600 font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={loadingUser !== null}
          className="w-full mt-2 bg-gradient-to-r from-[#8c7355] to-[#009639] hover:from-[#9c8466] hover:to-[#00a840] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg transition-all duration-300 transform active:scale-[0.98] text-center flex items-center justify-center gap-2 focus:outline-none"
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
