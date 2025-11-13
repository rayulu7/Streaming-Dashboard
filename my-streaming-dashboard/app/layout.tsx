import type { Metadata } from "next";
import { ReactNode } from "react";
import Header from "./components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Streaming Dashboard",
  description: "Discover and track the latest movies across streaming platforms.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-white font-sans antialiased">
        <Header />
        <div className="mt-24">{children}</div>
      </body>
    </html>
  );
}

