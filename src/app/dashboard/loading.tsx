export default function DashboardLoading() {
  return (
    <div className="bg-muted flex min-h-[50vh] flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    </div>
  );
}
