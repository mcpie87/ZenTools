import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClientInit } from "@/components/ClientInit";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "ZenTools",
  description: "Zenless Zone Zero tools and other stuff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
      <body className="text-primary bg-base-100">
        <ClientInit>
          <div className="mx-auto">
            <Header />
            <main className="mt-8">{children}</main>
            <Footer />
          </div>
        </ClientInit>
      </body>
    </html>
  );
}
