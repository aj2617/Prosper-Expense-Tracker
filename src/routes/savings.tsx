import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_SAVINGS, formatCurrency, type SavingsGoal } from "@/lib/demo-data";
import { Pencil, Plus, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

export const Route = createFileRoute("/savings")({
  component: SavingsPage,
});

function SavingsPage() {
  const [goals, setGoals] = useLocalStorageState<SavingsGoal[]>("prosper.savings.v1", DEFAULT_SAVINGS);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingTargetAmount, setEditingTargetAmount] = useState("");
  const [editingCurrentAmount, setEditingCurrentAmount] = useState("");
  const [editingDeadline, setEditingDeadline] = useState("");

  const startEdit = (goal: SavingsGoal) => {
    setEditingGoalId(goal.id);
    setEditingName(goal.name);
    setEditingTargetAmount(String(goal.targetAmount));
    setEditingCurrentAmount(String(goal.currentAmount));
    setEditingDeadline(goal.deadline);
  };

  const cancelEdit = () => {
    setEditingGoalId(null);
    setEditingName("");
    setEditingTargetAmount("");
    setEditingCurrentAmount("");
    setEditingDeadline("");
  };

  const saveEdit = (id: string) => {
    const nextTargetAmount = Number(editingTargetAmount);
    const nextCurrentAmount = Number(editingCurrentAmount);

    if (!editingName.trim()) return;
    if (Number.isNaN(nextTargetAmount) || nextTargetAmount < 0) return;
    if (Number.isNaN(nextCurrentAmount) || nextCurrentAmount < 0) return;
    if (!editingDeadline.trim()) return;

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              name: editingName.trim(),
              targetAmount: nextTargetAmount,
              currentAmount: nextCurrentAmount,
              deadline: editingDeadline,
            }
          : goal,
      ),
    );

    cancelEdit();
  };

  const deleteGoal = (id: string, name: string) => {
    const ok = window.confirm(`Delete savings goal \"${name}\"?`);
    if (!ok) return;

    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    if (editingGoalId === id) cancelEdit();
  };

  const createGoal = () => {
    const id = crypto.randomUUID();
    const today = new Date().toISOString().split("T")[0] ?? "";

    setGoals((prev) => [
      {
        id,
        name: "New Goal",
        targetAmount: 0,
        currentAmount: 0,
        deadline: today,
      },
      ...prev,
    ]);

    setEditingGoalId(id);
    setEditingName("New Goal");
    setEditingTargetAmount("0");
    setEditingCurrentAmount("0");
    setEditingDeadline(today);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Savings Goals</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your progress toward financial goals</p>
        </div>
        <button
          type="button"
          onClick={createGoal}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New Goal
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((g) => {
          const pct = g.targetAmount > 0 ? Math.min((g.currentAmount / g.targetAmount) * 100, 100) : 0;
          const isEditing = editingGoalId === g.id;

          return (
            <div key={g.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-card-foreground">{g.name}</h3>
                  <p className="text-xs text-muted-foreground">Due {g.deadline}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(g)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label={`Edit ${g.name} goal`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteGoal(g.id, g.name)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-destructive"
                    aria-label={`Delete ${g.name} goal`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/30 p-3">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    placeholder="Goal name"
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingCurrentAmount}
                      onChange={(e) => setEditingCurrentAmount(e.target.value)}
                      placeholder="Current"
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingTargetAmount}
                      onChange={(e) => setEditingTargetAmount(e.target.value)}
                      placeholder="Target"
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <input
                    type="date"
                    value={editingDeadline}
                    onChange={(e) => setEditingDeadline(e.target.value)}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(g.id)}
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
                <span className="text-lg font-extrabold text-card-foreground">{formatCurrency(g.currentAmount)}</span>
                <span className="text-sm text-muted-foreground">/ {formatCurrency(g.targetAmount)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-right text-xs font-medium text-muted-foreground">
                {Math.round(pct)}% saved - {formatCurrency(g.targetAmount - g.currentAmount)} to go
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
