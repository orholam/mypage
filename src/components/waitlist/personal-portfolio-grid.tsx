"use client";

import { cn } from "@/lib/utils";
import { portfolioPublicUrl } from "@/lib/portfolio-storage";
import type { PortfolioImage } from "@/lib/page-extras";

type PersonalPortfolioGridProps = {
  images: PortfolioImage[];
  templateId: string;
  /** Accessible label for the section (e.g. visitor name). */
  headlineForAlt: string;
  className?: string;
  /** When false, images are not links (e.g. dashboard preview with pointer-events off). */
  interactive?: boolean;
  /**
   * `public` — bleed past the card with stronger breakout (live personal page).
   * `preview` — slightly softer margins for editor / embedded previews (scroll parents may clip).
   */
  layout?: "public" | "preview";
};

const POP_RADIUS: string[] = [
  "rounded-[1.35rem]",
  "rounded-[1.85rem_1.15rem_1.65rem_1.4rem]",
  "rounded-[1.5rem_2rem_1.25rem_1.75rem]",
  "rounded-[2rem_1.2rem_1.8rem_1.35rem]",
];

const POP_TILT: { rotate: string; y: string }[] = [
  { rotate: "-rotate-[2.25deg]", y: "translate-y-1" },
  { rotate: "rotate-[1.75deg]", y: "-translate-y-2" },
  { rotate: "rotate-[2deg]", y: "translate-y-2.5" },
  { rotate: "-rotate-[1.5deg]", y: "-translate-y-1" },
];

function tileChrome(templateId: string): string {
  switch (templateId) {
    case "p_spotlight":
    case "p_mono":
      return cn(
        "border border-white/25 bg-zinc-900/40",
        "shadow-[0_28px_70px_-14px_rgba(0,0,0,0.82),0_12px_36px_-12px_rgba(0,0,0,0.55)]",
        "ring-2 ring-white/[0.14]"
      );
    case "p_aurora":
      return cn(
        "border border-white/35 bg-white/[0.12]",
        "shadow-[0_32px_80px_-18px_rgba(88,28,135,0.55),0_14px_40px_-16px_rgba(0,0,0,0.35)]",
        "ring-2 ring-white/30"
      );
    case "p_linktree":
    case "p_studio":
      return cn(
        "border border-neutral-900/12 bg-white/95",
        "shadow-[0_28px_64px_-16px_rgba(15,23,42,0.28),0_10px_28px_-12px_rgba(15,23,42,0.18)]",
        "ring-2 ring-black/[0.06]"
      );
    case "p_editorial":
    default:
      return cn(
        "border border-amber-900/15 bg-[linear-gradient(145deg,rgba(255,253,248,0.98),rgba(245,240,232,0.92))]",
        "shadow-[0_30px_70px_-18px_rgba(120,53,15,0.28),0_12px_32px_-14px_rgba(90,45,12,0.2)]",
        "ring-2 ring-amber-800/12"
      );
  }
}

export function PersonalPortfolioGrid({
  images,
  templateId,
  headlineForAlt,
  className,
  interactive = true,
  layout = "public",
}: PersonalPortfolioGridProps) {
  if (!images.length) return null;

  const breakout =
    layout === "preview"
      ? cn(
          "relative z-20 isolate -mx-6 w-[calc(100%+3rem)] max-w-none sm:-mx-8 sm:w-[calc(100%+4rem)]",
          "py-2 sm:py-3"
        )
      : cn(
          "relative z-20 isolate -mx-10 w-[calc(100%+5rem)] max-w-none sm:-mx-14 sm:w-[calc(100%+7rem)]",
          "py-3 sm:py-5"
        );

  const hoverPop = interactive
    ? "transition-[transform,box-shadow] duration-300 ease-out hover:z-30 hover:scale-[1.06] hover:rotate-0 hover:translate-y-0 hover:shadow-[0_36px_90px_-20px_rgba(0,0,0,0.45)]"
    : "";

  return (
    <div className={cn(breakout, className)}>
      <ul
        className="grid grid-cols-2 gap-3 sm:gap-3.5"
        aria-label={`${headlineForAlt} — work samples`}
      >
        {images.map((img, i) => {
          const r = POP_RADIUS[i % POP_RADIUS.length]!;
          const tilt = POP_TILT[i % POP_TILT.length]!;
          const chrome = tileChrome(templateId);
          const frame = cn(
            "group relative block overflow-hidden will-change-transform",
            r,
            chrome,
            tilt.rotate,
            tilt.y,
            hoverPop
          );

          const imgCls =
            "block w-full h-auto max-h-[min(72vw,340px)] sm:max-h-[380px] [max-width:100%]";

          return (
            <li key={img.path} className="min-w-0 self-start">
              {interactive ? (
                <a
                  href={portfolioPublicUrl(img.path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={frame}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- public Supabase URLs vary per deploy */}
                  <img
                    src={portfolioPublicUrl(img.path)}
                    alt=""
                    className={imgCls}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="sr-only">
                    {headlineForAlt} — image {i + 1} of {images.length}, opens full size
                  </span>
                </a>
              ) : (
                <div className={frame}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- public Supabase URLs vary per deploy */}
                  <img
                    src={portfolioPublicUrl(img.path)}
                    alt=""
                    className={imgCls}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
