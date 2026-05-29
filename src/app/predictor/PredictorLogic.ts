import { PredictorPicks } from "./PredictorContext";

export interface KnockoutMatch {
  id: string; // e.g. R32_1, R16_1, QF_1, SF_1, FINAL
  round: "RoundOf32" | "RoundOf16" | "QuarterFinals" | "SemiFinals" | "Final";
  team1: string | null;
  team2: string | null;
  winner: string | null;
}

export interface Bracket {
  [matchId: string]: KnockoutMatch;
}

// Estrutura Baseada numa chave de 32 times (12 grupos)
// Como o chaveamento exato de 3ºs colocados é uma tabela de 495 combinações,
// usaremos uma distribuição fixa balanceada para os 8 melhores terceiros (índices de 0 a 7).
const ROUND_OF_32_TEMPLATE = [
  { id: 'R32_1', t1: { g: 'A', p: 1 }, t2: { t: 0 } },
  { id: 'R32_2', t1: { g: 'B', p: 2 }, t2: { g: 'C', p: 2 } },
  { id: 'R32_3', t1: { g: 'D', p: 1 }, t2: { t: 1 } },
  { id: 'R32_4', t1: { g: 'E', p: 2 }, t2: { g: 'F', p: 2 } },
  { id: 'R32_5', t1: { g: 'G', p: 1 }, t2: { t: 2 } },
  { id: 'R32_6', t1: { g: 'H', p: 2 }, t2: { g: 'I', p: 2 } },
  { id: 'R32_7', t1: { g: 'J', p: 1 }, t2: { t: 3 } },
  { id: 'R32_8', t1: { g: 'K', p: 2 }, t2: { g: 'L', p: 2 } },

  { id: 'R32_9', t1: { g: 'B', p: 1 }, t2: { t: 4 } },
  { id: 'R32_10', t1: { g: 'A', p: 2 }, t2: { g: 'C', p: 1 } },
  { id: 'R32_11', t1: { g: 'E', p: 1 }, t2: { t: 5 } },
  { id: 'R32_12', t1: { g: 'D', p: 2 }, t2: { g: 'F', p: 1 } },
  { id: 'R32_13', t1: { g: 'H', p: 1 }, t2: { t: 6 } },
  { id: 'R32_14', t1: { g: 'G', p: 2 }, t2: { g: 'I', p: 1 } },
  { id: 'R32_15', t1: { g: 'K', p: 1 }, t2: { t: 7 } },
  { id: 'R32_16', t1: { g: 'J', p: 2 }, t2: { g: 'L', p: 1 } },
];

const ROUND_OF_16_TEMPLATE = [
  { id: 'R16_1', w1: 'R32_1', w2: 'R32_2' },
  { id: 'R16_2', w1: 'R32_3', w2: 'R32_4' },
  { id: 'R16_3', w1: 'R32_5', w2: 'R32_6' },
  { id: 'R16_4', w1: 'R32_7', w2: 'R32_8' },
  { id: 'R16_5', w1: 'R32_9', w2: 'R32_10' },
  { id: 'R16_6', w1: 'R32_11', w2: 'R32_12' },
  { id: 'R16_7', w1: 'R32_13', w2: 'R32_14' },
  { id: 'R16_8', w1: 'R32_15', w2: 'R32_16' },
];

const QUARTER_FINALS_TEMPLATE = [
  { id: 'QF_1', w1: 'R16_1', w2: 'R16_2' },
  { id: 'QF_2', w1: 'R16_3', w2: 'R16_4' },
  { id: 'QF_3', w1: 'R16_5', w2: 'R16_6' },
  { id: 'QF_4', w1: 'R16_7', w2: 'R16_8' },
];

const SEMI_FINALS_TEMPLATE = [
  { id: 'SF_1', w1: 'QF_1', w2: 'QF_2' },
  { id: 'SF_2', w1: 'QF_3', w2: 'QF_4' },
];

const FINAL_TEMPLATE = [
  { id: 'FINAL', w1: 'SF_1', w2: 'SF_2' },
];

export function buildKnockoutBracket(picks: PredictorPicks): Bracket {
  const bracket: Bracket = {};

  // Build Round of 32
  ROUND_OF_32_TEMPLATE.forEach(m => {
    let team1 = null;
    if ('g' in m.t1) {
      const groupKey = `Group ${m.t1.g}`;
      team1 = picks.groups[groupKey]?.[m.t1.p as 1|2] || null;
    } else {
      team1 = picks.bestThirds[(m.t1 as any).t] || null;
    }

    let team2 = null;
    if ('g' in m.t2) {
      const groupKey = `Group ${m.t2.g}`;
      team2 = picks.groups[groupKey]?.[m.t2.p as 1|2] || null;
    } else {
      team2 = picks.bestThirds[(m.t2 as any).t] || null;
    }

    bracket[m.id] = {
      id: m.id,
      round: "RoundOf32",
      team1,
      team2,
      winner: picks.knockout[m.id] || null
    };

    // Validação de sanidade: se o vencedor não for nenhum dos dois times atuais (caso o usuário troque na fase de grupos), remove o vencedor
    if (bracket[m.id].winner && bracket[m.id].winner !== team1 && bracket[m.id].winner !== team2) {
      bracket[m.id].winner = null;
    }
  });

  // Build other rounds iteratively
  const rounds = [
    { template: ROUND_OF_16_TEMPLATE, name: "RoundOf16" },
    { template: QUARTER_FINALS_TEMPLATE, name: "QuarterFinals" },
    { template: SEMI_FINALS_TEMPLATE, name: "SemiFinals" },
    { template: FINAL_TEMPLATE, name: "Final" }
  ];

  rounds.forEach(r => {
    r.template.forEach(m => {
      const team1 = bracket[m.w1].winner;
      const team2 = bracket[m.w2].winner;
      bracket[m.id] = {
        id: m.id,
        round: r.name as any,
        team1,
        team2,
        winner: picks.knockout[m.id] || null
      };
      
      // Safety check
      if (bracket[m.id].winner && bracket[m.id].winner !== team1 && bracket[m.id].winner !== team2) {
         bracket[m.id].winner = null;
      }
    });
  });

  return bracket;
}
