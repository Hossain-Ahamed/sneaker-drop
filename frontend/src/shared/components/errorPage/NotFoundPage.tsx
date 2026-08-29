import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/** Rendered for any unmatched route */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-5xl font-semibold">404</p>
      <p className="text-muted-foreground">This page does not exist.</p>
      <Button render={<Link to="/" />} variant="outline">
        Back to drops
      </Button>
    </div>
  );
}
