import { cn } from "@/lib/utils";
import Navbar from "@/src/components/Navbar";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "축제랑",
  description: "대학 축제는 축제랑과 함께 더 즐겁게 !",
  openGraph: {
    title: "축제랑",
    description: "대학 축제는 축제랑과 함께 더 즐겁게 !",
    url: "https://withfestival.site",
    siteName: "축제랑",
    images: [
      {
        url: "https://withfestival.site/images/img_logo_full.svg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={cn("scroll-smooth bg-white", "font-sans", geist.variable)}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-white text-[#292a2e] antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
