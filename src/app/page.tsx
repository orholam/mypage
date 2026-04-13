import { LaunchLogo } from "@/components/brand/launch-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  Check,
  LayoutTemplate,
  Mail,
  Share2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: LayoutTemplate,
    title: "Templates that don’t yawn",
    description:
      "Pick a vibe—quiet, loud, or weird—then change five words and pretend you designed it from scratch. We won’t tell.",
  },
  {
    icon: Mail,
    title: "Emails you can preview sober",
    description:
      "Welcome + launch drafts with a live peek. No more “hope the merge tags didn’t eat a bracket” energy.",
  },
  {
    icon: BarChart3,
    title: "Numbers without the spreadsheet smell",
    description:
      "Signups and plan headroom in one glance. For when you’re proud but also slightly nervous.",
  },
  {
    icon: Share2,
    title: "Links you’re not ashamed of",
    description: "Clean URLs for bios, sidebars, and that one Discord where people actually click things.",
  },
];

const plans = [
  {
    name: "Mess around tier",
    price: "Free",
    description: "Local Supabase, full UI, zero guilt. Like a playground with fewer wood chips.",
    highlights: ["All templates (yes, even the loud one)", "Editor + dashboard", "Learning-friendly"],
    cta: "Ok let’s go",
    href: "/signup",
    featured: false,
  },
  {
    name: "Real life tier",
    price: "Your stack",
    description: "Deploy when the caffeine says yes. Bring your host, DB, and mild delusion of grandeur.",
    highlights: ["Your DB, your drama", "Domains when you’re fancy", "Data stays yours"],
    cta: "Make an account",
    href: "/signup",
    featured: true,
  },
];

export default function Home() {
  return (
    <div className="relative z-10 min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 md:px-10">
          <LaunchLogo />
          <nav className="font-body-thin hidden items-center gap-10 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#about" className="transition-colors hover:text-foreground">
              About
            </a>
          </nav>
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/login"
              className="font-body-thin text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ size: "sm" }), "shadow-sm")}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-primary mb-8 inline-flex items-center gap-2 rounded-full border-2 border-primary bg-card px-5 py-2.5 text-sm font-semibold shadow-sm">
                <Sparkles className="size-4" aria-hidden />
                Another waitlist app (orange included on purpose)
              </p>
              <h1 className="font-display text-4xl leading-[1.08] sm:text-5xl md:text-6xl md:leading-[1.05]">
                <span className="text-foreground">Build the thing,</span>
                <br />
                <span className="text-primary">not the signup plumbing.</span>
              </h1>
              <p className="font-mono-technical text-warm mt-6 text-xs font-medium uppercase tracking-[0.2em]">
                Blue type · orange accents · chunky fields
              </p>
              <p className="font-body-thin text-muted-foreground mx-auto mt-8 max-w-xl text-lg leading-relaxed text-pretty md:text-xl">
                One noisy gradient behind everything (look closely). Solid cards up front. You get a page that collects
                emails; we get to shut up about “synergy.”
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ size: "lg" }), "min-w-[220px] shadow-md")}
                >
                  Start free
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a
                  href="#features"
                  className={cn(
                    buttonVariants({ variant: "warmOutline", size: "lg" }),
                    "min-w-[220px] font-semibold"
                  )}
                >
                  What even is this
                </a>
              </div>
              <ul className="font-body-thin text-muted-foreground mx-auto mt-16 flex max-w-2xl flex-col gap-3 text-left text-sm sm:mt-20 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-3">
                {[
                  "Pricing that doesn’t hide in fine print",
                  "Supabase when you’re ready (no arm-twisting)",
                  "Templates + previews + share links — the trifecta",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="bg-secondary text-primary flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-warm">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-border bg-muted">
          <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono-technical text-muted-foreground mb-3 text-xs font-medium uppercase tracking-widest">
                The pile
              </p>
              <h2 className="text-3xl md:text-4xl">Stuff in one place</h2>
              <p className="font-body-thin text-muted-foreground mt-4 text-lg leading-relaxed">
                Editor, mail, signups. Fewer tabs than your average Tuesday afternoon.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-10">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="text-primary mb-5 inline-flex size-12 items-center justify-center rounded-xl border border-border bg-secondary transition-colors group-hover:border-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                  <p className="font-body-thin text-muted-foreground mt-3 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-card">
          <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono-technical text-muted-foreground mb-3 text-xs font-medium uppercase tracking-widest">
                Pick one
              </p>
              <h2 className="text-3xl md:text-4xl">Two doors</h2>
              <p className="font-body-thin text-muted-foreground mt-4 text-lg leading-relaxed">
                Demo today, serious tomorrow. Or demo forever. We’re not your landlord.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:mt-20 md:grid-cols-2 md:gap-10">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col rounded-2xl border bg-card p-8 md:p-10",
                    plan.featured
                      ? "border-2 border-warm shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-card"
                      : "border border-border shadow-sm"
                  )}
                >
                  {plan.featured ? (
                    <span className="bg-warm text-warm-foreground absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-bold">
                      Orange team pick
                    </span>
                  ) : null}
                  <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="font-body-thin text-muted-foreground mt-2 text-sm leading-relaxed">{plan.description}</p>
                  <p className="font-display mt-8 text-4xl font-extrabold tracking-tight text-foreground">{plan.price}</p>
                  <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm">
                    {plan.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-3">
                        <Check className="text-warm size-4 shrink-0" aria-hidden />
                        <span className="font-medium">{h}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={cn(
                      buttonVariants({
                        variant: plan.featured ? "default" : "warmOutline",
                        size: "lg",
                      }),
                      "mt-10 w-full",
                      plan.featured && "shadow-md"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="border-t border-border bg-muted">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center md:px-12 md:py-28">
            <h2 className="text-3xl md:text-4xl">Weekend-project certified</h2>
            <p className="font-body-thin text-muted-foreground mt-6 text-lg leading-relaxed">
              LaunchPage is a sandbox for poking auth, workspaces, a public page, and email previews before you mortgage
              your attention span to billing APIs.
            </p>
            <p className="font-mono-technical text-muted-foreground mt-4 text-sm">
              /* Bricolage for yelling · Outfit for explaining · Plex Mono for the fine print */
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-12 md:py-16">
          <LaunchLogo className="text-sm" />
          <p className="font-body-thin text-muted-foreground max-w-md text-sm leading-relaxed">
            © {new Date().getFullYear()} LaunchPage — loud grain, quiet layout, slightly unserious footers.
          </p>
        </div>
      </footer>
    </div>
  );
}
