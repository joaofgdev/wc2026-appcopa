import { TestMatchLineups } from "@/types/test-match";

export const dynamic = "force-dynamic";

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

async function getLineupsData(): Promise<TestMatchLineups> {
  const res = await fetch(`${getBaseUrl()}/api/test-match/lineups`, {
    next: { tags: ["test-match-lineups"] }
  });
  if (!res.ok) throw new Error("Failed to fetch lineups data");
  return res.json();
}

function PlayerList({ players }: { players: any[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {players.map(p => (
        <li key={p.id} className="flex items-center gap-3 p-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
          <span className="w-6 font-stats-num text-on-surface-variant text-right">{p.number}</span>
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-label-caps text-[10px] text-on-surface-variant">
            {p.position}
          </div>
          <span className="font-body-md font-bold text-on-surface">{p.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function TestMatchLineupsPage() {
  const lineups = await getLineupsData();

  return (
    <div className="flex flex-col glass-card p-6 rounded-3xl gap-6">
      <h3 className="font-headline-sm font-bold text-center mb-4">Escalações Iniciais</h3>
      
      <div className="flex gap-8 w-full">
        {/* Home */}
        <div className="flex flex-col flex-1 gap-4">
          <div className="text-center font-label-caps bg-surface-variant/30 py-2 rounded-lg border border-outline-variant/30">
            Técnico: {lineups.home.coach}
          </div>
          <PlayerList players={lineups.home.startingXI} />
        </div>

        {/* Away */}
        <div className="flex flex-col flex-1 gap-4">
          <div className="text-center font-label-caps bg-surface-variant/30 py-2 rounded-lg border border-outline-variant/30">
            Técnico: {lineups.away.coach}
          </div>
          <PlayerList players={lineups.away.startingXI} />
        </div>
      </div>
    </div>
  );
}
