import { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface AIActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string, details?: any) => void;
}

export default function AIActionMenu({ isOpen, onClose, onSelectAction }: AIActionMenuProps) {
  const { kids } = useApp();
  const [showSubForm, setShowSubForm] = useState(false);
  const [selectedKid, setSelectedKid] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  if (!isOpen) return null;

  const handleSuggestTaskSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedKid) return;
    onSelectAction('suggest_task', { kidName: selectedKid, notes: taskNotes });
    setSelectedKid('');
    setTaskNotes('');
    setShowSubForm(false);
    onClose();
  };

  return (
    <div className="absolute bottom-16 left-6 z-40 w-72 bg-white border border-stone-200/80 shadow-2xl rounded-2xl p-4 text-right font-sans backdrop-blur-md animate-fade-in text-[#0C2341]">
      <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-3">
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-[#0C2341] text-xs font-bold transition-colors"
        >
          ✕
        </button>
        <h4 className="text-xs font-black text-[#0C2341] flex items-center gap-1">
          <span>أدوات المستشار الذكي 🤖</span>
        </h4>
      </div>

      {!showSubForm ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowSubForm(true)}
            className="w-full text-right p-2.5 rounded-xl bg-stone-50 hover:bg-[#8B84D7]/10 border border-stone-200/60 hover:border-[#8B84D7]/30 text-[#0C2341] text-xs font-bold transition-all flex items-center justify-between"
          >
            <span className="text-[10px] text-slate-500 font-sans">توليد مهمة ذكية</span>
            <span className="flex items-center gap-2">
              <span>اقتراح مهمة</span>
              <span>🎯</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectAction('family_analysis');
              onClose();
            }}
            className="w-full text-right p-2.5 rounded-xl bg-stone-50 hover:bg-[#8B84D7]/10 border border-stone-200/60 hover:border-[#8B84D7]/30 text-[#0C2341] text-xs font-bold transition-all flex items-center justify-between"
          >
            <span className="text-[10px] text-slate-500 font-sans">تقرير مالي متكامل</span>
            <span className="flex items-center gap-2">
              <span>تحليل شامل للأسرة</span>
              <span>📊</span>
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 font-bold">اختر الابن</label>
            <select
              required
              value={selectedKid}
              onChange={(e) => setSelectedKid(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-2.5 py-2 text-right text-[#0C2341] text-xs outline-none transition-all"
            >
              <option value="">-- اختر من الأبناء --</option>
              {kids.map((k) => (
                <option key={k.id} value={k.name}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 font-bold">نوع المهمة/ملاحظات (اختياري)</label>
            <input
              type="text"
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              placeholder="مثال: تحفيز على الادخار، مهارة جديدة"
              className="w-full bg-stone-50 border border-stone-200 focus:border-[#8B84D7] rounded-xl px-2.5 py-2 text-right text-[#0C2341] text-xs outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowSubForm(false)}
              className="px-3 py-1.5 border border-stone-200 text-slate-600 hover:text-[#0C2341] rounded-lg text-[10px] bg-stone-50 hover:bg-stone-100 transition-all"
            >
              رجوع
            </button>
            <button
              type="button"
              onClick={() => handleSuggestTaskSubmit()}
              className="px-4 py-1.5 bg-[#0C2341] hover:bg-[#8B84D7] text-white font-bold rounded-lg text-[10px] transition-all shadow-sm active:scale-95"
            >
              اقتراح 🤖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
