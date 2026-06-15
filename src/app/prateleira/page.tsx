"use client";

import { useState, useEffect } from "react";
import BackButton from "@/components/BackButton";
import { DndContext, DragEndEvent, DragOverlay, closestCorners, useDroppable } from "@dnd-kit/core";
import { TierRow } from "@/components/tierlist/TierRow";
import { DraggableFlag } from "@/components/tierlist/DraggableFlag";
import { TeamItem, TierListState } from "@/types/tierlist";
import { COUNTRY_TRANSLATIONS } from "@/lib/api";

// Extrair todas as seleções que possuem imagem (iso2)
const allTeams: TeamItem[] = Object.values(COUNTRY_TRANSLATIONS)
  .filter(t => t.iso2 && !t.iso2.includes("gb-")) // Ignorar bandeiras do reino unido específicas caso falhem, mas flagcdn suporta gb-eng
  .map(t => ({
    id: t.code,
    iso2: t.iso2,
    name: t.name,
  }))
  // Remover duplicatas de código por segurança
  .filter((team, index, self) => index === self.findIndex((t) => t.id === team.id))
  // Ordenar alfabeticamente para facilitar a busca
  .sort((a, b) => a.name.localeCompare(b.name));

const initialTiers: TierListState = {
  unranked: allTeams,
  tier1: [],
  tier2: [],
  tier3: [],
  tier4: [],
};

function UnrankedArea({ items, onFlagClick }: { items: TeamItem[], onFlagClick: (team: TeamItem) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: "unranked" });
  
  return (
    <div 
      ref={setNodeRef}
      className={`p-4 sm:p-6 min-h-[160px] max-h-[35vh] overflow-y-auto bg-slate-800/30 rounded-xl border-2 border-dashed transition-all flex flex-wrap gap-2 sm:gap-4 items-center justify-center ${
        isOver ? 'border-primary bg-slate-800/50 scale-[1.01]' : 'border-slate-700/50'
      }`}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span className="text-sm font-medium">Todas as seleções foram classificadas!</span>
        </div>
      ) : (
        items.map(team => <DraggableFlag key={team.id} team={team} onClick={() => onFlagClick(team)} />)
      )}
    </div>
  );
}

