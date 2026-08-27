"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import type { BlogPost } from "@/lib/database.types";

const defaultInitialBlogs = [
  {
    title: "Essential PPE Guide for Construction Workers in Singapore",
    seo_title: "Essential PPE Guide for Construction Workers in Singapore",
    slug: "essential-ppe-guide-construction-singapore",
    meta_description: "Learn how to choose the right personal protective equipment for construction sites in Singapore, covering all mandatory SS safety codes.",
    excerpt: "A comprehensive guide to choosing the right personal protective equipment for construction sites in Singapore, covering all mandatory safety requirements.",
    content: "Full guide on construction PPE in Singapore...",
    cover_image: "/images/hero_background.avif",
    cover_image_caption: "Site engineer inspecting safety equipment before deployment.",
    author: "KK Team",
    author_bio: "Safety specialist and technical writer at Kaye Kaye Safety Solutions.",
    reading_time: "5 min read",
    reading_time_minutes: 5,
    breadcrumbs: "Blog > Construction Safety",
    tags: ["PPE", "Construction", "Safety Guide", "Singapore"],
    is_published: true,
    published_at: new Date().toISOString(),
    content_blocks: [
      { id: "1", type: "paragraph", value: "Personal Protective Equipment (PPE) is not just a regulatory requirement in Singapore—it's a critical safety system for construction workers who face daily hazards on site." },
      { id: "2", type: "h2", value: "Essential Tools and Protection Needed" },
      { id: "3", type: "paragraph", value: "According to the Ministry of Manpower (MOM), the construction industry consistently records high workplace activity in Singapore. Proper PPE significantly reduces the risk of head, hand, and fall injuries." },
      { id: "4", type: "h2", value: "Step 1: Inspecting Head Protection" },
      { id: "5", type: "paragraph", value: "Safety helmets are mandatory on all construction sites. Look for helmets certified to SS 98 or ANSI Z89.1 standards with 4-point chin straps." },
      { id: "6", type: "image", value: "/images/helmet1.avif", caption: "Ventilated ABS hard hat with 4-point suspension system.", alt: "Yellow ABS Hard Hat" },
      { id: "7", type: "h2", value: "Step 2: Choosing Safety Footwear" },
      { id: "8", type: "paragraph", value: "Steel-toe safety boots must comply with EN ISO 20345 S3 standards, featuring puncture-resistant midsoles and anti-slip outsoles." },
    ],
    faqs: [
      { id: "f1", question: "Is PPE mandatory on all Singapore construction sites?", answer: "Yes, under the Workplace Safety and Health (WSH) Act, employers must provide compliant PPE to all workers." },
      { id: "f2", question: "How often should safety helmets be replaced?", answer: "Helmets should be replaced every 2 to 3 years, or immediately after experiencing an impact event." },
    ],
    cta: {
      heading: "Need Bulk PPE Sourcing or Safety Audits?",
      description: "Speak directly to our Singapore engineering sales team for flat-rate quotes and site delivery within 24 hours.",
      button_text: "Call Kaye Kaye 24/7",
      button_link: "tel:+6581464525",
    },
  },
  {
    title: "Understanding Fall Protection Standards: SS 528 vs EN 361",
    seo_title: "Understanding Fall Protection Standards: SS 528 vs EN 361",
    slug: "fall-protection-standards-ss528-en361",
    meta_description: "Breaking down the key differences between Singapore Standard SS 528 and European Standard EN 361 for fall protection equipment.",
    excerpt: "Breaking down the key differences between Singapore Standard SS 528 and European Standard EN 361 for fall protection equipment.",
    content: "Comparison between SS 528 and EN 361 standards...",
    cover_image: "/images/harness.avif",
    cover_image_caption: "Full body harness for scaffolding and height work.",
    author: "Safety Specialist",
    author_bio: "Certified height safety inspector at Kaye Kaye Safety Solutions.",
    reading_time: "4 min read",
    reading_time_minutes: 4,
    breadcrumbs: "Blog > Height Safety",
    tags: ["Fall Protection", "SS 528", "EN 361"],
    is_published: true,
    published_at: new Date(Date.now() - 86400000).toISOString(),
    content_blocks: [
      { id: "1", type: "paragraph", value: "When working at height on Singapore job sites, understanding the safety codes governing fall protection harnesses and lanyards is crucial." },
      { id: "2", type: "h2", value: "What is SS 528?" },
      { id: "3", type: "paragraph", value: "Singapore Standard SS 528 specifies performance requirements for full-body harnesses, shock-absorbing lanyards, and self-retracting lifelines." },
      { id: "4", type: "h2", value: "What is EN 361?" },
      { id: "5", type: "paragraph", value: "EN 361 is the European standard for fall arrest harnesses. Both SS 528 and EN 361 ensure maximum energy absorption during a fall event." },
    ],
    faqs: [
      { id: "f1", question: "Can we use EN 361 harnesses in Singapore?", answer: "Yes, EN 361 certified harnesses are accepted in Singapore alongside SS 528 compliant gear." },
    ],
    cta: {
      heading: "Looking for Certified Fall Arrest Gear?",
      description: "Contact Kaye Kaye Safety Solutions for SS 528 & EN 361 full-body harnesses and inspectable lanyards.",
      button_text: "WhatsApp Us Now",
      button_link: "https://wa.me/6581464525",
    },
  },
];

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });

    if (!data || data.length === 0) {
      // Auto seed initial blog posts into Supabase if empty!
      const { data: insertedData } = await supabase.from("blog_posts").insert(defaultInitialBlogs).select();
      if (insertedData) setPosts(insertedData as BlogPost[]);
    } else {
      setPosts(data as BlogPost[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const togglePublish = async (post: BlogPost) => {
    const newState = !post.is_published;
    await supabase.from("blog_posts").update({
      is_published: newState,
      published_at: newState ? new Date().toISOString() : null,
    }).eq("id", post.id);
    toast.success(newState ? "Article published!" : "Article unpublished!");
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Blog post deleted!");
    fetchPosts();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse font-bold">Loading blog articles...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-[#1e2a32]">📝 Blog Posts</h1><p className="text-sm text-gray-500 mt-1">Manage articles ({posts.length} Articles)</p></div>
        <Link href="/admin/blogs/new" className="bg-[#f5c80c] text-[#1e2a32] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-400 transition shadow-sm">
          + Write New Article
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-50 border flex-shrink-0 relative">
              {post.cover_image ? (
                <Image src={post.cover_image} alt={post.title} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📝</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-[#1e2a32] truncate">{post.title}</h3>
              <p className="text-xs text-gray-400 truncate">{post.excerpt || post.meta_description || "No description"}</p>
              <div className="flex gap-2 mt-1">
                {(post.tags || []).slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => togglePublish(post)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition ${
                  post.is_published ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                {post.is_published ? "✓ Published" : "Draft"}
              </button>
              <Link href={`/admin/blogs/${post.id}`} className="p-2 hover:bg-[#f5c80c]/10 rounded-lg transition" title="Edit">✏️</Link>
              <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
