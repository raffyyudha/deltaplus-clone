"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === "Invalid login credentials"
          ? "Email atau password salah. Silakan coba lagi."
          : authError.message);
        return;
      }

      router.push("/admin");
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#f5c80c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-200">
            <span className="text-[#1e2a32] font-black text-xl">KK</span>
          </div>
          <h1 className="text-2xl font-black text-[#1e2a32]">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Kaye Kaye Safety Solutions</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-[#1e2a32] mb-6">Masuk ke akun Anda</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] focus:ring-2 focus:ring-[#f5c80c]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] focus:ring-2 focus:ring-[#f5c80c]/20 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-md ${
                loading
                  ? "bg-[#f5c80c]/70 text-[#1e2a32] cursor-wait"
                  : "bg-[#f5c80c] text-[#1e2a32] hover:bg-yellow-400 hover:shadow-lg active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login →"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Protected admin area • Kaye Kaye Safety Solutions
        </p>
      </div>
    </div>
  );
}
