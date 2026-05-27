"use client";

import React from "react";
import { useUser } from "@/contexts/UserContext";

export default function Header() {
  const { userName, avatarId, openModal } = useUser();
  const avatarPath = avatarId ? `/avatars/${avatarId}.png` : "/avatars/eagle.png";

  return (
    <header className="w-full px-5 pt-5 pb-3 flex items-center justify-between">
      {/* Esquerda: Saudação */}
      <div className="flex flex-col leading-tight">
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "var(--font-sora), sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          Bem Vindo!!
        </span>
        <span
          style={{
            fontSize: "26px",
            fontWeight: 300,
            color: "#FFFFFF",
            fontFamily: "var(--font-sora), sans-serif",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {userName || "Visitante"}
        </span>
      </div>

      {/* Direita: Logo + Avatar */}
      <div className="flex items-center gap-3">
        {/* Logo WC2|26 com gradiente roxo→teal */}
        <div className="flex items-center gap-0 select-none">
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              fontFamily: "var(--font-sora), sans-serif",
              background: "linear-gradient(135deg, #8B6EF0 0%, #5B9EE8 40%, #65B1A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            WC2
          </span>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              fontFamily: "var(--font-sora), sans-serif",
              background: "linear-gradient(135deg, #5B9EE8 0%, #65B1A3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            |
          </span>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              fontFamily: "var(--font-sora), sans-serif",
              background: "linear-gradient(135deg, #65B1A3 0%, #A8C5C2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            26
          </span>
        </div>

        {/* Avatar */}
        <button
          onClick={openModal}
          className="w-10 h-10 rounded-full overflow-hidden transition-all active:scale-90 hover:scale-105 shrink-0"
          style={{
            background: "rgba(101,177,163,0.15)",
            border: "2px solid rgba(101,177,163,0.3)",
          }}
        >
          <img src={avatarPath} alt="Avatar" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
}
