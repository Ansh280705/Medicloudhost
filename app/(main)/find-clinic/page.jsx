"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MapPin, Phone, Clock, User, Stethoscope, Navigation,
  Search, Building2, Loader2, ExternalLink, Filter
} from "lucide-react";
import { getActiveClinics } from "@/actions/clinics";

// Haversine formula — pure JS, no API needed
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function FindClinicPage() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("All");

  // Fetch clinics from DB
  useEffect(() => {
    getActiveClinics().then((res) => {
      setClinics(res.clinics || []);
      setLoading(false);
    });
  }, []);

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("Location not supported in this browser.");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setLocationError("Location access denied. Enable it to see distances.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Unique specialties for filter
  const specialties = useMemo(() => {
    const all = [...new Set(clinics.map((c) => c.specialty))].sort();
    return ["All", ...all];
  }, [clinics]);

  // Clinics with distance, filtered and sorted
  const displayed = useMemo(() => {
    let list = clinics
      .filter((c) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.doctorName.toLowerCase().includes(q) ||
          c.specialty.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q);
        const matchSpecialty = filterSpecialty === "All" || c.specialty === filterSpecialty;
        return matchSearch && matchSpecialty;
      })
      .map((c) => ({
        ...c,
        distance:
          userLocation && c.latitude !== 0
            ? getDistanceKm(userLocation.lat, userLocation.lng, c.latitude, c.longitude)
            : null,
      }));

    // Sort by distance if available, else by name
    list.sort((a, b) => {
      if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
      if (a.distance !== null) return -1;
      if (b.distance !== null) return 1;
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [clinics, userLocation, search, filterSpecialty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-8 h-8" />
            <h1 className="text-3xl font-black">Find Nearby Clinics</h1>
          </div>
          <p className="text-teal-100 text-base">
            Discover offline clinics near you — sorted by distance
          </p>

          {/* Location bar */}
          <div className="mt-6 flex items-center gap-3">
            {locationLoading ? (
              <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2.5 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Detecting your location...
              </div>
            ) : userLocation ? (
              <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2.5 text-sm">
                <Navigation className="w-4 h-4" />
                Location detected — showing nearest clinics first
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2.5 text-sm text-yellow-200">
                  <MapPin className="w-4 h-4" />
                  {locationError || "Location not detected"}
                </div>
                <button
                  onClick={detectLocation}
                  className="bg-white text-teal-700 text-sm font-bold px-4 py-2.5 rounded-2xl hover:bg-teal-50 transition-all"
                >
                  Allow Location
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by clinic, doctor, city..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="pl-9 pr-4 py-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer"
            >
              {specialties.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-muted-foreground">
            {displayed.length === 0
              ? "No clinics found"
              : `${displayed.length} clinic${displayed.length !== 1 ? "s" : ""} found${userLocation ? " — sorted by distance" : ""}`}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        )}

        {/* Clinic Cards */}
        <div className="space-y-4">
          {displayed.map((clinic, idx) => (
            <div
              key={clinic.id}
              className="bg-white dark:bg-card border border-border rounded-3xl p-5 hover:shadow-lg hover:border-teal-300 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {/* Rank badge */}
                    {idx < 3 && userLocation && clinic.distance !== null && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        idx === 0 ? "bg-amber-100 text-amber-700" :
                        idx === 1 ? "bg-slate-100 text-slate-600" :
                        "bg-orange-50 text-orange-600"
                      }`}>
                        {idx === 0 ? "🥇 Nearest" : idx === 1 ? "🥈 2nd" : "🥉 3rd"}
                      </span>
                    )}
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {clinic.specialty}
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-foreground group-hover:text-teal-600 transition-colors">
                    {clinic.name}
                  </h2>

                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{clinic.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{clinic.address}, {clinic.city} – {clinic.pincode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{clinic.timing}</span>
                    </div>
                  </div>
                </div>

                {/* Distance badge */}
                {clinic.distance !== null && (
                  <div className="shrink-0 text-right">
                    <div className="text-2xl font-black text-teal-600">
                      {clinic.distance < 1
                        ? `${(clinic.distance * 1000).toFixed(0)}m`
                        : `${clinic.distance.toFixed(1)}km`}
                    </div>
                    <p className="text-xs text-muted-foreground">from you</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${clinic.phone}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" /> Call {clinic.phone}
                </a>
                {clinic.latitude !== 0 && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Get Directions
                  </a>
                )}
                {clinic.latitude !== 0 && (
                  <a
                    href={`https://www.google.com/maps?q=${clinic.latitude},${clinic.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View on Map
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {!loading && displayed.length === 0 && (
          <div className="text-center py-20">
            <Building2 className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg font-bold text-muted-foreground">No clinics found</p>
            <p className="text-sm text-muted-foreground mt-1">Try changing your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
