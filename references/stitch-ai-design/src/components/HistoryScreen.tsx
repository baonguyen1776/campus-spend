import React from 'react';
import { Transaction, UserProfile } from '../types';
import { Search, SlidersHorizontal, ArrowLeft, ArrowUpRight, ShoppingCart, Coffee, Landmark, ShoppingBag, Fuel } from 'lucide-react';

interface HistoryScreenProps {
  user: UserProfile;
  transactions: Transaction[];
  onBack: () => void;
  categories: string[];
}

export default function HistoryScreen({ user, transactions, onBack, categories }: HistoryScreenProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = React.useState<string | null>(null);
  const [showFilterOverlay, setShowFilterOverlay] = React.useState(false);

  const formatCurrency = (val: number, symbol: string = '$') => {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).replace('$', symbol);
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedFilterCategory ? tx.category === selectedFilterCategory : true;
      return matchSearch && matchCategory;
    });
  }, [transactions, searchTerm, selectedFilterCategory]);

  // Group by relative dates (Today, Yesterday, and Older)
  const groupedTransactions = React.useMemo(() => {
    const today: Transaction[] = [];
    const yesterday: Transaction[] = [];
    const older: { [key: string]: Transaction[] } = {};

    const todayStr = '2026-01-14'; // base simulation anchor date matching mock clock
    const yesterdayStr = '2026-01-13';

    filteredTransactions.forEach(tx => {
      if (tx.date === todayStr) {
        today.push(tx);
      } else if (tx.date === yesterdayStr) {
        yesterday.push(tx);
      } else {
        const optionDate = new Date(tx.date);
        const dateLabel = optionDate.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        if (!older[dateLabel]) {
          older[dateLabel] = [];
        }
        older[dateLabel].push(tx);
      }
    });

    return { today, yesterday, older };
  }, [filteredTransactions]);

  const getHistoryIcon = (title: string, category: string) => {
    const t = title.toLowerCase();
    const c = category.toLowerCase();

    if (t.includes('amazon')) {
      return <ShoppingCart className="w-5 h-5 text-purple-600" />;
    } else if (t.includes('starbucks') || t.includes('bistro') || c.includes('dining')) {
      return <Coffee className="w-5 h-5 text-purple-600" />;
    } else if (t.includes('salary') || t.includes('deposit') || c.includes('salary')) {
      return <Landmark className="w-5 h-5 text-purple-600" />;
    } else if (t.includes('foods') || c.includes('shop')) {
      return <ShoppingBag className="w-5 h-5 text-purple-600" />;
    } else if (t.includes('chevron') || c.includes('transport')) {
      return <Fuel className="w-5 h-5 text-purple-600" />;
    }
    return <ShoppingCart className="w-5 h-5 text-purple-600" />;
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto no-scrollbar pb-24 px-6 pt-10" id="history-screen-viewport">
      
      {/* Search and Navigation Title */}
      <div className="flex items-center gap-3 mb-6.5 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-slate-150 active:bg-slate-200 rounded-full transition cursor-pointer"
            aria-label="Back to dashboard home"
          >
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight select-none">Transactions</h2>
        </div>
      </div>

      {/* Search Input and Filter Slider triggers */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-55 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-400 focus:bg-white transition"
            placeholder="Search transactions"
          />
        </div>
        <button
          onClick={() => setShowFilterOverlay(!showFilterOverlay)}
          className={`p-3.5 border rounded-2xl transition duration-200 cursor-pointer ${showFilterOverlay || selectedFilterCategory ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-150 text-slate-500 hover:text-slate-800 bg-slate-50/50'}`}
        >
          <SlidersHorizontal className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Floating Filter Overlay choices */}
      {showFilterOverlay && (
        <div className="mb-6 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lọc nhanh theo danh mục:</span>
            {selectedFilterCategory && (
              <button
                onClick={() => setSelectedFilterCategory(null)}
                className="text-[10px] font-bold text-purple-600 hover:text-purple-800"
              >
                Xóa lọc
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilterCategory(selectedFilterCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition duration-200 cursor-pointer ${selectedFilterCategory === cat ? 'bg-purple-600 text-white shadow-xs' : 'bg-white border border-slate-150 text-slate-700 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results group matching Today / Yesterday */}
      <div className="space-y-6">
        
        {/* Today List Section */}
        {groupedTransactions.today.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-3 select-none">Today</h3>
            <div className="space-y-3">
              {groupedTransactions.today.map((tx) => {
                const isMinus = tx.type === 'expense';
                return (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-55 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-100/30 flex items-center justify-center">
                        {getHistoryIcon(tx.title, tx.category)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight tracking-tight">{tx.title}</h4>
                        <span className="text-[9px] text-slate-400 font-medium font-mono mt-1 block">{tx.time || '12:00 PM'}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold font-sans ${isMinus ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {isMinus ? '-' : '+'}{formatCurrency(Math.abs(tx.amount), user.currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Yesterday List Section */}
        {groupedTransactions.yesterday.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-3 select-none">Yesterday</h3>
            <div className="space-y-3">
              {groupedTransactions.yesterday.map((tx) => {
                const isMinus = tx.type === 'expense';
                return (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-55 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-100/30 flex items-center justify-center">
                        {getHistoryIcon(tx.title, tx.category)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight tracking-tight">{tx.title}</h4>
                        <span className="text-[9px] text-slate-400 font-medium font-mono mt-1 block">{tx.time || '12:00 PM'}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold font-sans ${isMinus ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {isMinus ? '-' : '+'}{formatCurrency(Math.abs(tx.amount), user.currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Older Records Section */}
        {Object.entries(groupedTransactions.older).map(([dateLabel, items]) => (
          <div key={dateLabel}>
            <h3 className="text-xs font-bold text-slate-400 mb-3 select-none">{dateLabel}</h3>
            <div className="space-y-3">
              {(items as Transaction[]).map((tx) => {
                const isMinus = tx.type === 'expense';
                return (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-55 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-100/30 flex items-center justify-center">
                        {getHistoryIcon(tx.title, tx.category)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight tracking-tight">{tx.title}</h4>
                        <span className="text-[9px] text-slate-400 font-medium font-mono mt-1 block">{tx.time || '12:00 PM'}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold font-sans ${isMinus ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {isMinus ? '-' : '+'}{formatCurrency(Math.abs(tx.amount), user.currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty status map */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-150">
            <p className="text-xs text-slate-400 font-semibold selection:bg-purple-100">Không tìm thấy giao dịch nào phù hợp.</p>
          </div>
        )}
      </div>

    </div>
  );
}
