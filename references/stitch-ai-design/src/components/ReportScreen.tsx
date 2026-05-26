import React from 'react';
import { UserProfile, Transaction } from '../types';
import { ChevronDown, Utensils, ShoppingBag, Car, Landmark } from 'lucide-react';

interface ReportScreenProps {
  user: UserProfile;
  transactions: Transaction[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export default function ReportScreen({
  user,
  transactions,
  selectedMonth,
  setSelectedMonth
}: ReportScreenProps) {
  const [reportRange, setReportRange] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  // Compute dynamic sums
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpenses = expenses.reduce((acc, t) => acc + Math.abs(t.amount), 0) || 1450.25;

  // Group expenses by category
  const categoryAllocations = React.useMemo(() => {
    const allocations: { [key: string]: number } = {
      'Food & Dining': 0,
      'Shopping': 0,
      'Transport': 0,
      'Bills': 0,
      'Others': 0,
    };

    expenses.forEach(t => {
      let cat = t.category;
      if (cat === 'Salary' || cat === 'Investment') return; // skip income categories
      if (allocations[cat] !== undefined) {
        allocations[cat] += Math.abs(t.amount);
      } else {
        allocations['Others'] += Math.abs(t.amount);
      }
    });

    // If empty, supply standard mock breakdown to match screen layout exactly
    const baseSum = Object.values(allocations).reduce((a, b) => a + b, 0);
    if (baseSum === 0) {
      return [
        { name: 'Food', percentage: 45, value: totalExpenses * 0.45, color: '#8C3CFF', icon: '🍽️' },
        { name: 'Shopping', percentage: 25, value: totalExpenses * 0.25, color: '#0EA5E9', icon: '🛍️' },
        { name: 'Transport', percentage: 15, value: totalExpenses * 0.15, color: '#F43F5E', icon: '🚗' },
        { name: 'Bills', percentage: 10, value: totalExpenses * 0.10, color: '#10B981', icon: '💵' },
        { name: 'Others', percentage: 10, value: totalExpenses * 0.10, color: '#94A3B8', icon: '⚙️' },
      ];
    }

    return Object.entries(allocations).map(([name, val]) => {
      // Shorten name to match screenshot pie labels
      let label = name;
      let color = '#94A3B8';
      let icon = '⚙️';
      if (name === 'Food & Dining') { label = 'Food'; color = '#8C3CFF'; icon = '🍽️'; }
      else if (name === 'Shopping') { label = 'Shopping'; color = '#0EA5E9'; icon = '🛍️'; }
      else if (name === 'Transport') { label = 'Transport'; color = '#F43F5E'; icon = '🚗'; }
      else if (name === 'Bills') { label = 'Bills'; color = '#10B981'; icon = '💵'; }

      const percentage = Math.round((val / baseSum) * 100);
      return {
        name: label,
        percentage,
        value: val,
        color,
        icon
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [expenses, totalExpenses]);

  // SVG Donut helpers
  let accumulatedAngle = 0;
  const strokeWidth = 14;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  // Double bar chart data matching comparison in screenshot (Jan - May)
  const monthlyComparison = [
    { month: 'Jan', income: 1500, expenses: 1000 },
    { month: 'Feb', income: 1400, expenses: 1100 },
    { month: 'Mar', income: 1600, expenses: 1350 },
    { month: 'Apr', income: 1450, expenses: 1400 },
    { month: 'May', income: 1750, expenses: 1250 },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24" id="report-screen-viewport">
      {/* Header section with gradient background */}
      <div className="bg-gradient-to-b from-[#8C3CFF] via-[#7F26FD] to-[#6c0be1] pt-12 pb-24 px-6 text-white relative">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white/40 shadow-sm object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-base font-bold select-none">Financial Report</span>
          <div className="relative group/month">
            <button className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-xs font-semibold backdrop-blur-md border border-white/5 cursor-pointer">
              <span>{selectedMonth}</span>
              <ChevronDown className="w-3" />
            </button>
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
        </div>

        {/* Tab Selection Filter */}
        <div className="bg-white/15 p-1 rounded-full flex justify-between items-center backdrop-blur-md border border-white/5">
          <button
            onClick={() => setReportRange('weekly')}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition duration-300 ${reportRange === 'weekly' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-100/80 hover:text-white'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setReportRange('monthly')}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition duration-300 ${reportRange === 'monthly' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-100/80 hover:text-white'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setReportRange('yearly')}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition duration-300 ${reportRange === 'yearly' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-100/80 hover:text-white'}`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Main Content Area Container */}
      <div className="bg-white rounded-t-[32px] px-5 pt-6 flex-1 -mt-16 z-10 shadow-lg border-t border-slate-50">
        
        {/* Pie / Donut Chart Frame */}
        <div className="flex flex-col items-center py-4 relative border-b border-slate-100 pb-6 mb-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Custom Responsive SVG Donut Chart */}
            <svg className="w-full h-full transform -rotate-90">
              {categoryAllocations.map((cat, i) => {
                const angle = (cat.percentage / 100) * 360;
                const strokeDashoffset = circumference - (cat.percentage / 100) * circumference;
                const rotation = accumulatedAngle;
                accumulatedAngle += angle;

                return (
                  <circle
                    key={cat.name}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={cat.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${rotation} 80 80)`}
                    className="transition-all duration-500 ease-out hover:opacity-90"
                    style={{ transformOrigin: '80px 80px' }}
                  />
                );
              })}
            </svg>

            {/* Inner Text Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
              <span className="text-[17px] font-bold text-slate-900 mt-0.5 font-sans">
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Mini labels map corresponding overlay image */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-2.5 mt-5 w-full max-w-[280px]">
            {categoryAllocations.map(cat => (
              <div key={cat.name} className="flex flex-col items-center text-center">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <span className="text-[11px] text-slate-400 font-bold mt-0.5">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories block layout */}
        <div className="mb-6.5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 select-none">Top Categories</h3>
          <div className="space-y-4">
            {categoryAllocations.slice(0, 3).map((cat) => {
              // Custom graphic representation match
              let iconBg = 'bg-purple-100 text-purple-600';
              if (cat.name === 'Shopping') iconBg = 'bg-sky-100 text-sky-600';
              if (cat.name === 'Transport') iconBg = 'bg-rose-100 text-rose-600';

              return (
                <div key={cat.name} className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${iconBg}`}>
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                      <span>{cat.name === 'Food' ? 'Food & Dining' : cat.name}</span>
                      <span>{cat.percentage}%</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Comparison double bar block layout */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 select-none">Monthly Comparison</h3>
            {/* Custom chart legends */}
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C3CFF] inline-block" /> Income
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Expenses
              </span>
            </div>
          </div>

          {/* SVG Custom double bar rendering */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 h-44 flex flex-col justify-between">
            <div className="flex-1 flex items-end justify-between px-2 gap-4 h-32 relative">
              
              {/* Horizontal Help Line grids */}
              <div className="absolute inset-x-0 top-0 border-t border-slate-200/50" />
              <div className="absolute inset-x-0 h-0 top-[50%] border-t border-slate-201/50" />
              <div className="absolute inset-x-0 bottom-0 border-b border-slate-200" />

              {monthlyComparison.map(item => {
                // Normalize heights
                const maxVal = 2000;
                const incHeight = (item.income / maxVal) * 100;
                const expHeight = (item.expenses / maxVal) * 100;

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center group relative cursor-help">
                    {/* Double Bars Container bar side by side */}
                    <div className="flex items-end justify-center gap-1.5 w-full h-[6.5rem]">
                      {/* Income purple column */}
                      <div
                        className="w-2.5 bg-[#8C3CFF] rounded-t-sm hover:opacity-85 transition-all duration-300 relative"
                        style={{ height: `${incHeight}%` }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bg-[#121214] text-white rounded px-1.5 py-0.5 text-[8px] font-bold -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none">
                          In: ${item.income}
                        </div>
                      </div>

                      {/* Expense red column */}
                      <div
                        className="w-2.5 bg-rose-500 rounded-t-sm hover:opacity-85 transition-all duration-300 relative"
                        style={{ height: `${expHeight}%` }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bg-[#121214] text-white rounded px-1.5 py-0.5 text-[8px] font-bold -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none">
                          Ex: ${item.expenses}
                        </div>
                      </div>
                    </div>

                    {/* Month Label */}
                    <span className="text-[10px] font-bold text-slate-400 mt-2 hover:text-slate-700 transition">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
