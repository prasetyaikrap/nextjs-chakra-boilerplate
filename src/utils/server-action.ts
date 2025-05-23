"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { ENVS } from "@/configs/envs";
import { axiosInstance } from "@/providers/data-providers/axios";
import { initRestClient } from "@/providers/data-providers/handler";
import { defaultAppApi } from "@/providers/data-providers/schema";

export async function setCookies(cookieItems: ResponseCookie[]) {
  const cookieStore = await cookies();
  const defaultMaxAge = 60 * 60 * 24 * 365;
  cookieItems.forEach((cookie) =>
    cookieStore.set({
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: defaultMaxAge,
      ...cookie,
    })
  );
}

export async function getCookies(keys: string[]) {
  const cookieStore = await cookies();
  return keys.map((key) => cookieStore.get(key));
}

export async function deleteCookies(keys: string[]) {
  const cookieStore = await cookies();
  keys.map((key) => cookieStore.delete(key));
}

export async function navigate(
  target: string,
  type: RedirectType = RedirectType.push
) {
  redirect(target, type);
}

export async function restClientAction() {
  const services = initRestClient({
    router: defaultAppApi,
    baseUrl: `${ENVS.APP_HOST}/api`,
    httpClient: axiosInstance,
  });

  return services;
}
