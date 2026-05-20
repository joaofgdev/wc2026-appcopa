"use client";

import { useEffect, useState, use } from "react";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import { translateTeam } from "@/lib/api";

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [wikiData, setWikiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const teamRawName = decodeURIComponent(unwrappedParams.id);
  const team = translateTeam(teamRawName);

  useEffect(() => {
    async function fetchWiki() {
      try {
        const res = await fetch(`/api/wikipedia?title=${encodeURIComponent(teamRawName)}&ptTitle=${encodeURIComponent(team.name)}`);
        
        if (res.ok) {
          const data = await res.json();
          setWikiData(data);
        }
      } catch (err) {
        console.error("Erro ao carregar wikipedia", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWiki();
  }, [teamRawName, team.name]);

  return (
    <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      <div>
        <BackButton />
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 mt-2 animate-pulse">
          <div className="h-[200px] md:h-[300px] w-full bg-surface-variant/20 rounded-2xl"></div>
          <div className="h-10 w-1/3 bg-surface-variant/20 rounded"></div>
          <div className="h-24 w-full bg-surface-variant/20 rounded mt-4"></div>
        </div>
      ) : (
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
      )}
    </main>
  );
}
