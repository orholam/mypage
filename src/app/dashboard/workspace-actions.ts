"use server";

import type { SiteKind } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";
import { isValidSubdomain, normalizeSubdomain } from "@/lib/host";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const ACTIVE_WORKSPACE_COOKIE = "active_workspace_id";

export async function selectWorkspace(workspaceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data } = await supabase
    .from("workspaces")
    .select("id")
    .eq("id", workspaceId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!data) {
    return { error: "Workspace not found" };
  }

  const jar = await cookies();
  jar.set(ACTIVE_WORKSPACE_COOKIE, workspaceId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
    httpOnly: true,
  });

  revalidatePath("/dashboard", "layout");
  return { ok: true as const };
}

export async function createWorkspace(
  rawName?: string,
  siteKind: SiteKind = "waitlist",
  rawSubdomain?: string
) {
  const defaultName = siteKind === "personal" ? "My page" : "New waitlist";
  const name = (rawName ?? defaultName).trim() || defaultName;

  const subdomain = normalizeSubdomain(rawSubdomain ?? "");
  if (!isValidSubdomain(subdomain)) {
    return {
      error:
        "Choose a subdomain of 2–63 characters (letters, numbers, hyphens), not a reserved name like www or app.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: ws, error: wsError } = await supabase
    .from("workspaces")
    .insert({
      owner_id: user.id,
      name,
      plan_label: "Lifetime",
      subscriber_cap: 5000,
      site_kind: siteKind,
      subdomain,
    })
    .select("id")
    .single();

  if (wsError || !ws) {
    if (String(wsError?.code) === "23505" || /duplicate|unique/i.test(wsError?.message ?? "")) {
      return { error: "That subdomain is already taken. Try another." };
    }
    return { error: wsError?.message ?? "Could not create workspace" };
  }

  const pagePayload =
    siteKind === "personal"
      ? {
          workspace_id: ws.id,
          slug: subdomain,
          template_id: "minimal",
          headline: "Your name",
          subheadline: "A short bio or tagline.",
          cta_label: "Get in touch",
          cta_url: "",
          published: true,
        }
      : {
          workspace_id: ws.id,
          slug: subdomain,
          template_id: "basic",
          headline: "Create waitlist in 30 Sec",
          subheadline: "Experience the Power Now!",
          cta_label: "Join the Waitlist",
          cta_url: "",
          published: true,
        };

  const { error: pageError } = await supabase.from("waitlist_pages").insert(pagePayload);

  if (pageError) {
    return { error: pageError.message };
  }

  const { error: tplError } = await supabase.from("email_templates").insert([
    {
      workspace_id: ws.id,
      kind: "welcome",
      subject: "Welcome Here !!",
      header_text: "Welcome to LaunchPage!",
      body_greeting: "Hey User!",
      cta_label: "Access Your Account",
      cta_url: "https://example.com",
    },
    {
      workspace_id: ws.id,
      kind: "launch",
      subject: "We are live!",
      header_text: "Launch day!",
      body_greeting: "Hey there!",
      cta_label: "See what's new",
      cta_url: "https://example.com",
    },
  ]);

  if (tplError) {
    return { error: tplError.message };
  }

  const jar = await cookies();
  jar.set(ACTIVE_WORKSPACE_COOKIE, ws.id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
    httpOnly: true,
  });

  revalidatePath("/dashboard", "layout");
  return { ok: true as const, id: ws.id };
}

export async function renameWorkspace(workspaceId: string, rawName: string) {
  const name = rawName.trim();
  if (!name) {
    return { error: "Name is required" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("workspaces")
    .update({ name })
    .eq("id", workspaceId)
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true as const };
}

/**
 * Changes public tenant URL. Keeps the primary (oldest) waitlist page slug in sync for /w/[slug].
 */
export async function updateWorkspaceSubdomain(workspaceId: string, rawSubdomain: string) {
  const sub = normalizeSubdomain(rawSubdomain);
  if (!isValidSubdomain(sub)) {
    return {
      error:
        "Choose a subdomain of 2–63 characters (letters, numbers, hyphens), not a reserved name like www or app.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: ws, error: fetchError } = await supabase
    .from("workspaces")
    .select("id, subdomain")
    .eq("id", workspaceId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (fetchError || !ws) {
    return { error: "Workspace not found" };
  }

  if (ws.subdomain === sub) {
    return { ok: true as const };
  }

  const previousSub = ws.subdomain;

  const { error: wsError } = await supabase
    .from("workspaces")
    .update({ subdomain: sub })
    .eq("id", workspaceId)
    .eq("owner_id", user.id);

  if (wsError) {
    if (String(wsError.code) === "23505" || /duplicate|unique/i.test(wsError.message ?? "")) {
      return { error: "That subdomain is already taken. Try another." };
    }
    return { error: wsError.message };
  }

  const { data: primaryPage } = await supabase
    .from("waitlist_pages")
    .select("id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (primaryPage) {
    const { error: pageError } = await supabase
      .from("waitlist_pages")
      .update({ slug: sub })
      .eq("id", primaryPage.id);

    if (pageError) {
      await supabase
        .from("workspaces")
        .update({ subdomain: previousSub })
        .eq("id", workspaceId)
        .eq("owner_id", user.id);

      if (String(pageError.code) === "23505" || /duplicate|unique/i.test(pageError.message ?? "")) {
        return {
          error:
            "That subdomain is already in use as a page URL. Pick a different subdomain.",
        };
      }
      return { error: pageError.message };
    }
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true as const };
}
