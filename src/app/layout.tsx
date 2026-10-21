import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RouteFocus } from "@/components/layout/RouteFocus";
import { Magnetic } from "@/components/layout/Magnetic";
import { Guide } from "@/components/guide/Guide";
import { profile } from "@/content/profile";
import "./globals.css";

// Both fonts are downloaded at build time and served from this site
// (next/font) — the browser never requests Google Fonts. SIL OFL 1.1.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.meta.siteUrl),
  title: {
    default: profile.meta.title,
    template: `%s · ${profile.name}`,
  },
  description: profile.meta.description,
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: profile.meta.title,
    description: profile.meta.description,
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: profile.meta.title,
    description: profile.meta.description,
  },
};

/** Structured data for search engines: who this site is about. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.meta.siteUrl,
  jobTitle: "Chief Product Officer",
  worksFor: { "@type": "Organization", name: "Gamersberg" },
  description: profile.meta.description,
  sameAs: [profile.links.linkedin, profile.links.github],
};

export const viewport: Viewport = {
  themeColor: "#f5f2eb",
};

/** Applies a saved dark theme before first paint, so there is no flash.
    Keep the key in sync with THEME_KEY in ThemeToggle.tsx. */
const themeScript = `try{if(localStorage.getItem("theme")==="dark"){document.documentElement.dataset.theme="dark";var m=document.querySelector("meta[name=theme-color]");if(m)m.content="#11151d"}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${inter.variable}`}
      // The theme script may set data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          // Static, site-owned data; nothing user-supplied is interpolated.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <RouteFocus />
        <Magnetic />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        {/* After the footer so the skip link and nav keep their tab order. */}
        <Guide />
      </body>
    </html>
  );
}
