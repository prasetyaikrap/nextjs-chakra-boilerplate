"use client";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { ReactNode, useMemo, useState } from "react";

import dataProviders from "@/providers/data-providers";
import { accessControlProvider } from "@/providers/rbac-provider/rbac";
import { adminResources } from "@/providers/resources-providers/admin-resource";
import { UserProfileData } from "@/types/global";

export default function RefineProviders({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [userProfiles, setUserProfiles] = useState<UserProfileData | null>(
    null
  );

  const adminResourceGroup = adminResources.map((item) => ({
    ...item,
    meta: { ...item.meta, group: "admins" },
  }));
  const appResources = [...adminResourceGroup];

  const rbacProvider = useMemo(
    () => accessControlProvider({ userProfiles }),
    [userProfiles]
  );

  return (
    <Refine
      dataProvider={dataProviders}
      routerProvider={routerProvider}
      // authProvider={authProvider}
      accessControlProvider={rbacProvider}
      // notificationProvider={useNotificationProvider}
      resources={appResources}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        disableTelemetry: true,
      }}
    >
      {children}
    </Refine>
  );
}
