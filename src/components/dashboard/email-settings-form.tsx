"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { EmailTemplateRow } from "@/lib/database.types";
import { Mail } from "lucide-react";
import { useMemo, useState } from "react";

type Kind = "welcome" | "launch";

function pickTemplate(templates: EmailTemplateRow[], kind: Kind): EmailTemplateRow | null {
  return templates.find((t) => t.kind === kind) ?? null;
}

export function EmailSettingsForm({
  workspaceId,
  templates,
}: {
  workspaceId: string;
  templates: EmailTemplateRow[];
}) {
  const welcomeInit = useMemo(() => pickTemplate(templates, "welcome"), [templates]);
  const launchInit = useMemo(() => pickTemplate(templates, "launch"), [templates]);

  const [tab, setTab] = useState<Kind>("welcome");
  const [welcome, setWelcome] = useState({
    subject: welcomeInit?.subject ?? "",
    header_text: welcomeInit?.header_text ?? "",
    body_greeting: welcomeInit?.body_greeting ?? "",
    cta_label: welcomeInit?.cta_label ?? "",
    cta_url: welcomeInit?.cta_url ?? "",
  });
  const [launch, setLaunch] = useState({
    subject: launchInit?.subject ?? "",
    header_text: launchInit?.header_text ?? "",
    body_greeting: launchInit?.body_greeting ?? "",
    cta_label: launchInit?.cta_label ?? "",
    cta_url: launchInit?.cta_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const draft = tab === "welcome" ? welcome : launch;
  const setDraft = tab === "welcome" ? setWelcome : setLaunch;

  async function save() {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const payload =
      tab === "welcome"
        ? welcome
        : launch;
    const { error } = await supabase
      .from("email_templates")
      .update({
        subject: payload.subject,
        header_text: payload.header_text,
        body_greeting: payload.body_greeting,
        cta_label: payload.cta_label,
        cta_url: payload.cta_url,
      })
      .eq("workspace_id", workspaceId)
      .eq("kind", tab);
    setSaving(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Saved.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTab("welcome")}
            className={cn(
              "rounded-xl border-2 p-4 text-left transition-colors",
              tab === "welcome"
                ? "border-primary bg-secondary"
                : "border-border hover:border-primary"
            )}
          >
            <div className="text-primary mb-2 flex items-center gap-2">
              <Mail className="size-5" />
              <span className="font-semibold">Edit Welcome Email</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Configure your welcome email settings here.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setTab("launch")}
            className={cn(
              "rounded-xl border-2 p-4 text-left transition-colors",
              tab === "launch"
                ? "border-primary bg-secondary"
                : "border-border hover:border-primary"
            )}
          >
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Mail className="size-5" />
              <span className="font-semibold text-foreground">Launch Notification Email</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Set up your notification email for launches here.
            </p>
          </button>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={draft.subject}
              onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="header">Header</Label>
            <Input
              id="header"
              value={draft.header_text}
              onChange={(e) => setDraft((d) => ({ ...d, header_text: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="greeting">Greeting</Label>
            <Input
              id="greeting"
              value={draft.body_greeting}
              onChange={(e) => setDraft((d) => ({ ...d, body_greeting: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta">Button label</Label>
            <Input
              id="cta"
              value={draft.cta_label}
              onChange={(e) => setDraft((d) => ({ ...d, cta_label: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta_url">Button URL</Label>
            <Input
              id="cta_url"
              value={draft.cta_url}
              onChange={(e) => setDraft((d) => ({ ...d, cta_url: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => void save()}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
            {message ? <span className="text-muted-foreground text-sm">{message}</span> : null}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Mail Preview</h3>
        <Card className="overflow-hidden shadow-md">
          <CardContent className="p-0">
            <p className="border-b border-border px-4 py-3 text-center text-sm font-semibold">
              Subject: {draft.subject || "—"}
            </p>
            <div className="bg-white p-4">
              <div className="bg-primary text-primary-foreground rounded-t-md px-4 py-3 text-center text-sm font-medium">
                {draft.header_text || "Header"}
              </div>
              <div className="space-y-4 border border-t-0 border-border p-6 text-sm">
                <p>{draft.body_greeting || "Hey!"}</p>
                <div className="flex justify-center">
                  <span className="inline-flex rounded-md bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white">
                    {draft.cta_label || "CTA"}
                  </span>
                </div>
                <p className="text-muted-foreground text-center text-xs">
                  Footer and legal copy would appear here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
