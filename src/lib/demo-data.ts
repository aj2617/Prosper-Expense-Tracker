export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  type: "expense" | "income";
  date: string;
  paymentMethod: string;
  notes: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  period: "monthly" | "weekly";
  amount: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  categoryId: string;
  type: "expense" | "income";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextDate: string;
  paymentMethod: string;
  notes: string;
}

export const CATEGORIES: Record<string, { name: string; color: string; icon: string }> = {
  food: { name: "Food & Dining", color: "#10b981", icon: "🍽️" },
  transport: { name: "Transport", color: "#3b82f6", icon: "🚗" },
  bills: { name: "Bills & Utilities", color: "#f59e0b", icon: "📄" },
  shopping: { name: "Shopping", color: "#ec4899", icon: "🛍️" },
  health: { name: "Health", color: "#ef4444", icon: "💊" },
  entertainment: { name: "Entertainment", color: "#8b5cf6", icon: "🎬" },
  salary: { name: "Salary", color: "#10b981", icon: "💰" },
  freelance: { name: "Freelance", color: "#06b6d4", icon: "💻" },
  other: { name: "Other", color: "#6b7280", icon: "📌" },
};

export const DEFAULT_TRANSACTIONS: Transaction[] = [];
export const DEFAULT_BUDGETS: Budget[] = [];
export const DEFAULT_SAVINGS: SavingsGoal[] = [];
export const DEFAULT_RECURRING: RecurringTransaction[] = [];

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
}
