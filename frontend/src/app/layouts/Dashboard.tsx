import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import config from "@/app/config";

/** App chrome: header + the routed page */
export default function DashboardLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
      <header className="px-6 py-6">
        <h1 className="text-xl font-semibold tracking-tight">
          {config.APP_NAME}
        </h1>
        <p className="text-sm text-muted-foreground">
          Live stock, updated as it moves.
        </p>
      </header>

      <Separator />

      <main className="flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
