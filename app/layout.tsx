import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Government IT administrators need better database access controls to prevent mass data breaches",
  description: "Government IT administrators need better database access controls to prevent mass data breaches",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
