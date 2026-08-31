"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../../components/ImageUploader";
import toast from "react-hot-toast";
import type { BlogPost, ContentBlock, FaqItem, CtaBlock, InternalLink } from "@/lib/database.types";
import Link from "next/link";

export default function EditBlogPostApexCMS() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);

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

  // Dynamic Content Blocks
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

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

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
      if (data) {
        const post = data as BlogPost;
        setTitle(post.title || "");
        setSlug(post.slug || "");
        setSeoTitle(post.seo_title || post.title || "");
        setMetaDescription(post.meta_description || post.excerpt || "");
        setAuthor(post.author || "KK Team");
        setAuthorBio(post.author_bio || "Safety specialist at Kaye Kaye Safety Solutions.");
        setReadingTime(post.reading_time || "5 min read");
        setPublishDate(post.published_at ? post.published_at.split("T")[0] : new Date().toISOString().split("T")[0]);
        setIsPublished(post.is_published ?? true);
        setBreadcrumbs(post.breadcrumbs || "Blog > Safety Guide");
        setCoverImage(post.cover_image || "");
        setCoverImageCaption(post.cover_image_caption || "");

        // Initialize content blocks
        if (post.content_blocks && Array.isArray(post.content_blocks) && post.content_blocks.length > 0) {
          setContentBlocks(post.content_blocks);
        } else if (post.content) {
          // Parse legacy markdown into blocks
          const paragraphs = post.content.split("\n\n").filter(Boolean);
          const legacyBlocks: ContentBlock[] = paragraphs.map((p, i) => {
            if (p.startsWith("## ")) return { id: i.toString(), type: "h2", value: p.replace("## ", "") };
            if (p.startsWith("### ")) return { id: i.toString(), type: "h3", value: p.replace("### ", "") };
            if (p.startsWith("> ")) return { id: i.toString(), type: "callout", value: p.replace("> ", "") };
            return { id: i.toString(), type: "paragraph", value: p };
          });
          setContentBlocks(legacyBlocks);
        }

        if (post.faqs && Array.isArray(post.faqs)) setFaqs(post.faqs);
        if (post.cta && post.cta.heading) setCta(post.cta);
        if (post.internal_links && Array.isArray(post.internal_links)) setInternalLinks(post.internal_links);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) setSlug(generateSlug(val));
    if (!seoTitle) setSeoTitle(val);
  };

  // Block Builder Methods
  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      value: "",
      caption: type === "image" ? "" : undefined,
      alt: type === "image" ? "" : undefined,
    };
    setContentBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (blockId: string, field: keyof ContentBlock, val: string) => {
    setContentBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, [field]: val } : b)));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === contentBlocks.length - 1)) return;
    const newBlocks = [...contentBlocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setContentBlocks(newBlocks);
  };

  const removeBlock = (blockId: string) => {
    setContentBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  // FAQ Methods
  const addFaq = () => {
    setFaqs((prev) => [...prev, { id: Date.now().toString(), question: "", answer: "" }]);
  };

  const updateFaq = (faqId: string, field: "question" | "answer", val: string) => {
    setFaqs((prev) => prev.map((f) => (f.id === faqId ? { ...f, [field]: val } : f)));
  };

  const removeFaq = (faqId: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== faqId));
  };

  // Internal Link Methods
  const addInternalLink = () => {
    setInternalLinks((prev) => [...prev, { id: Date.now().toString(), anchor_text: "", url: "" }]);
  };

  const updateInternalLink = (id: string, field: "anchor_text" | "url", val: string) => {
    setInternalLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  const removeInternalLink = (id: string) => {
    setInternalLinks((prev) => prev.filter((l) => l.id !== id));
  };

  // Save Post
  const handleSave = async () => {
    if (!title) {
      toast.error("Judul (POST TITLE) wajib diisi!");
      return;
    }

    const contentFallback = contentBlocks
      .map((b) => {
        if (b.type === "h2") return `\n## ${b.value}\n`;
        if (b.type === "h3") return `\n### ${b.value}\n`;
        if (b.type === "image") return `\n![${b.alt || "Image"}](${b.value})\n*${b.caption || ""}*\n`;
        if (b.type === "callout") return `\n> ${b.value}\n`;
        return b.value;
      })
      .join("\n\n");

    const excerpt = metaDescription || contentBlocks.find((b) => b.type === "paragraph")?.value.slice(0, 160) || "";

    const { error } = await supabase
      .from("blog_posts")
      .update({
        title,
        seo_title: seoTitle || title,
        slug: slug || generateSlug(title),
        meta_description: metaDescription,
        excerpt,
        content: contentFallback,
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
        updated_at: new Date().toISOString(),
        content_blocks: contentBlocks,
        faqs,
        cta,
        internal_links: internalLinks,
      })
      .eq("id", id);

    if (error) throw error;

    toast.success("Blog post berhasil diperbarui!");
    router.push("/admin/blogs");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse font-bold">Loading Editor...</p></div>;
  }

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
          
          {/* Top Form Grid */}
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#e52e2e]"
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
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:border-[#e52e2e]"
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
                    id="publishedStatusEdit"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-5 h-5 accent-[#e52e2e] cursor-pointer"
                  />
                  <label htmlFor="publishedStatusEdit" className="text-xs font-black uppercase text-gray-700 cursor-pointer">
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
                  placeholder="Caption (optional)"
                  className="w-full mt-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#e52e2e]"
                />
              </div>
            </div>

          </div>

          <hr className="border-gray-300 my-6" />

          {/* DYNAMIC CONTENT BLOCKS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#e52e2e] uppercase tracking-wider">
                DYNAMIC CONTENT BLOCKS
              </h2>
              <span className="text-xs font-bold text-gray-400">
                {contentBlocks.length} blocks configured
              </span>
            </div>

            {/* Block Controls */}
            <div className="flex flex-wrap gap-3 items-center justify-center p-4 bg-gray-100 rounded-xl border border-gray-300">
              <button type="button" onClick={() => addBlock("paragraph")} className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#e52e2e]">
                + Add Paragraph
              </button>
              <button type="button" onClick={() => addBlock("h2")} className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#e52e2e]">
                + Add H2 Heading
              </button>
              <button type="button" onClick={() => addBlock("h3")} className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#e52e2e]">
                + Add H3 Heading
              </button>
              <button type="button" onClick={() => addBlock("image")} className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#e52e2e]">
                + Add Image Block
              </button>
              <button type="button" onClick={() => addBlock("callout")} className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#e52e2e]">
                + Add Callout Box
              </button>
            </div>

            {/* Block List */}
            <div className="space-y-4">
              {contentBlocks.map((block, idx) => (
                <div key={block.id} className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm relative space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      Block #{idx + 1} — {block.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveBlock(idx, "up")} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded text-xs font-bold disabled:opacity-30">▲</button>
                      <button type="button" onClick={() => moveBlock(idx, "down")} disabled={idx === contentBlocks.length - 1} className="p-1 hover:bg-gray-100 rounded text-xs font-bold disabled:opacity-30">▼</button>
                      <button type="button" onClick={() => removeBlock(block.id)} className="p-1 text-red-500 hover:bg-red-50 rounded text-xs font-bold">✕</button>
                    </div>
                  </div>

                  {block.type === "paragraph" && (
                    <textarea value={block.value} onChange={(e) => updateBlock(block.id, "value", e.target.value)} rows={4} placeholder="Enter paragraph text..." className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#e52e2e]" />
                  )}
                  {block.type === "h2" && (
                    <input type="text" value={block.value} onChange={(e) => updateBlock(block.id, "value", e.target.value)} placeholder="Enter H2 Heading title..." className="w-full p-3 border border-gray-200 rounded-lg text-base font-extrabold focus:outline-none focus:border-[#e52e2e]" />
                  )}
                  {block.type === "h3" && (
                    <input type="text" value={block.value} onChange={(e) => updateBlock(block.id, "value", e.target.value)} placeholder="Enter H3 Subheading title..." className="w-full p-3 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#e52e2e]" />
                  )}
                  {block.type === "image" && (
                    <div className="space-y-3">
                      <ImageUploader currentImage={block.value} onImageChange={(url) => updateBlock(block.id, "value", url)} label="Inline Image" folder="blogs/body" />
                      <input type="text" value={block.caption || ""} onChange={(e) => updateBlock(block.id, "caption", e.target.value)} placeholder="Image Caption (italic text below image)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#e52e2e]" />
                      <input type="text" value={block.alt || ""} onChange={(e) => updateBlock(block.id, "alt", e.target.value)} placeholder="Image Alt text (SEO)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#e52e2e]" />
                    </div>
                  )}
                  {block.type === "callout" && (
                    <textarea value={block.value} onChange={(e) => updateBlock(block.id, "value", e.target.value)} rows={3} placeholder="Enter callout / quote text..." className="w-full p-3 border border-[#e52e2e]/30 bg-red-50/20 rounded-lg text-sm italic font-semibold focus:outline-none focus:border-[#e52e2e]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-300 my-6" />

          {/* INTERNAL LINKS (SEO) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#e52e2e] uppercase tracking-wider">
                INTERNAL LINKS (SEO)
              </h2>
              <span className="text-xs font-bold text-gray-400">
                {internalLinks.length} links configured
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
              Add internal links with targeted keywords as anchor text. These will be displayed as a "Related Articles" section within your blog post for better SEO internal linking.
            </p>

            {internalLinks.map((link, idx) => (
              <div key={link.id} className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm relative">
                <button
                  type="button"
                  onClick={() => removeInternalLink(link.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                >
                  ✕ Remove
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      ANCHOR TEXT (KEYWORD) #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={link.anchor_text}
                      onChange={(e) => updateInternalLink(link.id, "anchor_text", e.target.value)}
                      placeholder="e.g. safety shoes in Singapore"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-[#e52e2e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      TARGET URL
                    </label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateInternalLink(link.id, "url", e.target.value)}
                      placeholder="e.g. /blogs/safety-shoes-guide or https://kayesafety.com/..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#e52e2e]"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addInternalLink}
              className="bg-white border border-gray-300 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#e52e2e] transition"
            >
              + Add Internal Link
            </button>
          </div>

          <hr className="border-gray-300 my-6" />

          {/* FAQ ACCORDIONS (OPTIONAL) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#e52e2e] uppercase tracking-wider">
                FAQ ACCORDIONS (OPTIONAL)
              </h2>
              <span className="text-xs font-bold text-gray-400">{faqs.length} FAQs configured</span>
            </div>

            {faqs.map((faq, idx) => (
              <div key={faq.id} className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm space-y-3 relative">
                <button type="button" onClick={() => removeFaq(faq.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1">✕ Remove FAQ</button>
                <input type="text" value={faq.question} onChange={(e) => updateFaq(faq.id, "question", e.target.value)} placeholder={`Question #${idx + 1}`} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-[#e52e2e]" />
                <textarea value={faq.answer} onChange={(e) => updateFaq(faq.id, "answer", e.target.value)} rows={3} placeholder="Answer text..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#e52e2e] resize-none" />
              </div>
            ))}

            <button type="button" onClick={addFaq} className="bg-white border border-gray-300 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#e52e2e]">
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
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CTA HEADING TITLE</label>
                <input type="text" value={cta.heading} onChange={(e) => setCta({ ...cta, heading: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-[#e52e2e]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CTA BUTTON TEXT</label>
                <input type="text" value={cta.button_text} onChange={(e) => setCta({ ...cta, button_text: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-[#e52e2e]" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CTA DESCRIPTION</label>
                <textarea value={cta.description} onChange={(e) => setCta({ ...cta, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#e52e2e] resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CTA BUTTON LINK</label>
                <input type="text" value={cta.button_link} onChange={(e) => setCta({ ...cta, button_link: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-[#e52e2e]" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-4">
          <button type="button" onClick={() => router.push("/admin/blogs")} className="px-6 py-3 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-300 transition">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="bg-[#22c55e] text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-[#16a34a] shadow-lg shadow-green-600/20 transition hover:scale-[1.02] flex items-center gap-2">
            <span>💾</span> Save Blog Post
          </button>
        </div>

      </div>
    </div>
  );
}
