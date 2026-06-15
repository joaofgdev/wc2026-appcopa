"use client";
import React, { useState, useMemo } from "react";
import BackButton from "@/components/BackButton";
import { ALL_STICKERS } from "@/lib/albumData";
import { useAlbum } from "@/contexts/AlbumContext";
import StickerCard from "@/components/album/StickerCard";
import PackOpener from "@/components/album/PackOpener";
import { StickerDefinition } from "@/types/album";
import { COUNTRY_TRANSLATIONS } from "@/lib/api";

export default function AlbumPage() {
  const { inventory, lastOpenedAt, isLoading, openPack } = useAlbum();
  const [openingStickers, setOpeningStickers] = useState<StickerDefinition[] | null>(null);
  const [activeTab, setActiveTab] = useState<string>("BRA"); // Começa no Brasil se possível, ou o primeiro
  const [isOpeningPack, setIsOpeningPack] = useState(false);

  const teams = useMemo(() => {
    return Array.from(new Set(ALL_STICKERS.filter(s => s.type !== "stadium").map(s => s.teamCode!)));
  }, []);

  const stadiums = useMemo(() => {
    return ALL_STICKERS.filter(s => s.type === "stadium");
  }, []);

  const handleOpenPack = async () => {
    setIsOpeningPack(true);
    const pulledIds = await openPack();
    setIsOpeningPack(false);
    
    if (pulledIds && pulledIds.length > 0) {
      const pulled = pulledIds.map(id => ALL_STICKERS.find(s => s.id === id)!).filter(Boolean);
      setOpeningStickers(pulled);
    }
  };

  const getTeamName = (code: string) => {
    const t = Object.values(COUNTRY_TRANSLATIONS).find(x => x.code === code);
    return t ? t.name : code;
  };

  const getIso2 = (code: string) => {
    const t = Object.values(COUNTRY_TRANSLATIONS).find(x => x.code === code);
    return t ? t.iso2 : code;
  };

  // Calcular progresso
  const totalStickers = ALL_STICKERS.length;
  const uniqueOwned = ALL_STICKERS.filter(s => inventory[s.id] > 0).length;
  const progressPercent = totalStickers > 0 ? Math.floor((uniqueOwned / totalStickers) * 100) : 0;

  // Tempo para o próximo pacote
  const now = new Date();
  let canOpenPack = true;
  let nextPackHours = 0;
  if (lastOpenedAt) {
    const lastD = new Date(lastOpenedAt);
    const diffHours = (now.getTime() - lastD.getTime()) / (1000 * 60 * 60);
    if (diffHours < 20) {
      canOpenPack = false;
      nextPackHours = Math.ceil(20 - diffHours);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-28 md:pb-12 flex flex-col min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="font-headline-lg text-on-background flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">book</span>
            Álbum Digital
          </h1>
        </div>
        
        {/* Painel do Pacote */}
        <div className="bg-surface-container py-2 px-4 rounded-xl flex items-center gap-4 shadow-sm border border-outline-variant/20">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Pacote Diário</span>
            {canOpenPack ? (
              <span className="text-xs font-bold text-[#65B1A3]">DISPONÍVEL!</span>
            ) : (
              <span className="text-xs font-bold text-slate-500">Volte em {nextPackHours}h</span>
            )}
          </div>
          <button 
            onClick={handleOpenPack}
            disabled={!canOpenPack || isOpeningPack || isLoading}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
              canOpenPack 
                ? "bg-gradient-to-br from-[#1F6663] to-[#65B1A3] text-black shadow-md hover:scale-105" 
                : "bg-surface-variant text-slate-500 cursor-not-allowed"
            }`}
          >
            {isOpeningPack ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined">redeem</span>
            )}
          </button>
        </div>
      </div>

      {/* Progresso Total */}
      <div className="w-full bg-surface-container-low rounded-xl p-4 mb-8 flex flex-col gap-2 border border-outline-variant/20 shadow-sm">
        <div className="flex justify-between items-end">
          <span className="font-body-md text-on-surface-variant font-bold">Progresso da Coleção</span>
          <span className="font-headline-sm text-primary">{uniqueOwned} / {totalStickers} ({progressPercent}%)</span>
        </div>
        <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-[#65B1A3] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Menu de Países (Tabs) */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <button 
          onClick={() => setActiveTab("ESTADIOS")}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-colors border ${
            activeTab === "ESTADIOS" 
              ? "bg-primary text-on-primary border-primary" 
              : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
          }`}
        >
          Estádios
        </button>
        {teams.map(code => (
          <button 
            key={code}
            onClick={() => setActiveTab(code)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 border ${
              activeTab === code 
                ? "bg-primary text-on-primary border-primary" 
                : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
            }`}
          >
            <img src={`https://flagcdn.com/${getIso2(code).toLowerCase()}.svg`} alt={code} className="w-4 h-3 object-cover rounded-sm" />
            {getTeamName(code)}
          </button>
        ))}
      </div>

      {/* Conteúdo da Página (O Livro) */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 border border-outline-variant/20 shadow-elevation-md flex flex-wrap justify-center gap-4 sm:gap-8 min-h-[60vh]">
        {activeTab === "ESTADIOS" && stadiums.map(st => (
          <div key={st.id} className="flex flex-col items-center gap-2">
            <StickerCard sticker={st} isOwned={inventory[st.id] > 0} />
            {inventory[st.id] > 1 && (
              <span className="text-[10px] bg-primary text-on-primary px-2 rounded-full font-bold">x{inventory[st.id]}</span>
            )}
          </div>
        ))}

        {activeTab !== "ESTADIOS" && ALL_STICKERS.filter(s => s.teamCode === activeTab).map(st => (
          <div key={st.id} className="flex flex-col items-center gap-2">
            <StickerCard sticker={st} isOwned={inventory[st.id] > 0} />
            {inventory[st.id] > 1 && (
              <span className="text-[10px] bg-primary text-on-primary px-2 rounded-full font-bold">x{inventory[st.id]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Abertura de Pacotes */}
      {openingStickers && (
        <PackOpener stickers={openingStickers} onClose={() => setOpeningStickers(null)} />
      )}
      
    </main>
  );
}
