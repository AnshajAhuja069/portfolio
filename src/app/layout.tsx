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
  title: {
    default: profile.meta.title,
    template: `%s · ${profile.name}`,
  },
  description: profile.meta.description,
  authors: [{ name: profile.name }],
};

export const viewport: Viewport = {
  themeColor: "#f5f2eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${inter.variable}`}
    >
      <body>
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
