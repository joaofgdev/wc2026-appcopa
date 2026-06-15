"use client";
import React from "react";
import { StickerDefinition } from "@/types/album";

interface StickerCardProps {
  sticker: StickerDefinition;
  isOwned?: boolean;
  isFlipped?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function StickerCard({ sticker, isOwned = true, isFlipped = false, onClick, className = "" }: StickerCardProps) {
  // Cores da borda por raridade
  const borderColors = {
    common: "border-slate-400 bg-slate-200",
    rare: "border-blue-500 bg-blue-100",
    epic: "border-purple-500 bg-purple-100",
    legendary: "border-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-300"
  };

  // Se não tem, mostra silhueta escura
  if (!isOwned) {
    return (
      <div className={`w-24 h-32 sm:w-32 sm:h-44 rounded-xl border-2 border-dashed border-slate-600/30 bg-slate-800/20 flex flex-col items-center justify-center relative overflow-hidden ${className}`}>
        <span className="text-[40px] opacity-10 font-bold">{sticker.playerNumber || "?"}</span>
      </div>
    );
  }

  // Verso da carta (pacotinho fechado)
  if (isFlipped) {
    return (
      <div 
        onClick={onClick}
        className={`w-24 h-32 sm:w-32 sm:h-44 rounded-xl border-2 border-[#1F6663] cursor-pointer shadow-lg transform transition-transform hover:scale-105 ${className}`}
        style={{
          background: "linear-gradient(135deg, #1B3538 0%, #051418 60%, #1F6663 100%)",
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[#65B1A3] text-4xl">emoji_events</span>
        </div>
      </div>
    );
  }

  // Carta revelada
  return (
    <div 
      onClick={onClick}
      className={`relative w-24 h-32 sm:w-32 sm:h-44 rounded-xl border-[3px] overflow-hidden shadow-md flex flex-col items-center p-1.5 ${borderColors[sticker.rarity]} ${className}`}
    >
      {/* Foil Effect for Legendary/Epic */}
      {(sticker.rarity === "legendary" || sticker.rarity === "epic") && (
        <div className="absolute inset-0 pointer-events-none z-20" style={{
          background: "linear-gradient(125deg, transparent 20%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0) 60%)",
          mixBlendMode: "overlay",
          animation: "shimmer 3s infinite linear"
        }}></div>
      )}

      {/* Tipo Flag */}
      {sticker.type === "flag" && (
        <div className="w-full h-full relative rounded-lg overflow-hidden border border-black/10">
          <img src={`https://flagcdn.com/${sticker.iso2?.toLowerCase()}.svg`} alt="Bandeira" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 w-full bg-black/60 text-white text-[8px] sm:text-[10px] font-bold text-center py-1 uppercase tracking-widest backdrop-blur-sm">
            {sticker.teamCode}
          </div>
        </div>
      )}

      {/* Tipo Player */}
      {sticker.type === "player" && (
        <div className="w-full h-full flex flex-col items-center justify-between py-1">
          <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
              <defs>
                <pattern id={`flag-${sticker.id}`} patternUnits="objectBoundingBox" width="1" height="1">
                  <image href={`https://flagcdn.com/${sticker.iso2?.toLowerCase()}.svg`} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <path 
                d="M19.528 5.617C18.665 4.887 18 4.2 16.5 3.5 15 2.8 13.5 2 12 2s-3 .8-4.5 1.5C6 4.2 5.335 4.887 4.472 5.617 3.655 6.307 2 8.35 2 9.5c0 1 .5 2 1 2.5s2 .5 2.5 0L6 11.5V21c0 1 .5 1.5 1.5 1.5h9c1 0 1.5-.5 1.5-1.5v-9.5l.5.5c.5.5 2 .5 2.5 0s1-1.5 1-2.5c0-1.15-1.655-3.193-2.472-3.883z" 
                fill={`url(#flag-${sticker.id})`}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="0.5"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pt-2">
              <span className="text-[14px] sm:text-[18px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {sticker.playerNumber}
              </span>
            </div>
          </div>
          <div className="w-full text-center">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-800 uppercase block truncate">
              {sticker.playerName}
            </span>
            <span className="text-[7px] sm:text-[8px] font-semibold text-slate-500 uppercase">
              {sticker.teamCode}
            </span>
          </div>
        </div>
      )}

      {/* Tipo Stadium */}
      {sticker.type === "stadium" && (
        <div className="w-full h-full relative rounded-lg overflow-hidden border border-black/10 bg-slate-900 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[40px] text-white/50 mb-2">stadium</span>
          <div className="absolute bottom-0 w-full bg-black/80 text-white text-[8px] sm:text-[10px] font-bold text-center py-1 leading-tight px-1 backdrop-blur-sm">
            {sticker.playerName}
          </div>
        </div>
      )}

      {/* Selo de Raridade */}
      {sticker.rarity !== "common" && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border border-black/20 flex items-center justify-center text-[10px] font-black text-white drop-shadow-md z-30" style={{
          backgroundColor: sticker.rarity === "legendary" ? "#FBBF24" : sticker.rarity === "epic" ? "#A855F7" : "#3B82F6"
        }}>
          ★
        </div>
      )}
    </div>
  );
}
