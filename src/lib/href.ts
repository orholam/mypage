/** Best-effort URL for personal-page CTAs (https, mailto, or relative path). */
export function normalizeOutboundHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^mailto:/i.test(t)) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("/") || t.startsWith("#")) return t;
  if (t.includes(".") && !t.includes(" ")) {
    return `https://${t}`;
  }
  return t;
}
