import type { Metadata } from "next";
import { Inter, Mukta } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mukta",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drpriyalagarwal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dr. Priyal Agarwal — Women's Health & Care",
    template: "%s · Dr. Priyal Agarwal",
  },
  description:
    "Compassionate, evidence-based women's health care with Dr. Priyal Agarwal. Online consultations, period & pregnancy tracking, and trusted health guidance for every stage of a woman's life.",
  keywords: [
    "gynecologist",
    "obstetrician",
    "women's health",
    "online consultation",
    "period tracker",
    "pregnancy tracker",
    "PCOS",
    "antenatal care",
    "Bengaluru gynaecologist",
  ],
  authors: [{ name: "Dr. Priyal Agarwal" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Dr. Priyal Agarwal",
    title: "Dr. Priyal Agarwal — Women's Health & Care",
    description:
      "Care that understands every woman — online consultations, period & pregnancy trackers, and trusted guidance.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mukta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--paper)",
              color: "var(--ink)",
              border: "1px solid var(--sand)",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
