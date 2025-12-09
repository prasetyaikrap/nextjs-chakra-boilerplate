import { COOKIES } from "@/src/configs/cookies";
import { ENVS } from "@/src/configs/envs";
import { authRouter } from "@/src/providers/data/api/auth-schema";
import type {
  AuthExchangeResponse,
  AuthLogoutResponse,
  AuthVerifyResponse,
} from "@/src/providers/data/api/type";
import RestClient from "@/src/providers/rest-client";
import {
  deleteCookies,
  getCookies,
  setCookies,
} from "@/src/utils/server-action";
import { authRequestInterceptor } from "./interceptors";
import type {
  AuthActionResponse,
  AuthProviderReturnType,
  CheckResponse,
} from "./type";

type BaseParams = {
  resource?: string;
};

type LoginParams = {
  code: string;
  grant_type: string;
  redirectTo?: string;
} & BaseParams;

type CheckParams = {} & BaseParams;

export class AuthProvider implements AuthProviderReturnType {
  public authService: ReturnType<RestClient<typeof authRouter>["init"]>;
  constructor() {
    const client = new RestClient({
      baseUrl: ENVS.APP_AUTH_SERVICE_HOST,
      routers: authRouter,
    });

    client.addRequestInterceptor(authRequestInterceptor);
    this.authService = client.init();
  }

  async login({
    grant_type,
    code,
    redirectTo,
  }: LoginParams): Promise<AuthActionResponse> {
    try {
      const { status, body } =
        await this.authService.authExchange<AuthExchangeResponse>({
          payload: { grant_type, code },
        });

      if (status !== 200) {
        return {
          success: false,
          redirectTo: "/login",
          error: {
            type: "provider_auth_login",
            message: body.message || "Something Went Wrong",
          },
        };
      }

      const { access_token, refresh_token } = body.data;
      await setCookies([
        { name: COOKIES.accessToken, value: access_token },
        { name: COOKIES.refreshToken, value: refresh_token },
      ]);

      return {
        success: true,
        redirectTo,
      };
    } catch (error) {
      return {
        success: false,
        redirectTo: "/login",
        error: {
          type: "provider_auth_login",
          message: (error as Error)?.message || "Something Went Wrong",
        },
      };
    }
  }

  async check(params: CheckParams): Promise<CheckResponse> {
    const protectedResources = ["protected"];
    if (!protectedResources.includes(params?.resource || "")) {
      return Promise.resolve({
        authenticated: true,
      });
    }

    try {
      const { status, body } =
        await this.authService.authVerify<AuthVerifyResponse>();
      if (status !== 200) {
        return {
          authenticated: false,
          redirectTo: "/login",
          logout: true,
          error: {
            type: "provider_auth_check",
            message: body.message || "Authentication Failed",
          },
        };
      }

      const { access_token, refresh_token } = body.data;
      await setCookies([
        { name: COOKIES.accessToken, value: access_token },
        { name: COOKIES.refreshToken, value: refresh_token },
      ]);

      return {
        authenticated: true,
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
        error: {
          type: "provider_auth_check",
          message: (error as Error)?.message || "Authentication Failed",
        },
      };
    }
  }

  async logout(): Promise<AuthActionResponse> {
    try {
      const [refreshTokenCookie] = await getCookies([COOKIES.refreshToken]);
      const { status, body } =
        await this.authService.authLogout<AuthLogoutResponse>({
          headers: {
            Authorization: `Bearer ${refreshTokenCookie?.value ?? ""}`,
          },
        });
      if (status !== 200) {
        return {
          success: false,
          error: {
            type: "provider_auth_logout",
            message: body.message || "Logout Failed",
          },
        };
      }

      await deleteCookies([COOKIES.accessToken, COOKIES.refreshToken]);

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          type: "provider_auth_logout",
          message: (error as Error)?.message || "Logout Failed",
        },
      };
    }
  }
}
