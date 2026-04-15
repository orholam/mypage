import type { PublicPageRow } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getPublicPageBySlug = cache(async (slug: string): Promise<PublicPageRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_page", { p_slug: slug });
  if (error || !data?.length) return null;
  return data[0] as PublicPageRow;
});

export const getPublicPageBySubdomain = cache(async (subdomain: string): Promise<PublicPageRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_site_by_subdomain", {
    p_subdomain: subdomain,
  });
  if (error || !data?.length) return null;
  return data[0] as PublicPageRow;
});
