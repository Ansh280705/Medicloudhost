"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLab(data) {
  try {
    const lab = await db.lab.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone || null,
        rating: parseFloat(data.rating) || 0,
        reviews: parseInt(data.reviews) || 0,
        timings: data.timings,
        price: parseFloat(data.price) || 0,
      },
    });
    revalidatePath("/labs");
    revalidatePath("/admin/labs");
    return { success: true, lab };
  } catch (error) {
    console.error("Error creating lab:", error);
    return { success: false, error: "Failed to create lab" };
  }
}

export async function deleteLab(id) {
  try {
    await db.lab.delete({
      where: { id },
    });
    revalidatePath("/labs");
    revalidatePath("/admin/labs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lab:", error);
    return { success: false, error: "Failed to delete lab" };
  }
}

export async function getLabs() {
  try {
    const labs = await db.lab.findMany({
      orderBy: { createdAt: "desc" },
    });
    return labs;
  } catch (error) {
    console.error("Error fetching labs:", error);
    return [];
  }
}