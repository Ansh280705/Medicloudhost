"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ChevronRight, Clock } from 'lucide-react';
import React, { useState } from 'react'

const SlotPicker = ({ days, onSelectSlot }) => {
      const [selectedSlot, setSelectedSlot] = useState(null);

  // Find first day with slots as default tab
  const firstDayWithSlots =
    days.find((day) => day.slots.length > 0)?.date || days[0]?.date;
  const [activeTab, setActiveTab] = useState(firstDayWithSlots);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const confirmSelection = () => {
    if (selectedSlot) {
      onSelectSlot(selectedSlot);
    }
  };
  return (
     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="relative group">
          <div className="bg-emerald-50/50 p-1.5 rounded-2xl border border-emerald-100/50 mb-6">
            <TabsList className="w-full justify-start overflow-x-auto bg-transparent h-auto p-0 gap-1.5 flex-nowrap scroll-smooth pb-1 md:pb-0">
              {days.map((day) => {
                const isAvailable = day.slots.length > 0;
                const date = new Date(day.date);
                
                return (
                  <TabsTrigger
                    key={day.date}
                    value={day.date}
                    disabled={!isAvailable}
                    className={`
                      flex flex-col items-center min-w-[75px] sm:min-w-[85px] py-3 sm:py-4 px-2 rounded-xl transition-all duration-300
                      data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-200/50
                      ${!isAvailable ? "opacity-30 grayscale cursor-not-allowed" : "hover:bg-emerald-100 text-slate-600"}
                    `}
                  >
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold mb-1 opacity-70">
                      {format(date, "EEE")}
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold leading-none">
                      {format(date, "d")}
                    </span>
                    <span className="text-[9px] sm:text-[10px] mt-1 font-medium italic opacity-80">
                      {format(date, "MMM")}
                    </span>
                    
                    {isAvailable && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          {/* Mobile hint */}
          <div className="md:hidden absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border border-slate-100 text-[9px] font-bold text-slate-400 opacity-60">
            Scroll for more days
          </div>
        </div>

        {days.map((day) => (
          <TabsContent key={day.date} value={day.date} className="mt-0 focus-visible:outline-none">
            {day.slots.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Clock className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium text-sm">No appointments available for this date.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2 truncate">
                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                    Available Slots
                  </h3>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
                    {day.slots.length} Slots Left
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {day.slots.map((slot) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    
                    return (
                      <div
                        key={slot.startTime}
                        className={`
                          relative group cursor-pointer rounded-xl border-2 p-3 sm:p-4 transition-all duration-300
                          ${isSelected 
                            ? "bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-100/50 scale-[1.02] z-10" 
                            : "bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30"}
                        `}
                        onClick={() => handleSlotSelect(slot)}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <Clock className={`h-3.5 w-3.5 ${isSelected ? "text-emerald-200" : "text-emerald-500"}`} />
                          <span className={`text-[13px] sm:text-sm font-bold tracking-tight ${isSelected ? "text-white" : "text-slate-700"}`}>
                            {format(new Date(slot.startTime), "h:mm a")}
                          </span>
                        </div>
                        
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-white text-emerald-600 rounded-full p-0.5">
                            <ChevronRight className="h-2.5 w-2.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-100">
        <p className="text-xs sm:text-sm text-slate-500 italic text-center sm:text-left">
          {selectedSlot 
            ? `Selected: ${format(new Date(selectedSlot.startTime), "EEEE, h:mm a")}`
            : "Pick a time that works best for you."}
        </p>
        <Button
          onClick={confirmSelection}
          disabled={!selectedSlot}
          className={`
            w-full sm:w-auto min-w-[180px] h-12 sm:h-14 rounded-2xl text-base sm:text-lg font-bold transition-all duration-300
            ${selectedSlot 
              ? "bg-emerald-600 hover:bg-emerald-700" 
              : "bg-slate-200 text-slate-400"}
          `}
        >
          Confirm Bookings
          <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </div>
  )
}

export default SlotPicker