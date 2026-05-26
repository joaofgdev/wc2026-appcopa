"use client";

import React, { useMemo, useState } from "react";
import { usePredictor } from "./PredictorContext";
import PredictorMatch from "@/components/PredictorMatch";
import { calculateGroupStandings, getAdvancingTeams, Match } from "./PredictorLogic";

export default function PredictorView({ matches }: { matches: Match[] }) {
  const { picks, updatePick, savePicks, isSaving, userName, setUserName } = usePredictor();
  const [nameInput, setNameInput] = useState(userName || "");

  const groupMatches = useMemo(() => matches.filter(m => m.round === "Group Stage"), [matches]);
  
  // Calculate Groups
  const standings = useMemo(() => calculateGroupStandings(groupMatches, picks), [groupMatches, picks]);
  const { top2, best8Thirds } = useMemo(() => getAdvancingTeams(standings), [standings]);

  // Handle Name
  const handleSaveName = () => {
    if (nameInput.trim()) setUserName(nameInput.trim());
  };

  if (!userName) {
    return (
      <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-8 flex flex-col items-center gap-4 text-center">
        <h3 className="font-headline-sm">Bem-vindo ao Bolão!</h3>
        <p className="text-on-surface-variant font-body-md">Como quer ser chamado?</p>
        <input 
          type="text" 
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          placeholder="Seu nome ou apelido"
          className="w-full max-w-sm px-4 py-2 rounded-lg bg-surface-variant border border-outline/50 focus:border-primary outline-none"
        />
        <button onClick={handleSaveName} className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-caps mt-2 hover:bg-primary/90">
          Entrar no Bolão
        </button>
      </div>
    );
  }

  // Organizar jogos por grupo
  const groupsArray = Object.keys(standings).sort();

  return (
    <div className="flex flex-col gap-12">
      
      {/* Botão de Salvar Flutuante */}
      <div className="fixed bottom-24 md:bottom-12 right-6 z-50">
        <button 
          onClick={savePicks} 
          disabled={isSaving}
          className="bg-primary text-on-primary shadow-elevation-lg px-6 py-4 rounded-full font-label-caps flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined">{isSaving ? "sync" : "save"}</span>
          {isSaving ? "Salvando..." : "Salvar Meu Bolão"}
        </button>
      </div>

      <div className="flex justify-between items-center bg-surface-container p-4 rounded-xl">
        <span className="font-body-md text-on-surface-variant">Jogando como: <b className="text-primary">{userName}</b></span>
        <button onClick={() => setUserName("")} className="text-sm underline text-on-surface-variant">Trocar</button>
      </div>

      <section>
        <h3 className="font-headline-md mb-6">Fase de Grupos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupsArray.map(group => (
            <div key={group} className="flex flex-col gap-4">
              <h4 className="font-label-caps text-on-surface-variant bg-surface-variant/30 px-3 py-1 rounded-md w-max">
                Grupo {group}
              </h4>
              <div className="flex flex-col gap-2">
                {groupMatches.filter(m => m.group_name === group).map(m => (
                  <PredictorMatch 
                    key={m.id}
                    matchId={m.id}
                    homeTeam={m.home_team_name}
                    awayTeam={m.away_team_name}
                    homeScore={picks[m.id]?.homeScore}
                    awayScore={picks[m.id]?.awayScore}
                    onUpdatePick={updatePick}
                  />
                ))}
              </div>
              <div className="text-xs text-on-surface-variant/80 p-2 bg-surface-container-low rounded border border-outline-variant/20 mt-2">
                <b>Classificados agora:</b>
                {standings[group] && standings[group].slice(0, 2).map((s, i) => (
                  <div key={s.teamName}>{i + 1}º {s.teamName} - {s.points}pts</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <h3 className="font-headline-md mb-6 text-tertiary">Mata-Mata Promessa (Round of 32)</h3>
        <p className="text-sm text-on-surface-variant mb-6">Conforme você preenche a fase de grupos, os times aparecem aqui (Lógica simplificada de 32 times).</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xl">
            <h4 className="font-label-caps text-xs mb-3 opacity-70">Top 2 (Exemplos)</h4>
            {top2.slice(0,8).map(t => (
              <div key={t.teamName} className="text-sm py-1 border-b border-outline-variant/10">{t.teamName} ({t.points} pts)</div>
            ))}
          </div>
          <div className="p-4 bg-surface-container border border-outline-variant/30 rounded-xl">
             <h4 className="font-label-caps text-xs mb-3 opacity-70">Melhores 3º</h4>
            {best8Thirds.map((t, i) => (
              <div key={t.teamName} className="text-sm py-1 border-b border-outline-variant/10">{i+1}º {t.teamName} ({t.group})</div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
