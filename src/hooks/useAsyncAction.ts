"use client";

import { useCallback, useState } from "react";

export function useAsyncAction() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T,>(action: () => Promise<T>): Promise<T | undefined> => {
    setIsPending(true); setError(null);
    try { return await action(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Ocurrió un error inesperado."); }
    finally { setIsPending(false); }
  }, []);

  return { isPending, error, setError, run };
}
