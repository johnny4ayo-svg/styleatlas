import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-charcoal-200 text-charcoal-600 hover:border-gold-300",
          currentPage === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page, i) => (
        <span key={page} className="flex items-center">
          {i > 0 && pages[i - 1] !== page - 1 && <span className="px-1 text-charcoal-300">…</span>}
          <Link
            href={buildHref(page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium",
              page === currentPage ? "bg-gold-400 text-charcoal-900" : "text-charcoal-600 hover:bg-charcoal-50"
            )}
          >
            {page}
          </Link>
        </span>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-charcoal-200 text-charcoal-600 hover:border-gold-300",
          currentPage === totalPages && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
