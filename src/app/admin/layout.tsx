"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import type { User } from "@supabase/supabase-js";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        if (isLoginPage) {
          router.push("/admin");
        }
      } else if (!isLoginPage) {
        router.push("/admin/login");
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          if (!isLoginPage) {
            router.push("/admin/login");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-[#f5c80c] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-yellow-200">
            <span className="text-[#1e2a32] font-black text-lg">KK</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Login page - no sidebar
  if (isLoginPage) {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }

  // Dashboard pages - with sidebar
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#1e2a32",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "600",
          },
        }}
      />

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50/50">
        <Sidebar onLogout={handleLogout} userEmail={user?.email} />

        {/* Main Content */}
        <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
