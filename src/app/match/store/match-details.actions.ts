import { Action } from "@ngrx/store";
import { MatchDetails } from "src/app/models/match-details.model";

export const GET_AVAILABLE_MATCH_DETAILS =
  "[MatchDetails] Get Available MatchDetails";

export const GET_SINGLE_MATCH_DETAILS =
  "[MatchDetails] Get Single MatchDetails";

export class GetAvailableMatchDetails implements Action {
  readonly type = GET_AVAILABLE_MATCH_DETAILS;

  constructor(public payload: MatchDetails[]) {}
}

export class GetSingleMatchDetails implements Action {
  readonly type = GET_AVAILABLE_MATCH_DETAILS;

  constructor(public payload: MatchDetails[]) {}
}

export type MatchDetailsActions =
  | GetAvailableMatchDetails
  | GetSingleMatchDetails;
