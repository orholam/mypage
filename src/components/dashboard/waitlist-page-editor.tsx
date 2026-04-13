"use client";

import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SiteKind, WaitlistPage } from "@/lib/database.types";
import { publicSiteAbsoluteUrl } from "@/lib/host";
import { normalizeOutboundHref } from "@/lib/href";
import { waitlistTemplateCardClass } from "@/lib/waitlist-template";
import { Save, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

const TEMPLATES = [
  { id: "basic", label: "Basic" },
  { id: "modern", label: "Modern" },
  { id: "neobrutal", label: "Neobrutal" },
  { id: "minimal", label: "Minimal" },
  { id: "modern2", label: "Modern 2" },
  { id: "neumorphism", label: "Neumorphism" },
] as const;

export function WaitlistPageEditor({
  initialPage,
  siteKind,
  subdomain,
}: {
  initialPage: WaitlistPage | null;
  siteKind: SiteKind;
  subdomain?: string;
}) {
  const [templateId, setTemplateId] = useState(initialPage?.template_id ?? "basic");
  const [headline, setHeadline] = useState(initialPage?.headline ?? "");
  const [subheadline, setSubheadline] = useState(initialPage?.subheadline ?? "");
  const [ctaLabel, setCtaLabel] = useState(initialPage?.cta_label ?? "");
  const [ctaUrl, setCtaUrl] = useState(initialPage?.cta_url ?? "");
  const pageId = initialPage?.id ?? "";
  const [saving, setSaving] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [letter, setLetter] = useState("A");

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email;
      if (email) {
        setLetter(email[0]?.toUpperCase() ?? "A");
      }
    })();
  }, []);

  async function save() {
    if (!pageId) {
      setHint("No waitlist page found. Apply the Supabase migration and sign up again.");
      return;
    }
    setSaving(true);
    setHint(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("waitlist_pages")
      .update({
        template_id: templateId,
        headline,
        subheadline,
        cta_label: ctaLabel,
        cta_url: siteKind === "personal" ? ctaUrl.trim() : "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", pageId);
    setSaving(false);
    if (error) {
      setHint(error.message);
      return;
    }
    setHint("Saved.");
  }

  function share() {
    if (!subdomain || typeof window === "undefined") return;
    const url = publicSiteAbsoluteUrl(subdomain);
    if (!url) {
      setHint("Set NEXT_PUBLIC_ROOT_HOST to enable sharing.");
      return;
    }
    void navigator.clipboard.writeText(url);
    setHint("Link copied.");
  }

  const previewCard = waitlistTemplateCardClass(templateId);

  return (
    <div className="bg-background flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
        <div className="flex min-w-0 flex-col">
          <span className="font-display text-base font-extrabold tracking-tight">Page editor</span>
          <span className="font-body-thin text-muted-foreground text-xs leading-snug">
            {siteKind === "personal" ? "Your personal page" : "Your waitlist page"} — bold ideas, thin margins
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" className="gap-1 shadow-sm" onClick={() => void save()} disabled={saving}>
            <Save className="size-4" />
            Save Page
          </Button>
          <Button
            type="button"
            size="sm"
            className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={share}
            disabled={!subdomain}
          >
            <Share2 className="size-4" />
            Share Page
          </Button>
          <Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-primary border-border border text-xs font-semibold">
              {letter}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-border bg-card p-4 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex gap-2 border-b border-border pb-3 text-sm font-medium">
            {(["Basic", "Advance", "Templates"] as const).map((t, i) => (
              <span
                key={t}
                className={cn(
                  "cursor-default pb-2",
                  i === 2 ? "border-primary text-primary border-b-2" : "text-muted-foreground"
                )}
              >
                {t}
              </span>
            ))}
          </div>
          <h2 className="mb-3 text-sm font-semibold">Choose a Template</h2>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={cn(
                  "rounded-lg border p-3 text-left text-xs font-medium transition-colors",
                  templateId === t.id
                    ? "border-2 border-primary bg-secondary"
                    : "border border-border hover:border-primary"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t border-border pt-4">
            <div className="space-y-1">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sub">Subheadline</Label>
              <Input id="sub" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cta">{siteKind === "personal" ? "Button label" : "Join button"}</Label>
              <Input id="cta" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} />
            </div>
            {siteKind === "personal" ? (
              <div className="space-y-1">
                <Label htmlFor="cta_url">Button link (URL or mailto)</Label>
                <Input
                  id="cta_url"
                  type="text"
                  inputMode="url"
                  placeholder="https://… or mailto:you@…"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                />
              </div>
            ) : null}
          </div>
        </aside>

        <div className="bg-preview-canvas flex min-h-[280px] flex-1 items-center justify-center p-6 sm:p-8 lg:min-h-0">
          <div className={cn("w-full max-w-md rounded-2xl border p-8", previewCard)}>
            <div className="mb-4 flex justify-center">
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full text-lg font-medium">
                ✦
              </div>
            </div>
            <h2 className="text-center text-2xl font-bold">{headline || "Headline"}</h2>
            <p className="text-muted-foreground mt-2 text-center text-sm">{subheadline || "Subheadline"}</p>
            {siteKind === "personal" ? (
              <div className="mt-6 flex flex-col items-center gap-3">
                {ctaLabel.trim() && normalizeOutboundHref(ctaUrl) ? (
                  <span className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-medium shadow-sm">
                    {ctaLabel}
                  </span>
                ) : (
                  <p className="text-muted-foreground text-center text-xs">
                    Add a button label and link in the sidebar to show a call-to-action.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-3">
                  <Input readOnly placeholder="Email address" className="bg-card" />
                  <Button type="button" className="w-full" disabled>
                    {ctaLabel || "Join the Waitlist"}
                  </Button>
                </div>
                <p className="text-muted-foreground mt-4 text-center text-[10px]">
                  By joining you agree to our terms and privacy policy.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      {hint ? <p className="bg-card text-muted-foreground border-t border-border px-4 py-2 text-center text-sm">{hint}</p> : null}
      {!pageId ? (
        <p className="bg-card px-4 py-2 text-center text-xs text-destructive">
          No waitlist page in the database. Apply{" "}
          <code className="rounded bg-muted px-1">supabase/migrations/001_init.sql</code> and sign up again.
        </p>
      ) : null}
    </div>
  );
}
