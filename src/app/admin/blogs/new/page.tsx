"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../../components/ImageUploader";
import RichContentEditor from "../../components/RichContentEditor";
import SaveButton from "../../components/SaveButton";
import toast from "react-hot-toast";
import type { ContentBlock, FaqItem, CtaBlock, InternalLink } from "@/lib/database.types";
import Link from "next/link";

export default function NewBlogPostApexCMS() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [author, setAuthor] = useState("KK Team");
  const [authorBio, setAuthorBio] = useState("Safety specialist and technical writer at Kaye Kaye Safety Solutions.");
  const [readingTime, setReadingTime] = useState("5 min read");
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
  const [isPublished, setIsPublished] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState("Blog > Safety Guide");
  
  // Featured Image
  const [coverImage, setCoverImage] = useState("");
  const [coverImageCaption, setCoverImageCaption] = useState("");

  // Single Content Box (Markdown)
  const [articleContent, setArticleContent] = useState("");

  // FAQs
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Internal Links
  const [internalLinks, setInternalLinks] = useState<InternalLink[]>([]);

  // Call to Action (CTA)
  const [cta, setCta] = useState<CtaBlock>({
    heading: "Need On-Site Safety Assistance?",
    description: "Speak directly to our safety specialists for transparent quotes and fast dispatch across Singapore.",
    button_text: "Call Kaye Kaye 24/7",
    button_link: "tel:+6581464525",
  });

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(generateSlug(val));
    setSeoTitle(val);
  };

  // Convert markdown content to content_blocks for backward compatibility
  const markdownToContentBlocks = (md: string): ContentBlock[] => {
    const lines = md.split("\n");
    const blocks: ContentBlock[] = [];
    let currentParagraph = "";
    let blockId = 1;

    const flushParagraph = () => {
      if (currentParagraph.trim()) {
        blocks.push({
          id: (blockId++).toString(),
          type: "paragraph",
          value: currentParagraph.trim(),
        });
        currentParagraph = "";
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        flushParagraph();
        blocks.push({
          id: (blockId++).toString(),
          type: "h2",
          value: trimmed.replace(/^## /, ""),
        });
      } else if (trimmed.startsWith("### ")) {
        flushParagraph();
        blocks.push({
          id: (blockId++).toString(),
          type: "h3",
          value: trimmed.replace(/^### /, ""),
        });
      } else if (trimmed.startsWith("> ")) {
        flushParagraph();
        blocks.push({
          id: (blockId++).toString(),
          type: "callout",
          value: trimmed.replace(/^> /, ""),
        });
      } else if (trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) {
        flushParagraph();
        const match = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (match) {
          blocks.push({
            id: (blockId++).toString(),
            type: "image",
            value: match[2],
            alt: match[1],
            caption: match[1],
          });
        }
      } else if (trimmed === "" || trimmed === "---") {
        flushParagraph();
      } else {
        if (currentParagraph) currentParagraph += "\n";
        currentParagraph += trimmed;
      }
    }
    flushParagraph();
    return blocks;
  };

  // FAQ Methods
  const addFaq = () => {
    setFaqs((prev) => [...prev, { id: Date.now().toString(), question: "", answer: "" }]);
  };

  const updateFaq = (id: string, field: "question" | "answer", val: string) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: val } : f)));
  };

  const removeFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // Save Post
  const handleSave = async () => {
    if (!title) {
      toast.error("Judul (POST TITLE) wajib diisi!");
      return;
    }

    // Generate content_blocks from markdown for backward compatibility
    const contentBlocks = markdownToContentBlocks(articleContent);

    const excerpt = metaDescription || articleContent.split("\n").find((l) => l.trim() && !l.startsWith("#") && !l.startsWith(">"))?.slice(0, 160) || "";

    const { error } = await supabase.from("blog_posts").insert({
      title,
      seo_title: seoTitle || title,
      slug: slug || generateSlug(title),
      meta_description: metaDescription,
      excerpt,
      content: articleContent,
      cover_image: coverImage,
      cover_image_caption: coverImageCaption,
      author,
      author_bio: authorBio,
      reading_time: readingTime,
      reading_time_minutes: parseInt(readingTime) || 5,
      breadcrumbs,
      tags: [breadcrumbs.split(">")[1]?.trim() || "Safety Guide"],
      is_published: isPublished,
      published_at: isPublished ? new Date(publishDate).toISOString() : null,
      content_blocks: contentBlocks,
      faqs,
      cta,
      internal_links: internalLinks,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("Slug URL sudah digunakan! Silakan ubah slug.");
        return;
      }
      throw error;
    }

    toast.success("Blog post berhasil disimpan & dipublish!");
    router.push("/admin/blogs");
  };

  return (
    <div className="min-h-screen bg-gray-200/60 text-[#1e2a32] p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-[#1e2a32] text-white p-4 sm:p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e52e2e] rounded-xl flex items-center justify-center font-black text-lg">
              ✏️
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider">KK CMS</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CONTENT MANAGEMENT</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <Link href="/admin/blogs" className="text-gray-300 hover:text-white transition">
              ← Back to Site
            </Link>
            <button
              type="button"
              onClick={() => router.push("/admin/blogs")}
              className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-900 transition"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-300 space-y-8">
          
          {/* Top Form Grid: Left Column & Right Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  POST TITLE (H1)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. How to Replace a Car Battery Safely"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#e52e2e]/30 focus:border-[#e52e2e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  URL SLUG
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. how-to-replace-car-battery"
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#e52e2e]/30 focus:border-[#e52e2e]"
                  />
                  <button
                    type="button"
                    onClick={() => setSlug(generateSlug(title))}
                    className="bg-black text-white px-4 py-3 rounded-xl font-bold text-xs hover:bg-gray-800 transition"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      AUTHOR
                    </label>
                    <span className="text-[10px] text-[#e52e2e] font-bold cursor-pointer hover:underline">
                      Manage Profiles
                    </span>
                  </div>
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold focus:outline-none focus:border-[#e52e2e]"
                  >
                    <option value="KK Team">KK Team</option>
                    <option value="Safety Specialist">Safety Specialist</option>
                    <option value="Technical Lead">Technical Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    READING TIME
                  </label>
                  <input
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="5 min read"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold focus:outline-none focus:border-[#e52e2e]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    PUBLISH DATE
                  </label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-[#e52e2e]"
                  />
                </div>

                <div className="pt-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="publishedStatus"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-5 h-5 accent-[#e52e2e] cursor-pointer"
                  />
                  <label htmlFor="publishedStatus" className="text-xs font-black uppercase text-gray-700 cursor-pointer">
                    PUBLISHED STATUS
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  BREADCRUMBS NAVIGATION
                </label>
                <input
                  type="text"
                  value={breadcrumbs}
                  onChange={(e) => setBreadcrumbs(e.target.value)}
                  placeholder="Blog > Category"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#e52e2e]"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  SEO TITLE (TITLE TAG)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO Optimized Page Title"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#e52e2e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  META DESCRIPTION
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  maxLength={160}
                  placeholder="Sleek, keyword-rich article summary (max 160 chars)"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#e52e2e] resize-none"
                />
                <p className="text-[10px] text-gray-400 text-right mt-1 font-mono">
                  {metaDescription.length}/160 chars
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  FEATURED IMAGE & CAPTION
                </label>
                <ImageUploader
                  currentImage={coverImage}
                  onImageChange={setCoverImage}
                  label=""
                  folder="blogs/featured"
                />
                <input
                  type="text"
                  value={coverImageCaption}
                  onChange={(e) => setCoverImageCaption(e.target.value)}
                  placeholder="Caption (optional) e.g. Checking the equipment before work"
                  className="w-full mt-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#e52e2e]"
                />
              </div>
            </div>

          </div>

          <hr className="border-gray-300 my-6" />

          {/* SINGLE CONTENT BOX WITH INTEGRATED INTERNAL LINKS */}
          <RichContentEditor
            content={articleContent}
            onChange={setArticleContent}
            internalLinks={internalLinks}
            onInternalLinksChange={setInternalLinks}
          />

          <hr className="border-gray-300 my-6" />

          {/* FAQ ACCORDIONS (OPTIONAL) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#e52e2e] uppercase tracking-wider">
                FAQ ACCORDIONS (OPTIONAL)
              </h2>
              <span className="text-xs font-bold text-gray-400">
                {faqs.length} FAQs configured
              </span>
            </div>

            {faqs.map((faq, idx) => (
              <div key={faq.id} className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeFaq(faq.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                >
                  ✕ Remove FAQ
                </button>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                  placeholder={`Question #${idx + 1} e.g. How long does a safety audit take?`}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-[#e52e2e]"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                  rows={3}
                  placeholder="Answer text..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#e52e2e] resize-none"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addFaq}
              className="bg-white border border-gray-300 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#e52e2e] transition"
            >
              + Add FAQ Item
            </button>
          </div>

          <hr className="border-gray-300 my-6" />

          {/* CALL TO ACTION (OPTIONAL) */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-[#e52e2e] uppercase tracking-wider">
              CALL TO ACTION (OPTIONAL)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  CTA HEADING TITLE
                </label>
                <input
                  type="text"
                  value={cta.heading}
                  onChange={(e) => setCta({ ...cta, heading: e.target.value })}
                  placeholder="Need On-Site Safety Assistance?"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-[#e52e2e]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  CTA BUTTON TEXT
                </label>
                <input
                  type="text"
                  value={cta.button_text}
                  onChange={(e) => setCta({ ...cta, button_text: e.target.value })}
                  placeholder="Call Kaye Kaye 24/7"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-[#e52e2e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  CTA DESCRIPTION
                </label>
                <textarea
                  value={cta.description}
                  onChange={(e) => setCta({ ...cta, description: e.target.value })}
                  rows={2}
                  placeholder="Speak directly to our safety specialists for transparent quotes..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#e52e2e] resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  CTA BUTTON LINK
                </label>
                <input
                  type="text"
                  value={cta.button_link}
                  onChange={(e) => setCta({ ...cta, button_link: e.target.value })}
                  placeholder="tel:+6581464525"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-[#e52e2e]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="px-6 py-3 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#22c55e] text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-[#16a34a] shadow-lg shadow-green-600/20 transition hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <span>💾</span> Save Blog Post
          </button>
        </div>

      </div>
    </div>
  );
}
