export type SiteKind = "waitlist" | "personal";

export type Workspace = {
  id: string;
  owner_id: string;
  name: string;
  plan_label: string;
  subscriber_cap: number;
  created_at: string;
  /** Present after `003_site_kind.sql`; treat missing as waitlist. */
  site_kind?: SiteKind;
  /** Present after `004_workspace_subdomain.sql`. */
  subdomain?: string;
};

export type WaitlistPage = {
  id: string;
  workspace_id: string;
  slug: string;
  template_id: string;
  headline: string;
  subheadline: string;
  cta_label: string;
  cta_url: string;
  /** JSON: profile links, waitlist pitch fields — see `parsePageExtras` in `@/lib/page-extras`. */
  extras?: unknown;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type EmailTemplateRow = {
  id: string;
  workspace_id: string;
  kind: "welcome" | "launch";
  subject: string;
  header_text: string;
  body_greeting: string;
  cta_label: string;
  cta_url: string;
};

export type PublicPageRow = Pick<
  WaitlistPage,
  "id" | "slug" | "headline" | "subheadline" | "cta_label" | "template_id" | "cta_url" | "extras"
> & {
  /** From RPC after `003_site_kind.sql`. */
  site_kind?: SiteKind;
};
