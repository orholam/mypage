import type { SiteKind } from "@/lib/database.types";
import { normalizeOutboundHref } from "@/lib/href";

/** Stored under `waitlist_pages.extras` (JSON). */
export type ProfileLinkProvider =
  | "github"
  | "linkedin"
  | "x"
  | "youtube"
  | "discord"
  | "website"
  | "mail";

export type ProfileLink = {
  provider: ProfileLinkProvider;
  url: string;
};

export type WaitlistPitchExtras = {
  /** Short value props — shown with checkmarks (max 4). */
  bullets?: string[];
  /** One line under headline area, e.g. credibility. */
  trustLine?: string;
  /** Scarcity / deadline line. */
  urgencyLine?: string;
  /** Social proof number or phrase. */
  statHint?: string;
};

export type PageExtras = {
  profileLinks?: ProfileLink[];
  waitlist?: WaitlistPitchExtras;
};

export const MAX_PROFILE_LINKS = 8;
export const MAX_WAITLIST_BULLETS = 4;

export const PROFILE_LINK_PROVIDERS: ProfileLinkProvider[] = [
  "github",
  "linkedin",
  "x",
  "youtube",
  "discord",
  "website",
  "mail",
];
const MAX_LINE_LEN = 160;
const MAX_BULLET_LEN = 120;

export function parsePageExtras(raw: unknown): PageExtras {
  if (raw === null || raw === undefined) {
    return {};
  }
  if (typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const o = raw as Record<string, unknown>;
  const out: PageExtras = {};

  if (Array.isArray(o.profileLinks)) {
    const links: ProfileLink[] = [];
    for (const item of o.profileLinks) {
      if (!item || typeof item !== "object") continue;
      const p = item as Record<string, unknown>;
      const provider = p.provider;
      const url = typeof p.url === "string" ? p.url.trim() : "";
      if (!url || !isProfileProvider(provider)) continue;
      links.push({ provider, url });
      if (links.length >= MAX_PROFILE_LINKS) break;
    }
    if (links.length) out.profileLinks = links;
  }

  if (o.waitlist && typeof o.waitlist === "object" && !Array.isArray(o.waitlist)) {
    const w = o.waitlist as Record<string, unknown>;
    const bullets = parseBullets(w.bullets);
    const trustLine = clampLine(w.trustLine);
    const urgencyLine = clampLine(w.urgencyLine);
    const statHint = clampLine(w.statHint);
    if (bullets?.length || trustLine || urgencyLine || statHint) {
      out.waitlist = {
        ...(bullets?.length ? { bullets } : {}),
        ...(trustLine ? { trustLine } : {}),
        ...(urgencyLine ? { urgencyLine } : {}),
        ...(statHint ? { statHint } : {}),
      };
    }
  }

  return out;
}

function isProfileProvider(x: unknown): x is ProfileLinkProvider {
  return (
    x === "github" ||
    x === "linkedin" ||
    x === "x" ||
    x === "youtube" ||
    x === "discord" ||
    x === "website" ||
    x === "mail"
  );
}

function parseBullets(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: string[] = [];
  for (const line of raw) {
    if (typeof line !== "string") continue;
    const t = line.trim().slice(0, MAX_BULLET_LEN);
    if (t) out.push(t);
    if (out.length >= MAX_WAITLIST_BULLETS) break;
  }
  return out.length ? out : undefined;
}

function clampLine(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const t = raw.trim().slice(0, MAX_LINE_LEN);
  return t || undefined;
}


/** Split textarea lines into bullet strings (max 4 non-empty). */
export function bulletsFromTextarea(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim().slice(0, MAX_BULLET_LEN))
    .filter(Boolean)
    .slice(0, MAX_WAITLIST_BULLETS);
}

export function textareaFromBullets(bullets: string[] | undefined): string {
  return (bullets ?? []).join("\n");
}

export function sanitizeProfileLinks(links: ProfileLink[]): ProfileLink[] {
  return links
    .map((l) => ({ provider: l.provider, url: l.url.trim() }))
    .filter((l) => Boolean(normalizeOutboundHref(l.url)))
    .slice(0, MAX_PROFILE_LINKS);
}

export function buildWaitlistPitchFromForm(fields: {
  bulletsText: string;
  statHint: string;
  trustLine: string;
  urgencyLine: string;
}): WaitlistPitchExtras | undefined {
  const bullets = bulletsFromTextarea(fields.bulletsText);
  const statHint = fields.statHint.trim() || undefined;
  const trustLine = fields.trustLine.trim() || undefined;
  const urgencyLine = fields.urgencyLine.trim() || undefined;
  if (!bullets.length && !statHint && !trustLine && !urgencyLine) {
    return undefined;
  }
  return {
    ...(bullets.length ? { bullets } : {}),
    ...(statHint ? { statHint } : {}),
    ...(trustLine ? { trustLine } : {}),
    ...(urgencyLine ? { urgencyLine } : {}),
  };
}

/** Persists merged extras; omits empty keys so JSON stays small. */
export function mergePageExtrasForSave(
  prevRaw: unknown,
  siteKind: SiteKind,
  profileLinks: ProfileLink[],
  waitlistPitch: WaitlistPitchExtras | undefined
): Record<string, unknown> {
  const prev = parsePageExtras(prevRaw);
  const next: PageExtras = { ...prev };
  if (siteKind === "personal") {
    const cleaned = sanitizeProfileLinks(profileLinks);
    if (cleaned.length) next.profileLinks = cleaned;
    else delete next.profileLinks;
  }
  if (siteKind === "waitlist") {
    if (waitlistPitch) next.waitlist = waitlistPitch;
    else delete next.waitlist;
  }
  return JSON.parse(JSON.stringify(next)) as Record<string, unknown>;
}
