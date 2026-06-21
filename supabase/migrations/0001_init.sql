-- ============================================================================
-- Dr. Priyal Agarwal — Women's Health Platform
-- Initial schema: tables, enums, helper functions, RLS, storage, triggers.
--
-- AUTH MODEL: The public website is auth-free (patients don't log in; trackers
-- are local-first; bookings are guest-based). This schema still ships full,
-- privacy-first RLS so that an optional patient portal and the doctor/admin
-- back-office can be enabled later without rework. Server code uses the
-- service-role key (which bypasses RLS) only behind verified, authorized
-- endpoints.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "btree_gist";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('patient','doctor','staff','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type appointment_mode as enum ('in_person','video','audio','chat');
exception when duplicate_object then null; end $$;

do $$ begin
  create type appointment_status as enum ('requested','confirmed','cancelled','completed','no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('created','authorized','captured','failed','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_status as enum ('draft','published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type flow_intensity as enum ('spotting','light','medium','heavy');
exception when duplicate_object then null; end $$;

do $$ begin
  create type consent_type as enum ('telemedicine','data_processing','marketing');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER to avoid RLS recursion)
-- ----------------------------------------------------------------------------
create or replace function public.my_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('doctor','staff','admin') from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

-- updated_at trigger helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ----------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'patient',
  full_name text,
  phone text,
  avatar_url text,
  dob date,
  gender text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id or public.is_staff());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles admin all" on public.profiles;
create policy "profiles admin all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- New auth user -> profile row (role cannot be self-assigned)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.phone)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- patients (clinical extension)
-- ----------------------------------------------------------------------------
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  blood_group text,
  allergies text[],
  chronic_conditions text[],
  emergency_contact_name text,
  emergency_contact_phone text,
  address jsonb,
  created_at timestamptz not null default now()
);
alter table public.patients enable row level security;

drop policy if exists "patients self" on public.patients;
create policy "patients self" on public.patients
  for all using (profile_id = auth.uid() or public.is_staff())
  with check (profile_id = auth.uid() or public.is_staff());

-- ----------------------------------------------------------------------------
-- doctors
-- ----------------------------------------------------------------------------
create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  slug text unique not null,
  display_name text not null,
  qualifications text,
  registration_no text,            -- private; excluded from public view
  specialties text[],
  bio text,
  years_experience int,
  languages text[],
  consultation_fee int,            -- paise
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.doctors enable row level security;

drop policy if exists "doctors public read" on public.doctors;
create policy "doctors public read" on public.doctors
  for select using (is_active = true);

drop policy if exists "doctors self update" on public.doctors;
create policy "doctors self update" on public.doctors
  for update using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "doctors admin write" on public.doctors;
create policy "doctors admin write" on public.doctors
  for all using (public.is_admin()) with check (public.is_admin());

-- Public-safe view (no registration_no)
create or replace view public.doctors_public as
  select id, slug, display_name, qualifications, specialties, bio,
         years_experience, languages, consultation_fee, is_active
  from public.doctors where is_active = true;

-- ----------------------------------------------------------------------------
-- services
-- ----------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  description text,
  duration_minutes int default 20,
  base_price int,                   -- paise
  category text,
  icon text,
  is_published boolean not null default true,
  sort_order int default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);
alter table public.services enable row level security;

drop policy if exists "services public read" on public.services;
create policy "services public read" on public.services
  for select using (is_published = true or public.is_staff());

drop policy if exists "services staff write" on public.services;
create policy "services staff write" on public.services
  for all using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- availability_slots
-- ----------------------------------------------------------------------------
create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references public.doctors(id) on delete cascade,
  weekday int check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_minutes int default 20,
  valid_from date,
  valid_to date,
  is_blocked boolean not null default false
);
alter table public.availability_slots enable row level security;

drop policy if exists "availability staff" on public.availability_slots;
create policy "availability staff" on public.availability_slots
  for all using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- appointments
