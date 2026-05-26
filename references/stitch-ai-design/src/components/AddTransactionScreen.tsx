import React from 'react';
import { Transaction, UserProfile } from '../types';
import { X, Tag, CreditCard, Calendar, FileText, Check, ChevronRight } from 'lucide-react';

interface AddTransactionScreenProps {
  user: UserProfile;
  categories: string[];
  accounts: string[];
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export default function AddTransactionScreen({
  user,
  categories,
  accounts,
  onSave,
  onClose
}: AddTransactionScreenProps) {
  const [amount, setAmount] = React.useState('150.00');
  const [type, setType] = React.useState<'expense' | 'income'>('expense');
  const [category, setCategory] = React.useState('Category');
  const [account, setAccount] = React.useState('Account');
  const [date, setDate] = React.useState('Today');
  const [note, setNote] = React.useState('');

  const [activePicker, setActivePicker] = React.useState<'category' | 'account' | 'date' | 'note' | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ lớn hơn 0!');
      return;
    }

    if (category === 'Category') {
      alert('Vui lòng chọn Danh mục!');
      return;
    }

    if (account === 'Account') {
      alert('Vui lòng chọn Tài khoản thanh toán!');
      return;
    }

    // Map special local Date string
    let finalDate = '2026-01-14'; // default Today simulation anchor
    if (date === 'Yesterday') finalDate = '2026-01-13';

    // Get current formatted localized time
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    onSave({
      title: note ? note : `Giao dịch ${category}`,
      amount: numericAmount,
      type,
      category,
      account,
      date: finalDate,
      time: timeStr,
      note: note || undefined,
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col px-6 pt-10 overflow-y-auto no-scrollbar pb-10" id="add-transaction-screen">
      {/* Header controls layout mapping image 6 */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={onClose}
          type="button"
          className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer"
          aria-label="Close transaction creator"
        >
          <X className="w-6 h-6 text-slate-800" />
        </button>
        <span className="text-[15px] font-bold text-slate-900 select-none">Add Transaction</span>
        <div className="w-6 h-6" /> {/* Spacer */}
      </div>

      {showSuccess ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
            <Check className="w-8 h-8 text-emerald-600 animate-bounce" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Giao dịch đã được lưu!</h3>
          <p className="text-xs text-slate-400 mt-2">Dữ liệu tài chính đã cập nhật biểu đồ trực tuyến.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div>
            {/* BIG Purple Currency Value Typing Display matching screen 6 */}
            <div className="text-center mb-8">
              <div className="relative inline-block selection:bg-purple-100">
                <span className="text-[44px] font-extrabold text-[#8C3CFF] font-sans tracking-tight">
                  {user.currency}
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="bg-transparent border-none text-[#8C3CFF] focus:outline-hidden font-extrabold inline-block text-[44px] tracking-tight max-w-[200px]"
                    style={{ width: `${(amount.length || 1) * 26 + 10}px` }}
                    placeholder="0.00"
                    autoFocus
                  />
                  <span className="text-xl font-light text-slate-300">|</span>
                </span>
              </div>
            </div>

            {/* Income / Expense Toggle Segment layout style */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 max-w-[150px] py-3.5 rounded-full text-xs font-bold transition duration-300 border cursor-pointer ${type === 'expense' ? 'bg-[#8C3CFF] text-white border-[#8C3CFF] shadow-md shadow-purple-50' : 'bg-white text-[#8C3CFF] border-[#8C3CFF] hover:bg-purple-50'}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 max-w-[150px] py-3.5 rounded-full text-xs font-bold transition duration-300 border cursor-pointer ${type === 'income' ? 'bg-[#8C3CFF] text-white border-[#8C3CFF] shadow-md shadow-purple-50' : 'bg-white text-[#8C3CFF] border-[#8C3CFF] hover:bg-purple-50'}`}
              >
                Income
              </button>
            </div>

            {/* Dynamic Inputs boxes layout matching screen 6 */}
            <div className="space-y-3.5">
              
              {/* Category input box selector */}
              <button
                type="button"
                onClick={() => setActivePicker('category')}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-900 rounded-2xl hover:bg-slate-50 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-[#8C3CFF]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">{category}</span>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </button>

              {/* Account input box selector */}
              <button
                type="button"
                onClick={() => setActivePicker('account')}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-900 rounded-2xl hover:bg-slate-50 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-[#8C3CFF]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">{account}</span>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </button>

              {/* Date input box selector */}
              <button
                type="button"
                onClick={() => setActivePicker('date')}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-900 rounded-2xl hover:bg-slate-50 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#8C3CFF]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">{date}</span>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </button>

              {/* Note input block area */}
              <button
                type="button"
                onClick={() => setActivePicker('note')}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-900 rounded-2xl hover:bg-slate-50 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#8C3CFF]" />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    {note ? (
                      <span className="text-xs font-bold text-slate-800 truncate block">{note}</span>
                    ) : (
                      <span className="text-xs font-bold text-slate-800">Note</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </button>

            </div>
          </div>

          {/* Large bottom submission operation matching screen 6 */}
          <button
            type="submit"
            className="w-full bg-[#8C3CFF] hover:bg-[#7824ee] text-white font-bold py-4 rounded-3xl text-[13px] tracking-wide mt-10 transition duration-200 shadow-lg shadow-purple-100 cursor-pointer"
          >
            Save Transaction
          </button>
        </form>
      )}

      {/* Slide popover filters for selecting category */}
      {activePicker === 'category' && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-end justify-center animate-fadeIn">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl border-t max-h-[380px] overflow-y-auto pb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Chọn danh mục chi tiêu:</span>
              <button onClick={() => setActivePicker(null)} className="text-xs font-bold text-purple-600">Đóng</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategory(cat); setActivePicker(null); }}
                  className={`p-3.5 border rounded-xl text-xs font-bold text-left transition ${category === cat ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 hover:bg-slate-50 text-slate-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slide popover filters for selecting bank accounts */}
      {activePicker === 'account' && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-end justify-center animate-fadeIn">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl border-t max-h-[350px] overflow-y-auto pb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Chọn thẻ/tài khoản nguồn:</span>
              <button onClick={() => setActivePicker(null)} className="text-xs font-bold text-purple-600">Đóng</button>
            </div>
            <div className="space-y-2">
              {accounts.map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => { setAccount(acc); setActivePicker(null); }}
                  className={`w-full p-4 border rounded-xl text-xs font-bold text-left transition flex justify-between items-center ${account === acc ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>{acc}</span>
                  {account === acc && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slide popover filters for dates */}
      {activePicker === 'date' && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-end justify-center animate-fadeIn">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl border-t pb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Chọn ngày thực hiện:</span>
              <button onClick={() => setActivePicker(null)} className="text-xs font-bold text-purple-600">Đóng</button>
            </div>
            <div className="space-y-2">
              {['Today', 'Yesterday'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setDate(d); setActivePicker(null); }}
                  className={`w-full p-4 border rounded-xl text-xs font-bold text-left transition flex justify-between items-center ${date === d ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>{d}</span>
                  {date === d && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slide popover filters for writing notes */}
      {activePicker === 'note' && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-end justify-center animate-fadeIn">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl border-t pb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Nhập ghi chú giao dịch:</span>
              <button onClick={() => setActivePicker(null)} className="text-xs font-bold text-purple-600">Lưu</button>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-purple-500 h-24"
              placeholder="e.g., Mua sắm đồ dùng gia đình, thanh toán hóa đơn tối..."
            />
          </div>
        </div>
      )}

    </div>
  );
}
