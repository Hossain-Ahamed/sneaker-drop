import { useCallback, useSyncExternalStore } from "react";

export function useHasStarted(start_time: string): boolean {
  const time = new Date(start_time).getTime();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const msUntilStart = time - Date.now();
      if (msUntilStart <= 0) return () => {};

      // one timer that fires exactly at the start, not a per-second poll
      const timer = setTimeout(onStoreChange, msUntilStart + 100);
      return () => clearTimeout(timer);
    },
    [time],
  );

  const getSnapshot = useCallback(
    () => time <= Date.now(),
    [time],
  );

  return useSyncExternalStore(subscribe, getSnapshot);
}