-- ----------------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  patient_id uuid references public.patients(id) on delete set null,
  doctor_id uuid references public.doctors(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  -- guest fields (auth-free booking)
  guest_name text,
  guest_phone text,
  guest_email text,
  scheduled_at timestamptz not null,
  end_at timestamptz,
  mode appointment_mode not null default 'video',
  status appointment_status not null default 'requested',
  reason text,
  room_id text,
  calendar_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.appointments enable row level security;

-- prevent double-booking a doctor at the same instant
create unique index if not exists appointments_no_double_book
  on public.appointments (doctor_id, scheduled_at)
  where status in ('requested','confirmed');

drop policy if exists "appointments patient" on public.appointments;
create policy "appointments patient" on public.appointments
  for select using (
    public.is_staff()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  );

drop policy if exists "appointments staff write" on public.appointments;
create policy "appointments staff write" on public.appointments
  for all using (public.is_staff()) with check (public.is_staff());

create trigger trg_appt_touch before update on public.appointments
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- consultations
-- ----------------------------------------------------------------------------
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid unique references public.appointments(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete set null,
  doctor_id uuid references public.doctors(id) on delete set null,
  chief_complaint text,
  history text,
  examination text,
  assessment text,
  plan text,
  vitals jsonb,
  follow_up_date date,
  created_at timestamptz not null default now()
);
alter table public.consultations enable row level security;

drop policy if exists "consultations patient read" on public.consultations;
create policy "consultations patient read" on public.consultations
  for select using (
    public.is_staff()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  );

drop policy if exists "consultations staff write" on public.consultations;
create policy "consultations staff write" on public.consultations
  for all using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- prescriptions
-- ----------------------------------------------------------------------------
create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid references public.consultations(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete set null,
  doctor_id uuid references public.doctors(id) on delete set null,
  medications jsonb,                -- [{name,dose,frequency,duration}]
  instructions text,
  pdf_path text,
  issued_at timestamptz not null default now(),
  valid_until date
);
alter table public.prescriptions enable row level security;

drop policy if exists "rx patient read" on public.prescriptions;
create policy "rx patient read" on public.prescriptions
  for select using (
    public.is_staff()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  );

drop policy if exists "rx staff write" on public.prescriptions;
create policy "rx staff write" on public.prescriptions
  for all using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- documents (lab reports / scans)
-- ----------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  title text,
  doc_type text,                    -- lab|scan|referral|other
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  consultation_id uuid references public.consultations(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.documents enable row level security;

drop policy if exists "documents patient" on public.documents;
create policy "documents patient" on public.documents
  for all using (
    public.is_staff()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  ) with check (
    public.is_staff()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- payments
-- ----------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  amount_paise int not null,
  currency text not null default 'INR',
  status payment_status not null default 'created',
  razorpay_order_id text,
  razorpay_payment_id text unique,
  razorpay_signature text,
  receipt_no text,
  method text,
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;

-- Clients NEVER write payment status; only server (service role) does.
drop policy if exists "payments staff read" on public.payments;
create policy "payments staff read" on public.payments
  for select using (
    public.is_staff()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- Self-care trackers (cycle / symptoms / pregnancy) — optional server copy
-- ----------------------------------------------------------------------------
create table if not exists public.cycle_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  period_start date not null,
  period_end date,
  cycle_length int,
  flow flow_intensity,
  notes text,
  logged_at timestamptz not null default now()
);
alter table public.cycle_logs enable row level security;
drop policy if exists "cycle self" on public.cycle_logs;
create policy "cycle self" on public.cycle_logs
  for all using (patient_id in (select id from public.patients where profile_id = auth.uid()))
  with check (patient_id in (select id from public.patients where profile_id = auth.uid()));

create table if not exists public.symptoms (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  symptom_type text,
  severity int check (severity between 1 and 5),
  cycle_log_id uuid references public.cycle_logs(id) on delete set null,
  notes text,
  recorded_at timestamptz not null default now()
);
alter table public.symptoms enable row level security;
drop policy if exists "symptoms self" on public.symptoms;
create policy "symptoms self" on public.symptoms
  for all using (patient_id in (select id from public.patients where profile_id = auth.uid()))
  with check (patient_id in (select id from public.patients where profile_id = auth.uid()));

create table if not exists public.pregnancy_profiles (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  lmp date,
  edd date,
  gravida int,
  para int,
  is_active boolean not null default true,
  blood_group text,
  risk_notes text,
  created_at timestamptz not null default now()
);
alter table public.pregnancy_profiles enable row level security;
drop policy if exists "preg self" on public.pregnancy_profiles;
create policy "preg self" on public.pregnancy_profiles
  for all using (
    public.is_staff()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  ) with check (
    public.is_staff()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  );

create table if not exists public.pregnancy_logs (
  id uuid primary key default gen_random_uuid(),
  pregnancy_profile_id uuid not null references public.pregnancy_profiles(id) on delete cascade,
  week int,
  weight_kg numeric,
  bp_systolic int,
  bp_diastolic int,
  fetal_movement int,
  notes text,
  logged_at timestamptz not null default now()
);
alter table public.pregnancy_logs enable row level security;
drop policy if exists "preg logs self" on public.pregnancy_logs;
create policy "preg logs self" on public.pregnancy_logs
  for all using (
    pregnancy_profile_id in (
      select pp.id from public.pregnancy_profiles pp
      join public.patients pt on pt.id = pp.patient_id
      where pt.profile_id = auth.uid()
    ) or public.is_staff()
  ) with check (
    pregnancy_profile_id in (
      select pp.id from public.pregnancy_profiles pp
      join public.patients pt on pt.id = pp.patient_id
      where pt.profile_id = auth.uid()
    ) or public.is_staff()
  );

-- ----------------------------------------------------------------------------
-- Content: blog, faqs, reviews
-- ----------------------------------------------------------------------------
create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text
);
alter table public.blog_categories enable row level security;
drop policy if exists "blogcat public read" on public.blog_categories;
create policy "blogcat public read" on public.blog_categories for select using (true);
drop policy if exists "blogcat staff write" on public.blog_categories;
create policy "blogcat staff write" on public.blog_categories
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text,
  cover_image text,
  author_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.blog_categories(id) on delete set null,
  tags text[],
  status post_status not null default 'draft',
  published_at timestamptz,
  reading_minutes int,
  seo_title text,
  seo_description text,
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;
drop policy if exists "posts public read" on public.blog_posts;
create policy "posts public read" on public.blog_posts
  for select using (status = 'published' or public.is_staff());
drop policy if exists "posts staff write" on public.blog_posts;
create policy "posts staff write" on public.blog_posts
  for all using (public.is_staff()) with check (public.is_staff());
create trigger trg_posts_touch before update on public.blog_posts
  for each row execute function public.touch_updated_at();

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order int default 0,
  is_published boolean not null default true
);
alter table public.faqs enable row level security;
drop policy if exists "faqs public read" on public.faqs;
create policy "faqs public read" on public.faqs
  for select using (is_published = true or public.is_staff());
drop policy if exists "faqs staff write" on public.faqs;
create policy "faqs staff write" on public.faqs
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  doctor_id uuid references public.doctors(id) on delete set null,
  author_name text,
  context text,
  rating int check (rating between 1 and 5),
  title text,
  body text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews
  for select using (is_approved = true or public.is_staff());
drop policy if exists "reviews insert" on public.reviews;
create policy "reviews insert" on public.reviews
  for insert with check (true);   -- anyone can submit; defaults to unapproved
drop policy if exists "reviews staff write" on public.reviews;
create policy "reviews staff write" on public.reviews
  for update using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- Messaging
-- ----------------------------------------------------------------------------
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  participant_id uuid references public.profiles(id) on delete set null,
  subject text,
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.message_threads enable row level security;
drop policy if exists "threads members" on public.message_threads;
create policy "threads members" on public.message_threads
  for all using (
    public.is_staff()
    or participant_id = auth.uid()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  ) with check (
    public.is_staff()
    or participant_id = auth.uid()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  );

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.message_threads(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  recipient_id uuid references public.profiles(id) on delete set null,
  body text,
  attachment_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
drop policy if exists "messages members" on public.messages;
create policy "messages members" on public.messages
  for all using (auth.uid() = sender_id or auth.uid() = recipient_id or public.is_staff())
  with check (auth.uid() = sender_id or public.is_staff());

-- ----------------------------------------------------------------------------
-- Marketing, consent, audit
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  is_confirmed boolean not null default false,
  confirm_token text,
  consent_at timestamptz,
  unsubscribed_at timestamptz,
  source text,
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
drop policy if exists "newsletter signup" on public.newsletter_subscribers;
create policy "newsletter signup" on public.newsletter_subscribers
  for insert with check (true);
drop policy if exists "newsletter admin" on public.newsletter_subscribers;
create policy "newsletter admin" on public.newsletter_subscribers
  for select using (public.is_admin());

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  consent_type consent_type not null,
  version text,
  granted boolean not null,
  granted_at timestamptz default now(),
  withdrawn_at timestamptz,
  ip text,
  document_hash text
);
alter table public.consents enable row level security;
drop policy if exists "consents self" on public.consents;
create policy "consents self" on public.consents
  for all using (
    public.is_staff()
    or patient_id in (select id from public.patients where profile_id = auth.uid())
  ) with check (
    patient_id in (select id from public.patients where profile_id = auth.uid())
  );

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text,
  entity_type text,
  entity_id text,
  ip text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_logs enable row level security;
drop policy if exists "audit admin read" on public.audit_logs;
create policy "audit admin read" on public.audit_logs
  for select using (public.is_admin());
-- inserts happen via SECURITY DEFINER triggers / service role only

-- ----------------------------------------------------------------------------
-- Storage buckets (private for all PHI)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('patient-reports','patient-reports', false),
  ('prescriptions','prescriptions', false),
  ('consult-recordings','consult-recordings', false),
  ('message-attachments','message-attachments', false),
  ('avatars','avatars', true),
  ('blog-media','blog-media', true)
on conflict (id) do nothing;

-- Public-read buckets: anyone can read, staff can write
drop policy if exists "public assets read" on storage.objects;
create policy "public assets read" on storage.objects
  for select using (bucket_id in ('avatars','blog-media'));

drop policy if exists "staff assets write" on storage.objects;
create policy "staff assets write" on storage.objects
  for insert with check (bucket_id in ('avatars','blog-media') and public.is_staff());

-- Private PHI buckets: staff read/write; patient reads own (first path segment = patient_id)
drop policy if exists "phi staff all" on storage.objects;
create policy "phi staff all" on storage.objects
  for all using (
    bucket_id in ('patient-reports','prescriptions','consult-recordings','message-attachments')
    and public.is_staff()
  ) with check (
    bucket_id in ('patient-reports','prescriptions','consult-recordings','message-attachments')
    and public.is_staff()
  );

drop policy if exists "phi patient read own" on storage.objects;
create policy "phi patient read own" on storage.objects
  for select using (
    bucket_id in ('patient-reports','prescriptions')
    and (storage.foldername(name))[1] in (
      select id::text from public.patients where profile_id = auth.uid()
    )
  );
