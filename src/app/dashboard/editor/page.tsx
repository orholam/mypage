import { WaitlistPageEditor } from "@/components/dashboard/waitlist-page-editor";
import { getDashboardShellData } from "@/lib/dashboard-data";
import type { SiteKind, WaitlistPage } from "@/lib/database.types";
import { redirect } from "next/navigation";

export default async function DashboardEditorPage() {
  const shell = await getDashboardShellData();
  if (!shell) {
    redirect("/login");
  }

  const initialPage = shell.waitlistPage as WaitlistPage | null;
  const siteKind: SiteKind = shell.activeWorkspace?.site_kind ?? "waitlist";
  const subdomain = shell.activeWorkspace?.subdomain;

  return (
    <WaitlistPageEditor
      initialPage={initialPage}
      siteKind={siteKind}
      subdomain={subdomain}
    />
  );
}
