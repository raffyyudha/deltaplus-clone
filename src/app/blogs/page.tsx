import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { BlogPost } from "@/lib/database.types";
import Image from "next/image";
import Link from "next/link";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Blog | Kaye Kaye Safety Solutions",
  description: "Latest articles on workplace safety, PPE guides, and industry news from Kaye Kaye Safety Solutions.",
};

export default async function BlogsPage() {
  const supabase = createServerSupabaseClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const blogPosts = (posts || []) as BlogPost[];
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  // Get unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags || [])));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#f5c80c] rounded-lg flex items-center justify-center">
              <span className="text-[#1e2a32] font-black text-xs">KK</span>
            </div>
            <div>
              <h2 className="text-[#1e2a32] font-black text-sm uppercase leading-none">Kaye Kaye</h2>
              <span className="text-[#f5c80c] text-[9px] font-bold uppercase tracking-widest">Safety Solutions</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#1e2a32] font-medium transition">Home</Link>
            <span className="text-[#1e2a32] font-bold border-b-2 border-[#f5c80c] pb-0.5">Blog</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#1e2a32] to-[#2d3f4a] py-16 sm:py-20 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">Safety Insights & News</h1>
        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          Expert guides, industry updates, and best practices for workplace safety in Southeast Asia.
        </p>
        <div className="w-12 h-1 bg-[#f5c80c] mx-auto mt-6" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {blogPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📝</p>
            <h2 className="text-2xl font-bold text-[#1e2a32] mb-2">Coming Soon</h2>
            <p className="text-gray-500">We&apos;re working on great content. Check back soon!</p>
            <Link href="/" className="inline-block mt-6 bg-[#f5c80c] text-[#1e2a32] px-6 py-3 rounded-lg font-bold text-sm hover:bg-yellow-400 transition">
              ← Back to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10 justify-center">
                {allTags.map((tag) => (
                  <span key={tag} className="bg-white text-gray-600 text-xs font-bold px-4 py-2 rounded-full border border-gray-200 hover:border-[#f5c80c] hover:text-[#1e2a32] transition cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Featured Post */}
            {featuredPost && (
              <Link href={`/blogs/${featuredPost.slug}`} className="block mb-12 group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-96">
                      {featuredPost.cover_image ? (
                        <Image src={featuredPost.cover_image} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1e2a32] to-[#2d3f4a] flex items-center justify-center">
                          <span className="text-6xl">📰</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#f5c80c] text-[#1e2a32] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Featured</span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(featuredPost.tags || []).map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#1e2a32] mb-3 group-hover:text-[#f5c80c] transition-colors leading-tight">{featuredPost.title}</h2>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="font-semibold">{featuredPost.author}</span>
                        <span>•</span>
                        <span>{new Date(featuredPost.published_at).toLocaleDateString("en-SG", { year: "numeric", month: "long", day: "numeric" })}</span>
                        <span>•</span>
                        <span>{featuredPost.reading_time_minutes} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Post Grid */}
            {otherPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <Link key={post.id} href={`/blogs/${post.slug}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col">
                      <div className="relative h-48">
                        {post.cover_image ? (
                          <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"><span className="text-4xl">📝</span></div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(post.tags || []).slice(0, 2).map((tag) => (
                            <span key={tag} className="bg-[#f5c80c]/10 text-[#1e2a32] text-[9px] font-bold px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                        <h3 className="font-bold text-[#1e2a32] mb-2 group-hover:text-[#f5c80c] transition-colors leading-snug">{post.title}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed flex-1">{post.excerpt}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-4 pt-4 border-t border-gray-50">
                          <span className="font-semibold">{post.author}</span>
                          <span>•</span>
                          <span>{new Date(post.published_at).toLocaleDateString("en-SG", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="ml-auto">{post.reading_time_minutes} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1e2a32] py-8 text-center">
        <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Kaye Kaye Safety Solutions • <Link href="/" className="text-[#f5c80c] hover:underline">Back to Home</Link></p>
      </footer>
    </main>
  );
}
