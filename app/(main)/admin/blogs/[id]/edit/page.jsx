import { db } from "@/lib/prisma";
import { verifyAdmin } from "@/actions/admin";
import EditBlogClient from "./edit-blog-client";

export default async function EditBlogPage({ params }) {
  // ✅ unwrap params
  const { id } = await params;

  const isAdmin = await verifyAdmin();
  if (!isAdmin) return <div>Unauthorized</div>;

  if (!id) {
    return <div>Blog ID missing</div>;
  }

  const blog = await db.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return <EditBlogClient blog={blog} />;
}
