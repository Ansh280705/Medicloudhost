"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function isAdmin() {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: { role: true },
    });

    return user?.role === "ADMIN";
}

export async function getNews() {
    try {
        const news = await db.news.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: news };
    } catch (error) {
        console.error("Error fetching news:", error);
        return { success: false, error: "Failed to fetch news" };
    }
}

export async function getActiveNews() {
    try {
        const news = await db.news.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: news };
    } catch (error) {
        console.error("Error fetching active news:", error);
        return { success: false, error: "Failed to fetch active news" };
    }
}

export async function createNews(data) {
    if (!(await isAdmin())) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const news = await db.news.create({
            data: {
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl,
                link: data.link,
                isActive: data.isActive ?? true,
            },
        });

        revalidatePath("/admin");
        revalidatePath("/pricing");
        revalidatePath("/doctor");
        return { success: true, data: news };
    } catch (error) {
        console.error("Error creating news:", error);
        return { success: false, error: "Failed to create news" };
    }
}

export async function updateNews(id, data) {
    if (!(await isAdmin())) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const news = await db.news.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl,
                link: data.link,
                isActive: data.isActive,
            },
        });

        revalidatePath("/admin");
        revalidatePath("/pricing");
        revalidatePath("/doctor");
        return { success: true, data: news };
    } catch (error) {
        console.error("Error updating news:", error);
        return { success: false, error: "Failed to update news" };
    }
}

export async function deleteNews(id) {
    if (!(await isAdmin())) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.news.delete({
            where: { id },
        });

        revalidatePath("/admin");
        revalidatePath("/pricing");
        revalidatePath("/doctor");
        return { success: true };
    } catch (error) {
        console.error("Error deleting news:", error);
        return { success: false, error: "Failed to delete news" };
    }
}

export async function toggleNewsStatus(id, currentStatus) {
    if (!(await isAdmin())) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const news = await db.news.update({
            where: { id },
            data: { isActive: !currentStatus },
        });

        revalidatePath("/admin");
        revalidatePath("/pricing");
        revalidatePath("/doctor");
        return { success: true, data: news };
    } catch (error) {
        console.error("Error toggling news status:", error);
        return { success: false, error: "Failed to toggle status" };
    }
}
