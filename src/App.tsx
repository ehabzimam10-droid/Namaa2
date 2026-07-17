import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import KidDashboard from './pages/KidDashboard';
import FatherDashboard from './pages/FatherDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import KidSavingsPage from './pages/KidSavingsPage';
import KidTasksPage from './pages/KidTasksPage';
import KidInvestmentsPage from './pages/KidInvestmentsPage';
import KidDonationsPage from './pages/KidDonationsPage';
import FatherProjectsPage from './pages/FatherProjectsPage';
import FatherKidsPage from './pages/FatherKidsPage';
import FatherAICoachPage from './pages/FatherAICoachPage';
import FatherLeaguePage from './pages/FatherLeaguePage';
import KidLeaguePage from './pages/KidLeaguePage';
import DashboardLayout from './components/layout/DashboardLayout';
import KidCastlePage from './pages/KidCastlePage';
import FatherVillagePage from './pages/FatherVillagePage';
import { useApp } from './context/AppContext';

function AuthLayout() {
  return (
    <div className="bg-[#0B1727] relative overflow-hidden min-h-screen px-4 py-10 font-sans text-slate-100 flex flex-col items-center w-full">
      {/* Dynamic Alinma Diagonal Stripes */}
      <div className="absolute -top-40 left-0 w-full h-[60vh] bg-gradient-to-r from-orange-400/40 to-[#8c7355]/20 transform -skew-y-12 scale-150 pointer-events-none z-0 origin-top-left"></div>
      <div className="absolute -top-20 left-0 w-full h-[40vh] bg-white/5 transform -skew-y-12 scale-150 pointer-events-none z-0 origin-top-left"></div>

      {/* App Content wrapper to stay above background elements */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        {/* App Main Header */}
        <header className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-[#8c7355] bg-clip-text text-transparent">
            تطبيق نماء العائلي 🍃
          </h1>
          <p className="text-sm text-slate-300">
            منصة الادخار والقلعة الافتراضية الذكية للأطفال
          </p>
        </header>

        <main className="w-full px-4 flex justify-center">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} نماء - جميع الحقوق محفوظة
        </footer>
      </div>
    </div>
  );
}

function App() {
  const { toast } = useApp();

  return (
    <BrowserRouter>
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] bg-white border border-stone-200/80 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 max-w-md text-right animate-bounce">
          <span className="text-base shrink-0">
            {toast.type === 'success' ? '🎉' : '❌'}
          </span>
          <span className="text-xs font-bold text-[#0C2341] leading-relaxed">
            {toast.message}
          </span>
        </div>
      )}
      <Routes>
        {/* Auth / Dev Routes inside AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dev" element={<DeveloperDashboard />} />
        </Route>

        {/* Dashboard routes inside DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/father" element={<FatherDashboard />} />
          <Route path="/father/projects" element={<FatherProjectsPage />} />
          <Route path="/father/kids" element={<FatherKidsPage />} />
          <Route path="/father/ai" element={<FatherAICoachPage />} />
          <Route path="/father/league" element={<FatherLeaguePage />} />
          <Route path="/father/village" element={<FatherVillagePage />} />
          <Route path="/kid" element={<KidDashboard />} />
          <Route path="/kid/savings" element={<KidSavingsPage />} />
          <Route path="/kid/tasks" element={<KidTasksPage />} />
          <Route path="/kid/investments" element={<KidInvestmentsPage />} />
          <Route path="/kid/donations" element={<KidDonationsPage />} />
          <Route path="/kid/league" element={<KidLeaguePage />} />
          <Route path="/kid/castle" element={<KidCastlePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
