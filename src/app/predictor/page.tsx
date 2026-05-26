import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton";
import PredictorView from "./PredictorView";

export const revalidate = 3600; // Cache 1 hora, mas o bolão em si é local

export default async function PredictorPage() {
  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .order("match_date");

  if (error || !matches) {
    return <div>Erro ao carregar jogos</div>;
  }

  // Pass matches to client component for processing
  const formattedMatches = matches.map(m => ({
    id: m.id,
    round: m.round,
    group_name: m.group_name,
    home_team_name: m.home_team_name,
    away_team_name: m.away_team_name,
  }));

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 flex flex-col gap-8 min-h-screen">
      <div className="flex justify-between items-center">
        <BackButton />
      </div>

      <div>
        <h2 className="font-headline-lg text-primary">Bolão da Copa</h2>
        <p className="font-body-md text-on-surface-variant">Preveja os resultados e simule os cruzamentos até a final!</p>
      </div>

      <PredictorView matches={formattedMatches} />
    </main>
  );
}
