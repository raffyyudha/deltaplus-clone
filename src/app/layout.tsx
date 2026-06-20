import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaye Kaye Safety Solutions : Workwear, safety shoes, protective gloves",
  description: "Kaye Kaye Safety Solution offers you a selection of workwear, safety shoes and PPE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
