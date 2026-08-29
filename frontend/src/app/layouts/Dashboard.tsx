import { Outlet } from "react-router-dom";
import config from "@/app/config";

/** App chrome: header + the routed page */
export default function DashboardLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
      <header className="flex items-center justify-between border-b px-6 py-5">

          <h1 className="text-xl font-semibold tracking-tight">
            {config.APP_NAME}
          </h1>
      
      </header>

      <main className="flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
