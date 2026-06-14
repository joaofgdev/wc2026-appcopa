import { getWorldCupFixtures } from "../src/lib/api";

async function run() {
  console.log("Fetching fixtures to trigger sync...");
  await getWorldCupFixtures();
  console.log("Done syncing fixtures.");
}

run().catch(console.error);
