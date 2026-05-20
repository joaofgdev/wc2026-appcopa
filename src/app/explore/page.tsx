import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function ExploreMenuPage() {
  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      <div>
        <BackButton />
      </div>

      <section className="flex flex-col gap-stack-md mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Explorar</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Conheça tudo sobre a Copa do Mundo 2026.</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link 
          href="/explore/teams" 
          className="group relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-elevation-md hover:shadow-elevation-lg transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-surface-container-highest z-10 opacity-80 group-hover:opacity-60 transition-opacity"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-on-primary">Seleções</h3>
              <span className="material-symbols-outlined text-on-primary text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </div>
            <p className="font-body-md text-on-primary/80 mt-2">Conheça as 48 seleções classificadas e sua história.</p>
          </div>
        </Link>

        <Link 
          href="/explore/stadiums" 
          className="group relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-elevation-md hover:shadow-elevation-lg transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 to-surface-container-highest z-10 opacity-80 group-hover:opacity-60 transition-opacity"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-on-secondary">Estádios e Sedes</h3>
              <span className="material-symbols-outlined text-on-secondary text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </div>
            <p className="font-body-md text-on-secondary/80 mt-2">Descubra os 16 estádios incríveis espalhados pelos 3 países sede.</p>
          </div>
        </Link>
      </section>
    </main>
  );
}
