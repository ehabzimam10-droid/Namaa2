import { useState, useEffect, useRef } from 'react';

interface DynamicCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  autoRotateInterval?: number;
}

export default function DynamicCarousel<T>({
  items,
  renderItem,
  autoRotateInterval = 5000,
}: DynamicCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalItems = items.length;

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (totalItems > 1) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % totalItems);
      }, autoRotateInterval);
    }
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [totalItems, autoRotateInterval]);

  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-xs text-slate-400">
        لا توجد عناصر لعرضها.
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    resetTimer();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % totalItems);
    resetTimer();
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
    resetTimer();
  };

  return (
    <div className="relative w-full overflow-hidden select-none group/carousel">
      {/* Items Container */}
      <div className="relative min-h-[80px] flex items-center justify-center transition-all duration-500">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`w-full transition-all duration-500 transform absolute inset-0 flex items-center justify-center ${idx === activeIndex
              ? 'opacity-100 translate-x-0 pointer-events-auto relative'
              : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {/* Manual Navigation Controls (only if more than 1 item) */}
      {totalItems > 1 && (
        <>
          {/* Right Chevron (Prev in RTL context, going backwards) */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 active:scale-90"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Left Chevron (Next in RTL context, going forwards) */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 active:scale-90"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center items-center gap-1.5 mt-4">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleDotClick(e, idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex
                  ? 'w-4 bg-orange-500' // تم تعديلها إلى 500 بدلاً من 450
                  : 'w-1.5 bg-white/60 hover:bg-white/80'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
