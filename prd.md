You are a senior enterprise product engineer, UI/UX designer, frontend architect, backend architect, database designer, SEO engineer, and security engineer.

Build STYLEATLAS, a premium Nigerian fashion directory and marketplace platform.

This is not an MVP. Build it as a production-ready, market-ready, enterprise-grade application with polished UI, strong backend structure, SEO architecture, RBAC security, scalable database design, payment subscriptions, lead generation, AI live chat, dashboards, and a WordPress-like blogging CMS.

Brand name: STYLEATLAS

Core mission:
STYLEATLAS is Nigeria’s trusted online destination for discovering, comparing, reviewing, and contacting fashion designers, fashion brands, stylists, fashion schools, fashion jobs, fashion events, outfit inspiration, and fashion-related businesses.

The platform should feel like a luxury fashion magazine, a business directory, a marketplace, and a lead generation system combined into one modern ecosystem.

Required stack:

* Frontend: React with TypeScript
* Recommended framework: Next.js with React, because this platform needs strong SEO, indexable location pages, blog pages, designer pages, category pages, and fast performance
* Styling: Tailwind CSS
* UI system: shadcn/ui or a clean custom component system
* Icons: lucide-react
* Forms: react-hook-form plus Zod validation
* Data fetching: TanStack Query where useful
* Backend: Supabase only
* Database: Supabase Postgres
* Auth: Supabase Auth
* File storage: Supabase Storage
* Server-side functions: Supabase Edge Functions
* Emails: Resend
* Payments: Paystack and Flutterwave
* AI live chat: OpenAI through Supabase Edge Functions only
* Do not expose service role keys, payment secret keys, Resend keys, or OpenAI keys in the browser
* Do not trust frontend payment data. Always validate plans, prices, and permissions server-side

Application personality:
The design should be premium, editorial, modern, elegant, mobile-first, and trustworthy. Avoid a cheap classified-ad look. STYLEATLAS should look like a serious Nigerian fashion platform that can attract top designers, luxury brands, schools, stylists, brides, celebrities, students, and everyday customers.

Design direction:

* Luxury Nigerian fashion atmosphere
* Large fashion imagery
* Clean white and soft ivory backgrounds
* Deep black, champagne gold, emerald, burgundy, and warm neutral accents
* Elegant typography
* Strong spacing
* Clean cards
* Professional profile pages
* Fast navigation
* Smooth mobile UX
* Beautiful CTAs
* Trust badges
* Verified badges
* Strong search experience
* Clear lead capture points
* Editorial blog feel
* Premium dashboard design

Suggested color system:

* Primary: deep black or charcoal
* Accent: champagne gold
* Secondary accent: emerald green
* Warm background: ivory or soft cream
* Error: rich red
* Success: emerald
* Warning: amber
* Text: charcoal, slate, muted gray
* Cards: white with subtle borders and soft shadows

Typography:
Use a luxury editorial heading font and a clean readable body font. Suggested pairing:

* Headings: Playfair Display, Cormorant Garamond, or a similar elegant serif
* Body: Inter, Manrope, or similar modern sans-serif
  The UI should still load fast. Use optimized font loading.

Main user roles:

1. Visitor
2. Customer
3. Professional
4. Professional staff member
5. Admin
6. Super admin

Role descriptions:
Visitor:

* Can browse public pages
* Can search listings
* Can view public profiles
* Can read blog posts
* Can browse outfit inspiration
* Can view jobs and events
* Can start an inquiry, but account creation should be encouraged

Customer:

* Can create account
* Can save designers, brands, schools, stylists, jobs, and events
* Can submit fashion requests
* Can contact professionals
* Can leave verified reviews after a completed interaction
* Can upload review photos
* Can manage quote requests
* Can view chat history
* Can manage personal profile

Professional:

* Can create and manage business profile
* Can choose category: designer, brand, stylist, school, tailor, makeup artist, model agency, fabric vendor, bridal house, fashion photographer, fashion consultant, fashion event organizer
* Can add services
* Can upload portfolio
* Can manage galleries
* Can respond to leads
* Can reply to reviews
* Can manage subscription plan
* Can apply for verification
* Can post jobs, depending on plan
* Can submit events, depending on plan
* Can view analytics
* Can manage team members, depending on plan

Professional staff member:

* Invited by a professional account owner
* Can manage limited business functions based on permissions
* Permissions can include profile editing, leads, messages, gallery, jobs, events, billing read-only, reviews, analytics

Admin:

* Can manage users
* Can approve listings
* Can manage verification requests
* Can moderate reviews
* Can manage blog CMS
* Can manage jobs and events
* Can manage featured placements
* Can manage plans
* Can manage payments and disputes
* Can view platform analytics
* Can manage SEO pages
* Can manage support tickets
* Can manage AI chat knowledge base
* Can manage ads and sponsored placements

