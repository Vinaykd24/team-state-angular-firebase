import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

import {
  MatchActions,
  GET_AVAILABLE_MATCHES,
  GET_SELECTED_SEASON_MATCHES,
  SELECTED_MATCH,
  SET_SEASON,
} from "./match.actions";
import * as fromRoot from "../../app.reducer";
import { Match } from "src/app/models/match.model";

export interface State {
  availableMatches: Match[];
  selectedSeasonMatches: Match[];
  selectedMatch: Match;
  setSeason: string;
}

const initialState: State = {
  availableMatches: [],
  selectedSeasonMatches: [],
  selectedMatch: null,
  setSeason: null,
};

export function matchReducer(state = initialState, action: MatchActions) {
  switch (action.type) {
    case GET_AVAILABLE_MATCHES:
      return {
        ...state,
        availableMatches: action.payload,
      };
    case GET_SELECTED_SEASON_MATCHES:
      return {
        ...state,
        selectedSeasonMatches: action.payload,
      };
    case SELECTED_MATCH:
      return {
        ...state,
        selectedMatch: {
          ...state.availableMatches.find(
            (match) => match.id === action.payload
          ),
        },
      };
    case SET_SEASON:
      return {
        ...state,
        setSeason: action.payload,
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

export const getSelectedSeasonMatches = createSelector(
  getMatchState,
  (state: State) => state.selectedSeasonMatches
);

export const getSelectedMatch = createSelector(
  getMatchState,
  (state: State) => state.selectedMatch
);

export const getSelectedSeason = createSelector(
  getMatchState,
  (state: State) => state.setSeason
);
