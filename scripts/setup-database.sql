-- ============================================
-- Kaye Kaye Safety - COMPLETE Supabase Setup
-- ============================================
-- Run this ENTIRE SQL in your Supabase SQL Editor:
-- Dashboard > SQL Editor > New Query > Paste All > Run
-- ============================================
-- This script creates:
--   1. All database tables
--   2. Row Level Security (RLS) policies
--   3. Auto-update triggers
--   4. Storage bucket 'site-images' (public)
--   5. Storage RLS policies for upload/read
-- ============================================


-- =====================
-- 1. DATABASE TABLES
-- =====================

-- Site Content (all editable sections stored as JSONB)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products (Safety Catalog)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_label TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  certification TEXT DEFAULT '',
  whatsapp_link TEXT DEFAULT '',
  brands JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  image_url TEXT DEFAULT '',
  carousel_images JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog Posts (Apex CMS Style)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  seo_title TEXT DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  meta_description TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  cover_image_caption TEXT DEFAULT '',
  author TEXT DEFAULT 'KK Team',
  author_bio TEXT DEFAULT 'Safety specialist and technical writer at Kaye Kaye Safety Solutions.',
  reading_time TEXT DEFAULT '5 min read',
  reading_time_minutes INT DEFAULT 5,
  breadcrumbs TEXT DEFAULT 'Blog > Safety Guide',
  tags JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  content_blocks JSONB DEFAULT '[]',
  faqs JSONB DEFAULT '[]',
  cta JSONB DEFAULT '{}'
);

-- Keep-alive Log (prevents Supabase free tier from sleeping)
CREATE TABLE IF NOT EXISTS keepalive_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pinged_at TIMESTAMPTZ DEFAULT now()
);


-- =====================
-- 2. ROW LEVEL SECURITY
-- =====================

-- Site Content RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_content_public_read" ON site_content;
DROP POLICY IF EXISTS "site_content_auth_insert" ON site_content;
DROP POLICY IF EXISTS "site_content_auth_update" ON site_content;
DROP POLICY IF EXISTS "site_content_auth_delete" ON site_content;
DROP POLICY IF EXISTS "site_content_anon_insert" ON site_content;
DROP POLICY IF EXISTS "site_content_anon_update" ON site_content;

CREATE POLICY "site_content_public_read" ON site_content FOR SELECT USING (true);
CREATE POLICY "site_content_auth_insert" ON site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "site_content_auth_update" ON site_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "site_content_auth_delete" ON site_content FOR DELETE TO authenticated USING (true);
-- Allow anon key to insert/update for auto-seed mechanism
CREATE POLICY "site_content_anon_insert" ON site_content FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "site_content_anon_update" ON site_content FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Products RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products_public_read" ON products;
DROP POLICY IF EXISTS "products_auth_insert" ON products;
DROP POLICY IF EXISTS "products_auth_update" ON products;
DROP POLICY IF EXISTS "products_auth_delete" ON products;
DROP POLICY IF EXISTS "products_anon_insert" ON products;
DROP POLICY IF EXISTS "products_anon_update" ON products;

CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "products_auth_insert" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_auth_update" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "products_auth_delete" ON products FOR DELETE TO authenticated USING (true);
CREATE POLICY "products_anon_insert" ON products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "products_anon_update" ON products FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Blog Posts RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blog_posts_public_read" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_auth_insert" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_auth_update" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_auth_delete" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_anon_insert" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_anon_update" ON blog_posts;

CREATE POLICY "blog_posts_public_read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "blog_posts_auth_insert" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "blog_posts_auth_update" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "blog_posts_auth_delete" ON blog_posts FOR DELETE TO authenticated USING (true);
CREATE POLICY "blog_posts_anon_insert" ON blog_posts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "blog_posts_anon_update" ON blog_posts FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Keepalive Log RLS
ALTER TABLE keepalive_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "keepalive_public_read" ON keepalive_log;
DROP POLICY IF EXISTS "keepalive_public_insert" ON keepalive_log;
DROP POLICY IF EXISTS "keepalive_public_delete" ON keepalive_log;

CREATE POLICY "keepalive_public_read" ON keepalive_log FOR SELECT USING (true);
CREATE POLICY "keepalive_public_insert" ON keepalive_log FOR INSERT WITH CHECK (true);
CREATE POLICY "keepalive_public_delete" ON keepalive_log FOR DELETE USING (true);


-- =====================
-- 3. AUTO-UPDATE TRIGGERS
-- =====================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- =====================
-- 4. STORAGE BUCKET
-- =====================
-- Create the 'site-images' public bucket for image uploads

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  5242880,  -- 5MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];


-- =====================
-- 5. STORAGE RLS POLICIES
-- =====================

-- Allow anyone to VIEW/DOWNLOAD images (public read)
DROP POLICY IF EXISTS "public_read_site_images" ON storage.objects;
CREATE POLICY "public_read_site_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Allow authenticated users to UPLOAD images
DROP POLICY IF EXISTS "auth_upload_site_images" ON storage.objects;
CREATE POLICY "auth_upload_site_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-images');

-- Allow authenticated users to UPDATE images
DROP POLICY IF EXISTS "auth_update_site_images" ON storage.objects;
CREATE POLICY "auth_update_site_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-images')
WITH CHECK (bucket_id = 'site-images');

-- Allow authenticated users to DELETE images
DROP POLICY IF EXISTS "auth_delete_site_images" ON storage.objects;
CREATE POLICY "auth_delete_site_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-images');

-- Allow anon key to UPLOAD (for auto-seed from admin dashboard)
DROP POLICY IF EXISTS "anon_upload_site_images" ON storage.objects;
CREATE POLICY "anon_upload_site_images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'site-images');


-- ============================================
-- ✅ SETUP COMPLETE!
-- ============================================
-- After running this SQL:
--   1. Go to http://localhost:3000/admin
--   2. Login with your Supabase Auth account
--   3. Open any section (Products, Hero, Blogs, etc.)
--   4. Data will auto-populate from defaults
--   5. Edit anything and click "Save Changes"
--   6. Upload images via drag & drop — bucket is ready!
-- ============================================
