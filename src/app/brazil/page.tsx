import Link from "next/link";
import { getWorldCupFixtures } from "@/lib/api";
import MatchCard from "@/components/MatchCard";
import CountdownBanner from "@/components/CountdownBanner";

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
    month: "long",
  });
}

// Extrai o grupo
function extractGroup(group: string, round: string): string {
  if (group) {
    const match = group.match(/Group\s+([A-Z])/i);
    if (match) return `GRUPO ${match[1].toUpperCase()}`;
    return group.toUpperCase();
  }
  return round.toUpperCase();
}

export default async function BrazilPage() {
  const fixtures = await getWorldCupFixtures();
  
  // Filtra apenas jogos do Brasil e ordena por data crescente
  const brazilFixtures = fixtures.filter(
    (e) => e.homeTeam.code === "BRA" || e.awayTeam.code === "BRA"
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Agrupa os jogos por data para separar visualmente na agenda
  const groupedByDate: Record<string, typeof brazilFixtures> = {};
  brazilFixtures.forEach(fixture => {
    const dateKey = formatBrasiliaDate(fixture.date);
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(fixture);
  });

  return (
    <main className="pt-6 pb-28 px-margin-mobile flex flex-col gap-stack-lg min-h-screen">
      
      {/* Header do Brasil */}
      <section className="flex flex-col items-center gap-4 text-center">
        <div className="w-24 h-24 rounded-full border-4 border-brand-green bg-brand-surface flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(0,199,82,0.3)]">
           <img src="https://flagcdn.com/br.svg" alt="Brasil" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="font-headline-sm text-brand-green font-bold text-3xl">Brasil na Copa</h2>
          <p className="font-body-md text-white/70 mt-1">Acompanhe a agenda oficial da seleção rumo ao Hexa</p>
        </div>
      </section>

      {brazilFixtures.length > 0 && (
        <section className="w-full mt-2">
          <CountdownBanner 
            targetDate={brazilFixtures[0].date}
            title="Estreia do Brasil"
            modalTitle="A Estreia da Seleção"
            modalDescription={`A contagem regressiva para o primeiro jogo do Brasil na Copa do Mundo FIFA 2026™ já começou! O Brasil vai enfrentar ${brazilFixtures[0].homeTeam.code === "BRA" ? brazilFixtures[0].awayTeam.code : brazilFixtures[0].homeTeam.code}.`}
          />
        </section>
      )}

      {/* Lista de Jogos (Agenda) */}
      <section className="flex flex-col gap-8">
        {Object.keys(groupedByDate).length > 0 ? (
          Object.keys(groupedByDate).map((date) => (
            <div key={date} className="flex flex-col gap-4">
              {/* Linha da Data */}
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-brand-green/30"></div>
                <span className="font-label-caps text-brand-green font-bold text-xs uppercase bg-brand-green/10 px-4 py-1.5 rounded-full border border-brand-green/20">
                  {date}
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-brand-green/30"></div>
              </div>
              
              {/* Cards dos Jogos daquela Data */}
              <div className="flex flex-col gap-4 items-center w-full">
                {groupedByDate[date].map((fixture, index) => (
                  <div key={fixture.id} className="w-full max-w-[340px]">
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
                      venue={fixture.venue || "Estádio a definir"}
                      fullWidth={true}
                      borderColor="border-brand-green"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-8 gap-3">
            <span className="material-symbols-outlined text-[36px] text-outline/40">event_busy</span>
            <p className="font-body-md text-on-surface-variant text-center">
              A agenda do Brasil ainda não está disponível.
            </p>
          </div>
        )}
      </section>

      {/* Mini História e Títulos (Dourado) */}
      <section className="flex flex-col gap-6 mt-6">
        <div className="bg-brand-surface/60 border border-white/10 rounded-2xl p-6 text-center">
          <h3 className="font-headline-sm text-white font-bold text-xl mb-3">O País do Futebol</h3>
          <p className="font-body-md text-white/70 leading-relaxed text-sm">
            A Seleção Brasileira é a única equipe do planeta a participar de todas as edições da Copa do Mundo FIFA. Conhecida mundialmente pelo seu futebol ofensivo, alegre e pela ginga inconfundível, a camisa Canarinho carrega a maior glória do futebol mundial.
          </p>
        </div>

        <div className="border border-[#FFD700]/50 bg-[#FFD700]/10 rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-[0_0_20px_rgba(255,215,0,0.15)] relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
          
          <div className="flex gap-1.5 text-[#FFD700]">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="material-symbols-outlined font-bold text-[28px] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            ))}
          </div>
          
          <h3 className="font-headline-sm text-[#FFD700] font-bold text-2xl tracking-wide uppercase">Pentacampeã Mundial</h3>
          
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {[
              { year: "1958", host: "Suécia" },
              { year: "1962", host: "Chile" },
              { year: "1970", host: "México" },
              { year: "1994", host: "EUA" },
              { year: "2002", host: "Japão/Coreia" }
            ].map((title) => (
              <div key={title.year} className="flex flex-col items-center px-4 py-2 rounded-xl border border-[#FFD700]/40 bg-brand-surface shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                <span className="text-[#FFD700] font-bold text-lg font-stats-num">{title.year}</span>
                <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider">{title.host}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </main>
  );
}
