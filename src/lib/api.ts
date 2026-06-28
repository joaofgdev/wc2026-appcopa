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
import { fetchOpenFootballFixtures } from "@/services/openfootball.service";

const SEASON = "2026";

// Resolve URL do logo (pode vir como caminho parcial ou URL completa)
function resolveLogoUrl(logo: string): string {
  if (!logo) return "";
  if (logo.startsWith("http")) return logo;
  return `https://static.flashscore.com/res/image/data/${logo}`;
}

// Dicionário de traduções de países (Inglês -> Português + Código PT)
export const COUNTRY_TRANSLATIONS: Record<string, { name: string; code: string; iso2: string }> = {
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
  if (!name) return { name: "", code: "UNK", iso2: "" };
  
  const translation = COUNTRY_TRANSLATIONS[name];
  if (translation) return translation;
  
  const reverseEntry = Object.values(COUNTRY_TRANSLATIONS).find(t => t.name.toLowerCase() === name.toLowerCase());
  if (reverseEntry) return reverseEntry;

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
export function normalizeTeamName(name: string): string {
  if (!name) return "";
  let normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (normalized === "DR Congo" || normalized === "D.R. Congo") return "D.R. Congo";
  if (normalized === "USA" || normalized === "United States") return "USA";
  return normalized;
}



export async function getWorldCupFixtures(): Promise<ProcessedFixture[]> {
  const { data: dbMatches, error } = await supabase.from('matches').select('*').order('match_date');
  const staticMatches = dbMatches || [];
  
  const now = Date.now();
  
  // Apenas precisamos buscar da API do github se houver jogos não finalizados
  const needsApiUpdate = staticMatches.some((m) => !m.details_saved);

  let openFixtures: import("@/services/openfootball.service").OpenFootballMatch[] = [];
  let sportDbFixtures: any[] = [];

  if (needsApiUpdate) {
    openFixtures = await fetchOpenFootballFixtures();
    const sportDbData = await fetchFromSportDB("/fixtures?league=1&season=2026") as any;
    sportDbFixtures = sportDbData?.response || [];
  }

  const promisesToUpdateDb: any[] = [];

  const processedMatches = staticMatches.map((staticMatch) => {
    let statusLong = "Não Iniciado";
    let statusShort = "NS";
    let elapsed = null;
    let goalsHome = staticMatch.goals_home;
    let goalsAway = staticMatch.goals_away;
    let updatedHomeName = staticMatch.home_team_name;
    let updatedAwayName = staticMatch.away_team_name;

    // Tenta encontrar o correspondente na API do OpenFootball
    const openMatch = openFixtures.find(
      (e) => {
        const team1Api = normalizeTeamName(translateTeam(e.team1).name);
        const team2Api = normalizeTeamName(translateTeam(e.team2).name);
        const team1Db = normalizeTeamName(translateTeam(staticMatch.home_team_name).name);
        const team2Db = normalizeTeamName(translateTeam(staticMatch.away_team_name).name);
        
        if (team1Api === team1Db && team2Api === team2Db) return true;
        
        // Ultimate fallback: Match by exact Match Number (num) for knockout stages
        if (e.num && staticMatch.id === `m_${e.num}`) return true;
        
        // Fallback for knockout matches using exact time
        if (staticMatch.round !== "Group Stage" && !staticMatch.group_name && e.time && e.time.includes("UTC")) {
          try {
            const [time, offset] = e.time.split(" UTC");
            const [h, m] = time.split(":");
            const ofDate = new Date(`${e.date}T00:00:00Z`);
            ofDate.setUTCHours(parseInt(h) - parseInt(offset), parseInt(m), 0, 0);
            
            const dbDateMs = new Date(staticMatch.match_date).getTime();
            if (Math.abs(ofDate.getTime() - dbDateMs) < 3600000) {
              return true;
            }
          } catch (err) {
            // Ignore parse errors
          }
        }
        return false;
      }
    );

    const isPlaceholder = (name: string) => /\d/.test(name) || name.includes("/");

    const homeTeam = translateTeam(updatedHomeName);
    const awayTeam = translateTeam(updatedAwayName);

    const matchTimeMs = new Date(staticMatch.match_date).getTime();

    const isDbFinished = ["FT", "AET", "PEN"].includes(staticMatch.status_short || "");

    if (staticMatch.details_saved || isDbFinished) {
      statusShort = staticMatch.status_short || "FT";
      statusLong = "Encerrado"; 
    } else {
      if (now >= matchTimeMs) {
        statusShort = staticMatch.status_short && staticMatch.status_short !== "NS" ? staticMatch.status_short : "LIVE";
        statusLong = statusShort === "HT" ? "Intervalo" : "Ao Vivo";
      }

      if (openMatch) {
         // Update team names if they are real countries and not placeholders
         if (!isPlaceholder(openMatch.team1)) updatedHomeName = translateTeam(openMatch.team1).name;
         if (!isPlaceholder(openMatch.team2)) updatedAwayName = translateTeam(openMatch.team2).name;

         if (openMatch.score) {
           if (openMatch.score.ft) {
             goalsHome = openMatch.score.ft[0];
             goalsAway = openMatch.score.ft[1];
             statusShort = "FT";
             statusLong = "Encerrado";
           } else if (openMatch.score.ht) {
             goalsHome = openMatch.score.ht[0];
             goalsAway = openMatch.score.ht[1];
             statusShort = "HT";
             statusLong = "Intervalo";
           }
         }
      }

      // Fallback for SportDB if OpenFootball is outdated and still has placeholders
      if (staticMatch.round !== "Group Stage" && (isPlaceholder(updatedHomeName) || isPlaceholder(updatedAwayName))) {
        const dbTimeMs = new Date(staticMatch.match_date).getTime();
        const matchSdb = sportDbFixtures.find((s: any) => Math.abs(new Date(s.fixture.date).getTime() - dbTimeMs) < 3600000);
        if (matchSdb) {
          if (!isPlaceholder(matchSdb.teams.home.name)) updatedHomeName = translateTeam(matchSdb.teams.home.name).name;
          if (!isPlaceholder(matchSdb.teams.away.name)) updatedAwayName = translateTeam(matchSdb.teams.away.name).name;
        }
      }

      // Verifica se houve atualização nos gols, status ou times e agenda update no banco
      if (
        goalsHome !== staticMatch.goals_home ||
        goalsAway !== staticMatch.goals_away ||
        statusShort !== staticMatch.status_short ||
        updatedHomeName !== staticMatch.home_team_name ||
        updatedAwayName !== staticMatch.away_team_name
      ) {
        promisesToUpdateDb.push(
          supabase.from('matches').update({
            goals_home: goalsHome,
            goals_away: goalsAway,
            status_short: statusShort,
            home_team_name: updatedHomeName,
            away_team_name: updatedAwayName
          }).eq('id', staticMatch.id)
        );
      }
    }

    const baseFixture: ProcessedFixture = {
      id: staticMatch.id,
      date: staticMatch.match_date,
      timestamp: matchTimeMs / 1000,
      status: { long: statusLong, short: statusShort, elapsed },
      venue: staticMatch.venue_name,
      round: translateRound(staticMatch.round),
      group: translateGroup(staticMatch.group_name),
      homeTeam: {
        id: "h",
        name: translateTeam(updatedHomeName).name,
        code: translateTeam(updatedHomeName).code,
        logo: translateTeam(updatedHomeName).iso2 ? `https://flagcdn.com/${translateTeam(updatedHomeName).iso2}.svg` : `https://flagsapi.com/${translateTeam(updatedHomeName).code}/flat/64.png`,
      },
      awayTeam: {
        id: "a",
        name: translateTeam(updatedAwayName).name,
        code: translateTeam(updatedAwayName).code,
        logo: translateTeam(updatedAwayName).iso2 ? `https://flagcdn.com/${translateTeam(updatedAwayName).iso2}.svg` : `https://flagsapi.com/${translateTeam(updatedAwayName).code}/flat/64.png`,
      },
      goalsHome,
      goalsAway,
      detailsLink: "",
      statsLink: "",
    };

    return baseFixture;
  });

  if (promisesToUpdateDb.length > 0) {
    // Executa as atualizações no banco (sem bloquear o retorno se quiser, mas para garantir no servidor Next, aguardamos)
    await Promise.all(promisesToUpdateDb).catch(e => console.error("Erro salvando placar no banco:", e));
  }

  return processedMatches;
}

// Helper para parsear TV channels da API
function parseBroadcasters(rawTvData?: string): { name: string, url: string, logo: string }[] {
  if (!rawTvData) return [];
  try {
    const data = JSON.parse(rawTvData);
    const arrays = Object.values(data);
    const allChannels: any[] = arrays.flat();
    
    // Filter for Brazil channels: end with (Bra) or specific names
    const braChannels = allChannels.filter(c => c.BN && c.BN.endsWith('(Bra)'));
    
    // Map of channel name (lower case without (bra)) to logos
    const logos: Record<string, string> = {
      'tv globo': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/TV_Globo_logo_%28April_2025%29.png',
      'sportv': 'https://upload.wikimedia.org/wikipedia/commons/2/26/SporTV_2021.png',
      'caze tv': 'https://logodownload.org/wp-content/uploads/2024/03/cazetv-logo.png',
      'globoplay': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/TV_Globo_logo_%28April_2025%29.png',
      'sbt': 'https://upload.wikimedia.org/wikipedia/pt/thumb/4/41/Logotipo_do_SBT.svg/500px-Logotipo_do_SBT.svg.png?_=20150423190334',
      'ge': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJXlTtp7GWq3nq6XzYSotZ2_w6MdRcRycJ9w&s',
      'nsports': 'https://yt3.googleusercontent.com/l6-Nls7xLqgra_jRIZS2lvFcR4mY0fH7hSZjb0EvpCpfLFCRzQV1X2pkl1JR9TgB82PIK2A9wg=s900-c-k-c0x00ffffff-no-rj',
      'claro tv+': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claro_tv%2B.png/512px-Claro_tv%2B.png',
      'zapping': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Zapping_TV_logo.png/512px-Zapping_TV_logo.png'
    };

    return braChannels.map(c => {
      const name = c.BN.replace('(Bra)', '').trim();
      const lowerName = name.toLowerCase();
      return {
        name,
        url: c.BU || '#',
        logo: logos[lowerName] || '/broadcasters/sportv.svg' // generic fallback
      };
    });
  } catch (err) {
    return [];
  }
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

  const parsedStats = typeof statistics === 'string' ? JSON.parse(statistics) : statistics;
  let finalBroadcasters: { name: string, url: string, logo: string }[] = [];
  const validStats = Array.isArray(parsedStats) ? parsedStats : [];
  const bPeriodIndex = validStats.findIndex(p => p.period === "Broadcasters");
  
  if (bPeriodIndex >= 0) {
    finalBroadcasters = validStats[bPeriodIndex].stats.map((s: any) => ({
      name: s.statName,
      url: s.homeValue,
      logo: s.awayValue
    }));
    // Remove the fake period
    statistics = validStats.filter((_, i) => i !== bPeriodIndex);
  } else {
    statistics = validStats;
  }
  
  // Re-assign correctly filtered stats to processed
  processed.statistics = statistics;
  
  let hasBroadcasters = finalBroadcasters.length > 0;

  // Fallback: se a API não retornou canais (ou o jogo é muito antigo),
  // assumimos que na Copa de 2026 vai passar nas emissoras principais
  if (!hasBroadcasters) {
    finalBroadcasters = [
      { name: 'TV Globo', url: 'https://globoplay.globo.com/', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/TV_Globo_logo_%28April_2025%29.png' },
      { name: 'CazéTV', url: 'https://www.youtube.com/@CazeTV', logo: 'https://logodownload.org/wp-content/uploads/2024/03/cazetv-logo.png' },
      { name: 'SporTV', url: 'https://ge.globo.com/sportv/', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/26/SporTV_2021.png' },
      { name: 'SBT', url: 'https://sbt.com.br/', logo: 'https://upload.wikimedia.org/wikipedia/pt/thumb/4/41/Logotipo_do_SBT.svg/500px-Logotipo_do_SBT.svg.png?_=20150423190334' },
      { name: 'GE', url: 'https://ge.globo.com/', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJXlTtp7GWq3nq6XzYSotZ2_w6MdRcRycJ9w&s' },
      { name: 'NSports', url: 'https://www.nsports.com.br/', logo: 'https://yt3.googleusercontent.com/l6-Nls7xLqgra_jRIZS2lvFcR4mY0fH7hSZjb0EvpCpfLFCRzQV1X2pkl1JR9TgB82PIK2A9wg=s900-c-k-c0x00ffffff-no-rj' }
    ];
    hasBroadcasters = true;
    
    // Injeta na lista de estatísticas para salvar no banco futuramente
    validStats.push({
      period: "Broadcasters",
      stats: finalBroadcasters.map(b => ({
        statId: "tv",
        statName: b.name,
        homeValue: b.url,
        awayValue: b.logo
      }))
    });
  }

  const isFinished = ["FT", "AET", "PEN"].includes(processed.status.short);
  
  // Só busca as escalações se não tivermos no banco E o jogo for em até 1 hora ou já tiver começado
  const needsLineupsFetch = !lineups && (isWithin1Hour || now >= matchTime);
  
  // Busca detalhes na API se o jogo já começou e não temos detalhes OU não temos os broadcasters
  const needsLiveDetails = (!staticMatch.details_saved || (events.length === 0 && validStats.length === 0) || !hasBroadcasters) && (now >= matchTime || isWithin1Hour); 
  
  if (needsLiveDetails || needsLineupsFetch) {
    let flashscoreEventId = eventId;
    let rawTvData: string | undefined = undefined;
    
    // Encontrar o evento original para mapear o ID e extrair dados da TV
    const [fixturesData, res1, res2, res3] = await Promise.all([
      fetchFromSportDB<FlashscoreEvent[]>(`/fixtures?page=1`).catch(() => []),
      fetchFromSportDB<FlashscoreEvent[]>(`/results?page=1`).catch(() => []),
      fetchFromSportDB<FlashscoreEvent[]>(`/results?page=2`).catch(() => []),
      fetchFromSportDB<FlashscoreEvent[]>(`/results?page=3`).catch(() => [])
    ]);
    const allEvents = [...(fixturesData || []), ...(res1 || []), ...(res2 || []), ...(res3 || [])];
    
    let matchingEvent;
    if (flashscoreEventId.startsWith('m_')) {
      matchingEvent = allEvents.find(e => {
        const teamMatch = normalizeTeamName(translateTeam(e.homeName).name) === normalizeTeamName(translateTeam(staticMatch.home_team_name).name) &&
                          normalizeTeamName(translateTeam(e.awayName).name) === normalizeTeamName(translateTeam(staticMatch.away_team_name).name);
        if (teamMatch) return true;

        if (staticMatch.round !== "Group Stage" && !staticMatch.group_name) {
          const apiTime = new Date(e.startDateTimeUtc).getTime();
          const dbTime = new Date(staticMatch.match_date).getTime();
          if (Math.abs(apiTime - dbTime) < 3600000) return true;
        }
        return false;
      });
    } else {
      matchingEvent = allEvents.find(e => e.eventId === flashscoreEventId);
    }
    
    if (matchingEvent) {
      flashscoreEventId = matchingEvent.eventId;
      rawTvData = matchingEvent.hasTvOrLivestreaming;
      
      const apiStatus = mapEventStageToStatus(matchingEvent);
      processed.status = apiStatus;
      
      const homeScore = matchingEvent.homeScore ?? matchingEvent.homeFullTimeScore ?? null;
      const awayScore = matchingEvent.awayScore ?? matchingEvent.awayFullTimeScore ?? null;
      processed.goalsHome = homeScore !== null ? parseInt(homeScore) : processed.goalsHome;
      processed.goalsAway = awayScore !== null ? parseInt(awayScore) : processed.goalsAway;
    }

    if (!flashscoreEventId.startsWith('m_')) {
      const detailPath = `/match/${flashscoreEventId}/details`;
      const statsPath = `/match/${flashscoreEventId}/stats`;
      const lineupsPath = `/match/${flashscoreEventId}/lineups`;

      const promises = [];
      if (needsLiveDetails) {
        promises.push(fetchFromSportDB<FlashscoreMatchDetails>(detailPath).catch(() => null));
        promises.push(fetchFromSportDB<FlashscoreStatPeriod[]>(statsPath).catch(() => []));
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
        } else if (["FT", "AET", "PEN"].includes(processed.status.short) && processed.events.length > 0) {
          // Atualiza a tabela matches para marcar como salvo permanentemente e evitar chamadas futuras na Home
          await supabase.from('matches').update({
            details_saved: true,
            status_short: processed.status.short,
            goals_home: processed.goalsHome,
            goals_away: processed.goalsAway
          }).eq('id', eventId);
          console.log(`[Cache] Jogo ${eventId} salvo permanentemente no banco via detalhe.`);
        }
      }
    }
  }

  processed.broadcasters = finalBroadcasters;
  return processed;
}
// Trigger turbopack recompilation
