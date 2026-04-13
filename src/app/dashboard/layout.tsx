import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardShellData } from "@/lib/dashboard-data";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shell = await getDashboardShellData();
  if (!shell) {
    redirect("/login");
  }

  return <DashboardShell shell={shell}>{children}</DashboardShell>;
}
