import type {
  FlashscoreEvent,
  FlashscoreMatchDetails,
  FlashscoreStatPeriod,
  ProcessedFixture,
  ProcessedMatchDetail,
  FixtureStatus,
} from "@/types/football";
import worldcupData from "@/data/worldcup.json";

const API_BASE = "https://api.sportdb.dev";
const WORLD_CUP_PATH = "/api/flashscore/football/world:8/world-cup:lvUBR5F8";
const SEASON = "2026";

// Cache simples em memória (TTL de 5 minutos)
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function apiFetch<T>(path: string): Promise<T> {
  const apiKey = process.env.SPORTDB_API_KEY;
  if (!apiKey) {
    throw new Error("SPORTDB_API_KEY não está configurada no .env.local");
  }

  const url = `${API_BASE}${path}`;
  const cacheKey = url;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data: T = await response.json();
  setCache(cacheKey, data);
  return data;
}

// Resolve URL do logo (pode vir como caminho parcial ou URL completa)
function resolveLogoUrl(logo: string): string {
  if (!logo) return "";
  if (logo.startsWith("http")) return logo;
  return `https://static.flashscore.com/res/image/data/${logo}`;
}

// Dicionário de traduções de países (Inglês -> Português + Código PT)
const COUNTRY_TRANSLATIONS: Record<string, { name: string; code: string }> = {
  "Brazil": { name: "Brasil", code: "BRA" },
  "Argentina": { name: "Argentina", code: "ARG" },
  "France": { name: "França", code: "FRA" },
  "England": { name: "Inglaterra", code: "ING" },
  "Spain": { name: "Espanha", code: "ESP" },
  "Germany": { name: "Alemanha", code: "ALE" },
  "Portugal": { name: "Portugal", code: "POR" },
  "Netherlands": { name: "Holanda", code: "HOL" },
  "Italy": { name: "Itália", code: "ITA" },
  "Croatia": { name: "Croácia", code: "CRO" },
  "Morocco": { name: "Marrocos", code: "MAR" },
  "USA": { name: "Estados Unidos", code: "EUA" },
  "Mexico": { name: "México", code: "MEX" },
  "Canada": { name: "Canadá", code: "CAN" },
  "Uruguay": { name: "Uruguai", code: "URU" },
  "Colombia": { name: "Colômbia", code: "COL" },
  "Japan": { name: "Japão", code: "JAP" },
  "South Korea": { name: "Coreia do Sul", code: "COR" },
  "Australia": { name: "Austrália", code: "AUS" },
  "Senegal": { name: "Senegal", code: "SEN" },
  "Switzerland": { name: "Suíça", code: "SUI" },
  "Cameroon": { name: "Camarões", code: "CAM" },
  "Ecuador": { name: "Equador", code: "EQU" },
  "Saudi Arabia": { name: "Arábia Saudita", code: "ARA" },
  "Wales": { name: "País de Gales", code: "GAL" },
  "Poland": { name: "Polônia", code: "POL" },
  "Serbia": { name: "Sérvia", code: "SER" },
  "Ghana": { name: "Gana", code: "GAN" },
  "Costa Rica": { name: "Costa Rica", code: "CRC" },
  "Iran": { name: "Irã", code: "IRA" },
  "Belgium": { name: "Bélgica", code: "BEL" },
  "Denmark": { name: "Dinamarca", code: "DIN" },
  "Tunisia": { name: "Tunísia", code: "TUN" },
  "Qatar": { name: "Catar", code: "CAT" },
  "Chile": { name: "Chile", code: "CHI" },
  "Peru": { name: "Peru", code: "PER" },
  "Sweden": { name: "Suécia", code: "SUE" },
  "Nigeria": { name: "Nigéria", code: "NGA" },
  "Egypt": { name: "Egito", code: "EGI" },
  "Algeria": { name: "Argélia", code: "ARG" },
  "Ivory Coast": { name: "Costa do Marfim", code: "CMA" },
  "Mali": { name: "Mali", code: "MAL" },
  "South Africa": { name: "África do Sul", code: "AFS" },
  "Panama": { name: "Panamá", code: "PAN" },
  "Haiti": { name: "Haiti", code: "HAI" },
  "Scotland": { name: "Escócia", code: "ESC" },
  "Czech Republic": { name: "República Tcheca", code: "TCH" },
  "D.R. Congo": { name: "RD Congo", code: "RDC" },
  "Uzbekistan": { name: "Uzbequistão", code: "UZB" },
  "Jordan": { name: "Jordânia", code: "JOR" },
  "Austria": { name: "Áustria", code: "AUT" },
};

