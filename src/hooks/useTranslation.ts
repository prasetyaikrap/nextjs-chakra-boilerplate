"use client";

import { useLocale, useTranslations } from "next-intl";
import { setCookies } from "@/src/utils/server-action";

export function useTranslation() {
  const translate = useTranslations();
  const currentLocale = useLocale();

  const changeLocale = async (lang: string) => {
    await setCookies([{ name: "locale", value: lang, path: "/" }]);
  };

  return {
    translate,
    getLocale: () => currentLocale,
    changeLocale,
  };
}
