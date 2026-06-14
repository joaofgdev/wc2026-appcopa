import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eigpmbhltkyheybgqits.supabase.co';
const supabaseKey = 'sb_publishable_80Myhql-J40XRkqtnEKJgA_cHnMnhSA'; // Using anon/publishable key is fine for reads usually, but let's use the role key just in case we need to write or read protected stuff
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZ3BtYmhsdGt5aGV5YmdxaXRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTcxNDc5NiwiZXhwIjoyMDk1MjkwNzk2fQ.8THXSv3G5x1Y79HYmZBPV8lKZpLQCbAML8rQrQidMQA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkMatches() {
  const { data, error } = await supabase.from('matches').select('*').or('home_team_name.ilike.%Germany%,home_team_name.ilike.%Alemanha%');
  if (error) console.error(error);
  console.log('Matches with Germany:', JSON.stringify(data, null, 2));

  const { data: cData, error: cErr } = await supabase.from('matches').select('*').or('home_team_name.ilike.%Curaçao%,away_team_name.ilike.%Curaçao%');
  if (cErr) console.error(cErr);
  console.log('Matches with Curacao:', JSON.stringify(cData, null, 2));
}

checkMatches();
