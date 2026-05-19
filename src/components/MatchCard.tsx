"use client";

import Link from "next/link";

interface MatchCardProps {
  group: string;
  time: string;
  teamHome: string;
  teamAway: string;
  logoHome?: string;
  logoAway?: string;
  scoreHome?: string;
  scoreAway?: string;
  variant?: "primary" | "secondary";
  fixtureId?: number;
}

export default function MatchCard({
  group,
  time,
  teamHome,
  teamAway,
  logoHome,
  logoAway,
  scoreHome = "-",
  scoreAway = "-",
  variant = "primary",
  fixtureId,
}: MatchCardProps) {
  // Define a cor do brilho de fundo dinamicamente
  const glowColor = variant === "primary" ? "bg-primary/10" : "bg-secondary/10";

  const content = (
    <div className="w-[260px] shrink-0 rounded-xl bg-surface-container-high/60 backdrop-blur-md border border-outline-variant/30 p-4 snap-center flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-colors">
      {/* Brilho Holográfico de Fundo */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${glowColor} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`}></div>
      
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-center text-on-surface-variant font-label-caps">
        <span>{group}</span>
        <span>{time}</span>
      </div>
      
      {/* Times e Resultados */}
      <div className="flex flex-col gap-3 z-10">
        {/* Time da Casa (Home) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-surface-bright border border-outline-variant overflow-hidden">
              {logoHome ? (
                <img src={logoHome} alt={teamHome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <span className="font-headline-sm text-[18px] text-on-surface">{teamHome}</span>
          </div>
          <span className="font-stats-num text-on-surface-variant">{scoreHome}</span>
        </div>
        
        {/* Time Visitante (Away) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-surface-bright border border-outline-variant overflow-hidden">
              {logoAway ? (
                <img src={logoAway} alt={teamAway} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <span className="font-headline-sm text-[18px] text-on-surface">{teamAway}</span>
          </div>
          <span className="font-stats-num text-on-surface-variant">{scoreAway}</span>
        </div>
      </div>
    </div>
  );

  if (fixtureId) {
    return (
      <Link href={`/match?id=${fixtureId}`} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
}