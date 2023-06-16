export interface MatchFixture {
  id?: string;
  tourId: string;
  matchDate: any;
  opTeam: string;
  matchVenue: string;
  matchVenueLink?: string;
  opponentTeamVenue?: string;
  playersAvailable?: Array<string>;
  playersUnavailable?: Array<string>;
  droppedPlayers?: Array<string>;
  selectedPlayers?: Array<string>;
  matchTime?: string;
  disableAvilabilityCheck?: boolean;
  isPlayingXiReleased?: boolean;
  isDayNightMatch?: boolean;
  players?: Array<PlayerList>;
}

interface PlayerList {
  name: string;
  isAvailable: boolean;
}
