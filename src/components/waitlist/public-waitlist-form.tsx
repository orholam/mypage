"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PublicPageRow } from "@/lib/database.types";
import { PublicPageShell } from "@/components/waitlist/public-page-ambient";
import { TemplatePageMark } from "@/components/waitlist/template-page-mark";
import { parsePageExtras } from "@/lib/page-extras";
import {
  pageSurfaceClass,
  waitlistFieldChrome,
  waitlistHeadlineClass,
  waitlistSubheadClass,
} from "@/lib/waitlist-template";
import { WaitlistPitchBulletsList, WaitlistPitchPillsRow } from "@/components/waitlist/waitlist-pitch-blocks";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { useState } from "react";

export function PublicWaitlistForm({ page }: { page: PublicPageRow }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const pitch = parsePageExtras(page.extras).waitlist;
  const tid = page.template_id;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.from("waitlist_submissions").insert({
      page_id: page.id,
      email: email.trim().toLowerCase(),
    });
    if (error) {
      setStatus("err");
      setMessage(error.message);
      return;
    }
    setStatus("ok");
    setMessage("You’re on the list. We’ll be in touch.");
    setEmail("");
  }

  const card = pageSurfaceClass("waitlist", tid);
  const chrome = waitlistFieldChrome(tid);
  const h1Class = waitlistHeadlineClass(tid);
  const subClass = waitlistSubheadClass(tid);

  return (
    <PublicPageShell kind="waitlist" templateId={tid}>
      <form onSubmit={onSubmit} className={cn("w-full max-w-md rounded-2xl p-8 sm:p-10", card)}>
        <div className="mb-6 flex justify-center">
          <TemplatePageMark kind="waitlist" templateId={tid} />
        </div>
        <h1 className={cn("text-center", h1Class)}>{page.headline}</h1>

        <WaitlistPitchPillsRow pitch={pitch} templateId={tid} className="mt-4" />

        <p className={cn("mt-4 text-center sm:mt-5", subClass)}>{page.subheadline}</p>

        <WaitlistPitchBulletsList pitch={pitch} templateId={tid} className="mt-6" />

        <div className="mt-8 space-y-3">
          <label className="sr-only" htmlFor="waitlist-email">
            Email address
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 opacity-50"
              aria-hidden
            />
            <Input
              id="waitlist-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn("h-12 rounded-xl pl-11", chrome.input)}
            />
          </div>
          <Button
            type="submit"
            disabled={status === "loading"}
            className="h-12 w-full rounded-xl text-base font-semibold shadow-md shadow-primary/20"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Joining…
              </>
            ) : (
              page.cta_label
            )}
          </Button>
        </div>

        {message ? (
          <p
            className={cn(
              "mt-4 flex items-center justify-center gap-2 text-center text-sm font-medium",
              status === "ok" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
            )}
            role={status === "ok" ? "status" : undefined}
          >
            {status === "ok" ? <CheckCircle2 className="size-4 shrink-0" aria-hidden /> : null}
            {message}
          </p>
        ) : null}

        <p className={cn("mt-6 text-center text-[11px] leading-snug", chrome.footnote)}>
          We’ll only use your email for updates about this list. Unsubscribe anytime.
        </p>
      </form>
    </PublicPageShell>
  );
}
