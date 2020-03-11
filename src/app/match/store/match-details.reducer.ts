import { Action, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { MatchDetails } from "src/app/models/match-details.model";
import {
  MatchDetailsActions,
  GET_AVAILABLE_MATCH_DETAILS
} from "./match-details.actions";

export interface State {
  availableMatchDetails: MatchDetails[];
}

const initialState: State = {
  availableMatchDetails: []
};

export function matchDetailsReducer(
  state = initialState,
  action: MatchDetailsActions
) {
  switch (action.type) {
    case GET_AVAILABLE_MATCH_DETAILS:
      return {
        ...state,
        availableMatchDetails: action.payload
      };
    default: {
      return state;
    }
  }
}

export const getMatchDetailsState = createFeatureSelector<State>(
  "matchDetails"
);

export const getAvailableMatchDetails = createSelector(
  getMatchDetailsState,
  (state: State) => state.availableMatchDetails
);
