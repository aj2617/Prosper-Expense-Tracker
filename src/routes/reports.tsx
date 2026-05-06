import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
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
  LineChart,
  Line,
} from "recharts";
import { CATEGORIES, formatCurrency } from "@/lib/demo-data";
import { useTransactions } from "@/hooks/useTransactions";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { transactions } = useTransactions();
  const currentMonth = format(new Date(), "yyyy-MM");

  const categoryExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#06b6d4"];

  const pieData = Object.entries(categoryExpenses)
    .map(([id, value], i) => ({
      name: CATEGORIES[id]?.name || id,
      value,
      color: COLORS[i % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  const totalExpense = pieData.reduce((s, d) => s + d.value, 0);

  // Daily spending trend
  const dailyData = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      const day = t.date.slice(8, 10);
      acc[day] = (acc[day] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const trendData = Object.entries(dailyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, amount]) => ({ day: `Day ${parseInt(day)}`, amount }));

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Detailed financial insights for {format(new Date(), "MMMM yyyy")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Expense Breakdown
          </h3>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {totalExpense > 0 ? Math.round((entry.value / totalExpense) * 100) : 0}%
                  </span>
                  <span className="font-semibold text-card-foreground">{formatCurrency(entry.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Daily Spending Trend
          </h3>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={11} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: any) => [formatCurrency(v), "Spent"]} />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top spending categories */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Top Categories by Spend
        </h3>
        <div className="mt-4 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pieData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" axisLine={false} tickLine={false} fontSize={11} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={11} width={120} />
              <Tooltip formatter={(v: any) => [formatCurrency(v), "Spent"]} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
