import { Link } from "react-router-dom";

/** Rendered for any unmatched route */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <p className="text-5xl font-semibold">404</p>
      <p className="text-muted-foreground">This page does not exist.</p>
      <Link to="/" className="text-sm underline underline-offset-4">
        Back to drops
      </Link>
    </div>
  );
}
