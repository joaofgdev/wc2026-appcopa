"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  // Inicialmente expandido apenas em telas maiores que 1024px (lg) para não poluir muito a tela em telas médias (md).
  // Porém, por padrão vamos deixar expandido no desktop se a tela for grande.
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    // Abre automaticamente se a tela for muito grande, recolhe se for menor
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsSidebarExpanded(true);
      } else {
        setIsSidebarExpanded(false);
      }
    };
    
    // Set initial
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  return (
    <div className="flex w-full min-h-screen relative">
      {/* Sidebar - Oculta no mobile (md:hidden gerido internamente ou podemos forçar com classes css) */}
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 w-full ${
          isSidebarExpanded ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
