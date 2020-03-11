import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

import { PlayerActions, GET_AVAILABLE_PLAYERS } from "./player.actions";
import * as fromRoot from "../../app.reducer";
import { TopPlayer } from "src/app/models/top-player.model";

export interface State {
  availablePlayers: TopPlayer[];
}

const initialState: State = {
  availablePlayers: []
};

export function playerReducer(state = initialState, action: PlayerActions) {
  switch (action.type) {
    case GET_AVAILABLE_PLAYERS:
      return {
        ...state,
        availablePlayers: action.payload
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
