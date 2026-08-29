import { Suspense, lazy, type ComponentType } from "react";
import { PageLoader } from "@/shared/components/PageLoader";

export function lazyComponent<TProps extends object>(
  importer: () => Promise<{ default: ComponentType<TProps> }>,
) {
  const Lazy = lazy(() => importer().catch(() => importer()));

  return (props: TProps) => (
    <Suspense fallback={<PageLoader />}>
      <Lazy {...props} />
    </Suspense>
  );
}
