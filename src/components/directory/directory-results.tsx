import { ListingCard } from "@/components/directory/listing-card";
import { FilterSidebar } from "@/components/directory/filter-sidebar";
import { MobileFilterDrawer } from "@/components/directory/mobile-filter-drawer";
import { SortDropdown } from "@/components/directory/sort-dropdown";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { formatNumber } from "@/lib/utils";
import type { PaginatedResult, ProfessionalAccount } from "@/types";

export function DirectoryResults({
  result,
  basePath,
  currentSearchParams,
}: {
  result: PaginatedResult<ProfessionalAccount>;
  basePath: string;
  currentSearchParams: Record<string, string | undefined>;
}) {
  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(
      Object.entries(currentSearchParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
      <div className="hidden lg:block">
        <FilterSidebar />
      </div>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {formatNumber(result.count)} professional{result.count === 1 ? "" : "s"} found
          </p>
          <div className="flex items-center gap-2">
            <MobileFilterDrawer />
            <SortDropdown />
          </div>
        </div>

        {result.data.length === 0 ? (
          <EmptyState
            title="No listings match your filters yet"
            description="Try widening your search, or submit a fashion request and let matching professionals come to you."
            actionLabel="Submit a Fashion Request"
            actionHref="/marketplace"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {result.data.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <Pagination currentPage={result.page} totalPages={result.totalPages} buildHref={buildPageHref} />
        </div>
      </div>
    </div>
  );
}
