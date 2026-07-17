import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class VillageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      const isWebGL = this.state.message.toLowerCase().includes('webgl');
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#0D1527] text-center">
          <div className="text-5xl">{isWebGL ? '🖥️' : '⚠️'}</div>
          <p className="text-lg font-black text-yellow-300">
            {isWebGL ? 'WebGL غير مدعوم في هذا المتصفح' : 'خطأ في تحميل المشهد'}
          </p>
          <p className="max-w-xs text-xs text-slate-400 leading-relaxed">
            {isWebGL
              ? 'القرية ثلاثية الأبعاد تتطلب WebGL. جرّب Chrome أو Firefox أو Edge على جهاز يدعم الرسومات.'
              : this.state.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="mt-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-all"
          >
            إعادة المحاولة ↺
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
