import { Action, createAction, props } from "@ngrx/store";
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

export const loadMatchDetails = createAction(
  "[MatchDetails Resolver] Load All Match Details"
);

export const allMatchDetailsLoaded = createAction(
  "[Load MatchDetails Effect] All Match Details Loaded",
  props<{ matchDetails: MatchDetails[] }>()
);
