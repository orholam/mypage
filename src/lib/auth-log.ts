/**
 * Prefixed auth traces for production debugging (filter logs by "[auth]").
 * Never log passwords, refresh tokens, or full JWTs.
 */

const PREFIX = "[auth]";

export function redactEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "(invalid-email)";
  return `…${email.slice(at)}`;
}

export function authLog(
  scope: "client" | "middleware" | "server",
  message: string,
  details?: Record<string, unknown>
): void {
  if (details && Object.keys(details).length > 0) {
    console.log(`${PREFIX} ${scope}: ${message}`, details);
  } else {
    console.log(`${PREFIX} ${scope}: ${message}`);
  }
}

export function authWarn(
  scope: "client" | "middleware" | "server",
  message: string,
  details?: Record<string, unknown>
): void {
  if (details && Object.keys(details).length > 0) {
    console.warn(`${PREFIX} ${scope}: ${message}`, details);
  } else {
    console.warn(`${PREFIX} ${scope}: ${message}`);
  }
}
