import { ReactNode } from "react";
import { MdDashboard } from "react-icons/md";

import AdminLayout from "@/components/layouts/admin-layout";
import AdminProvider from "@/providers/admin-providers/provider";
import { MenuProviderProps } from "@/providers/admin-providers/type";

export default function layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const menus: MenuProviderProps[] = [
    {
      name: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard />,
      list: "/admin",
    },
  ];

  return (
    <AdminProvider menuProvider={menus} rootRoute="/admin">
      <AdminLayout>{children}</AdminLayout>
    </AdminProvider>
  );
}
