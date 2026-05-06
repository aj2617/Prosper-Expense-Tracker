import { useState, useCallback } from "react";
import { DEMO_TRANSACTIONS, type Transaction } from "@/lib/demo-data";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => [...DEMO_TRANSACTIONS]);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    const id = crypto.randomUUID();
    setTransactions((prev) => [{ ...t, id }, ...prev]);
  }, []);

  const updateTransaction = useCallback(
    (id: string, updates: Partial<Omit<Transaction, "id">>) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { transactions, addTransaction, updateTransaction, deleteTransaction };
}
