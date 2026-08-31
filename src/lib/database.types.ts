export interface SiteContent {
  id: string;
  section_key: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  category_label: string;
  description: string;
  certification: string;
  whatsapp_link: string;
  brands: string[];
  sort_order: number;
  image_url: string;
  carousel_images: { src: string; alt: string }[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: string;
  type: "paragraph" | "h2" | "h3" | "image" | "callout";
  value: string;
  caption?: string;
  alt?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CtaBlock {
  heading: string;
  description: string;
  button_text: string;
  button_link: string;
}

export interface InternalLink {
  id: string;
  anchor_text: string;
  url: string;
}

export interface BlogPost {
  id: string;
  title: string;
  seo_title: string;
  slug: string;
  meta_description: string;
  excerpt: string;
  content: string; // fallback raw content
  cover_image: string; // featured image
  cover_image_caption: string;
  author: string;
  author_bio: string;
  reading_time_minutes: number;
  reading_time: string;
  breadcrumbs: string;
  tags: string[];
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  content_blocks: ContentBlock[];
  faqs: FaqItem[];
  cta: CtaBlock;
  internal_links: InternalLink[];
}

export interface KeepaliveLog {
  id: string;
  pinged_at: string;
}

// Section content type definitions
export interface HeroContent {
  background_image: string;
  badge_text: string;
  title: string;
  description: string;
  cta_text: string;
  cta_link: string;
}

export interface FallProtectionContent {
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  image: string;
  overlay_text: string;
}

export interface EnjoySafetyContent {
  image: string;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
}

export interface HeritageContent {
  badge_text: string;
  title: string;
  paragraphs: string[];
  image: string;
  image_alt: string;
  founder_label: string;
  founder_name: string;
  founder_title: string;
  stats: { value: string; label: string }[];
}

export interface CommitmentsContent {
  title: string;
  items: { title: string; description: string }[];
  button_text: string;
  button_link: string;
  images: string[];
}

export interface SectorsContent {
  title: string;
  subtitle: string;
  items: string[];
  button_text: string;
  button_link: string;
  sector_cards: { number: string; title: string; image: string }[];
}

export interface PresenceContent {
  title: string;
  image: string;
  main_stats: { value: string; label: string }[];
  distribution_title: string;
  distribution_stats: { value: string; label: string }[];
}

export interface ContactContent {
  image: string;
  title: string;
  description: string;
  whatsapp_number: string;
  email: string;
  facebook_url: string;
}

export interface FeaturesContent {
  items: { image: string; description: string }[];
}

export interface SettingsContent {
  uen: string;
  location_text: string;
  brand_name: string;
  brand_subtitle: string;
  logo_image: string;
  whatsapp_number: string;
  facebook_url: string;
  email: string;
  footer_description: string;
  chatbot_script: string;
}

export interface HeavyIndustryContent {
  title: string;
}
