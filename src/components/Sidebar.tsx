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
    { href: "/", icon: "home", label: "Início" },
    { href: "/bracket", icon: "emoji_events", label: "Tabela" },
    { href: "/explore", icon: "explore", label: "Explorar" },
    { href: "/news", icon: "newspaper", label: "Notícias" },
  ];

  return (
    <aside
      className="sticky left-0 top-0 h-screen transition-all duration-300 z-50 flex flex-col w-full hidden md:flex"
      style={{
        background: "rgba(17,15,20,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(101,177,163,0.12)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header — Logo + Hamburger */}
      <div
        className={`h-24 flex items-center transition-all duration-300 ${
          isExpanded ? "justify-between px-4" : "flex-col justify-center gap-2 py-1 px-1"
        }`}
        style={{ borderBottom: "1px solid rgba(101,177,163,0.08)" }}
      >
        <div 
          className="flex items-center justify-center relative transition-all duration-300"
          style={{ width: isExpanded ? "140px" : "40px", height: "48px" }}
        >
          {/* Logo Expanded */}
          <img 
            src="/logo/logo.svg" 
            alt="WC2026" 
            className={`absolute left-0 h-12 w-auto object-contain transition-all duration-400 ease-in-out origin-left ${
              isExpanded ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 -translate-x-4 pointer-events-none"
            }`} 
          />
          {/* Icon Collapsed */}
          <img 
            src="/logo/icone.svg" 
            alt="WC2026" 
            className={`absolute h-10 w-auto object-contain transition-all duration-400 ease-in-out ${
              !isExpanded ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-12 pointer-events-none"
            }`} 
          />
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-xl transition-colors"
          style={{
            color: "#A8C5C2",
            background: "rgba(101,177,163,0.06)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
            menu
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200`}
              style={{
                background: isActive
                  ? "rgba(101,177,163,0.12)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(101,177,163,0.2)"
                  : "1px solid transparent",
                color: isActive ? "#65B1A3" : "#A8C5C2",
              }}
            >
              <span
                className="material-symbols-outlined shrink-0"
                style={{
                  fontSize: "22px",
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  transition: "font-variation-settings 0.2s",
                }}
              >
                {item.icon}
              </span>
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 hidden"
                }`}
                style={{
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: "var(--font-sora), sans-serif",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Brasil */}
        <Link
          href="/brazil"
          className="flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200"
          style={{
            background: pathname === "/brazil" ? "rgba(101,177,163,0.12)" : "transparent",
            border: pathname === "/brazil" ? "1px solid rgba(101,177,163,0.2)" : "1px solid transparent",
            color: pathname === "/brazil" ? "#65B1A3" : "#A8C5C2",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="0"
            className="shrink-0"
          >
            <rect
              width="22"
              height="16"
              x="1"
              y="4"
              rx="2"
              fill={pathname === "/brazil" ? "#00C752" : "#4A6B68"}
            />
            <polygon
              points="12 6 20 12 12 18 4 12"
              fill={pathname === "/brazil" ? "#FFE500" : "#2A4542"}
            />
            <circle cx="12" cy="12" r="3" fill={pathname === "/brazil" ? "#2F4EFE" : "#1B3538"} />
          </svg>
          <span
            className={`whitespace-nowrap transition-all duration-300 ${
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 hidden"
            }`}
            style={{
              fontSize: "14px",
              fontWeight: pathname === "/brazil" ? 600 : 400,
              fontFamily: "var(--font-sora), sans-serif",
            }}
          >
            Brasil
          </span>
        </Link>
      </nav>

      {/* User Profile Bottom */}
      <div
        className="p-4"
        style={{ borderTop: "1px solid rgba(101,177,163,0.08)" }}
      >
        <button
          onClick={openModal}
          className={`flex items-center w-full gap-3 p-2 rounded-xl transition-colors ${
            !isExpanded ? "justify-center" : ""
          }`}
          style={{ background: "rgba(101,177,163,0.06)" }}
        >
          <img
            src={avatarPath}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover shrink-0"
            style={{ border: "2px solid rgba(101,177,163,0.3)" }}
          />
          <div
            className={`flex flex-col items-start overflow-hidden transition-all duration-300 ${
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
            }`}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#FFFFFF",
                fontFamily: "var(--font-sora), sans-serif",
                maxWidth: "140px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName || "Configurar"}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "#A8C5C2",
                fontFamily: "var(--font-sora), sans-serif",
              }}
            >
              Meu Perfil
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}
