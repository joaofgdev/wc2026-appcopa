import type {
  FlashscoreEvent,
  FlashscoreMatchDetails,
  FlashscoreStatPeriod,
  ProcessedFixture,
  ProcessedMatchDetail,
  FixtureStatus,
} from "@/types/football";
import { supabase } from "@/lib/supabase";

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

// Função auxiliar para salvar detalhes completos de um jogo finalizado no banco
async function saveMatchToDb(apiMatch: FlashscoreEvent, localId: string, matchDate: string, homeTeam: string, awayTeam: string) {
  const detailPath = `/match/${apiMatch.eventId}/details`;
  const statsPath = `/match/${apiMatch.eventId}/stats`;
  const lineupsPath = `/match/${apiMatch.eventId}/lineups`;

  try {
    // Busca detalhes e estatísticas
    const [matchDetails, matchStats, apiLineups] = await Promise.all([
      fetchFromSportDB<FlashscoreMatchDetails>(detailPath).catch(() => null),
      fetchFromSportDB<FlashscoreStatPeriod[]>(statsPath).catch(() => []),
      fetchFromSportDB<any>(lineupsPath).catch(() => null),
    ]);

    const homeScore = apiMatch.homeScore ?? apiMatch.homeFullTimeScore ?? null;
    const awayScore = apiMatch.awayScore ?? apiMatch.awayFullTimeScore ?? null;
    const statusShort = mapEventStageToStatus(apiMatch).short;
    const parsedLineups = parseApiLineups(apiLineups);

    // Atualiza tabela matches
    await supabase.from('matches').update({
      goals_home: homeScore !== null ? parseInt(homeScore) : null,
      goals_away: awayScore !== null ? parseInt(awayScore) : null,
      status_short: statusShort,
      details_saved: true,
      // Se era um jogo com "TBD", atualiza os nomes agora que sabemos quem jogou
      home_team_name: apiMatch.homeName,
      away_team_name: apiMatch.awayName
    }).eq('id', localId);

    // Insere na tabela match_details
    const upsertData: any = {
      match_id: localId,
      events: matchDetails?.events || [],
      statistics: Array.isArray(matchStats) ? matchStats : [],
      referee: matchDetails?.referee || "",
      attendance: matchDetails?.attendance || ""
    };
    
    if (parsedLineups) {
      upsertData.lineups = parsedLineups;
    }

    await supabase.from('match_details').upsert(upsertData);

    console.log(`[Cache] Jogo ${localId} salvo permanentemente no banco.`);
  } catch (err) {
    console.error(`Erro ao salvar partida ${localId} no banco:`, err);
  }
}

