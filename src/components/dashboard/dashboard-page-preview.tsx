import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteKind, WaitlistPage } from "@/lib/database.types";
import { normalizeOutboundHref } from "@/lib/href";
import { parsePageExtras } from "@/lib/page-extras";
import { PublicPageAmbient } from "@/components/waitlist/public-page-ambient";
import { ProfileLinksStrip } from "@/components/waitlist/profile-links-strip";
import { PersonalPortfolioGrid } from "@/components/waitlist/personal-portfolio-grid";
import { TemplatePageMark } from "@/components/waitlist/template-page-mark";
import { WaitlistPitchBulletsList, WaitlistPitchPillsRow } from "@/components/waitlist/waitlist-pitch-blocks";
import {
  pageSurfaceClass,
  personalCtaClass,
  personalHeadingClass,
  personalSubheadClass,
  personalTopAccentClass,
  waitlistFieldChrome,
  waitlistHeadlineClass,
  waitlistSubheadClass,
} from "@/lib/waitlist-template";
import { ExternalLink, Mail } from "lucide-react";
import Link from "next/link";

type DashboardPagePreviewProps = {
  page: WaitlistPage | null;
  siteKind: SiteKind;
  /** Path-only URL e.g. `/w/slug` for “View live”. */
  liveHref?: string;
};

export function DashboardPagePreview({ page, siteKind, liveHref }: DashboardPagePreviewProps) {
  if (!page) {
    return (
      <div className="bg-muted flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-warm p-8 text-center md:p-12">
        <p className="font-body-thin text-muted-foreground max-w-sm text-base leading-relaxed">
          Empty stage, loud imagination. Page editor → template → suddenly you’re a “founder” on Twitter.
        </p>
        <Link href="/dashboard/editor" prefetch={false} className={cn(buttonVariants(), "mt-6")}>
          Set up my page
        </Link>
      </div>
    );
  }

  const extras = parsePageExtras(page.extras);
  const card = pageSurfaceClass(siteKind, page.template_id);
  const headline = page.headline?.trim() || "Headline";
  const sub = page.subheadline?.trim() || "Subheadline";
  const cta = page.cta_label?.trim() || (siteKind === "waitlist" ? "Join the waitlist" : "");
  const outbound = normalizeOutboundHref(page.cta_url ?? "");
  const showPersonalCta = siteKind === "personal" && Boolean(cta && outbound);
  const accent = siteKind === "personal" ? personalTopAccentClass(page.template_id) : null;
  const headingClass = siteKind === "personal" ? personalHeadingClass(page.template_id) : "";
  const personalSubClass = siteKind === "personal" ? personalSubheadClass(page.template_id) : "";
  const waitlistHead = siteKind === "waitlist" ? waitlistHeadlineClass(page.template_id) : "";
  const waitlistSub = siteKind === "waitlist" ? waitlistSubheadClass(page.template_id) : "";
  const personalBtn = siteKind === "personal" ? personalCtaClass(page.template_id) : "";
  const waitlistChrome = siteKind === "waitlist" ? waitlistFieldChrome(page.template_id) : null;
  const profileLinks = extras.profileLinks ?? [];

  return (
    <div className="border-border relative overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      {liveHref ? (
        <div className="absolute right-3 top-3 z-20 sm:right-4 sm:top-4">
          <Link
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "gap-1.5 border-2 border-border bg-card shadow-sm"
            )}
          >
            Peek live
            <ExternalLink className="text-muted-foreground size-3.5" aria-hidden />
          </Link>
        </div>
      ) : null}
      <div className="relative min-h-[400px] overflow-hidden sm:min-h-[440px]">
        <PublicPageAmbient kind={siteKind} templateId={page.template_id} />
        <div className="relative z-[1] flex min-h-[400px] items-center justify-center p-6 sm:min-h-[440px] sm:p-10">
        <section aria-label="Read-only preview of your public page" className="pointer-events-none w-full max-w-md select-none">
          <div className={cn("w-full p-8 sm:p-10", card)}>
            <div className="mb-6 flex flex-col items-center gap-4">
              {accent ? <div className={accent} aria-hidden /> : null}
              <TemplatePageMark kind={siteKind} templateId={page.template_id} />
            </div>
            <h2
              className={cn(
                "text-center leading-tight",
                siteKind === "personal" ? headingClass : waitlistHead
              )}
            >
              {headline}
            </h2>

            {siteKind === "waitlist" ? (
              <WaitlistPitchPillsRow pitch={extras.waitlist} templateId={page.template_id} className="mt-4" />
            ) : null}

            <p
              className={cn(
                "mt-3 text-center",
                siteKind === "personal" ? personalSubClass : waitlistSub
              )}
            >
              {sub}
            </p>

            {siteKind === "personal" ? (
              <>
                <ProfileLinksStrip links={profileLinks} templateId={page.template_id} className="mt-6" />
                <PersonalPortfolioGrid
                  images={extras.portfolioImages ?? []}
                  templateId={page.template_id}
                  headlineForAlt={headline}
                  interactive={false}
                />
              </>
            ) : (
              <WaitlistPitchBulletsList pitch={extras.waitlist} templateId={page.template_id} className="mt-5" />
            )}

            {siteKind === "personal" ? (
              <div className="mt-8 flex justify-center">
                {showPersonalCta ? (
                  <span
                    className={cn(
                      "inline-flex rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm",
                      personalBtn || "bg-primary text-primary-foreground"
                    )}
                  >
                    {cta}
                  </span>
                ) : (
                  <span className="text-muted-foreground max-w-[28ch] text-center text-xs leading-relaxed">
                    Add a primary button or social links in the editor.
                  </span>
                )}
              </div>
            ) : (
              <>
                <div className="mt-8 space-y-3">
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 opacity-45"
                      aria-hidden
                    />
                    <div
                      className={cn(
                        "text-muted-foreground flex h-12 w-full items-center rounded-xl border-2 px-4 pl-11 text-sm",
                        waitlistChrome?.input
                      )}
                    >
                      you@example.com
                    </div>
                  </div>
                  <div className="bg-primary text-primary-foreground flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold">
                    {cta}
                  </div>
                </div>
                <p className={cn("mt-5 text-center text-[11px]", waitlistChrome?.footnote)}>
                  We’ll only use your email for updates about this list.
                </p>
              </>
            )}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
