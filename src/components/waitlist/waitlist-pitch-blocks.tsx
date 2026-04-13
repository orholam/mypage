"use client";

import { cn } from "@/lib/utils";
import type { WaitlistPitchExtras } from "@/lib/page-extras";
import { effectiveTemplateId } from "@/lib/waitlist-template";
import { Check, Sparkles, Timer, Users } from "lucide-react";

function PitchPill({
  children,
  icon: Icon,
  className,
}: {
  children: React.ReactNode;
  icon: typeof Sparkles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
        className
      )}
    >
      <Icon className="size-3.5 shrink-0 opacity-90" aria-hidden />
      {children}
    </span>
  );
}

function usePitchTheme(templateId: string | undefined | null) {
  const id = effectiveTemplateId("waitlist", templateId);
  const isDark = id === "modern" || id === "modern2" || id === "neobrutal";
  return { isDark };
}

export function WaitlistPitchPillsRow({
  pitch,
  templateId,
  className,
}: {
  pitch: WaitlistPitchExtras | undefined;
  templateId: string | undefined | null;
  className?: string;
}) {
  const { isDark } = usePitchTheme(templateId);
  const hasMeta = Boolean(pitch?.trustLine?.trim() || pitch?.urgencyLine?.trim() || pitch?.statHint?.trim());
  if (!hasMeta) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2",
        className
      )}
    >
      {pitch?.statHint?.trim() ? (
        <PitchPill
          icon={Users}
          className={cn(
            isDark ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100" : "border-emerald-600/25 bg-emerald-50 text-emerald-900"
          )}
        >
          {pitch.statHint.trim()}
        </PitchPill>
      ) : null}
      {pitch?.trustLine?.trim() ? (
        <PitchPill
          icon={Sparkles}
          className={cn(
            isDark ? "border-amber-400/35 bg-amber-500/10 text-amber-50" : "border-amber-600/25 bg-amber-50 text-amber-950"
          )}
        >
          {pitch.trustLine.trim()}
        </PitchPill>
      ) : null}
      {pitch?.urgencyLine?.trim() ? (
        <PitchPill
          icon={Timer}
          className={cn(
            isDark ? "border-rose-400/40 bg-rose-500/15 text-rose-50" : "border-rose-500/30 bg-rose-50 text-rose-950"
          )}
        >
          {pitch.urgencyLine.trim()}
        </PitchPill>
      ) : null}
    </div>
  );
}

export function WaitlistPitchBulletsList({
  pitch,
  templateId,
  className,
}: {
  pitch: WaitlistPitchExtras | undefined;
  templateId: string | undefined | null;
  className?: string;
}) {
  const { isDark } = usePitchTheme(templateId);
  const bullets = pitch?.bullets?.filter(Boolean) ?? [];
  if (bullets.length === 0) return null;

  return (
    <ul className={cn("space-y-2.5 text-left", className)}>
      {bullets.map((line, i) => (
        <li key={i} className="flex gap-3 text-sm leading-snug sm:text-[0.9375rem]">
          <span
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
              isDark ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-200" : "border-primary/30 bg-primary/10 text-primary"
            )}
          >
            <Check className="size-3" strokeWidth={2.5} aria-hidden />
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 pt-0.5 text-[0.9375rem] leading-snug",
              isDark ? "text-zinc-200" : "text-neutral-800"
            )}
          >
            {line}
          </span>
        </li>
      ))}
    </ul>
  );
}
