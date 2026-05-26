import React from 'react';
import { UserProfile } from '../types';
import { User, Lock, Bell, Sun, DollarSign, HelpCircle, Mail, ChevronRight, Check } from 'lucide-react';

interface SettingsScreenProps {
  user: UserProfile;
  onChangeUser: (updated: UserProfile) => void;
  onLogout: () => void;
}

export default function SettingsScreen({ user, onChangeUser, onLogout }: SettingsScreenProps) {
  const [activeTabSetting, setActiveTabSetting] = React.useState<string | null>(null);
  const [editedName, setEditedName] = React.useState(user.name);
  const [editedEmail, setEditedEmail] = React.useState(user.email);
  const [selectedCurrency, setSelectedCurrency] = React.useState(user.currency);
  const [savedMessage, setSavedMessage] = React.useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeUser({
      ...user,
      name: editedName,
      email: editedEmail,
      currency: selectedCurrency,
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      setActiveTabSetting(null);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24" id="settings-screen-viewport">
      {/* Royal purple background with avatar */}
      <div className="bg-gradient-to-b from-[#8C3CFF] via-[#7F26FD] to-[#6c0be1] pt-12 pb-20 px-6 text-white text-center relative select-none">
        <span className="text-base font-bold absolute top-12 left-1/2 -translate-x-1/2">Settings</span>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <img
              src={user.avatar}
              alt="Settings Avatar"
              className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
              <span className="text-[10px] font-bold text-white uppercase">Sửa</span>
            </div>
          </div>
          <h2 className="text-lg font-bold mt-3.5 tracking-tight">{user.name}</h2>
          <p className="text-[11px] text-purple-200/80 mt-0.5 tracking-wide font-medium">{user.email}</p>
        </div>
      </div>

      {/* Main categories groups list */}
      <div className="bg-white rounded-t-[32px] px-5 pt-6 flex-1 -mt-10 z-10 shadow-lg border-t border-slate-50">
        
        {/* Account group */}
        <div className="mb-5">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1 select-none">Account</h3>
          <div className="space-y-3">
            <button
              onClick={() => setActiveTabSetting('personal')}
              className="w-full flex justify-between items-center p-3.5 bg-white border border-slate-50 rounded-2xl hover:bg-slate-50 transition duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Personal Info</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350" />
            </button>

            <button
              onClick={() => alert('Chi tiết Bảo mật đang được mã hóa riêng tư đầu-cuối!')}
              className="w-full flex justify-between items-center p-3.5 bg-white border border-slate-50 rounded-2xl hover:bg-slate-50 transition duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Security</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350" />
            </button>
          </div>
        </div>

        {/* Preferences group */}
        <div className="mb-5">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1 select-none">Preferences</h3>
          <div className="space-y-3">
            <button
              onClick={() => alert('Thông báo đang bật ở chế độ định vị thông minh!')}
              className="w-full flex justify-between items-center p-3.5 bg-white border border-slate-50 rounded-2xl hover:bg-slate-50 transition duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Notifications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350" />
            </button>

            <button
              onClick={() => alert('Đã tối ưu hóa giao diện dựa trên định dạng của bạn!')}
              className="w-full flex justify-between items-center p-3.5 bg-white border border-slate-50 rounded-2xl hover:bg-slate-50 transition duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Theme</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350" />
            </button>

            <button
              onClick={() => setActiveTabSetting('currency')}
              className="w-full flex justify-between items-center p-3.5 bg-white border border-slate-50 rounded-2xl hover:bg-slate-50 transition duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Currency</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350" />
            </button>
          </div>
        </div>

        {/* Support Group */}
        <div className="mb-6.5">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1 select-none">Support</h3>
          <div className="space-y-3">
            <button
              onClick={() => alert('Để được trợ giúp, vui lòng liên hệ email: baogiaphuongnguyen1234@gmail.com')}
              className="w-full flex justify-between items-center p-3.5 bg-white border border-slate-50 rounded-2xl hover:bg-slate-50 transition duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Help Center</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350" />
            </button>

            <button
              onClick={() => alert('Hòm thư hỗ trợ: alex.johnson@email.com')}
              className="w-full flex justify-between items-center p-3.5 bg-white border border-slate-50 rounded-2xl hover:bg-slate-50 transition duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Contact Us</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350" />
            </button>
          </div>
        </div>

        {/* Logout button representation */}
        <button
          onClick={onLogout}
          className="w-full bg-slate-50 active:bg-slate-100/80 border border-slate-100 py-3.5 rounded-2xl text-xs font-bold text-rose-500 hover:text-rose-600 transition tracking-wide cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Edit Personal Info Drawer Modal */}
      {activeTabSetting === 'personal' && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[385px] rounded-t-[32px] p-6 shadow-2xl border-t border-slate-100 transition pb-10">
            {savedMessage ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Thông tin cá nhân đã lưu!</h4>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chỉnh sửa thông tin</h4>
                  <button
                    type="button"
                    onClick={() => setActiveTabSetting(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
                  >
                    Hủy
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ms-1">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-150 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ms-1">Địa chỉ Email</label>
                  <input
                    type="email"
                    required
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-150 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-xs rounded-xl transition duration-200"
                >
                  Lưu thay đổi
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Currency choices */}
      {activeTabSetting === 'currency' && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[385px] rounded-t-[32px] p-6 shadow-2xl border-t border-slate-100 transition pb-8">
            <div className="flex justify-between items-center mb-4 text-slate-400">
              <h4 className="text-xs font-bold uppercase tracking-wider">Chọn đơn vị tiền tệ</h4>
              <button
                onClick={() => setActiveTabSetting(null)}
                className="text-xs font-bold hover:text-slate-600 transition"
              >
                Hủy
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3.5 mb-5">
              {[
                { symbol: '$', label: 'USD - Dollar' },
                { symbol: '₫', label: 'VND - Đồng' },
                { symbol: '€', label: 'EUR - Euro' },
                { symbol: '£', label: 'GBP - Pound' },
                { symbol: '¥', label: 'JPY - Yen' },
                { symbol: '₩', label: 'KRW - Won' }
              ].map((cur) => (
                <button
                  key={cur.symbol}
                  onClick={() => {
                    setSelectedCurrency(cur.symbol);
                    onChangeUser({ ...user, currency: cur.symbol });
                    setActiveTabSetting(null);
                  }}
                  className={`border p-3.5 rounded-xl text-center transition flex flex-col items-center justify-center cursor-pointer ${user.currency === cur.symbol ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' : 'border-slate-100 hover:bg-slate-50 text-slate-700'}`}
                >
                  <span className="text-base font-bold font-sans">{cur.symbol}</span>
                  <span className="text-[8px] text-slate-450 mt-1 uppercase font-semibold">{cur.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
