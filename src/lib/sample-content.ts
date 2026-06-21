/**
 * Sample/seed content used to render the site before the Supabase CMS is wired.
 * Blog posts & FAQs here mirror what will later live in the database.
 *
 * NOTE: Testimonials are ILLUSTRATIVE placeholders — replace with real, consented
 * patient reviews before going live (see /admin → Reviews once DB is connected).
 */

export type ConsultStep = { step: string; title: string; body: string };

export const consultSteps: ConsultStep[] = [
  {
    step: "01",
    title: "Choose your consult",
    body: "Pick video, audio, chat, or an in-clinic visit — and a time that suits you. No account needed.",
  },
  {
    step: "02",
    title: "Share your concern",
    body: "A short, private intake form helps Dr. Priyal understand your history before you meet.",
  },
  {
    step: "03",
    title: "Meet & discuss",
    body: "Talk things through unhurried. Ask everything you've been meaning to ask, judgement-free.",
  },
  {
    step: "04",
    title: "Plan & prescription",
    body: "Receive a clear plan and a digital prescription on WhatsApp & email, with follow-up if needed.",
  },
];

export type ValuePoint = { title: string; body: string; icon: string };

export const valuePoints: ValuePoint[] = [
  {
    title: "Care that listens",
    body: "Sensitive concerns deserve time and warmth. You'll never feel rushed or judged.",
    icon: "ear",
  },
  {
    title: "Evidence-based",
    body: "Guidance grounded in current medical evidence — clear, honest, and practical for your life.",
    icon: "microscope",
  },
  {
    title: "For every stage",
    body: "From first periods and pregnancy to PCOS and menopause — one trusted partner through it all.",
    icon: "infinity",
  },
  {
    title: "Privacy first",
    body: "Your trackers stay on your device. Your data is shared only when you choose to.",
    icon: "lock",
  },
];

export type Testimonial = { quote: string; name: string; context: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "For the first time I left a consultation actually understanding my body. She explained my PCOS without scaring me, and the plan felt doable.",
    name: "Ananya R.",
    context: "PCOS consultation",
  },
  {
    quote:
      "The pregnancy tracker plus regular check-ins kept me calm through my first trimester. Everything in one place, in language I understood.",
    name: "Sneha M.",
    context: "Antenatal care",
  },
  {
    quote:
      "Booking a video consult took two minutes and no sign-up. Got my prescription on WhatsApp the same evening.",
    name: "Pooja K.",
    context: "Online consultation",
  },
];

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readingMinutes: number;
  tone: "sage" | "clay" | "gold" | "pine";
  body: BlogBlock[];
};