Super admin:

* Full platform access
* Can manage admins
* Can manage global settings
* Can manage payment provider settings
* Can manage security logs
* Can access audit logs
* Can configure feature flags

Subscription structure:
There is a free plan plus three paid professional plans:

1. Free
2. Standard
3. Premium
4. Elite

Do not hardcode prices. Plans and package limits should be loaded from the database and connected to the frontend pricing UI already designed. The frontend plan cards should display plan name, benefits, monthly price, yearly price, CTA, badge, and comparison table. The backend should validate every plan action against database records.

Suggested plan logic:
Free:

* Basic listing
* Limited portfolio images
* Basic contact button
* Limited visibility
* No featured placement
* No verification badge unless manually approved by admin
* Limited lead access

Standard:

* More portfolio images
* Better search visibility
* Access to customer leads
* Basic analytics
* Review reply
* WhatsApp tracking
* Basic profile customization

Premium:

* Priority listing
* Larger portfolio
* Featured category placement eligibility
* More lead access
* Job posting access
* Event submission access
* Advanced analytics
* Verification application priority
* More CTA buttons
* Social links
* Video embed support

Elite:

* Top visibility
* Homepage feature eligibility
* Premium badge
* Highest gallery limits
* Advanced lead insights
* Staff accounts
* Concierge verification
* Sponsored article eligibility
* Premium support
* Advanced analytics
* Custom brand story section
* Multiple location support

Payment requirements:

* Support Paystack and Flutterwave
* User selects a plan and billing cycle
* Frontend sends plan_slug, billing_cycle, provider to Supabase Edge Function
* Edge Function fetches plan from database
* Edge Function validates price, currency, billing cycle, and user role
* Edge Function creates checkout/payment session with Paystack or Flutterwave
* Payment provider returns checkout URL
* User pays
* Webhook confirms payment
* Webhook updates subscription status in Supabase
* Never activate paid plan from frontend callback alone
* Store provider transaction reference
* Store webhook events for idempotency
* Handle duplicate webhook delivery safely
* Support monthly and yearly billing
* Support failed payment state
* Support canceled subscription state
* Support expired subscription state
* Support upgrade, downgrade, renewal, cancellation
* Allow admin to manually extend or override subscription with audit log
* Free plan should not require payment
* Paid features should be locked using backend RBAC and subscription limits, not only hidden in frontend

Core public pages:

1. Home page
2. Directory search page
3. Fashion designers page
4. Fashion brands page
5. Fashion schools page
6. Stylists page
7. Tailors page
8. Bridal designers page
9. Aso Ebi designers page
10. Ankara designers page
11. Agbada designers page
12. Corporate fashion page
13. Children’s fashion page
14. Outfit inspiration gallery
15. Individual outfit page
16. Individual designer profile page
17. Individual brand profile page
18. Individual school profile page
19. Fashion jobs page
20. Individual job page
21. Fashion events page
22. Individual event page
23. Marketplace fashion request page
24. Blog home
25. Blog category page
26. Blog tag page
27. Blog post page
28. Pricing page
29. About page
30. Contact page
31. Login page
32. Register page
33. Forgot password page
34. Terms page
35. Privacy policy page
36. Review guidelines page
37. Verification explainer page

Location SEO pages:
Create scalable page templates for location-based search:

* Fashion Designers in Lagos
* Fashion Designers in Abuja
* Fashion Designers in Port Harcourt
* Fashion Designers in Calabar
* Fashion Designers in Enugu
* Fashion Designers in Ibadan
* Fashion Designers in Benin City
* Fashion Designers in Warri
* Fashion Designers in Uyo
* Fashion Designers in Kano
* Fashion Designers in Kaduna
* Fashion Designers in Owerri
* Fashion Designers in Asaba
* Bridal Designers in Lagos
* Aso Ebi Designers in Lagos
* Ankara Designers in Abuja
* Fashion Schools in Lagos
* Stylists in Abuja
* Tailors in Port Harcourt

These pages should be indexable, fast, and content-rich. Each page should have:

* SEO title
* Meta description
* H1
* Intro copy
* Breadcrumbs
* Filterable listings
* Internal links to related categories and cities
* FAQ section
* Schema markup
* Unique location text
* No thin doorway-page feel
* Canonical URL
* Server-rendered content where possible

Advanced search and discovery:
Users should search and filter by:

* Location
* State
* City
* Category
* Specialty
* Budget
* Rating
* Availability
* Verified status
* Services offered
* Gender focus
* Delivery options
* Remote consultation
* Bridal service
* Aso Ebi group orders
* Express delivery
* Price range
* Portfolio style
* Review count
* Distance, if location coordinates are available
* Open now, if business hours exist

