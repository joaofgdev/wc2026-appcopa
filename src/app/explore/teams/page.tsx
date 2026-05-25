import Link from "next/link";
import BackButton from "@/components/BackButton";
import { supabase } from "@/lib/supabase";
import { translateTeam } from "@/lib/api";
import Image from "next/image";

export const revalidate = 60;

async function getWikiImage(urlTitle: string) {
  try {
    const res = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(urlTitle)}`);
    if (res.ok) {
      const data = await res.json();
      return data.originalimage?.source || null;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export default async function TeamsPage() {
  const { data: teamsData, error } = await supabase
    .from('teams')
    .select('name')
    .order('name');

  const teams = teamsData ? teamsData.map(t => t.name) : [];

  const hostNames = ["USA", "Mexico", "Canada"];
  const hosts = teams.filter(t => hostNames.includes(t));
  const outros = teams.filter(t => !hostNames.includes(t));

  const hostsWithImage = await Promise.all(
    hosts.map(async (t) => {
      const team = translateTeam(t);
      const wikiTitle = team.name === "Estados Unidos" ? "Estados_Unidos" : 
                        team.name === "México" ? "México" : 
                        "Canadá";
      const image = await getWikiImage(wikiTitle);
      return { rawName: t, team, image };
    })
  );

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

      {/* Países-Sede */}
      <section className="flex flex-col gap-4 mt-2">
        <h3 className="font-headline-sm text-on-background">Países-Sede</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hostsWithImage.map((host) => (
            <Link 
              key={host.rawName}
              href={`/explore/teams/${encodeURIComponent(host.rawName)}`}
              className="flex flex-col rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:border-primary/50 transition-colors shadow-elevation-md hover:shadow-elevation-lg overflow-hidden group"
            >
              <div className="relative w-full h-48 bg-surface-variant/30">
                {host.image ? (
                  <Image 
                    src={host.image} 
                    alt={host.team.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl">flag</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-center">
                <span className="font-headline-sm text-on-background">{host.team.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Outras Seleções */}
      <section className="flex flex-col gap-4 mt-6">
        <h3 className="font-headline-sm text-on-background">Outras Seleções</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {outros.map((teamNameRaw) => {
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
        </div>
      </section>
    </main>
  );
}
