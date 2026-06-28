export interface OpenFootballMatch {
  round: string;
  num?: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score?: {
    ft?: [number, number];
    ht?: [number, number];
    et?: [number, number];
    p?: [number, number];
  };
  group?: string;
  ground: string;
}

export interface OpenFootballResponse {
  name: string;
  matches: OpenFootballMatch[];
}

const API_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

export async function fetchOpenFootballFixtures(): Promise<OpenFootballMatch[]> {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 30 } // Atualiza a cada 30 segundos usando o arquivo bruto do github
    });
    
    if (!response.ok) {
      console.warn(`[OpenFootball] Error fetching public json: ${response.status}`);
      return [];
    }

    const data: OpenFootballResponse = await response.json();
    return data.matches || [];
  } catch (err) {
    console.error("[OpenFootball] Connection error:", err);
    return [];
  }
}
