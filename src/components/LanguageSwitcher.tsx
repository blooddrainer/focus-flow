import { useTranslation } from "react-i18next";

import { SUPPORTED_LANGUAGES } from "@/i18n/languages";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const active = (i18n.resolvedLanguage ?? "en").split("-")[0] ?? "en";

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-border bg-muted/40 p-0.5"
      role="group"
      aria-label={t("lang.switchLabel")}
    >
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => void i18n.changeLanguage(lng)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
            active === lng
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={active === lng}
        >
          {t(`lang.${lng}`)}
        </button>
      ))}
    </div>
  );
}
