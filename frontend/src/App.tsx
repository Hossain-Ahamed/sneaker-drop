import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { router } from "@/app/routes";
import { ErrorBoundary } from "@/shared/components/errorPage/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </QueryProvider>
    </ErrorBoundary>
  );
}
