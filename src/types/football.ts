// Tipos para a API-Football v3

export interface ApiTeam {
  id: number;
  name: string;
  code: string | null;
  logo: string;
  winner: boolean | null;
}

export interface FixtureStatus {
  long: string;
  short: string; // "NS" | "1H" | "HT" | "2H" | "FT" | "AET" | "PEN" | "PST" | "CANC" | "ABD" | "AWD" | "WO"
  elapsed: number | null;
}

export interface FixtureInfo {
  id: number;
  referee: string | null;
  timezone: string;
  date: string; // ISO date string
  timestamp: number;
  venue: {
    id: number | null;
    name: string | null;
    city: string | null;
  };
  status: FixtureStatus;
}

export interface LeagueInfo {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
  round: string; // "Group A - 1", "Quarter-finals", etc.
}

export interface FixtureGoals {
  home: number | null;
  away: number | null;
}

export interface FixtureScore {
  halftime: FixtureGoals;
  fulltime: FixtureGoals;
  extratime: FixtureGoals;
  penalty: FixtureGoals;
}

export interface Fixture {
  fixture: FixtureInfo;
  league: LeagueInfo;
  teams: {
    home: ApiTeam;
    away: ApiTeam;
  };
  goals: FixtureGoals;
  score: FixtureScore;
}

// Eventos do jogo (gols, cartões, substituições)
export interface FixtureEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: string; // "Goal", "Card", "subst", "Var"
  detail: string; // "Normal Goal", "Penalty", "Yellow Card", "Red Card", "Substitution 1", etc.
  comments: string | null;
}

// Estatísticas do jogo
export interface StatisticItem {
  type: string; // "Shots on Goal", "Ball Possession", "Fouls", etc.
  value: number | string | null;
}

export interface FixtureStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: StatisticItem[];
}

// Resposta da API
export interface ApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: Record<string, string> | string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T[];
}

// Tipos para dados processados no frontend
export interface ProcessedFixture {
  id: number;
  date: string;
  timestamp: number;
  status: FixtureStatus;
  venue: string;
  round: string;
  homeTeam: {
    id: number;
    name: string;
    code: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    code: string;
    logo: string;
  };
  goalsHome: number | null;
  goalsAway: number | null;
}

export interface ProcessedMatchDetail extends ProcessedFixture {
  events: FixtureEvent[];
  statistics: {
    home: StatisticItem[];
    away: StatisticItem[];
  };
}
