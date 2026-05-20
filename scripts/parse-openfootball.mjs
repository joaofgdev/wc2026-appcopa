import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'worldcup', '2026--usa');
const OUT_FILE = path.join(process.cwd(), 'src', 'data', 'worldcup.json');

function parseOpenFootball() {
  const groups = {}; // { "Group A": ["Mexico", "South Africa", ...] }
  const matches = [];
  const stadiums = [];
  const hosts = [
    { name: "Estados Unidos", code: "EUA" },
    { name: "Canadá", code: "CAN" },
    { name: "México", code: "MEX" }
  ];
  let matchIdCounter = 1;

  // 1. Processar Fase de Grupos
  const cupTxtPath = path.join(DATA_DIR, 'cup.txt');
  if (fs.existsSync(cupTxtPath)) {
    const lines = fs.readFileSync(cupTxtPath, 'utf-8').split('\n').map(l => l.trim());
    let currentGroup = null;
    let currentDateStr = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line || line.startsWith('#')) continue;

      const groupMatch = line.match(/^Group\s+([A-Z])\s*\|\s*(.+)$/);
      if (groupMatch) {
        const groupName = `Group ${groupMatch[1]}`;
        const teams = groupMatch[2].split(/\s{2,}/).map(t => t.trim()).filter(Boolean);
        groups[groupName] = teams;
        continue;
      }

      if (line.startsWith('▪ Group')) {
        currentGroup = line.replace('▪ ', '').trim();
        currentDateStr = null;
        continue;
      }

      const dateMatch = line.match(/^[A-Z][a-z]{2}\s+([A-Z][a-z]+)\s+(\d+)$/);
      if (dateMatch) {
        currentDateStr = `${dateMatch[1]} ${dateMatch[2]}, 2026`;
        continue;
      }

      const matchLine = line.match(/^(\d{2}:\d{2})\s+UTC([+-]\d+)\s+(.+?)\s+v\s+(.+?)\s+@\s+(.+)$/);
      if (matchLine && currentDateStr && currentGroup) {
        const [, timeStr, utcOffset, homeRaw, awayRaw, venueRaw] = matchLine;
        const dateObj = new Date(`${currentDateStr} ${timeStr} UTC${utcOffset}`);
        matches.push({
          id: `m_${matchIdCounter++}`,
          group: currentGroup,
          round: "Group Stage",
          date: dateObj.toISOString(),
          homeTeam: homeRaw.trim(),
          awayTeam: awayRaw.trim(),
          venue: venueRaw.trim(),
          goalsHome: null,
          goalsAway: null,
          status: "NS"
        });
      }
    }
  }

  // 2. Processar Fases Finais
  const finalsTxtPath = path.join(DATA_DIR, 'cup_finals.txt');
  if (fs.existsSync(finalsTxtPath)) {
    const lines = fs.readFileSync(finalsTxtPath, 'utf-8').split('\n').map(l => l.trim());
    let currentRound = null;
    let currentDateStr = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line || line.startsWith('#')) continue;

      if (line.startsWith('▪ ')) {
        currentRound = line.replace('▪ ', '').trim();
        currentDateStr = null;
        continue;
      }

      const dateMatch = line.match(/^[A-Z][a-z]{2}\s+([A-Z][a-z]+)\s+(\d+)$/);
      if (dateMatch) {
        currentDateStr = `${dateMatch[1]} ${dateMatch[2]}, 2026`;
        continue;
      }

      // Match numbers optionally exist: e.g. "(73) 12:00 UTC-7" or "15:00 UTC-4"
      const matchLine = line.match(/^(?:\(\d+\)\s+)?(\d{2}:\d{2})\s+UTC([+-]\d+)\s+(.+?)\s+v\s+(.+?)\s+@\s+(.+)$/);
      if (matchLine && currentDateStr && currentRound) {
        const [, timeStr, utcOffset, homeRaw, awayRaw, venueRaw] = matchLine;
        const dateObj = new Date(`${currentDateStr} ${timeStr} UTC${utcOffset}`);
        matches.push({
          id: `m_${matchIdCounter++}`,
          group: "",
          round: currentRound,
          date: dateObj.toISOString(),
          homeTeam: homeRaw.trim(),
          awayTeam: awayRaw.trim(),
          venue: venueRaw.trim(),
          goalsHome: null,
          goalsAway: null,
          status: "NS"
        });
      }
    }
  }

  // 3. Processar Estádios
  const stadiumsCsvPath = path.join(DATA_DIR, 'cup_stadiums.csv');
  if (fs.existsSync(stadiumsCsvPath)) {
    const lines = fs.readFileSync(stadiumsCsvPath, 'utf-8').split('\n').map(l => l.trim());
    let isHeader = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line || line.startsWith('#')) continue;

      if (isHeader) {
        isHeader = false;
        continue; // Pula o cabeçalho
      }

      // Separa por vírgula considerando espaços
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 8) {
        const [city, timezone, cc, name, capacity, wikipedia, wikidata, coords] = parts;
        stadiums.push({
          id: `s_${stadiums.length + 1}`,
          name,
          city,
          country: cc.toUpperCase() === 'US' ? 'USA' : cc.toUpperCase() === 'CA' ? 'Canada' : 'Mexico',
          capacity: parseInt(capacity, 10),
          wikipedia,
          coords
        });
      }
    }
  }

  const db = {
    hosts,
    groups,
    stadiums,
    matches
  };

  if (!fs.existsSync(path.dirname(OUT_FILE))) {
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(db, null, 2));
  console.log(`Parsed ${Object.keys(groups).length} groups, ${matches.length} matches, and ${stadiums.length} stadiums.`);
  console.log(`Saved to ${OUT_FILE}`);
}

parseOpenFootball();