function translateTeam(name: string, defaultCode?: string): { name: string; code: string } {
  const translation = COUNTRY_TRANSLATIONS[name];
  if (translation) return translation;
  // Fallback se não tiver tradução
  return {
    name,
    code: defaultCode || name.substring(0, 3).toUpperCase(),
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
      logo: resolveLogoUrl(event.homeLogo),
    },
    awayTeam: {
      id: event.awayParticipantIds || event.awayEventParticipantId,
      name: translateTeam(event.awayName).name,
      code: translateTeam(event.awayName, event.away3CharName).code,
      logo: resolveLogoUrl(event.awayLogo),
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
    const data = await apiFetch<FlashscoreEvent[]>(`${WORLD_CUP_PATH}/${SEASON}/fixtures?page=1`);
    if (Array.isArray(data)) {
      liveFixtures = data.filter((e) => e.tournamentStage?.groupName === "Final tournament");
    }
  } catch (e) {
    console.error("Erro ao buscar live fixtures, usando dados estáticos", e);
  }

  // Tenta buscar resultados da API
  let results: FlashscoreEvent[] = [];
  try {
    const data = await apiFetch<FlashscoreEvent[]>(`${WORLD_CUP_PATH}/${SEASON}/results?page=1`);
    if (Array.isArray(data)) {
      results = data.filter((e) => e.tournamentStage?.groupName === "Final tournament");
    }
  } catch (e) {
    console.error("Erro ao buscar resultados, usando dados estáticos", e);
  }

  const allApiEvents = [...liveFixtures, ...results];

  return staticMatches.map((staticMatch) => {
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
        logo: `https://flagsapi.com/${homeTeam.code}/flat/64.png`, // Fallback
      },
      awayTeam: {
        id: "a",
        name: awayTeam.name,
        code: awayTeam.code,
        logo: `https://flagsapi.com/${awayTeam.code}/flat/64.png`, // Fallback
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
      baseFixture.homeTeam.logo = processedApi.homeTeam.logo;
      baseFixture.awayTeam.logo = processedApi.awayTeam.logo;
      // Salva o ID real da API para buscar detalhes depois
      baseFixture.id = apiMatch.eventId;
    }

    return baseFixture;
  });
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
  const fixtures = await apiFetch<FlashscoreEvent[]>(
    `${WORLD_CUP_PATH}/${SEASON}/fixtures?page=1`
  );
  if (Array.isArray(fixtures)) {
    eventData = fixtures.find((e) => e.eventId === eventId) || null;
  }

  // Se não encontrou, tenta nos results
  if (!eventData) {
    const results = await apiFetch<FlashscoreEvent[]>(
      `${WORLD_CUP_PATH}/${SEASON}/results?page=1`
    );
    if (Array.isArray(results)) {
      eventData = results.find((e) => e.eventId === eventId) || null;
    }
  }

  if (!eventData) return null;

  // Busca detalhes e estatísticas em paralelo
  const [matchDetails, matchStats] = await Promise.all([
    apiFetch<FlashscoreMatchDetails>(detailPath).catch(() => null),
    apiFetch<FlashscoreStatPeriod[]>(statsPath).catch(() => []),
  ]);

  const processed = processEvent(eventData);

  // Enriquece com dados do detail
  if (matchDetails) {
    processed.venue = [matchDetails.venue, matchDetails.venueCity]
      .filter(Boolean)
      .join(", ");
    // Usa logos de alta qualidade do detail
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
