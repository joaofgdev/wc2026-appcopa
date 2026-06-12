import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      process.env[match[1].trim()] = val;
    }
  });
}

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

import { getWorldCupFixtures } from "../src/lib/api";

async function main() {
  console.log("Iniciando sincronização...");
  const fixtures = await getWorldCupFixtures();
  console.log("Total fixtures:", fixtures.length);
  
  console.log("Esperando 10s para os backfills terminarem...");
  await new Promise(r => setTimeout(r, 10000));
  console.log("Feito!");
}

main().catch(console.error);
