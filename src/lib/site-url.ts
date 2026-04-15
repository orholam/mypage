/**
 * Canonical origin for metadata (Open Graph, Twitter, canonical URLs, sitemap).
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. `https://www.example.com`).
 * On Vercel, `VERCEL_URL` is used when unset. Local dev defaults to `http://localhost:3000`.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const normalized = explicit.endsWith("/") ? explicit.slice(0, -1) : explicit;
    return new URL(normalized);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return new URL(`https://${vercel}`);
  }

  return new URL("http://localhost:3000");
}
