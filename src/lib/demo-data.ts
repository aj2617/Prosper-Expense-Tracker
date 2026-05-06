import { format, subDays } from "date-fns";

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

const today = new Date();

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: "1", amount: 4500, categoryId: "salary", type: "income", date: format(subDays(today, 1), "yyyy-MM-dd"), paymentMethod: "Bank Transfer", notes: "Monthly salary" },
  { id: "2", amount: 1200, categoryId: "freelance", type: "income", date: format(subDays(today, 3), "yyyy-MM-dd"), paymentMethod: "PayPal", notes: "Web design project" },
  { id: "3", amount: 85.50, categoryId: "food", type: "expense", date: format(subDays(today, 1), "yyyy-MM-dd"), paymentMethod: "Credit Card", notes: "Grocery shopping" },
  { id: "4", amount: 45, categoryId: "transport", type: "expense", date: format(subDays(today, 2), "yyyy-MM-dd"), paymentMethod: "Cash", notes: "Gas station" },
  { id: "5", amount: 120, categoryId: "bills", type: "expense", date: format(subDays(today, 3), "yyyy-MM-dd"), paymentMethod: "Auto-pay", notes: "Electric bill" },
  { id: "6", amount: 250, categoryId: "shopping", type: "expense", date: format(subDays(today, 4), "yyyy-MM-dd"), paymentMethod: "Credit Card", notes: "New headphones" },
  { id: "7", amount: 35, categoryId: "entertainment", type: "expense", date: format(subDays(today, 5), "yyyy-MM-dd"), paymentMethod: "Credit Card", notes: "Movie tickets" },
  { id: "8", amount: 60, categoryId: "health", type: "expense", date: format(subDays(today, 6), "yyyy-MM-dd"), paymentMethod: "Insurance", notes: "Pharmacy" },
  { id: "9", amount: 42, categoryId: "food", type: "expense", date: format(subDays(today, 7), "yyyy-MM-dd"), paymentMethod: "Credit Card", notes: "Restaurant dinner" },
  { id: "10", amount: 800, categoryId: "freelance", type: "income", date: format(subDays(today, 8), "yyyy-MM-dd"), paymentMethod: "PayPal", notes: "Logo design" },
  { id: "11", amount: 15, categoryId: "entertainment", type: "expense", date: format(subDays(today, 9), "yyyy-MM-dd"), paymentMethod: "Credit Card", notes: "Spotify subscription" },
  { id: "12", amount: 200, categoryId: "bills", type: "expense", date: format(subDays(today, 10), "yyyy-MM-dd"), paymentMethod: "Auto-pay", notes: "Internet + phone" },
];

export const DEMO_BUDGETS: Budget[] = [
  { id: "1", categoryId: "all", period: "monthly", amount: 3000 },
  { id: "2", categoryId: "food", period: "monthly", amount: 500 },
  { id: "3", categoryId: "transport", period: "monthly", amount: 200 },
  { id: "4", categoryId: "entertainment", period: "monthly", amount: 150 },
  { id: "5", categoryId: "shopping", period: "monthly", amount: 300 },
];

export const DEMO_SAVINGS: SavingsGoal[] = [
  { id: "1", name: "Emergency Fund", targetAmount: 10000, currentAmount: 6500, deadline: "2026-12-31" },
  { id: "2", name: "Vacation Trip", targetAmount: 3000, currentAmount: 1800, deadline: "2026-08-15" },
  { id: "3", name: "New Laptop", targetAmount: 2000, currentAmount: 450, deadline: "2026-10-01" },
];

export const DEMO_RECURRING: RecurringTransaction[] = [
  { id: "1", amount: 4500, categoryId: "salary", type: "income", frequency: "monthly", nextDate: "2026-06-01", paymentMethod: "Bank Transfer", notes: "Monthly salary" },
  { id: "2", amount: 120, categoryId: "bills", type: "expense", frequency: "monthly", nextDate: "2026-06-05", paymentMethod: "Auto-pay", notes: "Electric bill" },
  { id: "3", amount: 15, categoryId: "entertainment", type: "expense", frequency: "monthly", nextDate: "2026-06-10", paymentMethod: "Credit Card", notes: "Spotify" },
  { id: "4", amount: 50, categoryId: "bills", type: "expense", frequency: "monthly", nextDate: "2026-06-15", paymentMethod: "Auto-pay", notes: "Phone plan" },
];

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
}
