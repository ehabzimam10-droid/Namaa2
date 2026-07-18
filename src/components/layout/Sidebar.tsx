import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile, logout, geminiApiKey, setGeminiApiKey, showToast } = useApp();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isFather = profile?.role === 'father';

  // SVG Icons mapped exactly to each path - standardized to w-[22px] h-[22px] and strokeWidth={1.8}
  const homeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21.75h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21.75h7.5" />
    </svg>
  );

  const kidsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );

  const savingsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18-2.062c0-1.077-.842-1.933-1.918-1.933h-14.16c-1.076 0-1.918.857-1.918 1.933v2.062M12 12h.008v.008H12V12Z" />
    </svg>
  );

  const tasksIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 12.408.01-.01.006-.007a.75.75 0 0 1 1.055-.018l2.22 2.22 4.72-4.72a.75.75 0 0 1 1.06 1.06l-5.25 5.25a.75.75 0 0 1-1.06 0l-2.75-2.75a.75.75 0 0 1-.02-1.06Z" />
    </svg>
  );

  const projectsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
    </svg>
  );

  const aiIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h7.5m-7.5 3h7.5m-7.5 3h7.5" />
    </svg>
  );

  const donationsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );

  const leagueIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-4.875c-.622 0-1.125.504-1.125 1.125v3.375m9 0h-9m9 0a3 3 0 0 0 3-3V9.75M3.75 15.75a3 3 0 0 1-3-3V9.75m3.75 6a3 3 0 0 0 3-3V9.75M3.75 9.75h16.5M12 3a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 3Z" />
    </svg>
  );

  const villageIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
    </svg>
  );

  const storeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
    </svg>
  );

  const menuItems = isFather
    ? [
        { title: 'الرئيسية', path: '/father', icon: homeIcon },
        { title: 'إدارة الأبناء', path: '/father/kids', icon: kidsIcon },
        { title: 'مشاريع العائلة', path: '/father/projects', icon: projectsIcon },
        { title: 'المستشار الذكي', path: '/father/ai', icon: aiIcon },
        { title: 'دوري العائلة', path: '/father/league', icon: leagueIcon },
        { title: 'القرية الافتراضية', path: '/father/village', icon: villageIcon },
      ]
    : [
        { title: 'الرئيسية', path: '/kid', icon: homeIcon },
        { title: 'الحصالة الذكية', path: '/kid/savings', icon: savingsIcon },
        { title: 'المهام والمسؤوليات', path: '/kid/tasks', icon: tasksIcon },
        { title: 'الاستثمار العائلي', path: '/kid/investments', icon: projectsIcon },
        { title: 'المسؤولية المجتمعية', path: '/kid/donations', icon: donationsIcon },
        { title: 'دوري العائلة', path: '/kid/league', icon: leagueIcon },
        { title: 'القرية الافتراضية', path: '/kid/castle', icon: villageIcon },
        { title: 'متجر المكافآت', path: '/kid/rewards', icon: storeIcon },
      ];

  return (
    <>
      {/* Mobile backdrop - mounted always, toggles opacity, pointer events, and blur */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto bg-[#0C2341]/40 backdrop-blur-sm'
            : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Floating Pill Sidebar - detached, narrow vertical white strip */}
      <aside
        className={`fixed top-4 bottom-4 right-4 z-50 w-20 flex flex-col justify-between items-center py-6 px-2 bg-white border border-stone-200 text-amad-text transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1.5rem)] lg:translate-x-0'
        } shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[28px] overflow-y-auto no-scrollbar lg:overflow-y-visible`}
      >
        {/* Top: Brand Logo / Brand Emblem */}
        <div className="flex flex-col items-center gap-6 w-full">
          <div
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C66E4E] to-[#8B84D7] flex items-center justify-center text-white shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
            onClick={() => navigate(isFather ? '/father' : '/kid')}
          >
            {/* Custom SVG sprout outline seedling logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
              <path d="M12 22V12" />
              <path d="M12 12c0-4.418 3.582-8 8-8v2c-3.314 0-6 2.686-6 6" />
              <path d="M12 15c0-3.314-2.686-6-6-6v2c2.21 0 4 1.79 4 4" />
            </svg>
          </div>
          
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-[#0C2341] text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-all"
          >
            ✕ إغلاق
          </button>

          {/* Navigation Links (Outline Icons) */}
          <nav className="flex flex-col gap-3.5 w-full items-center">
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative group flex items-center justify-center w-12 h-12 rounded-full border transition-all ${
                    isActive
                      ? 'active bg-[#8B84D7] text-white border-transparent shadow-md shadow-[#8B84D7]/20 scale-105'
                      : 'bg-transparent text-slate-400 hover:text-[#0C2341] border-transparent hover:bg-stone-50'
                  }`
                }
              >
                {item.icon}
                {/* Custom Tooltip popping out to the left (RTL Sidebar) */}
                <span className="absolute right-16 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 bg-[#0C2341] text-white text-[10px] px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap pointer-events-none shadow-md z-50">
                  {item.title}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom: Settings, Profile & Logout */}
        <div className="flex flex-col items-center gap-3.5 w-full mt-auto">
          {/* Settings Button - Stacked cleanly above profile bubble */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="relative group flex items-center justify-center w-11 h-11 rounded-full border border-stone-200 bg-white text-slate-400 hover:text-[#0C2341] hover:bg-stone-50 hover:border-stone-300 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.99l1.004.831c.455.377.586.992.26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.83c.292-.24.437-.613.43-.991a6.936 6.936 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span className="absolute right-14 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 bg-[#0C2341] text-white text-[10px] px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap pointer-events-none shadow-md z-50">
              الإعدادات
            </span>
          </button>

          {/* User profile brief initial bubble - removed HTML title to fix double tooltips, rounded-full */}
          <div 
            className="relative group w-11 h-11 rounded-full bg-[#0C2341]/5 border border-[#0C2341]/10 flex items-center justify-center font-extrabold text-xs text-[#0C2341] cursor-pointer hover:bg-[#0C2341]/10 transition-colors"
          >
            {profile?.name ? profile.name.substring(0, 2) : 'ن'}
            
            <span className="absolute right-14 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 bg-[#0C2341] text-white text-[10px] px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap pointer-events-none shadow-md z-50">
              {profile?.name || 'حسابي'} ({isFather ? 'ولي أمر' : 'ابن'})
            </span>
          </div>

          {/* Logout Button - removed HTML title to fix double tooltips, rounded-full */}
          <button
            onClick={handleLogout}
            className="relative group w-11 h-11 rounded-full bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 border border-rose-500/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[22px] h-[22px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <span className="absolute right-14 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 bg-rose-600 text-white text-[10px] px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap pointer-events-none shadow-md z-50">
              تسجيل الخروج
            </span>
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setIsSettingsOpen(false)} 
            className="fixed inset-0 bg-[#0C2341]/40 backdrop-blur-md transition-opacity"
          />
          
          {/* Modal Card */}
          <div className="relative bg-[#F5F4F0] border border-[#0C2341]/10 rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 text-right font-sans" dir="rtl">
            <div className="flex justify-between items-center border-b border-[#0C2341]/10 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-[#0C2341]">إعدادات التطبيق</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-[#0C2341] transition-colors text-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0C2341] mb-2">مفتاح API الخاص بـ Gemini</label>
                <input 
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="أدخل مفتاح API هنا..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#0C2341]/10 bg-white text-[#0C2341] focus:outline-none focus:ring-2 focus:ring-[#8B84D7] focus:border-transparent transition-all"
                />
                <p className="text-[10px] text-slate-500 mt-1">يُستخدم هذا المفتاح لتشغيل المستشار الذكي AI للقرارات المالية.</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#0C2341] hover:bg-stone-200/50 rounded-xl transition-all"
              >
                إغلاق
              </button>
              <button 
                onClick={() => {
                  showToast?.('تم حفظ الإعدادات بنجاح', 'success');
                  setIsSettingsOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#8B84D7] hover:bg-[#8B84D7]/90 rounded-xl shadow-md transition-all"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

