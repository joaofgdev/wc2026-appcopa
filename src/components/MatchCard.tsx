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
  fixtureId?: string;
  venue?: string;
  fullWidth?: boolean;
  borderColor?: string;
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
  venue,
  fullWidth = false,
  borderColor = "border-brand-blue",
}: MatchCardProps) {
  // Define a cor do brilho de fundo dinamicamente
  const glowColor = variant === "primary" ? "bg-primary/10" : "bg-secondary/10";

  const content = (
    <div className={`${fullWidth ? "w-full" : "w-[180px]"} shrink-0 rounded-[24px] bg-brand-surface border ${borderColor} p-4 snap-center flex flex-col gap-4 cursor-pointer hover:brightness-110 transition-colors`}>
      
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-center text-white/50 font-label-caps text-xs font-bold">
        <span>{group}</span>
        <span>{time}</span>
      </div>
      
      {/* Times e Resultados */}
      <div className="flex flex-col gap-3">
        {/* Time da Casa (Home) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-surface border border-white/10 overflow-hidden flex items-center justify-center">
              {logoHome ? (
                <img src={logoHome} alt={teamHome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <span className="font-headline-sm text-[16px] text-brand-blue font-bold">{teamHome}</span>
          </div>
          <span className="font-stats-num text-white/50 font-bold">{scoreHome}</span>
        </div>
        
        {/* Time Visitante (Away) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-surface border border-white/10 overflow-hidden flex items-center justify-center">
              {logoAway ? (
                <img src={logoAway} alt={teamAway} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <span className="font-headline-sm text-[16px] text-brand-blue font-bold">{teamAway}</span>
          </div>
          <span className="font-stats-num text-white/50 font-bold">{scoreAway}</span>
        </div>
      </div>
      
      {/* Estádio (Condicional) */}
      {venue && (
        <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-brand-green">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span className="font-label-caps text-[10px] text-white/70 font-bold truncate">{venue}</span>
        </div>
      )}
    </div>
  );

  if (fixtureId) {
    return (
      <Link href={`/match?id=${fixtureId}`} className={`no-underline ${fullWidth ? "w-full block" : ""}`}>
        {content}
      </Link>
    );
  }

  return content;
}