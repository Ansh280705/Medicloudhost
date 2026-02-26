import { Notebook } from "lucide-react";

// app/prescriptions/layout.jsx
export const metadata = {
  title: "Prescriptions",
};

export default function PrescriptionLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8">
      
      {children}
    </div>
  );
}
