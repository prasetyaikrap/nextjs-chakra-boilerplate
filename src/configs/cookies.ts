import { ENVS } from "./envs";

export const COOKIES = {
  accessToken: `${ENVS.APP_VERSION}_access_token`,
  refreshToken: `${ENVS.APP_VERSION}_refresh_token`,
  sessionId: `${ENVS.APP_VERSION}_session_id`,
};
