export const ENVS = {
  APP_HOST: process.env.NEXT_PUBLIC_APP_HOST || "http://localhost:3000",
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev-environment-v0.0.0",
  APP_ID: process.env.NEXT_PUBLIC_APP_ID ?? "",
};
