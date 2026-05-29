"use client";

import React, { useMemo, useState } from "react";
import { usePredictor } from "./PredictorContext";
import { buildKnockoutBracket } from "./PredictorLogic";
import { useUser } from "@/contexts/UserContext";
import { translateTeam } from "@/lib/api";

interface MatchBasic {
  id: string;
  round: string;
  group_name: string | null;
  home_team_name: string;
  away_team_name: string;
}

import Link from "next/link";

export default function PredictorView({ matches }: { matches: MatchBasic[] }) {
  const { picks, updateGroupPick, updateBestThirds, updateKnockoutPick, savePicks, deletePicks, isSaving, userName } = usePredictor();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Extrair times por grupo
  const teamsByGroup = useMemo(() => {
    const groups: Record<string, string[]> = {};
    matches.forEach(m => {
      if (m.round === "Group Stage" && m.group_name) {
        if (!groups[m.group_name]) groups[m.group_name] = [];
        if (!groups[m.group_name].includes(m.home_team_name)) groups[m.group_name].push(m.home_team_name);
        if (!groups[m.group_name].includes(m.away_team_name)) groups[m.group_name].push(m.away_team_name);
      }
    });
    return groups;
  }, [matches]);

  const groupsArray = Object.keys(teamsByGroup).sort();

  // Calcular os 3ºs lugares selecionados em todos os grupos
  const allSelectedThirds = useMemo(() => {
    const thirds: string[] = [];
    Object.keys(picks.groups).forEach(g => {
      const thirdPick = picks.groups[g]?.[3];
      if (thirdPick) thirds.push(thirdPick);
    });
    return thirds;
  }, [picks.groups]);

  if (!userName) {
    return (
      <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-8 flex flex-col items-center gap-4 text-center mt-8">
        <span className="material-symbols-outlined text-[48px] text-primary">person_off</span>
        <h3 className="font-headline-sm">Identificação Necessária</h3>
        <p className="text-on-surface-variant font-body-md max-w-sm">
          Para jogar no Bolão e salvar seus palpites, você precisa configurar um Perfil (Nome e Avatar).
        </p>
        <Link 
          href="/profile" 
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-caps mt-4 hover:bg-primary/90 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
          Criar Perfil / Fazer Login
        </Link>
      </div>
    );
  }

  const toggleBestThird = (teamName: string) => {
    let current = [...picks.bestThirds];
    if (current.includes(teamName)) {
      current = current.filter(t => t !== teamName);
    } else {
      if (current.length >= 8) {
        alert("Você só pode escolher os 8 melhores terceiros colocados!");
        return;
      }
      current.push(teamName);
    }
    updateBestThirds(current);
  };

  const bracket = buildKnockoutBracket(picks);

  // Helper para renderizar uma fase do mata-mata
  const renderKnockoutRound = (roundName: string, title: string, matchIds: string[]) => (
    <div className="flex flex-col gap-4 min-w-[200px]">
      <h4 className="font-label-caps text-on-surface-variant text-center mb-2">{title}</h4>
      {matchIds.map(id => {
        const match = bracket[id];
        const t1 = match.team1;
        const t2 = match.team2;
        return (
          <div key={id} className="bg-surface-container border border-outline-variant/30 rounded-lg flex flex-col overflow-hidden text-sm relative shadow-sm">
            <button 
              onClick={() => t1 && updateKnockoutPick(id, t1)}
              className={`p-2 flex justify-between items-center transition-colors ${match.winner === t1 ? 'bg-primary/20 font-bold' : 'hover:bg-surface-variant/50'}`}
              disabled={!t1}
            >
              <span className={t1 ? 'text-on-surface' : 'text-on-surface-variant/50'}>{t1 ? translateTeam(t1).name : 'A definir'}</span>
              {match.winner === t1 && <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>}
            </button>
            <div className="h-[1px] bg-outline-variant/30 w-full" />
            <button 
              onClick={() => t2 && updateKnockoutPick(id, t2)}
              className={`p-2 flex justify-between items-center transition-colors ${match.winner === t2 ? 'bg-primary/20 font-bold' : 'hover:bg-surface-variant/50'}`}
              disabled={!t2}
            >
              <span className={t2 ? 'text-on-surface' : 'text-on-surface-variant/50'}>{t2 ? translateTeam(t2).name : 'A definir'}</span>
              {match.winner === t2 && <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>}
            </button>
          </div>
        )
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-12 relative pb-24">
      
      {/* Menu Flutuante (FAB) */}
      <div className="fixed bottom-24 md:bottom-12 right-6 z-50 flex flex-col items-end gap-3">
        {/* Dropdown Menu Items */}
        <div className={`flex flex-col items-end gap-3 transition-all duration-300 origin-bottom ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
          
          <button 
            onClick={() => { setIsMenuOpen(false); alert("Exportação em breve!"); }} 
            className="bg-surface-variant text-on-surface-variant shadow-elevation-md px-4 py-3 rounded-xl font-label-caps flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px]">ios_share</span>
            Exportar Bolão
          </button>

          <button 
            onClick={() => { setIsMenuOpen(false); setShowDeleteModal(true); }} 
            className="bg-error/10 text-error shadow-elevation-md px-4 py-3 rounded-xl font-label-caps flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap border border-error/20"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
            Excluir Bolão
          </button>

          <button 
            onClick={() => { setIsMenuOpen(false); savePicks(); }} 
            disabled={isSaving}
            className="bg-primary text-on-primary shadow-elevation-md px-4 py-3 rounded-xl font-label-caps flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">{isSaving ? "sync" : "save"}</span>
            {isSaving ? "Salvando..." : "Salvar Bolão"}
          </button>
        </div>

        {/* Main Hamburger FAB */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="bg-primary text-on-primary shadow-elevation-lg w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform hover:brightness-110"
        >
          <span className="material-symbols-outlined text-[28px] transition-transform duration-300" style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* 1. Fase de Grupos */}
      <section>
        <div className="mb-6 flex flex-col gap-2">
          <h3 className="font-headline-md text-on-background">1. Fase de Grupos</h3>
          <p className="text-on-surface-variant text-sm">Escolha o 1º, 2º e 3º colocado de cada grupo.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groupsArray.map(group => {
            const teams = teamsByGroup[group];
            const groupPicks = picks.groups[group] || { 1: null, 2: null, 3: null };
            
            return (
              <div key={group} className="flex flex-col gap-3 bg-surface-container rounded-xl p-4 border border-outline-variant/30">
                <h4 className="font-label-caps text-on-surface-variant bg-surface-variant/30 px-3 py-1 rounded-md w-max">
                  Grupo {group.replace('Group ', '')}
                </h4>
                <div className="flex flex-col gap-2 mt-2">
                  {teams.map(team => {
                    const is1 = groupPicks[1] === team;
                    const is2 = groupPicks[2] === team;
                    const is3 = groupPicks[3] === team;
                    
                    return (
                      <div key={team} className="flex items-center justify-between bg-surface-container-low p-2 rounded-lg text-sm">
                        <span className="truncate mr-2 font-medium">{translateTeam(team).name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button 
                            onClick={() => updateGroupPick(group, 1, is1 ? null : team)}
                            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-colors ${is1 ? 'bg-[#FFD700] text-black' : 'bg-surface-variant text-on-surface-variant hover:bg-outline-variant'}`}
                          >1</button>
                          <button 
                            onClick={() => updateGroupPick(group, 2, is2 ? null : team)}
                            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-colors ${is2 ? 'bg-[#C0C0C0] text-black' : 'bg-surface-variant text-on-surface-variant hover:bg-outline-variant'}`}
                          >2</button>
                          <button 
                            onClick={() => updateGroupPick(group, 3, is3 ? null : team)}
                            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-colors ${is3 ? 'bg-[#CD7F32] text-white' : 'bg-surface-variant text-on-surface-variant hover:bg-outline-variant'}`}
                          >3</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Repescagem */}
      {allSelectedThirds.length > 0 && (
        <section className="bg-surface-container-low p-6 rounded-2xl border border-primary/20">
          <div className="mb-4 flex flex-col gap-2">
            <h3 className="font-headline-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">how_to_reg</span>
              2. Os 8 Melhores Terceiros
            </h3>
            <p className="text-on-surface-variant text-sm">
              Você escolheu {allSelectedThirds.length} times para o 3º lugar, mas apenas <b>8</b> avançam. 
              Selecione os 8 que passarão de fase ({picks.bestThirds.length}/8 selecionados).
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {allSelectedThirds.map(team => {
              const isSelected = picks.bestThirds.includes(team);
              return (
                <button
                  key={team}
                  onClick={() => toggleBestThird(team)}
                  className={`px-4 py-2 rounded-full font-label-lg transition-all border ${
                    isSelected 
                      ? 'bg-primary text-on-primary border-primary shadow-sm scale-105' 
                      : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:border-outline-variant'
                  }`}
                >
                  {translateTeam(team).name}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Mata-Mata */}
      <section>
        <div className="mb-6 flex flex-col gap-2">
          <h3 className="font-headline-md text-on-background flex items-center gap-2">
            <span className="material-symbols-outlined">account_tree</span>
            3. Mata-Mata
          </h3>
          <p className="text-on-surface-variant text-sm">
            Clique no vencedor de cada confronto para avançar na chave. (A chave de 16 avos é preenchida automaticamente com base nas fases anteriores).
          </p>
        </div>

        <div className="overflow-x-auto pb-8 -mx-5 px-5 md:mx-0 md:px-0">
          <div className="flex gap-8 w-max">
            {/* 16 Avos */}
            {renderKnockoutRound("RoundOf32", "16 Avos", Array.from({length: 16}, (_, i) => `R32_${i+1}`))}
            
            {/* Oitavas */}
            <div className="flex flex-col justify-around py-8 min-w-[200px] border-l border-outline-variant/20 pl-8">
               <h4 className="font-label-caps text-on-surface-variant text-center mb-2 -mt-10">Oitavas</h4>
               {Array.from({length: 8}, (_, i) => `R16_${i+1}`).map(id => (
                 <div key={id} className="my-2">
                   {renderKnockoutRound("RoundOf16", "", [id])}
                 </div>
               ))}
            </div>

            {/* Quartas */}
            <div className="flex flex-col justify-around py-16 min-w-[200px] border-l border-outline-variant/20 pl-8">
               <h4 className="font-label-caps text-on-surface-variant text-center mb-2 -mt-10">Quartas</h4>
               {Array.from({length: 4}, (_, i) => `QF_${i+1}`).map(id => (
                 <div key={id} className="my-4">
                   {renderKnockoutRound("QuarterFinals", "", [id])}
                 </div>
               ))}
            </div>

            {/* Semi */}
            <div className="flex flex-col justify-around py-32 min-w-[200px] border-l border-outline-variant/20 pl-8">
               <h4 className="font-label-caps text-on-surface-variant text-center mb-2 -mt-10">Semi</h4>
               {Array.from({length: 2}, (_, i) => `SF_${i+1}`).map(id => (
                 <div key={id} className="my-8">
                   {renderKnockoutRound("SemiFinals", "", [id])}
                 </div>
               ))}
            </div>

            {/* Final */}
            <div className="flex flex-col justify-center min-w-[200px] border-l border-outline-variant/20 pl-8 relative">
               <h4 className="font-label-caps text-on-surface-variant text-center mb-2 absolute top-0 w-full">Final</h4>
               <div className="p-4 bg-tertiary/10 border border-tertiary/30 rounded-xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Campeão</div>
                  {renderKnockoutRound("Final", "", ["FINAL"])}
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-surface-container rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-elevation-lg border border-outline-variant/30 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4 text-error">
              <span className="material-symbols-outlined text-[32px]">delete_forever</span>
            </div>
            <h3 className="font-headline-sm text-on-surface mb-2">Excluir Bolão?</h3>
            <p className="text-on-surface-variant text-sm mb-6">
              Tem certeza que deseja excluir todos os seus palpites? Essa ação não pode ser desfeita e você terá que preencher o bolão novamente.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl font-label-caps bg-surface-variant text-on-surface-variant hover:bg-outline-variant transition-colors"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  await deletePicks();
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-3 rounded-xl font-label-caps bg-error text-onError hover:bg-error/90 transition-colors flex justify-center items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? <span className="material-symbols-outlined animate-spin">sync</span> : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
