"use client";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";

export default function PageContainer({ children }) {
  return (
    // Rimosso bg-gray-50 per permettere allo sfondo dell'acquario di vedersi
    <div className="min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      <div className="mb-6">
        <Breadcrumbs />
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {children}
      </div>
    </div>
  );
}