import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

import { supabase } from "../src/lib/supabase";

async function main() {
  const { data: matches } = await supabase.from('matches').select('*').order('match_date');
  if (!matches) {
    console.log("No matches found");
    return;
  }
  
  const pastMatches = matches.filter(m => new Date(m.match_date).getTime() < Date.now());
  for (const m of pastMatches) {
    console.log(`${m.match_date}: ${m.home_team_name} vs ${m.away_team_name} | status: ${m.status_short} | details_saved: ${m.details_saved}`);
  }
}

main().catch(console.error);
