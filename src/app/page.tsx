import { LaunchLogo } from "@/components/brand/launch-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
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
    title: "Templates you can make yours",
    description:
      "Start from a layout you like, then edit headline, subtext, and call-to-action until it sounds like you.",
  },
  {
    icon: Mail,
    title: "Email drafts you can sanity-check",
    description:
      "Welcome and launch emails with a readable preview before you send anything to real subscribers.",
  },
  {
    icon: BarChart3,
    title: "Signups at a glance",
    description: "See how many people joined and how you’re doing against your plan limits—no spreadsheet required.",
  },
  {
    icon: Share2,
    title: "A link you’re happy to share",
    description: "A clean public page and URL you can drop in a bio, newsletter, or social profile.",
  },
];

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Run the app locally with the full dashboard and editor. No credit card, no time limit for tinkering.",
    highlights: ["All templates", "Page editor & preview", "Submissions & basic stats"],
    cta: "Create an account",
    href: "/signup",
    featured: false,
  },
  {
    name: "Your deployment",
    price: "Custom",
    description: "When you’re ready to go live, connect your own hosting and database. Your infrastructure, your rules.",
    highlights: ["Use your own database", "Custom domain when you set it up", "You keep your data"],
    cta: "Get started",
    href: "/signup",
    featured: true,
  },
];

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LaunchPage",
  url: getSiteUrl().origin,
  description:
    "Create a landing page, collect signups, and manage email drafts from one dashboard. Start free, deploy on your own stack when you’re ready.",
} as const;

export default function Home() {
  return (
    <div className="relative z-10 min-h-screen text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />
      <Link
        href="/"
        className="absolute left-6 top-6 z-50 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:left-10 md:top-8"
        aria-label="LaunchPage home"
      >
        <LaunchLogo />
      </Link>

      <main>
        {/* Full viewport height so the rule above Features stays below the fold */}
        <section className="flex min-h-dvh flex-col border-b border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-28 pt-36 md:px-12 md:pb-36 md:pt-44 lg:pb-40 lg:pt-52">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-primary mb-8 inline-flex items-center gap-2 rounded-full border-2 border-primary bg-card px-5 py-2.5 text-sm font-semibold shadow-sm">
                <Sparkles className="size-4" aria-hidden />
                Waitlists &amp; simple pages
              </p>
              <h1 className="font-display text-4xl leading-[1.08] sm:text-5xl md:text-6xl md:leading-[1.05]">
                <span className="text-foreground">Launch a page that</span>
                <br />
                <span className="text-primary">collects signups for you.</span>
              </h1>
              <p className="font-mono-technical text-muted-foreground mt-6 text-xs font-medium uppercase tracking-[0.2em]">
                Edit · preview · share
              </p>
              <p className="font-body-thin text-muted-foreground mx-auto mt-8 max-w-xl text-lg leading-relaxed text-pretty md:text-xl">
                Pick a template, write your copy, and publish a focused landing page. Manage submissions and email
                drafts from one dashboard—so you can spend time on the product, not wiring forms.
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
                  See what&apos;s included
                </a>
              </div>
              <p className="text-muted-foreground mt-6 text-center text-sm">
                Already registered?{" "}
                <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Log in
                </Link>
              </p>
              <ul className="font-body-thin text-muted-foreground mx-auto mt-14 flex max-w-2xl flex-col gap-3 text-left text-sm sm:mt-16 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-3">
                {[
                  "Straightforward pricing",
                  "Bring your own hosting when you outgrow local",
                  "Templates, live preview, and shareable links",
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
                Features
              </p>
              <h2 className="text-3xl md:text-4xl">Everything in one dashboard</h2>
              <p className="font-body-thin text-muted-foreground mt-4 text-lg leading-relaxed">
                Edit your public page, tweak emails, and watch signups—without juggling a pile of tools.
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
                Pricing
              </p>
              <h2 className="text-3xl md:text-4xl">Start free, deploy when you’re ready</h2>
              <p className="font-body-thin text-muted-foreground mt-4 text-lg leading-relaxed">
                Use the full experience locally at no cost. When you want a live site, plug in your own stack.
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
                      For production
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
            <h2 className="text-3xl md:text-4xl">Built for makers shipping a first version</h2>
            <p className="font-body-thin text-muted-foreground mt-6 text-lg leading-relaxed">
              LaunchPage gives you accounts, workspaces, a public waitlist or simple page, and email templates—so you can
              validate an idea or onboard early users without assembling a dozen services first.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-12 md:py-16">
          <LaunchLogo className="text-sm" />
          <p className="font-body-thin text-muted-foreground max-w-md text-sm leading-relaxed">
            © {new Date().getFullYear()} LaunchPage. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
