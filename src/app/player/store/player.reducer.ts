import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

import {
  PlayerActions,
  GET_AVAILABLE_PLAYERS,
  GET_SELECTED_PLAYERS,
  GET_TOP_BATSMAN
} from "./player.actions";
import * as fromRoot from "../../app.reducer";
import { TopPlayer } from "src/app/models/top-player.model";

export interface State {
  availablePlayers: TopPlayer[];
  selectedlayer: TopPlayer;
  topBatsmanList: TopPlayer[];
}

const initialState: State = {
  availablePlayers: [],
  selectedlayer: null,
  topBatsmanList: []
};

export function playerReducer(state = initialState, action: PlayerActions) {
  switch (action.type) {
    case GET_AVAILABLE_PLAYERS:
      return {
        ...state,
        availablePlayers: action.payload
      };
    case GET_TOP_BATSMAN:
      return {
        ...state,
        topBatsmanList: action.payload
      };
    case GET_SELECTED_PLAYERS:
      return {
        ...state,
        selectedlayer: {
          ...state.availablePlayers.find(
            player => player.player.id === action.payload
          )
        }
      };
    default: {
      return state;
    }
  }
}

export const getPlayerState = createFeatureSelector<State>("players");

export const getAvailablePlayers = createSelector(
  getPlayerState,
  (state: State) => state.availablePlayers
);
export const getTopBatsmanList = createSelector(
  getPlayerState,
  (state: State) => state.topBatsmanList
);
export const getSelectedPlayer = createSelector(
  getPlayerState,
  (state: State) => state.selectedlayer
);
