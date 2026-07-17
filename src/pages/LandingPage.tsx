import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for floating floating island header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Theme-based class helpers
  const bgClass = darkMode ? 'bg-[#080F1E] text-slate-100' : 'bg-[#F7F5EE] text-[#0C2341]';
  const cardBgClass = darkMode ? 'bg-[#0D1527] border-white/10' : 'bg-white border-[#0C2341]/10';
  const subTextClass = darkMode ? 'text-slate-400' : 'text-slate-600';

  // Navigation container layout transition classes
  const headerClasses = `fixed left-0 right-0 mx-auto z-50 backdrop-blur-md transition-premium ${
    isScrolled
      ? `top-4 w-[92%] max-w-4xl rounded-full border shadow-xl shadow-black/10 px-6 py-2.5 ${
          darkMode 
            ? 'bg-[#0D1527]/85 border-white/10 text-slate-100' 
            : 'bg-white/85 border-[#0C2341]/15 text-[#0C2341]'
        }`
      : `top-0 w-full rounded-none border-b px-8 py-5 ${
          darkMode 
            ? 'bg-[#080F1E]/80 border-white/5 text-slate-100' 
            : 'bg-[#F7F5EE]/80 border-[#0C2341]/5 text-[#0C2341]'
        }`
  }`;

  return (
    <div dir="rtl" className={`min-h-screen transition-colors duration-500 font-sans overflow-x-hidden ${bgClass}`}>
      
      {/* Injecting CSS Keyframes & Floating/Reveal Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 7s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-spin-slow {
          animation: spin-slow 22s linear infinite;
        }
        .animate-pulse-ring {
          animation: pulse-ring 4s ease-in-out infinite;
        }
        .reveal {
          opacity: 0;
          transform: translateY(35px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 100ms; }
        .reveal-delay-2 { transition-delay: 200ms; }
        .reveal-delay-3 { transition-delay: 300ms; }
        .transition-premium {
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Decorative blurred background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#C66E4E]/12 blur-[150px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B84D7]/12 blur-[150px]"></div>
      </div>

      {/* Floating particles for extra depth */}
      <div className="absolute top-28 right-[10%] text-3xl animate-float opacity-30 select-none">🍃</div>
      <div className="absolute top-96 left-[8%] text-3xl animate-float-delayed opacity-20 select-none">💰</div>
      <div className="absolute bottom-40 right-[15%] text-2xl animate-float opacity-25 select-none">🌳</div>
      <div className="absolute bottom-96 left-[12%] text-3xl animate-float-delayed opacity-20 select-none">💎</div>

      {/* Floating / Glassmorphic Header */}
      <header className={headerClasses}>
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="text-3xl animate-float">🍃</span>
            <span className="text-lg font-black bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] bg-clip-text text-transparent">
              نماء العائلي
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#C66E4E] transition-colors cursor-pointer">المميزات</button>
            <button onClick={() => scrollToSection('showcase')} className="hover:text-[#C66E4E] transition-colors cursor-pointer">الأقسام واللوحات</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#C66E4E] transition-colors cursor-pointer">كيف نعمل</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
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
              className="px-5 py-2 text-xs md:text-sm font-extrabold bg-[#0C2341] hover:bg-[#8B84D7] text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-sans"
            >
              تسجيل الدخول ➜
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Content */}
        <div className="space-y-6 text-right reveal">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C66E4E]/10 text-[#C66E4E] text-xs font-black animate-pulse-ring">
            🏛️ شراكة تعليمية مبتكرة مع مصرف الإنماء
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            ابنِ وعي أطفالك المالي عبر <br />
            <span className="bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] bg-clip-text text-transparent animate-pulse-ring">
              مملكة افتراضية ثلاثية الأبعاد
            </span>
          </h1>
          <p className={`text-base leading-relaxed font-medium ${subTextClass}`}>
            نماء هي منصة مالية عائلية متكاملة تدمج بين محاكاة الألعاب ثلاثية الأبعاد والذكاء الاصطناعي لتدريب الأطفال على الادخار والاستثمار ومشاركة الخير والمبادرة في مهام المنزل بطريقة ممتعة وفاعلة.
          </p>
          
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3.5 bg-[#C66E4E] hover:bg-[#a65638] text-white text-sm font-black rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              ابدأ تجربة المنصة الآن 🚀
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`px-6 py-3.5 border rounded-2xl text-sm font-black transition-all active:scale-95 flex items-center justify-center hover:scale-105 cursor-pointer ${
                darkMode 
                  ? 'border-white/10 hover:bg-white/5 text-white' 
                  : 'border-slate-200 hover:bg-slate-50 text-[#0C2341]'
              }`}
            >
              استكشف المزايا ⬇️
            </button>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative flex justify-center items-center reveal reveal-delay-2">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B84D7]/20 to-[#C66E4E]/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          {/* Card Mockup representing the 3D visual */}
          <div className={`relative w-full max-w-md p-6 rounded-[32px] border shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-black/20 ${cardBgClass}`}>
            
            {/* Visual Header */}
            <div className="flex justify-between items-center border-b border-slate-100/10 pb-4 mb-4 flex-row-reverse">
              <span className="text-xl animate-float">🏰</span>
              <div className="text-right">
                <span className="text-[10px] text-slate-550 font-bold block">مملكة نماء العائلية</span>
                <span className="text-xs font-black block">القرية ثلاثية الأبعاد (3D)</span>
              </div>
            </div>

            {/* Simulated 3D Graphic */}
            <div className="h-48 w-full bg-[#0D1527] rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-end p-4 relative shadow-inner">
              
              {/* Stars animation */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-4 left-6 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-10 right-12 w-1.5 h-1.5 bg-yellow-200 rounded-full"></div>
                <div className="absolute top-24 left-20 w-1 h-1 bg-white rounded-full"></div>
              </div>

              {/* Graphic elements */}
              <div className="w-full flex justify-around items-end z-10">
                <div className="h-20 w-8 bg-orange-500/80 rounded-t-lg border-t border-orange-400 flex items-center justify-center text-white text-xs hover:-translate-y-1 transition-all duration-300">💰</div>
                <div className="h-28 w-12 bg-purple-500/80 rounded-t-lg border-t border-purple-400 flex items-center justify-center text-white text-xs hover:-translate-y-1 transition-all duration-300 animate-float-delayed">👑</div>
                <div className="h-16 w-8 bg-emerald-500/80 rounded-t-lg border-t border-emerald-400 flex items-center justify-center text-white text-xs hover:-translate-y-1 transition-all duration-300">🌳</div>
              </div>
              <div className="w-full h-4 bg-emerald-700/60 rounded-b-lg border-t border-emerald-600/30"></div>
            </div>

            {/* Values indicators */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-center">
              <div className="bg-[#C66E4E]/10 p-2 rounded-xl text-[#C66E4E] font-bold transition-all hover:scale-105">💰 الادخار (4/5)</div>
              <div className="bg-[#8B84D7]/10 p-2 rounded-xl text-[#8B84D7] font-bold transition-all hover:scale-105">📜 المهام (5/5)</div>
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600 font-bold transition-all hover:scale-105">🌳 الخير (3/5)</div>
            </div>

          </div>
        </div>

      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-12">
        <div className="text-center space-y-3 reveal">
          <span className="text-xs font-black text-[#C66E4E] tracking-widest block">أركان المنصة الأساسية</span>
          <h2 className="text-3xl font-black">تصميم ذكي ومزايا تفاعلية متكاملة</h2>
          <p className={`max-w-lg mx-auto text-sm ${subTextClass}`}>
            نهدف لتبسيط المفاهيم المالية الصعبة مثل الاستثمار وإدارة الميزانيات والعمل الخيري للأطفال عبر تجارب محفزة.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 3D Village (Big span) */}
          <div className={`md:col-span-2 p-8 rounded-[32px] border shadow-md flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#C66E4E]/30 reveal reveal-delay-1 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl animate-float">🏡✨</div>
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
          <div className={`p-8 rounded-[32px] border shadow-md flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#8B84D7]/30 reveal reveal-delay-2 ${cardBgClass}`}>
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
          <div className={`p-8 rounded-[32px] border shadow-md flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#8B84D7]/30 reveal reveal-delay-1 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl animate-float-delayed">🏆⚔️</div>
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
          <div className={`md:col-span-2 p-8 rounded-[32px] border shadow-md flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#C66E4E]/30 reveal reveal-delay-2 ${cardBgClass}`}>
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

      {/* Detailed Feature Showcase (New replacement section for stats) */}
      <section id="showcase" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-16">
        
        <div className="text-center space-y-3 reveal">
          <span className="text-xs font-black text-[#8B84D7] tracking-widest block">دليل المزايا والوظائف</span>
          <h2 className="text-3xl font-black">تجربة متكاملة للأبناء والآباء</h2>
          <p className={`max-w-xl mx-auto text-sm ${subTextClass}`}>
            تتوزع وظائف نماء لتضمن حوكمة عائلية مالية سهلة للأب، ورحلة تعليمية تفاعلية ممتعة للأطفال.
          </p>
        </div>

        {/* Feature Cards Grid (Explain Father, Kid, and AI features) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card A: Father Panel */}
          <div className={`p-8 rounded-[32px] border shadow-xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.02] ${cardBgClass} reveal`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl">👨‍💼</span>
                <span className="text-[10px] font-bold text-[#C66E4E] px-2.5 py-1 bg-[#C66E4E]/10 rounded-full">لوحة التحكم للأب</span>
              </div>
              <h3 className="text-lg font-black text-[#C66E4E]">إشراف مالي وحوكمة متكاملة</h3>
              <p className={`text-xs leading-relaxed ${subTextClass}`}>
                يملك الأب الصلاحية الكاملة لإدارة مصروفات الأبناء وتحفيزهم من خلال:
              </p>
              <ul className="text-xs space-y-3 pr-4 list-disc text-right font-medium text-slate-700 dark:text-slate-300">
                <li><strong className="text-[#C66E4E]">إدارة المهام اليومية:</strong> إضافة مهام (كالدراسة أو المساعدة) وربطها بمكافأة مالية فورية عند الإنجاز.</li>
                <li><strong className="text-[#C66E4E]">المشاريع الاستثمارية:</strong> إنشاء مشاريع استثمار عائلية بفائدة وعوائد ربحية محددة يشارك بها الأبناء.</li>
                <li><strong className="text-[#C66E4E]">إقرار طلبات الصدقة:</strong> مراقبة وإقرار تبرعات الأبناء لتعزيز الروح الإنسانية.</li>
                <li><strong className="text-[#C66E4E]">دوري نماء العائلي:</strong> تتويج الأبناء بالأوسمة ودفع مكافآت التميز تلقائياً.</li>
              </ul>
            </div>
          </div>

          {/* Card B: Kid Panel */}
          <div className={`p-8 rounded-[32px] border shadow-xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.02] ${cardBgClass} reveal reveal-delay-1`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl">👦</span>
                <span className="text-[10px] font-bold text-[#8B84D7] px-2.5 py-1 bg-[#8B84D7]/10 rounded-full">لوحة تفاعل الابن</span>
              </div>
              <h3 className="text-lg font-black text-[#8B84D7]">تعلم الادخار بأسلوب اللعب ثلاثي الأبعاد</h3>
              <p className={`text-xs leading-relaxed ${subTextClass}`}>
                يعيش الطفل تجربة بصرية تفاعلية تنمي سلوكه المالي من خلال:
              </p>
              <ul className="text-xs space-y-3 pr-4 list-disc text-right font-medium text-slate-700 dark:text-slate-300">
                <li><strong className="text-[#8B84D7]">الحصالات الذكية:</strong> وضع أهداف محددة (كشراء لعبة) وقفل سحب الأموال حتى اكتمال الهدف.</li>
                <li><strong className="text-[#8B84D7]">الاستثمار وتنمية المال:</strong> استثمار جزء من مصروفه في مشاريع عائلية ومراقبة أرباحه.</li>
                <li><strong className="text-[#8B84D7]">تطوير القرية 3D:</strong> تطور مباني القرية (البنك، المزرعة، السوق، الطاحونة) بناءً على سلوكه.</li>
                <li><strong className="text-[#8B84D7]">إنجاز المهام:</strong> إرسال صور إثبات إنجاز المهام لوالده لكسب المكافآت.</li>
              </ul>
            </div>
          </div>

          {/* Card C: AI Coach (Gemini) */}
          <div className={`p-8 rounded-[32px] border shadow-xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.02] ${cardBgClass} reveal reveal-delay-2`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl">🤖</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-600/10 dark:bg-emerald-400/10 rounded-full">المستشار الذكي (Gemini)</span>
              </div>
              <h3 className="text-lg font-black text-emerald-650 dark:text-emerald-400">توجيه ذكي للأبناء والآباء</h3>
              <p className={`text-xs leading-relaxed ${subTextClass}`}>
                تحليل السلوك وتقديم الإرشادات بالاعتماد على الذكاء الاصطناعي:
              </p>
              <ul className="text-xs space-y-3 pr-4 list-disc text-right font-medium text-slate-700 dark:text-slate-300">
                <li><strong className="text-emerald-600 dark:text-emerald-400">نصائح للأبناء:</strong> يقدم Gemini نصائح وتلميحات عربية لتوجيه الطفل لتحقيق أهدافه المالية.</li>
                <li><strong className="text-emerald-600 dark:text-emerald-400">تقييم مستويات التوازن:</strong> تنبيه الطفل عند وجود خلل بين الادخار والإنفاق والخير.</li>
                <li><strong className="text-emerald-600 dark:text-emerald-400">مدرب الأبوة المالي:</strong> نصائح للأب حول كيفية تشجيع وتنمية وعي أطفاله استناداً لإنجازهم.</li>
                <li><strong className="text-emerald-600 dark:text-emerald-400">تحليل القرى ثلاثية الأبعاد:</strong> فهم فوري لمستوى القرية العام وتأثير التغييرات عليه.</li>
              </ul>
            </div>
          </div>

        </div>

      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-12">
        <div className="text-center space-y-3 reveal">
          <span className="text-xs font-black text-[#C66E4E] tracking-widest block">سهل وبسيط</span>
          <h2 className="text-3xl font-black">خطوات بسيطة لبناء الوعي المالي</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="text-center space-y-3 p-6 reveal reveal-delay-1 bg-white/5 border border-white/5 rounded-3xl hover:bg-[#8B84D7]/5 hover:border-[#8B84D7]/15 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#C66E4E]/10 text-[#C66E4E] flex items-center justify-center text-lg font-black mx-auto">١</div>
            <h4 className="font-extrabold text-lg">سجل حساب العائلة 👤</h4>
            <p className={`text-xs leading-relaxed ${subTextClass}`}>ينشئ الأب حساباً عائلياً ويقوم بإضافة حسابات مخصصة للأبناء (خالد، سالم) وتحديد مصروفاتهم.</p>
          </div>

          <div className="text-center space-y-3 p-6 reveal reveal-delay-2 bg-white/5 border border-white/5 rounded-3xl hover:bg-[#8B84D7]/5 hover:border-[#8B84D7]/15 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#8B84D7]/10 text-[#8B84D7] flex items-center justify-center text-lg font-black mx-auto">٢</div>
            <h4 className="font-extrabold text-lg">أسند المهام والتحديات 📜</h4>
            <p className={`text-xs leading-relaxed ${subTextClass}`}>يضع الأب المهام ويفعل دوري التوفير الأسبوعي، ليبدأ الأبناء في ادخار المصروف وإكمال الواجبات المنزلية.</p>
          </div>

          <div className="text-center space-y-3 p-6 reveal reveal-delay-3 bg-white/5 border border-white/5 rounded-3xl hover:bg-[#C66E4E]/5 hover:border-[#C66E4E]/15 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg font-black mx-auto">٣</div>
            <h4 className="font-extrabold text-lg">شاهد التطور 🏰</h4>
            <p className={`text-xs leading-relaxed ${subTextClass}`}>تتحول هذه الأرقام والمدخرات إلى مبانٍ وقلاع وقرى ثلاثية الأبعاد تنمو أمام أعينهم وتوجههم ذكياً.</p>
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-6xl mx-auto px-6 py-12 z-10 relative reveal">
        <div className="bg-gradient-to-r from-[#0C2341] to-[#8B84D7] border border-white/10 rounded-[32px] p-10 md:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          {/* Decorative glowing circles inside */}
          <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-[#C66E4E]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h3 className="text-2xl md:text-3xl font-black">جاهز لبناء مستقبل أطفالك المالي؟ 🍃</h3>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              انضم إلى آلاف العائلات السعودية ودع أطفالك يبنون أولى خطواتهم الاستثمارية والادخارية اليوم بطريقة تفاعلية وممتعة.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-[#C66E4E] hover:bg-[#a65638] text-white text-sm font-black rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
              >
                سجل عائلتك مجاناً الآن 🚀
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200/10 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="animate-float">🍃</span>
          <span className="text-sm font-black">نماء العائلي - بوابة الحوكمة والاستثمار المشترك</span>
        </div>
        <p className="text-[10px] text-slate-500">
          &copy; {new Date().getFullYear()} نماء. جميع الحقوق محفوظة لغرض مسابقة هكاثون مصرف الإنماء.
        </p>
      </footer>

    </div>
  );
}
