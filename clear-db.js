const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = Object.fromEntries(envLocal.split('\n').filter(line => line.includes('=')).map(line => line.split('=')));

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'].trim();


const supabase = createClient(supabaseUrl, supabaseKey);

async function clearPredictions() {
  const { error } = await supabase
    .from('bracket_predictions')
    .delete()
    .neq('user_id', '000'); // Delete everything
    
  if (error) {
    console.error('Error clearing database:', error);
  } else {
    console.log('Successfully cleared bracket_predictions table');
  }
}

clearPredictions();
