import {
  Calendar,
  Video,
  CreditCard,
  User,
  FileText,
  ShieldCheck,
} from "lucide-react";

// JSON data for features
export const features = [
  {
    icon: <Calendar className="h-6 w-6 text-[#6ba49f]" />,
    title: "Appointment Booking",
    description:
      "Easily schedule and manage appointments using a centralized software platform built for efficient session coordination.",
  },
  {
    icon: <User className="h-6 w-6 text-[#6ba49f]" />,
    title: "Practice Management",
    description:
      "Manage schedules, session records, and workflow using an all-in-one practice management software.",
  },
  {
    icon: <Video className="h-6 w-6 text-[#6ba49f]" />,
    title: "Communication Tools",
    description:
      "Built-in communication features to support coordination between users and independent professionals.",
  },
  {
    icon: <FileText className="h-6 w-6 text-[#6ba49f]" />,
    title: "Session Notes",
    description:
      "Maintain session-related notes and records for reference and workflow continuity.",
  },
];

// JSON data for testimonials
// export const testimonials = [
//   {
//     initials: "SP",
//     name: "Sarah P.",
//     role: "Patient",
//     quote:
//       "The video consultation feature saved me so much time. I was able to get medical advice without taking time off work or traveling to a clinic.",
//   },
//   {
//     initials: "DR",
//     name: "Dr. Robert M.",
//     role: "Cardiologist",
//     quote:
//       "This platform has revolutionized my practice. I can now reach more patients and provide timely care without the constraints of a physical office.",
//   },
//   {
//     initials: "JT",
//     name: "James T.",
//     role: "Patient",
//     quote:
//       "The credit system is so convenient. I purchased a package for my family, and we've been able to consult with specialists whenever needed.",
//   },
// ];

// JSON data for credit system benefits
export const creditBenefits = [
  "1 Credit = 1 Session",
  "One premium credit unlocks one full online session ",
  "Credits never expire — use them whenever you need",

  "Save time, travel, and waiting — workflow now fits your lifestyle",
  "Transparent & value-driven pricing — zero hidden costs",
];

export const testimonials = [
  {
    name: "Ruchi Yadav",
    role: "Real Review",
    rating: 5,
    quote:
      "Doctor Desk is a lifesaver. I was able to consult a specialist within minutes. Highly professional and convenient!",
  },
  {
    name: "Amit Sharma",
    role: "Real Review",
    rating: 5,
    quote:
      "The easiest way to get a professional session. The interface is clean and the experts are very knowledgeable.",
  },
  {
    name: "Neha Verma",
    role: "Real Review",
    rating: 5,
    quote:
      "I was skeptical about online sessions, but Doctor Desk changed my mind. Excellent service and support.",
  },
  {
    name: "Rahul Jain",
    role: "Real Review",
    rating: 5,
    quote:
      "Connecting with top professionals in India has never been this simple. Highly recommended for everyone!",
  },
  {
    name: "Pooja Singh",
    role: "Real Review",
    rating: 5,
    quote:
      "Very convenient and affordable. The expert explained everything so well. Felt very comfortable throughout.",
  },
  {
    name: "Karan Malhotra",
    role: "Real Review",
    rating: 5,
    quote:
      "No more waiting in long queues. Doctor Desk is exactly what I needed for my family's needs.",
  },
];
