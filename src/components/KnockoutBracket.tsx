import React from "react";
import type { ProcessedFixture } from "@/types/football";
import Image from "next/image";
import { translateTeam } from "@/lib/api";

type MatchMap = Record<string, ProcessedFixture>;

interface KnockoutBracketProps {
  matches: ProcessedFixture[];
}

// Ordenação correta para que as chaves se conectem visualmente
const BRACKET_ORDER = {
  "Round of 32": ["m_74", "m_77", "m_73", "m_75", "m_83", "m_84", "m_81", "m_82", "m_76", "m_78", "m_79", "m_80", "m_86", "m_88", "m_85", "m_87"],
  "Round of 16": ["m_89", "m_90", "m_93", "m_94", "m_91", "m_92", "m_95", "m_96"],
  "Quarter-final": ["m_97", "m_98", "m_99", "m_100"],
  "Semi-final": ["m_101", "m_102"],
  "Final": ["m_104"],
};

// Formatar "W74" para "Venc. 74", "2A" para "2º Grupo A"
function formatTeamCode(code: string) {
  if (code.startsWith("W")) {
    return `Venc. ${code.replace("W", "")}`;
  }
  if (code.match(/^\d[A-Z]$/)) {
    return `${code[0]}º Grupo ${code[1]}`;
  }
  if (code.includes("/")) {
    return `3º ${code}`;
  }
  return code;
}

// Resolve visual do time (TBD ou real)
function getTeamDisplay(teamInfo: string | { name: string; code: string; logo?: string }) {
  const teamCodeRaw = typeof teamInfo === "string" ? teamInfo : teamInfo.name;
  
  // Se for código provisório (ex: W74, 2A, 3A/B)
  if (teamCodeRaw.startsWith("W") || teamCodeRaw.match(/^\d/) || teamCodeRaw.includes("/")) {
    return {
      name: formatTeamCode(teamCodeRaw),
      logo: null,
      isTbd: true
    };
  }
  
  if (typeof teamInfo !== "string" && teamInfo.logo) {
    return {
      name: teamInfo.name,
      logo: teamInfo.logo,
      isTbd: false
    };
  }
  
  // Se for time real
  const team = translateTeam(teamCodeRaw);
  let logoUrl = "";
  if (team.code) {
    logoUrl = team.iso2 ? `https://flagcdn.com/${team.iso2}.svg` : `https://flagsapi.com/${team.code.toUpperCase().substring(0, 2)}/flat/64.png`;
  }
  return {
    name: team.name,
    logo: logoUrl || null,
    isTbd: false
  };
}

const MatchNode = ({ match, scaleY = 1 }: { match: ProcessedFixture | undefined, scaleY?: number }) => {
  if (!match) return <div className="w-48 h-16 opacity-0" />;

  const home = getTeamDisplay(match.homeTeam);
  const away = getTeamDisplay(match.awayTeam);

  return (
    <div className="relative w-48 bg-surface-container-high rounded-lg border border-outline-variant/30 flex flex-col overflow-hidden text-sm shadow-elevation-sm z-10 my-2">
      {/* Home */}
      <div className="flex items-center justify-between p-2 border-b border-outline-variant/20 h-10">
        <div className="flex items-center gap-2 overflow-hidden">
          {home.logo ? (
            <div className="w-5 h-5 rounded-full bg-surface-variant overflow-hidden shrink-0">
               {/* Simples fallback se não achar logo real */}
               <div className="w-full h-full bg-primary/20"></div>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-surface-variant/50 shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[12px] opacity-50">help</span>
            </div>
          )}
          <span className={`truncate ${home.isTbd ? 'text-on-surface-variant opacity-70 text-xs' : 'font-headline-sm'}`}>
            {home.name}
          </span>
        </div>
        <span className="font-bold">{match.goalsHome !== null ? match.goalsHome : "-"}</span>
      </div>
      
      {/* Away */}
      <div className="flex items-center justify-between p-2 h-10">
        <div className="flex items-center gap-2 overflow-hidden">
          {away.logo ? (
             <div className="w-5 h-5 rounded-full bg-surface-variant overflow-hidden shrink-0">
               <div className="w-full h-full bg-secondary/20"></div>
             </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-surface-variant/50 shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[12px] opacity-50">help</span>
            </div>
          )}
          <span className={`truncate ${away.isTbd ? 'text-on-surface-variant opacity-70 text-xs' : 'font-headline-sm'}`}>
            {away.name}
          </span>
        </div>
        <span className="font-bold">{match.goalsAway !== null ? match.goalsAway : "-"}</span>
      </div>
      
      {/* Conectores da Direita */}
      {match.round !== "Final" && (
        <>
          <div className="absolute top-1/2 -right-4 w-4 h-px bg-outline-variant/50"></div>
          {/* O conector vertical quem desenha é o elemento ou a coluna, vamos simplificar apenas com a linha reta horizontal */}
        </>
      )}
      
      {/* Conectores da Esquerda */}
      {match.round !== "Round of 32" && (
        <div className="absolute top-1/2 -left-4 w-4 h-px bg-outline-variant/50"></div>
      )}
    </div>
  );
};

export default function KnockoutBracket({ matches }: KnockoutBracketProps) {
  // Indexar matches por ID para busca rápida
  const matchMap: MatchMap = matches.reduce((acc, match) => {
    acc[match.id] = match;
    return acc;
  }, {} as MatchMap);

  return (
    <div className="w-full overflow-x-auto pb-8 hide-scrollbar cursor-grab active:cursor-grabbing">
      <div className="min-w-max flex gap-8 items-center px-4">
        
        {/* Round of 32 */}
        <div className="flex flex-col gap-2 relative">
          <div className="text-center font-label-caps text-on-surface-variant mb-4">16-Avos</div>
          {BRACKET_ORDER["Round of 32"].map((id, index) => (
             <MatchNode key={id} match={matchMap[id]} />
          ))}
        </div>

        {/* Round of 16 */}
        <div className="flex flex-col justify-around h-[calc(100%-40px)] relative">
          <div className="text-center font-label-caps text-on-surface-variant mb-4 absolute -top-8 w-full">Oitavas</div>
          {BRACKET_ORDER["Round of 16"].map((id) => (
             <MatchNode key={id} match={matchMap[id]} />
          ))}
        </div>

        {/* Quarter-final */}
        <div className="flex flex-col justify-around h-[calc(100%-40px)] relative">
          <div className="text-center font-label-caps text-on-surface-variant mb-4 absolute -top-8 w-full">Quartas</div>
          {BRACKET_ORDER["Quarter-final"].map((id) => (
             <MatchNode key={id} match={matchMap[id]} />
          ))}
        </div>

        {/* Semi-final */}
        <div className="flex flex-col justify-around h-[calc(100%-40px)] relative">
          <div className="text-center font-label-caps text-on-surface-variant mb-4 absolute -top-8 w-full">Semi</div>
          {BRACKET_ORDER["Semi-final"].map((id) => (
             <MatchNode key={id} match={matchMap[id]} />
          ))}
        </div>

        {/* Final */}
        <div className="flex flex-col justify-center h-[calc(100%-40px)] relative">
          <div className="text-center font-label-caps text-primary mb-4 absolute -top-8 w-full font-bold">Final</div>
          {BRACKET_ORDER["Final"].map((id) => (
             <div key={id} className="relative shadow-[0_0_20px_rgba(204,189,255,0.3)] rounded-lg">
                <MatchNode match={matchMap[id]} />
             </div>
          ))}
        </div>

      </div>
    </div>
  );
}
