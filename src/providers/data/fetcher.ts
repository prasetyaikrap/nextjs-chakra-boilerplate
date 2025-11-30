import type { RequestInit } from "next/dist/server/web/spec-extension/request";
import { redirect } from "next/navigation";
import { COOKIES } from "@/src/configs/cookies";
import { ENVS } from "@/src/configs/envs";
import { createFetcherInstance } from "@/src/providers/rest-client/handler";
import { HTTPError } from "@/src/utils/exceptions";
import {
  deleteCookies,
  getCookies,
  setCookies,
} from "@/src/utils/server-action";
import initRestClient from "../rest-client";
import { authRouter } from "./api/auth-schema";
import type { AuthRenewResponse } from "./api/type";

function fetcherInstance() {
  const fetcherInstance = createFetcherInstance();

  fetcherInstance.addRequestInterceptor(authRequestInterceptor);
  fetcherInstance.addResponseInterceptor(authenticationResponseInterceptor);

  return fetcherInstance.fetch;
}

async function authRequestInterceptor(config: RequestInit) {
  const [accessToken] = await getCookies([COOKIES.accessToken]);
  const adjustedConfig: RequestInit = {
    ...config,
    headers: {
      ...config.headers,
      "X-Client-Id": ENVS.APP_ID,
      "X-Client-Version": ENVS.APP_VERSION,
      Authorization: `Bearer ${accessToken?.value ?? ""}`,
    },
  };

  return adjustedConfig;
}

async function authenticationResponseInterceptor(
  res: Response,
  originalRequest: RequestInit,
) {
  if (res.status === 401) {
    const authService = initRestClient({
      baseUrl: ENVS.APP_AUTH_SERVICE_HOST,
      routers: authRouter,
    });
    const [refreshToken] = await getCookies([COOKIES.refreshToken]);
    if (!refreshToken?.value) {
      return res;
    }

    try {
      const {
        status,
        body: { success, message, data },
      } = await authService.authRenew<AuthRenewResponse>({
        headers: {
          "X-Client-Id": ENVS.APP_ID,
          "X-Client-Version": ENVS.APP_VERSION,
          "X-Renew-Token": "true",
          Authorization: `Bearer ${refreshToken?.value ?? ""}`,
        },
        cache: "no-store",
      });

      if (!success) {
        throw new HTTPError(`Failed to renew token: ${message}`, status, data);
      }

      const newAccessToken = data.access_token;
      const newRefreshToken = data.refresh_token;
      await setCookies([{ name: COOKIES.accessToken, value: newAccessToken }]);
      await setCookies([
        { name: COOKIES.refreshToken, value: newRefreshToken },
      ]);
      const newRequest: RequestInit = {
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      };
      return await fetcher(res.url, newRequest);
    } catch {
      await deleteCookies([COOKIES.accessToken]);
      await deleteCookies([COOKIES.refreshToken]);

      redirect("/login");
    }
  }

  return res;
}

export const fetcher = fetcherInstance();
