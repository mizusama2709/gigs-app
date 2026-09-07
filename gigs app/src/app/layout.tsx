import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hyderabad Freelance Marketplace",
  description: "Book and hire local creative freelancers in Hyderabad.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-16 lg:pb-0 lg:pl-24 bg-background text-foreground font-sans">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
