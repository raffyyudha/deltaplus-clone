import type { Metadata } from "next";
import "./globals.css";
import KeepAlive from "./components/KeepAlive";
import ChatbotScript from "./components/ChatbotScript";

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
        <KeepAlive />
        <ChatbotScript />
      </body>
    </html>
  );
}
