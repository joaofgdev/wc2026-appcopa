import { TestMatchData, TestMatchStats, TestMatchLineups, TestMatchStatus } from "@/types/test-match";

const RAPID_HOST = "free-api-live-football-data.p.rapidapi.com";
const API_KEY = process.env.RAPID_API_KEY || "";

// Snapshots em Memória (Fallback para evitar que a UI quebre na Vercel/Produção)
// Utilizamos `global` para que o cache sobreviva a reinicializações rápidas de SSR em dev,
// mas em serverless real (produção da Vercel), ele viverá o tempo de vida da instância lambda.
declare global {
  var __testMatchSnapshot_Base: TestMatchData | null;
  var __testMatchSnapshot_Stats: TestMatchStats | null;
  var __testMatchSnapshot_Lineups: TestMatchLineups | null;
}
global.__testMatchSnapshot_Base = global.__testMatchSnapshot_Base || null;
global.__testMatchSnapshot_Stats = global.__testMatchSnapshot_Stats || null;
global.__testMatchSnapshot_Lineups = global.__testMatchSnapshot_Lineups || null;

// Wrapper universal para chamadas à API com os Headers
async function fetchFromFootballAPI(endpoint: string) {
  if (!API_KEY) {
    throw new Error("RAPID_API_KEY não está configurada.");
  }
  
  console.log(`[FOOTBALL API REQUEST] Buscando dados em: ${endpoint}`);
  
  const response = await fetch(`https://${RAPID_HOST}${endpoint}`, {
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": RAPID_HOST,
    },
    // cache é ignorado aqui no wrapper porque controlaremos o stale-while-revalidate diretamente nos Route Handlers
    cache: "no-store", 
  });

  if (!response.ok) {
    throw new Error(`API retornou erro: ${response.status}`);
  }

  return response.json();
}

// Analisa o status retornado pela API para o nosso padrão de UI
function parseMatchStatus(rawStatus: string, elapsed?: number): TestMatchStatus {
  // Padronização básica (LIVE, IN_PLAY, 1H, 2H, HT, FT, NS)
  const s = rawStatus?.toUpperCase() || "NS";
  
  if (s === "NS" || s === "NOT_STARTED") return { long: "Não Iniciado", short: "NS", elapsed: null };
  if (s === "FT" || s === "FINISHED") return { long: "Finalizado", short: "FT", elapsed: 90 };
  if (s === "HT" || s === "HALFTIME") return { long: "Intervalo", short: "HT", elapsed: 45 };
  
  if (["LIVE", "IN_PLAY", "1H", "2H", "PLAYING"].includes(s)) {
    return { long: "Ao Vivo", short: "LIVE", elapsed: elapsed || 0 };
  }
  
  return { long: "Aguardando", short: "NS", elapsed: null };
}

import { getTestMatchBase, getTestMatchStats as getMockStats, getTestMatchLineups as getMockLineups } from "@/mocks/test-match";

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY || "bcb68a883ff84756b12e3a3b113e53a0";

