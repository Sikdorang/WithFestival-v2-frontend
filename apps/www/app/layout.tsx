import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "축제랑 | 축제는 당연히 !",
  description: "WithFestival",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="bg-gray-100 scroll-smooth">
      <body
        className={`${inter.className} bg-gray-100 text-gray-1000 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
