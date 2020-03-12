import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

import {
  MatchActions,
  GET_AVAILABLE_MATCHES,
  SELECTED_MATCH
} from "./match.actions";
import * as fromRoot from "../../app.reducer";
import { Match } from "src/app/models/match.model";

export interface State {
  availableMatches: Match[];
  selectedMatch: Match;
}

const initialState: State = {
  availableMatches: [],
  selectedMatch: null
};

export function matchReducer(state = initialState, action: MatchActions) {
  switch (action.type) {
    case GET_AVAILABLE_MATCHES:
      return {
        ...state,
        availableMatches: action.payload
      };
    case SELECTED_MATCH:
      return {
        ...state,
        selectedMatch: {
          ...state.availableMatches.find(match => match.id === action.payload)
        }
      };
    default: {
      return state;
    }
  }
}

export const getMatchState = createFeatureSelector<State>("matches");

export const getAvailableMatches = createSelector(
  getMatchState,
  (state: State) => state.availableMatches
);

export const getSelectedMatch = createSelector(
  getMatchState,
  (state: State) => state.selectedMatch
);
