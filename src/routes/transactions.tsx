import { createFileRoute } from "@tanstack/react-router";
import { Search, Edit2, Trash2, Plus, X } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, formatCurrency, type Transaction } from "@/lib/demo-data";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionFormModal } from "@/components/TransactionFormModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
});

const ALL_CATEGORIES = Object.entries(CATEGORIES);

function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = transactions.filter((t) => {
    const matchesQuery =
      !query ||
      t.notes.toLowerCase().includes(query.toLowerCase()) ||
      t.categoryId.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !selectedCategory || t.categoryId === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const openCreate = () => {
    setEditingTx(null);
    setFormOpen(true);
  };

  const openEdit = (t: Transaction) => {
    setEditingTx(t);
    setFormOpen(true);
  };

  const handleSubmit = (data: Omit<Transaction, "id">) => {
    if (editingTx) {
      updateTransaction(editingTx.id, data);
    } else {
      addTransaction(data);
    }
  };

  return (
    <div className="animate-fade-in space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
            {filtered.length} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5"
        >
          <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
          <span className="hidden text-sm font-semibold sm:inline">Add Transaction</span>
        </button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm sm:rounded-2xl">
        {/* Search */}
        <div className="flex items-center gap-2.5 border-b px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} className="shrink-0 text-muted-foreground transition hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="border-b px-3 py-2 sm:px-5 sm:py-2.5">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none sm:gap-2" style={{ WebkitOverflowScrolling: "touch" }}>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition sm:px-3 sm:text-xs ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              All
            </button>
            {ALL_CATEGORIES.map(([id, cat]) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(selectedCategory === id ? null : id)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition sm:px-3 sm:text-xs ${
                  selectedCategory === id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/20 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((t) => (
                <tr key={t.id} className="transition hover:bg-muted/20">
                  <td className="px-5 py-3.5 text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{t.notes || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {CATEGORIES[t.categoryId]?.icon} {CATEGORIES[t.categoryId]?.name || t.categoryId}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.paymentMethod}</td>
                  <td className={`px-5 py-3.5 text-right font-bold ${t.type === "income" ? "text-income" : "text-expense"}`}>
                    {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => openEdit(t)} className="mr-2 text-muted-foreground transition hover:text-primary">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeletingId(t.id)} className="text-muted-foreground transition hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list — compact */}
        <div className="divide-y md:hidden">
          {filtered.length === 0 && (
            <div className="px-3 py-10 text-center text-xs text-muted-foreground">
              No transactions found.
            </div>
          )}
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center gap-2.5 px-3 py-2.5">
              <span className="shrink-0 text-base">{CATEGORIES[t.categoryId]?.icon || "📌"}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-card-foreground">{t.notes || "—"}</p>
                <p className="text-[10px] text-muted-foreground">{t.date}</p>
              </div>
              <span className={`shrink-0 text-xs font-bold ${t.type === "income" ? "text-income" : "text-expense"}`}>
                {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
              </span>
              <div className="flex shrink-0 items-center">
                <button onClick={() => openEdit(t)} className="p-1 text-muted-foreground transition hover:text-primary">
                  <Edit2 className="h-3 w-3" />
                </button>
                <button onClick={() => setDeletingId(t.id)} className="p-1 text-muted-foreground transition hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TransactionFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingTx}
      />

      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteTransaction(deletingId);
        }}
      />
    </div>
  );
}
