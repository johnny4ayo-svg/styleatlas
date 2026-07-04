import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { searchEvents } from "@/lib/data/jobs-events-search";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Fashion Events in Nigeria — Shows, Workshops & Pop-Ups | STYLEATLAS",
  description:
    "Discover upcoming Nigerian fashion shows, workshops, exhibitions, competitions, training programs, pop-up shops, and brand launches.",
  path: "/events",
});

interface Props {
  searchParams: { city?: string; type?: string; page?: string };
}

export default async function EventsPage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? "1");
  const { data: events, count } = await searchEvents({ city: searchParams.city, eventType: searchParams.type, page });
  const totalPages = Math.max(1, Math.ceil(count / 20));

  return (
    <div className="section-container py-10">
      <h1 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">Fashion Events</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Fashion shows, workshops, exhibitions, competitions, and pop-ups happening across Nigeria.
      </p>

      <div className="mt-10">
        {events.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming events yet"
            description="Check back soon, or submit your own fashion event for approval."
            actionLabel="Submit an Event"
            actionHref="/dashboard/events/new"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="overflow-hidden rounded-lg border border-charcoal-100 bg-white shadow-card transition hover:shadow-elevated"
              >
                <div className="relative aspect-[16/10] w-full bg-charcoal-100">
                  {event.image_url && <Image src={event.image_url} alt={event.title} fill className="object-cover" />}
                </div>
                <div className="p-4">
                  <h2 className="font-serif text-base font-semibold text-charcoal-900">{event.title}</h2>
                  <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(event.start_time, { dateStyle: "medium", timeStyle: "short" })}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.venue}, {event.city}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} buildHref={(p) => `/events?page=${p}`} />
        </div>
      </div>
    </div>
  );
}
