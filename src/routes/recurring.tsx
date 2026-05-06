import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, DEFAULT_RECURRING, formatCurrency, type RecurringTransaction } from "@/lib/demo-data";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

export const Route = createFileRoute("/recurring")({
  component: RecurringPage,
});

function RecurringPage() {
  const [items, setItems] = useLocalStorageState<RecurringTransaction[]>("prosper.recurring.v1", DEFAULT_RECURRING);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState("");
  const [editingNote, setEditingNote] = useState("");

  const startEdit = (item: RecurringTransaction) => {
    setEditingId(item.id);
    setEditingAmount(String(item.amount));
    setEditingNote(item.notes);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingAmount("");
    setEditingNote("");
  };

  const saveEdit = (id: string) => {
    const amount = Number(editingAmount);
    if (Number.isNaN(amount) || amount < 0) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              amount,
              notes: editingNote.trim() || "Recurring item",
            }
          : item,
      ),
    );

    cancelEdit();
  };

  const createRecurring = () => {
    const nextDate = new Date().toISOString().split("T")[0] ?? "";
    const id = crypto.randomUUID();

    const item: RecurringTransaction = {
      id,
      amount: 0,
      categoryId: "other",
      type: "expense",
      frequency: "monthly",
      nextDate,
      paymentMethod: "Card",
      notes: "New recurring item",
    };

    setItems((prev) => [item, ...prev]);
    startEdit(item);
  };

  const deleteRecurring = (id: string, name: string) => {
    const ok = window.confirm(`Delete recurring item "${name}"?`);
    if (!ok) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Repetitive</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your repetitive income and expenses</p>
        </div>
        <button
          type="button"
          onClick={createRecurring}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Repetitive
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const category = CATEGORIES[item.categoryId];
          const isEditing = editingId === item.id;

          return (
            <div key={item.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl">{category?.icon || "📌"}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-card-foreground">{item.notes}</h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {item.frequency} · {item.paymentMethod}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label={`Edit ${item.notes}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRecurring(item.id, item.notes)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-destructive"
                    aria-label={`Delete ${item.notes}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/30 p-3">
                  <input
                    type="text"
                    value={editingNote}
                    onChange={(e) => setEditingNote(e.target.value)}
                    placeholder="Recurring item"
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingAmount}
                      onChange={(e) => setEditingAmount(e.target.value)}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(item.id)}
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
                <span className={`text-lg font-extrabold ${item.type === "income" ? "text-income" : "text-expense"}`}>
                  {item.type === "income" ? "+" : "−"}
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs text-muted-foreground">Next: {item.nextDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
