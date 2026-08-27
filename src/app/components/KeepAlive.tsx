"use client";

import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    const ping = async () => {
      try {
        await fetch("/api/keepalive", { method: "POST" });
      } catch (e) {
        // Silent fail - keep-alive is best-effort
      }
    };

    // Ping immediately on first visit
    ping();

    // Then ping every 4 hours
    const interval = setInterval(ping, 4 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
