import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
      <body className="antialiased">
        {children}
        <Script
          src="https://chatbot.aiconvo.sg/chat/widget.js?work-space-Id=213"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
