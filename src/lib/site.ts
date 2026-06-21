/**
 * Centralized site content & configuration.
 * COPY POLICY: verified facts only. Do not add credentials, years of experience,
 * sub-specialties, or patient counts that have not been confirmed by Dr. Agarwal.
 */

export const site = {
  name: "Dr. Priyal Agarwal",
  tagline: "Women's Health & Care",
  /** Verified positioning — honest at her current career stage. */
  shortBio:
    "Obstetrician–gynaecologist, founder of WomanHood, and an advocate for accessible women's health — for every woman, at every stage.",
  email: "care@drpriyalagarwal.com",
  phoneDisplay: "+91 00000 00000",
  phone: "+910000000000",
  whatsapp: "910000000000",
  city: "Bengaluru, India",
  // TODO(client): replace placeholders above with confirmed clinic phone / email / address.
  social: {
    linkedin: "https://www.linkedin.com/in/dr-priyal-agarwal",
    instagram: "",
  },
} as const;

export type NavItem = { label: string; href: string; description?: string };

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** Verified credentials — safe to publish. */
export const credentials = [
  { label: "MBBS", detail: "Gauhati Medical College & Hospital, Guwahati" },
  { label: "OB-GYN Training", detail: "Postgraduate residency, CMH Bengaluru" },
  { label: "Founder & CEO", detail: "WomanHood — women's health initiative" },
  { label: "Languages", detail: "English & Hindi" },
];

/** Care areas — general gynaecology consultation scope (framed as guidance/care, not surgical claims). */
export const services = [
  {
    slug: "pregnancy-care",
    title: "Pregnancy & Antenatal Care",
    summary:
      "Guidance through every trimester — check-ups, scans timeline, nutrition and warning signs, so you feel supported from the first heartbeat to delivery.",
    icon: "baby",
    points: ["First-trimester guidance", "Antenatal visit & scan planning", "Nutrition & wellbeing", "Birth preparation"],
  },
  {
    slug: "period-menstrual-health",
    title: "Period & Menstrual Health",
    summary:
      "Understand your cycle. Care for irregular, painful, or heavy periods — with a calm, no-judgement conversation about what's normal for you.",
    icon: "calendar-heart",
    points: ["Irregular cycles", "Painful or heavy periods", "Cycle tracking review", "Hygiene & lifestyle"],
  },
  {
    slug: "pcos-pcod",
    title: "PCOS / PCOD Support",
    summary:
      "A practical, evidence-based plan for managing PCOS/PCOD symptoms — cycles, skin, weight and long-term health — built around your life.",
    icon: "activity",
    points: ["Symptom assessment", "Lifestyle planning", "Cycle regulation", "Long-term follow-up"],
  },
  {
    slug: "fertility-preconception",
    title: "Fertility & Preconception",
    summary:
      "Planning a family? Preconception guidance, fertility-window awareness, and the right checks before you start trying.",
    icon: "sprout",
    points: ["Preconception checks", "Fertile-window guidance", "Lifestyle optimisation", "When to seek help"],
  },
  {
    slug: "adolescent-health",
    title: "Adolescent & Teen Health",
    summary:
      "A safe, gentle space for teens and parents — first periods, puberty questions, and building healthy habits early.",
    icon: "heart-handshake",
    points: ["First-period guidance", "Puberty concerns", "Menstrual education", "Parent support"],
  },
  {
    slug: "menopause-midlife",
    title: "Menopause & Midlife Care",
    summary:
      "Navigate perimenopause and beyond with clarity — symptom relief, bone and heart health, and care that takes you seriously.",
    icon: "leaf",
    points: ["Symptom guidance", "Bone & heart health", "Lifestyle support", "Ongoing care"],
  },
  {
    slug: "well-woman",
    title: "Well-Woman Checkups",
    summary:
      "Preventive care that keeps you ahead — routine screenings, contraception counselling, and answers to the questions you've been holding onto.",
    icon: "shield-check",
    points: ["Preventive screening", "Contraception counselling", "General wellbeing", "Health questions"],
  },
] as const;

export type Service = (typeof services)[number];

/** Consultation modes for the booking flow. */
export const consultModes = [
  { id: "video", label: "Video consultation", durationMin: 15, note: "Face-to-face from home" },
  { id: "audio", label: "Audio consultation", durationMin: 15, note: "Phone-based, low bandwidth" },
  { id: "chat", label: "Chat consultation", durationMin: 30, note: "Async text within a window" },
  { id: "in_person", label: "In-clinic visit", durationMin: 20, note: "Visit the clinic in person" },
] as const;

/** Honest, non-fabricated trust signals. */
export const trustPoints = [
  { stat: "MBBS", label: "GMCH, Guwahati" },
  { stat: "OB-GYN", label: "Training at CMH Bengaluru" },
  { stat: "WomanHood", label: "Founder & CEO" },
  { stat: "EN · हिं", label: "English & Hindi care" },
];

export const legalLinks: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Medical Disclaimer", href: "/disclaimer" },
];
