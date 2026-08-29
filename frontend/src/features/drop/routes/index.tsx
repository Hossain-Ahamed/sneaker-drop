import type { RouteObject } from "react-router-dom";
import { lazyComponent } from "@/shared/lib/lazyload";

const DropList = lazyComponent(() => import("../pages/DropList"));

export const dropRoutes: RouteObject[] = [
  /**
   * ==============================================================
   * Drop Routes
   * ==============================================================
   * @module Drop
   * @path /drops
   * @description Routes related to the Drop feature, including listing and details.
   * @component DropList - Displays a list of drops.
   * ==============================================================
   */
  {
    index: true,
    element: <DropList />,
  },
];
