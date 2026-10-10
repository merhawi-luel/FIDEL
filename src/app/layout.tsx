import type { Metadata } from "next";
import { Nunito, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const ethiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic",
});

export const metadata: Metadata = {
  title: "Fidel Word Garden",
  description: "Learn Amharic letters and words through play.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${ethiopic.variable}`}>
      <body>{children}</body>
    </html>
  );
}