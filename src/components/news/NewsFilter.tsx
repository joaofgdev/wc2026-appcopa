"use client";

import { useState, useEffect } from "react";

interface NewsFilterProps {
  onSearchChange: (q: string) => void;
  onTeamChange: (team: string) => void;
}

const TOP_TEAMS = [
  "Brasil",
  "Argentina",
  "França",
  "EUA",
  "Inglaterra",
  "Espanha",
  "Alemanha",
  "Portugal",
];

export default function NewsFilter({ onSearchChange, onTeamChange }: NewsFilterProps) {
  const [searchInput, setSearchInput] = useState("");
  const [activeTeam, setActiveTeam] = useState("");

  // Debounce para a barra de pesquisa
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  const handleTeamClick = (team: string) => {
    const newValue = activeTeam === team ? "" : team;
    setActiveTeam(newValue);
    onTeamChange(newValue);
  };

  return (
    <div className="flex flex-col gap-5 mb-8 w-full mt-2">
      {/* Busca */}
      <div className="relative w-full max-w-xl group">
        <span 
          className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300"
          style={{ color: searchInput ? "#65B1A3" : "rgba(101,177,163,0.5)" }}
        >
          search
        </span>
        <input
          type="text"
          placeholder="Pesquisar notícias..."
          className="w-full rounded-[20px] py-4 pl-[52px] pr-12 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(101,177,163,0.15)]"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            background: "rgba(27,53,56,0.6)",
            border: `1px solid ${searchInput ? "rgba(101,177,163,0.4)" : "rgba(101,177,163,0.15)"}`,
            color: "#FFFFFF",
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "14px",
            backdropFilter: "blur(12px)"
          }}
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:scale-110 active:scale-95"
            style={{ color: "rgba(101,177,163,0.8)" }}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        )}
      </div>

      {/* Carrossel de Seleções */}
      <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 pt-1 -mx-5 px-5 md:mx-0 md:px-0">
        <button
          onClick={() => handleTeamClick("")}
          className={`shrink-0 px-6 py-2.5 rounded-full transition-all duration-300 ${activeTeam === "" ? "scale-[1.02] shadow-[0_4px_16px_rgba(101,177,163,0.25)]" : "hover:scale-[1.02] active:scale-[0.98]"}`}
          style={{
            background: activeTeam === "" ? "linear-gradient(135deg, #1F6663, #65B1A3)" : "rgba(27,53,56,0.5)",
            border: activeTeam === "" ? "1px solid rgba(101,177,163,0.5)" : "1px solid rgba(101,177,163,0.15)",
            color: activeTeam === "" ? "#051418" : "#A8C5C2",
            fontFamily: "var(--font-sora), sans-serif",
            fontSize: "13px",
            fontWeight: activeTeam === "" ? 700 : 500,
            letterSpacing: "0.02em"
          }}
        >
          Todas
        </button>
        {TOP_TEAMS.map((team) => (
          <button
            key={team}
            onClick={() => handleTeamClick(team)}
            className={`shrink-0 px-6 py-2.5 rounded-full transition-all duration-300 ${activeTeam === team ? "scale-[1.02] shadow-[0_4px_16px_rgba(101,177,163,0.25)]" : "hover:scale-[1.02] active:scale-[0.98]"}`}
            style={{
              background: activeTeam === team ? "linear-gradient(135deg, #1F6663, #65B1A3)" : "rgba(27,53,56,0.5)",
              border: activeTeam === team ? "1px solid rgba(101,177,163,0.5)" : "1px solid rgba(101,177,163,0.15)",
              color: activeTeam === team ? "#051418" : "#A8C5C2",
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: "13px",
              fontWeight: activeTeam === team ? 700 : 500,
              letterSpacing: "0.02em",
              backdropFilter: "blur(12px)"
            }}
          >
            {team}
          </button>
        ))}
      </div>
    </div>
  );
}
