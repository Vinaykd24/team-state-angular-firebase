import { Action, createFeatureSelector, createSelector } from "@ngrx/store";
import * as _ from "lodash";

import {
  PlayerActions,
  GET_AVAILABLE_PLAYERS,
  GET_SELECTED_PLAYERS,
  GET_TOP_BATSMAN,
  GET_ALL_PLAYERS,
} from "./player.actions";
import * as fromRoot from "../../app.reducer";
import { TopPlayer } from "src/app/models/top-player.model";
import { Player } from "src/app/models/player.model";

export interface State {
  availablePlayers: TopPlayer[];
  selectedlayer: TopPlayer;
  topBatsmanList: TopPlayer[];
  allPlayers: Player[];
}

const initialState: State = {
  availablePlayers: [],
  selectedlayer: null,
  topBatsmanList: [],
  allPlayers: [],
};

export function playerReducer(state = initialState, action: PlayerActions) {
  switch (action.type) {
    case GET_AVAILABLE_PLAYERS:
      return {
        ...state,
        availablePlayers: action.payload,
      };
    case GET_ALL_PLAYERS:
      return {
        ...state,
        allPlayers: action.payload,
      };
    case GET_TOP_BATSMAN:
      return {
        ...state,
        topBatsmanList: action.payload,
      };
    case GET_SELECTED_PLAYERS:
      return {
        ...state,
        selectedlayer: {
          ...state.availablePlayers.find(
            (player) => player.player.id === action.payload
          ),
        },
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
export const getAllPlayers = createSelector(getPlayerState, (state: State) => {
  console.log(state.allPlayers);
  if (state.allPlayers.length > 0) {
    return state.allPlayers.sort((a, b) => {
      if (a?.isCaptain) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  return state.allPlayers;
});
export const getTopBatsmanList = createSelector(
  getPlayerState,
  (state: State) => state.topBatsmanList
);
export const getSelectedPlayer = createSelector(
  getPlayerState,
  (state: State) => state.selectedlayer
);

export const getAllPlayersGroupByBattingStyle = createSelector(
  getPlayerState,
  (state: State) => {
    if (state.allPlayers.length > 0) {
      return _.groupBy(state.allPlayers, "playerRole");
    } else {
      return state.allPlayers;
    }
  }
);
