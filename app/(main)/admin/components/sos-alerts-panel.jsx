"use client";

import { useState } from "react";
import {
  Siren,
  MapPin,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveSOSAlert } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";

export function SOSAlertsPanel({ alerts: initialAlerts }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [resolvingId, setResolvingId] = useState(null);

  const handleResolve = async (id) => {
    if (!window.confirm("Mark this alert as resolved?")) return;
    setResolvingId(id);
    await resolveSOSAlert(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "RESOLVED" } : a))
    );
    setResolvingId(null);
  };

  const activeAlerts = alerts.filter((a) => a.status === "ACTIVE");
  const resolvedAlerts = alerts.filter((a) => a.status === "RESOLVED");

  return (
    <Card className="bg-card border-emerald-900/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-client flex items-center gap-2">
          <Siren className="w-5 h-5 text-red-500" />
          SOS Alert History
        </CardTitle>
        <CardDescription>
          All patient emergency triggers — active and resolved.
          Real-time alerts appear as floating cards on all admin pages.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-red-600">{activeAlerts.length}</p>
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mt-1">Active Now</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-emerald-600">{resolvedAlerts.length}</p>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-1">Resolved</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-2xl font-black text-slate-700">{alerts.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total</p>
          </div>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div>
            <h3 className="text-xs font-black text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping inline-block" />
              Active Alerts
            </h3>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onResolve={handleResolve}
                  isResolving={resolvingId === alert.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Resolved Alerts */}
        {resolvedAlerts.length > 0 && (
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Resolved
            </h3>
            <div className="space-y-3">
              {resolvedAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} resolved />
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Siren className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p className="font-medium">No SOS alerts yet</p>
            <p className="text-xs text-gray-400 mt-1">Patient emergency triggers will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AlertCard({ alert, onResolve, isResolving, resolved }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        resolved
          ? "bg-slate-50 border-slate-100 opacity-70"
          : "bg-red-50 border-red-200 shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 items-start">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              resolved ? "bg-slate-200" : "bg-red-600"
            }`}
          >
            <User className={`w-4 h-4 ${resolved ? "text-slate-500" : "text-white"}`} />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">
              {alert.user.name || "(No name)"}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" /> {alert.user.email}
              </span>
              {alert.user.phone && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {alert.user.phone}
                </span>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(alert.createdAt), "dd MMM yyyy, hh:mm a")}
              </span>
            </div>
          </div>
        </div>
        <Badge
          className={`text-[10px] font-black shrink-0 ${
            resolved
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-red-600 text-white border-red-600"
          }`}
        >
          {resolved ? "RESOLVED" : "ACTIVE"}
        </Badge>
      </div>

      {/* Actions row — always shown */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {alert.latitude && alert.longitude ? (
          <a
            href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all"
          >
            <MapPin className="w-3 h-3" /> View Live Location
          </a>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold border border-gray-200 cursor-not-allowed">
            <MapPin className="w-3 h-3" /> No Location Shared
          </span>
        )}

        {!resolved && (
          <Button
            size="sm"
            variant="outline"
            disabled={isResolving}
            onClick={() => onResolve(alert.id)}
            className="h-8 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {isResolving ? "Resolving..." : "Mark Resolved"}
          </Button>
        )}
      </div>
    </div>
  );
}
