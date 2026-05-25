import BackButton from "@/components/BackButton";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default async function StadiumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const decodedId = decodeURIComponent(unwrappedParams.id);
  
  // Roda no servidor, logo tem acesso ao Service Role Key (bypassa RLS)
  const { data: stadium, error } = await supabase
    .from('stadiums')
    .select('*')
    .eq('wikipedia_url', decodedId)
    .single();

  if (error || !stadium) {
    console.error("Erro ao carregar estádio no servidor:", error);
    return (
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 flex flex-col items-center">
        <BackButton />
        <p className="mt-10 text-on-background">Estádio não encontrado.</p>
      </main>
    );
  }

  // Buscar Wikipedia no servidor
  let wikiData = null;
  try {
    const wikiUrl = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(decodedId)}`;
    const wikiRes = await fetch(wikiUrl);
    if (wikiRes.ok) {
      const wData = await wikiRes.json();
      wikiData = {
        extract: wData.extract,
        originalImage: wData.originalimage?.source,
        pageUrl: wData.content_urls?.desktop?.page
      };
    }
  } catch (err) {
    console.error("Erro wikipedia server-side:", err);
  }

  return (
    <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      <div>
        <BackButton />
      </div>

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
                Ler mais na Wikipedia
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
