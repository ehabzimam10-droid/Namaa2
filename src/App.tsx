import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import KidDashboard from './pages/KidDashboard';
import FatherDashboard from './pages/FatherDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#0B1727] relative overflow-hidden min-h-screen px-4 py-10 font-sans text-slate-100 flex flex-col items-center">
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
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/father" element={<FatherDashboard />} />
              <Route path="/kid" element={<KidDashboard />} />
              <Route path="/dev" element={<DeveloperDashboard />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="mt-16 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} نماء - جميع الحقوق محفوظة
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
