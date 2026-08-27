"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";
import SaveButton from "../components/SaveButton";
import toast from "react-hot-toast";
import type { HeritageContent, FallProtectionContent, EnjoySafetyContent, HeavyIndustryContent } from "@/lib/database.types";

const defaultHeritage: HeritageContent = {
  badge_text: "BRAND HERITAGE",
  title: "The Story of KK:\nCraftsmanship & Dedication",
  paragraphs: [
    "Forty-five years ago, in a modest workshop filled with the hum of sewing machines and the scent of freshly pressed fabric, a young Chinese national named Mr. Ng Chee Chow began to weave his dream into reality.",
    "With steady hands and an unwavering vision, Mr. Ng Chee Chow stitched the first uniforms himself, each seam carrying his dedication to quality and care.",
    "Through the decades, fashions changed, technologies evolved, and the city grew taller and faster. Yet, the heart of the company remained the same.",
    "Today, we carry forward Mr. Ng Chee Chow's legacy with the same passion that started it all.",
  ],
  image: "/images/heritage_workshop.avif",
  image_alt: "Vintage Tailor Workshop - Mr. Ng Chee Chow Heritage",
  founder_label: "In Memory & Honor",
  founder_name: "Mr. Ng Chee Chow",
  founder_title: "Founder & Original Craftsman (Circa 1981)",
  stats: [
    { value: "1981", label: "Established" },
    { value: "100%", label: "Dedicated" },
    { value: "45+ Yrs", label: "Of Trust" },
  ],
};

const defaultFallProtection: FallProtectionContent = {
  title: "Discover our fall protection system solutions for work at height",
  description: "We supply engineered fall protection safety harnesses and lanyards built to comply with high safety expectations of the maritime and civil construction sectors.",
  button_text: "Discover",
  button_link: "#catalog",
  image: "https://ext.same-assets.com/2399502935/3346132474.jpeg",
  overlay_text: "System solutions",
};

const defaultEnjoySafety: EnjoySafetyContent = {
  image: "https://ext.same-assets.com/2399502935/2080723909.png",
  title: "#Enjoy safety",
  description: "Because personal protective equipment is still too often perceived as a constraint, Kaye Kaye Safety Solution is committed to offering innovative, quality, easy-to-use, affordable, and durable safety gear.",
  button_text: "Find out more",
  button_link: "#catalog",
};

const defaultHeavy: HeavyIndustryContent = { title: "Heavy Industry & Welding" };

