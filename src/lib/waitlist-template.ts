import type { SiteKind } from "@/lib/database.types";
import { cn } from "@/lib/utils";

/** Personal-page templates (IDs prefixed with `p_`). */
export const PERSONAL_TEMPLATES = [
  {
    id: "p_editorial",
    label: "Editorial",
    description: "Warm paper, calm type — good for a short bio or statement.",
    swatch: "bg-gradient-to-br from-amber-100 to-stone-100 ring-1 ring-amber-200/60",
  },
  {
    id: "p_spotlight",
    label: "Spotlight",
    description: "High-contrast dark frame — headline and one link pop.",
    swatch: "bg-zinc-900 ring-1 ring-white/15",
  },
  {
    id: "p_linktree",
    label: "Link card",
    description: "Rounded, minimal — classic link-in-bio energy.",
    swatch: "bg-white ring-1 ring-neutral-200",
  },
  {
    id: "p_studio",
    label: "Studio",
    description: "Neutral canvas with a subtle top accent.",
    swatch: "bg-neutral-100 ring-1 ring-neutral-300",
  },
  {
    id: "p_aurora",
    label: "Aurora",
    description: "Bold gradient — launches and announcements.",
    swatch: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400",
  },
  {
    id: "p_mono",
    label: "Mono",
    description: "Terminal-inspired — developers and makers.",
    swatch: "bg-zinc-900 ring-1 ring-emerald-700/50",
  },
] as const;

/** Waitlist / signup templates (legacy IDs, no prefix). */
export const WAITLIST_TEMPLATES = [
  {
    id: "basic",
    label: "Classic",
    description: "Clean white card with a clear form.",
    swatch: "bg-white ring-1 ring-neutral-200 shadow-sm",
  },
  {
    id: "modern",
    label: "Midnight",
    description: "Dark surface — email field feels premium.",
    swatch: "bg-zinc-900 ring-1 ring-zinc-700",
  },
  {
    id: "neobrutal",
    label: "Neobrutal",
    description: "Loud borders and shadow — can’t miss the signup.",
    swatch: "bg-yellow-300 ring-2 ring-black",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Almost flat — typography does the work.",
    swatch: "bg-white ring-1 ring-neutral-200",
  },
  {
    id: "modern2",
    label: "Ocean",
    description: "Blue gradient — product and SaaS launches.",
    swatch: "bg-gradient-to-br from-blue-600 to-blue-900",
  },
  {
    id: "neumorphism",
    label: "Soft UI",
    description: "Soft raised surface — friendly and approachable.",
    swatch: "bg-neutral-200 ring-1 ring-neutral-300",
  },
] as const;

const PERSONAL_PREFIX = "p_";

/** Resolves which template drives styling for a given site kind (handles legacy rows). */
export function effectiveTemplateId(kind: SiteKind, stored: string | undefined | null): string {
  const s = (stored ?? "").trim();
  if (kind === "personal") {
    if (s.startsWith(PERSONAL_PREFIX)) return s;
    return "p_editorial";
  }
  if (s.startsWith(PERSONAL_PREFIX)) return "basic";
  if (s === "") return "basic";
  return s;
}

