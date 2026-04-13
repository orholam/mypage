import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteKind, WaitlistPage } from "@/lib/database.types";
import { normalizeOutboundHref } from "@/lib/href";
import { waitlistTemplateCardClass } from "@/lib/waitlist-template";
import { ExternalLink } from "lucide-react";
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

  const card = waitlistTemplateCardClass(page.template_id);
  const headline = page.headline?.trim() || "Headline";
  const sub = page.subheadline?.trim() || "Subheadline";
  const cta = page.cta_label?.trim() || (siteKind === "waitlist" ? "Join the waitlist" : "");
  const outbound = normalizeOutboundHref(page.cta_url ?? "");
  const showPersonalCta = siteKind === "personal" && Boolean(cta && outbound);

  return (
    <div className="border-border relative overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      {liveHref ? (
        <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
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
      <div className="bg-preview-canvas flex min-h-[400px] items-center justify-center p-6 sm:min-h-[440px] sm:p-10">
        <section aria-label="Read-only preview of your public page" className="pointer-events-none w-full max-w-md select-none">
          <div
            className={cn(
              "w-full rounded-2xl border shadow-sm",
              card,
              siteKind === "personal" ? "p-8 sm:p-10" : "p-8"
            )}
          >
            <div className="mb-4 flex justify-center sm:mb-6">
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full text-lg font-medium sm:size-12 sm:text-xl">
                ✦
              </div>
            </div>
            <h2
              className={cn(
                "text-center font-bold tracking-tight",
                siteKind === "personal" ? "text-2xl sm:text-3xl" : "text-2xl"
              )}
            >
              {headline}
            </h2>
            <p
              className={cn(
                "mt-2 text-center text-muted-foreground",
                siteKind === "personal" ? "text-base leading-relaxed" : "text-sm"
              )}
            >
              {sub}
            </p>
            {siteKind === "personal" ? (
              <div className="mt-6 flex justify-center sm:mt-8">
                {showPersonalCta ? (
                  <span className="bg-primary text-primary-foreground inline-flex rounded-lg px-6 py-2.5 text-sm font-medium shadow-sm">
                    {cta}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-center text-xs">Add a button label and link in the editor.</span>
                )}
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-3">
                  <div className="border-input bg-card text-muted-foreground flex h-11 w-full items-center rounded-xl border-2 px-4 text-sm">
                    Email address
                  </div>
                  <div className="bg-primary text-primary-foreground flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold">
                    {cta}
                  </div>
                </div>
                <p className="text-muted-foreground mt-4 text-center text-[10px]">
                  By joining you agree to our terms and privacy policy.
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
