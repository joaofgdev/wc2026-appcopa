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

// 1. Procurar o Jogo (Grêmio x Santos)
async function findTestMatch() {
  try {
    const data = await fetchFromFootballAPI('/football-get-matches-by-date?date=20260523');
    const matches = data.response?.matches || data.matches || data.events || [];
    
    const gremioMatch = matches.find((m: any) => 
      (m.home && m.home.name && (m.home.name.includes("Grêmio") || m.home.name.includes("Gremio"))) || 
      (m.away && m.away.name && (m.away.name.includes("Grêmio") || m.away.name.includes("Gremio")))
    );

    if (gremioMatch) return gremioMatch;
  } catch (error) {
    console.error("Falha ao buscar jogos no RapidAPI:", error);
  }

  // Se não encontrar na API (porque o jogo não existe na data ou a API falhou)
  // Retornamos um dado "Limpo" (NS) para a UI não puxar o mock antigo!
  return {
    id: "gremio-santos-clean",
    competition: "Campeonato Brasileiro Série A",
    round: "Rodada 10",
    date: new Date("2026-05-23T19:00:00-03:00").toISOString(),
    timestamp: Math.floor(new Date("2026-05-23T19:00:00-03:00").getTime() / 1000),
    venue: "Arena do Grêmio, Porto Alegre",
    status: { short: "NS" },
    home: {
      id: "gre",
      name: "Grêmio",
      shortName: "GRE"
    },
    away: {
      id: "san",
      name: "Santos",
      shortName: "SAN"
    },
    goals: { home: null, away: null }
  };
}

// Retorna Dados Base (Placar, Tempo, Status)
export async function getFootballApiMatchBase(): Promise<TestMatchData | null> {
  const match = await findTestMatch();

  const statusObj = parseMatchStatus(
    match.status?.short || match.status || "NS", 
    match.elapsed || match.status?.elapsed || 0
  );

  const matchData: TestMatchData = {
    id: match.id || match.fixture?.id || "gremio-santos-rapid",
    competition: match.league?.name || match.competition || "Série A",
    round: match.league?.round || match.round || "Rodada",
    date: match.date || match.fixture?.date || new Date().toISOString(),
    timestamp: match.timestamp || match.fixture?.timestamp || Math.floor(Date.now() / 1000),
    venue: match.venue?.name || match.stadium || match.venue || "Arena do Grêmio",
    status: statusObj,
    homeTeam: {
      id: match.home?.id || match.homeId || "gre",
      name: match.home?.name || match.homeName || "Grêmio",
      shortName: match.home?.shortName || "GRE",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gr%C3%AAmio_FBPA_logo.svg/200px-Gr%C3%AAmio_FBPA_logo.svg.png",
    },
    awayTeam: {
      id: match.away?.id || match.awayId || "san",
      name: match.away?.name || match.awayName || "Santos",
      shortName: match.away?.shortName || "SAN",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Santos_Logo.png/200px-Santos_Logo.png",
    },
    goalsHome: match.goals?.home ?? match.homeScore ?? null,
    goalsAway: match.goals?.away ?? match.awayScore ?? null,
  };

  global.__testMatchSnapshot_Base = matchData;
  return matchData;
}

// Retorna Estatísticas
export async function getFootballApiMatchStats(matchId: string): Promise<TestMatchStats | null> {
  try {
    if (matchId === "gremio-santos-clean") throw new Error("Jogo vazio");
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
