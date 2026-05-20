"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import type { ProcessedFixture } from "@/types/football";

// Converte data UTC para horário de Brasília (UTC-3)
function formatBrasiliaTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBrasiliaDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
  });
}

// Extrai o grupo (ex: "Group C" -> "GRUPO C", ou "Round 1" -> "RODADA 1")
function extractGroup(group: string, round: string): string {
  // Se tem grupo definido, usa ele
  if (group) {
    const match = group.match(/Group\s+([A-Z])/i);
    if (match) return `GRUPO ${match[1].toUpperCase()}`;
    return group.toUpperCase();
  }
  // Senão, usa o round
  return round.toUpperCase();
}

// Verifica se o jogo está ao vivo
function isLive(status: string): boolean {
  return ["1H", "2H", "HT", "ET", "P", "BT", "LIVE"].includes(status);
}

// Verifica se o jogo ainda não começou
function isScheduled(status: string): boolean {
  return ["TBD", "NS"].includes(status);
}

export default function Home() {
  const [brazilMatch, setBrazilMatch] = useState<ProcessedFixture | null>(null);
  const [fixtures, setFixtures] = useState<ProcessedFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [brazilRes, fixturesRes] = await Promise.all([
          fetch("/api/fixtures/brazil"),
          fetch("/api/fixtures"),
        ]);

        const brazilData = await brazilRes.json();
        const fixturesData = await fixturesRes.json();

        setBrazilMatch(brazilData.match || null);
        setFixtures(fixturesData.fixtures || []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Status chip para o jogo do Brasil
  const brazilStatus = brazilMatch
    ? isLive(brazilMatch.status.short)
      ? { label: `${brazilMatch.status.elapsed}' • AO VIVO`, live: true }
      : isScheduled(brazilMatch.status.short)
      ? { label: `${formatBrasiliaDate(brazilMatch.date)} • ${formatBrasiliaTime(brazilMatch.date)}`, live: false }
      : { label: brazilMatch.status.long.toUpperCase(), live: false }
    : null;

  return (
    <main className="pt-20 pb-28 px-margin-mobile flex flex-col gap-stack-lg min-h-screen">

      {/* Live Match Hero — Próximo Jogo do Brasil */}
      <section className="relative w-full rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,230,57,0.15)] border border-tertiary/30 bg-surface-container-low isolate group">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8sQS0VdLDybkkIr66aNQ3AGqicZJDri83yEl2NxJlEUf6j7QWOK7hY7-IVNB1eMeyBN8wkoLa4N2SIYW9PZI3GXjd_grFwv4TBvZ_1fe2OIPipeodFdvpmyLGW9wnuHk5f-NJw0-uG1T1FWfTDm6iVOnmgJXuzObLHqi0lI2xKH97VipmwoYnTdC77d5nZTC81PBzQF9bCu2_GYL95TztOXFqXYcQV2XSsd_tweud6z1QHl6wTBO6PdJ61bqyaPxwbqMS0GG69ZY" alt="Stadium Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 p-6 flex flex-col items-center text-center gap-6">
          
          {loading ? (
            /* Loading Skeleton */
            <div className="flex flex-col items-center gap-6 w-full animate-pulse">
              <div className="h-6 w-40 rounded-full bg-surface-variant/40"></div>
              <div className="flex items-center justify-between w-full max-w-[280px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-surface-variant/40"></div>
                  <div className="h-4 w-10 rounded bg-surface-variant/40"></div>
                </div>
                <div className="h-10 w-20 rounded bg-surface-variant/40"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-surface-variant/40"></div>
                  <div className="h-4 w-10 rounded bg-surface-variant/40"></div>
                </div>
              </div>
              <div className="h-10 w-48 rounded-full bg-surface-variant/40"></div>
            </div>
          ) : brazilMatch ? (
            <>
              {/* Status Chip */}
              <div className={`flex items-center gap-2 backdrop-blur-md px-3 py-1 rounded-full ${
                brazilStatus?.live
                  ? "bg-tertiary/20 border border-tertiary shadow-[0_0_15px_rgba(0,230,57,0.4)]"
                  : "bg-primary/20 border border-primary/50"
              }`}>
                {brazilStatus?.live && (
                  <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
                )}
                <span className={`font-label-caps ${brazilStatus?.live ? "text-tertiary" : "text-primary"}`}>
                  {brazilStatus?.label}
                </span>
              </div>
              
              {/* Times e Placar */}
              <div className="flex items-center justify-between w-full max-w-[280px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-surface-variant bg-surface">
                    <img className="w-full h-full object-cover" src={brazilMatch.homeTeam.logo} alt={brazilMatch.homeTeam.code} />
                  </div>
                  <span className="font-headline-sm text-on-surface">{brazilMatch.homeTeam.code}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-stats-num text-[40px] leading-none text-on-surface tracking-tighter">
                    {brazilMatch.goalsHome !== null ? brazilMatch.goalsHome : "-"}
                  </span>
                  <span className="font-display-lg text-outline/50 pb-2">-</span>
                  <span className="font-stats-num text-[40px] leading-none text-on-surface tracking-tighter">
                    {brazilMatch.goalsAway !== null ? brazilMatch.goalsAway : "-"}
                  </span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-surface-variant bg-surface">
                    <img className="w-full h-full object-cover grayscale opacity-80" src={brazilMatch.awayTeam.logo} alt={brazilMatch.awayTeam.code} />
                  </div>
                  <span className="font-headline-sm text-on-surface-variant">{brazilMatch.awayTeam.code}</span>
                </div>
              </div>
              
              {/* Botão */}
              <Link
                href={`/match?id=${brazilMatch.id}`}
                className="bg-tertiary text-on-tertiary font-label-caps px-8 py-3 rounded-full flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,230,57,0.3)] no-underline"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                {brazilStatus?.live ? "ASSISTIR AO VIVO" : "VER DETALHES"}
              </Link>
            </>
          ) : (
            /* Fallback — sem jogos */
            <div className="flex flex-col items-center gap-4 py-4">
              <span className="material-symbols-outlined text-[48px] text-outline/50">sports_soccer</span>
              <p className="font-body-md text-on-surface-variant text-center">
                {error
                  ? "Erro ao carregar dados. Tente novamente mais tarde."
                  : "Nenhum jogo do Brasil disponível no momento."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Explorar Banner */}
      <section className="flex flex-col gap-2">
        <Link 
          href="/explore"
          className="relative w-full h-[120px] rounded-xl overflow-hidden group border border-outline-variant/20 shadow-elevation-sm hover:shadow-elevation-md transition-shadow"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-center z-10">
            <h3 className="font-headline-md text-on-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[28px]">travel_explore</span>
              Explorar a Copa
            </h3>
            <p className="font-body-md text-on-primary/90 mt-1">Conheça as 48 seleções e os 16 estádios incríveis.</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
            <div className="w-10 h-10 rounded-full bg-surface/20 flex items-center justify-center text-on-primary group-hover:translate-x-2 transition-transform backdrop-blur-md">
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Fase Mundial 26 — Todos os Jogos */}
      <section className="flex flex-col gap-stack-md">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-sm text-on-surface flex items-center gap-2">
            Fase Mundial <span className="text-primary">26</span>
          </h2>
          <Link 
            href="/matches" 
            className="flex items-center gap-1 text-primary hover:text-primary-fixed transition-colors font-label-caps text-sm bg-primary/10 hover:bg-primary/20 px-4 py-1.5 rounded-full border border-primary/20 no-underline"
          >
            VER JOGOS
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        
        <div className="-mx-margin-mobile px-margin-mobile flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4">
          
          {loading ? (
            /* Loading Skeleton Cards */
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[260px] shrink-0 rounded-xl bg-surface-container-high/60 backdrop-blur-md border border-outline-variant/30 p-4 snap-center flex flex-col gap-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-3 w-16 rounded bg-surface-variant/40"></div>
                  <div className="h-3 w-12 rounded bg-surface-variant/40"></div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-surface-variant/40"></div>
                    <div className="h-4 w-12 rounded bg-surface-variant/40"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-surface-variant/40"></div>
                    <div className="h-4 w-12 rounded bg-surface-variant/40"></div>
                  </div>
                </div>
              </div>
            ))
          ) : fixtures.length > 0 ? (
            fixtures.map((fixture, index) => (
              <MatchCard
                key={fixture.id}
                group={extractGroup(fixture.group, fixture.round)}
                time={formatBrasiliaTime(fixture.date)}
                teamHome={fixture.homeTeam.code}
                teamAway={fixture.awayTeam.code}
                logoHome={fixture.homeTeam.logo}
                logoAway={fixture.awayTeam.logo}
                scoreHome={fixture.goalsHome !== null ? String(fixture.goalsHome) : "-"}
                scoreAway={fixture.goalsAway !== null ? String(fixture.goalsAway) : "-"}
                variant={index % 2 === 0 ? "primary" : "secondary"}
                fixtureId={fixture.id}
              />
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-8 gap-3">
              <span className="material-symbols-outlined text-[36px] text-outline/40">event_busy</span>
              <p className="font-body-md text-on-surface-variant text-center">
                Jogos da Copa ainda não disponíveis.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* News Banner */}
      <section className="relative w-full h-[180px] rounded-xl overflow-hidden group cursor-pointer border border-outline-variant/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyr8D7yUra4ZPFEo9fMCkJu_URmC5ZDVN8AfBIipp5kfZ69f2MIJHbYSIE8_M5DzaeG77twbmGbPuN1k2UNQXyVZJCyuKHtUSebTOv6EB5wCMAf0tpYzAGFHcQiUo1_2irxr7CNzfQkHCkALvmwIGGqGt0giigo6xSPFUunUETqtFVmXgapC8yDNVLV8aw4Uv2wdSw_s9dsmZ2IX8D8pyz6rHTCVP-f1Eyk2KSJ5r1CZP6FQknWQARxTwZWNSfvpAR8mrZ21_10R8" alt="News" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-on-primary font-label-caps text-[10px] px-2 py-0.5 rounded">URGENTE</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant">2H ATRÁS</span>
          </div>
          <h3 className="font-headline-sm text-[20px] leading-tight text-on-surface font-bold">
            Golaço de Mbappé Garante Domínio na Fase de Grupos
          </h3>
        </div>
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface/50 backdrop-blur-md border border-outline-variant flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        </div>
      </section>

    </main>
  );
}