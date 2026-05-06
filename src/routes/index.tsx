import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CATEGORIES,
  DEFAULT_BUDGETS,
  DEFAULT_SAVINGS,
  formatCurrency,
} from "@/lib/demo-data";
import { useTransactions } from "@/hooks/useTransactions";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  children,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-3.5 shadow-sm sm:rounded-2xl sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[11px]">
            {title}
          </p>
          <h3 className="mt-1 text-lg font-extrabold tracking-tight text-card-foreground sm:mt-2 sm:text-2xl">
            {value}
          </h3>
        </div>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${iconBg}`}>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
        </div>
      </div>
      {children}
    </div>
  );
}

function DashboardPage() {
  const { transactions } = useTransactions();
  const [budgets] = useLocalStorageState("prosper.budgets.v1", DEFAULT_BUDGETS);
  const [goals] = useLocalStorageState("prosper.savings.v1", DEFAULT_SAVINGS);
  const currentMonth = format(new Date(), "yyyy-MM");

  const expenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);

  const income = transactions
    .filter((t) => t.type === "income" && t.date.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);

  const balance = income - expenses;
  const totalBudget = budgets.find((b) => b.categoryId === "all")?.amount || 0;

  const categoryExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const budgetAlerts = budgets.filter((b) => b.period === "monthly")
    .map((b) => {
      const spent = b.categoryId === "all" ? expenses : categoryExpenses[b.categoryId] || 0;
      const name = b.categoryId === "all" ? "Overall" : CATEGORIES[b.categoryId]?.name || b.categoryId;
      if (!b.amount || spent === 0) return null;
      const pct = (spent / b.amount) * 100;
      if (pct > 100) return { type: "exceeded" as const, name, pct, spent, limit: b.amount };
      if (pct >= 80) return { type: "nearing" as const, name, pct, spent, limit: b.amount };
      return null;
    })
    .filter(Boolean);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#06b6d4"];

  const pieData = Object.entries(categoryExpenses)
    .map(([id, value], i) => ({
      name: CATEGORIES[id]?.name || id,
      value: value as number,
      color: COLORS[i % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  const barData = [
    { name: "Income", amount: income, fill: "#10b981" },
    { name: "Expenses", amount: expenses, fill: "#ef4444" },
  ];

  return (
    <div className="animate-fade-in space-y-4 sm:space-y-6">
      {/* Greeting — compact on mobile */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
          {format(new Date(), "MMMM yyyy")}
        </p>
      </div>

      {/* Budget alerts — compact */}
      {budgetAlerts.length > 0 && (
        <div className="space-y-2">
          {budgetAlerts.map((alert: any, i: number) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 sm:gap-3 sm:rounded-xl sm:p-4 ${
                alert.type === "exceeded"
                  ? "border-destructive/20 bg-destructive/5 text-destructive"
                  : "border-warning/30 bg-warning/10 text-warning-foreground"
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold sm:text-sm">
                  {alert.type === "exceeded" ? `${alert.name} exceeded!` : `${alert.name} nearing limit`}
                </p>
                <p className="text-[10px] opacity-80 sm:text-xs">
                  {formatCurrency(alert.spent)} / {formatCurrency(alert.limit)} ({Math.round(alert.pct)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stat cards — 2-col tight grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Balance" value={formatCurrency(balance)} icon={Wallet} iconBg="bg-accent" iconColor="text-primary" />
        <StatCard title="Expenses" value={formatCurrency(expenses)} icon={ArrowDownRight} iconBg="bg-destructive/10" iconColor="text-destructive">
          {totalBudget > 0 && (
            <div className="mt-2.5 border-t pt-2 sm:mt-4 sm:pt-3">
              <div className="flex justify-between text-[9px] font-medium text-muted-foreground sm:text-[10px]">
                <span>{Math.round((expenses / totalBudget) * 100)}%</span>
                <span>{formatCurrency(totalBudget)}</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted sm:mt-1.5 sm:h-1.5">
                <div
                  className={`h-full rounded-full transition-all ${expenses > totalBudget ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${Math.min((expenses / totalBudget) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </StatCard>
        <StatCard title="Income" value={formatCurrency(income)} icon={ArrowUpRight} iconBg="bg-accent" iconColor="text-primary" />
        <StatCard title="Goals" value={String(goals.length)} icon={TrendingUp} iconBg="bg-warning/10" iconColor="text-warning-foreground" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-3.5 shadow-sm sm:rounded-2xl sm:p-5 lg:col-span-2">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[11px]">
            Income vs Expenses
          </h3>
          <div className="mt-3 h-[180px] sm:mt-4 sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} />
                <YAxis axisLine={false} tickLine={false} fontSize={10} tickFormatter={(v) => `$${v}`} width={45} />
                <Tooltip formatter={(v: any) => [formatCurrency(v), "Amount"]} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-3.5 shadow-sm sm:rounded-2xl sm:p-5">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[11px]">
            By Category
          </h3>
          <div className="mt-3 h-[160px] sm:mt-4 sm:h-[200px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No expenses yet
              </div>
            )}
          </div>
          <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-semibold text-card-foreground">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="rounded-xl border bg-card shadow-sm sm:rounded-2xl">
        <div className="border-b px-3.5 py-3 sm:px-5 sm:py-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[11px]">
            Recent Transactions
          </h3>
        </div>
        <div className="divide-y">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center justify-between px-3.5 py-2.5 sm:px-5 sm:py-3.5">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="text-base sm:text-lg">{CATEGORIES[t.categoryId]?.icon || "📌"}</span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-card-foreground sm:text-sm">{t.notes || "—"}</p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs">{t.date}</p>
                </div>
              </div>
              <span className={`shrink-0 text-xs font-bold sm:text-sm ${t.type === "income" ? "text-income" : "text-expense"}`}>
                {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
