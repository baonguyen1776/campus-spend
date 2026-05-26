export interface Transaction {
  id: string;
  title: string;
  amount: number; // positive for income, negative for expense
  type: 'income' | 'expense';
  category: string;
  account: string;
  date: string; // ISO format or localized string
  time?: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string; // emoji or identifier
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  currency: string; // '$', '₫', '€', etc.
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
}
