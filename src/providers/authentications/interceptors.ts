import { COOKIES } from "@/src/configs/cookies";
import { ENVS } from "@/src/configs/envs";
import { getCookies } from "@/src/utils/server-action";

export async function authRequestInterceptor(config: RequestInit) {
  const [accessToken] = await getCookies([COOKIES.accessToken]);
  const adjustedConfig: RequestInit = {
    ...config,
    headers: {
      "X-Client-Id": ENVS.APP_ID,
      "X-Client-Version": ENVS.APP_VERSION,
      Authorization: `Bearer ${accessToken?.value ?? ""}`,
      ...config.headers,
    },
  };

  return adjustedConfig;
}
