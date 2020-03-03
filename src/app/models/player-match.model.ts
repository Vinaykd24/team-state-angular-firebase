export interface PlayerMatch {
  id?: string;
  matchId?: string;
  playerId?: string;
  playerFirstName?: string;
  playerLastName?: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  overs: number;
  maidens: number;
  runsGiven: number;
  wicktes: number;
  isOut: boolean;
}
