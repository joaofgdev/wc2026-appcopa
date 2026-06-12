import { fetchFromSportDB } from "../src/services/sportdb.service";

async function main() {
  // Try fetching results to find a match with stats
  const results = await fetch("https://api.sportdb.dev/api/flashscore/football/world:8/world-cup:lvUBR5F8/2026/results?page=1", {
    headers: { "X-API-Key": process.env.SPORTDB_API_KEY || "test" } // Will use local if running with env
  }).then(r => r.json());

  console.log("Total results:", results.length);
  if (results.length > 0) {
    const matchId = results[0].eventId;
    console.log("Fetching stats for match:", matchId);
    const stats = await fetch(`https://api.sportdb.dev/api/flashscore/match/${matchId}/stats`, {
      headers: { "X-API-Key": process.env.SPORTDB_API_KEY || "test" }
    }).then(r => r.json());
    console.log(JSON.stringify(stats, null, 2));
  }
}

main().catch(console.error);
