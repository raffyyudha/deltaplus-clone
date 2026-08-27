"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "🏠", exact: true },
  { href: "/admin/settings", label: "Site Settings", icon: "⚙️" },
  { href: "/admin/hero", label: "Hero Section", icon: "🖼️" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/heritage", label: "Heritage & About", icon: "📜" },
  { href: "/admin/commitments", label: "Commitments", icon: "🤝" },
  { href: "/admin/sectors", label: "Sectors", icon: "🏗️" },
  { href: "/admin/stats", label: "Statistics", icon: "📊" },
  { href: "/admin/contact", label: "Contact", icon: "📞" },
  { href: "/admin/features", label: "Features", icon: "✨" },
  { href: "/admin/blogs", label: "Blog Posts", icon: "📝" },
];

interface SidebarProps {
  onLogout: () => void;
  userEmail?: string;
}

export default function Sidebar({ onLogout, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="w-10 h-10 bg-[#f5c80c] rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-[#1e2a32] font-black text-sm">KK</span>
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2a32] text-sm leading-none">Admin Panel</h2>
            <span className="text-[10px] text-gray-400 font-medium">Kaye Kaye Safety</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive(item)
                  ? "bg-[#f5c80c] text-[#1e2a32] shadow-sm shadow-yellow-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#1e2a32]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {isActive(item) && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#1e2a32] rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* View Site Link */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all"
        >
          <span className="text-lg">🌐</span>
          <span>View Live Site</span>
          <svg className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1e2a32] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {userEmail?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1e2a32] truncate">{userEmail || "Admin"}</p>
            <p className="text-[10px] text-gray-400">Administrator</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="Logout"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <svg className="w-6 h-6 text-[#1e2a32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#f5c80c] rounded-lg flex items-center justify-center">
            <span className="text-[#1e2a32] font-black text-[10px]">KK</span>
          </div>
          <span className="font-bold text-sm text-[#1e2a32]">Admin</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm z-40">
        {sidebarContent}
      </aside>
    </>
  );
}
