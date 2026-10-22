import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SpaceBackground } from "@/components/space-background";
import { Analytics } from "@/components/analytics";
import { withBase } from "@/lib/base-path";

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
  icons: { icon: withBase("/favicon.svg"), apple: withBase("/apple-touch-icon.png") },
  alternates: {
    types: { "application/rss+xml": "/index.xml" },
  },
  openGraph: {
    type: "website",
    siteName: "Value Yonder",
    title: "Value Yonder — Daniel Araújo",
    description: "AI product leader. Former founder. Writing about what I'm learning.",
    locale: "en_PT",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Value Yonder — Daniel Araújo",
    description: "AI product leader. Former founder. Writing about what I'm learning.",
    creator: "@JDanielAraujo",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0e17" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8fb" },
  ],
};

// Runs before paint to set the theme, avoiding a flash of the wrong colours.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

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
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <body>
        <script
          // Runs synchronously as the first thing in <body>, before any content
          // paints, so the theme is set with no flash. suppressHydrationWarning
          // stops React re-rendering this executable inline script on the client.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
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
          className="mt-24 py-10 text-center text-xs text-neutral-500"
          style={{ borderTop: "1px solid var(--color-border)" }}
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
        <Analytics />
      </body>
    </html>
  );
}
