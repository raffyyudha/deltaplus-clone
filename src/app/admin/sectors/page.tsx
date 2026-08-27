"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";
import SaveButton from "../components/SaveButton";
import toast from "react-hot-toast";
import type { SectorsContent } from "@/lib/database.types";

const defaultSectors: SectorsContent = {
  title: "The sectors",
  subtitle: "in which we operate",
  items: ["Construction & Civil Engineering", "Oil, Gas & Petrochemical Refineries", "Mining, Quarrying & Resource Extraction", "Manufacturing, Assembly & Heavy Industries"],
  button_text: "All sectors",
  button_link: "#catalog",
  sector_cards: [
    { number: "01", title: "Civil Engineering", image: "https://ext.same-assets.com/2399502935/3409306146.png" },
    { number: "02", title: "Offshore Rigs & Refineries", image: "https://ext.same-assets.com/2399502935/3113294757.png" },
  ],
};

export default function SectorsEditorPage() {
  const [data, setData] = useState<SectorsContent>(defaultSectors);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: row } = await supabase.from("site_content").select("content").eq("section_key", "sectors").single();
      if (row?.content && Object.keys(row.content).length > 0) {
        setData(row.content as SectorsContent);
      } else {
        await supabase.from("site_content").upsert({ section_key: "sectors", content: defaultSectors, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.from("site_content").upsert({ section_key: "sectors", content: data, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
    if (error) throw error;
    toast.success("Sectors saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {loading ? <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse">Loading...</p></div> : (
        <>
          <div>
            <h1 className="text-2xl font-black text-[#1e2a32]">🏗️ Sectors</h1>
            <p className="text-sm text-gray-500 mt-1">Edit industry sectors list and cards</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Main Title</label><input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
              <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Subtitle</label><input type="text" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1e2a32] mb-2">Sectors List</label>
              {data.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={item} onChange={(e) => { const items = [...data.items]; items[idx] = e.target.value; setData({ ...data, items }); }} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f5c80c]" />
                  <button onClick={() => { const items = [...data.items]; items.splice(idx, 1); setData({ ...data, items }); }} className="text-red-400 hover:text-red-600 px-2">✕</button>
                </div>
              ))}
              <button onClick={() => setData({ ...data, items: [...data.items, ""] })} className="text-xs text-[#f5c80c] font-bold hover:underline">+ Add Sector Item</button>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1e2a32] mb-3">Sector Cards</label>
              {data.sector_cards.map((card, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={card.number} onChange={(e) => { const cards = [...data.sector_cards]; cards[idx] = { ...cards[idx], number: e.target.value }; setData({ ...data, sector_cards: cards }); }} placeholder="Number (e.g. 01)" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f5c80c]" />
                    <input type="text" value={card.title} onChange={(e) => { const cards = [...data.sector_cards]; cards[idx] = { ...cards[idx], title: e.target.value }; setData({ ...data, sector_cards: cards }); }} placeholder="Sector Card Title" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f5c80c]" />
                  </div>
                  <ImageUploader currentImage={card.image} onImageChange={(url) => { const cards = [...data.sector_cards]; cards[idx] = { ...cards[idx], image: url }; setData({ ...data, sector_cards: cards }); }} label={`Sector Image ${idx + 1}`} folder="sectors" />
                </div>
              ))}
            </div>
          </div>

          <SaveButton onClick={handleSave} />
        </>
      )}
    </div>
  );
}
