"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";
import type { ProcessedMatchDetail, FlashscoreStatPeriod, FlashscoreIncident } from "@/types/football";

// Busca uma stat pelo nome na nova estrutura (array de FlashscoreStatPeriod)
function getStat(stats: FlashscoreStatPeriod[], statName: string | string[], side: "home" | "away"): string {
  if (!stats || !Array.isArray(stats)) return "-";
  const validStats = stats.filter(Boolean);
  if (validStats.length === 0) return "-";

  const matchPeriod = validStats.find((p) => p.period === "Match") || validStats[0];
  if (!matchPeriod || !matchPeriod.stats || !Array.isArray(matchPeriod.stats)) return "-";
  
  const names = Array.isArray(statName) ? statName.map(n => n.toLowerCase()) : [statName.toLowerCase()];
  
  const stat = matchPeriod.stats.find((s) => s && s.statName && names.includes(s.statName.toLowerCase()));
  if (!stat) return "-";
  return side === "home" ? (stat.homeValue || "-") : (stat.awayValue || "-");
}

// Extrai porcentagem numérica de "58%"
function parsePercent(val: string): number {
  const n = parseInt(val.replace("%", ""), 10);
  return isNaN(n) ? 0 : n;
}

// Helpers para interpretar incidents da nova API
function getIncidentTypeName(incident: FlashscoreIncident): string {
  if (Array.isArray(incident.incidentTypeName)) {
    return incident.incidentTypeName[0] || "";
  }
  return incident.incidentTypeName || "";
}

function getIncidentPlayerName(incident: FlashscoreIncident): string {
  if (Array.isArray(incident.incidentPlayerName)) {
    return incident.incidentPlayerName[0] || "";
  }
  return incident.incidentPlayerName || "";
}

function getAssistPlayerName(incident: FlashscoreIncident): string | null {
  if (Array.isArray(incident.incidentTypeName) && Array.isArray(incident.incidentPlayerName)) {
    const assistIdx = incident.incidentTypeName.findIndex((t) => t === "Assistance");
    if (assistIdx >= 0 && incident.incidentPlayerName[assistIdx]) {
      return incident.incidentPlayerName[assistIdx];
    }
  }
  return null;
}

function getTimeElapsed(incident: FlashscoreIncident): string {
  return incident.incidentTime || "";
}

function isGoalIncident(incident: FlashscoreIncident): boolean {
  const typeName = getIncidentTypeName(incident);
  return typeName === "Goal";
}

function isCardIncident(incident: FlashscoreIncident): boolean {
  const typeName = getIncidentTypeName(incident);
  return typeName === "Yellow Card" || typeName === "Red Card";
}

function isYellowCard(incident: FlashscoreIncident): boolean {
  const typeName = getIncidentTypeName(incident);
  return typeName === "Yellow Card";
}

function isHomeTeamIncident(incident: FlashscoreIncident): boolean {
  return incident.incidentSide === "1";
}

