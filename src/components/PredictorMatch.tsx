import React from "react";

interface PredictorMatchProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  onUpdatePick: (matchId: string, homeScore: number, awayScore: number) => void;
}

export default function PredictorMatch({
  matchId,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  onUpdatePick
}: PredictorMatchProps) {
  
  const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) onUpdatePick(matchId, val, awayScore ?? 0);
  };

  const handleAwayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) onUpdatePick(matchId, homeScore ?? 0, val);
  };

  return (
    <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-headline-sm text-on-surface">{homeTeam || "A definir"}</span>
        <input 
          type="number" 
          min="0" 
          value={homeScore ?? ""} 
          onChange={handleHomeChange}
          className="w-12 h-10 bg-surface-variant text-center rounded-md border border-outline/50 font-stats-num"
        />
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="font-headline-sm text-on-surface">{awayTeam || "A definir"}</span>
        <input 
          type="number" 
          min="0" 
          value={awayScore ?? ""} 
          onChange={handleAwayChange}
          className="w-12 h-10 bg-surface-variant text-center rounded-md border border-outline/50 font-stats-num"
        />
      </div>
    </div>
  );
}
