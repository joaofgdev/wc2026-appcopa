// Tipos para a API SportDB (Flashscore) - Copa do Mundo 2026

// ==========================================
// Tipos da resposta bruta da API Flashscore
// ==========================================

/** Jogo retornado pela API (fixtures/results) */
export interface FlashscoreEvent {
  eventId: string;
  eventStage: string; // "SCHEDULED", "FINISHED", "LIVE", etc.
  eventStageId: string;
  startDateTimeUtc: string; // ISO date string
  startTime: string; // Unix timestamp (string)
  startUtime: string;
  round: string; // "Round 1", "Round 2", "Round 3", "Round of 16", "Quarter-finals", "Semi-finals", "Final"
  standingGroup: string | null; // "Group A", "Group B", etc.

  // Home
  homeName: string;
  home3CharName: string;
  homeLogo: string; // URL parcial ou completa
  homeParticipantIds: string;
  homeEventParticipantId: string;
  homeScore?: string;
  homeFullTimeScore?: string;
  homeResultPeriod2?: string;

  // Away
  awayName: string;
  away3CharName: string;
  awayLogo: string;
  awayParticipantIds: string;
  awayEventParticipantId: string;
  awayScore?: string;
  awayFullTimeScore?: string;
  awayResultPeriod2?: string;

  // Torneio
  tournamentName: string;
  tournamentStage: {
    countryId: string;
    countryName: string;
    groupId: string;
    groupName: string; // "Final tournament", "Qualification"
    id: string;
    name: string;
    statsType: string;
  };

  // Links para detalhes
  links: {
    details: string;
    lineups: string;
    odds: string;
    playerStats: string;
    stats: string;
  };

  // Status ao vivo
  gameTime?: string;
  ftWinner?: string;
  winner?: string;
}

/** Incidente/evento de um jogo (gol, cartão, substituição) */
export interface FlashscoreIncident {
  eventId: string;
  incidentHalf: string;
  incidentTime: string; // ex: "10'"
  incidentSide: string; // "1" = home, "2" = away
  incidentType: string | string[]; // "3" = Goal, "1" = Yellow Card, etc.
  incidentTypeName: string | string[]; // "Goal", "Yellow Card", "Substitution - Out", etc.
  incidentSubtype?: string;
  incidentSubtypeName?: string;
  incidentPlayerId: string | string[];
  incidentPlayerName: string | string[];
  incidentPlayerUrl?: string | string[];
  incidentCommentary?: string | string[];
  homeScore?: string;
  awayScore?: string;
}

/** Detalhes de um jogo */
export interface FlashscoreMatchDetails {
  homeId: string;
  homeSlug: string;
  homeName: string;
  homeLogo: string;
  homeScore?: string;
  awayId: string;
  awaySlug: string;
  awayName: string;
  awayLogo: string;
  awayScore?: string;
  venue?: string;
  venueCity?: string;
  referee?: string;
  attendance?: string;
  capacity?: string;
  events: FlashscoreIncident[];
}

/** Estatísticas de jogo */
export interface FlashscoreStatPeriod {
  period: string; // "Match", "1st Half", "2nd Half"
  stats: FlashscoreStatItem[];
}

export interface FlashscoreStatItem {
  statId: string;
  statName: string; // "Ball possession", "Total shots", etc.
  homeValue: string;
  awayValue: string;
}

// ==========================================
// Tipos processados para o frontend
// ==========================================

export interface FixtureStatus {
  long: string;
  short: string; // Mantém compatibilidade: "NS", "1H", "HT", "2H", "FT", "LIVE", etc.
  elapsed: number | null;
}

export interface ProcessedFixture {
  id: string;
  date: string;
  timestamp: number;
  status: FixtureStatus;
  venue: string;
  round: string;
  group: string;
  homeTeam: {
    id: string;
    name: string;
    code: string;
    logo: string;
  };
  awayTeam: {
    id: string;
    name: string;
    code: string;
    logo: string;
  };
  goalsHome: number | null;
  goalsAway: number | null;
  detailsLink: string;
  statsLink: string;
}

export interface PlayerLineup {
  id: string;
  name: string;
  number: string;
  position: string;
}

export interface MatchLineups {
  home: {
    starting: PlayerLineup[];
    substitutes: PlayerLineup[];
    coach: string;
    formation: string;
  };
  away: {
    starting: PlayerLineup[];
    substitutes: PlayerLineup[];
    coach: string;
    formation: string;
  };
}

export interface ProcessedMatchDetail extends ProcessedFixture {
  events: FlashscoreIncident[];
  statistics: FlashscoreStatPeriod[];
  referee: string;
  attendance: string;
  lineups?: MatchLineups;
}
