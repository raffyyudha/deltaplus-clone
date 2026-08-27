"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "../components/ImageUploader";
import SaveButton from "../components/SaveButton";
import toast from "react-hot-toast";
import type { Product } from "@/lib/database.types";
import Image from "next/image";

const defaultInitialProducts = [
  {
    name: "Safety Footwear (Shoe)",
    category_label: "Footwear",
    description: "Heavy-duty steel-toe and anti-slip footwear providing essential protection in high-risk fabrication yards.",
    certification: "EN ISO 20345 S3",
    whatsapp_link: "https://wa.me/6581464525?text=Hi%20Kaye%20Kaye,%20I%20would%20like%20to%20inquire%20about%20Safety%20Footwear%20(Shoe)",
    brands: ["KPR", "NITTI", "D&D", "ACE SAFETY", "STAR SAFETY", "SAFETY JOGGER"],
    sort_order: 0,
    image_url: "/images/shoe.avif",
    carousel_images: [],
    is_active: true,
  },
  {
    name: "Safety Helmets & Hard Hats",
    category_label: "Head Protection",
    description: "High-impact ABS construction helmets, ventilated safety hard hats, and climbing-style helmets with 4-point adjustable chin straps and suspension.",
    certification: "SS 98 / ANSI Z89.1",
    whatsapp_link: "https://wa.me/6581464525?text=Hi%20Kaye%20Kaye,%20I%20would%20like%20to%20inquire%20about%20Safety%20Helmets",
    brands: ["ABS Hard Hats", "Ventilated Helmets", "Climbing-Style", "4-Point Chin Strap", "Full Brim Option"],
    sort_order: 1,
    image_url: "/images/helmet.avif",
    carousel_images: [
      { src: "/images/helmet1.avif", alt: "Yellow ABS Hard Hat" },
      { src: "/images/helmet2.avif", alt: "Blue Ventilated Safety Helmet" },
      { src: "/images/helmet3.avif", alt: "White Climbing Safety Helmet" },
    ],
    is_active: true,
  },
  {
    name: "Protective Gloves",
    category_label: "Hand Protection",
    description: "Cut, chemical, and thermal-resistant safety gloves with rubberized palm grip for optimal heavy industrial handling.",
    certification: "EN 388 / EN 374",
    whatsapp_link: "https://wa.me/6581464525?text=Hi%20Kaye%20Kaye,%20I%20would%20like%20to%20inquire%20about%20Protective%20Gloves",
    brands: [],
    sort_order: 2,
    image_url: "/images/gloves.avif",
    carousel_images: [
      { src: "/images/gloves1.avif", alt: "Heavy-Duty Leather Gloves" },
      { src: "/images/gloves2.avif", alt: "Chemical & Cut Resistant Gloves" },
      { src: "/images/gloves3.avif", alt: "High-Dexterity Grip Gloves" },
    ],
    is_active: true,
  },
  {
    name: "Industrial Overalls & Coveralls",
    category_label: "Workwear",
    description: "Heavy-duty jumpsuits and overalls featuring high-visibility retro-reflective accents, flame retardancy, and chemical protection.",
    certification: "SS 473 / ISO 11612",
    whatsapp_link: "https://wa.me/6581464525?text=Hi%20Kaye%20Kaye,%20I%20would%20like%20to%20inquire%20about%20Industrial%20Overalls",
    brands: [],
    sort_order: 3,
    image_url: "/images/overall.avif",
    carousel_images: [],
    is_active: true,
  },
  {
    name: "Fall Protection Harnesses",
    category_label: "Height Safety",
    description: "Full-body fall protection safety harnesses with integrated work positioning belts, standalone safety belts, and shock-absorbing lanyards. Certified for offshore and scaffolding operations.",
    certification: "SS 528 / EN 361",
    whatsapp_link: "https://wa.me/6581464525?text=Hi%20Kaye%20Kaye,%20I%20would%20like%20to%20inquire%20about%20Fall%20Protection%20Harnesses",
    brands: [],
    sort_order: 4,
    image_url: "/images/harness.avif",
    carousel_images: [],
    is_active: true,
  },
];

