import Link from "next/link";
import { getWorldCupFixtures, normalizeTeamName } from "@/lib/api";
import MatchCard from "@/components/MatchCard";
import CountdownBanner from "@/components/CountdownBanner";
import BackButton from "@/components/BackButton";

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

export default async function TeamPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const normalizedRequestedName = normalizeTeamName(decodedName);
  
  const fixtures = await getWorldCupFixtures();
  
  // Filtra apenas jogos do time e ordena por data crescente
  const teamFixtures = fixtures.filter((e) => {
    return normalizeTeamName(e.homeTeam.name) === normalizedRequestedName ||
           normalizeTeamName(e.awayTeam.name) === normalizedRequestedName;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Agrupa os jogos por data para separar visualmente na agenda
  const groupedByDate: Record<string, typeof teamFixtures> = {};
  teamFixtures.forEach(fixture => {
    const dateKey = formatBrasiliaDate(fixture.date);
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(fixture);
  });

  // Get real team name and logo from the first match
  let teamRealName = decodedName;
  let teamLogo = "";
  if (teamFixtures.length > 0) {
    const firstMatch = teamFixtures[0];
    if (normalizeTeamName(firstMatch.homeTeam.name) === normalizedRequestedName) {
      teamRealName = firstMatch.homeTeam.name;
      teamLogo = firstMatch.homeTeam.logo;
    } else {
      teamRealName = firstMatch.awayTeam.name;
      teamLogo = firstMatch.awayTeam.logo;
    }
  }

  return (
    <main className="pt-6 pb-28 px-margin-mobile flex flex-col gap-stack-lg min-h-screen">
      <div className="absolute top-6 left-margin-mobile">
        <BackButton />
      </div>
      
      {/* Header do Time */}
      <section className="flex flex-col items-center gap-4 text-center mt-8">
        <div className="w-24 h-24 rounded-full border-4 border-primary bg-brand-surface flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(99,50,229,0.3)]">
           {teamLogo ? (
             <img src={teamLogo} alt={teamRealName} className="w-full h-full object-cover" />
           ) : (
             <span className="material-symbols-outlined text-[48px] text-primary">public</span>
           )}
        </div>
        <div>
          <h2 className="font-headline-sm text-primary font-bold text-3xl">{teamRealName} na Copa</h2>
          <p className="font-body-md text-white/70 mt-1">Acompanhe a agenda oficial da seleção</p>
        </div>
      </section>

      {/* Próximo Jogo */}
      {teamFixtures.length > 0 && (
        <section className="w-full mt-2">
          {(() => {
            const now = new Date().getTime();
            const nextMatch = teamFixtures.find(f => new Date(f.date).getTime() > now);
            if (nextMatch) {
              const opponent = normalizeTeamName(nextMatch.homeTeam.name) === normalizedRequestedName ? nextMatch.awayTeam.name : nextMatch.homeTeam.name;
              return (
                <CountdownBanner 
                  targetDate={nextMatch.date}
                  title={`Próximo jogo: ${teamRealName}`}
                  modalTitle="Próxima Partida"
                  modalDescription={`A contagem regressiva para o próximo jogo de ${teamRealName} na Copa do Mundo FIFA 2026™ já começou! Eles vão enfrentar ${opponent}.`}
                />
              );
            }
            return null;
          })()}
        </section>
      )}

      {/* Lista de Jogos (Agenda) */}
      <section className="flex flex-col gap-8">
        {Object.keys(groupedByDate).length > 0 ? (
          Object.keys(groupedByDate).map((date) => (
            <div key={date} className="flex flex-col gap-4">
              {/* Linha da Data */}
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary/30"></div>
                <span className="font-label-caps text-primary font-bold text-xs uppercase bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                  {date}
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary/30"></div>
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
                      borderColor="border-primary"
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
              A agenda dessa seleção não está disponível ou não foi encontrada.
            </p>
          </div>
        )}
      </section>
      
    </main>
  );
}
