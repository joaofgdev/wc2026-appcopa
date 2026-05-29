"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";
import MatchCard from "@/components/MatchCard";
import type { ProcessedFixture } from "@/types/football";

// Agrupa os jogos por data
function groupFixturesByDate(fixtures: ProcessedFixture[]) {
  const grouped: Record<string, ProcessedFixture[]> = {};
  
  fixtures.forEach(fixture => {
    const date = new Date(fixture.date);
    const dateStr = date.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
    
    const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    
    if (!grouped[formattedDate]) {
      grouped[formattedDate] = [];
    }
    grouped[formattedDate].push(fixture);
  });
  
  return grouped;
}

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

export default function MatchesView({ fixtures }: { fixtures: ProcessedFixture[] }) {
  const [selectedDate, setSelectedDate] = useState<string | "all">( () => {
    if (!fixtures || fixtures.length === 0) return "all";
    const grouped = groupFixturesByDate(fixtures);
    const dateKeys = Object.keys(grouped);
    
    const todayStr = new Date().toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
    const formattedToday = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);
    
    if (dateKeys.includes(formattedToday)) {
      return formattedToday;
    }
    return dateKeys[0] || "all";
  });

  const groupedFixtures = groupFixturesByDate(fixtures);
  const availableDates = Object.keys(groupedFixtures);

  const displayedFixtures = selectedDate === "all" 
    ? groupedFixtures 
    : { [selectedDate]: groupedFixtures[selectedDate] };

  return (
    <main className="max-w-[1600px] mx-auto px-margin-mobile md:px-8 pt-6 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen w-full">
      <div>
        <BackButton />
      </div>

      <section className="flex items-center gap-4 mt-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(101,177,163,0.15)",
            border: "1px solid rgba(101,177,163,0.3)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "30px",
              color: "#65B1A3",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            calendar_month
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
            Agenda de Jogos
          </h1>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "#A8C5C2",
              fontFamily: "var(--font-sora), sans-serif",
              marginTop: "3px",
            }}
          >
            Acompanhe todas as partidas da Copa.
          </p>
        </div>
      </section>

      {/* Date Filter Tabs */}
      {availableDates.length > 0 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          {availableDates.map(dateLabel => {
            const firstFixture = groupedFixtures[dateLabel][0];
            const shortDate = new Date(firstFixture.date).toLocaleDateString("pt-BR", {
              timeZone: "America/Sao_Paulo",
              day: '2-digit',
              month: '2-digit'
            });

            return (
              <button
                key={dateLabel}
                onClick={() => setSelectedDate(dateLabel)}
                className={`flex-shrink-0 w-[4rem] h-[4rem] flex items-center justify-center rounded-xl font-stats-num text-lg font-bold transition-all border ${
                  selectedDate === dateLabel 
                    ? "bg-primary text-on-primary border-primary shadow-[0_0_15px_rgba(204,189,255,0.4)]" 
                    : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
                }`}
              >
                {shortDate}
              </button>
            );
          })}
          <button
            onClick={() => setSelectedDate("all")}
            className={`flex-shrink-0 w-[4rem] h-[4rem] flex flex-col items-center justify-center rounded-xl font-label-caps text-xs transition-all border ${
              selectedDate === "all" 
                ? "bg-primary text-on-primary border-primary shadow-[0_0_15px_rgba(204,189,255,0.4)]" 
                : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[20px] mb-0.5">view_agenda</span>
            Todos
          </button>
        </div>
      )}

      {fixtures.length > 0 ? (
        <div className="flex flex-col gap-10 mt-4">
          {Object.entries(displayedFixtures).map(([dateLabel, dateFixtures]) => {
            if (!dateFixtures) return null;
            return (
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
                      venue={fixture.venue}
                    />
                  ))}
                </div>
              </section>
            );
          })}
          
          {selectedDate !== "all" && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setSelectedDate("all")}
                className="bg-surface-variant text-on-surface px-8 py-3 rounded-full font-label-caps hover:brightness-110 transition-all flex items-center gap-2 border border-outline-variant/50"
              >
                <span className="material-symbols-outlined">view_agenda</span>
                Ver todos os jogos por fila
              </button>
            </div>
          )}
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
