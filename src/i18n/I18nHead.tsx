import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

/** Syncs `<html lang>` and `document.title` with the active locale and route. */
export function I18nHead() {
  const { i18n, t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const lng = (i18n.resolvedLanguage ?? "en").split("-")[0] ?? "en";
    document.documentElement.lang = lng;
    const titleKey = pathname === "/register" ? "register.seoTitle" : "seo.title";
    document.title = t(titleKey);
  }, [i18n.resolvedLanguage, pathname, t]);

  return null;
}
