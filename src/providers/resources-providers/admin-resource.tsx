import { ResourceProps } from "@refinedev/core";
import { MdDashboard } from "react-icons/md";

export const adminResources: ResourceProps[] = [
  {
    name: "dashboard",
    list: "/admin",
    meta: {
      label: "Dashboard",
      icon: <MdDashboard />,
    },
  },
];
