"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, blogs: 0, sections: 0 });
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, blogsRes, sectionsRes] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("blog_posts").select("id", { count: "exact", head: true }),
          supabase.from("site_content").select("updated_at").order("updated_at", { ascending: false }).limit(1),
        ]);

        setStats({
          products: productsRes.count || 0,
          blogs: blogsRes.count || 0,
          sections: 0,
        });

        if (sectionsRes.data?.[0]) {
          setLastUpdated(new Date(sectionsRes.data[0].updated_at).toLocaleString("en-US"));
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    { href: "/admin/hero", label: "Hero Section", icon: "🖼️", color: "from-yellow-400 to-orange-400" },
    { href: "/admin/products", label: "Manage Products", icon: "📦", color: "from-blue-400 to-indigo-400" },
    { href: "/admin/blogs", label: "Blog Posts", icon: "📝", color: "from-green-400 to-emerald-400" },
    { href: "/admin/settings", label: "Site Settings", icon: "⚙️", color: "from-purple-400 to-pink-400" },
    { href: "/admin/heritage", label: "Heritage & Story", icon: "📜", color: "from-amber-400 to-yellow-500" },
    { href: "/admin/contact", label: "Contact Info", icon: "📞", color: "from-cyan-400 to-blue-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#1e2a32] to-[#2d3f4a] rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-black">Welcome Back! 👋</h1>
        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          Manage Kaye Kaye Safety Solutions website content dynamically from this dashboard.
        </p>
        {lastUpdated && (
          <p className="text-xs text-gray-400 mt-3">
            🕐 Last updated: {lastUpdated}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <p className="text-2xl font-black text-[#1e2a32]">
                {loading ? "..." : stats.products}
              </p>
              <p className="text-xs text-gray-500 font-semibold">Total Catalog Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <p className="text-2xl font-black text-[#1e2a32]">
                {loading ? "..." : stats.blogs}
              </p>
              <p className="text-xs text-gray-500 font-semibold">Blog Posts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
            <div>
              <p className="text-2xl font-black text-green-600">Active</p>
              <p className="text-xs text-gray-500 font-semibold">Supabase System Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-[#1e2a32] mb-4">⚡ Quick Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <span className="text-xl">{action.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#1e2a32] group-hover:text-[#f5c80c] transition-colors">
                    {action.label}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">Click to edit →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <span>💡</span> Admin Tips
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-amber-700">
          <li>• Select any section from the left navigation drawer to customize your website.</li>
          <li>• Drag & drop or upload images directly with instant live preview.</li>
          <li>• Click <strong>&quot;Save Changes&quot;</strong> to immediately publish changes to your live site.</li>
        </ul>
      </div>
    </div>
  );
}