export default function TierListPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [tiers, setTiers] = useState<TierListState>(initialTiers);
  const [activeTeam, setActiveTeam] = useState<TeamItem | null>(null);
  const [menuTeam, setMenuTeam] = useState<TeamItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const moveTeamTo = (teamId: string, toContainer: keyof TierListState) => {
    const fromContainer = Object.keys(tiers).find(key => 
      tiers[key as keyof TierListState].some(t => t.id === teamId)
    ) as keyof TierListState | undefined;

    if (!fromContainer || fromContainer === toContainer) {
      setMenuTeam(null);
      return;
    }

    setTiers(prev => {
      const team = prev[fromContainer].find(t => t.id === teamId)!;
      return {
        ...prev,
        [fromContainer]: prev[fromContainer].filter(t => t.id !== teamId),
        [toContainer]: [...prev[toContainer], team],
      };
    });
    setMenuTeam(null);
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const team = active.data.current?.team;
    if (team) setActiveTeam(team);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTeam(null);

    // Se soltar fora de um droppable válido
    if (!over) return;

    const teamId = active.id as string;
    const fromContainer = Object.keys(tiers).find(key => 
      tiers[key as keyof TierListState].some(t => t.id === teamId)
    ) as keyof TierListState | undefined;
    
    const toContainer = over.id as keyof TierListState;

    if (!fromContainer || fromContainer === toContainer) return;

    // Atualizar o estado movendo a seleção de uma array para a outra
    setTiers(prev => {
      const team = prev[fromContainer].find(t => t.id === teamId)!;
      return {
        ...prev,
        [fromContainer]: prev[fromContainer].filter(t => t.id !== teamId),
        [toContainer]: [...prev[toContainer], team],
      };
    });
  };

  const confirmReset = () => {
    setTiers(initialTiers);
    setShowClearConfirm(false);
  };

  if (!isMounted) return null;

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-8 pt-6 pb-32 md:pb-8 flex flex-col gap-6 min-h-screen">
      <div className="pt-2">
        <BackButton />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(137,101,255,0.15)",
              border: "1px solid rgba(137,101,255,0.3)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "30px",
                color: "#A589FF",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              view_kanban
            </span>
          </div>
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#FFFFFF",
                fontFamily: "var(--font-sora), sans-serif",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Prateleira da Seleção
            </h1>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 300,
                color: "#C2BCE0",
                fontFamily: "var(--font-sora), sans-serif",
                marginTop: "3px",
              }}
            >
              Classifique as seleções. Arraste e solte!
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowClearConfirm(true)}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white rounded-lg border border-slate-700 transition flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Limpar Tudo
        </button>
      </div>

      <DndContext 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4 mb-10">
          <TierRow id="tier1" title="Favoritos" colorClass="bg-emerald-400/90" items={tiers.tier1} onFlagClick={setMenuTeam} />
          <TierRow id="tier2" title="Correm por fora" colorClass="bg-blue-400/90" items={tiers.tier2} onFlagClick={setMenuTeam} />
          <TierRow id="tier3" title="Zebras" colorClass="bg-amber-400/90" items={tiers.tier3} onFlagClick={setMenuTeam} />
          <TierRow id="tier4" title="Passeio" colorClass="bg-rose-400/90" items={tiers.tier4} onFlagClick={setMenuTeam} />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-4">Seleções</h2>
          <UnrankedArea items={tiers.unranked} onFlagClick={setMenuTeam} />
        </div>

        {/* Overlay do elemento sendo arrastado para feedback visual */}
        <DragOverlay>
          {activeTeam ? (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-4 border-primary shadow-2xl opacity-90 cursor-grabbing rotate-6">
              <img 
                src={`https://flagcdn.com/${activeTeam.iso2}.svg`} 
                alt={activeTeam.name}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Tap-to-Move Menu / Bottom Sheet */}
      {menuTeam && (
        <div 
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setMenuTeam(null)}
        >
          <div 
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl pb-safe"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slide-up 0.3s ease-out' }}
          >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
              <div className="flex items-center gap-3">
                <img src={`https://flagcdn.com/${menuTeam.iso2}.svg`} alt={menuTeam.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm" />
                <h3 className="text-white font-bold text-lg">{menuTeam.name}</h3>
              </div>
              <button onClick={() => setMenuTeam(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2 bg-slate-900">
              <button onClick={() => moveTeamTo(menuTeam.id, "tier1")} className="w-full py-3 px-4 rounded-xl font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20 active:scale-[0.98] transition-all text-left flex justify-between items-center">
                <span>Favoritos</span>
                <span className="material-symbols-outlined text-sm opacity-50">arrow_forward_ios</span>
              </button>
              <button onClick={() => moveTeamTo(menuTeam.id, "tier2")} className="w-full py-3 px-4 rounded-xl font-bold bg-blue-400/10 text-blue-400 border border-blue-400/20 hover:bg-blue-400/20 active:scale-[0.98] transition-all text-left flex justify-between items-center">
                <span>Correm por fora</span>
                <span className="material-symbols-outlined text-sm opacity-50">arrow_forward_ios</span>
              </button>
              <button onClick={() => moveTeamTo(menuTeam.id, "tier3")} className="w-full py-3 px-4 rounded-xl font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 hover:bg-amber-400/20 active:scale-[0.98] transition-all text-left flex justify-between items-center">
                <span>Zebras</span>
                <span className="material-symbols-outlined text-sm opacity-50">arrow_forward_ios</span>
              </button>
              <button onClick={() => moveTeamTo(menuTeam.id, "tier4")} className="w-full py-3 px-4 rounded-xl font-bold bg-rose-400/10 text-rose-400 border border-rose-400/20 hover:bg-rose-400/20 active:scale-[0.98] transition-all text-left flex justify-between items-center">
                <span>Passeio</span>
                <span className="material-symbols-outlined text-sm opacity-50">arrow_forward_ios</span>
              </button>
              <div className="h-[1px] bg-slate-800 my-2"></div>
              <button onClick={() => moveTeamTo(menuTeam.id, "unranked")} className="w-full py-3 px-4 rounded-xl font-bold bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 active:scale-[0.98] transition-all text-left flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>undo</span>
                Remover da Prateleira
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Clear Modal */}
      {showClearConfirm && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowClearConfirm(false)}
        >
          <div 
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'scale-up 0.2s ease-out' }}
          >
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>warning</span>
              </div>
              <h3 className="text-xl font-bold text-white">Limpar Prateleira?</h3>
              <p className="text-slate-400 text-sm">
                Tem certeza que deseja limpar a prateleira? Todas as seleções voltarão para a área inicial.
              </p>
              
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmReset}
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
                >
                  Sim, Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
