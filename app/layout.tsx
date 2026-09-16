import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { sourceSerif, playfair } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Bintang Dimas - Portfolio",
  description: "This is my portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <body 
        className={`${sourceSerif.className} ${playfair.variable} min-h-screen bg-black text-[#F2F0EF] flex flex-col relative overflow-x-hidden`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
