import type {
  FlashscoreEvent,
  FlashscoreMatchDetails,
  FlashscoreStatPeriod,
  ProcessedFixture,
  ProcessedMatchDetail,
  FixtureStatus,
} from "@/types/football";
import worldcupData from "@/data/worldcup.json";

import { fetchFromSportDB } from "@/services/sportdb.service";

const SEASON = "2026";

// Resolve URL do logo (pode vir como caminho parcial ou URL completa)
function resolveLogoUrl(logo: string): string {
  if (!logo) return "";
  if (logo.startsWith("http")) return logo;
  return `https://static.flashscore.com/res/image/data/${logo}`;
}

// Dicionário de traduções de países (Inglês -> Português + Código PT)
const COUNTRY_TRANSLATIONS: Record<string, { name: string; code: string; iso2: string }> = {
  "Brazil": { name: "Brasil", code: "BRA", iso2: "br" },
  "Argentina": { name: "Argentina", code: "ARG", iso2: "ar" },
  "France": { name: "França", code: "FRA", iso2: "fr" },
  "England": { name: "Inglaterra", code: "ING", iso2: "gb-eng" },
  "Spain": { name: "Espanha", code: "ESP", iso2: "es" },
  "Germany": { name: "Alemanha", code: "ALE", iso2: "de" },
  "Portugal": { name: "Portugal", code: "POR", iso2: "pt" },
  "Netherlands": { name: "Holanda", code: "HOL", iso2: "nl" },
  "Italy": { name: "Itália", code: "ITA", iso2: "it" },
  "Croatia": { name: "Croácia", code: "CRO", iso2: "hr" },
  "Morocco": { name: "Marrocos", code: "MAR", iso2: "ma" },
  "USA": { name: "Estados Unidos", code: "EUA", iso2: "us" },
  "Mexico": { name: "México", code: "MEX", iso2: "mx" },
  "Canada": { name: "Canadá", code: "CAN", iso2: "ca" },
  "Uruguay": { name: "Uruguai", code: "URU", iso2: "uy" },
  "Colombia": { name: "Colômbia", code: "COL", iso2: "co" },
  "Japan": { name: "Japão", code: "JAP", iso2: "jp" },
  "South Korea": { name: "Coreia do Sul", code: "COR", iso2: "kr" },
  "Australia": { name: "Austrália", code: "AUS", iso2: "au" },
  "Senegal": { name: "Senegal", code: "SEN", iso2: "sn" },
  "Switzerland": { name: "Suíça", code: "SUI", iso2: "ch" },
  "Cameroon": { name: "Camarões", code: "CAM", iso2: "cm" },
  "Ecuador": { name: "Equador", code: "EQU", iso2: "ec" },
  "Saudi Arabia": { name: "Arábia Saudita", code: "ARA", iso2: "sa" },
  "Wales": { name: "País de Gales", code: "GAL", iso2: "gb-wls" },
  "Poland": { name: "Polônia", code: "POL", iso2: "pl" },
  "Serbia": { name: "Sérvia", code: "SER", iso2: "rs" },
  "Ghana": { name: "Gana", code: "GAN", iso2: "gh" },
  "Costa Rica": { name: "Costa Rica", code: "CRC", iso2: "cr" },
  "Iran": { name: "Irã", code: "IRA", iso2: "ir" },
  "Belgium": { name: "Bélgica", code: "BEL", iso2: "be" },
  "Denmark": { name: "Dinamarca", code: "DIN", iso2: "dk" },
  "Tunisia": { name: "Tunísia", code: "TUN", iso2: "tn" },
  "Qatar": { name: "Catar", code: "CAT", iso2: "qa" },
  "Chile": { name: "Chile", code: "CHI", iso2: "cl" },
  "Peru": { name: "Peru", code: "PER", iso2: "pe" },
  "Sweden": { name: "Suécia", code: "SUE", iso2: "se" },
  "Nigeria": { name: "Nigéria", code: "NGA", iso2: "ng" },
  "Egypt": { name: "Egito", code: "EGI", iso2: "eg" },
  "Algeria": { name: "Argélia", code: "ARG", iso2: "dz" },
  "Ivory Coast": { name: "Costa do Marfim", code: "CMA", iso2: "ci" },
  "Mali": { name: "Mali", code: "MAL", iso2: "ml" },
  "South Africa": { name: "África do Sul", code: "AFS", iso2: "za" },
  "Panama": { name: "Panamá", code: "PAN", iso2: "pa" },
  "Haiti": { name: "Haiti", code: "HAI", iso2: "ht" },
  "Scotland": { name: "Escócia", code: "ESC", iso2: "gb-sct" },
  "Czech Republic": { name: "República Tcheca", code: "TCH", iso2: "cz" },
  "D.R. Congo": { name: "RD Congo", code: "RDC", iso2: "cd" },
  "Uzbekistan": { name: "Uzbequistão", code: "UZB", iso2: "uz" },
  "Jordan": { name: "Jordânia", code: "JOR", iso2: "jo" },
  "Austria": { name: "Áustria", code: "AUT", iso2: "at" },
  "Bosnia & Herzegovina": { name: "Bósnia e Herzegovina", code: "BOS", iso2: "ba" },
  "Paraguay": { name: "Paraguai", code: "PAR", iso2: "py" },
  "Turkey": { name: "Turquia", code: "TUR", iso2: "tr" },
  "Curaçao": { name: "Curaçau", code: "CUR", iso2: "cw" },
  "New Zealand": { name: "Nova Zelândia", code: "NZL", iso2: "nz" },
  "Cape Verde": { name: "Cabo Verde", code: "CAV", iso2: "cv" },
  "Iraq": { name: "Iraque", code: "IRQ", iso2: "iq" },
  "Norway": { name: "Noruega", code: "NOR", iso2: "no" },
  "DR Congo": { name: "RD Congo", code: "RDC", iso2: "cd" },
};

