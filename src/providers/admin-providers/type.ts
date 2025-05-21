import { ReactNode } from "react";

export type AdminContextProps = {
  menu: {
    collapsed: boolean;
    toggleCollapsed: (v: boolean) => void;
    items: MenuProviderProps[];
    selectedKeys: string[];
    toggleSelectedKeys: (key: string[]) => void;
    rootRoute: string;
  };
  permissions: {
    list: string[];
    hasPermission: (permission: string) => boolean;
  };
};

export type MenuProviderProps = {
  name: string;
  label: string;
  list?: string;
  show?: string;
  create?: string;
  edit?: string;
  icon?: ReactNode;
  permissions?: string[];
  children?: MenuProviderProps[];
};

export interface AppProviderProps {
  children: ReactNode;
  menuProvider: MenuProviderProps[];
  rootRoute?: string;
}
