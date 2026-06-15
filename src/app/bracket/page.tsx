import BackButton from "@/components/BackButton";
import BracketView from "@/components/BracketView";
import { supabase } from "@/lib/supabase";
import { getWorldCupFixtures } from "@/lib/api";

export const revalidate = 15; // ISR for live updates

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

export default async function BracketPage() {
  let groupsData: Record<string, any> = {};
  let knockoutMatches: any[] = [];

  try {
    const fixtures = await getWorldCupFixtures();
    const teamStats: Record<string, Record<string, TeamStanding>> = {};

    for (const fixture of fixtures) {
      if (!fixture.group || fixture.round.includes("Final") || fixture.round.includes("Oitavas")) continue;
      
      const group = fixture.group;
      if (!teamStats[group]) teamStats[group] = {};

      if (!teamStats[group][fixture.homeTeam.name]) {
        teamStats[group][fixture.homeTeam.name] = {
          name: fixture.homeTeam.name,
          code: fixture.homeTeam.code,
          flagUrl: fixture.homeTeam.logo,
          played: 0, wins: 0, draws: 0, losses: 0,
          goalsFor: 0, goalsAgainst: 0, goalDifference: "+0", points: 0
        };
      }
      
      if (!teamStats[group][fixture.awayTeam.name]) {
        teamStats[group][fixture.awayTeam.name] = {
          name: fixture.awayTeam.name,
          code: fixture.awayTeam.code,
          flagUrl: fixture.awayTeam.logo,
          played: 0, wins: 0, draws: 0, losses: 0,
          goalsFor: 0, goalsAgainst: 0, goalDifference: "+0", points: 0
        };
      }

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

    for (const group of Object.keys(teamStats)) {
      const teams = Object.values(teamStats[group]);
      teams.forEach(t => {
        const diff = t.goalsFor - t.goalsAgainst;
        t.goalDifference = diff > 0 ? `+${diff}` : `${diff}`;
      });
      
      teams.sort((a, b) => {
        if (a.points !== b.points) return b.points - a.points;
        const diffA = a.goalsFor - a.goalsAgainst;
        const diffB = b.goalsFor - b.goalsAgainst;
        if (diffA !== diffB) return diffB - diffA;
        return b.goalsFor - a.goalsFor;
      });
      
      groupsData[group] = teams;
    }

    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .neq('round', 'Group Stage')
      .order('match_date');

    if (matches && !error) {
      knockoutMatches = matches.map((m: any) => ({
        id: m.id,
        group: m.group_name,
        round: m.round,
        date: m.match_date,
        homeTeam: m.home_team_name,
        awayTeam: m.away_team_name,
        venue: m.venue_name,
        status: m.status
      }));
    }
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
  }

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-8 pt-6 pb-32 md:pb-8 flex flex-col gap-6 min-h-screen">
      <div className="pt-2">
        <BackButton />
      </div>

      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(101,177,163,0.15)",
            border: "1px solid rgba(101,177,163,0.3)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "30px",
              color: "#65B1A3",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            emoji_events
          </span>
        </div>
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: "var(--font-sora), sans-serif",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Central do Torneio
          </h1>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "#A8C5C2",
              fontFamily: "var(--font-sora), sans-serif",
              marginTop: "3px",
            }}
          >
            Classificação ao vivo e chave eliminatória.
          </p>
        </div>
      </div>

      <BracketView groupsData={groupsData} knockoutMatches={knockoutMatches} />
    </main>
  );
}