export const blogCategories = [
  "Pregnancy",
  "Periods & Cycles",
  "PCOS",
  "Fertility",
  "Menopause",
  "Wellness",
] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "understanding-pcos-without-the-fear",
    title: "Understanding PCOS without the fear",
    excerpt:
      "PCOS is common, manageable, and not your fault. Here's a calm, practical guide to what it means and where to start.",
    category: "PCOS",
    tags: ["PCOS", "hormones", "lifestyle"],
    author: "Dr. Priyal Agarwal",
    date: "2026-05-28",
    readingMinutes: 6,
    tone: "sage",
    body: [
      { type: "p", text: "If you've just been told you have PCOS (or PCOD), it's normal to feel overwhelmed. Take a breath. Polycystic ovary syndrome is one of the most common hormonal conditions in women — and with the right understanding, it is very manageable." },
      { type: "h2", text: "What PCOS actually is" },
      { type: "p", text: "PCOS is a hormonal imbalance that can affect your cycles, skin, weight, and long-term metabolic health. It looks different in every woman, which is exactly why your plan should be built around you — not a one-size-fits-all checklist." },
      { type: "h2", text: "Where to start" },
      { type: "ul", items: [
        "Track your cycles so you have real data to discuss.",
        "Prioritise sleep, movement you enjoy, and balanced meals over crash diets.",
        "Get the right baseline tests so guidance is precise, not guesswork.",
        "Treat it as a long-term partnership, not a quick fix.",
      ]},
      { type: "p", text: "Most importantly: PCOS is not a personal failing. With steady, evidence-based care, the vast majority of women manage their symptoms well and protect their future health." },
    ],
  },
  {
    slug: "eating-well-in-pregnancy-an-indian-plate",
    title: "Eating well in pregnancy: building a balanced Indian plate",
    excerpt:
      "You don't need exotic superfoods. Iron, folate, protein and calcium from everyday Indian meals go a long way.",
    category: "Pregnancy",
    tags: ["nutrition", "pregnancy", "diet"],
    author: "Dr. Priyal Agarwal",
    date: "2026-05-12",
    readingMinutes: 5,
    tone: "clay",
    body: [
      { type: "p", text: "Good pregnancy nutrition isn't about expensive supplements or trendy foods. It's about building a balanced plate from what's already in your kitchen." },
      { type: "h2", text: "The four things that matter most" },
      { type: "ul", items: [
        "Iron — leafy greens, dates, jaggery, and pulses, paired with vitamin C for absorption.",
        "Folate — green vegetables, legumes, and your prescribed supplement.",
        "Protein — dal, paneer, eggs, curd, and lean meats at every meal.",
        "Calcium — milk, curd, ragi, and sesame.",
      ]},
      { type: "p", text: "Stay hydrated, eat small frequent meals if nausea strikes, and don't skip your prescribed iron and folic acid. Always check with your doctor before adding new supplements." },
    ],
  },
  {
    slug: "five-period-myths-its-time-to-retire",
    title: "Five period myths it's time to retire",
    excerpt:
      "From 'a 28-day cycle is mandatory' to 'pain is just part of it' — let's separate fact from folklore.",
    category: "Periods & Cycles",
    tags: ["periods", "myths", "menstrual health"],
    author: "Dr. Priyal Agarwal",
    date: "2026-04-30",
    readingMinutes: 4,
    tone: "gold",
    body: [
      { type: "p", text: "Menstrual health is surrounded by myths passed down through generations. Here are a few worth letting go of." },
      { type: "h2", text: "Myth: every cycle must be exactly 28 days" },
      { type: "p", text: "Anything from 21 to 35 days can be perfectly normal. What matters more is what's regular for you." },
      { type: "h2", text: "Myth: severe period pain is just something to endure" },
      { type: "p", text: "Pain that disrupts your life is worth discussing. It can be managed, and sometimes it points to a treatable cause." },
      { type: "p", text: "If your cycle suddenly changes, or pain is severe, that's a good reason to book a consultation rather than wait it out." },
    ],
  },
  {
    slug: "planning-a-pregnancy-the-preconception-checklist",
    title: "Planning a pregnancy: a simple preconception checklist",
    excerpt:
      "A few thoughtful steps before you start trying can make a real difference. Here's where to begin.",
    category: "Fertility",
    tags: ["preconception", "fertility", "planning"],
    author: "Dr. Priyal Agarwal",
    date: "2026-04-15",
    readingMinutes: 5,
    tone: "pine",
    body: [
      { type: "p", text: "Preconception care is some of the most valuable care you can invest in — and it starts a few months before you try to conceive." },
      { type: "h2", text: "Your starter checklist" },
      { type: "ul", items: [
        "Start folic acid at least one to three months before trying.",
        "Get a preconception check — including blood group, thyroid, and sugar where advised.",
        "Review any medications with your doctor.",
        "Track your cycle to understand your fertile window.",
      ]},
      { type: "p", text: "Every journey is different. If you've been trying for a while without success, an early conversation can save time and worry." },
    ],
  },
];

export type Faq = { question: string; answer: string; category: string };

export const faqs: Faq[] = [
  {
    category: "Consultations",
    question: "Do I need to create an account to book a consultation?",
    answer:
      "No. Booking is completely sign-up free. You simply choose a slot, share a few details, and you'll receive your confirmation and joining link on WhatsApp and email.",
  },
  {
    category: "Consultations",
    question: "What types of consultation are available?",
    answer:
      "Video, audio, and chat consultations from anywhere, plus in-clinic visits. You can pick whichever feels most comfortable when you book.",
  },
  {
    category: "Consultations",
    question: "Will I get a prescription after an online consult?",
    answer:
      "Where clinically appropriate, yes. Dr. Priyal issues a digital prescription in line with India's Telemedicine Practice Guidelines, delivered to you on WhatsApp and email.",
  },
  {
    category: "Trackers",
    question: "Is my period and pregnancy tracker data private?",
    answer:
      "Yes — by design. Your tracker data is stored privately on your own device. Nothing is shared unless you explicitly choose to share it during a consultation.",
  },
  {
    category: "Payments",
    question: "How do I pay?",
    answer:
      "Payments are in INR via UPI, cards, net-banking, and wallets through a secure gateway. You'll get a receipt by email.",
  },
  {
    category: "Emergencies",
    question: "Can I use this for an emergency?",
    answer:
      "No. Online consultation is not for emergencies. If you have severe pain, heavy bleeding, or any urgent symptom, please visit the nearest hospital or call your local emergency number.",
  },
];
