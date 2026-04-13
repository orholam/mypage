"use client";

import { PROFILE_PROVIDER_LABEL, SocialBrandGlyph } from "@/components/icons/social-brand-icons";
import { normalizeOutboundHref } from "@/lib/href";
import type { ProfileLink } from "@/lib/page-extras";
import { personalSocialChipClass } from "@/lib/waitlist-template";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ProfileLinksStrip({
  links,
  templateId,
  className,
}: {
  links: ProfileLink[];
  templateId: string | undefined | null;
  className?: string;
}) {
  const chip = personalSocialChipClass(templateId);
  const valid = links
    .map((l) => ({ ...l, href: normalizeOutboundHref(l.url) }))
    .filter((l) => Boolean(l.href));

  if (valid.length === 0) return null;

  return (
    <nav aria-label="Social and links" className={cn("flex flex-wrap justify-center gap-2.5", className)}>
      {valid.map((l, i) => {
        const mail = l.href.startsWith("mailto:");
        const className = cn(
          "inline-flex size-11 items-center justify-center rounded-xl border text-[1.05rem] transition-colors",
          chip
        );
        const inner = (
          <>
            <span className="sr-only">{PROFILE_PROVIDER_LABEL[l.provider]}</span>
            <SocialBrandGlyph provider={l.provider} size={22} />
          </>
        );
        return mail ? (
          <a key={`${l.provider}-${i}`} href={l.href} className={className}>
            {inner}
          </a>
        ) : (
          <Link key={`${l.provider}-${i}`} href={l.href} target="_blank" rel="noopener noreferrer" className={className}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
