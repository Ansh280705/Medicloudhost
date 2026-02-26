// app/(main)/blog/[slug]/page.jsx
import { db } from "@/lib/prisma";
import Image from "next/image";
import BlogContent from "./BlogContent"; // client component

/**
 * Fetch a single blog by slug safely (server component)
 */
async function getBlogBySlug(slug) {
  if (!slug || typeof slug !== "string") return null;

  return await db.blog.findUnique({
    where: { slug },
  });
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;

  if (!slug) return <div className="text-center mt-20 text-gray-500">Blog slug missing in URL</div>;

  const blog = await getBlogBySlug(slug);

  if (!blog) return <div className="text-center mt-20 text-gray-500">Blog not found</div>;

  // ✅ Pass blog data to client component
  return <BlogContent blog={blog} />;
}