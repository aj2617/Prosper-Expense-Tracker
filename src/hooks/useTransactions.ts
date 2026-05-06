import { useCallback } from "react";
import { DEFAULT_TRANSACTIONS, type Transaction } from "@/lib/demo-data";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorageState<Transaction[]>("prosper.transactions.v1", DEFAULT_TRANSACTIONS);

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