Search UX:

* Large search hero on home page
* Autocomplete
* Popular searches
* Recent searches for logged-in users
* Category chips
* City chips
* Sort by relevance, rating, newest, verified, most reviewed, premium
* Mobile filter drawer
* Desktop sidebar filters
* Empty state with helpful suggestions
* Loading skeletons
* Save search option
* Lead CTA when no exact result is found

Designer and professional profile pages:
Each profile should include:

* Hero cover image
* Logo or profile image
* Business name
* Verified badge
* Plan badge where appropriate
* Category and specialties
* Location
* Rating summary
* Review count
* Response time
* Availability indicator
* WhatsApp button
* Call button
* Website button
* Social links
* Save button
* Share button
* Portfolio gallery
* Services offered
* Price range
* About section
* Brand story
* Opening hours
* Business address
* Map placeholder or map integration-ready block
* Customer reviews
* Review photos
* FAQ
* Similar designers
* Related outfits
* Lead form
* Report listing button
* Claim listing flow, if listing was created by admin
* SEO metadata
* LocalBusiness schema
* Breadcrumb schema

Fashion brand profile pages:
Each brand should showcase:

* Brand story
* Collection galleries
* Product categories
* Lookbook
* Website
* Social media links
* Contact information
* WhatsApp CTA
* Stockist or showroom location
* Reviews
* Featured collections
* Related inspiration posts
* SEO metadata

Fashion schools directory:
School profiles should include:

* School name
* Location
* Courses
* Duration
* Fees range
* Admission status
* Contact details
* WhatsApp CTA
* Website
* Gallery
* Reviews
* Alumni highlights
* Certificate information
* Training type: beginner, intermediate, advanced, online, physical
* Course categories: tailoring, pattern drafting, fashion illustration, fashion business, styling, makeup, modeling
* Inquiry form

Outfit inspiration gallery:
The gallery should feel like a premium fashion magazine.
Categories:

* Aso Ebi
* Ankara styles
* Bridal wear
* Wedding guest looks
* Agbada
* Senator styles
* Corporate fashion
* Children’s fashion
* Native wear
* Luxury evening dresses
* Casual fashion
* Church fashion
* Graduation outfits
* Birthday outfits
* Maternity fashion

Each outfit item:

* Large image
* Title
* Category
* Tags
* Color
* Occasion
* Designer attribution
* Link to designer profile
* Save button
* Share button
* Similar outfits
* Request similar style CTA
* SEO-friendly detail page
* Image alt text
* Optional video embed

Reviews and ratings:
Build a trust-first review system.
Customers can:

* Leave star rating
* Write review
* Upload photos
* Select service used
* Mark order completion date
* Rate communication, quality, delivery time, value
* Edit review within a limited window
* Report abuse

Professionals can:

* Reply to reviews
* Flag unfair reviews for admin moderation

Admins can:

* Approve, hide, reject, or investigate reviews
* See review reports
* Detect suspicious review activity

Review rules:

* Do not allow fake reviews
* Do not display review schema for unverified or fake content
* Use moderation states: pending, published, hidden, rejected
* Store review photos in Supabase Storage
* Apply storage policies
* Sanitize user-generated content

Designer verification system:
Verification levels:

1. Unverified
2. Identity verified
3. Business verified
4. Address verified
5. Premium verified

Verification request should include:

* Business registration document, optional
* Government ID, optional and protected
* Address proof, optional and protected
* Social media proof
* Website proof
* Physical shop address
* Admin notes
* Status timeline
* Rejection reason
* Expiry date if needed

Security:
Verification documents should be private, not public. Only the owner and authorized admins should access them. Use private Supabase Storage buckets and strict RLS.

WhatsApp integration:
Every listing should have direct WhatsApp CTA.
Track:

* WhatsApp clicks
* Listing source
* User ID if logged in
* City
* Category
* Profile page
* Timestamp

Use this data for professional analytics and admin reports.

Marketplace fashion requests:
Customers can submit requests such as:
“I need a wedding gown designer in Lagos.”
“I need Aso Ebi sewing for 10 women in Abuja.”
“I need a children’s birthday outfit designer in Port Harcourt.”

Request form fields:

* Customer name
* Email
* Phone
* WhatsApp number
* City
* State
* Category
* Style needed
* Budget range
* Deadline
* Number of outfits
* Measurements status
* Inspiration images
* Notes
* Preferred contact method
* Consent checkbox

Matching system:

