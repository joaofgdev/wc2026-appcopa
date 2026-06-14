import { fetchFromSportDB } from '../src/services/sportdb.service';
import { FlashscoreEvent } from '../src/types/football';
import { createClient } from '@supabase/supabase-js';
import { normalizeTeamName } from '../src/lib/api';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eigpmbhltkyheybgqits.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZ3BtYmhsdGt5aGV5YmdxaXRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTcxNDc5NiwiZXhwIjoyMDk1MjkwNzk2fQ.8THXSv3G5x1Y79HYmZBPV8lKZpLQCbAML8rQrQidMQA';

const supabase = createClient(supabaseUrl, supabaseKey);

function parseBroadcasters(rawTvData?: string): { name: string, url: string, logo: string }[] {
  if (!rawTvData) return [];
  try {
    const data = JSON.parse(rawTvData);
    const arrays = Object.values(data);
    const allChannels: any[] = arrays.flat();
    const braChannels = allChannels.filter(c => c.BN && c.BN.endsWith('(Bra)'));
    const logos: Record<string, string> = {
      'tv globo': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/TV_Globo_logo_%28April_2025%29.png',
      'sportv': 'https://upload.wikimedia.org/wikipedia/commons/2/26/SporTV_2021.png',
      'caze tv': 'https://logodownload.org/wp-content/uploads/2024/03/cazetv-logo.png',
      'globoplay': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/TV_Globo_logo_%28April_2025%29.png',
      'sbt': '/broadcasters/sbt.svg',
      'ge': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJXlTtp7GWq3nq6XzYSotZ2_w6MdRcRycJ9w&s',
      'nsports': 'https://yt3.googleusercontent.com/l6-Nls7xLqgra_jRIZS2lvFcR4mY0fH7hSZjb0EvpCpfLFCRzQV1X2pkl1JR9TgB82PIK2A9wg=s900-c-k-c0x00ffffff-no-rj',
      'claro tv+': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Claro_tv%2B.png/512px-Claro_tv%2B.png',
      'zapping': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Zapping_TV_logo.png/512px-Zapping_TV_logo.png'
    };

    return braChannels.map(c => {
      const name = c.BN.replace('(Bra)', '').trim();
      const lowerName = name.toLowerCase();
      return {
        name,
        url: c.BU || '#',
        logo: logos[lowerName] || 'https://upload.wikimedia.org/wikipedia/commons/2/26/SporTV_2021.png'
      };
    });
  } catch (err) {
    return [];
  }
}

async function sync() {
  const [fixturesData, resultsData] = await Promise.all([
    fetchFromSportDB<FlashscoreEvent[]>(`/fixtures?page=1`).catch(() => []),
    fetchFromSportDB<FlashscoreEvent[]>(`/results?page=1`).catch(() => [])
  ]);
  const allEvents = [...(fixturesData || []), ...(resultsData || [])];
  
  const { data: dbMatches } = await supabase.from('matches').select('id, home_team_name, away_team_name');
  const { data: dbDetails } = await supabase.from('match_details').select('match_id, statistics');

  let count = 0;
  for (const match of allEvents) {
    if (!match.hasTvOrLivestreaming) continue;
    
    const b = parseBroadcasters(match.hasTvOrLivestreaming);
    if (b.length === 0) continue;

    const dbMatch = dbMatches?.find(m => 
      normalizeTeamName(m.home_team_name) === normalizeTeamName(match.homeName) &&
      normalizeTeamName(m.away_team_name) === normalizeTeamName(match.awayName)
    );
    if (!dbMatch) continue;

    const matchId = dbMatch.id.toString().startsWith('m_') ? dbMatch.id : `m_${dbMatch.id}`;
    let detail = dbDetails?.find(d => d.match_id === matchId);
    
    let stats = detail?.statistics || [];
    if (typeof stats === 'string') stats = JSON.parse(stats);
    
    const bPeriodIndex = stats.findIndex((p: any) => p.period === "Broadcasters");
    if (bPeriodIndex >= 0) {
      stats.splice(bPeriodIndex, 1);
    }
    
    stats.push({
      period: "Broadcasters",
      stats: b.map(bb => ({
        statId: "tv",
        statName: bb.name,
        homeValue: bb.url,
        awayValue: bb.logo
      }))
    });
    
    await supabase.from('match_details').upsert({ match_id: matchId, statistics: stats });
    console.log(`Synced broadcasters for ${dbMatch.home_team_name} vs ${dbMatch.away_team_name} (${matchId})`);
    count++;
  }
  
  // ALso fix m_25
  const matchId = 'm_25';
  let detail = dbDetails?.find(d => d.match_id === matchId);
  let stats = detail?.statistics || [];
  if (typeof stats === 'string') stats = JSON.parse(stats);
  const bPeriodIndex = stats.findIndex((p: any) => p.period === "Broadcasters");
  if (bPeriodIndex >= 0) {
    stats.splice(bPeriodIndex, 1);
  }
  await supabase.from('match_details').upsert({ match_id: matchId, statistics: stats });
  
  console.log(`Synced ${count} matches + removed fixed m_25`);
}

sync();
