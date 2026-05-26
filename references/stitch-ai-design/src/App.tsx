import React from 'react';
import { Home, BarChart3, Wallet, Settings as SettingsIcon, Plus, RefreshCw, LayoutGrid, Smartphone, Laptop } from 'lucide-react';
import { Transaction, SavingsGoal, UserProfile } from './types';
import { INITIAL_USER, INITIAL_SAVINGS_GOALS, INITIAL_TRANSACTIONS, CATEGORIES, ACCOUNTS } from './data';
import DeviceFrame from './components/DeviceFrame';
import HomeScreen from './components/HomeScreen';
import ReportScreen from './components/ReportScreen';
import PlanScreen from './components/PlanScreen';
import SettingsScreen from './components/SettingsScreen';
import HistoryScreen from './components/HistoryScreen';
import AddTransactionScreen from './components/AddTransactionScreen';

export default function App() {
  const [isMobileView, setIsMobileView] = React.useState(true);

  // Load state from localStorage or fallback to defaults
  const [user, setUser] = React.useState<UserProfile>(() => {
    const saved = localStorage.getItem('wallet_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
    const saved = localStorage.getItem('wallet_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = React.useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('wallet_savings_goals');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [currentTab, setCurrentTab] = React.useState<'home' | 'report' | 'plan' | 'settings'>('home');
  const [showHistory, setShowHistory] = React.useState(false);
  const [showAddTransaction, setShowAddTransaction] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState('November 2025');

  // Persistence Synchronizers
  React.useEffect(() => {
    localStorage.setItem('wallet_user', JSON.stringify(user));
  }, [user]);

  React.useEffect(() => {
    localStorage.setItem('wallet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  React.useEffect(() => {
    localStorage.setItem('wallet_savings_goals', JSON.stringify(goals));
  }, [goals]);

  // Handler Operations
  const handleModifyUser = (updated: UserProfile) => {
    setUser(updated);
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transactionObject: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [transactionObject, ...prev]);
  };

  const handleTopUpSavings = (goalId: string, amount: number) => {
    // Subtract from transactions database as a savings transfer expense
    handleAddTransaction({
      title: `Tiết kiệm: ${goals.find(g => g.id === goalId)?.name}`,
      amount: amount,
      type: 'expense',
      category: 'Bills', // or dedicated category transfer
      account: 'Cash',
      date: '2026-01-14',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      note: 'Transfer money to savings fund'
    });

    // Update goals current amount
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));
  };

  const handleResetData = () => {
    if (confirm('Bạn có đồng ý đặt lại toàn bộ dữ liệu mẫu ban đầu để giống ảnh chụp màn hình?')) {
      localStorage.removeItem('wallet_user');
      localStorage.removeItem('wallet_transactions');
      localStorage.removeItem('wallet_savings_goals');
      setUser(INITIAL_USER);
      setTransactions(INITIAL_TRANSACTIONS);
      setGoals(INITIAL_SAVINGS_GOALS);
      setCurrentTab('home');
      setShowHistory(false);
      setShowAddTransaction(false);
    }
  };

  // Safe baseline sums for calculations
  const currentBudgetBalance = 12450.25 + transactions.reduce((acc, current) => {
    return acc + (current.type === 'income' ? current.amount : -Math.abs(current.amount));
  }, 0) - (-120.50 - 45.00 - 18.75 - 85.20 - 5.40 + 3200.00 - 112.55 - 45.00);

  const formatCurrencyValue = (val: number) => {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  // Render correct inner panel based on tab navigation states
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            user={user}
            transactions={transactions}
            onOpenHistory={() => setShowHistory(true)}
            onOpenAddTransaction={() => setShowAddTransaction(true)}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        );
      case 'report':
        return (
          <ReportScreen
            user={user}
            transactions={transactions}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        );
      case 'plan':
        return (
          <PlanScreen
            user={user}
            goals={goals}
            onTopUp={handleTopUpSavings}
            onBackToHome={() => setCurrentTab('home')}
            availableBalance={currentBudgetBalance}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            user={user}
            onChangeUser={handleModifyUser}
            onLogout={() => {
              if (confirm('Xác nhận đăng xuất khỏi ví thông minh?')) {
                alert('Đã đăng xuất thành công!');
              }
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] relative overflow-hidden flex flex-col justify-between">
      {/* Dev Control Toolbar shown in desktop viewport layout */}
      {!isMobileView && (
        <div className="bg-purple-900 text-white py-2 px-6 flex justify-between items-center z-50 text-xs font-semibold shadow-inner border-b border-purple-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide text-purple-100">AI Real-time Finance Database Synchronized</span>
          </div>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md text-[10px] transition font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Dữ liệu Mẫu (Fidelity Sync)
          </button>
        </div>
      )}

      {/* Main Container frame parser */}
      <DeviceFrame isMobileView={isMobileView} setIsMobileView={setIsMobileView}>
        {/* If desktop expanded dashboard is on, we print an advanced beautiful dashboard layout.
            If is mobile view emulator is on, we print the single sleek device views */}
        {!isMobileView ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            {/* Left overview stats */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Card and general indicators */}
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt="User"
                    className="w-14 h-14 rounded-full border-2 border-purple-100 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 tracking-tight">{user.name}</h3>
                    <p className="text-xs text-slate-450 font-medium">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleResetData}
                  title="Reset Data"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-slate-500 hover:text-slate-800 border border-slate-100"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Instant balance board widget */}
              <div className="bg-gradient-to-tr from-[#8C3CFF] to-[#6c0be1] p-6 rounded-[28px] text-white shadow-lg shadow-purple-150">
                <h4 className="text-xs text-purple-200/80 uppercase font-bold tracking-wider mb-1">Your Total balance</h4>
                <p className="text-3xl font-extrabold tracking-tight">{formatCurrencyValue(currentBudgetBalance)}</p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-purple-150">
                  <span>Khả dụng tức thì</span>
                  <span className="text-white font-bold">100% Khớp</span>
                </div>
              </div>

              {/* Quick actions box */}
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Thao tác nhanh</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowAddTransaction(true)}
                    className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 border border-purple-150 rounded-2xl text-purple-700 tracking-tight transition cursor-pointer"
                  >
                    <Plus className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-extrabold">+ Giao dịch</span>
                  </button>
                  <button
                    onClick={() => { setCurrentTab('plan') }}
                    className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-2xl text-slate-700 tracking-tight transition cursor-pointer"
                  >
                    <Wallet className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-extrabold">Xem Kế hoạch</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right detailed financial widgets cards content */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Home widget screen replica */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-md h-[680px] overflow-hidden flex flex-col relative">
                <div className="bg-purple-50 px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-purple-700 text-center border-b border-purple-100/50">
                  Trực quan hóa: Màn hình chính
                </div>
                {React.createElement(HomeScreen, {
                  user,
                  transactions,
                  onOpenHistory: () => { setShowHistory(true); },
                  onOpenAddTransaction: () => { setShowAddTransaction(true); },
                  selectedMonth,
                  setSelectedMonth
                })}
              </div>

              {/* Financial reports replica */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-md h-[680px] overflow-hidden flex flex-col relative">
                <div className="bg-purple-50 px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-purple-700 text-center border-b border-purple-100/50">
                  Trực quan hóa: Phân tích & Báo cáo
                </div>
                {React.createElement(ReportScreen, {
                  user,
                  transactions,
                  selectedMonth,
                  setSelectedMonth
                })}
              </div>

              {/* Savings replicas */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-md h-[680px] overflow-hidden flex flex-col relative">
                <div className="bg-purple-50 px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-purple-700 text-center border-b border-purple-100/50">
                  Trực quan hóa: Quỹ Tiết Kiệm
                </div>
                {React.createElement(PlanScreen, {
                  user,
                  goals,
                  onTopUp: handleTopUpSavings,
                  onBackToHome: () => { setCurrentTab('home') },
                  availableBalance: currentBudgetBalance
                })}
              </div>

              {/* Settings Screen replicas */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-md h-[680px] overflow-hidden flex flex-col relative">
                <div className="bg-purple-50 px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-purple-700 text-center border-b border-purple-100/50">
                  Trực quan hóa: Cài Đặt
                </div>
                {React.createElement(SettingsScreen, {
                  user,
                  onChangeUser: handleModifyUser,
                  onLogout: () => { alert('Đã xảy ra đăng xuất!'); }
                })}
              </div>

            </div>
          </div>
        ) : (
          /* Mobile View rendering */
          <div className="flex-1 flex flex-col relative overflow-hidden h-full">
            {/* Header / Body viewport contents */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {renderTabContent()}

              {/* Full Screen slider/screens overlay */}
              {showHistory && (
                <HistoryScreen
                  user={user}
                  transactions={transactions}
                  onBack={() => setShowHistory(false)}
                  categories={CATEGORIES}
                />
              )}

              {showAddTransaction && (
                <AddTransactionScreen
                  user={user}
                  categories={CATEGORIES}
                  accounts={ACCOUNTS}
                  onSave={handleAddTransaction}
                  onClose={() => setShowAddTransaction(false)}
                />
              )}
            </div>

            {/* Custom Bottom Tab Bar with Curved Center Cutout */}
            <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-100/80 z-20 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.08)]">
              {/* Cutout behind Floating Plus button using native relative overlay */}
              <div className="flex justify-between items-center h-20 px-4 relative">
                
                {/* Home tab button */}
                <button
                  onClick={() => { setCurrentTab('home'); setShowHistory(false); }}
                  className={`flex-1 flex flex-col items-center justify-center h-full transition duration-200 cursor-pointer ${currentTab === 'home' && !showHistory ? 'text-purple-600 scale-102 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Home className="w-5.5 h-5.5 mb-1" />
                  <span className="text-[10px] tracking-tight font-medium">Home</span>
                </button>

                {/* Report tab button */}
                <button
                  onClick={() => { setCurrentTab('report'); setShowHistory(false); }}
                  className={`flex-1 flex flex-col items-center justify-center h-full transition duration-200 cursor-pointer ${currentTab === 'report' && !showHistory ? 'text-purple-600 scale-102 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <BarChart3 className="w-5.5 h-5.5 mb-1" />
                  <span className="text-[10px] tracking-tight font-medium">Report</span>
                </button>

                {/* Rounded middle floating Plus button placeholder */}
                <div className="flex-1 flex justify-center -mt-8 relative z-30 select-none">
                  <button
                    onClick={() => setShowAddTransaction(true)}
                    className="w-14 h-14 bg-gradient-to-tr from-[#9c58ff] to-[#7F26FD] hover:from-[#812ff5] hover:to-[#610ecf] text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-300 transform active:scale-95 transition-all duration-200 cursor-pointer"
                    aria-label="Add custom transaction"
                  >
                    <Plus className="w-7 h-7 text-white stroke-[2.5]" />
                  </button>
                </div>

                {/* Plan tab button */}
                <button
                  onClick={() => { setCurrentTab('plan'); setShowHistory(false); }}
                  className={`flex-1 flex flex-col items-center justify-center h-full transition duration-200 cursor-pointer ${currentTab === 'plan' && !showHistory ? 'text-purple-600 scale-102 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Wallet className="w-5.5 h-5.5 mb-1" />
                  <span className="text-[10px] tracking-tight font-medium">Plan</span>
                </button>

                {/* Settings tab button */}
                <button
                  onClick={() => { setCurrentTab('settings'); setShowHistory(false); }}
                  className={`flex-1 flex flex-col items-center justify-center h-full transition duration-200 cursor-pointer ${currentTab === 'settings' && !showHistory ? 'text-purple-600 scale-102 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <SettingsIcon className="w-5.5 h-5.5 mb-1" />
                  <span className="text-[10px] tracking-tight font-medium">Settings</span>
                </button>

              </div>
            </div>
          </div>
        )}
      </DeviceFrame>
    </div>
  );
}
