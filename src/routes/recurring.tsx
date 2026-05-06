import { createFileRoute } from "@tanstack/react-router";
import { DEMO_RECURRING, CATEGORIES, formatCurrency } from "@/lib/demo-data";
import { Plus, Repeat } from "lucide-react";

export const Route = createFileRoute("/recurring")({
  component: RecurringPage,
});

function RecurringPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Repetitive</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your repetitive income and expenses</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Repetitive
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_RECURRING.map((r) => {
          const cat = CATEGORIES[r.categoryId];
          return (
            <div key={r.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat?.icon || "📌"}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-card-foreground">{r.notes}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{r.frequency} · {r.paymentMethod}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className={`text-lg font-extrabold ${r.type === "income" ? "text-income" : "text-expense"}`}>
                  {r.type === "income" ? "+" : "−"}{formatCurrency(r.amount)}
                </span>
                <span className="text-xs text-muted-foreground">Next: {r.nextDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
