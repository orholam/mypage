import type { NextRequest } from "next/server";

/** Apex host only (no port), e.g. `example.com` or `localhost`. Used to detect `{sub}.ROOT`. */
export function getRootHost(): string | null {
  const raw = process.env.NEXT_PUBLIC_ROOT_HOST?.trim();
  if (raw) return raw.split(":")[0].toLowerCase();
  // Local dev: `*.localhost:3000` works without env; share + middleware need a root host.
  if (process.env.NODE_ENV === "development") return "localhost";
  return null;
}

export const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "dashboard",
  "admin",
  "cdn",
  "mail",
  "ftp",
  "localhost",
  "staging",
  "dev",
  "auth",
  "oauth",
  "static",
  "assets",
  "_vercel",
  "vercel",
]);

export function normalizeSubdomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function suggestSubdomainFromName(name: string): string {
  const s = normalizeSubdomain(name.replace(/\s+/g, "-"));
  return (s.length >= 2 ? s : "site").slice(0, 48);
}

export function isValidSubdomain(s: string): boolean {
  if (s.length < 2 || s.length > 63) return false;
  if (RESERVED_SUBDOMAINS.has(s)) return false;
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(s);
}

/**
 * If the request host is `{subdomain}.{NEXT_PUBLIC_ROOT_HOST}`, returns `subdomain`.
 * Requires NEXT_PUBLIC_ROOT_HOST (hostname only, e.g. `localhost` or `yourdomain.com`).
 */
export function parseTenantSubdomain(request: NextRequest): string | null {
  const rootName = getRootHost();
  if (!rootName) return null;

  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();

  if (hostname === rootName || hostname === `www.${rootName}`) {
    return null;
  }

  const suffix = `.${rootName}`;
  if (!hostname.endsWith(suffix)) return null;

  const sub = hostname.slice(0, -suffix.length);
  if (!sub || sub.includes(".")) return null;
  if (RESERVED_SUBDOMAINS.has(sub)) return null;

  return sub;
}

/** Short host for tables and hints, e.g. `acme.localhost` or `acme.example.com` (no port or protocol). */
export function publicSiteHostLabel(subdomain: string): string | null {
  const root = getRootHost();
  if (!root || !subdomain) return null;
  return `${subdomain}.${root}`;
}

/**
 * Absolute public URL for a tenant site.
 * Returns `null` when no root host is configured (deploy hasn't set NEXT_PUBLIC_ROOT_HOST, or
 * no subdomain was saved). Callers should disable or hide share/preview controls when null.
 */
export function publicSiteAbsoluteUrl(subdomain: string): string | null {
  const root = getRootHost();
  if (!root || !subdomain) return null;

  if (typeof window !== "undefined") {
    if (root === "localhost") {
      const { protocol, port } = window.location;
      const portPart = port ? `:${port}` : "";
      return `${protocol}//${subdomain}.localhost${portPart}/`;
    }
    return `https://${subdomain}.${root}/`;
  }

  // Server-side path (RSC / Server Actions)
  if (root === "localhost") return `http://${subdomain}.localhost:3000/`;
  return `https://${subdomain}.${root}/`;
}
