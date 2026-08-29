import { createBrowserRouter } from "react-router-dom";
import Main from "@/app/layouts/Main";
import DashboardLayout from "@/app/layouts/Dashboard";
import { RouterErrorBoundary } from "@/shared/components/errorPage/ErrorBoundary";
import NotFoundPage from "@/shared/components/errorPage/NotFoundPage";
import { dropRoutes } from "@/features/drop/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          /** Drop listing */
          { path: "", children: dropRoutes },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
