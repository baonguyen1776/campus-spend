import React from 'react';
import { Sparkles, Laptop, Smartphone, HelpCircle } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
}

export default function DeviceFrame({ children, isMobileView, setIsMobileView }: DeviceFrameProps) {
  // Format current time for status bar
  const [time, setTime] = React.useState('9:41 AM');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  if (!isMobileView) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
        {/* Top Control Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 tracking-tight leading-tight">Personal Finance Tracker</h1>
              <span className="text-xs text-slate-500 font-medium">Smart Finance Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setIsMobileView(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 text-slate-600 hover:text-slate-900"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Xem trên Điện thoại
            </button>
            <button
              onClick={() => setIsMobileView(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-purple-700 shadow-xs transition-all duration-300"
            >
              <Laptop className="w-3.5 h-3.5" />
              Xem Toàn màn hình
            </button>
          </div>
        </header>

        {/* Full Desktop Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 flex flex-col items-center justify-center font-sans relative overflow-hidden selection:bg-purple-100">
      {/* Interactive Background Elements */}
      <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-purple-200 to-indigo-100 opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full bg-gradient-to-br from-indigo-200 to-pink-100 opacity-40 blur-3xl pointer-events-none" />

      {/* Mode Switcher Floating Badge */}
      <div className="mb-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-md flex items-center gap-3 z-30 transition-all hover:scale-105">
        <span className="text-xs text-slate-600 font-medium select-none">Trực quan hóa thiết kế:</span>
        <button
          onClick={() => setIsMobileView(false)}
          className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-[11px] font-bold shadow-xs hover:bg-purple-700 transition"
        >
          <Laptop className="w-3 h-3" />
          Bản rộng Desktop
        </button>
      </div>

      {/* Phone Case Container */}
      <div className="relative mx-auto w-[385px] h-[812px] bg-black rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border-[12px] border-slate-900 p-0 overflow-hidden flex flex-col justify-between z-20">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6.5 bg-black rounded-full z-50 flex items-center justify-between px-4 select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
          <div className="w-3 h-3 rounded-full bg-[#121212] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-indigo-900/40" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="absolute top-0 inset-x-0 h-10 px-6.5 flex justify-between items-end text-white text-[11px] font-bold z-40 select-none pb-1 pointer-events-none mix-blend-difference">
          <div>{time.split(' ')[0]}</div>
          <div className="flex items-center gap-1.5">
            {/* Carrier Wave Bar */}
            <div className="flex items-end gap-0.5 h-2.5">
              <span className="w-0.5 h-1 bg-white rounded-full" />
              <span className="w-0.5 h-1.5 bg-white rounded-full" />
              <span className="w-0.5 h-2 bg-white rounded-full" />
              <span className="w-0.5 h-2.5 bg-white rounded-full" />
            </div>
            <span>LTE</span>
            {/* Battery representation */}
            <div className="w-[18px] h-2.5 border border-white/80 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="flex-1 w-full h-full bg-white text-slate-800 flex flex-col relative overflow-hidden">
          {children}
        </div>

        {/* Bottom Swipe Bar for iOS Home */}
        <div className="absolute bottom-1 right-0 left-0 h-5 flex items-center justify-center z-50 pointer-events-none select-none">
          <div className="w-32 h-1 bg-slate-950 rounded-full transition-opacity duration-300 opacity-90" />
        </div>
      </div>

      {/* Support Instructions */}
      <p className="mt-4 text-center text-xs text-slate-500 max-w-sm px-4 select-none">
        Nhấn vào nút <span className="font-semibold text-slate-700">+</span> phía dưới để thêm giao dịch, <strong>Bản rộng Desktop</strong> để xem chế độ đa bảng điều khiển trực quan.
      </p>
    </div>
  );
}