* Match requests to relevant professionals by city, category, specialties, availability, plan, and verification
* Notify matching professionals by email and dashboard
* Professionals can respond
* Customer can compare responses
* Admin can monitor request quality
* Elite and Premium plans can receive higher lead priority, but do not hide all opportunities from lower plans unless the plan rules say so

Fashion jobs board:
Job types:

* Tailoring jobs
* Fashion internships
* Modeling opportunities
* Stylist roles
* Fashion assistant roles
* Photographer roles
* Fashion marketing roles
* Pattern cutter roles
* Fashion school instructor roles

Job features:

* Job listing page
* Job detail page
* Application CTA
* Save job
* Employer dashboard
* Admin moderation
* Expiry date
* Salary range
* Location
* Remote or physical
* Job type: full-time, part-time, contract, internship
* SEO metadata
* JobPosting schema where valid

Fashion events directory:
Event types:

* Fashion shows
* Workshops
* Exhibitions
* Competitions
* Training programs
* Pop-up shops
* Brand launches

Event features:

* Event listing page
* Event detail page
* Date and time
* Venue
* City
* Organizer
* Ticket link
* Registration link
* Gallery
* Save event
* Share event
* Submit event form
* Admin approval
* SEO metadata
* Event schema where valid

Blogging CMS:
Build a robust WordPress-like blogging system inside the admin dashboard.

The CMS should include:

* Posts list
* Create post
* Edit post
* Draft, scheduled, published, archived states
* Rich text editor
* Headings H2, H3, H4
* Paragraphs
* Bold
* Italic
* Underline
* Blockquote
* Ordered lists
* Unordered lists
* Tables
* Code block, optional
* Insert links
* Insert images
* Insert video embeds
* Insert galleries
* Featured image
* Media library
* Image alt text
* Image caption
* Excerpt
* Slug editor
* SEO title
* Meta description
* Canonical URL
* Focus keyword
* Tags
* Categories
* Author
* Related posts
* FAQ block
* Table of contents generation
* Reading time
* Preview before publishing
* Revision history
* Autosave
* Scheduled publishing
* Open Graph title
* Open Graph description
* Open Graph image
* Twitter/X card metadata
* Noindex toggle
* Sponsored post toggle
* Schema type selection: Article, BlogPosting, NewsArticle
* Internal link suggestions
* Redirect manager for changed slugs
* Media upload with compression-ready structure
* Video embed support for YouTube, Vimeo, and direct embed URLs
* Safe HTML sanitization
* Role-based editorial permissions

Blog frontend:

* Blog homepage
* Category archive
* Tag archive
* Author archive
* Search
* Featured posts
* Trending posts
* Related posts
* Breadcrumbs
* Social share
* Newsletter signup
* SEO metadata
* Article schema
* FAQ schema where post has FAQs
* Clean readable layout
* Fast image loading
* Mobile-friendly typography

SEO requirements:
Build SEO as a core system, not an afterthought.

Required:

* Server-rendered or statically generated public pages where possible
* Dynamic meta titles
* Dynamic meta descriptions
* Canonical URLs
* Open Graph metadata
* Twitter/X metadata
* Breadcrumbs
* Sitemap index
* Separate sitemaps for listings, blog posts, categories, cities, jobs, events, schools, inspiration
* robots.txt
* Clean URL slugs
* 301 redirect manager
* Internal linking blocks
* Related listings
* Related cities
* Related categories
* FAQ sections on important landing pages
* Structured data for LocalBusiness, Organization, BreadcrumbList, Article, FAQPage, Event, JobPosting, and Review where appropriate
* Noindex private dashboard pages
* Noindex thin search parameter pages
* Avoid duplicate content
* Use real review data only
* Image alt text fields everywhere
* SEO admin tools for page templates
* Page speed optimization
* Lazy loading images
* Responsive images
* Supabase Storage image optimization strategy where possible

Lead generation system:
Every important page should collect leads naturally.
Lead sources:

* Designer profile inquiry form
* WhatsApp click
* Phone reveal
* Contact form
* Request marketplace
* AI chat
* Blog CTA
* Outfit inspiration CTA
* Pricing CTA
* Event CTA
* School inquiry
* Job application

Store lead data:

* Source page
* Source type
* User ID if logged in
* Professional ID if tied to listing
* Name
* Email
* Phone
* WhatsApp
* City
* Category
* Budget
* Message
* Status
* Assigned professional
* UTM parameters
* Device info
* Created timestamp
* Consent timestamp

Lead statuses:

* New
* Viewed
* Contacted
* Responded
* Won
* Lost
* Spam
* Archived

Professional dashboard:
Build a polished dashboard with:

* Overview
* Profile completion score
* Subscription status
* Listing status
* Verification status
* Leads
* Messages
* Portfolio manager
* Services manager
* Reviews
* Review replies
* Analytics
* Jobs
* Events
* Subscription and billing
* Team members
* Settings
* Support

