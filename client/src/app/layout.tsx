import type { Metadata } from "next";
import { Navbar } from "../components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tandoori Bowl | The OG Drip Rolls & Burgers",
  description: "Daily pre-order fresh fusion Indian rolls and burgers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-tandoori-dark text-tandoori-cream min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}