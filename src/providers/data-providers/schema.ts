import { z } from "zod";

import {
  contract as defaultAppApi,
  schemas as defaultAppSchemas,
} from "./api/api-app.gen";

// schemas
export type AppAPISchema = typeof defaultAppSchemas;

export type BaseIdResponse = z.infer<AppAPISchema["BaseIdResponse"]>;

export type AuthenticationLoginPayload = z.infer<
  AppAPISchema["AuthenticationLoginPayload"]
>;
export type AuthenticationLoginResponse = z.infer<
  AppAPISchema["AuthenticationLoginResponse"]
>;
export type AuthenticationRenewResponse = z.infer<
  AppAPISchema["AuthenticationRenewResponse"]
>;
export type AuthenticationLogoutResponse = z.infer<
  AppAPISchema["AuthenticationLogoutResponse"]
>;

export { defaultAppApi };
