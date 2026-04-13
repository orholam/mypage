"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PublicPageRow } from "@/lib/database.types";
import { normalizeOutboundHref } from "@/lib/href";
import { waitlistTemplateCardClass } from "@/lib/waitlist-template";
import Link from "next/link";

export function PublicPersonalPage({ page }: { page: PublicPageRow }) {
  const card = waitlistTemplateCardClass(page.template_id);
  const href = normalizeOutboundHref(page.cta_url ?? "");
  const showCta = Boolean(page.cta_label?.trim() && href);

  return (
    <div className="bg-preview-canvas flex min-h-screen items-center justify-center p-6">
      <div className={cn("w-full max-w-md rounded-2xl border p-10 shadow-sm", card)}>
        <div className="mb-6 flex justify-center">
          <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full text-xl font-medium">
            ✦
          </div>
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight">{page.headline}</h1>
        <p className="mt-3 text-center text-base leading-relaxed opacity-85">{page.subheadline}</p>
        {showCta ? (
          <div className="mt-8 flex justify-center">
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-8 shadow-sm shadow-primary/15"
              )}
            >
              {page.cta_label}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
