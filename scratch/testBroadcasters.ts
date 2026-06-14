import { fetchFromSportDB } from '../src/services/sportdb.service';
import { FlashscoreEvent } from '../src/types/football';

async function test() {
  const [fixturesData, resultsData] = await Promise.all([
    fetchFromSportDB<FlashscoreEvent[]>(`/fixtures?page=1`).catch(() => []),
    fetchFromSportDB<FlashscoreEvent[]>(`/results?page=1`).catch(() => [])
  ]);
  const allEvents = [...(fixturesData || []), ...(resultsData || [])];
  
  console.log(`Loaded ${allEvents.length} events`);
  
  let matchesWithTv = 0;
  for (const match of allEvents) {
    if (match.hasTvOrLivestreaming) {
      matchesWithTv++;
      console.log(`Match: ${match.homeName} vs ${match.awayName}`);
      console.log(`TV: ${match.hasTvOrLivestreaming}`);
    }
  }
  
  console.log(`Found ${matchesWithTv} matches with TV data.`);
}

test();
