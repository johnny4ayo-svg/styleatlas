import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Clock, Briefcase } from "lucide-react";
import { getJobBySlug } from "@/lib/data/jobs-events";
import { buildMetadata, jobPostingSchema, jsonLdScript } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobApplicationForm } from "@/components/jobs/job-application-form";
import { formatDate, formatNaira } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  if (!job) return {};
  return buildMetadata({
    title: job.seo_title ?? `${job.title} — ${job.city} | STYLEATLAS Jobs`,
    description: job.seo_description ?? job.description.slice(0, 155),
    path: `/jobs/${job.slug}`,
  });
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJobBySlug(params.slug);
  if (!job) notFound();

  return (
    <div className="section-container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          jobPostingSchema({
            title: job.title,
            description: job.description,
            datePosted: job.created_at,
            validThrough: job.expires_at,
            employmentType: job.job_type,
            city: job.city,
            state: job.state,
            salaryMin: job.salary_min,
            salaryMax: job.salary_max,
          })
        )}
      />
      <Breadcrumbs items={[{ label: "Jobs", href: "/jobs" }, { label: job.title }]} />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-900">{job.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.city}, {job.state}</span>
            <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> <span className="capitalize">{job.job_type.replace("_", " ")}</span></span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Posted {formatDate(job.created_at)}</span>
          </div>
          {(job.salary_min || job.salary_max) && (
            <Badge variant="gold" className="mt-3">
              {formatNaira(job.salary_min ?? 0, { compact: true })}
              {job.salary_max ? ` – ${formatNaira(job.salary_max, { compact: true })}` : ""} / month
            </Badge>
          )}

          <div className="prose-editorial mt-8 whitespace-pre-line">{job.description}</div>

          {job.application_url && (
            <Button asChild size="lg" className="mt-8">
              <a href={job.application_url} target="_blank" rel="noopener noreferrer">Apply on Company Site</a>
            </Button>
          )}
        </div>

        <div>
          {!job.application_url && <JobApplicationForm jobId={job.id} />}
          {job.application_email && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Or email your application to{" "}
              <Link href={`mailto:${job.application_email}`} className="underline">
                {job.application_email}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
