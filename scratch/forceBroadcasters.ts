import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eigpmbhltkyheybgqits.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZ3BtYmhsdGt5aGV5YmdxaXRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTcxNDc5NiwiZXhwIjoyMDk1MjkwNzk2fQ.8THXSv3G5x1Y79HYmZBPV8lKZpLQCbAML8rQrQidMQA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestBroadcasters() {
  const { data: match } = await supabase.from('match_details').select('*').eq('match_id', 'm_25').single();
  if (match) {
    let stats = match.statistics || [];
    if (typeof stats === 'string') stats = JSON.parse(stats);
    
    const bPeriodIndex = stats.findIndex((p: any) => p.period === "Broadcasters");
    if (bPeriodIndex >= 0) {
      stats.splice(bPeriodIndex, 1);
    }
    
    stats.push({
      period: "Broadcasters",
      stats: [
        {
          statId: "tv",
          statName: "TV Globo",
          homeValue: "https://globoplay.globo.com",
          awayValue: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Rede_Globo_logo.svg/512px-Rede_Globo_logo.svg.png"
        },
        {
          statId: "tv",
          statName: "Caze TV",
          homeValue: "https://youtube.com/@CazeTV",
          awayValue: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Caz%C3%A9TV_logo.png/512px-Caz%C3%A9TV_logo.png"
        }
      ]
    });
    
    await supabase.from('match_details').update({ statistics: stats }).eq('match_id', 'm_25');
    console.log("Added test broadcasters to m_25");
  }
}

addTestBroadcasters();
