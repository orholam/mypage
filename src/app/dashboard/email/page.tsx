import { EmailSettingsForm } from "@/components/dashboard/email-settings-form";
import { getDashboardShellData, getEmailTemplatesForWorkspace } from "@/lib/dashboard-data";
import { redirect } from "next/navigation";

export default async function DashboardEmailPage() {
  const shell = await getDashboardShellData();
  if (!shell) {
    redirect("/login");
  }
  if (!shell.activeWorkspace) {
    return (
      <div className="flex min-h-screen flex-1 flex-col bg-background p-8">
        <h1 className="font-display text-xl font-extrabold tracking-tight">Set up Email</h1>
        <p className="text-muted-foreground mt-2 max-w-lg text-sm">
          No workspace found for your account. Run{" "}
          <code className="rounded bg-muted px-1">supabase/migrations/001_init.sql</code> in the Supabase SQL editor
          so the signup trigger can create your workspace, then sign up again (or insert a row manually).
        </p>
      </div>
    );
  }

  const templates = await getEmailTemplatesForWorkspace(shell.activeWorkspace.id);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-5">
        <h1 className="font-display text-xl font-extrabold tracking-tight">Set up Email</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Set up your welcome and notification emails here
        </p>
      </header>
      <div className="flex-1 p-6">
        <EmailSettingsForm workspaceId={shell.activeWorkspace.id} templates={templates} />
      </div>
    </div>
  );
}
