import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SpaceBackground } from "@/components/space-background";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://valueyonder.com"),
  title: "Value Yonder — Daniel Araújo",
  description: "AI product leader. Former founder. Writing about what I'm learning.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Value Yonder",
    title: "Value Yonder — Daniel Araújo",
    description: "AI product leader. Former founder. Writing about what I'm learning.",
    locale: "en_PT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Value Yonder — Daniel Araújo",
    description: "AI product leader. Former founder. Writing about what I'm learning.",
    creator: "@JDanielAraujo",
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Value Yonder",
  "url": "https://valueyonder.com",
};

const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Daniel Araújo",
  "url": "https://valueyonder.com",
  "jobTitle": "Principal Product Manager",
  "email": "jdc.araujo@gmail.com",
  "knowsAbout": ["AI product management", "product strategy", "org design", "startups"],
  "sameAs": [
    "https://www.linkedin.com/in/danielaraujopt/",
    "https://x.com/JDanielAraujo",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <SpaceBackground />
        <Nav />
        <main>{children}</main>
        <footer
          className="mt-24 py-10 text-center text-xs text-neutral-600"
          style={{ borderTop: "1px solid #1e1f28" }}
        >
          <div className="flex items-center justify-center gap-5 mb-3">
            <a
              href="https://www.linkedin.com/in/danielaraujopt/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/JDanielAraujo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-400 transition-colors"
            >
              X / Twitter
            </a>
          </div>
          © Daniel Araújo · Lisbon
        </footer>
      </body>
    </html>
  );
}