export default function HeritageEditorPage() {
  const [heritage, setHeritage] = useState<HeritageContent>(defaultHeritage);
  const [fallProtection, setFallProtection] = useState<FallProtectionContent>(defaultFallProtection);
  const [enjoySafety, setEnjoySafety] = useState<EnjoySafetyContent>(defaultEnjoySafety);
  const [heavy, setHeavy] = useState<HeavyIndustryContent>(defaultHeavy);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"heritage" | "fall" | "enjoy" | "heavy">("heritage");

  useEffect(() => {
    const fetchAll = async () => {
      const { data: rows } = await supabase.from("site_content").select("*").in("section_key", ["heritage", "fall_protection", "enjoy_safety", "heavy_industry"]);

      const keys = (rows || []).map((r) => r.section_key);
      const seedQueue: { section_key: string; content: unknown }[] = [];

      if (rows) {
        for (const row of rows) {
          if (row.section_key === "heritage" && row.content && Object.keys(row.content).length > 0) setHeritage(row.content as HeritageContent);
          if (row.section_key === "fall_protection" && row.content && Object.keys(row.content).length > 0) setFallProtection(row.content as FallProtectionContent);
          if (row.section_key === "enjoy_safety" && row.content && Object.keys(row.content).length > 0) setEnjoySafety(row.content as EnjoySafetyContent);
          if (row.section_key === "heavy_industry" && row.content && Object.keys(row.content).length > 0) setHeavy(row.content as HeavyIndustryContent);
        }
      }

      if (!keys.includes("heritage")) seedQueue.push({ section_key: "heritage", content: defaultHeritage });
      if (!keys.includes("fall_protection")) seedQueue.push({ section_key: "fall_protection", content: defaultFallProtection });
      if (!keys.includes("enjoy_safety")) seedQueue.push({ section_key: "enjoy_safety", content: defaultEnjoySafety });
      if (!keys.includes("heavy_industry")) seedQueue.push({ section_key: "heavy_industry", content: defaultHeavy });

      if (seedQueue.length > 0) {
        for (const seed of seedQueue) {
          await supabase.from("site_content").upsert({ ...seed, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
        }
      }

      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleSave = async () => {
    const updates = [
      { section_key: "heritage", content: heritage },
      { section_key: "fall_protection", content: fallProtection },
      { section_key: "enjoy_safety", content: enjoySafety },
      { section_key: "heavy_industry", content: heavy },
    ].map((u) => ({ ...u, updated_at: new Date().toISOString() }));

    for (const update of updates) {
      const { error } = await supabase.from("site_content").upsert(update, { onConflict: "section_key" });
      if (error) throw error;
    }
    toast.success("Heritage settings saved successfully!");
  };

  const tabs = [
    { key: "heritage" as const, label: "📜 Heritage", },
    { key: "fall" as const, label: "🪂 Fall Protection" },
    { key: "enjoy" as const, label: "😊 Enjoy Safety" },
    { key: "heavy" as const, label: "🏭 Heavy Industry" },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-[#1e2a32]">📜 Heritage & About</h1>
        <p className="text-sm text-gray-500 mt-1">Edit brand heritage story and commitment sections</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
              activeTab === tab.key ? "bg-[#f5c80c] text-[#1e2a32]" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {activeTab === "heritage" && (
          <>
            <div>
              <label className="block text-sm font-bold text-[#1e2a32] mb-2">Headline Title</label>
              <textarea value={heritage.title} onChange={(e) => setHeritage({ ...heritage, title: e.target.value })} rows={2} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] resize-none" />
            </div>
            <ImageUploader currentImage={heritage.image} onImageChange={(url) => setHeritage({ ...heritage, image: url })} label="Heritage Featured Image" folder="heritage" />
            <div>
              <label className="block text-sm font-bold text-[#1e2a32] mb-2">Story Paragraphs</label>
              {heritage.paragraphs.map((p, idx) => (
                <div key={idx} className="mb-3">
                  <label className="text-[10px] text-gray-400 font-bold">Paragraph {idx + 1}</label>
                  <textarea value={p} onChange={(e) => { const ps = [...heritage.paragraphs]; ps[idx] = e.target.value; setHeritage({ ...heritage, paragraphs: ps }); }} rows={3} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] resize-none" />
                </div>
              ))}
              <button onClick={() => setHeritage({ ...heritage, paragraphs: [...heritage.paragraphs, ""] })} className="text-xs text-[#f5c80c] font-bold hover:underline">+ Add Paragraph</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Founder Name</label><input type="text" value={heritage.founder_name} onChange={(e) => setHeritage({ ...heritage, founder_name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
              <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Founder Title</label><input type="text" value={heritage.founder_title} onChange={(e) => setHeritage({ ...heritage, founder_title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
              <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Badge Label</label><input type="text" value={heritage.founder_label} onChange={(e) => setHeritage({ ...heritage, founder_label: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1e2a32] mb-2">Key Statistics</label>
              {heritage.stats.map((stat, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={stat.value} onChange={(e) => { const s = [...heritage.stats]; s[idx] = { ...s[idx], value: e.target.value }; setHeritage({ ...heritage, stats: s }); }} placeholder="Value" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f5c80c]" />
                  <input type="text" value={stat.label} onChange={(e) => { const s = [...heritage.stats]; s[idx] = { ...s[idx], label: e.target.value }; setHeritage({ ...heritage, stats: s }); }} placeholder="Label" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f5c80c]" />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "fall" && (
          <>
            <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Title</label><textarea value={fallProtection.title} onChange={(e) => setFallProtection({ ...fallProtection, title: e.target.value })} rows={2} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] resize-none" /></div>
            <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Description</label><textarea value={fallProtection.description} onChange={(e) => setFallProtection({ ...fallProtection, description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] resize-none" /></div>
            <ImageUploader currentImage={fallProtection.image} onImageChange={(url) => setFallProtection({ ...fallProtection, image: url })} label="Fall Protection Image" folder="sections" />
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Overlay Text</label><input type="text" value={fallProtection.overlay_text} onChange={(e) => setFallProtection({ ...fallProtection, overlay_text: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
              <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Button Text</label><input type="text" value={fallProtection.button_text} onChange={(e) => setFallProtection({ ...fallProtection, button_text: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
            </div>
          </>
        )}

        {activeTab === "enjoy" && (
          <>
            <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Title</label><input type="text" value={enjoySafety.title} onChange={(e) => setEnjoySafety({ ...enjoySafety, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
            <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Description</label><textarea value={enjoySafety.description} onChange={(e) => setEnjoySafety({ ...enjoySafety, description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] resize-none" /></div>
            <ImageUploader currentImage={enjoySafety.image} onImageChange={(url) => setEnjoySafety({ ...enjoySafety, image: url })} label="Enjoy Safety Image" folder="sections" />
            <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Button Text</label><input type="text" value={enjoySafety.button_text} onChange={(e) => setEnjoySafety({ ...enjoySafety, button_text: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
          </>
        )}

        {activeTab === "heavy" && (
          <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Section Title</label><input type="text" value={heavy.title} onChange={(e) => setHeavy({ ...heavy, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
        )}
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
