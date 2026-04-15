import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Outfit } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-ibm",
  weight: ["400", "500"],
  display: "swap",
});

const siteDescription =
  "Create a landing page, collect signups, and manage email drafts from one dashboard. Start free, deploy on your own stack when you’re ready.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "LaunchPage — Waitlists & simple pages",
    template: "%s · LaunchPage",
  },
  description: siteDescription,
  applicationName: "LaunchPage",
  keywords: [
    "LaunchPage",
    "waitlist",
    "landing page",
    "email signups",
    "newsletter",
    "startup",
  ],
  authors: [{ name: "LaunchPage" }],
  creator: "LaunchPage",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LaunchPage",
    title: "LaunchPage — Waitlists & simple pages",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPage — Waitlists & simple pages",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1533" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} h-full`}
    >
      <body className={`${fontSans.className} min-h-full flex flex-col`}>
        <div className="organic-backdrop" aria-hidden />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
