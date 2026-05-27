"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", icon: "home", label: "home" },
  { href: "/bracket", icon: "emoji_events", label: "tabela" },
  { href: "/explore", icon: "explore", label: "explorar" },
  { href: "/news", icon: "newspaper", label: "notícia" },
  { href: "/brazil", icon: null, label: "brasil", isBrazil: true },
];

export default function BottomNavClient() {
  const pathname = usePathname();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Detecta teclado virtual via visualViewport API
  // Quando o teclado abre, o visualViewport.height diminui significativamente
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    let initialHeight = viewport.height;

    const handleResize = () => {
      // Se a altura visual encolheu mais de 150px, o teclado provavelmente abriu
      const diff = initialHeight - viewport.height;
      setKeyboardOpen(diff > 150);
    };

    // Captura altura inicial depois de um frame para garantir valor correto
    const init = () => {
      initialHeight = viewport.height;
    };
    requestAnimationFrame(init);

    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: "5px",
        left: 0,
        right: 0,
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        paddingLeft: "12px",
        paddingRight: "12px",
        paddingTop: "8px",
        // Quando teclado está aberto: some para fora da tela
        // Quando fechado: fica na posição normal
        transform: keyboardOpen ? "translateY(calc(100% + 20px))" : "translateY(0)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform",
        pointerEvents: keyboardOpen ? "none" : "auto",
      }}
    >
      <nav
        style={{
          background: "#0E0C11",
          borderRadius: "24px",
          border: "1px solid rgba(101,177,163,0.12)",
          boxShadow:
            "0 -2px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "58px",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  flex: 1,
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  position: "relative",
                  textDecoration: "none",
                  WebkitTapHighlightColor: "transparent",
                  transition: "transform 0.15s",
                }}
                onTouchStart={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(0.88)";
                }}
                onTouchEnd={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  setTimeout(() => {
                    if (el) el.style.transform = "scale(1)";
                  }, 120);
                }}
              >
                {/* Ícone */}
                {item.isBrazil ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="0"
                  >
                    <rect
                      width="22"
                      height="16"
                      x="1"
                      y="4"
                      rx="2"
                      fill={isActive ? "#00C752" : "#3A3A3A"}
                    />
                    <polygon
                      points="12 6 20 12 12 18 4 12"
                      fill={isActive ? "#FFE500" : "#252525"}
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      fill={isActive ? "#2F4EFE" : "#1A1A1A"}
                    />
                  </svg>
                ) : (
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      color: isActive ? "#FFFFFF" : "#4A4A4A",
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                      transition: "color 0.2s, font-variation-settings 0.2s",
                      lineHeight: 1,
                    }}
                  >
                    {item.icon}
                  </span>
                )}

                {/* Label */}
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 400,
                    color: isActive ? "#FFFFFF" : "#4A4A4A",
                    letterSpacing: "0.02em",
                    fontFamily: "var(--font-sora), sans-serif",
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
