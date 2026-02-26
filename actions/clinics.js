"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ─── Geocode address → lat/lng using OpenStreetMap (free, no API key) ───
export async function geocodeAddress(address, city, state, pincode) {
  const headers = {
    "User-Agent": "MediCloud-ClinicFinder/1.0 (medicloudofficial@gmail.com)",
    "Accept-Language": "en",
  };

  // Try progressively simpler queries until one works
  const queries = [
    `${address}, ${city}, ${state}, ${pincode}, India`,   // Full address
    `${city}, ${pincode}, ${state}, India`,                // City + pincode
    `${city}, ${state}, India`,                            // City + state only
  ];

  for (const q of queries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=in`;
      const res = await fetch(url, { headers });
      const data = await res.json();
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch {
      // try next query
    }
  }
  return null;
}

// ─── Add clinic (Admin only) ───
export async function addClinic(formData) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (user?.role !== "ADMIN") return { success: false, error: "Admins only" };

  try {
    // 1. Use manual GPS coordinates if admin used "Use My Location" button
    // 2. Otherwise fall back to Nominatim geocoding from address
    let geo = null;
    if (formData.manualLat && formData.manualLng) {
      geo = { lat: parseFloat(formData.manualLat), lng: parseFloat(formData.manualLng) };
    } else {
      geo = await geocodeAddress(formData.address, formData.city, formData.state, formData.pincode);
    }

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
