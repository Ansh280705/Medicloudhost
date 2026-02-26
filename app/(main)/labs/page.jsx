"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getLabs } from "@/actions/labs";
import { MapPin, Star, Clock, IndianRupee } from "lucide-react";

const LabsPage = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchLabs() {
      const data = await getLabs();
      setLabs(data);
      setLoading(false);
    }
    fetchLabs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-slate-600">Loading labs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Diagnostic Labs</h1>
        <p className="text-slate-600 text-lg max-w-2xl">
          Book tests at top-rated diagnostic centers near you. Verified labs, accurate reports, and best prices.
        </p>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <Card key={lab.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 mb-2">{lab.name}</CardTitle>
                  <CardDescription className="flex items-center text-slate-500">
                    <MapPin className="w-4 h-4 mr-1 shrink-0" />
                    <span className="text-sm">{lab.address}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center bg-green-50 px-2 py-1 rounded text-green-700 text-sm font-medium">
                  <Star className="w-4 h-4 mr-1 fill-green-700" />
                  {lab.rating}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{lab.timings}</span>
                  </div>
                   <div className="flex items-center font-medium text-slate-900">
                    <IndianRupee className="w-4 h-4 mr-2 text-slate-500" />
                    <span>Starts from ₹{lab.price}</span>
                  </div>
               </div>
            </CardContent>
             <CardFooter className="pt-4 border-t border-slate-100">
                <Button 
                  className="w-full bg-black text-white hover:bg-slate-800"
                  onClick={() => {
                    setSelectedLab(lab);
                    setDialogOpen(true);
                  }}
                >
                    Book Appointment
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Phone Number Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedLab?.name}</DialogTitle>
            <DialogDescription>Contact Information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedLab?.phone ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Call to book your appointment</p>
                  <a 
                    href={`tel:${selectedLab.phone}`}
                    className="text-2xl font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    {selectedLab.phone}
                  </a>
                </div>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => window.open(`tel:${selectedLab.phone}`)}
                >
                  Call Now
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Phone number not available for this lab
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabsPage;