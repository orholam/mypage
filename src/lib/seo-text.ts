/** Truncate for HTML meta title (~60 chars) and description (~155) without breaking words mid-way when possible. */
export function seoTitle(text: string, max = 60): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > max * 0.5) return `${cut.slice(0, lastSpace)}…`;
  return `${cut}…`;
}

export function seoDescription(text: string, max = 155): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > max * 0.5) return `${cut.slice(0, lastSpace)}…`;
  return `${cut}…`;
}
