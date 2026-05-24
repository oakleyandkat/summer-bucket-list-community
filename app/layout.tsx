import type { Metadata } from "next";
import { Nunito, Fraunces } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  weight: ["700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Summer, but make it fun — a bucket list for the uninspired",
  description:
    "A bucket list for people who have three months of freedom and absolutely no plan. Pick a vibe. Go outside. Or stay in — there are cozy ones too.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-nunito)]">
        <div className="blob blob-sun" aria-hidden />
        <div className="blob blob-cloud-1" aria-hidden />
        <div className="blob blob-cloud-2" aria-hidden />
        <div className="blob blob-palm" aria-hidden>🌴</div>
        {children}
      </body>
    </html>
  );
}
