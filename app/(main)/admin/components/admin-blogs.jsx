"use client";

import Link from "next/link";
import { Trash, Edit, Plus, Eye, FilePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteBlog } from "@/actions/blog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AdminBlogs({ blogs }) {
  const [blogList, setBlogList] = useState(blogs || []);
  const hasBlogs = blogList.length > 0;

  const handleDelete = async (blogId) => {
    toast.warning("Delete this blog?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteBlog(blogId);
            setBlogList((prev) => prev.filter((b) => b.id !== blogId));
            toast.success("Blog deleted successfully!");
          } catch {
            toast.error("Failed to delete blog");
          }
        },
      },
      cancel: { label: "Cancel" },
    });
  };

  return (
    <Card className="bg-card border-emerald-900/20">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-client">Blogs</CardTitle>
            <CardDescription>Manage platform blog posts and articles</CardDescription>
          </div>

          {hasBlogs && (
            <Link
              href="/admin/blogs/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition shadow-sm text-sm"
            >
              <Plus size={16} /> Add Blog
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Empty State */}
        {!hasBlogs ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-10 text-center bg-muted/10">
            <FilePlus className="h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">
              No blogs yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Start by creating your first blog post.
            </p>
            <Link
              href="/admin/blogs/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition shadow-sm"
            >
              <Plus size={16} /> Add your first blog
            </Link>
          </div>
        ) : (
          /* Blog List */
          <div className="flex flex-col gap-4">
            {blogList.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 border border-emerald-900/10 rounded-lg p-4 gap-4 shadow-sm hover:shadow-md transition"
              >
                <div className="min-w-0 flex-1 w-full">
                  <h3 className="text-lg font-semibold text-foreground break-words line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-muted/20 text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-muted/30 transition text-sm font-medium"
                  >
                    <Eye size={16} /> View
                  </Link>

                  <Link
                    href={`/admin/blogs/${blog.id}/edit`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                  >
                    <Edit size={16} /> Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                  >
                    <Trash size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
