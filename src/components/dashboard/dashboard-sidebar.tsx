"use client";

import { createWorkspace, selectWorkspace } from "@/app/dashboard/workspace-actions";
import { LaunchLogo } from "@/components/brand/launch-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { DashboardShellData } from "@/lib/dashboard-data";
import type { SiteKind } from "@/lib/database.types";
import {
  getRootHost,
  isValidSubdomain,
  normalizeSubdomain,
  publicSiteAbsoluteUrl,
  suggestSubdomainFromName,
} from "@/lib/host";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Check,
  ChevronDown,
  Home,
  Inbox,
  LayoutTemplate,
  Lightbulb,
  List,
  Mail,
  Share2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function siteKindLabel(kind?: SiteKind) {
  return kind === "personal" ? "Personal" : "Waitlist";
}

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/editor", label: "Page editor", icon: LayoutTemplate },
  { href: "/dashboard/email", label: "Email", icon: Mail },
  { href: "/dashboard/submissions", label: "Submissions", icon: List },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/features", label: "Request Features", icon: Lightbulb },
];

export function DashboardSidebar({ shell }: { shell: DashboardShellData }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createSiteKind, setCreateSiteKind] = useState<SiteKind>("waitlist");
  const [createName, setCreateName] = useState("");
  const [createSubdomain, setCreateSubdomain] = useState("");
  const [createSubError, setCreateSubError] = useState<string | null>(null);

  const ws = shell.activeWorkspace;
  const cap = ws?.subscriber_cap ?? 5000;
  const count = shell.subscriberCount;
  const pct = Math.min(100, Math.round((count / Math.max(cap, 1)) * 100));

  function runAction(
    fn: () => Promise<{ error?: string } | { ok: true }>,
    options?: { onSuccess?: () => void }
  ) {
    startTransition(async () => {
      setActionError(null);
      const result = await fn();
      if ("error" in result && result.error) {
        setActionError(result.error);
        return;
      }
      options?.onSuccess?.();
      router.refresh();
    });
  }

  return (
    <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground flex h-full min-h-0 w-[18rem] shrink-0 flex-col overflow-hidden border-r shadow-sm">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <Link
          href="/dashboard"
          prefetch={false}
          className="rounded-md outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
        >
          <LaunchLogo className="text-sm" />
        </Link>
      </div>
      <div className="shrink-0 p-3">
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) setActionError(null);
          }}
        >
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto min-h-9 w-full justify-between gap-2 py-2 font-normal"
            )}
          >
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium">
                {ws?.name ?? "Create your first site"}
              </span>
              {ws ? (
                <span className="text-muted-foreground block text-[10px] font-normal">
                  {siteKindLabel(ws.site_kind)}
                </span>
              ) : null}
            </span>
            <ChevronDown className="text-muted-foreground size-4 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {shell.workspaces.map((w) => {
              const isActive = w.id === shell.activeWorkspace?.id;
              return (
                <DropdownMenuItem
                  key={w.id}
                  disabled={pending}
                  onClick={() => {
                    if (isActive) return;
                    runAction(() => selectWorkspace(w.id));
                  }}
                >
                  <span className="flex w-full min-w-0 items-center gap-2">
                    <span className="flex w-4 shrink-0 justify-center">
                      {isActive ? <Check className="text-primary size-4" aria-hidden /> : null}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      <span className={cn("block truncate", isActive && "font-medium")}>{w.name}</span>
                      <span className="text-muted-foreground block text-[10px] font-normal">
                        {siteKindLabel(w.site_kind)}
                      </span>
                    </span>
                  </span>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[11px]">New site</DropdownMenuLabel>
              <DropdownMenuItem
                disabled={pending}
                onClick={() => {
                  setCreateSubError(null);
                  const defaultName = "New waitlist";
                  setCreateSiteKind("waitlist");
                  setCreateName(defaultName);
                  setCreateSubdomain(suggestSubdomainFromName(defaultName));
                  setCreateOpen(true);
                }}
              >
                <Inbox className="size-4" />
                New waitlist
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={pending}
                onClick={() => {
                  setCreateSubError(null);
                  const defaultName = "My page";
                  setCreateSiteKind("personal");
                  setCreateName(defaultName);
                  setCreateSubdomain(suggestSubdomainFromName(defaultName));
                  setCreateOpen(true);
                }}
              >
                <UserRound className="size-4" />
                New personal page
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <CreateSiteDialog
          open={createOpen}
          onOpenChange={(open) => {
            setCreateOpen(open);
            if (!open) setCreateSubError(null);
          }}
          siteKind={createSiteKind}
          name={createName}
          onNameChange={setCreateName}
          subdomain={createSubdomain}
          onSubdomainChange={(v) => {
            setCreateSubdomain(v);
            setCreateSubError(null);
          }}
          subdomainError={createSubError}
          pending={pending}
          onCreate={() => {
            const trimmedName = createName.trim() || (createSiteKind === "personal" ? "My page" : "New waitlist");
            const sub = normalizeSubdomain(createSubdomain) || suggestSubdomainFromName(trimmedName);
            if (!isValidSubdomain(sub)) {
              setCreateSubError(
                "Use 2–63 characters (letters, numbers, hyphens). Reserved names like www or app are not allowed."
              );
              return;
            }
            runAction(() => createWorkspace(trimmedName, createSiteKind, sub), {
              onSuccess: () => setCreateOpen(false),
            });
          }}
        />

        {actionError ? (
          <p className="text-destructive mt-2 text-xs leading-snug" role="alert">
            {actionError}
            {/owner_unique|workspaces_owner/i.test(actionError) ? (
              <>
                {" "}
                Apply{" "}
                <code className="rounded bg-muted px-0.5">supabase/migrations/002_multi_workspace.sql</code>{" "}
                in Supabase to allow more than one site per account.
              </>
            ) : null}
          </p>
        ) : null}
        <div className="mt-3 flex justify-end">
          <SharePageButton subdomain={shell.activeWorkspace?.subdomain} />
        </div>
      </div>
      <Separator className="bg-sidebar-border shrink-0" />
      <ScrollArea className="min-h-0 flex-1 px-2 py-3">
        <nav className="flex flex-col gap-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && href !== "/dashboard/editor" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                prefetch={false}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-sm"
                    : "font-body-thin text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-sidebar-border shrink-0 border-t bg-muted p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Plan</span>
          <span className="bg-card text-primary border-border rounded-full border px-2.5 py-0.5 text-xs font-semibold">
            {ws?.plan_label ?? "—"}
          </span>
        </div>
        <div className="text-muted-foreground mb-1 flex justify-between text-xs font-medium">
          <span>Subscribers</span>
          <span>
            {count} / {cap}
          </span>
        </div>
        <div className="bg-card h-2 overflow-hidden rounded-full border border-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <form action="/auth/sign-out" method="post" className="mt-4">
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}

