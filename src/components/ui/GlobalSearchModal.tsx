import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface SearchResult {
  id: string;
  category: 'مهام' | 'حصالات' | 'مشاريع' | 'مكافآت' | 'أبناء' | 'صفحات';
  title: string;
  subtitle: string;
  badge?: string;
  icon: string;
  url?: string;
  action?: () => void;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function GlobalSearchModal({ isOpen, onClose, initialQuery = '' }: GlobalSearchModalProps) {
  const navigate = useNavigate();
  const { kids, projects, profile } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialQuery]);

  // Keyboard shortcut listener (ESC to close, Cmd+K / Ctrl+K to open handled in parent)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Aggregate all searchable items across the platform
  const allItems = useMemo(() => {
    const items: SearchResult[] = [];
    const isFather = profile?.role === 'father';

    // 1. Navigation Pages
    items.push(
      {
        id: 'nav-dashboard',
        category: 'صفحات',
        title: isFather ? 'الرئيسية (لوحة تحكم الأب)' : 'لوحة تحكم الابن',
        subtitle: 'استعراض الحسابات والأرصدة والإنجازات',
        icon: '🏠',
        url: isFather ? '/father' : '/kid',
      },
      {
        id: 'nav-village',
        category: 'صفحات',
        title: isFather ? 'مملكة العائلة ثلاثية الأبعاد (3D)' : 'القرية ثلاثية الأبعاد (3D)',
        subtitle: 'مشاهدة ومحاكاة تطور المباني والأركان الخمسة',
        icon: '🏰',
        url: isFather ? '/father/village' : '/kid/castle',
      },
      {
        id: 'nav-ai',
        category: 'صفحات',
        title: 'المستشار المالي الذكي (Gemini AI)',
        subtitle: 'توجيه وتحليل الأداء المالي للعائلة',
        icon: '🤖',
        url: isFather ? '/father/ai' : '/kid/ai',
      },
      {
        id: 'nav-rewards',
        category: 'صفحات',
        title: 'متجر مكافآت شركاء الإنماء (Alinma Rewards)',
        subtitle: 'استبدال نقاط المهام ببطاقات سوني وجرير',
        icon: '🎁',
        url: isFather ? '/father/rewards' : '/kid/rewards',
      },
      {
        id: 'nav-league',
        category: 'صفحات',
        title: 'دوري نماء العائلي الأسبوعي',
        subtitle: 'متابعة المتصدرين والتحديات ونقاط التميز',
        icon: '🏆',
        url: isFather ? '/father/league' : '/kid/league',
      }
    );

    if (isFather) {
      items.push(
        {
          id: 'nav-father-kids',
          category: 'صفحات',
          title: 'إدارة حسابات ومصروف الأبناء',
          subtitle: 'تعديل المصروف، التحويلات المباشرة، وحظر السحب',
          icon: '👥',
          url: '/father/kids',
        },
        {
          id: 'nav-father-projects',
          category: 'صفحات',
          title: 'المشاريع الاستثمارية العائلية',
          subtitle: 'إنشاء مشاريع استثمارية بعوائد ربحية',
          icon: '📈',
          url: '/father/projects',
        }
      );
    } else {
      items.push(
        {
          id: 'nav-kid-goals',
          category: 'صفحات',
          title: 'حصالات وأهداف الادخار',
          subtitle: 'إنشاء ومتابعة أهداف الشراء والتوفير الذكي',
          icon: '🎯',
          url: '/kid/goals',
        },
        {
          id: 'nav-kid-donations',
          category: 'صفحات',
          title: 'بوابة التبرعات والمسؤولية المجتمعية',
          subtitle: 'المساهمة في المبادرات الخيرية وكسب النقاط',
          icon: '🤲',
          url: '/kid/donations',
        },
        {
          id: 'nav-kid-tasks',
          category: 'صفحات',
          title: 'قائمة المهام والمسؤوليات',
          subtitle: 'إنجاز المهام وإرسال صور الإثبات لوالدك',
          icon: '🧹',
          url: '/kid/tasks',
        }
      );
    }

    // 2. Kids Profiles
    kids.forEach((k) => {
      items.push({
        id: `kid-${k.id}`,
        category: 'أبناء',
        title: `الابن: ${k.name} (عمر ${k.age} سنوات)`,
        subtitle: `الرصيد: ${k.balance} ريال • المدخرات: ${k.saved} ريال • النقاط: ${k.donationPoints || 0} 🌟`,
        badge: `${k.balance} ريال`,
        icon: '👦',
        url: isFather ? `/father/kids?highlight=${k.id}` : '/kid',
      });

      // 3. Tasks
      (k.tasks || []).forEach((task) => {
        const statusAr =
          task.status === 'approved'
            ? 'مكتملة وموافق عليها ✅'
            : task.status === 'under_review'
            ? 'قيد مراجعة الأب ⏳'
            : 'قيد التنفيذ 🧹';
        items.push({
          id: `task-${task.id}`,
          category: 'مهام',
          title: task.title,
          subtitle: `المكلف: ${k.name} • الحالة: ${statusAr}`,
          badge: task.rewardType === 'cash' ? `${task.rewardAmount} ريال` : `${task.rewardAmount} نقطة`,
          icon: '📝',
          url: isFather ? '/father/tasks' : '/kid/tasks',
        });
      });

      // 4. Savings Goals
      (k.savingsGoals || []).forEach((goal) => {
        const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
        items.push({
          id: `goal-${goal.id}`,
          category: 'حصالات',
          title: `هدف: ${goal.title}`,
          subtitle: `صاحب الحصالة: ${k.name} • تم إنجاز ${progress}% (${goal.currentAmount}/${goal.targetAmount} ريال)`,
          badge: `${goal.currentAmount} / ${goal.targetAmount} ريال`,
          icon: '💰',
          url: isFather ? `/father/kids?goal=${goal.id}` : '/kid/goals',
        });
      });
    });

    // 5. Family Investment Projects
    projects.forEach((proj) => {
      const pct = Math.min(100, Math.round((proj.currentInvested / proj.totalRequired) * 100));
      items.push({
        id: `proj-${proj.id}`,
        category: 'مشاريع',
        title: `مشروع: ${proj.title}`,
        subtitle: `عائد ربحي ${proj.roiPercentage}% • تم جمع ${pct}% (${proj.currentInvested}/${proj.totalRequired} ريال)`,
        badge: `عائد ${proj.roiPercentage}%`,
        icon: '📈',
        url: isFather ? '/father/projects' : '/kid/investments',
      });
    });

    // 6. Partner Rewards
    items.push(
      {
        id: 'rew-sony',
        category: 'مكافآت',
        title: 'بطاقة شحن PlayStation بقيمة 10 دولارات (Sony)',
        subtitle: 'متجر المكافآت • التكلفة: 100 نقطة ولاء 🌟',
        badge: '100 نقطة',
        icon: '🎮',
        url: '/kid/rewards',
      },
      {
        id: 'rew-jarir',
        category: 'مكافآت',
        title: 'قسيمة مشتريات مكتبة جرير بقيمة 50 ريال',
        subtitle: 'متجر المكافآت • التكلفة: 150 نقطة ولاء 🌟',
        badge: '150 نقطة',
        icon: '📚',
        url: '/kid/rewards',
      },
      {
        id: 'rew-cinema',
        category: 'مكافآت',
        title: 'تذكرة سينما موفي / صالات ترفيهية',
        subtitle: 'متجر المكافآت • التكلفة: 80 نقطة ولاء 🌟',
        badge: '80 نقطة',
        icon: '🍿',
        url: '/kid/rewards',
      }
    );

    return items;
  }, [kids, projects, profile]);

  // Filtered results based on search query and category
  const filteredResults = useMemo(() => {
    let list = allItems;
    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return list.slice(0, 10);

    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(cleanQuery) ||
        item.subtitle.toLowerCase().includes(cleanQuery) ||
        item.category.toLowerCase().includes(cleanQuery)
    );
  }, [allItems, query, selectedCategory]);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'مهام', label: 'المهام 📝' },
    { id: 'حصالات', label: 'الحصالات 💰' },
    { id: 'مشاريع', label: 'المشاريع 📈' },
    { id: 'مكافآت', label: 'المكافآت 🎁' },
    { id: 'أبناء', label: 'الأبناء 👦' },
    { id: 'صفحات', label: 'الصفحات 🧭' },
  ];

  if (!isOpen) return null;

  const handleSelectItem = (item: SearchResult) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.url) {
      navigate(item.url);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 pt-16 md:pt-24 bg-[#0C2341]/60 backdrop-blur-xl animate-fade-in font-sans">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        dir="rtl"
        className="relative w-full max-w-2xl bg-white/90 border border-white/40 shadow-2xl rounded-3xl overflow-hidden z-10 backdrop-blur-2xl text-right transition-all flex flex-col max-h-[80vh]"
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-stone-200/60 bg-gradient-to-r from-stone-50/80 to-white/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0C2341] text-white flex items-center justify-center shrink-0 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أي مهمة، حصالة، مشروع، مكافأة، أو قسم..."
            className="w-full bg-transparent text-sm md:text-base font-bold text-[#0C2341] placeholder:text-slate-400 outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-stone-200/60 hover:bg-stone-300 text-xs font-bold text-slate-700 transition-all cursor-pointer"
          >
            إغلاق (ESC)
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto bg-stone-50/50">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0C2341] text-white shadow-sm'
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-stone-200/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1 min-h-[220px]">
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="group p-3 rounded-2xl hover:bg-gradient-to-r hover:from-[#8B84D7]/10 hover:to-[#C66E4E]/10 border border-transparent hover:border-[#8B84D7]/20 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-stone-200/60 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs md:text-sm font-extrabold text-[#0C2341] group-hover:text-[#8B84D7] transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-slate-500 border border-stone-200/40">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-[10px] font-black text-[#C66E4E] bg-[#C66E4E]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {item.badge}
                    </span>
                  )}
                  <span className="text-slate-400 group-hover:translate-x-[-4px] transition-transform text-sm">
                    ⬅
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="text-4xl animate-bounce">🔍</div>
              <h5 className="text-sm font-extrabold text-[#0C2341]">لا توجد نتائج تطابق بحثك</h5>
              <p className="text-xs text-slate-400">
                جرب البحث بكلمات أخرى مثل: "مهمة"، "سوني"، "ادخار"، "استثمار"، أو أسماء الأبناء.
              </p>
            </div>
          )}
        </div>

        {/* Footer Quick Hints */}
        <div className="p-3 bg-stone-50 border-t border-stone-200/60 flex justify-between items-center text-[10px] text-slate-500 font-bold">
          <span>نتائج البحث: {filteredResults.length} عنصر متاح</span>
          <span className="flex items-center gap-1.5">
            <span>انقر على أي عنصر للانتقال الفوري إليه</span>
            <span>⚡</span>
          </span>
        </div>
      </div>
    </div>
  );
}
