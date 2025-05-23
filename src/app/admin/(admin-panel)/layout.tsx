import { ReactNode } from "react";

import AdminLayout from "@/components/layouts/admin-layout";

export default function layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AdminLayout>{children}</AdminLayout>;
}
