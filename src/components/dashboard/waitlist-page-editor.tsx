"use client";

import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { SiteKind, WaitlistPage } from "@/lib/database.types";
import { publicSiteAbsoluteUrl } from "@/lib/host";
import { normalizeOutboundHref } from "@/lib/href";
import { PROFILE_PROVIDER_LABEL } from "@/components/icons/social-brand-icons";
import { PublicPageAmbient } from "@/components/waitlist/public-page-ambient";
import { ProfileLinksStrip } from "@/components/waitlist/profile-links-strip";
import { TemplatePageMark } from "@/components/waitlist/template-page-mark";
import { WaitlistPitchBulletsList, WaitlistPitchPillsRow } from "@/components/waitlist/waitlist-pitch-blocks";
import {
  MAX_PROFILE_LINKS,
  PROFILE_LINK_PROVIDERS,
  type ProfileLink,
  buildWaitlistPitchFromForm,
  mergePageExtrasForSave,
  parsePageExtras,
  textareaFromBullets,
} from "@/lib/page-extras";
import {
  PERSONAL_TEMPLATES,
  WAITLIST_TEMPLATES,
  effectiveTemplateId,
  pageSurfaceClass,
  personalCtaClass,
  personalHeadingClass,
  personalSubheadClass,
  personalTopAccentClass,
  waitlistFieldChrome,
  waitlistHeadlineClass,
  waitlistSubheadClass,
} from "@/lib/waitlist-template";
import { Loader2, Mail, Plus, Save, Share2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function WaitlistPageEditor({
  initialPage,
  siteKind,
  subdomain,
}: {
  initialPage: WaitlistPage | null;
  siteKind: SiteKind;
  subdomain?: string;
}) {
  const templates = siteKind === "personal" ? PERSONAL_TEMPLATES : WAITLIST_TEMPLATES;
  const initialExtras = parsePageExtras(initialPage?.extras);

  const [templateId, setTemplateId] = useState(() =>
    effectiveTemplateId(siteKind, initialPage?.template_id)
  );
  const [headline, setHeadline] = useState(initialPage?.headline ?? "");
  const [subheadline, setSubheadline] = useState(initialPage?.subheadline ?? "");
  const [ctaLabel, setCtaLabel] = useState(initialPage?.cta_label ?? "");
  const [ctaUrl, setCtaUrl] = useState(initialPage?.cta_url ?? "");
  const [profileLinks, setProfileLinks] = useState<ProfileLink[]>(() => initialExtras.profileLinks ?? []);
  const [waitlistBulletsText, setWaitlistBulletsText] = useState(() =>
    textareaFromBullets(initialExtras.waitlist?.bullets)
  );
  const [waitlistStat, setWaitlistStat] = useState(initialExtras.waitlist?.statHint ?? "");
  const [waitlistTrust, setWaitlistTrust] = useState(initialExtras.waitlist?.trustLine ?? "");
  const [waitlistUrgency, setWaitlistUrgency] = useState(initialExtras.waitlist?.urgencyLine ?? "");

  const pageId = initialPage?.id ?? "";
  const [saving, setSaving] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [letter, setLetter] = useState("A");

  const previewExtras = useMemo(() => {
    const w = buildWaitlistPitchFromForm({
      bulletsText: waitlistBulletsText,
      statHint: waitlistStat,
      trustLine: waitlistTrust,
      urgencyLine: waitlistUrgency,
    });
    return {
      profileLinks,
      waitlist: w,
    };
  }, [profileLinks, waitlistBulletsText, waitlistStat, waitlistTrust, waitlistUrgency]);

  const previewCard = pageSurfaceClass(siteKind, templateId);
  const accent = siteKind === "personal" ? personalTopAccentClass(templateId) : null;
  const headingPreview = personalHeadingClass(templateId);
  const subPreview = personalSubheadClass(templateId);
  const personalBtn = siteKind === "personal" ? personalCtaClass(templateId) : "";
  const waitlistHeadPreview = waitlistHeadlineClass(templateId);
  const waitlistSubPreview = waitlistSubheadClass(templateId);
  const waitlistChrome = siteKind === "waitlist" ? waitlistFieldChrome(templateId) : null;

  const activeTemplateMeta = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId]
  );

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
    const waitlistPitch = buildWaitlistPitchFromForm({
      bulletsText: waitlistBulletsText,
      statHint: waitlistStat,
      trustLine: waitlistTrust,
      urgencyLine: waitlistUrgency,
    });
    const extras = mergePageExtrasForSave(initialPage?.extras, siteKind, profileLinks, waitlistPitch);
    const { error } = await supabase
      .from("waitlist_pages")
      .update({
        template_id: templateId,
        headline,
        subheadline,
        cta_label: ctaLabel,
        cta_url: siteKind === "personal" ? ctaUrl.trim() : "",
        extras,
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

  function addProfileLink() {
    setProfileLinks((prev) =>
      prev.length >= MAX_PROFILE_LINKS
        ? prev
        : [...prev, { provider: "website", url: "" }]
    );
  }

  function updateProfileLink(index: number, patch: Partial<ProfileLink>) {
    setProfileLinks((prev) => {
      const next = [...prev];
      const row = next[index];
      if (!row) return prev;
      next[index] = { ...row, ...patch };
      return next;
    });
  }

  function removeProfileLink(index: number) {
    setProfileLinks((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="bg-background flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-display text-base font-extrabold tracking-tight">Page editor</span>
          <span className="font-body-thin text-muted-foreground max-w-[min(100%,52ch)] text-xs leading-snug">
            {siteKind === "personal"
              ? "Headline, bio, social icons, and a primary link — a compact personal brand card."
              : "Headline, proof lines, benefit bullets, and email capture — tuned for launches."}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="gap-1.5 shadow-sm"
            onClick={() => void save()}
            disabled={saving}
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={share}
            disabled={!subdomain}
          >
            <Share2 className="size-4" />
            Share
          </Button>
          <Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-primary border-border border text-xs font-semibold">
              {letter}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain lg:flex-row lg:overflow-hidden">
        <aside className="flex w-full shrink-0 flex-col border-b border-border bg-card lg:h-full lg:max-h-none lg:min-h-0 lg:max-w-[420px] lg:w-[min(100%,420px)] lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="space-y-8 p-5 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-y-contain">
            <section>
              <p className="font-mono-technical text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-widest">
                Look
              </p>
              <h2 className="text-foreground mb-1 text-sm font-semibold">Template</h2>
              <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                {siteKind === "personal"
                  ? "Styles tuned for a name, bio, social row, and outbound link."
                  : "Styles tuned for email capture and a stronger launch story."}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplateId(t.id)}
                    className={cn(
                      "flex flex-col gap-2 rounded-xl border p-2.5 text-left transition-all",
                      templateId === t.id
                        ? "border-primary bg-secondary ring-2 ring-primary/25"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <span className={cn("h-9 w-full rounded-lg", t.swatch)} aria-hidden />
                    <span className="text-foreground text-xs font-semibold leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
              {activeTemplateMeta ? (
                <p className="text-muted-foreground mt-3 border-t border-border pt-3 text-xs leading-relaxed">
                  {activeTemplateMeta.description}
                </p>
              ) : null}
            </section>

            <section>
              <p className="font-mono-technical text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-widest">
                Content
              </p>
              <h2 className="text-foreground mb-4 text-sm font-semibold">Copy</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="headline">{siteKind === "personal" ? "Your name or title" : "Headline"}</Label>
                  <Input
                    id="headline"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder={siteKind === "personal" ? "Alex Chen" : "Ship faster with …"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sub">
                    {siteKind === "personal" ? "Short intro" : "Supporting line"}
                  </Label>
                  <Textarea
                    id="sub"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    placeholder={
                      siteKind === "personal"
                        ? "Designer · Open to collaborations · Based in …"
                        : "The promise in one breath — what this waitlist is for."
                    }
                    rows={4}
                  />
                  <p className="text-muted-foreground text-[11px] leading-snug">
                    {siteKind === "personal"
                      ? "Visitors read this before they tap your links."
                      : "Sits under the headline; use the pitch section below for bullets and proof."}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cta">
                    {siteKind === "personal" ? "Primary button label" : "Join button text"}
                  </Label>
                  <Input
                    id="cta"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    placeholder={siteKind === "personal" ? "Book a call" : "Join the waitlist"}
                  />
                </div>
                {siteKind === "personal" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="cta_url">Primary button URL</Label>
                    <Input
                      id="cta_url"
                      type="text"
                      inputMode="url"
                      placeholder="https://… or mailto:you@…"
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                    />
                    <p className="text-muted-foreground text-[11px] leading-snug">
                      Main call-to-action. Social links are separate, below.
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            {siteKind === "personal" ? (
              <section>
                <p className="font-mono-technical text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-widest">
                  Presence
                </p>
                <h2 className="text-foreground mb-1 text-sm font-semibold">Social &amp; links</h2>
                <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                  Icon buttons with recognizable logos — GitHub, LinkedIn, X, YouTube, Discord, site, or email.
                </p>
                <div className="space-y-3">
                  {profileLinks.map((row, index) => (
                    <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <label className="sr-only" htmlFor={`pl-p-${index}`}>
                        Link type
                      </label>
                      <select
                        id={`pl-p-${index}`}
                        value={row.provider}
                        onChange={(e) =>
                          updateProfileLink(index, { provider: e.target.value as ProfileLink["provider"] })
                        }
                        className="border-input bg-card/80 text-foreground h-11 w-full shrink-0 rounded-xl border px-3 text-sm sm:w-[140px]"
                      >
                        {PROFILE_LINK_PROVIDERS.map((p) => (
                          <option key={p} value={p}>
                            {PROFILE_PROVIDER_LABEL[p]}
                          </option>
                        ))}
                      </select>
                      <div className="flex min-w-0 flex-1 gap-2">
                        <Input
                          value={row.url}
                          onChange={(e) => updateProfileLink(index, { url: e.target.value })}
                          placeholder="https://… or mailto:…"
                          className="min-w-0 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                          onClick={() => removeProfileLink(index)}
                          aria-label="Remove link"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="warmOutline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={addProfileLink}
                    disabled={profileLinks.length >= MAX_PROFILE_LINKS}
                  >
                    <Plus className="size-4" />
                    Add link
                    <span className="text-muted-foreground text-xs font-normal">
                      ({profileLinks.length}/{MAX_PROFILE_LINKS})
                    </span>
                  </Button>
                </div>
              </section>
            ) : (
              <section>
                <p className="font-mono-technical text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-widest">
                  Pitch
                </p>
                <h2 className="text-foreground mb-1 text-sm font-semibold">Proof &amp; urgency</h2>
                <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                  Short badges under the headline, then checkmark bullets — classic landing-page rhythm.
                </p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="wl-stat">Social proof (optional)</Label>
                    <Input
                      id="wl-stat"
                      value={waitlistStat}
                      onChange={(e) => setWaitlistStat(e.target.value)}
                      placeholder="e.g. 2,400+ people on the list"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wl-trust">Trust / credibility (optional)</Label>
                    <Input
                      id="wl-trust"
                      value={waitlistTrust}
                      onChange={(e) => setWaitlistTrust(e.target.value)}
                      placeholder="e.g. Built by ex-Stripe engineers"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wl-urgency">Urgency (optional)</Label>
                    <Input
                      id="wl-urgency"
                      value={waitlistUrgency}
                      onChange={(e) => setWaitlistUrgency(e.target.value)}
                      placeholder="e.g. Beta closes this Friday"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wl-bullets">Benefit bullets</Label>
                    <Textarea
                      id="wl-bullets"
                      value={waitlistBulletsText}
                      onChange={(e) => setWaitlistBulletsText(e.target.value)}
                      placeholder={"One benefit per line\nUp to four lines\nShip faster, worry less"}
                      rows={5}
                    />
                    <p className="text-muted-foreground text-[11px] leading-snug">
                      Up to four lines. These render with checkmarks above the email field.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </aside>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden lg:min-h-0">
          <PublicPageAmbient kind={siteKind} templateId={templateId} />
          <div className="relative z-10 flex min-h-[360px] flex-1 items-center justify-center overflow-y-auto p-6 sm:p-8">
            <div className={cn("w-full max-w-md p-8 sm:p-10", previewCard)}>
            <div className="mb-6 flex flex-col items-center gap-4">
              {accent ? <div className={accent} aria-hidden /> : null}
              <TemplatePageMark kind={siteKind} templateId={templateId} />
            </div>
            <h2
              className={cn(
                "text-center leading-tight",
                siteKind === "personal" ? headingPreview : waitlistHeadPreview
              )}
            >
              {headline || (siteKind === "personal" ? "Your name" : "Headline")}
            </h2>

            {siteKind === "waitlist" ? (
              <WaitlistPitchPillsRow pitch={previewExtras.waitlist} templateId={templateId} className="mt-4" />
            ) : null}

            <p
              className={cn(
                "mt-3 text-center sm:text-base",
                siteKind === "personal" ? subPreview : waitlistSubPreview
              )}
            >
              {subheadline ||
                (siteKind === "personal"
                  ? "Short intro visitors see under your name."
                  : "Supporting line under your headline.")}
            </p>

            {siteKind === "personal" ? (
              <>
                <ProfileLinksStrip links={profileLinks} templateId={templateId} className="mt-8" />
                <div className="mt-8 flex flex-col items-center gap-3">
                  {ctaLabel.trim() && normalizeOutboundHref(ctaUrl) ? (
                    <span
                      className={cn(
                        "inline-flex min-w-[180px] items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm",
                        personalBtn || "bg-primary text-primary-foreground"
                      )}
                    >
                      {ctaLabel}
                    </span>
                  ) : (
                    <p className="text-muted-foreground max-w-[28ch] text-center text-xs leading-relaxed">
                      Add a primary button label and URL, or only use social links above.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <WaitlistPitchBulletsList pitch={previewExtras.waitlist} templateId={templateId} className="mt-6" />
                <div className="mt-8 space-y-3">
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 opacity-45"
                      aria-hidden
                    />
                    <Input
                      readOnly
                      placeholder="you@example.com"
                      className={cn("h-12 cursor-default rounded-xl pl-11", waitlistChrome?.input)}
                    />
                  </div>
                  <Button type="button" className="h-12 w-full rounded-xl text-base font-semibold" disabled>
                    {ctaLabel || "Join the waitlist"}
                  </Button>
                </div>
                <p className={cn("mt-5 text-center text-[11px] leading-snug", waitlistChrome?.footnote)}>
                  We’ll only use your email for updates about this list.
                </p>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
      {hint ? (
        <p className="bg-card text-muted-foreground shrink-0 border-t border-border px-4 py-2 text-center text-sm">{hint}</p>
      ) : null}
      {!pageId ? (
        <p className="bg-card shrink-0 px-4 py-2 text-center text-xs text-destructive">
          No waitlist page in the database. Apply{" "}
          <code className="rounded bg-muted px-1">supabase/migrations/001_init.sql</code> and sign up again.
        </p>
      ) : null}
    </div>
  );
}
