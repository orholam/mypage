import type { PublicPageRow } from "@/lib/database.types";
import { PublicPersonalPage } from "@/components/waitlist/public-personal-page";
import { PublicWaitlistForm } from "@/components/waitlist/public-waitlist-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function PublicSiteBySubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_site_by_subdomain", {
    p_subdomain: subdomain,
  });

  if (error || !data?.length) {
    notFound();
  }

  const row = data[0] as PublicPageRow;

  if (row.site_kind === "personal") {
    return <PublicPersonalPage page={row} />;
  }

  return <PublicWaitlistForm page={row} />;
}
