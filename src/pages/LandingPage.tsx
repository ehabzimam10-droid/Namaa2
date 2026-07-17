import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Styles based on light/dark mode
  const bgClass = darkMode ? 'bg-[#080F1E] text-slate-100' : 'bg-[#F7F5EE] text-[#0C2341]';
  const cardBgClass = darkMode ? 'bg-[#0D1527] border-white/10' : 'bg-white border-[#0C2341]/10';
  const subTextClass = darkMode ? 'text-slate-400' : 'text-slate-650';
  const navBgClass = darkMode ? 'bg-[#080F1E]/80 border-white/5' : 'bg-[#F7F5EE]/80 border-[#0C2341]/5';

  return (
    <div dir="rtl" className={`min-h-screen transition-colors duration-500 font-sans overflow-x-hidden ${bgClass}`}>
      
      {/* Decorative blurred background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#C66E4E]/12 blur-[150px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B84D7]/12 blur-[150px]"></div>
      </div>

      {/* Sticky Topbar */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-500 ${navBgClass}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🍃</span>
            <span className="text-xl font-black bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] bg-clip-text text-transparent">
              نماء العائلي
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <a href="#features" className="hover:text-[#C66E4E] transition-colors">المميزات</a>
            <a href="#how-it-works" className="hover:text-[#C66E4E] transition-colors">كيف نعمل</a>
            <a href="#stats" className="hover:text-[#C66E4E] transition-colors">أرقامنا</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                darkMode 
                  ? 'bg-slate-800 border-white/10 text-yellow-300 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title={darkMode ? 'تفعيل الوضع المضيء' : 'تفعيل الوضع المظلم'}
            >
              {darkMode ? (
                // Sun Icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.75 4.75l1.59 1.59m11.32 11.32l1.59 1.59M3 12h2.25m13.5 0H21M4.75 19.25l1.59-1.59m11.32-11.32l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                </svg>
              ) : (
                // Moon Icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-[#0C2341] hover:bg-[#8B84D7] text-white text-sm font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-sans"
            >
              تسجيل الدخول ➜
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Content */}
        <div className="space-y-6 text-right">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C66E4E]/10 text-[#C66E4E] text-xs font-black">
            🏛️ شراكة تعليمية مبتكرة مع مصرف الإنماء
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            ابنِ وعي أطفالك المالي عبر <br />
            <span className="bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] bg-clip-text text-transparent">
              مملكة افتراضية ثلاثية الأبعاد
            </span>
          </h1>
          <p className={`text-base leading-relaxed font-medium ${subTextClass}`}>
            نماء هي منصة مالية عائلية متكاملة تدمج بين محاكاة الألعاب ثلاثية الأبعاد والذكاء الاصطناعي لتدريب الأطفال على الادخار والاستثمار ومشاركة الخير والمبادرة في مهام المنزل بطريقة ممتعة وفاعلة.
          </p>
          
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3.5 bg-[#C66E4E] hover:bg-[#a65638] text-white text-sm font-black rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              ابدأ تجربة المنصة الآن 🚀
            </button>
            <a
              href="#features"
              className={`px-6 py-3.5 border rounded-2xl text-sm font-black transition-all active:scale-95 flex items-center justify-center ${
                darkMode 
                  ? 'border-white/10 hover:bg-white/5 text-white' 
                  : 'border-slate-200 hover:bg-slate-50 text-[#0C2341]'
              }`}
            >
              استكشف المزايا ⬇️
            </a>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B84D7]/20 to-[#C66E4E]/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          {/* Card Mockup representing the 3D visual */}
          <div className={`relative w-full max-w-md p-6 rounded-[32px] border shadow-2xl transition-transform hover:scale-105 ${cardBgClass}`}>
            
            {/* Visual Header */}
            <div className="flex justify-between items-center border-b border-slate-100/10 pb-4 mb-4 flex-row-reverse">
              <span className="text-xl">🏰</span>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold block">مملكة نماء العائلية</span>
                <span className="text-xs font-black block">القرية ثلاثية الأبعاد (3D)</span>
              </div>
            </div>

            {/* Simulated 3D Graphic */}
            <div className="h-48 w-full bg-[#0D1527] rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-end p-4 relative">
              
              {/* Stars animation */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-4 left-6 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-10 right-12 w-1.5 h-1.5 bg-yellow-200 rounded-full"></div>
                <div className="absolute top-24 left-20 w-1 h-1 bg-white rounded-full"></div>
              </div>

              {/* Graphic elements */}
              <div className="w-full flex justify-around items-end z-10">
                <div className="h-20 w-8 bg-orange-500/80 rounded-t-lg border-t border-orange-400 flex items-center justify-center text-white text-xs">💰</div>
                <div className="h-24 w-12 bg-purple-500/80 rounded-t-lg border-t border-purple-400 flex items-center justify-center text-white text-xs">👑</div>
                <div className="h-16 w-8 bg-emerald-500/80 rounded-t-lg border-t border-emerald-400 flex items-center justify-center text-white text-xs">🌳</div>
              </div>
              <div className="w-full h-4 bg-emerald-700/60 rounded-b-lg border-t border-emerald-600/30"></div>
            </div>

            {/* Values indicators */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-center">
              <div className="bg-[#C66E4E]/10 p-2 rounded-xl text-[#C66E4E] font-bold">💰 الادخار (4/5)</div>
              <div className="bg-[#8B84D7]/10 p-2 rounded-xl text-[#8B84D7] font-bold">📜 المهام (5/5)</div>
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600 font-bold">💚 الخير (3/5)</div>
            </div>

          </div>
        </div>

      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-[#C66E4E] tracking-widest block">أركان المنصة الأساسية</span>
          <h2 className="text-3xl font-black">تصميم ذكي ومزايا تفاعلية متكاملة</h2>
          <p className={`max-w-lg mx-auto text-sm ${subTextClass}`}>
            نهدف لتبسيط المفاهيم المالية الصعبة مثل الاستثمار وإدارة الميزانيات والعمل الخيري للأطفال عبر تجارب محفزة.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 3D Village (Big span) */}
          <div className={`md:col-span-2 p-8 rounded-[32px] border shadow-md flex flex-col justify-between min-h-[300px] transition-all hover:shadow-xl ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl">🏡✨</div>
              <h3 className="text-xl font-black">القرية والمملكة ثلاثية الأبعاد (3D Visuals)</h3>
              <p className={`text-sm leading-relaxed ${subTextClass}`}>
                شاهد مدخراتك ومساهماتك تتحول لمباني ومزارع وقصور أسطورية ثلاثية الأبعاد تتفاعل وتنمو معك. يمكن للأبناء اللعب بها، ويستطيع الأب متابعة ورعاية تطورها مباشرة من لوحته.
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <span className="bg-amber-500/10 px-3 py-1 rounded-full text-amber-600 text-xs font-bold">Three.js</span>
              <span className="bg-violet-500/10 px-3 py-1 rounded-full text-violet-600 text-xs font-bold">React Three Fiber</span>
            </div>
          </div>

          {/* Card 2: AI Gemini Advisor */}
          <div className={`p-8 rounded-[32px] border shadow-md flex flex-col justify-between min-h-[300px] transition-all hover:shadow-xl ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl">🤖🔮</div>
              <h3 className="text-xl font-black">المستشار المالي الذكي</h3>
              <p className={`text-sm leading-relaxed ${subTextClass}`}>
                تحليل ذكي مدعوم بمجسمات الذكاء الاصطناعي من Google Gemini يقدم للأبناء نصائح تفاعلية، وللآباء إرشادات تربوية لتوجيه أداء أبنائهم.
              </p>
            </div>
            <div className="mt-6">
              <span className="bg-purple-500/10 px-3 py-1 rounded-full text-purple-600 text-xs font-bold">Gemini 3.5 Flash</span>
            </div>
          </div>

          {/* Card 3: Family League */}
          <div className={`p-8 rounded-[32px] border shadow-md flex flex-col justify-between min-h-[300px] transition-all hover:shadow-xl ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl">🏆⚔️</div>
              <h3 className="text-xl font-black">دوري العائلة الأسبوعي</h3>
              <p className={`text-sm leading-relaxed ${subTextClass}`}>
                تحديات ممتعة وتنافسية بين الأبناء تشجعهم على التوفير وإكمال المهام لحصد المكافآت الأسبوعية المصروفة ذكياً.
              </p>
            </div>
            <div className="mt-6">
              <span className="bg-[#C66E4E]/10 px-3 py-1 rounded-full text-[#C66E4E] text-xs font-bold">Gamification</span>
            </div>
          </div>

          {/* Card 4: Investments & Savings (Big span) */}
          <div className={`md:col-span-2 p-8 rounded-[32px] border shadow-md flex flex-col justify-between min-h-[300px] transition-all hover:shadow-xl ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl">📈💚</div>
              <h3 className="text-xl font-black">حصالات الادخار ومشاريع الاستثمار المشترك</h3>
              <p className={`text-sm leading-relaxed ${subTextClass}`}>
                حصالات ذكية تتيح للأبناء وضع أهداف وحظر سحبها لضمان التوفير، مع إمكانية مساهمة الأبناء مع الأب في مشاريع استثمار عائلية بفائدة وعائد ربحي، ليتعلم الأطفال معنى تنمية المال.
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <span className="bg-orange-500/10 px-3 py-1 rounded-full text-orange-600 text-xs font-bold">الادخار الذكي</span>
              <span className="bg-emerald-500/10 px-3 py-1 rounded-full text-emerald-600 text-xs font-bold">الاستثمار العائلي</span>
            </div>
          </div>

        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-[#C66E4E] tracking-widest block">سهل وبسيط</span>
          <h2 className="text-3xl font-black">خطوات بسيطة لبناء الوعي المالي</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="text-center space-y-3 p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#C66E4E]/10 text-[#C66E4E] flex items-center justify-center text-lg font-black mx-auto">١</div>
            <h4 className="font-extrabold text-lg">سجل حساب العائلة 👤</h4>
            <p className={`text-xs leading-relaxed ${subTextClass}`}>ينشئ الأب حساباً عائلياً ويقوم بإضافة حسابات مخصصة للأبناء (خالد، سالم) وتحديد مصروفاتهم.</p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#8B84D7]/10 text-[#8B84D7] flex items-center justify-center text-lg font-black mx-auto">٢</div>
            <h4 className="font-extrabold text-lg">أسند المهام والتحديات 📜</h4>
            <p className={`text-xs leading-relaxed ${subTextClass}`}>يضع الأب المهام ويفعل دوري التوفير الأسبوعي، ليبدأ الأبناء في ادخار المصروف وإكمال الواجبات المنزلية.</p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg font-black mx-auto">٣</div>
            <h4 className="font-extrabold text-lg">شاهد التطور 🏰</h4>
            <p className={`text-xs leading-relaxed ${subTextClass}`}>تتحول هذه الأرقام والمدخرات إلى مبانٍ وقلاع وقرى ثلاثية الأبعاد تنمو أمام أعينهم وتوجههم ذكياً.</p>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="max-w-6xl mx-auto px-6 py-20 z-10 relative text-center space-y-8">
        <div className="bg-[#0C2341] border border-[#0C2341]/10 rounded-[32px] p-8 md:p-12 text-white shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C66E4E]/15 blur-3xl pointer-events-none"></div>
          
          <h3 className="text-2xl md:text-3xl font-black">أرقام تتحدث عن نماء 🍃</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-orange-400">15,000+</div>
              <div className="text-xs text-slate-300 font-bold">عائلة سعودية نشطة</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-yellow-300">84%</div>
              <div className="text-xs text-slate-300 font-bold">زيادة في معدل الادخار للأطفال</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-emerald-400">200,000+</div>
              <div className="text-xs text-slate-300 font-bold">ريال تم توفيرها في الحصالات</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200/10 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span>🍃</span>
          <span className="text-sm font-black">نماء العائلي - بوابة الحوكمة والاستثمار المشترك</span>
        </div>
        <p className="text-[10px] text-slate-500">
          &copy; {new Date().getFullYear()} نماء. جميع الحقوق محفوظة لغرض مسابقة هكاثون مصرف الإنماء.
        </p>
      </footer>

    </div>
  );
}
