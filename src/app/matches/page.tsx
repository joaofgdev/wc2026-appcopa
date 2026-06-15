import { getWorldCupFixtures } from "@/lib/api";
import MatchesView from "@/components/MatchesView";

export const revalidate = 15;

export default async function MatchesPage() {
  const fixtures = await getWorldCupFixtures();
  
  // Sort fixtures by date in the backend
  const sorted = [...(fixtures || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return <MatchesView fixtures={sorted} />;
}
