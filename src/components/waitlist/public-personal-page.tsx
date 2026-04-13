"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PublicPageRow } from "@/lib/database.types";
import { ProfileLinksStrip } from "@/components/waitlist/profile-links-strip";
import { PublicPageShell } from "@/components/waitlist/public-page-ambient";
import { normalizeOutboundHref } from "@/lib/href";
import { parsePageExtras } from "@/lib/page-extras";
import { TemplatePageMark } from "@/components/waitlist/template-page-mark";
import {
  pageSurfaceClass,
  personalCtaClass,
  personalHeadingClass,
  personalSubheadClass,
  personalTopAccentClass,
} from "@/lib/waitlist-template";
import Link from "next/link";

export function PublicPersonalPage({ page }: { page: PublicPageRow }) {
  const tid = page.template_id;
  const card = pageSurfaceClass("personal", tid);
  const href = normalizeOutboundHref(page.cta_url ?? "");
  const showCta = Boolean(page.cta_label?.trim() && href);
  const accent = personalTopAccentClass(tid);
  const headingClass = personalHeadingClass(tid);
  const subClass = personalSubheadClass(tid);
  const ctaExtra = personalCtaClass(tid);
  const profileLinks = parsePageExtras(page.extras).profileLinks ?? [];
  const isMail = href.startsWith("mailto:");

  return (
    <PublicPageShell kind="personal" templateId={tid}>
      <div className={cn("w-full max-w-md p-8 sm:p-10", card)}>
        <div className="mb-6 flex flex-col items-center gap-4">
          {accent ? <div className={accent} aria-hidden /> : null}
          <TemplatePageMark kind="personal" templateId={tid} />
        </div>
        <h1 className={cn("text-center leading-tight", headingClass)}>{page.headline}</h1>
        <p className={cn("mt-4 text-center", subClass)}>{page.subheadline}</p>

        <ProfileLinksStrip links={profileLinks} templateId={tid} className="mt-8" />

        {showCta ? (
          <div className="mt-8 flex justify-center sm:mt-10">
            <Link
              href={href}
              {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-w-[200px] px-8 shadow-sm",
                ctaExtra
              )}
            >
              {page.cta_label}
            </Link>
          </div>
        ) : null}
      </div>
    </PublicPageShell>
  );
}
