/**
 * Centralized image library. Images are stored locally in /public (royalty-free
 * from Unsplash) so the site is self-contained — no external image dependency.
 * Swap any file in /public to restyle the whole site.
 *
 * IMPORTANT: `/dr-priyal.jpg` is a professional stock placeholder representing
 * "a caring gynaecologist". Replace that ONE file in /public with Dr. Priyal
 * Agarwal's real photo and it updates everywhere automatically.
 * (Her LinkedIn photo can't be fetched automatically — LinkedIn blocks it.)
 */

/** Dr. Priyal's photo — replace /public/dr-priyal.jpg with her real photo. */
export const DOCTOR_PHOTO_LOCAL = "/dr-priyal.jpg";

export const img = {
  doctorPortrait: "/dr-priyal.jpg",
  consult: "/images/consult.jpg",
  family: "/images/family.jpg",
  babyFeet: "/images/baby-feet.jpg",
  yoga: "/images/yoga.jpg",
  spa: "/images/spa.jpg",
  rose: "/images/rose.jpg",
} as const;

/** Per-service hero imagery. */
export const serviceImages: Record<string, string> = {
  "pregnancy-care": img.babyFeet,
  "period-menstrual-health": img.spa,
  "pcos-pcod": img.yoga,
  "fertility-preconception": img.family,
  "adolescent-health": img.rose,
  "menopause-midlife": img.yoga,
  "well-woman": img.spa,
};

/** Per-category blog cover imagery. */
export const blogImages: Record<string, string> = {
  Pregnancy: img.babyFeet,
  "Periods & Cycles": img.spa,
  PCOS: img.yoga,
  Fertility: img.family,
  Menopause: img.yoga,
  Wellness: img.rose,
};
