"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isExpanded, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { userName, avatarId, openModal } = useUser();
  const avatarPath = avatarId ? `/avatars/${avatarId}.png` : "/avatars/eagle.png";

  const navItems = [
    { href: "/", icon: "sports_soccer", label: "Início" },
    { href: "/bracket", icon: "account_tree", label: "Mata-Mata" },
    { href: "/explore", icon: "flag", label: "Explorar" },
    { href: "/news", icon: "article", label: "Notícias" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-surface-container/95 backdrop-blur-xl border-r border-outline-variant/20 shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 z-50 flex flex-col ${
        isExpanded ? "w-64" : "w-20"
      } hidden md:flex`}
    >
      {/* Top Header & Hamburger */}
      <div className={`h-20 flex items-center border-b border-outline-variant/10 transition-all duration-300 ${isExpanded ? "justify-between px-4" : "flex-col justify-center gap-1 py-1 px-1"}`}>
        <div className="flex items-center justify-center transition-all duration-300">
          <h1 className={`font-headline-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${isExpanded ? "text-2xl" : "text-[14px]"}`}>
            WC2026
          </h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-full hover:bg-surface-variant/40 text-on-surface transition-colors shrink-0"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 flex flex-col gap-2 px-3 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface"
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isActive ? "fill" : ""}`}>
                {item.icon}
              </span>
              <span
                className={`font-label-caps whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 hidden"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Brazil Custom Icon Link */}
        <Link
          href="/brazil"
          className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${
            pathname === "/brazil"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" className="shrink-0">
            <rect width="22" height="16" x="1" y="4" rx="2" fill="#00C752" />
            <polygon points="12 6 20 12 12 18 4 12" fill="#FFE500" />
            <circle cx="12" cy="12" r="3" fill="#2F4EFE" />
          </svg>
          <span
            className={`font-label-caps whitespace-nowrap transition-all duration-300 ${
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 hidden"
            }`}
          >
            Brasil
          </span>
        </Link>
      </nav>

      {/* User Profile at Bottom */}
      <div className="p-4 border-t border-outline-variant/10">
        <button
          onClick={openModal}
          className={`flex items-center w-full gap-3 p-2 rounded-xl hover:bg-surface-variant/40 transition-colors border border-transparent hover:border-outline-variant/50 ${
            !isExpanded ? "justify-center" : ""
          }`}
        >
          <img
            src={avatarPath}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover bg-surface-variant border border-outline/50 shrink-0"
          />
          <div
            className={`flex flex-col items-start overflow-hidden transition-all duration-300 ${
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
            }`}
          >
            <span className="text-sm font-label-caps truncate max-w-[140px]">{userName || "Configurar"}</span>
            <span className="text-xs text-on-surface-variant">Meu Perfil</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
