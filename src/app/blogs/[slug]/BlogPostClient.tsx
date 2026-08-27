"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost, ContentBlock } from "@/lib/database.types";
import toast from "react-hot-toast";

interface Props {
  post: BlogPost;
  relatedPosts: Partial<BlogPost>[];
}

export default function BlogPostClient({ post, relatedPosts }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // first FAQ open by default
  const [copied, setCopied] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const copyPageUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Generate Table of Contents from H2 blocks
  const h2Blocks = (post.content_blocks || []).filter((b) => b.type === "h2");

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans">
      
      {/* Header Bar */}
      <header className="bg-[#1e2a32] border-b border-zinc-800 sticky top-0 z-50 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#f5c80c] rounded-lg flex items-center justify-center font-black text-xs text-[#1e2a32]">
              KK
            </div>
            <div>
              <span className="font-black text-sm uppercase tracking-tight text-white block">Kaye Kaye</span>
              <span className="text-[#f5c80c] text-[9px] font-bold uppercase tracking-widest block">Safety Solutions</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            <Link href="/" className="hover:text-[#f5c80c] transition-colors">HOME</Link>
            <Link href="/#catalog" className="hover:text-[#f5c80c] transition-colors">SAFETY CATALOG</Link>
            <Link href="/blogs" className="text-[#f5c80c] font-bold">BLOG</Link>
            <Link href="/#about" className="hover:text-[#f5c80c] transition-colors">ABOUT US</Link>
            <Link href="/#contact" className="hover:text-[#f5c80c] transition-colors">CONTACT US</Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${post.cta?.button_link?.replace(/[^0-9]/g, "") || "6581464525"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f5c80c] text-[#1e2a32] px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-400 transition-all shadow-sm"
            >
              <span>📞 WhatsApp Hotline</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-16">
        
        {/* Top Gradient Hero Banner */}
        <section className="bg-gradient-to-br from-gray-100 via-yellow-50/30 to-white text-zinc-900 pt-8 pb-12 border-b border-zinc-200 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 relative z-10 space-y-5">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-zinc-500">
              <Link href="/blogs" className="hover:text-[#f5c80c] transition-colors flex items-center gap-0.5">
                Blog
              </Link>
              <span className="text-zinc-400">›</span>
              <span className="text-zinc-500">{post.breadcrumbs || "Safety Guide"}</span>
              <span className="text-zinc-400">›</span>
              <span className="text-zinc-900 font-bold line-clamp-1">{post.title}</span>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#1e2a32] tracking-tight leading-tight max-w-4xl">
              {post.title}
            </h1>

            {/* Post Meta Line */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-500 pt-4 border-t border-zinc-200/80">
              <span>
                Author: <span className="text-[#1e2a32] font-bold underline">{post.author || "KK Team"}</span>
              </span>
              <span>|</span>
              <span>{post.reading_time || `${post.reading_time_minutes || 5} min read`}</span>
              <span>|</span>
              <span>
                {new Date(post.published_at || post.created_at).toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

          </div>
        </section>

        {/* Main Grid Section */}
        <section className="max-w-6xl mx-auto px-4 mt-8">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Article Left Column (8 cols) */}
            <article className="lg:col-span-8 space-y-6">
              
              {/* Featured Image Card */}
              {post.cover_image && (
                <div className="bg-white border border-zinc-200/80 rounded-3xl p-3 shadow-sm overflow-hidden space-y-3">
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-100">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  </div>
                  {post.cover_image_caption && (
                    <p className="text-[11px] text-zinc-400 font-semibold text-center italic">
                      {post.cover_image_caption}
                    </p>
                  )}
                </div>
              )}

              {/* Content Blocks Container */}
              <div className="bg-white p-2 md:p-4 prose prose-zinc max-w-none">
                
                {/* Meta Description / Excerpt Box */}
                {post.meta_description && (
                  <div className="seo-rich-text text-zinc-700 text-[16px] md:text-[18px] leading-relaxed mb-6 font-medium bg-gray-50 border-l-4 border-[#f5c80c] p-4 rounded-r-xl">
                    {post.meta_description}
                  </div>
                )}

                {/* Render Dynamic Content Blocks if available, otherwise raw content */}
                {post.content_blocks && post.content_blocks.length > 0 ? (
                  post.content_blocks.map((block) => {
                    const headingId = block.value ? block.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "";

                    if (block.type === "h2") {
                      return (
                        <h2
                          key={block.id}
                          id={headingId}
                          className="text-xl md:text-3xl font-black text-[#1e2a32] mt-12 mb-5 leading-tight scroll-mt-28"
                        >
                          {block.value}
                        </h2>
                      );
                    }

                    if (block.type === "h3") {
                      return (
                        <h3
                          key={block.id}
                          id={headingId}
                          className="text-lg md:text-2xl font-black text-[#1e2a32] mt-10 mb-4 leading-tight scroll-mt-28"
                        >
                          {block.value}
                        </h3>
                      );
                    }

                    if (block.type === "image") {
                      return (
                        <div key={block.id} className="my-8 space-y-2 text-center">
                          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 mx-auto">
                            <Image
                              src={block.value}
                              alt={block.alt || block.caption || "Article Image"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          {block.caption && (
                            <p className="text-[11px] text-zinc-400 font-semibold italic">
                              {block.caption}
                            </p>
                          )}
                        </div>
                      );
                    }

                    if (block.type === "callout") {
                      return (
                        <div key={block.id} className="bg-yellow-50/50 border-l-4 border-[#f5c80c] p-5 my-6 rounded-r-2xl italic font-semibold text-zinc-800 text-base">
                          {block.value}
                        </div>
                      );
                    }

                    // Default: Paragraph
                    return (
                      <p key={block.id} className="seo-rich-text text-zinc-800 text-[16px] md:text-[18px] leading-relaxed mb-6 font-normal whitespace-pre-line">
                        {block.value}
                      </p>
                    );
                  })
                ) : (
                  <div className="seo-rich-text text-zinc-800 text-[16px] md:text-[18px] leading-relaxed mb-6 font-normal whitespace-pre-line">
                    {post.content}
                  </div>
                )}
              </div>

              {/* FAQ Accordions Section */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 mt-12 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-yellow-100 text-[#1e2a32] rounded-xl shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path strokeWidth="2" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path strokeWidth="2" d="M12 17h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-[#1e2a32] uppercase leading-tight">
                      Frequently Asked Questions
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {post.faqs.map((faq, index) => (
                      <div
                        key={faq.id || index}
                        className="border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-200 bg-zinc-50/50 hover:bg-zinc-50"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(index)}
                          className="w-full flex items-center justify-between p-5 text-left font-bold text-[#1e2a32] hover:text-[#f5c80c] transition-colors focus:outline-none"
                        >
                          <span className="text-xs md:text-sm leading-relaxed">{faq.question}</span>
                          <svg
                            className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-300 ml-4 ${
                              openFaq === index ? "rotate-180 text-[#f5c80c]" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {openFaq === index && (
                          <div className="p-5 text-xs md:text-sm text-zinc-600 leading-relaxed bg-white font-medium border-t border-zinc-100 whitespace-pre-line">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action Box */}
              {post.cta && post.cta.heading && (
                <div className="bg-gradient-to-br from-[#1e2a32] to-[#2d3f4a] text-white p-8 md:p-12 rounded-3xl relative overflow-hidden border border-zinc-800 shadow-xl mt-12 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,200,12,0.1),transparent_70%)]" />
                  <div className="space-y-3 max-w-xl relative z-10">
                    <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-snug">
                      {post.cta.heading}
                    </h4>
                    <p className="text-gray-300 text-xs md:text-sm font-medium leading-relaxed">
                      {post.cta.description}
                    </p>
                  </div>
                  <div className="shrink-0 relative z-10">
                    <a
                      href={post.cta.button_link || "tel:+6581464525"}
                      className="inline-flex items-center gap-2.5 bg-[#f5c80c] hover:bg-yellow-400 text-[#1e2a32] px-8 py-4 rounded-full text-xs font-extrabold uppercase shadow-lg transition-all hover:scale-105"
                    >
                      <span>📞</span> {post.cta.button_text || "Call Kaye Kaye 24/7"}
                    </a>
                  </div>
                </div>
              )}

            </article>

            {/* Sidebar Right Column (4 cols) */}
            <div className="lg:col-span-4 sticky top-24 space-y-6 hidden lg:block">
              <aside className="space-y-8 select-none">
                
                {/* Author Bio Card */}
                <div className="flex gap-4 items-start pb-6 border-b border-zinc-100">
                  <div className="w-12 h-12 rounded-full bg-[#1e2a32] text-[#f5c80c] font-extrabold flex items-center justify-center text-base shadow-sm shrink-0 uppercase">
                    {post.author ? post.author.slice(0, 2) : "KK"}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-900 leading-none">{post.author || "KK Team"}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      {post.author_bio || "Safety specialist and technical writer at Kaye Kaye Safety Solutions."}
                    </p>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="space-y-3 pb-6 border-b border-zinc-100">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Share</div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-[#1877f2]/10 border border-zinc-200 text-zinc-500 hover:text-[#1877f2] rounded-lg transition-all"
                      title="Share on Facebook"
                    >
                      📘
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-green-50 border border-zinc-200 text-zinc-500 hover:text-green-600 rounded-lg transition-all"
                      title="Share on WhatsApp"
                    >
                      📱
                    </a>
                    <button
                      type="button"
                      onClick={copyPageUrl}
                      className="w-8 h-8 flex items-center justify-center border rounded-lg transition-all bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-[#f5c80c] hover:bg-yellow-50"
                      title="Copy Link"
                    >
                      {copied ? "✓" : "🔗"}
                    </button>
                  </div>
                </div>

                {/* Table of Contents */}
                {h2Blocks.length > 0 && (
                  <div className="space-y-4 pb-6 border-b border-zinc-100">
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Table of Contents
                    </div>
                    <nav>
                      <ul className="space-y-3">
                        {h2Blocks.map((block) => {
                          const headingId = block.value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                          return (
                            <li key={block.id} className="flex items-start gap-2 text-xs font-semibold">
                              <span className="text-[#f5c80c] shrink-0 font-bold">›</span>
                              <button
                                type="button"
                                onClick={() => scrollToHeading(headingId)}
                                className="text-zinc-600 hover:text-[#1e2a32] hover:underline transition-all text-left leading-normal"
                              >
                                {block.value}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                )}

                {/* Sticky Sidebar CTA Box */}
                <div className="bg-[#f5c80c]/10 border border-[#f5c80c]/30 p-6 rounded-2xl text-center space-y-4">
                  <h5 className="font-extrabold text-xs text-[#1e2a32] uppercase tracking-wider">
                    Need On-Site Safety Assistance?
                  </h5>
                  <p className="text-xs text-zinc-600 leading-relaxed font-semibold">
                    Don&apos;t stress. Kaye Kaye Safety Solutions provides quick dispatch and certified equipment.
                  </p>
                  <a
                    href="tel:+6581464525"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1e2a32] text-white py-3 px-5 rounded-full text-xs font-bold transition-all shadow-sm hover:bg-[#2d3f4a]"
                  >
                    <span>📞</span> Call Kaye Kaye 24/7
                  </a>
                </div>

              </aside>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#111827] text-white py-8 border-t border-zinc-800 text-center text-xs">
        <p className="text-gray-400">© {new Date().getFullYear()} Kaye Kaye Safety Solutions • <Link href="/" className="text-[#f5c80c] hover:underline">Home</Link> • <Link href="/blogs" className="text-[#f5c80c] hover:underline">Blog</Link></p>
      </footer>
    </div>
  );
}
