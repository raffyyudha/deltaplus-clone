"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";
import SaveButton from "../components/SaveButton";
import toast from "react-hot-toast";
import type { HeroContent } from "@/lib/database.types";

const defaultHero: HeroContent = {
  background_image: "/images/hero_background.avif",
  badge_text: "Singapore Registered UEN: 202625392H",
  title: "Specialized Personal\nProtective Equipment",
  description: "Kaye Kaye Safety Solution supplies high-end, compliant PPE engineered specifically for the scaffolding, construction, welding, and marine oil & gas environments of Southeast Asia.",
  cta_text: "Discover Catalog",
  cta_link: "#catalog",
};

export default function HeroEditorPage() {
  const [data, setData] = useState<HeroContent>(defaultHero);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: row } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "hero")
        .single();
      if (row?.content && Object.keys(row.content).length > 0) {
        setData(row.content as HeroContent);
      } else {
        // Auto-seed default to Supabase
        await supabase.from("site_content").upsert({ section_key: "hero", content: defaultHero, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ section_key: "hero", content: data, updated_at: new Date().toISOString() }, { onConflict: "section_key" });

    if (error) throw error;
    toast.success("Hero section saved successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 bg-[#f5c80c]/20 rounded-full flex items-center justify-center mx-auto animate-spin mb-3">
            <svg className="w-5 h-5 text-[#f5c80c]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          </div>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-[#1e2a32]">🖼️ Hero Section</h1>
        <p className="text-sm text-gray-500 mt-1">Edit main hero banner content at the top of homepage</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <ImageUploader
          currentImage={data.background_image}
          onImageChange={(url) => setData({ ...data, background_image: url })}
          label="Background Hero Image"
          folder="hero"
        />

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-2">Badge Label Text</label>
          <input
            type="text"
            value={data.badge_text}
            onChange={(e) => setData({ ...data, badge_text: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] focus:ring-2 focus:ring-[#f5c80c]/20"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-2">Main Headline Title</label>
          <textarea
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] focus:ring-2 focus:ring-[#f5c80c]/20 resize-none"
          />
          <p className="text-[10px] text-gray-400 mt-1">Press Enter for new lines</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-2">Subtitle / Description</label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] focus:ring-2 focus:ring-[#f5c80c]/20 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">CTA Button Text</label>
            <input
              type="text"
              value={data.cta_text}
              onChange={(e) => setData({ ...data, cta_text: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] focus:ring-2 focus:ring-[#f5c80c]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">CTA Button Link</label>
            <input
              type="text"
              value={data.cta_link}
              onChange={(e) => setData({ ...data, cta_link: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] focus:ring-2 focus:ring-[#f5c80c]/20"
            />
          </div>
        </div>
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
