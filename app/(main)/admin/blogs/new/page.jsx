"use client";

import { BlogForm } from "@/components/blog/blog-form";
import { createBlog } from "@/actions/blog";

export default function NewBlogAdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <BlogForm action={createBlog} />
    </div>
  );
}
