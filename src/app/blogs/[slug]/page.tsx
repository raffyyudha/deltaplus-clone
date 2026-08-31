import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { BlogPost } from "@/lib/database.types";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();
  
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.seo_title || post.title} | Kaye Kaye Safety Blog`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();

  if (!post) notFound();

  const blogPost = post as BlogPost;

  // Get related posts
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, cover_image, published_at, reading_time, excerpt")
    .eq("is_published", true)
    .neq("id", blogPost.id)
    .order("published_at", { ascending: false })
    .limit(3);

  return <BlogPostClient post={blogPost} relatedPosts={relatedPosts || []} />;
}
