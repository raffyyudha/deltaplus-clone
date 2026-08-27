"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";
import SaveButton from "../components/SaveButton";
import toast from "react-hot-toast";
import type { FeaturesContent } from "@/lib/database.types";

const defaultFeatures: FeaturesContent = {
  items: [
    { image: "https://ext.same-assets.com/2399502935/1235351112.png", description: "Re-engineered classic KK heritage lines for construction & marine sectors" },
    { image: "https://ext.same-assets.com/2399502935/3438570413.png", description: "Eco-design and compliant textile technology" },
    { image: "https://ext.same-assets.com/2399502935/1028679899.png", description: "Job audit and specific safety recommendations" },
    { image: "https://ext.same-assets.com/2399502935/2186627193.png", description: "Strict compliance with safety standards and workplace regulations" },
  ],
};

export default function FeaturesEditorPage() {
  const [data, setData] = useState<FeaturesContent>(defaultFeatures);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: row } = await supabase.from("site_content").select("content").eq("section_key", "features").single();
      if (row?.content && Object.keys(row.content).length > 0) {
        setData(row.content as FeaturesContent);
      } else {
        await supabase.from("site_content").upsert({ section_key: "features", content: defaultFeatures, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.from("site_content").upsert({ section_key: "features", content: data, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
    if (error) throw error;
    toast.success("Features saved successfully!");
  };

  const updateItem = (idx: number, field: "image" | "description", value: string) => {
    const items = [...data.items];
    items[idx] = { ...items[idx], [field]: value };
    setData({ ...data, items });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-black text-[#1e2a32]">✨ Features</h1><p className="text-sm text-gray-500 mt-1">Edit feature icons and descriptions at footer of page</p></div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {data.items.map((item, idx) => (
          <div key={idx} className="bg-gray-50 rounded-xl p-4">
            <label className="text-xs text-gray-400 font-bold mb-2 block">Feature {idx + 1}</label>
            <ImageUploader currentImage={item.image} onImageChange={(url) => updateItem(idx, "image", url)} label="Icon / Image" folder="features" />
            <div className="mt-3">
              <label className="block text-sm font-bold text-[#1e2a32] mb-2">Description</label>
              <textarea value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f5c80c] resize-none" />
            </div>
          </div>
        ))}
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
