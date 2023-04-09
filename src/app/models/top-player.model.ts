import { Player } from "./player.model";

export interface TopPlayer {
  player?: Player;
  bestScore?: any;
  bestBowling?: any;
  totalMatches?: number;
  totalBatInns?: number;
  totalInns?: number;
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
  bowlingAvg?: number;
  battingAvg?: number;
}
