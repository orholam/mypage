import { SignupForm } from "@/components/auth/signup-form";
import { LaunchLogo } from "@/components/brand/launch-logo";
import Link from "next/link";

/** Corner placement aligned with marketing `page.tsx` — must sit outside `.organic-noise` so clicks aren’t swallowed. */
const cornerLogoClass =
  "absolute left-6 top-6 z-50 rounded-md outline-none md:left-10 md:top-8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function SignupPage() {
  return (
    <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden min-h-dvh lg:block">
        <Link
          href="/"
          className={`${cornerLogoClass} focus-visible:ring-primary-foreground/50 focus-visible:ring-offset-primary`}
          aria-label="LaunchPage home"
        >
          <LaunchLogo variant="onPrimary" />
        </Link>
        <div className="organic-noise flex min-h-dvh flex-col bg-primary text-primary-foreground">
          <div className="flex min-h-0 flex-1 flex-col px-10 pb-10 pt-36 lg:px-14 lg:pb-14 lg:pt-44 xl:px-16 xl:pb-16 xl:pt-48">
            <div className="flex min-h-0 flex-1 flex-col justify-center">
              <div className="relative max-w-md">
                <p className="font-display text-3xl font-extrabold leading-tight text-balance md:text-4xl">
                  First page, no manifesto required.
                </p>
                <p className="mt-6 text-base font-light leading-relaxed text-primary-foreground/88">
                  Sign up, slap a template on it, save, share. If it’s ugly we can blame the gradient (it’s never the
                  gradient).
                </p>
              </div>
            </div>
            <p className="relative font-mono-technical text-xs font-medium text-primary-foreground/65">
              add supabase · data survives refreshes
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-dvh flex-col lg:min-h-screen">
        <Link
          href="/"
          className={`${cornerLogoClass} focus-visible:ring-offset-background lg:hidden`}
          aria-label="LaunchPage home"
        >
          <LaunchLogo />
        </Link>
        <div className="organic-noise relative flex min-h-0 flex-1 flex-col bg-background">
          <main className="flex flex-1 flex-col justify-center px-6 pb-16 pt-40 md:px-10 md:pb-20 md:pt-44 lg:px-10 lg:pb-20 lg:pt-24">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg shadow-primary/10 md:p-10 lg:max-w-lg">
              <h1 className="font-display text-center text-3xl font-extrabold tracking-tight md:text-4xl">
                Create your account
              </h1>
              <p className="font-body-thin text-muted-foreground mb-8 mt-3 text-center text-base leading-relaxed">
                Big text fields, small commitment. We’ll nag you about templates later.
              </p>
              <SignupForm />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
