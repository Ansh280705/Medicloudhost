"use client";

import { Clipboard, User, Stethoscope } from "lucide-react";

export default function PrescriptionCard({ prescription }) {
  const { appointment, diagnosis, medicines, instructions, medicalHistory } = prescription;
  const doctor = appointment.doctor;

  return (
    <div className="border rounded-lg bg-white p-4 sm:p-6 shadow-md mb-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-client pb-3 mb-4">
        <div className="flex items-center gap-3 mb-3 md:mb-0">
          <img
            src="final-logo.png"
            alt="Clinic Logo"
            className="h-12 w-12 object-contain"
          />
          <div>
            <h2 className="text-lg font-bold">
              Doctor<span className="text-client">Desk</span>
            </h2>
            <p className="text-sm text-gray-500">
              Trusted Professional Platform
            </p>
          </div>
        </div>

        <div className="text-sm text-left md:text-right">
          <p className="font-medium">
            <strong>Expert Name: </strong>Dr.{doctor?.name} <br />{doctor?.specialty} <br />{doctor?.qualifications} 
          </p>
          <p className="font-medium">
            <strong>Date: </strong>
            {new Date(appointment.startTime).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="border border-client/40 rounded-lg p-4 bg-gray-50 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-client/20">
            <User className="text-client w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Client Details</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-black font-bold">Client Name</p>
            <p className="font-medium text-gray-800">{appointment.patient?.name}</p>
          </div>
          <div>
            <p className="text-black font-bold">Phone</p>
            <p className="font-medium text-gray-800">+91 {appointment.patientPhone}</p>
          </div>
          <div>
            <p className="text-black font-bold">Age</p>
            <p className="font-medium text-gray-800">{appointment.patientAge}</p>
          </div>
          <div>
            <p className="text-black font-bold">Gender</p>
            <p className="font-medium text-gray-800">{appointment.patientGender}</p>
          </div>
        </div>
      </div>

      {/* Doctor Info (Polished like Patient section) */}
      <div className="border border-client/40 rounded-lg p-4 bg-gray-50 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-client/20">
            <Stethoscope className="text-client w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Professional Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-black font-bold">Specialty</p>
            <p className="font-medium text-gray-800">{doctor?.specialty}</p>
          </div>
          <div>
            <p className="text-black font-bold">Qualifications</p>
            <p className="font-medium text-gray-800">{doctor?.qualifications?.join(", ")}</p>
          </div>
        </div>
      </div>

      {/* Medical Info */}
      <div className="space-y-4 w-full max-w-full overflow-hidden">
        {medicalHistory && (
          <div className="border border-client/40 rounded-lg p-4 bg-gray-50 break-words w-full">
            <strong className="block mb-2">Context / History</strong>
            <p className="text-gray-800 whitespace-pre-wrap">{medicalHistory}</p>
          </div>
        )}

        {["Summary", "Recommendations", "Next Steps"].map((title, index) => {
          const value =
            title === "Summary"
              ? diagnosis
              : title === "Recommendations"
              ? medicines
              : instructions;
          if (!value) return null;
          return (
            <div
              key={index}
              className="border border-client/40 rounded-lg p-4 bg-gray-50 break-words w-full"
            >
              <strong className="block mb-2">{title}</strong>
              <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
            </div>
          );
        })}
        
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-gray-300 pt-4 text-sm text-gray-600 space-y-3">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="font-medium">Validity:</p>
          <p className="text-gray-700 text-xs">
            This record is issued following Platform Guidelines. It is valid as an electronic record and should be retained by the client.
          </p>
          <p className="font-medium mt-2">Consent (Telemedicine):</p>
          <p className="text-gray-700 text-xs">
            It is valid as an electronic record and should be retained by the client.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="font-medium">Notes:</p>
          <ul className="list-disc list-inside text-gray-700 text-xs space-y-1 mt-1">
            <li>For minors, session must be with an identified adult/guardian.</li>
            <li>Medical prescriptions are not provided via this platform.</li>
            <li>For emergencies, contact local emergency services / nearest hospital.</li>
          </ul>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <img
              src="final-logo.png"
              alt="Doctor Desk Logo"
              className="h-6 w-6"
            />
            <span>
              Generated by <strong>Doctor <span className="text-client">Desk</span></strong>
            </span>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <span className="text-xs text-gray-500">
              Date: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
