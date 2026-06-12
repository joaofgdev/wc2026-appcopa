async function main() {
  const results = await fetch("https://api.sportdb.dev/api/flashscore/football/world:8/world-cup:lvUBR5F8/2026/results?page=1", {
    headers: { "X-API-Key": "test" }
  }).then(r => r.json());

  if (Array.isArray(results) && results.length > 0) {
    const matchId = results[0].eventId;
    console.log("Fetching lineups for match:", matchId);
    const lineups = await fetch(`https://api.sportdb.dev/api/flashscore/match/${matchId}/lineups`, {
      headers: { "X-API-Key": "test" }
    }).then(r => r.json());
    console.log(JSON.stringify(lineups, null, 2));
  }
}

main().catch(console.error);
