export interface Match {
  homeTeamScore: number;
  homeTeamWickets: number;
  homeTeamWon: boolean;
  matchDate: string;
  matchVenue: string;
  opTeam: string;
  opTeamScore: number;
  opTeamWickets: number;
  playerOfTheMatch?: string;
  result: string;
  tourId: string;
}
