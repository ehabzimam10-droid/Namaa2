import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Mini vector buildings for the landing page interactive simulation card
const BankSVG = ({ level }: { level: number }) => (
  <svg className="transition-all duration-500 ease-out hover:scale-105 cursor-pointer origin-bottom" width="48" height={36 + level * 8} viewBox="0 0 50 90" fill="none">
    <rect x="5" y="80" width="40" height="10" rx="2" fill="#D97706" />
    <rect x="9" y="40" width="6" height="40" fill="#B45309" opacity="0.9" />
    <rect x="22" y="40" width="6" height="40" fill="#B45309" opacity="0.9" />
    <rect x="35" y="40" width="6" height="40" fill="#B45309" opacity="0.9" />
    <polygon points="2,40 25,12 48,40" fill="#F59E0B" />
    {level >= 4 && <circle cx="25" cy="5" r="5" fill="#FBBF24" className="animate-bounce" />}
  </svg>
);

const MarketSVG = ({ level }: { level: number }) => (
  <svg className="transition-all duration-500 ease-out hover:scale-105 cursor-pointer origin-bottom" width="48" height={36 + level * 8} viewBox="0 0 50 90" fill="none">
    <rect x="5" y="48" width="40" height="42" rx="4" fill="#6366F1" />
    <rect x="15" y="62" width="20" height="28" rx="2" fill="#4F46E5" />
    <rect x="2" y="38" width="46" height="12" rx="3" fill="#EC4899" />
    {level >= 4 && <polygon points="25,38 25,10 38,18" fill="#FBBF24" />}
    {level >= 4 && <line x1="25" y1="38" x2="25" y2="10" stroke="#FBBF24" strokeWidth="2" />}
  </svg>
);

const FarmSVG = ({ level }: { level: number }) => (
  <svg className="transition-all duration-500 ease-out hover:scale-105 cursor-pointer origin-bottom" width="48" height={36 + level * 8} viewBox="0 0 50 90" fill="none">
    <rect x="22" y="42" width="6" height="48" fill="#78350F" rx="2" />
    <circle cx="25" cy="35" r={10 + level * 2} fill="#10B981" opacity="0.95" />
    {level >= 3 && <circle cx="16" cy="26" r="8" fill="#059669" opacity="0.9" />}
    {level >= 3 && <circle cx="34" cy="28" r="8" fill="#059669" opacity="0.9" />}
    {level >= 4 && <circle cx="25" cy="20" r="2.5" fill="#EF4444" />}
    {level >= 4 && <circle cx="15" cy="30" r="2.5" fill="#EF4444" />}
    {level >= 4 && <circle cx="35" cy="24" r="2.5" fill="#EF4444" />}
  </svg>
);

