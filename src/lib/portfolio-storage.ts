export const PORTFOLIO_BUCKET = "portfolio" as const;

export const PORTFOLIO_MAX_IMAGES = 12;

/** Aligned with bucket `file_size_limit` in migration `006_portfolio_storage.sql`. */
export const PORTFOLIO_MAX_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXT_FROM_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function portfolioPublicUrl(storagePath: string): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const encoded = storagePath
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${base}/storage/v1/object/public/${PORTFOLIO_BUCKET}/${encoded}`;
}

export function portfolioObjectPath(workspaceId: string, pageId: string, mime: string): string | null {
  const ext = EXT_FROM_MIME[mime];
  if (!ext) return null;
  return `${workspaceId}/${pageId}/${crypto.randomUUID()}.${ext}`;
}

export function validatePortfolioUpload(file: File): string | null {
  if (!ALLOWED_MIME.has(file.type)) {
    return "Use a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > PORTFOLIO_MAX_FILE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
}

/** Reject path traversal and wrong prefix; storage RLS still enforces workspace ownership. */
export function isPortfolioPathForPage(path: string, workspaceId: string, pageId: string): boolean {
  if (!path || path.includes("..")) return false;
  const prefix = `${workspaceId}/${pageId}/`;
  if (!path.startsWith(prefix)) return false;
  const rest = path.slice(prefix.length);
  if (!rest || rest.includes("/")) return false;
  return true;
}
