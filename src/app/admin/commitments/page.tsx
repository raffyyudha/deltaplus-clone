"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";
import SaveButton from "../components/SaveButton";
import toast from "react-hot-toast";
import type { CommitmentsContent } from "@/lib/database.types";

const defaultCommitments: CommitmentsContent = {
  title: "Kaye Kaye is committed to...",
  items: [
    { title: "Innovation", description: "Our products are designed around safety, comfort, and durability." },
    { title: "Quality & Heritage", description: "Integrating the respected KK brand heritage into our safety garments." },
    { title: "Singapore Standards", description: "Fully compliant products engineered to align with Singapore Standard (SS)." },
    { title: "Certification", description: "Sourcing entire workforce protective deployment kits from a single reliable entity." },
  ],
  button_text: "Learn more about our commitments",
  button_link: "#catalog",
  images: [
    "https://ext.same-assets.com/2399502935/462252100.jpeg",
    "https://ext.same-assets.com/2399502935/3224722739.jpeg",
    "https://ext.same-assets.com/2399502935/1367672685.jpeg",
    "https://ext.same-assets.com/2399502935/1676270357.jpeg",
  ],
};

export default function CommitmentsEditorPage() {
  const [data, setData] = useState<CommitmentsContent>(defaultCommitments);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: row } = await supabase.from("site_content").select("content").eq("section_key", "commitments").single();
      if (row?.content && Object.keys(row.content).length > 0) {
        setData(row.content as CommitmentsContent);
      } else {
        await supabase.from("site_content").upsert({ section_key: "commitments", content: defaultCommitments, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.from("site_content").upsert({ section_key: "commitments", content: data, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
    if (error) throw error;
    toast.success("Commitments saved successfully!");
  };

  const updateItem = (idx: number, field: "title" | "description", value: string) => {
    const items = [...data.items];
    items[idx] = { ...items[idx], [field]: value };
    setData({ ...data, items });
  };

  const addItem = () => setData({ ...data, items: [...data.items, { title: "", description: "" }] });
  const removeItem = (idx: number) => { const items = [...data.items]; items.splice(idx, 1); setData({ ...data, items }); };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-[#1e2a32]">🤝 Commitments</h1>
        <p className="text-sm text-gray-500 mt-1">Edit company commitment pillars</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-2">Section Title</label>
          <input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-3">Commitment Items</label>
          {data.items.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-4 mb-3 relative">
              <button onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm">✕</button>
              <input type="text" value={item.title} onChange={(e) => updateItem(idx, "title", e.target.value)} placeholder="Pillar Title" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold mb-2 focus:outline-none focus:border-[#f5c80c]" />
              <textarea value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f5c80c] resize-none" />
            </div>
          ))}
          <button onClick={addItem} className="text-xs text-[#f5c80c] font-bold hover:underline">+ Add Commitment Item</button>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-3">Section Images (4 images)</label>
          <div className="grid grid-cols-2 gap-4">
            {data.images.map((img, idx) => (
              <ImageUploader
                key={idx}
                currentImage={img}
                onImageChange={(url) => { const imgs = [...data.images]; imgs[idx] = url; setData({ ...data, images: imgs }); }}
                label={`Image ${idx + 1}`}
                folder="commitments"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Button Text</label><input type="text" value={data.button_text} onChange={(e) => setData({ ...data, button_text: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
          <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Button Link</label><input type="text" value={data.button_link} onChange={(e) => setData({ ...data, button_link: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
        </div>
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
