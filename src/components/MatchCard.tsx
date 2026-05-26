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
  dateLabel?: string;
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
  fullWidth = true,
  borderColor = "border-outline-variant/30",
  dateLabel,
}: MatchCardProps) {
  
  const hasScore = scoreHome !== "-" && scoreHome !== null;
  const centerDisplay = hasScore ? `${scoreHome} - ${scoreAway}` : time;

  const content = (
    <div className={`${fullWidth ? "w-full" : "w-[300px] shrink-0"} rounded-2xl bg-surface-container border ${borderColor} flex flex-col cursor-pointer hover:bg-surface-variant transition-colors overflow-hidden`}>
      
      {/* Top Section */}
      <div className="flex justify-center items-center relative p-3 pb-0">
        {dateLabel && (
          <span className="absolute left-4 top-3 text-on-surface-variant font-body-sm opacity-80">
            {dateLabel}
          </span>
        )}
        <span className="text-on-surface-variant font-label-caps text-[11px] opacity-70 uppercase tracking-wider">
          {group}
        </span>
      </div>
      
      {/* Middle Section (Teams & Time) */}
      <div className="flex justify-between items-center px-4 py-4">
        
        {/* Home Team */}
        <div className="flex flex-col items-center gap-1.5 flex-[1.2]">
          <div className="w-10 h-7 rounded-[4px] bg-surface-variant border border-outline/20 overflow-hidden flex items-center justify-center">
             {logoHome ? (
                <img src={logoHome} alt={teamHome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-variant" />
              )}
          </div>
          <span className="font-headline-sm text-[13px] text-on-surface font-semibold">{teamHome}</span>
        </div>

        {/* Center Time/Score */}
        <div className="flex flex-col items-center justify-center flex-[1.5]">
          <span className="font-display-sm text-2xl font-medium tracking-tight text-on-surface">
            {centerDisplay}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-1.5 flex-[1.2]">
          <div className="w-10 h-7 rounded-[4px] bg-surface-variant border border-outline/20 overflow-hidden flex items-center justify-center">
             {logoAway ? (
                <img src={logoAway} alt={teamAway} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-variant" />
              )}
          </div>
          <span className="font-headline-sm text-[13px] text-on-surface font-semibold">{teamAway}</span>
        </div>

      </div>
      
      {/* Bottom Venue Section */}
      {venue && (
        <div className="py-2.5 border-t border-outline-variant/20 flex items-center justify-center gap-1.5 text-primary">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          <span className="font-body-sm text-[12px] text-on-surface-variant truncate max-w-[80%]">{venue}</span>
        </div>
      )}
    </div>
  );

  if (fixtureId) {
    return (
      <Link href={`/match?id=${fixtureId}`} className="no-underline block w-full">
        {content}
      </Link>
    );
  }

  return content;
}