import { COUNTRY_TRANSLATIONS } from "./api";
import { StickerDefinition } from "@/types/album";

export const ALL_STICKERS: StickerDefinition[] = [];

// Filtrar times únicos (mesma lógica usada na prancheta)
const uniqueTeams = Array.from(new Map(
  Object.values(COUNTRY_TRANSLATIONS)
    .filter(t => t.iso2 && !t.iso2.includes("gb-"))
    .map(t => [t.code, t])
).values()).sort((a, b) => a.name.localeCompare(b.name));

// Gerar as figurinhas do álbum
uniqueTeams.forEach(team => {
  // 1 Bandeira Lendária por país
  ALL_STICKERS.push({
    id: `${team.code.toLowerCase()}-flag`,
    type: "flag",
    rarity: "legendary",
    teamCode: team.code,
    iso2: team.iso2,
  });

  // 11 Jogadores (O jogador 10 é 'rare', o resto é 'common')
  for (let i = 1; i <= 11; i++) {
    ALL_STICKERS.push({
      id: `${team.code.toLowerCase()}-p${i}`,
      type: "player",
      rarity: i === 10 ? "rare" : "common",
      teamCode: team.code,
      iso2: team.iso2,
      playerNumber: i,
      playerName: `Jogador ${i}`,
    });
  }
});

// Adicionar alguns estádios principais como cartas 'epic'
const stadiumsList = [
  { id: "stad-azteca", name: "Estádio Azteca" },
  { id: "stad-metlife", name: "MetLife Stadium" },
  { id: "stad-hardrock", name: "Hard Rock Stadium" },
  { id: "stad-bmo", name: "BMO Field" },
];

stadiumsList.forEach(stad => {
  ALL_STICKERS.push({
    id: stad.id,
    type: "stadium",
    rarity: "epic",
    playerName: stad.name,
  });
});
