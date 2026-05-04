import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function BookDemoModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    } else {
      setFullName("");
      setEmail("");
      setCompany("");
      setRole("");
      setTeamSize("");
      setMessage("");
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label={t("bookDemo.close")}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-elevated max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold tracking-tight text-foreground">
              {t("bookDemo.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("bookDemo.subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <span className="sr-only">{t("bookDemo.close")}</span>
            <span aria-hidden className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-xl border border-border bg-muted/30 px-4 py-6 text-center">
            <p className="font-medium text-foreground">{t("bookDemo.successTitle")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("bookDemo.successBody")}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background hover:opacity-90 transition"
            >
              {t("bookDemo.done")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className={labelClass} htmlFor="demo-name">
                {t("bookDemo.fullName")}
              </label>
              <input
                id="demo-name"
                className={fieldClass}
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="demo-email">
                {t("bookDemo.workEmail")}
              </label>
              <input
                id="demo-email"
                type="email"
                className={fieldClass}
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="demo-company">
                {t("bookDemo.company")}
              </label>
              <input
                id="demo-company"
                className={fieldClass}
                autoComplete="organization"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="demo-role">
                {t("bookDemo.role")}
              </label>
              <input
                id="demo-role"
                className={fieldClass}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="demo-team">
                {t("bookDemo.teamSize")}
              </label>
              <select
                id="demo-team"
                className={fieldClass}
                required
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              >
                <option value="">{t("bookDemo.teamSizePlaceholder")}</option>
                <option value="1-10">{t("bookDemo.team1")}</option>
                <option value="11-50">{t("bookDemo.team2")}</option>
                <option value="51-200">{t("bookDemo.team3")}</option>
                <option value="201+">{t("bookDemo.team4")}</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="demo-msg">
                {t("bookDemo.message")}{" "}
                <span className="font-normal text-muted-foreground">
                  ({t("bookDemo.messageOptional")})
                </span>
              </label>
              <textarea
                id="demo-msg"
                rows={3}
                className={`${fieldClass} resize-y min-h-[88px]`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted transition"
              >
                {t("bookDemo.cancel")}
              </button>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background hover:opacity-90 transition"
              >
                {t("bookDemo.submit")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
