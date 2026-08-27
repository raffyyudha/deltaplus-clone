import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProductCarousel from "./components/ProductCarousel";
import type {
  HeroContent, FallProtectionContent, EnjoySafetyContent, HeritageContent,
  CommitmentsContent, SectorsContent, PresenceContent, ContactContent,
  FeaturesContent, SettingsContent, HeavyIndustryContent, Product,
} from "@/lib/database.types";

export const revalidate = 60;

// Default initial fallbacks if database is not seeded yet
const defaultFallbackSections = {
  settings: {
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
  },
  hero: {
    background_image: "/images/hero_background.avif",
    badge_text: "Singapore Registered UEN: 202625392H",
    title: "Specialized Personal\nProtective Equipment",
    description: "Kaye Kaye Safety Solution supplies high-end, compliant PPE engineered specifically for the scaffolding, construction, welding, and marine oil & gas environments of Southeast Asia.",
    cta_text: "Discover Catalog",
    cta_link: "#catalog",
  },
  fall_protection: {
    title: "Discover our fall protection system solutions for work at height",
    description: "We supply engineered fall protection safety harnesses and lanyards built to comply with high safety expectations of the maritime and civil construction sectors.",
    button_text: "Discover",
    button_link: "#catalog",
    image: "https://ext.same-assets.com/2399502935/3346132474.jpeg",
    overlay_text: "System solutions",
  },
  enjoy_safety: {
    image: "https://ext.same-assets.com/2399502935/2080723909.png",
    title: "#Enjoy safety",
    description: "Because personal protective equipment is still too often perceived as a constraint, Kaye Kaye Safety Solution is committed to offering innovative, quality, easy-to-use, affordable, and durable safety gear.",
    button_text: "Find out more",
    button_link: "#catalog",
  },
  heritage: {
    badge_text: "BRAND HERITAGE",
    title: "The Story of KK:\nCraftsmanship & Dedication",
    paragraphs: [
      "Forty-five years ago, in a modest workshop filled with the hum of sewing machines and the scent of freshly pressed fabric, a young Chinese national named Mr. Ng Chee Chow began to weave his dream into reality. He believed that every worker deserved a uniform that was more than just clothing—it should be a symbol of pride, unity, and purpose.",
      "With steady hands and an unwavering vision, Mr. Ng Chee Chow stitched the first uniforms himself, each seam carrying his dedication to quality and care. Word spread quickly through Singapore's bustling streets and busy markets. Soon, his workshop became a trusted name, supplying durable, well-crafted uniforms to industries across the nation.",
      "Through the decades, fashions changed, technologies evolved, and the city grew taller and faster. Yet, the heart of the company remained the same: a commitment to craftsmanship, reliability, and respect for the people who wear our work.",
      "Today, we carry forward Mr. Ng Chee Chow's legacy with the same passion that started it all. Every thread we sew is a continuation of his dream—a promise that the values he built this company upon will endure for generations to come.",
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
  },
  commitments: {
    title: "Kaye Kaye is committed to...",
    items: [
      { title: "Innovation", description: "Our products are designed around safety, comfort, and durability. Each solution is built by experienced high-risk textile designers." },
      { title: "Quality & Heritage", description: "Integrating the respected KK brand heritage into our safety garments, providing safety products workers already know and trust." },
      { title: "Singapore Standards", description: "Fully compliant products engineered to align with Singapore Standard (SS) and international safety codes." },
      { title: "Certification", description: "Sourcing entire workforce protective deployment kits from a single reliable Singapore-registered entity." },
    ],
    button_text: "Learn more about our commitments",
    button_link: "#catalog",
    images: [
      "https://ext.same-assets.com/2399502935/462252100.jpeg",
      "https://ext.same-assets.com/2399502935/3224722739.jpeg",
      "https://ext.same-assets.com/2399502935/1367672685.jpeg",
      "https://ext.same-assets.com/2399502935/1676270357.jpeg",
    ],
  },
  sectors: {
    title: "The sectors",
    subtitle: "in which we operate",
    items: [
      "Construction & Civil Engineering",
      "Oil, Gas & Petrochemical Refineries",
      "Mining, Quarrying & Resource Extraction",
      "Manufacturing, Assembly & Heavy Industries",
    ],
    button_text: "All sectors",
    button_link: "#catalog",
    sector_cards: [
      { number: "01", title: "Civil Engineering", image: "https://ext.same-assets.com/2399502935/3409306146.png" },
      { number: "02", title: "Offshore Rigs & Refineries", image: "https://ext.same-assets.com/2399502935/3113294757.png" },
    ],
  },
  heavy_industry: { title: "Heavy Industry & Welding" },
  presence: {
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
  },
  contact: {
    image: "https://ext.same-assets.com/2399502935/3564339651.png",
    title: "Contact us",
    description: "Our sales and support teams are available to assist you with your projects. UEN: 202625392H. Email: ops.kayekaye_safety_solution@outlook.sg. Hotline support is available Monday to Friday: 8:30am - 5:30pm.",
    whatsapp_number: "6581464525",
    email: "ops.kayekaye_safety_solution@outlook.sg",
    facebook_url: "https://www.facebook.com/kaykaysafety",
  },
  features: {
    items: [
      { image: "https://ext.same-assets.com/2399502935/1235351112.png", description: "Re-engineered classic KK heritage lines for construction & marine sectors" },
      { image: "https://ext.same-assets.com/2399502935/3438570413.png", description: "Eco-design and compliant textile technology" },
      { image: "https://ext.same-assets.com/2399502935/1028679899.png", description: "Job audit and specific safety recommendations" },
      { image: "https://ext.same-assets.com/2399502935/2186627193.png", description: "Strict compliance with safety standards and workplace regulations" },
    ],
  },
};

const defaultFallbackProducts = [
  {
    id: "p1",
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p2",
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p3",
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p4",
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p5",
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

async function getSiteData() {
  const supabase = createServerSupabaseClient();

  const [sectionsRes, productsRes] = await Promise.all([
    supabase.from("site_content").select("*"),
    supabase.from("products").select("*").eq("is_active", true).order("sort_order"),
  ]);

  const sections: Record<string, unknown> = {};
  if (sectionsRes.data && sectionsRes.data.length > 0) {
    for (const row of sectionsRes.data) {
      sections[row.section_key] = row.content;
    }
  }

  const fetchedProducts = productsRes.data && productsRes.data.length > 0 ? (productsRes.data as Product[]) : defaultFallbackProducts;

  return {
    settings: (sections.settings || defaultFallbackSections.settings) as SettingsContent,
    hero: (sections.hero || defaultFallbackSections.hero) as HeroContent,
    fallProtection: (sections.fall_protection || defaultFallbackSections.fall_protection) as FallProtectionContent,
    enjoySafety: (sections.enjoy_safety || defaultFallbackSections.enjoy_safety) as EnjoySafetyContent,
    heritage: (sections.heritage || defaultFallbackSections.heritage) as HeritageContent,
    commitments: (sections.commitments || defaultFallbackSections.commitments) as CommitmentsContent,
    sectors: (sections.sectors || defaultFallbackSections.sectors) as SectorsContent,
    heavyIndustry: (sections.heavy_industry || defaultFallbackSections.heavy_industry) as HeavyIndustryContent,
    presence: (sections.presence || defaultFallbackSections.presence) as PresenceContent,
    contact: (sections.contact || defaultFallbackSections.contact) as ContactContent,
    features: (sections.features || defaultFallbackSections.features) as FeaturesContent,
    products: fetchedProducts,
  };
}

export default async function Home() {
  const data = await getSiteData();
  const { settings, hero, fallProtection, enjoySafety, heritage, commitments, sectors, heavyIndustry, presence, contact, features, products } = data;

  return (
    <main className="min-h-screen">
      {/* Top Bar */}
      <div className="bg-[#1e2a32] text-white text-xs py-2.5 px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="bg-[#f5c80c] text-[#1e2a32] px-2 py-0.5 rounded font-bold text-[10px] tracking-wide">UEN: {settings.uen || "202625392H"}</span>
          <span className="text-gray-300">{settings.location_text || "Singapore & Southeast Asia Operations"}</span>
        </div>
        <div className="flex items-center gap-4">
          <a href={settings.facebook_url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#f5c80c] transition" title="Facebook Page">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
            <span className="hidden xs:inline">Facebook</span>
          </a>
          <span className="text-gray-600">|</span>
          <button className="flex items-center gap-2 hover:text-[#f5c80c] transition">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            SG - EN <span className="ml-1">›</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white py-4 px-6 flex items-center justify-between shadow-sm">
        <Link href="/">
          <div className="flex items-center gap-3">
            {settings.logo_image && (
              <Image src={settings.logo_image} alt="Logo" width={42} height={42} className="object-contain" />
            )}
            <div className="text-left">
              <h2 className="text-[#1e2a32] font-black text-lg uppercase leading-none tracking-tight">{settings.brand_name || "Kaye Kaye"}</h2>
              <span className="text-[#f5c80c] text-[11px] font-bold uppercase tracking-widest block">{settings.brand_subtitle || "Safety Solutions"}</span>
            </div>
          </div>
        </Link>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b px-6 py-3">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-gray-700 font-medium justify-center sm:justify-start">
          <li><Link href="#about" className="hover:text-[#1e2a32] transition">KK Brand Heritage</Link></li>
          <li><Link href="#sectors" className="hover:text-[#1e2a32] transition">Workplace Sectors</Link></li>
          <li><Link href="#catalog" className="hover:text-[#1e2a32] transition">Safety Catalog</Link></li>
          <li><Link href="#contact" className="hover:text-[#1e2a32] transition">Become a partner</Link></li>
          <li><Link href="/blogs" className="hover:text-[#f5c80c] transition font-bold text-[#1e2a32]">📝 Blog</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      {hero.background_image && (
        <section className="relative h-[450px] sm:h-[500px] md:h-[600px] overflow-hidden">
          <Image src={hero.background_image} alt="Safety Solutions Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-16">
            <div className="max-w-2xl text-white space-y-4">
              {hero.badge_text && (
                <span className="bg-[#f5c80c]/20 border border-[#f5c80c]/40 text-[#f5c80c] px-3 py-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-widest inline-block">
                  {hero.badge_text}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight whitespace-pre-line">
                {hero.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-xl font-medium leading-relaxed">
                {hero.description}
              </p>
              <a href={hero.cta_link || "#catalog"} className="bg-[#f5c80c] text-[#1e2a32] px-8 py-3.5 font-black hover:bg-yellow-400 hover:scale-[1.02] transition-all inline-block rounded shadow-lg uppercase tracking-wider text-xs sm:text-sm">
                {hero.cta_text || "Discover Catalog"}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Fall Protection Section */}
      {fallProtection.title && (
        <section className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-[#1e2a32] text-white p-8 sm:p-12 md:p-16 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">{fallProtection.title}</h2>
            <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">{fallProtection.description}</p>
            <a href={fallProtection.button_link || "#catalog"} className="bg-transparent border border-white text-white px-8 py-3 w-fit font-medium hover:bg-white hover:text-[#1e2a32] transition text-center">{fallProtection.button_text || "Discover"}</a>
          </div>
          {fallProtection.image && (
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
              <Image src={fallProtection.image} alt="System solutions" fill className="object-cover" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">{fallProtection.overlay_text}</h3>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Enjoy Safety Section */}
      {enjoySafety.title && (
        <section className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-[#1e2a32] relative flex items-center justify-center p-8 sm:p-12 md:p-16 h-[250px] sm:h-[350px] md:h-auto">
            {enjoySafety.image && <Image src={enjoySafety.image} alt="Enjoy Safety" width={400} height={250} className="object-contain max-h-full" />}
          </div>
          <div className="bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e2a32] mb-4 sm:mb-6">{enjoySafety.title}</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">{enjoySafety.description}</p>
            <a href={enjoySafety.button_link || "#catalog"} className="bg-[#1e2a32] text-white px-8 py-3 w-fit font-medium hover:bg-[#2d3f4a] transition text-center">{enjoySafety.button_text || "Find out more"}</a>
          </div>
        </section>
      )}

      {/* Safety Catalog Grid Section */}
      <section id="catalog" className="py-12 sm:py-16 px-4 sm:px-8 bg-white border-t">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2a32] mb-2 text-center font-sans">Safety Catalog</h2>
          <p className="text-center text-gray-500 text-sm sm:text-base mb-8">Premium Head-to-Toe Work Protection Equipment</p>
          <div className="w-12 h-1 bg-[#f5c80c] mx-auto mb-12" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
                <div className={`${product.carousel_images && product.carousel_images.length > 0 ? 'h-56 sm:h-64 overflow-hidden relative' : 'p-4 bg-gray-50 flex items-center justify-center h-56 sm:h-64 relative'}`}>
                  {product.carousel_images && product.carousel_images.length > 0 ? (
                    <ProductCarousel images={product.carousel_images} />
                  ) : product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-contain p-4" />
                  ) : null}
                </div>
                <div className="p-5 sm:p-6 space-y-3">
                  <div>
                    <span className="text-[10px] sm:text-xs uppercase font-extrabold text-[#f5c80c] tracking-widest block">{product.category_label}</span>
                    <h3 className="font-bold text-base sm:text-lg text-[#1e2a32] mt-0.5">{product.name}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{product.description}</p>
                  {product.brands && product.brands.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.brands.map((brand: string) => (
                        <span key={brand} className="bg-gray-100 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200">{brand}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 pt-4 border-t flex flex-wrap gap-2 justify-between items-center">
                    <span className="text-[10px] sm:text-xs text-gray-400 font-semibold">{product.certification}</span>
                    <a href={product.whatsapp_link} target="_blank" rel="noopener noreferrer" className="bg-[#1e2a32] text-white text-xs px-3.5 py-2 font-bold hover:bg-[#2d3f4a] transition rounded">WhatsApp Inquiry</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KK Brand Heritage Section */}
      {heritage.title && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-gray-50 border-t" id="about">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#f5c80c] rounded-full flex items-center justify-center flex-shrink-0"><span className="text-sm">📜</span></div>
                <span className="text-[#f5c80c] font-bold text-sm tracking-widest uppercase">{heritage.badge_text || "BRAND HERITAGE"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1e2a32] leading-tight whitespace-pre-line">{heritage.title}</h2>
              <div className="w-12 h-1 bg-[#f5c80c]" />
              <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed font-sans">
                {(heritage.paragraphs || []).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative space-y-6">
              {heritage.image && (
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-gray-250">
                  <Image src={heritage.image} alt={heritage.image_alt || "Heritage"} fill className="object-cover filter sepia-[20%] hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a32]/85 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <p className="text-xs uppercase font-extrabold text-[#f5c80c] tracking-widest mb-1">{heritage.founder_label}</p>
                      <h3 className="text-lg font-black">{heritage.founder_name}</h3>
                      <p className="text-xs text-gray-300">{heritage.founder_title}</p>
                    </div>
                  </div>
                </div>
              )}
              {heritage.stats && heritage.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-4 bg-white p-5 rounded-lg border border-gray-150 shadow-sm text-center">
                  {heritage.stats.map((stat, idx) => (
                    <div key={idx} className={idx > 0 && idx < heritage.stats.length ? "border-l border-gray-200" : ""}>
                      <div className="text-xl font-extrabold text-[#1e2a32]">{stat.value}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Commitments Section */}
      {commitments.title && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 border-t bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#f5c80c] rounded-full flex items-center justify-center flex-shrink-0"><span className="text-sm">🤝</span></div>
                <span className="text-[#f5c80c] font-medium text-sm tracking-wider uppercase">COMMITMENTS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e2a32] leading-tight">{commitments.title}</h2>
              <div className="w-12 h-1 bg-[#f5c80c]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {(commitments.items || []).map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="font-bold text-[#1e2a32] text-base">{item.title}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
              <a href={commitments.button_link || "#catalog"} className="bg-[#1e2a32] text-white px-6 py-3 text-sm font-medium hover:bg-[#2d3f4a] transition inline-block rounded">{commitments.button_text}</a>
            </div>
            <div className="grid grid-cols-2 gap-4 h-[280px] sm:h-[400px] lg:h-auto">
              {(commitments.images || []).map((img, idx) => (
                <div key={idx} className="relative w-full h-full">
                  <Image src={img} alt={`Commitment ${idx + 1}`} fill className="object-cover rounded shadow-sm" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sectors Section */}
      {sectors.title && (
        <section className="py-12 sm:py-16 bg-gray-50 border-t border-b" id="sectors">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2a32] leading-none">{sectors.title}</h2>
                  <p className="text-lg sm:text-xl text-[#1e2a32] font-medium mt-1">{sectors.subtitle}</p>
                </div>
                <div className="w-12 h-1 bg-[#f5c80c]" />
                <ul className="space-y-2 text-gray-600 text-sm font-medium">
                  {(sectors.items || []).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#f5c80c] rounded-full" />{item}</li>
                  ))}
                </ul>
                <a href={sectors.button_link || "#catalog"} className="bg-[#1e2a32] text-white px-6 py-2 text-sm font-medium hover:bg-[#2d3f4a] transition inline-block rounded">{sectors.button_text}</a>
              </div>
              <div className="col-span-1 lg:col-span-2 flex flex-col sm:flex-row gap-4 pt-4 lg:pt-0">
                {(sectors.sector_cards || []).map((card, idx) => (
                  <div key={idx} className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-lg overflow-hidden shadow-sm">
                    <Image src={card.image} alt={card.title} fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <span className="text-[#f5c80c] text-xs font-bold uppercase tracking-wider">{card.number}</span>
                      <div className="w-8 h-0.5 bg-[#f5c80c] my-2" />
                      <h3 className="text-white text-lg sm:text-xl font-bold">{card.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Heavy Industry Title */}
      <section className="py-8 px-4 sm:px-8 bg-white text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2a32]">{heavyIndustry.title || "Heavy Industry & Welding"}</h2>
        <div className="w-12 h-1 bg-[#f5c80c] mx-auto sm:mx-0 mt-2" />
      </section>

      {/* Our Activity Stats Section */}
      {presence.title && (
        <section className="py-12 sm:py-16 bg-gray-50 border-t border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[250px] sm:h-[300px] max-w-lg w-full mx-auto">
              <div className="bg-[#f5c80c] absolute inset-0 -z-10 rounded-lg transform translate-x-2 translate-y-2 opacity-80" />
              {presence.image && (
                <div className="relative w-full h-full z-10 rounded-lg overflow-hidden shadow">
                  <Image src={presence.image} alt="World Map" fill className="object-cover bg-white" />
                </div>
              )}
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-[#1e2a32] text-center lg:text-left">{presence.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {(presence.main_stats || []).map((stat, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-3xl font-black text-[#1e2a32]">{stat.value}</div>
                    <div className="w-8 h-0.5 bg-[#f5c80c] mx-auto my-2" />
                    <p className="text-gray-500 text-xs font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1e2a32] mt-8 text-center lg:text-left">{presence.distribution_title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {(presence.distribution_stats || []).map((stat, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-3xl font-black text-[#1e2a32]">{stat.value}</div>
                    <div className="w-8 h-0.5 bg-[#f5c80c] mx-auto my-2" />
                    <p className="text-gray-500 text-xs font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {contact.title && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 bg-gray-50 border-t" id="contact">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {contact.image && (
              <div className="relative h-[250px] sm:h-[300px] rounded-lg overflow-hidden shadow-sm">
                <Image src={contact.image} alt="Contact" fill className="object-cover" />
              </div>
            )}
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1e2a32] leading-tight">{contact.title}</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{contact.description}</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center md:justify-start">
                <a href={`https://wa.me/${contact.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border-2 border-[#1e2a32] px-6 py-2.5 rounded font-bold text-sm text-[#1e2a32] hover:bg-[#1e2a32] hover:text-white transition">WhatsApp Hotline</a>
                <a href={`mailto:${contact.email}`} className="flex items-center justify-center gap-2 border-2 border-[#1e2a32] px-6 py-2.5 rounded font-bold text-sm text-[#1e2a32] hover:bg-[#1e2a32] hover:text-white transition">Email Us</a>
                <a href={contact.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border-2 border-[#1e2a32] px-6 py-2.5 rounded font-bold text-sm text-[#1e2a32] hover:bg-[#1e2a32] hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
                  Facebook Page
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Icons Row */}
      {features.items && features.items.length > 0 && (
        <section className="py-12 px-4 sm:px-8 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.items.map((item, idx) => (
              <div key={idx} className="text-center space-y-2">
                {item.image && <Image src={item.image} alt={`Feature ${idx + 1}`} width={70} height={70} className="mx-auto" />}
                <p className="text-gray-600 text-xs sm:text-sm max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#111827] text-white pt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {settings.logo_image && <Image src={settings.logo_image} alt="Logo" width={42} height={42} className="object-contain" />}
              <div className="text-left">
                <h3 className="font-extrabold text-lg leading-none text-white tracking-tight uppercase">{settings.brand_name || "Kaye Kaye"}</h3>
                <span className="text-[#f5c80c] text-[10px] font-bold uppercase tracking-wider block mt-0.5">{settings.brand_subtitle || "Safety Solutions"}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">{settings.footer_description}</p>
            <div className="bg-gray-850 border border-gray-700 p-3 rounded text-[11px] font-semibold text-[#f5c80c] inline-block uppercase tracking-wider">
              UEN: {settings.uen || "202625392H"}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-gray-800 pb-2">Navigation</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#about" className="hover:text-[#f5c80c] transition flex items-center gap-1.5">&rsaquo; KK Brand Heritage</a></li>
              <li><a href="#sectors" className="hover:text-[#f5c80c] transition flex items-center gap-1.5">&rsaquo; Workplace Sectors</a></li>
              <li><a href="#catalog" className="hover:text-[#f5c80c] transition flex items-center gap-1.5">&rsaquo; Safety Catalog</a></li>
              <li><a href="#contact" className="hover:text-[#f5c80c] transition flex items-center gap-1.5">&rsaquo; Request Quotation</a></li>
              <li><Link href="/blogs" className="hover:text-[#f5c80c] transition flex items-center gap-1.5">&rsaquo; Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-gray-800 pb-2">Safety Gear</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#catalog" className="hover:text-[#f5c80c] transition flex items-center gap-1.5">&rsaquo; Protective Gloves</a></li>
              <li><a href="#catalog" className="hover:text-[#f5c80c] transition flex items-center gap-1.5">&rsaquo; Safety Footwear & Shoes</a></li>
              <li><a href="#catalog" className="hover:text-[#f5c80c] transition flex items-center gap-1.5">&rsaquo; Hard Hats & Safety Helmets</a></li>
              <li><a href="#catalog" className="hover:text-[#f5c80c] transition flex items-center gap-1.5">&rsaquo; Fall Protection Harnesses</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-gray-800 pb-2">Support & Auditing</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">Our B2B engineering sales team is available to assist with bulk quotations and site safety inspections.</p>
            <div className="space-y-2 text-xs">
              <a href={`mailto:${contact.email || settings.email}`} className="text-gray-300 hover:text-[#f5c80c] transition block break-all font-semibold">✉ {contact.email || settings.email}</a>
              <span className="text-[#f5c80c] block font-extrabold font-sans">📞 WhatsApp Support: +{(contact.whatsapp_number || settings.whatsapp_number || "").replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3")}</span>
              <a href={contact.facebook_url || settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#f5c80c] transition flex items-center gap-1.5 font-semibold">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
                Facebook Page
              </a>
            </div>
          </div>
        </div>

        <div className="bg-[#0b0f17] py-6 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-center md:text-left">
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center text-gray-400">
              <Link href="#" className="hover:text-white transition">Terms & Conditions</Link>
              <span className="hidden sm:inline opacity-20">|</span>
              <Link href="#" className="hover:text-white transition">Legal information</Link>
              <span className="hidden sm:inline opacity-20">|</span>
              <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            </div>
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-gray-500 block">
              Singapore Registered Office &bull; &copy; {new Date().getFullYear()} Kaye Kaye Safety Solution
            </span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${contact.whatsapp_number || settings.whatsapp_number || "6581464525"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition duration-300 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.031 2c-5.51 0-9.986 4.477-9.986 9.986 0 1.761.459 3.474 1.33 4.988L2 22l5.178-1.361c1.474.804 3.128 1.224 4.853 1.224 5.51 0 9.986-4.477 9.986-9.986 0-5.509-4.477-9.986-9.986-9.986zm0 18.294c-1.49 0-2.951-.4-4.22-1.155l-.303-.18-3.136.824.839-3.058-.198-.314a8.271 8.271 0 0 1-1.265-4.425c0-4.57 3.718-8.289 8.289-8.289s8.289 3.719 8.289 8.289-3.719 8.289-8.289 8.289zm4.542-6.195c-.249-.124-1.472-.726-1.7-.81-.228-.083-.393-.124-.559.124-.166.249-.642.81-.787.975-.145.166-.29.187-.539.062a7.713 7.713 0 0 1-2.012-1.24 8.516 8.516 0 0 1-1.393-1.737c-.145-.249-.015-.384.11-.508.112-.112.249-.29.373-.436.124-.145.166-.249.249-.415.083-.166.042-.311-.02-.436-.062-.124-.559-1.348-.767-1.847-.202-.488-.407-.422-.559-.43-.145-.008-.311-.008-.477-.008s-.436.062-.664.311c-.228.249-.871.851-.871 2.075s.892 2.407.996 2.552c.104.145 1.754 2.68 4.25 3.755.594.256 1.058.409 1.42.524.597.19 1.14.163 1.569.099.479-.071 1.472-.601 1.68-1.182.208-.581.208-1.079.145-1.182-.062-.103-.228-.187-.477-.311z"/>
        </svg>
      </a>
    </main>
  );
}
