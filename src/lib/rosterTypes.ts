// RosterTypes.ts

export interface RosterSettings {
  wins: number;
  losses: number;
  ties: number;
  fpts: number;
}

export interface Roster {
  owner_id: string;
  starters: string[]; // Assuming starters are an array of player IDs represented as strings
  settings: RosterSettings;
}
