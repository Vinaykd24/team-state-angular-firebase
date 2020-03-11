import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

import { MatchActions, GET_AVAILABLE_MATCHES } from "./match.actions";
import * as fromRoot from "../../app.reducer";
import { Match } from "src/app/models/match.model";

export interface State {
  availableMatches: Match[];
}

const initialState: State = {
  availableMatches: []
};

export function matchReducer(state = initialState, action: MatchActions) {
  switch (action.type) {
    case GET_AVAILABLE_MATCHES:
      return {
        ...state,
        availableMatches: action.payload
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
