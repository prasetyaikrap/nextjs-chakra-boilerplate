import { CanReturnType } from "@refinedev/core";

import { UserProfileData } from "@/types/global";

export type ClientAccessControlOptions = {
  excludeResources?: Record<string, CanReturnType>;
  bypass?: boolean;
};

export type ClientAccessControlProviderProps = {
  userProfiles: UserProfileData | null;
  opts?: ClientAccessControlOptions;
};
