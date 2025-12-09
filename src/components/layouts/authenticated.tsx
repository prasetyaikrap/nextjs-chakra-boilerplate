import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AuthProvider } from "@/src/providers/authentications";

type AuthenticatedProps = {
  children: ReactNode;
  resource?: string;
  redirectTo?: string;
};

export async function Authenticated({
  children,
  resource = "",
  redirectTo,
}: AuthenticatedProps) {
  const authProvider = new AuthProvider();
  const { authenticated, redirectTo: authRedirect } = await authProvider.check({
    resource,
  });

  if (!authenticated) {
    redirect(redirectTo ?? authRedirect ?? "/login");
  }

  return <>{children}</>;
}