export default function ProductsManagerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [isNew, setIsNew] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("sort_order");

    if (!data || data.length === 0) {
      // Auto seed initial products into Supabase if empty!
      const { data: insertedData } = await supabase.from("products").insert(defaultInitialProducts).select();
      if (insertedData) {
        setProducts(insertedData as Product[]);
      }
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const startNew = () => {
    setIsNew(true);
    setEditingId("new");
    setForm({
      name: "",
      category_label: "",
      description: "",
      certification: "",
      whatsapp_link: "",
      brands: [],
      sort_order: products.length,
      image_url: "",
      carousel_images: [],
      is_active: true,
    });
  };

  const startEdit = (product: Product) => {
    setIsNew(false);
    setEditingId(product.id);
    setForm({ ...product });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
    setIsNew(false);
  };

  const handleSave = async () => {
    if (isNew) {
      const { error } = await supabase.from("products").insert({
        name: form.name,
        category_label: form.category_label,
        description: form.description,
        certification: form.certification,
        whatsapp_link: form.whatsapp_link || `https://wa.me/6581464525?text=Hi%20Kaye%20Kaye,%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(form.name || '')}`,
        brands: form.brands || [],
        sort_order: form.sort_order || 0,
        image_url: form.image_url,
        carousel_images: form.carousel_images || [],
        is_active: form.is_active !== false,
      });
      if (error) throw error;
      toast.success("New product created successfully!");
    } else {
      const { error } = await supabase.from("products").update({
        name: form.name,
        category_label: form.category_label,
        description: form.description,
        certification: form.certification,
        whatsapp_link: form.whatsapp_link,
        brands: form.brands || [],
        sort_order: form.sort_order,
        image_url: form.image_url,
        carousel_images: form.carousel_images || [],
        is_active: form.is_active,
        updated_at: new Date().toISOString(),
      }).eq("id", editingId!);
      if (error) throw error;
      toast.success("Product updated successfully!");
    }
    cancelEdit();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast.success("Product deleted!");
    fetchProducts();
  };

  const addBrand = () => {
    const brand = prompt("Enter brand name:");
    if (brand) setForm({ ...form, brands: [...(form.brands || []), brand] });
  };

  const removeBrand = (idx: number) => {
    const newBrands = [...(form.brands || [])];
    newBrands.splice(idx, 1);
    setForm({ ...form, brands: newBrands });
  };

  const addCarouselImage = () => {
    setForm({
      ...form,
      carousel_images: [...(form.carousel_images || []), { src: "", alt: "" }],
    });
  };

  const updateCarouselImage = (idx: number, field: "src" | "alt", value: string) => {
    const images = [...(form.carousel_images || [])];
    images[idx] = { ...images[idx], [field]: value };
    setForm({ ...form, carousel_images: images });
  };

  const removeCarouselImage = (idx: number) => {
    const images = [...(form.carousel_images || [])];
    images.splice(idx, 1);
    setForm({ ...form, carousel_images: images });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-sm text-gray-400 animate-pulse font-bold">Loading products...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1e2a32]">📦 Products / Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">Manage catalog items ({products.length} Products)</p>
        </div>
        {!editingId && (
          <button onClick={startNew} className="bg-[#f5c80c] text-[#1e2a32] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-400 transition shadow-sm">
            + Add New Product
          </button>
        )}
      </div>

      {/* Editor */}
      {editingId && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-lg text-[#1e2a32]">{isNew ? "➕ New Product" : "✏️ Edit Product"}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1e2a32] mb-2">Product Name</label>
              <input type="text" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" placeholder="Safety Footwear (Shoe)" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1e2a32] mb-2">Category Label</label>
              <input type="text" value={form.category_label || ""} onChange={(e) => setForm({ ...form, category_label: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" placeholder="Footwear" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">Description</label>
            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c] resize-none" />
          </div>

          <ImageUploader currentImage={form.image_url || ""} onImageChange={(url) => setForm({ ...form, image_url: url })} label="Main Featured Image" folder="products" />

          {/* Carousel Images */}
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">Carousel Images (Optional)</label>
            {(form.carousel_images || []).map((img, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                {img.src && (
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden border flex-shrink-0">
                    <Image src={img.src} alt={img.alt} fill className="object-contain" unoptimized />
                  </div>
                )}
                <input type="text" value={img.src} onChange={(e) => updateCarouselImage(idx, "src", e.target.value)} placeholder="Image URL" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#f5c80c]" />
                <input type="text" value={img.alt} onChange={(e) => updateCarouselImage(idx, "alt", e.target.value)} placeholder="Alt text" className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#f5c80c]" />
                <button onClick={() => removeCarouselImage(idx)} className="text-red-400 hover:text-red-600 px-2 text-lg">✕</button>
              </div>
            ))}
            <button onClick={addCarouselImage} className="text-xs text-[#f5c80c] font-bold hover:underline">+ Add Carousel Image</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1e2a32] mb-2">Certification</label>
              <input type="text" value={form.certification || ""} onChange={(e) => setForm({ ...form, certification: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" placeholder="EN ISO 20345 S3" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1e2a32] mb-2">Sort Order</label>
              <input type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
            </div>
          </div>

          {/* Brands */}
          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">Brands / Tag Labels</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.brands || []).map((brand, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center gap-2">
                  {brand}
                  <button onClick={() => removeBrand(idx)} className="text-red-400 hover:text-red-600">✕</button>
                </span>
              ))}
            </div>
            <button onClick={addBrand} className="text-xs text-[#f5c80c] font-bold hover:underline">+ Add Brand Tag</button>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1e2a32] mb-2">WhatsApp Inquiry Link</label>
            <input type="text" value={form.whatsapp_link || ""} onChange={(e) => setForm({ ...form, whatsapp_link: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#f5c80c]" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={form.is_active !== false} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 accent-[#f5c80c]" />
            <label className="text-sm font-semibold text-[#1e2a32]">Active (Visible on public catalog)</label>
          </div>

          <div className="flex gap-3 pt-2">
            <SaveButton onClick={handleSave} />
            <button onClick={cancelEdit} className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition">Cancel</button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border flex-shrink-0 relative">
              {product.image_url ? (
                <Image src={product.image_url} alt={product.name} fill className="object-contain p-1" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">📦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-[#1e2a32] truncate">{product.name}</h3>
              <p className="text-xs text-gray-400">{product.category_label} • {product.certification}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {product.is_active ? "Active" : "Hidden"}
              </span>
              <button onClick={() => startEdit(product)} className="p-2 hover:bg-[#f5c80c]/10 rounded-lg transition" title="Edit">✏️</button>
              <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
