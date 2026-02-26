"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ─── Geocode address → lat/lng using OpenStreetMap (free, no API key) ───
export async function geocodeAddress(address, city, state, pincode) {
  try {
    const query = encodeURIComponent(`${address}, ${city}, ${state}, ${pincode}, India`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { "User-Agent": "MediCloud-App/1.0" } }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Add clinic (Admin only) ───
export async function addClinic(formData) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (user?.role !== "ADMIN") return { success: false, error: "Admins only" };

  try {
    // Auto-geocode the address
    const geo = await geocodeAddress(
      formData.address,
      formData.city,
      formData.state,
      formData.pincode
    );

    const clinic = await db.offlineClinic.create({
      data: {
        name:       formData.name.trim(),
        doctorName: formData.doctorName.trim(),
        specialty:  formData.specialty.trim(),
        phone:      formData.phone.trim(),
        email:      formData.email?.trim() || null,
        address:    formData.address.trim(),
        city:       formData.city.trim(),
        state:      formData.state.trim(),
        pincode:    formData.pincode.trim(),
        timing:     formData.timing.trim(),
        latitude:   geo?.lat ?? 0,
        longitude:  geo?.lng ?? 0,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/find-clinic");
    return { success: true, clinic, geocoded: !!geo };
  } catch (error) {
    console.error("addClinic error:", error);
    return { success: false, error: "Failed to add clinic" };
  }
}

// ─── Toggle active/inactive ───
export async function toggleClinicStatus(id, isActive) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (user?.role !== "ADMIN") return { success: false, error: "Admins only" };

  try {
    await db.offlineClinic.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin");
    revalidatePath("/find-clinic");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update clinic" };
  }
}

// ─── Delete clinic ───
export async function deleteClinic(id) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (user?.role !== "ADMIN") return { success: false, error: "Admins only" };

  try {
    await db.offlineClinic.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/find-clinic");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete clinic" };
  }
}

// ─── Get all clinics (for admin) ───
export async function getAllClinics() {
  try {
    const clinics = await db.offlineClinic.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, clinics };
  } catch {
    return { success: true, clinics: [] };
  }
}

// ─── Get active clinics (for patients) ───
export async function getActiveClinics() {
  try {
    const clinics = await db.offlineClinic.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, clinics };
  } catch {
    return { success: true, clinics: [] };
  }
}
