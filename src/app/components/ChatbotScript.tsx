"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function ChatbotScript() {
  const pathname = usePathname();

  // Hide chatbot on all admin dashboard routes!
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Script
      src="https://chatbot.aiconvo.sg/chat/widget.js?work-space-Id=213"
      strategy="afterInteractive"
    />
  );
}
