export interface Match {
  id: string;
  round: string;
  group_name: string | null;
  home_team_name: string;
  away_team_name: string;
}

export interface GroupStanding {
  teamName: string;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  played: number;
}

export function calculateGroupStandings(matches: Match[], picks: Record<string, any>) {
  const standings: Record<string, Record<string, GroupStanding>> = {};

  matches.forEach((match) => {
    if (match.round !== "Group Stage" || !match.group_name) return;
    const g = match.group_name;
    const h = match.home_team_name;
    const a = match.away_team_name;

    if (!standings[g]) standings[g] = {};
    if (!standings[g][h]) standings[g][h] = { teamName: h, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, played: 0 };
    if (!standings[g][a]) standings[g][a] = { teamName: a, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, played: 0 };

    const pick = picks[match.id];
    if (pick && typeof pick.homeScore === 'number' && typeof pick.awayScore === 'number') {
      const { homeScore, awayScore } = pick;
      
      standings[g][h].played++;
      standings[g][h].goalsFor += homeScore;
      standings[g][h].goalsAgainst += awayScore;
      standings[g][h].goalDifference += (homeScore - awayScore);

      standings[g][a].played++;
      standings[g][a].goalsFor += awayScore;
      standings[g][a].goalsAgainst += homeScore;
      standings[g][a].goalDifference += (awayScore - homeScore);

      if (homeScore > awayScore) {
        standings[g][h].points += 3;
      } else if (awayScore > homeScore) {
        standings[g][a].points += 3;
      } else {
        standings[g][h].points += 1;
        standings[g][a].points += 1;
      }
    }
  });

  // Sort each group
  const rankedStandings: Record<string, GroupStanding[]> = {};
  for (const g in standings) {
    rankedStandings[g] = Object.values(standings[g]).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }

  return rankedStandings;
}

export function getAdvancingTeams(rankedStandings: Record<string, GroupStanding[]>) {
  const top2: GroupStanding[] = [];
  const thirdPlaces: (GroupStanding & { group: string })[] = [];

  for (const g in rankedStandings) {
    const teams = rankedStandings[g];
    if (teams[0]) top2.push(teams[0]);
    if (teams[1]) top2.push(teams[1]);
    if (teams[2]) thirdPlaces.push({ ...teams[2], group: g });
  }

  // Sort 3rd places
  thirdPlaces.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  const best8Thirds = thirdPlaces.slice(0, 8);
  return { top2, best8Thirds };
}