export default function MatchView({ match }: { match: ProcessedMatchDetail | null }) {
  const [activeSubTab, setActiveSubTab] = useState<"timeline" | "lineups">("timeline");

  if (!match) {
    return (
      <main className="flex-grow pt-6 pb-28 md:pb-8 px-margin-mobile flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto w-full min-h-screen">
        <div className="absolute top-20 left-margin-mobile md:left-8">
          <BackButton />
        </div>
        <span className="material-symbols-outlined text-[64px] text-outline/40">sports_soccer</span>
        <h2 className="font-headline-sm text-on-surface">Jogo não encontrado</h2>
        <p className="font-body-md text-on-surface-variant text-center">
          Não foi possível carregar os dados deste jogo.
        </p>
      </main>
    );
  }

  // Status helpers
  const isLive = match && ["1H", "2H", "HT", "ET", "P", "BT", "LIVE"].includes(match.status.short);
  const isFinished = match && ["FT", "AET", "PEN"].includes(match.status.short);

  // Estatísticas processadas
  const matchStats = match.statistics || [];
  const homePossession = getStat(matchStats, ["Ball possession", "Ball Possession"], "home");
  const awayPossession = getStat(matchStats, ["Ball possession", "Ball Possession"], "away");
  const homePossNum = parsePercent(homePossession);
  const possessionOffset = 251.2 - (251.2 * homePossNum) / 100;

  return (
    <main className="flex-grow pt-6 pb-28 md:pb-8 px-margin-mobile flex flex-col gap-stack-lg max-w-7xl mx-auto w-full min-h-screen">
      <div>
        <BackButton />
      </div>
      {/* Hero Scoreboard */}
      <section className="relative w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(3,86,255,0.15)] border border-outline-variant/30">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10"></div>
          <img 
            src="/stadium.png" 
            alt="Stadium" 
            className="w-full h-full object-cover blur-[2px] opacity-60" 
          />
        </div>
        
        <div className="relative z-20 flex flex-col items-center justify-center py-10 px-4 w-full">
          {/* Status Chip */}
          <div className={`mb-6 px-4 py-1.5 rounded-full font-label-caps text-xs flex items-center gap-2 backdrop-blur-md ${
            isLive
              ? "bg-tertiary/20 border border-tertiary/50 text-tertiary shadow-[0_0_20px_rgba(0,230,57,0.6)]"
              : isFinished
              ? "bg-surface-variant/50 border border-outline-variant/30 text-on-surface-variant"
              : "bg-primary/20 border border-primary/50 text-primary"
          }`}>
            {isLive && <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>}
            {isLive
              ? (match.status.elapsed ? `${match.status.elapsed}' AO VIVO` : 'AO VIVO')
              : isFinished
              ? "ENCERRADO"
              : new Date(match.date).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </div>
          
          {/* Times & Placar */}
          <div className="flex items-center justify-center w-full max-w-3xl gap-4 md:gap-12">
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-surface-container overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(204,189,255,0.2)] mb-3">
                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="font-headline-sm text-on-background text-center hidden md:block">{match.homeTeam.name}</h2>
              <h2 className="font-headline-sm text-on-background text-center md:hidden">{match.homeTeam.code}</h2>
            </div>
            
            <div className="flex items-center justify-center px-4 md:px-8">
              <span className="font-display-lg-mobile md:font-display-lg text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tighter">
                {match.goalsHome !== null ? match.goalsHome : "-"} - {match.goalsAway !== null ? match.goalsAway : "-"}
              </span>
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-surface-container overflow-hidden border-2 border-secondary-fixed/50 shadow-[0_0_15px_rgba(182,196,255,0.2)] mb-3">
                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="font-headline-sm text-on-background text-center hidden md:block">{match.awayTeam.name}</h2>
              <h2 className="font-headline-sm text-on-background text-center md:hidden">{match.awayTeam.code}</h2>
            </div>
          </div>
          
          {match.venue && (
            <div className="mt-6 text-on-surface-variant font-label-caps text-xs opacity-80">
              {match.venue}
            </div>
          )}
        </div>
      </section>

      {/* Sub-Navigation Tabs */}
      <nav className="w-full border-b border-outline-variant/20 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-center gap-8 min-w-full px-2">
          {(["timeline", "lineups"] as const).map((tab) => {
            const labels = { timeline: "Linha do Tempo", lineups: "Escalações" };
            return (
              <button 
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`pb-3 font-headline-sm text-sm transition-colors border-b-2 ${activeSubTab === tab ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Conteúdo */}
      <div className="w-full">
        
        {/* Eventos e Estatísticas */}
        {activeSubTab === "timeline" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md w-full">
            {/* Eventos / Timeline (Coluna Esquerda) */}
            <div className="md:col-span-8 flex flex-col gap-4">
              <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-outline-variant/30 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="font-label-caps text-xs text-on-surface-variant mb-6 uppercase tracking-wider">Eventos Principais</h3>
                
                {match.events && match.events.length > 0 ? (
                  <div className="relative pl-6 border-l border-outline-variant/40 flex flex-col gap-8">
                    {match.events.map((incident, index) => {
                      const isGoal = isGoalIncident(incident);
                      const isCard = isCardIncident(incident);
                      const isYellow = isYellowCard(incident);
                      const isHome = isHomeTeamIncident(incident);
                      const playerName = getIncidentPlayerName(incident);
                      const assistName = getAssistPlayerName(incident);
                      const typeName = getIncidentTypeName(incident);
                      const timeStr = getTimeElapsed(incident);

                      return (
                        <div className="relative" key={`${incident.incidentTime}-${index}`}>
                          {/* Node */}
                          {isGoal ? (
                            <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(99,50,229,0.5)] ${
                              isHome ? "bg-primary-container text-on-primary-container" : "bg-secondary-container text-on-secondary-container"
                            }`}>
                              <span className="material-symbols-outlined text-[14px]">sports_soccer</span>
                            </div>
                          ) : isCard ? (
                            <div className={`absolute -left-[35px] w-6 h-6 rounded-sm rotate-3 ${
                              isYellow
                                ? "bg-[#FFC107] border border-[#FF8F00] shadow-[0_0_10px_rgba(255,193,7,0.4)]"
                                : "bg-[#F44336] border border-[#D32F2F] shadow-[0_0_10px_rgba(244,67,54,0.4)]"
                            }`}></div>
                          ) : (
                            <div className="absolute -left-[35px] w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center">
                              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">swap_horiz</span>
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex justify-between items-start">
                            <div>
                              <div className={`font-stats-num text-sm mb-1 ${
                                isHome ? "text-primary" : "text-secondary"
                              }`}>
                                {timeStr}
                              </div>
                              <div className="font-body-lg font-bold text-on-surface">{playerName}</div>
                              <div className="font-body-md text-on-surface-variant text-sm">
                                {isGoal && assistName
                                  ? `Assistência: ${assistName}`
                                  : typeName}
                              </div>
                            </div>
                            {isGoal && (
                              <div className={`font-headline-sm text-sm px-3 py-1 rounded-md ${
                                isHome ? "text-primary bg-primary/10" : "text-secondary bg-secondary/10"
                              }`}>
                                ⚽
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[32px] opacity-40">timeline</span>
                    <p className="font-body-md text-center">Nenhum evento registrado ainda.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas (Coluna Direita) */}
            <div className="md:col-span-4 flex flex-col gap-stack-md">
              {/* Posse de Bola */}
              <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-outline-variant/30 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center">
                <h3 className="font-label-caps text-xs text-on-surface-variant mb-6 uppercase tracking-wider w-full text-left">Posse de Bola</h3>
                
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#2a2a2b" strokeWidth="8"></circle>
                    <circle 
                      className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(204,189,255,0.5)]" 
                      cx="50" 
                      cy="50" 
                      fill="transparent" 
                      r="40" 
                      stroke="#ccbdff" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={possessionOffset} 
                      strokeWidth="8"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-stats-num text-[28px] font-extrabold text-primary">
                      {homePossession !== "-" ? homePossession : "0%"}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between w-full px-4 mt-2">
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_5px_rgba(204,189,255,0.8)] mb-1"></span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant">{match.homeTeam.code}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-stats-num text-sm text-on-surface">
                      {awayPossession !== "-" ? awayPossession : "0%"}
                    </span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant mt-1">{match.awayTeam.code}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-high/50 backdrop-blur-md rounded-lg p-4 border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Chutes no Gol</span>
                  <div className="flex justify-between items-end">
                    <span className="font-stats-num text-sm text-primary">{getStat(matchStats, ["Shots on goal", "Goal attempts", "Shots on target"], "home")}</span>
                    <span className="text-on-surface-variant opacity-50">-</span>
                    <span className="font-stats-num text-sm text-on-surface">{getStat(matchStats, ["Shots on goal", "Goal attempts", "Shots on target"], "away")}</span>
                  </div>
                </div>
                <div className="bg-surface-container-high/50 backdrop-blur-md rounded-lg p-4 border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Faltas</span>
                  <div className="flex justify-between items-end">
                    <span className="font-stats-num text-sm text-on-surface">{getStat(matchStats, ["Fouls", "Fouls committed"], "home")}</span>
                    <span className="text-on-surface-variant opacity-50">-</span>
                    <span className="font-stats-num text-sm text-secondary">{getStat(matchStats, ["Fouls", "Fouls committed"], "away")}</span>
                  </div>
                </div>
                <div className="bg-surface-container-high/50 backdrop-blur-md rounded-lg p-4 border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Escanteios</span>
                  <div className="flex justify-between items-end">
                    <span className="font-stats-num text-sm text-primary">{getStat(matchStats, ["Corner kicks", "Corners"], "home")}</span>
                    <span className="text-on-surface-variant opacity-50">-</span>
                    <span className="font-stats-num text-sm text-on-surface">{getStat(matchStats, ["Corner kicks", "Corners"], "away")}</span>
                  </div>
                </div>
                <div className="bg-surface-container-high/50 backdrop-blur-md rounded-lg p-4 border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Impedimentos</span>
                  <div className="flex justify-between items-end">
                    <span className="font-stats-num text-sm text-on-surface">{getStat(matchStats, ["Offsides", "Offside"], "home")}</span>
                    <span className="text-on-surface-variant opacity-50">-</span>
                    <span className="font-stats-num text-sm text-secondary">{getStat(matchStats, ["Offsides", "Offside"], "away")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Escalações */}
        {activeSubTab === "lineups" && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-outline-variant/30 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <h3 className="font-label-caps text-xs text-on-surface-variant mb-6 uppercase tracking-wider">Escalações</h3>
              
              {match.lineups ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Home Team */}
                  <div>
                    <h4 className="font-headline-sm text-primary mb-4 flex items-center gap-2">
                      <img src={match.homeTeam.logo} alt={match.homeTeam.code} className="w-6 h-6 rounded-full object-cover border border-outline-variant/30" />
                      {match.homeTeam.name}
                      <span className="text-xs font-normal text-on-surface-variant ml-auto">{match.lineups.home.formation}</span>
                    </h4>
                    <div className="bg-surface-container-high/30 rounded-lg p-4 border border-outline-variant/20 mb-4">
                      <h5 className="font-label-caps text-[10px] text-on-surface-variant mb-3">Titulares</h5>
                      <div className="flex flex-col gap-2">
                        {match.lineups.home.starting.map(player => (
                          <div key={player.id} className="flex items-center gap-3">
                            <span className="w-6 text-center font-stats-num text-xs text-on-surface-variant">{player.number}</span>
                            <span className="font-body-md text-sm text-on-surface">{player.name}</span>
                            <span className="ml-auto font-label-caps text-[10px] text-primary/70">{player.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-surface-container-high/30 rounded-lg p-4 border border-outline-variant/20 mb-4">
                      <h5 className="font-label-caps text-[10px] text-on-surface-variant mb-3">Reservas</h5>
                      <div className="flex flex-col gap-2">
                        {match.lineups.home.substitutes.map(player => (
                          <div key={player.id} className="flex items-center gap-3 opacity-80">
                            <span className="w-6 text-center font-stats-num text-xs text-on-surface-variant">{player.number}</span>
                            <span className="font-body-md text-sm text-on-surface">{player.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-surface-container-high/30 rounded-lg p-4 border border-outline-variant/20 flex flex-col items-center">
                      <h5 className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider">Técnico</h5>
                      <span className="font-body-md text-sm text-on-surface">{match.lineups.home.coach}</span>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div>
                    <h4 className="font-headline-sm text-secondary mb-4 flex items-center gap-2">
                      <img src={match.awayTeam.logo} alt={match.awayTeam.code} className="w-6 h-6 rounded-full object-cover border border-outline-variant/30" />
                      {match.awayTeam.name}
                      <span className="text-xs font-normal text-on-surface-variant ml-auto">{match.lineups.away.formation}</span>
                    </h4>
                    <div className="bg-surface-container-high/30 rounded-lg p-4 border border-outline-variant/20 mb-4">
                      <h5 className="font-label-caps text-[10px] text-on-surface-variant mb-3">Titulares</h5>
                      <div className="flex flex-col gap-2">
                        {match.lineups.away.starting.map(player => (
                          <div key={player.id} className="flex items-center gap-3">
                            <span className="w-6 text-center font-stats-num text-xs text-on-surface-variant">{player.number}</span>
                            <span className="font-body-md text-sm text-on-surface">{player.name}</span>
                            <span className="ml-auto font-label-caps text-[10px] text-secondary/70">{player.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-surface-container-high/30 rounded-lg p-4 border border-outline-variant/20 mb-4">
                      <h5 className="font-label-caps text-[10px] text-on-surface-variant mb-3">Reservas</h5>
                      <div className="flex flex-col gap-2">
                        {match.lineups.away.substitutes.map(player => (
                          <div key={player.id} className="flex items-center gap-3 opacity-80">
                            <span className="w-6 text-center font-stats-num text-xs text-on-surface-variant">{player.number}</span>
                            <span className="font-body-md text-sm text-on-surface">{player.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-surface-container-high/30 rounded-lg p-4 border border-outline-variant/20 flex flex-col items-center">
                      <h5 className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider">Técnico</h5>
                      <span className="font-body-md text-sm text-on-surface">{match.lineups.away.coach}</span>
                    </div>
                  </div>
                </div>
              ) : new Date(match.date).getTime() - new Date().getTime() > 60 * 60 * 1000 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px] opacity-40">groups</span>
                  <p className="font-body-md text-center">As escalações estarão disponíveis 1 hora antes do jogo.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px] opacity-40">groups</span>
                  <p className="font-body-md text-center">As escalações para esta partida ainda não foram divulgadas.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
