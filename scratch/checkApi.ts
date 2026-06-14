async function checkApiMatches() {
  try {
    const results = await fetch("https://api.sportdb.dev/api/flashscore/football/world:8/world-cup:lvUBR5F8/2026/results?page=1", {
      headers: { "X-API-Key": process.env.SPORTDB_API_KEY || "0AK8ooiAKwmjTApqPiq09xJYdO1C9zcFupNKH7so" }
    }).then(r => r.json());
    
    const live = await fetch("https://api.sportdb.dev/api/flashscore/football/world:8/world-cup:lvUBR5F8/2026/fixtures?page=1", {
      headers: { "X-API-Key": process.env.SPORTDB_API_KEY || "0AK8ooiAKwmjTApqPiq09xJYdO1C9zcFupNKH7so" }
    }).then(r => r.json());

    const all = [...(results || []), ...(live || [])];
    
    console.log("Total events:", all.length);
    const germanyMatches = all.filter(e => e.homeName?.includes("Germany") || e.awayName?.includes("Germany") || e.homeName?.includes("Alemanha") || e.homeName?.includes("Curacao") || e.homeName?.includes("Cura"));
    
    console.log("Germany / Curacao matches found in API:", JSON.stringify(germanyMatches, null, 2));
  } catch (err) {
    console.error(err);
  }
}

checkApiMatches();
