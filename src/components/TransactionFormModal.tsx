import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { CATEGORIES, type Transaction } from "@/lib/demo-data";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  initialData?: Transaction | null;
}

const PAYMENT_METHODS = ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "PayPal", "Auto-pay", "Insurance"];
const categoryKeys = Object.keys(CATEGORIES);

export function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TransactionFormModalProps) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(categoryKeys[0]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(String(initialData.amount));
      setCategoryId(initialData.categoryId);
      setDate(initialData.date);
      setPaymentMethod(initialData.paymentMethod);
      setNotes(initialData.notes);
    } else {
      setType("expense");
      setAmount("");
      setCategoryId(categoryKeys[0]);
      setDate(format(new Date(), "yyyy-MM-dd"));
      setPaymentMethod("Cash");
      setNotes("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;
    onSubmit({
      type,
      amount: parsed,
      categoryId,
      date,
      paymentMethod,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 glass" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-card-foreground">
            {initialData ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-xl bg-muted p-1 gap-1">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition ${
                  type === t
                    ? t === "expense"
                      ? "bg-card text-expense shadow-sm"
                      : "bg-card text-income shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          {/* Category & Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
              >
                {categoryKeys.map((key) => (
                  <option key={key} value={key}>
                    {CATEGORIES[key].icon} {CATEGORIES[key].name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Payment method */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Notes
            </label>
            <input
              type="text"
              maxLength={200}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Description..."
              className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              {initialData ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
