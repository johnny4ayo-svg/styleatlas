import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { getEventBySlug } from "@/lib/data/jobs-events";
import { buildMetadata, eventSchema, jsonLdScript } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ShareButton } from "@/components/shared/share-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return {};
  return buildMetadata({
    title: event.seo_title ?? `${event.title} — ${event.city} | STYLEATLAS Events`,
    description: event.seo_description ?? event.description.slice(0, 155),
    path: `/events/${event.slug}`,
    image: event.image_url ?? undefined,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  return (
    <div className="section-container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          eventSchema({
            name: event.title,
            description: event.description,
            startDate: event.start_time,
            endDate: event.end_time,
            venue: event.venue,
            city: event.city,
            state: event.state,
            image: event.image_url,
            url: `/events/${event.slug}`,
          })
        )}
      />
      <Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: event.title }]} />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          {event.image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-charcoal-100">
              <Image src={event.image_url} alt={event.title} fill priority className="object-cover" />
            </div>
          )}
          <h1 className="mt-6 font-serif text-3xl font-semibold text-charcoal-900">{event.title}</h1>
          <Badge variant="outline" className="mt-2 capitalize">{event.event_type.replace("_", " ")}</Badge>
          <div className="prose-editorial mt-6 whitespace-pre-line">{event.description}</div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-charcoal-100 p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-charcoal-800">
              <CalendarDays className="h-4 w-4 text-gold-500" />
              {formatDate(event.start_time, { dateStyle: "full", timeStyle: "short" })}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-charcoal-800">
              <MapPin className="h-4 w-4 text-gold-500" /> {event.venue}, {event.city}, {event.state}
            </p>
          </div>

          {event.ticket_url && (
            <Button asChild size="lg" className="w-full">
              <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                <Ticket className="h-4 w-4" /> Get Tickets
              </a>
            </Button>
          )}
          {event.registration_url && (
            <Button asChild variant="secondary" size="lg" className="w-full">
              <a href={event.registration_url} target="_blank" rel="noopener noreferrer">Register</a>
            </Button>
          )}
          <ShareButton title={event.title} path={`/events/${event.slug}`} />
        </div>
      </div>
    </div>
  );
}
