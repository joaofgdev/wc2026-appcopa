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
  dateLabel,
}: MatchCardProps) {
  const hasScore = scoreHome !== "-" && scoreHome !== null;
  const centerDisplay = hasScore ? `${scoreHome} - ${scoreAway}` : time;

  const content = (
    <div
      className={`${fullWidth ? "w-full" : "w-[300px] shrink-0"} rounded-[20px] flex flex-col cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
      style={{
        background:
          variant === "primary"
            ? "linear-gradient(145deg, rgba(31,102,99,0.45) 0%, rgba(27,53,56,0.55) 100%)"
            : "linear-gradient(145deg, rgba(24,20,27,0.6) 0%, rgba(30,28,32,0.7) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(101,177,163,0.22)",
        boxShadow:
          variant === "primary"
            ? "0 4px 20px rgba(31,102,99,0.2)"
            : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top Section — Grupo */}
      <div className="flex justify-center items-center relative pt-3 pb-0 px-3">
        {dateLabel && (
          <span
            className="absolute left-4 top-3"
            style={{ fontSize: "10px", color: "#A8C5C2", opacity: 0.7 }}
          >
            {dateLabel}
          </span>
        )}
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: "#65B1A3",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "var(--font-sora), sans-serif",
          }}
        >
          {group}
        </span>
      </div>

      {/* Middle Section — Times e Placar */}
      <div className="flex justify-between items-center px-4 py-4">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-2 flex-[1.2]">
          <div
            className="w-11 h-8 rounded-[6px] overflow-hidden flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(101,177,163,0.15)",
            }}
          >
            {logoHome ? (
              <img src={logoHome} alt={teamHome} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: "rgba(101,177,163,0.1)" }} />
            )}
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#F0EEEF",
              fontFamily: "var(--font-sora), sans-serif",
            }}
          >
            {teamHome}
          </span>
        </div>

        {/* Center — Placar ou Hora */}
        <div className="flex flex-col items-center justify-center flex-[1.5]">
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-sora), sans-serif",
            }}
          >
            {centerDisplay}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 flex-[1.2]">
          <div
            className="w-11 h-8 rounded-[6px] overflow-hidden flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(101,177,163,0.15)",
            }}
          >
            {logoAway ? (
              <img src={logoAway} alt={teamAway} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: "rgba(101,177,163,0.1)" }} />
            )}
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#F0EEEF",
              fontFamily: "var(--font-sora), sans-serif",
            }}
          >
            {teamAway}
          </span>
        </div>
      </div>

      {/* Bottom Venue Section */}
      {venue && (
        <div
          className="py-2.5 flex items-center justify-center gap-1.5"
          style={{ borderTop: "1px solid rgba(101,177,163,0.12)" }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "13px", color: "#65B1A3" }}
          >
            location_on
          </span>
          <span
            className="truncate max-w-[80%]"
            style={{
              fontSize: "11px",
              color: "#A8C5C2",
              fontFamily: "var(--font-sora), sans-serif",
            }}
          >
            {venue}
          </span>
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