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

  const currentIndex = selectedDate === "all" ? -1 : availableDates.indexOf(selectedDate);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === availableDates.length - 1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedDate(availableDates[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[currentIndex + 1]);
    } else if (currentIndex === -1) {
      setSelectedDate(availableDates[0]);
    }
  };

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

      {/* Date Filter - Modern UI/UX */}
      {availableDates.length > 0 && (
        <div className="flex items-center gap-2 w-full mt-4">
          <button 
            onClick={handlePrev} 
            disabled={isFirst && selectedDate !== "all"} 
            className="h-14 w-14 shrink-0 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center hover:bg-surface-variant transition-colors"
            aria-label="Dia Anterior"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <div className="relative flex-1 md:max-w-md mx-auto">
            <select 
               value={selectedDate} 
               onChange={(e) => setSelectedDate(e.target.value)}
               className="appearance-none bg-surface-container text-on-surface h-14 px-4 rounded-xl font-bold font-sora w-full border border-outline-variant/30 outline-none focus:border-primary cursor-pointer text-center hover:bg-surface-variant/50 transition-colors"
               style={{ textOverflow: 'ellipsis' }}
            >
               <option value="all">⚽ Todas as Datas da Copa</option>
               {availableDates.map(dateLabel => {
                 const dFix = groupedFixtures[dateLabel][0];
                 const isKnockout = dFix && dFix.round !== "Group Stage";
                 return (
                   <option key={dateLabel} value={dateLabel}>
                     {dateLabel} {isKnockout ? "🏆" : ""}
                   </option>
                 );
               })}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
          </div>

          <button 
            onClick={handleNext} 
            disabled={isLast} 
            className="h-14 w-14 shrink-0 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center hover:bg-surface-variant transition-colors"
            aria-label="Próximo Dia"
          >
            <span className="material-symbols-outlined">chevron_right</span>
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
