"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";
import SaveButton from "../components/SaveButton";
import toast from "react-hot-toast";
import type { ContactContent } from "@/lib/database.types";

const defaultContact: ContactContent = {
  image: "https://ext.same-assets.com/2399502935/3564339651.png",
  title: "Contact us",
  description: "Our sales and support teams are available to assist you with your projects. UEN: 202625392H. Email: ops.kayekaye_safety_solution@outlook.sg. Hotline support is available Monday to Friday: 8:30am - 5:30pm.",
  whatsapp_number: "6581464525",
  email: "ops.kayekaye_safety_solution@outlook.sg",
  facebook_url: "https://www.facebook.com/kaykaysafety",
};

export default function ContactEditorPage() {
  const [data, setData] = useState<ContactContent>(defaultContact);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: row } = await supabase.from("site_content").select("content").eq("section_key", "contact").single();
      if (row?.content && Object.keys(row.content).length > 0) {
        setData(row.content as ContactContent);
      } else {
        await supabase.from("site_content").upsert({ section_key: "contact", content: defaultContact, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.from("site_content").upsert({ section_key: "contact", content: data, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
    if (error) throw error;
    toast.success("Contact info saved successfully!");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse">Loading...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-black text-[#1e2a32]">📞 Contact Info</h1><p className="text-sm text-gray-500 mt-1">Edit contact details and social links</p></div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <ImageUploader currentImage={data.image} onImageChange={(url) => setData({ ...data, image: url })} label="Contact Section Image" folder="contact" />
        <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Headline Title</label><input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
        <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">Description</label><textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows={4} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] resize-none" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">📱 WhatsApp Hotline</label><input type="text" value={data.whatsapp_number} onChange={(e) => setData({ ...data, whatsapp_number: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
          <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">📧 Support Email</label><input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
        </div>
        <div><label className="block text-sm font-bold text-[#1e2a32] mb-2">📘 Facebook URL</label><input type="url" value={data.facebook_url} onChange={(e) => setData({ ...data, facebook_url: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" /></div>
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
