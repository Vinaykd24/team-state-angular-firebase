import { Action } from "@ngrx/store";
import { Match } from "src/app/models/match.model";

export const GET_AVAILABLE_MATCHES = "[Matches] Get Available Matches";

export class GetAvailableMatches implements Action {
  readonly type = GET_AVAILABLE_MATCHES;

  constructor(public payload: Match[]) {}
}

export type MatchActions = GetAvailableMatches;
