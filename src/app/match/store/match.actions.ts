import { Action } from "@ngrx/store";
import { Match } from "src/app/models/match.model";

export const GET_AVAILABLE_MATCHES = "[Matches] Get Available Matches";
export const GET_SELECTED_SEASON_MATCHES =
  "[Matches] Get Selected Season Matches";
export const SELECTED_MATCH = "[Matches] Selected Match";
export const SET_SEASON = "[Matches] Set Season";

export class GetAvailableMatches implements Action {
  readonly type = GET_AVAILABLE_MATCHES;

  constructor(public payload: Match[]) {}
}

export class GetSelectedSeasonMatches implements Action {
  readonly type = GET_SELECTED_SEASON_MATCHES;

  constructor(public payload: Match[]) {}
}

export class SelectedMatch implements Action {
  readonly type = SELECTED_MATCH;

  constructor(public payload: string) {}
}

export class SetSeason implements Action {
  readonly type = SET_SEASON;

  constructor(public payload: string) {}
}

export type MatchActions =
  | GetAvailableMatches
  | GetSelectedSeasonMatches
  | SelectedMatch
  | SetSeason;
