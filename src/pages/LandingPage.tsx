import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export type BuildingType = 'bank' | 'market' | 'castle' | 'farm' | 'windmill';

export interface BuildingInfoItem {
  id: BuildingType;
  name: string;
  pillar: string;
  icon: string;
  image: string;
  accentColor: string;
  badgeClass: string;
  description: string;
  impact: string;
}

// Building configuration data for the interactive 3D Kingdom Explorer
const BUILDINGS_INFO: Record<BuildingType, BuildingInfoItem> = {
  bank: {
    id: 'bank',
    name: 'بنك ومخزن المدخرات',
    pillar: 'الادخار والتوفير الذكي',
    icon: '💰',
    image: '/assets/buildings/bank.jpg',
    accentColor: '#D97706',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    description: 'يتطور البنك وتزداد خزائنه الذهبية كلما حافظ الطفل على حصالته وقفل السحب لتحقيق أهدافه المستقبلية.',
    impact: 'تنمية عادة الصبر وتأجيل الرغبات المالية'
  },
  market: {
    id: 'market',
    name: 'سوق الاستثمار والتجارة',
    pillar: 'الاستثمار والشراكة العائلية',
    icon: '📈',
    image: '/assets/buildings/market.jpg',
    accentColor: '#2563EB',
    badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    description: 'تتوسع دكاكين ومتاجر السوق حين يشارك الطفل بجزء من مدخراته مع والده في مشاريع استثمارية بعوائد حقيقية.',
    impact: 'فهم حركة رأس المال ومضاعفة الأرباح'
  },
  castle: {
    id: 'castle',
    name: 'قلعة المملكة العائلية',
    pillar: 'التطور ودوري العائلة الأسبوعي',
    icon: '🏰',
    image: '/assets/buildings/castle.jpg',
    accentColor: '#7C3AED',
    badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    description: 'الرمز العام لهيبة وازدهار القرية وتتويج المتصدر في دوري نماء العائلي لحصد الأوسمة التقديرية.',
    impact: 'تعزيز الفخر والمنافسة الإيجابية بين الإخوة'
  },
  farm: {
    id: 'farm',
    name: 'مزرعة وواحة الخير',
    pillar: 'الصدقة والعطاء الإنساني',
    icon: '🌳',
    image: '/assets/buildings/farm.jpg',
    accentColor: '#059669',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    description: 'تزهر أشجار المزرعة وتفيض ينابيعها حين يخصص الطفل جزءاً من مصروفه للتبرع ومساعدة المحتاجين بموافقة الوالد.',
    impact: 'ترسيخ البركة والمسؤولية الاجتماعية'
  },
  windmill: {
    id: 'windmill',
    name: 'طاحونة وورشة التحديات',
    pillar: 'المهام اليومية والإنتاجية',
    icon: '🌀',
    image: '/assets/buildings/windmill.jpg',
    accentColor: '#C66E4E',
    badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
    description: 'تدور شفرات الطاحونة بقوة مع كل مهمة دراسية أو منزلية ينجزها الطفل ويرسل صورتها لوالده لكسب المكافآت.',
    impact: 'ربط الجهد الحقيقي بالعائد المالي'
  }
};

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

  // Selected building for the interactive 3D Explorer
  const [selectedBuildingKey, setSelectedBuildingKey] = useState<BuildingType>('bank');
  const [buildingLevels, setBuildingLevels] = useState<Record<BuildingType, number>>({
    bank: 4,      
    market: 2,    
    castle: 3,    
    farm: 3,      
    windmill: 5,  
  });

  const incrementBuildingLevel = (key: BuildingType) => {
    setBuildingLevels((prev) => ({
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

  const bgClass = darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F7F5EE] text-[#0C2341]';

  // Authentic Frosted Liquid Glass Cards
  const cardBgClass = darkMode
    ? 'bg-slate-900/80 backdrop-blur-xl border border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:bg-slate-900/90 transition-all'
    : 'bg-white/80 backdrop-blur-xl border border-white/80 text-[#0C2341] shadow-[0_20px_50px_rgba(12,35,65,0.12)] hover:bg-white/90 transition-all';

  const headerClasses = `fixed left-0 right-0 mx-auto z-50 backdrop-blur-xl transition-premium ${
    isScrolled
      ? `top-4 w-[92%] max-w-4xl rounded-full border shadow-2xl px-6 py-2.5 ${
          darkMode 
            ? 'bg-slate-950/80 border-white/20 text-slate-100 shadow-black/50' 
            : 'bg-white/80 border-white/80 text-[#0C2341] shadow-slate-900/10'
        }`
      : `top-0 w-full rounded-none border-b px-4 py-3.5 md:px-8 md:py-5 ${
          darkMode 
            ? 'bg-slate-950/70 border-white/10 text-slate-100' 
            : 'bg-[#F7F5EE]/70 border-[#0C2341]/10 text-[#0C2341]'
        }`
  }`;

  const currentBuilding = BUILDINGS_INFO[selectedBuildingKey];
  const currentBuildingLevel = buildingLevels[selectedBuildingKey];

  return (
    <div dir="rtl" className={`min-h-screen relative transition-colors duration-500 font-sans overflow-x-hidden ${bgClass}`}>
      
      {/* 1. Ultra-fast HTML5 Canvas rendering 240 frames on scroll with 100% background transparency */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: 1.0 }}
        />

        {/* Subtle gradient overlay to enhance visual depth */}
        <div
          className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
            darkMode
              ? 'bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/70'
              : 'bg-gradient-to-b from-black/15 via-transparent to-black/25'
          }`}
        />
      </div>

      {/* Floating Interactive Village Level Indicator Badge (Apple Liquid Glass) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/80 dark:border-white/20 px-4 py-2.5 rounded-full shadow-2xl animate-fade-in font-sans">
        <span className="text-base animate-bounce">
          {villageStatus.icon}
        </span>
        <div className="text-right">
          <span className="text-[9px] font-extrabold text-slate-700 dark:text-slate-300 block leading-tight">مستوى القرية بالخلفية (محاكاة التمرير)</span>
          <span className="text-xs font-black text-[#C66E4E] dark:text-[#E88D6A]">
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
        
        /* Hide scrollbar for tabs on mobile */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Decorative blurred background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#C66E4E]/15 blur-[150px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B84D7]/15 blur-[150px]"></div>
      </div>

      {/* Floating / Glassmorphic Header */}
      <header className={headerClasses}>
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="text-3xl animate-float">🍃</span>
            <span className="text-xl font-black bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] bg-clip-text text-transparent">
              نماء العائلي
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-black">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#C66E4E] transition-colors cursor-pointer text-[#0C2341] dark:text-white">المميزات</button>
            <button onClick={() => scrollToSection('showcase')} className="hover:text-[#C66E4E] transition-colors cursor-pointer text-[#0C2341] dark:text-white">الأقسام واللوحات</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#C66E4E] transition-colors cursor-pointer text-[#0C2341] dark:text-white">كيف نعمل</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                darkMode 
                  ? 'bg-slate-800 border-white/20 text-yellow-300 hover:bg-slate-700' 
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
              className="px-5 py-2.5 text-xs md:text-sm font-black bg-[#0C2341] hover:bg-[#8B84D7] text-white rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer font-sans"
            >
              تسجيل الدخول ➜
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center z-10">
        
        {/* Left Content Card */}
        <div className={`p-8 md:p-10 rounded-[36px] space-y-6 text-right reveal ${cardBgClass}`}>
          <div className="space-y-3">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#C66E4E]/15 text-[#C66E4E] dark:text-[#FFA07A] text-xs font-black border border-[#C66E4E]/30">
              🌱 الجيل القادم من الوعي المالي العائلي
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight text-[#0C2341] dark:text-white drop-shadow-sm">
              ابنِ وعي أطفالك المالي عبر <br />
              <span className="bg-gradient-to-r from-[#C66E4E] via-[#8B84D7] to-[#0C2341] dark:from-[#FFA07A] dark:to-[#C4B5FD] bg-clip-text text-transparent font-black block mt-2">
                مملكة افتراضية ثلاثية الأبعاد
              </span>
            </h1>
          </div>

          <p className="text-sm md:text-base leading-relaxed font-bold text-slate-800 dark:text-slate-200">
            نماء هي منصة مالية عائلية متكاملة تدمج بين محاكاة الألعاب ثلاثية الأبعاد والذكاء الاصطناعي لتدريب الأطفال على الادخار والاستثمار ومشاركة الخير والمبادرة في مهام المنزل بطريقة ممتعة وفاعلة.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-4 bg-[#C66E4E] hover:bg-[#a65638] text-white text-sm font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
            >
              ابدأ تجربة المنصة الآن 🚀
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`px-6 py-4 border rounded-2xl text-sm font-black transition-all active:scale-95 flex items-center justify-center hover:scale-105 cursor-pointer ${
                darkMode 
                  ? 'border-white/20 hover:bg-white/10 text-white bg-slate-800/60' 
                  : 'border-slate-300 hover:bg-slate-100 text-[#0C2341] bg-white/70 shadow-sm'
              }`}
            >
              استكشف المزايا ⬇️
            </button>
          </div>
        </div>

        {/* Right Visual: Interactive 3D Kingdom Building Explorer (Nano Banana Pro 3D Assets) */}
        <div className="relative flex justify-center items-center reveal reveal-delay-2 w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B84D7]/25 to-[#C66E4E]/25 rounded-full blur-[80px] pointer-events-none"></div>
          
          {/* Main 3D Interactive Card */}
          <div className={`relative w-full max-w-lg p-6 md:p-8 rounded-[36px] border transition-all duration-500 shadow-2xl ${cardBgClass}`}>
            
            {/* Card Top Bar */}
            <div className="flex justify-between items-center border-b border-slate-200/80 dark:border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] md:text-xs font-black px-3 py-1 rounded-full border ${currentBuilding.badgeClass}`}>
                  {currentBuilding.pillar}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">مستكشف مباني المملكة (3D)</span>
                <span className="text-sm font-black text-[#0C2341] dark:text-white flex items-center gap-1.5 justify-end">
                  {currentBuilding.name} {currentBuilding.icon}
                </span>
              </div>
            </div>

            {/* 3D Asset Preview Display Area */}
            <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-white/10 shadow-inner flex items-center justify-center group">
              
              {/* Background ambient lighting */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
              
              {/* High-Resolution 3D Building Render (Nano Banana Pro) */}
              <img
                src={currentBuilding.image}
                alt={currentBuilding.name}
                className="w-full h-full object-contain p-2 transition-all duration-700 group-hover:scale-105 select-none drop-shadow-2xl"
              />

              {/* Floating Level Badge */}
              <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5">
                <span className="text-amber-400">★</span>
                <span>المستوى {currentBuildingLevel} / 5</span>
              </div>

              {/* Interactive Upgrade Trigger */}
              <button
                onClick={() => incrementBuildingLevel(selectedBuildingKey)}
                className="absolute bottom-3 left-3 bg-[#C66E4E] hover:bg-[#a65638] text-white px-4 py-2 rounded-xl text-xs font-black shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="انقر لترقية المبنى وتجربة تأثير التطور"
              >
                <span>🚀 ترقية المبنى</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-md">+{currentBuildingLevel}</span>
              </button>
            </div>

            {/* Building Info & Educational Impact */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed text-right">
                {currentBuilding.description}
              </p>
              
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 flex items-center justify-between text-right">
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                  {currentBuilding.impact}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">الأثر المالي:</span>
              </div>
            </div>

            {/* 5 Building Selector Tabs (Responsive, High-contrast, Mobile-Friendly) */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-2">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold block text-right">
                💡 اختر المبنى للاستكشاف والترقية:
              </span>
              
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar md:grid md:grid-cols-5 md:overflow-visible">
                {(Object.keys(BUILDINGS_INFO) as Array<keyof typeof BUILDINGS_INFO>).map((key) => {
                  const b = BUILDINGS_INFO[key];
                  const isSelected = selectedBuildingKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedBuildingKey(key)}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0C2341] dark:bg-white text-white dark:text-[#0C2341] shadow-lg scale-105 border border-transparent'
                          : 'bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/15 hover:bg-white dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{b.icon}</span>
                      <span className="truncate">{key === 'bank' ? 'الادخار' : key === 'market' ? 'الاستثمار' : key === 'castle' ? 'القلعة' : key === 'farm' ? 'الخير' : 'المهام'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-12">
        {/* Section Header Card */}
        <div className="max-w-xl mx-auto p-6 md:p-8 rounded-[32px] backdrop-blur-md text-center space-y-3 reveal border shadow-xl bg-white/20 dark:bg-slate-900/50 border-white/50 dark:border-white/15">
          <span className="text-xs font-black text-[#C66E4E] tracking-widest block">أركان المنصة الأساسية</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0C2341] dark:text-white">تصميم ذكي ومزايا تفاعلية متكاملة</h2>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            نهدف لتبسيط المفاهيم المالية الصعبة مثل الاستثمار وإدارة الميزانيات والعمل الخيري للأطفال عبر تجارب محفزة.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 3D Village (Big span) */}
          <div className={`md:col-span-2 p-8 rounded-[32px] border flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#C66E4E]/40 reveal reveal-delay-1 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl animate-float">🏡✨</div>
              <h3 className="text-xl font-black text-[#0C2341] dark:text-white">القرية والمملكة ثلاثية الأبعاد (3D Visuals)</h3>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                شاهد مدخراتك ومساهماتك تتحول لمباني ومزارع وقصور أسطورية ثلاثية الأبعاد تتفاعل وتنمو معك. يمكن للأبناء اللعب بها، ويستطيع الأب متابعة ورعاية تطورها مباشرة من لوحته.
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <span className="bg-amber-500/15 px-3 py-1 rounded-full text-amber-700 dark:text-amber-400 text-xs font-black border border-amber-500/30">Three.js</span>
              <span className="bg-violet-500/15 px-3 py-1 rounded-full text-violet-700 dark:text-violet-400 text-xs font-black border border-violet-500/30">React Three Fiber</span>
            </div>
          </div>

          {/* Card 2: AI Gemini Advisor */}
          <div className={`p-8 rounded-[32px] border flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#8B84D7]/40 reveal reveal-delay-2 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl">🤖🔮</div>
              <h3 className="text-xl font-black text-[#0C2341] dark:text-white">المستشار المالي الذكي</h3>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                تحليل ذكي مدعوم بمجسمات الذكاء الاصطناعي من Google Gemini يقدم للأبناء نصائح تفاعلية، وللآباء إرشادات تربوية لتوجيه أداء أبنائهم.
              </p>
            </div>
            <div className="mt-6">
              <span className="bg-purple-500/15 px-3 py-1 rounded-full text-purple-700 dark:text-purple-400 text-xs font-black border border-purple-500/30">Gemini 3.5 Flash</span>
            </div>
          </div>

          {/* Card 3: Family League */}
          <div className={`p-8 rounded-[32px] border flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#8B84D7]/40 reveal reveal-delay-1 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl animate-float-delayed">🏆⚔️</div>
              <h3 className="text-xl font-black text-[#0C2341] dark:text-white">دوري العائلة الأسبوعي</h3>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                تحديات ممتعة وتنافسية بين الأبناء تشجعهم على التوفير وإكمال المهام لحصد المكافآت الأسبوعية المصروفة ذكياً.
              </p>
            </div>
            <div className="mt-6">
              <span className="bg-[#C66E4E]/15 px-3 py-1 rounded-full text-[#C66E4E] text-xs font-black border border-[#C66E4E]/30">Gamification</span>
            </div>
          </div>

          {/* Card 4: Investments & Savings (Big span) */}
          <div className={`md:col-span-2 p-8 rounded-[32px] border flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#C66E4E]/40 reveal reveal-delay-2 ${cardBgClass}`}>
            <div className="space-y-4">
              <div className="text-4xl">📈💚</div>
              <h3 className="text-xl font-black text-[#0C2341] dark:text-white">حصالات الادخار ومشاريع الاستثمار المشترك</h3>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                حصالات ذكية تتيح للأبناء وضع أهداف وحظر سحبها لضمان التوفير، مع إمكانية مساهمة الأبناء مع الأب في مشاريع استثمار عائلية بفائدة وعائد ربحي، ليتعلم الأطفال معنى تنمية المال.
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <span className="bg-orange-500/15 px-3 py-1 rounded-full text-orange-700 dark:text-orange-400 text-xs font-black border border-orange-500/30">الادخار الذكي</span>
              <span className="bg-emerald-500/15 px-3 py-1 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-black border border-emerald-500/30">الاستثمار العائلي</span>
            </div>
          </div>

        </div>
      </section>

      {/* Detailed Feature Showcase */}
      <section id="showcase" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-16">
        
        {/* Section Header Card */}
        <div className="max-w-xl mx-auto p-6 md:p-8 rounded-[32px] backdrop-blur-md text-center space-y-3 reveal border shadow-xl bg-white/20 dark:bg-slate-900/50 border-white/50 dark:border-white/15">
          <span className="text-xs font-black text-[#5F57C7] dark:text-[#8B84D7] tracking-widest block">دليل المزايا والوظائف</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0C2341] dark:text-white">تجربة متكاملة للأبناء والآباء</h2>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            تتوزع وظائف نماء لتضمن حوكمة عائلية مالية سهلة للأب، ورحلة تعليمية تفاعلية ممتعة للأطفال.
          </p>
        </div>

        {/* Feature Cards Grid (Explain Father, Kid, and AI features) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card A: Father Panel */}
          <div className={`p-8 rounded-[32px] border shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.02] ${cardBgClass} reveal`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl">👨‍💼</span>
                <span className="text-[10px] font-black text-[#C66E4E] px-3 py-1 bg-[#C66E4E]/15 rounded-full border border-[#C66E4E]/30">لوحة التحكم للأب</span>
              </div>
              <h3 className="text-xl font-black text-[#C66E4E]">إشراف مالي وحوكمة متكاملة</h3>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                يملك الأب الصلاحية الكاملة لإدارة مصروفات الأبناء وتحفيزهم من خلال:
              </p>
              <ul className="text-xs space-y-3 pr-4 list-disc text-right font-extrabold text-slate-800 dark:text-slate-100">
                <li><strong className="text-[#C66E4E] font-black">إدارة المهام اليومية:</strong> إضافة مهام (كالدراسة أو المساعدة) وربطها بمكافأة مالية فورية عند الإنجاز.</li>
                <li><strong className="text-[#C66E4E] font-black">المشاريع الاستثمارية:</strong> إنشاء مشاريع استثمار عائلية بفائدة وعوائد ربحية محددة يشارك بها الأبناء.</li>
                <li><strong className="text-[#C66E4E] font-black">إقرار طلبات الصدقة:</strong> مراقبة وإقرار تبرعات الأبناء لتعزيز الروح الإنسانية.</li>
                <li><strong className="text-[#C66E4E] font-black">دوري نماء العائلي:</strong> تتويج الأبناء بالأوسمة ودفع مكافآت التميز تلقائياً.</li>
                <li><strong className="text-[#C66E4E] font-black">إقرار مكافآت الشركاء:</strong> متابعة طلبات استرداد الأبناء لبطاقات سوني وجرير وتلقي الإشعارات الفورية.</li>
              </ul>
            </div>
          </div>

          {/* Card B: Kid Panel */}
          <div className={`p-8 rounded-[32px] border shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.02] ${cardBgClass} reveal reveal-delay-1`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl">👦</span>
                <span className="text-[10px] font-black text-[#5F57C7] dark:text-[#8B84D7] px-3 py-1 bg-[#8B84D7]/15 rounded-full border border-[#8B84D7]/30">لوحة تفاعل الابن</span>
              </div>
              <h3 className="text-xl font-black text-[#5F57C7] dark:text-[#8B84D7]">تعلم الادخار بأسلوب اللعب ثلاثي الأبعاد</h3>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                يعيش الطفل تجربة بصرية تفاعلية تنمي سلوكه المالي من خلال:
              </p>
              <ul className="text-xs space-y-3 pr-4 list-disc text-right font-extrabold text-slate-800 dark:text-slate-100">
                <li><strong className="text-[#5F57C7] dark:text-[#8B84D7] font-black">الحصالات الذكية:</strong> وضع أهداف محددة (كشراء لعبة) وقفل سحب الأموال حتى اكتمال الهدف.</li>
                <li><strong className="text-[#5F57C7] dark:text-[#8B84D7] font-black">الاستثمار وتنمية المال:</strong> استثمار جزء من مصروفه في مشاريع عائلية ومراقبة أرباحه.</li>
                <li><strong className="text-[#5F57C7] dark:text-[#8B84D7] font-black">تطوير القرية 3D:</strong> تطور مباني القرية (البنك، المزرعة، السوق، الطاحونة) بناءً على سلوكه.</li>
                <li><strong className="text-[#5F57C7] dark:text-[#8B84D7] font-black">إنجاز المهام:</strong> إرسال صور إثبات إنجاز المهام لوالده لكسب المكافآت.</li>
                <li><strong className="text-[#5F57C7] dark:text-[#8B84D7] font-black">متجر المكافآت والشراكات:</strong> استبدال نقاط إتمام المهام بهدايا وأكواد شحن حقيقية من سوني وجرير.</li>
              </ul>
            </div>
          </div>

          {/* Card C: AI Coach (Gemini) */}
          <div className={`p-8 rounded-[32px] border shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:scale-[1.02] ${cardBgClass} reveal reveal-delay-2`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl">🤖</span>
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 px-3 py-1 bg-emerald-600/15 rounded-full border border-emerald-500/30">المستشار الذكي (Gemini)</span>
              </div>
              <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-400">توجيه ذكي للأبناء والآباء</h3>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                تحليل السلوك وتقديم الإرشادات بالاعتماد على الذكاء الاصطناعي:
              </p>
              <ul className="text-xs space-y-3 pr-4 list-disc text-right font-extrabold text-slate-800 dark:text-slate-100">
                <li><strong className="text-emerald-700 dark:text-emerald-400 font-black">نصائح للأبناء:</strong> يقدم Gemini نصائح وتلميحات عربية لتوجيه الطفل لتحقيق أهدافه المالية.</li>
                <li><strong className="text-emerald-700 dark:text-emerald-400 font-black">تقييم مستويات التوازن:</strong> تنبيه الطفل عند وجود خلل بين الادخار والإنفاق والخير.</li>
                <li><strong className="text-emerald-700 dark:text-emerald-400 font-black">مدرب الأبوة المالي:</strong> نصائح للأب حول كيفية تشجيع وتنمية وعي أطفاله استناداً لإنجازهم.</li>
                <li><strong className="text-emerald-700 dark:text-emerald-400 font-black">تحليل القرى ثلاثية الأبعاد:</strong> فهم فوري لمستوى القرية العام وتأثير التغييرات عليه.</li>
              </ul>
            </div>
          </div>

        </div>

      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 z-10 relative space-y-12">
        {/* Section Header Card */}
        <div className="max-w-xl mx-auto p-6 md:p-8 rounded-[32px] backdrop-blur-md text-center space-y-3 reveal border shadow-xl bg-white/20 dark:bg-slate-900/50 border-white/50 dark:border-white/15">
          <span className="text-xs font-black text-[#C66E4E] tracking-widest block">سهل وبسيط</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0C2341] dark:text-white">خطوات بسيطة لبناء الوعي المالي</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className={`text-center space-y-3 p-8 reveal reveal-delay-1 border rounded-[32px] hover:scale-105 transition-all duration-300 shadow-xl ${cardBgClass}`}>
            <div className="w-14 h-14 rounded-2xl bg-[#C66E4E] text-white flex items-center justify-center text-xl font-black mx-auto shadow-md">١</div>
            <h4 className="font-black text-xl text-[#0C2341] dark:text-white">سجل حساب العائلة 👤</h4>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">ينشئ الأب حساباً عائلياً ويقوم بإضافة حسابات مخصصة للأبناء (خالد، سالم) وتحديد مصروفاتهم.</p>
          </div>

          <div className={`text-center space-y-3 p-8 reveal reveal-delay-2 border rounded-[32px] hover:scale-105 transition-all duration-300 shadow-xl ${cardBgClass}`}>
            <div className="w-14 h-14 rounded-2xl bg-[#5F57C7] text-white flex items-center justify-center text-xl font-black mx-auto shadow-md">٢</div>
            <h4 className="font-black text-xl text-[#0C2341] dark:text-white">أسند المهام والتحديات 📜</h4>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">يضع الأب المهام ويفعل دوري التوفير الأسبوعي، ليبدأ الأبناء في ادخار المصروف وإكمال الواجبات المنزلية.</p>
          </div>

          <div className={`text-center space-y-3 p-8 reveal reveal-delay-3 border rounded-[32px] hover:scale-105 transition-all duration-300 shadow-xl ${cardBgClass}`}>
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-black mx-auto shadow-md">٣</div>
            <h4 className="font-black text-xl text-[#0C2341] dark:text-white">شاهد التطور 🏰</h4>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">تتحول هذه الأرقام والمدخرات إلى مبانٍ وقلاع وقرى ثلاثية الأبعاد تنمو أمام أعينهم وتوجههم ذكياً.</p>
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-6xl mx-auto px-6 py-12 z-10 relative reveal">
        <div className="bg-gradient-to-r from-[#0C2341]/95 via-[#1A365D]/95 to-[#5F57C7]/95 backdrop-blur-3xl border border-white/30 rounded-[36px] p-10 md:p-14 text-white text-center shadow-[0_30px_70px_rgba(12,35,65,0.4)] relative overflow-hidden">
          {/* Decorative glowing circles inside */}
          <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-[#C66E4E]/30 blur-3xl pointer-events-none"></div>
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h3 className="text-2xl md:text-3xl font-black text-white">جاهز لبناء مستقبل أطفالك المالي؟ 🍃</h3>
            <p className="text-sm text-slate-100 leading-relaxed font-extrabold">
              انضم إلى آلاف العائلات السعودية ودع أطفالك يبنون أولى خطواتهم الاستثمارية والادخارية اليوم بطريقة تفاعلية وممتعة.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-[#C66E4E] hover:bg-[#a65638] text-white text-sm font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
              >
                سجل عائلتك مجاناً الآن 🚀
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 z-10 relative text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-white/20 shadow-lg">
          <span className="animate-float text-xl">🍃</span>
          <span className="text-xs md:text-sm font-black text-[#0C2341] dark:text-white">نماء العائلي - بوابة الحوكمة والاستثمار المشترك</span>
        </div>
        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          &copy; {new Date().getFullYear()} نماء. جميع الحقوق محفوظة لفريق GOTL.
        </p>
      </footer>

    </div>
  );
}
