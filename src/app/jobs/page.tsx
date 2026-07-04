import Link from "next/link";
import { MapPin, Briefcase } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { searchJobs } from "@/lib/data/jobs-events-search";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Fashion Jobs in Nigeria — Tailoring, Styling & Modeling Roles | STYLEATLAS",
  description:
    "Find fashion jobs across Nigeria: tailoring, fashion internships, modeling, styling, fashion assistant, photography, marketing, and instructor roles.",
  path: "/jobs",
});

interface Props {
  searchParams: { city?: string; type?: string; page?: string };
}

export default async function JobsPage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? "1");
  const { data: jobs, count } = await searchJobs({ city: searchParams.city, jobType: searchParams.type, page });
  const totalPages = Math.max(1, Math.ceil(count / 20));

  return (
    <div className="section-container py-10">
      <h1 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">Fashion Jobs</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Tailoring, styling, modeling, and fashion business roles from professionals and brands across Nigeria.
      </p>

      <div className="mt-10">
        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No open roles right now"
            description="Check back soon, or list your business to post your own openings."
            actionLabel="List Your Business"
            actionHref="/register?type=professional"
          />
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="block rounded-lg border border-charcoal-100 bg-white p-5 shadow-card transition hover:border-gold-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-charcoal-900">{job.title}</h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.city}, {job.state}</span>
                      <span>Posted {formatDate(job.created_at)}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">{job.job_type.replace("_", " ")}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} buildHref={(p) => `/jobs?page=${p}`} />
        </div>
      </div>
    </div>
  );
}
