import { useEffect, useState } from "react";

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorageState<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(safeRead<T>(key, fallback));
    setLoaded(true);
  }, [key, fallback]);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, loaded, state]);

  return [state, setState] as const;
}
