import { PublicPersonalPage } from "@/components/waitlist/public-personal-page";
import { PublicWaitlistForm } from "@/components/waitlist/public-waitlist-form";
import { publicCanonicalUrlForSubdomain } from "@/lib/host";
import { getPublicPageBySubdomain } from "@/lib/public-page";
import { seoDescription, seoTitle } from "@/lib/seo-text";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const row = await getPublicPageBySubdomain(subdomain);
  if (!row) return {};

  const title = seoTitle(row.headline);
  const description = seoDescription(row.subheadline);
  const canonical = publicCanonicalUrlForSubdomain(subdomain);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PublicSiteBySubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const row = await getPublicPageBySubdomain(subdomain);

  if (!row) {
    notFound();
  }

  if (row.site_kind === "personal") {
    return <PublicPersonalPage page={row} />;
  }

  return <PublicWaitlistForm page={row} />;
}
