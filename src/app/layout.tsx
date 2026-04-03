import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Livinexo — Modern Household Manager",
  description:
    "A next-generation platform for managing modern living. Track expenses, split costs, and get insights.",
  metadataBase: new URL("https://livinexo.vercel.app"),
  openGraph: {
    title: "Livinexo — Modern Household Manager",
    description:
      "A next-generation platform for managing modern living. Track expenses, split costs, and get insights.",
    url: "https://livinexo.vercel.app",
    siteName: "Livinexo",
    images: [
      {
        url: "/livinexo-logo.png",
        width: 1024,
        height: 576,
        alt: "Livinexo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Livinexo — Modern Household Manager",
    description:
      "A next-generation platform for managing modern living. Track expenses, split costs, and get insights.",
    images: ["/livinexo-logo.png"],
  },
  icons: {
    icon: "/livinexo-mark.png",
    shortcut: "/livinexo-mark.png",
    apple: "/livinexo-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-sand-50`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
