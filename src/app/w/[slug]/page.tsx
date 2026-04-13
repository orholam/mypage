import type { PublicPageRow } from "@/lib/database.types";
import { PublicPersonalPage } from "@/components/waitlist/public-personal-page";
import { PublicWaitlistForm } from "@/components/waitlist/public-waitlist-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function PublicWaitlistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_page", { p_slug: slug });

  if (error || !data?.length) {
    notFound();
  }

  const row = data[0] as PublicPageRow;

  if (row.site_kind === "personal") {
    return <PublicPersonalPage page={row} />;
  }

  return <PublicWaitlistForm page={row} />;
}
