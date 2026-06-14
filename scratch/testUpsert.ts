import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eigpmbhltkyheybgqits.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZ3BtYmhsdGt5aGV5YmdxaXRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTcxNDc5NiwiZXhwIjoyMDk1MjkwNzk2fQ.8THXSv3G5x1Y79HYmZBPV8lKZpLQCbAML8rQrQidMQA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { error } = await supabase.from('match_details').update({ broadcasters: [] }).eq('match_id', 'm_25');
  if (error) {
    console.error("Error updating broadcasters:", error.message);
  } else {
    console.log("Success! Column exists.");
  }
}

test();
