"use client";
import { useContext } from "react";

import AppContext from "@/providers/admin-providers/context";
import { AdminContextProps } from "@/providers/admin-providers/type";

export default function useAdminMenu() {
  const ctxValue = useContext<AdminContextProps>(AppContext);

  if (!ctxValue) {
    throw new Error("AppContext is not registered properly");
  }

  return ctxValue.menu;
}
