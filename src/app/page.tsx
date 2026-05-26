"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import LatestNewsBanner from "@/components/news/LatestNewsBanner";
import CountdownBanner from "@/components/CountdownBanner";
import Loading from "./loading";
import type { ProcessedFixture } from "@/types/football";
import PredictorHomeBanner from "@/components/PredictorHomeBanner";

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

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="pt-20 pb-28 px-margin-mobile flex flex-col gap-stack-lg min-h-screen">
      
      {/* Live Match Hero — Próximo Jogo do Brasil */}
      <section className="flex flex-col gap-4 w-full mt-4">
        <CountdownBanner />
        <h2 className="font-headline-sm text-white font-bold text-2xl mt-4">Jogos Brasil</h2>
        <div className="relative w-full rounded-[24px] overflow-hidden border border-brand-blue bg-brand-surface isolate group">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8sQS0VdLDybkkIr66aNQ3AGqicZJDri83yEl2NxJlEUf6j7QWOK7hY7-IVNB1eMeyBN8wkoLa4N2SIYW9PZI3GXjd_grFwv4TBvZ_1fe2OIPipeodFdvpmyLGW9wnuHk5f-NJw0-uG1T1FWfTDm6iVOnmgJXuzObLHqi0lI2xKH97VipmwoYnTdC77d5nZTC81PBzQF9bCu2_GYL95TztOXFqXYcQV2XSsd_tweud6z1QHl6wTBO6PdJ61bqyaPxwbqMS0GG69ZY" alt="Stadium Background" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/80 to-brand-surface/20 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 p-6 flex flex-col items-center text-center gap-6">
          
          {brazilMatch ? (
            <>
              {/* Status Chip */}
              {/* Status Chip */}
              <div className={`flex items-center gap-2 backdrop-blur-md px-4 py-1 rounded-full bg-brand-surface/60 border border-brand-green`}>
                {brazilStatus?.live && (
                  <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
                )}
                <span className={`font-label-caps text-white/60 font-bold`}>
                  {brazilStatus?.label}
                </span>
              </div>
              
              {/* Times e Placar */}
              <div className="flex items-center justify-between w-full max-w-[280px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-[84px] h-[84px] rounded-full overflow-hidden bg-brand-surface border border-white/10 flex items-center justify-center">
                    <img className="w-full h-full object-cover" src={brazilMatch.homeTeam.logo} alt={brazilMatch.homeTeam.code} />
                  </div>
                  <span className="font-headline-sm text-brand-blue font-bold">{brazilMatch.homeTeam.code}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-stats-num text-[28px] leading-none text-brand-blue font-bold tracking-tighter">
                    {brazilMatch.goalsHome !== null ? brazilMatch.goalsHome : "-"}
                  </span>
                  <span className="font-display-lg text-brand-blue font-bold text-[28px] pb-1">-</span>
                  <span className="font-stats-num text-[28px] leading-none text-brand-blue font-bold tracking-tighter">
                    {brazilMatch.goalsAway !== null ? brazilMatch.goalsAway : "-"}
                  </span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-[84px] h-[84px] rounded-full overflow-hidden bg-brand-surface border border-white/10 flex items-center justify-center">
                    <img className="w-full h-full object-cover" src={brazilMatch.awayTeam.logo} alt={brazilMatch.awayTeam.code} />
                  </div>
                  <span className="font-headline-sm text-brand-blue font-bold">{brazilMatch.awayTeam.code}</span>
                </div>
              </div>
              
              {/* Botão */}
              <Link
                href={`/match?id=${brazilMatch.id}`}
                className="bg-brand-green text-white font-bold px-6 py-2 rounded-full flex items-center gap-2 mt-2 no-underline"
              >
                {brazilStatus?.live ? "ASSISTIR AO VIVO" : "Ver Detalhes"}
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
        </div>
      </section>


      {/* Explorar Banner */}
      <section className="flex flex-col gap-2 order-last mt-6">
        <Link 
          href="/explore"
          className="relative w-full rounded-2xl overflow-hidden group bg-brand-red border border-brand-orange flex items-center p-6"
        >
          <div className="flex flex-col justify-center z-10 w-[80%]">
            <h3 className="font-headline-md text-white font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[28px]">public</span>
              Explorar a Copa
            </h3>
            <p className="font-body-md text-white/90 mt-1 text-sm leading-tight">Conheça as 48 seleções e os 16 estádios incríveis.</p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white">
            <span className="material-symbols-outlined font-bold text-[24px]">arrow_forward</span>
          </div>
        </Link>
      </section>

      {/* Fase Mundial 26 — Todos os Jogos */}
      <section className="flex flex-col gap-stack-md mt-4">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-sm text-white font-bold text-2xl">
            Próximos jogos
          </h2>
          <Link 
            href="/matches" 
            className="flex items-center gap-1 text-white bg-brand-green px-4 py-1.5 rounded-full font-bold text-sm no-underline"
          >
            Ver Jogos
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        
        <div className="-mx-margin-mobile px-margin-mobile flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4">
          
          {fixtures.length > 0 ? (
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
                venue={fixture.venue}
                fullWidth={false}
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

      {/* Latest News Banner */}
      <section className="mt-8">
        <LatestNewsBanner />
      </section>

      {/* Bolão da Copa Banner */}
      <PredictorHomeBanner />

    </main>
  );
}