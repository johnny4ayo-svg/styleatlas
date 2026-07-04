import { formatNaira } from "@/lib/utils";

interface ServiceRow {
  id: string;
  name: string;
  description: string | null;
  price_min: number | null;
  price_max: number | null;
  duration: string | null;
}

export function ServicesList({ services }: { services: ServiceRow[] }) {
  if (services.length === 0) return null;

  return (
    <section className="border-t border-charcoal-100 py-10">
      <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal-900">Services Offered</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <div key={service.id} className="rounded-lg border border-charcoal-100 p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-base font-semibold text-charcoal-900">{service.name}</h3>
              {(service.price_min || service.price_max) && (
                <span className="whitespace-nowrap text-sm font-semibold text-gold-600">
                  {formatNaira(service.price_min ?? 0, { compact: true })}
                  {service.price_max && service.price_max !== service.price_min
                    ? ` – ${formatNaira(service.price_max, { compact: true })}`
                    : ""}
                </span>
              )}
            </div>
            {service.description && <p className="mt-1.5 text-sm text-muted-foreground">{service.description}</p>}
            {service.duration && <p className="mt-2 text-xs text-charcoal-400">Duration: {service.duration}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
