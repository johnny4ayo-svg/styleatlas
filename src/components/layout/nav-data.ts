import { PROFESSIONAL_CATEGORIES, OUTFIT_CATEGORIES, FEATURED_CITIES } from "@/lib/constants";

export const MEGA_MENU_SECTIONS = [
  {
    label: "Directory",
    href: "/directory",
    columns: [
      {
        heading: "Browse by category",
        items: PROFESSIONAL_CATEGORIES.slice(0, 8).map((c) => ({
          label: c.name,
          href: `/directory/${c.slug}`,
        })),
      },
      {
        heading: "Popular cities",
        items: FEATURED_CITIES.slice(0, 8).map((c) => ({
          label: `${c.name}`,
          href: `/directory/fashion-designers/${c.slug}`,
        })),
      },
      {
        heading: "Featured",
        items: [
          { label: "Bridal Designers", href: "/directory/bridal-houses" },
          { label: "Aso Ebi Designers", href: "/directory/fashion-designers?specialty=aso-ebi" },
          { label: "Ankara Designers", href: "/directory/fashion-designers?specialty=ankara" },
          { label: "Fashion Schools", href: "/directory/fashion-schools" },
        ],
      },
    ],
  },
  {
    label: "Inspiration",
    href: "/inspiration",
    columns: [
      {
        heading: "Shop the look",
        items: OUTFIT_CATEGORIES.slice(0, 8).map((c) => ({
          label: c.name,
          href: `/inspiration/${c.slug}`,
        })),
      },
      {
        heading: "Occasions",
        items: OUTFIT_CATEGORIES.slice(8).map((c) => ({
          label: c.name,
          href: `/inspiration/${c.slug}`,
        })),
      },
    ],
  },
];

export const PRIMARY_NAV = [
  { label: "Jobs", href: "/jobs" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];
