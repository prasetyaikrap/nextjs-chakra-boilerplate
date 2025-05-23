import { CanParams, CanReturnType } from "@refinedev/core";

import { ClientAccessControlProviderProps } from "./type";

export function accessControlProvider({
  userProfiles,
  opts,
}: ClientAccessControlProviderProps) {
  return {
    can: async ({
      resource,
      params,
      action,
    }: CanParams): Promise<CanReturnType> => {
      if (!params || !userProfiles?.email) {
        return {
          can: false,
          reason: "Unauthorized",
        };
      }

      const { permissions } = userProfiles;
      const targetResource = params?.resource?.identifier ?? resource ?? "";
      const excludeResources = opts?.excludeResources || {};
      const excludeResourceKeys = Object.keys(excludeResources);

      if (
        excludeResources[targetResource] &&
        excludeResourceKeys.includes(targetResource)
      ) {
        return Promise.resolve(excludeResources[targetResource]);
      }

      const isCan = permissions.includes(`${targetResource}:${action}`);

      return Promise.resolve({ can: isCan });
    },
  };
}
