"use client";

import React from "react";
import { useUser } from "@/contexts/UserContext";

export default function Header() {
  const { userName, avatarId, openModal } = useUser();

  const avatarPath = avatarId ? `/avatars/${avatarId}.png` : "/avatars/eagle.png";

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl dark:bg-surface-container/60 border-b border-outline-variant/30 shadow-[0_0_15px_rgba(204,189,255,0.3)] flex items-center justify-between px-margin-mobile h-16">
      <div className="flex-1"></div>
      
      <h1 className="font-headline-sm text-headline-sm-mobile tracking-tight font-display-lg-mobile text-display-lg-mobile text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-center flex-1">
        WC2026
      </h1>
      
      <div className="flex-1 flex justify-end">
        <button 
          onClick={openModal}
          className="flex items-center gap-2 hover:bg-surface-variant/40 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-outline-variant/50"
        >
          <img 
            src={avatarPath} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full object-cover bg-surface-variant border border-outline/50"
          />
          {userName && <span className="text-sm font-label-caps hidden sm:block truncate max-w-[100px]">{userName}</span>}
        </button>
      </div>
    </header>
  );
}
