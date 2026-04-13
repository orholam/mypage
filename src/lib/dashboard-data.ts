import type { EmailTemplateRow, WaitlistPage, Workspace } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

const ACTIVE_WORKSPACE_COOKIE = "active_workspace_id";

/** Sidebar + shared dashboard context (no email templates — load those only on /dashboard/email). */
export type DashboardShellData = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  /** All pages for this workspace (usually one). */
  waitlistPages: WaitlistPage[];
  /** First page, for share link / editor defaults. */
  waitlistPage: WaitlistPage | null;
  subscriberCount: number;
};

/**
 * Dedupes within a single RSC request (layout + page). Still runs once per client navigation,
 * but avoids duplicate work when both layout and a page need the same data.
 */
export const getDashboardShellData = cache(async (): Promise<DashboardShellData | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: workspaces, error: wsError } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: true });

  if (wsError || !workspaces?.length) {
    return {
      workspaces: [],
      activeWorkspace: null,
      waitlistPages: [],
      waitlistPage: null,
      subscriberCount: 0,
    };
  }

  const list = workspaces as Workspace[];
  const jar = await cookies();
  const preferredId = jar.get(ACTIVE_WORKSPACE_COOKIE)?.value;
  const activeWorkspace =
    (preferredId ? list.find((w) => w.id === preferredId) : null) ?? list[0] ?? null;

  if (!activeWorkspace) {
    return {
      workspaces: list,
      activeWorkspace: null,
      waitlistPages: [],
      waitlistPage: null,
      subscriberCount: 0,
    };
  }

  const { data: pages } = await supabase
    .from("waitlist_pages")
    .select("*")
    .eq("workspace_id", activeWorkspace.id)
    .order("created_at", { ascending: true });

  const waitlistPages = (pages ?? []) as WaitlistPage[];
  const waitlistPage = waitlistPages[0] ?? null;
  const pageIds = waitlistPages.map((p) => p.id);

  let subscriberCount = 0;
  if (pageIds.length > 0) {
    const { count } = await supabase
      .from("waitlist_submissions")
      .select("*", { count: "exact", head: true })
      .in("page_id", pageIds);
    subscriberCount = count ?? 0;
  }

  return {
    workspaces: list,
    activeWorkspace,
    waitlistPages,
    waitlistPage,
    subscriberCount,
  };
});

export const getEmailTemplatesForWorkspace = cache(async (workspaceId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("email_templates").select("*").eq("workspace_id", workspaceId);
  return (data ?? []) as EmailTemplateRow[];
});
