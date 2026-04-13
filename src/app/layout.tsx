import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Outfit } from "next/font/google";
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

export const metadata: Metadata = {
  title: "LaunchPage — Waitlists & simple pages",
  description:
    "Create a landing page, collect signups, and manage email drafts from one dashboard. Start free, deploy on your own stack when you’re ready.",
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
      </body>
    </html>
  );
}
