import { useEffect, useReducer } from "react";

function remaining(expiresAt: string | null): number {
  if (!expiresAt) return 0;
  const ms = new Date(expiresAt).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / 1000) : 0;
}

export function useCountdown(expiresAt: string | null): number {
  const [, forceRender] = useReducer((count: number) => count + 1, 0);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(forceRender, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return remaining(expiresAt);
}
