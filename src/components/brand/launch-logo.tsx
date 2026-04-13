import { cn } from "@/lib/utils";

export function LaunchLogo({
  className,
  variant = "default",
}: {
  className?: string;
  /** Wordmark + mark for `bg-primary` panels (login/signup hero column) */
  variant?: "default" | "onPrimary";
}) {
  const onPrimary = variant === "onPrimary";
  return (
    <span
      className={cn(
        "font-display inline-flex items-center gap-2 text-lg font-extrabold tracking-tight",
        onPrimary ? "text-primary-foreground" : "text-foreground",
        className
      )}
    >
      <svg
        className={cn("size-8 shrink-0", onPrimary ? "text-primary-foreground" : "text-primary")}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M6 24L14 8L18 16L26 24H6Z"
          fill="currentColor"
          opacity="0.92"
        />
        <path d="M10 24L16 12L22 24H10Z" fill="white" />
      </svg>
      <span>LaunchPage</span>
    </span>
  );
}
