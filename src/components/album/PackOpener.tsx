"use client";
import React, { useState, useEffect } from "react";
import StickerCard from "./StickerCard";
import { StickerDefinition } from "@/types/album";

interface PackOpenerProps {
  stickers: StickerDefinition[];
  onClose: () => void;
}

export default function PackOpener({ stickers, onClose }: PackOpenerProps) {
  const [phase, setPhase] = useState<"pack" | "opening" | "cards">("pack");
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false, false]);

  const handleOpenPack = () => {
    setPhase("opening");
    setTimeout(() => {
      setPhase("cards");
    }, 1500); // tempo tremendo o pacote
  };

  const revealCard = (index: number) => {
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
  };

  const allRevealed = revealed.every(r => r === true);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4" style={{ background: "rgba(5,20,24,0.95)", backdropFilter: "blur(10px)" }}>
      
      {/* Botão de Fechar */}
      {phase === "cards" && allRevealed && (
        <button 
          onClick={onClose}
          className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-50"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}

      {/* Fase 1: Pacote Fechado */}
      {phase === "pack" && (
        <div 
          onClick={handleOpenPack}
          className="w-48 h-64 rounded-xl border border-white/20 cursor-pointer shadow-2xl flex flex-col items-center justify-center text-white transform hover:scale-105 transition-transform"
          style={{ background: "linear-gradient(135deg, #1B3538, #1F6663)" }}
        >
          <span className="material-symbols-outlined text-6xl text-[#65B1A3] mb-4">redeem</span>
          <h2 className="font-headline-sm text-center">Pacote Oficial<br/>FIFA 2026</h2>
          <p className="text-[10px] text-white/50 mt-4 uppercase tracking-widest text-center px-4">Toque para rasgar</p>
        </div>
      )}

      {/* Fase 2: Animação Abrindo */}
      {phase === "opening" && (
        <div 
          className="w-48 h-64 rounded-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center text-white animate-shake"
          style={{ 
            background: "linear-gradient(135deg, #1B3538, #1F6663)",
            animation: "shake 0.2s cubic-bezier(.36,.07,.19,.97) both infinite" 
          }}
        >
          <span className="material-symbols-outlined text-6xl text-white mb-4 animate-pulse">redeem</span>
        </div>
      )}

      {/* Fase 3: Revelando Cartas */}
      {phase === "cards" && (
        <div className="w-full max-w-4xl flex flex-wrap justify-center gap-4 animate-fade-in-up">
          <h2 className="w-full text-center text-white font-headline-md mb-8">
            {allRevealed ? "Essas foram suas figurinhas!" : "Toque nas figurinhas para revelar"}
          </h2>
          {stickers.map((st, i) => (
            <div key={i} className="perspective-1000">
              <div 
                className={`transition-transform duration-700 transform-style-3d ${revealed[i] ? "rotate-y-180" : ""}`}
              >
                {!revealed[i] ? (
                  // Verso
                  <StickerCard sticker={st} isFlipped={true} onClick={() => revealCard(i)} />
                ) : (
                  // Frente (Precisa envolver num container se rotacionar, mas o react cuidou recriando)
                  <StickerCard sticker={st} isOwned={true} onClick={() => {}} className="animate-pop-in" />
                )}
              </div>
            </div>
          ))}
          
          {allRevealed && (
            <div className="w-full flex justify-center mt-12">
              <button 
                onClick={onClose}
                className="px-8 py-4 bg-gradient-to-r from-[#1F6663] to-[#65B1A3] text-black font-bold rounded-full hover:brightness-110 transition-all text-lg shadow-lg"
              >
                Colar no Álbum
              </button>
            </div>
          )}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          10%, 90% { transform: translate3d(-2px, 0, 0); }
          20%, 80% { transform: translate3d(4px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
          40%, 60% { transform: translate3d(6px, 0, 0); }
        }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}} />
    </div>
  );
}
