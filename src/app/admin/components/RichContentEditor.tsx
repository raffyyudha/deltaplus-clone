"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { InternalLink } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";
import ImageUploader from "./ImageUploader";

interface BlogSuggestion {
  id: string;
  title: string;
  slug: string;
}

interface RichContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  internalLinks: InternalLink[];
  onInternalLinksChange: (links: InternalLink[]) => void;
}

export default function RichContentEditor({
  content,
  onChange,
  internalLinks,
  onInternalLinksChange,
}: RichContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const [blogSuggestions, setBlogSuggestions] = useState<BlogSuggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // Calculate word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  // Fetch existing blog posts for internal link suggestions
  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setBlogSuggestions(data);
    };
    fetchBlogs();
  }, []);

  const filteredSuggestions = blogSuggestions.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Insert text at cursor position
  const insertAtCursor = useCallback(
    (before: string, after = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newText =
        content.substring(0, start) +
        before +
        selectedText +
        after +
        content.substring(end);
      onChange(newText);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        const cursorPos = start + before.length + selectedText.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    },
    [content, onChange]
  );

  // Wrap selected text
  const wrapSelection = useCallback(
    (before: string, after: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);

      if (selectedText) {
        const newText =
          content.substring(0, start) +
          before +
          selectedText +
          after +
          content.substring(end);
        onChange(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + before.length,
            end + before.length
          );
        }, 0);
      } else {
        const placeholder = "text";
        const newText =
          content.substring(0, start) +
          before +
          placeholder +
          after +
          content.substring(end);
        onChange(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + before.length,
            start + before.length + placeholder.length
          );
        }, 0);
      }
    },
    [content, onChange]
  );

  const toolbarActions = [
    {
      label: "H2",
      title: "Heading 2",
      action: () => insertAtCursor("\n## "),
      icon: "H2",
    },
    {
      label: "H3",
      title: "Heading 3",
      action: () => insertAtCursor("\n### "),
      icon: "H3",
    },
    {
      label: "B",
      title: "Bold",
      action: () => wrapSelection("**", "**"),
      icon: "B",
      bold: true,
    },
    {
      label: "I",
      title: "Italic",
      action: () => wrapSelection("*", "*"),
      icon: "I",
      italic: true,
    },
    {
      label: "UL",
      title: "Bullet List",
      action: () => insertAtCursor("\n- "),
      icon: "• List",
    },
    {
      label: "OL",
      title: "Numbered List",
      action: () => insertAtCursor("\n1. "),
      icon: "1. List",
    },
    {
      label: "Quote",
      title: "Blockquote / Callout",
      action: () => insertAtCursor("\n> "),
      icon: "❝ Quote",
    },
    {
      label: "Link",
      title: "Insert Link",
      action: () => wrapSelection("[", "](url)"),
      icon: "🔗 Link",
    },
    {
      label: "Image",
      title: "Insert Image",
      action: () => setShowImageUploader(true),
      icon: "🖼 Image",
    },
    {
      label: "HR",
      title: "Horizontal Rule",
      action: () => insertAtCursor("\n\n---\n\n"),
      icon: "— HR",
    },
  ];

  // Add internal link to the list
  const addInternalLink = (anchorText: string, url: string) => {
    const newLink: InternalLink = {
      id: Date.now().toString(),
      anchor_text: anchorText,
      url,
    };
    onInternalLinksChange([...internalLinks, newLink]);
  };

  const removeInternalLink = (id: string) => {
    onInternalLinksChange(internalLinks.filter((l) => l.id !== id));
  };

  const updateInternalLink = (
    id: string,
    field: "anchor_text" | "url",
    val: string
  ) => {
    onInternalLinksChange(
      internalLinks.map((l) => (l.id === id ? { ...l, [field]: val } : l))
    );
  };

  // Insert blog link into content + add to internal links
  const insertBlogLink = (blog: BlogSuggestion) => {
    const url = `/blogs/${blog.slug}`;
    insertAtCursor(`[${blog.title}](${url})`);
    addInternalLink(blog.title, url);
  };

  // Handle image upload completion
  const handleImageInsert = (imageUrl: string) => {
    insertAtCursor(`\n![Image description](${imageUrl})\n`);
    setShowImageUploader(false);
  };

  // Simple markdown to HTML preview (basic)
  const renderPreview = (md: string) => {
    const html = md
      // Headings
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-black text-[#1e2a32] mt-6 mb-3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-black text-[#1e2a32] mt-8 mb-4">$1</h2>')
      // Bold & Italic
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Images
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<div class="my-4"><img src="$2" alt="$1" class="rounded-xl max-w-full" /><p class="text-xs text-gray-400 italic mt-1">$1</p></div>'
      )
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-[#e52e2e] font-bold underline hover:text-red-700">$1</a>'
      )
      // Blockquotes
      .replace(
        /^> (.+)$/gm,
        '<div class="border-l-4 border-[#f5c80c] bg-yellow-50/50 p-4 my-3 rounded-r-xl italic font-semibold text-gray-800">$1</div>'
      )
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="border-gray-300 my-6" />')
      // Unordered list items
      .replace(
        /^- (.+)$/gm,
        '<li class="ml-4 list-disc text-gray-800">$1</li>'
      )
      // Ordered list items
      .replace(
        /^\d+\. (.+)$/gm,
        '<li class="ml-4 list-decimal text-gray-800">$1</li>'
      )
      // Paragraphs (lines not already wrapped)
      .replace(/^(?!<[hld]|<a |<s|<div|<hr|<img|<ul|<ol|<li)(.+)$/gm, '<p class="text-gray-800 text-base leading-relaxed mb-4">$1</p>');

    return html;
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-[#e52e2e] uppercase tracking-wider">
          ARTICLE CONTENT
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-400">
            {wordCount} words • ~{Math.max(1, Math.ceil(wordCount / 200))} min
            read
          </span>
          <button
            type="button"
            onClick={() => setShowLinkPanel(!showLinkPanel)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition border ${
              showLinkPanel
                ? "bg-[#e52e2e] text-white border-[#e52e2e]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#e52e2e]"
            }`}
          >
            🔗 Internal Links ({internalLinks.length})
          </button>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 font-medium leading-relaxed -mt-2">
        Write your entire article in one place using Markdown formatting. Use the toolbar for headings, bold, images, links, and more. You can also paste content directly from Google Docs.
      </p>

      {/* Main Editor Area with Optional Sidebar */}
      <div className={`grid gap-4 ${showLinkPanel ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        {/* Editor Column */}
        <div className={showLinkPanel ? "lg:col-span-2" : ""}>
          {/* Tab Switcher */}
          <div className="flex items-center gap-0 border border-gray-300 rounded-t-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`flex-1 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                activeTab === "write"
                  ? "bg-white text-[#1e2a32] border-b-2 border-[#e52e2e]"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              ✏️ Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex-1 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                activeTab === "preview"
                  ? "bg-white text-[#1e2a32] border-b-2 border-[#e52e2e]"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              👁 Preview
            </button>
          </div>

          {activeTab === "write" && (
            <>
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-x border-gray-300">
                {toolbarActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.action}
                    title={action.title}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-white hover:text-[#e52e2e] hover:shadow-sm transition border border-transparent hover:border-gray-200 ${
                      action.bold ? "font-black" : ""
                    } ${action.italic ? "italic" : ""}`}
                  >
                    {action.icon}
                  </button>
                ))}
              </div>

              {/* Single Content Textarea */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onChange(e.target.value)}
                rows={24}
                placeholder={`Write your entire article here using Markdown...\n\n## Section Heading (H2)\n\nYour paragraph text goes here. You can write as much as you want in one place.\n\n### Sub-heading (H3)\n\nMore content here...\n\n> This is a callout / important note\n\n**Bold text** and *italic text* are supported.\n\n- Bullet point 1\n- Bullet point 2\n\n[Link text](https://example.com)\n\n![Image alt text](image-url)\n\n---\n\nUse --- for horizontal dividers between sections.`}
                className="w-full p-4 border border-gray-300 border-t-0 rounded-b-xl text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#e52e2e]/20 resize-y min-h-[400px] bg-white"
                style={{ tabSize: 2 }}
              />
            </>
          )}

          {activeTab === "preview" && (
            <div
              className="w-full p-6 border border-gray-300 border-t-0 rounded-b-xl bg-white min-h-[400px] prose prose-sm max-w-none"
              // biome-ignore lint: preview rendering
              dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
            />
          )}

          {/* Image Upload Modal */}
          {showImageUploader && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#1e2a32] uppercase">
                    Upload Image
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowImageUploader(false)}
                    className="text-gray-400 hover:text-gray-700 text-lg"
                  >
                    ✕
                  </button>
                </div>
                <ImageUploader
                  currentImage=""
                  onImageChange={handleImageInsert}
                  label="Select Image"
                  folder="blogs/body"
                />
                <p className="text-[10px] text-gray-400 font-medium">
                  After uploading, the image markdown will be inserted at your
                  cursor position.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Internal Links Sidebar Panel */}
        {showLinkPanel && (
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-4 sticky top-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-[#e52e2e] uppercase tracking-wider">
                  🔗 Internal Links
                </h3>
                <span className="text-[10px] font-bold text-gray-400">
                  SEO
                </span>
              </div>

              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                Click a blog post below to insert its link at your cursor position and add it as an internal link.
              </p>

              {/* Search Existing Blog Posts */}
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search published blogs..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#e52e2e]"
                />
              </div>

              {/* Blog Suggestions List */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 border border-gray-100 rounded-lg p-1.5">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((blog) => (
                    <button
                      key={blog.id}
                      type="button"
                      onClick={() => insertBlogLink(blog)}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] font-semibold text-gray-700 hover:bg-[#e52e2e]/5 hover:text-[#e52e2e] transition truncate block"
                      title={`Insert link to: ${blog.title}`}
                    >
                      📄 {blog.title}
                    </button>
                  ))
                ) : (
                  <p className="text-[10px] text-gray-400 text-center py-3 font-medium">
                    No matching blogs found
                  </p>
                )}
              </div>

              <hr className="border-gray-200" />

              {/* Manual Internal Link Add */}
              <button
                type="button"
                onClick={() => addInternalLink("", "")}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-100 hover:border-[#e52e2e] transition"
              >
                + Add Manual Link
              </button>

              {/* Configured Internal Links */}
              {internalLinks.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    Configured Links
                  </div>
                  {internalLinks.map((link, idx) => (
                    <div
                      key={link.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 space-y-1.5 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => removeInternalLink(link.id)}
                        className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                      <input
                        type="text"
                        value={link.anchor_text}
                        onChange={(e) =>
                          updateInternalLink(
                            link.id,
                            "anchor_text",
                            e.target.value
                          )
                        }
                        placeholder={`Anchor text #${idx + 1}`}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-[10px] font-bold focus:outline-none focus:border-[#e52e2e] bg-white"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          updateInternalLink(link.id, "url", e.target.value)
                        }
                        placeholder="URL"
                        className="w-full px-2 py-1 border border-gray-200 rounded text-[10px] font-mono focus:outline-none focus:border-[#e52e2e] bg-white"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
