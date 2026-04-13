import { DashboardPagePreview } from "@/components/dashboard/dashboard-page-preview";
import { DashboardSiteSettings } from "@/components/dashboard/dashboard-site-settings";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardShellData } from "@/lib/dashboard-data";
import type { SiteKind } from "@/lib/database.types";
import { publicSiteAbsoluteUrl } from "@/lib/host";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardHomePage() {
  const shell = await getDashboardShellData();
  const page = shell?.waitlistPage ?? null;
  const siteKind: SiteKind = shell?.activeWorkspace?.site_kind ?? "waitlist";
  const ws = shell?.activeWorkspace;
  const liveHref = ws?.subdomain ? publicSiteAbsoluteUrl(ws.subdomain) ?? undefined : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-card px-3 sm:px-5">
        <h1 className="font-display text-lg font-extrabold tracking-tight">Your dashboard</h1>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto px-3 py-5 sm:px-5 sm:py-6 lg:py-8">
        {ws ? (
          <DashboardSiteSettings
            key={ws.id}
            workspaceId={ws.id}
            initialName={ws.name}
            initialSubdomain={ws.subdomain ?? ""}
          />
        ) : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-extrabold text-foreground">Visitor goggles on</h2>
            <p className="font-body-thin text-muted-foreground mt-1 text-sm leading-relaxed md:text-base">
              This is the {siteKind === "personal" ? "personal page" : "waitlist"} people actually see. Mess with copy in
              the editor whenever the muse strikes (or the typo appears).
            </p>
          </div>
          <Link
            href="/dashboard/editor"
            prefetch={false}
            className={cn(buttonVariants({ size: "sm" }), "shrink-0 shadow-sm")}
          >
            Edit my page
          </Link>
        </div>
        <DashboardPagePreview page={page} siteKind={siteKind} liveHref={liveHref} />
      </div>
    </div>
  );
}
