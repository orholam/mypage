import { PublicPersonalPage } from "@/components/waitlist/public-personal-page";
import { PublicWaitlistForm } from "@/components/waitlist/public-waitlist-form";
import { getPublicPageBySlug } from "@/lib/public-page";
import { seoDescription, seoTitle } from "@/lib/seo-text";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await getPublicPageBySlug(slug);
  if (!row) return {};

  const title = seoTitle(row.headline);
  const description = seoDescription(row.subheadline);
  const canonical = new URL(`/w/${slug}`, getSiteUrl()).toString();

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

export default async function PublicWaitlistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = await getPublicPageBySlug(slug);

  if (!row) {
    notFound();
  }

  if (row.site_kind === "personal") {
    return <PublicPersonalPage page={row} />;
  }

  return <PublicWaitlistForm page={row} />;
}