export function translateTeam(name: string, defaultCode?: string): { name: string; code: string; iso2: string } {
  const translation = COUNTRY_TRANSLATIONS[name];
  if (translation) return translation;
  // Fallback se não tiver tradução
  return {
    name,
    code: defaultCode || name.substring(0, 3).toUpperCase(),
    iso2: ""
  };
}

function translateRound(round: string): string {
  if (!round) return "";
  return round
    .replace("Round 1", "Rodada 1")
    .replace("Round 2", "Rodada 2")
    .replace("Round 3", "Rodada 3")
    .replace("Round of 16", "Oitavas de Final")
    .replace("Quarter-finals", "Quartas de Final")
    .replace("Semi-finals", "Semifinal")
    .replace("Final", "Final");
}

function translateGroup(group: string): string {
  if (!group) return "";
  return group.replace("Group", "Grupo");
}

// Mapeia eventStage da API para FixtureStatus compatível com o frontend
function mapEventStageToStatus(event: FlashscoreEvent): FixtureStatus {
  const stage = event.eventStage?.toUpperCase() || "";
  const gameTime = event.gameTime ? parseInt(event.gameTime) : null;

  switch (stage) {
    case "SCHEDULED":
    case "NOT_STARTED":
      return { long: "Não Iniciado", short: "NS", elapsed: null };
    case "LIVE":
    case "FIRST_HALF":
      return { long: "Primeiro Tempo", short: "1H", elapsed: gameTime };
    case "HALFTIME":
      return { long: "Intervalo", short: "HT", elapsed: 45 };
    case "SECOND_HALF":
      return { long: "Segundo Tempo", short: "2H", elapsed: gameTime };
    case "EXTRA_TIME":
      return { long: "Prorrogação", short: "ET", elapsed: gameTime };
    case "PENALTIES":
      return { long: "Pênaltis", short: "P", elapsed: 120 };
    case "FINISHED":
    case "ENDED":
      return { long: "Encerrado", short: "FT", elapsed: 90 };
    case "POSTPONED":
      return { long: "Adiado", short: "PST", elapsed: null };
    case "CANCELLED":
      return { long: "Cancelado", short: "CANC", elapsed: null };
    default:
      return { long: stage || "Desconhecido", short: stage?.substring(0, 3) || "UNK", elapsed: null };
  }
}

