"use client"

import { bookAppointment } from '@/actions/appointments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@radix-ui/react-label';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, CreditCard, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useFetch from '@/hooks/use-fetch';

const AppointmentForm = ({ doctorId, slot, onBack, onComplete }) => {
  const [description, setDescription] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");

  const { loading, data, fn: submitBooking } = useFetch(bookAppointment);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientName || !patientPhone || !patientAge || !patientGender) {
      toast.error("Please fill all patient details");
      return;
    }

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("description", description);
    formData.append("patientName", patientName);
    formData.append("patientPhone", patientPhone);
    formData.append("patientAge", patientAge);
    formData.append("patientGender", patientGender);

    await submitBooking(formData);
  };

  useEffect(() => {
    if (data?.success) {
      toast.success("Appointment booked successfully!");
      onComplete();
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Slot Info */}
      <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20 space-y-3">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-black font-medium">
            {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-black">{slot.formatted}</span>
        </div>
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-muted-foreground">
            Cost: <span className="text-black font-medium">1 credits</span>
          </span>
        </div>
      </div>

      {/* Patient Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">Full Name</Label>
          <input
            id="patientName"
            placeholder="Your Full Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patientPhone">Phone Number</Label>
          <input
            id="patientPhone"
            placeholder="e.g. +91 81094 24356"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patientAge">Age</Label>
          <input
            id="patientAge"
            type="number"
            placeholder="Your Age"
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patientGender">Gender</Label>
          <select
            id="patientGender"
            value={patientGender}
            onChange={(e) => setPatientGender(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Medical Concern (optional)</Label>
        <Textarea
          id="description"
          placeholder="Describe your concern..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-card border-emerald-900/20 h-32"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="border-emerald-900/30 bg-card"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change Time Slot
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
