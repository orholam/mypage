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
    <div className="relative z-10 flex min-h-dvh w-full items-stretch bg-background">
      <DashboardSidebar shell={shell} />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
