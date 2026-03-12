"use client";
import React from "react";
import { Link, useLocation } from 'react-router-dom'; // Cambiato da next/link
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  // In React Router si usa useLocation invece di usePathname
  const location = useLocation();
  const segments = location.pathname.split('/').filter((item) => item !== '');

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-medium">
      <Link to="/" className="hover:text-blue-500 transition-colors">
        <Home size={14} />
      </Link>
      
      {segments.map((segment, index) => {
        const to = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;

        return (
          <div key={to} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-gray-300" />
            <Link
              to={to}
              className={`capitalize ${
                isLast 
                  ? "text-gray-900 font-semibold pointer-events-none" 
                  : "hover:text-blue-500 transition-colors"
              }`}
            >
              {segment.replace(/-/g, ' ')}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}