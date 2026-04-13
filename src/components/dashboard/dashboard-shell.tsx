import type { DashboardShellData } from "@/lib/dashboard-data";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardShell({
  shell,
  children,
}: {
  shell: DashboardShellData;
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex h-dvh max-h-dvh min-h-0 w-full overflow-hidden bg-background">
      <DashboardSidebar shell={shell} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
