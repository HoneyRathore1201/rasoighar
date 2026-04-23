import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "RasoiGhar — Your Indian Kitchen Companion",
  description: "Discover recipes, manage your pantry, and find out what you can cook with what you have. Authentic Indian recipes at your fingertips.",
  keywords: ["indian recipes", "cooking", "recipe manager", "pantry tracker", "what can i cook"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
