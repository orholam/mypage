"use client";

import { cn } from "@/lib/utils";
import type { SiteKind } from "@/lib/database.types";
import { effectiveTemplateId } from "@/lib/waitlist-template";

/** Large soft gradient mass — reads as “glowing ball” on the viewport. */
function Blob({
  className,
  motion = "public-animate-float",
  blend = "mix-blend-screen",
}: {
  className: string;
  motion?: string;
  blend?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-[50%] will-change-transform",
        motion,
        blend,
        className
      )}
      aria-hidden
    />
  );
}

function Texture({
  className,
  childrenClass,
}: {
  className?: string;
  childrenClass: string;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <div className={cn("absolute inset-0", childrenClass)} />
    </div>
  );
}

function Vignette({ inverted }: { inverted?: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        inverted
          ? "bg-[radial-gradient(ellipse_72%_62%_at_50%_48%,transparent_28%,rgba(0,0,0,0.55)_100%)]"
          : "bg-[radial-gradient(ellipse_78%_68%_at_50%_45%,transparent_30%,rgba(0,0,0,0.1)_100%)]"
      )}
      aria-hidden
    />
  );
}

export function PublicPageAmbient({
  kind,
  templateId,
  className,
}: {
  kind: SiteKind;
  templateId: string | null | undefined;
  className?: string;
}) {
  const id = effectiveTemplateId(kind, templateId);

  if (kind === "personal") {
    switch (id) {
      case "p_spotlight":
        return (
          <div className={cn("absolute inset-0 overflow-hidden bg-zinc-950", className)} aria-hidden>
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/95 via-zinc-950 to-purple-950/90" />
            <Blob
              className="-left-[28%] top-[-18%] h-[min(100vw,700px)] w-[min(100vw,700px)] bg-gradient-to-br from-violet-600/90 via-fuchsia-500/75 to-transparent blur-[90px] sm:blur-[110px]"
              motion="public-animate-float"
            />
            <Blob
              className="bottom-[-25%] right-[-20%] h-[min(95vw,640px)] w-[min(95vw,640px)] bg-gradient-to-tl from-cyan-400/50 via-blue-600/45 to-transparent blur-[85px] sm:blur-[100px]"
              motion="public-animate-float-reverse"
              blend="mix-blend-screen"
            />
            <Blob
              className="left-[18%] top-[38%] h-[min(60vw,340px)] w-[min(60vw,340px)] bg-gradient-to-br from-pink-500/45 to-orange-400/30 blur-[70px] opacity-90 mix-blend-screen"
              motion="public-animate-drift"
            />
            <Texture childrenClass="public-texture-fine-grid opacity-[0.22]" />
            <div className="public-texture-halftone-light pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
            <Vignette inverted />
          </div>
        );
      case "p_linktree":
        return (
          <div className={cn("absolute inset-0 overflow-hidden bg-neutral-200", className)} aria-hidden>
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-stone-100 to-neutral-300/80" />
            <Blob
              className="-right-[15%] top-[-12%] h-[min(85vw,560px)] w-[min(85vw,560px)] bg-gradient-to-bl from-white via-neutral-100 to-transparent blur-[75px] opacity-95 mix-blend-multiply"
              motion="public-animate-float"
              blend="mix-blend-multiply"
            />
            <Blob
              className="bottom-[-18%] left-[-12%] h-[min(75vw,480px)] w-[min(75vw,480px)] bg-gradient-to-tr from-amber-100/90 to-stone-200/70 blur-[68px] mix-blend-multiply"
              motion="public-animate-float-reverse"
              blend="mix-blend-multiply"
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-multiply [background-image:var(--noise-fine)] [background-size:100px_100px]"
              style={{ backgroundRepeat: "repeat" }}
            />
            <Texture childrenClass="public-texture-diagonal opacity-[0.12]" />
            <Vignette />
          </div>
        );
      case "p_studio":
        return (
          <div className={cn("absolute inset-0 overflow-hidden bg-neutral-300", className)} aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_-20%,oklch(0.98_0.02_95),oklch(0.78_0.04_250_/_0.4))]" />
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-transparent to-violet-200/30" />
            <Blob
              className="right-[-8%] top-[12%] h-96 w-96 bg-gradient-to-br from-sky-400/45 to-indigo-500/35 blur-[64px] mix-blend-multiply"
              motion="public-animate-float"
              blend="mix-blend-multiply"
            />
            <Blob
              className="bottom-[8%] left-[-10%] h-[420px] w-[420px] bg-gradient-to-tr from-violet-300/40 to-fuchsia-200/35 blur-[72px] mix-blend-multiply"
              motion="public-animate-float-reverse"
              blend="mix-blend-multiply"
            />
            <div className="public-texture-halftone pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-multiply" />
            <Vignette />
          </div>
        );
      case "p_aurora":
        return (
          <div className={cn("absolute inset-0 overflow-hidden bg-black", className)} aria-hidden>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-fuchsia-950/80 to-orange-950/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_10%_25%,rgba(192,38,211,0.55),transparent_52%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_90%_75%,rgba(249,115,22,0.52),transparent_48%)]" />
            <div className="public-animate-breathe absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,rgba(236,72,153,0.4),transparent_55%)] opacity-90" />
            <Blob
              className="-left-[22%] top-[5%] h-[min(110vw,760px)] w-[min(110vw,760px)] bg-gradient-to-br from-fuchsia-500/85 via-violet-600/75 to-cyan-400/45 blur-[100px] sm:blur-[120px]"
              motion="public-animate-float"
            />
            <Blob
              className="bottom-[-30%] right-[-18%] h-[min(100vw,720px)] w-[min(100vw,720px)] bg-gradient-to-tl from-orange-500/70 via-rose-500/55 to-amber-400/40 blur-[95px] sm:blur-[115px]"
              motion="public-animate-float-reverse"
            />
            <Blob
              className="left-[25%] top-[40%] h-80 w-80 bg-gradient-to-br from-yellow-300/35 to-pink-500/35 blur-[56px] mix-blend-screen"
              motion="public-animate-drift"
            />
            <Texture childrenClass="public-texture-fine-grid opacity-[0.18]" />
            <Vignette inverted />
          </div>
        );
      case "p_mono":
        return (
          <div className={cn("absolute inset-0 overflow-hidden bg-zinc-950", className)} aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_120%,rgba(16,185,129,0.12),transparent_55%)]" />
            <Blob
              className="right-[-10%] top-[5%] h-[min(70vw,420px)] w-[min(70vw,420px)] bg-gradient-to-bl from-emerald-500/35 to-teal-900/20 blur-[70px] mix-blend-screen"
              motion="public-animate-float"
            />
            <Blob
              className="bottom-[5%] left-[-15%] h-96 w-96 bg-gradient-to-tr from-emerald-400/25 to-transparent blur-[58px] mix-blend-screen"
              motion="public-animate-float-reverse"
            />
            <Blob
              className="left-[30%] top-[50%] h-40 w-40 bg-emerald-400/30 blur-[40px] mix-blend-screen"
              motion="public-animate-breathe"
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <Vignette inverted />
          </div>
        );
      case "p_editorial":
      default:
        return (
          <div className={cn("absolute inset-0 overflow-hidden bg-stone-100", className)} aria-hidden>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/95 via-orange-50/90 to-stone-200/85" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_75%_12%,rgba(251,191,36,0.35),transparent_58%)]" />
            <Blob
              className="-right-[18%] top-[-15%] h-[min(90vw,600px)] w-[min(90vw,600px)] bg-gradient-to-br from-amber-300/75 via-orange-200/55 to-transparent blur-[78px] mix-blend-multiply"
              motion="public-animate-float"
              blend="mix-blend-multiply"
            />
            <Blob
              className="bottom-[-20%] -left-[15%] h-[min(85vw,520px)] w-[min(85vw,520px)] bg-gradient-to-tr from-amber-800/15 to-stone-400/35 blur-[72px] mix-blend-multiply"
              motion="public-animate-float-reverse"
              blend="mix-blend-multiply"
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-multiply [background-image:var(--noise-coarse)] [background-size:64px_64px]"
              style={{ backgroundRepeat: "repeat" }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-overlay [background-image:var(--noise-fine)] [background-size:112px_112px]"
              style={{ backgroundRepeat: "repeat" }}
            />
            <Texture childrenClass="public-texture-diagonal opacity-[0.07]" />
            <Vignette />
          </div>
        );
    }
  }

  /* ——— Waitlist ——— */
  switch (id) {
    case "modern":
      return (
        <div className={cn("absolute inset-0 overflow-hidden bg-zinc-950", className)} aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/50 to-zinc-950" />
          <Blob
            className="-left-[25%] top-[8%] h-[min(95vw,680px)] w-[min(95vw,680px)] bg-gradient-to-br from-indigo-600/80 via-violet-600/65 to-transparent blur-[95px] sm:blur-[115px]"
            motion="public-animate-float"
          />
          <Blob
            className="bottom-[-22%] right-[-18%] h-[min(90vw,620px)] w-[min(90vw,620px)] bg-gradient-to-tl from-blue-500/55 via-indigo-800/40 to-transparent blur-[88px]"
            motion="public-animate-float-reverse"
          />
          <Blob
            className="right-[22%] top-[42%] h-72 w-72 bg-fuchsia-500/25 blur-[50px] mix-blend-screen"
            motion="public-animate-breathe"
          />
          <Texture childrenClass="public-texture-fine-grid opacity-[0.2]" />
          <div className="public-texture-halftone-light absolute inset-0 opacity-[0.1] mix-blend-soft-light" />
          <Vignette inverted />
        </div>
      );
    case "modern2":
      return (
        <div className={cn("absolute inset-0 overflow-hidden bg-slate-950", className)} aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-slate-900 to-cyan-950/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_55%_at_50%_-8%,rgba(59,130,246,0.48),transparent_55%)]" />
          <Blob
            className="right-[-12%] top-[10%] h-[min(88vw,600px)] w-[min(88vw,600px)] bg-gradient-to-bl from-cyan-400/65 via-blue-600/55 to-indigo-900/30 blur-[92px]"
            motion="public-animate-float"
          />
          <Blob
            className="bottom-[-28%] left-[-15%] h-[min(95vw,680px)] w-[min(95vw,680px)] bg-gradient-to-tr from-blue-700/60 to-teal-500/35 blur-[100px] sm:blur-[118px]"
            motion="public-animate-float-reverse"
          />
          <Blob
            className="left-[35%] top-[55%] h-64 w-64 bg-sky-300/25 blur-[48px] public-animate-drift mix-blend-screen"
            motion="public-animate-drift"
          />
          <Vignette inverted />
        </div>
      );
    case "neobrutal":
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
          <div className="absolute inset-0 bg-[linear-gradient(128deg,#fde047_0%,#fda4af_38%,#c084fc_72%,#fef08a_100%)]" />
          <Blob
            className="left-[-10%] top-[5%] h-80 w-80 bg-rose-500/45 blur-[56px] mix-blend-multiply public-animate-float"
            motion="public-animate-float"
            blend="mix-blend-multiply"
          />
          <Blob
            className="bottom-[8%] right-[-5%] h-96 w-96 bg-violet-600/40 blur-[60px] mix-blend-multiply public-animate-float-reverse"
            motion="public-animate-float-reverse"
            blend="mix-blend-multiply"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:var(--noise-coarse)] [background-size:72px_72px] mix-blend-multiply"
            style={{ backgroundRepeat: "repeat" }}
          />
          <Texture childrenClass="public-texture-diagonal opacity-[0.18]" />
        </div>
      );
    case "minimal":
      return (
        <div className={cn("absolute inset-0 overflow-hidden bg-neutral-50", className)} aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-100/95 to-neutral-200/90" />
          <Blob
            className="left-1/2 top-[5%] h-[min(120vw,680px)] w-[min(120vw,680px)] -translate-x-1/2 bg-gradient-to-b from-neutral-300/50 to-transparent blur-[85px] opacity-90"
            motion="public-animate-float"
            blend="mix-blend-multiply"
          />
          <Blob
            className="bottom-[12%] right-[10%] h-72 w-72 bg-stone-300/35 blur-[52px] public-animate-float-reverse mix-blend-multiply"
            motion="public-animate-float-reverse"
            blend="mix-blend-multiply"
          />
          <div className="public-texture-halftone pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply" />
          <Vignette />
        </div>
      );
    case "neumorphism":
      return (
        <div className={cn("absolute inset-0 overflow-hidden bg-neutral-300", className)} aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-neutral-200 to-stone-300" />
          <Blob
            className="-right-[20%] top-[-15%] h-[min(85vw,560px)] w-[min(85vw,560px)] bg-gradient-to-bl from-white/95 to-transparent blur-[70px] mix-blend-soft-light"
            motion="public-animate-float"
            blend="mix-blend-soft-light"
          />
          <Blob
            className="bottom-[-18%] left-[-8%] h-96 w-96 bg-neutral-400/35 blur-[58px] mix-blend-multiply"
            motion="public-animate-float-reverse"
            blend="mix-blend-multiply"
          />
          <div className="public-texture-halftone pointer-events-none absolute inset-0 opacity-[0.22]" />
          <Vignette />
        </div>
      );
    case "basic":
    default:
      return (
        <div className={cn("absolute inset-0 overflow-hidden bg-stone-100", className)} aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-100/90 via-rose-50/85 to-amber-100/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-5%,rgba(139,92,246,0.22),transparent_58%)]" />
          <Blob
            className="right-[-18%] top-[-12%] h-[min(100vw,720px)] w-[min(100vw,720px)] bg-gradient-to-bl from-fuchsia-400/55 via-violet-500/45 to-indigo-400/25 blur-[88px] sm:blur-[104px]"
            motion="public-animate-float"
          />
          <Blob
            className="bottom-[-25%] left-[-20%] h-[min(95vw,640px)] w-[min(95vw,640px)] bg-gradient-to-tr from-amber-300/50 via-orange-300/40 to-rose-400/35 blur-[82px] mix-blend-multiply"
            motion="public-animate-float-reverse"
            blend="mix-blend-multiply"
          />
          <Blob
            className="left-[40%] top-[38%] h-56 w-56 bg-cyan-300/20 blur-[44px] public-animate-breathe mix-blend-multiply"
            motion="public-animate-breathe"
            blend="mix-blend-multiply"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply [background-image:var(--noise-fine)] [background-size:96px_96px]"
            style={{ backgroundRepeat: "repeat" }}
          />
          <Vignette />
        </div>
      );
  }
}

export function PublicPageShell({
  kind,
  templateId,
  children,
  embedded,
}: {
  kind: SiteKind;
  templateId: string | null | undefined;
  children: React.ReactNode;
  embedded?: boolean;
}) {
  return (
    <div className={embedded ? "relative isolate min-h-0 w-full" : "relative isolate min-h-screen w-full"}>
      <PublicPageAmbient kind={kind} templateId={templateId} />
      <div
        className={cn(
          "relative z-10 flex w-full justify-center",
          embedded ? "min-h-[min(400px,100%)] items-center p-4 sm:p-6" : "min-h-screen items-center p-6 sm:p-10"
        )}
      >
        {children}
      </div>
    </div>
  );
}
