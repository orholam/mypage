import { SignupForm } from "@/components/auth/signup-form";
import { LaunchLogo } from "@/components/brand/launch-logo";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
      <div className="organic-noise relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex lg:p-14 xl:p-16">
        <div className="relative">
          <span className="font-body-thin flex items-center gap-2 text-sm">
            <Rocket className="size-4" aria-hidden />
            LaunchPage
          </span>
        </div>
        <div className="relative max-w-md">
          <p className="font-display text-3xl font-extrabold leading-tight text-balance md:text-4xl">
            First page, no manifesto required.
          </p>
          <p className="mt-6 text-base font-light leading-relaxed text-primary-foreground/88">
            Sign up, slap a template on it, save, share. If it’s ugly we can blame the gradient (it’s never the gradient).
          </p>
        </div>
        <p className="relative font-mono-technical text-xs font-medium text-primary-foreground/65">
          add supabase · data survives refreshes
        </p>
      </div>

      <div className="flex min-h-screen flex-col">
        <header className="border-b border-border/60 bg-card/70 px-6 backdrop-blur-sm lg:border-0 lg:bg-transparent lg:px-10">
          <div className="mx-auto flex h-16 max-w-md items-center lg:max-w-lg lg:pt-10">
            <Link href="/">
              <LaunchLogo />
            </Link>
          </div>
        </header>
        <main className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-10 lg:py-16">
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
  );
}
