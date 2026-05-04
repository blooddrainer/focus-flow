import { ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = t("register.errors.required");
    if (!email.trim()) next.email = t("register.errors.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t("register.errors.email");
    if (!password) next.password = t("register.errors.required");
    else if (password.length < 8) next.password = t("register.errors.passwordLength");
    if (password !== confirm) next.confirm = t("register.errors.passwordMatch");
    if (!terms) next.terms = t("register.errors.terms");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {t("register.back")}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
            aria-label={t("home.brand")}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="hidden sm:inline">{t("home.brand")}</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("register.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("register.subtitle")}</p>

          {submitted ? (
            <div className="mt-8 rounded-xl border border-border bg-muted/30 px-4 py-6 text-center">
              <p className="font-medium text-foreground">{t("register.successTitle")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("register.successBody")}</p>
              <Link
                to="/"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background hover:opacity-90 transition"
              >
                {t("register.back")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
              <div>
                <label className={labelClass} htmlFor="reg-name">
                  {t("register.fullName")}
                </label>
                <input
                  id="reg-name"
                  className={fieldClass}
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className={labelClass} htmlFor="reg-email">
                  {t("register.email")}
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className={fieldClass}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="reg-pass">
                  {t("register.password")}
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  className={fieldClass}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">{errors.password}</p>
                )}
              </div>
              <div>
                <label className={labelClass} htmlFor="reg-confirm">
                  {t("register.confirmPassword")}
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  className={fieldClass}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  aria-invalid={!!errors.confirm}
                />
                {errors.confirm && (
                  <p className="mt-1 text-xs text-destructive">{errors.confirm}</p>
                )}
              </div>
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="reg-terms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-input"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  aria-invalid={!!errors.terms}
                />
                <label htmlFor="reg-terms" className="text-sm text-muted-foreground leading-snug">
                  {t("register.terms")}
                </label>
              </div>
              {errors.terms && <p className="text-xs text-destructive -mt-2">{errors.terms}</p>}
              <button
                type="submit"
                className="mt-2 w-full inline-flex h-11 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background hover:opacity-90 transition"
              >
                {t("register.submit")}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
