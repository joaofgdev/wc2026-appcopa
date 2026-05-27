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
    <div 
      className="min-h-screen w-full flex flex-col md:grid transition-all duration-300"
      style={{
        gridTemplateColumns: isSidebarExpanded ? "220px 1fr" : "76px 1fr",
      }}
    >
      {/* Sidebar - Oculta no mobile */}
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen w-full overflow-hidden">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
