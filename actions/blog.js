"use server";

import { db } from "@/lib/prisma";
import { verifyAdmin } from "@/actions/admin";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

/* ================= ADMIN ================= */

export async function createBlog(prevState, formData) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const title = formData.get("title");

    await db.blog.create({
      data: {
        title,
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        imageUrl: formData.get("imageUrl"),
        isPublished: formData.get("isPublished") === "on",
        slug: slugify(title, { lower: true, strict: true }),
      },
    });

    revalidatePath("/admin/blogs");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create blog" };
  }
}

export async function updateBlog(prevState, formData) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const id = formData.get("id"); // 👈 id hidden input se aayega
    const title = formData.get("title");

    await db.blog.update({
      where: { id },
      data: {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        imageUrl: formData.get("imageUrl"),
        isPublished: formData.get("isPublished") === "on",
      },
    });

    revalidatePath("/admin/blogs");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update blog" };
  }
}

export async function deleteBlog(id) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  await db.blog.delete({ where: { id } });
  revalidatePath("/admin/blogs");
}

/* ================= PUBLIC ================= */

export async function getPublishedBlogs() {
  try {
    return await db.blog.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug) {
  return db.blog.findUnique({ where: { slug } });
}

export async function likeBlog(blogId) {
  return await db.blog.update({
    where: { id: blogId },
    data: { likes: { increment: 1 } },
  });
}

export async function getBlogs() {
  return await db.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
}
