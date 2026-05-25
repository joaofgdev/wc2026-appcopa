import { TestMatchData, TestMatchStats, TestMatchLineups, TestMatchStatus } from "@/types/test-match";

// Nós simulamos um jogo que começou "agora", ou seja, sempre estará no modo LIVE.
// Para testar a troca de estado, poderíamos fixar a data, mas a forma mais fácil
// de testar "Tempo Real" é fazer a simulação baseada no momento do request.

const START_TIMESTAMP = new Date("2026-05-23T19:00:00-03:00").getTime(); // 19h00 BRT

export function getTestMatchBase(): TestMatchData {
  const now = Date.now();
  const elapsedMinutes = Math.floor((now - START_TIMESTAMP) / 60000);
  
  // Lógica de Placar baseada na realidade (Grêmio 3 x 2 Santos)
  const goalsHome = elapsedMinutes > 0 ? 3 : null; 
  const goalsAway = elapsedMinutes > 0 ? 2 : null;
  
  // Status Dinâmico
  let status: TestMatchStatus = { long: "Ao Vivo", short: "LIVE", elapsed: elapsedMinutes };
  
  if (elapsedMinutes > 120) {
    status = { long: "Encerrado", short: "FT", elapsed: 90 };
  } else if (elapsedMinutes < 0) {
    status = { long: "Não Iniciado", short: "NS", elapsed: null };
  }

  return {
    id: "554904",
    competition: "Campeonato Brasileiro Série A",
    round: "Rodada 17",
    date: new Date(START_TIMESTAMP).toISOString(),
    timestamp: Math.floor(START_TIMESTAMP / 1000),
    venue: "Arena do Grêmio, Porto Alegre",
    status,
    homeTeam: {
      id: "1767",
      name: "Grêmio FBPA",
      shortName: "GRE",
      logo: "https://crests.football-data.org/1767.png",
    },
    awayTeam: {
      id: "6685",
      name: "Santos FC",
      shortName: "SAN",
      logo: "https://crests.football-data.org/6685.png",
    },
    goalsHome,
    goalsAway,
  };
}

export function getTestMatchStats(): TestMatchStats {
  const base = getTestMatchBase();
  // Se não começou, stats zerados
  if (base.status.short === "NS") {
    return {
      home: { possession: 50, shotsOnTarget: 0, shotsOffTarget: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 },
      away: { possession: 50, shotsOnTarget: 0, shotsOffTarget: 0, corners: 0, fouls: 0, yellowCards: 0, redCards: 0 },
    };
  }

  // Estatísticas flutuam levemente baseadas nos minutos passados para parecer real
  const m = base.status.elapsed || 0;
  
  // Posse de bola variando suavemente
  const homePoss = 50 + Math.floor(Math.sin(m / 5) * 12); // Varia entre 38 e 62
  const awayPoss = 100 - homePoss;

  return {
    home: { 
      possession: homePoss, 
      shotsOnTarget: Math.floor(m / 10), 
      shotsOffTarget: Math.floor(m / 15), 
      corners: Math.floor(m / 12), 
      fouls: Math.floor(m / 8), 
      yellowCards: m > 20 ? 1 : 0, 
      redCards: 0 
    },
    away: { 
      possession: awayPoss, 
      shotsOnTarget: Math.floor(m / 12), 
      shotsOffTarget: Math.floor(m / 10), 
      corners: Math.floor(m / 15), 
      fouls: Math.floor(m / 7), 
      yellowCards: m > 35 ? 2 : 0, 
      redCards: 0 
    },
  };
}

export function getTestMatchLineups(): TestMatchLineups {
  return {
    home: {
      coach: "Renato Gaúcho",
      startingXI: [
        { id: "h1", name: "Marchesín", number: 1, position: "G" },
        { id: "h2", name: "João Pedro", number: 18, position: "D" },
        { id: "h3", name: "Geromel", number: 3, position: "D" },
        { id: "h4", name: "Kannemann", number: 4, position: "D" },
        { id: "h5", name: "Reinaldo", number: 6, position: "D" },
        { id: "h6", name: "Villasanti", number: 20, position: "M" },
        { id: "h7", name: "Pepê", number: 23, position: "M" },
        { id: "h8", name: "Cristaldo", number: 10, position: "M" },
        { id: "h9", name: "Pavón", number: 21, position: "A" },
        { id: "h10", name: "Soteldo", number: 7, position: "A" },
        { id: "h11", name: "Diego Costa", number: 19, position: "A" },
      ],
      substitutes: [
        { id: "hs1", name: "Rafael Cabral", number: 33, position: "G" },
        { id: "hs2", name: "Ely", number: 5, position: "D" },
      ]
    },
    away: {
      coach: "Fábio Carille",
      startingXI: [
        { id: "a1", name: "João Paulo", number: 1, position: "G" },
        { id: "a2", name: "Aderlan", number: 4, position: "D" },
        { id: "a3", name: "Gil", number: 2, position: "D" },
        { id: "a4", name: "Joaquim", number: 3, position: "D" },
        { id: "a5", name: "Felipe Jonatan", number: 6, position: "D" },
        { id: "a6", name: "João Schmidt", number: 5, position: "M" },
        { id: "a7", name: "Diego Pituca", number: 8, position: "M" },
        { id: "a8", name: "Giuliano", number: 10, position: "M" },
        { id: "a9", name: "Otero", number: 11, position: "A" },
        { id: "a10", name: "Guilherme", number: 17, position: "A" },
        { id: "a11", name: "Julio Furch", number: 9, position: "A" },
      ],
      substitutes: [
        { id: "as1", name: "Diógenes", number: 12, position: "G" },
        { id: "as2", name: "Messias", number: 14, position: "D" },
      ]
    }
  };
}
