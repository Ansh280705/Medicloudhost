"use client";

import { useRouter } from "next/navigation";
import { BlogForm } from "@/components/blog/blog-form";
import { updateBlog } from "@/actions/blog";
import { toast } from "sonner";

export default function EditBlogClient({ blog }) {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-black text-client mb-8 tracking-tight">Edit Blog Post</h1>

      <BlogForm
        action={updateBlog}
        defaultValues={blog}
      />
    </div>
  );
}
