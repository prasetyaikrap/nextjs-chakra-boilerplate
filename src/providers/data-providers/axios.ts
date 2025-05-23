import type { HttpError } from "@refinedev/core";
import axios, { AxiosError, AxiosInstance } from "axios";

import { COOKIES } from "@/configs/cookies";
import { ENVS } from "@/configs/envs";
import { deleteCookies, getCookies, setCookies } from "@/utils/server-action";

import { initRestClient } from "./handler";
import { AuthenticationRenewResponse, defaultAppApi } from "./schema";

type ExtendedAxiosError = {
  config: {
    _retry: boolean;
    _isRenewToken: boolean;
  };
} & AxiosError;

function defaultRequestInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(
    async (config) => {
      if (config.headers !== undefined) {
        const [sessionIdCookie] = await getCookies([COOKIES.sessionId]);

        config.headers.set("X-Client-Id", ENVS.APP_ID);
        config.headers.set("X-Client-Version", ENVS.APP_VERSION);
        config.headers.set(
          "Authorization",
          `Bearer ${sessionIdCookie?.value ?? ""}`
        );
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

function defaultResponseInterceptor(axiosInstance: AxiosInstance) {
  const authService = initRestClient({
    router: defaultAppApi,
    baseUrl: `${ENVS.APP_HOST}/api`,
    httpClient: axiosInstance,
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: ExtendedAxiosError) => {
      const originalRequest = error.config;
      const originalAuthorizationHeader =
        originalRequest?.headers.Authorization || "";
      const originalAccessToken = (originalAuthorizationHeader as string).split(
        "Bearer "
      )[1];
      const isRenewToken =
        originalRequest?.headers.get("X-Renew-Token")?.toString() === "true";

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest?._retry &&
        !isRenewToken &&
        originalAccessToken
      ) {
        originalRequest._retry = true;
        const [sessionIdCookie] = await getCookies([COOKIES.sessionId]);

        try {
          const { body: responseBody } = await authService.putRenewAdmin({
            extraHeaders: {
              "X-Renew-Token": "true",
              Authorization: `Bearer ${sessionIdCookie?.value ?? ""}`,
            },
          });

          const {
            data: { session_id_key, session_id },
          } = responseBody as AuthenticationRenewResponse;

          originalRequest.headers.set("Authorization", `Bearer ${session_id}`);
          await setCookies([
            {
              name: session_id_key,
              value: session_id,
            },
          ]);

          return await axiosInstance(originalRequest);
        } catch (err) {
          await deleteCookies([COOKIES.sessionId]);
          window.location.replace("/admin/login");

          return Promise.reject(err);
        }
      }

      const customError: HttpError = {
        ...error,
        message: (error.response?.data as any).message || "",
        statusCode: error.response?.status || 400,
      };

      return Promise.reject(customError);
    }
  );
}

function createAxios() {
  const axiosInstance = axios.create();

  defaultRequestInterceptor(axiosInstance);
  defaultResponseInterceptor(axiosInstance);

  return axiosInstance;
}

export const axiosInstance = createAxios();
