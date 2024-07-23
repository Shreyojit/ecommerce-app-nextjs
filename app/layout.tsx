import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommerece Next App",
  description: "Mordern Nextjs app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
         <Header/>
         <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-centre items-center shadow-inner "></footer>
        </div>
        
        </body>
    </html>
  );
}
