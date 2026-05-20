import Link from "next/link";
import BackButton from "@/components/BackButton";
import worldcupData from "@/data/worldcup.json";
import { translateTeam } from "@/lib/api";

function getUniqueTeams() {
  const teams = new Set<string>();
  Object.values(worldcupData.groups).forEach(group => {
    group.forEach(team => teams.add(team));
  });
  return Array.from(teams).sort();
}

export default function TeamsPage() {
  const teams = getUniqueTeams();

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      <div>
        <BackButton />
      </div>

      <section className="flex flex-col gap-stack-md mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Seleções</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Conheça as 48 equipes classificadas para a Copa.</p>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
        {teams.map((teamNameRaw) => {
          const team = translateTeam(teamNameRaw);
          return (
            <Link 
              key={teamNameRaw}
              href={`/explore/teams/${encodeURIComponent(teamNameRaw)}`}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:border-primary/50 transition-colors shadow-elevation-sm hover:shadow-elevation-md text-center gap-2"
            >
              <span className="font-headline-sm text-on-background">{team.name}</span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
