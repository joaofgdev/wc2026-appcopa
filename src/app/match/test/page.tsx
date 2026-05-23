"use client";

import { useEffect, useState, Suspense } from "react";
import BackButton from "@/components/BackButton";
import type { TestMatchData, TestMatchStats } from "@/types/test-match";

function MatchContent() {
  const [match, setMatch] = useState<TestMatchData | null>(null);
  const [stats, setStats] = useState<TestMatchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"timeline" | "lineups" | "stats" | "heatmaps">("timeline");

  useEffect(() => {
    async function fetchMatch() {
      try {
        setLoading(true);
        const [baseRes, statsRes] = await Promise.all([
          fetch("/api/test-match"),
          fetch("/api/test-match/stats")
        ]);
        const baseData = await baseRes.json();
        const statsData = await statsRes.json();
        
        setMatch(baseData);
        setStats(statsData);
      } catch (err) {
        console.error("Erro ao carregar jogo:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatch();
  }, []);

  // Status helpers
  const isLive = match && ["1H", "2H", "HT", "ET", "P", "BT", "LIVE"].includes(match.status.short);
  const isFinished = match && ["FT", "AET", "PEN"].includes(match.status.short);

  // Estatísticas
  const homePossNum = stats?.home?.possession || 0;
  const homePossession = `${homePossNum}%`;
  const awayPossession = `${stats?.away?.possession || 0}%`;
  const possessionOffset = 251.2 - (251.2 * homePossNum) / 100;

  if (loading) {
    return (
      <main className="flex-grow pt-20 pb-28 md:pb-8 px-margin-mobile flex flex-col gap-stack-lg max-w-7xl mx-auto w-full min-h-screen">
        <div>
          <BackButton />
        </div>
        {/* Skeleton Hero */}
        <section className="relative w-full rounded-2xl overflow-hidden border border-outline-variant/30 animate-pulse">
          <div className="bg-surface-container-high/40 py-20 flex flex-col items-center gap-6">
            <div className="h-6 w-32 rounded-full bg-surface-variant/40"></div>
            <div className="flex items-center gap-12">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-surface-variant/40"></div>
                <div className="h-4 w-12 rounded bg-surface-variant/40"></div>
              </div>
              <div className="h-12 w-24 rounded bg-surface-variant/40"></div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-surface-variant/40"></div>
                <div className="h-4 w-12 rounded bg-surface-variant/40"></div>
              </div>
            </div>
          </div>
        </section>
        <div className="h-8 w-48 rounded bg-surface-variant/40 animate-pulse"></div>
        <div className="h-64 rounded-xl bg-surface-variant/20 animate-pulse"></div>
      </main>
    );
  }

  if (!match) {
    return (
      <main className="flex-grow pt-20 pb-28 md:pb-8 px-margin-mobile flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto w-full min-h-screen">
        <div className="absolute top-20 left-margin-mobile md:left-8">
          <BackButton />
        </div>
        <span className="material-symbols-outlined text-[64px] text-outline/40">sports_soccer</span>
        <h2 className="font-headline-sm text-on-surface">Jogo não encontrado</h2>
        <p className="font-body-md text-on-surface-variant text-center">
          Não foi possível carregar os dados deste jogo teste.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-20 pb-28 md:pb-8 px-margin-mobile flex flex-col gap-stack-lg max-w-7xl mx-auto w-full min-h-screen">
      <div>
        <BackButton />
      </div>
      {/* Hero Scoreboard */}
      <section className="relative w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(3,86,255,0.15)] border border-outline-variant/30">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10"></div>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiF8rOh9JlLckK-U9W6dDk5zlrMf-wzGvTozPcM7ncC9lTSvh6I7QHOyRbOOqbxU1UTuv1zaBD5VrYSr3iszaCLqhCJjh4wJ2M5-aJtK0N2naY9xOxUvImk3ME-BEwkuw93hWQ7zObeuOSQf6pwS7na4A1wOQoWyPNtrUx0AEGY97SrYKfhSVxWEzJq5z3MZEbQ7uhrubPh5AMHfL2CO-XsE9mlsDEw_-NehTxo7nQqfMKX7SqH6bGbISYUY3B82Tcb0aj9bOKaDw" 
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
              ? `${match.status.elapsed || 0}' AO VIVO`
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
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-surface-container overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(204,189,255,0.2)] mb-3 p-2 bg-white">
                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain" />
              </div>
              <h2 className="font-headline-sm text-on-background text-center hidden md:block">{match.homeTeam.name}</h2>
              <h2 className="font-headline-sm text-on-background text-center md:hidden">{match.homeTeam.shortName}</h2>
            </div>
            
            <div className="flex items-center justify-center px-4 md:px-8">
              <span className="font-display-lg-mobile md:font-display-lg text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tighter">
                {match.goalsHome !== null ? match.goalsHome : "-"} - {match.goalsAway !== null ? match.goalsAway : "-"}
              </span>
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-surface-container overflow-hidden border-2 border-secondary-fixed/50 shadow-[0_0_15px_rgba(182,196,255,0.2)] mb-3 p-2 bg-white">
                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain" />
              </div>
              <h2 className="font-headline-sm text-on-background text-center hidden md:block">{match.awayTeam.name}</h2>
              <h2 className="font-headline-sm text-on-background text-center md:hidden">{match.awayTeam.shortName}</h2>
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
        <div className="flex items-center gap-8 min-w-max px-2">
          {(["timeline", "lineups", "stats", "heatmaps"] as const).map((tab) => {
            const labels = { timeline: "Linha do Tempo", lineups: "Escalações", stats: "Estatísticas", heatmaps: "Mapas de Calor" };
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md w-full">
        
        {/* Eventos / Timeline (Coluna Esquerda) */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-outline-variant/30 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <h3 className="font-label-caps text-xs text-on-surface-variant mb-6 uppercase tracking-wider">Eventos Principais</h3>
            
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px] opacity-40">timeline</span>
              <p className="font-body-md text-center">Nenhum evento registrado ainda.</p>
            </div>
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
                  {homePossNum ? homePossession : "0%"}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between w-full px-4 mt-2">
              <div className="flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_5px_rgba(204,189,255,0.8)] mb-1"></span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">{match.homeTeam.shortName}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-stats-num text-sm text-on-surface">
                  {stats?.away?.possession ? awayPossession : "0%"}
                </span>
                <span className="font-label-caps text-[10px] text-on-surface-variant mt-1">{match.awayTeam.shortName}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-high/50 backdrop-blur-md rounded-lg p-4 border border-outline-variant/20 flex flex-col justify-between">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Chutes no Gol</span>
              <div className="flex justify-between items-end">
                <span className="font-stats-num text-sm text-primary">{stats?.home?.shotsOnTarget || 0}</span>
                <span className="text-on-surface-variant opacity-50">-</span>
                <span className="font-stats-num text-sm text-on-surface">{stats?.away?.shotsOnTarget || 0}</span>
              </div>
            </div>
            <div className="bg-surface-container-high/50 backdrop-blur-md rounded-lg p-4 border border-outline-variant/20 flex flex-col justify-between">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Faltas</span>
              <div className="flex justify-between items-end">
                <span className="font-stats-num text-sm text-on-surface">{stats?.home?.fouls || 0}</span>
                <span className="text-on-surface-variant opacity-50">-</span>
                <span className="font-stats-num text-sm text-secondary">{stats?.away?.fouls || 0}</span>
              </div>
            </div>
            <div className="bg-surface-container-high/50 backdrop-blur-md rounded-lg p-4 border border-outline-variant/20 flex flex-col justify-between">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Escanteios</span>
              <div className="flex justify-between items-end">
                <span className="font-stats-num text-sm text-primary">{stats?.home?.corners || 0}</span>
                <span className="text-on-surface-variant opacity-50">-</span>
                <span className="font-stats-num text-sm text-on-surface">{stats?.away?.corners || 0}</span>
              </div>
            </div>
            <div className="bg-surface-container-high/50 backdrop-blur-md rounded-lg p-4 border border-outline-variant/20 flex flex-col justify-between">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2">Cartões Amarelos</span>
              <div className="flex justify-between items-end">
                <span className="font-stats-num text-sm text-on-surface">{stats?.home?.yellowCards || 0}</span>
                <span className="text-on-surface-variant opacity-50">-</span>
                <span className="font-stats-num text-sm text-secondary">{stats?.away?.yellowCards || 0}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

export default function TestMatchSummaryPage() {
  return (
    <Suspense fallback={
      <main className="flex-grow pt-20 pb-28 px-margin-mobile flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-variant/40"></div>
          <div className="h-4 w-32 rounded bg-surface-variant/40"></div>
        </div>
      </main>
    }>
      <MatchContent />
    </Suspense>
  );
}