async function fetchFromFootballDataOrg(endpoint: string) {
  console.log(`[FOOTBALL-DATA.ORG REQUEST] Buscando dados em: ${endpoint}`);
  const response = await fetch(`http://api.football-data.org/v4${endpoint}`, {
    headers: {
      "X-Auth-Token": FOOTBALL_DATA_API_KEY,
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Football-Data API error: ${response.status}`);
  return response.json();
}

// 1. Procurar o Jogo (Grêmio x Santos) usando a API real
async function findTestMatch() {
  const mockBase = getTestMatchBase();
  const now = Date.now();
  
  try {
    // Cache em memória de 30 segundos
    const lastFetch = (global as any).__lastApiFetchTime_Base || 0;
    if (now - lastFetch > 30000) {
      try {
        const data = await fetchFromFootballDataOrg('/teams/1767/matches?limit=15');
        (global as any).__lastApiFetchData_Base = data;
        (global as any).__lastApiFetchTime_Base = now;
      } catch (err) {
        console.error("Falha na API real:", err);
        (global as any).__lastApiFetchTime_Base = now; // Evita spammar 429
      }
    }

    const data = (global as any).__lastApiFetchData_Base;
    if (data && data.matches) {
      const matches = data.matches;
      // Procura o jogo específico (Grêmio x Santos) ou o jogo atual em andamento
      const gremioMatch = matches.find((m: any) => m.id === 554904 || m.status === 'IN_PLAY' || m.status === 'PAUSED');

      if (gremioMatch) {
        return {
          id: gremioMatch.id.toString(),
          competition: gremioMatch.competition?.name || "Campeonato Brasileiro Série A",
          round: `Rodada ${gremioMatch.matchday || ""}`,
          date: gremioMatch.utcDate,
          timestamp: Math.floor(new Date(gremioMatch.utcDate).getTime() / 1000),
          venue: "Arena do Grêmio, Porto Alegre",
          status: { 
            short: gremioMatch.status === "FINISHED" ? "FT" : gremioMatch.status === "IN_PLAY" ? "LIVE" : gremioMatch.status === "PAUSED" ? "HT" : "NS",
            elapsed: gremioMatch.minute || gremioMatch.status?.elapsed || mockBase.status.elapsed 
          },
          homeTeam: {
            id: gremioMatch.homeTeam?.id?.toString() || "1767",
            name: gremioMatch.homeTeam?.name || "Grêmio FBPA",
            shortName: gremioMatch.homeTeam?.shortName || gremioMatch.homeTeam?.tla || "GRE",
            logo: gremioMatch.homeTeam?.crest || "https://crests.football-data.org/1767.png"
          },
          awayTeam: {
            id: gremioMatch.awayTeam?.id?.toString() || "6685",
            name: gremioMatch.awayTeam?.name || "Santos FC",
            shortName: gremioMatch.awayTeam?.shortName || gremioMatch.awayTeam?.tla || "SAN",
            logo: gremioMatch.awayTeam?.crest || "https://crests.football-data.org/6685.png"
          },
          goalsHome: gremioMatch.score?.fullTime?.home ?? null,
          goalsAway: gremioMatch.score?.fullTime?.away ?? null
        };
      }
    }
  } catch (error) {
    console.error("Falha geral em findTestMatch:", error);
  }

  // Fallback para o Mock
  return mockBase;
}

// Retorna Dados Base (Placar, Tempo, Status)
export async function getFootballApiMatchBase(): Promise<TestMatchData | null> {
  const match = await findTestMatch();

  const rawStatus = typeof match.status === 'string' ? match.status : match.status?.short;
  const statusObj = parseMatchStatus(
    rawStatus || "NS", 
    (match.status as any)?.elapsed || 0
  );

  const m = match as any;
  const matchData: TestMatchData = {
    id: m.id || m.fixture?.id || "gremio-santos-rapid",
    competition: m.competition || m.league?.name || "Série A",
    round: m.round || m.league?.round || "Rodada",
    date: m.date || m.fixture?.date || new Date().toISOString(),
    timestamp: m.timestamp || m.fixture?.timestamp || Math.floor(Date.now() / 1000),
    venue: m.venue?.name || m.stadium || m.venue || "Arena do Grêmio",
    status: statusObj,
    homeTeam: {
      id: m.home?.id || m.homeTeam?.id || m.homeId || "gre",
      name: m.home?.name || m.homeTeam?.name || m.homeName || "Grêmio",
      shortName: m.home?.shortName || m.homeTeam?.shortName || "GRE",
      logo: m.home?.crest || m.homeTeam?.logo || "https://crests.football-data.org/1767.png",
    },
    awayTeam: {
      id: m.away?.id || m.awayTeam?.id || m.awayId || "san",
      name: m.away?.name || m.awayTeam?.name || m.awayName || "Santos",
      shortName: m.away?.shortName || m.awayTeam?.shortName || "SAN",
      logo: m.away?.crest || m.awayTeam?.logo || "https://crests.football-data.org/6685.png",
    },
    goalsHome: m.goals?.home ?? m.goalsHome ?? m.homeScore ?? null,
    goalsAway: m.goals?.away ?? m.goalsAway ?? m.awayScore ?? null,
  };

  global.__testMatchSnapshot_Base = matchData;
  return matchData;
}

// Retorna Estatísticas
export async function getFootballApiMatchStats(matchId: string): Promise<TestMatchStats | null> {
  try {
    if (matchId === "gremio-santos-clean") throw new Error("Jogo vazio");
    
    // Se for o mock, não bate na API real para evitar rate limit (HTTP 429) e usa os dados gerados dinamicamente
    if (matchId === "554904" || matchId === "gremio-santos-rapid") {
      const mockStats = getMockStats();
      global.__testMatchSnapshot_Stats = mockStats;
      return mockStats;
    }

    const data = await fetchFromFootballAPI(`/football-get-match-statistics?match_id=${matchId}`);
    
    const stats: TestMatchStats = {
      home: {
        possession: data.home?.possession || 50,
        shotsOnTarget: data.home?.shotsOnTarget || 0,
        shotsOffTarget: data.home?.shotsOffTarget || 0,
        corners: data.home?.corners || 0,
        fouls: data.home?.fouls || 0,
        yellowCards: data.home?.yellowCards || 0,
        redCards: data.home?.redCards || 0,
      },
      away: {
        possession: data.away?.possession || 50,
        shotsOnTarget: data.away?.shotsOnTarget || 0,
        shotsOffTarget: data.away?.shotsOffTarget || 0,
        corners: data.away?.corners || 0,
        fouls: data.away?.fouls || 0,
        yellowCards: data.away?.yellowCards || 0,
        redCards: data.away?.redCards || 0,
      }
    };
    global.__testMatchSnapshot_Stats = stats;
    return stats;
  } catch (err) {
    const emptyStats: TestMatchStats = {
      home: { possession: 0, shotsOnTarget: 0, shotsOffTarget: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 },
      away: { possession: 0, shotsOnTarget: 0, shotsOffTarget: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 }
    };
    global.__testMatchSnapshot_Stats = emptyStats;
    return emptyStats;
  }
}

// Retorna Escalações
export async function getFootballApiMatchLineups(matchId: string): Promise<TestMatchLineups | null> {
  try {
    if (matchId === "gremio-santos-clean") throw new Error("Jogo vazio");
    
    // Se for o mock, não bate na API real para evitar rate limit (HTTP 429) e usa os dados simulados
    if (matchId === "554904" || matchId === "gremio-santos-rapid") {
      const mockLineups = getMockLineups();
      global.__testMatchSnapshot_Lineups = mockLineups;
      return mockLineups;
    }

    const data = await fetchFromFootballAPI(`/football-get-match-lineups?match_id=${matchId}`);
    
    const lineups: TestMatchLineups = {
      home: data.home || { coach: "A Definir", startingXI: [], substitutes: [] },
      away: data.away || { coach: "A Definir", startingXI: [], substitutes: [] }
    };
    global.__testMatchSnapshot_Lineups = lineups;
    return lineups;
  } catch (err) {
    const emptyLineups: TestMatchLineups = {
      home: { coach: "A Definir", startingXI: [], substitutes: [] },
      away: { coach: "A Definir", startingXI: [], substitutes: [] }
    };
    global.__testMatchSnapshot_Lineups = emptyLineups;
    return emptyLineups;
  }
}
