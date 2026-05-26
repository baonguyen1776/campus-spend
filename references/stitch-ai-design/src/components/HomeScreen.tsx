import React from 'react';
import { Bell, ChevronDown, Info, Sparkles, Filter, Clock, CreditCard, ShoppingBag, Car, Utensils, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction, UserProfile } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  transactions: Transaction[];
  onOpenHistory: () => void;
  onOpenAddTransaction: () => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export default function HomeScreen({
  user,
  transactions,
  onOpenHistory,
  onOpenAddTransaction,
  selectedMonth,
  setSelectedMonth
}: HomeScreenProps) {
  // Compute dynamically based on state to ensure high fidelity
  const totalBalance = 12450.25 + transactions.reduce((acc, current) => {
    // Offset from base baseline of 12450.25 (which corresponds to initial screen state)
    // To make interactions real: Let's calculate based on standard values:
    return acc + (current.type === 'income' ? current.amount : -Math.abs(current.amount));
  }, 0) - (-120.50 - 45.00 - 18.75 - 85.20 - 5.40 + 3200.00 - 112.55 - 45.00); // Baseline offsets

  const incomeSum = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenseSum = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Math.abs(t.amount), 0);

  // Group latest transactions
  const groupedTransactionsByDay = React.useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    transactions.slice(0, 4).forEach(t => {
      const dateOption = new Date(t.date);
      const formattedDate = dateOption.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }
      groups[formattedDate].push(t);
    });
    return groups;
  }, [transactions]);

  // Total for the listed on home transactions (simulating the Monday 12, Jan view)
  const mondayTotal = transactions
    .filter(t => t.date === '2026-01-12')
    .reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -Math.abs(t.amount)), 0);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food & dining':
      case 'food':
        return <Utensils className="w-5 h-5 text-orange-500" />;
      case 'shopping':
        return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      case 'transport':
        return <Car className="w-5 h-5 text-indigo-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-purple-600" />;
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food & dining':
        return 'bg-orange-50 border-orange-100/50';
      case 'shopping':
        return 'bg-amber-50 border-amber-100/50';
      case 'transport':
        return 'bg-indigo-50 border-indigo-100/50';
      default:
        return 'bg-purple-50 border-purple-100/50';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24" id="home-screen-viewport">
      {/* Royal Violet Header Section */}
      <div className="bg-gradient-to-b from-[#8C3CFF] via-[#7F26FD] to-[#6c0be1] pt-12 pb-20 px-6 text-white relative">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt="Avatar Profile"
              className="w-10 h-10 rounded-full border-2 border-white/40 shadow-sm object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Month Indicator */}
          <div className="relative group/month">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:bg-white/35 rounded-full text-xs font-semibold backdrop-blur-md transition border border-white/5 cursor-pointer">
              <span>{selectedMonth}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>
            {/* Custom dropdown elements for visuals */}
            <div className="absolute top-full mt-1 right-0 bg-white text-slate-800 rounded-xl py-1.5 shadow-xl border border-slate-100 opacity-0 group-hover/month:opacity-100 pointer-events-none group-hover/month:pointer-events-auto transition duration-200 z-50 min-w-[130px]">
              {['November 2025', 'December 2025', 'January 2026', 'February 2026'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className="w-full text-left px-4 py-2 hover:bg-purple-50 text-xs font-medium transition text-slate-700 hover:text-purple-700"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Button */}
          <button className="relative w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/5 transition cursor-pointer">
            <Bell className="w-4 h-4 text-white" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-purple-600 animate-pulse" />
          </button>
        </div>

        {/* Current Balance */}
        <div className="text-center flex flex-col items-center">
          <span className="text-[13px] text-purple-200 font-medium tracking-wide">Current Balance</span>
          <span className="text-[34px] font-bold mt-1 tracking-tight drop-shadow-xs font-sans">
            {formatCurrency(totalBalance)}
          </span>
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-1 mt-2.5 px-3.5 py-1 bg-white/15 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 selection:bg-purple-300">
            <span className="text-purple-100">+$4,500 than last week</span>
          </div>
        </div>
      </div>

      {/* Floating Dynamic Board Overlap */}
      <div className="bg-white rounded-t-[32px] px-5 pt-6 flex-1 -mt-10 z-10 shadow-lg border-t border-slate-50">
        
        {/* Income / Expense Card Row */}
        <div className="grid grid-cols-2 gap-4.5 mb-6">
          {/* Income card */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition-all duration-300 shadow-2xs group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-blue-50/80 flex items-center justify-center border border-blue-100/50">
                <span className="text-blue-500 font-bold text-xs">💰</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Income</span>
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition cursor-help" />
            </div>
            <div className="text-xl font-bold text-slate-900 leading-tight">
              {formatCurrency(incomeSum || 4500)}
            </div>
          </div>

          {/* Expenses card */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition-all duration-300 shadow-2xs group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-rose-50/80 flex items-center justify-center border border-rose-100/50">
                <span className="text-rose-500 font-bold text-xs">👛</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Expenses</span>
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition cursor-help" />
            </div>
            <div className="text-xl font-bold text-slate-900 leading-tight">
              {formatCurrency(expenseSum || 1200)}
            </div>
          </div>
        </div>

        {/* AI Insight Ready Banner */}
        <div className="bg-[#121214] rounded-2xl py-3 px-4.5 mb-6.5 flex justify-between items-center shadow-md border border-zinc-800 transition transform hover:scale-[1.01] hover:shadow-lg duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#A769FF] animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-zinc-300 font-semibold leading-none tracking-tight">Your insight is ready</p>
            </div>
          </div>
          <button className="text-[11px] font-bold text-[#A769FF] hover:text-purple-300 transition flex items-center gap-0.5 cursor-pointer">
            Get Pro <span className="text-xs">›</span>
          </button>
        </div>

        {/* Transactions Section Block */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Transactions</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenHistory}
                aria-label="Filter pins"
                className="p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenHistory}
                aria-label="Transaction Clock History"
                className="p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <Clock className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenHistory}
                className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 active:bg-purple-200 rounded-full text-[11px] font-bold font-sans transition cursor-pointer"
              >
                For the Period
              </button>
            </div>
          </div>

          {/* Group Header Info */}
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mb-2 px-1 select-none">
            <span>Monday, 12 January, 2026</span>
            <div className="text-[11px] text-slate-500">
              Total <span className="text-slate-900 font-bold ml-0.5">{formatCurrency(Math.abs(mondayTotal))}</span>
            </div>
          </div>

          {/* Transaction items list container */}
          <div className="space-y-3">
            {transactions.slice(0, 3).map((tx) => {
              const isMinus = tx.type === 'expense';
              return (
                <div
                  key={tx.id}
                  className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50/50 hover:shadow-xs transition duration-250 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getCategoryTheme(tx.category)}`}>
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 tracking-tight leading-tight">{tx.title}</h4>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" /> {tx.account}
                        </span>
                        {tx.note && (
                          <span className="text-[10px] text-slate-400">• {tx.note}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-bold font-sans ${isMinus ? 'text-slate-800' : 'text-emerald-600'}`}>
                      {isMinus ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium mt-1 font-mono">
                      {tx.time || '12:00 PM'}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty view state fallback */}
            {transactions.length === 0 && (
              <div className="text-center py-10 bg-slate-55 rounded-2xl border border-dashed border-slate-100 flex flex-col items-center">
                <p className="text-xs text-slate-400 font-medium">Chưa có giao dịch nào.</p>
                <button
                  onClick={onOpenAddTransaction}
                  className="mt-2 text-xs font-bold text-purple-600 hover:text-purple-800 transition"
                >
                  Tạo giao dịch đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
