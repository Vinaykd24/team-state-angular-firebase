import { Action, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { MatchDetails } from "src/app/models/match-details.model";
import {
  MatchDetailsActions,
  GET_AVAILABLE_MATCH_DETAILS,
  GET_SELECTED_PLAYER_PERFORMANCE
} from "./match-details.actions";

export interface State {
  availableMatchDetails: MatchDetails[];
  selectedPlayerPerformance: MatchDetails[];
}

const initialState: State = {
  availableMatchDetails: [],
  selectedPlayerPerformance: []
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
    case GET_SELECTED_PLAYER_PERFORMANCE:
      return {
        ...state,
        selectedlayer: {
          ...state.availableMatchDetails.filter(
            matDtls => matDtls.playerId === action.payload
          )
        }
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

export const getSelectedPlayerPerformance = createSelector(
  getMatchDetailsState,
  (state: State) => state.selectedPlayerPerformance
);
