import { Component, type ErrorInfo, type ReactNode } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ErrorScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-2xl font-semibold">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        className="mt-2"
      >
        Reload
      </Button>
    </div>
  );
}

export function RouterErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  return <ErrorScreen title="Something broke" message={message} />;
}

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { error: Error | null };

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Unhandled render error", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          title="Something broke"
          message={this.state.error.message}
        />
      );
    }

    return this.props.children;
  }
}