const WindmillSVG = ({ level }: { level: number }) => (
  <svg className="transition-all duration-500 ease-out hover:scale-105 cursor-pointer origin-bottom" width="48" height={36 + level * 8} viewBox="0 0 50 90" fill="none">
    <polygon points="12,90 18,32 32,32 38,90" fill="#64748B" />
    <circle cx="25" cy="55" r="4" fill="#334155" />
    <g style={{ animation: `windmill-spin ${6.5 - level}s linear infinite` }}>
      <circle cx="0" cy="0" r="3.5" fill="#F59E0B" />
      <line x1="0" y1="0" x2="0" y2="-24" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="0" x2="0" y2="24" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="0" x2="-24" y2="0" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="0" y1="0" x2="24" y2="0" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

const CastleSVG = ({ level }: { level: number }) => (
  <svg className="transition-all duration-500 ease-out hover:scale-105 cursor-pointer origin-bottom" width="58" height={36 + level * 8} viewBox="0 0 60 90" fill="none">
    <rect x="5" y="32" width="12" height="58" fill="#475569" rx="1" />
    <polygon points="5,32 11,12 17,32" fill="#8B5CF6" />
    <rect x="43" y="32" width="12" height="58" fill="#475569" rx="1" />
    <polygon points="43,32 49,12 55,32" fill="#8B5CF6" />
    <rect x="15" y="44" width="30" height="46" fill="#334155" rx="1" />
    <rect x="18" y="37" width="5" height="7" fill="#1E293B" />
    <rect x="27" y="37" width="5" height="7" fill="#1E293B" />
    <rect x="36" y="37" width="5" height="7" fill="#1E293B" />
    <path d="M24 90V76c0-3.3 2.7-6 6-6s6 2.7 6 6v14" fill="#0F172A" />
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameIndexRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  const TOTAL_FRAMES = 240;

  const [demoLevels, setDemoLevels] = useState({
    bank: 4,      
    market: 2,    
    castle: 3,    
    farm: 3,      
    windmill: 5,  
  });

  const incrementLevel = (key: keyof typeof demoLevels) => {
    setDemoLevels((prev) => ({
      ...prev,
      [key]: prev[key] >= 5 ? 1 : prev[key] + 1,
    }));
  };

  // Preload frames
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/village_frames/ezgif-frame-${numStr}.jpg`;
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, []);

  // Canvas Sizing (ONLY on resize or mount, NOT on scroll)
  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      lastFrameIndexRef.current = -1; // force redraw
    }
  };

  // High-performance canvas draw function using requestAnimationFrame
  const renderFrame = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1))));
    if (frameIndex === lastFrameIndexRef.current) return; // avoid duplicate frame redraws

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    lastFrameIndexRef.current = frameIndex;

    const width = canvas.width;
    const height = canvas.height;
    const imgAspect = img.width / img.height;
    const canvasAspect = width / height;
    let renderW = width;
    let renderH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      renderH = width / imgAspect;
      offsetY = (height - renderH) / 2;
    } else {
      renderW = height * imgAspect;
      offsetX = (width - renderW) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  };

  // Scroll listener optimized with requestAnimationFrame
  useEffect(() => {
    updateCanvasSize();

    const handleScroll = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        
        setScrollProgress(progress);
        renderFrame(progress);

        if (scrollY > 40) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      });
    };

    const handleResize = () => {
      updateCanvasSize();
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      renderFrame(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial render
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Current village status label
  const villageStatus = useMemo(() => {
    if (scrollProgress < 0.3) {
      return { label: 'المرحلة 1 🌾 (القرية الريفية البسيطة)', icon: '🏡' };
    } else if (scrollProgress < 0.7) {
      return { label: 'المرحلة 2 🔨 (تطور المباني ونمو الاقتصاد)', icon: '🏰' };
    } else {
      return { label: 'المرحلة 3 🌟 (المملكة الذهبية والقلعة الملكية)', icon: '👑' };
    }
  }, [scrollProgress]);

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Day vs Night Mode styles
  const bgClass = darkMode ? 'bg-[#060B14] text-white' : 'bg-[#0E1726]/20 text-white';

  // Windows 11 Acrylic / Notification / Start Menu Dark Frosted Glass (Zero white milky tint, high-contrast readable text)
  const cardBgClass = darkMode
    ? 'bg-slate-950/80 backdrop-blur-2xl border border-purple-500/25 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:bg-slate-950/90 hover:border-purple-500/40 transition-all'
    : 'bg-slate-900/65 backdrop-blur-2xl border border-white/20 text-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:bg-slate-900/75 hover:border-white/30 transition-all';

  const headerClasses = `fixed left-0 right-0 mx-auto z-50 backdrop-blur-2xl transition-premium ${
    isScrolled
      ? `top-4 w-[92%] max-w-4xl rounded-full border shadow-2xl px-6 py-3 ${
          darkMode 
            ? 'border-purple-500/30 bg-slate-950/85 text-white shadow-black/80' 
            : 'border-white/20 bg-slate-900/75 text-white shadow-black/40'
        }`
      : `top-0 w-full rounded-none border-b px-4 py-4 md:px-8 md:py-5 ${
          darkMode 
            ? 'border-white/10 bg-slate-950/80 text-white' 
            : 'border-white/10 bg-slate-900/60 text-white'
        }`
  }`;

  return (
    <div dir="rtl" className={`min-h-screen relative transition-colors duration-700 font-sans overflow-x-hidden ${bgClass}`}>
      
      {/* 1. Ultra-fast HTML5 Canvas rendering 240 frames on scroll with 100% background transparency */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: 1.0 }}
        />

        {/* Dynamic Day / Night ambience lighting overlay */}
        <div
          className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
            darkMode
              ? 'bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/85'
              : 'bg-gradient-to-b from-black/5 via-transparent to-black/20'
          }`}
        />
      </div>

      {/* Floating Interactive Village Level Indicator Badge (Windows Acrylic Glass) */}
      <div className={`fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3 backdrop-blur-2xl border text-white px-5 py-3 rounded-full shadow-2xl animate-fade-in font-sans ${
        darkMode ? 'bg-slate-950/85 border-purple-500/30' : 'bg-slate-900/80 border-white/20'
      }`}>
        <span className="text-xl animate-bounce">
          {villageStatus.icon}
        </span>
        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-300 block leading-tight">مستوى القرية بالخلفية (محاكاة التمرير)</span>
          <span className="text-sm font-black text-amber-400">
            {villageStatus.label}
          </span>
        </div>
      </div>
      
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
        @keyframes windmill-spin {
          0% { transform: translate(25px, 32px) rotate(0deg); }
          100% { transform: translate(25px, 32px) rotate(360deg); }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Decorative blurred background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#C66E4E]/20 blur-[150px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B84D7]/20 blur-[150px]"></div>
      </div>

      {/* Floating / Glassmorphic Header (Windows Acrylic) */}
      <header className={headerClasses}>
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="text-3xl animate-float">🍃</span>
            <span className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-purple-400 bg-clip-text text-transparent">
              نماء العائلي
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-base font-black">
            <button onClick={() => scrollToSection('features')} className="text-slate-100 hover:text-amber-400 transition-colors cursor-pointer">المميزات</button>
            <button onClick={() => scrollToSection('showcase')} className="text-slate-100 hover:text-amber-400 transition-colors cursor-pointer">الأقسام واللوحات</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-slate-100 hover:text-amber-400 transition-colors cursor-pointer">كيف نعمل</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
            {/* Day / Night Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3.5 py-2 rounded-xl border border-white/20 bg-slate-900/80 hover:bg-slate-800 text-white transition-all active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-black shadow-lg"
              title={darkMode ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            >
              {darkMode ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-yellow-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.75 4.75l1.59 1.59m11.32 11.32l1.59 1.59M3 12h2.25m13.5 0H21M4.75 19.25l1.59-1.59m11.32-11.32l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                  </svg>
                  <span>الوضع النهاري ☀️</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-purple-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                  <span>الوضع الليلي 🌙</span>
                </>
              )}
            </button>

            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 text-sm font-black bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] hover:opacity-90 text-white rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer font-sans"
            >
              تسجيل الدخول ➜
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center z-10">
        
        {/* Left Content Card (Windows Acrylic Glass) */}
        <div className={`p-8 md:p-10 rounded-[36px] space-y-6 text-right reveal ${cardBgClass}`}>
          <div className="space-y-3">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs md:text-sm font-black border border-amber-500/30">
              🌱 الجيل القادم من الوعي المالي العائلي
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-md">
              ابنِ وعي أطفالك المالي عبر <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-purple-400 bg-clip-text text-transparent font-black block mt-2">
                مملكة افتراضية ثلاثية الأبعاد
              </span>
            </h1>
          </div>

          <p className="text-base md:text-lg leading-relaxed font-bold text-slate-200">
            نماء هي منصة مالية عائلية متكاملة تدمج بين محاكاة الألعاب ثلاثية الأبعاد والذكاء الاصطناعي لتدريب الأطفال على الادخار والاستثمار ومشاركة الخير والمبادرة في مهام المنزل بطريقة ممتعة وفاعلة.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-[#C66E4E] hover:bg-[#a65638] text-white text-base font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
            >
              ابدأ تجربة المنصة الآن 🚀
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="px-7 py-4 border border-white/20 bg-slate-900/60 hover:bg-slate-800 text-white rounded-2xl text-base font-black transition-all active:scale-95 flex items-center justify-center hover:scale-105 cursor-pointer shadow-md"
            >
              استكشف المزايا ⬇️
            </button>
          </div>
        </div>

        {/* Right Visual: Restored Interactive Village 3D Graphic Mockup Card */}
        <div className="relative flex justify-center items-center reveal reveal-delay-2 w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B84D7]/30 to-[#C66E4E]/30 rounded-full blur-[80px] pointer-events-none"></div>
          
          {/* Card Mockup representing the 3D visual */}
          <div className={`relative w-full max-w-lg p-6 md:p-8 rounded-[36px] border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${cardBgClass}`}>
            
            {/* Visual Header */}
            <div className="flex justify-between items-center border-b border-white/15 pb-4 mb-4 flex-row-reverse">
              <span className="text-2xl animate-float">🏰</span>
              <div className="text-right">
                <span className="text-xs text-slate-300 font-bold block">مملكة نماء العائلية</span>
                <span className="text-sm md:text-base font-black text-white block">القرية ثلاثية الأبعاد (3D Interactive)</span>
              </div>
            </div>

            {/* Simulated 3D Graphic Box */}
            <div className="h-56 w-full bg-[#0A1120] rounded-2xl border border-white/15 overflow-hidden flex flex-col justify-end p-4 relative shadow-inner">
              
              {/* Stars animation */}
              <div className="absolute inset-0 pointer-events-none opacity-50">
                <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="absolute top-10 right-12 w-2 h-2 bg-yellow-200 rounded-full"></div>
                <div className="absolute top-24 left-20 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="absolute top-14 left-44 w-1 h-1 bg-amber-300 rounded-full"></div>
              </div>

              {/* Graphic SVG buildings elements */}
              <div className="w-full flex justify-around items-end z-10 pb-2">
                <div className="flex flex-col items-center gap-1.5">
                  <BankSVG level={demoLevels.bank} />
                  <span className="text-[11px] text-amber-300 font-black">الادخار ({demoLevels.bank}/5)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <MarketSVG level={demoLevels.market} />
                  <span className="text-[11px] text-blue-300 font-black">الاستثمار ({demoLevels.market}/5)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <CastleSVG level={demoLevels.castle} />
                  <span className="text-[11px] text-purple-300 font-black animate-pulse-ring">القلعة ({demoLevels.castle}/5)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <FarmSVG level={demoLevels.farm} />
                  <span className="text-[11px] text-emerald-300 font-black">الخير ({demoLevels.farm}/5)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <WindmillSVG level={demoLevels.windmill} />
                  <span className="text-[11px] text-orange-300 font-black">المهام ({demoLevels.windmill}/5)</span>
                </div>
              </div>
              <div className="w-full h-4 bg-emerald-700/80 rounded-b-lg border-t border-emerald-500/40"></div>
            </div>

            {/* Values indicators (Clickable to adjust levels) */}
            <div className="space-y-3 mt-5 select-none">
              <span className="text-xs text-amber-300 font-black block text-right">
                💡 انقر على الأزرار بالأسفل لتطوير مباني القرية وتجربتها:
              </span>
              <div className="grid grid-cols-5 gap-2 text-xs text-center">
                <button 
                  onClick={() => incrementLevel('bank')}
                  className="bg-amber-500/25 hover:bg-amber-500/40 text-amber-300 p-2.5 rounded-xl font-black transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-500/40 shadow-md"
                >
                  💰 الادخار
                </button>
                <button 
                  onClick={() => incrementLevel('market')}
                  className="bg-blue-500/25 hover:bg-blue-500/40 text-blue-300 p-2.5 rounded-xl font-black transition-all hover:scale-105 active:scale-95 cursor-pointer border border-blue-500/40 shadow-md"
                >
                  📈 الاستثمار
                </button>
                <button 
                  onClick={() => incrementLevel('castle')}
                  className="bg-purple-500/25 hover:bg-purple-500/40 text-purple-300 p-2.5 rounded-xl font-black transition-all hover:scale-105 active:scale-95 cursor-pointer border border-purple-500/40 shadow-md"
                >
                  🏰 القلعة
                </button>
                <button 
                  onClick={() => incrementLevel('farm')}
                  className="bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 p-2.5 rounded-xl font-black transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-500/40 shadow-md"
                >
                  🌳 الخير
                </button>
                <button 
                  onClick={() => incrementLevel('windmill')}
                  className="bg-orange-500/25 hover:bg-orange-500/40 text-orange-300 p-2.5 rounded-xl font-black transition-all hover:scale-105 active:scale-95 cursor-pointer border border-orange-500/40 shadow-md"
                >
                  🌀 المهام
                </button>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-12">
        {/* Section Header Card */}
        <div className={`max-w-2xl mx-auto p-8 rounded-[32px] text-center space-y-3 reveal ${cardBgClass}`}>
          <span className="text-sm font-black text-amber-400 tracking-widest block">أركان المنصة الأساسية</span>
          <h2 className="text-3xl font-black text-white">تصميم ذكي ومزايا تفاعلية متكاملة</h2>
          <p className="text-base font-bold text-slate-200">
            نهدف لتبسيط المفاهيم المالية الصعبة مثل الاستثمار وإدارة الميزانيات والعمل الخيري للأطفال عبر تجارب محفزة.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 3D Village (Big span) */}
          <div className={`md:col-span-2 p-8 md:p-10 rounded-[32px] border flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-amber-400/40 reveal reveal-delay-1 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-5xl animate-float">🏡✨</div>
              <h3 className="text-2xl font-black text-white">القرية والمملكة ثلاثية الأبعاد (3D Visuals)</h3>
              <p className="text-base font-bold text-slate-200 leading-relaxed">
                شاهد مدخراتك ومساهماتك تتحول لمباني ومزارع وقصور أسطورية ثلاثية الأبعاد تتفاعل وتنمو معك. يمكن للأبناء اللعب بها، ويستطيع الأب متابعة ورعاية تطورها مباشرة من لوحته.
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <span className="bg-amber-500/20 px-4 py-1.5 rounded-full text-amber-300 text-xs font-black border border-amber-500/30">Three.js</span>
              <span className="bg-purple-500/20 px-4 py-1.5 rounded-full text-purple-300 text-xs font-black border border-purple-500/30">React Three Fiber</span>
            </div>
          </div>

          {/* Card 2: AI Gemini Advisor */}
          <div className={`p-8 rounded-[32px] border flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-purple-400/40 reveal reveal-delay-2 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-5xl">🤖🔮</div>
              <h3 className="text-2xl font-black text-white">المستشار المالي الذكي</h3>
              <p className="text-base font-bold text-slate-200 leading-relaxed">
                تحليل ذكي مدعوم بمجسمات الذكاء الاصطناعي من Google Gemini يقدم للأبناء نصائح تفاعلية، وللآباء إرشادات تربوية لتوجيه أداء أبنائهم.
              </p>
            </div>
            <div className="mt-6">
              <span className="bg-purple-500/20 px-4 py-1.5 rounded-full text-purple-300 text-xs font-black border border-purple-500/30">Gemini 3.5 Flash</span>
            </div>
          </div>

          {/* Card 3: Family League */}
          <div className={`p-8 rounded-[32px] border flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-orange-400/40 reveal reveal-delay-1 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-5xl animate-float-delayed">🏆⚔️</div>
              <h3 className="text-2xl font-black text-white">دوري العائلة الأسبوعي</h3>
              <p className="text-base font-bold text-slate-200 leading-relaxed">
                تحديات ممتعة وتنافسية بين الأبناء تشجعهم على التوفير وإكمال المهام لحصد المكافآت الأسبوعية المصروفة ذكياً.
              </p>
            </div>
            <div className="mt-6">
              <span className="bg-orange-500/20 px-4 py-1.5 rounded-full text-orange-300 text-xs font-black border border-orange-500/30">Gamification</span>
            </div>
          </div>

          {/* Card 4: Investments & Savings (Big span) */}
          <div className={`md:col-span-2 p-8 md:p-10 rounded-[32px] border flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-400/40 reveal reveal-delay-2 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-5xl">📈💚</div>
              <h3 className="text-2xl font-black text-white">حصالات الادخار ومشاريع الاستثمار المشترك</h3>
              <p className="text-base font-bold text-slate-200 leading-relaxed">
                حصالات ذكية تتيح للأبناء وضع أهداف وحظر سحبها لضمان التوفير، مع إمكانية مساهمة الأبناء مع الأب في مشاريع استثمار عائلية بفائدة وعائد ربحي، ليتعلم الأطفال معنى تنمية المال.
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <span className="bg-orange-500/20 px-4 py-1.5 rounded-full text-orange-300 text-xs font-black border border-orange-500/30">الادخار الذكي</span>
              <span className="bg-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-300 text-xs font-black border border-emerald-500/30">الاستثمار العائلي</span>
            </div>
          </div>

        </div>
      </section>

      {/* Detailed Feature Showcase */}
      <section id="showcase" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-16">
        
        {/* Section Header Card */}
        <div className={`max-w-2xl mx-auto p-8 rounded-[32px] text-center space-y-3 reveal ${cardBgClass}`}>
          <span className="text-sm font-black text-purple-400 tracking-widest block">دليل المزايا والوظائف</span>
          <h2 className="text-3xl font-black text-white">تجربة متكاملة للأبناء والآباء</h2>
          <p className="text-base font-bold text-slate-200">
            تتوزع وظائف نماء لتضمن حوكمة عائلية مالية سهلة للأب، ورحلة تعليمية تفاعلية ممتعة للأطفال.
          </p>
        </div>

        {/* Feature Cards Grid (Explain Father, Kid, and AI features) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card A: Father Panel */}
          <div className={`p-8 md:p-10 rounded-[32px] border shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.02] ${cardBgClass} reveal`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-4xl">👨‍💼</span>
                <span className="text-xs font-black text-orange-300 px-3.5 py-1.5 bg-orange-500/20 rounded-full border border-orange-500/30">لوحة التحكم للأب</span>
              </div>
              <h3 className="text-2xl font-black text-amber-400">إشراف مالي وحوكمة متكاملة</h3>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">
                يملك الأب الصلاحية الكاملة لإدارة مصروفات الأبناء وتحفيزهم من خلال:
              </p>
              <ul className="text-sm space-y-3 pr-4 list-disc text-right font-bold text-slate-200">
                <li><strong className="text-amber-300 font-black">إدارة المهام اليومية:</strong> إضافة مهام وربطها بمكافأة مالية فورية عند الإنجاز.</li>
                <li><strong className="text-amber-300 font-black">المشاريع الاستثمارية:</strong> إنشاء مشاريع استثمار عائلية بعوائد محددة يشارك بها الأبناء.</li>
                <li><strong className="text-amber-300 font-black">إقرار طلبات الصدقة:</strong> مراقبة وإقرار تبرعات الأبناء لتعزيز الروح الإنسانية.</li>
                <li><strong className="text-amber-300 font-black">دوري نماء العائلي:</strong> تتويج الأبناء بالأوسمة ودفع مكافآت التميز تلقائياً.</li>
                <li><strong className="text-amber-300 font-black">إقرار مكافآت الشركاء:</strong> متابعة طلبات استرداد الأبناء لبطاقات سوني وجرير.</li>
              </ul>
            </div>
          </div>

          {/* Card B: Kid Panel */}
          <div className={`p-8 md:p-10 rounded-[32px] border shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.02] ${cardBgClass} reveal reveal-delay-1`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-4xl">👦</span>
                <span className="text-xs font-black text-purple-300 px-3.5 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30">لوحة تفاعل الابن</span>
              </div>
              <h3 className="text-2xl font-black text-purple-300">تعلم الادخار بأسلوب اللعب ثلاثي الأبعاد</h3>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">
                يعيش الطفل تجربة بصرية تفاعلية تنمي سلوكه المالي من خلال:
              </p>
              <ul className="text-sm space-y-3 pr-4 list-disc text-right font-bold text-slate-200">
                <li><strong className="text-purple-300 font-black">الحصالات الذكية:</strong> وضع أهداف محددة وقفل سحب الأموال حتى اكتمال الهدف.</li>
                <li><strong className="text-purple-300 font-black">الاستثمار وتنمية المال:</strong> استثمار جزء من المصروف في مشاريع عائلية.</li>
                <li><strong className="text-purple-300 font-black">تطوير القرية 3D:</strong> تطور مباني القرية (البنك، المزرعة، السوق) بناءً على السلوك.</li>
                <li><strong className="text-purple-300 font-black">إنجاز المهام:</strong> إرسال صور إثبات إنجاز المهام للوالد لكسب المكافآت.</li>
                <li><strong className="text-purple-300 font-black">متجر المكافآت:</strong> استبدال النقاط بهدايا وأكواد شحن حقيقية من سوني وجرير.</li>
              </ul>
            </div>
          </div>

          {/* Card C: AI Coach (Gemini) */}
          <div className={`p-8 md:p-10 rounded-[32px] border shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.02] ${cardBgClass} reveal reveal-delay-2`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-4xl">🤖</span>
                <span className="text-xs font-black text-emerald-300 px-3.5 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30">المستشار الذكي (Gemini)</span>
              </div>
              <h3 className="text-2xl font-black text-emerald-400">توجيه ذكي للأبناء والآباء</h3>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">
                تحليل السلوك وتقديم الإرشادات بالاعتماد على الذكاء الاصطناعي:
              </p>
              <ul className="text-sm space-y-3 pr-4 list-disc text-right font-bold text-slate-200">
                <li><strong className="text-emerald-300 font-black">نصائح للأبناء:</strong> يقدم Gemini نصائح وتلميحات عربية لتوجيه الطفل لأهدافه.</li>
                <li><strong className="text-emerald-300 font-black">تقييم التوازن:</strong> تنبيه الطفل عند وجود خلل بين الادخار والإنفاق والخير.</li>
                <li><strong className="text-emerald-300 font-black">مدرب الأبوة المالي:</strong> نصائح للأب حول كيفية تشجيع وتنمية وعي أطفاله.</li>
                <li><strong className="text-emerald-300 font-black">تحليل القرى 3D:</strong> فهم فوري لمستوى القرية العام وتأثير التغييرات عليه.</li>
              </ul>
            </div>
          </div>

        </div>

      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-12">
        {/* Section Header Card */}
        <div className={`max-w-2xl mx-auto p-8 rounded-[32px] text-center space-y-3 reveal ${cardBgClass}`}>
          <span className="text-sm font-black text-amber-400 tracking-widest block">سهل وبسيط</span>
          <h2 className="text-3xl font-black text-white">خطوات بسيطة لبناء الوعي المالي</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className={`text-center space-y-4 p-8 md:p-10 reveal reveal-delay-1 border rounded-[32px] hover:scale-105 transition-all duration-300 shadow-xl ${cardBgClass}`}>
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl font-black mx-auto shadow-lg">١</div>
            <h4 className="font-black text-2xl text-white">سجل حساب العائلة 👤</h4>
            <p className="text-sm font-bold text-slate-200 leading-relaxed">ينشئ الأب حساباً عائلياً ويقوم بإضافة حسابات مخصصة للأبناء (خالد، سالم) وتحديد مصروفاتهم.</p>
          </div>

          <div className={`text-center space-y-4 p-8 md:p-10 reveal reveal-delay-2 border rounded-[32px] hover:scale-105 transition-all duration-300 shadow-xl ${cardBgClass}`}>
            <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl font-black mx-auto shadow-lg">٢</div>
            <h4 className="font-black text-2xl text-white">أسند المهام والتحديات 📜</h4>
            <p className="text-sm font-bold text-slate-200 leading-relaxed">يضع الأب المهام ويفعل دوري التوفير الأسبوعي، ليبدأ الأبناء في ادخار المصروف وإكمال الواجبات المنزلية.</p>
          </div>

          <div className={`text-center space-y-4 p-8 md:p-10 reveal reveal-delay-3 border rounded-[32px] hover:scale-105 transition-all duration-300 shadow-xl ${cardBgClass}`}>
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black mx-auto shadow-lg">٣</div>
            <h4 className="font-black text-2xl text-white">شاهد التطور 🏰</h4>
            <p className="text-sm font-bold text-slate-200 leading-relaxed">تتحول هذه الأرقام والمدخرات إلى مبانٍ وقلاع وقرى ثلاثية الأبعاد تنمو أمام أعينهم وتوجههم ذكياً.</p>
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-6xl mx-auto px-6 py-12 z-10 relative reveal">
        <div className="bg-gradient-to-r from-[#0C2341]/95 via-[#1A365D]/95 to-[#5F57C7]/95 backdrop-blur-3xl border border-white/20 rounded-[36px] p-10 md:p-14 text-white text-center shadow-[0_30px_70px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Decorative glowing circles inside */}
          <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-[#C66E4E]/30 blur-3xl pointer-events-none"></div>
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-white">جاهز لبناء مستقبل أطفالك المالي؟ 🍃</h3>
            <p className="text-base text-slate-100 leading-relaxed font-bold">
              انضم إلى آلاف العائلات ودع أطفالك يبنون أولى خطواتهم الاستثمارية والادخارية اليوم بطريقة تفاعلية وممتعة.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-[#C66E4E] hover:bg-[#a65638] text-white text-base font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
              >
                سجل عائلتك مجاناً الآن 🚀
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 z-10 relative text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/20 shadow-lg text-white">
          <span className="animate-float text-xl">🍃</span>
          <span className="text-sm font-black">نماء العائلي - بوابة الحوكمة والاستثمار المشترك</span>
        </div>
        <p className="text-xs font-bold text-slate-400">
          &copy; {new Date().getFullYear()} نماء. جميع الحقوق محفوظة لفريق GOTL.
        </p>
      </footer>

    </div>
  );
}
