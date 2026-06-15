import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import LatestNewsBanner from "@/components/news/LatestNewsBanner";
import CountdownBanner from "@/components/CountdownBanner";
import type { ProcessedFixture } from "@/types/football";
import PredictorHomeBanner from "@/components/PredictorHomeBanner";
import HomeSearchBar from "@/components/HomeSearchBar";
import { getWorldCupFixtures, getNextBrazilMatch } from "@/lib/api";

export const revalidate = 60;

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

function extractGroup(group: string, round: string): string {
  if (group) {
    const match = group.match(/Group\s+([A-Z])/i);
    if (match) return `GRUPO ${match[1].toUpperCase()}`;
    return group.toUpperCase();
  }
  return round.toUpperCase();
}

function isLive(status: string): boolean {
  return ["1H", "2H", "HT", "ET", "P", "BT", "LIVE"].includes(status);
}

function isScheduled(status: string): boolean {
  return ["TBD", "NS"].includes(status);
}

export default async function Home() {
  let brazilMatch: ProcessedFixture | null = null;
  let fixtures: ProcessedFixture[] = [];
  let error = false;

  try {
    const [brazilData, fixturesData] = await Promise.all([
      getNextBrazilMatch(),
      getWorldCupFixtures()
    ]);
    brazilMatch = brazilData;
    fixtures = fixturesData || [];
  } catch (err) {
    console.error("Erro ao carregar dados no servidor:", err);
    error = true;
  }

  const brazilStatus = brazilMatch
    ? isLive(brazilMatch.status.short)
      ? { label: brazilMatch.status.elapsed ? `${brazilMatch.status.elapsed}' • AO VIVO` : `AO VIVO`, live: true }
      : isScheduled(brazilMatch.status.short)
      ? {
          label: `${formatBrasiliaDate(brazilMatch.date)} • ${formatBrasiliaTime(brazilMatch.date)}`,
          live: false,
        }
      : { label: brazilMatch.status.long.toUpperCase(), live: false }
    : null;

  return (
    <main className="pb-32 md:pb-10 md:pt-6 px-5 md:px-8 flex flex-col gap-8 min-h-screen max-w-[1600px] mx-auto w-full">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
        {/* Esquerda: Jogos e Features */}
        <div className="xl:col-span-8 flex flex-col gap-8">

          {/* Barra de Pesquisa */}
          <HomeSearchBar />

          {/* Countdown Banner */}
          <CountdownBanner />

          {/* Hero — Próximo Jogo do Brasil */}
          <section className="flex flex-col gap-3 w-full">
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#FFFFFF",
                fontFamily: "var(--font-sora), sans-serif",
              }}
            >
              Jogos Brasil
            </h2>

            {/* Card com estádio no fundo e detalhe "PRÓXIMO JOGO" com opacidade progressiva */}
            <div
              className="relative w-full rounded-[24px] overflow-hidden isolate group"
              style={{ minHeight: "260px", border: "1px solid rgba(101,177,163,0.2)" }}
            >
              {/* Imagem do estádio */}
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                src="/stadium.png"
                alt="Stadium"
                style={{ opacity: 0.5 }}
              />

              {/* Overlay gradiente progressivo de baixo para cima */}
              <div
                className="absolute inset-0 z-[1]"
                style={{
                  background:
                    "linear-gradient(to top, rgba(5,20,24,0.98) 0%, rgba(5,20,24,0.75) 45%, rgba(5,20,24,0.1) 100%)",
                }}
              />

              {/* Detalhe "PRÓXIMO JOGO" com opacidade que desvanece */}
              <div
                className="absolute inset-0 z-[2] flex flex-col items-center justify-center pointer-events-none select-none"
                style={{ opacity: 0.07 }}
              >
                <span
                  style={{
                    fontSize: "clamp(32px, 10vw, 56px)",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontFamily: "var(--font-sora), sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    lineHeight: 1.1,
                  }}
                >
                  PRÓXIMO
                </span>
                <span
                  style={{
                    fontSize: "clamp(32px, 10vw, 56px)",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontFamily: "var(--font-sora), sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    lineHeight: 1.1,
                  }}
                >
                  JOGO
                </span>
              </div>

              {/* Conteúdo do jogo */}
              <div className="relative z-[3] p-6 md:p-10 flex flex-col items-center text-center gap-5">
                {brazilMatch ? (
                  <>
                    {/* Chip de status */}
                    <div
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                      style={{
                        background: "rgba(5,20,24,0.7)",
                        backdropFilter: "blur(8px)",
                        border: `1px solid ${brazilStatus?.live ? "rgba(0,199,82,0.5)" : "rgba(101,177,163,0.3)"}`,
                      }}
                    >
                      {brazilStatus?.live && (
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ background: "#00C752" }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: brazilStatus?.live ? "#00C752" : "#A8C5C2",
                          fontFamily: "var(--font-sora), sans-serif",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {brazilStatus?.label}
                      </span>
                    </div>

                    {/* Times */}
                    <div className="flex items-center justify-center w-full gap-4 md:gap-12">
                      {/* Time da casa */}
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-[72px] h-[72px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden flex items-center justify-center"
                          style={{
                            background: "rgba(5,20,24,0.6)",
                            backdropFilter: "blur(8px)",
                            border: "2px solid rgba(101,177,163,0.25)",
                          }}
                        >
                          <img
                            className="w-full h-full object-cover"
                            src={brazilMatch.homeTeam.logo}
                            alt={brazilMatch.homeTeam.code}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            fontFamily: "var(--font-sora), sans-serif",
                          }}
                        >
                          {brazilMatch.homeTeam.code}
                        </span>
                      </div>

                      {/* Placar / VS */}
                      <div className="flex items-center gap-3">
                        <span
                          style={{
                            fontSize: "clamp(28px, 8vw, 48px)",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            fontFamily: "var(--font-sora), sans-serif",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {brazilMatch.goalsHome !== null ? brazilMatch.goalsHome : "-"}
                        </span>
                        <span
                          style={{
                            fontSize: "clamp(20px, 5vw, 32px)",
                            fontWeight: 300,
                            color: "#65B1A3",
                            fontFamily: "var(--font-sora), sans-serif",
                          }}
                        >
                          ·
                        </span>
                        <span
                          style={{
                            fontSize: "clamp(28px, 8vw, 48px)",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            fontFamily: "var(--font-sora), sans-serif",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {brazilMatch.goalsAway !== null ? brazilMatch.goalsAway : "-"}
                        </span>
                      </div>

                      {/* Time visitante */}
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-[72px] h-[72px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden flex items-center justify-center"
                          style={{
                            background: "rgba(5,20,24,0.6)",
                            backdropFilter: "blur(8px)",
                            border: "2px solid rgba(101,177,163,0.25)",
                          }}
                        >
                          <img
                            className="w-full h-full object-cover"
                            src={brazilMatch.awayTeam.logo}
                            alt={brazilMatch.awayTeam.code}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            fontFamily: "var(--font-sora), sans-serif",
                          }}
                        >
                          {brazilMatch.awayTeam.code}
                        </span>
                      </div>
                    </div>

                    {/* Botão */}
                    <Link
                      href={`/match?id=${brazilMatch.id}`}
                      className="px-8 py-3 rounded-full font-bold flex items-center gap-2 no-underline transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: brazilStatus?.live
                          ? "linear-gradient(135deg, #00C752, #00a044)"
                          : "linear-gradient(135deg, #1F6663, #65B1A3)",
                        color: "#051418",
                        fontSize: "14px",
                        fontWeight: 700,
                        fontFamily: "var(--font-sora), sans-serif",
                        boxShadow: "0 4px 16px rgba(31,102,99,0.4)",
                      }}
                    >
                      {brazilStatus?.live ? "ASSISTIR AO VIVO" : "Ver Detalhes"}
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                        {brazilStatus?.live ? "live_tv" : "arrow_forward"}
                      </span>
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-10">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "48px", color: "rgba(101,177,163,0.4)" }}
                    >
                      sports_soccer
                    </span>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#A8C5C2",
                        fontFamily: "var(--font-sora), sans-serif",
                        textAlign: "center",
                      }}
                    >
                      {error
                        ? "Erro ao carregar dados. Tente novamente mais tarde."
                        : "Nenhum jogo do Brasil disponível no momento."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Próximos Jogos */}
          <section className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-sora), sans-serif",
                }}
              >
                Próximos jogos
              </h2>
              <Link
                href="/matches"
                className="flex items-center gap-1 no-underline px-4 py-1.5 rounded-full transition-all hover:brightness-110"
                style={{
                  background: "rgba(101,177,163,0.15)",
                  border: "1px solid rgba(101,177,163,0.3)",
                  color: "#65B1A3",
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "var(--font-sora), sans-serif",
                }}
              >
                Ver Jogos
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="-mx-5 px-5 md:mx-0 md:px-0 flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2 md:grid md:grid-cols-2 lg:grid-cols-3">
              {fixtures.filter(f => !["FT", "AET", "PEN", "PST", "CANC"].includes(f.status.short) || f.timestamp * 1000 > Date.now()).length > 0 ? (
                fixtures.filter(f => !["FT", "AET", "PEN", "PST", "CANC"].includes(f.status.short) || f.timestamp * 1000 > Date.now()).slice(0, 6).map((fixture, index) => (
                  <div key={fixture.id} className="min-w-[280px] md:min-w-0 snap-start">
                    <MatchCard
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
                      fullWidth={true}
                      statusShort={fixture.status.short}
                    />
                  </div>
                ))
              ) : (
                <div
                  className="w-full md:col-span-3 flex flex-col items-center justify-center py-10 gap-3 rounded-2xl"
                  style={{ border: "1px solid rgba(101,177,163,0.15)", background: "rgba(27,53,56,0.2)" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "36px", color: "rgba(101,177,163,0.4)" }}
                  >
                    event_busy
                  </span>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#A8C5C2",
                      fontFamily: "var(--font-sora), sans-serif",
                      textAlign: "center",
                    }}
                  >
                    Jogos da Copa ainda não disponíveis.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Bolão da Copa Banner */}
          <PredictorHomeBanner />

          {/* Prateleira da Seleção Banner */}
          <section>
            <Link
              href="/prateleira"
              className="relative w-full rounded-[20px] overflow-hidden group flex items-center p-7 no-underline transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #1B1A2A 0%, #2A2359 50%, #483278 100%)",
                border: "1px solid rgba(137,101,255,0.3)",
                boxShadow: "0 8px 32px rgba(27,26,42,0.5)",
              }}
            >
              {/* Decoração radial */}
              <div
                className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #A589FF, transparent)" }}
              />
              <div
                className="absolute right-20 -bottom-8 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #483278, transparent)" }}
              />

              <div className="flex flex-col justify-center z-10 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(137,101,255,0.15)",
                      border: "1px solid rgba(137,101,255,0.3)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "22px",
                        color: "#A589FF",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      view_kanban
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      fontFamily: "var(--font-sora), sans-serif",
                    }}
                  >
                    Prateleira da Seleção
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#C2BCE0",
                    fontFamily: "var(--font-sora), sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  Monte sua Tier List interativa da Copa do Mundo.
                </p>
              </div>

              <div
                className="z-10 transition-transform duration-300 group-hover:translate-x-2"
                style={{ color: "#A589FF" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                  arrow_forward
                </span>
              </div>
            </Link>
          </section>

          {/* Prancheta Tática Banner */}
          <section>
            <Link
              href="/prancheta"
              className="relative w-full rounded-[20px] overflow-hidden group flex items-center p-7 no-underline transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #0A1C14 0%, #123321 50%, #165230 100%)",
                border: "1px solid rgba(16,185,129,0.3)",
                boxShadow: "0 8px 32px rgba(10,28,20,0.5)",
              }}
            >
              {/* Decoração radial */}
              <div
                className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #34D399, transparent)" }}
              />
              <div
                className="absolute right-20 -bottom-8 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #10B981, transparent)" }}
              />

              <div className="flex flex-col justify-center z-10 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(16,185,129,0.15)",
                      border: "1px solid rgba(16,185,129,0.3)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "22px",
                        color: "#34D399",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      sports_soccer
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      fontFamily: "var(--font-sora), sans-serif",
                    }}
                  >
                    Prancheta Tática
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#A7F3D0",
                    fontFamily: "var(--font-sora), sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  Simule escalações e movimentações no campo.
                </p>
              </div>

              <div
                className="z-10 transition-transform duration-300 group-hover:translate-x-2"
                style={{ color: "#34D399" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                  arrow_forward
                </span>
              </div>
            </Link>
          </section>

          {/* Explorar a Copa Banner */}
          <section>
            <Link
              href="/explore"
              className="relative w-full rounded-[20px] overflow-hidden group flex items-center p-7 no-underline transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #051418 0%, #1B3538 50%, #1F6663 100%)",
                border: "1px solid rgba(101,177,163,0.3)",
                boxShadow: "0 8px 32px rgba(5,20,24,0.5)",
              }}
            >
              {/* Decoração radial */}
              <div
                className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #65B1A3, transparent)" }}
              />
              <div
                className="absolute right-20 -bottom-8 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #1F6663, transparent)" }}
              />

              <div className="flex flex-col justify-center z-10 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(101,177,163,0.15)",
                      border: "1px solid rgba(101,177,163,0.3)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "22px",
                        color: "#65B1A3",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      explore
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      fontFamily: "var(--font-sora), sans-serif",
                    }}
                  >
                    Explorar a Copa
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#A8C5C2",
                    fontFamily: "var(--font-sora), sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  Conheça as 48 seleções e os 16 estádios incríveis.
                </p>
              </div>

              <div
                className="z-10 transition-transform duration-300 group-hover:translate-x-2"
                style={{ color: "#65B1A3" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                  arrow_forward
                </span>
              </div>
            </Link>
          </section>
        </div>

        {/* Direita: Notícias (Sidebar on desktop) */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <section className="sticky top-10">
            <LatestNewsBanner />
          </section>
        </div>
      </div>
    </main>
  );
}