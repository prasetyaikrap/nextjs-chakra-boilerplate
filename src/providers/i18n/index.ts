import { getRequestConfig } from "next-intl/server";
import { getCookies } from "@/src/utils/server-action";

export default getRequestConfig(async () => {
  const [localeCookie] = await getCookies(["locale"]);
  const locale = localeCookie?.value || "en";

  return {
    locale,
    messages: (await import(`./locales/${locale}/common.json`)).default,
  };
});
