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
import KidRewardsPage from './pages/KidRewardsPage';
import FatherVillagePage from './pages/FatherVillagePage';
import LandingPage from './pages/LandingPage';
import { useApp } from './context/AppContext';

function AuthLayout() {
  return (
    <div className="bg-[#F7F5EE] relative overflow-hidden min-h-screen px-4 py-10 font-sans text-[#0C2341] flex flex-col items-center w-full">
      {/* Soft Blurred Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#C66E4E]/8 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B84D7]/8 blur-[130px] pointer-events-none z-0" />
      
      {/* Radial Grid Pattern */}
      <div className="absolute inset-0 bg-radial-grid pointer-events-none opacity-30 z-0" />

      {/* App Content wrapper to stay above background elements */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        {/* App Main Header */}
        <header className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#C66E4E] to-[#8B84D7] bg-clip-text text-transparent">
            تطبيق نماء العائلي 🍃
          </h1>
          <p className="text-sm text-slate-600 font-sans font-bold">
            منصة الادخار والقلعة الافتراضية الذكية للأطفال
          </p>
        </header>

        <main className="w-full px-4 flex justify-center">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-500 font-sans font-bold">
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
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth / Dev Routes inside AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="/kid/rewards" element={<KidRewardsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
