/**
 * @file consent.ts
 * Cookie consent state management with Google Consent Mode v2 (direct gtag.js).
 */

export type ConsentState = "accepted" | "rejected";

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function getConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )cookie_consent=([^;]+)/);
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setConsent(state: ConsentState): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${state}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  updateGtagConsent(state);
}

export function updateGtagConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer ?? [];
  function gtag(...args: unknown[]) { w.dataLayer.push(args); }
  const value = state === "accepted" ? "granted" : "denied";
  gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

export function clearConsent(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
