export interface TacticalPlayer {
  id: string;
  teamType: "home" | "away";
  iso2: string;
  x: number;
  y: number;
  number: number;
}

export type FormationKey = "4-4-2" | "4-3-3" | "3-5-2" | "4-2-3-1" | "5-3-2";

export interface FormationPoint {
  x: number; // 0 to 100 (left to right)
  y: number; // 0 to 50 (top to middle - home team will mirror to 100 to 50)
}

export const FORMATIONS: Record<FormationKey, FormationPoint[]> = {
  "4-4-2": [
    { x: 50, y: 6 }, // GK
    { x: 15, y: 18 }, { x: 35, y: 16 }, { x: 65, y: 16 }, { x: 85, y: 18 }, // DEF
    { x: 15, y: 32 }, { x: 35, y: 30 }, { x: 65, y: 30 }, { x: 85, y: 32 }, // MID
    { x: 35, y: 44 }, { x: 65, y: 44 } // ATT
  ],
  "4-3-3": [
    { x: 50, y: 6 }, // GK
    { x: 15, y: 18 }, { x: 35, y: 16 }, { x: 65, y: 16 }, { x: 85, y: 18 }, // DEF
    { x: 25, y: 30 }, { x: 50, y: 28 }, { x: 75, y: 30 }, // MID
    { x: 20, y: 42 }, { x: 50, y: 45 }, { x: 80, y: 42 } // ATT
  ],
  "4-2-3-1": [
    { x: 50, y: 6 }, // GK
    { x: 15, y: 18 }, { x: 35, y: 16 }, { x: 65, y: 16 }, { x: 85, y: 18 }, // DEF
    { x: 35, y: 28 }, { x: 65, y: 28 }, // CDM
    { x: 20, y: 38 }, { x: 50, y: 36 }, { x: 80, y: 38 }, // CAM/WING
    { x: 50, y: 46 } // ST
  ],
  "3-5-2": [
    { x: 50, y: 6 }, // GK
    { x: 25, y: 16 }, { x: 50, y: 18 }, { x: 75, y: 16 }, // DEF
    { x: 10, y: 28 }, { x: 35, y: 28 }, { x: 50, y: 32 }, { x: 65, y: 28 }, { x: 90, y: 28 }, // MID
    { x: 35, y: 44 }, { x: 65, y: 44 } // ATT
  ],
  "5-3-2": [
    { x: 50, y: 6 }, // GK
    { x: 10, y: 22 }, { x: 30, y: 16 }, { x: 50, y: 16 }, { x: 70, y: 16 }, { x: 90, y: 22 }, // DEF
    { x: 30, y: 32 }, { x: 50, y: 30 }, { x: 70, y: 32 }, // MID
    { x: 35, y: 44 }, { x: 65, y: 44 } // ATT
  ]
};
