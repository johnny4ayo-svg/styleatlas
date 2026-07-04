export type UserRole =
  | "visitor"
  | "customer"
  | "professional"
  | "professional_staff"
  | "admin"
  | "super_admin";

export type VerificationLevel =
  | "unverified"
  | "identity_verified"
  | "business_verified"
  | "address_verified"
  | "premium_verified";

export type ListingStatus = "draft" | "pending" | "active" | "suspended" | "rejected";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "expired" | "trialing";
export type PlanSlug = "free" | "standard" | "premium" | "elite";
export type BillingCycle = "monthly" | "yearly";
export type PaymentProvider = "paystack" | "flutterwave";

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  city: string | null;
  state: string | null;
  country: string;
  status: "active" | "suspended" | "deleted";
  notification_preferences: { email?: boolean; sms?: boolean } | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  icon: string | null;
  status: "active" | "inactive";
  seo_title: string | null;
  seo_description: string | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: PlanSlug;
  description: string;
  monthly_price: number;
  yearly_price: number;
  currency: string;
  features: string[];
  limits: {
    portfolio_images: number;
    gallery_images: number;
    lead_access: "limited" | "standard" | "priority" | "full";
    job_postings: number;
    event_submissions: number;
    staff_accounts: number;
    featured_eligible: boolean;
    homepage_eligible: boolean;
  };
  badge: string | null;
  sort_order: number;
  status: "active" | "inactive";
}

export interface ProfessionalAccount {
  id: string;
  owner_id: string;
  business_name: string;
  slug: string;
  description: string | null;
  brand_story: string | null;
  category_id: string;
  category?: Category;
  logo_url: string | null;
  cover_image_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  youtube: string | null;
  address: string | null;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  price_range: "budget" | "mid" | "premium" | "luxury" | null;
  availability_status: "available" | "booked" | "unavailable";
  verification_status: VerificationLevel;
  subscription_plan_id: string | null;
  plan?: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  profile_completion_score: number;
  rating_average?: number;
  review_count?: number;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  professional_account_id: string;
  title: string;
  description: string | null;
  image_url: string;
  video_url: string | null;
  category_id: string | null;
  tags: string[];
  alt_text: string;
  status: "active" | "hidden";
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  professional_account_id: string;
  customer_id: string;
  customer?: Pick<Profile, "id" | "full_name" | "avatar_url">;
  rating: number;
  title: string | null;
  body: string;
  service_used: string | null;
  communication_rating: number | null;
  quality_rating: number | null;
  delivery_rating: number | null;
  value_rating: number | null;
  status: "pending" | "published" | "hidden" | "rejected";
  professional_reply: string | null;
  professional_reply_at: string | null;
  photos?: { id: string; image_url: string; alt_text: string | null }[];
  created_at: string;
  updated_at: string;
}

export interface OutfitInspiration {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string;
  video_url: string | null;
  category_id: string;
  category?: Category;
  designer_id: string | null;
  designer?: Pick<ProfessionalAccount, "id" | "business_name" | "slug" | "logo_url">;
  occasion: string | null;
  color: string | null;
  tags: string[];
  alt_text: string;
  status: ListingStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  professional_account_id: string | null;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  city: string;
  state: string;
  job_type: "full_time" | "part_time" | "contract" | "internship";
  salary_min: number | null;
  salary_max: number | null;
  application_url: string | null;
  application_email: string | null;
  status: ListingStatus;
  expires_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
}

export interface FashionEvent {
  id: string;
  professional_account_id: string | null;
  title: string;
  slug: string;
  description: string;
  event_type: string;
  venue: string;
  city: string;
  state: string;
  start_time: string;
  end_time: string | null;
  ticket_url: string | null;
  registration_url: string | null;
  image_url: string | null;
  status: ListingStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  content_json: unknown;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
  published_at: string | null;
  scheduled_at: string | null;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  focus_keyword: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  noindex: boolean;
  is_sponsored: boolean;
  schema_type: "Article" | "BlogPosting" | "NewsArticle";
  faq_json: { question: string; answer: string }[];
  reading_time: number;
  categories?: Category[];
  tags?: { id: string; name: string; slug: string }[];
  created_at: string;
  updated_at: string;
}

export interface CustomerRequest {
  id: string;
  customer_id: string;
  title: string;
  category_id: string;
  city: string;
  state: string;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  number_of_outfits: number | null;
  details: string;
  inspiration_files: string[];
  status: "open" | "matched" | "closed" | "spam";
  created_at: string;
}

export type LeadSourceType =
  | "profile_inquiry"
  | "whatsapp_click"
  | "phone_reveal"
  | "contact_form"
  | "marketplace_request"
  | "ai_chat"
  | "blog_cta"
  | "inspiration_cta"
  | "pricing_cta"
  | "event_cta"
  | "school_inquiry"
  | "job_application";

export type LeadStatus =
  | "new"
  | "viewed"
  | "contacted"
  | "responded"
  | "won"
  | "lost"
  | "spam"
  | "archived";

export interface Lead {
  id: string;
  source_type: LeadSourceType;
  source_page: string;
  professional_account_id: string | null;
  customer_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  category_id: string | null;
  budget: string | null;
  message: string | null;
  status: LeadStatus;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
