"use client";

import { authLog, authWarn, redactEmail } from "@/lib/auth-log";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    authLog("client", "login submit", {
      next,
      email: redactEmail(email.trim()),
    });
    try {
      const supabase = createClient();
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      authLog("client", "supabase client env", {
        hasUrl: Boolean(url),
        urlHost: url ? new URL(url).host : null,
      });

      const { data: signData, error: signError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signError) {
        authLog("client", "signInWithPassword error", {
          message: signError.message,
          name: signError.name,
          status: signError.status,
        });
        setError(signError.message);
        return;
      }

      authLog("client", "signInWithPassword ok", {
        hasSession: Boolean(signData.session),
        hasUser: Boolean(signData.user),
        userId: signData.user?.id ?? null,
        expiresAt: signData.session?.expires_at ?? null,
      });

      const { data: sessionCheck, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        authWarn("client", "getSession after signIn failed", {
          message: sessionError.message,
        });
      } else {
        authLog("client", "getSession after signIn", {
          hasSession: Boolean(sessionCheck.session),
          userId: sessionCheck.session?.user?.id ?? null,
        });
      }

      authLog("client", "navigating after login", { next });
      router.replace(next);
      router.refresh();
      authLog("client", "router.replace + refresh invoked");
    } catch (err) {
      authWarn("client", "login unexpected error", {
        name: err instanceof Error ? err.name : typeof err,
        message: err instanceof Error ? err.message : String(err),
      });
      setError("Something went wrong. Check the console for [auth] logs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Opening the door…" : "Log me in"}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        New here?{" "}
        <Link href="/signup" className="text-primary font-medium underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