// Processa um evento da API para o formato ProcessedFixture do frontend
function processEvent(event: FlashscoreEvent): ProcessedFixture {
  const homeScore = event.homeScore ?? event.homeFullTimeScore ?? null;
  const awayScore = event.awayScore ?? event.awayFullTimeScore ?? null;

  return {
    id: event.eventId,
    date: event.startDateTimeUtc,
    timestamp: parseInt(event.startUtime || event.startTime),
    status: mapEventStageToStatus(event),
    venue: "",
    round: translateRound(event.round || ""),
    group: translateGroup(event.standingGroup || ""),
    homeTeam: {
      id: event.homeParticipantIds || event.homeEventParticipantId,
      name: translateTeam(event.homeName).name,
      code: translateTeam(event.homeName, event.home3CharName).code,
      logo: translateTeam(event.homeName).iso2 ? `https://flagcdn.com/${translateTeam(event.homeName).iso2}.svg` : resolveLogoUrl(event.homeLogo),
    },
    awayTeam: {
      id: event.awayParticipantIds || event.awayEventParticipantId,
      name: translateTeam(event.awayName).name,
      code: translateTeam(event.awayName, event.away3CharName).code,
      logo: translateTeam(event.awayName).iso2 ? `https://flagcdn.com/${translateTeam(event.awayName).iso2}.svg` : resolveLogoUrl(event.awayLogo),
    },
    goalsHome: homeScore !== null && homeScore !== undefined && homeScore !== "" ? parseInt(homeScore) : null,
    goalsAway: awayScore !== null && awayScore !== undefined && awayScore !== "" ? parseInt(awayScore) : null,
    detailsLink: event.links?.details || "",
    statsLink: event.links?.stats || "",
  };
}

// Normaliza nomes de times para fazer o match entre OpenFootball e SportDB
function normalizeTeamName(name: string): string {
  if (name === "DR Congo" || name === "D.R. Congo") return "D.R. Congo";
  if (name === "USA" || name === "United States") return "USA";
  return name;
}

// Retorna todos os jogos combinando o calendário estático com placares ao vivo
export async function getWorldCupFixtures(): Promise<ProcessedFixture[]> {
  const staticMatches = worldcupData.matches;
  
  // Tenta buscar atualizações ao vivo da API
  let liveFixtures: FlashscoreEvent[] = [];
  try {
    const data = await fetchFromSportDB<FlashscoreEvent[]>(`/${SEASON}/fixtures?page=1`);
    if (Array.isArray(data)) {
      liveFixtures = data.filter((e) => e.tournamentStage?.groupName === "Final tournament");
    }
  } catch (e) {
    console.error("Erro ao buscar live fixtures, usando dados estáticos", e);
  }

  // Tenta buscar resultados da API
  let results: FlashscoreEvent[] = [];
  try {
    const data = await fetchFromSportDB<FlashscoreEvent[]>(`/${SEASON}/results?page=1`);
    if (Array.isArray(data)) {
      results = data.filter((e) => e.tournamentStage?.groupName === "Final tournament");
    }
  } catch (e) {
    console.error("Erro ao buscar resultados, usando dados estáticos", e);
  }

  const allApiEvents = [...liveFixtures, ...results];

  const processedMatches = staticMatches.map((staticMatch) => {
    // Tenta encontrar o correspondente na API
    const apiMatch = allApiEvents.find(
      (e) =>
        normalizeTeamName(e.homeName) === normalizeTeamName(staticMatch.homeTeam) &&
        normalizeTeamName(e.awayName) === normalizeTeamName(staticMatch.awayTeam)
    );

    const homeTeam = translateTeam(staticMatch.homeTeam);
    const awayTeam = translateTeam(staticMatch.awayTeam);

    const baseFixture: ProcessedFixture = {
      id: staticMatch.id, // O ID local, mas no details vamos precisar do API ID
      date: staticMatch.date,
      timestamp: new Date(staticMatch.date).getTime() / 1000,
      status: { long: "Não Iniciado", short: "NS", elapsed: null },
      venue: staticMatch.venue,
      round: translateRound(staticMatch.round),
      group: translateGroup(staticMatch.group),
      homeTeam: {
        id: "h",
        name: homeTeam.name,
        code: homeTeam.code,
        logo: homeTeam.iso2 ? `https://flagcdn.com/${homeTeam.iso2}.svg` : `https://flagsapi.com/${homeTeam.code}/flat/64.png`, // Fallback
      },
      awayTeam: {
        id: "a",
        name: awayTeam.name,
        code: awayTeam.code,
        logo: awayTeam.iso2 ? `https://flagcdn.com/${awayTeam.iso2}.svg` : `https://flagsapi.com/${awayTeam.code}/flat/64.png`, // Fallback
      },
      goalsHome: null,
      goalsAway: null,
      detailsLink: "",
      statsLink: "",
    };

    if (apiMatch) {
      // Mescla os dados da API
      const processedApi = processEvent(apiMatch);
      baseFixture.status = processedApi.status;
      baseFixture.goalsHome = processedApi.goalsHome;
      baseFixture.goalsAway = processedApi.goalsAway;
      baseFixture.detailsLink = processedApi.detailsLink;
      baseFixture.statsLink = processedApi.statsLink;
      // Keep static logos instead of overwriting with API logos which might be missing/incorrect
      // baseFixture.homeTeam.logo = processedApi.homeTeam.logo;
      // baseFixture.awayTeam.logo = processedApi.awayTeam.logo;
      // Salva o ID real da API para buscar detalhes depois
      baseFixture.id = apiMatch.eventId;
    }

    return baseFixture;
  });

  // Estratégia de Atualização de Tempo Real:
  // Verifica se há jogos acontecendo AGORA (entre o horário de início e ~3h depois)
  const now = Date.now();
  const activeMatches = processedMatches.filter(m => {
    // Só atualiza se já temos o ID real da API (não o mock "m_X")
    if (m.id.startsWith("m_")) return false;
    
    const matchTime = m.timestamp * 1000;
    // O jogo é considerado "ativo" se passou da hora de início e ainda não deu 3h de jogo
    return now >= matchTime && now <= matchTime + (3 * 60 * 60 * 1000);
  });

  // Para jogos ativos, busca apenas o detalhe de forma agressiva (TTL = 60s)
  if (activeMatches.length > 0) {
    await Promise.all(activeMatches.map(async (match) => {
      try {
        const liveDetail = await fetchFromSportDB<FlashscoreMatchDetails>(`/match/${match.id}/details`, 30);
        if (liveDetail) {
          match.goalsHome = liveDetail.homeScore !== undefined ? parseInt(liveDetail.homeScore) : match.goalsHome;
          match.goalsAway = liveDetail.awayScore !== undefined ? parseInt(liveDetail.awayScore) : match.goalsAway;
          
          if (match.status.short === "NS") {
            match.status = { long: "Ao Vivo", short: "LIVE", elapsed: null };
          }
        }
      } catch (e) {
        console.error("Erro ao buscar detalhes ao vivo para o jogo:", match.id);
      }
    }));
  }

  return processedMatches;
}

