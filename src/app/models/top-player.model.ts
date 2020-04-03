import { Player } from "./player.model";

export interface TopPlayer {
  player?: Player;
  bestScore?: number;
  bestBowling?: number;
  totalMatches?: number;
  totalRuns?: number;
  totalBalls?: number;
  totalFours?: number;
  totalSixes?: number;
  totalOvers?: number;
  totalMaidens?: number;
  totalRunsGiven?: number;
  totalWickets?: number;
  fifties?: number;
  centuries?: number;
  isOut?: number;
}
