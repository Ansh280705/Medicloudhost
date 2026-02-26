"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Users, CreditCard, BookOpen, FlaskConical, Wallet } from "lucide-react";

export function AdminTabsSection({ children }) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const triggers = [
    { value: "pending", label: "Pending Verification", icon: AlertCircle },
    { value: "doctors", label: "Doctors", icon: Users },
    { value: "payouts", label: "Payouts", icon: CreditCard },
    { value: "payment-requests", label: "Payments", icon: Wallet },
    { value: "news", label: "News/Banners", icon: BookOpen },
    { value: "blogs", label: "Blogs", icon: BookOpen },
    { value: "labs", label: "Labs", icon: FlaskConical },
  ];

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
    >
      <TabsList className="md:col-span-1 bg-card border-client border-2 flex flex-row md:flex-col w-full h-fit md:self-start p-1.5 rounded-md md:space-y-1 gap-1 md:gap-0 md:space-x-0 overflow-x-auto md:overflow-x-hidden overflow-y-hidden relative justify-start items-center md:items-stretch scrollbar-thin scrollbar-thumb-client/20">
        {triggers.map((trigger) => {
          const Icon = trigger.icon;
          
          return (
            <TabsTrigger
              key={trigger.value}
              value={trigger.value}
              className="relative flex-none md:flex-1 flex items-center justify-start md:px-4 md:py-3 px-3 py-2 min-w-fit md:min-w-0 z-10 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none border-none outline-none focus-visible:ring-0 transition-colors duration-200"
            >
              {activeTab === trigger.value && (
                <motion.div
                  layoutId="active-tab-highlight"
                  className="absolute inset-0 bg-client rounded-[4px] -z-10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <Icon className="h-4 w-4 mr-2" /> 
              <span className="whitespace-nowrap text-sm font-medium">{trigger.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      <div className="md:col-span-3 min-w-0 overflow-hidden">{children}</div>
    </Tabs>
  );
}
