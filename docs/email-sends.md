# Sending welcome and launch emails (later)

This app stores template fields in `email_templates` and renders a **Mail Preview** in the dashboard. Outbound email is intentionally not implemented in v1 so the UI stays deployable without an SMTP provider.

## Recommended path

1. **Provider** — Use [Resend](https://resend.com), SendGrid, Postmark, or AWS SES. Create an API key and store it as a Supabase secret (Dashboard → Project Settings → Edge Functions → Secrets), e.g. `RESEND_API_KEY`.

2. **Edge Function** — Add a Supabase Edge Function (e.g. `send-transactional`) that:
   - Accepts a small JSON payload: `workspace_id`, `kind` (`welcome` | `launch`), and optionally `to_email`.
   - Uses the **service role** only inside the function (never in the browser) to load the row from `email_templates` and render HTML using the same fields as the preview (subject, header, greeting, CTA label, CTA URL).
   - Calls the provider API to send the message.

3. **Triggers** — Invoke the function when:
   - A new row is inserted into `waitlist_submissions` (welcome email), via Database Webhook or a Postgres trigger → `pg_net` / queue table consumed by a scheduled function; or
   - You add an explicit **“Send test”** button in the dashboard that POSTs to the function with the current user’s email.

4. **Rate limits & abuse** — Cap sends per workspace, validate email format, and consider double opt-in before automating bulk mail.

5. **Templates in production** — Move from inline strings to a small HTML layout (or React-email rendered to HTML in the Edge Function) so clients look good in all clients.

## Local testing

Use Supabase CLI (`supabase functions serve`) with secrets in `.env` for the CLI, and call the function with `curl` before wiring webhooks.
