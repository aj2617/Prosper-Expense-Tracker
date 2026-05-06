import { createFileRoute } from "@tanstack/react-router";
import { DEMO_BUDGETS, DEMO_TRANSACTIONS, CATEGORIES, formatCurrency } from "@/lib/demo-data";
import { format } from "date-fns";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/budgets")({
  component: BudgetsPage,
});

function BudgetsPage() {
  const currentMonth = format(new Date(), "yyyy-MM");
  const [budgets, setBudgets] = useState(DEMO_BUDGETS);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState("");

  const categoryExpenses = DEMO_TRANSACTIONS
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpenses = Object.values(categoryExpenses).reduce((a, b) => a + b, 0);

  const startEdit = (id: string, amount: number) => {
    setEditingBudgetId(id);
    setEditingAmount(String(amount));
  };

  const cancelEdit = () => {
    setEditingBudgetId(null);
    setEditingAmount("");
  };

  const saveEdit = (id: string) => {
    const nextAmount = Number(editingAmount);
    if (Number.isNaN(nextAmount) || nextAmount < 0) return;

    setBudgets((prev) => prev.map((item) => (item.id === id ? { ...item, amount: nextAmount } : item)));
    cancelEdit();
  };

  const deleteBudget = (id: string, name: string) => {
    const ok = window.confirm(`Delete budget for ${name}?`);
    if (!ok) return;

    setBudgets((prev) => prev.filter((item) => item.id !== id));
    if (editingBudgetId === id) cancelEdit();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Budgets</h1>
          <p className="mt-1 text-sm text-muted-foreground">Set spending limits for your categories</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Budget
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((b) => {
          const spent = b.categoryId === "all" ? totalExpenses : categoryExpenses[b.categoryId] || 0;
          const pct = b.amount > 0 ? Math.min((spent / b.amount) * 100, 100) : 0;
          const exceeded = spent > b.amount;
          const cat = CATEGORIES[b.categoryId];
          const name = b.categoryId === "all" ? "Overall" : cat?.name || b.categoryId;
          const icon = b.categoryId === "all" ? "Overall" : cat?.icon || "Other";
          const isEditing = editingBudgetId === b.id;

          return (
            <div key={b.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-card-foreground">{name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{b.period}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(b.id, b.amount)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label={`Edit ${name} budget`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBudget(b.id, name)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-destructive"
                    aria-label={`Delete ${name} budget`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">Budget amount (USD)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingAmount}
                      onChange={(e) => setEditingAmount(e.target.value)}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(b.id)}
                      className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-baseline justify-between">
                <span className={`text-lg font-extrabold ${exceeded ? "text-destructive" : "text-card-foreground"}`}>
                  {formatCurrency(spent)}
                </span>
                <span className="text-sm text-muted-foreground">/ {formatCurrency(b.amount)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${exceeded ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs font-medium text-muted-foreground">
                {Math.round(pct)}% used - {formatCurrency(Math.max(b.amount - spent, 0))} remaining
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
