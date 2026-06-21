"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * SSR-safe localStorage state. Data lives ONLY on the user's device — this is
 * how the trackers stay private with no account and no server.
 * Returns [value, setValue, hydrated].
 */
export function useLocalState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount (SSR-safe). This intentionally
    // syncs React state with an external store, which is exactly what effects
    // are for — the setState here is hydration, not a cascading render.
    try {
      const raw = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw != null) setState(JSON.parse(raw) as T);
    } catch {
      // ignore corrupt/unavailable storage
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore quota/availability errors
    }
  }, [key, state, hydrated]);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setState(initial);
  }, [key, initial]);

  return [state, setState, hydrated, clear] as const;
}

/** Export all dpa_* local keys as a downloadable JSON blob (data portability). */
export function exportLocalData() {
  const out: Record<string, unknown> = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith("dpa_")) {
      try {
        out[k] = JSON.parse(window.localStorage.getItem(k) || "null");
      } catch {
        out[k] = window.localStorage.getItem(k);
      }
    }
  }
  return out;
}
