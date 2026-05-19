"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import MatchCard from "@/components/MatchCard";
import type { ProcessedFixture } from "@/types/football";

// Agrupa os jogos por data
function groupFixturesByDate(fixtures: ProcessedFixture[]) {
  const grouped: Record<string, ProcessedFixture[]> = {};
  
  fixtures.forEach(fixture => {
    // Pegar a data no fuso de Brasília para agrupamento
    const date = new Date(fixture.date);
    const dateStr = date.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
    
    // Capitalizar a primeira letra
    const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    
    if (!grouped[formattedDate]) {
      grouped[formattedDate] = [];
    }
    grouped[formattedDate].push(fixture);
  });
  
  return grouped;
}

// Extrai o grupo (ex: "Group C" -> "GRUPO C", ou "Round 1" -> "RODADA 1")
function extractGroup(group: string, round: string): string {
  if (group) {
    const match = group.match(/Group\s+([A-Z])/i);
    if (match) return `GRUPO ${match[1].toUpperCase()}`;
    return group.toUpperCase();
  }
  return round.toUpperCase();
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MatchesPage() {
  const [fixtures, setFixtures] = useState<ProcessedFixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllFixtures() {
      try {
        const res = await fetch("/api/fixtures");
        if (res.ok) {
          const data = await res.json();
          // Ordenar por data
          const sorted = data.fixtures.sort((a: ProcessedFixture, b: ProcessedFixture) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setFixtures(sorted);
        }
      } catch (err) {
        console.error("Erro ao carregar jogos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllFixtures();
  }, []);

  const groupedFixtures = groupFixturesByDate(fixtures);

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      <div>
        <BackButton />
      </div>

      <section className="flex flex-col gap-stack-md mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Todos os Jogos</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Lista completa de partidas da Copa do Mundo 2026.</p>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col gap-8 mt-4">
          {[1, 2, 3].map((group) => (
            <div key={group} className="flex flex-col gap-4">
              <div className="h-6 w-48 rounded bg-surface-variant/40 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="h-[120px] rounded-xl bg-surface-variant/20 animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : fixtures.length > 0 ? (
        <div className="flex flex-col gap-10 mt-4">
          {Object.entries(groupedFixtures).map(([dateLabel, dateFixtures]) => (
            <section key={dateLabel} className="flex flex-col gap-4">
              <h3 className="font-label-caps text-on-surface-variant sticky top-16 md:top-20 bg-background/80 backdrop-blur-md py-2 z-10 border-b border-outline-variant/20">
                {dateLabel}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {dateFixtures.map((fixture, index) => (
                  <MatchCard
                    key={fixture.id}
                    group={extractGroup(fixture.group, fixture.round)}
                    time={formatTime(fixture.date)}
                    teamHome={fixture.homeTeam.code}
                    teamAway={fixture.awayTeam.code}
                    logoHome={fixture.homeTeam.logo}
                    logoAway={fixture.awayTeam.logo}
                    scoreHome={fixture.goalsHome !== null ? String(fixture.goalsHome) : "-"}
                    scoreAway={fixture.goalsAway !== null ? String(fixture.goalsAway) : "-"}
                    variant={index % 2 === 0 ? "primary" : "secondary"}
                    fixtureId={fixture.id}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-12 gap-3">
          <span className="material-symbols-outlined text-[48px] text-outline/40">event_busy</span>
          <p className="font-body-md text-on-surface-variant text-center">Nenhum jogo encontrado.</p>
        </div>
      )}
    </main>
  );
}
