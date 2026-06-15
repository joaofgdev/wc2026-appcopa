export type StickerRarity = "common" | "rare" | "epic" | "legendary";
export type StickerType = "player" | "flag" | "stadium";

export interface StickerDefinition {
  id: string; // Ex: "bra-1", "bra-flag", "stad-maracana"
  type: StickerType;
  rarity: StickerRarity;
  teamCode?: string; // Ex: "BRA" (apenas para player e flag)
  iso2?: string; // Ex: "br" (apenas para bandeiras do flagcdn)
  playerName?: string; // Ex: "Neymar Jr"
  playerNumber?: number; // Ex: 10
  imageUrl?: string; // Para estádios ou fotos customizadas
}

export interface PackOpeningResult {
  stickers: string[]; // IDs das figurinhas sorteadas
}

export interface AlbumInventory {
  [stickerId: string]: number; // Quantidade de cada figurinha que o usuário tem
}