// Pega o jogo de destaque do Brasil
export async function getNextBrazilMatch(): Promise<ProcessedFixture | null> {
  const fixtures = await getWorldCupFixtures();
  
  const brazilFixtures = fixtures.filter(
    (e) => e.homeTeam.code === "BRA" || e.awayTeam.code === "BRA"
  );

  if (brazilFixtures.length === 0) return null;

  // 1. Ao vivo
  const liveMatch = brazilFixtures.find((e) =>
    ["1H", "2H", "HT", "ET", "P", "LIVE"].includes(e.status.short)
  );
  if (liveMatch) return liveMatch;

  // 2. Próximo
  const now = new Date().getTime();
  const upcomingMatches = brazilFixtures.filter((e) => e.timestamp * 1000 > now);
  if (upcomingMatches.length > 0) {
    return upcomingMatches.sort((a, b) => a.timestamp - b.timestamp)[0];
  }

  // 3. Último terminado
  const finishedMatches = brazilFixtures.filter((e) =>
    ["FT", "AET", "PEN"].includes(e.status.short)
  );
  if (finishedMatches.length > 0) {
    return finishedMatches.sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  return brazilFixtures[0];
}

// Pega detalhes completos de um fixture
export async function getFixtureDetails(
  eventId: string,
  detailsLink?: string,
  statsLink?: string
): Promise<ProcessedMatchDetail | null> {
  // Monta os links se não forem passados
  const detailPath = detailsLink || `/api/flashscore/match/${eventId}/details`;
  const statsPath = statsLink || `/api/flashscore/match/${eventId}/stats`;

  // Busca o evento original nos fixtures e results para dados básicos
  let eventData: FlashscoreEvent | null = null;

  // Tenta achar nos fixtures
  const fixtures = await fetchFromSportDB<FlashscoreEvent[]>(
    `/${SEASON}/fixtures?page=1`
  );
  if (Array.isArray(fixtures)) {
    eventData = fixtures.find((e) => e.eventId === eventId) || null;
  }

  // Se não encontrou, tenta nos results
  if (!eventData) {
    const results = await fetchFromSportDB<FlashscoreEvent[]>(
      `/${SEASON}/results?page=1`
    );
    if (Array.isArray(results)) {
      eventData = results.find((e) => e.eventId === eventId) || null;
    }
  }

  // Se não encontrou na API, tenta achar no arquivo estático
  if (!eventData) {
    const staticMatchById = worldcupData.matches.find((m) => m.id === eventId);
    
    // Se também não achar no estático, aí sim retorna null (404)
    if (!staticMatchById) return null;

    const homeTeam = translateTeam(staticMatchById.homeTeam);
    const awayTeam = translateTeam(staticMatchById.awayTeam);

    return {
      id: staticMatchById.id,
      date: staticMatchById.date,
      timestamp: new Date(staticMatchById.date).getTime() / 1000,
      status: { long: "Não Iniciado", short: "NS", elapsed: null },
      venue: staticMatchById.venue,
      round: translateRound(staticMatchById.round),
      group: translateGroup(staticMatchById.group),
      homeTeam: {
        id: "h",
        name: homeTeam.name,
        code: homeTeam.code,
        logo: homeTeam.iso2 ? `https://flagcdn.com/${homeTeam.iso2}.svg` : `https://flagsapi.com/${homeTeam.code}/flat/64.png`,
      },
      awayTeam: {
        id: "a",
        name: awayTeam.name,
        code: awayTeam.code,
        logo: awayTeam.iso2 ? `https://flagcdn.com/${awayTeam.iso2}.svg` : `https://flagsapi.com/${awayTeam.code}/flat/64.png`,
      },
      goalsHome: null,
      goalsAway: null,
      detailsLink: "",
      statsLink: "",
      events: [],
      statistics: [],
      referee: "",
      attendance: "",
    };
  }

  // Busca detalhes e estatísticas em paralelo apenas se for um evento da API
  const [matchDetails, matchStats] = await Promise.all([
    fetchFromSportDB<FlashscoreMatchDetails>(detailPath.replace('/api/flashscore/football/world:8/world-cup:lvUBR5F8', '')).catch(() => null),
    fetchFromSportDB<FlashscoreStatPeriod[]>(statsPath.replace('/api/flashscore/football/world:8/world-cup:lvUBR5F8', '')).catch(() => []),
  ]);

  const processed = processEvent(eventData);

  // Busca o match estático correspondente para usar dados garantidos (venue, logos corretos)
  const staticMatch = worldcupData.matches.find(
    (m) =>
      normalizeTeamName(m.homeTeam) === normalizeTeamName(eventData!.homeName) &&
      normalizeTeamName(m.awayTeam) === normalizeTeamName(eventData!.awayName)
  );

  if (staticMatch) {
    const homeTeam = translateTeam(staticMatch.homeTeam);
    const awayTeam = translateTeam(staticMatch.awayTeam);
    
    processed.venue = staticMatch.venue;
    processed.homeTeam.logo = homeTeam.iso2 ? `https://flagcdn.com/${homeTeam.iso2}.svg` : `https://flagsapi.com/${homeTeam.code}/flat/64.png`;
    processed.awayTeam.logo = awayTeam.iso2 ? `https://flagcdn.com/${awayTeam.iso2}.svg` : `https://flagsapi.com/${awayTeam.code}/flat/64.png`;
  } else if (matchDetails) {
    processed.venue = [matchDetails.venue, matchDetails.venueCity]
      .filter(Boolean)
      .join(", ");
    if (matchDetails.homeLogo) {
      processed.homeTeam.logo = matchDetails.homeLogo;
    }
    if (matchDetails.awayLogo) {
      processed.awayTeam.logo = matchDetails.awayLogo;
    }
  }

  return {
    ...processed,
    events: matchDetails?.events || [],
    statistics: Array.isArray(matchStats) ? matchStats.filter(Boolean) : [],
    referee: matchDetails?.referee || "",
    attendance: matchDetails?.attendance || "",
  };
}
// Trigger turbopack recompilation
