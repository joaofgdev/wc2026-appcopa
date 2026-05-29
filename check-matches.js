const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = Object.fromEntries(envLocal.split('\n').filter(line => line.includes('=')).map(line => line.split('=')));

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMatches() {
  const { data, error } = await supabase
    .from('matches')
    .select('group_name')
    .limit(5);
    
  console.log(data);
}

checkMatches();
