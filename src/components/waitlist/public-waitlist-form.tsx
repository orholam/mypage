"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PublicPageRow } from "@/lib/database.types";
import { waitlistTemplateCardClass } from "@/lib/waitlist-template";
import { useState } from "react";

export function PublicWaitlistForm({ page }: { page: PublicPageRow }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string | null>(null);

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
    setMessage("You are on the list. Thanks!");
    setEmail("");
  }

  const card = waitlistTemplateCardClass(page.template_id);

  return (
    <div className="bg-preview-canvas flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className={cn("w-full max-w-md rounded-2xl border p-8", card)}
      >
        <div className="mb-4 flex justify-center">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full text-lg font-medium">
            ✦
          </div>
        </div>
        <h1 className="text-center text-2xl font-bold">{page.headline}</h1>
        <p className="mt-2 text-center text-sm opacity-80">{page.subheadline}</p>
        <div className="mt-6 space-y-3">
          <Input
            type="email"
            required
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/90"
          />
          <Button type="submit" disabled={status === "loading"} className="w-full shadow-sm shadow-primary/15">
            {status === "loading" ? "Joining…" : page.cta_label}
          </Button>
        </div>
        {message ? (
          <p
            className={cn(
              "mt-3 text-center text-sm",
              status === "ok" ? "text-emerald-700" : "text-destructive"
            )}
          >
            {message}
          </p>
        ) : null}
        <p className="mt-4 text-center text-[10px] opacity-60">
          By joining you agree to our terms and privacy policy.
        </p>
      </form>
    </div>
  );
}
