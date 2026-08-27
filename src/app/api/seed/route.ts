import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const defaultSections = {
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

const defaultProducts = [
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

const defaultBlogPosts = [
  {
    title: "Essential PPE Guide for Construction Workers in Singapore",
    seo_title: "Essential PPE Guide for Construction Workers in Singapore",
    slug: "essential-ppe-guide-construction-singapore",
    meta_description: "Learn how to choose the right personal protective equipment for construction sites in Singapore, covering all mandatory SS safety codes.",
    excerpt: "A comprehensive guide to choosing the right personal protective equipment for construction sites in Singapore, covering all mandatory safety requirements.",
    content: "Full guide on construction PPE in Singapore...",
    cover_image: "/images/hero_background.avif",
    cover_image_caption: "Site engineer inspecting safety equipment before deployment.",
    author: "KK Team",
    author_bio: "Safety specialist and technical writer at Kaye Kaye Safety Solutions.",
    reading_time: "5 min read",
    reading_time_minutes: 5,
    breadcrumbs: "Blog > Construction Safety",
    tags: ["PPE", "Construction", "Safety Guide", "Singapore"],
    is_published: true,
    published_at: new Date().toISOString(),
    content_blocks: [
      { id: "1", type: "paragraph", value: "Personal Protective Equipment (PPE) is not just a regulatory requirement in Singapore—it's a critical safety system for construction workers who face daily hazards on site." },
      { id: "2", type: "h2", value: "Essential Tools and Protection Needed" },
      { id: "3", type: "paragraph", value: "According to the Ministry of Manpower (MOM), the construction industry consistently records high workplace activity in Singapore. Proper PPE significantly reduces the risk of head, hand, and fall injuries." },
      { id: "4", type: "h2", value: "Step 1: Inspecting Head Protection" },
      { id: "5", type: "paragraph", value: "Safety helmets are mandatory on all construction sites. Look for helmets certified to SS 98 or ANSI Z89.1 standards with 4-point chin straps." },
      { id: "6", type: "image", value: "/images/helmet1.avif", caption: "Ventilated ABS hard hat with 4-point suspension system.", alt: "Yellow ABS Hard Hat" },
      { id: "7", type: "h2", value: "Step 2: Choosing Safety Footwear" },
      { id: "8", type: "paragraph", value: "Steel-toe safety boots must comply with EN ISO 20345 S3 standards, featuring puncture-resistant midsoles and anti-slip outsoles." },
    ],
    faqs: [
      { id: "f1", question: "Is PPE mandatory on all Singapore construction sites?", answer: "Yes, under the Workplace Safety and Health (WSH) Act, employers must provide compliant PPE to all workers." },
      { id: "f2", question: "How often should safety helmets be replaced?", answer: "Helmets should be replaced every 2 to 3 years, or immediately after experiencing an impact event." },
    ],
    cta: {
      heading: "Need Bulk PPE Sourcing or Safety Audits?",
      description: "Speak directly to our Singapore engineering sales team for flat-rate quotes and site delivery within 24 hours.",
      button_text: "Call Kaye Kaye 24/7",
      button_link: "tel:+6581464525",
    },
  },
  {
    title: "Understanding Fall Protection Standards: SS 528 vs EN 361",
    seo_title: "Understanding Fall Protection Standards: SS 528 vs EN 361",
    slug: "fall-protection-standards-ss528-en361",
    meta_description: "Breaking down the key differences between Singapore Standard SS 528 and European Standard EN 361 for fall protection equipment.",
    excerpt: "Breaking down the key differences between Singapore Standard SS 528 and European Standard EN 361 for fall protection equipment.",
    content: "Comparison between SS 528 and EN 361 standards...",
    cover_image: "/images/harness.avif",
    cover_image_caption: "Full body harness for scaffolding and height work.",
    author: "Safety Specialist",
    author_bio: "Certified height safety inspector at Kaye Kaye Safety Solutions.",
    reading_time: "4 min read",
    reading_time_minutes: 4,
    breadcrumbs: "Blog > Height Safety",
    tags: ["Fall Protection", "SS 528", "EN 361"],
    is_published: true,
    published_at: new Date(Date.now() - 86400000).toISOString(),
    content_blocks: [
      { id: "1", type: "paragraph", value: "When working at height on Singapore job sites, understanding the safety codes governing fall protection harnesses and lanyards is crucial." },
      { id: "2", type: "h2", value: "What is SS 528?" },
      { id: "3", type: "paragraph", value: "Singapore Standard SS 528 specifies performance requirements for full-body harnesses, shock-absorbing lanyards, and self-retracting lifelines." },
      { id: "4", type: "h2", value: "What is EN 361?" },
      { id: "5", type: "paragraph", value: "EN 361 is the European standard for fall arrest harnesses. Both SS 528 and EN 361 ensure maximum energy absorption during a fall event." },
    ],
    faqs: [
      { id: "f1", question: "Can we use EN 361 harnesses in Singapore?", answer: "Yes, EN 361 certified harnesses are accepted in Singapore alongside SS 528 compliant gear." },
    ],
    cta: {
      heading: "Looking for Certified Fall Arrest Gear?",
      description: "Contact Kaye Kaye Safety Solutions for SS 528 & EN 361 full-body harnesses and inspectable lanyards.",
      button_text: "WhatsApp Us Now",
      button_link: "https://wa.me/6581464525",
    },
  },
];

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();

    // Seed site_content sections
    for (const [key, content] of Object.entries(defaultSections)) {
      await supabase.from("site_content").upsert(
        { section_key: key, content, updated_at: new Date().toISOString() },
        { onConflict: "section_key" }
      );
    }

    // Seed products (only if table is empty)
    const { count } = await supabase.from("products").select("id", { count: "exact", head: true });
    if (!count || count === 0) {
      await supabase.from("products").insert(defaultProducts);
    }

    // Seed blog posts (only if table is empty)
    const { count: blogCount } = await supabase.from("blog_posts").select("id", { count: "exact", head: true });
    if (!blogCount || blogCount === 0) {
      await supabase.from("blog_posts").insert(defaultBlogPosts);
    }

    return NextResponse.json({ status: "success", message: "Database seeded successfully with Apex CMS structure!" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Send a POST request to this endpoint to seed the database with initial data.",
    warning: "This will populate site_content, products, and blog_posts tables.",
  });
}
