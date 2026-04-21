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
};

export function PersonalPortfolioGrid({
  images,
  templateId,
  headlineForAlt,
  className,
  interactive = true,
}: PersonalPortfolioGridProps) {
  if (!images.length) return null;

  const mutedFrame =
    templateId === "noir"
      ? "border-white/15 bg-black/25"
      : templateId === "paper"
        ? "border-stone-300/80 bg-stone-100/40"
        : "border-border/80 bg-muted/30";

  const tileClass = cn("block overflow-hidden rounded-xl border shadow-sm", mutedFrame);

  return (
    <ul
      className={cn("mt-8 grid grid-cols-2 gap-2.5 sm:gap-3", className)}
      aria-label={`${headlineForAlt} — work samples`}
    >
      {images.map((img, i) => (
        <li key={img.path} className="min-w-0">
          {interactive ? (
            <a
              href={portfolioPublicUrl(img.path)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("group", tileClass)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- public Supabase URLs vary per deploy */}
              <img
                src={portfolioPublicUrl(img.path)}
                alt=""
                className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
              />
              <span className="sr-only">
                {headlineForAlt} — image {i + 1} of {images.length}, opens full size
              </span>
            </a>
          ) : (
            <div className={cn("group", tileClass)}>
              {/* eslint-disable-next-line @next/next/no-img-element -- public Supabase URLs vary per deploy */}
              <img
                src={portfolioPublicUrl(img.path)}
                alt=""
                className="aspect-square w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
