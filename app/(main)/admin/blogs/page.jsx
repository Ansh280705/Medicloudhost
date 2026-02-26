import { db } from "@/lib/prisma";
import { verifyAdmin } from "@/actions/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminBlogsPage() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return null;

  const blogs = await db.blog.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/admin/blogs/new">
          <Button>Create Blog</Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex justify-between p-4 border-b"
          >
            <div>
              <p className="font-medium">{blog.title}</p>
              <p className="text-sm text-muted-foreground">{blog.slug}</p>
            </div>

            <Link href={`/admin/blogs/${blog.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
