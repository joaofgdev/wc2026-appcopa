import Link from "next/link";
import BackButton from "@/components/BackButton";
import worldcupData from "@/data/worldcup.json";

export default function StadiumsPage() {
  const stadiums = worldcupData.stadiums;

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

      <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {stadiums.map((stadium) => (
          <Link 
            key={stadium.id}
            href={`/explore/stadiums/${stadium.wikipedia}`}
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
      </section>
    </main>
  );
}
