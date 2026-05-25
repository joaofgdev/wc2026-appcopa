import { NextResponse } from "next/server";
import { getWorldCupFixtures } from "@/lib/api";
import type { ProcessedFixture } from "@/types/football";

interface TeamStanding {
  name: string;
  code: string;
  flagUrl: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: string;
  points: number;
}

export async function GET() {
  try {
    const fixtures = await getWorldCupFixtures();
    const standings: Record<string, TeamStanding[]> = {};
    const teamStats: Record<string, Record<string, TeamStanding>> = {};

    // Inicializa times e calcula
    for (const fixture of fixtures) {
      if (!fixture.group || fixture.round.includes("Final") || fixture.round.includes("Oitavas")) continue;
      
      const group = fixture.group;
      if (!teamStats[group]) teamStats[group] = {};

      // Init home
      if (!teamStats[group][fixture.homeTeam.name]) {
        teamStats[group][fixture.homeTeam.name] = {
          name: fixture.homeTeam.name,
          code: fixture.homeTeam.code,
          flagUrl: fixture.homeTeam.logo,
          played: 0, wins: 0, draws: 0, losses: 0,
          goalsFor: 0, goalsAgainst: 0, goalDifference: "+0", points: 0
        };
      }
      
      // Init away
      if (!teamStats[group][fixture.awayTeam.name]) {
        teamStats[group][fixture.awayTeam.name] = {
          name: fixture.awayTeam.name,
          code: fixture.awayTeam.code,
          flagUrl: fixture.awayTeam.logo,
          played: 0, wins: 0, draws: 0, losses: 0,
          goalsFor: 0, goalsAgainst: 0, goalDifference: "+0", points: 0
        };
      }

      // Se jogo terminou
      if (["FT", "AET", "PEN"].includes(fixture.status.short)) {
        const hStats = teamStats[group][fixture.homeTeam.name];
        const aStats = teamStats[group][fixture.awayTeam.name];
        
        const hGoals = fixture.goalsHome || 0;
        const aGoals = fixture.goalsAway || 0;

        hStats.played++;
        aStats.played++;
        hStats.goalsFor += hGoals;
        hStats.goalsAgainst += aGoals;
        aStats.goalsFor += aGoals;
        aStats.goalsAgainst += hGoals;

        if (hGoals > aGoals) {
          hStats.wins++; hStats.points += 3;
          aStats.losses++;
        } else if (aGoals > hGoals) {
          aStats.wins++; aStats.points += 3;
          hStats.losses++;
        } else {
          hStats.draws++; hStats.points += 1;
          aStats.draws++; aStats.points += 1;
        }
      }
    }

    // Formata, calcula saldo e ordena
    for (const group of Object.keys(teamStats)) {
      const teams = Object.values(teamStats[group]);
      teams.forEach(t => {
        const diff = t.goalsFor - t.goalsAgainst;
        t.goalDifference = diff > 0 ? `+${diff}` : `${diff}`;
      });
      
      // Ordena por PTS, SG, GF
      teams.sort((a, b) => {
        if (a.points !== b.points) return b.points - a.points;
        const diffA = a.goalsFor - a.goalsAgainst;
        const diffB = b.goalsFor - b.goalsAgainst;
        if (diffA !== diffB) return diffB - diffA;
        return b.goalsFor - a.goalsFor;
      });
      
      standings[group] = teams;
    }

    return NextResponse.json({ standings });
  } catch (err) {
    console.error("Erro na rota de grupos:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
