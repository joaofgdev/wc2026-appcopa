import React from "react";
import { PredictorPicks } from "./PredictorContext";
import { Bracket } from "./PredictorLogic";
import { translateTeam } from "@/lib/api";

interface ExportLayoutProps {
  picks: PredictorPicks;
  bracket: Bracket;
  userName: string;
  teamsByGroup: Record<string, string[]>;
}

export const ExportLayout = React.forwardRef<HTMLDivElement, ExportLayoutProps>(({ picks, bracket, userName, teamsByGroup }, ref) => {
  const groupsArray = Object.keys(teamsByGroup).sort();
  const leftGroups = groupsArray.slice(0, 6);
  const rightGroups = groupsArray.slice(6, 12);

  // Helper para renderizar time
  const renderTeam = (teamName: string | null, isWinner: boolean = false) => {
    return (
      <div className={`px-2 py-1 flex items-center h-8 text-[11px] font-medium rounded truncate border ${isWinner ? 'bg-[#FFD700]/20 border-[#FFD700]/50 text-white font-bold' : 'bg-black/50 border-white/10 text-white/90'}`}>
        {teamName ? translateTeam(teamName).name : 'A definir'}
      </div>
    );
  };

  const renderMatch = (matchId: string) => {
    const match = bracket[matchId];
    if (!match) return null;
    return (
      <div className="flex flex-col gap-0.5 w-[110px]">
        {renderTeam(match.team1, match.winner === match.team1 && match.winner !== null)}
        {renderTeam(match.team2, match.winner === match.team2 && match.winner !== null)}
      </div>
    );
  };

  // Helper para Grupo
  const renderGroup = (groupName: string) => {
    const teams = teamsByGroup[groupName];
    const groupPicks = picks.groups[groupName] || { 1: null, 2: null, 3: null };
    return (
      <div key={groupName} className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-2 flex flex-col gap-1 w-[140px]">
        <h4 className="text-white/80 text-[10px] font-bold text-center uppercase mb-1">
          {groupName.replace('Group ', 'Grupo ')}
        </h4>
        <div className="flex flex-col gap-1">
          {[1, 2, 3].map(pos => {
            const team = groupPicks[pos as 1|2|3];
            const colors = { 1: 'text-[#FFD700]', 2: 'text-[#C0C0C0]', 3: 'text-[#CD7F32]' };
            return (
              <div key={pos} className="flex items-center gap-1.5 text-[10px]">
                <span className={`font-bold ${colors[pos as 1|2|3]}`}>{pos}º</span>
                <span className="text-white truncate">{team ? translateTeam(team).name : '-'}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center bg-[#0a192f] overflow-hidden"
      style={{
        width: 1920,
        height: 1080,
        backgroundImage: 'url(/stadium.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'var(--font-sora), sans-serif'
      }}
    >
      {/* Overlay escuro para garantir leitura */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Header com Logo e Nome */}
      <div className="absolute top-8 left-12 flex items-center gap-4 z-10">
        <h1 className="font-bold text-5xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe] drop-shadow-[0_0_10px_rgba(0,242,254,0.5)]">
          WC2026
        </h1>
        <div className="h-10 w-[2px] bg-white/20"></div>
        <div className="flex flex-col">
          <span className="text-white/70 text-sm uppercase tracking-widest font-semibold">Bolão Oficial de</span>
          <span className="text-white text-2xl font-bold">{userName}</span>
        </div>
      </div>

      {/* Estrutura Principal */}
      <div className="relative z-10 flex w-full h-full px-8 pt-28 pb-8 justify-between">
        
        {/* LADO ESQUERDO */}
        <div className="flex h-full gap-4">
          {/* Grupos Esquerda */}
          <div className="flex flex-col justify-between h-full py-4">
            {leftGroups.map(g => renderGroup(g))}
          </div>

          {/* Chaveamento Esquerda */}
          <div className="flex h-full gap-4 ml-8">
            {/* 16 Avos - Esquerda */}
            <div className="flex flex-col justify-around h-full py-2">
              {Array.from({length: 8}, (_, i) => `R32_${i+1}`).map(id => (
                <div key={id}>{renderMatch(id)}</div>
              ))}
            </div>
            
            {/* Oitavas - Esquerda */}
            <div className="flex flex-col justify-around h-full py-8">
              {Array.from({length: 4}, (_, i) => `R16_${i+1}`).map(id => (
                <div key={id}>{renderMatch(id)}</div>
              ))}
            </div>

            {/* Quartas - Esquerda */}
            <div className="flex flex-col justify-around h-full py-24">
              {Array.from({length: 2}, (_, i) => `QF_${i+1}`).map(id => (
                <div key={id}>{renderMatch(id)}</div>
              ))}
            </div>

            {/* Semi - Esquerda */}
            <div className="flex flex-col justify-around h-full py-48">
              {Array.from({length: 1}, (_, i) => `SF_${i+1}`).map(id => (
                <div key={id}>{renderMatch(id)}</div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTRO - FINAL */}
        <div className="flex flex-col items-center justify-center mx-4 pb-16">
          <div className="flex flex-col items-center">
            <span className="text-[#FFD700] text-3xl material-symbols-outlined mb-2 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">trophy</span>
            <h2 className="text-white font-bold text-2xl tracking-widest uppercase mb-6 drop-shadow-lg">A Grande Final</h2>
            
            <div className="bg-white/10 backdrop-blur-md border-2 border-[#FFD700]/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.2)] transform scale-75">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center w-[140px] text-center">
                   <div className="h-16 flex items-center justify-center font-bold text-white text-lg drop-shadow-md">
                     {bracket['FINAL']?.team1 ? translateTeam(bracket['FINAL'].team1).name : 'A definir'}
                   </div>
                </div>
                
                <span className="text-white/50 font-bold text-xl italic">VS</span>
                
                <div className="flex flex-col items-center w-[140px] text-center">
                   <div className="h-16 flex items-center justify-center font-bold text-white text-lg drop-shadow-md">
                     {bracket['FINAL']?.team2 ? translateTeam(bracket['FINAL'].team2).name : 'A definir'}
                   </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col items-center">
                <div className="text-[#FFD700] text-xs uppercase font-bold tracking-widest mb-2">Campeão Mundial</div>
                <div className="bg-[#FFD700] text-black px-6 py-2 rounded-lg font-bold text-xl min-w-[200px] text-center shadow-lg">
                  {bracket['FINAL']?.winner ? translateTeam(bracket['FINAL'].winner).name : '???'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="flex h-full gap-4 flex-row-reverse">
          {/* Grupos Direita */}
          <div className="flex flex-col justify-between h-full py-4">
            {rightGroups.map(g => renderGroup(g))}
          </div>

          {/* Chaveamento Direita */}
          <div className="flex h-full gap-4 mr-8 flex-row-reverse text-right">
            {/* 16 Avos - Direita */}
            <div className="flex flex-col justify-around h-full py-2">
              {Array.from({length: 8}, (_, i) => `R32_${i+9}`).map(id => (
                <div key={id}>{renderMatch(id)}</div>
              ))}
            </div>
            
            {/* Oitavas - Direita */}
            <div className="flex flex-col justify-around h-full py-8">
              {Array.from({length: 4}, (_, i) => `R16_${i+5}`).map(id => (
                <div key={id}>{renderMatch(id)}</div>
              ))}
            </div>

            {/* Quartas - Direita */}
            <div className="flex flex-col justify-around h-full py-24">
              {Array.from({length: 2}, (_, i) => `QF_${i+3}`).map(id => (
                <div key={id}>{renderMatch(id)}</div>
              ))}
            </div>

            {/* Semi - Direita */}
            <div className="flex flex-col justify-around h-full py-48">
              {Array.from({length: 1}, (_, i) => `SF_${i+2}`).map(id => (
                <div key={id}>{renderMatch(id)}</div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

ExportLayout.displayName = 'ExportLayout';
