import { Transaction, SavingsGoal, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  currency: '$',
};

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 5000,
    icon: '☔',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'goal-2',
    name: 'New Car',
    targetAmount: 15000,
    currentAmount: 3000,
    icon: '🚗',
    color: 'from-cyan-500 to-teal-505',
  },
  {
    id: 'goal-3',
    name: 'Vacation',
    targetAmount: 20000,
    currentAmount: 17000,
    icon: '🌴',
    color: 'from-emerald-500 to-green-500',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Lunch at Bistro',
    amount: -45.00,
    type: 'expense',
    category: 'Food & Dining',
    account: 'Red Card',
    date: '2026-01-12',
    time: '12:30 PM',
    note: 'Business lunch',
  },
  {
    id: 'tx-2',
    title: 'Amazon Order',
    amount: -120.50,
    type: 'expense',
    category: 'Shopping',
    account: 'Amazon Card',
    date: '2026-01-12',
    time: '02:15 PM',
    note: 'Smart home plug',
  },
  {
    id: 'tx-3',
    title: 'Uber Ride',
    amount: -18.75,
    type: 'expense',
    category: 'Transport',
    account: 'Corporate Card',
    date: '2026-01-12',
    time: '04:45 PM',
    note: 'Trip to office',
  },
  {
    id: 'tx-4',
    title: 'Amazon',
    amount: -85.20,
    type: 'expense',
    category: 'Shopping',
    account: 'Credit Card',
    date: '2026-01-13',
    time: '10:45 AM',
  },
  {
    id: 'tx-5',
    title: 'Starbucks',
    amount: -5.40,
    type: 'expense',
    category: 'Food & Dining',
    account: 'Debit Card',
    date: '2026-01-13',
    time: '08:30 AM',
  },
  {
    id: 'tx-6',
    title: 'Salary Deposit',
    amount: 3200.00,
    type: 'income',
    category: 'Salary',
    account: 'Checkings Bank',
    date: '2026-01-13',
    time: '05:00 AM',
  },
  {
    id: 'tx-7',
    title: 'Whole Foods',
    amount: -112.55,
    type: 'expense',
    category: 'Food & Dining',
    account: 'Visa Gold',
    date: '2026-01-14',
    time: '06:15 PM',
  },
  {
    id: 'tx-8',
    title: 'Chevron',
    amount: -45.00,
    type: 'expense',
    category: 'Transport',
    account: 'Fuel Card',
    date: '2026-01-14',
    time: '07:50 AM',
  },
];

export const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transport',
  'Bills',
  'Others',
  'Salary',
  'Investment'
];

export const ACCOUNTS = [
  'Red Card',
  'Amazon Card',
  'Corporate Card',
  'Checkings Bank',
  'Visa Gold',
  'Fuel Card',
  'Cash'
];
