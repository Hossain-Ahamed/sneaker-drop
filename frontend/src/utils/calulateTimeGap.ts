import { formatTime } from "./formatTime";

export function calulateTimeGap(time: string): string {
  const seconds = Math.floor((Date.now() - new Date(time).getTime()) / 1000);

  if (seconds < 60) return `${Math.max(seconds, 0)}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return formatTime(time);
}
