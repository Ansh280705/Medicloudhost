import { getPublishedBlogs } from "@/actions/blog";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, Tag } from "lucide-react";

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center mb-10 text-primary">
        Doctor<span className="text-client">Desk</span> Blog
      </h1>

      {/* Blog Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link
  key={blog.id}
  href={`/blog/${blog.slug}`}
  className="group"
>
  <div className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300 h-full flex flex-col">

    {/* Image */}
    {blog.imageUrl && (
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    )}

    {/* Content Wrapper */}
    <div className="flex flex-col flex-1 p-4">

      {/* Category */}
      {blog.category && (
        <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
          {blog.category.name}
        </span>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
        {blog.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
        {blog.excerpt}
      </p>

      {/* ✅ Spacer pushes footer down */}
      <div className="flex-grow" />

      {/* Footer (always bottom aligned) */}
      <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
        <span>
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>

        <span className="flex items-center gap-1 text-primary">
          <HeartIcon className="w-4 h-4" />
          {blog.likes || 0}
        </span>
      </div>
    </div>
  </div>
</Link>

        ))}
      </div>
    </div>
  );
}
