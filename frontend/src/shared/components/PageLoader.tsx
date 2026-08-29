import { Loader2 } from "lucide-react";

/** Full-height spinner used as the Suspense fallback for lazy pages */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
