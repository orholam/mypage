"use client";

import type { SiteKind } from "@/lib/database.types";
import { effectiveTemplateId } from "@/lib/waitlist-template";
import { cn } from "@/lib/utils";
import {
  CircleDot,
  Hexagon,
  Sparkles,
  Star,
  Terminal,
  Waves,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type MarkDef = {
  wrapper: string;
  Icon: LucideIcon;
  iconClass: string;
  label: string;
};

function markFor(kind: SiteKind, templateId: string | null | undefined): MarkDef {
  const id = effectiveTemplateId(kind, templateId);

  if (kind === "personal") {
    switch (id) {
      case "p_spotlight":
        return {
          wrapper: cn(
            "flex size-14 items-center justify-center rounded-2xl sm:size-[4.25rem]",
            "bg-gradient-to-br from-violet-500 via-fuchsia-600 to-indigo-600 text-white",
            "shadow-[0_0_48px_-6px_rgba(168,85,247,0.85),0_0_80px_-20px_rgba(236,72,153,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]",
            "ring-2 ring-white/25"
          ),
          Icon: Sparkles,
          iconClass: "size-6 sm:size-7 drop-shadow-md",
          label: "Spotlight",
        };
      case "p_linktree":
        return {
          wrapper: cn(
            "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-b from-white to-neutral-100 text-neutral-900",
            "shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] ring-1 ring-black/[0.08]"
          ),
          Icon: CircleDot,
          iconClass: "size-6 sm:size-7 stroke-[2.2]",
          label: "Profile",
        };
      case "p_studio":
        return {
          wrapper: cn(
            "flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-sky-300",
            "shadow-[0_0_32px_-4px_rgba(56,189,248,0.45)] ring-1 ring-white/10"
          ),
          Icon: Hexagon,
          iconClass: "size-6 sm:size-7",
          label: "Studio",
        };
      case "p_aurora":
        return {
          wrapper: cn(
            "flex size-[4.5rem] items-center justify-center rounded-full sm:size-20",
            "bg-gradient-to-br from-orange-400 via-fuchsia-500 to-violet-700 text-white",
            "shadow-[0_0_56px_-6px_rgba(217,70,239,0.95),0_0_100px_-28px_rgba(249,115,22,0.55),inset_0_2px_0_rgba(255,255,255,0.35)]",
            "ring-[3px] ring-white/35"
          ),
          Icon: Sparkles,
          iconClass: "size-7 text-white drop-shadow-md sm:size-8",
          label: "Aurora",
        };
      case "p_mono":
        return {
          wrapper: cn(
            "flex size-14 items-center justify-center rounded-lg border border-emerald-500/50 bg-zinc-900",
            "text-emerald-300 shadow-[0_0_28px_-4px_rgba(16,185,129,0.55)] ring-1 ring-emerald-500/30"
          ),
          Icon: Terminal,
          iconClass: "size-6 sm:size-7",
          label: "Terminal",
        };
      case "p_editorial":
      default:
        return {
          wrapper: cn(
            "flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-800 to-stone-900 text-amber-100",
            "shadow-[0_12px_36px_-10px_rgba(120,53,15,0.5)] ring-2 ring-amber-600/30"
          ),
          Icon: Sparkles,
          iconClass: "size-6 sm:size-7 opacity-95",
          label: "Mark",
        };
    }
  }

  switch (id) {
    case "modern":
      return {
        wrapper: cn(
          "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-800 text-indigo-100",
          "shadow-[0_0_40px_-6px_rgba(99,102,241,0.7)] ring-1 ring-white/15"
        ),
        Icon: Star,
        iconClass: "size-6 sm:size-7 fill-indigo-200/20",
        label: "Launch",
      };
    case "modern2":
      return {
        wrapper: cn(
          "flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-800 text-white",
          "shadow-[0_0_48px_-4px_rgba(34,211,238,0.6),0_0_70px_-20px_rgba(59,130,246,0.5)] ring-2 ring-cyan-300/30"
        ),
        Icon: Waves,
        iconClass: "size-6 sm:size-7",
        label: "Wave",
      };
    case "neobrutal":
      return {
        wrapper: cn(
          "flex size-14 items-center justify-center rounded-none border-[3px] border-black bg-yellow-300 text-black",
          "shadow-[6px_6px_0_0_#000]"
        ),
        Icon: Zap,
        iconClass: "size-7 sm:size-8 stroke-[2.5]",
        label: "Energy",
      };
    case "minimal":
      return {
        wrapper: cn(
          "flex size-12 items-center justify-center rounded-full border-2 border-neutral-950 bg-white text-neutral-950",
          "shadow-[0_8px_30px_-10px_rgba(0,0,0,0.25)]"
        ),
        Icon: CircleDot,
        iconClass: "size-5 stroke-[2.5]",
        label: "Mark",
      };
    case "neumorphism":
      return {
        wrapper: cn(
          "flex size-14 items-center justify-center rounded-full bg-neutral-200 text-neutral-700",
          "shadow-[12px_12px_24px_#b8b8b8,-10px_-10px_22px_#ffffff]"
        ),
        Icon: Star,
        iconClass: "size-6 fill-neutral-500/25 stroke-neutral-600",
        label: "Soft",
      };
    case "basic":
    default:
      return {
        wrapper: cn(
          "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-rose-500 text-white",
          "shadow-[0_0_44px_-6px_rgba(139,92,246,0.55),0_12px_36px_-12px_rgba(244,63,94,0.25)] ring-2 ring-white/25"
        ),
        Icon: Sparkles,
        iconClass: "size-6 sm:size-7",
        label: "Welcome",
      };
  }
}

export function TemplatePageMark({
  kind,
  templateId,
  className,
}: {
  kind: SiteKind;
  templateId: string | null | undefined;
  className?: string;
}) {
  const def = markFor(kind, templateId);
  const Icon = def.Icon;

  return (
    <div className={cn("relative shrink-0", className)} title={def.label}>
      <div className={def.wrapper}>
        <Icon className={def.iconClass} strokeWidth={2} aria-hidden />
      </div>
      <span className="sr-only">{def.label}</span>
    </div>
  );
}