/** Card surface for public pages and previews — branch on site kind + resolved template. */
export function pageSurfaceClass(kind: SiteKind, storedTemplateId: string | undefined | null): string {
  const id = effectiveTemplateId(kind, storedTemplateId);
  if (kind === "personal") {
    switch (id) {
      case "p_spotlight":
        return cn(
          "relative overflow-visible rounded-2xl border border-white/10 bg-zinc-950/70 text-zinc-50 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl",
          "ring-1 ring-white/[0.12] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06)]"
        );
      case "p_linktree":
        return cn(
          "relative overflow-visible rounded-[1.75rem] border border-white/60 bg-white/80 text-neutral-900 backdrop-blur-2xl",
          "shadow-[0_2px_0_rgba(0,0,0,0.04),0_28px_56px_-24px_rgba(0,0,0,0.22)] ring-1 ring-black/[0.04]"
        );
      case "p_studio":
        return cn(
          "relative overflow-visible rounded-2xl border border-white/70 bg-white/75 text-neutral-900 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)] backdrop-blur-xl",
          "ring-1 ring-neutral-200/80"
        );
      case "p_aurora":
        return cn(
          "relative overflow-visible rounded-2xl border border-white/20 bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-transparent text-white",
          "shadow-[0_25px_70px_-20px_rgba(88,28,135,0.55)] backdrop-blur-md ring-1 ring-white/25"
        );
      case "p_mono":
        return cn(
          "relative overflow-visible rounded-2xl border border-emerald-500/35 bg-zinc-950/90 font-mono text-emerald-50 shadow-[0_0_45px_-8px_rgba(16,185,129,0.35)]",
          "backdrop-blur-sm ring-1 ring-emerald-500/20 [box-shadow:inset_0_1px_0_0_rgba(16,185,129,0.12)]"
        );
      case "p_editorial":
      default:
        return cn(
          "organic-noise relative overflow-visible rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/98 to-stone-100/95 text-stone-900",
          "shadow-[0_24px_60px_-18px_rgba(120,53,15,0.18)] ring-1 ring-amber-300/40"
        );
    }
  }
  switch (id) {
    case "modern":
      return cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 text-white shadow-[0_24px_70px_-24px_rgba(0,0,0,0.55)] backdrop-blur-xl",
        "ring-1 ring-white/[0.08] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.05)]"
      );
    case "neobrutal":
      return cn(
        "relative overflow-hidden rounded-2xl border-[3px] border-black bg-gradient-to-br from-yellow-200 via-amber-200 to-yellow-300 text-black",
        "shadow-[8px_8px_0_0_#000] ring-0"
      );
    case "minimal":
      return cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/85 text-neutral-900 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.1)] backdrop-blur-xl",
        "ring-1 ring-neutral-100"
      );
    case "modern2":
      return cn(
        "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-blue-700/90 via-blue-800/85 to-slate-900/90 text-white",
        "shadow-[0_28px_70px_-20px_rgba(30,58,138,0.55)] backdrop-blur-md ring-1 ring-white/10"
      );
    case "neumorphism":
      return cn(
        "relative overflow-hidden rounded-2xl border-0 bg-neutral-200/95 text-neutral-800 shadow-[16px_16px_32px_#c4c4c4,-8px_-8px_24px_#ffffff] backdrop-blur-sm",
        "ring-1 ring-white/40"
      );
    default:
      return cn(
        "relative overflow-hidden rounded-2xl border border-white/70 bg-white/90 text-neutral-900 shadow-[0_20px_50px_-18px_rgba(79,70,229,0.15)] backdrop-blur-xl",
        "ring-1 ring-neutral-200/60"
      );
  }
}

/** Body / subtitle under headline — personal pages. */
export function personalSubheadClass(storedTemplateId: string | undefined | null): string {
  const id = effectiveTemplateId("personal", storedTemplateId);
  switch (id) {
    case "p_editorial":
      return "font-body-thin text-lg leading-relaxed tracking-wide text-stone-700/95";
    case "p_spotlight":
      return "text-base leading-relaxed text-zinc-400";
    case "p_aurora":
      return "text-base leading-relaxed text-white/85";
    case "p_mono":
      return "font-mono text-sm leading-relaxed text-emerald-400/90";
    case "p_linktree":
    case "p_studio":
    default:
      return "text-base leading-relaxed text-neutral-600/95";
  }
}

/** Headline on waitlist landing — branch on template. */
export function waitlistHeadlineClass(storedTemplateId: string | undefined | null): string {
  const id = effectiveTemplateId("waitlist", storedTemplateId);
  switch (id) {
    case "minimal":
      return "font-heading text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 sm:text-[1.9rem]";
    case "neobrutal":
      return "text-2xl font-black uppercase leading-tight tracking-tight sm:text-[1.75rem]";
    case "modern2":
    case "modern":
      return "text-2xl font-bold tracking-tight sm:text-[1.7rem] sm:leading-snug";
    default:
      return "text-2xl font-bold tracking-tight sm:text-[1.65rem] sm:leading-snug";
  }
}

