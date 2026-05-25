import Link from "next/link";
import BackButton from "@/components/BackButton";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export const revalidate = 60; // Optional: revalidate caching

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

export default async function StadiumsPage() {
  const { data: stadiums, error } = await supabase
    .from('stadiums')
    .select('*')
    .order('name');

  if (error || !stadiums) {
    console.error("Erro ao carregar estádios:", error);
    return (
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 flex flex-col items-center">
        <BackButton />
        <p className="mt-10 text-on-background">Erro ao carregar estádios.</p>
      </main>
    );
  }

  // Cidades/Sedes principais pedidas: Azteca (México), BC Place / BMO Field (Canadá), Miami (EUA)
  const destaqueUrls = ["Estádio_Azteca", "BMO_Field", "Hard_Rock_Stadium"];
  
  const destaques = stadiums.filter(s => destaqueUrls.includes(s.wikipedia_url));
  const outros = stadiums.filter(s => !destaqueUrls.includes(s.wikipedia_url));

  // Buscar imagens apenas para os destaques (roda rápido e no servidor)
  const destaquesComImagem = await Promise.all(
    destaques.map(async (st) => {
      // Override: mostrar foto de Miami Beach para o Hard Rock Stadium conforme solicitado
      const wikiTitleToFetch = st.wikipedia_url === "Hard_Rock_Stadium" ? "Miami_Beach" : st.wikipedia_url;
      const image = await getWikiImage(wikiTitleToFetch);
      return { ...st, image };
    })
  );

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      <div>
        <BackButton />
      </div>

      <section className="flex flex-col gap-stack-md mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Estádios</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Conheça as 16 arenas que sediarão os jogos.</p>
        </div>
      </section>

      {/* Destaques Principais */}
      <section className="flex flex-col gap-4 mt-2">
        <h3 className="font-headline-sm text-on-background">Cidades-Sede Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destaquesComImagem.map((stadium) => (
            <Link 
              key={stadium.id}
              href={`/explore/stadiums/${stadium.wikipedia_url}`}
              className="flex flex-col rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:border-primary/50 transition-colors shadow-elevation-md hover:shadow-elevation-lg overflow-hidden group"
            >
              <div className="relative w-full h-48 bg-surface-variant/30">
                {stadium.image ? (
                  <Image 
                    src={stadium.image} 
                    alt={stadium.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl">stadium</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-on-background">{stadium.name}</h3>
                </div>
                <div className="flex flex-col gap-1 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {stadium.city}, {stadium.country}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">groups</span> {stadium.capacity.toLocaleString('pt-BR')} lugares</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Outros Estádios */}
      <section className="flex flex-col gap-4 mt-6">
        <h3 className="font-headline-sm text-on-background">Outras Arenas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {outros.map((stadium) => (
            <Link 
              key={stadium.id}
              href={`/explore/stadiums/${stadium.wikipedia_url}`}
              className="flex flex-col p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:border-primary/50 transition-colors shadow-elevation-sm hover:shadow-elevation-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">stadium</span>
                <h3 className="font-headline-sm text-on-background">{stadium.name}</h3>
              </div>
              <div className="flex flex-col gap-1 mt-2 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {stadium.city}, {stadium.country}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">groups</span> {stadium.capacity.toLocaleString('pt-BR')} lugares</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
