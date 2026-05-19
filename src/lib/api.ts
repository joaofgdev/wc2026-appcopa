import type { ApiResponse, Fixture, FixtureEvent, FixtureStatistics, ProcessedFixture } from "@/types/football";

const API_BASE = "https://v3.football.api-sports.io";
const WORLD_CUP_LEAGUE_ID = 1;
const WORLD_CUP_SEASON = 2022; // Plano gratuito: 2022-2024. Mude para 2026 com plano pago.
const BRAZIL_TEAM_ID = 6;

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

async function apiFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<ApiResponse<T>> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY não está configurada no .env.local");
  }

  const url = new URL(`${API_BASE}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const cacheKey = url.toString();
  const cached = getCached<ApiResponse<T>>(cacheKey);
  if (cached) return cached;

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-apisports-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponse<T> = await response.json();
  setCache(cacheKey, data);
  return data;
}

// Processa um fixture da API para o formato frontend
function processFixture(f: Fixture): ProcessedFixture {
  return {
    id: f.fixture.id,
    date: f.fixture.date,
    timestamp: f.fixture.timestamp,
    status: f.fixture.status,
    venue: f.fixture.venue.name
      ? `${f.fixture.venue.name}, ${f.fixture.venue.city || ""}`
      : "",
    round: f.league.round || "",
    homeTeam: {
      id: f.teams.home.id,
      name: f.teams.home.name,
      code: f.teams.home.code || f.teams.home.name.substring(0, 3).toUpperCase(),
      logo: f.teams.home.logo,
    },
    awayTeam: {
      id: f.teams.away.id,
      name: f.teams.away.name,
      code: f.teams.away.code || f.teams.away.name.substring(0, 3).toUpperCase(),
      logo: f.teams.away.logo,
    },
    goalsHome: f.goals.home,
    goalsAway: f.goals.away,
  };
}

// Pega todos os fixtures da Copa 2026
export async function getWorldCupFixtures(): Promise<ProcessedFixture[]> {
  const data = await apiFetch<Fixture>("fixtures", {
    league: String(WORLD_CUP_LEAGUE_ID),
    season: String(WORLD_CUP_SEASON),
  });

  return data.response.map(processFixture);
}

// Pega o jogo de destaque do Brasil (próximo, ou último jogado)
export async function getNextBrazilMatch(): Promise<ProcessedFixture | null> {
  // Busca todos os jogos do Brasil na Copa
  const data = await apiFetch<Fixture>("fixtures", {
    league: String(WORLD_CUP_LEAGUE_ID),
    season: String(WORLD_CUP_SEASON),
    team: String(BRAZIL_TEAM_ID),
  });

  if (data.response.length === 0) return null;

  // Tenta encontrar um jogo ao vivo
  const liveMatch = data.response.find((f) =>
    ["1H", "2H", "HT", "ET", "P", "BT", "LIVE"].includes(f.fixture.status.short)
  );
  if (liveMatch) return processFixture(liveMatch);

  // Tenta encontrar o próximo jogo agendado
  const scheduled = data.response.find((f) =>
    ["TBD", "NS"].includes(f.fixture.status.short)
  );
  if (scheduled) return processFixture(scheduled);

  // Se todos acabaram, pega o último jogo (mais recente)
  const lastMatch = data.response[data.response.length - 1];
  return processFixture(lastMatch);
}

// Pega detalhes completos de um fixture
export async function getFixtureDetails(fixtureId: string) {
  const [fixtureData, eventsData, statsData] = await Promise.all([
    apiFetch<Fixture>("fixtures", { id: fixtureId }),
    apiFetch<FixtureEvent>("fixtures/events", { fixture: fixtureId }),
    apiFetch<FixtureStatistics>("fixtures/statistics", { fixture: fixtureId }),
  ]);

  if (fixtureData.response.length === 0) {
    return null;
  }

  const fixture = processFixture(fixtureData.response[0]);

  return {
    ...fixture,
    events: eventsData.response || [],
    statistics: {
      home: statsData.response.length > 0 ? statsData.response[0].statistics : [],
      away: statsData.response.length > 1 ? statsData.response[1].statistics : [],
    },
  };
}
