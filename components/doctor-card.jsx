import { User, Star, Calendar, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DoctorCard({ doctor }) {
  return (
    <Card className="border-emerald-900/20 hover:border-emerald-700/40 transition-all">
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-emerald-900/10 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <User className="h-7 w-7 sm:h-6 sm:w-6 text-emerald-400" />
            )}
          </div>

          <div className="flex-1 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h3 className="font-extrabold text-client text-xl tracking-tight leading-none group-hover:text-emerald-700 transition-colors">Dr. {doctor.name}</h3>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-100 self-center sm:self-start px-3"
              >
                <Star className="h-3 w-3 mr-1.5 fill-emerald-400" />
                Verified
              </Badge>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <span className="text-[15px] font-bold text-emerald-700 leading-tight">
                  {doctor.specialty}
                </span>
                {doctor.qualifications && doctor.qualifications.length > 0 && (
                  <span className="text-[11px] text-slate-400 font-medium italic sm:before:content-['•'] sm:before:mr-2">
                    ({doctor.qualifications.join(", ")})
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-start text-xs text-slate-500 font-medium pb-2 border-b border-slate-50">
                <Medal className="h-4 w-4 text-emerald-500 mr-2" />
                <span>{doctor.experience} Successful Years</span>
              </div>
            </div>

            <div className="hidden sm:block line-clamp-2 text-sm text-slate-500 leading-relaxed mb-5">
              {doctor.description}
            </div>

            <Button
              asChild
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 sm:h-12 rounded-xl text-[15px] font-bold transition-all duration-300"
            >
              <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
                <Calendar className="h-4 w-4 mr-2" />
                View Profile & Book
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}