Professional analytics:

* Profile views
* WhatsApp clicks
* Phone clicks
* Website clicks
* Leads received
* Conversion status
* Search appearances
* Review average
* Review count
* Top viewed portfolio items
* Top cities
* Top categories
* Date filters
* Plan upgrade prompts

Customer dashboard:
Build:

* Overview
* Saved designers
* Saved brands
* Saved schools
* Saved jobs
* Saved events
* Fashion requests
* Messages
* Reviews
* Review photos
* Chat history
* Profile settings
* Notification settings

Admin dashboard:
Build a powerful admin area with:

* Platform overview
* User management
* Professional management
* Listing approval queue
* Verification queue
* Review moderation
* Marketplace requests
* Lead monitoring
* Jobs management
* Events management
* Fashion schools management
* Outfit inspiration manager
* Category manager
* Location manager
* Blog CMS
* Media library
* SEO page manager
* Redirect manager
* Subscription plan manager
* Payment transactions
* Webhook events
* Featured placements
* Sponsored content
* Ad placements
* Email templates
* AI chat settings
* Support tickets
* Reports
* Audit logs
* Security logs
* System settings

Admin analytics:

* Total users
* Total professionals
* Active paid subscribers
* Free users
* Monthly recurring revenue
* Payment failures
* Top cities
* Top categories
* Top searches
* Top listings
* Lead volume
* WhatsApp clicks
* Blog traffic
* Search impressions proxy
* Review activity
* Verification requests
* Job posts
* Event posts
* Conversion funnel

Authentication:
Use Supabase Auth.
Support:

* Email and password
* Magic link, if practical
* OAuth ready structure, optional
* Password reset
* Email verification
* Secure session handling
* Protected routes
* Role-based redirects after login
* Auth middleware
* Profile creation trigger after signup
* Onboarding flow based on user type

Onboarding:
Customer onboarding:

* Name
* Phone
* City
* Fashion interest
* Preferred categories

Professional onboarding:

* Business name
* Category
* City
* WhatsApp
* Logo
* Cover image
* Services
* Price range
* Portfolio uploads
* Social links
* Plan selection
* Verification prompt

RBAC:
Implement role-based access control at both frontend and database level.
Use Supabase RLS policies on every table that contains private or user-owned data.
Do not rely only on frontend route protection.

Example access rules:

* Public can read published active listings
* Public can read published blog posts
* Public can read published events and jobs
* Owner can manage own professional account
* Staff can manage professional account only based on assigned permissions
* Customer can manage own saved items, reviews, requests, and profile
* Admin can moderate platform content
* Super admin can manage admin-level settings
* Service role used only inside trusted Edge Functions

Database schema:
Create Supabase migrations for all required tables. Use UUID primary keys, timestamps, indexes, slugs, status fields, and foreign keys.

Core tables:

1. profiles

* id
* auth_user_id
* full_name
* email
* phone
* avatar_url
* role
* city
* state
* country
* status
* created_at
* updated_at

2. professional_accounts

* id
* owner_id
* business_name
* slug
* description
* category_id
* logo_url
* cover_image_url
* phone
* whatsapp
* email
* website
* instagram
* tiktok
* facebook
* youtube
* address
* city
* state
* country
* latitude
* longitude
* price_range
* availability_status
* verification_status
* subscription_plan_id
* subscription_status
* profile_completion_score
* status
* created_at
* updated_at

3. professional_staff

* id
* professional_account_id
* user_id
* permissions
* status
* invited_by
* created_at

4. categories

* id
* name
* slug
* description
* parent_id
* icon
* status
* seo_title
* seo_description

5. specialties

* id
* name
* slug
* category_id
* status

6. professional_specialties

* professional_account_id
* specialty_id

7. services

* id
* professional_account_id
* name
* description
* price_min
* price_max
* duration
* status

8. portfolio_items

* id
* professional_account_id
* title
* description
* image_url
* video_url
* category_id
* tags
* alt_text
* status
* sort_order
* created_at

9. fashion_brands
   Use professional_accounts where possible, with brand-specific fields in a brand_profiles table if needed.

10. fashion_schools
    Use professional_accounts where possible, with school-specific fields in a school_profiles table:

* courses
* duration
* fees_range
* admission_status
* training_modes
* certificate_info

11. outfit_inspirations

* id
* title
* slug
* description
* image_url
* video_url
* category_id
* designer_id
* occasion
* color
* tags
* alt_text
* status
* seo_title
* seo_description
* created_at
* updated_at

12. reviews

