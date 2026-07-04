import { slugify } from "@/lib/utils";

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Walks sanitized post HTML, assigns a stable slug id to every H2/H3, and
 * returns both the (mutated) HTML and the heading list for the table of
 * contents. Runs server-side on already-sanitized content only.
 */
export function extractHeadingsAndInjectIds(html: string): { html: string; headings: TocHeading[] } {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();

  const withIds = html.replace(/<h([23])(\s[^>]*)?>(.*?)<\/h\1>/gi, (match, level, attrs = "", inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id = slugify(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    headings.push({ id, text, level: Number(level) as 2 | 3 });
    const cleanedAttrs = (attrs || "").replace(/\sid="[^"]*"/i, "");
    return `<h${level} id="${id}"${cleanedAttrs}>${inner}</h${level}>`;
  });

  return { html: withIds, headings };
}