export function waitlistSubheadClass(storedTemplateId: string | undefined | null): string {
  const id = effectiveTemplateId("waitlist", storedTemplateId);
  switch (id) {
    case "neobrutal":
      return "text-sm font-medium leading-relaxed text-neutral-800";
    case "modern":
    case "modern2":
      return "text-base leading-relaxed text-white/85";
    case "minimal":
      return "text-sm leading-relaxed text-neutral-600 sm:text-base";
    default:
      return "text-sm leading-relaxed text-neutral-700/95 sm:text-base";
  }
}

/** Optional ornament / top accent for personal layouts. */
export function personalTopAccentClass(storedTemplateId: string | undefined | null): string | null {
  const id = effectiveTemplateId("personal", storedTemplateId);
  switch (id) {
    case "p_studio":
      return "h-1 w-16 rounded-full bg-gradient-to-r from-neutral-400 to-neutral-600";
    case "p_editorial":
      return "h-px w-12 bg-amber-400/80";
    case "p_aurora":
      return "h-1 w-20 rounded-full bg-white/30";
    default:
      return null;
  }
}

/** Input + chrome on waitlist forms so fields match dark/light templates. */
export function waitlistFieldChrome(storedTemplateId: string | undefined | null): {
  input: string;
  footnote: string;
} {
  const id = effectiveTemplateId("waitlist", storedTemplateId);
  switch (id) {
    case "modern":
      return {
        input:
          "border-zinc-600 bg-zinc-800/90 text-white placeholder:text-zinc-500 focus-visible:border-zinc-500",
        footnote: "text-zinc-400",
      };
    case "modern2":
      return {
        input:
          "border-white/20 bg-white/10 text-white placeholder:text-blue-100/70 focus-visible:border-white/40",
        footnote: "text-blue-100/70",
      };
    case "neobrutal":
      return {
        input: "border-2 border-black bg-white text-black placeholder:text-neutral-500",
        footnote: "text-neutral-700",
      };
    case "neumorphism":
      return {
        input: "border-0 bg-neutral-100 text-neutral-900 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]",
        footnote: "text-neutral-600",
      };
    case "minimal":
      return {
        input: "border-neutral-300 bg-white",
        footnote: "text-neutral-500",
      };
    default:
      return {
        input: "border-input bg-white/95 dark:bg-card/90",
        footnote: "text-muted-foreground",
      };
  }
}

/** Heading weight / font tweaks per template (personal). */
export function personalHeadingClass(storedTemplateId: string | undefined | null): string {
  const id = effectiveTemplateId("personal", storedTemplateId);
  switch (id) {
    case "p_editorial":
      return "font-heading text-3xl tracking-tight sm:text-4xl";
    case "p_mono":
      return "font-mono text-xl font-semibold tracking-tight sm:text-2xl";
    default:
      return "text-3xl font-bold tracking-tight sm:text-4xl";
  }
}

/** Primary link button on personal pages — tuned per template. */
export function personalCtaClass(storedTemplateId: string | undefined | null): string {
  const id = effectiveTemplateId("personal", storedTemplateId);
  switch (id) {
    case "p_aurora":
      return "bg-white text-violet-800 shadow-lg shadow-black/20 hover:bg-white/95";
    case "p_spotlight":
      return "bg-white text-zinc-900 shadow-md hover:bg-zinc-100";
    case "p_mono":
      return "border border-emerald-500/60 bg-emerald-950 text-emerald-100 hover:bg-emerald-900";
    case "p_editorial":
      return "bg-stone-800 text-amber-50 hover:bg-stone-700";
    default:
      return "";
  }
}

/** Icon-only social chips on personal pages (template-aware). */
export function personalSocialChipClass(storedTemplateId: string | undefined | null): string {
  const id = effectiveTemplateId("personal", storedTemplateId);
  switch (id) {
    case "p_spotlight":
      return "border-white/15 bg-white/10 text-white hover:bg-white/15";
    case "p_aurora":
      return "border-white/25 bg-white/15 text-white hover:bg-white/25";
    case "p_mono":
      return "border-emerald-500/40 bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900/90";
    case "p_editorial":
      return "border-stone-300/80 bg-white/60 text-stone-800 hover:bg-white/90";
    case "p_linktree":
    case "p_studio":
    default:
      return "border-border/80 bg-background/50 text-foreground hover:bg-muted/80";
  }
}