* id
* professional_account_id
* customer_id
* rating
* title
* body
* service_used
* communication_rating
* quality_rating
* delivery_rating
* value_rating
* status
* professional_reply
* professional_reply_at
* created_at
* updated_at

13. review_photos

* id
* review_id
* image_url
* alt_text
* status

14. verification_requests

* id
* professional_account_id
* requested_level
* status
* submitted_data
* admin_notes
* rejection_reason
* reviewed_by
* reviewed_at
* created_at

15. verification_documents

* id
* verification_request_id
* document_type
* file_path
* status
* created_at

16. customer_requests

* id
* customer_id
* title
* category_id
* city
* state
* budget_min
* budget_max
* deadline
* number_of_outfits
* details
* inspiration_files
* status
* created_at

17. request_responses

* id
* request_id
* professional_account_id
* message
* quote_min
* quote_max
* status
* created_at

18. leads

* id
* source_type
* source_page
* professional_account_id
* customer_id
* name
* email
* phone
* whatsapp
* city
* state
* category_id
* budget
* message
* status
* utm_source
* utm_medium
* utm_campaign
* created_at

19. messages

* id
* conversation_id
* sender_id
* receiver_id
* body
* attachments
* read_at
* created_at

20. conversations

* id
* customer_id
* professional_account_id
* last_message_at
* status

21. favorites

* id
* user_id
* entity_type
* entity_id
* created_at

22. jobs

* id
* professional_account_id
* title
* slug
* description
* location
* city
* state
* job_type
* salary_min
* salary_max
* application_url
* application_email
* status
* expires_at
* seo_title
* seo_description
* created_at

23. job_applications

* id
* job_id
* user_id
* name
* email
* phone
* resume_url
* cover_note
* status
* created_at

24. events

* id
* professional_account_id
* title
* slug
* description
* event_type
* venue
* city
* state
* start_time
* end_time
* ticket_url
* registration_url
* image_url
* status
* seo_title
* seo_description
* created_at

25. subscription_plans

* id
* name
* slug
* description
* monthly_price
* yearly_price
* currency
* features
* limits
* paystack_plan_code_monthly
* paystack_plan_code_yearly
* flutterwave_plan_id_monthly
* flutterwave_plan_id_yearly
* status
* sort_order

26. subscriptions

* id
* user_id
* professional_account_id
* plan_id
* provider
* provider_customer_id
* provider_subscription_id
* billing_cycle
* status
* current_period_start
* current_period_end
* cancel_at_period_end
* created_at
* updated_at

27. payment_transactions

* id
* user_id
* professional_account_id
* plan_id
* provider
* reference
* amount
* currency
* status
* metadata
* created_at
* updated_at

28. webhook_events

* id
* provider
* event_id
* event_type
* payload
* processed_at
* status
* created_at

29. featured_placements

* id
* professional_account_id
* placement_type
* city
* category_id
* start_date
* end_date
* status
* created_at

30. blog_posts

* id
* author_id
* title
* slug
* excerpt
* content
* content_json
* featured_image_url
* featured_image_alt
* status
* published_at
* scheduled_at
* seo_title
* meta_description
* canonical_url
* focus_keyword
* og_title
* og_description
* og_image_url
* noindex
* schema_type
* reading_time
* created_at
* updated_at

31. blog_categories

* id
* name
* slug
* description
* seo_title
* meta_description

32. blog_tags

* id
* name
* slug

33. blog_post_categories

* post_id
* category_id

34. blog_post_tags

* post_id
* tag_id

35. media_assets

* id
* uploaded_by
* file_url
* file_path
* file_type
* mime_type
* size
* width
* height
* alt_text
* caption
* created_at

36. seo_pages

* id
* page_type
* slug
* city
* state
* category_id
* title
* h1
* intro_content
* faq_json
* seo_title
* meta_description
* canonical_url
* status
* created_at
* updated_at

37. redirects

* id
* from_path
* to_path
* status_code
* created_at

38. notifications

* id
* user_id
* title
* body
* type
* read_at
* created_at

39. ai_chat_sessions

* id
* user_id
* visitor_id
* professional_account_id
* source_page
* status
* created_at

40. ai_chat_messages

* id
* session_id
* role
* content
* metadata
* created_at

41. audit_logs

* id
* actor_id
* action
* entity_type
* entity_id
* old_values
* new_values
* ip_address
* user_agent
* created_at

42. analytics_events

* id
* user_id
* professional_account_id
* event_type
* source_page
* metadata
* created_at

Indexes:
Add indexes for:

* slugs
* status
* city and state
* category
* verification status
* subscription status
* created_at
* published_at
* full text search fields
* foreign keys
* payment references
* webhook event IDs
* professional search ranking

Search backend:
Use Supabase Postgres full-text search and indexes.
Support:

