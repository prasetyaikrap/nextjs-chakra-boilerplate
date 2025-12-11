"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getQueryClient } from "@/src/providers/query-client";

type QueryClientProviderProps = {
  children: ReactNode;
};

export default function QueryClientProviders({
  children,
}: QueryClientProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
