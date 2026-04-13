"use client";

import { renameWorkspace, updateWorkspaceSubdomain } from "@/app/dashboard/workspace-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRootHost, isValidSubdomain, normalizeSubdomain } from "@/lib/host";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  workspaceId: string;
  initialName: string;
  initialSubdomain: string;
};

export function DashboardSiteSettings({ workspaceId, initialName, initialSubdomain }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [subdomain, setSubdomain] = useState(initialSubdomain);
  const [nameMessage, setNameMessage] = useState<string | null>(null);
  const [subMessage, setSubMessage] = useState<string | null>(null);

  const root = getRootHost();
  const subNorm = normalizeSubdomain(subdomain);
  const subDisplay = subNorm || "yoursite";
  let preview: string | null = null;
  if (typeof window !== "undefined" && root) {
    if (root === "localhost") {
      const port = window.location.port ? `:${window.location.port}` : "";
      preview = `${window.location.protocol}//${subDisplay}.localhost${port}/`;
    } else {
      preview = `https://${subDisplay}.${root}/`;
    }
  }

  const nameDirty = name.trim() !== initialName.trim();
  const subDirty = normalizeSubdomain(subdomain) !== normalizeSubdomain(initialSubdomain);

  function saveName() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameMessage("Name is required.");
      return;
    }
    setNameMessage(null);
    startTransition(async () => {
      const result = await renameWorkspace(workspaceId, trimmed);
      if ("error" in result && result.error) {
        setNameMessage(result.error);
        return;
      }
      setNameMessage("Saved.");
      router.refresh();
    });
  }

  function saveSubdomain() {
    const sub = normalizeSubdomain(subdomain);
    if (!isValidSubdomain(sub)) {
      setSubMessage(
        "Use 2–63 characters (letters, numbers, hyphens). Reserved names like www or app are not allowed."
      );
      return;
    }
    setSubMessage(null);
    startTransition(async () => {
      const result = await updateWorkspaceSubdomain(workspaceId, sub);
      if ("error" in result && result.error) {
        setSubMessage(result.error);
        return;
      }
      setSubMessage("Saved.");
      router.refresh();
    });
  }

  return (
    <Card className="rounded-2xl border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="font-display text-lg font-extrabold">What we call this place</CardTitle>
        <CardDescription className="font-body-thin text-base leading-relaxed">
          Dashboard label vs. the bit people type in the address bar. Both can be wrong until you fix them.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 pt-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-4">
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="dash-site-name">Site name</Label>
            <Input
              id="dash-site-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameMessage(null);
              }}
              disabled={pending}
              autoComplete="organization"
            />
            {nameMessage ? (
              <p
                className={
                  nameMessage === "Saved."
                    ? "text-muted-foreground text-xs"
                    : "text-destructive text-xs"
                }
                role="status"
              >
                {nameMessage}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            className="sm:w-auto"
            disabled={pending || !nameDirty || !name.trim()}
            onClick={saveName}
          >
            Save name
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-4">
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="dash-site-subdomain">Subdomain</Label>
            <Input
              id="dash-site-subdomain"
              value={subdomain}
              onChange={(e) => {
                setSubdomain(e.target.value);
                setSubMessage(null);
              }}
              disabled={pending}
              autoComplete="off"
              className="font-mono-technical text-sm lowercase"
            />
            {preview ? (
              <p className="font-mono-technical text-muted-foreground text-xs break-all">Public: {preview}</p>
            ) : null}
            {subMessage ? (
              <p
                className={
                  subMessage === "Saved."
                    ? "text-muted-foreground text-xs"
                    : "text-destructive text-xs"
                }
                role="status"
              >
                {subMessage}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            className="sm:w-auto"
            disabled={pending || !subDirty}
            onClick={saveSubdomain}
          >
            Save subdomain
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
