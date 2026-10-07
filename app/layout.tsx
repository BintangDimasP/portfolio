import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { sourceSerif, playfair } from "@/lib/fonts";
import Script from "next/script";


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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KN1XXW20EE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-KN1XXW20EE');
          `}
        </Script>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
