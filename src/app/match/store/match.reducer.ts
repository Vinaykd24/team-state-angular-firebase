import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

import {
  MatchActions,
  GET_AVAILABLE_MATCHES,
  GET_SELECTED_SEASON_MATCHES,
  SELECTED_MATCH,
  SET_SEASON,
  GET_TEAM_DETAILS,
  SET_IS_MATCHES_PLAYED,
} from "./match.actions";
import * as fromRoot from "../../app.reducer";
import { Match } from "src/app/models/match.model";
import { TeamDetail } from "src/app/models/team.model";

export interface State {
  availableMatches: Match[];
  selectedSeasonMatches: Match[];
  selectedMatch: Match;
  setSeason: string;
  teamDetails: TeamDetail;
  isMatchesPlayed: boolean;
}

const initialState: State = {
  availableMatches: [],
  selectedSeasonMatches: [],
  selectedMatch: null,
  setSeason: null,
  teamDetails: null,
  isMatchesPlayed: false,
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
    case GET_TEAM_DETAILS:
      return {
        ...state,
        teamDetails: action.payload,
      };
    case SET_IS_MATCHES_PLAYED:
      return {
        ...state,
        isMatchesPlayed: action.payload,
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

export const getIsMatchesPlayed = createSelector(
  getMatchState,
  (state: State) => {
    if (state.availableMatches.length > 0) {
      return true;
    } else {
      return false;
    }
    state.isMatchesPlayed;
  }
);
