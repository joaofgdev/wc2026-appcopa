import { getFixtureDetails } from "@/lib/api";
import MatchView from "@/components/MatchView";

export const revalidate = 15;

export default async function MatchPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const unwrappedParams = await searchParams;
  const id = unwrappedParams.id;
  
  if (!id) {
    return <MatchView match={null} />;
  }

  let match = null;
  try {
    match = await getFixtureDetails(id);
  } catch (err) {
    console.error("Erro ao carregar detalhes:", err);
  }
  
  return <MatchView match={match} />;
}