-- Development seed data only. Never run against production.
-- Populates enough realistic content to exercise every major feature:
-- categories, plans, professional accounts across categories/cities,
-- portfolio, services, reviews, outfit inspiration, jobs, events, blog
-- posts, AI knowledge base, and a couple of SEO landing pages.

-- ── Test auth users (local/dev only) ─────────────────────────────────────
-- Password for all seeded accounts: StyleAtlas123!
-- Inserting directly into auth.users is a standard local-dev seeding
-- technique; the handle_new_auth_user trigger creates the matching
-- profiles row automatically from raw_user_meta_data.
--
-- IMPORTANT: every text column below is set to '' rather than left to
-- default to NULL. GoTrue's Go structs scan several of these columns
-- (email_change, email_change_token_new/current, phone_change,
-- phone_change_token, reauthentication_token) as plain non-nullable
-- strings — a NULL there makes password-grant sign-in fail with a
-- generic 500 "Database error querying schema", even though the row
-- looks otherwise valid. A real signup through Supabase Auth always
-- populates these as '', so seeded rows must match that shape exactly.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token
) values
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated',
   'superadmin@styleatlas.ng', crypt('StyleAtlas123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Ada Okafor","role":"super_admin"}', now(), now(), '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated',
   'admin@styleatlas.ng', crypt('StyleAtlas123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Femi Adeyemi","role":"admin"}', now(), now(), '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated',
   'designer.lagos@styleatlas.ng', crypt('StyleAtlas123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Amaka Bello","role":"professional"}', now(), now(), '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated',
   'bridal.abuja@styleatlas.ng', crypt('StyleAtlas123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Chiamaka Nwosu","role":"professional"}', now(), now(), '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated',
   'school.ph@styleatlas.ng', crypt('StyleAtlas123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Tolu Fashion Academy","role":"professional"}', now(), now(), '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated',
   'customer1@styleatlas.ng', crypt('StyleAtlas123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Ngozi Eze","role":"customer"}', now(), now(), '', '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated',
   'customer2@styleatlas.ng', crypt('StyleAtlas123!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Emeka Obi","role":"customer"}', now(), now(), '', '', '', '', '', '', '', '')
on conflict (id) do nothing;

-- GoTrue also requires a matching auth.identities row per user for
-- email/password sign-in to succeed (a real signup creates this
-- automatically; a raw insert into auth.users does not).
insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
select
  gen_random_uuid(),
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true, 'phone_verified', false),
  'email',
  u.id::text,
  now(), now(), now()
from auth.users u
where u.email like '%styleatlas.ng'
  and not exists (select 1 from auth.identities i where i.user_id = u.id and i.provider = 'email');

-- ── Subscription plans ────────────────────────────────────────────────────
insert into subscription_plans (name, slug, description, monthly_price, yearly_price, currency, features, limits, badge, sort_order) values
('Free', 'free', 'Get discovered with a basic listing.', 0, 0, 'NGN',
  '["Basic business listing","Up to 6 portfolio images","Basic contact button","Limited search visibility"]'::jsonb,
  '{"portfolio_images":6,"gallery_images":6,"lead_access":"limited","job_postings":0,"event_submissions":0,"staff_accounts":0,"featured_eligible":false,"homepage_eligible":false}'::jsonb,
  null, 1),
('Standard', 'standard', 'More visibility and access to customer leads.', 15000, 144000, 'NGN',
  '["Up to 20 portfolio images","Better search visibility","Full customer lead access","Basic analytics","Review replies","WhatsApp click tracking"]'::jsonb,
  '{"portfolio_images":20,"gallery_images":20,"lead_access":"standard","job_postings":1,"event_submissions":1,"staff_accounts":0,"featured_eligible":false,"homepage_eligible":false}'::jsonb,
  null, 2),
('Premium', 'premium', 'Priority placement and advanced tools to grow faster.', 35000, 336000, 'NGN',
  '["Priority listing placement","Up to 60 portfolio images","Featured category eligibility","Job & event posting","Advanced analytics","Verification priority","Social links & video embeds"]'::jsonb,
  '{"portfolio_images":60,"gallery_images":60,"lead_access":"priority","job_postings":5,"event_submissions":5,"staff_accounts":2,"featured_eligible":true,"homepage_eligible":false}'::jsonb,
  'Most Popular', 3),
('Elite', 'elite', 'Top visibility, concierge verification, and premium support.', 75000, 720000, 'NGN',
  '["Top search visibility","Homepage feature eligibility","Premium verified badge","Unlimited portfolio","Staff accounts","Concierge verification","Sponsored article eligibility","Premium support","Multiple locations"]'::jsonb,
  '{"portfolio_images":9999,"gallery_images":9999,"lead_access":"full","job_postings":9999,"event_submissions":9999,"staff_accounts":10,"featured_eligible":true,"homepage_eligible":true}'::jsonb,
  'Elite', 4)
on conflict (slug) do nothing;

-- ── Categories (professional + inspiration) ─────────────────────────────
insert into categories (name, slug, description, icon, sort_order) values
('Fashion Designers', 'fashion-designers', 'Custom fashion design and made-to-measure couture.', 'Scissors', 1),
('Fashion Brands', 'fashion-brands', 'Ready-to-wear labels and fashion houses.', 'ShoppingBag', 2),
('Stylists', 'stylists', 'Personal and editorial fashion stylists.', 'Sparkles', 3),
('Fashion Schools', 'fashion-schools', 'Tailoring, design, and styling training institutions.', 'GraduationCap', 4),
('Tailors', 'tailors', 'Bespoke tailoring and alterations.', 'Ruler', 5),
('Makeup Artists', 'makeup-artists', 'Bridal and editorial makeup professionals.', 'Brush', 6),
('Model Agencies', 'model-agencies', 'Modeling talent and agency representation.', 'Users', 7),
('Fabric Vendors', 'fabric-vendors', 'Ankara, lace, and premium fabric suppliers.', 'Layers', 8),
('Bridal Houses', 'bridal-houses', 'Wedding gowns and bridal styling.', 'Gem', 9),
('Fashion Photographers', 'fashion-photographers', 'Editorial and lookbook photography.', 'Camera', 10),
('Fashion Consultants', 'fashion-consultants', 'Brand and wardrobe consulting services.', 'Briefcase', 11),
('Fashion Event Organizers', 'fashion-event-organizers', 'Fashion show and event production.', 'CalendarDays', 12),
('Aso Ebi', 'aso-ebi', 'Coordinated celebration outfits.', 'Shirt', 13),
('Ankara Styles', 'ankara-styles', 'Contemporary Ankara fashion.', 'Shirt', 14),
('Bridal Wear', 'bridal-wear', 'Wedding gowns and bridal fashion.', 'Gem', 15),
('Agbada', 'agbada', 'Traditional and modern agbada styles.', 'Shirt', 16),
('Corporate Fashion', 'corporate-fashion', 'Workwear and office style.', 'Briefcase', 17),
('Children''s Fashion', 'childrens-fashion', 'Kids'' occasion and everyday wear.', 'Baby', 18)
on conflict (slug) do nothing;

insert into specialties (name, slug, category_id) values
('Aso Ebi Group Orders', 'aso-ebi-group-orders', (select id from categories where slug = 'fashion-designers')),
('Ankara Styling', 'ankara-styling', (select id from categories where slug = 'fashion-designers')),
('Bridal Gowns', 'bridal-gowns', (select id from categories where slug = 'bridal-houses')),
('Agbada Tailoring', 'agbada-tailoring', (select id from categories where slug = 'tailors'))
on conflict (category_id, slug) do nothing;

-- ── Professional accounts ────────────────────────────────────────────────
insert into professional_accounts (
  owner_id, business_name, slug, description, brand_story, category_id, logo_url, cover_image_url,
  phone, whatsapp, email, website, instagram, address, city, state, price_range, availability_status,
  verification_status, subscription_plan_id, subscription_status, status
)
select
  p.id, v.business_name, v.slug, v.description, v.brand_story, c.id, v.logo_url, v.cover_image_url,
  v.phone, v.whatsapp, v.email2, v.website, v.instagram, v.address, v.city, v.state, v.price_range::price_range,
  'available'::availability_status, v.verification_status::verification_level, plan.id, 'active'::subscription_status, 'active'::listing_status
from (values
  ('designer.lagos@styleatlas.ng', 'Amaka Bello Couture', 'amaka-bello-couture',
    'Amaka Bello Couture specializes in bespoke bridal and Aso Ebi designs for Lagos''s most discerning clients, blending modern silhouettes with traditional Nigerian textiles.',
    'Founded in 2016 from a single sewing machine in Surulere, Amaka Bello Couture has grown into one of Lagos''s most sought-after bridal ateliers, dressing brides across three continents.',
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
    '+2348012345001', '+2348012345001', 'hello@amakabello.ng', 'https://amakabello.ng', 'https://instagram.com/amakabellocouture',
    '14 Adeola Odeku Street, Victoria Island', 'Lagos', 'Lagos', 'premium', 'business_verified', 'elite'),
  ('bridal.abuja@styleatlas.ng', 'Chiamaka Bridal House', 'chiamaka-bridal-house',
    'Abuja''s premier bridal house, offering custom wedding gowns, Aso Ebi coordination, and full bridal styling packages.',
    'Chiamaka Bridal House was born from a passion for making every bride feel like royalty on her big day.',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    '+2348012345002', '+2348012345002', 'hello@chiamakabridal.ng', 'https://chiamakabridal.ng', 'https://instagram.com/chiamakabridal',
    '22 Aminu Kano Crescent, Wuse 2', 'Abuja', 'FCT', 'luxury', 'premium_verified', 'premium'),
  ('school.ph@styleatlas.ng', 'Tolu Fashion Academy', 'tolu-fashion-academy',
    'A leading fashion training institution in Port Harcourt offering beginner to advanced courses in tailoring, pattern drafting, and fashion business.',
    'Tolu Fashion Academy has trained over 500 fashion entrepreneurs since 2018, many of whom now run their own successful labels.',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200',
    '+2348012345003', '+2348012345003', 'info@tolufashionacademy.ng', 'https://tolufashionacademy.ng', 'https://instagram.com/tolufashionacademy',
    '5 Aba Road', 'Port Harcourt', 'Rivers', 'mid', 'identity_verified', 'standard')
) as v(email, business_name, slug, description, brand_story, logo_url, cover_image_url, phone, whatsapp, email2, website, instagram, address, city, state, price_range, verification_status, plan_slug)
join profiles p on p.email = v.email
join categories c on c.slug = case
  when v.slug = 'amaka-bello-couture' then 'fashion-designers'
  when v.slug = 'chiamaka-bridal-house' then 'bridal-houses'
  else 'fashion-schools'
end
join subscription_plans plan on plan.slug = v.plan_slug::plan_slug
on conflict (slug) do nothing;

insert into school_profiles (professional_account_id, courses, duration, fees_range, admission_status, training_modes, course_categories)
select id, '[{"name":"Beginner Tailoring","duration":"3 months"},{"name":"Advanced Pattern Drafting","duration":"6 months"},{"name":"Fashion Business Essentials","duration":"1 month"}]'::jsonb,
  '3-6 months', '₦80,000 - ₦250,000', 'open', array['physical','online'], array['tailoring','pattern-drafting','fashion-business']
from professional_accounts where slug = 'tolu-fashion-academy'
on conflict (professional_account_id) do nothing;

-- ── Services ──────────────────────────────────────────────────────────────
insert into services (professional_account_id, name, description, price_min, price_max, duration)
select id, v.name, v.description, v.price_min, v.price_max, v.duration
from professional_accounts, (values
  ('Bridal Gown (Custom)', 'Fully bespoke wedding gown with consultations and 3 fittings.', 250000, 800000, '6-8 weeks'),
  ('Aso Ebi Group Order (10 outfits)', 'Coordinated Aso Ebi styling for bridal trains and guests.', 400000, 900000, '3-4 weeks')
) as v(name, description, price_min, price_max, duration)
where slug = 'amaka-bello-couture'
on conflict do nothing;

-- ── Portfolio items ──────────────────────────────────────────────────────
insert into portfolio_items (professional_account_id, title, image_url, alt_text, tags, sort_order)
select pa.id, v.title, v.image_url, v.alt_text, v.tags, v.sort_order
from professional_accounts pa, (values
  ('amaka-bello-couture', 'Ivory lace bridal gown', 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800', 'Bride wearing ivory lace gown by Amaka Bello Couture', array['bridal','lace'], 1),
  ('amaka-bello-couture', 'Aso Ebi coordinated set', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'Group of women in matching Aso Ebi outfits', array['aso-ebi','ankara'], 2),
  ('chiamaka-bridal-house', 'Mermaid wedding gown', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', 'Bride in mermaid-style wedding gown', array['bridal'], 1)
) as v(slug, title, image_url, alt_text, tags, sort_order)
where pa.slug = v.slug
on conflict do nothing;

-- ── Outfit inspirations ──────────────────────────────────────────────────
insert into outfit_inspirations (title, slug, description, image_url, category_id, designer_id, occasion, color, tags, alt_text, status, seo_title, seo_description)
select v.title, v.slug, v.description, v.image_url, c.id, pa.id, v.occasion, v.color, v.tags, v.alt_text, 'active'::listing_status, v.title, v.description
from (values
  ('Emerald Green Aso Ebi Set', 'emerald-green-aso-ebi-set', 'A stunning emerald green Aso Ebi look perfect for weddings and owambe celebrations.',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'aso-ebi', 'amaka-bello-couture', 'Wedding', 'Emerald Green', array['aso-ebi','wedding','green'], 'Woman wearing an emerald green Aso Ebi outfit'),
  ('Ivory Bridal Ballgown', 'ivory-bridal-ballgown', 'A timeless ivory ballgown with intricate lace detailing, designed for a fairytale wedding.',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', 'bridal-wear', 'chiamaka-bridal-house', 'Wedding', 'Ivory', array['bridal','ballgown'], 'Bride wearing an ivory lace ballgown'),
  ('Navy Ankara Corporate Set', 'navy-ankara-corporate-set', 'A sharp Ankara-print blazer and trouser set for the modern corporate professional.',
    'https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=800', 'corporate-fashion', null, 'Work', 'Navy', array['ankara','corporate'], 'Professional wearing a navy Ankara-print corporate set')
) as v(title, slug, description, image_url, category_slug, designer_slug, occasion, color, tags, alt_text)
join categories c on c.slug = v.category_slug
left join professional_accounts pa on pa.slug = v.designer_slug
on conflict (slug) do nothing;

-- ── Reviews ───────────────────────────────────────────────────────────────
insert into reviews (professional_account_id, customer_id, rating, title, body, service_used, communication_rating, quality_rating, delivery_rating, value_rating, status, order_completed_at)
select pa.id, cust.id, v.rating, v.title, v.body, v.service_used, v.rating, v.rating, v.rating, v.rating, 'published'::review_status, current_date - 30
from (values
  ('amaka-bello-couture', 'customer1@styleatlas.ng', 5, 'Stunning bridal gown!', 'Amaka and her team exceeded every expectation. The fit was perfect and the beadwork was exquisite.', 'Bridal Gown (Custom)'),
  ('amaka-bello-couture', 'customer2@styleatlas.ng', 4, 'Great Aso Ebi coordination', 'Managed 12 outfits for my sister''s wedding train flawlessly. Delivery was a few days later than promised.', 'Aso Ebi Group Order (10 outfits)'),
  ('chiamaka-bridal-house', 'customer1@styleatlas.ng', 5, 'Dream wedding dress', 'I felt like a princess. Highly recommend Chiamaka Bridal House to any bride in Abuja.', 'Bridal Gown (Custom)')
) as v(slug, customer_email, rating, title, body, service_used)
join professional_accounts pa on pa.slug = v.slug
join profiles cust on cust.email = v.customer_email
on conflict do nothing;

-- ── Jobs ──────────────────────────────────────────────────────────────────
insert into jobs (professional_account_id, title, slug, description, city, state, job_type, salary_min, salary_max, status)
select pa.id, v.title, v.slug, v.description, pa.city, pa.state, v.job_type::job_type, v.salary_min, v.salary_max, 'active'::listing_status
from professional_accounts pa, (values
  ('amaka-bello-couture', 'Experienced Bridal Seamstress', 'experienced-bridal-seamstress-lagos',
   'Seeking a skilled seamstress with 3+ years experience in bridal wear construction and beadwork.', 'full_time', 120000, 180000),
  ('tolu-fashion-academy', 'Fashion Design Instructor', 'fashion-design-instructor-port-harcourt',
   'Join our academy as a lead instructor for our advanced pattern drafting course.', 'part_time', 100000, 150000)
) as v(slug_ref, title, slug, description, job_type, salary_min, salary_max)
where pa.slug = v.slug_ref
on conflict (slug) do nothing;

-- ── Events ────────────────────────────────────────────────────────────────
insert into events (professional_account_id, title, slug, description, event_type, venue, city, state, start_time, end_time, image_url, status)
select pa.id, v.title, v.slug, v.description, v.event_type::event_type, v.venue, pa.city, pa.state, v.start_time, v.end_time, v.image_url, 'active'::listing_status
from professional_accounts pa, (values
  ('amaka-bello-couture', 'Lagos Bridal Fashion Weekend', 'lagos-bridal-fashion-weekend',
   'An exclusive showcase of the latest bridal collections from Lagos''s top designers.', 'fashion_show', 'Eko Hotel & Suites',
   now() + interval '30 days', now() + interval '30 days' + interval '6 hours', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800')
) as v(slug_ref, title, slug, description, event_type, venue, start_time, end_time, image_url)
where pa.slug = v.slug_ref
on conflict (slug) do nothing;

-- ── Blog ──────────────────────────────────────────────────────────────────
insert into blog_categories (name, slug, description) values
('Style Guides', 'style-guides', 'Practical fashion advice and styling tips.'),
('Designer Spotlights', 'designer-spotlights', 'Profiles of standout Nigerian designers.'),
('Industry News', 'industry-news', 'What''s happening in Nigerian fashion.')
on conflict (slug) do nothing;

insert into blog_tags (name, slug) values
('Aso Ebi', 'aso-ebi'), ('Bridal', 'bridal'), ('Lagos', 'lagos'), ('Ankara', 'ankara')
on conflict (slug) do nothing;

insert into blog_posts (author_id, title, slug, excerpt, content, featured_image_url, featured_image_alt, status, published_at, seo_title, meta_description, reading_time)
select p.id, v.title, v.slug, v.excerpt, v.content, v.featured_image_url, v.title, 'published'::blog_status, now() - interval '3 days', v.title, v.excerpt, 4
from profiles p, (values
  ('admin@styleatlas.ng', '10 Aso Ebi Trends Dominating Nigerian Weddings in 2026', '10-aso-ebi-trends-2026',
   'From jewel tones to structured silhouettes, here are the Aso Ebi trends every guest and bride needs to know this season.',
   '<h2>1. Jewel Tones Take Over</h2><p>Emerald, sapphire, and ruby are replacing pastels as the go-to Aso Ebi palette this year.</p><h2>2. Structured Silhouettes</h2><p>Corseted bodices and sharp tailoring are giving traditional Aso Ebi a modern edit.</p><h2>3. Statement Sleeves</h2><p>Bishop and balloon sleeves continue to dominate red carpets and owambe alike.</p>',
   'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200'),
  ('admin@styleatlas.ng', 'How to Choose the Right Bridal Designer in Lagos', 'choose-bridal-designer-lagos',
   'A practical guide to vetting bridal designers, from portfolio review to contract terms.',
   '<h2>Start with Portfolio Consistency</h2><p>Look for a consistent point of view across a designer''s past work, not just one standout photo.</p><h2>Ask About Timelines</h2><p>Bridal gowns typically take 6-8 weeks — build in buffer time before your big day.</p>',
   'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200')
) as v(author_email, title, slug, excerpt, content, featured_image_url)
where p.email = v.author_email
on conflict (slug) do nothing;

insert into blog_post_categories (post_id, category_id)
select bp.id, bc.id from blog_posts bp, blog_categories bc
where (bp.slug = '10-aso-ebi-trends-2026' and bc.slug = 'style-guides')
   or (bp.slug = 'choose-bridal-designer-lagos' and bc.slug = 'designer-spotlights')
on conflict do nothing;

insert into blog_post_tags (post_id, tag_id)
select bp.id, bt.id from blog_posts bp, blog_tags bt
where (bp.slug = '10-aso-ebi-trends-2026' and bt.slug in ('aso-ebi'))
   or (bp.slug = 'choose-bridal-designer-lagos' and bt.slug in ('bridal', 'lagos'))
on conflict do nothing;

-- ── AI chat knowledge base + settings ────────────────────────────────────
insert into ai_knowledge_base (title, content, category) values
('Plan overview', 'STYLEATLAS has 4 plans: Free, Standard, Premium, and Elite. Free is $0 forever. Paid plans unlock more portfolio images, lead access, job/event posting, and priority placement. See /pricing for current prices.', 'billing'),
('Verification levels', 'Professionals can apply for Identity, Business, Address, or Premium verification from their dashboard. Verification typically takes 2-5 business days.', 'trust'),
('WhatsApp contact', 'Most professional profiles have a WhatsApp button for instant contact — this is the fastest way to reach a designer.', 'general')
on conflict do nothing;

insert into ai_chat_settings (system_instructions, rate_limit_per_hour)
select 'Be warm, concise, and specific to Nigerian fashion culture (Aso Ebi, owambe, agbada, etc). Always ask for city and budget if not provided.', 30
where not exists (select 1 from ai_chat_settings);

-- ── SEO landing pages ─────────────────────────────────────────────────────
insert into seo_pages (page_type, slug, city, category_id, title, h1, intro_content, faq_json, seo_title, meta_description, status)
select 'category_city', 'fashion-designers-in-lagos', 'Lagos', c.id,
  'Fashion Designers in Lagos', 'Fashion Designers in Lagos',
  'Lagos is home to Nigeria''s largest concentration of professional fashion designers, from bridal specialists on Victoria Island to Ankara ateliers in Surulere. Browse verified designers, compare portfolios and reviews, and connect directly via WhatsApp.',
  '[{"question":"What is the average price for a custom outfit in Lagos?","answer":"Prices range from ₦30,000 for simple styles to ₦800,000+ for bespoke bridal wear, depending on fabric and designer experience."}]'::jsonb,
  'Fashion Designers in Lagos | STYLEATLAS', 'Discover verified fashion designers in Lagos. Compare portfolios, reviews, and pricing on STYLEATLAS.', 'active'
from categories c where c.slug = 'fashion-designers'
on conflict (slug) do nothing;