* Keyword search
* City filtering
* Category filtering
* Specialty filtering
* Rating sorting
* Verification sorting
* Plan-based ranking boost
* Availability filtering
* Budget filtering
* Location filtering

Use database views or materialized views for fast directory search if needed.

Supabase Storage:
Buckets:

* public-profile-images
* portfolio-images
* outfit-inspiration
* blog-media
* review-photos
* event-images
* job-attachments
* private-verification-documents

Apply storage policies:

* Public read only for approved public images
* Owner upload restrictions
* File size limits
* MIME type validation
* Private bucket for verification documents
* Admin-only access to private verification documents

Supabase Edge Functions:
Create secure Edge Functions for:

1. create-payment-checkout
2. paystack-webhook
3. flutterwave-webhook
4. resend-transactional-email
5. ai-live-chat
6. lead-matching
7. submit-fashion-request
8. submit-review
9. generate-sitemap
10. process-media-upload
11. admin-plan-management
12. subscription-sync
13. send-notification

AI live chat:
Use OpenAI through a Supabase Edge Function.
Do not call OpenAI directly from the browser.

AI chat purpose:

* Help visitors find designers
* Ask about location, budget, style, event date, and preferred service
* Recommend relevant categories and listings
* Capture leads
* Explain plans to professionals
* Answer common questions
* Escalate to human support
* Create customer request draft
* Link customers to WhatsApp CTA when appropriate

AI chat rules:

* Store chat sessions and messages
* Ask for consent before collecting phone/email
* Do not invent unavailable designers
* Use database results where possible
* Provide helpful fashion discovery guidance
* Hand off to human/admin when needed
* Rate limit chats
* Prevent abuse
* Log lead source as AI chat
* Allow admin to edit AI system instructions
* Allow admin to add knowledge base entries

Emails with Resend:
Create email templates for:

* Welcome email
* Email verification support email
* Professional onboarding reminder
* Listing approved
* Listing rejected
* Verification submitted
* Verification approved
* Verification rejected
* New lead received
* Customer request received
* Professional responded to request
* Payment successful
* Payment failed
* Subscription renewed
* Subscription canceled
* Review received
* Review reply notification
* Job application received
* Event submission approved
* Admin alert

Email requirements:

* Use Resend through Edge Functions
* Store email logs
* Support template variables
* Include unsubscribe where needed
* Do not send spam
* Use branded STYLEATLAS email design

Security requirements:

* Enable RLS on all relevant tables
* Use strict policies for every private table
* Validate all form inputs with Zod
* Sanitize rich text content
* Protect against XSS in blog content
* Protect against SQL injection through parameterized queries and Supabase client methods
* Verify payment webhook signatures
* Store and check webhook event IDs for idempotency
* Never trust client-side payment success
* Never expose service role key
* Never expose OpenAI key
* Never expose Resend key
* Never expose payment secret keys
* Add rate limiting strategy for lead forms, AI chat, reviews, login attempts, and request submissions
* Add CAPTCHA-ready structure for public forms
* Add audit logs for admin actions
* Add audit logs for billing changes
* Add audit logs for verification changes
* Restrict admin routes
* Restrict staff permissions
* Use private storage for sensitive documents
* Validate uploaded files
* Limit file sizes
* Use safe redirects only
* Add error boundaries
* Add secure environment variable handling

Scalability requirements:

* Use efficient database indexes
* Use pagination everywhere
* Use infinite scrolling only where appropriate
* Use server-side filtering for search
* Avoid loading huge galleries at once
* Use image lazy loading
* Use responsive image sizes
* Use caching where appropriate
* Use sitemap splitting
* Use background-style Edge Function workflows where possible
* Keep analytics events lightweight
* Use database views for heavy admin reports
* Use clean separation between public pages, dashboards, and admin area

Frontend UI components:
Create reusable components:

* Header
* Mega menu
* Mobile menu
* Footer
* Search bar
* Location selector
* Category selector
* Filter sidebar
* Mobile filter drawer
* Listing card
* Premium listing card
* Verified badge
* Rating stars
* Review card
* Portfolio grid
* Image gallery modal
* Profile hero
* Breadcrumbs
* CTA section
* Plan card
* Pricing comparison table
* Lead form
* WhatsApp CTA button
* Save button
* Share button
* Empty state
* Loading skeleton
* Dashboard shell
* Dashboard sidebar
* Admin table
* Status badge
* Media picker
* Rich text editor
* SEO settings panel
* Notification dropdown
* AI chat widget
* Analytics card

Home page layout:

1. Luxury hero section

* Headline: Discover Nigeria’s Best Fashion Designers, Brands & Style Experts
* Subheadline explaining trusted discovery
* Search by service and city
* Popular category chips
* CTA for customers
* CTA for professionals

