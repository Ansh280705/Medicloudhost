
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createLab, deleteLab } from "@/actions/labs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, MapPin, IndianRupee, Clock, Star } from "lucide-react";

// Schema for the form
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().optional(),
  rating: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 5, {
    message: "Rating must be between 0 and 5",
  }),
  reviews: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Reviews must be a number",
  }),
  timings: z.string().min(2, "Timings are required"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a number",
  }),
});

export function LabsManager({ labs }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      rating: "4.5",
      reviews: "100",
      timings: "9:00 AM - 9:00 PM",
      price: "500",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const result = await createLab(values);
      if (result.success) {
        toast.success("Lab created successfully");
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this lab?")) return;

    try {
      const result = await deleteLab(id);
      if (result.success) {
        toast.success("Lab deleted successfully");
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Failed to delete lab");
    }
  }

  return (
    <Card className="bg-card border-emerald-900/20">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-bold text-client">Diagnostic Labs</CardTitle>
          <CardDescription>Manage your diagnostic labs here</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Lab
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Lab</DialogTitle>
              <DialogDescription>
                Enter the details of the new diagnostic lab.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lab Name</FormLabel>
                      <FormControl>
                        <Input placeholder="City Detective Center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (0-5)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reviews"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Count</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timings</FormLabel>
                        <FormControl>
                          <Input placeholder="9 AM - 9 PM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Lab
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {labs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No labs found. Add one to get started.</div>
        ) : (
          <div className="space-y-4">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold">{lab.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {lab.address}</span>
                    <span className="flex items-center"><Star className="w-3 h-3 mr-1 text-orange-400" /> {lab.rating} ({lab.reviews})</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {lab.timings}</span>
                    <span className="flex items-center"><IndianRupee className="w-3 h-3 mr-1" /> {lab.price}</span>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(lab.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}