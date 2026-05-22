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
    <div className="flex flex-col gap-4 mb-8">
      {/* Busca */}
      <div className="relative w-full max-w-xl">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          type="text"
          placeholder="Pesquisar notícias (ex: Copa 2026, escalação...)"
          className="w-full bg-surface-container-high text-on-surface placeholder:text-on-surface-variant rounded-full py-3 pl-12 pr-4 border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-elevation-sm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {/* Carrossel de Seleções */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
        <button
          onClick={() => handleTeamClick("")}
          className={`shrink-0 px-4 py-1.5 rounded-full font-label-caps text-sm transition-colors border ${
            activeTeam === ""
              ? "bg-primary text-on-primary border-primary"
              : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
          }`}
        >
          Todas
        </button>
        {TOP_TEAMS.map((team) => (
          <button
            key={team}
            onClick={() => handleTeamClick(team)}
            className={`shrink-0 px-4 py-1.5 rounded-full font-label-caps text-sm transition-colors border ${
              activeTeam === team
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            {team}
          </button>
        ))}
      </div>
    </div>
  );
}
