"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";
import SaveButton from "../components/SaveButton";
import toast from "react-hot-toast";
import type { SettingsContent } from "@/lib/database.types";

const defaultSettings: SettingsContent = {
  uen: "202625392H",
  location_text: "Singapore & Southeast Asia Operations",
  brand_name: "Kaye Kaye",
  brand_subtitle: "Safety Solutions",
  logo_image: "/images/logo.png",
  whatsapp_number: "6581464525",
  facebook_url: "https://www.facebook.com/kaykaysafety",
  email: "ops.kayekaye_safety_solution@outlook.sg",
  footer_description: "Kaye Kaye Safety Solution Pte. Ltd. (UEN: 202625392H) is Southeast Asia's premier registered provider of high-grade specialized personal protective equipment (PPE) and industrial safety apparel.",
  chatbot_script: "https://chatbot.aiconvo.sg/chat/widget.js?work-space-Id=213",
};

export default function SettingsEditorPage() {
  const [data, setData] = useState<SettingsContent>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: row } = await supabase.from("site_content").select("content").eq("section_key", "settings").single();
      if (row?.content && Object.keys(row.content).length > 0) {
        setData(row.content as SettingsContent);
      } else {
        await supabase.from("site_content").upsert({ section_key: "settings", content: defaultSettings, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.from("site_content").upsert({ section_key: "settings", content: data, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
    if (error) throw error;
    toast.success("Settings saved successfully!");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-[#1e2a32]">⚙️ Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">General website branding and configuration (logo, UEN, contact info)</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <ImageUploader currentImage={data.logo_image} onImageChange={(url) => setData({ ...data, logo_image: url })} label="Brand Logo" folder="brand" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">Brand Name</label>
            <input type="text" value={data.brand_name} onChange={(e) => setData({ ...data, brand_name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">Brand Subtitle</label>
            <input type="text" value={data.brand_subtitle} onChange={(e) => setData({ ...data, brand_subtitle: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">🏢 Registered UEN Number</label>
            <input type="text" value={data.uen} onChange={(e) => setData({ ...data, uen: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">🌏 Location Text</label>
            <input type="text" value={data.location_text} onChange={(e) => setData({ ...data, location_text: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">📱 WhatsApp Hotline</label>
            <input type="text" value={data.whatsapp_number} onChange={(e) => setData({ ...data, whatsapp_number: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" placeholder="6581464525" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">📧 Email Address</label>
            <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-2">📘 Facebook URL</label>
          <input type="url" value={data.facebook_url} onChange={(e) => setData({ ...data, facebook_url: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-2">Footer Description</label>
          <textarea value={data.footer_description} onChange={(e) => setData({ ...data, footer_description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] resize-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e2a32] mb-2">🤖 Chatbot Script URL (Active on Public Site)</label>
          <input type="url" value={data.chatbot_script} onChange={(e) => setData({ ...data, chatbot_script: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
        </div>
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
