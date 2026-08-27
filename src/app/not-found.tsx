"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Client-side redirect to the homepage
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e2a32] text-white">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5c80c] mx-auto"></div>
        <p className="text-sm font-semibold tracking-wide text-gray-300 font-sans">Redirecting to homepage...</p>
      </div>
    </div>
  );
}
