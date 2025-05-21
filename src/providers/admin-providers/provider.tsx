"use client";

import { useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import AdminContext from "./context";
import { AdminContextProps, AppProviderProps } from "./type";

export default function AdminProvider({
  children,
  menuProvider,
  rootRoute = "/",
}: AppProviderProps) {
  // Menu
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const isSmallScreen = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
    xl: false,
    "2xl": false,
  });

  // Permissions
  const [permissions, setPermissions] = useState<string[]>([]);

  const value: AdminContextProps = useMemo(() => {
    const hasPermission = (permission: string) => {
      return permissions.includes(permission);
    };
    const setMenuSelected = (keys: string[]) => {
      setSelectedKeys(keys);
      localStorage.setItem("menu_selected_key", JSON.stringify(keys));
    };

    return {
      menu: {
        items: menuProvider,
        collapsed,
        toggleCollapsed: setCollapsed,
        selectedKeys,
        toggleSelectedKeys: setMenuSelected,
        rootRoute,
      },
      permissions: {
        list: permissions,
        hasPermission,
        setPermissions,
      },
    };
  }, [menuProvider, collapsed, selectedKeys, permissions, rootRoute]);

  useEffect(() => {
    if (isSmallScreen === undefined) return;
    setCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  useEffect(() => {
    const currentSelectedMenu = localStorage.getItem("menu_selected_key");
    if (!currentSelectedMenu) return;
    setSelectedKeys(JSON.parse(currentSelectedMenu) as string[]);
  }, []);

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