2. Featured categories

* Fashion designers
* Bridal designers
* Aso Ebi
* Ankara
* Agbada
* Fashion schools
* Stylists
* Fashion brands

3. Premium featured designers
4. Outfit inspiration gallery
5. How it works
6. Verified professionals section
7. Location discovery section
8. Fashion requests CTA
9. Jobs and events preview
10. Blog preview
11. Professional signup CTA
12. Trust section
13. Footer with internal links

Directory UX:

* Search result count
* Sort dropdown
* Filter chips
* Listing cards with clear contact CTA
* Verified and premium signals
* Quick view
* Save
* Compare, optional
* Strong mobile layout

Admin CMS editor:
Use a polished editor experience similar to WordPress:

* Main content editor center
* Right sidebar for publish settings, categories, tags, featured image, SEO
* Slug editor below title
* Preview button
* Save draft button
* Publish button
* Scheduled publish
* Media picker modal
* SEO score helper
* Character count for meta title and description
* Internal link suggestions
* Featured image alt warning
* FAQ builder
* Schema preview

Testing:
Add tests or test-ready structure for:

* Auth routing
* RLS assumptions
* Payment checkout creation
* Webhook idempotency
* Plan gating
* Lead submission
* Review submission
* Blog publishing
* SEO metadata generation
* Dashboard access control
* AI chat Edge Function input validation

Implementation order:

1. Inspect the current project structure.
2. Preserve existing frontend plan/package designs if already created.
3. Set up TypeScript, Tailwind, component system, routing, and environment configuration.
4. Build the design system and core layout.
5. Create Supabase schema migrations.
6. Create RLS policies.
7. Create auth and onboarding.
8. Build public pages.
9. Build listing profiles.
10. Build directory search and filters.
11. Build dashboards.
12. Build blogging CMS.
13. Build payment functions.
14. Build webhook handling.
15. Build lead generation.
16. Build AI chat.
17. Build SEO system.
18. Build admin tools.
19. Add analytics events.
20. Add security hardening.
21. Add loading, empty, error, and success states.
22. Add responsive polish.
23. Add seed data for development only.
24. Add README and deployment checklist.

Quality rules:

* Do not create fake-only UI with no backend structure
* Do not leave important buttons unwired
* Do not use hardcoded plan prices
* Do not bypass Supabase RLS
* Do not expose secrets
* Do not build admin pages accessible to normal users
* Do not use fake reviews
* Do not create thin SEO pages
* Do not make the UI look generic
* Do not ignore mobile experience
* Do not ignore loading and empty states
* Do not ignore error handling
* Do not break existing frontend plan/package design

Deliverables:

* Complete React frontend
* Supabase database migrations
* RLS policies
* Supabase Edge Functions
* Payment integration architecture
* Resend email integration
* OpenAI AI chat integration
* Admin dashboard
* Professional dashboard
* Customer dashboard
* Blog CMS
* SEO templates
* Sitemap/robots setup
* Security notes
* Environment variable example
* Seed data for development
* Deployment checklist

Environment variables:
Create .env.example with:

* NEXT_PUBLIC_SUPABASE_URL
* NEXT_PUBLIC_SUPABASE_ANON_KEY
* SUPABASE_SERVICE_ROLE_KEY
* RESEND_API_KEY
* PAYSTACK_SECRET_KEY
* PAYSTACK_PUBLIC_KEY
* PAYSTACK_WEBHOOK_SECRET
* FLUTTERWAVE_SECRET_KEY
* FLUTTERWAVE_PUBLIC_KEY
* FLUTTERWAVE_WEBHOOK_SECRET
* OPENAI_API_KEY
* NEXT_PUBLIC_SITE_URL

Final result:
STYLEATLAS should launch as a polished Nigerian fashion directory platform where:

* Customers can discover trusted fashion professionals
* Professionals can get leads and grow their business
* Admins can control quality and revenue
* Google can index city, category, profile, blog, job, event, and inspiration pages
* Payments can activate Standard, Premium, and Elite plans
* Free users can still join and create basic listings
* The platform feels premium, fast, secure, and ready for real users
logo C:\Users\JOHN\Desktop\Projects\Fashion directory\Styleatslab Logo.png 

Branding: Charcoal Black as primary color, Rich Gold as accent color.

Supporting Colors

White: #FFFFFF
Light Gray: #F5F5F5
Dark Gray: #4A4A4A


Backgrounds

White (#FFFFFF)
Light Gray (#F8F9FA)

Text

Black (#1F1F1F)
Medium Gray (#6B7280)

Buttons

Primary Button: Gold background with black text

Secondary Button: Black background with white text