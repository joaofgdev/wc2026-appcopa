"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";
import { PitchBoard } from "@/components/tactical/PitchBoard";
import { TacticalPlayer, FormationKey, FORMATIONS } from "@/types/tactical";
import { COUNTRY_TRANSLATIONS } from "@/lib/api";

const allTeams = Object.values(COUNTRY_TRANSLATIONS)
  .filter(t => t.iso2 && !t.iso2.includes("gb-"))
  .filter((team, index, self) => index === self.findIndex((t) => t.code === team.code))
  .sort((a, b) => a.name.localeCompare(b.name));

const formationOptions: FormationKey[] = ["4-4-2", "4-3-3", "4-2-3-1", "3-5-2", "5-3-2"];

export default function TacticalBoardPage() {
  const [players, setPlayers] = useState<TacticalPlayer[]>([]);
  
  // Settings State
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");
  const [homeFormation, setHomeFormation] = useState<FormationKey>("4-3-3");
  const [awayFormation, setAwayFormation] = useState<FormationKey>("4-3-3");

  // Score State
  const [homeScore, setHomeScore] = useState("0");
  const [awayScore, setAwayScore] = useState("0");

  const generateTeam = (teamId: string, teamType: "home" | "away", formation: FormationKey) => {
    const teamData = allTeams.find(t => t.code === teamId);
    if (!teamData) return;

    const points = FORMATIONS[formation];
    
    const newPlayers: TacticalPlayer[] = points.map((pt, index) => {
      // Home team faces UP (plays on bottom half 50-100) -> so we map y:0-50 to y:100-50
      // Away team faces DOWN (plays on top half 0-50) -> so we use y:0-50 directly
      const x = teamType === "home" ? 100 - pt.x : pt.x;
      const y = teamType === "home" ? 100 - pt.y : pt.y;

      return {
        id: `${teamType}-${teamId}-${index}`,
        teamType,
        iso2: teamData.iso2,
        x,
        y,
        number: index + 1
      };
    });

    setPlayers(prev => [
      ...prev.filter(p => p.teamType !== teamType),
      ...newPlayers
    ]);
  };

  const handleHomeTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setHomeTeamId(val);
    if (val) generateTeam(val, "home", homeFormation);
    else setPlayers(prev => prev.filter(p => p.teamType !== "home"));
  };

  const handleAwayTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAwayTeamId(val);
    if (val) generateTeam(val, "away", awayFormation);
    else setPlayers(prev => prev.filter(p => p.teamType !== "away"));
  };

  const handleHomeFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as FormationKey;
    setHomeFormation(val);
    if (homeTeamId) generateTeam(homeTeamId, "home", val);
  };

  const handleAwayFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as FormationKey;
    setAwayFormation(val);
    if (awayTeamId) generateTeam(awayTeamId, "away", val);
  };

  const handleReset = () => {
    setPlayers([]);
    setHomeTeamId("");
    setAwayTeamId("");
    setHomeScore("0");
    setAwayScore("0");
  };

  const handleResetPositions = () => {
    if (homeTeamId) generateTeam(homeTeamId, "home", homeFormation);
    if (awayTeamId) generateTeam(awayTeamId, "away", awayFormation);
  };

  const homeTeamData = allTeams.find(t => t.code === homeTeamId);
  const awayTeamData = allTeams.find(t => t.code === awayTeamId);

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-8 pt-6 pb-32 md:pb-8 flex flex-col gap-6 min-h-screen">
      <div className="pt-2 flex justify-between items-center">
        <BackButton />
        <div className="flex items-center gap-2">
          <button 
            onClick={handleResetPositions}
            className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 text-slate-300 rounded-lg border border-slate-700 transition flex items-center gap-1.5 text-xs font-medium shadow-sm"
            title="Resetar Posições"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>settings_backup_restore</span>
            <span className="hidden sm:inline">Resetar Posições</span>
          </button>
          <button 
            onClick={handleReset}
            className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 text-slate-300 rounded-lg border border-slate-700 transition flex items-center gap-1.5 text-xs font-medium shadow-sm"
            title="Limpar Tudo"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
            <span className="hidden sm:inline">Limpar Tudo</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(16,185,129,0.15)", // emerald-500
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "30px",
                color: "#10B981",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              sports_soccer
            </span>
          </div>
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#FFFFFF",
                fontFamily: "var(--font-sora), sans-serif",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Prancheta Tática
            </h1>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 300,
                color: "#A7F3D0", // emerald-200
                fontFamily: "var(--font-sora), sans-serif",
                marginTop: "3px",
              }}
            >
              Simule escalações e posições no campo.
            </p>
          </div>
        </div>
      </div>

      {/* Controllers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
        
        {/* Home Team Config */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Mandante</label>
          <div className="flex gap-2">
            <select 
              value={homeTeamId} 
              onChange={handleHomeTeamChange}
              className="flex-1 bg-slate-900 border border-emerald-900/50 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500"
            >
              <option value="">Selecione...</option>
              {allTeams.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
            </select>
            <select 
              value={homeFormation} 
              onChange={handleHomeFormationChange}
              disabled={!homeTeamId}
              className="w-24 bg-slate-900 border border-emerald-900/50 text-white text-sm rounded-lg px-2 py-2.5 outline-none focus:border-emerald-500 disabled:opacity-50"
            >
              {formationOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Away Team Config */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-rose-400 uppercase tracking-wider">Visitante</label>
          <div className="flex gap-2">
            <select 
              value={awayTeamId} 
              onChange={handleAwayTeamChange}
              className="flex-1 bg-slate-900 border border-rose-900/50 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-rose-500"
            >
              <option value="">Selecione...</option>
              {allTeams.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
            </select>
            <select 
              value={awayFormation} 
              onChange={handleAwayFormationChange}
              disabled={!awayTeamId}
              className="w-24 bg-slate-900 border border-rose-900/50 text-white text-sm rounded-lg px-2 py-2.5 outline-none focus:border-rose-500 disabled:opacity-50"
            >
              {formationOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

      </div>

      {/* Editable Scoreboard */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 bg-slate-900/80 py-3 sm:py-4 px-6 rounded-2xl border border-slate-700/50 mx-auto w-full max-w-2xl shadow-xl">
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-white font-bold text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
            {homeTeamData ? homeTeamData.name : "Mandante"}
          </span>
          {homeTeamData && (
            <img src={`https://flagcdn.com/${homeTeamData.iso2}.svg`} alt="" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-emerald-500" />
          )}
        </div>

        <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg border border-white/10">
          <input 
            type="text" 
            value={homeScore} 
            onChange={e => setHomeScore(e.target.value.substring(0,2))}
            className="w-8 sm:w-10 text-center bg-transparent text-emerald-400 font-black text-xl sm:text-2xl outline-none"
          />
          <span className="text-white/50 font-bold">X</span>
          <input 
            type="text" 
            value={awayScore} 
            onChange={e => setAwayScore(e.target.value.substring(0,2))}
            className="w-8 sm:w-10 text-center bg-transparent text-rose-400 font-black text-xl sm:text-2xl outline-none"
          />
        </div>

        <div className="flex items-center gap-3 flex-1 justify-start">
          {awayTeamData && (
            <img src={`https://flagcdn.com/${awayTeamData.iso2}.svg`} alt="" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-rose-500" />
          )}
          <span className="text-white font-bold text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
            {awayTeamData ? awayTeamData.name : "Visitante"}
          </span>
        </div>
      </div>

      {/* Tactical Pitch */}
      <div className="mb-10">
        <PitchBoard players={players} onPlayersChange={setPlayers} />
      </div>

    </main>
  );
}
