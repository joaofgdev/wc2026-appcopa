import { TestMatchData } from "@/types/test-match";

export const dynamic = "force-dynamic";

// No App Router, requests no server para nossa própria rota precisam de URL absoluta
function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

async function getMatchData(): Promise<TestMatchData> {
  const res = await fetch(`${getBaseUrl()}/api/test-match`, {
    next: { tags: ["test-match"] }
  });
  if (!res.ok) throw new Error("Failed to fetch match data");
  return res.json();
}

export default async function TestMatchSummaryPage() {
  const data = await getMatchData();

  const isLive = data.status.short === "LIVE";
  const isFinished = ["FT", "AET", "PEN"].includes(data.status.short);

  return (
    <div className="flex flex-col gap-6">
      <section className="relative w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(3,86,255,0.15)] border border-outline-variant/30">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10"></div>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiF8rOh9JlLckK-U9W6dDk5zlrMf-wzGvTozPcM7ncC9lTSvh6I7QHOyRbOOqbxU1UTuv1zaBD5VrYSr3iszaCLqhCJjh4wJ2M5-aJtK0N2naY9xOxUvImk3ME-BEwkuw93hWQ7zObeuOSQf6pwS7na4A1wOQoWyPNtrUx0AEGY97SrYKfhSVxWEzJq5z3MZEbQ7uhrubPh5AMHfL2CO-XsE9mlsDEw_-NehTxo7nQqfMKX7SqH6bGbISYUY3B82Tcb0aj9bOKaDw" 
            alt="Stadium" 
            className="w-full h-full object-cover blur-[2px] opacity-60" 
          />
        </div>
        
        <div className="relative z-20 flex flex-col items-center justify-center py-10 px-4 w-full">
          {/* Status Chip */}
          <div className={`mb-6 px-4 py-1.5 rounded-full font-label-caps text-xs flex items-center gap-2 backdrop-blur-md ${
            isLive
              ? "bg-tertiary/20 border border-tertiary/50 text-tertiary shadow-[0_0_20px_rgba(0,230,57,0.6)]"
              : isFinished
              ? "bg-surface-variant/50 border border-outline-variant/30 text-on-surface-variant"
              : "bg-primary/20 border border-primary/50 text-primary"
          }`}>
            {isLive && <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>}
            {isLive
              ? `${data.status.elapsed || 0}' AO VIVO`
              : isFinished
              ? "ENCERRADO"
              : new Date(data.date).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </div>
          
          {/* Times & Placar */}
          <div className="flex items-center justify-center w-full max-w-3xl gap-4 md:gap-12">
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-surface-container overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(204,189,255,0.2)] mb-3">
                <img src={data.homeTeam.logo} alt={data.homeTeam.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-headline-sm md:font-headline-lg font-bold text-center leading-tight">
                {data.homeTeam.shortName}
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-[0.5]">
              <span className="font-headline-lg md:font-display-md text-on-surface">
                {isLive || isFinished ? (data.goalsHome ?? 0) : ""}
              </span>
              <span className="font-headline-md md:font-display-sm text-on-surface-variant">
                {isLive || isFinished ? "-" : "VS"}
              </span>
              <span className="font-headline-lg md:font-display-md text-on-surface">
                {isLive || isFinished ? (data.goalsAway ?? 0) : ""}
              </span>
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-surface-container overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(204,189,255,0.2)] mb-3">
                <img src={data.awayTeam.logo} alt={data.awayTeam.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-headline-sm md:font-headline-lg font-bold text-center leading-tight">
                {data.awayTeam.shortName}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
