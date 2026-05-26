import React from 'react';
import { ChevronLeft, ArrowUpRight, DollarSign, Sparkles } from 'lucide-react';
import { SavingsGoal, UserProfile } from '../types';

interface PlanScreenProps {
  user: UserProfile;
  goals: SavingsGoal[];
  onTopUp: (goalId: string, amount: number) => void;
  onBackToHome: () => void;
  availableBalance: number;
}

export default function PlanScreen({
  user,
  goals,
  onTopUp,
  onBackToHome,
  availableBalance
}: PlanScreenProps) {
  const [selectedGoal, setSelectedGoal] = React.useState<SavingsGoal | null>(null);
  const [topUpAmount, setTopUpAmount] = React.useState<string>('500');
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Calculate sum dynamically
  const totalSaved = goals.reduce((acc, current) => acc + current.currentAmount, 0);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(topUpAmount);
    if (selectedGoal && !isNaN(numericAmount) && numericAmount > 0) {
      if (numericAmount > availableBalance) {
        alert('Số dư tài khoản chính không đủ để bơm thêm tiền vào quỹ tiết kiệm!');
        return;
      }
      onTopUp(selectedGoal.id, numericAmount);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedGoal(null);
        setTopUpAmount('500');
      }, 1500);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24" id="plan-screen-viewport">
      {/* Royal purple header */}
      <div className="bg-gradient-to-b from-[#8C3CFF] via-[#7F26FD] to-[#6c0be1] pt-12 pb-24 px-6 text-white relative">
        <div className="flex items-center mb-6">
          <button
            onClick={onBackToHome}
            aria-label="Back to home"
            className="p-1 hover:bg-white/10 active:bg-white/20 rounded-full transition mr-3 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <span className="text-base font-bold flex-1 text-center pr-9 select-none">Savings Funds Detail</span>
        </div>

        {/* Total Saved summary */}
        <div className="text-center flex flex-col items-center select-none">
          <span className="text-xs text-purple-200 font-semibold tracking-wide uppercase">Total Saved</span>
          <span className="text-[34px] font-bold mt-1 tracking-tight font-sans">
            {formatCurrency(totalSaved)}
          </span>
          <div className="inline-flex mt-2 px-3 py-1 bg-white/15 rounded-full text-[10px] font-bold backdrop-blur-md border border-white/5 uppercase">
            <span className="text-purple-100">Across all funds</span>
          </div>
        </div>
      </div>

      {/* overlap content */}
      <div className="bg-white rounded-t-[32px] px-5 pt-6 flex-1 -mt-16 z-10 shadow-lg border-t border-slate-50">
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);

            // Match colors to screenshots
            let imageIconBg = 'bg-cyan-50 border-cyan-150 text-cyan-600';
            if (goal.name.includes('Emergency')) imageIconBg = 'bg-sky-50 border-sky-100/50 text-sky-600';
            else if (goal.name.includes('Car')) imageIconBg = 'bg-pink-50 border-pink-100/50 text-pink-600';
            else if (goal.name.includes('Vacation')) imageIconBg = 'bg-emerald-50 border-emerald-100/50 text-emerald-600';

            return (
              <div
                key={goal.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs hover:shadow-sm hover:border-slate-200 transition duration-300 relative overflow-hidden"
              >
                {/* Title line */}
                <div className="flex justify-between items-center mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${imageIconBg}`}>
                      {goal.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-800 tracking-tight leading-none">{goal.name}</span>
                  </div>
                  <button
                    onClick={() => { setSelectedGoal(goal); setIsSuccess(false); }}
                    className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-100 rounded-full text-[10px] font-bold text-slate-600 transition flex items-center gap-1 cursor-pointer"
                  >
                    Top up <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </button>
                </div>

                {/* Progressive Bar showing purple-cyan elements matching visual */}
                <div className="relative w-full h-[18px] bg-slate-100 rounded-full overflow-hidden flex items-center mb-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-400 flex items-center px-3"
                    style={{ width: `${percentage}%` }}
                  />
                  {/* Floating percentage label */}
                  <span className="absolute left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 select-none z-10">
                    {percentage}% Saved
                  </span>
                </div>

                {/* Values labels and DUPLICATED Top up button exactly as screen 3 */}
                <div className="flex justify-between items-center mt-1">
                  <div className="text-[11px] font-bold text-slate-800">
                    {formatCurrency(goal.currentAmount)} <span className="text-slate-400 font-semibold text-[10px] ml-0.5">of {formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <button
                    onClick={() => { setSelectedGoal(goal); setIsSuccess(false); }}
                    className="px-3.5 py-1.5 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-700 transition cursor-pointer"
                  >
                    Top up
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Interactive Savings Top Up Drawer */}
      {selectedGoal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[385px] rounded-t-[32px] p-6 shadow-2xl border-t border-slate-100 transition duration-305">
            {isSuccess ? (
              <div className="py-10 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-emerald-600 animate-bounce" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Bơm quỹ thành công!</h4>
                <p className="text-xs text-slate-500 mt-2">
                  Đã chuyển thêm vào quỹ <span className="font-bold text-purple-600">{selectedGoal.name}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTopUpSubmit}>
                <div className="flex justify-between items-center mb-5">
                  <h4 className="text-sm font-bold text-slate-900">Bơm Quỹ Tiết Kiệm ({selectedGoal.icon} {selectedGoal.name})</h4>
                  <button
                    type="button"
                    onClick={() => setSelectedGoal(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
                  >
                    Đóng
                  </button>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-400 mb-2 selection:bg-purple-100">
                    SỐ TIỀN MUỐN TIẾT KIỆM (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      required
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200/80 rounded-xl py-3 pl-8 pr-4 text-sm font-bold focus:outline-hidden focus:border-purple-500 transition-all font-mono"
                      placeholder="0.00"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 block font-medium">
                    Số dư khả dụng hiện tại: <span className="font-bold text-slate-700">{formatCurrency(availableBalance)}</span>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl text-xs transition duration-200 shadow-md shadow-purple-100"
                >
                  Xác nhận nạp và chuyển số dư
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
