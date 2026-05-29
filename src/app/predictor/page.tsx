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
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-6 pb-28 flex flex-col gap-8 min-h-screen">
      <div className="pt-2">
        <BackButton />
      </div>

      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(101,177,163,0.15)",
            border: "1px solid rgba(101,177,163,0.3)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "30px",
              color: "#65B1A3",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            sports_esports
          </span>
        </div>
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: "var(--font-sora), sans-serif",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Bolão da Copa
          </h1>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "#A8C5C2",
              fontFamily: "var(--font-sora), sans-serif",
              marginTop: "3px",
            }}
          >
            Preveja os resultados e simule os cruzamentos até a final!
          </p>
        </div>
      </div>

      <PredictorView matches={formattedMatches} />
    </main>
  );
}
