import { TestMatchStats } from "@/types/test-match";

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

async function getStatsData(): Promise<TestMatchStats> {
  const res = await fetch(`${getBaseUrl()}/api/test-match/stats`, {
    next: { tags: ["test-match-stats"] }
  });
  if (!res.ok) throw new Error("Failed to fetch stats data");
  return res.json();
}

// Auxiliar para a barra de estatística
function StatBar({ label, home, away, isPercentage = false }: { label: string, home: number, away: number, isPercentage?: boolean }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  const awayPct = (away / total) * 100;
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between text-sm font-label-caps">
        <span className="font-bold">{home}{isPercentage ? '%' : ''}</span>
        <span className="text-on-surface-variant">{label}</span>
        <span className="font-bold">{away}{isPercentage ? '%' : ''}</span>
      </div>
      <div className="flex w-full h-2 rounded-full overflow-hidden bg-surface-variant/30 gap-1">
        <div className="h-full bg-primary" style={{ width: `${homePct}%` }}></div>
        <div className="h-full bg-secondary" style={{ width: `${awayPct}%` }}></div>
      </div>
    </div>
  );
}

export default async function TestMatchStatsPage() {
  const stats = await getStatsData();

  return (
    <div className="flex flex-col glass-card p-6 rounded-3xl gap-6">
      <h3 className="font-headline-sm font-bold text-center mb-4">Estatísticas da Partida</h3>
      
      <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
        <StatBar label="POSSE DE BOLA" home={stats.home.possession} away={stats.away.possession} isPercentage={true} />
        <StatBar label="CHUTES NO ALVO" home={stats.home.shotsOnTarget} away={stats.away.shotsOnTarget} />
        <StatBar label="CHUTES PARA FORA" home={stats.home.shotsOffTarget} away={stats.away.shotsOffTarget} />
        <StatBar label="ESCANTEIOS" home={stats.home.corners} away={stats.away.corners} />
        <StatBar label="FALTAS" home={stats.home.fouls} away={stats.away.fouls} />
        <StatBar label="CARTÕES AMARELOS" home={stats.home.yellowCards} away={stats.away.yellowCards} />
        <StatBar label="CARTÕES VERMELHOS" home={stats.home.redCards} away={stats.away.redCards} />
      </div>
    </div>
  );
}