function CreateSiteDialog({
  open,
  onOpenChange,
  siteKind,
  name,
  onNameChange,
  subdomain,
  onSubdomainChange,
  subdomainError,
  pending,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteKind: SiteKind;
  name: string;
  onNameChange: (value: string) => void;
  subdomain: string;
  onSubdomainChange: (value: string) => void;
  subdomainError: string | null;
  pending: boolean;
  onCreate: () => void;
}) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {siteKind === "personal" ? "New personal page" : "New waitlist site"}
          </DialogTitle>
          <DialogDescription>
            Choose a display name and the subdomain for your public site.
          </DialogDescription>
          {preview ? (
            <p className="text-foreground font-mono text-xs break-all">{preview}</p>
          ) : null}
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="create-site-name">Name</Label>
            <Input
              id="create-site-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              disabled={pending}
              autoComplete="off"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="create-subdomain">Subdomain</Label>
            <Input
              id="create-subdomain"
              value={subdomain}
              onChange={(e) => onSubdomainChange(e.target.value)}
              disabled={pending}
              autoComplete="off"
              className="font-mono text-sm lowercase"
            />
            {subdomainError ? (
              <p className="text-destructive text-xs" role="alert">
                {subdomainError}
              </p>
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onCreate} disabled={pending}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SharePageButton({ subdomain, slug }: { subdomain?: string; slug?: string }) {
  const url = subdomain ? publicSiteAbsoluteUrl(subdomain) : null;
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="border-primary text-primary hover:bg-secondary shrink-0 border-2"
      onClick={() => {
        if (!url || typeof window === "undefined") return;
        void navigator.clipboard.writeText(url);
      }}
      title={url ? "Copy public site link" : (slug ? "Configure your domain to share" : "Save a page first")}
      disabled={!url}
    >
      <Share2 className="size-4" />
    </Button>
  );
}
