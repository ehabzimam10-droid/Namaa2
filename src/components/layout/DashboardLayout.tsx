import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-amad-bg text-amad-text flex relative overflow-hidden font-sans">
      {/* Radial Grid Pattern (72px 72px) */}
      <div className="absolute inset-0 bg-radial-grid pointer-events-none opacity-45 z-0" />
      
      {/* Soft Blurred Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#C66E4E]/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B84D7]/10 blur-[130px] pointer-events-none z-0" />

      {/* Sidebar (fixed/drawer) */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main dashboard wrapper (offset on desktop to match sidebar width of 20 + margins) */}
      <div className="flex-1 flex flex-col lg:pr-28 min-w-0 z-10 transition-all duration-300">
        {/* Topbar */}
        <Topbar onMenuToggle={toggleSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
          <Outlet />
        </main>

        {/* Dashboard Footer */}
        <footer className="py-6 text-center text-[10px] text-slate-600 border-t border-[#0C2341]/10 font-sans mt-auto">
          &copy; {new Date().getFullYear()} نماء - بوابة الحوكمة والاستثمار العائلي
        </footer>
      </div>
    </div>
  );
}