// Retorna todos os jogos combinando o banco de dados com placares ao vivo
export async function getWorldCupFixtures(): Promise<ProcessedFixture[]> {
  const { data: dbMatches, error } = await supabase.from('matches').select('*').order('match_date');
  const staticMatches = dbMatches || [];
  
  const now = Date.now();
  
  // Regra A: Precisamos chamar a API? 
  // Apenas se existir algum jogo não salvo (details_saved = false) que:
  // - Está a menos de 1 hora de começar
  // - Ou já começou / terminou mas ainda não foi salvo
  const needsApiUpdate = staticMatches.some((m) => {
    if (m.details_saved) return false;
    const matchTimeMs = new Date(m.match_date).getTime();
    const oneHourMs = 60 * 60 * 1000;
    return now >= (matchTimeMs - oneHourMs); 
  });

  let liveFixtures: FlashscoreEvent[] = [];
  let results: FlashscoreEvent[] = [];

  // Chama a API SOMENTE se precisar
  if (needsApiUpdate) {
    console.log("[SportDB] Consultando API (Jogos ativos ou próximos)...");
    try {
      const liveData = await fetchFromSportDB<FlashscoreEvent[]>(`/fixtures?page=1`);
      if (Array.isArray(liveData)) {
        liveFixtures = liveData.filter((e) => e.tournamentStage?.groupName === "Final tournament");
      }
    } catch (e) {
      console.error("Erro ao buscar live fixtures", e);
    }

    try {
      const resData = await fetchFromSportDB<FlashscoreEvent[]>(`/results?page=1`);
      if (Array.isArray(resData)) {
        results = resData.filter((e) => e.tournamentStage?.groupName === "Final tournament");
      }
    } catch (e) {
      console.error("Erro ao buscar resultados", e);
    }
  } else {
    console.log("[SportDB] Repouso. Sem jogos próximos, retornando do banco direto.");
  }

  const allApiEvents = [...liveFixtures, ...results];
  const promisesToSave: Promise<void>[] = [];

  const processedMatches = staticMatches.map((staticMatch) => {
    // Tenta encontrar o correspondente na API
    const apiMatch = allApiEvents.find(
      (e) =>
        normalizeTeamName(e.homeName) === normalizeTeamName(staticMatch.home_team_name) &&
        normalizeTeamName(e.awayName) === normalizeTeamName(staticMatch.away_team_name)
    );

    const homeTeam = translateTeam(staticMatch.home_team_name);
    const awayTeam = translateTeam(staticMatch.away_team_name);

    let statusLong = "Não Iniciado";
    let statusShort = "NS";
    let elapsed = null;
    let goalsHome = null;
    let goalsAway = null;

    // Se já está salvo no banco permanentemente, usa os dados do banco!
    if (staticMatch.details_saved) {
      statusShort = staticMatch.status_short || "FT";
      statusLong = "Encerrado"; 
      goalsHome = staticMatch.goals_home;
      goalsAway = staticMatch.goals_away;
    }

    const baseFixture: ProcessedFixture = {
      id: staticMatch.id,
      date: staticMatch.match_date,
      timestamp: new Date(staticMatch.match_date).getTime() / 1000,
      status: { long: statusLong, short: statusShort, elapsed },
      venue: staticMatch.venue_name,
      round: translateRound(staticMatch.round),
      group: translateGroup(staticMatch.group_name),
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
      goalsHome: goalsHome,
      goalsAway: goalsAway,
      detailsLink: "",
      statsLink: "",
    };

    // Só sobrescreve com dados da API se não estiver salvo definitivamente
    if (apiMatch && !staticMatch.details_saved) {
      const processedApi = processEvent(apiMatch);
      baseFixture.status = processedApi.status;
      baseFixture.goalsHome = processedApi.goalsHome;
      baseFixture.goalsAway = processedApi.goalsAway;
      baseFixture.detailsLink = processedApi.detailsLink;
      baseFixture.statsLink = processedApi.statsLink;

      // Gatilho: O jogo acabou na API, mas ainda não está salvo no nosso banco?
      const isFinished = ["FT", "AET", "PEN"].includes(processedApi.status.short);
      if (isFinished) {
        // Enfileira a promessa para salvar o jogo
        promisesToSave.push(
          saveMatchToDb(apiMatch, staticMatch.id, staticMatch.match_date, staticMatch.home_team_name, staticMatch.away_team_name)
        );
      }
    } else if (staticMatch.details_saved) {
      // Se está salvo, no frontend vamos usar o ID original do banco para abrir detalhes
      baseFixture.id = staticMatch.id;
    }

    return baseFixture;
  });

  // Aguarda os salvamentos acontecerem em background sem travar o usuário
  if (promisesToSave.length > 0) {
    Promise.all(promisesToSave).catch(e => console.error("Erro salvando jogos em background:", e));
  }

  // Estratégia de Atualização de Tempo Real:
  // Verifica se há jogos acontecendo AGORA e que precisam do Polling agressivo
  const activeMatches = processedMatches.filter(m => {
    // Só atualiza se for um id do flashscore (não local) e não estiver salvo no DB permanentemente
    if (m.id.startsWith("m_")) return false; 
    
    // Check if it's currently live or recently started
    return ["1H", "2H", "HT", "ET", "P", "LIVE"].includes(m.status.short);
  });

  // Para jogos ativos, busca apenas o detalhe (TTL = 15s)
  if (activeMatches.length > 0) {
    await Promise.all(activeMatches.map(async (match) => {
      try {
        const liveDetail = await fetchFromSportDB<FlashscoreMatchDetails>(`/match/${match.id}/details`, 15);
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
function parseApiLineups(rawData: any): import("@/types/football").MatchLineups | null {
  if (!rawData) return null;
  
  if (rawData.home && Array.isArray(rawData.home.starting)) {
    return rawData as import("@/types/football").MatchLineups;
  }
  
  if (rawData.lineups && rawData.lineups.home && Array.isArray(rawData.lineups.home.starting)) {
     return rawData.lineups as import("@/types/football").MatchLineups;
  }

  // Novo formato Flashscore: Array of groups
  if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].group) {
    const startingGroup = rawData.find(g => g.group === 'Starting Lineups') || { home: [], away: [] };
    const subsGroup = rawData.find(g => g.group === 'Substitutes') || { home: [], away: [] };
    const coachesGroup = rawData.find(g => g.group === 'Coaches' || g.group === 'Coach') || { home: [], away: [] };

    const parsePlayer = (p: any) => ({
      id: String(p.id || p.playerId || Math.random()),
      name: p.name || p.playerName || "",
      number: String(p.number || p.shirtNumber || ""),
      position: p.position || p.positionName || ""
    });

    return {
      home: {
        starting: (startingGroup.home || []).map(parsePlayer),
        substitutes: (subsGroup.home || []).map(parsePlayer),
        coach: coachesGroup.home?.[0]?.name || coachesGroup.home?.[0]?.playerName || "",
        formation: ""
      },
      away: {
        starting: (startingGroup.away || []).map(parsePlayer),
        substitutes: (subsGroup.away || []).map(parsePlayer),
        coach: coachesGroup.away?.[0]?.name || coachesGroup.away?.[0]?.playerName || "",
        formation: ""
      }
    };
  }

  if (Array.isArray(rawData) && rawData.length === 2) {
     const parseTeam = (team: any) => ({
       starting: Array.isArray(team.startingLineup) ? team.startingLineup : (Array.isArray(team.starting) ? team.starting : []),
       substitutes: Array.isArray(team.substitutes) ? team.substitutes : [],
       coach: team.coach?.name || team.coach || "",
       formation: team.formation || ""
     });
     
     if (rawData[0].startingLineup || rawData[0].starting) {
       return {
         home: parseTeam(rawData[0]),
         away: parseTeam(rawData[1])
       };
     }
  }

  console.warn("Formato de escalação desconhecido da API:", rawData);
  return null;
}

export async function getFixtureDetails(
  eventId: string,
  detailsLink?: string,
  statsLink?: string
): Promise<ProcessedMatchDetail | null> {
  
  // 1. Busca dados do jogo na tabela matches
  const { data: staticMatch } = await supabase
    .from('matches')
    .select('*')
    .eq('id', eventId)
    .single();

  if (!staticMatch) {
    console.error("Jogo não encontrado no banco:", eventId);
    return null;
  }

  // 2. Busca detalhes que já temos salvos (incluindo escalações)
  const { data: savedDetails } = await supabase
    .from('match_details')
    .select('*')
    .eq('match_id', eventId)
    .single();

  const now = Date.now();
  const matchTime = new Date(staticMatch.match_date).getTime();
  const isWithin1Hour = (matchTime - now) <= 3600000;

  let lineups = savedDetails?.lineups || null;
  let events = savedDetails?.events || [];
  let statistics = savedDetails?.statistics || [];
  let referee = savedDetails?.referee || "";
  let attendance = savedDetails?.attendance || "";
  let venue = staticMatch.venue_name || "";
  
  const homeTeam = translateTeam(staticMatch.home_team_name);
  const awayTeam = translateTeam(staticMatch.away_team_name);
  
  // Status provisório baseado no banco
  let statusLong = staticMatch.details_saved ? "Encerrado" : "Não Iniciado";
  let statusShort = staticMatch.status_short || (staticMatch.details_saved ? "FT" : "NS");

  // Se o jogo já começou mas não terminou, ajusta para LIVE se não tiver atualizado ainda
  if (!staticMatch.details_saved && now >= matchTime && statusShort === "NS") {
    statusShort = "LIVE";
    statusLong = "Ao Vivo";
  }

  const processed: ProcessedMatchDetail = {
    id: staticMatch.id,
    date: staticMatch.match_date,
    timestamp: matchTime / 1000,
    status: { long: statusLong, short: statusShort, elapsed: null },
    venue,
    round: translateRound(staticMatch.round),
    group: translateGroup(staticMatch.group_name),
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
    goalsHome: staticMatch.goals_home,
    goalsAway: staticMatch.goals_away,
    detailsLink: "",
    statsLink: "",
    events,
    statistics,
    referee,
    attendance,
    lineups
  };

  const isFinished = ["FT", "AET", "PEN"].includes(processed.status.short);
  
  // Só busca as escalações se não tivermos no banco E o jogo for em até 1 hora ou já tiver começado
  const needsLineupsFetch = !lineups && (isWithin1Hour || now >= matchTime);
  
  // Busca detalhes na API se o jogo já começou e (não foi finalizado/salvo OU não temos as informações)
  const needsLiveDetails = (!staticMatch.details_saved || (events.length === 0 && statistics.length === 0)) && (now >= matchTime); 
  
  if (needsLiveDetails || needsLineupsFetch) {
    let flashscoreEventId = eventId;
    
    // Se for um ID local, precisamos achar o eventId original na API
    if (flashscoreEventId.startsWith('m_')) {
       const [fixturesData, resultsData] = await Promise.all([
         fetchFromSportDB<FlashscoreEvent[]>(`/fixtures?page=1`).catch(() => []),
         fetchFromSportDB<FlashscoreEvent[]>(`/results?page=1`).catch(() => [])
       ]);
       const allEvents = [...(fixturesData || []), ...(resultsData || [])];
       const matchingEvent = allEvents.find(e => 
         normalizeTeamName(e.homeName) === normalizeTeamName(staticMatch.home_team_name) &&
         normalizeTeamName(e.awayName) === normalizeTeamName(staticMatch.away_team_name)
       );
       if (matchingEvent) flashscoreEventId = matchingEvent.eventId;
    }

    if (!flashscoreEventId.startsWith('m_')) {
      const detailPath = `/match/${flashscoreEventId}/details`;
      const statsPath = `/match/${flashscoreEventId}/stats`;
      const lineupsPath = `/match/${flashscoreEventId}/lineups`;

      const promises = [];
      if (needsLiveDetails) {
        promises.push(fetchFromSportDB<FlashscoreMatchDetails>(detailPath, 15).catch(() => null));
        promises.push(fetchFromSportDB<FlashscoreStatPeriod[]>(statsPath, 15).catch(() => []));
      } else {
        promises.push(Promise.resolve(null));
        promises.push(Promise.resolve([]));
      }

      if (needsLineupsFetch) {
        promises.push(fetchFromSportDB<any>(lineupsPath).catch(() => null));
      } else {
        promises.push(Promise.resolve(null));
      }

      const [apiDetails, apiStats, apiLineups] = await Promise.all(promises);

      let shouldUpsert = false;
      const upsertData: any = { match_id: eventId };

      if (apiDetails) {
        processed.events = apiDetails.events || [];
        processed.referee = apiDetails.referee || "";
        processed.attendance = apiDetails.attendance || "";
        processed.venue = [apiDetails.venue, apiDetails.venueCity].filter(Boolean).join(", ") || processed.venue;
        
        upsertData.events = processed.events;
        upsertData.referee = processed.referee;
        upsertData.attendance = processed.attendance;
        shouldUpsert = true;
      }
      
      if (apiStats && apiStats.length > 0) {
        processed.statistics = apiStats.filter(Boolean);
        upsertData.statistics = processed.statistics;
        shouldUpsert = true;
      }
      
      if (apiLineups) {
        const parsedLineups = parseApiLineups(apiLineups);
        if (parsedLineups) {
           processed.lineups = parsedLineups;
           upsertData.lineups = parsedLineups;
           shouldUpsert = true;
        }
      }

      // Se obtivemos dados novos, salva no banco (preservando o que já tínhamos se não for atualizado agora)
      if (shouldUpsert) {
        if (savedDetails) {
           upsertData.events = upsertData.events || savedDetails.events;
           upsertData.statistics = upsertData.statistics || savedDetails.statistics;
           upsertData.referee = upsertData.referee || savedDetails.referee;
           upsertData.attendance = upsertData.attendance || savedDetails.attendance;
           upsertData.lineups = upsertData.lineups || savedDetails.lineups;
        }
        const { error: upsertError } = await supabase.from('match_details').upsert(upsertData);
        if (upsertError) {
          console.error("Upsert falhou:", upsertError);
        }
      }
    }
  }

  return processed;
}
// Trigger turbopack recompilation
