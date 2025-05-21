"use client";
import { createContext } from "react";

import { AdminContextProps } from "./type";

const AdminContext = createContext<AdminContextProps>({
  menu: {
    collapsed: false,
    toggleCollapsed: () => {},
    items: [],
    selectedKeys: [],
    toggleSelectedKeys: () => {},
    rootRoute: "/",
  },
  permissions: {
    list: [],
    hasPermission: () => true,
  },
});

export default AdminContext;
