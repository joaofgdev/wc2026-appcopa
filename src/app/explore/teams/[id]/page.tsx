import BackButton from "@/components/BackButton";
import Image from "next/image";
import { translateTeam, getWorldCupFixtures } from "@/lib/api";
import CountdownBanner from "@/components/CountdownBanner";

export const revalidate = 3600;

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const teamRawName = decodeURIComponent(unwrappedParams.id);
  const team = translateTeam(teamRawName);

  let wikiData: any = null;
  let debutMatch: any = null;

  try {
    const wikiUrl = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(team.name)}`;
    const wikiRes = await fetch(wikiUrl);
    
    if (wikiRes.ok) {
      const data = await wikiRes.json();
      wikiData = {
        title: data.title,
        extract: data.extract,
        originalImage: data.originalimage?.source || data.thumbnail?.source || null,
        pageUrl: data.content_urls?.desktop?.page || null,
      };
    } else {
      const fallbackUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(teamRawName)} national football team`;
      const fallbackRes = await fetch(fallbackUrl);
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        wikiData = {
          title: data.title,
          extract: data.extract,
          originalImage: data.originalimage?.source || data.thumbnail?.source || null,
          pageUrl: data.content_urls?.desktop?.page || null,
        };
      }
    }

    const fixtures = await getWorldCupFixtures();
    const teamFixtures = fixtures.filter((f: any) => 
      f.homeTeam?.name === team.name || f.awayTeam?.name === team.name ||
      f.homeTeam?.code === team.code || f.awayTeam?.code === team.code ||
      f.homeTeam?.name === teamRawName || f.awayTeam?.name === teamRawName
    ).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (teamFixtures.length > 0) {
      debutMatch = teamFixtures[0];
    }
  } catch (err) {
    console.error("Erro ao carregar dados", err);
  }

  return (
    <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      <div>
        <BackButton />
      </div>

      <div className="flex flex-col gap-6 mt-2 animate-fade-in">
        {wikiData?.originalImage ? (
          <div className="relative w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden shadow-elevation-md bg-surface-container">
            <Image 
              src={wikiData.originalImage} 
              alt={team.name} 
              fill 
              className="object-contain p-4"
            />
          </div>
        ) : (
          <div className="relative w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden shadow-elevation-md bg-surface-container flex items-center justify-center">
            <span className="font-headline-lg text-on-surface-variant opacity-50">{team.name}</span>
          </div>
        )}

        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background flex items-center gap-3">
            {team.name} <span className="text-on-surface-variant text-2xl font-body-md opacity-50">{team.code}</span>
          </h2>
        </div>

        {debutMatch && (
          <div className="w-full">
            <CountdownBanner 
              targetDate={debutMatch.date}
              title={`Estreia - ${team.name}`}
              modalTitle={`A Estreia de ${team.name}`}
              modalDescription={`A contagem regressiva para o primeiro jogo de ${team.name} na Copa do Mundo FIFA 2026™ já começou! Eles vão enfrentar ${debutMatch.homeTeam?.name === team.name ? debutMatch.awayTeam?.name : debutMatch.homeTeam?.name}.`}
            />
          </div>
        )}

        {wikiData?.extract && (
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-elevation-sm">
            <h3 className="font-headline-sm text-on-background mb-3">História e Curiosidades</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {wikiData.extract}
            </p>
            {wikiData?.pageUrl && (
              <a 
                href={wikiData.pageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-4 text-primary hover:underline text-sm font-label-caps"
              >
                Ler mais na Wikipedia <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
