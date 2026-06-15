export type TeamItem = {
  id: string;
  iso2: string;
  name: string;
};

export type TierListState = {
  unranked: TeamItem[];
  tier1: TeamItem[];
  tier2: TeamItem[];
  tier3: TeamItem[];
  tier4: TeamItem[];
};
