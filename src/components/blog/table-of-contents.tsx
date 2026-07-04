import type { TocHeading } from "@/lib/toc";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  if (headings.length < 2) return null;

  return (
    <nav className="rounded-lg border border-charcoal-100 bg-ivory p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gold-600">Table of Contents</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
            <a href={`#${heading.id}`} className="text-charcoal-600 hover:text-gold-600">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
