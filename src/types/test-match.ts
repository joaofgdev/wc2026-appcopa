export interface TestTeam {
  id: string;
  name: string;
  shortName: string;
  logo: string;
}

export interface TestMatchStatus {
  long: string;
  short: string; // 'NS', 'LIVE', 'FT'
  elapsed: number | null;
}

export interface TestMatchData {
  id: string;
  competition: string;
  round: string;
  date: string;
  timestamp: number;
  venue: string;
  status: TestMatchStatus;
  homeTeam: TestTeam;
  awayTeam: TestTeam;
  goalsHome: number | null;
  goalsAway: number | null;
}

export interface TestMatchStats {
  home: {
    possession: number;
    shotsOnTarget: number;
    shotsOffTarget: number;
    corners: number;
    fouls: number;
    yellowCards: number;
    redCards: number;
  };
  away: {
    possession: number;
    shotsOnTarget: number;
    shotsOffTarget: number;
    corners: number;
    fouls: number;
    yellowCards: number;
    redCards: number;
  };
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}

export interface TestMatchLineups {
  home: {
    coach: string;
    startingXI: Player[];
    substitutes: Player[];
  };
  away: {
    coach: string;
    startingXI: Player[];
    substitutes: Player[];
  };
}
