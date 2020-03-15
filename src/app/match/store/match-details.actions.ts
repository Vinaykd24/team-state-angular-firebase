import { Action, createAction, props } from "@ngrx/store";
import { MatchDetails } from "src/app/models/match-details.model";

export const GET_AVAILABLE_MATCH_DETAILS =
  "[MatchDetails] Get Available MatchDetails";

export const GET_SINGLE_MATCH_DETAILS =
  "[MatchDetails] Get Single MatchDetails";

export const GET_SELECTED_PLAYER_PERFORMANCE =
  "[Players] Get Selected Player Performance";

export class GetAvailableMatchDetails implements Action {
  readonly type = GET_AVAILABLE_MATCH_DETAILS;

  constructor(public payload: MatchDetails[]) {}
}

export class GetSingleMatchDetails implements Action {
  readonly type = GET_AVAILABLE_MATCH_DETAILS;

  constructor(public payload: MatchDetails[]) {}
}

export class GetSelectedPlayerPerformance implements Action {
  readonly type = GET_SELECTED_PLAYER_PERFORMANCE;

  constructor(public payload: string) {}
}

export type MatchDetailsActions =
  | GetAvailableMatchDetails
  | GetSingleMatchDetails
  | GetSelectedPlayerPerformance;
