import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const exposure = localFont({
  src: [
    {
      path: "./fonts/205TF-Exposure-20.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/205TF-Exposure-20.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/205TF-Exposure-20-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/205TF-Exposure-20-Italic.woff",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-exposure",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skip | 2% Deposit Home Loans",
  description: "Same process. Same security. 10x less deposit.",
  metadataBase: new URL("https://www.skip.com.au"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Skip | 2% Deposit Home Loans",
    description: "Same process. Same security. 10x less deposit.",
    url: "https://www.skip.com.au",
    siteName: "Skip",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/hero-kangaroo.png",
        width: 1200,
        height: 630,
        alt: "Skip 2% deposit home loans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skip | 2% Deposit Home Loans",
    description: "Same process. Same security. 10x less deposit.",
    images: ["/hero-kangaroo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${exposure.variable} antialiased`}>{children}</body>
    </html>
  );
}
