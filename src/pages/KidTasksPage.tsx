import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidTasksPage() {
  const navigate = useNavigate();
  const { kids, profile, submitTaskProof, showToast } = useApp();
  
  // Find current active kid
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // State for active filter tab: 'pending' (قيد التنفيذ), 'under_review' (قيد المراجعة), 'approved' (المنجزة), 'expired' (غير منجزة)
  const [activeTab, setActiveTab] = useState<'pending' | 'under_review' | 'approved' | 'expired'>('pending');

  // State to simulate image upload loading spinner per task
  const [uploadLoading, setUploadLoading] = useState<Record<string, boolean>>({});

  const handleUploadProof = async (taskId: string) => {
    setUploadLoading((prev) => ({ ...prev, [taskId]: true }));
    
    // Simulate minor premium loading delay for proof upload
    setTimeout(async () => {
      await submitTaskProof(taskId);
      setUploadLoading((prev) => ({ ...prev, [taskId]: false }));
      showToast('تم رفع إثبات إنجاز المهمة بنجاح وهو الآن قيد مراجعة ولي الأمر! 📸✨', 'success');
    }, 1200);
  };

  const getCountdownText = (endDateStr?: string) => {
    if (!endDateStr) return null;
    const nowObj = new Date();
    const endObj = new Date(endDateStr);
    const diffTime = endObj.getTime() - nowObj.getTime();
    if (diffTime <= 0) {
      return 'انتهى الوقت';
    }
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (diffDays > 0) {
      return `الوقت المتبقي: ${diffDays} أيام و ${diffHours} ساعات`;
    }
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHours > 0) {
      return `الوقت المتبقي: ${diffHours} ساعات و ${diffMinutes} دقائق`;
    }
    return `الوقت المتبقي: ${diffMinutes} دقائق`;
  };

  const getTaskCategory = (task: any) => {
    if (task.status === 'approved') return 'approved';
    if (task.status === 'under_review') return 'under_review';
    if (task.status === 'expired' || task.status === 'failed') return 'expired';
    if (task.status === 'pending') {
      if (task.endDate && new Date(task.endDate) < new Date()) {
        return 'expired';
      }
      return 'pending';
    }
    return 'pending';
  };

  const filteredTasks = (kid.tasks || [])
    .filter((task) => getTaskCategory(task) === activeTab)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header with Back Button */}
      <div className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C66E4E]/5 blur-2xl"></div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/kid')}
            className="rounded-xl bg-[#0C2341]/5 hover:bg-[#0C2341]/10 px-3 py-2 text-xs font-bold text-slate-600 transition-all border border-[#0C2341]/10"
          >
            👦 العودة للوحة التحكم
          </button>
          <div>
            <h2 className="text-xs font-semibold text-[#C66E4E]">قائمة الواجبات المنزلية والمهام</h2>
            <h3 className="text-2xl font-black text-[#0C2341] mt-1">المهام والمسؤوليات 🧹</h3>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-[#C66E4E]/10 border border-[#C66E4E]/25 text-[#0C2341] p-4 rounded-2xl text-xs leading-relaxed">
        <strong>💡 كيف تنجز مهامك وتكسب المكافأة؟</strong> قم بإنجاز المهمة المطلوبة منك في المنزل، ثم اضغط على "إرفاق إثبات" 
        لرفع صورة تثبت عملك. سيراجع والداك الإثبات، وفور اعتماد المهمة ستضاف المكافأة (سواء كانت ريالاً أو نقاطاً) تلقائياً لحصالتك! 🌟
      </div>

      {/* Grid of Task Cards */}
      <div className="space-y-4 text-[#0C2341]">
        <h4 className="text-sm font-bold text-[#C66E4E]">المهام المسندة إليك 📅</h4>

        {/* Tab Filters */}
        <div className="grid grid-cols-4 gap-1 bg-[#0C2341]/5 p-1 rounded-2xl border border-[#0C2341]/10">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 rounded-xl text-[10px] md:text-xs font-bold transition-all text-center ${
              activeTab === 'pending'
                ? 'bg-[#C66E4E] text-white shadow-md'
                : 'text-slate-555 hover:text-[#0C2341]'
            }`}
          >
            قيد التنفيذ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('under_review')}
            className={`py-2 px-1 rounded-xl text-[10px] md:text-xs font-bold transition-all text-center ${
              activeTab === 'under_review'
                ? 'bg-[#C66E4E] text-white shadow-md'
                : 'text-slate-555 hover:text-[#0C2341]'
            }`}
          >
            قيد المراجعة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('approved')}
            className={`py-2 px-1 rounded-xl text-[10px] md:text-xs font-bold transition-all text-center ${
              activeTab === 'approved'
                ? 'bg-[#C66E4E] text-white shadow-md'
                : 'text-slate-555 hover:text-[#0C2341]'
            }`}
          >
            المنجزة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expired')}
            className={`py-2 px-1 rounded-xl text-[10px] md:text-xs font-bold transition-all text-center ${
              activeTab === 'expired'
                ? 'bg-[#C66E4E] text-white shadow-md'
                : 'text-slate-555 hover:text-[#0C2341]'
            }`}
          >
            غير منجزة
          </button>
        </div>

        {filteredTasks && filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTasks.map((task) => {
              const isLoading = uploadLoading[task.id] || false;
              const isExpired = getTaskCategory(task) === 'expired';
              const countdown = getCountdownText(task.endDate);
              
              return (
                <div
                  key={task.id}
                  className="relative overflow-hidden bg-white border border-[#0C2341]/10 shadow-sm rounded-3xl p-5 text-right flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.01] hover:border-[#8B84D7]/50 text-[#0C2341]"
                >
                  <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-[#C66E4E]/5 blur-xl"></div>

                  <div className="flex justify-between items-start border-b border-[#0C2341]/5 pb-3">
                    {/* Status Badge */}
                    {task.status === 'pending' && !isExpired && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        معلقة ⏳
                      </span>
                    )}
                    {task.status === 'pending' && isExpired && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/25">
                        منتهية ❌
                      </span>
                    )}
                    {task.status === 'under_review' && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/25 animate-pulse font-sans">
                        بانتظار مراجعة الولي ⏳
                      </span>
                    )}
                    {task.status === 'approved' && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/25">
                        تمت الموافقة 💰
                      </span>
                    )}

                    <h5 className="font-extrabold text-sm text-[#0C2341]">{task.title}</h5>
                  </div>

                  {/* Countdown display */}
                  {task.endDate && (
                    <div className="text-[10px] font-bold text-right flex justify-end gap-1 items-center">
                      <span className={isExpired ? 'text-rose-600 font-sans' : 'text-[#C66E4E] font-sans'}>
                        ⏱️ {countdown}
                      </span>
                    </div>
                  )}

                  {/* Reward Detail */}
                  <div className="flex justify-between items-center bg-[#0C2341]/5 p-3 rounded-2xl border border-[#0C2341]/10 text-xs">
                    <span className="font-extrabold text-[#0C2341] text-sm font-sans">
                      {task.rewardType === 'custom'
                        ? task.customReward || 'جائزة مخصصة 🎁'
                        : `${task.rewardAmount} ${task.rewardType === 'cash' ? 'ريال 💸' : 'نقطة 🌟'}`}
                    </span>
                    <span className="text-slate-500 font-bold">المكافأة المقررة:</span>
                  </div>

                  {/* Actions based on Status */}
                  <div className="pt-2">
                    {task.status === 'pending' && !isExpired && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleUploadProof(task.id)}
                        className="w-full bg-[#C66E4E] hover:bg-[#C66E4E]/90 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-1 focus:outline-none"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin">⏳</span> جاري الرفع...
                          </span>
                        ) : (
                          <span>إرفاق إثبات 📸</span>
                        )}
                      </button>
                    )}

                    {task.status === 'pending' && isExpired && (
                      <div className="w-full bg-rose-500/10 border border-rose-500/25 text-rose-600 font-bold py-2.5 rounded-xl text-xs text-center font-sans">
                        انتهى وقت إنجاز المهمة ❌
                      </div>
                    )}

                    {task.status === 'under_review' && (
                      <button
                        type="button"
                        disabled
                        className="w-full bg-amber-500/10 border border-amber-500/25 text-amber-600 font-bold py-2.5 rounded-xl text-xs cursor-not-allowed text-center"
                      >
                        بانتظار مراجعة الولي ⏳
                      </button>
                    )}

                    {task.status === 'approved' && (
                      <div className="w-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 font-bold py-2.5 rounded-xl text-xs text-center font-sans">
                        تمت الموافقة واستلام المكافأة ✅
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#0C2341]/10 rounded-3xl p-6 text-center text-xs text-slate-500">
            لا توجد مهام في هذا القسم حالياً. 🌟
          </div>
        )}
      </div>
    </div>
  );
}
