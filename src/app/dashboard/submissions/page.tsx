import { getDashboardShellData } from "@/lib/dashboard-data";
import { publicSiteHostLabel } from "@/lib/host";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Submissions",
};

export default async function SubmissionsPage() {
  const shell = await getDashboardShellData();
  if (!shell?.activeWorkspace) {
    redirect("/login");
  }

  const pageIds = shell.waitlistPages.map((p) => p.id);
  const sub = shell.activeWorkspace?.subdomain;

  const publicHostLabel = sub ? publicSiteHostLabel(sub) : null;

  const supabase = await createClient();
  const { data: rows } =
    pageIds.length > 0
      ? await supabase
          .from("waitlist_submissions")
          .select("id, email, created_at, page_id")
          .in("page_id", pageIds)
          .order("created_at", { ascending: false })
      : { data: [] as { id: string; email: string; created_at: string; page_id: string }[] };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <header className="shrink-0 border-b border-border bg-card px-6 py-5">
        <h1 className="font-display text-xl font-extrabold tracking-tight">Submissions</h1>
        <p className="text-muted-foreground mt-1 text-sm">Emails captured on your public waitlist page.</p>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Page</th>
              <th className="p-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r) => (
              <tr key={r.id} className="border-b border-border">
                <td className="p-3">{r.email}</td>
                <td className="p-3 text-muted-foreground">
                  <code className="rounded bg-muted px-1 text-xs">
                    {publicHostLabel ?? "—"}
                  </code>
                </td>
                <td className="p-3 text-muted-foreground">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {!rows?.length ? (
              <tr>
                <td colSpan={3} className="text-muted-foreground p-6 text-center text-sm leading-relaxed">
                  No submissions yet. Open the{" "}
                  <Link
                    href="/dashboard/editor"
                    className="text-primary font-medium underline-offset-4 hover:underline"
                  >
                    Page editor
                  </Link>{" "}
                  and use <span className="text-foreground font-medium">Share</span> to copy your public link.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
