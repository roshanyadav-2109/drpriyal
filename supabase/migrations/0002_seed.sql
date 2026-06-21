-- ============================================================================
-- Seed: services, blog categories, FAQs. Idempotent (on conflict do nothing).
-- Blog post bodies are managed in-app; this seeds taxonomy + public content.
-- ============================================================================

insert into public.services (slug, title, summary, category, icon, sort_order) values
  ('pregnancy-care','Pregnancy & Antenatal Care','Guidance through every trimester — check-ups, scans, nutrition, and warning signs.','Maternity','baby',1),
  ('period-menstrual-health','Period & Menstrual Health','Care for irregular, painful, or heavy periods with a calm, no-judgement approach.','Gynaecology','calendar-heart',2),
  ('pcos-pcod','PCOS / PCOD Support','A practical, evidence-based plan for managing PCOS/PCOD symptoms.','Gynaecology','activity',3),
  ('fertility-preconception','Fertility & Preconception','Preconception guidance, fertile-window awareness, and the right early checks.','Fertility','sprout',4),
  ('adolescent-health','Adolescent & Teen Health','A safe, gentle space for teens and parents — first periods and puberty.','Wellness','heart-handshake',5),
  ('menopause-midlife','Menopause & Midlife Care','Navigate perimenopause and beyond with clarity and symptom relief.','Wellness','leaf',6),
  ('well-woman','Well-Woman Checkups','Preventive care — routine screenings and contraception counselling.','Preventive','shield-check',7)
on conflict (slug) do nothing;

insert into public.blog_categories (slug, name) values
  ('pregnancy','Pregnancy'),
  ('periods-cycles','Periods & Cycles'),
  ('pcos','PCOS'),
  ('fertility','Fertility'),
  ('menopause','Menopause'),
  ('wellness','Wellness')
on conflict (slug) do nothing;

insert into public.faqs (question, answer, category, sort_order) values
  ('Do I need to create an account to book a consultation?','No. Booking is completely sign-up free. Choose a slot, share a few details, and you''ll get your confirmation on WhatsApp and email.','Consultations',1),
  ('What types of consultation are available?','Video, audio, and chat consultations from anywhere, plus in-clinic visits.','Consultations',2),
  ('Will I get a prescription after an online consult?','Where clinically appropriate, yes — a digital prescription issued per India''s Telemedicine Practice Guidelines.','Consultations',3),
  ('Is my period and pregnancy tracker data private?','Yes. Tracker data is stored on your own device and shared only if you choose to during a consultation.','Trackers',4),
  ('How do I pay?','In INR via UPI, cards, net-banking, and wallets through a secure gateway.','Payments',5),
  ('Can I use this for an emergency?','No. For severe pain, heavy bleeding, or any urgent symptom, visit the nearest hospital or call your local emergency number.','Emergencies',6)
on conflict do nothing;
