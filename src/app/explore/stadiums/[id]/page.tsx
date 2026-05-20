"use client";

import { useEffect, useState, use } from "react";
import BackButton from "@/components/BackButton";
import worldcupData from "@/data/worldcup.json";
import Image from "next/image";

export default function StadiumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [wikiData, setWikiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const stadium = worldcupData.stadiums.find((s) => s.wikipedia === unwrappedParams.id);

  useEffect(() => {
    async function fetchWiki() {
      try {
        const res = await fetch(`/api/wikipedia?title=${encodeURIComponent(unwrappedParams.id)}`);
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
  }, [unwrappedParams.id]);

  if (!stadium) {
    return (
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 flex flex-col items-center">
        <BackButton />
        <p className="mt-10">Estádio não encontrado.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      <div>
        <BackButton />
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 mt-2 animate-pulse">
          <div className="h-[300px] w-full bg-surface-variant/20 rounded-2xl"></div>
          <div className="h-10 w-2/3 bg-surface-variant/20 rounded"></div>
          <div className="h-4 w-1/3 bg-surface-variant/20 rounded"></div>
          <div className="h-24 w-full bg-surface-variant/20 rounded mt-4"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-2 animate-fade-in">
          {wikiData?.originalImage && (
            <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-elevation-md">
              <Image 
                src={wikiData.originalImage} 
                alt={stadium.name} 
                fill 
                className="object-cover"
              />
            </div>
          )}

          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">{stadium.name}</h2>
            <div className="flex flex-wrap gap-4 mt-3 text-on-surface-variant font-body-md">
              <span className="flex items-center gap-1 bg-surface-container py-1 px-3 rounded-full">
                <span className="material-symbols-outlined text-[18px]">location_on</span> {stadium.city}, {stadium.country}
              </span>
              <span className="flex items-center gap-1 bg-surface-container py-1 px-3 rounded-full">
                <span className="material-symbols-outlined text-[18px]">groups</span> {stadium.capacity.toLocaleString('pt-BR')} lugares
              </span>
            </div>
          </div>

          {wikiData?.extract && (
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-elevation-sm">
              <h3 className="font-headline-sm text-on-background mb-3">Sobre</h3>
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
