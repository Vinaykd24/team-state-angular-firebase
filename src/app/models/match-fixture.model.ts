export interface MatchFixture {
  id?: string;
  tourId: string;
  matchDate: string;
  opTeam: string;
  matchVenue: string;
  matchTime?: string;
  players?: Array<PlayerList>;
}

interface PlayerList {
  name: string;
  isAvailable: boolean;
}
