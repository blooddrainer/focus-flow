export const SUPPORTED_LANGUAGES = ["en", "bg"] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function isAppLanguage(code: string): code is AppLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}
