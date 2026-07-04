import Link from "next/link";
import { Briefcase, CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Job, FashionEvent } from "@/types";

export function JobsEventsPreview({ jobs, events }: { jobs: Job[]; events: FashionEvent[] }) {
  if (jobs.length === 0 && events.length === 0) return null;

  return (
    <section className="section-container py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-charcoal-900">
              <Briefcase className="h-5 w-5 text-gold-500" /> Fashion Jobs
            </h2>
            <Link href="/jobs" className="text-sm font-medium text-gold-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="block rounded-lg border border-charcoal-100 bg-white p-4 shadow-card transition hover:border-gold-300"
              >
                <p className="font-serif text-base font-semibold text-charcoal-900">{job.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.city}</span>
                  <span className="capitalize">{job.job_type.replace("_", " ")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-charcoal-900">
              <CalendarDays className="h-5 w-5 text-gold-500" /> Fashion Events
            </h2>
            <Link href="/events" className="text-sm font-medium text-gold-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="flex items-center justify-between rounded-lg border border-charcoal-100 bg-white p-4 shadow-card transition hover:border-gold-300"
              >
                <div>
                  <p className="font-serif text-base font-semibold text-charcoal-900">{event.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(event.start_time)} · {event.city}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-gold-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
