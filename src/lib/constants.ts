export const SITE_NAME = "STYLEATLAS";
export const SITE_TAGLINE = "Nigeria's Trusted Fashion Directory";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://styleatlas.ng";

export type CategorySeed = {
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export const PROFESSIONAL_CATEGORIES: CategorySeed[] = [
  { name: "Fashion Designers", slug: "fashion-designers", description: "Custom fashion design and made-to-measure couture.", icon: "Scissors" },
  { name: "Fashion Brands", slug: "fashion-brands", description: "Ready-to-wear labels and fashion houses.", icon: "ShoppingBag" },
  { name: "Stylists", slug: "stylists", description: "Personal and editorial fashion stylists.", icon: "Sparkles" },
  { name: "Fashion Schools", slug: "fashion-schools", description: "Tailoring, design, and styling training institutions.", icon: "GraduationCap" },
  { name: "Tailors", slug: "tailors", description: "Bespoke tailoring and alterations.", icon: "Ruler" },
  { name: "Makeup Artists", slug: "makeup-artists", description: "Bridal and editorial makeup professionals.", icon: "Brush" },
  { name: "Model Agencies", slug: "model-agencies", description: "Modeling talent and agency representation.", icon: "Users" },
  { name: "Fabric Vendors", slug: "fabric-vendors", description: "Ankara, lace, and premium fabric suppliers.", icon: "Layers" },
  { name: "Bridal Houses", slug: "bridal-houses", description: "Wedding gowns and bridal styling.", icon: "Gem" },
  { name: "Fashion Photographers", slug: "fashion-photographers", description: "Editorial and lookbook photography.", icon: "Camera" },
  { name: "Fashion Consultants", slug: "fashion-consultants", description: "Brand and wardrobe consulting services.", icon: "Briefcase" },
  { name: "Event Organizers", slug: "fashion-event-organizers", description: "Fashion show and event production.", icon: "CalendarDays" },
];

export const OUTFIT_CATEGORIES: CategorySeed[] = [
  { name: "Aso Ebi", slug: "aso-ebi", description: "Coordinated celebration outfits.", icon: "Shirt" },
  { name: "Ankara Styles", slug: "ankara-styles", description: "Contemporary Ankara fashion.", icon: "Shirt" },
  { name: "Bridal Wear", slug: "bridal-wear", description: "Wedding gowns and bridal fashion.", icon: "Gem" },
  { name: "Wedding Guest Looks", slug: "wedding-guest-looks", description: "Guest-appropriate celebration style.", icon: "Shirt" },
  { name: "Agbada", slug: "agbada", description: "Traditional and modern agbada styles.", icon: "Shirt" },
  { name: "Senator Styles", slug: "senator-styles", description: "Senator wear for men.", icon: "Shirt" },
  { name: "Corporate Fashion", slug: "corporate-fashion", description: "Workwear and office style.", icon: "Briefcase" },
  { name: "Children's Fashion", slug: "childrens-fashion", description: "Kids' occasion and everyday wear.", icon: "Baby" },
  { name: "Native Wear", slug: "native-wear", description: "Traditional Nigerian attire.", icon: "Shirt" },
  { name: "Luxury Evening Dresses", slug: "luxury-evening-dresses", description: "Red-carpet and gala fashion.", icon: "Gem" },
  { name: "Casual Fashion", slug: "casual-fashion", description: "Everyday style inspiration.", icon: "Shirt" },
  { name: "Church Fashion", slug: "church-fashion", description: "Sunday service style.", icon: "Shirt" },
  { name: "Graduation Outfits", slug: "graduation-outfits", description: "Convocation and graduation looks.", icon: "GraduationCap" },
  { name: "Birthday Outfits", slug: "birthday-outfits", description: "Celebration-ready fashion.", icon: "PartyPopper" },
  { name: "Maternity Fashion", slug: "maternity-fashion", description: "Stylish maternity wear.", icon: "Heart" },
];

export type CitySeed = { name: string; slug: string; state: string };

export const FEATURED_CITIES: CitySeed[] = [
  { name: "Lagos", slug: "lagos", state: "Lagos" },
  { name: "Abuja", slug: "abuja", state: "FCT" },
  { name: "Port Harcourt", slug: "port-harcourt", state: "Rivers" },
  { name: "Calabar", slug: "calabar", state: "Cross River" },
  { name: "Enugu", slug: "enugu", state: "Enugu" },
  { name: "Ibadan", slug: "ibadan", state: "Oyo" },
  { name: "Benin City", slug: "benin-city", state: "Edo" },
  { name: "Warri", slug: "warri", state: "Delta" },
  { name: "Uyo", slug: "uyo", state: "Akwa Ibom" },
  { name: "Kano", slug: "kano", state: "Kano" },
  { name: "Kaduna", slug: "kaduna", state: "Kaduna" },
  { name: "Owerri", slug: "owerri", state: "Imo" },
  { name: "Asaba", slug: "asaba", state: "Delta" },
];

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara",
];

export const PRICE_RANGES = [
  { label: "₦", value: "budget" },
  { label: "₦₦", value: "mid" },
  { label: "₦₦₦", value: "premium" },
  { label: "₦₦₦₦", value: "luxury" },
];

export const VERIFICATION_LEVELS = [
  "unverified",
  "identity_verified",
  "business_verified",
  "address_verified",
  "premium_verified",
] as const;

export const PLAN_SLUGS = ["free", "standard", "premium", "elite"] as const;

export const USER_ROLES = [
  "visitor",
  "customer",
  "professional",
  "professional_staff",
  "admin",
  "super_admin",
] as const;

export const JOB_TYPES = ["full_time", "part_time", "contract", "internship"] as const;

export const EVENT_TYPES = [
  "fashion_show",
  "workshop",
  "exhibition",
  "competition",
  "training",
  "pop_up_shop",
  "brand_launch",
] as const;
