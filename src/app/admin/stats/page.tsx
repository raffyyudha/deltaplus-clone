"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";
import SaveButton from "../components/SaveButton";
import toast from "react-hot-toast";
import type { PresenceContent } from "@/lib/database.types";

const defaultPresence: PresenceContent = {
  title: "Our presence",
  image: "https://ext.same-assets.com/2399502935/91794434.png",
  main_stats: [
    { value: "Singapore", label: "Headquarters & Supply" },
    { value: "UEN", label: "202625392H Registered" },
    { value: "6 Classes", label: "Garment Safety Products" },
  ],
  distribution_title: "Regional Distribution",
  distribution_stats: [
    { value: "SEA", label: "Southeast Asia Reach" },
    { value: "SS & EN", label: "Standard Compliance" },
    { value: "B2B Bulk", label: "Bulk Sourcing Entity" },
  ],
};

export default function StatsEditorPage() {
  const [data, setData] = useState<PresenceContent>(defaultPresence);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: row } = await supabase.from("site_content").select("content").eq("section_key", "presence").single();
      if (row?.content && Object.keys(row.content).length > 0) {
        setData(row.content as PresenceContent);
      } else {
        await supabase.from("site_content").upsert({ section_key: "presence", content: defaultPresence, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.from("site_content").upsert({ section_key: "presence", content: data, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
    if (error) throw error;
    toast.success("Statistics saved successfully!");
  };

  const updateStat = (group: "main_stats" | "distribution_stats", idx: number, field: "value" | "label", value: string) => {
    const stats = [...data[group]];
    stats[idx] = { ...stats[idx], [field]: value };
    setData({ ...data, [group]: stats });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-[#1e2a32]">📊 Statistics & Presence</h1>
        <p className="text-sm text-gray-500 mt-1">Edit statistics and regional distribution metrics</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Headline Title</label><input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>

        <ImageUploader currentImage={data.image} onImageChange={(url) => setData({ ...data, image: url })} label="Map Graphic Image" folder="stats" />

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-3">Main Stats (3 Cards)</label>
          {data.main_stats.map((stat, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input type="text" value={stat.value} onChange={(e) => updateStat("main_stats", idx, "value", e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#f5c80c]" />
              <input type="text" value={stat.label} onChange={(e) => updateStat("main_stats", idx, "label", e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f5c80c]" />
            </div>
          ))}
        </div>

        <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Distribution Title</label><input type="text" value={data.distribution_title} onChange={(e) => setData({ ...data, distribution_title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-3">Distribution Stats (3 Cards)</label>
          {data.distribution_stats.map((stat, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input type="text" value={stat.value} onChange={(e) => updateStat("distribution_stats", idx, "value", e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#f5c80c]" />
              <input type="text" value={stat.label} onChange={(e) => updateStat("distribution_stats", idx, "label", e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f5c80c]" />
            </div>
          ))}
        </div>
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
